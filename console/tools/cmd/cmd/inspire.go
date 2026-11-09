package cmd

import (
	"ai-news-database/internal/tui"
	"fmt"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

var inspireDays int
var inspireLimit int

var inspireCmd = &cobra.Command{
	Use:   "inspire",
	Short: "灵感模式：发现 HN 上的新产品和新项目",
	Long: `启动交互式 TUI 界面，发现 Hacker News 上的新产品和项目。
支持快捷键操作，可以直接在浏览器中打开链接。

快捷键：
  j / ↓    向下移动
  k / ↑    向上移动
  o / enter  在浏览器中打开
  r        刷新列表
  q / Esc  退出`,
	Example: `  # 启动灵感模式（默认获取最近 7 天）
  ai-news-database inspire

  # 获取最近 3 天的新产品
  ai-news-database inspire --days 3

  # 获取最近 2 周的新产品，最多 50 条
  ai-news-database inspire --days 14 --limit 50`,
	RunE: func(cmd *cobra.Command, args []string) error {
		model := tui.NewInspireModel(inspireDays, inspireLimit)
		p := tea.NewProgram(model, tea.WithAltScreen())
		if _, err := p.Run(); err != nil {
			return fmt.Errorf("启动 TUI 失败: %w", err)
		}
		return nil
	},
}

func init() {
	rootCmd.AddCommand(inspireCmd)
	inspireCmd.Flags().IntVarP(&inspireDays, "days", "d", 7, "获取最近几天的产品（默认 7 天）")
	inspireCmd.Flags().IntVarP(&inspireLimit, "limit", "l", 30, "最多获取条数（默认 30）")
}
