---
title: DeepSeek 系列模型架构演进
category: concepts
tags:
  - llm
  - deepseek
  - architecture
  - moe
  - mla
  - reasoning
  - open-source
aliases:
  - DeepSeek Series
  - DeepSeek 系列
  - DeepSeek Architecture
relationships:
  - target: "_concepts/transformer-architecture"
    type: evolves_from
  - target: "_concepts/mixture-of-experts"
    type: uses
  - target: "_concepts/multi-head-latent-attention"
    type: uses
  - target: "_concepts/grpo"
    type: uses
summary: DeepSeek 系列以高性价比训练和高性能推理著称，从 DeepSeek-V2 的 MLA 压缩到 DeepSeek-V3 的 MoE 架构，再到 R1 的推理强化学习，代表了开源模型在效率和性能上的前沿探索。
lifecycle: stable
tier: core
created: 2026-06-25
updated: 2026-06-25
---

# DeepSeek 系列模型架构演进

## 一句话总结

**DeepSeek** 系列以**高效训练**和**高性能推理**为核心优势，通过 MLA、MoE、GRPO 等技术创新，在开源社区中实现了接近甚至超越闭源模型的性能。

---

## 架构特点

| 组件 | 选择 |
|---|---|
| **架构** | Decoder-only Transformer |
| **位置编码** | RoPE / Yarn 扩展 |
| **注意力** | Multi-Head Latent Attention（MLA）|
| **前馈网络** | MoE（Mixture of Experts）|
| **归一化** | RMSNorm |
| **对齐** | SFT + RLHF/GRPO |

---

## DeepSeek-V2（2024）

### 核心创新：MLA

**Multi-Head Latent Attention（MLA）** 是 DeepSeek-V2 最重要的创新：

- 将 KV Cache 压缩为低秩 latent 向量；
- 相比标准 MHA 大幅减少 KV Cache 显存占用；
- 在长上下文推理中优势显著。

### 关键参数

| 特性 | 数值 |
|---|---|
| 总参数 | 236B |
| 激活参数 | 21B |
| 上下文长度 | 128K |
| 训练成本 | 显著低于同性能模型 |

---

## DeepSeek-V3（2024）

### 核心创新

| 方面 | 改进 |
|---|---|
| **MoE 架构** | 总参数 671B，激活参数 37B |
| **Auxiliary-Loss-Free Load Balancing** | 无需辅助损失的负载均衡 |
| **FP8 训练** | 大规模 FP8 混合精度训练 |
| **Multi-Token Prediction** | 一次预测多个 token，提升训练效率 |
| **性能** | 接近 GPT-4o / Claude-3.5 Sonnet |

### 效率优势

- 训练成本约为同性能闭源模型的 1/10；
- 推理时只激活少量专家，效率高。

---

## DeepSeek-R1（2025）

### 核心特点

- 专注**推理能力**的模型；
- 使用 **GRPO（Group Relative Policy Optimization）** 进行强化学习；
- 在数学、代码、逻辑推理任务上表现突出；
- 完全开源训练技术报告。

### 训练流程

```
Base Model → Cold Start SFT → GRPO Reasoning RL → Rejection Sampling → General RL
```

### 影响

- 证明了纯 RL 可以激发模型的推理能力；
- 催生了大量 R1 风格的蒸馏小模型。

---

## 架构演进对比

| 特性 | DeepSeek-V2 | DeepSeek-V3 | DeepSeek-R1 |
|---|---|---|---|
| 总参数 | 236B | 671B | 基于 V3 |
| 激活参数 | 21B | 37B | 37B |
| 上下文 | 128K | 128K | 128K |
| 核心创新 | MLA | MoE + FP8 | GRPO 推理 |
| 定位 | 通用模型 | 通用模型 | 推理模型 |

---

## 对开源社区的影响

- 证明了 MoE + 高效训练可以实现极高性价比；
- MLA 成为长上下文推理的重要方向；
- GRPO 成为 RLHF 的重要替代方案；
- 推动了 FP8 训练生态的成熟。

---

## 延伸阅读

- [[_concepts/multi-head-latent-attention|MLA]]
- [[_concepts/mixture-of-experts|MoE]]
- [[_concepts/grpo|GRPO]]
- [[_concepts/mixed-precision|混合精度训练]]
- [[_concepts/long-context-llm|长上下文 LLM]]
