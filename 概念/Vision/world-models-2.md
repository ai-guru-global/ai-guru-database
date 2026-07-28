---
title: "世界模型 2.0 (World Models / JEPA / Genie 2 / Sora / 具身智能)"
category: concepts
tags:
  - vision
  - world-models
  - jepa
  - sora
  - video-generation
  - embodied-ai
  - simulation
aliases:
  - World Models 2.0
  - JEPA
  - Genie 2
  - Sora
  - World Labs
  - Embodied AI
  - Simulation
relationships:
  - target: "概念/world-models"
    type: extends
  - target: "概念/world-models-jepa"
    type: extends
  - target: "概念/video-generation"
    type: related_to
  - target: "概念/3d-vision-2"
    type: related_to
  - target: "概念/agent-loop"
    type: related_to
summary: "世界模型 2.0 是 2024-2026 突破"AI 理解物理世界"的关键——Sora(OpenAI 文生视频)、Genie 2(DeepMind 交互式世界)、JEPA 2(Meta 自监督世界模型)、V-JEPA(LeCun)、World Labs(Fei-Fei Li 3D 世界)、Cosmos(NVIDIA 物理世界)。是具身智能、自动驾驶、机器人、AR/VR 的核心。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "世界模型 2.0"
---

# 世界模型 2.0

> 中文简称：世界模型 2.0

> **一句话理解**:世界模型 2.0 让 AI 理解"物理世界如何运作"——Sora / Veo 3 / Kling 文生视频、Genie 2 交互式世界、JEPA 2 自监督世界模型、World Labs 3D 世界。是具身智能(机器人)、自动驾驶(世界模拟器)、AR/VR 的"物理引擎"。

---

## 一、为什么需要世界模型?

LLM 局限于文本,无法理解物理世界:
- 没有空间感知
- 没有时间因果
- 没有物理规律
- 不能预测未来

世界模型解法:
- **视频生成**:从文本生成真实视频(Sora)
- **物理模拟**:理解重力 / 摩擦 / 碰撞
- **具身智能**:机器人决策
- **自动驾驶**:虚拟训练场

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 世界模型 | World Model | 模拟物理世界 |
| JEPA | Joint Embedding Predictive Architecture | LeCun |
| 具身智能 | Embodied AI | 机器人 + AI |
| 文生视频 | Text-to-Video | 文本生成视频 |
| 视频生成 | Video Generation | Sora / Veo / Kling |
| 物理模拟 | Physical Simulation | 物理规律 |
| 3D 世界 | 3D World | 三维空间 |
| 时空预测 | Spatio-Temporal Prediction | 时空未来 |
| 自监督 | Self-Supervised | 无标注 |
| 联合嵌入 | Joint Embedding | JEPA 核心 |
| 预测编码 | Predictive Coding | 大脑机制 |
| 强化学习 | Reinforcement Learning | 决策 |
| 仿真 | Simulation | 数字孪生 |
| 神经辐射场 | Neural Radiance Fields(NeRF) | 3D 重建 |
| 数字孪生 | Digital Twin | 物理世界映射 |
| 机器人 | Robotics | 具身智能 |
| 自动驾驶 | Autonomous Driving | 世界模拟器 |
| AR/VR | Augmented/Virtual Reality | 沉浸式 |
| 因果推理 | Causal Reasoning | 因果关系 |
| 物理推理 | Physical Reasoning | 物理规律 |

---

## 三、主流世界模型对比(2026-02 快照)

| 模型/系统 | 厂商/团队 | 类型 | 规模 | 能力 | 许可证 |
|---|---|---|---|---|---|
| **Sora** | OpenAI | 文生视频 | — | 60s 1080p | 商业 |
| **Sora 2** | OpenAI | 文生视频 | — | 90s 1080p | 商业 |
| **Veo 3** | Google | 文生视频 | — | 60s 4K | 商业 |
| **Kling 2.0** | 快手 | 文生视频 | — | 60s 4K | 商业 |
| **Vidu** | 生数科技 | 文生视频 | — | 30s 1080p | 商业 |
| **Wan 2.0** | 阿里 | 文生视频 | — | 60s 1080p | Apache 2.0 |
| **Genie 2** | DeepMind | 交互式世界 | — | 实时 | 研究 |
| **Genie 3** | DeepMind | 交互式世界 | — | 实时 | 研究 |
| **V-JEPA 2** | Meta | 自监督 | 1.2B | 视频预测 | CC-BY-NC |
| **JEPA 2** | Meta | 自监督 | 1.2B | 视频预测 | CC-BY-NC |
| **World Labs** | World Labs (Fei-Fei Li) | 3D 世界 | — | 真实 3D | 商业 |
| **Cosmos** | NVIDIA | 物理世界 | 14B | 物理 AI | Apache 2.0 |
| **HunyuanWorld** | 腾讯 | 3D 世界 | — | 360° | Apache 2.0 |
| **EmbodiedGen** | 字节 + 浙大 | 3D | — | 机器人 | 研究 |

---

## 四、Sora 详解(OpenAI)

### 4.1 核心能力

- **60-90 秒 1080p 视频**
- 物理规律理解(重力 / 流体 / 碰撞)
- 镜头控制(平移 / 拉近)
- 多角色 + 复杂场景
- 文生视频 + 图生视频

### 4.2 技术原理

- **DiT(Diffusion Transformer)**
- **时空 Patch**:把视频切成 3D patches
- **扩散过程**:从噪声到视频
- **文本 + 图像统一编码**

