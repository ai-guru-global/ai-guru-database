---
title: "OpenAI 与 GPT 系列"
category: -concepts
tags: [openai, gpt, llm, foundation-model, api]
aliases:
  - "OpenAI"
  - "GPT"
  - "ChatGPT"
relationships:
  - target: "_concepts/foundation-model"
    type: type_of
  - target: "_concepts/azure-openai"
    type: hosted_by
  - target: "_concepts/cloud-ai-platform"
    type: belongs_to
sources:
  - 05_NLP_LLMs/Global_LLM_Ecosystem/OpenAI_Deep_Dive.md
  - 12_Architecture_Infrastructure/Azure_OpenAI_Deep_Dive.md
summary: "OpenAI 是 ChatGPT 与 GPT 系列模型的开发公司，GPT-5 / GPT-4o 系列定义了闭源 LLM 的 API 范式，是全球使用最广的 LLM 商业服务。"
lifecycle: stable
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-06-24
---

# OpenAI 与 GPT 系列

## 核心要点

- **公司定位**：美国 AI 公司（2015 创立，2022 年 ChatGPT 引爆 LLM 浪潮）。
- **旗舰模型**（2026 中）：
  - **GPT-5**：最强通用旗舰，多模态、强推理
  - **GPT-4o** / **GPT-4.1**：性价比主力
  - **o1 / o3 系列**：深度推理模型
  - **GPT-4o mini**：极致低成本
- **产品矩阵**：
  - **API**（开发者）
  - **ChatGPT**（C 端，月活 > 5 亿）
  - **Azure OpenAI**（企业，2026 中国/合规首选）
  - **OpenAI Agents SDK**（原生 Agent 框架）
  - **Sora**（视频生成）
  - **Whisper**（语音识别）
- **核心优势**：生态最成熟、文档最全、第三方集成最多。

## 一句话解释

> OpenAI = 当前 LLM 商业化的"事实标准制定者"；选 GPT 大概率是默认值，但价格、性能、隐私需要权衡。

## 模型选型速查

| 模型 | 上下文 | 推理 | 多模态 | 价格（$/M） | 适用 |
|------|--------|------|--------|------------|------|
| GPT-5 | 256K | 极强 | ✅ 文本+图像+音频 | $$$$ | 最复杂任务 |
| GPT-4.1 | 1M | 强 | ✅ | $$$ | 长上下文主力 |
| GPT-4o | 128K | 强 | ✅ | $$ | 通用性价比 |
| o3 | 256K | 极强（推理） | ❌ | $$$$ | 数学/科学推理 |
| o3-mini | 128K | 强（推理） | ❌ | $$ | 推理性价比 |
| GPT-4o mini | 128K | 中 | ✅ | $ | 简单任务/分类 |

## 何时使用

✅ **推荐**：
- 通用商业应用，对生态/文档要求高
- 复杂推理任务（o 系列）
- 强多模态需求

⚠️ **不推荐**：
- 中国境内合规场景（数据出境限制）→ 用 Azure OpenAI 中国版或国产模型
- 长文档分析性价比优先 → Claude
- 中文写作/理解极致 → Qwen / DeepSeek

## Related

- [[_concepts/foundation-model]] — 基础模型总览
- [[_concepts/azure-openai]] — Azure OpenAI（中国/合规）
- [[_concepts/cloud-ai-platform]] — 云 AI 平台
- [[05_NLP_LLMs/Global_LLM_Ecosystem/OpenAI_Deep_Dive]] — OpenAI 深度
- [[12_Architecture_Infrastructure/Azure_OpenAI_Deep_Dive]] — Azure OpenAI