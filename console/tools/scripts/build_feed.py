#!/usr/bin/env python3
"""从年度大事记生成 RSS 订阅源与 GitHub Pages 静态首页。

产物：
  feed.xml        — RSS 2.0，取最新 100 条大事记条目
  site/index.html — 极简阅读首页（大事记索引 + 仓库链接），供 Pages 部署
  README.md       — 刷新 `<!-- RECENT:START/END -->` 之间的「最近大事」段（如存在）

数据源：_2026大事记.md 与 _2025大事记.md 的条目行：
  - **YYYY-MM-DD** · [标题](URL) — 摘要。 → [[双链]]
  - **YYYY-MM** · 无链接条目（月内无具体日期）

链接优先用条目自带 URL；无 URL 时落到 GitHub 仓库 blob 页。
用法：python3 tools/scripts/build_feed.py
"""

from __future__ import annotations

import argparse
import hashlib
import html
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CHRONICLES = ["_2026大事记.md", "_2025大事记.md"]
FEED_SIZE = 100

ENTRY = re.compile(
    r"^-\s+\*\*(\d{4}-\d{2}(?:-\d{2})?(?:/\d{1,2})?)\*\*\s+·\s+"
    r"(?:\[(?P<title>[^\]]+)\]\((?P<url>[^)]+)\)|(?P<plain>.*?))"
    r"(?:\s+—\s+(?P<summary>.*?))?\s*(?:→\s*(?P<links>\[\[.*\]\]))?\s*$"
)

BLOB_DIR = {
    "2026": "_2026大事记.md",
    "2025": "_2025大事记.md",
}


