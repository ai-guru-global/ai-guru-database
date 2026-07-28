---
title: "Agent 互操作协议 (MCP / A2A / ANP / ACP / Agent 标准化)"
category: concepts
tags:
  - agent
  - mcp
  - a2a
  - anp
  - acp
  - agent-protocol
  - interop
  - agent-network
aliases:
  - Agent Protocols
  - MCP
  - A2A Protocol
  - ANP
  - ACP
  - Agent Network Protocol
relationships:
  - target: "概念/mcp"
    type: extends
  - target: "概念/a2a-protocol"
    type: extends
  - target: "概念/agent-framework"
    type: related_to
  - target: "概念/agent-loop"
    type: related_to
summary: "Agent 互操作协议栈——MCP(Model Context Protocol)标准化 LLM↔工具、Anthropic/Google/OpenAI 2025 联合发布 A2A(Agent-to-Agent)做 Agent↔Agent 通信、ANP(Agent Network Protocol)做去中心化 Agent 网络、ACP(IETF)做企业级 Agent 通信。是 Agent 生态从"孤岛"走向"网络"的关键基础设施。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "Agent 互操作协议"
---

# Agent 互操作协议

> 中文简称：Agent 互操作协议

> **一句话理解**:Agent 协议栈正在"标准化"——MCP 解决"Agent 怎么调工具",A2A 解决"Agent 怎么调 Agent",ANP 解决"Agent 怎么发现彼此",ACP 解决"企业 Agent 怎么跨网通信"。2025-2026 是 Agent 协议元年。

---

## 一、为什么需要 Agent 协议?

- **每个 Agent 框架自成体系**:LangChain / AutoGen / CrewAI / OpenHands 互不兼容
- **工具调用方式混乱**:Function Calling / Tools / JSON Schema / Custom 各种格式
- **Agent 间无法协作**:多 Agent 系统难跨组织、跨平台
- **企业集成成本高**:每接一个新 Agent 都要重新对接

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 模型上下文协议 | Model Context Protocol(MCP) | Anthropic 主导,LLM↔工具协议 |
| 代理到代理 | Agent-to-Agent(A2A) | Google 主导,Agent↔Agent 协议 |
| 代理网络协议 | Agent Network Protocol(ANP) | 去中心化 Agent 网络 |
| 代理通信协议 | Agent Communication Protocol(ACP) | IETF 标准化,企业 Agent |
| 代理卡片 | Agent Card | 描述 Agent 能力的元数据 |
| 能力发现 | Capability Discovery | 找到合适的 Agent |
| 任务委派 | Task Delegation | 父 Agent 派活给子 Agent |
| 状态共享 | State Sharing | Agent 间共享上下文 |
| 身份认证 | Authentication | 跨组织 Agent 身份 |
| 授权 | Authorization | RBAC / ABAC |
| 加密通信 | Encrypted Communication | TLS / mTLS |
| 多代理系统 | Multi-Agent System(MAS) | 多个 Agent 协作 |
| 互操作性 | Interoperability | 不同 Agent 框架互通 |
| 可观察性 | Observability | Agent 行为可追踪 |
| 语义发现 | Semantic Discovery | 基于能力的智能发现 |
| 标准化 | Standardization | 工业级共识 |
| 工作流引擎 | Workflow Engine | Agent 任务编排 |
| 注册中心 | Registry | Agent 目录服务 |
| 服务网格 | Service Mesh | 跨网络 Agent 通信 |
| 去中心化 | Decentralized | 无中心节点 |
| 去中心化身份 | Decentralized Identifier(DID) | 区块链式身份 |

---

## 三、协议矩阵对比(2026-02 快照)

