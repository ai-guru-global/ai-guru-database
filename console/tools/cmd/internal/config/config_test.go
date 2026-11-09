package config

import (
	"os"
	"path/filepath"
	"testing"
)

func TestDefaultConfig(t *testing.T) {
	cfg := DefaultConfig()
	if cfg == nil {
		t.Fatal("DefaultConfig() returned nil")
	}
	if cfg.LLM.Model != "gpt-4o-mini" {
		t.Errorf("expected default model gpt-4o-mini, got %s", cfg.LLM.Model)
	}
	if cfg.LLM.BaseURL != "https://api.openai.com/v1" {
		t.Errorf("expected default base URL, got %s", cfg.LLM.BaseURL)
	}
}

func TestLoadAndSave(t *testing.T) {
	// Use a temporary home directory to avoid messing with real config
	originalHome := os.Getenv("HOME")
	tmpHome := t.TempDir()
	os.Setenv("HOME", tmpHome)
	// Windows 上 os.UserHomeDir() 读 USERPROFILE，两者都要指向临时目录
	originalUserProfile := os.Getenv("USERPROFILE")
	os.Setenv("USERPROFILE", tmpHome)
	defer func() {
		os.Setenv("HOME", originalHome)
		os.Setenv("USERPROFILE", originalUserProfile)
	}()

	// First load should create default config
	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() failed: %v", err)
	}
	if cfg == nil {
		t.Fatal("Load() returned nil")
	}

	// Verify file was created
	configPath := filepath.Join(tmpHome, ".ai-news-database", "config.json")
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		t.Fatal("config file was not created")
	}

	// Modify and save
	cfg.LLM.Model = "test-model"
	if err := cfg.Save(); err != nil {
		t.Fatalf("Save() failed: %v", err)
	}

	// Reload and verify
	cfg2, err := Load()
	if err != nil {
		t.Fatalf("Load() second time failed: %v", err)
	}
	if cfg2.LLM.Model != "test-model" {
		t.Errorf("expected model test-model after reload, got %s", cfg2.LLM.Model)
	}
}
