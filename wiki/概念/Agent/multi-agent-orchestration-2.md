---
title: "多 Agent 编排 2.0 (LangGraph / AutoGen 0.4 / CrewAI 1.0 / 状态机编排)"
category: concepts
tags:
  - agent
  - multi-agent
  - langgraph
  - autogen
  - crewai
  - orchestration
  - state-machine
  - workflow
aliases:
  - Multi-Agent Orchestration 2.0
  - LangGraph
  - AutoGen 0.4
  - CrewAI 1.0
  - State Machine Orchestration
  - Multi-Agent Workflow
relationships:
  - target: "概念/multi-agent"
    type: extends
  - target: "概念/multi-agent-orchestration"
    type: extends
  - target: "概念/agent-framework"
    type: related_to
  - target: "概念/langgraph"
    type: related_to
summary: "多 Agent 编排 2.0 是 2024-2026 的"Agent 工程化"突破——LangGraph(状态图)、AutoGen 0.4(actor model)、CrewAI 1.0(role-based)、OpenAI Swarm(handoff)、Anthropic Workflows 把"多 Agent 协作"从脆弱脚本升级为工程化框架,支持状态持久化、人机协作、可观测性。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "多 Agent 编排 2.0"
---

# 多 Agent 编排 2.0

> 中文简称：多 Agent 编排 2.0

> **一句话理解**:多 Agent 编排 2.0 让"多 Agent 协作"像微服务一样工程化——LangGraph 把 Agent 编排成状态图,AutoGen 0.4 用 actor model 解耦通信,CrewAI 用角色扮演简化建模,OpenAI Swarm 用 handoff 做轻量协作。是企业 Agent 落地的"操作系统"。

---

## 一、从 1.0 到 2.0 的进化

### 1.0(2023-2024)

- 简单 Chain:LangChain AgentExecutor
- 多 Agent:AutoGen 0.2、CrewAI 0.x
- 痛点:无状态管理、无持久化、无可观测、循环不可控

### 2.0(2024-2026)

- **LangGraph**(2024-08):状态图 + Checkpointer
- **AutoGen 0.4**(2024-12):actor model 重构
- **CrewAI 1.0**(2024-10):role + task + flow
- **OpenAI Swarm**(2024-10):轻量 handoff
- **Anthropic Workflows**(2025-02):Claude 编排
- **Pydantic AI**(2024-11):类型安全

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 多 Agent 系统 | Multi-Agent System(MAS) | 多个 Agent 协作 |
| 编排 | Orchestration | 协调多个 Agent |
| 工作流 | Workflow | 任务流图 |
| 状态图 | State Graph | LangGraph 核心 |
| 状态机 | State Machine | 离散状态转移 |
| 节点 | Node | 图中的一个 Agent / 工具 |
| 边 | Edge | 节点间转移 |
| 条件边 | Conditional Edge | 基于条件路由 |
| 检查点 | Checkpoint | 状态持久化快照 |
| 持久化 | Persistence | 跨会话恢复 |
| 演员模型 | Actor Model | AutoGen 0.4 基础 |
| 消息传递 | Message Passing | Agent 间通信 |
| 角色 | Role | CrewAI 中 Agent 身份 |
| 任务 | Task | CrewAI 中工作单元 |
| 流程 | Flow | CrewAI 1.0 新增 |
| 交接 | Handoff | OpenAI Swarm 模式 |
| 共享状态 | Shared State | 跨 Agent 共享上下文 |
| 通信协议 | Communication Protocol | Agent 间规范 |
| 监督者 | Supervisor | 协调多个 worker Agent |
| 路由器 | Router | 决定下一个 Agent |
| 子图 | Subgraph | 嵌套图 |
| 人机协作 | Human-in-the-Loop | 关键节点人工介入 |
| 时间旅行 | Time Travel | 回溯到之前状态 |
| 流式输出 | Streaming | 实时事件流 |
| 工具调用 | Tool Calling | Agent 调外部函数 |
| 中间件 | Middleware | 横切关注点(日志/重试) |
| 回调 | Callback | 事件钩子 |
| 重试 | Retry | 失败重试 |
| 错误边界 | Error Boundary | 失败隔离 |

---

## 三、主流框架对比(2026-02 快照)

