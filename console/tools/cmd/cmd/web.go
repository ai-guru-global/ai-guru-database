package cmd

import (
	"ai-news-database/internal/db"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
)

var webPort int

type inspireItem struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	URL         string `json:"url"`
	Summary     string `json:"summary"`
	PublishedAt string `json:"published_at,omitempty"`
	FetchedAt   string `json:"fetched_at"`
	ReadStatus  string `json:"read_status"`
	Points      int    `json:"points"`
}

var webCmd = &cobra.Command{
	Use:   "web",
	Short: "启动本地 Web 服务",
	Long:  `启动一个本地 Web 服务器，提供工作台和灵感页面浏览。`,
	Example: `  ai-news-database web
  ai-news-database web --port 3000`,
	RunE: func(cmd *cobra.Command, args []string) error {
		cyan := color.New(color.FgCyan).SprintFunc()
		green := color.New(color.FgGreen).SprintFunc()
		bold := color.New(color.Bold).SprintFunc()

		database, err := db.New()
		if err != nil {
			return fmt.Errorf("初始化数据库失败: %w", err)
		}
		defer database.Close()

		webDir := findWebDir()

		mux := http.NewServeMux()

		// 注册 API 路由
		registerCoreAPIs(mux, database)
		registerInspireAPIs(mux, database)

		// 静态文件服务
		registerStaticFiles(mux, webDir)

		addr := fmt.Sprintf(":%d", webPort)
		fmt.Printf("%s %s\n", cyan("✨"), bold("AI News Database Web 服务启动中..."))
		fmt.Printf("%s 本地数据库: ~/.ai-news-database/ai-news-database.db\n", green("●"))
		fmt.Printf("%s 访问地址: %s\n\n", green("●"), bold(fmt.Sprintf("http://localhost%s", addr)))
		fmt.Printf("%s 工作台:    %s\n", green("●"), bold(fmt.Sprintf("http://localhost%s/dashboard", addr)))
		fmt.Printf("%s 灵感页面:  %s\n\n", green("●"), bold(fmt.Sprintf("http://localhost%s/inspire", addr)))

		if err := http.ListenAndServe(addr, mux); err != nil {
			return fmt.Errorf("Web 服务启动失败: %w", err)
		}
		return nil
	},
}

func findWebDir() string {
	exePath, err := os.Executable()
	if err == nil {
		candidate := filepath.Join(filepath.Dir(exePath), "web")
		if info, err := os.Stat(candidate); err == nil && info.IsDir() {
			return candidate
		}
	}
	cwd, err := os.Getwd()
	if err == nil {
		candidate := filepath.Join(cwd, "web")
		if info, err := os.Stat(candidate); err == nil && info.IsDir() {
			return candidate
		}
	}
	return ""
}

func registerStaticFiles(mux *http.ServeMux, webDir string) {
	if webDir != "" {
		dashboardHTML := filepath.Join(webDir, "dashboard.html")
		inspireHTML := filepath.Join(webDir, "inspire.html")
		indexHTML := filepath.Join(webDir, "index.html")
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			switch r.URL.Path {
			case "/", "/dashboard", "/dashboard.html":
				http.ServeFile(w, r, dashboardHTML)
			case "/inspire", "/inspire.html":
				http.ServeFile(w, r, inspireHTML)
			case "/index", "/index.html":
				http.ServeFile(w, r, indexHTML)
			default:
				fs := http.FileServer(http.Dir(webDir))
				fs.ServeHTTP(w, r)
			}
		})
	} else {
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			fmt.Fprint(w, `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>AI News Database</title></head>
<body style="font-family:system-ui;padding:2rem;text-align:center;color:#666;">
<h1>AI News Database Web</h1>
<p>请从项目根目录运行 ai-news-database web 以启用完整 Web 界面。</p>
<p><a href="/inspire">灵感页面</a> | <a href="/dashboard">工作台</a></p>
</body></html>`)
		})
	}
}

func init() {
	rootCmd.AddCommand(webCmd)
	webCmd.Flags().IntVarP(&webPort, "port", "p", 8080, "Web 服务端口（默认 8080）")
}
