#!/bin/bash
# AI HOT 每日增量同步 + 重建可读索引
#
# 用法：
#   tools/daily_sync.sh           # 正常每日同步
#   tools/daily_sync.sh --full    # 重新全量 snapshot（注意：会覆盖 state.json）
#
# 设计：pull_changes 是幂等的（cursor 持久化在 state.json），可以放心 cron。

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
say() { echo "[$(ts)] $*" | tee -a "$LOG_DIR/daily_sync.log"; }

say "==== daily_sync start ===="

if [ "$1" = "--full" ]; then
  say "full mode: 重新 snapshot（覆盖 state.json + items.jsonl）"
  python3 tools/pull_snapshot.py 2>&1 | tee -a "$LOG_DIR/daily_sync.log"
  rc=${PIPESTATUS[0]}
  if [ "$rc" -ne 0 ]; then
    say "ERROR pull_snapshot 退出码 $rc"
    exit "$rc"
  fi
else
  say "incremental: pull_changes"
  python3 tools/pull_changes.py 2>&1 | tee -a "$LOG_DIR/daily_sync.log"
  rc=${PIPESTATUS[0]}
  if [ "$rc" -ne 0 ]; then
    say "ERROR pull_changes 退出码 $rc"
    exit "$rc"
  fi
fi

say "rebuild by-date index"
python3 tools/build_index.py 2>&1 | tee -a "$LOG_DIR/daily_sync.log"

say "==== daily_sync done ===="
