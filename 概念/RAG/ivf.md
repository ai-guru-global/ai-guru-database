---
title: "IVF"
category: -concepts
tags: ["rag", "vector-database", "indexing", "approximate-nearest-neighbor", "quantization", "faiss"]
summary: "IVF（Inverted File Index）是一种基于聚类的近似最近邻搜索索引，通过 k-means 预分区将搜索空间缩小到 nprobe 个聚类，内存占用低、构建快，适合超大规模向量库。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Inverted File Index"
  - "倒排文件索引"
  - "IVF_FLAT"
  - "IVF_PQ"
relationships:
  - target: "概念/RAG/vector-index"
    type: is_a
  - target: "概念/RAG/vector-database"
    type: used_by
  - target: "概念/RAG/hnsw"
    type: alternative_to
  - target: "概念/RAG/hybrid-search"
    type: used_by
sources:
  - "https://arxiv.org/abs/1702.08734"  # Billion-scale similarity search with GPUs (Faiss)
---

# IVF

> **一句话理解**: IVF 先把向量聚成很多类，搜索时只扫最相关的几个类，用内存少、速度快，适合向量特别多的场景。

## 核心原理

### 构建阶段（离线）

```
1. 对所有向量执行 k-means 聚类 → 得到 nlist 个聚类中心 (centroids)
2. 每个向量分配到最近的聚类中心 → 形成 nlist 个倒排列表
3. [可选] 对每个倒排列表内的向量做 PQ/SQ 量化压缩
```

### 查询阶段（在线）

```
1. 计算 query 向量与所有 nlist 个聚类中心的距离
2. 选取最近的 nprobe 个聚类中心
3. 仅在这 nprobe 个倒排列表中做精确/近似距离计算
4. 返回 Top-K 结果
```

**关键洞察**: nprobe=1 时只扫 1/nlist 的数据，nprobe=nlist 退化为暴力搜索。

## IVF 变体家族

| 变体 | 存储方式 | 内存占用 | 召回率 | 适用场景 |
|------|----------|----------|--------|----------|
| **IVF_FLAT** | 原始 float32 向量 | 中 | 90-98% | 精度优先、中等规模 |
| **IVF_PQ** | PQ 量化编码 | 极低 | 85-92% | 超大规模、内存受限 |
| **IVF_SQ8** | 标量量化 (8bit) | 低 | 88-95% | 平衡精度与内存 |
| **IVF_SQ4** | 标量量化 (4bit) | 极低 | 82-88% | 极端内存受限 |
| **IVF_HNSW** | HNSW 加速聚类路由 | 高 | 95-99% | 高召回 + 大规模 |

## 关键参数调优

| 参数 | 说明 | 推荐值 | 影响 |
|------|------|--------|------|
| `nlist` | 聚类中心数 | `4×√N` ~ `16×√N` | 越大构建越慢，查询路由越精确 |
| `nprobe` | 查询扫描聚类数 | `nlist×5%~20%` | 越大召回越高、延迟越大 |
| `m` (PQ) | 子向量数 | `D/4` ~ `D/2` | 越大精度越高、内存越大 |
| `nbits` (PQ) | 每子向量编码位数 | 8 (标准) | 8→256 个码本中心 |

### 参数调优策略

```python
# Faiss 参数调优示例
import faiss
import numpy as np

d = 768        # 向量维度
N = 10_000_000 # 数据规模
nlist = 4096   # 聚类中心 ≈ 4×√N

# 构建 IVF_PQ 索引
quantizer = faiss.IndexFlatIP(d)
index = faiss.IndexIVFPQ(quantizer, d, nlist, 48, 8)  # m=48, nbits=8

# 训练（需要训练数据）
train_data = np.random.randn(100_000, d).astype('float32')
index.train(train_data)

# 添加向量
index.add(vectors)

# 查询时调整 nprobe
index.nprobe = 64  # 扫描 64 个聚类
D, I = index.search(query_vectors, k=10)
```

## PQ（Product Quantization）量化原理

```
原始向量 [768维 float32 = 3072 bytes]
    ↓ 切分为 m=48 个子向量 [每段 16维]
    ↓ 每段用 256 个码本中心量化为 1 byte
量化编码 [48 bytes] → 压缩比 64×
```

**ADC（非对称距离计算）**: 查询向量保持原始精度，仅对库内向量做量化，兼顾速度与精度。

## 与 HNSW 对比

| 特性 | HNSW | IVF_FLAT | IVF_PQ |
|------|------|----------|--------|
| 查询延迟 | 极低 (1-5ms) | 中 (5-20ms) | 低 (3-10ms) |
| 内存占用 | 高 (原始+图) | 中 (原始) | 极低 (编码) |
| 构建速度 | 慢 | 快 | 快 |
| 增量更新 | 支持 | 需重训聚类 | 需重训聚类 |
| 适合规模 | <10亿 | 1-10亿 | >10亿 |
| 召回率@10 | 95-99% | 90-98% | 85-92% |
| GPU 加速 | 有限 | 支持 | 原生支持 |

## 主流平台支持

| 平台 | IVF 支持 | 特色 |
|------|----------|------|
| **Faiss** | IVF_FLAT/PQ/SQ/HNSW | GPU 加速、最完整变体 |
| **Milvus** | IVF_FLAT/PQ/SQ8 | 分布式、自动调参 |
| **Qdrant** | 无原生 IVF | 使用 HNSW + 量化替代 |
| **Weaviate** | 无原生 IVF | HNSW + PQ 压缩 |
| **pgvector** | ivfflat | PostgreSQL 原生、SQL 接口 |
| **阿里云 DashVector** | IVF_PQ | 全托管、自动分片 |

## 选型决策指南

```
数据规模 > 1亿？
├─ 是 → 内存预算？
│   ├─ 充足 (>100GB) → IVF_FLAT (高精度)
│   ├─ 有限 (10-100GB) → IVF_SQ8 (平衡)
│   └─ 极有限 (<10GB) → IVF_PQ (极致压缩)
└─ 否 → 考虑 HNSW（更快更准）

需要 GPU 加速？ → Faiss GPU IVF
需要增量更新？ → 考虑 HNSW 或定期重训
```

## 生产最佳实践

1. **nlist 选择**: 数据量 N=1亿时，nlist=4096~16384；过小导致聚类不精确，过大增加路由开销
2. **nprobe 动态调整**: 根据延迟 SLO 动态设置，低峰期增大 nprobe 提升召回
3. **训练数据**: 至少 nlist×39 个样本用于 k-means 训练，确保聚类质量
4. **定期重训**: 数据分布漂移时重新训练聚类中心，避免召回率下降
5. **GPU 加速**: Faiss GPU 版本在批量查询时吞吐提升 10-50×
6. **混合策略**: 先 IVF 粗筛，再对候选集做精确 rerank

## 阿里云专有云关联

在阿里云专有云大规模 RAG 系统中，当 HNSW 内存占用过高时，可考虑 IVF_PQ 等量化索引。工单中「向量库内存不足」时，IVF 是可行替代方案。DashVector 和 AnalyticDB 均支持 IVF 系列索引。

## Related

- [[概念/RAG/vector-index|Vector Index]]
- [[概念/RAG/hnsw|HNSW]]
- [[概念/RAG/vector-database|Vector Database]]
- [[概念/RAG/hybrid-search|Hybrid Search]]
- [[概念/RAG/bm25|BM25]]
