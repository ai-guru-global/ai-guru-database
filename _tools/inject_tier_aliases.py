#!/usr/bin/env python3
"""
Batch-inject `tier:` and `aliases:` fields into content files missing them.

Tier rules:
  - _concepts/* and _synthesis/* -> core
  - Deep_Dive / for_dummy / in-nutshell files or size > 10KB -> core
  - 2-10KB -> supporting
  - < 2KB -> peripheral
  - README.md / INDEX.md -> supporting

Aliases: derive from filename (kebab-case, snake_case, title-case variants).
"""
import os
import re
from pathlib import Path

ROOT = Path('.').resolve()

EXCLUDE_DIRS = {'.git', '.venv', 'node_modules', '.claude', '.qoder', '.qwen',
                '.comade', '.crush', '.pytest_cache', '__pycache__', 'Web',
                '.obsidian', '.github', 'dist', 'site'}


def walk_content():
    """Return list of content md files (excl _raw/_sources/_archives/_tools/_projects/_meta/docs)."""
    out = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith('.')]
        if any(seg in dirpath.split(os.sep) for seg in
               ('_raw', '_sources', '_archives', '_tools', '_projects', 'docs')):
            continue
        if '_meta' in dirpath.split(os.sep):
            continue
        for f in filenames:
            if f.endswith('.md'):
                out.append(os.path.join(dirpath, f))
    return out


def detect_tier(rel_path: str, size: int, filename: str) -> str:
    parts = rel_path.split(os.sep)
    # Knowledge graph layer: concepts & synthesis are core
    if parts[0] == '_concepts' or parts[0] == '_synthesis':
        return 'core'
    # High-quality indicators
    deep_patterns = ['Deep_Dive', 'for_dummy', 'in-nutshell', 'Complete_Guide',
                     'Production_Guide', 'Comprehensive']
    if any(p in filename for p in deep_patterns):
        return 'core'
    if size >= 10_000:
        return 'core'
    if filename in ('README.md', 'INDEX.md'):
        return 'supporting'
    if size < 2000:
        return 'peripheral'
    return 'supporting'


def derive_aliases(filename: str, title: str = None) -> list:
    """Generate 1-3 aliases from filename and title."""
    aliases = []
    base = filename[:-3] if filename.endswith('.md') else filename

    # Strip numeric prefix
    stripped = re.sub(r'^\d+-', '', base)

    # Title (case) variant
    title_case = ' '.join(w.capitalize() for w in stripped.replace('-', ' ').replace('_', ' ').split())
    if title_case and title_case != base:
        aliases.append(title_case)

    # Space-separated version (Obsidian style)
    space_version = stripped.replace('-', ' ').replace('_', ' ')
    if space_version != stripped and space_version not in aliases:
        aliases.append(space_version)

    # Original snake_case if file has underscores
    if '_' in stripped and stripped not in aliases:
        aliases.append(stripped)

    # Dedup and cap at 3
    seen = set()
    out = []
    for a in aliases:
        if a not in seen and a:
            seen.add(a)
            out.append(a)
    return out[:3]


def parse_frontmatter(content: str):
    """Return (header_dict, body_str, raw_header_str) or (None, full, '') if no FM."""
    if not content.lstrip().startswith('---'):
        return None, content, ''
    # Match header block
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n?(.*)', content, re.DOTALL)
    if not m:
        return None, content, ''
    header_text = m.group(1)
    body = m.group(2)
    return header_text, body, header_text


def has_field(header: str, field: str) -> bool:
    return bool(re.search(rf'^{re.escape(field)}\s*:', header, re.MULTILINE))


def inject_field(header: str, field: str, value_lines: list) -> str:
    """Insert a field at end of header (preserving ordering)."""
    return header.rstrip() + '\n' + ''.join(value_lines) + '\n'


def process_file(path: str) -> tuple:
    """Process a single file. Returns (added_tier, added_aliases, skipped_reason)."""
    rel = os.path.relpath(path, ROOT)
    try:
        content = open(path, 'r', encoding='utf-8', errors='ignore').read()
    except Exception as e:
        return False, False, f'read error: {e}'

    size = len(content)
    filename = os.path.basename(path)

    parsed = parse_frontmatter(content)
    if parsed[0] is None:
        return False, False, 'no frontmatter'

    header_text, body, _ = parsed

    added_tier = False
    added_aliases = False

    # Add tier if missing
    if not has_field(header_text, 'tier'):
        tier = detect_tier(rel, size, filename)
        header_text = inject_field(header_text, 'tier', [f'tier: {tier}\n'])
        added_tier = True

    # Add aliases if missing (skip READMEs and INDEXes)
    if filename not in ('README.md', 'INDEX.md') and not has_field(header_text, 'aliases'):
        # Extract title for smarter aliases
        title_m = re.search(r'^title\s*:\s*"?(.+?)"?\s*$', header_text, re.MULTILINE)
        title = title_m.group(1).strip('"') if title_m else None
        aliases = derive_aliases(filename, title)
        if aliases:
            # Build YAML list
            alias_lines = ['aliases:\n']
            for a in aliases:
                # Quote strings with spaces or special chars
                if any(c in a for c in ' :#&*!|>%@`'):
                    alias_lines.append(f'  - "{a}"\n')
                else:
                    alias_lines.append(f'  - {a}\n')
            header_text = inject_field(header_text, 'aliases', alias_lines)
            added_aliases = True

    if not (added_tier or added_aliases):
        return False, False, 'already complete'

    # Reconstruct file
    new_content = '---\n' + header_text + '---\n' + body
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return added_tier, added_aliases, 'updated'


def main():
    files = walk_content()
    print(f'Processing {len(files)} content files...')

    stats = {
        'tier_added': 0,
        'aliases_added': 0,
        'unchanged': 0,
        'skipped': 0,
        'errors': 0,
    }
    skip_reasons = {}

    for path in files:
        rel = os.path.relpath(path, ROOT)
        try:
            tier_added, aliases_added, reason = process_file(path)
            if tier_added:
                stats['tier_added'] += 1
            if aliases_added:
                stats['aliases_added'] += 1
            if reason == 'already complete':
                stats['unchanged'] += 1
            elif reason in ('no frontmatter',):
                stats['skipped'] += 1
                skip_reasons[reason] = skip_reasons.get(reason, 0) + 1
            elif 'error' in reason:
                stats['errors'] += 1
                skip_reasons[reason] = skip_reasons.get(reason, 0) + 1
        except Exception as e:
            stats['errors'] += 1
            skip_reasons[f'exception: {e}'] = skip_reasons.get(f'exception: {e}', 0) + 1

    print('\n=== Tier/Aliases Batch Injection Report ===')
    print(f'  Files processed:   {len(files)}')
    print(f'  tier: added:       {stats["tier_added"]}')
    print(f'  aliases: added:    {stats["aliases_added"]}')
    print(f'  unchanged:         {stats["unchanged"]}')
    print(f'  skipped:           {stats["skipped"]}')
    print(f'  errors:            {stats["errors"]}')
    if skip_reasons:
        print(f'  skip reasons:      {dict(skip_reasons)}')


if __name__ == '__main__':
    main()