package cmd

import (
	"ai-news-database/internal/db"
	"fmt"
	"strconv"
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var tagCmd = &cobra.Command{
	Use:   "tag <id> <tag1,tag2,...>",
	Short: "为文章添加标签",
	Long:  `根据文章 ID 添加标签，多个标签用逗号分隔。`,
	Example: `  ai-news-database tag 42 "golang,concurrency"
  ai-news-database tag 42 "" # 清空标签`,
	Args: cobra.MinimumNArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		id, err := strconv.ParseInt(args[0], 10, 64)
		if err != nil {
			return fmt.Errorf("无效 ID: %s", args[0])
		}

		tags := ""
		if len(args) > 1 {
			tags = strings.Join(args[1:], " ")
		}

		if err := database.AddTags(id, tags); err != nil {
			return fmt.Errorf("添加标签失败: %w", err)
		}

		green := color.New(color.FgGreen).SprintFunc()
		fmt.Printf("%s 文章 %d 的标签已更新: %s\n", green("✓"), id, tags)
		return nil
	},
}

func init() {
	rootCmd.AddCommand(tagCmd)
}
