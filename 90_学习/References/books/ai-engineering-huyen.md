---
title: "AI Engineering"
category: "-references-books"
tags:
  - book
  - learning-resource
  - ai-engineering
  - llm
  - production
  - chip-huyen
  - oreilly
  - rag
  - agents
  - inference-optimization
summary: "Chip Huyen 的 AI 工程权威指南（2025），系统讲解如何基于基础模型构建生产级 AI 应用，覆盖模型评估、RAG、Agent、护栏、推理优化等全流程。"
sources:
  - "https://www.oreilly.com/library/view/ai-engineering/9781098166298/"
created: 2026-06-12
updated: 2026-07-11
lifecycle: reviewed
tier: supporting
aliases:
  - "Ai Engineering Huyen"
  - "ai engineering huyen"

---
# AI Engineering

> **一句话理解**: Chip Huyen 继《Designing ML Systems》后的又一力作，聚焦基础模型时代的 AI 工程实践，是 2025 年 LLM 应用工程领域最系统、最权威的参考书。

## 书籍概述

### 作者背景

**Chip Huyen** 是 AI 工程领域最具影响力的实践者与教育者之一。她曾在 NVIDIA 主导大规模 ML 平台建设，在 Snorkel AI 负责企业级 ML 落地，并长期在斯坦福大学任教（CS 329S: Machine Learning Systems Design）。她的前作《Designing Machine Learning Systems》（2022）被誉为 ML 系统设计的标杆。本书是她在基础模型（Foundation Model）时代的全新力作，凝聚了她对 LLM 应用工程的最新思考。

### 出版信息

