---
title: 大模型预训练（Pre-training）
category: concepts
tags:
  - llm
  - training
  - pre-training
  - next-token-prediction
  - self-supervised
  - foundation-model
aliases:
  - Pre-training
  - 预训练
  - 自监督预训练
  - Foundation Model Training
relationships:
  - target: "_concepts/sft"
    type: precedes
  - target: "_concepts/rlhf"
    type: precedes
  - target: "_concepts/distributed-training"
    type: depends_on
  - target: "_concepts/mixed-precision"
    type: uses
  - target: "_concepts/transformer-architecture"
    type: built_on
summary: 大模型预训练是在大规模无标注文本上进行自监督学习的过程，目标是让模型掌握语言结构、世界知识和推理能力，是后续 SFT、RLHF 等对齐阶段的基础。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# 大模型预训练（Pre-training）

## 一句话总结

预训练是在海量无标注文本上通过“预测下一个 token”任务学习通用语言表示和世界知识的过程，是整个 LLM 训练流程的**第一阶段和基础**。

---

## 核心任务

预训练的标准任务是**自回归语言建模（Autoregressive Language Modeling）**：

```
L = - sum_t log P(t_t | t_1, t_2, ..., t_{t-1}; θ)
```

给定前面的 token，预测下一个 token。模型通过最大化训练数据的似然来学习参数 `θ`。

---

## 三要素

### 1. 数据

| 方面 | 说明 |
|---|---|
| **规模** | 通常数千亿到数万亿 token |
| **来源** | 网页、书籍、代码、论文、对话、科学文献等 |
| **质量** | 去重、过滤低质/有害内容、版权合规 |
| **配比** | 代码、百科、网页、书籍的比例显著影响模型能力 |

#### 数据配比的影响

- **代码数据比例高**：提升推理、数学、结构化思维能力。
- **书籍/论文比例高**：提升知识深度和语言表达。
- **网页数据比例高**：增加多样性但噪声也多。

### 2. 算力

| 指标 | 说明 |
|---|---|
| **GPU/TPU 数量** | 数千张高端 GPU/TPU |
| **训练时间** | 数周到数月 |
| **成本** | 数百万到数千万美元 |
| **能耗** | 非常高 |

### 3. 算法

| 组件 | 常见选择 |
|---|---|
| **架构** | Decoder-only Transformer（GPT 风格）|
| **优化器** | AdamW |
| **学习率调度** | Warmup + Cosine Decay |
| ** batch size** | 大 batch（百万级 token）|
| **精度** | FP16/BF16 混合精度 |
| **分布式** | 数据并行 + 张量并行 + 流水线并行 |

---

## 预训练的目标

预训练让模型获得以下能力：

| 能力 | 来源 |
|---|---|
| **语法与语义** | 大量文本中的统计规律 |
| **世界知识** | 百科、书籍、网页中的事实 |
| **推理能力** | 代码、数学、科学文献 |
| **上下文学习** | 长序列中的模式匹配 |
| **多语言/多领域** | 多语言、多领域数据分布 |

---

## 预训练 vs 微调

| 维度 | 预训练 | 微调（SFT）|
|---|---|---|
| **数据** | 无标注、大规模 | 有标注、相对小规模 |
| **任务** | 下一个 token 预测 | 指令跟随、特定任务 |
| **计算成本** | 极高 | 较低 |
| **目标** | 学习通用能力 | 学习特定格式和行为 |
| **参数更新** | 全部参数 | 全部或部分（如 LoRA）|

---

## 训练稳定性挑战

| 问题 | 解决方案 |
|---|---|
| **Loss 尖峰** | 学习率回滚、梯度裁剪、检查点恢复 |
| **梯度爆炸** | 梯度裁剪（gradient clipping）|
| **显存不足** | 混合精度、Gradient Checkpointing、ZeRO |
| **训练崩溃** | 小学习率、稳定初始化、数据清洗 |
| **数据重复** | 严格去重、控制数据 epoch 数 |

---

## 评估指标

| 指标 | 说明 |
|---|---|
| **Perplexity（PPL）** | 困惑度，越低越好 |
| **Loss 曲线** | 训练/验证损失是否平稳下降 |
| **下游任务** | 在标准基准上零样本/少样本测试 |
| **语料内评估** | 语言建模能力、代码能力等 |

---

## 持续预训练（Continued Pre-training）

在通用预训练基础上，继续在某些领域数据上训练：

- **用途**：医疗、法律、金融等垂直领域。
- **注意**：学习率通常比预训练低 10~100 倍，避免灾难性遗忘。
- **数据**：领域书籍、论文、对话、代码等。

---

## 延伸阅读

- [[_concepts/llm-training-checklist|训练检查清单]]
- [[_concepts/next-token-prediction|下一个 Token 预测]]
- [[_concepts/causal-mask|因果掩码]]
- [[_concepts/perplexity|困惑度 PPL]]
- [[_concepts/sft|监督微调 SFT]]
- [[_concepts/rlhf|RLHF]]
- [[_concepts/dpo|DPO]]
- [[_concepts/distributed-training|分布式训练]]
- [[_concepts/mixed-precision|混合精度训练]]
- [[_concepts/transformer-architecture|Transformer 架构]]
