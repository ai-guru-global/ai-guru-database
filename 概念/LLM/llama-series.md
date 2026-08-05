---
title: LLaMA 系列模型架构演进
category: concepts
tags:
  - llm
  - llama
  - architecture
  - meta
  - open-source
  - transformer
aliases:
  - LLaMA Series
  - LLaMA 系列
  - LLaMA Architecture
relationships:
  - target: "概念/transformer-architecture"
    type: evolves_from
  - target: "概念/rope"
    type: uses
  - target: "概念/grouped-query-attention"
    type: uses
  - target: "概念/quantization"
    type: related_to
summary: LLaMA 是 Meta 开源的 Transformer Decoder 架构模型系列，从 LLaMA-1 到 LLaMA-3，在上下文长度、训练数据、安全对齐和多模态等方面持续演进，成为开源生态最重要的基座模型之一。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources: []
name_zh: "LLaMA 系列模型架构演进"
---

# LLaMA 系列模型架构演进

> 中文简称：LLaMA 系列模型架构演进

## 一句话总结

**LLaMA** 是 Meta 开源的 Decoder-only Transformer 系列模型，以其优秀的性能和开放的权重推动了开源 LLM 生态的爆发式发展。

---

## 架构共性

LLaMA 系列均采用以下设计：

| 组件 | 选择 |
|---|---|
| **架构** | Decoder-only Transformer |
| **位置编码** | RoPE（旋转位置编码）|
| **归一化** | Pre-Norm + RMSNorm |
| **激活函数** | SwiGLU |
| **注意力** | Multi-Head Attention / GQA |
| **Tokenizer** | BPE / SentencePiece |

---

## LLaMA-1（2023.02）

### 关键特点

- 参数规模：7B、13B、33B、65B
- 训练数据：约 1.4T token（公开数据集）
- 上下文长度：2K
- 位置编码：RoPE
- 未经过指令微调，主要作为基座模型

### 影响

- 证明了高质量数据 + 中等规模模型可以达到接近大模型的效果；
- 催生了 Alpaca、Vicuna 等大量微调变体。

---

## LLaMA-2（2023.07）

### 关键改进

| 方面 | 改进 |
|---|---|
| **参数规模** | 7B、13B、34B（codellama）、70B |
| **上下文长度** | 4K（基础版），LongLoRA 扩展到 32K |
| **训练数据** | 2T token，质量更高 |
| **分组查询注意力（GQA）** | 70B 使用 GQA 加速推理 |
| **对齐** | 发布 Chat 版本，经过 SFT + RLHF |
| **安全** | 更强的安全对齐和 red teaming |

### Code LLaMA

- 基于 LLaMA-2 在代码数据上进一步训练；
- 支持 7B/13B/34B；
- 具备代码补全、生成、推理能力。

---

## LLaMA-3（2024.04）

### 关键改进

| 方面 | 改进 |
|---|---|
| **参数规模** | 8B、70B、405B |
| **上下文长度** | 8K（基础），支持 128K |
| **训练数据** | 15T+ token，数据质量大幅提升 |
| **Tokenizer** | 128K 词表，多语言和代码效率更高 |
| **性能** | 同规模下显著超越 LLaMA-2 |
| **多模态** | LLaMA-3.2 支持图像输入 |

### 技术创新

- 更大、更干净的预训练数据；
- 更高效的 tokenizer；
- 改进的训练稳定性和 scaling law。

---

## 架构演进对比

| 特性 | LLaMA-1 | LLaMA-2 | LLaMA-3 |
|---|---|---|---|
| 最大参数 | 65B | 70B | 405B |
| 上下文 | 2K | 4K | 8K / 128K |
| 训练数据 | 1.4T | 2T | 15T+ |
| GQA | 否 | 70B 使用 | 广泛使用 |
| Chat 版本 | 无 | 有 | 有 |
| 词表大小 | 32K | 32K | 128K |

---

## 对开源生态的影响

- 大量衍生模型：Alpaca、Vicuna、WizardLM、Yi 早期版本等；
- 推动了量化、微调、推理优化工具的发展；
- 成为许多企业和研究者的首选开源基座。

