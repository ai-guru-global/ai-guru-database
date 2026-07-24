---
title: "LangChain"
category: -concepts
tags: ["langchain", "agent", "llm", "framework", "rag", "tool-use", "chain", "orchestration", "langgraph", "langsmith"]
relationships:
  - target: "概念/Agent/agent-framework"
    type: extends
  - target: "概念/Agent/langgraph"
    type: related_to
  - target: "概念/RAG/rag-patterns"
    type: enables
  - target: "概念/Agent/autogen"
    type: related_to
  - target: "概念/Agent/mcp"
    type: related_to
sources:
  - 智能体/Agent_Frameworks/LangChain_Deep_Dive.md
  - "https://github.com/langchain-ai/langchain"
summary: "LangChain 是最流行的 LLM 应用开发框架之一，提供 Chain、Agent、Tool、Memory、RAG 等抽象，帮助开发者快速构建基于大模型的应用和工作流。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Langchain
  - "LangChain Framework"

---
# LangChain

> LLM 应用开发的「瑞士军刀」——把模型、提示、工具、记忆串成可复用组件。

## 1. 核心定义

**LangChain** 是开源的 LLM 应用开发框架，提供 **Chain（链）、Agent（智能体）、Tool（工具）、Memory（记忆）、RAG（检索增强生成）** 等模块化抽象。支持 Python 和 TypeScript。

## 2. 核心组件

| 组件 | 说明 | 用途 |
|------|------|------|
| **ChatModel** | LLM 接口抽象 | 统一调用 OpenAI/Anthropic/本地模型 |
| **Chain / LCEL** | 步骤串联 | 多步处理流水线 |
| **Agent** | LLM 自主决策工具调用 | 复杂任务执行 |
| **Tool** | 封装外部 API/函数 | 搜索、计算、数据库 |
| **Memory** | 多轮对话上下文 | 会话管理 |
| **Retriever** | 向量检索 | RAG 场景 |
| **OutputParser** | 结构化输出解析 | JSON/Pydantic 输出 |
| **LangGraph** | 状态机工作流 | 复杂 Agent 编排 |
| **LangSmith** | 可观测性平台 | 调试/监控/评估 |

## 3. 代码示例

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# LCEL (LangChain Expression Language) 链式调用
llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是{role}"),
    ("human", "{question}")
])

chain = prompt | llm | StrOutputParser()
result = chain.invoke({"role": "AI专家", "question": "解释 RAG"})

# Agent 示例
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.tools import tool

@tool
def search_docs(query: str) -> str:
    """Search internal documentation."""
    return vector_store.similarity_search(query)

agent = create_tool_calling_agent(llm, [search_docs], prompt)
executor = AgentExecutor(agent=agent, tools=[search_docs])
executor.invoke({"input": "如何配置 HPA？"})
```

## 4. LangChain 生态全景（2026）

| 组件 | 功能 | 状态 |
|------|------|------|
| **langchain-core** | 基础抽象 (LCEL) | 稳定 |
| **langchain-community** | 社区集成 (600+ 工具) | 活跃 |
| **LangGraph** | 状态机 Agent 编排 | 生产就绪 |
| **LangSmith** | 可观测/评估/监控 | 商业化 |
| **LangServe** | API 服务化部署 | 稳定 |
| **LangGraph Cloud** | 托管 Agent 部署 | 新产品 |

## 5. 典型场景

| 场景 | 核心组件 | 复杂度 |
|------|----------|--------|
| RAG 聊天机器人 | Retriever + Chain | 低 |
| 工具调用 Agent | Agent + Tools | 中 |
| 多步工作流 | LangGraph | 中高 |
| 数据提取 | OutputParser + Chain | 低 |
| 多 Agent 协作 | LangGraph + 多节点 | 高 |

## 6. LangChain vs 其他框架

| 维度 | LangChain | LlamaIndex | AutoGen | 原生 SDK |
|------|-----------|-----------|---------|----------|
| 定位 | 通用 LLM 框架 | RAG 专用 | 多 Agent | 轻量级 |
| RAG | 支持 | 最强 | 弱 | 手动 |
| Agent | LangGraph | 基本 | 最强 | 手动 |
| 学习曲线 | 中 | 低 | 中 | 低 |
| 生产就绪 | 高 | 高 | 中 | 高 |
| 生态规模 | 最大 | 中 | 小 | 无 |

## 7. 优势与局限

| 优势 | 局限 |
|------|------|
| 生态最成熟，600+ 集成 | 版本迭代快，API 变动大 |
| LCEL 简洁优雅 | 简单应用可能过度设计 |
| LangGraph 生产级 Agent | 复杂工作流调试难度高 |
| LangSmith 可观测性 | 抽象层多，性能开销 |
| Python + TypeScript | 文档有时滞后于代码 |

## 8. 生产最佳实践

1. **用 LCEL 而非 Legacy Chain**: `prompt | llm | parser` 更简洁、可流式、可批处理
2. **复杂 Agent 用 LangGraph**: 而非 AgentExecutor，后者已不推荐
3. **LangSmith 监控**: 生产环境必须接入，追踪每次调用的 token/延迟/错误
4. **流式输出**: 用户交互场景必须启用 streaming
5. **错误重试**: 配置 `max_retries` 和 fallback 模型
6. **避免过度抽象**: 简单场景直接用 SDK，不必强行套 LangChain
7. **版本锁定**: langchain-core 和集成包版本要匹配，避免兼容问题

## 9. MCP 集成

```python
from langchain_mcp_adapters import load_mcp_tools
from langchain.agents import create_tool_calling_agent

