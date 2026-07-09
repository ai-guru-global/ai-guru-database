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
  - "_raw/github-sources/hello-agents/docs/chapter10/第十章 智能体通信协议.md"
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

- [[Agent/Agent_Protocols/A2A_Protocol_Deep_Dive]] — A2A 协议深度解析
- [[_references/awesome-mcp-servers]] — 优质 MCP Servers 索引
- [[Agent/Agent_Skills/Agent_Skills_Deep_Dive]] — Agent Skills 与 MCP 对比
- [[Agent/Hello_Agents_L13_Travel_Assistant]] — 旅行助手中的 MCP 实践
