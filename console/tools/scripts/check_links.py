#!/usr/bin/env python3
"""检查静态站内部链接（href/src）是否可达。

用法：python3 tools/scripts/check_links.py [--root site]

跳过 http(s)、mailto、# 锚点、data:、javascript:；其余按相对路径解析。
退出码 1 表示存在断链。
"""

from __future__ import annotations

import argparse
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote

SKIP_PREFIXES = ("http://", "https://", "mailto:", "#", "data:", "javascript:")


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ("href", "src") and value:
                self.links.append(value)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="site")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    if not root.is_dir():
        print(f"✗ 目录不存在：{root}（先运行 make pages）")
        return 1

    total = 0
    broken: list[tuple[str, str]] = []
    for f in root.rglob("*.html"):
        parser = LinkParser()
        parser.feed(f.read_text(encoding="utf-8"))
        for link in parser.links:
            if link.startswith(SKIP_PREFIXES):
                continue
            path = link.split("#", 1)[0].split("?", 1)[0]
            if not path:
                continue
            total += 1
            target = (f.parent / unquote(path)).resolve()
            if not target.exists():
                broken.append((f.relative_to(root).as_posix(), link))

    if broken:
        print(f"✗ 检查 {total} 条内部链接，{len(broken)} 条断链：")
        for page, link in broken[:50]:
            print(f"  - {page} → {link}")
        return 1
    print(f"✓ 检查 {total} 条内部链接，0 断链")
    return 0


if __name__ == "__main__":
    sys.exit(main())