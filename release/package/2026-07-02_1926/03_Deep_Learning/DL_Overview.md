---
title: "深度学习概览 (Deep Learning Overview)"
category: 03-deep-learning
tags: ["deep-learning", "neural-network", "overview", "fundamentals", "architecture"]
summary: "深度学习全景概览——从神经网络基础到现代架构，从训练技巧到工程实践，系统性梳理深度学习知识体系。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Deep Learning Overview"
  - Deep_Learning_Overview
sources: []

---
# 深度学习概览 (Deep Learning Overview)

> 深度学习全景概览——从神经网络基础到现代架构，从训练技巧到工程实践，系统性梳理深度学习知识体系。

---

## 1. 概述 (Overview)

深度学习（Deep Learning）是机器学习的一个子领域，通过多层神经网络学习数据的层次化表示。从 2012 年 AlexNet 在 ImageNet 上的突破，到 2026 年多模态大模型的普及，深度学习已经成为 AI 的核心技术范式。

### 深度学习 vs 传统机器学习

| 维度 | 传统 ML | 深度学习 |
|------|---------|---------|
| **特征工程** | 手动设计特征 | 自动学习特征 |
| **数据需求** | 较少 | 大量 |
| **计算需求** | CPU 可用 | 需要 GPU/TPU |
| **可解释性** | 较好 | 较差 |
| **适用数据** | 结构化数据 | 图像/文本/音频/视频 |

### 深度学习的核心优势

```
1. 自动特征学习: 不需要领域专家手动设计特征
2. 层次化表示: 底层→高层，逐层抽象
3. 端到端训练: 从原始输入直接到最终输出
4. 迁移学习: 预训练模型可迁移到新任务
5. 规模效应: 更多数据+更大模型=更好性能
```

---

## 2. 神经网络基础 (Neural Network Foundations)

### 2.1 感知机 (Perceptron)

```
最简单的神经网络:

输入: x₁, x₂, ..., xₙ
权重: w₁, w₂, ..., wₙ
偏置: b

输出: y = f(Σ wᵢxᵢ + b)

激活函数 f:
  - 阶跃函数: 输出 0 或 1
  - Sigmoid: σ(x) = 1/(1+e^(-x))
  - ReLU: max(0, x)
```

### 2.2 多层感知机 (MLP)

```
输入层 → 隐藏层 1 → 隐藏层 2 → ... → 输出层

  x₁ ──→ h₁₁ ──→ h₂₁ ──→ y₁
  x₂ ──→ h₁₂ ──→ h₂₂ ──→ y₂
  x₃ ──→ h₁₃ ──→ h₂₃

通用近似定理: 具有足够神经元的单隐藏层 MLP 可以近似任意连续函数
```

### 2.3 反向传播 (Backpropagation)

```
前向传播: 输入 → 计算损失
反向传播: 损失 → 计算梯度 → 更新参数

链式法则:
  ∂L/∂w = ∂L/∂y · ∂y/∂z · ∂z/∂w

  L: 损失函数
  y: 输出
  z: 线性组合 (z = wx + b)
  w: 权重

梯度下降:
  w = w - η · ∂L/∂w
  
  η: 学习率
```

---

## 3. 核心架构 (Core Architectures)

### 3.1 卷积神经网络 (CNN)

```
核心思想: 局部连接 + 权重共享 + 池化

卷积层:
  输入: H×W×C (高×宽×通道)
  卷积核: K×K×C×N (大小×输入通道×输出通道)
  输出: H'×W'×N

池化层:
  最大池化: 取局部最大值
  平均池化: 取局部平均值
  作用: 降低空间维度，增加平移不变性

经典架构:
  LeNet (1998) → AlexNet (2012) → VGG (2014)
  → GoogLeNet (2014) → ResNet (2015) → EfficientNet (2019)
```

### 3.2 循环神经网络 (RNN)

```
核心思想: 处理序列数据，具有"记忆"能力

隐藏状态: h_t = f(x_t, h_{t-1})

问题: 梯度消失/爆炸，难以学习长距离依赖

变体:
  LSTM: 遗忘门 + 输入门 + 输出门
  GRU: 简化版 LSTM，参数更少
  Bi-RNN: 双向处理序列

现状: 大部分已被 Transformer 取代
```

