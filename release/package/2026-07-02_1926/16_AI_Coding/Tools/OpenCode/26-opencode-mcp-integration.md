---
title: 'MCP 协议集成指南'

tags:
- ai
- ai-coding
created: 2026-06-12
category: 16-ai-coding-tools-opencode
tier: peripheral
aliases:
  - "Opencode Mcp Integration"
  - "opencode mcp integration"

updated: 2026-06-30
summary: "MCP 协议集成指南 — 专题文档"
sources: []
---
title: [[_concepts/ai-agents|MCP]] 协议集成指南
description: '# MCP 协议集成指南'
category: 16-ai-coding-tools-opencode
tags:
- ai
- coding
- copilot
- code-generation
- postgresql
- agent
last_updated: 2026-05
difficulty: intermediate
reading_level: intermediate
audience:
- 开发工程师
- AI 工程师
estimated_read_time: 5min
intent_queries:
- MCP 协议集成指南 是什么
- 如何 MCP 协议集成指南
trigger_keywords:
- MCP
- 协议集成指南
- ai
- coding
authors:
- name: KUDIG Team
 role: contributor
k8s_versions:
- '1.28'
- '1.29'
- '1.30'
- '1.31'
- '1.32'
---
# MCP 协议集成指南

> **文档类型**: 集成指南 | **最后更新**: 2026-03 | **关键词**: OpenCode, MCP, Model Context Protocol, Local MCP, Remote MCP, OAuth, Per-Agent MCP, Sentry, Linear

---

## 概述

OpenCode 完整支持 **MCP（Model Context Protocol）**，可通过 Local（stdio 子进程）和 Remote（HTTP）两种方式接入外部工具和服务。MCP 工具与内置工具一视同仁，在 Agent 对话中自动可用，且支持 Per-Agent 启用/禁用、OAuth 自动认证和组织级远程配置分发。

---

## 1. MCP 架构

```
┌─────────────────────────────────────────────┐
│                OpenCode Agent               │
│                                             │
│  ┌───────────┐  ┌────────────┐  ┌────────┐ │
│  │ 内置工具   │  │ Custom Tool │  │ MCP 工具│ │
│  │ bash/edit  │  │ TypeScript │  │ 外部服务 │ │
│  └───────────┘  └────────────┘  └────┬───┘ │
│                                      │     │
│                      ┌───────────────▼───┐ │
│                      │   MCP Client      │ │
│                      │  (stdio / HTTP)   │ │
│                      └───────────────────┘ │
└──────────────────────────────────────────────┘
         │                    │
    ┌────▼────┐         ┌────▼────┐
    │Local MCP│         │Remote MCP│
    │ (stdio) │         │ (HTTP)   │
    │ npx/bun │         │ URL+OAuth│
    └─────────┘         └──────────┘
```

> ⚠️ **上下文注意**：每个 MCP Server 的工具描述都会加入上下文。工具数量多的 MCP Server（如 GitHub MCP）容易超出上下文限制。建议按需启用。

---

## 2. Local MCP Server

通过 stdio 子进程方式运行本地 MCP Server：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mcp_everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
      "enabled": true,
      "timeout": 5000,
      "environment": {
        "MY_ENV_VAR": "value"
      }
    }
  }
}
```

| 选项 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | ✅ | 必须为 `"local"` |
| `command` | string[] | ✅ | 启动命令及参数 |
| `environment` | object | ❌ | 环境变量 |
| `enabled` | boolean | ❌ | 是否启用（默认 true） |
| `timeout` | number | ❌ | 工具获取超时（ms），默认 5000 |

使用方式：

```
use the mcp_everything tool to add the number 3 and 4
```

---

## 3. Remote MCP Server

通过 HTTP 调用远程 MCP Server：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-remote-mcp": {
      "type": "remote",
      "url": "https://my-mcp-server.com",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

| 选项 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | ✅ | 必须为 `"remote"` |
| `url` | string | ✅ | 远程 MCP Server URL |
| `enabled` | boolean | ❌ | 是否启用 |
| `headers` | object | ❌ | 请求头（支持 `{env:VAR}` 引用环境变量） |
| `oauth` | object/false | ❌ | OAuth 配置或 `false` 禁用 OAuth 自动检测 |
| `timeout` | number | ❌ | 超时（ms），默认 5000 |

---

## 4. OAuth 自动认证

### 4.1 自动流程

对于支持 OAuth 的 Remote MCP Server，OpenCode 自动处理认证：

1. 检测 401 响应 → 启动 OAuth 流程
2. 使用 Dynamic Client Registration (RFC 7591)
3. 安全存储 Token 至 `~/.local/share/opencode/mcp-auth.json`

```json
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

### 4.2 手动认证管理

```bash
# 认证指定 MCP Server
opencode mcp auth sentry

# 查看所有 MCP Server 及认证状态
opencode mcp list

# 移除已存储的凭证
opencode mcp logout sentry

# 调试连接和 OAuth 流程
opencode mcp debug sentry
```

### 4.3 预注册 OAuth 客户端

