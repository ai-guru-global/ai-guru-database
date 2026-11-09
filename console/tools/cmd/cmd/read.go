package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/db"
	"fmt"
	"strconv"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var readCmd = &cobra.Command{
	Use:   "read <id>",
	Short: "将文章标记为已读",
	Long:  `根据文章 ID 将文章标记为已读状态。`,
	Example: `  ai-news-database read 42
  ai-news-database read 1 2 3`,
	Args: cobra.MinimumNArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		green := color.New(color.FgGreen).SprintFunc()
		for _, arg := range args {
			id, err := strconv.ParseInt(arg, 10, 64)
			if err != nil {
				fmt.Printf("无效 ID: %s\n", arg)
				continue
			}
			if err := database.UpdateStatus(id, article.StatusRead); err != nil {
				fmt.Printf("标记失败 ID %d: %v\n", id, err)
				continue
			}
			fmt.Printf("%s 文章 %d 已标记为已读\n", green("✓"), id)
		}
		return nil
	},
}

func init() {
	rootCmd.AddCommand(readCmd)
}
