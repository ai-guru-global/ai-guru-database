---
title: "LangGraph"
category: concepts
tags: ["langgraph", "langchain", "agent", "workflow", "state-machine"]
summary: "LangGraph 是 LangChain 生态中的图编排框架，用状态机（StateGraph）把 LLM、工具、记忆和人机交互组织成可控的循环工作流，适合复杂 Agent 与多 Agent 协作场景。"
created: 2026-07-02
updated: 2026-07-21
aliases:
  - "Langgraph"
sources:
  - "https://langchain-ai.github.io/langgraph/"
  - "https://github.com/langchain-ai/langgraph"
name_zh: "图编排框架"
---

# LangGraph

> 中文简称：图编排框架

## 一句话定义

**LangGraph** 是 LangChain 团队推出的图编排（graph orchestration）框架，它把 Agent 的执行流程建模为**状态机**：节点（Node）负责调用 LLM、工具或人类，边（Edge）决定下一步去向，从而支持循环、条件分支、持久化和多 Agent 协作。

---

## 核心原理与组成

LangGraph 的核心抽象围绕一张**有向图**展开：

| 组件 | 作用 | 实现细节 |
|------|------|----------|
| **State** | 全局共享状态对象 | TypedDict / Pydantic Model，支持 Reducer |
| **Node** | 图中的一个执行步骤 | Python 函数，接收 State 返回更新 |
| **Edge** | 连接节点 | 普通边 / 条件边 (conditional_edges) |
| **Checkpoint** | 内置持久化机制 | SQLite / Postgres / Memory Saver |
| **Command** | 节点间通信指令 | 支持 Send、Goto、Update |

### State 设计

```python
from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # Reducer: 追加而非覆盖
    current_step: str
    retry_count: int
    final_answer: str | None
```

### 图定义与编译

```python
from langgraph.graph import StateGraph, START, END

# 定义图
graph = StateGraph(AgentState)

# 添加节点
graph.add_node("reason", call_llm)
graph.add_node("act", execute_tools)
graph.add_node("reflect", self_evaluate)

# 添加边
graph.add_edge(START, "reason")
graph.add_conditional_edges("reason", should_continue,
    {"continue": "act", "done": END})
graph.add_edge("act", "reflect")
graph.add_conditional_edges("reflect", check_quality,
    {"retry": "reason", "pass": END})

# 编译
app = graph.compile(checkpointer=MemorySaver())
```

### 执行流程

执行流程由 `StateGraph` 定义，编译后通过 `.invoke()` 或 `.stream()` 运行。由于图结构显式可控，开发者能精确决定"何时调用工具、何时返回人类、何时终止"，而不像纯 ReAct Agent 那样把控制权完全交给 LLM。

```python
# 同步执行
result = app.invoke({"messages": [HumanMessage("...")]})

# 流式执行
for event in app.stream({"messages": [HumanMessage("...")]}):
    print(event)

# 断点续跑（HITL）
config = {"configurable": {"thread_id": "user-123"}}
result = app.invoke(input, config)
# ... 等待人类审批 ...
result = app.invoke(None, config)  # 从 checkpoint 继续
```

---

## 典型用例

1. **复杂 Agent 工作流**：审批、多步验证、错误重试等需要循环和状态管理的场景
2. **多 Agent 协作**：把不同 Agent 作为节点，通过 Supervisor 节点动态分配任务
3. **人机协同 (HITL)**：在关键节点暂停，等待人类确认后再继续执行
4. **长流程 RAG**：检索、重排序、摘要、生成按图节点拆分，便于调试和复用
5. **代码生成与执行**：生成 → 执行 → 检查 → 修复 循环
6. **审批工作流**：多级审批、条件分支、超时处理

---

## 多 Agent 模式

### Supervisor 模式

```python
def supervisor(state):
    """Supervisor 决定下一个执行的 Agent"""
    response = llm.invoke([
        SystemMessage("你是任务调度器，决定下一步由谁执行"),
        *state["messages"]
    ])
    return {"next_agent": response.content}

graph.add_conditional_edges("supervisor", lambda s: s["next_agent"], {
    "researcher": "research_agent",
    "coder": "coding_agent",
    "writer": "writing_agent",
    "FINISH": END
})
```

