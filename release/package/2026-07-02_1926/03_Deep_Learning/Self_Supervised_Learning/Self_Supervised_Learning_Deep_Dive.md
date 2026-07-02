---
title: "自监督学习深度解读: 从对比学习到掩码建模"
category: "03-deep-learning-self-supervised-learning"
tags: ["self-supervised-learning", "contrastive-learning", "SimCLR", "MoCo", "MAE", "BEiT", "BYOL", "masked-modeling"]
summary: "自监督学习是现代AI预训练的核心范式，通过构造预测任务从无标注数据中学习通用表示。"
created: 2026-06-04
updated: 2026-06-04
tier: supporting
aliases:
  - "Self Supervised Learning Deep Dive"
  - Self_Supervised_Learning_Deep_Dive
sources: []

---
# 自监督学习深度解读: 从对比学习到掩码建模

> **一句话理解**: 自监督学习是现代 AI 预训练的「免费午餐」——不需要人工标注，通过巧妙设计预测任务，让数据自己提供监督信号，从海量无标注数据中学习通用表示。

---

## 1. 概述 (Overview)

### 1.1 为什么需要自监督学习

```
AI 训练的三大范式:

┌──────────────┬──────────────────┬───────────────────────────────────┐
│  学习范式     │  数据需求         │  代表方法                         │
├──────────────┼──────────────────┼───────────────────────────────────┤
│  监督学习     │  人工标注 (贵!)   │  ImageNet 128万张, 每张 ~$0.1     │
│  无监督学习   │  无标注 (便宜)    │  K-Means, PCA, 聚类              │
│  自监督学习   │  无标注+构造任务  │  BERT, GPT, SimCLR, MAE          │
└──────────────┴──────────────────┴───────────────────────────────────┘

自监督 = 不需要标注，但比传统无监督学习目标更明确、表征更强
```

**核心洞见**：
- 互联网上标注数据稀缺，但**无标注数据近乎无穷**
- 自监督学习通过 **pretext task**（预测任务）从无标注数据中自动构造监督信号
- LLM（GPT/Claude）的成功本质上就是自监督学习的胜利

### 1.2 自监督学习的统一框架

```
自监督学习统一框架:

输入数据 x → [构造预测任务] → 模型 f_θ → [预测任务目标] → 损失 → 更新 θ
                   │
                   ├── 遮住左边，预测右边     (自回归: GPT)
                   ├── 遮住中间，重建中间     (掩码建模: BERT/MAE)
                   ├── 同一张图的两个增强应相似 (对比学习: SimCLR)
                   ├── 一个视图预测另一个视图  (非对比: BYOL/DINO)
                   └── 旋转90度、拼图、上色   (早期 pretext task)
```

---

## 2. 三大范式

### 2.1 范式总览

```
自监督学习
│
├── 生成式 (Generative)
│   ├── 掩码建模: BERT (NLP), MAE/BEiT (CV)
│   ├── 自回归: GPT (NLP), PixelCNN (CV)
│   └── 去噪自编码: DAE
│
├── 对比式 (Contrastive)
│   ├── 端到端: SimCLR
│   ├── 基于动量编码器: MoCo, MoCo v3
│   ├── 非对称架构: BYOL, SimSiam
│   └── 蒸馏式: DINO, DINOv2
│
└── 混合式 (Hybrid)
    ├── 对比 + 掩码: iBOT, data2vec v2
    └── 蒸馏 + 掩码: MAE + DINO
```

| 范式 | 核心思想 | 代表方法 | 优势 | 劣势 |
|------|----------|----------|------|------|
| **对比学习** | 正样本拉近，负样本推远 | SimCLR, MoCo | 线性探测性能好 | 需要大 batch/队列 |
| **掩码建模** | 遮住输入，重建原始内容 | BERT, MAE | 训练稳定，可扩展 | 微调性能有时不如对比 |
| **自回归** | 顺序预测下一个 token | GPT, PixelCNN | 生成能力强 | 单向，双向任务受限 |

---

## 3. 对比学习 (Contrastive Learning)

### 3.1 核心思想

