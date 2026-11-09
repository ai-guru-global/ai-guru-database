// Package config 管理应用配置的加载、保存与加密。
package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

const configFile = "config.json"

// LLMConfig LLM 相关配置
type LLMConfig struct {
	BaseURL         string `json:"base_url"`
	APIKey          string `json:"api_key"`
	Model           string `json:"model"`
	EmbeddingModel  string `json:"embedding_model"`
	EnrichMaxTokens int    `json:"enrich_max_tokens"`
	AskMaxTokens    int    `json:"ask_max_tokens"`
}

// AppConfig 应用总配置
type AppConfig struct {
	LLM LLMConfig `json:"llm"`
}

// DefaultConfig 返回默认配置
func DefaultConfig() *AppConfig {
	return &AppConfig{
		LLM: LLMConfig{
			BaseURL:         "https://api.openai.com/v1",
			APIKey:          "",
			Model:           "gpt-4o-mini",
			EmbeddingModel:  "text-embedding-3-small",
			EnrichMaxTokens: 2000,
			AskMaxTokens:    4000,
		},
	}
}

// Load 加载配置文件，不存在则创建默认配置
func Load() (*AppConfig, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("无法获取用户主目录: %w", err)
	}

	configDir := filepath.Join(homeDir, ".ai-news-database")
	configPath := filepath.Join(configDir, configFile)

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		cfg := DefaultConfig()
		if err := cfg.Save(); err != nil {
			return nil, err
		}
		return cfg, nil
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("读取配置文件失败: %w", err)
	}

	var cfg AppConfig
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("解析配置文件失败: %w", err)
	}

	// 解密 API Key（兼容明文旧配置）
	if cfg.LLM.APIKey != "" {
		decrypted, err := DecryptString(cfg.LLM.APIKey)
		if err != nil {
			return nil, fmt.Errorf("解密 API Key 失败: %w", err)
		}
		cfg.LLM.APIKey = decrypted
	}

	// 补全默认值
	defaultCfg := DefaultConfig()
	if cfg.LLM.BaseURL == "" {
		cfg.LLM.BaseURL = defaultCfg.LLM.BaseURL
	}
	if cfg.LLM.Model == "" {
		cfg.LLM.Model = defaultCfg.LLM.Model
	}
	if cfg.LLM.EmbeddingModel == "" {
		cfg.LLM.EmbeddingModel = defaultCfg.LLM.EmbeddingModel
	}
	if cfg.LLM.EnrichMaxTokens == 0 {
		cfg.LLM.EnrichMaxTokens = defaultCfg.LLM.EnrichMaxTokens
	}
	if cfg.LLM.AskMaxTokens == 0 {
		cfg.LLM.AskMaxTokens = defaultCfg.LLM.AskMaxTokens
	}

	return &cfg, nil
}

// Save 保存配置文件（API Key 会自动加密）
func (c *AppConfig) Save() error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("无法获取用户主目录: %w", err)
	}

	configDir := filepath.Join(homeDir, ".ai-news-database")
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return fmt.Errorf("创建配置目录失败: %w", err)
	}

	configPath := filepath.Join(configDir, configFile)

	// 深拷贝配置，加密 API Key 后再写入（不修改原始对象）
	saveCopy := *c
	if saveCopy.LLM.APIKey != "" {
		encrypted, err := EncryptString(saveCopy.LLM.APIKey)
		if err != nil {
			return fmt.Errorf("加密 API Key 失败: %w", err)
		}
		saveCopy.LLM.APIKey = encrypted
	}

	data, err := json.MarshalIndent(saveCopy, "", "  ")
	if err != nil {
		return fmt.Errorf("序列化配置失败: %w", err)
	}

	return os.WriteFile(configPath, data, 0600)
}