### Swarm 模式（去中心化）

Agent 之间通过 `Command(goto="agent_b")` 直接转移控制权，无需中心调度。

---

## 持久化与部署

### Checkpoint 后端

| 后端 | 适用场景 |
|------|----------|
| MemorySaver | 开发/测试 |
| SqliteSaver | 单机生产 |
| PostgresSaver | 分布式生产 |
| RedisSaver | 高并发场景 |

### LangGraph Platform

- **LangGraph Cloud**：托管部署，自动扩缩容
- **LangGraph Studio**：可视化调试工具，实时查看图执行
- **LangSmith 集成**：追踪、评估、监控

---

## 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **LangChain** | LangGraph 构建在 LangChain 之上，复用其模型、工具、提示模板等抽象 |
| **ReAct Agent** | LangGraph 可以实现更结构化的 ReAct：显式控制思考-行动循环 |
| **CrewAI / AutoGen** | 同是多 Agent 框架；CrewAI 侧重角色+任务，AutoGen 侧重对话，LangGraph 侧重图编排 |
| **Temporal / Prefect** | 与工作流引擎类似，但 LangGraph 原生支持 LLM、循环和人类介入 |
| **OpenAI Agents SDK** | 更轻量，内置 handoff；LangGraph 更灵活，显式控制流 |

---

## 最佳实践

1. **State 最小化**：只存储必要信息，避免 State 膨胀
2. **节点原子性**：每个节点做一件事，便于复用和调试
3. **条件边明确**：路由函数返回确定性结果，避免模糊分支
4. **Checkpoint 必开**：生产环境始终启用持久化，支持故障恢复
5. **超时保护**：为每个节点设置执行超时，防止死循环
6. **可视化调试**：使用 LangGraph Studio 观察执行流
7. **子图复用**：将通用流程封装为子图，跨项目复用

---

## 2026 生态现状

| 类别 | 进展 | 说明 |
|------|------|------|
| **LangGraph Platform** | 云服务 GA | 托管部署 + 自动扩缩 + 监控 |
| **LangGraph Studio** | 可视化 IDE | 图形化编辑、调试、回放 |
| **Human-in-the-Loop** | 原生支持 | 中断/审批/编辑状态 |
| **Multi-Agent** | Supervisor 模式 | 内置多 Agent 协调原语 |
| **MCP 集成** | 工具接入 | 通过 MCP 动态发现工具 |
| **Streaming** | 全流式 | Token/节点/状态多层级流式输出 |

## LangGraph vs 其他编排方案

| 方案 | 适用场景 | 与 LangGraph 对比 |
|------|----------|------------------|
| **CrewAI** | 角色驱动流程 | 更简单，但灵活性不如 LangGraph |
| **AutoGen/AG2** | 对话式协作 | 更自由，但可控性不如 LangGraph |
| **Temporal/Inngest** | 通用工作流 | 非 AI 原生，需额外封装 |
| **纯代码** | 简单顺序流程 | 无状态管理/检查点/可视化 |

---

## Related

- [[概念/Agent/langchain|LangChain]] — LangGraph 的底层生态
- [[概念/Agent/agent-framework|AI Agent 框架总览]] — Agent 框架选型背景
- [[概念/Agent/react-agent|ReAct 智能体]] — LangGraph 常实现的 Agent 范式
- [[概念/Agent/multi-agent-orchestration|多 Agent 编排]] — 多 Agent 协作模式
- [[概念/Agent/agent-loop|Agent Loop]] — Agent 执行循环
- [[概念/Agent/ai-agents|AI Agent]] — 单 Agent 基础概念
- [[15_智能体/02_Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive|多 Agent 开发框架对比]] — 横向对比
- [[概念/Agent/crewai|CrewAI]] — 角色驱动的多 Agent 框架
