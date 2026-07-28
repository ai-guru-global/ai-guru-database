---
title: "遥操作 (Teleoperation)"
category: -concepts
tags: ["teleoperation", "robotics", "embodied-ai", "vla", "imitation-learning"]
summary: "遥操作是具身智能数据采集的核心手段——人类远程控制机器人执行任务，记录操作轨迹用于模仿学习。"
created: 2026-06-12
updated: 2026-07-21
tier: core
aliases:
  - Teleoperation
lifecycle: reviewed
provenance:
  extracted: 0.70
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.75
sources:
  - 06_强化学习/05_Robotics_Embodied_AI/VLA_Embodied_AI_2026.md
  - 06_强化学习/05_Robotics_Embodied_AI/Humanoid_Robot_2026.md
name_zh: "遥操作"
---
# 遥操作 (Teleoperation)

> 中文简称：遥操作

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

- [[06_强化学习/05_Robotics_Embodied_AI/VLA_Embodied_AI_2026]] — VLA 具身智能 2026
- [[06_强化学习/05_Robotics_Embodied_AI/Humanoid_Robot_2026]] — 人形机器人 2026

---

## 2026 遥操作生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **遥操作** | 远程控制机器人 | GA |
| **力反馈** | 触觉力反馈 | GA |
| **VR/AR 控制** | 虚拟现实控制 | GA |
| **数据收集** | 遥操作数据收集 | GA |
| **模仿学习** | 从遥操作学习 | 研究 |

## 生产最佳实践

1. **数据收集**：遥操作收集训练数据
2. **力反馈**：精细操作用力反馈
3. **VR 控制**：VR 控制提高沉浸感
4. **模仿学习**：从遥操作数据学习
5. **低延迟**：遥操作需要低延迟

## 遥操作系统对比

| 系统 | 成本 | 自由度 | 特点 | 适用 |
|------|------|------|------|------|
| ALOHA | ~$20K | 双臂 14DoF | 低成本、开源 | 灵巧操作 |
| DexCap | ~$5K | 手指级 | 精细动作 | 抓取操作 |
| Gello | ~$10K | 通用 | 多机器人适配 | 通用操作 |
| VR 遥操 | ~$30K | 全身 | 沉浸感强 | 人形机器人 |
| 外骨骼 | ~$100K | 全身 | 力反馈 | 重载操作 |

## 数据采集流程

| 步骤 | 说明 | 工具 |
|------|------|------|
| 1. 任务定义 | 明确操作任务和目标 | 任务规划 |
| 2. 环境搭建 | 设置相机、传感器 | RealSense/相机 |
| 3. 遥操作 | 人类执行任务 | ALOHA/VR |
| 4. 数据记录 | 记录状态、动作、视觉 | ROS/HDF5 |
| 5. 质量检查 | 筛选有效轨迹 | 自定义脚本 |
| 6. 模型训练 | 训练 VLA 模型 | PyTorch |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 延迟高 | 网络/控制回路慢 | 本地控制、优化通信 |
| 数据质量差 | 操作员不熟练 | 培训操作员、筛选数据 |
| 动作不精确 | 控制设备精度不足 | 使用高精度设备 |
| 泛化性差 | 数据多样性不足 | 增加场景和任务变化 |
| 安全性 | 机器人失控 | 设置安全边界、急停按钮 |

## 相关概念

- [[概念/General/imitation-learning|Imitation Learning]] — 模仿学习
- [[概念/General/vla|VLA]] — 视觉-语言-动作模型
- [[概念/General/embodied-ai|Embodied AI]] — 具身智能

> 💡 遥操作是具身智能的“数据引擎”——没有高质量的演示数据，VLA 模型就无法学会复杂的操作技能。

## 数据格式

```python
# 遥操作数据记录格式示例
import h5py

with h5py.File("episode_001.hdf5", "w") as f:
    # 关节状态
    f.create_dataset("qpos", data=joint_positions)  # [T, 14]
    # 关节动作
    f.create_dataset("action", data=joint_actions)  # [T, 14]
    # 图像观测
    f.create_dataset("images/top", data=top_camera)  # [T, 480, 640, 3]
    f.create_dataset("images/wrist", data=wrist_camera)  # [T, 480, 640, 3]
    # 任务描述
    f.attrs["task"] = "pick up the red cup"
    f.attrs["success"] = True
```

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| ALOHA | 2.0+ | 开源 |
| ROS 2 | Humble+ | GA |
| PyTorch | 2.0+ | GA |
| LeRobot | 0.1+ | 研究 |

## 生产检查清单

1. 确认遥操作设备校准正确
2. 设置安全边界和急停机制
3. 配置多视角相机和传感器
4. 建立数据质量检查流程
5. 培训操作员标准化操作
6. 记录任务描述和成功标记
7. 定期备份原始数据
8. 建立数据版本管理机制

## 总结

遥操作是具身智能数据采集的核心手段，通过人类远程控制机器人执行任务，记录操作轨迹用于模仿学习。ALOHA、DexCap、Gello 等系统降低了数据采集门槛。

> 💡 遥操作的核心挑战是“数据效率”——如何用尽可能少的演示数据训练出泛化性强的策略模型。

## 应用场景

| 场景 | 说明 | 典型任务 |
|------|------|------|
| 家庭服务 | 家务机器人 | 整理、清洁、烹饪 |
| 工业制造 | 装配操作 | 零件装配、质量检测 |
| 医疗手术 | 远程手术 | 微创手术、康复训练 |
| 危险环境 | 排爆/救援 | 拆弹、核设施维护 |
| 农业 | 采摘操作 | 水果采摘、修剪 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| ALOHA 论文 | 论文 | 低成本双臂遥操作 |
| LeRobot | 工具 | HuggingFace 机器人学习 |
| RT-2 论文 | 论文 | VLA 模型 |
| Open X-Embodiment | 数据集 | 开源机器人数据 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `ros2 launch aloha bringup.launch.py` | 启动 ALOHA |
| `ros2 topic echo /joint_states` | 查看关节状态 |
| `ros2 bag record /joint_states /camera` | 录制数据 |
| `python train.py --data episodes/` | 训练策略模型 |

## 总结

遥操作是具身智能数据采集的核心手段。ALOHA、DexCap、Gello 等系统降低了数据采集门槛，为 VLA 模型训练提供高质量的演示数据。

> 💡 遥操作的核心价值是将人类的操作智慧转化为机器人可学习的数据——这是具身智能的“数据飞轮”。

## 相关概念

- [[概念/General/imitation-learning|Imitation Learning]] — 模仿学习
- [[概念/General/vla|VLA]] — 视觉-语言-动作模型
- [[概念/General/embodied-ai|Embodied AI]] — 具身智能
