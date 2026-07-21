---
title: "Agent-to-Agent Protocol (A2A)"
tags: [a2a-protocol, multi-agent, agent-protocols, mcp, collaboration]
created: 2026-06-17
updated: 2026-07-21
tier: core
aliases:
  - "A2a Protocol"
  - "a2a protocol"
category: -concepts
lifecycle: reviewed
relationships:
  - target: "概念/Agent/mcp"
    type: complements
  - target: "概念/Agent/multi-agent-orchestration"
    type: enables
sources:
  - "https://google.github.io/A2A/"
  - "https://github.com/google/A2A"
---

# Agent-to-Agent Protocol (A2A)

## 定义

Agent-to-Agent Protocol (A2A) 是 Google 于 2025 年 4 月发布的智能体互操作开放协议，用于标准化 Agent 与 Agent 之间的协作通信。如果说 MCP 是"AI 的 USB-C"（连接工具和数据），那么 A2A 是"AI 的 LinkedIn"——让不同来源的智能体能够发现彼此、协商任务、协同工作。

A2A 的核心设计哲学：
- **不透明执行**：Agent 无需暴露内部实现，只需通过协议交互
- **能力声明**：通过 Agent Card 自描述能力，支持动态发现
- **任务为中心**：所有交互围绕 Task 生命周期展开
- **多模态原生**：支持文本、图片、音频、视频等任意内容类型

## 核心机制

### 与 MCP 的定位分工

| 维度 | MCP (工具连接协议) | A2A (智能体互操作协议) |
|------|---------------------|------------------------|
| 连接对象 | AI 应用 ↔ 工具/数据源 | Agent ↔ Agent |
| 交互模式 | 调用-响应（函数调用） | 任务协商-执行-交付 |
| 状态管理 | 有状态会话 | 有状态任务（Task） |
| 发现机制 | 能力协商（initialize） | Agent Card（JSON 元数据） |
| 透明度 | Server 暴露内部结构 | Agent 不透明，黑箱协作 |
| 典型场景 | 查数据库、调 API、读文件 | 多 Agent 分工、跨组织协作 |

### 核心概念

#### 1. Agent Card（智能体名片）

每个 A2A Agent 通过 `/.well-known/agent.json` 发布能力描述：

```json
{
  "name": "Travel Planner Agent",
  "description": "规划多城市旅行行程",
  "url": "https://travel-agent.example.com/a2a",
  "version": "1.0.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "skills": [
    {
      "id": "plan-trip",
      "name": "行程规划",
      "description": "根据预算和偏好生成多日行程",
      "inputModes": ["text"],
      "outputModes": ["text", "image"]
    }
  ],
  "authentication": {
    "schemes": ["oauth2"]
  }
}
```

#### 2. Task（任务）生命周期

```
submitted → working → input-required → working → completed
                                              → failed
                                              → canceled
```

| 状态 | 含义 |
|------|------|
| `submitted` | 任务已提交，等待处理 |
| `working` | Agent 正在执行 |
| `input-required` | 需要额外信息（人类或上游 Agent） |
| `completed` | 成功完成，产出 Artifact |
| `failed` | 执行失败 |
| `canceled` | 被取消 |

#### 3. Message 与 Part

- **Message**：通信单元，包含 role（user/agent）和多个 Part
- **Part**：内容载体，支持 TextPart、FilePart、DataPart（结构化 JSON）

#### 4. Artifact（产出物）

任务完成后的交付物，可以是文档、代码、图片、结构化数据等。

### 通信流程

```
Client Agent                    Remote Agent
    │                                │
    │── GET /.well-known/agent.json ──▶│  (发现)
    │◀── Agent Card ────────────────│
    │                                │
    │── POST /tasks/send ───────────▶│  (发起任务)
    │◀── Task {status: working} ────│
    │                                │
    │◀── SSE: status update ────────│  (流式进度)
    │◀── SSE: artifact ─────────────│  (交付产出)
    │                                │
    │── POST /tasks/send (followup) ▶│  (追问/迭代)
    │◀── Task {status: completed} ──│
```

### 传输与认证

| 层级 | 方案 |
|------|------|
| 传输 | HTTP/HTTPS + JSON-RPC 2.0 |
| 流式 | Server-Sent Events (SSE) |
| 推送 | Webhook (pushNotification) |
| 认证 | OAuth 2.0 / API Key / mTLS |

