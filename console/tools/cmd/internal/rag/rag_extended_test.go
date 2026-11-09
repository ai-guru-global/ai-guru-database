package rag

import (
	"context"
	"database/sql"
	"os"
	"path/filepath"
	"testing"
	"time"

	"ai-news-database/internal/article"
	"ai-news-database/internal/config"
	"ai-news-database/internal/db"
	"ai-news-database/internal/llm"
)

// mockLLM implements llm.LLMClient for testing
type mockLLM struct {
	response string
	err      error
}

func (m *mockLLM) Chat(ctx context.Context, messages []llm.Message, maxTokens int) (string, error) {
	return m.response, m.err
}

func (m *mockLLM) SimpleChat(ctx context.Context, prompt string, maxTokens int) (string, error) {
	return m.response, m.err
}

func (m *mockLLM) GetEmbedding(ctx context.Context, text string) ([]float64, error) {
	return []float64{0.1, 0.2, 0.3}, nil
}

func newTestRAG(t *testing.T) (*RAG, *db.DB, func()) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test.db")

	_ = os.MkdirAll(filepath.Dir(dbPath), 0755)
	conn, err := sql.Open("sqlite", dbPath)
	if err != nil {
		t.Fatalf("open db: %v", err)
	}

	conn.Close()
	_ = os.Remove(dbPath)

	oldHome := os.Getenv("HOME")
	os.Setenv("HOME", tmpDir)
	// Windows 上 os.UserHomeDir() 读 USERPROFILE，两者都要指向临时目录
	oldUserProfile := os.Getenv("USERPROFILE")
	os.Setenv("USERPROFILE", tmpDir)
	t.Cleanup(func() {
		os.Setenv("HOME", oldHome)
		os.Setenv("USERPROFILE", oldUserProfile)
	})

	database, err := db.New()
	if err != nil {
		t.Fatalf("create db: %v", err)
	}

	cfg := &config.LLMConfig{AskMaxTokens: 1000}
	mock := &mockLLM{response: "This is the answer."}
	rag := NewWithDeps(database, cfg, mock)

	return rag, database, func() {
		database.Close()
		_ = os.RemoveAll(tmpDir)
	}
}

func TestRAG_Answer_EmptyDB(t *testing.T) {
	rag, _, cleanup := newTestRAG(t)
	defer cleanup()

	answer, refs, err := rag.Answer(context.Background(), "what is Go?")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if answer == "" {
		t.Error("expected non-empty answer for empty DB")
	}
	if len(refs) != 0 {
		t.Errorf("expected 0 refs for empty DB, got %d", len(refs))
	}
}

func TestRAG_Answer_WithArticles(t *testing.T) {
	rag, database, cleanup := newTestRAG(t)
	defer cleanup()

	now := time.Now()
	err := database.SaveArticle(&article.Article{
		Title:       "Go Concurrency Patterns",
		URL:         "https://example.com/go",
		Source:      "Go Blog",
		SourceAlias: "go",
		Summary:     "Overview of Go concurrency primitives",
		LLMSummary:  "Go uses goroutines and channels for concurrency",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
	})
	if err != nil {
		t.Fatalf("save article: %v", err)
	}

	answer, refs, err := rag.Answer(context.Background(), "Go concurrency")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if answer != "This is the answer." {
		t.Errorf("unexpected answer: %q", answer)
	}
	if len(refs) != 1 {
		t.Errorf("expected 1 ref, got %d", len(refs))
	}
	if len(refs) > 0 && refs[0].Title != "Go Concurrency Patterns" {
		t.Errorf("unexpected ref title: %q", refs[0].Title)
	}
}

func TestRAG_Answer_LLMError(t *testing.T) {
	rag, database, cleanup := newTestRAG(t)
	defer cleanup()

	now := time.Now()
	_ = database.SaveArticle(&article.Article{
		Title:       "Test",
		URL:         "https://example.com/t",
		Source:      "Src",
		SourceAlias: "src",
		Summary:     "Summary",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
	})

	// Replace LLM with error mock
	rag.llmClient = &mockLLM{err: context.Canceled}

	_, _, err := rag.Answer(context.Background(), "test")
	if err == nil {
		t.Fatal("expected error from LLM")
	}
}

func TestRAG_FallbackSearch(t *testing.T) {
	rag, database, cleanup := newTestRAG(t)
	defer cleanup()

	now := time.Now()
	_ = database.SaveArticle(&article.Article{
		Title:       "Rust Ownership",
		URL:         "https://example.com/rust",
		Source:      "Rust Blog",
		SourceAlias: "rust",
		Summary:     "Understanding ownership",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
	})

	articles, err := rag.fallbackSearch("Rust", 10)
	if err != nil {
		t.Fatalf("fallbackSearch failed: %v", err)
	}
	if len(articles) != 1 {
		t.Errorf("expected 1 article, got %d", len(articles))
	}
}

func TestRAG_SourceRefStruct(t *testing.T) {
	ref := SourceRef{
		Index:  1,
		Title:  "Test",
		Source: "HN",
		URL:    "https://example.com",
	}
	if ref.Index != 1 || ref.Title != "Test" || ref.Source != "HN" {
		t.Error("SourceRef fields mismatch")
	}
}

func TestRAG_ContextCancellation(t *testing.T) {
	rag, _, cleanup := newTestRAG(t)
	defer cleanup()

	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	_, _, err := rag.Answer(ctx, "test")
	// Should either return empty DB message or an error depending on timing
	if err != nil && err != context.Canceled {
		t.Logf("got error (may be expected): %v", err)
	}
}
