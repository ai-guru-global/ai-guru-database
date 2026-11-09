#!/usr/bin/env python3
"""
从 state/items.jsonl 构建可读的 by-date/ 索引 + 总入口 README.md

布局：
  by-date/YYYY-MM-DD.md   每天一份（按 aihot 口径发现的日期）
  README.md               总入口：统计 / 月度概览 / 怎么用 / 来源榜
"""
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/Users/allengaller/Documents/GitHub/standup-coder/ai-news-database/aihot-mirror")
STATE = ROOT / "state"
BY_DATE = ROOT / "by-date"
BY_DATE.mkdir(parents=True, exist_ok=True)

CATEGORY_LABEL = {
    "ai-models": "AI 模型",
    "ai-products": "AI 产品",
    "industry": "行业",
    "paper": "论文",
    "tip": "技巧",
    None: "未分类",
}


def parse_dt(s):
    if not s:
        return None
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except Exception:
        return None


def effective_dt(it):
    """按 SKILL.md 时间口径：publishedAt 空时取 discoveredAt；差 > 72h 时取 publishedAt；其余取 discoveredAt。"""
    p = parse_dt(it.get("publishedAt"))
    d = parse_dt(it.get("discoveredAt"))
    if not p:
        return d
    if not d:
        return p
    if (d - p).total_seconds() > 72 * 3600:
        return p
    return d


def fmt_dt_cn(dt):
    if not dt:
        return ""
    bjt = dt.astimezone(timezone.utc).astimezone()  # 转本地
    return bjt.strftime("%Y-%m-%d %H:%M")


