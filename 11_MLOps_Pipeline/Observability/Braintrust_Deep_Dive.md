---
title: "Braintrust: LLM 评估平台"
category: "11-mlops-pipeline"
tags: ["ai-ops", "observability", "monitoring", "incident-response", "llm"]
summary: "> **一句话理解**: Braintrust 是开源 LLM 评估平台——evals 数据集、A/B 测试、回归检测、成本追踪，开源的 LLM 质量保障工具。"
created: "2026-05-31"
updated: "2026-05-31"
---

# Braintrust: LLM 评估平台

> **一句话理解**: Braintrust 是开源 LLM 评估平台——evals 数据集、A/B 测试、回归检测、成本追踪，开源的 LLM 质量保障工具。

> 📐 **概念与选型方法论**: LLM 评估流水线（LLM-as-Judge/人审/Eval-Driven）见 [[11_MLOps_Pipeline/LLM_Evaluation_Pipeline]]。本文聚焦 Braintrust 工具用法。

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
Braintrust: LLM 评估平台
═══════════════════════════════════════════════════════════════════

定位: 开源 LLM 评估平台，构建和运行 evals、追踪质量、回归检测

核心理念:
───────────────────────────────────────────────────────────────────
• 开源: Apache 2.0，可自托管
• Eval 驱动: 数据集驱动的质量评估
• 回归检测: 自动检测质量下降
• 对比实验: A/B 测试模型/prompt
• 成本追踪: 精确到请求的成本
• 团队协作: 共享评估结果
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Eval 数据集** | 结构化测试用例 |
| **自动评分** | LLM-as-Judge |
| **回归检测** | 质量变化警报 |
| **A/B 测试** | 对比实验 |
| **成本追踪** | 实时成本分析 |
| **Web UI** | 直观的评估结果 |

---

## 2. 核心概念

### 2.1 Eval 结构

```
Braintrust Eval
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Eval 结构                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Eval:                                                           │
│  ├── name: "sentiment-analysis"                                │
│  ├── dataset: [                                                │
│  │     {                                                      │
│  │       "input": "这个产品太棒了！",                         │
│  │       "expected": "positive"                               │
│  │     },                                                      │
│  │     {...}                                                   │
│  │   ]                                                         │
│  ├── task: your_function,                                      │
│  └── scorers: [Accuracy, Latency]                              │
│                                                                   │
│  Result:                                                        │
│  ├── score: 0.95                                               │
│  ├── results: [Result1, Result2, ...]                          │
│  └── regression: {alert: true, message: "质量下降 5%"}        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 评分器类型

| 评分器 | 说明 |
|------|------|
| **ExactMatch** | 精确匹配 |
| **Contains** | 包含关系 |
| **LLMJudge** | LLM 评分 |
| **Latency** | 延迟检测 |
| **Cost** | 成本检测 |

---

## 3. 架构设计

### 3.1 系统架构

```
Braintrust 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Braintrust 架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Python SDK                                    │   │
│   │  • Eval 装饰器                                           │   │
│   │  • Dataset 管理                                          │   │
│   │  • Scorer 扩展                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Eval Engine                                   │   │
│   │  • 并行执行                                              │   │
│   │  • 评分计算                                              │   │
│   │  • 回归检测                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Web UI / API                                 │   │
│   │  • 结果可视化                                            │   │
│   │  • 数据集管理                                           │   │
│   │  • 成本追踪                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install braintrust
```

### 4.2 定义 Eval

```python
import braintrust

# 定义评估任务
@braintrust.eval(name="sentiment-analysis")
def sentiment_task(input):
    """情感分析评估"""
    result = llm.predict(input)
    return result

# 定义数据集
dataset = [
    {"input": "这个产品太棒了！", "expected": "positive"},
    {"input": "一般般，勉强能用", "expected": "neutral"},
    {"input": "太差了，浪费钱", "expected": "negative"},
]

# 运行评估
braintrust.evals(
    name="sentiment-analysis",
    task=sentiment_task,
    data=lambda: dataset,
    scorers=["auto"]
)
```

### 4.3 查看结果

```bash
# 运行后访问
# https://app.braintrust.dev

# 或本地查看
braintrust login
braintrust open
```

---

## 5. 高级特性

### 5.1 自定义评分器

```python
from braintrust import Scorer, ScoreResult

def contains_sentiment_words(data, response, expected):
    positive_words = ["棒", "好", "赞", "优"]
    negative_words = ["差", "烂", "垃圾", "坏"]

    response_text = response.output

    pos_count = sum(1 for w in positive_words if w in response_text)
    neg_count = sum(1 for w in negative_words if w in response_text)

    if expected == "positive":
        return ScoreResult(score=1.0 if pos_count > neg_count else 0.0)
    elif expected == "negative":
        return ScoreResult(score=1.0 if neg_count > pos_count else 0.0)
    else:
        return ScoreResult(score=0.5)

# 使用自定义评分器
@braintrust.eval(name="sentiment-analysis", scorers=[contains_sentiment_words])
def sentiment_task(input):
    return llm.predict(input)
```

### 5.2 A/B 测试

```python
# 对比两个模型
results = braintrust.compare(
    tasks={
        "gpt-4": lambda: call_gpt4(input),
        "claude-3": lambda: call_claude3(input),
    },
    data=dataset,
    experiment_name="model-comparison"
)

print(results)
# {'gpt-4': {'score': 0.92, 'cost': '$0.02'},
#  'claude-3': {'score': 0.95, 'cost': '$0.03'}}
```

### 5.3 回归检测

```python
# 配置回归检测
@braintrust.eval(
    name="sentiment-analysis",
    regression={
        "threshold": 0.05,  # 5% 下降警报
        "notify": ["slack", "email"]
    }
)
def sentiment_task(input):
    return llm.predict(input)

# 自动触发回归警报
# 当 score 下降超过 5% 时
```

---

## 6. 对比与选择

### 6.1 LLM 评估平台对比

| 维度 | Braintrust | RAGAS | LangSmith |
|------|------------|-------|------------|
| **开源** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ |
| **评估** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **回归检测** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **成本追踪** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 开源评估 | Braintrust |
| RAG 评估 | RAGAS |
| LangChain 调试 | LangSmith |
| 通用 LLM 测试 | Braintrust |

---

## 参考资源

- [Braintrust GitHub](https://github.com/braintrustdata/braintrust)
- [Braintrust 文档](https://docs.braintrust.dev/)
- [Braintrust 官网](https://www.braintrust.dev/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[13_AI_Ops/AIOps-in-nutshell.md|AIOps-in-nutshell]]
- [[13_AI_Ops/AI_Incident_Response_Playbook.md|AI_Incident_Response_Playbook]]
- [[13_AI_Ops/AI_Ops_for_dummy.md|AI_Ops_for_dummy]]
- [[13_AI_Ops/README.md|13_AI_Ops README]]
- [[13_AI_Ops/README_for_dummy.md|README_for_dummy]]
