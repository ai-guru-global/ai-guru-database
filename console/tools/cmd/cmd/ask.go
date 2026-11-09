package cmd

import (
	"ai-news-database/internal/config"
	"ai-news-database/internal/db"
	"ai-news-database/internal/rag"
	"context"
	"fmt"
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var askCmd = &cobra.Command{
	Use:   "ask <question>",
	Short: "基于本地知识库进行 RAG 问答",
	Long: `使用自然语言向你的本地技术知识库提问。
系统会自动检索相关文章，并调用 LLM 生成带引用的回答。`,
	Example: `  ai-news-database ask "最近一周关于 Rust 内存安全的主要观点有哪些？"
  ai-news-database ask "Go 和 Rust 在并发模型上有什么差异？"`,
	Args: cobra.MinimumNArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		question := strings.TrimSpace(strings.Join(args, " "))
		if question == "" {
			return fmt.Errorf("问题不能为空")
		}

		cfg, err := config.Load()
		if err != nil {
			return fmt.Errorf("加载配置失败: %w", err)
		}
		if cfg.LLM.APIKey == "" {
			return fmt.Errorf("LLM API Key 未配置。请编辑 ~/.ai-news-database/config.json")
		}

		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		r := rag.New(database, &cfg.LLM)
		cyan := color.New(color.FgCyan).SprintFunc()
		bold := color.New(color.Bold).SprintFunc()
		gray := color.New(color.FgHiBlack).SprintFunc()

		fmt.Printf("%s 正在检索知识库并生成回答...\n\n", cyan("⟳"))

		answer, refs, err := r.Answer(context.Background(), question)
		if err != nil {
			return fmt.Errorf("问答失败: %w", err)
		}

		fmt.Println(bold("回答："))
		fmt.Println()
		fmt.Println(answer)
		fmt.Println()

		if len(refs) > 0 {
			fmt.Println(gray("━━━ 引用来源 ━━━"))
			for _, ref := range refs {
				fmt.Printf("[%d] %s (%s)\n", ref.Index, ref.Title, ref.Source)
				fmt.Printf("    %s\n", ref.URL)
			}
			fmt.Println()
		}

		fmt.Println(gray("💡 提示: 知识库内容越丰富，回答质量越高。建议定期执行 sync + enrich。"))
		return nil
	},
}

func init() {
	rootCmd.AddCommand(askCmd)
}
