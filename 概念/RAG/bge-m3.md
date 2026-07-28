---
title: "BGE-M3"
category: -concepts
tags: ["bge-m3", "embedding", "multilingual", "hybrid-retrieval", "baai"]
relationships:
  - target: "概念/RAG/embedding-models"
    type: part_of
  - target: "概念/RAG/hybrid-search"
    type: complements
sources:
  - 14_RAG系统/02_Embeddings/
summary: "BGE-M3 是智源（BAAI）开源的多语言嵌入模型，以 Multi-Lingual（100+语言）、Multi-Functionality（稠密/稀疏/多向量三合一）、Multi-Granularity（最长8192 token）著称，是中文 RAG 场景的主力嵌入模型。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: supporting
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "BGE-M3"
  - "bge-m3"
name_zh: "智源多语言嵌入模型"
---
# BGE-M3

> 中文简称：智源多语言嵌入模型

> 一个模型同时输出稠密、稀疏、多向量三种表示——"3M"由此得名。

---

## 1. 定义

**BGE-M3**（BAAI, 2024）是通用嵌入模型，"M3" 指三个 Multi：

| Multi | 含义 |
|-------|------|
| **Multi-Lingual** | 100+ 语言，中英跨语言检索强 |
| **Multi-Functionality** | 一次前向同时产出稠密向量、稀疏权重（词级）、ColBERT 式多向量 |
| **Multi-Granularity** | 句子到 8192 token 长文档均可编码 |

参数量 ~568M（XLM-RoBERTa-large 底座），输出维度 1024。

---

## 2. 三种检索模式

| 模式 | 表示 | 类似 | 适用 |
|------|------|------|------|
| **Dense** | 单一 1024 维向量 | 常规双塔 | 语义相似 |
| **Sparse** | 词-权重字典 | BM25/SPLADE | 关键词精确匹配 |
| **Multi-Vector** | 每 token 一向量，late interaction | ColBERT | 细粒度重排 |

生产常用组合：**Dense + Sparse 混合召回 → Multi-Vector 或 reranker 精排**，三路分数加权融合。

---

## 3. 使用示例

```python
from FlagEmbedding import BGEM3FlagModel
model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)
out = model.encode(["什么是知识蒸馏"],
                   return_dense=True, return_sparse=True,
                   return_colbert_vecs=True)
```

向量库适配：Milvus/Qdrant 原生支持 dense+sparse 混合索引。

---

## 4. 选型对比（中文 RAG）

| 模型 | 特点 |
|------|------|
| **BGE-M3** | 三合一、长文档、开源免费 |
| **bge-large-zh-v1.5** | 更轻量，纯稠密中文 |
| **Qwen3-Embedding** | 新一代、MTEB 榜单更高、支持指令 |
| **text-embedding-3** | OpenAI 闭源 API，多语言均衡 |
| **jina-embeddings-v3** | 长文档、task LoRA |

---

## Related

- [[概念/RAG/embedding-models]] — 嵌入模型总览
- [[概念/RAG/hybrid-search]] — 混合检索（BGE-M3 的主场）
- [[概念/RAG/colbert-late-interaction]] — ColBERT 晚交互
- [[概念/RAG/bm25]] — BM25（稀疏检索基线）
- [[概念/RAG/reranker]] — 重排器（常配 bge-reranker）

> ℹ️ 实践提示：BGE 系列配套 bge-reranker-v2-m3 重排器，"M3 召回 + reranker 精排"是中文 RAG 的经典开源组合。
