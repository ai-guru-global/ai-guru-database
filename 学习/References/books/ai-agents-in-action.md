---
title: "AI Agents in Action"
category: "-references-books"
tags:
  - book
  - learning-resource
  - ai-agents
  - llm
  - micheal-lanham
  - manning
  - langchain
  - autogen
  - crewai
  - tool-use
  - planning
  - multi-agent
summary: "Manning 出品的 AI Agent 实战指南（第2版），从 Agent 基本概念讲到工具调用、记忆、规划与多 Agent 协作，系统覆盖 LangChain / AutoGen / CrewAI 三大框架的工程实践。"
sources:
  - "https://www.manning.com/books/ai-agents-in-action-second-edition"
created: 2026-06-12
updated: 2026-07-23
lifecycle: reviewed
tier: supporting
aliases:
  - "Ai Agents In Action"
  - "ai agents in action"

---
# AI Agents in Action

> **一句话理解**: Manning 出品的 AI Agent 实战指南（第2版），从 Agent 基本概念讲到工具调用、记忆、规划与多 Agent 协作，配套 LangChain / AutoGen / CrewAI 三大主流框架的完整代码示例，是 2024-2026 年 Agent 工程入门到进阶的首选实战书。

## 书籍概述

### 作者背景

**Micheal Lanham** 是一位资深软件工程师与技术作家，长期活跃在 Manning、Packt 等技术出版社区。他的写作风格以"动手实战、代码先行"著称，此前已撰写多本 AI/游戏开发相关书籍（包括《Hands-On Natural Language Processing with Python》等）。Lanham 的特点是不堆砌理论，而是用一个接一个可运行的小项目带读者建立直觉，这种风格非常适合快速变化的 Agent 领域——读者可以边读边把代码跑起来。

### 出版信息

