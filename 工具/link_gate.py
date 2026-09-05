#!/usr/bin/env python3
"""wiki 健康门禁 v2.1（发展计划任务 1.2）：四项指标相对基线只许下降、不许上升。

1. wikilink 断链数     —— 口径：check_wikilinks.py（严口径三级解析）
2. 孤立页数（无入链）  —— 口径：扫描范围内无任何入链的 .md（排除 README / index 类导航文件）
3. frontmatter 不完整数 —— 缺 title / category / tags / summary / created / updated / tier / name_zh 之一
4. 中英间距违规数      —— 口径：fix_spacing.py 差分（修复前后文本不一致即违规）

实现：runpy 进程内加载 check_wikilinks.py 与 fix_spacing.py（无子进程、无 shell），
扫描逻辑与巡检 / 修复工具零漂移。任一指标超过 治理/_meta/link-health-baseline.json
基线即退出码 1（供 pre-commit / GitHub Actions 阻断）。

用法：
    python3 工具/link_gate.py                    # 门禁检查
    python3 工具/link_gate.py --update-baseline  # 指标改善后收紧基线
"""
import json
import os
import re
import runpy
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASELINE_PATH = ROOT / '治理' / '_meta' / 'link-health-baseline.json'
CHECKER = ROOT / '工具' / 'check_wikilinks.py'
SPACER = ROOT / '工具' / 'fix_spacing.py'
NAV_BASES = {'readme', 'index', 'readme_for_dummy'}
REQUIRED_FIELDS = ('title', 'category', 'tags', 'summary',
                   'created', 'updated', 'tier', 'name_zh')
FRONTMATTER = re.compile(r'\A---\s*\n(.*?)\n---', re.S)
FIELD = re.compile(r'^(\w[\w-]*):', re.M)


def load_checker():
    """以普通模块身份加载巡检脚本（不触发其 main），复用其函数与常量。"""
    return runpy.run_path(str(CHECKER), run_name='wiki_checker_module')


def load_spacer():
    return runpy.run_path(str(SPACER), run_name='spacing_module')


def scan(chk, spacer) -> dict:
    """一次扫描同时产出：断链 / 孤立页 / frontmatter 不完整 / 间距违规 清单。"""
    scan_mds, all_mds, dirs = chk['collect_files']()
    rel_index, name_index = chk['build_indexes'](all_mds)
    fix_spacing = spacer['fix_spacing']
    broken, inlinked = [], set()
    fm_incomplete, spacing_bad = [], []
    total_links = 0
    for rel in scan_mds:
        if rel in chk['SKIP_FILES']:
            continue
        text = (ROOT / rel).read_text(encoding='utf-8', errors='ignore')
        # frontmatter 完整性
        m = FRONTMATTER.match(text)
        fields = set(FIELD.findall(m.group(1))) if m else set()
        if not all(f in fields for f in REQUIRED_FIELDS):
            fm_incomplete.append(rel)
        # 中英间距（复用 fix_spacing 差分，规则与修复工具零漂移）
        if fix_spacing(text) != text:
            spacing_bad.append(rel)
        # wikilink 解析（与巡检脚本一致：先剔除代码块/行内码）
        plain = chk['INLINE_CODE'].sub('', chk['FENCED_CODE'].sub('', text))
        for raw in chk['WIKILINK'].findall(plain):
            t = chk['normalize_target'](raw)
            if not t or t.startswith('http'):
                continue
            total_links += 1
            resolved = None
            if t in rel_index:
                resolved = t
            elif os.path.basename(t).lower() in name_index:
                resolved = name_index[os.path.basename(t).lower()][0]
            if resolved:
                inlinked.add(resolved)
            elif t.rstrip('/') not in dirs and not os.path.exists(ROOT / t):
                broken.append({'source': rel, 'target': t,
                               'category': chk['classify'](t)})
    orphans = [rel for rel in scan_mds
               if rel[:-3] not in inlinked
               and os.path.basename(rel).lower() not in NAV_BASES]
    return {'broken': broken, 'orphans': orphans, 'fm_incomplete': fm_incomplete,
            'spacing_bad': spacing_bad, 'total_links': total_links}


def main():
    apply = '--update-baseline' in sys.argv
    chk = load_checker()
    result = scan(chk, load_spacer())
    current = {
        'broken_instances': len(result['broken']),
        'orphan_count': len(result['orphans']),
        'frontmatter_incomplete': len(result['fm_incomplete']),
        'spacing_violations': len(result['spacing_bad']),
    }
    total = result['total_links']

    baseline = json.loads(BASELINE_PATH.read_text(encoding='utf-8'))
    label = {'broken_instances': '断链', 'orphan_count': '孤立页',
             'frontmatter_incomplete': 'frontmatter 缺失',
             'spacing_violations': '中英间距'}
    failed = []
    adopted = False
    for key, cur in current.items():
        allowed = baseline.get(key)
        if allowed is None:  # 首次部署该检查项：自动建立基线
            baseline[key] = cur
            adopted = True
            print(f'🆕 {label[key]}检查首次启用，基线建立为 {cur}')
            continue
        mark = '✅' if cur <= allowed else '❌'
        print(f'{mark} {label[key]}：{cur} / 基线 {allowed}')
        if cur > allowed:
            failed.append(key)
        elif cur < allowed:
            baseline[key] = cur
    if not failed and (adopted or apply):
        BASELINE_PATH.write_text(
            json.dumps(baseline, ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8')
        print('✅ 基线已写入' if adopted else '✅ 基线已收紧并写入')
    if failed:
        print('❌ 门禁未通过，超标项：' + '、'.join(label[k] for k in failed))
        if 'broken_instances' in failed:
            seen = set()
            shown = 0
            for b in result['broken']:
                if b['target'] not in seen:
                    seen.add(b['target'])
                    if shown < 10:
                        shown += 1
                        print(f'   - {b["target"]}   <- {b["source"]}')
        if 'orphan_count' in failed:
            print('   新增孤立页示例：' + '；'.join(result['orphans'][:5]))
        if 'frontmatter_incomplete' in failed:
            print('   frontmatter 缺失示例：'
                  + '；'.join(result['fm_incomplete'][:5]))
        if 'spacing_violations' in failed:
            print('   间距违规示例：' + '；'.join(result['spacing_bad'][:5]))
        print('   确需绕过用 git commit --no-verify（不建议）')
        sys.exit(1)
    rate = current['broken_instances'] / max(total, 1) * 100
    print(f'✅ 门禁通过（断链率 {rate:.1f}%，总 wikilink 约 {total}）')


if __name__ == '__main__':
    main()
