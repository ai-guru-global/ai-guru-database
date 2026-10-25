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
  - target: "概念/decoding-strategies"
    type: belongs_to
  - target: "概念/greedy-decoding"
    type: generalized_by
  - target: "概念/autoregressive-generation"
    type: used_in
summary: 束搜索在解码的每一步保留概率最高的 k 个候选序列，逐步扩展并选择最优整体序列。它比贪心解码更能找到全局较优解，但计算成本更高。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-07-21
sources: []
name_zh: "束搜索"
---

# 束搜索（Beam Search）

> 中文简称：束搜索

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

- [[概念/decoding-strategies|解码策略总览]]
- [[概念/greedy-decoding|贪心解码]]
- [[概念/autoregressive-generation|自回归生成]]
- [[概念/model-inference|模型推理]]

---

## 2026 Beam Search 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Beam Search** | 保留 Top-k 候选序列，平衡质量与多样性 | GA |
| **Diverse Beam Search** | 分组束搜索，增加输出多样性 | GA |
| **Length Penalty** | 长度惩罚，避免过短/过长输出 | GA |
| **No Repeat N-gram** | 禁止重复 N-gram，避免循环 | GA |
| **Beam + Sampling** | 束搜索 + 采样混合策略 | 研究 |

## 生产最佳实践

1. **翻译任务适用**：机器翻译/摘要等确定性任务用 Beam Search
2. **beam_size 选择**：生产环境用 beam_size=4-8，平衡质量与速度
3. **长度惩罚必配**：设置 length_penalty=0.6-1.0，避免过短输出
4. **创意任务不用**：创意写作/对话用采样策略，不用 Beam Search
5. **与采样对比**：生产前对比 Beam Search 与采样的效果，选择最优
6. **No Repeat N-gram**：启用 no_repeat_ngram_size=3 避免重复
7. **Early Stopping**：启用 early_stopping 提升速度

## Beam Search vs 采样策略

| 维度 | Beam Search | 采样 (Top-p/Top-k) |
|------|-------------|-------------------|
| **输出确定性** | 高（确定性） | 低（随机性） |
| **多样性** | 低 | 高 |
| **适用任务** | 翻译、摘要 | 对话、创意写作 |
| **速度** | 较慢 (beam_size x) | 快 |
| **质量** | 稳定 | 波动 |
| **生产建议** | 确定性任务 | 开放式任务 |

## 延伸阅读

- [[概念/LLM/greedy-decoding|贪婪解码]]
- [[概念/LLM/sampling-decoding|采样解码]]
- [[概念/LLM/top-p-sampling|Top-p 采样]]
- [[05_大模型/02_序列模型/Text_Generation_Decoding_Strategies|解码策略]]

> ℹ️ 现代 LLM 应用中，采样策略 (Top-p/Top-k) 比 Beam Search 更常用，Beam Search 主要用于翻译/摘要等确定性任务。
