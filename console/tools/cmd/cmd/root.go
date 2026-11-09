package cmd

import (
	"ai-news-database/internal/official"
	"fmt"
	"log/slog"
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

// Version 信息由 Makefile 在构建时注入
var (
	version   = "dev"
	buildTime = "unknown"
	gitCommit = "unknown"
)

var debug bool

var rootCmd = &cobra.Command{
	Use:   "ai-news-database",
	Short: "AI News Database 辅助工具 - AI 高质量新闻沉淀库",
	Long: `ai-news-database 是 AI News Database（AI 新闻数据库）的辅助命令行工具。
仓库主体是按主题组织的 Markdown 新闻内容库（手动整理为主）；
本工具提供本地阅读、筛选、LLM 增强、策展与 RAG 问答等可选辅助能力。

核心命令:
  sync        同步所有官方源文章到本地数据库（API + 智能抓取）
  enrich      调用 LLM 生成摘要、标签和质量评分
  curate      智能策展：生成今日必读清单
  ask         基于本地知识库进行 RAG 问答
  research    深度研究：基于行业资讯生成分析报告
  ai tui      AI 阅读器：分栏显示文章列表和正文
  list        查看订阅列表或本地文章 (-a 查看文章)
  inbox       进入 TUI 收件箱快速浏览
  read        标记文章为已读
  star        收藏文章
  discard     丢弃文章
  archive     批量归档已读文章
  search      全文搜索本地文章
  stats       查看订阅健康度
  note        为文章添加笔记
  tag         为文章添加标签
  export      导出文章为 Markdown
  cleanup     清理过期文章

使用 "ai-news-database sources" 查看所有官方新闻源`,
	Version: fmt.Sprintf("%s (commit: %s, built: %s)", version, gitCommit, buildTime),
	// 关闭默认的未知命令错误，允许自定义处理
	SilenceErrors: true,
	SilenceUsage:  true,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		if debug {
			slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
				Level: slog.LevelDebug,
			})))
			slog.Debug("debug 模式已启用")
		}
	},
}

func init() {
	rootCmd.PersistentFlags().BoolVar(&debug, "debug", false, "启用调试日志输出")
}

// Execute 执行根命令
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		// 检查是否为未知命令错误
		if strings.Contains(err.Error(), "unknown command") {
			// 提取命令名
			if len(os.Args) > 1 {
				alias := os.Args[1]
				// 尝试作为官方源别名处理
				if handleErr := handleOfficialSource(alias); handleErr == nil {
					return
				} else {
					// 如果官方源处理也失败，输出具体错误
					fmt.Fprintln(os.Stderr, handleErr)
					os.Exit(1)
					return
				}
			}
		}
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

// handleOfficialSource 处理官方源别名命令
func handleOfficialSource(alias string) error {
	// 获取官方源注册表
	registry := official.GetRegistry()
	source, exists := registry.Get(alias)
	if !exists {
		return fmt.Errorf("未知命令: %s\n\n运行 'ai-news-database --help' 查看可用命令", alias)
	}

	// 显示提示信息
	cyan := color.New(color.FgCyan).SprintFunc()
	fmt.Printf("%s 正在获取 %s 的最新内容...\n", cyan("⟳"), source.Name)
	fmt.Println()

	// 创建抓取器工厂
	factory := official.NewFetcherFactory()
	fetcher, err := factory.Create(source)
	if err != nil {
		return fmt.Errorf("创建抓取器失败: %w", err)
	}

	// 执行抓取
	results, err := fetcher.Fetch()
	if err != nil {
		return fmt.Errorf("获取内容失败: %w", err)
	}

	// 显示结果
	displayResults(results, source.Name)

	return nil
}
