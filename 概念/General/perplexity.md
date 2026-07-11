---
title: 困惑度（Perplexity, PPL）
category: concepts
tags:
  - llm
  - evaluation
  - perplexity
  - ppl
  - language-modeling
  - metric
aliases:
  - Perplexity
  - PPL
  - 困惑度
  - 语言模型困惑度
relationships:
  - target: "概念/pre-training"
    type: evaluates
  - target: "概念/next-token-prediction"
    type: measures
  - target: "概念/model-evaluation"
    type: belongs_to
summary: 困惑度（PPL）衡量语言模型对测试数据的预测能力，越低表示模型对文本的建模越好。它等价于模型交叉熵损失的几何平均的指数。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# 困惑度（Perplexity, PPL）

## 一句话总结

困惑度（PPL）衡量语言模型对一段文本的“惊讶程度”：PPL 越低，模型对文本的预测越准确。

---

## 数学定义

给定包含 `N` 个 token 的测试序列，困惑度为：

```
PPL = exp(-1/N × sum_{i=1}^{N} log P(t_i | t_1, ..., t_{i-1}))
```

它等价于交叉熵损失的几何平均的指数：

```
PPL = exp(L_cross_entropy)
```

---

## 直观理解

- **PPL = 100**：相当于模型每次从 100 个等概率候选中猜下一个 token。
- **PPL = 2**：相当于模型每次从 2 个候选中猜，预测非常准确。

因此，PPL 可以理解为模型面临的“有效选择数量”。

---

## 计算示例

```python
import torch
import torch.nn.functional as F

# logits: [batch, seq_len, vocab_size]
# labels: [batch, seq_len]
loss = F.cross_entropy(
    logits.view(-1, vocab_size),
    labels.view(-1),
    reduction='mean'
)
ppl = torch.exp(loss)
```

---

## 为什么 PPL 重要？

| 作用 | 说明 |
|---|---|
| **训练监控** | 观察模型是否在学习 |
| **模型对比** | 同领域、同词表下比较不同模型 |
| **过拟合检测** | 训练 PPL 持续下降但验证 PPL 上升，说明过拟合 |
| **数据质量评估** | 异常低的 PPL 可能表示数据泄漏 |

---

## PPL 的局限性

| 局限 | 说明 |
|---|---|
| **不直接反映生成质量** | PPL 低不等于生成文本有用、流畅 |
| **对短文本敏感** | 短句的 PPL 波动大 |
| **词表影响** | 不同 tokenizer 的 PPL 不可直接比较 |
| **不衡量安全性** | 无法反映有害、偏见内容 |
| **无法评估指令遵循** | PPL 是语言建模指标，不是指令任务指标 |

---

## PPL 与损失的关系

| Loss | PPL |
|---|---|
| 0.0 | 1.0 |
| 1.0 | 2.72 |
| 2.0 | 7.39 |
| 3.0 | 20.09 |
| 4.0 | 54.60 |

主流大模型在大量数据上的 PPL 通常在 **2 ~ 10** 之间，具体取决于领域和词表。

---

## 下游任务指标 vs PPL

| 指标 | 评估能力 |
|---|---|
| **PPL** | 语言建模能力 |
| **BLEU/ROUGE** | 生成质量（对比参考文本）|
| **Exact Match** | 问答、代码精确匹配 |
| **Human Evaluation** | 有用性、安全性、流畅性 |

---

## 延伸阅读

- [[概念/pre-training|预训练]]
- [[概念/next-token-prediction|下一个 Token 预测]]
- [[概念/model-evaluation|模型评估]]
