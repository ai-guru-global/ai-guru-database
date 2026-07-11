---
title: 仿真到现实迁移
category: 强化学习/Sim_to_Real
tags: [rl, sim2real, transfer, digital-twin]
summary: Sim2Real 迁移学习和数字孪生训练方法。
---

# 仿真到现实迁移

本目录收录仿真到现实迁移（Sim2Real）相关文档。

## 内容导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [Sim_to_Real_Transfer_Guide.md](./Sim_to_Real_Transfer_Guide.md) | Sim2Real 完整指南：Reality Gap、域随机化、域适应、系统辨识、数字孪生、仿真平台对比、2026 前沿 | 全面学习 |
| Digital_Twin_Training.md | *待补充* | - |

### 核心概念速览
- **Reality Gap**: 仿真与真实世界的系统性差异，是 Sim2Rel 的核心难题
- **域随机化 (Domain Randomization)**: 故意制造参数变化，训练鲁棒策略（OpenAI 魔方手核心方法）
- **域适应 (Domain Adaptation)**: 用对抗学习让特征域不变
- **系统辨识 (System Identification)**: 从真实数据精确估计仿真参数
- **数字孪生 (Digital Twin)**: 实时同步的虚拟副本，持续校准缩小 Reality Gap

### 仿真平台
| 平台 | 特点 |
|------|------|
| NVIDIA Isaac Sim | GPU 加速，工业级，RTX 渲染 |
| MuJoCo | 高保真物理，学术标准 |
| PyBullet | 轻量易用，教学原型 |
| Gazebo | ROS 生态原生 |
| Webots | 教育友好 |
| Genesis | 2024-2025 新兴统一平台 |

## Related

- [[../Robotics_Embodied_AI/index|机器人与具身智能]]
- [[../Deep_RL/index|深度强化学习]]
- [[Sim_to_Real/Sim_to_Real_Transfer_Guide|Sim2Real 迁移完整指南]]
