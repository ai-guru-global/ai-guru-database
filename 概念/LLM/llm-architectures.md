---
title: LLM架构
category: -concepts
tags: [nlp, llm, gpt, bert, moe, transformer-architecture]
relationships:
  - target: "[[概念/transformer-architecture]]"
    type: built_on
  - target: "概念/fine-tuning-techniques"
    type: related_to
  - target: "概念/reasoning-models"
    type: related_to
sources: [05_大模型/04_LLM架构/LLM_Architectures.md]
summary: 大语言模型（LLM）架构基于Transformer发展出三大范式：Encoder-only（BERT）、Decoder-only（GPT/LLaMA）和Encoder-Decoder（T5）。2026年主流趋势为Decoder-only + MoE架构，推理模型和Agent原生设计成为标配。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.78
lifecycle: reviewed
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-07-21
aliases:
  - "Llm Architectures"
  - "llm architectures"

name_zh: "LLM架构"
---
# LLM架构

> 中文简称：LLM架构

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

## 架构选型指南

| 场景 | 推荐架构 | 理由 |
|------|----------|------|
| 通用对话/推理 | Dense Decoder-only | 最成熟，生态最广 |
| 成本敏感/大规模服务 | MoE | 激活参数少，推理成本低 |
| 超长上下文 (>1M) | Dense + 稀疏注意力 | 线性复杂度 |
| 端侧/嵌入式 | 小型 Dense (1-7B) | 简单、易量化 |
| 多模态 | Decoder + 编码器 | 统一架构处理多模态 |
| 时序/基因组 | SSM (Mamba) | 线性复杂度，显存恒定 |

## 生产最佳实践

1. **架构跟随场景**: 不要追求最新架构，选择生态最成熟的
2. **MoE 考虑服务成本**: MoE 推理便宜但训练贵，权衡总拥有成本
3. **上下文窗口规划**: 根据实际业务需要选择，不要盲目追求最长
4. **量化兼容性**: 确认架构支持 INT8/INT4/FP8 量化
5. **推理引擎支持**: 确认 vLLM/TGI/TensorRT-LLM 支持目标架构
6. **混合架构评估**: Mamba+Attention 混合方案值得测试
7. **长期维护**: 选择社区活跃、文档完善的架构

## 2026 架构演进趋势

| 趋势 | 说明 | 代表 |
|------|------|------|
| **MoE 主流化** | 激活参数 << 总参数，推理成本降 5-10x | DeepSeek-V3, Qwen3 |
| **MLA 普及** | KV Cache 压缩 10x+，长上下文更实用 | DeepSeek-V3 |
| **混合架构** | SSM + Attention 交替，兼顾速度+质量 | Jamba, Hymba |
| **原生多模态** | 统一架构处理文本/图像/音频/视频 | Gemini 3, GPT-5 |
| **超长上下文** | 1M-10M token 成为标配 | Llama 4, Gemini 3 |
| **推理内化** | Thinking/Reasoning 模式内置 | o3, DeepSeek-R1 |

## 架构选型决策树

```
需要最强通用能力？
├── 是 → Dense Transformer (GPT-5/Claude/Llama 4)
└── 否 → 需要低成本推理？
    ├── 是 → MoE (DeepSeek-V3/Qwen3-MoE)
    └── 否 → 需要超长序列 (>100K)？
        ├── 是 → 混合架构 (Jamba) / MLA (DeepSeek)
        └── 否 → 需要端侧部署？
            ├── 是 → 小型 Dense (1-7B) + 量化
            └── 否 → 标准 Dense Transformer
```

## 延伸阅读

- [[概念/LLM/transformer-architecture-plain|Transformer 大白话]]
- [[概念/LLM/transformer-architecture|Transformer 架构详解]]
- [[概念/LLM/attention-variants|注意力变体]]
- [[概念/LLM/grouped-query-attention|GQA]]
- [[概念/LLM/multi-head-latent-attention|MLA]]
- [[概念/LLM/mamba|Mamba (SSM)]]
- [[概念/LLM/foundation-model|基础模型]]
- [[05_大模型/01_LLM基础/05_LLM_基础|大语言模型基础速成]]
- [[05_大模型/09_多模态模型/06_多模态_架构_2026|多模态架构 2026]]

## 主流架构参数对比

| 架构 | 代表模型 | 参数 | 激活参数 | 上下文 | 推理成本 |
|------|---------|:----:|:-------:|:------:|:--------:|
| Dense Decoder | Llama 4 405B | 405B | 405B | 10M | 高 |
| MoE Decoder | DeepSeek-V3 | 671B | 37B | 128K | 低 |
| MoE Decoder | Qwen3-235B | 235B | 22B | 128K | 低 |
| SSM 混合 | Jamba 1.5 | 52B | 12B | 256K | 中 |
| Dense + MLA | DeepSeek-V3 | 671B | 37B | 128K | 低 |
| 小型 Dense | Qwen3-8B | 8B | 8B | 128K | 极低 |

## 架构与推理引擎兼容性

| 架构 | vLLM | TGI | TRT-LLM | SGLang | llama.cpp |
|------|:----:|:---:|:-------:|:------:|:---------:|
| Dense Transformer | ✅ | ✅ | ✅ | ✅ | ✅ |
| MoE | ✅ | ✅ | ✅ | ✅ | 部分 |
| MLA | ✅ | 部分 | ✅ | ✅ | ❌ |
| Mamba/SSM | 实验 | ❌ | 部分 | ❌ | ❌ |
| 多模态 | ✅ | ✅ | ✅ | ✅ | 部分 |

## 架构发展时间线

| 年份 | 里程碑 | 意义 |
|:----:|---------|------|
| 2017 | Transformer (Attention Is All You Need) | 奠基之作 |
| 2018 | GPT-1 / BERT | 预训练范式确立 |
| 2020 | GPT-3 (175B) | 规模涌现能力 |
| 2022 | ChatGPT / InstructGPT | RLHF 对齐 |
| 2023 | MoE 普及 / Mamba | 效率革命 |
| 2024 | MLA / 混合架构 / 推理模型 | 长上下文+推理 |
| 2025 | 原生多模态 / 10M 上下文 | 能力融合 |
| 2026 | MoE+MLA 成为标配 | 效率+质量平衡 |

## 延伸阅读

- [[概念/LLM/transformer-architecture|Transformer 架构]] — 架构基础
- [[概念/LLM/grouped-query-attention|GQA]] — 注意力压缩
- [[概念/LLM/mamba|Mamba]] — SSM 替代架构
- [[概念/LLM/llm-inference-engine|推理引擎]] — 架构与引擎兼容性
