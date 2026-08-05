# AI Guru Corpus — Release Packages

Production-ready corpus exports for AgentScope NAS mount (LLM-Wiki mode).

## Directory Structure

```
release/
├── scripts/
│   └── export.sh          # Production export wrapper
└── package/
    ├── 2026-07-02_1926/         # Latest production export
    │   ├── corpus_manifest.json # Machine-readable metadata
    │   ├── 索引.md             # Table of contents (2,193 pages)
    │   ├── hot.md               # High-traffic pages
    │   ├── README.md            # Agent-facing usage guide
    │   └── ...                  # Wiki pages by directory
    └── 2026-07-02_1926_legacy/  # Previous export (archived)
```

## Quick Start

```bash
# Full vault export (all 2,193 pages)
release/scripts/export.sh full

# Subset export (K8s/GPU/ops only, token-budget friendly)
release/scripts/export.sh subset

# Dry run (no files written)
release/scripts/export.sh full --dry-run
```

## Package Contents

Each package contains:
- **corpus_manifest.json** — page inventory, link stats, tier distribution
- **索引.md** — human-readable table of contents with wikilinks
- **hot.md** — top 20 most-referenced pages
- **README.md** — agent-facing instructions for LLM-Wiki consumption
- All wiki pages with unresolved `[[wikilinks]]` rewritten to plain text

## Link Resolution Guarantee

The export pipeline uses a double-pass verification:
1. First pass: rewrite unresolved wikilinks to display text
2. Second pass: force-rewrite any remaining broken links from disk
3. Final assertion: **zero unresolved wikilinks** in shipped corpus

## Agent Usage

Mount the package directory as NAS read-only. The agent entry point is:

```
_synthesis/diagnosis-work-order-hub.md
```

From there, follow `[[wikilinks]]` — all resolvable links point to real files, all unresolvable links have been converted to plain text.
