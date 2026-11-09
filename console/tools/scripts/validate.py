#!/usr/bin/env python3
"""AI News Database 内容库格式校验。

校验规则（「结构即价值」的制度化）：
  1. 线索文件 frontmatter 必须含 线索/主题/更新 字段；
  2. 「时间线」章节内 `### YYYY-MM` 月份小节不得重复、必须倒序；
  3. 月内 `**YYYY-MM-DD**` 条目日期必须倒序；
  4. `[[主题/线索]]` 双链必须指向真实存在的文件；
  5. 大事记（_2026/_2025）每个 `## YYYY-MM` 小节内日期必须倒序；
  6. 各主题 `_index.md` 的线索列表链接必须指向真实存在的文件。

用法：python3 tools/scripts/validate.py   （有问题时退出码 1）
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
# 研判/ 是 .gitignore 的私人工作台（观点/行动项），不受公共线索格式契约约束
SKIP_PREFIXES = ("docs", "tools", "aihot-mirror", "local", ".", "研判", "data", "schema")
CHRONICLES = ["_2026大事记.md", "_2025大事记.md"]

MONTH_HEADING = re.compile(r"^### (\d{4}-\d{2})\b", re.M)
DATE_IN_ENTRY = re.compile(r"\*\*(\d{4}-\d{2}-\d{2})\*\*")
WIKILINK = re.compile(r"\[\[([^\]]+)\]\]")
INDEX_LINK = re.compile(r"\]\(([^)]+\.md)\)")
HTML_COMMENT = re.compile(r"<!--.*?-->", re.S)


def strip_comments(text: str) -> str:
    """HTML 注释里的示例链接/占位符不参与校验。"""
    return HTML_COMMENT.sub("", text)


def check_thread(path: Path, issues: list[str]) -> None:
    rel = path.relative_to(ROOT)
    text = path.read_text(encoding="utf-8")

    fm = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not fm:
        issues.append(f"{rel}: 缺 frontmatter")
    else:
        for field in ("线索", "主题", "更新"):
            if not re.search(rf"^{field}: ", fm.group(1), re.M):
                issues.append(f"{rel}: frontmatter 缺 {field} 字段")

    start = text.find("## 时间线")
    end = text.find("## 分析")
    if start == -1:
        return
    timeline = text[start:end if end > start else None]

    months = MONTH_HEADING.findall(timeline)
    seen: set[str] = set()
    for month in months:
        if month in seen:
            issues.append(f"{rel}: 月份小节重复 {month}")
        seen.add(month)
    if months != sorted(months, reverse=True):
        issues.append(f"{rel}: 月份小节非倒序 {months}")

    for month in sorted(seen):
        block = re.search(
            rf"### {month}\n(.*?)(?=### \d{{4}}-\d{{2}}|\Z)", timeline, re.S
        )
        if block:
            dates = DATE_IN_ENTRY.findall(block.group(1))
            if dates != sorted(dates, reverse=True):
                issues.append(f"{rel}: {month} 月内日期乱序 {dates}")

    for link in WIKILINK.findall(strip_comments(text)):
        target = link.strip()
        if "<" in target or "/" not in target:
            continue  # 模板占位符或单名引用
        if not (ROOT / "证据层" / target).with_suffix(".md").exists():
            issues.append(f"{rel}: 断链双链 [[{target}]]")


def check_chronicle(path: Path, issues: list[str]) -> None:
    rel = path.relative_to(ROOT)
    text = path.read_text(encoding="utf-8")
    for section in re.finditer(r"## (\d{4}-\d{2})\n(.*?)(?=## \d{4}-|\Z)", text, re.S):
        dates = DATE_IN_ENTRY.findall(section.group(2))
        if dates != sorted(dates, reverse=True):
            issues.append(f"{rel}: {section.group(1)} 小节日期乱序")


def check_index(path: Path, issues: list[str]) -> None:
    rel = path.relative_to(ROOT)
    text = strip_comments(path.read_text(encoding="utf-8"))
    listing = text.find("## 线索列表")
    if listing == -1:
        return
    candidates = text.find("## 候选线索")
    scope = text[listing:candidates if candidates > listing else None]
    for link in INDEX_LINK.findall(scope):
        if not (path.parent / link).exists():
            issues.append(f"{rel}: 线索列表断链 {link}")


def main() -> int:
    issues: list[str] = []

    themes_root = ROOT / "证据层"
    for path in sorted(themes_root.iterdir()) if themes_root.is_dir() else []:
        if not path.is_dir() or path.name.startswith(SKIP_PREFIXES):
            continue
        for md in sorted(path.glob("*.md")):
            if md.name == "_index.md":
                check_index(md, issues)
            else:
                check_thread(md, issues)

    for name in CHRONICLES:
        chronicle = ROOT / name
        if chronicle.exists():
            check_chronicle(chronicle, issues)

    threads = sum(
        1
        for p in (themes_root.iterdir() if themes_root.is_dir() else [])
        if p.is_dir() and not p.name.startswith(SKIP_PREFIXES)
        for m in p.glob("*.md")
        if m.name != "_index.md"
    )
    if issues:
        print(f"✗ 校验失败，{len(issues)} 个问题：")
        for issue in issues:
            print(f"  - {issue}")
        return 1
    print(f"✓ {threads} 条线索 + {len(CHRONICLES)} 份大事记，格式校验全部通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
