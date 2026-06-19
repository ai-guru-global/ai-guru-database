---
title: 世界模型与JEPA架构
category: concepts
tags: ["deep-learning", "world-model", "jepa", "self-supervised", "v-jepa", "representation-learning", "agi"]
aliases: [World model-training, JEPA, V-JEPA, 世界模型, 联合嵌入预测架构, LeCun世界模型]
relationships:
  - target: "[[_concepts/transformer-architecture]]"
    type: related_to
  - target: "_concepts/neural-networks"
    type: related_to
  - target: "_concepts/state-space-models"
    type: related_to
sources: [03_Deep_unsupervised-learning/World_Models/World_Models_2026.md, 03_Deep_Learning/World_Models/JEPA_transformer-architecture_2026.md]
summary: LeCun 提出的自监督世界模型架构，不预测像素而是预测抽象表征，让AI学会世界的运行规律，是通向AGI的关键路径之一。
provenance:
  extracted: 0.80
  inferred: 0.12
  ambiguous: 0.08
base_confidence: 0.72
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# 世界模型与JEPA架构

世界模型（World Model）是让 AI 系统预测环境未来状态的内部表示机制。与 GPT/Sora 等生成模型不同，世界模型不直接生成像素或文本，而是学习抽象的、压缩的世界表征并在此空间中预测。JEPA（Joint Embedding Predictive Architecture）是 Yann LeCun 于 2022 年提出的实现世界模型的核心架构，被认为是通向 AGI 的关键路径。

## 核心要点

- **预测表征而非像素**：JEPA 在隐空间中预测未来，避免浪费算力在不可预测的细节上
- **自监督学习**：从观察中学习世界规律，无需标注数据
- **能量模型框架**：JEPA 可视为非概率能量模型，能量高低反映预测置信度
- **层次化世界模型**：H-JEPA 在不同抽象层级进行预测，更接近人类认知
- **机器人与自动驾驶**：V-JEPA 2 在机器人抓取任务上成功率达 80.8%

## 详细内容

### 核心思想

传统生成模型（MAE/VAE/GPT）预测像素或 long-context-models，被迫处理不可预测的高维细节（如树叶具体抖动模式）。JEPA 转而预测抽象表征：

$$\text{Input } x \xrightarrow{\text{Encoder}} s_x \xrightarrow{\text{Predictor}} \hat{s}_y \quad \text{vs} \quad s_y \xleftarrow{\text{Encoder (stop-grad)}} \text{Input } y$$

损失函数：$L = \|\hat{s}_y - s_y\|^2$（表征空间距离，非像素重建误差）

### JEPA 架构组件

| 组件 | 功能 | 类比 |
|------|------|------|
| **Encoder（编码器）** | 提取输入的抽象表征 | 感知系统 |
| **Predictor（预测器）** | 基于当前状态预测未来表征 | 心智模型 |
| **Target Encoder** | EMA 更新的目标编码器 | 稳定训练目标 |
| **隐空间** | 世界模型的表示空间 | 认知空间 |

目标编码器使用指数移动平均（EMA, decay=0.996）更新，提供稳定的训练目标，这是防止表征坍塌的关键机制 ^[inferred]。

### JEPA 家族详解

#### I-JEPA（image-segmentation JEPA, 2023）

从图像学习语义表征，无需手工数据增强。随机掩码图像块，从可见区域预测被遮挡区域的表征。在 ImageNet 下游任务上优于 MAE 和对比学习方法。

#### V-JEPA（Video JEPA, 2024）

扩展到视频，学习时空表征。理解物体持久性（遮挡后重新出现时识别同一物体）、运动预测和物理直觉 ^[inferred]。

#### V-JEPA 2（2025）

重大突破：支持**动作条件预测**，可用于机器人控制。加入动作编码器后，机器人抓取成功率从 60.8% 提升到 80.8%。

#### LeJEPA（2025.11）

理论突破：从数学上证明 JEPA 的可扩展性和防表征坍塌。将预测问题转化为分布匹配问题，无需 stop-gradient、EMA 等启发式技巧 ^[inferred]。

#### VL-JEPA（2025.12）

