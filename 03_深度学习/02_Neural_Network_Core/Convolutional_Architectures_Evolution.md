---
title: "卷积架构演进 (Convolutional Architectures Evolution)"
category: 03-deep-learning-neural-network-core
tags: ["deep-learning", "cnn", "convolution", "resnet", "efficientnet", "convnext", "mobilenet", "vision-transformer"]
summary: "从 LeNet 到 ConvNeXt，系统梳理卷积神经网络 30 年架构演进，解析残差连接、深度可分离卷积等核心创新，分析 Vision Transformer 对 CNN 的挑战与 2026 年 CNN 复兴。"
created: 2026-07-19
updated: 2026-07-19
tier: core
aliases:
  - "Convolutional Architectures"
  - "CNN Evolution"
  - Conv_Architectures
sources: []

name_zh: "卷积架构演进"
---
# 卷积架构演进 (Convolutional Architectures Evolution)

> 中文简称：卷积架构演进

> 从 LeNet 到 ConvNeXt，三十年卷积神经网络架构设计的智慧积累与现代复兴。

---

## 1. 概述 (Overview)

卷积神经网络 (Convolutional Neural Network, CNN) 是深度学习革命的起点。从 1998 年 LeNet 的手写数字识别，到 2012 年 AlexNet 引爆深度学习浪潮，再到 2022 年 ConvNeXt 证明 CNN 并未被 Transformer 淘汰——卷积架构经历了持续 30 年的演进。

### CNN 的核心归纳偏置

```
1. 局部性 (Locality): 每个卷积核只看局部区域
   - 假设: 相邻像素比远处像素更相关
   
2. 平移等变性 (Translation Equivariance): 
   - Conv(Shift(x)) = Shift(Conv(x))
   - 物体在图像中移动不影响检测
   
3. 权重共享 (Weight Sharing):
   - 同一个卷积核扫描所有位置
   - 大幅减少参数量
   
4. 层次性 (Hierarchy):
   - 浅层: 边缘、纹理
   - 深层: 部件、物体
```

### 架构演进时间线

```
1998: LeNet-5 (LeCun) — 5层, 手写数字
2012: AlexNet (Krizhevsky) — 8层, GPU训练, ReLU, Dropout
2014: VGGNet (Simonyan) — 16/19层, 3×3堆叠
2014: GoogLeNet/Inception — 多尺度并行
2015: ResNet (He) — 152层, 残差连接 ← 里程碑
2017: DenseNet (Huang) — 密集连接
2017: MobileNet (Howard) — 深度可分离卷积
2019: EfficientNet (Tan) — 复合缩放 + NAS
2020: RegNet (Radosavovic) — 设计空间工程
2020: ViT (Dosovitskiy) — Vision Transformer 挑战 CNN
2022: ConvNeXt (Liu) — CNN 现代化改造
2023: ConvNeXt V2 — GRN + 自监督
2024: EfficientNetV2, MobileNetV4
2025-26: CNN + SSM 混合, 局部注意力 CNN
```

---

## 2. 核心原理 (Core Principles)

### 2.1 卷积运算的数学定义

2D 离散卷积:

```
(I * K)[i, j] = Σ_m Σ_n I[i-m, j-n] · K[m, n]

其中:
  I: 输入特征图 (H × W × C_in)
  K: 卷积核 (k × k × C_in × C_out)
  输出: (H' × W' × C_out)
  
  H' = (H + 2p - k) / s + 1
  W' = (W + 2p - k) / s + 1
  
  p: padding, s: stride, k: kernel size
```

**参数量与计算量**:
```
参数量 = k × k × C_in × C_out + C_out (bias)
FLOPs = H' × W' × k × k × C_in × C_out × 2 (乘加)
```

### 2.2 残差连接 (Residual Connection)

**论文**: He et al., "Deep Residual Learning for Image Recognition", CVPR 2016 (Best Paper)

**核心公式**:
```
y = F(x, {W_i}) + x

其中:
  x: 输入 (恒等映射路径)
  F(x, {W_i}): 残差函数 (学习的变换)
  y: 输出

如果最优映射接近恒等: F(x) → 0 (比学习 H(x)=x 更容易)
```

