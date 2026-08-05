---
title: "DeepEval: LLM 测试框架"
category: "09-testing"
tags: ["testing", "ai-testing", "prompt-testing", "evaluation", "llm"]
summary: "> **一句话理解**: DeepEval 是一个开源的 LLM 测试框架——基于 Pytest，方便地编写单元测试来评估你的 LLM 应用，覆盖幻觉、毒性、摘要质量等场景。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Deepeval Deep Dive"
  - "DeepEval Deep Dive"
  - DeepEval_Deep_Dive
sources: []

name_zh: "DeepEval: LLM 测试框架"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# DeepEval: LLM 测试框架

> 中文简称：DeepEval: LLM 测试框架

> **一句话理解**: DeepEval 是一个开源的 LLM 测试框架——基于 Pytest，方便地编写单元测试来评估你的 LLM 应用，覆盖幻觉、毒性、摘要质量等场景。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [指标详解](#5-指标详解)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
DeepEval: LLM 测试框架
═══════════════════════════════════════════════════════════════════

定位: 基于 Pytest 的 LLM 应用测试框架，让测试像单元测试一样简单

核心理念:
───────────────────────────────────────────────────────────────────
• Pytest 集成: 测试工程师熟悉的框架
• 单元测试风格: 简单编写和维护
• 丰富指标: 幻觉、毒性、摘要等
• 合成数据: 自动生成测试数据
• 开源: 完全免费
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Pytest 插件** | 无缝集成 Pytest 工作流 |
| **内置指标** | 15+ 预建评估指标 |
| **合成数据** | 自动生成测试数据 |
| **G-Eval** | 基于 LLM 的评估 |
| **CI/CD 集成** | GitHub Actions 支持 |
| **详细报告** | HTML 报告生成 |

### 1.3 支持的指标

| 指标 | 说明 |
|------|------|
| **Hallucination** | 幻觉检测 |
| **Toxicity** | 毒性检测 |
| **Summarization** | 摘要质量 |
| **Answer Relevancy** | 答案相关性 |
| **Faithfulness** | 忠诚度 |
| **Contextual Precision** | 上下文精度 |
| **Contextual Recall** | 上下文召回 |

---

## 2. 核心概念

### 2.1 测试流程

```
DeepEval 测试流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        DeepEval 测试流程                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  编写测试 (Pytest 风格)                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  import deepeval                                             │ │
│  │  from deepeval.metrics import HallucinationMetric           │ │
│  │                                                               │ │
│  │  def test_no_hallucination():                                │ │
│  │      metric = HallucinationMetric(threshold=0.5)            │ │
│  │      result = evaluate(                                      │ │
│  │          llm_call=lambda: "巴黎是法国的首都",                │ │
│  │          metrics=[metric]                                   │ │
│  │      )                                                       │ │
│  │      assert result.success                                   │ │
│  │  )                                                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  执行测试                                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  pytest test_llm.py -v                                       │ │
│  │  执行所有评估                                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  生成报告                                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  HTML 报告 + 失败用例详情                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 评估模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **Gold Standard** | 有标准答案的对比 | 精确匹配 |
| **LLM-as-Judge** | 用 LLM 评估 | 主观质量 |
| **G-Eval** | 链式思维评估 | 复杂场景 |

---

## 3. 架构设计

### 3.1 系统架构

```
DeepEval 系统架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        DeepEval 架构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   测试代码                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  @pytest.mark.parametrize                                   │   │
│   │  def test_summarization(summaries):                        │   │
│   │      ...                                                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Test Runner                                   │   │
│   │  ├── Pytest Integration                                   │   │
│   │  ├── Metric Calculator                                    │   │
│   │  └── Assertion Engine                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Evaluators                                    │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │   │
│   │  │ G-Eval  │  │ Exact   │  │ Semantic │               │   │
│   │  │         │  │ Match   │  │ Match   │               │   │
│   │  └──────────┘  └──────────┘  └──────────┘               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Output                                       │   │
│   │  ├── Test Results (PASS/FAIL)                           │   │
│   │  ├── Detailed Report (HTML)                             │   │
│   │  └── CI/CD Integration                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install deepeval
```

### 4.2 基础测试

```python
# test_llm.py
import pytest
from deepeval import evaluate
from deepeval.metrics import (
    HallucinationMetric,
    ToxicityMetric,
    AnswerRelevancyMetric,
)

# 测试幻觉
@pytest.mark.parametrize("llm_output,context", [
    ("巴黎是法国的首都", "法国首都是巴黎"),  # 真实
    ("巴黎是英国的首都是", "法国首都是巴黎"),  # 幻觉
])
def test_hallucination(llm_output, context):
    metric = HallucinationMetric(threshold=0.5)
    result = evaluate(
        llm_output=llm_output,
        context=[context],
        metrics=[metric]
    )
    assert result.success

# 测试毒性
def test_no_toxicity():
    metric = ToxicityMetric(threshold=0.5)
    result = evaluate(
        llm_output="这是一个友好的回复",
        metrics=[metric]
    )
    assert result.success
```

### 4.3 G-Eval 评估

```python
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase

# 定义 G-Eval 指标
correctness_metric = GEval(
    name="Correctness",
    criteria="评估答案是否正确、完整、无误",
    evaluation_params=[
        LLMTestCase.params.actual_output,
        LLMTestCase.params.expected_output,
    ],
)

# 运行评估
result = evaluate(
    test_cases=[
        LLMTestCase(
            input="1+1等于几?",
            expected_output="2",
            actual_output="2",
        ),
    ],
    metrics=[correctness_metric],
)
```

### 4.4 与 RAG 集成

```python
from deepeval.metrics import FaithfulnessMetric, ContextualPrecisionMetric

def test_rag_quality():
    # RAG 评估指标
    metrics = [
        FaithfulnessMetric(threshold=0.7),
        ContextualPrecisionMetric(threshold=0.7),
        AnswerRelevancyMetric(threshold=0.7),
    ]

    # 评估
    result = evaluate(
        test_cases=[
            LLMTestCase(
                input="量子计算是什么?",
                actual_output="量子计算是一种基于量子力学原理的计算方式...",
                context=[
                    "量子计算是一种新型计算模式",
                    "它利用量子叠加态进行并行计算",
                    "量子计算在密码学领域有重要应用",
                ],
            )
        ],
        metrics=metrics,
    )

    print(result.metrics_results)
```

### 4.5 CI/CD 集成

```yaml
# .github/workflows/test.yml
name: LLM Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install deepeval
      - run: pytest tests/ -v --report
      - uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: test_results/
```

---

## 5. 指标详解

### 5.1 Hallucination

```python
# 幻觉检测原理
"""
1. 将 context 分成 claims
2. 检查每个 claim 是否能从 LLM output 推断
3. Hallucination = 虚假 claims / 总 claims
"""
```

### 5.2 G-Eval

```python
# G-Eval 使用链式思维评估
"""
1. 详细定义评估标准
2. 使用 LLM 逐步评估
3. 综合得出最终分数
"""
```

---

## 6. 对比与选择

### 6.1 与其他框架对比

| 维度 | DeepEval | RAGAS | Promptfoo |
|------|----------|-------|-----------|
| **框架** | Pytest | 独立 | 独立 |
| **指标** | 15+ | 6+ | 20+ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **CI/CD** | ✅ | ❌ | ✅ |
| **开源** | ✅ | ✅ | ✅ |

### 6.2 适用场景

**✅ DeepEval 最佳场景:**
- 需要 Pytest 工作流
- 单元测试风格测试
- 快速集成 CI/CD
- 多种指标评估

---

## 参考资源

- [DeepEval GitHub](https://github.com/confident-ai/deepeval)
- [DeepEval 文档](https://docs.confident.ai/)
- [DeepEval Hub](https://app.confident.ai/hub)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[09_测试/01_测试基础/02_AI测试简明指南.md|AI-Testing-in-nutshell]]
- [[09_测试/02_测试框架/03_Java_AI测试|AI_Testing_for_dummy]]
- [[09_测试/02_测试框架/03_Java_AI测试.md|Java_AI_Testing]]
- [[09_测试/README.md|测试 README]]
- [[05_大模型/06_微调技术/01_Axolotl_深入分析.md|Axolotl_Deep_Dive]]
