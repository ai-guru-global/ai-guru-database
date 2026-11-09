package rag

import (
	"testing"

	"ai-news-database/internal/config"
	"ai-news-database/internal/mocks"
)

func TestRAG_NewWithDeps(t *testing.T) {
	mockLLM := &mocks.LLMClientMock{}
	cfg := &config.LLMConfig{AskMaxTokens: 4000}

	// NewWithDeps should work with mocks (db is nil but that's ok for struct creation)
	r := NewWithDeps(nil, cfg, mockLLM)
	if r == nil {
		t.Error("NewWithDeps returned nil")
	}
}

func TestRAG_New(t *testing.T) {
	// New should work without panicking
	r := New(nil, &config.LLMConfig{})
	if r == nil {
		t.Error("New returned nil")
	}
}

func TestSourceRef(t *testing.T) {
	// Test SourceRef struct
	ref := SourceRef{
		Index:  1,
		Title:  "Test Article",
		Source: "HN",
		URL:    "https://example.com",
	}
	if ref.Index != 1 {
		t.Errorf("Index = %d, want 1", ref.Index)
	}
	if ref.Title != "Test Article" {
		t.Errorf("Title = %q, want %q", ref.Title, "Test Article")
	}
}
