---
title: "RAG 与 Agent 的融合 (RAG-Agents Synthesis)"
category: -synthesis
tags: ["synthesis", "rag", "ai-agents", "agentic-rag", "tool-calling", "retrieval"]
summary: "RAG 系统正在从被动检索工具演化为 Agent 的核心知识引擎——Agentic RAG 将检索、推理、行动统一在一个自主循环中。"
created: 2026-06-12
updated: 2026-06-12
tier: core
aliases:
  - "Rag Agents"
  - "rag agents"
sources: []

---
# RAG 与 Agent 的融合 (RAG-Agents Synthesis)

> RAG 系统正在从被动检索工具演化为 Agent 的核心知识引擎——Agentic RAG 将检索、推理、行动统一在一个自主循环中。

---

## 跨域分析

### 演化路径

```
朴素 RAG → 高级 RAG → Agentic RAG → RAG Agent

2023: Query → Retriever → Generator → Answer
2024: Query → Router → Retriever → Re-ranker → Generator → Answer
2025: Query → Agent → [Search/Retrieve/Compute] → Reason → Answer
2026: Query → Multi-Agent → [Plan/Search/Retrieve/Code/Verify] → Answer
```

### 融合的三个层面

1. **RAG 作为 Agent 工具** ([[RAG系统/Advanced_RAG/RAG_Advanced_2026]]):
   - Agent 将 RAG 检索作为一个 Tool Calling 动作
   - 决定何时检索、检索什么、如何使用结果
   - 参考: [[智能体/Agent_Skills/Tool_Calling_Best_Practices]]

2. **Agent 增强 RAG** ([[强化学习/AI_Agents/AI_Agents]]):
   - Agent 自主优化检索策略（选择数据库、调整查询）
   - 多步检索 + 推理循环（ReAct 模式）
   - 自我验证检索结果的相关性

3. **统一架构**:
   - LangGraph 实现 RAG + Agent 工作流 ([[智能体/Agent_Workflow/LangGraph_Deep_Dive]])
   - 数据摄入管道自动化 ([[RAG系统/Advanced_RAG/Data_Ingestion_Pipeline]])
   - 评估体系统一 ([[模型评估/Evaluation_Metrics]])

### 关键挑战

| 挑战 | RAG 视角 | Agent 视角 |
|------|----------|------------|
| 幻觉 | 检索不到 → 编造 | 推理错误 → 编造 |
| 延迟 | 向量搜索耗时 | 多步调用累积 |
| 成本 | 嵌入 API 费用 | Token 消耗 |
| 评估 | 检索准确率 | 端到端任务完成率 |

---

## 2026 最佳实践

1. **Hybrid Search + Re-ranking**: 向量搜索 + 关键词搜索 + 交叉编码器重排
2. **Query Decomposition**: Agent 将复杂问题拆分为多个子查询
3. **Self-Reflection**: Agent 检查检索结果是否充分，不足时自动重试
4. **Multi-Source RAG**: 同时从向量库、SQL 数据库、API、Web 检索

---

## 相关页面

- [[RAG系统/RAG_Systems]] — RAG 系统全景
- [[RAG系统/Advanced_RAG/RAG_Advanced_2026]] — RAG 高级实践
- [[智能体/README]] — Agent 生产部署
- [[智能体/Agent_Workflow/Agentic_Workflow_Design_Patterns_2026]] — Agentic 工作流设计模式
- [[智能体/Agent_Skills/Tool_Calling_Best_Practices]] — Tool Calling 最佳实践
