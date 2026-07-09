---
title: "Chroma: 轻量级向量数据库"
category: "14-rag-systems"
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: "> **一句话理解**: Chroma 是最小的嵌入式向量数据库——专为 AI 应用设计，零配置、易上手、本地优先，LLM 时代的向量存储入门首选。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Chroma Deep Dive"
  - Chroma_Deep_Dive
sources: []

---
# Chroma: 轻量级向量数据库

> **一句话理解**: Chroma 是最小的嵌入式向量数据库——专为 AI 应用设计，零配置、易上手、本地优先，LLM 时代的向量存储入门首选。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Chroma: 轻量级向量数据库
═══════════════════════════════════════════════════════════════════

定位: 专为 AI 应用设计的嵌入式向量数据库

核心理念:
───────────────────────────────────────────────────────────────────
• 轻量: 零配置，开箱即用
• 嵌入优先: 原生支持 embedding
• 本地存储: SQLite 后端，本地运行
• 开发友好: Python First，快速原型
• 开源: 完全免费
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **向量存储** | 高效存储和检索向量 |
| **元数据** | 支持过滤的元数据 |
| **嵌入函数** | 内置多种嵌入模型 |
| **查询** | ANN 查询，最近邻 |
| **持久化** | 本地 SQLite 存储 |
| **客户端** | Python/JS/Go |

### 1.3 性能数据

| 配置 | 10K 向量 | 100K 向量 | 1M 向量 |
|------|---------|----------|---------|
| **查询延迟** | <10ms | <50ms | <200ms |
| **内存占用** | ~50MB | ~500MB | ~5GB |
| **精度 (HNSW)** | 98%+ | 95%+ | 90%+ |

---

## 2. 核心概念

### 2.1 数据模型

```
Chroma 数据模型
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Chroma 数据模型                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Collection (集合)                                                │
│  ├── name: 集合名称                                                │
│  ├── metadata: 集合元数据                                         │
│  └── get(); query(); peek()                                      │
│          │                                                        │
│          ▼                                                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                         Item                                 │ │
│  │  ├── id: 唯一标识                                            │ │
│  │  ├── embedding: 浮点向量 [0.1, 0.2, ...]                     │ │
│  │  └── metadata: {"source": "doc1", "type": "text"}          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

Key Points:
• ID: 字符串，唯一标识
• Embedding: 浮点数组，长度由模型决定 (e.g., 384, 768, 1536)
• Metadata: 字典，用于过滤
```

### 2.2 集合操作

| 操作 | 说明 |
|------|------|
| **create** | 创建集合 |
| **get** | 获取文档 |
| **query** | 向量检索 |
| **add** | 添加文档 |
| **update** | 更新文档 |
| **upsert** | 插入或更新 |
| **delete** | 删除文档 |
| **peek** | 查看样本 |
| **count** | 计数 |

---

## 3. 架构设计

### 3.1 系统架构

```
Chroma 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Chroma 架构                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Client (Python / JavaScript / Go)                             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Chroma Client                                          │   │
│   │  • 连接管理                                             │   │
│   │  • 请求路由                                             │   │
│   │  • 结果反序列化                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              API Server (可选)                           │   │
│   │  • HTTP API                                             │   │
│   │  • REST endpoints                                       │   │
│   │  • 默认端口: 8000                                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Storage Layer                              │   │
│   │  ├── SQLite (元数据)                                    │   │
│   │  ├── DuckDB (向量索引)                                  │   │
│   │  └── HNSW (近似最近邻)                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

两种部署模式:
1. Embedded (默认): 直接访问本地文件
2. Client-Server: 启动 API 服务器，远程连接
```

### 3.2 查询流程

```
Chroma 查询流程
═══════════════════════════════════════════════════════════════════

用户查询: "人工智能的最新发展"

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: Embedding                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ 输入: "人工智能的最新发展"                                        │
│ 模型: sentence-transformers/all-MiniLM-L6-v2                     │
│ 输出: [0.1, 0.05, -0.2, 0.8, ...] (384 维)                       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: ANN 检索                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ 1. 构建查询向量                                                    │
│ 2. 计算距离 (余弦/欧氏)                                           │
│ 3. HNSW 图遍历                                                    │
│ 4. 返回 Top-K 近似最近邻                                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 结果过滤                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ metadata 过滤: where = {"source": "news"}                         │
│ 返回: [(id, embedding, metadata), ...]                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install chromadb
```

### 4.2 基础使用

