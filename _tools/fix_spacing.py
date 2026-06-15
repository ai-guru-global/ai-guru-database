#!/usr/bin/env python3
"""Fix Chinese-English spacing in Markdown files.

Adds spaces between Chinese characters and English/digits where missing.
Skips code blocks, inline code, URLs, YAML frontmatter, and markdown syntax.
"""

import re
import sys
import os
from pathlib import Path

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
    """Fix spacing in a single line, preserving inline code and links."""
    # Split by inline code spans to protect them
    parts = re.split(r'(`[^`]+`)', line)
    fixed_parts = []

    for i, part in enumerate(parts):
        if part.startswith('`') and part.endswith('`'):
            # Inline code - don't touch
            fixed_parts.append(part)
        else:
            # Protect URLs
            url_placeholders = {}
            url_pattern = re.compile(r'https?://\S+')
            for j, match in enumerate(url_pattern.finditer(part)):
                placeholder = f'__URL{j}__'
                url_placeholders[placeholder] = match.group()

            temp = url_pattern.sub(lambda m: f'__URL{list(url_placeholders.values()).index(m.group())}__', part)

            # Protect markdown link syntax [...](...)
            link_pattern = re.compile(r'\[([^\]]*)\]\([^)]*\)')
            link_placeholders = {}
            for j, match in enumerate(link_pattern.finditer(temp)):
                placeholder = f'__LINK{j}__'
                link_placeholders[placeholder] = match.group()

            temp = link_pattern.sub(lambda m: f'__LINK{list(link_placeholders.values()).index(m.group())}__', temp)

            # Fix: CJK followed by ASCII (add space)
            temp = re.sub(
                f'([{CJK_RANGE}])([A-Za-z0-9])',
                r'\1 \2',
                temp
            )
            # Fix: ASCII followed by CJK (add space)
            temp = re.sub(
                f'([A-Za-z0-9%])([{CJK_RANGE}])',
                r'\1 \2',
                temp
            )

            # Fix double spaces introduced
            temp = re.sub(r'  +', ' ', temp)

            # Restore links
            for placeholder, original in link_placeholders.items():
                temp = temp.replace(placeholder, original)
            # Restore URLs
            for placeholder, original in url_placeholders.items():
                temp = temp.replace(placeholder, original)

            fixed_parts.append(temp)

    return ''.join(fixed_parts)


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
    base_dir = sys.argv[1] if len(sys.argv) > 1 else '.'

    # Find all .md files in core directories (exclude Web, synthesis, .git, etc.)
    exclude_dirs = {'Web', 'synthesis', '.git', '_archives', '_raw', '_staging',
                    'mkdocs-docs', 'concepts', 'entities', 'journal', 'projects',
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
