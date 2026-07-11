---
title: "Model Security"
category: -concepts
tags: ["security", "ai", "model", "adversarial", "privacy", "alibaba-cloud"]
summary: "Model Security（模型安全）是保护 AI 模型免受窃取、逆向、后门、对抗样本等攻击的安全实践。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "模型安全"
relationships:
  - target: "概念/runtime-security"
    type: part_of
  - target: "概念/adversarial-attack"
    type: related_to
sources: []
---

# Model Security

> **一句话理解**: 模型安全就是防止你的模型被坏人「偷走、骗过、或者训练时就被植入了后门」。

## 核心要点

- **模型窃取**: 通过大量 API 查询复制模型行为
- **模型逆向**: 从模型输出推断训练数据
- **后门攻击**: 训练数据中被植入触发器
- **对抗样本**: 微小扰动导致错误输出
- **提示注入**: LLM 场景的特殊攻击

## 防护措施

| 威胁 | 防护 |
|------|------|
| 模型窃取 | 访问控制、水印、速率限制 |
| 数据泄露 | 差分隐私、输出过滤 |
| 后门 | 数据审计、对抗训练 |
| 对抗样本 | 对抗训练、输入校验 |
| 提示注入 | 输入过滤、沙箱执行 |

## 阿里云专有云关联

在阿里云专有云环境中，模型安全可通过模型仓库 RBAC、审计日志、输出内容过滤实现。

## Related

- [[概念/runtime-security|Runtime Security]]
- [[概念/adversarial-attack|Adversarial Attack]]
- [[概念/prompt-injection|Prompt Injection]]
- [[架构基建/Security/AI_Security_Fundamentals|AI 安全基础]]
