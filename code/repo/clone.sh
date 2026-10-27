#!/usr/bin/env bash
# 按 repos.txt 批量克隆常用开源代码库到本目录。
# 源码本体被 .gitignore 排除，不入库；本脚本与清单本身入库。
#
# 用法：
#   bash code/repo/clone.sh            # 缺什么补什么
#   bash code/repo/clone.sh --update    # 已存在的仓库执行 git pull --ff-only
#   bash code/repo/clone.sh --dry-run   # 只打印计划，不联网

set -u

HERE="$(cd "$(dirname "$0")" && pwd)"
LIST="$HERE/repos.txt"

MODE="clone"
for arg in "$@"; do
  case "$arg" in
    --update)  MODE="update" ;;
    --dry-run) MODE="dry-run" ;;
    -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "未知参数：$arg" >&2; exit 2 ;;
  esac
done

[ -f "$LIST" ] || { echo "缺少清单：$LIST" >&2; exit 1; }
command -v git >/dev/null || { echo "未安装 git" >&2; exit 1; }

ok=0; skip=0; fail=0
failed_names=""

# 读取清单：忽略空行与 # 注释；行内 # 之后为说明
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|'#'*) continue ;; esac
  line="${line%%#*}"
  name="$(echo "$line" | awk '{print $1}')"
  url="$(echo "$line" | awk '{print $2}')"
  [ -n "$name" ] && [ -n "$url" ] || continue

  target="$HERE/$name"

  if [ -d "$target/.git" ]; then
    if [ "$MODE" = "update" ]; then
      printf '[update] %-16s ' "$name"
      if git -C "$target" pull --ff-only --depth 1 >/dev/null 2>&1; then
        echo "ok"; ok=$((ok + 1))
      else
        echo "FAILED"; fail=$((fail + 1)); failed_names="$failed_names $name"
      fi
    else
      echo "[skip]   $name（已存在）"; skip=$((skip + 1))
    fi
    continue
  fi

  if [ -d "$target" ]; then
    echo "[skip]   $name（目录存在但非 git 仓库，请手动处理）"; skip=$((skip + 1))
    continue
  fi

  if [ "$MODE" = "dry-run" ]; then
    echo "[plan]   $name <- $url"; continue
  fi

  printf '[clone]  %-16s ' "$name"
  if git clone --depth 1 --single-branch "$url" "$target" >/dev/null 2>&1; then
    echo "ok"; ok=$((ok + 1))
  else
    echo "FAILED"; fail=$((fail + 1)); failed_names="$failed_names $name"
    rm -rf "$target"
  fi
done < "$LIST"

echo
# 变量紧邻全角标点时必须用 ${}，否则 bash 3.2 会把多字节字符吞进变量名
echo "完成：成功 ${ok} / 跳过 ${skip} / 失败 ${fail}"
[ -n "$failed_names" ] && echo "失败项：$failed_names"

total="$(du -sh "$HERE" 2>/dev/null | cut -f1)"
echo "当前占用：${total}（含 .git）"
exit $((fail > 0 ? 1 : 0))
