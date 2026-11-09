package crawler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const redditAPI = "https://www.reddit.com/r/programming/top/.json?t=day&limit=25"

// RedditCrawler Reddit 采集器
type RedditCrawler struct {
	client *http.Client
}

// NewRedditCrawler 创建 Reddit 采集器
func NewRedditCrawler() *RedditCrawler {
	return &RedditCrawler{
		client: &http.Client{Timeout: 30 * time.Second},
	}
}

type redditResponse struct {
	Data struct {
		Children []struct {
			Data struct {
				Title     string  `json:"title"`
				URL       string  `json:"url"`
				Permalink string  `json:"permalink"`
				SelfText  string  `json:"selftext"`
				Created   float64 `json:"created_utc"`
			} `json:"data"`
		} `json:"children"`
	} `json:"data"`
}

// Fetch 获取 Reddit 热门帖子
func (c *RedditCrawler) Fetch() ([]Item, error) {
	req, err := http.NewRequest("GET", redditAPI, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "ai-news-database/1.0")

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求 Reddit API 失败: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Reddit API 返回状态码 %d", resp.StatusCode)
	}

	var result redditResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("解析 Reddit API 响应失败: %w", err)
	}

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