## 实战：构建 A2A Agent

### Python 服务端示例

```python
from a2a.server import A2AServer, TaskHandler
from a2a.types import Task, Message, TextPart, Artifact

class TravelPlanner(TaskHandler):
    async def handle_task(self, task: Task) -> Task:
        user_msg = task.messages[-1].parts[0].text
        
        # 调用内部 LLM 规划行程
        itinerary = await self.llm.plan(user_msg)
        
        task.status = "completed"
        task.artifacts = [
            Artifact(
                name="itinerary",
                parts=[TextPart(text=itinerary)]
            )
        ]
        return task

server = A2AServer(handler=TravelPlanner(), port=8000)
server.run()
```

### 客户端调用示例

```python
from a2a.client import A2AClient

# 发现 Agent
client = A2AClient(url="https://travel-agent.example.com")
card = await client.get_agent_card()
print(f"发现 Agent: {card.name}, 技能: {[s.name for s in card.skills]}")

# 发起任务
task = await client.send_task(
    message=Message(
        role="user",
        parts=[TextPart(text="规划东京5日游，预算2万元")]
    )
)

# 等待完成
while task.status in ("submitted", "working"):
    await asyncio.sleep(1)
    task = await client.get_task(task.id)

print(task.artifacts[0].parts[0].text)
```

## 多 Agent 协作模式

### 典型编排拓扑

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **Supervisor** | 主 Agent 分配子任务给专业 Agent | 复杂任务分解 |
| **Pipeline** | Agent 串行处理，前一个输出是后一个输入 | 流水线工作流 |
| **Peer-to-Peer** | Agent 平等协商，无中心节点 | 对等协作 |
| **Hierarchical** | 多层 Supervisor 嵌套 | 大型组织模拟 |

### 与 MCP 协同使用

```
┌─────────────────────────────────────────┐
│         Orchestrator Agent              │
│  ┌─────────┐    ┌─────────────────┐  │
│  │MCP Client│    │  A2A Client     │  │
│  └────┬────┘    └───────┬─────────┘  │
└───────┼────────────────┼─────────────┘
        │                │
  ┌────▼────┐    ┌────▼──────────┐
  │MCP Server│    │Remote Agent(s)│
  │(DB/API) │    │(专业领域 Agent)│
  └─────────┘    └───────────────┘
```

一个 Agent 同时使用：
- **MCP** 连接工具和数据源（“手和眼”）
- **A2A** 与其他 Agent 协作（“社交网络”）

## 2026 生态与采纳

### 支持厂商

- **发起方**：Google (ADK, Gemini, Workspace)
- **早期采纳**：Salesforce、SAP、ServiceNow、MongoDB、LangChain、CrewAI
- **开源实现**：Python SDK、TypeScript SDK、Java SDK

### 与行业标准的关系

| 标准 | 关系 |
|------|------|
| MCP | 互补：MCP 管工具，A2A 管协作 |
| OpenAPI | A2A Agent 可暴露 OpenAPI 端点 |
| OAuth 2.0 | A2A 认证层复用 OAuth 标准 |
| ActivityPub | 概念相似（去中心化社交），但 A2A 面向任务 |

## 最佳实践

1. **Agent Card 完整性**：充分描述 skills、输入输出模式、认证要求
2. **任务粒度**：每个 Task 对应一个明确可交付的工作单元
3. **优雅降级**：`input-required` 状态用于主动请求补充信息，而非失败
4. **超时与重试**：客户端设置合理超时，支持幂等重试
5. **安全边界**：不信任远程 Agent 输出，验证 Artifact 内容
6. **可观测性**：记录 Task 全生命周期事件，支持追踪和审计

## Related

- [[概念/Agent/mcp|MCP]] — 工具连接协议，与 A2A 互补
- [[概念/Agent/multi-agent-orchestration|多 Agent 编排]] — A2A 赋能的协作模式
- [[概念/Agent/agent-framework|Agent 框架]] — A2A 的框架集成
- [[智能体/Agent_Protocols/MCP_Deep_Dive|MCP 深度解析]] — 协议对比参考
- [[概念/Agent/agentic-rag|Agentic RAG]] — 多 Agent 协作检索