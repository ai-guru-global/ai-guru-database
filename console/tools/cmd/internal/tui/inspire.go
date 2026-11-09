// Package tui 提供基于 Bubble Tea 的终端交互界面。
package tui

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/db"
	"encoding/json"
	"fmt"
	"html"
	"net/http"
	neturl "net/url"
	"sort"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/key"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/pkg/browser"
)

type InspireKeyMap struct {
	Up           key.Binding
	Down         key.Binding
	Open         key.Binding
	Refresh      key.Binding
	MarkRead     key.Binding
	Star         key.Binding
	ToggleSort   key.Binding
	FilterPoints key.Binding
	Quit         key.Binding
}

func DefaultInspireKeyMap() InspireKeyMap {
	return InspireKeyMap{
		Up:           key.NewBinding(key.WithKeys("k", "up"), key.WithHelp("↑/k", "up")),
		Down:         key.NewBinding(key.WithKeys("j", "down"), key.WithHelp("↓/j", "down")),
		Open:         key.NewBinding(key.WithKeys("enter", "o"), key.WithHelp("o/enter", "open")),
		Refresh:      key.NewBinding(key.WithKeys("r"), key.WithHelp("r", "refresh")),
		MarkRead:     key.NewBinding(key.WithKeys("m"), key.WithHelp("m", "mark read")),
		Star:         key.NewBinding(key.WithKeys("s"), key.WithHelp("s", "star")),
		ToggleSort:   key.NewBinding(key.WithKeys("p"), key.WithHelp("p", "sort by points")),
		FilterPoints: key.NewBinding(key.WithKeys("f"), key.WithHelp("f", "filter ≥50 pts")),
		Quit:         key.NewBinding(key.WithKeys("q", "ctrl+c", "esc"), key.WithHelp("q", "quit")),
	}
}

type inspireHNResponse struct {
	Hits []inspireHNHit `json:"hits"`
}

type inspireHNHit struct {
	Title       string `json:"title"`
	URL         string `json:"url"`
	ObjectID    string `json:"objectID"`
	CreatedAt   string `json:"created_at"`
	StoryText   string `json:"story_text"`
	Points      int    `json:"points"`
	NumComments int    `json:"num_comments"`
	Author      string `json:"author"`
}

type InspireModel struct {
	hits         []inspireHNHit
	cursor       int
	loading      bool
	keys         InspireKeyMap
	width        int
	height       int
	errMsg       string
	infoMsg      string
	days         int
	limit        int
	sortByPoints bool
	minPoints    int
	dbStatus     map[string]string
}

func NewInspireModel(days, limit int) InspireModel {
	return InspireModel{
		days:      days,
		limit:     limit,
		keys:      DefaultInspireKeyMap(),
		minPoints: 0,
		dbStatus:  make(map[string]string),
	}
}

func (m InspireModel) Init() tea.Cmd {
	return m.fetchCmd()
}

func (m InspireModel) fetchCmd() tea.Cmd {
	return func() tea.Msg {
		since := time.Now().AddDate(0, 0, -m.days).Unix()
		apiURL := fmt.Sprintf(
			"https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=%d&numericFilters=created_at_i%%3E%d",
			m.limit, since,
		)

		client := &http.Client{Timeout: 30 * time.Second}
		resp, err := client.Get(apiURL)
		if err != nil {
			return inspireErrMsg{err: fmt.Errorf("请求 HN API 失败: %w", err)}
		}
		defer func() { _ = resp.Body.Close() }()

		if resp.StatusCode != http.StatusOK {
			return inspireErrMsg{err: fmt.Errorf("HN API 返回状态码 %d", resp.StatusCode)}
		}

		var result inspireHNResponse
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			return inspireErrMsg{err: fmt.Errorf("解析 HN API 响应失败: %w", err)}
		}

		return inspireHitsMsg{hits: result.Hits}
	}
}

type inspireHitsMsg struct {
	hits []inspireHNHit
}

type inspireDBStatusMsg struct {
	status map[string]string
}

type inspireErrMsg struct {
	err error
}

func hitURL(h inspireHNHit) string {
	if h.URL != "" {
		return h.URL
	}
	return fmt.Sprintf("https://news.ycombinator.com/item?id=%s", h.ObjectID)
}

