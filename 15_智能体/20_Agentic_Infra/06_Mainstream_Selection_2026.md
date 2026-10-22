---
title: "Agentic Infra 主流选型 2026：每层采用最广的默认项"
category: -agents
tags: ["agentic-infra", "selection", "litellm", "mcp", "sandbox", "agent-memory", "temporal", "langfuse", "agent-security"]
summary: "2026 年七层智能体基础设施栈每层「采用面最大」的默认项：LiteLLM、MCP、E2B、Mem0、Temporal、Langfuse/LangSmith、OWASP Agentic Top 10——各自的采用理由、口径陷阱与何时不用它。"
created: 2026-10-22
updated: 2026-10-22
tier: supporting
aliases: ["主流选型 2026", "Agentic Infra 默认栈", "最广泛选型"]
sources:
  - https://modelcontextprotocol.io/
  - https://temporal.io/
  - https://langfuse.com/
  - https://e2b.dev/
  - https://www.daytona.io/
  - https://www.inngest.com/
  - https://upstash.com/blog/durable-workflow-engines-compared-every-major-option-in-2026
  - https://www.flotorch.ai/blogs/llm-gateway-comparison-2026
  - https://api7.ai/litellm-alternative
  - https://northflank.com/blog/daytona-vs-e2b-ai-code-execution-sandboxes
  - https://getfeather.store/theory/ai-memory-systems-comparison-2026

name_zh: "主流选型 2026"
---

# Agentic Infra 主流选型 2026：每层采用最广的默认项

> 中文简称：主流选型 2026

> **一句话理解**: 七层智能体基础设施栈的每一层，2026 年都有一个「采用面最大的默认项」——LiteLLM、MCP、E2B、Mem0、Temporal、Langfuse/LangSmith、OWASP 实践；本文讲清它为什么最广、什么时候不该用它，以及「最广泛」和「最适合」的口径区别。

---

## 目录

