---
title: "深度学习基础 (Deep Learning Fundamentals)"
category: 03-deep-learning
tags: ["deep-learning", "neural-network", "backpropagation", "activation-function"]
summary: "> **一句话理解**: 深度学习是多层神经网络的堆叠艺术——从感知机到 MLP、CNN、RNN 再到 Transformer，每一代架构都在逼近人脑的层次化特征提取能力，而反向传播 + 梯度下降是让这一切运转的引擎。"
created: 2026-06-12
updated: 2026-06-12
tier: supporting
aliases:
  - "Dl Fundamentals"
  - "DL Fundamentals"
  - DL_Fundamentals
sources: []

---
# 深度学习基础 (Deep Learning Fundamentals)

> **一句话理解**: 深度学习是多层神经网络的堆叠艺术——从感知机到 MLP、CNN、RNN 再到 Transformer，每一代架构都在逼近人脑的层次化特征提取能力，而反向传播 + 梯度下降是让这一切运转的引擎。

---

## TL;DR

- **感知机 (Perceptron)**: 最简神经元，只能解决线性可分问题
- **MLP (多层感知机)**: 隐藏层引入非线性，理论上可逼近任意连续函数（通用近似定理）
- **CNN (卷积神经网络)**: 局部连接 + 权重共享，图像特征提取王者
- **RNN (循环神经网络)**: 序列建模利器，LSTM/GRU 解决长程依赖
- **Transformer**: 自注意力机制取代循环，并行训练，统治 NLP 与视觉
- **反向传播 (Backpropagation)**: 链式法则从输出层传回梯度，驱动参数更新
- **激活函数**: ReLU 家族是默认选择，Sigmoid/Tanh 用于特殊场景

---

## 本章节索引

本章是深度学习领域的总入口，向下链接四个核心子模块：

| 子模块 | 核心内容 | 链接 |
|--------|---------|------|
| **神经网络核心** | 感知机、MLP、前向传播、反向传播 | [[03_Deep_Learning/Neural_Network_Core/Neural_Network_Core]] |
| **优化方法** | SGD、Adam、学习率调度、正则化 | [[03_Deep_Learning/Optimization/Optimization]] |
| **深度学习框架** | PyTorch、JAX、ONNX、训练工程 | [[03_Deep_Learning/DL_Frameworks/DL_Frameworks]] |
| **世界模型** | JEPA、Sora 内部模型、预测编码 | [[03_Deep_Learning/World_Models/README]] |

---

## 1. 架构演进：从感知机到 Transformer

```mermaid
flowchart LR
    A["感知机<br/>Perceptron<br/>(1958)"] --> B["MLP<br/>多层感知机<br/>(1986)"]
    B --> C["CNN<br/>LeNet→ResNet<br/>(1998-2015)"]
    B --> D["RNN<br/>LSTM/GRU<br/>(1997-2014)"]
    C --> E["Transformer<br/>(2017)"]
    D --> E
    E --> F["ViT / GPT / BERT<br/>(2020+)"]

    style A fill:#fff3e0
    style B fill:#ffe0b2
    style C fill:#ffcc80
    style D fill:#ffcc80
    style E fill:#ff8a65
    style F fill:#ff5722,color:#fff
```

### 1.1 里程碑时间线

| 年代 | 架构 | 核心创新 | 影响 |
|------|------|---------|------|
| 1958 | Perceptron | 单层线性神经元 | 神经网络概念的起点 |
| 1986 | MLP + Backprop | 隐藏层 + 反向传播算法 | 第一次 AI 复兴 |
| 1998 | LeNet-5 | 卷积 + 池化 + 全连接 | 手写数字识别，CNN 奠基 |
| 1997 | LSTM | 门控机制解决梯度消失 | 序列建模的长期标准 |
| 2012 | AlexNet | ReLU + Dropout + GPU | 深度学习复兴的引爆点 |
| 2015 | ResNet | 残差连接 (skip connection) | 可训练 152+ 层极深网络 |
| 2017 | Transformer | Self-Attention 替代 RNN | NLP/CV 统一架构 |
| 2020 | ViT | 图像 patch 化 + Transformer | 视觉进入注意力时代 |

---

## 2. 反向传播直觉 (Backpropagation Intuition)

反向传播的本质是**链式法则 (Chain Rule)** 的计算图遍历：