func cleanTitle(t string) string {
	t = strings.TrimPrefix(t, "Show HN: ")
	t = strings.TrimPrefix(t, "Show HN:")
	return strings.TrimSpace(t)
}

func (m InspireModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		return m, nil

	case inspireHitsMsg:
		m.hits = msg.hits
		m.loading = false
		m.errMsg = ""
		if m.sortByPoints {
			sort.Slice(m.hits, func(i, j int) bool {
				return m.hits[i].Points > m.hits[j].Points
			})
		}
		if m.minPoints > 0 {
			filtered := make([]inspireHNHit, 0, len(m.hits))
			for _, h := range m.hits {
				if h.Points >= m.minPoints {
					filtered = append(filtered, h)
				}
			}
			m.hits = filtered
		}
		go saveInspireHits(msg.hits)
		return m, m.loadDBStatusCmd()

	case inspireDBStatusMsg:
		m.dbStatus = msg.status
		return m, nil

	case inspireErrMsg:
		m.errMsg = msg.err.Error()
		m.loading = false
		return m, nil

	case tea.KeyMsg:
		if key.Matches(msg, m.keys.Quit) {
			return m, tea.Quit
		}
		if key.Matches(msg, m.keys.Refresh) {
			m.loading = true
			m.errMsg = ""
			m.sortByPoints = false
			m.minPoints = 0
			return m, m.fetchCmd()
		}
		if key.Matches(msg, m.keys.Up) {
			if m.cursor > 0 {
				m.cursor--
			}
			return m, nil
		}
		if key.Matches(msg, m.keys.Down) {
			if m.cursor < len(m.hits)-1 {
				m.cursor++
			}
			return m, nil
		}
		if key.Matches(msg, m.keys.Open) && len(m.hits) > 0 {
			hit := m.hits[m.cursor]
			url := hitURL(hit)
			openBrowser(url)
			m.infoMsg = fmt.Sprintf("已打开: %s", cleanTitle(hit.Title))
			return m, nil
		}
		if key.Matches(msg, m.keys.MarkRead) && len(m.hits) > 0 {
			hit := m.hits[m.cursor]
			url := hitURL(hit)
			go updateArticleStatus(url, article.StatusRead)
			m.dbStatus[url] = "read"
			m.infoMsg = fmt.Sprintf("已读: %s", cleanTitle(hit.Title))
			if m.cursor < len(m.hits)-1 {
				m.cursor++
			}
			return m, nil
		}
		if key.Matches(msg, m.keys.Star) && len(m.hits) > 0 {
			hit := m.hits[m.cursor]
			url := hitURL(hit)
			current := m.dbStatus[url]
			if current == "starred" {
				go updateArticleStatus(url, article.StatusUnread)
				m.dbStatus[url] = "unread"
				m.infoMsg = fmt.Sprintf("取消收藏: %s", cleanTitle(hit.Title))
			} else {
				go updateArticleStatus(url, article.StatusStarred)
				m.dbStatus[url] = "starred"
				m.infoMsg = fmt.Sprintf("已收藏: %s", cleanTitle(hit.Title))
			}
			return m, nil
		}
		if key.Matches(msg, m.keys.ToggleSort) {
			m.sortByPoints = !m.sortByPoints
			if m.sortByPoints {
				sort.Slice(m.hits, func(i, j int) bool {
					return m.hits[i].Points > m.hits[j].Points
				})
				m.infoMsg = "按热度排序"
			} else {
				m.infoMsg = "按时间排序"
			}
			m.cursor = 0
			return m, nil
		}
		if key.Matches(msg, m.keys.FilterPoints) {
			if m.minPoints == 0 {
				m.minPoints = 50
				m.infoMsg = "过滤: ≥50 分"
			} else if m.minPoints == 50 {
				m.minPoints = 100
				m.infoMsg = "过滤: ≥100 分"
			} else {
				m.minPoints = 0
				m.infoMsg = "过滤: 关闭"
				return m, m.fetchCmd()
			}
			filtered := make([]inspireHNHit, 0)
			for _, h := range m.hits {
				if h.Points >= m.minPoints {
					filtered = append(filtered, h)
				}
			}
			m.hits = filtered
			m.cursor = 0
			return m, nil
		}
		return m, nil
	}
	return m, nil
}

