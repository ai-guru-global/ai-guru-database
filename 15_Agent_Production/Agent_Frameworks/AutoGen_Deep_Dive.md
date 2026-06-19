---
title: "AutoGen: 微软多 Agent 框架"
category: "13-agent-production-agent-frameworks"
tags: ["ai-agents", "agent-framework", "production", "langgraph", "autogen"]
summary: "> **一句话理解**: AutoGen 是微软出品的对话式多 Agent 框架——通过自然对话让 Agent 协作，支持 Group Chat、Human-in-the-loop 和代码执行。"
created: "2026-05-31"
updated: "2026-05-31"
---

# AutoGen: 微软多 Agent 框架

> **一句话理解**: AutoGen 是微软出品的对话式多 Agent 框架——通过自然对话让 Agent 协作，支持 Group Chat、Human-in-the-loop 和代码执行。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [代码示例](#4-代码示例)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
AutoGen: 微软多 Agent 框架
═══════════════════════════════════════════════════════════════════

定位: 微软研究院出品的对话式多 Agent 框架，强调 Agent 间自然对话协作

核心理念:
───────────────────────────────────────────────────────────────────
• 对话驱动: Agent 通过自然对话协作
• Group Chat: 多 Agent 群聊模式
• Human-in-the-loop: 支持人类介入
• 代码执行: 内置代码生成和执行
• 多模式: 灵活的对话和任务模式
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **对话式协作** | Agent 间自然对话 |
| **Group Chat** | 多 Agent 群聊 |
| **Human Feedback** | 人类介入反馈 |
| **代码执行** | 代码生成和执行 |
| **多模型支持** | OpenAI、Azure、Local |
| **序列化** | 会话保存恢复 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| AutoGen 0.1 | 2023.5 | 首个版本，Microsoft Research |
| v0.2 | 2023.9 | Group Chat |
| v0.3 | 2024.1 | 代码执行增强 |
| v0.4 | 2024.5 | Human-in-the-loop |
| v0.5 | 2024.10 | 多模态支持 |
| v1.0 | 2025.3 | 生产稳定 |

---

## 2. 核心概念

### 2.1 Agent 类型

```
AutoGen Agent 类型
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      AutoGen Agent 架构                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Agent 基类                               │ │
│  │  ├── name: Agent 名称                                      │ │
│  │  ├── system_message: 系统提示                               │ │
│  │  ├── llm_config: LLM 配置                                  │ │
│  │  └── generate_reply(): 生成回复                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│         ▲                ▲                ▲                      │
│         │                │                │                      │
│  ┌──────┴──────┐   ┌──────┴──────┐   ┌──────┴──────┐           │
│  │AssistantAgent│   │UserProxy   │   │  GroupChat  │           │
│  │             │   │  Agent     │   │  Manager    │           │
│  │ 执行任务    │   │ 人类交互   │   │  群聊管理   │           │
│  └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Agent 类型对比

| Agent 类型 | 功能 | 典型用途 |
|------------|------|----------|
| **AssistantAgent** | 执行任务，生成代码 | 开发者、数据分析 |
| **UserProxyAgent** | 人类交互，执行代码 | 确认、审批、执行 |
| **GroupChatManager** | 管理群聊，消息路由 | 多 Agent 协作 |
| **BaseChatAgent** | 对话基类 | 自定义对话 Agent |

### 2.3 核心组件

```python
# AutoGen 核心组件

from autogen import (
    AssistantAgent,    # 助手 Agent
    UserProxyAgent,    # 用户代理
    GroupChat,        # 群聊
    GroupChatManager,  # 群聊管理器
    ConversableAgent,  # 可对话 Agent 基类
)
```

---

## 3. 架构设计

### 3.1 对话模式

```
AutoGen 对话模式
═══════════════════════════════════════════════════════════════════

模式 1: 两人对话
──────────────────────────────────────────────────────────────────

  UserProxyAgent              AssistantAgent
       │                           │
       │──── "写一段快排代码" ────→│
       │                           │
       │←─────── 代码回复 ─────────│
       │                           │
       │──── "解释一下" ──────────→│
       │←─────── 解释 ─────────────│

模式 2: Group Chat
──────────────────────────────────────────────────────────────────

        ┌──────────────────────────────────────────────────┐
        │                    GroupChat                      │
        │                                                   │
        │  Manager (自动路由)                               │
        │       ▲         ▲         ▲                       │
        │       │         │         │                       │
        │   ┌───┴───┐ ┌───┴───┐ ┌───┴───┐                 │
        │   │Agent1 │ │Agent2 │ │Agent3 │                 │
        │   │ (CEO) │ │ (CTO) │ │(CFO)  │                 │
        │   └───────┘ └───────┘ └───────┘                 │
        │                                                   │
        └──────────────────────────────────────────────────┘

模式 3: 层级对话
──────────────────────────────────────────────────────────────────

     Manager
        │
   ┌────┴────┐
   │         │
 Agent1    Agent2
   │
   └────┐
        │
    SubAgent1 SubAgent2
```

### 3.2 Group Chat 执行流程

```
Group Chat 执行流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Group Chat 执行                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  用户: "分析这家公司并给出投资建议"                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 1: 任务分解                                            │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ Manager 分析 → 需要: 财务分析、技术评估、市场洞察           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 2: Agent 协作                                          │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ CFO Agent: 分析财务数据，给出盈利能力评估                   │ │
│  │ CTO Agent: 评估技术实力，给出竞争力分析                    │ │
│  │ Market Agent: 分析市场地位，给出增长预测                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 3: Manager 综合                                        │ │
│  │ ────────────────────────────────────────────────────────   │ │
│  │ 整合所有 Agent 的分析，生成综合报告                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  最终输出: 投资建议报告                                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 代码示例

### 4.1 基础两人对话

```python
from autogen import AssistantAgent, UserProxyAgent

# 创建助手 Agent
assistant = AssistantAgent(
    name="assistant",
    system_message="你是一个有帮助的编程助手。",
    llm_config={
        "model": "gpt-4o",
        "temperature": 0.7,
    }
)

# 创建用户代理
user_proxy = UserProxyAgent(
    name="user",
    human_input_mode="NEVER",  # 始终自动执行
    code_execution_config={
        "work_dir": "coding",
        "use_docker": False,
    }
)

# 启动对话
user_proxy.initiate_chat(
    assistant,
    message="写一个 Python 函数，计算斐波那契数列"
)
```

### 4.2 代码执行和审查

```python
from autogen import AssistantAgent, UserProxyAgent

# 开发者 Agent
developer = AssistantAgent(
    name="developer",
    system_message="你是一个 Python 开发者，负责编写代码。",
)

# 审查者 Agent
reviewer = AssistantAgent(
    name="reviewer",
    system_message="你是一个代码审查员，负责检查代码质量和潜在问题。",
)

# 用户代理 (执行代码)
user_proxy = UserProxyAgent(
    name="user",
    code_execution_config={"work_dir": "project"}
)

# 多轮对话：开发 → 审查 → 修改
user_proxy.initiate_chat(
    developer,
    message="实现一个 LRU Cache"
)
```

### 4.3 Group Chat

```python
from autogen import (
    AssistantAgent,
    UserProxyAgent,
    GroupChat,
    GroupChatManager,
)

# 创建多个 Agent
ceo = AssistantAgent(
    name="CEO",
    system_message="你负责战略决策，协调团队工作。",
)

cto = AssistantAgent(
    name="CTO",
    system_message="你负责技术评估，提供技术见解。",
)

cfo = AssistantAgent(
    name="CFO",
    system_message="你负责财务分析，评估投资回报。",
)

# 用户代理
user = UserProxyAgent(name="user")

# 创建群聊
group_chat = GroupChat(
    agents=[ceo, cto, cfo, user],
    messages=[],
    max_round=10,
)

# 创建管理器
manager = GroupChatManager(groupchat=group_chat)

# 启动群聊
user.initiate_chat(
    manager,
    message="分析是否应该进入 AI Agent 市场，给出建议"
)
```

### 4.4 Human-in-the-loop

```python
from autogen import AssistantAgent, UserProxyAgent

# 开发者
developer = AssistantAgent(
    name="developer",
    system_message="你是一个开发工程师。",
)

# 用户代理 (需要人类确认)
human = UserProxyAgent(
    name="human",
    human_input_mode="ALWAYS",  # 总是等待人类输入
)

# 执行任务，人类可以介入
human.initiate_chat(
    developer,
    message="部署生产环境更新"
)
# → 人类会收到确认提示，可以批准或修改
```

---

## 5. 高级特性

### 5.1 消息传递控制

```python
# 控制消息传递
assistant = AssistantAgent(
    name="assistant",
    # 接收所有消息
    default_auto_reply="收到",
)

# 使用 `is_termination_msg` 控制结束
assistant = AssistantAgent(
    name="assistant",
    is_termination_msg=lambda msg: "完成" in msg.get("content", ""),
)
```

### 5.2 嵌套对话

```python
# Agent 可以召唤其他 Agent
master = AssistantAgent(
    name="master",
    system_message="你是项目负责人，可以调用专家Agent。",
)

# 在回复中调用其他 Agent
expert = AssistantAgent(name="expert", ...)

# 使用 initiate_chat 进行嵌套调用
master.initiate_chat(
    expert,
    message="解释量子计算原理"
)
```

### 5.3 序列化对话

```python
import json

# 保存对话
chat_history = user_proxy.chat_messages.get("assistant", [])

with open("chat_history.json", "w") as f:
    json.dump(chat_history, f, indent=2)

# 恢复对话
with open("chat_history.json", "r") as f:
    saved = json.load(f)
```

---

## 6. 对比与选择

### 6.1 与其他框架对比

| 维度 | AutoGen | CrewAI | LangGraph |
|------|---------|--------|-----------|
| **协作模式** | 对话式 | 角色+任务 | 状态机 |
| **灵活性** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **人类介入** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **复杂工作流** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **生产就绪** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 适用场景

**✅ AutoGen 最佳场景:**
- 需要人类确认的工作流
- 代码协作和审查
- 多角色讨论
- 复杂对话交互

**❌ 不适合场景:**
- 简单任务 (用 CrewAI)
- 复杂状态机 (用 LangGraph)
- 极简需求

---

## 参考资源

- [AutoGen GitHub](https://github.com/microsoft/autogen)
- [AutoGen 文档](https://microsoft.github.io/autogen/)
- [AutoGen 示例](https://github.com/microsoft/autogen/tree/main/notebook)

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026.md|Agent_Harness_Complete_2026]]
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026.md|Agent_Red_Teaming_2026]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow.md|Evaluation_Workflow]]
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment.md|Production_Assessment]]
- [[15_Agent_Production/Agent_Evaluation/Benchmarking/Benchmarking_Criteria.md|Benchmarking_Criteria]]