| 属性 | 说明 |
|------|------|
| **书名** | AI Agents in Action（第2版） |
| **作者** | Micheal Lanham |
| **出版社** | Manning（2024，第2版） |
| **页数** | 约 350 页 |
| **难度** | ⭐⭐☆（入门→中级） |
| **代码语言** | Python（LangChain / AutoGen / CrewAI） |
| **链接** | [Manning](https://www.manning.com/books/ai-agents-in-action-second-edition) |

### 本书定位

本书是 **AI Agent 工程实战**领域的入门级代表作：

- **不是**讲 Agent 底层算法理论的书（那是研究论文的领域）
- **而是**讲"如何用现有框架快速搭建可用 Agent"的工程指南
- 它定义了 Agent 工程的**最小知识集**：大脑（LLM）、感知（输入）、行动（工具）、记忆、规划

在知识库的书籍谱系中，本书处于 Agent 方向的入门位置：
- 上承 [[prompt-engineering-for-llms]]（提示工程是 Agent 交互的基础）
- 平行 [[build-multi-agent-system]]（多 Agent 系统设计，更偏架构）
- 是 [[ai-engineering-huyen]] 第 8 章 Agent 内容的**配套实战**

## 核心内容

全书围绕"从单 Agent 到多 Agent 协作"的递进展开。

### Ch 1-2: Agent 基础与 LLM 大脑

- **Agent 定义**: 能自主感知环境、做出决策、执行行动的 AI 系统，区别于被动应答的聊天机器人
- **Agent 的四大支柱**:
  - 大脑（LLM）— 推理与决策核心
  - 感知（Perception）— 接收用户输入与环境状态
  - 行动（Action）— 通过工具调用影响外部世界
  - 记忆（Memory）— 跨步骤、跨会话的状态保持
- **Agent vs Chatbot 的本质区别**: ChatBot 是"一问一答"，Agent 是"目标驱动、多步骤、可纠错"的闭环

### Ch 3: 工具调用（Tool Use / Function Calling）

- **Function Calling 机制**: LLM 按规范格式输出工具调用请求，系统执行后返回结果
- **工具定义模式**: JSON Schema 描述工具的名称、参数、返回值
- **实战模式**:
  - 搜索工具（Web Search、Wikipedia）
  - 计算工具（Python REPL、计算器）
  - 数据工具（SQL 查询、文件读写）
  - API 工具（天气、地图、第三方服务）
- **工具选择策略**: 让 LLM 自己判断何时调用哪个工具，而非硬编码

### Ch 4: 记忆系统（Memory）

- **短期记忆（Working Memory）**: 当前对话上下文，受 Token 窗口限制
- **长期记忆（Long-term Memory）**:
  - 向量存储 + 语义检索（基于 Embedding 的召回）
  - 摘要压缩（对历史对话做总结以节省 Token）
- **记忆管理策略**: 写入、检索、遗忘、更新的生命周期
- **与 RAG 的关系**: Agent 长期记忆本质上是"个性化 RAG"（详见 [[RAG系统/RAG_Systems]]）

### Ch 5: ReAct 与规划模式（Planning）

- **ReAct（Reasoning + Acting）**: 思考 → 行动 → 观察 → 再思考 的循环
- **Plan-and-Execute**: 先制定完整计划，再逐步执行
- **Reflexion**: 执行失败后反思并修正策略
- **Tree of Thoughts (ToT)**: 树形探索多个推理路径，回溯选择最优
- **何时用哪种模式**: 简单任务用 ReAct，复杂长程任务用 Plan-and-Execute

### Ch 6: 单 Agent 应用实战

- **自动化助手**: 邮件分类、日程管理、信息整理
- **代码 Agent**: 代码生成、调试、重构（类 Cursor / Devin 的雏形）
- **研究 Agent**: 自动调研、总结报告、生成摘要
- **数据 Agent**: 自然语言查询数据库、生成图表

### Ch 7: 多 Agent 协作（Multi-Agent）

- **为什么需要多 Agent**: 单 Agent 上下文易爆炸、专业分工更高效、可并行
- **协作模式**:
  - **层级式（Hierarchical）**: 一个 Manager Agent 调度多个 Worker Agent
  - **对等式（Peer-to-Peer）**: Agent 间平等对话协商
  - **流水线式（Pipeline）**: Agent A → Agent B → Agent C 串行处理
- **框架对比**:

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| **CrewAI** | 角色化（Role-based），API 简洁 | 快速搭建角色分工团队 |
| **AutoGen** | 对话驱动（Conversable），微软出品 | 复杂多轮对话协作 |
| **LangGraph** | 图结构（DAG/状态机），状态管理强 | 需要精细流程控制 |

### Ch 8: Agent 评估与护栏（Guardrails）

- **Agent 可靠性挑战**: 错误累积、不可预测性、工具调用失败、无限循环
- **护栏（Guardrails）**:
  - 输入护栏：过滤恶意/越狱输入
  - 输出护栏：审查 Agent 输出合规性
  - 工具护栏：限制工具调用权限与频率
- **评估维度**: 任务完成率、步骤效率、成本、安全性
- **断点与人工介入**: Human-in-the-loop 机制

### Ch 9: 生产化部署

- **监控**: 追踪每步推理、工具调用、Token 消耗
- **成本控制**: 模型路由（简单任务用小模型）、缓存
- **可观测性**: Traces（LangSmith / Langfuse）、Metrics、Logs
- **容错**: 重试、降级、超时、熔断

## 关键概念与模式

### ReAct 循环

```
Thought: 我需要先查航班信息
Action: search_flights(from=北京, to=上海, date=2026-08-01)
Observation: 找到 5 个航班，最便宜的是 CA1501，800元
Thought: 用户没说预算，我应该列出选项让他选
Action: reply(列出 5 个航班供用户选择)
```

**核心**: 让 LLM 显式输出"思考过程"，提升可调试性与准确性。

### Agent 记忆架构

```
用户输入 → 工作记忆（当前上下文）
              ↓
          检索长期记忆（向量库）→ 拼接相关历史
              ↓
          LLM 推理决策 → 调用工具 / 回复
              ↓
          重要信息 → 写入长期记忆（Embedding + 存储）
```

### 多 Agent 通信协议（2026 视角）

书中虽以框架原生协议为主，但 2026 年的趋势是标准化：
- **MCP (Model Context Protocol)**: Anthropic 提出的工具/资源标准化协议
- **A2A (Agent-to-Agent)**: Agent 间互操作协议
- **UCP (Universal Computer Protocol)**: Agent 操控计算机的统一协议

## 知识映射（本书概念在本知识库的位置）

| 本书章节 | 本书概念 | 知识库主题 | 关联说明 |
|----------|----------|------------|----------|
| Ch 1-2 Agent 基础 | Agent 定义/四大支柱 | [[智能体/Agent_Foundations/AI_Agents_for_dummy]] | Agent 基础概念 |
| Ch 3 工具调用 | Function Calling | [[智能体/Agent_Foundations/Agent-in-nutshell]] | 工具调用机制 |
| Ch 4 记忆 | 短期/长期记忆 | [[RAG系统/RAG_Systems]] | 记忆即个性化 RAG |
| Ch 5 ReAct | 规划模式 | [[大模型/Prompt_Engineering/Prompt_Engineering]] | ReAct 提示模式 |
| Ch 7 多 Agent | CrewAI/AutoGen | [[build-multi-agent-system]] | 多 Agent 架构 |
| Ch 8 护栏 | Guardrails | [[伦理安全/AI_Safety_RedTeaming]] | 安全与护栏 |
| Ch 9 部署 | 可观测性 | [[部署推理/]] | 生产化部署 |

## 适合人群

| 角色 | 阅读重点 | 收益 |
|------|----------|------|
| **应用开发者** | 全书 | 从零搭建可用 Agent |
| **产品工程师** | Ch 1-2, 6 | 理解 Agent 能做什么 |
| **后端工程师** | Ch 3-5, 9 | 工具集成与生产化 |
| **AI 工程师（入门）** | 全书 + 框架实战 | Agent 工程入门 |
| **技术决策者** | Ch 1, 7, 8 | 评估 Agent 可行性 |

### 前置知识

- **必备**: Python 编程、了解 LLM API（OpenAI / Anthropic）
- **强烈建议**: 读过 [[prompt-engineering-for-llms]] 或有提示工程经验
- **加分**: 了解 LangChain 基础

## 对比同类书

| 维度 | 本书（AI Agents in Action） | [[build-multi-agent-system]] | [[ai-engineering-huyen]] Ch 8 |
|------|----------------------------|------------------------------|-------------------------------|
| **定位** | Agent 工程入门实战 | 多 Agent 系统设计 | AI 工程全景（含 Agent 一章） |
| **深度** | 入门→中级 | 中级→高级 | 概览，不深入 |
| **框架** | LangChain/AutoGen/CrewAI | 偏架构与协议 | 框架无关 |
| **代码量** | 多（每章配套） | 中 | 少 |
| **适合** | 想快速上手 Agent | 想设计多 Agent 系统 | 想理解 Agent 在 AI 工程中的位置 |

## 推荐阅读路径

### 路径 A: 实战驱动（2-3 周，推荐）

1. **Day 1-3**: Ch 1-2（建立 Agent 认知）
2. **Day 4-7**: Ch 3-4（工具调用 + 记忆，跑通第一个 Agent）
3. **Week 2**: Ch 5-6（规划模式 + 单 Agent 应用）
4. **Week 3**: Ch 7-9（多 Agent + 评估 + 部署）

### 路径 B: 按框架深入

- **LangChain 派**: 重点读 Ch 3, 5 + 配合 LangGraph 文档
- **AutoGen 派**: 重点读 Ch 7 + 微软 AutoGen 官方示例
- **CrewAI 派**: 重点读 Ch 7 + CrewAI 官方教程

### 路径 C: 配合知识库

1. 先读 [[智能体/Agent_Foundations/AI_Agents_for_dummy]] 建立概念
2. 本书 Ch 1-5 做代码实战
3. 读 [[build-multi-agent-system]] 进阶架构
4. 回到 [[ai-engineering-huyen]] Ch 8 理解 Agent 在系统中的位置

## 亮点与局限

### 亮点

- **框架覆盖广**: 同时覆盖三大主流框架，便于横向比较选型
- **从入门到多 Agent 完整路径**: 递进式结构，适合零基础
- **第2版更新及时**: 纳入了 2024 年 Agent 工程最新实践
- **代码可运行**: 每章配套 GitHub 代码，可复现

### 局限

- **框架迭代快**: LangChain/AutoGen API 变动频繁，部分代码可能过时
- **偏应用层**: 不深入 Agent 底层算法（如 RL-based planning）
- **未覆盖 2026 协议**: MCP/A2A 等新协议出版时未成熟，书中未涉及
- **评估部分较浅**: Agent 评估仍是开放难题，本书未深入

## 延伸阅读

- [[学习/References/books/prompt-engineering-for-llms|Prompt Engineering for LLMs]] — Agent 交互基础（提示工程）
- [[学习/References/books/build-multi-agent-system|Building Multi-Agent Systems]] — 多 Agent 架构进阶
- [[学习/References/books/ai-engineering-huyen|AI Engineering]] — Agent 在 AI 工程全景中的位置
- [[智能体/Agent_Foundations/AI_Agents_for_dummy]] — 知识库 Agent 基础
- [[大模型/Prompt_Engineering/Prompt_Engineering]] — ReAct / Plan-and-Execute 提示模式
- [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图 2026]] — Agent 在整体路线中的位置

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[智能体/]] | [[工具/]] | [[RAG系统/]] | [[部署推理/]]
