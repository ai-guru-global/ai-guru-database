---
title: 随机采样解码（Sampling Decoding）
category: concepts
tags:
  - llm
  - inference
  - decoding
  - sampling
  - stochastic
  - random-sampling
aliases:
  - Sampling Decoding
  - Random Sampling
  - 随机采样
  - 采样解码
relationships:
  - target: "_concepts/decoding-strategies"
    type: belongs_to
  - target: "_concepts/greedy-decoding"
    type: contrasted_with
  - target: "_concepts/temperature-scaling"
    type: modified_by
  - target: "_concepts/top-p-sampling"
    type: modified_by
summary: 随机采样解码按照模型输出的概率分布随机抽取下一个 token，使生成结果更自然、更多样，是现代 LLM 最常用的基础解码方式之一。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# 随机采样解码（Sampling Decoding）

## 一句话总结

随机采样解码按照模型输出的概率分布随机抽取下一个 token，让生成结果更自然、更多样。

---

## 数学定义

在第 `t` 步，模型输出概率分布 `P(v | t_1, ..., t_{t-1})`。随机采样从该分布中抽取：

```
t_t ~ Categorical(P(· | t_1, ..., t_{t-1}))
```

即每个 token 被选中的概率等于其模型输出概率。

---

## 伪代码

```python
def sampling_decode(model, prompt, max_length):
    input_ids = tokenize(prompt)
    for _ in range(max_length):
        logits = model(input_ids)
        probs = softmax(logits[:, -1, :])
        next_token_id = sample(probs)
        input_ids.append(next_token_id)
        if next_token_id == eos_token_id:
            break
    return detokenize(input_ids)
```

---

## 为什么需要随机采样？

语言本身具有内在不确定性：

- 同一个问题可以有多种合理回答；
- 完全确定性的输出会显得机械、缺乏变化；
- 适当的随机性能让文本更接近人类表达。

---

## 纯随机采样的问题

直接使用模型原始概率分布（`T=1`，无 Top-p/Top-k）可能带来：

| 问题 | 说明 |
|---|---|
| **低概率噪声** | 长尾分布中可能选中语义无关的 token |
| **不连贯** | 小概率 token 可能破坏句子结构 |
| **幻觉增加** | 随机性越高，事实错误概率越大 |
| **质量不稳定** | 同 prompt 多次调用结果差异大 |

---

## 改进：配合 Temperature、Top-k、Top-p

实际应用中，纯随机采样几乎总是配合以下技术使用：

| 技术 | 作用 |
|---|---|
| **Temperature** | 调节分布尖锐度 |
| **Top-k** | 限制候选集大小 |
| **Top-p** | 按概率质量动态截断 |
| **Repetition Penalty** | 减少重复 |

---

## 与贪心解码的对比

| 特性 | 贪心解码 | 随机采样 |
|---|---|---|
| 输出确定性 | 高 | 低 |
| 多样性 | 低 | 高 |
| 自然度 | 可能机械 | 更自然 |
| 事实准确性 | 通常更高 | 可能降低 |
| 适用任务 | 代码、数学 | 创意、对话 |

---

## 实践建议

1. **不要单独使用纯随机采样**，至少配合 Temperature 和 Top-p。
2. **创意任务**可以提高温度和 top_p。
3. **事实任务**应降低温度，甚至使用贪心。
4. **生产环境**建议设置 `seed` 以保证可复现性。

---

## 延伸阅读

- [[_concepts/decoding-strategies|解码策略总览]]
- [[_concepts/greedy-decoding|贪心解码]]
- [[_concepts/temperature-scaling|温度缩放]]
- [[_concepts/top-p-sampling|Top-p 采样]]
- [[_concepts/top-k-sampling|Top-k 采样]]
