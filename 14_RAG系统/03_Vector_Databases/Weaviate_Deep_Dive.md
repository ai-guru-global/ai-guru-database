---
title: "Weaviate: 开源向量数据库"
category: "14-rag-systems"
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: "> **一句话理解**: Weaviate 是一个开源的向量数据库——支持语义搜索、混合搜索、知识图谱，专门为 LLM 时代设计，支持文本、图片等多模态数据。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Weaviate Deep Dive"
  - Weaviate_Deep_Dive
sources: []

name_zh: "Weaviate: 开源向量数据库"
---
# Weaviate: 开源向量数据库

> 中文简称：Weaviate: 开源向量数据库

> **一句话理解**: Weaviate 是一个开源的向量数据库——支持语义搜索、混合搜索、知识图谱，专门为 LLM 时代设计，支持文本、图片等多模态数据。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Weaviate: 开源向量数据库
═══════════════════════════════════════════════════════════════════

定位: 专为 LLM 应用设计的开源向量数据库，支持语义搜索和知识图谱

核心理念:
───────────────────────────────────────────────────────────────────
• 原生向量: 原生支持向量存储和检索
• 混合搜索: 关键词 + 语义组合
• 知识图谱: 结构化数据+向量联合查询
• 多模态: 文本、图像、视频
• 云原生: Kubernetes 就绪
• 快速: 10 亿级向量亚秒查询
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **混合搜索** | BM25 + 语义向量组合 |
| **知识图谱** | GraphQL API |
| **多模态** | 文本、图片、音视频 |
| **实时索引** | 增量更新，无停机 |
| **相似性学习** | 支持自定义模型 |
| **云原生** | Kubernetes 部署 |
| **备份恢复** | 跨区域复制 |

### 1.3 版本对比

| 版本 | 说明 |
|------|------|
| **Weaviate 1.0** | 早期版本，基础向量 |
| **Weaviate 1.18** | 混合搜索引入 |
| **Weaviate 1.22** | 多模态支持 |
| **Weaviate 1.26** | 知识图谱增强 |

---

## 2. 核心概念

### 2.1 核心对象

```
Weaviate 数据模型
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                    Weaviate 数据模型                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Class (类)                                                      │
│  ├── name: "Article"                                           │
│  ├── properties: [title, content, author, date]                │
│  ├── vectorIndex: hnsw (索引类型)                              │
│  └── moduleConfig: {...}                                       │
│         │                                                        │
│         ▼                                                        │
│  Object (对象)                                                   │
│  ├── uuid: "550e8400-e29b-41d4-a716-446655440000"             │
│  ├── properties: {title: "...", content: "..."}               │
│  └── vector: [0.1, 0.2, ...]  (可选，手动或自动生成)           │
│         │                                                        │
│         ▼                                                        │
│  Reference (引用)                                                │
│  ├── from: "Article"                                          │
│  ├── to: "Author"                                              │
│  └── name: "writtenBy"                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 索引类型

| 索引类型 | 特点 | 适用场景 |
|----------|------|----------|
| **HNSW** | 高召回，高内存 | 通用场景 |
| **Flat** | 精确，低延迟 | 小数据集 |
| **Dynamic** | 自动选择 | 不确定场景 |

---

## 3. 架构设计

### 3.1 系统架构

```
Weaviate 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Weaviate 架构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Client                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Python / JS / Go / Java SDK                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              REST / GraphQL API                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Query/Insert Pipeline                       │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│   │  │ Vectorizer│  │  Indexer │  │  Searcher │             │   │
│   │  │ (向量化) │  │  (索引)  │  │  (检索)  │             │   │
│   │  └──────────┘  └──────────┘  └──────────┘             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Storage Layer                               │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│   │  │ Objects  │  │ Vectors  │  │  Inverted│             │   │
│   │  │  (对象)  │  │  (向量)  │  │ (倒排)   │             │   │
│   │  └──────────┘  └──────────┘  └──────────┘             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 混合搜索流程

```
Weaviate 混合搜索流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        混合搜索流程                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  用户查询: "量子计算原理"                                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 1: 向量化查询                                           │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ 使用 Transformer 将查询转为向量                              │ │
│  │ query_vector = embed("量子计算原理")                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 2: 并行搜索                                             │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ • BM25 关键词搜索 → ["量子", "计算"]                       │ │
│  │ • 向量相似度搜索 → Top-K 相似                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 3: RRF 融合                                             │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ 使用 Reciprocal Rank Fusion 合并结果                        │ │
│  │ score = Σ(1 / (k + rank_i))                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  最终结果: 重排序后的 Top-K 文档                                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# Docker 部署 (推荐)
docker run -d \
  -p 8080:8080 \
  -p 50051:50051 \
  -v /var/weaviate:/var/lib/weaviate \
  semitechnologies/weaviate:latest

# 或使用 docker-compose
wget https://configuration.weaviate.io/v1/docker/docker-compose.yml
docker-compose up -d
```

