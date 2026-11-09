package enricher

import (
	"testing"

	"ai-news-database/internal/config"
	"ai-news-database/internal/mocks"
)

func TestParseResult(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		wantErr bool
	}{
		{"valid json", `{"summary":"Test","tags":"go","score":8.0,"language":"en"}`, false},
		{"with markdown code block", "```json\n{\"summary\":\"Test\",\"tags\":\"go\",\"score\":8.0,\"language\":\"en\"}\n```", false},
		{"invalid json", `{invalid}`, true},
		{"empty string", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := parseResult(tt.input)
			if tt.wantErr && err == nil {
				t.Errorf("parseResult(%q) expected error, got nil", tt.input)
			}
			if !tt.wantErr && err != nil {
				t.Errorf("parseResult(%q) unexpected error: %v", tt.input, err)
			}
			if !tt.wantErr && result.Summary != "Test" {
				t.Errorf("summary mismatch: want %q, got %q", "Test", result.Summary)
			}
		})
	}
}

func TestEnricher_Struct(t *testing.T) {
	// Test that Enricher can be created with mock dependencies
	mockLLM := &mocks.LLMClientMock{}
	mockReader := &mocks.ContentReaderMock{}
	cfg := &config.LLMConfig{EnrichMaxTokens: 2000}

	// Verify we can instantiate with mock dependencies
	_ = &Enricher{
		llmClient: mockLLM,
		reader:    mockReader,
		db:        nil,
		cfg:       cfg,
	}
}

func TestEnricher_NewWithDeps(t *testing.T) {
	mockLLM := &mocks.LLMClientMock{}
	mockReader := &mocks.ContentReaderMock{}
	cfg := &config.LLMConfig{EnrichMaxTokens: 2000}

	// NewWithDeps should work with mocks (db is nil but that's ok for struct creation)
	_ = NewWithDeps(nil, cfg, mockLLM, mockReader)
}
