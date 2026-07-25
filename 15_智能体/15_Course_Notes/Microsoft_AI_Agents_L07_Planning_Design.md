---
title: "L07 规划设计模式：任务分解、结构化输出与迭代重规划"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - planning
  - task-decomposition
  - structured-output
  - multi-agent-orchestration
  - magentic-one
sources:
  - "原始/github-sources/ai-agents-for-beginners/07-planning-design/README.md"
summary: "Microsoft AI Agents 课程第7课：把复杂目标拆解为子任务、用 Pydantic 生成可路由的结构化规划、Planner-Agent 编排模式，以及 Magentic-One 风格的迭代重规划。"
provenance:
  extracted: 0.84
  inferred: 0.13
  ambiguous: 0.03
base_confidence: 0.82
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Microsoft Ai Agents L07 Planning Design"
  - "Microsoft AI Agents L07 Planning Design"
  - Microsoft_AI_Agents_L07_Planning_Design

---
# L07 规划设计模式：任务分解、结构化输出与迭代重规划

> 来源：[Microsoft AI Agents for Beginners / 07-planning-design](https://github.com/microsoft/ai-agents-for-beginners/tree/main/07-planning-design)

## 学习目标

完成本课后，你将能够：

- 为 Agent 设定清晰的总体目标
- 将复杂任务分解为可管理的子任务并组织为逻辑序列
- 为子任务匹配合适工具、处理意外情况
- 评估子任务结果并迭代改进

---

## 一、目标设定与任务分解

真实任务很少能一步完成。Agent 需要一个**简洁而清晰的目标**引导规划——越清晰，Agent 与人越能对齐。

**示例**：`Generate a 3-day travel itinerary.`

虽简短，但需细化。分解后：

| 子任务 | 由谁执行 |
|--------|----------|
| Flight Booking | Flight Agent |
| Hotel Booking | Hotel Agent |
| Car Rental | Car Agent |
| Personalization | Personalization Agent |

模块化分解的好处：
1. 每个 Agent 专精一类任务
2. 协调 Agent（downstream）汇总成最终行程
3. 可增量添加新 Agent（Food / Activities）而不破坏现有结构

---

## 二、结构化输出（Structured Output）

LLM 生成 JSON 比 Free-form text 更易被下游 Agent/服务消费。**Pydantic 是 Microsoft Agent Framework 路由的常用载体** ^[inferred]：

```python
from pydantic import BaseModel
from enum import Enum
from typing import List

class AgentEnum(str, Enum):
    FlightBooking = "flight_booking"
    HotelBooking = "hotel_booking"
    CarRental = "car_rental"
    ActivitiesBooking = "activities_booking"
    DestinationInfo = "destination_info"
    DefaultAgent = "default_agent"
    GroupChatManager = "group_chat_manager"

class TravelSubTask(BaseModel):
    task_details: str
    assigned_agent: AgentEnum

class TravelPlan(BaseModel):
    main_task: str
    subtasks: List[TravelSubTask]
    is_greeting: bool
```

Planner Agent 的 system prompt：

```text
You are a planner agent.
Your job is to decide which agents to run based on the user's request.
Below are the available agents specialized in different tasks:
- FlightBooking: For booking flights and providing flight information
- HotelBooking: For booking hotels and providing hotel information
- CarRental: For booking cars and providing car rental information
...
```

LLM 输出示例：

```json
{
  "is_greeting": "False",
  "main_task": "Plan a family trip from Singapore to Melbourne.",
  "subtasks": [
    {"assigned_agent": "flight_booking", "task_details": "Book round-trip flights from Singapore to Melbourne."},
    {"assigned_agent": "hotel_booking", "task_details": "Find family-friendly hotels in Melbourne."},
    {"assigned_agent": "car_rental", "task_details": "Arrange a car rental suitable for a family of four."},
    {"assigned_agent": "activities_booking", "task_details": "List family-friendly activities in Melbourne."},
    {"assigned_agent": "destination_info", "task_details": "Provide information about Melbourne as a travel destination."}
  ]
}
```

---

## 三、Planning Agent + Multi-Agent 编排四步

1. **Semantic Router Agent** 接收用户请求
2. Planner 基于系统提示（含可用 agent 详情）生成结构化 travel plan
3. 根据 subtask 数量决定路由：
   - 单任务 → 直接送专用 Agent
   - 多任务 → 经 **GroupChatManager** 协调多 Agent 协作
4. Planner 汇总最终结果给用户

---

## 四、迭代重规划（Iterative Planning）

有些任务需要往返规划——一个 subtask 的结果会影响下一个：

- Agent 在订机票时发现意外的日期格式 → 必须调整后续酒店预订策略
- 用户反馈"想更早的航班" → 触发部分重规划

```python
response = client.create_response(
    input=user_message,
    instructions=system_prompt,
    context=f"Previous travel plan - {TravelPlan}",   # 把旧 plan 作为上下文
)
```

这种动态迭代确保最终方案贴合真实约束与用户偏好。

---

## 五、参考实现：Magentic-One

[Magentic-One](https://www.microsoft.com/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks) 是 Microsoft Research 的通用多 Agent 系统，在多个 Agentic benchmark 上表现出色：

- Orchestrator 创建**任务级** plan 并委派给可用 agent
- 同时拥有**进度追踪机制**，必要时重新规划
- 是 Planner 模式的工业级参考实现 ^[inferred]

---

## 与其他课的衔接

- 本课的 Planner 输出会触发 [[智能体/Course_Notes/Microsoft_AI_Agents_L08_Multi_Agent]] 中的多 Agent 协作
- 与 [[智能体/Agentic_Design_Patterns_AndrewNg]] 中 Andrew Ng 的 Planning 模式互为补充：本课侧重**结构化输出 + 路由**，Ng 模式侧重**Reflection + ReAct** ^[inferred]

---

## 关联阅读

- [[智能体/Course_Notes/Microsoft_AI_Agents_L06_Trustworthy_Agents]] — 上一课：可信 Agent
- [[智能体/Course_Notes/Microsoft_AI_Agents_L08_Multi_Agent]] — 下一课：多 Agent 设计
- [[智能体/Agentic_Design_Patterns_AndrewNg]] — Andrew Ng 的 Planning 模式
- [[智能体/Agent_Workflow/README]] — 工作流编排概览
- [[学习/courses/microsoft/microsoft_ai_agents_for_beginners]] — 课程总览

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*
