---
title: "Recursive Reasoning Models (递归推理模型: HRM/TRM)"
tags: [recursive-reasoning, hrm, trm, test-time-compute, small-models]
created: 2026-11-09
updated: 2026-11-09
tier: supporting
aliases:
  - "Recursive Reasoning Models"
  - "递归推理模型"
  - "HRM"
  - "TRM"
  - "Hierarchical Reasoning Model"
  - "Tiny Recursive Model"
category: -concepts
lifecycle: seed
review_by: 2027-02-09
relationships:
  - target: "概念/LLM/diffusion-llm"
    type: alternative_paradigm_to
  - target: "概念/Agent/deep-agents"
    type: contrasts_with
sources:
  - "Sapient Intelligence: Hierarchical Reasoning Model (2025-06)"
  - "Samsung SAIL: Tiny Recursive Model — Less is More (2025-10)"
name_zh: "递归推理模型"
---

# Recursive Reasoning Models (递归推理模型: HRM/TRM)

> 中文简称：递归推理模型

> **一句话理解**: HRM（2700 万参数）与 TRM（700 万参数）证明：靠「同一个微型网络在潜空间反复自我修订」的深度递归，能在 ARC-AGI/数独等推理题上击败十亿级参数大模型——「推理深度」与「参数规模」是解耦的。

---

## 定义

**递归推理模型（Recursive Reasoning Models）**: 不依赖更深的网络或更多的参数，而是让**一个小网络在潜空间（latent space）迭代精炼自己的中间答案**，循环次数即「推理深度」。两次浪潮：

| 模型 | 团队/时间 | 参数量 | 核心机制 | 战绩 |
|------|------|------|------|------|
| **HRM** (Hierarchical Reasoning Model) | Sapient Intelligence, 2025-06 | ~27M | 双模块层级循环：高层模块慢速规划、低层模块快速执行，互相喂潜状态 | ARC-AGI、Sudoku-Extreme、迷宫导航上以小胜大 |
| **TRM** (Tiny Recursive Model) | Samsung SAIL, 2025-10 | ~7M | 「Less is More」：砍掉 HRM 的生物学类比结构，用单网络 + 极简递归 + 深度监督，证明 HRM 的有效成分是**递归本身** | 用 1/4 参数超过 HRM 与多数 LLM（ARC-AGI / ARC-AGI-2） |

## 为什么是概念级突破

1. **解耦两个被默认绑定的变量**: 自回归 LLM 时代，「更强推理 ≈ 更多参数 + 更多测试时 token」。HRM/TRM 表明**潜空间递归**是第三条轴：不吐一个字的思考（no CoT in tokens）。
2. **对 CoT 范式的质疑**: 链式思维把推理消耗在 token 流里（贵、可被「说服跑偏」、易奖励破解）；潜空间递归的思考不可读但高效——两派争论在 2026 持续。
3. **ARC-AGI 榜单冲击**: 在「人类轻松、AI 折戟」的抽象推理题上，百万级模型打平十亿级，暴露自回归范式在该类任务上的低效。
4. **争议与冷静**: 2025-11 起的再分析指出 HRM/TRM 的收益部分来自**任务分布极窄**（puzzle 域特化）与重参数化；「递归≠万能推理」，到 2026 社区共识：是重要证据，不是范式替代。

## 与相邻概念的关系

- **测试时计算（Test-Time Compute）**: 同一方向（推理期堆计算）的两种形态——LLM 靠生成更多 token，递归模型靠潜空间多循环。
- **自回归范式**: [[概念/LLM/diffusion-llm|扩散 LLM]] 与递归推理模型分别从「生成方式」与「推理深度」两个维度挑战自回归正统。
- **Deep Agent**: 反向对照——LLM 用上下文工程（[[概念/Agent/deep-agents|Deep Agents]] 四件套）外挂长推理，递归模型把推理内建进架构。

## 面试快问快答

1. **TRM 相对 HRM 的关键简化？** — 去掉层级/生物类比，保留「单网络多轮潜变量递归 + 深度监督」，证明有效性来自递归机制而非结构叙事。
2. **为什么递归推理不输出 CoT？** — 中间修订发生在潜空间（连续向量），不落 token；省 token 成本，且不暴露于「被提示注入带偏」的文本层。
3. **主要局限？** — 任务域窄（网格/符号 puzzle 特化训练）、不能开放域对话、可解释性差（潜变量不可读）。
4. **对工程实践的启示？** — 不要默认「能力=参数」：垂直窄域任务可用微型专模型 + 测试时递归达到大模型精度，成本差两个数量级。

## Related

- [[概念/LLM/diffusion-llm|Diffusion LLM]]
- [[概念/Agent/deep-agents|Deep Agents]]
- [[00_入门/02_技术概览/04_AI_推理模型_指南|AI 推理模型指南]]
- [[概念/Agent/rl-environment|RL Environment]]

---

*Last updated: 2026-11-09*
