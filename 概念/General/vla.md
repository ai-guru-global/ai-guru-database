---
title: "视觉-语言-动作模型 (VLA)"
category: -concepts
tags: ["vla", "robotics", "embodied-ai", "rt-2", "multimodal"]
relationships:
  - target: "概念/General/embodied-ai"
    type: part_of
  - target: "概念/LLM/multimodal-llm"
    type: related_to
  - target: "概念/General/imitation-learning"
    type: complements
sources:
  - 06_强化学习/05_Robotics_Embodied_AI/
summary: "VLA（Vision-Language-Action）模型将视觉感知、语言理解与机器人动作生成统一到单一模型中，端到端地把'看到什么+听到指令'映射为'怎么动'，是具身智能的核心模型范式。"
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
  - "VLA"
  - "Vision-Language-Action"
  - "视觉语言动作模型"
name_zh: "视觉-语言-动作模型"
---
# 视觉-语言-动作模型 (VLA)

> 中文简称：视觉-语言-动作模型

> 把 VLM 的"看懂+听懂"延伸到"动手做"。

---

## 1. 定义

**VLA 模型**在视觉-语言模型（VLM）基础上增加动作输出头，输入图像/视频 + 自然语言指令，直接输出机器人动作序列（关节角度、末端位姿、夹爪开合）。核心思想：**动作也是一种 token**，复用 LLM 的自回归生成范式。

---

## 2. 代表模型演进

| 模型 | 机构 | 关键创新 |
|------|------|----------|
| **RT-1 / RT-2** | Google | 动作离散化为 token；VLM 网络知识迁移到机器人 |
| **OpenVLA** | Stanford 等 | 7B 开源 VLA，Open X-Embodiment 数据 |
| **π0 (pi-zero)** | Physical Intelligence | Flow matching 连续动作生成 |
| **GR00T N1** | NVIDIA | 双系统架构（快慢脑），人形机器人基座 |
| **Helix** | Figure | 全上身高频控制、双机协作 |

---

## 3. 关键技术

1. **动作表征**：离散 token / 扩散策略（Diffusion Policy）/ flow matching
2. **双系统架构**：慢脑（VLM 推理规划，~Hz）+ 快脑（动作专家，~100Hz）
3. **数据配方**：互联网视觉语言数据 + 遥操作数据 + 仿真数据共训
4. **跨本体泛化**：统一动作空间适配不同机器人形态

---

## 4. VLA vs 传统机器人控制

| 维度 | VLA | 传统管线（感知→规划→控制） |
|------|-----|---------------------------|
| 泛化 | 强（语义级） | 弱（场景专用） |
| 可解释性 | 低 | 高 |
| 数据需求 | 大规模演示 | 少量建模 |
| 长尾场景 | 网络知识兜底 | 需逐项工程化 |

---

## Related

- [[概念/General/embodied-ai]] — 具身智能（VLA 的应用领域）
- [[概念/General/imitation-learning]] — 模仿学习（VLA 主要训练方式）
- [[概念/LLM/multimodal-llm]] — 多模态大模型（VLA 的基座）
- [[概念/General/deep-reinforcement-learning]] — 深度强化学习

> ℹ️ 2026 年趋势：VLA 进入"基础模型"阶段——一个模型适配多种机器人本体，数据飞轮从遥操作转向仿真+视频。
