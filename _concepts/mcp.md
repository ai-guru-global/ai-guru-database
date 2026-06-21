---
title: "Model Context Protocol (MCP)"
tags: [mcp, agent-protocols, tool-use, context-engineering, agent-harness]
created: 2026-06-17
---

# Model Context Protocol (MCP)

## 定义

Model Context Protocol (MCP) 是一套标准化的开放协议规范，用于 AI 应用与外部工具、数据源之间的交互。它被称为"AI 世界的 USB-C"——通过统一协议将 M 个 AI 应用连接 N 个外部服务的 M x N 集成问题简化为 M + N 个实现。

## 核心机制

### 架构三角

MCP 采用 Host-Client-Server 三层架构：

1. **Host（宿主）**：AI 应用本身（如 Claude Desktop、Claude Code、Cursor），负责用户授权、上下文聚合和安全边界
2. **MCP Client（客户端）**：与每个 Server 建立 1:1 有状态会话，一个 Host 可同时连接多个 Server
3. **MCP Server（服务端）**：暴露工具、资源和提示模板，连接真实世界的 API 和数据源

### 三大基础构件（Primitives）

| 构件 | 说明 | 方向 |
|------|------|------|
| **Tools** | 可执行的函数操作 | AI -> 外部（写/执行） |
| **Resources** | 可读取的数据源 | 外部 -> AI（只读） |
| **Prompts** | 预定义提示模板 | 双向（标准化交互模式） |

此外还有 **Sampling（采样）** 能力：Server 反向请求模型生成内容，用于需要模型辅助决策的工具场景。

### 传输层

MCP 支持两种传输方式：

- **stdio**：本地进程间通信，适合桌面应用和本地工具
- **Streamable HTTP**：基于 HTTP 的流式通信，适合远程服务和 Web 集成

### 与上下文工程的关系

MCP 使上下文工程从静态的向量检索演进到动态、可组合、可扩展的系统：

```
[查询理解与规划] <-- MCP Prompts (标准化模板)
[上下文获取]     <-- MCP Resources (多源数据融合)
[上下文变换]     <-- MCP Tools (动态压缩/过滤/增强)
[推理与生成]
```

## 关键设计决策

- **动态发现 vs 静态集成**：MCP Server 在运行时暴露能力描述，Host 无需硬编码每个工具的参数和错误处理，实现从"手写每个集成"到"运行时发现能力"的转变
- **协议标准化 vs 自定义适配**：统一 Schema 规范降低集成成本，但牺牲了部分场景的定制化灵活性
- **安全边界设计**：MCP Server 本身可能成为供应链和权限边界的薄弱点，需关注服务器身份验证、消息完整性和配置安全（如 CVE-2025-54136 所示）
- **生态定位**：2024 年 11 月开源，2025 年 12 月加入 Agentic AI Foundation (AAIF)（Linux Foundation 托管，Anthropic/Block/OpenAI 联合发起）

## 与其他概念的关系

- [[agent-harness]] -- MCP 是 Harness 工具层的核心协议之一，为智能体提供标准化的外部能力接入
- [[a2a-protocol]] -- MCP 连接 Agent 与 Tool/Data（原子操作粒度），A2A 连接 Agent 与 Agent（任务级粒度），两者互补
- [[context-engineering]] -- MCP Resources 和 Tools 为上下文工程提供动态获取和变换能力
- [[agent-loop]] -- Agent Loop 中的工具调用步骤通过 MCP 协议与外部服务交互
- [[guardrails]] -- MCP Server 的工具策略（allow/deny）是安全治理的关键控制点

## 深入阅读

- [[05_NLP_LLMs/Context_Engineering_Guide.md]] -- MCP 在上下文工程中的三层架构
- [[16_AI_Coding/Tools/Claude_Complete_Guide.md]] -- Claude 生态中的 MCP 实现与生态现状
- [[15_Agent_Production/Agent_Foundations/Agentic_AI_Complete_Guide.md]] -- MCP 在智能体工具系统中的定位
- [[17_Ethics_Safety/Agent_RAG_Security.md]] -- MCP 协议安全考量
- [[15_Agent_Production/OpenClaw_Ecosystem/OpenClaw_Complete_Guide.md]] -- OpenClaw 中的 MCP 集成实践
