---
title: "TruLens LLM 评估与反馈 (TruLens by Snowflake)"
category: -concepts
tags: ["trulens", "llm-evaluation", "feedback-functions", "rag-evaluation", "observability"]
relationships:
  - target: "_concepts/ragas"
    type: related_to
  - target: "_concepts/deepeval"
    type: related_to
  - target: "_concepts/opik"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "TruLens 是 Snowflake 开源的 LLM 评估框架——以 Feedback Functions（反馈函数）为核心，支持自定义评估逻辑，覆盖 RAG、Agent、安全等多维度评估。追踪与评估一体化。"
provenance:
  extracted: 0.15
  inferred: 0.75
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
---

# TruLens LLM 评估与反馈

> **一句话理解**: TruLens 是"LLM 应用的评估仪表盘"——用 Feedback Functions 自定义评估逻辑，追踪 + 评估一体化，帮你量化 LLM 应用质量。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发商** | TruEra → 被 Snowflake 收购 |
| **开源协议** | Apache 2.0 |
| **GitHub** | 3.5K+ ⭐ |
| **核心价值** | 可定制的 LLM 评估 + 追踪 |
| **核心概念** | Feedback Functions（反馈函数） |

---

## 2. 核心概念

### Feedback Functions

```python
from trulens_eval.feedback import Feedback
from trulens_eval.feedback.provider.openai import OpenAI as fOpenAI

# 定义反馈函数
f_ground_truth = Feedback(
    fOpenAI().ground_truth_measure,  # 使用 OpenAI 评估
    name="Ground Truth Agreement"
).on_input_output()

f_relevance = Feedback(
    fOpenAI().relevance,
    name="Answer Relevance"
).on_input_output()

# 自定义反馈函数
def my_custom_eval(response: str) -> float:
    """返回 0-1 的分数"""
    if "vLLM" in response:
        return 1.0
    return 0.5

f_custom = Feedback(my_custom_eval).on_output()
```

### 追踪 + 评估一体化

```python
from trulens_eval import TruSession, Feedback
session = TruSession()

# 用反馈函数包装应用
tru_app = session.wrap(
    my_rag_app,
    app_id="rag-v1",
    feedbacks=[f_ground_truth, f_relevance, f_custom]
)

# 每次调用自动追踪 + 评估
response = tru_app.query("什么是 vLLM？")
# 后台自动运行:
# 1. 追踪调用链路
# 2. 运行 Feedback Functions 评估
# 3. 记录到 TruLens 数据库
```

---

## 3. 评估维度

| 维度 | 说明 |
|------|------|
| **Groundedness** | 回答是否基于检索上下文 |
| **Answer Relevance** | 回答是否与问题相关 |
| **Context Relevance** | 检索上下文是否与问题相关 |
| **Comprehensiveness** | 回答是否全面 |
| **Harmful/Toxic** | 是否有害/有毒 |
| **Insensitivity** | 是否有偏见 |
| **Custom** | 自定义评估逻辑 |

---

## 4. 与其他评估工具对比

| 特性 | TruLens | Ragas | DeepEval |
|------|---------|-------|----------|
| **核心理念** | Feedback Functions | RAG 指标 | PyTest 风格 |
| **自定义评估** | ★★★★★ | ★★★☆☆ | ★★★☆☆ |
| **追踪一体化** | ✅ 内置 | ❌ | ❌ |
| **RAG 专项** | ★★★★☆ | ★★★★★ | ★★★★☆ |
| **开源** | ✅ | ✅ | ✅ |
| **适合场景** | 自定义评估 + 追踪 | RAG 深度评估 | CI/CD 测试 |

---

## 5. 关键要点

1. **Feedback Functions 是核心**：可自定义任意评估逻辑，灵活度最高
2. **追踪评估一体**：不需要单独部署追踪工具，评估和追踪同时完成
3. **Snowflake 背书**：被 Snowflake 收购后融入其数据平台生态
4. **开源免费**：Apache 2.0，可自托管
5. **适合定制**：当标准指标不够用时，TruLens 的自定义能力最强大
6. **vs Ragas**：Ragas 是 RAG 专项标准指标，TruLens 是通用自定义评估
