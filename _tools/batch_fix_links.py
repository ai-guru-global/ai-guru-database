#!/usr/bin/env python3
"""Batch-fix broken wikilinks and md-links by resolving path mismatches.

Strategy:
1. Build a basename -> actual_path index of all .md files
2. Parse the check_links JSON output for broken links
3. For each broken link, try to find the file by basename
4. If found, compute the correct relative path and patch the source file
5. Report what was fixed vs what remains truly missing
"""
import os, re, sys, json, collections
from pathlib import Path

BASE = Path(sys.argv[1] if len(sys.argv) > 1 else '.')

EXCLUDE_DIRS = {'.git', '.venv', 'node_modules', '.claude', '.qoder', '.qwen',
                '.comate', '.crush', '.pytest_cache', '__pycache__', 'Web',
                '.obsidian', '.github', 'dist', 'site', '_raw'}

def build_index(base):
    """Build basename -> list of actual paths."""
    index = collections.defaultdict(list)
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for f in filenames:
            if f.endswith('.md'):
                fp = os.path.relpath(os.path.join(dirpath, f), base)
                stem = f.replace('.md', '')
                index[stem].append(fp)
    return index

def load_broken(json_path):
    d = json.load(open(json_path))
    return d.get('broken_list', [])

def resolve_target(target, index):
    """Given a broken target, try to find the actual file."""
    # Clean up target
    t = target.strip().lstrip('./').lstrip('/')
    # Remove anchor
    t = t.split('#')[0].split('|')[0]
    if not t.endswith('.md'):
        stem = t
    else:
        stem = t.replace('.md', '')
    # Also handle paths like _concepts/foo
    if '/' in t:
        stem = os.path.basename(t).replace('.md', '')
    candidates = index.get(stem, [])
    return candidates

def compute_correct_link(source_file, actual_target, link_type='md'):
    """Compute the correct link from source to target."""
    src_dir = os.path.dirname(source_file)
    if link_type == 'wikilink':
        # Obsidian wikilinks can use just the basename or path without .md
        return None  # wikilinks usually work by basename in Obsidian
    else:
        # Relative path for md links
        rel = os.path.relpath(actual_target, src_dir)
        return rel

def extract_links(content):
    """Find all markdown links and wikilinks with their positions."""
    links = []
    # Markdown links: [text](path)  — but not images ![alt](path)
    for m in re.finditer(r'(?<!\!)\[([^\]]*)\]\(([^)]+)\)', content):
        text, target = m.group(1), m.group(2)
        if target.startswith('http'): continue
        links.append({
            'type': 'md',
            'full': m.group(0),
            'text': text,
            'target': target,
            'start': m.start(),
            'end': m.end(),
        })
    # Wikilinks: [[target]] or [[target|alias]]
    for m in re.finditer(r'\[\[([^\]]+)\]\]', content):
        inner = m.group(1)
        if '|' in inner:
            target, alias = inner.split('|', 1)
        else:
            target, alias = inner, ''
        if target.startswith('http'): continue
        links.append({
            'type': 'wikilink',
            'full': m.group(0),
            'target': target.strip(),
            'alias': alias.strip(),
            'start': m.start(),
            'end': m.end(),
        })
    return links

def main():
    base = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
    json_path = sys.argv[2] if len(sys.argv) > 2 else '/tmp/cl.json'
    dry_run = '--dry-run' in sys.argv

    print(f"Building file index from {base}...")
    index = build_index(base)
    print(f"  Indexed {sum(len(v) for v in index.values())} files, {len(index)} unique stems")

    broken = load_broken(json_path)
    print(f"Loading {len(broken)} broken links...")

    # Group broken links by source file
    by_source = collections.defaultdict(list)
    for b in broken:
        by_source[b.get('source', '')].append(b)

    total_fixed = 0
    total_remaining = 0
    fix_log = []

    for source, items in by_source.items():
        src_path = base / source
        if not src_path.exists():
            continue
        content = src_path.read_text(encoding='utf-8', errors='ignore')
        original = content
        fixes_in_file = 0

        for item in items:
            target = item.get('target', '')
            # Try to resolve
            candidates = resolve_target(target, index)
            if not candidates:
                total_remaining += 1
                continue

            # Pick the best candidate (prefer the one closest to original target path)
            target_clean = target.lstrip('./').lstrip('/').split('#')[0].split('|')[0]
            best = None
            for c in candidates:
                if c == target_clean:
                    best = c
                    break
            if not best:
                # Prefer candidate that shares the most path components
                target_parts = target_clean.replace('.md', '').split('/')
                best_score = -1
                for c in candidates:
                    c_parts = c.replace('.md', '').split('/')
                    score = sum(1 for a, b in zip(target_parts, c_parts) if a == b)
                    if score > best_score:
                        best_score = score
                        best = c
            if not best:
                total_remaining += 1
                continue

            # Now fix the link in content
            # Handle both [text](target) and [[target]] formats
            target_basename = os.path.basename(best).replace('.md', '')

            # Fix markdown links: [text](wrong_path) -> [text](correct_rel_path)
            src_dir = os.path.dirname(source)
            correct_rel = os.path.relpath(best, src_dir) if src_dir else best

            # Pattern: the target as it appears in the file
            # It could be relative (../foo/bar.md) or absolute-ish (12_.../foo.md)
            escaped_target = re.escape(target.split('#')[0].split('|')[0])
            # Fix markdown links
            pattern_md = re.compile(r'\]\((' + escaped_target + r')(#[^)]*)?\)')
            m = pattern_md.search(content)
            if m:
                anchor = m.group(2) or ''
                old_link = m.group(0)
                new_link = f']({correct_rel}{anchor})'
                content = content.replace(old_link, new_link, 1)
                fixes_in_file += 1
                fix_log.append(f"  MD FIX {source}: {target} -> {correct_rel}")
                continue

            # Fix wikilinks: [[wrong_path]] or [[wrong_path|alias]]
            escaped_wl = re.escape(target_basename)
            # Also try full path wikilinks
            pattern_wl_full = re.compile(r'\[\[(' + escaped_target + r')(\|[^]]*)?\]\]')
            m = pattern_wl_full.search(content)
            if m:
                alias = m.group(2) or ''
                old_link = m.group(0)
                # For wikilinks, use basename if unique, else full path without .md
                if len(candidates) == 1:
                    new_target = target_basename
                else:
                    new_target = best.replace('.md', '')
                new_link = f'[[{new_target}{alias}]]'
                content = content.replace(old_link, new_link, 1)
                fixes_in_file += 1
                fix_log.append(f"  WL FIX {source}: {target} -> {new_target}")
                continue

            # Couldn't find the link pattern in content (might be in a different format)
            total_remaining += 1

        if content != original:
            if not dry_run:
                src_path.write_text(content, encoding='utf-8')
            total_fixed += fixes_in_file

    print(f"\n{'DRY RUN: ' if dry_run else ''}Fixed {total_fixed} links")
    print(f"Remaining unresolved: {total_remaining}")

    if fix_log:
        print("\nSample fixes (first 30):")
        for line in fix_log[:30]:
            print(line)

if __name__ == '__main__':
    main()
