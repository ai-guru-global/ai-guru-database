---
title: "HNSW"
category: -concepts
tags: ["rag", "vector-database", "indexing", "approximate-nearest-neighbor"]
summary: "HNSW（Hierarchical Navigable Small World）是一种基于图的近似最近邻搜索算法，是向量数据库中常用的索引类型，查询速度快、精度高。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Hierarchical Navigable Small World"
relationships:
  - target: "概念/RAG/vector-index"
    type: is_a
  - target: "概念/RAG/vector-database"
    type: used_by
sources:
  - "https://arxiv.org/abs/1603.09320"  # HNSW paper
---

# HNSW

> **一句话理解**: HNSW 是向量数据库里常用的「分层图索引」，通过构建多层邻居图实现快速近似最近邻搜索。

## 核心原理

### 分层图结构

```
Layer 2 (稀疏):    A ─────────── D
                    │                 │
Layer 1 (中等):    A ─── B ─── C ─── D
                    │     │     │     │
Layer 0 (密集):    A─B─C─D─E─F─G─H─I─J  ← 所有节点
```

- **底层 (Layer 0)**：包含所有节点，连接密集，保证召回率
- **上层**：节点稀疏，连接远距离节点，加速搜索
- **搜索过程**：从顶层开始贪心搜索，逐层下降直到底层

### 搜索算法

```
1. 从最高层的入口点开始
2. 在当前层贪心搜索最近邻
3. 到达局部最优后，下降到下一层
4. 重复 2-3 直到 Layer 0
5. 在 Layer 0 扩展搜索范围 (ef)
6. 返回 Top-K 结果
```

## 关键参数

| 参数 | 作用 | 典型值 | 增大效果 |
|------|------|--------|----------|
| **M** | 每个节点最大邻居数 | 16-64 | 召回率↑，内存↑，构建慢 |
| **efConstruction** | 构建时搜索范围 | 100-500 | 图质量↑，构建更慢 |
| **ef** | 查询时搜索范围 | 50-200 | 查询精度↑，查询更慢 |

### 参数调优指南

| 场景 | M | efConstruction | ef |
|------|---|---|---|
| 快速原型 | 16 | 100 | 50 |
| 生产平衡 | 32 | 200 | 100 |
| 高精度 | 64 | 400 | 200 |
| 内存受限 | 12 | 100 | 50 |

## HNSW vs 其他索引

| 索引类型 | 查询速度 | 召回率 | 内存 | 构建速度 | 适用 |
|----------|----------|--------|------|----------|------|
| **HNSW** | 极快 | 高 (95-99%) | 高 | 慢 | 通用首选 |
| **IVF** | 快 | 中 (90-95%) | 低 | 快 | 内存受限 |
| **Flat (Brute Force)** | 慢 | 100% | 低 | 无 | 小数据集 |
| **PQ** | 快 | 中 | 极低 | 中 | 超大规模 |
| **DiskANN** | 快 | 高 | 极低 | 慢 | 十亿级 |

## 实战示例

### Qdrant

```python
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

client = QdrantClient("localhost", port=6333)

client.create_collection(
    collection_name="docs",
    vectors_config=VectorParams(
        size=1536,
        distance=Distance.COSINE
    ),
    hnsw_config={
        "m": 32,
        "ef_construct": 200
    }
)

# 查询时设置 ef
results = client.search(
    collection_name="docs",
    query_vector=query_embedding,
    limit=10,
    search_params={"hnsw_ef": 128}
)
```

### Milvus

```python
index_params = {
    "index_type": "HNSW",
    "metric_type": "COSINE",
    "params": {"M": 32, "efConstruction": 200}
}

collection.create_index("embedding", index_params)

# 查询
results = collection.search(
    data=[query_vector],
    anns_field="embedding",
    param={"ef": 128},
    limit=10
)
```

## 内存估算

```
每个向量内存 ≈ 向量维度 × 4 bytes (float32) + M × 2 × 8 bytes (邻居指针)

示例 (1536维, M=32):
  向量: 1536 × 4 = 6KB
  邻居: 32 × 2 × 8 = 512B
  总计: ~6.5KB / 向量
  100万向量: ~6.5GB
```

## 最佳实践

1. **默认选 HNSW**：除非内存极度受限，否则 HNSW 是最佳选择
2. **M=32 起步**：大多数场景 M=32 即可达到 95%+ 召回
3. **ef 动态调节**：开发时用高 ef 验证，生产时降低 ef 提速
4. **监控召回率**：定期用暴力搜索对比 HNSW 结果
5. **考虑量化**：内存不足时配合 PQ/SQ 量化减少占用

## Related

- [[概念/RAG/vector-index|Vector Index]] — 向量索引总览
- [[概念/RAG/ivf|IVF]] — 另一种向量索引
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库
- [[概念/RAG/bm25|BM25]] — 关键词检索（互补）
- [[RAG系统/Vector_Databases/Vector_Databases|向量数据库专题]]
- [[RAG系统/Advanced_RAG/RAG_Retrieval_Latency_Optimization|检索延迟优化]]

## 2026 HNSW 生态现状

| 实现/库 | 语言 | 特色 | 状态 |
|------|------|------|------|
| hnswlib | C++/Python | 轻量、纯内存 | ✅ 成熟 |
| FAISS HNSW | C++/Python | GPU 加速、Meta | ✅ 成熟 |
| Milvus HNSW | Go/C++ | 分布式、持久化 | ✅ 主流 |
| Qdrant HNSW | Rust | 高性能、过滤 | ✅ 主流 |
| pgvector | C | PostgreSQL 集成 | ✅ 主流 |
| Lucene HNSW | Java | ES/Solr 集成 | ✅ 成熟 |

## 参数调优指南

| 参数 | 建议值 | 影响 | 调优方向 |
|------|------|------|------|
| M | 16-64 | 连接数/内存 | 召回率低→增大 M |
| ef_construction | 100-500 | 构建质量 | 召回率低→增大 |
| ef_search | 50-500 | 查询精度 | 延迟高→减小 |
| max_elements | 预估×1.5 | 容量 | 预留扩容空间 |

## 检查清单

- [ ] M 和 ef_construction 已根据数据规模调优
- [ ] ef_search 已平衡延迟与召回率
- [ ] 内存容量已规划（向量数 × 维度 × 4B + 索引开销）
- [ ] 量化方案已评估（PQ/SQ/Binary）
- [ ] 索引构建时间已纳入运维窗口
- [ ] 监控已接入（QPS/延迟/内存）

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 召回率 < 90% | ef_search 太小 | 增大 ef_search 至 200+ |
| 内存 OOM | M 太大或数据超量 | 减小 M 或启用量化 |
| 构建时间过长 | ef_construction 太大 | 降低 ef_construction |
| 延迟波动大 | 内存不足触发 swap | 增加内存或减少数据 |

> ℹ️ HNSW 是 2026 年向量检索的事实标准索引，核心调优三角：M（内存）↔ ef_search（ 延迟）↔ 召回率，生产环境建议 M=32, ef_search=128 作为起点。

## 内存估算公式

```
内存 ≈ 向量数 × (维度 × 4B + M × 2 × 8B)
示例: 1M × 768维, M=32 → ~3.5 GB
```
