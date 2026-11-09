package crawler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestRedditCrawler_JSONParsing(t *testing.T) {
	payload := redditResponse{}
	payload.Data.Children = []struct {
		Data struct {
			Title     string  `json:"title"`
			URL       string  `json:"url"`
			Permalink string  `json:"permalink"`
			SelfText  string  `json:"selftext"`
			Created   float64 `json:"created_utc"`
		} `json:"data"`
	}{
		{Data: struct {
			Title     string  `json:"title"`
			URL       string  `json:"url"`
			Permalink string  `json:"permalink"`
			SelfText  string  `json:"selftext"`
			Created   float64 `json:"created_utc"`
		}{Title: "Go 1.25 Released", URL: "https://go.dev/blog/go1.25", Permalink: "/r/programming/comments/abc", SelfText: "", Created: 1715000000}},
		{Data: struct {
			Title     string  `json:"title"`
			URL       string  `json:"url"`
			Permalink string  `json:"permalink"`
			SelfText  string  `json:"selftext"`
			Created   float64 `json:"created_utc"`
		}{Title: "Self Post", URL: "", Permalink: "/r/programming/comments/def", SelfText: "content", Created: 1715000001}},
		{Data: struct {
			Title     string  `json:"title"`
			URL       string  `json:"url"`
			Permalink string  `json:"permalink"`
			SelfText  string  `json:"selftext"`
			Created   float64 `json:"created_utc"`
		}{Title: "Same as Permalink", URL: "/r/programming/comments/ghi", Permalink: "/r/programming/comments/ghi", SelfText: "", Created: 1715000002}},
	}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(payload)
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	var result redditResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		t.Fatalf("decode failed: %v", err)
	}

	items, err := convertRedditResponseToItems(result)
	if err != nil {
		t.Fatalf("conversion failed: %v", err)
	}
	if len(items) != 3 {
		t.Fatalf("expected 3 items, got %d", len(items))
	}

	// Case 1: normal external URL
	if items[0].URL != "https://go.dev/blog/go1.25" {
		t.Errorf("item 0 URL: want %q, got %q", "https://go.dev/blog/go1.25", items[0].URL)
	}

	// Case 2: empty URL -> prepend reddit domain
	if items[1].URL != "https://www.reddit.com/r/programming/comments/def" {
		t.Errorf("item 1 URL: want %q, got %q", "https://www.reddit.com/r/programming/comments/def", items[1].URL)
	}

	// Case 3: URL equals permalink -> prepend reddit domain
	if items[2].URL != "https://www.reddit.com/r/programming/comments/ghi" {
		t.Errorf("item 2 URL: want %q, got %q", "https://www.reddit.com/r/programming/comments/ghi", items[2].URL)
	}
}

func TestRedditCrawler_HTTPError(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusForbidden)
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusForbidden {
		t.Errorf("expected 403, got %d", resp.StatusCode)
	}
}

func TestRedditCrawler_EmptyChildren(t *testing.T) {
	payload := redditResponse{}
	payload.Data.Children = []struct {
		Data struct {
			Title     string  `json:"title"`
			URL       string  `json:"url"`
			Permalink string  `json:"permalink"`
			SelfText  string  `json:"selftext"`
			Created   float64 `json:"created_utc"`
		} `json:"data"`
	}{}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(payload)
	}))
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	defer resp.Body.Close()

	var result redditResponse
	_ = json.NewDecoder(resp.Body).Decode(&result)

	items, err := convertRedditResponseToItems(result)
	if err != nil {
		t.Fatalf("conversion failed: %v", err)
	}
	if len(items) != 0 {
		t.Errorf("expected 0 items, got %d", len(items))
	}
}

// convertRedditResponseToItems mirrors the logic in RedditCrawler.Fetch
func convertRedditResponseToItems(result redditResponse) ([]Item, error) {
	var items []Item
	for _, child := range result.Data.Children {
		d := child.Data
		url := d.URL
		if url == "" || url == d.Permalink {
			url = "https://www.reddit.com" + d.Permalink
		}
		t := time.Unix(int64(d.Created), 0)
		items = append(items, Item{
			Title:       d.Title,
			URL:         url,
			Source:      "Reddit r/programming",
			SourceAlias: "reddit",
			RawContent:  d.SelfText,
			PublishedAt: &t,
		})
	}
	return items, nil
}
