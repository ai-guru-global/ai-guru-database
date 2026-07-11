---
title: "Hello-Agents L06：框架开发实践（AutoGen / AgentScope / CAMEL / LangGraph）"
category: "15-agent-production"
tags:
  - ai-agents
  - autogen
  - agentscope
  - camel
  - langgraph
  - multi-agent
  - hello-agents
sources:
  - "原始/github-sources/hello-agents/docs/chapter6/第六章 框架开发实践.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第六章笔记：对比并使用 AutoGen、AgentScope、CAMEL、LangGraph 四个主流 Agent 框架，通过实战案例理解多智能体协作与复杂工作流控制。"
provenance:
  extracted: 0.72
  inferred: 0.23
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Hello Agents L06 Frameworks Autogen Langgraph"
  - "Hello Agents L06 Frameworks AutoGen LangGraph"
  - Hello_Agents_L06_Frameworks_AutoGen_LangGraph

---
# Hello-Agents L06：框架开发实践

> **一句话理解**: 本章从手写脚本过渡到成熟框架，通过 **AutoGen、AgentScope、CAMEL、LangGraph** 四个代表性框架的实战案例，理解框架如何抽象 Agent Loop、状态管理、工具调用与多 Agent 协作。

---

## 1. 为什么需要 Agent 框架

- **提升复用与效率**: 封装 Agent Loop、状态管理、工具调用、日志记录等通用逻辑 ^[extracted]
- **解耦与可扩展**: 模型层、工具层、记忆层分离，便于替换与升级 ^[extracted]
- **标准化状态管理**: 处理上下文窗口限制、历史持久化、多轮状态跟踪 ^[inferred]
- **可观测性**: 通过回调（Callbacks）在 `on_llm_start`、`on_tool_end`、`on_agent_finish` 等节点记录轨迹 ^[extracted]

---

## 2. 四大框架对比

| 框架 | 核心设计理念 | 典型场景 |
|------|-------------|----------|
| **AutoGen** | 对话驱动协作（Conversation-driven Collaboration） | 多角色群聊、软件开发团队模拟 |
| **AgentScope** | 易用性与工程化 | 大规模、分布式多 Agent 系统 |
| **CAMEL** | 角色扮演（Role-Playing）+ Inception Prompting | 两个 Agent 自主对话完成共同任务 |
| **LangGraph** | 图（Graph）执行流程 | 需要循环、分支、反思的复杂工作流 |

表格内容基于教材表 6.1 总结 ^[extracted]。

---

## 3. AutoGen（v0.7.4）

### 3.1 新架构特点

- **分层设计**: `autogen-core`（底层交互与消息传递）+ `autogen-agentchat`（高级对话接口）
- **异步优先**: 全面转向 `async/await`，提升并发与资源利用率 ^[extracted]

### 3.2 核心组件

- **AssistantAgent**: 任务主要解决者，封装 LLM，负责生成计划/代码/文案
- **UserProxyAgent**: 人类代言人 + 可靠执行器，可执行代码或调用工具 ^[extracted]

### 3.3 团队协作机制

- **RoundRobinGroupChat**: 按预定义顺序依次发言，适合流程固定的任务
- 软件开发团队案例：ProductManager → Engineer → CodeReviewer → UserProxy ^[extracted]

---

## 4. AgentScope

- 专为多 Agent 应用设计的开发平台
- 强调**易用性**与**工程化**
- 内置消息传递机制与分布式部署支持 ^[extracted]
- 适合构建和运维复杂、大规模多 Agent 系统 ^[inferred]

---

## 5. CAMEL

- 基于**角色扮演（Role-Playing）**的协作方法
- 通过 **Inception Prompting** 为两个 Agent 设定角色与共同目标
- Agent 自主多轮对话、相互启发、共同完成任务 ^[extracted]
- 降低设计多 Agent 对话流程的复杂度 ^[inferred]

---

## 6. LangGraph

- LangChain 生态扩展，将执行流程建模为**图（Graph）**
- **节点（Node）**: 每个操作（LLM 调用、工具执行等）
- **边（Edge）**: 定义节点间跳转逻辑
- 天然支持**循环（Cycles）**，适合实现 Reflection、迭代修正等复杂工作流 ^[extracted]

---

## 7. 框架选型建议

| 需求 | 推荐框架 |
|------|----------|
| 多角色对话协作 | AutoGen |
| 大规模分布式部署 | AgentScope |
| 双 Agent 自主角色扮演 | CAMEL |
| 复杂循环/分支/反思工作流 | LangGraph |

选型建议为基于教材的合理推断 ^[inferred]。

---

## 8. 关联阅读

- [[智能体/Agent_Frameworks/AutoGen_Deep_Dive]] — AutoGen 深度解析
- [[智能体/Agent_Frameworks/AgentScope_Deep_Dive]] — AgentScope 深度解析
- [[智能体/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive]] — AutoGen / CrewAI / LangGraph 对比
- [[智能体/Agent_Workflow/Workflow-in-nutshell]] — Agent 工作流总览
- [[大模型/Prompt_Engineering/Hello_Agents_L04_ReAct]] — 经典范式实现
