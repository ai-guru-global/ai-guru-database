---
title: "Qdrant"
category: -concepts
tags: ["qdrant", "vector-database", "rag", "embedding", "rust", "open-source"]
relationships:
  - target: "概念/vector-database"
    type: extends
  - target: "概念/rag"
    type: enables
  - target: "概念/embedding"
    type: related_to
  - target: "概念/milvus"
    type: related_to
  - target: "概念/weaviate"
    type: related_to
sources:
  - 14_RAG系统/03_Vector_Databases/Qdrant_Deep_Dive.md
summary: "Qdrant 是用 Rust 开发的开源向量数据库，以高性能、低延迟和易部署著称，支持混合搜索、稀疏向量、量化与多副本，是 RAG 和中型规模语义搜索的热门选择。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Qdrant

name_zh: "Rust 向量数据库"
---
# Qdrant

> 中文简称：Rust 向量数据库

> Rust 写的「高性能向量数据库」——部署简单、延迟低，RAG 中型场景的热门选择。

---

## 1. 一句话定义

**Qdrant** 是用 Rust 开发的开源向量数据库与语义搜索引擎，专为 Embedding 存储和相似度检索优化。它以**高性能、低延迟、易部署**著称，支持混合搜索、稀疏向量、标量过滤、量化和高可用集群。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Rust 实现** | 内存安全、性能高、资源占用低 |
| **HNSW 索引** | 默认近似最近邻索引 |
| **混合搜索** | 密集向量 + 稀疏向量 + 标量过滤 |
| **量化** | Scalar、Product、Binary 量化降低内存 |
| **多副本** | 分布式模式下支持复制 |
| **快照与备份** | 支持数据快照和恢复 |
| **多语言 SDK** | Python、Rust、Go、TypeScript 等 |

---

## 3. 典型场景

1. **RAG 应用**：文档切片向量的快速召回。
2. **语义搜索**：电商、内容平台的相似度检索。
3. **推荐系统**：实时向量召回。
4. **异常检测**：基于 Embedding 的相似性异常判断。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Milvus** | 同为向量数据库，Qdrant 更轻量、易运维 |
| **Weaviate** | 功能接近，Weaviate 内置 ML 模块 |
| **Chroma** | Chroma 更轻量本地，Qdrant 可生产部署 |
| **pgvector** | Postgres 扩展，Qdrant 是专用向量数据库 |
| **LangChain / LlamaIndex** | 可作为 RAG 向量存储后端 |

---

## 5. 优势与局限

### 优势
- 单节点性能优秀，部署简单。
- Rust 实现，内存安全且资源效率高。
- 开源社区活跃，云原生友好。

### 局限
- 超大规模分布式场景不如 Milvus 成熟。
- 部分高级企业特性需商业版 Qdrant Cloud。

---

## Related

- [[14_RAG系统/03_Vector_Databases/Qdrant_Deep_Dive]] — Qdrant 深度解析
- [[概念/vector-database]] — 向量数据库
- [[概念/rag-patterns]] — RAG
- [[概念/RAG/embedding-models|embedding]] — Embedding
- [[概念/milvus]] — Milvus
- [[概念/weaviate]] — Weaviate
- [[概念/rag-production-architecture|RAG 生产架构]] — 向量库在生产 RAG 中的定位

---

## 2026 Qdrant 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **稀疏向量** | SPLADE/学习型稀疏检索原生支持 | GA |
| **多向量** | ColBERT 风格 late interaction | GA |
| **量化压缩** | Scalar/Product/Binary 量化，内存降 4-32x | GA |
| **分布式模式** | 多副本、分片、水平扩展 | GA |
| **GPU 索引** | 索引构建 GPU 加速 | Beta |

## 生产最佳实践

1. **量化策略**：内存受限时启用 Binary 量化（内存降 32x，召回损失 <3%）
2. **副本配置**：生产环境至少 2 副本，确保高可用
3. **索引参数**：HNSW m=16, ef_construct=128 为通用起点，根据召回率调整
4. **Payload 索引**：高频过滤字段建立 Payload Index 加速混合查询
5. **监控告警**：关注 p99 延迟、内存使用率、索引构建队列

## 2026 Qdrant 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| HNSW 索引 | ✅ 成熟 | 高性能向量检索 |
| Payload 过滤 | ✅ 成熟 | 混合查询 |
| 分布式部署 | ✅ 成熟 | 水平扩展 |
| 量化 (PQ/SQ) | ✅ 成熟 | 内存优化 |
| 多向量 | ✅ 成熟 | ColBERT 支持 |
| GPU 加速 | 🟡 发展中 | 索引构建加速 |
| 快照备份 | ✅ 成熟 | 数据保护 |

## 检查清单

- [ ] Qdrant 版本已固定
- [ ] 副本数 ≥ 2
- [ ] Payload 索引已配置
- [ ] 监控已接入
- [ ] 备份策略已配置
- [ ] 性能基线已建立

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 检索慢 | 索引未优化 | 调整 HNSW 参数 + 量化 |
| 内存不足 | 数据量大 | 启用 PQ/SQ 量化 |
| 写入慢 | 索引构建队列 | 异步索引 + 批量写入 |
| 节点故障 | 副本不足 | 增加 replication factor |

## 延伸阅读

- [[概念/RAG/milvus|Milvus]] — 向量数据库对比
- [[概念/RAG/weaviate|Weaviate]] — 向量数据库对比
- [[概念/RAG/chroma|Chroma]] — 轻量向量库
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库总览
- [[概念/RAG/hnsw|HNSW]] — 索引算法

> ℹ️ Qdrant 是 Rust 编写的高性能向量数据库，2026年以低延迟、强过滤能力和简单部署 著称，适合中小规模 RAG 生产部署。

## 2026 Qdrant 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| 分布式部署 | ✅ | 水平扩展、副本 |
| Payload 过滤 | ✅ | 结构化 + 向量联合查询 |
| 量化压缩 | ✅ | Scalar/Product/Binary |
| 多租户 | ✅ | Collection + Partition |
| GPU 索引 | 🟡 | 实验性支持 |
| 混合检索 | ✅ | 稀疏 + 稠密向量 |

## 检查清单

- [ ] Collection 配置已优化（维度/距离/索引）
- [ ] 副本数满足可用性要求
- [ ] 量化方案已评估（内存 vs 精度）
- [ ] Payload 索引已为常用过滤字段创建
- [ ] 备份策略已配置（Snapshot）
- [ ] 监控已接入（QPS/延迟/内存）

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 查询延迟高 | 未建 Payload 索引 | 为过滤字段创建索引 |
| 内存不足 | 未启用量化 | 启用 Scalar 量化 |
| 写入慢 | 单点写入 | 批量 upsert + 并行 |
| 召回率低 | HNSW 参数不当 | 增大 m 和 ef |

## 延伸阅读

- [[概念/RAG/milvus|Milvus]] — 分布式向量数据库
- [[概念/RAG/weaviate|Weaviate]] — 模块化向量库
- [[概念/RAG/hnsw|HNSW]] — 索引算法
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库总览
- [[概念/RAG/hybrid-search|Hybrid Search]] — 混合检索

> ℹ️ Qdrant 最佳实践：启用 Scalar 量化可节省 75% 内存，Payload 索引是过滤查询性能的关键，生产建议 2+ 副本。

## 性能基准

| 数据规模 | P50 延迟 | P99 延迟 | 内存占用 |
|------|------|------|------|
| 100K | 1ms | 3ms | 0.5 GB |
| 1M | 2ms | 5ms | 4 GB |
| 10M | 5ms | 12ms | 35 GB |
