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
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: core
created: 2026-05-31
updated: 2026-07-21
name_zh: "AI智能体"
---

# AI智能体

> 中文简称：AI智能体

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

- Agent的幻觉控制仍不完善，多步推理中错误会逐步累积
- 长上下文和记忆限制：LLM上下文窗口有限，长期任务管理需外部存储方案
- Agent无限循环防护（最大步数、循环检测、进度监控）是工程必需
- 多智能体系统的通信开销和冲突解决缺乏通用方案
- 生产环境Agent的可解释性和责任归属仍是法律灰色地带
- 多模态 Agent（视觉+语言+操作）的评估标准尚未统一

## 2026 年 Agent 生态现状

| 类别 | 代表产品/框架 | 特点 |
|------|------------------|------|
| **编程 Agent** | Claude Code, Cursor, Windsurf, Devin | 自主完成软件开发任务 |
| **通用 Agent** | ChatGPT + Tools, Claude + MCP | 多工具调用、多模态 |
| **企业 Agent** | Microsoft Copilot, Google Gemini | 企业应用集成 |
| **开源框架** | LangGraph, CrewAI, AutoGen, Agno | 可定制、可自托管 |
| **协议标准** | MCP, A2A, AAIF | 工具调用、Agent 协作 |
| **评估平台** | LangSmith, AgentOps, Braintrust | 可观测性、评估 |

## 生产最佳实践

1. **从简单开始**：先用单 Agent + 少量工具验证价值，再扩展复杂度
2. **工具沙箱化**：代码执行、数据库操作等高风险工具必须隔离
3. **设置护栏**：输入过滤、输出检查、最大步数、成本限制
4. **可观测性**：全链路追踪，每个决策点可回溯
5. **人在回路**：高风险操作必须人工确认
6. **版本化配置**：Prompt、工具定义、模型路由纳入 Git
7. **持续评估**：生产环境持续监控任务成功率、用户满意度

## Agent 成熟度模型

```yaml
# Agent 成熟度自评
level_1_experimental:
  - single_agent: "单 Agent + 基础工具"
  - manual_testing: "手动测试验证"
  - no_monitoring: "无监控"

level_2_production:
  - multi_tool: "多工具集成"
  - observability: "OpenTelemetry 追踪"
  - guardrails: "输入输出护栏"
  - human_in_loop: "高风险操作人工确认"

level_3_enterprise:
  - multi_agent: "多 Agent 协作"
  - governance: "完整治理体系"
  - compliance: "合规审计"
  - self_healing: "自动降级与恢复"
```

## 2026 Agent 生态全景

| 层次 | 代表 | 说明 |
|------|------|------|
| **基础模型** | GPT-4o, Claude 4, Gemini 2.5, Qwen3 | 原生工具调用 + 超长上下文 |
| **推理模型** | o3, R1, QwQ, Gemini 2.5 Pro | 内置规划与自我验证 |
| **编排框架** | LangGraph, CrewAI, AutoGen/AG2 | 多 Agent 协作与状态管理 |
| **工具协议** | MCP, A2A, OpenAPI | 标准化工具接入与跨框架互操作 |
| **可观测性** | LangSmith, AgentOps, Arize | 全链路追踪与评估 |
| **部署平台** | Vercel AI SDK, Cloudflare Agents, AWS Bedrock | 生产级 Agent 托管 |

## Agent 设计核心原则

1. **单一职责**: 每个 Agent 专注一个领域，避免“方能” Agent
2. **明确边界**: 清晰定义 Agent 能做什么、不能做什么
3. **可观测**: 每步决策可追踪、可解释
4. **容错设计**: 工具失败、模型幻觉、超时都需处理
5. **人在回路**: 高风险操作必须人工确认
6. **渐进式自治**: 从 L0（纯工具）逐步升级到 L3（全自治）
7. **成本意识**: 每个 Agent 设置 token 预算和调用上限
8. **安全护栏**: 输入输出过滤 + 工具权限控制 + 审计日志
9. **测试验证**: 上线前用基准测试集验证 Agent 行为符合预期

## 来源

- 06_强化学习/AI_Agents/AI_Agents.md

## Related

- [[治理/agents-reinforcement-learning]] — AI 智能体 × 强化学习 (共享: ai-agents, mcp, planning, react, rl, tool-use)
- [[15_智能体/01_Agent基础/16_AI_Agent]] — AI智能体 - 小白版 🤖 (共享: ai-agents, rl)
- [[06_强化学习/AI_Agents/Agent-in-nutshell]] — AI 智能体速成指南 (共享: ai-agents, rl)
- [[15_智能体/01_Agent基础/03_Agent_未来_路线图_2026_2030]] — Agent 未来发展路线图 2026-2030 (共享: ai-agents, rl)
- [[概念/tool-calling]] — 工具调用
- [[概念/tool-calling-safety]] — 工具调用安全
- [[概念/agent-evaluation-benchmarks]] — Agent 评估基准
- [[概念/agentic-rag]] — Agentic RAG
- [[15_智能体/README.md]] — Agent 安全与评估大白话
