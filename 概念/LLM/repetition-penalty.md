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
  - target: "概念/decoding-strategies"
    type: belongs_to
  - target: "概念/sampling-decoding"
    type: often_used_with
  - target: "概念/greedy-decoding"
    type: often_used_with
summary: 重复惩罚通过降低已生成 token 的采样概率来减少模型输出中的重复现象，是改善生成文本多样性和自然度的常用后处理技术。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-07-21
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

- [[概念/decoding-strategies|解码策略总览]]
- [[概念/greedy-decoding|贪心解码]]
- [[概念/sampling-decoding|随机采样]]
- [[概念/temperature-scaling|温度缩放]]
- [[概念/top-p-sampling|Top-p 采样]]

---

## 2026 重复控制生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **repetition_penalty** | 对已出现 Token 施加惩罚，降低重复概率 | GA |
| **frequency_penalty** | 按出现频次累加惩罚，比 repetition_penalty 更细粒度 | GA |
| **presence_penalty** | 只要出现过就惩罚，不累计频次 | GA |
| **no_repeat_ngram_size** | 禁止重复 N-gram，硬性去重 | GA |
| **动态惩罚调度** | 根据生成进度动态调整惩罚强度 | 研究 |

## 生产最佳实践

1. **默认开启惩罚**：生产环境设置 repetition_penalty=1.05-1.2，避免循环重复
2. **任务匹配参数**：代码生成用低值(1.0-1.05)，创意写作用高值(1.1-1.3)
3. **不要过度惩罚**：过高惩罚会导致语义不连贯，建议不超过 1.5
4. **与 Top-p 配合**：重复惩罚 + Top-p 采样组合使用，效果更佳
5. **监控重复率**：生产环境监控输出重复率，异常时调整参数

## 重复惩罚参数调优指南

| 任务类型 | repetition_penalty | frequency_penalty | presence_penalty |
|---------|:-----------------:|:-----------------:|:----------------:|
| 代码生成 | 1.0-1.05 | 0 | 0 |
| 技术文档 | 1.05-1.1 | 0.1-0.3 | 0 |
| 通用对话 | 1.1-1.15 | 0.2-0.5 | 0.1-0.3 |
| 创意写作 | 1.15-1.3 | 0.5-0.8 | 0.3-0.6 |
| 翻译 | 1.0-1.05 | 0 | 0 |
| 摘要 | 1.05-1.1 | 0.1-0.2 | 0 |

## 重复惩罚工作原理

```
原始 logits:  [2.0, 1.5, 1.5, 0.8]  (Token A 已出现过)

repetition_penalty=1.2  applied to Token A:
  if logit > 0: logit / 1.2 = 2.0/1.2 = 1.67
  if logit < 0: logit * 1.2

frequency_penalty: logit - freq_count × penalty
presence_penalty:  logit - (1 if appeared else 0) × penalty
```

## 常见问题与解决方案

| 问题 | 原因 | 解决 |
|------|------|------|
| 循环重复句子 | 惩罚太低 / 模型能力不足 | 提高 penalty 或换模型 |
| 语义不连贯 | 惩罚过高 | 降低 penalty 至 1.1 以下 |
| 关键词丢失 | 必要词被惩罚 | 用 presence 代替 frequency |
| 列表格式破坏 | 重复结构被惩罚 | 代码/列表场景用低值 |

## 延伸阅读

- [[概念/LLM/sampling-decoding|采样与解码]] — 解码策略全景
- [[概念/LLM/temperature-scaling|温度缩放]] — 温度与重复的关系
- [[概念/LLM/greedy-decoding|贪心解码]] — 无采样的确定性解码
- [[概念/LLM/next-token-prediction|下一Token预测]] — 自回归生成基础

> ℹ️ 重复惩罚是生产环境必备参数，默认设置 1.05-1.1 可避免大多数重复问题。
代码/翻译场景用低值 (1.0-1.05)，创意写作用高值 (1.1-1.3)。
