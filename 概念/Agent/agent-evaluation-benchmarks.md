---
title: "Agent 评估基准"
category: -concepts
tags: ["agent-evaluation", "benchmark", "agent", "tool-calling", "reasoning", "multistep", "swe-bench", "gaia"]
relationships:
  - target: "概念/Agent/ai-agents"
    type: evaluates
  - target: "概念/Agent/tool-calling"
    type: tests
  - target: "概念/Agent/agent-reflection"
    type: evaluates
  - target: "概念/Agent/agentic-rag"
    type: related_to
sources:
  - 模型评估/Benchmarks/Agentic_Benchmark_Guide.md
  - Agent/Agent_Evaluation/README.md
summary: "Agent 评估基准是专门测试 AI Agent 综合能力的数据集和指标。它不只考模型会不会答题，而是考 Agent 能否正确规划、调用工具、多步推理、处理错误、最终完成任务。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Agent Evaluation Benchmarks"
  - "agent evaluation benchmarks"
  - "Agent 基准测试"

---
# Agent 评估基准

> Agent 评估基准就像 AI 的'综合素质面试'：不是让它背答案，而是给它一个真实任务，观察它怎么思考、怎么动手、怎么纠错。

## 核心要点

- **Agent 不只是聊天模型**：它会调用工具、做多步决策、与环境交互。
- **传统 LLM 基准测不出 Agent 能力**：MMLU/GSM8K 测知识/推理，不测行动。
- **Agent 评估模拟真实任务**：给 Agent 一个目标、一些工具，看它能否独立完成。
- **评估维度**：任务成功率、步骤效率、工具调用正确率、错误恢复、成本。

## 为什么需要专门基准

一个 Agent 可能：
- 模型很强，但总是调用错工具
- 能调用工具，但多走很多弯路
- 遇到错误就崩溃，不会自我修正
- 成本高得离谱，每个任务调用几十次 API

传统基准测不到这些，所以需要 Agent 专用基准。

## 主流 Agent 基准（2026）

| 基准 | 测什么 | 任务数 | 特点 | 最新 SOTA |
|------|--------|--------|------|----------|
| **SWE-bench Verified** | 真实 GitHub issue 修复 | 500 | 代码+工具 | ~50% |
| **SWE-bench Pro** | 更复杂的工程任务 | 1000+ | 多文件修改 | ~30% |
| **AgentBench** | 多环境任务 | 8环境 | OS/DB/网页/KG | 差异大 |
| **WebArena** | 网页操作任务 | 812 | 真实网站交互 | ~35% |
| **ToolBench** | 工具使用能力 | 16000+ API | 大规模工具 | ~60% |
| **GAIA** | 多步推理+工具 | 466 | 难度分层 | ~40% |
| **Terminal Bench** | 终端操作任务 | 80+ | 命令行交互 | ~65% |
| **MLAgentBench** | ML 实验自动化 | 13 | 科研任务 | ~40% |
| **Tau-Bench** | 客服工具调用 | 300+ | 多轮对话+工具 | ~70% |

## 评估维度体系

| 维度 | 指标 | 说明 |
|------|------|------|
| **任务成功率** | Pass@1 | 最终目标是否达成 |
| **步骤效率** | 步骤数 / 最优步骤 | 是否高效，无多余操作 |
| **工具调用** | 准确率 / 召回率 | 是否调对工具、参数正确 |
| **错误恢复** | 恢复率 | 犯错后能否自己纠正 |
| **成本** | tokens / API调用 / 延迟 | 资源消耗是否合理 |
| **安全性** | 越权率 / 有害操作率 | 是否产生危险行为 |

## 评估方法对比

| 方法 | 说明 | 优势 | 劣势 |
|------|------|------|------|
| **最终答案匹配** | 看结果是否正确 | 客观 | 忽略过程 |
| **过程轨迹评估** | 检查中间步骤 | 全面 | 标注成本高 |
| **LLM-as-Judge** | 用强模型评判 | 可扩展 | 可能有偏 |
| **人类评估** | 人工标注质量 | 最准确 | 贵且慢 |
| **成本-性能曲线** | 同效果下谁更便宜 | 实用 | 需多次实验 |

## 评估实践建议

1. **多基准组合**: 不要只看一个基准，组合 SWE-bench + GAIA + ToolBench 更全面
2. **控制成本**: 记录每个任务的 token 消耗，性价比很重要
3. **可复现性**: 使用固定 seed、固定模型版本，确保结果可复现
4. **分层评估**: 简单/中等/困难分别统计，避免均值掩盖问题
5. **对比基线**: 与人类表现、纯 LLM（无工具）对比，确认 Agent 的增量价值

## 开放问题

- Agent 任务的'正确答案'有时不唯一，如何客观评估
- 评估环境（沙箱、真实网站）的可复现性
- 评估成本随任务复杂度指数增长
- 基准污染：模型可能在训练数据中见过基准题目

## Related

- [[概念/Agent/ai-agents|AI Agent]]
- [[概念/Agent/tool-calling|工具调用]]
- [[概念/Agent/agent-reflection|Agent 反思]]
- [[概念/Agent/agentic-rag|Agentic RAG]]
- [[模型评估/Benchmarks/Agentic_Benchmark_Guide|Agentic 评估指南]]
- [[智能体/Agent_Evaluation/README|Agent 评估]]
