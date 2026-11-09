package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/db"
	"ai-news-database/internal/storage"
	"ai-news-database/internal/subscription"
	"fmt"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var listArticles bool

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "列出所有订阅或本地文章",
	Long:  `显示所有已添加的订阅列表，或使用 --articles 查看本地数据库中的文章。`,
	Example: `  ai-news-database list
  ai-news-database list --articles
  ai-news-database list --articles --status unread`,
	RunE: func(cmd *cobra.Command, args []string) error {
		if listArticles {
			return listLocalArticles()
		}
		return listSubscriptions()
	},
}

func listSubscriptions() error {
	// 创建存储实例
	store, err := storage.New()
	if err != nil {
		return fmt.Errorf("初始化存储失败: %w", err)
	}

	// 加载配置
	config, err := store.Load()
	if err != nil {
		return fmt.Errorf("加载配置失败: %w", err)
	}

	// 创建订阅管理器
	manager := subscription.NewManager(config)
	subs := manager.List()

	// 检查是否为空
	if len(subs) == 0 {
		yellow := color.New(color.FgYellow).SprintFunc()
		fmt.Printf("%s 暂无订阅\n", yellow("!"))
		fmt.Println("使用 'ai-news-database add --name <名称> --url <URL>' 添加订阅")
		return nil
	}

	// 显示订阅列表
	bold := color.New(color.Bold).SprintFunc()
	fmt.Println(bold("订阅列表："))
	fmt.Println()

	// 表头
	fmt.Printf("%-4s %-12s %-18s %-35s %-16s\n", "序号", "别名", "名称", "URL", "创建时间")
	fmt.Println("───────────────────────────────────────────────────────────────────────────────────────────────")

	// 表内容
	for i, sub := range subs {
		alias := sub.Alias
		if alias == "" {
			alias = "-"
		}
		fmt.Printf("%-4d %-12s %-18s %-35s %-16s\n",
			i+1,
			truncateString(alias, 12),
			truncateString(sub.Name, 18),
			truncateString(sub.URL, 35),
			sub.CreatedAt.Format("2006-01-02 15:04"))
	}

	fmt.Println()
	fmt.Printf("总计: %d 个订阅\n", len(subs))

	return nil
}

func listLocalArticles() error {
	database, err := db.New()
	if err != nil {
		return fmt.Errorf("初始化数据库失败: %w", err)
	}
	defer database.Close()

	var status article.ReadStatus
	if listStatus != "" {
		status = article.ReadStatus(listStatus)
	}

	articles, err := database.GetArticles(status, "", 50)
	if err != nil {
		return fmt.Errorf("查询文章失败: %w", err)
	}

	if len(articles) == 0 {
		yellow := color.New(color.FgYellow).SprintFunc()
		fmt.Printf("%s 暂无文章\n", yellow("!"))
		fmt.Println("使用 'ai-news-database sync' 拉取最新文章")
		return nil
	}

	bold := color.New(color.Bold).SprintFunc()
	fmt.Println(bold("本地文章列表："))
	fmt.Println()

	statusColor := color.New(color.FgHiBlack).SprintFunc()
	green := color.New(color.FgGreen).SprintFunc()
	blue := color.New(color.FgBlue).SprintFunc()

	for _, a := range articles {
		statusIcon := "○"
		switch a.ReadStatus {
		case article.StatusRead:
			statusIcon = "✓"
		case article.StatusStarred:
			statusIcon = "★"
		case article.StatusDiscarded:
			statusIcon = "✗"
		case article.StatusArchived:
			statusIcon = "▣"
		}

		extra := ""
		if a.LLMTags != "" {
			extra += fmt.Sprintf("  [🏷 %s]", a.LLMTags)
		} else if a.Tags != "" {
			extra += fmt.Sprintf("  [🏷 %s]", a.Tags)
		}
		if a.Note != "" {
			extra += fmt.Sprintf("  [📝 %s]", truncateString(a.Note, 20))
		}
		if a.QualityScore > 0 {
			extra += fmt.Sprintf("  [⭐ %.1f]", a.QualityScore)
		}

		displayTitle := truncateString(a.Title, 50)
		if len(extra) > 0 {
			displayTitle = truncateString(a.Title, 40)
		}

		fmt.Printf("%-4s [%s] %s%s\n", green(fmt.Sprintf("%d.", a.ID)), statusColor(statusIcon), bold(displayTitle), extra)
		fmt.Printf("     %s %s\n", blue(a.Source), makeClickableURL(truncateString(a.URL, 50)))

		summary := a.LLMSummary
		if summary == "" {
			summary = a.Summary
		}
		if summary != "" {
			fmt.Printf("     %s\n", truncateString(summary, 70))
		}
		fmt.Println()
	}

	fmt.Printf("总计: %d 篇文章\n", len(articles))
	return nil
}

// truncateString 截断字符串，超过长度时添加省略号
func truncateString(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen-3] + "..."
}

var listStatus string

func init() {
	rootCmd.AddCommand(listCmd)
	listCmd.Flags().BoolVarP(&listArticles, "articles", "a", false, "显示本地文章列表")
	listCmd.Flags().StringVar(&listStatus, "status", "", "按状态筛选文章 (unread/read/starred/archived/discarded)")
}
