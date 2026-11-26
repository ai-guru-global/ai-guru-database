#!/usr/bin/env python3
"""ISS-111 / P0-2C2：带路径别名 wikilink 批量改写为现行路径。

现象（2026-11-25 实测 971 条）：`rename_to_chinese` 迁移把文件改中文名、
旧英文名降级为 frontmatter aliases，但存量链接保留 `目录/旧英文名` 形态。
Obsidian 别名索引只匹配裸名——`目录/别名` 不可解析，实为伪装通过的断链
（抽样实证见 治理/_meta/alias-sampling-2026-11-24.md）。

改写规则：
- 仅处理「带 `/` 的路径 + 不在真实路径集 + alias_candidates 命中」的
  wikilink，目标替换为现行路径（alias_candidates[0]）；
- 裸别名（141 条）合法保留；真实路径不动；alias 救不回的真断链不碰
  （交由断链口径报告）；
- 显示文本 / 表格转义竖线 / 锚点 原样保留（只替换目标段）；
- 围栏代码块、行内代码不改（等长掩码 + 还原断言，防 NUL 事故复发）。

用法：
    python3 code/工具/fix_path_alias_links.py                # dry-run 统计
    python3 code/工具/fix_path_alias_links.py --write        # 真正写盘
"""
import argparse
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
import check_wikilinks as cw  # noqa: E402

WIKILINK = cw.WIKILINK


def split_target(raw: str) -> tuple:
    r"""raw（[[ ]] 内原文）→ (目标段, 其余原文)。

    目标段 = 第一个未转义 `|` / `#` 之前的全部内容（`\|` 为表格转义，
    跳过不视为分隔）。
    """
    i = 0
    while i < len(raw):
        ch = raw[i]
        if ch in '|#' or (ch == '\\' and i + 1 < len(raw) and raw[i + 1] in '|#'):
            break  # `\|`/`\#` 的反斜杠归 rest——表格内未转义 | 会破坏单元格
        i += 1
    return raw[:i], raw[i:]


def normalize_head(head: str) -> str:
    """目标段规范化（与 normalize_target 同口径），用于等价判断。"""
    t = head.replace('\\|', '|').split('|')[0].split('#')[0].strip()
    t = t.rstrip('\\').strip()
    if t.endswith('.md'):
        t = t[:-3]
    return t


def rewrite_text(text: str, rel_index: set, alias_index: dict, name_index: dict | None = None) -> tuple:
    """返回 (新文本, 改写条数, 样例[(旧目标, 新目标)])。纯索引驱动，无磁盘访问。"""
    if '\x00' in text:
        # 存量 NUL 语料（DeepSeek 抓取保留态等）：不在本战役范围，整只跳过
        return text, 0, [('SKIP: 存量 NUL', '')]
    protected = []

    def mask(m):
        protected.append(m.group())
        return '\x00' * len(m.group())

    # 单遍交替掩码（围栏|行内|URL）：天然无重叠，还原必对位
    masked = cw.CODE_URL_MASK.sub(mask, text)

    n, samples = 0, []
    edits = []
    for m in WIKILINK.finditer(masked):
        raw = m.group(1)
        if '\x00' in raw or '\x00' in m.group(0):
            continue  # 命中段触及掩码区（如 [[`代码`/x]]）：不处理，防吞掩码
        t = cw.normalize_target(raw)
        if not t or t.startswith('http') or '/' not in t:
            continue
        if t in rel_index:
            continue  # 真实路径：不动
        # basename 可解析（含跨目录路径+唯一名）不属 ISS-111：Obsidian 语义
        # 下可用（basename 回退），仅 mkdocs 渲染受限——另一族群，另行登记
        if name_index and os.path.basename(t).lower() in name_index:
            continue
        cands = cw.alias_candidates(t, alias_index)
        if not cands:
            continue  # alias 也救不回的真断链：交由断链口径
        new_target = cands[0]
        head, rest = split_target(raw)
        if normalize_head(head) == new_target:
            continue
        n += 1
        if len(samples) < 3:
            samples.append((t, new_target))
        edits.append((m.start(0), m.end(0), '[[' + new_target + rest + ']]'))

    out = masked
    for start, end, repl in reversed(edits):  # 逆序切片替换保持位移
        out = out[:start] + repl + out[end:]

    # 掩码还原（按文档序 + 游标防同长段错位）+ 零 NUL 断言（752a2850f 事故教训）
    pos = 0
    for orig in protected:
        run = '\x00' * len(orig)
        idx = out.find(run, pos)
        assert idx != -1, '掩码区还原错位：输出中出现孤立 NUL 段'
        out = out[:idx] + orig + out[idx + len(run):]
        pos = idx + len(orig)
    assert '\x00' not in out, '输出残留 NUL——掩码还原不完整，拒绝写盘'
    return out, n, samples


def main():
    parser = argparse.ArgumentParser(description='带路径别名 wikilink 改写（ISS-111）')
    parser.add_argument('--write', action='store_true', help='真正写盘（默认 dry-run）')
    parser.add_argument('--limit', type=int, default=0, help='只处理前 N 个文件（按改写数降序）')
    parser.add_argument('--file', metavar='PATH', help='只处理单个文件（wiki 相对路径）')
    args = parser.parse_args()

    scan_mds, all_mds, _dirs = cw.collect_files()
    rel_index, name_index = cw.build_indexes(all_mds)
    alias_index = cw.build_alias_index(all_mds)

    if args.file:
        targets = [args.file]
    else:
        scored = []
        for rel in scan_mds:
            if rel in cw.SKIP_FILES:
                continue
            text = (ROOT / 'wiki' / rel).read_text(encoding='utf-8', errors='ignore')
            _, n, _ = rewrite_text(text, set(rel_index), alias_index, name_index)
            if n:
                scored.append((n, rel))
        scored.sort(reverse=True)
        targets = [rel for _, rel in scored]
        if args.limit:
            targets = targets[:args.limit]
        print(f'含带路径别名链接的文件：{len(scored)} 个，'
              f'本次处理 {len(targets)} 个（write={args.write}）')

    total = 0
    changed_files = 0
    for rel in targets:
        if rel in cw.SKIP_FILES:
            continue
        path = ROOT / 'wiki' / rel
        text = path.read_text(encoding='utf-8', errors='ignore')
        new_text, n, samples = rewrite_text(text, set(rel_index), alias_index, name_index)
        if not n:
            continue
        total += n
        changed_files += 1
        print(f'{"WRITE" if args.write else "DRY  "} {rel}: {n} 条')
        for old, new in samples[:2]:
            print(f'      [[{old}]] → [[{new}]]')
        if args.write:
            path.write_text(new_text, encoding='utf-8')
    print(f'\n合计：{total} 条链接 / {changed_files} 个文件'
          f'{"（已写盘）" if args.write else "（dry-run 未写盘）"}')
    if not args.write:
        print('确认无误后追加 --write 执行；建议配合 --limit 分批。')


if __name__ == '__main__':
    main()
