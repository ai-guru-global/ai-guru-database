// Package mocks 提供测试用的接口 mock 实现。
package mocks

import (
	"ai-news-database/internal/llm"
	"context"
)

// LLMClientMock is a mock implementation of llm.LLMClient for testing
type LLMClientMock struct {
	SimpleChatFunc   func(ctx context.Context, prompt string, maxTokens int) (string, error)
	ChatFunc         func(ctx context.Context, messages []llm.Message, maxTokens int) (string, error)
	GetEmbeddingFunc func(ctx context.Context, text string) ([]float64, error)
}

func (m *LLMClientMock) SimpleChat(ctx context.Context, prompt string, maxTokens int) (string, error) {
	if m.SimpleChatFunc != nil {
		return m.SimpleChatFunc(ctx, prompt, maxTokens)
	}
	return "", nil
}

func (m *LLMClientMock) Chat(ctx context.Context, messages []llm.Message, maxTokens int) (string, error) {
	if m.ChatFunc != nil {
		return m.ChatFunc(ctx, messages, maxTokens)
	}
	return "", nil
}

func (m *LLMClientMock) GetEmbedding(ctx context.Context, text string) ([]float64, error) {
	if m.GetEmbeddingFunc != nil {
		return m.GetEmbeddingFunc(ctx, text)
	}
	return nil, nil
}
