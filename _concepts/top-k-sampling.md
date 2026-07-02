---
title: Top-k 采样
category: concepts
tags:
  - llm
  - inference
  - decoding
  - top-k
  - sampling
  - stochastic
aliases:
  - Top-k Sampling
  - Top-k
  - top_k
  - 前 k 采样
relationships:
  - target: "_concepts/decoding-strategies"
    type: belongs_to
  - target: "_concepts/top-p-sampling"
    type: contrasted_with
  - target: "_concepts/temperature-scaling"
    type: often_used_with
summary: Top-k 采样只从概率最高的前 k 个 token 中随机选择下一个 token。它是最早广泛使用的随机解码策略之一，实现简单，但灵活性不如 Top-p。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# Top-k 采样

## 一句话总结

Top-k 采样只从模型输出中概率最高的前 `k` 个 token 里随机选择下一个 token，是最早普及的随机解码策略之一。

---

## 数学定义

1. 将词表中所有 token 按概率排序：

```
P(t_1) ≥ P(t_2) ≥ ... ≥ P(t_V)
```

2. 定义候选集合：

```
V_k = {t_1, t_2, ..., t_k}
```

3. 在 `V_k` 中按重新归一化后的概率采样：

```
P'(t_i) = P(t_i) / sum_{t_j ∈ V_k} P(t_j)
```

---

## 常见取值

| k 值 | 效果 |
|---|---|
| `k = 1` | 等价于贪心解码 |
| `k = 10 ~ 50` | 保守采样 |
| `k = 50 ~ 200` | 中等多样性 |
| `k = V`（词表大小）| 等价于纯随机采样 |

实际使用中，常见默认值为 `k = 50`。

---

## 优点

| 优点 | 说明 |
|---|---|
| **实现简单** | 只需排序取 top-k |
| **控制随机性** | 限制候选集大小，避免选中极端低概率 token |
| **可解释性强** | k 值直观反映候选范围 |

---

## 缺点

| 缺点 | 说明 |
|---|---|
| **固定 k 不够灵活** | 分布尖锐时可能纳入低质 token，分布平缓时可能丢失好候选 |
| **不如 Top-p 自适应** | 无法根据概率质量动态调整 |
| **需要调参** | 不同任务需要不同的 k 值 |

### 举例说明

假设某步模型非常确定：

| token | 概率 |
|---|---|
| 的 | 0.99 |
| 是 | 0.005 |
| ... | ... |

若 `k=50`，会强制纳入 49 个概率极低的 token，浪费计算并可能引入噪声。

反过来，若模型非常不确定：

| token | 概率 |
|---|---|
| A | 0.20 |
| B | 0.18 |
| C | 0.15 |
| ... | ... |

若 `k=5`，可能丢失很多合理候选。

---

## 与 Top-p 的对比

| 特性 | Top-k | Top-p |
|---|---|---|
| 候选集 | 固定数量 k | 动态按累积概率 p |
| 自适应性 | 低 | 高 |
| 实现复杂度 | 低 | 中 |
| 现代使用频率 | 较低 | 更高 |

---

## 实际使用

现代 LLM 服务通常同时提供 `top_k` 和 `top_p`，可以组合使用：

```python
model.generate(
    input_ids,
    do_sample=True,
    temperature=0.7,
    top_k=50,
    top_p=0.9
)
```

组合逻辑：先取 top-k，再在 top-k 中应用 top-p。

---

## 延伸阅读

- [[_concepts/decoding-strategies|解码策略总览]]
- [[_concepts/top-p-sampling|Top-p 采样]]
- [[_concepts/temperature-scaling|温度缩放]]
- [[_concepts/sampling-decoding|随机采样]]
