package cmd

import (
	"ai-news-database/internal/storage"
	"ai-news-database/internal/subscription"
	"fmt"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var (
	removeName  string
	removeIndex int
)

var removeCmd = &cobra.Command{
	Use:   "remove",
	Short: "删除订阅",
	Long:  `根据名称、别名或序号删除一个订阅。`,
	Example: `  ai-news-database remove --name "InfoQ中文站"
  ai-news-database remove -n infoq
  ai-news-database remove --index 1
  ai-news-database remove -i 2`,
	RunE: func(cmd *cobra.Command, args []string) error {
		// 检查参数
		if removeName == "" && removeIndex == 0 {
			return fmt.Errorf("请指定要删除的订阅名称（--name）或序号（--index）")
		}

		if removeName != "" && removeIndex != 0 {
			return fmt.Errorf("不能同时指定名称和序号")
		}

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

		// 删除订阅
		var deletedName string
		if removeName != "" {
			deletedName = removeName
			if err := manager.Remove(removeName); err != nil {
				return err
			}
		} else {
			// 通过序号删除
			subs := manager.List()
			if removeIndex < 1 || removeIndex > len(subs) {
				return fmt.Errorf("序号无效: %d（有效范围：1-%d）", removeIndex, len(subs))
			}
			deletedName = subs[removeIndex-1].Name
			if err := manager.RemoveByIndex(removeIndex); err != nil {
				return err
			}
		}

		// 保存配置
		if err := store.Save(config); err != nil {
			return fmt.Errorf("保存配置失败: %w", err)
		}

		// 输出成功消息
		green := color.New(color.FgGreen).SprintFunc()
		fmt.Printf("%s 已删除订阅：%s\n", green("✓"), deletedName)

		return nil
	},
}

func init() {
	rootCmd.AddCommand(removeCmd)
	removeCmd.Flags().StringVarP(&removeName, "name", "n", "", "订阅名称")
	removeCmd.Flags().IntVarP(&removeIndex, "index", "i", 0, "订阅序号")
}
