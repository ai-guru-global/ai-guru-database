package cmd

import (
	"ai-news-database/internal/db"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var burstHistoryCmd = &cobra.Command{
	Use:   "history",
	Short: "查看灵感爆发历史记录",
	RunE: func(cmd *cobra.Command, args []string) error {
		cyan := color.New(color.FgCyan).SprintFunc()
		bold := color.New(color.Bold).SprintFunc()
		gray := color.New(color.FgHiBlack).SprintFunc()
		yellow := color.New(color.FgYellow).SprintFunc()

		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		results, err := database.GetBurstResults(20)
		if err != nil || len(results) == 0 {
			fmt.Printf("%s 暂无灵感爆发历史记录。\n", yellow("!"))
			return nil
		}

		fmt.Println(bold("━━━ 💥 灵感爆发历史 ━━━"))
		fmt.Println()

		for _, r := range results {
			var ideas []burstIdea
			_ = json.Unmarshal([]byte(r.Ideas), &ideas)

			modeName := burstModeNames[r.Mode]
			if modeName == "" {
				modeName = r.Mode
			}

			focusInfo := ""
			if r.Focus != "" {
				focusInfo = fmt.Sprintf(" · 聚焦：%s", r.Focus)
			}

			fmt.Printf("%s #%d · %s · %s模式 · %d 条数据%s · %d 个创意\n",
				cyan(">"),
				r.ID,
				gray(r.CreatedAt),
				modeName,
				r.BasedOn,
				focusInfo,
				len(ideas),
			)

			for j, idea := range ideas {
				if j >= 2 {
					fmt.Printf("   %s ...还有 %d 个创意\n", gray("·"), len(ideas)-2)
					break
				}
				fmt.Printf("   %s %s\n", gray(fmt.Sprintf("%d.", j+1)), idea.Title)
			}
			fmt.Println()
		}

		fmt.Printf("共 %d 条记录。使用 %s 查看详情。\n", len(results), bold("ai-news-database burst show <id>"))
		return nil
	},
}

var burstShowCmd = &cobra.Command{
	Use:   "show <id>",
	Short: "查看指定灵感爆发记录详情",
	Args:  cobra.ExactArgs(1),
	RunE: func(cmd *cobra.Command, args []string) error {
		cyan := color.New(color.FgCyan).SprintFunc()
		bold := color.New(color.Bold).SprintFunc()
		gray := color.New(color.FgHiBlack).SprintFunc()

		id, err := strconv.ParseInt(args[0], 10, 64)
		if err != nil {
			return fmt.Errorf("无效的 ID: %s", args[0])
		}

		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		result, err := database.GetBurstResult(id)
		if err != nil {
			return fmt.Errorf("未找到记录 #%d", id)
		}

		var ideas []burstIdea
		_ = json.Unmarshal([]byte(result.Ideas), &ideas)

		modeName := burstModeNames[result.Mode]
		focusInfo := ""
		if result.Focus != "" {
			focusInfo = fmt.Sprintf(" · 聚焦：%s", result.Focus)
		}

		fmt.Println(bold("━━━ 💥 灵感爆发 ━━━"))
		fmt.Printf("   #%d · %s · %s模式 · %d 条数据%s\n\n",
			result.ID, gray(result.CreatedAt), modeName, result.BasedOn, focusInfo)

		for i, idea := range ideas {
			fmt.Printf("%s %s\n", cyan(fmt.Sprintf("%2d.", i+1)), bold(idea.Title))
			fmt.Printf("   %s\n", wrapText(idea.Description, 76, "   "))
			fmt.Printf("   %s %s\n", gray("←"), gray(idea.Inspiration))
			fmt.Println()
		}

		fmt.Println(bold(fmt.Sprintf("━━━ 共 %d 个创意想法 ━━━", len(ideas))))
		return nil
	},
}
