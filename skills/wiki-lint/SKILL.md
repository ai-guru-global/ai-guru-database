---

name: wiki-lint
tags: [wiki, lint, maintenance]
description: >
  Audit and maintain the health of the Obsidian wiki. Use this skill when the user wants to check their
  wiki for issues, find orphaned pages, detect contradictions, identify stale content, fix broken wikilinks,
  or perform general maintenance on their knowledge base. Also triggers on "clean up the wiki",
  "what needs fixing", "audit my notes", or "wiki health check". Add --consolidate to switch from
  report-only to act-and-report mode (the "dream cycle"): fixes broken links, adds missing cross-references
  for orphans, corrects lifecycle states, demotes stale peripheral pages, normalizes tag aliases, and adds
  contradiction callouts — all with a dry-run preview and explicit user confirmation before any writes.
---

# Wiki Lint — Health Audit

You are performing a health check on an Obsidian wiki. Your goal is to find and fix structural issues that degrade the wiki's value over time.

**Before scanning anything:** follow the Retrieval Primitives table in `llm-wiki/SKILL.md`. Prefer frontmatter-scoped greps and section-anchored reads over full-page reads. On a large vault, blindly reading every page to lint it is exactly what this framework is built to avoid.

## Before You Start

1. **Resolve config** — follow the Config Resolution Protocol in `llm-wiki/SKILL.md` (walk up CWD for `.env` → `~/.obsidian-wiki/config` → prompt setup). This gives `OBSIDIAN_VAULT_PATH`
2. Read `index.md` for the full page inventory
3. Read `log.md` for recent activity context

## Lint Checks

Run these 13 checks in order. **Load `references/lint-checks.md` for the full per-check rules**
(how to check + how to fix). Summary:

| # | Check | Detects | Fix direction |
|---|-------|---------|---------------|
| 1 | Orphaned Pages | pages with zero incoming wikilinks | add `[[wikilinks]]` from related pages |
| 2 | Broken Wikilinks | `[[targets]]` pointing to nonexistent pages | rename / create / remove link |
| 3 | Missing Frontmatter | pages missing title/category/tags/sources/created/updated | add fields with defaults |
| 3a | Missing Summary (soft) | no `summary:` or >200 chars | write 1-2 sentence summary |
| 4 | Stale Content | `updated` older than source mtime | re-ingest the page |
| 5 | Contradictions | conflicting claims across related pages | add "Open Questions" section |
| 6 | Index Consistency | `index.md` vs actual page inventory | regenerate index |
| 7 | Provenance Drift | inferred/ambiguous ratio vs thresholds | re-source or label as synthesis |
| 8 | Fragmented Tag Clusters | tag group cohesion < 0.15 (n≥5) | run `cross-linker` on the tag |
| 9 | Visibility Tag Consistency | untagged PII / pii-without-sources / taxonomy contamination | add tags, add sources, clean taxonomy |
| 10 | Misc Promotion Candidates | `misc/` pages with affinity ≥ 3 | promote into project references |
| 12 | Confidence & Lifecycle Schema | enum/range/staleness/supersession/drift | `--fix` only rewrites base_confidence drift |
| 13 | Typed Relationships Validity | invalid type / broken target / self-reference | correct or remove entry |
| 11 | Synthesis Gaps | concept pairs co-occurring ≥3 without synthesis page | run `/wiki-synthesize` |

Notes:
- Check 12 (`--check`/`--fix`): read the Confidence and Lifecycle section in `llm-wiki/SKILL.md` for the formula; `--fix` mutates **only** `base_confidence` on drift, never `lifecycle`.
- Check 13: `relationships:` is optional; allowed types are `extends, implements, contradicts, derived_from, uses, replaces, related_to`.

## Output Format

Report findings as a structured list:

