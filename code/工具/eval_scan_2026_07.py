#!/usr/bin/env python3
"""全库评估扫描脚本 (2026-07-27)：章节统计 / 覆盖度 / wikilink / 孤立文件"""
import os, re, json, sys
from collections import defaultdict

ROOT = "/Users/ai-guru/Documents/GitHub/ai-guru-global/ai-guru-database"
# 核心知识章节 + 知识图谱层
CHAPTERS = [d for d in sorted(os.listdir(ROOT))
            if re.match(r'^\d{2}_', d) and os.path.isdir(os.path.join(ROOT, d))]
KG_DIRS = ['概念', '治理']
SKIP_DIRS = {'.git', '.obsidian', '.qoder', '.claude', '.github', '.githooks',
             'node_modules', '前端应用', '原始', '来源', '归档', 'release', 'docs', 'code', '工具'}

WIKILINK = re.compile(r'\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]')

stats = {}
all_files = {}   # relpath -> {lines, size, links_out}
name_index = defaultdict(list)  # basename(no ext) -> [relpath]

def scan_dir(top):
    files = lines = size = 0
    subdirs, mds = [], []
    base = os.path.join(ROOT, top)
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith('.')]
        rel_dir = os.path.relpath(dirpath, base)
        if rel_dir != '.' and os.path.dirname(rel_dir) == '':
            subdirs.append(rel_dir)
        for f in filenames:
            if not f.endswith('.md'):
                continue
            p = os.path.join(dirpath, f)
            rel = os.path.relpath(p, ROOT)
            try:
                text = open(p, encoding='utf-8', errors='ignore').read()
            except Exception:
                continue
            n = text.count('\n') + 1
            sz = os.path.getsize(p)
            links = WIKILINK.findall(text)
            files += 1
            lines += n
            size += sz
            mds.append(rel)
            all_files[rel] = dict(lines=n, size=sz, out=len(links), targets=links)
            name_index[os.path.splitext(f)[0]].append(rel)
    return dict(files=files, lines=lines, size=size, subdirs=subdirs, mds=mds)

for ch in CHAPTERS + KG_DIRS:
    stats[ch] = scan_dir(ch)

# 覆盖度检查
coverage = {}
for ch in CHAPTERS:
    base = os.path.join(ROOT, ch)
    files_root = os.listdir(base)
    coverage[ch] = {
        'README': 'README.md' in files_root,
        'for_dummy': any('for_dummy' in f for f in files_root),
        'index': 'index.md' in files_root,
        'nutshell_count': sum(1 for m in stats[ch]['mds'] if 'nutshell' in m.lower()),
        'dummy_count': sum(1 for m in stats[ch]['mds'] if 'for_dummy' in m),
        'subdir_count': len(stats[ch]['subdirs']),
    }

# 入链统计（解析 wikilink 目标 -> 文件，Obsidian 模糊匹配：按 basename）
inlinks = defaultdict(int)
broken = defaultdict(int)
for rel, info in all_files.items():
    for t in info['targets']:
        t = t.strip()
        tn = os.path.splitext(os.path.basename(t))[0]
        if tn in name_index:
            for cand in name_index[tn]:
                inlinks[cand] += 1
                break
        else:
            broken[t] += 1

orphans = [rel for rel in all_files
           if inlinks.get(rel, 0) == 0
           and not os.path.basename(rel).lower() in ('readme.md', 'index.md', 'readme_for_dummy.md')]

# 小文件 (stub) 检测
stubs = [rel for rel, i in all_files.items() if i['size'] < 500]
small = [rel for rel, i in all_files.items() if 500 <= i['size'] < 1500]

out = {
    'total_files': len(all_files),
    'total_lines': sum(i['lines'] for i in all_files.values()),
    'total_size_mb': round(sum(i['size'] for i in all_files.values()) / 1048576, 1),
    'total_wikilinks': sum(i['out'] for i in all_files.values()),
    'files_with_links': sum(1 for i in all_files.values() if i['out'] > 0),
    'chapters': {ch: {k: v for k, v in s.items() if k != 'mds'} for ch, s in stats.items()},
    'coverage': coverage,
    'orphan_count': len(orphans),
    'orphans_sample': orphans[:60],
    'broken_count': sum(broken.values()),
    'broken_unique': len(broken),
    'broken_top': sorted(broken.items(), key=lambda x: -x[1])[:30],
    'stub_count': len(stubs),
    'stubs': stubs[:40],
    'small_count': len(small),
}
json.dump(out, open('/tmp/eval_scan.json', 'w'), ensure_ascii=False, indent=1)

# 控制台摘要
print(f"总文件 {out['total_files']} | 总行数 {out['total_lines']:,} | {out['total_size_mb']} MB")
print(f"wikilink 总数 {out['total_wikilinks']} | 有链文件 {out['files_with_links']} | 孤立 {out['orphan_count']} | 断链 {out['broken_count']}/{out['broken_unique']}唯一 | stub(<500B) {out['stub_count']}")
print("\n== 章节统计 ==")
for ch in CHAPTERS + KG_DIRS:
    s = stats[ch]
    c = coverage.get(ch, {})
    avg = s['lines'] // max(s['files'], 1)
    flag = ''
    if ch in coverage:
        flag = f" R:{'Y' if c['README'] else 'N'} D:{c['dummy_count']} N:{c['nutshell_count']} sub:{c['subdir_count']}"
    print(f"{ch:26s} files={s['files']:4d} lines={s['lines']:7d} avg={avg:5d} size={s['size']//1024:6d}KB{flag}")