func (m InspireModel) loadDBStatusCmd() tea.Cmd {
	hits := m.hits
	return func() tea.Msg {
		database, err := db.New()
		if err != nil {
			return inspireDBStatusMsg{status: make(map[string]string)}
		}
		defer database.Close()

		status := make(map[string]string)
		for _, h := range hits {
			url := hitURL(h)
			var readStatus string
			err := database.Conn().QueryRow("SELECT read_status FROM articles WHERE url = ?", url).Scan(&readStatus)
			if err == nil {
				status[url] = readStatus
			}
		}
		return inspireDBStatusMsg{status: status}
	}
}

func updateArticleStatus(url string, status article.ReadStatus) {
	database, err := db.New()
	if err != nil {
		return
	}
	defer database.Close()
	database.Conn().Exec("UPDATE articles SET read_status = ? WHERE url = ?", status, url)
}

func (m InspireModel) View() string {
	if m.width == 0 || m.height == 0 {
		return "Loading..."
	}

	var (
		titleStyle    = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("#FFD700"))
		headerStyle   = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("#FFFFFF")).Background(lipgloss.Color("#B8860B")).Padding(0, 1)
		selectedStyle = lipgloss.NewStyle().Background(lipgloss.Color("#3C3C3C")).Bold(true)
		commentsStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#FF79C6")).Width(6)
		authorStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color("#888888")).Width(12)
		helpStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("#888888"))
		errStyle      = lipgloss.NewStyle().Foreground(lipgloss.Color("#FF5555"))
		infoStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("#55FF55"))
		previewStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("#BBBBBB")).PaddingLeft(2)
		loadingStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("#FFD700"))
		starredStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("#FFD700"))
		readStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("#666666"))
	)

	sortIndicator := ""
	if m.sortByPoints {
		sortIndicator = " [热度]"
	}
	filterIndicator := ""
	if m.minPoints > 0 {
		filterIndicator = fmt.Sprintf(" [≥%d分]", m.minPoints)
	}

	header := headerStyle.Width(m.width).Render(
		fmt.Sprintf(" ✨ %s — 最近 %d 天 Show HN (%d)%s%s",
			titleStyle.Render("灵感补给站"),
			m.days,
			len(m.hits),
			sortIndicator,
			filterIndicator,
		),
	)

	var listLines []string

	if m.loading {
		listLines = append(listLines, loadingStyle.Render(" ⟳ 正在获取 Hacker News 新产品..."))
	} else if len(m.hits) == 0 {
		listLines = append(listLines, "  暂无新产品发布信息")
	} else {
		listHeight := m.height - 12
		start := 0
		var end int
		if m.cursor >= listHeight {
			start = m.cursor - listHeight + 1
			end = minInt(len(m.hits), start+listHeight)
		} else {
			end = minInt(len(m.hits), listHeight)
		}

		for i := start; i < end; i++ {
			hit := m.hits[i]
			title := cleanTitle(hit.Title)

			var statusIcon string
			url := hitURL(hit)
			switch m.dbStatus[url] {
			case "starred":
				statusIcon = starredStyle.Render("★")
			case "read":
				statusIcon = readStyle.Render("✓")
			default:
				statusIcon = " "
			}

			ptColor := lipgloss.Color("#888888")
			if hit.Points >= 100 {
				ptColor = lipgloss.Color("#FFD700")
			} else if hit.Points >= 50 {
				ptColor = lipgloss.Color("#55FF55")
			}
			pts := lipgloss.NewStyle().Foreground(ptColor).Width(7).Render(fmt.Sprintf("▲ %d", hit.Points))

			line := fmt.Sprintf("%s %s %s %s %s %s",
				statusIcon,
				pts,
				commentsStyle.Render(fmt.Sprintf("💬 %d", hit.NumComments)),
				authorStyle.Render(truncate(hit.Author, 12)),
				fmt.Sprintf("%2d.", i+1),
				truncate(title, m.width-38),
			)

			if m.dbStatus[url] == "read" {
				line = readStyle.Render(line)
			}

			if i == m.cursor {
				line = selectedStyle.Width(m.width).Render(line)
			}
			listLines = append(listLines, line)
		}
	}

	listBlock := strings.Join(listLines, "\n")

	var preview string
	if !m.loading && m.cursor < len(m.hits) {
		hit := m.hits[m.cursor]
		title := cleanTitle(hit.Title)

		titleLine := lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("#FFD700")).Render(truncate(title, m.width-4))

		urlDisplay := hitURL(hit)
		urlLine := lipgloss.NewStyle().Foreground(lipgloss.Color("#7D56F4")).Render(truncate(urlDisplay, m.width-4))

		hnURL := fmt.Sprintf("https://news.ycombinator.com/item?id=%s", hit.ObjectID)
		hnLine := lipgloss.NewStyle().Foreground(lipgloss.Color("#888888")).Render(fmt.Sprintf("💬 HN: %s", truncate(hnURL, m.width-8)))

		var desc string
		if hit.StoryText != "" {
			desc = stripHTMLTags(hit.StoryText)
			desc = html.UnescapeString(desc)
			desc = strings.TrimSpace(desc)
			if len(desc) > 500 {
				desc = desc[:497] + "..."
			}
		}

		meta := fmt.Sprintf("by %s  ▲ %d  💬 %d",
			hit.Author,
			hit.Points,
			hit.NumComments,
		)
		if hit.CreatedAt != "" {
			if t, err := time.Parse(time.RFC3339, hit.CreatedAt); err == nil {
				meta += fmt.Sprintf("  • %s", t.Format("2006-01-02"))
			}
		}

		dbStatus := m.dbStatus[hitURL(hit)]
		if dbStatus == "starred" {
			meta += "  ★ 已收藏"
		} else if dbStatus == "read" {
			meta += "  ✓ 已读"
		}
		metaLine := lipgloss.NewStyle().Foreground(lipgloss.Color("#FFD700")).Render(meta)

		previewParts := []string{titleLine, urlLine, hnLine, "", metaLine}
		if desc != "" {
			previewParts = append(previewParts, "", desc)
		}
		preview = previewStyle.Width(m.width - 4).Render(strings.Join(previewParts, "\n"))
	}

	help := helpStyle.Render("j/↑ k/↓  o=打开  m=已读  s=收藏  p=热度排序  f=过滤  r=刷新  q=quit")

	var msgLine string
	if m.errMsg != "" {
		msgLine = errStyle.Render(m.errMsg)
	} else if m.infoMsg != "" {
		msgLine = infoStyle.Render(m.infoMsg)
	}

	return lipgloss.JoinVertical(lipgloss.Left,
		header,
		listBlock,
		"",
		preview,
		"",
		help,
		msgLine,
	)
}

