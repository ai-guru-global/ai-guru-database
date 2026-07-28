---
title: "策略梯度 (Policy Gradient)"
category: -concepts
tags: ["policy-gradient", "reinforce", "actor-critic", "ppo", "rlhf"]
relationships:
  - target: "概念/Training/ppo"
    type: complements
  - target: "概念/Training/gae"
    type: complements
  - target: "概念/General/deep-reinforcement-learning"
    type: part_of
sources:
  - 06_强化学习/01_RL_Foundations/
  - 06_强化学习/02_Deep_RL/
summary: "策略梯度直接对参数化策略求梯度上升以最大化期望回报，是 PPO、GRPO 等 RLHF 核心算法的理论基础。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Policy Gradient"
  - "REINFORCE"
  - "策略梯度方法"
name_zh: "策略梯度"
---
# 策略梯度 (Policy Gradient)

> 中文简称：策略梯度

> 不评估每个动作值多少分，直接调整"做这个动作的概率"。

---

## 1. 定义

**策略梯度**方法直接参数化策略 \(\pi_\theta(a|s)\)，沿期望回报 \(J(\theta)\) 的梯度方向更新参数。

策略梯度定理：

\[
\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta} \left[ \nabla_\theta \log \pi_\theta(a|s) \cdot A^{\pi}(s,a) \right]
\]

直觉：**好动作（优势 A>0）提高概率，坏动作降低概率**，幅度与优势大小成正比。

---

## 2. 算法演进

| 算法 | 关键改进 |
|------|----------|
| **REINFORCE** | 蒙特卡洛回报做权重；高方差 |
| **Baseline** | 减去状态价值 b(s) 降方差、不引入偏差 |
| **Actor-Critic** | Critic 估计价值函数，在线 bootstrap |
| **A2C/A3C** | 并行采样 + 优势函数 |
| **TRPO** | 信任域约束更新幅度 |
| **[[概念/Training/ppo\|PPO]]** | Clip 目标近似信任域，工程实用 |
| **[[概念/Training/grpo\|GRPO]]** | 组内相对优势替代 Critic，为 LLM 减负 |

---

## 3. 方差控制三件套

1. **Baseline / Critic**：减去价值基线
2. **[[概念/Training/gae|GAE]]**：λ 加权多步优势估计，偏差-方差可调
3. **优势归一化**：batch 内标准化优势值

---

## 4. 在 RLHF 中的角色

LLM 对齐即策略梯度应用：策略 = 语言模型，动作 = 生成 token，奖励 = 奖励模型打分/可验证结果（RLVR）。PPO 加 KL 惩罚防止偏离参考模型，GRPO 用组内采样均值当 baseline 省掉 Critic 显存。

---

## Related

- [[概念/Training/ppo]] — PPO（工业标准实现）
- [[概念/Training/grpo]] — GRPO（DeepSeek 简化方案）
- [[概念/Training/gae]] — 广义优势估计
- [[概念/Training/rlhf]] — RLHF
- [[概念/General/q-learning]] — Q-Learning（值方法路线）
- [[概念/General/deep-reinforcement-learning]] — 深度强化学习总览

> ℹ️ 2026 年趋势：RLVR（可验证奖励）+ GRPO 成为推理模型训练标配，策略梯度是这一切的数学地基。
