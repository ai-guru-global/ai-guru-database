---
title: DINOv2 — 自监督视觉特征学习
category: -concepts
tags: ["computer-vision", "self-supervised-learning", "dino", "dino-v2", "vision-transformer", "representation-learning"]
aliases: [DINOv2, DINO, 自蒸馏视觉Transformer, Self-Distillation with No Labels]
relationships:
  - target: "[[概念/Vision/vit]]"
    type: uses
  - target: "[[概念/Vision/clip]]"
    type: related_to
  - target: "[[概念/Vision/sam]]"
    type: related_to
  - target: "[[概念/computer-vision]]"
    type: part_of
sources:
  - 04_计算机视觉/Self_Supervised_Learning.md
summary: DINOv2 是 Meta 提出的自监督视觉基础模型，融合自蒸馏（DINO）和掩码图像建模（iBOT），在 142M 图像上训练出通用密集视觉特征，无需标注即可作为各种视觉任务的即插即用特征提取器。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-07-21
created: 2026-06-12
updated: 2026-07-21
tier: core
created: 2026-07-11T00:00:00Z
updated: 2026-07-11T00:00:00Z
---

# DINOv2 — 自监督视觉特征学习

> **一句话理解**: DINOv2 不需要任何人工标签，仅通过自蒸馏和掩码重建，让 ViT 自己"看懂" 1.42 亿张图片，学出的特征比有监督预训练更好、更通用——它是视觉自监督学习的 SOTA 基石。

---

## 核心概念

DINOv2 是 Meta AI 在 2023 年发布的视觉基础模型（Oquab et al.）。它是第一代 DINO（Caron et al., ICCV 2021）的升级版，结合了两种自监督损失函数：**DINO 损失**（全局视图自蒸馏）和 **iBOT 损失**（掩码 Patch 建模），在大规模无标注图像数据集 LVD-142M 上训练。

### 核心要点

- **双重自监督目标**：DINO（图像级自蒸馏）+ iBOT（Patch 级掩码建模），同时学习全局语义和局部结构
- **无需标注**：在 142M 无标签图像上训练，学到通用密集特征
- **即插即用**：冻结 DINOv2 特征 + 简单线性头即可在分类、分割、深度估计等任务上达到 SOTA
- **教师-学生蒸馏**：教师网络是学生网络权重的指数移动平均（EMA），无需独立训练
- **多裁剪增强**：同一图像的多个裁剪视角（2 全局 + 4 局部）输入学生网络，仅全局视角输入教师

## 架构图

```mermaid
flowchart TB
    subgraph Data["数据增强"]
        I["输入图像"] --> G["全局视图 ×2\n224×224"]
        I --> L["局部视图 ×4\n96×96"]
        I --> GM["全局掩码视图 ×2\n带随机遮挡"]
    end

    subgraph Student["Student Network (可训练)"]
        G --> S1["ViT Encoder"]
        L --> S1
        GM --> S1
        S1 --> S2["Patch Tokens + CLS"]
    end

    subgraph Teacher["Teacher Network (EMA 更新)"]
        G --> T1["ViT Encoder (EMA)"]
        T1 --> T2["Patch Tokens + CLS"]
    end

    S2 -->|DINO Loss\nCLS 互信息| L1["跨视图自蒸馏"]
    T2 --> L1

    S2 -->|iBOT Loss\nPatch 重建| L2["掩码 Patch 建模"]
    T2 --> L2

    L1 --> LT["总损失"]
    L2 --> LT

    LT -->|"梯度反传"| S1
    T1 <-.|"EMA 权重更新"| S1
```

### 损失函数详解

**DINO 损失（图像级）**：
```
p_s = softmax(g_θs(x) / τ)    # 学生网络输出（带温度）
p_t = softmax(g_θt(x') / τ)   # 教师网络输出
L_DINO = -p_t · log(p_s)       # 交叉熵
```
教师网络的输出作为"伪标签"指导学生网络，教师的中心化（centering）防止模式坍缩。

**iBOT 损失（Patch 级）**：
```
对掩码位置 M 的 Patch:
p_s^patch = softmax(patch_s / τ)
p_t^patch = softmax(patch_t / τ)
L_iBOT = -Σ_{i∈M} p_t^patch_i · log(p_s^patch_i)
```
随机掩码部分 Patch，教师（也看到未掩码图像）的 Patch 输出作为目标。

**总损失**：`L = λ_DINO · L_DINO + λ_iBOT · L_iBOT`

## 详细内容

### 与第一代 DINO 的区别

| 特性 | DINO (2021) | DINOv2 (2023) |
|------|------------|---------------|
| 损失函数 | 仅 DINO（CLS 级） | DINO + iBOT（CLS + Patch） |
| 模型规模 | ViT-S/B | ViT-S/B/L/g |
| 训练数据 | ImageNet-1k (1.3M) | LVD-142M |
| 特征质量 | 全局特征优秀 | 全局 + 密集特征均优秀 |
| 密集任务 | 分割性能一般 | 分割、深度估计 SOTA |
| 高效训练 | 标准 ViT | Flash Attention、FSDP、序列打包 |

### LVD-142M 数据集

DINOv2 的成功很大程度上归功于精心筛选的大规模数据：

