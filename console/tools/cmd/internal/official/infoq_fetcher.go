package official

import (
	"ai-news-database/internal/search"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// InfoQFetcher InfoQ 热点清单抓取器
type InfoQFetcher struct {
	url    string
	client *http.Client
}

// NewInfoQFetcher 创建 InfoQ 抓取器实例
func NewInfoQFetcher(url string) *InfoQFetcher {
	return &InfoQFetcher{
		url: url,
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

// Fetch 抓取 InfoQ 热点清单内容
func (f *InfoQFetcher) Fetch() ([]search.SearchResult, error) {
	// 发送 HTTP 请求
	req, err := http.NewRequest("GET", f.url, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %w", err)
	}

	// 设置请求头模拟真实浏览器
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8")

	resp, err := f.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("网络请求失败: %w\n\n建议:\n1. 检查网络连接\n2. 直接访问: %s", err, f.url)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("请求失败，状态码: %d\n\n建议:\n直接访问: %s", resp.StatusCode, f.url)
	}

	// 解析 HTML
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("HTML解析失败: %w", err)
	}

	// 提取文章列表
	results, err := f.parseResults(doc)
	if err != nil {
		// 调试模式：保存HTML到文件
		if os.Getenv("DEBUG_OFFICIAL") == "1" {
			htmlContent, _ := doc.Html()
			os.WriteFile("debug_infoq.html", []byte(htmlContent), 0644)
			fmt.Println("已保存HTML到 debug_infoq.html")
		}
		return nil, err
	}

	if len(results) == 0 {
		return nil, fmt.Errorf("未找到内容\n\n可能原因:\n1. 页面结构已变更\n2. 页面暂无内容\n\n建议:\n访问原页面: %s", f.url)
	}

	return results, nil
}

// parseResults 解析 HTML 提取文章列表
func (f *InfoQFetcher) parseResults(doc *goquery.Document) ([]search.SearchResult, error) {
	var results []search.SearchResult
	index := 1

	// InfoQ 热点清单页面使用 JavaScript 动态渲染
	// 检查页面是否为空（只有 <div id="app"></div>）
	appDiv := doc.Find("#app")
	if appDiv.Length() > 0 && strings.TrimSpace(appDiv.Text()) == "" {
		// 页面是 SPA（如 aibriefs），尝试解析 Nuxt devalue 数据
		results, err := f.parseNuxtDevalue(doc)
		if err == nil && len(results) > 0 {
			return results, nil
		}
		// 解析失败则回退到演示数据
		if os.Getenv("DEMO_MODE") == "1" {
			return f.generateDemoResults(), nil
		}
		return nil, fmt.Errorf("InfoQ 页面使用 JavaScript 动态渲染，无法直接抓取\n\n建议:\n1. 访问原页面: %s\n2. 等待工具更新支持", f.url)
	}

	// InfoQ 热点清单页面的选择器（如果页面有静态内容）
	// 主选择器：尝试查找文章列表容器
	selectors := []string{
		".article-list .article-item", // 主选择器
		".hot-list .hot-item",         // 备选选择器1
		".list-item",                  // 备选选择器2
		"article",                     // 备选选择器3
		".content-list > div",         // 备选选择器4
	}

	var selection *goquery.Selection
	var usedSelector string

	// 尝试多个选择器
	for _, selector := range selectors {
		selection = doc.Find(selector)
		if selection.Length() > 0 {
			usedSelector = selector
			break
		}
	}

	if selection == nil || selection.Length() == 0 {
		// 尝试通用的 a 标签选择器
		selection = doc.Find("a[href*='/article/'], a[href*='/news/']")
		usedSelector = "a[href*='/article/']"
	}

	if selection == nil || selection.Length() == 0 {
		// 传统选择器均失败，尝试 Nuxt devalue 解析（SPA 页面如 aibriefs）
		results, err := f.parseNuxtDevalue(doc)
		if err == nil && len(results) > 0 {
			return results, nil
		}
		return nil, fmt.Errorf("页面结构可能已变更，无法定位文章列表")
	}

	// 遍历文章项
	selection.Each(func(i int, s *goquery.Selection) {
		if index > 10 {
			return
		}

		result := search.SearchResult{Index: index}

		// 根据不同的选择器提取内容
		if usedSelector == "a[href*='/article/']" {
			// 直接从链接提取
			result.Title = strings.TrimSpace(s.Text())
			if href, exists := s.Attr("href"); exists {
				result.URL = f.normalizeURL(href)
			}
		} else {
			// 从文章项中查找标题和链接
			titleElem := s.Find("h2, h3, h4, .title, .article-title, a")
			if titleElem.Length() > 0 {
				result.Title = strings.TrimSpace(titleElem.First().Text())

				// 查找链接
				linkElem := s.Find("a").First()
				if linkElem.Length() > 0 {
					if href, exists := linkElem.Attr("href"); exists {
						result.URL = f.normalizeURL(href)
					}
				}
			}

			// 提取摘要
			snippetElem := s.Find(".summary, .description, .excerpt, p")
			if snippetElem.Length() > 0 {
				result.Snippet = strings.TrimSpace(snippetElem.First().Text())
			}
		}

		// 只添加有效的结果（至少有标题和URL）
		if result.Title != "" && result.URL != "" {
			// 清理标题中的多余空白
			result.Title = strings.Join(strings.Fields(result.Title), " ")

			// 截断过长的摘要
			if len(result.Snippet) > 200 {
				result.Snippet = result.Snippet[:200] + "..."
			}

			results = append(results, result)
			index++
		}
	})

	return results, nil
}

// generateDemoResults 生成演示数据
func (f *InfoQFetcher) generateDemoResults() []search.SearchResult {
	// 演示数据链接到 InfoQ 热点清单页面（使用锚点区分不同文章，避免 URL 去重冲突）
	baseURL := "https://www.infoq.cn/hotlist"
	results := []search.SearchResult{
		{Index: 1, Title: "2025年技术趋势：AI原生应用的崛起", Snippet: "随着大语言模型的不断进化，AI原生应用正在改变软件开发的范式。本文探讨2025年AI技术的发展趋势和最佳实践。"},
		{Index: 2, Title: "Kubernetes 1.30 新特性深度解析", Snippet: "Kubernetes 最新版本带来了更强大的容器编排能力和安全性增强，包括改进的资源管理和新的调度策略。"},
		{Index: 3, Title: "Go 1.24 泛型最佳实践", Snippet: "深入探讨 Go 语言泛型的使用场景和最佳实践，帮助开发者写出更优雅、更高效的代码。"},
		{Index: 4, Title: "微服务架构下的可观测性实践", Snippet: "在复杂的微服务架构中，如何构建完善的可观测性体系？本文分享一线大厂的实践经验。"},
		{Index: 5, Title: "前端性能优化：从60fps到120fps", Snippet: "随着高刷新率屏幕的普及，前端性能优化面临新挑战。本文介绍如何实现流畅的120fps体验。"},
		{Index: 6, Title: "Rust 在云原生领域的应用", Snippet: "Rust 凭借其内存安全和高性能特性，正在云原生领域崭露头角。探索 Rust 在容器运行时和服务网格中的应用。"},
		{Index: 7, Title: "数据库选型指南：2025版", Snippet: "面对众多数据库产品，如何根据业务场景做出正确选择？本文提供全面的数据库选型指南。"},
		{Index: 8, Title: "大规模分布式系统的一致性保证", Snippet: "深入分析分布式系统中的一致性问题，介绍 Paxos、Raft 等共识算法的实际应用。"},
		{Index: 9, Title: "eBPF：Linux内核可编程的未来", Snippet: "eBPF 技术正在改变我们与 Linux 内核的交互方式，为性能监控、安全和网络带来革命性变化。"},
		{Index: 10, Title: "DevOps 2025：平台工程的崛起", Snippet: "平台工程正在成为 DevOps 演进的下一个阶段，了解如何构建开发者友好的内部平台。"},
	}
	for i := range results {
		results[i].URL = fmt.Sprintf("%s#demo-%d", baseURL, results[i].Index)
	}
	return results
}

// parseNuxtDevalue 从 SPA 页面的 <script> 标签中解析 Nuxt devalue 数据
func (f *InfoQFetcher) parseNuxtDevalue(doc *goquery.Document) ([]search.SearchResult, error) {
	var rawJSON string

	doc.Find("script").Each(func(i int, s *goquery.Selection) {
		text := strings.TrimSpace(s.Text())
		// Nuxt devalue 数据以 JSON 数组开头
		if strings.HasPrefix(text, "[") {
			rawJSON = text
		}
	})

	if rawJSON == "" {
		return nil, fmt.Errorf("未找到 Nuxt devalue 数据")
	}

	var data []interface{}
	if err := json.Unmarshal([]byte(rawJSON), &data); err != nil {
		return nil, fmt.Errorf("解析 devalue JSON 失败: %w", err)
	}

	if len(data) < 2 {
		return nil, fmt.Errorf("devalue 数据不完整")
	}

	// 解析引用，根对象在索引 1（ShallowReactive 包裹）
	root := f.resolveDevalue(data, 1, make(map[int]bool))
	if root == nil {
		return nil, fmt.Errorf("无法解析 devalue 根对象")
	}

	return f.extractAIBriefs(root), nil
}

// resolveDevalue 递归解析 Nuxt devalue 序列化数据中的引用
func (f *InfoQFetcher) resolveDevalue(data []interface{}, idx int, seen map[int]bool) interface{} {
	if idx < 0 || idx >= len(data) {
		return nil
	}
	if seen[idx] {
		return "<circular>"
	}
	seen[idx] = true

	val := data[idx]
	switch v := val.(type) {
	case string, bool, nil:
		return v
	case float64:
		return v
	case []interface{}:
		// 检查是否是类型包装器（ShallowReactive / Reactive / RefImpl）
		if len(v) >= 2 {
			if first, ok := v[0].(string); ok && (first == "ShallowReactive" || first == "Reactive" || first == "RefImpl") {
				if second, ok := v[1].(float64); ok {
					return f.resolveDevalue(data, int(second), seen)
				}
			}
		}
		result := make([]interface{}, len(v))
		for i, item := range v {
			if fval, ok := item.(float64); ok && fval >= 0 {
				result[i] = f.resolveDevalue(data, int(fval), seen)
			} else {
				result[i] = item
			}
		}
		return result
	case map[string]interface{}:
		result := make(map[string]interface{})
		for k, vval := range v {
			if fval, ok := vval.(float64); ok && fval >= 0 {
				result[k] = f.resolveDevalue(data, int(fval), seen)
			} else {
				result[k] = vval
			}
		}
		return result
	}
	return val
}

// extractAIBriefs 从解析后的 Nuxt 数据中提取 AI Briefs 文章列表
func (f *InfoQFetcher) extractAIBriefs(root interface{}) []search.SearchResult {
	rootMap, ok := root.(map[string]interface{})
	if !ok {
		return nil
	}

	data, ok := rootMap["data"].(map[string]interface{})
	if !ok {
		return nil
	}

	aibriefsList, ok := data["aibriefsList"].(map[string]interface{})
	if !ok {
		return nil
	}

	list, ok := aibriefsList["list"].([]interface{})
	if !ok {
		return nil
	}

	var results []search.SearchResult
	for i, item := range list {
		itemMap, ok := item.(map[string]interface{})
		if !ok {
			continue
		}

		title, _ := itemMap["title"].(string)
		desc, _ := itemMap["description"].(string)
		link, _ := itemMap["original_link"].(string)

		if title == "" || link == "" {
			continue
		}

		// 清理并截断摘要
		desc = strings.Join(strings.Fields(desc), " ")
		if len(desc) > 200 {
			desc = desc[:200] + "..."
		}

		// 清理标题
		title = strings.Join(strings.Fields(title), " ")

		results = append(results, search.SearchResult{
			Index:   i + 1,
			Title:   title,
			URL:     link,
			Snippet: desc,
		})
	}

	return results
}

// normalizeURL 规范化 URL
func (f *InfoQFetcher) normalizeURL(href string) string {
	// 如果是相对路径，补全为绝对路径
	if strings.HasPrefix(href, "/") {
		return "https://www.infoq.cn" + href
	}
	// 如果是完整URL，直接返回
	if strings.HasPrefix(href, "http://") || strings.HasPrefix(href, "https://") {
		return href
	}
	// 其他情况，拼接基础URL
	return "https://www.infoq.cn/" + href
}
