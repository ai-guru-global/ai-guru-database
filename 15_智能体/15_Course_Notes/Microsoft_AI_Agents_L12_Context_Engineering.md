---
title: "L12 上下文工程：四类上下文、六大管理策略与四大失败模式"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - context-engineering
  - prompt-engineering
  - context-window
  - rag
sources:
  - "原始/github-sources/ai-agents-for-beginners/12-context-engineering/README.md"
summary: "Microsoft AI Agents 课程第12课：上下文工程≠提示工程——前者管理动态信息流，后者关注静态指令。覆盖四类上下文、六大实操策略（Scratchpad/Memory/Compress/Multi-Agent/Sandbox/Runtime State）与四大失败模式（Poisoning/Distraction/Confusion/Clash）及修复。"
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
  - "Microsoft Ai Agents L12 Context Engineering"
  - "Microsoft AI Agents L12 Context Engineering"
  - Microsoft_AI_Agents_L12_Context_Engineering

---
# L12 上下文工程：四类上下文、六大管理策略与四大失败模式

> 来源：[Microsoft AI Agents for Beginners / 12-context-engineering](https://github.com/microsoft/ai-agents-for-beginners/tree/main/12-context-engineering)

## 学习目标

完成本课后，你将能够：

- **定义** 上下文工程并区分它与提示工程的差异
- **识别** LLM 应用中上下文的关键组件
- **应用** 写入/选择/压缩/隔离策略提升 Agent 表现
- **识别** 四大常见上下文失败并实施缓解

---

## 一、Prompt Engineering vs Context Engineering

| 维度 | Prompt Engineering | Context Engineering |
|------|--------------------|---------------------|
| **焦点** | 单组静态指令、规则 | **动态**信息流的管理 |
| **目标** | 引导 Agent 一次行为 | 确保 Agent 在**时间维度**上始终有所需信息 |
| **关键诉求** | 表达清晰 | 可重复、可靠 |

> **核心区别**：Prompt Engineering 关注"如何说"，Context Engineering 关注"如何让 Agent 始终拥有它需要的所有信息"^[inferred]。

---

## 二、四类上下文

| 类型 | 内涵 | 来源 |
|------|------|------|
| **Instructions（指令）** | 系统消息、prompt、few-shot 示例、工具描述 | 提示工程的领地 |
| **Knowledge（知识）** | 事实、DB 检索结果、长期记忆 | RAG / 向量库 |
| **Tools（工具）** | 外部函数/API/MCP Server 定义 + 调用反馈 | MCP / function calling |
| **Conversation History（对话历史）** | 持续对话；时间越久越占 context window | 用户交互累积 |
| **User Preferences（用户偏好）** | 学到的喜好/厌恶 | 跨会话记忆 |

---

## 三、规划三步法

| 步骤 | 关键问题 |
|------|----------|
| **1. 定义清晰结果** | "Agent 完成任务后世界应该是什么样？" |
| **2. 绘制上下文地图** | "Agent 完成任务需要哪些信息？这些信息在哪？" |
| **3. 建立上下文管道** | "Agent 怎么获取这些信息？"（RAG / MCP / 工具调用） |

---

## 四、六大实操管理策略

| 策略 | 机制 |
|------|------|
| **1. Agent Scratchpad** | 单会话内 Agent 在**context 之外的文件/对象**记笔记，按需取回 |
| **2. Memories** | 跨会话存取——摘要、用户偏好、改进反馈 |
| **3. Compressing Context** | 临近上限时用 summarization + trimming，保留最相关信息 |
| **4. Multi-Agent Systems** | 每个 Agent 各有 context window；规划好如何共享与传递 |
| **5. Sandbox Environments** | 沙盒跑代码/处理大文档，**只把结果**回写 context |
| **6. Runtime State Objects** | 复杂任务把每步子结果存进容器，context 只连当前子任务 |

### 案例对比

| 请求 | 简单 Prompt Agent | Context Engineering Agent |
|------|-------------------|---------------------------|
| "订去巴黎的行程" | "好的,您想什么时候去?" | "你好 [名字]! 看到你 10 月第一周有空。要按您常坐的 [航司] 直飞、[预算] 范围搜索吗?" |

后者先做了：日历查询 → 长期记忆中的偏好 → 可用工具识别 → 综合响应。

---

## 五、四大常见上下文失败模式（关键）

### 1. Context Poisoning（上下文污染）

- **症状**：LLM 幻觉或错误进入 context 被反复引用，Agent 追逐不可能的目标
- **例子**：Agent 幻觉"小机场直飞国际航线"，后续一直找不存在的票
- **修复**：**Context validation + quarantine**——加入长期记忆前先用实时 API 验证；疑似污染就开新 context thread

### 2. Context Distraction（上下文分心）

- **症状**：Context 太大，模型过度依赖累积历史而非训练知识，产出重复或无用动作
- **例子**：聊了很久背包旅行后问"下个月便宜机票"，Agent 一直问背包装备
- **修复**：**Context summarization**——按轮数/体积阈值触发压缩

### 3. Context Confusion（上下文混淆）

- **症状**：可用工具太多导致模型选错工具或乱调；小模型尤其脆弱
- **例子**：有几十个工具时问"巴黎怎么出行"，Agent 试图在巴黎市内"订机票"
- **修复**：**Tool Loadout Management**——用 RAG 检索工具描述，**每次只呈现最相关的几个**（研究表明**少于 30**）

### 4. Context Clash（上下文冲突）

- **症状**：Context 内存在矛盾信息，导致不一致推理
- **例子**：先说"经济舱"后改"商务舱"，两条都在 context 里 → Agent 困惑
- **修复**：**Context pruning + offloading**——新指令到达时删旧；或用 scratchpad 先调和冲突再写入主 context

---

## 与其他课的衔接

- 本课是 [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L13_Agent_Memory]] 的前置——Memory 是上下文工程的核心工具之一
- 与 [[05_大模型/08_Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals]] 互补：那节讲 prompt，本节讲 prompt 之外的整个 context 管理
- Sandbox 策略呼应 [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L06_Trustworthy_Agents]] 中的 Docker 隔离

---

## 关联阅读

- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L11_Agentic_Protocols]] — 上一课：协议
- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L13_Agent_Memory]] — 下一课：Agent 记忆
- [[15_智能体/15_Course_Notes/Microsoft_AI_Agents_L09_Metacognition]] — L09：元认知中的反思也是 context 管理
- [[05_大模型/08_Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals]] — Prompt 基础
- [[14_RAG系统/README]] — RAG 是 Knowledge context 的主要实现
- [[90_学习/courses/microsoft/microsoft_ai_agents_for_beginners]] — 课程总览

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
