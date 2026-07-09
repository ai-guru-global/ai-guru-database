---
title: 'LlamaIndex: 数据连接框架'
category: '14-rag-systems'
tags: ["rag", "retrieval", "vector-database", "embedding", "llama"]
summary: '> **一句话理解**: LlamaIndex 是 LLM 应用的数据连接器——把私有数据接入大模型，让模型"阅读"并"理解"你的文档。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Llamaindex Deep Dive"
  - "LlamaIndex Deep Dive"
  - LlamaIndex_Deep_Dive

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LlamaIndex: 数据连接框架

> **一句话理解**: LlamaIndex 是 LLM 应用的数据连接器——把私有数据接入大模型，让模型"阅读"并"理解"你的文档。

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
LlamaIndex: 数据连接框架
═══════════════════════════════════════════════════════════════════

定位: 专注文档到 LLM 的数据连接，提供高质量的索引和检索

核心理念:
───────────────────────────────────────────────────────────────────
• 数据优先: 专注数据连接和索引
• 查询优化: 高级检索策略
• 可组合性: 灵活的 API 设计
• 评估工具: 内置评估指标
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **数据连接器** | 100+ 数据源连接 |
| **索引策略** | 多种索引类型 |
| **查询引擎** | 高级检索和推理 |
| **评估框架** | RAG 评估指标 |
| **多模态** | 图像、视频理解 |
| **finetune 支持** | 数据增强微调 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| GPT Index 0.1 | 2022.11 | 首个文档索引工具 |
| LlamaIndex 0.6 | 2023.4 | 重命名，生态扩展 |
| v0.8 | 2023.8 | QueryPipeline |
| v0.10 | 2024.1 | 自定义索引 |
| v0.11 | 2024.5 | Multi-modal |
| v1.0 | 2025.1 | 生产就绪 |

---

## 2. 核心概念

### 2.1 核心对象

```
LlamaIndex 核心对象
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      LlamaIndex 核心对象                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Document (文档)                                                  │
│  ├── id_, doc_id                                                │
│  ├── metadata (元数据)                                          │
│  ├── relationships (关系)                                        │
│  └── text, embedding                                            │
│         │                                                        │
│         ▼                                                        │
│  Node (节点)                                                     │
│  ├── id_, doc_id                                                │
│  ├── metadata                                                    │
│  ├── relationships (父子文档关系)                                 │
│  └── text, embedding                                            │
│         │                                                        │
│         ▼                                                        │
│  Index (索引)                                                    │
│  ├── VectorStoreIndex (向量索引)                                 │
│  ├── KeywordTableIndex (关键词索引)                             │
│  ├── KnowledgeGraphIndex (知识图谱)                             │
│  └── TreeIndex (树索引)                                         │
│         │                                                        │
│         ▼                                                        │
│  QueryEngine (查询引擎)                                         │
│  ├── RetrieverQueryEngine                                       │
│  ├── SubQuestionQueryEngine                                      │
│  └── KnowledgeGraphQueryEngine                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 索引类型

| 索引类型 | 原理 | 适用场景 |
|----------|------|----------|
| **VectorStoreIndex** | 向量相似度 | 语义检索 |
| **KeywordTableIndex** | 关键词匹配 | 精确搜索 |
| **KnowledgeGraphIndex** | 知识图谱 | 关系推理 |
| **TreeIndex** | 层次树结构 | 摘要生成 |
| **ComposableGraph** | 多索引组合 | 复杂场景 |

### 2.3 索引与查询流程

```
LlamaIndex 完整流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        索引阶段 (Indexing)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  数据源 (PDF/Notion/Web)                                          │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          Reader / DocumentParser                           │ │
│  │          读取文档 → Document 对象                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          NodeParser                                        │ │
│  │          文档分块 → Node 节点                               │ │
│  │          (支持: Sentence, Token, Semantic)                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          Embedding Model                                    │ │
│  │          文本向量化 → 存储到 Vector Store                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  Index (索引完成)                                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                        查询阶段 (Querying)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  用户查询 "解释量子纠缠"                                          │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          Query Embedding                                    │ │
│  │          查询向量化                                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          Retriever                                          │ │
│  │          Top-K 相关节点检索                                  │ │
│  │          (支持: Vector, BM25, Hybrid, Metadata)             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          NodePostprocessor                                  │ │
│  │          节点后处理 (重排序、过滤)                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          Response Synthesis                                 │ │
│  │          构建 Prompt → LLM 生成 → 响应                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. 架构设计

### 3.1 模块化设计

```
LlamaIndex 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        LlamaIndex 架构                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      API Layer                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │  High-Level │  │    Mid-Level │  │  Low-Level   │     │ │
│  │  │  API        │  │    API       │  │  API         │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Core Modules                             │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │ │
│  │  │Indices │ │ Query  │ │ Node   │ │Embed-  │ │  LLMs  │  │ │
│  │  │        │ │ Engines│ │Parser  │ │ding    │ │        │  │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 Storage & Retrievers                       │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐             │ │
│  │  │Vector  │ │Document│ │ Index  │ │ Node   │             │ │
│  │  │Stores  │ │Stores  │ │Stores  │ │Stores  │             │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 自定义能力

```python
# LlamaIndex 支持多层定制

