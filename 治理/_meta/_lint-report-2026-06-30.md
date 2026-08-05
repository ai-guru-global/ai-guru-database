---
name_zh: "健康度检查报告"
---
# Wiki Health Report -- 2026-06-30

> 中文简称：健康度检查报告

**Generated**: 2026-06-30T22:30:00
**Vault**: `/Users/ai-guru/Documents/GitHub/ai-guru-global/ai-guru-database`
**Scope**: Checks 1-4, 8, 11 + Tier Distribution (Checks 5, 7, 9, 10, 12, 13 skipped per vault policy)

---

## Overview

| Metric | Value |
|---|---|
| Total wiki pages | 1,156 |
| Total wikilinks (edges) | 8,081 |
| Total unique tags | 1,649 |
| Orphaned pages | 297 |
| Broken wikilinks | 199 (95 unique targets) |
| Pages missing required frontmatter | 81 |
| Pages missing summary | 65 |
| Stale pages (updated < 2025-06-01) | 0 |
| Fragmented tag clusters | 120 |
| Existing synthesis pages | 33 |

---

## Check 1: Orphaned Pages (297 found)

Pages with zero incoming wikilinks. These are invisible to graph traversal and likely under-connected.

### Breakdown by Chapter

| Chapter | Orphans | % of Chapter |
|---|---|---|
| 21_Interviews | 83 | 28.0% |
| 19_Talks | 56 | 18.9% |
| 15_Agent_Production | 19 | 6.4% |
| 10_Deployment_Inference | 17 | 5.7% |
| 05_NLP_LLMs | 16 | 5.4% |
| 12_Architecture_Infrastructure | 15 | 5.1% |
| 20_Papers_and_Research | 14 | 4.7% |
| 11_MLOps_Pipeline | 8 | 2.7% |
| 03_Deep_Learning | 6 | 2.0% |
| 16_AI_Coding | 6 | 2.0% |
| 01_基础入门 | 5 | 1.7% |
| 02_Machine_Learning | 5 | 1.7% |
| 04_Computer_Vision | 5 | 1.7% |
| 13_AI_Ops | 5 | 1.7% |
| 14_RAG_Systems | 5 | 1.7% |
| 17_Ethics_Safety | 5 | 1.7% |
| 06_Reinforcement_Learning | 4 | 1.3% |
| 08_Model_Evaluation | 4 | 1.3% |
| 00_AI_Introduction | 3 | 1.0% |
| 07_Model_Training | 3 | 1.0% |
| 09_Testing | 3 | 1.0% |
| 18_AI_Applications_Industry | 3 | 1.0% |
| 90_Learn | 2 | 0.7% |
| 93_Templates | 2 | 0.7% |
| README.md (root) | 1 | 0.3% |
| README_for_dummy.md (root) | 1 | 0.3% |
| log.md (root) | 1 | 0.3% |

**Key observation**: 21_Interviews (83) and 19_Talks (56) account for 47% of all orphans. These chapters have a homogeneous structure (about/sayings/question_bank per entity) where pages are siblings but don't cross-reference each other.

---

## Check 2: Broken Wikilinks (199 found, 95 unique targets)

Wikilinks pointing to pages that do not exist in the vault.

### Top 20 Broken Targets

| Broken Target | References | Likely Cause |
|---|---|---|
| `AI运维/AI_Incident_Response_Playbook.md` | 17 | Moved/renamed during restructuring |
| `arxiv` | 14 | External link used as wikilink (not a page) |
| `机器学习` | 8 | Chapter-level link without README match |
| `12_架构基建/AI_Infrastructure_2026.md` | 8 | Deleted or not yet created |
| `12_架构基建/Spring_AI_Architecture.md` | 7 | Not yet created |
| `部署推理` | 6 | Chapter-level link without exact match |
| `14_AI_Gateway/LiteLLM_Deep_Dive.md` | 5 | Moved to 12_Architecture_Infrastructure |
| `14_AI_Gateway` | 4 | Chapter moved/merged |
| `数学基础` | 4 | Chapter-level link without exact match |
| `RAG系统` | 4 | Chapter-level link |
| `伦理安全` | 4 | Chapter-level link |
| `AI编程` | 4 | Chapter-level link |
| `14_AI_Gateway/AI_Gateway_2026.md` | 3 | Moved/merged into AI_Gateway_README |
| `Agent` | 3 | Chapter-level link |
| `AI测试` | 3 | Chapter-level link |
| `05_大模型/15_中国LLM生态` | 3 | Subdirectory link without page match |
| `03_深度学习/ApacheCN_PyTorch_Track` | 3 | Archived/removed |
| `03_深度学习/ApacheCN_TensorFlow_Track` | 3 | Archived/removed |
| `05_大模型/ApacheCN_NLP_Track` | 3 | Archived/removed |
| `模型训练` | 3 | Chapter-level link |

