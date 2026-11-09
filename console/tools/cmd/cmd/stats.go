package cmd

import (
	"ai-news-database/internal/db"
	"fmt"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var statsCmd = &cobra.Command{
	Use:     "stats",
	Short:   "查看订阅健康度统计",
	Long:    `显示各官方源的文章数量、阅读率、收藏率等健康度指标。`,
	Example: `  ai-news-database stats`,
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		stats, err := database.Stats()
		if err != nil {
			return fmt.Errorf("获取统计失败: %w", err)
		}

		if len(stats) == 0 {
			yellow := color.New(color.FgYellow).SprintFunc()
			fmt.Printf("%s 暂无统计数据，先执行 'ai-news-database sync' 拉取文章\n", yellow("!"))
			return nil
		}

		bold := color.New(color.Bold).SprintFunc()
		fmt.Println(bold("━━━ 订阅健康度报告 ━━━"))
		fmt.Println()

		// 表头
		fmt.Printf("%-14s %-8s %-8s %-8s %-8s %-10s\n", "源", "总数", "已读", "收藏", "未读", "阅读率")
		fmt.Println("────────────────────────────────────────────────────────────")

		green := color.New(color.FgGreen).SprintFunc()
		red := color.New(color.FgRed).SprintFunc()
		yellow := color.New(color.FgYellow).SprintFunc()

		var totalAll, totalRead, totalStarred, totalUnread int

		for alias, s := range stats {
			total := s["total"].(int)
			read := s["read"].(int)
			starred := s["starred"].(int)
			unread := s["unread"].(int)
			readRate := s["read_rate"].(float64)

			totalAll += total
			totalRead += read
			totalStarred += starred
			totalUnread += unread

			rateStr := fmt.Sprintf("%.0f%%", readRate*100)
			var rateColored string
			if readRate >= 0.7 {
				rateColored = green(rateStr)
			} else if readRate >= 0.3 {
				rateColored = yellow(rateStr)
			} else {
				rateColored = red(rateStr)
			}

			fmt.Printf("%-14s %-8d %-8d %-8d %-8s %s\n",
				truncateString(alias, 14),
				total,
				read,
				starred,
				fmt.Sprintf("%d", unread),
				rateColored,
			)
		}

		fmt.Println("────────────────────────────────────────────────────────────")
		overallRate := float64(totalRead+totalStarred) / float64(totalAll)
		fmt.Printf("%-14s %-8d %-8d %-8d %-8d %.0f%%\n", "总计", totalAll, totalRead, totalStarred, totalUnread, overallRate*100)
		fmt.Println()

		// 健康建议
		fmt.Println(bold("💡 健康建议："))
		for alias, s := range stats {
			readRate := s["read_rate"].(float64)
			if readRate < 0.2 && s["total"].(int) > 5 {
				fmt.Printf("   %s 阅读率低于 20%%，建议考虑是否继续订阅 %s\n", yellow("⚠"), alias)
			}
		}
		if totalUnread > 50 {
			fmt.Printf("   %s 未读文章堆积 (%d 篇)，建议执行 'ai-news-database archive' 或 'ai-news-database list --articles --status unread' 清理\n", red("!"), totalUnread)
		}
		if totalUnread <= 10 {
			fmt.Printf("   %s 收件箱很健康，继续保持！\n", green("✓"))
		}

		return nil
	},
}

func init() {
	rootCmd.AddCommand(statsCmd)
}
