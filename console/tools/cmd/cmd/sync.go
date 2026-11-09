package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/crawler"
	"ai-news-database/internal/db"
	"ai-news-database/internal/official"
	"fmt"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var syncAlias string

var syncCmd = &cobra.Command{
	Use:   "sync",
	Short: "同步所有官方源的最新文章到本地数据库",
	Long: `一键拉取所有启用的官方源的最新文章，
存储到本地 SQLite 数据库中。已存在的文章（按 URL 去重）会自动更新元数据。`,
	Example: `  # 同步所有官方源
  ai-news-database sync

  # 仅同步指定源
  ai-news-database sync --source hn`,
	RunE: func(cmd *cobra.Command, args []string) error {
		// 初始化数据库
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		registry := official.GetRegistry()
		cyan := color.New(color.FgCyan).SprintFunc()
		green := color.New(color.FgGreen).SprintFunc()
		yellow := color.New(color.FgYellow).SprintFunc()

		sources := registry.List()
		if len(sources) == 0 {
			fmt.Println("暂无可用的官方新闻源")
			return nil
		}

		var totalSaved, totalSkipped int

		for _, source := range sources {
			if syncAlias != "" && source.Alias != syncAlias {
				continue
			}

			fmt.Printf("%s 正在同步 %s ...\n", cyan("⟳"), source.Name)

			var items []crawler.Item
			if source.FetcherType == "infoq" {
				// 保留 InfoQ 专用抓取器
				factory := official.NewFetcherFactory()
				fetcher, err := factory.Create(&official.Source{
					Alias:       source.Alias,
					Name:        source.Name,
					URL:         source.URL,
					FetcherType: source.FetcherType,
				})
				if err != nil {
					fmt.Printf("  %s 创建抓取器失败: %v\n", yellow("⚠"), err)
					continue
				}
				results, err := fetcher.Fetch()
				if err != nil {
					fmt.Printf("  %s 抓取失败: %v\n", yellow("⚠"), err)
					continue
				}
				for _, r := range results {
					items = append(items, crawler.Item{
						Title:       r.Title,
						URL:         r.URL,
						Source:      source.Name,
						SourceAlias: source.Alias,
						RawContent:  r.Snippet,
					})
				}
			} else {
				// 使用新 crawler
				c, err := crawler.NewCrawler(source)
				if err != nil {
					fmt.Printf("  %s 创建采集器失败: %v\n", yellow("⚠"), err)
					continue
				}
				var crawlErr error
				items, crawlErr = c.Fetch()
				if crawlErr != nil {
					fmt.Printf("  %s 采集失败: %v\n", yellow("⚠"), crawlErr)
					continue
				}
			}

			saved, skipped := saveCrawlerItems(database, items)
			totalSaved += saved
			totalSkipped += skipped
			fmt.Printf("  %s 新增 %d 条，更新 %d 条重复\n", green("✓"), saved, skipped)
		}

		fmt.Println()
		fmt.Printf("%s 同步完成：新增 %d 条，更新 %d 条\n", green("✓"), totalSaved, totalSkipped)
		fmt.Println("💡 下一步建议: ai-news-database enrich  生成 LLM 摘要和标签")
		return nil
	},
}

func saveCrawlerItems(database *db.DB, items []crawler.Item) (saved, skipped int) {
	for _, item := range items {
		a := article.Article{
			Title:       item.Title,
			URL:         item.URL,
			Source:      item.Source,
			SourceAlias: item.SourceAlias,
			Summary:     item.RawContent, // 原始摘要先放在 summary
			RawContent:  item.RawContent,
			ReadStatus:  article.StatusUnread,
		}
		if item.PublishedAt != nil {
			a.PublishedAt = item.PublishedAt
		}

		err := database.SaveArticle(&a)
		if err != nil {
			// URL 已存在视为更新
			skipped++
		} else {
			saved++
		}
	}
	return
}

func init() {
	rootCmd.AddCommand(syncCmd)
	syncCmd.Flags().StringVarP(&syncAlias, "source", "s", "", "仅同步指定别名的新闻源")
}
