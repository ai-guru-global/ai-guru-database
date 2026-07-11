---
title: "Build a Reasoning Model"
category: "-references-books"
tags:
  - book
  - learning-resource
  - llm
  - reasoning
  - reinforcement-learning
  - manning
summary: "从零构建推理模型实战教程，讲解如何用强化学习训练 LLM 进行长链推理（o1/DeepSeek-R1 风格），覆盖 CoT、RLHF/GRPO、推理评估等。"
sources:
  - "https://www.manning.com/books/build-a-reasoning-model-from-scratch"
created: 2026-06-12
updated: 2026-07-11
lifecycle: draft
tier: supporting
aliases:
  - "Build Reasoning Model"
  - "build reasoning model"

---
# Build a Reasoning Model

> **一句话理解**: 聚焦"推理模型"这一新范式的实战教程，讲解如何用强化学习训练 LLM 产生长思维链（类似 OpenAI o1 / DeepSeek-R1），是理解推理模型训练原理的前沿参考。

## 书籍信息

| 属性 | 说明 |
|------|------|
| **书名** | Build a Reasoning Model (From Scratch) |
| **作者** | Manning 出品（作者待确认） |
| **出版社** | Manning（Early Access / 即将出版） |
| **难度** | ⭐⭐⭐⭐（高级） |
| **链接** | [Manning](https://www.manning.com/books/build-a-reasoning-model-from-scratch) |

## 核心内容概要（基于 Manning 大纲）

1. **推理模型概述** — 从"预测下一个 Token"到"思考"的范式转变
2. **思维链（CoT）基础** — 显式推理路径
3. **强化学习入门** — RL 训练 LLM 的方法
4. **GRPO 与 PPO 训练** — 推理导向的 RL 算法
5. **奖励建模** — 过程奖励（PRM）与结果奖励（ORM）
6. **推理评估** — 数学/代码基准、推理质量度量
7. **推理模型部署** — 长输出的推理优化

## 适合人群

- **级别**: 高级
- **前置知识**: 深度学习、PyTorch、了解 LLM 训练与 RL
- **适合**: LLM 研究者、追求前沿的算法工程师

## 知识库章节映射

| 本书章节 | 推荐参考 |
|----------|----------|
| Ch 2 CoT | [[大模型/Prompt_Engineering/Prompt_Engineering]] |
| Ch 3-4 RL | [[强化学习/]] 、 [[模型训练/]] |
| Ch 5 奖励建模 | [[模型训练/]] |
| Ch 7 部署 | [[部署推理/]] |

## 学习建议

- **前置阅读**: 先完成 [[build-llm-from-scratch-raschka]] 建立基础
- **注意**: 该书仍处于 Early Access，内容可能变动
- **社区**: 关注 DeepSeek-R1、OpenAI o1 技术报告作为补充

## 亮点与局限

- ✅ **亮点**: 紧扣推理模型这一 2025 最热前沿、"从零实现"风格
- ⚠️ **局限**: 成书尚早（可能为 MEAP）、作者信息待确认、领域快速变化

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[强化学习/]] | [[模型训练/]]
