package search

import (
	"net/url"
	"testing"
)

func TestExtractDomain(t *testing.T) {
	tests := []struct {
		urlStr string
		want   string
	}{
		{"https://www.example.com/path", "www.example.com"},
		{"http://example.com", "example.com"},
		{"https://sub.domain.example.co.uk/path?query=1", "sub.domain.example.co.uk"},
	}

	for _, tt := range tests {
		t.Run(tt.urlStr, func(t *testing.T) {
			got, err := extractDomain(tt.urlStr)
			if err != nil {
				t.Fatalf("extractDomain failed: %v", err)
			}
			if got != tt.want {
				t.Errorf("extractDomain(%q) = %q, want %q", tt.urlStr, got, tt.want)
			}
		})
	}

	// Invalid URL
	_, err := extractDomain("://invalid-url")
	if err == nil {
		t.Error("expected error for invalid URL")
	}
}

func TestExtractRealURL(t *testing.T) {
	tests := []struct {
		input string
		want  string
	}{
		{
			"https://duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com&rut=abc",
			"https://example.com",
		},
		{
			"https://example.com",
			"https://example.com",
		},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			got := extractRealURL(tt.input)
			if got != tt.want {
				t.Errorf("extractRealURL(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}

func TestNewEngine(t *testing.T) {
	e := NewEngine()
	if e == nil {
		t.Fatal("NewEngine() returned nil")
	}
}

func TestResolveURL(t *testing.T) {
	base, _ := url.Parse("https://example.com/path/")
	tests := []struct {
		href string
		want string
	}{
		{"https://other.com", "https://other.com"},
		{"/absolute", "https://example.com/absolute"},
		{"relative", "https://example.com/path/relative"},
	}

	for _, tt := range tests {
		ref, _ := url.Parse(tt.href)
		got := base.ResolveReference(ref).String()
		if got != tt.want {
			t.Errorf("resolve %q = %q, want %q", tt.href, got, tt.want)
		}
	}
}
