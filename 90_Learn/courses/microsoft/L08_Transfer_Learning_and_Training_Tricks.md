---
title: "L08 - 预训练网络、迁移学习与训练技巧"
category: "90-learn"
tags: ["microsoft-ai-course", "computer-vision", "transfer-learning", "fine-tuning", "training-tricks", "pytorch", "tensorflow"]
summary: "在大型图像数据集上预训练的卷积神经网络（CNN）可迁移到下游分类任务；配合批归一化、Dropout、学习率衰减等训练技巧，可用少量数据快速训练出高性能图像分类器。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/4-ComputerVision/08-TransferLearning/README.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L08 - 预训练网络、迁移学习与训练技巧

> **一句话理解**：与其从零训练一个卷积神经网络（Convolutional Neural Network，CNN），不如借用已经在 ImageNet 等大规模数据上学到的通用视觉特征，再针对自己的任务做少量微调，从而省时、省数据、效果往往更好。

---

## 本课概览

迁移学习（Transfer Learning）是深度学习中最重要的工程技巧之一。训练一个深层 CNN 从零开始识别图像，既需要大量标注数据，也需要昂贵的计算资源；而实践中，很多底层特征（边缘、纹理、形状）具有跨任务的通用性。本课介绍如何利用 **ImageNet 预训练模型**作为特征提取器，并在「猫狗分类」等实际任务上做微调，快速获得较高准确率。

此外，深层网络训练还面临梯度消失/爆炸、过拟合、数值不稳定等问题。课程同时介绍了一系列 **训练技巧（Training Tricks）**，包括合理的权重初始化、批归一化（Batch Normalization）、Dropout、优化器选择、学习率衰减等，帮助你更稳定地训练更深的网络。

**学习目标**：
1. 理解迁移学习的核心思想：将预训练模型学到的通用知识迁移到新任务。
2. 掌握把预训练 CNN 当作特征提取器，并只替换/微调顶层分类器的流程。
3. 了解 VGG、ResNet、MobileNet 等常见预训练模型的特点与适用场景。
4. 认识对抗样本（Adversarial Examples）和理想图像可视化背后的优化思路。
5. 熟悉深层网络训练的常见技巧：初始化、批归一化、Dropout、优化器、学习率调度等。

---

## 核心概念

### 1. 迁移学习（Transfer Learning）
迁移学习指将一个模型在某一大规模数据集上学习到的知识，迁移到另一个相关但不同的任务中。具体到计算机视觉，通常是：
- 使用在 ImageNet 上训练好的 CNN 作为 **特征提取器（Feature Extractor）**；
- 冻结其卷积层权重，保留通用低级/中级特征；
- 仅训练新增的全连接分类层（或再做少量端到端微调）。

这样做的好处显而易见：
- **数据需求少**：自定义数据集几百到几千张图片即可；
- **训练速度快**：底层卷积层无需重新学习；
- **泛化能力强**：预训练模型已经见过海量自然图像，提取的特征更鲁棒。

### 2. 预训练模型的层级特征
CNN 的浅层通常学习边缘、颜色、纹理等低级特征；中间层学习部件、形状；深层则组合成语义级别的概念（如眼睛、车轮、火焰）。因此，冻结浅层、只训练高层分类器，是迁移学习最常见的策略。

### 3. 常见预训练架构
| 模型 | 特点 | 适用场景 |
|------|------|----------|
| **VGG-16 / VGG-19** | 结构简单、层数较深，准确率不错 | 快速验证迁移学习效果的首选 |
| **ResNet** | 引入残差连接（Residual Connection），可训练非常深的网络 | 追求更高精度，计算资源充足时 |
| **MobileNet** | 轻量化设计，参数量和计算量小 | 移动端、边缘设备或资源受限场景 |

### 4. 理想图像可视化与对抗样本
预训练网络内部编码了「理想猫」「理想狗」等概念。我们可以从一张随机噪声图像出发，通过 **梯度下降（Gradient Descent）** 优化像素，使网络对某个类别（如「猫」）的输出概率最大化：

```
输入：随机图像 x
目标：最大化 model(x)[cat]
方法：重复 x ← x - η · ∇_x loss(model(x), cat)
```

直接优化会得到充满高频噪声的图像。为让结果更平滑、更具视觉可解释性，可在损失中加入 **变化损失（Variation Loss）**，约束相邻像素差异不要过大。

类似地，若对一张真实的狗图做微小扰动，使其被网络误判为猫，就得到了 **对抗样本（Adversarial Example）**：

```
输入：狗图 x，真实标签 dog
目标：让 model(x + δ) 输出 cat，同时 ||δ|| 尽量小
```

这揭示了深度网络对输入扰动的脆弱性，也是 AI 安全研究的重要方向。

---

## 关键知识点

- **预训练模型作特征提取器**：加载 ImageNet 权重后，去掉最后的分类层，用倒数第二层的向量作为新特征输入到自定义分类器中。
- **冻结与微调（Freeze & Fine-tune）**：
  - **冻结（Freeze）**：训练初期锁定卷积层权重，只训练新的全连接层；
  - **微调（Fine-tune）**：在分类层收敛后，以较小学习率解冻部分卷积层，做端到端精调。
- **数据集缩放与归一化**：输入图像应按预训练模型训练时使用的均值/方差做归一化（如 ImageNet 标准），并缩放到同一尺寸。
- **数值稳定性**：将输入值缩放到 [-1, 1] 或 [0, 1]，避免浮点运算中数量级差异过大带来的精度损失。
- **权重初始化**：
  - 简单高斯 N(0,1) 不适合深层网络，因为会导致方差逐层放大；
  - **Xavier / Glorot 初始化**：N(0, √(2/(n_in + n_out)))，有助于保持前向和反向传播中信号幅度稳定。
