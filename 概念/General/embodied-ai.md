---
title: "具身智能 (Embodied AI)"
category: -concepts
tags: ["embodied-ai", "robotics", "vla", "world-model", "sim-to-real"]
relationships:
  - target: "概念/General/vla"
    type: complements
  - target: "概念/General/imitation-learning"
    type: related_to
  - target: "概念/General/deep-reinforcement-learning"
    type: related_to
sources:
  - 06_强化学习/05_Robotics_Embodied_AI/
summary: "具身智能强调智能体通过身体与物理世界交互来感知、决策与学习，是机器人、自动驾驶和 VLA 模型的理论基础，2026 年因人形机器人产业化而爆发。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.87
lifecycle: reviewed
tier: core
created: 2026-07-27
updated: 2026-07-27
aliases:
  - "Embodied AI"
  - "Embodied Intelligence"
  - "具身AI"
name_zh: "具身智能"
---
# 具身智能 (Embodied AI)

> 中文简称：具身智能

> 智能不只在大脑里，也在身体与世界的交互中。

---

## 1. 定义

**具身智能**（Embodied AI）主张智能来自智能体（agent）的身体（embodiment）与环境的闭环交互：感知→决策→行动→反馈。与纯文本 LLM 的"离身智能"相对，具身智能必须处理物理约束、连续控制与不确定性。

---

## 2. 技术栈分层

| 层 | 内容 | 代表 |
|----|------|------|
| **感知** | 视觉/触觉/力觉/点云 | 多模态编码器 |
| **决策** | VLA 模型 / 分层规划 | RT-2、π0、GR00T |
| **控制** | 全身控制、灵巧手操作 | MPC、RL 策略 |
| **学习** | 模仿学习 + RL + 仿真 | Isaac Lab、MuJoCo |
| **数据** | 遥操作、视频、仿真合成 | Open X-Embodiment |

---

## 3. 核心挑战

1. **数据稀缺**：机器人数据比文本贵数个数量级 → 仿真合成 + 视频学习
2. **Sim-to-Real Gap**：仿真训练策略迁移到真机的偏差 → 域随机化
3. **泛化**：跨物体/场景/机器人本体的通用策略
4. **安全**：物理世界错误不可撤销，需保守策略与硬件限位

---

## 4. 2026 产业格局

| 玩家 | 路线 |
|------|------|
| **Tesla Optimus / Figure** | 端到端 VLA + 量产人形 |
| **NVIDIA GR00T** | 基础模型 + Isaac 仿真生态 |
| **宇树/智元/傅利叶** | 中国人形机器人硬件迭代 |
| **Physical Intelligence (π)** | 通用机器人基础模型 |

---

## Related

- [[概念/General/vla]] — 视觉-语言-动作模型（具身智能的大脑）
- [[概念/General/imitation-learning]] — 模仿学习
- [[概念/General/deep-reinforcement-learning]] — 深度强化学习
- [[03_深度学习/07_World_Models/World_Models_2026|世界模型]] — 世界模型
- [[06_强化学习/05_Robotics_Embodied_AI/index|机器人与具身智能]] — 章节主页

> ℹ️ 2026 年趋势：具身智能被视为"物理 AGI"入口，VLA 基础模型 + 仿真数据飞轮是主流路线。
