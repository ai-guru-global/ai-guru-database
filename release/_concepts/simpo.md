---
title: "SimPO 简化偏好优化 (Simple Preference Optimization)"
category: -concepts
tags: ["simpo", "preference-optimization", "dpo", "alignment", "reference-free"]
relationships:
  - target: "_concepts/dpo"
    type: related_to
  - target: "_concepts/rlhf"
    type: related_to
  - target: "_concepts/reward-model"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "SimPO (Simple Preference Optimization) 是无需参考模型的偏好优化方法——用序列平均 log 概率作为隐式奖励，比 DPO 更简单且效果更好。是 2024-2026 年对齐训练的新选择。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.80
lifecycle: stable
tier: supporting
---

# SimPO 简化偏好优化

> **一句话理解**: SimPO 是"更简单的 DPO"——不需要参考模型，用序列平均 log 概率直接做偏好优化，训练更省、效果不输 DPO。

---

## 1. 核心思想

| 方法 | 奖励定义 | 需参考模型 |
|------|---------|-----------|
| **PPO-RLHF** | 独立 Reward Model 打分 | ✅ 需要 |
| **DPO** | log-ratio (策略 vs 参考) | ✅ 需要 |
| **SimPO** | 序列平均 log 概率 | ❌ 不需要 |

---

## 2. SimPO vs DPO vs PPO

| 维度 | PPO-RLHF | DPO | SimPO |
|------|---------|-----|-------|
| **参考模型** | ❌ 不需要 | ✅ 需要 | ❌ 不需要 |
| **Reward Model** | ✅ 需要 | ❌ 隐式 | ❌ 隐式 |
| **训练复杂度** | 高 | 中 | **低** |
| **显存占用** | 高（4 模型） | 中（2 模型） | **低（1 模型）** |
| **效果** | 好 | 好 | **同等或更优** |
| **长度偏差** | 有 | 有 | **无** |
| **论文** | 2022 | 2023 | 2024 |

---

## 3. SimPO 公式直觉

```
DPO 损失:
Loss = -log σ(β · (log π(y_w|x)/π_ref(y_w|x) - log π(y_l|x)/π_ref(y_l|x)))
→ 需要参考模型 π_ref

SimPO 损失:
Loss = -log σ(β · (1/|y_w| · log π(y_w|x) - 1/|y_l| · log π(y_l|x) - γ))
→ 不需要参考模型，用序列长度归一化消除长度偏差
```

---

## 4. 偏好优化方法演进

| 时间 | 方法 | 关键创新 |
|------|------|---------|
| 2022 | PPO-RLHF | 独立 RM + RL 训练 |
| 2023 | DPO | 去掉 RM，直接偏好优化 |
| 2024 | KTO | 只需单条偏好信号 |
| 2024 | **SimPO** | 去掉参考模型 |
| 2024 | ORPO | Odds Ratio 偏好优化 |
| 2025 | GRPO | 组内相对排名（DeepSeek） |

---

## Related

- [[_concepts/dpo]] — DPO 直接偏好优化
- [[_concepts/rlhf]] — RLHF 人类反馈强化学习
- [[_concepts/reward-model]] — 奖励模型
- [[_concepts/grpo]] — GRPO 组相对策略优化
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
