package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/db"
	"fmt"
	"strconv"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var discardCmd = &cobra.Command{
	Use:   "discard <id>",
	Short: "丢弃文章",
	Long:  `根据文章 ID 将文章标记为丢弃状态，后续可被清理。`,
	Example: `  ai-news-database discard 42
  ai-news-database discard 1 2 3`,
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
			if err := database.UpdateStatus(id, article.StatusDiscarded); err != nil {
				fmt.Printf("丢弃失败 ID %d: %v\n", id, err)
				continue
			}
			fmt.Printf("%s 文章 %d 已丢弃\n", green("✓"), id)
		}
		return nil
	},
}

func init() {
	rootCmd.AddCommand(discardCmd)
}