### 4.2 Python 客户端

```python
import weaviate

# 连接
client = weaviate.Client("http://localhost:8080")

# 创建类
schema = {
    "class": "Article",
    "description": "科技文章",
    "properties": [
        {"name": "title", "dataType": ["text"]},
        {"name": "content", "dataType": ["text"]},
        {"name": "author", "dataType": ["text"]},
    ],
    "vectorizer": "text2vec-transformers",  # 自动向量化
}

client.schema.create_class(schema)

# 添加对象
client.data_object.create(
    class_name="Article",
    data_object={
        "title": "量子计算入门",
        "content": "量子计算是一种基于量子力学原理...",
        "author": "张三",
    }
)

# 搜索
result = client.query.get(
    class_name="Article",
    properties=["title", "content", "author"],
).with_near_text({
    "concepts": ["量子计算原理"]
}).with_limit(5).do()

print(result)
```

### 4.3 混合搜索

```python
# 混合搜索
result = client.query.get(
    class_name="Article",
    properties=["title", "content"],
).with_hybrid(
    query="量子计算",
    alpha=0.7,  # 0.7 向量, 0.3 关键词
).with_limit(5).do()
```

### 4.4 知识图谱

```python
# 创建引用
client.data_object.create(
    class_name="Article",
    uuid="article-uuid",
    data_object={
        "title": "量子计算入门"
    }
)

client.data_object.create(
    class_name="Author",
    uuid="author-uuid",
    data_object={
        "name": "张三"
    }
)

# 添加引用
client.data_object.add_reference(
    from_uuid="article-uuid",
    from_class_name="Article",
    reference_property="writtenBy",
    to_uuid="author-uuid",
    to_class_name="Author",
)

# GraphQL 查询
query = """
{
  Get {
    Article(uuid: "article-uuid") {
      title
      writtenBy {
        ... on Author {
          name
        }
      }
    }
  }
}
"""
```

---

## 5. 高级特性

### 5.1 自定义向量化

```python
# 使用自定义向量化器
schema = {
    "class": "Document",
    "properties": [...],
    "vectorizer": "custom",  # 自定义
    "moduleConfig": {
        "custom": {
            "vectorizer": {
                "vectorizeClassName": False
            }
        }
    }
}

# 手动提供向量
client.data_object.create(
    class_name="Document",
    data_object={"content": "..."},
    vector=[0.1, 0.2, ...]  # 手动提供向量
)
```

### 5.2 过滤

```python
# 带过滤的搜索
result = client.query.get(
    class_name="Article",
    properties=["title", "content"],
).with_where({
    "path": ["author"],
    "operator": "Equal",
    "valueText": "张三"
}).with_near_text({
    "concepts": ["量子计算"]
}).do()
```

---

## 6. 对比与选择

### 6.1 与其他向量数据库对比

| 维度 | Weaviate | Qdrant | Chroma | Milvus |
|------|----------|--------|--------|--------|
| **开源** | ✅ | ✅ | ✅ | ✅ |
| **混合搜索** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **知识图谱** | ⭐⭐⭐⭐⭐ | ⭐ | ❌ | ⭐ |
| **多模态** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **性能** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 适用场景

**✅ Weaviate 最佳场景:**
- 需要混合搜索 (关键词 + 语义)
- 知识图谱应用
- 多模态数据 (文本 + 图像)
- 企业级生产环境

---

## 参考资源

- [Weaviate GitHub](https://github.com/weaviate/weaviate)
- [Weaviate 文档](https://weaviate.io/developers/weaviate/)
- [Weaviate Cloud](https://console.weaviate.cloud/)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[14_RAG系统/01_RAG_Fundamentals/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[14_RAG系统/01_RAG_Fundamentals/RAG_Systems.md|RAG_Systems]]
- [[14_RAG系统/04_Advanced_RAG/README_Advanced.md|README_Advanced]]
- [[14_RAG系统/06_RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[14_RAG系统/03_Vector_Databases/rag-vector-database.md|rag-vector-database]]
