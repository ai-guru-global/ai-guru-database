---
title: 自监督学习 (Self-Supervised Learning)
category: "03-deep-learning"
tags: ["self-supervised-learning", "contrastive-learning", "masked-modeling"]
summary: "自监督学习从未标注数据中构造监督信号，是现代 AI 预训练的核心范式。"
created: 2026-06-04
updated: 2026-06-04
---

# 自监督学习 (Self-Supervised Learning)

> **一句话理解**: 不需要人工标注，让数据自己「教」模型——通过构造预测任务（遮住一部分预测另一部分），从海量无标注数据中学习通用表示。

---

## 核心内容

- [自监督学习深度解读](./Self_Supervised_Learning_Deep_Dive.md) — 从对比学习到掩码建模，全面覆盖 SSL 三大范式

## 关键方法

| 范式 | 代表方法 | 核心思想 |
|------|----------|----------|
| **对比学习** | SimCLR, MoCo, BYOL | 正样本拉近，负样本推远 |
| **掩码建模** | MAE, BEiT, BERT | 遮住输入，重建原始内容 |
| **自回归预测** | GPT, PixelCNN | 从左到右/从上到下预测 |

## 适用读者

- 理解 LLM 预训练范式的 NLP 从业者
- 需要利用无标注数据的 CV 研究者
- 关注 Foundation Model 训练策略的工程师
