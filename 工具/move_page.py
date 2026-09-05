#!/usr/bin/env python3
"""页面移动/改名安全工具（发展计划 2026-09 任务 1.1，P2-6 配套）。

一次操作完成：移动 .md 文件 + 重写全库入链（wikilink 与 Markdown 链接）
+ 重排被移动文件自身的相对出链。从此改名不再产生断链。

安全边界：
- 新旧路径均经 Path.relative_to(ROOT) 容器校验，越界即中止；
- 只重写指向被移动页面的链接，其余内容零触碰；别名/锚点/表格转义保留；
- 扫描范围与 check_wikilinks.py 一致（跳过 code/release/前端应用 等）；
- basename 重名时只重写全路径引用，避免误伤同名页；
- 默认 dry-run，--apply 才移动文件并写盘。

用法：python3 工具/move_page.py 旧路径.md 新路径.md [--apply]
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ALWAYS_SKIP = {'.git', '.obsidian', '.qoder', '.claude', '.githooks', '.github',
               'node_modules', 'release'}
ROOT_ONLY_SKIP = {'前端应用', '原始', '来源', '归档', 'docs', 'code', '工具'}
WIKILINK = re.compile(r'\[\[([^\]]+?)\]\]')
MD_LINK = re.compile(r'(?<!!)\[([^\]]*)\]\(([^)]+)\)')


def resolve_under_root(rel: str) -> Path:
    path = (ROOT / rel).resolve()
    path.relative_to(ROOT)
    return path


def collect_scan_files():
    files = []
    for dp, dns, fns in os.walk(ROOT):
        rel_dp = Path(dp).relative_to(ROOT)
        dns[:] = [d for d in dns if d not in ALWAYS_SKIP]
        top = rel_dp.parts[0] if rel_dp.parts else '.'
        if top in ROOT_ONLY_SKIP:
            continue
        for f in fns:
            if f.endswith('.md'):
                files.append(str(rel_dp / f) if str(rel_dp) != '.' else f)
    return files


def split_wikilink(inner: str):
    alias = ''
    for i, ch in enumerate(inner):
        if ch == '|' and (i == 0 or inner[i - 1] != '\\'):
            alias = inner[i:]
            inner = inner[:i]
            break
    anchor = ''
    if '#' in inner:
        inner, anchor = inner.split('#', 1)
        anchor = '#' + anchor
    return inner, anchor, alias


def main():
    args = [a for a in sys.argv[1:] if a != '--apply']
    apply = '--apply' in sys.argv
    if len(args) != 2:
        print('用法：python3 工具/move_page.py 旧路径.md 新路径.md [--apply]')
        sys.exit(2)

    try:
        old_path = resolve_under_root(args[0])
        new_path = resolve_under_root(args[1])
    except ValueError as e:
        print(f'❌ {e}')
        sys.exit(2)

    if not old_path.is_file() or old_path.suffix != '.md':
        print(f'❌ 源文件不存在或不是 .md：{old_path}')
        sys.exit(2)
    if new_path.exists() or new_path == old_path:
        print(f'❌ 目标路径已存在或与源相同：{new_path}')
        sys.exit(2)
    new_path.parent.mkdir(parents=True, exist_ok=True)

    old_stem = old_path.relative_to(ROOT).with_suffix('').as_posix()
    new_stem = new_path.relative_to(ROOT).with_suffix('').as_posix()
    old_base = old_path.stem.lower()
    # basename 在库内是否唯一（重名时 basename 引用不敢盲目重写）
    same_base = [f for f in collect_scan_files()
                 if Path(f).stem.lower() == old_base]
    base_unique = len(same_base) == 1

    wl_hits, md_hits, self_fix, files_touched = 0, 0, 0, 0
    for rel in collect_scan_files():
        fp = resolve_under_root(rel)
        text = fp.read_text(encoding='utf-8', errors='ignore')
        original = text
        is_self = fp == old_path

        def sub_wikilink(m):
            nonlocal wl_hits
            inner = m.group(1)
            tgt, anchor, alias = split_wikilink(inner)
            full_match = tgt == old_stem
            base_match = base_unique and not is_self and tgt.lower() == old_base
            if not (full_match or base_match):
                return m.group(0)
            wl_hits += 1
            return '[[' + new_stem + anchor + alias + ']]'

        def sub_mdlink(m):
            nonlocal md_hits
            body, target = m.group(1), m.group(2)
            if target.startswith(('http', '#', 'mailto:')):
                return m.group(0)
            clean = target.split('#')[0]
            if not clean:
                return m.group(0)
            candidate = Path(clean)
            abs_candidate = candidate if candidate.is_absolute() \
                else (fp.parent / candidate)
            try:
                abs_candidate = abs_candidate.resolve()
                abs_candidate.relative_to(ROOT)
            except ValueError:
                return m.group(0)
            if abs_candidate != old_path:
                return m.group(0)
            anchor = target[len(target.split('#')[0]):] if '#' in target else ''
            md_hits += 1
            rel_new = os.path.relpath(new_path, fp.parent).replace(os.sep, '/')
            return f'[{body}]({rel_new}{anchor})'

        text = WIKILINK.sub(sub_wikilink, text)
        text = MD_LINK.sub(sub_mdlink, text)

        # 被移动文件自身的相对 md 出链：按新位置重算相对路径
        if is_self:
            def fix_self(m):
                nonlocal self_fix
                body, target = m.group(1), m.group(2)
                if target.startswith(('http', '#', 'mailto:')):
                    return m.group(0)
                clean = target.split('#')[0]
                if not clean:
                    return m.group(0)
                abs_candidate = (old_path.parent / clean).resolve()
                try:
                    abs_candidate.relative_to(ROOT)
                except ValueError:
                    return m.group(0)
                if not abs_candidate.exists():
                    return m.group(0)
                anchor = target[len(target.split('#')[0]):] if '#' in target else ''
                self_fix += 1
                rel_new = os.path.relpath(abs_candidate, new_path.parent).replace(os.sep, '/')
                return f'[{body}]({rel_new}{anchor})'

            text = MD_LINK.sub(fix_self, text)

        if text != original:
            files_touched += 1
            if apply:
                fp.write_text(text, encoding='utf-8')

    if apply:
        old_path.rename(new_path)

    mode = '已应用' if apply else 'DRY-RUN（加 --apply 执行）'
    print(f'{mode}：{old_stem}  →  {new_stem}')
    print(f'  入链重写：wikilink {wl_hits} 处，Markdown 链接 {md_hits} 处，'
          f'自身相对出链调整 {self_fix} 处，涉及 {files_touched} 个文件')
    if not base_unique:
        print(f'  ⚠️ basename「{old_path.stem}」在库内重名，'
              f'basename 式引用未重写，仅处理全路径引用')


if __name__ == '__main__':
    main()
