#!/usr/bin/env python3
"""wiki 健康门禁 v2.2：全文 ratchet + 变更文件零容忍。

全文模式（默认）——四项指标相对基线只许下降、不许上升：
1. wikilink 断链数     —— 口径：check_wikilinks.py（路径 / basename / 目录三级解析；
                           aliases 解析待 P0-2）
2. 孤立页数（无入链）  —— 扫描范围内无任何 wikilink 入链的 .md（排除 README / index 类导航文件）
3. frontmatter 不完整数 —— 缺 title / category / tags / summary / created / updated / tier / name_zh 之一
4. 中英间距违规数      —— 口径：fix_spacing.py 差分（修复前后文本不一致即违规）

变更模式（--changed-only）——只检查新增 / 修改的 wiki .md，零容忍：
- frontmatter 8 字段齐全
- 无断链
- 无中英间距违规
变更范围从 git 获取，三选一：
- 默认：工作区相对 HEAD 的改动 + 未跟踪文件
- --staged：仅暂存区（pre-commit 用）
- --base REF：REF...HEAD（CI PR / 推送前用）

实现：runpy 进程内加载 check_wikilinks.py 与 fix_spacing.py（无子进程扫描、无 shell），
单个页面的检查逻辑由全文模式与变更模式共用，避免两套口径漂移。全文模式任一指标超过
治理/_meta/link-health-baseline.json 基线即退出码 1；变更模式任一文件违规即退出码 1；
git 不可用或参数错误退出码 2。

用法：
    python3 code/工具/link_gate.py                          # 全文 ratchet
    python3 code/工具/link_gate.py --update-baseline         # 指标改善后收紧基线
    python3 code/工具/link_gate.py --changed-only --staged   # pre-commit
    python3 code/工具/link_gate.py --changed-only --base origin/main  # CI / 推送前
"""
import argparse
import json
import os
import re
import runpy
import subprocess
import sys
from datetime import date
from pathlib import Path

# 仓库根：code/工具/<本文件> → 上溯三级；内容根为 wiki/
ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT = ROOT / 'wiki'
BASELINE_PATH = CONTENT / '治理' / '_meta' / 'link-health-baseline.json'
CHECKER = ROOT / 'code' / '工具' / 'check_wikilinks.py'
SPACER = ROOT / 'code' / '工具' / 'fix_spacing.py'
NAV_BASES = {'readme', 'readme_en', 'index', 'readme_for_dummy'}
REQUIRED_FIELDS = ('title', 'category', 'tags', 'summary',
                   'created', 'updated', 'tier', 'name_zh')
FRONTMATTER = re.compile(r'\A---\s*\n(.*?)\n---', re.S)
FIELD = re.compile(r'^(\w[\w-]*):', re.M)


class GitError(RuntimeError):
    pass


def load_checker():
    """以普通模块身份加载巡检脚本（不触发其 main），复用其函数与常量。"""
    return runpy.run_path(str(CHECKER), run_name='wiki_checker_module')


def load_spacer():
    return runpy.run_path(str(SPACER), run_name='spacing_module')


def exists_exact(rel: str) -> bool:
    """逐组件精确名存在性检查。macOS 文件系统大小写不敏感，os.path.exists
    会把 [[概念/rag]]（实际为 概念/RAG）误判为存在，Linux CI 上却判断链，
    造成门禁跨平台漂移；统一按目录项精确匹配消除差异。"""
    for base in (CONTENT, ROOT):
        cur = base
        for part in Path(rel).parts:
            try:
                entries = os.listdir(cur)
            except OSError:
                break
            hit = [e for e in entries if e == part]
            if not hit:
                break
            cur = cur / hit[0]
        else:
            return True
    return False


def is_nav_page(rel: str) -> bool:
    """README / INDEX 类导航页不参与孤立页统计（去掉 .md 后比较）。"""
    return os.path.splitext(os.path.basename(rel))[0].lower() in NAV_BASES


def resolve_target(t, rel_index, name_index, alias_index, dirs, alias_candidates):
    """返回 (resolved, broken, alias_scope)。

    resolved 仅用于入链统计；目录引用与磁盘上真实存在的非 md 文件视为合法，
    但不计入入链（与原有全文口径一致）。alias_scope 为 None / 'bare' / 'path'。
    """
    if t in rel_index:
        return t, False, None
    basename = os.path.basename(t).lower()
    if basename in name_index:
        return name_index[basename][0], False, None
    bare = t.rstrip('/')
    if bare in dirs or exists_exact(bare):
        return None, False, None
    aliases = alias_candidates(t, alias_index)
    if aliases:
        return aliases[0], False, 'path' if '/' in t else 'bare'
    return None, True, None


