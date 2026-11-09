package cmd

import (
	"ai-news-database/internal/db"
	"ai-news-database/internal/tui"
	"fmt"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

var inboxCmd = &cobra.Command{
	Use:   "inbox",
	Short: "进入 TUI 收件箱快速浏览文章",
	Long: `启动交互式 TUI 界面浏览本地文章。

快捷键：
  j / ↓    向下移动
  k / ↑    向上移动
  r        标记为已读
  s        收藏
  d        丢弃
  a        归档
  1        显示全部文章
  2        显示未读文章
  3        显示收藏文章
  q / Esc  退出`,
	Example: `  ai-news-database inbox`,
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		model := tui.NewModel(database)
		p := tea.NewProgram(model, tea.WithAltScreen())
		if _, err := p.Run(); err != nil {
			return fmt.Errorf("启动 TUI 失败: %w", err)
		}
		return nil
	},
}

func init() {
	rootCmd.AddCommand(inboxCmd)
}
