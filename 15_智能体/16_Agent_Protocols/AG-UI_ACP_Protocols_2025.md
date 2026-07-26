---
title: "AG-UI 与 ACP：2025 Agent-UI 流协议与 IBM BeeAI 通信协议深度解读"
category: "15-agent-production-agent-protocols"
tags: ["agents", "ag-ui", "acp", "protocol", "streaming", "ibm", "beeai", "agent-ui", "interoperability"]
summary: "AG-UI (Agent-User Interaction Protocol) 定义了 Agent 与前端 UI 之间的标准化流式通信接口；ACP (Agent Communication Protocol) 由 IBM BeeAI 主导，专注于多 Agent 异步消息传递与服务发现。两者与 MCP/A2A 共同构成 2025 年 Agent 协议完整生态。"
created: 2025-07-15
updated: 2025-07-15
tier: supporting
lifecycle: reviewed
aliases:
  - "AG-UI ACP Protocols 2025"
  - AG-UI_ACP_Protocols_2025
sources:
  - "https://docs.ag-ui.com/"
  - "https://agentcommunicationprotocol.dev/"
  - "https://github.com/agentcommunicationprotocol/acp-spec"
  - "https://github.com/ag-ui-protocol/ag-ui"

---

# AG-UI 与 ACP：Agent-UI 流协议与通信协议深度解读

> **一句话理解**: AG-UI 解决"Agent 怎么和用户界面实时通信"，ACP 解决"Agent 怎么被其他 Agent 发现并异步调用"——两者填补了 MCP/A2A 生态中的最后两块拼图。

---

## 目录

