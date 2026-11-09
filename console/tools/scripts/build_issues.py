#!/usr/bin/env python3
"""从 data/ 生成「Good First Issues」队列，降低社区贡献的启动成本。

产出 docs/good-first-issues.md：
  - L1 核验队列：六态里 ⚠️ / ❓ / 🔍 的条目（按日期倒序，取前 40 条）
  - 薄弱节点：关键词聚合 < 5 条线索的节点
  - 主题密度不足：≤ 2 条线索的主题域

用法：python3 tools/scripts/build_issues.py [--out docs/good-first-issues.md]
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import build_pages as bp

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"


def load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "docs" / "good-first-issues.md"))
    args = ap.parse_args()

    chain = load("chain.json")
    topics = load("topics.json")
    clues = load("clues.json")["items"]
    verify = load("verify.json")["items"]

    # 薄弱节点
    thin = []
    for layer in chain["layers"]:
        for node in layer["nodes"]:
            matched, _ = bp.match_evidence(node, clues, [])
            if len(matched) < 5:
                thin.append((len(matched), layer["key"], node["name"], node["uid"], node.get("def", "")))
    thin.sort()

    # 主题密度
    low_topics = [(t["count"], t["key"], t["def"]) for t in topics["items"] if t["count"] <= 2]
    low_topics.sort()

    # 核验队列
    queue = [v for v in verify if v.get("status") in ("⚠️", "❓", "🔍", "")]
    queue.sort(key=lambda v: v.get("date", ""), reverse=True)
    counts = {}
    for v in verify:
        counts[v.get("status", "")] = counts.get(v.get("status", ""), 0) + 1

    lines = [
        "# Good First Issues（自动生成）",
        "",
        "> 由 `tools/scripts/build_issues.py` 生成，勿手改。",
        f"> 数据版本见 [`data/index.json`](../data/index.json)。",
        "",
        "最低摩擦的贡献不是写长文，而是**修一个数字、补一个来源**。",
        "认领方式：选一条，在 [Issues](https://github.com/ai-guru-global/ai-guru-console/issues/new/choose) 用对应模板提交。",
        "",
        "## L1 · 核验队列",
        "",
        f"六态分布：" + " / ".join(f"{k or '未标'} {v}" for k, v in sorted(counts.items(), key=lambda x: -x[1])),
        "",
        "| 状态 | 条目 | 日期 | 建议动作 |",
        "|---|---|---|---|",
    ]
    for v in queue[:40]:
        title = v["title"].replace("|", "\\|")
        action = {
            "⚠️": "补一手来源或交叉印证，给出 ✅ / ✗ 结论",
            "❓": "找一手来源；找不到就保留存疑",
            "🔍": "补检索缺口（指定关键词或来源类型）",
            "": "先判定属于哪一种状态",
        }.get(v.get("status", ""), "复核")
        lines.append(f"| {v.get('status') or '—'} | {title} | {v.get('date', '')} | {action} |")
    if len(queue) > 40:
        lines.append(f"| … | 其余 {len(queue) - 40} 条见 [`data/verify.json`](../data/verify.json) | | |")

    lines += [
        "",
        "## L2 · 薄弱节点（关键词聚合 < 5 条线索）",
        "",
        "> 聚合为 0 不是错误，是采集缺口的公开信号。认领一个节点，补 3–5 条线索即可显著改善。",
        "",
        "| 线索数 | 层 | 节点 | uid | 定义 |",
        "|---|---|---|---|---|",
    ]
    for n, layer, name, uid, definition in thin[:30]:
        lines.append(f"| {n} | {layer} | {name} | `{uid}` | {definition.replace('|', '\\|')[:60]} |")

    lines += [
        "",
        "## L3 · 主题密度不足（≤ 2 条线索）",
        "",
        "| 线索数 | 主题 | 范围 |",
        "|---|---|---|",
    ]
    for n, key, definition in low_topics:
        lines.append(f"| {n} | {key} | {definition.replace('|', '\\|')[:70]} |")

    lines += [
        "",
        "## 贡献阶梯",
        "",
        "| 级别 | 动作 | 模板 |",
        "|---|---|---|",
        "| L0 | 改错字 / 修断链 | `数据修正.yml` |",
        "| L1 | 核实一条待核实 | `核实一条.yml` |",
        "| L2 | 给结论补来源 / 认领薄弱节点 | `补一个来源.yml` |",
        "| L3 | 新建线索 | `新建线索.yml` |",
        "| L4 | 提议节点 | `提议节点.yml` |",
        "",
    ]

    out = Path(args.out)
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"✓ {out.relative_to(ROOT)} 已生成：核验队列 {len(queue)} 条（列前 40）/ 薄弱节点 {len(thin)} 个 / 低密度主题 {len(low_topics)} 个")


if __name__ == "__main__":
    main()