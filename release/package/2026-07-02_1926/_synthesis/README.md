---
title: 跨域综合文档索引 (Cross-Domain Synthesis Index)
category: -synthesis
tags: [synthesis, knowledge-graph, cross-domain]
summary: 18 篇跨领域综合分析文档，连接不同章节的概念，发现知识间的隐藏关联。
created: 2026-06-03
updated: 2026-06-15
tier: core
sources: []

---
# 跨域综合文档索引 (Synthesis Index)

> **定位**: 跨领域综合分析层（每篇 1.7-4.5KB），连接来自不同章节的概念，揭示知识间的隐藏关联。
>
> **与主章节的关系**: 每篇综合文档从 2-4 个不同章节提取关联，形成"概念A × 概念B"的交叉洞见。
>
> **与 _concepts/ 的关系**: _concepts/ 是单点概念卡片，_synthesis/ 是多点关联分析，二者互补构成知识图谱。

---

## 综合文档列表

### 架构与推理（3 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [transformer-llm-architecture](./transformer-llm-architecture.md) | 03_Deep_Learning × 04_NLP_LLMs | Transformer 架构如何催生 LLM 生态 |
| [llm-nlp](./llm-nlp.md) | 04_NLP_LLMs 内部 | 大模型在 NLP 任务上的统一范式 |
| [moe-inference-optimization](./moe-inference-optimization.md) | 04_NLP_LLMs × 09_Deployment_Inference | MoE 架构的推理优化策略 |

### 训练与微调（2 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [training-fine-tuning](./training-fine-tuning.md) | 07_Model_Training × 04_NLP_LLMs | 预训练到后训练的完整链路 |
| [python-data-science-pipeline](./python-data-science-pipeline.md) | 01_基础入门 × 02_Machine_Learning | 从数据处理到模型训练的 Python 工具链 |

### 视觉与深度学习（2 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [cv-deep-learning](./cv-deep-learning.md) | 05_Computer_Vision × 03_Deep_Learning | 深度学习如何重塑计算机视觉 |
| [multimodal-rag](./multimodal-rag.md) | 05_Computer_Vision × 11_RAG_Systems | 多模态检索增强生成系统 |

### 智能体与强化学习（3 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [agents-reinforcement-learning](./agents-reinforcement-learning.md) | 06_Reinforcement_Learning × 13_Agent_Production | RL 如何驱动 Agent 决策 |
| [reasoning-models-agents](./reasoning-models-agents.md) | 04_NLP_LLMs × 06_Reinforcement_Learning | 推理模型与 Agent 的融合（o1+Agent） |
| [agent-framework-production](./agent-framework-production.md) | 13_Agent_Production × 12_Architecture_Infrastructure | Agent 框架从原型到生产的架构演进 |

### RAG 与部署（2 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [rag-vector-database](./rag-vector-database.md) | 11_RAG_Systems × 09_Deployment_Inference | RAG 系统中向量数据库的部署与运维 |
| [serving-deployment](./serving-deployment.md) | 09_Deployment_Inference × 12_Architecture_Infrastructure | 模型服务的生产部署最佳实践 |

### 安全与评估（2 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [safety-evaluation-red-teaming](./safety-evaluation-red-teaming.md) | 19_Ethics_Safety × 08_Model_Evaluation | 安全评测与红队测试的攻防闭环 |
| [ai-ethics-future](./ai-ethics-future.md) | 19_Ethics_Safety × 00_AI_Introduction | AI 伦理如何影响未来技术路线 |

### 行业与职业（3 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [ai-industry-applications](./ai-industry-applications.md) | 20_AI_Applications_Industry × 04_NLP_LLMs | AI 技术在不同行业的落地模式 |
| [career-interviews](./career-interviews.md) | 23_Interviews × 全部章节 | AI 岗位面试的知识图谱 |
| [talks-insights](./talks-insights.md) | 21_Talks × 00_AI_Introduction | AI 领袖观点中的技术趋势提炼 |

### LLM 生态对比（1 篇）

| 文档 | 交叉领域 | 核心洞见 |
|------|----------|----------|
| [Chinese_vs_Global_LLM_Comparison](./Chinese_vs_Global_LLM_Comparison.md) | Chinese_LLM_Ecosystem × Global_LLM_Ecosystem | 12 维度全面对比中国 15 家 vs 国际 5 巨头：效率路线 vs 规模路线的收敛 |

---

- [[_synthesis/alignment-rlhf|价值对齐 × RLHF：从人类反馈到可扩展监督]] — #alignment × #rlhf
- [[_synthesis/benchmark-evaluation|评测基准 × 评测方法论：从分数到可信评估]] — #benchmark × #evaluation
- [[_synthesis/pretraining-synthetic-data|预训练数据 × 合成数据：从规模到质量的范式转移]] — #pretraining-data × #synthetic-data
## 综合文档模板

每篇综合文档遵循以下结构：

```markdown
---
title: "概念A × 概念B: 标题"
category: -synthesis
tags: [tag1, tag2, synthesis]
sources:
  - "XX_Chapter/Document_A"
  - "YY_Chapter/Document_B"
summary: "一句话交叉洞见"
provenance:
  extracted: 0.XX
  inferred: 0.XX
  ambiguous: 0.XX
base_confidence: 0.XX
lifecycle: draft | review | stable
---

# 标题

## The Connection
描述两个概念的关联点

## Key Insights
- 洞见 1
- 洞见 2
- 洞见 3

## Practical Implications
实际应用建议

## Sources
引用来源列表
```

---

## 统计

- **总数**: 18 篇综合文档
- **平均大小**: ~3.1 KB
- **覆盖交叉对**: 16+ 对章节组合
- **最大文档**: Chinese_vs_Global_LLM_Comparison（756 行，12 维度对比）
- **最高置信度**: moe-inference-optimization（0.80）
- **最低置信度**: career-interviews（0.65）

