---
title: '记忆与基础设施'
category: '15-agent-production-memory-infrastructure'
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: '> Agent 的"智商"不仅取决于 LLM，还取决于 RAG 检索质量、记忆系统设计和知识管理架构。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
sources: []

---
# 记忆与基础设施

> Agent 的"智商"不仅取决于 LLM，还取决于 RAG 检索质量、记忆系统设计和知识管理架构。

---

## 概述

本目录收录 Agent 记忆系统和 RAG 基础设施的深度解析，涵盖从工作记忆到持久记忆的完整层级，以及 LlamaIndex、MemGPT、向量数据库等核心技术。

## 文档清单

| 文档 | 内容 | 适用角色 |
|------|------|----------|
| [Agent Memory Systems 2026](./Agent_Memory_Systems_2026.md) | AI Agent 记忆系统架构：MemGPT、Mem0、层级记忆、跨会话学习 | 架构师、开发者 |
| [RAG Memory Infrastructure Tools](./RAG_Memory_Infrastructure_Tools.md) | RAG/记忆/基础设施全栈：LlamaIndex、LangChain、Dify、向量库 | 架构师、开发者 |

## 记忆层级速查

| 层级 | 位置 | 容量 | 生存期 | 技术选型 |
|------|------|------|--------|---------|
| **L1 工作记忆** | LLM 上下文窗口 | 128K-200K tokens | 单次请求 | 原生上下文 |
| **L2 短期记忆** | Redis / 内存数据库 | 1-10 MB | 24-48 小时 | Redis + TTL |
| **L3 长期记忆** | 向量数据库 | 无限制 | 永久 | Qdrant / Milvus / Chroma |
| **L4 持续记忆** | 结构化数据库 | 用户数 x 知识量 | 账户生命周期 | PostgreSQL / MongoDB |

## 关联目录

- [Agent Harness](../Agent_Harness/) -- Harness 记忆配置与上下文工程
- [Enterprise Agent](../Enterprise_Agent/) -- 生产环境记忆部署模式
- [RAG系统](../../RAG系统/) -- RAG 系统专题

---

*Last updated: 2026-04-14*

## Related
- [[智能体/Memory_Infrastructure/RAG_Memory_Infrastructure_Tools|RAG、记忆与 Agent 基础设施]]
- [[智能体/Memory_Infrastructure/Agent_Memory_Systems_2026|AI Agent 记忆系统 2026]]
- [[智能体/Memory_Infrastructure/README|记忆与基础设施]]

- [[智能体/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[智能体/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[智能体/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[智能体/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[智能体/Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]


- [[智能体/README|Agent 生产部署 (Agent Production)]]
