#!/usr/bin/env python3
"""Wiki health check: orphan pages, tier distribution, backlink density.

Outputs:
1. Orphan pages (no incoming wikilinks or md-links)
2. Tier distribution across corpus-relevant directories
3. Backlink density for core pages
4. Pages missing frontmatter tier
"""
import os, re, sys, collections, json
from pathlib import Path

EXCLUDE_DIRS = {'.git', '.venv', 'node_modules', '.claude', '.qoder', '.qwen',
                '.comate', '.crush', '.pytest_cache', '__pycache__', 'Web',
                '.obsidian', '.github', 'dist', 'site', '_raw'}

CORPUS_DIRS = ['12_Architecture_Infrastructure', '13_AI_Ops', '07_Model_Training',
               '10_Deployment_Inference', '11_MLOps_Pipeline', '14_RAG_Systems',
               '15_Agent_Production', '_concepts', '_synthesis',
               '_projects/Cloud_Ops_Agent']

def walk_md(base):
    files = []
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith('.')]
        for f in filenames:
            if f.endswith('.md'):
                files.append(os.path.join(dirpath, f))
    return files

def extract_links(content):
    """Extract all link targets (wikilinks + md-links) as basenames."""
    targets = set()
    for m in re.finditer(r'\[\[([^\]]+)\]\]', content):
        t = m.group(1).split('|')[0].split('#')[0].strip()
        if not t.startswith('http'):
            targets.add(t)
    for m in re.finditer(r'\[([^\]]*)\]\(([^)]+)\)', content):
        path = m.group(2).strip()
        if path.startswith(('http','mailto','#','ftp')):
            continue
        targets.add(path)
    return targets

def parse_frontmatter(content):
    """Extract tier, tags, aliases from frontmatter."""
    fm = {}
    m = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return fm
    block = m.group(1)
    tier_m = re.search(r'^tier\s*:\s*"?(\w+)"?\s*$', block, re.MULTILINE)
    if tier_m:
        fm['tier'] = tier_m.group(1)
    return fm

def main():
    base = sys.argv[1] if len(sys.argv) > 1 else '.'
    files = walk_md(base)
    print(f"Scanning {len(files)} markdown files...\n")

    # Build basename -> filepath index
    basename_index = collections.defaultdict(list)
    for f in files:
        rel = os.path.relpath(f, base)
        bn = os.path.basename(f).replace('.md','')
        basename_index[bn].append(rel)

    # Build incoming links map
    incoming = collections.defaultdict(set)  # target_stem -> set of source files
    all_stems = set()
    for f in files:
        rel = os.path.relpath(f, base)
        try:
            content = open(f, 'r', encoding='utf-8', errors='ignore').read()
        except:
            continue
        links = extract_links(content)
        for link in links:
            # Resolve to stem
            stem = os.path.basename(link).replace('.md','').split('#')[0]
            if stem:
                incoming[stem].add(rel)
                all_stems.add(stem)

    # 1. Orphan detection (in corpus dirs only)
    print("=" * 70)
    print("1. ORPHAN PAGES (no incoming links) — corpus dirs only")
    print("=" * 70)
    orphans = []
    for f in files:
        rel = os.path.relpath(f, base)
        if not any(d in rel for d in CORPUS_DIRS):
            continue
        bn = os.path.basename(f).replace('.md','')
        if bn not in incoming or len(incoming[bn]) == 0:
            orphans.append(rel)
    print(f"Total orphans in corpus dirs: {len(orphans)}")
    # Sort by importance (concepts first, then runbooks, then others)
    orphans_sorted = sorted(orphans, key=lambda x: (
        0 if '_concepts/' in x else
        1 if 'SRE_Reliability' in x or 'Troubleshooting' in x else
        2 if 'Cloud_Ops' in x else
        3
    ))
    for o in orphans_sorted[:40]:
        bn = os.path.basename(o).replace('.md','')
        refs = len(incoming.get(bn, set()))
        print(f"  ORPHAN ({refs} refs): {o}")
    if len(orphans) > 40:
        print(f"  ... and {len(orphans)-40} more")

    # 2. Tier distribution
    print("\n" + "=" * 70)
    print("2. TIER DISTRIBUTION — corpus dirs")
    print("=" * 70)
    tier_counts = collections.Counter()
    no_tier = []
    corpus_files = [f for f in files if any(d in os.path.relpath(f, base) for d in CORPUS_DIRS)]
    for f in corpus_files:
        rel = os.path.relpath(f, base)
        try:
            content = open(f, 'r', encoding='utf-8', errors='ignore').read()
        except:
            continue
        fm = parse_frontmatter(content)
        tier = fm.get('tier', 'MISSING')
        tier_counts[tier] += 1
        if tier == 'MISSING':
            no_tier.append(rel)
    for tier, count in tier_counts.most_common():
        print(f"  {tier:15s}: {count:4d}")
    if no_tier:
        print(f"\n  Files missing tier ({len(no_tier)}):")
        for f in no_tier[:20]:
            print(f"    {f}")
        if len(no_tier) > 20:
            print(f"    ... and {len(no_tier)-20} more")

    # 3. Backlink density for key pages
    print("\n" + "=" * 70)
    print("3. BACKLINK DENSITY — key corpus hub pages")
    print("=" * 70)
    hubs = [
        'Kubernetes_Troubleshooting_Playbook',
        'Alibaba_Cloud_Proprietary_K8s_Context',
        'Kubernetes_Core_Components_Deep_Dive',
        'Kubernetes_Networking_Deep_Dive',
        'Kubernetes_Storage_Deep_Dive',
        'GPU_OOM_Troubleshooting_Guide',
        'LLM_Inference_Slow_Unavailable_Runbook',
        'HAMi_Deep_Dive',
        'LLM_Fine_Tuning_Job_Failure_Runbook_on_K8s',
        'Model_Hot_Reload_and_Rollback_Runbook',
        'K8s_AI_Troubleshooting_Cheat_Sheet',
    ]
    for hub in hubs:
        refs = incoming.get(hub, set())
        print(f"  {hub:55s}: {len(refs):3d} backlinks")

    # Save report
    report = {
        'orphan_count': len(orphans),
        'orphans': orphans_sorted,
        'tier_distribution': dict(tier_counts),
        'no_tier': no_tier,
    }
    with open('/tmp/wiki_health.json', 'w') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"\nFull report saved to /tmp/wiki_health.json")

if __name__ == '__main__':
    main()
