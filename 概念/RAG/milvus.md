---
title: "Milvus"
category: -concepts
tags: ["milvus", "vector-database", "rag", "embedding", "zilliz", "distributed", "gpu"]
relationships:
  - target: "概念/vector-database"
    type: extends
  - target: "概念/rag"
    type: enables
  - target: "概念/embedding"
    type: related_to
  - target: "概念/qdrant"
    type: related_to
  - target: "概念/weaviate"
    type: related_to
sources:
  - 14_RAG系统/03_Vector_Databases/Milvus_Deep_Dive.md
summary: "Milvus 是 Zilliz 开源的分布式向量数据库，专为海量 Embedding 检索设计，支持 GPU 索引、多副本、混合搜索（向量+标量），是 RAG 和企业级语义搜索的主流选择。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Milvus

name_zh: "分布式向量数据库"
---
# Milvus

> 中文简称：分布式向量数据库

> 面向十亿级向量的「分布式语义搜索引擎」——RAG 和企业知识库的常见底座。

---

## 1. 一句话定义

**Milvus** 是 Zilliz 开源的**分布式向量数据库**，专为海量 Embedding 检索设计。它支持 GPU 加速索引、标量过滤、混合搜索、多副本高可用，广泛应用于 RAG、推荐、语义搜索和以图搜图等场景。Zilliz 是基于 Milvus 的全托管云服务。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **分布式架构** | 存储与计算分离，支持水平扩展 |
| **GPU 索引** | GPU 加速 IVF、HNSW 等索引构建与检索 |
| **混合搜索** | 向量相似度 + 标量过滤同时查询 |
| **多副本高可用** | 支持 K8s 部署和故障转移 |
| **多一致性级别** | Strong / Bounded Staleness / Session / Eventually |
| **多语言 SDK** | Python、Java、Go、Node.js、C++ |
| **Embeddings 集成** | 内置 embedding 模型服务，支持稀疏/密集向量 |

---

## 3. 架构组件

```
Milvus Cluster
  ├── Milvus Proxy：请求入口
  ├── Query Node：检索执行
  ├── Data Node：数据持久化
  ├── Index Node：索引构建
  ├── MixCoord：元数据与协调
  └── Object Storage：S3 / MinIO / 本地存储
```

---

## 4. 典型场景

1. **RAG 知识库**：存储文档切片向量，支持百万至十亿级检索。
2. **企业语义搜索**：产品、法律、医疗文档检索。
3. **以图搜图**：图像 Embedding 相似度检索。
4. **推荐系统**：用户/物品 Embedding 召回。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Zilliz** | Milvus 的商业托管云 |
| **Qdrant / Weaviate** | 同为向量数据库，Milvus 更偏分布式大规模 |
| **Chroma** | 轻量本地向量库，Milvus 是企业级分布式方案 |
| **pgvector** | Postgres 扩展，Milvus 是专用向量数据库 |
| **LangChain / LlamaIndex** | 可作为 RAG 向量存储后端 |

---

## 6. 优势与局限

### 优势
- 真正的分布式，可扩展到百亿级向量。
- GPU 索引加速显著。
- 企业级特性完整（RBAC、多租户、备份恢复）。

### 局限
- 组件较多，运维复杂度高。
- 小数据量场景有点「重」。

---

## Related

- [[14_RAG系统/03_Vector_Databases/Milvus_Deep_Dive]] — Milvus 深度解析
- [[概念/vector-database]] — 向量数据库
- [[概念/rag-patterns]] — RAG
- [[概念/RAG/embedding-models|embedding]] — Embedding
- [[概念/qdrant]] — Qdrant
- [[概念/weaviate]] — Weaviate
- [[概念/chroma]] — Chroma
- [[概念/rag-production-architecture|RAG 生产架构]] — 向量库选型指南

---

