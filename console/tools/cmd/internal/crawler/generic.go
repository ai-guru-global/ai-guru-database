package crawler

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// GenericCrawler 通用网页列表采集器
type GenericCrawler struct {
	listURL     string
	sourceName  string
	sourceAlias string
	selector    string // 文章项 CSS 选择器
	client      *http.Client
}

// NewGenericCrawler 创建通用采集器
func NewGenericCrawler(sourceName, sourceAlias, listURL, selector string) *GenericCrawler {
	if selector == "" {
		selector = "article"
	}
	return &GenericCrawler{
		listURL:     listURL,
		sourceName:  sourceName,
		sourceAlias: sourceAlias,
		selector:    selector,
		client:      &http.Client{Timeout: 30 * time.Second},
	}
}

// Fetch 抓取列表页中的文章元数据
func (c *GenericCrawler) Fetch() ([]Item, error) {
	req, err := http.NewRequest("GET", c.listURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求 %s 失败: %w", c.listURL, err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("页面返回状态码 %d", resp.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("解析 HTML 失败: %w", err)
	}

	var items []Item
	selection := doc.Find(c.selector)
	if selection.Length() == 0 {
		// fallback: 尝试常见选择器
		for _, sel := range []string{"article", ".post", ".entry", ".story", ".topic", "h2 a", "h3 a"} {
			selection = doc.Find(sel)
			if selection.Length() > 0 {
				break
			}
		}
	}

	selection.Each(func(i int, s *goquery.Selection) {
		if len(items) >= 20 {
			return
		}

		// 提取标题和链接
		var title, href string
		linkElem := s.Find("a").First()
		if linkElem.Length() > 0 {
			title = strings.TrimSpace(linkElem.Text())
			href, _ = linkElem.Attr("href")
		} else {
			title = strings.TrimSpace(s.Text())
		}

		if title == "" || href == "" {
			return
		}

		// 补全相对链接
		url := resolveURL(c.listURL, href)

		// 尝试提取摘要（很短，只作为 raw_content  preview）
		summary := ""
		summaryElem := s.Find("p, .summary, .excerpt, .description").First()
		if summaryElem.Length() > 0 {
			summary = strings.TrimSpace(summaryElem.Text())
			if len(summary) > 300 {
				summary = summary[:300] + "..."
			}
		}

		items = append(items, Item{
			Title:       title,
			URL:         url,
			Source:      c.sourceName,
			SourceAlias: c.sourceAlias,
			RawContent:  summary,
		})
	})

	if len(items) == 0 {
		return nil, fmt.Errorf("未在页面 %s 中找到文章列表", c.listURL)
	}

	return items, nil
}

func resolveURL(base, href string) string {
	if strings.HasPrefix(href, "http://") || strings.HasPrefix(href, "https://") {
		return href
	}
	if strings.HasPrefix(href, "//") {
		return "https:" + href
	}

	// 简单拼接
	if strings.HasPrefix(href, "/") {
		// 提取 base 的 scheme+host
		parts := strings.SplitN(base, "://", 2)
		if len(parts) == 2 {
			hostParts := strings.SplitN(parts[1], "/", 2)
			return parts[0] + "://" + hostParts[0] + href
		}
	}

	if !strings.HasSuffix(base, "/") {
		base = base + "/"
	}
	return base + href
}
