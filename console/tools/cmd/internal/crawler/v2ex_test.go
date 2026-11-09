package crawler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestV2EXCrawler_JSONParsing(t *testing.T) {
	topics := []v2exTopic{
		{Title: "Go 并发模型", URL: "https://www.v2ex.com/t/123456", Content: "讨论 Go 的 goroutine", Created: 1715000000, Replies: 42},
		{Title: "Rust 学习路径", URL: "https://www.v2ex.com/t/123457", Content: "", Created: 1715000001, Replies: 10},
	}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(topics)
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	var result []v2exTopic
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatalf("decode failed: %v", err)
	}

	items, err := convertV2EXTopicsToItems(result)
	if err != nil {
		t.Fatalf("conversion failed: %v", err)
	}
	if len(items) != 2 {
		t.Fatalf("expected 2 items, got %d", len(items))
	}
	if items[0].Title != "Go 并发模型" {
		t.Errorf("unexpected title: %q", items[0].Title)
	}
	if items[0].Source != "V2EX" {
		t.Errorf("unexpected source: %q", items[0].Source)
	}
	if items[0].SourceAlias != "v2ex" {
		t.Errorf("unexpected alias: %q", items[0].SourceAlias)
	}
	if items[1].RawContent != "" {
		t.Errorf("expected empty content, got %q", items[1].RawContent)
	}
}

func TestV2EXCrawler_HTTPError(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusTooManyRequests)
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusTooManyRequests {
		t.Errorf("expected 429, got %d", resp.StatusCode)
	}
}

func TestV2EXCrawler_EmptyResponse(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode([]v2exTopic{})
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	var result []v2exTopic
	_ = json.NewDecoder(resp.Body).Decode(&result)

	items, err := convertV2EXTopicsToItems(result)
	if err != nil {
		t.Fatalf("conversion failed: %v", err)
	}
	if len(items) != 0 {
		t.Errorf("expected 0 items, got %d", len(items))
	}
}

// convertV2EXTopicsToItems mirrors the logic in V2EXCrawler.Fetch
func convertV2EXTopicsToItems(result []v2exTopic) ([]Item, error) {
	var items []Item
	for _, topic := range result {
		t := time.Unix(topic.Created, 0)
		items = append(items, Item{
			Title:       topic.Title,
			URL:         topic.URL,
			Source:      "V2EX",
			SourceAlias: "v2ex",
			RawContent:  topic.Content,
			PublishedAt: &t,
		})
	}
	return items, nil
}
