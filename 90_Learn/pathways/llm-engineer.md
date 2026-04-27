# LLM 工程师路径

> **面向：想专注大模型应用与 Agent 开发的工程师 | 前置要求：Python + 基础 ML | 预计时间：40-60 小时**

专注于大模型技术栈：Prompt Engineering → RAG → Agent → 部署优化。学完后你能构建生产级的 LLM 应用系统。

---

## 路径概况

| 属性 | 值 |
|------|---|
| 目标人群 | 有编程经验的开发者，想专注 LLM/Agent 方向 |
| 前置要求 | Python 基础，了解基本 ML 概念（Stage 1 基础） |
| 预计时间 | 40-60 小时（每天 2-3 小时，约 3-4 周） |
| 核心产出 | 构建生产级 LLM 应用：RAG 系统、Agent 工作流、模型部署优化 |
| 适合你如果…… | 想专注 AI 应用开发，目标岗位是 LLM 应用工程师 / AI 应用工程师 / Prompt 工程师 |

---

## 完整路线图

```
Stage 1 基础概念（快速回顾）
    ↓
Stage 2 核心技术（聚焦 LLM / Transformer）
    ↓
Stage 3 工程实践（完整覆盖）
    ↓
Stage 4 前沿（Agent / 多模态）
    ↓
完成：生产级 LLM 应用开发能力
```

---

## 学习阶段

### Phase 1: LLM 基础（第 1-2 周）

**🎯 目标**：理解 LLM 的工作原理、架构差异和核心能力边界。

**📚 核心概念**：
- [Stage 1: 基础概念](../concepts/stage1-foundation.md)（快速浏览）
- [Stage 2: 核心技术 — LLM 相关部分](../concepts/stage2-core-tech.md)（深入）

**🔗 深入阅读**：
- [LLM 架构（小白版）](../../04_NLP_LLMs/LLM_Architectures/LLM_Architectures_for_dummy.md)
- [LLM 架构（速查版）](../../04_NLP_LLMs/LLM_Architectures/LLM-Basics-in-nutshell.md)
- [Transformer 革命（小白版）](../../04_NLP_LLMs/Transformer_Revolution/Transformer_Revolution_for_dummy.md)
- [微调技术（小白版）](../../04_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md)

**💡 重点理解**：
- Token 是什么，LLM 的上下文窗口限制
- 预训练（学语言能力）vs 微调（学特定技能）
- GPT、Claude、Gemini、LLaMA 的架构差异
- 涌现能力：为什么规模大了会出现"意外"的能力
- 常见问题：幻觉（Hallucination）、上下文窗口限制、Token 成本

**✅ 学会标志**：
- 能解释 LLM 的基本工作原理（Next Token Prediction）
- 能根据场景选择合适的 LLM（GPT / Claude / 开源模型）
- 能评估一个 LLM 的能力边界和适用场景

---

### Phase 2: Prompt Engineering 精通（第 2-3 周）

**🎯 目标**：成为 Prompt 高手，能用 Prompt 解决复杂问题。

**📚 核心概念**：[Stage 3 工程实践 — Prompt Engineering 部分](../concepts/stage3-engineering.md)

**🔗 深入阅读**：
- [提示词工程（小白版）](../../04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_for_dummy.md)
- [提示词工程（速查版）](../../04_NLP_LLMs/Prompt_Engineering/Prompt-Engineering-in-nutshell.md)

**💡 Prompt 技巧体系**：
```
基础技巧：
├── 明确指令（Clear Instructions）
├── Few-Shot 示例（给出 2-3 个例子）
└── 格式约束（JSON / Markdown / 表格）

进阶技巧：
├── Chain-of-Thought（分步思考）
├── Zero-Shot CoT（"Let's think step by step"）
├── Self-Correction（让模型自己检查错误）
├── ReAct（Reason + Act 交替）
└── System Prompt 工程（角色设定 + 行为约束）

生产技巧：
├── 结构化输出（JSON Schema 约束）
├── 温度 / Top-p 控制（创造性 vs 确定性）
├── Token 预算管理（控制成本）
└── 多轮对话记忆管理
```

