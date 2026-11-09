package llm

// Message 表示 LLM 对话消息
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatRequest OpenAI 兼容的 Chat Completions 请求
type ChatRequest struct {
	Model       string    `json:"model"`
	Messages    []Message `json:"messages"`
	MaxTokens   int       `json:"max_tokens,omitempty"`
	Temperature float64   `json:"temperature,omitempty"`
}

// ChatChoice 响应中的选择
type ChatChoice struct {
	Index   int     `json:"index"`
	Message Message `json:"message"`
}

// ChatResponse OpenAI 兼容的 Chat Completions 响应
type ChatResponse struct {
	ID      string       `json:"id"`
	Choices []ChatChoice `json:"choices"`
	Error   *APIError    `json:"error,omitempty"`
}

// APIError LLM API 错误
type APIError struct {
	Message string `json:"message"`
	Type    string `json:"type"`
}

// EmbeddingRequest 向量请求
type EmbeddingRequest struct {
	Model string `json:"model"`
	Input string `json:"input"`
}

// EmbeddingResponse 向量响应
type EmbeddingResponse struct {
	Data  []EmbeddingData `json:"data"`
	Error *APIError       `json:"error,omitempty"`
}

// EmbeddingData 单条向量数据
type EmbeddingData struct {
	Embedding []float64 `json:"embedding"`
	Index     int       `json:"index"`
}
