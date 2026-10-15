---
title: "Agentic Infra（智能体基础设施）"
category: -concepts
tags: ["agentic-infra", "agent-infrastructure", "llm-gateway", "mcp", "sandbox", "agent-memory", "durable-execution", "agent-observability", "agent-security"]
aliases:
  - 智能体基础设施
  - Agent Infra
  - Agentic Infrastructure
relationships:
  - target: "概念/Agent/ai-agents"
    type: supports
  - target: "概念/Agent/agent-protocols"
    type: includes
  - target: "概念/Agent/agent-memory-systems"
    type: includes
  - target: "概念/LLM/ai-gateway-2"
    type: includes
sources:
  - 15_智能体/20_Agentic_Infra/01_Agentic_Infra_全景_2026
summary: "Agentic Infra 是支撑智能体从 demo 走向生产的专用基础设施栈，分七层：模型网关、工具协议（MCP/A2A）、沙箱执行、记忆上下文、持久编排、可观测评估、安全治理。"
lifecycle: reviewed
tier: core
created: 2026-10-14
updated: 2026-10-14

name_zh: "智能体基础设施"
---
# Agentic Infra（智能体基础设施）

> 中文简称：智能体基础设施

> 智能体世界的「水电煤+安保」——模型网关是总机，MCP 是工具插座，沙箱是隔离操作间，记忆层是档案柜，持久编排是断点续跑的流水线，可观测是行车记录仪，安全是安保体系。

---

## 1. 一句话定义

**Agentic Infra** 是让 AI 智能体在生产环境**长期、安全、可控、可观测地工作**的专用技术栈。它与底层 AI Infra（GPU/训练/推理集群）的分野：AI Infra 解决「模型怎么跑」，Agentic Infra 解决「智能体怎么工作」。

---

## 2. 七层栈速览

| 层 | 职责 | 2026 代表 |
|----|------|-----------|
| **L1 模型接入** | 统一 API、路由/降级、成本与鉴权 | LiteLLM、Portkey、Kong、Higress |
| **L2 工具协议** | Agent↔工具、Agent↔Agent 互联 | MCP、A2A（已吸收 ACP） |
| **L3 执行隔离** | 不可信代码/浏览的安全执行 | E2B、Daytona、Modal、CF Sandbox SDK |
| **L4 记忆上下文** | 跨会话记忆、治理上下文漂移 | Mem0、Letta、Zep |
| **L5 持久编排** | 长任务断点续跑、重放审计 | Temporal、Inngest、Restate |
| **L6 可观测评估** | Trace 树、在线评测、回归门禁 | Langfuse、LangSmith、Braintrust |
| **L7 安全治理** | 提示注入限损、最小权限、审计 | OWASP Agentic Top 10、六层控制 |

---

## 3. 关键认知

- **负载形态**：agentic 负载（长上下文、多轮工具调用、KV 复用）已是推理栈第一优化场景；
- **失败模式**：约 65% 企业 agent 故障源于上下文漂移而非模型——记忆与上下文工程是刚需；
- **安全公理**：间接提示注入无法根除，只能限损——网关是唯一入口、沙箱是唯一执行点、工具注册是唯一出网通道。

---

## 4. 相关概念

- [[概念/Agent/agent-protocols|Agent 协议栈]] — L2 层协议细节
- [[概念/Agent/agent-memory-systems|Agent 记忆系统]] — L4 层
- [[概念/LLM/ai-gateway-2|AI 网关]] — L1 层
- [[概念/Agent/agentops|AgentOps]] — L6 运维视角
- [[15_智能体/20_Agentic_Infra/01_Agentic_Infra_全景_2026|全景深度长文]] — 七层栈完整版

---
*Last updated: 2026-10-14*
