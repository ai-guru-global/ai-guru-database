---
title: Tag Taxonomy Report
category: meta
tags: [meta, taxonomy, audit, tags]
summary: Wiki 标签体系规范化报告，包含标签分布、合并映射和规范化建议。
sources: []
name_zh: "标签体系报告"
---

# Tag Taxonomy 规范化报告

> 中文简称：标签体系报告

生成时间: 2026-06-01 11:21

## 标签分布概览

- 唯一标签总数: 392
- 标签实例总数: 3073
- 平均每页标签数: 4.1

## Top 30 标签

| 标签 | 页面数 |
|---|---|
| #ai-agents | 132 |
| #agent-framework | 108 |
| #production | 108 |
| #langgraph | 108 |
| #career | 89 |
| #interviews | 89 |
| #experience | 89 |
| #practitioners | 89 |
| #llm | 59 |
| #ai-coding | 55 |
| #nlp | 48 |
| #talks | 47 |
| #speeches | 47 |
| #insights | 47 |
| #leaders | 47 |
| #ai | 44 |
| #transformer | 41 |
| #gpt | 38 |
| #bert | 36 |
| #cursor | 32 |
| #code-generation | 32 |
| #computer-vision | 31 |
| #github-copilot | 31 |
| #reinforcement-learning | 28 |
| #machine-learning | 27 |
| #model-evaluation | 26 |
| #rag | 25 |
| #observability | 24 |
| #cnn | 23 |
| #agent | 23 |

## 已执行的规范化操作

| 原始标签 | 规范化标签 | 影响文件数 |
|---|---|---|
| rl | reinforcement-learning | 28 |
| ml | machine-learning | 27 |
| cv | computer-vision | 26 |
| dl | deep-learning | 16 |
| neural-network | neural-networks | 1 |
| AGI | agi | 1 |
| FSDP | fsdp | 1 |
| GPU | gpu | 1 |
| HNSW | hnsw | 1 |
| training | model-training | 3 |
| k8s | kubernetes | 1 |
| model-serving | serving | 2 |

## 标签一致性状态

- **大小写不一致**: 已清除 (0 组)
- **缩写/全称并存**: 已合并主要冲突
- **单复数不一致**: neural-network → neural-networks 已修复

## 建议进一步处理

1. 低频标签审计: {len([t for t, c in tag_counts.items() if c == 1])} 个标签仅出现 1 次，可能存在拼写错误或过度细分
2. 中文标签保留: 24 个中文标签（如 产业变革、具身智能、深度学习），建议保持双语标签策略
3. 语义聚类: agent-framework / ai-agents / production / langgraph 高度共现（各 73+），可考虑进一步合并或建立层级关系

## 完整标签列表