def main():
    items = []
    with (STATE / "items.jsonl").open(encoding="utf-8") as f:
        for line in f:
            items.append(json.loads(line))

    state = json.loads((STATE / "state.json").read_text(encoding="utf-8"))

    # 按 effective 日期分组
    by_day = defaultdict(list)
    for it in items:
        d = effective_dt(it)
        if not d:
            by_day["unknown"].append(it)
            continue
        by_day[d.strftime("%Y-%m-%d")].append(it)

    # 写 by-date/YYYY-MM-DD.md
    for day in sorted(by_day):
        day_items = by_day[day]
        # 按 effective 时间倒序
        day_items.sort(key=lambda x: effective_dt(x) or datetime.min.replace(tzinfo=timezone.utc), reverse=True)

        # 按 category 分组
        grouped = defaultdict(list)
        for it in day_items:
            grouped[it.get("category")].append(it)

        lines = [f"# AI HOT · {day}", ""]
        lines.append(f"共 {len(day_items)} 条 · 数据来源：[AI HOT](https://aihot.virxact.com)")
        lines.append("")

        cat_order = ["ai-models", "ai-products", "industry", "paper", "tip", None]
        for cat in cat_order:
            bucket = grouped.get(cat) or []
            if not bucket:
                continue
            lines.append(f"## {CATEGORY_LABEL[cat]}（{len(bucket)}）")
            lines.append("")
            for it in bucket:
                title = (it.get("title") or "").strip().replace("\n", " ")
                src = (it.get("source") or {}).get("name", "")
                aihot = (it.get("links") or {}).get("aihot", "")
                original = (it.get("links") or {}).get("original")
                dt = fmt_dt_cn(effective_dt(it))
                line = f"- [{title}]({aihot})" if aihot else f"- {title}"
                meta = f"  - {src} · {dt}"
                if original:
                    meta += f" · [原文]({original})"
                lines.append(line)
                lines.append(meta)
            lines.append("")

        (BY_DATE / f"{day}.md").write_text("\n".join(lines), encoding="utf-8")

    # 总入口 README
    months = sorted(set(k[:7] for k in by_day if k != "unknown"))
    cat_total = Counter(it.get("category") for it in items)
    src_total = Counter((it.get("source") or {}).get("name", "") for it in items)

    # 用户关注的是 2026-01 至今
    target_months = [m for m in months if m >= "2026-01"]
    target_count = sum(1 for it in items if (effective_dt(it) and effective_dt(it).strftime("%Y-%m") >= "2026-01"))

    r = []
    r.append("# AI HOT Mirror")
    r.append("")
    r.append(f"> 镜像自 [AI HOT](https://aihot.virxact.com) 当前全部精选。")
    r.append(f"> 首次 snapshot：{state['fetchedAt']} UTC · asOf：{state['asOf']}")
    r.append(f"> 当前条目数：**{len(items)}**（fields={state['fields']}）")
    r.append("")
    r.append("## 数据布局")
    r.append("")
    r.append("```")
    r.append("aihot-mirror/")
    r.append("├── README.md          # 本文件")
    r.append("├── by-date/           # 按日分组的可读索引（YYYY-MM-DD.md）")
    r.append("├── state/             # items.jsonl + state.json（cursor / 同步水位）")
    r.append("├── raw/               # （预留，原始 JSON 备份按需开启）")
    r.append("├── logs/              # snapshot/changes 抓取原始响应 + run.log")
    r.append("└── tools/             # 同步脚本")
    r.append("```")
    r.append("")
    r.append("## 同步机制")
    r.append("")
    r.append("1. `tools/pull_snapshot.py` — 首次/恢复时全量 snapshot（已跑完）")
    r.append("2. `tools/pull_changes.py` — 每日增量 `changes`（`op=upsert` / `op=remove`）")
    r.append("3. `tools/build_index.py` — 重生成本目录的可读索引（by-date/）")
    r.append("")
    r.append("每日运行建议：先 `pull_changes`，再 `build_index`（均幂等）。")
    r.append("")
    r.append("## 范围")
    r.append("")
    r.append(f"- 2026-01-01 至今：**{target_count}** 条（占 {target_count*100/len(items):.1f}%）")
    r.append(f"- 全部时间范围：{min(parse_dt(it.get('publishedAt') or it.get('discoveredAt')) for it in items if (it.get('publishedAt') or it.get('discoveredAt'))) .date()} → {max(parse_dt(it.get('publishedAt') or it.get('discoveredAt')) for it in items if (it.get('publishedAt') or it.get('discoveredAt'))) .date()}")
    r.append("")
    r.append("## 按月分布（2026 起）")
    r.append("")
    r.append("| 月份 | 条数 |")
    r.append("|---|---:|")
    for m in sorted(target_months):
        c = sum(1 for it in items if (effective_dt(it) and effective_dt(it).strftime("%Y-%m") == m))
        r.append(f"| {m} | {c} |")
    r.append("")
    r.append("## 按分类")
    r.append("")
    r.append("| 分类 | 条数 |")
    r.append("|---|---:|")
    for cat in ["ai-models", "ai-products", "industry", "paper", "tip", None]:
        c = cat_total.get(cat, 0)
        r.append(f"| {CATEGORY_LABEL[cat]} | {c} |")
    r.append("")
    r.append("## Top 20 来源")
    r.append("")
    r.append("| 来源 | 条数 |")
    r.append("|---|---:|")
    for src, c in src_total.most_common(20):
        r.append(f"| {src} | {c} |")
    r.append("")
    r.append("## 每日索引")
    r.append("")
    r.append("| 日期 | 条数 | 链接 |")
    r.append("|---|---:|---|")
    for day in sorted(by_day, reverse=True):
        if day == "unknown":
            continue
        r.append(f"| {day} | {len(by_day[day])} | [打开](by-date/{day}.md) |")
    r.append("")
    r.append("---")
    r.append("")
    r.append("数据来源：[AI HOT](https://aihot.virxact.com) · Skill：[aihot-skill v1.3.0](https://aihot.virxact.com/aihot-skill/)")
    r.append("")

    (ROOT / "README.md").write_text("\n".join(r), encoding="utf-8")
    print(f"wrote {len(by_day)} day files + README.md")
    print(f"total items: {len(items)}")
    print(f"2026-01 至今: {target_count} 条")


if __name__ == "__main__":
    main()
