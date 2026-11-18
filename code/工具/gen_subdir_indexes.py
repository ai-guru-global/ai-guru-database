#!/usr/bin/env python3
"""为 reorganize_scattered_2026 迁移后的子目录补齐/更新 index.md（auto-index 格式）。

- 新建目录：生成 index.md（frontmatter + 文件导航表 + Related）
- 既有目录：将迁入文件补入「## 文件导航」表（若缺失）
"""
import datetime
import importlib.util
import re
from pathlib import Path

# 仓库根 = code/工具/ 上溯三级；内容根 = wiki/
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT_ROOT = REPO_ROOT / "wiki"
TODAY = datetime.date.today().isoformat()

spec = importlib.util.spec_from_file_location(
    "reo", REPO_ROOT / "code" / "工具" / "reorganize_scattered_2026.py")
reo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reo)


def read_frontmatter(path):
    """提取 title 与 summary（截断、清洗）。"""
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        return path.stem, ""
    title, summary = path.stem.replace("_", " "), ""
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    if m:
        fm = m.group(1)
        tm = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', fm, re.M)
        if tm:
            title = tm.group(1)
        sm = re.search(r'^summary:\s*["\']?(.+?)["\']?\s*$', fm, re.M)
        if sm:
            summary = sm.group(1)
    summary = re.sub(r"^>\s*\*\*一句话理解\*\*[:：]\s*", "", summary).strip()
    summary = summary.replace("|", "/")
    if len(summary) > 80:
        summary = summary[:77] + "..."
    return title, summary


def nav_row(dir_rel, md):
    title, summary = read_frontmatter(md)
    link = f"{dir_rel}/{md.stem}"
    return f"| [[{link}|{title}]] | {summary} |"


def create_index(dir_path):
    # 导航链接按 wiki 内容根相对（旧版按仓库根会带 wiki/ 前缀，只能靠 basename 兜底解析）
    dir_rel = dir_path.relative_to(CONTENT_ROOT).as_posix()
    # 章节名按 wiki 内容根切分（旧版按仓库根切会得到 "wiki"，连带 Related 链接语义错误）
    chapter = dir_rel.split("/")[0]
    name = dir_path.name
    display = re.sub(r"^\d+_", "", name).replace("_", " ")
    files = sorted(p for p in dir_path.glob("*.md") if p.name != "index.md")
    rows = "\n".join(nav_row(dir_rel, f) for f in files)
    content = f"""---
title: {display}
type: index
category: {chapter}
summary: "自动索引：{display} 目录 {len(files)} 篇文档的文件导航表（按文件名排序）。"
created: {TODAY}
updated: {TODAY}
tier: supporting
sources: []
tags: [auto-index]
name_zh: "{display}索引"
---

# {display}

## 文件导航

| 文件 | 说明 |
|------|------|
{rows}

## Related

- [[{chapter}/README|{chapter} 章节导航]]
"""
    # 与 link_gate 的间距口径零漂移：生成后过一遍 fix_spacing（表格空单元格等差分）
    try:
        spec = importlib.util.spec_from_file_location(
            "fix_spacing", REPO_ROOT / "code" / "工具" / "fix_spacing.py")
        spacer = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(spacer)
        content = spacer.fix_spacing(content)  # module 属性访问，不可下标
    except Exception as exc:
        print(f"  ! fix_spacing 后处理失败（生成内容未清洗）: {exc!r}")
    (dir_path / "index.md").write_text(content, encoding="utf-8")
    return len(files)


def append_to_index(dir_path, new_files):
    """将迁入文件补入既有 index.md 的文件导航表。"""
    idx = dir_path / "index.md"
    if not idx.is_file():
        return 0
    text = idx.read_text(encoding="utf-8")
    # 内容根相对链接；仅补真实存在的文件（旧迁移清单可能含已改名/删除的残留条目）
    dir_rel = dir_path.relative_to(CONTENT_ROOT).as_posix()
    missing = [f for f in new_files if f.is_file() and f.stem not in text]
    if not missing:
        return 0
    m = re.search(r"## 文件导航.*?(?:\n\|[^\n]*)+", text, re.S)
    if not m:
        return 0
    rows = []
    for f in missing:
        title, summary = read_frontmatter(f)
        # 与既有表列数对齐（存在三列「适用人群」表）
        cols = m.group(0).strip().splitlines()[-1].count("|") - 1
        extra = " - |" * max(0, cols - 2)
        rows.append(f"| [[{dir_rel}/{f.stem}|{title}]] | {summary} |{extra}")
    text = text[:m.end()] + "\n" + "\n".join(rows) + text[m.end():]
    text = re.sub(r"^updated: .*$", f"updated: {TODAY}", text, count=1, flags=re.M)
    idx.write_text(text, encoding="utf-8")
    return len(missing)


def main():
    moves = reo.build_moves()
    dirs = {}
    for new in moves.values():
        p = CONTENT_ROOT / new
        if p.parent.name not in ("assets", "tests", "治理", "pathways"):
            dirs.setdefault(p.parent, []).append(p)
    created, updated = 0, 0
    for d, files in sorted(dirs.items()):
        if d == CONTENT_ROOT or not d.is_dir():
            continue
        if not (d / "index.md").is_file():
            n = create_index(d)
            created += 1
            print(f"  + index.md: {d.relative_to(CONTENT_ROOT)} ({n} files)")
        else:
            n = append_to_index(d, files)
            if n:
                updated += 1
                print(f"  ~ index.md: {d.relative_to(CONTENT_ROOT)} (+{n} rows)")
    print(f"新建 {created} 个 index.md，更新 {updated} 个")


if __name__ == "__main__":
    main()
