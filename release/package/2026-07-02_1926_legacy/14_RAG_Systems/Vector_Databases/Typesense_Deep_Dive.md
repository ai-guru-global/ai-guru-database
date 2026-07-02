---
title: "Typesense: 快速矢量搜索"
category: "14-rag-systems"
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: "> **一句话理解**: Typesense 是闪电般的矢量搜索——专为搜索设计、极低延迟、模糊匹配、开源替代 Elasticsearch 的候选。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Typesense Deep Dive"
  - Typesense_Deep_Dive

---
# Typesense: 快速矢量搜索

> **一句话理解**: Typesense 是闪电般的矢量搜索——专为搜索设计、极低延迟、模糊匹配、开源替代 Elasticsearch 的候选。

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
Typesense: 闪电般快速搜索
═══════════════════════════════════════════════════════════════════

定位: 专为搜索设计的开源引擎，极低延迟、模糊匹配、语义搜索

核心理念:
───────────────────────────────────────────────────────────────────
• 极速: 毫秒级响应
• 简单: 开箱即用
• 容错: 自动故障恢复
• 搜索友好: 模糊匹配/拼写纠正
• 矢量: 语义搜索支持
• 开源: Apache 2.0
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **矢量搜索** | ANN 算法 |
| **全文搜索** | 分词/过滤/排序 |
| **模糊匹配** | 拼写容错 |
| **分面搜索** | 多维度聚合 |
| **Geo 搜索** | 地理位置 |
| **自动补全** | 即时搜索建议 |

### 1.3 性能数据

| 规模 | 延迟 | QPS |
|------|------|-----|
| 1M 文档 | <10ms | 50,000+ |
| 10M 文档 | <20ms | 30,000+ |
| 100M 文档 | <50ms | 10,000+ |

---

## 2. 核心概念

### 2.1 数据结构

```json
// Document
{
  "id": "1",
  "title": "人工智能导论",
  "content": "AI 是...",
  "category": "技术",
  "embedding": [0.1, 0.2, ...],  // 可选矢量
  "price": 99.99,
  "in_stock": true
}
```

### 2.2 搜索类型

| 类型 | 说明 |
|------|------|
| **全文搜索** | 关键词匹配 |
| **矢量搜索** | 语义相似 |
| **混合搜索** | 全文+矢量 |
| **过滤搜索** | 条件筛选 |
| **Geo 搜索** | 距离排序 |

---

## 3. 架构设计

### 3.1 系统架构

```
Typesense 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Typesense 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Typesense Server                             │   │
│   │  • REST API                                             │   │
│   │  • Search Engine                                       │   │
│   │  • Vector Index                                        │   │
│   │  • Document Store                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Storage Engine                                │   │
│   │  • RocksDB                                             │   │
│   │  • Disk Index                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# Docker
docker run -p 8108:8108 -v/tmp/typesense:/data typesense/typesense:latest \
  --data-dir /data \
  --api-key=xyz

# 或使用 npm
npm install typesense
```

### 4.2 Python SDK

```bash
pip install typesense
```

```python
import typesense

# 创建客户端
client = typesense.Client({
    'nodes': [{
        'host': 'localhost',
        'port': '8108',
        'protocol': 'http'
    }],
    'api_key': 'xyz',
    'connection_timeout_seconds': 2
})

# 创建 Collection
collection = {
    'name': 'documents',
    'fields': [
        {'name': 'title', 'type': 'string'},
        {'name': 'content', 'type': 'string'},
        {'name': 'embedding', 'type': 'float[]', 'num_dim': 1536},
        {'name': 'category', 'type': 'string', 'facet': True}
    ]
}

client.collections.create(collection)
```

### 4.3 索引和搜索

```python
# 添加文档
documents = [
    {
        'id': '1',
        'title': '人工智能导论',
        'content': 'AI 是计算机科学的一个分支',
        'embedding': [0.1, 0.2, 0.3] * 512,
        'category': '技术'
    }
]

client.collections['documents'].documents.import_(documents)

# 全文搜索
search_params = {
    'q': '人工智能',
    'query_by': 'title,content',
    'facet_by': 'category'
}

results = client.collections['documents'].documents.search(search_params)

# 矢量搜索
search_params = {
    'search_cut_off': 10,
    'vector_query': 'embedding:([0.1, 0.2, ...], distance_threshold:0.2)'
}

results = client.collections['documents'].documents.search(search_params)
```

---

## 5. 高级用法

### 5.1 混合搜索

```python
# 全文 + 矢量混合
search_params = {
    'q': 'AI',
    'query_by': 'title,content',
    'vector_query': 'embedding:([0.1, 0.2], k:10)',
    'rank_by': '_text_match:50, _vector_distance:50'
}

results = client.collections['documents'].documents.search(search_params)
```

### 5.2 拼写纠正

```python
search_params = {
    'q': 'artificila intellignece',  # 故意拼错
    'query_by': 'title,content',
    'pre_segmented_query': True,
    'num_typos': 2  # 允许 2 个拼写错误
}

results = client.collections['documents'].documents.search(search_params)
```

---

## 6. 对比与选择

### 6.1 搜索引擎对比

| 维度 | Typesense | Elasticsearch | Meilisearch |
|------|-----------|---------------|-------------|
| **速度** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **矢量搜索** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **资源** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 快速搜索 | Typesense |
| 企业搜索 | Elasticsearch |
| 简单集成 | Meilisearch |
| 矢量搜索 | Typesense / Qdrant |

---

## 参考资源

- [Typesense GitHub](https://github.com/typesense/typesense)
- [Typesense 文档](https://typesense.org/docs/)
- [Typesense Cloud](https://typesense.cloud/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[14_RAG_Systems/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[14_RAG_Systems/RAG_Systems.md|RAG_Systems]]
- [[14_RAG_Systems/README_Advanced.md|README_Advanced]]
- [[14_RAG_Systems/RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[_synthesis/rag-vector-database.md|rag-vector-database]]
