package db

import (
	"database/sql"
	"os"
	"path/filepath"
	"testing"
	"time"

	_ "modernc.org/sqlite"

	"ai-news-database/internal/article"
)

func TestDB_SaveAndGetArticle(t *testing.T) {
	// Use temp dir for test DB
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test.db")

	conn, err := newTestDB(dbPath)
	if err != nil {
		t.Fatalf("failed to create test db: %v", err)
	}
	defer conn.Close()

	db := &DB{conn: conn}

	now := time.Now()
	a := &article.Article{
		Title:       "Test Article",
		URL:         "https://example.com/test",
		Source:      "Test Source",
		SourceAlias: "test",
		Summary:     "This is a test summary",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
	}

	// Save
	if err := db.SaveArticle(a); err != nil {
		t.Fatalf("SaveArticle failed: %v", err)
	}

	// Get unread articles
	articles, err := db.GetArticles(article.StatusUnread, "", 10)
	if err != nil {
		t.Fatalf("GetArticles failed: %v", err)
	}
	if len(articles) != 1 {
		t.Fatalf("expected 1 article, got %d", len(articles))
	}

	got := articles[0]
	if got.Title != a.Title {
		t.Errorf("title mismatch: want %q, got %q", a.Title, got.Title)
	}
	if got.URL != a.URL {
		t.Errorf("url mismatch: want %q, got %q", a.URL, got.URL)
	}

	// Update status
	if err := db.UpdateStatus(got.ID, article.StatusRead); err != nil {
		t.Fatalf("UpdateStatus failed: %v", err)
	}

	readArts, err := db.GetArticles(article.StatusRead, "", 10)
	if err != nil {
		t.Fatalf("GetArticles after read failed: %v", err)
	}
	if len(readArts) != 1 {
		t.Fatalf("expected 1 read article, got %d", len(readArts))
	}
}

func TestDB_DuplicateURL(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test.db")

	conn, err := newTestDB(dbPath)
	if err != nil {
		t.Fatalf("failed to create test db: %v", err)
	}
	defer conn.Close()

	db := &DB{conn: conn}

	a1 := &article.Article{
		Title:       "First",
		URL:         "https://example.com/dup",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   time.Now(),
		ReadStatus:  article.StatusUnread,
	}
	a2 := &article.Article{
		Title:       "Second",
		URL:         "https://example.com/dup",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   time.Now(),
		ReadStatus:  article.StatusUnread,
	}

	if err := db.SaveArticle(a1); err != nil {
		t.Fatalf("first SaveArticle failed: %v", err)
	}
	// Second save with same URL should update instead of error
	if err := db.SaveArticle(a2); err != nil {
		t.Fatalf("second SaveArticle should update, got error: %v", err)
	}

	arts, err := db.GetArticles("", "", 10)
	if err != nil {
		t.Fatalf("GetArticles failed: %v", err)
	}
	if len(arts) != 1 {
		t.Fatalf("expected 1 article after dedup, got %d", len(arts))
	}
	if arts[0].Title != "Second" {
		t.Errorf("expected updated title 'Second', got %q", arts[0].Title)
	}
}

func TestDB_SearchArticles(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test.db")

	conn, err := newTestDB(dbPath)
	if err != nil {
		t.Fatalf("failed to create test db: %v", err)
	}
	defer conn.Close()

	db := &DB{conn: conn}

	db.SaveArticle(&article.Article{
		Title:       "Golang Best Practices",
		URL:         "https://example.com/go",
		Source:      "Go Blog",
		SourceAlias: "go",
		Summary:     "Tips for writing great Go code",
		FetchedAt:   time.Now(),
		ReadStatus:  article.StatusUnread,
	})
	db.SaveArticle(&article.Article{
		Title:       "Rust Memory Safety",
		URL:         "https://example.com/rust",
		Source:      "Rust Blog",
		SourceAlias: "rust",
		Summary:     "Understanding ownership in Rust",
		FetchedAt:   time.Now(),
		ReadStatus:  article.StatusUnread,
	})

	results, err := db.SearchArticles("Golang", 10)
	if err != nil {
		t.Fatalf("SearchArticles failed: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("expected 1 search result, got %d", len(results))
	}
	if results[0].Title != "Golang Best Practices" {
		t.Errorf("unexpected search result: %q", results[0].Title)
	}
}

func TestDB_NoteAndTag(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test.db")

	conn, err := newTestDB(dbPath)
	if err != nil {
		t.Fatalf("failed to create test db: %v", err)
	}
	defer conn.Close()

	db := &DB{conn: conn}

	a := &article.Article{
		Title:       "Note Test",
		URL:         "https://example.com/note",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   time.Now(),
		ReadStatus:  article.StatusUnread,
	}
	if err := db.SaveArticle(a); err != nil {
		t.Fatalf("SaveArticle failed: %v", err)
	}

	arts, _ := db.GetArticles("", "", 10)
	id := arts[0].ID

	if err := db.AddNote(id, "my note"); err != nil {
		t.Fatalf("AddNote failed: %v", err)
	}
	if err := db.AddTags(id, "tag1,tag2"); err != nil {
		t.Fatalf("AddTags failed: %v", err)
	}

	arts, _ = db.GetArticles("", "", 10)
	got := arts[0]
	if got.Note != "my note" {
		t.Errorf("note mismatch: want %q, got %q", "my note", got.Note)
	}
	if got.Tags != "tag1,tag2" {
		t.Errorf("tags mismatch: want %q, got %q", "tag1,tag2", got.Tags)
	}
}

// newTestDB creates a fresh sqlite connection and runs migration
func newTestDB(path string) (*sql.DB, error) {
	_ = os.MkdirAll(filepath.Dir(path), 0755)
	conn, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	d := &DB{conn: conn}
	if err := d.migrate(); err != nil {
		conn.Close()
		return nil, err
	}
	return conn, nil
}