**为什么残差连接有效？**

梯度流分析:
```
∂L/∂x_l = ∂L/∂x_L · ∂x_L/∂x_l
         = ∂L/∂x_L · Π_{k=l}^{L-1} (1 + ∂F_k/∂x_k)
                                    ↑
                          恒等项保证梯度至少为 1
                          (不会消失)
```

**ResNet 的 Bottleneck 设计**:
```
标准 ResBlock (ResNet-34):
  x → [3×3 Conv → BN → ReLU → 3×3 Conv → BN] → (+x) → ReLU

Bottleneck ResBlock (ResNet-50/101/152):
  x → [1×1 Conv → BN → ReLU → 3×3 Conv → BN → ReLU → 1×1 Conv → BN] → (+x) → ReLU
       ↓ 降维 (256→64)    ↓ 空间卷积              ↓ 升维 (64→256)
       
  参数减少: 256×256×3×3 → 256×64×1×1 + 64×64×3×3 + 64×256×1×1
```

```python
class BottleneckBlock(nn.Module):
    """ResNet Bottleneck Block"""
    expansion = 4
    
    def __init__(self, in_channels, mid_channels, stride=1, downsample=None):
        super().__init__()
        out_channels = mid_channels * self.expansion
        
        self.conv1 = nn.Conv2d(in_channels, mid_channels, 1, bias=False)
        self.bn1 = nn.BatchNorm2d(mid_channels)
        
        self.conv2 = nn.Conv2d(mid_channels, mid_channels, 3, 
                               stride=stride, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(mid_channels)
        
        self.conv3 = nn.Conv2d(mid_channels, out_channels, 1, bias=False)
        self.bn3 = nn.BatchNorm2d(out_channels)
        
        self.relu = nn.ReLU(inplace=True)
        self.downsample = downsample
    
    def forward(self, x):
        identity = x
        
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.relu(self.bn2(self.conv2(out)))
        out = self.bn3(self.conv3(out))
        
        if self.downsample is not None:
            identity = self.downsample(x)
        
        out += identity
        out = self.relu(out)
        return out
```

### 2.3 深度可分离卷积 (Depthwise Separable Convolution)

**论文**: Howard et al., "MobileNets: Efficient Convolutional Neural Networks for Mobile Vision Applications", 2017

**核心思想**: 将标准卷积分解为两步

```
标准卷积: (k × k × C_in × C_out)
  一步完成空间+通道混合

深度可分离卷积:
  Step 1 - Depthwise: (k × k × 1 × C_in) — 每通道独立空间卷积
  Step 2 - Pointwise: (1 × 1 × C_in × C_out) — 通道混合

参数量对比:
  标准: k² × C_in × C_out
  可分离: k² × C_in + C_in × C_out = C_in × (k² + C_out)
  
  比值: 1/C_out + 1/k² ≈ 1/9 (对于 3×3, C_out=256)
  即参数量减少约 8-9 倍!
```

```python
class DepthwiseSeparableConv(nn.Module):
    """深度可分离卷积"""
    
    def __init__(self, in_channels, out_channels, kernel_size=3, stride=1):
        super().__init__()
        padding = kernel_size // 2
        
        # Depthwise: 每通道独立卷积
        self.depthwise = nn.Conv2d(
            in_channels, in_channels, kernel_size,
            stride=stride, padding=padding,
            groups=in_channels,  # 关键: groups = in_channels
            bias=False
        )
        self.bn1 = nn.BatchNorm2d(in_channels)
        
        # Pointwise: 1×1 卷积混合通道
        self.pointwise = nn.Conv2d(
            in_channels, out_channels, 1, bias=False
        )
        self.bn2 = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU6(inplace=True)
    
    def forward(self, x):
        x = self.relu(self.bn1(self.depthwise(x)))
        x = self.relu(self.bn2(self.pointwise(x)))
        return x
```

### 2.4 倒残差块 (Inverted Residual Block)

**论文**: Sandler et al., "MobileNetV2: Inverted Residuals and Linear Bottlenecks", CVPR 2018

