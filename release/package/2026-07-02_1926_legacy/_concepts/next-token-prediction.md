---
title: 下一个 Token 预测（Next Token Prediction）
category: concepts
tags:
  - llm
  - training
  - next-token-prediction
  - autoregressive
  - language-modeling
  - self-supervised
aliases:
  - Next Token Prediction
  - NTP
  - 下一个 Token 预测
  - 自回归语言建模
relationships:
  - target: "_concepts/pre-training"
    type: core_task_of
  - target: "_concepts/autoregressive-generation"
    type: used_in
  - target: "_concepts/transformer-architecture"
    type: implemented_by
  - target: "_concepts/causal-mask"
    type: requires
summary: 下一个 Token 预测是自回归语言模型的核心任务：给定前文，预测下一个最可能出现的 token。它是 GPT 类模型预训练和推理的基础范式。
lifecycle: stable
tier: core
created: 2026-06-25
updated: 2026-06-25
---

# 下一个 Token 预测（Next Token Prediction）

## 一句话总结

**下一个 Token 预测**是自回归语言模型的核心任务：给定已生成的文本，预测下一个最可能出现的 token。

---

## 数学形式

给定 token 序列 `t_1, t_2, ..., t_T`，模型学习条件概率分布：

```
P(t_i | t_1, t_2, ..., t_{i-1})
```

整个序列的联合概率可分解为：

```
P(t_1, t_2, ..., t_T) = P(t_1) × P(t_2|t_1) × ... × P(t_T|t_1,...,t_{T-1})
```

---

## 训练目标

预训练时，模型通过最大化训练数据的对数似然来学习：

```
L = - sum_{i=1}^{T} log P(t_i | t_1, ..., t_{i-1}; θ)
```

其中 `θ` 是模型参数，通过反向传播更新。

### 实际实现

使用 Causal Mask，一次性输入整个序列，同时计算所有位置的损失：

```python
import torch
import torch.nn.functional as F

# logits: [batch, seq_len, vocab_size]
# labels: [batch, seq_len]
loss = F.cross_entropy(
    logits.view(-1, vocab_size),
    labels.view(-1),
    ignore_index=-100
)
```

---

## 为什么这个任务有效？

看似简单的“猜下一个词”任务，实际上迫使模型学习：

| 能力 | 来源 |
|---|---|
| **语法** | 主谓一致、时态、词性搭配 |
| **语义** | 词义、上下文指代 |
| **世界知识** | 事实、常识、专业术语 |
| **推理** | 数学、代码、逻辑链条 |
| **风格** | 文体、语气、格式 |

---

## 训练 vs 推理的差异

| 阶段 | 输入 | 输出 | 是否并行 |
|---|---|---|---|
| **训练** | 完整序列 | 每个位置的下一个 token | 是（Causal Mask）|
| **推理** | prompt + 已生成 token | 下一个 token | 否（自回归）|

---

## 与 Masked Language Modeling 的对比

| 特性 | Next Token Prediction（GPT 风格）| Masked Language Modeling（BERT 风格）|
|---|---|---|
| 预测方向 | 单向（只看左边）| 双向（看上下文）|
| 适用模型 | GPT、LLaMA、Claude | BERT、RoBERTa |
| 主要用途 | 生成 | 理解、编码 |
| 预训练数据效率 | 需要更多数据 | 数据效率相对较高 |

---

## 局限性

| 局限 | 说明 |
|---|---|
| **没有显式规划** | 模型逐词生成，可能缺乏全局规划 |
| **局部最优** | 贪心策略可能导致整体次优 |
| **幻觉风险** | 训练目标只是“像训练数据”，不保证事实正确 |
| **长程依赖** | 极长上下文仍可能丢失早期信息 |

---

## 延伸阅读

- [[_concepts/pre-training|预训练]]
- [[_concepts/autoregressive-generation|自回归生成]]
- [[_concepts/causal-mask|因果掩码]]
- [[_concepts/transformer-architecture|Transformer 架构]]
- [[_concepts/decoding-strategies|解码策略]]