```markdown
## Wiki Health Report

### Orphaned Pages (N found)
- `concepts/foo.md` — no incoming links

### Broken Wikilinks (N found)
- `entities/bar.md:15` — links to [[nonexistent-page]]

### Missing Frontmatter (N found)
- `skills/baz.md` — missing: tags, sources

### Stale Content (N found)
- `references/paper-x.md` — source modified 2024-03-10, page last updated 2024-01-05

### Contradictions (N found)
- `concepts/scaling.md` claims "X" but `synthesis/efficiency.md` claims "not X"

### Index Issues (N found)
- `concepts/new-page.md` exists on disk but not in index.md

### Missing Summary (N found — soft)
- `concepts/foo.md` — no `summary:` field
- `entities/bar.md` — summary exceeds 200 chars

### Provenance Issues (N found)
- `concepts/scaling.md` — AMBIGUOUS > 15%: 22% of claims are ambiguous (re-source or move to synthesis/)
- `entities/some-tool.md` — drift: frontmatter says inferred=0.10, recomputed=0.45
- `concepts/transformers.md` — hub page (31 incoming links) with INFERRED=28%: errors here propagate widely
- `synthesis/speculation.md` — unsourced synthesis: no `sources:` field, 55% inferred

### Fragmented Tag Clusters (N found)
- **#systems** — 7 pages, cohesion=0.06 ⚠️ — run cross-linker on this tag
- **#databases** — 5 pages, cohesion=0.10 ⚠️

### Visibility Issues (N found)
- `entities/user-records.md` — contains `email:` value pattern but no `visibility/pii` tag
- `concepts/auth-flow.md` — tagged `visibility/pii` but missing `sources:` frontmatter
- `治理/taxonomy.md` — contains `visibility/internal` entry (system tag must not be in taxonomy)

### Misc Promotion Candidates (N found)
Pages in misc/ that have ≥ 3 connections to a single project and are ready to be promoted:

| Page | Top Project | Affinity Score |
|---|---|---|
| `misc/web-martinfowler-articles-microservices.md` | `obsidian-wiki` | 4 |

### Typed Relationship Issues (N found)
- `concepts/foo.md` — relationships[1]: type "contradication" is not an allowed type
- `concepts/bar.md` — relationships[0]: target "[[skills/nonexistent]]" resolves to no page

### Synthesis Gaps (N found)
Concept pairs that co-occur frequently but have no synthesis page:

| Pair | Co-occurrence | Suggested Action |
|---|---|---|
| [[Caching]] × [[Consistency]] | 5 pages | Run `/wiki-synthesize` |
| [[Testing]] × [[Observability]] | 3 pages | Run `/wiki-synthesize` |
```

## After Linting

Append to `log.md`:
```
- [TIMESTAMP] LINT issues_found=N orphans=X broken_links=Y stale=Z contradictions=W prov_issues=P missing_summary=S fragmented_clusters=F visibility_issues=V promotion_candidates=C synthesis_gaps=G relationship_issues=R
```

Offer to fix issues automatically or let the user decide which to address.

---

## Consolidate Mode (`--consolidate`)

Triggered by `wiki-lint --consolidate`. Switches from report-only to **act-and-report** — the "dream cycle" that runs periodically so the wiki self-heals.

### Safety protocol

**Always run in dry-run first.** Before writing anything:

1. Run all 12 lint checks (Step 1–12 above).
2. Print the planned consolidation actions as a structured list (see Dry-Run Output below).
3. Ask the user: `"Apply these N changes? [yes / no / select]"`.
4. Only proceed with writes after explicit confirmation. If the user selects individual actions, apply only those.
5. Never merge pages — use `wiki-dedup` for that. Only link, promote, demote, and flag.

### Consolidation actions (in order, after confirmation)

#### Action 1: Fix broken wikilinks

For each broken `[[Target]]` found in Check 2:
- Search the vault for a page whose title or filename is the closest fuzzy match (use `Grep` across `index.md` titles)
- If a unique best match exists (edit distance ≤ 2 characters or same root word): rewrite the link. Note the rewrite: `[[Oringal]] → [[corrected-page]]`.
- If no match or ambiguous: convert to plain text (`~~[[Target]]~~` → `Target`) and add a comment `<!-- broken link: no match found -->`.
- Never create a new page just to satisfy a broken link.

#### Action 2: Add missing cross-references for orphans

For each orphan page found in Check 1 (zero incoming links):
- Grep the vault body text for mentions of the page's title or aliases (case-insensitive).
- For each mention found in another page, add a `[[wikilink]]` replacing the plain-text mention.
- Limit to 3 insertions per orphan — don't flood pages with links.
- This is scoped to orphans only (different from `cross-linker` which runs broadly).

#### Action 3: Correct lifecycle states

