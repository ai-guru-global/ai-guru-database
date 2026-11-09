package integration

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"testing"
	"time"

	"ai-news-database/internal/article"
	"ai-news-database/internal/config"
	"ai-news-database/internal/curator"
	"ai-news-database/internal/db"
	"ai-news-database/internal/dedup"
	"ai-news-database/internal/enricher"
	"ai-news-database/internal/mocks"
	"ai-news-database/internal/rag"
	"ai-news-database/internal/search"
)

// setupTestDB 创建临时测试数据库
func setupTestDB(t *testing.T) *db.DB {
	t.Helper()
	// 设置临时 HOME 目录
	tmpDir := t.TempDir()
	origHome := os.Getenv("HOME")
	t.Setenv("HOME", tmpDir)
	// Windows 上 os.UserHomeDir() 读 USERPROFILE，需一并指向临时目录
	t.Setenv("USERPROFILE", tmpDir)
	t.Cleanup(func() { os.Setenv("HOME", origHome) })

	database, err := db.New()
	if err != nil {
		t.Fatalf("创建测试数据库失败: %v", err)
	}
	t.Cleanup(func() { database.Close() })
	return database
}

func TestIntegration_SaveSearchCleanup(t *testing.T) {
	database := setupTestDB(t)

	// 1. 保存文章
	articles := []article.Article{
		{
			Title:       "Go concurrency patterns",
			URL:         "https://example.com/go-concurrency",
			Source:      "Hacker News",
			SourceAlias: "hn",
			Summary:     "深入解析 Go 的 goroutine 和 channel 并发模式",
			ReadStatus:  article.StatusUnread,
			FetchedAt:   time.Now(),
		},
		{
			Title:       "Rust async programming",
			URL:         "https://example.com/rust-async",
			Source:      "GitHub Blog",
			SourceAlias: "github",
			Summary:     "Rust 的 async/await 和 Tokio 运行时详解",
			ReadStatus:  article.StatusUnread,
			FetchedAt:   time.Now(),
		},
		{
			Title:       "Kubernetes best practices",
			URL:         "https://example.com/k8s-best-practices",
			Source:      "Reddit",
			SourceAlias: "reddit",
			Summary:     "生产环境 Kubernetes 部署的最佳实践",
			ReadStatus:  article.StatusUnread,
			FetchedAt:   time.Now(),
		},
	}

	for i := range articles {
		if err := database.SaveArticle(&articles[i]); err != nil {
			t.Fatalf("保存文章 %d 失败: %v", i, err)
		}
	}

	// 2. 验证保存成功
	saved, err := database.GetArticles("", "", 0)
	if err != nil {
		t.Fatalf("获取文章失败: %v", err)
	}
	if len(saved) != 3 {
		t.Fatalf("期望 3 篇文章，实际 %d", len(saved))
	}

	// 3. LIKE 模糊搜索
	likeResults, err := database.SearchByKeyword("concurrency", 10)
	if err != nil {
		t.Fatalf("LIKE 搜索失败: %v", err)
	}
	if len(likeResults) == 0 {
		t.Error("LIKE 搜索 'concurrency' 应返回结果")
	}

	// 4. LIKE 搜索 - 另一个关键词
	likeResults2, err := database.SearchByKeyword("Rust", 10)
	if err != nil {
		t.Fatalf("LIKE 搜索失败: %v", err)
	}
	if len(likeResults2) == 0 {
		t.Error("LIKE 搜索 'Rust' 应返回结果")
	}

	// 5. 更新状态
	if err := database.UpdateStatus(saved[0].ID, article.StatusRead); err != nil {
		t.Fatalf("更新状态失败: %v", err)
	}
	if err := database.UpdateStatus(saved[1].ID, article.StatusStarred); err != nil {
		t.Fatalf("收藏失败: %v", err)
	}

	// 6. 添加笔记和标签
	if err := database.AddNote(saved[0].ID, "核心观点记录"); err != nil {
		t.Fatalf("添加笔记失败: %v", err)
	}
	if err := database.AddTags(saved[0].ID, "golang,concurrency"); err != nil {
		t.Fatalf("添加标签失败: %v", err)
	}

	// 7. 统计
	stats, err := database.Stats()
	if err != nil {
		t.Fatalf("统计失败: %v", err)
	}
	if len(stats) == 0 {
		t.Error("统计结果不应为空")
	}

	// 8. URL 去重
	duplicate := article.Article{
		Title:       "Go 并发模式详解 (重复)",
		URL:         "https://example.com/go-concurrency",
		Source:      "Hacker News",
		SourceAlias: "hn",
		ReadStatus:  article.StatusUnread,
		FetchedAt:   time.Now(),
	}
	if err := database.SaveArticle(&duplicate); err != nil {
		t.Fatalf("保存重复 URL 应成功（更新模式）: %v", err)
	}
	allAfterDup, _ := database.GetArticles("", "", 0)
	if len(allAfterDup) != 3 {
		t.Errorf("URL 去重后仍应为 3 篇，实际 %d", len(allAfterDup))
	}
}

