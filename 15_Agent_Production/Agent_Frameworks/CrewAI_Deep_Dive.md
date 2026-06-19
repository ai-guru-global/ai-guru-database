---
title: "CrewAI: 多 Agent 协作框架"
category: "13-agent-production-agent-frameworks"
tags: ["ai-agents", "agent-framework", "production", "langgraph", "crewai"]
summary: "> **一句话理解**: CrewAI 让多个 AI Agent 像团队一样协作——每个 Agent 有自己的角色和目标，通过任务编排实现复杂目标。"
created: "2026-05-31"
updated: "2026-05-31"
---

# CrewAI: 多 Agent 协作框架

> **一句话理解**: CrewAI 让多个 AI Agent 像团队一样协作——每个 Agent 有自己的角色和目标，通过任务编排实现复杂目标。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [代码示例](#4-代码示例)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
CrewAI: 多 Agent 协作框架
═══════════════════════════════════════════════════════════════════

定位: 以角色为中心的 AI Agent 编排框架，让多个 Agent 像团队一样工作

核心理念:
───────────────────────────────────────────────────────────────────
• 角色扮演: 每个 Agent 有明确角色和职责
• 任务编排: 定义任务依赖和执行顺序
• 自主协作: Agent 之间自主分配子任务
• 流程控制: 支持顺序、并行、层次化流程
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Role-based Agents** | 基于角色的 Agent 设计 |
| **Task Dependencies** | 任务依赖和流程控制 |
| **Crew Management** | 多 Agent 协调管理 |
| **Tool Integration** | 内置工具和自定义工具 |
| **Output Parsing** | 结构化输出解析 |
| **Memory** | Agent 间共享记忆 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| CrewAI 0.1 | 2023.10 | 首个版本 |
| v0.2 | 2024.1 | Agent 协作 |
| v0.3 | 2024.4 | 任务依赖 |
| v0.4 | 2024.7 | 流程控制 |
| v0.5 | 2024.10 | 记忆系统 |
| v1.0 | 2025.2 | 生产就绪 |

---

## 2. 核心概念

### 2.1 核心对象

```
CrewAI 核心对象
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      CrewAI 核心对象                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Agent (智能体)                                                   │
│  ├── role: 角色名称                                             │
│  ├── goal: 目标描述                                             │
│  ├── backstory: 背景故事                                        │
│  ├── tools: 可用工具                                            │
│  └── verbose: 详细日志                                         │
│         │                                                        │
│         ▼                                                        │
│  Task (任务)                                                     │
│  ├── description: 任务描述                                     │
│  ├── expected_output: 期望输出                                  │
│  ├── agent: 负责Agent                                          │
│  ├── tools: 任务专用工具                                        │
│  └── context: 依赖的其他任务                                    │
│         │                                                        │
│         ▼                                                        │
│  Crew (团队)                                                     │
│  ├── agents: Agent 列表                                        │
│  ├── tasks: Task 列表                                          │
│  ├── process: 执行流程 (sequential/parallel/hierarchical)      │
│  └── verbose: 调试模式                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Agent 设计

```python
from crewai import Agent

# 创建研究员 Agent
researcher = Agent(
    role="市场研究员",
    goal="收集和分析市场数据，提供有价值的洞察",
    backstory="""
    你是一家顶级市场研究公司的资深分析师，
    专注于科技行业。你有10年的行业分析经验，
    擅长从海量数据中提取关键信息。
    """,
    tools=[search_tool, scrape_tool],
    verbose=True,
)

# 创建作家 Agent
writer = Agent(
    role="内容作家",
    goal="将研究洞察转化为清晰、吸引人的报告",
    backstory="""
    你是一位资深商业作家，曾为《财富》500强
    企业撰写市场报告。你的文字简洁有力，
    善于将复杂信息通俗化。
    """,
    tools=[],
    verbose=True,
)
```

### 2.3 任务设计

```python
from crewai import Task

# 创建研究任务
research_task = Task(
    description="""
    研究 AI 在金融行业的应用趋势
    1. 搜索最新的 AI 金融应用案例
    2. 分析主要玩家和市场份额
    3. 识别关键技术和趋势
    """,
    expected_output="一份详细的 AI 金融行业分析报告",
    agent=researcher,  # 指定负责 Agent
)

# 创建写作任务
write_task = Task(
    description="""
    基于研究报告撰写一份执行摘要
    1. 总结关键发现
    2. 提出战略建议
    3. 限制在 500 字以内
    """,
    expected_output="一份简洁的执行摘要",
    agent=writer,
    context=[research_task],  # 依赖研究任务
)
```

---

## 3. 架构设计

### 3.1 团队协作流程

```
CrewAI 团队协作流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Crew 执行流程                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  用户: "生成一份 AI 金融行业报告"                                 │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Crew (团队)                                                 │ │
│  │                                                             │ │
│  │  agents: [researcher, analyst, writer]                     │ │
│  │  tasks: [research_task, analyze_task, write_task]         │ │
│  │  process: sequential                                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Task 1: 研究任务 (Researcher)                               │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ 执行: 搜索 AI 金融案例                                      │ │
│  │ 输出: 市场数据和分析报告                                    │ │
│  │ 状态: ✅ 完成                                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Task 2: 分析任务 (Analyst) - 并行或顺序                      │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ 输入: 研究报告 + 原始数据                                    │ │
│  │ 执行: 深度分析和洞察提取                                    │ │
│  │ 输出: 关键洞察和趋势                                         │ │
│  │ 状态: ✅ 完成                                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Task 3: 写作任务 (Writer)                                   │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ 输入: 研究报告 + 分析洞察                                    │ │
│  │ 执行: 撰写执行摘要报告                                       │ │
│  │ 输出: 最终报告                                              │ │
│  │ 状态: ✅ 完成                                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  最终输出: AI 金融行业报告                                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 流程类型

```
流程类型对比
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│ Sequential (顺序流程)                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Task A → Task B → Task C                                       │
│  按顺序执行，前一个完成后才执行下一个                             │
│  适用: 有明确依赖关系的任务链                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────────┐
│ Parallel (并行流程)                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│      ┌─ Task A ─┐                                               │
│  ────┼─ Task B ─┼──→ Merge → Output                             │
│      └─ Task C ─┘                                               │
│  同时执行，最后合并结果                                           │
│  适用: 独立子任务                                                │
└──────────────────────────────────────────────────────────────────┘
                              │
┌──────────────────────────────────────────────────────────────────┐
│ Hierarchical (层级流程)                                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Manager                                                         │
│    │                                                            │
│  ┌─┴─┐                                                          │
│  ▼     ▼                                                         │
│ Worker1  Worker2                                                │
│  按层级执行，Manager 负责任务分配                                 │
│  适用: 需要管理的复杂任务                                        │
└──────────────────────────────────────────────────────────────────┘
```

### 3.3 Agent 间通信

```
Agent 共享记忆
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      共享记忆层                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Crew Shared Memory                                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                                                             │ │
│  │  entities:  实体记忆 (公司名、人名、技术名词)               │ │
│  │  memories: 重要事件记忆                                     │ │
│  │  contexts: 上下文信息                                       │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              ▲                                    │
│                              │                                    │
│         ┌────────────────────┼────────────────────┐             │
│         │                    │                    │             │
│    ┌────┴────┐         ┌────┴────┐         ┌────┴────┐        │
│    │Research │         │ Analyst │         │ Writer  │        │
│    │  Agent  │         │  Agent  │         │  Agent  │        │
│    └─────────┘         └─────────┘         └─────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 代码示例

### 4.1 基础使用

```python
from crewai import Agent, Task, Crew, Process

# 定义工具
search_tool = SearchTool()
scrape_tool = ScrapeTool()

# 创建 Agent
researcher = Agent(
    role="研究员",
    goal="收集最新 AI 资讯",
    backstory="资深科技记者，专注 AI 领域",
    tools=[search_tool, scrape_tool],
)

writer = Agent(
    role="作家",
    goal="撰写高质量科技文章",
    backstory="专业科技作家，文笔优美",
    tools=[],
)

# 创建任务
research_task = Task(
    description="搜索并整理最新 AI 新闻",
    expected_output="AI 新闻列表",
    agent=researcher,
)

write_task = Task(
    description="基于新闻撰写文章",
    expected_output="科技文章",
    agent=writer,
    context=[research_task],
)

# 创建 Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    verbose=True,
)

