---
title: "Hello-Agents L10：智能体通信协议（MCP / A2A / ANP）"
category: "15-agent-production"
tags:
  - ai-agents
  - mcp
  - a2a
  - anp
  - agent-protocol
  - multi-agent
  - hello-agents
sources:
  - "原始/github-sources/hello-agents/docs/chapter10/第十章 智能体通信协议.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第十章笔记：在 HelloAgents 框架中引入 MCP（Agent-Tool）、A2A（Agent-Agent）、ANP（大规模网络发现）三种协议，理解智能体通信基础设施。"
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.84
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Hello Agents L10 Agent Protocols"
  - Hello_Agents_L10_Agent_Protocols

---
# Hello-Agents L10：智能体通信协议

> **一句话理解**: 本章为 HelloAgents 引入三种通信协议——**MCP**（Agent 与工具的标准化通信）、**A2A**（Agent 间点对点协作）、**ANP**（大规模智能体网络的服务发现），共同构成 Agent 通信基础设施。

---

## 1. 为什么需要通信协议

传统方式为每个外部服务手写 Tool 类，存在：

- 代码重复（HTTP、错误处理、认证）
- 难以维护（API 变更影响所有相关工具）
- 无法复用（不同开发者的工具互不兼容）
- 扩展性差 ^[extracted]

通信协议提供：

- **标准化接口**: 统一访问方式
- **互操作性**: 不同开发者的工具可无缝集成
- **动态发现**: 运行时发现新服务与能力
- **可扩展性**: 轻松添加新功能模块 ^[extracted]

---

## 2. 三种协议设计理念

### 2.1 MCP（Model Context Protocol）

- 由 Anthropic 团队提出 ^[extracted]
- 核心理念：**标准化 Agent 与外部工具/资源的通信方式**
- 设计哲学是“上下文共享”：不仅提供文件内容，还提供代码结构、依赖关系、提交历史等上下文
- 类比：Agent 与工具之间的桥梁 ^[extracted]

### 2.2 A2A（Agent-to-Agent Protocol）

- 由 Google 团队提出 ^[extracted]
- 核心理念：**实现 Agent 之间的点对点通信**
- 设计哲学是“对等通信”：每个 Agent 既是服务提供者也是消费者
- 类比：Agent 之间的对话 ^[extracted]

### 2.3 ANP（Agent Network Protocol）

- 开源社区维护的概念性协议框架 ^[extracted]
- 核心理念：**构建大规模智能体网络的基础设施**
- 设计哲学是“去中心化服务发现”：服务注册、发现与路由
- 类比：大规模网络中发现和连接 Agent ^[extracted]

---

## 3. 协议对比

| 协议 | 解决的问题 | 典型使用场景 |
|------|-----------|-------------|
| MCP | 如何访问工具 | 访问文件系统、数据库、GitHub、API |
| A2A | 如何与其他 Agent 对话 | 多 Agent 协作完成复杂任务 |
| ANP | 如何在大规模网络中发现 Agent | 成百上千 Agent 的生态系统 |

表格基于教材表 10.1 整理 ^[extracted/inferred]。

---

## 4. HelloAgents 通信协议架构

采用三层设计 ^[extracted]：

```
HelloAgents 通信协议架构
├── 协议实现层
│   ├── MCP（基于 FastMCP）
│   ├── A2A（基于 Google a2a-sdk）
│   └── ANP（自研轻量级实现）
├── 工具封装层
│   ├── MCPTool → BaseTool
│   ├── A2ATool → BaseTool
│   └── ANPTool → BaseTool
└── 智能体集成层
    └── ReActAgent / SimpleAgent 通过 Tool System 使用协议工具
```

---

## 5. 协议选择建议

| 需求 | 推荐协议 |
|------|----------|
| Agent 访问外部服务（文件、数据库、API） | MCP |
| 多个 Agent 相互协作完成任务 | A2A |
| 构建大规模 Agent 生态系统 | ANP |

教材建议：MCP 生态相对成熟，优先选择大公司背书的 MCP 工具 ^[extracted]。

---

## 6. 关联阅读

- [[智能体/A2A_Protocol_Deep_Dive]] — A2A 协议深度解析
- [[学习/References/Articles/awesome-mcp-servers]] — 优质 MCP Servers 索引
- [[智能体/Agent_Skills/Agent_Skills_Deep_Dive]] — Agent Skills 与 MCP 对比
- [[智能体/Hello_Agents_L13_Travel_Assistant]] — 旅行助手中的 MCP 实践

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
