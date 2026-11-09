package db

import (
	"database/sql"
	"os"
	"path/filepath"
	"testing"
	"time"

	"ai-news-database/internal/article"
	_ "modernc.org/sqlite"
)

func newTestDBExtended(t *testing.T) *DB {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "test.db")
	_ = os.MkdirAll(filepath.Dir(dbPath), 0755)
	conn, err := sql.Open("sqlite", dbPath)
	if err != nil {
		t.Fatalf("open db: %v", err)
	}
	t.Cleanup(func() { conn.Close() })

	d := &DB{conn: conn}
	if err := d.migrate(); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	return d
}

func TestDB_ArticleExists(t *testing.T) {
	db := newTestDBExtended(t)

	now := time.Now()
	a := &article.Article{
		Title:       "Exists Test",
		URL:         "https://example.com/exists",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
	}

	if db.ArticleExists(a.URL) {
		t.Error("expected not exists before save")
	}

	if err := db.SaveArticle(a); err != nil {
		t.Fatalf("save: %v", err)
	}

	if !db.ArticleExists(a.URL) {
		t.Error("expected exists after save")
	}

	if db.ArticleExists("https://example.com/not-found") {
		t.Error("expected not exists for unknown URL")
	}
}

func TestDB_GetUnenrichedArticles(t *testing.T) {
	db := newTestDBExtended(t)
	now := time.Now()

	err := db.SaveArticle(&article.Article{
		Title:       "Unenriched",
		URL:         "https://example.com/u1",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
	})
	if err != nil {
		t.Fatalf("save: %v", err)
	}

	err = db.SaveArticle(&article.Article{
		Title:       "Enriched",
		URL:         "https://example.com/u2",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   now.Add(time.Second),
		ReadStatus:  article.StatusUnread,
	})
	if err != nil {
		t.Fatalf("save: %v", err)
	}

	// Find the enriched article by URL and mark it enriched
	arts, _ := db.GetArticles("", "", 10)
	var enrichedID int64
	for _, a := range arts {
		if a.URL == "https://example.com/u2" {
			enrichedID = a.ID
			break
		}
	}
	if enrichedID == 0 {
		t.Fatal("could not find enriched article")
	}
	err = db.UpdateEnrichment(enrichedID, "summary", "tags", "en", 8.5)
	if err != nil {
		t.Fatalf("update enrichment: %v", err)
	}

	unenriched, err := db.GetUnenrichedArticles(10)
	if err != nil {
		t.Fatalf("GetUnenrichedArticles: %v", err)
	}
	if len(unenriched) != 1 {
		t.Fatalf("expected 1 unenriched, got %d", len(unenriched))
	}
	if unenriched[0].Title != "Unenriched" {
		t.Errorf("unexpected article: %q", unenriched[0].Title)
	}
}

