package db

import (
	"database/sql"
	"fmt"
	"strings"
	"unicode"
)

// FTS5 中文分词支持
//
// SQLite FTS5 默认的 unicode61 tokenizer 无法切分中文（CJK 文本没有空格边界），
// 导致中文关键词几乎搜不到结果。这里采用「单字切分」方案：
//   - 写入索引前，将每个汉字两侧插入空格，使其成为独立 token；
//   - 查询时，将中文关键词转换为 FTS5 短语查询（如 "人 工 智 能"），
//     短语查询要求 token 相邻，等价于子串匹配，兼顾召回与精度。
//
// 为此 articles_fts 从外部内容表（content='articles' + 触发器同步）改为
// 独立 FTS 表，由 Go 侧在写入路径上同步分词后的文本。

// segmentCJK 在每个汉字两侧插入空格，使 unicode61 tokenizer 可按单字切分
func segmentCJK(s string) string {
	if s == "" {
		return s
	}
	var b strings.Builder
	b.Grow(len(s) * 2)
	for _, r := range s {
		if unicode.Is(unicode.Han, r) {
			b.WriteByte(' ')
			b.WriteRune(r)
			b.WriteByte(' ')
		} else {
			b.WriteRune(r)
		}
	}
	return b.String()
}

// containsHan 判断字符串是否包含汉字
func containsHan(s string) bool {
	for _, r := range s {
		if unicode.Is(unicode.Han, r) {
			return true
		}
	}
	return false
}

// buildFTSQuery 将用户关键词转换为安全的 FTS5 查询表达式：
// 每个词条包裹为短语（转义内部双引号），中文词条先做单字切分，
// 多个词条之间为隐式 AND 关系。
func buildFTSQuery(keyword string) string {
	terms := strings.Fields(keyword)
	parts := make([]string, 0, len(terms))
	for _, t := range terms {
		if containsHan(t) {
			t = strings.TrimSpace(segmentCJK(t))
		}
		t = strings.ReplaceAll(t, `"`, `""`)
		parts = append(parts, `"`+t+`"`)
	}
	return strings.Join(parts, " ")
}

// migrateFTS 创建独立 FTS 表；若检测到旧版外部内容表则重建并回填索引
func (d *DB) migrateFTS() error {
	var ddl sql.NullString
	err := d.conn.QueryRow(
		"SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'articles_fts'",
	).Scan(&ddl)

	needRebuild := false
	if err == nil && strings.Contains(ddl.String, "content=") {
		// 旧版外部内容表 + 触发器同步：索引中是未分词文本，需要整体重建
		drops := []string{
			"DROP TRIGGER IF EXISTS articles_ai",
			"DROP TRIGGER IF EXISTS articles_ad",
			"DROP TRIGGER IF EXISTS articles_au",
			"DROP TABLE IF EXISTS articles_fts",
		}
		for _, stmt := range drops {
			if _, err := d.conn.Exec(stmt); err != nil {
				return fmt.Errorf("清理旧版 FTS 结构失败: %w", err)
			}
		}
		needRebuild = true
	}

	if _, err := d.conn.Exec(`
CREATE VIRTUAL TABLE IF NOT EXISTS articles_fts USING fts5(
    title, summary, llm_summary, tokenize='unicode61'
);`); err != nil {
		return fmt.Errorf("创建 FTS 表失败: %w", err)
	}

	// 兜底清理历史触发器（它们会写入未分词文本，污染索引）
	for _, trg := range []string{"articles_ai", "articles_ad", "articles_au"} {
		if _, err := d.conn.Exec("DROP TRIGGER IF EXISTS " + trg); err != nil {
			return fmt.Errorf("清理触发器失败: %w", err)
		}
	}

	if needRebuild {
		return d.RebuildFTSIndex()
	}
	return nil
}

// RebuildFTSIndex 从 articles 表全量重建 FTS 索引
func (d *DB) RebuildFTSIndex() error {
	if _, err := d.conn.Exec("DELETE FROM articles_fts"); err != nil {
		return err
	}
	rows, err := d.conn.Query("SELECT id, title, summary, llm_summary FROM articles")
	if err != nil {
		return err
	}
	defer rows.Close()

	type ftsRow struct {
		id                        int64
		title, summary, llmSummar string
	}
	var pending []ftsRow
	for rows.Next() {
		var id int64
		var title string
		var summary, llmSummary sql.NullString
		if err := rows.Scan(&id, &title, &summary, &llmSummary); err != nil {
			return err
		}
		pending = append(pending, ftsRow{id, title, summary.String, llmSummary.String})
	}
	if err := rows.Err(); err != nil {
		return err
	}

	for _, r := range pending {
		if _, err := d.conn.Exec(
			"INSERT INTO articles_fts(rowid, title, summary, llm_summary) VALUES (?, ?, ?, ?)",
			r.id, segmentCJK(r.title), segmentCJK(r.summary), segmentCJK(r.llmSummar),
		); err != nil {
			return err
		}
	}
	return nil
}

// reindexArticle 以 articles 表为准，重建单篇文章的 FTS 索引行
func (d *DB) reindexArticle(id int64) error {
	var title string
	var summary, llmSummary sql.NullString
	err := d.conn.QueryRow(
		"SELECT title, summary, llm_summary FROM articles WHERE id = ?", id,
	).Scan(&title, &summary, &llmSummary)
	if err != nil {
		return err
	}
	if _, err := d.conn.Exec("DELETE FROM articles_fts WHERE rowid = ?", id); err != nil {
		return err
	}
	_, err = d.conn.Exec(
		"INSERT INTO articles_fts(rowid, title, summary, llm_summary) VALUES (?, ?, ?, ?)",
		id, segmentCJK(title), segmentCJK(summary.String), segmentCJK(llmSummary.String),
	)
	return err
}
