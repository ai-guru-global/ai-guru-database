---
title: "LangSmith: LLM 应用调试与监控"
category: "11-mlops-pipeline"
tags: ["ai-ops", "observability", "monitoring", "incident-response", "llm"]
summary: "> **一句话理解**: LangSmith 是 LangChain 的 LLM 应用调试平台——请求追踪、日志分析、评估测试、质量监控，LLM 应用的开发者工具。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Langsmith Deep Dive"
  - "LangSmith Deep Dive"
  - LangSmith_Deep_Dive

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LangSmith: LLM 应用调试与监控

> **一句话理解**: LangSmith 是 LangChain 的 LLM 应用调试平台——请求追踪、日志分析、评估测试、质量监控，LLM 应用的开发者工具。

> 📐 **概念与选型方法论**: LLM 评估方法论见 [[MLOps/Evaluation/LLM_Evaluation_Pipeline]]，LLM 可观测性见 [[MLOps/Observability/LLM_Observability]]。本文聚焦 LangSmith 工具用法。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LangSmith: LLM 应用调试与监控
═══════════════════════════════════════════════════════════════════

定位: LangChain 出品的 LLM 应用调试和监控平台，覆盖开发到生产全流程

核心理念:
───────────────────────────────────────────────────────────────────
• 调试优先: 快速定位 LLM 输出问题
• 评估驱动: 数据驱动的质量评估
• 追踪全链路: 从 prompt 到响应完整可见
• 团队协作: 共享日志和评估结果
• 生产监控: 实时质量追踪
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **请求追踪** | 完整 LLM 调用链路 |
| **日志记录** | 输入/输出/元数据 |
| **评估套件** | 自定义评估指标 |
| **质量监控** | 生产环境质量追踪 |
| **数据集管理** | 测试用例管理 |
| **A/B 测试** | prompt 对比实验 |

### 1.3 支持框架

| 框架 | 支持 |
|------|------|
| LangChain | ⭐⭐⭐⭐⭐ 原生 |
| LangGraph | ⭐⭐⭐⭐⭐ 原生 |
| LlamaIndex | ⭐⭐⭐⭐ 支持 |
| 自定义 | ⭐⭐⭐ API 接入 |

---

## 2. 核心概念

### 2.1 追踪结构

```
LangSmith Trace
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        LangSmith Trace                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Run:                                                             │
│  ├── id: "run_xxxx"                                             │
│  ├── name: "LCEL Chain"                                         │
│  ├── inputs: {"question": "..."}                               │
│  ├── outputs: {"answer": "..."}                                 │
│  ├── runs: [SubRun1, SubRun2]  # 嵌套调用                       │
│  │     ├── LLM Run                                              │
│  │     ├── Tool Run                                             │
│  │     └── Retriever Run                                        │
│  ├── metadata: {                                                │
│  │     "tokens": 500,                                          │
│  │     "latency": 1.2,                                        │
│  │     "cost": 0.01                                           │
│  │   }                                                          │
│  └── tags: ["production", "v2"]                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 评估类型

| 类型 | 说明 |
|------|------|
| **人工评估** | 人工打分 |
| **自动化评估** | LLM-as-Judge |
| **回归测试** | 与基准对比 |
| **统计检测** | 自动异常检测 |

---

## 3. 架构设计

### 3.1 系统架构

```
LangSmith 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        LangSmith 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              SDK / LangChain Integration                   │   │
│   │  • 自动追踪                                              │   │
│   │  • 手動標記                                              │   │
│   │  • 評估鉤子                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              LangSmith Platform                             │   │
│   │  • Trace Storage                                         │   │
│   │  • Evaluation Engine                                     │   │
│   │  • Analytics                                            │   │
│   │  • Dataset Management                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Web Dashboard                                 │   │
│   │  • Trace Viewer                                         │   │
│   │  • Evaluation Results                                   │   │
│   │  • Production Monitoring                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 追踪流程

