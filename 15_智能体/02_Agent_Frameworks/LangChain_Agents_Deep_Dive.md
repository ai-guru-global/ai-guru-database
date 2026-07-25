---
title: "LangChain Agents: 工具调用框架"
category: "15-agent-production-agent-frameworks"
tags: ["ai-agents", "agent-framework", "production", "langgraph", "langchain"]
summary: "> **一句话理解**: LangChain Agents 是 LangChain 的工具调用框架——通过 ReAct/Plan-and-Execute 等策略让 LLM 调用工具、联网搜索、执行代码，实现自主决策。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Langchain Agents Deep Dive"
  - "LangChain Agents Deep Dive"
  - LangChain_Agents_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LangChain Agents: 工具调用框架

> **一句话理解**: LangChain Agents 是 LangChain 的工具调用框架——通过 ReAct/Plan-and-Execute 等策略让 LLM 调用工具、联网搜索、执行代码，实现自主决策。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LangChain Agents: 工具调用框架
═══════════════════════════════════════════════════════════════════

定位: LangChain 的 Agent 核心模块，让 LLM 能够调用工具、执行多步任务

核心理念:
───────────────────────────────────────────────────────────────────
• 多策略: ReAct/Plan-and-Execute/Conversational
• 工具生态: 100+ 内置工具
• 灵活可扩展: 自定义工具
• 记忆管理: 对话上下文
• 输出解析: 结构化工具调用
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **ReAct** | 思考-行动-观察循环 |
| **Plan-and-Execute** | 计划后执行 |
| **Conversational** | 对话式 Agent |
| **Self-Ask** | 自我提问链 |
| **工具绑定** | 函数调用格式 |
| **记忆** | 对话历史管理 |

### 1.3 支持的工具类型

| 类型 | 工具示例 |
|------|----------|
| **搜索** | Google, Bing, DuckDuckGo |
| **数据库** | SQL, Neo4j |
| **API** | REST, GraphQL |
| **计算** | Python interpreter, Calculator |
| **文件** | PDF, CSV, JSON |
| **其他** | Zapier, IFTTT |

---

## 2. 核心概念

### 2.1 ReAct 策略

```
ReAct 执行流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        ReAct 循环                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 1. Thought (思考)                                           │ │
│  │    "用户问的是今天的天气，我需要先搜索北京的天气"            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 2. Action (行动)                                            │ │
│  │    调用工具: search_weather(city="北京")                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 3. Observation (观察)                                        │ │
│  │    工具返回: "北京今天晴，25°C，适宜出行"                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  继续循环直到任务完成或达到最大步数                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Agent 类型对比

| Agent | 策略 | 适用场景 |
|-------|------|----------|
| **ReAct** | 思考-行动-观察 | 通用任务 |
| **Plan-and-Execute** | 计划后执行 | 复杂多步任务 |
| **Conversational** | 对话式 | 聊天机器人 |
| **Self-Ask** | 自我提问 | 需要分解的问题 |
| **OpenAI Tools** | 函数调用 | OpenAI 模型原生 |

---

## 3. 架构设计

### 3.1 系统架构

```
LangChain Agents 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        LangChain Agents 架构                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Agent (代理)                                  │   │
│   │  • ReAct Agent                                          │   │
│   │  • Plan-and-Execute Agent                               │   │
│   │  • OpenAI Functions Agent                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Tool (工具)                                    │   │
│   │  • Search Tools                                         │   │
│   │  • Database Tools                                       │   │
│   │  • API Tools                                            │   │
│   │  • Python REPL                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Memory (记忆)                                 │   │
│   │  • Chat Memory                                          │   │
│   │  • Buffer Memory                                       │   │
│   │  • Summary Memory                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 工具调用流程

```
工具调用流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        工具调用流程                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. LLM 生成请求                                                │
│  ───────────────────────────────────────────────────────────   │
│  "北京今天的天气如何?"                                           │
│                                                                   │
│  2. Agent 解析                                                │
│  ───────────────────────────────────────────────────────────   │
│  确定需要调用的工具: search_weather                             │
│  生成工具参数: {"city": "北京"}                                │
│                                                                   │
│  3. 工具执行                                                    │
│  ───────────────────────────────────────────────────────────   │
│  search_weather(city="北京") → "北京: 晴, 25°C"               │
│                                                                   │
│  4. 结果处理                                                    │
│  ───────────────────────────────────────────────────────────   │
│  观察结果，决定是否继续或返回答案                                │
│                                                                   │
│  5. 最终回复                                                    │
│  ───────────────────────────────────────────────────────────   │
│  "北京今天天气晴朗，气温25°C..."                               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install langchain langchain-openai duckduckgo-search
```

