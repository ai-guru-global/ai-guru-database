package llm

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"ai-news-database/internal/config"
)

// testAPIKey 是单元测试专用的占位密钥（进程内单次求值，服务端断言与客户端配置同源引用，
// 不构成真实凭据；可用环境变量覆盖）。
var testAPIKey = func() string {
	if k := os.Getenv("AI_NEWS_UNIT_TEST_LLM_KEY"); k != "" {
		return k
	}
	return fmt.Sprintf("unit-test-%d", time.Now().UnixNano())
}()

func TestIsRetryable(t *testing.T) {
	tests := []struct {
		name string
		err  error
		want bool
	}{
		{"nil error", nil, false},
		{"timeout", fmt.Errorf("connection timeout"), true},
		{"connection refused", fmt.Errorf("connection refused"), true},
		{"EOF", fmt.Errorf("unexpected EOF"), true},
		{"502", fmt.Errorf("bad gateway 502"), true},
		{"503", fmt.Errorf("service unavailable 503"), true},
		{"429", fmt.Errorf("rate limited 429"), true},
		{"business error", fmt.Errorf("invalid api key"), false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := isRetryable(tt.err)
			if got != tt.want {
				t.Errorf("isRetryable(%v) = %v, want %v", tt.err, got, tt.want)
			}
		})
	}
}

func TestRetryWithBackoff_SuccessOnFirst(t *testing.T) {
	callCount := 0
	err := retryWithBackoff(context.Background(), func() error {
		callCount++
		return nil
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if callCount != 1 {
		t.Errorf("expected 1 call, got %d", callCount)
	}
}

func TestRetryWithBackoff_SuccessOnRetry(t *testing.T) {
	callCount := 0
	err := retryWithBackoff(context.Background(), func() error {
		callCount++
		if callCount < 2 {
			return fmt.Errorf("connection timeout")
		}
		return nil
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if callCount != 2 {
		t.Errorf("expected 2 calls, got %d", callCount)
	}
}

func TestRetryWithBackoff_NonRetryable(t *testing.T) {
	callCount := 0
	err := retryWithBackoff(context.Background(), func() error {
		callCount++
		return fmt.Errorf("invalid api key")
	})
	if err == nil {
		t.Fatal("expected error")
	}
	if callCount != 1 {
		t.Errorf("expected 1 call (non-retryable), got %d", callCount)
	}
}

func TestRetryWithBackoff_ContextCancel(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	callCount := 0
	err := retryWithBackoff(ctx, func() error {
		callCount++
		return fmt.Errorf("connection timeout")
	})
	if err == nil {
		t.Fatal("expected error")
	}
	if callCount != 1 {
		t.Errorf("expected 1 call (context canceled), got %d", callCount)
	}
}

func TestClient_Chat_Success(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			t.Errorf("expected POST, got %s", r.Method)
		}
		if auth := r.Header.Get("Authorization"); auth != "Bearer "+testAPIKey {
			t.Errorf("unexpected auth header: %q", auth)
		}

		var req ChatRequest
		_ = json.NewDecoder(r.Body).Decode(&req)
		if req.Model != "gpt-test" {
			t.Errorf("unexpected model: %q", req.Model)
		}

		resp := ChatResponse{
			Choices: []ChatChoice{
				{Message: Message{Role: "assistant", Content: "Hello from test"}},
			},
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(resp)
	}))
	defer ts.Close()

	client := NewClient(&config.LLMConfig{
		BaseURL:        ts.URL,
		APIKey:         testAPIKey,
		Model:          "gpt-test",
		EmbeddingModel: "emb-test",
	})

	msg, err := client.Chat(context.Background(), []Message{
		{Role: "user", Content: "hi"},
	}, 100)
	if err != nil {
		t.Fatalf("Chat failed: %v", err)
	}
	if msg != "Hello from test" {
		t.Errorf("unexpected response: %q", msg)
	}
}

func TestClient_Chat_APIError(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := ChatResponse{
			Error: &APIError{Message: "insufficient_quota", Type: "quota_error"},
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(resp)
	}))
	defer ts.Close()

	client := NewClient(&config.LLMConfig{
		BaseURL: ts.URL,
		APIKey:  testAPIKey,
		Model:   "gpt-test",
	})

	_, err := client.Chat(context.Background(), []Message{{Role: "user", Content: "hi"}}, 100)
	if err == nil {
		t.Fatal("expected error for API error response")
	}
	if !strings.Contains(err.Error(), "insufficient_quota") {
		t.Errorf("error should contain API error message, got: %v", err)
	}
}

func TestClient_Chat_EmptyChoices(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := ChatResponse{Choices: []ChatChoice{}}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(resp)
	}))
	defer ts.Close()

	client := NewClient(&config.LLMConfig{
		BaseURL: ts.URL,
		APIKey:  testAPIKey,
		Model:   "gpt-test",
	})

	_, err := client.Chat(context.Background(), []Message{{Role: "user", Content: "hi"}}, 100)
	if err == nil {
		t.Fatal("expected error for empty choices")
	}
}

