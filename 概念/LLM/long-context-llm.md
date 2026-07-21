---
title: 长上下文 LLM：训练与推理
category: concepts
tags:
  - llm
  - long-context
  - training
  - inference
  - rope
  - alibi
  - kv-cache
  - positional-encoding
aliases:
  - Long Context LLM
  - 长上下文
  - Long Context Training
  - Long Context Inference
relationships:
  - target: "概念/rope"
    type: uses
  - target: "概念/alibi"
    type: uses
  - target: "概念/kv-cache"
    type: challenges
  - target: "概念/attention-variants"
    type: related_to
summary: 长上下文 LLM 面临 Attention 复杂度平方增长、KV Cache 显存爆炸、位置编码外推等挑战。本文覆盖长文本训练、上下文窗口扩展、推理优化等核心技术与实践。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources: []
---

# 长上下文 LLM：训练与推理

## 一句话总结

长上下文 LLM 需要解决 **Attention 计算复杂度平方增长**、**KV Cache 显存爆炸** 和 **位置编码外推** 三大核心挑战。

---

## 为什么长上下文重要？

| 应用场景 | 所需上下文长度 |
|---|---|
| 长文档问答 | 4K ~ 128K |
| 代码仓库理解 | 8K ~ 200K |
| 多轮对话 | 4K ~ 32K |
| 法律/医疗文档分析 | 32K ~ 1M |
| 视频/多模态理解 | 100K+ |

---

## 核心挑战

### 1. Attention 复杂度

标准 Self-Attention 的时间/空间复杂度都是 `O(n²)`：

```
复杂度 ∝ seq_len² × d
```

当序列从 4K 扩展到 128K 时，计算量增加约 **1000 倍**。

### 2. KV Cache 显存爆炸

KV Cache 大小：

```
KV Cache = 2 × layers × hidden_dim × batch_size × seq_len × bytes
```

128K 上下文下，KV Cache 可能超过模型权重本身的显存占用。

### 3. 位置编码外推

训练时通常只用较短序列（如 4K），推理时需要外推到更长序列（如 128K），这要求位置编码具备良好的外推能力。

---

## 长文本训练方法

### 1. 直接长序列训练

- 使用更长的训练数据；
- 需要更多显存和计算资源；
- 配合序列并行（Sequence Parallelism）。

### 2. 渐进式扩展

```
4K → 8K → 16K → 32K → 128K
```

每一步使用上一阶段模型作为初始化，逐步适应更长上下文。

### 3. 位置编码插值（Position Interpolation）

将 RoPE 的旋转角度缩小，让模型适应更长位置：

```
θ'_i = θ_i / s
```

其中 `s` 是扩展倍数。例如 LLaMA-2 4K → 8K，设 `s=2`。

### 4. NTK-aware 扩展

更精细地调整 RoPE 频率，避免高频信息丢失：

- 保留高频分量（短距离关系）；
- 扩展低频分量（长距离关系）。

### 5. YaRN / Dynamic NTK

进一步改进的 RoPE 扩展方法，在多个长上下文模型中使用。

---

## 长上下文推理优化

| 优化方向 | 技术 | 效果 |
|---|---|---|
| **减少 KV Cache** | GQA / MQA / MLA | 降低 KV Cache 头维度 |
| **压缩 KV Cache** | 量化（KV Cache INT8/FP8）| 减少显存占用 |
| **高效 Attention** | FlashAttention-2、Ring Attention | 降低计算和内存开销 |
| **上下文剪枝** | H2O、StreamingLLM | 只保留重要 token 的 KV |
| **稀疏 Attention** | Longformer、BigBird、Sparse Transformer | 降低 Attention 复杂度 |
| **系统优化** | PagedAttention、Offloading | 更高效管理显存 |

---

## 主流长上下文模型

| 模型 | 上下文长度 | 关键技术 |
|---|---|---|
| **GPT-4 Turbo** | 128K | 未知 |
| **Claude 3** | 200K | 未知 |
| **Gemini 1.5 Pro** | 1M+ | 未知 |
| **LLaMA-2 Long** | 32K / 64K | RoPE 插值 |
| **Yi-34B-200K** | 200K | 渐进训练 + 优化 |
| **Qwen2** | 128K | RoPE / NTK |
| **DeepSeek-V2** | 128K | MLA 压缩 KV Cache |

---

## 实践建议

### 训练

1. 先用短文本预训练，再逐步扩展上下文；
2. 长上下文数据配比要合理，避免灾难性遗忘；
3. 使用 FlashAttention 和序列并行；
4. 学习率通常比短文本训练更低。

### 推理

1. 优先使用 GQA/MLA 模型降低 KV Cache；
2. 长 prompt 场景关注 TTFT；
3. 长输出场景关注 KV Cache 显存；
4. 考虑 KV Cache 量化和上下文压缩。

---

## 延伸阅读

- [[概念/rope|RoPE]]
- [[概念/alibi|ALiBi]]
- [[概念/kv-cache|KV Cache]]
- [[概念/flash-attention-kernels|FlashAttention]]
- [[概念/attention-variants|Attention 变体]]
- [[概念/paged-attention|PagedAttention]]

---

## 2026 长上下文生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Gemini 2M Token** | 原生支持 2M Token 上下文 | GA |
| **Llama 4 10M Token** | MoE 架构支持 10M Token | GA |
| **YaRN 扩展** | RoPE + YaRN 支持 128K-1M | GA |
| **Ring Attention** | 分布式注意力，支持超长序列 | GA |
| **KV Cache 压缩** | GQA/MLA 减少 KV Cache 内存 | GA |

## 生产最佳实践

1. **按需选择长度**：不要盲目追求长上下文，根据任务选择合适长度
2. **KV Cache 优化**：长上下文必须优化 KV Cache，用 GQA/MLA
3. **分块处理**：超长文档考虑分块处理，避免单次请求过长
4. **成本意识**：长上下文 Token 消耗大，必须监控成本
5. **位置编码选择**：长上下文模型优先选择 RoPE + YaRN
