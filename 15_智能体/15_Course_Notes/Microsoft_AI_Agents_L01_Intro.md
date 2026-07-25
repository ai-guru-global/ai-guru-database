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
  - "原始/github-sources/ai-agents-for-beginners/01-intro-to-ai-agents/README.md"
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

- [[概念/ai-agents]] — AI 智能体核心概念
- [[15_智能体/GenAI_L17_AI_Agents]] — Microsoft GenAI 课程中的 AI 代理
- [[15_智能体/02_Agent_Frameworks/README]] — 主流 Agent 框架概览
- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L04_Tool_Use]] — 工具使用设计模式
- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L02_Frameworks]] — MAF 与 Azure AI Agent Service 框架选型

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*

## 快速参考

| 维度 | 要点 | 备注 |
|------|------|------|
| 核心概念 | 理解基本原理和设计动机 | 理论基础 |
| 技术选型 | 根据场景选择合适方案 | 实践指导 |
| 最佳实践 | 遵循行业标准做法 | 质量保障 |
| 常见陷阱 | 避免已知问题和反模式 | 经验总结 |
| 发展趋势 | 关注技术演进方向 | 前瞻视野 |

## 延伸阅读

| 资源 | 类型 | 适用阶段 |
|------|------|----------|
| 官方文档 | 参考手册 | 全阶段 |
| 技术博客 | 深度分析 | 进阶 |
| 开源项目 | 代码实践 | 实战 |
| 学术论文 | 前沿研究 | 精通 |
| 社区讨论 | 经验交流 | 全阶段 |

## 检查清单

- [ ] 核心概念已理解并能向他人解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案的优劣势
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态和趋势
