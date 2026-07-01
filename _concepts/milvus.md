---
title: "Milvus"
category: -concepts
tags: ["milvus", "vector-database", "rag", "embedding", "zilliz", "distributed", "gpu"]
relationships:
  - target: "_concepts/vector-database"
    type: extends
  - target: "_concepts/rag"
    type: enables
  - target: "_concepts/embedding"
    type: related_to
  - target: "_concepts/qdrant"
    type: related_to
  - target: "_concepts/weaviate"
    type: related_to
sources:
  - 14_RAG_Systems/Vector_Databases/Milvus_Deep_Dive.md
summary: "Milvus 是 Zilliz 开源的分布式向量数据库，专为海量 Embedding 检索设计，支持 GPU 索引、多副本、混合搜索（向量+标量），是 RAG 和企业级语义搜索的主流选择。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Milvus

---
# Milvus

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

- [[14_RAG_Systems/Vector_Databases/Milvus_Deep_Dive]] — Milvus 深度解析
- [[_concepts/vector-database]] — 向量数据库
- [[_concepts/rag-patterns]] — RAG
- [[_concepts/embedding]] — Embedding
- [[_concepts/qdrant]] — Qdrant
- [[_concepts/weaviate]] — Weaviate
- [[_concepts/chroma]] — Chroma
