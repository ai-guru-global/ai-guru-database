---
title: "Agent 评估 × 模型评估 — 从指标到行为的评估范式迁移"
category: -synthesis
tags: [agent-evaluation, model-evaluation, benchmark, evaluation, llm-as-judge, agentic-ai]
sources:
  - "[[智能体/Agent_Evaluation/Assessment/Evaluation_Workflow]]"
  - "[[模型评估/Model_Evaluation]]"
  - "[[模型评估/Evaluation_Tools/LLM_as_Judge_Deep_Dive]]"
  - "[[模型评估/Benchmarks/Agentic_Benchmark_Guide]]"
created: 2026-06-05
updated: 2026-06-05
summary: "传统模型评估关注'输出是否正确'，Agent 评估关注'行为是否达成目标'。两者交汇催生了 LLM-as-Judge、过程奖励、轨迹评估等新范式。"
provenance:
  extracted: 0.2
  inferred: 0.7
  ambiguous: 0.1
lifecycle: draft
lifecycle_changed: 2026-06-05
tier: core
aliases:
  - "Agent Evaluation Model Evaluation"
  - "agent evaluation model evaluation"

---
# Agent 评估 × 模型评估 — 从指标到行为的评估范式迁移

## The Connection

传统模型评估（Model Evaluation）建立在**确定性输入-输出映射**的假设上：给定 prompt，模型输出 token 序列，用 BLEU/ROUGE/accuracy 衡量质量。但 AI Agent 打破了这个假设——Agent 的输出不是一次性的，而是**多步骤的行为轨迹**（工具调用、推理链、环境交互），评估对象从"单次输出"变成了"整个决策过程"。

## Where They Co-occur

- **LLM-as-Judge**：用强模型评估弱模型的输出，既用于传统 LLM 评估（MT-Bench），也用于 Agent 轨迹评分
- **Benchmark 设计**：SWE-bench（代码 Agent）、GAIA（通用 Agent）、BFCL（函数调用）都借鉴了传统 benchmark（MMLU、HumanEval）的方法论
- **在线评估**：A/B 测试从"模型 A vs B 的指标对比"演进为"Agent A vs B 的任务完成率对比"
- **安全评估**：Red-teaming 从"对抗 prompt"扩展为"对抗 Agent 行为链"

## Cross-cutting Insight

Agent 评估不是模型评估的简单扩展，而是一次**范式迁移**：

| 维度 | 传统模型评估 | Agent 评估 |
|------|-------------|-----------|
| 评估对象 | 单次输出 | 多步行为轨迹 |
| 成功标准 | 输出正确性 | 目标达成率 |
| 评估方法 | 自动化指标 + 人工标注 | LLM-as-Judge + 过程奖励模型 |
| 基准设计 | 固定 QA 对 | 交互式环境 + 动态场景 |
| 失败分析 | 错误分类 | 失败点定位（哪一步出错） |
| 回归测试 | 模型版本对比 | 策略版本 + 环境版本对比 |

核心洞察：**Agent 评估 = 模型评估 × 环境评估 × 策略评估**。三者耦合使得评估复杂度呈指数增长，这解释了为什么 SWE-bench 等 Agent benchmark 的构建成本远高于 MMLU。

## Tensions and Trade-offs

| 张力 | 说明 |
|------|------|
| **确定性 vs 随机性** | 传统评估要求可复现，但 Agent 行为因工具调用、环境状态而天然不确定 |
| **自动化 vs 人类判断** | Agent 的"好行为"难以自动量化——需要人类判断"这个决策过程是否合理" |
| **单元 vs 集成** | 模型评估类似单元测试（单模块），Agent 评估类似集成测试（多模块协作），两者需要分层 |
| **成本 vs 覆盖** | Agent 评估需要真实环境交互（API 调用、代码执行），成本远高于静态 benchmark |

## Open Questions

- 如何设计 Agent 的"过程奖励模型"（Process Reward Model）来评估中间步骤质量，而非只看最终结果
- 能否将传统模型评估的 calibration 方法应用于 Agent——让 Agent 的置信度与实际成功率对齐
- Agent 回归测试中如何处理环境版本漂移（API 变更、数据库状态变化）

## Related

- [[智能体/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Agent 评估工作流
- [[模型评估/Model_Evaluation]] — 模型评估基础
- [[模型评估/Evaluation_Tools/LLM_as_Judge_Deep_Dive]] — LLM-as-Judge 深度解读
- [[模型评估/Benchmarks/Agentic_Benchmark_Guide]] — Agent 评估基准指南
- [[模型评估/Evaluation_Tools/Online_Evaluation]] — 在线评估方法
- [[治理/benchmark-evaluation]] — 评测基准 × 评测方法论
