---
title: "L05 - 框架简介与过拟合"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "pytorch", "tensorflow", "overfitting", "frameworks"]
summary: "介绍 PyTorch 与 TensorFlow/Keras 的高低层 API 区别，以及过拟合的成因、检测方法与偏差-方差权衡。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/3-NeuralNetworks/05-Frameworks/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L05 Frameworks And Overfitting"
  - "L05 Frameworks and Overfitting"
  - L05_Frameworks_and_Overfitting
sources: []

---
# L05 - 框架简介与过拟合

> **一句话理解**：真正动手训练神经网络时，你需要一个能自动求导、能在 GPU 上并行计算的框架；同时，你必须学会识别并控制过拟合——这是让模型从“背答案”变成“学规律”的关键一课。

## 本课概览

本课是 Microsoft AI For Beginners 神经网络模块的第三节。前两节课我们从感知器讲到手工搭建一个最简神经网络框架，了解了张量运算、前向传播和反向传播的基本原理。但这些手工实现既繁琐又低效，无法真正用于生产或研究。本课首先介绍当前主流的神经网络框架——**PyTorch** 与 **TensorFlow/Keras**，解释它们为什么要提供“低层 API”和“高层 API”两套接口，以及它们如何自动完成求导与 GPU 加速。

后半部分聚焦一个贯穿整个机器学习生涯的核心问题——**过拟合（Overfitting）**。我们会用直观的拟合示例说明：为什么参数过多的模型能把训练数据拟合到误差为零，却在验证数据上表现糟糕；如何识别过拟合；以及它与统计学中偏差-方差权衡（Bias-Variance Tradeoff）的关系。

完成本课后，你将能够：

- 区分 PyTorch 与 TensorFlow/Keras 的底层与高层 API 适用场景；
- 理解自动微分（Automatic Differentiation）和计算图（Computational Graph）在框架中的作用；
- 解释过拟合与欠拟合的区别，并列举常见诱因与应对手段；
- 运行官方 Notebook，体验低层张量 API 与高层 `fit` 风格 API。

## 核心概念

### 1. 神经网络框架要解决的两个基本问题

训练神经网络在工程上反复依赖两件事：

1. **张量运算**：矩阵乘法、逐元素加法、激活函数（如 sigmoid、softmax）等。NumPy 可以做到这一点，但它只在 CPU 上运行。
2. **梯度计算**：为了做梯度下降（Gradient Descent），需要计算损失函数对每一个参数的偏导数。手动推导并编码所有导数既容易出错，也难以扩展。

因此，一个合格的深度学习框架必须同时提供“高效张量运算”和“自动梯度计算”，并且最好能在 GPU、TPU 等专用硬件上并行执行。

### 2. 自动微分与计算图

现代框架的核心机制是**自动微分（Automatic Differentiation）**：你把前向计算过程写成代码，框架会在后台构建一张**计算图（Computational Graph）**，记录每个操作及其输入输出关系。当损失函数算出来后，框架自动沿着这张图反向传播（Backpropagation），用链式法则求出所有参数的梯度。

这与我们在 L04 手工实现中的 `backward` 方法本质相同，但框架把求导规则内建好了，用户无需为每一层单独写导数。

### 3. PyTorch 与 TensorFlow/Keras 的双层 API

