#!/usr/bin/env python3
"""Add ./ prefix to relative markdown links that lack it, causing checker misresolution.

The check_links.py resolves links WITHOUT ./ or ../ prefix from the repo BASE,
not from the source file's directory. This script adds ./ to relative links in
subdirectory files so they resolve correctly.
"""
import os, re, sys
from pathlib import Path

EXCLUDE_DIRS = {'.git', '.venv', 'node_modules', '.claude', '.qoder', '.qwen',
                '.comate', '.crush', '.pytest_cache', '__pycache__', 'Web',
                '.obsidian', '.github', 'dist', 'site', '_raw'}

def fix_file(filepath, base, dry_run=False):
    """Fix relative links in a single file."""
    rel = os.path.relpath(filepath, base)
    # depth 相对仓库根计算：checker 将无前缀链接按仓库根解析，
    # 因此只要文件不在仓库根，就需要 ./ 前缀
    rel_root = os.path.relpath(filepath, '.')
    depth = len(rel_root.split(os.sep)) - 1  # 0 = 仓库根级
    if depth == 0:
        return 0  # Root-level files: links without ./ correctly resolve from base

    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    original = content
    fixes = 0

    # Pattern: ](some/path.md) where path doesn't start with ./ ../ http / #
    # Must NOT match if the path looks like an absolute repo path (e.g., 12_Architecture_Infrastructure/...)
    # Heuristic: if the first path component is a known chapter dir (NN_Name), it's meant as repo-root-absolute
    # and we should NOT add ./
    # Otherwise (e.g., SRE_Reliability/..., Architecture_Overview/...), it's a relative subdir link

    def replacer(m):
        nonlocal fixes
        full = m.group(0)
        text = m.group(1)
        path = m.group(2).strip()
        # Skip externals
        if path.startswith(('http://', 'https://', 'mailto:', '#', 'ftp://', './', '../')):
            return full
        if not path.endswith('.md'):
            return full
        # Check if first component is a numbered chapter (NN_Name) — these are repo-root-relative
        first_comp = path.split('/')[0]
        if re.match(r'^\d{2}_', first_comp):
            return full  # Intentionally repo-root-relative
        # Check if first component is a known top-level dir (_concepts, _synthesis, etc.)
        if first_comp.startswith('_') or first_comp in {'docs', 'scripts'}:
            return full
        # This is a relative link that needs ./
        fixes += 1
        return f']({text})(./{path})'

    fixes = 0

    def fix_link(m):
        nonlocal fixes
        text = m.group(1)
        path = m.group(2).strip()
        anchor = ''
        if '#' in path:
            path, anchor = path.split('#', 1)
            anchor = '#' + anchor
        if path.startswith(('http://', 'https://', 'mailto:', '#', 'ftp://', './', '../')):
            return m.group(0)
        if not path.endswith('.md'):
            return m.group(0)
        first_comp = path.split('/')[0]
        # 仅当路径含 / 且首段为 NN_ 章节目录时才视为仓库根相对；
        # 裸文件名（如 06_Xxx.md）是兄弟文件链接，需要 ./ 前缀
        if '/' in path and re.match(r'^\d{2}_', first_comp):
            return m.group(0)
        if first_comp.startswith('_') or first_comp in {'docs', 'scripts'}:
            return m.group(0)
        fixes += 1
        return f'[{text}](./{path}{anchor})'

    new_content = re.sub(
        r'(?<!\!)\[([^\]]*)\]\(([^)]+)\)',
        fix_link,
        content
    )

    if new_content != original and not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
    return fixes

def main():
    base = sys.argv[1] if len(sys.argv) > 1 else '.'
    dry_run = '--dry-run' in sys.argv
    total = 0
    files = 0
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for fname in filenames:
            if not fname.endswith('.md'):
                continue
            fp = os.path.join(dirpath, fname)
            fixes = fix_file(fp, base, dry_run)
            if fixes > 0:
                rel = os.path.relpath(fp, base)
                total += fixes
                files += 1
                print(f"  {'Would fix' if dry_run else 'Fixed'} {fixes} links in {rel}")
    print(f"\n{'DRY RUN: ' if dry_run else ''}Fixed {total} links in {files} files")

if __name__ == '__main__':
    main()
