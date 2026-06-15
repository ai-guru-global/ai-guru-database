---
title: RAG 检索增强生成
category: concepts
tags:
- rag
- retrieval
- - - vector-database|embedding
- reranking
- vector-search
relationships:
- target: 'concepts/vector-database'
  type: related_to
- target: 'concepts/mlops'
  type: related_to
- target: 'concepts/ai-architecture'
  type: related_to
- target: 'concepts/matryoshka-representation-learning'
  type: related_to
sources:
- 11_RAG_recommendation-systems/RAG_Systems.md
- 11_RAG_Systems/RAG_Advanced_2026.md
- 11_RAG_Systems/README.md
- 11_RAG_Systems/README_Advanced.md
summary: RAG（检索增强生成）通过结合外部知识库检索与大语言模型生成能力，解决LLM幻觉、知识过时和领域知识不足问题，2026年已从基础模式进化为90%+准确率的精密工程。
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.78
lifecycle: stable
lifecycle_changed: 2026-06-04
tier: core
created: 2026-05-31 00:00:00+00:00
updated: 2026-06-12 00:00:00+00:00
---

# RAG 检索增强生成

## 核心要点

检索增强生成（Retrieval-Augmented Generation, RAG）让LLM像"开卷考试"一样，先查阅专业知识库再回答问题，而非仅靠记忆硬答。核心解决三大问题：幻觉（生成合理但错误的内容）、知识截止（训练数据有时间限制）、领域知识不足（通用模型缺乏专业深度）。

RAG相比微调的优势：知识可实时更新、成本更低（仅需存储+检索）、可解释性更强（可追溯来源）、部署复杂度中等。但RAG不适合改变模型风格/能力的场景，此时微调更合适。

### RAG automl三大阶段

**索引阶段**：原始文档 → 文档解析 → 文档分块（Chunking） → 向量化（Embedding） → 存入向量数据库

**检索阶段**：用户查询 → 查询重写（可选） → 查询向量化 → 相似度搜索 → 召回Top-K文档 → 重排序（可选）

**生成阶段**：检索结果 + 查询 → Prompt构造 → LLM生成 → 答案 + 引用来源

## 详细内容

### 文档分块策略

分块是RAG效果的基础。固定长度分块简单高效但可能破坏语义；语义分块基于相邻句子的嵌入相似度保持语义完整；递归切分保留层级结构；Parent-Document Retrieval用小块检索、返回大块生成，兼顾检索精度和上下文完整。

最佳实践：Chunk Size通常256-512 tokens，Overlap为10-20%，保留文档来源和章节标题等元数据。

### Embedding模型选型

BGE-M3是多语言通用首选（免费开源），OpenAI text-embedding-3-large适合商业应用，E5-mistral-7b适合长文本检索。选型维度包括维度、MTEB分数、多语言支持和成本。若需在同一向量上支持多精度检索，可优先选择支持 [[concepts/matryoshka-representation-learning|Matryoshka 表示]] 的模型（如 nomic-embed-text-v1.5），用低维前缀粗排、高维前缀精排。

### 混合检索（Hybrid Search）

结合向量检索（语义相似度）和BM25关键词检索（精确匹配）的优势。融合策略有两种：倒数排名融合（RRF，公式`score = 1/(k+rank)`）和权重融合（`α×向量分 + (1-α)×BM25分`，推荐α=0.7）。

混合检索是2026年RAG的标配，单独使用向量检索或关键词检索都明显逊色。向量检索擅长语义理解，BM25擅长精确匹配专有名词和产品型号。

### 重排序（Reranking）

初始检索的相关文档可能排名靠后，Cross-Encoder通过联合编码Query和Doc实现更精确的排序。Bi-Encoder用于大规模召回（独立编码，速度快），Cross-Encoder用于精排（联合编码，精度高但慢）。常用模型包括BGE-Reranker和Cohere Rerank API。^[inferred]

### 上下文压缩

LLM存在"Lost in the Middle"现象：上下文过长时中间部分容易被忽略。压缩策略包括冗余过滤（相似度>0.95的文档去重）、相关片段提取和摘要压缩（超出Token预算时对文档生成摘要）。

### ai-history RAG

传统RAG是固定流程（查询→检索→生成），Agentic RAG引入动态决策循环：模型自主判断是否需要检索、评估检索结果是否充分、必要时重写查询再检索。Self-RAG和Corrective RAG（CRAG）是代表性方案，通过多轮迭代将准确率从70%提升至90%+。

### GraphRAG

传统RAG只能检索平面文档，GraphRAG通过构建知识图谱增强复杂关系推理。流程：文档→实体抽取→关系抽取→知识图谱→查询时图遍历+向量检索联合。适用于多跳问答、企业知识库和学术文献场景。^[ambiguous]

### RAG评估框架（RAGAS）

核心指标：Faithfulness（回答是否基于上下文，目标>0.85）、Answer Relevancy（回答相关性，目标>0.85）、long-context-models Precision（相关块在前K个中的比例，目标>0.8）、Context Recall（相关块被检索到的比例，目标>0.8）。评估方法结合自动化指标和LLM-as-Judge。

### 2026年RAG框架选型

Dify适合企业内部平台（功能完整、可视化），Haystack适合企业级复杂RAG（模块化Pipeline），LlamaIndex适合性能优先的数据密集场景（数据索引优化），LangFlow和Flowise适合快速原型和非技术用户。

## 开放问题

- Agentic RAG的多轮迭代增加延迟和成本，如何平衡准确率与效率
- 长上下文模型（128K+）是否会减少对RAG的依赖 ^[ambiguous]
- 多模态RAG（检索图像、表格）的技术成熟度不足
- RAG系统在生产环境中的增量更新和版本管理最佳实践

## 来源

- 11_RAG_Systems/RAG_Systems.md — RAG完整技术体系、Pipeline流程、评估指标
- 11_RAG_Systems/RAG_Advanced_2026.md — 混合检索、重排序、Agentic RAG、上下文压缩
- 11_RAG_Systems/README.md — 学习路径与框架选型
- 11_RAG_Systems/README_Advanced.md — 框架选型与关键技术速查

## Related

- [[11_RAG_Systems/RAG-in-nutshell]] — RAG (检索增强生成) 速成指南 (共享: rag, retrieval)
- [[11_RAG_Systems/RAG_Systems]] — RAG 系统 (RAG Systems) (共享: rag, retrieval)
- [[11_RAG_Systems/README_Advanced]] — RAG高级实践 2026 (共享: rag, retrieval)
- [[concepts/embedding-models]] — 嵌入模型（RAG 检索基础）
- [[concepts/vector-database]] — 向量数据库（RAG 存储基础）
- [[concepts/lora-peft]] — LoRA/PEFT（RAG vs 微调选型）
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack（内置知识库+RAG 应用）