# 执行
result = crew.kickoff()
print(result)
```

### 4.2 并行任务

```python
from crewai import Agent, Task, Crew, Process

# 创建多个研究 Agent
researcher1 = Agent(role="技术研究员", ...)
researcher2 = Agent(role="市场研究员", ...)
researcher3 = Agent(role="政策研究员", ...)

# 并行任务
tech_task = Task(description="研究技术趋势", agent=researcher1)
market_task = Task(description="研究市场规模", agent=researcher2)
policy_task = Task(description="研究监管政策", agent=researcher3)

# 分析任务 (等待所有研究完成)
analyze_task = Task(
    description="综合分析",
    agent=analyst,
    context=[tech_task, market_task, policy_task],  # 依赖所有研究
)

crew = Crew(
    agents=[researcher1, researcher2, researcher3, analyst],
    tasks=[tech_task, market_task, policy_task, analyze_task],
    process=Process.sequential,  # 任务间顺序，但同级别可并行
)
```

### 4.3 自定义工具

```python
from crewai import Agent
from crewai.tools import BaseTool
from pydantic import Field

class WikipediaSearchTool(BaseTool):
    name: str = "wikipedia_search"
    description: str = "搜索维基百科"

    def _run(self, query: str) -> str:
        # 实现搜索逻辑
        import wikipedia
        return wikipedia.summary(query, sentences=3)

