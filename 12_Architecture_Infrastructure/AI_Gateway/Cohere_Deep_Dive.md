---
title: "Cohere: 企业 AI 平台"
category: "12-architecture-infrastructure-ai-gateway"
tags: ["ai-gateway", "api-management", "routing", "litellm"]
summary: "> **一句话理解**: Cohere 是企业 AI 平台——顶级 embedding 模型、多语言支持、语义搜索、Rerank 排序，企业级 AI 基础设施。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Cohere Deep Dive"
  - Cohere_Deep_Dive

---
# Cohere: 企业 AI 平台

> **一句话理解**: Cohere 是企业 AI 平台——顶级 embedding 模型、多语言支持、语义搜索、Rerank 排序，企业级 AI 基础设施。

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
Cohere: 企业 AI 平台
═══════════════════════════════════════════════════════════════════

定位: 面向企业的 AI 平台，提供世界顶级的 embedding 和 LLM API

核心理念:
───────────────────────────────────────────────────────────────────
• 顶级 Embedding: 多语言覆盖，1536 维度
• Rerank: 精准排序优化
• Command: 高质量生成模型
• 多语言: 100+ 语言支持
• 私密部署: VPC/私有云
• 企业安全: SOC 2 / HIPAA
```

### 1.2 核心产品

| 产品 | 说明 |
|------|------|
| **Embed** | 文本 embedding 模型 |
| **Rerank** | 语义排序优化 |
| **Command** | 生成式 LLM |
| **Multilingual** | 多语言模型 |
| **Embed + Rerank** | 检索增强方案 |

### 1.3 性能数据

| 模型 | 维度 | MTEB 得分 | 语言 |
|------|------|-----------|------|
| embed-english-v3.0 | 1024/1536 | 64.6% | 英文 |
| embed-multilingual-v3.0 | 1024/1536 | 63.2% | 100+ |
| embed-english-light-v3.0 | 384 | 62.0% | 英文 |

---

## 2. 核心概念

### 2.1 Embedding 模型

```
Cohere Embedding
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Embedding 模型                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  输入: 文本 (单句/批量)                                           │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Cohere Embedding Model                     │ │
│  │                                                              │ │
│  │  • 1536 维输出                                             │ │
│  │  • L2 normalize                                          │ │
│  │  • 多语言支持                                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  输出: 向量 [0.1, -0.2, 0.3, ...]                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Rerank 机制

```
Rerank 流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Rerank 流程                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 语义召回 (Vector Search)                                      │
│  ───────────────────────────────────────────────────────────   │
│  query: "人工智能教程"                                           │
│  召回: [doc1, doc2, doc3, doc4, doc5]                         │
│                                                                   │
│  2. Rerank 精排                                                  │
│  ───────────────────────────────────────────────────────────   │
│  query + doc → Cross-Encoder 评分                               │
│  排序: [doc3, doc1, doc5, doc2, doc4]                         │
│                                                                   │
│  优势:                                                            │
│  • 召回阶段: 高效，召回候选集                                     │
│  • 排序阶段: 精准，优化最终排序                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. 架构设计

### 3.1 API 架构

```
Cohere API 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Cohere API                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Application Layer                             │   │
│   │  • RAG 系统                                             │   │
│   │  • 语义搜索                                             │   │
│   │  • 文本分类                                             │   │
│   │  • 聚类分析                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Cohere API                                   │   │
│   │  • /embed (文本向量化)                                   │   │
│   │  • /rerank (语义排序)                                    │   │
│   │  • /generate (文本生成)                                  │   │
│   │  └── /chat (对话)                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Inference Infrastructure                      │   │
│   │  • GPU Cluster                                          │   │
│   │  • Load Balancing                                       │   │
│   │  └── Autoscaling                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install cohere
```

### 4.2 Embedding

```python
import cohere

# 初始化客户端
co = cohere.Client("YOUR_API_KEY")

# 单文本 embedding
response = co.embed(
    texts=["人工智能是计算机科学的一个分支"],
    model="embed-english-v3.0",
    input_type="search_document"
)

print(response.embeddings[0][:5])
# [0.023, -0.045, 0.034, ...]

# 批量 embedding
response = co.embed(
    texts=[
        "人工智能教程",
        "机器学习入门",
        "深度学习实战"
    ],
    model="embed-multilingual-v3.0",
    input_type="search_document"
)
```

### 4.3 Rerank

```python
# 语义排序
response = co.rerank(
    query="人工智能入门教程",
    documents=[
        "人工智能导论",
        "机器学习基础",
        "Python 深度学习教程",
        "人工智能伦理与社会影响",
        "深度学习入门指南"
    ],
    top_n=3,
    model="rerank-multilingual-v2.0"
)

print(response.results)
# [RankResult(index=4, relevance_score=0.89),
#  RankResult(index=0, relevance_score=0.76),
#  RankResult(index=1, relevance_score=0.72)]
```

### 4.4 文本生成

```python
# 文本生成
response = co.generate(
    model="command",
    prompt="用一句话解释什么是机器学习:",
    max_tokens=100,
    temperature=0.5
)

print(response.generations[0].text)
# "机器学习是让计算机通过数据学习和改进的人工智能分支。"
```

---

## 5. 高级特性

### 5.1 RAG 增强搜索

```python
# 完整的 RAG 流程
query = "Transformer 架构工作原理"

# 1. Embed 查询
query_embedding = co.embed(
    texts=[query],
    model="embed-english-v3.0",
    input_type="search_query"
).embeddings[0]

# 2. 向量搜索 (在你的向量库中)
documents = vector_store.search(query_embedding, top_k=20)

# 3. Rerank 精排
ranked = co.rerank(
    query=query,
    documents=documents,
    top_n=5,
    model="rerank-english-v2.0"
)

# 4. 构建上下文
context = "\n".join([d.text for d in ranked.results])

# 5. 生成回答
response = co.generate(
    model="command",
    prompt=f"基于以下内容回答问题:\n{context}\n\n问题: {query}"
)
```

### 5.2 多语言搜索

```python
# 多语言 embedding
response = co.embed(
    texts=[
        "人工智能",  # 中文
        "Artificial Intelligence",  # 英文
        "Intelligence Artificielle",  # 法文
        "Künstliche Intelligenz"  # 德文
    ],
    model="embed-multilingual-v3.0",
    input_type="search_document"
)

# 跨语言搜索
query_embedding = co.embed(
    texts=["人工智能的最新发展"],
    model="embed-multilingual-v3.0",
    input_type="search_query"
).embeddings[0]
```

### 5.3 VPC 部署

```python
# 企业版配置
co = cohere.Client(
    api_key="YOUR_API_KEY",
    # VPC 部署时使用
    # base_url="https://your-vpc.cohere.ai"
)
```

---

## 6. 对比与选择

### 6.1 Embedding 服务对比

| 维度 | Cohere | OpenAI | HuggingFace |
|------|--------|--------|-------------|
| **英文质量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **多语言** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **向量维度** | 1024/1536 | 1536 | 可配置 |
| **Rerank** | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐⭐ |
| **企业特性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 企业搜索 | Cohere |
| 多语言 RAG | Cohere |
| 英文为主 | OpenAI / Cohere |
| 成本敏感 | HuggingFace |

---

## 参考资源

- [Cohere GitHub](https://github.com/cohere-ai/cohere-python)
- [Cohere 文档](https://docs.cohere.com/)
- [Cohere Embeddings](https://docs.cohere.com/docs/embeddings)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*
