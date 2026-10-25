---

name: project-quality-assessment
tags: [quality-assurance, assessment, knowledge-base]
description: >
  Comprehensive quality assessment for knowledge base projects. Evaluates content completeness,
  identifies gaps, assesses documentation quality, and provides actionable improvement recommendations.
  Use when the user says "评估项目质量", "全面评估", "整体评估", "评估内容完整性", "全面梳理",
  "assess project quality", "evaluate completeness", "project health check", or wants a comprehensive
  review of their knowledge base. Produces a structured quality report with prioritized improvements.
---

# Project Quality Assessment

You are performing a comprehensive quality assessment of a knowledge base project. This skill standardizes the evaluation process across all database projects, producing consistent, actionable reports.

## Before You Start

1. **Identify the project root** — the current working directory or the path the user specifies
2. **Understand the project type** — is this a knowledge base wiki, a code project, a documentation site, or a hybrid?
3. **Check for existing quality markers** — look for `_project-evaluation.md`, `_content-gap-analysis.md`, `_lint-report.md`, or similar assessment files

## Step 1: Project Structure Analysis

### 1.1 Directory Inventory
```
Glob all directories and subdirectories
Count files per directory
Identify the organizational pattern (numbered folders, categories, flat structure)
```

### 1.2 File Type Distribution
```
Glob all files by extension
Count: .md, .py, .js, .json, .yml, .yaml, .txt, etc.
Identify: documentation vs code vs config vs data
```

### 1.3 Content Volume
```
For each major directory:
- Count total files
- Count total lines/words (for .md files)
- Identify: empty files, stub files (< 50 words), substantial files (> 500 words)
```

## Step 2: Content Quality Assessment

### 2.1 Documentation Completeness

For each category/topic area, evaluate:

| Dimension | Score (1-5) | Criteria |
|-----------|-------------|----------|
| **Coverage** | | Are all expected topics present? |
| **Depth** | | Are topics explained thoroughly or just mentioned? |
| **Structure** | | Are files well-organized with clear headings? |
| **Cross-references** | | Do files link to related content? |
| **Freshness** | | When was content last updated? |

### 2.2 Entry Point Assessment

Check for user-facing entry points:
- [ ] README.md at project root
- [ ] README.md in each major section
- [ ] README_for_dummy.md (beginner-friendly guides)
- [ ] index.md or equivalent navigation
- [ ] Table of contents in long documents

### 2.3 Content Depth Analysis

For each major section, categorize files:

| Category | Description | Action Needed |
|----------|-------------|---------------|
| **Deep Dive** | Comprehensive, 1000+ words, covers topic thoroughly | ✅ Good |
| **Overview** | Moderate depth, 300-1000 words | May need expansion |
| **Stub** | Brief mention, < 300 words | Needs development |
| **Missing** | Expected topic not present | Needs creation |

## Step 3: Gap Identification

### 3.1 Structural Gaps

Identify missing components:
- [ ] Beginner guides (for_dummy files)
- [ ] Deep dive articles for complex topics
- [ ] Comparison tables (tools, frameworks, approaches)
- [ ] Code examples and tutorials
- [ ] Architecture diagrams
- [ ] FAQ sections
- [ ] Glossary/terminology

### 3.2 Content Gaps

For each major section, list:
1. **Missing topics** — subjects that should be covered but aren't
2. **Shallow topics** — existing content that needs expansion
3. **Outdated content** — information that may be stale
4. **Broken references** — links to non-existent files or sections

### 3.3 Quality Gaps

Common quality issues:
- [ ] Inconsistent formatting across files
- [ ] Missing frontmatter (YAML headers)
- [ ] No provenance/source attribution
- [ ] Lack of cross-references between related topics
- [ ] No difficulty ratings or learning paths

## Step 4: Generate Quality Report

### Report Template