# 使用自定义工具
agent = Agent(
    role="知识专家",
    goal="回答各类问题",
    tools=[WikipediaSearchTool()],
)
```

### 4.4 输出解析

```python
from crewai import Agent, Task, Crew
from pydantic import BaseModel
from typing import List

# 定义输出结构
class NewsItem(BaseModel):
    title: str
    source: str
    summary: str

class NewsReport(BaseModel):
    headline: str
    items: List[NewsItem]
    conclusion: str

# 创建 Agent 并指定输出格式
agent = Agent(
    role="新闻分析师",
    output_json_model=NewsReport,  # 指定输出结构
)

task = Task(
    description="分析今日 AI 新闻",
    expected_output="JSON 格式的新闻报告",
    output_pydantic=NewsReport,  # 指定输出格式
    agent=agent,
)
```

---

## 5. 高级特性

### 5.1 层级流程 (Manager)

```python
from crewai import Agent, Task, Crew, Process

# Manager Agent
manager = Agent(
    role="项目经理",
    goal="协调团队高效完成任务",
    backstory="经验丰富的项目经理，擅长资源调配",
)

# Worker Agents
researcher = Agent(role="研究员", goal="...", backstory="...")
writer = Agent(role="作家", goal="...", backstory="...")

# 任务
tasks = [
    Task(description="研究任务", agent=researcher),
    Task(description="写作任务", agent=writer),
]

# 层级流程 - Manager 自动分配和监督
crew = Crew(
    agents=[manager, researcher, writer],
    tasks=tasks,
    process=Process.hierarchical,  # 启用层级流程
    manager_agent=manager,
)
```

### 5.2 Crew 记忆

```python
from crewai import Crew

# Crew 级别的共享记忆
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    memory=True,  # 启用共享记忆
)

# 记忆会在任务间共享
# Agent 可以读取之前 Agent 的关键信息
```

### 5.3 Crew AI 学习

```python
from crewai import Agent, Task, Crew, Process

# 监控 Crew 执行
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    verbose=True,
    step_callback=lambda step: print(f"Step: {step}"),  # 每步回调
)

# 执行并学习
result = crew.kickoff()
```

---

## 6. 对比与选择

### 6.1 与其他框架对比

| 维度 | CrewAI | AutoGen | LangGraph |
|------|--------|---------|-----------|
| **角色设计** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **任务编排** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **流程控制** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **扩展性** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **生产就绪** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 适用场景

**✅ CrewAI 最佳场景:**
- 多角色协作任务 (如新闻生成、研究报告)
- 需要明确角色分工的工作
- 快速构建多 Agent 原型
- 简单到中等复杂的工作流

**❌ 不适合场景:**
- 需要复杂状态管理 (用 LangGraph)
- 需要细粒度控制 (用 AutoGen)
- 高度定制的工作流

### 6.3 选型建议

| 场景 | 推荐框架 |
|------|----------|
| 多角色内容生成 | CrewAI |
| 复杂代码协作 | AutoGen |
| 生产级工作流 | LangGraph |
| 快速原型 | CrewAI |
| 研究探索 | AutoGen |

---

## 参考资源

- [CrewAI GitHub](https://github.com/crewAI/crewAI)
- [CrewAI 文档](https://docs.crewai.com/)
- [CrewAI 教程](https://github.com/crewAI/crewAI-examples)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[13_Agent_Production/16_Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[13_Agent_Production/16_Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[13_Agent_Production/16_Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[13_Agent_Production/16_Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[13_Agent_Production/16_Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