```
对比学习核心:

                    ┌─ 数据增强 A ─→ 编码器 ─→ z_a ─┐
输入图像 x ─────────┤                                ├─ 正样本对 → 拉近
                    └─ 数据增强 B ─→ 编码器 ─→ z_b ─┘
                    
其他图像 x' ────────┬─ 数据增强 C ─→ 编码器 ─→ z_c ─┐
                    └─ 数据增强 D ─→ 编码器 ─→ z_d ─┴─ 负样本对 → 推远

损失函数: InfoNCE (NT-Xent)
L = -log [ exp(sim(z_a, z_b)/τ) / Σ exp(sim(z_a, z_k)/τ) ]
     ↑ 正样本相似度       ↑ 温度       ↑ 所有样本（正+负）
```

### 3.2 关键方法对比

| 方法 | 负样本来源 | 训练策略 | 创新点 |
|------|-----------|----------|--------|
| **SimCLR** (2020) | 同一 batch 内其他样本 | 端到端，大 batch (4096-8192) | 系统研究数据增强组合 |
| **MoCo** (2020) | 动量编码器维护的队列 | 队列存储历史负样本 | 解耦 batch size 与负样本数 |
| **BYOL** (2020) | 无需负样本 | 动量目标网络 + stop-gradient | 打破「必须负样本」的认知 |
| **SimSiam** (2021) | 无需负样本 | stop-gradient，无动量编码器 | 最简化的非对比方法 |
| **DINO** (2021) | 自蒸馏 | teacher-student 架构 | 视觉 Transformer 自监督突破 |
| **DINOv2** (2023) | 自蒸馏 + 大规模数据 | 142M 图像预训练 | CV 领域通用视觉特征 |

### 3.3 SimCLR 详解

**论文**: *A Simple Framework for Contrastive Learning of Visual Representations* (Chen et al., 2020)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SimCLR(nn.Module):
    def __init__(self, backbone, projection_dim=128, temperature=0.5):
        super().__init__()
        self.backbone = backbone          # ResNet-50
        self.projector = nn.Sequential(
            nn.Linear(2048, 2048), nn.ReLU(),
            nn.Linear(2048, projection_dim)
        )
        self.temperature = temperature
    
    def forward(self, x_i, x_j):
        """x_i, x_j: 同一图像的两个增强视图"""
        h_i, h_j = self.backbone(x_i), self.backbone(x_j)
        z_i = F.normalize(self.projector(h_i), dim=1)
        z_j = F.normalize(self.projector(h_j), dim=1)
        
        # NT-Xent 损失
        N = z_i.shape[0]
        z = torch.cat([z_i, z_j], dim=0)  # [2N, d]
        sim = torch.mm(z, z.T) / self.temperature
        
        # 正样本: (i, i+N) 和 (i+N, i)
        pos = torch.cat([
            torch.diag(sim, N), torch.diag(sim, -N)
        ], dim=0)  # [2N]
        
        # 负样本: 排除自身和正样本
        mask = torch.ones(2*N, 2*N, device=z.device).bool()
        mask.fill_diagonal_(False)
        mask[:N, N:].fill_diagonal_(False)
        mask[N:, :N].fill_diagonal_(False)
        neg = sim[mask].view(2*N, -1)
        
        logits = torch.cat([pos.unsqueeze(1), neg], dim=1)
        labels = torch.zeros(2*N, dtype=torch.long, device=z.device)
        return F.cross_entropy(logits, labels)
```

**SimCLR 的关键发现**：

| 因素 | 发现 | 影响 |
|------|------|------|
| **数据增强** | 随机裁剪 + 颜色抖动组合最有效 | 单一增强效果差 |
| **Batch Size** | 越大越好 (4096-8192) | 大 batch 提供更多负样本 |
| **投影头** | 非线性 MLP 投影头 | 比线性投影提升 3-10% |
| **温度 τ** | 0.5 附近最优 | 控制分布的锐度 |

### 3.4 MoCo: 动量对比

**核心创新**: 用**队列 (Queue)** 存储历史负样本，解耦 batch size 与负样本数量。

```
MoCo 架构:

编码器 f_q: 正常梯度更新
编码器 f_k: 动量更新 (不做梯度)
    f_k = m · f_k + (1-m) · f_q    (m=0.999)