func saveInspireHits(hits []inspireHNHit) {
	database, err := db.New()
	if err != nil {
		return
	}
	defer database.Close()

	for _, hit := range hits {
		url := hitURL(hit)

		if database.ArticleExists(url) {
			database.Conn().Exec("UPDATE articles SET points = ? WHERE url = ?", hit.Points, url)
			continue
		}

		title := cleanTitle(hit.Title)

		var summary string
		if hit.StoryText != "" {
			summary = stripHTMLTags(hit.StoryText)
			summary = html.UnescapeString(summary)
			summary = strings.TrimSpace(summary)
			if len(summary) > 500 {
				summary = summary[:497] + "..."
			}
		}

		var publishedAt *time.Time
		if hit.CreatedAt != "" {
			if t, err := time.Parse(time.RFC3339, hit.CreatedAt); err == nil {
				publishedAt = &t
			}
		}

		a := &article.Article{
			Title:       title,
			URL:         url,
			Source:      "hackernews",
			SourceAlias: "inspire",
			Summary:     summary,
			RawContent:  hit.StoryText,
			PublishedAt: publishedAt,
			FetchedAt:   time.Now(),
			ReadStatus:  article.StatusUnread,
			Points:      hit.Points,
		}

		_ = database.SaveArticle(a)
	}
}

func stripHTMLTags(s string) string {
	var out strings.Builder
	inTag := false
	for _, r := range s {
		if r == '<' {
			inTag = true
			continue
		}
		if r == '>' {
			inTag = false
			continue
		}
		if !inTag {
			out.WriteRune(r)
		}
	}
	return out.String()
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func openBrowser(url string) {
	// 仅放行 http/https 链接后交给 browser 库按平台打开，避免任意 scheme 被移交给系统 opener
	u, err := neturl.ParseRequestURI(url)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") {
		return
	}
	_ = browser.OpenURL(u.String())
}
