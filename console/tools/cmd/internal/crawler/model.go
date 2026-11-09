package crawler

import "time"

// Item 表示一条采集到的原始内容
type Item struct {
	Title       string
	URL         string
	Source      string
	SourceAlias string
	RawContent  string
	PublishedAt *time.Time
}

// Crawler 定义采集器接口
type Crawler interface {
	Fetch() ([]Item, error)
}