| 框架 | 厂商 | 范式 | 状态管理 | 持久化 | GitHub Stars | 许可证 |
|---|---|---|---|---|---|---|
| **LangGraph** | LangChain | 状态图 | ✓(State) | ✓(Checkpointer) | 6K+ | MIT |
| **AutoGen 0.4** | Microsoft | Actor Model | ✓ | ✓(内置) | 35K+ | MIT + 商业 |
| **CrewAI 1.0** | CrewAI | Role-Based | ✓ | ✓(SQLite/Redis) | 28K+ | MIT |
| **OpenAI Swarm** | OpenAI | Handoff | 轻量 | — | 13K+ | MIT |
| **Anthropic Workflows** | Anthropic | Pipeline | — | — | — | 商业 |
| **Pydantic AI** | Pydantic 团队 | Type-Safe | ✓ | ✓ | 8K+ | MIT |
| **Semantic Kernel** | Microsoft | Plugin | ✓ | ✓ | 23K+ | MIT |
| **Haystack Agents** | deepset | Pipeline | ✓ | ✓ | 16K+ | Apache 2.0 |
| **DSPy** | Stanford | Declarative | ✓ | — | 25K+ | Apache 2.0 |
| **Letta** | Letta | Stateful Agent | ✓ | ✓(内置 DB) | 18K+ | Apache 2.0 |

---

## 四、LangGraph 实战

### 4.1 核心思想

把 Agent 编排成**有向状态图**:
- **State**:TypedDict 定义全局状态
- **Node**:Agent / 工具 / 函数
- **Edge**:节点转移,支持条件
- **Checkpointer**:状态持久化(支持时间旅行)

### 4.2 实战

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
    research_results: str

# 定义 Agent
def researcher(state: State):
    # 调用搜索工具
    results = search(state["messages"][-1].content)
    return {"research_results": results}

def writer(state: State):
    # 写报告
    return {"messages": [AIMessage(f"报告: {state['research_results']}")]}

# 构建图
workflow = StateGraph(State)
workflow.add_node("researcher", researcher)
workflow.add_node("writer", writer)
workflow.add_edge(START, "researcher")
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", END)

# 持久化
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

# 运行
config = {"configurable": {"thread_id": "1"}}
result = app.invoke(
    {"messages": [HumanMessage("研究 LangGraph 最新进展")]},
    config=config
)
print(result)

# 时间旅行
state_history = app.get_state_history(config)
for state in state_history:
    print(state.values, state.next)
```

### 4.3 关键能力

- **条件边**:基于状态决定下一步
- **子图**:嵌套复杂流程
- **人机协作**:`interrupt_before` 关键节点暂停
- **时间旅行**:`get_state_history` 回溯
- **流式输出**:`stream_mode="events"` 实时事件

---

## 五、AutoGen 0.4 实战

### 5.1 核心思想

**Actor Model** 重构:
- 每个 Agent 是独立 actor
- 消息传递解耦
- 跨语言、跨进程、跨机器

### 5.2 实战

```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(model="gpt-4o")

# 定义 Agent
researcher = AssistantAgent(
    name="researcher",
    model_client=model_client,
    system_message="你负责研究,收集信息",
)
writer = AssistantAgent(
    name="writer",
    model_client=model_client,
    system_message="你负责写作,基于研究结果写报告",
)

# 编排
team = RoundRobinGroupChat(
    [researcher, writer],
    termination_condition=TextMentionTermination("TERMINATE"),
)

# 运行
result = await team.run(task="研究 AutoGen 0.4 最新进展")
print(result.messages)
```

### 5.3 关键能力

- **Actor Model**:分布式、跨进程
- **多种终止条件**:关键词、token 用量、超时
- **流式输出**:实时事件
- **持久化**:内置
- **MCP 集成**:原生支持

---

## 六、CrewAI 1.0 实战

### 6.1 核心思想

**Role-Based**:每个 Agent 有明确角色 + 目标 + 背景故事。

### 6.2 实战

```python
from crewai import Agent, Task, Crew, Process

# 定义 Agent
researcher = Agent(
    role="研究员",
    goal="收集最新 AI 进展信息",
    backstory="你是一位资深 AI 研究员,擅长发现新趋势",
    llm="gpt-4o",
)

writer = Agent(
    role="作家",
    goal="写出高质量 AI 文章",
    backstory="你是科技作家,擅长将复杂技术讲清楚",
    llm="gpt-4o",
)

# 定义任务
research_task = Task(
    description="研究 LangGraph 最新进展,整理 3 个核心特性",
    agent=researcher,
)

write_task = Task(
    description="基于研究结果,写一篇 500 字博客",
    agent=writer,
)

# 编排
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
)

result = crew.kickoff()
print(result)
```

### 6.3 关键能力

- **Role-Based 直观**:业务人员也能建模
- **Flow(1.0 新增)**:复杂工作流
- **持久化**:SQLite / Redis
- **可观测性**:CrewAI + Langfuse

---

## 七、OpenAI Swarm 实战

### 7.1 核心思想

**Handoff** + **轻量**:无状态管理,Agent 之间"转交"。

### 7.2 实战

```python
from swarm import Swarm, Agent

