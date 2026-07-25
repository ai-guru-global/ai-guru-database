---
title: "RAG 检索增强生成速查表"
tags: [cheatsheet, rag, retrieval, vector-database, reranking, hybrid-search, agentic-rag]
type: cheatsheet
created: 2026-06-24
updated: 2026-06-24
tier: core
summary: "RAG 全栈速查：从基础 Naive RAG 到 Modular/Agentic RAG 的架构演进、主流向量数据库、检索策略、评估指标与生产级 SLO。"
sources: []
---

# RAG 检索增强生成速查表

> **核心洞察**：RAG 从 2020 至今已完成 **Naive → Advanced → Modular → Agentic** 四代演进；2026 年企业级 RAG 的关键不是"做出来"，而是"做得精（召回率 ≥ 90%）+ 稳定运行（P99 < 3s）+ 成本可控（< $0.01/query）"。
> 详见 [[14_RAG系统]] · [[RAG_Advanced_2026]] · [[RAG_Systems|14_RAG系统/RAG_Systems]] · [[Advanced_RAG]]

## RAG 四代架构演进

| 阶段 | 架构 | 召回率 | 延迟 | 成本 | 何时使用 |
|------|------|--------|------|------|---------|
| **Naive RAG** | Query → Embedding → Vector DB → Top-K → LLM | 70-80% | 1-3s | $ | 内部知识库、原型 |
| **Advanced RAG** | + Query Rewriting + HyDE + Reranking + Hybrid Search | 85-92% | 2-5s | $$ | **生产级 RAG 标配** |
| **Modular RAG** | + 可插拔模块 + 自适应路由 | 90-95% | 3-8s | $$$ | 复杂场景、多模态 |
| **Agentic RAG** | + Multi-Agent + Self-Reflection + Tool Use | 92-97% | 5-15s | $$$$ | 科研分析、复杂推理 |

## 主流向量数据库对比

| 数据库 | 类型 | 索引算法 | 强项 | 部署 | 适合规模 |
|--------|------|---------|------|------|---------|
| **Chroma** | 嵌入式 | HNSW | 极简 API、原型友好 | 单机/嵌入式 | < 100K 向量 |
| **FAISS** | 库 | IVF/PQ/HNSW | 极致性能、Meta 出品 | 嵌入式 | 10M+ 向量 |
| **Milvus** | 分布式 | IVF/HNSW/DiskANN | 亿级向量、GPU 加速 | K8s/云 | 100M+ 向量 |
| **Weaviate** | 分布式 | HNSW + 模块化 | 内置向量化 + RAG 工具链 | K8s/云 | 10M+ 向量 |
| **Qdrant** | Rust | HNSW | 高性能、低延迟 | 单机/集群 | 10M+ 向量 |
| **Pinecone** | SaaS | 自研 | 零运维、Serverless | 云 | 任意 |
| **pgvector** | Postgres 扩展 | HNSW/IVF | 与关系数据共存 | Postgres | < 10M |
| **Vespa** | 分布式 | 自研 | 混合搜索 + 排序 | K8s | 100M+ |
| **Typesense** | 单机 | HNSW | 搜索体验、关键词友好 | 单机 | < 10M |

> **选型口诀**: 原型 → Chroma；中等规模 → Qdrant / pgvector；大规模 → Milvus / Weaviate；零运维 → Pinecone。

## Embedding 模型选型

| 模型 | 维度 | 上下文 | MTEB 评分 | 成本 | 适合场景 |
|------|------|--------|----------|------|---------|
| **text-embedding-3-small** | 1536 | 8K | 62.3% | $0.02/M | 通用、成本敏感 |
| **text-embedding-3-large** | 3072 | 8K | 64.6% | $0.13/M | 高质量首选 |
| **BGE-M3** | 1024 | 8K | 65.4% | 开源免费 | 多语言、混合检索 |
| **BGE-large-zh-v1.5** | 1024 | 512 | 64.5% | 开源 | 中文首选 |
| **M3E-large** | 1024 | 512 | 58.6% | 开源 | 中文轻量 |
| **Cohere embed-v3** | 1024 | 512 | 64.5% | $0.10/M | 英文首选 |
| **Jina v3** | 1024 | 8K | 65.3% | 开源 | 长文档 |
| **Qwen3-Embedding** | 1024-4096 | 32K | 67-70% | 开源 | 2026 SOTA |

