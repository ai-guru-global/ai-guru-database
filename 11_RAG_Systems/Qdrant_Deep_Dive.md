# Qdrant: 高性能向量数据库

> **一句话理解**: Qdrant 是一个用 Rust 编写的高性能向量数据库——亚毫秒级查询速度，支持混合搜索和过滤，专为生产环境设计。

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
Qdrant: 高性能向量数据库
═══════════════════════════════════════════════════════════════════

定位: Rust 编写的高性能向量数据库，亚毫秒级查询，适合生产环境

核心理念:
───────────────────────────────────────────────────────────────────
• 高性能: Rust 编写，内存安全，并发优秀
• 准确: HNSW 算法，精确召回
• 灵活: 动态 Schema，JSON 属性
• 生产就绪: 复制、备份、监控
• 易用: 成熟的 SDK 和 API
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **HNSW 算法** | 近似最近邻，高召回 |
| **混合过滤** | 向量检索 + 条件过滤 |
| **稀疏向量** | 支持 TF-IDF 风格的稀疏向量 |
| **多租户** | Namespace 隔离 |
| **TTL** | 点自动过期 |
| **副本** | 高可用复制 |
| **量化** | INT8/FP16 量化 |

### 1.3 性能数据

| 数据规模 | 延迟 (P99) | 召回率 |
|----------|------------|--------|
| 1M 向量 | <5ms | 99% |
| 10M 向量 | <10ms | 98% |
| 100M 向量 | <20ms | 97% |

---

## 2. 核心概念

### 2.1 核心对象

```
Qdrant 数据模型
═══════════════════════════════════════════════════════════════════

Collection (集合)
├── name: "articles"
├── vectors: {size: 1536, distance: Cosine}
├── hnsw_config: {...}
└── optimizers_config: {...}
         │
         ▼
Point (点)
├── id: 12345
├── vector: [0.1, 0.2, ...]
└── payload: {title: "...", content: "..."}
         │
         ▼
Payload (负载)
├── 标量属性: title, created_at, author_id
├── 过滤操作: Must, Should, Must_not
└── 数组属性: tags, categories

Namespace (命名空间)
└── 用于多租户隔离
```

### 2.2 距离度量

| 度量 | 说明 | 适用场景 |
|------|------|----------|
| **Cosine** | 余弦相似度 | 文本嵌入 |
| **Dot** | 点积 | 已归一化向量 |
| **Euclid** | 欧氏距离 | 图像特征 |

---

## 3. 架构设计

### 3.1 系统架构

```
Qdrant 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Qdrant 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Client                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Python / Rust / Go / JS SDK                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              gRPC / REST API                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Core Engine (Rust)                        │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│   │  │  HNSW   │  │ Storage  │  │   API   │              │   │
│   │  │  Index  │  │  Engine  │  │  Layer  │              │   │
│   │  └──────────┘  └──────────┘  └──────────┘              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Storage                                     │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│   │  │  Vectors │  │ Payloads │  │  WAL     │              │   │
│   │  │  (向量)  │  │  (属性)  │  │ (日志)  │              │   │
│   │  └──────────┘  └──────────┘  └──────────┘              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 查询流程

```
Qdrant 查询流程
═══════════════════════════════════════════════════════════════════

用户: 搜索 "量子计算" (带过滤: author="张三")

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 解析查询                                                 │
│ ───────────────────────────────────────────────────────────────  │
│ • 解析向量查询 (text → embedding)                               │
│ • 解析过滤条件 (author = "张三")                                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: HNSW 搜索                                                │
│ ───────────────────────────────────────────────────────────────  │
│ • 在 HNSW 图中搜索 Top-K                                        │
│ • ef=128 (搜索宽度)                                            │
│ • 返回候选点                                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 过滤验证                                                 │
│ ───────────────────────────────────────────────────────────────  │
│ • 检查候选点 payload 是否满足过滤条件                            │
│ • 排除不匹配的点                                                 │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 4: 重排序                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ • 按相似度分数重排序                                             │
│ • 返回最终 Top-K 结果                                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# Docker 部署 (推荐)
docker run -p 6333:6333 \
    -p 6334:6334 \
    qdrant/qdrant:latest