```json
{
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "{env:MY_MCP_CLIENT_ID}",
        "clientSecret": "{env:MY_MCP_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```

### 4.4 禁用 OAuth

对于使用 API Key 而非 OAuth 的 Server：

```json
{
  "mcp": {
    "my-api-key-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

---

## 5. Per-Agent MCP 管理

大量 MCP Server 会显著增加上下文 token 消耗。推荐模式：**全局禁用，按 Agent 启用**。

```json
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "enabled": true
    },
    "linear": {
      "type": "remote",
      "url": "https://mcp.linear.app/mcp",
      "enabled": true
    }
  },
  "permission": {
    "sentry_*": "deny",
    "linear_*": "deny"
  },
  "agent": {
    "ops-agent": {
      "description": "Operations agent with Sentry access",
      "mode": "subagent",
      "permission": {
        "sentry_*": "allow"
      }
    },
    "pm-agent": {
      "description": "Project management agent with Linear access",
      "mode": "subagent",
      "permission": {
        "linear_*": "allow"
      }
    }
  }
}
```

glob 模式：`sentry_*` 匹配该 MCP Server 暴露的所有工具（如 `sentry_search_issues`、`sentry_get_event` 等）。

---

## 6. 常用 MCP Server 示例

### 6.1 Sentry（错误追踪）

```json
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

```bash
opencode mcp auth sentry  # 首次使用需认证
```

```
Show me the latest unresolved issues in my project. use sentry
```

### 6.2 PostgreSQL

```json
{
  "mcp": {
    "postgres": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-postgres"],
      "environment": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

### 6.3 文件系统（扩展）

```json
{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    }
  }
}
```

---

## 7. 组织级远程配置

组织可通过 `.well-known/opencode` 端点提供默认 MCP Server 配置（默认禁用）：

```json
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp",
      "enabled": false
    },
    "confluence": {
      "type": "remote",
      "url": "https://wiki.example.com/mcp",
      "enabled": false
    }
  }
}
```

用户在本地 `opencode.json` 中按需启用：

```json
{
  "mcp": {
    "jira": { "enabled": true }
  }
}
```

---

## 8. 动态管理

通过 HTTP API 动态添加 MCP Server（运行时）：

```bash
# 查看 MCP Server 状态
curl http://localhost:4096/mcp

# 动态添加 MCP Server
curl -X POST http://localhost:4096/mcp -d '{
  "name": "my-new-mcp",
  "config": {
    "type": "local",
    "command": ["npx", "-y", "my-mcp-server"]
  }
}'
```

---

## 关联文档

| 文档 | 关系 |
|------|------|
| [05 - 工具与权限](./25-opencode-tools-permissions.md) | MCP 工具的权限配置 |
| [04 - Agent 系统](./24-opencode-agents-system.md) | Per-Agent MCP 配置 |
| [10 - Server API](./30-opencode-server-api.md) | MCP 动态管理 API |
| [topic-ai-agent/25](../OpenCode/26-opencode-mcp-integration.md) | MCP 协议通用指南 |

---

*本文档基于 OpenCode 官方文档（opencode.ai/docs/mcp-servers）整理。*

---

## Obsidian 相关文档

- [[编程/MOC_OpenRouter_OpenCode.md|MOC]]
- [[编程/OpenRouter_OpenCode_Guide|AI 编程与  网关专题 — OpenRouter & OpenCode 全量指南]]
- [[编程/Tools/OpenRouter/01-openrouter-overview-architecture|OpenRouter 概述与核心架构]]
- [[编程/Tools/OpenRouter/02-openrouter-quickstart-setup|快速接入与环境配置]]
- [[编程/Tools/OpenRouter/03-openrouter-models-providers|模型与 Provider 生态]]
- [[编程/Tools/OpenRouter/04-openrouter-provider-routing|智能路由与 Provider 选择]]
- [[编程/Tools/OpenRouter/05-openrouter-api-reference|API 参考与请求/响应规范]]
- [[编程/Tools/OpenRouter/06-openrouter-structured-outputs-tools|Structured Outputs 与 Tool Calling]]
- [[编程/Tools/OpenRouter/07-openrouter-plugins-web-search|插件体系与 Web Search]]
- [[编程/Tools/OpenRouter/08-openrouter-prompt-caching-optimization|Prompt Caching 与成本优化]]
- [[编程/Tools/OpenRouter/09-openrouter-frameworks-integrations|框架集成与生态系统]]
- [[编程/Tools/OpenRouter/10-openrouter-streaming-multimedia|流式传输与多模态输入]]

## Related

- [[编程/Tools/OpenCode/21-opencode-overview-architecture]] — 21-opencode-overview-architecture (共享: ai, ai-coding)
- [[编程/Tools/OpenCode/22-opencode-installation-quickstart]] — 22-opencode-installation-quickstart (共享: ai, ai-coding)
- [[编程/Tools/OpenCode/23-opencode-providers-models]] — 23-opencode-providers-models (共享: ai, ai-coding)
- [[编程/Tools/OpenCode/24-opencode-agents-system]] — 24-opencode-agents-system (共享: ai, ai-coding)
