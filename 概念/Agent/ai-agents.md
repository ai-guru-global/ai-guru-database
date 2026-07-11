---
title: AI智能体
category: -concepts
tags:
- rl
- ai-agents
- llm
- react
- planning
- tool-use
- multi-agent
- mcp
aliases:
- AI Agents
- 智能体
- Agent
- AI代理
relationships:
- target: '概念/reinforcement-learning'
  type: related_to
- target: '概念/deep-reinforcement-learning'
  type: related_to
- target: '概念/multimodal-vision'
  type: related_to
- target: '概念/tool-calling'
  type: uses
- target: '概念/tool-calling-safety'
  type: secures
- target: '概念/agent-evaluation-benchmarks'
  type: evaluated_by
- target: '概念/agentic-rag'
  type: related_to
sources:
- 06_reinforcement-learning_unsupervised-learning/AI_Agents/AI_Agents.md
summary: AI智能体具备感知、规划、工具调用和自我反思能力，ReAct框架是当前主流范式，MCP和A2A协议推动Agent生态标准化。
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31 00:00:00+00:00
updated: 2026-05-31 00:00:00+00:00
---

# AI智能体

AI智能体（AI Agents）是能感知环境、自主决策、调用工具并持续学习的智能系统。与传统AI的"单次输入输出"不同，Agent具备**记忆、规划、工具使用和自我反思**能力，完成复杂多步骤任务。Agent的决策理论基础来自强化学习的序贯决策框架，感知能力依赖多模态视觉等技术。

## 核心要点

- **ReAct框架**（reasoning-models + Acting）是当前最流行的Agent范式，交替进行推理和行动
- 核心能力：感知→规划→决策→执行→反思→记忆的OODA循环
- 三层记忆架构：短期（上下文窗口）、工作（当前计划）、长期（向量数据库）
- MCP（Model long-context-models Protocol）标准化Agent工具调用，A2A协议实现Agent间协作
- Agent安全边界设计：沙箱环境、权限控制、人在回路是生产级Agent的必要条件

## 详细内容

### Agent vs 传统AI

| 维度 | 传统AI | AI Agent |
|------|--------|---------|
| 交互模式 | 单次问答 | 多轮自主决策 |
| 工具使用 | 无 | 调用API、代码执行器 |
| 记忆 | 仅上下文 | 短期+长期记忆 |
| 规划 | 无 | 任务分解、多步规划 |
| 反思 | 无 | 自我评估、错误修正 |

### 推理框架

**Chain-of-Thought (CoT)**：引导LLM逐步推理，"Let's think step by step"即可激活。

**Tree-of-Thought (ToT)**：探索多条推理路径，用BFS/DFS选择最优，支持回溯。

**ReAct**：交替执行Thought（推理）→ Action（调用工具）→ Observation（观察结果），可解释性强。

**Reflexion**：在ReAct基础上增加自我反思，从失败中学习，生成改进策略后重试。

### 多智能体架构

| 架构 | 特点 | 适用场景 |
|------|------|---------|
| 层级 | 管理Agent分配子任务 | 软件开发 |
| 对等 | 去中心化协作 | 分布式任务 |
| 辩论 | 提议-批评-综合 | 学术评审 |
| 投票 | 多Agent并行投票 | 医疗诊断 |

### 2026协议栈

**MCP**（Anthropic/Linux基金会）：Agent的"USB-C接口"，基于JSON-RPC 2.0标准化工具调用，5000+社区Servers。**A2A**（Google）：Agent间协作协议，Agent Card描述能力，任务驱动协作模型。**AAIF**：企业级治理层，身份认证、策略执行、审计日志。

### 基础设施五层架构

计算层（model-deployment/Container）→ 存储层（Redis/Vector DB）→ 通信层（MCP/A2A/API）→ 可观测层（LangSmith/追踪）→ 安全层（认证/过滤/审核）。

### Agent测试与评估（Agent Harness）

生产级Agent需要四层Harness支撑：Test Harness（沙箱环境+Fixtures）、Evaluation Harness（LLM-as-Judge多维度评分）、Safety Harness（对抗测试+越狱检测+权限测试）、Monitoring Harness（执行追踪+性能指标+成本分析）。

### Agent与RAG的区别

RAG是单次检索增强的问答系统，无状态、无规划。Agent是多轮自主决策系统，有状态（记忆）、有规划（任务分解）、有工具（搜索/代码/API）、有反思。Agent可以将RAG作为其中一个工具使用。复杂任务用Agent，简单知识问答用RAG。

### 典型应用

软件开发助手（Devin）、科研辅助（Consensus/Elicit）、客户服务（24/7多语言）、个人助理（日程/邮件/旅行）、教育辅导（个性化教学）、数据分析（自动SQL+可视化+报告）、创意内容生成（多Agent协作编剧）。

## 开放问题

- Agent的幻觉控制仍不完善，多步推理中错误会逐步累积 ^[ambiguous]
- 长上下文和记忆限制：LLM上下文窗口有限，长期任务管理需外部存储方案
- Agent无限循环防护（最大步数、循环检测、进度监控）是工程必需
- 多智能体系统的通信开销和冲突解决缺乏通用方案
- 生产环境Agent的可解释性和责任归属仍是法律灰色地带

## 来源

- 强化学习/AI_Agents/AI_Agents.md

## Related

- [[治理/agents-reinforcement-learning]] — AI 智能体 × 强化学习 (共享: ai-agents, mcp, planning, react, rl, tool-use)
- [[强化学习/AI_Agents/AI_Agents_for_dummy]] — AI智能体 - 小白版 🤖 (共享: ai-agents, rl)
- [[强化学习/AI_Agents/Agent-in-nutshell]] — AI 智能体速成指南 (共享: ai-agents, rl)
- [[强化学习/AI_Agents/Agent_Future_Roadmap_2026_2030]] — Agent 未来发展路线图 2026-2030 (共享: ai-agents, rl)
- [[概念/tool-calling]] — 工具调用
- [[概念/tool-calling-safety]] — 工具调用安全
- [[概念/agent-evaluation-benchmarks]] — Agent 评估基准
- [[概念/agentic-rag]] — Agentic RAG
- [[智能体/Agent_Safety_Evaluation_for_dummy]] — Agent 安全与评估大白话
