---
title: "Phoenix: Arize AI 可观测性平台"
category: "11-mlops-pipeline"
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: "> **一句话理解**: Phoenix 是 Arize AI 的开源可观测性工具——追踪 LLM 应用从 Prompt 到 Response 的完整链路，帮你发现和修复问题。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Phoenix Deep Dive"
  - Phoenix_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Phoenix: Arize AI 可观测性平台

> **一句话理解**: Phoenix 是 Arize AI 的开源可观测性工具——追踪 LLM 应用从 Prompt 到 Response 的完整链路，帮你发现和修复问题。

> 📐 **概念与选型方法论**: LLM 可观测性见 [[MLOps/Observability/LLM_Observability]]，ML 系统 SLO/SLI 见 [[MLOps/Observability/ML_Observability_SLO]]。本文聚焦 Phoenix 工具用法。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [功能详解](#5-功能详解)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Phoenix: LLM 可观测性平台
═══════════════════════════════════════════════════════════════════

定位: 开源的 LLM 应用追踪和监控工具，聚焦 Traces 和 Evals

核心理念:
───────────────────────────────────────────────────────────────────
• 追踪: 端到端的 Prompt-Response 链路
• 评估: 内置 LLM-as-Judge 评估
• 可视化: 直观的问题发现和调试
• 实时: 实时监控生产环境
• 开源: 完全开源，可本地部署
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Trace 追踪** | 完整记录每个请求的链路 |
| **Span 跨度** | 细粒度的操作追踪 |
| **Evals 评估** | 自动质量评估 |
| **Metrics 指标** | 延迟、成本、质量监控 |
| **Dashboard** | 可视化仪表板 |
| **集成** | LangChain、LlamaIndex、AutoGen |

### 1.3 版本对比

| 版本 | 说明 |
|------|------|
| **Phoenix 1.x** | 早期版本，基础追踪 |
| **Phoenix 2.x** | 支持 Spans，新增评估功能 |
| **Phoenix 3.x** | 实时监控，Dashboard 重构 |

---

## 2. 核心概念

### 2.1 Trace 架构

```
Phoenix Trace 架构
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Trace 结构                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Trace (追踪)                                                     │
│  ├── trace_id: 唯一标识                                          │
│  ├── timestamps: 开始/结束时间                                   │
│  └── spans: [Span, Span, Span, ...]                              │
│                                                                   │
│  Span (跨度)                                                      │
│  ├── span_id: 唯一标识                                           │
│  ├── parent_id: 父 Span (用于嵌套)                               │
│  ├── name: 操作名称                                              │
│  ├── start_time, end_time: 时间戳                                 │
│  ├── attributes:  attributes (元数据)                            │
│  └── status: success/error                                        │
│                                                                   │
│  Example:                                                         │
│  Trace: "用户查询"                                               │
│  ├── Span: "Embedding"                                           │
│  ├── Span: "Vector Search"                                       │
│  └── Span: "LLM Generation"                                      │
│       ├── Span: "Prompt Render"                                   │
│       └── Span: "API Call"                                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 关键概念

| 概念 | 说明 | 用途 |
|------|------|------|
| **Trace** | 完整请求链路 | 理解请求生命周期 |
| **Span** | 操作单元 | 定位耗时/错误 |
| **Attributes** | Span 元数据 | 存储关键信息 |
| **Evals** | 质量评估 | 判断输出质量 |
| **Metrics** | 聚合指标 | 监控和告警 |

---

## 3. 架构设计

### 3.1 系统架构

```
Phoenix 系统架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Phoenix 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   应用程序                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  LangChain / LlamaIndex / 自定义代码                     │   │
│   │  │                                                    │   │
│   │  ▼                                                    │   │
│   │  Phoenix SDK (tracing)                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Collector (收集器)                        │   │
│   │  ├── In-process (同进程)                               │   │
│   │  └── OpenTelemetry Collector                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Phoenix Server                             │   │
│   │  ├── Ingestion API (接收 Trace)                        │   │
│   │  ├── Storage (SQLite/PG)                               │   │
│   │  └── Query Engine (查询)                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Web UI (仪表板)                            │   │
│   │  ├── Traces View (追踪视图)                            │   │
│   │  ├── Evals Dashboard (评估仪表板)                       │   │
│   │  └── Metrics (指标监控)                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 安装 Phoenix
pip install arize-phoenix

# 或仅安装 Tracing
pip install openinference-instrumentation-langchain
pip install openinference-instrumentation-llama-index
```

### 4.2 基础 Tracing

```python
from phoenix.trace.tracer import Tracer
from phoenix.trace.schema import Span

# 创建 Tracer
tracer = Tracer()

# 追踪 LLM 调用
with tracer.trace("llm_call") as span:
    span.set_attribute("model", "gpt-4o")
    span.set_attribute("temperature", 0.7)

    response = llm.generate(prompt)

    span.set_attribute("tokens", response.usage.total_tokens)
    span.set_attribute("latency_ms", response.latency)
```

### 4.3 LangChain 集成

```python
from langchain.chat_models import ChatOpenAI
from phoenix.trace import langchain

# 创建 LLM
llm = ChatOpenAI(model="gpt-4o")

# 自动追踪
traced_llm = langchain.TracedChatOpenAI(llm)

# 使用
response = traced_llm.invoke("解释量子计算")
# 自动记录到 Phoenix
```

### 4.4 LlamaIndex 集成

```python
from llama_index import VectorStoreIndex
from phoenix.trace import llama_index as pg

# 自动追踪
index = pg.TracedVectorStoreIndex.from_documents(
    documents,
    tracer=pg.Tracer(),
)

# 查询时自动记录
response = index.as_query_engine().query("什么是量子计算")
```

### 4.5 启动 UI

```bash
# 启动 Phoenix
python -m phoenix

# 访问 http://localhost:6006
```

---

## 5. 功能详解

### 5.1 Trace 调试

```
Phoenix Trace 视图
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│ Trace: query-12345                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📍 RAG Query                                                    │
│  ├─ 📍 Embed Text (12ms)                                          │
│  │   └── model: text-embedding-3-small                           │
│  ├─ 📍 Vector Search (45ms)                                      │
│  │   └── top_k: 5, score_avg: 0.87                               │
│  └─ 📍 LLM Generation (1.2s)                                     │
│      ├─ 📍 Prompt Render (2ms)                                  │
│      └─ 📍 API Call (1.2s)                                       │
│          └── model: gpt-4o, tokens: 2048                        │
│                                                                   │
│  Output: "量子计算是一种基于量子力学原理的计算方式..."          │
│  Latency: 1.3s                                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 自动 Evals

```python
from phoenix.trace.evals import evaluate

# 评估 Trace
results = evaluate(
    traces=trace_dataset,
    evaluators=[
        "relevance",      # 答案相关性
        "groundedness",   # 基于上下文
        "coherence",      # 连贯性
    ]
)
```

### 5.3 Metrics Dashboard

```
Phoenix Metrics
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Metrics Dashboard                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Latency (P50/P95/P99)                                          │
│  ───────────────────────                                          │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░  1.2s / 2.8s / 5s   │
│                                                                   │
│  Cost per 1K tokens                                              │
│  ───────────────────────                                          │
│  ████████████████████████████░░░░░░░░░░░░░░░░░░░  $2.5 / $5    │
│                                                                   │
│  Error Rate                                                       │
│  ───────────────────────                                          │
│  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0.5%       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. 对比与选择

### 6.1 与其他方案对比

| 维度 | Phoenix | LangSmith | Weights & Biases |
|------|---------|-----------|------------------|
| **开源** | ✅ | ❌ | 部分 |
| **自托管** | ✅ | ❌ | ✅ |
| **Trace** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Evals** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **成本** | 免费 | 付费 | 付费 |

### 6.2 适用场景

**✅ Phoenix 最佳场景:**
- 开源可观测性
- 本地/私有部署
- LangChain/LlamaIndex 集成
- 问题调试和追踪

**❌ 不适合场景:**
- 需要完整生产监控
- 团队协作和共享
- 复杂告警规则

---

## 参考资源

- [Phoenix GitHub](https://github.com/Arize-ai/phoenix)
- [Phoenix 文档](https://docs.arize.com/phoenix/)
- [OpenInference](https://github.com/Arize-ai/openinference)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[运维/AIOps-in-nutshell.md|AIOps-in-nutshell]]
- [[运维/SRE_Reliability/AI_Incident_Response_Playbook|AI_Incident_Response_Playbook]]
- [[运维/AI_Ops_for_dummy.md|AI_Ops_for_dummy]]
- [[运维/README.md|AI运维 README]]
- [[运维/README_for_dummy.md|README_for_dummy]]
