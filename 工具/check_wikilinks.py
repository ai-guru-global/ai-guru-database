#!/usr/bin/env python3
r"""wikilink 断链分类巡检工具（2026-07 评估校准版）。

解析策略（与 治理/_meta/_evaluation-2026-07-27.md 附录一致）：
1. 处理表格转义竖线 [[path\|别名]]
2. 全路径精确匹配（相对库根，无 .md 后缀）
3. basename 模糊匹配（Obsidian 语义）
4. 目录级链接识别（指向存在目录视为合法）

输出：按五类分类的断链报告（裸名称/旧路径/缺失概念页/相对路径/基础设施路径）。
用法：python3 工具/check_wikilinks.py [--json 输出路径] [--quiet]
退出码：有断链时为 1（可用于 pre-commit / CI）。
"""
import json
import os
import re
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# 任何层级都排除（版本控制/编辑器/构建产物）
ALWAYS_SKIP = {'.git', '.obsidian', '.qoder', '.claude', '.githooks', '.github',
               'node_modules', 'release'}
# 仅根级跳过扫描的基建目录：其中的 md 仍收录为合法链接目标（避免误报），
# 但不作为断链扫描源；注意 docs 只跳根级，子目录如 Cloud_Ops_Agent/docs/ 照常处理
ROOT_ONLY_SKIP = {'前端应用', '原始', '来源', '归档', 'docs', 'code', '工具'}
# 历史评估报告是快照，其中断链示例不计入（与修复脚本 SKIP_FILES 一致）
SKIP_FILES = {'治理/_meta/_evaluation-2026-07-27.md',
              '治理/_meta/_evaluation-2026-06-24.md',
              '治理/_project-evaluation.md',
              '治理/Project_Structure_Evaluation_2026.md'}
WIKILINK = re.compile(r'\[\[([^\]]+?)\]\]')
CHAPTER_PREFIX = re.compile(r'^(\d{2}_|概念/|治理/|90_|94_)')
FENCED_CODE = re.compile(r'```.*?```', re.S)
INLINE_CODE = re.compile(r'`[^`\n]+`')


def collect_files():
    """返回 (待扫描md列表, 全库md列表, 目录相对路径集合)。

    目标索引用全库列表构建（含基建目录内真实文件），断链扫描只跑待扫描列表。
    """
    scan_mds, all_mds, dirs = [], [], set()
    for dp, dns, fns in os.walk(ROOT):
        dns[:] = [d for d in dns if d not in ALWAYS_SKIP]
        rel_dp = os.path.relpath(dp, ROOT)
        if rel_dp != '.':
            dirs.add(rel_dp)
        top = rel_dp.split(os.sep)[0]
        scannable = rel_dp == '.' or top not in ROOT_ONLY_SKIP
        for f in fns:
            if f.endswith('.md'):
                rel = os.path.normpath(os.path.join(rel_dp, f)) if rel_dp != '.' else f
                all_mds.append(rel)
                if scannable:
                    scan_mds.append(rel)
    return scan_mds, all_mds, dirs


def build_indexes(mds):
    rel_index = set()
    name_index = defaultdict(list)
    for rel in mds:
        no_ext = rel[:-3]
        rel_index.add(no_ext)
        # Obsidian 的 basename 解析对大小写不敏感
        name_index[os.path.basename(no_ext).lower()].append(no_ext)
    return rel_index, name_index


def normalize_target(raw):
    """去除别名/锚点/表格转义，返回干净目标。"""
    t = raw.replace('\\|', '|').split('|')[0].split('#')[0].strip()
    t = t.rstrip('\\').strip()
    if t.endswith('.md'):
        t = t[:-3]
    return t


def classify(target):
    if target.startswith('概念/'):
        return 'missing_concept'
    if '../' in target or target.startswith('./'):
        return 'relative_path'
    if target.split('/')[0] in {'前端应用', '工具', 'code', 'docs', '原始', '来源', '归档', 'release'}:
        return 'infra_path'
    if '/' in target and CHAPTER_PREFIX.match(target):
        return 'stale_path'
    return 'bare_name'


def main():
    out_json = None
    quiet = '--quiet' in sys.argv
    if '--json' in sys.argv:
        out_json = sys.argv[sys.argv.index('--json') + 1]

    scan_mds, all_mds, dirs = collect_files()
    rel_index, name_index = build_indexes(all_mds)

    broken = []  # (source, target, category)
    total_links = 0
    for rel in scan_mds:
        if rel in SKIP_FILES:
            continue
        text = open(os.path.join(ROOT, rel), encoding='utf-8', errors='ignore').read()
        # 剔除代码块/行内代码，避免 bash [[ ]] 等语法误报
        text = INLINE_CODE.sub('', FENCED_CODE.sub('', text))
        for m in WIKILINK.findall(text):
            t = normalize_target(m)
            if not t or t.startswith('http'):
                continue
            total_links += 1
            if t in rel_index:
                continue
            if os.path.basename(t).lower() in name_index:
                continue
            if t.rstrip('/') in dirs:  # 目录级链接
                continue
            # 磁盘上真实存在的非 md 文件（代码/脚本/数据）视为合法
            if os.path.exists(os.path.join(ROOT, t)) or any(
                    os.path.exists(os.path.join(ROOT, t + ext))
                    for ext in ('.py', '.sh', '.txt', '.json', '.csv', '.yaml', '.yml')):
                continue
            broken.append((rel, t, classify(t)))

    by_cat = defaultdict(list)
    for src, tgt, cat in broken:
        by_cat[cat].append((src, tgt))

    if not quiet:
        print(f'总 wikilink: {total_links}  断链: {len(broken)} 次 / '
              f'{len({t for _, t, _ in broken})} 唯一目标')
        for cat in ('bare_name', 'stale_path', 'missing_concept', 'relative_path', 'infra_path'):
            items = by_cat.get(cat, [])
            if not items:
                continue
            print(f'\n== {cat} ({len(items)} 次) ==')
            counts = defaultdict(int)
            for _, tgt in items:
                counts[tgt] += 1
            for tgt, c in sorted(counts.items(), key=lambda x: -x[1])[:15]:
                srcs = sorted({s for s, t2 in items if t2 == tgt})[:2]
                print(f'  {c:>3}x  {tgt}   <- {"; ".join(srcs)}')

    if out_json:
        with open(out_json, 'w', encoding='utf-8') as f:
            json.dump({'total_links': total_links,
                       'broken': [{'source': s, 'target': t, 'category': c}
                                  for s, t, c in broken]},
                      f, ensure_ascii=False, indent=1)
        if not quiet:
            print(f'\nJSON 已写入 {out_json}')

    sys.exit(1 if broken else 0)


if __name__ == '__main__':
    main()
