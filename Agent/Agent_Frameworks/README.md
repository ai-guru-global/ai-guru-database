---
title: Agent 开发框架
category: 15-agent-production-agent-frameworks
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 多 Agent 开发框架是构建协作式 Agent 系统的核心基础设施，从对话式协作到状态机编排各有特色。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

---
# Agent 开发框架

> 多 Agent 开发框架是构建协作式 Agent 系统的核心基础设施，从对话式协作到状态机编排各有特色。

---

## 概述

本目录收录主流多 Agent 开发框架的深度对比与实践指南，帮助团队根据场景选择合适的框架。

## 文档清单

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [AutoGen / CrewAI / LangGraph](./AutoGen_CrewAI_LangGraph_Dive.md) | 三大框架对比：对话式、角色编排、状态机 | 开发者、架构师 |
| [AgentScope Deep Dive](./AgentScope_Deep_Dive.md) | 阿里巴巴多智能体平台：Actor-Staged 架构、大规模并发 | 开发者、架构师 |
| [AutoGPT Deep Dive](./AutoGPT_Deep_Dive.md) | 自主任务执行 Agent：目标分解、自主规划、反思改进 | 开发者、探索者 |
| [SmolAgents Deep Dive](./SmolAgents_Deep_Dive.md) | HuggingFace 轻量级框架：代码执行、多工具集成 | HF 生态用户 |
| [agno Deep Dive](./Agno_Deep_Dive.md) | 现代化 Agent 框架：知识库、记忆系统、多 Agent 协作 | 快速构建生产级 Agent |
| [LangChain Deep Dive](./LangChain_Deep_Dive.md) | LLM 应用框架：组件化、LCEL、工具集成 | 开发者、架构师 |
| [LangChain Agents Deep Dive](./LangChain_Agents_Deep_Dive.md) | 工具调用框架：ReAct、Plan-and-Execute、工具绑定 | Agent 开发、工具集成 |
| [Transformers Agents Deep Dive](./Transformers_Agents_Deep_Dive.md) | HuggingFace Agent 框架：代码执行、多模态工具 | HF 生态、多模态 Agent |
| [CrewAI Deep Dive](./CrewAI_Deep_Dive.md) | 多 Agent 协作框架：角色定义、任务编排、团队协作 | 快速原型、团队协作 |
| [AutoGen Deep Dive](./AutoGen_Deep_Dive.md) | 微软多 Agent 框架：对话式协作、Group Chat、Human-in-the-loop | 企业应用、代码协作 |

## 框架选型速查

| 框架 | 协作模式 | 学习曲线 | 生产就绪 | 最佳场景 |
|------|---------|---------|---------|---------|
| **AutoGen** | 对话式 Group Chat | 中等 | 高 | 多角色讨论、代码协作 |
| **CrewAI** | 角色 + 任务编排 | 较低 | 中 | 快速原型、简单分工 |
| **LangGraph** | 状态机 | 较高 | 高 | 复杂工作流、条件分支 |
| **AgentScope** | Actor-Staged | 中等 | 高 | 大规模并发、中文场景 |
| **AutoGPT** | 自主规划执行 | 中等 | 中 | 复杂多步骤任务、研究 |
| **SmolAgents** | 代码驱动 | 低 | 中 | HuggingFace 生态、快速实验 |
| **agno** | 知识+记忆内置 | 较低 | 高 | 文档问答、个人助手 |
| **LangChain** | 链式组合 | 中等 | 高 | LLM 应用开发 |
| **Transformers Agents** | 代码驱动 + 多模态 | 较低 | 中 | HuggingFace 生态、多模态 |
| **LangChain Agents** | 工具调用 ReAct | 中等 | 高 | 工具调用、自主决策 |

## 关联目录

- [Agent Harness](../Agent_Harness/) -- Harness 工程与框架集成
- [Agent Platforms](../Agent_Platforms/) -- Agent 开发平台
- [Enterprise Agent](../Enterprise_Agent/) -- 企业级 Agent 架构

---

*Last updated: 2026-04-14*

## Related
- [[15_Agent_Production/Agent_Frameworks/AutoGPT_Deep_Dive|AutoGPT: 自主任务执行 Agent]]
- [[15_Agent_Production/Agent_Frameworks/Transformers_Agents_Deep_Dive|Transformers Agents: HuggingFace Agent 框架]]
- [[15_Agent_Production/Agent_Frameworks/CrewAI_Deep_Dive|CrewAI: 多 Agent 协作框架]]
- [[15_Agent_Production/Agent_Frameworks/SmolAgents_Deep_Dive|SmolAgents: 轻量级 Agent 框架]]
- [[15_Agent_Production/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive|多 Agent 开发框架: AutoGen / CrewAI / LangGraph]]
- [[15_Agent_Production/Agent_Frameworks/AutoGen_Deep_Dive|AutoGen: 微软多 Agent 框架]]
- [[15_Agent_Production/Agent_Frameworks/Agno_Deep_Dive|agno: 现代 AI Agent 框架]]
- [[15_Agent_Production/Agent_Frameworks/AgentScope_Deep_Dive|AgentScope: 阿里巴巴多智能体开发平台]]
- [[15_Agent_Production/Agent_Frameworks/LangChain_Deep_Dive|LangChain: LLM 应用开发框架]]

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)


- [[15_Agent_Production/README|Agent 生产部署 (Agent Production)]]