```markdown
# Project Quality Assessment — [PROJECT_NAME]

**Assessment Date:** [DATE]
**Project Path:** [PATH]
**Assessor:** [AGENT/USER]

---

## Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| Total Files | [N] | — |
| Documentation Files | [N] | — |
| Code Files | [N] | — |
| Total Word Count | [N] | — |
| Sections/Categories | [N] | — |
| Overall Quality Score | [X/5] | [🟢/🟡/🔴] |

**Key Findings:**
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Priority Actions:**
1. [Action 1]
2. [Action 2]
3. [Action 3]

---

## Detailed Assessment

### Section-by-Section Analysis

| Section | Files | Words | Coverage | Depth | Score |
|---------|-------|-------|----------|-------|-------|
| [Section 1] | [N] | [N] | [%] | [1-5] | [Score] |
| [Section 2] | [N] | [N] | [%] | [1-5] | [Score] |
| ... | ... | ... | ... | ... | ... |

### Content Inventory

#### Well-Covered Topics ✅
- [Topic 1] — [N] files, [N] words, comprehensive coverage
- [Topic 2] — [N] files, [N] words, good depth

#### Topics Needing Expansion ⚠️
- [Topic 1] — currently [N] words, recommend [N]+ words
- [Topic 2] — missing [specific subtopics]

#### Missing Topics ❌
- [Topic 1] — expected in [section], not found
- [Topic 2] — critical for [purpose], needs creation

---

## Improvement Recommendations

### Priority 1: Critical (Complete within 1 week)

| # | Action | Section | Effort | Impact |
|---|--------|---------|--------|--------|
| 1 | [Action] | [Section] | [Hours] | [High/Med/Low] |
| 2 | [Action] | [Section] | [Hours] | [High/Med/Low] |

### Priority 2: Important (Complete within 1 month)

| # | Action | Section | Effort | Impact |
|---|--------|---------|--------|--------|
| 1 | [Action] | [Section] | [Hours] | [High/Med/Low] |
| 2 | [Action] | [Section] | [Hours] | [High/Med/Low] |

### Priority 3: Enhancement (Ongoing)

| # | Action | Section | Effort | Impact |
|---|--------|---------|--------|--------|
| 1 | [Action] | [Section] | [Hours] | [High/Med/Low] |
| 2 | [Action] | [Section] | [Hours] | [High/Med/Low] |

---

## Quality Metrics Detail

### Documentation Coverage
- **README files:** [N] present / [N] expected
- **for_dummy guides:** [N] present / [N] expected
- **Deep dive articles:** [N] present / [N] expected

### Content Freshness
- **Updated within 30 days:** [N] files
- **Updated within 90 days:** [N] files
- **Older than 90 days:** [N] files ⚠️

### Cross-Reference Density
- **Internal links:** [N] total
- **Average links per file:** [N]
- **Orphan files (no incoming links):** [N] ⚠️

---

## Appendix: File Inventory

### By Section
[Detailed file listing per section]

### By Type
| Type | Count | Percentage |
|------|-------|------------|
| Documentation (.md) | [N] | [%] |
| Code (.py, .js, etc.) | [N] | [%] |
| Config (.yml, .json) | [N] | [%] |
| Other | [N] | [%] |

---

## Next Steps

1. **Immediate:** Address Priority 1 items
2. **Short-term:** Work through Priority 2 items
3. **Ongoing:** Maintain quality with regular assessments

**Recommended follow-up commands:**
- `/wiki-status` — check wiki-specific health metrics
- `/wiki-ingest` — ingest any pending source materials
- `/wiki-synthesize` — create cross-cutting synthesis pages

---

*Assessment completed at [TIMESTAMP]*
```

## Step 5: Save Assessment

1. **Write the report** to `_project-evaluation.md` at the project root (or `_quality-assessment.md` if evaluation file exists for other purposes)

2. **Update project metadata** — if the project has a `log.md` or similar, append:
   ```
   - [TIMESTAMP] QUALITY_ASSESSMENT files=N words=N sections=N score=X/5 gaps=N recommendations=N
   ```

3. **If the project uses hot.md**, update Recent Activity with the assessment summary

## Step 6: Follow-Up Actions

After delivering the report, offer to help with the highest-priority items:

```
Based on the assessment, I recommend starting with:

1. [Top priority action]
   → Shall I create/expand [specific file]?

2. [Second priority action]
   → I can generate [specific content] for this section.

3. [Third priority action]
   → Would you like me to [specific task]?
```

## Quality Scoring Guide

### 5/5 — Excellent
- Comprehensive coverage of all expected topics
- Deep, well-structured content
- Strong cross-referencing
- Regular updates
- Clear entry points for all skill levels

### 4/5 — Good
- Most topics covered adequately
- Good depth in key areas
- Some cross-references
- Reasonably current content
- Basic entry points present

### 3/5 — Adequate
- Core topics covered but shallow
- Missing some important areas
- Limited cross-referencing
- Some outdated content
- Entry points incomplete

### 2/5 — Needs Work
- Significant gaps in coverage
- Many stub or shallow files
- Poor cross-referencing
- Outdated content
- Missing entry points

### 1/5 — Critical
- Major sections missing
- Mostly stub files
- No cross-referencing
- Severely outdated
- No clear entry points

## Tips

- **Be specific in recommendations** — "Add for_dummy guide to 22_Papers" is better than "Improve documentation"
- **Prioritize by impact** — Focus on sections that serve the most users or are most referenced
- **Consider the audience** — Is this for beginners, experts, or both?
- **Check for existing patterns** — Look at well-documented sections as templates for improving others
- **Quantify when possible** — "Currently 150 words, recommend 800+ words" is more actionable than "Needs expansion"

## Common Improvement Patterns

Based on assessments across multiple projects:

1. **Add for_dummy guides** — Beginner-friendly entry points for each major section
2. **Create Deep Dive articles** — Comprehensive coverage for complex topics
3. **Add comparison tables** — Side-by-side comparisons of tools, frameworks, approaches
4. **Include code examples** — Practical, runnable examples for technical content
5. **Create learning paths** — Guided sequences for different skill levels
6. **Add architecture diagrams** — Visual representations of complex systems
7. **Cross-reference related content** — Link between related topics across sections
8. **Update outdated content** — Refresh information older than 90 days

## Integration with Other Skills

This assessment skill works well with:

- **wiki-status** — For wiki-specific health metrics and delta analysis
- **wiki-lint** — For identifying broken links and formatting issues
- **wiki-synthesize** — For discovering cross-cutting connections
- **data-ingest** — For processing new source materials identified as gaps

After completing an assessment, recommend the most relevant follow-up skill based on the findings.
