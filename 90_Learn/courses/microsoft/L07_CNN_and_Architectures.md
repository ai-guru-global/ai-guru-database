---
title: "L07 - 卷积神经网络与 CNN 架构"
category: "90-learn"
tags: ["microsoft-ai-course", "computer-vision", "cnn", "pytorch", "tensorflow", "vgg"]
summary: "本节课介绍卷积神经网络（Convolutional Neural Network, CNN）的核心思想：用可学习的卷积滤波器自动提取图像中的局部模式，并通过层级特征金字塔逐步组合成高级语义，最终完成图像分类。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/4-ComputerVision/07-ConvNets/README.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L07 - 卷积神经网络与 CNN 架构

> **一句话理解**：CNN 让神经网络像“看图找特征”一样，用可学习的滑动窗口自动发现边缘、纹理、部件乃至整体对象，从而解决真实图像中目标位置不固定的问题。

## 本课概览

本课是 Microsoft AI For Beginners 计算机视觉模块的第二课，承接 L06「计算机视觉简介与 OpenCV」。如果说 OpenCV 教会我们用传统手段处理图像，那么本课则进入**数据驱动的特征学习**阶段：不再手动设计边缘检测器，而是让卷积核（Convolutional Kernel）自己从数据中学出来。

在前面的感知器（Perceptron）与多层感知器（MLP, Multi-Layer Perceptron）课程中，我们已经看到全连接网络可以识别居中的 MNIST 手写数字。但 MNIST 图像非常“规矩”——数字始终居中、大小一致。真实世界的照片里，猫可能出现在左上角、右下角或被部分遮挡，因此模型需要关注**局部模式的存在与相对位置**，而非像素坐标的绝对值。

通过本课，你将理解：

1. 卷积运算如何用一个小窗口提取局部特征。
2. 为什么 CNN 具有**平移等变性**（Translation Equivariance），即同一个特征在不同位置被同样检测。
3. CNN 的**层级特征金字塔**：从低阶边缘到高阶对象部件的逐步组合。
4. 经典 CNN 架构（如 VGG-16）如何通过“空间分辨率下降、通道数上升”来构建深层网络。

## 核心概念

- **卷积滤波器 / 卷积核（Convolutional Filter / Kernel）**：一个较小的权重矩阵（常见 3×3、5×5），在输入图像上逐像素滑动，计算局部加权平均。可以把卷积看作一种“可学习的局部模板匹配”。

- **卷积运算的数学本质**：对于输入图像 \(I\) 和卷积核 \(K\)，在位置 \((i,j)\) 的输出为：

  \[
  (I * K)(i,j) = \sum_{m}\sum_{n} I(i+m, j+n) \, K(m,n)
  \]

  其中 \(m,n\) 遍历卷积核的元素。实际实现中还会引入**步幅（Stride）**控制滑动间隔、**填充（Padding）**控制输出尺寸。

- **边缘检测器示例**：给定的 3×3 垂直边缘核与水平边缘核可以直接在 MNIST 数字上激活竖线或横线位置。这说明人工设计滤波器可以提取低级特征，但 CNN 更进一步——这些滤波器由反向传播（Backpropagation）自动学习。

- **Leung-Malik 滤波器组（Leung-Malik Filter Bank）**：传统计算机视觉中手工设计的一组多尺度、多方向滤波器，用于纹理与边缘分析。CNN 可以把它看作“可学习版滤波器组”的灵感来源。

- **层级特征提取（Hierarchical Feature Extraction）**：
  - 第一层：检测边缘、颜色梯度等低级模式。
  - 中间层：组合低级模式为角点、纹理、简单形状。
  - 深层：组合成对象部件乃至完整物体（如猫耳、车轮、人脸轮廓）。

- **金字塔架构（Pyramid Architecture）**：CNN 通常逐层降低特征图（Feature Map）的空间尺寸，同时增加通道数。空间尺寸下降减少计算量，通道数上升则编码更多样的特征组合。

- **VGG-16**：2014 年 ImageNet 分类竞赛中的经典网络，以堆叠多个 3×3 卷积层、配合 2×2 最大池化（Max Pooling）著称，Top-5 准确率约 92.7%。它的成功证明：小而深的卷积核比大卷积核更高效、表达能力更强。

## 关键知识点

- 全连接网络处理图像时会把二维图像展平成一维向量，丢失空间结构；卷积则直接保留二维邻域关系。
- 同一卷积核在整个图像上共享权重，因此参数量远小于同等感受野的全连接层，也更不容易过拟合。
- CNN 的三个核心假设使其适合图像：
  1. **局部连接**：每个神经元只连接局部区域。
  2. **权重共享**：同一核在全局复用。
  3. **层级组合**：低层特征逐层组合为高层语义。
- 池化（Pooling，通常是最大池化）负责降低空间分辨率、引入一定平移不变性（Translation Invariance），并扩大后续层的感受野。
- VGG 类网络的规律：随深度增加，特征图宽高减半，通道数倍增，最终接全连接层或全局平均池化（Global Average Pooling）进行分类。

## 代码/实验说明

官方提供了两个可运行的 Jupyter Notebook，分别基于 PyTorch 与 TensorFlow/Keras，路径在课程目录中：

- **PyTorch 版本**：[ConvNetsPyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/07-ConvNets/ConvNetsPyTorch.ipynb)
- **TensorFlow 版本**：[ConvNetsTF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/07-ConvNets/ConvNetsTF.ipynb)

两个 Notebook 通常会完成以下任务：

1. 加载 MNIST 或 Fashion-MNIST 数据集。
2. 定义一个 CNN，结构类似 `卷积 → 激活 → 池化 → 卷积 → 激活 → 池化 → 全连接 → 输出`。
3. 训练模型并观察验证准确率，对比 MLP 与 CNN 的差异。
4. 可视化卷积核或特征图，直观理解第一层学到的边缘检测器。

PyTorch 伪代码示意：

```python
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1),  # 1→16 通道
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1), # 16→32 通道
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32 * 7 * 7, 128),
            nn.ReLU(),
            nn.Linear(128, 10)
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)
```

TensorFlow/Keras 伪代码示意：

```python
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Conv2D(16, 3, activation='relu', padding='same', input_shape=(28,28,1)),
    keras.layers.MaxPooling2D(2,2),
    keras.layers.Conv2D(32, 3, activation='relu', padding='same'),
    keras.layers.MaxPooling2D(2,2),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])
```

> 建议先运行 PyTorch 版本，再对照 TensorFlow 版本体会两个框架在 API 风格上的异同。

## 本课不覆盖与延伸

- **不覆盖**：
  - 卷积的反向传播与梯度如何穿过权重共享机制。
  - 批量归一化（Batch Normalization）、残差连接（Residual Connection）等现代 CNN 训练技巧。
  - 目标检测、语义分割、生成对抗网络等更广泛的视觉任务。

- **延伸**：
  - 官方同目录的 [CNN_Architectures.md](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/07-ConvNets/CNN_Architectures.md) 详细介绍了 AlexNet、ResNet、Inception、MobileNet 等经典架构，建议继续阅读。
  - 完成本课后，继续学习 L08「预训练网络、迁移学习与训练技巧」。

## 相关阅读

- 课程索引：[[90_Learn/Courses/Microsoft_AI_For_Beginners]]
- 本库相关页面：
  - [[05_Computer_Vision/Image_Classification_Detection/Image_Classification_Detection]]
  - [[05_Computer_Vision/CV-in-nutshell]]
