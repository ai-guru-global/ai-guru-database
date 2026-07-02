---
title: 大模型 Tool Use（工具使用）
category: concepts
tags:
  - llm
  - tool-use
  - agent
  - function-calling
  - api
  - ecosystem
aliases:
  - Tool Use
  - 工具使用
  - Tool Augmented LLM
  - 工具增强 LLM
relationships:
  - target: "_concepts/function-calling"
    type: implements
  - target: "_concepts/react-agent"
    type: uses
  - target: "_concepts/agent-framework"
    type: related_to
summary: Tool Use 指大模型调用外部工具（API、数据库、计算器等）扩展自身能力，是构建实用 Agent 的核心技术，涵盖函数调用、代码执行、检索增强等多种形式。
lifecycle: reviewed
tier: core
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# 大模型 Tool Use（工具使用）

## 一句话总结

**Tool Use** 让大模型能够调用外部工具（API、数据库、代码解释器等）来扩展自身能力，完成仅靠语言模型无法直接完成的任务。

---

## 为什么需要 Tool Use？

LLM 本身存在局限：

| 局限 | 工具解决方案 |
|---|---|
| **知识有时效性** | 搜索引擎、知识库检索 |
| **无法计算精确值** | 计算器、Python 解释器 |
| **无法访问私有数据** | 数据库查询、企业内部 API |
| **无法执行操作** | 邮件 API、日历 API、智能家居接口 |
| **可能产生幻觉** | 检索增强、事实核查工具 |

---

## Tool Use 的层次

```mermaid
flowchart TD
    A[Tool Use] --> B[Function Calling]
    A --> C[Code Execution]
    A --> D[Retrieval Augmented Generation]
    A --> E[API Orchestration]
    
    B --> F[结构化参数调用]
    C --> G[Python/SQL 解释器]
    D --> H[向量检索/搜索引擎]
    E --> I[多工具组合调用]
```

---

## 主要形式

### 1. Function Calling

模型输出结构化 JSON 调用函数。参见 [[_concepts/function-calling|Function Calling]]。

### 2. 代码执行

让模型生成代码并由沙箱执行：

```python
code = model.generate("计算 123456789 * 987654321")
result = execute_in_sandbox(code)
```

代表：Code Interpreter、OpenAI Code Interpreter。

### 3. 检索增强（RAG）

```python
retrieved_docs = vector_search(query)
context = format(retrieved_docs)
answer = model.generate(query + context)
```

代表：LangChain、LlamaIndex。

### 4. API 编排

模型自主决定调用多个 API 的顺序和参数：

```
查询天气 → 查询景点 → 规划路线 → 预订酒店
```

---

## Tool Use 系统架构

```mermaid
flowchart LR
    A[用户请求] --> B[LLM]
    B --> C{是否需要工具?}
    C -->|是| D[Tool Selector]
    D --> E[Tool Executor]
    E --> F[结果]
    F --> B
    C -->|否| G[直接回答]
```

---

## 设计要点

| 要点 | 说明 |
|---|---|
| **工具描述** | 清晰描述工具功能和参数 |
| **工具选择** | 避免同时提供过多工具，降低模型选择难度 |
| **错误处理** | 工具执行失败时提供有用的错误信息 |
| **结果长度控制** | 避免过长结果超出上下文限制 |
| **权限控制** | 限制工具可访问的资源和操作 |
| **审计日志** | 记录所有工具调用便于排查 |

---

## 主流工具框架

| 框架 | 特点 |
|---|---|
| **LangChain** | 工具链编排、Agent 框架 |
| **LlamaIndex** | 检索增强、数据连接器 |
| **MCP（Model Context Protocol）** | Anthropic 推出的工具标准协议 |
| **OpenAI Assistants API** | 内置 code interpreter、retrieval、function calling |
| **AutoGen** | 多 Agent 协作 |

---

## Tool Use vs Agent

| 特性 | Tool Use | Agent |
|---|---|---|
| **范围** | 调用外部工具的能力 | 更广泛的自主决策系统 |
| **自主性** | 中 | 高 |
| **规划能力** | 通常单次或简单链式 | 多步规划、反思、记忆 |
| **关系** | Agent 的核心组件之一 | 包含 Tool Use |

---

## 延伸阅读

- [[_concepts/function-calling|Function Calling]]
- [[_concepts/react-agent|ReAct Agent]]
- [[_concepts/agent-framework|Agent 框架]]
- [[_concepts/multimodal-llm|多模态 LLM]]
