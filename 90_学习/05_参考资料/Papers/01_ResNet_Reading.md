---
title: "论文导读: Deep Residual Learning (ResNet)"
category: "-references-papers"
tags:
  - paper
  - reading-guide
  - resnet
  - cnn
  - deep-learning
  - he
  - microsoft
  - residual-connection
  - foundational
summary: "He et al. (2015)《Deep Residual Learning for Image Recognition》论文导读 — 提出 ResNet 与残差连接，解决深度网络退化问题，使训练上百层的网络成为可能，是深度学习最重要的架构创新之一。"
sources:
  - "https://arxiv.org/abs/1512.03385"
  - "https://openaccess.thecvf.com/content_cvpr_2016/html/He_Deep_Residual_Learning_CVPR_2016_paper.html"
created: 2026-07-23
updated: 2026-07-23
lifecycle: reviewed
tier: supporting
aliases:
  - "ResNet Paper"
  - "Deep Residual Learning"

name_zh: "论文导读"
---
# 论文导读: Deep Residual Learning for Image Recognition (ResNet)

> 中文简称：论文导读

> **一句话理解**: 何恺明等人 2015 年提出的 ResNet，用一个简单的"残差连接（shortcut）"解决了深层网络无法训练的退化问题，让网络深度从 22 层（VGG）跃升到 152 层甚至上千层，横扫 ImageNet——这是深度学习历史上最具影响力的架构创新之一，其残差思想后来被 Transformer 等几乎所有现代架构采纳。

## 论文背景

### 历史脉络

2012 年 AlexNet 在 ImageNet 上的胜利开启了深度学习时代。此后，**更深的网络 = 更好的性能** 成为社区共识：

- **AlexNet (2012)**: 8 层
- **VGG (2014)**: 19 层
- **GoogLeNet/Inception (2014)**: 22 层

人们自然期望：网络越深，表达能力越强，性能越好。但实践中发现一个**反直觉的现象**：

### 退化问题（Degradation Problem）

当网络加深到一定层数后：
- **不是过拟合**（训练误差也高）
- **不是梯度消失**（已用 BatchNorm 缓解）
- 而是**网络退化**——更深的网络反而有更高的训练误差和测试误差

这意味着深层网络至少应该能通过"恒等映射"退化为浅层网络（把多余层学成恒等函数即可），但常规网络的优化难度使其无法学到这个简单的恒等映射。

### 要解决的问题

如何让网络"容易地"学到恒等映射（或接近恒等），从而支持训练极深的网络？

### 作者与机构

- **作者**: Kaiming He（何恺明）, Xiangyu Zhang, Shaoqing Ren, Jian Sun
- **机构**: Microsoft Research Asia (MSRA)
- **发表**: CVPR 2016（Best Paper）
- **关键词**: Residual Learning、Deep Network、ImageNet、Shortcut Connection

## 核心贡献

1. **提出残差学习框架**: 让网络学习残差映射 F(x) = H(x) - x，而非直接学习 H(x)
2. **残差连接（Shortcut / Skip Connection）**: 跳过若干层把输入直接加到输出，实现 F(x) + x
3. **突破深度极限**: 成功训练 152 层网络（比 VGG 深 8 倍），甚至尝试 1000+ 层
4. **ImageNet 横扫**: 2015 年 ImageNet 竞赛冠军，错误率从 VGG 的 7.3% 降到 3.57%（超越人类）
5. **通用性**: 残差思想被后续几乎所有深度架构（Transformer、BERT、GPT）采纳

## 关键技术详解

### 1. 核心洞察：学习残差而非完整映射

**问题陈述**: 假设我们期望某几层学到映射 H(x)。如果理想映射接近恒等（H(x) ≈ x），那么让网络直接学 H(x) 很难。

**ResNet 的解法**: 改为学习**残差** F(x) = H(x) - x。于是原始映射变为 H(x) = F(x) + x。

- 如果最优映射接近恒等，残差 F(x) 应接近 0
- 把网络推向"零"比推向"恒等"更容易（权重趋近 0 即可）
- 这让深层网络至少不会比浅层差（多余的残差块可以"什么都不做"）

### 2. 残差块（Residual Block）