## 检索策略对照

| 策略 | 机制 | 提升 | 适用场景 |
|------|------|------|---------|
| **BM25（关键词）** | TF-IDF + 词频 | 基线 | 精确术语、代码、错误信息 |
| **Dense Retrieval** | 向量相似度 | +5-15% | 语义、问答 |
| **Hybrid Search** | BM25 + Dense 加权融合 | +10-20% | **生产标配** |
| **HyDE** | 生成假设性文档再检索 | +5-10% | 短查询、零样本 |
| **Query Rewriting** | LLM 改写查询 | +8-15% | 对话历史、口语化 |
| **Step-back Prompting** | 抽象查询再检索 | +10-15% | 复杂推理 |
| **Multi-Query** | 生成多个查询并行检索 | +5-10% | 模糊需求 |
| **Reranking** | Cross-Encoder 二次排序 | +10-20% | **Top-K 精度提升关键** |
| **Parent Document Retriever** | 检索小块，返回父块 | +5-15% | 上下文需求大 |
| **Self-Query** | LLM 提取 metadata 过滤 | +10-20% | 结构化筛选 |

## 评估指标

### 检索质量

| 指标 | 说明 | 目标值 |
|------|------|--------|
| **Context Recall** | 检索到的相关文档比例 | ≥ 0.85 |
| **Context Precision** | 检索结果中相关文档比例 | ≥ 0.80 |
| **Hit Rate** | Top-K 中包含正确答案比例 | ≥ 0.95 |
| **MRR** | 第一个正确答案的倒数排名 | ≥ 0.70 |
| **NDCG@k** | 归一化折损累积增益 | ≥ 0.80 |

### 生成质量

| 指标 | 说明 | 目标值 |
|------|------|--------|
| **Faithfulness** | 答案对检索上下文的忠实度 | ≥ 0.90 |
| **Answer Relevancy** | 答案与问题的相关性 | ≥ 0.85 |
| **Answer Correctness** | 答案与标准答案的匹配度 | ≥ 0.85 |
| **Hallucination Rate** | 幻觉率（反向指标） | ≤ 5% |

### 生产指标

| 指标 | 目标 |
|------|------|
| P99 延迟 | < 3s |
| QPS（单机） | ≥ 50 |
| 缓存命中率 | ≥ 30% |
| 单查询成本 | < $0.01 |
| 检索失败回退率 | < 1% |

## 进阶技术

### 1. Hybrid Search 加权融合

```python
# 典型 Reciprocal Rank Fusion (RRF)
def hybrid_search(query, alpha=0.7):
    dense_results = vector_db.search(query, top_k=20)
    bm25_results = bm25_index.search(query, top_k=20)
    # RRF: score(d) = sum(1 / (k + rank_i(d)))
    scores = {}
    for rank, doc in enumerate(dense_results):
        scores[doc.id] = scores.get(doc.id, 0) + alpha / (60 + rank)
    for rank, doc in enumerate(bm25_results):
        scores[doc.id] = scores.get(doc.id, 0) + (1 - alpha) / (60 + rank)
    return sorted(scores.items(), key=lambda x: -x[1])[:5]
```

### 2. Query Rewriting

```python
# Multi-Query / Step-back / HyDE 三种改写
def rewrite_query(query, mode="multi"):
    if mode == "multi":
        prompt = f"生成 {query} 的 3 种不同表述，用于检索。\\n输出 JSON: {{\"queries\": [...]}}"
    elif mode == "hyde":
        prompt = f"写一段 100 字假想答案回答 '{query}'，用于向量检索。"
    elif mode == "stepback":
        prompt = f"对 '{query}' 抽象一个更高层的问题（step-back question）。"
    return llm.generate(prompt)
```

### 3. Reranking