视觉-语言版，非自回归生成。一次预测完整文本表征而非逐 token 生成，对稳定视频输出几乎恒定，效率显著提升。

### 掩码策略

| 策略 | 描述 | 适用场景 |
|------|------|----------|
| Random Masking | 随机掩码 patches | 通用预训练 |
| Block Masking | 掩码连续块 | 空间/时序连续性 |
| Multi-Scale | 不同尺度掩码 | 层次化特征 |
| Learned Masking | 学习最优掩码模式 | 任务自适应 |

### 世界模型与规划

世界模型可在表征空间模拟多步未来，用于模型预测控制（MPC）：

1. **观测编码**：摄像头图像 → V-JEPA 编码器 → 场景表征
2. **动作条件预测**：候选动作 → V-JEPA 2-AC → 预测新场景表征
3. **评估与规划**：选择使预测表征最接近目标的最优动作序列
4. **闭环执行**：执行动作 → 新观测 → 重新规划

与传统方法相比，世界模型避免了模块间的误差累积，在表征空间可梯度优化 ^[inferred]。

### 能量模型视角

JEPA 的能量函数：$E(x, y) = \|P(E_x(x)) - E_y(y)\|^2$

- 能量低 → 预测准确，x 和 y 语义一致
- 能量高 → 预测错误，x 和 y 不相关

能量模型天然支持不确定性建模和组合推理，可通过能量最小化生成合理的未来状态 ^[inferred]。

### 世界模型 vs 世界模拟器

| 概念 | 定义 | 代表 |
|------|------|------|
| **世界模拟器** | 生成逼真的未来观测（像素/文本） | Sora, GPT-4 |
| **世界模型** | 学习预测未来的抽象表征 | JEPA, V-JEPA |

LeCun 的论点：像素预测不可行，世界模型学习的是"树叶会动"这一层面的理解，而非像素级细节。

### 与其他架构对比

| 架构 | 预测目标 | 优势 | 局限 |
|------|----------|------|------|
| GPT | 下一个 token | 序列建模强 | 无世界模型，推理深度有限 |
| Diffusion | 去噪 | 高质量生成 | 推理慢 |
| VAE | 概率重构 | 生成能力 | 像素级预测 |
| **JEPA** | **潜在表征** | **高效、可规划、可解释** | 训练需技巧 |

JEPA 和 GPT 可互补结合：JEPA 提供世界模型，GPT 提供推理能力 ^[inferred]。

### LeCun 的自主智能架构

```
Configurator（LLM 任务理解）
    ↓
World Model（JEPA 核心）→ Actor（策略）→ Critic（价值）
    ↓
Perception（编码器）
```

模块化层次化架构，自监督学习为主，强化学习为辅，接近人类学习方式。

### 应用场景

- **自动驾驶**：预测交通参与者未来行为，场景表征 → 预测危险表征 → 直接输出动作
- **机器人操作**：V-JEPA 2-AC 抓取成功率 80.8%，导航 ATE 5.687
- **视频理解**：高效处理长视频序列，语义级检索和编辑
- **科学发现**：天气预测、蛋白质折叠、材料科学模拟

## 开放问题

- 长程预测仍然困难，当前只能可靠预测几帧 ^[ambiguous]
- 世界模型是否真能学到因果关系而非仅仅相关性？ ^[ambiguous]
- 多模态（视觉+语言+触觉）JEPA 如何统一？
- JEPA 的训练稳定性是否可保证（LeJEPA 提供了部分理论）？

## 来源

- 03_Deep_Learning/World_Models/World_Models_2026.md
- 03_Deep_Learning/World_Models/JEPA_Architecture_2026.md
- LeCun (2022) "A Path Towards Autonomous Machine Intelligence"
- Assran et al. (2023) I-JEPA, Bardes et al. (2024) V-JEPA

## Related

- [[_concepts/neural-networks.md|neural-networks]]
- [[_concepts/optimization-regularization.md|optimization-regularization]]
- [[_concepts/state-space-models.md|state-space-models]]
- [[_concepts/transformer-architecture.md|transformer-architecture]]
- [[00_AI_Introduction/AI_Future_Trends.md|AI_Future_Trends]]
