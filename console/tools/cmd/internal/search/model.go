package search

// SearchResult 表示单条搜索结果
type SearchResult struct {
	Index         int    `json:"index"`          // 结果序号（1-10）
	Title         string `json:"title"`          // 文章标题
	URL           string `json:"url"`            // 文章链接
	Snippet       string `json:"snippet"`        // 内容摘要
	PublishedDate string `json:"published_date"` // 发布时间（如果可提取）
}