```
标准 Bottleneck (ResNet): 宽 → 窄 → 宽
  256 → 64 → 256 (先压缩再扩展)

Inverted Residual (MobileNetV2): 窄 → 宽 → 窄
  24 → 144 → 24 (先扩展再压缩)
  
  扩展: 1×1 Conv (expand_ratio=6)
  空间: 3×3 Depthwise Conv
  压缩: 1×1 Conv (linear, 无激活!)
  
  跳跃连接在窄维度上 (信息瓶颈更小)
```

```python
class InvertedResidual(nn.Module):
    """MobileNetV2 倒残差块"""
    
    def __init__(self, in_channels, out_channels, stride=1, expand_ratio=6):
        super().__init__()
        self.use_residual = (stride == 1 and in_channels == out_channels)
        hidden_dim = in_channels * expand_ratio
        
        layers = []
        # Expand
        if expand_ratio != 1:
            layers.extend([
                nn.Conv2d(in_channels, hidden_dim, 1, bias=False),
                nn.BatchNorm2d(hidden_dim),
                nn.ReLU6(inplace=True),
            ])
        # Depthwise
        layers.extend([
            nn.Conv2d(hidden_dim, hidden_dim, 3, stride=stride,
                     padding=1, groups=hidden_dim, bias=False),
            nn.BatchNorm2d(hidden_dim),
            nn.ReLU6(inplace=True),
        ])
        # Project (linear, 无激活)
        layers.extend([
            nn.Conv2d(hidden_dim, out_channels, 1, bias=False),
            nn.BatchNorm2d(out_channels),
        ])
        self.conv = nn.Sequential(*layers)
    
    def forward(self, x):
        if self.use_residual:
            return x + self.conv(x)
        return self.conv(x)
```

---

## 3. 技术详解 (Technical Deep Dive)

### 3.1 经典架构详解

#### LeNet-5 (1998)
```
Input (32×32×1)
→ Conv 5×5, 6 filters → Pool → Conv 5×5, 16 → Pool
→ FC 120 → FC 84 → Output 10
参数量: ~60K
```

#### AlexNet (2012)
```
Input (224×224×3)
→ Conv 11×11, 96, stride=4 → Pool → Conv 5×5, 256 → Pool
→ Conv 3×3, 384 → Conv 3×3, 384 → Conv 3×3, 256 → Pool
→ FC 4096 → FC 4096 → FC 1000
参数量: ~60M
创新: ReLU, Dropout, GPU训练, 数据增强, LRN
```

#### VGGNet (2014)
```
核心思想: 用多个 3×3 替代大卷积核
  两个 3×3 = 一个 5×5 (感受野相同, 参数更少)
  三个 3×3 = 一个 7×7

VGG-16: 13 Conv + 3 FC
  [64, 64] → Pool → [128, 128] → Pool → [256, 256, 256] → Pool
  → [512, 512, 512] → Pool → [512, 512, 512] → Pool → FC
参数量: ~138M
```

#### Inception/GoogLeNet (2014)
```
Inception Module: 多尺度并行
  输入 → [1×1 Conv]
       → [1×1 Conv → 3×3 Conv]
       → [1×1 Conv → 5×5 Conv]
       → [3×3 MaxPool → 1×1 Conv]
       → Concat

1×1 Conv 的作用: 降维 (减少计算量)
参数量: ~6.8M (远少于 VGG)
```

#### DenseNet (2017)
```
Dense Connection: 每层接收所有前层输出
  x_l = H_l([x_0, x_1, ..., x_{l-1}])  (concat, 非相加)

优势: 特征复用, 梯度流畅, 参数高效
代价: GPU 内存消耗大 (需存储所有中间特征)

DenseNet-201: 20M 参数, 77.3% Top-1
```

### 3.2 EfficientNet 复合缩放

