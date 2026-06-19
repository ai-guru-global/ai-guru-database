---
title: "Agent Loop (智能体循环)"
tags: [agent-loop, agentic-ai, agent-harness, runtime-engine, react, context-engineering]
created: 2026-06-17
---

# Agent Loop (智能体循环)

## 定义

Agent Loop 是智能体运行时的核心执行循环，驱动"感知-推理-行动-观察"的反复迭代，直到任务完成、预算耗尽或被外部终止。它是智能体区别于单次 LLM 调用的根本机制——将 LLM 从"无状态函数"转变为"有状态的持续执行引擎"。

## 核心机制

### 经典循环模型

Agent Loop 的每一步包含六个阶段：

1. **感知 (Perceive)**：收集上下文——用户输入 + 短期记忆 + 长期记忆向量检索
2. **推理 (Reasoning)**：组装 LLM 输入，调用模型生成决策
3. **决策 (Decision)**：解析输出，提取工具调用请求，验证合法性
4. **执行 (Execution)**：工具层隔离执行，超时限制，容错继续
5. **学习 (Learning)**：写入记忆系统（短期总是写入，高价值同步长期）
6. **判断 (Judgment)**：终止条件检查——最终答案 / 最大步数 / 总超时

### 循环而非链式

循环设计允许逐步细化目标，在每个迭代中获得反馈，动态调整策略。这是 ReAct（Reasoning + Acting）模式的工程实现：

```
Thought (分析) -> Action (工具调用) -> Observation (反馈) -> Thought -> ...
```

### 两种工程实现模式

**异步生成器模式**（Claude Code）：
- 流式响应实时推送（text_delta）
- StreamingToolExecutor 支持工具并发执行
- 低延迟高并发，适合交互式场景

**线性流水线模式**（OpenClaw）：
- 每轮循环独立阶段化：input -> assembly -> inference -> execution -> persist
- 单线程执行，确定性可追踪
- 适合自驱型长任务

### 终止条件

循环终止的五种触发方式：
1. 工具调用耗尽（最后一条消息无工具调用，直接回复）
2. 最大轮数限制（通常 10-30 轮）
3. Token 预算耗尽（上下文溢出无法继续）
4. 显式停止信号（用户取消、超时、停止标记）
5. 目标达成（高层目标追踪，自驱型）

### Token 预算管理

三级预算控制体系：

| 层级 | 粒度 | 典型阈值 | 超限策略 |
|------|------|---------|---------|
| Per-Request | 单次 API 调用 | 4k-100k output tokens | 截断输出、降级模型 |
| Per-Task | 完整任务（多轮） | 50-200 次调用 / 累计 1M tokens | 强制总结、终止循环 |
| Per-Day/Month | 账期全局 | $50/天、$1000/月 | 排队、降级、拒绝服务 |

## 关键设计决策

- **容错继续 vs 立即终止**：工具执行异常不终止循环，而是被捕获并记录为错误结果反馈给 LLM，让模型自行决定重试或换策略
- **流式输出 vs 批量返回**：流式降低用户感知延迟，但增加了状态管理复杂度（需要 MessageAssembler 增量累积内容块）
- **漂移检测**：长循环中目标漂移（Goal Drift）是核心风险，需通过关键词匹配、语义相似度、范围蠕变检测等方式纠正
- **检查点机制**：每 5 轮保存检查点，漂移或故障时可回滚到最近正确状态

## 与其他概念的关系

- [[agent-harness]] -- Agent Loop 是 Harness 运行时引擎的心脏，Harness 为循环提供工具层、记忆、安全和可观测性
- [[context-engineering]] -- 循环中每轮的上下文组装是上下文工程的核心应用场景
- [[mcp]] -- 循环中的工具调用通过 MCP 等协议与外部服务交互
- [[prompt-injection]] -- 循环中工具返回值可能被注入恶意指令，需在回注时隔离
- [[hallucination]] -- 循环中 LLM 幻觉可能生成无效工具参数，触发意外操作
- [[guardrails]] -- max_steps、token_budget、错误去重、成本熔断都是循环级别的护栏

## 深入阅读

- [[15_Agent_Production/Agent_Harness/Harness_Core_Subsystems.md]] -- 运行时引擎的深度工程实现
- [[15_Agent_Production/Agent_Workflow/AgentOps_Production_Guide.md]] -- Agent Loop 的微观/中观/任务级视角
- [[15_Agent_Production/OpenClaw_Ecosystem/OpenClaw_Internals.md]] -- OpenClaw 的 Agent Loop 内核
- [[16_AI_Coding/Theory/Claude_Agent_Architecture.md]] -- Claude Agent 的 ReAct 和 Plan-and-Solve 模式
- [[15_Agent_Production/Agent_Foundations/Agentic_AI_Complete_Guide.md]] -- ReAct 循环的理论基础
