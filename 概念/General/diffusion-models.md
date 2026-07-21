---
title: 扩散模型 (Diffusion Models)
category: 01-concepts
tags: ["diffusion", "ddpm", "score-matching", "flow-matching", "denoising"]
summary: "扩散模型核心概念：前向加噪/反向去噪、DDPM/Score SDE/Flow Matching、在图像/视频/音频/3D 生成中的应用，与 GAN/VAE 对比。"
created: 2026-07-21
updated: 2026-07-21
tier: core
sources: []

---
# 扩散模型 (Diffusion Models)

## 定义

扩散模型是一类生成模型，通过学习**逐步去除噪声**来生成数据。核心思想：将数据生成建模为从纯噪声逐步去噪的过程。

## 核心原理

### 前向过程 (加噪)

```
x₀ → x₁ → x₂ → ... → x_T ≈ N(0, I)
数据    逐步加高斯噪声        纯噪声

x_t = √(α_t) · x_{t-1} + √(1-α_t) · ε
其中 ε ~ N(0, I), α_t 是噪声调度
```

### 反向过程 (去噪/生成)

```
x_T → x_{T-1} → ... → x₁ → x₀
纯噪声    学习去噪         生成数据

模型学习: ε_θ(x_t, t) ≈ ε (预测加入的噪声)
损失: L = ||ε - ε_θ(x_t, t)||²
```

### 直觉类比

```
前向 = 把一幅画逐步模糊成噪点 (容易，固定公式)
反向 = 从噪点逐步恢复出清晰画 (难，需要学习)

类比:
- 雕塑家: 从石头(噪声)中"去除"多余部分 → 露出雕塑(数据)
- 修复师: 从模糊照片(噪声)逐步修复 → 清晰图像(数据)
```

## 主要变体

| 变体 | 年份 | 核心思想 | 代表 |
|------|------|---------|------|
| DDPM | 2020 | 马尔可夫去噪 | DALL-E 2 |
| Score SDE | 2021 | 分数匹配+随机微分方程 | - |
| DDIM | 2021 | 确定性采样加速 | Stable Diffusion |
| Latent Diffusion | 2022 | 在 latent 空间扩散 | SD/SDXL |
| Flow Matching | 2023 | 学习最优传输流 | SD3/Flux |
| Rectified Flow | 2023 | 拉直扩散轨迹 | - |
| Consistency Model | 2023 | 一步/少步生成 | LCM |
| DiT | 2024 | Transformer 替代 U-Net | Sora/SD3 |

## 关键组件

### 噪声调度 (Noise Schedule)

```python
# 控制每步加多少噪声
# 线性: β_t 从 0.0001 到 0.02
# 余弦: 更平滑的调度 (改进版)
# Sigmoid: 2024+ 新调度

# 影响: 生成质量 vs 速度的权衡
```

### 采样器 (Sampler)

```
DDPM: 1000 步 (慢但质量好)
DDIM: 50 步 (加速 20x)
DPM-Solver: 20 步 (ODE 求解器)
Euler: 20-30 步 (简单高效)
LCM: 4-8 步 (一致性蒸馏)
Flow: 20-50 步 (2024+ 主流)
```

### 条件生成

```
无条件: 随机生成
文本条件: CLIP/T5 编码 → 交叉注意力 (text-to-image)
图像条件: 参考图 → 风格/结构引导
ControlNet: 额外条件 (深度/边缘/姿态)
Inpainting: 掩码区域生成
```

## 与其他生成模型对比

| 维度 | Diffusion | GAN | VAE | AR (自回归) |
|------|-----------|-----|-----|------------|
| 质量 | 极高 | 高 | 中 | 高 |
| 多样性 | 高 | 中(模式坍缩) | 高 | 高 |
| 训练稳定性 | 高 | 低 | 高 | 高 |
| 生成速度 | 慢(多步) | 快(单步) | 快 | 中 |
| 可控性 | 极强 | 中 | 中 | 强 |
| 2026 主流 | 是 | 少 | 少 | 是(文本) |

## 2026 应用全景

- **图像生成**: Stable Diffusion 3.5, Flux, DALL-E 4, Midjourney v7
- **视频生成**: Sora, Kling 2.0, Wan 2.1 (DiT + Flow Matching)
- **音频生成**: Stable Audio, MusicGen
- **3D 生成**: TripoSR, InstantMesh
- **分子设计**: DiffDock, RFdiffusion
- **图像编辑**: InstructPix2Pix, Magic Eraser

## 最小代码示例

```python
# 简化版 DDPM 训练
import torch

def train_step(model, x_0, optimizer):
    # 随机时间步
    t = torch.randint(0, 1000, (x_0.shape[0],))
    # 随机噪声
    noise = torch.randn_like(x_0)
    # 加噪
    alpha_bar = get_alpha_bar(t)
    x_t = alpha_bar.sqrt() * x_0 + (1 - alpha_bar).sqrt() * noise
    # 预测噪声
    pred_noise = model(x_t, t)
    # MSE 损失
    loss = ((noise - pred_noise) ** 2).mean()
    loss.backward()
    optimizer.step()
    return loss
```

## 交叉引用

- [[概念/LLM/transformer-architecture|Transformer 架构]]
- [[概念/Inference/quantization|量化]]
- [[大模型/Multimodal_Models/Video_Generation_2026|视频生成]]
- [[深度学习/Generative_Models/|生成模型]]
- [[概念/General/mixture-of-experts|MoE]]