```python
import chromadb

# 创建客户端 (嵌入式模式)
client = chromadb.Client()

# 创建集合
collection = client.create_collection(
    name="documents",
    metadata={"description": "我的文档集合"}
)

# 添加文档
collection.add(
    documents=[
        "人工智能正在改变世界",
        "机器学习是 AI 的核心",
        "深度学习在计算机视觉中应用广泛"
    ],
    embeddings=[
        [0.1, 0.2, 0.3, ...],  # 可选，自动生成
        [0.4, 0.5, 0.6, ...],
        [0.7, 0.8, 0.9, ...]
    ],
    metadatas=[
        {"source": "tech", "category": "AI"},
        {"source": "tech", "category": "ML"},
        {"source": "tech", "category": "DL"}
    ],
    ids=["doc1", "doc2", "doc3"]
)

# 查询
results = collection.query(
    query_texts=["人工智能技术"],
    n_results=2
)

print(results)
# {'ids': ``[ ['doc1', 'doc2'] ]``, 'distances': ``[ [0.1, 0.3] ]``, ...}
```

### 4.3 使用嵌入函数

```python
import chromadb
from chromadb.utils import embedding_functions

# 使用默认嵌入函数 (sentence-transformers)
ef = embedding_functions.DefaultEmbeddingFunction()

# 创建带嵌入函数的集合
collection = client.create_collection(
    name="docs",
    embedding_function=ef
)

# 添加文档 (自动生成 embedding)
collection.add(
    documents=["AI 正在改变世界", "机器学习很重要"],
    ids=["1", "2"]
)

# 查询 (自动生成 query embedding)
results = collection.query(
    query_texts=["人工智能的最新进展"],
    n_results=2
)
```

### 4.4 元数据过滤

```python
# 复杂查询
results = collection.query(
    query_texts=["深度学习应用"],
    where={"category": "DL"},           # 元数据过滤
    where_document={"$contains": "视觉"}, # 文档内容过滤
    n_results=5,
    include=["documents", "metadatas", "distances"]
)

# 逻辑操作
results = collection.query(
    query_texts=["AI 新闻"],
    where={
        "$and": [
            {"source": "news"},
            {"category": {"$in": ["AI", "ML"]}}
        ]
    },
    n_results=10
)
```

---

## 5. 高级用法

### 5.1 Client-Server 模式

```bash
# 启动服务器
chromadb --host localhost --port 8000
```

```python
# 连接到服务器
client = chromadb.HttpClient(
    host="localhost",
    port=8000
)

# 后续操作相同
collection = client.get_collection("documents")
```

### 5.2 持久化

```python
import chromadb

# 持久化客户端
client = chromadb.PersistentClient(
    path="./chroma_data"  # 数据存储目录
)

# 创建集合 (持久化)
collection = client.create_collection("documents")

# 重启后数据仍在
collection = client.get_collection("documents")
```

### 5.3 批量操作

```python
# 批量添加大量文档
documents = [f"文档内容 {i}" for i in range(10000)]

collection.add(
    documents=documents,
    ids=[f"doc_{i}" for i in range(10000)],
    # 批量模式下建议预先计算 embedding
    embeddings=embedding_function(documents)
)
```

---

## 6. 对比与选择

### 6.1 与其他向量数据库对比

| 维度 | Chroma | Qdrant | Milvus | Weaviate |
|------|--------|--------|--------|----------|
| **部署** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **性能** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **功能** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **可扩展** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **学习曲线** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 原型开发 | Chroma |
| 小规模生产 | Chroma / Qdrant |
| 中等规模 | Qdrant |
| 大规模/分布式 | Milvus |
| 多模态 | Weaviate |

### 6.3 何时用 Chroma

| 场景 | 适合 Chroma |
|------|-------------|
| **AI 入门** | 零配置，易上手 |
| **原型开发** | 快速验证想法 |
| **小型项目** | <100K 向量 |
| **本地运行** | 无需外部服务 |
| **LLM 应用** | RAG、聊天机器人 |

---

## 参考资源

- [Chroma GitHub](https://github.com/chroma-core/chroma)
- [Chroma 文档](https://docs.trychroma.com/)
- [Chroma Blog](https://trychroma.com/blog)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[RAG系统/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[RAG系统/RAG_Systems.md|RAG_Systems]]
- [[RAG系统/README_Advanced.md|README_Advanced]]
- [[RAG系统/RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[_synthesis/rag-vector-database.md|rag-vector-database]]