def inspect_text(text, chk, fix_spacing, rel_index, name_index, alias_index, dirs):
    """检查单个页面。全文扫描与 --changed-only 共用，保证口径零漂移。"""
    m = FRONTMATTER.match(text)
    fields = set(FIELD.findall(m.group(1))) if m else set()
    fm_missing = [f for f in REQUIRED_FIELDS if f not in fields]
    spacing_ok = fix_spacing(text) == text
    plain = chk['INLINE_CODE'].sub('', chk['FENCED_CODE'].sub('', text))
    resolved, broken, alias_hits, link_count = [], [], [], 0
    for raw in chk['WIKILINK'].findall(plain):
        t = chk['normalize_target'](raw)
        if not t or t.startswith('http'):
            continue
        link_count += 1
        target, is_broken, alias_scope = resolve_target(
            t, rel_index, name_index, alias_index, dirs,
            chk['alias_candidates'])
        if target:
            resolved.append(target)
        if alias_scope:
            alias_hits.append({'target': t, 'scope': alias_scope})
        if is_broken:
            broken.append({'target': t, 'category': chk['classify'](t)})
    return {'fm_missing': fm_missing, 'spacing_ok': spacing_ok,
            'resolved': resolved, 'broken': broken, 'alias_hits': alias_hits,
            'link_count': link_count}


def scan(chk, spacer) -> dict:
    """一次扫描同时产出：断链 / 孤立页 / frontmatter 不完整 / 间距违规 清单。"""
    scan_mds, all_mds, dirs = chk['collect_files']()
    rel_index, name_index = chk['build_indexes'](all_mds)
    alias_index = chk['build_alias_index'](all_mds)
    fix_spacing = spacer['fix_spacing']
    broken, inlinked = [], set()
    fm_incomplete, spacing_bad = [], []
    alias_hits = {'bare': 0, 'path': 0}
    total_links = 0
    for rel in scan_mds:
        if rel in chk['SKIP_FILES']:
            continue
        text = (Path(chk['CONTENT']) / rel).read_text(encoding='utf-8', errors='ignore')
        info = inspect_text(text, chk, fix_spacing, rel_index, name_index,
                            alias_index, dirs)
        if info['fm_missing']:
            fm_incomplete.append(rel)
        if not info['spacing_ok']:
            spacing_bad.append(rel)
        inlinked.update(info['resolved'])
        for hit in info['alias_hits']:
            alias_hits[hit['scope']] += 1
        total_links += info['link_count']
        for item in info['broken']:
            broken.append({'source': rel, **item})
    orphans = [rel for rel in scan_mds
               if rel[:-3] not in inlinked and not is_nav_page(rel)]
    return {'broken': broken, 'orphans': orphans, 'fm_incomplete': fm_incomplete,
            'spacing_bad': spacing_bad, 'alias_hits': alias_hits,
            'total_links': total_links}


