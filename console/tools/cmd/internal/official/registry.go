package official

import "sync"

var (
	registry *Registry
	once     sync.Once
)

// Registry 官方源注册表，管理所有官方新闻源
type Registry struct {
	sources map[string]*Source // key 为别名
}

// GetRegistry 获取官方源注册表单例
func GetRegistry() *Registry {
	once.Do(func() {
		registry = &Registry{
			sources: make(map[string]*Source),
		}
		// 注册官方源
		registry.registerDefaultSources()
	})
	return registry
}

// registerDefaultSources 注册默认的官方源
func (r *Registry) registerDefaultSources() {
	// InfoQ 中文站（专用抓取器，保留原有逻辑）
	r.sources["infoq"] = &Source{
		Alias:       "infoq",
		Name:        "InfoQ 中文站热点清单",
		URL:         "https://www.infoq.cn/hotlist",
		FetcherType: "infoq",
		Description: "InfoQ 中文站的热点文章列表",
		Enabled:     true,
	}

	// InfoQ AI Briefs
	r.sources["ai"] = &Source{
		Alias:       "ai",
		Name:        "InfoQ AI Briefs",
		URL:         "https://www.infoq.cn/aibriefs",
		FetcherType: "infoq",
		Description: "InfoQ 中文站 AI 大模型领域全面即时资讯",
		Enabled:     true,
	}

	// Hacker News
	r.sources["hn"] = &Source{
		Alias:       "hn",
		Name:        "Hacker News",
		URL:         "https://news.ycombinator.com",
		Description: "Y Combinator 旗下的技术新闻聚合",
		Enabled:     true,
	}

	// GitHub Blog
	r.sources["github"] = &Source{
		Alias:       "github",
		Name:        "GitHub Blog",
		URL:         "https://github.blog",
		Description: "GitHub 官方博客",
		Enabled:     true,
	}

	// lobste.rs
	r.sources["lobsters"] = &Source{
		Alias:       "lobsters",
		Name:        "lobste.rs",
		URL:         "https://lobste.rs",
		Description: "面向程序员的友好技术社区",
		Enabled:     true,
	}

	// Reddit r/programming
	r.sources["reddit"] = &Source{
		Alias:       "reddit",
		Name:        "Reddit r/programming",
		URL:         "https://www.reddit.com/r/programming",
		Description: "Reddit 编程板块热门内容",
		Enabled:     true,
	}

	// 阮一峰的网络日志
	r.sources["ruanyf"] = &Source{
		Alias:       "ruanyf",
		Name:        "阮一峰的网络日志",
		URL:         "http://www.ruanyifeng.com/blog",
		Description: "阮一峰的技术博客",
		Enabled:     true,
	}

	// 酷壳
	r.sources["coolshell"] = &Source{
		Alias:       "coolshell",
		Name:        "酷壳 CoolShell",
		URL:         "https://coolshell.cn",
		Description: "陈皓（左耳朵耗子）的技术博客",
		Enabled:     true,
	}

	// V2EX
	r.sources["v2ex"] = &Source{
		Alias:       "v2ex",
		Name:        "V2EX",
		URL:         "https://www.v2ex.com",
		Description: "V2EX 技术社区最新主题",
		Enabled:     true,
	}
}

// Get 根据别名获取官方源
func (r *Registry) Get(alias string) (*Source, bool) {
	source, exists := r.sources[alias]
	if !exists || !source.Enabled {
		return nil, false
	}
	return source, true
}

// List 获取所有启用的官方源列表
func (r *Registry) List() []*Source {
	var sources []*Source
	for _, source := range r.sources {
		if source.Enabled {
			sources = append(sources, source)
		}
	}
	return sources
}
