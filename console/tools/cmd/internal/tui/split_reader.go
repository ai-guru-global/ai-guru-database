package tui

import (
	"ai-news-database/internal/article"
	"fmt"
	"strings"

	"github.com/charmbracelet/bubbles/key"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type SplitKeyMap struct {
	Up            key.Binding
	Down          key.Binding
	PageUp        key.Binding
	PageDown      key.Binding
	Select        key.Binding
	Open          key.Binding
	Read          key.Binding
	Star          key.Binding
	Discard       key.Binding
	FilterAll     key.Binding
	FilterUnread  key.Binding
	FilterStarred key.Binding
	Quit          key.Binding
}

func DefaultSplitKeyMap() SplitKeyMap {
	return SplitKeyMap{
		Up:            key.NewBinding(key.WithKeys("k", "up"), key.WithHelp("↑/k", "up")),
		Down:          key.NewBinding(key.WithKeys("j", "down"), key.WithHelp("↓/j", "down")),
		PageUp:        key.NewBinding(key.WithKeys("K", "pgup"), key.WithHelp("PgUp", "page up")),
		PageDown:      key.NewBinding(key.WithKeys("J", "pgdown"), key.WithHelp("PgDn", "page down")),
		Select:        key.NewBinding(key.WithKeys("enter"), key.WithHelp("Enter", "select")),
		Open:          key.NewBinding(key.WithKeys("o"), key.WithHelp("o", "open url")),
		Read:          key.NewBinding(key.WithKeys("r"), key.WithHelp("r", "mark read")),
		Star:          key.NewBinding(key.WithKeys("s"), key.WithHelp("s", "star")),
		Discard:       key.NewBinding(key.WithKeys("d"), key.WithHelp("d", "discard")),
		FilterAll:     key.NewBinding(key.WithKeys("1"), key.WithHelp("1", "all")),
		FilterUnread:  key.NewBinding(key.WithKeys("2"), key.WithHelp("2", "unread")),
		FilterStarred: key.NewBinding(key.WithKeys("3"), key.WithHelp("3", "starred")),
		Quit:          key.NewBinding(key.WithKeys("q", "ctrl+c", "esc"), key.WithHelp("q", "quit")),
	}
}

type SplitModel struct {
	db           DB
	articles     []article.Article
	cursor       int
	filter       article.ReadStatus
	keys         SplitKeyMap
	width        int
	height       int
	listWidth    int
	contentWidth int
	errMsg       string
	infoMsg      string
	scrollOffset int
}

func NewSplitModel(database DB) SplitModel {
	return SplitModel{
		db:     database,
		filter: article.StatusUnread,
		keys:   DefaultSplitKeyMap(),
	}
}

func (m SplitModel) Init() tea.Cmd {
	return m.reloadCmd()
}

func (m SplitModel) reloadCmd() tea.Cmd {
	return func() tea.Msg {
		arts, err := m.db.GetArticles(m.filter, "", 0)
		if err != nil {
			return errMsg{err: err}
		}
		return articlesMsg{articles: arts}
	}
}

func (m SplitModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		m.listWidth = m.width * 35 / 100
		if m.listWidth < 40 {
			m.listWidth = 40
		}
		m.contentWidth = m.width - m.listWidth - 3
		return m, nil

	case articlesMsg:
		m.articles = msg.articles
		if m.cursor >= len(m.articles) {
			m.cursor = max(0, len(m.articles)-1)
		}
		m.scrollOffset = 0
		m.errMsg = ""
		return m, nil

	case errMsg:
		m.errMsg = msg.err.Error()
		return m, nil

	case tea.KeyMsg:
		if key.Matches(msg, m.keys.Quit) {
			return m, tea.Quit
		}

		switch {
		case key.Matches(msg, m.keys.FilterAll):
			m.filter = ""
			m.cursor = 0
			m.scrollOffset = 0
			return m, m.reloadCmd()

		case key.Matches(msg, m.keys.FilterUnread):
			m.filter = article.StatusUnread
			m.cursor = 0
			m.scrollOffset = 0
			return m, m.reloadCmd()

		case key.Matches(msg, m.keys.FilterStarred):
			m.filter = article.StatusStarred
			m.cursor = 0
			m.scrollOffset = 0
			return m, m.reloadCmd()

		case key.Matches(msg, m.keys.Up):
			if m.cursor > 0 {
				m.cursor--
				if m.cursor < m.scrollOffset {
					m.scrollOffset = m.cursor
				}
			}
			return m, nil

		case key.Matches(msg, m.keys.Down):
			if m.cursor < len(m.articles)-1 {
				m.cursor++
				if m.cursor >= m.scrollOffset+getListVisibleHeight(m.height) {
					m.scrollOffset = m.cursor - getListVisibleHeight(m.height) + 1
				}
			}
			return m, nil

		case key.Matches(msg, m.keys.PageUp):
			m.scrollOffset = max(0, m.scrollOffset-getListVisibleHeight(m.height))
			m.cursor = max(m.scrollOffset, m.cursor-getListVisibleHeight(m.height))
			return m, nil

		case key.Matches(msg, m.keys.PageDown):
			visible := getListVisibleHeight(m.height)
			newOffset := min(m.scrollOffset+visible, max(0, len(m.articles)-visible))
			m.cursor = min(m.cursor+visible, len(m.articles)-1)
			m.scrollOffset = newOffset
			return m, nil
		}

		if len(m.articles) == 0 {
			return m, nil
		}

		id := m.articles[m.cursor].ID
		var newStatus article.ReadStatus

		switch {
		case key.Matches(msg, m.keys.Read):
			newStatus = article.StatusRead
		case key.Matches(msg, m.keys.Star):
			newStatus = article.StatusStarred
		case key.Matches(msg, m.keys.Discard):
			newStatus = article.StatusDiscarded
		default:
			return m, nil
		}

		if err := m.db.UpdateStatus(id, newStatus); err != nil {
			m.errMsg = err.Error()
			return m, nil
		}
		m.articles[m.cursor].ReadStatus = newStatus
		m.infoMsg = fmt.Sprintf("Article %d %s", id, getStatusName(newStatus))

		if m.filter == article.StatusUnread && newStatus != article.StatusUnread {
			return m, m.reloadCmd()
		}
		return m, nil
	}

	return m, nil
}

