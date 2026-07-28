---
title: "Chroma（嵌入式向量数据库）"
category: -concepts
tags: [chroma, vector-database, rag, embedding, embedding-store]
aliases:
  - "Chroma"
  - "ChromaDB"
relationships:
  - target: "概念/milvus"
    type: alternative
  - target: "概念/rag-systems"
    type: used_by
sources:
  - 14_RAG系统/03_Vector_Databases/Chroma_Deep_Dive.md
summary: "Chroma 是面向 AI 应用的嵌入式向量数据库，以极简 API、原型友好、Python-first 设计著称；适合小型项目和原型，是 RAG 系统入门首选。"
lifecycle: reviewed
tier: supporting
updated: 2026-07-21
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
name_zh: "嵌入式向量数据库"
---

# Chroma（嵌入式向量数据库）

> 中文简称：嵌入式向量数据库

## 核心要点

- **定位**：AI 时代的 SQLite（嵌入式、零配置、Python-first）。
- **核心特性**：
  - **极简 API**：`collection.add()` / `collection.query()` 即可
  - **嵌入式**：单文件持久化，无需独立服务
  - **Server 模式**：也支持独立部署
  - **多模态**：原生支持文本 + 图像
  - **集成丰富**：与 LangChain / LlamaIndex / OpenAI 深度集成
- **使用场景**：
  - 原型 / Demo（首选）
  - 小型项目（< 100K 向量）
  - 本地开发 / 教学
  - 单机生产（小规模）

## 一句话解释

> Chroma = "向量数据库的 SQLite"；装上就能用，5 行代码跑通 RAG；规模大了再换 Milvus / Weaviate。

## 快速上手

```python
import chromadb

# 客户端模式（嵌入式）
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("my_docs")

# 添加文档
collection.add(
    documents=["AI Guru 是 AI 知识库", "Chroma 是向量数据库"],
    metadatas=[{"source": "intro"}, {"source": "chroma"}],
    ids=["doc1", "doc2"]
)

# 查询
results = collection.query(
    query_texts=["什么是向量数据库"],
    n_results=2
)
print(results)
```

## 与其他向量库对比

| 数据库 | 规模 | 部署 | 强项 | 弱项 |
|--------|------|------|------|------|
| **Chroma** | < 100K | 嵌入式 | 极简、原型友好 | 不适合大规模 |
| **FAISS** | 10M+ | 嵌入式 | 极致性能 | 无元数据过滤 |
| **Milvus** | 100M+ | 集群 | 亿级、GPU 加速 | 部署复杂 |
| **Weaviate** | 10M+ | 集群 | 模块化、内置向量化 | 资源占用大 |
| **Qdrant** | 10M+ | 集群 | Rust 高性能 | 生态较小 |
| **Pinecone** | 任意 | SaaS | 零运维 | 价格高、锁定 |

## 何时使用

✅ **推荐**：
- RAG 原型 / Demo（最快 5 分钟上手）
- 个人项目 / 教学
- 小规模生产（< 10 万文档）
- 本地开发 / 调试

⚠️ **不推荐**：
- 大规模生产（> 100K 向量）→ Milvus / Weaviate
- 极致性能要求 → FAISS / Milvus
- 多租户 / 复杂权限 → Pinecone / Weaviate

## Related

- [[概念/milvus]] — Milvus（大规模场景）
- [[概念/rag-systems]] — RAG 系统
- [[概念/qdrant]] — Qdrant（中型生产场景）
- [[概念/rag-production-architecture|RAG 生产架构]] — 向量库选型指南
- [[14_RAG系统/03_Vector_Databases/Chroma_Deep_Dive]] — Chroma 深度
- [[14_RAG系统/03_Vector_Databases/Milvus_Deep_Dive]] — Milvus 对比

---

## 2026 Chroma 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **Chroma Cloud** | 托管服务，免运维 | GA |
| **分布式模式** | 水平扩展、多节点 | Beta |
| **多模态** | 图像/音频 Embedding 存储 | GA |
| **集成生态** | LangChain/LlamaIndex/Dify 原生支持 | GA |

## 生产最佳实践

1. **规模边界**：Chroma 适合 <10万向量，超过则迁移至 Qdrant/Milvus
2. **持久化**：生产环境必须配置持久化存储，避免数据丢失
3. **批量操作**：使用 add() 批量插入而非逐条，提升 10x+ 吞吐
4. **元数据过滤**：善用 where 条件缩小搜索范围，提升精度
5. **原型转生产**：验证后迁移至 Qdrant/Milvus 获得更好性能和可扩展性

## 2026 Chroma 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| 嵌入式模式 | ✅ 成熟 | 零配置启动 |
| Python SDK | ✅ 成熟 | 简洁 API |
| 元数据过滤 | ✅ 成熟 | where 条件 |
| 持久化 | ✅ 成熟 | 本地存储 |
| 客户端/服务器 | ✅ 成熟 | 分布式部署 |
| 多语言 SDK | 🟡 发展中 | JS/Go |
| 生产级扩展 | 🟡 发展中 | 大规模场景 |

## 检查清单

- [ ] Chroma 版本已固定
- [ ] 持久化路径已配置
- [ ] 元数据索引已配置
- [ ] 性能已测试
- [ ] 备份策略已配置
- [ ] 生产迁移已评估

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 检索慢 | 数据量大 | 迁移至 Qdrant/Milvus |
| 内存不足 | 全量加载 | 使用客户端/服务器模式 |
| 并发差 | 嵌入式限制 | 使用服务器模式 |
| 持久化失败 | 路径权限 | 检查目录权限 |

## 延伸阅读

- [[概念/RAG/qdrant|Qdrant]] — 生产级向量库
- [[概念/RAG/milvus|Milvus]] — 分布式向量库
- [[概念/RAG/weaviate|Weaviate]] — 模块化向量库
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库总览
- [[概念/RAG/embedding-models|Embedding Models]] — 嵌入模型

> ℹ️ Chroma 是最轻量的向量数据库，2026年仍是原型验证和小型项目的首选，生产大规模 场景建议迁移至 Qdrant/Milvus。

## 2026 Chroma 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| 嵌入式模式 | ✅ | pip install 即用 |
| Client/Server | ✅ | 生产部署模式 |
| 多语言 SDK | ✅ | Python/JS/Go |
| 元数据过滤 | ✅ | where 条件查询 |
| 持久化 | ✅ | 本地磁盘存储 |
| 分布式 | ❌ | 不支持水平扩展 |

## 检查清单

- [ ] Collection 已合理命名和组织
- [ ] Embedding 函数已固定（避免版本漂移）
- [ ] 持久化路径已配置（避免内存丢失）
- [ ] 数据规模已评估（< 1M 向量）
- [ ] 元数据索引已为常用过滤创建
- [ ] 备份策略已配置

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 数据丢失 | 未持久化 | 配置 persist_directory |
| 查询慢 | 数据量超限 | 迁移到 Qdrant/Milvus |
| 内存不足 | 全量加载 | 减少数据或迁移 |
| 并发冲突 | 嵌入式单线程 | 改用 Client/Server 模式 |

## 延伸阅读

- [[概念/RAG/qdrant|Qdrant]] — 生产级向量数据库
- [[概念/RAG/milvus|Milvus]] — 分布式向量数据库
- [[概念/RAG/weaviate|Weaviate]] — 模块化向量库
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库总览
- [[概念/RAG/embedding-models|Embedding Models]] — 嵌入模型

> ℹ️ Chroma 定位：原型验证和小型项目（< 1M 向量），生产大规模场景应迁移至 Qdrant/Milvus/Weaviate。