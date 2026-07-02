---
title: "LlamaIndex"
category: -concepts
tags: ["llamaindex", "rag", "llm", "framework", "data-framework", "agent", "indexing", "retrieval"]
relationships:
  - target: "_concepts/rag"
    type: extends
  - target: "_concepts/agent-framework"
    type: related_to
  - target: "_concepts/langchain"
    type: related_to
  - target: "_concepts/embedding"
    type: uses
  - target: "_concepts/vector-database"
    type: uses
sources:
  - 14_RAG_Systems/RAG_Frameworks/LlamaIndex_Deep_Dive.md
summary: "LlamaIndex 是面向 LLM 应用的数据框架，专注于数据摄取、索引、检索和 RAG。它提供 Document、Index、Query Engine、Agent 等抽象，是构建企业知识库和检索增强生成系统的核心工具。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Llamaindex

---
# LlamaIndex

> LLM 应用的数据「连接器」——把任意数据源变成大模型可理解、可检索的知识。

---

## 1. 一句话定义

**LlamaIndex** 是面向 LLM 应用的开源数据框架，专注于**数据摄取、索引、检索和 RAG**。它提供 Document、Node、Index、Query Engine、Agent、Workflow 等抽象，帮助企业把分散的文档、数据库、API 数据转化为大模型可用的知识库。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **数据加载器** | 支持 PDF、Markdown、数据库、API、云存储等 100+ 数据源 |
| **索引策略** | Vector、Summary、Tree、Keyword、Knowledge Graph 等 |
| **检索器** | 向量检索、混合检索、路由检索、重排序 |
| **Query Engine** | 检索 + LLM 生成的一体化查询接口 |
| **Agent** | 支持工具调用和多步推理 |
| **Workflow** | 声明式事件驱动工作流 |
| **评估** | 内置 RAG 评估指标 |

---

## 3. 典型场景

1. **企业知识库 RAG**：文档分块、索引、问答。
2. **结构化数据查询**：把 SQL/CSV 转成自然语言查询。
3. **多数据源 Agent**：同时查询文档、API、数据库。
4. **Agentic RAG**：检索与推理循环结合。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **LangChain** | 更通用，LlamaIndex 更聚焦数据和 RAG |
| **AutoGen** | 多 Agent 对话，LlamaIndex 提供 RAG 工具 |
| **向量数据库** | LlamaIndex 可对接 Milvus、Qdrant、Weaviate 等 |
| **Embedding 模型** | 支持 OpenAI、HuggingFace、本地模型 |

---

## 5. 优势与局限

### 优势
- 数据摄取和索引能力业界领先。
- RAG 全流程抽象完整。
- 评估工具内置，便于迭代优化。

### 局限
- 通用 Agent 能力不如 LangChain/AutoGen。
- 高级索引策略需要理解较多概念。

---

## Related

- [[14_RAG_Systems/RAG_Frameworks/LlamaIndex_Deep_Dive]] — LlamaIndex 深度解析
- [[_concepts/rag-patterns]] — RAG
- [[_concepts/vector-database]] — 向量数据库
- [[_concepts/langchain]] — LangChain
- [[_concepts/autogen]] — AutoGen
