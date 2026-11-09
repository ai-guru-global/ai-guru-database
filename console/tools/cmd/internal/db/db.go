// Package db 提供基于 SQLite 的本地存储与 FTS5 中文检索。
package db

import (
	"ai-news-database/internal/article"
	"database/sql"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"time"

	_ "modernc.org/sqlite"
)

const dbFile = "ai-news-database.db"

// DB 封装数据库操作
type DB struct {
	conn *sql.DB
}

// New 创建并初始化数据库
func New() (*DB, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("无法获取用户主目录: %w", err)
	}

	dbDir := filepath.Join(homeDir, ".ai-news-database")
	if err := os.MkdirAll(dbDir, 0755); err != nil {
		return nil, fmt.Errorf("无法创建配置目录: %w", err)
	}

	dbPath := filepath.Join(dbDir, dbFile)
	conn, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("打开数据库失败: %w", err)
	}

	if err := conn.Ping(); err != nil {
		return nil, fmt.Errorf("连接数据库失败: %w", err)
	}

	db := &DB{conn: conn}
	if err := db.migrate(); err != nil {
		return nil, fmt.Errorf("数据库迁移失败: %w", err)
	}

	return db, nil
}

// Close 关闭数据库连接
func (d *DB) Close() error {
	return d.conn.Close()
}

// Conn returns the underlying database connection (for testing)
func (d *DB) Conn() *sql.DB {
	return d.conn
}

// ArticleExists 检查指定 URL 的文章是否已存在
func (d *DB) ArticleExists(url string) bool {
	var id int64
	err := d.conn.QueryRow("SELECT id FROM articles WHERE url = ?", url).Scan(&id)
	return err == nil
}

// Migrate 执行数据库初始化
func (d *DB) Migrate() error {
	return d.migrate()
}

// migrate 执行数据库初始化
func (d *DB) migrate() error {
	schema := `
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL,
    source_alias TEXT NOT NULL,
    summary TEXT,
    llm_summary TEXT,
    llm_tags TEXT,
    quality_score REAL DEFAULT 0,
    language TEXT,
    raw_content TEXT,
    published_at DATETIME,
    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    enriched_at DATETIME,
    read_status TEXT DEFAULT 'unread',
    tags TEXT,
    note TEXT
);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(read_status);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source_alias);
CREATE INDEX IF NOT EXISTS idx_articles_fetched_at ON articles(fetched_at);
`
	if _, err := d.conn.Exec(schema); err != nil {
		return err
	}

	// FTS 索引独立迁移（含中文分词与旧版结构升级）
	if err := d.migrateFTS(); err != nil {
		return err
	}

	// 兼容旧数据库：添加新字段
	newColumns := []string{
		"llm_summary TEXT",
		"llm_tags TEXT",
		"quality_score REAL DEFAULT 0",
		"language TEXT",
		"raw_content TEXT",
		"enriched_at DATETIME",
		"points INTEGER DEFAULT 0",
	}
	for _, col := range newColumns {
		// ALTER TABLE ADD COLUMN 会因列已存在而失败，属于正常迁移行为
		if _, err := d.conn.Exec(fmt.Sprintf("ALTER TABLE articles ADD COLUMN %s", col)); err != nil {
			slog.Debug("迁移列已存在，跳过", "column", col, "error", err)
		}
	}

	if _, err := d.conn.Exec("UPDATE articles SET quality_score = 0 WHERE quality_score IS NULL"); err != nil {
		return fmt.Errorf("初始化 quality_score 失败: %w", err)
	}
	if _, err := d.conn.Exec("UPDATE articles SET points = 0 WHERE points IS NULL"); err != nil {
		return fmt.Errorf("初始化 points 失败: %w", err)
	}

	burstSchema := `
CREATE TABLE IF NOT EXISTS burst_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mode TEXT NOT NULL DEFAULT 'cross-domain',
    focus TEXT DEFAULT '',
    ideas TEXT NOT NULL,
    based_on INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_burst_created ON burst_results(created_at);
`
	if _, err := d.conn.Exec(burstSchema); err != nil {
		return err
	}

	return nil
}