```python
class EfficientNetBlock(nn.Module):
    """EfficientNet 基本块: MBConv + Squeeze-and-Excitation"""
    
    def __init__(self, in_ch, out_ch, kernel_size, stride, 
                 expand_ratio, se_ratio=0.25):
        super().__init__()
        hidden_dim = in_ch * expand_ratio
        self.use_residual = (stride == 1 and in_ch == out_ch)
        
        layers = []
        # Expand
        if expand_ratio != 1:
            layers += [
                nn.Conv2d(in_ch, hidden_dim, 1, bias=False),
                nn.BatchNorm2d(hidden_dim),
                nn.SiLU(inplace=True),  # Swish 激活
            ]
        # Depthwise
        layers += [
            nn.Conv2d(hidden_dim, hidden_dim, kernel_size,
                     stride=stride, padding=kernel_size//2,
                     groups=hidden_dim, bias=False),
            nn.BatchNorm2d(hidden_dim),
            nn.SiLU(inplace=True),
        ]
        # Squeeze-and-Excitation
        se_channels = max(1, int(in_ch * se_ratio))
        layers += [
            SEBlock(hidden_dim, se_channels),
        ]
        # Project
        layers += [
            nn.Conv2d(hidden_dim, out_ch, 1, bias=False),
            nn.BatchNorm2d(out_ch),
        ]
        self.block = nn.Sequential(*layers)
    
    def forward(self, x):
        if self.use_residual:
            return x + self.block(x)  # Stochastic Depth 可选
        return self.block(x)


class SEBlock(nn.Module):
    """Squeeze-and-Excitation: 通道注意力"""
    def __init__(self, channels, se_channels):
        super().__init__()
        self.se = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(channels, se_channels),
            nn.SiLU(inplace=True),
            nn.Linear(se_channels, channels),
            nn.Sigmoid(),
        )
    
    def forward(self, x):
        scale = self.se(x).unsqueeze(-1).unsqueeze(-1)
        return x * scale
```

### 3.3 ConvNeXt: CNN 的现代化改造

**论文**: Liu et al., "A ConvNet for the 2020s", CVPR 2022

**核心思想**: 将 Transformer 的设计理念移植到 CNN

```
ConvNeXt 的改造清单 (从 ResNet-50 出发):

Stage 1: 训练策略现代化
  - AdamW 优化器 (替代 SGD)
  - 300 epochs + Cosine LR
  - 更强数据增强 (Mixup, CutMix, RandAugment, EMA)
  → 78.8% (+2.7%)

Stage 2: 宏观设计调整
  - 调整 stage 比例: [3,4,6,3] → [3,3,9,3] (类似 Swin)
  - 减少归一化和激活 (每块一个)
  → 79.4% (+0.6%)

Stage 3: 微观设计
  - Depthwise Conv (类似 MHSA 的 per-head)
  - 倒残差 (Inverted Bottleneck)
  - 大 kernel 7×7 (类似全局注意力)
  - 用 GELU 替代 ReLU
  - 用 LayerNorm 替代 BatchNorm
  → 79.9% (+0.5%)

Stage 4: 最终调整
  - 更少的归一化/激活
  - 用 GRN (Global Response Normalization) 替代 SE
  → 80.5% (ConvNeXt-T, 匹配 Swin-T)
```