```mermaid
flowchart TB
    subgraph "前向传播 (Forward Pass)"
        X[输入 x] --> L1["隐藏层 h = ReLU(W₁x + b₁)"]
        L1 --> L2["输出 ŷ = W₂h + b₂"]
        L2 --> Loss["损失 L = MSE(y, ŷ)"]
    end

    subgraph "反向传播 (Backward Pass)"
        Loss --> G1["∂L/∂ŷ"]
        G1 --> G2["∂L/∂W₂ = ∂L/∂ŷ · hᵀ"]
        G1 --> G3["∂L/∂h = W₂ᵀ · ∂L/∂ŷ"]
        G3 --> G4["∂L/∂W₁ = ∂L/∂h · xᵀ<br/>(经过 ReLU 梯度)"]
    end
```

**直觉理解**：把神经网络想象成一条流水线，每个工人（层）加工零件后传给下一个。反向传播就是质检员从成品开始，逐层追溯"哪个环节出了问题、出了多少"，然后调整每个工人的手法。

**关键公式**：
- 链式法则：`∂L/∂W₁ = ∂L/∂ŷ · ∂ŷ/∂h · ∂h/∂W₁`
- 梯度下降更新：`W ← W - η · ∂L/∂W`（η 为学习率）

---

## 3. 激活函数 (Activation Functions)

激活函数为网络注入**非线性**——没有它，无论多少层都等价于一个线性变换。

| 函数 | 公式 | 范围 | 优点 | 缺点 | 使用场景 |
|------|------|------|------|------|---------|
| **Sigmoid** | σ(x) = 1/(1+e⁻ˣ) | (0, 1) | 输出可解释为概率 | 梯度消失、非零中心 | 二分类输出层 |
| **Tanh** | tanh(x) | (-1, 1) | 零中心 | 梯度消失 | RNN 隐藏层 |
| **ReLU** | max(0, x) | [0, ∞) | 计算快、缓解梯度消失 | Dead ReLU 问题 | 默认首选 |
| **Leaky ReLU** | max(αx, x), α=0.01 | (-∞, ∞) | 解决 Dead ReLU | 负区间梯度小 | 替代 ReLU |
| **GELU** | x · Φ(x) | (-∞, ∞) | 平滑、性能好 | 计算略贵 | Transformer / BERT |
| **Swish** | x · σ(x) | (-∞, ∞) | 自适应门控 | 计算开销 | EfficientNet |

**实践建议**：隐藏层默认用 ReLU 或 GELU；输出层按任务选择——分类用 Sigmoid/Softmax，回归用线性。

---

## 4. 核心架构对比

| 维度 | MLP | CNN | RNN/LSTM | Transformer |
|------|-----|-----|----------|-------------|
| **连接方式** | 全连接 | 局部连接 + 权重共享 | 时间步循环 | 全局自注意力 |
| **参数效率** | 低（参数多） | 高（卷积核共享） | 中等 | 中等 |
| **并行性** | 可并行 | 可并行 | 不可并行（时序依赖） | 高度可并行 |
| **长程依赖** | 无 | 有限（感受野） | 差（梯度消失/爆炸） | 优秀 |
| **适用数据** | 表格/向量 | 图像/网格数据 | 序列/时序 | 序列/图像/多模态 |
| **代表模型** | 早期分类器 | ResNet, EfficientNet | Seq2Seq, BiLSTM | GPT, BERT, ViT |

---

## 5. 深度学习工作流

```mermaid
flowchart TB
    A[数据收集与清洗] --> B[特征工程 / 数据增强]
    B --> C[选择架构]
    C --> D[定义损失函数]
    D --> E[选择优化器<br/>Adam/SGD]
    E --> F[训练 + 验证<br/>Early Stopping]
    F --> G[测试评估]
    G --> H[部署推理]

    style A fill:#e3f2fd
    style F fill:#fff3e0
    style H fill:#e8f5e9
```

---

## 延伸阅读 (Further Reading)

- [[03_Deep_Learning/DL-in-nutshell]] — 深度学习速成指南，30 秒掌握全貌
- [[03_Deep_Learning/Neural_Network_Core/Neural_Network_Core]] — 神经网络核心原理详解
- [[03_Deep_Learning/Optimization/Optimization]] — 优化算法与训练技巧
- [[03_Deep_Learning/DL_Frameworks/DL_Frameworks]] — PyTorch / JAX 框架实战
- [[03_Deep_Learning/World_Models/README]] — 世界模型与预测编码前沿
- [[03_Deep_Learning/State_Space_Models_2026]] — Mamba 与 Transformer 后继者
