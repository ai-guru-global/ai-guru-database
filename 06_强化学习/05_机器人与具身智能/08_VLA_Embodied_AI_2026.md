---
title: "VLA 具身智能 2026"
category: "06-reinforcement-learning-robotics-embodied-ai"
tags: ["vla", "embodied-ai", "robotics", "vision-language-action", "rt-2", "pi0"]
summary: "从 RT-2 到 pi-0，Vision-Language-Action (VLA) 模型如何将视觉理解、语言推理与物理动作统一到一个端到端架构中，驱动具身智能在 2026 年进入通用化阶段。"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "Vla Embodied Ai 2026"
  - "VLA Embodied AI 2026"
  - VLA_Embodied_AI_2026
sources: []

name_zh: "VLA 具身智能 2026"
---
# VLA 具身智能 2026

> 中文简称：VLA 具身智能 2026

> **TL;DR**: VLA (Vision-Language-Action) 模型 = 视觉编码器 + LLM 骨干 + 动作解码器，一个模型同时完成"看懂 → 理解 → 行动"。RT-2 开创范式，pi-0/OpenVLA 推动开源，2026 年 VLA 正在从实验室走向工厂级通用机器人。

---

## 目录

1. [VLA 架构概述](#1-vla-架构概述)
2. [核心模型演进](#2-核心模型演进)
3. [数据采集: Teleoperation 与仿真](#3-数据采集-teleoperation-与仿真)
4. [Sim-to-Real Transfer](#4-sim-to-real-transfer)
5. [模型对比](#5-模型对比)
6. [2026 趋势与挑战](#6-2026-趋势与挑战)
7. [延伸阅读](#7-延伸阅读)

---

## 1. VLA 架构概述

### 1.1 什么是 VLA?

VLA (Vision-Language-Action) 是一类将 **视觉感知 (Vision)**、**语言推理 (Language)** 和 **物理动作生成 (Action)** 统一在同一 Transformer 架构中的模型。与传统机器人控制栈 (感知 → 规划 → 控制) 的模块化设计不同，VLA 追求 **端到端** (end-to-end) 学习。

```
VLA 架构总览:
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────┐
│                    VLA Model                             │
│                                                         │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │ 视觉编码  │──▶│  LLM Backbone │──▶│  动作解码器     │  │
│  │ ViT/SigLIP│   │ (推理+规划)   │   │ (连续/离散)    │  │
│  └──────────┘   └──────────────┘   └────────────────┘  │
│       ▲                ▲                   │            │
│       │                │                   ▼            │
│   图像/视频        语言指令            机器人动作序列     │
│   (多帧输入)      (自然语言)          (关节角/末端位姿)  │
└─────────────────────────────────────────────────────────┘

输入 → 视觉 Token + 语言 Token → 自回归预测 → 动作 Token → 解码为控制指令
```

### 1.2 VLA 与相关范式的关系

| 范式 | 代表 | 输入 | 输出 | 局限 |
|------|------|------|------|------|
| Vision-Language (VLM) | GPT-4V, LLaVA | 图 + 文 | 文本 | 不能驱动执行器 |
| Language-Action (LAM) | SayCan | 文本 + 状态 | 离散动作 | 缺乏视觉理解 |
| **VLA** | RT-2, pi-0 | 图 + 文 | 连续动作 | 数据需求大 |
| Diffusion Policy | DP, RDT | 图 + 状态 | 动作轨迹 | 缺乏语言泛化 |

---

## 2. 核心模型演进

### 2.1 RT-2 (Google DeepMind, 2023)

- **架构**: 基于 PaLM-E，用 SigLIP 编码图像，将机器人动作 token 化为 256-bin 离散值
- **关键突破**: 首次证明 LLM 的 in-context learning 能力可以迁移到机器人动作
- **局限**: 562B 参数，推理延迟 > 1s，无法实时控制

### 2.2 OpenVLA (Stanford + MIT, 2024)

- **架构**: 基于 Llama 2 (7B)，使用 SigLIP + 256-bin 动作 tokenizer
- **贡献**: 首个开源 VLA 模型，推动社区研究
- **局限**: 泛化能力有限，依赖高质量 demonstration 数据

### 2.3 pi-0 (Physical Intelligence, 2024-2025)

- **架构**: 基于 PaliGemma (3B)，引入 **Flow Matching** 动作 head 生成连续动作
- **关键创新**: 预训练 + finetune 范式，支持多任务多机器人形态
- **Open pi-0**: 2025 年开源，支持 3 种机器人硬件 (Franka, WidowX, Mobile ALOHA)
- **意义**: 被视为"机器人领域的 GPT 时刻"

### 2.4 其他重要模型

| 模型 | 机构 | 年份 | 关键特性 |
|------|------|------|----------|
| RT-1 | Google | 2022 | VLA 前身，token 化动作 |
| Octo | Stanford | 2024 | 通用策略模型，支持多形态 |
| CogACT | 清华 | 2024 | 中文 VLA，CoT 推理 |
| GR00T N1 | NVIDIA | 2025 | 人形机器人基础模型 |
| Gemini Robotics | Google | 2025 | 基于 Gemini 2.0 |
| pi-0.5 | Physical Intelligence | 2025 | 长 horizon 任务 |
| SuSo-X | Stanford | 2025 | 数据高效 VLA |

---

## 3. 数据采集: Teleoperation 与仿真

### 3.1 Teleoperation (遥操作) 数据采集

Teleoperation 是 VLA 训练的核心数据来源——人类操作员远程控制机器人执行任务，同时记录视觉、关节状态和动作。

```
Teleoperation 数据管线:
═══════════════════════════════════════════════════════════════

  操作员 ──遥操作──▶ 机器人 ──执行──▶ 物理环境
     ▲                  │                  │
     │                  ▼                  ▼
     │           ┌─────────────┐    ┌───────────┐
     └───────────│  数据记录系统 │◀───│ 传感器阵列 │
                 └─────────────┘    └───────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  标注 + 清洗     │
               │  语言指令标注     │
               │  → 训练数据集     │
               └─────────────────┘
```

**主流采集方式**:

| 方式 | 代表 | 优势 | 劣势 |
|------|------|------|------|
| VR 遥操 | ALOHA, Mobile ALOHA | 自然直觉 | 设备成本高 |
| 游戏手柄 | DROID | 简单 | 精细控制差 |
| 空间鼠标 | Franka Desk | 精确 | 学习曲线 |
| 视频学习 | UniPi | 无需硬件 | 仅限离线 |

### 3.2 数据规模

| 数据集 | 来源 | 规模 | 机器人形态 |
|--------|------|------|------------|
| Open X-Embodiment | 21 机构联合 | 100 万 episodes | 22 种 |
| DROID | Stanford | 76K demonstrations | Franka |
| RH20T | 清华 | 100K+ | 多形态 |
| BridgeData V2 | Google | 1.2M | WidowX |

---

## 4. Sim-to-Real Transfer

### 4.1 为什么需要 Sim-to-Real?

真实世界数据采集成本高、速度慢、有安全风险。仿真环境可以大规模并行生成数据，但存在 **Reality Gap** (仿真与现实的差距)。

### 4.2 核心技术

| 技术 | 原理 | 效果 |
|------|------|------|
| Domain Randomization | 随机化仿真中的视觉/物理参数 | 提升鲁棒性 |
| System Identification | 校准仿真物理参数匹配真实 | 缩小 Gap |
| Domain Adaptation | 用对抗学习对齐仿真与真实特征 | 视觉迁移 |
| Teacher-Student | 仿真中训练 teacher，真实中蒸馏 student | 安全迁移 |
| Digital Twin | 高精度物理仿真 (NVIDIA Isaac) | 最小 Gap |

### 4.3 NVIDIA Isaac 生态

```
NVIDIA Isaac 仿真-部署管线:
═══════════════════════════════════════════════════════════════

  Isaac Sim (仿真)     Isaac Lab (训练)     Isaac ROS (部署)
  ┌────────────┐      ┌────────────┐      ┌────────────┐
  │ USD 场景   │      │ RL/VLA     │      │ 实时推理    │
  │ 物理引擎   │──▶──│ 并行训练    │──▶──│ 传感器融合  │
  │ 数字孪生   │      │ Domain Rand │      │ 安全约束    │
  └────────────┘      └────────────┘      └────────────┘
```

---

## 5. 模型对比

| 维度 | RT-2 | OpenVLA | pi-0 | Open pi-0 | GR00T N1 |
|------|------|---------|------|-----------|----------|
| 参数量 | 562B | 7B | 3B | 3B | 未公开 |
| 骨干 LLM | PaLM-E | Llama 2 | PaliGemma | PaliGemma | Eagle V2 |
| 视觉编码器 | SigLIP | SigLIP | SigLIP | SigLIP | SigLIP |
| 动作表示 | 离散 bin | 离散 bin | Flow Matching | Flow Matching | 混合 |
| 开源 | 否 | 是 | 否 | 是 | 部分 |
| 多机器人 | 否 | 有限 | 是 | 3 种 | 人形为主 |
| 推理延迟 | > 1s | ~200ms | ~100ms | ~100ms | 未公开 |
| 泛化能力 | 中 | 低 | 高 | 中-高 | 高 |
| 适用场景 | 桌面操作 | 研究 | 通用 | 研究+原型 | 人形机器人 |

---

## 6. 2026 趋势与挑战

### 6.1 六大趋势

1. **通用化**: VLA 正在从单任务走向跨任务、跨形态的通用机器人基础模型
2. **Scaling Law**: 更多数据 + 更大模型 = 更强泛化；Open X-Embodiment 证明数据多样性比数据量更重要
3. **实时控制**: 从 >1s 延迟降至 <100ms，使 VLA 可用于动态任务 (接抛物体)
4. **多模态融合**: 触觉、力觉、听觉正在被纳入 VLA 输入
5. **端侧部署**: 模型量化 + 边缘芯片 (NVIDIA Jetson Orin) 使 VLA 脱离云端
6. **安全对齐**: VLA 的动作安全 (action safety) 成为研究热点——如何防止模型输出危险动作

### 6.2 核心挑战

| 挑战 | 描述 | 当前思路 |
|------|------|----------|
| 数据瓶颈 | 高质量 demonstration 数据稀缺 | 合成数据 + 视频学习 |
| Reality Gap | Sim-to-Real 仍有性能损失 | 高精度数字孪生 |
| 长 Horizon | 多步骤任务的成功率衰减 | 层级 VLA + 子目标分解 |
| 安全验证 | 缺乏 VLA 输出的形式化安全保证 | Shield 机制 + 形式化验证 |
| 泛化边界 | 新物体/新场景的零样本泛化不稳定 | 更大规模预训练 |

---

## 7. 延伸阅读

### 相关文档

- [[06_强化学习/05_机器人与具身智能/03_Humanoid_Robot_2026]] - 人形机器人平台
- [[概念/teleoperation]] - 遥操作数据采集
- [[15_智能体/01_Agent基础/16_AI_Agent]] - AI Agent 通用架构

### 论文与资源

- **RT-2**: Brohan et al., "RT-2: Vision-Language-Action Models" (2023)
- **OpenVLA**: Kim et al., "OpenVLA: An Open-Source Vision-Language-Action Model" (2024)
- **pi-0**: Black et al., "pi-0: A Vision-Language-Action Flow Model" (2024)
- **Open X-Embodiment**: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models" (2024)
- **GR00T**: NVIDIA, "Project GR00T: Foundation Model for Humanoid Robots" (2025)
- Physical Intelligence: https://www.physicalintelligence.company/
- NVIDIA Isaac: https://developer.nvidia.com/isaac
