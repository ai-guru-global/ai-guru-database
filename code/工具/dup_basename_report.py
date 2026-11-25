#!/usr/bin/env python3
"""P1-4：重复 basename 歧义报告。

同名 basename 跨目录存在时，裸名 wikilink 只能靠排序兜底解析（取排序第一），
属于潜在错链。本工具盘点全部重复组，区分导航类（README/INDEX 等惯例同名，
全路径链接引用无碍）与内容类（需改写为全路径或改名）。

用法：
    python3 code/工具/dup_basename_report.py                 # markdown 到 stdout
    python3 code/工具/dup_basename_report.py --json out.json
"""
import argparse
import json
import os
import runpy
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
NAV_BASES = {'readme', 'readme_en', 'index', 'readme_for_dummy'}


def collect_dup_groups(all_mds):
    """basename(lower) → 去扩展名路径列表（排序保证跨平台一致）。纯函数。"""
    groups = defaultdict(list)
    for rel in all_mds:
        groups[os.path.basename(rel[:-3]).lower()].append(rel[:-3])
    for key in groups:
        groups[key].sort()
    return {b: files for b, files in groups.items() if len(files) > 1}


def split_nav(groups):
    """(导航类组, 内容类组)。组键即 basename：组内文件必然同名，按组键
    是否为导航名（README/INDEX 等）划分，不存在混合组。"""
    nav = {b: f for b, f in groups.items() if b in NAV_BASES}
    content = {b: f for b, f in groups.items() if b not in NAV_BASES}
    return nav, content


def render(nav, content):
    lines = ['# 重复 basename 歧义报告', '',
             f'- 内容类组：**{len(content)}**（须消歧：改写全路径或改名）',
             f'- 导航类组：{len(nav)}（README/INDEX 惯例同名，全路径引用无碍）',
             f'- 涉及文件：内容类 {sum(len(f) for f in content.values())} / '
             f'导航类 {sum(len(f) for f in nav.values())}', '']
    if content:
        lines += ['## 内容类组（按规模降序）', '',
                  '| basename | 文件数 | 路径 |', '|---|---:|---|']
        for b, files in sorted(content.items(), key=lambda kv: (-len(kv[1]), kv[0])):
            lines.append(f'| `{b}` | {len(files)} | '
                         + '<br>'.join(f'`{f}`' for f in files) + ' |')
    if nav:
        lines += ['', '## 导航类组（仅盘点，不强制消歧）', '',
                  '| basename | 文件数 |', '|---|---:|']
        for b, files in sorted(nav.items(), key=lambda kv: (-len(kv[1]), kv[0])):
            lines.append(f'| `{b}` | {len(files)} |')
    return '\n'.join(lines) + '\n'


def main():
    parser = argparse.ArgumentParser(description='重复 basename 歧义报告')
    parser.add_argument('--json', metavar='FILE', help='分组结果另存 JSON')
    args = parser.parse_args()

    cw = runpy.run_path(str(ROOT / 'code' / '工具' / 'check_wikilinks.py'),
                        run_name='wiki_checker_module')
    _, all_mds, _ = cw['collect_files']()
    groups = collect_dup_groups(all_mds)
    nav, content = split_nav(groups)

    print(render(nav, content))
    if args.json:
        Path(args.json).write_text(
            json.dumps({'nav': nav, 'content': content},
                       ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8')
        print(f'JSON 已写入 {args.json}')


if __name__ == '__main__':
    main()