// SaveArticle 保存或更新文章（URL 唯一），并同步 FTS 索引
func (d *DB) SaveArticle(a *article.Article) error {
	var existingID int64
	err := d.conn.QueryRow("SELECT id FROM articles WHERE url = ?", a.URL).Scan(&existingID)
	if err == nil {
		_, err = d.conn.Exec(
			`UPDATE articles SET title = ?, summary = ?, source = ?, source_alias = ?, raw_content = ?, published_at = ?, points = ? WHERE id = ?`,
			a.Title, a.Summary, a.Source, a.SourceAlias, a.RawContent, a.PublishedAt, a.Points, existingID,
		)
		if err != nil {
			return err
		}
		return d.reindexArticle(existingID)
	}

	result, err := d.conn.Exec(
		`INSERT INTO articles (title, url, source, source_alias, summary, raw_content, published_at, fetched_at, read_status, tags, note, points)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		a.Title, a.URL, a.Source, a.SourceAlias, a.Summary, a.RawContent, a.PublishedAt, a.FetchedAt, a.ReadStatus, a.Tags, a.Note, a.Points,
	)
	if err != nil {
		return err
	}
	newID, err := result.LastInsertId()
	if err != nil {
		return err
	}
	return d.reindexArticle(newID)
}

// GetArticles 按条件查询文章
func (d *DB) GetArticles(status article.ReadStatus, sourceAlias string, limit int) ([]article.Article, error) {
	query := "SELECT id, title, url, source, source_alias, summary, llm_summary, llm_tags, quality_score, language, raw_content, points, published_at, fetched_at, enriched_at, read_status, tags, note FROM articles WHERE 1=1"
	args := []any{}

	if status != "" {
		query += " AND read_status = ?"
		args = append(args, status)
	}
	if sourceAlias != "" {
		query += " AND source_alias = ?"
		args = append(args, sourceAlias)
	}
	query += " ORDER BY fetched_at DESC"
	if limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", limit)
	}

	rows, err := d.conn.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanArticles(rows)
}

// SearchArticles 全文搜索文章
func (d *DB) SearchArticles(keyword string, limit int) ([]article.Article, error) {
	query := `
		SELECT a.id, a.title, a.url, a.source, a.source_alias, a.summary, a.llm_summary, a.llm_tags, a.quality_score, a.language, a.raw_content, a.points, a.published_at, a.fetched_at, a.enriched_at, a.read_status, a.tags, a.note
		FROM articles_fts fts
		JOIN articles a ON a.id = fts.rowid
		WHERE articles_fts MATCH ?
		ORDER BY rank
	`
	if limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", limit)
	}

	rows, err := d.conn.Query(query, buildFTSQuery(keyword))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanArticles(rows)
}

// UpdateStatus 更新文章阅读状态
func (d *DB) UpdateStatus(id int64, status article.ReadStatus) error {
	_, err := d.conn.Exec("UPDATE articles SET read_status = ? WHERE id = ?", status, id)
	return err
}

// AddNote 为文章添加笔记
func (d *DB) AddNote(id int64, note string) error {
	_, err := d.conn.Exec("UPDATE articles SET note = ? WHERE id = ?", note, id)
	return err
}

// AddTags 为文章添加标签
func (d *DB) AddTags(id int64, tags string) error {
	_, err := d.conn.Exec("UPDATE articles SET tags = ? WHERE id = ?", tags, id)
	return err
}

// GetUnenrichedArticles 获取尚未经过 LLM 增强的文章
func (d *DB) GetUnenrichedArticles(limit int) ([]article.Article, error) {
	query := `SELECT id, title, url, source, source_alias, summary, llm_summary, llm_tags, quality_score, language, raw_content, points, published_at, fetched_at, enriched_at, read_status, tags, note
		FROM articles WHERE enriched_at IS NULL ORDER BY fetched_at DESC`
	if limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", limit)
	}
	rows, err := d.conn.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanArticles(rows)
}

// UpdateEnrichment 更新 LLM 增强结果，并同步 FTS 索引
func (d *DB) UpdateEnrichment(id int64, llmSummary, llmTags, language string, score float64) error {
	_, err := d.conn.Exec(
		`UPDATE articles SET llm_summary = ?, llm_tags = ?, quality_score = ?, language = ?, enriched_at = CURRENT_TIMESTAMP WHERE id = ?`,
		llmSummary, llmTags, score, language, id,
	)
	if err != nil {
		return err
	}
	return d.reindexArticle(id)
}

// UpdateRawContent 更新原始内容
func (d *DB) UpdateRawContent(id int64, rawContent string) error {
	_, err := d.conn.Exec("UPDATE articles SET raw_content = ? WHERE id = ?", rawContent, id)
	return err
}

// SearchByKeyword 使用 LIKE 进行模糊搜索（FTS 的 fallback）
func (d *DB) SearchByKeyword(keyword string, limit int) ([]article.Article, error) {
	query := `SELECT id, title, url, source, source_alias, summary, llm_summary, llm_tags, quality_score, language, raw_content, points, published_at, fetched_at, enriched_at, read_status, tags, note
		FROM articles
		WHERE title LIKE ? OR summary LIKE ? OR llm_summary LIKE ? OR llm_tags LIKE ?
		ORDER BY quality_score DESC, fetched_at DESC
		LIMIT ?`
	pattern := "%" + keyword + "%"
	rows, err := d.conn.Query(query, pattern, pattern, pattern, pattern, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanArticles(rows)
}

// DeleteArticlesByStatus 按状态删除文章（清理用），并同步清理 FTS 索引
func (d *DB) DeleteArticlesByStatus(status article.ReadStatus, beforeDays int) error {
	// 先计算截止时间，避免 SQL 拼接注入风险
	cutoff := time.Now().AddDate(0, 0, -beforeDays).UTC().Format("2006-01-02 15:04:05")
	if _, err := d.conn.Exec(
		"DELETE FROM articles_fts WHERE rowid IN (SELECT id FROM articles WHERE read_status = ? AND fetched_at < ?)",
		status, cutoff,
	); err != nil {
		return err
	}
	_, err := d.conn.Exec(
		"DELETE FROM articles WHERE read_status = ? AND fetched_at < ?",
		status, cutoff,
	)
	return err
}

// Stats 返回按源统计的数据
func (d *DB) Stats() (map[string]map[string]any, error) {
	rows, err := d.conn.Query(`
		SELECT source_alias,
		       COUNT(*) as total,
		       SUM(CASE WHEN read_status = 'read' THEN 1 ELSE 0 END) as read_count,
		       SUM(CASE WHEN read_status = 'starred' THEN 1 ELSE 0 END) as starred_count,
		       SUM(CASE WHEN read_status = 'unread' THEN 1 ELSE 0 END) as unread_count
		FROM articles
		GROUP BY source_alias
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	stats := make(map[string]map[string]any)
	for rows.Next() {
		var alias string
		var total, readCount, starredCount, unreadCount int
		if err := rows.Scan(&alias, &total, &readCount, &starredCount, &unreadCount); err != nil {
			continue
		}
		stats[alias] = map[string]any{
			"total":     total,
			"read":      readCount,
			"starred":   starredCount,
			"unread":    unreadCount,
			"read_rate": float64(readCount+starredCount) / float64(total),
		}
	}
	return stats, nil
}

// GetArticlesSorted 按指定排序查询文章
func (d *DB) GetArticlesSorted(status article.ReadStatus, sourceAlias string, limit int, orderBy string) ([]article.Article, error) {
	query := "SELECT id, title, url, source, source_alias, summary, llm_summary, llm_tags, quality_score, language, raw_content, points, published_at, fetched_at, enriched_at, read_status, tags, note FROM articles WHERE 1=1"
	args := []any{}

	if status != "" {
		query += " AND read_status = ?"
		args = append(args, status)
	}
	if sourceAlias != "" {
		query += " AND source_alias = ?"
		args = append(args, sourceAlias)
	}

	switch orderBy {
	case "points":
		query += " ORDER BY points DESC, fetched_at DESC"
	case "points_asc":
		query += " ORDER BY points ASC, fetched_at DESC"
	default:
		query += " ORDER BY fetched_at DESC"
	}
	if limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", limit)
	}

	rows, err := d.conn.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanArticles(rows)
}