- **批归一化（Batch Normalization）**：在每个小批量（minibatch）内做减均值、除标准差的归一化，再接可学习的缩放与平移参数；通常放在线性层之后、激活函数之前，能加速收敛并提升精度。
- **Dropout**：训练时以一定概率（如 10%–50%）随机丢弃神经元，相当于训练多个子网络的隐式集成（Implicit Model Averaging），有效抑制过拟合。
- **防止过拟合**：早停（Early Stopping）、权重衰减 / L2 正则化（Weight Decay / Regularization）、模型平均（Model Averaging）、Dropout。
- **优化器选择**：
  - **SGD（随机梯度下降）**：最基础，但收敛较慢；
  - **Momentum SGD**：引入速度向量 v，保留历史梯度方向，帮助越过局部极小值；
  - **Adam**：结合动量 + 自适应学习率，大多数场景下的默认推荐；
  - **Adagrad / RMSProp**：对稀疏梯度或不同参数尺度做自适应调整。
- **梯度裁剪（Gradient Clipping）**：当梯度范数 ||∇L|| 超过阈值 θ 时，将其缩放为 θ，防止梯度爆炸。
- **学习率衰减（Learning Rate Decay）**：训练初期用较大学习率快速接近最优解，后期用较小学习率精细调整；常见方式有按 epoch 乘以一个衰减系数（如 0.98）或使用学习率调度器（Learning Rate Schedule）。

---

## 代码/实验说明

### 官方 Notebook
本课提供两个框架版本的迁移学习可运行代码，建议在阅读理论后挑一个框架运行：

- **PyTorch 版本**：[TransferLearningPyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/08-TransferLearning/TransferLearningPyTorch.ipynb)
- **TensorFlow 版本**：[TransferLearningTF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/08-TransferLearning/TransferLearningTF.ipynb)

两个 Notebook 的核心流程一致：
1. 加载 [Microsoft Cats vs. Dogs 数据集](https://www.microsoft.com/download/details.aspx?id=54765&WT.mc_id=academic-77998-cacaste)。
2. 使用 Keras / PyTorch 内置接口加载 ImageNet 预训练模型（如 VGG、ResNet）。
3. 冻结预训练卷积层，替换顶层为二分类（猫 / 狗）输出层。
4. 训练新的分类层，然后在验证集上评估。
5. （可选）以更小学习率解冻部分层，做端到端微调。

PyTorch 中的典型片段：

```python
import torchvision.models as models

# 加载预训练 VGG16
model = models.vgg16(pretrained=True)

# 冻结特征提取层
for param in model.features.parameters():
    param.requires_grad = False

# 替换分类头为自定义二分类器
model.classifier[-1] = torch.nn.Linear(4096, 2)

# 只训练分类层
optimizer = torch.optim.Adam(model.classifier.parameters(), lr=1e-4)
```

TensorFlow / Keras 中的典型片段：

```python
import tensorflow as tf

base_model = tf.keras.applications.VGG16(
    weights='imagenet', include_top=False, input_shape=(224, 224, 3)
)
base_model.trainable = False  # 冻结

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
```

### 对抗样本与理想图像
课程还提供了 TensorFlow 版本的对抗样本实验：

- [Ideal and Adversarial Cat - TensorFlow](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/08-TransferLearning/AdversarialCat_TF.ipynb)

该 Notebook 演示如何从随机噪声优化出被网络高置信度识别为「猫」或「斑马」的图像，以及如何对真实狗图添加微小扰动使其被误判为猫。

### 课后实验（Lab）
官方 Lab 使用 [Oxford-IIIT Pets 数据集](https://www.robots.ox.ac.uk/~vgg/data/pets/)，包含 35 个猫狗品种。任务是利用迁移学习构建一个品种分类器，是迁移学习从二分类到多分类的实际演练。

---

## 本课不覆盖与延伸

- **不覆盖**：
  - 从零设计新的 CNN 架构（参见 L07 卷积神经网络与 CNN 架构）。
  - 目标检测、语义分割等更复杂的视觉任务（参见 L11、L12）。
  - 自然语言处理中的迁移学习与微调（如 BERT、GPT 等预训练语言模型，参见 L18–L20）。
  - 分布式训练、混合精度训练、大规模调优等工程细节（参见本库 [[07_Model_Training/Distributed_Training_2026]]、[[07_Model_Training/Mixed_Precision_Training]]）。

- **延伸**：
  - 若想系统了解图像分类与检测理论，可阅读本库 [[05_Computer_Vision/Image_Classification_Detection/Image_Classification_Detection]]。
  - 若想深入微调策略（全量微调、参数高效微调 PEFT、LoRA 等），可阅读 [[07_Model_Training/Fine_tuning_Strategies]]。
  - 若想理解优化器进阶与训练动态，可参考 [[07_Model_Training/Optimizer_Advanced_2026]]、[[07_Model_Training/Training_Optimization_2026]]。
  - 对抗样本相关内容也是 AI 安全与可解释性的入口，可延伸阅读 [[19_Ethics_Safety/AI_Safety_RedTeaming/AI_Safety_RedTeaming]] 或 [[19_Ethics_Safety/AI_Security_2026/AI_Security_2026]]。

---

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[05_Computer_Vision/Image_Classification_Detection/Image_Classification_Detection]]
  - [[07_Model_Training/Fine_tuning_Strategies]]
- 官方课前测验：[Pre-lecture quiz](https://ff-quizzes.netlify.app/en/ai/quiz/15)
- 官方课后测验：[Post-lecture quiz](https://ff-quizzes.netlify.app/en/ai/quiz/16)
- 扩展阅读：[TrainingTricks.md（官方）](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/08-TransferLearning/TrainingTricks.md)
