package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/config"
	"ai-news-database/internal/db"
	"ai-news-database/internal/llm"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

// registerInspireAPIs 注册灵感相关 API 路由
func registerInspireAPIs(mux *http.ServeMux, database *db.DB) {
	// API: /api/inspire
	mux.HandleFunc("/api/inspire", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		sortBy := r.URL.Query().Get("sort")
		var articles, err = func() ([]article.Article, error) {
			if sortBy == "points" {
				return database.GetArticlesSorted("", "inspire", 0, "points")
			}
			return database.GetArticles("", "inspire", 0)
		}()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		var items []inspireItem
		for _, a := range articles {
			item := inspireItem{
				ID:         a.ID,
				Title:      a.Title,
				URL:        a.URL,
				Summary:    a.Summary,
				ReadStatus: string(a.ReadStatus),
				FetchedAt:  a.FetchedAt.Format("2006-01-02 15:04"),
				Points:     a.Points,
			}
			if a.PublishedAt != nil {
				item.PublishedAt = a.PublishedAt.Format("2006-01-02")
			}
			items = append(items, item)
		}
		if items == nil {
			items = []inspireItem{}
		}
		json.NewEncoder(w).Encode(map[string]any{"items": items, "total": len(items)})
	})

	// API: /api/inspire/read
	mux.HandleFunc("/api/inspire/read", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		var body struct {
			ID int64 `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if err := database.UpdateStatus(body.ID, "read"); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	// API: /api/inspire/star
	mux.HandleFunc("/api/inspire/star", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		var body struct {
			ID int64 `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if err := database.UpdateStatus(body.ID, "starred"); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	// API: /api/inspire/mark-all-read
	mux.HandleFunc("/api/inspire/mark-all-read", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		affected, err := database.MarkAllRead("inspire")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]any{"status": "ok", "updated": affected})
	})

	// API: /api/inspire/burst
	mux.HandleFunc("/api/inspire/burst", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		var body struct {
			Count int    `json:"count"`
			Focus string `json:"focus"`
			Mode  string `json:"mode"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
			return
		}
		if body.Count <= 0 {
			body.Count = 3
		}
		if body.Count > 10 {
			body.Count = 10
		}
		if body.Mode == "" {
			body.Mode = "cross-domain"
		}

		cfg, err := config.Load()
		if err != nil || cfg.LLM.APIKey == "" {
			w.WriteHeader(http.StatusServiceUnavailable)
			json.NewEncoder(w).Encode(map[string]string{"error": "LLM API Key 未配置"})
			return
		}

		articles, err := database.GetArticles("", "inspire", 30)
		if err != nil || len(articles) == 0 {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "暂无灵感数据，请先运行 inspire"})
			return
		}

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
		if body.Focus != "" {
			focusClause = fmt.Sprintf("\n\n用户希望聚焦的方向是：%s。请围绕这个方向展开联想。", body.Focus)
		}

		template, ok := burstModePrompts[body.Mode]
		if !ok {
			template = burstModePrompts["cross-domain"]
		}
		prompt := fmt.Sprintf(template.Prompt, body.Count, productsText, focusClause)

		client := llm.NewClient(&cfg.LLM)
		resp, err := client.Chat(r.Context(), []llm.Message{
			{Role: "system", Content: template.System},
			{Role: "user", Content: prompt},
		}, 4000)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		clean := strings.TrimSpace(resp)
		clean = strings.TrimPrefix(clean, "```json")
		clean = strings.TrimPrefix(clean, "```")
		clean = strings.TrimSuffix(clean, "```")
		clean = strings.TrimSpace(clean)
		var ideas []burstIdea
		if err := json.Unmarshal([]byte(clean), &ideas); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "LLM 返回格式异常", "raw": resp})
			return
		}

		ideasJSON, _ := json.Marshal(ideas)
		burstID, _ := database.SaveBurstResult(body.Mode, body.Focus, string(ideasJSON), len(articles))

		json.NewEncoder(w).Encode(map[string]any{
			"id": burstID, "ideas": ideas, "count": len(ideas),
			"based_on": len(articles), "focus": body.Focus,
			"mode":         body.Mode,
			"generated_at": time.Now().Format("2006-01-02 15:04"),
		})
	})

	// API: /api/burst/history
	mux.HandleFunc("/api/burst/history", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		results, err := database.GetBurstResults(20)
		if err != nil {
			json.NewEncoder(w).Encode(map[string]any{"items": []any{}})
			return
		}
		if results == nil {
			results = []db.BurstResult{}
		}
		json.NewEncoder(w).Encode(map[string]any{"items": results})
	})

	// API: /api/burst/deep-dive
	mux.HandleFunc("/api/burst/deep-dive", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		var body struct {
			Title       string `json:"title"`
			Description string `json:"description"`
			Inspiration string `json:"inspiration"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		cfg, err := config.Load()
		if err != nil || cfg.LLM.APIKey == "" {
			w.WriteHeader(http.StatusServiceUnavailable)
			json.NewEncoder(w).Encode(map[string]string{"error": "LLM API Key 未配置"})
			return
		}

		prompt := fmt.Sprintf(`请对以下产品创意进行深入分析和扩展：

## 创意名称
%s

## 描述
%s

## 灵感来源
%s

请提供以下内容（用中文）：
1. **市场分析**：目标市场规模、竞品分析、差异化优势
2. **技术方案**：推荐的技术栈、架构概要、关键技术难点
3. **MVP 定义**：最小可行产品的核心功能（3-5个）
4. **开发计划**：一个人 4 周内的开发计划（按周分解）
5. **商业模式**：盈利模式、定价策略
6. **风险评估**：主要风险和应对方案

请以 JSON 格式返回：
{
  "market": "...",
  "tech": "...",
  "mvp": ["...", "..."],
  "timeline": ["第1周：...", "第2周：...", "第3周：...", "第4周：..."],
  "business": "...",
  "risks": "..."
}`, body.Title, body.Description, body.Inspiration)

		client := llm.NewClient(&cfg.LLM)
		resp, err := client.Chat(r.Context(), []llm.Message{
			{Role: "system", Content: "你是一位资深的独立开发者产品顾问，擅长将创意转化为可执行的计划。请用中文回答，返回纯 JSON。"},
			{Role: "user", Content: prompt},
		}, 4000)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		clean := strings.TrimSpace(resp)
		clean = strings.TrimPrefix(clean, "```json")
		clean = strings.TrimPrefix(clean, "```")
		clean = strings.TrimSuffix(clean, "```")
		clean = strings.TrimSpace(clean)

		json.NewEncoder(w).Encode(map[string]any{
			"analysis":     clean,
			"generated_at": time.Now().Format("2006-01-02 15:04"),
		})
	})
}
