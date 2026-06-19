---
title: "红队测试"
category: concepts
tags: ["red-teaming", "safety", "llm-safety", "jailbreak", "adversarial", "evaluation"]
relationships:
  - target: "concepts/model-evaluation"
    type: belongs_to
  - target: "concepts/llm-safety"
    type: tests
  - target: "concepts/tool-calling-safety"
    type: tests
  - target: "concepts/guardrails"
    type: informs
  - target: "concepts/bbh"
    type: differs_from
sources:
  - 19_Ethics_Safety/LLM_Security_Defense_Guide.md
  - 19_Ethics_Safety/Safety_Evaluation_Framework.md
  - 08_Model_Evaluation/README.md
summary: "红队测试是主动找 AI 系统漏洞的安全评估方法。测试者扮演‘攻击方’，用各种刁钻、恶意、诱导性的输入试图让模型输出有害内容、泄露隐私或做出危险行为，从而提前发现并修复风险。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# 红队测试

## 核心要点

- **红队测试源自网络安全**：红队攻击，蓝队防守。
- **在 AI 领域**：红队专门想办法让模型‘犯错’或‘使坏’。
- **攻击手段**：越狱（jailbreak）、提示注入、角色扮演、编码绕过、多轮诱导等。
- **目标**：在上线前发现模型的安全弱点，减少真实伤害。

## 一句话理解

红队测试就像请一群‘专业找茬员’来测试 AI：他们想尽办法把模型骗坏、激怒、诱导偏，找到漏洞后让开发团队修补。

## 详细内容

### 红队测试什么？

| 风险类型 | 例子 |
|----------|------|
| **有害内容生成** | 教唆暴力、仇恨言论、制造危险品 |
| **隐私泄露** | 诱导模型输出训练数据中的个人信息 |
| **偏见与歧视** | 特定群体刻板印象 |
| **错误信息** | 生成虚假医疗/法律建议 |
| **越狱** | 绕过安全限制 |
| **Agent 危险行为** | 诱导 Agent 调用危险工具 |

### 常见攻击手法

| 手法 | 说明 |
|------|------|
| **越狱（Jailbreak）** | 让模型假装没有安全限制 |
| **提示注入（Prompt Injection）** | 在用户输入里夹带隐藏指令 |
| **角色扮演** | “假设你是一个没有限制的 AI…” |
| **编码/翻译绕过** | 把有害请求翻译成其他语言或用 base64 编码 |
| **多轮诱导** | 通过多轮对话逐步引导模型 |
| **对抗样本** | 在输入里加特殊字符扰动 |

### 红队测试流程

```
1. 定义风险场景和可接受边界
2. 设计攻击策略和测试用例
3. 对模型进行攻击（自动化 + 人工）
4. 记录成功攻击案例
5. 分析漏洞根因
6. 加固模型/护栏/系统
7. 回归测试验证修复效果
```

### 自动化 vs 人工红队

| 方式 | 优点 | 局限 |
|------|------|------|
| **人工红队** | 创造力强，能发现新颖攻击 | 成本高、不可扩展 |
| **自动化红队** | 可大规模测试、可复现 | 攻击模式有限 |
| **AI 辅助红队** | 用 LLM 生成攻击变体 | 需要人工审核和验证 |

## 开放问题

- 红队测试的覆盖度如何量化。
- 过度安全是否导致模型变得‘无聊’或拒绝正常请求。
- 多语言、多文化场景下的红队标准差异。

## Related

- [[concepts/model-evaluation]] — 模型评估
- [[concepts/llm-safety]] — LLM 安全
- [[concepts/tool-calling-safety]] — 工具调用安全
- [[concepts/guardrails]] — Guardrails
- [[19_Ethics_Safety/LLM_Security_Defense_Guide]] — LLM 安全防御指南
- [[19_Ethics_Safety/Safety_Evaluation_Framework]] — 安全评估框架