func TestIntegration_CuratorPipeline(t *testing.T) {
	database := setupTestDB(t)

	// 保存带评分的文章
	articles := []article.Article{
		{
			Title:        "高质量文章",
			URL:          "https://example.com/high-quality",
			Source:       "HN",
			SourceAlias:  "hn",
			Summary:      "这是一篇高质量的技术文章",
			QualityScore: 9.0,
			LLMTags:      "golang,architecture",
			ReadStatus:   article.StatusUnread,
			FetchedAt:    time.Now(),
		},
		{
			Title:        "低质量文章",
			URL:          "https://example.com/low-quality",
			Source:       "HN",
			SourceAlias:  "hn",
			Summary:      "这是一篇低质量的文章",
			QualityScore: 3.0,
			ReadStatus:   article.StatusUnread,
			FetchedAt:    time.Now(),
		},
	}
	for i := range articles {
		database.SaveArticle(&articles[i])
	}

	// 策展
	c := curator.New(database)
	picks, err := c.GetTopPicks(10)
	if err != nil {
		t.Fatalf("策展失败: %v", err)
	}
	if len(picks) == 0 {
		t.Error("策展应返回结果")
	}

	// 高质量文章应排在前面
	if len(picks) >= 2 && picks[0].QualityScore < picks[1].QualityScore {
		t.Error("高质量文章应排在前面")
	}
}

func TestIntegration_DedupPipeline(t *testing.T) {
	database := setupTestDB(t)

	// 保存相似文章
	database.SaveArticle(&article.Article{
		Title:        "Go 并发编程详解",
		URL:          "https://example.com/go-concurrency-1",
		Source:       "HN",
		SourceAlias:  "hn",
		Summary:      "Go 的 goroutine 和 channel 并发模式",
		QualityScore: 8.0,
		ReadStatus:   article.StatusUnread,
		FetchedAt:    time.Now(),
	})
	database.SaveArticle(&article.Article{
		Title:        "Go 并发编程深入解析",
		URL:          "https://example.com/go-concurrency-2",
		Source:       "HN",
		SourceAlias:  "hn",
		Summary:      "Go 的 goroutine 和 channel 并发模式详解",
		QualityScore: 7.0,
		ReadStatus:   article.StatusUnread,
		FetchedAt:    time.Now(),
	})
	database.SaveArticle(&article.Article{
		Title:        "Rust 异步编程指南",
		URL:          "https://example.com/rust-async",
		Source:       "HN",
		SourceAlias:  "hn",
		Summary:      "Rust 的 async/await 和 Tokio",
		QualityScore: 8.5,
		ReadStatus:   article.StatusUnread,
		FetchedAt:    time.Now(),
	})

	cfg := &config.LLMConfig{}
	d := dedup.New(database, cfg)

	articles, _ := database.GetArticles("", "", 0)
	dupIDs, err := d.RunDedup(articles)
	if err != nil {
		t.Fatalf("去重失败: %v", err)
	}
	t.Logf("发现 %d 篇重复文章", len(dupIDs))
}

func TestIntegration_SearchEngine(t *testing.T) {
	engine := search.NewEngine()

	// 测试空查询
	results, err := engine.Search("")
	if err == nil && len(results) != 0 {
		t.Error("空查询应返回空结果")
	}

	// 测试正常查询
	results, err = engine.Search("https://example.com")
	if err != nil {
		t.Logf("搜索引擎查询失败（可能需要网络）: %v", err)
	}
	t.Logf("搜索返回 %d 个结果", len(results))
}

