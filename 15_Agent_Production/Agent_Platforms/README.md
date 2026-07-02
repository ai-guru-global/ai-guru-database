---
title: Agent 平台与部署
category: 15-agent-production-agent-platforms
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> Agent 开发平台提供可视化编排、一键部署、模型网关等能力，大幅降低 Agent 系统的构建门槛。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

---
# Agent 平台与部署

> Agent 开发平台提供可视化编排、一键部署、模型网关等能力，大幅降低 Agent 系统的构建门槛。

---

## 概述

本目录收录 Agent 开发平台和模型网关的深度解析，覆盖开源平台、企业平台和统一模型网关。

## 文档清单

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Dify / Coze / LocalAI](./Dify_Coze_MLServe_Dive.md) | Agent 平台对比：开源 vs 企业 vs 本地 | 产品经理、架构师 |
| [OpenRouter Deep Dive](./OpenRouter_Deep_Dive.md) | 统一模型网关：智能路由、成本优化、多模型聚合 | 架构师、开发者 |
| [PromptFlow Deep Dive](./PromptFlow_Deep_Dive.md) | 微软工作流编排：可视化流程、评估追踪 | 开发者、企业用户 |

## 平台选型速查

| 平台 | 定位 | 部署方式 | 最佳场景 |
|------|------|---------|---------|
| **Dify** | 开源 Agent 平台 | 私有/云端 | 可视化编排、私有部署 |
| **Coze** | 企业 Bot 平台 | 云端 | 快速上线、企业工作流 |
| **LocalAI** | 本地 LLM 网关 | 完全本地 | 数据不出境、隐私优先 |
| **OpenRouter** | 统一模型网关 | SaaS | 多模型路由、成本优化 |

## 关联目录

- [Agent Frameworks](../Agent_Frameworks/) -- 底层开发框架
- [Enterprise Agent](../Enterprise_Agent/) -- 企业级生产部署
- [Memory Infrastructure](../Memory_Infrastructure/) -- RAG 与记忆基础设施

---

*Last updated: 2026-04-14*

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)

- [[15_Agent_Production/README|Agent 生产部署 (Agent Production)]]