# Level 1: 高层 API (快速使用)
from llama_index import VectorStoreIndex, SimpleDirectoryReader
documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("问题")

# Level 2: 中层 API (定制组件)
from llama_index import VectorStoreIndex, StorageContext
from llama_index.vector_stores import PineconeVectorStore

index = VectorStoreIndex.from_documents(
    documents,
    storage_context=StorageContext(
        vector_store=PineconeVectorStore(...)  # 自定义存储
    ),
    embed_model="local:BAAI/bge-small-en-v1.5"  # 自定义 Embedding
)

# Level 3: 低层 API (完全控制)
from llama_index import ServiceContext, NodeParser
from llama_index.node_parser import SimpleNodeParser

service_context = ServiceContext(
    llm=OpenAI(model="gpt-4"),
    embed_model=OpenAIEmbeddings(),
    node_parser=SimpleNodeParser(...),  # 自定义分词
)
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 基础安装
pip install llama-index

# 常用依赖
pip install llama-index[vector_stores]     # 向量存储
pip install llama-index[llms]              # LLM 支持
pip install llama-index[evaluation]        # 评估工具

# 全量依赖
pip install llama-index[all]
```

### 4.2 基础 RAG

```python
from llama_index import VectorStoreIndex, SimpleDirectoryReader

# 1. 加载文档
documents = SimpleDirectoryReader("./data").load_data()

# 2. 创建索引
index = VectorStoreIndex.from_documents(documents)

# 3. 创建查询引擎
query_engine = index.as_query_engine(
    similarity_top_k=3,  # 检索 Top-3
    vector_store_query_mode="hybrid"  # 混合检索
)

# 4. 查询
response = query_engine.query("这份文档的主要内容是什么？")
print(response)
```

### 4.3 使用自定义 LLM

```python
from llama_index import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms import OpenAI, Anthropic

# 使用 OpenAI
llm = OpenAI(model="gpt-4o", temperature=0.7)
index = VectorStoreIndex.from_documents(
    documents,
    llm=llm
)

# 使用 Claude
llm = Anthropic(model="claude-3-5-sonnet-20241022")
index = VectorStoreIndex.from_documents(
    documents,
    llm=llm
)
```

### 4.4 使用本地模型

```python
from llama_index import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms import Ollama

# 使用 Ollama 本地模型
llm = Ollama(model="llama3", base_url="http://localhost:11434")
embed_model = OllamaEmbedding(model_name="bge-small-en-v1.5")

index = VectorStoreIndex.from_documents(
    documents,
    llm=llm,
    embed_model=embed_model
)
```

---

## 5. 高级用法

### 5.1 高级检索策略

```python
from llama_index import VectorStoreIndex, MultiModalVectorStoreIndex
from llama_index.query_engine import SubQuestionQueryEngine

# 自动子问题分解
query_engine = SubQuestionQueryEngine.from_defaults(
    index=index,
    sub_question_prompt_template="...",
)

# 多步推理查询
response = query_engine.query(
    "比较 2023 和 2024 年的营收，并计算增长率"
)
```

### 5.2 自定义 Node Parser

```python
from llama_index import Document
from llama_index.node_parser import SentenceWindowNodeParser

# 滑动窗口节点解析
node_parser = SentenceWindowNodeParser(
    window_size=3,           # 窗口内句子数
    window_metadata=["sentence", "original_text"],
    aggregate_only=True,
)

nodes = node_parser.get_nodes_from_documents([Document(text="...")])
```

### 5.3 评估框架

```python
from llama_index.evaluation import (
    RetrieverEvaluator,
    ResponseEvaluator,
    FaithfulnessEvaluator,
)

# 检索评估
retriever = index.as_retriever()
retriever_evaluator = RetrieverEvaluator.from_metric_names([
    "mrr", "hit_rate", "precision"
])
results = retriever_evaluator.evaluate(
    query="query",
    expected_ids=["node_id1", "node_id2"],
    retrieved_nodes=retrieved_nodes,
)

# 生成评估
response_evaluator = ResponseEvaluator()
faithfulness_eval = FaithfulnessEvaluator()
```

---

## 6. 对比与选择

### 6.1 与其他框架对比

| 维度 | LlamaIndex | LangChain | Haystack |
|------|------------|-----------|----------|
| **数据索引** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **查询引擎** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **API 复杂度** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **组件灵活性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **文档质量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **评估工具** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 适用场景

**✅ LlamaIndex 最佳场景:**
- 复杂文档检索场景
- 需要精确控制索引过程
- 数据密集型应用
- 评估和优化 RAG

**❌ 不适合场景:**
- 简单快速原型 (用 LangChain)
- 复杂工作流编排 (用 LangGraph)
- 可视化开发需求 (用 Dify)

---

## 参考资源

- [LlamaIndex GitHub](https://github.com/run-llama/llama_index)
- [LlamaIndex 文档](https://docs.llamaindex.ai/)
- [LlamaIndex 教程](https://github.com/run-llama/llama_index/tree/main/docs/docs/examples)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[RAG系统/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[RAG系统/RAG_Systems.md|RAG_Systems]]
- [[RAG系统/README_Advanced.md|README_Advanced]]
- [[RAG系统/RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[_synthesis/rag-vector-database.md|rag-vector-database]]