### 3.3 Transformer

详见 [[05_NLP_LLMs/Transformer_Architecture]]

```
核心思想: 自注意力机制，并行处理序列

优势:
  - 完全并行化 (RNN 必须顺序处理)
  - 直接建模长距离依赖
  - 可扩展性强 (scaling law)

应用:
  - NLP: BERT, GPT, T5
  - CV: ViT, Swin Transformer
  - 多模态: CLIP, LLaVA
  - 音频: Whisper
```

### 3.4 生成对抗网络 (GAN)

```
两个网络对抗训练:

生成器 G: 噪声 → 生成数据 (试图欺骗判别器)
判别器 D: 真实/生成数据分类 (试图识别生成数据)

训练目标:
  min_G max_D V(D,G) = E[log D(x)] + E[log(1-D(G(z)))]

应用:
  - 图像生成: StyleGAN, BigGAN
  - 图像编辑: Pix2Pix, CycleGAN
  - 超分辨率: SRGAN
```

### 3.5 变分自编码器 (VAE)

```
编码器: 输入 → 潜在分布 q(z|x)
解码器: 潜在采样 z → 重构输出

损失函数:
  L = 重构损失 + KL 散度
  L = E[log p(x|z)] - KL(q(z|x) || p(z))

应用:
  - 图像生成
  - 数据增强
  - 异常检测
```

### 3.6 扩散模型 (Diffusion Models)

详见 [[04_Computer_Vision/Generative_Models/Diffusion_Models_Deep_Dive]]

```
前向过程: 数据 → 逐步加噪 → 纯噪声
反向过程: 纯噪声 → 逐步去噪 → 生成数据

2026 年主流生成模型:
  - Stable Diffusion 3: 文本到图像
  - DALL-E 3: 文本到图像
  - Sora: 文本到视频
  - Flux: 高质量图像生成
```

---

## 4. 训练技巧 (Training Techniques)

### 4.1 优化器

| 优化器 | 特点 | 适用场景 |
|--------|------|---------|
| **SGD** | 简单、需要调参 | CV 任务 |
| **Adam** | 自适应学习率 | 通用首选 |
| **AdamW** | Adam + 权重衰减解耦 | LLM 训练 |
| **LAMB** | 大批量训练 | 大规模分布式 |

### 4.2 正则化

```
Dropout: 训练时随机关闭神经元，防止过拟合
  - p=0.5 (全连接层)
  - p=0.1-0.3 (卷积层)

权重衰减: L2 正则化
  loss = original_loss + λ · Σ w²

数据增强: 增加训练数据多样性
  - 图像: 翻转、旋转、裁剪、颜色抖动
  - 文本: 同义词替换、回译
  - 音频: 噪声添加、速度扰动

早停: 验证集性能不再提升时停止训练
```

### 4.3 学习率调度

```
Warmup: 初始小学习率，逐步增大
  - 线性 warmup: 前 5-10% 步数线性增长
  - 作用: 稳定训练初期

衰减策略:
  - Step decay: 每 N 个 epoch 乘以 γ
  - Cosine annealing: 余弦函数衰减
  - OneCycleLR: 先增后减
  - ReduceLROnPlateau: 验证集停滞时衰减
```

### 4.4 混合精度训练

```
FP32 → FP16/BF16 + 损失缩放

优势:
  - 显存减半
  - 计算加速 (Tensor Core)
  - 通信量减半

实现:
  - PyTorch: torch.cuda.amp
  - Apex: NVIDIA 混合精度库
  
BF16 vs FP16:
  - BF16: 范围更大，不需要损失缩放
  - FP16: 精度更高，需要损失缩放
  - 2026 年主流: BF16
```

---

## 5. 工程实践 (Engineering Practice)

### 5.1 深度学习框架选型

详见 [[03_Deep_Learning/DL_Frameworks/DL_Frameworks]]

