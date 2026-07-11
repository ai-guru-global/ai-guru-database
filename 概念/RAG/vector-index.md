---
title: "Vector Index"
category: -concepts
tags: ["rag", "vector-database", "indexing", "approximate-nearest-neighbor", "alibaba-cloud"]
summary: "Vector Index 是向量数据库用于加速相似度搜索的数据结构，常见类型包括 HNSW、IVF、FLAT 等，直接影响 RAG 检索延迟和召回率。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "向量索引"
relationships:
  - target: "概念/vector-database"
    type: part_of
  - target: "概念/hnsw"
    type: implemented_by
  - target: "概念/ivf"
    type: implemented_by
sources: []
---

# Vector Index

> **一句话理解**: 向量索引就是向量数据库里的「快速查找表」，让海量向量中找最相似的几个不用暴力遍历。

## 核心要点

- **近似最近邻（ANN）**: 用索引牺牲少量精度换取大幅速度提升。
- **常见类型**:
  - FLAT: 暴力精确搜索，适合小数据
  - HNSW: 图索引，速度快、内存高
  - IVF: 聚类索引，内存低、适合大数据
  - PQ/IVF_PQ: 量化索引，极省内存
- **选型依据**: 数据规模、内存预算、延迟要求、召回率要求。

## 选型对比

| 索引 | 延迟 | 内存 | 召回率 | 规模 |
|------|------|------|--------|------|
| FLAT | 高 | 低 | 100% | <100万 |
| HNSW | 低 | 高 | 高 | <10亿 |
| IVF_FLAT | 中 | 中 | 中高 | 大规模 |
| IVF_PQ | 低 | 很低 | 中 | 超大规模 |

## 阿里云专有云关联

在阿里云专有云 RAG 系统中，向量索引选型和参数调优是检索性能的核心。不同向量数据库（Qdrant、Milvus、Weaviate）支持的索引类型和参数略有差异。

## Related

- [[概念/hnsw|HNSW]]
- [[概念/ivf|IVF]]
- [[概念/vector-database|Vector Database]]
- [[概念/retrieval-latency|Retrieval Latency]]
