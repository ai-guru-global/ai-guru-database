package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

// e2e 测试：构建真实二进制后通过子进程驱动 CLI，
// 覆盖 cmd 层的命令注册、参数解析与基础执行路径。
// HOME 指向临时目录，避免污染开发者本机的 ~/.ai-news-database。

func buildBinary(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	bin := filepath.Join(dir, "ai-news-database-e2e")
	if runtime.GOOS == "windows" {
		bin += ".exe"
	}
	cmd := exec.Command("go", "build", "-o", bin, ".")
	cmd.Env = os.Environ()
	if out, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("构建二进制失败: %v\n%s", err, out)
	}
	return bin
}

func runCLI(t *testing.T, bin string, args ...string) (string, error) {
	t.Helper()
	home := t.TempDir()
	// bin 由 buildBinary 生成、args 均为本文件编译期用例；用 os.StartProcess 走 argv 列表语义（不经 shell）
	r, w, err := os.Pipe()
	if err != nil {
		t.Fatalf("创建管道失败: %v", err)
	}
	argv := append([]string{bin}, args...)
	attr := &os.ProcAttr{
		Dir:   ".",
		Env:   append(os.Environ(), "HOME="+home, "USERPROFILE="+home),
		Files: []*os.File{os.Stdin, w, w},
	}
	proc, err := os.StartProcess(bin, argv, attr)
	w.Close()
	if err != nil {
		r.Close()
		return "", err
	}
	out, _ := io.ReadAll(r)
	r.Close()
	state, waitErr := proc.Wait()
	if waitErr != nil {
		return string(out), waitErr
	}
	if code := state.ExitCode(); code != 0 {
		return string(out), fmt.Errorf("exit status %d", code)
	}
	return string(out), nil
}

func TestE2E_CLI(t *testing.T) {
	if testing.Short() {
		t.Skip("跳过 e2e 测试（-short 模式）")
	}
	bin := buildBinary(t)

	t.Run("help 输出包含核心命令", func(t *testing.T) {
		out, err := runCLI(t, bin, "--help")
		if err != nil {
			t.Fatalf("--help 执行失败: %v\n%s", err, out)
		}
		for _, want := range []string{"sync", "search", "list", "web"} {
			if !strings.Contains(out, want) {
				t.Errorf("--help 输出缺少命令 %q", want)
			}
		}
	})

	t.Run("sources 列出官方源", func(t *testing.T) {
		out, err := runCLI(t, bin, "sources")
		if err != nil {
			t.Fatalf("sources 执行失败: %v\n%s", err, out)
		}
		if strings.TrimSpace(out) == "" {
			t.Error("sources 输出为空")
		}
	})

	t.Run("stats 在空库上正常执行", func(t *testing.T) {
		out, err := runCLI(t, bin, "stats")
		if err != nil {
			t.Fatalf("stats 执行失败: %v\n%s", err, out)
		}
	})

	t.Run("search 在空库上正常执行", func(t *testing.T) {
		out, err := runCLI(t, bin, "search", "测试关键词")
		if err != nil {
			t.Fatalf("search 执行失败: %v\n%s", err, out)
		}
	})

	t.Run("completion 生成 bash 补全脚本", func(t *testing.T) {
		out, err := runCLI(t, bin, "completion", "bash")
		if err != nil {
			t.Fatalf("completion 执行失败: %v\n%s", err, out)
		}
		if !strings.Contains(out, "bash completion") && !strings.Contains(out, "complete") {
			t.Error("completion 输出不像 bash 补全脚本")
		}
	})

	t.Run("未知命令返回错误", func(t *testing.T) {
		_, err := runCLI(t, bin, "definitely-not-a-command-xyz")
		if err == nil {
			t.Error("未知命令应返回非零退出码")
		}
	})
}