```python
class ConvNeXtBlock(nn.Module):
    """ConvNeXt Block: 现代化 CNN 基本单元"""
    
    def __init__(self, dim, drop_path=0., layer_scale_init=1e-6):
        super().__init__()
        # Depthwise Conv 7×7 (大感受野)
        self.dwconv = nn.Conv2d(dim, dim, 7, padding=3, groups=dim)
        # LayerNorm (替代 BatchNorm)
        self.norm = nn.LayerNorm(dim, eps=1e-6)
        # Pointwise Expand (4x)
        self.pwconv1 = nn.Linear(dim, 4 * dim)
        self.act = nn.GELU()
        # GRN (Global Response Normalization)
        self.grn = GRN(4 * dim)
        # Pointwise Project
        self.pwconv2 = nn.Linear(4 * dim, dim)
        
        # Layer Scale (可学习缩放)
        self.gamma = nn.Parameter(
            layer_scale_init * torch.ones(dim)
        ) if layer_scale_init > 0 else None
        
        self.drop_path = DropPath(drop_path) if drop_path > 0. else nn.Identity()
    
    def forward(self, x):
        residual = x
        x = self.dwconv(x)
        x = x.permute(0, 2, 3, 1)  # (B,C,H,W) → (B,H,W,C)
        x = self.norm(x)
        x = self.pwconv1(x)
        x = self.act(x)
        x = self.grn(x)
        x = self.pwconv2(x)
        if self.gamma is not None:
            x = self.gamma * x
        x = x.permute(0, 3, 1, 2)  # (B,H,W,C) → (B,C,H,W)
        x = residual + self.drop_path(x)
        return x


class GRN(nn.Module):
    """Global Response Normalization (ConvNeXt V2)"""
    def __init__(self, dim):
        super().__init__()
        self.gamma = nn.Parameter(torch.zeros(1, 1, 1, dim))
        self.beta = nn.Parameter(torch.zeros(1, 1, 1, dim))
    
    def forward(self, x):
        # x: (B, H, W, C)
        Gx = torch.norm(x, p=2, dim=(1, 2), keepdim=True)
        Nx = Gx / (Gx.mean(dim=-1, keepdim=True) + 1e-6)
        return self.gamma * (x * Nx) + self.beta + x
```

### 3.4 MobileNet 系列演进

| 版本 | 年份 | 核心创新 | 参数量 | Top-1 | 延迟 |
|------|------|---------|--------|-------|------|
| MobileNetV1 | 2017 | 深度可分离卷积 | 4.2M | 70.6% | - |
| MobileNetV2 | 2018 | 倒残差 + 线性瓶颈 | 3.4M | 72.0% | - |
| MobileNetV3 | 2019 | NAS + h-swish + SE | 5.4M | 75.2% | - |
| MobileNetV4 | 2024 | Universal Inverted Bottleneck | 3.8M | 79.1% | - |

---

## 4. 实验与基准 (Experiments & Benchmarks)

### 4.1 ImageNet Top-1 准确率演进

| 模型 | 年份 | Top-1 | 参数量 | FLOPs | 关键创新 |
|------|------|-------|--------|-------|---------|
| LeNet-5 | 1998 | ~99% (MNIST) | 60K | - | 卷积+池化 |
| AlexNet | 2012 | 63.3% | 60M | 720M | GPU, ReLU |
| VGG-16 | 2014 | 71.5% | 138M | 15.5G | 深度, 3×3 |
| GoogLeNet | 2014 | 71.6% | 6.8M | 1.5G | 多尺度 |
| ResNet-50 | 2015 | 76.1% | 25.6M | 4.1G | 残差连接 |
| ResNet-152 | 2015 | 78.3% | 60.2M | 11.6G | 更深 |
| DenseNet-201 | 2017 | 77.3% | 20M | 4.3G | 密集连接 |
| SENet-154 | 2018 | 82.7% | 115M | 20.8G | 通道注意力 |
| EfficientNet-B7 | 2019 | 84.3% | 66M | 37G | 复合缩放 |
| ViT-L/16 | 2020 | 85.3% | 307M | 61.6G | 纯 Transformer |
| Swin-L | 2021 | 86.3% | 197M | 34.5G | 层级 Transformer |
| ConvNeXt-L | 2022 | 84.3% | 198M | 34.4G | 现代 CNN |
| ConvNeXt-XL | 2022 | 87.8% | 350M | 60.9G | + JFT 预训练 |
| EfficientNetV2-L | 2021 | 85.7% | 119M | 56G | 渐进训练 |

### 4.2 效率对比 (Mobile 级别)

| 模型 | 参数量 | FLOPs | Top-1 | Pixel 4 延迟 |
|------|--------|-------|-------|-------------|
| MobileNetV2 1.0x | 3.4M | 300M | 72.0% | 44ms |
| MobileNetV3-Large | 5.4M | 219M | 75.2% | 41ms |
| EfficientNet-B0 | 5.3M | 390M | 77.1% | 58ms |
| EfficientNetV2-S | 21.5M | 8.8G | 83.9% | - |
| MCUNet-V3 | 0.9M | 152M | 73.4% | 12ms (MCU) |
| MobileNetV4-S | 3.8M | 150M | 73.8% | 28ms |

