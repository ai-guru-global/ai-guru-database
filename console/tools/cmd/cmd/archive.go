package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/db"
	"fmt"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var archiveCmd = &cobra.Command{
	Use:     "archive",
	Short:   "批量归档已读文章",
	Long:    `将所有已读状态的文章批量归档，释放收件箱空间。`,
	Example: `  ai-news-database archive`,
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		// 获取所有已读文章
		articles, err := database.GetArticles(article.StatusRead, "", 0)
		if err != nil {
			return fmt.Errorf("查询文章失败: %w", err)
		}

		green := color.New(color.FgGreen).SprintFunc()
		count := 0
		for _, a := range articles {
			if err := database.UpdateStatus(a.ID, article.StatusArchived); err == nil {
				count++
			}
		}

		fmt.Printf("%s 已归档 %d 篇文章\n", green("✓"), count)
		return nil
	},
}

func init() {
	rootCmd.AddCommand(archiveCmd)
}
