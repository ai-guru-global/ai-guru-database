---
title: "Agent 规划（Planning）"
category: -concepts
tags: ["agent", "planning", "plan-and-execute", "rewoo", "task-decomposition", "reasoning"]
relationships:
  - target: "概念/ai-agents"
    type: core_ability
  - target: "概念/agent-loop"
    type: precedes
  - target: "概念/agent-reflection"
    type: complementary
  - target: "概念/reasoning-models"
    type: benefits_from
sources:
  - Agent/Agent_Foundations/AI_Agents.md
  - Agent/README.md
summary: "Agent 规划是把复杂任务拆解为可执行子步骤的能力。从 ReAct 的'边想边做'到 Plan-and-Execute 的'先规划再执行'再到 ReWOO 的'一次性规划'，规划质量直接决定 Agent 能否完成多步任务。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: reviewed
lifecycle_changed: 2026-06-23
tier: core
created: 2026-06-23
updated: 2026-06-23
aliases:
  - "Agent Planning"
  - "agent planning"

---
# Agent 规划（Planning）

## 核心要点

- **规划是 Agent 的"大脑前额叶"**：决定做什么、按什么顺序、何时停止。
- **三种范式**：ReAct（交错推理-行动）、Plan-and-Execute（先规划全流程再执行）、ReWOO（一次性生成所有步骤再执行）。
- **关键挑战**：任务拆解粒度、规划与现实的偏差、动态重规划。

## 一句话理解

规划差 Agent 像"想到哪做到哪"易跑偏；规划好 Agent 像"项目经理"先列清单再逐项推进，遇到偏差还能调整。

## 详细内容

### 三种规划范式

```
ReAct（交错式）：
  思考→行动→观察→思考→行动→观察→...
  优点：灵活，能根据观察调整
  缺点：每步都调 LLM，慢且贵；中途出错会连锁

Plan-and-Execute（先规划后执行）：
  1. Planner LLM：生成完整步骤列表 [step1, step2, ..., stepN]
  2. Executor LLM：逐个执行
  3. Replanner：执行偏差大时重规划
  优点：规划一次成本低；步骤可并行
  缺点：初始规划可能不切实际

ReWOO（一次规划，工具填充）：
  1. Planner：生成含占位符的计划（#E1, #E2 依赖 #E1）
  2. Worker：并行填充占位符（调用工具）
  3. Solver：综合所有结果给最终答案
  优点：LLM 调用最少（3 次）；并行执行最快
  缺点：不适合需要顺序依赖的任务
```

### 规划质量的决定因素

| 因素 | 影响 | 2026 最佳实践 |
|------|------|--------------|
| **模型推理力** | 弱模型规划粗糙 | 用 o1/R1 等推理模型做 Planner |
| **任务表示** | 自然语言计划易歧义 | 用结构化 JSON（步骤/依赖/验收） |
| **工具描述** | 描述不清导致误规划 | 工具 schema + 使用示例 |
| **反馈循环** | 无重规划=死板 | 执行后评估，偏差超阈值触发 replan |

### 2026 趋势：推理模型改变规划

推理模型（o1/DeepSeek-R1）的"长链思考"本质上**内化了规划**——它们在输出前内部完成多步推理，使得传统显式 Plan-and-Execute 的价值下降。新趋势：
- 简单任务：推理模型直接做（隐式规划）
- 复杂/工具密集任务：仍需显式规划 + 推理模型执行

## Related

- [[概念/ai-agents|AI Agent]] — Agent 基础
- [[概念/agent-loop|Agent Loop]] — 规划后的执行循环
- [[概念/agent-reflection|Agent 反思]] — 规划失败时的自我修正
- [[概念/reasoning-models|推理模型]] — 内化规划的新范式
- [[智能体/Agent_Foundations/AI_Agents|AI Agents 详解]]
