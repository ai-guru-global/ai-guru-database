---
name_zh: "知识图谱洞察"
---
# Wiki Insights — 2026-07-02

> 中文简称：知识图谱洞察

> Auto-generated knowledge graph analysis of the AI Guru Database wiki vault.
> **1,711 pages** (excluding structural) · **8,439 directed edges** · **2,439 unique tags** · **214 orphan pages**

---

## 1. Anchor Pages — Top 10 Hubs

The most-referenced pages in the vault, ranked by incoming wikilink count.

| # | Page | In | Out | Type | Cluster |
|---|------|---:|----:|------|---------|
| 1 | [[Evaluation_Workflow]] | 88 | 5 | sink hub | 15_Agent_Production |
| 2 | [[AI_Stack_Deep_Dive]] | 83 | 50 | connector hub | 12_Architecture_Infrastructure |
| 3 | [[kubernetes]] | 81 | 17 | connector hub | 概念 |
| 4 | [[Agent_Red_Teaming_2026]] | 76 | 5 | sink hub | 15_Agent_Production |
| 5 | [[Agent_Harness_Complete_2026]] | 76 | 4 | sink hub | 15_Agent_Production |
| 6 | [[Production_Assessment]] | 72 | 5 | sink hub | 15_Agent_Production |
| 7 | [[vLLM_Deep_Dive]] | 66 | 10 | balanced hub | 10_Deployment_Inference |
| 8 | [[ai_engineering_roadmap_2026]] | 50 | 73 | connector hub | 90_Learn |
| 9 | [[kv-cache]] | 49 | 9 | balanced hub | 概念 |
| 10 | [[ai-agents]] | 45 | 9 | balanced hub | 概念 |

**Key observations:**
- The **15_Agent_Production** cluster dominates with 4 of the top 6 anchors — agent evaluation is clearly the wiki's gravitational center.
- **AI_Stack_Deep_Dive** and **ai_engineering_roadmap_2026** are the primary *connector hubs* (high outgoing counts of 50 and 73 respectively), actively bridging many other topics.
- 6 of 10 top anchors are *sink hubs* (high in, low out) — they accumulate references but don't distribute them. Consider adding more outgoing links from these pages to strengthen graph connectivity.
- The **概念** directory holds 3 of the top 10 anchors, confirming its role as a shared vocabulary layer.

---

## 2. Bridge Pages — Top 5 Cross-Cluster Connectors

Pages that sit between different topic clusters, linking pages with dissimilar tag profiles.

| # | Page | Bridge Score | Linker Clusters | Linkee Clusters |
|---|------|-------------|-----------------|-----------------|
| 1 | [[ai_engineering_roadmap_2026]] | 38.8 | AI_Intro, Fundamentals, ML, NLP, Coding, Apps, Talks, Papers, Learn, concepts, references | Fundamentals, ML, DL, CV, NLP, RL, Eval, Deploy, MLOps, Infra, RAG, Agents, Coding, Ethics, Apps, Talks, Papers, Learn, concepts, references |
| 2 | [[LLM_Architectures]] | 35.3 | AI_Intro, Fundamentals, DL, NLP, Eval, Deploy, Papers, Learn, concepts, synthesis | *(no outgoing — pure sink)* |
| 3 | [[microsoft_ai_agents_for_beginners]] | 35.2 | Agent_Production, Learn, references | Fundamentals, CV, NLP, Deploy, MLOps, Infra, AI_Ops, RAG, Agents, Ethics, Learn, concepts, references |
| 4 | [[vLLM_Deep_Dive]] | 31.3 | DL, NLP, Training, Eval, Deploy, MLOps, Infra, RAG, concepts, synthesis | Deploy, Infra, synthesis |
| 5 | [[AI_Stack_Deep_Dive]] | 30.1 | Infra, concepts, synthesis | NLP, Deploy, Infra, RAG, concepts |

