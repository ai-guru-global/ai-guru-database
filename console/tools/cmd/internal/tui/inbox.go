package tui

import (
	"ai-news-database/internal/article"
	"ai-news-database/internal/i18n"
	"fmt"
	"strings"

	"github.com/charmbracelet/bubbles/key"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

// KeyMap defines the keybindings for the inbox
type KeyMap struct {
	Up      key.Binding
	Down    key.Binding
	Read    key.Binding
	Star    key.Binding
	Discard key.Binding
	Archive key.Binding
	All     key.Binding
	Unread  key.Binding
	Starred key.Binding
	Quit    key.Binding
}

// DefaultKeyMap returns the default keybindings
func DefaultKeyMap() KeyMap {
	return KeyMap{
		Up:      key.NewBinding(key.WithKeys("k", "up"), key.WithHelp("↑/k", "up")),
		Down:    key.NewBinding(key.WithKeys("j", "down"), key.WithHelp("↓/j", "down")),
		Read:    key.NewBinding(key.WithKeys("r"), key.WithHelp("r", "read")),
		Star:    key.NewBinding(key.WithKeys("s"), key.WithHelp("s", "star")),
		Discard: key.NewBinding(key.WithKeys("d"), key.WithHelp("d", "discard")),
		Archive: key.NewBinding(key.WithKeys("a"), key.WithHelp("a", "archive")),
		All:     key.NewBinding(key.WithKeys("1"), key.WithHelp("1", "all")),
		Unread:  key.NewBinding(key.WithKeys("2"), key.WithHelp("2", "unread")),
		Starred: key.NewBinding(key.WithKeys("3"), key.WithHelp("3", "starred")),
		Quit:    key.NewBinding(key.WithKeys("q", "ctrl+c", "esc"), key.WithHelp("q", "quit")),
	}
}

// Model is the inbox TUI model
type Model struct {
	db       DB
	articles []article.Article
	cursor   int
	filter   article.ReadStatus // empty = all
	keys     KeyMap
	width    int
	height   int
	errMsg   string
	infoMsg  string
}

// NewModel creates a new inbox model
func NewModel(database DB) Model {
	return Model{
		db:     database,
		filter: article.StatusUnread,
		keys:   DefaultKeyMap(),
	}
}

// Init loads articles and returns the model as a tea.Model
func (m Model) Init() tea.Cmd {
	return m.reloadCmd()
}

func (m Model) reloadCmd() tea.Cmd {
	return func() tea.Msg {
		arts, err := m.db.GetArticles(m.filter, "", 0)
		if err != nil {
			return errMsg{err: err}
		}
		return articlesMsg{articles: arts}
	}
}

type articlesMsg struct {
	articles []article.Article
}

type errMsg struct {
	err error
}

// Update handles messages and key events
func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		return m, nil

	case articlesMsg:
		m.articles = msg.articles
		if m.cursor >= len(m.articles) {
			m.cursor = max(0, len(m.articles)-1)
		}
		m.errMsg = ""
		return m, nil

	case errMsg:
		m.errMsg = msg.err.Error()
		return m, nil

	case tea.KeyMsg:
		if key.Matches(msg, m.keys.Quit) {
			return m, tea.Quit
		}
		if key.Matches(msg, m.keys.Up) {
			if m.cursor > 0 {
				m.cursor--
			}
			return m, nil
		}
		if key.Matches(msg, m.keys.Down) {
			if m.cursor < len(m.articles)-1 {
				m.cursor++
			}
			return m, nil
		}
		if key.Matches(msg, m.keys.All) {
			m.filter = ""
			m.cursor = 0
			return m, m.reloadCmd()
		}
		if key.Matches(msg, m.keys.Unread) {
			m.filter = article.StatusUnread
			m.cursor = 0
			return m, m.reloadCmd()
		}
		if key.Matches(msg, m.keys.Starred) {
			m.filter = article.StatusStarred
			m.cursor = 0
			return m, m.reloadCmd()
		}

		// Actions require an article
		if len(m.articles) == 0 {
			return m, nil
		}

		id := m.articles[m.cursor].ID
		var newStatus article.ReadStatus
		var actionName string

		switch {
		case key.Matches(msg, m.keys.Read):
			newStatus = article.StatusRead
			actionName = i18n.T("action.read")
		case key.Matches(msg, m.keys.Star):
			newStatus = article.StatusStarred
			actionName = i18n.T("action.starred")
		case key.Matches(msg, m.keys.Discard):
			newStatus = article.StatusDiscarded
			actionName = i18n.T("action.discarded")
		case key.Matches(msg, m.keys.Archive):
			newStatus = article.StatusArchived
			actionName = i18n.T("action.archived")
		default:
			return m, nil
		}

		if err := m.db.UpdateStatus(id, newStatus); err != nil {
			m.errMsg = err.Error()
			return m, nil
		}
		m.articles[m.cursor].ReadStatus = newStatus
		m.infoMsg = fmt.Sprintf(i18n.T("msg.action"), id, actionName)

		// Auto-advance cursor for smoother flow
		if m.cursor < len(m.articles)-1 {
			m.cursor++
		}

		// If filtering unread and item is no longer unread, reload to remove it
		if m.filter == article.StatusUnread && newStatus != article.StatusUnread {
			return m, m.reloadCmd()
		}
		return m, nil
	}

	return m, nil
}