### 4.3 CNN vs Transformer 对比

在 ImageNet-1K 上相似 FLOPs (~4.5G) 的对比:

| 模型 | 类型 | Top-1 | 推理速度 | 训练稳定性 | 小数据表现 |
|------|------|-------|---------|-----------|-----------|
| ResNet-50 | CNN | 76.1% | 快 | 好 | 好 |
| ConvNeXt-T | CNN | 82.1% | 快 | 好 | 好 |
| DeiT-S | ViT | 79.8% | 中 | 需 trick | 差 |
| Swin-T | ViT | 81.2% | 中 | 较好 | 中 |
| PVT-v2-B2 | ViT | 82.0% | 中 | 较好 | 中 |

**关键发现**:
- 大数据 (JFT-300M): ViT 优势明显
- 中等数据 (ImageNet-1K): ConvNeXt 追平 ViT
- 小数据: CNN 的归纳偏置优势明显
- 推理速度: CNN 在边缘设备仍占优

---

## 5. 代码实现要点 (Implementation)

### 5.1 ResNet 完整实现

```python
import torch
import torch.nn as nn

class ResNet(nn.Module):
    """ResNet 完整实现"""
    
    def __init__(self, block, layers, num_classes=1000):
        super().__init__()
        self.in_channels = 64
        
        # Stem
        self.stem = nn.Sequential(
            nn.Conv2d(3, 64, 7, stride=2, padding=3, bias=False),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(3, stride=2, padding=1),
        )
        
        # 4 个 Stage
        self.layer1 = self._make_layer(block, 64, layers[0])
        self.layer2 = self._make_layer(block, 128, layers[1], stride=2)
        self.layer3 = self._make_layer(block, 256, layers[2], stride=2)
        self.layer4 = self._make_layer(block, 512, layers[3], stride=2)
        
        # Head
        self.avgpool = nn.AdaptiveAvgPool2d(1)
        self.fc = nn.Linear(512 * block.expansion, num_classes)
        
        self._init_weights()
    
    def _make_layer(self, block, channels, num_blocks, stride=1):
        downsample = None
        if stride != 1 or self.in_channels != channels * block.expansion:
            downsample = nn.Sequential(
                nn.Conv2d(self.in_channels, channels * block.expansion,
                         1, stride=stride, bias=False),
                nn.BatchNorm2d(channels * block.expansion),
            )
        
        layers = [block(self.in_channels, channels, stride, downsample)]
        self.in_channels = channels * block.expansion
        for _ in range(1, num_blocks):
            layers.append(block(self.in_channels, channels))
        
        return nn.Sequential(*layers)
    
    def _init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out')
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.ones_(m.weight)
                nn.init.zeros_(m.bias)
    
    def forward(self, x):
        x = self.stem(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.fc(x)
        return x

# 实例化
resnet50 = ResNet(BottleneckBlock, [3, 4, 6, 3])
resnet101 = ResNet(BottleneckBlock, [3, 4, 23, 3])
resnet152 = ResNet(BottleneckBlock, [3, 8, 36, 3])
```

### 5.2 Stochastic Depth (DropPath)

```python
class DropPath(nn.Module):
    """训练时随机跳过整个残差块"""
    
    def __init__(self, drop_prob=0.1):
        super().__init__()
        self.drop_prob = drop_prob
    
    def forward(self, x):
        if not self.training or self.drop_prob == 0.:
            return x
        keep_prob = 1 - self.drop_prob
        # 每个 sample 独立决定
        shape = (x.shape[0],) + (1,) * (x.ndim - 1)
        random_tensor = torch.rand(shape, device=x.device)
        random_tensor = torch.floor(random_tensor + keep_prob)
        return x / keep_prob * random_tensor

# 在 ResNet 中使用: 线性增加 drop rate
# 第 1 层: 0%, 最后一层: max_drop_rate
for i, block in enumerate(all_blocks):
    block.drop_path = DropPath(max_drop_rate * i / total_blocks)
```

---

