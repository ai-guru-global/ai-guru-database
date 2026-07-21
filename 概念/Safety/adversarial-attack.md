---
title: "Adversarial Attack"
category: -concepts
tags: ["security", "ai", "adversarial", "model-security", "prompt-injection", "jailbreak"]
summary: "Adversarial Attack（对抗攻击）是指对输入数据添加人眼难以察觉的扰动，使 AI 模型产生错误输出的攻击方式。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "对抗攻击"
  - "对抗样本"
relationships:
  - target: "概念/model-security"
    type: threatens
  - target: "概念/adversarial-training"
    type: mitigated_by
sources: []
---

# Adversarial Attack（对抗攻击）

> **一句话理解**: 对抗攻击 = 「骗过 AI」——在图片或文字上加一点点人类看不出的改动，让模型做出错误判断。

## 定义

Adversarial Attack 是通过对输入数据添加人眼难以察觉的扰动，使 AI 模型产生错误输出的攻击方式。在 LLM 时代，对抗攻击演变为 Prompt Injection、Jailbreak 等新形态。

## 攻击分类

| 维度 | 类型 | 说明 |
|------|------|------|
| **知识** | 白盒 | 攻击者知道模型参数 |
| | 黑盒 | 只能访问输入输出 |
| **目标** | 目标攻击 | 让模型输出指定错误结果 |
| | 非目标攻击 | 让模型输出任意错误结果 |
| **模态** | 视觉 | 图片扰动（CV） |
| | 文本 | Prompt Injection（LLM） |
| | 多模态 | 图片+文本组合攻击 |

## 经典方法

| 方法 | 原理 | 适用 |
|------|------|------|
| **FGSM** | 单步梯度方向扰动 | CV 白盒 |
| **PGD** | 多步迭代 FGSM | CV 白盒 |
| **C&W** | 优化最小扰动 | CV 白盒 |
| **Prompt Injection** | 恶意指令注入 | LLM |
| **Jailbreak** | 绕过安全护栏 | LLM |
| **GCG** | 梯度优化对抗后缀 | LLM 白盒 |

## 2026 年 LLM 对抗攻击现状

| 攻击类型 | 威胁等级 | 典型手法 |
|----------|----------|----------|
| **直接 Prompt Injection** | 🔴 高 | “忽略之前指令...” |
| **间接 Prompt Injection** | 🔴 高 | 网页/文档中嵌入恶意指令 |
| **Jailbreak** | 🟡 中 | DAN、角色扮演、编码绕过 |
| **数据提取** | 🟡 中 | 诱导输出训练数据/系统提示 |
| **对抗图片** | 🟡 中 | 多模态模型图片扰动 |

## 防护措施

| 措施 | 效果 | 适用 |
|------|------|------|
| **对抗训练** | ⭐⭐⭐⭐ | CV 模型 |
| **输入过滤** | ⭐⭐⭐ | LLM |
| **输出检测** | ⭐⭐⭐ | LLM |
| **Guardrails** | ⭐⭐⭐⭐ | LLM |
| **模型鲁棒性验证** | ⭐⭐⭐ | 通用 |
| **红队测试** | ⭐⭐⭐⭐⭐ | LLM |

## 生产最佳实践

1. **LLM 必须部署 Guardrails**：输入/输出双向过滤
2. **定期红队测试**：模拟对抗攻击发现漏洞
3. **多模态输入扫描**：图片 OCR + 文本检测
4. **最小权限原则**：LLM 不直接访问敏感系统
5. **监控异常模式**：检测批量对抗请求

## Related

- [[概念/model-security|Model Security]]
- [[概念/adversarial-training|Adversarial Training]]
- [[概念/Safety/hallucination|Hallucination]] — 对抗攻击可诱发幻觉
- [[架构基建/Security/AI_Security_Fundamentals|AI 安全基础]]
