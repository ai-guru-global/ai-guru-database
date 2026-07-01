---
title: "L05 Agentic RAG"
category: "15-agent-production"
tags:
  - ai-agents
  - microsoft
  - ai-agents-for-beginners
  - agentic-rag
  - rag
  - self-correction
  - retrieval
  - azure-ai-search
sources:
  - "_raw/github-sources/ai-agents-for-beginners/05-agentic-rag/README.md"
summary: "Microsoft AI Agents 课程第5课：Agentic RAG 的迭代 maker-checker 循环、自主推理、多工具集成、失败自纠与治理透明。"
provenance:
  extracted: 0.85
  inferred: 0.12
  ambiguous: 0.03
base_confidence: 0.81
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Microsoft Ai Agents L05 Agentic Rag"
  - "Microsoft AI Agents L05 Agentic RAG"
  - Microsoft_AI_Agents_L05_Agentic_RAG

---
# L05 Agentic RAG

> 来源：[Microsoft AI Agents for Beginners / 05-agentic-rag](https://github.com/microsoft/ai-agents-for-beginners/tree/main/05-agentic-rag)

## 学习目标

完成本课后，你将能够：

- 理解 Agentic RAG 与传统 RAG 的本质区别
- 掌握迭代“制造-检查（maker-checker）”循环
- 理解 Agent 如何拥有自己的推理过程
- 处理失败模式并具备自我纠错能力
- 认识 Agentic RAG 的边界与治理要求

---

## 什么是 Agentic RAG

**Agentic RAG** 是一种新兴的 AI 范式：LLM 在检索外部信息的同时，**自主规划下一步行动**。与传统“检索-阅读”式 RAG 不同，Agentic RAG 通过反复调用 LLM、工具和结构化输出，不断评估结果、改写查询、调用额外工具，直到获得满意答案。

核心循环：

```
用户目标 → LLM 调用 → 工具/检索 → 评估结果 → （需要则）改写查询/换工具 → 重复 → 最终回复
```

这种“maker-checker”风格提升了正确性，能处理 malformed 查询，并产出更高质量的答案。

---

## 自主拥有推理过程

传统 RAG 通常由人类预定义检索路径；而 Agentic RAG 的显著特征是 **Agent 自己决定如何解决问题**。

例如，当被要求“制定产品发布策略”时，Agent 可能自主决定：

1. 使用 Bing Web Grounding 检索市场趋势报告
2. 使用 Azure AI Search 查找竞争对手数据
3. 使用 Azure SQL Database 关联历史销售指标
4. 通过 Azure OpenAI Service 综合策略
5. 评估策略是否存在漏洞，必要时再次检索

这些步骤不是人工写死的 prompt chain，而是由模型根据检索到的信息质量动态决定。

---

## 迭代循环、工具集成与记忆

一个 Agentic RAG 会话的典型流程：

| 阶段 | 说明 |
|------|------|
| **初始调用** | 用户目标输入 LLM |
| **工具调用** | 若发现信息缺失或指令模糊，选择检索工具（向量搜索、SQL、API） |
| **评估与精炼** | 审查返回数据，决定是否充分；若不足则改写查询或换工具 |
| **重复直到满意** | 循环继续，直到模型认为证据充分、结论可靠 |
| **记忆与状态** | 维护跨步骤状态，避免重复循环，并基于先前尝试做出更明智决策 |

---

## 失败处理与自我纠错

Agentic RAG 遇到死胡同时可采取：

- **迭代与重新查询**：尝试新搜索策略、改写数据库查询或查看其他数据集
- **使用诊断工具**：调用额外函数验证推理步骤或确认检索数据正确性（如 Azure AI Tracing）
- **人工接管**：高风险或反复失败场景下标记不确定性，请求人工指导

---

## Agentic RAG 的边界

课程强调 Agentic RAG 并非 AGI：

1. **领域特定自主性**：只在人类定义的领域、工具、策略范围内运作
2. **依赖基础设施**：能力受限于开发者集成的工具和数据
3. **遵守护栏**：受伦理、合规、业务策略约束

---

## 实用价值场景

- ** correctness-first 环境**：合规检查、监管分析、法律研究
- **复杂数据库交互**：NL2SQL、结构化数据查询需要自动修正
- **长流程工作流**：会话随新信息出现而演化

---

## 治理、透明与信任

- **可解释推理**：记录查询、来源、推理步骤，形成审计轨迹
- **偏见控制与平衡检索**：调整检索策略，确保数据来源多样、平衡
- **人工监督与合规**：高风险任务保留人工审查

---

## 代码示例

- Python：[05-python-agent-framework.ipynb](https://github.com/microsoft/ai-agents-for-beginners/blob/main/05-agentic-rag/code_samples/05-python-agent-framework.ipynb)

---

## 关联阅读

- [[14_RAG_Systems/Advanced_RAG/Agentic_RAG_Guide]] — Agentic RAG 完整指南
- [[14_RAG_Systems/RAG_Systems]] — RAG 系统核心概念
- [[_concepts/rag-systems]] — RAG 检索增强生成
- [[14_RAG_Systems/Advanced_RAG/RAG_Advanced_2026]] — 高级 RAG 技术
- [[15_Agent_Production/Course_Notes/Microsoft_AI_Agents_L04_Tool_Use]] — 工具使用设计模式
- [[15_Agent_Production/Microsoft_AI_Agents_L07_Planning]] — 规划设计模式