**Pattern analysis**: ~30 broken links are chapter-level or directory-level references (e.g., `[[02_机器学习]]`) that don't resolve to a specific file. ~14 are `[[arxiv]]` references that should be external links. The remaining ~55 are genuine broken references to moved/deleted pages.

---

## Check 3: Missing Required Frontmatter (81 pages)

Pages missing one or more required frontmatter fields: `title`, `category`, `tags`, `created`, `updated`.

### Breakdown by Missing Field

| Field | Pages Missing | Top Offenders |
|---|---|---|
| `updated` | 78 | AI编程/Tools/OpenRouter/* (48 pages), system pages (治理/hot.md, 索引.md) |
| `category` | 31 | Beginner guides, 索引.md, some Agent Harness pages |
| `tags` | 28 | AI编程/Tools/OpenRouter/*, AI编程/Tools/OpenCode/* |
| `created` | 12 | AI编程/OpenRouter_OpenCode_Guide.md, 索引.md, 治理/hot.md |
| `title` | 1 | log.md |

### Pages with No Frontmatter At All

| Page | Notes |
|---|---|
| `log.md` | System file, expected to lack frontmatter |

**Key observation**: The OpenRouter (11 pages) and OpenCode (12 pages) ingest batches are missing `tags`, `created`, and `updated` fields. This is a batch-level ingestion issue -- the source ingest template did not populate all required fields.

---

## Check 3a: Missing Summary (65 pages -- soft check)

Pages with `summary_len = 0` (no summary in frontmatter).

### Top 20 by Incoming Links (highest priority)

| Incoming | Page | Title |
|---|---|---|
| 50 | `AI编程/OpenRouter_OpenCode_Guide.md` | AI 编程与 LLM 网关专题 |
| 50 | `AI编程/MOC_OpenRouter_OpenCode.md` | topic-ai-coding MOC |
| 50 | `AI编程/Tools/OpenRouter/05-openrouter-api-reference.md` | API 参考与请求/响应规范 |
| 50 | `AI编程/Tools/OpenRouter/08-openrouter-prompt-caching-optimization.md` | Prompt Caching 与成本优化 |
| 50 | `AI编程/Tools/OpenRouter/01-openrouter-overview-architecture.md` | OpenRouter 概述与核心架构 |
| 50 | `AI编程/Tools/OpenRouter/02-openrouter-quickstart-setup.md` | 快速接入与环境配置 |
| 48 | `AI编程/Tools/OpenRouter/06-openrouter-structured-outputs-tools.md` | Structured Outputs 与 Tool Calling |
| 48 | `AI编程/Tools/OpenRouter/09-openrouter-frameworks-integrations.md` | 框架集成与生态系统 |
| 48 | `AI编程/Tools/OpenRouter/10-openrouter-streaming-multimedia.md` | 流式传输与多模态输入 |
| 48 | `AI编程/Tools/OpenRouter/03-openrouter-models-providers.md` | 模型与 Provider 生态 |
| 48 | `AI编程/Tools/OpenRouter/07-openrouter-plugins-web-search.md` | 插件体系与 Web Search |
| 48 | `AI编程/Tools/OpenRouter/04-openrouter-provider-routing.md` | 智能路由与 Provider 选择 |
| 48 | `AI编程/Tools/OpenCode/21-opencode-overview-architecture.md` | OpenCode 概述与核心架构 |
| 48 | `AI编程/Tools/OpenCode/23-opencode-providers-models.md` | Provider 与模型管理 |
| 48 | `AI编程/Tools/OpenCode/22-opencode-installation-quickstart.md` | 安装部署与快速入门 |
| 46 | `AI编程/Tools/OpenCode/24-opencode-agents-system.md` | Agent 系统深度指南 |
| 22 | `AI编程/Tools/OpenRouter/11-openrouter-security-privacy.md` | 安全、隐私与数据治理 |
| 12 | `15_智能体/04_Agent脚手架/The_Anatomy_of_an_Agent_Harness.md` | The Anatomy of an Agent Harness |
| 10 | `05_大模型/LLM_For_Beginners.md` | 大语言模型入门 |
| 6 | `05_大模型/05_LLM架构/LLM_Internals_Inference.md` | 大模型推理与部署 |

**Key observation**: 47 of the 65 missing-summary pages (72%) are from the 16_AI_Coding OpenRouter/OpenCode batch ingest. These are high-traffic pages (48-50 incoming each) that urgently need summaries.

---

## Check 4: Stale Content (0 found)

No pages have `updated` before 2025-06-01. The vault was established in 2026, so all content is less than 2 months old.

**Assessment**: Excellent. No staleness issues. The next lint should re-check as the vault ages.

---

## Check 8: Fragmented Tag Clusters (120 found)

Tags with 5+ pages and graph cohesion < 0.15 (fewer than 15% of possible intra-tag links exist).

### Top 15 Most Fragmented (by page count)

| Tag | Pages | Actual Links | Max Links | Cohesion | Assessment |
|---|---|---|---|---|---|
| `ai-agents` | 165 | 701 | 13,530 | 0.052 | Severely fragmented |
| `llm` | 128 | 224 | 8,128 | 0.028 | Severely fragmented |
| `production` | 113 | 547 | 6,328 | 0.086 | Fragmented |
| `agent-framework` | 110 | 557 | 5,995 | 0.093 | Fragmented |
| `langgraph` | 108 | 549 | 5,778 | 0.095 | Fragmented |
| `career` | 91 | 309 | 4,095 | 0.076 | Fragmented |
| `interviews` | 90 | 309 | 4,005 | 0.077 | Fragmented |
| `inference` | 85 | 280 | 3,570 | 0.078 | Fragmented |
| `kubernetes` | 72 | 103 | 2,556 | 0.040 | Severely fragmented |
| `nlp` | 67 | 155 | 2,211 | 0.070 | Fragmented |
| `rag` | 56 | 138 | 1,540 | 0.090 | Fragmented |
| `transformer` | 54 | 118 | 1,431 | 0.083 | Fragmented |
| `experience` | 53 | 146 | 1,378 | 0.106 | Fragmented |
| `practitioners` | 53 | 146 | 1,378 | 0.106 | Fragmented |
| `mlops` | 40 | 79 | 780 | 0.101 | Fragmented |

**Analysis**: All 120 fragmented tags have cohesion well below 0.15. The most severe cases are:
- **`llm`** (128 pages, cohesion 0.028): This tag is applied too broadly -- it covers LLM architecture, training, inference, deployment, products, and coding. These are effectively separate sub-domains.
- **`ai-agents`** (165 pages, cohesion 0.052): Similarly broad -- spans agent foundations, frameworks, evaluation, harness, enterprise, and coding tools.
- **`kubernetes`** (72 pages, cohesion 0.040): Spans AI infrastructure, MLOps, AI Ops, and deployment -- multiple chapters with minimal cross-linking.

**Root cause**: These are "umbrella tags" applied to pages across many chapters without inter-chapter cross-links. The `/cross-linker` skill should target these clusters first.

---

## Tier Distribution

| Tier | Count | % of Vault |
|---|---|---|
| `supporting` | 1,299 | 74.1% |
| `core` | 369 | 21.1% |
| `peripheral` | 87 | 5.0% |

**Total pages with tier field**: 1,755 (note: this exceeds the 1,156 page count because some pages in `原始/` and other directories also carry frontmatter)

**Assessment**: The vault is heavily weighted toward `supporting` (74%). The prior audit (2026-06-30 phase B) noted 597 core / 577 supporting / 50 peripheral, suggesting a tier rebalance has already been partially executed (many pages shifted from core to supporting). The 87 peripheral pages are primarily system files (治理/hot.md, 索引.md, README_EN.md, etc.).

**Non-standard tier values**: None found in current scan (the prior `deep-dive` value appears to have been normalized).

---

## Check 11: Synthesis Gaps

### Existing Synthesis Pages (33)

The `治理/` directory contains 33 pages including:
agent-evaluation-model-evaluation, agent-framework-production, agents-reinforcement-learning, ai-ethics-future, ai-industry-applications, alignment-rlhf, anomaly-detection-automl, benchmark-evaluation, career-interviews, Chinese_vs_Global_LLM_Comparison, cv-deep-learning, hami-cdi-dra, llm-infrastructure-system-design, llm-nlp, mlops-monitoring-convergence, moe-inference-optimization, multimodal-rag, pretraining-synthetic-data, python-data-science-pipeline, python-first-ml-model, rag-agents, rag-vector-database, reasoning-models-agents, safety-evaluation-red-teaming, serving-deployment, synthesis-architecture-selection-guide, synthesis-engineering-evolution, synthesis-llm-security-pipeline, synthesis-memory-systems, talks-insights, training-fine-tuning, transformer-llm-architecture

### Top 5 Cross-Domain Gaps (by shared tag count, no synthesis page)

| Rank | Chapter Pair | Shared Tags | Suggested Synthesis Topic |
|---|---|---|---|
| 1 | 05_NLP_LLMs <-> 20_Papers_and_Research | 44 | **LLM Architecture Evolution from Research to Practice** -- bridging seminal papers (Transformer, GPT-4, Chinchilla, DeepSeek) with current LLM architecture decisions |
| 2 | 05_NLP_LLMs <-> 10_Deployment_Inference | 37 | **LLM Inference Stack: Architecture to Production** -- connecting model architecture choices (attention, MoE, quantization-aware design) with inference engine optimization |
| 3 | 10_Deployment_Inference <-> 12_Architecture_Infrastructure | 36 | **AI Infrastructure for Model Serving** -- Kubernetes/GPU infrastructure patterns purpose-built for LLM inference workloads |
| 4 | 05_NLP_LLMs <-> 07_Model_Training | 35 | **LLM Training Pipeline: Pretrain to Fine-tune** -- end-to-end training workflow connecting architecture design with distributed training strategies |
| 5 | 05_NLP_LLMs <-> 15_Agent_Production | 34 | **LLM Capabilities as Agent Primitives** -- how LLM architecture features (tool calling, reasoning, context window) enable agent design patterns |

---

## Recommendations

### Priority 1 -- Quick Wins (can be fixed in a single session)

1. **Fix 55 genuinely broken wikilinks** -- Update references to moved/renamed pages. Focus on:
   - `AI运维/AI_Incident_Response_Playbook.md` (17 refs) -- find the actual page path
   - `12_架构基建/AI_Infrastructure_2026.md` (8 refs) -- create or redirect
   - `12_架构基建/Spring_AI_Architecture.md` (7 refs) -- create or redirect
   - `14_AI_Gateway/*` references (12 refs total) -- update to current paths
   - `arxiv` (14 refs) -- convert to external links `[arxiv](https://arxiv.org)`
   - Chapter-level `[[XX_Chapter]]` links (~30) -- point to `XX_Chapter/README.md`

2. **Add summaries to OpenRouter/OpenCode batch** (47 pages) -- These are high-traffic pages (48-50 incoming links each) with no summary. A batch update script can generate 1-line summaries from page titles.

3. **Fix missing frontmatter on OpenRouter/OpenCode batch** -- Add `tags`, `created`, `updated` to 28 pages. The `updated` field is missing from 78 pages, mostly in this batch.

### Priority 2 -- Structural Improvements

4. **Run `/cross-linker` on 21_Interviews (83 orphans)** -- The interview pages follow a rigid template (about/sayings/question_bank/interview_answers/interview_preparing/company_level_question_bank) per role. Cross-link between related roles and to relevant knowledge chapters.

5. **Run `/cross-linker` on 19_Talks (56 orphans)** -- Link person pages to relevant knowledge chapters (e.g., Karpathy -> deep learning, Altman -> LLM products, etc.).

6. **Split umbrella tags** -- `llm` (128 pages), `ai-agents` (165 pages), and `kubernetes` (72 pages) are too broad. Run `/tag-taxonomy` to create more specific sub-tags.

### Priority 3 -- Knowledge Synthesis

7. **Create 5 synthesis pages** for the top cross-domain gaps identified above. These bridge the most-connected chapter pairs and will serve as high-value navigation hubs.

8. **Add summaries to remaining 18 pages** (non-OpenRouter/OpenCode) -- Focus on beginner guides and Agent Harness pages which have 4-12 incoming links each.

### Priority 4 -- Ongoing Maintenance

9. **Re-run lint in 30 days** to catch staleness as the vault ages.
10. **Monitor tier balance** -- 74% supporting may need rebalancing as core knowledge pages are identified.

---

## Appendix: Checks Skipped

| Check | Reason |
|---|---|
| 5 (Contradictions) | Requires semantic analysis beyond structural lint |
| 7 (Provenance) | Vault uses minimal provenance markers |
| 9 (Visibility) | Vault is public, no visibility filtering |
| 10 (Misc Promotion) | No misc/ directory exists |
| 12 (Confidence/Lifecycle) | Schema not enforced in this vault |
| 13 (Typed Relationships) | Schema not enforced in this vault |