```
2026 年主流:
├── PyTorch: 研究 + 生态最活跃
├── JAX: 大规模训练、TPU 优化
├── TensorFlow: 移动端部署
└── Keras 3: 多后端框架

选型建议:
  - 通用开发 → PyTorch
  - 大规模训练 → JAX + TPU
  - 移动部署 → TensorFlow Lite / ONNX
  - 快速原型 → Keras
```

### 5.2 GPU 选型

详见 [[01_Fundamentals/AI_Hardware/NVIDIA_AMD_GPU_Deep_Dive]]

```
训练:
  - 入门: RTX 4090 (24GB)
  - 中端: A100 80GB
  - 高端: H100 80GB / H200 141GB
  - 超算: GB200 NVL72

推理:
  - 入门: RTX 4060 (8GB)
  - 中端: L4 (24GB)
  - 高端: L40S (48GB)
  - 边缘: Jetson Orin
```

### 5.3 调试与诊断

```
常见问题:
  - 损失不下降: 学习率太大/太小、数据问题
  - 过拟合: 增加正则化、数据增强、减小模型
  - 欠拟合: 增加模型容量、减少正则化
  - 梯度消失/爆炸: 使用残差连接、梯度裁剪

工具:
  - TensorBoard: 可视化训练过程
  - Weights & Biases: 实验跟踪
  - PyTorch Profiler: 性能分析
  - torch.compile: 编译优化
```

---

## 6. 前沿趋势 (2026)

### 6.1 规模定律 (Scaling Laws)

```
Kaplan Scaling Laws (2020):
  L(N, D, C) = (N_c/N)^α_N + (D_c/D)^α_D + ...

  N: 模型参数量
  D: 数据量
  C: 计算量

Chinchilla Scaling Laws (2022):
  最优分配: 参数量和数据量应该同步增长
  推翻了"越大越好"的简单认知

2026 实践:
  - 7B 模型 + 高质量数据 > 70B 模型 + 低质量数据
  - 数据质量成为关键瓶颈
```

### 6.2 涌现能力 (Emergent Abilities)

```
当模型规模超过某个阈值时，突然出现的新能力:

  - 少样本学习 (Few-shot)
  - 思维链推理 (Chain-of-Thought)
  - 指令遵循 (Instruction Following)
  - 代码生成 (Code Generation)
  - 多语言能力 (Multilingual)

争议: 是否是评估指标的假象？(2023 Schaeffer 论文)
```

### 6.3 混合专家 (Mixture of Experts, MoE)

```
核心思想: 不是所有参数都需要同时激活

架构:
  - 多个专家网络 (如 8-64 个)
  - 门控网络选择 Top-K 个专家
  - 每个 token 只激活部分专家

优势:
  - 参数量大但计算量小
  - 如 Mixtral 8x7B: 47B 参数，13B 激活

应用:
  - Mixtral, DeepSeek-V2/V3, Qwen MoE
  - Gemini (推测为 MoE 架构)
```

---

## 7. 学习资源

### 推荐学习路径

```
入门:
  1. 3Blue1Brown 神经网络系列
  2. Fast.ai 课程
  3. 吴恩达深度学习专项课程

进阶:
  1. CS231n (计算机视觉)
  2. CS224n (NLP)
  3. 《深度学习》(花书)

前沿:
  1. arXiv 论文阅读
  2. 代码实现经典模型
  3. 参与开源项目
```

---

## 相关阅读

- [[03_Deep_Learning/Neural_Network_Core/Neural_Network_Core]] — 神经网络核心
- [[03_Deep_Learning/Neural_Network_Core/Attention_Mechanisms_Deep_Dive]] — 注意力机制
- [[03_Deep_Learning/Transfer_Learning]] — 迁移学习
- [[03_Deep_Learning/DL_Frameworks/DL_Frameworks]] — 深度学习框架
- [[03_Deep_Learning/Optimization/Optimization]] — 优化技术
- [[05_NLP_LLMs/Transformer_Architecture]] — Transformer 架构
- [[04_Computer_Vision/ViT_Deep_Dive]] — Vision Transformer
