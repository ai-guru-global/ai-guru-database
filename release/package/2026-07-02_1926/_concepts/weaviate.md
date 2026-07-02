---
title: "Weaviate"
category: -concepts
tags: ["weaviate", "vector-database", "rag", "embedding", "semantic-search", "graphql", "modular"]
relationships:
  - target: "_concepts/vector-database"
    type: extends
  - target: "_concepts/rag"
    type: enables
  - target: "_concepts/embedding"
    type: related_to
  - target: "_concepts/milvus"
    type: related_to
  - target: "_concepts/qdrant"
    type: related_to
sources:
  - 14_RAG_Systems/Vector_Databases/Weaviate_Deep_Dive.md
summary: "Weaviate 是开源的 AI 原生向量数据库，内置 embedding 与生成模型模块，支持 GraphQL/REST 查询、混合搜索和模块化架构，适合需要端到端 AI 检索能力的 RAG 应用。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Weaviate

---
# Weaviate

> 内置 AI 能力的「AI 原生向量数据库」——不只是存向量，还能自动做向量化。

---

## 1. 一句话定义

**Weaviate** 是开源的 **AI 原生向量数据库**，除了存储和检索向量，还提供内置的 Embedding 与生成模型模块。它支持 GraphQL 和 REST API、混合搜索、向量化管道和模块化架构，适合需要端到端 AI 检索能力的 RAG 应用。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **AI 原生** | 内置向量化模块，可自动将文本/图像转为向量 |
| **混合搜索** | 向量搜索 + BM25 关键字搜索 |
| **模块化架构** | 可插拔的 embedding、reranker、generative 模块 |
| **GraphQL / REST** | 两种查询接口 |
| **多向量空间** | 同一对象可存多个向量表示 |
| **生成式搜索** | 检索后直接用 LLM 生成答案 |
| **多租户** | 适合 SaaS 多租户 RAG |

---

## 3. 典型场景

1. **端到端 RAG**：无需额外 embedding 服务，直接存储原始文本。
2. **多模态检索**：文本、图像统一语义搜索。
3. **生成式搜索**：检索 + 生成一体化。
4. **SaaS 知识库**：多租户隔离。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Milvus** | 更偏纯向量检索，Weaviate 集成更多 AI 模块 |
| **Qdrant** | 更轻量高性能，Weaviate 更偏 AI 应用层 |
| **Chroma** | 轻量方案，Weaviate 更企业级 |
| **LangChain / LlamaIndex** | 可作为 RAG 向量存储后端 |
| **OpenAI / HuggingFace** | Weaviate 模块可直接调用 |

---

## 5. 优势与局限

### 优势
- 内置向量化，降低 RAG 架构复杂度。
- GraphQL 查询对前端/应用开发友好。
- 模块化设计，模型切换方便。

### 局限
- 单节点性能通常不如 Qdrant。
- 模块化带来一定资源开销。
- 超大规模场景扩展性弱于 Milvus。

---

## Related

- [[14_RAG_Systems/Vector_Databases/Weaviate_Deep_Dive]] — Weaviate 深度解析
- [[_concepts/vector-database]] — 向量数据库
- [[_concepts/rag-patterns]] — RAG
- embedding — Embedding
- [[_concepts/milvus]] — Milvus
- [[_concepts/qdrant]] — Qdrant
- [[_concepts/rag-production-architecture|RAG 生产架构]] — 向量库在生产 RAG 管线中的定位
