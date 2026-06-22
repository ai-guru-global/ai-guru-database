---
title: 视觉生成模型
category: -concepts
tags: ["computer-vision", "generative-models", "gan", "diffusion", "stable-diffusion", "image-generation"]
aliases: [Generative multimodal-vision world-models-jepa, 生成模型, GAN, multimodal-models Models, 扩散模型]
relationships:
  - target: "[[_concepts/computer-vision]]"
    type: related_to
  - target: "_concepts/image-segmentation"
    type: related_to
  - target: "_concepts/video-generation"
    type: related_to
sources:
  - 05_computer-vision_Vision/Generative_Models/Generative_Models.md
summary: 视觉生成模型学习数据分布并创造新图像，从GAN的对抗训练到Diffusion的逐步去噪，扩散模型已成为当前主流。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# 视觉生成模型

视觉生成模型（Generative Vision Models）学习图像数据的真实分布 $p_{data}(x)$ 并生成逼真新样本。从GAN的对抗博弈到扩散模型的逐步去噪，生成质量不断提升。扩散模型凭借训练稳定性和生成质量的平衡，已成为文生图、图像编辑等任务的主流范式，并扩展到视频生成领域。

## 核心要点

- **GAN**通过生成器和判别器的对抗博弈学习，训练不稳定易模式坍塌，但生成速度快
- **扩散模型**通过前向加噪+反向去噪过程生成图像，训练稳定、质量高、覆盖完整
- **Stable Diffusion**在潜在空间（Latent Space）而非像素空间扩散，计算量降低48倍
- ControlNet为扩散模型添加空间控制（边缘、深度、姿态），实现精细化图像编辑
- 评估指标：FID（Fréchet Inception Distance）衡量生成分布与真实分布的距离，越低越好

## 详细内容

### GAN架构

GAN的损失函数为Min-Max博弈：$\min_G \max_D \mathbb{E}[\log D(x)] + \mathbb{E}[\log(1-D(G(z)))]$。核心问题：判别器过强时生成器梯度消失，导致训练崩溃。改进方向包括WGAN（Wasserstein距离）、Spectral neural-networks和StyleGAN系列。

### 扩散模型原理

**前向过程**（固定）：$x_0 \rightarrow x_T$，逐步添加高斯噪声直到变成纯噪声。关键性质：可从$x_0$直接采样$x_t$：$x_t = \sqrt{\bar{\alpha}_t} x_0 + \sqrt{1-\bar{\alpha}_t} \epsilon$

**反向过程**（训练）：训练U-Net预测每步添加的噪声$\epsilon$，损失函数为简单MSE：$\mathcal{L} = \mathbb{E}[\|\epsilon - \epsilon_\theta(x_t, t)\|^2]$

**为什么比GAN好**：扩散模型优化回归问题（预测噪声），GAN优化博弈问题（对抗训练）。回归目标明确，无对抗震荡。

### Stable Diffusion架构

三大组件：(1) VAE将512×512×3图像压缩到64×64×4潜在空间；(2) U-Net在潜在空间执行去噪，通过Cross-Attention注入CLIP文本嵌入；(3) CLIP Text Encoder将文本编码为条件信号。

**加速技术**：DDIM将1000步采样压缩到50步（快20倍），LCM蒸馏到4-8步，Turbo实现1-2步生成。

### 控制与引导

- **CFG（Classifier-Free Guidance）**：通过条件/无条件输出差异引导生成，guidance_scale 7-9为推荐范围
- **ControlNet**：复制U-Net权重作为可训练控制分支，支持边缘、深度、姿态等空间约束
- **IP-Adapter**：用图像嵌入替代文本嵌入控制生成风格

### GAN vs VAE vs Diffusion对比

| 维度 | GAN | VAE | Diffusion |
|------|-----|-----|-----------|
| 训练方式 | 对抗博弈 | 变分推断 | 噪声预测回归 |
| 生成质量 | 清晰 | 略模糊 | 最高 |
| 训练稳定性 | 不稳定 | 稳定 | 稳定 |
| 多样性 | 易模式坍塌 | 覆盖完整 | 覆盖完整 |
| 采样速度 | 快（1次前向） | 快 | 慢（50+次） |

### 应用场景

AI艺术创作（Midjourney、DALL-E 3）、图像编辑（Inpainting、超分辨率、风格迁移）、游戏影视（纹理生成、概念图）、虚拟试衣与电商、医疗影像增强（数据增广、去噪）。

### 评估指标

| 指标 | 原理 | 特点 |
|------|------|------|
| IS (Inception Score) | 预测多样性+清晰度 | 简单但不考虑真实分布 |
| FID | 真实与生成分布距离 | 最常用，越低越好 |
| CLIP Score | 图像-文本匹配度 | 评估文生图对齐 |
| Human Eval | 人类偏好投票 | 最准确但成本高 |

## 开放问题

- 扩散模型采样速度虽已大幅改善，但仍比GAN慢一个数量级 ^[ambiguous]
- 文本对齐度仍不完美，复杂提示词（空间关系、计数）的理解有限
- 训练数据版权与生成内容归属的法律框架尚在建立中
- 生成偏见（种族、性别）的消除需要系统性解决方案

## 来源

- 04_Computer_Vision/Generative_Models/Generative_Models.md

## Related

- [[20_Papers/Diffusion_Models_Deep_Dive]] — Diffusion Models 深度解读 (从 DDPM 到 Stable Diffusion 再到 DiT) (共享: cv, diffusion, generative-models, stable-diffusion)
