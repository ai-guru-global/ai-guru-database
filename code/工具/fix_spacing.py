#!/usr/bin/env python3
"""Fix Chinese-English spacing in Markdown files.

Adds spaces between Chinese characters and English/digits where missing.
Skips code blocks, inline code, URLs, YAML frontmatter, and markdown syntax.
"""

import re
import sys
import os
from pathlib import Path

# 默认扫描内容根 wiki/（仓库根 = code/工具/ 上溯三级）
CONTENT_ROOT = str(Path(__file__).resolve().parent.parent.parent / 'wiki')

CJK_RANGE = r'\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff'
CJK = re.compile(f'[{CJK_RANGE}]')
ASCII_WORD = re.compile(r'[A-Za-z0-9%]')

def fix_spacing(text: str) -> str:
    """Add spaces between CJK and ASCII characters, skipping protected regions."""
    lines = text.split('\n')
    result = []
    in_code_block = False
    in_yaml = False

    for line in lines:
        # Track code blocks
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            result.append(line)
            continue

        # Track YAML frontmatter
        if line.strip() == '---':
            if not in_yaml:
                in_yaml = True
                result.append(line)
                continue
            else:
                in_yaml = False
                result.append(line)
                continue

        if in_code_block or in_yaml:
            result.append(line)
            continue

        # Process the line, protecting inline code and URLs
        fixed = _fix_line_spacing(line)
        result.append(fixed)

    return '\n'.join(result)


def _fix_line_spacing(line: str) -> str:
    """Fix spacing in a single line, preserving links, URLs and inline code.

    保护优先级：完整 md 链接 → wikilink → URL → 行内代码。必须先保护完整
    链接再做行内代码，否则 [`path.md`](path.md) 这类"显示文本含行内代码"的
    链接会被代码切分拦腰断开，`](目标)` 残片匹配不上链接正则，目标段被改坏
    （实证：07_模型训练/04_分布式训练/03_分布式训练_2026.md，ISS-108）。
    """
    protected = []

    def stash(m):
        protected.append(m.group())
        return f'__PROT{len(protected) - 1}__'

    temp = line
    for pattern in (re.compile(r'\[[^\]]*\]\([^)]*\)'),   # md 链接整体
                    re.compile(r'\[\[[^\]]*\]\]'),        # wikilink 整体
                    re.compile(r'https?://\S+'),          # URL
                    re.compile(r'(`+)([^`]+?)\1')):       # 行内代码（反引号游程配对，
        temp = pattern.sub(stash, temp)                   # 兼容 ``…`` 双反引号围栏）

    # Fix: CJK followed by ASCII (add space)
    temp = re.sub(f'([{CJK_RANGE}])([A-Za-z0-9])', r'\1 \2', temp)
    # Fix: ASCII followed by CJK (add space)
    temp = re.sub(f'([A-Za-z0-9%])([{CJK_RANGE}])', r'\1 \2', temp)
    # Fix double spaces introduced
    temp = re.sub(r'  +', ' ', temp)

    # 逆序还原：嵌套占位（如链接内又有行内代码）须由外向内展开
    for i in range(len(protected) - 1, -1, -1):
        temp = temp.replace(f'__PROT{i}__', protected[i])
    return temp


def process_file(filepath: str) -> tuple:
    """Process a single file. Returns (path, changes_made, lines_fixed)."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original = f.read()
    except (UnicodeDecodeError, PermissionError):
        return filepath, False, 0

    fixed = fix_spacing(original)

    if fixed != original:
        # Count changed lines
        orig_lines = original.split('\n')
        fix_lines = fixed.split('\n')
        changes = sum(1 for a, b in zip(orig_lines, fix_lines) if a != b)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed)
        return filepath, True, changes

    return filepath, False, 0


def main():
    base_dir = sys.argv[1] if len(sys.argv) > 1 else CONTENT_ROOT

    # Find all .md files in core directories (exclude Web, synthesis, .git, etc.)
    exclude_dirs = {'Web', 'synthesis', '.git', '_archives', '_raw', '_staging',
                    'concepts', 'entities', 'journal', 'projects',
                    'references', 'skills', '.venv', '.qoder', '.obsidian',
                    '.github', '.comate', '.qwen', 'node_modules'}

    md_files = []
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
        for f in files:
            if f.endswith('.md'):
                md_files.append(os.path.join(root, f))

    total_files = len(md_files)
    changed_files = 0
    total_changes = 0

    print(f"Scanning {total_files} markdown files...")

    for filepath in sorted(md_files):
        path, changed, changes = process_file(filepath)
        if changed:
            rel = os.path.relpath(path, base_dir)
            changed_files += 1
            total_changes += changes
            print(f"  Fixed: {rel} ({changes} lines)")

    print(f"\nDone: {changed_files}/{total_files} files modified, {total_changes} lines fixed")


if __name__ == '__main__':
    main()
