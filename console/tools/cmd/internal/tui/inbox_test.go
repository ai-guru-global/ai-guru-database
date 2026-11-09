package tui

import (
	"strings"
	"testing"

	"ai-news-database/internal/article"
	tea "github.com/charmbracelet/bubbletea"
)

// mockDB is a test double for the DB interface.
type mockDB struct {
	articles    []article.Article
	updateCalls []struct {
		id     int64
		status article.ReadStatus
	}
	getErr         error
	updateErr      error
	getLimit       int
	getStatus      article.ReadStatus
	getSourceAlias string
}

func (m *mockDB) GetArticles(status article.ReadStatus, sourceAlias string, limit int) ([]article.Article, error) {
	m.getStatus = status
	m.getSourceAlias = sourceAlias
	m.getLimit = limit
	if m.getErr != nil {
		return nil, m.getErr
	}
	return m.articles, nil
}

func (m *mockDB) UpdateStatus(id int64, status article.ReadStatus) error {
	m.updateCalls = append(m.updateCalls, struct {
		id     int64
		status article.ReadStatus
	}{id, status})
	if m.updateErr != nil {
		return m.updateErr
	}
	// Mutate internal state to simulate DB update
	for i := range m.articles {
		if m.articles[i].ID == id {
			m.articles[i].ReadStatus = status
			break
		}
	}
	return nil
}

func TestNewModel(t *testing.T) {
	m := NewModel(&mockDB{})
	if m.filter != article.StatusUnread {
		t.Errorf("expected default filter unread, got %s", m.filter)
	}
	if m.cursor != 0 {
		t.Errorf("expected cursor 0, got %d", m.cursor)
	}
}

func TestModelInit(t *testing.T) {
	dbMock := &mockDB{
		articles: []article.Article{
			{ID: 1, Title: "Test Article", ReadStatus: article.StatusUnread},
		},
	}
	m := NewModel(dbMock)
	cmd := m.Init()

	// Execute the command to simulate tea runtime
	msg := cmd()
	am, ok := msg.(articlesMsg)
	if !ok {
		t.Fatalf("expected articlesMsg, got %T", msg)
	}
	if len(am.articles) != 1 {
		t.Errorf("expected 1 article, got %d", len(am.articles))
	}
}

func TestWindowSize(t *testing.T) {
	m := NewModel(&mockDB{})
	m.width = 0
	m.height = 0

	newM, cmd := m.Update(tea.WindowSizeMsg{Width: 120, Height: 40})
	mm := newM.(Model)

	if mm.width != 120 || mm.height != 40 {
		t.Errorf("expected width=120 height=40, got width=%d height=%d", mm.width, mm.height)
	}
	if cmd != nil {
		t.Error("expected nil cmd after WindowSizeMsg")
	}
}

func TestQuitKey(t *testing.T) {
	m := NewModel(&mockDB{})
	newM, cmd := m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("q")})
	_ = newM.(Model)
	if cmd == nil {
		t.Fatal("expected tea.Quit cmd")
	}
	// bubbletea does not expose tea.Quit directly for equality check,
	// but we can verify it produces a quit message.
	quitMsg := cmd()
	if _, ok := quitMsg.(tea.QuitMsg); !ok {
		t.Fatalf("expected tea.QuitMsg, got %T", quitMsg)
	}
}

func TestCursorMovement(t *testing.T) {
	dbMock := &mockDB{
		articles: []article.Article{
			{ID: 1, Title: "A", ReadStatus: article.StatusUnread},
			{ID: 2, Title: "B", ReadStatus: article.StatusUnread},
			{ID: 3, Title: "C", ReadStatus: article.StatusUnread},
		},
	}
	m := NewModel(dbMock)
	// Pre-load articles
	m.articles = dbMock.articles

	// Move down
	newM, _ := m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("j")})
	mm := newM.(Model)
	if mm.cursor != 1 {
		t.Errorf("expected cursor 1 after j, got %d", mm.cursor)
	}

	// Move down again
	newM, _ = mm.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("j")})
	mm = newM.(Model)
	if mm.cursor != 2 {
		t.Errorf("expected cursor 2 after second j, got %d", mm.cursor)
	}

	// Move down past end (should clamp)
	newM, _ = mm.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("j")})
	mm = newM.(Model)
	if mm.cursor != 2 {
		t.Errorf("expected cursor still 2, got %d", mm.cursor)
	}

	// Move up
	newM, _ = mm.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("k")})
	mm = newM.(Model)
	if mm.cursor != 1 {
		t.Errorf("expected cursor 1 after k, got %d", mm.cursor)
	}
}

