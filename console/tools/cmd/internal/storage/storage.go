// Package storage 管理订阅、收藏等用户数据的持久化。
package storage

import (
	"ai-news-database/internal/subscription"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

const (
	configDir  = ".ai-news-database"
	configFile = "subscriptions.json"
)

// Storage 提供订阅数据的持久化功能
type Storage struct {
	configPath string
}

// New 创建新的存储实例
func New() (*Storage, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("无法获取用户主目录: %w", err)
	}

	configPath := filepath.Join(homeDir, configDir, configFile)
	return &Storage{configPath: configPath}, nil
}

// ensureConfigDir 确保配置目录存在
func (s *Storage) ensureConfigDir() error {
	dir := filepath.Dir(s.configPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("无法创建配置目录: %w", err)
	}
	return nil
}

// Load 从配置文件加载订阅列表
func (s *Storage) Load() (*subscription.Config, error) {
	// 确保配置目录存在
	if err := s.ensureConfigDir(); err != nil {
		return nil, err
	}

	// 如果配置文件不存在，返回空配置
	if _, err := os.Stat(s.configPath); os.IsNotExist(err) {
		return &subscription.Config{Subscriptions: []subscription.Subscription{}}, nil
	}

	// 读取配置文件
	data, err := os.ReadFile(s.configPath)
	if err != nil {
		return nil, fmt.Errorf("无法读取配置文件: %w", err)
	}

	// 解析JSON
	var config subscription.Config
	if err := json.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("配置文件格式错误: %w", err)
	}

	return &config, nil
}

// Save 保存订阅列表到配置文件
func (s *Storage) Save(config *subscription.Config) error {
	// 确保配置目录存在
	if err := s.ensureConfigDir(); err != nil {
		return err
	}

	// 序列化为JSON
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return fmt.Errorf("无法序列化配置: %w", err)
	}

	// 写入文件
	if err := os.WriteFile(s.configPath, data, 0644); err != nil {
		return fmt.Errorf("无法写入配置文件: %w", err)
	}

	return nil
}
