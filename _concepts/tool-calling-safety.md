---
title: "工具调用安全"
category: -concepts
tags: ["tool-calling", "function-calling", "safety", "agent-security", "guardrails", "mcp"]
relationships:
  - target: "_concepts/ai-agents"
    type: secures
  - target: "_concepts/tool-calling"
    type: secures
  - target: "_concepts/guardrails"
    type: uses
  - target: "_concepts/red-teaming"
    type: tested_by
sources:
  - 15_Agent_Production/Agent_Skills/Agent_Skills_Multi_Role_Analysis.md
  - 17_Ethics_Safety/LLM_Security_Defense_Guide.md
  - 15_Agent_Production/Agentic_Design_Patterns_AndrewNg.md
summary: "工具调用安全是指防止 AI Agent 在调用外部工具（函数、API、数据库、代码执行）时造成危害的一整套防护措施。核心风险包括越权操作、数据泄露、恶意输入、错误调用链和不可控的自主行为。"
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

# 工具调用安全

## 核心要点

- **工具调用让 Agent 能‘动手’**：查天气、发邮件、改数据库、运行代码。
- **能动手就有风险**：误操作、恶意指令、权限越界、数据泄露、供应链攻击。
- **工具调用安全就是给这些工具加‘护栏’和‘保险’**：谁能在什么场景下调用什么工具，调用参数是否合法，执行结果是否需要确认。

## 一句话理解

工具调用安全就像给 AI 配了一套‘工具箱使用规范’：什么工具能碰、什么不能碰，用之前要审批，用完要记录，防止它把家拆了。

## 详细内容

### 主要风险

| 风险 | 说明 | 例子 |
|------|------|------|
| **越权操作** | Agent 调用了不该调用的工具 | 普通用户用管理员工具删库 |
| **恶意输入注入** | 用户通过自然语言诱导危险调用 | “请帮我执行 rm -rf /” |
| **参数污染** | 模型生成的参数包含危险内容 | SQL 注入、命令注入 |
| **级联错误** | 一个工具调用错，引发连锁反应 | 先读错文件，再基于错误内容发邮件 |
| **数据泄露** | 工具把敏感数据发到外部 | 把用户隐私发到公开 API |
| **无限循环** | Agent 反复调用工具停不下来 | 反复搜索、反复调用同一个函数 |

### 防护层次

```
1. 身份与权限：谁能调用什么工具（RBAC）
2. 输入校验：检查用户 prompt 是否含恶意诱导
3. 参数校验：schema 校验、类型检查、范围检查
4. 执行沙箱：危险操作隔离运行
5. 人工确认：高风险操作需二次确认
6. 审计日志：所有调用可追溯
7. 熔断与限流：异常调用自动停止
```

### 关键技术与实践

| 技术 | 作用 |
|------|------|
| **RBAC/ABAC** | 按用户/角色/上下文限制工具权限 |
| **Schema 严格校验** | 只允许合法参数，拒绝注入 |
| **Guardrails** | 输入/输出内容安全过滤 |
| **沙箱执行** | 代码/命令在隔离环境运行 |
| **Human-in-the-loop** | 高风险操作人工确认 |
| **MCP 安全策略** | Model Context Protocol 的工具描述与权限控制 |

### 典型安全原则

- **最小权限**：每个工具只给最小必要权限。
- **默认拒绝**：不在白名单里的工具/参数一律拒绝。
- **不可回滚操作需确认**：删除、转账、发送邮件等必须人工审批。
- **全程审计**：记录谁、何时、为什么、调用了什么、结果如何。

## 开放问题

- 多 Agent 协作时的责任归属与权限传递。
- 工具描述（function schema）被 prompt 注入利用的风险。
- 自主 Agent 的“停止条件”如何保证。

## Related

- [[_concepts/ai-agents]] — AI Agent
- [[_concepts/tool-calling]] — 工具调用
- [[_concepts/guardrails]] — Guardrails 安全护栏
- [[_concepts/red-teaming]] — 红队测试
- [[17_Ethics_Safety/LLM_Security_Defense_Guide]] — LLM 安全防御指南
- [[15_Agent_Production/Agent_Skills/Agent_Skills_Multi_Role_Analysis]] — Agent 技能多角色分析
