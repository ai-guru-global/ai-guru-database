---
title: "嵌入模型 (Embedding Models)"
category: concept
tags: ["embedding", "vector-representation", "semantic-search", "sentence-transformers", "reranking"]
relationships:
  - target: "concepts/rag-systems"
    type: enables
  - target: "concepts/vector-database"
    type: related_to
  - target: "concepts/llm-architectures"
    type: builds_on
  - target: "concepts/matryoshka-representation-learning"
    type: related_to
  - target: "concepts/embeddings-vectors-mrl-plain"
    type: simplified
  - target: "09_Deployment_Inference/Inference_Performance/Embedding_Model_Serving"
    type: optimized_by
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 11_RAG_Systems/RAG_Advanced_2026.md
  - 11_RAG_Systems/Matryoshka_Representation_Learning_Deep_Dive.md
  - 22_Papers/Matryoshka_Representation_Learning_Deep_Dive.md
  - 09_Deployment_Inference/Inference_Performance/Embedding_Model_Serving.md
  - concepts/embeddings-vectors-mrl-plain.md
summary: "嵌入模型将文本/图像映射为高维稠密向量，是语义搜索、RAG、聚类的基础。2026年主流方案包括 GTE、bge、E5-Mistral 等，维度从 384 到 4096。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-15
---

# 嵌入模型 (Embedding Models)

> 将人类语言转化为机器可计算的向量——语义搜索与 RAG 的基石。

---

## 1. 定义

**嵌入模型**（Embedding Model）将文本（或图像/音频）映射为固定维度的**稠密向量**（dense vector），使得语义相似的内容在向量空间中距离接近。

\[
f: \text{text} \rightarrow \mathbf{v} \in \mathbb{R}^d
\]

嵌入模型是 RAG、语义搜索、聚类分析、推荐系统的核心组件。

---

## 2. 技术演进

| 时代 | 代表模型 | 维度 | 特点 |
|------|----------|------|------|
| **词嵌入** | Word2Vec, GloVe | 300 | 静态词向量，无上下文 |
| **上下文嵌入** | BERT, ELMo | 768 | 动态上下文，但不可对比 |
| **Sentence-BERT** | SBERT (2019) | 768 | 双塔结构，句子级语义 |
| **对比学习嵌入** | SimCSE, Contriever | 768 | 对比学习，无监督 |
| **指令微调嵌入** | E5, GTE, bge | 768-1024 | 指令感知，MTEB SOTA |
| **LLM-based 嵌入** | E5-Mistral, GritLM | 4096 | 基于 LLM，长上下文 |
| **多模态嵌入** | CLIP, SigLIP | 768-1152 | 文本-图像联合嵌入 |

---

## 3. 2026 年主流模型对比

| 模型 | 维度 | 最大长度 | MTEB 得分 | 特点 |
|------|------|----------|-----------|------|
| **GTE-Qwen2-7B** | 3584 | 8192 | 70.3 | Qwen2-based，长上下文 |
| **bge-m3** | 1024 | 8192 | 65.4 | 多语言、多粒度、多函数 |
| **E5-Mistral-7B** | 4096 | 32768 | 66.7 | LLM-based，超长上下文 |
| **nomic-embed-text-v1.5** | 768 | 8192 | 62.3 | 开源，[[concepts/matryoshka-representation-learning|Matryoshka 表示]] |
| **Qwen3-Embedding-8B** | 4096 | 32768 | ~72 | AI Stack 预置模型 |
| **bge-reranker-v2-m3** | - | 8192 | - | 重排序模型（非嵌入） |

---

## 4. 双塔 vs 交叉编码器

| 架构 | 计算方式 | 速度 | 精度 | 适用场景 |
|------|----------|------|------|----------|
| **双塔 (Bi-Encoder)** | query/doc 独立编码 → 余弦相似度 | 快 (预计算) | 中 | 大规模检索（百万级） |
| **交叉编码器 (Cross-Encoder)** | query+doc 联合输入 → 相关度分数 | 慢 (不可预计算) | 高 | 精排/重排序 (top-K) |
| **混合方案** | 双塔粗排 → 交叉编码器精排 | 中 | 最高 | **RAG 最佳实践** |

```
RAG 检索流水线:
Query → Embedding Model → 向量数据库 Top-100 → Reranker → Top-5 → LLM
         (双塔, ms级)        (ANN 检索)       (交叉编码器)
```

---

## 5. 关键指标

| 指标 | 说明 |
|------|------|
| **MTEB** (Massive Text Embedding Benchmark) | 综合评测（检索/分类/聚类/STS/重排序） |
| **NDCG@10** | 排序质量指标（检索任务） |
| **Recall@K** | 前 K 个结果中相关文档的召回率 |
| **余弦相似度** | 向量间语义距离度量 |
| **QPS** (Queries Per Second) | 嵌入计算吞吐量 |

---

## 6. 嵌入模型在 AI Stack 中的应用

| 功能 | 说明 |
|------|------|
| **知识库** | 文档切分 → Embedding → 向量索引 → 语义检索 |
| **RAG 应用** | 基于知识库的检索增强生成 |
| **预置模型** | Qwen3-Embedding-8B（嵌入）、bge-reranker-v2-m3（重排序） |
| **智能切分** | 支持 doc/docx/pdf/txt 的智能文档切分 |

---

## 7. 工程最佳实践

| 关注点 | 建议 |
|--------|------|
| **维度选择** | 768 维适合小规模，1024+ 维适合高精度场景 |
| **[[concepts/matryoshka-representation-learning|Matryoshka 表示]]** | 允许截断到更低维度（如 1024→256），灵活适配 |
| **批处理** | GPU 批量编码（batch_size=64-256）提高吞吐 |
| **归一化** | 嵌入向量 L2 归一化后可用内积替代余弦相似度 |
| **缓存** | 对静态文档预计算嵌入并缓存，避免重复计算 |
| **多语言** | 选择多语言嵌入模型（如 bge-m3）处理中英混合场景 |

---

## 8. 局限与开放问题

1. **语义鸿沟**：嵌入模型无法完美捕获否定、条件、因果关系
2. **长文档**：8192+ token 文档的嵌入质量下降
3. **领域适配**：通用嵌入在垂直领域（医疗/法律）需微调
4. **实时更新**：文档更新后需重新计算嵌入
5. **评估偏差**：MTEB 基准以英文为主，中文评估体系仍在建设

---

## Related

- [[concepts/rag-systems]] — RAG 系统（嵌入模型的核心应用）
- [[concepts/vector-database]] — 向量数据库（嵌入的存储与检索）
- [[concepts/llm-architectures]] — LLM 架构
- [[concepts/embeddings-vectors-mrl-plain]] — Embedding、向量与 MRL 大白话
- [[11_RAG_Systems/Sentence_Transformers_Deep_Dive]] — Sentence Transformers
- [[11_RAG_Systems/Matryoshka_Representation_Learning_Deep_Dive]] — Matryoshka Representation Learning 深度解析
- [[11_RAG_Systems/Embedding_Models_Guide]] — Embedding 模型选型与实践指南
- [[09_Deployment_Inference/Inference_Performance/Embedding_Model_Serving|Embedding/Reranker 服务]]
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack
