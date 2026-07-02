---
title: Wiki Insights
description: Structural analysis of the Obsidian wiki knowledge graph
date: 2026-06-05
updated: 2026-06-05
---

# Wiki Insights — 2026-06-05

## Anchor Pages (top 10 hubs)

| Page | Incoming | Outgoing | Note |
|---|---|---|---|
| [[_synthesis/README]] | 259 | 3 | major hub |
| [[19_Talks/Yoshua_Bengio/about]] | 189 | 4 | major hub |
| company level question bank | 138 | 4 | major hub |
| interview answers | 117 | 4 | major hub |
| interview preparing | 117 | 4 | major hub |
| question bank | 117 | 4 | major hub |
| [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] | 106 | 5 | connector hub |
| [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] | 90 | 5 | connector hub |
| [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] | 90 | 6 | connector hub |

## Bridge Pages (top 5)

| Page | Cross-cluster pairs | Bridges |
|---|---|---|
| [[OpenRouter_OpenCode_Guide]] | 205 pairs | 17_AI_Coding ↔ concepts, root ↔ concepts |
| [[MOC_OpenRouter_OpenCode]] | 154 pairs | synthesis ↔ 17_AI_Coding, root ↔ concepts |
| [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] | 137 pairs | concepts ↔ 11_RAG_Systems, concepts ↔ 09_Deployment_Inference |
| _concepts/ai-agents | 89 pairs | 06_Reinforcement_Learning ↔ 13_Agent_Production, concepts ↔ 17_AI_Coding |
| _concepts/transformer-architecture | 76 pairs | 03_Deep_Learning ↔ 04_NLP_LLMs, concepts ↔ 09_Deployment_Inference |

> Note: README/README_for_dummy basenames are excluded — they span 259 directories and inflate bridge scores due to basename collision.

## Tag Cluster Cohesion

### Most cohesive (well-linked)
- **#interviews** — 7 pages, cohesion 1.24
- **#experience** — 7 pages, cohesion 1.24
- **#practitioners** — 7 pages, cohesion 1.24
- **#model-deployment** — 5 pages, cohesion 1.20
- **#distributed-training** — 9 pages, cohesion 1.06

### Most fragmented (cross-linker targets)
- **#overview** — 6 pages, cohesion 0.00 ⚠️
- **#visualization** — 5 pages, cohesion 0.00 ⚠️
- **#chinese-llm** — 5 pages, cohesion 0.00 ⚠️
- **#open-source** — 6 pages, cohesion 0.00 ⚠️
- **#llama** — 5 pages, cohesion 0.00 ⚠️

## Surprising Connections (top 5)

- [[00_AI_Introduction/AI_Ethics_Society]] → [[_concepts/ai-ethics]] — score 4
  - Reason: cross-layer (00_AI_Introduction ↔ concepts), peripheral→hub (4→10)
- [[00_AI_Introduction/AI_Glossary]] → [[16_AI_Coding/Tools/OpenRouter/05-openrouter-api-reference]] — score 4
  - Reason: cross-layer (00_AI_Introduction ↔ 17_AI_Coding), peripheral→hub (2→41)
- [[02_Machine_Learning/Bayesian_Methods/Bayesian_Methods_Deep_Dive]] → [[_concepts/model-training]] — score 4
  - Reason: cross-layer (02_Machine_Learning ↔ concepts), peripheral→hub (4→18)
- [[02_Machine_Learning/Causal_Inference/Causal_Inference_Deep_Dive]] → [[_concepts/probability-statistics]] — score 4
  - Reason: cross-layer (02_Machine_Learning ↔ concepts), peripheral→hub (4→11)
- [[05_NLP_LLMs/LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]] → [[_synthesis/pretraining-synthetic-data]] — score 4
  - Reason: cross-layer (04_NLP_LLMs ↔ synthesis), peripheral→hub (3→10)

## Orphan-Adjacent (dead-ends near hubs)

- [[01_Fundamentals/AI_Hardware/AI_Hardware_2026]] — linked from 2 hubs, 0 outbound
- [[01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms]] — linked from 2 hubs, 0 outbound
- [[02_Machine_Learning/Anomaly_Detection/Anomaly_Detection]] — linked from 2 hubs, 0 outbound
- [[02_Machine_Learning/AutoML/AutoML]] — linked from 2 hubs, 0 outbound
- [[02_Machine_Learning/Anomaly_Detection/Anomaly_Detection_for_dummy]] — linked from 2 hubs, 0 outbound

## Orphan Pages (0 incoming links)

- Ethics_Safety-in-nutshell
- Industry_Applications-in-nutshell
- Learning_Paths_2026
- RL-in-nutshell
- _directory-conventions, _insights, _tag-taxonomy-report, _wiki-digest, _wiki-status, hot, log

## Tier Suggestions

> These are suggestions only — `tier:` is never auto-written to pages.

### Promote to `core` (≥5 incoming, currently unset)

| # | Page | Incoming | Current Tier |
|---|---|---|---|
| 1 | [[_synthesis/README]] | 259 | unset |
| 2 | [[19_Talks/Yoshua_Bengio/about]] | 189 | unset |
| 3 | company level question bank | 138 | unset |
| 4 | interview answers | 117 | unset |
| 5 | interview preparing | 117 | unset |
| 6 | question bank | 117 | unset |
| 7 | [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] | 106 | unset |

### Demote to `peripheral`

No pages qualify (≤1 incoming AND ≥90 days stale AND currently core/supporting). All high-link pages were updated recently (2026-05-31+).

### Batch Default

778 pages lack `tier:` assignment. The top 7 candidates above are recommended for `core`. The remaining ~771 untagged pages with <5 incoming could be batch-assigned `tier: supporting` as a sensible default.

## Questions Worth Asking

1. Explore: Why does `OpenRouter_OpenCode_Guide` bridge 17_AI_Coding and concepts?
2. Link: `Ethics_Safety-in-nutshell` has no incoming links — what should reference it?
3. Link: `Industry_Applications-in-nutshell` has no incoming links — what should reference it?
4. Link: `Learning_Paths_2026` has no incoming links — what should reference it?
5. Audit: Should tag `#overview` be split into more focused sub-tags? (cohesion 0.00, 6 pages)
6. Audit: Should tag `#visualization` be split into more focused sub-tags? (cohesion 0.00, 5 pages)
7. Connect: Dead-end pages near hubs (AI_Hardware_2026, Data_Structures_Algorithms, etc.) — add outbound cross-references?

<!-- GRAPH_SNAPSHOT: {"nodes":637,"edges":4322,"generated":"2026-06-05"} -->