| 属性 | 说明 |
|------|------|
| **书名** | AI Engineering: Building Applications with Foundation Models |
| **作者** | Chip Huyen |
| **出版社** | O'Reilly（2025，初版） |
| **页数** | 约 600 页（两卷） |
| **难度** | ⭐⭐⭐（中级→高级） |
| **代码语言** | Python |
| **链接** | [O'Reilly](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) |

### 本书定位

本书是 LLM 应用工程领域的"集大成之作"：

- **不是**讲模型训练的书（那是研究者的领域）
- **而是**讲"如何站在基础模型肩膀上构建应用"的工程指南
- 它定义并系统化了 **"AI Engineering"** 这一新兴工程学科

在知识库的书籍谱系中，本书处于核心位置：
- 上承 [[designing-ml-systems-huyen]]（传统 ML 系统设计思维）
- 平行 [[llm-engineers-handbook]]（工程实现）与 [[llms-in-production]]（生产运维）
- 是 2025-2026 年 AI 工程师的**必读**参考

## 核心内容

全书分两卷，从基础模型原理到应用工程实践层层递进。

### 卷一 — 基础模型与推理

#### Ch 1: AI 工程概览

- **范式转变**: 从传统 ML（自己训练模型）到基础模型时代（调用预训练模型）
- **AI Engineering 的定义**: 基于基础模型构建可靠、可扩展、经济的应用的工程学科
- **AI 工程师 vs ML 工程师**:
  - ML 工程师：关注数据、特征、训练
  - AI 工程师：关注模型选型、提示、RAG、Agent、评估、推理优化
- **基础模型带来的新挑战**: 不确定性、成本、延迟、安全、评估难
- **全书路线图**: 从理解模型到构建生产系统的完整旅程

#### Ch 2: 理解基础模型

- **架构基础**: Transformer、注意力机制、位置编码
- **训练范式**:
  - 预训练（Pretraining）：海量无标注数据
  - 后训练（Post-training）：SFT + RLHF/DPO 对齐
- **能力与边界**:
  - 涌现能力（Emergent Abilities）
  - 上下文学习（In-Context Learning）
  - 幻觉（Hallucination）的根源
- **模型选型**:
  - 开源 vs 闭源
  - 模型规模与能力的权衡
  - 多模态模型（文本、图像、音频）
- **关键认知**: 理解模型"能做什么"和"不能做什么"是工程设计的起点

#### Ch 3: 推理优化

- **采样策略**:
  - Temperature、Top-p、Top-k 的工程含义
  - 不同任务的采样参数选择
- **量化（Quantization）**:
  - INT8/INT4/FP8 量化
  - 量化对质量的影响评估
- **推测解码（Speculative Decoding）**:
  - 小模型草稿 + 大模型验证
  - 加速原理与适用场景
- **KV Cache 优化**:
  - KV Cache 的作用与显存占用
  - PagedAttention、Prefix Caching
- **延迟指标**: TTFT、TPS、E2E Latency 的优化

#### Ch 4: 模型推理基础设施

- **GPU 与硬件**:
  - GPU 架构基础（H100、A100、消费级卡）
  - 显存带宽与计算瓶颈
- **推理引擎**:
  - vLLM、TensorRT-LLM、TGI 对比
  - Continuous Batching 的原理
- **批处理策略**: 动态批处理、优先级队列
- **部署模式**: 云 API、托管推理、自建推理的选型
- **成本-性能权衡**: 不同基础设施方案的经济性分析

### 卷二 — AI 应用工程

#### Ch 5: 提示工程与上下文工程

- **提示工程基础**: 零样本、少样本、CoT（详见 [[prompt-engineering-for-llms]]）
- **上下文工程（Context Engineering）**:
  - 比"提示工程"更广义的概念
  - 管理模型在每次调用时"看到"的全部信息
  - 上下文的组装、压缩、优先级排序
- **结构化输出**: JSON Mode、Function Calling、Schema 约束
- **提示的版本管理与测试**: 工程化管理提示资产
- **上下文窗口管理**: 长上下文的利用与陷阱

#### Ch 6: RAG（检索增强生成）

- **RAG 架构**:
  - 索引（Indexing）→ 检索（Retrieval）→ 生成（Generation）
  - 详见 [[14_RAG系统/RAG_Systems]]
- **分块策略（Chunking）**:
  - 固定大小 vs 语义分块
  - 重叠与边界处理
- **检索优化**:
  - 向量检索 vs 关键词检索 vs 混合检索
  - 重排序（Reranking）
  - 查询改写（Query Rewriting）
- **高级 RAG**:
  - 多跳检索
  - Agentic RAG（Agent 驱动的检索）
  - GraphRAG（图结构检索）
- **RAG 评估**: 检索质量 + 生成质量的双重评估

#### Ch 7: 微调与适配

- **何时需要微调**:
  - 提示工程无法满足时的选择
  - 微调 vs RAG vs 提示的决策树
- **参数高效微调（PEFT）**:
  - LoRA / QLoRA 的原理与实践
  - Adapter、Prefix Tuning
- **微调数据准备**: 高质量数据 >> 数量
- **全量微调 vs PEFT**: 成本与效果的权衡
- **微调的陷阱**: 过拟合、灾难性遗忘、能力退化

#### Ch 8: AI 智能体（Agent）与工具调用

- **Agent 基础**: 感知-思考-行动循环（详见 [[15_智能体/]]）
- **工具调用（Function Calling）**: 让 LLM 使用外部工具
- **规划与推理**: ReAct、Plan-and-Execute
- **记忆系统**: 短期记忆 + 长期记忆
- **多 Agent 系统**: 协作与编排（详见 [[build-multi-agent-system]]）
- **Agent 的可靠性挑战**: 错误累积、不可预测性

#### Ch 9: 模型评估方法学

- **评估的核心难题**: LLM 输出的开放性使评估极其困难
- **评估方法**:
  - 基于规则（正则、Schema 校验）
  - 基于参考答案（语义相似度）
  - LLM-as-a-Judge（用强模型评估）
  - 人工评估（黄金标准但昂贵）
- **评估维度**: 准确性、相关性、安全性、格式合规
- **评估集构建**: 黄金集、对抗集、真实流量采样
- **持续评估**: 集成到 CI/CD 的质量门禁

#### Ch 10: 安全、护栏与对齐

- **威胁模型**:
  - Prompt Injection（直接/间接）
  - 越狱（Jailbreak）
  - 数据泄露
- **护栏（Guardrails）**:
  - 输入护栏：过滤恶意输入
  - 输出护栏：审查模型输出
  - 工具调用护栏：权限控制
- **对齐（Alignment）**: 让模型行为符合人类意图
- **红队测试**: 主动发现安全漏洞
- **合规**: EU AI Act、数据隐私法规

#### Ch 11: AI 系统架构与生产化

- **端到端架构设计**: 从用户请求到响应的完整链路
- **可观测性**: Traces、Metrics、Logs 在 AI 系统的应用
- **成本管理**: Token 成本追踪与优化
- **可靠性设计**: 降级、Fallback、限流
- **数据飞轮**: 生产数据驱动持续改进
- **团队协作**: AI 工程师与 ML 研究员、产品、运维的协作

## 关键概念与公式

### 推理成本模型

```
单次请求成本 = Input Tokens × Pin + Output Tokens × Pout

优化杠杆:
- 减少 Input: 上下文压缩、缓存命中
- 减少 Output: 简洁提示、长度约束
- 降低单价: 模型路由（小模型处理简单任务）
```

### RAG 检索质量

```
Recall@K = 相关文档中被检索到的比例
Precision@K = 检索结果中相关文档的比例
MRR (Mean Reciprocal Rank) = 1/第一个相关结果的排名

端到端 RAG 质量 = 检索质量 × 生成质量
```

### 推测解码加速比

```
加速比 ≈ 1 / (1 - α + α × c_draft/c_target)
其中 α = 草稿接受率, c = 单 Token 成本

直觉: 草稿模型越准（α 越高）、越便宜，加速越明显
```

### 上下文工程的权衡

```
上下文质量 = f(相关性, 新鲜度, 多样性)
约束: 上下文长度 ≤ Context Window
目标: 在有限窗口内最大化信息密度与相关性
```

## 实践价值

### 适合谁读

| 角色 | 阅读重点 | 收益 |
|------|----------|------|
| **LLM 应用工程师** | 全书 | 建立完整的 AI 工程知识体系 |
| **AI 平台架构师** | 卷一 + Ch 11 | 推理基础设施与系统架构 |
| **技术负责人/CTO** | Ch 1-2, 9-11 | 技术选型与战略决策 |
| **ML 工程师（转型）** | 全书 | 从传统 ML 转向 AI 工程 |
| **高级开发者** | 卷二 | RAG、Agent、微调实战 |

### 前置知识

- **必备**: 了解 LLM 基础概念、有后端工程经验、Python 编程
- **强烈建议**: 有构建过 LLM 应用的经验（哪怕是 Demo）
- **加分**: 读过 [[designing-ml-systems-huyen]]、了解分布式系统

### 读后能力

1. **理解**基础模型的能力边界与工程含义
2. **设计**生产级 RAG 系统并优化检索质量
3. **构建**可靠的 AI Agent 与工具调用系统
4. **实施**推理优化（量化、推测解码、KV Cache）
5. **建立**LLM 应用的评估体系与质量门禁
6. **设计**安全护栏与合规方案
7. **架构**端到端的 AI 系统并管理成本

## 与知识库映射

| 本书章节 | 知识库主题 | 关联说明 |
|----------|------------|----------|
| Ch 1-2 基础模型 | [[05_大模型/LLM_Fundamentals]] | 模型原理与选型 |
| Ch 3-4 推理优化 | [[10_部署推理/]] | 量化、推测解码、推理引擎 |
| Ch 5 提示/上下文工程 | [[05_大模型/08_Prompt_Engineering/Prompt_Engineering]] | 提示技术 |
| Ch 6 RAG | [[14_RAG系统/RAG_Systems]] | 检索增强生成 |
| Ch 7 微调 | [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] | LoRA/PEFT |
| Ch 8 Agent | [[15_智能体/]] | Agent 与工具调用 |
| Ch 9 评估 | [[08_模型评估/]] | LLM 评估方法 |
| Ch 10 安全 | [[17_伦理安全/]] | 护栏与对齐 |
| Ch 11 架构 | [[12_架构基建/]] | 系统架构与生产化 |

### 与相关书籍的关系

```
[[designing-ml-systems-huyen]]  →  本书
   (传统 ML 系统设计)        (基础模型时代 AI 工程)

本书 (架构设计)  ←→  [[llm-engineers-handbook]] (工程实现)
本书 (全流程)    ←→  [[llms-in-production]] (生产运维聚焦)
本书 Ch 5        ←→  [[prompt-engineering-for-llms]] (提示工程深入)
```

## 推荐阅读路径

### 路径 A: 系统学习（4-6 周，推荐）

1. **Week 1**: 卷一 Ch 1-2（建立基础模型认知）
2. **Week 2**: 卷一 Ch 3-4（推理优化与基础设施）
3. **Week 3**: 卷二 Ch 5-6（提示/上下文工程 + RAG）
4. **Week 4**: 卷二 Ch 7-8（微调 + Agent）
5. **Week 5**: 卷二 Ch 9-10（评估 + 安全）
6. **Week 6**: 卷二 Ch 11（系统架构）+ 综合实战

### 路径 B: 按角色速读

- **架构师**: Ch 1-4 + Ch 11（基础设施与架构）
- **应用开发者**: Ch 5-8（提示、RAG、微调、Agent）
- **质量/安全**: Ch 9-10（评估与安全）

### 路径 C: 配合实战项目

1. 选一个真实项目（如企业知识库问答）
2. 按 Ch 6 设计 RAG 架构
3. 按 Ch 9 建立评估体系
4. 按 Ch 3 优化推理性能
5. 按 Ch 11 完成生产化

## 亮点与局限

### 亮点

- **内容最新**（2025）：覆盖推理优化、Agent、上下文工程等前沿话题
- **系统性强**：从模型理解到生产化的完整知识体系
- **作者权威**：Chip Huyen 的行业经验与教学功力
- **架构视角**：不只讲"怎么做"，更讲"为什么这样设计"
- **定义学科**：系统化"AI Engineering"这一新兴领域

### 局限

- **内容密集**：600 页两卷，信息量大，需要消化时间
- **代码示例较少**：偏架构与设计，实操代码不如 [[llm-engineers-handbook]]
- **需要前置知识**：纯新手可能吃力，建议有 LLM 基础
- **领域变化快**：部分技术细节可能随模型迭代而过时

## AI 工程核心决策速查

本书反复涉及的几个关键工程决策，汇总如下：

### 决策 1: RAG vs 微调 vs 提示

| 方法 | 适用场景 | 优势 | 劣势 |
|------|----------|------|------|
| **提示工程** | 通用任务、快速迭代 | 零成本、即时生效 | 能力有限、上下文受限 |
| **RAG** | 知识密集、需引用来源 | 知识可更新、可溯源 | 检索质量依赖、延迟增加 |
| **微调** | 特定风格/格式/领域 | 内化能力、推理快 | 成本高、知识难更新 |

**决策原则**: 优先提示 → 不够再 RAG → 仍不够才微调。三者可组合使用。

### 决策 2: 开源 vs 闭源模型

| 维度 | 闭源 API | 开源模型 |
|------|----------|----------|
| **能力** | 通常最强 | 追赶中 |
| **成本** | 按 Token 计费 | 自建基础设施 |
| **数据隐私** | 数据出域 | 完全可控 |
| **定制性** | 有限 | 可微调 |
| **运维** | 零运维 | 需自建 |

### 决策 3: 推理优化手段选择

```
延迟敏感?
├─ 是 → 量化 + 推测解码 + KV Cache 优化
└─ 否 → 批处理 + Batch API（优先降本）
显存受限?
├─ 是 → INT4 量化 + PagedAttention
└─ 否 → 保持精度，优化吞吐
```

## AI 工程 vs 传统 ML 工程

理解范式转变是掌握本书的前提：

| 维度 | 传统 ML 工程 | AI 工程（基础模型时代） |
|------|--------------|--------------------------|
| **核心工作** | 数据、特征、训练 | 模型选型、提示、RAG、Agent |
| **数据需求** | 大量标注数据 | 少量（甚至零）标注 |
| **模型来源** | 自己训练 | 调用预训练模型 |
| **迭代方式** | 重训模型 | 改提示/换模型/调 RAG |
| **评估难度** | 中（指标明确） | 高（输出开放） |
| **成本结构** | 训练为主 | 推理为主 |
| **新挑战** | 特征工程 | 上下文工程、幻觉、安全 |
| **技能重心** | 数据 + 算法 | 系统 + 评估 + 工程 |

**关键洞察**: AI 工程不是"简化版 ML 工程"，而是一个**新的工程学科**，有自己的方法论、工具链与挑战。本书正是这一学科的系统化总结。

## 延伸阅读

- [[90_学习/References/books/designing-ml-systems-huyen|Designing ML Systems]] — 前置阅读（系统设计思维）
- [[90_学习/References/books/llm-engineers-handbook|LLM Engineer's Handbook]] — 配套（工程实现）
- [[90_学习/References/books/llms-in-production|LLMs in Production]] — 配套（生产运维）
- [[05_大模型/]] — 知识库大模型章节
- [[14_RAG系统/RAG_Systems]] — RAG 系统专题
- [[15_智能体/]] — Agent 专题
- [[90_学习/guides/ai_engineering_roadmap_2026|AI 工程路线图 2026]]

> **关联**: → [[90_学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[05_大模型/]] | [[14_RAG系统/]] | [[15_智能体/]] | [[10_部署推理/]]
