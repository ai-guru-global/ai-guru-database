---
title: "Foundation Model（基础模型）"
category: -concepts
tags: [foundation-model, llm, gpt, claude, gemini, pretrain, transfer-learning]
aliases:
  - "Foundation Model"
  - "Base Model"
  - "基础模型"
relationships:
  - target: "概念/aws-bedrock"
    type: hosted_by
  - target: "概念/openai"
    type: example
  - target: "概念/gemini"
    type: example
sources:
  - 架构基建/AWS_Bedrock_Deep_Dive.md
  - 大模型/Global_LLM_Ecosystem/
summary: "Foundation Model（基础模型）是大规模预训练、可适配多种下游任务的通用模型（如 GPT-5 / Claude Opus 4.8 / Gemini 3 / Llama 4），是当前 LLM 产业的核心资产。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.92
created: 2026-06-24
updated: 2026-06-24
---

# Foundation Model（基础模型）

## 核心要点

- **定义**：在大规模数据上预训练、可通过微调或 Prompt 适配多种下游任务的通用大模型。
- **核心特征**：
  - **大规模参数**（数十亿到数万亿）
  - **大规模预训练数据**（TB 级文本/图像/视频）
  - **涌现能力**（Emergent abilities，规模超过阈值后出现）
  - **下游可适配**（SFT / RLHF / Prompt）
- **代表模型**（2026）：
  - 闭源：GPT-5、Claude Opus 4.8、Gemini 3 Ultra
  - 开源：Llama 4、DeepSeek-V3、Qwen3、Mixtral

## 一句话解释

> Foundation Model = "通用预训练大模型"，是 LLM 产业的"原材料"；微调和 Prompt 工程都是在这个基础上做适配。

## 与其他模型的关系

```
Foundation Model（基础模型）
├── 闭源 API：OpenAI / Anthropic / Google 直接提供
├── 开源权重：Llama / DeepSeek / Qwen / Mistral
└── 适配产物
    ├── 指令微调（SFT）→ Chat 模型
    ├── RLHF / DPO → 对齐模型
    ├── 领域微调 → 行业模型（医疗 / 法律 / 金融）
    └── Prompt → 即用即得（无需训练）
```

## 主流厂商一览

| 厂商 | 闭源旗舰 | 开源旗舰 | 生态 |
|------|---------|---------|------|
| **OpenAI** | GPT-5 | - | API + ChatGPT |
| **Anthropic** | Claude Opus 4.8 | - | API + Claude App |
| **Google** | Gemini 3 Ultra | Gemma 3 | Vertex AI |
| **Meta** | - | Llama 4 | 开放权重 |
| **DeepSeek** | - | DeepSeek-V3 / R1 | 开放权重 |
| **阿里** | Qwen3-Max | Qwen3 系列 | 开放权重 + API |
| **Mistral** | - | Mixtral 8x22B | 开放权重 |
| **智谱** | GLM-4 | ChatGLM | 开放权重 + API |

## 选型决策

```
需要极致能力 + 接受闭源？
├── 是 → GPT-5 / Claude Opus 4.8 / Gemini 3 Ultra
└── 否 → 需要私有化？
    ├── 是 → Llama 4 70B+ / DeepSeek-V3 / Qwen3-72B
    └── 否 → 开源 API（Together / Fireworks / DeepSeek API）
```

## 关键属性对比

| 属性 | GPT-5 | Claude Opus 4.8 | Gemini 3 | Llama 4 |
|------|-------|-----------------|----------|---------|
| 上下文 | 256K | 1M | 1M | 10M |
| 多模态 | ✅ 全 | ✅ 文本+图像 | ✅ 原生全 | ✅ 文本+图像 |
| 工具调用 | ✅ | ✅ | ✅ | ✅ |
| 推理 | 极强 | 极强 | 强 | 中-强 |
| 价格 | $$$$ | $$$ | $$$ | $（自托管）|
| 自托管 | ❌ | ❌ | ❌ | ✅ |

## Related

- [[概念/cloud-ai-platform]] — 云 AI 平台
- [[概念/aws-bedrock]] — AWS Bedrock
- [[概念/openai]] — OpenAI
- [[概念/gemini]] — Gemini
- [[架构基建/AWS_Bedrock_Deep_Dive]] — Bedrock 深度