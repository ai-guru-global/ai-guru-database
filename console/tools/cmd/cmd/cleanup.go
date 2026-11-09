package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/db"
	"fmt"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var cleanupCmd = &cobra.Command{
	Use:   "cleanup",
	Short: "清理本地数据库中的旧文章",
	Long: `根据阅读状态自动清理过期文章：
- 丢弃(discarded) 超过 7 天的文章直接删除
- 归档(archived) 超过 30 天的文章直接删除`,
	Example: `  ai-news-database cleanup`,
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		green := color.New(color.FgGreen).SprintFunc()

		// 清理丢弃文章（7天）
		err1 := database.DeleteArticlesByStatus(article.StatusDiscarded, 7)
		// 清理归档文章（30天）
		err2 := database.DeleteArticlesByStatus(article.StatusArchived, 30)

		if err1 != nil {
			fmt.Printf("清理丢弃文章时出错: %v\n", err1)
		}
		if err2 != nil {
			fmt.Printf("清理归档文章时出错: %v\n", err2)
		}

		fmt.Printf("%s 清理完成\n", green("✓"))
		fmt.Println("💡 丢弃超过 7 天、归档超过 30 天的文章已被删除")
		return nil
	},
}

func init() {
	rootCmd.AddCommand(cleanupCmd)
}
