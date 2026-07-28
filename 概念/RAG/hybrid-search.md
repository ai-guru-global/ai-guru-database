---
title: "Hybrid Search"
category: -concepts
tags: ["rag", "retrieval", "vector-search", "keyword-search", "fusion"]
summary: "Hybrid Search（混合检索）是同时结合向量检索和关键词检索，再融合结果，以兼顾语义相关性和精确匹配的检索策略。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "混合检索"
  - "Hybrid Retrieval"
relationships:
  - target: "概念/RAG/bm25"
    type: uses
  - target: "概念/RAG/vector-database"
    type: uses
sources:
  - "https://arxiv.org/abs/2210.11934"  # RRF paper
name_zh: "混合检索"
---

# Hybrid Search

> 中文简称：混合检索

> **一句话理解**: 混合检索就是「向量找语义相关 + 关键词找精确匹配」，再把两边结果融合起来，召回更全面。

## 为什么需要混合检索

| 查询类型 | 向量检索 | BM25 | 混合 |
|----------|----------|------|------|
| "如何优化数据库性能" | ✅ 语义理解 | ❌ 无精确匹配 | ✅ |
| "RTX 4090 显存" | ❌ 可能丢失型号 | ✅ 精确匹配 | ✅ |
| "NullPointerException" | ❌ 语义无关 | ✅ 精确匹配 | ✅ |
| "机器学习入门教程" | ✅ 语义相似 | △ 部分匹配 | ✅ |

## 典型流程

```text
Query → Embedding + Tokenization
            ↓           ↓
    Vector Search    BM25 Search
     (Top-K₁)       (Top-K₂)
            ↓           ↓
        Fusion (RRF / Weighted)
                    ↓
              Rerank (Cross-Encoder)
                    ↓
              Final Top-K → LLM
```

## 融合策略

### 1. RRF (Reciprocal Rank Fusion)

```python
def rrf_score(rank, k=60):
    """RRF 分数：只依赖排名，不依赖分数"""
    return 1.0 / (k + rank)

# 融合两路结果
def rrf_fusion(vector_results, bm25_results, k=60):
    scores = {}
    for rank, doc in enumerate(vector_results):
        scores[doc.id] = scores.get(doc.id, 0) + rrf_score(rank, k)
    for rank, doc in enumerate(bm25_results):
        scores[doc.id] = scores.get(doc.id, 0) + rrf_score(rank, k)
    return sorted(scores.items(), key=lambda x: -x[1])
```

**优势**：无需分数归一化，简单有效，是 2026 年最流行的融合方法。

### 2. 加权求和

```python
final_score = α * vector_score + (1-α) * bm25_score
# α 通常 0.5-0.7，需归一化分数到 [0,1]
```

### 3. 两阶段策略

```
第一阶段: BM25 粗召回 (Top-100)
第二阶段: 向量重排序 (Top-10)
```

## 实战示例

### Qdrant 混合检索

```python
from qdrant_client import QdrantClient

client = QdrantClient("localhost")

# 向量 + 全文混合查询
results = client.query_points(
    collection_name="docs",
    prefetch=[
        # 向量检索
        Prefetch(query=dense_embedding, using="dense", limit=20),
        # 稀疏向量 (BM25-like)
        Prefetch(query=sparse_vector, using="sparse", limit=20),
    ],
    # RRF 融合
    query=FusionQuery(fusion=Fusion.RRF),
    limit=10
)
```

### Elasticsearch 8.x kNN + BM25

```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {"standard": {"query": {"match": {"content": "RAG 检索"}}}},
        {"knn": {"field": "embedding", "query_vector": [...], "k": 10}}
      ]
    }
  }
}
```

## 效果对比

| 检索方式 | Recall@10 | MRR | 延迟 |
|----------|-----------|-----|------|
| 纯向量 | 82% | 0.71 | 15ms |
| 纯 BM25 | 75% | 0.65 | 5ms |
| 混合 (RRF) | 91% | 0.82 | 20ms |
| 混合 + Rerank | 94% | 0.87 | 50ms |

## 最佳实践

1. **默认用 RRF**：无需调参，效果稳定
2. **两路各取 Top-20-50**：融合后取 Top-10
3. **加 Reranker**：融合后用 Cross-Encoder 精排效果更佳
4. **调整比例**：专业术语多的领域加大 BM25 权重
5. **监控召回**：定期评估混合 vs 单路的效果差异

## Related

- [[概念/RAG/bm25|BM25]] — 关键词检索
- [[概念/RAG/vector-database|Vector Database]] — 向量检索
- [[概念/RAG/hnsw|HNSW]] — 向量索引
- [[14_RAG系统/04_Advanced_RAG/Hybrid_Search|混合检索专题]] — 深度解析
- [[14_RAG系统/04_Advanced_RAG/RAG_Retrieval_Latency_Optimization|检索延迟优化]]

## 2026 混合检索生态现状

| 融合策略 | 说明 | 效果 | 状态 |
|------|------|------|------|
| RRF | 倒数排名融合 | 简单有效 | ✅ 主流 |
| 加权求和 | 分数加权 | 可调 | ✅ 成熟 |
| 学习融合 | ML 模型 | 最优 | 🟡 发展中 |
| 级联 | 先 BM25 后向量 | 高效 | ✅ 成熟 |
| 并行 | 同时检索融合 | 全面 | ✅ 成熟 |

## 检查清单

- [ ] BM25 和向量检索均已配置
- [ ] 融合策略已选择（RRF/加权）
- [ ] 权重已调优
- [ ] 分词器已配置（中文）
- [ ] 性能已测试
- [ ] 召回率已验证

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 融合效果差 | 权重不当 | 网格搜索调优权重 |
| BM25 召回低 | 未分词 | 配置中文分词器 |
| 延迟增加 | 双路检索 | 并行检索 + 缓存 |
| 结果重复 | 未去重 | 文档 ID 去重 |

## 延伸阅读

- [[概念/RAG/bm25|BM25]] — 关键词检索
- [[概念/RAG/vector-database|Vector Database]] — 向量检索
- [[概念/RAG/reranker|Reranker]] — 重排序
- [[概念/RAG/retrieval-latency|Retrieval Latency]] — 检索延迟
- [[14_RAG系统/04_Advanced_RAG/Hybrid_Search|混合检索专题]]

> ℹ️ 混合检索是 2026年 RAG 生产标配，BM25 + 向量 + RRF 融合在大多数场景下效果最佳，配合 Reranker 进一步提升质量。

## 混合检索配置示例

```python
# RRF 融合示例
def rrf_score(rank_list, k=60):
    return sum(1.0 / (k + rank) for rank in rank_list)

# BM25 结果 + 向量结果 → RRF 融合 → Rerank
bm25_results = bm25_search(query, top_k=50)
vector_results = vector_search(query, top_k=50)
merged = rrf_merge(bm25_results, vector_results)
reranked = reranker.rerank(query, merged[:20])
```

## 权重调优参考

| 场景 | BM25 权重 | 向量权重 | 说明 |
|------|------|------|------|
| 通用问答 | 0.3 | 0.7 | 语义为主 |
| 精确查找 | 0.7 | 0.3 | 关键词为主 |
| 代码搜索 | 0.5 | 0.5 | 平衡 |
| 法律文档 | 0.6 | 0.4 | 术语精确 |
