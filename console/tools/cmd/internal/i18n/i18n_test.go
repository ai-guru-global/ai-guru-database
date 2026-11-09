package i18n

import "testing"

func TestT(t *testing.T) {
	// Default is Chinese
	if got := T("filter.unread"); got != "未读" {
		t.Errorf("expected 未读, got %s", got)
	}

	SetLang(EN)
	if got := T("filter.unread"); got != "unread" {
		t.Errorf("expected unread, got %s", got)
	}

	// Unknown key fallback
	if got := T("nonexistent.key"); got != "nonexistent.key" {
		t.Errorf("expected key itself for unknown, got %s", got)
	}

	// Reset back to ZH for other tests
	SetLang(ZH)
}

func TestGetLang(t *testing.T) {
	SetLang(EN)
	if GetLang() != EN {
		t.Errorf("expected EN, got %s", GetLang())
	}
	SetLang(ZH)
}