```python
# Cross-Encoder Reranker 比 Bi-Encoder 精度高 10-20%
from sentence_transformers import CrossEncoder
reranker = CrossEncoder('BAAI/bge-reranker-v2-m3')

# 检索 Top-50，重排取 Top-5
candidates = vector_db.search(query, top_k=50)
pairs = [(query, doc.text) for doc in candidates]
scores = reranker.predict(pairs)
top5 = [candidates[i] for i in np.argsort(scores)[::-1][:5]]
```

### 4. Self-RAG / Corrective RAG

```python
# Self-RAG: LLM 自我评判检索质量，必要时重新检索
def self_rag(query):
    docs = retrieve(query)
    if not is_relevant(docs, query):
        docs = rewrite_and_retrieve(query)
    answer = llm.generate(query, context=docs)
    if not is_supported(answer, docs):
        answer = llm.generate(query, context=docs, instruction="仅基于上下文回答，不确定就说不知道")
    return answer
```

## 常见陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| Chunk 切分过大 | 召回精度低、噪声多 | 切小（200-500 token）+ 重叠（10-20%）|
| Chunk 切分过小 | 语义断裂、上下文丢失 | 句子/段落边界切分 |
| 没用 Reranker | Top-K 精度差 | 加 Cross-Encoder reranker |
| Embedding 模型不匹配 | 召回率 < 70% | 用同领域数据微调 embedding |
| 没用 Hybrid Search | 关键词查询失败 | BM25 + Dense 融合 |
| Prompt 没约束幻觉 | LLM 编造事实 | "仅基于上下文回答"硬约束 |
| 上下文塞太多 | 噪声淹没答案 | 压缩 + 重排 + 选 Top-3 |
| 没有 Eval 流水线 | 优化靠感觉 | RAGAS / TruLens 自动评估 |

## 生产级 RAG 流水线

```
                  ┌─────────────────────────────────────────┐
                  │           用户 Query                     │
                  └────────────────┬────────────────────────┘
                                   │
                                   ▼
              ┌──────────────────────────────────────────┐
              │  Query Understanding & Rewriting          │
              │  (改写/扩展/HyDE/意图分类)                │
              └────────────────┬─────────────────────────┘
                               │
                               ▼
              ┌──────────────────────────────────────────┐
              │  Hybrid Retrieval (Dense + BM25)         │
              │  + Metadata Filtering                    │
              │  → Top-50 candidates                     │
              └────────────────┬─────────────────────────┘
                               │
                               ▼
              ┌──────────────────────────────────────────┐
              │  Cross-Encoder Reranking                 │
              │  → Top-5-10 final contexts               │
              └────────────────┬─────────────────────────┘
                               │
                               ▼
              ┌──────────────────────────────────────────┐
              │  Context Compression & Formatting         │
              │  (去冗余、保留相关片段)                  │
              └────────────────┬─────────────────────────┘
                               │
                               ▼
              ┌──────────────────────────────────────────┐
              │  LLM Generation                          │
              │  (System Prompt + Context + Query)       │
              └────────────────┬─────────────────────────┘
                               │
                               ▼
              ┌──────────────────────────────────────────┐
              │  Post-Processing                         │
              │  (Citation / Refusal / Format Validation)│
              └──────────────────────────────────────────┘
```

## RAG 工具栈速查

| 框架 | 定位 | 强项 |
|------|------|------|
| **LangChain** | 全栈 LLM 框架 | 生态最全、组件丰富 |
| **LlamaIndex** | RAG 专用 | 数据连接器、索引抽象优秀 |
| **Haystack** | 生产级 NLP 框架 | 流水线清晰、评估完善 |
| **DSPy** | 声明式编程 | 自动 prompt 优化 |
| **RAGAS** | 评估框架 | RAG 指标标准化 |
| **TruLens** | 可观测性 | 反馈函数、追踪 |
| **Flowise / LangFlow** | 可视化搭建 | 低代码、原型 |
| **Dify** | LLMOps 平台 | 一站式 RAG 应用 |
| **Cohere RAG** | SaaS | 企业级、可控 |

---

**参见**：[[14_RAG系统]] · [[Advanced_RAG]] · [[RAG_Advanced_2026]] · [[Embedding_Models_Guide]] · [[RAG_Frameworks]] · [[Agentic_RAG_Guide]]