队列 Q: 存储最近 K 个负样本的特征 (K=65536)

训练时:
  正样本: f_q(x_q) vs f_k(x_k)
  负样本: f_q(x_q) vs Q 中的 K 个历史特征
  更新 Q: 将 f_k(x_k) 入队，最旧的出队
```

| 对比 | SimCLR | MoCo |
|------|--------|------|
| **负样本数** | = batch_size - 1 | = queue_size (65536) |
| **GPU 需求** | 需要大 batch (8 GPU) | 小 batch 即可 (2 GPU) |
| **编码器更新** | 端到端 | 动量更新（更稳定） |

### 3.5 BYOL: 不需要负样本

**论文**: *Bootstrap Your Own Latent* (Grill et al., 2020)

**核心突破**: 打破「对比学习必须有负样本」的认知。

```
BYOL 架构:

在线网络 (online):
  x → 增强 → encoder_θ → projector_θ → predictor_φ → q

目标网络 (target, 动量更新):
  x → 另一个增强 → encoder_ξ → projector_ξ → t (stop-gradient)

损失: L = || q/||q|| - t/||t|| ||²    (余弦相似度)

ξ ← τ·ξ + (1-τ)·θ    (动量更新, τ≈0.996)
```

| 方法 | 负样本 | 动量编码器 | 关键机制 |
|------|--------|-----------|----------|
| SimCLR | 需要 | 不需要 | 大 batch 提供负样本 |
| MoCo | 需要 | 需要 | 队列存储负样本 |
| BYOL | **不需要** | 需要 | stop-gradient 防止崩塌 |
| SimSiam | **不需要** | **不需要** | stop-gradient（最简） |

---

## 4. 掩码建模 (Masked Modeling)

### 4.1 核心思想

```
掩码建模核心:

NLP: [The, cat, [MASK], on, the, mat] → 预测 [MASK] = "sat"
CV:  [█, █, 可见, █, 可见, █, █, 可见, ...]  (75% 遮盖) → 重建遮盖像素

关键: 模型必须学习数据的深层语义才能完成预测任务
```

### 4.2 NLP 中的掩码建模

| 模型 | 掩码策略 | 预测目标 | 特点 |
|------|----------|----------|------|
| **BERT** (2018) | 15% token 掩码 | 分类重建 | 双向上下文 |
| **RoBERTa** (2019) | 动态掩码 | 同 BERT | 移除 NSP，更多数据 |
| **T5** (2020) | Span 掩码 | 文本到文本 | 统一所有 NLP 任务 |
| **ELECTRA** (2020) | 替换检测 | 判断 token 是否被替换 | 更高效 |

### 4.3 CV 中的掩码建模: MAE

**论文**: *Masked Autoencoders Are Scalable Vision Learners* (He et al., 2022)

```
MAE 架构:

输入图像 (224x224, 196 个 patches)
    │
    ├── 随机遮盖 75% patches (仅保留 49 个可见 patch)
    │
    ├── 可见 patches → ViT 编码器 → 编码特征
    │
    ├── 编码特征 + 可学习的 mask tokens → 解码器
    │
    └── 解码器输出 → 重建被遮盖的像素 (MSE loss)
    
