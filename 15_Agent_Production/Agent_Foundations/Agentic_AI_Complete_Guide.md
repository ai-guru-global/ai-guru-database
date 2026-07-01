---
title: "智能体 AI 权威指南 Part 1: 单体智能架构全解"
category: 15-agent-production-agent-foundations
tags: [agentic-ai, agent-paradigm, reasoning, CoT, ReAct, Reflexion, memory-systems, RAG, vector-db, graph-memory, MCP, tool-use, agentic-ux, context-engineering]
summary: "从范式革命到认知层级、推理规划、记忆系统到工具交互，系统梳理单体智能体架构的完整知识图谱"
created: 2026-06-16
updated: 2026-06-16
source: "_sources/yeasy/agentic_ai_guide/ (Ch1-4)"
tier: supporting
aliases:
  - "Agentic Ai Complete Guide"
  - "Agentic AI Complete Guide"
  - Agentic_AI_Complete_Guide

---
# 智能体 AI 权威指南 Part 1: 单体智能架构全解

> Source: 智能体 AI 权威指南 (yeasy) Part 1, Ch1-4
> Related: [[Multi_Agent_Systems_Guide]] | [[AgentOps_Production_Guide]] | [[Context_Engineering_Guide]] | [[Prompt_Engineering_Complete_Guide]]

---

## 1. 智能体范式革命

### 1.1 从 LLM 到智能体的范式转移

核心差异不在模型本身，而在**交互范式**：

| 维度 | 传统 LLM | 智能体 AI |
|------|---------|-----------|
| 目标 | 下一个 Token 预测 | 目标达成 (Goal-oriented) |
| 状态 | 无状态函数 | 有状态 (长期记忆 + 任务状态 + 环境状态) |
| 执行模式 | 单次推理 (输入->输出) | 主动循环 (思考->行动->观察->循环) |
| 能力边界 | 知识截止日 | 工具扩展后的动态能力 |

**核心洞察**：智能体 AI 的本质是在 LLM (强大的 System 1) 外层，用工程手段 (上下文工程、记忆系统、工具系统) 包裹了一层 System 2 的逻辑外壳。

### 1.2 理论基础: POMDP 建模

智能体与环境的交互在数学上建模为 **部分可观测马尔可夫决策过程 (POMDP)**：

- **信念状态 (Belief State)** $b_t = f(b_{t-1}, a_{t-1}, o_t)$ -- 上下文窗口就是信念状态的文本化表示
- **策略函数** -- LLM + 外层控制逻辑
- **记忆即状态** -- RAG 和长上下文窗口的本质是帮助智能体在部分可观测世界中更好地估计信念状态

