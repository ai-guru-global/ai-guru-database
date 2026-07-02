#!/usr/bin/env python3
"""
Wiki link checker with classified JSON output.

Detects both markdown-style [text](path) links and Obsidian-style [[wikilink]]s.
Classifies broken targets by category:
  - missing_concept:  refers to _concepts/X but file doesn't exist (likely never created)
  - missing_file:     refers to a regular path that doesn't exist
  - stale_path:       refers to a renamed/moved path (heuristic: filename basename exists elsewhere)
  - dir_reference:    refers to a chapter directory (e.g., [[15_Agent_Production]]) — Obsidian shows dir listing
  - external:         (skipped) http/https URLs

Usage:
  python3 check_links.py [base_dir] [--json output.json] [--strict]
  --strict: also flag dir-level wikilinks as broken
"""
import os
import re
import sys
import json
import collections
from pathlib import Path


EXCLUDE_DIRS = {'.git', '.venv', 'node_modules', '.claude', '.qoder', '.qwen',
                '.comade', '.crush', '.pytest_cache', '__pycache__', 'Web',
                '.obsidian', '.github', 'dist', 'site'}


def walk_all(base):
    """Walk all md files (used for resolution index)."""
    out = []
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for f in filenames:
            if f.endswith('.md'):
                out.append(os.path.join(dirpath, f))
    return out


def walk_content(base):
    """Walk content md files (excl _raw/_sources/_archives/_tools/_projects/_meta/docs)."""
    out = []
    skip = EXCLUDE_DIRS | {'_raw', '_sources', '_archives', '_tools', '_projects', 'docs'}
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [d for d in dirnames if d not in skip and not d.startswith('.')]
        if '_meta' in dirpath.split(os.sep):
            continue
        for f in filenames:
            if f.endswith('.md'):
                out.append(os.path.join(dirpath, f))
    return out


def build_resolution_index(base):
    """Build aliases map (alias_lower -> path) by parsing frontmatter aliases: blocks."""
    files = walk_all(base)
    basename_lower = collections.defaultdict(list)
    basename_norm = collections.defaultdict(list)
    alias_to_file = {}

    for p in files:
        rel = os.path.relpath(p, base)
        bn = os.path.basename(rel).lower().replace('.md', '')
        basename_lower[bn].append(rel)
        norm = bn.replace('-', ' ').lower()
        basename_norm[norm].append(rel)

        # Parse aliases from frontmatter
        try:
            content = open(p, 'r', encoding='utf-8', errors='ignore').read()
            if not content.lstrip().startswith('---'):
                continue
            m = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            if not m:
                continue
            alias_block = re.search(r'^aliases?\s*:\s*\n((?:^\s+-\s+.+\n)+)', m.group(1), re.MULTILINE)
            if alias_block:
                aliases = re.findall(r'-\s+"?([^"\n]+?)"?\s*$', alias_block.group(1), re.MULTILINE)
                for a in aliases:
                    a_low = a.strip().lower().replace(' ', '-')
                    alias_to_file[a_low] = rel
                    alias_to_file[a.strip().lower()] = rel
        except Exception:
            pass
    return basename_lower, basename_norm, alias_to_file


def resolve_obsidian(target, base, basename_lower, basename_norm, alias_to_file):
    """Resolve [[target]] using Obsidian-style fuzzy matching. Returns path or None."""
    target = target.split('|')[0].split('#')[0].strip()
    if not target:
        return None
    if target.startswith(('http://', 'https://', 'file://')):
        return None

    # Direct path (with or without .md)
    if target.endswith('.md'):
        direct = Path(base) / target
        if direct.is_file():
            return os.path.relpath(direct, base)
    else:
        direct = Path(base) / target
        if direct.is_file():
            return os.path.relpath(direct, base)
        direct2 = Path(base) / (target + '.md')
        if direct2.is_file():
            return os.path.relpath(direct2, base)

    # Basename lookup
    bn = os.path.basename(target)
    if bn in basename_lower:
        return basename_lower[bn][0]
    if bn.lower() in basename_lower:
        return basename_lower[bn.lower()][0]
    # Normalized (space<->dash)
    norm = bn.replace('-', ' ').lower()
    if norm in basename_norm:
        return basename_norm[norm][0]
    # Alias lookup
    if bn.lower() in alias_to_file:
        return alias_to_file[bn.lower()]
    if norm in alias_to_file:
        return alias_to_file[norm]
    return None


