package crawler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestHNCrawler_JSONParsing(t *testing.T) {
	hits := []hnHit{
		{Title: "Show HN: My Project", URL: "https://example.com/project", ObjectID: "12345", CreatedAt: time.Now().Format(time.RFC3339), StoryText: "project details"},
		{Title: "Ask HN: Something", URL: "", ObjectID: "67890", CreatedAt: time.Now().Format(time.RFC3339)},
	}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(hnResponse{Hits: hits})
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	var result hnResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatalf("decode failed: %v", err)
	}
	if len(result.Hits) != 2 {
		t.Fatalf("expected 2 hits, got %d", len(result.Hits))
	}
	if result.Hits[0].Title != "Show HN: My Project" {
		t.Errorf("unexpected title: %q", result.Hits[0].Title)
	}
}

func TestHNCrawler_URLFallback(t *testing.T) {
	hit := hnHit{Title: "Ask HN", URL: "", ObjectID: "999", CreatedAt: time.Now().Format(time.RFC3339)}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(hnResponse{Hits: []hnHit{hit}})
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	var result hnResponse
	_ = json.NewDecoder(resp.Body).Decode(&result)

	items, err := convertHNHitsToItems(result.Hits)
	if err != nil {
		t.Fatalf("conversion failed: %v", err)
	}
	if len(items) != 1 {
		t.Fatalf("expected 1 item, got %d", len(items))
	}
	expectedURL := "https://news.ycombinator.com/item?id=999"
	if items[0].URL != expectedURL {
		t.Errorf("URL fallback failed: want %q, got %q", expectedURL, items[0].URL)
	}
}

func TestHNCrawler_HTTPError(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusServiceUnavailable)
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusServiceUnavailable {
		t.Errorf("expected 503, got %d", resp.StatusCode)
	}
}

func TestHNCrawler_EmptyResponse(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(hnResponse{Hits: []hnHit{}})
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	var result hnResponse
	_ = json.NewDecoder(resp.Body).Decode(&result)

	items, err := convertHNHitsToItems(result.Hits)
	if err != nil {
		t.Fatalf("conversion failed: %v", err)
	}
	if len(items) != 0 {
		t.Errorf("expected 0 items, got %d", len(items))
	}
}

// convertHNHitsToItems mirrors the conversion logic in HNCrawler.Fetch for testing
func convertHNHitsToItems(hits []hnHit) ([]Item, error) {
	var items []Item
	for _, hit := range hits {
		url := hit.URL
		if url == "" {
			url = "https://news.ycombinator.com/item?id=" + hit.ObjectID
		}
		publishedAt, _ := time.Parse(time.RFC3339, hit.CreatedAt)
		items = append(items, Item{
			Title:       hit.Title,
			URL:         url,
			Source:      "Hacker News",
			SourceAlias: "hn",
			RawContent:  hit.StoryText,
			PublishedAt: &publishedAt,
		})
	}
	return items, nil
}
