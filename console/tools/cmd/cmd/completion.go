package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

var completionCmd = &cobra.Command{
	Use:   "completion [bash|zsh|fish|powershell]",
	Short: "生成 Shell 自动补全脚本",
	Long: `生成指定 Shell 的自动补全脚本。

用法示例：

  # Bash
  ai-news-database completion bash > /etc/bash_completion.d/ai-news-database

  # Zsh
  ai-news-database completion zsh > "${fpath[1]}/_ai-news-database"

  # Fish
  ai-news-database completion fish > ~/.config/fish/completions/ai-news-database.fish

  # PowerShell
  ai-news-database completion powershell > ai-news-database.ps1
`,
	DisableFlagsInUseLine: true,
	ValidArgs:             []string{"bash", "zsh", "fish", "powershell"},
	Args:                  cobra.MatchAll(cobra.ExactArgs(1), cobra.OnlyValidArgs),
	Run: func(cmd *cobra.Command, args []string) {
		switch args[0] {
		case "bash":
			rootCmd.GenBashCompletion(os.Stdout)
		case "zsh":
			rootCmd.GenZshCompletion(os.Stdout)
		case "fish":
			rootCmd.GenFishCompletion(os.Stdout, true)
		case "powershell":
			rootCmd.GenPowerShellCompletionWithDesc(os.Stdout)
		}
	},
}

func init() {
	rootCmd.AddCommand(completionCmd)
}
