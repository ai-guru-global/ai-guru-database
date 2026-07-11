---
title: "CrewAI"
category: concepts
tags: [agent-framework, multi-agent, crewai, role-playing, task-orchestration]
summary: "CrewAI 是一个基于角色扮演的多 Agent 协作框架，通过 Crew、Agent、Task 三个核心抽象让多个 LLM 角色按 SOP 分工完成复杂任务。"
created: 2026-07-02
updated: 2026-07-02
sources: []
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

一个典型的 Crew 构建过程如下：

1. 定义若干 `Agent`，分别扮演研究员、分析师、写作者、审稿人等角色；
2. 定义一系列 `Task`，说明每个任务的内容、负责人和输出要求；
3. 把它们交给 `Crew`，由 Crew 决定执行顺序、委托关系和任务路由。

## 执行模式

CrewAI 支持多种任务执行策略，以适应不同的协作场景：

- **顺序执行（Sequential）**：Task 按定义顺序依次执行，前一个任务的输出作为后一个任务的上下文。适合流水线式工作。
- **层级执行（Hierarchical）**：指定一个 Manager Agent 负责分配和协调子任务，其他 Agent 作为执行者。适合需要动态调度的复杂项目。
- **并行执行（Parallel）**：多个独立任务同时执行，提高吞吐。适合彼此无依赖的研究或数据处理任务。

## 典型用例

- **内容生产流水线**：研究员收集资料 → 分析师提炼观点 → 写作者生成文章 → 审稿人检查质量。
- **市场调研报告**：多个 Agent 分别负责竞品搜索、数据整理、趋势分析和 PPT 大纲生成。
- **代码审查辅助**：Coder Agent 编写代码，Reviewer Agent 检查规范与潜在 Bug，Test Agent 生成测试用例。
- **客户服务模拟**：客服、技术支持、销售代表等不同角色 Agent 协作处理复杂客户请求。

## 与相关框架的区别与联系

| 框架 | 核心风格 | 与 CrewAI 的关系 |
|------|----------|------------------|
| **AutoGen** | 对话式多 Agent | 都支持多 Agent，但 AutoGen 强调自由对话，CrewAI 强调角色和流程 |
| **LangChain** | LLM 应用通用框架 | CrewAI 早期基于 LangChain 构建，LangChain 提供更底层的 Chain/Tool 抽象 |
| **LangGraph** | 图编排状态机 | 适合复杂分支和循环，CrewAI 更贴近"团队 SOP"语义 |
| **SmolAgents** | 轻量 CodeAgent | 更极简、以代码为工具调用媒介，CrewAI 更偏向企业流程编排 |

CrewAI 的优势在于**语义直观**：业务人员可以把现实中的岗位职责直接翻译成 Agent 定义；它的局限在于对复杂状态流转和循环依赖的支持不如 LangGraph，对需要高度自由对话的研究型任务不如 AutoGen 灵活。

## Related

- [[概念/autogen]] — AutoGen
- [[概念/multi-agent]] — Multi-Agent System
- [[概念/agent-framework]] — Agent 框架总览
- [[概念/crewai-tools]] — CrewAI Tools
- [[概念/langchain]] — LangChain
- [[概念/smolagents]] — SmolAgents
- [[智能体/Agent_Frameworks/CrewAI_Deep_Dive]] — CrewAI 深度解析
- [[智能体/Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive]] — AutoGen / CrewAI / LangGraph 对比