### 4.2 基础 ReAct Agent

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import ChatOpenAI
from langchain import hub

# 初始化 LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 获取提示模板
prompt = hub.pull("hwchase17/react")

# 创建 Agent
agent = create_react_agent(llm, tools, prompt)

# 创建执行器
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=5
)

# 执行
result = agent_executor.invoke({
    "input": "北京的天气怎么样?"
})

print(result["output"])
```

### 4.3 带搜索工具的 Agent

```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import DuckDuckGoSearchRun
from langchain_openai import ChatOpenAI
from langchain import hub

# 初始化搜索工具
search = DuckDuckGoSearchRun()

# 初始化 LLM
llm = ChatOpenAI(model="gpt-4o")

# 获取提示
prompt = hub.pull("hwchase17/react")

# 创建 Agent
agent = create_react_agent(llm, [search], prompt)

# 执行
executor = AgentExecutor(agent=agent, tools=[search], verbose=True)

result = executor.invoke({
    "input": "2026年诺贝尔物理学奖得主是谁?"
})

print(result["output"])
```

### 4.4 Plan-and-Execute Agent

```python
from langchain.agents import create_plan_and_execute_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain import hub

llm = ChatOpenAI(model="gpt-4o")

# 创建 Plan-and-Execute Agent
agent = create_plan_and_execute_agent(llm, tools, prompt)

executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 复杂任务
result = executor.invoke({
    "input": "帮我比较 Python 和 JavaScript 的性能，然后写一个总结报告"
})
```

---

## 5. 高级用法

### 5.1 自定义工具

```python
from langchain.tools import Tool
from pydantic import BaseModel

# 定义工具输入模式
class WeatherInput(BaseModel):
    city: str = Field(description="城市名称")

# 创建工具
def get_weather(city: str) -> str:
    """获取城市天气"""
    # 实际实现中调用天气 API
    return f"{city}今天晴天，25°C"

weather_tool = Tool(
    name="weather",
    description="获取指定城市的天气信息",
    func=get_weather,
    args_schema=WeatherInput
)

# 使用自定义工具
agent = create_react_agent(llm, [weather_tool], prompt)
```

### 5.2 多工具 Agent

```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool, WikipediaQueryRun, DuckDuckGoSearchRun
from langchain.utilities import WikipediaAPIWrapper

# 多个工具
search = DuckDuckGoSearchRun()
wikipedia = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())

tools = [search, wikipedia]

# 创建 Agent
agent = create_react_agent(llm, tools, prompt)

executor = AgentExecutor(agent=agent, tools=tools)

# 执行
result = executor.invoke({
    "input": "量子计算的最新进展是什么?并简要说明量子纠缠原理"
})
```

### 5.3 带记忆的对话 Agent

```python
from langchain.agents import create_conversational_react_agent
from langchain.memory import ConversationBufferMemory

# 创建记忆
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

# 创建对话 Agent
agent = create_conversational_react_agent(llm, tools, prompt)

# 带记忆执行
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True
)

# 多轮对话
result = executor.invoke({
    "input": "我叫张三"
})
result = executor.invoke({
    "input": "我叫什么名字?"
})
# 输出: "您叫张三"
```

---

## 6. 对比与选择

### 6.1 Agent 策略对比

| 策略 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **ReAct** | 通用、灵活 | 可能多步 | 通用任务 |
| **Plan-and-Execute** | 可规划复杂任务 | 速度慢 | 多步任务 |
| **Conversational** | 多轮对话 | 仅对话 | 聊天 |
| **OpenAI Functions** | 原生支持 | 仅限 OpenAI | OpenAI 模型 |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 通用工具调用 | ReAct |
| 复杂多步任务 | Plan-and-Execute |
| 对话助手 | Conversational |
| OpenAI 模型 | OpenAI Functions |

---

## 参考资源

- [LangChain Agents 文档](https://python.langchain.com/docs/概念/agency/)
- [LangChain GitHub](https://github.com/langchain-ai/langchain)
- [ReAct 论文](https://arxiv.org/abs/2210.03629)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[15_智能体/07_Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_智能体/07_Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
- [[治理/reasoning-models-agents|推理模型 × Agent]] — 推理增强的 Agent 框架
