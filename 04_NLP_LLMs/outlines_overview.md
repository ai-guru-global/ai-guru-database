---
title: "Outlines 受控生成框架概览"
category: "04-nlp-llms"
tags: ["tool", "structured-output", "outlines", "controlled-generation", "local-llm"]
summary: "通过正则表达式和 JSON Schema 约束 LLM 输出的受控生成框架,特别适合本地模型(Llama/Mistral 等),基于有限状态机实现精确输出控制。"
sources:
  - "https://github.com/dottxt-ai/outlines"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
---

# Outlines 受控生成框架概览

> **一句话理解**: 通过正则表达式和 JSON Schema 约束 LLM 输出,特别适合本地模型的受控生成。

## 核心特性

- **正则约束**: 用正则表达式精确控制输出格式
- **JSON Schema**: 用 JSON Schema 定义复杂输出结构
- **本地模型**: 支持 Llama、Mistral、Qwen 等开源模型
- **有限状态机**: 基于 FSM 实现高效约束解码
- **零幻觉输出**: 输出严格符合定义的格式

## 与 Instructor 对比

| 维度 | Outlines | Instructor |
|------|----------|------------|
| 适用模型 | 本地模型 | API 模型 |
| 约束方式 | FSM 底层约束 | 重试机制 |
| 精度 | 100% 格式正确 | 高(但非100%) |
| 速度 | 快(无需重试) | 中(可能重试) |
| 依赖 | 需要 GPU | 只需 API |

> **关联**: -> [[04_NLP_LLMs/Structured_Output_Guide|结构化输出指南]] | [[90_Learn/guides/ai_engineering_roadmap_2026|AI 工程路线图]]
