---
title: "HNSW"
category: -concepts
tags: ["rag", "vector-database", "indexing", "approximate-nearest-neighbor", "alibaba-cloud"]
summary: "HNSW（Hierarchical Navigable Small World）是一种基于图的近似最近邻搜索算法，是向量数据库中常用的索引类型，查询速度快、精度高。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Hierarchical Navigable Small World"
relationships:
  - target: "_concepts/vector-index"
    type: is_a
  - target: "_concepts/vector-database"
    type: used_by
  - target: "_concepts/retrieval-latency"
    type: mitigates
sources: []
---

# HNSW

> **一句话理解**: HNSW 是向量数据库里常用的「分层图索引」，通过构建多层邻居图实现快速近似最近邻搜索。

## 核心要点

- **分层图结构**: 底层密集图保证召回，上层稀疏图加速搜索。
- **近似最近邻**: 不保证绝对最近，但速度和精度平衡好。
- **关键参数**:
  - `M`: 每个节点最大邻居数
  - `efConstruction`: 构建时搜索范围
  - `ef`: 查询时搜索范围
- **优点**: 查询快、精度高
- **缺点**: 内存占用大、构建慢

## 参数调优

| 参数 | 增大效果 | 副作用 |
|------|---------|--------|
| M | 召回率提高 | 内存和构建时间增加 |
| efConstruction | 图质量提高 | 构建更慢 |
| ef | 查询精度提高 | 查询更慢 |

## 阿里云专有云关联

在阿里云专有云 RAG 系统中，HNSW 是私有化向量数据库（如 Qdrant、Milvus）最常用的索引类型。工单中「检索召回率低」时，可调大 `ef` 或 `M`。

## Related

- [[_concepts/vector-index|Vector Index]]
- [[_concepts/ivf|IVF]]
- [[_concepts/vector-database|Vector Database]]
- [[_concepts/retrieval-latency|Retrieval Latency]]
- [[14_RAG_Systems/Advanced_RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]
