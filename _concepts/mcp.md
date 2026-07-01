---

title: "Model Context Protocol (MCP)"
tags: [mcp, agent-protocols, tool-use, context-engineering, agent-harness]
created: 2026-06-17
tier: core
aliases:
  - Mcp
category: -concepts
lifecycle: stable

relationships:
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
|