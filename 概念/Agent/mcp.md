---
title: "Model Context Protocol (MCP)"
tags: [mcp, agent-protocols, tool-use, context-engineering, agent-harness]
created: 2026-06-17
updated: 2026-07-21
tier: core
aliases:
  - Mcp
category: -concepts
lifecycle: reviewed
relationships:
  - target: "概念/Agent/tool-use"
    type: enables
  - target: "概念/Agent/a2a-protocol"
    type: complements
  - target: "概念/Agent/agent-harness"
    type: part_of
sources:
  - "https://modelcontextprotocol.io"
  - "https://spec.modelcontextprotocol.io/specification/2025-03-26/"
---

# Model Context Protocol (MCP)

## 定义

Model Context Protocol (MCP) 是由 Anthropic 于 2024 年 11 月发布的开放协议规范，用于标准化 AI 应用与外部工具、数据源之间的交互。它被称为"AI 世界的 USB-C"——通过统一协议将 M 个 AI 应用连接 N 个外部服务的 M×N 集成问题简化为 M+N 个实现。截至 2026 年中，MCP 已成为事实上的 AI 工具连接标准，被 OpenAI、Google、Microsoft、Cursor、Windsurf 等主流厂商采纳。

## 核心机制

### 架构三角（Host-Client-Server）

MCP 采用三层架构：

1. **Host（宿主）**：AI 应用本身（如 Claude Desktop、Cursor、VS Code Copilot），负责用户授权、上下文聚合和安全边界
2. **MCP Client（客户端）**：与每个 Server 建立 1:1 有状态会话，一个 Host 可同时连接多个 Server
3. **MCP Server（服务端）**：暴露工具、资源和提示模板，连接真实世界的 API 和数据源

```
┌─────────────────────────────────────────────┐
│                  Host (AI App)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Client A │ │ Client B │ │ Client C │    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘    │
└───────┼─────────────┼─────────────┼──────────┘
        │             │             │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
   │Server:  │  │Server:  │  │Server:  │
   │GitHub   │  │Database │  │Slack    │
   └─────────┘  └─────────┘  └─────────┘
```

### 三大基础构件（Primitives）

| 构件 | 说明 | 控制方向 | 典型示例 |
|------|------|----------|----------|
| **Tools（工具）** | 模型可调用的函数，执行副作用操作 | Model → Server | 发送邮件、创建 PR、执行 SQL |
| **Resources（资源）** | 结构化/非结构化数据，供模型读取 | Server → Model | 文件内容、数据库记录、API 响应 |
| **Prompts（提示模板）** | 预定义的交互模板和工作流 | User → Model | 代码审查模板、翻译工作流 |

### 传输层协议

MCP 支持两种传输方式：

| 传输 | 适用场景 | 特点 |
|------|----------|------|
| **stdio** | 本地进程通信 | 零配置、低延迟、适合 CLI 工具 |
| **Streamable HTTP (SSE)** | 远程/网络通信 | 支持流式响应、可穿越防火墙、适合云服务 |

> 注：2025-03-26 规范版本已用 Streamable HTTP 替代早期的 HTTP+SSE 传输，统一了远程连接方式。

### 协议生命周期

```
初始化 (initialize) → 能力协商 (capabilities) → 就绪 (initialized)
    → 正常通信 (tools/call, resources/read, prompts/get)
    → 关闭 (shutdown)
```

1. **Initialize**：Client 发送协议版本和支持的能力，Server 回复自身能力
2. **能力协商**：双方确认支持哪些 Primitives（tools、resources、prompts、sampling）
3. **正常通信**：通过 JSON-RPC 2.0 消息进行工具调用、资源读取等
4. **关闭**：优雅断开连接，释放资源

## 实战：构建 MCP Server

### TypeScript SDK 最小示例

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
});

// 注册工具
server.tool(
  "get_weather",
  "获取指定城市的天气信息",
  { city: z.string().describe("城市名称") },
  async ({ city }) => {
    const data = await fetchWeather(city);
    return { content: [{ type: "text", text: JSON.stringify(data) }] };
  }
);

