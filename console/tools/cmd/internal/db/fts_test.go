package db

import (
	"path/filepath"
	"strings"
	"testing"
	"time"

	"ai-news-database/internal/article"
)

// setupTestDB 创建临时目录中的测试数据库（已完成迁移）
func setupTestDB(t *testing.T) *DB {
	t.Helper()
	dbPath := filepath.Join(t.TempDir(), "fts_test.db")
	conn, err := newTestDB(dbPath)
	if err != nil {
		t.Fatalf("failed to create test db: %v", err)
	}
	db := &DB{conn: conn}
	if err := db.migrate(); err != nil {
		t.Fatalf("migrate failed: %v", err)
	}
	return db
}

func TestSegmentCJK(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{"纯英文不变", "Hello World", "Hello World"},
		{"空字符串", "", ""},
		{"中文单字切分", "模型", " 模  型 "},
		{"中英混排", "GPT模型", "GPT 模  型 "},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := segmentCJK(tt.input); got != tt.want {
				t.Errorf("segmentCJK(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}

func TestBuildFTSQuery(t *testing.T) {
	tests := []struct {
		name    string
		keyword string
		want    string
	}{
		{"英文词条", "golang", `"golang"`},
		{"多个英文词条", "go sqlite", `"go" "sqlite"`},
		{"中文词条转短语", "模型", `"模  型"`},
		{"双引号转义", `a"b`, `"a""b"`},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := buildFTSQuery(tt.keyword); got != tt.want {
				t.Errorf("buildFTSQuery(%q) = %q, want %q", tt.keyword, got, tt.want)
			}
		})
	}
}

func TestSearchArticles_Chinese(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	now := time.Now()
	samples := []article.Article{
		{Title: "大模型推理成本持续下降", URL: "https://example.com/cn-1", Source: "测试", SourceAlias: "test", Summary: "推理与基础设施观察", FetchedAt: now, ReadStatus: article.StatusUnread},
		{Title: "Anthropic 发布新版 Claude", URL: "https://example.com/cn-2", Source: "测试", SourceAlias: "test", Summary: "智能体平台动态", FetchedAt: now, ReadStatus: article.StatusUnread},
		{Title: "Pure English Article", URL: "https://example.com/en-1", Source: "test", SourceAlias: "test", Summary: "nothing related", FetchedAt: now, ReadStatus: article.StatusUnread},
	}
	for i := range samples {
		if err := db.SaveArticle(&samples[i]); err != nil {
			t.Fatalf("SaveArticle failed: %v", err)
		}
	}

	// 中文关键词应能命中标题
	results, err := db.SearchArticles("推理", 10)
	if err != nil {
		t.Fatalf("SearchArticles(推理) failed: %v", err)
	}
	if len(results) == 0 {
		t.Fatal("中文关键词搜索应返回结果，实际为空")
	}
	for _, r := range results {
		if !strings.Contains(r.Title+r.Summary, "推理") {
			t.Errorf("命中结果与关键词无关: %s", r.Title)
		}
	}

	// 中文关键词应能命中摘要
	results, err = db.SearchArticles("智能体", 10)
	if err != nil {
		t.Fatalf("SearchArticles(智能体) failed: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("期望命中 1 条，实际 %d 条", len(results))
	}

	// 更新后索引应同步
	if err := db.UpdateEnrichment(results[0].ID, "多模态能力增强", "ai", "zh", 0.9); err != nil {
		t.Fatalf("UpdateEnrichment failed: %v", err)
	}
	results, err = db.SearchArticles("多模态", 10)
	if err != nil {
		t.Fatalf("SearchArticles(多模态) failed: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("增强后索引未同步，期望命中 1 条，实际 %d 条", len(results))
	}
}

func TestMigrateFTS_RebuildFromLegacy(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	a := article.Article{Title: "向量检索实践", URL: "https://example.com/legacy-1", Source: "测试", SourceAlias: "test", FetchedAt: time.Now(), ReadStatus: article.StatusUnread}
	if err := db.SaveArticle(&a); err != nil {
		t.Fatalf("SaveArticle failed: %v", err)
	}

	// 全量重建后仍可搜索
	if err := db.RebuildFTSIndex(); err != nil {
		t.Fatalf("RebuildFTSIndex failed: %v", err)
	}
	results, err := db.SearchArticles("向量", 10)
	if err != nil {
		t.Fatalf("SearchArticles failed: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("重建索引后期望命中 1 条，实际 %d 条", len(results))
	}
}