**💡 动手实践**：
- 用 OpenAI / Anthropic API 跑通所有基础 Prompt 技巧
- 用 LangSmith 或 PromptLayer 追踪和分析 Prompt 效果
- 构建一个 Prompt 评估框架（对比不同 Prompt 的效果）

**✅ 学会标志**：
- 能用 Prompt 技巧显著提升 LLM 在特定任务上的表现
- 能设计评估 Prompt 效果的实验
- 能根据任务类型选择合适的 Prompt 策略

---

### Phase 3: RAG 系统构建（第 3-4 周）

**🎯 目标**：构建生产级 RAG 应用，理解从文档到答案的完整链路。

**📚 核心概念**：[Stage 3: 工程实践 — RAG / 向量数据库](../concepts/stage3-engineering.md)

**🔗 深入阅读**：
- [RAG 系统（小白版）](../../11_RAG_Systems/RAG_Systems_for_dummy.md)
- [RAG 系统（速查版）](../../11_RAG_Systems/RAG-in-nutshell.md)
- [AI Skills 速查版](../../13_Agent_Production/Agent_Skills/Skills-in-nutshell.md)（AI Skills 的设计模式）

**💡 RAG 全链路技术栈**：
```
文档处理：
├── 文档解析（PDF/HTML/Markdown）→ unstructured.io, MarkItDown
├── 文本切分（Chunking）→ 按段落 / 按 token / 递归切分
└── 元数据提取 → 支持按来源/日期过滤检索

向量化与检索：
├── Embedding 模型 → OpenAI text-embedding-3 / BGE / Jina
├── 向量数据库 → Qdrant / Milvus / ChromaDB / FAISS
├── 混合检索 → 向量相似度 + BM25 关键词匹配
└── 重排序（Reranking）→ Cohere Rerank / BGE Reranker

生成增强：
├── 上下文组装 → 将检索结果和原问题拼接
├── 引用追踪 → 标注每个答案片段的来源
└── 幻觉抑制 → 要求模型只基于检索内容回答

高级 RAG 模式：
├── 子问题查询（Sub-question）→ 将复杂问题拆成多个简单问题
├── 对话记忆 → 保留多轮对话上下文
├── 语义缓存 → 相同语义的问题直接返回缓存结果
└── Agentic RAG → LLM 自主决定检索策略和工具
```

**💡 动手实践**：
- 用 LangChain / LlamaIndex 构建一个 PDF 知识库问答系统
- 用 Qdrant 部署一个本地向量数据库，对比不同 Embedding 模型的效果
- 实现混合检索 + Reranking，对比前后效果差异

**✅ 学会标志**：
- 能从零构建一个完整的 RAG 应用
- 能根据文档类型选择合适的切分策略
- 能诊断 RAG 效果不好的原因（检索质量 / Chunk 大小 / Embedding 模型）
- 能实现高级 RAG 模式（Agentic RAG、子问题查询）

---

### Phase 4: Agent 与工作流（第 4-5 周）

**🎯 目标**：构建能自主执行复杂任务的 AI Agent。

**📚 核心概念**：[Stage 3: 工程实践 — Agent 部分](../concepts/stage3-engineering.md) + [Stage 4 前沿 — Agent 深度](../concepts/stage4-frontier.md)

**🔗 深入阅读**：
- [AI Agent（小白版）](../../06_Reinforcement_Learning/AI_Agents/AI_Agents_for_dummy.md)
- [AI Agent（速查版）](../../06_Reinforcement_Learning/AI_Agents/Agent-in-nutshell.md)
- [AI 工作流（速查版）](../../13_Agent_Production/Agent_Workflow/Workflow-in-nutshell.md)

**💡 Agent 核心架构**：
```
Agent 架构四件套：
├── Planning（规划）→ 任务分解、ReAct、CoT
├── Memory（记忆）→ 短期（对话）、长期（向量存储）、情景
├── Tools（工具）→ 搜索、代码执行、API 调用、文件读写
└── Reflection（反思）→ 自我评估、执行结果检查、回退重试

Agent 框架选择：
├── LangGraph → 最灵活，支持复杂状态机和 DAG
├── LlamaIndex Workflows → 与 RAG 集成好
├── Dify → 可视化，适合快速原型
├── Coze → Bot 编排，生态丰富
└── AutoGen → 多 Agent 协作研究框架
```

