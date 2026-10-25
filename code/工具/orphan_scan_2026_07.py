#!/usr/bin/env python3
"""精确孤立文件扫描 (2026-07)：入链按 全路径 -> 唯一basename -> 目录 三级解析。

与 check_wikilinks.py 同套目录策略。孤立 = 无任何入链且非 readme/index/for_dummy。
用法: python3 工具/orphan_scan_2026_07.py [--all]  (--all 含 19 章条目型 about/sayings)
"""
import os
import re
import sys
import json
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALWAYS_SKIP = {'.git', '.obsidian', '.qoder', '.claude', '.githooks', '.github',
               'node_modules', 'release'}
ROOT_ONLY_SKIP = {'前端应用', '原始', '来源', '归档', 'docs', 'code', '工具'}
WIKILINK = re.compile(r'\[\[([^\]|#]+)')
NAV_BASENAMES = {'readme', 'index', 'readme_for_dummy'}


def collect():
    mds = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel_dir = os.path.relpath(dirpath, ROOT)
        parts = [] if rel_dir == '.' else rel_dir.split(os.sep)
        dirnames[:] = [d for d in dirnames
                       if d not in ALWAYS_SKIP
                       and not (not parts and d in ROOT_ONLY_SKIP)]
        for fn in filenames:
            if fn.endswith('.md'):
                mds.append(os.path.relpath(os.path.join(dirpath, fn), ROOT))
    return mds


def norm(s):
    return s.lower().replace('-', '_')


def main():
    include_all = '--all' in sys.argv
    mds = collect()
    path_index = {}      # 无扩展名相对路径(小写) -> rel
    base_index = defaultdict(list)
    for rel in mds:
        noext = rel[:-3]
        path_index[noext.lower()] = rel
        base_index[norm(os.path.basename(noext))].append(rel)

    inlinks = defaultdict(int)
    for rel in mds:
        try:
            text = open(os.path.join(ROOT, rel), encoding='utf-8').read()
        except OSError:
            continue
        for m in WIKILINK.finditer(text):
            tgt = m.group(1).strip().rstrip('\\').rstrip('/')
            if not tgt or tgt == rel[:-3]:
                continue
            hit = path_index.get(tgt.lower()) or path_index.get(tgt.lower() + '/index')
            if not hit:
                cands = base_index.get(norm(os.path.basename(tgt)), [])
                if len(cands) == 1:
                    hit = cands[0]
                elif len(cands) > 1:
                    # 多候选：路径后缀匹配优先
                    suffix = [c for c in cands if c[:-3].lower().endswith(tgt.lower())]
                    hit = suffix[0] if len(suffix) == 1 else None
            if hit and hit != rel:
                inlinks[hit] += 1

    orphans = []
    for rel in sorted(mds):
        if inlinks.get(rel, 0) > 0:
            continue
        base = os.path.basename(rel)[:-3].lower()
        if base in NAV_BASENAMES:
            continue
        if not include_all and rel.startswith('19_业界观点/') and base in ('about', 'sayings'):
            continue  # 条目型合理孤立，--all 时显示
        orphans.append(rel)

    print(f"文件总数: {len(mds)}  孤立(无入链): {len(orphans)}")
    by_ch = defaultdict(list)
    for o in orphans:
        by_ch[o.split('/')[0]].append(o)
    for ch in sorted(by_ch):
        print(f"\n[{ch}] {len(by_ch[ch])}")
        for o in by_ch[ch]:
            print(f"    {o}")
    json.dump(orphans, open('/tmp/orphans.json', 'w'), ensure_ascii=False, indent=1)
    print("\n清单已写入 /tmp/orphans.json")


if __name__ == '__main__':
    main()
