// Package search 提供本地全文检索引擎封装。
package search

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// Engine 搜索引擎接口
type Engine struct {
	client *http.Client
}

// NewEngine 创建新的搜索引擎实例
func NewEngine() *Engine {
	return &Engine{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// extractDomain 从URL中提取域名
func extractDomain(urlStr string) (string, error) {
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		return "", err
	}

	// 返回主机名（例如：www.infoq.cn 或 infoq.cn）
	host := parsedURL.Host
	if host == "" {
		return "", fmt.Errorf("无法从URL提取域名")
	}

	return host, nil
}

// extractRealURL 从DuckDuckGo重定向链接中提取真实URL
func extractRealURL(ddgURL string) string {
	// DuckDuckGo链接格式: https://duckduckgo.com/l/?uddg=<encoded_url>&rut=...
	if strings.Contains(ddgURL, "duckduckgo.com/l/") {
		parsed, err := url.Parse(ddgURL)
		if err == nil {
			uddg := parsed.Query().Get("uddg")
			if uddg != "" {
				return uddg
			}
		}
	}
	return ddgURL
}

// Search 使用DuckDuckGo搜索指定网站的最新内容
func (e *Engine) Search(siteURL string) ([]SearchResult, error) {
	// 提取域名
	domain, err := extractDomain(siteURL)
	if err != nil {
		return nil, fmt.Errorf("URL解析失败: %w", err)
	}

	// 构造DuckDuckGo搜索URL - 使用 site: 语法进行站内搜索
	query := fmt.Sprintf("site:%s", domain)
	searchURL := fmt.Sprintf("https://html.duckduckgo.com/html/?q=%s", url.QueryEscape(query))

	// 发送HTTP请求
	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %w", err)
	}

	// 设置请求头模拟真实浏览器
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8")
	req.Header.Set("Accept-Encoding", "identity")

	resp, err := e.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("网络请求失败: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("搜索请求失败，状态码: %d", resp.StatusCode)
	}

	// 解析HTML
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("HTML解析失败: %w", err)
	}

	// 提取搜索结果
	results := []SearchResult{}
	index := 1

	// DuckDuckGo HTML版本的搜索结果选择器
	doc.Find(".result").Each(func(i int, s *goquery.Selection) {
		if index > 10 {
			return
		}

		result := SearchResult{Index: index}

		// 提取标题和链接
		titleElem := s.Find(".result__a")
		if titleElem.Length() > 0 {
			result.Title = strings.TrimSpace(titleElem.Text())
			if href, exists := titleElem.Attr("href"); exists {
				// DuckDuckGo 会返回绝对URL
				if strings.HasPrefix(href, "http") {
					result.URL = extractRealURL(href)
				} else if strings.HasPrefix(href, "//") {
					result.URL = extractRealURL("https:" + href)
				}
			}
		}

		// 提取摘要
		snippetElem := s.Find(".result__snippet")
		if snippetElem.Length() > 0 {
			result.Snippet = strings.TrimSpace(snippetElem.Text())
		}

		// 只添加有效的结果（至少有标题和URL）
		if result.Title != "" && result.URL != "" {
			results = append(results, result)
			index++
		}
	})

	if len(results) == 0 {
		// 调试：保存HTML到文件以便分析
		if os.Getenv("DEBUG_SEARCH") == "1" {
			htmlContent, _ := doc.Html()
			os.WriteFile("debug_ddg.html", []byte(htmlContent), 0644)
			fmt.Println("已保存HTML到 debug_ddg.html")
		}
		return nil, fmt.Errorf("未找到搜索结果。\n\n解决方法:\n1. 使用 --demo 参数查看演示效果\n2. 在浏览器中直接访问: https://duckduckgo.com/?q=%s", url.QueryEscape(query))
	}

	return results, nil
}
