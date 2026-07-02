---
title: 'LangChain: LLM 应用开发框架'
category: '15-agent-production-agent-frameworks'
tags: ["ai-agents", "agent-framework", "production", "langgraph", "llm", "langchain"]
summary: '> **一句话理解**: LangChain 是 LLM 应用的"操作系统"——拼接大模型、提示词、记忆、工具、数据，构建复杂的 AI 应用。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Langchain Deep Dive"
  - "LangChain Deep Dive"
  - LangChain_Deep_Dive

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LangChain: LLM 应用开发框架

> **一句话理解**: LangChain 是 LLM 应用的"操作系统"——拼接大模型、提示词、记忆、工具、数据，构建复杂的 AI 应用。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [核心组件](#5-核心组件)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LangChain: LLM 应用框架
═══════════════════════════════════════════════════════════════════

定位: LLM 应用的基础设施，连接模型、数据、工具的中间件框架

核心理念:
───────────────────────────────────────────────────────────────────
• 模块化: 组件可自由组合
• 链式调用: 管道式处理数据
• 工具集成: 扩展 LLM 能力
• 记忆系统: 保持上下文
• 评估工具: 调试和优化
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **LCEL** | LangChain Expression Language，链式表达式 |
| **Prompt Templates** | 可复用提示词模板 |
| **Chains** | 预建链和自定义链 |
| **Agents** | 基于工具的智能体 |
| **Memory** | 多层次记忆系统 |
| **Callbacks** | 事件回调和日志 |
| **LangServe** | 模型部署服务 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| LangChain 0.1 | 2023.3 | 首个版本 |
| v0.2 | 2023.8 | LCEL 表达式语言 |
| v1.0 | 2024.2 | LangServe 部署 |
| v0.3 | 2024.6 | 组件重构 |
| v0.4 | 2024.11 | LangGraph 集成 |
| v1.0 | 2025.2 | 生产稳定 |

---

## 2. 核心概念

### 2.1 组件架构

```
LangChain 组件架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      LangChain 组件                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Model I/O                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │ │
│  │  │   LLM    │  │  Chat    │  │ Prompt  │                  │ │
│  │  │          │  │  Model   │  │ Template│                  │ │
│  │  └──────────┘  └──────────┘  └──────────┘                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Retrieval                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │ │
│  │  │ Document │  │ Vector   │  │ Retriever│                  │ │
│  │  │ Loaders  │  │ Stores   │  │          │                  │ │
│  │  └──────────┘  └──────────┘  └──────────┘                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Agents                                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │ │
│  │  │  Tools   │  │   Tool   │  │   Agent  │                  │ │
│  │  │          │  │ Selector │  │   Kit   │                  │ │
│  │  └──────────┘  └──────────┘  └──────────┘                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Memory                                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │ │
│  │  │ Buffer   │  │  Entity  │  │  Summary │                  │ │
│  │  │ Memory   │  │  Memory  │  │  Memory  │                  │ │
│  │  └──────────┘  └──────────┘  └──────────┘                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心对象

| 对象 | 说明 | 示例 |
|------|------|------|
| **LLM** | 文本补全模型 | GPT-3, Claude |
| **ChatModel** | 对话模型 | GPT-4, Claude |
| **PromptTemplate** | 提示词模板 | jinja2 风格 |
| **Chain** | 处理管道 | LLMChain, RetrievalQA |
| **Agent** | 自主执行者 | ReAct, OpenAI Functions |
| **Tool** | 外部功能 | 搜索、计算、API |
| **Memory** | 状态保持 | 对话历史 |

### 2.3 LCEL 语法

```python
# LangChain Expression Language (LCEL)

# 简单链
chain = prompt | model | output_parser

# 带记忆的链
chain = prompt | model.with_config(callbacks=[...]) | output_parser

# RAG 链
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# Agent 链
agent = (
    {"input": lambda x: x["input"], "agent_scratchpad": lambda x: format_scratchpad(x)}
    | prompt
    | model.bind(functions=functions)
    | JsonOutputParser()
)
```

---

## 3. 架构设计

### 3.1 Chain 类型

```
LangChain Chain 类型
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Chain 类型                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  LLMChain                                                         │
│  ────────                                                         │
│  Input → Prompt → LLM → Output                                   │
│  最基础的链                                                       │
│                                                                   │
│  RetrievalQAChain                                                 │
│  ─────────────                                                   │
│  Input → Retrieve → Format → LLM → Output                         │
│  RAG 问答                                                         │
│                                                                   │
│  ConversationalRetrievalChain                                     │
│  ─────────────────────────                                        │
│  Input → (History + Question) → Retrieve → LLM → Output          │
│  对话式问答                                                       │
│                                                                   │
│  AgentExecutor                                                    │
│  ───────────                                                     │
│  Input → Agent (Plan) → Tools → Output                            │
│  自主执行                                                         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Agent 类型

| Agent | 特点 | 适用场景 |
|--------|------|----------|
| **ReAct** | 思考-行动-观察 | 复杂推理 |
| **OpenAI Functions** | 函数调用 | 结构化输出 |
| **Self Ask** | 自我提问 | 多跳问答 |
| **Plan and Execute** | 计划后执行 | 复杂任务 |

### 3.3 执行流程

```
Agent 执行流程
═══════════════════════════════════════════════════════════════════

用户: "帮我订一张明天北京到上海的机票"

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: LLM 分析任务                                             │
│ ───────────────────────────────────────────────────────────────  │
│ Thought: 需要搜索航班信息，然后订票                              │
│ Action: search_flights                                           │
│ Action Input: {"from": "北京", "to": "上海", "date": "明天"}      │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: 工具执行                                                  │
│ ───────────────────────────────────────────────────────────────  │
│ 执行 search_flights 工具                                        │
│ 返回: [航班1, 航班2, 航班3]                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 观察结果                                                  │
│ ───────────────────────────────────────────────────────────────  │
│ Observation: 找到 3 个航班，CA1234 最合适                        │
│ Thought: 需要确认用户并订票                                     │
│ Action: confirm_and_book                                         │
│ Action Input: {"flight_id": "CA1234"}                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 4: 完成                                                      │
│ ───────────────────────────────────────────────────────────────  │
│ Final Answer: 已为您订好 CA1234 航班，明天 8:00 起飞...          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 基础安装
pip install langchain

# OpenAI
pip install langchain-openai

# Anthropic
pip install langchain-anthropic

# 所有提供商
pip install langchain-community

# LangServe (部署)
pip install "langchain[serve]"
```

### 4.2 LLMChain 基础

```python
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# 创建 LLM
llm = OpenAI(temperature=0.7, model="gpt-4o")

# 创建提示词模板
prompt = PromptTemplate.from_template(
    "解释{concept}，用{level}的复杂度"
)

# 创建链
chain = LLMChain(llm=llm, prompt=prompt)

# 执行
result = chain.invoke({
    "concept": "量子纠缠",
    "level": "中等"
})
print(result["text"])
```

### 4.3 RAG 实现

```python
from langchain_openai import OpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

# 向量存储
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=OpenAIEmbeddings()
)

# 创建检索链
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",  # 或 "map_reduce", "refine"
    retriever=vectorstore.as_retriever(),
)

# 查询
result = qa_chain.invoke("这份文档的主要内容是什么？")
```

### 4.4 Agent 实现

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import OpenAI
from langchain_core.prompts import ChatPromptTemplate

# 定义工具
tools = [search_tool, calculator_tool]

# 创建 Agent
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个有用的助手"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_openai_functions_agent(
    llm=OpenAI(model="gpt-4o"),
    tools=tools,
    prompt=prompt,
)

