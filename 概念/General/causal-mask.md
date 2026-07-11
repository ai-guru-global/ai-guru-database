---
title: 因果掩码（Causal Mask）
category: concepts
tags:
  - llm
  - transformer
  - attention
  - causal-mask
  - autoregressive
  - masking
aliases:
  - Causal Mask
  - 因果掩码
  - Causal Attention Mask
  - 因果注意力掩码
relationships:
  - target: "概念/transformer-architecture"
    type: part_of
  - target: "概念/next-token-prediction"
    type: enables
  - target: "概念/autoregressive-generation"
    type: enforces
summary: 因果掩码通过将未来位置的注意力分数置为负无穷，确保模型在预测当前 token 时只能看到之前的 token，是自回归语言模型训练和推理的核心机制。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# 因果掩码（Causal Mask）

## 一句话总结

因果掩码确保模型在预测当前 token 时**只能看到它前面的 token**，不能“偷看”未来信息。

---

## 核心思想

在自回归语言模型中，预测第 `i` 个 token 时，模型只能使用 `t_1, ..., t_{i-1}` 的信息。因果掩码通过在 Attention 的 softmax 之前，将未来位置的分数设为 `-inf` 来实现这一点。

---

## 数学形式

标准 Attention：

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V
```

加入因果掩码 `M`：

```
M_{ij} = 0    if i ≥ j
M_{ij} = -∞  if i < j

CausalAttention(Q, K, V) = softmax((QK^T / sqrt(d_k)) + M) V
```

其中 `i` 是查询位置，`j` 是键位置。`i < j` 表示查询在键的未来位置，需要屏蔽。

---

## 掩码矩阵示例

对于长度为 4 的序列，因果掩码为：

```
位置    1    2    3    4
1     [0   -∞   -∞   -∞]
2     [0    0   -∞   -∞]
3     [0    0    0   -∞]
4     [0    0    0    0]
```

- 第 1 个 token 只能看到自己；
- 第 2 个 token 能看到第 1、2 个；
- 第 4 个 token 能看到全部。

---

## 训练时的优势

训练时，因果掩码让模型可以**一次性处理整个序列**，同时计算所有位置的损失：

```python
import torch

# seq_len = 4
mask = torch.tril(torch.ones(4, 4))  # 下三角矩阵
mask = mask.masked_fill(mask == 0, float('-inf'))
mask = mask.masked_fill(mask == 1, 0)

# scores: [batch, heads, seq_len, seq_len]
scores = scores + mask
attn_weights = torch.softmax(scores, dim=-1)
```

这相当于同时进行了 4 次独立的“预测下一个 token”任务：

- 用 `t_1` 预测 `t_2`
- 用 `t_1, t_2` 预测 `t_3`
- 用 `t_1, t_2, t_3` 预测 `t_4`

---

## 推理时的天然因果性

推理时模型自回归生成，每次只输入一个新 token，历史信息通过 KV Cache 传递。因此推理阶段**不需要显式应用因果掩码**——生成过程本身就是因果的。

---

## 与 BERT 掩码的对比

| 特性 | Causal Mask（GPT） | Attention Mask（BERT） |
|---|---|---|
| 可见范围 | 只看左边 | 看两边 |
| 任务 | 生成 | 理解 |
| 训练方式 | 预测下一个 token | 预测被 mask 的 token |
| 应用场景 | 文本生成、对话 | 分类、抽取、嵌入 |

---

## 常见误区

1. **因果掩码只在训练时用？**
   - 训练时必须显式使用；推理时由自回归过程天然保证。

2. **因果掩码会降低模型能力？**
   - 不会。它强制模型学习从左到右的生成能力，这正是 GPT 类模型的优势。

3. **双向注意力更好？**
   - 取决于任务。生成任务需要因果性，理解任务可以受益于双向上下文。

---

## 延伸阅读

- [[概念/transformer-architecture|Transformer 架构]]
- [[概念/next-token-prediction|下一个 Token 预测]]
- [[概念/autoregressive-generation|自回归生成]]
- [[概念/attention-variants|Attention 变体]]
