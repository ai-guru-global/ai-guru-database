---
title: "L13 Agent 记忆：七种记忆类型、Mem0/Cognee/Azure AI Search 实现"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - memory
  - mem0
  - cognee
  - azure-ai-search
  - self-improving
sources:
  - "_raw/github-sources/ai-agents-for-beginners/13-agent-memory/README.md"
summary: "Microsoft AI Agents 课程第13课：Agent 记忆七种类型（Working/Short-term/Long-term/Persona/Episodic/Entity/Structured RAG）、三大实现工具（Mem0 双阶段管道、Cognee 知识图谱、Azure AI Search 结构化 RAG），以及 Knowledge Agent 自我改进模式。"
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
---

# L13 Agent 记忆：七种类型与三大实现

> 来源：[Microsoft AI Agents for Beginners / 13-agent-memory](https://github.com/microsoft/ai-agents-for-beginners/tree/main/13-agent-memory)

## 学习目标

完成本课后，你将能够：

- 区分 Working / Short-term / Long-term / Persona / Episodic / Entity / Structured RAG 等记忆类型
- 用 Microsoft Agent Framework + Mem0 / Cognee / Azure AI Search 实现短/长期记忆
- 理解"自改进 Agent"原理与 Knowledge Agent 模式

> 没有记忆的 Agent 是无状态的——每次互动从零开始，体验糟糕。记忆让 Agent 变得 **Reflective / Interactive / Proactive / Autonomous**。

---

## 一、七种记忆类型

| 类型 | 时间尺度 | 内容 | Travel Agent 示例 |
|------|----------|------|-------------------|
| **Working Memory** | 单步任务 | 像便签纸,捕获当前任务最相关信息 | "用户要订去巴黎的行程" |
| **Short Term Memory** | 单次会话 | 当前对话所有轮次 | "across there" = "Paris"（同会话内指代） |
| **Long Term Memory** | 跨会话持久 | 用户偏好、历史、通用知识 | "Ben 喜欢滑雪,要山景咖啡,因伤避高级道" |
| **Persona Memory** | 角色持久 | Agent 自身的人设 | "Expert ski planner" 的语气与知识 |
| **Workflow/Episodic Memory** | 跨会话 | 步骤序列,含成败 | 上次订某航班失败,下次主动尝试替代 |
| **Entity Memory** | 跨会话 | 提取的人物/地点/事件 | 抽取 "Paris"/"Eiffel Tower"/"Le Chat Noir" |
| **Structured RAG** | 跨会话 | 结构化抽取增强检索 | 解析航班确认邮件的 (dest, date, time, airline) 字段 |

**Structured RAG ≠ 经典 RAG**：经典 RAG 只靠语义相似度，Structured RAG 利用信息**固有结构**——可达"超人级的精确率与召回率" ^[extracted]。

---

## 二、三大实现工具

### 1. Mem0 —— 双阶段记忆管道

把无状态 Agent 变有状态。**两阶段流程**：

```
1. Extraction: 消息 → LLM 总结历史 + 抽取新记忆
2. Update    : LLM 判断 add / modify / delete
              → 存入混合数据存储(vector + graph + KV)
```

支持多种记忆类型与 graph memory 管理实体关系。

### 2. Cognee —— 知识图谱语义记忆

开源语义记忆，把结构化/非结构化数据**转为可查询的知识图谱**（基于 embedding）。

**双存储架构**：

- Vector similarity（找相似）
- Graph relationships（找关联）

→ Agent 不只懂"什么相似"，更懂"概念如何关联"。

**Hybrid retrieval** 融合向量相似度 + 图结构 + LLM 推理，支持短期会话 + 长期持久记忆，作为**单一连接图**演进增长。

### 3. Azure AI Search —— 结构化 RAG 后端

Azure AI Search 提供生产级 Structured RAG，从对话历史、邮件、图像中提取稠密结构化信息。比传统 text chunking + embedding 达到"超人 precision/recall"^[extracted]。

---

## 三、自改进 Agent：Knowledge Agent 模式

**Knowledge Agent** 是与主 Agent 并行的"观察员 Agent"：

```
┌─────────────────┐
│   User          │
│   ↓ ↑           │
│ Primary Agent   │
│   ↓ ↑           │
└─────────────────┘
       ↑ 观察
┌─────────────────┐
│ Knowledge Agent │ ← 4 步循环:
│  1. 识别有价值信息│
│  2. 抽取摘要      │
│  3. 存入知识库    │
│  4. 增强未来查询  │ ─→ 向 Primary Agent 注入相关记忆
└─────────────────┘
```

新查询到来时，Knowledge Agent 检索相关历史记忆并**追加到 Primary Agent 的 prompt**——本质是 RAG 模式的应用。

### 优化

- **延迟管理**：先用便宜快速模型判断"信息是否值得存"——值得才触发昂贵的抽取/检索流程
- **冷热分层**：低频信息迁到 cold storage 控成本

---

## 与其他课的衔接

- 本课是 [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L12_Context_Engineering]] 的具体落地——记忆是上下文工程六大策略之一
- Episodic Memory 与 [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L09_Metacognition]] 中的"反思过往经验"同源 ^[inferred]
- Cognee 知识图谱呼应 [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L11_Agentic_Protocols]] 中 A2A 的 Agent Card 概念

---

## 关联阅读

- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L12_Context_Engineering]] — 上一课：上下文工程
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L14_Microsoft_Agent_Framework]] — 下一课：MAF 深度
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents/Microsoft_AI_Agents_L09_Metacognition]] — L09：元认知 + 反思
- [[15_Agent_Production/Memory_Infrastructure/README]] — 本仓库记忆基础设施总览
- [[15_Agent_Production/Hello_Agents_L08_Memory_RAG]] — Hello-Agents 课程的 Memory+RAG
- [[14_RAG_Systems/README]] — RAG 主题
- [[90_Learn/courses/microsoft/microsoft_ai_agents_for_beginners]] — 课程总览
