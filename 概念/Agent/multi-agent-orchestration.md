---
title: "多 Agent 编排（Multi-Agent Orchestration）"
category: -concepts
tags: ["multi-agent", "orchestration", "coordination", "agent-swarm", "workflow", "crewai", "langgraph", "a2a"]
relationships:
  - target: "概念/Agent/ai-agents"
    type: scales
  - target: "概念/Agent/agent-planning"
    type: distributes
  - target: "概念/Agent/agent-reflection"
    type: coordinates
  - target: "概念/Agent/a2a-protocol"
    type: uses
sources:
  - 智能体/README.md
  - 智能体/Agent_Workflow/README.md
summary: "多 Agent 编排让多个专精 Agent 协作完成复杂任务。从'顺序流水线'到'并行 swarm'再到'层级委派'，编排模式决定协作效率。"
provenance:
  extracted: 0.65
  inferred: 0.3
  ambiguous: 0.05
base_confidence: 0.76
lifecycle: reviewed
lifecycle_changed: 2026-06-23
tier: core
created: 2026-06-23
updated: 2026-07-21
aliases:
  - "Multi Agent Orchestration"
  - "multi agent orchestration"
  - "多智能体编排"

---
# 多 Agent 编排（Multi-Agent Orchestration）

> 单 Agent 像“一人公司”什么都干但都不精；多 Agent 编排像“专业团队”——有产品经理、工程师、QA，分工协作完成大项目。

## 核心要点

- **单 Agent 的局限**：一个 Agent 承担所有角色，上下文膨胀、能力泛化差。
- **多 Agent 的价值**：每个 Agent 专精一域，上下文隔离、可并行、可独立调试。
- **三种编排模式**：顺序（流水线）、并行（swarm）、层级（supervisor-worker）。

## 三种编排模式

| 模式 | 结构 | 适用场景 | 优势 | 劣势 |
|------|------|----------|------|------|
| **顺序流水线** | A→B→C→D | 内容生产、数据处理 | 简单、可预测 | 串行慢、错误传播 |
| **并行 Swarm** | A,B,C→汇总 | 信息收集、对比分析 | 快、独立 | 汇总复杂 |
| **层级委派** | Supervisor→Workers | 复杂项目、动态分工 | 灵活、可扩展 | Supervisor 瓶颈 |
| **循环迭代** | A→B→A→B... | 质量改进、对话 | 质量提升 | 可能死循环 |
| **混合** | 顺序+并行+层级 | 大型项目 | 最灵活 | 最复杂 |

### 编排模式示意

```
1. 顺序流水线:
   Researcher → Writer → Editor → Publisher

2. 并行 Swarm:
   ┌→ Agent A（分析数据）
   ├→ Agent B（查文献）  → 汇总 Agent
   └→ Agent C（做图表）

3. 层级委派:
   Supervisor Agent（分配任务）
   ├→ Worker 1（编码）
   ├→ Worker 2（测试）
   └→ Worker 3（文档）
```

## 主流框架对比

| 框架 | 出品 | 编排模式 | 特点 | 生产就绪 |
|------|------|----------|------|----------|
| **CrewAI** | 社区 | 角色+任务 | 简单直观 | 中 |
| **AutoGen/AG2** | 微软 | 对话式 | Agent 间对话协商 | 中 |
| **LangGraph** | LangChain | 图（状态机） | 最灵活，循环/条件 | 高 |
| **OpenAI Swarm** | OpenAI | 轻量 handoff | 极简，转交控制权 | 低 |
| **Magentic-One** | 微软 | 层级 | 通用型多 Agent | 研究 |
| **A2A Protocol** | Google | 协议层 | 跨框架互操作 | 新兴 |

## 编排的挑战与解法

| 挑战 | 问题 | 解法 |
|------|------|------|
| **通信开销** | Agent 间传消息消耗 token | 紧凑消息格式 + 共享黑板 |
| **错误传播** | 上游错→下游连锁错 | 每步验证 + 兆底重试 |
| **死锁** | 互相等待结果 | 超时机制 + DAG |
| **成本** | N 个 Agent = N 倍 LLM 调用 | 小模型做简单子任务 |
| **调试** | 难追踪哪个 Agent 出错 | 全链路 trace（LangSmith） |
| **一致性** | 多 Agent 状态同步 | 共享状态存储 + 事件源 |

## 编排代码示例 (LangGraph)

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

class ProjectState(TypedDict):
    task: str
    plan: str
    code: str
    review: str
    final: str

# 定义节点
def planner(state):
    plan = llm.invoke(f"分解任务: {state['task']}")
    return {"plan": plan}

def coder(state):
    code = llm.invoke(f"根据计划写代码: {state['plan']}")
    return {"code": code}

