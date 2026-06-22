---
title: LLM架构
category: -concepts
tags: [nlp, llm, gpt, bert, moe, transformer-architecture]
relationships:
  - target: "[[_concepts/transformer-architecture]]"
    type: built_on
  - target: "_concepts/fine-tuning-techniques"
    type: related_to
  - target: "_concepts/reasoning-models"
    type: related_to
sources: [05_NLP_LLMs/LLM_Architectures/LLM_Architectures.md]
summary: 大语言模型（LLM）架构基于Transformer发展出三大范式：Encoder-only（BERT）、Decoder-only（GPT/LLaMA）和Encoder-Decoder（T5）。2026年主流趋势为Decoder-only + MoE架构，推理模型和Agent原生设计成为标配。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.78
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# LLM架构

## 概述

大语言模型（Large Language world-models-jepa, LLMs）是参数量在数十亿到数千亿级别的预训练语言模型。自2018年BERT和GPT问世以来，基于 Transformer 的LLM经历了爆发式发展。

## 三大架构范式

| 范式 | 注意力模式 | 训练目标 | 代表模型 |
|------|----------|---------|---------|
| Encoder-only | 双向 | Masked LM | BERT, RoBERTa |
| Decoder-only | 单向（Causal） | 因果语言建模 | GPT, LLaMA, PaLM |
| Encoder-Decoder | 双向+单向 | Span Corruption | T5, BART |

Decoder-only已成为绝对主流，原因：架构简单易扩展、预训练数据丰富、少样本学习能力强、推理优化成熟。

## Decoder-only架构

训练目标为因果语言建模——给定序列$x_1, ..., x_T$，最大化：

$$\mathcal{L} = -\sum_{t=1}^{T} \log P(x_t | x_1, ..., x_{t-1}; \theta)$$

核心特征：Causal Mask使位置i只能看到位置≤i的内容；自回归生成逐个token输出。

## 混合专家模型（MoE）

将Feed-Forward层替换为多个"专家"网络，每次只激活其中少数几个（Top-K），实现**参数规模↑但计算量→不变**。

路由机制：Router网络计算每个专家的得分，选择Top-K个专家加权求和。Expert Choice路由（专家选token）可避免负载不均衡。

| 优点 | 缺点 |
|------|------|
| 参数量可达Dense模型10× | 通信开销大 |
| 推理吞吐量高（激活参数少） | 显存占用仍高 |
| 不同专家学习不同领域知识 | 训练不稳定 |

2026年主流开源模型均采用MoE：DeepSeek-V3.2（671B/37B激活）、Kimi K2（1T/32B激活）、Llama 4 Maverick（400B/17B激活）。

## long-context-models Laws

DeepMind（2022）发现给定计算预算，模型参数量和训练数据量应同步增长：

$$N_{opt} \approx 0.5 \times C^{0.5}, \quad D_{opt} \approx 10 \times C^{0.5}$$

损失预测：$L(N, D) = A \cdot N^{-\alpha} + B \cdot D^{-\beta} + L_{\infty}$（$\alpha \approx 0.076, \beta \approx 0.103$）

实际意义：可预测不同配置的最终性能，指导计算资源分配。

## 上下文窗口扩展技术

| 方法 | 原理 | 代表模型 |
|------|------|----------|
| 线性插值 | 将位置缩放到训练范围 | — |
| NTK-Aware Scaling | 修改RoPE频率基数 | Code Llama |
| YaRN | 动态插值+高频截断 | — |
| ALiBi | 线性位置偏置，天然外推 | BLOOM |
| Sliding Window | 只关注最近W个token | Mistral |

## Grouped-Query Attention（GQA）

MHA每头独立KV（精度高但内存大），MQA所有头共享一组KV（省内存但损失精度），GQA是折衷——头分组，组内共享KV。LLaMA-2配置：32头分8组。

## 2026年模型对比

| 模型 | 参数量 | 架构 | 上下文 | 特色 |
|------|--------|------|--------|------|
| GPT-5.2 Pro | ~2T(MoE) | Decoder-only | 200K | Dynamic Reasoning |
| multimodal-models 4.5 Opus | 未公开 | Decoder-only | 1M | Hybrid reasoning-models |
| Llama 4 Scout | 109B | Dense | **10M** | Ultra-Long Context |
| DeepSeek-V3.2 | 671B(MoE) | MoE | 256K | FP8训练 |
| Qwen 3 72B | 72B | Dense | 128K | 多语言优化 |

## 显存估算

训练（Adam优化器）：$\approx 16N + \text{Activations}$（70B模型需约1.76TB → 8×A100 80GB）

推理：模型参数 + KV Cache。70B模型BF16推理需约145GB → 2×A100 80GB。

优化技巧：梯度检查点（激活值降5-10×）、ZeRO（跨GPU分割状态）、8-bit Adam。

## 关联主题

- Transformer架构：LLM的底层架构
- 微调技术：LoRA/QLoRA/rlhf对齐方法
- 推理模型：LLM从"直觉型"到"思考型"的进化

## Related

- [[05_NLP_LLMs/Fine_tuning_Techniques/PEFT_2026/README]] — PEFT 2026 (参数高效微调) (共享: bert, gpt, llm, nlp)
- [[05_NLP_LLMs/Fine_tuning_Techniques/README]] — 微调技术 (Fine-tuning Techniques) (共享: bert, gpt, llm, nlp)
- [[05_NLP_LLMs/LLM_Architectures/LLM-Basics-in-nutshell]] — 大语言模型基础速成指南 (共享: bert, gpt, llm, nlp)
- [[05_NLP_LLMs/Multimodal_Models/Multimodal_Architectures_2026]] — 多模态模型架构 2026：从 GPT-4V 到原生多模态 AGI (共享: bert, gpt, llm, nlp)
