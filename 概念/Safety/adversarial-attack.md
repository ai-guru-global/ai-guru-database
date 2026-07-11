---
title: "Adversarial Attack"
category: -concepts
tags: ["security", "ai", "adversarial", "model-security", "alibaba-cloud"]
summary: "Adversarial Attack（对抗攻击）是指对输入数据添加人眼难以察觉的扰动，使 AI 模型产生错误输出的攻击方式。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "对抗攻击"
relationships:
  - target: "概念/model-security"
    type: threatens
  - target: "概念/adversarial-training"
    type: mitigated_by
sources: []
---

# Adversarial Attack

> **一句话理解**: 对抗攻击就是「骗过 AI」——在图片或文字上加一点点人类看不出的改动，让模型做出错误判断。

## 核心要点

- **白盒攻击**: 攻击者知道模型参数
- **黑盒攻击**: 攻击者只能访问模型输入输出
- **目标攻击**: 让模型输出指定错误结果
- **非目标攻击**: 让模型输出任意错误结果
- **常见方法**: FGSM、PGD、C&W

## 防护措施

- 对抗训练
- 输入预处理
- 模型鲁棒性验证
- 输出异常检测

## 阿里云专有云关联

在阿里云专有云环境中，视觉类和 NLP 类模型服务需部署对抗样本检测与输入过滤。

## Related

- [[概念/model-security|Model Security]]
- [[概念/adversarial-training|Adversarial Training]]
- [[架构基建/Security/AI_Security_Fundamentals|AI 安全基础]]
