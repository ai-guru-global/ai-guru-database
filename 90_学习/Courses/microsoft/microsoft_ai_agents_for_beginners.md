---
title: Microsoft AI Agents for Beginners：16 课 AI 代理初学者课程映射
category: 90-learn-courses-microsoft
tags:
- learning-paths
- microsoft
- ai-agents
- course-catalog
- agent-framework
- mcp
- rag
- multi-agent
- course
- external-source
summary: Microsoft 官方出品的 16 课 AI Agents 入门课程，覆盖 Agent 基础、框架、设计模式、工具调用、Agentic RAG、可信代理、规划、多代理、协议、上下文工程、记忆与加密审计收据。本页将课程完整课表映射到
  ai-guru-database 的对应章节。
sources:
- https://github.com/microsoft/ai-agents-for-beginners
- 原始/github-sources/ai-agents-for-beginners
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: '2026-06-12'
updated: '2026-07-10'
aliases:
- Microsoft Ai Agents For Beginners
- microsoft ai agents for beginners
- microsoft_ai_agents_for_beginners
- Ai Agents For Beginners
- ai agents for beginners
---
# Microsoft AI Agents for Beginners：16 课 AI 代理初学者课程映射

> **一句话理解**: [AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) 是微软开源的 16 课 AI 代理入门课程。它以 **Microsoft Agent Framework (MAF)** 与 **Azure AI Foundry Agent Service V2** 为核心技术栈，覆盖 Agent 概念、设计模式、工具调用、Agentic RAG、可信代理、规划、多代理、协议、上下文工程、记忆、浏览器代理与加密安全收据，并为每节课提供 Python / .NET 代码示例。本页将课程完整课表映射到 `ai-guru-database` 的对应章节。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **GitHub 仓库** | [microsoft/ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners) |
| **课时数量** | 16 节正式课程 + 环境设置；另有 2 节（16、17）待发布 |
| **编程语言** | Python 3.12+、.NET 10+ |
| **主力框架** | Microsoft Agent Framework (MAF) |
| **托管服务** | Azure AI Foundry Agent Service V2 |
| **认证方式** | Azure CLI (`AzureCliCredential`)，无需在代码中管理 API Key |
| **前置要求** | 基础 Python；建议先完成 [[90_学习/courses/microsoft/microsoft_genai_for_beginners]] 建立 LLM 基础 |
| **社区支持** | [Microsoft Foundry Discord](https://aka.ms/ai-agents/discord) |

---

## 你将学到什么

- AI Agent 的定义、类型与适用场景
- Microsoft Agent Framework 与 Azure AI Agent Service 的选型与差异
- Agentic 设计原则（空间、时间、核心）
- 工具使用（Tool Use）设计模式与函数调用
- Agentic RAG 的迭代检索-评估-自纠流程
- 构建可信 Agent：系统消息框架、威胁建模、人在回路
- 规划（Planning）与多代理（Multi-Agent）设计模式
- 元认知（Metacognition）：自我反思、Corrective RAG、代码生成
- 生产可观测性与评估（OpenTelemetry、离线/在线评估）
- 代理协议：MCP、A2A、NLWeb
- 上下文工程：类型、策略与常见失败模式
- Agent 记忆：工作记忆、短期/长期记忆、Mem0、Cognee、Structured RAG
- 浏览器代理（CUA）与 Browser-Use
- 加密审计收据：Ed25519 签名、JCS 规范化、哈希链

---

## 完整课程表与章节映射

### 基础与环境（L00-L02）

| 课号 | 课程名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 00 | 课程设置 | Azure CLI 认证、Foundry 项目、.env 配置、依赖安装 | [[01_数学基础/AI_Development_Environment_Setup]]、[[05_大模型/13_LLM_Products/chatgpt_overview]] | — |
| 01 | AI 代理与使用场景简介 | Agent 定义、感知-推理-行动、七种 Agent 类型、何时使用 Agent | [[概念/ai-agents]]、[[15_智能体/GenAI_L17_AI_Agents]]、[[06_强化学习/AI_Agents/Agent-in-nutshell]] | [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L01_Intro]] |
| 02 | 探索 AI Agentic 框架 | MAF vs Azure AI Agent Service、Agent / Thread / Tools、Azure Identity | [[15_智能体/02_Agent_Frameworks/README]]、[[12_架构基建/11_AI_Gateway/AI_Gateway_2026]] | [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L02_Frameworks]] |