| 协议 | 主导方 | 解决什么 | 状态 | 许可证 | 核心规范 |
|---|---|---|---|---|---|
| **MCP** | Anthropic + 开源 | LLM ↔ 工具/数据源 | GA(2024-11) | MIT | JSON-RPC,资源/工具/提示三原语 |
| **A2A** | Google + Linux 基金会 | Agent ↔ Agent | GA(2025-04) | Apache 2.0 | JSON-RPC over HTTP/SSE,Agent Card |
| **ANP** | 开源社区(github.com/agent-network-protocol) | 去中心化 Agent 网络 | 实验 | MIT | DID + e-TLS + 语义协议 |
| **ACP** | IETF(2025) | 企业 Agent 通信 | 草案 | — | REST + JSON-LD |
| **Open Agent Schema** | OpenAI | Agent 描述 | 实验 | Apache 2.0 | YAML/JSON 元数据 |
| **AG-UI** | CopilotKit | Agent ↔ UI | 实验 | MIT | 事件流 + React 集成 |
| **FIPA-ACL** | 学术 | Agent 通信老标准 | 历史 | 学术 | 经典 MAS 协议 |

---

## 四、MCP 详解

### 4.1 核心三原语

- **Resources**(资源):文件、数据库、API 返回的数据
- **Tools**(工具):可调用的函数
- **Prompts**(提示):预设提示模板

### 4.2 架构

```
┌──────────────────┐         ┌──────────────────┐
│   MCP Client     │ ←──→   │   MCP Server     │
│   (Claude Code)  │         │   (数据库/API)   │
└──────────────────┘         └──────────────────┘
       JSON-RPC over stdio / HTTP / SSE
```

### 4.3 MCP Server 实战

```python
from mcp.server import Server
from mcp.types import Tool, TextContent

app = Server("github-mcp")

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="create_issue",
            description="Create a GitHub issue",
            inputSchema={
                "type": "object",
                "properties": {
                    "repo": {"type": "string"},
                    "title": {"type": "string"},
                    "body": {"type": "string"},
                }
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "create_issue":
        # Call GitHub API
        return [TextContent(type="text", text=f"Issue created: {arguments['title']}")]
```

### 4.4 生态

- 1000+ 官方/社区 MCP Server
- GitHub / Slack / Notion / Linear / Postgres / Sentry / Docker
- 已被 OpenAI / Google / Microsoft 采纳为跨厂商标准

---

## 五、A2A 详解

### 5.1 核心概念

- **Agent Card**:JSON 元数据,描述 Agent 能力、URL、认证
- **Task**:父 Agent 委派给子 Agent 的工作单元
- **Artifact**:子 Agent 输出的结果
- **Streaming**:长任务 SSE 流式进度

### 5.2 架构

```
┌──────────────┐                  ┌──────────────┐
│  Agent A     │  ──── A2A ────>  │  Agent B     │
│  (客户端)   │                  │  (远程)     │
└──────────────┘                  └──────────────┘
       ↑                                  ↑
       │ 1. 发现 Agent Card                │
       │ 2. 发送 Task                      │
       │ 3. 接收 Streaming / Artifact     │
```

### 5.3 Agent Card 示例

```json
{
  "name": "Translator Agent",
  "description": "Translates text between 50+ languages",
  "url": "https://agents.example.com/translator",
  "version": "1.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": false
  },
  "skills": [
    {
      "id": "translate",
      "name": "Text Translation",
      "description": "Translates text with high accuracy",
      "inputModes": ["text"],
      "outputModes": ["text"]
    }
  ],
  "authentication": {
    "schemes": ["Bearer"]
  }
}
```

### 5.4 通信模式

- **Synchronous**:同步 RPC,简单任务
- **Streaming**:SSE,长任务实时进度
- **Asynchronous**:Webhook,任务完成回调
- **Polling**:长轮询,兼容老系统

---

## 六、ANP 详解(去中心化)

### 6.1 核心思想

- **DID(去中心化身份)**:Agent 身份可验证,跨组织无需 CA
- **e-TLS**:端到端加密
- **语义协议**:Agent 能力用 JSON-LD 描述,可语义推理
- **去中心化注册**:基于 IPFS / 区块链

### 6.2 适用场景

- 跨组织 Agent 协作(无中心注册)
- 隐私敏感场景(DID 隐藏身份)
- 跨云 / 边缘 Agent 互联

### 6.3 工具

- 协议实现:`github.com/agent-network-protocol/ANP`
- 身份 SDK:`did:wba` 实现

