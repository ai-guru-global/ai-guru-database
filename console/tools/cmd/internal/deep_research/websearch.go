package deep_research

import (
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"ai-news-database/internal/article"
	"ai-news-database/internal/search"

	"github.com/PuerkitoBio/goquery"
)

func (r *Researcher) domainCredibility(domain string) float64 {
	credibility := map[string]float64{
		"github.com":           0.9,
		"arxiv.org":            0.95,
		"stackoverflow.com":    0.8,
		"medium.com":           0.6,
		"dev.to":               0.6,
		"techcrunch.com":       0.75,
		"theverge.com":         0.7,
		"wired.com":            0.75,
		"hackernews.com":       0.8,
		"news.ycombinator.com": 0.8,
		"reddit.com":           0.5,
		"twitter.com":          0.4,
		"x.com":                0.4,
		"wikipedia.org":        0.7,
		"docs.google.com":      0.6,
	}
	if cred, ok := credibility[domain]; ok {
		return cred
	}
	if strings.HasSuffix(domain, ".gov") {
		return 0.8
	}
	if strings.HasSuffix(domain, ".edu") {
		return 0.85
	}
	return 0.5
}

func (r *Researcher) searchLocalWithRetry(query string, limit, maxRetries int) ([]article.Article, error) {
	var lastErr error
	for attempt := 0; attempt < maxRetries; attempt++ {
		articles, err := r.searchLocal(query, limit)
		if err == nil {
			return articles, nil
		}
		lastErr = err
		if attempt < maxRetries-1 {
			time.Sleep(time.Duration(attempt+1) * 100 * time.Millisecond)
		}
	}
	return nil, lastErr
}

func (r *Researcher) searchLocal(query string, limit int) ([]article.Article, error) {
	articles, err := r.db.SearchArticles(query, limit)
	if err != nil {
		articles, err = r.db.SearchByKeyword(query, limit)
		if err != nil {
			return nil, err
		}
	}
	return articles, nil
}

func (r *Researcher) searchWebWithRetry(query string, maxRetries int) ([]search.SearchResult, error) {
	var lastErr error
	backoff := time.Second

	for attempt := 0; attempt < maxRetries; attempt++ {
		results, err := r.searchWeb(query)
		if err == nil {
			return results, nil
		}
		lastErr = err
		if attempt < maxRetries-1 {
			time.Sleep(backoff)
			backoff *= 2
			if backoff > 30*time.Second {
				backoff = 30 * time.Second
			}
		}
	}
	return nil, lastErr
}

func (r *Researcher) searchWeb(query string) ([]search.SearchResult, error) {
	searchURL := fmt.Sprintf("https://duckduckgo.com/html/?q=%s", strings.ReplaceAll(query, " ", "+"))
	resp, err := r.searchWebRequest(searchURL)
	if err != nil {
		return nil, err
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("search failed: %d", resp.StatusCode)
	}

	return r.parseSearchResults(resp.Body)
}

func (r *Researcher) searchWebRequest(url string) (*http.Response, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
	req.Header.Set("Accept", "text/html")

	client := &http.Client{Timeout: 15 * time.Second}
	return client.Do(req)
}

func (r *Researcher) parseSearchResults(body io.Reader) ([]search.SearchResult, error) {
	doc, err := goquery.NewDocumentFromReader(body)
	if err != nil {
		return nil, err
	}

	var results []search.SearchResult
	index := 1

	doc.Find(".result").Each(func(i int, s *goquery.Selection) {
		if index > 10 {
			return
		}

		result := search.SearchResult{Index: index}

		titleElem := s.Find(".result__a")
		if titleElem.Length() > 0 {
			result.Title = strings.TrimSpace(titleElem.Text())
			if href, exists := titleElem.Attr("href"); exists {
				if strings.HasPrefix(href, "http") {
					result.URL = href
				}
			}
		}

		snippetElem := s.Find(".result__snippet")
		if snippetElem.Length() > 0 {
			result.Snippet = strings.TrimSpace(snippetElem.Text())
		}

		if result.Title != "" && result.URL != "" {
			results = append(results, result)
			index++
		}
	})

	return results, nil
}

func extractDomain(urlStr string) string {
	parts := strings.Split(urlStr, "/")
	if len(parts) >= 3 {
		host := parts[2]
		host = strings.TrimPrefix(host, "www.")
		return host
	}
	return urlStr
}
