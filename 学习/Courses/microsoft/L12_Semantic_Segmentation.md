---
title: "L12 - 语义分割与U-Net"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "computer-vision", "semantic-segmentation", "u-net", "medical-imaging"]
summary: "本课介绍如何将图像分割任务转化为逐像素分类，讲解编码器-解码器架构、SegNet 与 U-Net，并用 PH² 皮肤镜数据集进行医学图像分割实践。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/4-ComputerVision/12-Segmentation/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L12 Semantic Segmentation"
  - L12_Semantic_Segmentation
sources: []

---
# L12 - 语义分割与U-Net

> **一句话理解**：语义分割（Semantic Segmentation）把图像的每个像素都归到一个类别，实现比目标检测更精细的像素级定位；U-Net 通过编码器-解码器加跳跃连接，成为医学图像分割等场景的经典网络。

## 本课概览

前面的课程已经讲过如何用目标检测（Object Detection）在图像中画边界框（Bounding Box）来定位物体，但在医学影像、自动驾驶、工业质检等任务中，我们往往需要知道物体确切的轮廓——也就是像素级别的分类结果。这就是**分割（Segmentation）**要解决的问题。

本课把分割任务定义为**逐像素分类（Pixel Classification）**：对输入图像的每一个像素，预测它属于哪一类（背景也算一类）。课程重点区分了**语义分割**与**实例分割**，介绍了最基础的编码器-解码器架构 **SegNet**，以及通过**跳跃连接（Skip Connections）**提升定位精度的 **U-Net**。最后以皮肤镜图像中的痣（nevus）分割为例，演示如何在 PyTorch 和 TensorFlow 中训练分割网络。

学习目标：理解分割网络的整体结构、损失函数选择，以及 U-Net 为何能在医学小数据集上取得好效果；并能运行官方 Notebook 复现 SegNet 与 U-Net。

## 核心概念

- **分割 vs 目标检测**：目标检测输出的是框（bbox），只说明“这里有个物体”；分割输出的是与输入图像同样大小的**掩膜（Mask）**，标注每个像素属于哪一类。
- **语义分割（Semantic Segmentation）**：只判断像素的类别，不区分同类物体的不同实例。例如一群羊在语义分割中都是同一个“羊”类别。
- **实例分割（Instance Segmentation）**：在像素分类的基础上，把同一类别的不同物体区分开来。例如每只羊被标成不同实例。
- **编码器-解码器（Encoder-Decoder）**：
  - **编码器**用卷积和池化逐步下采样，提取高层次语义特征；
  - **解码器**通过上采样/转置卷积把特征恢复到原图尺寸，输出每个像素的类别分数。
  - 最终输出张量的尺寸通常与输入图像相同，通道数等于类别数（多分类），或单通道（二分类掩膜）。
- **SegNet**：一种简洁的编码器-解码器分割网络，编码器用标准卷积+池化，解码器用卷积+上采样，并加入批归一化（Batch Normalization）稳定训练。
- **U-Net**：在 SegNet 基础上增加了**跳跃连接**，把编码器各层的细节特征拼接到解码器对应层，弥补下采样过程中丢失的空间信息，使分割边界更精细。其结构呈对称的“U”形，最初由 Ronneberger 等人在 2015 年提出，广泛应用于生物医学图像分割。
- **分割损失函数**：由于目标是像素级类别，不能直接用图像重建常用的均方误差（MSE），而要使用分类损失——**交叉熵损失（Cross-Entropy Loss）**，并对所有像素取平均。二分类掩膜常用 **二元交叉熵（Binary Cross-Entropy, BCE）**：

  $$
  \mathcal{L}_{\text{BCE}} = -\frac{1}{N}\sum_{i=1}^{N}\left[ y_i \log(p_i) + (1-y_i)\log(1-p_i) \right]
  $$

  其中 $N$ 为像素总数，$y_i$ 为像素真实标签，$p_i$ 为模型预测概率。多分类时则对每个像素的 one-hot 标签与 softmax 输出求交叉熵并平均。

## 关键知识点

