// Package logger 提供统一的日志输出。
package logger

import (
	"log/slog"
	"os"
)

// Log 是全局结构化日志实例
var Log *slog.Logger

func init() {
	// 默认使用 JSON 格式输出到 stderr
	Log = slog.New(slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
}

// SetLevel 动态设置日志级别
func SetLevel(level slog.Level) {
	Log = slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
		Level: level,
	}))
}

// SetDebug 开启 Debug 模式
func SetDebug() {
	SetLevel(slog.LevelDebug)
}
