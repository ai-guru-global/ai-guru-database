---
title: "遥操作 (Teleoperation)"
category: -concepts
tags: ["teleoperation", "robotics", "embodied-ai", "vla", "imitation-learning"]
summary: "遥操作是具身智能数据采集的核心手段——人类远程控制机器人执行任务，记录操作轨迹用于模仿学习。"
created: 2026-06-12
updated: 2026-06-12
---

# 遥操作 (Teleoperation)

> 遥操作是具身智能数据采集的核心手段——人类远程控制机器人执行任务，记录操作轨迹用于模仿学习。

## 在具身 AI 中的角色

```
遥操作流程:
人类操作员 → 控制设备 (手柄/VR/手套) → 机器人执行 → 记录 (状态, 动作, 视觉)
                                                        ↓
                                                  模仿学习训练数据
                                                  ↓
                                            策略网络 (VLA 模型)
```

## 关键系统

- **ALOHA**: 低成本双臂遥操作系统（~$20K），用于收集灵巧操作数据
- **DexCap**: 手套式遥操作，捕获手指级精细动作
- **Gello**: 通用遥操作接口，适配多种机器人

## 与 VLA 模型的关系

```
数据采集: 遥操作 → 演示轨迹
训练: 轨迹数据 → VLA (Vision-Language-Action) 模型
推理: VLA 模型 → 自主执行任务

代表模型:
- RT-2 (Google DeepMind): 视觉-语言-动作模型
- π0 (Physical Intelligence): 通用操作基础模型
- OpenVLA: 开源 VLA 模型
```

## 相关阅读

- [[06_Reinforcement_Learning/Robotics_Embodied_AI/VLA_Embodied_AI_2026]] — VLA 具身智能 2026
- [[06_Reinforcement_Learning/Robotics_Embodied_AI/Humanoid_Robot_2026]] — 人形机器人 2026
