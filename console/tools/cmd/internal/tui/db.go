package tui

import "ai-news-database/internal/article"

// DB defines the minimal database interface required by the TUI.
type DB interface {
	GetArticles(status article.ReadStatus, sourceAlias string, limit int) ([]article.Article, error)
	UpdateStatus(id int64, status article.ReadStatus) error
}
