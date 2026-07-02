---
title: "Haystack: 开源 RAG 框架"
category: "14-rag-systems"
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: "> **一句话理解**: Haystack 是 deepset 打造的模块化 RAG 框架——像搭积木一样组合 Pipeline、组件和数据源，构建强大的检索增强生成系统。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Haystack Deep Dive"
  - Haystack_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Haystack: 开源 RAG 框架

> **一句话理解**: Haystack 是 deepset 打造的模块化 RAG 框架——像搭积木一样组合 Pipeline、组件和数据源，构建强大的检索增强生成系统。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [组件详解](#5-组件详解)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Haystack: 模块化 RAG 框架
═══════════════════════════════════════════════════════════════════

定位: deepset 出品的开源 RAG 框架，强调模块化和可扩展性

核心理念:
───────────────────────────────────────────────────────────────────
•  Pipeline 架构: 像搭积木一样组合组件
•  多数据源: PDF、网页、数据库、向量数据库
•  多模型: 支持 OpenAI、Anthropic、HuggingFace 等
•  评估工具: 内置 RAG 评估指标
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Pipeline 编排** | 灵活组合检索和生成 |
| **丰富组件** | 80+ 预建组件 |
| **多数据源** | PDF、HTML、Markdown、数据库 |
| **多 Embedding** | OpenAI、SentenceTransformers 等 |
| **评估框架** | RAGAS、AnswerFaithfulness 等 |
| **YAML 配置** | 无代码/低代码构建 Pipeline |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| Haystack 0.1 | 2020.5 | 首个开源版本 |
| Haystack 1.0 | 2022.3 | Pipeline 架构 |
| Haystack 1.10 | 2023.1 | 多模态支持 |
| Haystack 1.15 | 2023.8 | YAML 配置 |
| Haystack 2.0 | 2024.2 | 完全重写，模块化 |

---

## 2. 核心概念

### 2.1 Pipeline 架构

```
Haystack Pipeline 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      Haystack Pipeline                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   输入节点                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │   │
│   │  │ FileBot│  │ WebBot │  │ SQLBot │  │ InMemory│      │   │
│   │  └────────┘  └────────┘  └────────┘  └────────┘      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    预处理节点                             │   │
│   │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │   │
│   │  │ PrePro │  │ Conver │  │ Clean  │  │ Split  │      │   │
│   │  │       │  │ terter │  │        │  │        │      │   │
│   │  └────────┘  └────────┘  └────────┘  └────────┘      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    索引节点                             │   │
│   │  ┌────────┐  ┌────────┐  ┌────────┐                   │   │
│   │  │ Embed  │  │  DocStore│  │ Retriever│                │   │
│   │  │ ding   │  │         │  │          │                 │   │
│   │  └────────┘  └────────┘  └────────┘                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    生成节点                             │   │
│   │  ┌────────┐  ┌────────┐  ┌────────┐                   │   │
│   │  │  LLM   │  │  Prompt │  │  Output │                  │   │
│   │  │       │  │  Builder│  │ Parser │                   │   │
│   │  └────────┘  └────────┘  └────────┘                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

| 组件类别 | 组件 | 说明 |
|----------|------|------|
| **数据源** | FileConverter, WebConverter, SQLConnector | 数据接入 |
| **预处理** | TextCleaner, TextSplitter, DocumentCleaner | 数据清洗 |
| **Embedding** | OpenAIEmbedder, SentenceTransformersEmbedder | 向量化 |
| **向量存储** | InMemoryDocumentStore, PineconeDocumentStore | 向量库 |
| **检索器** | BM25Retriever, EmbeddingRetriever, MultiQuery | 检索 |
| **生成器** | OpenAIGenerator, AnthropicGenerator, HuggingFaceTG | 生成 |
| **管道** | Pipeline, RootNode, join_node | 编排 |

### 2.3 检索器类型

| 检索器 | 特点 | 适用场景 |
|--------|------|----------|
| **BM25Retriever** | 稀疏检索，基于关键词 | 简单搜索 |
| **EmbeddingRetriever** | 密集检索，语义相似 | 语义理解 |
| **HybridRetriever** | 稀疏+密集混合 | 通用场景 |
| **MultiQueryRetriever** | 多查询扩展 | 提高召回 |
| **FilterRetriever** | 元数据过滤 | 结构化检索 |
| **ParentDocumentRetriever** | 父子文档检索 | 长文档 |

---

## 3. 架构设计

### 3.1 索引 Pipeline

```
索引 Pipeline 流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                    索引 Pipeline                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  文档输入                                                         │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Converter (PDF/HTML/Markdown → Document)                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ PreProcessor (清洗、分块、标准化)                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Embedder (Document → Embedding)                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ DocumentStore (存储 Document + Embedding)                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 检索生成 Pipeline

```
RAG Pipeline 流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                    RAG Pipeline                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  用户查询                                                         │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Query Embedding                                              │ │
│  │ 将查询向量化                                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Retriever (查询 → 相关文档)                                   │ │
│  │ 支持: BM25 / Embedding / Hybrid                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Prompt Builder (问题 + 上下文 → Prompt)                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ LLM Generator (Prompt → 答案)                                │ │
│  │ 支持: OpenAI / Anthropic / HuggingFace                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│      │                                                           │
│      ▼                                                           │
│  最终答案                                                         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.3 评估 Pipeline

```
Haystack 评估架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                    评估 Pipeline                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    RAG Pipeline                          │   │
│   │   Query → Retriever → Generator → Answer                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  评估指标                                 │   │
│   │  ┌───────────────┐  ┌───────────────┐  ┌────────────┐  │   │
│   │  │   Context     │  │  Answer       │  │   Faith-   │  │   │
│   │  │   Relevance   │  │  Correctness  │  │  fulness   │  │   │
│   │  └───────────────┘  └───────────────┘  └────────────┘  │   │
│   │  ┌───────────────┐  ┌───────────────┐  ┌────────────┐  │   │
│   │  │    Recall     │  │   Precision   │  │  Halluci-  │  │   │
│   │  │               │  │               │  │  nation    │  │   │
│   │  └───────────────┘  └───────────────┘  └────────────┘  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 基础安装
pip install haystack

# 带全部依赖
pip install "haystack[all]"

# 常用子依赖
pip install "haystack[preprocessing,faiss,openai]"
```

### 4.2 基础 RAG Pipeline

```python
from haystack import Pipeline
from haystack.components.retrievers import InMemoryEmbeddingRetriever
from haystack.components.generators import OpenAIGenerator
from haystack.document_stores import InMemoryDocumentStore
from haystack.components.embedders import OpenAITextEmbedder

# 1. 初始化组件
document_store = InMemoryDocumentStore()
embedder = OpenAITextEmbedder()
retriever = InMemoryEmbeddingRetriever(document_store=document_store)
generator = OpenAIGenerator(model="gpt-4o")

# 2. 构建 Pipeline
pipeline = Pipeline()
pipeline.add_component("embedder", embedder)
pipeline.add_component("retriever", retriever)
pipeline.add_component("generator", generator)

# 3. 连接组件
pipeline.connect("embedder", "retriever")
pipeline.connect("retriever", "generator")

# 4. 索引文档
from haystack import Document
docs = [
    Document(content="Haystack 是开源 RAG 框架"),
    Document(content="它支持模块化 Pipeline 设计"),
]
pipeline.run({"embedder": {"documents": docs}})

# 5. 查询
result = pipeline.run({
    "embedder": {"text": "什么是 Haystack?"},
    "retriever": {"query": "什么是 Haystack?"},
    "generator": {"prompt": "基于上下文回答: 什么是 Haystack?"}
})
print(result["generator"]["replies"][0])
```

### 4.3 YAML 配置方式

```yaml
# rag_pipeline.yaml
version: '1.25'

components:
  - name: text_embedder
    type: OpenAITextEmbedder
    init_parameters:
      api_key: ${OPENAI_API_KEY}

  - name: document_store
    type: InMemoryDocumentStore

  - name: retriever
    type: InMemoryEmbeddingRetriever
    init_parameters:
      document_store: document_store

  - name: generator
    type: OpenAIGenerator
    init_parameters:
      api_key: ${OPENAI_API_KEY}
      model: gpt-4o

pipelines:
  - name: rag_pipeline
    nodes:
      - name: text_embedder
        inputs: [Query]
      - name: retriever
        inputs: [text_embedder]
      - name: generator
        inputs: [retriever]
```

```python
from haystack import Pipeline

# 从 YAML 加载 Pipeline
pipeline = Pipeline.load_from_yaml("rag_pipeline.yaml")
result = pipeline.run({"text_embedder": {"text": "什么是 RAG?"}})
```

### 4.4 使用 HuggingFace 模型

```python
from haystack.components.embedders import HuggingFaceTextEmbedder
from haystack.components.generators import HuggingFaceLocalGenerator

# 使用 HuggingFace Embedding
embedder = HuggingFaceTextEmbedder(
    model="sentence-transformers/all-MiniLM-L6-v2"
)

# 使用本地 HuggingFace LLM
generator = HuggingFaceLocalGenerator(
    model="EleutherAI/gpt-neo-2.7B"
)
```

---

## 5. 组件详解

### 5.1 检索器对比

```python
from haystack.components.retrievers import (
    BM25Retriever,
    EmbeddingRetriever,
    HybridRetriever,
    ParentDocumentRetriever,
)

# BM25 (稀疏检索)
retriever = BM25Retriever(document_store=document_store)

# Embedding (密集检索)
retriever = EmbeddingRetriever(
    document_store=document_store,
    embedding_model="sentence-transformers/all-MiniLM-L6-v2"
)

# Hybrid (混合检索)
retriever = HybridRetriever(
    document_store=document_store,
    embedding_retriever=EmbeddingRetriever(document_store=document_store),
    bm25_retriever=BM25Retriever(document_store=document_store),
    scale=0.5  # 权重平衡
)
```

### 5.2 自定义组件

```python
from haystack import component

@component
class CustomFormatter:
    """自定义格式化组件"""

    @component.output_type(str)
    def forward(self, docs: list[Document]) -> str:
        """将文档列表格式化为上下文字符串"""
        context = "\n\n".join([f"Document {i+1}: {doc.content}" for i, doc in enumerate(docs)])
        return context

# 使用自定义组件
pipeline.add_component("formatter", CustomFormatter())
pipeline.connect("retriever", "formatter")
pipeline.connect("formatter", "generator")
```

### 5.3 评估指标

```python
from haystack import Pipeline
from haystack.components.evaluators import (
    AnswerCorrectnessEvaluator,
    FaithfulnessEvaluator,
    SBERTEvaluator,
)

# 创建评估 Pipeline
eval_pipeline = Pipeline()
eval_pipeline.add_component("answer_correctness", AnswerCorrectnessEvaluator())
eval_pipeline.add_component("faithfulness", FaithfulnessEvaluator())
eval_pipeline.add_component("sbert", SBERTEvaluator())

# 运行评估
eval_result = eval_pipeline.run({
    "answer_correctness": {
        "predicted_answer": "Haystack 是 RAG 框架",
        "ground_truth_answer": "Haystack 是开源 RAG 框架",
    },
    "faithfulness": {
        "predicted_answer": "Haystack 是 RAG 框架",
        "contexts": ["Haystack 是开源 RAG 框架"],
    },
})
print(eval_result)
```

---

## 6. 对比与选择

### 6.1 与其他 RAG 框架对比

| 维度 | Haystack | LangChain | LlamaIndex |
|------|----------|-----------|------------|
| **模块化** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **组件丰富度** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **YAML 配置** | ✅ | ❌ | ❌ |
| **评估工具** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **文档质量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 适用场景

**✅ Haystack 最佳场景:**
- 需要灵活 Pipeline 配置
- 复杂多阶段检索
- 大量自定义组件
- 重视评估和调试
- 企业级 RAG 应用

**❌ 不适合场景:**
- 简单快速原型 (用 LlamaIndex)
- 完全无代码需求 (用 Dify)
- 只需要简单 Retrieval

---

## 参考资源

- [Haystack GitHub](https://github.com/deepset-ai/haystack)
- [Haystack 文档](https://docs.haystack.com/)
- [Haystack Tutorial](https://haystack.deepset.ai/cookbook)
- [deepset Cloud](https://cloud.deepset.ai/) - 托管服务

---

*Last updated: 2026-04-24*
*Version: 1.0.0*

## Related

- [[14_RAG_Systems/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[14_RAG_Systems/RAG_Systems.md|RAG_Systems]]
- [[14_RAG_Systems/README_Advanced.md|README_Advanced]]
- [[14_RAG_Systems/RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[_synthesis/rag-vector-database.md|rag-vector-database]]
