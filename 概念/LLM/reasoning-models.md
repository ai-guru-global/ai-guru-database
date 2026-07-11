---
title: 推理模型
category: -concepts
tags:
- nlp
- reasoning
- chain-of-thought
- o1
- test-time-compute
relationships:
- target: '概念/llm-architectures'
  type: extends
- target: '概念/prompt-engineering'
  type: uses
- target: '概念/transformer-architecture'
  type: built_on
sources:
- 大模型/LLM_llm-architectures/Reasoning_world-models-jepa_2026.md
- 大模型/Reasoning_Models/Test_Time_Compute_2026.md
summary: 推理模型（o1/o3/DeepSeek-R1）通过在推理阶段增加"思考"计算量，实现从"直觉型"到"思考型"的范式转变。核心技术包括思维链、测试时计算扩展和自我反思修正，在数学、代码、逻辑推理任务上显著超越普通LLM。
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31 00:00:00+00:00
updated: 2026-05-31 00:00:00+00:00
aliases:
  - "Reasoning Models"
  - "reasoning models"

---
# 推理模型

## 概述

2025-2026年是LLM从"直觉型"向"思考型"进化的转折点。推理模型不是更聪明，而是**更慢、更彻底地思考**。核心范式转变：从"输入→直接输出"到"输入→思考链→验证→再思考→输出"。

关键数据：o3在AIME数学竞赛上达到87%（GPT-4o仅9%），在Codeforces编程上达92%（GPT-4o仅11%）。^[inferred] 简单任务差异不大，复杂任务优势随难度增加而扩大。

## 思维链技术演进

```
2022: CoT Prompting — "Let's think step by step"
2023: Self-Consistency — 多次采样 + 多数投票
2024: Tree of Thoughts — 多路径探索
2024: ReAct — 推理与工具调用结合
2025: Quiet Thinking — 模型内部推理
2026: o1/o3架构 — 推理过程作为独立模块
```

### Chain-of-Thought（CoT）

引导模型展示中间推理步骤，将复杂推理分解为多个简单步骤。手动CoT提供推理示例，零样本CoT只需添加"Let's think step by step"。研究表明CoT在100B+参数模型上效果显著，小模型可能有害。

### Self-Consistency

对同一问题多次采样（temperature > 0），取多数答案。结合CoT使用效果最佳，N=8-16时性价比最优。

### Tree of Thoughts（ToT）

允许模型在多个推理路径中搜索，评估器判断每条路径的可行性并剪枝。适用于需要探索和回溯的复杂问题。

## Test-Time Compute Scaling

### 核心思想

传统方法通过训练时扩展（更大模型+更多数据）提升能力。测试时计算通过推理阶段动态分配计算资源，根据问题难度调整计算量。

### 计算分配策略

难度估计器根据问题关键词、长度、多步骤信号评估难度（0-1），自适应引擎据此分配推理long-context-models预算：

| 难度类别 | 采样次数 | 推理token | 验证轮数 |
|---------|---------|----------|---------|
| Easy | 1 | 500 | 0 |
| Medium | 5 | 1000 | 1 |
| Hard | 10 | 2000 | 2 |
| Extreme | 20 | 4000 | 3 |

### 验证器

- **Outcome Reward model-training（ORM）**：评估最终结果质量
- **Process Reward Model（PRM）**：评估每步推理过程质量，更细粒度

## o1/o3架构

o1将推理过程作为独立模块：先生成内部推理token（不显示给用户），基于推理生成最终答案。推理过程用强化学习训练而非纯next-token预测，允许数千个内部推理token。

### RL训练框架

1. 对每个问题采样多个推理轨迹（不同温度）
2. 计算每个轨迹的奖励（答案正确性70% + 推理质量20% + 简洁惩罚）
3. 使用Policy Gradient更新模型

DeepSeek-R1采用纯RL训练的思维链，无需监督数据。

## 自我反思与修正

推理模型具备自我反思能力：先生成初始回答，然后检查逻辑错误、计算错误、遗漏信息，如有问题则修正并迭代。通常3轮内收敛。

## 何时使用推理模型

**推荐使用**：数学证明、编程竞赛、逻辑推理、科学求解、多步复杂任务、错误成本高的关键任务。

**不需要使用**：简单问答、文本总结、翻译、情感分析、实时性要求高的任务。

**成本权衡**：推理模型成本为普通模型的5-100×，但错误成本可能是10-1000×。

## 2026年推理模型对比

| 模型 | 特点 | 适用场景 |
|------|------|---------|
| o3 | 最长推理链，竞赛级 | 极难推理任务 |
| DeepSeek-R1 | 开源，RL训练 | 研究/工业应用 |
| QwQ-32B | 本地部署，中文优化 | 企业内部 |
| multimodal-models Ultra 2 | 多模态推理 | 复杂多模态任务 |
| Claude Opus 4 | 长上下文推理 | 长文档分析 |

## 关联主题

- LLM架构：推理模型基于LLM构建
- 提示工程：CoT/ToT是提示工程的高级策略
- Transformer架构：底层推理基础设施

## See Also (深度专题)

- [[../../大模型/Reasoning_Models/o1_Class_Reasoning_Models|o1 类推理模型]] — o1/o3 架构与推理链机制的深度技术分析
- [[../../大模型/Reasoning_Models/DeepSeek_R1_Technical_Analysis|DeepSeek-R1 技术分析]] — RL 驱动的推理模型训练全流程
- [[../../大模型/Test_Time_Compute/Test_Time_Compute_Scaling_2026|Test-Time Compute Scaling 2026]] — 推理时计算扩展的生产实践
- [[../../大模型/Test_Time_Compute/Test_Time_Training_2026|Test-Time Training (TTT) 2026]] — 测试时训练：推理时梯度更新的新技术路线