Apply these rules automatically (they don't require human judgment — they enforce the documented state machine):
- **Promote `draft` → `reviewed`:** pages where `lifecycle: draft` AND `created` > 30 days ago AND `base_confidence > 0.7`. Set `lifecycle: reviewed`, `lifecycle_changed: <today>`, `lifecycle_reason: "auto-promoted by wiki-lint --consolidate: age>30d, confidence>0.7"`.
- **Demote `verified` → `stale`:** NOT a state transition — `stale` is a computed overlay, not a lifecycle value. Instead: for verified pages where `is_stale = (today − updated) > 180 days`, add a callout at the top of the page body: `> ⚠️ **Stale**: This page was last updated <date>. Verify before relying on it.` Only add if the callout isn't already present.
- **Do not change `reviewed` → `verified` or any other transition** — those are human-only.

#### Action 4: Tier demotion

For pages with `tier: supporting` (or unset) that have 0 incoming links AND haven't been updated in 90+ days:
- Set `tier: peripheral`.
- Emit a list of demotions for the user to review.
- Do not demote `tier: core` pages automatically — those were manually set.

#### Action 5: Tag normalization

Read `治理/taxonomy.md` for the alias mapping (e.g., `ml → machine-learning`). For each page, replace known alias tags with their canonical form in the `tags:` frontmatter field. This is a subset of `tag-taxonomy`'s work — only alias fixes, no full audit.

#### Action 6: Contradiction callouts

For each pair of pages marked as contradicting each other (via `relationships: contradicts` in frontmatter, or flagged in Check 5):
- Check whether a `> ⚠️ Contradiction flagged with [[Other Page]]` callout already exists near the relevant claim.
- If not, add it at the end of the "Key Ideas" section (or before "Open Questions" if no "Key Ideas" section). Keep it concise — one line.
- Do not resolve the contradiction; only flag it visually.

### Action 7: Write consolidation report

After all actions, write a report to `synthesis/consolidation-<YYYY-MM-DD>.md`:

```markdown
---
title: Consolidation Report <YYYY-MM-DD>
category: synthesis
tags: [maintenance, consolidation]
sources: []
summary: Auto-generated consolidation report from wiki-lint --consolidate run on <date>.
lifecycle: draft
lifecycle_changed: <date>
tier: peripheral
created: <ISO timestamp>
updated: <ISO timestamp>
---

# Consolidation Report — <YYYY-MM-DD>

## Summary
- Broken links fixed: N
- Cross-references added: M
- Lifecycle states updated: K
- Tier demotions: D
- Tags normalized: T
- Contradiction callouts added: C

## Broken Link Fixes
- `concepts/foo.md:12` — [[OldTarget]] → [[correct-target]]
- `entities/bar.md:8` — [[Missing]] → `Missing` (no match found)

## Cross-References Added (orphan rescue)
- `concepts/baz.md` — now linked from: [[concepts/alpha]], [[skills/beta]]

## Lifecycle Updates
- `concepts/old-draft.md` — draft → reviewed (age 45d, confidence 0.74)
- `synthesis/stale-verified.md` — stale callout added (last updated 2025-10-01)

## Tier Demotions
- `concepts/unused-concept.md` — supporting → peripheral (0 links, 120 days stale)

## Tag Normalizations
- `entities/some-tool.md` — `ml` → `machine-learning`

## Contradiction Callouts
- `concepts/scaling.md` — flagged contradiction with [[synthesis/efficiency]]
```

### Dry-Run Output (shown before any writes)

```
wiki-lint --consolidate — Dry Run

Planned actions (N total):
[1] Fix broken link: concepts/foo.md:12 [[OldTarget]] → [[correct-target]]
[2] Add cross-ref: concepts/baz.md ← [[concepts/alpha]] (orphan rescue)
[3] Lifecycle: concepts/old-draft.md → reviewed (age 45d, confidence 0.74)
[4] Tier demotion: concepts/unused.md → peripheral (0 links, 112 days stale)
[5] Tag alias: entities/some-tool.md: ml → machine-learning
[6] Contradiction callout: concepts/scaling.md ↔ [[synthesis/efficiency]]

Apply these 6 changes? [yes / no / select by number]
```

### Log entry for consolidate mode

```
- [TIMESTAMP] LINT_CONSOLIDATE links_fixed=N orphans_rescued=M lifecycle_updates=K tier_demotions=D tag_fixes=T contradiction_callouts=C report=synthesis/consolidation-YYYY-MM-DD.md
```

## QMD Refresh After Vault Writes

QMD is a search index, not the source of truth. If `$QMD_WIKI_COLLECTION` is empty or unset, skip this step. Run it only after this skill has written or rewritten vault markdown. If QMD refresh fails, do not roll back the vault changes; report the QMD status separately.

Use `$QMD_CLI` if set; otherwise use `qmd`.

```bash
${QMD_CLI:-qmd} update
```

If the output says vectors are needed or embeddings may be stale, run:

```bash
${QMD_CLI:-qmd} embed
```

Verify the collection with either:

```bash
${QMD_CLI:-qmd} ls "$QMD_WIKI_COLLECTION"
```

or, when a specific page path is known:

```bash
${QMD_CLI:-qmd} get "qmd://$QMD_WIKI_COLLECTION/<page>.md" -l 5
```

Record one of:
- `QMD refreshed: update + embed + verified`
- `QMD refreshed: update only + verified`
- `QMD skipped: QMD_WIKI_COLLECTION unset`
- `QMD skipped: qmd CLI unavailable`
- `QMD failed: <short error summary>`