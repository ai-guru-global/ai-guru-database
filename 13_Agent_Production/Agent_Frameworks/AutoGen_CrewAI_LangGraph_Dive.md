# 多 Agent 开发框架: AutoGen / CrewAI / LangGraph

> **一句话理解**: AutoGen、CrewAI 和 LangGraph 是当前最主流的多 Agent 开发框架——AutoGen 以微软研究院为背书强调对话式协作，CrewAI 以角色扮演和任务编排见长，LangGraph 则以状态机模式和可扩展性著称。

---

## 目录

1. [框架概述](#1-框架概述)
2. [Microsoft AutoGen](#2-microsoft-autogen)
3. [CrewAI](#3-crewai)
4. [LangGraph](#4-langgraph)
5. [对比与选择](#5-对比与选择)

---

## 1. 框架概述

### 1.1 多 Agent 框架生态

```
多 Agent 框架生态
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                    多 Agent 框架生态                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  AutoGen    │  │   CrewAI    │  │  LangGraph  │        │
│  │  (微软)     │  │  (独立)     │  │  (LangChain) │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│         │                 │                  │                  │
│         ▼                 ▼                  ▼                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ 对话式协作   │  │ 角色+任务   │  │ 状态机模式   │        │
│  │ Group Chat  │  │ 编排        │  │ 可扩展       │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 核心对比

| 维度 | AutoGen | CrewAI | LangGraph |
|------|---------|--------|-----------|
| **开发商** | Microsoft | CrewAI | LangChain |
| **协作模式** | 对话式 | 角色扮演 | 状态机 |
| **任务编排** | 灵活 | 强 | 极强 |
| **学习曲线** | 中等 | 较低 | 较高 |
| **扩展性** | 高 | 中 | 极高 |
| **生产就绪** | 高 | 中 | 高 |

---

## 2. Microsoft AutoGen

### 2.1 核心概念

```
AutoGen 核心概念
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      AutoGen 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Assistant  │  │    User     │  │   Agent     │        │
│  │   Agent     │  │   Proxy     │  │  (自定义)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│          │                  │                  │               │
│          └──────────────────┼──────────────────┘               │
│                             │                                    │
│                             ▼                                    │
│                    ┌──────────────┐                             │
│                    │   Group Chat │                             │
│                    │   Manager    │                             │
│                    └──────────────┘                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Agent 类型:
─────────────────────────────────────────────────────────────────
• AssistantAgent: 执行任务、生成响应
• UserProxyAgent: 人类输入/反馈
• GroupChatManager: 多 Agent 协调
```

### 2.2 代码示例

```python
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager

# 创建 Agent
assistant = AssistantAgent(
    name="assistant",
    llm_config={"model": "gpt-4o"}
)

coder = AssistantAgent(
    name="coder",
    llm_config={"model": "gpt-4o"}
)

reviewer = AssistantAgent(
    name="reviewer",
    llm_config={"model": "gpt-4o"}
)

# 用户代理
user = UserProxyAgent(name="user")

# Group Chat 模式
group_chat = GroupChat(
    agents=[assistant, coder, reviewer, user],
    messages=[],
    max_round=10
)

manager = GroupChatManager(groupchat=group_chat)

# 启动对话
user.initiate_chat(
    manager,
    message="实现一个用户认证功能，包括注册和登录"
)
```

### 2.3 核心特性

| 特性 | 描述 |
|------|------|
| **对话式协作** | Agent 之间自然对话协作 |
| **灵活的消息传递** | 支持同步/异步消息 |
| **人类参与** | Human-in-the-loop 支持 |
| **代码执行** | 内置代码执行环境 |
| **多模型支持** | OpenAI、Azure、LLM 兼容 |

---

## 3. CrewAI

### 3.1 核心概念

```
CrewAI 核心概念
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      CrewAI 架构                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Crew (团队)                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │    ┌─────────┐    ┌─────────┐    ┌─────────┐           │    │
│  │    │  Agent  │    │  Agent  │    │  Agent  │           │    │
│  │    │ (角色)  │    │ (角色)  │    │ (角色)  │           │    │
│  │    └────┬────┘    └────┬────┘    └────┬────┘           │    │
│  │         │              │              │                 │    │
│  │         └──────────────┼──────────────┘                 │    │
│  │                          │                                │    │
│  │                    ┌────▼────┐                          │    │
│  │                    │  Task   │                          │    │
│  │                    │ (任务)  │                          │    │
│  │                    └─────────┘                          │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  核心概念: Role + Goal + Backstory → Agent                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 代码示例

```python
from crewai import Agent, Crew, Task, Process

# 定义 Agent (带角色设定)
researcher = Agent(
    role="Senior Researcher",
    goal="Research the latest AI developments",
    backstory="You are a senior researcher with 10 years of experience...",
    verbose=True
)

writer = Agent(
    role="Content Writer",
    goal="Write engaging technical content",
    backstory="You are an experienced technical writer...",
    verbose=True
)

# 定义 Task
research_task = Task(
    description="Research the latest developments in AI agents",
    agent=researcher,
    expected_output="A comprehensive research report"
)

write_task = Task(
    description="Write a blog post about the research",
    agent=writer,
    expected_output="An engaging blog post in markdown format"
)

# 创建 Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential  # 顺序执行
)

# 启动
result = crew.kickoff()
print(result)
```

### 3.3 核心特性

| 特性 | 描述 |
|------|------|
| **角色驱动** | 基于角色的 Agent 设计 |
| **任务编排** | 顺序 + 并行任务执行 |
| **目标导向** | 每个 Agent 有明确目标 |
| **记忆系统** | 内置短期/长期记忆 |
| **工具集成** | 丰富的内置工具 |

---

## 4. LangGraph

### 4.1 核心概念

```
LangGraph 核心概念
═══════════════════════════════════════════════════════════════════

LangGraph = LangChain + Graph (状态机 + DAG)

┌─────────────────────────────────────────────────────────────────┐
│                      LangGraph 状态机                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                     ┌─────────────┐                             │
│                     │   START    │                             │
│                     └──────┬──────┘                             │
│                            │                                    │
│                            ▼                                    │
│               ┌────────────────────────┐                        │
│               │        State          │                        │
│               │  (共享状态对象)        │                        │
│               └────────────────────────┘                        │
│                      │        │                                │
│            ┌────────┘        └────────┐                        │
│            ▼                         ▼                        │
│     ┌────────────┐            ┌────────────┐                   │
│     │  Node 1   │            │  Node 2   │                   │
│     │ (Agent)   │            │  (Tools)  │                   │
│     └─────┬─────┘            └─────┬──────┘                   │
│           │                       │                           │
│           └───────────┬───────────┘                           │
│                       ▼                                       │
│               ┌────────────┐                                  │
│               │  END       │                                  │
│               └────────────┘                                  │
│                                                                  │
│  特点: 循环支持、持久化、多Agent协调                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 代码示例

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

# 定义状态
class AgentState(TypedDict):
    messages: list
    next_action: str
    current_agent: str

# 定义节点
def research_node(state):
    """研究 Agent"""
    return {"messages": [...], "current_agent": "researcher"}

def write_node(state):
    """写作 Agent"""
    return {"messages": [...], "current_agent": "writer"}

def should_continue(state):
    """路由决策"""
    if state["next_action"] == "end":
        return END
    return "write"

# 构建图
graph = StateGraph(AgentState)

graph.add_node("research", research_node)
graph.add_node("write", write_node)

graph.set_entry_point("research")
graph.add_conditional_edges(
    "research",
    should_continue,
    {"write": "write", END: END}
)
graph.add_edge("write", END)

# 编译
app = graph.compile()

# 运行
result = app.invoke({"messages": ["研究 AI Agent 发展"]})
```

### 4.3 核心特性

| 特性 | 描述 |
|------|------|
| **状态机模式** | 支持循环和复杂流程 |
| **持久化** | 内置 checkpointing |
| **多 Agent** | 原生多 Agent 支持 |
| **流式执行** | 支持流式输出 |
| **可扩展** | 完全可定制 |

---

## 5. 对比与选择

### 5.1 场景选择

```
框架选择指南
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  你需要什么？                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Q1: 主要场景是什么？                                           │
│  ├── 对话式多 Agent 协作 → AutoGen                              │
│  ├── 角色+任务编排 → CrewAI                                     │
│  ├── 复杂工作流/状态机 → LangGraph                             │
│  └── 快速原型 → CrewAI                                         │
│                                                                  │
│  Q2: 需要支持循环吗？                                           │
│  ├── 是 → LangGraph (原生支持)                                 │
│  └── 否 → AutoGen / CrewAI                                     │
│                                                                  │
│  Q3: 需要持久化吗？                                             │
│  ├── 是 → LangGraph (checkpointing)                            │
│  └── 否 → 三个都可选                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 功能对比

| 功能 | AutoGen | CrewAI | LangGraph |
|------|---------|--------|-----------|
| 多 Agent 协作 | ✓ | ✓ | ✓ |
| 角色定义 | 基础 | 强大 | 中等 |
| 任务编排 | 灵活 | 强大 | 极强 |
| 循环支持 | 有限 | 有限 | 完全 |
| 持久化 | 有限 | 有限 | 完整 |
| 代码执行 | ✓ | - | ✓ |
| 人类参与 | ✓ | ✓ | ✓ |
| 流式执行 | ✓ | ✓ | ✓ |

### 5.3 代码复杂度对比

```python
# AutoGen - 最少代码量
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent(name="assistant", llm_config=...)
user = UserProxyAgent(name="user")
user.initiate_chat(assistant, message="...")

# CrewAI - 中等代码量
from crewai import Agent, Crew, Task, Process

agent = Agent(role="...", goal="...", backstory="...")
task = Task(description="...", agent=agent)
crew = Crew(agents=[agent], tasks=[task])
crew.kickoff()

# LangGraph - 较多代码量
from langgraph.graph import StateGraph, END

def node(state): ...
def route(state): ...

graph = StateGraph(State)
graph.add_node("...", node)
graph.add_edge(START, "...")
graph.add_conditional_edges("...", route)
app = graph.compile()
```

---

## 相关资源

- [AutoGen GitHub](https://github.com/microsoft/autogen)
- [CrewAI GitHub](https://github.com/crewAI/crewAI)
- [LangGraph 文档](https://langchain-ai.github.io/langgraph/)
- [AgentScope Deep Dive](./AgentScope_Deep_Dive.md)
- [Multi-Agent Evaluation](../16_Agent_Evaluation/Multi_Agent_Evaluation_2026.md)