**Key observations:**
- **ai_engineering_roadmap_2026** bridges 11 different directory clusters, making it the most structurally important page in the entire wiki. It is both a learning roadmap and a navigation backbone.
- **LLM_Architectures** has a high bridge score but 0 outgoing links — it is referenced from 10 different clusters but points nowhere. This is a missed connectivity opportunity.
- **microsoft_ai_agents_for_beginners** uniquely bridges the Agent Production cluster with CV, MLOps, AI_Ops, and Ethics — a rare interdisciplinary link.

---

## 3. Tag Cluster Cohesion

How tightly interconnected are pages sharing the same tag? Cohesion = actual links / possible links.

### Top 5 Most Cohesive Tags

| Tag | Pages | Actual Links | Max Possible | Cohesion |
|-----|------:|-------------:|-------------:|---------:|
| vgpu | 5 | 10 | 10 | 1.0000 |
| - ai | 25 | 262 | 300 | 0.8733 |
| gpu-virtualization | 7 | 17 | 21 | 0.8095 |
| remote-support | 5 | 8 | 10 | 0.8000 |
| assessment | 5 | 8 | 10 | 0.8000 |

### Top 5 Most Fragmented Tags (largest groups with zero cohesion)

| Tag | Pages | Actual Links | Max Possible | Cohesion |
|-----|------:|-------------:|-------------:|---------:|
| prompt-injection | 7 | 0 | 21 | 0.0000 |
| llm-security | 5 | 0 | 10 | 0.0000 |
| best-practices | 5 | 0 | 10 | 0.0000 |
| overview | 5 | 0 | 10 | 0.0000 |
| model-selection | 5 | 0 | 10 | 0.0000 |

**Key observations:**
- **364 tags** have 5+ pages and were evaluated for cohesion.
- The most cohesive clusters are infrastructure-specific (vgpu, gpu-virtualization) — tight technical domains with strong internal cross-referencing.
- Security-related tags (**prompt-injection**, **llm-security**) are notably fragmented: 7+ pages share the tag but have zero wikilinks between them. This suggests the security knowledge is scattered and would benefit from a synthesis page or cross-links.
- Generic tags (**overview**, **best-practices**, **model-selection**) have zero cohesion — these may be overly broad or inconsistently applied.

---

## 4. Surprising Connections — Top 5 Unexpected Links

Cross-category wikilinks that bridge distant knowledge areas.

| # | Source | Target | Score | Reasons |
|---|--------|--------|------:|---------|
| 1 | [[fastai_practical_dl]] | [[AI_Learning_Resources]] | 5 | Cross-category (90_Learn -> 00_AI_Introduction); isolated source (2 links) connecting to popular target (16 links) |
| 2 | [[designing-ml-systems-huyen]] | [[ai_engineering_roadmap_2026]] | 5 | Cross-category (参考 -> 90_Learn); isolated source (2 links) connecting to popular target (123 links) |
| 3 | [[agentscope_corpus_loading]] | [[diagnosis-work-order-hub]] | 5 | Cross-category (项目 -> 综合); isolated source (2 links) connecting to popular target (18 links) |
| 4 | [[RAG_Debugging_Cheat_Sheet]] | [[vector-database]] | 5 | Cross-category (14_RAG_Systems -> 概念); isolated source (2 links) connecting to popular target (27 links) |
| 5 | [[nlp-with-transformers]] | [[ai_engineering_roadmap_2026]] | 5 | Cross-category (参考 -> 90_Learn); isolated source (2 links) connecting to popular target (123 links) |

**Key observations:**
- The **参考** (book/course summaries) -> **90_Learn** (roadmaps) pattern appears twice, suggesting that learning resources are a natural bridge between reference material and structured curricula.
- **agentscope_corpus_loading** -> **diagnosis-work-order-hub** is a unique project-to-synthesis bridge — a practical debugging workflow linked from a project context.
- 38% of all links are cross-directory, indicating good structural integration across the wiki. The most active cross-directory corridors are: Architecture <-> concepts (437 links), Deploy <-> concepts (176 links), and NLP <-> Learn (116 links).

---

## 5. Orphan-Adjacent Suggestions

Pages linked from top-10 hubs but with zero outgoing links — dead ends that receive attention from the most important pages but don't connect further.

