package official

// Source 表示一个官方新闻源
type Source struct {
	Alias       string // 唯一别名，用于命令行调用
	Name        string // 官方源显示名称
	URL         string // 目标页面完整URL（列表页或 API 地址）
	FetcherType string // 抓取器类型标识（向后兼容，当前主要给 infoq 用）
	Description string // 官方源简介
	Enabled     bool   // 是否启用
}
