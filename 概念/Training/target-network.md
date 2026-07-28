---
title: "目标网络 (Target Network)"
category: -concepts
tags: ["target-network", "dqn", "training-stability", "soft-update", "bootstrap"]
relationships:
  - target: "概念/General/q-learning"
    type: part_of
  - target: "概念/Training/experience-replay"
    type: complements
sources:
  - 06_强化学习/02_Deep_RL/
summary: "目标网络是主网络的延迟副本，用于计算 TD 目标值，避免'自己追自己'的移动目标问题，与经验回放并列为 DQN 稳定训练的两大支柱。"
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
  - "Target Network"
  - "目标Q网络"
name_zh: "目标网络"
---
# 目标网络 (Target Network)

> 中文简称：目标网络

> 射击时先把靶子钉住，别让它跟着枪口跑。

---

## 1. 定义

**目标网络**是主 Q 网络参数 \(\theta\) 的延迟副本 \(\theta^-\)，专门用于计算 TD 目标：

\[
y_t = r_t + \gamma \max_{a'} Q(s_{t+1}, a'; \theta^-)
\]

若直接用主网络算目标，每次更新都会同时移动"预测"和"目标"，形成正反馈震荡甚至发散（deadly triad 的一环）。目标网络将目标冻结一段时间，把回归问题局部"固定"下来。

---

## 2. 两种更新方式

| 方式 | 机制 | 典型场景 |
|------|------|----------|
| **硬更新 (Hard)** | 每 C 步整体复制 \(\theta^- \leftarrow \theta\)（DQN：C=10k） | 离散动作 DQN 族 |
| **软更新 (Polyak)** | 每步 \(\theta^- \leftarrow \tau\theta + (1-\tau)\theta^-\)（τ~0.005） | DDPG/TD3/SAC 连续控制 |

---

## 3. 工程要点

1. **更新频率权衡**：C 太小失去稳定作用，太大目标过时、学习缓慢
2. **Double DQN 配合**：主网络选动作、目标网络评估，缓解高估
3. **RLHF 中的对应物**：PPO 的参考模型（frozen reference model）与 KL 惩罚，思想同源——用固定副本约束更新方向

---

## Related

- [[概念/General/q-learning]] — Q-Learning / DQN
- [[概念/Training/experience-replay]] — 经验回放（另一稳定支柱）
- [[概念/Training/ppo]] — PPO（参考模型思想同源）
- [[概念/General/deep-reinforcement-learning]] — 深度强化学习总览

> ℹ️ 记忆锚点：经验回放解决"数据不稳"，目标网络解决"目标不稳"——DQN 双保险。