### 4.3 局限

- 长时因果弱
- 复杂物理不完美
- 算力成本高
- API 调用慢

### 4.4 商业化

- ChatGPT 集成(2024-12)
- Sora 2(2025-10)
- 与 Veo 3 / Kling 竞争

---

## 五、V-JEPA 2 详解(Meta)

### 5.1 核心思想

**联合嵌入预测架构**:
- 不预测像素,预测嵌入
- 自监督学习
- 无需标注
- LeCun AGI 路径核心

### 5.2 优势

- 比 Sora 训练数据少 1000x
- 理解物理(碰撞 / 物体恒存)
- 适合机器人决策
- 推理快(1 GPU 实时)

### 5.3 论文

- "V-JEPA 2: Self-Supervised Video World Model" [arxiv.org/abs/2506.09985](https://arxiv.org/abs/2506.09985)
- 博客 [ai.meta.com/blog/v-jepa-2](https://ai.meta.com/blog/v-jepa-2/)

---

## 六、Genie 2 详解(DeepMind)

### 6.1 核心

- **基础世界模型**:从单图生成可交互 3D 世界
- 实时交互
- 物理一致
- 游戏 / 机器人应用

### 6.2 论文

- "Genie 2: A Large-Scale Foundation World Model" [deepmind.google/discover/blog](https://deepmind.google/discover/blog/)

---

## 七、World Labs 详解(Fei-Fei Li)

### 7.1 核心

- **3D 世界生成**:从单图生成真实 3D
- 立体化场景
- 物理一致
- AR/VR / 游戏 / 设计

### 7.2 商业模式

- API + 商业
- 与 Sora / Veo 互补(Sora 视频,World Labs 3D)

---

## 八、Cosmos 详解(NVIDIA)

### 8.1 核心

- **物理 AI 基础模型**
- 14B 参数
- 物理世界模拟
- 机器人 / 自动驾驶训练场

### 8.2 优势

- 物理规律准确
- 多模态(视频 / 深度 / 法线)
- 适合 Synthetic Data 生成
- NVIDIA 生态集成

### 8.3 论文

- Cosmos [github.com/NVIDIA/Cosmos](https://github.com/NVIDIA/Cosmos)

---

## 九、生产最佳实践

1. **文生视频首选 Sora 2 / Veo 3 / Kling 2.0**:质量 SOTA。
2. **开源文生视频选 Wan 2.0 / HunyuanVideo**:Apache 2.0。
3. **自监督世界模型选 V-JEPA 2**:训练成本低。
4. **3D 世界生成选 World Labs**:单图 → 真实 3D。
5. **物理 AI / 机器人选 Cosmos / V-JEPA 2**:物理规律准确。
6. **具身智能训练场**:用 Sora / Cosmos 生成 synthetic data。
7. **视频长时一致**:Sora 2 / Veo 3 长视频较好。
8. **API 调用成本**:文生视频按秒计费,长视频慎用。
9. **缓存复用**:相同样本缓存。
10. **A/B 测试**:不同模型效果差异大,需评估。

---

## 十、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Sora 2** | 2025-10,90s 1080p |
| **Veo 3** | 60s 4K,Google 商业化 |
| **Kling 2.0** | 60s 4K,国产 SOTA |
| **Wan 2.0** | Apache 2.0,开源 SOTA |
| **V-JEPA 2** | 2025-06,自监督 SOTA |
| **Genie 3** | DeepMind,2026 商业化 |
| **World Labs** | 3D 世界,商业化 |
| **Cosmos** | NVIDIA 14B,开源 |
| **ARR 规模** | 视频生成 ARR $2B+ |
| **主要竞品** | Sora / Veo / Kling / Wan / V-JEPA / Genie / Cosmos / World Labs |

---

## 十一、See Also(官方源)

### Sora

- 介绍 [openai.com/sora](https://openai.com/sora/)
- 系统卡 [openai.com/index/sora-system-card](https://openai.com/index/sora-system-card/)

### V-JEPA

- 论文 [arxiv.org/abs/2506.09985](https://arxiv.org/abs/2506.09985)
- 博客 [ai.meta.com/blog/v-jepa-2](https://ai.meta.com/blog/v-jepa-2/)
- 仓库 [github.com/facebookresearch/jepa](https://github.com/facebookresearch/jepa)

### Genie 2

- 博客 [deepmind.google/discover/blog](https://deepmind.google/discover/blog/)
- 论文 [arxiv.org/abs/2402.15391](https://arxiv.org/abs/2402.15391)

### Cosmos

- 仓库 [github.com/NVIDIA/Cosmos](https://github.com/NVIDIA/Cosmos)

### Wan 2.0

- 仓库 [github.com/Wan-Video/Wan2.1](https://github.com/Wan-Video/Wan2.1)

### World Labs

- 主页 [worldlabs.ai](https://www.worldlabs.ai/)

### HunyuanWorld

- 仓库 [github.com/Tencent-Hunyuan/HunyuanWorld](https://github.com/Tencent-Hunyuan/HunyuanWorld)

---

## 十二、相关概念卡

- [[概念/world-models|World Models]]
- [[概念/world-models-jepa|World Models Jepa]]
- [[概念/video-generation|Video Generation]]
- [[概念/3d-vision-2|3d Vision 2]]
- [[概念/agent-loop|Agent Loop]]
- [[概念/Vision/video-generation|Sora]]
- [[概念/stable-diffusion|Stable Diffusion]]
- [[概念/3d-vision|3d Vision]]
