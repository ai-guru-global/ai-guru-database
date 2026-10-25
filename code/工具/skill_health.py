#!/usr/bin/env python3
"""Skill health check for .claude/skills/ and .qoder/skills/.

Usage:
    python3 工具/skill_health.py [--json out.json] [--dirs d1 d2 ...]

Checks (6 dimensions, adapted from skills-up's evaluation framework):
1. structure   — dir name is kebab-case, SKILL.md exists
2. metadata    — frontmatter parseable, name == dir, name format,
                 description 1-1024 chars, tags present
3. body        — non-empty body, <= 500 lines (progressive disclosure),
                 no TODO/TBD placeholders
4. resources   — references/scripts/assets paths cited in body exist
5. duplication — description token overlap (Jaccard) between skills
6. rollup      — per-skill score/rating + per-dimension pass rates

Exit code: 0 = no failures, 1 = warnings only, 2 = failures present.

Python 3 stdlib only (PyYAML optional — used when available).
"""
import os
import re
import sys
import json
from pathlib import Path

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

DEFAULT_DIRS = ['.claude/skills', '.qoder/skills']

BODY_LINE_LIMIT = 500            # progressive-disclosure guidance
DESC_MIN, DESC_MAX = 1, 1024     # Agent Skills spec
DUP_THRESHOLD = 0.55             # description Jaccard overlap -> warn

STOPWORDS = {
    'the', 'a', 'an', 'and', 'or', 'of', 'to', 'for', 'in', 'on', 'with',
    'use', 'when', 'user', 'users', 'wants', 'need', 'needs', 'using', 'skill',
    'skills', 'this', 'that', 'from', 'by', 'at', 'as', 'is', 'are', 'be',
    'it', 'its', 'their', 'your', 'you', 'will', 'can', 'may', 'also', 'any',
}

RESOURCE_DIRS = ('references', 'scripts', 'assets')
RESOURCE_RE = re.compile(
    r'(?<!\w)(?:\$[\w.]+\/)?(?:references|scripts|assets)'
    r'/[A-Za-z0-9_./\-]+'
)

# Example-only filenames commonly used in doc samples — not real resources.
EXAMPLE_STEMS = {'foo', 'paper-x', 'old-paper', 'example', 'sample',
                 'lorem', 'placeholder', 'demo', 'new-page', 'bar'}

# Conditional/optional citations ("if it exists", "If ... exists in the
# vault") refer to user-supplied config, not skill-owned resources.
OPTIONAL_HINTS = ('if it exists', 'if present', 'optional',
                  'may define', 'may exist', 'if exists')

# Skill families whose high description overlap is intentional (see
# wiki-history-ingest/SKILL.md "Design Decision").
FAMILY_SUFFIXES = ('-history-ingest',)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def kebab_case(name):
    return bool(re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', name))


def split_frontmatter(content):
    """Return (frontmatter_block, body) or (None, content)."""
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not m:
        return None, content
    return m.group(1), content[m.end():]


def _load_yaml():
    try:
        import yaml
        return yaml
    except ImportError:
        return None


def parse_frontmatter(block):
    """Best-effort frontmatter dict. Uses PyYAML when available."""
    yaml = _load_yaml()
    if yaml:
        try:
            data = yaml.safe_load(block) or {}
            if isinstance(data, dict):
                return data
        except Exception:
            pass
    # regex fallback for scalar fields
    data = {}
    for key in ('name', 'description', 'tags'):
        m = re.search(rf'^{key}\s*:\s*(.*)$', block, re.MULTILINE)
        if m:
            val = m.group(1).strip()
            if key == 'tags':
                # inline array [a, b] -> join for length/emptiness checks
                data[key] = [t.strip().strip('"\'') for t in val.strip('[]').split(',')] if val not in ('', '[]') else []
            else:
                data[key] = val
    return data


def count_lines(text):
    return len(text.splitlines()) if text else 0


def strip_examples(body):
    """Remove fenced code blocks and table rows (example-only zones)."""
    body = re.sub(r'```.*?```', '', body, flags=re.DOTALL)
    lines = [ln for ln in body.splitlines()
             if not ln.lstrip().startswith('|')]
    return '\n'.join(lines)


def resource_candidates(body):
    """Yield (path, raw_match) cited in body, resolved style preserved.

    Skips: $VAR/ runtime paths, extension-less wikilink refs, example-only
    filenames, optional/conditional citations ("if it exists"), and anything
    inside fenced blocks / table rows.
    """
    body = strip_examples(body)
    for m in RESOURCE_RE.finditer(body):
        raw = m.group(0)
        if raw.startswith(('http://', 'https://', '$')):
            continue
        if '$/' in raw:  # $OBSIDIAN_WIKI_REPO/scripts/... runtime path
            continue
        base = os.path.basename(raw)
        if '.' not in base:  # [[references/attention-is-all-you-need]] style
            continue
        stem = base.split('.')[0]
        if stem in EXAMPLE_STEMS:
            continue
        line = _containing_line(body, m.start(), m.end()).lower()
        if line.lstrip().startswith('if ') or any(
                h in line for h in OPTIONAL_HINTS):
            continue
        yield raw


def _containing_line(text, start, end):
    line_start = text.rfind('\n', 0, start) + 1
    line_end = text.find('\n', end)
    if line_end == -1:
        line_end = len(text)
    return text[line_start:line_end]


def tokenize(text):
    """English words (lowercased, stopwords dropped) + CJK bigrams."""
    tokens = set()
    for w in re.findall(r'[a-z0-9]+', text.lower()):
        if w not in STOPWORDS and len(w) > 1:
            tokens.add(w)
    for cjk in re.findall(r'[\u4e00-\u9fff]{2,}', text):
        for i in range(len(cjk) - 1):
            tokens.add(cjk[i:i + 2])
    return tokens


def jaccard(a, b):
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)

# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------


def check_skill(skill_dir):
    """Run per-skill checks. Returns (findings, meta)."""
    d = Path(skill_dir)
    findings = []  # (level, code, message)  level: PASS/WARN/FAIL
    meta = {'dir': str(d), 'name': d.name, 'has_skill_md': False,
            'body_lines': 0, 'desc_len': 0, 'has_tags': False}

    # ---- dimension 1: structure ----
    if not kebab_case(d.name):
        findings.append(('FAIL', 's1', f'dir name "{d.name}" not kebab-case'))
    else:
        findings.append(('PASS', 's1', 'dir name kebab-case'))

    skill_md = d / 'SKILL.md'
    if not skill_md.exists():
        findings.append(('FAIL', 's2', 'SKILL.md missing'))
        return findings, meta
    meta['has_skill_md'] = True
    findings.append(('PASS', 's2', 'SKILL.md exists'))

    content = skill_md.read_text(encoding='utf-8', errors='replace')
    block, body = split_frontmatter(content)

    # ---- dimension 2: metadata ----
    if block is None:
        findings.append(('FAIL', 'm1', 'missing YAML frontmatter'))
        return findings, meta
    findings.append(('PASS', 'm1', 'frontmatter present'))
    meta['has_fm'] = True

    fm = parse_frontmatter(block)
    meta['frontmatter'] = fm

    if 'name' in fm and isinstance(fm.get('name'), str):
        findings.append(('PASS', 'm2', 'frontmatter parseable'))
        name = fm['name']
        if name != d.name:
            findings.append(('FAIL', 'm3',
                             f'name "{name}" != dir name "{d.name}"'))
        else:
            findings.append(('PASS', 'm3', 'name matches dir'))
        if not (re.fullmatch(r'[a-z0-9-]{1,64}', name)):
            findings.append(('FAIL', 'm4',
                             f'name "{name}" not [a-z0-9-] 1-64 chars'))
        else:
            findings.append(('PASS', 'm4', 'name format ok'))
    else:
        findings.append(('FAIL', 'm2', 'frontmatter missing/unparseable name'))
        findings.append(('FAIL', 'm3', 'no name to compare with dir'))
        findings.append(('FAIL', 'm4', 'no name to validate'))

    desc = fm.get('description', '')
    desc_len = len(desc) if isinstance(desc, str) else 0
    meta['desc_len'] = desc_len
    if not (DESC_MIN <= desc_len <= DESC_MAX):
        findings.append(('FAIL', 'm5',
                         f'description length {desc_len} outside '
                         f'[{DESC_MIN}, {DESC_MAX}]'))
    else:
        findings.append(('PASS', 'm5', f'description {desc_len} chars'))

    tags = fm.get('tags', [])
    has_tags = isinstance(tags, (list, tuple)) and len(tags) > 0
    meta['has_tags'] = has_tags
    if has_tags:
        findings.append(('PASS', 'm6', f'tags: {", ".join(tags[:4])}'))
    else:
        findings.append(('FAIL', 'm6', 'tags missing or empty'))

    # ---- dimension 3: body ----
    body_lines = count_lines(body)
    meta['body_lines'] = body_lines
    if body_lines == 0:
        findings.append(('FAIL', 'b1', 'empty body'))
    else:
        findings.append(('PASS', 'b1', f'body {body_lines} lines'))
    if body_lines > BODY_LINE_LIMIT:
        findings.append(('WARN', 'b2',
                         f'body {body_lines} > {BODY_LINE_LIMIT} lines '
                         '(progressive disclosure: consider splitting)'))
    else:
        findings.append(('PASS', 'b2', 'body within line budget'))
    if re.search(r'(?<!<)\b(TODO|TBD|FIXME)\b(?!>)|lorem ipsum',
                 body, re.IGNORECASE):
        findings.append(('WARN', 'b3', 'TODO/TBD/placeholder residue found'))
    else:
        findings.append(('PASS', 'b3', 'no placeholder residue'))

    # ---- dimension 4: resources ----
    missing = []
    cited = set()
    for raw in resource_candidates(body):
        cited.add(raw)
        target = (d / raw)
        if not target.exists():
            missing.append(raw)
    if missing:
        for raw in sorted(missing):
            findings.append(('FAIL', 'r1',
                             f'cited resource missing: {raw}'))
    else:
        if cited:
            findings.append(('PASS', 'r1',
                             f'all {len(cited)} cited resources exist'))
        else:
            findings.append(('PASS', 'r1', 'no resource citations'))
    meta['resources'] = sorted(cited)

    return findings, meta


