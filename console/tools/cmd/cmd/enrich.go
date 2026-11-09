package cmd

import (
	"ai-news-database/internal/config"
	"ai-news-database/internal/db"
	"ai-news-database/internal/enricher"
	"context"
	"fmt"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var enrichLimit int

var enrichCmd = &cobra.Command{
	Use:   "enrich",
	Short: "对本地文章进行 LLM 增强（摘要、标签、评分）",
	Long: `读取本地尚未增强的文章，调用 LLM 生成高质量摘要、自动标签、
质量评分和语言检测。此过程会消耗 LLM API Token。`,
	Example: `  # 增强所有未处理的文章
  ai-news-database enrich

  # 仅增强最近 10 篇
  ai-news-database enrich --limit 10`,
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg, err := config.Load()
		if err != nil {
			return fmt.Errorf("加载配置失败: %w", err)
		}

		if cfg.LLM.APIKey == "" {
			return fmt.Errorf("LLM API Key 未配置。请编辑 ~/.ai-news-database/config.json 设置 llm.api_key 和 llm.base_url")
		}

		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		articles, err := database.GetUnenrichedArticles(enrichLimit)
		if err != nil {
			return fmt.Errorf("查询未增强文章失败: %w", err)
		}

		if len(articles) == 0 {
			green := color.New(color.FgGreen).SprintFunc()
			fmt.Printf("%s 没有需要增强的文章\n", green("✓"))
			return nil
		}

		enr := enricher.New(database, &cfg.LLM)
		green := color.New(color.FgGreen).SprintFunc()
		cyan := color.New(color.FgCyan).SprintFunc()
		yellow := color.New(color.FgYellow).SprintFunc()

		fmt.Printf("发现 %d 篇待增强文章，开始调用 LLM...\n\n", len(articles))

		successCount := 0
		for i, a := range articles {
			fmt.Printf("%s [%d/%d] 正在增强: %s\n", cyan("⟳"), i+1, len(articles), truncateString(a.Title, 50))
			result, err := enr.EnrichArticle(context.Background(), &a)
			if err != nil {
				fmt.Printf("  %s 失败: %v\n", yellow("⚠"), err)
				continue
			}
			fmt.Printf("  %s 摘要: %s\n", green("✓"), truncateString(result.Summary, 60))
			fmt.Printf("     标签: %s | 评分: %.1f | 语言: %s\n", result.Tags, result.Score, result.Language)
			successCount++
		}

		fmt.Println()
		fmt.Printf("%s 增强完成：成功 %d / 总计 %d\n", green("✓"), successCount, len(articles))
		return nil
	},
}

func init() {
	rootCmd.AddCommand(enrichCmd)
	enrichCmd.Flags().IntVarP(&enrichLimit, "limit", "l", 0, "限制处理文章数量（0=不限制）")
}