// 注册资源
server.resource("config", "config://app", async (uri) => ({
  contents: [{ uri: uri.href, text: JSON.stringify(appConfig) }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Python SDK 最小示例

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather-server")

@mcp.tool()
def get_weather(city: str) -> str:
    """获取指定城市的天气信息"""
    return fetch_weather(city)

@mcp.resource("config://app")
def get_config() -> str:
    return json.dumps(app_config)

if __name__ == "__main__":
    mcp.run()  # 默认 stdio 传输
```

### 客户端配置（claude_desktop_config.json）

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_xxx" }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres",
               "postgresql://localhost/mydb"]
    }
  }
}
```

## 安全模型

### 权限控制层次

| 层级 | 机制 | 说明 |
|------|------|------|
| Host 层 | 用户授权弹窗 | 首次调用工具需用户确认 |
| Client 层 | 能力白名单 | 只暴露已协商的 Primitives |
| Server 层 | OAuth 2.1 / API Key | 远程 Server 的身份认证 |
| 工具层 | 参数校验 + 沙箱 | 防止注入和越权操作 |

### 2026 安全增强

- **OAuth 2.1 集成**：远程 MCP Server 支持标准 OAuth 流程，替代静态 Token
- **工具审批策略**：Host 可配置 auto-approve / ask-always / deny 三级策略
- **沙箱执行**：代码执行类工具在隔离环境中运行（如 Docker、Firecracker）
- **审计日志**：所有工具调用记录完整的 input/output 用于合规追溯

## 2026 生态全景

### 主流 MCP Host

| Host | 类型 | 特点 |
|------|------|------|
| Claude Desktop / Claude Code | 对话 + 编码 | 原生 MCP 支持，最完整实现 |
| Cursor / Windsurf | IDE | 开发工具集成，代码上下文感知 |
| VS Code (Copilot) | IDE | GitHub 生态集成 |
| OpenAI Agents SDK | 框架 | 2025.3 宣布支持 MCP |
| Google ADK / Gemini | 框架 + 产品 | A2A + MCP 双协议 |

### 热门 MCP Server 生态

- **官方维护**：GitHub、Slack、Google Drive、PostgreSQL、Filesystem、Puppeteer
- **社区热门**：Notion、Jira、Linear、Sentry、Datadog、MongoDB、Redis
- **企业自建**：内部 API 网关、知识库、CRM/ERP 系统
- **注册中心**：Smithery、mcp.so、Glama 等 MCP Server 市场

## MCP vs 其他协议对比

| 维度 | MCP | A2A | OpenAI Function Calling | LangChain Tools |
|------|-----|-----|------------------------|------------------|
| 连接对象 | AI ↔ 工具/数据 | Agent ↔ Agent | AI ↔ 函数 | AI ↔ 函数 |
| 标准化程度 | 开放协议规范 | 开放协议规范 | 厂商 API | 框架内部 |
| 传输 | stdio / HTTP | HTTP + SSE | HTTP API | Python 调用 |
| 状态管理 | 有状态会话 | 有状态任务 | 无状态 | 框架管理 |
| 发现机制 | 能力协商 | Agent Card | Schema 声明 | 代码注册 |

## 最佳实践

1. **工具粒度**：每个工具做一件事，避免"万能工具"；命名用 `verb_noun` 格式
2. **错误处理**：返回结构化错误信息（`isError: true`），让模型能理解并自我修正
3. **资源分页**：大资源使用 URI 模板 + 分页，避免一次性加载过多上下文
4. **版本管理**：Server 升级时保持向后兼容，使用语义化版本
5. **最小权限**：每个 Server 只暴露必要工具，敏感操作需二次确认
6. **监控可观测**：记录工具调用延迟、成功率、Token 消耗

## Related

- [[概念/Agent/a2a-protocol|A2A Protocol]] — Agent 间互操作协议，与 MCP 互补
- [[概念/Agent/tool-use|Tool Use]] — 大模型工具使用能力
- [[概念/Agent/agent-harness|Agent Harness]] — MCP 是 Harness 的工具连接层
- [[概念/Agent/tool-calling-safety|工具调用安全]] — 工具执行的安全保障
- [[智能体/Agent_Protocols/MCP_Deep_Dive|MCP 深度解析]] — 协议规范详解
- [[概念/Agent/agentic-rag|Agentic RAG]] — MCP 赋能的检索增强生成
- [[RAG系统/RAG_Frameworks/RAG_Frameworks|RAG 框架]] — MCP 在 RAG 管道中的应用