func (m SplitModel) View() string {
	if m.width == 0 || m.height == 0 {
		return "Loading..."
	}

	listPane := m.renderListPane()
	contentPane := m.renderContentPane()
	help := m.renderHelp()
	msgLine := m.renderMsgLine()

	borderVertical := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#444455"))

	mainContent := lipgloss.JoinHorizontal(lipgloss.Top,
		listPane,
		borderVertical.Render("│"),
		contentPane,
	)

	return lipgloss.JoinVertical(lipgloss.Left,
		mainContent,
		"",
		help,
		msgLine,
	)
}

func (m SplitModel) renderListPane() string {
	headerStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FFFFFF")).
		Background(lipgloss.Color("#5A3FD7")).
		Width(m.listWidth)

	itemStyle := lipgloss.NewStyle().Width(m.listWidth)
	selectedStyle := lipgloss.NewStyle().
		Background(lipgloss.Color("#3C3C5A")).
		Bold(true).
		Width(m.listWidth)

	filterName := "All"
	switch m.filter {
	case article.StatusUnread:
		filterName = "Unread"
	case article.StatusStarred:
		filterName = "Starred"
	}

	header := headerStyle.Render(fmt.Sprintf(" Articles (%d) ", len(m.articles)) + filterName)

	visibleHeight := getListVisibleHeight(m.height)
	start := m.scrollOffset
	end := min(len(m.articles), start+visibleHeight)

	var lines []string

	if len(m.articles) == 0 {
		emptyStyle := lipgloss.NewStyle().
			Width(m.listWidth).
			Foreground(lipgloss.Color("#888888"))
		return lipgloss.JoinVertical(lipgloss.Left,
			header,
			emptyStyle.Render(" No articles found "),
		)
	}

	for i := start; i < end; i++ {
		a := m.articles[i]
		icon := getStatusIcon(a.ReadStatus)

		title := truncate(a.Title, m.listWidth-20)
		scoreStr := ""
		if a.QualityScore > 0 {
			scoreStr = fmt.Sprintf("[%.1f] ", a.QualityScore)
		}

		line := fmt.Sprintf("%s %s%s", icon, scoreStr, title)

		style := itemStyle
		if i == m.cursor {
			style = selectedStyle
		}
		lines = append(lines, style.Render(line))
	}

	scrollIndicator := ""
	if m.scrollOffset > 0 {
		scrollIndicator = " ^"
	}
	if m.scrollOffset+getListVisibleHeight(m.height) < len(m.articles) {
		scrollIndicator += " v"
	}

	if scrollIndicator != "" {
		scrollStyle := lipgloss.NewStyle().
			Width(m.listWidth).
			Foreground(lipgloss.Color("#5A3FD7"))
		lines = append(lines, scrollStyle.Render(scrollIndicator))
	}

	listContent := strings.Join(lines, "\n")

	return lipgloss.JoinVertical(lipgloss.Left,
		header,
		listContent,
	)
}

func (m SplitModel) renderContentPane() string {
	headerStyle := lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FFFFFF")).
		Background(lipgloss.Color("#7D56F4")).
		Width(m.contentWidth)

	header := headerStyle.Render(" Content Preview ")

	bodyStyle := lipgloss.NewStyle().
		Width(m.contentWidth).
		Foreground(lipgloss.Color("#E0E0E0"))

	if m.cursor >= len(m.articles) {
		emptyStyle := lipgloss.NewStyle().
			Width(m.contentWidth).
			Foreground(lipgloss.Color("#888888"))
		return lipgloss.JoinVertical(lipgloss.Left,
			header,
			emptyStyle.Render(" Select an article to preview "),
		)
	}

	a := m.articles[m.cursor]
	content := m.renderArticleContent(a, bodyStyle)

	return lipgloss.JoinVertical(lipgloss.Left,
		header,
		content,
	)
}

