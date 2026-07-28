---
title: "经验回放 (Experience Replay)"
category: -concepts
tags: ["experience-replay", "replay-buffer", "dqn", "off-policy", "sample-efficiency"]
relationships:
  - target: "概念/General/q-learning"
    type: complements
  - target: "概念/Training/target-network"
    type: complements
sources:
  - 06_强化学习/02_Deep_RL/
summary: "经验回放将智能体交互产生的转移样本存入缓冲区并随机采样训练，打破样本时序相关性、提高数据复用率，是 DQN 等 off-policy 深度强化学习算法的关键稳定器。"
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
  - "Experience Replay"
  - "Replay Buffer"
  - "回放缓冲区"
name_zh: "经验回放"
---
# 经验回放 (Experience Replay)

> 中文简称：经验回放

> 把经历存进"记忆库"，随机翻出来反复学习。

---

## 1. 定义

**经验回放**（Lin, 1992；DQN 发扬光大）将每步转移 \((s, a, r, s')\) 存入固定容量的环形缓冲区（replay buffer），训练时从中**均匀随机采样** mini-batch 更新网络。

解决两个问题：

1. **样本相关性**：连续帧高度相关，直接 SGD 违反 i.i.d. 假设 → 随机采样打散
2. **数据效率**：每个样本可被复用多次，而非用完即弃

前提：算法必须是 **off-policy**（如 Q-Learning），因为缓冲区里是旧策略产生的数据。

---

## 2. 变体演进

| 变体 | 机制 | 收益 |
|------|------|------|
| **均匀回放** | 等概率采样 | DQN 基线 |
| **优先经验回放 (PER)** | 按 TD-error 比例采样 + 重要性加权 | 聚焦"意外"样本，加速收敛 |
| **HER** | 失败轨迹重标目标为"实际到达处" | 稀疏奖励下的有效学习 |
| **分布式回放 (Ape-X)** | 多 actor 写入、集中 learner 采样 | 大规模并行 |

---

## 3. 工程要点

1. **容量**：典型 10^5–10^6 条；太小易过拟合近期数据，太大旧数据拖慢适应
2. **预热**：先随机探索填充最小样本量再开始训练
3. **PER 校正**：优先采样引入偏差，需重要性采样权重 \(w_i = (N \cdot P(i))^{-\beta}\) 修正
4. **on-policy 不适用**：PPO 等 on-policy 算法只能用当前 rollout，不能跨策略回放

---

## Related

- [[概念/General/q-learning]] — Q-Learning / DQN（经验回放的主战场）
- [[概念/Training/target-network]] — 目标网络（DQN 另一稳定器）
- [[概念/Training/policy-gradient]] — 策略梯度（on-policy，不用回放）
- [[概念/General/deep-reinforcement-learning]] — 深度强化学习总览

> ℹ️ 类比：LLM 训练中的数据混合与重放（replay 防灾难性遗忘）借用了同一思想。