def _family(name):
    for suf in FAMILY_SUFFIXES:
        if name.endswith(suf):
            return suf
    return None


def dup_scan(skills):
    """Dimension 5: description overlap between skills (WARN-level).

    Pairs inside the same intentional family (e.g. *-history-ingest) are
    reported separately and do not count as duplication issues.
    """
    pairs = []
    family_pairs = []
    items = [(s['dir'], s.get('frontmatter', {}).get('description', ''),
              s.get('desc_len', 0)) for s in skills if s.get('desc_len')]
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            a, b = items[i][1], items[j][1]
            score = jaccard(tokenize(a), tokenize(b))
            if score < DUP_THRESHOLD:
                continue
            fa = _family(os.path.basename(items[i][0]))
            fb = _family(os.path.basename(items[j][0]))
            if fa and fa == fb:
                family_pairs.append((items[i][0], items[j][0], score))
            else:
                pairs.append((items[i][0], items[j][0], score))
    return sorted(pairs, key=lambda p: -p[2]), \
        sorted(family_pairs, key=lambda p: -p[2])

# ---------------------------------------------------------------------------
# Reporting
# ---------------------------------------------------------------------------


def rating(score):
    if score >= 0.999:
        return 'HEALTHY'
    if score >= 0.8:
        return 'ATTENTION'
    return 'BROKEN'