```
        x (输入)
        │
        ├────────────────────┐ (shortcut / skip connection)
        │                    │
        ↓                    │
   Conv → BN → ReLU          │
        │                    │
   Conv → BN                 │
        │                    │
        ↓                    │
        + ←──────────────────┘ (逐元素相加)
        │
       ReLU
        │
        ↓
      H(x) = F(x) + x (输出)
```

- 两条路径: 主路径做卷积变换 F(x)，shortcut 直接传 x
- 输出 = F(x) + x
- shortcut 不增加参数和计算复杂度
- 当输入输出维度不同（如通道数变化），shortcut 用 1×1 卷积投影对齐

### 3. 网络架构（ResNet-50 为例）

| 层名 | 输出尺寸 | 结构 |
|------|---------|------|
| conv1 | 112×112 | 7×7, 64, stride 2 |
| pool1 | 56×56 | 3×3 max pool, stride 2 |
| conv2_x | 56×56 | 1×1,64 → 3×3,64 → 1×1,256 × 3 个 bottleneck |
| conv3_x | 28×28 | 1×1,128 → 3×3,128 → 1×1,512 × 4 个 |
| conv4_x | 14×14 | 1×1,256 → 3×3,256 → 1×1,1024 × 6 个 |
| conv5_x | 7×7 | 1×1,512 → 3×3,512 → 1×1,2048 × 3 个 |
| avg pool | 1×1 | 全局平均池化 |
| fc | 1 | 1000 类 softmax |

- **Bottleneck 设计**: 用 1×1 卷积降维 → 3×3 卷积 → 1×1 升维，减少计算量
- **总层数**: 50 层（还有 18/34/101/152 变体）

### 4. 为什么残差连接有效？（理论解释）

社区对残差有效性有多种解释：

- **优化视角**: 残差连接提供了梯度的一条"高速公路"，梯度可以直接流回浅层，缓解梯度消失（类似 Highway Networks 但更简洁）
- **恒等映射视角**: 让网络容易表达恒等映射，深层网络不会比浅层差
- **集成视角**: 一个 N 层的 ResNet 可视为 2^N 个不同深度路径的集成（Veit et al., 2016）
- **平滑性视角**: 残差函数对应的损失景观更平滑，优化更容易（Li et al., 2018）

## 实验结果

### ImageNet 分类（2015）

| 模型 | 层数 | Top-5 错误率 | 备注 |
|------|------|-------------|------|
| VGG | 19 | 7.32% | 2014 SOTA |
| GoogLeNet | 22 | 6.67% | 2014 |
| **ResNet-152** | 152 | **3.57%** | 2015 冠军，超越人类（~5%） |

**关键发现**: 网络越深，错误率越低——退化问题被残差连接解决。

### 退化问题的验证

论文做了一个关键对照实验：
- **Plain 网络**（无残差）: 34 层比 18 层训练误差更高（退化）
- **ResNet**（有残差）: 34 层比 18 层训练误差更低（正常）

这直接证明残差连接解决了退化问题。

### 目标检测（PASCAL VOC / COCO）

ResNet 作为骨干网络，在目标检测任务上也大幅超越 VGG 基线，证明了特征的迁移能力。

### 极深网络实验

论文还尝试了 1000+ 层的网络，虽然在 ImageNet 上略有过拟合，但证明了残差框架理论上支持任意深度。

## 影响与后续

### 直接影响

- **2015 ImageNet 三冠王**: 分类、检测、定位全部第一
- **骨干网络标准**: ResNet 成为后续多年 CV 任务的默认骨干（直到 ViT 出现）
- **何恺明后续工作**: 他随后提出 Mask R-CNN、MoCo 等，成为 CV 领域最高引用作者之一

### 残差思想的扩散

残差连接是**通用的深度学习组件**，被几乎所有后续架构采纳：
- **Transformer**（2017）: 每个 Attention/FFN 块都用 Add & Norm（残差 + LayerNorm），详见 [[90_学习/05_参考资料/Papers/04_注意力_Is_All_You_Need_Reading]]
- **BERT / GPT**: 全程使用残差连接
- **U-Net**: 用于图像分割的跳跃连接
- **DenseNet**: 更激进的密集连接

可以说，没有 ResNet 的残差思想，就没有能训练上百层的 Transformer，也就没有今天的大模型。

### 网络架构演进

