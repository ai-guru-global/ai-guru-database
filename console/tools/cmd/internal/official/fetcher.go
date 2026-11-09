// Package official 维护内置官方源的注册表与抓取器。
package official

import (
	"ai-news-database/internal/search"
	"fmt"
)

// Fetcher 定义抓取器接口
type Fetcher interface {
	// Fetch 抓取内容并返回结果列表
	Fetch() ([]search.SearchResult, error)
}

// FetcherFactory 抓取器工厂，根据类型创建对应的抓取器实例
type FetcherFactory struct{}

// NewFetcherFactory 创建抓取器工厂实例
func NewFetcherFactory() *FetcherFactory {
	return &FetcherFactory{}
}

// Create 根据官方源配置创建对应的抓取器
func (f *FetcherFactory) Create(source *Source) (Fetcher, error) {
	switch source.FetcherType {
	case "infoq":
		return NewInfoQFetcher(source.URL), nil
	default:
		return nil, fmt.Errorf("不支持的抓取器类型: %s", source.FetcherType)
	}
}