# 或使用 Docker Compose
# 见 https://qdrant.tech/documentation/guides/docker/
```

### 4.2 Python 客户端

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client.models import Filter, FieldCondition, MatchValue

# 连接
client = QdrantClient("localhost", port=6333)

# 创建 Collection
client.create_collection(
    collection_name="articles",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

# 添加向量
client.upsert(
    collection_name="articles",
    points=[
        PointStruct(
            id=1,
            vector=[0.1] * 1536,
            payload={"title": "量子计算入门", "author": "张三"}
        ),
        PointStruct(
            id=2,
            vector=[0.2] * 1536,
            payload={"title": "AI 发展历史", "author": "李四"}
        ),
    ]
)

# 搜索
results = client.search(
    collection_name="articles",
    query_vector=[0.1] * 1536,
    limit=5,
    query_filter=Filter(
        must=[FieldCondition(
            key="author",
            match=MatchValue(value="张三")
        )]
    ),
)

for result in results:
    print(f"ID: {result.id}, Score: {result.score}, Title: {result.payload['title']}")
```

### 4.3 混合搜索

```python
# 带过滤的向量搜索
results = client.search(
    collection_name="articles",
    query_vector=query_embedding,
    query_filter=Filter(
        must=[
            FieldCondition(key="author", match=MatchValue(value="张三")),
            FieldCondition(key="category", match=MatchValue(value="技术")),
        ]
    ),
    limit=10,
)
```

### 4.4 批量操作

```python
# 批量删除
client.delete(
    collection_name="articles",
    points_selector=[1, 2, 3],
)

# 条件删除
client.delete(
    collection_name="articles",
    points_selector=FilterSelector(
        filter=Filter(
            must=[FieldCondition(
                key="created_at",
                range=Range(
                    lt="2024-01-01"
                )
            )]
        )
    )
)
```

---

## 5. 高级特性

### 5.1 稀疏向量

```python
from qdrant_client.models import SparseVector, SparseIndexParams

# 创建支持稀疏向量的 Collection
client.create_collection(
    collection_name="documents",
    vectors_config={
        "dense": VectorParams(size=1536, distance=Distance.COSINE),
    },
    sparse_vectors_config={
        "sparse": SparseIndexParams(indexed_filter_fields=["category"])
    }
)

# 插入稀疏向量
client.upsert(
    collection_name="documents",
    points=[
        PointStruct(
            id=1,
            vector={
                "dense": [0.1] * 1536,
                "sparse": SparseVector(
                    indices=[1, 5, 10],
                    values=[0.1, 0.2, 0.3]
                )
            }
        )
    ]
)
```

### 5.2 多租户

```python
# 使用 Namespace 隔离租户
client.set_collection(collection_name="shared_collection")

# 为不同租户创建/查询
client.upsert(
    collection_name="shared_collection",
    points=[...],
    shard_key_selector=["tenant_a"],  # 指定租户
)
```

---

## 6. 对比与选择

### 6.1 与其他向量数据库对比

| 维度 | Qdrant | Weaviate | Chroma | Milvus |
|------|--------|----------|--------|--------|
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **混合搜索** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **多模态** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **生产就绪** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **云托管** | Qdrant Cloud | Weaviate Cloud | 第三方 | Zilliz Cloud |

### 6.2 适用场景

**✅ Qdrant 最佳场景:**
- 高性能生产环境
- 需要精确控制
- 混合搜索 + 过滤
- 多租户隔离

---

## 参考资源

- [Qdrant GitHub](https://github.com/qdrant/qdrant)
- [Qdrant 文档](https://qdrant.tech/documentation/)
- [Qdrant Cloud](https://cloud.qdrant.io/)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*