func TestFilterSwitch(t *testing.T) {
	dbMock := &mockDB{
		articles: []article.Article{
			{ID: 1, Title: "A", ReadStatus: article.StatusUnread},
		},
	}
	m := NewModel(dbMock)
	m.articles = dbMock.articles

	// Switch to all
	newM, cmd := m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("1")})
	mm := newM.(Model)
	if mm.filter != "" {
		t.Errorf("expected empty filter after 1, got %s", mm.filter)
	}
	if cmd == nil {
		t.Fatal("expected reload cmd after filter switch")
	}
	msg := cmd()
	if _, ok := msg.(articlesMsg); !ok {
		t.Fatalf("expected articlesMsg, got %T", msg)
	}

	// Switch to starred
	newM, _ = mm.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("3")})
	mm = newM.(Model)
	if mm.filter != article.StatusStarred {
		t.Errorf("expected starred filter after 3, got %s", mm.filter)
	}
}

func TestReadAction(t *testing.T) {
	dbMock := &mockDB{
		articles: []article.Article{
			{ID: 1, Title: "A", ReadStatus: article.StatusUnread},
			{ID: 2, Title: "B", ReadStatus: article.StatusUnread},
		},
	}
	m := NewModel(dbMock)
	m.articles = dbMock.articles

	newM, _ := m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("r")})
	mm := newM.(Model)

	if len(dbMock.updateCalls) != 1 {
		t.Fatalf("expected 1 update call, got %d", len(dbMock.updateCalls))
	}
	if dbMock.updateCalls[0].id != 1 {
		t.Errorf("expected update id 1, got %d", dbMock.updateCalls[0].id)
	}
	if dbMock.updateCalls[0].status != article.StatusRead {
		t.Errorf("expected update status read, got %s", dbMock.updateCalls[0].status)
	}
	if mm.articles[0].ReadStatus != article.StatusRead {
		t.Errorf("expected article 0 status read, got %s", mm.articles[0].ReadStatus)
	}
	if mm.cursor != 1 {
		t.Errorf("expected cursor auto-advanced to 1, got %d", mm.cursor)
	}
	if !strings.Contains(mm.infoMsg, "文章 1") {
		t.Errorf("expected info message to contain article id, got %s", mm.infoMsg)
	}
}

func TestStarAction(t *testing.T) {
	dbMock := &mockDB{
		articles: []article.Article{
			{ID: 10, Title: "A", ReadStatus: article.StatusUnread},
		},
	}
	m := NewModel(dbMock)
	m.articles = dbMock.articles

	_, _ = m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("s")})

	if len(dbMock.updateCalls) != 1 || dbMock.updateCalls[0].status != article.StatusStarred {
		t.Errorf("expected star action, got %+v", dbMock.updateCalls)
	}
}

func TestDiscardAction(t *testing.T) {
	dbMock := &mockDB{
		articles: []article.Article{
			{ID: 10, Title: "A", ReadStatus: article.StatusUnread},
		},
	}
	m := NewModel(dbMock)
	m.articles = dbMock.articles

	_, _ = m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("d")})

	if len(dbMock.updateCalls) != 1 || dbMock.updateCalls[0].status != article.StatusDiscarded {
		t.Errorf("expected discard action, got %+v", dbMock.updateCalls)
	}
}

func TestArchiveAction(t *testing.T) {
	dbMock := &mockDB{
		articles: []article.Article{
			{ID: 10, Title: "A", ReadStatus: article.StatusUnread},
		},
	}
	m := NewModel(dbMock)
	m.articles = dbMock.articles

	_, _ = m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("a")})

	if len(dbMock.updateCalls) != 1 || dbMock.updateCalls[0].status != article.StatusArchived {
		t.Errorf("expected archive action, got %+v", dbMock.updateCalls)
	}
}

func TestEmptyArticlesNoCrash(t *testing.T) {
	m := NewModel(&mockDB{articles: []article.Article{}})
	m.articles = []article.Article{}
	// Any action key should be a no-op when there are no articles
	newM, _ := m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune("r")})
	mm := newM.(Model)
	if mm.cursor != 0 {
		t.Errorf("expected cursor 0, got %d", mm.cursor)
	}
}

func TestViewNotEmpty(t *testing.T) {
	dbMock := &mockDB{
		articles: []article.Article{
			{ID: 1, Title: "Hello World", Source: "HN", ReadStatus: article.StatusUnread},
		},
	}
	m := NewModel(dbMock)
	m.articles = dbMock.articles
	m.width = 80
	m.height = 24

	view := m.View()
	if view == "" || view == "Loading..." {
		t.Fatal("expected non-empty view")
	}
	if !strings.Contains(view, "Hello World") {
		t.Error("expected view to contain article title")
	}
	if !strings.Contains(view, "HN") {
		t.Error("expected view to contain source name")
	}
}

func TestViewLoading(t *testing.T) {
	m := NewModel(&mockDB{})
	m.width = 0
	m.height = 0
	if m.View() != "Loading..." {
		t.Error("expected Loading... when dimensions are zero")
	}
}
