---
title: "L02 探索 AI Agentic 框架"
category: "13-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - agent-framework
  - maf
  - azure-ai-agent-service
  - azure-identity
sources:
  - "_raw/github-sources/ai-agents-for-beginners/02-explore-agentic-frameworks/README.md"
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
---

# L02 探索 AI Agentic 框架

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

- [[15_Agent_Production/Agent_Frameworks/README]] — 主流 Agent 框架概览
- [[15_Agent_Production/Agent_Frameworks/AutoGen_Deep_Dive]] — 微软 AutoGen 多代理框架
- [[14_AI_Gateway/AI_Gateway_2026]] — AI 网关与企业级部署
- [[15_Agent_Production/Microsoft_AI_Agents_L01_Intro]] — AI Agent 基础概念
- [[15_Agent_Production/Microsoft_AI_Agents_L04_Tool_Use]] — 工具使用设计模式
