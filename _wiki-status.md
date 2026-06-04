---
title: Wiki Status Report
category: meta
tags: [meta, status, audit, health]
summary: Wiki 全库健康度审计报告，包含页面统计、链接健康、Token 用量和待办建议。
---

# Wiki Status

生成时间: 2026-06-01 13:42

## Overview

- **Total wiki pages:** 749
- **Page visibility:** 749 public · 0 internal · 0 pii
- **Total sources ingested:** 0 (content-native vault)
- **Projects tracked:** 0
- **Last full rebuild:** N/A
- **Staged writes pending:** 0

## Delta

### New sources: 0
### Modified sources: 0
### Deleted sources: 0

> 本仓库为 content-native wiki，无外部源追踪。

## Token Footprint (estimated)

| Scope | Pages | ~Tokens |
|---|---|---|
| core tier | 18 | 15,927 |
| supporting tier | 731 | 1,854,289 |
| peripheral tier | 0 | 0 |
| **Full wiki (all)** | **749** | **1,870,216** |

Index-only pass (frontmatter + summaries): ~24,129 tokens
Typical query (index + 5 full pages): ~36,609 tokens

⚠️  Full wiki exceeds 100K tokens. Consider:
  - Demoting peripheral pages
  - Running /wiki-lint --consolidate to merge near-duplicates
  - Using wiki-query fast mode for most queries

## What to Do Next

0. 🧩  20 synthesis opportunities identified → run: /wiki-synthesize

## Detailed Metrics

| 指标 | 数值 |
|---|---|
| 总页面 | 749 |
| Frontmatter 覆盖率 | 749/749 |
| 有效 YAML | 749/749 |
| Wikilinks | 3485 |
| Orphans | 4 |
| Broken links | 0 |
| 合成页面 | 12 |
| 唯一标签 | 414 |

## Orphan List

```
  .github/ISSUE_TEMPLATE/bug_report.md
  .github/ISSUE_TEMPLATE/documentation.md
  .github/ISSUE_TEMPLATE/feature_request.md
  .github/ISSUE_TEMPLATE/knowledge_gap.md
```

## Top Anchors

| 页面 | 入链 |
|---|---|
| 23_Interviews/AI_Data_Analyst/company_level_question_bank | 86 |
| 13_Agent_Production/16_Agent_Evaluation/Assessment/Evaluation_Workflow | 71 |
| 23_Interviews/AI_Data_Analyst/interview_answers | 70 |
| 23_Interviews/AI_Data_Analyst/interview_preparing | 70 |
| 23_Interviews/AI_Data_Analyst/question_bank | 70 |
| 13_Agent_Production/16_Agent_Evaluation/Agent_Harness_Complete_2026 | 61 |
| 13_Agent_Production/16_Agent_Evaluation/Agent_Red_Teaming_2026 | 61 |
| 13_Agent_Production/16_Agent_Evaluation/Assessment/Production_Assessment | 60 |
| 21_Talks/Andrej_Karpathy/about | 42 |
| 21_Talks/Andrew_Ng/about | 42 |

_Last updated: 2026-06-01 13:42_