def classify_target(target):
    """Classify a broken target string into a category."""
    t = target.strip()
    if not t:
        return 'empty'
    if t.startswith(('http://', 'https://', 'file://')):
        return 'external'
    # _concepts/X but file doesn't exist
    if t.startswith('_concepts/'):
        return 'missing_concept'
    # _meta/_synthesis-X (wrong prefix from old structure)
    if t.startswith('_meta/_synthesis-') or t.startswith('_meta/cheatsheet-'):
        return 'stale_path'
    # _meta/X stale (synthesis was moved to _synthesis/)
    if t.startswith('_meta/') and ('synthesis' in t.lower() or 'cheatsheet' in t.lower()):
        return 'stale_path'
    # Chapter directory reference (Obsidian shows dir listing — usually intentional)
    if re.match(r'^\d{2}_[A-Za-z_]+$', t) or re.match(r'^\d{2}_[A-Za-z_]+/$', t):
        return 'dir_reference'
    # 90_Learn, 91_Notes, etc. (resource layers)
    if re.match(r'^\d{2}_[A-Za-z_]+$', os.path.basename(t)):
        return 'dir_reference'
    # _synthesis/X but file doesn't exist
    if t.startswith('_synthesis/'):
        return 'missing_synthesis'
    # _references/X
    if t.startswith('_references/'):
        return 'missing_reference'
    # X/ subdir exists but file inside doesn't
    if '/' in t:
        return 'missing_file'
    # Bare word like [[arxiv]] or [[大模型安全权威指南]] (tag-like)
    return 'missing_file'


def strip_code_blocks(content):
    """Remove fenced code blocks so links inside them aren't checked."""
    lines = content.split('\n')
    result = []
    in_block = False
    fence_len = 0
    for line in lines:
        stripped = line.lstrip()
        if not in_block:
            m = re.match(r'`{3,}', stripped)
            if m:
                in_block = True
                fence_len = len(m.group(0))
            else:
                result.append(line)
        else:
            m = re.match(r'`{3,}', stripped)
            if m and len(m.group(0)) >= fence_len:
                in_block = False
                fence_len = 0
    content = '\n'.join(result)
    # Remove inline `...` backtick content
    content = re.sub(r'`[^`\n]+`', '', content)
    return content


def find_all_links(base, strict=False):
    """Walk content files, find all wikilinks and md-style internal links, classify broken ones."""
    basename_lower, basename_norm, alias_to_file = build_resolution_index(base)
    content_files = walk_content(base)

    total_wikilinks = 0
    total_mdlinks = 0
    broken = []  # list of dicts
    by_source = collections.Counter()
    by_category = collections.Counter()

    for f in content_files:
        try:
            raw_content = open(f, 'r', encoding='utf-8', errors='ignore').read()
        except Exception:
            continue
        content = strip_code_blocks(raw_content)
        rel = os.path.relpath(f, base)

        # Find wikilinks
        for m in re.finditer(r'\[\[([^\]]+)\]\]', content):
            target = m.group(1).split('|')[0].split('#')[0].strip()
            if not target or target.startswith(('http://', 'https://', 'file://')):
                continue
            total_wikilinks += 1
            resolved = resolve_obsidian(target, base, basename_lower, basename_norm, alias_to_file)
            if resolved is None:
                # If not strict, skip dir-level references
                cat = classify_target(target)
                if cat == 'dir_reference' and not strict:
                    continue
                broken.append({
                    'source': rel,
                    'link_type': 'wikilink',
                    'target': target,
                    'category': cat,
                })
                by_source[rel] += 1
                by_category[cat] += 1

        # Find md-style links (only .md internal)
        for m in re.finditer(r'\[([^\]]*)\]\(([^)]+)\)', content):
            link_text = m.group(1)
            link_path = m.group(2).strip()
            if link_path.startswith(('http://', 'https://', 'mailto:', '#', 'ftp://')):
                continue
            if not link_path.endswith('.md'):
                continue
            total_mdlinks += 1
            # Resolve: if absolute (no ../ or ./), check against base; else relative to source file
            if link_path.startswith('./') or link_path.startswith('../'):
                target_full = Path(os.path.normpath(os.path.join(os.path.dirname(f), link_path)))
            else:
                target_full = Path(base) / link_path
            if not target_full.is_file():
                broken.append({
                    'source': rel,
                    'link_type': 'markdown',
                    'target': link_path,
                    'category': classify_target(link_path),
                })
                by_source[rel] += 1
                by_category[classify_target(link_path)] += 1

    return {
        'total_wikilinks': total_wikilinks,
        'total_mdlinks_internal': total_mdlinks,
        'total_broken': len(broken),
        'broken_by_category': dict(by_category),
        'broken_by_source_top': by_source.most_common(20),
        'broken_list': broken,
    }


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Wiki link checker with classified output')
    parser.add_argument('base_dir', nargs='?', default='.', help='Project root')
    parser.add_argument('--json', metavar='FILE', help='Write JSON report to FILE')
    parser.add_argument('--strict', action='store_true', help='Also flag dir-level wikilinks')
    args = parser.parse_args()

    base = os.path.abspath(args.base_dir)
    report = find_all_links(base, strict=args.strict)

    print(f'Wiki Link Check — {base}')
    print(f'  Total wikilinks: {report["total_wikilinks"]}')
    print(f'  Internal md links: {report["total_mdlinks_internal"]}')
    print(f'  Broken: {report["total_broken"]}')
    print()
    print('  By category:')
    for cat, n in sorted(report['broken_by_category'].items(), key=lambda x: -x[1]):
        print(f'    {cat:25s} {n:>5}')
    print()
    print('  Top 20 files with broken links:')
    for f, n in report['broken_by_source_top']:
        print(f'    {n:>4}  {f}')

    if args.json:
        with open(args.json, 'w') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f'\nJSON report written to {args.json}')


if __name__ == '__main__':
    main()