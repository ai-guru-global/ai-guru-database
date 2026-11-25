#!/usr/bin/env python3
"""P1-2：按目录聚合的健康债务周报。

复用 link_gate 的三区口径扫描结果，按 wiki 顶层目录聚合六类债务
（wikilink 断链 / 孤立页 / frontmatter 缺失 / 间距违规 / md 断链 / md 根相对裸写），
并对照 link-health-baseline.json 的 targets 输出进度。

用法：
    python3 code/工具/debt_report.py                # markdown 到 stdout
    python3 code/工具/debt_report.py --json out.json
"""
import argparse
import json
import runpy
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
BASELINE_PATH = ROOT / 'wiki' / '治理' / '_meta' / 'link-health-baseline.json'

METRICS = ('broken', 'orphans', 'fm_incomplete', 'spacing_bad',
           'md_missing', 'md_root_bare', 'fm_value')
METRIC_LABEL = {'broken': 'wikilink断链', 'orphans': '孤立页',
                'fm_incomplete': 'frontmatter缺失', 'spacing_bad': '间距违规',
                'md_missing': 'md断链', 'md_root_bare': 'md根相对裸写',
                'fm_value': 'fm值违规'}


def top_dir(rel: str) -> str:
    """wiki 相对路径 → 顶层目录名（根文件归 '(root)'）。"""
    first = rel.replace('\\', '/').split('/', 1)[0]
    return first if '/' in rel.replace('\\', '/') else '(root)'


def aggregate(result: dict) -> dict:
    """扫描结果 → {顶层目录: {指标: 计数}}，含 total 行。纯函数便于测试。"""
    table = {}
    for metric in METRICS:
        for item in result.get(metric, []):
            rel = item['source'] if isinstance(item, dict) else item
            table.setdefault(top_dir(rel), Counter())[metric] += 1
    table['(total)'] = Counter({m: len(result.get(m, [])) for m in METRICS})
    return {d: dict(c) for d, c in table.items()}


def render(table: dict, targets: dict | None) -> str:
    """聚合表 + targets 进度 → markdown。"""
    lines = ['# wiki 健康债务周报（按顶层目录）', '',
             '| 目录 | ' + ' | '.join(METRIC_LABEL[m] for m in METRICS)
             + ' | 合计 |',
             '|---|' + '---:|' * (len(METRICS) + 1)]
    ordered = sorted(table.items(),
                     key=lambda kv: -sum(kv[1].values()))
    for d, counts in ordered:
        cells = [counts.get(m, 0) for m in METRICS]
        lines.append(f'| {d} | ' + ' | '.join(str(c) for c in cells)
                     + f' | {sum(cells)} |')
    if targets:
        lines += ['', '## targets 进度（期限 '
                  + str(targets.get('deadline', '未设定')) + '）', '']
        current = table.get('(total)', {})
        rate = (current.get('broken', 0) + current.get('md_missing', 0)
                + current.get('md_root_bare', 0)) / max(1, targets.get(
                    '_total_links', 1)) * 100
        for key, goal in targets.items():
            if key in ('deadline', 'note', '_total_links', 'broken_rate_pct'):
                continue
            cur = current.get(key, 0)
            mark = '✅' if cur <= goal else '⏳'
            lines.append(f'- {mark} `{key}`：当前 {cur} / 目标 ≤ {goal}')
        if 'broken_rate_pct' in targets:
            mark = '✅' if rate <= targets['broken_rate_pct'] else '⏳'
            lines.append(f'- {mark} `broken_rate_pct`：当前 ≈{rate:.1f}% / 目标 ≤ '
                         f'{targets["broken_rate_pct"]}%')
    return '\n'.join(lines) + '\n'


def main():
    parser = argparse.ArgumentParser(description='按目录聚合的健康债务周报')
    parser.add_argument('--json', metavar='FILE', help='聚合结果另存 JSON')
    args = parser.parse_args()

    gate = runpy.run_path(str(ROOT / 'code' / '工具' / 'link_gate.py'),
                          run_name='link_gate_module')
    chk = gate['load_checker']()
    spacer = gate['load_spacer']()
    result = gate['scan'](chk, spacer)

    table = aggregate(result)
    baseline = json.loads(BASELINE_PATH.read_text(encoding='utf-8'))
    targets = baseline.get('targets')
    if targets:
        targets = dict(targets)
        targets['_total_links'] = baseline.get('total_links', 1)

    report = render(table, targets)
    print(report)
    if args.json:
        Path(args.json).write_text(
            json.dumps({'table': table, 'targets': targets},
                       ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8')
        print(f'JSON 已写入 {args.json}')


if __name__ == '__main__':
    main()
