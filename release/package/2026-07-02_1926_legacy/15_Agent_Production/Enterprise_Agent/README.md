---
title: 企业级 Agent
category: 15-agent-production-enterprise-agent
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 生产部署 ≠ 原型上线 —— 企业级 Agent 需要分层架构、完善监控、CI/CD 流水线，以及严格的安全控制和成本管理。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting

---
# 企业级 Agent

> 生产部署 ≠ 原型上线 —— 企业级 Agent 需要分层架构、完善监控、CI/CD 流水线，以及严格的安全控制和成本管理。

---

## 概述

本目录收录企业级 Agent 生产部署的完整实践，涵盖架构设计、基础设施、安全合规、监控治理和企业级运行时框架。

## 文档清单

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Agent Production 2026](./Agent_Production_2026.md) | Agent 生产部署最佳实践：架构模式、基础设施、监控、CI/CD | 架构师、SRE、开发者 |
| [Enterprise Agent Governance 2026](./Enterprise_Agent_Governance_2026.md) | 智能体治理：注册中心、RBAC、计费配额、全链路可观测性 | 架构师、管理者 |
| [Hermes Agent Deep Dive](./Hermes_Agent_Deep_Dive.md) | 企业级 Agent 运行时：安全沙箱、RBAC、审计、多租户 | 架构师、安全工程师 |

## 核心架构模式

| 模式 | 适用场景 | 特点 |
|------|---------|------|
| **无状态请求-响应** | 文档分析、分类任务 | 简单、易扩展、无记忆 |
| **有状态会话** | 客服机器人、代码助手 | 多轮对话、Session 管理 |
| **事件驱动异步** | 复杂工作流、多 Agent 协作 | 长时间任务、最终一致性 |

## 关键 SLO

| 指标 | 目标 |
|------|------|
| P99 延迟 | <2s (简单), <10s (复杂) |
| 可用性 | 99.9% |
| 错误率 | <0.1% |

## 关联目录

- [Agent Harness](../Agent_Harness/) -- Harness 工程架构
- [Agent Platforms](../Agent_Platforms/) -- Agent 开发平台
- [Memory Infrastructure](../Memory_Infrastructure/) -- 记忆与 RAG 基础设施
- [Agent_Evaluation](../Agent_Evaluation/) -- Agent 评估体系
- [AI运维](../../运维/) -- AI 系统运维

---

*Last updated: 2026-04-14*

## Related
- [[Agent/Enterprise_Agent/Hermes_Agent_Deep_Dive|Hermes Agent: 面向企业级的 AI Agent 运行时框架]]
- [[Agent/Enterprise_Agent/README|企业级 Agent]]
- [[Agent/Enterprise_Agent/Agent_Production_2026|AI Agent 生产部署最佳实践 2026]]

- [[Agent/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)


- [[Agent/README|Agent 生产部署 (Agent Production)]]
