#!/usr/bin/env python3
"""把贡献队列变成 GitHub Issue（默认 dry-run，不实际创建）。

依赖：gh CLI 已登录（`gh auth status`）。
默认只打印将要创建的 issue；加 `--yes` 才真正调用 `gh issue create`。
标签需先存在，见 docs/labels.md。

用法：
  python3 tools/scripts/publish_issues.py --kind verify --limit 10
  python3 tools/scripts/publish_issues.py --kind thin --limit 10 --yes
  python3 tools/scripts/publish_issues.py --kind topic --limit 5

类型：
  verify  L1 核验队列（⚠️/❓/🔍）
  thin    L2 薄弱节点（关键词聚合 <5 条线索）
  topic   L3 低密度主题（≤2 条线索）
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

import build_pages as bp

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
REPO = "ai-guru-global/ai-guru-console"
TEMPLATE_URL = f"https://github.com/{REPO}/issues/new/choose"


def load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def verify_issues(limit: int) -> list[dict]:
    items = [v for v in load("verify.json")["items"] if v.get("status") in ("⚠️", "❓", "🔍", "")]
    items.sort(key=lambda v: v.get("date", ""), reverse=True)
    out = []
    for v in items[:limit]:
        status = v.get("status") or "未标"
        out.append({
            "title": f"[L1] 核实：{v['title'][:90]}",
            "labels": "good first issue,核验",
            "body": f"""## 待核实条目

- 状态：{status}
- 日期：{v.get('date') or '未标'}
- 章节：{v.get('sec', '')}

## 任务

给出结论与一手来源。结论只接受：

- ✅ 已核验（一手来源 + 独立交叉印证）
- ✗ 已证伪
- ⚠️ 部分可取（有来源但口径不全）
- 🔍 仍缺来源

## 验收标准

- [ ] 贴出一手来源 URL（官方公告 / 监管 filing / 论文正文）
- [ ] 至少一家独立媒体交叉印证
- [ ] 写清金额、份额、日期等口径
- [ ] 更新 `docs/2026待核实清单.md` 的对应条目

模板：{TEMPLATE_URL}（选「核实一条待核实」）
""",
        })
    return out


def thin_issues(limit: int) -> list[dict]:
    chain = load("chain.json")
    clues = load("clues.json")["items"]
    rows = []
    for layer in chain["layers"]:
        for node in layer["nodes"]:
            matched, _ = bp.match_evidence(node, clues, [])
            if len(matched) < 5:
                rows.append((len(matched), layer["key"], node))
    rows.sort(key=lambda x: x[0])
    out = []
    for count, layer, node in rows[:limit]:
        out.append({
            "title": f"[L2] 认领节点：{node['name']}（当前 {count} 条线索）",
            "labels": "good first issue,来源",
            "body": f"""## 节点

- uid：`{node['uid']}`
- 层：{layer}
- 定义：{node.get('def', '')}
- 当前关键词聚合：**{count}** 条线索（目标 ≥5）

## 任务

补 3–5 条可追溯线索，让这个节点不再薄弱。

## 验收标准

- [ ] 每条线索有日期、标题、URL
- [ ] 优先官方一手源；二手源需 ≥2 家独立媒体
- [ ] 更新对应主题的时间线文件
- [ ] 本地运行 `make dataset && make pages-check` 通过

模板：{TEMPLATE_URL}（选「补一个来源」或「新建线索」）
""",
        })
    return out


def topic_issues(limit: int) -> list[dict]:
    topics = load("topics.json")["items"]
    rows = sorted([t for t in topics if t["count"] <= 2], key=lambda t: t["count"])
    out = []
    for t in rows[:limit]:
        out.append({
            "title": f"[L3] 补充主题：{t['key']}（当前 {t['count']} 条线索）",
            "labels": "good first issue,线索投稿",
            "body": f"""## 主题

- 主题：{t['key']} / {t['en']}
- 范围：{t['def']}
- 当前线索：{t['count']} 条

## 任务

补 2–3 条线索，让这个主题域达到最低覆盖密度。

## 验收标准

- [ ] 每条线索有独立的时间线文件
- [ ] frontmatter 含 线索/主题/更新
- [ ] 至少 3 条带 URL 的证据
- [ ] `python3 tools/scripts/validate.py` 通过

模板：{TEMPLATE_URL}（选「新建线索」）
""",
        })
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--kind", choices=["verify", "thin", "topic"], default="verify")
    ap.add_argument("--limit", type=int, default=10)
    ap.add_argument("--repo", default=REPO)
    ap.add_argument("--yes", action="store_true", help="真正创建 issue（默认只打印）")
    args = ap.parse_args()

    if args.kind == "verify":
        issues = verify_issues(args.limit)
    elif args.kind == "thin":
        issues = thin_issues(args.limit)
    else:
        issues = topic_issues(args.limit)

    if not issues:
        print("没有可发布的条目。")
        return 0

    print(f"准备 {len(issues)} 个 issue（{'实际创建' if args.yes else 'dry-run'}）：\n")
    for i, issue in enumerate(issues, 1):
        print(f"{i}. {issue['title']}")
        if not args.yes:
            print(f"   labels: {issue['labels']}")
            print(f"   body: {issue['body'].splitlines()[0]} ...")
            continue
        cmd = [
            "gh", "issue", "create",
            "--repo", args.repo,
            "--title", issue["title"],
            "--body", issue["body"],
            "--label", issue["labels"],
        ]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0:
            print(f"   ✗ 创建失败：{proc.stderr.strip()}")
        else:
            print(f"   ✓ {proc.stdout.strip()}")

    if not args.yes:
        print("\n这是 dry-run。确认无误后加 --yes 实际创建。")
    return 0


if __name__ == "__main__":
    sys.exit(main())