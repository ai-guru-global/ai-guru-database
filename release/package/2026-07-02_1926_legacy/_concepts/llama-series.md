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
  - target: "_concepts/transformer-architecture"
    type: evolves_from
  - target: "_concepts/rope"
    type: uses
  - target: "_concepts/grouped-query-attention"
    type: uses
  - target: "_concepts/quantization"
    type: related_to
summary: LLaMA 是 Meta 开源的 Transformer Decoder 架构模型系列，从 LLaMA-1 到 LLaMA-3，在上下文长度、训练数据、安全对齐和多模态等方面持续演进，成为开源生态最重要的基座模型之一。
lifecycle: stable
tier: core
created: 2026-06-25
updated: 2026-06-25
---

# LLaMA 系列模型架构演进

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

- [[_concepts/transformer-architecture|Transformer 架构]]
- [[_concepts/rope|RoPE]]
- [[_concepts/grouped-query-attention|GQA]]
- [[_concepts/long-context-llm|长上下文 LLM]]
- [[_concepts/quantization|模型量化]]
