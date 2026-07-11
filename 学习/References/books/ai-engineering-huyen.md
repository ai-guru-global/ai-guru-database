---
title: "AI Engineering"
category: "-references-books"
tags:
  - book
  - learning-resource
  - ai-engineering
  - llm
  - production
  - chip-huyen
  - oreilly
summary: "Chip Huyen 的 AI 工程权威指南（2025），系统讲解如何基于基础模型构建生产级 AI 应用，覆盖模型评估、RAG、Agent、护栏、推理优化等全流程。"
sources:
  - "https://www.oreilly.com/library/view/ai-engineering/9781098166298/"
created: 2026-06-12
updated: 2026-07-11
lifecycle: reviewed
tier: supporting
aliases:
  - "Ai Engineering Huyen"
  - "ai engineering huyen"

---
# AI Engineering

> **一句话理解**: Chip Huyen 继《Designing ML Systems》后的又一力作，聚焦基础模型时代的 AI 工程实践，是 2025 年 LLM 应用工程领域最系统、最权威的参考书。

## 书籍信息

| 属性 | 说明 |
|------|------|
| **书名** | AI Engineering: Building Applications with Foundation Models |
| **作者** | Chip Huyen |
| **出版社** | O'Reilly（2025，初版） |
| **页数** | 约 600 页（两卷） |
| **难度** | ⭐⭐⭐（中级→高级） |
| **链接** | [O'Reilly](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) |

## 核心内容概要

全书分两卷：

**卷一 — 基础模型与推理**
1. AI 工程概览（传统 ML vs 基础模型范式）
2. 理解基础模型（架构、训练范式、能力边界）
3. 推理优化（采样策略、量化、推测解码、KV Cache）
4. 模型推理基础设施（GPU、推理引擎、批处理）

**卷二 — AI 应用工程**
5. 提示工程与上下文工程
6. RAG（检索增强生成）架构与优化
7. 微调与适配（LoRA、PEFT）
8. AI 智能体（Agent）与工具调用
9. 模型评估方法学
10. 安全、护栏与对齐
11. AI 系统架构与生产化

## 适合人群

- **级别**: 中级 → 高级
- **前置知识**: 了解 LLM 基础、有后端工程经验
- **适合**: LLM 应用工程师、AI 平台架构师、技术负责人

## 知识库章节映射

| 本书章节 | 推荐参考 |
|----------|----------|
| Ch 1-2 基础模型 | [[大模型/LLM_Fundamentals]] |
| Ch 3-4 推理优化 | [[部署推理/]] |
| Ch 5 提示工程 | [[大模型/Prompt_Engineering/Prompt_Engineering]] |
| Ch 6 RAG | [[RAG系统/RAG_Systems]] |
| Ch 7 微调 | [[大模型/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] |
| Ch 8 Agent | [[智能体/]] |
| Ch 9-10 评估与安全 | [[模型评估/]] 、 [[伦理安全/]] |

## 学习建议

- **阅读顺序**: 卷一建立基础模型认知 → 卷二逐章落地
- **实战搭配**: 每章搭配一个真实项目（如 RAG 系统、Agent demo）
- **姊妹篇**: 先读 [[designing-ml-systems-huyen]] 建立系统设计思维

## 亮点与局限

- ✅ **亮点**: 内容最新（2025）、系统性强、覆盖推理优化/评估/安全等深度话题、作者行业经验丰富
- ⚠️ **局限**: 内容密集、代码示例较少（偏架构）、需要一定 LLM 前置知识

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[大模型/]] | [[RAG系统/]] | [[智能体/]]
