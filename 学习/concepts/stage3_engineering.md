---
title: 'Stage 3: 工程实践'
category: '90-learn-concepts'
tags: ["learning", "education", "courses", "study-path"]
summary: '> **"从实验室模型到线上产品——这一步的差距，淘汰了 90% 的 AI 项目。"**'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Stage3 Engineering"
  - "stage3 engineering"
  - stage3_engineering
sources: []

---
# Stage 3: 工程实践

> **"从实验室模型到线上产品——这一步的差距，淘汰了 90% 的 AI 项目。"**
>
> 本层目标：掌握将 AI 模型变成可用产品的核心工程能力。

## 本层概要

| 属性 | 值 |
|------|---|
| 包含核心概念 | 10 个 |
| 预计学习时间 | 8-12 小时 |
| 前置依赖 | [Stage 2: 核心技术](./stage2_core_tech.md) |
| 适合人群 | 准备将 AI 落地的工程师、产品经理 |

---

## 概念列表

### 1. 模型部署与推理 (Deployment & Inference)

- **一句话定义**：把训练好的模型放到服务器/云上，让它能对外提供服务（推理）的过程。
- **为什么重要**：模型训练只是第一步。让模型在生产环境稳定、快速、便宜地跑起来，是工程上最大的挑战。
- **核心挑战**：
  - **延迟 (Latency)**：用户等太久体验差。LLM 生成 token 的速度（Tokens Per Second）直接影响体验
  - **吞吐量 (Throughput)**：能同时处理多少请求
  - **成本**：GPU 资源费用是 LLM 应用的主要成本
  - **可扩展性**：流量突增时能否自动扩容
- **关键技术**：
  - **推理框架**：vLLM（当前最主流 LLM 推理引擎）、TensorRT-LLM、TGI (Text Generation Inference)
  - **量化 (Quantization)**：用更少的 bit 表示参数，大幅降低显存和加速推理
  - **批处理 (Batching)**：把多个请求合并推理，提高 GPU 利用率
- **入门阅读**：[部署与推理入门](../../部署推理/Deployment_Inference_for_dummy.md)
- **深入学习**：[推理速查](../../部署推理/Inference-in-nutshell.md)
- **关联概念**：量化、vLLM、API 服务

### 2. RAG — 检索增强生成

- **一句话定义**：让 LLM 在回答问题前，先从外部知识库检索相关资料，再结合资料生成答案的技术。
- **为什么重要**：LLM 的知识有截止日期，且可能"幻觉"（一本正经地胡说八道）。RAG 是让 LLM 获得最新/私有知识的最主流方案。
- **工作流程**：
  ```
  用户问题 → 检索（从知识库找相关文档） → 拼接上下文 → LLM 生成答案
  ```
- **RAG 的核心环节**：
  1. **文档切分**：把长文档切成小块（Chunk），每块独立检索
  2. **向量化**：用 Embedding 模型把每块文字变成向量
  3. **向量数据库**：存储和检索向量（Milvus、Pinecone、ChromaDB、FAISS）
  4. **重排序 (Reranking)**：初步检索结果可能不够精准，用 Reranker 重新排序
  5. **混合检索**：结合向量相似度 + 关键词匹配（如 BM25）
- **通俗类比**：RAG 像开卷考试——不是让考生背下所有知识，而是允许他翻书查资料再答题。
- **入门阅读**：[RAG 系统入门](../../RAG系统/RAG_Systems_for_dummy.md)
- **深入学习**：[RAG 速查](../../RAG系统/RAG-in-nutshell.md)
- **关联概念**：向量数据库、Embedding、幻觉问题 (Hallucination)

### 3. 向量数据库 (Vector Database)

- **一句话定义**：专门存储和检索高维向量（ Embedding）的数据库，支持"按语义相似度"搜索。
- **为什么重要**：RAG、语义搜索、推荐系统等场景的核心基础设施。没有向量数据库，就无法高效做语义检索。
- **为什么不用普通数据库？**：
  - 普通数据库的精确匹配（`WHERE name = "张飞"`）无法找到语义相近的内容
  - 向量数据库做近似最近邻搜索（ANN），找到"意思最接近"的文档
- **主流选择**：

| 数据库 | 特点 |
|--------|------|
| Milvus | 开源，可扩展，支持混合检索 |
| Pinecone | 云原生，托管服务，简单易用 |
| Weaviate | 原生支持混合搜索（向量+关键词） |
| Qdrant | Rust 实现，性能高，延迟低 |
| FAISS | Facebook 开源，单机性能强，适合研究 |

- **关联概念**：Embedding、RAG、相似度搜索、ANN 算法（HNSW、IVF）

### 4. Prompt Engineering — 提示词工程