1. [口径：什么叫「最广泛」](#1-口径什么叫最广泛)
2. [七层总览：2026 默认栈](#2-七层总览2026-默认栈)
3. [L1 模型网关：LiteLLM](#3-l1-模型网关litellm)
4. [L2 工具协议：MCP](#4-l2-工具协议mcp)
5. [L3 执行隔离：E2B（托管默认）与 Firecracker（自建基准）](#5-l3-执行隔离e2b托管默认与-firecracker自建基准)
6. [L4 记忆上下文：Mem0](#6-l4-记忆上下文mem0)
7. [L5 持久编排：Temporal（注意 LangGraph 口径）](#7-l5-持久编排temporal注意-langgraph-口径)
8. [L6 可观测评估：Langfuse 与 LangSmith（注意 OTel 口径）](#8-l6-可观测评估langfuse-与-langsmith注意-otel-口径)
9. [L7 安全治理：OWASP Agentic Top 10](#9-l7-安全治理owasp-agentic-top-10)
10. [默认栈组合参考](#10-默认栈组合参考)
11. [面试与评审快问快答](#11-面试与评审快问快答)
12. [与本库章节的映射](#12-与本库章节的映射)
13. [参考资源](#13-参考资源)

---

## 1. 口径：什么叫「最广泛」

「选型」其实是三个不同的问题，答案常常不一样：

| 问题 | 含义 | 典型答案 |
|------|------|---------|
| **采用面最大** | 社区与企业里用得最多、生态最大 | 本文主题——每层的「默认项」 |
| **场景最优** | 你的具体约束（状态/合规/技术栈）下最合适 | 见 [[15_智能体/20_Agentic_Infra/01_Agentic_Infra_全景_2026|全景 2026]] 的选型决策速查 |
| **规模化终局** | 大厂与高合规团队的自建基准 | K8s + Firecracker/gVisor、自研网关、pgvector 自建记忆 |

**为什么必须分口径**：默认项是生态网络效应的产物——文档最多、招人最容易、集成最全，但**默认项 ≠ 最优解**。写方案或答面试时，先声明口径（「按采用面」「按你的场景」「按规模化终局」），再给答案，能避开大多数争论。

一个 2026 年的行业观察：默认栈正在变成「无聊的标配」（boring default stack）——创业公司与产品团队直接按默认项组装平台，数周可用；大厂则在每层走「默认项 + 自建替代」双轨。两条路线在第 10 节对比。

---

## 2. 七层总览：2026 默认栈

| 层 | 最广泛选型 | 一句话理由 | 主要替代 |
|----|-----------|-----------|---------|
| L1 模型网关 | **LiteLLM** | 开源自托管的事实默认，100+ Provider 适配，社区最大 | Portkey（商业）、Kong/Higress（已有网关团队） |
| L2 工具协议 | **MCP** | 事实标准，OpenAI/Google/Microsoft 全线接入 | A2A（Agent↔Agent 补充） |
| L3 执行隔离 | **E2B**（托管） | agent 原生沙箱采用最广，底层 Firecracker | Daytona（有状态）、Modal（GPU）、自建 K8s + microVM |
| L4 记忆上下文 | **Mem0** | 检索式记忆 API 生态集成最多 | Letta（运行时内建）、Zep（时序） |
| L5 持久编排 | **Temporal** | durable execution 最成熟、企业采用最广 | Inngest（事件驱动）、Restate（轻量） |
| L6 可观测评估 | **Langfuse**（开源）/ **LangSmith**（商业） | 开源自托管社区最大；LangChain 系默认 | Braintrust（eval 重）、OTel（协议层） |
| L7 安全治理 | **OWASP Agentic Top 10**（参考框架） | 无单一产品，六层控制实践渗透最广 | 护栏能力多复用 L1 网关 |

注意两条「协议/框架赢者」与「产品赢者」的区别：L2 和 L7 是**标准/框架**层面的收敛（MCP、OWASP），L1/L3/L4/L5/L6 才是具体产品的收敛。下面逐层展开「为什么最广、口径陷阱、何时不用」。

---

## 3. L1 模型网关：LiteLLM

### 3.1 为什么是最广泛

- **开源 + 自托管**是 AI 网关的主导形态，LiteLLM 是该形态的事实默认起点；
- 100+ Provider 统一成 OpenAI 兼容接口，`litellm` 库（代码内调用）与 proxy server（独立网关）两种用法覆盖从原型到平台的全生命周期；
- 生态与人才网络效应最强：主流框架教程默认拿 LiteLLM 演示多模型切换，团队换人、排障、找集成的成本最低。

### 3.2 口径辨析

| 口径 | 答案 |
|------|------|
| 采用面最大 | LiteLLM |
| 企业控制面/护栏最优 | Portkey（商业，护栏、审批、预算管控完善） |
| 已有传统网关团队 | Kong AI Gateway / APISIX；国内与阿里系生态常用 Higress |
| 高性能非 Python 栈 | Bifrost（Go）、TensorZero（Rust，数据飞轮导向） |

### 3.3 何时不用默认项

- 需要开箱即用的**企业护栏与审批流** → Portkey；
- 团队已有 Kong/APISIX 运维体系 → 复用网关底座 + AI 插件，而不是再养一套 LiteLLM；
- 极高 QPS 下 Python 代理层成瓶颈 → Go 系网关或自研；选 LiteLLM 自托管时要对 proxy 层做认真的容量规划与多副本部署。

---

## 4. L2 工具协议：MCP

### 4.1 为什么是最广泛

- 2025-03 OpenAI 宣布接入后，MCP 从 Anthropic 单方协议升级为**行业事实标准**，Google DeepMind、Microsoft 相继支持；
- 服务端生态的网络效应：数千个现成 MCP server（数据库、浏览器、GitHub、Slack 等），接入即用；
- 主流框架原生兼容，「工具描述规范」成为事实上的工具 USB 接口。

### 4.2 口径辨析

| 场景 | 答案 |
|------|------|
| Agent ↔ 工具/数据源 | MCP（唯一事实标准） |
| Agent ↔ Agent 互联 | A2A（2026-06 吸收 ACP；Agent Card 服务发现） |
| 单应用内部工具调用 | 直接 function calling 也常见——无跨系统复用需求时不必上 MCP |

### 4.3 何时不用默认项

- 纯单应用、工具不跨团队复用 → function calling 更简单，少一层协议开销；
- **企业生产接入 MCP 必须过 MCP 网关**（工具注册、鉴权、审计、限流），不能放任 agent 直连任意 server——每一个工具都是间接提示注入的入口（与 L7 联动，见 [[15_智能体/16_Agent协议/README|Agent 协议]]）。

---

## 5. L3 执行隔离：E2B（托管默认）与 Firecracker（自建基准）

### 5.1 为什么是最广泛

- 代码执行型 agent（coding / 数据分析 / computer-use）爆发，E2B 以 agent 原生 SDK（代码执行、浏览器、pause/fork、支持自有云部署）成为**托管沙箱的默认起点**；
- E2B 底层是 Firecracker microVM——托管默认与自建基准共享同一个技术内核，这是沙箱层少见的行业共识；
- 容器共享内核仍有逃逸面，microVM 是高隔离首选；K8s 侧常见落地是 gVisor / Kata（避坑经验见 [[12_架构基建/10_安全/05_gVisor_常见问题与避坑指南|gVisor 避坑指南]]）。

### 5.2 口径辨析

| 口径 | 答案 |
|------|------|
| 托管采用面最大 | E2B |
| 有状态工作区最优 | Daytona（约 90ms 创建，agent 离开后可回到同一环境） |
| GPU / 计算密集 | Modal |
| 边缘轻量 | Cloudflare Sandbox SDK |
| 大厂 / 高合规自建 | K8s + Firecracker/Kata/gVisor（参见 [[12_架构基建/10_安全/README|架构安全]]） |

### 5.3 何时不用默认项

- agent 要**长期驻留开发一个仓库**（装依赖、改文件、跑测试、可恢复可 fork）→ Daytona / CodeSandbox——**无状态快执行 vs 有状态工作区**是这层的第一选型主轴；
- 数据不出域是硬约束 → E2B 自有云部署，或完全自建。

---

## 6. L4 记忆上下文：Mem0

### 6.1 为什么是最广泛

- 记忆层的主导形态是「检索式记忆 API」（应用显式 add / search），Mem0 是该形态中生态集成最多的：LangChain、CrewAI、Vercel AI SDK 等主流框架均有官方集成；
- 多租户、生产级 API 设计让它能直接嵌进现有应用，不需要绑定某个 agent 运行时。

### 6.2 口径辨析（这层的口径陷阱最多）

| 口径 | 答案 |
|------|------|
| 独立记忆基础设施采用面最大 | Mem0 |
| 覆盖面最大（含框架自带） | 各框架内置 memory / 会话存储——大量应用根本没引入独立记忆层 |
| agent 原生运行时 | Letta（记忆内建于 agent 生命周期，可自编辑） |
| 时序 / 事实演化推理 | Zep（时间知识图谱） |

**诚实口径**：2026 年多数生产 agent 的「记忆」仍是数据库 + 向量检索自建（pgvector 起步）；独立记忆层是增长最快的形态，Mem0 是其中的默认项。展开见 [[15_智能体/06_记忆基础设施/README|记忆基础设施]]。

### 6.3 何时不用默认项

- 需求只是会话历史 + 简单偏好 → pgvector + 摘要压缩即可，不必引入独立记忆层；
- 记忆与 agent 运行时强耦合（agent 自己管理自己的记忆）→ Letta；
- 需要「用户上季度偏好什么」这类时间线推理 → Zep。

---

## 7. L5 持久编排：Temporal（注意 LangGraph 口径）

### 7.1 为什么是最广泛

- durable execution 领域最成熟：多日级 agentic 工作流、状态持久化、确定性重放、子任务粒度断点续跑，企业生产案例与生态规模均最大；
- 声明式的超时 / 重试 / 补偿策略，直接替代「裸 while 循环 + 手写重试」的泥潭。

### 7.2 口径辨析（面试高频陷阱）

| 口径 | 答案 |
|------|------|
| durable execution 引擎采用面最大 | Temporal |
| agent 框架层编排采用面最大 | **LangGraph**（checkpoint 续跑——多数 agent 的「编排」实际发生在这一层） |
| 事件驱动产品团队 | Inngest（免自建 worker/队列） |
| 轻量嵌入 | Restate（日志即状态） |
| 全栈 AWS 团队 | Step Functions |

两者**经常配合**：LangGraph 管单次 agent 循环内的图编排，Temporal 管跨服务、跨天的任务持久化。被问「编排选什么」时，先反问「哪一层的编排」。

### 7.3 何时不用默认项

- 团队小、任务多为事件触发（webhook / cron）→ Inngest，省掉 worker 与队列运维；
- 任务分钟级、失败可整段重跑 → LangGraph checkpoint 甚至简单任务队列就够；Temporal 的集群运维与 SDK 改造成本未必划算。

---

## 8. L6 可观测评估：Langfuse 与 LangSmith（注意 OTel 口径）

### 8.1 为什么是最广泛

- **协议层**真正渗透最广的是 OpenTelemetry（GenAI semantic conventions）——2026 年主流平台全部支持 OTLP 导出，trace 规范在向 OTel 收拢；
- **平台层**有两个默认：开源自托管的默认是 **Langfuse**（社区最大，UI 内定义 LLM-as-judge 跑在流入 trace 上）；LangChain 系的商业默认是 **LangSmith**（深度集成）。

### 8.2 口径辨析

| 口径 | 答案 |
|------|------|
| 埋点协议渗透最广 | OpenTelemetry |
| 开源自托管平台 | Langfuse |
| LangChain / LangGraph 生态 | LangSmith |
| eval 重度团队 | Braintrust（离线 eval、prompt 实验见长） |
| 已有 ML 平台底座 | MLflow / Arize |

### 8.3 何时不用默认项

- 团队全是 LangChain 技术栈 → LangSmith 集成成本最低；
- 离线评测与 prompt 实验是核心工作流 → Braintrust；
- 数据不出域 / 自主可控是硬约束 → Langfuse 自托管（与 [[15_智能体/07_Agent评估/README|Agent 评估]] 的方法学配合）。

---

## 9. L7 安全治理：OWASP Agentic Top 10

### 9.1 为什么「最广泛」是个框架而非产品

- 安全层没有赢者通吃的产品；渗透最广的是 **OWASP Agentic AI Top 10** 作为风险分类与检查基线；
- 产品形态上，护栏能力大量**复用 L1 网关**（Portkey 护栏、网关侧脱敏限流），独立的「agent 安全网关」尚未形成默认项。

### 9.2 六层控制是实践共识

身份 → 最小权限 → 运行时强制（L3 沙箱）→ 行为监控（联动 L6 trace）→ 审计（联动 L5 事件日志）→ 治理合规。核心公理：**间接提示注入是 2026 企业 agent 头号风险，且防不住、只能限损**——按「agent 已被攻陷」来设计权限、环境与外发通道。

### 9.3 落地默认组合

面向互联网的浏览 / 文档型 agent 的「强制四件套」：L3 沙箱隔离 + 工具白名单收窄 + 写操作人类审批 + 全量可重放审计。

---

## 10. 默认栈组合参考

**社区默认栈（2026）**：

```text
LiteLLM（L1 网关）+ MCP（L2 协议）+ E2B（L3 沙箱）+ Mem0（L4 记忆）
+ Temporal（L5 编排）+ Langfuse（L6 可观测）+ OWASP 六层控制（L7 安全）
```

**大厂自建变体**：自研网关或 Kong/Higress 底座 + MCP 网关化治理 + K8s + Firecracker/Kata 沙箱 + pgvector 自建记忆 + Temporal + 自托管 Langfuse 或内部 trace 平台 + 内部安全平台。

两条路线的共识与分歧：

| 层 | 共识度 | 说明 |
|----|--------|------|
| L2 MCP、L5 Temporal、L7 OWASP 基线 | 高 | 几乎不分大小厂，默认即终局 |
| L1 网关、L3 沙箱、L4 记忆 | 分歧集中区 | 托管 vs 自建的取舍由合规、规模与成本曲线决定 |
| L6 | 中 | 平台可以换，OTel 埋点规范先统一 |

---

## 11. 面试与评审快问快答

| 问题 | 答法要点 |
|------|---------|
| 每层最广泛的选型是什么？ | 先声明「采用面」口径，再给七层默认栈表；补一句「默认 ≠ 最适合」 |
| 沙箱是不是 Agentic Infra 最主要的部分？ | 安全上最关键（不可信代码执行），但故障率上记忆 / 上下文层是大头——业界统计约 65% 企业 agent 故障源于上下文漂移 |
| MCP 为什么赢了？ | OpenAI/Google/Microsoft 全线接入 + server 生态网络效应，工具描述成为事实标准；但企业落地必须 MCP 网关化治理 |
| Temporal 和 LangGraph 什么关系？ | 不同层：LangGraph 是框架内图编排（checkpoint），Temporal 是 durable execution 引擎（跨天断点续跑）；经常配合使用 |
| Langfuse 和 LangSmith 怎么选？ | 开源自托管 vs LangChain 系商业；埋点协议层在收拢到 OpenTelemetry |
| 沙箱为什么是 Firecracker 而不是 Docker？ | 容器共享内核有逃逸面；microVM 提供 VM 级隔离且冷启动在秒级内；E2B 托管方案底层同样是 Firecracker |
| 记忆层一定要用 Mem0 吗？ | 不一定：会话历史 + pgvector 自建仍是最普遍形态；独立记忆层是增长最快的选项，Mem0 是其默认；时序推理选 Zep |
| 自建还是托管沙箱？ | 看合规（数据不出域）、规模（成本曲线交点）与隔离强度掌控权；小时级上手选托管，周级起步换长期可控 |

---

## 12. 与本库章节的映射

- [[15_智能体/20_Agentic_Infra/01_Agentic_Infra_全景_2026|Agentic Infra 全景 2026]] — 七层栈深度长文（各层完整格局与参考来源）
- [[15_智能体/20_Agentic_Infra/02_生产环境组件清单|生产环境组件清单]] — 上云视角的组件与云厂商映射
- [[15_智能体/16_Agent协议/README|Agent 协议]] — MCP / A2A 协议细节
- [[15_智能体/06_记忆基础设施/README|记忆基础设施]] — L4 层展开
- [[15_智能体/07_Agent评估/README|Agent 评估]] — L6 层评估方法学
- [[12_架构基建/10_安全/README|架构安全]] — 沙箱运行时与安全基建
- [[12_架构基建/10_安全/05_gVisor_常见问题与避坑指南|gVisor 避坑指南]] — 自建沙箱运行时的实战坑
- [[21_面试岗位/28_Agent_Runtime工程师/README|Agent Runtime 工程师面试]] — 本文档快问快答的展开版

---

## 13. 参考资源

- [MCP 官方站点](https://modelcontextprotocol.io/)
- [Temporal 官方站点](https://temporal.io/)
- [Langfuse 官方站点](https://langfuse.com/)
- [E2B 官方站点](https://e2b.dev/)
- [Daytona 官方站点](https://www.daytona.io/)
- [Inngest 官方站点](https://www.inngest.com/)
- [Durable Workflow Engines Compared (Upstash, 2026)](https://upstash.com/blog/durable-workflow-engines-compared-every-major-option-in-2026)
- [LLM Gateway Comparison 2026 (Flotorch)](https://www.flotorch.ai/blogs/llm-gateway-comparison-2026)
- [LiteLLM Alternative (API7)](https://api7.ai/litellm-alternative)
- [Daytona vs E2B (Northflank)](https://northflank.com/blog/daytona-vs-e2b-ai-code-execution-sandboxes)
- [AI Memory Systems Comparison 2026 (Feather)](https://getfeather.store/theory/ai-memory-systems-comparison-2026)

---

*Last updated: 2026-10-22*
