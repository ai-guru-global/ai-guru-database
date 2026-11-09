package dedup

import (
	"testing"

	"ai-news-database/internal/article"
	"ai-news-database/internal/config"
)

func TestSimilarity(t *testing.T) {
	tests := []struct {
		a    string
		b    string
		want float64
	}{
		{"hello world", "hello world", 1.0},
		{"abc", "xyz", 0.0},
		{"", "abc", 0.0},
		{"a", "ab", 0.0}, // too short returns 0
	}

	for _, tt := range tests {
		got := similarity(tt.a, tt.b)
		if got != tt.want {
			t.Errorf("similarity(%q, %q) = %v, want %v", tt.a, tt.b, got, tt.want)
		}
	}
}

func TestSplitTags(t *testing.T) {
	tags := splitTags("go, rust,  ai ")
	expected := map[string]bool{"go": true, "rust": true, "ai": true}
	if len(tags) != len(expected) {
		t.Errorf("expected %d tags, got %d", len(expected), len(tags))
	}
	for k := range expected {
		if !tags[k] {
			t.Errorf("expected tag %q to be present", k)
		}
	}
}

func TestRunDedup(t *testing.T) {
	candidates := []article.Article{
		{ID: 1, Title: "Go 并发模式", URL: "https://a.com", QualityScore: 8.0, LLMTags: "go, concurrency"},
		{ID: 2, Title: "Go 并发模式详解", URL: "https://b.com", QualityScore: 7.0, LLMTags: "go, concurrency, patterns"},
		{ID: 3, Title: "Rust 内存安全", URL: "https://c.com", QualityScore: 9.0, LLMTags: "rust, memory"},
	}

	cfg := &config.LLMConfig{}
	d := New(nil, cfg)
	dupIDs, err := d.RunDedup(candidates)
	if err != nil {
		t.Fatalf("RunDedup failed: %v", err)
	}

	// Articles 1 and 2 should be detected as duplicates (title similarity > 0.85)
	if len(dupIDs) != 1 {
		t.Errorf("expected 1 duplicate, got %d", len(dupIDs))
	}

	// Lower quality article should be discarded
	if dupIDs[0] != 2 {
		t.Errorf("expected article 2 to be duplicate, got %v", dupIDs)
	}
}
