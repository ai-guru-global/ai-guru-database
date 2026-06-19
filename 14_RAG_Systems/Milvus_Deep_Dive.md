---
title: "Milvus: 超大规模向量数据库"
category: "11-rag-systems"
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: "> **一句话理解**: Milvus 是超大规模向量数据库——万亿向量秒级检索、分片水平扩展、混合标量过滤，AI 时代的高性能向量检索引擎。"
created: "2026-05-31"
updated: "2026-05-31"
---

# Milvus: 超大规模向量数据库

> **一句话理解**: Milvus 是超大规模向量数据库——万亿向量秒级检索、分片水平扩展、混合标量过滤，AI 时代的高性能向量检索引擎。

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
Milvus: 超大规模向量数据库
═══════════════════════════════════════════════════════════════════

定位: 专为 AI 设计的高性能向量数据库，支持万亿级向量检索

核心理念:
───────────────────────────────────────────────────────────────────
• 超大规模: 万亿向量支持
• 高性能: 秒级检索延迟
• 水平扩展: 分片集群架构
• 混合检索: 向量+标量过滤
• 云原生: K8s 原生支持
• 开源: Apache 2.0 协议
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **万亿向量** | 分片存储，水平扩展 |
| **ANN 索引** | HNSW/IVF/DiskANN |
| **混合检索** | 向量+SQL 标量过滤 |
| **多模态** | 支持图像/音频/视频 |
| **实时更新** | CRUD 动态操作 |
| **云原生** | K8s/Milvus Operator |

### 1.3 性能数据

| 规模 | 向量维度 | 索引类型 | QPS | 延迟 |
|------|----------|----------|-----|------|
| 10M | 128 | HNSW | 50,000 | <10ms |
| 100M | 128 | HNSW | 15,000 | <20ms |
| 1B | 128 | DiskANN | 5,000 | <50ms |
| 1T | 768 | IVF | 1,000 | <100ms |

---

## 2. 核心概念

### 2.1 数据模型

```
Milvus 数据模型
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Milvus 数据模型                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Database (数据库)                                                │
│  │                                                                  │
│  ├── Collection (集合)                                          │
│  │    ├── Schema: 字段定义                                       │
│  │    ├── Fields: id + vector + metadata                        │
│  │    └── Partitions: 数据分区                                  │
│  │                                                                  │
│  └── Partition (分区)                                            │
│       ├── 逻辑隔离                                              │
│       └── 提升查询性能                                           │
│                                                                   │
│  字段类型:                                                        │
│  • Primary Key: Int64 / VARCHAR                                 │
│  • Vector: Float32 / BFLOAT16 / FP16                           │
│  • Scalar: Int/VarChar/Float/Double/Bool                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 索引类型

| 索引 | 适用规模 | 精度 | 内存 | 延迟 |
|------|----------|------|------|------|
| **FLAT** | <1M | 100% | 高 | 低 |
| **IVF_FLAT** | 1M-100M | 高 | 中 | 中 |
| **IVF_SQ8** | 10M-1B | 中 | 低 | 中 |
| **HNSW** | 1M-100M | 极高 | 高 | 极低 |
| **DiskANN** | 100M-10B+ | 高 | 低 | 低 |

---

## 3. 架构设计

### 3.1 系统架构

```
Milvus 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Milvus 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Application Layer                             │   │
│   │  • Python SDK                                            │   │
│   │  • Go SDK                                                │   │
│   │  • Java SDK                                              │   │
│   │  • REST API                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Proxy Layer                                   │   │
│   │  • 请求路由                                              │   │
│   │  • 结果聚合                                              │   │
│   │  • 负载均衡                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Coordinator Layer                            │   │
│   │  ├── Root Coord: 元数据管理                              │   │
│   │  ├── Data Coord: 数据节点管理                            │   │
│   │  └── Query Coord: 查询节点管理                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐        │
│   │ Data Node │       │Query Node │       │Index Node │        │
│   │ 数据节点  │       │ 查询节点  │       │ 索引节点  │        │
│   └───────────┘       └───────────┘       └───────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 查询流程

