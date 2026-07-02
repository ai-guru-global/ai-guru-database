---
title: "Retrieval Latency"
category: -concepts
tags: ["rag", "retrieval", "vector-database", "latency", "optimization", "alibaba-cloud"]
summary: "Retrieval Latency 指 RAG 系统中从用户查询到返回相关文档片段的时间，受 embedding、向量索引、过滤、reranker 等多环节影响。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "检索延迟"
relationships:
  - target: "_concepts/rag-systems"
    type: part_of
  - target: "_concepts/vector-database"
    type: related_to
  - target: "_concepts/hnsw"
    type: mitigated_by
sources: []
---

# Retrieval Latency

> **一句话理解**: 检索延迟就是 RAG 系统「找答案」用了多久——从把问题转成向量，到从向量库搜出相关文档，再到排序返回。

## 核心要点

- **构成**: embedding 耗时 + 向量搜索耗时 + payload 过滤耗时 + reranker 耗时。
- **主要影响因素**: 索引类型、top_k、过滤条件、reranker 模型大小、embedding 模型延迟。
- **优化方向**: 索引选型、缓存、批处理、减少候选数、轻量 reranker。
- **监控指标**: p50/p95/p99 retrieval latency、QPS、索引命中率。

## 优化阶梯

| 步骤 | 优化 | 效果 |
|------|------|------|
| 1 | 使用 HNSW 索引 | 降低向量搜索延迟 |
| 2 | 给过滤字段加索引 | 减少 payload 扫描 |
| 3 | 减小 top_k | 降低 reranker 输入 |
| 4 | 使用轻量 reranker | 降低排序延迟 |
| 5 | 部署 query 缓存 | 命中时省掉 embedding 和搜索 |
| 6 | 批处理 embedding | 提高吞吐 |

## 阿里云专有云关联

在阿里云专有云环境中，RAG 检索延迟优化需结合私有化部署的向量数据库（Qdrant/Milvus/Weaviate）、embedding 服务（PAI-EAS）和 OSS 文档存储进行综合调优。

## Related

- [[_concepts/rag-systems|RAG Systems]]
- [[_concepts/vector-database|Vector Database]]
- [[_concepts/hnsw|HNSW]]
- [[_concepts/hybrid-search|Hybrid Search]]
- [[_concepts/cross-encoder|Cross-Encoder]]
- [[14_RAG_Systems/Advanced_RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]
