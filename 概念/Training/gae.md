---
title: "广义优势估计 (GAE)"
category: -concepts
tags: ["gae", "advantage-estimation", "ppo", "td-lambda", "bias-variance"]
relationships:
  - target: "概念/Training/policy-gradient"
    type: part_of
  - target: "概念/Training/ppo"
    type: complements
sources:
  - 06_强化学习/02_Deep_RL/
summary: "GAE（Generalized Advantage Estimation）用 λ 加权的多步 TD 残差估计优势函数，在偏差与方差之间提供连续可调的折中，是 PPO 训练的标准组件。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: supporting
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "GAE"
  - "Generalized Advantage Estimation"
  - "广义优势估计"
name_zh: "广义优势估计"
---
# 广义优势估计 (GAE)

> 中文简称：广义优势估计

> 优势估计的"混合配方"：既不全信一步估计，也不全靠完整回报。

---

## 1. 定义

**GAE**（Schulman et al., 2016）解决策略梯度中优势函数 \(A(s,a)\) 的估计难题。

单步 TD 残差：

\[
\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t)
\]

GAE 将多步残差按 λ 指数加权：

\[
\hat{A}_t^{GAE(\gamma,\lambda)} = \sum_{l=0}^{\infty} (\gamma\lambda)^l \delta_{t+l}
\]

---

## 2. λ 的偏差-方差调节

| λ 取值 | 等价形式 | 特性 |
|--------|----------|------|
| **λ = 0** | 单步 TD：\(\hat{A}_t = \delta_t\) | 低方差、高偏差（依赖 V 准确性） |
| **λ = 1** | 蒙特卡洛：完整回报 − V(s) | 无偏、高方差 |
| **λ ∈ (0,1)** | 多步加权混合 | 可调折中，典型 0.9–0.98 |

---

## 3. 工程实践

1. **典型超参**：γ=0.99，λ=0.95（PPO 论文默认）
2. **计算方式**：从轨迹尾部反向递推 \(\hat{A}_t = \delta_t + \gamma\lambda \hat{A}_{t+1}\)，O(T) 完成
3. **优势归一化**：batch 内减均值除标准差，稳定更新
4. **RLHF 场景**：序列级稀疏奖励下 GAE 退化明显，GRPO 直接用组内相对回报绕开 Critic + GAE

---

## Related

- [[概念/Training/policy-gradient]] — 策略梯度（GAE 服务的目标）
- [[概念/Training/ppo]] — PPO（GAE 的标准搭档）
- [[概念/Training/grpo]] — GRPO（免 Critic 的替代方案）
- [[概念/General/deep-reinforcement-learning]] — 深度强化学习总览

> ℹ️ 记忆锚点：GAE 之于优势估计，如同 TD(λ) 之于价值估计——同一套 λ 加权思想。
