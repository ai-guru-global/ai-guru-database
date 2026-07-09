---
title: "Benchmark（基准测试）"
category: -concepts
tags: [benchmark, evaluation, lm-evaluation-harness, opencompass, llm-eval]
aliases:
  - "Benchmark"
  - "基准测试"
  - "LLM Benchmark"
relationships:
  - target: "_concepts/lm-evaluation-harness"
    type: example
  - target: "_concepts/opencompass"
    type: example
  - target: "_concepts/llm-as-judge"
    type: complementary
sources:
  - 模型评估/
  - _concepts/lm-evaluation-harness.md
  - _concepts/opencompass.md
summary: "Benchmark（基准测试）是用标准化任务集评估 LLM 能力的方法；2026 年 LLM 评测已从单一基准（MMLU）演进到多维矩阵（推理/代码/Agent/安全/多模态），单一分数已无法反映真实能力。"
lifecycle: stable
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
created: 2026-06-24
updated: 2026-06-24
---

# Benchmark（基准测试）

## 核心要点

- **定义**：用标准化任务集合评估模型某方面能力的测试方法。
- **必备属性**：
  - **可复现**：固定测试集 + 固定评分脚本
  - **不污染**：测试集不应出现在训练集中
  - **难度梯度**：覆盖基础到高级
  - **统计显著性**：样本量 ≥ 500，置信区间 ≥ 95%
- **2026 现状**：单一基准已过时，需多维评测矩阵。

## 一句话解释

> Benchmark = "标准化的考卷"，让不同模型能在同一题目上 PK；好的 benchmark 应该防作弊、够难、有区分度。

## 主流 Benchmark 全景

### 综合能力
| 基准 | 内容 | 规模 | 当前 SOTA |
|------|------|------|----------|
| **MMLU** | 57 学科 | 14K 题 | Claude Opus 4.8: 92.1% |
| **MMLU-Pro** | 强化版 | 12K 题 | Claude Opus 4.8: 88.6% |
| **HellaSwag** | 常识 | 70K 题 | 96.5% |

### 推理与代码
| 基准 | 目标 | 当前 SOTA |
|------|------|----------|
| **GSM8K** | 小学数学 ≥ 95% | 98.0% |
| **MATH** | 高中 ≥ 85% | 89.2% |
| **HumanEval** | Python ≥ 95% | 96.8% |
| **SWE-bench** | GitHub 修复 ≥ 50% | 65.4% |

### 中文
| 基准 | 当前 SOTA |
|------|----------|
| **C-Eval** | Qwen3-235B: 90.2% |
| **CMMLU** | DeepSeek-V3: 88.5% |

### Agent / 工具
| 基准 | 当前 SOTA |
|------|----------|
| **WebArena** | Claude Opus 4.8: 64.8% |
| **τ-bench** | Claude Sonnet 4.6: 68.5% |

### 安全
| 基准 | 用途 |
|------|------|
| **AdvBench** | Prompt Injection 攻击 |
| **JailbreakBench** | 越狱测试 |
| **HarmBench** | 有害内容 |

## 主流评测框架

| 框架 | 提供方 | 强项 |
|------|--------|------|
| **lm-evaluation-harness** | EleutherAI | 行业标准，150+ 任务 |
| **OpenCompass** | 上海AI Lab | 中文 + 多模态 |
| **HELM** | Stanford | 多维评估矩阵 |
| **BIG-Bench** | Google | 200+ 任务 |
| **AlpacaEval** | Stanford | 单轮对话胜率 |
| **MT-Bench** | LMSYS | 多轮对话 |
| **Chatbot Arena** | LMSYS | 真实人类盲测、Elo |

## 评测陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| **数据污染** | 测试集出现在训练集 | 用未公开 / 新发布基准 |
| **过拟合基准** | 刷榜但实际能力差 | 多基准 + 实际场景测试 |
| **单一维度** | 偏科 | 多维矩阵 + 加权 |
| **评测成本失控** | GPT-4 评测烧钱 | 小模型 Judge + 抽样验证 |
| **评测集小** | 分数波动大 | ≥ 500 题 + 95% CI |

## 何时用什么

```
评估什么？
├── 通用能力 → MMLU / HellaSwag / ARC
├── 推理 → GSM8K / MATH
├── 代码 → HumanEval / SWE-bench / LiveCodeBench
├── 中文 → C-Eval / CMMLU / SuperCLUE
├── 长上下文 → RULER / LongBench / Needle-in-Haystack
├── Agent → WebArena / τ-bench / SWE-bench
├── 安全 → AdvBench / JailbreakBench / HarmBench
├── 多模态 → MMMU / MathVista
└── 真实人类偏好 → Chatbot Arena
```

## Related

- [[_concepts/lm-evaluation-harness]] — lm-evaluation-harness
- [[_concepts/opencompass]] — OpenCompass
- [[_concepts/llm-as-judge]] — LLM-as-Judge
- [[_meta/cheatsheets/cheatsheet-evaluation]] — 评测速查表
- [[模型评估/README|模型评估]] — 评测章节