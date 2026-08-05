---
title: "Kimi K3 技术报告"
category: "05-nlp-llms-kimi-k3-technical-report"
tags: ["kimi", "k3", "moonshot", "moe", "linear-attention", "kda", "multimodal", "agent"]
summary: "Kimi K3 是月之暗面 2026年7月发布的全球首个 2.8 万亿参数开源原生多模态 MoE 大模型，支持 1M 上下文。本目录包含其技术报告的完整深度解析。"
created: "2026-08-03"
updated: "2026-08-03"
tier: supporting
sources: ["https://github.com/MoonshotAI/Kimi-K3"]

name_zh: "Kimi K3 技术报告"
---
# Kimi K3 技术报告

> 中文简称：Kimi K3 技术报告

## 目录文件

| 文件 | 说明 |
|------|------|
| [[00_Kimi_K3_分析]] | Kimi K3 技术报告深度解析（主文档）— 覆盖架构、训练、推理、Benchmark 等全部技术要点 |

## 概述

Kimi K3 是月之暗面（Moonshot AI）于 2026 年 7 月 27 日发布的旗舰开源模型，核心参数：

- **2.8 万亿总参数**，1040 亿激活参数
- **MoE 架构**：896 个路由专家 + 2 个共享专家，每 Token 激活 16 个
- **KDA 混合线性注意力** + Gated MLA，3:1 比例混合，96 注意力头
- **1,048,576 Token 上下文窗口**（1M）
- **原生多模态**：MoonViT-V2 视觉编码器（401M 参数）
- **量化**：MXFP4 权重 / MXFP8 激活 (QAT)
- **Code Arena 全球第一**（1679 Elo），首个登顶的开源模型
- **缩放效率较 K2 提升 2.5 倍**

完整模型权重、47 页技术报告、三项 Infra 代码（MoonEP、FlashKDA、AgentENV）已同步开源。

## 延伸阅读

- [[05_大模型/14_中国LLM生态/13_Kimi_Moonshot_深入分析]] — Kimi K2 及 Moonshot AI 全系列分析
- [[05_大模型/14_中国LLM生态/README]] — 中国大模型生态全景

---

*Last updated: 2026-08-03*
