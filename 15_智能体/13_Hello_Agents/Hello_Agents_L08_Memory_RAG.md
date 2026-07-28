---
title: "Hello-Agents L08：记忆与检索（Memory System + RAG）"
category: "15-agent-production"
tags:
  - ai-agents
  - memory
  - rag
  - vector-database
  - qdrant
  - neo4j
  - hello-agents
sources:
  - "原始/github-sources/hello-agents/docs/chapter8/第八章 记忆与检索.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第八章笔记：借鉴人类记忆分层设计 Agent 记忆系统，实现工作/情景/语义/感知记忆，并构建 RAG Pipeline 解决 LLM 知识局限。"
provenance:
  extracted: 0.74
  inferred: 0.21
  ambiguous: 0.05
base_confidence: 0.83
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Hello Agents L08 Memory Rag"
  - "Hello Agents L08 Memory RAG"
  - Hello_Agents_L08_Memory_RAG

name_zh: "Hello-Agents L08：记忆与检索"
---
# Hello-Agents L08：记忆与检索

> 中文简称：Hello-Agents L08：记忆与检索

> **一句话理解**: 本章为 HelloAgents 框架引入 **记忆系统** 与 **RAG（检索增强生成）**，借鉴人类记忆分层（感觉/工作/长期记忆）解决 LLM 无状态遗忘与内置知识静态有限的问题。

---

## 1. 人类记忆系统的启发

| 层次 | 持续时间 | 容量 | 作用 |
|------|----------|------|------|
| 感觉记忆（Sensory Memory） | 0.5–3 秒 | 巨大 | 暂存感官信息 |
| 工作记忆（Working Memory） | 15–30 秒 | 7±2 个项目 | 当前任务处理 |
| 长期记忆（Long-term Memory） | 终生 | 几乎无限 | 程序性 / 陈述性（语义 + 情景） |

表格基于教材图 8.1 整理 ^[extracted]。

---

## 2. LLM 的两个根本性局限

### 2.1 无状态导致的对话遗忘

- 每次 API 调用独立，模型不会自动记住历史
- 问题：上下文丢失、个性化缺失、学习能力受限、一致性差 ^[extracted]

### 2.2 内置知识的局限

- 训练数据有截止日期，知识静态且有限
- 问题：知识时效性不足、专业领域深度不够、事实幻觉、缺乏可解释性 ^[extracted]

---

## 3. HelloAgents 记忆系统架构

采用四层设计 ^[extracted]：

```
HelloAgents 记忆系统
├── 基础设施层
│   ├── MemoryManager（统一调度）
│   ├── MemoryItem（标准化记忆项）
│   ├── MemoryConfig（配置管理）
│   └── BaseMemory（通用接口）
├── 记忆类型层
│   ├── WorkingMemory（工作记忆，TTL 管理）
│   ├── EpisodicMemory（情景记忆，事件序列）
│   ├── SemanticMemory（语义记忆，知识图谱）
│   └── PerceptualMemory（感知记忆，多模态数据）
├── 存储后端层
│   ├── QdrantVectorStore（向量存储）
│   ├── Neo4jGraphStore（图存储）
│   └── SQLiteDocumentStore（文档存储）
└── 嵌入服务层
    ├── DashScopeEmbedding
    ├── LocalTransformerEmbedding
    └── TFIDFEmbedding
```

### 3.1 记忆类型说明

- **WorkingMemory**: 临时信息，纯内存，TTL 过期自动清理
- **EpisodicMemory**: 具体事件，按时间序列存储
- **SemanticMemory**: 抽象知识，适合用图结构表达关系
- **PerceptualMemory**: 多模态原始数据（图像、音频等）^[inferred]

---

## 4. HelloAgents RAG 系统架构

```
HelloAgents RAG 系统
├── 文档处理层
│   ├── DocumentProcessor（多格式解析）
│   ├── Document（文档对象 + 元数据）
│   └── Pipeline（端到端处理）
├── 嵌入表示层
│   └── 复用记忆系统嵌入服务
├── 向量存储层
│   └── QdrantVectorStore（命名空间隔离）
└── 智能问答层
    ├── 多策略检索：向量检索 + MQE + HyDE
    ├── 上下文构建：智能片段合并与截断
    └── LLM 增强生成
```

架构图基于教材整理 ^[extracted]。

### 4.1 多策略检索

- **向量检索**: 基于语义相似度召回
- **MQE（Multi-Query Expansion）**: 生成多个查询扩展召回范围 ^[inferred]
- **HyDE（Hypothetical Document Embedding）**: 用假设答案生成嵌入以提升召回 ^[inferred]

---

## 5. 工具封装

- `memory_tool`: 负责存储和维护对话过程中的交互信息
- `rag_tool`: 从外部知识库检索信息，并可将重要结果自动存入记忆系统 ^[extracted]

---

## 6. 关联阅读

- [[14_RAG系统/RAG_Systems]] — RAG 系统总览
- [[14_RAG系统/01_RAG_Fundamentals/GenAI_L15_RAG_and_Vector_Databases]] — RAG 与向量数据库
- [[14_RAG系统/03_Vector_Databases/Qdrant_Deep_Dive]] — Qdrant 向量数据库
- [[14_RAG系统/04_Advanced_RAG/Agentic_RAG_Guide]] — Agentic RAG 指南
- [[05_大模型/08_Prompt_Engineering/Hello_Agents_L09_Context_Engineering]] — 上下文工程

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
