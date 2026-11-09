// Package llm 提供统一的 LLM 客户端：对话、嵌入、重试与退避。
package llm

import (
	"ai-news-database/internal/config"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"time"
)

// LLMClient defines the interface for LLM operations
type LLMClient interface {
	Chat(ctx context.Context, messages []Message, maxTokens int) (string, error)
	SimpleChat(ctx context.Context, prompt string, maxTokens int) (string, error)
	GetEmbedding(ctx context.Context, text string) ([]float64, error)
}

// Ensure Client implements LLMClient
var _ LLMClient = (*Client)(nil)

// Client LLM HTTP 客户端
type Client struct {
	cfg    *config.LLMConfig
	client *http.Client
}

// NewClient 创建 LLM 客户端
func NewClient(cfg *config.LLMConfig) *Client {
	return &Client{
		cfg: cfg,
		client: &http.Client{
			Timeout: 120 * time.Second,
		},
	}
}

// maxRetries 最大重试次数
const maxRetries = 3

// retryWithBackoff 指数退避重试
func retryWithBackoff(ctx context.Context, fn func() error) error {
	var lastErr error
	for attempt := 0; attempt <= maxRetries; attempt++ {
		if attempt > 0 {
			delay := time.Duration(1<<uint(attempt-1)) * time.Second // 1s, 2s, 4s
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(delay):
			}
		}
		lastErr = fn()
		if lastErr == nil {
			return nil
		}
		// 仅对网络错误重试，业务错误直接返回
		if !isRetryable(lastErr) {
			return lastErr
		}
	}
	return fmt.Errorf("重试 %d 次后仍失败: %w", maxRetries, lastErr)
}

// isRetryable 判断错误是否可重试
func isRetryable(err error) bool {
	if err == nil {
		return false
	}
	errStr := err.Error()
	// 网络超时、连接拒绝等可重试
	for _, pattern := range []string{"timeout", "connection refused", "EOF", "502", "503", "429"} {
		if contains(errStr, pattern) {
			return true
		}
	}
	return false
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && searchString(s, substr)
}

func searchString(s, sub string) bool {
	for i := 0; i <= len(s)-len(sub); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
}

// doRequest 执行 HTTP 请求（带重试）
func (c *Client) doRequest(ctx context.Context, url string, reqBody any) ([]byte, error) {
	data, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("序列化请求失败: %w", err)
	}

	var body []byte
	err = retryWithBackoff(ctx, func() error {
		req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(data))
		if err != nil {
			return fmt.Errorf("创建请求失败: %w", err)
		}

		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+c.cfg.APIKey)

		resp, err := c.client.Do(req)
		if err != nil {
			return fmt.Errorf("请求失败: %w", err)
		}
		defer func() { _ = resp.Body.Close() }()

		body, err = io.ReadAll(resp.Body)
		if err != nil {
			return fmt.Errorf("读取响应失败: %w", err)
		}

		if resp.StatusCode != http.StatusOK {
			return fmt.Errorf("API 错误 (status %d): %s", resp.StatusCode, string(body))
		}

		return nil
	})

	return body, err
}

// Chat 发送对话请求
func (c *Client) Chat(ctx context.Context, messages []Message, maxTokens int) (string, error) {
	if c.cfg.APIKey == "" {
		return "", fmt.Errorf("LLM API Key 未配置，请编辑 ~/.ai-news-database/config.json")
	}

	reqBody := ChatRequest{
		Model:       c.cfg.Model,
		Messages:    messages,
		MaxTokens:   maxTokens,
		Temperature: 0.3,
	}

	body, err := c.doRequest(ctx, c.cfg.BaseURL+"/chat/completions", reqBody)
	if err != nil {
		return "", err
	}

	var chatResp ChatResponse
	if err := json.Unmarshal(body, &chatResp); err != nil {
		return "", fmt.Errorf("解析响应失败: %w", err)
	}

	if chatResp.Error != nil {
		return "", fmt.Errorf("LLM API 错误: %s", chatResp.Error.Message)
	}

	if len(chatResp.Choices) == 0 {
		return "", fmt.Errorf("LLM 返回空结果")
	}

	return chatResp.Choices[0].Message.Content, nil
}

// SimpleChat 快速单轮对话
func (c *Client) SimpleChat(ctx context.Context, prompt string, maxTokens int) (string, error) {
	return c.Chat(ctx, []Message{
		{Role: "system", Content: "You are a helpful assistant for software engineers."},
		{Role: "user", Content: prompt},
	}, maxTokens)
}

// GetEmbedding 获取文本向量
func (c *Client) GetEmbedding(ctx context.Context, text string) ([]float64, error) {
	if c.cfg.APIKey == "" {
		return nil, fmt.Errorf("LLM API Key 未配置")
	}

	reqBody := EmbeddingRequest{
		Model: c.cfg.EmbeddingModel,
		Input: text,
	}

	body, err := c.doRequest(ctx, c.cfg.BaseURL+"/embeddings", reqBody)
	if err != nil {
		return nil, err
	}

	var embedResp EmbeddingResponse
	if err := json.Unmarshal(body, &embedResp); err != nil {
		return nil, fmt.Errorf("解析响应失败: %w", err)
	}

	if embedResp.Error != nil {
		return nil, fmt.Errorf("Embedding API 错误: %s", embedResp.Error.Message)
	}

	if len(embedResp.Data) == 0 {
		return nil, fmt.Errorf("Embedding 返回空结果")
	}

	return embedResp.Data[0].Embedding, nil
}

// CosineSimilarity 计算余弦相似度
func CosineSimilarity(a, b []float64) float64 {
	if len(a) != len(b) {
		return 0
	}

	var dot, normA, normB float64
	for i := 0; i < len(a); i++ {
		dot += a[i] * b[i]
		normA += a[i] * a[i]
		normB += b[i] * b[i]
	}

	if normA == 0 || normB == 0 {
		return 0
	}

	return dot / (math.Sqrt(normA) * math.Sqrt(normB))
}
