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
updated: 2026-07-21
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

---

## 2026 Causal Mask 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **FlashAttention-3** | 融合 causal mask 的高效注意力实现 | GA |
| **滑动窗口注意力** | Mistral/Gemma 用局部窗口替代全局 causal | GA |
| **Prefix Caching** | 缓存前缀 KV 避免重复计算 | GA |
| **双向注意力** | 编码器模型（BERT类）不使用 causal mask | GA |
| **稀疏注意力** | Big Bird/Longformer 稀疏模式降低复杂度 | GA |

## 生产最佳实践

1. **理解语义**：causal mask 保证自回归性，训练和推理必须一致
2. **Flash Attention**：生产环境必用 FlashAttention，内存和速度双优化
3. **KV Cache 配合**：推理时 causal mask + KV Cache 避免重复计算
4. **窗口大小**：滑动窗口注意力需根据任务选择合适窗口大小
5. **调试技巧**：可视化 attention map 确认 mask 正确应用

## Causal Mask 实现示例

```python
import torch

def create_causal_mask(seq_len: int, dtype=torch.float32) -> torch.Tensor:
    """创建因果注意力掩码"""
    # 下三角矩阵：当前位置只能看到之前的 token
    mask = torch.triu(
        torch.full((seq_len, seq_len), float('-inf'), dtype=dtype),
        diagonal=1
    )
    return mask

# 使用示例
seq_len = 8
causal_mask = create_causal_mask(seq_len)
# attention_scores: [batch, heads, seq_len, seq_len]
# masked_scores = attention_scores + causal_mask
# attention_weights = softmax(masked_scores, dim=-1)

# Flash Attention 内置 causal mask
from flash_attn import flash_attn_func
# causal=True 自动应用因果掩码
output = flash_attn_func(q, k, v, causal=True)
```

## 掩码类型对比

| 掩码类型 | 可见范围 | 应用场景 | 复杂度 |
|----------|----------|----------|--------|
| Causal Mask | 当前及之前 | GPT/LLM 生成 | O(n²) |
| Bidirectional | 全部 | BERT/编码 | O(n²) |
| Sliding Window | 窗口内 | Mistral/长文本 | O(n·w) |
| Prefix Mask | 前缀双向+后续因果 | T5/UniLM | O(n²) |
| Block Diagonal | 块内可见 | 文档级注意力 | O(n·b) |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 生成质量差 | mask 方向错误 | 确认是上三角 -inf |
| 显存溢出 | 全量 mask 占用大 | 使用 Flash Attention |
| 长文本性能差 | O(n²) 复杂度 | 滑动窗口/稀疏注意力 |
| 训练推理不一致 | mask 实现差异 | 统一使用 Flash Attention |

## 生产检查清单

1. ✅ 确认 mask 方向正确（上三角 -inf）
2. ✅ 使用 Flash Attention 避免显存浪费
3. ✅ 训练和推理使用相同的 mask 实现
4. ✅ 长文本场景评估滑动窗口注意力
5. ✅ 可视化 attention map 验证 mask 效果
6. ✅ 多卡并行时确认 mask 广播正确

## 总结

Causal Mask 是自回归语言模型的核心机制，确保每个 token 只能看到之前的内容，从而实现从左到右的生成过程。2026 年 Flash Attention 已将 causal mask 内置为原生参数，开发者无需手动实现。

> 💡 Causal Mask 的本质是“时间箭头”——它赋予了序列方向性，让模型学会“预测未来”而非“回顾过去”。