## 6. 对比表 (Comparison Tables)

### 6.1 架构设计哲学对比

| 架构 | 设计哲学 | 连接方式 | 核心操作 | 适用场景 |
|------|---------|---------|---------|---------|
| VGG | 简单堆叠 | 顺序 | 3×3 Conv | 特征提取/迁移 |
| ResNet | 深度残差 | 跳跃(+1) | Bottleneck | 通用视觉 |
| DenseNet | 特征复用 | 密集(cat) | Dense Conn | 小数据集 |
| Inception | 多尺度 | 并行 | 多 kernel | 多尺度目标 |
| MobileNet | 效率优先 | 倒残差 | DW Conv | 移动端 |
| EfficientNet | 缩放定律 | MBConv+SE | 复合缩放 | 精度-效率平衡 |
| ConvNeXt | 现代化CNN | 残差 | DW 7×7 | 通用(对标ViT) |
| RegNet | 设计空间 | 残差 | X-block | 系统化设计 |

### 6.2 感受野与计算效率

| 操作 | 感受野 | 参数量 (C=256) | FLOPs (14×14) |
|------|--------|---------------|---------------|
| 3×3 Conv | 3×3 | 590K | 115M |
| 5×5 Conv | 5×5 | 1.64M | 320M |
| 7×7 Conv | 7×7 | 3.21M | 627M |
| 3×3 DW + 1×1 PW | 3×3 | 68K | 13M |
| 7×7 DW + 1×1 PW | 7×7 | 143K | 28M |
| 两个 3×3 堆叠 | 5×5 | 1.18M | 230M |
| 三个 3×3 堆叠 | 7×7 | 1.77M | 345M |

---

## 7. 2026 前沿进展 (Frontier 2026)

### 7.1 Vision Transformer 对 CNN 的挑战与共存

```
2020-2022: ViT 似乎要取代 CNN
  - 大数据下 ViT 性能更强
  - 统一的架构 (NLP + CV)
  - 更好的全局建模

2022-2024: CNN 反击
  - ConvNeXt 证明 CNN 不输 ViT
  - 边缘部署 CNN 仍占优 (无需 attention 矩阵)
  - 小数据 CNN 归纳偏置优势

2025-2026: 融合与分化
  - 大模型: Transformer/SSM 主导
  - 边缘/实时: CNN 不可替代
  - 混合架构: CNN stem + Transformer body
  - 新方向: CNN + State Space Model
```

### 7.2 Mamba/SSM 替代 CNN?

State Space Model (Mamba) 在视觉领域的探索:

```
Mamba 的优势 (vs CNN):
- 全局感受野 (类似 Transformer)
- 线性复杂度 (优于 Transformer 的二次)
- 顺序扫描天然适合序列

Mamba 的劣势 (vs CNN):
- 2D 图像需要特殊扫描策略
- 缺乏平移等变性
- 硬件优化不如 Conv 成熟

2026 现状:
- Vision Mamba (Vim): 有潜力但未全面超越
- VMamba: 四向扫描, 接近 Swin 性能
- 混合: CNN (局部) + Mamba (全局) 效果最好
- 边缘部署: CNN 仍然首选
```

### 7.3 大核卷积复兴

```
2022: ConvNeXt 使用 7×7 DW Conv
2023: SLAK 使用 51×5 稀疏大核
2024: InternImage 使用可变形大核
2025: UniRepLKNet 使用 31×31 超大核

趋势: 用稀疏/分解实现超大感受野
  31×31 标准卷积: 不可行 (参数爆炸)
  31×31 深度卷积: 可行 (参数 = 31×31×C)
  分解: 31×5 + 5×31 (参数减半)
  稀疏: 只保留重要位置
```

### 7.4 CNN 在生成模型中的角色

```
Diffusion Model 中 CNN 的地位:
- UNet 骨干: 仍是 CNN (GroupNorm + DW Conv)
- DiT (Diffusion Transformer): 正在替代 UNet
- 但 VAE 编码器/解码器: 仍是 CNN
- 实时推理: CNN-based 扩散模型更快

2026: 
- 图像生成: DiT 主导
- 视频生成: 3D CNN + Transformer 混合
- 超分辨率: CNN 仍占优 (局部操作足够)
```

