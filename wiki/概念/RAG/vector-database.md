---
title: 向量数据库
category: -concepts
tags:
- vector-database
- - - data-structures-algorithms|hnsw
- - - rag-systems|embedding
- similarity-search
- milvus
- qdrant
relationships:
- target: '概念/rag-systems'
  type: related_to
- target: '概念/ai-architecture'
  type: related_to
- target: '概念/llm-infrastructure'
  type: related_to
- target: '概念/matryoshka-representation-learning'
  type: related_to
sources:
- 11_RAG_recommendation-systems/Milvus_deep-reinforcement-learning_Dive.md
- 14_RAG系统/03_向量数据库/Qdrant_Deep_Dive.md
- 14_RAG系统/03_向量数据库/Chroma_Deep_Dive.md
- 14_RAG系统/01_RAG基础/RAG_Systems.md
- 14_RAG系统/04_高级RAG/RAG_Advanced_2026.md
summary: 向量数据库是AI时代的专用存储引擎，通过HNSW/IVF等近似最近邻算法实现高维向量的毫秒级语义检索，是RAG系统和语义搜索的基础设施。
provenance:
  extracted: 0.82
  inferred: 0.13
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: reviewed
updated: 2026-07-21
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31 00:00:00+00:00
updated: 2026-06-12 00:00:00+00:00
aliases:
  - "Vector Database"
  - "vector database"

name_zh: "向量数据库"
---
# 向量数据库

> 中文简称：向量数据库

## 核心要点

向量数据库是专为AI应用设计的高性能向量检索引擎，存储文本/图像/音频的向量表示（Embedding），支持基于语义相似度的毫秒级查询。与 traditional 关键词检索不同，向量检索能理解"如何提高效率"和"效率提升方法"是语义等价的。

核心技术是近似最近邻（ANN）算法，在牺牲微小精度（召回率95-99%）的前提下，将检索速度提升10-100倍。主流索引算法包括HNSW（图遍历，高召回低延迟）和IVF（倒排索引，适合超大规模）。

### 距离度量

余弦相似度（Cosine）是文本嵌入的默认选择，衡量向量方向而非长度。点积（Dot Product）适合已归一化的向量，计算更快。欧氏距离（Euclid）常用于图像特征。度量方式的选择直接影响检索质量。

### 可截断嵌入：Matryoshka Representation Learning

[[概念/matryoshka-representation-learning|Matryoshka 表示学习（MRL）]] 让向量可以在任意前缀维度上保持语义有效性。向量数据库因此可以：

- 用低维前缀（如 128 维）构建紧凑索引，减少内存与计算
- 用高维前缀（如 768/1024 维）做最终精排，保证精度
- 同一份向量存储满足不同 latency/精度预算，无需维护多模型或多索引

这对超大规模 RAG 和端侧部署尤其有价值。

## 详细内容

### Milvus：超大规模向量数据库

Milvus定位万亿级向量检索，采用云原生分布式架构。系统分为四层：Application Layer（多语言SDK和REST API）、Proxy Layer（请求路由和结果聚合）、Coordinator Layer（元数据/数据/查询协调）和Worker Layer（data-structures-algorithms/Query/Index节点）。

索引类型选择：FLAT（<1M向量，100%精度）、HNSW（1M-100M，极高精度极低延迟）、IVF_FLAT（1M-100M，高精度中等延迟）、DiskANN（100M-10B+，高精度低内存，适合超大规模）。

性能基准：10M向量128维HNSW索引，QPS达50,000，延迟<10ms；1B向量使用DiskANN，延迟<50ms。Milvus支持混合检索（向量+标量过滤）、分区操作、实时CRUD和model-deployment集群部署。^[inferred]

### Qdrant：高性能向量数据库

Qdrant用Rust编写，以内存安全和并发性能著称。核心对象模型：Collection（集合，定义向量维度和距离度量）→ Point（点，包含向量+Payload）→ Namespace（命名空间，多租户隔离）。

Qdrant的特色能力包括：稀疏向量支持（TF-IDF风格，用于混合检索）、多租户Namespace隔离、TTL自动过期、INT8/FP16量化压缩。性能基准：1M向量P99<5ms、10M向量P99<10ms，召回率98%+。

### Chroma：轻量级嵌入式向量数据库

Chroma专为AI应用原型开发设计，零配置、Python First。数据模型简洁：Collection → Item（id + embedding + metadata）。存储后端使用SQLite（元数据）+ DuckDB（向量索引）+ HNSW（近似最近邻）。

两种部署模式：Embedded（默认，直接访问本地文件，适合开发测试）和Client-Server（启动API服务器远程连接，适合小型生产）。性能适合<100K向量场景，1M向量查询延迟<200ms。^[ambiguous]

### 向量数据库选型决策

| 规模 | 推荐 | 理由 |
|------|------|------|
| 原型开发 | Chroma | 零配置、易上手 |
| <10M向量 | Chroma/Qdrant | 轻量够用 |
| 10M-1B向量 | Qdrant/Milvus | 性能与规模兼顾 |
| 1B+向量 | Milvus | 超大规模分布式 |
| 多模态 | Weaviate | 原生多模态支持 |
| 已有PG基础设施 | pgvector | 无需新组件 |

### 混合检索架构

现代向量数据库普遍支持混合检索：向量检索（语义相似度）+ BM25/稀疏向量（关键词匹配）→ RRF融合 → 最终结果。这是2026年RAG系统的标配方案，单独使用任一检索方式效果都明显逊色。

### 索引算法深入

HNSW（Hierarchical Navigable Small world-models-jepa）通过构建多层图结构实现高效检索：顶层稀疏用于快速定位区域，底层稠密用于精确搜索。关键参数M（每层连接数，通常16）和efConstruction（构建时搜索宽度，通常200）影响索引质量和构建速度。查询时ef参数控制精度-速度权衡。

