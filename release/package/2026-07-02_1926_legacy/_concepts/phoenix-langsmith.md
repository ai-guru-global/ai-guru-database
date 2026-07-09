---
title: "Phoenix (Arize 开源 LLM 可观测性平台)"
category: -concepts
tags: ["observability", "llm", "tracing", "arize", "open-source", "evaluation"]
relationships:
  - target: "_concepts/langsmith"
    type: related_to
  - target: "_concepts/langfuse"
    type: related_to
  - target: "_concepts/opik"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Arize AI 开源的 LLM 可观测性与评估平台，提供 Tracing、评估、嵌入可视化和 Retrieval 分析，支持 OpenTelemetry 标准和自托管。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: supporting
---

# Phoenix (Arize Phoenix)

[Phoenix](https://github.com/Arize-ai/phoenix) 是 [Arize AI](https://arize.com/) 开源的 **LLM 可观测性与评估平台**。它提供 LLM Tracing（链路追踪）、Retrieval 分析、嵌入可视化和自动化评估能力。Phoenix 的核心差异化在于**深度嵌入分析**和 **OpenTelemetry 原生支持**，能可视化向量空间的聚类、漂移和异常，帮助开发者深入理解 RAG 和 Embedding 的行为。

## 核心架构

```
Phoenix 架构:

LLM 应用
    │
    ▼ (OpenTelemetry / SDK)
┌─────────────────────────┐
│     Phoenix Server       │
│  ┌───────────────────┐  │
│  │ Trace Collector    │  │  OTEL 兼容
│  ├───────────────────┤  │
│  │ Trace Viewer       │  │  链路追踪可视化
│  ├───────────────────┤  │
│  │ Embedding Analysis │  │  向量空间可视化
│  │  - Clustering       │  │
│  │  - Drift Detection  │  │
│  │  - UMAP/t-SNE       │  │
│  ├───────────────────┤  │
│  │ Evaluation         │  │  LLM-as-Judge
│  ├───────────────────┤  │
│  │ Retrieval Analysis │  │  RAG 检索分析
│  └───────────────────┘  │
└─────────────────────────┘
```

## 核心特性

### 1. LLM Tracing

```python
import phoenix as px

# 启动 Phoenix 会话（本地 Jupyter/Notebook）
session = px.launch_app()

# 自动追踪 LangChain
from phoenix.otel import register
tracer_provider = register(project_name="my-app")

# 所有 LangChain/LlamaIndex 调用自动被追踪
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4")
llm.invoke("Hello")
# → Phoenix UI 中可查看完整 trace
```

### 2. OpenTelemetry 原生支持

```python
from openinference.instrumentation.openai import OpenAIInstrumentor
from phoenix.otel import register

# OTEL 标准追踪
tracer_provider = register(project_name="my-project")
OpenAIInstrumentor().instrument(tracer_provider=tracer_provider)

# 与 Langfuse/LangSmith 等共享 OTEL 标准
# 可导出到 Jaeger/Zipkin 等通用追踪系统
```

### 3. 嵌入可视化分析

```python
import phoenix as px
import numpy as np

# 可视化 Embedding 空间
embeddings = np.random.randn(1000, 768)  # 示例向量

# UMAP 降维可视化
session = px.launch_app(
    primary=px.Dataset(
        dataframe=df,
        embeddings={"text_embedding": embeddings},
        schema=px.Schema(
            embedding_feature_columns={"text_embedding": "embedding"}
        )
    )
)
# 在 UI 中可视化:
# - 向量空间聚类
# - 异常点检测
# - 时间漂移分析
# - 相似性搜索
```

### 4. RAG 检索分析

```python
# 分析 RAG Pipeline 的检索质量
session = px.launch_app(
    primary=px.Dataset(
        dataframe=rag_traces,
        schema=px.Schema(
            retrieval_document_columns={
                "document_score": "retrieval_scores",
                "document_text": "retrieved_texts"
            }
        )
    )
)
# 可视化:
# - 检索文档的相关性分布
# - 检索分数 vs 答案质量的相关性
# - 低质量检索的诊断
```

### 5. 自动评估

```python
import phoenix.evals as px_evals

# LLM-as-Judge 评估
evaluator = px_evals.LLMEvaluator(
    template=px_evals.RAG_RELEVANCY_TEMPLATE,
    model=px_evals.OpenAIModel(model="gpt-4")
)

results = evaluator.evaluate(
    dataframe=traces_df,
    columns=["input", "output", "retrieved_context"]
)
# 输出: 每条 trace 的相关性评分
```

## 与 LangSmith / Langfuse / Opik 对比

| 维度 | Phoenix | LangSmith | Langfuse | Opik |
|------|---------|-----------|----------|------|
| **开源** | ✅ (Elastic) | ❌ | ✅ (MIT) | ✅ |
| **OTEL 标准** | ✅ (原生) | ❌ (私有) | ✅ | 部分 |
| **嵌入分析** | ✅ (核心优势) | ❌ | ❌ | ❌ |
| **向量可视化** | ✅ (UMAP/t-SNE) | ❌ | ❌ | ❌ |
| **Tracing** | ✅ | ✅ | ✅ | ✅ |
| **评估** | ✅ | ✅ | ✅ | ✅ |
| **Notebook 集成** | ✅ (Jupyter) | ❌ | 部分 | ❌ |
| **Arize 生态** | ✅ | ❌ | ❌ | ❌ |

## 典型应用场景

- **RAG 调试**: 可视化检索向量空间，诊断检索质量问题
- **Embedding 质量**: 监控嵌入漂移和聚类变化
- **开发调试**: Jupyter 中实时追踪 LLM 调用
- **生产监控**: 持续追踪和评估 LLM 应用
- **数据科学**: 深入分析 Embedding 空间结构

## 安装与启动

```bash
# 安装
pip install arize-phoenix

# 启动 (本地)
phoenix serve

# Jupyter 中使用
import phoenix as px
session = px.launch_app()

# Docker
docker run -p 6006:6006 arizephoenix/phoenix:latest
```

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: phoenix
spec:
  template:
    spec:
      containers:
      - name: phoenix
        image: arizephoenix/phoenix:latest
        ports:
        - containerPort: 6006
        env:
        - name: PHOENIX_PORT
          value: "6006"
        - name: PHOENIX_SQL_DATABASE_URL
          value: "postgresql://user:pass@postgres-svc:5432/phoenix"
---
apiVersion: v1
kind: Service
metadata:
  name: phoenix-svc
spec:
  selector:
    app: phoenix
  ports:
  - port: 6006
```

## 参考资源

- [Phoenix GitHub](https://github.com/Arize-ai/phoenix)
- [Phoenix 文档](https://docs.arize.com/phoenix)
- [Arize AI](https://arize.com/)
- [OpenInference](https://github.com/Arize-ai/openinference)

## 相关概念

- [[_concepts/langsmith]] — LangSmith LLM 可观测性
- [[_concepts/langfuse]] — Langfuse 开源 LLM 可观测性
- [[_concepts/opik]] — Opik LLM 可观测性平台
- [[_concepts/helicone]] — Helicone LLM API 监控
