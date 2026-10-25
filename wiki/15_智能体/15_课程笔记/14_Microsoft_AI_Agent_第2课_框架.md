---
title: "L02 探索 AI Agentic 框架"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - agent-framework
  - maf
  - azure-ai-agent-service
  - azure-identity
sources:
  - "原始/github-sources/ai-agents-for-beginners/02-explore-agentic-frameworks/README.md"
summary: "Microsoft AI Agents 课程第2课：对比 Microsoft Agent Framework (MAF) 与 Azure AI Agent Service，掌握 Agent、Tools、Threads 与 Azure Identity 集成。"
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
  - "Microsoft Ai Agents L02 Frameworks"
  - "Microsoft AI Agents L02 Frameworks"
  - Microsoft_AI_Agents_L02_Frameworks

name_zh: "L02 探索 AI Agentic 框架"
---
# L02 探索 AI Agentic 框架

> 中文简称：L02 探索 AI Agentic 框架

> 来源：[Microsoft AI Agents for Beginners / 02-explore-agentic-frameworks](https://github.com/microsoft/ai-agents-for-beginners/tree/main/02-explore-agentic-frameworks)

## 学习目标

完成本课后，你将能够：

- 理解 AI Agent 框架在开发中的角色
- 快速利用框架的模块化组件、协作工具与实时学习能力进行原型迭代
- 区分 **Microsoft Agent Framework (MAF)** 与 **Azure AI Agent Service** 的定位
- 判断何时使用 MAF、何时使用 Agent Service，或如何组合两者

---

## 为什么需要 AI Agent 框架

传统 AI 框架主要解决“把 AI 放进应用”的问题：个性化推荐、自动化客服、增强用户体验等。而 **AI Agent 框架** 更进一步，专注于让 LLM 能够：

- **多 Agent 协作与协调**：多个 Agent 分工、通信、共同完成复杂任务
- **任务自动化与管理**：自动化多步骤工作流、任务委派、动态任务管理
- **上下文理解与适应**：理解环境变化、基于实时信息做出决策

简言之，Agent 框架让 LLM 从“回答问题”进化到“自主行动”。

---

## Microsoft Agent Framework (MAF)

MAF 是微软统一的 Agent 构建 SDK（支持 Python/C#），通过 `AzureAIProjectAgentProvider` 连接 Azure AI Agent Service。

### 核心概念

| 概念 | 说明 |
|------|------|
| **Agent** | 通过 Provider 创建，配置名称、指令与工具，可处理消息、调用工具、维护对话状态 |
| **Tools** | 以 Python 函数形式定义，MAF 自动序列化函数签名与文档，生成发给 LLM 的 schema |
| **多 Agent 协调** | 可创建多个具备不同专长的 Agent，通过显式调用协作 |
| **Azure Identity** | 使用 `AzureCliCredential` 或 `DefaultAzureCredential` 实现无密钥认证 |

### 代码示例

```python
from agent_framework.azure import AzureAIProjectAgentProvider
from azure.identity import AzureCliCredential

provider = AzureAIProjectAgentProvider(credential=AzureCliCredential())
agent = await provider.create_agent(
    name="weather_agent",
    instructions="Help users check the weather.",
    tools=[get_weather],
)
response = await agent.run("What's the weather in Seattle?")
```

---

## Azure AI Agent Service

Azure AI Agent Service 于 Microsoft Ignite 2024 发布，是一个托管云服务，支持更灵活的模型选择（Llama 3、Mistral、Cohere 等），并提供更强的企业安全与数据存储机制。

### 核心概念

| 概念 | 说明 |
|------|------|
| **Agent** | 在 Microsoft Foundry 中作为“智能微服务”，可回答问题、执行动作或自动化工作流 |
| **Thread & Messages** | Thread 表示一次会话，Messages 追踪对话进度与状态 |
| **内置工具** | 知识工具（Bing Grounding、File Search、Azure AI Search）与动作工具（函数调用、代码解释器、OpenAPI、Azure Functions） |
| **与 MAF 集成** | 可用 MAF 构建 Agent，再部署到 Agent Service 运行 |

---

## MAF vs Azure AI Agent Service

| 维度 | Microsoft Agent Framework | Azure AI Agent Service |
|------|----------------------------|------------------------|
| **定位** | 生产级 Agent SDK | 托管云运行时 |
| **核心能力** | 工具调用、对话管理、Azure Identity | 多模型、企业安全、代码生成、内置搜索 |
| **适用场景** | 快速构建、工具使用、多步骤工作流 | 安全、可扩展、企业级部署 |
| **最佳组合** | 先用 MAF 开发迭代，再用 Agent Service 生产部署 |

课程建议：**如果只想选一个起点，先用 MAF；当需要企业级部署和扩展时，再引入 Agent Service。**

---

## 快速原型能力

课程强调 Agent 框架加速迭代的三种方式：

1. **模块化组件**：预置的 AI 连接器、工具定义、Agent 管理
2. **协作工具**：为 Agent 设计特定角色，测试并优化协作工作流
3. **实时学习**：实现反馈闭环，让 Agent 根据交互动态调整行为

---

## 代码示例

- Python：[02-python-agent-framework.ipynb](https://github.com/microsoft/ai-agents-for-beginners/blob/main/02-explore-agentic-frameworks/code_samples/02-python-agent-framework.ipynb)
- .NET：[02-dotnet-agent-framework.md](https://github.com/microsoft/ai-agents-for-beginners/blob/main/02-explore-agentic-frameworks/code_samples/02-dotnet-agent-framework.md)

---

## 关联阅读

- [[15_智能体/02_Agent框架/README]] — 主流 Agent 框架概览
- [[15_智能体/02_Agent框架/05_AutoGen_深入分析]] — 微软 AutoGen 多代理框架
- [[12_架构基建/11_AI网关/01_AI网关_2026]] — AI 网关与企业级部署
- [[15_智能体/15_课程笔记/Microsoft_AI_Agents_L01_Intro]] — AI Agent 基础概念
- [[15_智能体/15_课程笔记/27_Microsoft_AI_Agent_L15_浏览器_Use]] — 工具使用设计模式

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
