---
title: MCP 与 A2A 协议
category: 21_面试岗位
tags: ["面试", "MCP", "A2A", "协议", "Function-Calling", "Agent互操作"]
summary: "Agent 两大标准协议对比：MCP 的原语体系（tools/resources/prompts + sampling/roots/elicitation）与传输演进，A2A 的 Agent Card 与任务生命周期，及 Function Calling 三者选型。"
created: 2026-10-20
updated: 2026-10-20
tier: supporting
aliases: [MCP A2A 对比, Agent 协议, Model Context Protocol]
sources: []
name_zh: "MCP 与 A2A 协议"
---

# MCP 与 A2A 协议 (Model Context Protocol & Agent-to-Agent)

> 中文简称：MCP 与 A2A 协议

> **一句话理解**: MCP 让 Agent 标准 地"插插座"（连工具和数据），A2A 让 Agent 之间标准地"打电话"（互派任务）——JD 第 3 条"标准化连接能力"的两个关键词。

---

## 1. MCP（Model Context Protocol）

### 1.1 基本盘

- Anthropic 于 2024 年 11 月开源的"Agent 连接工具/数据"标准协议，2025 年获 OpenAI、Google 等采纳，成为**事实标准**，后转入中立基金会治理；
- 底座：**JSON-RPC 2.0**；架构：Host（Agent 应用）— Client（连接管理）— Server（能力提供方）。

### 1.2 原语体系（面试必背）

| 侧 | 原语 | 作用 |
|----|------|------|
| Server → Host | **tools** | 可被模型调用的函数（工具） |
| Server → Host | **resources** | 可读取的上下文数据（文件/记录） |
| Server → Host | **prompts** | 预置提示词模板 |
| Host → Server | **sampling** | Server 反向请求 Host 侧的模型补全 |
| Host → Server | **roots** | 声明 Server 可访问的文件系统边界 |
| Host ⇄ Server | **elicitation** | Server 在执行中向用户追问信息 |

- 记忆口径："Server 三件套给能力，Client 三件套控边界"——sampling/roots/elicitation 本质都是**把控制权留在 Host 手里**，这是 MCP 的安全设计哲学。

### 1.3 传输演进

- 初期：stdio（本地进程）+ HTTP+SSE（远程）；
- 2025-03 规范修订：**Streamable HTTP 取代 HTTP+SSE**——单端点、按需升级流、断线重连（session 管理），更适合无状态网关和横向扩容，这是 Runtime 平台侧最关心的变化。

---

## 2. A2A（Agent-to-Agent Protocol）

### 2.1 基本盘

- Google 于 2025 年 4 月发布、同年 6 月捐赠 Linux 基金会的 **Agent 之间互操作**协议，定位与 MCP 互补；
- 核心对象：
  - **Agent Card**：Agent 的"名片"（身份、能力、端点、鉴权要求），托管在 `/.well-known/` 路径下供发现；
  - **Task**：协作的单元，自带生命周期（submitted → working → input-required → completed/failed/canceled）；
  - **Message / Artifact**：交互消息与产出物（文件、结构化数据）。

### 2.2 为什么企业需要 A2A

- 跨团队/跨厂商的 Agent 各自为政（不同框架、不同供应商），A2A 用"能力发现 + 任务委托 + 长任务回调"把它们拼起来；
- 对 Runtime 平台的意义：A2A Task 的生命周期与 [[21_面试岗位/28_Agent_Runtime工程师/03_Agent_Runtime_核心机制|Runtime 会话生命周期]] 同构——平台可以统一管理"本地任务"和"委托给远端 Agent 的任务"。

---

## 3. 三者对比与选型（高频考点）

| 维度 | Function Calling | MCP | A2A |
|------|-----------------|-----|-----|
| 解决什么 | 单次模型↔函数调用 | Agent↔工具/数据的标准连接 | Agent↔Agent 的任务协作 |
| 标准化程度 | 各家 API 自定义 | 开放标准，生态最大 | 开放标准（Linux 基金会） |
| 发现机制 | 客户端硬编码 | tools/list 动态发现 | Agent Card 自描述发现 |
| 长任务/异步 | 无 | 有限（progress 通知） | 原生支持（Task 生命周期+回调） |
| 典型场景 | 单体应用内工具 | 接企业数据/工具市场 | 跨团队跨厂商 Agent 编队 |

- 选型口诀：**单体工具用 FC，跨应用工具上 MCP，跨组织协作上 A2A**；三者可叠加（A2A 协作的双方各自用 MCP 连自己的工具）。

---

## 4. 平台视角：MCP Gateway 是 Runtime 的一部分

面试加分点：把协议落到平台工程——

1. **工具网关统一托管 MCP Server**：租户不各自起进程，平台统一鉴权、限流、审计；
2. **安全边界**：roots/elicitation 落地为平台策略（最小文件可见域、敏感操作二次确认）；凭证由网关注入，不进模型上下文（衔接 [[21_面试岗位/28_Agent_Runtime工程师/09_企业级交付_安全|09 企业交付]]）；
3. **可观测**：每次 tool call 记 span，进入统一追踪（衔接 [[21_面试岗位/28_Agent_Runtime工程师/08_可观测_评测|08 可观测评测]]）。

---

## 5. 高频面试题速练

1. **"MCP 和 Function Calling 什么关系？"** —— FC 是模型 API 层的调用格式；MCP 是工具的**发现、分发、复用**标准——MCP 的工具最终仍以 FC 形式喂给模型，MCP 解决的是 FC 之上"工具从哪来、谁来管"的问题。
2. **"MCP 的 Streamable HTTP 相比 SSE 改了什么？"** —— 单端点替代双端点、流按需升级、会话 ID 支持重连续传，网关和负载均衡更友好。
3. **"A2A 和 MCP 会互相取代吗？"** —— 不会：抽象层级不同（工具 vs Agent），官方口径就是互补；类比"USB（MCP）与局域网（A2A）"。
4. **"企业落地 MCP 最大的坑？"** —— 安全：第三方 MCP Server 的供应链风险 + 凭证管理 + 工具投毒（tool poisoning）描述注入，需要网关托管、审计与最小权限。

---

## Related

- [[概念/Agent/mcp|MCP 概念页]]
- [[概念/Agent/a2a-protocol|A2A 概念页]]
- [[15_智能体/16_Agent协议/01_A2A_协议_深入分析|A2A 协议深入分析]]
- [[15_智能体/01_Agent基础/20_MCP_实现_指南|MCP 实现指南]]
- [[概念/Agent/function-calling|Function Calling 概念页]]

---

*Last updated: 2026-10-20*
