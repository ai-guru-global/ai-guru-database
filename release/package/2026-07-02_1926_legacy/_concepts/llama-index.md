---
title: "LlamaIndex 数据框架 (LlamaIndex Data Framework for LLM Apps)"
category: -concepts
tags: ["llama-index", "data-framework", "rag", "indexing", "query-engine"]
relationships:
  - target: "_concepts/rag-systems"
    type: related_to
  - target: "_concepts/agentic-rag"
    type: related_to
  - target: "_concepts/embedding-models"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "LlamaIndex（原 GPT Index）是面向 LLM 应用的数据框架，提供数据连接器/索引/查询引擎/Agent 等模块。与 LangChain 并列为最流行的两大 LLM 应用框架。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: supporting
---

# LlamaIndex 数据框架

> **一句话理解**: LlamaIndex 是"LLM 的数据管家"——专注于将私有数据连接到 LLM，提供从数据导入到智能查询的完整链路。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **项目** | LlamaIndex（原 GPT Index） |
| **来源** | LlamaIndex Inc. |
| **功能** | LLM 数据框架 |
| **语言** | Python / TypeScript |
| **开源** | MIT License |
| **GitHub** | github.com/run-llama/llama_index |

---

## 2. 核心模块

| 模块 | 功能 |
|------|------|
| **Data Connectors** | 连接 160+ 数据源（PDF/API/DB/SaaS） |
| **Index** | 构建数据索引（向量/树/关键词/知识图谱） |
| **Query Engine** | 智能查询引擎（路由/递归/子问题） |
| **Chat Engine** | 对话式数据交互 |
| **Agent** | 工具调用 + 推理循环 |
| **Observability** | 追踪/评估/调试 |

---

## 3. LlamaIndex vs LangChain

| 维度 | LlamaIndex | LangChain |
|------|-----------|----------|
| **核心定位** | 数据索引与查询 | 通用 LLM 编排 |
| **RAG** | ⭐⭐⭐⭐⭐ 专精 | ⭐⭐⭐⭐ 通用 |
| **Agent** | ✅ | ✅ 更强 |
| **数据连接** | 160+ 连接器 | 广泛集成 |
| **学习曲线** | 较低 | 较高 |
| **生态规模** | 中 | 大 |
| **适用场景** | 数据驱动的 RAG | 通用 LLM 应用 |

---

## 4. 快速使用

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# 加载文档
documents = SimpleDirectoryReader("data").load_data()

# 构建索引
index = VectorStoreIndex.from_documents(documents)

# 查询
query_engine = index.as_query_engine()
response = query_engine.query("这份报告的结论是什么？")
print(response)
```

---

## 5. 在 AI Stack 生态中的位置

| 框架 | 定位 | AI Stack 适用场景 |
|------|------|-----------------|
| **LlamaIndex** | 数据 RAG 专精 ← 本文 | 企业知识库问答 |
| **LangChain** | 通用 LLM 编排 | Agent/Tool 应用 |
| **Haystack** | 搜索 + NLP 管道 | 搜索引擎集成 |
| **AI Stack 知识库** | 内置 RAG | 开箱即用 |

---

## Related

- [[_concepts/rag-systems]] — RAG 系统
- [[_concepts/agentic-rag]] — Agentic RAG
- [[_concepts/embedding-models]] — 嵌入模型
- [[11_RAG_Systems/LlamaIndex_Deep_Dive]] — LlamaIndex 深度解析