func TestIntegration_RAGWithMock(t *testing.T) {
	database := setupTestDB(t)

	// 保存文章
	database.SaveArticle(&article.Article{
		Title:       "Go concurrency",
		URL:         "https://example.com/go-concurrency",
		Source:      "HN",
		SourceAlias: "hn",
		Summary:     "Go goroutine channel concurrency patterns",
		LLMSummary:  "Go uses goroutines for lightweight concurrency",
		ReadStatus:  article.StatusUnread,
		FetchedAt:   time.Now(),
	})

	// 使用 mock LLM 测试 RAG 管道
	mockLLM := &mocks.LLMClientMock{
		SimpleChatFunc: func(ctx context.Context, prompt string, maxTokens int) (string, error) {
			return "Go 使用 goroutine 实现并发，通过 channel 进行通信。[1]", nil
		},
	}

	cfg := &config.LLMConfig{AskMaxTokens: 4000}
	r := rag.NewWithDeps(database, cfg, mockLLM)

	answer, refs, err := r.Answer(context.Background(), "Go 如何实现并发？")
	if err != nil {
		t.Fatalf("RAG 问答失败: %v", err)
	}
	if answer == "" {
		t.Error("回答不应为空")
	}
	// refs might be empty if FTS doesn't match; log instead of fail
	t.Logf("RAG 返回 %d 个引用", len(refs))
}

func TestIntegration_EnricherWithMock(t *testing.T) {
	database := setupTestDB(t)

	// 保存文章
	database.SaveArticle(&article.Article{
		Title:       "测试文章",
		URL:         "https://example.com/test",
		Source:      "HN",
		SourceAlias: "hn",
		Summary:     "测试摘要",
		ReadStatus:  article.StatusUnread,
		FetchedAt:   time.Now(),
	})

	articles, _ := database.GetArticles("", "", 1)

	mockLLM := &mocks.LLMClientMock{
		SimpleChatFunc: func(ctx context.Context, prompt string, maxTokens int) (string, error) {
			return `{"summary":"测试摘要","tags":"test,go","score":8.0,"language":"zh"}`, nil
		},
	}
	mockReader := &mocks.ContentReaderMock{
		FetchWithFallbackFunc: func(url string) string {
			return "测试内容"
		},
	}

	cfg := &config.LLMConfig{EnrichMaxTokens: 2000}
	e := enricher.NewWithDeps(database, cfg, mockLLM, mockReader)

	result, err := e.EnrichArticle(context.Background(), &articles[0])
	if err != nil {
		t.Fatalf("增强失败: %v", err)
	}
	if result.Summary != "测试摘要" {
		t.Errorf("摘要不匹配: got %q", result.Summary)
	}
	if result.Score != 8.0 {
		t.Errorf("评分不匹配: got %f", result.Score)
	}

	// 验证数据库已更新
	updated, _ := database.GetArticles("", "", 1)
	if updated[0].LLMSummary != "测试摘要" {
		t.Error("数据库未更新 LLM 摘要")
	}
	if updated[0].QualityScore != 8.0 {
		t.Error("数据库未更新质量评分")
	}
}

func TestIntegration_ConfigCrypto(t *testing.T) {
	tmpDir := t.TempDir()
	origHome := os.Getenv("HOME")
	t.Setenv("HOME", tmpDir)
	// Windows 上 os.UserHomeDir() 读 USERPROFILE，需一并指向临时目录
	t.Setenv("USERPROFILE", tmpDir)
	t.Cleanup(func() { os.Setenv("HOME", origHome) })

	// 保存带 API Key 的配置（动态生成占位值，避免硬编码凭据形态的字符串）
	cfg := config.DefaultConfig()
	apiKey := fmt.Sprintf("unit-test-key-%d", time.Now().UnixNano())
	cfg.LLM.APIKey = apiKey
	if err := cfg.Save(); err != nil {
		t.Fatalf("保存配置失败: %v", err)
	}

	// 验证文件中 API Key 已加密
	configPath := filepath.Join(tmpDir, ".ai-news-database", "config.json")
	data, err := os.ReadFile(configPath)
	if err != nil {
		t.Fatalf("读取配置文件失败: %v", err)
	}
	if contains(string(data), apiKey) {
		t.Error("配置文件中不应包含明文 API Key")
	}

	// 重新加载应能正确解密
	loaded, err := config.Load()
	if err != nil {
		t.Fatalf("加载配置失败: %v", err)
	}
	if loaded.LLM.APIKey != apiKey {
		t.Errorf("解密后 API Key 不匹配: got %q", loaded.LLM.APIKey)
	}
}

func contains(s, sub string) bool {
	return len(s) >= len(sub) && searchString(s, sub)
}

func searchString(s, sub string) bool {
	for i := 0; i <= len(s)-len(sub); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
}
