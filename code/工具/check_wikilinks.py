#!/usr/bin/env python3
r"""wikilink 断链分类巡检工具（2026-07 评估校准版）。

解析策略（与 治理/_meta/_evaluation-2026-07-27.md 附录一致）：
1. 处理表格转义竖线 [[path\|别名]]
2. 全路径精确匹配（相对库根，无 .md 后缀）
3. basename 模糊匹配（Obsidian 语义）
4. 目录级链接识别（指向存在目录视为合法）

输出：按五类分类的断链报告（裸名称/旧路径/缺失概念页/相对路径/基础设施路径）。
用法：python3 code/工具/check_wikilinks.py [--json 输出路径] [--quiet]
退出码：有断链时为 1（可用于 pre-commit / CI）。
"""
import json
import os
import re
import sys
from collections import defaultdict

# 仓库根：code/工具/<本文件> → 上溯三级
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# 内容根：全部 wiki 文档所在目录（vault 内容区）
CONTENT = os.path.join(ROOT, 'wiki')
# 任何层级都排除（版本控制/编辑器/构建产物）
ALWAYS_SKIP = {'.git', '.obsidian', '.qoder', '.claude', '.githooks', '.github',
               'node_modules', 'release'}
# 内容根内保持原有口径：信源归档/历史归档/规划稿只作为合法链接目标，不作为断链扫描源
# 2026-11-18 P5 解耦：权威清单 = 治理/_meta/infra-dirs.json；加载失败回退同值默认
# 2026-11-24 P0-3 三区口径：dirs[].zone 字段 + zones 策略块是门禁分级与站点入库权威分区
def _load_infra():
    try:
        with open(os.path.join(CONTENT, '治理', '_meta', 'infra-dirs.json'), encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


_INFRA = _load_infra()


def _load_infra_list(key, default):
    try:
        return set(_INFRA['tool_lists'][key])
    except Exception:
        return set(default)


def _load_zone_paths():
    """返回 zone → 路径列表；加载失败回退 v1 行为（staging 不含 原始/）。"""
    try:
        return {name: list(spec.get('paths', []))
                for name, spec in _INFRA['zones'].items()
                if isinstance(spec, dict)}
    except Exception:
        return {'staging': ['资料与归档/来源', '资料与归档/docs'],
                'archive': ['归档']}


ZONE_PATHS = _load_zone_paths()


def zone_of(rel):
    """wiki 相对路径 → 所属区：staging / archive / published（默认）。

    最长前缀匹配：zones.paths 中的目录前缀命中即归属该区；无命中为 published。
    """
    rel_norm = str(rel).replace('\\', '/').rstrip('/')
    best, best_len = 'published', -1
    for zone, paths in ZONE_PATHS.items():
        for p in paths:
            p_norm = p.replace('\\', '/').rstrip('/')
            if rel_norm == p_norm or rel_norm.startswith(p_norm + '/'):
                if len(p_norm) > best_len:
                    best, best_len = zone, len(p_norm)
    return best


def _zone_skip_names():
    """非 published 区目录名跳过集（一级或二级命中，延续既有口径）。"""
    return {os.path.basename(p.replace('\\', '/').rstrip('/'))
            for paths in ZONE_PATHS.values() for p in paths} or \
        _load_infra_list('check_wikilinks_scan_skip', {'来源', '归档', 'docs'})


ROOT_ONLY_SKIP = _zone_skip_names()
CLASSIFY_INFRA_FIRST = _load_infra_list(
    'check_wikilinks_classify_first',
    {'前端应用', '工具', 'code', 'docs', '原始', '来源', '归档', 'release'})
# 历史评估报告是快照，其中断链示例不计入（与修复脚本 SKIP_FILES 一致）
SKIP_FILES = {'治理/_meta/_evaluation-2026-07-27.md',
              '治理/_meta/_evaluation-2026-06-24.md',
              '治理/_project-evaluation.md',
              '治理/Project_Structure_Evaluation_2026.md'}
WIKILINK = re.compile(r'\[\[([^\]]+?)\]\]')
CHAPTER_PREFIX = re.compile(r'^(\d{2}_|概念/|治理/|90_|94_)')
FENCED_CODE = re.compile(r'```.*?```', re.S)
INLINE_CODE = re.compile(r'`[^`\n]+`')
# P1-7 后继：改写类脚本的保护掩码用单遍交替正则——两段式（先围栏后行内）
# 会让行内配对伸进围栏 NUL 区产生重叠 run，掩码还原必崩（README.md 实证）
CODE_URL_MASK = re.compile(r'```.*?```|`[^`\n]+`|https?://\S+', re.S)
FRONTMATTER = re.compile(r'\A---\s*\n(.*?)\n---', re.S)


def _split_alias_values(rest):
    """拆分 aliases: [a, b] / aliases: a, b / aliases: 'a' 等写法。"""
    rest = re.sub(r'\s+#.*$', '', rest).strip()
    if rest.startswith('[') and rest.endswith(']'):
        rest = rest[1:-1]
    parts, buf, quote = [], [], None
    for ch in rest:
        if quote:
            buf.append(ch)
            if ch == quote:
                quote = None
        elif ch in '"\'':
            quote = ch
            buf.append(ch)
        elif ch == ',':
            parts.append(''.join(buf))
            buf = []
        else:
            buf.append(ch)
    parts.append(''.join(buf))
    out = []
    for part in parts:
        value = re.sub(r'\s+#.*$', '', part).strip().strip('"\'')
        if value:
            out.append(value)
    return out


def parse_aliases(text):
    """解析 frontmatter aliases，兼容行内列表与块级列表（无 PyYAML 依赖）。"""
    m = FRONTMATTER.match(text)
    if not m:
        return []
    lines = m.group(1).split('\n')
    aliases = []
    i = 0
    while i < len(lines):
        am = re.match(r'^alias(?:es)?\s*:\s*(.*)$', lines[i])
        if not am:
            i += 1
            continue
        rest = am.group(1).strip()
        if rest:
            aliases.extend(_split_alias_values(rest))
            i += 1
            continue
        j = i + 1
        while j < len(lines):
            item = re.match(r'^\s+-\s*(.*)$', lines[j])
            if not item:
                break
            value = re.sub(r'\s+#.*$', '', item.group(1)).strip().strip('"\'')
            if value:
                aliases.append(value)
            j += 1
        i = j
    return aliases


def alias_keys(value):
    """别名归一化键：大小写不敏感，空格与连字符两种写法都登记。"""
    low = re.sub(r'\s+', ' ', value.strip().lower())
    return {low, low.replace(' ', '-')} if low else set()


def build_alias_index(mds, read_text=None):
    """alias 归一化键 -> 按路径排序的 rel（无 .md 后缀）。

    read_text 供 --staged 模式注入索引内容读取；返回 None 时跳过。
    """
    index = defaultdict(set)
    for rel in mds:
        try:
            if read_text is not None:
                text = read_text(rel)
            else:
                text = open(os.path.join(CONTENT, rel), encoding='utf-8',
                            errors='ignore').read()
        except OSError:
            continue
        if not text:
            continue
        for alias in parse_aliases(text):
            for key in alias_keys(alias):
                index[key].add(rel[:-3])
    return {key: sorted(paths) for key, paths in index.items()}


def alias_candidates(target, alias_index):
    """按 Obsidian basename 语义返回 alias 命中路径；无命中返回空列表。"""
    base = re.sub(r'\s+', ' ', os.path.basename(target).strip().lower())
    if not base:
        return []
    for key in (base, base.replace(' ', '-')):
        if key in alias_index:
            return alias_index[key]
    return []


def collect_files():
    """返回 (待扫描md列表, 全库md列表, 目录相对路径集合)。

    目标索引用全库列表构建（含基建目录内真实文件），断链扫描只跑待扫描列表。
    """
    scan_mds, all_mds, dirs = [], [], set()
    for dp, dns, fns in os.walk(CONTENT):
        dns[:] = [d for d in dns if d not in ALWAYS_SKIP]
        rel_dp = os.path.relpath(dp, CONTENT)
        if rel_dp != '.':
            dirs.add(rel_dp)
        parts = () if rel_dp == '.' else rel_dp.split(os.sep)
        # 2026-11 目录重组后 来源/docs 收编于 资料与归档/ 之下：路径一级或二级
        # 命中跳过集均不作扫描源，延续「信源/规划稿只作合法链接目标」的既定口径
        scannable = rel_dp == '.' or not any(p in ROOT_ONLY_SKIP for p in parts[:2])
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
    # 候选按路径排序：os.walk 遍历顺序在 macOS/Linux 上不同，重名文件的
    # 「先到先得」会造成门禁结果跨平台漂移（link_gate 取 [0]），排序后两侧一致
    for key in name_index:
        name_index[key].sort()
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
    if target.split('/')[0] in CLASSIFY_INFRA_FIRST:
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
    alias_index = build_alias_index(all_mds)

    broken = []  # (source, target, category)
    total_links = 0
    alias_hits = 0
    for rel in scan_mds:
        if rel in SKIP_FILES:
            continue
        text = open(os.path.join(CONTENT, rel), encoding='utf-8', errors='ignore').read()
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
            # 磁盘上真实存在的非 md 文件（代码/脚本/数据）视为合法；
            # 先在内容根内找，再回退仓库根（兼容 [[工具/xxx.py]] 这类基建路径）
            if any(os.path.exists(os.path.join(base, t + ext))
                   for base in (CONTENT, ROOT)
                   for ext in ('', '.py', '.sh', '.txt', '.json', '.csv', '.yaml', '.yml')):
                continue
            if alias_candidates(t, alias_index):
                alias_hits += 1
                continue
            broken.append((rel, t, classify(t)))

    by_cat = defaultdict(list)
    for src, tgt, cat in broken:
        by_cat[cat].append((src, tgt))

    if not quiet:
        print(f'总 wikilink: {total_links}  断链: {len(broken)} 次 / '
              f'{len({t for _, t, _ in broken})} 唯一目标')
        if alias_hits:
            print(f'  其中 alias 兜底解析: {alias_hits} 次')
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