# 加载 MCP 服务器工具
mcp_tools = load_mcp_tools(
    server_params={"command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"]}
)

# 创建支持 MCP 的 Agent
agent = create_tool_calling_agent(llm, mcp_tools, prompt)
executor = AgentExecutor(agent=agent, tools=mcp_tools)
```

## 10. 部署模式

| 模式 | 适用场景 | 工具 |
|------|----------|------|
| **LangServe** | REST API 服务 | FastAPI + LangServe |
| **LangGraph Cloud** | 托管 Agent | LangGraph Platform |
| **Ray Serve** | 高吞吐 | Ray + LangChain |
| **Kubernetes** | 企业级 | K8s + LangServe |
| **Serverless** | 事件驱动 | AWS Lambda / Vercel |

```python
# LangServe 示例
from langserve import add_routes
from fastapi import FastAPI

app = FastAPI()
add_routes(app, chain, path="/my-chain")
# POST /my-chain/invoke
```

## 11. 性能优化

| 优化项 | 方法 | 效果 |
|--------|------|------|
| **批处理** | `chain.batch([...])` | 吞吐量提升 3-5× |
| **流式** | `chain.stream()` | 首 Token 延迟降低 |
| **缓存** | `set_llm_cache(RedisCache())` | 重复查询 0 延迟 |
| **异步** | `await chain.ainvoke()` | 并发处理 |
| **模型路由** | 简单任务用小模型 | 成本降低 50%+ |

## 12. 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| API 不兼容 | 版本不匹配 | 锁定 langchain-core 版本 |
| 性能开销 | 抽象层多 | 简单场景用原生 SDK |
| 调试困难 | 链式调用难追踪 | 接入 LangSmith |
| 内存泄漏 | 长对话未清理 | 使用 ConversationSummaryMemory |

## Related

- [[智能体/Agent_Frameworks/LangChain_Deep_Dive|LangChain 深度解析]]
- [[概念/Agent/agent-framework|Agent 框架]]
- [[概念/Agent/langgraph|LangGraph]]
- [[概念/RAG/rag-patterns|RAG]]
- [[概念/Agent/autogen|AutoGen]]
- [[概念/Agent/mcp|MCP]]

---

## 2026 LangChain 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **LangChain 0.3+** | 最流行的 LLM 应用框架 | GA |
| **LangGraph** | 有状态 Agent 编排 | GA |
| **LangSmith** | LLM 应用可观测性平台 | GA |
| **LangServe** | LLM 应用部署服务 | GA |
| **集成生态** | 700+ 第三方集成 | GA |

## 生产最佳实践

1. **版本管理**：LangChain 更新频繁，锁定版本避免破坏性变更
2. **LangSmith**：生产环境必须启用 LangSmith 监控
3. **错误处理**：LLM 调用失败时优雅降级
4. **缓存策略**：重复请求启用缓存降低成本
5. **安全护栏**：输入输出设置安全护栏
