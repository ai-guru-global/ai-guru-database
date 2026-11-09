package cmd

import (
	"fmt"
	"os"
	"text/tabwriter"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/fatih/color"
	"github.com/spf13/cobra"

	"ai-news-database/internal/config"
	"ai-news-database/internal/db"
	"ai-news-database/internal/deep_research"
)

var (
	researchDays       int
	researchLimit      int
	researchJSON       bool
	researchDetailed   bool
	researchNoWeb      bool
	researchSubQueries int
)

var researchCmd = &cobra.Command{
	Use:   "research <topic>",
	Short: "深度研究：基于行业资讯生成深度分析报告",
	Long: `深度研究功能 - 遵循专业研究方法论

研究流程：
  1. 规划阶段 - 分析主题，生成研究假设和搜索计划
  2. 搜索阶段 - 并行搜索本地知识库 + 网络
  3. 内容获取 - 抓取重要页面的完整内容
  4. 证据提取 - 从来源中提取关键声明和事实
  5. 分析阶段 - 交叉验证、识别模式、分析缺口
  6. 综合阶段 - 生成结构化报告

报告包含：
  - 执行摘要
  - 关键发现（带证据）
  - 多角度分析
  - 信息缺口分析
  - 完整引用来源

示例：
  ai-news-database research "AI coding tools"
  ai-news-database research "Rust vs Go" --sub-queries 8 --limit 30
  ai-news-database research "WebAssembly" --no-web
  ai-news-database research "Kubernetes trends" --detailed --json`,
	Args: cobra.ExactArgs(1),
	RunE: runResearch,
}

func init() {
	researchCmd.Flags().IntVar(&researchDays, "days", 30, "搜索近 N 天内的文章")
	researchCmd.Flags().IntVar(&researchLimit, "limit", 20, "最多使用的来源数量")
	researchCmd.Flags().IntVar(&researchSubQueries, "sub-queries", 5, "子查询数量")
	researchCmd.Flags().BoolVar(&researchJSON, "json", false, "以 JSON 格式输出")
	researchCmd.Flags().BoolVar(&researchDetailed, "detailed", false, "输出详细报告（含研究追踪）")
	researchCmd.Flags().BoolVar(&researchNoWeb, "no-web", false, "仅使用本地知识库，不进行网络搜索")
	rootCmd.AddCommand(researchCmd)
}

func runResearch(cmd *cobra.Command, args []string) error {
	topic := args[0]

	cfg, err := config.Load()
	if err != nil {
		return fmt.Errorf("加载配置失败: %w", err)
	}

	if cfg.LLM.APIKey == "" {
		return fmt.Errorf("LLM API Key 未配置，请先运行 ai-news-database config set llm.api_key <YOUR_KEY>")
	}

	database, err := db.New()
	if err != nil {
		return fmt.Errorf("打开数据库失败: %w", err)
	}
	defer database.Close()

	researcher := deep_research.New(database, &cfg.LLM)

	researchCfg := &deep_research.ResearchConfig{
		Days:             researchDays,
		Limit:            researchLimit,
		SubQueryCount:    researchSubQueries,
		WebSearchEnabled: !researchNoWeb,
		MaxSources:       researchLimit,
		FetchContent:     true,
	}

	format := deep_research.ReportFormatMarkdown
	if researchJSON && !researchDetailed {
		format = deep_research.ReportFormatJSON
	} else if researchDetailed {
		format = deep_research.ReportFormatDetailed
	}

	printResearchHeader(topic)

	printPhase("规划", "分析研究主题...")
	startTime := time.Now()

	result, err := researcher.Research(cmd.Context(), topic, researchCfg)
	if err != nil {
		return fmt.Errorf("研究失败: %w", err)
	}

	printPhase("完成", fmt.Sprintf("分析 %d 个来源，提取 %d 条证据，用时 %v",
		len(result.Sources), len(result.Evidence), time.Since(startTime)))

	if result.Plan != nil && len(result.Plan.SearchQueries) > 0 {
		printSearchQueries(result.Plan.SearchQueries)
	}

	report, err := researcher.ResearchWithFormat(cmd.Context(), topic, researchCfg, format)
	if err != nil {
		return fmt.Errorf("生成报告失败: %w", err)
	}

	fmt.Println()
	fmt.Println(report)

	printResearchFooter(result)

	return nil
}

var (
	headerStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("86")).
			Bold(true)

	phaseStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("208"))
)

func printResearchHeader(topic string) {
	fmt.Println()
	fmt.Println(headerStyle.Render("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))
	fmt.Println(headerStyle.Render("🔬 AI News Database Deep Research"))
	fmt.Println(headerStyle.Render("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))
	fmt.Printf("主题: %s\n\n", color.CyanString(topic))
}

func printPhase(phase, message string) {
	bold := lipgloss.NewStyle().Bold(true)
	fmt.Printf("%s %s... %s\n",
		phaseStyle.Render("▸"),
		bold.Render(phase),
		message)
}

func printSearchQueries(queries []deep_research.SearchQuery) {
	if len(queries) == 0 {
		return
	}
	fmt.Println()
	fmt.Println(phaseStyle.Render("  搜索计划:"))
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	for i, q := range queries {
		if i >= 10 {
			fmt.Fprintf(w, "  ... 还有 %d 个查询\n", len(queries)-10)
			break
		}
		fmt.Fprintf(w, "  %d. %s\t(%s)\n", i+1, q.Query, q.Purpose)
	}
	w.Flush()
	fmt.Println()
}

func printResearchFooter(result *deep_research.ResearchResult) {
	fmt.Println()
	fmt.Println(headerStyle.Render("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))
	fmt.Printf("  来源: %d | 证据: %d | 置信度: %s\n",
		len(result.Sources), len(result.Evidence), colorizeConfidence(result.Confidence))
	fmt.Printf("  发现: %d | 视角: %d | 用时: %v\n",
		len(result.Findings), len(result.Perspectives), result.Trace.TotalTime)
	fmt.Println(headerStyle.Render("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))
}

func colorizeConfidence(c deep_research.ConfidenceLevel) string {
	switch c {
	case deep_research.ConfidenceHigh:
		return color.GreenString(string(c))
	case deep_research.ConfidenceMedium:
		return color.YellowString(string(c))
	case deep_research.ConfidenceLow:
		return color.RedString(string(c))
	default:
		return string(c)
	}
}
