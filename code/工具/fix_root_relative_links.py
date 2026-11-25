#!/usr/bin/env python3
"""P0-2A2 / ISS-110：根相对裸写 md 链接批量改写为显式相对路径。

现象（2026-11-24 实测 2,006 条 / 388 文件）：`概念/README.md` 内写
`[claude](概念/LLM/claude-series.md)` 这类"裸写的 vault 根相对路径"，
按标准 Markdown / Obsidian 语义相对源文件解析即 404，仅旧 check_links
口径（从 vault 根解析）漏报为通过。

改写规则：
- 仅处理「源文件目录不存在、vault 根存在」的裸相对 .md 链接（即
  check_links 分类 root_relative_bare 的集合），改写为源文件目录出发的
  显式相对路径：不带 ../ 的加 `./` 前缀，其余用 ../ 链。
- 已是 ./ ../ / 开头、或源目录本就存在的链接：一律不动。
- `#锚点` 后缀剥离后解析、原样接回。
- 围栏代码块、行内代码、frontmatter 内不改。

用法：
    python3 code/工具/fix_root_relative_links.py                # dry-run 统计
    python3 code/工具/fix_root_relative_links.py --limit 8      # 只看 top hub
    python3 code/工具/fix_root_relative_links.py --write        # 真正写盘
"""
import argparse
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT = ROOT / 'wiki'

sys.path.insert(0, str(Path(__file__).resolve().parent))
import check_wikilinks as cw  # noqa: E402  复用 collect_files（三区口径）与 ALWAYS_SKIP

MD_LINK = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')
FENCE = re.compile(r'^\s*(`{3,}|~{3,})')
FRONTMATTER_END = re.compile(r'\A---\s*\n.*?\n---', re.S)


def explicit_relative(target: Path, source_dir: Path) -> str:
    """vault 根存在性已验证的目标 → 源文件目录出发的显式相对路径。"""
    rel = os.path.relpath(target, source_dir).replace(os.sep, '/')
    return rel if rel.startswith('../') else './' + rel


def rewrite_text(text: str, source_path: Path) -> tuple[str, int, list]:
    """返回 (新文本, 改写条数, 样例[(旧目标, 新目标)])。

    代码块/行内代码保护与 link_gate 同口径：正则配对 + 等长掩码，**掩码区
    必须还原**（历史事故：曾返回掩码文本，NUL 直落写盘造成 22k NUL 腐蚀，
    752a2850f 回退修复）。frontmatter 不掩码：summary/description 内的
    md 链接同样渲染为链接，与 link_gate 口径一致。
    """
    source_dir = source_path.parent
    protected = []

    def mask(m):
        protected.append(m.group())
        return '\x00' * len(m.group())

    masked = cw.FENCED_CODE.sub(mask, text)
    masked = cw.INLINE_CODE.sub(mask, masked)

    n, samples = 0, []

    def sub(mm):
        nonlocal n
        display, target = mm.group(1), mm.group(2).strip()
        anchor = ''
        if '#' in target:
            target, _, anchor = target.partition('#')
            anchor = '#' + anchor
        if target.startswith(('http://', 'https://', 'mailto:',
                              'ftp://', '#', '/', '../')):
            return mm.group(0)
        # './' 开头不再跳过：门禁对它同样做根回退检查（ISS-110 回归批次
        # 曾出现 './90_学习/…' 形态的根相对裸写），源目录命中即不动
        if not target.endswith('.md'):
            return mm.group(0)
        src_rel = Path(os.path.normpath(source_dir / target))
        if src_rel.is_file():
            return mm.group(0)  # 源目录已可解析：不动
        root_abs = CONTENT / target
        if not root_abs.is_file():
            return mm.group(0)  # 真断链：交由 check_links 报告
        new_target = explicit_relative(
            os.path.normpath(root_abs), os.path.normpath(source_dir))
        if new_target + anchor != target + anchor:
            n += 1
            samples.append((target + anchor, new_target + anchor))
        return f'[{display}]({new_target}{anchor})'

    new_body = MD_LINK.sub(sub, masked)
    # 按出现顺序还原等长 NUL 掩码区（sub 不改变区域相对顺序，逐段首个命中即对位）
    for orig in protected:
        run = '\x00' * len(orig)
        idx = new_body.find(run)
        assert idx != -1, '掩码区还原错位：输出中出现孤立 NUL 段'
        new_body = new_body[:idx] + orig + new_body[idx + len(run):]
    assert '\x00' not in new_body, '输出残留 NUL——掩码还原不完整，拒绝写盘'
    return new_body, n, samples


def main():
    parser = argparse.ArgumentParser(description='根相对裸写 md 链接改写（ISS-110）')
    parser.add_argument('--write', action='store_true', help='真正写盘（默认 dry-run）')
    parser.add_argument('--limit', type=int, default=0, help='只处理前 N 个文件（按断链数降序）')
    parser.add_argument('--file', metavar='PATH', help='只处理单个文件（wiki 相对路径）')
    args = parser.parse_args()

    _, all_mds, _ = cw.collect_files()
    if args.file:
        targets = [args.file]
    else:
        # 按预估改写数降序：先统计一遍
        scored = []
        for rel in all_mds:
            path = CONTENT / rel
            text = path.read_text(encoding='utf-8', errors='ignore')
            _, n, _ = rewrite_text(text, path)
            if n:
                scored.append((n, rel))
        scored.sort(reverse=True)
        targets = [rel for _, rel in scored]
        if args.limit:
            targets = targets[:args.limit]
        print(f'含根相对裸写链接的文件：{len(scored)} 个，'
              f'本次处理 {len(targets)} 个（write={args.write}）')

    total = 0
    changed_files = 0
    for rel in targets:
        path = CONTENT / rel
        text = path.read_text(encoding='utf-8', errors='ignore')
        new_text, n, samples = rewrite_text(text, path)
        if not n:
            continue
        total += n
        changed_files += 1
        print(f'{"WRITE" if args.write else "DRY  "} {rel}: {n} 条')
        for old, new in samples[:2]:
            print(f'      {old}  →  {new}')
        if args.write:
            path.write_text(new_text, encoding='utf-8')
    print(f'\n合计：{total} 条链接 / {changed_files} 个文件'
          f'{"（已写盘）" if args.write else "（dry-run 未写盘）"}')
    if not args.write:
        print('确认无误后追加 --write 执行；建议配合 --limit 分批。')


if __name__ == '__main__':
    main()