---

## 七、ACP 详解(IETF 标准)

### 7.1 核心思想

- **REST + JSON-LD**:经典企业架构
- **多租户**:每个 Agent 属于一个租户
- **审计追踪**:所有通信可审计
- **合规**:GDPR / HIPAA / SOC2

### 7.2 适用场景

- 企业内部 Agent 平台
- 金融 / 医疗 / 政务
- 与传统微服务集成

---

## 八、生产最佳实践

1. **工具调用用 MCP**:MCP 是 2024-11 GA 事实标准,Anthropic / OpenAI / Google 都支持。
2. **Agent 协作用 A2A**:Google 主导 + Linux 基金会,生态最广。
3. **企业内用 ACP**:IETF 草案,合规 + 审计追踪。
4. **去中心化场景用 ANP**:跨组织、隐私敏感。
5. **Agent Card 必填**:用元数据描述能力,便于发现。
6. **身份认证必做**:Bearer Token / mTLS / DID,避免"裸奔"。
7. **任务分片要小**:父 Agent 派子任务,粒度 < 10 步,可监控。
8. **流式进度要 SSE**:长任务必须有进度反馈,避免用户焦虑。
9. **错误恢复要完善**:任务失败要可重试,Agent 崩溃要可接管。
10. **可观测性必备**:Langfuse / AgentOps 追踪所有 Agent 通信。
11. **成本监控**:Agent 间调用也是 API 调用,要算成本。
12. **A2A MCP 配合**:MCP 是 Agent 调工具,A2A 是 Agent 调 Agent,组合用。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **MCP** | 1000+ Server,OpenAI / Google / MS 全部支持,事实标准 |
| **A2A** | Google 主导,Linux 基金会 GA,50+ 厂商支持 |
| **ANP** | 实验阶段,去中心化场景首选 |
| **ACP** | IETF 草案,金融 / 政务试点 |
| **企业采纳** | MCP 80%+ Agent 平台,A2A 30%+,ANP/ACP 各 5% |
| **Agent 注册** | Agent Card 标准化,Google Agent Garden / MS Agent 365 |
| **跨云** | A2A 跨 AWS / GCP / Azure,ANP 跨云 + 边缘 |
| **安全** | DID + e-TLS + RBAC,合规标准持续完善 |
| **标准化** | Linux Foundation AI 联盟 + IETF + W3C 协作 |
| **主要采纳** | Salesforce / ServiceNow / Workday / Atlassian / Google Workspace |

---

## 十、See Also(官方源)

### MCP

- 官方 [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- 规范 [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification)
- Server 仓库 [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- Python SDK [github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)

### A2A

- 官方 [a2a-protocol.org](https://a2a-protocol.org/)
- 规范 [github.com/a2a-protocol/a2a-spec](https://github.com/a2a-protocol/a2a-spec)
- 演示 [github.com/a2a-protocol/a2a-samples](https://github.com/a2a-protocol/a2a-samples)

### ANP

- 仓库 [github.com/agent-network-protocol/ANP](https://github.com/agent-network-protocol/ANP)
- 文档 [agent-network-protocol.com](https://agent-network-protocol.com/)

### ACP

- IETF 工作组 [datatracker.ietf.org/wg/acp](https://datatracker.ietf.org/wg/acp/)
- 草案 [datatracker.ietf.org/doc/draft-ietf-acp-acp-spec](https://datatracker.ietf.org/doc/draft-ietf-acp-acp-spec/)

### 其他

- AG-UI [github.com/ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)
- Open Agent Schema [github.com/openai/agent-schema](https://github.com/openai/agent-schema)

---

## 十一、相关概念卡

- [[概念/mcp|Mcp]]
- [[概念/a2a-protocol|A2a Protocol]]
- [[概念/agent-framework|Agent Framework]]
- [[概念/agent-loop|Agent Loop]]
- [[概念/multi-agent|Multi Agent]]
- [[概念/multi-agent-orchestration|Multi Agent Orchestration]]
- [[概念/tool-use|Tool Use]]
- [[概念/function-calling|Function Calling]]