| 维度 | 详情 |
|------|------|
| 总图像数 | 142M |
| 来源 | 公开数据集（RedCaps、LAION 等）的去重子集 |
| 筛选方法 | 基于 DINO v1 特征聚类，保留多样化图像 |
| 与 ImageNet 重叠 | 已去重移除（确保下游评测公平） |
| 多样性策略 | 每个聚类保留均衡数量图像 |

### DINOv2 模型规格

| 模型 | 参数量 | 训练数据 | 特征维度 | 下游分类 acc |
|------|--------|---------|---------|------------|
| ViT-S/14 | 21M | 142M | 384 | 79.0% |
| ViT-B/14 | 86M | 142M | 768 | 84.5% |
| ViT-L/14 | 300M | 142M | 1024 | 86.7% |
| ViT-g/14 | 1.1B | 142M | 1536 | 86.9% |

### 注意力的语义涌现

DINO 的一个重要发现是**自注意力中语义信息的涌现**：在无标签训练下，ViT 的 [CLS] Token 注意力自动聚焦到图像中的前景主体上，效果类似有监督训练。这一现象在 DINOv2 中更加明显，使其注意力图可直接用于粗粒度分割。

### KoLeo 正则化与 Sinkhorn-Knopp

DINOv2 引入了两个额外的训练稳定技术：

| 技术 | 作用 | 公式 |
|------|------|------|
| **KoLeo 正则化** | 防止特征维度坍缩，促进均匀分布 | `L_koleo = -1/n Σ log(d(x_i, NN(x_i)))` |
| **Sinkhorn-Knopp** | 教师输出在 batch 内均衡分配，防止坍缩 | 迭代归一化使每类伪标签均匀 |

## 对比表格

### DINOv2 vs 其他自监督方法

| 方法 | 损失类型 | 密集特征质量 | 下游任务覆盖 | 数据规模需求 |
|------|---------|------------|------------|------------|
| SimCLR / MoCo | 对比学习（实例判别） | 中等 | 分类为主 | 中（1-10M） |
| **DINO** | 自蒸馏（CLS 级） | 中等 | 分类 | 中（1-10M） |
| **MAE** | 掩码重建（像素级） | 优秀 | 分类 + 密集 | 中（1-10M） |
| **DINOv2** | 自蒸馏 + 掩码建模 | **最优秀** | 全任务 SOTA | **大（142M）** |
| CLIP | 对比学习（图文） | 中等 | 分类（开放词表） | 超大（400M） |

### DINOv2 vs CLIP 特征

| 维度 | DINOv2 | CLIP |
|------|--------|------|
| 训练信号 | 视觉自监督 | 语言-视觉对比 |
| 需要配对数据 | 否 | 是（图文对） |
| 开放词表分类 | 否（需线性探针微调） | 是（零样本） |
| 密集特征质量 | **优秀**（分割 SOTA） | 中等 |
| 几何/结构理解 | **优秀**（深度估计 SOTA） | 弱 |
| 语义理解 | 较好 | **优秀** |

## AI 应用

- **特征提取基座**：替代 ImageNet 有监督预训练作为通用视觉编码器
- **密集预测**：语义分割、深度估计、法线估计（冻结特征 + 轻量头）
- **检索与匹配**：图像检索、视觉地点识别、视频帧匹配
- **医学影像**：零样本病理组织分割
- **3D 重建**：作为 DUSt3R / MASt3R 的特征提取骨干
- **多模态模型**：与 LLM 结合构建 VLM（如 LLaVA 系列的替代编码器）

## 开放问题

- DINOv2 缺乏语义对齐能力（不如 CLIP 的开放词表分类） ^[ambiguous]
- 超大模型（ViT-g）的训练成本极高，需数百 GPU-天
- 自监督特征的可解释性仍有提升空间
- 视频时序自监督（DINOv2 仅处理静态图像）尚待探索
- 域迁移（如自然图像 → 卫星图像）效果不稳定

## 来源

- 04_计算机视觉/Self_Supervised_Learning.md
- Caron et al., "Emerging Properties in Self-Supervised Vision Transformers" (DINO), ICCV 2021
- Oquab et al., "DINOv2: Learning Robust Visual Features without Supervision", TMLR 2024

## Related

- [[概念/Vision/vit]] — Vision Transformer (共享: vit, self-supervised)
- [[概念/Vision/clip]] — CLIP (共享: foundation-model, representation)
- [[概念/Vision/sam]] — Segment Anything Model (共享: foundation-model, dense-feature)
- [[概念/computer-vision]] — 计算机视觉 (共享: cv, deep-learning)
- [[概念/Vision/data-augmentation-cv]] — 数据增强 (共享: training, augmentation)

---

## 2026 DINO 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **DINOv2** | Meta 自监督视觉基础模型 | GA |
| **DINOv3** | 更大规模自监督训练 | 研究 |
| **密集特征** | 像素级特征提取 | GA |
| **下游任务** | 分割/深度/检测通用特征 | GA |
| **与 SAM 结合** | DINO 特征 + SAM 分割 | GA |

## 生产最佳实践

1. **特征提取**：用 DINOv2 作为通用视觉特征提取器
2. **微调策略**：下游任务用 Linear Probe 或 LoRA
3. **模型选择**：通用 ViT-L/14，精度优先 ViT-G/14
4. **与 CLIP 对比**：DINO 擅长密集特征，CLIP 擅长语义匹配
5. **计算资源**：大模型推理需 GPU，边缘设备用小模型
