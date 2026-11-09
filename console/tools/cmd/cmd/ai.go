package cmd

import (
	"fmt"

	"github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"

	"ai-news-database/internal/db"
	"ai-news-database/internal/tui"
)

var aiCmd = &cobra.Command{
	Use:   "ai",
	Short: "AI 相关功能",
	Long:  `AI 驱动的功能和交互界面`,
}

var aiTuiCmd = &cobra.Command{
	Use:   "tui",
	Short: "AI 阅读器 - 分栏显示文章列表和正文",
	Long: `启动 AI 阅读器 TUI，分栏显示：
- 左侧：文章列表（上下键选择）
- 右侧：文章预览（标题、URL、摘要）

快捷键：
  ↑/k    上移
  ↓/j    下移
  Enter  选择文章
  r      标记已读
  s      收藏
  d      丢弃
  1      显示全部
  2      仅未读
  3      仅收藏
  q      退出`,
	RunE: runAiTui,
}

func init() {
	aiCmd.AddCommand(aiTuiCmd)
	rootCmd.AddCommand(aiCmd)
}

func runAiTui(cmd *cobra.Command, args []string) error {
	database, err := db.New()
	if err != nil {
		return fmt.Errorf("打开数据库失败: %w", err)
	}
	defer database.Close()

	model := tui.NewSplitModel(database)
	p := tea.NewProgram(model, tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		return fmt.Errorf("TUI 运行失败: %w", err)
	}

	return nil
}
