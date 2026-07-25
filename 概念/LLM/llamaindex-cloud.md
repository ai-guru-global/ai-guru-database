---
title: "LlamaIndex Cloud (LlamaIndex 云端 RAG 平台)"
category: -concepts
tags: ["llamaindex", "rag", "cloud", "managed-service", "indexing", "saas"]
relationships:
  - target: "概念/llamaindex"
    type: related_to
  - target: "概念/langsmith"
    type: related_to
  - target: "概念/chroma"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "LlamaIndex 官方的云端 RAG 平台，提供托管式文档索引、检索增强和评测服务，免去自建向量数据库和索引 Pipeline 的运维负担。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.78
lifecycle: reviewed
tier: supporting
created: 2026-06-12
updated: 2026-07-21
---

# LlamaIndex Cloud

[LlamaIndex Cloud](https://cloud.llamaindex.ai/)（前身为 LlamaParse/LlamaHub Cloud）是 LlamaIndex 官方推出的**云端 RAG 平台**，提供托管式文档解析、索引构建、检索服务和评估工具。它将 LlamaIndex 开源框架的核心能力封装为**SaaS 服务**，让开发者无需自建向量数据库和索引 Pipeline 即可构建生产级 RAG 应用。

## 核心组件

```
LlamaIndex Cloud 架构:

┌───────────────────────────────────┐
│       LlamaIndex Cloud             │
│                                    │
│  ┌─────────────────────────────┐  │
│  │  LlamaParse (文档解析)       │  │
│  │  PDF/DOCX/HTML → 结构化文本  │  │
│  ├─────────────────────────────┤  │
│  │  Index Pipeline (索引构建)   │  │
│  │  Chunking → Embedding →     │  │
│  │  Vector Store               │  │
│  ├─────────────────────────────┤  │
│  │  Retrieval API (检索服务)    │  │
│  │  语义搜索 + 重排 + 融合      │  │
│  ├─────────────────────────────┤  │
│  │  Evaluation (评估)           │  │
│  │  RAG 质量评测               │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
```

## 核心特性

### 1. LlamaParse (文档解析)

```python
from llama_parse import LlamaParse

# 高级文档解析（多模态）
parser = LlamaParse(
    api_key="llx-...",
    result_type="markdown",
    parsing_instruction="Extract tables and format as markdown"
)

# 解析 PDF（含表格、图片、公式）
documents = parser.load_data("research_paper.pdf")
# LlamaParse 使用多模态 LLM 进行文档理解
# 比传统 OCR + PDF 解析器质量高得多
```

### 2. 托管索引

```python
from llama_index.core import SimpleDirectoryReader
from llama_index.cloud import LlamaCloudIndex

# 上传文档并构建索引
index = LlamaCloudIndex.from_documents(
    documents=SimpleDirectoryReader("./docs").load_data(),
    name="my-project-index",
    project_name="my-project",
    api_key="llx-..."
)

# 检索
query_engine = index.as_query_engine()
response = query_engine.query("What is the main conclusion?")
```

### 3. API 检索

```python
# REST API 访问索引
import requests

response = requests.post(
    "https://api.cloud.llamaindex.ai/api/pipelines/retrieve",
    headers={"Authorization": "Bearer llx-..."},
    json={
        "pipeline_id": "xxx",
        "query": "What is RAG?",
        "top_k": 5
    }
)

results = response.json()["retrieval_nodes"]
```

### 4. 评估工具

```python
# 评估 RAG 质量
from llama_index.cloud import LlamaCloudEval

eval = LlamaCloudEval(
    index=index,
    eval_questions=["What is X?", "How does Y work?"],
    metrics=["faithfulness", "relevancy", "context_precision"]
)

results = eval.run()
print(results.summary)
```

## 与自建 RAG 对比

| 维度 | LlamaIndex Cloud | 自建 RAG |
|------|-----------------|----------|
| **运维** | 零运维 | 需管理向量DB+Pipeline |
| **文档解析** | LlamaParse (多模态) | 需选择解析器 |
| **索引构建** | 自动 | 手动配置 |
| **扩展性** | 自动扩缩 | 手动规划 |
| **成本** | 按量付费 | 基础设施成本 |
| **定制性** | 有限 | 完全可控 |
| **数据驻留** | LlamaIndex 云 | 自选 |

## 典型应用场景

- **快速 MVP**: 无需自建基础设施即可验证 RAG 效果
- **企业知识库**: 托管式文档管理和检索
- **法律/医疗**: 复杂文档（合同、病历）的高质量解析
- **中小团队**: 无运维负担的 RAG 解决方案

## 安装

```bash
pip install llama-index-cloud llama-parse
```

## 参考资源

- [LlamaIndex Cloud](https://cloud.llamaindex.ai/)
- [LlamaParse 文档](https://docs.llamaindex.ai/en/stable/llama_parse/)
- [LlamaIndex Cloud API](https://docs.cloud.llamaindex.ai/)

## 相关概念

- [[概念/llamaindex]] — LlamaIndex RAG 框架
- [[概念/chroma]] — Chroma 向量数据库
- [[概念/milvus]] — Milvus 向量数据库
- [[概念/langsmith]] — LangSmith LLM 可观测性

---

## 2026 LlamaIndex Cloud 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **LlamaParse** | 高级文档解析，支持表格/图像 | GA |
| **LlamaHub** | 数据连接器市场，160+ 数据源 | GA |
| **托管索引** | 云端向量索引，免运维 | GA |
| **评估工具** | RAG 质量评估，检索/生成指标 | GA |
| **API 服务** | REST API 访问，轻松集成 | GA |

## 生产最佳实践

1. **快速原型**：用 LlamaIndex Cloud 快速验证 RAG 想法
2. **文档解析**：复杂文档用 LlamaParse，比开源解析器效果好
3. **成本意识**：云端服务有成本，大规模场景考虑自建
4. **数据安全**：敏感数据评估云端存储风险
5. **与开源对比**：生产前对比云端与自建的效果和成本

## LlamaIndex Cloud 产品矩阵 (2026)

| 产品 | 功能 | 定价 | 适用场景 |
|------|------|------|----------|
| **LlamaCloud** | 托管 RAG 服务 | 按用量 | 快速原型 |
| **LlamaParse** | 复杂文档解析 | 按页数 | PDF/表格解析 |
| **LlamaIndex TS** | TypeScript SDK | 开源 | 前端/Node.js |
| **LlamaHub** | 数据连接器市场 | 免费 | 数据源接入 |
| **LlamaIndex Core** | 开源框架 | 免费 | 自建 RAG |

## LlamaCloud vs 自建 RAG

| 维度 | LlamaCloud | 自建 RAG |
|------|-----------|----------|
| **上手速度** | 极快 (分钟级) | 慢 (天级) |
| **文档解析** | LlamaParse 极强 | 需自己处理 |
| **可控性** | 低 | 高 |
| **成本** | 按用量付费 | 固定成本 |
| **数据安全** | 云端存储 | 完全自控 |
| **适用场景** | 原型/小规模 | 生产/大规模 |

## 延伸阅读

- [[概念/LLM/llamaindex|LlamaIndex]] — 开源框架详解
- [[概念/RAG/rag-architecture|RAG 架构]] — RAG 系统全景
- [[概念/LLM/cross-encoder|Cross-Encoder]] — 重排序技术
- [[概念/LLM/context-engineering|上下文工程]] — 上下文管理
