---
title: "多 Agent 编排（Multi-Agent Orchestration）"
category: -concepts
tags: ["multi-agent", "orchestration", "coordination", "agent-swarm", "workflow", "crewai"]
relationships:
  - target: "概念/ai-agents"
    type: scales
  - target: "概念/agent-planning"
    type: distributes
  - target: "概念/agent-reflection"
    type: coordinates
sources:
  - Agent/README.md
  - Agent/Agent_Workflow/README.md
summary: "多 Agent 编排让多个专精 Agent 协作完成复杂任务。从'顺序流水线'到'并行 swarm'再到'层级委派'，编排模式决定协作效率。代表框架：CrewAI、AutoGen、LangGraph、OpenAI Swarm。"
provenance:
  extracted: 0.65
  inferred: 0.3
  ambiguous: 0.05
base_confidence: 0.76
lifecycle: reviewed
lifecycle_changed: 2026-06-23
tier: core
created: 2026-06-23
updated: 2026-06-23
aliases:
  - "Multi Agent Orchestration"
  - "multi agent orchestration"

---
# 多 Agent 编排（Multi-Agent Orchestration）

## 核心要点

- **单 Agent 的局限**：一个 Agent 承担所有角色，上下文膨胀、能力泛化差。
- **多 Agent 的价值**：每个 Agent 专精一域，上下文隔离、可并行、可独立调试。
- **三种编排模式**：顺序（流水线）、并行（swarm）、层级（supervisor-worker）。

## 一句话理解

单 Agent 像"一人公司"什么都干但都不精；多 Agent 编排像"专业团队"——有产品经理（规划）、工程师（执行）、QA（验证），分工协作完成大项目。

## 详细内容

### 三种编排模式

```
1. 顺序流水线（Sequential Pipeline）
   Researcher → Writer → Editor → Publisher
   每个输出是下一个输入，串行执行
   适合：内容生产、数据处理流水线

2. 并行 Swarm（并行蜂群）
   ┌→ Agent A（分析数据）
   ├→ Agent B（查文献）  → 汇总 Agent
   └→ Agent C（做图表）
   多 Agent 并行，结果汇总
   适合：信息收集、对比分析

3. 层级委派（Hierarchical / Supervisor-Worker）
   Supervisor Agent（分配任务）
   ├→ Worker 1（专精编码）
   ├→ Worker 2（专精测试）
   └→ Worker 3（专精文档）
   Supervisor 决策"谁做什么"，Worker 执行
   适合：复杂项目、需动态分工
```

### 主流框架对比

| 框架 | 出品 | 编排模式 | 特点 |
|------|------|----------|------|
| **CrewAI** | 社区 | 角色+任务 | 简单直观，定义"船员"与"任务" |
| **AutoGen** | 微软 | 对话式 | Agent 间对话协商 |
| **LangGraph** | LangChain | 图（状态机） | 最灵活，支持循环/条件分支 |
| **OpenAI Swarm** | OpenAI | 轻量 handoff | 极简，Agent 间转交控制权 |
| **Magentic-One** | 微软 | 层级 | 通用型多 Agent 系统 |

### 编排的挑战

| 挑战 | 问题 | 解法 |
|------|------|------|
| **通信开销** | Agent 间传消息消耗 token | 紧凑消息格式 + 共享黑板 |
| **错误传播** | 上游 Agent 错→下游连锁错 | 每步验证 + 兜底重试 |
| **死锁** | 互相等待结果 | 超时机制 + 有向无环图 |
| **成本** | N 个 Agent = N 倍 LLM 调用 | 小模型做简单子任务 |
| **调试** | 难追踪哪个 Agent 出错 | 全链路 trace（LangSmith） |

### 2026 趋势

- **Agent 间协议标准化**：MCP（Model Context Protocol）让 Agent 互操作
- **Swarm 涌现**：大规模 Agent 协作（数十/数百）做超复杂任务
- **人机混合编排**：人在环中（Human-in-the-loop）做关键决策节点

## Related

- [[概念/multi-agent|Multi-Agent System]] — 系统概念视角
- [[概念/ai-agents|AI Agent]] — 单 Agent 基础
- [[概念/agent-planning|Agent 规划]] — Supervisor 的规划
- [[概念/agent-reflection|Agent 反思]] — Worker 的自我修正
- [[概念/agent-loop|Agent Loop]] — 单 Agent 的执行循环
- [[智能体/README|Agent 生产部署]] — 编排实践
- [[概念/autogen|AutoGen]] — 编排框架
- [[概念/agent-production-deployment|Agent 生产部署]] — 编排后的生产交付