关键设计:
1. 高遮盖率 (75%) → 迫使模型理解全局语义
2. 非对称编码器-解码器 → 编码器只处理可见patches，加速75%
3. 像素级重建 (非token级) → 比分类重建更好
```

```python
class MaskedAutoencoder(nn.Module):
    def __init__(self, img_size=224, patch_size=16, mask_ratio=0.75,
                 encoder_dim=768, decoder_dim=512):
        super().__init__()
        self.patch_embed = PatchEmbed(img_size, patch_size, 3, encoder_dim)
        self.num_patches = (img_size // patch_size) ** 2  # 196
        self.encoder = TransformerEncoder(encoder_dim, depth=12)
        self.mask_token = nn.Parameter(torch.zeros(1, 1, decoder_dim))
        self.decoder = TransformerDecoder(decoder_dim, depth=8)
        self.decoder_pred = nn.Linear(decoder_dim, patch_size**2 * 3)
        self.mask_ratio = mask_ratio
    
    def forward(self, x):
        B = x.shape[0]
        patches = self.patch_embed(x)  # [B, 196, D]
        
        # 随机遮盖
        num_keep = int(self.num_patches * (1 - self.mask_ratio))
        noise = torch.rand(B, self.num_patches, device=x.device)
        ids_keep = noise.argsort(dim=1)[:, :num_keep]
        
        # 仅编码可见 patches
        visible = torch.gather(patches, 1,
            ids_keep.unsqueeze(-1).expand(-1, -1, patches.shape[-1]))
        encoded = self.encoder(visible)
        
        # 解码: 拼接 mask tokens 并恢复顺序
        mask_tokens = self.mask_token.repeat(B,
            self.num_patches - num_keep, 1)
        decoder_input = torch.cat([encoded, mask_tokens], dim=1)
        ids_restore = noise.argsort(dim=1)
        decoder_input = torch.gather(decoder_input, 1,
            ids_restore.unsqueeze(-1).expand(-1, -1, decoder_input.shape[-1]))
        
        pred = self.decoder_pred(self.decoder(decoder_input))
        
        # 仅计算遮盖部分的 MSE loss
        target = self.patchify(x)
        loss = ((pred - target) ** 2).mean(dim=-1)
        return loss[:, num_keep:].mean()
```

### 4.4 MAE vs BEiT vs SimMIM

| 方法 | 遮盖率 | 重建目标 | 编码器 | 创新点 |
|------|--------|----------|--------|--------|
| **MAE** (He 2022) | 75% | 像素级 (MSE) | ViT | 非对称架构 |
| **BEiT** (Bao 2022) | 40% | 离散视觉 token | ViT | 类似 BERT 的分类损失 |
| **SimMIM** (Xie 2022) | 60% | 像素级 (L1) | Swin | 更简单 |
| **data2vec v2** (2022) | 变化 | 教师隐藏表征 | 多模态 | 统一视觉/语音/文本 |
| **iBOT** (Zhou 2022) | 50% | 自蒸馏+掩码 | ViT | 对比+掩码混合 |

---

## 5. 自蒸馏: DINO / DINOv2

### 5.1 DINO 架构

```
DINO (Self-Distillation with No Labels):

Student 网络 (可学习):
  x → 局部增强 (小裁剪) → student_encoder → student_head → s

Teacher 网络 (EMA 动量更新):
  x → 全局增强 (大裁剪) → teacher_encoder → teacher_head → t (stop-grad)

损失: L = -Σ t·log(s/τ_s)    (交叉熵)
       teacher 使用更高温度 τ_t → 更平滑的分布

关键:
- 只使用正样本，无需负样本
- Teacher 看到全局视图，Student 只看局部
- Student 被迫学习全局语义来预测局部→全局的关系
```

### 5.2 DINOv2 (2023)

| 特性 | 说明 |
|------|------|
| **数据规模** | 142M 图像，自动数据管理 pipeline |
| **模型规模** | ViT-g (1.1B 参数) |
| **ImageNet 线性探测** | 86.5%，接近有监督 SOTA |
| **核心贡献** | CV 领域最通用的视觉特征提取器 |

---

## 6. 自监督学习在 LLM 中的体现

### 6.1 LLM 预训练 = 自监督学习的极致

```
LLM 的自监督任务:

┌──────────────┬──────────────────────┬────────────────────────────┐
│  方法         │  预测任务              │  代表模型                  │
├──────────────┼──────────────────────┼────────────────────────────┤
│  自回归       │  预测下一个 token      │  GPT, LLaMA, Claude       │
│  掩码语言模型 │  预测被遮住的token     │  BERT, RoBERTa            │
│  Span 预测   │  预测连续文本片段       │  T5, FLAN-T5              │
│  替换检测     │  判断token是否被替换   │  ELECTRA                  │
│  去噪        │  重建被破坏的输入       │  T5 (prefix denoise)      │
└──────────────┴──────────────────────┴────────────────────────────┘
```

### 6.2 自回归 vs 掩码 vs Span

| 维度 | 自回归 (GPT) | 掩码 (BERT) | Span (T5) |
|------|-------------|-------------|-----------|
| **方向** | 单向 (左→右) | 双向 | 双向 |
| **目标** | 下一个 token | 被遮 token | 连续片段 |
| **生成能力** | 强 | 弱 | 中等 |
| **理解能力** | 弱于双向 | 强 | 强 |
| **规模扩展** | 极好 | 好 | 好 |
| **主流用途** | LLM 预训练 | 编码器微调 | Seq2Seq 微调 |

---

## 7. 早期 Pretext Tasks (历史回顾)

| 任务 | 方法 | 年份 | 下游效果 |
|------|------|------|----------|
| **旋转预测** | 预测图像旋转角度 (0/90/180/270) | 2018 | 中等 |
| **拼图** | 预测 patch 的排列顺序 | 2016 | 中等 |
| **着色** | 灰度图→彩色图 | 2016 | 视觉特征迁移 |
| **上下文预测** | 根据周围 patch 预测中心 patch | 2017 | 中等 |
| **对比预测编码 (CPC)** | 自回归预测未来帧 | 2018 | 语音/视觉 |

> 这些方法已被对比学习和掩码建模全面超越，但奠定了自监督学习的思想基础。

---

## 8. 自监督学习的理论理解

### 8.1 为什么自监督有效？

| 理论视角 | 解释 | 关键论文 |
|----------|------|----------|
| **信息论** | 自监督最大化了输入和表示之间的互信息 | Hjelm et al. 2019 |
| **数据增强不变性** | 学习对增强不变的语义特征 | Tian et al. 2020 |
| **隐式聚类** | 对比学习隐式地聚类了特征空间 | Caron et al. 2020 |
| **谱图理论** | 对比学习等价于图上的谱分解 | HaoChen et al. 2021 |
| **预测编码** | 预测任务迫使模型学习生成模型 | Bachman et al. 2019 |

### 8.2 表征质量评估

| 评估方法 | 说明 | 优点 |
|----------|------|------|
| **线性探测** | 冻结编码器，训练线性分类器 | 标准基准 |
| **KNN 分类** | 用最近邻分类评估特征空间 | 无需训练 |
| **微调** | 在下游任务上全量微调 | 实际性能上限 |
| **少样本学习** | 少量标注样本评估迁移能力 | 数据效率测试 |

---

## 9. 局限与开放问题

1. **计算代价**: SimCLR 需要大 batch，MAE 需要大量 epochs (400-1600)
2. **数据增强设计**: 不同模态需要不同的增强策略，缺乏统一方法论
3. **崩塌问题**: BYOL/SimSiam 存在模型崩塌风险（输出常量化）
4. **理论理解**: 为什么某些 pretext task 比其他的更好，仍缺乏完整理论
5. **跨模态统一**: 如何在统一框架下处理视觉/语言/音频等多模态
6. **效率**: 自监督预训练通常需要数百个 GPU-days

---

## 10. 工程实践

| 关注点 | 建议 |
|--------|------|
| **范式选择** | NLP → 自回归/掩码; CV → 对比(线性)或掩码(微调); 多模态 → 混合 |
| **CV 通用特征** | 使用 DINOv2 预训练权重，开箱即用 |
| **训练效率** | MoCo 系列适合资源有限场景，BYOL 无需负样本 |
| **遮盖率调参** | MAE: 75% 最优; BERT: 15% 最优; 任务不同，最优遮盖率不同 |
| **投影头** | 始终使用非线性 MLP 投影头，不要直接对比编码器输出 |

---

## References

- Chen et al., "A Simple Framework for Contrastive Learning" (SimCLR, 2020)
- He et al., "Momentum Contrast for Unsupervised Visual Representation Learning" (MoCo, 2020)
- Grill et al., "Bootstrap Your Own Latent" (BYOL, 2020)
- Caron et al., "Emerging Properties in Self-Supervised Vision Transformers" (DINO, 2021)
- He et al., "Masked Autoencoders Are Scalable Vision Learners" (MAE, 2022)
- Oquab et al., "DINOv2: Learning Robust Visual Features without Supervision" (2023)
- Bao et al., "BEiT: BERT Pre-Training of Image Transformers" (2022)
