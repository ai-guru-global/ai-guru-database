// Package curator 提供每日必读推荐与策展能力。
package curator

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/db"
	"fmt"
	"sort"
	"strings"
)

// Curator 智能策展器
type Curator struct {
	db *db.DB
}

// New 创建策展器
func New(database *db.DB) *Curator {
	return &Curator{db: database}
}

// ArticleScore 带策展评分的文章
type ArticleScore struct {
	article.Article
	CuratorScore float64
	Reason       string
}

// GetTopPicks 获取今日必读 Top N
func (c *Curator) GetTopPicks(limit int) ([]ArticleScore, error) {
	// 读取所有未读文章
	articles, err := c.db.GetArticles(article.StatusUnread, "", 0)
	if err != nil {
		return nil, fmt.Errorf("查询文章失败: %w", err)
	}

	// 读取用户偏好标签（基于 starred 文章）
	prefTags := c.getPreferenceTags()

	var scored []ArticleScore
	for _, a := range articles {
		score := calculateScore(a, prefTags)
		scored = append(scored, ArticleScore{
			Article:      a,
			CuratorScore: score,
			Reason:       generateReason(a, score, prefTags),
		})
	}

	// 按策展分降序
	sort.Slice(scored, func(i, j int) bool {
		return scored[i].CuratorScore > scored[j].CuratorScore
	})

	if limit > 0 && len(scored) > limit {
		scored = scored[:limit]
	}

	return scored, nil
}

func (c *Curator) getPreferenceTags() map[string]int {
	prefs := make(map[string]int)
	starred, _ := c.db.GetArticles(article.StatusStarred, "", 0)
	for _, a := range starred {
		tags := strings.Split(a.LLMTags+","+a.Tags, ",")
		for _, t := range tags {
			t = strings.TrimSpace(strings.ToLower(t))
			if t != "" {
				prefs[t]++
			}
		}
	}
	return prefs
}

func calculateScore(a article.Article, prefs map[string]int) float64 {
	score := a.QualityScore

	// 偏好匹配加分
	tags := strings.Split(a.LLMTags+","+a.Tags, ",")
	prefBonus := 0.0
	for _, t := range tags {
		t = strings.TrimSpace(strings.ToLower(t))
		if weight, ok := prefs[t]; ok {
			prefBonus += float64(weight) * 0.5
		}
	}

	// 未 enriched 的文章稍微降权，鼓励先 enrich
	if a.EnrichedAt == nil {
		score -= 1.0
	}

	return score + prefBonus
}

func generateReason(a article.Article, score float64, prefs map[string]int) string {
	if a.QualityScore >= 8.0 {
		return "高质量技术文章"
	}
	if score > a.QualityScore+1.0 {
		return "匹配你的阅读偏好"
	}
	if a.SourceAlias == "hn" {
		return "HN 热门讨论"
	}
	return "值得一看"
}
