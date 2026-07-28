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
name_zh: "向量索引"
---

# Vector Index

> 中文简称：向量索引

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
- [[14_RAG系统/03_Vector_Databases/rag-vector-database|向量数据库专题]]

## 2026 向量索引生态现状

| 索引类型 | 代表 | 召回率 | 速度 | 内存 | 适用场景 |
|------|------|------|------|------|------|
| HNSW | hnswlib | 95%+ | 极快 | 高 | 通用首选 |
| IVF | Faiss | 90%+ | 快 | 中 | 大规模 |
| PQ | Faiss | 85%+ | 快 | 低 | 内存受限 |
| DiskANN | Microsoft | 95%+ | 快 | 低 | 超大规模 |
| ScaNN | Google | 93%+ | 极快 | 中 | 高吐吐量 |
| GPU-IVF | Faiss-GPU | 90%+ | 极极快 | GPU | 批量检索 |

## 索引选择指南

- **< 1M 向量**：HNSW（简单高效）
- **1M-100M**：IVF + PQ（平衡内存和速度）
- **> 100M**：DiskANN 或分布式索引
- **批量检索**：GPU-IVF（Faiss-GPU）
- **实时检索**：HNSW + 缓存

## 检查清单

- [ ] 索引类型与数据规模匹配
- [ ] 召回率已验证（> 90%）
- [ ] 检索延迟已测试
- [ ] 内存占用已评估
- [ ] 索引构建时间已评估
- [ ] 增量更新已支持

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 召回率低 | 索引参数不当 | 调整 nprobe/ef_search |
| 检索慢 | 索引未优化 | 使用 HNSW 或 GPU 加速 |
| 内存不足 | 索引太大 | 使用 PQ 量化或 DiskANN |
| 构建慢 | 数据量大 | 分布式构建 + GPU 加速 |

## 延伸阅读

- [[概念/RAG/hnsw|HNSW]] — 图索引详解
- [[概念/RAG/ivf|IVF]] — 聚类索引详解
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库
- [[概念/RAG/bm25|BM25]] — 关键词检索
- [[14_RAG系统/03_Vector_Databases/rag-vector-database|向量数据库专题]]

> ℹ️ 向量索引是 RAG 检索的核心，2026年 HNSW 仍是通用首选，DiskANN 和 GPU 加速索引在超大规模场景表现突出。

## 索引参数调优指南

| 索引 | 关键参数 | 推荐值 | 影响 |
|------|------|------|------|
| HNSW | M | 16-64 | 图连接数，越大召回越高 |
| HNSW | efConstruction | 200-500 | 构建质量 |
| HNSW | efSearch | 50-200 | 检索精度 vs 速度 |
| IVF | nlist | sqrt(N) | 聚类数 |
| IVF | nprobe | 10-100 | 检索精度 vs 速度 |
| PQ | m | 8-32 | 子向量数 |
| PQ | nbits | 8 | 每子向量位数 |

## 索引构建性能参考

| 数据规模 | HNSW 构建 | IVF 构建 | GPU 加速 |
|------|------|------|------|
| 1M | 30s | 10s | 5s |
| 10M | 5min | 1min | 30s |
| 100M | 1h | 10min | 5min |

## 2026 向量索引生态现状

| 索引类型 | 代表实现 | 适用规模 | 特色 | 状态 |
|------|------|------|------|------|
| HNSW | hnswlib/FAISS | 1M-100M | 高召回、纯内存 | ✅ 主流 |
| IVF | FAISS | 10M-1B | 低内存、可量化 | ✅ 成熟 |
| DiskANN | Microsoft | 100M-10B | 磁盘友好 | ✅ 成熟 |
| ScaNN | Google | 10M-1B | 各向异性量化 | ✅ 成熟 |
| GPU-RAFT | NVIDIA | 100M+ | GPU 加速 | ✅ 主流 |

## 检查清单

- [ ] 索引类型已根据数据规模和查询模式选择
- [ ] 参数已调优（召回率 vs 延迟 vs 内存）
- [ ] 量化方案已评估（PQ/SQ/Binary）
- [ ] 索引构建时间已纳入运维窗口
- [ ] 监控已接入（构建进度/查询延迟）
- [ ] 扩容方案已规划

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 召回率低 | 参数太保守 | 增大 ef/nprobe |
| 内存不足 | HNSW 全量加载 | 改用 IVF+PQ 或 DiskANN |
| 构建太慢 | 数据量大 | GPU 加速或分批构建 |
| 延迟波动 | 内存压力 | 增加内存或减少数据 |

## 延伸阅读

- [[概念/RAG/hnsw|HNSW]] — 主流图索引
- [[概念/RAG/ivf|IVF]] — 倒排索引
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库
- [[概念/RAG/retrieval-latency|Retrieval Latency]] — 检索延迟
- [[14_RAG系统/03_Vector_Databases/rag-vector-database|向量数据库专题]]

> ℹ️ 向量索引选型：< 100M 用 HNSW，> 100M 用 IVF+PQ 或 DiskANN，GPU 可用选 RAFT，始终平衡召回率/延迟/内存三角。
