---
title: "Agent 评估基准"
category: -concepts
tags: ["agent-evaluation", "benchmark", "agent", "tool-calling", "reasoning", "multistep"]
relationships:
  - target: "_concepts/ai-agents"
    type: evaluates
  - target: "_concepts/model-evaluation"
    type: belongs_to
  - target: "_concepts/tool-calling"
    type: tests
  - target: "_concepts/agentic-rag"
    type: related_to
sources:
  - 08_Model_Evaluation/Benchmarks/Agentic_Benchmark_Guide.md
  - 15_Agent_Production/Agent_Evaluation/README.md
  - 15_Agent_Production/Agent_Harness/Agent_Harness_Comprehensive_2026.md
summary: "Agent 评估基准是专门测试 AI Agent 综合能力的数据集和指标。它不只考模型会不会答题，而是考 Agent 能否正确规划、调用工具、多步推理、处理错误、最终完成任务。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Agent Evaluation Benchmarks"
  - "agent evaluation benchmarks"

---
# Agent 评估基准

## 核心要点

- **Agent 不只是聊天模型**：它会调用工具、做多步决策、与环境交互。
- **传统 LLM 基准（MMLU、GSM8K）测不出 Agent 能力**：它们测的是知识/推理，不是行动。
- **Agent 评估基准模拟真实任务**：给 Agent 一个目标、一些工具，看它能不能独立完成。
- **评估维度**：任务成功率、步骤效率、工具调用正确率、错误恢复能力、成本。

## 一句话理解

Agent 评估基准就像 AI 的‘综合素质面试’：不是让它背答案，而是给它一个真实任务，观察它怎么思考、怎么动手、怎么纠错。

## 详细内容

### 为什么需要专门基准？

一个 Agent 可能：
- 模型很强，但总是调用错工具。
- 能调用工具，但多走很多弯路。
- 遇到错误就崩溃，不会自我修正。
- 成本高得离谱，每个任务调用几十次 API。

传统基准测不到这些，所以需要 Agent 专用基准。

### 主流 Agent 基准

| 基准 | 测什么 | 特点 |
|------|--------|------|
| **SWE-bench** | 真实 GitHub issue 修复 | 代码 + 工具调用 |
| **AgentBench** | 多环境任务（OS、数据库、网页、知识图谱） | 8 个环境 |
| **WebArena** | 网页操作任务 | 真实网站交互 |
| **ToolBench** | 工具使用能力 | 16000+ API |
| **GAIA** | 需要多步推理和工具的真实问题 | 难度分层 |
| **MLAgentBench** | 机器学习实验自动化 | 科研任务 |

### 评估维度

```
任务成功率：最终目标是否达成
步骤数：用了多少步，是否高效
工具调用准确率：是否调对了工具、参数是否正确
错误恢复率：犯错后能否自己纠正
成本：token 消耗、API 调用次数、延迟
安全性：是否产生越权/有害操作
```

### 评估方法

| 方法 | 说明 |
|------|------|
| **最终答案匹配** | 看结果是否正确 |
| **过程轨迹评估** | 检查中间步骤是否合理 |
| **LLM-as-Judge** | 用强模型评判 Agent 表现 |
| **人类评估** | 人工标注质量 |
| **成本-性能权衡** | 同样效果下谁更便宜 |

## 开放问题

- Agent 任务的‘正确答案’有时不唯一，如何客观评估。
- 评估环境（沙箱、真实网站）的可复现性。
- 评估成本随任务复杂度指数增长。

## Related

- [[_concepts/ai-agents]] — AI Agent
- [[_concepts/tool-calling]] — 工具调用
- [[_concepts/model-evaluation]] — 模型评估
- [[_concepts/agentic-rag]] — Agentic RAG
- [[08_Model_Evaluation/Benchmarks/Agentic_Benchmark_Guide]] — Agentic 评估指南
- [[15_Agent_Production/Agent_Evaluation/README]] — Agent 评估
