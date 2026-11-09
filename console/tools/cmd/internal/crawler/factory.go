// Package crawler 实现多源抓取器工厂：HN、Reddit、V2EX、通用与 JinaReader。
package crawler

import "ai-news-database/internal/official"

// NewCrawler 根据官方源配置创建对应的采集器
func NewCrawler(source *official.Source) (Crawler, error) {
	switch source.Alias {
	case "hn":
		return NewHNCrawler(), nil
	case "reddit":
		return NewRedditCrawler(), nil
	case "lobsters":
		return NewGenericCrawler(source.Name, source.Alias, "https://lobste.rs", ".story_liner"), nil
	case "ruanyf":
		return NewGenericCrawler(source.Name, source.Alias, "http://www.ruanyifeng.com/blog/", "article"), nil
	case "coolshell":
		return NewGenericCrawler(source.Name, source.Alias, "https://coolshell.cn", "article"), nil
	case "v2ex":
		return NewV2EXCrawler(), nil
	case "github":
		// GitHub Blog + Trending 混合，先用 Generic 抓取博客首页
		return NewGenericCrawler(source.Name, source.Alias, "https://github.blog", "article"), nil
	case "infoq":
		return NewGenericCrawler(source.Name, source.Alias, source.URL, "article"), nil
	default:
		// 默认使用 Jina AI Reader 抓取源配置的 URL
		return NewGenericCrawler(source.Name, source.Alias, source.URL, ""), nil
	}
}
