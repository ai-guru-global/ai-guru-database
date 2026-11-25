#!/usr/bin/env python3
"""wiki 健康门禁 v2.3：全文 ratchet + 变更文件零容忍 + 三区分级 + 导入批次。

全文模式（默认）——八项指标相对基线只许下降、不许上升：
1. wikilink 断链数     —— 口径：check_wikilinks.py（路径 / basename / 目录三级解析；
                           aliases 兜底解析已纳入；带路径别名命中单列计数见 ISS-111）
2. 孤立页数（无入链）  —— 无任何 wikilink / md 链接入链的 .md（排除 README / index 导航页）
3. frontmatter 不完整数 —— 缺 title / category / tags / summary / created / updated / tier / name_zh 之一
4. 中英间距违规数      —— 口径：fix_spacing.py 差分（修复前后文本不一致即违规）
5. staging frontmatter / 6. staging 间距 —— staging 区仅格式检查，独立棘轮（P0-3）
7. md 断链数 / 8. md 根相对裸写数 —— md 内部链接进门禁（P0-2B，口径同 check_links.py）

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
# P0-4 导入批次：一次性导入的债务按批次授权增量，到期自动失效；
# 禁止用一次性抬高基线吸收导入债务——额度只影响通过与否则不进基线
BATCH_DIR = CONTENT / '治理' / '_meta' / 'import-batches'
BATCH_METRICS = ('broken_instances', 'orphan_count', 'frontmatter_incomplete',
                 'spacing_violations', 'staging_frontmatter_incomplete',
                 'staging_spacing_violations', 'md_broken',
                 'md_root_relative_bare')
CHECKER = ROOT / 'code' / '工具' / 'check_wikilinks.py'
SPACER = ROOT / 'code' / '工具' / 'fix_spacing.py'
NAV_BASES = {'readme', 'readme_en', 'index', 'readme_for_dummy'}
REQUIRED_FIELDS = ('title', 'category', 'tags', 'summary',
                   'created', 'updated', 'tier', 'name_zh')
FRONTMATTER = re.compile(r'\A---\s*\n(.*?)\n---', re.S)
FIELD = re.compile(r'^(\w[\w-]*):', re.M)
# P0-2B：md 内部链接进门禁。口径与 check_links.py 一致（源文件目录解析、
# '/' 开头 vault 根、根相对裸写单列）；正则暂与 check_links 重复，待 P2-1 单一 resolver 并库
MD_LINK = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')


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


def inspect_text(text, chk, fix_spacing, rel_index, name_index, alias_index, dirs,
                 rel):
    """检查单个页面。全文扫描与 --changed-only 共用，保证口径零漂移。

    P0-2B：wikilink 之外同口径扫描 md 内部链接——resolved 并入孤立页入链
    统计（P1-4）；真断链入 md_missing；根相对裸写单列 md_root_bare。
    """
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
    md_missing, md_root_bare = [], []
    content_root = Path(chk['CONTENT'])
    src_dir = (content_root / rel).parent
    posix_dir = str(Path(rel.replace('\\', '/')).parent)
    for mm in MD_LINK.finditer(plain):
        target = mm.group(2).strip().partition('#')[0]
        if target.startswith(('http://', 'https://', 'mailto:', 'ftp://', '#')):
            continue
        if not target.endswith('.md'):
            continue
        link_count += 1
        if target.startswith('/'):
            root_hit = content_root / target.lstrip('/')
            if root_hit.is_file():
                resolved.append(target.lstrip('/')[:-3])
            else:
                md_missing.append({'target': target})
            continue
        src_hit = Path(os.path.normpath(src_dir / target))
        if src_hit.is_file():
            # 孤立页入链口径：wiki 相对路径去 .md（与 wikilink resolved 同构）
            resolved.append(os.path.normpath(
                posix_dir.replace('\\', '/') + '/' + target)[:-3])
            continue
        if (content_root / target).is_file():
            md_root_bare.append({'target': target})
        else:
            md_missing.append({'target': target})
    return {'fm_missing': fm_missing, 'spacing_ok': spacing_ok,
            'resolved': resolved, 'broken': broken, 'alias_hits': alias_hits,
            'link_count': link_count, 'md_missing': md_missing,
            'md_root_bare': md_root_bare}


def scan(chk, spacer) -> dict:
    """一次扫描同时产出：断链 / 孤立页 / frontmatter 不完整 / 间距违规 清单。

    三区口径（P0-3）：published 区全量四项；staging 区仅格式检查且计入独立
    指标（staging_*，独立棘轮）；archive 区不参与（collect_files 已排除）。
    staging 页的出链不计入 published 孤立页判定（延续「信源不作扫描源」口径）。
    """
    scan_mds, all_mds, dirs = chk['collect_files']()
    rel_index, name_index = chk['build_indexes'](all_mds)
    alias_index = chk['build_alias_index'](all_mds)
    fix_spacing = spacer['fix_spacing']
    broken, inlinked = [], set()
    fm_incomplete, spacing_bad = [], []
    staging_fm, staging_spacing = [], []
    md_missing, md_root_bare = [], []
    alias_hits = {'bare': 0, 'path': 0}
    total_links = 0
    for rel in scan_mds:
        if rel in chk['SKIP_FILES']:
            continue
        text = (Path(chk['CONTENT']) / rel).read_text(encoding='utf-8', errors='ignore')
        info = inspect_text(text, chk, fix_spacing, rel_index, name_index,
                            alias_index, dirs, rel)
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
        md_missing.extend({'source': rel, **item} for item in info['md_missing'])
        md_root_bare.extend({'source': rel, **item} for item in info['md_root_bare'])
    orphans = [rel for rel in scan_mds
               if rel[:-3] not in inlinked and not is_nav_page(rel)]
    for rel in all_mds:
        if rel in chk['SKIP_FILES'] or chk['zone_of'](rel) != 'staging':
            continue
        text = (Path(chk['CONTENT']) / rel).read_text(encoding='utf-8', errors='ignore')
        info = inspect_text(text, chk, fix_spacing, rel_index, name_index,
                            alias_index, dirs, rel)
        if info['fm_missing']:
            staging_fm.append(rel)
        if not info['spacing_ok']:
            staging_spacing.append(rel)
    return {'broken': broken, 'orphans': orphans, 'fm_incomplete': fm_incomplete,
            'spacing_bad': spacing_bad, 'alias_hits': alias_hits,
            'total_links': total_links,
            'staging_fm_incomplete': staging_fm,
            'staging_spacing_bad': staging_spacing,
            'md_missing': md_missing, 'md_root_bare': md_root_bare}


def load_active_batches(batch_dir=None, today=None):
    """读取导入批次 → ({metric: 允许增量}, [生效批次], [过期批次])。

    批次文件：wiki/治理/_meta/import-batches/<batch>.json
        {"batch": 名称, "created": "YYYY-MM-DD", "expires": "YYYY-MM-DD",
         "allowed_delta": {指标: 正整数增量}, "note": 审计说明}
    expires 早于今天的批次自动失效（不计额度，仅打印过期提示保留审计轨迹）；
    无效文件忽略并告警；allowed_delta 只认 BATCH_METRICS 内的正整数。
    """
    today = today or date.today()
    batch_dir = Path(batch_dir) if batch_dir else BATCH_DIR
    deltas, active, expired = {}, [], []
    if not batch_dir.is_dir():
        return deltas, active, expired
    for path in sorted(batch_dir.glob('*.json')):
        try:
            data = json.loads(path.read_text(encoding='utf-8'))
            name = str(data['batch'])
            expires = date.fromisoformat(str(data['expires']))
            assert isinstance(data.get('allowed_delta'), dict), 'allowed_delta 须为对象'
        except Exception as exc:
            print(f'⚠️ 批次文件无效，已忽略：{path.name}（{exc}）')
            continue
        if expires < today:
            expired.append(name)
            continue
        active.append(name)
        for metric, delta in data['allowed_delta'].items():
            if metric in BATCH_METRICS and isinstance(delta, int) and delta > 0:
                deltas[metric] = deltas.get(metric, 0) + delta
    return deltas, active, expired


def evaluate_metrics(current, baseline, batch_deltas):
    """返回 (failed_keys, 收紧后的新 baseline, adopted_keys)。

    通过线 = 基线 + 未过期批次增量；批次额度不抬高基线——棘轮仍只对
    基线本体收紧（cur < 基线 时基线降为 cur），导入债务偿还后基线自动回落。
    基线缺项视为该检查项首次启用：以当前值建档（adopted）。
    """
    failed, adopted, new_baseline = [], [], dict(baseline)
    for key, cur in current.items():
        base = baseline.get(key)
        if base is None:
            new_baseline[key] = cur
            adopted.append(key)
            continue
        if cur > base + batch_deltas.get(key, 0):
            failed.append(key)
        elif cur < base:
            new_baseline[key] = cur
    return failed, new_baseline, adopted


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
    # 三区口径：staging / archive 也在盘上，变更时按区分级检查，
    # 不得静默放行（防 ingest 草稿混入违规而无人察觉）
    all_set = set(all_mds) - set(chk['SKIP_FILES'])
    try:
        raw_changed = changed_wiki_paths(args.staged, args.base)
    except GitError as exc:
        print(f'❌ {exc}', file=sys.stderr)
        return 2
    changed = [rel for rel in raw_changed if rel in all_set]
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
    checked = 0
    for rel in changed:
        zone = chk['zone_of'](rel)
        text = read_changed_text(rel, args.staged)
        if text is None:
            print(f'⚠️  {rel}（无法读取，已跳过）')
            continue
        info = inspect_text(text, chk, fix_spacing, rel_index, name_index,
                            alias_index, dirs, rel)
        problems = []
        if zone == 'archive':
            print(f'⏭️  {rel}（archive 冻结区，不参与门禁）')
            continue
        checked += 1
        if info['fm_missing']:
            problems.append('frontmatter 缺: ' + '、'.join(info['fm_missing']))
        if not info['spacing_ok']:
            problems.append('中英间距违规：运行 python3 code/工具/fix_spacing.py 修复')
        if zone == 'published':
            for item in info['broken']:
                problems.append(f'断链: [[{item["target"]}]]（{item["category"]}）')
            for item in info['md_missing']:
                problems.append(f'md 断链: {item["target"]}（渲染站/Obsidian 内 404）')
            for item in info['md_root_bare']:
                problems.append(
                    f'根相对裸写链接: {item["target"]}'
                    f'（ISS-110，实为 404——改用 ./ 或 ../ 开头的显式相对路径）')
        if problems:
            failed += 1
            print(f'❌ {rel}（{zone} 区：仅格式检查）' if zone == 'staging' else f'❌ {rel}')
            for problem in problems:
                print(f'   - {problem}')
        else:
            print(f'✅ {rel}' + (f'（{zone} 区）' if zone == 'staging' else ''))

    print()
    if failed:
        print(f'❌ changed-only 门禁未通过：{failed}/{checked} 个文件有违规')
        return 1
    print(f'✅ changed-only 门禁通过（{checked} 个文件）')
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
        'staging_frontmatter_incomplete': len(result['staging_fm_incomplete']),
        'staging_spacing_violations': len(result['staging_spacing_bad']),
        'md_broken': len(result['md_missing']),
        'md_root_relative_bare': len(result['md_root_bare']),
    }
    total = result['total_links']

    baseline = json.loads(BASELINE_PATH.read_text(encoding='utf-8'))
    label = {'broken_instances': '断链', 'orphan_count': '孤立页',
             'frontmatter_incomplete': 'frontmatter 缺失',
             'spacing_violations': '中英间距',
             'staging_frontmatter_incomplete': 'staging frontmatter 缺失',
             'staging_spacing_violations': 'staging 中英间距',
             'md_broken': 'md 断链',
             'md_root_relative_bare': 'md 根相对裸写'}
    examples = {'frontmatter_incomplete': result['fm_incomplete'],
                'spacing_violations': result['spacing_bad'],
                'staging_frontmatter_incomplete': result['staging_fm_incomplete'],
                'staging_spacing_violations': result['staging_spacing_bad'],
                'md_broken': [f"{b['source']} → {b['target']}"
                              for b in result['md_missing'][:5]],
                'md_root_relative_bare': [f"{b['source']} → {b['target']}"
                                          for b in result['md_root_bare'][:5]]}
    batch_deltas, active_batches, expired_batches = load_active_batches()
    if active_batches:
        print(f"ℹ️ 生效导入批次：{'、'.join(active_batches)}（额度已并入通过线，不抬高基线）")
    if expired_batches:
        print(f"⌛ 过期批次（不计额度）：{'、'.join(expired_batches)}——债务须回补或收紧基线")
    baseline_old = baseline
    failed, baseline, adopted_keys = evaluate_metrics(current, baseline, batch_deltas)
    adopted = bool(adopted_keys)
    tightened = any(k in baseline_old and baseline[k] < baseline_old[k]
                    for k in baseline)
    for key, cur in current.items():
        base = baseline.get(key, cur)
        if key in adopted_keys:
            print(f'🆕 {label[key]}检查首次启用，基线建立为 {cur}')
            continue
        extra = batch_deltas.get(key, 0)
        suffix = f' + 批次额度 {extra}' if extra else ''
        mark = '✅' if cur <= base + extra else '❌'
        print(f'{mark} {label[key]}：{cur} / 基线 {base}{suffix}')
    hits = result['alias_hits']
    if hits['bare'] or hits['path']:
        print(f"ℹ️ aliases 兜底解析：{hits['bare'] + hits['path']} 次"
              f"（裸别名 {hits['bare']} / 带路径 {hits['path']}）")
    if not failed and (adopted or args.update_baseline or tightened):
        # P1-2：改善即落盘（棘轮降了就记下来，不再等显式 --update-baseline）；
        # evaluate_metrics 只会降不会升，targets 等人工字段原样保留
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
        for key, items in examples.items():
            if key in failed:
                print(f'   {label[key]}示例：' + '；'.join(items[:5]))
        print('   确需绕过用 git commit --no-verify（不建议）')
        sys.exit(1)
    rate = current['broken_instances'] / max(total, 1) * 100
    print(f'✅ 门禁通过（断链率 {rate:.1f}%，总 wikilink 约 {total}）')


if __name__ == '__main__':
    main()
