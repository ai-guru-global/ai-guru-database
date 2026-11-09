package subscription

import "testing"

func TestManagerAdd(t *testing.T) {
	cfg := &Config{Subscriptions: []Subscription{}}
	m := NewManager(cfg)

	// Valid add
	if err := m.Add("Test Blog", "test", "https://example.com"); err != nil {
		t.Fatalf("Add failed: %v", err)
	}
	if len(m.List()) != 1 {
		t.Errorf("expected 1 subscription, got %d", len(m.List()))
	}

	// Duplicate name
	if err := m.Add("Test Blog", "test2", "https://example2.com"); err == nil {
		t.Error("expected error for duplicate name")
	}

	// Duplicate alias
	if err := m.Add("Test Blog 2", "test", "https://example2.com"); err == nil {
		t.Error("expected error for duplicate alias")
	}

	// Empty name
	if err := m.Add("", "empty", "https://example.com"); err == nil {
		t.Error("expected error for empty name")
	}

	// Invalid URL
	if err := m.Add("Bad URL", "bad", "not-a-url"); err == nil {
		t.Error("expected error for invalid URL")
	}
}

func TestManagerRemove(t *testing.T) {
	cfg := &Config{Subscriptions: []Subscription{}}
	m := NewManager(cfg)
	m.Add("A", "a", "https://a.com")
	m.Add("B", "b", "https://b.com")

	if err := m.Remove("A"); err != nil {
		t.Fatalf("Remove failed: %v", err)
	}
	if len(m.List()) != 1 {
		t.Errorf("expected 1 subscription after remove, got %d", len(m.List()))
	}

	if err := m.Remove("nonexistent"); err == nil {
		t.Error("expected error removing nonexistent subscription")
	}
}

func TestManagerGet(t *testing.T) {
	cfg := &Config{Subscriptions: []Subscription{}}
	m := NewManager(cfg)
	m.Add("Test", "test", "https://example.com")

	s, err := m.Get("Test")
	if err != nil || s.Name != "Test" {
		t.Error("expected to get subscription by name")
	}

	s, err = m.Get("test")
	if err != nil || s.Alias != "test" {
		t.Error("expected to get subscription by alias")
	}

	_, err = m.Get("nonexistent")
	if err == nil {
		t.Error("expected error for nonexistent subscription")
	}
}