- **一句话定义**：通过设计更好的输入提示词，最大化激发 LLM 潜力的技术。
- **为什么重要**：同一模型，提示词不同，效果可能相差巨大。好提示词可以让 GPT-3.5 打败 GPT-4。
- **核心技巧**：
  - **Few-Shot**：给几个例子让模型"照着做"
  - **Chain-of-Thought (CoT)**：让模型一步步思考再给出答案
  - **Zero-Shot CoT**："Let's think step by step" 触发推理
  - **System Prompt**：设定角色和行为约束
  - **结构化输出**：要求 JSON 格式，便于程序解析
- **入门阅读**：[提示词工程](../../大模型/Prompt_Engineering/Prompt_Engineering_for_dummy.md)
- **深入学习**：[提示词速查](../../大模型/Prompt_Engineering/Prompt-Engineering-in-nutshell.md)
- **关联概念**：LLM、In-Context Learning、Few-Shot

### 5. AI Agent — 智能体

- **一句话定义**：能自主感知环境、做出决策、执行行动的 AI 系统——不仅仅是回答问题，而是能完成任务。
- **为什么重要**：Agent 是 2024-2026 年 AI 最重要的方向。ChatGPT 只是"会说"，Agent 能"会做"。
- **Agent 的核心能力**：

| 能力 | 说明 | 示例 |
|------|------|------|
| **规划 (Planning)** | 分解复杂任务为子步骤 | "帮我订机票" → 查航班 → 比价 → 下单 |
| **记忆 (Memory)** | 跨会话记住关键信息 | 记住用户的偏好和历史对话 |
| **工具使用 (Tool Use)** | 调用外部工具 | 搜索网页、执行代码、读写文件 |
| **多 Agent 协作** | 多个 Agent 分工合作 | 一个 Agent 写代码，另一个测试 |

- **Agent 架构框架**：LangGraph、AutoGen、CrewAI、Dify、Coze
- **Agent 协议 (2026)**：MCP (Model Context Protocol)、A2A (Agent-to-Agent)、UCP (Universal Computer Protocol)
- **入门阅读**：[AI Agent 入门](../../智能体/Agent_Foundations/AI_Agents_for_dummy.md)
- **深入学习**：[Agent 速查](../../智能体/Agent_Foundations/Agent-in-nutshell.md)
- **关联概念**：Tool Use、ReAct、规划、多 Agent 系统

### 6. Tool Use / Function Calling

- **一句话定义**：让 LLM 调用外部工具（搜索、计算、数据库查询、API）来扩展其能力边界。
- **为什么重要**：LLM 本身只能生成文本，但 Tool Use 让它能"行动"——查实时天气、操作数据库、控制智能家居。
- **工作原理**：
  1. LLM 识别需要调用工具的时机
  2. 按规范格式输出工具调用请求
  3. 系统执行工具，返回结果
  4. LLM 结合工具结果生成最终回答
- **典型工具**：

| 工具类型 | 示例 |
|---------|------|
| 搜索 | Web 搜索、Wikipedia 查询 |
| 计算 | 数学计算、代码执行 |
| 数据 | 数据库查询、文件读写 |
| API | 第三方服务（地图、天气、股票） |
| 操作 | 发送邮件、操作 UI、控制机器人 |

- **入门阅读**：[AI Agent 入门](../../智能体/Agent_Foundations/AI_Agents_for_dummy.md) → "工具使用" 章节
- **关联概念**：Agent、Function Calling、MCP 协议

### 7. MLOps — 机器学习运维

- **一句话定义**：将 DevOps 的理念应用到 ML 生命周期——从数据处理、训练、部署到监控的全流程自动化。
- **为什么重要**：ML 系统比传统软件多了"数据"这个输入源，数据会漂移（Data Drift），模型会退化。MLOps 解决的是"模型上线后怎么持续维护"的问题。
- **MLOps 核心环节**：

```
数据收集 → 数据验证 → 特征工程 → 训练 → 评估 → 版本管理 → 部署 → 监控
    ↑                                                                 │
    ←────────────────── 自动触发再训练 ←────────────────────────────────┘
```

- **关键工具**：MLflow（实验跟踪）、DVC（数据版本控制）、Feast（特征平台）、Kubernetes（模型服务）、Prometheus/Grafana（监控）
- **入门阅读**：[MLOps 流水线](../../模型运维/MLOps_Pipeline_for_dummy.md)
- **关联概念**：CI/CD、模型版本管理、数据漂移、监控

### 8. AI 评估 (AI Evaluation)

- **一句话定义**：系统性地衡量 AI 模型/系统的质量、可靠性、安全性的方法论。
- **为什么重要**：没有评估就没有改进。AI 评估比传统软件测试难得多——因为 AI 的输出常常是概率性的、没有唯一正确答案。
- **评估维度**：

