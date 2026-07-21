---
title: "Retrieval Latency"
category: -concepts
tags: ["rag", "retrieval", "vector-database", "latency", "optimization", "hnsw", "reranker"]
summary: "Retrieval Latency 指 RAG 系统中从用户查询到返回相关文档片段的时间，受 embedding、向量索引、过滤、reranker 等多环节影响。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "检索延迟"
relationships:
  - target: "概念/rag-systems"
    type: part_of
  - target: "概念/vector-database"
    type: related_to
  - target: "概念/hnsw"
    type: mitigated_by
sources: []
---

# Retrieval Latency（检索延迟）

> **一句话理解**: 检索延迟 = RAG 系统「找答案」用了多久——从把问题转成向量，到从向量库搜出相关文档，再到排序返回。

## 定义

Retrieval Latency 是 RAG 系统中从用户查询到返回相关文档片段的端到端时间，由 embedding 生成、向量搜索、payload 过滤、reranker 排序等多环节累加而成。

## 延迟构成

```
用户查询
  ↓
Embedding 生成 (10-50ms)
  ↓
向量搜索 (5-30ms)
  ↓
Payload 过滤 (1-10ms)
  ↓
Reranker 排序 (20-100ms)
  ↓
返回结果

总延迟: 36-190ms (P50)
```

## 优化阶梯

| 步骤 | 优化 | 效果 | 难度 |
|------|------|------|------|
| 1 | 使用 HNSW 索引 | 向量搜索 < 10ms | 低 |
| 2 | 给过滤字段加索引 | 减少 payload 扫描 | 低 |
| 3 | 减小 top_k | 降低 reranker 输入 | 低 |
| 4 | 轻量 reranker | 排序延迟降 50% | 中 |
| 5 | Query 缓存 | 命中时省掉全流程 | 中 |
| 6 | 批处理 embedding | 提高吞吐 | 低 |
| 7 | GPU 加速 embedding | 延迟降 3-5x | 高 |

## 2026 年基准数据

| 向量库 | 1M 向量 P95 | 10M 向量 P95 | 特色 |
|---------|------------|-------------|------|
| **Qdrant** | 8ms | 15ms | Rust 实现、过滤强 |
| **Milvus** | 10ms | 20ms | 分布式、GPU 索引 |
| **Weaviate** | 12ms | 25ms | 混合搜索 |
| **pgvector** | 15ms | 50ms | PostgreSQL 原生 |
| **Chroma** | 20ms | 60ms | 轻量、嵌入式 |

## 生产最佳实践

1. **监控 P95/P99**：不只看平均值，尾部延迟影响用户体验
2. **HNSW 参数调优**：`ef_search` 越高越准但越慢，建议 128-256
3. **Reranker 是最大瓶颈**：考虑轻量 cross-encoder 或 ColBERT
4. **缓存热门查询**：Redis 缓存 embedding + 结果，命中率可达 30%+
5. **异步检索**：非实时场景可批量处理，提高吞吐

## Related

- [[概念/rag-systems|RAG Systems]]
- [[概念/vector-database|Vector Database]]
- [[概念/hnsw|HNSW]]
- [[概念/hybrid-search|Hybrid Search]]
- [[概念/RAG/reranker|Reranker]]
- [[概念/Inference/ttft|TTFT]] — 检索延迟影响首 token 时间
- [[RAG系统/Advanced_RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]
