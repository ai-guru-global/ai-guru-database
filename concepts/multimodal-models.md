---
title: 多模态模型
category: concepts
tags: [nlp, multimodal-vision, vision-language, video, diffusion]
relationships:
  - target: "[[concepts/transformer-architecture]]"
    type: built_on
  - target: "concepts/llm-architectures"
    type: extends
  - target: "concepts/long-context-models"
    type: related_to
sources: [04_NLP_LLMs/Multimodal_world-models-jepa/Multimodal_llm-architectures_2026.md]
summary: 多模态模型从CLIP时代的图文对齐，发展到2026年的原生多模态统一架构。三大范式为模块化（LLaVA）、统一（GPT-4V/Claude）和原生多模态（GPT-4o/Gemini 2），支持文本、图像、音频、视频的无缝理解和生成。
provenance:
  extracted: 0.80
  inferred: 0.12
  ambiguous: 0.08
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# 多模态模型

## 概述

多模态AI从2020年CLIP的双编码器对比学习，发展到2026年GPT-4o的原生多模态统一架构。核心趋势：从"文本+视觉适配器"的后期拼接，转向所有模态在统一Token空间中早期融合的端到端训练。

## 三种架构范式

### 模块化（LLaVA风格）

冻结视觉编码器（ViT），通过投影层（linear-algebra/Q-Former）将视觉特征映射到语言模型空间。训练成本低，适合资源受限场景。代表：LLaVA、MiniGPT-4、Qwen-VL。

### 统一（GPT-4V/Claude风格）

统一编码器处理所有模态，端到端训练。模态融合更深，理解能力更强。代表：GPT-4V、Gemini 1.5、Claude 3。

### 原生多模态（GPT-4o/Gemini 2风格）

统一Token空间，所有模态共享同一组 Transformer 注意力参数。任何模态可作为输入或输出，模态间无缝转换。代表：GPT-4o、Gemini 2.0、Chameleon。

## 视觉-语言融合技术

### 视觉编码器

从ViT-L/14（304M参数）到InternViT-6B（6B参数），分辨率支持从224×224到448×448。SigLIP-SO400M支持多语言图文对齐，AIMV2使用自监督预训练。

### 对齐机制

1. **Linear Projection**：最简单，LLaVA-1.5采用
2. **Q-Former/Perceiver**：压缩视觉信息，BLIP-2使用
3. **Adapter Layers**：灵活适配，LLaMA-Adapter使用
4. **Deep Fusion**：最深度的跨模态理解，GPT-4o采用

### 位置编码策略

2D-RoPE（Qwen2.5-VL）保留空间关系，动态分辨率支持任意尺寸输入。

## 视频理解架构

### 三种范式

| 范式 | 方法 | 代表 | 局限 |
|------|------|------|------|
| 帧采样 | 独立编码每帧 | Video-LLaVA | 丢失时序信息 |
| 视频Transformer | 管状嵌入+时空注意力 | TimeSformer | 计算量大 |
| Token压缩 | 快速Tokenizer+压缩 | Gemini 1.5 | 需专门编码器 |

### 时序建模

从简单的均值池化到时序transformer-architecture、时序Q-Former（用可学习查询token压缩时序信息），再到3D稀疏注意力（空间和时间分离计算）。

## 多模态生成

### 统一生成架构

所有模态统一编码为Token，通过统一Transformer处理后，根据输出模态选择对应Head（文本Softmax / 图像Diffusion / 音频Vocoder）。

### 文本到图像

Stable Diffusion 3.5（Flow Matching）、DALL-E 3（Diffusion）、Flux Pro（2048×2048分辨率）。

### 文本到视频

Sora（DiT，60秒1080p）、Veo 3、Kling 2.0（DiT，2分钟1080p）、CogVideoX（开源）。

### Any-to-Any

Chameleon/Show-o风格：统一VQ-VAE编码器+统一Transformer，支持任意模态间转换（文字→图像、图像→文字、音频→图像等）。^[inferred]

## 训练策略

三阶段流程：
1. **预训练**：图文对比学习/前缀语言建模，数亿样本
2. **指令微调**：多模态指令数据，数万样本
3. **对齐**：DPO/RLHF/Constitutional AI，符合人类价值观

## 评估基准

| 基准 | 评估能力 | 2026 SOTA |
|------|---------|-----------|
| MMMU | 大学级多学科推理 | 82.3%（GPT-4.5） |
| MathVista | 数学图表推理 | 76.8%（GPT-4.5） |
| Video-MME | 视频理解 | 71.5% |
| POPE | 幻觉评估 | 低幻觉率 |

## 推理优化

KV Cache优化（2-3×）、Speculative Decoding（2-3×）、INT8/INT4量化（2-4×）、FlashAttention-3（1.5-2×）。边缘部署方案包括MobileVLM（3B，手机实时）和Moondream（1.6B）。

## 2027技术预测

- 原生视频模型：视频作为第一公民
- 多模态Agent：能看、能听、能操作
- 世界模型：理解物理世界
- 具身智能：机器人与多模态模型融合

## 关联主题

- Transformer架构：多模态模型的统一架构基础
- LLM架构：多模态模型中的语言模型骨干
- 长上下文模型：长视频理解依赖超长上下文

## Related

- [[concepts/generative-vision-models.md|generative-vision-models]]
- [[concepts/llm-architectures.md|llm-architectures]]
- [[concepts/transformer-architecture.md|transformer-architecture]]
- [[04_NLP_LLMs/Fine_tuning_Techniques/Axolotl_Deep_Dive.md|Axolotl_Deep_Dive]]
- [[04_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques.md|Fine_tuning_Techniques]]