```
Milvus 查询流程
═══════════════════════════════════════════════════════════════════

查询请求: "查找与 [0.1, 0.2, ...] 最相似的 10 个向量"

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 路由到 Query Node                                          │
│ ───────────────────────────────────────────────────────────────  │
│ Proxy 接收请求 → Root Coord 查询元数据 → 路由到对应 Query Node     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: ANN 检索                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ 1. 在 HNSW/IVF 索引中搜索                                         │
│ 2. 计算余弦/欧氏距离                                               │
│ 3. 返回 Top-K 候选集                                               │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 标量过滤                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ 1. 应用 WHERE 条件过滤                                            │
│ 2. 过滤不满足条件的向量                                           │
│ 3. 返回最终结果                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# Docker Compose (推荐)
wget https://github.com/milvus-io/milvus/releases/latest/download/milvus-standalone-docker-compose.yml
docker-compose up -d

# 或使用 Helm (K8s)
helm install milvus-release milvus/milvus -n milvus --create-namespace
```

### 4.2 Python SDK

```bash
pip install pymilvus
```

```python
from pymilvus import MilvusClient, DataType

# 创建客户端
client = MilvusClient(uri="http://localhost:19530")

# 创建集合
schema = MilvusClient.create_schema(
    auto_id=True,
    enable_dynamic_field=True,
)

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="vector", datatype=DataType.FLOAT_VECTOR, dim=128)
schema.add_field(field_name="category", datatype=DataType.VARCHAR, max_length=256)

client.create_collection(
    collection_name="my_collection",
    schema=schema,
    index_params={"metric_type": "COSINE", "index_type": "HNSW", "params": {"M": 16, "efConstruction": 200}}
)

# 插入数据
data = [
    {"vector": [0.1] * 128, "category": "tech"},
    {"vector": [0.2] * 128, "category": "science"},
]

result = client.insert(collection_name="my_collection", data=data)
print(f"Inserted: {result.insert_count} entities")

# 搜索
search_params = {"metric_type": "COSINE", "params": {"ef": 128}}

results = client.search(
    collection_name="my_collection",
    data=[[0.1] * 128],
    search_params=search_params,
    limit=10,
    output_fields=["category"]
)

print(results)
```

### 4.3 混合检索

```python
# 带标量过滤的搜索
results = client.search(
    collection_name="my_collection",
    data=[[0.1] * 128],
    search_params=search_params,
    filter="category == 'tech'",
    limit=10,
    output_fields=["category", "id"]
)
```

---

## 5. 高级特性

### 5.1 分区操作

```python
# 创建分区
client.create_partition(
    collection_name="my_collection",
    partition_name="tech_docs"
)

# 插入到分区
client.insert(
    collection_name="my_collection",
    partition_name="tech_docs",
    data=[{"vector": [0.1] * 128, "category": "tech"}]
)

# 只在分区中搜索
results = client.search(
    collection_name="my_collection",
    data=[[0.1] * 128],
    partition_names=["tech_docs"],
    limit=10
)
```

### 5.2 实时更新

```python
# 删除
client.delete(
    collection_name="my_collection",
    filter="id in [1, 2, 3]"
)

# 更新 (先删后插)
client.upsert(
    collection_name="my_collection",
    data=[{"id": 1, "vector": [0.3] * 128, "category": "updated"}]
)
```

### 5.3 集群部署

```yaml
# milvus-cluster.yaml
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: milvus-cluster
spec:
  mode: cluster
  components:
    rootCoord:
      replicas: 1
    dataCoord:
      replicas: 1
    queryCoord:
      replicas: 1
  datanode:
    replicas: 2
  querynode:
    replicas: 2
  indexnode:
    replicas: 2
  proxy:
    replicas: 2
  storage:
    type: local  # 或 minio/azure/S3
```

---

## 6. 对比与选择

### 6.1 与其他向量数据库对比

| 维度 | Milvus | Qdrant | Chroma | Weaviate |
|------|--------|--------|--------|----------|
| **规模** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **多模态** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ |
| **云原生** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| <10M 向量 | Chroma / Qdrant |
| 10M-1B 向量 | Qdrant / Milvus |
| 1B+ 向量 | Milvus |
| 多模态 | Weaviate |
| 生产环境 | Qdrant / Milvus |

---

## 参考资源

- [Milvus GitHub](https://github.com/milvus-io/milvus)
- [Milvus 文档](https://milvus.io/docs)
- [Milvus Cloud](https://cloud.milvus.io/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[14_RAG_Systems/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[14_RAG_Systems/RAG_Systems.md|RAG_Systems]]
- [[14_RAG_Systems/README_Advanced.md|README_Advanced]]
- [[14_RAG_Systems/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[_synthesis/rag-vector-database.md|rag-vector-database]]
