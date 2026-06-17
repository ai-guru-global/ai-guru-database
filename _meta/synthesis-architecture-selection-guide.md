---
title: "AI 系统架构选型决策树：从任务类型到技术栈"
tags: [synthesis, architecture, model-selection, inference-engine, agent-framework, decision-tree, routing, multi-agent]
type: synthesis
created: 2026-06-17
---

# AI 系统架构选型决策树：从任务类型到技术栈

> **核心洞察**：没有银弹架构。选型的关键不是追求"最强"，而是在任务类型、延迟要求、成本预算、可靠性需求四个维度上找到最优匹配点。"中等模型 + 精心设计的系统" 永远优于 "顶级模型 + 混乱的架构"。

---

## 1. 任务类型 → 系统形态决策树

```
你的 AI 系统要做什么？
│
├── 单轮问答 / 文本生成 / 翻译 / 摘要
│   └── → 简单 LLM 调用 + Prompt Engineering
│       模型: Haiku / GPT-4o-mini (成本优先)
│       框架: 直接 API 调用即可
│
├── 知识库问答 / 文档检索
│   └── → RAG 系统
│       模型: Sonnet / GPT-4o (均衡)
│       框架: LlamaIndex / LangChain
│       存储: 向量数据库 (Chroma → Pinecone → Milvus)
│
├── 多轮对话 / 客服助手
│   └── → 有状态对话系统 + RAG
│       模型: 路由架构 (Haiku Router → Sonnet/Opus)
│       框架: LangGraph (状态机) / OpenClaw (运行时)
│       记忆: 短期 (Redis) + 长期 (Vector DB)
│
├── 自主编码 / 数据分析 / 多步任务
│   └── → 单智能体 (Agent)
│       模型: Sonnet 4.6 / Opus 4.8 (质量优先)
│       框架: Claude Code / OpenClaw / LangGraph
│       Harness: 工具层 + 沙箱 + 可观测性
│
├── 复杂项目 / 多角色协作 / 全流程自动化
│   └── → 多智能体系统 (Multi-Agent)
│       模型: 混合路由 (不同角色用不同模型)
│       框架: CrewAI / LangGraph / Claude Code Subagents
│       编排: Orchestrator-Subagent (主流) / Peer-to-Peer
│
└── 定时任务 / CI 集成 / 全自动流水线
    └── → 无头 Agent + 自动化
        模型: 按任务复杂度路由
        框架: Claude Code SDK / OpenClaw Cron / Managed Agents
        触发: Cron / Webhook / API
```

参见 [[Agentic_AI_Complete_Guide]]、[[AgentOps_Production_Guide]]、[[Claude_Agent_Architecture]]。

---

## 2. 模型选型：推理模型 vs 快速模型

### 2.1 核心决策树

```
任务复杂度分析
│
├── 简单 / 直接 / 模式匹配
│   └── 快速模型 (System 1)
│       Haiku 4.5 / GPT-4o-mini / Llama 8B
│       延迟: <1s | 成本: 最低
│
├── 中等 / 需要分析 / 代码生成
│   └── 均衡模型 (System 1.5)
│       Sonnet 4.6 / GPT-4o
│       延迟: 1-5s | 成本: 中等
│       ← 默认首选
│
├── 复杂推理 / 数学 / 架构设计
│   └── 推理模型 (System 2)
│       Opus 4.8 / o1 / DeepSeek-R1
│       延迟: 3-60s | 成本: 较高
│
└── 混合场景 (生产系统)
    └── 路由架构 (Model Router)
        Haiku 做意图分类 → 按复杂度分流
```

