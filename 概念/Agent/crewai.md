---
title: "CrewAI"
category: concepts
tags: [agent-framework, multi-agent, crewai, role-playing, task-orchestration]
summary: "CrewAI 是一个基于角色扮演的多 Agent 协作框架，通过 Crew、Agent、Task 三个核心抽象让多个 LLM 角色按 SOP 分工完成复杂任务。"
created: 2026-07-02
updated: 2026-07-21
sources:
  - "https://docs.crewai.com/"
  - "https://github.com/crewAIInc/crewAI"
---

# CrewAI

**CrewAI** 是一个开源的**多 Agent 协作框架**，它把现实工作中的"团队"概念映射到 LLM Agent 编排中：每个 Agent 被赋予明确的角色（role）、目标（goal）和背景故事（backstory），多个 Agent 组成一个 Crew，按照预定义的 Task 流程协作完成复杂任务。它的核心理念是**角色扮演 + 流程驱动**，特别适合需要模拟真实团队分工的业务场景。

## 核心组成

CrewAI 的 API 围绕三个核心抽象展开：

| 抽象 | 职责 | 类比 |
|------|------|------|
| **Agent** | 拥有角色、目标、记忆和可用工具的 LLM 智能体 | 团队中的成员 |
| **Task** | 描述具体任务、期望输出和执行 Agent | 分配到成员的工作项 |
| **Crew** | 把多个 Agent 和 Task 组合起来，定义执行策略和流程 | 整个项目团队 |
| **Flow** | 事件驱动的工作流编排（2025+ 新增） | 跨 Crew 的流水线 |

### 代码示例：构建一个研究团队

```python
from crewai import Agent, Task, Crew, Process

# 定义 Agent
researcher = Agent(
    role="高级研究员",
    goal="发现 {topic} 领域的最新突破",
    backstory="你是一位资深技术研究员，擅长从海量信息中提炼关键洞察。",
    tools=[search_tool, web_scraper],
    verbose=True,
    memory=True
)

writer = Agent(
    role="技术作家",
    goal="将研究成果转化为清晰的技术文章",
    backstory="你是一位专业技术作家，擅长将复杂概念用通俗语言表达。",
    tools=[editor_tool]
)

# 定义 Task
research_task = Task(
    description="深入研究 {topic}，找出 5 个最重要的趋势",
    expected_output="结构化的研究报告，包含数据支撑",
    agent=researcher
)

write_task = Task(
    description="基于研究报告撰写 2000 字技术文章",
    expected_output="Markdown 格式的技术文章",
    agent=writer,
    context=[research_task]  # 依赖前置任务输出
)

# 组建 Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
    memory=True,
    verbose=True
)

result = crew.kickoff(inputs={"topic": "AI Agent 2026"})
```

## 执行模式

CrewAI 支持多种任务执行策略：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **Sequential** | Task 按定义顺序依次执行，前一个输出作为后一个上下文 | 流水线式工作 |
| **Hierarchical** | Manager Agent 动态分配和协调子任务 | 复杂项目调度 |
| **Parallel** | 多个独立任务同时执行 | 无依赖的研究/数据处理 |
| **Consensual** | Agent 协商达成共识后执行 | 需要多视角决策 |

### Hierarchical 模式示例

```python
manager = Agent(
    role="项目经理",
    goal="协调团队高效完成项目",
    backstory="你是经验丰富的技术项目经理",
    allow_delegation=True
)

crew = Crew(
    agents=[researcher, writer, reviewer],
    tasks=[...],
    process=Process.hierarchical,
    manager_agent=manager
)
```

## 记忆系统

CrewAI 内置四层记忆：

| 记忆类型 | 作用 | 持久化 |
|----------|------|--------|
| **Short-term** | 当前执行中的工作记忆 | 仅当前运行 |
| **Long-term** | 跨执行的经验积累 | RAG 存储 |
| **Entity** | 对人物/组织/概念的记忆 | 结构化存储 |
| **User** | 用户偏好和交互历史 | 持久化 |

```python
crew = Crew(
    agents=[...],
    tasks=[...],
    memory=True,           # 启用记忆
    embedder={             # 配置向量化
        "provider": "openai",
        "config": {"model": "text-embedding-3-small"}
    }
)
```

## 工具生态

CrewAI 支持丰富的工具集成：

- **内置工具**：搜索、文件读写、代码执行、网页抓取
- **LangChain 兼容**：可直接使用 LangChain Tools
- **MCP 集成**：2026 年支持通过 MCP 连接外部服务
- **自定义工具**：用 `@tool` 装饰器快速定义

```python
from crewai.tools import tool

@tool("查询数据库")
def query_database(sql: str) -> str:
    """执行 SQL 查询并返回结果"""
    return db.execute(sql).fetchall()
```

## 典型用例

- **内容生产流水线**：研究员收集资料 → 分析师提炼观点 → 写作者生成文章 → 审稿人检查质量
- **市场调研报告**：多个 Agent 分别负责竞品搜索、数据整理、趋势分析和 PPT 大纲生成
- **代码审查辅助**：Coder 编写代码，Reviewer 检查规范，Test Agent 生成测试用例
- **客户服务模拟**：客服、技术支持、销售等角色协作处理复杂客户请求
- **招聘流水线**：简历筛选 → 技术评估 → 面试安排 → Offer 生成

## 与相关框架的区别与联系

| 框架 | 核心风格 | 与 CrewAI 的关系 |
|------|----------|------------------|
| **AutoGen** | 对话式多 Agent | AutoGen 强调自由对话，CrewAI 强调角色和流程 |
| **LangGraph** | 图编排状态机 | 适合复杂分支和循环，CrewAI 更贴近"团队 SOP"语义 |
| **OpenAI Agents SDK** | 轻量 handoff | 更简洁，CrewAI 更丰富的角色和流程抽象 |
| **SmolAgents** | 轻量 CodeAgent | 更极简，CrewAI 更偏向企业流程编排 |

**CrewAI 的优势**：语义直观，业务人员可以把现实岗位职责直接翻译成 Agent 定义。

**局限**：对复杂状态流转和循环依赖的支持不如 LangGraph，对需要高度自由对话的研究型任务不如 AutoGen 灵活。

## 最佳实践

1. **角色明确**：每个 Agent 的 role/goal/backstory 要具体，避免泛泛而谈
2. **任务原子化**：每个 Task 有明确的 expected_output
3. **工具最小权限**：每个 Agent 只配备必要工具
4. **上下文传递**：用 `context=[prev_task]` 显式声明依赖
5. **迭代调优**：先单 Agent 调试，再组合成 Crew

## Related

- [[概念/Agent/autogen|AutoGen]] — 对话式多 Agent 框架
- [[概念/Agent/multi-agent-orchestration|多 Agent 编排]] — 协作模式总览
- [[概念/Agent/agent-framework|Agent 框架]] — 框架选型背景
- [[概念/Agent/langgraph|LangGraph]] — 图编排框架
- [[概念/Agent/langchain|LangChain]] — 底层生态
- [[智能体/Agent_Frameworks/CrewAI_Deep_Dive|CrewAI 深度解析]] — 详细教程
- [[智能体/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive|框架对比]] — 横向对比
