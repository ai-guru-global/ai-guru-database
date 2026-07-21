---
title: "LLM Arena"
category: -concepts
tags: ["llm-arena", "lmsys", "chatbot-arena", "human-evaluation", "benchmark", "elo"]
relationships:
  - target: "概念/model-evaluation"
    type: belongs_to
  - target: "概念/llm-as-judge"
    type: related_to
  - target: "概念/bbh"
    type: complements
  - target: "概念/red-teaming"
    type: differs_from
sources:
  - 模型评估/Benchmarks/LLM_Benchmark_Suite_2026.md
  - 模型评估/Evaluation_Tools/LLM_as_Judge_Guide.md
  - 模型评估/README.md
summary: "LLM Arena（Chatbot Arena）是 LMSYS 推出的众包式大模型对战平台。用户同时和两个匿名模型对话，然后投票选出更好的那个。平台用国际象棋的 Elo 积分系统给模型排名，被业界视为‘老百姓用脚投票’的权威榜单。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Llm Arena"
  - "llm arena"
  - "Chatbot Arena"
  - "LMSYS Arena"

---
# LLM Arena

> **一句话理解**: LLM Arena 就像大模型界的“盲测选秀”：两个选手匿名出战，观众投票谁更会说人话、更懂需求、更少胡说。

## 核心要点

- **LLM Arena = Chatbot Arena**，由 LMSYS 维护
- **机制**：用户提一个问题，两个匿名模型同时回答，用户选哪个更好
- **排名方法**：Bradley-Terry 模型 + Elo 积分系统
- **特点**：基于真实人类偏好，反映开放域对话的实际体验
- **规模**：累计 200万+ 投票，覆盖 100+ 模型

## 为什么用对战而不是直接打分？

直接给模型打 1-10 分很难统一标准：
- 不同用户对“好”的定义不同
- 分数容易扎堆，拉不开差距

对战只需要二选一：A 更好、B 更好、差不多。人类更容易判断，数据也更干净。

## Elo/Bradley-Terry 排名系统

- 每个模型有一个 Elo 分（初始 1000）
- 强者输给弱者会掉很多分，弱者赢强者会涨很多分
- 对战次数越多，分数越稳定
- 2026 年采用 Bradley-Terry 模型 + Bootstrap 置信区间

## 2026 年排名参考

| 梯队 | Elo 范围 | 代表模型 |
|:----:|:--------:|----------|
| T0 | 1400+ | GPT-5, Claude Opus 4.8, Gemini 3 Ultra |
| T1 | 1350-1400 | Claude Sonnet 4.6, Gemini 3 Pro, o3 |
| T2 | 1300-1350 | Llama 4 405B, DeepSeek-V3, Qwen3-235B |
| T3 | 1200-1300 | 优秀开源 70B 模型 |
| T4 | <1200 | 早期/小规模模型 |

## 细分榜单

| 榜单 | 测什么 | 意义 |
|------|--------|------|
| **Overall** | 综合能力 | 最权威的整体指标 |
| **Coding** | 代码能力 | 开发者选型参考 |
| **Hard Prompts** | 复杂提示 | 推理能力试金石 |
| **Creative Writing** | 创意写作 | 内容创作参考 |
| **Math** | 数学推理 | 逻辑能力指标 |
| **Multilingual** | 多语言 | 中文/日文等非英文能力 |
| **Vision** | 多模态 | 图像理解能力 |
| **Long Query** | 长输入 | 长上下文处理能力 |

## 优点与局限

| 优点 | 局限 |
|------|------|
| 反映真实人类偏好 | 用户群体有偏差（偏技术、偏英文） |
| 开放域、无固定题库 | 题目可能被污染 |
| 能发现自动指标测不到的体验问题 | 成本高，需要大量真人参与 |
| 排名直观、易传播 | 对专业领域能力覆盖不足 |
| 持续更新，新模型快速上榜 | 厂商可能针对性优化 |

## 如何使用 Arena 数据选型

1. **看总体排名**: 确定模型梯队
2. **看细分榜单**: 根据业务场景选择（代码看 Coding，中文看 Multilingual）
3. **看置信区间**: Elo 差距 <20 分的模型实际体验接近
4. **结合自动基准**: Arena + MMLU + HumanEval 综合判断
5. **实际测试**: 用自己的业务 prompt 做小规模测试

## 延伸阅读

- [[概念/LLM/llmops|LLMOps]]
- [[概念/LLM/foundation-model|基础模型]]
- [[模型评估/Benchmarks/LLM_Benchmark_Suite_2026|LLM 基准套件 2026]]
- [[模型评估/Evaluation_Tools/LLM_as_Judge_Guide|LLM-as-Judge 指南]]
