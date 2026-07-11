---
title: "激活值 (Activation Value)"
category: -concepts
tags: [deep-learning, neural-network, activation-function, fundamentals, for-dummy]
sources:
  - conversation:2026-06-25
created: 2026-06-25T15:59:34+08:00
updated: 2026-06-25T15:59:34+08:00
summary: "神经网络中单个神经元经过加权求和与激活函数后输出的数值，代表该神经元对当前输入的响应强度。"
provenance:
  extracted: 0.85
  inferred: 0.15
  ambiguous: 0.00
base_confidence: 0.42
lifecycle: draft
lifecycle_changed: 2026-06-25
tier: supporting
aliases:
  - "Activation Value"
  - "激活值"
---

# 激活值 (Activation Value)

**激活值是神经网络中单个神经元在处理完输入后输出的数值，代表该神经元对当前输入的响应强度或“兴奋程度”。**

## 什么产生了激活值

一个神经元的计算分为两步：

1. **加权求和**：把输入分别乘上对应的权重，再加上偏置项。
2. **激活函数**：把加权求和的结果通过一个非线性函数（如 ReLU、Sigmoid）转换，得到的就是激活值。

用公式表示：

```
激活值 = 激活函数( w₁x₁ + w₂x₂ + ... + wₙxₙ + b )
```

其中 `x` 是输入，`w` 是权重，`b` 是偏置。

## 直观理解

- 输入越强、权重越大，激活值通常就越大。
- 激活值越大，表示这个神经元“越兴奋”，对下一层的影响也越大。
- 激活函数决定了神经元是否被“点燃”：比如 ReLU 会把负数直接压成 0，相当于“不兴奋”。

## 常见激活函数

| 激活函数 | 输出范围 | 特点 |
|---|---|---|
| ReLU | [0, +∞) | 计算简单，缓解梯度消失，最常用 |
| Sigmoid | (0, 1) | 输出可解释为概率，但容易梯度消失 |
| Tanh | (-1, 1) | 零中心化，但仍可能梯度消失 |
| Softmax | (0, 1) 且和为 1 | 多用于分类输出层，将数值转为概率分布 |

## 为什么需要激活值

- **引入非线性**：没有激活函数，多层神经网络就等价于一层线性变换，无法拟合复杂模式。
- **信息筛选**：激活函数决定哪些信号继续传递、哪些被抑制，让网络学习分层特征。

## 相关

- [[概念/gradient-descent]] — 训练神经网络时优化权重与偏置的核心算法
- [[深度学习/Deep_Learning_For_Beginners]] — 深度学习入门：神经网络、梯度下降与主流架构
- [[大模型/LLM_For_Beginners]] — 大语言模型入门：预训练、微调与推理基础