---

## 延伸阅读

- [[概念/transformer-architecture|Transformer 架构]]
- [[概念/rope|RoPE]]
- [[概念/grouped-query-attention|GQA]]
- [[概念/long-context-llm|长上下文 LLM]]
- [[概念/quantization|模型量化]]

## See Also (深度专题)

- [[05_大模型/14_全球LLM生态/07_Meta_LLaMA_深入分析|Meta LLaMA 深度解析]] — LLaMA 系列架构演进、GQA 优化与开源生态影响

---

## 2026 LLaMA 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Llama 4** | MoE 架构，支持 10M Token 上下文 | GA |
| **Llama 3.3** | 70B 参数，性能接近 405B | GA |
| **Llama Guard** | 安全护栏模型，内容审核 | GA |
| **Code Llama** | 代码专用模型，支持 70+ 语言 | GA |
| **Llama Stack** | 官方部署框架，支持本地/云端 | GA |

## 生产最佳实践

1. **模型选择**：简单任务用 8B，复杂任务用 70B，极端场景用 405B
2. **量化部署**：生产环境用 AWQ/GPTQ 4-bit 量化，平衡质量与速度
3. **长上下文**：Llama 4 支持 10M Token，适合超长文档
4. **微调优化**：用 LoRA/QLoRA 微调适配特定领域
5. **开源优势**：完全开源，可本地部署，数据隐私有保障
6. **推理框架**：vLLM/SGLang/TensorRT-LLM 均支持 Llama 系列
7. **多语言支持**：Llama 3+ 支持 8+ 语言，中文能力显著提升

## Llama 系列演进

| 版本 | 发布时间 | 关键创新 |
|------|----------|----------|
| Llama 1 | 2023-02 | 开源 7B-65B，引发开源浪潮 |
| Llama 2 | 2023-07 | 商用许可，RLHF 对齐 |
| Llama 3 | 2024-04 | 8B/70B，性能大幅提升 |
| Llama 3.1 | 2024-07 | 405B，长上下文 128K |
| Llama 3.3 | 2024-12 | 70B 接近 405B 性能 |
| Llama 4 | 2025-04 | MoE 架构，10M 上下文 |

## 延伸阅读

- [[概念/LLM/qwen-series|Qwen 系列]]
- [[概念/LLM/gpt-series-evolution|GPT 系列演进]]
- [[概念/LLM/llama-series|Llama 家族完整指南]]

## 模型选择指南

| 场景 | 推荐模型 | 理由 |
|------|----------|------|
| 简单对话 | Llama 3.3 8B | 速度快，成本低 |
| 通用任务 | Llama 3.3 70B | 性能接近 405B |
| 超长文档 | Llama 4 Scout | 10M 上下文 |
| 代码生成 | Code Llama 70B | 代码专用优化 |
| 内容审核 | Llama Guard 3 | 安全护栏专用 |

## Llama 系列演进时间线

| 模型 | 发布 | 参数 | 上下文 | 关键突破 |
|------|------|------|--------|----------|
| **LLaMA 1** | 2023-02 | 7-65B | 4K | 开源标杆 |
| **LLaMA 2** | 2023-07 | 7-70B | 4K | 商用免费 + RLHF |
| **Llama 3** | 2024-04 | 8-70B | 8K | 质量飞跃 |
| **Llama 3.1** | 2024-07 | 8-405B | 128K | 405B 开源旗舰 |
| **Llama 3.3** | 2024-12 | 8-70B | 128K | 70B 接近 405B |
| **Llama 4** | 2025-04 | Scout/Maverick | 10M | MoE + 超长上下文 |

## 延伸阅读

- [[概念/LLM/qwen-series|Qwen 系列]] — 中文最强开源
- [[概念/LLM/gpt-series-evolution|GPT 系列]] — 闭源标杆
- [[概念/LLM/llm-architectures|LLM 架构]] — MoE 架构详解
- [[概念/LLM/llama-cpp|llama.cpp]] — Llama 本地推理
