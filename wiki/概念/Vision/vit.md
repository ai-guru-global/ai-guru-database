---
title: Vision Transformer (ViT)
category: -concepts
tags: ["computer-vision", "vit", "transformer", "image-classification", "patch-embedding", "self-attention"]
aliases: [Vision Transformer, ViT, 视觉Transformer]
relationships:
  - target: "[[概念/computer-vision]]"
    type: part_of
  - target: "[[概念/Vision/clip]]"
    type: foundation_for
  - target: "[[概念/Vision/dino]]"
    type: related_to
  - target: "[[概念/Vision/sam]]"
    type: related_to
sources:
  - 04_计算机视觉/01_CV基础/ViT_Deep_Dive.md
summary: Vision Transformer 将图像切分为固定大小的 Patch 序列，经线性嵌入和位置编码后送入标准 Transformer Encoder，用极少的归纳偏置在大规模数据上超越 CNN，开启了视觉领域的 Transformer 时代。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: core
created: 2026-07-11T00:00:00Z
updated: 2026-07-21
name_zh: "视觉 Transformer"
---

# Vision Transformer (ViT)

> 中文简称：视觉 Transformer

> **一句话理解**: ViT 把图像当作一串"视觉单词"（Patch），用 NLP 中的 Transformer 来"阅读"图像——抛弃了卷积的局部偏置，用纯注意力从海量数据中学习视觉表征。

---

## 核心概念

Vision Transformer（ViT）由 Google 团队在 2020 年提出（Dosovitskiy et al., "An Image is Worth 16x16 Words"），其核心思想是：**将图像分块（Patch）后视为序列，用标准 Transformer Encoder 处理**。ViT 证明了在足够大的数据量下（JFT-300M、ImageNet-21k），没有 CNN 归纳偏置的纯 Transformer 架构可以取得更优的图像分类性能。

### 核心要点

- **图像分块（Patch Partition）**：将 H×W×C 图像切分为 N 个 P×P×C 的 Patch，N = (H/P) × (W/P)
- **线性嵌入（Linear Projection）**：每个 Patch 展平后经全连接层映射为 D 维向量，等价于一个卷积核大小为 P×P、步长为 P 的卷积
- **位置编码（Positional Embedding）**：可学习的 1D 位置编码加到 Patch Embedding 上，让模型感知空间顺序
- **[CLS] Token**：在序列开头添加一个可学习的分类 Token，其最终输出作为全局图像表征
- **无归纳偏置**：CNN 内置局部性和平移不变性，ViT 几乎没有——一切从数据中学习

## 架构图

```mermaid
flowchart LR
    A["输入图像\n224×224×3"] --> B["分块\n14×14 = 196个\n每个16×16×3"]
    B --> C["线性投影\n→ 196×768"]
    D["可学习位置编码\n196×768"] --> C
    E["[CLS] Token\n1×768"] --> C
    C --> F["Transformer Encoder\n×12层"]
    F --> G["[CLS] 输出"]
    G --> H["MLP Head"]
    H --> I["分类结果"]

    subgraph F["Transformer Encoder × L"]
        F1["LayerNorm"] --> F2["Multi-Head\nSelf-Attention"]
        F2 --> F3["残差连接"]
        F3 --> F4["LayerNorm"]
        F4 --> F5["MLP\nGELU"]}
    end
```

### 前向计算流程

```
输入: x ∈ R^(H×W×C)
1. 分块: x_p ∈ R^(N × (P²·C)),  N = HW/P²
2. 线性投影: z = x_p · E,  E ∈ R^((P²·C) × D)
3. 加 [CLS] 和位置编码: z = [z_cls; z] + E_pos
4. Transformer Encoder: z' = TransformerEncoder(z)
5. 分类: y = MLPHead(z'_cls)
```

## 详细内容

### Patch Embedding 详解

Patch Embedding 的本质是将 2D 图像转化为 1D 序列。以 ViT-Base 为例：输入 224×224 图像，Patch 大小 16×16，得到 14×14 = 196 个 Patch。每个 Patch 展平为 768 维向量（16×16×3 = 768）。

在 PyTorch 中，这可以通过一个 `nn.Conv2d(3, 768, kernel_size=16, stride=16)` 高效实现，等价于先分块再线性投影。

### 位置编码的演化

| 类型 | 形式 | 优点 | 缺点 |
|------|------|------|------|
| 1D 可学习（ViT 原版） | 每个位置一个可学习向量 | 简单有效 | 不支持任意分辨率 |
| 2D 相对位置（Swin） | 行列各一组编码 | 适配多尺度 | 实现复杂 |
| 正弦位置编码 | 固定公式生成 | 无需训练、可外推 | 效果略差 |
| 插值位置编码 | 对预训练编码双三次插值 | 支持微调时改分辨率 | 大幅外推性能下降 |

### 注意力的全局感受野

ViT 的核心优势在于**第一层就拥有全局感受野**。CNN 需要堆叠多层才能让深层神经元看到整张图像，而 Self-Attention 一次计算就让每个 Patch 与所有 Patch 交互。

代价是计算复杂度：标准 Attention 为 O(N²·D)，N 为 Patch 数量。输入分辨率翻倍时 Patch 数量变为 4 倍，计算量 16 倍增长，这限制了 ViT 在高分辨率场景的直接应用。

### ViT 变体家族

