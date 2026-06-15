---
title: "Groq 高速推理平台概览"
category: "09-deployment-inference"
tags: ["tool", "inference", "lpu", "low-latency", "api"]
summary: "Groq 是基于自研 LPU 芯片的高速 LLM 推理平台,提供极低延迟的 API 服务,兼容 OpenAI 格式,价格极具竞争力。"
sources:
  - "https://groq.com/"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: core
---

# Groq 高速推理平台概览

> **一句话理解**: 基于自研 LPU 芯片的高速 LLM 推理平台,提供极低延迟的 API 服务。

## 核心优势

- **极速推理**: LPU 芯片专为推理设计,速度远超 GPU
- **极低成本**: 相比传统 GPU 推理,成本降低 80-90%
- **OpenAI 兼容**: 两行代码即可切换到 Groq
- **全球部署**: 数据中心遍布全球,低延迟响应

## LPU 架构

Groq 的 LPU (Language Processing Unit) 是专门为 LLM 推理设计的芯片:

| 维度 | LPU | GPU |
|------|-----|-----|
| 设计目标 | 推理专用 | 通用计算 |
| 延迟 | 极低 | 中等 |
| 吞吐 | 高 | 高 |
| 成本 | 低 | 高 |
| 适用场景 | 推理部署 | 训练+推理 |

## 快速开始

```python
import openai
import os

client = openai.OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY")
)
```

## 支持的模型

- Llama 3.3 / 3.1 / 3
- Mixtral 8x7B
- Gemma 2
- Whisper (语音)

## 适用场景

| 场景 | 为什么选 Groq |
|------|-------------|
| 实时聊天 | 极低延迟,用户体验好 |
| 代码补全 | 毫秒级响应 |
| 批量处理 | 高吞吐+低成本 |
| 语音实时 | Whisper 模型低延迟 |

> **关联**: -> [[09_Deployment_Inference|部署推理]] | [[14_AI_Gateway|AI 网关]] | [[09_Deployment_Inference/LLM_Cost_Optimization|LLM 成本优化]]