IVF（Inverted File Index）将向量空间划分为聚类中心，查询时只搜索最近的几个聚类。适合超大规模数据，但精度略低于HNSW。

### 多租户向量隔离

向量数据库的多租户隔离方案：Collection级隔离（每个租户独立Collection，隔离最强但管理复杂）、Namespace/Shard级隔离（共享Collection通过metadata过滤，成本低但需严格过滤）、Partition级隔离（Milvus的Partition方案，兼顾隔离和管理）。

## 开放问题

- 向量数据库的标准化查询语言尚未形成（类似SQL的地位）
- 多模态向量（文本+图像+音频联合检索）的最佳实践仍在探索
- 向量数据库的增量更新与实时一致性保证机制 ^[ambiguous]
- 端侧向量数据库（移动设备上的向量检索）的工程可行性

## 来源

- 14_RAG系统/03_向量数据库/Milvus_Deep_Dive.md — Milvus架构、索引类型、性能基准
- 14_RAG系统/03_向量数据库/Qdrant_Deep_Dive.md — Qdrant核心概念、混合搜索、多租户
- 14_RAG系统/03_向量数据库/Chroma_Deep_Dive.md — Chroma轻量级设计、快速开始
- 14_RAG系统/01_RAG基础/RAG_Systems.md — 向量数据库对比与选型建议
- 14_RAG系统/04_高级RAG/RAG_Advanced_2026.md — 混合检索架构与生产部署

## Related

- [[概念/milvus]] — Milvus 分布式向量库
- [[概念/qdrant]] — Qdrant 高性能向量库
- [[概念/weaviate]] — Weaviate AI 原生向量库
- [[概念/chroma]] — Chroma 嵌入式向量库
- [[概念/RAG/embedding-models|embedding]] — Embedding 模型
- [[概念/rag-production-architecture|RAG 生产架构]] — 向量库选型指南
- [[治理/rag-vector-database]] — RAG 系统 × 向量数据库 (共享: milvus, qdrant, vector-database)

---

## 2026 向量数据库选型指南

| 数据库 | 规模 | 核心优势 | 适用场景 |
|--------|------|---------|----------|
| **Milvus** | 十亿级 | 分布式、GPU 索引、生态完善 | 大型企业、海量数据 |
| **Qdrant** | 亿级 | Rust 高性能、易部署、量化 | 中型生产、低延迟 |
| **Weaviate** | 亿级 | 模块化、多模态、GraphQL | AI 原生应用 |
| **Chroma** | 十万级 | 极简 API、嵌入式 | 原型、小规模 |
| **pgvector** | 千万级 | PostgreSQL 扩展、无额外组件 | 已有 PG 基础设施 |

## 生产最佳实践

1. **规模匹配**：根据数据量选择合适数据库，避免小数据用重型方案
2. **索引调优**：HNSW 参数（m/ef）根据召回率要求调整
3. **量化压缩**：内存受限时启用 PQ/SQ/Binary 量化
4. **混合检索**：向量 + 关键词融合提升召回率
5. **监控告警**：关注 p99 延迟、内存使用率、索引构建时间

## 2026 向量数据库生态现状

| 产品 | 类型 | 规模 | 特色 | 状态 |
|------|------|------|------|------|
| Milvus | 分布式 | 十亿级 | GPU 加速、多租户 | ✅ 成熟 |
| Qdrant | 分布式 | 亿级 | Rust 高性能、过滤 | ✅ 成熟 |
| Weaviate | 分布式 | 亿级 | 多模态、GraphQL | ✅ 成熟 |
| Chroma | 嵌入式 | 百万级 | 轻量、开发友好 | ✅ 主流 |
| pgvector | 插件 | 千万级 | PostgreSQL 生态 | ✅ 主流 |
| Pinecone | 托管 | 十亿级 | 全托管、Serverless | ✅ 商业 |

## 检查清单

- [ ] 数据规模与数据库容量匹配
- [ ] 索引类型已根据查询模式选择（HNSW/IVF）
- [ ] 副本数满足可用性要求
- [ ] 备份和恢复策略已配置
- [ ] 监控指标已接入（延迟/QPS/内存）
- [ ] 访问控制和认证已启用

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 内存 OOM | 向量未量化、数据超容量 | 启用 PQ/SQ 量化或扩容 |
| 查询延迟突增 | 索引未构建完成 | 等待索引 build 或预热 |
| 召回率低 | ef_search 太小 | 增大 ef_search 或调整 m |
| 写入吞吐低 | 单节点瓶颈 | 分布式部署或批量写入 |

## 延伸阅读

- [[概念/RAG/hnsw|HNSW]] — 主流向量索引算法
- [[概念/RAG/ivf|IVF]] — 倒排索引算法
- [[概念/RAG/embedding-models|Embedding Models]] — 嵌入模型选型
- [[概念/RAG/hybrid-search|Hybrid Search]] — 混合检索
- [[14_RAG系统/03_向量数据库/05_rag_vector_database|向量数据库专题]]

> ℹ️ 向量数据库选型核心原则：小规模用 Chroma/pgvector，中规模用 Qdrant/Weaviate，大规模用 Milvus/Pinecone，始终结合量化和混合检索优化成本与效果。

## 选型决策树

```
数据量 < 1M → Chroma / pgvector
数据量 1M-100M → Qdrant / Weaviate
数据量 > 100M → Milvus / Pinecone
需要多模态 → Weaviate
需要 SQL 生态 → pgvector
需要全托管 → Pinecone / Zilliz Cloud
```
