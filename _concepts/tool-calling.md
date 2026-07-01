---
title: "工具调用"
category: -concepts
tags: ["tool-calling", "function-calling", "agent", "api", "mcp"]
relationships:
  - target: "_concepts/ai-agents"
    type: enables
  - target: "_concepts/tool-calling-safety"
    type: secures
  - target: "_concepts/agentic-rag"
    type: used_by
sources:
  - 15_Agent_Production/GenAI_L11_Integrating_with_Function_Calling.md
  - 15_Agent_Production/Agent_Skills/Agent_Skills_Ecosystem_Catalog.md
  - 15_Agent_Production/Agent_Protocols/MCP_Deep_Dive.md
summary: "工具调用（Tool Calling / Function Calling）让大模型不再只输出文字，而是能根据用户需求生成调用外部工具（API、数据库、代码解释器等）的参数。它是 Agent 能‘动手’的基础。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Tool Calling"
  - "tool calling"

---
# 工具调用

## 核心要点

- **工具调用让 LLM 从“说话”变成“行动”**。
- **过程**：模型根据用户请求，决定调用哪个工具，并生成合法的参数 JSON。
- **执行者不是模型**：模型只输出调用意图，真正执行由外部系统完成。
- **典型工具**：天气 API、数据库查询、计算器、代码执行、搜索引擎、日历 API。

## 一句话理解

工具调用就像给大模型发了一部“智能手机”：它不会自己打车，但能帮你打开打车 App、填好目的地、叫你来确认。

## 详细内容

### 基本流程

```
用户：北京明天天气怎么样？
  ↓
模型识别需要调用天气工具
  ↓
模型输出：{"tool": "get_weather", "parameters": {"city": "北京", "date": "明天"}}
  ↓
系统执行工具，拿到结果
  ↓
模型把结果组织成自然语言回答用户
```

### 为什么重要？

- 大模型本身不能联网、不能查实时数据、不能操作外部系统。
- 工具调用让它获得“手和脚”。
- 是 Agent、RAG、智能助手等应用的核心能力。

### 与 Agent 的关系

工具调用是 Agent 的“技能”。Agent 负责决策和规划，工具调用负责执行具体动作。

## Related

- [[_concepts/ai-agents]] — AI Agent
- [[_concepts/tool-calling-safety]] — 工具调用安全
- [[_concepts/agentic-rag]] — Agentic RAG
- [[_concepts/mcp]] — Model Context Protocol
- [[15_Agent_Production/GenAI_L11_Integrating_with_Function_Calling]] — 集成函数调用
