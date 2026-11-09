package cmd

import (
	"ai-news-database/internal/db"
	"fmt"
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var searchCmd = &cobra.Command{
	Use:   "search <keyword>",
	Short: "搜索本地文章",
	Long:  `在本地 SQLite 数据库中全文搜索文章标题和摘要。`,
	Example: `  ai-news-database search golang
  ai-news-database search "machine learning"`,
	Args: cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		keyword := strings.TrimSpace(args[0])
		if keyword == "" {
			return fmt.Errorf("搜索关键词不能为空")
		}

		articles, err := database.SearchArticles(keyword, 20)
		if err != nil {
			return fmt.Errorf("搜索失败: %w", err)
		}

		if len(articles) == 0 {
			yellow := color.New(color.FgYellow).SprintFunc()
			fmt.Printf("%s 未找到与 '%s' 相关的文章\n", yellow("!"), keyword)
			return nil
		}

		bold := color.New(color.Bold).SprintFunc()
		fmt.Println(bold(fmt.Sprintf("搜索 '%s' 的结果：", keyword)))
		fmt.Println()

		green := color.New(color.FgGreen).SprintFunc()
		blue := color.New(color.FgBlue).SprintFunc()
		statusColor := color.New(color.FgHiBlack).SprintFunc()

		for _, a := range articles {
			statusIcon := "○"
			switch a.ReadStatus {
			case "read":
				statusIcon = "✓"
			case "starred":
				statusIcon = "★"
			case "discarded":
				statusIcon = "✗"
			case "archived":
				statusIcon = "▣"
			}
			fmt.Printf("%-4s [%s] %s\n", green(fmt.Sprintf("%d.", a.ID)), statusColor(statusIcon), bold(truncateString(a.Title, 60)))
			fmt.Printf("     %s %s\n", blue(a.Source), makeClickableURL(truncateString(a.URL, 50)))
			if a.Summary != "" {
				fmt.Printf("     %s\n", truncateString(a.Summary, 70))
			}
			fmt.Println()
		}

		fmt.Printf("共找到 %d 篇文章\n", len(articles))
		return nil
	},
}

func init() {
	rootCmd.AddCommand(searchCmd)
}