---

## 8. Vision Transformer 对 CNN 的挑战 (ViT Challenge)

### 8.1 ViT 的核心思想

```
图像 → 切分为 16×16 patches → 线性投影 → + 位置编码
→ Transformer Encoder × N → [CLS] token → 分类

本质: 用全局注意力替代局部卷积
  - 放弃局部性假设
  - 放弃平移等变性
  - 获得全局感受野 (第一层就是全局的)
```

### 8.2 CNN vs ViT 根本差异

| 维度 | CNN | ViT |
|------|-----|-----|
| 感受野 | 局部 → 逐层扩大 | 全局 (第一层) |
| 归纳偏置 | 强 (局部性+平移) | 弱 (几乎无) |
| 数据需求 | 较少 | 大量 (需 JFT-300M+) |
| 计算复杂度 | O(HW × k²) | O((HW)²) |
| 可变分辨率 | 天然支持 | 需插值位置编码 |
| 可解释性 | 特征图可视化 | Attention Map |
| 边缘部署 | 成熟 (NPU 优化) | 较难 |

### 8.3 融合趋势

```python
class HybridBlock(nn.Module):
    """2026 典型混合块: CNN 局部 + Attention 全局"""
    
    def __init__(self, dim, window_size=7):
        super().__init__()
        # 局部: 深度卷积
        self.local = nn.Sequential(
            nn.Conv2d(dim, dim, 7, padding=3, groups=dim),
            nn.BatchNorm2d(dim),
            nn.GELU(),
        )
        # 全局: 窗口注意力
        self.global_attn = WindowAttention(dim, window_size)
        # 融合
        self.fuse = nn.Conv2d(dim * 2, dim, 1)
    
    def forward(self, x):
        local_feat = self.local(x)
        global_feat = self.global_attn(x)
        return self.fuse(torch.cat([local_feat, global_feat], dim=1))
```

---

## 9. 相关概念 (Related Concepts)

- [[Attention_Mechanisms_Deep_Dive]] — Vision Transformer 的注意力机制
- [[Neural_Network_Core]] — 神经网络核心架构总览
- [[Normalization_Techniques_Deep_Dive]] — CNN 中的 BatchNorm vs Transformer 中的 LayerNorm
- [[Neural_Architecture_Search]] — EfficientNet 的 NAS 搜索
- [[Optimization]] — 深度 CNN 训练的优化策略
- [[03_深度学习/State_Space_Models/index|状态空间模型]] — Mamba 对 CNN 的潜在替代
- [[03_深度学习/04_Generative_Models/index|生成模型]] — CNN 在 Diffusion 中的角色
- [[Embedding_Representation_Learning]] — CNN 特征作为视觉嵌入

---

## 10. 参考文献 (References)

1. LeCun, Y. et al. (1998). "Gradient-Based Learning Applied to Document Recognition." Proceedings of the IEEE.
2. Krizhevsky, A., Sutskever, I. & Hinton, G.E. (2012). "ImageNet Classification with Deep Convolutional Neural Networks." NeurIPS.
3. Simonyan, K. & Zisserman, A. (2015). "Very Deep Convolutional Networks for Large-Scale Image Recognition." ICLR.
4. He, K. et al. (2016). "Deep Residual Learning for Image Recognition." CVPR.
5. Huang, G. et al. (2017). "Densely Connected Convolutional Networks." CVPR.
6. Howard, A.G. et al. (2017). "MobileNets: Efficient CNNs for Mobile Vision." arXiv:1704.04861.
7. Tan, M. & Le, Q.V. (2019). "EfficientNet: Rethinking Model Scaling for CNNs." ICML.
8. Liu, Z. et al. (2022). "A ConvNet for the 2020s." CVPR.
9. Dosovitskiy, A. et al. (2021). "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale." ICLR.
10. Woo, S. et al. (2023). "ConvNeXt V2: Co-designing and Scaling ConvNets with Masked Autoencoders." CVPR.
