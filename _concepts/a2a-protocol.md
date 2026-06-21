---
title: "Agent-to-Agent Protocol (A2A)"
tags: [a2a-protocol, multi-agent, agent-protocols, mcp, collaboration]
created: 2026-06-17
---

# Agent-to-Agent Protocol (A2A)

## 定义

Agent-to-Agent Protocol (A2A) 是 Google 提出的智能体互操作协议，用于标准化 Agent 与 Agent 之间的协作通信。如果说 MCP 是"AI 的 USB-C"（连接工具和数据），那么 A2A 是"AI 的 LinkedIn"——让不同来源的智能体能够发现彼此、协商任务、协同工作。

## 核心机制

### 与 MCP 的定位分工

| 维度 | MCP (工具连接协议) | A2A (智能体互操作协议) |
|------|-------------------|---------------------|
| **连接对象** | Agent <-> Tool/Data | Agent <-> Agent |
| **协议目的** | 获得外部能力 | 协作完成任务 |
| **交互粒度** | 原子操作（单次工具调用） | 任务级工作单元（跨时间的工作流） |
| **核心抽象** | Resources, Tools, Prompts | 能力描述, 任务, 进度, 审计 |
| **生命周期** | 请求-响应 | 跨秒/分钟/小时的任务流 |

两者互补而非竞争：一个 Agent 通过 MCP 获取工具能力，通过 A2A 与其他 Agent 协作。

### Agent Card (能力描述文档)

每个 Agent 发布一份标准化的能力描述，包含：

- **身份**：名称、版本、所属组织
- **用途**：能力概述和适用场景
- **任务类型**：支持的任务分类
- **输入输出 Schema**：接受什么格式的请求，返回什么格式的响应
- **认证方式**：如何验证调用者身份

Agent Card 使智能体发现从"人工配置"变为"运行时自动匹配"。

### 任务生命周期模型

A2A 将协作抽象为标准化的任务状态机：

```
queued -> in_progress -> done / failed / canceled
```

任务载荷采用 ContextPack 标准结构，包含 trace_id + span_id + system + tools + memory + evidence，确保全链路可追踪。

### 进度回传机制

长任务支持两种进度回传方式：

- **轮询 (Pull)**：调用方定期查询任务状态
- **流式推送 (Push)**：通过 SSE/WebSocket 实时推送进度更新

### 审计链

全链路 trace_id 透传是 A2A 的核心设计：

- 上游规划的 trace_id 透传到下游执行
- 与 ContextPack.trace_id 绑定
- 支持跨多个 Agent 的完整执行轨迹重建

## 关键设计决策

- **任务级抽象 vs 操作级抽象**：A2A 在任务层面交互，而非底层的函数调用——这使 Agent 保留自主决策能力，同时向调用方提供任务级进度可见性
- **标准化 vs 灵活性**：统一的任务状态机和载荷格式降低集成成本，但需要各 Agent 将内部工作流适配到标准模型
- **ContextPack 复用**：复用已有的 ContextPack 作为任务载荷，避免重复发明数据传递格式
- **增量回传**：长任务支持进度推送而非等全部完成才返回，提升用户体验

## 与其他概念的关系

- [[mcp]] -- MCP 和 A2A 互补：MCP 连接工具（Agent -> Tool），A2A 连接智能体（Agent -> Agent）
- [[agent-loop]] -- A2A 任务在接收方 Agent 内部通过 Agent Loop 执行
- [[agent-harness]] -- 编排引擎通过 A2A 实现跨 Agent 的任务委派和结果聚合
- [[context-engineering]] -- A2A 任务载荷中的 ContextPack 是上下文工程在多智能体间的传递机制
- [[guardrails]] -- A2A 通信中的零信任原则：每次跨 Agent 请求都需独立验证身份和权限

## 深入阅读

- [[15_Agent_Production/Agent_Foundations/Multi_Agent_Systems_Guide.md]] -- A2A 互操作协议详解与多智能体协作架构
- [[15_Agent_Production/Agent_Foundations/Agentic_AI_Complete_Guide.md]] -- 智能体协议的整体定位
- [[17_Ethics_Safety/Agent_RAG_Security.md]] -- 多智能体协作安全：零信任架构与信任链破坏
