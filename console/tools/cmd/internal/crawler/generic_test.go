package crawler

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestGenericCrawler_Fetch(t *testing.T) {
	html := `
<!DOCTYPE html>
<html>
<body>
<article>
  <h2><a href="/post/1">First Article</a></h2>
  <p>This is the first article summary.</p>
</article>
<article>
  <h2><a href="https://example.com/post/2">Second Article</a></h2>
  <p class="excerpt">Second article summary that is quite long and should be truncated after three hundred characters because the generic crawler limits the summary length to three hundred characters with an ellipsis.</p>
</article>
<article>
  <span>No link here</span>
</article>
</body>
</html>`

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(html))
	}))
	defer ts.Close()

	c := NewGenericCrawler("Test Blog", "test", ts.URL, "article")
	items, err := c.Fetch()
	if err != nil {
		t.Fatalf("Fetch failed: %v", err)
	}
	if len(items) != 2 {
		t.Fatalf("expected 2 items, got %d", len(items))
	}
	if items[0].Title != "First Article" {
		t.Errorf("item 0 title: want %q, got %q", "First Article", items[0].Title)
	}
	if items[0].URL != ts.URL+"/post/1" {
		t.Errorf("item 0 URL: want %q, got %q", ts.URL+"/post/1", items[0].URL)
	}
	if items[0].Source != "Test Blog" {
		t.Errorf("item 0 source: want %q, got %q", "Test Blog", items[0].Source)
	}
	if items[1].URL != "https://example.com/post/2" {
		t.Errorf("item 1 URL: want %q, got %q", "https://example.com/post/2", items[1].URL)
	}
}

func TestGenericCrawler_FallbackSelectors(t *testing.T) {
	html := `
<!DOCTYPE html>
<html>
<body>
<div class="post">
  <h2><a href="/p/1">Post One</a></h2>
</div>
</body>
</html>`

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(html))
	}))
	defer ts.Close()

	// Use a selector that doesn't exist to trigger fallback
	c := NewGenericCrawler("Test", "test", ts.URL, ".nonexistent")
	items, err := c.Fetch()
	if err != nil {
		t.Fatalf("Fetch failed: %v", err)
	}
	if len(items) != 1 {
		t.Fatalf("expected 1 item, got %d", len(items))
	}
	if items[0].Title != "Post One" {
		t.Errorf("unexpected title: %q", items[0].Title)
	}
}

func TestGenericCrawler_HTTPError(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	}))
	defer ts.Close()

	c := NewGenericCrawler("Test", "test", ts.URL, "article")
	_, err := c.Fetch()
	if err == nil {
		t.Fatal("expected error for 500 response")
	}
}

func TestGenericCrawler_NoArticles(t *testing.T) {
	html := `<html><body><div>nothing here</div></body></html>`

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(html))
	}))
	defer ts.Close()

	c := NewGenericCrawler("Test", "test", ts.URL, "article")
	_, err := c.Fetch()
	if err == nil {
		t.Fatal("expected error when no articles found")
	}
}

func TestResolveURL(t *testing.T) {
	tests := []struct {
		base string
		href string
		want string
	}{
		{"https://example.com", "https://other.com/path", "https://other.com/path"},
		{"https://example.com", "http://other.com/path", "http://other.com/path"},
		{"https://example.com", "//cdn.example.com/file.js", "https://cdn.example.com/file.js"},
		{"https://example.com/blog", "/about", "https://example.com/about"},
		{"https://example.com/blog/", "page/2", "https://example.com/blog/page/2"},
		{"https://example.com", "page/2", "https://example.com/page/2"},
	}

	for _, tt := range tests {
		t.Run(fmt.Sprintf("%s_%s", tt.base, tt.href), func(t *testing.T) {
			got := resolveURL(tt.base, tt.href)
			if got != tt.want {
				t.Errorf("resolveURL(%q, %q) = %q, want %q", tt.base, tt.href, got, tt.want)
			}
		})
	}
}

func TestGenericCrawler_Limit20(t *testing.T) {
	var articles strings.Builder
	articles.WriteString(`<html><body>`)
	for i := 0; i < 30; i++ {
		articles.WriteString(fmt.Sprintf(`<article><h2><a href="/post/%d">Article %d</a></h2></article>`, i, i))
	}
	articles.WriteString(`</body></html>`)

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(articles.String()))
	}))
	defer ts.Close()

	c := NewGenericCrawler("Test", "test", ts.URL, "article")
	items, err := c.Fetch()
	if err != nil {
		t.Fatalf("Fetch failed: %v", err)
	}
	if len(items) != 20 {
		t.Fatalf("expected 20 items (capped), got %d", len(items))
	}
}
