---
title: 束搜索（Beam Search）
category: concepts
tags:
  - llm
  - inference
  - decoding
  - beam-search
  - deterministic
  - seq2seq
aliases:
  - Beam Search
  - 束搜索
  - Beam Decoding
relationships:
  - target: "_concepts/decoding-strategies"
    type: belongs_to
  - target: "_concepts/greedy-decoding"
    type: generalized_by
  - target: "_concepts/autoregressive-generation"
    type: used_in
summary: 束搜索在解码的每一步保留概率最高的 k 个候选序列，逐步扩展并选择最优整体序列。它比贪心解码更能找到全局较优解，但计算成本更高。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# 束搜索（Beam Search）

## 一句话总结

束搜索每步保留 `k` 个最可能的候选序列，通过局部扩展寻找整体概率更高的完整输出。

---

## 数学定义

给定 beam width `k`，在每一步：

1. 对当前 `k` 个候选序列，分别扩展词表中所有可能的下一个 token；
2. 计算每个扩展序列的累积对数概率：

```
log P(y_1, ..., y_t) = sum_{i=1}^{t} log P(y_i | y_1, ..., y_{i-1})
```

3. 保留累积概率最高的 `k` 个序列；
4. 重复直到达到最大长度或生成结束符。

---

## 算法示例

假设 beam width `k=2`，词表 `{A, B, C}`：

**第 1 步**：

| 序列 | 累积概率 |
|---|---|
| A | 0.5 |
| B | 0.3 |
| C | 0.2 |

保留 top-2：`A`、`B`

**第 2 步**：

扩展 A：`AA(0.25)`、`AB(0.15)`、`AC(0.10)`  
扩展 B：`BA(0.18)`、`BB(0.08)`、`BC(0.04)`

保留 top-2：`AA`、`AB`

**第 3 步**：继续扩展...

---

## 长度惩罚（Length Penalty）

直接使用累积概率会偏向短序列。通常引入长度惩罚：

```
score(y) = log P(y) / |y|^α
```

- `α = 0`：无惩罚；
- `α = 1`：完全平均；
- 常见取值：`α = 0.6 ~ 1.0`。

---

## 与贪心解码的关系

```
Beam Search (k=1) = Greedy Decoding
```

贪心解码是束搜索在 `k=1` 时的特例。

---

## 优点

| 优点 | 说明 |
|---|---|
| 全局质量更好 | 比贪心更容易找到整体概率高的序列 |
| 确定性输出 | 给定 k，结果是确定的 |
| 适合短序列任务 | 翻译、摘要等任务效果显著 |

---

## 缺点

| 缺点 | 说明 |
|---|---|
| 计算成本高 | 需要维护 k 个序列的前向传播 |
| 内存占用大 | 需要存储 k 个 KV Cache |
| 可能生成不自然文本 | 对于开放式生成，Beam Search 倾向于“安全”但机械的文本 |
| 多样性差 | 不同 beam 容易收敛到相似结果 |

---

## 适用场景

| 场景 | 原因 |
|---|---|
| **机器翻译** | 需要找到整体最流畅的译文 |
| **文本摘要** | 生成质量优于贪心 |
| **语音识别** | 序列到序列任务 |
| **结构化输出** | 如代码补全、SQL 生成 |

## 不适用场景

| 场景 | 原因 |
|---|---|
| **创意写作** | 输出缺乏多样性 |
| **开放域对话** | 容易生成机械、重复的回复 |
| **长文本生成** | 计算成本高且质量不一定更好 |

---

## 改进变体

| 变体 | 说明 |
|---|---|
| **Diverse Beam Search** | 在 beam 之间加入多样性约束 |
| **Stochastic Beam Search** | 结合采样增加多样性 |
| **Constrained Beam Search** | 强制生成满足某些约束的序列 |

---

## 延伸阅读

- [[_concepts/decoding-strategies|解码策略总览]]
- [[_concepts/greedy-decoding|贪心解码]]
- [[_concepts/autoregressive-generation|自回归生成]]
- [[_concepts/model-inference|模型推理]]