| 架构 | 年份 | 关键创新 |
|------|------|---------|
| ResNet | 2015 | 残差连接 |
| DenseNet | 2017 | 密集连接（每层连接所有后续层） |
| EfficientNet | 2019 | 复合缩放 |
| ViT | 2020 | Transformer 用于视觉 |

## 批判性思考

### 论文的局限

1. **理论解释不足**: 论文主要从实验验证，对"为什么有效"的理论分析较浅（后来社区补充了多种解释）
2. **计算效率**: 152 层网络参数量大、计算重，移动端部署困难（催生了 MobileNet 等轻量化工作）
3. **仅限视觉验证**: 原始论文只在 CV 任务验证，跨领域通用性是后来才被证明的
4. **过深网络仍有过拟合**: 1000+ 层在 ImageNet 上并未持续提升

### 常见误解

| 误解 | 澄清 |
|------|------|
| "残差连接 = 跳过层" | 它是"加上输入"，不是"跳过计算"；主路径仍做变换 |
| "ResNet 解决了梯度消失" | 这是部分原因，但论文强调的是解决"退化问题"，两者不同 |
| "越深越好" | 过深会过拟合且计算昂贵；残差让"能训练深"，但不等于"越深越好" |
| "残差块很复杂" | 实际极其简单——就是一条加法捷径 |

### 开放问题

- 残差网络的最优深度是否有理论上限？
- 残差连接能否被更优雅的机制替代？
- 在 Transformer 中，残差连接的作用与 CNN 中是否完全一致？

## 残差连接的数学推导

**核心公式**:
```
H(x) = F(x) + x
```
其中：
- `x` 是该层的输入（identity / 恒等映射）
- `F(x)` 是残差网络要学习的"残差" = H(x) - x
- `H(x)` 是期望的输出

**为什么叫"残差"？** 网络不直接学 H(x)，而是学 F(x) = H(x) - x（即"在恒等基础上要加多少"）。

**为什么有效？梯度反传视角**:
```
∂L/∂x = ∂L/∂H(x) · (∂F(x)/∂x + 1)
                                ↑
                    这个 "+1" 让梯度可以直接回流，不经过 F
```
即使 F 的梯度极小，"+1" 也能保证梯度顺利传到浅层，解决梯度消失。

## 退化问题（Degradation）vs 过拟合

**关键区分**:
- **过拟合**: 训练误差低 + 测试误差高
- **退化问题**: 训练误差随网络加深而**升高**（不是过拟合！）

**实验证据**: 论文图 1 显示 56 层网络的训练误差和测试误差都高于 20 层网络。这说明深层网络的**优化困难**，不是表达能力问题。

**思想实验**: 理论上一个 56 层网络可以退化成 20 层网络（后 36 层做恒等映射），所以 56 层的最优解至少不会比 20 层差。但 SGD 找不到这个解——残差连接让"恒等映射"成为容易学的默认解。

## 残差块的变体演进

| 变体 | 结构 | 特点 |
|------|------|------|
| 原始 ResNet Block | Conv-BN-ReLU-Conv-BN + shortcut | 两层卷积 |
| Bottleneck Block | 1×1 → 3×3 → 1×1 | 降维再升维，省计算 |
| ResNeXt | 分组卷积的 Bottleneck | 引入"基数"（cardinality）|
| DenseNet | 每层连接到所有后续层 | 特征复用 |
| Pre-activation | BN-ReLU-Conv 顺序 | 训练更稳定 |

**Bottleneck 设计**: 先用 1×1 卷积降维（256→64），3×3 卷积处理，再用 1×1 升维（64→256）。大幅降低参数量，让 50/101/152 层网络可行。

## 不同深度 ResNet 的架构

| 网络 | 层数 | 参数量 | Top-5 错误率 |
|------|------|--------|-------------|
| ResNet-18 | 18 | 11.7M | 10.92% |
| ResNet-34 | 34 | 21.8M | 8.58% |
| ResNet-50 | 50 | 25.6M | 7.13% |
| ResNet-101 | 101 | 44.5M | 6.44% |
| ResNet-152 | 152 | 60.2M | 5.71% |

**观察**: 从 50 层开始用 Bottleneck Block；152 层仍未明显过拟合——残差连接的威力。

## ImageNet 实验的关键数据

**ImageNet 2015 分类（Top-5 错误率）**:
- VGG（2014）: 7.3%
- GoogLeNet（2014）: 6.7%
- **ResNet（2015）: 3.57%** ← 首次超越人类（~5%）