| Page | Incoming | Linked From Hub(s) |
|------|---------:|--------------------|
| [[lightgbm_overview]] | 2 | ai_engineering_roadmap_2026 |
| [[Agent_Memory_Techniques]] | 2 | ai_engineering_roadmap_2026 |
| [[catboost_overview]] | 2 | ai_engineering_roadmap_2026 |
| [[scikit-learn_overview]] | 2 | ai_engineering_roadmap_2026 |
| [[RAG_Deep_Dive]] | 2 | ai_engineering_roadmap_2026 |
| [[keras_overview]] | 2 | ai_engineering_roadmap_2026 |
| [[Chain_of_Thought_Deep_Dive]] | 2 | ai_engineering_roadmap_2026 |
| [[AI_Finance_Applications_2026]] | 1 | ai_engineering_roadmap_2026 |
| [[AI_Education_Applications_2026]] | 1 | ai_engineering_roadmap_2026 |

**Recommendation:** All 9 orphan-adjacent pages are linked from **ai_engineering_roadmap_2026** (the primary connector hub) but have no outgoing links. Adding 2-3 outgoing wikilinks from each would strengthen the learning pathway — particularly **Agent_Memory_Techniques** and **Chain_of_Thought_Deep_Dive**, which should link to agent production and NLP clusters respectively.

---

## 6. Rough Clusters — Anchor Pages by Directory

Pages with 5+ incoming links grouped by dominant directory cluster.

| Cluster | Anchors | Top Members |
|---------|--------:|-------------|
| **概念** | 193 | kubernetes (81), kv-cache (49), ai-agents (45), model-serving (42), transformer-architecture (41) |
| **05_NLP_LLMs** | 54 | LLM_Architectures (31), Prompt_Engineering (30), Fine_tuning_Techniques (26), Context_Engineering_Guide (23), LLM_Fundamentals (23) |
| **15_Agent_Production** | 40 | Evaluation_Workflow (88), Agent_Red_Teaming_2026 (76), Agent_Harness_Complete_2026 (76), Production_Assessment (72), Benchmarking_Criteria (23) |
| **16_AI_Coding** | 26 | OpenRouter_OpenCode_Guide (25), 05-openrouter-api-reference (25), AI_Coding_Theory (25) |
| **10_Deployment_Inference** | 24 | vLLM_Deep_Dive (66), SGLang_Deep_Dive (31), LLM_Inference_Engine_Selection_Guide (31) |
| **12_Architecture_Infrastructure** | 24 | AI_Stack_Deep_Dive (83), AI_Infrastructure_2026 (40), AI_Gateway_2026 (18) |
| **11_MLOps_Pipeline** | 21 | LLM_Observability (16), Data_Pipeline_Orchestration (15), Model_Monitoring (14) |
| **17_Ethics_Safety** | 15 | LLM_Security_Complete_Guide (14), AI_Safety_RedTeaming (13), Safety_Evaluation_Framework (11) |
| **07_Model_Training** | 15 | Distributed_Training_2026 (28), Mixed_Precision_Training (16), Distributed_Training_for_dummy (11) |
| **14_RAG_Systems** | 13 | RAG_Systems (38), RAG-in-nutshell (24), README_Advanced (19), Spring_AI_RAG_Deep_Dive (18) |

**543 total anchor pages** across **28 clusters**. The remaining 18 clusters each have fewer than 15 anchors.

---

## 7. Tier Assignment Suggestions

### Promote to Core (296 candidates — showing top 5)

Pages with high incoming links (>=5) currently marked as `supporting` or with no tier field, suggesting they should be elevated to `core`.

| Page | Incoming | Current Tier | Cluster |
|------|---------:|--------------|---------|
| [[ai_engineering_roadmap_2026]] | 50 | supporting | 90_Learn |
| [[ai-agents]] | 45 | supporting | 概念 |
| [[transformer-architecture]] | 41 | supporting | 概念 |
| [[AI_Infrastructure_2026]] | 40 | supporting | 12_Architecture_Infrastructure |
| [[microsoft_genai_for_beginners]] | 36 | supporting | 90_Learn |