**理性智能体决策公式**: $a^* = \arg\max_{a \in A} \mathbb{E}[U(s') | s, a]$

在 LLM 智能体中，效用函数 U 经历了有趣演变：
- **隐式效用**: RLHF 训练内化的人类价值观
- **指令即目标**: System Prompt 定义当前任务的效用边界

### 1.3 核心组件架构

```
用户指令 --> 感知 (文本/多模态/环境) --> 大脑 (拆解/规划/反思) <--> 记忆 (短期 & 长期)
                                    |
                                    v
                              行动 (工具 & 输出) --> 策略网关与沙箱 --> 目标系统
```

**Agent 时代思考三维框架** (黄东旭, QCon 2026):

1. **Goal (目标工程)** -- Skill 定义 + 人机交互
2. **Context (上下文工程)** -- Harness/Memory + RAG + 信息环境
3. **Constraints (约束)** -- Sandbox + CI/CD/Lint + Agent Infra

> 关键洞察：Agent 的能力不只取决于模型的智力，更取决于这三个维度的设计完整性和平衡。

---

## 2. 认知层级模型 (L1-L5)

| 层级 | 定位 | 核心特征 | 人类类比 | 实现要素 |
|------|------|---------|---------|---------|
| **L1** | 辅助型 | Talk (对话) | 图书馆员 | RAG, Prompt Engineering |
| **L2** | 执行型 | Do (执行) | 实习生 | ReAct, Tool Use, CoT |
| **L3** | 自主型 | Learn (学习) | 工程师 | Vector DB, Reflexion |
| **L4** | 进化型 | Evolve (进化) | 科学家 | Self-Coding, APE |
| **L5** | 群体型 | Connect (连接) | 公司/社会 | Multi-Agent, SOP |

**设计启示**:
- L1 足够好: 知识库问答不需 L2 的工具调用
- L2 是基石: 大多数企业级应用应稳定在 L2
- L3 慎用: 金融交易等高可靠场景需审慎
- L4/L5 仍处于研究阶段

---

## 3. 推理、规划与提示词工程

### 3.1 思维链 (CoT) -- 线性推理

> CoT 的核心机制（分解复杂问题、利用中间结果、激活训练模式）、自一致性投票、思维树详见 [[Prompt_Engineering_Complete_Guide#6-思维链与推理增强chain-of-thought]]。此处仅保留智能体工程视角的要点：

**核心变体**:

| 变体 | 论文 | 核心机制 | 适用场景 |
|------|------|---------|---------|
| Zero-shot CoT | Kojima 2022 | "Let's think step by step" | 通用简单任务 |
| Few-shot CoT | Wei 2022 | 含推理步骤的示例 | 质量更高, 格式可控 |
| Self-Consistency | Wang 2022 | 多路径采样 + 多数投票 | 高风险决策 |
| 内在 CoT / System 2 推理 | o-series | 模型内部扩展思考 | 复杂任务 |

**智能体工程最佳实践**:
- 使用分隔符 (`<thinking>`, `<answer>`) 分离推理与答案
- 单路推理: `temperature=0`; 投票: `temperature>0.5`
- 明确推理框架 (Analyze -> Plan -> Reasoning -> Conclusion)

### 3.2 任务分解算法

| 算法 | 核心特征 | 优点 | 缺点 | 适用场景 |
|------|---------|------|------|---------|
| **CoT** | 线性链 | 简单、低成本 | 无法纠错 | 通用简单指令 |
| **Least-to-Most** | 由易到难顺序分解 | 分解明确 | 单路径, 不能回溯 | 组合泛化、多步数学 |
| **Plan-and-Solve** | 先计划后求解 | 零样本友好 | 计划质量决定上限 | 通用复杂任务 |
| **ToT (思维树)** | 树状搜索 + BFS/DFS | 准确率高, 能回溯 | Token 消耗极大 | 复杂逻辑、代码生成 |
| **GoT (思维图)** | 图状网络 | 极其灵活, 支持聚合 | 实现复杂, 调度难 | 创意写作、多文档摘要 |
| **SoT (骨架思维)** | 并行扩展 | 速度极快 | 细节一致性稍弱 | 文章撰写、报告生成 |

### 3.3 ReAct: 推理与行动的统一

ReAct = Reasoning + Acting, 由 Yao 等 (ICLR 2023) 提出。核心是给思维链接上行动与观察的闭环。

**三要素循环**: Thought (分析) -> Action (工具调用) -> Observation (反馈)

```text
Thought: 我需要先查看天气工具返回的结果
Action: search_weather(location="北京")
Observation: 晴, 15-25C, 无降水预警
Thought: 无降水, 不需要带伞
Action: finish(answer="不需要带伞")
```

**关键工程组件**:
- 历史上下文 (Thought/Action/Observation 轨迹)
- 实时环境输入
- 推理模块 (LLM + ReAct Prompt)
- 工具与技能 (API, Function Calling, 复合 Skill)
- 反馈观察 (工具输出, 错误码, 执行日志)

**生产护栏** (必备):
1. 最大步数限制 (`max_steps`)
2. 状态去重 (连续相同动作检测与干预)
3. Token 预算熔断
4. Observation 结构化清洗

### 3.4 Reflexion: 反思与自我修正

**核心机制**: 失败 -> 反思 (为什么失败) -> 总结 (学到什么) -> 语言记忆注入下一轮

**三要素**:
- **执行者 (Actor)**: 执行任务, 通常采用 ReAct 模式
- **评估者 (Evaluator)**: 判断任务是否成功
- **反思者 (SelfReflection)**: 从失败中提取经验

**与 Self-Refine、CRITIC 的边界**:

| 方法 | 核心反馈来源 | 跨 trial 记忆 | 典型用途 |
|------|------------|-------------|---------|
| **Reflexion** | 任务成败 + 语言反思 | 是 | 失败后总结经验 |
| **Self-Refine** | 模型自生成反馈 | 通常否 | 单个初稿反复润色 |
| **CRITIC** | 外部工具校验 | 不一定 | 事实核验, 代码检查 |

### 3.5 智能体提示词工程

智能体提示词 = **自然语言接口设计**, 六大核心组件:

1. **身份定义 (Identity)** -- 角色、特质、工作风格
2. **能力描述 (Capabilities)** -- 能做/不能做
3. **约束规范 (Constraints)** -- 安全/交互/输出规范
4. **工具定义 (Tools)** -- JSON Schema, 名称明确, 参数完整
5. **输出格式 (Output Format)** -- 结构化、可解析
6. **示例 (Examples)** -- Few-shot 示范

**高级技巧**:
- **提示词缓存**: 静态内容前置, 动态内容后置
- **分层设计**: 基础层 + 角色层 + 任务层 + 上下文层
- **防御性提示词**: 优先级声明 + 输入边界标记
- **元提示**: 用 LLM 优化智能体提示词本身

---

## 4. 记忆系统与上下文工程

### 4.1 记忆的认知模型

**参数记忆 vs 非参数记忆**:
- 参数记忆: 模型权重, 静态, 易幻觉, 难修改
- 非参数记忆: 外部存储 (向量/结构化), 动态, 精确, 易更新

> 智能体系统的本质 = 构建强大的非参数记忆系统

**四层长期记忆** (Atkinson-Shiffrin 启发):

| 记忆类型 | 定义 | Agent 映射 | 存储介质 |
|---------|------|-----------|---------|
| **情景记忆** | 个人经历序列 | 对话日志, 交互历史 | Vector DB |
| **语义记忆** | 事实与世界知识 | 领域文档, 百科知识 | Knowledge Graph / RAG |
| **程序记忆** | 执行任务的技能 | 工具, 代码解释器 | Function Schemas |
| **反思记忆** | 元认知与经验教训 | 优化后的 Prompt, SOP 改进 | 提示词库 / 元数据 |

**斯坦福小镇检索打分**: $Score = \alpha \cdot Recency + \beta \cdot Importance + \gamma \cdot Relevance$

**MemGPT 操作系统隐喻**: 主上下文 (内存) + 外部存储 (硬盘) + 分页调度 (Orchestrator)

### 4.2 短期记忆管理

上下文窗口 = 有限资源, 三大压力: 成本、延迟、注意力稀释 (Lost in the Middle)

**选择策略**:
- 滑动窗口: 保留最近 N 条, O(1) 操作
- Token 预算管理: 按 Token 数设定上限
- 重要性采样: 按分数优先丢弃低分消息

**压缩策略**:
- 对话摘要: LLM 压缩历史为摘要
- 词元压缩: LLMLingua 等移除冗余 Token
- 相关性过滤: 只保留与当前查询相关的信息
- 知识抽取: 非结构化 -> 结构化

**渐进式记忆架构** (7 层):
L1 工具结果磁盘缓存 -> L2 微压缩 (60min) -> L3 Session Memory -> L4 完整压缩 -> L5 自动记忆提取 -> L6 "做梦" 机制 -> L7 子智能体通信

### 4.3 长期记忆与向量数据库

**选型维度**: 部署形态、伸缩高可用、搜索能力、成本模型、生态集成、数据治理

**选型决策树**:
- 快速原型 -> Chroma
- 生产无运维 -> Pinecone
- 自托管 + 混合搜索 -> Weaviate
- 超大规模 (亿级) -> Milvus
- 中小规模高性能 -> Qdrant

**能力边界**: 向量数据库解决"高效找相似内容", 不解决:
- 时间顺序 (新旧事实判定)
- 事实覆盖 (新事实替换旧事实)
- 噪声治理 (过期信息过滤)

### 4.4 RAG 系统设计

**最小可用 RAG 闭环**: 索引 -> 检索 -> 生成 -> 引用/拒答 -> 观测

**智能体 RAG vs 独立 RAG**:
- 智能体在多步推理中**动态决定**何时/是否/从哪里检索
- 检索可能触发**连续多次**检索
- 与工具调用、信息融合、决策制定紧密耦合

**核心评估指标**:

| 指标 | 目标值 | 说明 |
|------|-------|------|
| Recall@K | > 0.85 | 相关文档是否被检索到 |
| Precision@K | > 0.70 | 检索结果中相关文档占比 |
| 幻觉率 | < 0.05 | 无法溯源的事实比例 |
| 检索决策准确性 | > 0.80 | Agent 选择"检索"的决定是否正确 |

### 4.5 图记忆与知识图谱

**何时需要图结构**: 系统需要稳定回答"谁在什么时候与谁发生了什么关系"

**时序知识图谱核心元素**:
- **Entity**: 人、项目、事件等节点
- **Relationship**: 带时间有效期的关系边
- **Episode**: 一次完整交互/事件记录

**混合记忆架构**: 图记忆 (关系) + 向量 RAG (语义) + 全文搜索 (关键词) -> 结果融合 + 重排序 -> 最终上下文

### 4.6 上下文工程四大策略

1. **持久化上下文**: 索引化 + 结构化存储 + 状态快照
2. **筛选上下文**: 向量检索 -> 重排序 -> Token 预算控制
3. **压缩上下文**: 对话摘要 + 信息提取 + 渐进式遗忘
4. **隔离上下文**: 子智能体路由 + 防火墙 + 独立状态机

**ContextPack 标准结构**: `trace_id` + `span_id` + `system` + `tools` + `memory` + `evidence`

**核心定律**: "中等模型 + 精心设计的流程" 远胜于 "顶级模型 + 混乱的架构"

---

## 5. 工具使用与环境交互

### 5.1 MCP (Model Context Protocol)

> MCP 协议的完整架构（Host/Client/Server）、三大构件（Tools/Resources/Prompts）、传输层与上下文工程三层架构详见 [[Context_Engineering_Guide#5.3-model-context-protocol-mcp]]。
> - MCP 解决的核心痛点：从静态集成（手写每个工具描述）到动态发现（运行时发现能力、资源、操作结构）
> - 架构三角：Host (宿主) → Client (1:1 会话) → Server (暴露能力)

### 5.2 智能体技能 (Agent Skills)

> 工具连接协议是**通道**, 技能是**智慧**。协议解决"通过什么做", 技能解决"如何做"。

**三阶段加载**: 发现 (名称+描述) -> 激活 (完整 SKILL.md) -> 执行 (按需加载脚本/资源)

**SkillsBench 实证发现** (2026):
- 人工策展 Skills 显著提升完成率
- 模型现写 Skills 无稳定收益
- 聚焦型 Skill 优于大而全文档
- 小模型 + 好 Skill 可逼近大模型裸跑

### 5.3 浏览器自动化与多模态

- **Computer Use**: 模型操作 GUI, 截图理解, 表单填写
- **多模态感知**: Vision (网页/截图) + Audio (语音识别)

### 5.4 智能体交互体验 (Agentic UX)

**从 Chatbot UI 到 Agentic UI**:
- 富交互: 动态生成 GUI 组件 (React Server Components)
- 协作式: 用户随时介入工作流
- 透明化: 计划摘要 + 当前步骤 + 证据引用

**延迟掩盖策略**:
- 思考状态可视化 (规划/执行/结果阶段)
- Skeleton Screens (骨架屏)
- 流式组件传输 (RSC)

**伴随式交互**:
- 隐式触发 (代码补全、上下文感知建议)
- 画布交互 (Content-First, Diff 视图)
- Human-in-the-Loop (审批/微调/取消)

---

## 6. 智能体工作流模式

四种典型模式:

| 模式 | 工作机制 | 适用场景 |
|------|---------|---------|
| **规划-执行** | 先制定完整计划, 逐步执行 | 结构化任务、可预测流程 |
| **ReAct** | 思考与行动交替, 动态调整 | 探索性任务、不确定环境 |
| **反思-改进** | 执行后自我评估, 迭代改进 | 代码编写、内容创作 |
| **多智能体协作** | 多角色分工, 协同完成 | 复杂项目、多专业技能需求 |

**标准 Agent Loop 核心组件**:
推理器 (Reasoner) -> 动作选择 (Action Selector) -> 工具执行器 (Tool Runtime) -> 观察处理 (Observation Parser) -> 继续/完成/求助

**生产最佳实践**:
- 设置明确终止条件
- 渐进式披露 (先低风险操作)
- 提供取消机制
- 记录完整轨迹
- 不要过度自主, 不要忽略错误, 不要无限重试, 不要隐藏过程

---

## 参见

- [[Multi_Agent_Systems_Guide]] -- Part 2: 群体智能与进化
- [[AgentOps_Production_Guide]] -- Part 3: 工程实践与落地
- [[Context_Engineering_Guide]] -- 上下文工程完整指南
- [[Prompt_Engineering_Complete_Guide]] -- 提示词工程指南
- [[Agent_Foundations/Agent_Protocols_2026]] -- 协议详解
- [[Agent_Foundations/MCP_Implementation_Guide]] -- MCP 实现指南
- [[Agent_Workflow/Agentic_Workflow_Design_Patterns_2026]] -- 工作流设计模式
