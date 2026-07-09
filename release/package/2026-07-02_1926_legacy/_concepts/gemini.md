---
title: "Google Gemini 模型"
category: -concepts
tags: [gemini, google, vertex-ai, multimodal, llm, foundation-model]
aliases:
  - "Gemini"
  - "Gemini Pro"
  - "Gemini Ultra"
relationships:
  - target: "_concepts/cloud-ai-platform"
    type: belongs_to
  - target: "_concepts/vertex-ai"
    type: hosted_by
  - target: "_concepts/foundation-model"
    type: type_of
  - target: "_concepts/multimodal-models"
    type: evolves_into
sources:
  - 架构基建/Google_Vertex_AI_Deep_Dive.md
  - 大模型/Global_LLM_Ecosystem/Google_Gemini_Deep_Dive.md
summary: "Gemini 是 Google DeepMind 于 2023 年底发布的多模态大模型系列（Nano / Flash / Pro / Ultra），原生支持文本/图像/视频/音频/代码多模态输入，是 Google Vertex AI 平台的旗舰模型。"
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

# Google Gemini

## 核心要点

- **定位**：Google DeepMind 的多模态原生大模型系列，对标 GPT-4o / Claude。
- **版本**（2026 中）：
  - **Gemini 3 Ultra**：旗舰、复杂推理、1M 上下文
  - **Gemini 3 Pro**：主力、性价比优选
  - **Gemini 3 Flash**：高吞吐、低延迟、低成本
  - **Gemini Nano**：端侧 / 嵌入式
- **核心特性**：
  - **原生多模态**：从预训练开始就同时训练文本/图像/音频/视频
  - **百万级上下文**：1M-10M token（部分版本）
  - **长视频理解**：可一次性处理数小时视频
  - **工具调用**：原生 Function Calling 与 Agent 能力
- **接入方式**：Google AI Studio（API）、Vertex AI（企业）、Gemini App（C 端）

## 一句话解释

> Gemini = Google 的"原生多模态"答案。从训练第一天就把多模态当一等公民，而不是拼接。

## 与其他旗舰对比

| 模型 | 原生多模态 | 上下文 | 推理 | 工具 | 价格 |
|------|----------|--------|------|------|------|
| Gemini 3 Ultra | ✅ 文本+图像+音频+视频 | 1M | 极强 | ✅ | $$$ |
| Gemini 3 Pro | ✅ | 1M | 强 | ✅ | $$ |
| Gemini 3 Flash | ✅ | 1M | 中 | ✅ | $ |
| GPT-5 | ✅ 文本+图像+音频 | 256K | 极强 | ✅ | $$$$ |
| Claude Opus 4.8 | ✅ 文本+图像 | 1M | 极强 | ✅ | $$$ |
| Claude Sonnet 4.6 | ✅ | 1M | 强 | ✅ | $$ |

## 何时使用

✅ **推荐**：
- 多模态任务（视频理解、图表解析）
- 超长上下文（> 200K）
- Google Cloud 生态深度集成
- 性价比敏感的中等任务（Flash）

⚠️ **不推荐**：
- 需要严格的逻辑/数学推理（Claude / o1 更强）
- 中国境内低延迟访问（Google 服务受限）

## 相关生态

- **Gemini App** — Google 的 ChatGPT 竞品（C 端）
- **Gemini Live** — 实时语音对话（移动端）
- **Gemini for Workspace** — 集成到 Gmail / Docs / Sheets
- **Gemini Code Assist** — IDE 中的代码助手
- **Gemini CLI** — 命令行 Agent 工具

## Related

- [[_concepts/cloud-ai-platform]] — 云 AI 平台对比
- [[_concepts/vertex-ai]] — Vertex AI 平台
- [[_concepts/foundation-model]] — 基础模型总览
- [[_concepts/multimodal-models]] — 多模态模型
- [[架构基建/Google_Vertex_AI_Deep_Dive]] — Vertex AI 深度解析