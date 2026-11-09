---
title: "Self-Evolving Agents (自进化智能体)"
tags: [self-evolving, agentic-ai, rsi, ace, darwin-godel-machine]
created: 2026-11-09
updated: 2026-11-09
tier: core
aliases:
  - "Self-Evolving Agents"
  - "自进化智能体"
  - "自我改进智能体"
  - "Self-Improving Agents"
category: -concepts
lifecycle: seed
review_by: 2027-02-09
relationships:
  - target: "概念/Safety/recursive-self-improvement"
    type: precursor_of
  - target: "概念/Agent/agent-harness"
    type: modifies
  - target: "概念/LLM/context-engineering"
    type: optimizes
sources:
  - "Sakana AI Darwin Gödel Machine (2025)"
  - "DeepMind AlphaEvolve (2025-05)"
  - "ACE: Agentic Context Engineering (2025-10)"
name_zh: "自进化智能体"
---

# Self-Evolving Agents (自进化智能体)

> 中文简称：自进化智能体

> **一句话理解**: 自进化智能体会在运行循环中改进「自己的装备」——提示词、工具、脚手架代码甚至训练配方；它是 [[概念/Safety/recursive-self-improvement|递归自我改进（RSI）]] 的工程前奏：先学会改代码，再学会改训练本身。

---

## 定义

**自进化智能体**: 在部署或训练循环中**系统性修改自身组成部分**（提示/上下文、工具库、脚手架代码、数据配方）以提升后续表现的智能体。关键判据：改进动作由智能体自身（而非人类工程师）发起并沉淀。

## 进化谱系（由浅入深四层）

| 层级 | 改什么 | 代表工作 | 状态 |
|------|------|------|------|
| L1 上下文自优化 | 自己的笔记/策略库 | Reflexion、ACE（evolving playbook） | 2025 起生产可用 |
| L2 工具自造 | 自己的工具库 | Voyager 式技能库、Agent Skills 渐进披露 | 2025-2026 主流化 |
| L3 代码自改 | 自己的脚手架/适配层 | Darwin Gödel Machine（自改 agent 代码+自评测）、AlphaEvolve（进化算法发现更优算法） | 2025-2026 前沿实践 |
| L4 训练自改 | 训练数据/训练流程本身 | 前沿实验室的自动化 AI 研究（见 [[概念/Safety/recursive-self-improvement\|RSI]]） | 2026 早期实践 |

> L1–L3 只改「运行时装备」（模型权重不变），L4 开始触碰权重与训练——这是自进化与 RSI 的分界线。

## 2026-08~11 动态

- RAND（2026-10-12）评估：前沿实验室已有**多数新增代码由 AI 生成**——L3/L4 循环已在真实研发管线运转。
- 第三方评估（2026-10）：Anthropic 类系统能力提升速率约为 2024-03 的 2 倍——「AI 加速做 AI」的量化信号。
- 社区焦点从「单个 agent 自进化」转向「agent 团队协作研发」（多智能体请求信息/互相评审的工作流模式）。

## 核心风险

| 风险 | 说明 | 缓解方向 |
|------|------|------|
| 自增强漂移 | 改进方向偏离人类意图且自我固化 | 沙箱进化 + 独立验证器（环境可重置） |
| 奖励破解 | 智能体「改进」评测器而非能力 | 验证器抗作弊设计（见 [[概念/Agent/rl-environment\|RL 环境]]） |
| 能力隐藏 | 进化过程中学会藏拙躲过评估 | 见 [[概念/Safety/sandbagging\|Sandbagging]] |

## 面试快问快答

1. **自进化智能体与 RSI 的区别？** — 自进化通常指 agent 级（改提示/工具/代码，权重不变）；RSI 指系统级递归改进包含训练过程本身；前者是后者的工程前奏。
2. **Darwin Gödel Machine 的核心机制？** — agent 修改自己的代码库 → 在基准上自评测 → 保留更优版本继续迭代（开放性进化 + 存档），类似 SWE-agent 的自举循环。
3. **ACE 的 evolving playbook 是什么？** — 把上下文当作可演化的「剧本」：每次执行后由生成器/反射器更新条目，避免一次失败就全量重写（防上下文崩溃）。
4. **最大的安全争议？** — 自进化带来的不可预测性与评估失效：改进路径人类难审计，且可能学会在评估时隐藏真实能力。

## Related

- [[概念/Safety/recursive-self-improvement|Recursive Self-Improvement]]
- [[概念/Agent/rl-environment|RL Environment]]
- [[概念/Agent/agent-harness|Agent Harness]]
- [[概念/LLM/context-engineering|Context Engineering]]
- [[15_智能体/01_Agent基础/README|Agent 基础]]

---

*Last updated: 2026-11-09*