### Demote to Peripheral (46 candidates — showing top 5)

Pages with <=1 incoming link, not updated in 90+ days, currently marked as `core` or `supporting` — potentially overstated.

| Page | Incoming | Current Tier | Last Updated | Cluster |
|------|---------:|--------------|-------------|---------|
| [[agent-framework-production]] | 0 | core | (unknown) | 综合 |
| [[career-interviews]] | 0 | core | (unknown) | 综合 |
| [[agentscope_corpus_loading]] | 0 | core | (unknown) | 项目 |
| [[ai-industry-applications]] | 0 | core | (unknown) | 综合 |
| [[stackops]] | 1 | core | (unknown) | 概念 |

**Note:** Many demote candidates have `(unknown)` dates, suggesting missing `updated:` frontmatter fields. Consider adding timestamps before demoting — the tier may be correct but the metadata incomplete.

---

## 8. Suggested Questions

Questions the wiki's structure is uniquely positioned to answer — or that reveal gaps in coverage.

1. **"What is the complete path from training a model to serving it in production?"**
   The wiki has strong coverage in both 07_Model_Training and 10_Deployment_Inference, but the bridge pages connecting training to deployment are sparse. Only 71 cross-links exist between these clusters. A synthesis page tracing the full model lifecycle would fill a critical gap.

2. **"How do agent evaluation criteria differ from traditional ML evaluation?"**
   Evaluation_Workflow (88 in) and the 08_Model_Evaluation cluster both anchor heavily referenced content, but there are few explicit links between agent-specific evaluation and traditional ML metrics. A comparison synthesis page would leverage both clusters.

3. **"Which inference engine should I choose for my use case — vLLM, SGLang, or TGI?"**
   vLLM_Deep_Dive (66 in), SGLang_Deep_Dive (31 in), and TGI_Deep_Dive (23 in) are all well-referenced, and LLM_Inference_Engine_Selection_Guide (31 in) exists as a hub. But the fragmented `model-selection` tag (0.0 cohesion) suggests no page actually compares them side-by-side with decision criteria.

4. **"How does RAG integrate with agent architectures?"**
   RAG_Systems (38 in) and Agent_Production are both major clusters, but cross-links between them are limited. The RAG_Debugging_Cheat_Sheet -> vector-database connection is one of the few bridges. A "RAG-powered Agents" synthesis page would connect two of the wiki's largest knowledge areas.

5. **"What security threats apply specifically to production agent systems?"**
   The prompt-injection tag (7 pages, 0.0 cohesion) and llm-security tag (5 pages, 0.0 cohesion) are the most fragmented clusters in the wiki. LLM_Security_Complete_Guide and AI_Safety_RedTeaming exist but don't cross-reference each other. This is the wiki's largest knowledge gap by cohesion analysis.

6. **"How does the OpenRouter/OpenCode ecosystem compare to direct API integration?"**
   16_AI_Coding has 26 anchor pages, mostly in a tightly interconnected OpenRouter sub-cluster. But this cluster has limited links to the broader NLP/LLM and Infrastructure clusters. A comparison page would bridge the coding tool ecosystem with the production infrastructure knowledge.

7. **"What is the relationship between context engineering and prompt engineering?"**
   Context_Engineering_Guide (23 in) is a rising concept, and 73 pages in the vault carry the `^[inferred]` marker linking context engineering to prompt engineering concepts. But no page explicitly maps the evolution from prompt -> context engineering. This is a natural synthesis opportunity.

---

## Appendix: Vault Statistics

| Metric | Value |
|--------|------:|
| Total pages (excl. structural) | 1,711 |
| Total directed edges | 8,439 |
| Orphan pages (0 incoming) | 214 |
| Pages with tags | 1,706 (99.7%) |
| Pages with tier field | 1,634 (95.5%) |
| Unique tags | 2,439 |
| Pages with 5+ incoming (anchors) | 543 |
| Cross-directory links | 3,288 (38%) |
| Same-directory links | 5,352 (62%) |
| Pages with `^[inferred]` markers | 73 |
| Evaluated tag clusters (5+ pages) | 364 |

