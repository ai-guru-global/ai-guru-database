package crawler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

const v2exAPI = "https://www.v2ex.com/api/topics/hot.json"

// V2EXCrawler V2EX 采集器
type V2EXCrawler struct {
	client *http.Client
}

// NewV2EXCrawler 创建 V2EX 采集器
func NewV2EXCrawler() *V2EXCrawler {
	return &V2EXCrawler{
		client: &http.Client{Timeout: 30 * time.Second},
	}
}

type v2exTopic struct {
	Title   string `json:"title"`
	URL     string `json:"url"`
	Content string `json:"content"`
	Created int64  `json:"created"`
	Replies int    `json:"replies"`
}

// Fetch 获取 V2EX 热门主题
func (c *V2EXCrawler) Fetch() ([]Item, error) {
	req, err := http.NewRequest("GET", v2exAPI, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "ai-news-database/1.0")

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求 V2EX API 失败: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("V2EX API 返回状态码 %d", resp.StatusCode)
	}

	var result []v2exTopic
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("解析 V2EX API 响应失败: %w", err)
	}

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