**2026 Agent 协议**：
- MCP (Model Context Protocol)：Agent 与工具的标准接口
- A2A (Agent-to-Agent)：Agent 之间的通信协议
- UCP (Universal Computer Protocol)：通用计算机控制协议

**💡 动手实践**：
- 用 LangGraph 构建一个"研究助手"Agent（搜索 → 整理 → 摘要 → 报告）
- 用 Dify 构建一个客服 Bot，集成知识库检索 + 转人工
- 实现一个多 Agent 协作系统（写代码 + 审查 + 测试）

**✅ 学会标志**：
- 能用 LangGraph 实现一个包含规划、记忆、工具的完整 Agent
- 能理解并使用 MCP 协议连接 Agent 和工具
- 能设计容错和重试机制，提升 Agent 可靠性
- 理解 AI Gateway 在 Agent 系统中的作用

---

### Phase 5: 部署优化与生产（第 5-6 周）

**🎯 目标**：掌握 LLM 生产部署的成本优化和性能调优。

**📚 核心概念**：[Stage 3: 工程实践 — 部署 / AI Gateway](../concepts/stage3-engineering.md)

**🔗 深入阅读**：
- [部署与推理（小白版）](../../09_Deployment_Inference/Deployment_Inference_for_dummy.md)
- [部署与推理（速查版）](../../09_Deployment_Inference/Inference-in-nutshell.md)
- [AI Gateway（速查版）](../../14_AI_Gateway/Gateway-in-nutshell.md)
- [AIOps（速查版）](../../16_AI_Ops/AIOps-in-nutshell.md)

**💡 生产优化技术栈**：
```
推理优化：
├── 量化 → INT8 / INT4 量化（AWQ、GPTQ）
├── Batching → 连续批处理（Continuous Batching）
├── KV Cache → 减少重复计算
├── Speculative Decoding → 用小模型预测，大模型验证
└── 并行推理 → Tensor Parallel / Pipeline Parallel

成本控制：
├── Token 缓存 → 相同问题直接返回
├── 模型路由 → 根据任务复杂度选择不同规模模型
├── Prompt 压缩 → 减少输入 Token 数量
└── AI Gateway → 统一管理多模型调用和成本

可靠性：
├── 重试机制 → 指数退避
├── 降级策略 → 主模型不可用时切换备选
├── Rate Limiting → 防止滥用
└── 监控告警 → 延迟/错误率/成本异常检测
```

**💡 动手实践**：
- 用 vLLM 部署一个开源 LLM（Qwen / DeepSeek），测试不同量化级别的影响
- 用 AI Gateway（Portkey 或自建）管理多模型调用
- 构建一个完整的 LLM 应用监控仪表盘

**✅ 学会标志**：
- 能用 vLLM 部署和优化一个 LLM 推理服务
- 能根据延迟/成本需求选择合适的优化策略
- 能构建包含降级、限流、监控的可靠 AI 系统
- 理解 AI Gateway 的核心功能和选型

---

## 里程碑自测

完成本路径后，请回顾 [milestones.md](../milestones.md) 中 Stage 2-4 的自测题，重点关注 LLM、Agent、RAG 相关问题。

## 下一步推荐

| 你的打算 | 推荐去向 |
|---------|---------|
| 想深入 Agent 评估 | [Agent 评估框架](../../13_Agent_Production/16_Agent_Evaluation/README.md) |
| 想做 AI 研究 | [AI 研究者路径](./ai-researcher.md) |
| 想补充 CV 能力 | [ML 从业者路径](./ml-practitioner.md) 方向 B（CV） |
| 想进入 AI 产品领域 | [AI 产品经理路径](./product-manager.md) |

---

*本路径聚焦 LLM 应用开发。如需深入模型训练或预训练，建议先完成 [ML 从业者路径](./ml-practitioner.md) 的 Phase 1-3。*
