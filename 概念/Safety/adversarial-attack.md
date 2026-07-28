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
name_zh: "对抗攻击"
---

# Adversarial Attack（对抗攻击）

> 中文简称：对抗攻击

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
- [[12_架构基建/10_Security/AI_Security_Fundamentals|AI 安全基础]]

## 对抗攻击技术演进

```
对抗攻击演进:
2014: FGSM (Goodfellow) — 单步梯度攻击
2017: PGD/C&W — 多步优化攻击
2019: 对抗补丁 — 物理世界攻击
2023: Prompt Injection — LLM 时代
2024: 间接注入 + 多模态攻击
2025: Agent 工具滥用 + MCP 攻击
2026: 自动化红队 + AI 对抗 AI
```

## LLM 对抗攻击代码示例

```python
# 使用 Garak 进行 LLM 安全测试
import garak
from garak.probes import dan, promptinject

# DAN 越狱测试
dan_probe = dan.DAN()
results = dan_probe.run(model="gpt-4o")

# Prompt Injection 测试
pi_probe = promptinject.PromptInject()
results = pi_probe.run(model="gpt-4o")

# 分析结果
for r in results:
    if r.success:
        print(f"❗ 漏洞: {r.prompt[:80]}...")
```

## 对抗训练示例

```python
# 对抗训练提升鲁棒性 (CV)
import torch
from art.attacks.evasion import ProjectedGradientDescent
from art.estimators.classification import PyTorchClassifier

# 创建分类器
classifier = PyTorchClassifier(model=model, loss=criterion,
                               optimizer=optimizer, input_shape=(3,32,32))

# PGD 攻击生成对抗样本
attack = ProjectedGradientDescent(estimator=classifier, eps=8/255)
adv_examples = attack.generate(x=test_images)

# 对抗训练
classifier.fit(adv_examples, labels)
```

## 2026 对抗攻击工具链

| 工具 | 功能 | 类型 | 状态 |
|------|------|------|------|
| **Garak** | LLM 漏洞扫描 | 开源 | GA |
| **ART** | 对抗鲁棒性工具 | 开源 | GA |
| **Counterfit** | 对抗攻击模拟 | 开源 | GA |
| **TextAttack** | 文本对抗攻击 | 开源 | GA |
| **Adversarial Robustness Toolbox** | 综合工具箱 | 开源 | GA |

## 延伸阅读

- [[概念/Safety/model-security|模型安全]] — 模型层安全防护
- [[概念/Safety/hallucination|幻觉]] — 对抗攻击可诱发幻觉
- [[概念/Safety/runtime-security|运行时安全]] — 运行时威胁检测
- [[12_架构基建/10_Security/AI_Security_Fundamentals|AI 安全基础]] — 安全架构

> ℹ️ 对抗攻击是 AI 系统的持久威胁，需要持续红队测试和多层防护。

## 红队测试流程

```
红队测试流程:
1. 范围定义 → 确定测试目标和边界
2. 信息收集 → 了解系统架构和接口
3. 攻击模拟 → 执行各类对抗攻击
   - Prompt Injection (直接/间接)
   - Jailbreak (DAN/角色扮演/编码)
   - 数据提取 (系统提示/训练数据)
   - 多模态攻击 (图片+文本)
4. 漏洞记录 → 详细记录成功攻击
5. 报告输出 → 风险评级 + 修复建议
6. 修复验证 → 确认修复有效
```

## 对抗攻击风险评级

| 等级 | 说明 | 响应时间 |
|------|------|----------|
| **严重 (Critical)** | 可远程执行代码/数据泄露 | 24h |
| **高 (High)** | 可绕过安全护栏 | 72h |
| **中 (Medium)** | 可诱发有害输出 | 1周 |
| **低 (Low)** | 轻微影响输出质量 | 下次迭代 |

## 延伸阅读

- [[概念/Safety/model-security|模型安全]] — 模型层安全防护
- [[概念/Safety/hallucination|幻觉]] — 对抗攻击可诱发幻觉
- [[概念/Safety/runtime-security|运行时安全]] — 运行时威胁检测
- [[12_架构基建/10_Security/AI_Security_Fundamentals|AI 安全基础]] — 安全架构

> ℹ️ 对抗攻击是 AI 系统的持久威胁，需要持续红队测试和多层防护。
> 生产环境建议每季度进行一次红队测试，并建立漏洞响应流程。
> Agent 系统需特别注意工具调用权限控制，防止对抗攻击导致工具滥用。
> 多模态模型需对图片输入进行 OCR + 文本检测，防止图片中嵌入恶意指令。
> 定期更新护栏规则，跟踪最新攻击手法。
> 建立对抗攻击知识库，沉淀历史攻击案例和修复方案。
> 关键系统建议部署多层护栏，输入过滤 + 输出检测 + 行为监控。
> 对抗攻击与防护是持续演进的军备竞赛，需保持警惕。
