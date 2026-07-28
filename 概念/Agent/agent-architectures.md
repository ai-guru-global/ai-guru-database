---
title: "Agent 架构模式 (Agent Architectures)"
category: -concepts
tags: ["agent-architecture", "react", "plan-execute", "multi-agent", "orchestration"]
relationships:
  - target: "概念/Agent/ai-agents"
    type: part_of
  - target: "概念/Agent/agent-loop"
    type: complements
  - target: "概念/Agent/multi-agent"
    type: related_to
sources:
  - 15_智能体/01_Agent_Foundations/
  - 15_智能体/03_Agent_Workflow/
summary: "Agent 架构模式是构建智能体系统的设计蓝图，涵盖 ReAct、Plan-and-Execute、Reflection、多智能体编排等范式，决定了 Agent 的自主性、可控性与成本边界。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Agent Architectures"
  - "Agent Architecture"
  - "智能体架构"
name_zh: "Agent 架构模式"
---
# Agent 架构模式 (Agent Architectures)

> 中文简称：Agent 架构模式

> 架构决定 Agent 的能力上限与失控下限。

---

## 1. 定义

**Agent 架构模式**指组织 LLM、工具、记忆与控制流的系统设计范式。核心权衡：**自主性**（模型决定流程）vs **可控性**(代码决定流程）。Anthropic 将其区分为 Workflow（预定义路径）与 Agent（模型自主决策）两大类。

---

## 2. 主流架构范式

| 范式 | 控制流 | 特点 | 适用 |
|------|--------|------|------|
| **ReAct** | 思考→行动→观察 循环 | 简单通用，单 Agent 基线 | 工具调用类任务 |
| **Plan-and-Execute** | 先规划后执行 | 可审计、减少漂移 | 多步长任务 |
| **Reflection** | 生成→自评→修正 | 提升质量、多耗 token | 代码/写作 |
| **Router/级联** | 分类器分发到子流程 | 成本可控 | 客服/多领域 |
| **Orchestrator-Workers** | 主 Agent 分派子 Agent | 并行、隔离上下文 | 研究/搜索 |
| **状态机/图** | 显式节点+边（LangGraph） | 强可控、可恢复 | 生产工作流 |

---

## 3. 架构设计维度

1. **上下文管理**：单窗口 vs 子 Agent 隔离 vs 外部记忆
2. **人机协同**：全自动 / 关键步审批（human-in-the-loop）
3. **错误恢复**：重试、回滚、checkpoint 持久化
4. **终止条件**：轮数上限、预算上限、目标校验

---

## 4. 选型建议

| 场景 | 推荐 |
|------|------|
| 简单确定性流程 | Workflow（链式/路由），不要上 Agent |
| 开放式研究/编码 | 单 ReAct Agent + 强工具 |
| 长任务多领域 | Orchestrator + 专职子 Agent |
| 强合规生产系统 | 图/状态机架构 + 审批节点 |

---

## Related

- [[概念/Agent/ai-agents]] — AI Agent 总览
- [[概念/Agent/agent-loop]] — Agent 循环
- [[概念/Agent/react-agent]] — ReAct 模式
- [[概念/Agent/agent-planning]] — 规划能力
- [[概念/Agent/agent-reflection]] — 反思模式
- [[概念/Agent/multi-agent-orchestration]] — 多智能体编排
- [[概念/Agent/langgraph]] — LangGraph（图架构框架）
- [[概念/Agent/agent-memory-systems]] — 记忆系统

> ℹ️ 2026 年共识：从"越自主越好"回摆到"最小必要自主性"——先 Workflow、后 Agent，复杂度按需引入。
