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
  - 14_RAG系统/06_RAG框架/LlamaIndex_Deep_Dive.md
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

name_zh: "LlamaIndex 数据框架"
---
# LlamaIndex

> 中文简称：LlamaIndex 数据框架

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

## 生产最佳实践

1. **索引策略选择**: 简单文档用 VectorStoreIndex，复杂结构用 TreeIndex/KnowledgeGraphIndex
2. **Chunk 策略**: 根据文档类型调整 chunk_size（默认 1024，代码用 512）
3. **评估先行**: 用内置 RagEvaluator 建立基线，再迭代优化
4. **缓存启用**: 生产环境启用 response_cache 降低重复查询成本
5. **多模态摄取**: 用 LlamaParse 处理 PDF/表格/图片
6. **监控检索质量**: 跟踪 hit_rate、MRR、响应时间

## LlamaIndex vs LangChain

| 维度 | LlamaIndex | LangChain |
|------|-----------|----------|
| **核心定位** | 数据索引与检索 | 通用 LLM 应用框架 |
| **RAG 能力** | 深度优化，多种索引策略 | 基础 RAG，更灵活 |
| **Agent 能力** | 中等（Agentic RAG） | 强（LangGraph） |
| **数据摄取** | 160+ 连接器 | 较少 |
| **学习曲线** | 中等 | 较陡 |
| **适用场景** | 知识库/文档问答 | 复杂工作流/Agent |

## 延伸阅读

- [[概念/LLM/langchain|LangChain]]
- [[概念/Agent/autogen|AutoGen]]
- [[概念/RAG/rag-systems|RAG 系统]]
- [[14_RAG系统/06_RAG框架/06_LlamaIndex_深入分析|LlamaIndex 深度解析]]

## 核心代码示例

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding

# 配置
Settings.llm = OpenAI(model="gpt-4o", temperature=0)
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

# 加载文档并构建索引
documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)

# 查询
query_engine = index.as_query_engine(similarity_top_k=5)
response = query_engine.query("总结文档的核心观点")
print(response)
```

## 索引类型对比

| 索引类型 | 适用场景 | 查询方式 | 性能 |
|---------|---------|---------|:----:|
| **VectorStoreIndex** | 语义搜索 | 向量相似度 | 快 |
| **SummaryIndex** | 全文遍历 | 顺序扫描 | 慢 |
| **TreeIndex** | 层次摘要 | 树遍历 | 中 |
| **KeywordTableIndex** | 关键词匹配 | 关键词查找 | 快 |
| **KnowledgeGraphIndex** | 关系推理 | 图遍历 | 中 |

## 2026 生态现状

| 组件 | 状态 | 说明 |
|------|:----:|------|
| **LlamaIndex Core** | GA | v0.11+，模块化架构 |
| **LlamaParse** | GA | PDF/表格/图片解析 |
| **LlamaCloud** | GA | 托管 RAG 服务 |
| **LlamaIndex.TS** | GA | TypeScript 版本 |
| **Agentic RAG** | GA | Agent + RAG 融合 |
| **160+ 连接器** | GA | 数据源集成 |

## 生产最佳实践补充

1. **分块策略**: 根据文档类型选择分块大小，通常 512-1024 token
2. **混合检索**: 向量 + 关键词混合检索，提高召回率
3. **重排序**: 检索后用 Cross-Encoder 重排序，提高精度
4. **多模态摄取**: 用 LlamaParse 处理 PDF/表格/图片
5. **监控检索质量**: 跟踪 hit_rate、MRR、响应时间
6. **缓存策略**: 启用响应缓存，减少重复查询成本
7. **评估闭环**: 定期用 Ragas 评估 RAG 质量

## 适用场景决策

| 场景 | 推荐方案 | 说明 |
|------|---------|------|
| 文档问答 | LlamaIndex | 核心优势，索引策略丰富 |
| 复杂 Agent | LangChain/LangGraph | Agent 编排更强 |
| 快速原型 | LlamaIndex | 上手快，API 简洁 |
| 生产 RAG | LlamaIndex + LlamaCloud | 托管服务，运维简单 |
| 多数据源 | LlamaIndex | 160+ 连接器 |