参见 [[Claude_Complete_Guide#2]]、[[AI_Reasoning_Models_Guide]]。

### 2.2 推理模型的 ROI 决策

参见 [[Claude_Complete_Guide#8]]、[[Claude_Agent_Architecture#5]]。

```
是否值得开 Thinking = 
    节省的重试成本 + 减少的人工成本 + 降低的故障成本
    是否大于 Thinking Tokens × 输出单价
```

**Agent 系统中的混合策略**：
- Planner / Reviewer → 开启 Thinking（深思熟虑）
- Executor / Retriever → 快速模式（快速执行）

### 2.3 模型路由架构

参见 [[Claude_Complete_Guide#2.2]]、[[Context_Engineering_Guide#7.3]]。

```
用户请求 → Haiku Router（意图分类）
├── 创意写作 / 复杂推理 → Opus 4.8
├── 代码 / 分析 / RAG  → Sonnet 4.6
├── 简单提取 / 分类    → Haiku 4.5
└── 成本敏感场景       → 本地模型 (Ollama)
```

**路由策略**：
- 难度分级：关键词匹配分流
- 降级策略：Sonnet 超时 → 自动降级 Haiku
- VIP 策略：免费用户 Haiku，付费用户 Sonnet/Opus

---

## 3. 推理引擎选型

### 3.1 服务引擎决策树

参见 [[LLM_Inference_Deep_Dive]]。

```
部署形态
│
├── 云端 API (零运维)
│   └── OpenAI / Anthropic / Google API
│       优势: 零基础设施管理
│       劣势: 延迟不可控、数据出境
│
├── 自托管 (生产级)
│   ├── 高吞吐 → vLLM / SGLang
│   │   核心: 连续批处理 + PagedAttention
│   │   吞吐提升: 2-10x
│   │
│   ├── 低延迟 → TensorRT-LLM
│   │   核心: 高度优化的推理内核
│   │   优势: 首 Token 延迟最优
│   │
│   └── 轻量级 → Ollama / llama.cpp
│       核心: 单机部署、开发测试
│       量化: INT4/INT8 支持
│
└── 边缘部署
    └── llama.cpp / MLX / ONNX Runtime
        核心: CPU/Metal 推理、内存优化
```

### 3.2 关键优化技术选型

参见 [[LLM_Inference_Deep_Dive]]。

| 技术 | 解决的问题 | 加速比 | 适用条件 |
|------|-----------|--------|---------|
| **KV Cache** | 避免重复计算历史 K/V | 推理基石 | 所有自回归生成 |
| **GQA** | KV 缓存过大 | 缓存减至 1/8 | Llama 2+ 架构 |
| **MLA** | KV 缓存极端压缩 | 再压缩 5-7x | DeepSeek-V3 架构 |
| **Flash Attention** | 注意力计算瓶颈 | 2-4x | GPU 部署 |
| **量化 (INT8/INT4)** | 显存和带宽瓶颈 | 2-4x | 精度可接受损失 |
| **投机解码** | 自回归串行瓶颈 | 1.5-2.5x | 有合适草稿模型 |
| **连续批处理** | 请求利用率低 | 吞吐 2-10x | 多并发场景 |
| **分离式 Prefill-Decode** | 延迟抖动 | 消除干扰 | 大规模部署 |

### 3.3 量化精度 vs 速度权衡

| 量化级别 | 精度影响 | 速度提升 | 推荐场景 |
|---------|---------|---------|---------|
| FP16 (基线) | 无损失 | 1x | 精度敏感任务 |
| INT8 | 几乎无损 | ~2x | 通用生产部署 |
| INT4 (GPTQ/AWQ) | 可控损失 | ~4x | 资源受限场景 |
| FP8 | 极小损失 | ~2x | H100/B200 新硬件 |

---

## 4. Agent 框架选型

### 4.1 六种框架形态

参见 [[AgentOps_Production_Guide#1]]。

| 形态 | 代表框架 | 核心特征 | 适用场景 |
|------|---------|---------|---------|
| **链式编排** | LangChain LCEL | 固定顺序串联 | 简单线性管道 |
| **图编排/状态机** | LangGraph | 条件路由、循环、检查点 | 企业级业务流 |
| **多智能体协作** | CrewAI, AG2 | 角色分工、对话编排 | 创意/自动化 |
| **数据/RAG 驱动** | LlamaIndex | 索引/检索为一等公民 | 知识密集型 |
| **企业级 SDK** | MS Agent Framework | 身份、权限、审计 | 既有系统集成 |
| **低代码平台** | Dify, LangFlow | 可视化拖拽 | 快速原型 |

### 4.2 单智能体 vs 多智能体

参见 [[Multi_Agent_Systems_Guide#1]]、[[Claude_Agent_Architecture#6]]。

```
是否需要多智能体？
│
├── 任务可被单个 Agent 处理
│   └── 单智能体
│       优势: 简单、可控、成本低
│       实现: Claude Code / OpenClaw / LangGraph
│
├── 需要专业化分工
│   └── Orchestrator-Subagent (最主流)
│       Boss 拆任务分发，Worker 执行回报
│       优势: 全局目标不漂移，易做权限控制
│       代价: Boss 成瓶颈，通信开销
│
├── 需要多视角碰撞/互相纠错
│   └── Peer-to-Peer
│       适合: 探索性任务、头脑风暴
│       难点: 发言顺序和仲裁更难
│
└── 固定流程 / SOP
    └── 顺序式 (Sequential)
        上一个 Output = 下一个 Input
        适合: 线性、确定性流程
```

**选型原则**："必须交付、可控回放、可审计" → 先 Orchestrator-Subagent。

### 4.3 框架选型决策矩阵

参见 [[AgentOps_Production_Guide#1.2]]。

| 维度 | 链式 | 图编排 | 多智能体 | 数据/RAG | 企业级 SDK |
|------|------|--------|---------|---------|-----------|
| 可控性 | 中 | **高** | 中-高 | 中 | **高** |
| 易用性 | **高** | 中 | 中 | 中 | 中 |
| 知识检索 | 依赖外部 | 依赖外部 | 依赖外部 | **强** | 依赖外部 |
| 治理审计 | 依赖外部 | 可增强 | 需额外设计 | 需额外设计 | **强** |

### 4.4 三种生产 Agent 架构对比

参见 [[Harness_Engineering_Complete_Guide#3.3]]。

| 维度 | OpenAI Codex | Claude Code | OpenClaw |
|------|-------------|-------------|---------|
| 定位 | 性能型 | 任务型 | 自驱型 |
| 运行时 | Rust + JSON-RPC | 异步生成器 | 线性流水线 |
| 编排 | Subagent 层级 | Coordinator 动态 | Lobster 确定性 |
| 安全 | execpolicy + 沙箱 | 权限模式 + protected files | SOUL.md + 三级权限 |
| 记忆 | SQLite + AGENTS.md | 系统提示词缓存 | MEMORY.md + 日志 |

---

## 5. 架构成熟度演进路径

参见 [[AgentOps_Production_Guide#10]]。

```
原型验证 (单 Agent + 基础护栏 + Prompt Engineering)
    │
    v
内部测试 (完善评估 + 可观测性 + Context Engineering)
    │
    v
灰度发布 (A/B 测试 + 人工抽检 + 模型路由)
    │
    v
生产运行 (多租户 + 深度防御 + 持续学习 + 多智能体)
```

### 核心定律

> **智能体本质是 While 循环，框架只是封装了循环里的脏活累活。** 理解底层 Prompt 设计、工具调用和记忆管理才是核心。参见 [[AgentOps_Production_Guide#1.3]]。

---

## 6. 决策检查清单

参见 [[AgentOps_Production_Guide#10.1]]、[[Claude_Agent_Architecture#11]]。

- [ ] 任务类型明确（单轮/多轮/多步/多角色）
- [ ] 模型选择有路由策略（按复杂度分流）
- [ ] 推理引擎匹配部署形态（API/自托管/边缘）
- [ ] Agent 框架匹配团队能力和业务需求
- [ ] 护栏完备（最大步数、成本预算、错误去重、熔断）
- [ ] 可观测性就位（trace_id 透传、链路追踪）
- [ ] 记忆系统分层（短期窗口 + 长期存储）
- [ ] 安全纵深防御（输入验证 + 权限控制 + 输出审核）
- [ ] 评估体系建立（能力评估 + 回归评估）

---

## 相关页面

- [[Agentic_AI_Complete_Guide]] - 智能体 AI 完整指南
- [[Multi_Agent_Systems_Guide]] - 多智能体系统
- [[AgentOps_Production_Guide]] - AgentOps 生产落地
- [[Harness_Engineering_Complete_Guide]] - Harness 工程
- [[Claude_Complete_Guide]] - Claude 模型与选型
- [[Claude_Agent_Architecture]] - Claude Agent 架构
- [[LLM_Inference_Deep_Dive]] - LLM 推理引擎
- [[LLM_Architecture_Evolution]] - LLM 架构演进
- [[AI_Reasoning_Models_Guide]] - 推理模型指南
- [[Context_Engineering_Guide]] - 上下文工程