def main():
    argv = sys.argv[1:]
    json_out = None
    dirs = DEFAULT_DIRS
    i = 0
    while i < len(argv):
        if argv[i] == '--json' and i + 1 < len(argv):
            json_out = argv[i + 1]
            i += 2
        elif argv[i] == '--dirs' and i + 1 < len(argv):
            dirs = argv[i + 1].split(',')
            i += 2
        else:
            sys.exit(f'Usage: python3 工具/skill_health.py [--json out.json]'
                     f' [--dirs d1,d2]')
    base = Path.cwd()
    skill_dirs = []
    for d in dirs:
        root = base / d
        if not root.is_dir():
            print(f'[skip] directory not found: {d}')
            continue
        skill_dirs.extend(
            str(p) for p in sorted(root.iterdir())
            if p.is_dir() and not p.name.startswith('.')
        )

    print(f'Scanning {len(skill_dirs)} skill directories...\n')

    all_findings = {}
    meta_list = []
    for sd in skill_dirs:
        findings, meta = check_skill(sd)
        all_findings[sd] = findings
        meta_list.append(meta)

    # dimension counters
    dim_code = {'s1', 's2', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6',
                'b1', 'b2', 'b3', 'r1'}

    # ---- per-skill report ----
    print('=' * 70)
    print('1. PER-SKILL HEALTH')
    print('=' * 70)
    scores = {}
    fail_total = warn_total = 0
    for sd in skill_dirs:
        findings = all_findings[sd]
        n_fail = sum(1 for lv, _, _ in findings if lv == 'FAIL')
        n_warn = sum(1 for lv, _, _ in findings if lv == 'WARN')
        total = len(findings)
        score = (total - n_fail) / total if total else 0.0
        scores[sd] = score
        fail_total += n_fail
        warn_total += n_warn
        rel = os.path.relpath(sd, base)
        print(f'\n[{rating(score)}] {rel}  (score {score:.0%}, '
              f'{n_fail} FAIL / {n_warn} WARN)')
        for lv, code, msg in findings:
            mark = {'PASS': '  ok', 'WARN': ' warn', 'FAIL': 'FAIL'}[lv]
            print(f'  {mark} [{code}] {msg}')

    # ---- dimension rollup ----
    print('\n' + '=' * 70)
    print('2. DIMENSION PASS RATES (6-dim framework)')
    print('=' * 70)
    dim_pass = {}
    for code in sorted(dim_code):
        total = passed = 0
        for sd in skill_dirs:
            for lv, c, _ in all_findings[sd]:
                if c == code:
                    total += 1
                    if lv != 'FAIL':
                        passed += 1
        dim_pass[code] = (passed, total)
        rate = passed / total if total else 1.0
        flag = 'ok' if rate == 1.0 else '<<'
        print(f'  {code}: {passed}/{total} pass ({rate:.0%}) {flag}')

    # ---- duplication ----
    print('\n' + '=' * 70)
    print('3. POTENTIAL DUPLICATES (description overlap >= %.2f)' % DUP_THRESHOLD)
    print('=' * 70)
    dup_pairs, family_pairs = dup_scan(meta_list)
    if not dup_pairs:
        print('  none found — descriptions are distinct')
    for a, b, score in dup_pairs:
        print(f'  {os.path.relpath(a, base)}  <->  '
              f'{os.path.relpath(b, base)}  (Jaccard {score:.2f})')
    if family_pairs:
        print(f'\n  (intentional family pairs — same *{FAMILY_SUFFIXES[0]} '
              f'family, separated by design: {len(family_pairs)})')

    # ---- summary ----
    healthy = sum(1 for s in scores.values() if s >= 0.999)
    attention = sum(1 for s in scores.values() if 0.8 <= s < 0.999)
    broken = sum(1 for s in scores.values() if s < 0.8)
    print('\n' + '=' * 70)
    print('4. SUMMARY')
    print('=' * 70)
    print(f'  skills scanned : {len(skill_dirs)}')
    print(f'  HEALTHY        : {healthy}')
    print(f'  ATTENTION      : {attention}')
    print(f'  BROKEN         : {broken}')
    print(f'  failures       : {fail_total}')
    print(f'  warnings       : {warn_total}')

    if json_out:
        payload = {
            'scanned': len(skill_dirs),
            'healthy': healthy,
            'attention': attention,
            'broken': broken,
            'failures': fail_total,
            'warnings': warn_total,
            'dimensions': dim_pass,
            'duplicates': [{'a': a, 'b': b, 'jaccard': round(s, 3)}
                           for a, b, s in dup_pairs],
            'intentional_families': [
                {'a': a, 'b': b, 'jaccard': round(s, 3)}
                for a, b, s in family_pairs],
            'skills': {
                os.path.relpath(sd, base): {
                    'score': round(scores[sd], 3),
                    'rating': rating(scores[sd]),
                    'findings': [{'level': lv, 'code': c, 'msg': m}
                                 for lv, c, m in all_findings[sd]],
                }
                for sd in skill_dirs
            },
        }
        with open(json_out, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        print(f'\n  JSON report written to {json_out}')

    if broken or fail_total:
        return 2
    if attention or warn_total or dup_pairs:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
