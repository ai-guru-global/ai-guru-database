---
title: "LangGraph"
category: concepts
tags: ["langgraph", "langchain", "agent", "workflow", "state-machine"]
summary: "LangGraph 是 LangChain 生态中的图编排框架，用状态机（StateGraph）把 LLM、工具、记忆和人机交互组织成可控的循环工作流，适合复杂 Agent 与多 Agent 协作场景。"
created: 2026-07-02
updated: 2026-07-02
aliases:
  - "Langgraph"
sources: []
---

# LangGraph

## 一句话定义

**LangGraph** 是 LangChain 团队推出的图编排（graph orchestration）框架，它把 Agent 的执行流程建模为**状态机**：节点（Node）负责调用 LLM、工具或人类，边（Edge）决定下一步去向，从而支持循环、条件分支、持久化和多 Agent 协作。

---

## 核心原理与组成

LangGraph 的核心抽象围绕一张**有向图**展开：

| 组件 | 作用 |
|------|------|
| **State** | 全局共享状态对象，贯穿整个执行过程，保存消息、中间结果、路由标志等 |
| **Node** | 图中的一个执行步骤，可以是 LLM 调用、工具函数、人类输入或多 Agent 节点 |
| **Edge** | 连接节点，支持普通边和条件边（conditional edges），实现分支与循环 |
| **Checkpoint** | 内置持久化机制，支持断点续跑、人机介入（human-in-the-loop）和重放 |

执行流程由 `StateGraph` 定义，编译后通过 `.invoke()` 或 `.stream()` 运行。由于图结构显式可控，开发者能精确决定“何时调用工具、何时返回人类、何时终止”，而不像纯 ReAct Agent 那样把控制权完全交给 LLM。

---

## 典型用例

1. **复杂 Agent 工作流**：审批、多步验证、错误重试等需要循环和状态管理的场景。
2. **多 Agent 协作**：把不同 Agent 作为节点，通过 Supervisor 节点动态分配任务。
3. **人机协同**：在关键节点暂停，等待人类确认后再继续执行。
4. **长流程 RAG**：检索、重排序、摘要、生成按图节点拆分，便于调试和复用。

---

## 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **LangChain** | LangGraph 构建在 LangChain 之上，复用其模型、工具、提示模板等抽象 |
| **ReAct Agent** | LangGraph 可以实现更结构化的 ReAct：显式控制思考-行动循环，而非隐式 loop |
| **CrewAI / AutoGen** | 同是多 Agent 框架；CrewAI 侧重角色+任务，AutoGen 侧重对话，LangGraph 侧重图编排与状态机 |
| **LLM Workflow 引擎** | 与普通 DAG 工作流引擎相比，LangGraph 原生支持循环、持久化和人类介入 |

---

## Related

- [[_concepts/langchain|LangChain]] — LangGraph 的底层生态
- [[_concepts/agent-framework|AI Agent 框架总览]] — Agent 框架选型背景
- [[_concepts/react-agent|ReAct 智能体]] — LangGraph 常实现的 Agent 范式
- [[_concepts/multi-agent-orchestration|多 Agent 编排]] — 多 Agent 协作模式
- [[_concepts/agent-loop|Agent Loop]] — Agent 执行循环
- [[_concepts/ai-agents|AI Agent]] — 单 Agent 基础概念
- [[Agent/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive|多 Agent 开发框架对比]] — LangGraph 与 AutoGen、CrewAI 的横向对比
