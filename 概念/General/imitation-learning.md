---
title: "模仿学习 (Imitation Learning)"
category: -concepts
tags: ["imitation-learning", "behavior-cloning", "robotics", "demonstration", "dagger"]
relationships:
  - target: "概念/General/deep-reinforcement-learning"
    type: complements
  - target: "概念/General/embodied-ai"
    type: related_to
  - target: "概念/Training/sft"
    type: related_to
sources:
  - 06_强化学习/05_Robotics_Embodied_AI/
  - 06_强化学习/01_RL_Foundations/
summary: "模仿学习让智能体从专家演示中学习策略，无需设计奖励函数。行为克隆（BC）是其最简形式，LLM 的 SFT 本质上就是对人类文本的行为克隆。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Imitation Learning"
  - "Behavior Cloning"
  - "行为克隆"
name_zh: "模仿学习"
---
# 模仿学习 (Imitation Learning)

> 中文简称：模仿学习

> 不定义"什么是好"，直接看专家怎么做。

---

## 1. 定义

**模仿学习**（Imitation Learning, IL）从专家演示数据 \((s, a)\) 中直接学习策略 \(\pi(a|s)\)，绕过奖励函数设计。与强化学习互补：RL 靠试错 + 奖励，IL 靠演示 + 监督。

---

## 2. 三大方法族

| 方法 | 机制 | 优缺点 |
|------|------|--------|
| **行为克隆 (BC)** | 监督学习拟合专家动作 | 简单高效；分布偏移（compounding error） |
| **DAgger** | 迭代收集"学生状态+专家标注" | 缓解偏移；需在线专家 |
| **逆强化学习 (IRL)** | 从演示反推奖励函数再 RL | 泛化好；计算昂贵（GAIL 用对抗训练近似） |

---

## 3. 分布偏移问题

BC 的核心缺陷：训练分布是专家轨迹，执行时小误差累积后进入专家从未到过的状态，策略行为不可预测。缓解手段：

1. DAgger 式在线数据增补
2. 演示数据加噪声扰动（覆盖近邻状态）
3. Action chunking（一次预测动作序列，减少决策次数）
4. IL 预训练 + RL 微调（先克隆再优化）

---

## 4. 现代应用

| 领域 | 形式 |
|------|------|
| **机器人操作** | 遥操作演示 → Diffusion Policy / ACT / VLA |
| **自动驾驶** | 人类驾驶日志 → 端到端策略 |
| **LLM 对齐** | SFT = 对人类高质量文本的行为克隆 |
| **游戏 AI** | 人类录像预训练（AlphaStar、VPT） |

---

## Related

- [[概念/General/deep-reinforcement-learning]] — 深度强化学习（IL 常作预训练）
- [[概念/General/embodied-ai]] — 具身智能
- [[概念/General/vla]] — VLA 模型（大规模模仿学习产物）
- [[概念/Training/sft]] — SFT（LLM 的行为克隆）
- [[概念/Training/rlhf]] — RLHF（IL + RL 的组合）

> ℹ️ 2026 年趋势：机器人领域"大规模模仿学习 + 少量 RL 修正"成为主流配方，纯 RL 从零训练已边缘化。
