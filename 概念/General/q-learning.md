---
title: "Q-Learning"
category: -concepts
tags: ["q-learning", "value-based-rl", "bellman-equation", "dqn", "td-learning"]
relationships:
  - target: "概念/General/deep-reinforcement-learning"
    type: part_of
  - target: "概念/Training/experience-replay"
    type: complements
  - target: "概念/Training/target-network"
    type: complements
sources:
  - 06_强化学习/01_RL_Foundations/
  - 06_强化学习/02_Deep_RL/
summary: "Q-Learning 是经典的值函数强化学习算法，通过时序差分更新学习动作价值函数 Q(s,a)，其深度版本 DQN 开启了深度强化学习时代。"
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
  - "Q-Learning"
  - "Q学习"
  - "DQN"
name_zh: "Q 学习"
---
# Q-Learning

> 中文简称：Q 学习

> 学一张"在什么状态做什么动作值多少分"的表。

---

## 1. 定义

**Q-Learning**（Watkins, 1989）学习动作价值函数 \(Q(s,a)\)：在状态 \(s\) 执行动作 \(a\) 后按最优策略走完能拿到的期望回报。学到 \(Q^*\) 后，最优策略就是每步取 \(\arg\max_a Q^*(s,a)\)。

更新规则（时序差分）：

\[
Q(s,a) \leftarrow Q(s,a) + \alpha \left[ r + \gamma \max_{a'} Q(s',a') - Q(s,a) \right]
\]

关键性质：**off-policy**——行为策略（如 ε-greedy 探索）与学习目标（贪心策略）分离。

---

## 2. 从表格到深度：DQN

| 组件 | 作用 |
|------|------|
| **神经网络 Q(s,a;θ)** | 替代 Q 表，处理高维状态（图像） |
| **[[概念/Training/experience-replay\|经验回放]]** | 打破样本相关性、提高数据效率 |
| **[[概念/Training/target-network\|目标网络]]** | 固定 TD 目标，稳定训练 |
| **ε-greedy** | 探索与利用平衡 |

DQN（DeepMind, 2015）在 Atari 上达到人类水平，是深度 RL 的开端。

---

## 3. DQN 改进族谱

| 变体 | 解决问题 |
|------|----------|
| **Double DQN** | max 操作导致的 Q 值高估 |
| **Dueling DQN** | 分离状态价值 V 与优势 A |
| **Prioritized Replay** | 高 TD-error 样本优先采样 |
| **Rainbow** | 六项改进的集大成 |

---

## 4. 值方法 vs 策略方法

| 维度 | Q-Learning（值） | Policy Gradient（策略） |
|------|------------------|------------------------|
| 输出 | Q 值 → 间接得策略 | 直接输出策略分布 |
| 动作空间 | 离散为主 | 离散/连续均可 |
| 样本效率 | 高（off-policy 复用） | 低（on-policy） |
| 稳定性 | 易发散（deadly triad） | 高方差 |

---

## Related

- [[概念/General/deep-reinforcement-learning]] — 深度强化学习总览
- [[概念/Training/experience-replay]] — 经验回放
- [[概念/Training/target-network]] — 目标网络
- [[概念/Training/policy-gradient]] — 策略梯度（另一条路线）
- [[概念/Training/ppo]] — PPO

> ℹ️ LLM 时代注脚：RLHF 主流走策略梯度路线（PPO/GRPO），但 Q-Learning 思想在 offline RL 与过程奖励建模中仍活跃。