- 分割网络的输出是“图像尺寸 × 类别数”的张量，对每个像素可单独做 softmax/sigmoid 得到类别概率。
- 二值掩膜任务中，通常用 `BCEWithLogitsLoss`（PyTorch）或 `BinaryCrossentropy(from_logits=True)`（Keras），将 Sigmoid 放在损失内部以提高数值稳定性。
- SegNet 适合理解编码器-解码器思想，但下采样会损失空间细节；U-Net 的跳跃连接把这些细节“抄近路”传给解码器，显著提升边界定位。
- 医学图像分割是小样本、高标注成本的典型场景；U-Net 配合数据增强在少量标注数据上也能取得不错效果。
- 常见的分割评估指标包括**像素准确率（Pixel Accuracy）**、**交并比（IoU）**、**Dice 系数**等，本课 Notebook 主要用可视化掩膜对比做定性评估。

## 代码/实验说明

官方为这节课提供了两个可运行的 Jupyter Notebook，分别使用 **PyTorch** 和 **TensorFlow/Keras** 实现：

- PyTorch 版本：[SemanticSegmentationPytorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/12-Segmentation/SemanticSegmentationPytorch.ipynb)
- TensorFlow 版本：[SemanticSegmentationTF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/12-Segmentation/SemanticSegmentationTF.ipynb)

实验流程大致如下：

1. **数据准备**：下载 PH² 皮肤镜数据集（约 200 张图像及对应痣掩膜），将图像和掩膜都 resize 到 256×256，并按 9:1（PyTorch）或 8:2（TensorFlow）划分训练/测试集。
2. **构建 SegNet**：
   - 编码器：若干 `Conv2d → BatchNorm → ReLU → MaxPool` 模块；
   - 解码器：对应的上采样/转置卷积层，把特征图恢复到 256×256；
   - 输出层：二分类时输出单通道 logits。
3. **构建 U-Net**：在 SegNet 基础上，将编码器每层特征拼接到解码器对应层，实现跳跃连接。
4. **训练**：
   - PyTorch 示例：
     ```python
     model = UNet().to(device)
     optimizer = optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-6)
     loss_fn = nn.BCEWithLogitsLoss()
     train(dataloaders, model, loss_fn, optimizer, epochs, device)
     ```
   - TensorFlow/Keras 示例：
     ```python
     model = UNet()
     optimizer = optimizers.Adam(learning_rate=3e-4, decay=8e-9)
     loss_fn = losses.BinaryCrossentropy(from_logits=True)
     model.compile(loss=loss_fn, optimizer=optimizer)
     model.fit(X_train, y_train, epochs=100, batch_size=64, validation_data=(X_test, y_test))
     ```
5. **推理与可视化**：对测试图像做前向传播，将输出经过 Sigmoid 后按 0.5 阈值二值化，再与真实掩膜并排对比。

> 注意：PH² 数据集原始格式为 `.rar`，Notebook 中使用 `!apt-get install rar`、`!wget` 和 `!unrar` 下载解压；在本地运行时需确保系统已安装 `unrar`，或自行改用其他解压方式。

## 本课不覆盖与延伸

- **本课不覆盖**：
  - 实例分割算法（如 Mask R-CNN）与全景分割（Panoptic Segmentation）；
  - 现代多尺度/注意力分割架构（如 DeepLab、PSPNet、SegFormer、SAM）；
  - 分割专用的 Dice Loss、Focal Loss、IoU Loss 等进阶损失函数；
  - 分割数据增强、多类别标注、COCO 等通用数据集训练细节。

- **延伸方向**：
  - 阅读 U-Net 原论文：[U-Net: Convolutional Networks for Biomedical Image Segmentation](https://arxiv.org/pdf/1505.04597.pdf)
  - 了解 SegNet：[SegNet: A Deep Convolutional Encoder-Decoder Architecture for Image Segmentation](https://arxiv.org/pdf/1511.00561.pdf)
  - 医学分割进阶：nnU-Net、3D U-Net、Transformer-based 分割；
  - 通用分割：Mask R-CNN、Segment Anything Model (SAM)、OpenPose 等人体姿态/关键点检测。

## 相关阅读

- 课程索引：[[学习/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[计算机视觉/Segmentation/Segmentation]]
  - [[计算机视觉/Segmentation/Segmentation_for_dummy]]
  - [[计算机视觉/CV-in-nutshell]]
  - [[计算机视觉/Image_Classification_Detection/Image_Classification_Detection]]
