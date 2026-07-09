---
title: "agno: 现代 AI Agent 框架"
category: "15-agent-production-agent-frameworks"
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> **一句话理解**: agno 是一个现代化的 AI Agent 框架——用极简的代码构建拥有知识、记忆和工具调用的智能 Agent。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Agno Deep Dive"
  - Agno_Deep_Dive

---
# agno: 现代 AI Agent 框架

> **一句话理解**: agno 是一个现代化的 AI Agent 框架——用极简的代码构建拥有知识、记忆和工具调用的智能 Agent。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [代码示例](#4-代码示例)
5. [知识与记忆](#5-知识与记忆)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
agno: 现代化 AI Agent 框架
═══════════════════════════════════════════════════════════════════

定位: 专为构建生产级 AI Agent 设计的框架，强调简洁和功能完整

核心理念:
───────────────────────────────────────────────────────────────────
• 极简 API: 用最少代码构建复杂 Agent
• 知识内置: 原生支持知识库检索
• 记忆系统: 自动管理短期和长期记忆
• 工具调用: 简洁的 Function Calling
• 多模型支持: OpenAI、Anthropic、Ollama 等
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Knowledge** | 内置向量数据库，知识检索 |
| **Memory** | 自动管理 Agent 记忆 |
| **Tools** | 简洁的工具调用装饰器 |
| **Storage** | 多后端持久化存储 |
| **Team** | 多 Agent 协作 |
| **Evaluation** | 内置评估工具 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| agno 0.1 | 2024.6 | 首个版本，Agent 基础 |
| agno 0.2 | 2024.9 | 知识库支持 |
| agno 0.3 | 2024.12 | 记忆系统，多 Agent |
| agno 0.4 | 2025.2 | Storage 抽象，评估 |
| agno 0.5 | 2025.4 | 生产就绪版本 |

---

## 2. 核心概念

### 2.1 Agent 架构

```
agno Agent 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        agno Agent                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                       输入                                    │ │
│  │                   用户查询 / 任务                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    知识库 (Knowledge)                       │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │ │
│  │  │ Vector  │  │ KB1    │  │ KB2    │                      │ │
│  │  │ Store   │  │        │  │        │                      │ │
│  │  └─────────┘  └─────────┘  └─────────┘                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    记忆 (Memory)                            │ │
│  │  ┌─────────┐  ┌─────────┐                                  │ │
│  │  │ Short   │  │ Long    │                                  │ │
│  │  │ Term    │  │ Term    │                                  │ │
│  │  └─────────┘  └─────────┘                                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    LLM (大语言模型)                        │ │
│  │              GPT-4 / Claude / Llama3                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    工具 (Tools)                             │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │ │
│  │  │ Search  │  │ Code    │  │ Custom  │                      │ │
│  │  │         │  │ Run     │  │         │                      │ │
│  │  └─────────┘  └─────────┘  └─────────┘                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                       输出                                    │ │
│  │                   响应 / 执行结果                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

| 组件 | 功能 | 说明 |
|------|------|------|
| **Agent** | 核心执行单元 | 管理推理、工具、记忆 |
| **Knowledge** | 知识库 | 文档检索、上下文注入 |
| **Memory** | 记忆系统 | 跨会话状态保持 |
| **Storage** | 存储后端 | SQLite、PostgreSQL 等 |
| **Model** | 模型接口 | 支持多种 LLM |
| **Tools** | 工具函数 | 装饰器定义 |

### 2.3 知识库类型

```python
from agno import Agent, Knowledge

# PDF 知识库
pdf_knowledge = Knowledge(
    path="docs/",           # PDF 目录
    vector_store="pinecone",  # 或 "chroma", "pgvector"
)

# Web 知识库
web_knowledge = Knowledge(
    source="web",
    vector_store="pinecone",
)

# 无结构知识
 unstructured_knowledge = Knowledge(
    path="knowledgebase/",
    vector_store="chroma",
)
```

---

## 3. 架构设计

### 3.1 Agent 执行流程

```
agno Agent 执行流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│ 用户输入: "基于 Q3 报告，分析销售趋势"                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 知识检索 (Knowledge Retrieval)                           │
│ ───────────────────────────────────────────────────────────────  │
│ • 从知识库检索相关文档                                           │
│ • Q3 报告、销售数据、月度总结                                    │
│ • 注入相关上下文到 Prompt                                        │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: 记忆读取 (Memory Read)                                   │
│ ───────────────────────────────────────────────────────────────  │
│ • 加载长期记忆 (历史分析偏好、常用指标)                          │
│ • 加载短期记忆 (当前会话上下文)                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: LLM 推理 (LLM Reasoning)                                 │
│ ───────────────────────────────────────────────────────────────  │
│ • 构建完整 Prompt (用户 + 知识 + 记忆)                           │
│ • 调用 LLM 生成分析计划                                          │
│ • 决定需要调用的工具                                              │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 4: 工具调用 (Tool Execution)                                │
│ ───────────────────────────────────────────────────────────────  │
│ • 执行数据分析代码                                               │
│ • 获取额外数据                                                   │
│ • 执行计算                                                        │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 5: 记忆写入 (Memory Write)                                  │
│ ───────────────────────────────────────────────────────────────  │
│ • 总结本次分析关键点                                            │
│ • 更新短期记忆                                                   │
│ • 重要洞察写入长期记忆                                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ 输出: "根据 Q3 报告，销售额同比增长 15%，其中..."               │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Team 多 Agent 架构

```
agno Team 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                         Agent Team                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   用户请求                                                        │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Orchestrator Agent                         │   │
│   │              (协调者 - 理解任务并分配)                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│       │              │              │                           │
│       ▼              ▼              ▼                           │
│   ┌────────┐    ┌────────┐    ┌────────┐                      │
│   │Research│    │ Analyst│    │ Writer │                      │
│   │ Agent  │    │ Agent  │    │ Agent  │                      │
│   │ (调研) │    │(分析)  │    │(写作)  │                      │
│   └────────┘    └────────┘    └────────┘                      │
│       │              │              │                           │
│       └──────────────┼──────────────┘                           │
│                      ▼                                           │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Final Output                               │   │
│   │              (整合输出给用户)                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 代码示例

### 4.1 基础 Agent

```python
from agno import Agent, OpenAI

# 创建 Agent
agent = Agent(
    name="Assistant",
    model=OpenAI(id="gpt-4o"),
    description="你的私人 AI 助手",
)

# 运行
response = agent.run("你好，帮我解释什么是 RAG")
print(response.content)
```

### 4.2 带知识库的 Agent

```python
from agno import Agent, OpenAI, Knowledge, VectorStore

# 创建知识库
knowledge = Knowledge(
    path="./docs",           # 文档目录
    vector_store=VectorStore("chroma"),  # 向量数据库
)

# 带知识库的 Agent
research_agent = Agent(
    name="Researcher",
    model=OpenAI(id="gpt-4o"),
    knowledge=knowledge,      # 注入知识库
    description="研究助手，基于文档回答问题",
    instructions=[
        "当被问到问题时，先从知识库检索相关信息",
        "基于检索到的内容回答，确保准确",
        "如果知识库没有相关信息，告知用户",
    ],
)

# 运行
response = research_agent.run("Q3 销售额是多少?")
print(response.content)
```

### 4.3 带工具的 Agent

```python
from agno import Agent, OpenAI, tool
from datetime import datetime

# 定义工具
@tool
def get_current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@tool
def calculate(expression: str) -> str:
    """执行数学计算"""
    result = eval(expression)
    return str(result)

# 创建带工具的 Agent
math_agent = Agent(
    name="MathAssistant",
    model=OpenAI(id="gpt-4o"),
    tools=[get_current_time, calculate],
    description="数学助手",
)

# 运行
response = math_agent.run("计算 (1234 + 5678) * 2 并告诉我现在几点")
print(response.content)
```

### 4.4 带记忆的 Agent

```python
from agno import Agent, OpenAI, Memory

# 创建记忆
memory = Memory(
    storage="sqlite",  # 或 "postgres"
)

# 带记忆的 Agent
personal_agent = Agent(
    name="PersonalAssistant",
    model=OpenAI(id="gpt-4o"),
    memory=memory,
    description="个人助手",
    instructions=[
        "记住用户的偏好和重要信息",
        "在回答中体现对用户的了解",
    ],
)

# 首次对话
personal_agent.run("我叫小明，喜欢咖啡")

# 后续对话 - Agent 会记住
personal_agent.run("我的名字是什么?")  # "小明"
```

### 4.5 多 Agent 协作

```python
from agno import Agent, Team, OpenAI

# 创建多个专业 Agent
researcher = Agent(
    name="Researcher",
    model=OpenAI(id="gpt-4o"),
    role="研究专家",
    goal="收集和总结相关信息",
)

analyst = Agent(
    name="Analyst",
    model=OpenAI(id="gpt-4o"),
    role="分析专家",
    goal="基于数据进行分析",
)

writer = Agent(
    name="Writer",
    model=OpenAI(id="gpt-4o"),
    role="写作专家",
    goal="将分析结果整理成报告",
)

# 创建 Team
team = Team(
    name="ResearchTeam",
    agents=[researcher, analyst, writer],
    description="研究和分析团队",
)

# 协作任务
result = team.run(
    "分析 2026 年 AI 发展趋势并生成报告",
)
print(result)
```

---

## 5. 知识与记忆

### 5.1 知识库配置

```python
from agno import Knowledge, VectorStore, Embedder

# Pinecone 配置
knowledge = Knowledge(
    name="company_docs",
    path="./company_documents",
    vector_store=VectorStore(
        provider="pinecone",
        api_key="your-api-key",
        index="company-docs",
    ),
    embedder=Embedder(
        provider="openai",
        model="text-embedding-3-small",
    ),
)

# Chroma 本地配置
knowledge = Knowledge(
    name="local_docs",
    path="./docs",
    vector_store=VectorStore(
        provider="chroma",
        path="./chroma_db",
    ),
)
```

### 5.2 记忆存储配置

```python
from agno import Memory, Storage

# SQLite (本地)
memory = Memory(storage=Storage(provider="sqlite", path="./memory"))

# PostgreSQL (生产)
memory = Memory(storage=Storage(
    provider="postgres",
    host="localhost",
    port=5432,
    database="agno",
    user="user",
    password="password",
))
```

---

## 6. 对比与选择

### 6.1 与其他框架对比

| 维度 | agno | LangGraph | AutoGen | CrewAI |
|------|------|-----------|---------|--------|
| **API 简洁性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **知识库内置** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ | ⭐ |
| **记忆系统** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ | ⭐ |
| **工具定义** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **多 Agent** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **社区生态** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 适用场景

**✅ agno 最佳场景:**
- 需要知识库和记忆的 Agent
- 快速构建生产级 Agent
- 简洁优先的开发团队
- 文档问答系统
- 个人助手应用

**❌ 不适合场景:**
- 复杂工作流编排 (用 LangGraph)
- 微软生态集成 (用 AutoGen)
- 角色扮演场景 (用 CrewAI)

---

## 参考资源

- [agno GitHub](https://github.com/agno-agi/agno)
- [agno 文档](https://agno-docs.vercel.app/)
- [agno 示例](https://github.com/agno-agi/agno/tree/main/examples)

---

*Last updated: 2026-04-24*
*Version: 1.0.0*

## Related

- [[Agent/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[Agent/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[Agent/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[Agent/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[Agent/Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