### Top Tags by Page Count
`llm` (236) · `alibaba-cloud` (174) · `kubernetes` (172) · `inference` (160) · `ai-agents` (160) · `production` (138) · `agent-framework` (100) · `langgraph` (95) · `rag` (93) · `k8s` (92)

### Top Cross-Directory Corridors
Architecture <-> concepts (437) · Deploy <-> concepts (176) · NLP <-> Learn (116) · NLP <-> concepts (110) · concepts <-> synthesis (107) · Agents <-> Learn (104) · MLOps <-> concepts (76) · Training <-> concepts (74) · Deploy <-> Architecture (71) · Learn <-> references (70)

<!-- GRAPH_SNAPSHOT: {"nodes": [{"id": "Evaluation_Workflow", "in": 88, "out": 5, "dir": "15_Agent_Production"}, {"id": "AI_Stack_Deep_Dive", "in": 83, "out": 50, "dir": "12_Architecture_Infrastructure"}, {"id": "kubernetes", "in": 81, "out": 17, "dir": "概念"}, {"id": "Agent_Red_Teaming_2026", "in": 76, "out": 5, "dir": "15_Agent_Production"}, {"id": "Agent_Harness_Complete_2026", "in": 76, "out": 4, "dir": "15_Agent_Production"}, {"id": "Production_Assessment", "in": 72, "out": 5, "dir": "15_Agent_Production"}, {"id": "vLLM_Deep_Dive", "in": 66, "out": 10, "dir": "10_Deployment_Inference"}, {"id": "ai_engineering_roadmap_2026", "in": 50, "out": 73, "dir": "90_Learn"}, {"id": "kv-cache", "in": 49, "out": 9, "dir": "概念"}, {"id": "ai-agents", "in": 45, "out": 9, "dir": "概念"}, {"id": "model-serving", "in": 42, "out": 9, "dir": "概念"}, {"id": "transformer-architecture", "in": 41, "out": 12, "dir": "概念"}, {"id": "AI_Infrastructure_2026", "in": 40, "out": 7, "dir": "12_Architecture_Infrastructure"}, {"id": "RAG_Systems", "in": 38, "out": 8, "dir": "14_RAG_Systems"}, {"id": "microsoft_genai_for_beginners", "in": 36, "out": 51, "dir": "90_Learn"}, {"id": "microsoft_ai_for_beginners", "in": 32, "out": 61, "dir": "90_Learn"}, {"id": "SGLang_Deep_Dive", "in": 31, "out": 8, "dir": "10_Deployment_Inference"}, {"id": "LLM_Architectures", "in": 31, "out": 0, "dir": "05_NLP_LLMs"}, {"id": "LLM_Inference_Engine_Selection_Guide", "in": 31, "out": 14, "dir": "10_Deployment_Inference"}, {"id": "Prompt_Engineering", "in": 30, "out": 1, "dir": "05_NLP_LLMs"}, {"id": "hami", "in": 30, "out": 8, "dir": "概念"}, {"id": "distributed-training", "in": 29, "out": 4, "dir": "概念"}, {"id": "mlops", "in": 29, "out": 3, "dir": "概念"}, {"id": "rag-systems", "in": 29, "out": 13, "dir": "概念"}, {"id": "Distributed_Training_2026", "in": 28, "out": 5, "dir": "07_Model_Training"}, {"id": "Deployment_Inference_2026", "in": 28, "out": 5, "dir": "10_Deployment_Inference"}, {"id": "pod", "in": 28, "out": 6, "dir": "概念"}, {"id": "AI_Incident_Response_Playbook", "in": 27, "out": 6, "dir": "13_AI_Ops"}, {"id": "paged-attention", "in": 27, "out": 10, "dir": "概念"}, {"id": "Fine_tuning_Techniques", "in": 26, "out": 0, "dir": "05_NLP_LLMs"}, {"id": "OpenRouter_OpenCode_Guide", "in": 25, "out": 5, "dir": "16_AI_Coding"}, {"id": "05-openrouter-api-reference", "in": 25, "out": 16, "dir": "16_AI_Coding"}, {"id": "AI_Coding_Theory", "in": 25, "out": 5, "dir": "16_AI_Coding"}, {"id": "vector-database", "in": 25, "out": 2, "dir": "概念"}, {"id": "02-openrouter-quickstart-setup", "in": 24, "out": 17, "dir": "16_AI_Coding"}, {"id": "vllm", "in": 24, "out": 7, "dir": "概念"}, {"id": "06-openrouter-structured-outputs-tools", "in": 24, "out": 17, "dir": "16_AI_Coding"}, {"id": "MOC_OpenRouter_OpenCode", "in": 24, "out": 29, "dir": "16_AI_Coding"}, {"id": "09-openrouter-frameworks-integrations", "in": 24, "out": 19, "dir": "16_AI_Coding"}, {"id": "01-openrouter-overview-architecture", "in": 24, "out": 19, "dir": "16_AI_Coding"}, {"id": "continuous-batching", "in": 24, "out": 11, "dir": "概念"}, {"id": "10-openrouter-streaming-multimedia", "in": 24, "out": 16, "dir": "16_AI_Coding"}, {"id": "22-opencode-installation-quickstart", "in": 24, "out": 17, "dir": "16_AI_Coding"}, {"id": "04-openrouter-provider-routing", "in": 24, "out": 16, "dir": "16_AI_Coding"}, {"id": "08-openrouter-prompt-caching-optimization", "in": 24, "out": 19, "dir": "16_AI_Coding"}, {"id": "03-openrouter-models-providers", "in": 24, "out": 17, "dir": "16_AI_Coding"}, {"id": "23-opencode-providers-models", "in": 24, "out": 19, "dir": "16_AI_Coding"}, {"id": "21-opencode-overview-architecture", "in": 24, "out": 17, "dir": "16_AI_Coding"}, {"id": "RAG-in-nutshell", "in": 24, "out": 9, "dir": "14_RAG_Systems"}, {"id": "07-openrouter-plugins-web-search", "in": 24, "out": 18, "dir": "16_AI_Coding"}], "edges": [{"src": "10-openrouter-streaming-multimedia", "tgt": "03-openrouter-models-providers"}, {"src": "08-openrouter-prompt-caching-optimization", "tgt": "03-openrouter-models-providers"}, {"src": "21-opencode-overview-architecture", "tgt": "08-openrouter-prompt-caching-optimization"}, {"src": "05-openrouter-api-reference", "tgt": "06-openrouter-structured-outputs-tools"}, {"src": "07-openrouter-plugins-web-search", "tgt": "01-openrouter-overview-architecture"}, {"src": "22-opencode-installation-quickstart", "tgt": "OpenRouter_OpenCode_Guide"}, {"src": "MOC_OpenRouter_OpenCode", "tgt": "02-openrouter-quickstart-setup"}, {"src": "23-opencode-providers-models", "tgt": "MOC_OpenRouter_OpenCode"}, {"src": "vllm", "tgt": "vLLM_Deep_Dive"}, {"src": "22-opencode-installation-quickstart", "tgt": "06-openrouter-structured-outputs-tools"}, {"src": "RAG-in-nutshell", "tgt": "RAG_Systems"}, {"src": "RAG_Systems", "tgt": "RAG-in-nutshell"}, {"src": "21-opencode-overview-architecture", "tgt": "OpenRouter_OpenCode_Guide"}, {"src": "03-openrouter-models-providers", "tgt": "02-openrouter-quickstart-setup"}, {"src": "04-openrouter-provider-routing", "tgt": "03-openrouter-models-providers"}, {"src": "AI_Stack_Deep_Dive", "tgt": "SGLang_Deep_Dive"}, {"src": "01-openrouter-overview-architecture", "tgt": "03-openrouter-models-providers"}, {"src": "06-openrouter-structured-outputs-tools", "tgt": "MOC_OpenRouter_OpenCode"}, {"src": "21-opencode-overview-architecture", "tgt": "06-openrouter-structured-outputs-tools"}, {"src": "02-openrouter-quickstart-setup", "tgt": "21-opencode-overview-architecture"}, {"src": "05-openrouter-api-reference", "tgt": "22-opencode-installation-quickstart"}, {"src": "07-openrouter-plugins-web-search", "tgt": "04-openrouter-provider-routing"}, {"src": "08-openrouter-prompt-caching-optimization", "tgt": "ai-agents"}, {"src": "01-openrouter-overview-architecture", "tgt": "vector-database"}, {"src": "10-openrouter-streaming-multimedia", "tgt": "21-opencode-overview-architecture"}, {"src": "08-openrouter-prompt-caching-optimization", "tgt": "21-opencode-overview-architecture"}, {"src": "02-openrouter-quickstart-setup", "tgt": "08-openrouter-prompt-caching-optimization"}, {"src": "09-openrouter-frameworks-integrations", "tgt": "08-openrouter-prompt-caching-optimization"}, {"src": "MOC_OpenRouter_OpenCode", "tgt": "09-openrouter-frameworks-integrations"}, {"src": "model-serving", "tgt": "Deployment_Inference_2026"}, {"src": "kubernetes", "tgt": "hami"}, {"src": "01-openrouter-overview-architecture", "tgt": "ai-agents"}, {"src": "23-opencode-providers-models", "tgt": "05-openrouter-api-reference"}, {"src": "02-openrouter-quickstart-setup", "tgt": "OpenRouter_OpenCode_Guide"}, {"src": "04-openrouter-provider-routing", "tgt": "21-opencode-overview-architecture"}, {"src": "AI_Stack_Deep_Dive", "tgt": "AI_Infrastructure_2026"}, {"src": "01-openrouter-overview-architecture", "tgt": "21-opencode-overview-architecture"}, {"src": "rag-systems", "tgt": "RAG_Systems"}, {"src": "02-openrouter-quickstart-setup", "tgt": "06-openrouter-structured-outputs-tools"}, {"src": "03-openrouter-models-providers", "tgt": "09-openrouter-frameworks-integrations"}, {"src": "05-openrouter-api-reference", "tgt": "01-openrouter-overview-architecture"}, {"src": "10-openrouter-streaming-multimedia", "tgt": "OpenRouter_OpenCode_Guide"}, {"src": "09-openrouter-frameworks-integrations", "tgt": "06-openrouter-structured-outputs-tools"}, {"src": "07-openrouter-plugins-web-search", "tgt": "MOC_OpenRouter_OpenCode"}, {"src": "06-openrouter-structured-outputs-tools", "tgt": "05-openrouter-api-reference"}, {"src": "vLLM_Deep_Dive", "tgt": "Deployment_Inference_2026"}, {"src": "08-openrouter-prompt-caching-optimization", "tgt": "OpenRouter_OpenCode_Guide"}, {"src": "AI_Stack_Deep_Dive", "tgt": "continuous-batching"}, {"src": "10-openrouter-streaming-multimedia", "tgt": "04-openrouter-provider-routing"}, {"src": "05-openrouter-api-reference", "tgt": "07-openrouter-plugins-web-search"}, {"src": "paged-attention", "tgt": "SGLang_Deep_Dive"}, {"src": "22-opencode-installation-quickstart", "tgt": "07-openrouter-plugins-web-search"}, {"src": "09-openrouter-frameworks-integrations", "tgt": "22-opencode-installation-quickstart"}, {"src": "04-openrouter-provider-routing", "tgt": "OpenRouter_OpenCode_Guide"}, {"src": "01-openrouter-overview-architecture", "tgt": "OpenRouter_OpenCode_Guide"}, {"src": "pod", "tgt": "kubernetes"}, {"src": "05-openrouter-api-reference", "tgt": "23-opencode-providers-models"}, {"src": "05-openrouter-api-reference", "tgt": "04-openrouter-provider-routing"}, {"src": "05-openrouter-api-reference", "tgt": "10-openrouter-streaming-multimedia"}, {"src": "LLM_Inference_Engine_Selection_Guide", "tgt": "SGLang_Deep_Dive"}, {"src": "01-openrouter-overview-architecture", "tgt": "06-openrouter-structured-outputs-tools"}, {"src": "21-opencode-overview-architecture", "tgt": "07-openrouter-plugins-web-search"}, {"src": "MOC_OpenRouter_OpenCode", "tgt": "08-openrouter-prompt-caching-optimization"}, {"src": "22-opencode-installation-quickstart", "tgt": "23-opencode-providers-models"}, {"src": "rag-systems", "tgt": "vector-database"}, {"src": "10-openrouter-streaming-multimedia", "tgt": "MOC_OpenRouter_OpenCode"}, {"src": "microsoft_ai_for_beginners", "tgt": "Prompt_Engineering"}, {"src": "03-openrouter-models-providers", "tgt": "08-openrouter-prompt-caching-optimization"}, {"src": "ai_engineering_roadmap_2026", "tgt": "Prompt_Engineering"}, {"src": "21-opencode-overview-architecture", "tgt": "23-opencode-providers-models"}, {"src": "Agent_Red_Teaming_2026", "tgt": "Evaluation_Workflow"}, {"src": "MOC_OpenRouter_OpenCode", "tgt": "06-openrouter-structured-outputs-tools"}, {"src": "09-openrouter-frameworks-integrations", "tgt": "01-openrouter-overview-architecture"}, {"src": "06-openrouter-structured-outputs-tools", "tgt": "03-openrouter-models-providers"}, {"src": "07-openrouter-plugins-web-search", "tgt": "02-openrouter-quickstart-setup"}, {"src": "04-openrouter-provider-routing", "tgt": "MOC_OpenRouter_OpenCode"}, {"src": "03-openrouter-models-providers", "tgt": "06-openrouter-structured-outputs-tools"}, {"src": "02-openrouter-quickstart-setup", "tgt": "07-openrouter-plugins-web-search"}, {"src": "continuous-batching", "tgt": "kv-cache"}, {"src": "09-openrouter-frameworks-integrations", "tgt": "07-openrouter-plugins-web-search"}, {"src": "Production_Assessment", "tgt": "Evaluation_Workflow"}, {"src": "MOC_OpenRouter_OpenCode", "tgt": "22-opencode-installation-quickstart"}, {"src": "23-opencode-providers-models", "tgt": "ai-agents"}, {"src": "SGLang_Deep_Dive", "tgt": "Deployment_Inference_2026"}, {"src": "AI_Stack_Deep_Dive", "tgt": "vLLM_Deep_Dive"}, {"src": "02-openrouter-quickstart-setup", "tgt": "23-opencode-providers-models"}, {"src": "23-opencode-providers-models", "tgt": "21-opencode-overview-architecture"}, {"src": "Agent_Harness_Complete_2026", "tgt": "Evaluation_Workflow"}, {"src": "02-openrouter-quickstart-setup", "tgt": "10-openrouter-streaming-multimedia"}, {"src": "09-openrouter-frameworks-integrations", "tgt": "23-opencode-providers-models"}, {"src": "09-openrouter-frameworks-integrations", "tgt": "10-openrouter-streaming-multimedia"}, {"src": "microsoft_genai_for_beginners", "tgt": "microsoft_ai_for_beginners"}, {"src": "06-openrouter-structured-outputs-tools", "tgt": "ai-agents"}, {"src": "22-opencode-installation-quickstart", "tgt": "09-openrouter-frameworks-integrations"}, {"src": "03-openrouter-models-providers", "tgt": "22-opencode-installation-quickstart"}, {"src": "06-openrouter-structured-outputs-tools", "tgt": "21-opencode-overview-architecture"}, {"src": "08-openrouter-prompt-caching-optimization", "tgt": "23-opencode-providers-models"}, {"src": "23-opencode-providers-models", "tgt": "08-openrouter-prompt-caching-optimization"}, {"src": "SGLang_Deep_Dive", "tgt": "vLLM_Deep_Dive"}, {"src": "21-opencode-overview-architecture", "tgt": "09-openrouter-frameworks-integrations"}]} -->
