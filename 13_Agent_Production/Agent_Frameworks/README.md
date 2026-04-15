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

## 框架选型速查

| 框架 | 协作模式 | 学习曲线 | 生产就绪 | 最佳场景 |
|------|---------|---------|---------|---------|
| **AutoGen** | 对话式 Group Chat | 中等 | 高 | 多角色讨论、代码协作 |
| **CrewAI** | 角色 + 任务编排 | 较低 | 中 | 快速原型、简单分工 |
| **LangGraph** | 状态机 | 较高 | 高 | 复杂工作流、条件分支 |
| **AgentScope** | Actor-Staged | 中等 | 高 | 大规模并发、中文场景 |

## 关联目录

- [Agent Harness](../Agent_Harness/) -- Harness 工程与框架集成
- [Agent Platforms](../Agent_Platforms/) -- Agent 开发平台
- [Enterprise Agent](../Enterprise_Agent/) -- 企业级 Agent 架构

---

*Last updated: 2026-04-14*
