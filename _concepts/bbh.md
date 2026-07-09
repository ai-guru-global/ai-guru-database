---
title: "BBH"
category: -concepts
tags: ["bbh", "big-bench", "benchmark", "reasoning", "llm-evaluation", "few-shot"]
relationships:
  - target: "_concepts/model-evaluation"
    type: belongs_to
  - target: "_concepts/reasoning-models"
    type: tests
  - target: "_concepts/llm-arena"
    type: complements
  - target: "_concepts/red-teaming"
    type: differs_from
sources:
  - 模型评估/Benchmarks/LLM_Benchmark_Suite_2026.md
  - 模型评估/Model_Evaluation.md
  - 模型评估/Evaluation-in-nutshell.md
summary: "BBH（Big-Bench Hard）是从 Google Big-Bench 中挑选的 23 个困难任务子集，专门测试大模型在复杂推理、多步思考和少样本学习上的能力。它被认为是衡量模型‘聪明程度’的重要基准之一。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Bbh

---
# BBH

## 核心要点

- **BBH = Big-Bench Hard**，是从 Big-Bench（Google 发布的大规模基准集合）中挑出的 23 个最难任务。
- **测的是复杂推理**：因果关系、逻辑演绎、数学、常识推理、多步规划等。
- **使用 few-shot 提示**：每个任务给几个示例，但不给中间推导过程，看模型能否自己学会。
- **常和 CoT（思维链）一起测**：模型直接答 vs 让模型一步步想，后者通常得分高很多。

## 一句话理解

BBH 就像给大模型做一份‘高难度综合智力题’：不考死记硬背，考你能不能举一反三、逻辑推理、多步思考。

## 详细内容

### Big-Bench 是什么？

Big-Bench 是 Google 发布的超大规模 LLM 基准，包含 200+ 任务，覆盖：
- 语言理解
- 常识推理
- 数学
- 代码
- 多语言
- 社会偏见
- 等等

任务太多太杂，于是研究者挑出其中人类也觉得难的 23 个，组成 BBH。

### BBH 覆盖的能力

| 能力 | 示例任务 |
|------|----------|
| **逻辑推理** | 布尔表达式、逻辑网格 |
| **因果推理** | 因果判断、反事实推理 |
| **数学** | 多步算术、单位换算 |
| **常识** | 物理常识、社会常识 |
| **规划** | 导航、任务排序 |
| **语言理解** | 消歧、指代消解 |

### 为什么重要？

- **区分模型的‘真聪明’与‘背答案’**：BBH 任务通常需要多步推理，不能靠记忆。
- **观察 scaling law**：模型越大，BBH 提升越明显，是研究涌现能力的重要指标。
- **评估推理策略**：比如 CoT、Self-Consistency 在 BBH 上效果提升显著。

### 评分方式

- 每个任务单独算准确率。
- 最终报告 23 个任务的平均准确率。
- 主流模型（GPT-4、Claude、Gemini、DeepSeek）会公开 BBH 分数作为能力参考。

## 开放问题

- BBH 题目是否会被模型在预训练时见过，导致分数虚高。
- 如何设计更难的推理基准，避免‘数据污染’。
- BBH 分数与实际业务效果之间的相关性。

## Related

- [[_concepts/model-evaluation]] — 模型评估
- [[_concepts/reasoning-models]] — 推理模型
- [[_concepts/llm-arena]] — LLM Arena
- [[_concepts/red-teaming]] — 红队测试
- [[模型评估/Benchmarks/LLM_Benchmark_Suite_2026]] — LLM 基准套件 2026
