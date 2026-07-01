---
title: 温度缩放（Temperature Scaling）
category: concepts
tags:
  - llm
  - inference
  - decoding
  - temperature
  - sampling
  - softmax
  - calibration
aliases:
  - Temperature Scaling
  - Temperature
  - 温度缩放
  - 温度
relationships:
  - target: "_concepts/decoding-strategies"
    type: belongs_to
  - target: "_concepts/top-p-sampling"
    type: often_used_with
  - target: "_concepts/sampling-decoding"
    type: modifies
summary: 温度缩放通过在 softmax 前对 logits 除以温度参数 T 来调节概率分布的尖锐程度。T 越小输出越确定，T 越大输出越随机，是控制 LLM 创造性与稳定性的核心旋钮。
lifecycle: stable
tier: core
created: 2026-06-25
updated: 2026-06-25
---

# 温度缩放（Temperature Scaling）

## 一句话总结

温度缩放通过调节 softmax 概率分布的“尖锐/平缓”程度，控制 LLM 输出的**确定性**与**创造性**。

---

## 数学定义

给定模型输出的 logits `z = [z_1, z_2, ..., z_V]`，温度缩放后的概率为：

```
P(t_i) = exp(z_i / T) / sum_j exp(z_j / T)
```

其中 `T` 是温度参数，`T > 0`。

---

## 温度对分布的影响

| 温度值 | 分布形状 | 生成特点 |
|---|---|---|
| `T → 0` | 极端尖锐 | 趋近贪心解码，几乎总是选最高概率 token |
| `T < 1`（如 0.3~0.7）| 较尖锐 | 高概率 token 更占优势，输出保守、准确 |
| `T = 1` | 保持原分布 | 模型原始概率分布 |
| `T > 1`（如 0.8~1.2）| 较平缓 | 概率差距缩小，低概率 token 也有机会被选中 |
| `T → ∞` | 接近均匀分布 | 完全随机，输出通常无意义 |

### 直观理解

- **低温**：模型“胆小”，只敢选最有把握的答案。
- **高温**：模型“大胆”，愿意尝试小概率但有趣的表达。

---

## 不同温度下的行为示例

假设某步 logits 对应的概率分布为：

| token | 原始概率 (T=1) | T=0.5 | T=2.0 |
|---|---|---|---|
| 今天 | 0.50 | 0.78 | 0.32 |
| 明天 | 0.30 | 0.19 | 0.30 |
| 昨天 | 0.15 | 0.03 | 0.24 |
| 某天 | 0.05 | 0.00 | 0.14 |

可见：
- `T=0.5` 强化了最高概率 token；
- `T=2.0` 使概率更均匀，小概率 token 有机会出现。

---

## 推荐参数设置

| 任务 | 推荐温度 | 原因 |
|---|---|---|
| 代码生成 | 0.1 ~ 0.3 | 代码需要精确 |
| 数学推理 | 0.0 ~ 0.2 | 追求确定性 |
| 知识问答 | 0.1 ~ 0.5 | 平衡准确性与自然度 |
| 文本摘要 | 0.3 ~ 0.7 | 保持内容忠实 |
| 对话聊天 | 0.6 ~ 0.9 | 自然流畅 |
| 创意写作 | 0.8 ~ 1.2 | 鼓励多样性 |
| 头脑风暴 | 1.0 ~ 1.3 | 最大化创造性 |

---

## 与 Top-p 的配合

温度缩放和 Top-p 通常**一起使用**：

1. 先用 Temperature 调节整体分布形状；
2. 再用 Top-p 截断长尾低概率 token。

例如 Hugging Face 的常用配置：

```python
model.generate(
    input_ids,
    temperature=0.7,
    top_p=0.9,
    do_sample=True
)
```

---

## 常见误区

1. **Temperature=0 严格等于贪心吗？**
   - 数学上是极限情况，实际实现通常直接调用 argmax 避免数值问题。

2. **高温一定更有创意吗？**
   - 过高的温度（如 >1.5）会导致语义不连贯，反而降低可用性。

3. **Temperature 可以独立使用吗？**
   - 可以，但通常与 Top-p/Top-k 配合，避免极端采样。

---

## 延伸阅读

- [[_concepts/decoding-strategies|解码策略总览]]
- [[_concepts/top-p-sampling|Top-p 采样]]
- [[_concepts/greedy-decoding|贪心解码]]
- [[_concepts/sampling-decoding|随机采样]]
