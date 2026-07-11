---
title: "LangChain"
category: -concepts
tags: ["langchain", "agent", "llm", "framework", "rag", "tool-use", "chain", "orchestration"]
relationships:
  - target: "概念/agent-framework"
    type: extends
  - target: "概念/rag"
    type: enables
  - target: "概念/llm"
    type: uses
  - target: "概念/llamaindex"
    type: related_to
  - target: "概念/autogen"
    type: related_to
  - target: "概念/mcp"
    type: related_to
sources:
  - Agent/Agent_Frameworks/LangChain_Deep_Dive.md
  - Agent/Agent_Frameworks/LangChain_Agents_Deep_Dive.md
summary: "LangChain 是最流行的 LLM 应用开发框架之一，提供 Chain、Agent、Tool、Memory、RAG 等抽象，帮助开发者快速构建基于大模型的应用和工作流。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Langchain

---
# LangChain

> LLM 应用开发的「瑞士军刀」——把模型、提示、工具、记忆串成可复用组件。

---

## 1. 一句话定义

**LangChain** 是开源的 LLM 应用开发框架，提供 **Chain（链）、Agent（智能体）、Tool（工具）、Memory（记忆）、RAG（检索增强生成）** 等模块化抽象。它让开发者把大模型、外部数据源、API 和业务流程组合成可维护的应用。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Chain** | 把多个 LLM 调用或处理步骤串联 |
| **Agent** | LLM 自主决定调用哪些工具 |
| **Tool** | 封装外部 API、数据库、搜索引擎等 |
| **Memory** | 在多轮对话中保持上下文 |
| **RAG** | 集成向量数据库做检索增强 |
| **Prompt 模板** | 可复用的提示词管理 |
| **LangServe / LangGraph** | 服务化部署与状态机工作流 |

---

## 3. 典型场景

1. **RAG 聊天机器人**：文档检索 + LLM 生成。
2. **Agent 助手**：工具调用、多步骤任务执行。
3. **数据提取**：从非结构化文本中提取结构化信息。
4. **工作流自动化**：审批、客服、代码生成流水线。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **LlamaIndex** | 更专注于 RAG 和数据索引，LangChain 更通用 |
| **AutoGen** | 微软多 Agent 框架，LangChain 也支持多 Agent |
| **CrewAI** | 基于 LangChain 的角色扮演多 Agent 框架 |
| **MCP** | LangChain 可消费 MCP 工具 |
| **LangGraph** | LangChain 生态中的状态机 Agent 框架 |

---

## 5. 优势与局限

### 优势
- 生态最成熟，社区和文档丰富。
- 抽象灵活，适合快速原型到生产。
- 支持 Python 和 JavaScript/TypeScript。

### 局限
- 版本迭代快，API 兼容性有时成问题。
- 简单应用引入框架可能过度设计。
- 复杂工作流调试难度较高。

---

## Related

- [[智能体/Agent_Frameworks/LangChain_Deep_Dive]] — LangChain 深度解析
- [[智能体/Agent_Frameworks/LangChain_Agents_Deep_Dive]] — LangChain Agents 深度解析
- [[概念/agent-framework]] — Agent 框架
- [[概念/rag-patterns]] — RAG
- [[概念/llamaindex]] — LlamaIndex
- [[概念/autogen]] — AutoGen
