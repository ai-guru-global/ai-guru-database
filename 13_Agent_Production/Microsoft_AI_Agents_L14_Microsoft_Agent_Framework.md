---
title: "L14 Microsoft Agent Framework 深度：Agents / Threads / Middleware / Workflows"
category: "13-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - microsoft-agent-framework
  - maf
  - workflows
  - middleware
  - observability
sources:
  - "_raw/github-sources/ai-agents-for-beginners/14-microsoft-agent-framework/README.md"
summary: "Microsoft AI Agents 课程第14课：MAF 是微软统一 Agent 框架,覆盖 Sequential/Concurrent/GroupChat/Handoff/Magentic 五大编排,以及 Observability/Security/Durability/Control 四大生产特性。深度解析 Agents/Threads/Middleware/Memory/Workflows 核心概念。"
provenance:
  extracted: 0.88
  inferred: 0.10
  ambiguous: 0.02
base_confidence: 0.86
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
---

# L14 Microsoft Agent Framework 深度

> 来源：[Microsoft AI Agents for Beginners / 14-microsoft-agent-framework](https://github.com/microsoft/ai-agents-for-beginners/tree/main/14-microsoft-agent-framework)

## 学习目标

完成本课后，你将能够：

- 用 Microsoft Agent Framework 构建生产级 AI Agent
- 应用 MAF 核心特性到 Agentic 用例
- 使用 workflows / middleware / observability 等高级模式

---

## 一、MAF 是什么

[Microsoft Agent Framework (MAF)](https://aka.ms/ai-agents-beginners/agent-framework) 是微软构建 AI Agent 的**统一框架**，覆盖从研究到生产的各种 Agentic 用例。

### 五大编排模式

| 模式 | 适用场景 |
|------|----------|
| **Sequential** | 逐步工作流 |
| **Concurrent** | 多 Agent 同时完成不同任务 |
| **Group Chat** | 多 Agent 协作同一任务 |
| **Handoff** | Agent 间按子任务完成度移交 |
| **Magentic** | Manager Agent 创建/修改任务列表,协调子 Agent |

### 四大生产特性

| 特性 | 实现 |
|------|------|
| **Observability** | OpenTelemetry 原生集成；Microsoft Foundry dashboards |
| **Security** | Foundry 托管：RBAC、隐私数据处理、内建内容安全 |
| **Durability** | Agent threads/workflows 可暂停、恢复、容错——支持长流程 |
| **Control** | Human-in-the-loop 工作流；任务可标记需人工审批 |

### 互操作性

- **Cloud-agnostic** —— 容器、本地、多云
- **Provider-agnostic** —— Azure OpenAI / OpenAI / 任意 SDK
- **Open Standards** —— A2A + MCP 协议
- **Plugin & Connectors** —— Microsoft Fabric / SharePoint / Pinecone / Qdrant

---

## 二、核心概念一：Agents

### 创建 Agent（多种 LLM Provider）

```python
# Azure OpenAI
agent = AzureOpenAIChatClient(credential=AzureCliCredential()).create_agent(
    instructions="You recommend trips based on preferences.",
    name="TripRecommender"
)

# Microsoft Foundry Agent Service
async with AzureAIAgentClient(async_credential=credential).create_agent(
    name="HelperAgent", instructions="You are a helpful assistant."
) as agent: ...

# OpenAI Responses / ChatCompletion
agent = OpenAIResponsesClient().create_agent(name="WeatherBot", instructions="...")
agent = OpenAIChatClient().create_agent(name="HelpfulAssistant", instructions="...")

# MiniMax（OpenAI-compatible, 204K context）
agent = OpenAIChatClient(
    base_url="https://api.minimax.io/v1",
    api_key=os.environ["MINIMAX_API_KEY"],
    model_id="MiniMax-M2.7"
).create_agent(name="HelpfulAssistant", instructions="...")

# 远程 Agent（A2A 协议）
agent = A2AAgent(name=card.name, description=card.description,
                 agent_card=card, url="https://your-a2a-host")
```

### 运行 Agent

```python
# 非流式
result = await agent.run("What are good places to visit in Amsterdam?")
print(result.text)

# 流式
async for update in agent.run_stream("..."):
    if update.text: print(update.text, end="", flush=True)
```

`.run()` 支持自定义 `max_tokens` / `tools` / `model`——按任务灵活切模型。

### Tools（工具）

```python
def get_attractions(
    location: Annotated[str, Field(description="The location")]
) -> str:
    return f"Top attractions for {location}..."

# 创建时绑定
agent = ChatAgent(chat_client=OpenAIChatClient(),
                  instructions="...", tools=[get_attractions])

# 或运行时绑定（仅本次）
result = await agent.run("...", tools=[get_attractions])
```

---

## 三、核心概念二：Agent Threads（多轮对话）

```python
# 创建持久线程
thread = agent.get_new_thread()
response = await agent.run("Hello, where would you like to go?", thread=thread)

# 序列化 → 跨会话存储
serialized = await thread.serialize()
resumed  = await agent.deserialize_thread(serialized)
```

线程既可会话内临时使用，也可序列化长期保存。

---

## 四、核心概念三：Agent Middleware（中间件）

中间件让 Agent 在 **LLM ↔ Tool** 之间插入自定义逻辑。

### Function Middleware（函数中间件）

在 Agent 调用工具前后注入逻辑（如日志）：

```python
async def logging_function_middleware(
    context: FunctionInvocationContext,
    next: Callable[[FunctionInvocationContext], Awaitable[None]],
) -> None:
    print(f"[Function] Calling {context.function.name}")
    await next(context)   # 调用下一个中间件或真正函数
    print(f"[Function] {context.function.name} completed")
```

### Chat Middleware（聊天中间件）

在 Agent ↔ LLM 请求之间注入逻辑（如 message 监控）：

```python
async def logging_chat_middleware(context: ChatContext, next):
    print(f"[Chat] Sending {len(context.messages)} messages to AI")
    await next(context)
    print("[Chat] AI response received")
```

---

## 五、核心概念四：Agent Memory（记忆）

三种实现（详见 [[13_Agent_Production/Microsoft_AI_Agents_L13_Agent_Memory]]）：

| 类型 | 用途 | API |
|------|------|-----|
| **In-Memory Storage** | 单次会话内的 thread 存储 | `agent.get_new_thread()` |
| **Persistent Messages** | 跨会话保存对话历史 | `chat_message_store_factory` |
| **Dynamic Memory** | 运行前注入 context，来自外部服务（如 Mem0） | `context_providers=Mem0Provider(...)` |

---

## 六、核心概念五：Workflows（工作流）

工作流 = 预定义步骤 + 多 Agent 编排 + checkpointing。

### 三大组件

| 组件 | 职责 |
|------|------|
| **Executors** | 接收输入、执行任务、产出输出；可以是 Agent 或自定义逻辑 |
| **Edges** | 定义消息流向（见下） |
| **Events** | 提供可观测性（`WorkflowStartedEvent`、`ExecutorInvokeEvent` 等） |

### 五种 Edge 类型

| 类型 | 行为 | 示例 |
|------|------|------|
| **Direct** | 1→1 简单连接 | `builder.add_edge(src, dst)` |
| **Conditional** | 满足条件才激活 | 酒店满房 → 推荐替代 |
| **Switch-case** | 按条件路由到不同 executor | VIP 客户走专属工作流 |
| **Fan-out** | 1 条消息 → 多目标 | 并行查询多家供应商 |
| **Fan-in** | 多源 → 1 目标 | 汇总多 Agent 结果 |

---

## 七、四大高级模式

1. **Middleware Composition** —— 串联 logging / auth / rate-limit
2. **Workflow Checkpointing** —— 用 events + serialization 保存长流程
3. **Dynamic Tool Selection** —— RAG over tool descriptions + MAF tool registration（呼应 [[13_Agent_Production/Microsoft_AI_Agents_L12_Context_Engineering]] 的 Tool Loadout Management）
4. **Multi-Agent Handoff** —— workflow edges + conditional routing 编排移交

---

## 与其他课的衔接

- 本课是 [[13_Agent_Production/Microsoft_AI_Agents_L00_Course_Setup]] 起所有课的"技术收口"——前面学的概念（Planner / Multi-Agent / Memory / Observability）都在 MAF 中有具体 API
- Workflows 的 Magentic 模式呼应 [[13_Agent_Production/Microsoft_AI_Agents_L07_Planning_Design]] 中的 Magentic-One
- 中间件 + Observability 是 [[13_Agent_Production/Microsoft_AI_Agents_L10_Production]] 的工程实现

---

## 关联阅读

- [[13_Agent_Production/Microsoft_AI_Agents_L13_Agent_Memory]] — 上一课：记忆
- [[13_Agent_Production/Microsoft_AI_Agents_L15_Browser_Use]] — 下一课：浏览器使用
- [[13_Agent_Production/Microsoft_AI_Agents_L02_Frameworks]] — L02：MAF 与其他框架选型对比
- [[13_Agent_Production/Agent_Frameworks/README]] — 主流 Agent 框架总览
- [[13_Agent_Production/Agent_Workflow/README]] — 工作流编排总览
- [[13_Agent_Production/Microsoft_AI_Agents_L10_Production]] — L10：可观测性（OTel）
- [[90_Learn/Microsoft_AI_Agents_for_Beginners]] — 课程总览