func TestDB_SearchByKeyword(t *testing.T) {
	db := newTestDBExtended(t)
	now := time.Now()

	_ = db.SaveArticle(&article.Article{
		Title:       "Kubernetes Guide",
		URL:         "https://example.com/k8s",
		Source:      "Blog",
		SourceAlias: "blog",
		Summary:     "Intro to Kubernetes",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
	})
	_ = db.SaveArticle(&article.Article{
		Title:       "Docker Basics",
		URL:         "https://example.com/docker",
		Source:      "Blog",
		SourceAlias: "blog",
		Summary:     "Containers with Docker",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
	})

	results, err := db.SearchByKeyword("Kubernetes", 10)
	if err != nil {
		t.Fatalf("SearchByKeyword: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if results[0].Title != "Kubernetes Guide" {
		t.Errorf("unexpected result: %q", results[0].Title)
	}

	// Search by summary content
	results, err = db.SearchByKeyword("Containers", 10)
	if err != nil {
		t.Fatalf("SearchByKeyword: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
}

func TestDB_Stats(t *testing.T) {
	db := newTestDBExtended(t)
	now := time.Now()

	_ = db.SaveArticle(&article.Article{
		Title: "A1", URL: "https://e.com/1",
		Source: "Src1", SourceAlias: "src1",
		FetchedAt: now, ReadStatus: article.StatusUnread,
	})
	_ = db.SaveArticle(&article.Article{
		Title: "A2", URL: "https://e.com/2",
		Source: "Src1", SourceAlias: "src1",
		FetchedAt: now, ReadStatus: article.StatusRead,
	})
	_ = db.SaveArticle(&article.Article{
		Title: "A3", URL: "https://e.com/3",
		Source: "Src2", SourceAlias: "src2",
		FetchedAt: now, ReadStatus: article.StatusStarred,
	})

	stats, err := db.Stats()
	if err != nil {
		t.Fatalf("Stats: %v", err)
	}
	if len(stats) != 2 {
		t.Fatalf("expected 2 sources, got %d", len(stats))
	}

	s1 := stats["src1"]
	if s1["total"].(int) != 2 {
		t.Errorf("src1 total: want 2, got %v", s1["total"])
	}
	if s1["unread"].(int) != 1 {
		t.Errorf("src1 unread: want 1, got %v", s1["unread"])
	}
	if s1["read"].(int) != 1 {
		t.Errorf("src1 read: want 1, got %v", s1["read"])
	}

	s2 := stats["src2"]
	if s2["starred"].(int) != 1 {
		t.Errorf("src2 starred: want 1, got %v", s2["starred"])
	}
	if s2["read_rate"].(float64) != 1.0 {
		t.Errorf("src2 read_rate: want 1.0, got %v", s2["read_rate"])
	}
}

func TestDB_DeleteArticlesByStatus(t *testing.T) {
	db := newTestDBExtended(t)
	now := time.Now()

	_ = db.SaveArticle(&article.Article{
		Title:       "Old Discarded",
		URL:         "https://e.com/old",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   now.AddDate(0, 0, -10),
		ReadStatus:  article.StatusDiscarded,
	})
	_ = db.SaveArticle(&article.Article{
		Title:       "Recent Discarded",
		URL:         "https://e.com/recent",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   now,
		ReadStatus:  article.StatusDiscarded,
	})

	err := db.DeleteArticlesByStatus(article.StatusDiscarded, 5)
	if err != nil {
		t.Fatalf("DeleteArticlesByStatus: %v", err)
	}

	arts, _ := db.GetArticles(article.StatusDiscarded, "", 10)
	if len(arts) != 1 {
		t.Fatalf("expected 1 remaining, got %d", len(arts))
	}
	if arts[0].Title != "Recent Discarded" {
		t.Errorf("unexpected remaining: %q", arts[0].Title)
	}
}

func TestDB_GetArticlesSorted(t *testing.T) {
	db := newTestDBExtended(t)
	now := time.Now()

	_ = db.SaveArticle(&article.Article{
		Title:       "Low Points",
		URL:         "https://e.com/low",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   now,
		ReadStatus:  article.StatusUnread,
		Points:      5,
	})
	_ = db.SaveArticle(&article.Article{
		Title:       "High Points",
		URL:         "https://e.com/high",
		Source:      "Src",
		SourceAlias: "src",
		FetchedAt:   now.Add(-time.Hour),
		ReadStatus:  article.StatusUnread,
		Points:      50,
	})

	// Sort by points descending
	arts, err := db.GetArticlesSorted(article.StatusUnread, "", 10, "points")
	if err != nil {
		t.Fatalf("GetArticlesSorted: %v", err)
	}
	if len(arts) != 2 {
		t.Fatalf("expected 2 articles, got %d", len(arts))
	}
	if arts[0].Title != "High Points" {
		t.Errorf("expected high points first, got %q", arts[0].Title)
	}

	// Sort by points ascending
	arts, err = db.GetArticlesSorted(article.StatusUnread, "", 10, "points_asc")
	if err != nil {
		t.Fatalf("GetArticlesSorted: %v", err)
	}
	if arts[0].Title != "Low Points" {
		t.Errorf("expected low points first, got %q", arts[0].Title)
	}
}

func TestDB_MarkAllRead(t *testing.T) {
	db := newTestDBExtended(t)
	now := time.Now()

	_ = db.SaveArticle(&article.Article{
		Title: "Unread1", URL: "https://e.com/1",
		Source: "S1", SourceAlias: "s1",
		FetchedAt: now, ReadStatus: article.StatusUnread,
	})
	_ = db.SaveArticle(&article.Article{
		Title: "Unread2", URL: "https://e.com/2",
		Source: "S1", SourceAlias: "s1",
		FetchedAt: now, ReadStatus: article.StatusUnread,
	})
	_ = db.SaveArticle(&article.Article{
		Title: "Unread3", URL: "https://e.com/3",
		Source: "S2", SourceAlias: "s2",
		FetchedAt: now, ReadStatus: article.StatusUnread,
	})

	// Mark all s1 as read
	n, err := db.MarkAllRead("s1")
	if err != nil {
		t.Fatalf("MarkAllRead: %v", err)
	}
	if n != 2 {
		t.Errorf("expected 2 affected, got %d", n)
	}

	// Mark all remaining unread as read
	n, err = db.MarkAllRead("")
	if err != nil {
		t.Fatalf("MarkAllRead: %v", err)
	}
	if n != 1 {
		t.Errorf("expected 1 affected, got %d", n)
	}

	unread, _ := db.GetArticles(article.StatusUnread, "", 10)
	if len(unread) != 0 {
		t.Errorf("expected 0 unread, got %d", len(unread))
	}
}

func TestDB_UpdateRawContent(t *testing.T) {
	db := newTestDBExtended(t)
	now := time.Now()

	_ = db.SaveArticle(&article.Article{
		Title: "Raw", URL: "https://e.com/raw",
		Source: "Src", SourceAlias: "src",
		FetchedAt: now, ReadStatus: article.StatusUnread,
	})

	arts, _ := db.GetArticles("", "", 10)
	id := arts[0].ID

	err := db.UpdateRawContent(id, "new raw content")
	if err != nil {
		t.Fatalf("UpdateRawContent: %v", err)
	}

	arts, _ = db.GetArticles("", "", 10)
	if arts[0].RawContent != "new raw content" {
		t.Errorf("raw content mismatch: want %q, got %q", "new raw content", arts[0].RawContent)
	}
}

func TestDB_BurstResult_CRUD(t *testing.T) {
	db := newTestDBExtended(t)

	id, err := db.SaveBurstResult("cross-domain", "ai", `["idea1","idea2"]`, 3)
	if err != nil {
		t.Fatalf("SaveBurstResult: %v", err)
	}
	if id == 0 {
		t.Error("expected non-zero id")
	}

	result, err := db.GetBurstResult(id)
	if err != nil {
		t.Fatalf("GetBurstResult: %v", err)
	}
	if result.Mode != "cross-domain" {
		t.Errorf("mode mismatch: want %q, got %q", "cross-domain", result.Mode)
	}
	if result.Focus != "ai" {
		t.Errorf("focus mismatch")
	}
	if result.BasedOn != 3 {
		t.Errorf("based_on mismatch: want 3, got %d", result.BasedOn)
	}

	results, err := db.GetBurstResults(10)
	if err != nil {
		t.Fatalf("GetBurstResults: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}

	err = db.DeleteBurstResult(id)
	if err != nil {
		t.Fatalf("DeleteBurstResult: %v", err)
	}

	_, err = db.GetBurstResult(id)
	if err == nil {
		t.Error("expected error after delete")
	}
}

func TestDB_BurstResult_Multiple(t *testing.T) {
	db := newTestDBExtended(t)

	for i := 0; i < 5; i++ {
		_, err := db.SaveBurstResult("mode", "", `[]`, 0)
		if err != nil {
			t.Fatalf("save %d: %v", i, err)
		}
	}

	results, err := db.GetBurstResults(3)
	if err != nil {
		t.Fatalf("GetBurstResults: %v", err)
	}
	if len(results) != 3 {
		t.Errorf("expected 3 results, got %d", len(results))
	}
}
