---
title: "Multi-Agent System（多智能体系统）"
category: -concepts
tags: [multi-agent, autogen, crewai, agent-collaboration, a2a-protocol]
aliases:
  - "Multi-Agent"
  - "Multi-Agent System"
  - "MAS"
  - "多智能体"
relationships:
  - target: "概念/autogen"
    type: implemented_by
  - target: "概念/agent-framework"
    type: belongs_to
  - target: "概念/a2a-protocol"
    type: standardized_by
sources:
  - 智能体/Agent_Foundations/Multi_Agent_Systems_Guide.md
  - 概念/autogen.md
summary: "Multi-Agent System（MAS）是多个 LLM Agent 通过协作 / 竞争 / 角色扮演完成复杂任务的系统；2026 年通过 A2A 协议标准化、CrewAI / AutoGen 等框架普及，成为企业级 Agent 应用的主流范式。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-07-21
---

# Multi-Agent System（多智能体系统）

## 核心要点

- **核心思想**：让多个专业化 Agent 分工协作，比单个全能 Agent 更高效。
- **协作模式**：
  - **层级式（Hierarchical）**：Manager Agent 调度 Worker Agents
  - **对话式（Conversational）**：Agents 之间自由对话（AutoGen 风格）
  - **角色扮演（Role-Playing）**：每个 Agent 有明确角色（CrewAI 风格）
  - **流水线（Pipeline）**：按顺序处理（前一个输出是下一个输入）
  - **黑板模式（Blackboard）**：共享状态空间，多 Agent 读写
- **协作协议**：
  - **A2A Protocol**（Agent-to-Agent）：Google 主导的开放协议
  - **MCP**（Model Context Protocol）：工具调用标准
  - **LangGraph**：图编排

## 一句话解释

> Multi-Agent = "一群 Agent 协作"；不是 1 个 Agent 做所有事，而是让每个 Agent 做自己最擅长的。

## 主流框架

| 框架 | 风格 | 强项 |
|------|------|------|
| **AutoGen**（Microsoft）| 对话式 | 灵活、研究友好 |
| **CrewAI** | 角色扮演 | 上手快、SOP 友好 |
| **LangGraph** | 图编排 | 状态机、复杂流程 |
| **OpenAI Swarm** | 极简 Handoff | 轻量、原生 OpenAI |
| **Anthropic Claude Agent SDK** | 单 Agent 为主 | Claude 原生 |
| **AG2 (AutoGen fork)** | 对话式 | AutoGen 继任者 |

## 典型架构

### 1. Manager-Worker（最常用）
```
        ┌──────────┐
        │ Manager  │
        └────┬─────┘
             │
     ┌───────┼───────┬─────────┐
     ▼       ▼       ▼         ▼
[Researcher] [Coder] [Writer] [Reviewer]
```

### 2. Crew（角色扮演）
```
Crew: ResearchProject
├── Agent: Lead (协调者)
├── Agent: Researcher (搜集资料)
├── Agent: Analyst (分析数据)
└── Agent: Writer (撰写报告)
Task: 各 Agent 按顺序执行自己的任务
```

### 3. Graph（图编排）
```
[Planner] → [Researcher] → [Reviewer]
                ↑              │
                └────[Revise]──┘
```

## 协作模式对比

| 模式 | 适用 | 风险 |
|------|------|------|
| **层级式** | 复杂任务、可控性强 | Manager 可能成为瓶颈 |
| **对话式** | 研究、头脑风暴 | 容易跑题 |
| **角色扮演** | 业务流程（SOP） | 角色定义难 |
| **流水线** | 数据处理、ETL | 单点失败 |
| **黑板** | 多专家协作 | 状态冲突 |

## 何时使用

✅ **推荐**：
- 复杂任务需多视角（研究 + 分析 + 写作）
- 模拟真实组织（销售 / 客服 / 工程团队）
- 业务流程自动化（SOP 明确）
- 角色边界清晰的场景

⚠️ **不推荐**：
- 简单任务（单 Agent 足够）
- 强延迟敏感（多 Agent 增加开销）
- 角色边界模糊

## 关键挑战

| 挑战 | 缓解 |
|------|------|
| **通信开销** | 批量化、共享上下文 |
| **角色混淆** | 明确 system prompt + 边界 |
| **循环陷阱** | 最大步数限制 + 终止条件 |
| **成本失控** | token 配额 + 模型路由（小模型做子任务）|
| **结果不一致** | Reviewer Agent + 校验环节 |
| **状态同步** | 分布式事务 + 最终一致性 |
| **故障传播** | 熔断器 + 降级策略 |

## 2026 年多智能体生态

| 框架/协议 | 版本 | 特色 | 适用场景 |
|-----------|------|------|----------|
| **AutoGen 0.4** | 事件驱动重构 | 异步、可扩展 | 研究、复杂对话 |
| **CrewAI 1.x** | 企业版 | SOP、护栏、监控 | 业务自动化 |
| **LangGraph Platform** | 云托管 | 持久化、人工审批 | 生产工作流 |
| **A2A Protocol** | v1.0 | 开放标准 | 跨平台 Agent 互操作 |
| **OpenAI Agents SDK** | 原生 | Swarm 继任者 | OpenAI 生态 |
| **Google ADK** | 新发布 | A2A 原生 | Google Cloud |

## 生产最佳实践

1. **单 Agent 优先**：只有任务确实需要多视角时才用多 Agent
2. **明确角色边界**：每个 Agent 的 system prompt 必须清晰定义职责和边界
3. **设置终止条件**：最大步数、最大时间、最大成本三重限制
4. **成本分层**：Manager 用强模型，Worker 用性价比模型
5. **状态外置**：多 Agent 共享状态存储在 Redis/DB，不依赖内存
6. **可观测性**：每个 Agent 的输入输出、决策过程都要可追踪
7. **渐进式扩展**：从 2-3 个 Agent 开始，验证后再增加

## 代码示例

```python
# CrewAI 多 Agent 示例
from crewai import Agent, Task, Crew

# 定义 Agents
researcher = Agent(
    role="研究员",
    goal="搜集和分析相关信息",
    backstory="你是一位经验丰富的研究分析师",
    tools=[search_tool, web_scraper],
    llm="gpt-4o"
)

writer = Agent(
    role="撰写者",
    goal="将研究结果转化为清晰的报告",
    backstory="你是一位专业的技术写作专家",
    llm="gpt-4o-mini"  # 成本优化
)

# 定义 Tasks
research_task = Task(
    description="研究 {topic} 的最新进展",
    expected_output="结构化的研究笔记",
    agent=researcher
)

writing_task = Task(
    description="基于研究结果撰写报告",
    expected_output="Markdown 格式的报告",
    agent=writer,
    context=[research_task]  # 依赖研究任务
)

# 组建 Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    verbose=True,
    max_rpm=100,  # 速率限制
    max_cost=5.0   # 成本限制
)

result = crew.kickoff(inputs={"topic": "AI Agent 2026"})
```

## Related

- [[概念/multi-agent-orchestration|多Agent编排]] — 工程编排视角
- [[概念/autogen]] — AutoGen
- [[概念/agent-framework]] — Agent 框架总览
- [[概念/a2a-protocol]] — A2A 协议
- [[智能体/Agent_Foundations/Multi_Agent_Systems_Guide]] — 多 Agent 深度- [[概念/multi-agent-orchestration]] — Multi Agent Orchestration
