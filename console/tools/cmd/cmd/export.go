package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/db"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	exportStatus string
	exportFormat string
	exportOutput string
)

var exportCmd = &cobra.Command{
	Use:   "export",
	Short: "导出本地文章",
	Long: `将本地文章导出为指定格式文件，便于备份或二次加工。
默认导出收藏的文章为 Markdown 格式。`,
	Example: `  ai-news-database export --status starred --format markdown --output ./stars.md
  ai-news-database export --status read --output ./read.md`,
	RunE: func(cmd *cobra.Command, args []string) error {
		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		var status article.ReadStatus
		if exportStatus != "" {
			status = article.ReadStatus(exportStatus)
		}

		articles, err := database.GetArticles(status, "", 0)
		if err != nil {
			return fmt.Errorf("查询文章失败: %w", err)
		}

		if len(articles) == 0 {
			yellow := color.New(color.FgYellow).SprintFunc()
			fmt.Printf("%s 没有符合条件的文章可导出\n", yellow("!"))
			return nil
		}

		var content string
		switch exportFormat {
		case "markdown":
			content = exportMarkdown(articles)
		default:
			return fmt.Errorf("不支持的导出格式: %s", exportFormat)
		}

		// 默认输出到当前目录
		outPath := exportOutput
		if outPath == "" {
			outPath = fmt.Sprintf("ai-news-database_export_%s.md", time.Now().Format("20060102_150405"))
		}
		outPath, _ = filepath.Abs(outPath)

		if err := os.WriteFile(outPath, []byte(content), 0644); err != nil {
			return fmt.Errorf("写入文件失败: %w", err)
		}

		green := color.New(color.FgGreen).SprintFunc()
		fmt.Printf("%s 已导出 %d 篇文章到 %s\n", green("✓"), len(articles), outPath)
		return nil
	},
}

func exportMarkdown(articles []article.Article) string {
	var sb string
	sb += "# AI News Database 文章导出\n\n"
	sb += fmt.Sprintf("> 导出时间: %s\n\n", time.Now().Format("2006-01-02 15:04:05"))

	for _, a := range articles {
		sb += fmt.Sprintf("## %s\n\n", a.Title)
		sb += fmt.Sprintf("- **来源**: %s\n", a.Source)
		sb += fmt.Sprintf("- **链接**: %s\n", a.URL)
		if a.PublishedAt != nil {
			sb += fmt.Sprintf("- **发布时间**: %s\n", a.PublishedAt.Format("2006-01-02"))
		}
		if a.Tags != "" {
			sb += fmt.Sprintf("- **标签**: %s\n", a.Tags)
		}
		if a.Note != "" {
			sb += fmt.Sprintf("- **笔记**: %s\n", a.Note)
		}
		sb += fmt.Sprintf("- **状态**: %s\n", a.ReadStatus)
		sb += "\n"
		if a.Summary != "" {
			sb += fmt.Sprintf("%s\n\n", a.Summary)
		}
		sb += "---\n\n"
	}

	return sb
}

func init() {
	rootCmd.AddCommand(exportCmd)
	exportCmd.Flags().StringVar(&exportStatus, "status", "starred", "导出指定状态的文章 (unread/read/starred/archived/discarded)")
	exportCmd.Flags().StringVar(&exportFormat, "format", "markdown", "导出格式 (目前仅支持 markdown)")
	exportCmd.Flags().StringVarP(&exportOutput, "output", "o", "", "输出文件路径")
}
