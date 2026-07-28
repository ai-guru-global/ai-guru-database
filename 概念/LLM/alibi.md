---
title: ALiBi（Attention with Linear Biases）
category: concepts
tags:
  - llm
  - transformer
  - position-encoding
  - alibi
  - long-context
  - extrapolation
aliases:
  - ALiBi
  - Attention with Linear Biases
  - 线性偏置注意力
relationships:
  - target: "概念/rope"
    type: contrasted_with
  - target: "概念/transformer-architecture"
    type: part_of
summary: ALiBi 是一种无需显式位置编码的位置编码方案，通过给注意力分数添加与距离成正比的负偏置，让模型天然具备外推长序列的能力。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-07-21
sources: []
name_zh: "线性偏置注意力"
---

# ALiBi（Attention with Linear Biases）

> 中文简称：线性偏置注意力

## 一句话总结

ALiBi 通过给 Attention 分数加上**与 token 距离成正比的负偏置**来引入位置信息，无需学习位置嵌入即可实现良好的长序列外推。

---

## 核心思想

传统位置编码（如正弦编码、RoPE）需要为每个位置生成位置向量。ALiBi 则更简单：

> 离得越远的 token，对当前 token 的注意力分数惩罚越大。

这符合直觉：邻近词通常比远距词更重要。

---

## 数学定义

标准 Attention 分数为：

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V
```

ALiBi 修改为：

```
ALiBi-Attention(Q, K, V) = softmax((QK^T + m · [-1, -2, ..., -(n-1)]) / sqrt(d_k)) V
```

其中：

- `m` 是每个注意力头不同的斜率参数（可学习或预设）；
- `[-1, -2, ..., -(n-1)]` 表示当前 token 与之前 token 的距离；
- 距离越远，偏置越负，softmax 后的权重越小。

---

## ALiBi vs RoPE vs 正弦编码

| 特性 | 正弦位置编码 | RoPE | ALiBi |
|---|---|---|---|
| 是否需要位置嵌入 | ✅ 是 | ✅ 是（旋转矩阵）| ❌ 否 |
| 外推能力 | 弱 | 中等（需插值/NTK）| 强 |
| 实现复杂度 | 中 | 中 | 低 |
| 长上下文表现 | 差 | 较好 | 好 |
| 代表模型 | 原始 Transformer | LLaMA、Qwen、ChatGLM | MPT、BLOOM |

---

## 优点

| 优点 | 说明 |
|---|---|
| **外推能力强** | 训练时用的序列较短，推理时可直接处理更长序列 |
| **实现简单** | 只需在 Attention 分数上加一个偏置矩阵 |
| **无需位置嵌入** | 减少参数和计算 |
| **训练更稳定** | 减少了位置编码带来的优化难度 |

---

## 缺点

| 缺点 | 说明 |
|---|---|
| **远距离信息衰减过快** | 线性惩罚可能过度抑制长距离依赖 |
| **不是主流选择** | 目前 RoPE 在开源模型中更常见 |
| **对局部性假设强** | 某些任务需要远距离依赖，ALiBi 可能不利 |

---

## 适用场景

| 场景 | 原因 |
|---|---|
| **长上下文模型** | 外推能力强，适合 100K+ token 场景 |
| **训练数据序列较短** | 训练成本低，推理时可处理长序列 |
| **需要简化实现的场景** | 不需要复杂的位置编码逻辑 |

---

## 代表模型

- **MPT**（MosaicML）：使用 ALiBi 实现 8K、65K 甚至更长上下文。
- **BLOOM**：大模型多语言模型，采用 ALiBi。

---

## 与 RoPE 的互补思路

近年来也出现了一些结合方案：

- **xPos**：改进 RoPE 的外推能力。
- **NTK-aware RoPE**：通过调整频率实现更好的长序列外推。
- **YaRN**：进一步扩展 RoPE 的上下文窗口。

ALiBi 的核心优势在于**简单且外推稳定**，但在现代开源生态中 RoPE 及其变体仍占主导。

---

## 延伸阅读

- [[概念/rope|RoPE 旋转位置编码]]
- [[概念/transformer-architecture|Transformer 架构]]
- [[概念/attention-variants|Attention 变体]]
- [[概念/kv-cache|KV Cache]]

---

## 2026 位置编码生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **RoPE + YaRN** | 旋转位置编码 + NTK 扩展，支持 128K-1M 上下文 | GA |
| **ALiBi** | 线性偏置，零参数外推，BLOOM/MPT 采用 | GA |
| **NTK-aware RoPE** | 调整频率基数实现长序列外推 | GA |
| **xPos** | 改进 RoPE 的外推能力 | 研究 |
| **NoPE** | 无位置编码，依赖因果注意力隐式位置信息 | 研究 |

## 生产最佳实践

1. **主流用 RoPE**：新模型优先选择 RoPE + YaRN，生态支持最完善
2. **长上下文用 YaRN**：需要 128K+ 上下文时启用 YaRN 扩展
3. **ALiBi 适合外推**：需要零训练外推到更长序列时考虑 ALiBi
4. **与 KV Cache 配合**：位置编码影响 KV Cache 复用策略，前缀缓存需位置编码兼容
5. **模型选型关注**：选择模型时关注其位置编码方案对上下文长度的支持

## 位置编码方案对比

| 方案 | 参数开销 | 外推能力 | 代表模型 | 生态支持 |
|------|---------|---------|---------|----------|
| **绝对位置 (Sinusoidal)** | 无 | 差 | 原始 Transformer | 淘汰 |
| **可学习位置** | O(max_len) | 无 | BERT, GPT-2 | 淘汰 |
| **RoPE** | 无 | 中（需扩展） | Llama, Qwen, Mistral | 主流 |
| **RoPE + YaRN** | 无 | 强 (128K-1M) | Llama 4, Qwen3 | 主流 |
| **ALiBi** | 无 | 强（零训练） | BLOOM, MPT | 小众 |
| **MLA 位置** | 低 | 强 | DeepSeek-V3 | 增长 |

## ALiBi 工作原理

```
标准 Attention:  score(i,j) = Q_i · K_j
ALiBi:           score(i,j) = Q_i · K_j - m × |i - j|

其中 m 是每个注意力头的固定斜率:
  m_h = 1 / 2^(8h/H)   (h=头索引, H=总头数)

效果: 距离越远的 Token 注意力分数越低，无需学习位置参数
优势: 训练 1K 长度 → 推理可外推到 16K+
```

## 位置编码选型决策树

```
需要超长上下文 (128K+)?
├── 是 → RoPE + YaRN / MLA
│       └── 需要零训练外推? → ALiBi
└── 否 → 标准 RoPE (生态最好)

注意: 2026 年 ALiBi 已较少被新模型采用，
RoPE + YaRN 成为事实标准。
```

## 延伸阅读

- [[概念/LLM/attention-variants|注意力变体]] — 注意力机制全景
- [[概念/LLM/grouped-query-attention|GQA]] — 分组查询注意力
- [[概念/LLM/transformer-architecture|Transformer 架构]] — 架构基础
- [[概念/LLM/context-window|上下文窗口]] — 位置编码决定窗口上限

> ℹ️ 2026 年 RoPE + YaRN 已成为位置编码事实标准，ALiBi 主要用于理解历史模型。
