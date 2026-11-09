// Package dedup 提供文章去重能力。
package dedup

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/config"
	"ai-news-database/internal/db"
	"ai-news-database/internal/llm"
	"fmt"
	"strings"
)

// Deduper 去重器
type Deduper struct {
	db        *db.DB
	llmClient *llm.Client
	cfg       *config.LLMConfig
}

// New 创建去重器
func New(database *db.DB, cfg *config.LLMConfig) *Deduper {
	var client *llm.Client
	if cfg.APIKey != "" {
		client = llm.NewClient(cfg)
	}
	return &Deduper{
		db:        database,
		llmClient: client,
		cfg:       cfg,
	}
}

// RunDedup 对指定文章执行去重
func (d *Deduper) RunDedup(candidates []article.Article) ([]int64, error) {
	if len(candidates) < 2 {
		return nil, nil
	}

	var dupIDs []int64
	seen := make(map[int64]bool)

	for i := 0; i < len(candidates); i++ {
		if seen[candidates[i].ID] {
			continue
		}
		for j := i + 1; j < len(candidates); j++ {
			if seen[candidates[j].ID] {
				continue
			}
			if isDuplicate(candidates[i], candidates[j]) {
				// 保留质量高的一篇
				keep, discard := candidates[i], candidates[j]
				if discard.QualityScore > keep.QualityScore {
					keep, discard = discard, keep
				}
				seen[discard.ID] = true
				dupIDs = append(dupIDs, discard.ID)
			}
		}
	}

	return dupIDs, nil
}

func isDuplicate(a, b article.Article) bool {
	// URL 去重（已经处理了，这里作为兜底）
	if a.URL == b.URL {
		return true
	}

	// 标题高度相似
	if similarity(a.Title, b.Title) > 0.85 {
		return true
	}

	// LLM 标签高度重叠
	if a.LLMTags != "" && b.LLMTags != "" {
		tagsA := splitTags(a.LLMTags)
		tagsB := splitTags(b.LLMTags)
		overlap := 0
		for t := range tagsA {
			if tagsB[t] {
				overlap++
			}
		}
		if len(tagsA) > 0 && float64(overlap)/float64(len(tagsA)) > 0.8 {
			return true
		}
	}

	return false
}

func similarity(a, b string) float64 {
	// 简单 Jaccard 相似度基于字符 bigram
	if len(a) < 3 || len(b) < 3 {
		return 0
	}
	setA := make(map[string]struct{})
	for i := 0; i < len(a)-1; i++ {
		setA[a[i:i+2]] = struct{}{}
	}
	setB := make(map[string]struct{})
	for i := 0; i < len(b)-1; i++ {
		setB[b[i:i+2]] = struct{}{}
	}

	intersection := 0
	for k := range setA {
		if _, ok := setB[k]; ok {
			intersection++
		}
	}
	union := len(setA) + len(setB) - intersection
	if union == 0 {
		return 0
	}
	return float64(intersection) / float64(union)
}

func splitTags(s string) map[string]bool {
	result := make(map[string]bool)
	for _, t := range strings.Split(s, ",") {
		t = strings.TrimSpace(strings.ToLower(t))
		if t != "" {
			result[t] = true
		}
	}
	return result
}

// MarkDuplicates 标记重复文章为 discarded
func (d *Deduper) MarkDuplicates(ids []int64) error {
	for _, id := range ids {
		if err := d.db.UpdateStatus(id, article.StatusDiscarded); err != nil {
			return fmt.Errorf("标记重复文章 %d 失败: %w", id, err)
		}
	}
	return nil
}