def git_repo_url() -> str:
    try:
        url = subprocess.run(
            ["git", "config", "--get", "remote.origin.url"],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        m = re.search(r"github\.com[:/](.+?)(?:\.git)?$", url)
        if m:
            return f"https://github.com/{m.group(1)}"
    except Exception:
        pass
    return "https://github.com/ai-guru-global/ai-guru-console"


def parse_entries() -> list[dict]:
    items: list[dict] = []
    for name in CHRONICLES:
        path = ROOT / name
        if not path.exists():
            continue
        year = name[1:5]
        for line in path.read_text(encoding="utf-8").splitlines():
            if not line.startswith("- **"):
                continue
            m = ENTRY.match(line)
            if not m:
                continue
            title = (m.group("title") or m.group("plain") or "").strip()
            items.append({
                "date": m.group(1),
                "title": title,
                "url": (m.group("url") or "").strip(),
                "summary": (m.group("summary") or "").strip(),
                "links": (m.group("links") or "").strip(),
                "year": year,
            })
    items.sort(key=lambda x: x["date"], reverse=True)
    return items


def item_link(item: dict, repo: str) -> str:
    return item["url"] or f"{repo}/blob/main/{BLOB_DIR[item['year']]}"


def rfc822(date: str) -> str:
    date = date.split("/")[0]  # 复合日期（2026-05-19/20）取首日
    try:
        dt = datetime.strptime(date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except ValueError:
        dt = datetime.strptime(date, "%Y-%m").replace(day=1, tzinfo=timezone.utc)
    return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")


def build_feed(items: list[dict], repo: str, site_url: str) -> str:
    esc = html.escape
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0">',
        "<channel>",
        f"    <title>AI GURU 工作台 · 年度大事记</title>",
        f"    <link>{esc(repo)}</link>",
        "    <description>AI GURU 工作台（ai-guru-console）的证据层：年度重点事件索引，按官方一手源 + 交叉印证收录。</description>",
        "    <language>zh-CN</language>",
        f"    <atom:link href='{esc(site_url)}feed.xml' rel='self' type='application/rss+xml' xmlns:atom='http://www.w3.org/2005/Atom'/>",
        f"    <lastBuildDate>{datetime.now(timezone.utc).strftime('%a, %d %b %Y %H:%M:%S +0000')}</lastBuildDate>",
    ]
    for it in items[:FEED_SIZE]:
        desc = it["summary"] or it["title"]
        if it["links"]:
            desc += f" 相关线索：{it['links'].strip('[]').replace('][', '、').replace('[', '').replace(']', '')}"
        lines += [
            "    <item>",
            f"      <title>{esc(it['date'] + ' · ' + it['title'])}</title>",
            f"      <link>{esc(item_link(it, repo))}</link>",
            f"      <guid isPermaLink='false'>{esc('ainews-' + it['date'] + '-' + hashlib.md5(it['title'].encode('utf-8')).hexdigest()[:10])}</guid>",
            f"      <pubDate>{rfc822(it['date'])}</pubDate>",
            f"      <description>{esc(desc)}</description>",
            "    </item>",
        ]
    lines += ["</channel>", "</rss>", ""]
    return "\n".join(lines)


def build_site(items: list[dict], repo: str, site_url: str) -> str:
    esc = html.escape
    by_month: dict[str, list[dict]] = {}
    for it in items:
        by_month.setdefault(it["date"][:7], []).append(it)

    rows: list[str] = []
    for month in sorted(by_month, reverse=True):
        rows.append(f"    <h2>{esc(month)}</h2>")
        rows.append("    <ul>")
        for it in by_month[month]:
            summary = esc(it["summary"]) if it["summary"] else ""
            suffix = f" <span class='s'>{summary}</span>" if summary else ""
            rows.append(
                f"      <li><span class='d'>{esc(it['date'])}</span> "
                f"<a href='{esc(item_link(it, repo))}'>{esc(it['title'])}</a>{suffix}</li>"
            )
        rows.append("    </ul>")

    return f"""<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI GURU 工作台 · 年度大事记</title>
<style>
  body {{ font-family: -apple-system, "PingFang SC", "Noto Sans CJK SC", sans-serif;
         max-width: 860px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a1a; }}
  h1 {{ font-size: 1.5rem; }} h2 {{ font-size: 1.1rem; margin-top: 2rem; border-bottom: 1px solid #eee; padding-bottom: .3rem; }}
  ul {{ list-style: none; padding-left: 0; }} li {{ margin: .45rem 0; }}
  .d {{ color: #888; font-variant-numeric: tabular-nums; margin-right: .5rem; }}
  .s {{ color: #666; }}
  a {{ color: #0969da; text-decoration: none; }} a:hover {{ text-decoration: underline; }}
  header a {{ margin-right: 1rem; }}
</style>
</head>
<body>
<header>
  <h1>AI GURU 工作台 · 年度大事记</h1>
  <p>AI GURU 工作台（ai-guru-console）的证据层：年度重点事件索引。</p>
  <p>
    <a href="{esc(repo)}">GitHub 仓库</a>
    <a href="{esc(repo)}/blob/main/_2026大事记.md">2026 大事记</a>
    <a href="{esc(repo)}/blob/main/_2025大事记.md">2025 大事记</a>
    <a href="{esc(site_url)}feed.xml">RSS 订阅</a>
  </p>
</header>
<main>
{chr(10).join(rows)}
</main>
<footer><p>条目均为摘要，点击查看原始信源；完整时间线脉络见各主题线索文件。</p></footer>
</body>
</html>
"""


def refresh_readme(items: list[dict], repo: str) -> None:
    readme = ROOT / "README.md"
    if not readme.exists():
        return
    text = readme.read_text(encoding="utf-8")
    start = text.find("<!-- RECENT:START -->")
    end = text.find("<!-- RECENT:END -->")
    if start == -1 or end == -1:
        return
    rows = [
        f"- **{it['date']}** · [{it['title']}]({item_link(it, repo)})"
        + (f" — {it['summary']}" if it["summary"] else "")
        for it in items[:7]
    ]
    block = "<!-- RECENT:START -->\n" + "\n".join(rows) + "\n<!-- RECENT:END -->"
    readme.write_text(text[:start] + block + text[end + len("<!-- RECENT:END -->"):], encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--site-url",
        default="https://ai-guru-global.github.io/ai-guru-console/",
        help="站点基础 URL（feed 自引用与页面内链接）",
    )
    args = parser.parse_args()

    repo = git_repo_url()
    items = parse_entries()
    if not items:
        raise SystemExit("未解析到任何大事记条目，请检查 _2026/_2025大事记.md 格式")

    feed = build_feed(items, repo, args.site_url)
    (ROOT / "feed.xml").write_text(feed, encoding="utf-8")
    site_dir = ROOT / "site"
    site_dir.mkdir(exist_ok=True)
    (site_dir / "index.html").write_text(build_site(items, repo, args.site_url), encoding="utf-8")
    (site_dir / "feed.xml").write_text(feed, encoding="utf-8")  # Pages 部署物需自带 feed
    refresh_readme(items, repo)
    print(f"✓ feed.xml（{min(len(items), FEED_SIZE)} 条）+ site/index.html + README 最近大事已生成")


if __name__ == "__main__":
    main()
