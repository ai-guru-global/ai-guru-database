---
title: "L10 生产化 AI Agent：可观测性与评估（Observability & Evaluation）"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - production
  - observability
  - evaluation
  - opentelemetry
  - cost-optimization
sources:
  - "原始/github-sources/ai-agents-for-beginners/10-ai-agents-production/README.md"
summary: "Microsoft AI Agents 课程第10课：用 Traces/Spans 把 Agent 从黑盒变玻璃盒、七大核心指标（延迟/成本/错误/反馈/准确率）、离线 vs 在线评估闭环、SLM/Router/Cache 三大降本策略，以及 MAF 原生 OpenTelemetry 集成。"
provenance:
  extracted: 0.86
  inferred: 0.12
  ambiguous: 0.02
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Microsoft Ai Agents L10 Production"
  - "Microsoft AI Agents L10 Production"
  - Microsoft_AI_Agents_L10_Production

---
# L10 生产化 AI Agent：可观测性与评估

> 来源：[Microsoft AI Agents for Beginners / 10-ai-agents-production](https://github.com/microsoft/ai-agents-for-beginners/tree/main/10-ai-agents-production)

## 学习目标

完成本课后，你将理解：

- Agent 可观测性（observability）与评估（evaluation）核心概念
- 提升性能、成本与有效性的技术
- 系统化评估 Agent 的"评什么、怎么评"
- 生产环境成本控制
- Microsoft Agent Framework 的可观测性埋点

> **目标**：把"黑盒 Agent"变成"玻璃盒"——透明、可管、可靠。

---

## 一、Traces 与 Spans：可观测性的基本单位

可观测性工具（[Langfuse](https://langfuse.com/)、[Microsoft Foundry](https://learn.microsoft.com/azure/ai-foundry/what-is-azure-ai-foundry)）用树状结构表示 Agent 运行：

| 单位 | 含义 | 例子 |
|------|------|------|
| **Trace** | 一个完整任务的开始到结束 | 处理一次用户查询 |
| **Span** | Trace 内的单个步骤 | 调用 LLM、检索数据、调用工具 |

没有可观测性，Agent 是"黑盒"——内部状态与推理对开发者不透明，难诊断、难优化。有了它，Agent 变成"玻璃盒"。

---

## 二、为什么生产环境必须可观测

| 价值 | 说明 |
|------|------|
| **调试与根因分析** | Agent 失败时，trace 帮你精确定位错误源（哪个 LLM 调用？哪个工具？哪段条件分支？） |
| **延迟与成本管理** | 按 token/调用计费的服务需精确追踪——找到慢操作、贵操作 |
| **信任/安全/合规** | 审计 Agent 的每个动作与决策；检测 prompt injection、有害内容、PII 误处理 |
| **持续改进闭环** | 监控数据 → 离线实验 → 验证改动 → 反哺生产 |

---

## 三、七大核心指标

| 指标 | 关键问题 |
|------|----------|
| **Latency（延迟）** | Agent 多快响应？任务级 + 步骤级都要测 |
| **Costs（成本）** | 单次运行花多少？频繁工具调用会快速累积 |
| **Request Errors（请求错误）** | 多少请求失败？API/工具失败的兜底策略 |
| **User Feedback（显式反馈）** | 👍/👎、1-5 星、文字评价 |
| **Implicit User Feedback（隐式反馈）** | 用户立即重述问题、重复查询、点 retry——都是负面信号 |
| **Accuracy（准确率）** | 多频繁产出正确/理想结果？先定义"成功" |
| **Automated Evaluation Metrics** | 用 LLM-as-Judge 评分；[RAGAS](https://docs.ragas.io/) 评 RAG；[LLM Guard](https://llm-guard.com/) 检测有害语言 |

**实操**：组合多个指标才能完整覆盖 Agent 健康度。

---

## 四、Agent 埋点（Instrumentation）

### OpenTelemetry（OTel）—— 行业标准

OTel 已成为 LLM 可观测性的标准，提供 API/SDK/工具集生成与导出 telemetry。**Microsoft Agent Framework 原生集成 OpenTelemetry**：

```python
from agent_framework.observability import get_tracer, get_meter

tracer = get_tracer()
meter = get_meter()

with tracer.start_as_current_span("agent_run"):
    # Agent 执行自动被追踪
    pass
```

### 手动 Span 创建

自动埋点不够时，手动加 span 注入业务属性（`user_id` / `session_id` / `model_version` 等），便于调试与分析：

```python
from langfuse import get_client

langfuse = get_client()
span = langfuse.start_span(name="my-span")
span.end()
```

---

## 五、评估：离线 vs 在线

| 维度 | Offline Evaluation | Online Evaluation |
|------|--------------------|-------------------|
| **环境** | 受控测试集 | 真实生产流量 |
| **数据** | 已知 ground truth 的数据集（如 [GSM8K](https://huggingface.co/datasets/gsm8k)） | 真实用户交互 |
| **优势** | 可重复；明确准确率 | 捕获实验室预期不到的情况；观察 model drift |
| **挑战** | 测试集要保持新鲜与多样 | 难拿到可靠标签；需依赖用户反馈或下游指标 |
| **适用阶段** | 开发期；可入 CI/CD | 上线后持续监控；含 shadow/A/B 测试 |

### 闭环工作流

```
offline eval → deploy → online monitor → 收集新失败案例
   ↑                                          ↓
   └────── 加入离线数据集 ←── refine agent ←──┘
```

两种评估**互补**：离线给信心上线，线上发现新案例反哺离线集。

---

## 六、常见生产问题与对策

| 问题 | 对策 |
|------|------|
| Agent 任务完成不一致 | 精炼 prompt、明确目标；拆子任务交多 Agent |
| Agent 陷入死循环 | 设明确终止条件；复杂任务换大模型（reasoning 专长） |
| 工具调用表现差 | Agent 外独立测试工具输出；精炼参数/prompt/工具命名 |
| 多 Agent 不一致 | 各 Agent 提示要明确互斥；用 routing/controller Agent 做层级编排 |

---

## 七、成本控制三大策略

### 1. 使用 SLM（Small Language Model）

小型模型在 intent classification、参数抽取等简单任务上表现不输 LLM，但成本数量级更低。**用评估系统对比 SL M vs LLM 在你具体用例上的表现**——别凭直觉 ^[inferred]。

### 2. Router Model（路由模型）

用 LLM/SLM/serverless function 做**请求分流**：

- 简单查询 → 小而快的模型
- 复杂推理 → 昂贵的大模型

### 3. Caching（缓存）

识别高频请求与工作流，**在进入 Agent 系统前**直接返回缓存结果。可用基础相似度模型判断"当前请求 vs 已缓存请求"的接近度。FAQ 场景成本可降一个数量级。

---

## 与其他课的衔接

- 本课是 [[智能体/Course_Notes/Microsoft_AI_Agents_L09_Metacognition]] 的生产化版本——元认知在生产中靠**评估闭环**实现
- 与 [[模型运维/GenAI_L14_GenAI_Application_Lifecycle]] 互补：那节讲 GenAI 应用通用生命周期，本节专攻 Agent 可观测性

---

## 关联阅读

- [[智能体/Course_Notes/Microsoft_AI_Agents_L09_Metacognition]] — 上一课：元认知
- [[智能体/Course_Notes/Microsoft_AI_Agents_L11_Agentic_Protocols]] — 下一课：Agentic 协议
- [[智能体/Course_Notes/Microsoft_AI_Agents_L06_Trustworthy_Agents]] — L06 可信 Agent（审计与 HITL）
- [[模型运维/GenAI_L14_GenAI_Application_Lifecycle]] — GenAI 应用生命周期
- [[运维/README]] — 本仓库 AI Ops 主题（如有）
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