def git_paths(args):
    """运行 git 并返回 NUL 分隔的路径列表。"""
    try:
        proc = subprocess.run(['git', *args], cwd=ROOT, check=True,
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        raise GitError('未找到 git 命令')
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.decode('utf-8', errors='replace').strip()
        raise GitError(f'git {" ".join(args)} 失败：{detail or "未知错误"}')
    return [p for p in proc.stdout.decode('utf-8', errors='replace').split('\0') if p]


def changed_wiki_paths(staged, base=None):
    """返回相对 wiki/ 的变更 .md 路径（新增 / 修改 / 重命名的新路径）。"""
    if staged:
        raw = git_paths(['diff', '--cached', '--name-only',
                         '--diff-filter=AMR', '-z'])
    elif base:
        raw = git_paths(['diff', '--name-only', '--diff-filter=AMR',
                         '-z', f'{base}...HEAD'])
    else:
        raw = git_paths(['diff', '--name-only', '--diff-filter=AMR', '-z', 'HEAD'])
        raw += git_paths(['ls-files', '--others', '--exclude-standard', '-z'])
    paths = []
    for path in raw:
        path = path.replace('\\', '/')
        if path.startswith('wiki/') and path.endswith('.md'):
            paths.append(path[len('wiki/'):])
    return sorted(set(paths))


def read_changed_text(rel: str, staged: bool):
    """--staged 读索引内容（提交的就是它），其余读工作区。"""
    if staged:
        proc = subprocess.run(['git', 'show', f':wiki/{rel}'], cwd=ROOT,
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if proc.returncode != 0:
            return None
        return proc.stdout.decode('utf-8', errors='ignore')
    path = CONTENT / rel
    if not path.is_file():
        return None
    return path.read_text(encoding='utf-8', errors='ignore')


def run_changed_only(args, chk, spacer) -> int:
    scan_mds, all_mds, dirs = chk['collect_files']()
    rel_index, name_index = chk['build_indexes'](all_mds)
    fix_spacing = spacer['fix_spacing']
    scan_set = set(scan_mds) - set(chk['SKIP_FILES'])
    try:
        raw_changed = changed_wiki_paths(args.staged, args.base)
    except GitError as exc:
        print(f'❌ {exc}', file=sys.stderr)
        return 2
    changed = [rel for rel in raw_changed if rel in scan_set]
    if not changed:
        print('✅ changed-only：没有需要检查的 wiki/.md 变更')
        return 0

    staged_set = set(raw_changed) if args.staged else set()

    def read_alias_text(rel):
        if rel in staged_set:
            text = read_changed_text(rel, True)
            if text is not None:
                return text
        path = CONTENT / rel
        if not path.is_file():
            return None
        return path.read_text(encoding='utf-8', errors='ignore')

    alias_index = chk['build_alias_index'](all_mds, read_text=read_alias_text)
    failed = 0
    for rel in changed:
        text = read_changed_text(rel, args.staged)
        if text is None:
            print(f'⚠️  {rel}（无法读取，已跳过）')
            continue
        info = inspect_text(text, chk, fix_spacing, rel_index, name_index,
                            alias_index, dirs)
        problems = []
        if info['fm_missing']:
            problems.append('frontmatter 缺: ' + '、'.join(info['fm_missing']))
        if not info['spacing_ok']:
            problems.append('中英间距违规：运行 python3 code/工具/fix_spacing.py 修复')
        for item in info['broken']:
            problems.append(f'断链: [[{item["target"]}]]（{item["category"]}）')
        if problems:
            failed += 1
            print(f'❌ {rel}')
            for problem in problems:
                print(f'   - {problem}')
        else:
            print(f'✅ {rel}')

    print()
    if failed:
        print(f'❌ changed-only 门禁未通过：{failed}/{len(changed)} 个文件有违规')
        return 1
    print(f'✅ changed-only 门禁通过（{len(changed)} 个文件）')
    return 0


def build_parser():
    parser = argparse.ArgumentParser(description='wiki 健康门禁')
    parser.add_argument('--changed-only', action='store_true',
                        help='只检查新增 / 修改的 wiki .md，零容忍（不与基线比较）')
    parser.add_argument('--staged', action='store_true',
                        help='--changed-only 时只检查暂存区（pre-commit）')
    parser.add_argument('--base', metavar='REF',
                        help='--changed-only 时检查 REF...HEAD（CI PR / 推送前）')
    parser.add_argument('--update-baseline', action='store_true',
                        help='全文模式：指标改善后收紧基线')
    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    if (args.staged or args.base) and not args.changed_only:
        parser.error('--staged / --base 只能与 --changed-only 一起使用')
    if args.changed_only and args.update_baseline:
        parser.error('--changed-only 不能与 --update-baseline 一起使用')

    chk = load_checker()
    spacer = load_spacer()
    if args.changed_only:
        sys.exit(run_changed_only(args, chk, spacer))

    if not BASELINE_PATH.exists():
        print(f'❌ 基线文件不存在：{BASELINE_PATH}', file=sys.stderr)
        sys.exit(2)

    result = scan(chk, spacer)
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
    hits = result['alias_hits']
    if hits['bare'] or hits['path']:
        print(f"ℹ️ aliases 兜底解析：{hits['bare'] + hits['path']} 次"
              f"（裸别名 {hits['bare']} / 带路径 {hits['path']}）")
    if not failed and (adopted or args.update_baseline):
        baseline['unique_targets'] = len({b['target'] for b in result['broken']})
        baseline['total_links'] = total
        baseline['updated'] = date.today().isoformat()
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
