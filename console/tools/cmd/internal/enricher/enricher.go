// Package enricher 借助 LLM 生成摘要与质量评分。
package enricher

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/config"
	"ai-news-database/internal/crawler"
	"ai-news-database/internal/db"
	"ai-news-database/internal/llm"
	"context"
	"encoding/json"
	"fmt"
	"strings"
)

// Enricher 内容增强器
type Enricher struct {
	llmClient llm.LLMClient
	reader    crawler.ContentReader
	db        *db.DB
	cfg       *config.LLMConfig
}

// Result LLM 返回的增强结果
type Result struct {
	Summary  string  `json:"summary"`
	Tags     string  `json:"tags"`
	Score    float64 `json:"score"`
	Language string  `json:"language"`
}

// New 创建 Enricher 实例
func New(database *db.DB, cfg *config.LLMConfig) *Enricher {
	return NewWithDeps(database, cfg, llm.NewClient(cfg), crawler.NewJinaReader())
}

// NewWithDeps 创建 Enricher 实例（支持依赖注入，用于测试）
func NewWithDeps(database *db.DB, cfg *config.LLMConfig, llmClient llm.LLMClient, reader crawler.ContentReader) *Enricher {
	return &Enricher{
		llmClient: llmClient,
		reader:    reader,
		db:        database,
		cfg:       cfg,
	}
}

// EnrichArticle 对单篇文章进行增强
func (e *Enricher) EnrichArticle(ctx context.Context, a *article.Article) (*Result, error) {
	// 1. 获取原始内容
	content := a.RawContent
	if len(content) < 200 {
		// 尝试用 Jina Reader 抓取正文
		content = e.reader.FetchWithFallback(a.URL)
		if content != "" {
			_ = e.db.UpdateRawContent(a.ID, content)
		}
	}

	// 如果还是没有内容，用标题 + 摘要凑合
	if len(content) < 50 {
		content = a.Title + "\n" + a.Summary
	}

	// 截断内容，控制 token 消耗
	maxChars := 12000
	if len(content) > maxChars {
		content = content[:maxChars] + "..."
	}

	prompt := fmt.Sprintf(`请阅读以下技术文章，并以严格的 JSON 格式返回分析结果，不要包含任何 markdown 代码块标记，只返回纯 JSON 字符串：
{
  "summary": "一段 2-3 句话的高质量中文摘要，说明核心观点、技术创新点和适用读者。如果原文是中文，用中文总结；如果是英文，也用中文总结。",
  "tags": "tag1,tag2,tag3,tag4,tag5",
  "score": 7.5,
  "language": "zh"
}
要求：
- tags 提取 3-5 个精准技术标签，如 golang, rust, ai, kubernetes, frontend, backend, security, database, cloud-native, devops 等
- score 是质量总分（0-10），基于技术深度、实用性、时效性、可读性综合打分
- language 填文章主要语言：zh, en, ja, 或其他

文章标题：%s
文章内容：
%s`, a.Title, content)

	resp, err := e.llmClient.SimpleChat(ctx, prompt, e.cfg.EnrichMaxTokens)
	if err != nil {
		return nil, fmt.Errorf("LLM 请求失败: %w", err)
	}

	result, err := parseResult(resp)
	if err != nil {
		return nil, fmt.Errorf("解析 LLM 结果失败: %w", err)
	}

	// 保存到数据库
	if err := e.db.UpdateEnrichment(a.ID, result.Summary, result.Tags, result.Language, result.Score); err != nil {
		return nil, fmt.Errorf("保存增强结果失败: %w", err)
	}

	return result, nil
}

func parseResult(resp string) (*Result, error) {
	// 清理可能的 markdown 代码块
	clean := strings.TrimSpace(resp)
	clean = strings.TrimPrefix(clean, "```json")
	clean = strings.TrimPrefix(clean, "```")
	clean = strings.TrimSuffix(clean, "```")
	clean = strings.TrimSpace(clean)

	var result Result
	if err := json.Unmarshal([]byte(clean), &result); err != nil {
		return nil, fmt.Errorf("JSON 解析失败: %w, 原始内容: %s", err, resp)
	}
	return &result, nil
}
