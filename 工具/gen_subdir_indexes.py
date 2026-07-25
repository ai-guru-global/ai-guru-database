#!/usr/bin/env python3
"""为 reorganize_scattered_2026 迁移后的子目录补齐/更新 index.md（auto-index 格式）。

- 新建目录：生成 index.md（frontmatter + 文件导航表 + Related）
- 既有目录：将迁入文件补入「## 文件导航」表（若缺失）
"""
import datetime
import importlib.util
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TODAY = datetime.date.today().isoformat()

spec = importlib.util.spec_from_file_location(
    "reo", REPO_ROOT / "工具" / "reorganize_scattered_2026.py")
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
    dir_rel = dir_path.relative_to(REPO_ROOT).as_posix()
    chapter = dir_rel.split("/")[0]
    name = dir_path.name
    display = re.sub(r"^\d+_", "", name).replace("_", " ")
    files = sorted(p for p in dir_path.glob("*.md") if p.name != "index.md")
    rows = "\n".join(nav_row(dir_rel, f) for f in files)
    content = f"""---
title: {display}
type: index
created: {TODAY}
updated: {TODAY}
sources: []
tags: [auto-index]
---

# {display}

## 文件导航

| 文件 | 说明 |
|------|------|
{rows}

## Related

- [[{chapter}/README|{chapter} 章节导航]]
"""
    (dir_path / "index.md").write_text(content, encoding="utf-8")
    return len(files)


def append_to_index(dir_path, new_files):
    """将迁入文件补入既有 index.md 的文件导航表。"""
    idx = dir_path / "index.md"
    if not idx.is_file():
        return 0
    text = idx.read_text(encoding="utf-8")
    dir_rel = dir_path.relative_to(REPO_ROOT).as_posix()
    missing = [f for f in new_files if f.stem not in text]
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
        p = REPO_ROOT / new
        if p.parent.name not in ("assets", "tests", "治理", "pathways"):
            dirs.setdefault(p.parent, []).append(p)
    created, updated = 0, 0
    for d, files in sorted(dirs.items()):
        if d == REPO_ROOT or not d.is_dir():
            continue
        if not (d / "index.md").is_file():
            n = create_index(d)
            created += 1
            print(f"  + index.md: {d.relative_to(REPO_ROOT)} ({n} files)")
        else:
            n = append_to_index(d, files)
            if n:
                updated += 1
                print(f"  ~ index.md: {d.relative_to(REPO_ROOT)} (+{n} rows)")
    print(f"新建 {created} 个 index.md，更新 {updated} 个")


if __name__ == "__main__":
    main()
