#!/usr/bin/env bash
# P1-8：一键启用本仓库 git 钩子（pre-commit 提交门禁）。
# 用法：bash scripts/setup-hooks.sh
# 回滚：git config --unset core.hooksPath（恢复默认不启用钩子）
set -eu

cd "$(dirname "$0")/.."

if [ ! -d .githooks ]; then
  echo "❌ 找不到 .githooks/——请在仓库根运行" >&2
  exit 1
fi

git config core.hooksPath .githooks
echo "✅ core.hooksPath = .githooks（pre-commit 将运行 link_gate --changed-only --staged）"
echo "   验证：git config core.hooksPath"
echo "   回滚：git config --unset core.hooksPath"
