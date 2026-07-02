---
title: 重复惩罚（Repetition Penalty）
category: concepts
tags:
  - llm
  - inference
  - decoding
  - repetition-penalty
  - sampling
  - text-generation
aliases:
  - Repetition Penalty
  - 重复惩罚
  - Frequency Penalty
  - Presence Penalty
relationships:
  - target: "_concepts/decoding-strategies"
    type: belongs_to
  - target: "_concepts/sampling-decoding"
    type: often_used_with
  - target: "_concepts/greedy-decoding"
    type: often_used_with
summary: 重复惩罚通过降低已生成 token 的采样概率来减少模型输出中的重复现象，是改善生成文本多样性和自然度的常用后处理技术。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# 重复惩罚（Repetition Penalty）

## 一句话总结

重复惩罚通过**降低已生成 token 的采样概率**，减少模型输出中的重复现象。

---

## 核心思想

语言模型（尤其是贪心解码或低温采样时）容易陷入循环，反复生成相同的词或短语。重复惩罚通过修改 logits，让已经出现过 token 的相对概率下降。

---

## 数学定义

设原始 logits 为 `z_i`，惩罚系数为 `α`（通常 `α ≥ 1.0`）。对于已生成过的 token：

```
z'_i = z_i / α      if token i in generated_tokens
z'_i = z_i          otherwise
```

然后在新 logits 上计算 softmax 并采样。

- `α = 1.0`：无惩罚；
- `α > 1.0`：降低已生成 token 的概率；
- `α < 1.0`：提高已生成 token 的概率（一般不这样用）。

---

## Presence Penalty vs Frequency Penalty

OpenAI API 提供了两种相关参数：

| 参数 | 作用 |
|---|---|
| **Presence Penalty** | token 只要出现过一次就惩罚固定值 |
| **Frequency Penalty** | token 出现次数越多，惩罚越大 |

### 数学形式

**Presence Penalty**：

```
z'_i = z_i - β      if token i has appeared
```

**Frequency Penalty**：

```
z'_i = z_i - β × count(token_i)
```

其中 `β` 是惩罚强度，常见取值 `0.0 ~ 2.0`。

---

## 常见取值

| 场景 | repetition_penalty | presence_penalty | frequency_penalty |
|---|---|---|---|
| 通用对话 | 1.0 ~ 1.1 | 0.0 ~ 0.6 | 0.0 ~ 0.6 |
| 创意写作 | 1.0 ~ 1.2 | 0.0 ~ 1.0 | 0.0 ~ 1.0 |
| 代码生成 | 1.0 ~ 1.05 | 0.0 ~ 0.2 | 0.0 ~ 0.2 |
| 长文本生成 | 1.1 ~ 1.2 | 0.5 ~ 1.0 | 0.5 ~ 1.0 |

---

## 优点

| 优点 | 说明 |
|---|---|
| **减少重复** | 有效改善“复读机”现象 |
| **提高自然度** | 文本更像人类表达 |
| **实现简单** | 只需修改 logits |
| **与解码策略兼容** | 可与贪心、Top-p、Temperature 等任意组合 |

---

## 缺点与注意事项

| 问题 | 说明 |
|---|---|
| **惩罚过高** | 会导致模型避开正常词汇，输出不自然 |
| **破坏专有名词** | 对需要重复的专业术语（如品牌名、函数名）不利 |
| **代码场景慎用** | 代码中重复变量名、关键字是必需的 |
| **可能增加幻觉** | 为避免重复，模型可能编造新内容 |

---

## 实践建议

1. **从低惩罚开始**：先尝试 `repetition_penalty=1.05`。
2. **代码生成保持 1.0**：避免破坏语法结构。
3. **与 Temperature 配合**：高温 + 适当重复惩罚往往效果更好。
4. **区分 token 级别与 n-gram 级别**：有些实现只惩罚单个 token，有些惩罚重复 n-gram。

---

## 延伸阅读

- [[_concepts/decoding-strategies|解码策略总览]]
- [[_concepts/greedy-decoding|贪心解码]]
- [[_concepts/sampling-decoding|随机采样]]
- [[_concepts/temperature-scaling|温度缩放]]
- [[_concepts/top-p-sampling|Top-p 采样]]
