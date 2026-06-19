---
title: "LLM 安全"
category: concepts
tags: ["llm-safety", "ai-safety", "guardrails", "red-teaming", "jailbreak", "alignment"]
relationships:
  - target: "concepts/ai-ethics"
    type: belongs_to
  - target: "concepts/guardrails"
    type: uses
  - target: "concepts/red-teaming"
    type: tested_by
  - target: "concepts/tool-calling-safety"
    type: secures
sources:
  - 19_Ethics_Safety/LLM_Security_Defense_Guide.md
  - 19_Ethics_Safety/Safety_Evaluation_Framework.md
summary: "LLM 安全是确保大模型不被滥用、不造成伤害、不泄露隐私的一整套技术与治理措施。包括训练阶段的对齐、推理阶段的护栏、上线后的红队测试与监控。"
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

# LLM 安全

## 核心要点

- **LLM 安全不仅是不让模型说脏话**，还包括防止有害内容、隐私泄露、偏见歧视、越狱攻击、Agent 危险行为。
- **覆盖全生命周期**：预训练数据过滤 → 对齐训练 → 推理护栏 → 红队测试 → 上线监控。
- **技术与治理并重**：既要有 Guardrails、RLHF 等技术手段，也要有政策、流程、人工审核。

## 一句话理解

LLM 安全就像给大模型装了一套“刹车系统和安全带”：让它跑得快，也能在危险时及时停下。

## 详细内容

### 主要风险

- 有害内容生成
- 隐私与数据泄露
- 偏见与歧视
- 越狱与提示注入
- 错误信息传播
- Agent/工具调用越权

### 防护措施

| 层次 | 措施 |
|------|------|
| 数据层 | 预训练去毒、去隐私 |
| 训练层 | RLHF、DPO、安全微调 |
| 推理层 | Guardrails、输出过滤 |
| 系统层 | 权限控制、审计、监控 |
| 评估层 | 红队测试、安全基准 |

## Related

- [[concepts/guardrails]] — Guardrails
- [[concepts/red-teaming]] — 红队测试
- [[concepts/tool-calling-safety]] — 工具调用安全
- [[concepts/ai-ethics]] — AI 伦理
- [[19_Ethics_Safety/LLM_Security_Defense_Guide]] — LLM 安全防御指南
