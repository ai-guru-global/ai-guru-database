---
title: 扩散模型 (Diffusion Models)
category: 01-concepts
tags: ["diffusion", "ddpm", "score-matching", "flow-matching", "denoising"]
summary: "扩散模型核心概念：前向加噪/反向去噪、DDPM/Score SDE/Flow Matching、在图像/视频/音频/3D 生成中的应用，与 GAN/VAE 对比。"
created: 2026-07-21
updated: 2026-07-21
tier: core
sources: []

name_zh: "扩散模型"
---
# 扩散模型 (Diffusion Models)

> 中文简称：扩散模型

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
- [[05_大模型/10_多模态模型/Video_Generation_2026|视频生成]]
- [[03_深度学习/04_生成模型/|生成模型]]
- [[概念/General/mixture-of-experts|MoE]]

---

## 2026 扩散模型生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Stable Diffusion 3.5** | 开源图像生成 SOTA，MMDiT 架构 | GA |
| **FLUX.1** | Black Forest Labs 新一代扩散模型 | GA |
| **视频扩散** | Sora/Kling/可灵 视频生成 | GA |
| **3D 扩散** | 文本/图像到 3D 资产生成 | 研究 |
| **Consistency Models** | 单步/少步采样加速 | GA |
| **Distillation** | 扩散模型蒸馏加速 10-50x | GA |

## 扩散模型架构对比

| 架构 | 代表 | 采样步数 | 质量 | 速度 |
|------|------|----------|------|------|
| DDPM | 原始 | 1000 | 高 | 极慢 |
| DDIM | 加速 | 50-100 | 高 | 慢 |
| LCM | 一致性 | 4-8 | 中-高 | 快 |
| Flow Matching | SD3/FLUX | 20-50 | 极高 | 中 |
| Consistency | 单步 | 1-2 | 中 | 极快 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 生成质量差 | 采样步数不足 | 增加步数或使用更优采样器 |
| 生成速度慢 | 模型未加速 | 使用 LCM/蒸馏 + GPU 推理 |
| 显存不足 | 模型过大 | 使用 xFormers + 分块 VAE |
| 图像畸变 | CFG 过高 | 降低 guidance_scale 至 7-9 |
| 风格不一致 | 随机种子变化 | 固定 seed + 统一参数 |

## 生产最佳实践

1. **推理加速**：生产环境使用 LCM/蒸馏模型 + TensorRT 优化
2. **显存管理**：启用 xFormers + 分块 VAE 降低显存占用
3. **质量控制**：设置 NSFW 过滤器 + 质量评分模型
4. **批量生成**：使用批处理 + 异步队列提高吞吐
5. **版本管理**：固定模型版本 + 采样参数确保可复现

## 生产检查清单

1. ✅ 使用加速采样（LCM/蒸馏/TensorRT）
2. ✅ 启用 NSFW 安全过滤
3. ✅ 固定模型版本和采样参数
4. ✅ 配置 GPU 显存监控 + OOM 保护
5. ✅ 异步队列处理批量生成请求
6. ✅ 生成结果质量评分 + 异常检测

## 总结

扩散模型是 2026 年生成式 AI 的核心架构，从图像生成扩展到视频、3D、音频等多模态领域。Flow Matching 和 Consistency Models 正在重新定义采样效率，使实时生成成为可能。

> 💡 扩散模型的核心突破是“用噪声建模创造”——从纯噪声中逐步恢复出结构化内容，这是生成式 AI 的数学之美。