func (m SplitModel) renderArticleContent(a article.Article, bodyStyle lipgloss.Style) string {
	var sb strings.Builder

	titleStyle := lipgloss.NewStyle().
		Width(m.contentWidth).
		Bold(true).
		Foreground(lipgloss.Color("#FFFFFF"))

	urlStyle := lipgloss.NewStyle().
		Width(m.contentWidth).
		Foreground(lipgloss.Color("#7D56F4"))

	metaStyle := lipgloss.NewStyle().
		Width(m.contentWidth).
		Foreground(lipgloss.Color("#FFD700"))

	sb.WriteString(titleStyle.Render("\n " + a.Title))
	sb.WriteString("\n\n")
	sb.WriteString(urlStyle.Render(" " + truncate(a.URL, m.contentWidth-2)))
	sb.WriteString("\n\n")

	metaParts := []string{}
	if a.Source != "" {
		metaParts = append(metaParts, "Source: "+a.Source)
	}
	if a.LLMTags != "" {
		metaParts = append(metaParts, "Tags: "+a.LLMTags)
	} else if a.Tags != "" {
		metaParts = append(metaParts, "Tags: "+a.Tags)
	}
	if a.QualityScore > 0 {
		metaParts = append(metaParts, fmt.Sprintf("Score: %.1f/10", a.QualityScore))
	}
	if len(metaParts) > 0 {
		sb.WriteString(metaStyle.Render(" " + strings.Join(metaParts, " | ")))
		sb.WriteString("\n\n")
	}

	text := a.LLMSummary
	if text == "" {
		text = a.Summary
	}
	if text == "" {
		text = a.RawContent
	}
	if text != "" {
		text = stripHTML(text)
		text = wrapText(text, m.contentWidth-4)
		sb.WriteString(bodyStyle.Render("\n " + text))
	}

	if a.Note != "" {
		sb.WriteString("\n\n")
		noteStyle := lipgloss.NewStyle().
			Width(m.contentWidth).
			Foreground(lipgloss.Color("#55FF55")).
			Background(lipgloss.Color("#1a2e1a"))
		sb.WriteString(noteStyle.Render(" Note: " + a.Note))
	}

	return bodyStyle.Render(sb.String())
}

func (m SplitModel) renderHelp() string {
	helpStyle := lipgloss.NewStyle().
		Foreground(lipgloss.Color("#888888"))
	return helpStyle.Render(" j/k:↑↓ Navigate | Enter:Select | r:Read | s:Star | d:Discard | 1/2/3:Filter | q:Quit ")
}

func (m SplitModel) renderMsgLine() string {
	if m.errMsg != "" {
		errStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#FF5555"))
		return errStyle.Render("Error: " + m.errMsg)
	}
	if m.infoMsg != "" {
		infoStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#55FF55"))
		return infoStyle.Render(m.infoMsg)
	}
	return ""
}

func getListVisibleHeight(totalHeight int) int {
	return max(1, totalHeight-5)
}

func getStatusIcon(status article.ReadStatus) string {
	switch status {
	case article.StatusRead:
		return "✓"
	case article.StatusStarred:
		return "★"
	case article.StatusDiscarded:
		return "✗"
	case article.StatusArchived:
		return "▣"
	default:
		return "○"
	}
}

func getStatusName(status article.ReadStatus) string {
	switch status {
	case article.StatusRead:
		return "marked read"
	case article.StatusStarred:
		return "starred"
	case article.StatusDiscarded:
		return "discarded"
	case article.StatusArchived:
		return "archived"
	default:
		return "updated"
	}
}

func wrapText(text string, maxWidth int) string {
	if maxWidth < 10 {
		maxWidth = 60
	}
	lines := strings.Split(text, "\n")
	var result []string

	for _, line := range lines {
		if len(line) <= maxWidth {
			result = append(result, line)
			continue
		}

		words := strings.Fields(line)
		var currentLine strings.Builder

		for _, word := range words {
			wordLen := len(word)
			if currentLine.Len() == 0 {
				if wordLen > maxWidth {
					for wordLen > maxWidth {
						result = append(result, word[:maxWidth-3]+"...")
						word = word[maxWidth-3:]
						wordLen = len(word)
					}
					if wordLen > 0 {
						currentLine.WriteString(word)
					}
				} else {
					currentLine.WriteString(word)
				}
			} else if currentLine.Len()+1+wordLen <= maxWidth {
				currentLine.WriteString(" ")
				currentLine.WriteString(word)
			} else {
				result = append(result, currentLine.String())
				currentLine.Reset()
				if wordLen > maxWidth {
					for wordLen > maxWidth {
						result = append(result, word[:maxWidth-3]+"...")
						word = word[maxWidth-3:]
						wordLen = len(word)
					}
					if wordLen > 0 {
						currentLine.WriteString(word)
					}
				} else {
					currentLine.WriteString(word)
				}
			}
		}

		if currentLine.Len() > 0 {
			result = append(result, currentLine.String())
		}
	}

	return strings.Join(result, "\n")
}
