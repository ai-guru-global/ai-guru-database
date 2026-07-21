---
title: "工具调用安全"
category: -concepts
tags: ["tool-calling", "function-calling", "safety", "agent-security", "guardrails", "mcp"]
relationships:
  - target: "概念/ai-agents"
    type: secures
  - target: "概念/tool-calling"
    type: secures
  - target: "概念/guardrails"
    type: uses
  - target: "概念/red-teaming"
    type: tested_by
sources:
  - Agent/Agent_Skills/Agent_Skills_Multi_Role_Analysis.md
  - 伦理安全/LLM_Security_Defense_Guide.md
  - Agent/Agentic_Design_Patterns_AndrewNg.md
summary: "工具调用安全是指防止 AI Agent 在调用外部工具（函数、API、数据库、代码执行）时造成危害的一整套防护措施。核心风险包括越权操作、数据泄露、恶意输入、错误调用链和不可控的自主行为。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Tool Calling Safety"
  - "tool calling safety"

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
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

## 2026 年工具调用安全生态

| 技术/框架 | 功能 | 适用场景 |
|-----------|------|----------|
| **MCP 安全策略** | 工具描述 + 权限控制 + 审计 | MCP 生态 |
| **Nemo Guardrails** | 输入/输出护栏 + 工具调用拦截 | NVIDIA 生态 |
| **Llama Guard 3** | 工具调用意图检测 | 开源部署 |
| **E2B Sandbox** | 代码执行沙箱隔离 | 代码工具 |
| **OpenAI Function Calling** | 严格 Schema + parallel_tool_calls | API 层 |
| **Anthropic Tool Use** | 权限分级 + human-in-the-loop | Claude 生态 |

## 生产最佳实践

1. **最小权限原则**：每个工具只给最小必要权限，默认拒绝
2. **不可回滚操作必须人工确认**：删除、转账、发送邮件等
3. **全程审计**：记录谁、何时、为什么、调用了什么、结果如何
4. **参数严格校验**：Schema 校验 + 类型检查 + 范围检查，拒绝注入
5. **熔断与限流**：异常调用自动停止，防止无限循环

## 开放问题

- 多 Agent 协作时的责任归属与权限传递。
- 工具描述（function schema）被 prompt 注入利用的风险。
- 自主 Agent 的“停止条件”如何保证。

## Related

- [[概念/ai-agents]] — AI Agent
- [[概念/tool-calling]] — 工具调用
- [[概念/guardrails]] — Guardrails 安全护栏
- [[概念/red-teaming]] — 红队测试
- [[伦理安全/LLM_Security_Defense_Guide]] — LLM 安全防御指南
- [[智能体/Agent_Skills/Agent_Skills_Multi_Role_Analysis]] — Agent 技能多角色分析
- [[概念/agent-production-deployment|Agent 生产部署]] — 工具安全在生产部署中的落地
- [[治理/Production_Safety_Policy|生产安全策略]] — 风险评估与操作安全规范
