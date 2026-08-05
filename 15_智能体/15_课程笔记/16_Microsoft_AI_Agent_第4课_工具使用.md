---
title: "L04 工具使用设计模式"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - tool-use
  - function-calling
  - tool-schema
  - trustworthy-agents
sources:
  - "原始/github-sources/ai-agents-for-beginners/04-tool-use/README.md"
summary: "Microsoft AI Agents 课程第4课：工具使用设计模式，涵盖函数 schema、调用循环、错误处理、状态管理，以及 MAF 与 Azure AI Agent Service 中的工具实现。"
provenance:
  extracted: 0.85
  inferred: 0.12
  ambiguous: 0.03
base_confidence: 0.82
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Microsoft Ai Agents L04 Tool Use"
  - "Microsoft AI Agents L04 Tool Use"
  - Microsoft_AI_Agents_L04_Tool_Use

name_zh: "L04 工具使用设计模式"
---
# L04 工具使用设计模式

> 中文简称：L04 工具使用设计模式

> 来源：[Microsoft AI Agents for Beginners / 04-tool-use](https://github.com/microsoft/ai-agents-for-beginners/tree/main/04-tool-use)

## 学习目标

完成本课后，你将能够：

- 定义工具使用设计模式及其目的
- 识别该模式适用的场景
- 理解实现该模式所需的关键元素
- 认识到使用该模式构建可信 Agent 时的注意事项

---

## 什么是工具使用设计模式

工具使用设计模式（Tool Use Design Pattern）的核心是：**让 LLM 能够调用外部工具来完成特定目标**。工具是可被 Agent 执行的代码，可以是简单函数（如计算器），也可以是第三方服务 API（如股票查询、天气预报）。

典型流程：

```
用户请求 → LLM → 工具选择 → 工具执行 → LLM（携带工具输出）→ 最终回复
```

---

## 适用场景

- **动态信息检索**：查询数据库、API 获取实时数据
- **代码执行与解释**：执行脚本解决数学问题、生成报告、运行模拟
- **工作流自动化**：集成任务调度、邮件服务、数据管道
- **客户支持**：连接 CRM、工单系统、知识库
- **内容生成与编辑**：语法检查、摘要、内容安全评估

---

## 关键构建块

| 构建块 | 说明 |
|--------|------|
| **函数/工具 Schema** | 工具的名称、用途、参数与期望输出的精确定义 |
| **函数执行逻辑** | 根据用户意图和对话上下文决定何时、如何调用工具 |
| **消息处理系统** | 管理用户输入、LLM 回复、工具调用与工具输出之间的对话流 |
| **工具集成框架** | 将 Agent 连接到简单函数或复杂外部服务的基础设施 |
| **错误处理与验证** | 处理工具执行失败、参数校验、异常响应 |
| **状态管理** | 追踪对话上下文、历史工具交互与持久化数据 |

---

## 函数调用（Function Calling）

函数调用是实现工具使用的主要方式。开发者需要：

1. 一个支持函数调用的 LLM
2. 包含函数描述的 Schema
3. 每个函数对应的实际代码

以查询当前时间为例，流程如下：

1. 创建 JSON Schema 描述 `get_current_time(location: str)`
2. 将 schema 与用户请求一起发送给 LLM
3. LLM 返回工具调用（tool call），包含函数名与参数
4. 代码执行函数，并将结果以 `role="tool"` 的消息返回 LLM
5. LLM 生成最终回复

---

## MAF 中的工具使用

MAF 通过 `@tool` 装饰器简化函数调用：

```python
from agent_framework import tool
from agent_framework.azure import AzureAIProjectAgentProvider
from azure.identity import AzureCliCredential

@tool
def get_current_time(location: str) -> str:
    """Get the current time for a given location"""
    ...

provider = AzureAIProjectAgentProvider(credential=AzureCliCredential())
agent = await provider.create_agent(
    name="TimeAgent",
    instructions="Use available tools to answer questions.",
    tools=[get_current_time],
)
response = await agent.run("What time is it in San Francisco?")
```

MAF 自动处理函数序列化、schema 生成与工具调用循环。

---

## Azure AI Agent Service 中的工具

Agent Service 将工具分为两类：

| 类别 | 工具 |
|------|------|
| **知识工具** | Grounding with Bing Search、File Search、Azure AI Search |
| **动作工具** | Function Calling、Code Interpreter、OpenAPI 定义工具、Azure Functions |

可通过 `ToolSet` 将多个工具组合使用：

```python
from azure.ai.projects.models import ToolSet, FunctionTool, CodeInterpreterTool

toolset = ToolSet()
toolset.add(FunctionTool(fetch_sales_data_using_sqlite_query))
toolset.add(CodeInterpreterTool())

agent = project_client.agents.create_agent(
    model="gpt-4o-mini",
    name="sales-agent",
    instructions="Answer questions about sales data.",
    toolset=toolset,
)
```

---

## 构建可信 Agent 的注意事项

课程特别指出 **LLM 动态生成 SQL 的安全风险**（如 SQL 注入、误删数据）。建议：

- 为数据库分配**只读角色**（SELECT 权限）
- 将应用运行在受控的安全环境中
- 在生产场景中，通常将数据从业务系统抽取到只读数据仓库，再由 Agent 查询

---

## 代码示例

- Python：[04-python-agent-framework.ipynb](https://github.com/microsoft/ai-agents-for-beginners/blob/main/04-tool-use/code_samples/04-python-agent-framework.ipynb)
- .NET：[04-dotnet-agent-framework.md](https://github.com/microsoft/ai-agents-for-beginners/blob/main/04-tool-use/code_samples/04-dotnet-agent-framework.md)

---

## 关联阅读

- [[15_智能体/05_Agent技能/Tool_Calling_Best_Practices]] — 工具调用最佳实践
- [[15_智能体/05_Agent技能/README]] — Agent 技能总览
- [[15_智能体/14_GenAI课程/03_GenAI_L11_Integrating_with_Function_Calling]] — 函数调用与外部应用集成
- [[15_智能体/15_课程笔记/Microsoft_AI_Agents_L02_Frameworks]] — MAF 与 Azure AI Agent Service 框架
- [[15_智能体/15_课程笔记/Microsoft_AI_Agents_L05_Agentic_RAG]] — Agentic RAG 中的工具集成

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
