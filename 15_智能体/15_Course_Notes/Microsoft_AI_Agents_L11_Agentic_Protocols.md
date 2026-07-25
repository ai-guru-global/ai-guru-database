---
title: "L11 Agentic 协议：MCP / A2A / NLWeb 三件套"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - mcp
  - a2a
  - nlweb
  - protocols
  - interop
sources:
  - "原始/github-sources/ai-agents-for-beginners/11-agentic-protocols/README.md"
summary: "Microsoft AI Agents 课程第11课：三大 Agentic 协议——MCP(连接LLM与工具)、A2A(跨组织Agent协作)、NLWeb(网站的自然语言接口)。覆盖各自组件、收益与旅行预订案例的对比实现。"
provenance:
  extracted: 0.87
  inferred: 0.11
  ambiguous: 0.02
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Microsoft Ai Agents L11 Agentic Protocols"
  - "Microsoft AI Agents L11 Agentic Protocols"
  - Microsoft_AI_Agents_L11_Agentic_Protocols

---
# L11 Agentic 协议：MCP / A2A / NLWeb 三件套

> 来源：[Microsoft AI Agents for Beginners / 11-agentic-protocols](https://github.com/microsoft/ai-agents-for-beginners/tree/main/11-agentic-protocols)

## 学习目标

完成本课后，你将能够：

- **识别** MCP / A2A / NLWeb 各自的核心目的与收益
- **解释** 每个协议如何促成 LLM、工具、其他 Agent 之间的交互
- **区分** 它们在构建复杂 Agentic 系统中的不同角色

---

## 一、Model Context Protocol (MCP) —— LLM 接工具的"通用适配器"

**MCP** 是开放标准，为应用向 LLM 提供 context 与工具定义统一方式。相当于"插一次即用"的万能插头。

### 核心组件（Client-Server 架构）

| 角色 | 职责 |
|------|------|
| **Host** | LLM 应用（如 VS Code），发起连接 |
| **Client** | Host 内部组件，与 Server 一对一连接 |
| **Server** | 暴露特定能力的轻量程序 |

### Server 的三大原语（Primitives）

| 原语 | 说明 | 例子 |
|------|------|------|
| **Tools** | Agent 可调用的离散动作/函数 | `get_weather`、`purchase_product` |
| **Resources** | 只读数据/文档 | 文件内容、DB 记录、日志 |
| **Prompts** | 预定义模板，便于复杂工作流 | "Summary this PDF" |

### MCP 三大收益

1. **Dynamic Tool Discovery** —— Agent 运行时动态发现工具，无需静态编码；与传统 API"改一次改代码"形成对比
2. **Interoperability Across LLMs** —— 跨厂商 LLM 通用
3. **Standardized Security** —— 统一认证方法，比每个 API 各管各的密钥更易扩展

### 旅行预订场景示例

```
1. Connection        : AI 助手(MCP client) 连接 航司 MCP Server
2. Tool Discovery    : 询问"你有什么工具" → ["search flights", "book flights"]
3. Tool Invocation   : LLM 识别需要 search_flights，传 (origin, destination)
4. Execution         : MCP Server 包装调用航司内部 API
5. Further Interaction: 选定航班后调用 book_flight
```

---

## 二、Agent-to-Agent Protocol (A2A) —— 跨组织 Agent 协作

MCP 连 LLM 与工具，**A2A 进一步让不同 Agent 互相通信与协作**——跨组织、跨环境、跨技术栈。

### 四大组件

| 组件 | 职责 |
|------|------|
| **Agent Card** | 类似 MCP 工具列表，含 Name / 任务描述 / 技能列表 / Endpoint URL / 版本与能力（streaming、push） |
| **Agent Executor** | 把用户聊天 context 传给远端 Agent；远端用自己 LLM 解析请求并执行 |
| **Artifact** | 任务完成后的产物，含结果 + 描述 + 文本 context；发送后连接关闭 |
| **Event Queue** | 处理更新与消息传递；防止任务未完成连接就断（尤其长任务） |

### A2A 三大收益

1. **Enhanced Collaboration** —— 跨厂商/平台 Agent 共享 context 协作，打破传统孤岛
2. **Model Selection Flexibility** —— 每个 Agent 可自选 LLM（不像 MCP 某些场景共用一个）
3. **Built-in Authentication** —— 协议内建认证框架

### A2A 旅行场景（多 Agent 协作版）

```
1. User Request       : "下周去 Honolulu,含机票+酒店+租车"
2. Orchestration      : Travel Agent 用 LLM 推理需要哪些下游 Agent
3. Inter-Agent Comm   : 通过 A2A 连接 Airline Agent / Hotel Agent / Car Rental Agent
4. Delegated Execution: 各下游 Agent 用自己的 LLM + 工具(可能本身就是 MCP Server)
5. Consolidated       : Travel Agent 汇总 → 给用户聊天式回复
```

---

## 三、Natural Language Web (NLWeb) —— 网站的自然语言接口

让**任何网站**都可被自然语言查询，并被 AI Agent 发现与交互。

### 五大组件

| 组件 | 职责 |
|------|------|
| **NLWeb Application** | 处理 NL 问题的核心引擎，连接各部分产出响应 |
| **NLWeb Protocol** | 与网站 NL 交互的规则集；响应 JSON（常用 Schema.org）；目标是"AI Web 的 HTML"^[inferred] |
| **MCP Server** | 每个 NLWeb 实例同时是 MCP Server，把网站能力暴露给 AI Agent 生态 |
| **Embedding Models** | 把网站内容转为向量；用户可选模型 |
| **Vector Database** | 存储内容向量，支持相似度检索（Qdrant/Snowflake/Milvus/Azure AI Search/Elasticsearch） |

### NLWeb 旅行场景

```
1. Data Ingestion : 用 Schema.org/RSS 把酒店、航班、tour 数据导入向量库
2. NL Query       : 用户输入"找下周 Honolulu 有泳池的家庭友好酒店"
3. NLWeb Process  : LLM 解析查询 + 向量库检索相关 listings
4. Accurate Result: 基于真实 catalog 返回,避免幻觉
5. Agent Use      : 外部 AI Agent 通过 MCP 的 ask 方法也可查询此网站
```

---

## 四、三协议对比一览

| 维度 | MCP | A2A | NLWeb |
|------|-----|-----|-------|
| **连接对象** | LLM ↔ 工具/数据 | Agent ↔ Agent | Agent ↔ 网站 |
| **类比** | USB-C 适配器 | 跨公司 API 标准 | "AI 时代的 HTML" |
| **核心原语** | Tools / Resources / Prompts | Agent Card / Artifact / Event Queue | ask method + Schema.org |
| **认证** | 标准化认证 | 内建认证 | 继承自 MCP |
| **典型场景** | 单 Agent 多工具 | 多 Agent 编排 | 让网站"AI-ready" |

> 三者**互补不冲突**：一个 Agent 可以同时是 MCP client（连工具）、A2A participant（与其他 Agent 协作）、NLWeb consumer（查询 AI-ready 网站）^[inferred]。

---

## 参考资源

- [MCP for Beginners](https://aka.ms/mcp-for-beginners)
- [MCP Documentation](https://learn.microsoft.com/python/api/overview/azure/ai-projects-readme)
- [NLWeb Repo](https://github.com/nlweb-ai/NLWeb)
- [Microsoft Agent Framework](https://aka.ms/ai-agents-beginners/agent-framework)

---

## 关联阅读

- [[智能体/Course_Notes/Microsoft_AI_Agents_L10_Production]] — 上一课：生产化
- [[智能体/Course_Notes/Microsoft_AI_Agents_L12_Context_Engineering]] — 下一课：上下文工程
- [[智能体/Agent_Protocols/README]] — 本仓库协议主题总览
- [[智能体/Hello_Agents_L10_Agent_Protocols]] — Hello-Agents 课程的协议视角
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
