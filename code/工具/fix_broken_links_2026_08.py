#!/usr/bin/env python3
"""fix_broken_links_2026_08.py — 全库 broken 链接修复（一次性脚本，执行后勿重跑）

阶段 1: `[[路径\|显示名]]` 格式误报 → `[[路径|显示名]]`（check_links 缺陷规避）
阶段 2: 路径错/模糊匹配 → 指向真实存在的文件
阶段 3: 死链 → 目标章节目录存在则保底指向该目录 README/index，否则移除链接保留文字
"""
import json
import re
import sys
import difflib
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
EXCLUDE = ['code/', 'release/', '原始/', 'reports/', '.git/', '.obsidian/', '.claude/',
           '.qoder/', 'node_modules/', '.github/', '.code-up/', '.crush/', '.kilo/',
           '.zcode/', 'docs/']
DRY = '--dry' in sys.argv

CL = json.load(open('/tmp/cl2.json'))
broken = CL['broken_list']

# ---- 分类 ----
esc = [b for b in broken if str(b['target']).endswith('\\')]
not_esc = [b for b in broken if not str(b['target']).endswith('\\')]
real = [b for b in not_esc if not any(d in b['source'] for d in EXCLUDE + ['reports/'])]

# ---- 全库 basename 索引 ----
bn_map = {}
all_paths = []
for p in REPO.rglob('*.md'):
    s = p.relative_to(REPO).as_posix()
    if any(s.startswith(d) for d in EXCLUDE):
        continue
    all_paths.append(s)
    bn_map.setdefault(p.name.lower(), []).append(s)


def norm(s):
    s = s.lower()
    s = re.sub(r'^\d+_', '', s)
    s = re.sub(r'[\s_\-]+', '', s)
    s = re.sub(r'\.md$', '', s)
    return s


bn_norm = {}
for p in all_paths:
    bn_norm.setdefault(norm(p.rsplit('/', 1)[-1]), []).append(p)

# ---- 阶段 2: 构建 (source, target) -> new 映射 ----
fixmap = {}        # (source, target) -> new_target
ambiguous = []     # 多命中且无法消歧 → 报告
for b in real:
    t = b['target'].lstrip('./')
    bn = t.rsplit('/', 1)[-1].lower()
    key = bn if bn.endswith('.md') else bn + '.md'
    new = None
    if key in bn_map:
        cands = bn_map[key]
        if len(cands) == 1:
            new = cands[0]
        else:
            top = t.split('/')[0]
            same = [c for c in cands if c.startswith(top + '/')]
            if len(same) == 1:
                new = same[0]
    if new:
        fixmap[(b['source'], b['target'])] = new
    else:
        # 规范化/模糊（多命中需同顶层消歧，否则转人工）
        n = norm(bn)
        cand = bn_norm.get(n)
        if cand:
            if len(cand) == 1:
                new = cand[0]
            else:
                top = t.split('/')[0]
                same = [c for c in cand if c.startswith(top + '/')]
                if len(same) == 1:
                    new = same[0]
        if not new and not cand:
            top = t.split('/')[0]
            cands = [p for p in all_paths if p.startswith(top + '/')]
            best, bs = None, 0
            for p in cands:
                sc = difflib.SequenceMatcher(None, n, norm(p.rsplit('/', 1)[-1])).ratio()
                if sc > bs:
                    best, bs = p, sc
            if bs >= 0.72:
                new = best
        if new:
            fixmap[(b['source'], b['target'])] = new
        else:
            ambiguous.append(b)

# ---- 阶段 3: 死链策略 ----
dead_map = {}      # (source, target) -> 'keep:new' | 'remove'
for b in ambiguous:
    t = b['target'].lstrip('./')
    top = t.split('/')[0]
    readme = REPO / top / 'README.md'
    index = REPO / top / 'index.md'
    if readme.is_file():
        dead_map[(b['source'], b['target'])] = 'keep:' + f'{top}/README.md'
    elif index.is_file():
        dead_map[(b['source'], b['target'])] = 'keep:' + f'{top}/index.md'
    else:
        dead_map[(b['source'], b['target'])] = 'remove'


# ---- 文件级处理 ----
def link_display(target, display):
    if display is not None:
        return display
    bn = target.rstrip('/').rsplit('/', 1)[-1]
    return bn[:-3] if bn.endswith('.md') else bn


def process_file(rel, is_esc):
    """返回 (替换数, 移除数, 保底数)；修改文件（非 DRY）。"""
    path = REPO / rel
    try:
        text = path.read_text(encoding='utf-8')
    except Exception:
        return 0, 0, 0
    orig = text
    n_fix = n_rm = n_keep = 0

    def sub_wl(m):
        nonlocal n_fix, n_rm, n_keep
        inner = m.group(1)
        if is_esc and '\\|' in inner:
            # 阶段 1: 转义分隔符 → 普通分隔符
            n_fix += 1
            return '[[' + inner.replace('\\|', '|') + ']]'
        target = inner.split('|')[0].strip()
        display = inner.split('|', 1)[1].strip() if '|' in inner else None
        key = (rel, target)
        if key in fixmap:
            n_fix += 1
            disp = '|' + display if display is not None else ''
            return f'[[{fixmap[key]}{disp}]]'
        if key in dead_map:
            act = dead_map[key]
            if act.startswith('keep:'):
                n_keep += 1
                disp = '|' + display if display is not None else ''
                return f'[[{act[5:]}{disp}]]'
            n_rm += 1
            return link_display(target, display)
        return m.group(0)

    def sub_md(m):
        nonlocal n_fix, n_rm, n_keep
        text_part, link_part = m.group(1), m.group(2)
        key = (rel, link_part)
        if key in fixmap:
            n_fix += 1
            return f'[{text_part}]({fixmap[key]})'
        if key in dead_map:
            act = dead_map[key]
            if act.startswith('keep:'):
                n_keep += 1
                return f'[{text_part}]({act[5:]})'
            n_rm += 1
            return text_part
        return m.group(0)

    text = re.sub(r'\[\[([^\]]+)\]\]', sub_wl, text)
    text = re.sub(r'\[([^\]]*)\]\(([^)]+)\)', sub_md, text)
    if text != orig and not DRY:
        path.write_text(text, encoding='utf-8')
    return n_fix, n_rm, n_keep


# ---- 执行 ----
esc_sources = {b['source'] for b in esc}
all_sources = set(esc_sources) | {b['source'] for b in real}
tot = {'fix': 0, 'rm': 0, 'keep': 0}
changed_files = 0
for rel in sorted(all_sources):
    f, r, k = process_file(rel, rel in esc_sources)
    tot['fix'] += f
    tot['rm'] += r
    tot['keep'] += k
    if f or r or k:
        changed_files += 1
        if DRY:
            print(f'  {rel}: fix={f} rm={r} keep={k}')

print(f'{"[DRY-RUN] " if DRY else ""}涉及文件 {len(all_sources)}，实际改动文件 {changed_files}')
print(f'修复(格式化+路径): {tot["fix"]}，死链保底: {tot["keep"]}，死链移除: {tot["rm"]}')
if DRY:
    json.dump({
        'fixmap': [{'source': k[0], 'target': k[1], 'new': v} for k, v in fixmap.items()],
        'dead': [{'source': k[0], 'target': k[1], 'action': v} for k, v in dead_map.items()],
    }, open('/tmp/link_fix_map.json', 'w'), ensure_ascii=False, indent=1)
