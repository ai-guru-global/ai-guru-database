package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/config"
	"ai-news-database/internal/db"
	"ai-news-database/internal/llm"
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var burstCount int
var burstFocus string
var burstMode string
var burstSelect string
var burstCmd = &cobra.Command{
	Use:   "burst",
	Short: "灵感爆发：基于 HN 产品信息，用 LLM 生成新创意",
	Long: `分析已保存的灵感模式产品信息，通过 LLM 进行跨界联想，
生成全新的产品创意和项目想法。灵感来源于你本地收藏的 Show HN 数据。

支持三种模式：
  cross-domain  跨界联想（默认）—— 融合不同领域的产品创意
  problem       问题驱动 —— 从用户痛点出发设计解决方案
  techstack     技术栈组合 —— 基于新兴技术栈组合创新`,
	Example: `  # 跨界联想模式（默认）
  ai-news-database burst
  ai-news-database burst --count 5

  # 问题驱动模式
  ai-news-database burst --mode problem

  # 技术栈组合模式
  ai-news-database burst --mode techstack

  # 聚焦某个方向
  ai-news-database burst --focus "AI + 开发者工具"

  # 基于特定文章生成
  ai-news-database burst --select 1,3,7

  # 查看历史
  ai-news-database burst history`,
	RunE: func(cmd *cobra.Command, args []string) error {
		cyan := color.New(color.FgCyan).SprintFunc()
		bold := color.New(color.Bold).SprintFunc()
		yellow := color.New(color.FgYellow).SprintFunc()
		magenta := color.New(color.FgMagenta).SprintFunc()
		gray := color.New(color.FgHiBlack).SprintFunc()

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

		articles, err := database.GetArticles("", "inspire", 30)
		if err != nil {
			return fmt.Errorf("查询灵感数据失败: %w", err)
		}

		if len(articles) == 0 {
			fmt.Printf("%s 暂无灵感数据。请先运行 ai-news-database inspire 获取。\n", yellow("!"))
			return nil
		}

		if burstSelect != "" {
			selected, parseErr := parseSelectIndices(burstSelect, len(articles))
			if parseErr != nil {
				return parseErr
			}
			var filtered []article.Article
			for _, idx := range selected {
				if idx >= 0 && idx < len(articles) {
					filtered = append(filtered, articles[idx])
				}
			}
			if len(filtered) == 0 {
				return fmt.Errorf("选择的索引无效")
			}
			articles = filtered
		}

		mode := burstMode
		if _, ok := burstModePrompts[mode]; !ok {
			mode = "cross-domain"
		}

		fmt.Printf("%s %s\n", cyan("💥"), bold("灵感爆发模式"))
		fmt.Printf("   模式：%s", magenta(burstModeNames[mode]))
		fmt.Printf(" · 基于 %d 条灵感数据", len(articles))
		if burstFocus != "" {
			fmt.Printf(" · 聚焦：%s", magenta(burstFocus))
		}
		fmt.Println()
		fmt.Printf("%s 正在调用 LLM...\n\n", cyan("⟳"))

		var products []string
		for i, a := range articles {
			entry := fmt.Sprintf("%d. %s", i+1, a.Title)
			if a.Summary != "" {
				if len(a.Summary) > 120 {
					entry += " — " + a.Summary[:117] + "..."
				} else {
					entry += " — " + a.Summary
				}
			}
			products = append(products, entry)
		}
		productsText := strings.Join(products, "\n")

		focusClause := ""
		if burstFocus != "" {
			focusClause = fmt.Sprintf("\n\n用户希望聚焦的方向是：%s。请围绕这个方向展开联想。", burstFocus)
		}

		template := burstModePrompts[mode]
		prompt := fmt.Sprintf(template.Prompt, burstCount, productsText, focusClause)

		client := llm.NewClient(&cfg.LLM)
		resp, err := client.Chat(context.Background(), []llm.Message{
			{Role: "system", Content: template.System},
			{Role: "user", Content: prompt},
		}, 4000)
		if err != nil {
			return fmt.Errorf("LLM 请求失败: %w", err)
		}

		clean := strings.TrimSpace(resp)
		clean = strings.TrimPrefix(clean, "```json")
		clean = strings.TrimPrefix(clean, "```")
		clean = strings.TrimSuffix(clean, "```")
		clean = strings.TrimSpace(clean)

		var ideas []burstIdea
		if err := json.Unmarshal([]byte(clean), &ideas); err != nil {
			fmt.Printf("%s LLM 返回内容：\n%s\n", yellow("⚠"), resp)
			return fmt.Errorf("解析 LLM 结果失败: %w", err)
		}

		now := time.Now().Format("2006-01-02 15:04")
		fmt.Println(bold("━━━ 💥 灵感爆发 ━━━"))
		fmt.Printf("   %s · %s · 基于 %d 条灵感数据\n\n", gray(now), burstModeNames[mode], len(articles))

		for i, idea := range ideas {
			fmt.Printf("%s %s\n", cyan(fmt.Sprintf("%2d.", i+1)), bold(idea.Title))
			fmt.Printf("   %s\n", wrapText(idea.Description, 76, "   "))
			fmt.Printf("   %s %s\n", gray("←"), gray(idea.Inspiration))
			fmt.Println()
		}

		fmt.Println(bold(fmt.Sprintf("━━━ 共 %d 个创意想法 ━━━", len(ideas))))

		ideasJSON, _ := json.Marshal(ideas)
		burstID, saveErr := database.SaveBurstResult(mode, burstFocus, string(ideasJSON), len(articles))
		if saveErr == nil {
			fmt.Printf("%s 已保存到历史记录 (#%d)\n", gray("💾"), burstID)
		}

		return nil
	},
}

func parseSelectIndices(s string, maxLen int) ([]int, error) {
	parts := strings.Split(s, ",")
	var indices []int
	for _, p := range parts {
		p = strings.TrimSpace(p)
		idx, err := strconv.Atoi(p)
		if err != nil {
			return nil, fmt.Errorf("无效的索引: %s", p)
		}
		if idx < 1 || idx > maxLen {
			return nil, fmt.Errorf("索引 %d 超出范围 (1-%d)", idx, maxLen)
		}
		indices = append(indices, idx-1)
	}
	return indices, nil
}

func init() {
	rootCmd.AddCommand(burstCmd)
	burstCmd.Flags().IntVarP(&burstCount, "count", "n", 3, "生成创意数量（默认 3）")
	burstCmd.Flags().StringVarP(&burstFocus, "focus", "f", "", "聚焦方向，如 \"AI + 开发者工具\"")
	burstCmd.Flags().StringVarP(&burstMode, "mode", "M", "cross-domain", "模式：cross-domain / problem / techstack")
	burstCmd.Flags().StringVarP(&burstSelect, "select", "S", "", "选择特定文章（如 1,3,7）")

	burstCmd.AddCommand(burstHistoryCmd)
	burstCmd.AddCommand(burstShowCmd)
}
