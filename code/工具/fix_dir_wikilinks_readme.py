#!/usr/bin/env python3
"""A2 批次一：目录级 wikilink 批量补 `/README` 后缀。

现象（2026-11-25 实测 595 条 / 185 文件）：`[[15_智能体/]]`、`[[05_大模型/01_LLM基础|…]]`
这类指向目录的 wikilink 不解析为文件（check_links 分类 missing_file），
而目标目录均存在且带 README.md——补 `/README` 后缀即解析为真实页面。

改写规则：
- 仅处理「目标目录存在且有 README.md」的裸目录 wikilink；
  `[[dir]]`/`[[dir/]]`/`[[dir|显示]]`/`[[dir/|显示]]`/`[[dir#锚]]` 统一改写为
  `[[dir/README]]`（保留显示文本与锚点）。
- 目标不存在/已是文件/目录无 README：一律不动。
- 围栏代码块、行内代码、frontmatter 内不改。

用法：
    python3 code/工具/fix_dir_wikilinks_readme.py                # dry-run 统计
    python3 code/工具/fix_dir_wikilinks_readme.py --write        # 真正写盘
"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT = ROOT / 'wiki'

WIKILINK = re.compile(r'\[\[([^\]|#]+?)(/)?((?:#[^\]|]*)?(?:\|[^\]]*)?)\]\]')
FENCE = re.compile(r'^\s*(`{3,}|~{3,})')
FRONTMATTER_END = re.compile(r'\A---\s*\n.*?\n---', re.S)
INLINE_CODE = re.compile(r'`[^`]*`')


def rewrite_text(text: str, source_path: Path) -> tuple[str, int, list]:
    """返回 (新文本, 改写条数, 样例[(旧目标, 新目标)])。"""
    fm_end = FRONTMATTER_END.match(text)
    body_start = fm_end.end() if fm_end else 0
    head, body = text[:body_start], text[body_start:]

    lines = body.split('\n')
    out, n, samples = [], 0, []
    in_code = False
    fence_len = 0
    for line in lines:
        m = FENCE.match(line)
        if m:
            if not in_code:
                in_code, fence_len = True, len(m.group(1))
            elif len(m.group(1)) == fence_len:
                in_code = False
            out.append(line)
            continue
        if in_code:
            out.append(line)
            continue

        def sub(mm: re.Match) -> str:
            nonlocal n
            target, slash, tail = mm.group(1), mm.group(2) or '', mm.group(3) or ''
            t = target.strip()
            d = CONTENT / t
            if d.is_dir() and (d / 'README.md').exists():
                n += 1
                if len(samples) < 5:
                    samples.append((mm.group(0), f'[[{t}/README{tail}]]'))
                return f'[[{t}/README{tail}]]'
            return mm.group(0)

        # 行内代码先占位，避免误改
        codes = {}
        def stash(m2: re.Match) -> str:
            key = f'\x00{len(codes)}\x00'
            codes[key] = m2.group(0)
            return key
        line2 = INLINE_CODE.sub(stash, line)
        line2 = WIKILINK.sub(sub, line2)
        for key, val in codes.items():
            line2 = line2.replace(key, val)
        out.append(line2)

    return head + '\n'.join(out), n, samples


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--write', action='store_true', help='真正写盘（默认 dry-run）')
    args = ap.parse_args()

    total_links, total_files = 0, 0
    for p in sorted(CONTENT.rglob('*.md')):
        if any(part.startswith('.') for part in p.relative_to(CONTENT).parts):
            continue
        text = p.read_text(encoding='utf-8')
        new_text, n, samples = rewrite_text(text, p)
        if n:
            total_links += n
            total_files += 1
            tag = 'WRITE' if args.write else 'DRY'
            print(f'{tag}   {p.relative_to(CONTENT)}: {n} 条')
            for old, new in samples[:2]:
                print(f'      {old}  →  {new}')
            if args.write:
                p.write_text(new_text, encoding='utf-8')

    print(f'\n合计：{total_links} 条链接 / {total_files} 个文件（{"已写盘" if args.write else "dry-run 未写盘"}）')
    if not args.write:
        print('确认无误后追加 --write 执行。')


if __name__ == '__main__':
    sys.exit(main())