**集成 6 个模型**: 3.57% → 3.57%（论文报告）

**COCO 目标检测**: 相比 VGG，mAP 提升约 28%，彻底改变了检测/分割领域。

## 代码实现要点（PyTorch 伪代码）

```python
class BasicBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        self.conv1 = nn.Conv2d(in_ch, out_ch, 3, stride, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(out_ch)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3, 1, 1, bias=False)
        self.bn2 = nn.BatchNorm2d(out_ch)
        # shortcut: 若通道/尺寸变化，用 1×1 卷积调整
        self.shortcut = nn.Sequential()
        if stride != 1 or in_ch != out_ch:
            self.shortcut = nn.Sequential(
                nn.Conv2d(in_ch, out_ch, 1, stride, bias=False),
                nn.BatchNorm2d(out_ch))

    def forward(self, x):
        out = F.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out = out + self.shortcut(x)   # 残差连接：相加
        return F.relu(out)
```

## 残差思想在其他架构中的体现

- **Transformer**: 每个 Block 都是 `x + Sublayer(LN(x))`，残差连接让深堆叠成为可能
- **U-Net**: 跨层的 skip connection 也是残差思想的延伸
- **Diffusion Model**: U-Net 中的残差块
- **Modern CNN**: ConvNeXt、EfficientNet 都依赖残差连接

**总结**: 残差连接是深度学习的"基础设施"之一，影响远超 CNN 领域。

## 与知识库其他内容的连接

- [[90_学习/01_概念认知/03_stage1_foundation|深度学习基础]] — 概念分阶
- [[90_学习/05_参考资料/Papers/04_注意力_Is_All_You_Need_Reading|Transformer]] — 残差连接在新架构中的应用
- [[90_学习/05_参考资料/books/07_hands_on_ml_geron|Hands-On ML]] — 第 14 章 CNN 详解
- [[04_计算机视觉/]] — ResNet 是 CV 的基石
- [[90_学习/01_概念认知/02_stage0_awakening|Stage 0]] — AI 的第三次浪潮起点

## 如何精读这篇论文

### 推荐阅读顺序

1. **Abstract + Introduction**: 理解退化问题与残差动机
2. **Section 3 残差学习**: 核心思想，结合图 2 理解残差块
3. **Section 3.3 网络架构**: 对比 Plain 与 ResNet 架构（图 3/4/5）
4. **Section 4 实验**: 重点看图 1（退化问题对照）和 ImageNet 结果表
5. **附录**: 极深网络实验

### 配套资源

- **代码实现**: PyTorch torchvision 中的 `resnet50` 等
- **可视化**: 理解残差块的数据流图
- **动手**: 用 [[90_学习/05_参考资料/books/07_hands_on_ml_geron|Hands-On ML]] Ch 14 的 CNN 章节实践

### 动手验证

- 用 PyTorch 定义一个 Residual Block，对比有/无残差连接时深网络的训练曲线
- 在 CIFAR-10 上训练 20 层 vs 56 层 Plain 网络，观察退化现象

## 延伸阅读

- [[90_学习/05_参考资料/Papers/04_注意力_Is_All_You_Need_Reading|Attention Is All You Need]] — 残差思想在 Transformer 中的应用
- [[90_学习/05_参考资料/Papers/03_BERT_Reading|BERT]] — 残差在编码器中的应用
- [[90_学习/05_参考资料/Papers/02_GPT3_Reading|GPT-3]] — 残差在解码器中的应用
- [[90_学习/05_参考资料/books/07_hands_on_ml_geron|Hands-On ML]] Ch 14 — CNN 实战
- [[04_计算机视觉/]] — 知识库 CV 章节
- [[03_深度学习/]] — 深度学习章节
- [[90_学习/01_概念认知/04_stage2_core_tech|Stage 2: 核心技术]] — CNN 在学习路径中的位置

> **关联**: → [[90_学习/05_参考资料/Projects/01_papers_with_code]] | [[90_学习/05_参考资料/Papers/04_注意力_Is_All_You_Need_Reading|Transformer]] | [[04_计算机视觉/]] | [[03_深度学习/]] | [[90_学习/05_参考资料/books/07_hands_on_ml_geron|Hands-On ML]]
