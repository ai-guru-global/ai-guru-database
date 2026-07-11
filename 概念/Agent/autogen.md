---
title: "AutoGen"
category: -concepts
tags: ["autogen", "microsoft", "agent", "multi-agent", "llm", "framework", "conversation", "tool-use"]
relationships:
  - target: "概念/agent-framework"
    type: extends
  - target: "概念/multi-agent"
    type: enables
  - target: "概念/langchain"
    type: related_to
  - target: "概念/llamaindex"
    type: related_to
  - target: "概念/mcp"
    type: related_to
sources:
  - Agent/Agent_Frameworks/AutoGen_Deep_Dive.md
  - Agent/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive.md
summary: "AutoGen 是微软开源的多 Agent 对话框架，通过 ConversableAgent 抽象让多个 LLM Agent 互相协作、调用工具、执行代码，适合复杂任务分解和多角色协作场景。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Autogen

---
# AutoGen

> 多 Agent 协作的「会议室」——让多个大模型角色分工、讨论、执行代码，共同解决复杂问题。

---

## 1. 一句话定义

**AutoGen** 是微软开源的**多 Agent 对话框架**，通过 `ConversableAgent` 抽象让多个 LLM Agent 互相协作、调用工具、执行代码。它适合需要多角色分工、多轮讨论、代码生成与执行的复杂任务场景。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **ConversableAgent** | 可对话的 Agent 基类 |
| **UserProxyAgent** | 代表人类用户，可执行代码/调用工具 |
| **AssistantAgent** | 基于 LLM 的助手 Agent |
| **GroupChat** | 多 Agent 群聊协调 |
| **代码执行** | 自动在 Docker/本地环境执行生成的代码 |
| **工具注册** | Agent 可注册和调用函数/API |
| **自定义 Agent** | 可扩展系统消息、终止条件、人机交互模式 |

---

## 3. 典型场景

1. **代码生成与调试**：Coder + Critic + Executor 协作写代码。
2. **复杂数据分析**：多个 Agent 分别负责数据清洗、建模、可视化。
3. **多角色内容创作**：Writer + Editor + Reviewer 协作生成文档。
4. **工具编排 Agent**：调用搜索、计算、API 完成多步任务。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **LangChain** | 更通用，AutoGen 专注多 Agent 对话 |
| **CrewAI** | 基于角色扮演的多 Agent 框架，灵感来自 AutoGen |
| **LlamaIndex** | 可作为 AutoGen Agent 的 RAG 工具 |
| **MCP** | AutoGen Agent 可消费 MCP 服务器 |

---

## 5. 优势与局限

### 优势
- 多 Agent 协作抽象清晰。
- 内置代码执行，适合编程任务。
- 微软维护，与 Azure OpenAI 集成好。

### 局限
- 多 Agent 对话可能产生大量 LLM 调用，成本高。
- 调试复杂，对话流程难以预测。
- 对简单单 Agent 场景过度设计。

---

## Related

- [[智能体/Agent_Frameworks/AutoGen_Deep_Dive]] — AutoGen 深度解析
- [[智能体/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive]] — AutoGen / CrewAI / LangGraph 对比
- [[概念/agent-framework]] — Agent 框架
- [[概念/multi-agent]] — 多 Agent 系统
- [[概念/langchain]] — LangChain
- [[概念/llamaindex]] — LlamaIndex
- [[概念/multi-agent-orchestration]] — Multi Agent Orchestration
