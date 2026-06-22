---
title: "Qdrant"
category: -concepts
tags: ["qdrant", "vector-database", "rag", "embedding", "rust", "open-source"]
relationships:
  - target: "_concepts/vector-database"
    type: extends
  - target: "_concepts/rag"
    type: enables
  - target: "_concepts/embedding"
    type: related_to
  - target: "_concepts/milvus"
    type: related_to
  - target: "_concepts/weaviate"
    type: related_to
sources:
  - 14_RAG_Systems/Qdrant_Deep_Dive.md
summary: "Qdrant 是用 Rust 开发的开源向量数据库，以高性能、低延迟和易部署著称，支持混合搜索、稀疏向量、量化与多副本，是 RAG 和中型规模语义搜索的热门选择。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# Qdrant

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

- [[14_RAG_Systems/Qdrant_Deep_Dive]] — Qdrant 深度解析
- [[_concepts/vector-database]] — 向量数据库
- [[_concepts/rag]] — RAG
- [[_concepts/embedding]] — Embedding
- [[_concepts/milvus]] — Milvus
- [[_concepts/weaviate]] — Weaviate
