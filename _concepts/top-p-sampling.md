---
title: Top-p 采样（Nucleus Sampling）
category: concepts
tags:
  - llm
  - inference
  - decoding
  - top-p
  - nucleus-sampling
  - sampling
  - stochastic
aliases:
  - Top-p Sampling
  - Nucleus Sampling
  - Top-p
  - 核采样
  - 累积概率采样
relationships:
  - target: "_concepts/decoding-strategies"
    type: belongs_to
  - target: "_concepts/temperature-scaling"
    type: often_used_with
  - target: "_concepts/top-k-sampling"
    type: contrasted_with
summary: Top-p 采样从累积概率达到 p 的最小 token 集合（nucleus）中采样。它动态调整候选集大小，比 Top-k 更灵活，能在生成质量和多样性之间取得更好平衡。
lifecycle: stable
tier: core
created: 2026-06-25
updated: 2026-06-25
---

# Top-p 采样（Nucleus Sampling）

## 一句话总结

Top-p 采样（又称 Nucleus Sampling）从累积概率达到 `p` 的最小 token 集合中采样，**动态适应模型输出的概率分布**。

---

## 数学定义

1. 将词表中所有 token 按概率从高到低排序：

```
P(t_1) ≥ P(t_2) ≥ ... ≥ P(t_V)
```

2. 找到最小的 `k`，使得：

```
sum_{i=1}^{k} P(t_i) ≥ p
```

3. 定义候选集合（nucleus）：

```
V_p = {t_1, t_2, ..., t_k}
```

4. 在 `V_p` 内按重新归一化后的概率采样：

```
P'(t_i) = P(t_i) / sum_{t_j ∈ V_p} P(t_j)
```

---

## 算法示例

假设某步概率分布排序后：

| token | 概率 | 累积概率 |
|---|---|---|
| 的 | 0.40 | 0.40 |
| 是 | 0.30 | 0.70 |
| 和 | 0.15 | 0.85 |
| 在 | 0.08 | 0.93 |
| 有 | 0.04 | 0.97 |
| ... | ... | ... |

若 `p = 0.9`，则候选集为 `{的, 是, 和, 在}`（累积概率 0.93 ≥ 0.9），只在这 4 个 token 中采样。

若 `p = 0.95`，则候选集扩展为 `{的, 是, 和, 在, 有}`。

---

## 与 Top-k 的对比

| 特性 | Top-k | Top-p |
|---|---|---|
| 候选集大小 | 固定为 k | 动态变化 |
| 适应性 | 低 | 高 |
| 分布尖锐时 | 可能纳入过多低质 token | 自动缩小候选集 |
| 分布平缓时 | 可能丢失合理候选 | 自动扩大候选集 |
| 常用程度 | 较早使用 | 现代 LLM 更常用 |

### 为什么 Top-p 通常更好？

- 当模型对某一步非常确定时（如某个 token 概率 0.99），Top-p=0.9 可能只保留 1~2 个候选，避免浪费计算。
- 当模型不确定时（如概率分散），Top-p 会自动包含更多候选，保证多样性。

---

## 常见取值

| 场景 | 推荐 top_p |
|---|---|
| 确定性任务（代码、数学）| 0.95 ~ 1.0 |
| 通用对话 | 0.85 ~ 0.95 |
| 创意写作 | 0.90 ~ 1.0 |
| 高度创造性任务 | 0.95 ~ 1.0 |

注意：`top_p=1.0` 等价于不对概率进行截断（但仍可能受 temperature 影响）。

---

## 与 Temperature 的配合

实际使用中通常组合配置：

```python
model.generate(
    input_ids,
    do_sample=True,
    temperature=0.7,
    top_p=0.9
)
```

- Temperature 控制分布的“尖锐/平缓”；
- Top-p 控制候选 token 的范围。

---

## 优缺点

| 优点 | 缺点 |
|---|---|
| 动态适应概率分布 | 实现比贪心复杂 |
| 平衡质量与多样性 | 需要调参 |
| 减少无意义低概率 token 的干扰 | 极端情况下候选集可能过小 |
| 现代 LLM API 广泛支持 | 单独使用不如配合 temperature |

---

## 延伸阅读

- [[_concepts/decoding-strategies|解码策略总览]]
- [[_concepts/temperature-scaling|温度缩放]]
- [[_concepts/top-k-sampling|Top-k 采样]]
- [[_concepts/sampling-decoding|随机采样]]
