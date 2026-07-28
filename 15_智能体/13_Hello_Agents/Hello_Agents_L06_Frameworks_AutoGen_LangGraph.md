---
title: "Hello-Agents L06：框架开发实践（AutoGen / AgentScope / CAMEL / LangGraph）"
category: "15-agent-production"
tags:
  - ai-agents
  - autogen
  - agentscope
  - camel
  - langgraph
  - multi-agent
  - hello-agents
sources:
  - "原始/github-sources/hello-agents/docs/chapter6/第六章 框架开发实践.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第六章笔记：对比并使用 AutoGen、AgentScope、CAMEL、LangGraph 四个主流 Agent 框架，通过实战案例理解多智能体协作与复杂工作流控制。"
provenance:
  extracted: 0.72
  inferred: 0.23
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Hello Agents L06 Frameworks Autogen Langgraph"
  - "Hello Agents L06 Frameworks AutoGen LangGraph"
  - Hello_Agents_L06_Frameworks_AutoGen_LangGraph

name_zh: "Hello-Agents L06：框架开发实践"
---
# Hello-Agents L06：框架开发实践

> 中文简称：Hello-Agents L06：框架开发实践

> **一句话理解**: 本章从手写脚本过渡到成熟框架，通过 **AutoGen、AgentScope、CAMEL、LangGraph** 四个代表性框架的实战案例，理解框架如何抽象 Agent Loop、状态管理、工具调用与多 Agent 协作。

---

## 1. 为什么需要 Agent 框架

- **提升复用与效率**: 封装 Agent Loop、状态管理、工具调用、日志记录等通用逻辑 ^[extracted]
- **解耦与可扩展**: 模型层、工具层、记忆层分离，便于替换与升级 ^[extracted]
- **标准化状态管理**: 处理上下文窗口限制、历史持久化、多轮状态跟踪 ^[inferred]
- **可观测性**: 通过回调（Callbacks）在 `on_llm_start`、`on_tool_end`、`on_agent_finish` 等节点记录轨迹 ^[extracted]

---

## 2. 四大框架对比

| 框架 | 核心设计理念 | 典型场景 |
|------|-------------|----------|
| **AutoGen** | 对话驱动协作（Conversation-driven Collaboration） | 多角色群聊、软件开发团队模拟 |
| **AgentScope** | 易用性与工程化 | 大规模、分布式多 Agent 系统 |
| **CAMEL** | 角色扮演（Role-Playing）+ Inception Prompting | 两个 Agent 自主对话完成共同任务 |
| **LangGraph** | 图（Graph）执行流程 | 需要循环、分支、反思的复杂工作流 |

表格内容基于教材表 6.1 总结 ^[extracted]。

---

## 3. AutoGen（v0.7.4）

### 3.1 新架构特点

- **分层设计**: `autogen-core`（底层交互与消息传递）+ `autogen-agentchat`（高级对话接口）
- **异步优先**: 全面转向 `async/await`，提升并发与资源利用率 ^[extracted]

### 3.2 核心组件

- **AssistantAgent**: 任务主要解决者，封装 LLM，负责生成计划/代码/文案
- **UserProxyAgent**: 人类代言人 + 可靠执行器，可执行代码或调用工具 ^[extracted]

### 3.3 团队协作机制

- **RoundRobinGroupChat**: 按预定义顺序依次发言，适合流程固定的任务
- 软件开发团队案例：ProductManager → Engineer → CodeReviewer → UserProxy ^[extracted]

---

## 4. AgentScope

- 专为多 Agent 应用设计的开发平台
- 强调**易用性**与**工程化**
- 内置消息传递机制与分布式部署支持 ^[extracted]
- 适合构建和运维复杂、大规模多 Agent 系统 ^[inferred]

---

## 5. CAMEL

- 基于**角色扮演（Role-Playing）**的协作方法
- 通过 **Inception Prompting** 为两个 Agent 设定角色与共同目标
- Agent 自主多轮对话、相互启发、共同完成任务 ^[extracted]
- 降低设计多 Agent 对话流程的复杂度 ^[inferred]

---

## 6. LangGraph

- LangChain 生态扩展，将执行流程建模为**图（Graph）**
- **节点（Node）**: 每个操作（LLM 调用、工具执行等）
- **边（Edge）**: 定义节点间跳转逻辑
- 天然支持**循环（Cycles）**，适合实现 Reflection、迭代修正等复杂工作流 ^[extracted]

---

## 7. 框架选型建议

| 需求 | 推荐框架 |
|------|----------|
| 多角色对话协作 | AutoGen |
| 大规模分布式部署 | AgentScope |
| 双 Agent 自主角色扮演 | CAMEL |
| 复杂循环/分支/反思工作流 | LangGraph |

选型建议为基于教材的合理推断 ^[inferred]。

---

## 8. 关联阅读

- [[15_智能体/02_Agent_Frameworks/AutoGen_Deep_Dive]] — AutoGen 深度解析
- [[15_智能体/02_Agent_Frameworks/AgentScope_Deep_Dive]] — AgentScope 深度解析
- [[15_智能体/02_Agent_Frameworks/AutoGen_CrewAI_LangGraph_Dive]] — AutoGen / CrewAI / LangGraph 对比
- [[15_智能体/03_Agent_Workflow/Workflow-in-nutshell]] — Agent 工作流总览
- [[05_大模型/08_Prompt_Engineering/Hello_Agents_L04_ReAct]] — 经典范式实现

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