func TestClient_Chat_NoAPIKey(t *testing.T) {
	client := NewClient(&config.LLMConfig{BaseURL: "http://test", APIKey: ""})
	_, err := client.Chat(context.Background(), []Message{{Role: "user", Content: "hi"}}, 100)
	if err == nil {
		t.Fatal("expected error when API key is empty")
	}
}

func TestClient_SimpleChat(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := ChatResponse{
			Choices: []ChatChoice{
				{Message: Message{Role: "assistant", Content: "Simple response"}},
			},
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(resp)
	}))
	defer ts.Close()

	client := NewClient(&config.LLMConfig{
		BaseURL: ts.URL,
		APIKey:  testAPIKey,
		Model:   "gpt-test",
	})

	msg, err := client.SimpleChat(context.Background(), "test prompt", 50)
	if err != nil {
		t.Fatalf("SimpleChat failed: %v", err)
	}
	if msg != "Simple response" {
		t.Errorf("unexpected response: %q", msg)
	}
}

func TestClient_GetEmbedding_Success(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := EmbeddingResponse{
			Data: []EmbeddingData{
				{Embedding: []float64{0.1, 0.2, 0.3}, Index: 0},
			},
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(resp)
	}))
	defer ts.Close()

	client := NewClient(&config.LLMConfig{
		BaseURL:        ts.URL,
		APIKey:         testAPIKey,
		Model:          "gpt-test",
		EmbeddingModel: "emb-test",
	})

	vec, err := client.GetEmbedding(context.Background(), "hello")
	if err != nil {
		t.Fatalf("GetEmbedding failed: %v", err)
	}
	if len(vec) != 3 {
		t.Errorf("expected 3 dims, got %d", len(vec))
	}
}

func TestClient_GetEmbedding_NoAPIKey(t *testing.T) {
	client := NewClient(&config.LLMConfig{BaseURL: "http://test", APIKey: ""})
	_, err := client.GetEmbedding(context.Background(), "hello")
	if err == nil {
		t.Fatal("expected error when API key is empty")
	}
}

func TestClient_DoRequest_Retry(t *testing.T) {
	attempts := 0
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		attempts++
		if attempts < 2 {
			w.WriteHeader(http.StatusServiceUnavailable)
			_, _ = w.Write([]byte(`{"error":"overloaded"}`))
			return
		}
		resp := ChatResponse{
			Choices: []ChatChoice{
				{Message: Message{Role: "assistant", Content: "OK"}},
			},
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(resp)
	}))
	defer ts.Close()

	client := NewClient(&config.LLMConfig{
		BaseURL: ts.URL,
		APIKey:  testAPIKey,
		Model:   "gpt-test",
	})

	msg, err := client.Chat(context.Background(), []Message{{Role: "user", Content: "hi"}}, 100)
	if err != nil {
		t.Fatalf("Chat failed: %v", err)
	}
	if msg != "OK" {
		t.Errorf("unexpected response: %q", msg)
	}
	if attempts < 2 {
		t.Errorf("expected at least 2 attempts due to retry, got %d", attempts)
	}
}

func TestClient_Chat_HTTPError(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
		_, _ = w.Write([]byte(`{"error":"invalid key"}`))
	}))
	defer ts.Close()

	client := NewClient(&config.LLMConfig{
		BaseURL: ts.URL,
		APIKey:  testAPIKey,
		Model:   "gpt-test",
	})

	_, err := client.Chat(context.Background(), []Message{{Role: "user", Content: "hi"}}, 100)
	if err == nil {
		t.Fatal("expected error for 401")
	}
}

func TestContains(t *testing.T) {
	if !contains("hello timeout world", "timeout") {
		t.Error("expected true")
	}
	if contains("hello world", "timeout") {
		t.Error("expected false")
	}
	if contains("hi", "timeout") {
		t.Error("expected false for shorter string")
	}
}

func TestSearchString(t *testing.T) {
	if !searchString("abcdef", "cde") {
		t.Error("expected true")
	}
	if searchString("abcdef", "xyz") {
		t.Error("expected false")
	}
}

func TestClient_Timeout(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(50 * time.Millisecond)
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{}`))
	}))
	defer ts.Close()

	client := NewClient(&config.LLMConfig{
		BaseURL: ts.URL,
		APIKey:  testAPIKey,
		Model:   "gpt-test",
	})
	client.client.Timeout = 10 * time.Millisecond

	_, err := client.Chat(context.Background(), []Message{{Role: "user", Content: "hi"}}, 100)
	if err == nil {
		t.Fatal("expected timeout error")
	}
}
