// Package article 定义文章数据模型与规范化逻辑。
package article

import "time"

// ReadStatus 阅读状态
type ReadStatus string

const (
	StatusUnread    ReadStatus = "unread"
	StatusRead      ReadStatus = "read"
	StatusStarred   ReadStatus = "starred"
	StatusArchived  ReadStatus = "archived"
	StatusDiscarded ReadStatus = "discarded"
)

// Article 表示一条抓取到的文章
type Article struct {
	ID           int64      `json:"id"`
	Title        string     `json:"title"`
	URL          string     `json:"url"`
	Source       string     `json:"source"`
	SourceAlias  string     `json:"source_alias"`
	Summary      string     `json:"summary"`
	LLMSummary   string     `json:"llm_summary"`
	LLMTags      string     `json:"llm_tags"`
	QualityScore float64    `json:"quality_score"`
	Language     string     `json:"language"`
	RawContent   string     `json:"raw_content"`
	PublishedAt  *time.Time `json:"published_at"`
	FetchedAt    time.Time  `json:"fetched_at"`
	EnrichedAt   *time.Time `json:"enriched_at"`
	ReadStatus   ReadStatus `json:"read_status"`
	Tags         string     `json:"tags"`
	Note         string     `json:"note"`
	Points       int        `json:"points"`
}

// IsValidStatus 检查阅读状态是否合法
func IsValidStatus(s ReadStatus) bool {
	switch s {
	case StatusUnread, StatusRead, StatusStarred, StatusArchived, StatusDiscarded:
		return true
	}
	return false
}
