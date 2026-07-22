---
title: "Haystack RAG 框架 (Haystack by deepset)"
category: -concepts
tags: ["haystack", "rag", "deepset", "pipeline", "nlp-framework"]
relationships:
  - target: "概念/rag-systems"
    type: related_to
  - target: "概念/llama-index"
    type: related_to
  - target: "概念/dify"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Haystack 是 deepset 开源的端到端 NLP/LLM 框架，以 Pipeline 架构为核心——支持 RAG、搜索、问答等多种 NLP 任务。模块化设计优秀，是企业级 RAG 系统的重要选择。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: supporting
---

# Haystack RAG 框架

> **一句话理解**: Haystack 是"RAG 的 Pipeline 工厂"——用组件化的管道架构搭建搜索/问答/RAG 系统，模块化程度业界最高。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发商** | deepset（德国 NLP 公司） |
| **语言** | Python |
| **开源协议** | Apache 2.0 |
| **GitHub** | 17K+ ⭐ |
| **核心架构** | Pipeline（管道 + 组件） |
| **定位** | 端到端 NLP/LLM 应用框架 |

### Haystack 2.x vs 1.x

| 特性 | 1.x | 2.x (当前) |
|------|-----|-----------|
| 架构 | DocumentStore + Retriever + Reader | Pipeline + Component |
| 灵活性 | 较固定 | 高度模块化 |
| LLM 支持 | 有限 | 原生支持 |
| 流式输出 | 不支持 | 支持 |
| 类型系统 | 松散 | 严格类型检查 |

---

## 2. Pipeline 架构

```
┌─────────────────────────────────────────┐
│       Haystack 2.x Pipeline 架构        │
├─────────────────────────────────────────┤
│                                         │
│  Component（组件）                       │
│    ├── @component 装饰器                │
│    ├── run() 方法                       │
│    ├── Input/Output Socket              │
│    └── 类型验证                         │
│                                         │
│  Pipeline（管道）                        │
│    ├── add_component()                  │
│    ├── connect()                        │
│    ├── run()                            │
│    └── 自动类型检查 + 拓扑验证          │
│                                         │
│  数据流:                                │
│  Input → Component A → Component B      │
│              ↓                          │
│         Component C → Output            │
│                                         │
└─────────────────────────────────────────┘
```

### 组件类型

| 组件类别 | 代表组件 | 功能 |
|---------|---------|------|
| **文档处理** | TextCleaner, DocumentSplitter | 清洗、切分文档 |
| **检索** | InMemoryBM25Retriever | 关键词检索 |
| **嵌入** | SentenceTransformersDocumentEmbedder | 向量化 |
| **生成** | OpenAIGenerator, HuggingFaceGenerator | LLM 生成 |
| **RAG** | PromptBuilder + Generator | 检索增强生成 |
| **评估** | DocumentMAPEvaluator | 检索质量评估 |

---

## 3. RAG 示例

```python
from haystack import Pipeline
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator
from haystack.dataclasses import Document
from haystack.document_stores.in_memory import InMemoryDocumentStore

# 1. 初始化文档存储
store = InMemoryDocumentStore()
store.write_documents([
    Document(content="vLLM 是高性能 LLM 推理引擎"),
    Document(content="DeepSeek-V3 使用 MoE 架构"),
])

# 2. 构建 RAG Pipeline
pipe = Pipeline()
pipe.add_component("retriever", InMemoryBM25Retriever(document_store=store))
pipe.add_component("prompt_builder", PromptBuilder(
    template="根据以下上下文回答问题。\n上下文: {{ documents }}\n问题: {{ question }}"
))
pipe.add_component("llm", OpenAIGenerator(model="gpt-4"))

# 3. 连接组件
pipe.connect("retriever", "prompt_builder")
pipe.connect("prompt_builder", "llm")

# 4. 运行
result = pipe.run({
    "retriever": {"query": "vLLM 是什么？"},
    "prompt_builder": {"question": "vLLM 是什么？"}
})
```

---

## 4. 与其他框架对比

| 特性 | Haystack | LlamaIndex | LangChain |
|------|----------|-----------|-----------|
| **核心架构** | Pipeline 组件化 | 索引/查询引擎 | Chain/Agent |
| **设计哲学** | 显式管道、类型安全 | 数据连接优先 | 最大灵活性 |
| **学习曲线** | 中等 | 较低 | 较高 |
| **模块化** | ★★★★★ | ★★★★☆ | ★★★☆☆ |
| **企业适配** | 强（deepset 支持） | 强 | 强 |
| **调试友好** | Pipeline 可视化 | 一般 | LangSmith |

---

## 5. 集成生态

| 集成 | 说明 |
|------|------|
| **向量数据库** | Chroma, Milvus, Qdrant, Weaviate, Pinecone |
| **LLM 提供商** | OpenAI, Anthropic, Cohere, HuggingFace |
| **搜索引擎** | Elasticsearch, OpenSearch |
| **云服务** | Azure, AWS Bedrock |

---

## 6. 关键要点

1. **Pipeline 是核心**：一切操作都是组件通过管道连接，架构清晰可控
2. **类型安全**：组件间的连接在构建时做类型检查，减少运行时错误
3. **Haystack 2.x 是重写**：架构更现代，组件更独立，推荐新项目使用 2.x
4. **企业级 RAG**：内置评估、监控、缓存等生产特性
5. **deepset 生态**：配合 deepset Cloud 可实现托管部署

---

## Related

- [[概念/rag-patterns|RAG 模式分类]] — RAG 架构选型
- [[概念/rag-production-architecture|RAG 生产架构]] — 从原型到企业级服务的工程体系

## 2026 Haystack 生态现状

| 特性 | 状态 | 说明 |
|------|------|------|
| Pipeline 2.0 | ✅ | 组件化架构 |
| 多模型支持 | ✅ | OpenAI/本地/多厂商 |
| 向量数据库集成 | ✅ | 20+ 数据库 |
| 评估工具 | ✅ | 内置评估管道 |
| 生产部署 | ✅ | REST API 导出 |
| Agent 能力 | 🟡 | 实验性支持 |

## 检查清单

- [ ] Pipeline 组件已正确连接
- [ ] Retriever 参数已调优（top_k/filters）
- [ ] Embedding 模型已固定版本
- [ ] 评估管道已配置
- [ ] API 端点已配置认证
- [ ] 监控和日志已启用

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 检索效果差 | Retriever 参数不当 | 调优 top_k 和 filters |
| Pipeline 报错 | 组件接口不匹配 | 检查输入输出类型 |
| 性能低 | 串行执行 | 使用并行分支 |
| 部署失败 | 依赖缺失 | 检查环境和依赖 |

## 延伸阅读

- [[概念/RAG/rag-patterns|RAG Patterns]] — RAG 模式分类
- [[概念/RAG/rag-production-architecture|RAG 生产架构]] — 生产架构
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库
- [[概念/RAG/embedding-models|Embedding Models]] — 嵌入模型
- [[概念/RAG/reranker|Reranker]] — 重排序

> ℹ️ Haystack 是 deepset 开源的端到端 RAG 框架，2026年以 Pipeline 2.0 组件化架构和强评估能力著称，适合需要严格评估的生产场景。
