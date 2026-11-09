package cmd

import (
	"ai-news-database/internal/config"
	"ai-news-database/internal/curator"
	"ai-news-database/internal/db"
	"ai-news-database/internal/dedup"
	"fmt"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var curateTop int
var curateAutoDiscard bool

var curateCmd = &cobra.Command{
	Use:   "curate",
	Short: "智能策展：生成今日必读清单",
	Long: `基于 LLM 质量评分和你的阅读偏好，自动筛选最值得阅读的文章，
并可选自动丢弃低质量和重复内容。`,
	Example: `  # 生成今日 Top 10 必读
  ai-news-database curate --top 10

  # 同时自动清理低质量和重复文章
  ai-news-database curate --top 10 --auto-discard`,
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		cfg, _ := config.Load()

		// 1. 先去重
		if curateAutoDiscard {
			unread, err := database.GetArticles("", "", 0)
			if err != nil {
				return fmt.Errorf("查询文章失败: %w", err)
			}
			d := dedup.New(database, &cfg.LLM)
			dupIDs, err := d.RunDedup(unread)
			if err != nil {
				return fmt.Errorf("去重失败: %w", err)
			}
			if len(dupIDs) > 0 {
				if err := d.MarkDuplicates(dupIDs); err != nil {
					return fmt.Errorf("标记重复失败: %w", err)
				}
				yellow := color.New(color.FgYellow).SprintFunc()
				fmt.Printf("%s 自动丢弃了 %d 篇重复/低质量文章\n\n", yellow("🧹"), len(dupIDs))
			}
		}

		// 2. 策展
		c := curator.New(database)
		picks, err := c.GetTopPicks(curateTop)
		if err != nil {
			return fmt.Errorf("策展失败: %w", err)
		}

		if len(picks) == 0 {
			yellow := color.New(color.FgYellow).SprintFunc()
			fmt.Printf("%s 暂无可推荐文章，先执行 'ai-news-database sync' 和 'ai-news-database enrich'\n", yellow("!"))
			return nil
		}

		bold := color.New(color.Bold).SprintFunc()
		fmt.Println(bold("━━━ 🎯 今日必读清单 ━━━"))
		fmt.Println()

		green := color.New(color.FgGreen).SprintFunc()
		cyan := color.New(color.FgCyan).SprintFunc()
		gray := color.New(color.FgHiBlack).SprintFunc()

		for i, p := range picks {
			fmt.Printf("%s %s\n", cyan(fmt.Sprintf("%d.", i+1)), bold(truncateString(p.Title, 55)))
			fmt.Printf("   %s  %s\n", gray(p.Source), green(fmt.Sprintf("评分 %.1f", p.QualityScore)))
			if p.LLMSummary != "" {
				fmt.Printf("   %s\n", truncateString(p.LLMSummary, 70))
			}
			fmt.Printf("   %s\n", gray(fmt.Sprintf("推荐理由: %s", p.Reason)))
			fmt.Printf("   %s\n", makeClickableURL(truncateString(p.URL, 50)))
			fmt.Println()
		}

		fmt.Printf("共推荐 %d 篇文章，祝你阅读愉快！\n", len(picks))
		fmt.Println(gray("💡 在 TUI 中使用 'ai-news-database inbox' 快速浏览和处理"))
		return nil
	},
}

func init() {
	rootCmd.AddCommand(curateCmd)
	curateCmd.Flags().IntVarP(&curateTop, "top", "t", 10, "推荐文章数量")
	curateCmd.Flags().BoolVarP(&curateAutoDiscard, "auto-discard", "d", false, "自动丢弃重复和低质量文章")
}
