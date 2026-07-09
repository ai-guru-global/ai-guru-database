---
title: "Multi-Agent System（多智能体系统）"
category: -concepts
tags: [multi-agent, autogen, crewai, agent-collaboration, a2a-protocol]
aliases:
  - "Multi-Agent"
  - "Multi-Agent System"
  - "MAS"
  - "多智能体"
relationships:
  - target: "_concepts/autogen"
    type: implemented_by
  - target: "_concepts/agent-framework"
    type: belongs_to
  - target: "_concepts/a2a-protocol"
    type: standardized_by
sources:
  - Agent/Agent_Foundations/Multi_Agent_Systems_Guide.md
  - _concepts/autogen.md
summary: "Multi-Agent System（MAS）是多个 LLM Agent 通过协作 / 竞争 / 角色扮演完成复杂任务的系统；2026 年通过 A2A 协议标准化、CrewAI / AutoGen 等框架普及，成为企业级 Agent 应用的主流范式。"
lifecycle: stable
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# Multi-Agent System（多智能体系统）

## 核心要点

- **核心思想**：让多个专业化 Agent 分工协作，比单个全能 Agent 更高效。
- **协作模式**：
  - **层级式（Hierarchical）**：Manager Agent 调度 Worker Agents
  - **对话式（Conversational）**：Agents 之间自由对话（AutoGen 风格）
  - **角色扮演（Role-Playing）**：每个 Agent 有明确角色（CrewAI 风格）
  - **流水线（Pipeline）**：按顺序处理（前一个输出是下一个输入）
  - **黑板模式（Blackboard）**：共享状态空间，多 Agent 读写
- **协作协议**：
  - **A2A Protocol**（Agent-to-Agent）：Google 主导的开放协议
  - **MCP**（Model Context Protocol）：工具调用标准
  - **LangGraph**：图编排

## 一句话解释

> Multi-Agent = "一群 Agent 协作"；不是 1 个 Agent 做所有事，而是让每个 Agent 做自己最擅长的。

## 主流框架

| 框架 | 风格 | 强项 |
|------|------|------|
| **AutoGen**（Microsoft）| 对话式 | 灵活、研究友好 |
| **CrewAI** | 角色扮演 | 上手快、SOP 友好 |
| **LangGraph** | 图编排 | 状态机、复杂流程 |
| **OpenAI Swarm** | 极简 Handoff | 轻量、原生 OpenAI |
| **Anthropic Claude Agent SDK** | 单 Agent 为主 | Claude 原生 |
| **AG2 (AutoGen fork)** | 对话式 | AutoGen 继任者 |

## 典型架构

### 1. Manager-Worker（最常用）
```
        ┌──────────┐
        │ Manager  │
        └────┬─────┘
             │
     ┌───────┼───────┬─────────┐
     ▼       ▼       ▼         ▼
[Researcher] [Coder] [Writer] [Reviewer]
```

### 2. Crew（角色扮演）
```
Crew: ResearchProject
├── Agent: Lead (协调者)
├── Agent: Researcher (搜集资料)
├── Agent: Analyst (分析数据)
└── Agent: Writer (撰写报告)
Task: 各 Agent 按顺序执行自己的任务
```

### 3. Graph（图编排）
```
[Planner] → [Researcher] → [Reviewer]
                ↑              │
                └────[Revise]──┘
```

## 协作模式对比

| 模式 | 适用 | 风险 |
|------|------|------|
| **层级式** | 复杂任务、可控性强 | Manager 可能成为瓶颈 |
| **对话式** | 研究、头脑风暴 | 容易跑题 |
| **角色扮演** | 业务流程（SOP） | 角色定义难 |
| **流水线** | 数据处理、ETL | 单点失败 |
| **黑板** | 多专家协作 | 状态冲突 |

## 何时使用

✅ **推荐**：
- 复杂任务需多视角（研究 + 分析 + 写作）
- 模拟真实组织（销售 / 客服 / 工程团队）
- 业务流程自动化（SOP 明确）
- 角色边界清晰的场景

⚠️ **不推荐**：
- 简单任务（单 Agent 足够）
- 强延迟敏感（多 Agent 增加开销）
- 角色边界模糊

## 关键挑战

| 挑战 | 缓解 |
|------|------|
| **通信开销** | 批量化、共享上下文 |
| **角色混淆** | 明确 system prompt + 边界 |
| **循环陷阱** | 最大步数限制 + 终止条件 |
| **成本失控** | token 配额 + 模型路由（小模型做子任务）|
| **结果不一致** | Reviewer Agent + 校验环节 |

## Related

- [[_concepts/autogen]] — AutoGen
- [[_concepts/agent-framework]] — Agent 框架总览
- [[_concepts/a2a-protocol]] — A2A 协议
- [[Agent/Agent_Foundations/Multi_Agent_Systems_Guide]] — 多 Agent 深度- [[_concepts/multi-agent-orchestration]] — Multi Agent Orchestration
