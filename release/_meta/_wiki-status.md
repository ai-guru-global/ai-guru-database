---
title: Wiki Status Report
category: meta
tags: [meta, status, audit, health]
summary: Wiki 全库健康度审计报告，包含页面统计、链接健康、Token 用量和待办建议。
updated: 2026-06-05
---

# Wiki Status

生成时间: 2026-06-05

## Overview

- **Total wiki pages:** 865 across 30+ categories
- **Page visibility:** 865 public · 0 internal · 0 pii
- **Total sources ingested:** 0 (content-native vault, manifest empty)
- **Projects tracked:** 0
- **Last ingest:** N/A (all content authored directly)
- **Synthesis pages:** 21
- **Frontmatter coverage:** 100%

## Delta (what's changed since last ingest)

本仓库为 content-native wiki — 所有内容直接编写，非通过 wiki-ingest pipeline 导入。

### External sources available but not tracked:

| Source | Type | Count |
|---|---|---|
| ~/.claude/projects/*/*.jsonl | claude_conversation | 419 across 48 projects |
| ~/.codex/sessions/**/rollout-*.jsonl | codex_rollout | 5 |
| AI Stack 用户指南.pdf | document | 1 |

### Deleted sources (ingested but gone): 0

## Summary

- **Ready to ingest:** 425 external sources (419 Claude convos + 5 Codex rollouts + 1 PDF)
- **Wiki pages:** 865 content pages, all up to date
- **Recommendation:** Ingest selectively — most Claude/Codex history may be project-specific and low-value for this knowledge base

## Token Footprint (estimated)

| Scope | Pages | ~Tokens |
|---|---|---|
| core tier | 52 | 70,560 |
| supporting tier | 35 | 49,015 |
| peripheral tier | 0 | 0 |
| untagged (default supporting) | 778 | 3,023,041 |
| **Full wiki (all)** | **865** | **3,142,616** |

Index-only pass (frontmatter + summaries): ~34,600 tokens
Typical query (index + 5 full pages):      ~52,765 tokens

⚠️  Full wiki exceeds 100K tokens (threshold: 100,000). Consider:
  - Demoting peripheral pages — 778 pages lack `tier:` assignment; run `/wiki-status insights` for tier suggestions
  - Running /wiki-lint --consolidate to merge near-duplicates
  - Using wiki-query fast mode for most queries

_4 chars/token heuristic_

## What to Do Next

1. 🏷️  778 pages lack `tier:` assignment — run: /wiki-status insights
   Only 86 of 865 pages have explicit tier. Most vault tokens are in untagged pages.

2. 🧩  20 synthesis opportunities identified (last scan: 2026-06-04) → run: /wiki-synthesize
   Cross-domain pairs ≥3 co-occurrences: 85, uncovered: 20

3. 📥  425 external sources available but untracked → run: /wiki-history-ingest
   419 Claude conversations + 5 Codex rollouts + 1 PDF

4. 🔗  12 orphan pages (mostly meta files) → run: /cross-linker
   _insights, _wiki-status, _wiki-digest, log, hot, index, etc.

5. ✅  Wiki health: 100% — 0 broken links, 0 bad YAML, 0 content orphans

6. 🩺  Lint last run 2026-06-04 (1 day ago) — health 100%

## Detailed Metrics

| 指标 | 数值 |
|---|---|
| 总页面 | 865 |
| Frontmatter 覆盖率 | 865/865 (100%) |
| 有效 YAML | 865/865 |
| Wikilinks | 4,347 |
| Orphans | 12 (meta files only) |
| Broken links | 0 |
| 合成页面 | 21 |
| Core tier pages | 52 |
| Supporting tier pages | 35 |
| Peripheral tier pages | 0 |
| Untagged pages | 778 |

## Top Anchors

| 页面 | 入链 |
|---|---|
| 21_Interviews/AI_Data_Analyst/company_level_question_bank | 88 |
| 15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow | 73 |
| 21_Interviews/AI_Data_Analyst/question_bank | 72 |
| 21_Interviews/AI_Data_Analyst/interview_preparing | 72 |
| 21_Interviews/AI_Data_Analyst/interview_answers | 72 |
| 15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026 | 63 |
| 15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026 | 63 |
| 15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment | 61 |
| 19_Talks/Andrew_Ng/sayings | 43 |
| 19_Talks/Andrej_Karpathy/about | 43 |

## Category Distribution

| Category | Pages |
|---|---|
| 13_Agent_Production | 108 |
| 23_Interviews | 88 |
| concepts | 86 |
| 04_NLP_LLMs | 63 |
| 17_AI_Coding | 57 |
| 21_Talks | 46 |
| 02_Machine_Learning | 27 |
| 16_AI_Ops | 23 |
| 06_Reinforcement_Learning | 21 |
| 19_Ethics_Safety | 21 |
| synthesis | 21 |
| 01_Fundamentals | 21 |
| 11_RAG_Systems | 20 |
| 05_Computer_Vision | 20 |
| 18_Cloud_Ops_Agent | 19 |
| 22_Papers | 18 |
| 20_AI_Applications_Industry | 18 |
| 09_Deployment_Inference | 18 |
| 07_Model_Training | 18 |
| 03_Deep_Learning | 16 |
| 90_Learn | 15 |
| 12_Architecture_Infrastructure | 13 |
| 08_Model_Evaluation | 13 |
| 00_AI_Introduction | 13 |
| 15_Testing | 12 |
| 14_AI_Gateway | 11 |
| 10_MLOps_Pipeline | 11 |
| _meta/notes | 5 |
| 94_Visualization | 5 |
| 93_Templates | 7 |

_Last updated: 2026-06-05_
