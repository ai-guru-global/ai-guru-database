package cmd

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/config"
	"ai-news-database/internal/crawler"
	"ai-news-database/internal/curator"
	"ai-news-database/internal/db"
	"ai-news-database/internal/enricher"
	"ai-news-database/internal/official"
	"ai-news-database/internal/rag"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
)

// registerCoreAPIs 注册核心 API 路由（stats, sync, enrich, curate, ask, articles, sources）
func registerCoreAPIs(mux *http.ServeMux, database *db.DB) {
	// API: /api/stats
	mux.HandleFunc("/api/stats", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		stats, err := database.Stats()
		if err != nil {
			json.NewEncoder(w).Encode(map[string]any{})
			return
		}
		total, unread, read := 0, 0, 0
		for _, s := range stats {
			if t, ok := s["total"].(int); ok {
				total += t
			}
			if u, ok := s["unread"].(int); ok {
				unread += u
			}
			if r, ok := s["read"].(int); ok {
				read += r
			}
		}
		articles, _ := database.GetArticles("", "", 0)
		enriched := 0
		for _, a := range articles {
			if a.EnrichedAt != nil {
				enriched++
			}
		}
		json.NewEncoder(w).Encode(map[string]any{
			"total": total, "unread": unread, "read": read, "enriched": enriched,
		})
	})

	// API: /api/sync
	mux.HandleFunc("/api/sync", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		var body struct {
			Source string `json:"source"`
		}
		json.NewDecoder(r.Body).Decode(&body)
		registry := official.GetRegistry()
		sources := registry.List()
		var saved, skipped int
		for _, source := range sources {
			if body.Source != "" && source.Alias != body.Source {
				continue
			}
			c, err := crawler.NewCrawler(source)
			if err != nil {
				continue
			}
			items, err := c.Fetch()
			if err != nil {
				continue
			}
			for _, item := range items {
				a := article.Article{
					Title:       item.Title,
					URL:         item.URL,
					Source:      item.Source,
					SourceAlias: item.SourceAlias,
					Summary:     item.RawContent,
					RawContent:  item.RawContent,
					ReadStatus:  article.StatusUnread,
				}
				if item.PublishedAt != nil {
					a.PublishedAt = item.PublishedAt
				}
				if err := database.SaveArticle(&a); err != nil {
					skipped++
				} else {
					saved++
				}
			}
		}
		json.NewEncoder(w).Encode(map[string]any{
			"message": fmt.Sprintf("新增 %d 条，更新 %d 条", saved, skipped),
			"saved":   saved, "skipped": skipped,
		})
	})

	// API: /api/enrich
	mux.HandleFunc("/api/enrich", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		cfg, _ := config.Load()
		if cfg.LLM.APIKey == "" {
			json.NewEncoder(w).Encode(map[string]string{"error": "LLM API Key 未配置"})
			return
		}
		articles, _ := database.GetUnenrichedArticles(10)
		if len(articles) == 0 {
			json.NewEncoder(w).Encode(map[string]any{"message": "没有需要增强的文章", "success": 0, "total": 0})
			return
		}
		enr := enricher.New(database, &cfg.LLM)
		success := 0
		for _, a := range articles {
			_, err := enr.EnrichArticle(r.Context(), &a)
			if err == nil {
				success++
			}
		}
		json.NewEncoder(w).Encode(map[string]any{
			"message": fmt.Sprintf("成功 %d / 总计 %d", success, len(articles)),
			"success": success, "total": len(articles),
		})
	})

	// API: /api/curate
	mux.HandleFunc("/api/curate", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		c := curator.New(database)
		picks, err := c.GetTopPicks(10)
		if err != nil {
			json.NewEncoder(w).Encode(map[string]any{"items": []any{}})
			return
		}
		items := make([]map[string]any, len(picks))
		for i, p := range picks {
			items[i] = map[string]any{
				"id": p.ID, "title": p.Title, "url": p.URL, "source": p.Source,
				"score": p.CuratorScore, "reason": p.Reason, "tags": p.LLMTags,
			}
		}
		json.NewEncoder(w).Encode(map[string]any{"items": items})
	})

	// API: /api/ask
	mux.HandleFunc("/api/ask", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		var body struct {
			Question string `json:"question"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
			return
		}
		cfg, _ := config.Load()
		if cfg.LLM.APIKey == "" {
			json.NewEncoder(w).Encode(map[string]string{"error": "LLM API Key 未配置"})
			return
		}
		rg := rag.New(database, &cfg.LLM)
		answer, refs, err := rg.Answer(r.Context(), body.Question)
		if err != nil {
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}
		refsOut := make([]map[string]string, len(refs))
		for i, ref := range refs {
			refsOut[i] = map[string]string{
				"index": fmt.Sprintf("%d", ref.Index),
				"title": ref.Title, "source": ref.Source, "url": ref.URL,
			}
		}
		json.NewEncoder(w).Encode(map[string]any{"answer": answer, "refs": refsOut})
	})

	// API: /api/articles
	mux.HandleFunc("/api/articles", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		filter := r.URL.Query().Get("filter")
		var status article.ReadStatus
		switch filter {
		case "unread":
			status = article.StatusUnread
		case "read":
			status = article.StatusRead
		case "starred":
			status = article.StatusStarred
		}
		articles, err := database.GetArticles(status, "", 50)
		if err != nil {
			json.NewEncoder(w).Encode(map[string]any{"items": []any{}})
			return
		}
		items := make([]map[string]any, len(articles))
		for i, a := range articles {
			items[i] = map[string]any{
				"id": a.ID, "title": a.Title, "url": a.URL,
				"source": a.Source, "source_alias": a.SourceAlias,
				"summary": a.Summary, "llm_summary": a.LLMSummary,
				"llm_tags": a.LLMTags, "quality_score": a.QualityScore,
				"read_status": string(a.ReadStatus),
				"fetched_at":  a.FetchedAt.Format("2006-01-02"),
			}
			if a.PublishedAt != nil {
				items[i]["published_at"] = a.PublishedAt.Format("2006-01-02")
			}
		}
		json.NewEncoder(w).Encode(map[string]any{"items": items})
	})

	// API: /api/articles/{id}/status
	mux.HandleFunc("/api/articles/", func(w http.ResponseWriter, r *http.Request) {
		re := regexp.MustCompile(`/api/articles/(\d+)/status`)
		matches := re.FindStringSubmatch(r.URL.Path)
		if len(matches) < 2 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if r.Method == http.MethodPost {
			var body struct {
				Status string `json:"status"`
			}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			var st article.ReadStatus
			switch body.Status {
			case "read":
				st = article.StatusRead
			case "starred":
				st = article.StatusStarred
			case "discarded":
				st = article.StatusDiscarded
			case "archived":
				st = article.StatusArchived
			default:
				st = article.ReadStatus(body.Status)
			}
			var id int64
			fmt.Sscanf(matches[1], "%d", &id)
			if err := database.UpdateStatus(id, st); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	})

	// API: /api/sources
	mux.HandleFunc("/api/sources", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		registry := official.GetRegistry()
		sources := registry.List()
		items := make([]map[string]string, len(sources))
		for i, s := range sources {
			items[i] = map[string]string{"name": s.Name, "alias": s.Alias, "url": s.URL}
		}
		json.NewEncoder(w).Encode(map[string]any{"sources": items})
	})
}
