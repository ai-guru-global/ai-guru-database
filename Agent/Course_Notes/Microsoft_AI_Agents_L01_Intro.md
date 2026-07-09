---
title: "L01 AI 代理简介与使用场景"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - agent-types
  - tool-use
  - agent-framework
sources:
  - "_raw/github-sources/ai-agents-for-beginners/01-intro-to-ai-agents/README.md"
summary: "Microsoft AI Agents 课程第1课：AI Agent 的定义、七种类型、何时使用，以及 Azure AI Agent Service 构建 Agentic 方案的基础。"
provenance:
  extracted: 0.85
  inferred: 0.12
  ambiguous: 0.03
base_confidence: 0.82
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Microsoft Ai Agents L01 Intro"
  - "Microsoft AI Agents L01 Intro"
  - Microsoft_AI_Agents_L01_Intro

---
# L01 AI 代理简介与使用场景

> 来源：[Microsoft AI Agents for Beginners / 01-intro-to-ai-agents](https://github.com/microsoft/ai-agents-for-beginners/tree/main/01-intro-to-ai-agents)

## 学习目标

完成本课后，你将能够：

- 解释什么是 AI Agent，以及它与传统 AI 解决方案的区别
- 知道何时应该使用 AI Agent（以及何时不应该）
- 为真实问题勾画一个基本的 Agentic 解决方案设计

---

## 什么是 AI Agent

AI Agent 是**让大语言模型（LLM）能够实际“做事情”的系统**——通过赋予它工具、知识和记忆，使其不仅能响应提示，还能对环境采取行动。

一个 Agent 通常包含三个核心部分：

| 组件 | 作用 | 示例（旅行代理） |
|------|------|------------------|
| **环境（Environment）** | Agent 运行的空间 | 旅行预订平台 |
| **传感器（Sensors）** | 读取环境状态 | 查询酒店可用性、航班价格 |
| **执行器（Actuators）** | 对环境采取行动 | 预订房间、发送确认邮件、取消预订 |

此外，现代 Agent 还依赖：

- **LLM 作为大脑**：理解自然语言、推理上下文、将模糊请求转化为具体行动计划
- **工具（Tools）**：可执行函数或 API，由 LLM 按需调用
- **记忆（Memory）**：短期记忆（当前对话）与长期记忆（用户偏好、历史交互）

---

## AI Agent 的七种类型

课程以旅行预订为例，列出七种经典 Agent 类型：

| Agent 类型 | 核心特征 | 旅行示例 |
|------------|----------|----------|
| **简单反射型（Simple Reflex）** | 硬编码规则，无记忆无规划 | 收到投诉邮件 → 转人工客服 |
| **基于模型的反射型（Model-Based Reflex）** | 维护并更新内部世界模型 | 跟踪历史票价，标记突然涨价的航线 |
| **目标导向型（Goal-Based）** | 有明确目标，按步骤达成 | 从当前位置规划完整行程（机票+酒店+租车） |
| **效用导向型（Utility-Based）** | 权衡多目标，选择最优解 | 在成本与便利性之间找到最佳平衡 |
| **学习型（Learning）** | 根据反馈持续改进 | 根据旅行后调查调整推荐策略 |
| **层级型（Hierarchical）** | 高层 Agent 拆解任务并委派 | “取消行程”拆为取消航班、酒店、租车 |
| **多代理系统（MAS）** | 多个独立 Agent 协作或竞争 | 酒店/航班/娱乐分别由不同 Agent 处理 |

---

## 何时使用 AI Agent

Agent 并非万能。课程指出三种最适合使用 Agent 的场景：

1. **开放式问题**：解决步骤无法预先编程，需要 LLM 动态规划路径
2. **多步骤流程**：需要跨多个轮次使用工具，而非单次查询或生成
3. **持续改进**：希望系统根据用户反馈或环境信号变得越来越智能

相对地，如果任务步骤固定、输入输出确定、无需工具交互，则传统脚本或单次 LLM 调用可能更可靠。

---

## Agentic 方案的基础

课程使用 **Azure AI Agent Service** 作为主要平台，其特点包括：

- 支持 OpenAI、Mistral、Meta（Llama）等模型
- 可接入 Tripadvisor 等授权数据
- 支持标准 OpenAPI 3.0 工具定义

同时，课程引入了 **Agentic Patterns** 的概念：当 Agent 需要在多步骤中自动采取行动时，不能靠人工编写每一条提示，而需要可复用的提示与编排策略。后续课程将围绕这些模式展开。

---

## 代码示例

- Python：[01-python-agent-framework.ipynb](https://github.com/microsoft/ai-agents-for-beginners/blob/main/01-intro-to-ai-agents/code_samples/01-python-agent-framework.ipynb)
- .NET：[01-dotnet-agent-framework.md](https://github.com/microsoft/ai-agents-for-beginners/blob/main/01-intro-to-ai-agents/code_samples/01-dotnet-agent-framework.md)

---

## 关联阅读

- [[_concepts/ai-agents]] — AI 智能体核心概念
- [[15_Agent_Production/GenAI_L17_AI_Agents]] — Microsoft GenAI 课程中的 AI 代理
- [[15_Agent_Production/Agent_Frameworks/README]] — 主流 Agent 框架概览
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents_L04_Tool_Use]] — 工具使用设计模式
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents_L02_Frameworks]] — MAF 与 Azure AI Agent Service 框架选型