## 2026 Milvus 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **GPU 索引** | CAGRA/GPU-IVF 加速索引构建 | GA |
| **混合搜索** | 向量 + 标量 + 全文检索融合 | GA |
| **多租户** | Partition Key 原生多租户隔离 | GA |
| **Milvus Lite** | 嵌入式轻量版，本地开发 | GA |
| **Zilliz Cloud** | 托管服务、Serverless | GA |

## 生产最佳实践

1. **索引选择**：十亿级用 IVF_PQ，亿级用 HNSW，千万级用 FLAT
2. **分片策略**：按业务维度分 Collection，避免单 Collection 过大
3. **副本配置**：生产环境 replica_number ≥ 2，确保高可用
4. **内存规划**：HNSW 索引内存 ≈ 向量数 × 维度 × 4B × 1.5
5. **监控指标**：关注 QPS、p99 延迟、内存使用率、Compaction 队列

## 2026 Milvus 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| 分布式架构 | ✅ 成熟 | 水平扩展 |
| GPU 加速 | ✅ 成熟 | 索引构建 + 检索 |
| 混合检索 | ✅ 成熟 | 向量 + 标量过滤 |
| 多向量 | ✅ 成熟 | ColBERT 支持 |
| 动态 Schema | ✅ 成熟 | 灵活字段 |
| 云托管 | ✅ 成熟 | Zilliz Cloud |
| Lite 版本 | ✅ 成熟 | 嵌入式场景 |

## 检查清单

- [ ] Milvus 版本已固定
- [ ] 副本数 ≥ 2
- [ ] 索引类型已优化
- [ ] 内存规划已完成
- [ ] 监控已接入
- [ ] 备份策略已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 检索慢 | 索引未优化 | 调整 HNSW/IVF 参数 |
| 内存不足 | 数据量大 | 启用 PQ 量化或 DiskANN |
| 写入慢 | Compaction 队列 | 调整 Compaction 策略 |
| 节点故障 | 副本不足 | 增加 replica number |

## 延伸阅读

- [[概念/RAG/qdrant|Qdrant]] — 向量数据库对比
- [[概念/RAG/weaviate|Weaviate]] — 向量数据库对比
- [[概念/RAG/chroma|Chroma]] — 轻量向量库
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库总览
- [[概念/RAG/hnsw|HNSW]] — 索引算法

> ℹ️ Milvus 是最成熟的开源分布式向量数据库，2026年以 GPU 加速、水平扩展和云托管著称，适合大规模生产 RAG 部署。

## 2026 Milvus 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| GPU 索引 (RAFT) | ✅ | NVIDIA 合作 |
| 分布式架构 | ✅ | 水平扩展、多副本 |
| 多租户 | ✅ | Partition 隔离 |
| 混合检索 | ✅ | 稀疏 + 稠密 |
| 云托管 (Zilliz) | ✅ | Serverless/专用 |
| 多语言 SDK | ✅ | Python/Go/Java/Node |

## 检查清单

- [ ] Collection Schema 已合理设计
- [ ] 索引类型已选择（HNSW/IVF/DiskANN）
- [ ] 副本数满足可用性要求
- [ ] 分区策略已配置（多租户）
- [ ] 备份和恢复已验证
- [ ] 监控已接入（Attu/Prometheus）

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 查询慢 | 索引未构建 | 等待索引完成或手动触发 |
| 内存 OOM | 数据超容量 | 启用量化或扩容 |
| 写入失败 | Segment 已满 | 调整 segment 大小 |
| 集群不稳定 | etcd 故障 | 检查 etcd 健康状态 |

## 延伸阅读

- [[概念/RAG/qdrant|Qdrant]] — Rust 向量数据库
- [[概念/RAG/weaviate|Weaviate]] — 模块化向量库
- [[概念/RAG/chroma|Chroma]] — 轻量向量库
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库总览
- [[概念/RAG/hnsw|HNSW]] — 索引算法

> ℹ️ Milvus 最佳实践：大规模生产首选，GPU 索引可提升 5-10x 检索性能，生产环境建议 3 节点 + 2 副本 + Attu 监控。