- #ai-agents (132)
- #agent-framework (108)
- #langgraph (108)
- #production (108)
- #career (89)
- #experience (89)
- #interviews (89)
- #practitioners (89)
- #llm (59)
- #ai-coding (55)
- #nlp (48)
- #insights (47)
- #leaders (47)
- #speeches (47)
- #talks (47)
- #ai (44)
- #transformer (41)
- #gpt (38)
- #bert (36)
- #code-generation (32)
- #cursor (32)
- #computer-vision (31)
- #github-copilot (31)
- #reinforcement-learning (28)
- #machine-learning (27)
- #model-evaluation (26)
- #rag (25)
- #observability (24)
- #agent (23)
- #ai-ops (23)
- #cnn (23)
- #incident-response (23)
- #monitoring (23)
- #mdp (22)
- #retrieval (22)
- #vector-database (22)
- #embedding (21)
- #alignment (20)
- #automation (20)
- #image-processing (20)
- #supervised (20)
- #unsupervised (20)
- #cloud-ops (19)
- #devops (19)
- #serving (19)
- #sre (19)
- #ai-ethics (18)
- #basics (18)
- #deep-learning (18)
- #fundamentals (18)
- #red-teaming (18)
- #safety (18)
- #algorithms (17)
- #deployment (17)
- #inference (17)
- #math (17)
- #vllm (17)
- #ai-applications (16)
- #finance (16)
- #healthcare (16)
- #industry (16)
- #kubernetes (16)
- #testing (16)
- #architecture (15)
- #education (15)
- #learning (15)
- #courses (14)
- #model-training (14)
- #study-path (14)
- #evaluation (13)
- #fsdp (13)
- #high-availability (13)
- #infrastructure (13)
- #ai-testing (12)
- #backpropagation (12)
- #ci-cd (12)
- #neural-networks (12)
- #optimization (12)
- #prompt-testing (12)
- #ai-gateway (11)
- #api-management (11)
- #feature-store (11)
- #litellm (11)
- #mlops (11)
- #routing (11)
- #distributed-training (10)
- #pipeline (10)
- #ab-testing (9)
- #benchmark (9)
- #metrics (9)
- #tools (9)
- #backend (8)
- #charts (8)
- #dashboards (8)
- #data-viz (8)
- #frontend (8)
- #fullstack (8)
- #planning (8)
- #visualization (8)
- #web (8)
- #productivity (7)
- #software (7)
- #utilities (7)
- #goals (6)
- #overview (6)
- #roadmap (6)
- #strategy (6)
- #drafts (5)
- #ideas (5)
- #model-deployment (5)
- #notes (5)
- #observations (5)
- #attention (4)
- #deep-dive (4)
- #docs-as-code (4)
- #documentation (4)
- #introduction (4)
- #llama (4)
- #mkdocs (4)
- #agi (3)
- #diffusion (3)
- #dqn (3)
- #java (3)
- #langchain (3)
- #synthesis (3)
- #深度学习 (3)
- #autogen (2)
- #configuration (2)
- #coze (2)
- #crewai (2)
- #cv (2)
- #deep-rl (2)
- #deepspeed (2)
- #dpo (2)
- #edge (2)
- #fine-tuning (2)
- #fine-tuning-techniques (2)
- #generative-models (2)
- #google (2)
- #gpu (2)
- #history (2)
- #hnsw (2)
- #linear-algebra (2)
- #lora (2)
- #mcp (2)
- #milvus (2)
- #moe (2)
- #object-detection (2)
- #openai (2)
- #paper (2)
- #peft (2)
- #ppo (2)
- #qdrant (2)
- #react (2)
- #reference (2)
- #rlhf (2)
- #rnn (2)
- #sglang (2)
- #spring-ai (2)
- #stable-diffusion (2)
- #tensorrt (2)
- #tool-use (2)
- #xgboost (2)
- #机器学习 (2)
- #社会影响 (2)
- #AI-chips (1)
- #AMD (1)
- #Blackwell (1)
- #ChatGPT (1)
- #NVIDIA (1)
- #SVD (1)
- #ZeRO (1)
- #activation-function (1)
- #actor-critic (1)
- #adam (1)
- #ai-hardware (1)
- #ai-history (1)
- #all-reduce (1)
- #alphago (1)
- #anomaly-detection (1)
- #arima (1)
- #atari (1)
- #autoencoder (1)
- #automl (1)
- #awq (1)
- #bagging (1)
- #bayes (1)
- #beam-search (1)
- #blip (1)
- #boosting (1)
- #bounding-box (1)
- #cases (1)
- #catboost (1)
- #chain-of-thought (1)
- #classic (1)
- #classification (1)
- #clip (1)
- #clustering (1)
- #coding (1)
- #collaborative-filtering (1)
- #compression (1)
- #computational-graphs (1)
- #content-based (1)
- #context (1)
- #copilot (1)
- #cost-optimization (1)
- #cot (1)
- #daily-ops (1)
- #data-structures (1)
- #dbscan (1)
- #decision-tree (1)
- #deepmind (1)
- #detr (1)
- #dify (1)
- #dimensionality-reduction (1)
- #distillation (1)
- #distributed-systems (1)
- #distributions (1)
- #dropout (1)
- #ecosystem (1)
- #edge-ai (1)
- #eigenvalues (1)
- #en (1)
- #encoding (1)
- #ensemble (1)
- #ethics (1)
- #experiment-tracking (1)
- #exploration (1)
- #faster-rcnn (1)
- #feature-engineering (1)
- #feature-selection (1)
- #few-shot (1)
- #filesystem (1)
- #forecasting (1)
- #future (1)
- #game-ai (1)
- #gan (1)
- #gateway (1)
- #glossary (1)
- #gptq (1)
- #gru (1)
- #guide (1)
- #hands-on (1)
- #hardware (1)
- #harness (1)
- #harness-engineering (1)
- #human-feedback (1)
- #hybrid (1)
- #hyperparameter-optimization (1)
- #image-classification (1)
- #image-generation (1)
- #inference-engine (1)
- #information-theory (1)
- #instance-segmentation (1)
- #int4 (1)
- #int8 (1)
- #isolation-forest (1)
- #jepa (1)
- #kling (1)
- #knowledge-distillation (1)
- #kv-cache (1)
- #labs (1)
- #landscape (1)
- #learning-rate (1)
- #lightgbm (1)
- #linear-complexity (1)
- #llama-cpp (1)
- #llava (1)
- #llm-infrastructure (1)
- #llmops (1)
- #long-context (1)
- #lstm (1)
- #mamba (1)
- #matrix-factorization (1)
- #matrix-operations (1)
- #memory (1)
- #meta (1)
- #microservices (1)
- #microsoft (1)
- #milestones (1)
- #mixed-precision (1)
- #moc (1)
- #model-selection (1)
- #multi-agent (1)
- #multi-tenant (1)
- #multimodal (1)
- #multimodal-models (1)
- #multimodal-vision (1)
- #nas (1)
- #normalization (1)
- #o1 (1)
- #ollama (1)
- #one-class-svm (1)
- #open-source (1)
- #optuna (1)
- #orchestration (1)
- #outlier-detection (1)
- #parallelism (1)
- #pca (1)
- #policy-gradient (1)
- #practical (1)
- #practice (1)
- #preprocessing (1)
- #probability (1)
- #prompt-engineering (1)
- #prophet (1)
- #pruning (1)
- #q-learning (1)
- #qlora (1)
- #quantization (1)
- #random-forest (1)
- #readme (1)
- #reasoning (1)
- #recommendation (1)
- #regression (1)
- #regularization (1)
- #representation-learning (1)
- #reranking (1)
- #resnet (1)
- #resources (1)
- #responsible-ai (1)
- #reward-model (1)
- #rl (1)
- #sac (1)
- #sam (1)
- #sandbox (1)
- #sarima (1)
- #scaling (1)
- #seasonality (1)
- #security (1)
- #segmentation (1)
- #self-attention (1)
- #self-supervised (1)
- #semantic-segmentation (1)
- #sequence-modeling (1)
- #sequence-models (1)
- #serverless (1)
- #sgd (1)
- #similarity-search (1)
- #society (1)
- #sora (1)
- #sparse (1)
- #ssm (1)
- #stacking (1)
- #state-space (1)
- #statistics (1)
- #svm (1)
- #tensors (1)
- #terminology (1)
- #test-time-compute (1)
- #time-series (1)
- #timeline (1)
- #training (1)
- #transformer-architecture (1)
- #trends (1)
- #triton (1)
- #tsne (1)
- #u-net (1)
- #v-jepa (1)
- #vector-indexing (1)
- #vector-search (1)
- #veo (1)
- #verification (1)
- #video (1)
- #video-generation (1)
- #vision-language (1)
- #vit (1)
- #weight-decay (1)
- #wiki (1)
- #world-model (1)
- #yolo (1)
- #产业变革 (1)
- #伦理 (1)
- #偏见 (1)
- #入门 (1)
- #具身智能 (1)
- #历史 (1)
- #图灵 (1)
- #图谱分析 (1)
- #基础概念 (1)
- #基础设施 (1)
- #大语言模型 (1)
- #安全 (1)
- #技术栈 (1)
- #数据 (1)
- #时间线 (1)
- #智能体 (1)
- #未来趋势 (1)
- #治理 (1)
- #洞察 (1)
- #计算机视觉 (1)
- #隐私 (1)

---

## 关联

本标签分类报告从标签维度刻画知识库的覆盖与失衡，可与以下内容维度的审计文档对照阅读。

- [[治理/_content-audit-2026-07-01|内容审计 2026-07-01]] — 章节与主题维度的覆盖审计，与本报告互补
- [[治理/_content-gap-analysis|内容缺口分析]] — 基于章节结构的缺口清单
- [[治理/Quality_Metrics|质量度量]] — 连通性与一致性指标定义
- [[治理/Content_Governance|内容治理]] — 标签规范与命名约定的治理依据
- [[治理/_taxonomy-assessment-2026-06-23|分类评估 2026-06-23]] — 早期的目录与分类评估
- [[治理/_insights|知识洞察]] — 从标签分布提炼的洞察
- [[治理/Document_Templates|文档模板规范]] — frontmatter tags 字段的填写规范
