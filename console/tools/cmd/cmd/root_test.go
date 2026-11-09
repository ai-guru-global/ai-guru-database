package cmd

import (
	"strings"
	"testing"
)

func TestVersion(t *testing.T) {
	// Ensure version is set in rootCmd
	if rootCmd.Version == "" {
		t.Error("expected rootCmd.Version to be non-empty")
	}
	if !strings.Contains(rootCmd.Version, version) {
		t.Errorf("expected version to contain %q, got %q", version, rootCmd.Version)
	}
}

func TestHandleOfficialSource(t *testing.T) {
	// Test known source
	err := handleOfficialSource("hn")
	// This will fail in test because there's no network, but it should not be "unknown command"
	if err != nil && strings.Contains(err.Error(), "未知命令") {
		t.Error("expected 'hn' to be recognized as official source")
	}

	// Test unknown source
	err = handleOfficialSource("notasource")
	if err == nil || !strings.Contains(err.Error(), "未知命令") {
		t.Error("expected unknown source to return error")
	}
}