1. [协议生态全景：四大协议各司其职](#1-协议生态全景四大协议各司其职)
2. [AG-UI：Agent-UI 流式交互协议](#2-ag-ui-agent-ui-流式交互协议)
3. [ACP：Agent 通信协议（IBM/BeeAI）](#3-acp-agent-通信协议-ibmbeeai)
4. [协议对比与选型指南](#4-协议对比与选型指南)
5. [实战：AG-UI 集成示例](#5-实战-ag-ui-集成示例)
6. [实战：ACP 多 Agent 服务注册](#6-实战-acp-多-agent-服务注册)
7. [四协议组合架构](#7-四协议组合架构)

---

## 1. 协议生态全景：四大协议各司其职

2025 年，AI Agent 协议生态形成了清晰的分工格局：

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Agent 协议生态 2025                               │
├──────────────┬─────────────────────┬───────────────────────────────┤
│  协议        │  解决的问题          │  主导方                        │
├──────────────┼─────────────────────┼───────────────────────────────┤
│  MCP         │ Agent ↔ 工具/数据源  │ Anthropic / Linux Foundation  │
│  A2A         │ Agent ↔ Agent 协作   │ Google / 50+ 企业联盟         │
│  AG-UI       │ Agent ↔ 用户界面     │ CopilotKit / 开源社区         │
│  ACP         │ Agent 服务发现与调用 │ IBM Research / BeeAI          │
└──────────────┴─────────────────────┴───────────────────────────────┘
```

**为什么需要 AG-UI 和 ACP？**

- **MCP 的盲区**：MCP 定义了 Agent 如何调用工具，但没有规定 Agent 的中间推理过程如何实时呈现给用户。
- **A2A 的侧重**：A2A 专注于 Agent 间的任务委托，对 Agent 与人类 UI 的流式交互没有覆盖。
- **AG-UI 填补**：提供标准化的前端事件流，让 Cursor、ChatGPT、自定义 UI 都能以统一方式呈现 Agent 的"思考过程"。
- **ACP 填补**：提供 Agent 的 REST-native 服务暴露与发现机制，适合企业内网的 Agent 微服务注册。

---

## 2. AG-UI：Agent-UI 流式交互协议

### 2.1 协议概述

**AG-UI（Agent-User Interaction Protocol）** 是 CopilotKit 团队主导的开放协议，2025 年 3 月首次发布。

**核心定位**：Agent 后端 → 前端 UI 的标准化**事件流**协议。

**设计哲学**：
- 基于 **Server-Sent Events (SSE)** 或 **HTTP 流**，无需 WebSocket
- 事件驱动：Agent 每产生一个有意义的动作就发出一个事件
- 框架无关：LangGraph、AutoGen、OpenAI Agents SDK 均可适配

### 2.2 AG-UI 事件类型

AG-UI 定义了 12 类标准事件，覆盖 Agent 执行的完整生命周期：

```typescript
// AG-UI 事件类型枚举
type AGUIEvent =
  // 文本生成类
  | { type: "TEXT_MESSAGE_START"; messageId: string; role: "assistant" }
  | { type: "TEXT_MESSAGE_CONTENT"; messageId: string; delta: string }
  | { type: "TEXT_MESSAGE_END"; messageId: string }

  // 工具调用类
  | { type: "TOOL_CALL_START"; toolCallId: string; toolName: string }
  | { type: "TOOL_CALL_ARGS"; toolCallId: string; delta: string }      // 流式参数
  | { type: "TOOL_CALL_END"; toolCallId: string }

  // 状态管理类
  | { type: "STATE_SNAPSHOT"; snapshot: Record<string, unknown> }
  | { type: "STATE_DELTA"; delta: JSONPatchOperation[] }               // RFC 6902

  // 消息管理类
  | { type: "MESSAGES_SNAPSHOT"; messages: Message[] }

  // 生命周期类
  | { type: "RUN_STARTED"; threadId: string; runId: string }
  | { type: "RUN_FINISHED"; threadId: string; runId: string }
  | { type: "RUN_ERROR"; message: string; code?: string }

  // 原始数据类（调试）
  | { type: "RAW"; event: unknown };
```

### 2.3 AG-UI 传输层

AG-UI 支持两种传输方式：

**方式 1：HTTP Streaming（推荐）**

```
POST /agent/run
Content-Type: application/json

{
  "threadId": "thread-123",
  "runId": "run-456",
  "messages": [...],
  "state": {...},
  "tools": [...]
}

Response: text/event-stream
data: {"type":"RUN_STARTED","threadId":"thread-123","runId":"run-456"}
data: {"type":"TEXT_MESSAGE_START","messageId":"msg-1","role":"assistant"}
data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"msg-1","delta":"我正在"}
data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"msg-1","delta":"分析您的需求..."}
data: {"type":"TOOL_CALL_START","toolCallId":"tc-1","toolName":"search_web"}
data: {"type":"TOOL_CALL_ARGS","toolCallId":"tc-1","delta":"{\"query\":"}
data: {"type":"TOOL_CALL_ARGS","toolCallId":"tc-1","delta":"\"AI 协议 2025\"}"}
data: {"type":"TOOL_CALL_END","toolCallId":"tc-1"}
data: {"type":"RUN_FINISHED","threadId":"thread-123","runId":"run-456"}
```

**方式 2：WebSocket（低延迟场景）**

```javascript
const ws = new WebSocket("wss://agent.example.com/ws");
ws.onmessage = (event) => {
  const agEvent = JSON.parse(event.data);
  handleAGUIEvent(agEvent);
};
```

### 2.4 AG-UI 状态同步机制

AG-UI 最独特的设计是**双向状态同步**——Agent 的内部状态可以实时投影到 UI：

```
Agent State (Python dict)        →  STATE_SNAPSHOT / STATE_DELTA  →  UI State (React store)

{                                                                    {
  "currentTask": "research",          ─────────────────────────>      currentTask: "research",
  "progress": 0.35,                                                    progress: 0.35,
  "sources": ["arxiv.org", ...]                                        sources: [...]
}                                                                    }
```

**JSON Patch 增量更新（减少传输量）**：

```json
// STATE_DELTA 事件 payload (RFC 6902 JSON Patch)
[
  { "op": "replace", "path": "/progress", "value": 0.67 },
  { "op": "add", "path": "/sources/-", "value": "nature.com" }
]
```

### 2.5 AG-UI 适配器生态

| 框架/平台 | AG-UI 适配器 | 状态 |
|-----------|-------------|------|
| LangGraph | `@ag-ui/langgraph` | 官方支持 |
| OpenAI Agents SDK | `@ag-ui/openai-agents` | 官方支持 |
| CrewAI | `@ag-ui/crewai` | 社区维护 |
| AutoGen | `@ag-ui/autogen` | 社区维护 |
| CopilotKit | 原生支持 | 内置 |
| Custom HTTP | `AbstractAgent` 基类 | 自行实现 |

### 2.6 前端消费 AG-UI 事件

```typescript
import { useCoAgent } from "@copilotkit/react-core";

function AgentUI() {
  const { state, messages, isRunning } = useCoAgent({
    name: "research_agent",
    endpoint: "https://api.example.com/agent",
  });

  return (
    <div>
      {/* 实时状态展示 */}
      <ProgressBar value={state.progress} />
      <TaskLabel>{state.currentTask}</TaskLabel>

      {/* 消息流 */}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role}>
          {msg.content}
        </MessageBubble>
      ))}

      {/* 工具调用展示 */}
      {isRunning && <ThinkingIndicator />}
    </div>
  );
}
```

---

## 3. ACP：Agent 通信协议（IBM/BeeAI）

### 3.1 协议概述

**ACP（Agent Communication Protocol）** 是 IBM Research 与 BeeAI 框架联合主导的开放标准，2025 年 4 月进入 Linux Foundation AI & Data Foundation 孵化阶段。

**核心定位**：使 AI Agent 可以像**微服务**一样被注册、发现、调用——REST-native、无需专有 SDK。

**与 A2A 的关键区别**：

| 维度 | ACP | A2A |
|------|-----|-----|
| 通信模型 | 同步 + 异步 | 任务委托（流式） |
| 服务发现 | 内建 Registry | Agent Card（手动） |
| 传输协议 | REST/HTTP | HTTP + SSE |
| 设计重心 | 企业 Agent 微服务 | 跨 Agent 任务协作 |
| 主导方 | IBM/BeeAI | Google |
| 身份认证 | OAuth 2.0 / API Key | mTLS / OAuth 2.1 |

### 3.2 ACP 核心概念

**Agent 描述符（Agent Descriptor）**

ACP 中每个 Agent 都有一个标准化的 JSON 描述符，类似 OpenAPI spec：

```json
{
  "name": "document-summarizer",
  "version": "1.2.0",
  "description": "将长文档压缩为结构化摘要",
  "metadata": {
    "author": "acme-corp",
    "license": "MIT",
    "tags": ["nlp", "summarization", "document-processing"]
  },
  "runs": [
    {
      "name": "summarize",
      "description": "对单个文档生成摘要",
      "input": {
        "schema": {
          "type": "object",
          "properties": {
            "document": { "type": "string", "description": "待摘要的文档文本" },
            "max_length": { "type": "integer", "default": 500 },
            "language": { "type": "string", "enum": ["zh", "en"], "default": "zh" }
          },
          "required": ["document"]
        }
      },
      "output": {
        "schema": {
          "type": "object",
          "properties": {
            "summary": { "type": "string" },
            "key_points": { "type": "array", "items": { "type": "string" } },
            "word_count": { "type": "integer" }
          }
        }
      }
    }
  ]
}
```

### 3.3 ACP API 端点规范

ACP 定义了标准的 REST 端点集合：

```
GET  /agents                          # 列出所有可用 Agent
GET  /agents/{agent_name}             # 获取 Agent 详情
POST /agents/{agent_name}/runs        # 创建新的运行实例（同步）
POST /agents/{agent_name}/runs/async  # 创建异步运行实例
GET  /agents/{agent_name}/runs/{run_id}       # 查询运行状态
GET  /agents/{agent_name}/runs/{run_id}/await  # 等待完成（长轮询）
DELETE /agents/{agent_name}/runs/{run_id}      # 取消运行
```

### 3.4 ACP 同步调用示例

```python
import httpx

# 同步调用 Agent
response = httpx.post(
    "https://registry.example.com/agents/document-summarizer/runs",
    json={
        "input": [
            {
                "parts": [
                    {
                        "content": "这是需要摘要的长文档内容...",
                        "content_type": "text/plain"
                    }
                ]
            }
        ]
    },
    headers={"Authorization": "Bearer <token>"}
)

result = response.json()
print(result["output"][0]["parts"][0]["content"])
```

### 3.5 ACP 异步调用示例

```python
import asyncio
import httpx

async def invoke_agent_async(agent_name: str, input_text: str):
    async with httpx.AsyncClient() as client:
        # 1. 提交异步任务
        create_resp = await client.post(
            f"https://registry.example.com/agents/{agent_name}/runs/async",
            json={
                "input": [{"parts": [{"content": input_text, "content_type": "text/plain"}]}]
            }
        )
        run = create_resp.json()
        run_id = run["run_id"]

        # 2. 轮询等待完成
        while True:
            await asyncio.sleep(1)
            status_resp = await client.get(
                f"https://registry.example.com/agents/{agent_name}/runs/{run_id}"
            )
            status = status_resp.json()

            if status["status"] == "completed":
                return status["output"]
            elif status["status"] == "failed":
                raise RuntimeError(f"Agent run failed: {status.get('error')}")
```

### 3.6 BeeAI 中的 ACP 实现

BeeAI 是 IBM 开源的 Agent 框架，原生支持 ACP：

```python
from beeai import Agent, tool
from beeai.adapters.acp import ACPServer

# 定义 Agent
class SummarizerAgent(Agent):
    name = "document-summarizer"
    description = "将长文档压缩为结构化摘要"

    @tool
    async def summarize(self, document: str, max_length: int = 500) -> dict:
        """对文档生成结构化摘要"""
        # Agent 核心逻辑
        result = await self.llm.generate(
            f"请将以下文档总结为不超过{max_length}字的摘要:\n\n{document}"
        )
        return {
            "summary": result.text,
            "word_count": len(result.text)
        }

# 以 ACP 服务方式暴露
server = ACPServer(agents=[SummarizerAgent()])
server.run(host="0.0.0.0", port=8080)
```

### 3.7 ACP Registry（服务发现）

```yaml
# docker-compose.yml - ACP Registry 部署
services:
  acp-registry:
    image: ibm/acp-registry:latest
    ports:
      - "8080:8080"
    environment:
      AUTH_MODE: "api_key"
      STORAGE_BACKEND: "postgres"
    volumes:
      - ./acp-config.yaml:/app/config.yaml

  document-summarizer:
    image: acme/document-summarizer:1.2.0
    environment:
      ACP_REGISTRY_URL: "http://acp-registry:8080"
      ACP_AUTO_REGISTER: "true"  # 启动时自动注册
```

---

## 4. 协议对比与选型指南

### 4.1 四大协议完整对比

| 维度 | MCP | A2A | AG-UI | ACP |
|------|-----|-----|-------|-----|
| **解决场景** | Agent↔工具 | Agent↔Agent | Agent↔用户界面 | Agent 微服务化 |
| **传输层** | JSON-RPC/SSE | HTTP+SSE | SSE/WS | REST/HTTP |
| **状态管理** | 无状态 | 任务状态 | 双向状态同步 | 运行状态 |
| **流式支持** | 部分 | 原生支持 | 核心特性 | 异步轮询 |
| **服务发现** | 手动配置 | Agent Card | 端点约定 | 内建 Registry |
| **身份认证** | OAuth/API Key | mTLS/OAuth 2.1 | Bearer Token | OAuth 2.0 |
| **主要用户** | 工具集成商 | 多 Agent 系统 | 前端开发者 | 企业 IT |
| **成熟度** | GA (v1.0) | GA (v1.0) | Beta (v0.9) | Beta (v0.8) |
| **GitHub Stars** | 20k+ | 8k+ | 3k+ | 1k+ |

### 4.2 选型决策树

```
你需要什么？
│
├── 让 Agent 调用外部工具/API/数据库
│   └── → 使用 MCP
│
├── 多个 Agent 协作完成任务
│   └── → 使用 A2A
│
├── Agent 推理过程实时呈现在 UI
│   └── → 使用 AG-UI
│
└── 企业内部 Agent 作为微服务被调用
    └── → 使用 ACP
```

### 4.3 典型组合方案

**方案 A：前端实时 Agent（AG-UI + MCP）**

```
用户界面 ←[AG-UI流]← Agent ←[MCP]← 工具服务器
```
适合：ChatGPT 类应用、代码助手、研究助手

**方案 B：企业多 Agent 系统（A2A + ACP + MCP）**

```
编排 Agent ←[A2A]→ 子 Agent（ACP 注册） ←[MCP]→ 工具
     ↓ AG-UI
  用户仪表板
```
适合：企业工作流自动化、客服系统

**方案 C：纯后台 Agent 管道（ACP + MCP）**

```
触发器 → ACP 调用 → Agent → MCP 工具 → 结果写入
```
适合：定时批处理、数据管道、报告生成

---

## 5. 实战：AG-UI 集成示例

### 5.1 LangGraph Agent 集成 AG-UI

```python
# backend/agent.py
from langgraph.graph import StateGraph, END
from ag_ui.encoder import EventEncoder
from ag_ui.types import (
    RunStartedEvent, TextMessageStartEvent, TextMessageContentEvent,
    TextMessageEndEvent, ToolCallStartEvent, ToolCallEndEvent,
    RunFinishedEvent, StateSnapshotEvent
)
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

class AgentState(TypedDict):
    messages: list
    current_task: str
    progress: float

def build_agent():
    graph = StateGraph(AgentState)
    graph.add_node("think", think_node)
    graph.add_node("act", act_node)
    graph.add_edge("think", "act")
    graph.add_edge("act", END)
    return graph.compile()

@app.post("/agent/run")
async def run_agent(request: RunAgentInput):
    async def event_stream():
        encoder = EventEncoder()

        # 发送运行开始事件
        yield encoder.encode(RunStartedEvent(
            type="RUN_STARTED",
            thread_id=request.thread_id,
            run_id=request.run_id
        ))

        # 发送初始状态快照
        yield encoder.encode(StateSnapshotEvent(
            type="STATE_SNAPSHOT",
            snapshot={"current_task": "initializing", "progress": 0.0}
        ))

        # 流式执行 Agent
        agent = build_agent()
        async for event in agent.astream_events(
            {"messages": request.messages},
            version="v2"
        ):
            if event["event"] == "on_chat_model_stream":
                # 转换为 AG-UI 文本事件
                yield encoder.encode(TextMessageContentEvent(
                    type="TEXT_MESSAGE_CONTENT",
                    message_id="msg-1",
                    delta=event["data"]["chunk"].content
                ))
            elif event["event"] == "on_tool_start":
                yield encoder.encode(ToolCallStartEvent(
                    type="TOOL_CALL_START",
                    tool_call_id=event["run_id"],
                    tool_name=event["name"]
                ))

        yield encoder.encode(RunFinishedEvent(
            type="RUN_FINISHED",
            thread_id=request.thread_id,
            run_id=request.run_id
        ))

    return StreamingResponse(event_stream(), media_type="text/event-stream")
```

### 5.2 React 前端消费

```tsx
// frontend/AgentChat.tsx
import { CopilotKit, useCoAgent } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";

interface AgentState {
  currentTask: string;
  progress: number;
}

function AgentStatus() {
  const { state } = useCoAgent<AgentState>({
    name: "research_agent",
  });

  return (
    <div className="agent-status">
      <div>当前任务: {state?.currentTask}</div>
      <progress value={state?.progress} max={1} />
    </div>
  );
}

export default function App() {
  return (
    <CopilotKit runtimeUrl="http://localhost:8000/agent/run">
      <AgentStatus />
      <CopilotChat
        instructions="你是一个研究助手，帮助用户分析和总结信息"
        labels={{ title: "AI 研究助手", initial: "你好！有什么我可以帮你研究的？" }}
      />
    </CopilotKit>
  );
}
```

---

## 6. 实战：ACP 多 Agent 服务注册

### 6.1 Python ACP Agent 服务

```python
# agent_service.py
from acp_sdk import Agent, Message, MessagePart
from acp_sdk.server import Server

class TranslationAgent(Agent):
    name = "translator"
    description = "多语言翻译 Agent"

    async def run(self, input: list[Message]) -> list[Message]:
        # 提取输入文本
        text = input[0].parts[0].content
        target_lang = "en"  # 从 metadata 读取

        # 执行翻译（伪代码）
        translated = await self.translate(text, target_lang)

        return [
            Message(parts=[
                MessagePart(
                    content=translated,
                    content_type="text/plain"
                )
            ])
        ]

# 启动 ACP 服务
server = Server()
server.register(TranslationAgent())
server.run(port=8080)
```

### 6.2 ACP 客户端调用

```python
# client.py
from acp_sdk.client import ACPClient

async def translate_text(text: str) -> str:
    async with ACPClient("http://localhost:8080") as client:
        # 发现可用 Agent
        agents = await client.list_agents()
        print(f"可用 Agents: {[a.name for a in agents]}")

        # 同步调用
        run = await client.run_sync(
            agent="translator",
            input=[{"parts": [{"content": text, "content_type": "text/plain"}]}]
        )
        return run.output[0]["parts"][0]["content"]

# 异步调用
async def translate_async(text: str) -> str:
    async with ACPClient("http://localhost:8080") as client:
        run = await client.run_async(
            agent="translator",
            input=[{"parts": [{"content": text, "content_type": "text/plain"}]}]
        )
        # 等待完成
        completed = await client.await_run(run.run_id, agent="translator")
        return completed.output[0]["parts"][0]["content"]
```

---

## 7. 四协议组合架构

### 7.1 企业级 Agent 系统参考架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                     企业 Agent 系统 2025                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  用户界面层                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  React / Vue App  ←──── AG-UI Events ────  Agent Gateway   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  编排层                       ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Orchestrator Agent                                         │   │
│  │  - 理解用户意图                                              │   │
│  │  - 分解为子任务                                              │   │
│  │  - 委托给专业 Agent                                          │   │
│  └──────────┬─────────────────────┬──────────────────────────┘   │
│      A2A ↓  │            ACP ↓    │                               │
│  ┌──────────▼───────┐   ┌─────────▼──────────┐                   │
│  │  Research Agent  │   │  Document Agent     │                   │
│  │  (A2A 委托)       │   │  (ACP 微服务)        │                   │
│  └──────────────────┘   └────────────────────┘                   │
│        │ MCP                    │ MCP                              │
│  ┌─────▼────────────────────────▼────────────────────────────┐    │
│  │  工具服务器：Web Search | PDF Reader | Database | Email    │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 协议选用总结

| 你在构建什么 | 推荐协议组合 |
|-------------|-------------|
| 聊天机器人 + 实时思考展示 | AG-UI + MCP |
| 多 Agent 企业工作流 | A2A + MCP + AG-UI |
| Agent 微服务平台 | ACP + MCP |
| 全栈企业 AI 系统 | AG-UI + A2A + ACP + MCP |
| 简单 LLM 工具调用 | 仅 MCP |

---

## 相关文档

- [[15_智能体/16_Agent_Protocols/A2A_Protocol_Deep_Dive|A2A Protocol 深度解读]]
- [[15_智能体/01_Agent_Foundations/MCP_Implementation_Guide|MCP 实现指南]]
- [[15_智能体/01_Agent_Foundations/Agent_Protocols_2026|Agent 协议栈 2026 完全指南]]
- [[15_智能体/02_Agent_Frameworks/OpenAI_Agents_SDK_Deep_Dive|OpenAI Agents SDK 深度解读]]
