---
title: "AI Agent 框架总览"
category: -concepts
tags: [agent-framework, langchain, autogen, multi-agent, orchestration, llm]
aliases:
  - "Agent Framework"
  - "AI Agent Framework"
  - "智能体框架"
relationships:
  - target: "_concepts/agent-loop"
    type: implements
  - target: "_concepts/agent-harness"
    type: builds_on
  - target: "_concepts/langchain"
    type: example
  - target: "_concepts/autogen"
    type: example
  - target: "_concepts/multi-agent"
    type: enables
sources:
  - 15_Agent_Production/Agent_Foundations/Agentic_AI_Complete_Guide.md
  - 15_Agent_Production/Agent_Foundations/Multi_Agent_Systems_Guide.md
summary: "AI Agent 框架是一组让开发者构建 LLM 驱动的自主智能体的工具库，提供 Agent Loop（ReAct/Plan-and-Execute）、工具调用、记忆、多 Agent 协作等核心抽象。"
lifecycle: stable
tier: core
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# AI Agent 框架总览

## 核心要点

- **核心抽象**：
  - **Agent Loop**：ReAct / Plan-and-Execute / Reflexion / ToT
  - **Tool Calling**：Function Calling 标准、JSON Schema 校验
  - **Memory**：短期（窗口）/ 长期（向量库）/ 情景（事件日志）
  - **Planning**：任务分解、子任务调度
  - **Multi-Agent**：A2A 协议、SOP 角色分配
- **主流框架**：

| 框架 | 提供方 | 强项 |
|------|--------|------|
| **LangChain / LangGraph** | LangChain Inc | 生态最全、LCEL 表达式 |
| **LangGraph** | LangChain Inc | 图编排、状态机 |
| **AutoGen** | Microsoft | 多 Agent 对话 |
| **CrewAI** | CrewAI Inc | 角色扮演、SOP |
| **Semantic Kernel** | Microsoft | .NET/Python、原生函数调用 |
| **Haystack** | deepset | 生产级 NLP 流水线 |
| **LlamaIndex** | LlamaIndex | 数据连接器、RAG 优先 |
| **OpenAI Agents SDK** | OpenAI | 原生 Swarm 风格 |
| **Anthropic Claude Agent SDK** | Anthropic | Claude 原生集成 |
| **Dify / FastGPT** | 开源 | 一站式 LLMOps |

## 一句话解释

> Agent 框架 = "工具调用 + 循环推理 + 记忆" 的脚手架；选哪个取决于团队语言偏好和场景复杂度。

## Agent Loop 三范式

### 1. ReAct（最常用）
```
观察 → 思考 → 行动 → 观察 → 思考 → 行动 → ...
```

### 2. Plan-and-Execute
```
规划（生成子任务列表）→ 执行（逐个调用工具）→ 反思（必要时重新规划）
```

### 3. Reflexion
```
行动 → 评估 → 反思 → 注入记忆 → 下一轮行动
```

## 何时使用哪个框架

```
需求复杂度？
├── 简单 LLM 调用 + 几个 tool
│   └── LangChain（最小依赖）
├── 复杂状态机 / 多分支
│   └── LangGraph（图编排）
├── 多 Agent 协作 / 对话
│   └── AutoGen / CrewAI
├── 原生 Claude 集成 + MCP
│   └── Claude Agent SDK
├── .NET / C# 生态
│   └── Semantic Kernel
├── 企业级 + 可观测性 + RAG
│   └── Haystack / LlamaIndex
└── 一站式 LLMOps（无代码 / 低代码）
    └── Dify / FastGPT
```

## 选型决策表

| 维度 | LangChain | LangGraph | AutoGen | CrewAI |
|------|-----------|-----------|---------|--------|
| 学习曲线 | 中 | 陡 | 中 | 平缓 |
| 多 Agent | 弱 | 中 | **强** | **强** |
| 状态管理 | 中 | **强** | 中 | 中 |
| 工具生态 | **最全** | 全 | 中 | 少 |
| 生产就绪 | 中 | 中 | 中 | 弱 |
| 社区规模 | **最大** | 大 | 大 | 中 |

## 关键趋势（2026）

- **协议化**：MCP（工具）/ A2A（Agent 互操作）成为跨框架标准
- **可视化**：LangGraph Studio / AutoGen Studio / CrewAI Studio
- **Harness 化**：从单 Agent Loop 演进到完整的执行治理层
- **LLM-native**：框架本身逐步被模型能力内化（如 Claude Computer Use）

## Related

- [[_concepts/agent-loop]] — Agent Loop 详解
- [[_concepts/agent-harness]] — Harness 工程
- [[_concepts/multi-agent]] — 多 Agent 系统
- [[_concepts/langchain]] — LangChain
- [[_concepts/autogen]] — AutoGen
- [[15_Agent_Production/Agentic_AI_Complete_Guide]] — Agent 完整指南- [[_concepts/multi-agent-orchestration]] — Multi Agent Orchestration
