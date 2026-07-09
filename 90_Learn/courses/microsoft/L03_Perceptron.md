---
title: "L03 - 感知器"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "perceptron", "neural-networks", "binary-classification", "gradient-descent"]
summary: "从 Frank Rosenblatt 的 Mark-1 硬件到现代二分类模型，理解感知器的结构、感知器准则与基于梯度下降的权重更新。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/3-NeuralNetworks/03-Perceptron/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L03 Perceptron"
  - L03_Perceptron
sources: []

---
# L03 - 感知器

> **一句话理解**：感知器（Perceptron）是神经网络的“原子单元”，它通过可学习的权重对输入进行加权求和，再用阶跃函数输出二分类结果，并通过误分类样本不断修正权重。

## 本课概览

本课是 Microsoft AI For Beginners「神经网络简介」模块的第一节课，从 1957 年 Frank Rosenblatt 的 Mark-1 硬件实现讲起，逐步推导感知器（Perceptron）的数学模型与训练规则。学习本课后，你会理解：为什么一个线性加权+阶跃函数能完成二分类任务，以及如何用梯度下降（Gradient Descent）自动调整权重。

在课程序列中，本课位于 L02「符号 AI / 专家系统」之后、L04「多层感知器及构建自己的框架」之前。它是理解现代深度学习的最小切入点——几乎所有神经网络都可看作感知器的堆叠与扩展。

**学习目标**：
- 理解感知器的历史背景与二分类本质。
- 掌握感知器模型 $y(x)=f(w^\top x)$ 与阶跃激活函数。
- 理解感知器准则（Perceptron Criterion）与梯度下降更新公式。
- 能在 Python / NumPy 中复现最简单的感知器训练循环。

## 核心概念

- **感知器（Perceptron）**：Frank Rosenblatt 于 1957 年提出的二分类模型，可视为只有一个神经元的最简神经网络。早期 Mark-1 用 20×20 的光电池阵列做输入（共 400 维），输出为 +1 / -1 两类。
- **阈值逻辑单元（Threshold Logic Unit）**：感知器中唯一的计算单元。它先计算输入的加权和 $w^\top x$，再用阈值判断输出。
- **阶跃激活函数（Step Activation Function）**：
  $$
  f(x) = \begin{cases}
  +1 & x \geq 0 \\
  -1 & x < 0
  \end{cases}
  $$
  它将连续的加权和映射为离散的二分类标签。
- **权重向量（Weights Vector）**：$w$ 决定每个输入特征对最终判断的影响力。训练感知器就是寻找使分类错误最少的 $w$。
- **感知器准则（Perceptron Criterion）**：只统计误分类样本的损失函数：
  $$
  E(w) = -\sum w^\top x_i t_i
  $$
  其中 $x_i$ 是误分类样本，$t_i \in \{-1, +1\}$ 是其真实标签。
- **梯度下降（Gradient Descent）**：通过沿损失函数负梯度方向迭代更新权重，逐步降低误分类损失。学习率（Learning Rate）$\eta$ 控制每一步的步长。

## 关键知识点

- 感知器只能解决**线性可分**问题；对于 XOR 这类非线性问题，需要后续课程中的多层感知器（MLP）。
- 输出标签约定为 $+1$（正例）与 $-1$（负例），与 0/1 标签的代码实现略有不同。
- 权重更新只针对**当前被误分类的样本**，正确分类的样本对本次更新没有贡献。
- 学习率 $\eta$ 过大可能震荡，过小则收敛慢；在简单演示中通常取 1。
- 感知器训练不能保证收敛到全局最优，但若数据线性可分，算法可在有限步内收敛到一个能正确分类的超平面。

## 代码/实验说明

官方仓库提供可直接运行的 Jupyter Notebook，演示如何用 NumPy 从零训练一个感知器，并将其用于手写数字的二分类任务。

- **主 Notebook**：[Perceptron.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/3-NeuralNetworks/03-Perceptron/Perceptron.ipynb)
  - 通常同时提供 PyTorch 与 TensorFlow 两个版本，可任选其一运行。
  - 核心逻辑：随机初始化权重 → 循环采样正负样本 → 误分类时按方向更新权重 → 返回训练好的权重。

核心训练循环的 Python / NumPy 伪代码如下：

```python
import numpy as np
import random

def train(positive_examples, negative_examples, num_iterations=100, eta=1):
    # 初始化权重（本例为 3 维，含偏置）
    weights = np.array([0.0, 0.0, 0.0])

    for _ in range(num_iterations):
        pos = random.choice(positive_examples)
        neg = random.choice(negative_examples)

        # 正例被错分为负例时，向正例方向更新
        z = np.dot(pos, weights)
        if z < 0:
            weights = weights + eta * pos

        # 负例被错分为正例时，向负例方向更新
        z = np.dot(neg, weights)
        if z >= 0:
            weights = weights - eta * neg

    return weights
```

> 注意：官方示例中权重维度与输入维度一致，通常最后一维固定为 1 以充当偏置（bias）项。

- **实验 Lab**：[lab/PerceptronMultiClass.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/3-NeuralNetworks/03-Perceptron/lab/PerceptronMultiClass.ipynb)
  - 在实验中，你需要把二分类感知器扩展为**多分类器**，判断一张手写图片最可能是哪个数字（0–9）。
  - 常见思路：为每个数字训练一个「一对多（One-vs-Rest）」感知器，或改用 Softmax 回归。

- **动手挑战**：微软 Learn 还提供 [Azure ML designer 中的二分类平均感知器实验](https://docs.microsoft.com/en-us/azure/machine-learning/component-reference/two-class-averaged-perceptron?WT.mc_id=academic-77998-cacaste)，适合想零代码体验的同学。

## 本课不覆盖与延伸

- **不覆盖**：
  - 多层网络与非线性激活函数（Sigmoid、ReLU 等）→ 见 L04「多层感知器」。
  - 反向传播（Backpropagation）→ 见 L04 及本库 [[深度学习/Neural_Network_Core/Neural_Network_Core]]。
  - 优化器、批量训练、正则化 → 见 L05「框架简介及过拟合」。
- **延伸**：
  - 想深入理解感知器的局限与历史，可阅读 [Towards Data Science：What is a Perceptron?](https://towardsdatascience.com/what-is-a-perceptron-basics-of-neural-networks-c4cfea20c590)。
  - 完成本课后，建议立即配合本库 [[深度学习/Neural_Network_Core/Your_First_Neural_Network]] 动手写一个完整训练脚本。

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[深度学习/Neural_Network_Core/Neural_Network_Core]]
  - [[深度学习/Neural_Network_Core/Your_First_Neural_Network]]
