package curator

import (
	"testing"
	"time"

	"ai-news-database/internal/article"
)

func TestCalculateScore(t *testing.T) {
	tests := []struct {
		name         string
		a            article.Article
		prefs        map[string]int
		wantMinScore float64
	}{
		{
			name: "base quality score",
			a: article.Article{
				QualityScore: 7.0,
				EnrichedAt:   &time.Time{},
			},
			prefs:        map[string]int{},
			wantMinScore: 7.0,
		},
		{
			name: "preference bonus",
			a: article.Article{
				QualityScore: 7.0,
				LLMTags:      "golang,testing",
				EnrichedAt:   &time.Time{},
			},
			prefs:        map[string]int{"golang": 2, "rust": 1},
			wantMinScore: 8.0, // 7.0 + 2*0.5 = 8.0
		},
		{
			name: "unenriched penalty",
			a: article.Article{
				QualityScore: 7.0,
				EnrichedAt:   nil,
			},
			prefs:        map[string]int{},
			wantMinScore: 6.0, // 7.0 - 1.0 = 6.0
		},
		{
			name: "multiple tag matches",
			a: article.Article{
				QualityScore: 6.0,
				LLMTags:      "golang,rust,ai",
				EnrichedAt:   &time.Time{},
			},
			prefs:        map[string]int{"golang": 1, "rust": 1, "ai": 1},
			wantMinScore: 7.5, // 6.0 + 1*0.5 + 1*0.5 + 1*0.5 = 7.5
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			score := calculateScore(tt.a, tt.prefs)
			if score < tt.wantMinScore {
				t.Errorf("calculateScore() = %f, want >= %f", score, tt.wantMinScore)
			}
		})
	}
}

func TestGenerateReason(t *testing.T) {
	tests := []struct {
		name       string
		a          article.Article
		score      float64
		prefs      map[string]int
		wantReason string
	}{
		{
			name: "high quality",
			a: article.Article{
				QualityScore: 8.5,
				SourceAlias:  "hn",
			},
			score:      8.5,
			prefs:      map[string]int{},
			wantReason: "高质量技术文章",
		},
		{
			name: "matches preference",
			a: article.Article{
				QualityScore: 6.0,
				SourceAlias:  "generic",
			},
			score:      8.0,
			prefs:      map[string]int{"golang": 2},
			wantReason: "匹配你的阅读偏好",
		},
		{
			name: "hn source",
			a: article.Article{
				QualityScore: 6.0,
				SourceAlias:  "hn",
			},
			score:      6.0,
			prefs:      map[string]int{},
			wantReason: "HN 热门讨论",
		},
		{
			name: "default reason",
			a: article.Article{
				QualityScore: 5.0,
				SourceAlias:  "reddit",
			},
			score:      5.0,
			prefs:      map[string]int{},
			wantReason: "值得一看",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			reason := generateReason(tt.a, tt.score, tt.prefs)
			if reason != tt.wantReason {
				t.Errorf("generateReason() = %q, want %q", reason, tt.wantReason)
			}
		})
	}
}

func TestCurator_New(t *testing.T) {
	// Test that New creates a Curator with the given DB
	// This is a simple instantiation test
	c := New(nil)
	if c == nil {
		t.Error("New returned nil")
	}
}
