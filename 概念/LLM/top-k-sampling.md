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
  - target: "概念/decoding-strategies"
    type: belongs_to
  - target: "概念/top-p-sampling"
    type: contrasted_with
  - target: "概念/temperature-scaling"
    type: often_used_with
summary: Top-k 采样只从概率最高的前 k 个 token 中随机选择下一个 token。它是最早广泛使用的随机解码策略之一，实现简单，但灵活性不如 Top-p。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-07-21
sources: []
name_zh: "Top-k 采样"
---

# Top-k 采样

> 中文简称：Top-k 采样

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

- [[概念/decoding-strategies|解码策略总览]]
- [[概念/top-p-sampling|Top-p 采样]]
- [[概念/temperature-scaling|温度缩放]]
- [[概念/sampling-decoding|随机采样]]

---

## 2026 Top-k 采样生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Top-k + Top-p 组合** | 联合使用，平衡多样性与质量 | GA |
| **动态 Top-k** | 根据上下文动态调整 k 值 | 研究 |
| **Min-p 替代** | 动态截断，比固定 k 更稳定 | GA |
| **任务自适应 k** | 根据任务类型自动选择 k | 研究 |
| **Top-k 校准** | 后处理校准 Top-k 分布 | 研究 |

## 生产最佳实践

1. **k 值选择**：生产环境推荐 k=50，平衡多样性与质量
2. **与 Top-p 配合**：Top-k + Top-p 组合使用，效果更佳
3. **任务匹配**：事实任务用小 k(10-30)，创意任务用大 k(50-100)
4. **不要单独使用**：Top-k 单独使用可能导致质量下降，配合 Top-p
5. **监控输出质量**：调整 k 后监控输出质量，找到最优配置
6. **Min-p 替代**：考虑用 Min-p 替代 Top-k，更稳定
7. **A/B 测试**：不同 k 值进行 A/B 测试，找到最优配置

## Top-k vs Top-p 对比

| 维度 | Top-k | Top-p |
|------|-------|-------|
| **截断方式** | 固定数量 | 累计概率 |
| **适应性** | 不适应分布变化 | 动态适应 |
| **稳定性** | 稳定 | 更稳定 |
| **推荐场景** | 配合 Top-p 使用 | 单独或配合 Top-k |
| **生产建议** | k=50 + p=0.9 | p=0.9 |

## 延伸阅读

- [[概念/LLM/top-p-sampling|Top-p 采样]]
- [[概念/LLM/temperature-scaling|Temperature 缩放]]
- [[概念/LLM/sampling-decoding|采样解码]]
- [[概念/LLM/decoding-strategies-decision-tree|解码策略决策树]]

## 参数配置示例

```python
# Top-k 采样配置
config = {
    "top_k": 50,           # 保留概率最高的 50 个 Token
    "temperature": 0.7,    # 控制随机性
    "top_p": 0.9,          # 配合 Top-p 使用
}
```
