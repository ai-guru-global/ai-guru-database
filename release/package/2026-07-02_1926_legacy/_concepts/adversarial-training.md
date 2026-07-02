---
title: "Adversarial Training"
category: -concepts
tags: ["security", "ai", "adversarial", "model-training", "robustness", "alibaba-cloud"]
summary: "Adversarial Training（对抗训练）是在训练过程中加入对抗样本，提升模型对对抗攻击鲁棒性的方法。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "对抗训练"
relationships:
  - target: "_concepts/adversarial-attack"
    type: mitigates
  - target: "_concepts/model-security"
    type: improves
---

# Adversarial Training

> **一句话理解**: 对抗训练就是「用假样本一起训练」，让模型见过各种使坏的输入，从而变得更扛骗。

## 核心要点

- **生成对抗样本**: 在训练时构造扰动
- **联合训练**: 原始样本 + 对抗样本一起训练
- **提升鲁棒性**: 降低对抗攻击成功率
- **代价**: 可能轻微降低 clean accuracy

## 常见方法

- **FGSM**: Fast Gradient Sign Method
- **PGD**: Projected Gradient Descent
- **TRADES**: 平衡准确率和鲁棒性

## 阿里云专有云关联

在阿里云专有云环境中，视觉类和 NLP 类安全敏感模型可采用对抗训练提升鲁棒性。

## Related

- [[_concepts/adversarial-attack|Adversarial Attack]]
- [[_concepts/model-security|Model Security]]
- [[12_Architecture_Infrastructure/Security/AI_Security_Fundamentals|AI 安全基础]]
