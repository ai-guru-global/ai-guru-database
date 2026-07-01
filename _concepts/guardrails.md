---

title: "AI Guardrails (AI 护栏)"
tags: [guardrails, llm-security, agent-harness, input-validation, output-moderation, hitl]
created: 2026-06-17
tier: core
aliases:
  - Guardrails
category: -concepts
lifecycle: stable

relationships:
---

# AI Guardrails (AI 护栏)

## 定义

AI Guardrails 是围绕 LLM 和智能体系统构建的多层安全防护体系，通过输入过滤、输出审核、工具权限控制、沙箱隔离和人工审批等机制，确保 AI 系统在可控边界内运行。护栏不是单一功能模块，而是渗透在系统架构各层的安全非功能属性。

## 核心机制

### 输入输出过滤

**多层输入验证架构**：

```
格式验证 -> 长度检查 -> 编码规范化 -> 模式检测 -> 语义分析
```

| 验证层次 | 技术 | 目标 |
|