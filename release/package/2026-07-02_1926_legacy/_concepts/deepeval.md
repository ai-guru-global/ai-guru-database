---
title: "DeepEval LLM 评估框架 (DeepEval - LLM Evaluation)"
category: -concepts
tags: ["deepeval", "llm-evaluation", "testing", "hallucination", "toxicty", "bias"]
relationships:
  - target: "_concepts/ragas"
    type: related_to
  - target: "_concepts/agent-evaluation"
    type: related_to
  - target: "_concepts/opik"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "DeepEval 是 Confident AI 开源的 LLM 评估框架——类似 PyTest 的测试框架，提供 14+ 评估指标（幻觉、毒性、偏差、RAG 等），支持 CI/CD 集成。是 LLM 应用质量保障的重要工具。"
provenance:
  extracted: 0.15
  inferred: 0.75
  ambiguous: 0.10
base_confidence: 0.83
lifecycle: stable
tier: supporting
---

# DeepEval LLM 评估框架

> **一句话理解**: DeepEval 是"LLM 应用的 PyTest"——像写单元测试一样评估 LLM 输出，14+ 指标覆盖幻觉、毒性、偏差、RAG 质量。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发商** | Confident AI |
| **开源协议** | Apache 2.0 |
| **GitHub** | 6K+ ⭐ |
| **核心理念** | 让 LLM 评估像单元测试一样简单 |
| **评估方式** | LLM-as-Judge + G-Eval + 传统 NLP |

---

## 2. 评估指标全景

```
┌─────────────────────────────────────────┐
│        DeepEval 14+ 评估指标            │
├─────────────────────────────────────────┤
│                                         │
│  1. RAG 评估                            │
│     ├── Faithfulness (忠实度)           │
│     ├── Answer Relevancy (答案相关性)   │
│     ├── Contextual Precision (上下文精确)│
│     ├── Contextual Recall (上下文召回)   │
│     └── Hallucination (幻觉检测)        │
│                                         │
│  2. 安全评估                            │
│     ├── Toxicity (毒性)                 │
│     ├── Bias (偏差)                     │
│     └── Moderation (内容审核)           │
│                                         │
│  3. 质量评估                            │
│     ├── Correctness (正确性)            │
│     ├── Coherence (连贯性)              │
│     ├── Fluency (流畅度)                │
│     └── Summarization (摘要质量)        │
│                                         │
│  4. 对话评估                            │
│     ├── Conversational Completeness     │
│     ├── Knowledge Retention             │
│     └── Role Adherence                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 核心用法

### 3.1 基础评估（PyTest 风格）

```python
# test_llm.py - 像写测试一样评估 LLM
from deepeval import assert_test
from deepeval.metrics import HallucinationMetric, ToxicityMetric
from deepeval.test_case import LLMTestCase

def test_hallucination():
    test_case = LLMTestCase(
        input="vLLM 是什么？",
        actual_output="vLLM 是 Google 开发的推理引擎",
        context=["vLLM 是由 UC Berkeley 开发的高性能推理引擎"],
    )
    metric = HallucinationMetric(threshold=0.5)
    assert_test(test_case, [metric])

def test_toxicity():
    test_case = LLMTestCase(
        input="解释一下 AI 的历史",
        actual_output="AI 是人工智能的缩写...",
    )
    metric = ToxicityMetric(threshold=0.5)
    assert_test(test_case, [metric])
```

```bash
# 运行评估（和 PyTest 一样）
deepeval test run test_llm.py
```

### 3.2 批量评估

```python
from deepeval import evaluate
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
    CorrectnessMetric,
)

# 批量测试用例
test_cases = [
    LLMTestCase(input=q, actual_output=a, context=c, expected_output=g)
    for q, a, c, g in zip(questions, answers, contexts, ground_truths)
]

# 多指标同时评估
evaluate(
    test_cases=test_cases,
    metrics=[
        AnswerRelevancyMetric(threshold=0.7),
        FaithfulnessMetric(threshold=0.7),
        CorrectnessMetric(threshold=0.7),
    ],
)
```

---

## 4. 评估报告

```
Test Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ test_hallucination     PASSED  (score: 0.12)
✅ test_toxicity          PASSED  (score: 0.03)
❌ test_faithfulness      FAILED  (score: 0.45, threshold: 0.70)
✅ test_answer_relevancy  PASSED  (score: 0.88)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3/4 tests passed | Overall: 75% pass rate

Confident AI Dashboard: https://app.confident-ai.com
```

---

## 5. CI/CD 集成

```yaml
# .github/workflows/llm-test.yml
name: LLM Quality Gate
on: [push, pull_request]
jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install deepeval
      - run: deepeval test run tests/test_llm.py
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          DEEPEVAL_API_KEY: ${{ secrets.DEEPEVAL_API_KEY }}
```

---

## 6. 与 Ragas 对比

| 特性 | DeepEval | Ragas |
|------|----------|-------|
| **定位** | LLM 通用测试框架 | RAG 评估专精 |
| **指标数量** | 14+ | 10+ |
| **测试范式** | PyTest 风格 | Dataset 评估 |
| **RAG 指标** | ✅ 有 | ★★★★★ 更全 |
| **安全指标** | ✅ 毒性/偏差/审核 | ❌ |
| **对话指标** | ✅ 对话完整性 | 有限 |
| **CI/CD** | ★★★★★ | ★★★★☆ |
| **学习曲线** | 低（PyTest 用户秒懂） | 中等 |

---

## 7. AI Stack 中的定位

```
┌─────────────────────────────────────────┐
│     LLM 评估工具选型                    │
├─────────────────────────────────────────┤
│                                         │
│  RAG 质量评估 → Ragas ★                │
│  LLM 全面测试 → DeepEval ★             │
│  Prompt 测试   → Promptfoo              │
│  生产监控      → TruLens / LangSmith    │
│                                         │
│  最佳实践: Ragas + DeepEval 组合使用    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. 关键要点

1. **PyTest 范式**：用 `assert_test` 评估 LLM，开发者零学习成本
2. **14+ 指标**：覆盖 RAG 质量、安全、对话、摘要等全维度
3. **CI/CD 友好**：可直接集成到 GitHub Actions，作为质量门禁
4. **开源免费**：核心评估功能完全开源
5. **Confident AI Dashboard**：可选的云端仪表盘，可视化评估趋势
6. **组合使用**：Ragas 做 RAG 专项深度评估，DeepEval 做全面质量覆盖