# 执行
executor = AgentExecutor(agent=agent, tools=tools)
result = executor.invoke({"input": "搜索最新 AI 新闻"})
```

---

## 5. 核心组件

### 5.1 提示词模板

```python
from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain.output_parsers import CommaSeparatedListOutputParser

# 简单模板
prompt = PromptTemplate.from_template(
    "请用一句话解释 {topic}"
)

# 带示例的模板
prompt = PromptTemplate.from_template(
    """根据以下示例回答问题：

    示例:
    输入: 什么是量子计算
    输出: 量子计算是一种利用量子力学原理进行计算的技术

    问题: {question}
    输出:"""
)

# 对话模板
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个{role}专家"),
    ("human", "{question}"),
    ("ai", "{answer}"),
])
```

### 5.2 向量存储

```python
from langchain_community.vectorstores import (
    Chroma,           # 本地向量存储
    Pinecone,         # 云端
    Weaviate,         # 开源
    Qdrant,           # 高性能
)

# Chroma (本地)
db = Chroma.from_documents(docs, OpenAIEmbeddings())

# Pinecone (云端)
from langchain_pinecone import PineconeVectorStore
db = PineconeVectorStore.from_documents(
    docs, OpenAIEmbeddings(), index_name="my-index"
)
```

### 5.3 记忆系统

```python
from langchain.memory import (
    ConversationBufferMemory,      # 简单缓冲
    ConversationSummaryMemory,     # 摘要记忆
    EntityMemory,                  # 实体记忆
    GraphEntityMemory,            # 图记忆
)

# 对话缓冲
memory = ConversationBufferMemory(
    memory_key="history",
    return_messages=True,
)

# 带摘要的对话
memory = ConversationSummaryMemory(
    llm=OpenAI(),
    memory_key="summary",
)

# 在 Chain 中使用
chain = LLMChain(
    llm=llm,
    prompt=prompt,
    memory=memory,
)
```

### 5.4 LangServe 部署

```python
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langserve import add_routes

# 创建应用
app = FastAPI()
chain = LLMChain(prompt=prompt, llm=OpenAI())

# 添加路由
add_routes(app, chain, path="/chain")

# 运行
# uvicorn app:app --reload --port 8000
```

---

## 6. 对比与选择

### 6.1 与其他框架对比

| 维度 | LangChain | LlamaIndex | Haystack |
|------|-----------|------------|----------|
| **定位** | 应用框架 | 数据索引 | RAG 框架 |
| **复杂度** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **灵活性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **学习曲线** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **生态** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **文档** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 适用场景

**✅ LangChain 最佳场景:**
- 需要复杂链式调用
- 多种工具集成
- 对话式应用
- 快速原型到生产

**❌ 不适合场景:**
- 简单单一功能 (直接用 SDK)
- 极端定制需求 (用底层 API)

---

## 参考资源

- [LangChain GitHub](https://github.com/langchain-ai/langchain)
- [LangChain 文档](https://python.langchain.com/)
- [LangChain Academy](https://academy.langchain.com/)
- [LangSmith](https://smith.langchain.com/) - 调试工具

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[15_Agent_Production/Agent_Evaluation/Implementation/LLM_as_Judge_Templates.md|LLM_as_Judge_Templates]]
- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