### 设计原则与核心模式（L03-L04）

| 课号 | 课程名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 03 | AI Agentic 设计原则 | Space / Time / Core 三维设计、透明/控制/一致性指南 | [[15_智能体/GenAI_L12_Designing_UX_for_AI_Applications]]、[[15_智能体/03_Agent_Workflow/Agentic_UI_UX_Design_2026]] | — |
| 04 | 工具使用设计模式 | Function Schema、工具调用循环、Message Handling、MAF `@tool`、可信工具设计 | [[15_智能体/05_Agent_Skills/Tool_Calling_Best_Practices]]、[[15_智能体/GenAI_L11_Integrating_with_Function_Calling]]、[[15_智能体/05_Agent_Skills/README]] | [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L04_Tool_Use]] |

### RAG 与可信 Agent（L05-L06）

| 课号 | 课程名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 05 | Agentic RAG | 迭代 maker-checker、自主推理、工具集成、Self-Correction、治理透明 | [[14_RAG系统/04_Advanced_RAG/Agentic_RAG_Guide]]、[[14_RAG系统/RAG_Systems]]、[[概念/rag-systems]] | [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L05_Agentic_RAG]] |
| 06 | 构建可信 AI 代理 | 系统消息框架、威胁建模（指令篡改、权限过载、知识投毒、级联错误）、Human-in-the-Loop | [[17_伦理安全/07_AI_Security_2026/AI_Security_2026]]、[[17_伦理安全/Guardrails_Production_Guide]]、[[15_智能体/03_Agent_Workflow/Agentic_UI_UX_Design_2026]] | [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L06_Trustworthy_Agents]] |

### 规划与多代理（L07-L09）

| 课号 | 课程名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 07 | 规划设计模式 | 目标定义、任务分解、结构化输出、Planner Agent、迭代重规划 | [[15_智能体/03_Agent_Workflow/Workflow-in-nutshell]]、[[15_智能体/03_Agent_Workflow/LangGraph_Deep_Dive]]、[[概念/ai-agents]] | [[15_智能体/03_Agent_Workflow/Workflow-in-nutshell|规划设计模式]] |
| 08 | 多代理设计模式 | 通信、协调、Agent 架构、可见性、Group Chat / Hand-off / Collaborative Filtering | [[15_智能体/02_Agent_Frameworks/AutoGen_Deep_Dive]]、[[15_智能体/03_Agent_Workflow/Agentic_Workflow_Design_Patterns_2026]]、[[15_智能体/A2A_Protocol_Deep_Dive]] | [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L08_Multi_Agent]] |
| 09 | 元认知设计模式 | 自我反思、Corrective RAG、预加载上下文、LLM 重排序、代码生成 | [[15_智能体/Agentic_Design_Patterns_AndrewNg]]、[[14_RAG系统/04_Advanced_RAG/RAG_Advanced_2026]] | — |

### 生产、协议与上下文（L10-L12）

| 课号 | 课程名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 10 | 生产中的 AI 代理 | Trace/Span、OpenTelemetry、离线/在线评估、成本管理、常见故障 | [[13_运维/AI_Observability_Guide_2026]]、[[15_智能体/07_Agent_Evaluation/README]]、[[13_运维/AIOps-in-nutshell]] | — |
| 11 | 使用 Agentic 协议（MCP、A2A、NLWeb） | MCP client-server、A2A Agent Card/Artifact/事件队列、NLWeb 语义网 | [[90_学习/References/Articles/awesome-mcp-servers]]、[[15_智能体/A2A_Protocol_Deep_Dive]]、[[12_架构基建/11_AI_Gateway/AI_Gateway_2026]] | [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L11_Agentic_Protocols]] |
| 12 | AI 代理的上下文工程 | 上下文类型、Scratchpad、记忆、压缩、多代理、上下文失败模式 | [[15_智能体/06_Memory_Infrastructure/README]]、[[15_智能体/06_Memory_Infrastructure/Agent_Memory_Techniques]]、[[概念/ai-agents]] | — |

### 记忆、框架、浏览器与安全（L13-L18）

