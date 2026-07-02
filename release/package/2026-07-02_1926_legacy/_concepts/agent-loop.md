---

title: "Agent Loop (智能体循环)"
tags: [agent-loop, agentic-ai, agent-harness, runtime-engine, react, context-engineering]
created: 2026-06-17
tier: core
aliases:
  - "Agent Loop"
  - "agent loop"
category: -concepts
lifecycle: stable

relationships:
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
|

## Related
- [[_concepts/reflexion]] — 自我反思
