#!/usr/bin/env python3
"""Auto-fix common broken links in Markdown files."""
import re
import os
import sys

# 历史修复映射已于 2026-06 重构后清空（章节重编号使旧路径失效）。
# 新增修复请在确认新路径后单独添加。
FIXES = {}

# Depth corrections: when a file at depth N uses ../ M times where M != N
# Pattern: (wrong_prefix_count, correct_prefix_count, target_path)
DEPTH_FIXES = [
    # From 03_Deep_Learning/Neural_Network_Core/ (depth 2 from root) using ../../../ (3 up = wrong)
    # Should use ../../ (2 up)
]

def fix_links_in_file(filepath, base_dir):
    """Fix broken links in a single file."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    fixes_applied = 0
    
    # Get file's directory relative to base
    rel_dir = os.path.relpath(os.path.dirname(filepath), base_dir)
    depth = len(rel_dir.split(os.sep)) if rel_dir != '.' else 0
    
    # Apply direct pattern fixes
    for broken, correct in FIXES.items():
        # Try to find the broken pattern with various ../ prefixes
        pattern = re.compile(r'\]\(([^)]*' + re.escape(broken) + r')\)')
        for match in pattern.finditer(content):
            full_path = match.group(1)
            # Extract the ../ prefix
            prefix_match = re.match(r'^(\.\./)+', full_path)
            if prefix_match:
                prefix = prefix_match.group(0)
                # Calculate correct prefix based on depth
                correct_prefix = '../' * depth
                new_path = correct_prefix + correct
                content = content.replace(f']({full_path})', f']({new_path})', 1)
                fixes_applied += 1
    
    # Fix depth issues: ../../../04_NLP_LLMs/ from depth-2 dirs
    if depth >= 2:
        # Pattern: too many ../ followed by chapter path
        wrong_depth_pattern = re.compile(
            r'\]\((\.\./\.\./\.\./)(0[0-9]_\w+/\w+\.md)\)'
        )
        for match in wrong_depth_pattern.finditer(content):
            too_many = match.group(1)  # ../../../
            target = match.group(2)     # 04_NLP_LLMs/README_for_dummy.md
            correct_prefix = '../' * depth
            old = f']({too_many}{target})'
            new = f']({correct_prefix}{target})'
            if old in content and depth != 3:
                content = content.replace(old, new, 1)
                fixes_applied += 1
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    
    return fixes_applied


def main():
    base_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    exclude = {'.git', 'Web', '_synthesis', '_archives', '_raw', '_staging',
               'node_modules', '.venv', '.qoder', '.obsidian', '.github',
               '_concepts', 'entities', 'journal', 'projects',
               '_references', 'skills'}
    
    total_fixes = 0
    files_fixed = 0
    
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in exclude and not d.startswith('.')]
        for fname in files:
            if not fname.endswith('.md'):
                continue
            filepath = os.path.join(root, fname)
            fixes = fix_links_in_file(filepath, base_dir)
            if fixes > 0:
                rel = os.path.relpath(filepath, base_dir)
                total_fixes += fixes
                files_fixed += 1
                print(f"  Fixed {fixes} links in {rel}")
    
    print(f"\nDone: {total_fixes} links fixed in {files_fixed} files")


if __name__ == '__main__':
    main()
