---
title: "Hybrid Search"
category: -concepts
tags: ["rag", "retrieval", "vector-search", "keyword-search", "alibaba-cloud"]
summary: "Hybrid Search（混合检索）是同时结合向量检索和关键词检索，再融合结果，以兼顾语义相关性和精确匹配的检索策略。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "混合检索"
  - "Hybrid Retrieval"
relationships:
  - target: "_concepts/rag-systems"
    type: part_of
  - target: "_concepts/bm25"
    type: uses
  - target: "_concepts/vector-database"
    type: uses
---

# Hybrid Search

> **一句话理解**: 混合检索就是「向量找语义相关 + 关键词找精确匹配」，再把两边结果融合起来，召回更全面。

## 核心要点

- **向量检索**: 擅长语义相似，但可能漏掉关键词。
- **关键词检索**: 擅长精确匹配、专有名词、ID。
- **融合策略**:
  - RRF（Reciprocal Rank Fusion）: 按排名融合，无需分数可比
  - 加权求和: 向量分和关键词分按权重相加
  - 两阶段: 先关键词粗排，再向量精排

## 典型流程

```text
Query → Embedding + Tokenization
            ↓           ↓
    Vector Search    BM25 Search
            ↓           ↓
        Fusion (RRF / Weighted)
                    ↓
                Rerank
```

## 阿里云专有云关联

在阿里云专有云 RAG 系统中，混合检索常结合私有化向量数据库和 Elasticsearch/OpenSearch 实现。工单中「检索召回不全」时，可考虑引入 BM25 做补充。

## Related

- [[_concepts/bm25|BM25]]
- [[_concepts/vector-database|Vector Database]]
- [[_concepts/reranker|Reranker]]
- [[_concepts/rag-systems|RAG Systems]]
- [[14_RAG_Systems/Advanced_RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]
