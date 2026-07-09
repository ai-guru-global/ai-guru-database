---
title: "Agent-to-Agent 协议 (A2A) 深度解读"
category: "15-agent-production-agent-protocols"
tags: ["agents", "a2a", "protocol", "interoperability", "multi-agent"]
summary: "Google 提出的 Agent-to-Agent (A2A) 协议,定义了 AI Agent 之间互操作的开放标准,是多 Agent 系统的通信基石。"
sources:
  - "https://a2a-protocol.org/"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
aliases:
  - "A2a Protocol Deep Dive"
  - "A2A Protocol Deep Dive"
  - A2A_Protocol_Deep_Dive

---
# Agent-to-Agent 协议 (A2A) 深度解读

> **一句话理解**: Google 提出的 Agent-to-Agent (A2A) 协议,定义了 AI Agent 之间互操作的开放标准,是多 Agent 系统的通信基石。

## 协议概况

- **提出者**: Google
- **官网**: [a2a-protocol.org](https://a2a-protocol.org/)
- **定位**: Agent 间通信的开放标准
- **与 MCP 关系**: MCP 连接 Agent 与工具,A2A 连接 Agent 与 Agent

## 为什么需要 A2A?

在企业环境中,不同团队构建的 Agent 需要协作。A2A 解决的核心问题:

| 问题 | A2A 解决方案 |
|------|-------------|
| Agent 间无法通信 | 标准化的消息格式和传输协议 |
| 能力发现困难 | Agent Card 描述 Agent 能力 |
| 任务状态不透明 | 标准化的任务生命周期管理 |
| 安全性无保障 | 内置认证和授权机制 |

## 核心概念

### Agent Card
每个 Agent 发布一个 JSON 描述文件,包含:
- 名称和描述
- 支持的能力(工具、技能)
- 端点 URL
- 认证方式

### 任务生命周期
```
submitted -> working -> completed/failed
         -> input-required -> working
         -> canceled
```

### 消息格式
- 基于 JSON-RPC 2.0
- 支持同步和异步通信
- 支持流式响应(SSE)

## A2A vs MCP

| 维度 | MCP | A2A |
|------|-----|-----|
| 连接对象 | Agent <-> 工具/数据 | Agent <-> Agent |
| 提出者 | Anthropic | Google |
| 核心能力 | 工具调用、资源访问 | 能力发现、任务委托 |
| 通信模式 | 请求-响应 | 请求-响应 + 流式 |
| 状态管理 | 无状态 | 有状态(任务生命周期) |

## 实际应用场景

1. **跨团队协作**: 营销 Agent 委托数据分析 Agent 生成报告
2. **专家委托**: 通用 Agent 将专业任务委托给领域专家 Agent
3. **工作流编排**: 多个 Agent 协作完成复杂业务流程

> **关联**: -> [[06_Reinforcement_Learning/AI_Agents/MCP_Implementation_Guide|MCP 实现指南]] | [[15_Agent_Production/README|Agent 生产]] | [[12_Architecture_Infrastructure/AI_Gateway/index|AI 网关]]