| 维度 | 说明 | 指标示例 |
|------|------|---------|
| **质量 (Quality)** | 模型输出好不好 | BLEU、ROUGE、F1、准确率 |
| **安全性 (Safety)** | 有没有有害输出 | 毒性检测、越狱测试 |
| **可靠性 (Reliability)** | 能否稳定达到标准 | 胜率 (Win Rate)、失败率 |
| **性能 (Performance)** | 速度够不够快 | 延迟、吞吐量、TTFT |
| **成本 (Cost)** | 经济上是否可行 | 每千 Token 成本 |

- **2026 新趋势**：Agent 评估框架（RAPS 模型：Reasoning/Accuracy/Performance/Safety）、自动化红队测试
- **入门阅读**：[模型评估入门](../../模型评估/Model_Evaluation_for_dummy.md)
- **深入学习**：[Agent 评估框架](../../智能体/Agent_Evaluation/README.md)
- **关联概念**：Benchmark、红队测试、幻觉率

### 9. AI 工作流与编排 (AI Workflow & Orchestration)

- **一句话定义**：将多个 AI 组件（LLM 调用、RAG 检索、工具执行、人类审批）组合成自动化流程的框架和工具。
- **为什么重要**：真实 AI 产品往往不是单次 LLM 调用，而是多步骤、多工具、多 Agent 协作的复杂流程。工作流引擎是编排这一切的核心。
- **主流工具**：

| 工具 | 特点 |
|------|------|
| LangGraph | 面向 Agent 的 DAG 编排，状态管理强 |
| Dify | 可视化编排，开源，生态好 |
| Coze | 字节跳动出品，对话式 Bot 编排 |
| Airflow | 通用工作流引擎，适合复杂 ETL + AI 场景 |
| Temporal | 微服务工作流引擎，可靠性高 |

- **工作流模式**：
  - **DAG（有向无环图）**：线性流程，节点间有依赖关系
  - **状态机**：Agent 根据状态转换执行不同动作
  - **事件驱动**：外部事件触发工作流执行
- **入门阅读**：[AI 工作流速查](../../智能体/Agent_Workflow/Workflow-in-nutshell.md)
- **关联概念**：Agent、LangGraph、Dify、容错处理

### 10. AI Gateway — AI 网关

- **一句话定义**：AI 应用的流量入口和调度中枢——统一管理对多个 LLM 的访问，处理负载均衡、降级、限流、成本控制。
- **为什么重要**：企业往往同时使用多个 LLM（GPT 做翻译、Claude 做写作、DeepSeek 做代码），AI Gateway 是统一管理这些调用的基础设施。
- **核心功能**：

| 功能 | 说明 |
|------|------|
| **多模型路由** | 根据任务类型自动选择最优模型 |
| **负载均衡** | 分发请求到多个实例，避免单点过载 |
| **降级策略** | 主模型不可用时自动切换备选 |
| **限流 (Rate Limiting)** | 控制每个用户的调用频率 |
| **成本控制** | 按模型/用户/时间维度统计用量和成本 |
| **缓存 (Caching)** | 相同请求直接返回缓存结果，省钱省时 |
| **日志与监控** | 追踪每次调用的质量、成本、延迟 |

- **主流方案**：Portkey、Weights & Biases Inference、MLflow AI Gateway、自建（基于 Nginx/Kong + FastAPI）
- **入门阅读**：[AI Gateway 速查](../../架构基建/AI_Gateway/Gateway-in-nutshell.md)
- **关联概念**：API 网关、负载均衡、成本优化

---

## 学完本层的标志

- [ ] 能解释 RAG 的完整工作流程，并知道每个环节的核心技术
- [ ] 能说出向量数据库和普通数据库的核心区别
- [ ] 能用 Prompt Engineering 技巧显著提升 LLM 输出质量
- [ ] 能设计一个简单的 AI Agent，包含规划、记忆、工具使用
- [ ] 能理解 MLOps 的全流程和核心工具
- [ ] 能从质量、安全、性能三个维度评估一个 AI 系统
- [ ] 能用 LangGraph 或 Dify 构建一个多步骤 AI 工作流
- [ ] 理解 AI Gateway 的核心价值和主要功能

## 下一步

完成 Stage 3 后：
- **想深入前沿方向** → [Stage 4: 前沿探索](./stage4_frontier.md)
- **专注 LLM 应用开发** → 进入 [LLM 工程师路径](../pathways/llm-engineer.md)
- **全面覆盖工程全链路** → 进入 [ML 从业者路径](../pathways/ml-practitioner.md)
