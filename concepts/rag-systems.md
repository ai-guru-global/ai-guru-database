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
- [[concepts/pretrain-vs-finetune-vs-rag]] — 预训练/微调/RAG 决策指南
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack（内置知识库+RAG 应用）

---

## RAG 怎么做（大白话）

> **一句话理解**：RAG = 给模型"开卷考试"——回答前先去翻你公司的资料库，找到相关内容再作答，而不是只靠脑子里的训练数据硬答。

### 三阶段流水线

```
[索引期] 一次性把资料整理好
  文档 → 切块 → 向量化 → 存进向量数据库
                          (像建索引)

[检索期] 每次提问时跑一遍
  用户问题 → 向量化 → 在向量库里搜最像的几段 → 拿回 Top-K

[生成期] 把"搜到的资料 + 问题"塞给 LLM
  Prompt = "基于以下资料回答：\n[资料1]\n[资料2]\n问题：xxx"
  LLM → 输出答案 + 引用来源
```

### 三阶段详解

#### 1. 文档分块（Chunking）

把一篇 50 页的 PDF 切成几百块,每块 256-512 tokens。

| 策略 | 怎么做 | 优点 | 缺点 |
|------|--------|------|------|
| 固定长度 | 每 500 字一刀 | 简单快 | 可能切断语义 |
| 语义切分 | 按段落/标题切 | 语义完整 | 块大小不一 |
| 递归切分 | 先按章节再按段落 | 保留层级 | 实现复杂 |
| Parent-Child | 小块检索,返回大块 | 兼顾精度和上下文 | 存储翻倍 |

经验值：256-512 tokens / 块,块之间重叠 10-20%。

#### 2. Embedding（向量化）

把文字变成一串数字(向量),让"语义相近的文字"在向量空间里也接近。

类比：每篇文章 = 一个人,embedding = TA 在"语义宇宙"里的坐标。坐标越近,话题越像。

常用模型：
- **BGE-M3**(开源、多语言)
- **OpenAI text-embedding-3-large**(商业、贵但强)
- **nomic-embed-text**(支持 Matryoshka,可变维度)

#### 3. 检索 + 重排序(两阶段)

**第一阶段:召回(快速、粗筛)**
- 用 Bi-Encoder 把问题也变成向量
- 在向量库里搜 Top-50 最相似的块
- 同时用 BM25 做关键词检索(专有名词、型号特别管用)
- 两者融合:RRF 或 `0.7×向量分 + 0.3×BM25`

**第二阶段:重排(精确、精筛)**
- 用 Cross-Encoder 把"问题-文档"对**联合编码**,打精确分
- 重新排序 Top-50 → 选 Top-5
- 慢但准,只用在前 50 上

```
召回 (Bi-Encoder, 快):  1000 万块 → 50 块
重排 (Cross-Encoder, 准): 50 块 → 5 块
送进 LLM:              5 块 + 问题 → 答案
```

#### 4. 生成(LLM 综合)

Prompt 模板长这样:

```
你是一位专业的客服助理。请仅基于以下"参考资料"回答用户问题,
如果资料里没有答案,请直接说"我不知道",不要瞎编。

【参考资料】
[1] {chunk_1}
[2] {chunk_2}
...
[5] {chunk_5}

【用户问题】{question}

【回答】
```

#### 5. 进阶:RAG 不止"找资料"

| 变体 | 思路 | 适用 |
|------|------|------|
| **Hybrid Search** | 向量 + 关键词双路召回,再融合 | 标配,准确率 +20% |
| **Reranking** | Cross-Encoder 精排 | 高准确率要求 |
| **Query Rewrite** | LLM 把模糊问题改写清楚再搜 | 用户问得含糊 |
| **Self-RAG / CRAG** | 模型自己判断"该不该搜、搜得够不够" | 复杂问答 |
| **GraphRAG** | 构建知识图谱,做关系推理 | 多跳问答 |
| **多模态 RAG** | 检索图/表/视频 | 文档混合场景 |

### 评估指标(RAGAS)

| 指标 | 含义 | 目标 |
|------|------|------|
| **Faithfulness** | 回答是否基于上下文(没瞎编) | >0.85 |
| **Answer Relevancy** | 回答是否切题 | >0.85 |
| **Context Precision** | 检索到的块里"相关块占比" | >0.8 |
| **Context Recall** | "所有相关块被召回了多少" | >0.8 |

### 常见坑

1. **块切太大/太小**:太大召回不准,太小语义不全
2. **Embedding 模型选错**:中文用英文模型,召回率掉一半
3. **没有重排序**:Top-10 里正确答案排第 8,LLM 也救不回来
4. **Prompt 没强调"基于资料回答"**:模型开始自由发挥,幻觉又来了
5. **不更新索引**:资料库加了新文档,向量库没重建,答的还是旧的

### 一句话总结

> RAG = **切块 + 向量化 + 检索 + 重排 + 生成**。
> 80% 的效果由"分块策略 + Embedding 模型 + 重排"决定,LLM 反而是最不重要的那个环节。