def reviewer(state):
    review = llm.invoke(f"审查代码: {state['code']}")
    return {"review": review}

# 构建图
graph = StateGraph(ProjectState)
graph.add_node("planner", planner)
graph.add_node("coder", coder)
graph.add_node("reviewer", reviewer)

graph.add_edge("planner", "coder")
graph.add_edge("coder", "reviewer")
graph.add_conditional_edges("reviewer", should_revise,
    {"revise": "coder", "done": END})

app = graph.compile()
result = app.invoke({"task": "写一个 REST API"})
```

## 2026 趋势

| 趋势 | 说明 |
|------|------|
| **A2A 协议标准化** | Google A2A 让不同框架的 Agent 互操作 |
| **MCP 工具共享** | Agent 通过 MCP 共享工具能力 |
| **大规模 Swarm** | 数十/数百 Agent 协作做超复杂任务 |
| **人机混合编排** | Human-in-the-loop 做关键决策节点 |
| **自适应编排** | 根据任务复杂度动态选择编排模式 |
| **成本感知路由** | 简单子任务用小模型，复杂子任务用大模型 |

## 编排模式选择指南

| 任务特征 | 推荐模式 | 理由 |
|----------|----------|------|
| 步骤固定、有明确顺序 | 顺序流水线 | 简单可预测，易调试 |
| 子任务独立、可并行 | 并行 Swarm | 最大化吞吐 |
| 任务复杂、需动态分工 | 层级委派 | Supervisor 按需分配 |
| 需要质量迭代 | 循环迭代 | 生成-评审-修改闭环 |
| 大型项目、多阶段 | 混合模式 | 阶段间顺序、阶段内并行 |

## 通信与状态管理

### 共享黑板模式

```python
class SharedBlackboard:
    """多 Agent 共享状态存储"""
    def __init__(self):
        self.state = {}  # 全局共享状态
        self.history = []  # 操作历史
    
    def write(self, agent_id: str, key: str, value):
        self.state[key] = value
        self.history.append({"agent": agent_id, "key": key, "ts": time.time()})
    
    def read(self, key: str):
        return self.state.get(key)
    
    def get_updates_since(self, timestamp: float):
        return [h for h in self.history if h["ts"] > timestamp]
```

### 消息传递 vs 共享状态

| 方式 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **消息传递** | 解耦、可追踪 | 序列化开销 | 跨进程/跨服务 |
| **共享状态** | 低延迟、全局视图 | 并发冲突 | 单进程多 Agent |
| **事件源** | 完整审计、可回放 | 存储开销 | 需要审计合规 |

## 容错与恢复策略

```python
def resilient_orchestration(tasks, max_retries=3):
    results = {}
    for task in tasks:
        for attempt in range(max_retries):
            try:
                result = execute_with_timeout(task, timeout=60)
                results[task.id] = result
                break
            except TimeoutError:
                if attempt == max_retries - 1:
                    results[task.id] = fallback_result(task)
                else:
                    task = reassign_to_different_worker(task)
            except AgentError as e:
                log_error(task, e)
                notify_supervisor(task, e)
    return results
```

## 生产最佳实践

1. **从简单开始**: 先用单 Agent，确认不够用再拆多 Agent
2. **明确职责边界**: 每个 Agent 的 system prompt 要精确且不重叠
3. **全链路可观测**: 必须接入 trace，否则无法调试
4. **成本控制**: 设置每个 Agent 的 max_tokens 和总预算
5. **错误隔离**: 单个 Worker 失败不应导致整个流程崩溃
6. **超时保护**: 每个 Agent 设置超时，避免死锁
7. **渐进式拆分**: 先 2-3 个 Agent 验证模式，再逐步扩展
8. **成本感知路由**: 简单子任务用小模型，复杂子任务用大模型

## 监控与可观测性

| 指标 | 含义 | 告警阈值 |
|------|------|----------|
| 编排总耗时 | 端到端完成时间 | > P95 基线 2x |
| 单 Agent 耗时 | 各节点执行时间 | > 60s |
| Token 消耗 | 每次编排总 token | > 预算 80% |
| 重试率 | 需要重试的任务比例 | > 20% |
| 失败率 | 最终失败的任务比例 | > 5% |
| 通信轮次 | Agent 间消息数 | > 预期 1.5x |

## Related

- [[概念/Agent/ai-agents|AI Agent]]
- [[概念/Agent/agent-planning|Agent 规划]]
- [[概念/Agent/agent-reflection|Agent 反思]]
- [[概念/Agent/autogen|AutoGen]]
- [[概念/Agent/crewai|CrewAI]]
- [[概念/Agent/langgraph|LangGraph]]
- [[概念/Agent/a2a-protocol|A2A Protocol]]
- [[概念/Agent/agent-production-deployment|Agent 生产部署]]
