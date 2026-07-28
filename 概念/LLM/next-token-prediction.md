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
  - target: "概念/pre-training"
    type: core_task_of
  - target: "概念/autoregressive-generation"
    type: used_in
  - target: "概念/transformer-architecture"
    type: implemented_by
  - target: "概念/causal-mask"
    type: requires
summary: 下一个 Token 预测是自回归语言模型的核心任务：给定前文，预测下一个最可能出现的 token。它是 GPT 类模型预训练和推理的基础范式。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources: []
name_zh: "下一个 Token 预测"
---

# 下一个 Token 预测（Next Token Prediction）

> 中文简称：下一个 Token 预测

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

- [[概念/pre-training|预训练]]
- [[概念/autoregressive-generation|自回归生成]]
- [[概念/causal-mask|因果掩码]]
- [[概念/transformer-architecture|Transformer 架构]]
- [[概念/decoding-strategies|解码策略]]

---

## 2026 自回归生成生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Speculative Decoding** | Draft-Verify 加速 2-3x，保持分布一致 | GA |
| **MTP (Multi-Token Prediction)** | DeepSeek-V3 原生多 Token 预测 | GA |
| **Parallel Decoding** | 并行解码多个位置，提升吞吐量 | 研究 |
| **Masked Prediction** | BERT 式掩码预测，双向理解 | GA |
| **Flow Matching** | 连续流生成，非自回归新范式 | 研究 |

## 生产最佳实践

1. **理解自回归约束**：每次只生成 1 个 Token，吐吐量受限于序列长度
2. **投机解码加速**：生产环境启用 Speculative Decoding，提升 2-3x 吐吐量
3. **KV Cache 必用**：避免重复计算，将时间复杂度从 O(T²) 降至 O(T)
4. **停止条件明确**：设置 EOS Token + max_new_tokens + 停止词，避免无限生成
5. **温度控制**：根据任务类型调整 temperature，平衡确定性与多样性

## 自回归生成过程图解

```
输入: "今天天气"

Step 1: P(next | "今天天气") → "真" (p=0.35)
Step 2: P(next | "今天天气真") → "好" (p=0.62)
Step 3: P(next | "今天天气真好") → "！" (p=0.28)
Step 4: P(next | "今天天气真好！") → <EOS> (p=0.71)

输出: "今天天气真好！"

关键特性:
- 每步只生成 1 个 Token
- 每步都看到之前所有 Token (KV Cache)
- 生成质量取决于概率分布 + 采样策略
```

## 下一 Token 预测 vs 其他生成范式

| 范式 | 生成方式 | 代表 | 优势 | 劣势 |
|------|---------|------|------|------|
| **自回归 (AR)** | 逐 Token 从左到右 | GPT, Llama | 质量最高 | 速度慢 |
| **掩码预测 (MLM)** | 并行填充掩码 | BERT | 双向理解 | 不能生成 |
| **非自回归 (NAR)** | 一次性并行生成 | 研究 | 极快 | 质量低 |
| **扩散生成** | 迭代去噪 | Diffusion-LM | 可控性强 | 慢、不成熟 |
| **Flow Matching** | 连续流变换 | 研究 | 理论优雅 | 早期 |

## 训练目标与损失函数

```python
# 下一 Token 预测的训练目标 (Cross-Entropy Loss)
import torch.nn.functional as F

# logits: [batch, seq_len, vocab_size]
# labels: [batch, seq_len] (shifted by 1)
loss = F.cross_entropy(
    logits[:, :-1, :].reshape(-1, vocab_size),
    labels[:, 1:].reshape(-1)
)
# 困惑度 Perplexity = exp(loss)
```

## 延伸阅读

- [[概念/LLM/sampling-decoding|采样与解码]] — 从概率分布中采样
- [[概念/LLM/speculative-decoding|投机解码]] — 加速自回归生成
- [[概念/LLM/kv-cache|KV Cache]] — 避免重复计算
- [[概念/LLM/token-plain|Token 详解]] — Token 化基础
