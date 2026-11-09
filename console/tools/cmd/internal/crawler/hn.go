package crawler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const hnAPI = "https://hn.algolia.com/api/v1/search_by_date?tags=front_page&hitsPerPage=25"

// HNCrawler Hacker News 采集器
type HNCrawler struct {
	client *http.Client
}

// NewHNCrawler 创建 HN 采集器
func NewHNCrawler() *HNCrawler {
	return &HNCrawler{
		client: &http.Client{Timeout: 30 * time.Second},
	}
}

// hnHit Algolia API 返回的命中项
type hnHit struct {
	Title     string `json:"title"`
	URL       string `json:"url"`
	ObjectID  string `json:"objectID"`
	CreatedAt string `json:"created_at"`
	StoryText string `json:"story_text"`
}

type hnResponse struct {
	Hits []hnHit `json:"hits"`
}

// Fetch 获取 HN 首页文章
func (c *HNCrawler) Fetch() ([]Item, error) {
	resp, err := c.client.Get(hnAPI)
	if err != nil {
		return nil, fmt.Errorf("请求 HN API 失败: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HN API 返回状态码 %d", resp.StatusCode)
	}

	var result hnResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("解析 HN API 响应失败: %w", err)
	}

	var items []Item
	for _, hit := range result.Hits {
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
