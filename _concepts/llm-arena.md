---
title: "LLM Arena"
category: -concepts
tags: ["llm-arena", "lmsys", "chatbot-arena", "human-evaluation", "benchmark", "elo"]
relationships:
  - target: "_concepts/model-evaluation"
    type: belongs_to
  - target: "_concepts/llm-as-judge"
    type: related_to
  - target: "_concepts/bbh"
    type: complements
  - target: "_concepts/red-teaming"
    type: differs_from
sources:
  - 08_Model_Evaluation/LLM_Benchmark_Suite_2026.md
  - 08_Model_Evaluation/LLM_as_Judge_Guide.md
  - 08_Model_Evaluation/README.md
summary: "LLM Arena（Chatbot Arena）是 LMSYS 推出的众包式大模型对战平台。用户同时和两个匿名模型对话，然后投票选出更好的那个。平台用国际象棋的 Elo 积分系统给模型排名，被业界视为‘老百姓用脚投票’的权威榜单。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# LLM Arena

## 核心要点

- **LLM Arena = Chatbot Arena**，由 LMSYS 维护。
- **机制**：用户提一个问题，两个匿名模型同时回答，用户选哪个更好。
- **排名方法**：用 Elo 积分系统，像国际象棋选手排名一样给模型打分。
- **特点**：基于真实人类偏好，不是自动指标，反映模型在开放域对话中的实际体验。

## 一句话理解

LLM Arena 就像大模型界的‘盲测选秀’：两个选手匿名出战，观众投票谁更会说人话、更懂需求、更少胡说。

## 详细内容

### 为什么用对战而不是直接打分？

直接给模型打 1-10 分很难统一标准：
- 不同用户对‘好’的定义不同。
- 分数容易扎堆，拉不开差距。

对战只需要二选一：A 更好、B 更好、差不多。人类更容易判断，数据也更干净。

### Elo 排名系统

 borrowed from chess:
- 每个模型有一个 Elo 分。
- 强者输给弱者会掉很多分，弱者赢强者会涨很多分。
- 对战次数越多，分数越稳定。

常见排名区间（2024-2025）：
- GPT-4o / Claude-3.5-Sonnet / Gemini-1.5-Pro：1300+
- 优秀开源模型：1200-1300
- 早期模型：1000-1100

### Arena 的细分榜单

| 榜单 | 测什么 |
|------|--------|
| **Overall** | 综合能力 |
| **Coding** | 代码能力 |
| **Hard Prompts** | 复杂提示 |
| **Creative Writing** | 创意写作 |
| **Math** | 数学推理 |
| **Multilingual** | 多语言 |
| **Vision** | 多模态 |

### 优点与局限

| 优点 | 局限 |
|------|------|
| 反映真实人类偏好 | 用户群体有偏差（偏技术、偏英文） |
| 开放域、无固定题库 | 题目可能被污染 |
| 能发现自动指标测不到的体验问题 | 成本高，需要大量真人参与 |
| 排名直观、易传播 | 对专业领域能力覆盖不足 |

## 开放问题

- 如何减少用户群体偏差（语言、文化、专业背景）。
- Arena 排名与下游业务指标的相关性。
- 模型厂商是否会针对 Arena 风格优化，导致排名虚高。

## Related

- [[_concepts/model-evaluation]] — 模型评估
- [[_concepts/llm-as-judge]] — LLM-as-Judge
- [[_concepts/bbh]] — BBH
- [[_concepts/red-teaming]] — 红队测试
- [[08_Model_Evaluation/LLM_Benchmark_Suite_2026]] — LLM 基准套件 2026
- [[08_Model_Evaluation/LLM_as_Judge_Guide]] — LLM-as-Judge 指南