| 变体 | 核心改进 | 适用场景 |
|------|---------|---------|
| **DeiT** | 蒸馏 Token + 强增强 | 中等数据集训练 |
| **Swin Transformer** | 移位窗口注意力 | 检测/分割等密集任务 |
| **BEiT** | 掩码 Patch 建模 | 自监督预训练 |
| **MAE** | 随机遮挡 75% + 重建 | 高效自监督预训练 |
| **CvT** | 卷积 Token + 衰减位置编码 | 兼具 CNN 优势 |
| **LeViT** | 混合设计 + 优化推理速度 | 移动端部署 |

### ViT 模型规格

| 模型 | 层数 | 隐藏维度 | 注意力头数 | 参数量 | ImageNet Top-1 |
|------|------|---------|-----------|--------|---------------|
| ViT-Tiny | 12 | 192 | 3 | 5.7M | ~75% |
| ViT-Small | 12 | 384 | 6 | 22M | ~81% |
| ViT-Base | 12 | 768 | 12 | 86M | 84.0% |
| ViT-Large | 24 | 1024 | 16 | 307M | 85.2% |
| ViT-Huge | 32 | 1280 | 16 | 632M | 88.5% |

### 训练策略

ViT 的成功高度依赖大规模预训练数据：

| 预训练数据 | 数据量 | 微调 ImageNet Top-1 |
|-----------|--------|-------------------|
| ImageNet-1k | 1.3M | ~79%（不如同级别 CNN） |
| ImageNet-21k | 14M | ~83% |
| JFT-300M | 300M | 88.5%（ViT-H） |
| JFT-3B（最新） | 3B | 90%+ |

**关键结论**：ViT 在小数据上表现不如 CNN（缺少归纳偏置），但在大数据上超越 CNN。DeiT 通过蒸馏和强增强使 ViT 在 ImageNet-1k 上也能训练出竞争力模型。

### 注意力可视化

ViT 的注意力图可以通过 Attention Rollout 技术可视化：逐层累积注意力权重，展示 [CLS] Token 对各 Patch 的关注分布。结果显示，ViT 能自动学习到：
- 浅层关注局部纹理（类似 CNN 浅层卷积核）
- 深层关注全局语义区域（物体整体）

## ViT vs CNN 对比

| 维度 | CNN（ResNet-50） | ViT（ViT-B/16） |
|------|-----------------|----------------|
| 归纳偏置 | 强（局部性 + 平移不变性） | 极弱（几乎纯数据驱动） |
| 小数据 (<1M) | 优 | 差（严重过拟合） |
| 大数据 (>14M) | 好 | 更优 |
| 全局依赖 | 需堆叠 4+ stage | 第一层即全局 |
| 计算复杂度 | O(N·D²)，与分辨率线性 | O(N²·D)，与分辨率平方 |
| 高分辨率适配 | 天然支持 | 需窗口/层次化策略 |
| 特征金字塔 | FPN 原生支持 | 需特殊设计（Swin） |

## AI 应用

- **图像分类基座**：ViT 是 CLIP、SAM、DINOv2 等基础模型的视觉编码器
- **医学影像分析**：TransUNet 将 ViT 与 U-Net 结合用于器官分割
- **视频理解**：ViViT、TimeSformer 将 ViT 扩展到时空维度
- **多模态大模型**：几乎所有现代 VLM（LLaVA、Qwen-VL）都以 ViT 作为图像编码器
- **机器人感知**：RT-2 使用 ViT 编码器理解场景

## 开放问题

- 高分辨率输入的二次方计算成本仍然高昂 ^[ambiguous]
- ViT 缺少 CNN 的等变性（equivariance），在几何推理任务上可能不利
- 自监督预训练的最优策略（MAE vs BEiT vs DINO）尚未收敛
- 移动端 ViT 的延迟优化（量化、蒸馏）仍在探索

## 来源

- 04_计算机视觉/01_CV基础/ViT_Deep_Dive.md
- Dosovitskiy et al., "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale", ICLR 2021

## Related

- [[概念/computer-vision]] — 计算机视觉 (共享: cv, transformer)
- [[概念/Vision/clip]] — CLIP (共享: vit, image-embedding)
- [[概念/Vision/dino]] — DINOv2 (共享: vit, self-supervised)
- [[概念/Vision/sam]] — Segment Anything Model (共享: vit, foundation-model)
- [[概念/Vision/data-augmentation-cv]] — 数据增强 (共享: cv, training)

---

## 2026 ViT 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **ViT-L/H** | 大规模 ViT 模型达到 SOTA | GA |
| **DINOv2** | 自监督 ViT 预训练，强泛化能力 | GA |
| **SigLIP** | Sigmoid 损失替代 Softmax 的视觉编码器 | GA |
| **高效 ViT** | MobileViT/EfficientViT 端侧部署 | GA |
| **多模态 ViT** | 作为 VLM 的视觉编码器 | GA |

## 生产最佳实践

1. **预训练选择**：根据任务选择 DINOv2（理解）或 SigLIP（图文匹配）
2. **分辨率适配**：ViT 对输入分辨率敏感，使用位置编码插值适配
3. **微调策略**：小数据集只微调最后几层 + 分类头
4. **推理优化**：使用 TensorRT 加速 ViT 推理，降低延迟
5. **数据增强**：ViT 需要更强的数据增强（RandAugment/Mixup）