// View renders the TUI
func (m Model) View() string {
	if m.width == 0 || m.height == 0 {
		return i18n.T("loading")
	}

	// Styles
	var (
		titleStyle    = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("#7D56F4"))
		headerStyle   = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("#FFFFFF")).Background(lipgloss.Color("#5A3FD7")).Padding(0, 1)
		selectedStyle = lipgloss.NewStyle().Background(lipgloss.Color("#3C3C3C")).Bold(true)
		statusStyle   = lipgloss.NewStyle().Width(3).Align(lipgloss.Center)
		sourceStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color("#888888")).Width(14)
		helpStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("#888888"))
		errStyle      = lipgloss.NewStyle().Foreground(lipgloss.Color("#FF5555"))
		infoStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("#55FF55"))
		previewStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("#BBBBBB")).PaddingLeft(2)
	)

	// Header
	filterName := i18n.T("filter.all")
	switch m.filter {
	case article.StatusUnread:
		filterName = i18n.T("filter.unread")
	case article.StatusStarred:
		filterName = i18n.T("filter.starred")
	}
	header := headerStyle.Width(m.width).Render(fmt.Sprintf(" %s %s — %s (%d)", titleStyle.Render("ai-news-database"), i18n.T("inbox.title"), filterName, len(m.articles)))

	// Article list
	listHeight := m.height - 10 // reserve space for header, preview, help, messages
	var listLines []string
	start := 0
	var end int
	if m.cursor >= listHeight {
		start = m.cursor - listHeight + 1
		end = min(len(m.articles), start+listHeight)
	} else {
		end = min(len(m.articles), listHeight)
	}

	for i := start; i < end; i++ {
		a := m.articles[i]
		icon := "○"
		switch a.ReadStatus {
		case article.StatusRead:
			icon = "✓"
		case article.StatusStarred:
			icon = "★"
		case article.StatusDiscarded:
			icon = "✗"
		case article.StatusArchived:
			icon = "▣"
		}

		title := a.Title
		if a.QualityScore > 0 {
			title = fmt.Sprintf("[%.1f] %s", a.QualityScore, a.Title)
		}
		line := fmt.Sprintf("%s %s %-14s %s",
			statusStyle.Render(icon),
			fmt.Sprintf("%3d.", a.ID),
			sourceStyle.Render(truncate(a.Source, 14)),
			truncate(title, m.width-30),
		)
		if i == m.cursor {
			line = selectedStyle.Width(m.width).Render(line)
		}
		listLines = append(listLines, line)
	}

	if len(m.articles) == 0 {
		listLines = append(listLines, i18n.T("article.empty"))
	}

	listBlock := strings.Join(listLines, "\n")

	// Preview panel for current article
	var preview string
	if m.cursor < len(m.articles) {
		a := m.articles[m.cursor]
		titleLine := lipgloss.NewStyle().Bold(true).Render(truncate(a.Title, m.width-4))
		urlLine := lipgloss.NewStyle().Foreground(lipgloss.Color("#7D56F4")).Render(truncate(a.URL, m.width-4))
		summary := a.LLMSummary
		if summary == "" {
			summary = a.Summary
		}
		snippet := stripHTML(truncate(summary, 300))
		meta := ""
		if a.LLMTags != "" {
			meta += fmt.Sprintf(i18n.T("preview.tags"), a.LLMTags)
		} else if a.Tags != "" {
			meta += fmt.Sprintf(i18n.T("preview.tags"), a.Tags)
		}
		if a.Note != "" {
			meta += fmt.Sprintf(i18n.T("preview.note"), a.Note)
		}
		if meta != "" {
			meta = lipgloss.NewStyle().Foreground(lipgloss.Color("#FFD700")).Render(meta)
		}
		previewParts := []string{titleLine, urlLine}
		if meta != "" {
			previewParts = append(previewParts, meta)
		}
		if snippet != "" {
			previewParts = append(previewParts, "", snippet)
		}
		preview = previewStyle.Width(m.width - 4).Render(strings.Join(previewParts, "\n"))
	}

	// Help / footer
	help := helpStyle.Render(i18n.T("help.hint"))

	// Messages
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

func truncate(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen-3] + "..."
}

func stripHTML(s string) string {
	// Very naive HTML strip for preview
	result := strings.ReplaceAll(s, "<p>", "")
	result = strings.ReplaceAll(result, "</p>", "\n")
	result = strings.ReplaceAll(result, "<br>", "\n")
	result = strings.ReplaceAll(result, "<br/>", "\n")
	result = strings.ReplaceAll(result, "&quot;", "\"")
	result = strings.ReplaceAll(result, "&amp;", "&")
	result = strings.ReplaceAll(result, "&lt;", "<")
	result = strings.ReplaceAll(result, "&gt;", ">")
	return result
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
