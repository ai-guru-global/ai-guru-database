---
title: "Weaviate"
category: -concepts
tags: ["weaviate", "vector-database", "rag", "embedding", "semantic-search", "graphql", "modular"]
relationships:
  - target: "概念/vector-database"
    type: extends
  - target: "概念/rag"
    type: enables
  - target: "概念/embedding"
    type: related_to
  - target: "概念/milvus"
    type: related_to
  - target: "概念/qdrant"
    type: related_to
sources:
  - 14_RAG系统/03_Vector_Databases/Weaviate_Deep_Dive.md
summary: "Weaviate 是开源的 AI 原生向量数据库，内置 embedding 与生成模型模块，支持 GraphQL/REST 查询、混合搜索和模块化架构，适合需要端到端 AI 检索能力的 RAG 应用。"
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
  - Weaviate

name_zh: "AI 原生向量数据库"
---
# Weaviate

> 中文简称：AI 原生向量数据库

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

- [[14_RAG系统/03_Vector_Databases/Weaviate_Deep_Dive]] — Weaviate 深度解析
- [[概念/vector-database]] — 向量数据库
- [[概念/rag-patterns]] — RAG
- [[概念/RAG/embedding-models|embedding]] — Embedding
- [[概念/milvus]] — Milvus
- [[概念/qdrant]] — Qdrant
- [[概念/rag-production-architecture|RAG 生产架构]] — 向量库在生产 RAG 管线中的定位

---

## 2026 Weaviate 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **多模态搜索** | 图像/音频/视频向量化+检索 | GA |
| **生成式搜索** | 内置 RAG 生成模块 | GA |
| **混合搜索** | BM25 + 向量融合 | GA |
| **多租户** | 原生多租户隔离 | GA |
| **Weaviate Cloud** | 托管服务、Serverless | GA |

## 生产最佳实践

1. **模块化配置**：仅启用需要的模块，减少资源开销
2. **Schema 设计**：合理定义 Class/Property，避免过度嵌套
3. **批量导入**：使用 batch API 提升写入吞吐 10x+
4. **副本策略**：生产环境 replication factor ≥ 2
5. **GraphQL 优化**：避免深层嵌套查询，使用 nearVector 替代复杂过滤

## 2026 Weaviate 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| 向量+关键词混合 | ✅ 成熟 | BM25 + 向量融合 |
| 多模态 | ✅ 成熟 | 文本/图像/音频 |
| 模块化 | ✅ 成熟 | 插件化架构 |
| GraphQL API | ✅ 成熟 | 灵活查询 |
| 分布式 | ✅ 成熟 | 水平扩展 |
| 多租户 | ✅ 成熟 | SaaS 场景 |
| Generative 模块 | ✅ 成熟 | 内置 RAG |

## 检查清单

- [ ] Weaviate 版本已固定
- [ ] 副本策略已配置
- [ ] 模块已配置
- [ ] GraphQL 查询已优化
- [ ] 监控已接入
- [ ] 备份策略已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 查询慢 | GraphQL 嵌套过深 | 简化查询 + 索引优化 |
| 内存不足 | 数据量大 | 启用 PQ 量化 |
| 模块不兼容 | 版本不匹配 | 固定模块版本 |
| 多租户性能差 | 资源未隔离 | 配置租户资源限制 |

## 延伸阅读

- [[概念/RAG/qdrant|Qdrant]] — 向量数据库对比
- [[概念/RAG/milvus|Milvus]] — 向量数据库对比
- [[概念/RAG/chroma|Chroma]] — 轻量向量库
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库总览
- [[概念/RAG/hybrid-search|Hybrid Search]] — 混合检索

> ℹ️ Weaviate 是模块化向量数据库，2026年以多模态、GraphQL API 和内置 RAG 能力著称，适合需要灵活查询的场景。

## 2026 Weaviate 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| 多模态支持 | ✅ | 文本/图像/音频向量化 |
| GraphQL API | ✅ | 灵活查询接口 |
| 混合检索 | ✅ | BM25 + 向量融合 |
| 多租户 | ✅ | 原生支持 |
| 内置 RAG | ✅ | generate 模块 |
| 分布式 | ✅ | 水平扩展、副本 |

## 检查清单

- [ ] Schema 已合理设计（Class/Property）
- [ ] 向量化模块已正确配置
- [ ] 副本和分片已配置
- [ ] 混合检索权重已调优
- [ ] 备份策略已配置
- [ ] 监控已接入（延迟/内存/QPS）

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 查询慢 | 未启用混合检索索引 | 配置 inverted index |
| 内存高 | 向量未量化 | 启用 PQ 压缩 |
| 导入慢 | 单条插入 | 批量 batch import |
| 召回率低 | 权重不当 | 调整 hybrid alpha |

## 延伸阅读

- [[概念/RAG/qdrant|Qdrant]] — Rust 向量数据库
- [[概念/RAG/milvus|Milvus]] — 分布式向量数据库
- [[概念/RAG/chroma|Chroma]] — 轻量向量库
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库总览
- [[概念/RAG/hybrid-search|Hybrid Search]] — 混合检索

> ℹ️ Weaviate 最佳实践：多模态场景首选，混合检索 alpha=0.7 作为起点，生产环境启用 PQ 压缩和 2+ 副本。
