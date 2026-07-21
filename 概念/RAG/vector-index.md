---
title: "Vector Index"
category: -concepts
tags: ["rag", "vector-database", "indexing", "approximate-nearest-neighbor"]
summary: "Vector Index 是向量数据库用于加速相似度搜索的数据结构，常见类型包括 HNSW、IVF、FLAT 等，直接影响 RAG 检索延迟和召回率。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "向量索引"
relationships:
  - target: "概念/RAG/vector-database"
    type: part_of
  - target: "概念/RAG/hnsw"
    type: implemented_by
  - target: "概念/RAG/ivf"
    type: implemented_by
sources:
  - "https://arxiv.org/abs/1603.09320"  # HNSW
---

# Vector Index

> **一句话理解**: 向量索引就是向量数据库里的「快速查找表」，让海量向量中找最相似的几个不用暴力遍历。

## 为什么需要索引

暴力搜索（Brute Force）需要计算查询向量与所有向量的距离，复杂度 O(N×D)。当 N=1亿、D=1536 时，单次查询需 1536 亿次浮点运算——不可接受。索引通过牺牲少量精度换取数量级的速度提升。

## 索引类型全景

| 索引 | 原理 | 延迟 | 内存 | 召回率 | 适用规模 |
|------|------|------|------|--------|----------|
| **FLAT** | 暴力精确搜索 | 高 | 低 | 100% | <100万 |
| **HNSW** | 分层图索引 | 极低 | 高 | 95-99% | <10亿 |
| **IVF_FLAT** | 聚类 + 精确 | 中 | 中 | 90-95% | 大规模 |
| **IVF_PQ** | 聚类 + 量化 | 低 | 极低 | 85-92% | 超大规模 |
| **DiskANN** | 磁盘图索引 | 低 | 极低 | 95%+ | 十亿级 |
| **ScaNN** | 各向异性量化 | 低 | 低 | 93-97% | 大规模 |

## 索引选型决策树

```
数据规模？
├─ <100万 → FLAT (精确，无需调参)
├─ 100万-10亿
│   ├─ 内存充足？ → HNSW (最快最准)
│   └─ 内存受限？ → IVF_PQ (省内存)
└─ >10亿
    ├─ 有 GPU？ → GPU-IVF / ScaNN
    └─ 纯 CPU？ → DiskANN / IVF_PQ
```

## 距离度量

| 度量 | 公式 | 适用 |
|------|------|------|
| **Cosine** | 1 - cos(A,B) | 文本语义（最常用） |
| **Euclidean (L2)** | √Σ(aᵢ-bᵢ)² | 图像特征 |
| **Inner Product** | -Σ(aᵢ×bᵢ) | 已归一化向量 |
| **Manhattan (L1)** | Σ|aᵢ-bᵢ| | 稀疏向量 |

## 主流向量数据库的索引支持

| 数据库 | 支持索引 | 特点 |
|--------|----------|------|
| **Qdrant** | HNSW | 纯 HNSW，简单高效 |
| **Milvus** | HNSW, IVF, DiskANN, GPU | 最全面 |
| **Pinecone** |  proprietary | 全托管，无需配置 |
| **Weaviate** | HNSW | 内置混合检索 |
| **pgvector** | IVF, HNSW | PostgreSQL 扩展 |
| **Chroma** | HNSW | 轻量级，开发用 |

## 性能基准参考

| 索引 | 100万向量查询延迟 | 召回率@10 | 内存占用 |
|------|------------------|----------|----------|
| FLAT | ~500ms | 100% | 6GB |
| HNSW (M=32) | ~2ms | 98% | 8GB |
| IVF (nprobe=32) | ~10ms | 93% | 6GB |
| IVF_PQ | ~5ms | 88% | 0.5GB |

## 最佳实践

1. **默认 HNSW**：除非内存极度受限，否则 HNSW 是最佳选择
2. **先 FLAT 验证**：开发时用 FLAT 确认检索逻辑正确
3. **监控召回率**：定期用 FLAT 对比 ANN 结果
4. **维度选择**：1536维是文本主流，过高增加内存和延迟
5. **批量插入**：构建索引时批量写入，避免逐条插入

## Related

- [[概念/RAG/hnsw|HNSW]] — 图索引（最常用）
- [[概念/RAG/ivf|IVF]] — 聚类索引（省内存）
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库
- [[概念/RAG/bm25|BM25]] — 关键词检索（互补）
- [[RAG系统/Vector_Databases/Vector_Databases|向量数据库专题]]