client = Swarm()

def transfer_to_sales():
    return sales_agent

def transfer_to_support():
    return support_agent

triage = Agent(
    name="Triage",
    instructions="你是分流客服,根据用户问题转到销售或售后",
    functions=[transfer_to_sales, transfer_to_support],
)

sales_agent = Agent(
    name="Sales",
    instructions="你是销售,回答产品问题",
)

support_agent = Agent(
    name="Support",
    instructions="你是售后,处理退换货",
)

response = client.run(
    agent=triage,
    messages=[{"role": "user", "content": "我想退订单"}],
)
print(response.messages[-1]["content"])
```

### 7.3 特点

- 极简(200 行代码)
- 适合轻量场景
- 实验性质,生产建议用 LangGraph / AutoGen

---

## 八、生产最佳实践

1. **复杂业务流程用 LangGraph**:状态图 + 持久化,生产首选。
2. **分布式 Agent 用 AutoGen 0.4**:Actor model 跨进程/机器。
3. **业务建模用 CrewAI**:Role-based 直观,业务人员友好。
4. **轻量场景用 Swarm**:无状态、简单 handoff。
5. **状态持久化必备**:MemorySaver / Postgres / Redis。
6. **人机协作关键节点**:支付、删除、确认。
7. **可观测性用 Langfuse**:所有 Agent 调用可追踪。
8. **错误重试 + 边界**:网络错误、LLM 限流都要处理。
9. **子图 + 复用**:复杂流程拆子图,跨业务复用。
10. **流式输出实时反馈**:长任务用 SSE 流式,用户不焦虑。
11. **成本监控**:每步 LLM 调用计费,长流程要优化。
12. **测试用 mock LLM**:CI 跑通不需要真调 LLM。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **LangGraph** | 1.0 GA(2025),LangGraph Studio 可视化,LangGraph Cloud 托管 |
| **AutoGen** | 0.4 GA(2024-12),actor model 成熟,AG2 社区 |
| **CrewAI** | 1.0 GA(2024-10),Flow 范式,企业 ARR $5M+ |
| **OpenAI Swarm** | 实验阶段,新版本(2025-Q3)状态管理增强 |
| **Anthropic Workflows** | Claude API 编排,Sub-agent 模式 |
| **Pydantic AI** | v0.3,类型安全路线,Pythonic 体验 |
| **LangGraph + LangMem** | LangChain 生态整合,Memory + Graph 一体化 |
| **企业应用** | 客服 / 销售 / 运营 / 财务 / 研发"Agent 化" |
| **标准化** | Open Agent Schema / MCP 协议 / A2A |
| **市场规模** | 企业 Agent 平台 ARR $500M+,年增速 200%+ |

---

## 十、See Also(官方源)

### LangGraph

- 官方 [langchain.com/langgraph](https://langchain-ai.github.io/langgraph/)
- GitHub [github.com/langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)
- 文档 [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph/)
- LangGraph Studio [langchain.com/langgraph-studio](https://langchain.com/langgraph-studio)

### AutoGen

- 官方 [microsoft.github.io/autogen](https://microsoft.github.io/autogen/)
- GitHub [github.com/microsoft/autogen](https://github.com/microsoft/autogen)
- AG2 社区 [github.com/ag2ai/ag2](https://github.com/ag2ai/ag2)

### CrewAI

- 官方 [crewai.com](https://www.crewai.com/)
- GitHub [github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)
- 文档 [docs.crewai.com](https://docs.crewai.com/)

### OpenAI Swarm

- GitHub [github.com/openai/swarm](https://github.com/openai/swarm)
- 文档 [github.com/openai/swarm/blob/main/README.md](https://github.com/openai/swarm/blob/main/README.md)

### 其他

- Pydantic AI [github.com/pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai)
- Semantic Kernel [github.com/microsoft/semantic-kernel](https://github.com/microsoft/semantic-kernel)
- Letta [github.com/letta-ai/letta](https://github.com/letta-ai/letta)

---

## 十一、相关概念卡

- [[概念/multi-agent|Multi Agent]]
- [[概念/multi-agent-orchestration|Multi Agent Orchestration]]
- [[概念/agent-framework|Agent Framework]]
- [[概念/agent-loop|Agent Loop]]
- [[概念/langgraph|Langgraph]]
- [[概念/crewai|Crewai]]
- [[概念/autogen|Autogen]]
- [[概念/agent-memory-2|Agent Memory 2]]
