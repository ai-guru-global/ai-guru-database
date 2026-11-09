package cmd

import (
	"ai-news-database/internal/db"
	"fmt"
	"strconv"
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var noteCmd = &cobra.Command{
	Use:   "note <id> <text>",
	Short: "为文章添加笔记",
	Long:  `根据文章 ID 添加一条短笔记，后续可在列表或 TUI 中查看。`,
	Example: `  ai-news-database note 42 "核心观点：Go 的并发模型基于 CSP"
  ai-news-database note 42 "" # 清空笔记`,
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

		note := ""
		if len(args) > 1 {
			note = strings.Join(args[1:], " ")
		}

		if err := database.AddNote(id, note); err != nil {
			return fmt.Errorf("添加笔记失败: %w", err)
		}

		green := color.New(color.FgGreen).SprintFunc()
		fmt.Printf("%s 文章 %d 的笔记已更新\n", green("✓"), id)
		return nil
	},
}

func init() {
	rootCmd.AddCommand(noteCmd)
}