| 课号 | 课程名称 | 关键概念 | 本库建议配合阅读 | 页面链接 |
|------|----------|----------|------------------|----------|
| 13 | 管理 Agentic 记忆 | 工作/短期/长期记忆、Persona/Episodic/Entity Memory、Mem0、Cognee、Structured RAG | [[15_智能体/06_Memory_Infrastructure/Agent_Memory_Systems_2026]]、[[15_智能体/06_Memory_Infrastructure/Agent_Memory_Techniques]]、[[14_RAG系统/RAG_Systems]] | [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L13_Agent_Memory]] |
| 14 | 探索 Microsoft Agent Framework | MAF 编排模式、Agent/Thread/Middleware、Workflows、OpenTelemetry | [[15_智能体/02_Agent_Frameworks/README]]、[[15_智能体/03_Agent_Workflow/Workflow-in-nutshell]]、[[13_运维/AI_Observability_Guide_2026]] | — |
| 15 | 构建计算机使用代理（CUA） | Browser-Use + Playwright + CDP、Vision、结构化输出、Agent vs Actor | [[15_智能体/05_Agent_Skills/Agent_Skills_Ecosystem_Catalog]]、[[15_智能体/05_Agent_Skills/Agent_Skills_Deep_Dive]]、[[04_计算机视觉/08_Multimodal_Vision/Multimodal_Vision|多模态视觉模型]] | — |
| 16 | 部署可扩展代理 | *Coming Soon* | [[12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026]]、[[10_部署推理/Deployment_Inference_2026]] | — |
| 17 | 创建本地 AI 代理 | *Coming Soon* | [[05_大模型/12_Edge_LLM/Edge_LLM_Deep_Dive]]、[[10_部署推理/02_Inference_Engines/LiteRT_Deep_Dive]] | — |
| 18 | 使用加密收据保护 AI 代理 | Ed25519 签名、JCS 规范化、SHA-256 哈希链、离线验证、审计边界 | [[17_伦理安全/07_AI_Security_2026/AI_Security_2026]]、[[17_伦理安全/AI_Governance_Compliance_2026]]、[[17_伦理安全/Guardrails_Production_Guide]] | [[17_伦理安全/07_AI_Security_2026/AI_Security_2026|AI 代理安全]] |

---

## 学习建议

1. **先修 LLM 基础**：若对 LLM、提示工程不熟悉，建议先完成 [[90_学习/courses/microsoft/microsoft_genai_for_beginners]] 的 L00-L05。
2. **按主线推进**：L01→L04 建立 Agent 核心概念；L05-L08 深入 RAG、可信、规划、多代理；L11-L18 掌握协议、上下文、记忆、生产、浏览器与安全。
3. **动手运行代码**：每节课的 `code_samples` 是理解 MAF 与 Azure AI Agent Service 的关键；确保完成 Azure CLI 与 Foundry 项目配置。
4. **交叉阅读**：本库 [[概念/ai-agents]]、[[14_RAG系统/04_Advanced_RAG/Agentic_RAG_Guide]]、[[15_智能体/02_Agent_Frameworks/README]] 提供更广阔的框架对比视角。
5. **关注协议与安全**：MCP/A2A（L11）与加密收据（L18）是 2026 年 Agent 生产化与合规化的关键主题。

---

## 与 Microsoft GenAI For Beginners 的关系

> 本课程（AI Agents for Beginners）是 [[90_学习/courses/microsoft/microsoft_genai_for_beginners]] 的进阶姊妹篇。前者聚焦“如何让 LLM 自主行动”，后者聚焦“如何使用与部署生成式 AI”。
>
> | 维度 | Generative AI For Beginners | AI Agents for Beginners |
> |------|----------------------------|-------------------------|
> | **重点** | LLM、提示工程、RAG、应用构建 | Agent 设计模式、工具调用、多代理、协议、安全 |
> | **课时** | 21 节 + 设置 | 16 节正式课 + 设置 |
> | **框架** | Python / TypeScript | MAF + Azure AI Agent Service |
> | **目标** | 学会使用生成式 AI | 学会构建可行动的 AI Agent |
>
> 建议：先完成 Generative AI 课程建立 LLM 基础，再学习本课程深入 Agent 工程。

---

## 相关阅读

- [[90_学习/Courses/microsoft/microsoft_ai_agents_for_beginners]] — 外部源引用索引
- [[90_学习/courses/microsoft/microsoft_genai_for_beginners]] — 生成式 AI 初学者课程映射
- [[90_学习/courses/microsoft/microsoft_ai_for_beginners]] — Microsoft 12 周 AI 基础课程映射
- [[90_学习/guides/ai_engineering_roadmap_2026]] — AI 工程师学习路线
- [[90_学习/guides/learning_paths_2026]] — 本库学习路径总览

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