```
LangChain + LangSmith 追踪流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 应用层                                                      │
│ ───────────────────────────────────────────────────────────────  │
│ from langchain_openai import ChatOpenAI                          │
│ from langsmith import traceable                                 │
│                                                                   │
│ @traceable(run_type="chain")                                    │
│ def my_chain(question):                                          │
│     return chain.invoke({"question": question})                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: LangChain 自动追踪                                          │
│ ───────────────────────────────────────────────────────────────  │
│ LangChain 自动捕获:                                               │
│ • LLM 调用 (输入/输出)                                           │
│ • Tool 调用                                                      │
│ • Retriever 查询                                                 │
│ • Chain 结构                                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: LangSmith 存储与分析                                         │
│ ───────────────────────────────────────────────────────────────  │
│ • 完整日志存储                                                   │
│ • 性能指标计算                                                   │
│ • 质量评估                                                       │
│ • 异常检测                                                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install langsmith
```

### 4.2 环境配置

```bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY="ls_xxxx"
export LANGCHAIN_PROJECT="my-project"  # 可选
```

### 4.3 LangChain 集成

```python
from langchain_openai import ChatOpenAI
from langchain import hub
from langchain.chains import RetrievalQA
from langsmith import traceable

# 环境自动启用追踪
llm = ChatOpenAI(model="gpt-4o")
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# 直接调用，自动追踪
result = qa_chain.invoke({"query": "什么是 RAG?"})
```

### 4.4 自定义追踪

```python
from langsmith import traceable

@traceable(
    run_type="chain",
    metadata={"version": "v2", "env": "production"}
)
def my_custom_chain(input_text: str) -> str:
    """带自定义元数据的追踪"""
    # 你的逻辑
    return result
```

### 4.5 查看追踪

```python
# 在代码中获取追踪 URL
from langsmith import Client

client = Client()

# 获取最近的追踪
traces = client.list_runs(project_name="my-project", limit=10)

for trace in traces:
    print(f"Trace: {trace.id}")
    print(f"URL: https://smith.langchain.com/...?run={trace.id}")
```

---

## 5. 高级特性

### 5.1 评估套件

```python
from langsmith import evaluate

# 定义评估器
def correctness_evaluator(run, example):
    predicted = run.outputs.get("answer", "")
    expected = example.outputs.get("answer", "")
    return {
        "score": 1.0 if predicted == expected else 0.0,
        "reasoning": "回答是否正确"
    }

# 运行评估
results = evaluate(
    my_chain,
    data="my-dataset",
    evaluators=[correctness_evaluator],
    experiment_prefix="v2-evaluation"
)
```

### 5.2 生产监控

```python
from langsmith import Client

client = Client()

# 创建质量监控
monitor = client.create_quality_monitor(
    project_name="production",
    metrics=[
        {"name": "response_length", "threshold": (50, 5000)},
        {"name": "latency", "threshold": (0, 5.0)},
    ],
    alert_email="team@example.com"
)
```

### 5.3 A/B 测试

```python
# 对比两个 prompt 版本
from langsmith import compare

results = compare(
    chains={
        "v1": chain_v1,
        "v2": chain_v2,
    },
    dataset="test-dataset",
    evaluation_config={
        "精度": correctness_evaluator,
        "延迟": latency_evaluator
    }
)
```

---

## 6. 对比与选择

### 6.1 LLM 调试工具对比

| 维度 | LangSmith | PromptLayer | Weights & Biases |
|------|-----------|-------------|-------------------|
| **LangChain 集成** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **追踪粒度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **评估** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **生产监控** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **价格** | 按量付费 | 按团队 | 按人 |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| LangChain 应用 | LangSmith |
| 提示词管理 | PromptLayer |
| 通用 ML 追踪 | Weights & Biases |
| 生产质量监控 | LangSmith |

---

## 参考资源

- [LangSmith GitHub](https://github.com/langchain-ai/langsmith)
- [LangSmith 文档](https://docs.smith.langchain.com/)
- [LangChain Tracing](https://python.langchain.com/docs/langsmith/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[AI运维/AIOps-in-nutshell.md|AIOps-in-nutshell]]
- [[AI运维/SRE_Reliability/AI_Incident_Response_Playbook|AI_Incident_Response_Playbook]]
- [[AI运维/AI_Ops_for_dummy.md|AI_Ops_for_dummy]]
- [[AI运维/README.md|AI运维 README]]
- [[AI运维/README_for_dummy.md|README_for_dummy]]
