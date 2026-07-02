---
title: "Letta (MemGPT Agent 框架)"
category: -concepts
tags: ["agent", "memory", "memgpt", "autonomous", "stateful", "long-context"]
relationships:
  - target: "_concepts/mem0"
    type: related_to
  - target: "_concepts/zep"
    type: related_to
  - target: "_concepts/langgraph"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "基于 MemGPT 论文开发的有状态 Agent 框架，通过分层记忆管理让 LLM 突破上下文窗口限制，实现自主式长期交互。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: stable
tier: supporting
---

# Letta (MemGPT)

[Letta](https://github.com/letta-ai/letta)（前身为 MemGPT）是一个基于 **MemGPT 论文**开发的有状态 Agent 框架。它的核心创新是将操作系统的**虚拟内存管理**思想应用到 LLM 上下文管理中——通过**分层记忆**（核心记忆/归档记忆/回忆搜索）让 Agent 能够突破上下文窗口限制，自主管理长期交互状态。

## 核心原理

### 虚拟内存 → LLM 记忆

```
操作系统虚拟内存:              Letta/MemGPT 记忆:

物理内存 (有限)    ←→  核心记忆 (Core Memory, 有限)
    ↓ page fault          ↓ self-edit
磁盘 (无限)       ←→  归档记忆 (Archival Memory, 无限)
                      回忆搜索 (Recall Memory)

Agent 在对话中自主决定:
1. 哪些信息保留在核心记忆 (始终在 Prompt 中)
2. 哪些信息归档到外部存储 (按需检索)
3. 何时检索归档记忆 (自主触发)
```

## 核心架构

```
Letta Agent 架构:

┌───────────────────────────────────┐
│          Letta Agent               │
│                                    │
│  ┌─────────────────────────────┐  │
│  │  System Prompt (固定)        │  │
│  ├─────────────────────────────┤  │
│  │  Core Memory (可编辑, 有限)   │  │  ← 始终在上下文中
│  │  - Persona (Agent 人设)      │  │
│  │  - Human (用户信息)          │  │
│  ├─────────────────────────────┤  │
│  │  Tool Definitions            │  │
│  │  - core_memory_append        │  │  ← Agent 自主调用
│  │  - core_memory_replace       │  │
│  │  - archival_memory_insert    │  │
│  │  - archival_memory_search    │  │
│  │  - conversation_search       │  │
│  ├─────────────────────────────┤  │
│  │  Archival Memory (无限)      │  │  ← 向量数据库
│  ├─────────────────────────────┤  │
│  │  Recall Memory (对话历史)    │  │  ← 全文搜索
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
```

## 核心特性

### 1. 自主记忆管理

```python
from letta import create_client

client = create_client()

# 创建有状态 Agent
agent_state = client.create_agent(
    name="assistant",
    system="You are a helpful assistant with long-term memory.",
    tools=["core_memory_append", "core_memory_replace",
           "archival_memory_insert", "archival_memory_search"]
)

# Agent 自主决定何时更新记忆
response = client.user_message(
    agent_id=agent_state.id,
    message="My name is Alice and I work at Google."
)
# Agent 内部自动执行:
# 1. core_memory_replace("Human", "Name: Alice, Company: Google")
# 2. archival_memory_insert("Alice works at Google as a software engineer")
```

### 2. 核心记忆编辑

```python
# Agent 的核心记忆状态:
# Core Memory:
# - Persona: "I am a helpful AI assistant."
# - Human: "Name: Alice, Company: Google, Preferences: Python, Rust"

# Agent 在对话中自主编辑核心记忆
# (通过 function calling 调用 memory tools)
response = client.user_message(
    agent_id=agent_state.id,
    message="I just got promoted to Tech Lead!"
)
# Agent 自动:
# core_memory_replace("Human", "..., Role: Tech Lead")
# archival_memory_insert("Alice was promoted to Tech Lead in 2026")
```

### 3. 归档记忆检索

```python
# 长期对话后，Agent 自主检索归档记忆
response = client.user_message(
    agent_id=agent_state.id,
    message="Remind me what we discussed about the project last month?"
)
# Agent 自动:
# archival_memory_search("project discussion", limit=5)
# → 检索到上月的对话记录，纳入上下文回答
```

### 4. 自定义工具

```python
# 为 Agent 添加自定义工具
from letta.schemas.tool import Tool

@client.tool
def search_codebase(query: str) -> str:
    """Search the codebase for relevant code"""
    # 自定义实现
    return results

# 注册到 Agent
client.add_tool(agent_state.id, search_codebase)
```

## 与标准 Agent 框架对比

| 维度 | Letta | LangGraph | AutoGen |
|------|-------|-----------|---------|
| **记忆管理** | 自主分层 | 手动配置 | 有限 |
| **上下文管理** | 自动分页 | 手动 | 无 |
| **长期交互** | 原生支持 | 需自建 | 需自建 |
| **状态持久** | ✅ | ✅ | 部分 |
| **Agent 自主性** | 高（自主编辑记忆） | 中 | 中 |
| **多 Agent** | 支持 | 核心能力 | 核心能力 |
| **论文基础** | MemGPT (2023) | — | — |

## 典型应用场景

- **长期对话助手**: 跨月/年的持续对话，保持上下文
- **个人知识管理**: Agent 自主积累和检索用户知识
- **代码助手**: 记住项目架构、代码风格、历史决策
- **研究助手**: 长期跟踪论文阅读和实验进展
- **游戏 NPC**: 具备持久记忆和自主行为的游戏角色

## 安装

```bash
pip install letta

# 启动服务
letta server
```

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: letta-server
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: letta
        image: letta/letta:latest
        ports:
        - containerPort: 8283
        env:
        - name: LETTA_PG_URI
          value: "postgresql://user:pass@postgres-svc:5432/letta"
---
apiVersion: v1
kind: Service
metadata:
  name: letta-svc
spec:
  selector:
    app: letta-server
  ports:
  - port: 8283
```

## 参考资源

- [Letta GitHub](https://github.com/letta-ai/letta)
- [MemGPT 论文](https://arxiv.org/abs/2310.08560)
- [Letta 文档](https://docs.letta.com/)

## 相关概念

- [[_concepts/mem0]] — Mem0 AI 记忆层基础设施
- [[_concepts/zep]] — Zep LLM 长期记忆平台
- [[_concepts/langgraph]] — LangGraph 有状态 Agent 编排