// MarkAllRead marks all articles matching criteria as read
func (d *DB) MarkAllRead(sourceAlias string) (int64, error) {
	var result sql.Result
	if sourceAlias != "" {
		result, err := d.conn.Exec("UPDATE articles SET read_status = ? WHERE source_alias = ? AND read_status = ?", article.StatusRead, sourceAlias, article.StatusUnread)
		if err != nil {
			return 0, err
		}
		return result.RowsAffected()
	}
	result, err := d.conn.Exec("UPDATE articles SET read_status = ? WHERE read_status = ?", article.StatusRead, article.StatusUnread)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

// BurstResult represents a saved burst generation
type BurstResult struct {
	ID        int64  `json:"id"`
	Mode      string `json:"mode"`
	Focus     string `json:"focus"`
	Ideas     string `json:"ideas"`
	BasedOn   int    `json:"based_on"`
	CreatedAt string `json:"created_at"`
}

// SaveBurstResult saves a burst generation to the DB
func (d *DB) SaveBurstResult(mode, focus string, ideasJSON string, basedOn int) (int64, error) {
	result, err := d.conn.Exec(
		`INSERT INTO burst_results (mode, focus, ideas, based_on) VALUES (?, ?, ?, ?)`,
		mode, focus, ideasJSON, basedOn,
	)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

// GetBurstResults returns recent burst results
func (d *DB) GetBurstResults(limit int) ([]BurstResult, error) {
	query := "SELECT id, mode, focus, ideas, based_on, created_at FROM burst_results ORDER BY created_at DESC"
	if limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", limit)
	}
	rows, err := d.conn.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []BurstResult
	for rows.Next() {
		var r BurstResult
		if err := rows.Scan(&r.ID, &r.Mode, &r.Focus, &r.Ideas, &r.BasedOn, &r.CreatedAt); err != nil {
			continue
		}
		results = append(results, r)
	}
	return results, rows.Err()
}

// GetBurstResult returns a single burst result by ID
func (d *DB) GetBurstResult(id int64) (*BurstResult, error) {
	var r BurstResult
	err := d.conn.QueryRow("SELECT id, mode, focus, ideas, based_on, created_at FROM burst_results WHERE id = ?", id).
		Scan(&r.ID, &r.Mode, &r.Focus, &r.Ideas, &r.BasedOn, &r.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &r, nil
}

// DeleteBurstResult deletes a burst result
func (d *DB) DeleteBurstResult(id int64) error {
	_, err := d.conn.Exec("DELETE FROM burst_results WHERE id = ?", id)
	return err
}

func scanArticles(rows *sql.Rows) ([]article.Article, error) {
	var articles []article.Article
	for rows.Next() {
		var a article.Article
		var publishedAt, enrichedAt sql.NullTime
		var llmSummary, llmTags, language, rawContent sql.NullString
		var qualityScore sql.NullFloat64
		var points sql.NullInt64
		err := rows.Scan(
			&a.ID, &a.Title, &a.URL, &a.Source, &a.SourceAlias,
			&a.Summary, &llmSummary, &llmTags, &qualityScore, &language, &rawContent,
			&points,
			&publishedAt, &a.FetchedAt, &enrichedAt, &a.ReadStatus, &a.Tags, &a.Note,
		)
		if err != nil {
			return nil, err
		}
		if publishedAt.Valid {
			a.PublishedAt = &publishedAt.Time
		}
		if enrichedAt.Valid {
			a.EnrichedAt = &enrichedAt.Time
		}
		if llmSummary.Valid {
			a.LLMSummary = llmSummary.String
		}
		if llmTags.Valid {
			a.LLMTags = llmTags.String
		}
		if language.Valid {
			a.Language = language.String
		}
		if rawContent.Valid {
			a.RawContent = rawContent.String
		}
		if qualityScore.Valid {
			a.QualityScore = qualityScore.Float64
		}
		if points.Valid {
			a.Points = int(points.Int64)
		}
		articles = append(articles, a)
	}
	return articles, rows.Err()
}