目前最主流的两个框架是 [PyTorch](https://pytorch.org/) 与 [TensorFlow](http://tensorflow.org/)。它们都提供两套 API：

| 层级 | TensorFlow 生态 | PyTorch 生态 |
|------|-----------------|--------------|
| **低层 API** | TensorFlow Core | PyTorch Core（张量 + `autograd`） |
| **高层 API** | Keras | PyTorch Lightning |

- **低层 API**：粒度接近 NumPy，但支持 GPU 与自动求导。研究者常用它实现新架构、自定义训练循环或损失函数。
- **高层 API**：把神经网络视为“层的堆叠”，提供类似 `model.fit()` 的简洁训练流程，适合快速搭建和调参。

两套 API 并非互斥。典型做法是：用低层 API 自定义网络组件，再用高层 API 组装和训练整个模型。

### 4. 过拟合：模型在“背答案”

过拟合指模型把训练数据中的噪声和细节都记住了，而没有学到普适规律。用一个拟合 5 个数据点的例子可以直观理解：

| 模型 | 参数数量 | 训练误差 | 验证误差 | 表现 |
|------|----------|----------|----------|------|
| 线性模型 | 2 | 5.3 | 5.1 | 较好，捕捉大致趋势 |
| 高次非线性模型 | 7 | 0 | 20 | 很差，穿过每个点但泛化能力弱 |

参数过多的模型可以把 5 个点“精确穿过”，但在新数据上表现极差。这说明：**模型容量（参数多少）必须与训练数据量相匹配**。

### 5. 偏差-方差权衡

过拟合可以放在更广泛的统计框架下理解：

- **偏差（Bias）**：模型太简单，无法捕捉数据真实关系，导致**欠拟合（Underfitting）**。训练误差和验证误差都可能很高。
- **方差（Variance）**：模型太复杂，对训练数据中的噪声过度敏感，导致**过拟合**。训练误差很低，但验证误差显著升高。

训练过程中，偏差通常随模型学习而下降，方差却可能上升。理想目标是找到两者都较低的“甜蜜点”。

## 关键知识点

- **框架选择**：初学者可先深耕 PyTorch，工业部署场景再补充 TensorFlow/Keras；本课程多数实验同时提供两个版本。
- **自动求导**：PyTorch 的 `autograd` 和 TensorFlow 的 GradientTape 都是自动微分的实现，用户定义前向计算即可自动获得梯度。
- **GPU 加速**：把计算图或张量放到 GPU 上并行执行，是深度学习训练速度提升的关键；框架通过 `to('cuda')`（PyTorch）或 `/GPU:0`（TensorFlow）等方式暴露设备抽象。
- **过拟合的常见原因**：训练数据太少、模型容量过大、输入噪声过多。
- **检测过拟合**：监控训练误差和验证误差曲线；当验证误差停止下降并开始上升，而训练误差继续下降时，通常意味着过拟合。
- **缓解过拟合**：增加训练数据、降低模型复杂度、使用正则化技术（如 Dropout、L2 正则化）、早停（Early Stopping）。

## 代码/实验说明

本课官方提供多个可运行 Notebook，分为低层 API 和高层 API 两类：

| 层级 | TensorFlow/Keras | PyTorch |
|------|------------------|---------|
| **低层 API** | [`IntroKerasTF.ipynb`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/3-NeuralNetworks/05-Frameworks/IntroKerasTF.ipynb) | [`IntroPyTorch.ipynb`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/3-NeuralNetworks/05-Frameworks/IntroPyTorch.ipynb) |
| **高层 API** | [`IntroKeras.ipynb`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/3-NeuralNetworks/05-Frameworks/IntroKeras.ipynb) | PyTorch Lightning（框架高层封装） |

### 低层 API 的核心模式

低层 Notebook 通常展示如何：

1. 创建张量（Tensor）并指定计算设备（CPU/GPU）；
2. 用框架内置操作定义前向计算，例如线性变换加激活函数：
   ```python
   # PyTorch 伪代码示例
   z = torch.matmul(x, W) + b
   a = torch.sigmoid(z)
   loss = criterion(a, y)
   loss.backward()  # 自动计算梯度
   optimizer.step() # 更新参数
   ```
3. 调用 `.backward()` 或 `GradientTape` 自动完成反向传播；
4. 使用优化器（如 SGD、Adam）更新权重。

### 高层 API 的核心模式

高层 Notebook 通常展示如何：

1. 用 `Sequential`（Keras）或 `nn.Module`（PyTorch Lightning）堆叠层；
2. 编译模型时指定损失函数、优化器和评估指标；
3. 调用 `model.fit()`（Keras）或 Trainer（PyTorch Lightning）完成训练。

### 课后实验

- **官方 Lab**：[`lab/LabFrameworks.ipynb`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/3-NeuralNetworks/05-Frameworks/lab/LabFrameworks.ipynb)
- **任务**：用 PyTorch 或 TensorFlow 解决两个分类问题，分别使用单层和多层全连接网络。

> 提示：如果你只是想快速上手，可直接从高层 API Notebook 开始；若想真正理解框架内部，建议先完整跑一遍低层 API 版本。

## 本课不覆盖与延伸

- **不覆盖**：具体优化器内部数学细节（如 Adam、RMSprop 的完整推导），参见本库 [[深度学习/Optimization/Optimization]]；卷积、循环等更复杂网络架构将在后续课程讲解。
- **延伸**：更多关于监督学习基础、训练/验证/测试划分、评估指标的讨论，参见 [[机器学习/Supervised_Learning/Supervised_Learning]]；正则化与 Dropout 的细节将在 CV 迁移学习章节进一步展开。

## 相关阅读

- 课程索引：[[学习/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：[[深度学习/Optimization/Optimization]]、[[机器学习/Supervised_Learning/Supervised_Learning]]
