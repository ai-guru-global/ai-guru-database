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
summary: "AI Agent 实战指南（第2版），从基础 Agent 概念到工具调用、记忆系统、多 Agent 协作，用 LangChain/AutoGen 等框架构建智能体。"
sources:
  - "https://www.manning.com/books/ai-agents-in-action-second-edition"
created: 2026-06-12
updated: 2026-07-11
lifecycle: reviewed
tier: supporting
aliases:
  - "Ai Agents In Action"
  - "ai agents in action"

---
# AI Agents in Action

> **一句话理解**: Manning 出品的 AI Agent 实战指南（第2版），从 Agent 基本概念讲到工具调用、记忆、规划与多 Agent 协作，配套 LangChain / AutoGen 代码示例。

## 书籍信息

| 属性 | 说明 |
|------|------|
| **书名** | AI Agents in Action（第2版） |
| **作者** | Micheal Lanham |
| **出版社** | Manning（2024，第2版） |
| **页数** | 约 350 页 |
| **难度** | ⭐⭐☆（入门→中级） |
| **代码语言** | Python（LangChain / AutoGen / CrewAI） |
| **链接** | [Manning](https://www.manning.com/books/ai-agents-in-action-second-edition) |

## 核心内容概要

1. **Agent 基础** — 什么是 AI Agent、Agent vs 聊天机器人
2. **LLM 作为 Agent 大脑** — 规划、推理、决策
3. **工具调用** — Function Calling、API 集成
4. **记忆系统** — 短期/长期记忆、向量存储
5. **ReAct 与规划模式** — 思考-行动循环
6. **单 Agent 应用** — 自动化助手、代码 Agent
7. **多 Agent 协作** — CrewAI、AutoGen 多智能体编排
8. **Agent 评估与护栏** — 可靠性、安全边界
9. **生产化部署** — 监控、成本、可观测性

## 适合人群

- **级别**: 初级 → 中级
- **前置知识**: Python、了解 LLM API
- **适合**: 想快速构建 AI Agent 的开发者、产品工程师

## 知识库章节映射

| 本书章节 | 推荐参考 |
|----------|----------|
| Ch 1-2 Agent 基础 | [[智能体/]] |
| Ch 3 工具调用 | [[智能体/]] 、 [[工具/]] |
| Ch 4 记忆 | [[智能体/]] |
| Ch 5 ReAct | [[大模型/Prompt_Engineering/Prompt_Engineering]] |
| Ch 7 多 Agent | [[智能体/]] |
| Ch 9 部署 | [[部署推理/]] |

## 学习建议

- **阅读顺序**: 前四章打基础，第 5-7 章为核心实战
- **实战搭配**: 搭配 LangChain / CrewAI 官方教程
- **进阶**: 读完后挑战 [[build-multi-agent-system]]

## 亮点与局限

- ✅ **亮点**: 框架覆盖广（LangChain/AutoGen/CrewAI）、从入门到多 Agent 完整路径、第2版更新了 2024 最新实践
- ⚠️ **局限**: 框架迭代快（部分 API 可能过时）；偏应用层，不深入底层实现

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[智能体/]] | [[工具/]]
