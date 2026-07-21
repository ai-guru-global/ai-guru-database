---
title: "LlamaIndex"
category: -concepts
tags: ["llamaindex", "rag", "llm", "framework", "data-framework", "agent", "indexing", "retrieval"]
relationships:
  - target: "概念/rag"
    type: extends
  - target: "概念/agent-framework"
    type: related_to
  - target: "概念/langchain"
    type: related_to
  - target: "概念/embedding"
    type: uses
  - target: "概念/vector-database"
    type: uses
sources:
  - RAG系统/RAG_Frameworks/LlamaIndex_Deep_Dive.md
summary: "LlamaIndex 是面向 LLM 应用的数据框架，专注于数据摄取、索引、检索和 RAG。它提供 Document、Index、Query Engine、Agent 等抽象，是构建企业知识库和检索增强生成系统的核心工具。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Llamaindex
  - LlamaIndex 数据框架
  - "LlamaIndex Data Framework for LLM Apps"

---
# LlamaIndex

> LLM 应用的数据「连接器」——把任意数据源变成大模型可理解、可检索的知识。

## 核心能力

| 能力 | 说明 |
|------|------|
| **数据加载器** | 支持 PDF、Markdown、数据库、API、云存储等 160+ 数据源 |
| **索引策略** | Vector、Summary、Tree、Keyword、Knowledge Graph |
| **检索器** | 向量检索、混合检索、路由检索、重排序 |
| **Query Engine** | 检索 + LLM 生成的一体化查询接口 |
| **Agent** | 支持工具调用和多步推理 |
| **Workflow** | 声明式事件驱动工作流 |
| **评估** | 内置 RAG 评估指标 (Faithfulness, Relevancy) |
| **LlamaCloud** | 托管解析 + 索引服务 (2026 新增) |

## 快速上手

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# 1. 加载文档
documents = SimpleDirectoryReader("./data").load_data()

# 2. 构建索引
index = VectorStoreIndex.from_documents(documents)

# 3. 查询
query_engine = index.as_query_engine(similarity_top_k=5)
response = query_engine.query("总结这份报告的核心观点")
print(response)
```

## 典型场景

| 场景 | 说明 | 关键组件 |
|------|------|----------|
| 企业知识库 RAG | 文档分块、索引、问答 | VectorIndex + QueryEngine |
| 结构化数据查询 | SQL/CSV 转自然语言 | NLSQLTableQueryEngine |
| 多数据源 Agent | 同时查询文档、API、数据库 | AgentRunner + Tools |
| Agentic RAG | 检索与推理循环结合 | Workflow + Retriever |
| 多模态 RAG | 图片/表格/文本混合检索 | MultiModalIndex |

## 与相关技术对比

| 维度 | LlamaIndex | LangChain | Haystack |
|------|-----------|-----------|----------|
| **定位** | 数据 + RAG 专精 | 通用 LLM 编排 | 生产级 NLP/RAG |
| **数据摄取** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **RAG 流程** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Agent** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **评估** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **学习曲线** | 中 | 中-高 | 中 |

## 2026 年生态

| 组件 | 状态 |
|------|------|
| **LlamaIndex Core** | v0.12+, Workflow 成熟 |
| **LlamaCloud** | 托管解析 + 索引，企业级 |
| **LlamaParse** | PDF/表格/图片解析 SaaS |
| **llama-index-integrations** | 160+ 数据源、40+ 向量库 |
| **Agentic RAG** | 多步检索 + 工具调用成熟 |

## 优势与局限

✅ **优势**：
- 数据摄取和索引能力业界领先
- RAG 全流程抽象完整
- 评估工具内置，便于迭代优化
- LlamaCloud 提供企业级托管

⚠️ **局限**：
- 通用 Agent 能力不如 LangChain/AutoGen
- 高级索引策略需要理解较多概念
- 版本迭代快，API 变动频繁

## 延伸阅读

- [[概念/LLM/langchain|LangChain]]
- [[概念/Agent/autogen|AutoGen]]
- [[概念/RAG/rag-systems|RAG 系统]]
- [[RAG系统/RAG_Frameworks/LlamaIndex_Deep_Dive|LlamaIndex 深度解析]]
