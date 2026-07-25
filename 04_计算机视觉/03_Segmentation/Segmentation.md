---
title: '图像分割 (Image Segmentation)'
category: '04-computer-vision-segmentation'
tags: ["computer-vision", "cnn", "image-processing"]
summary: '> **一句话理解**: 如果目标检测是告诉你"图中哪里有猫"（画个框），那图像分割就是精确到"哪些像素属于猫"（描出轮廓）。分割是计算机视觉中最精细的空间理解任务。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
sources: []

---
# 图像分割 (Image Segmentation)

> **一句话理解**: 如果目标检测是告诉你"图中哪里有猫"（画个框），那图像分割就是精确到"哪些像素属于猫"（描出轮廓）。分割是计算机视觉中最精细的空间理解任务。

## 1. 概述 (Overview)

图像分割 (Image Segmentation) 是将图像中的每个像素分配到特定类别或实例的任务。它是计算机视觉中最基础且应用最广泛的技术之一，直接支撑自动驾驶、医学影像分析、遥感图像解读等关键应用。

### 分割任务层次

```
分割任务金字塔 (精细度递增):

  ┌──────────────────────────────────┐
  │       全景分割 Panoptic          │  ← 最完整：每个像素都有类别+实例ID
  ├──────────────────────────────────┤
  │  实例分割          │  语义分割    │
  │  Instance Seg.     │ Semantic Seg.│
  │  (区分同类不同个体) │ (区分不同类) │
  ├──────────────────────────────────┤
  │       目标检测 Object Detection   │  ← 只给边界框
  └──────────────────────────────────┘
```

| 任务 | 输出 | 示例 |
|------|------|------|
| **语义分割 (Semantic)** | 每个像素一个类别标签 | 所有"人"标为同一颜色 |
| **实例分割 (Instance)** | 每个像素一个实例 ID | 不同的"人"标为不同颜色 |
| **全景分割 (Panoptic)** | 语义 + 实例的组合 | 可数物体分实例，不可数物体(天空/道路)按语义 |

---

## 2. 核心概念 (Core Concepts)

### 2.1 语义分割 (Semantic Segmentation)

给图像中每个像素分配一个类别标签。同类别的不同个体不做区分。

**核心挑战**:
- 需要同时理解全局语义（"这是一条路"）和局部细节（"路的精确边界"）
- 计算量大：输出分辨率与输入相同，每个像素都需要分类

### 2.2 编码器-解码器架构 (Encoder-Decoder Architecture)

几乎所有分割模型都采用编码器-解码器结构：

```
输入图像 (H×W×3)
    ↓
┌─────────────┐
│   Encoder   │  下采样：提取语义特征，分辨率逐步降低
│  (ResNet等) │  H×W → H/2×W/2 → H/4×W/4 → ... → H/32×W/32
└──────┬──────┘
       │ 跳跃连接 (Skip Connections)
┌──────↓──────┐
│   Decoder   │  上采样：恢复空间分辨率
│ (反卷积等)  │  H/32×W/32 → ... → H/4×W/4 → H/2×W/2 → H×W
└─────────────┘
    ↓
分割图 (H×W×C)  C=类别数，每个像素一个类别概率分布
```

---

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 FCN (Fully Convolutional Network, 2015)

**开创性贡献**: 首次证明可以用全卷积网络做端到端的像素级分类。

- **核心思想**: 将分类网络（如 VGG）的全连接层替换为卷积层，使网络可以接受任意尺寸输入
- **上采样方式**: 反卷积 (Transposed Convolution)
- **跳跃连接**: FCN-8s 融合了 pool3、pool4、pool5 的特征，提升边缘精度

### 3.2 U-Net (2015)

**设计目标**: 专为医学图像设计，适合小数据集训练。

```
U-Net 架构（U形结构）:

编码路径                              解码路径
  [64]  ──── skip connection ────→  [64]
    ↓ pool                            ↑ up
  [128] ──── skip connection ────→  [128]
    ↓ pool                            ↑ up
  [256] ──── skip connection ────→  [256]
    ↓ pool                            ↑ up
  [512] ──── skip connection ────→  [512]
    ↓ pool                            ↑ up
              [1024] (瓶颈层)
```

**关键创新**:
- **对称的编码器-解码器**: 解码器路径与编码器路径对称
- **密集跳跃连接**: 每一层都有跳跃连接，将编码器的高分辨率特征与解码器的语义特征融合
- **数据增强**: 大量弹性形变增强，解决医学影像数据稀缺问题

**U-Net 变体**:
- **U-Net++**: 嵌套的跳跃连接，更平滑的特征过渡
- **Attention U-Net**: 在跳跃连接处加注意力门控，自动聚焦重要区域
- **nnU-Net**: 自适应配置的 U-Net，自动调整架构和超参数

### 3.3 DeepLab 系列

通过空洞卷积 (Atrous/Dilated Convolution) 在不降低分辨率的前提下扩大感受野。

**空洞卷积直觉**:
```
标准3×3卷积 (感受野3×3):     空洞卷积 rate=2 (感受野5×5):
  * * *                       *   *   *
  * * *                       
  * * *                       *   *   *
                              
                              *   *   *
```

| 版本 | 核心创新 | 年份 |
|------|---------|------|
| **DeepLab v1** | 引入空洞卷积 + CRF 后处理 | 2015 |
| **DeepLab v2** | ASPP (Atrous Spatial Pyramid Pooling) 多尺度特征 | 2017 |
| **DeepLab v3** | 改进 ASPP + 全局平均池化 | 2017 |
| **DeepLab v3+** | 编码器-解码器 + ASPP，效果最佳 | 2018 |

### 3.4 Mask R-CNN (实例分割)

在 Faster R-CNN 的基础上增加一个分割分支：

```
Mask R-CNN 流程:

输入图像 → [Backbone] → [FPN] → [RPN] → 候选区域
                                           ↓
                                    [ROI Align]
                                     ↓     ↓
                              [分类+回归] [分割掩码]
                              "这是一只猫" 猫的像素掩码
```

**关键技术**:
- **ROI Align**: 替代 ROI Pooling，避免量化误差导致的空间不对齐
- **掩码分支**: 对每个 ROI 预测一个二值掩码（$m \times m$）
- **解耦设计**: 分类和分割解耦，不同类共享掩码预测

### 3.5 SAM (Segment Anything Model, 2023)

Meta AI 发布的通用分割基础模型，号称"分割一切"。

```
SAM 架构:

[图像] → [Image Encoder (ViT-H)] → 图像嵌入
                                       ↓
[提示] → [Prompt Encoder] ──────→ [Mask Decoder] → 分割掩码
  点/框/文本                    轻量级Transformer
```

**核心能力**:
- **零样本泛化**: 在 SA-1B 数据集（11M 图像, 1B 掩码）上训练，可泛化到任何领域
- **交互式分割**: 支持点击、框选、文本等多种提示方式
- **多掩码输出**: 对模糊提示输出多个候选掩码

**SAM 2 (2024)**: 扩展到视频分割，支持时间维度的追踪和分割。

---

## 4. 代码实战 (Hands-on Code)

### 4.1 使用 torchvision 的 DeepLab v3

```python
import torch
import torchvision.transforms as T
from torchvision.models.segmentation import deeplabv3_resnet101, DeepLabV3_ResNet101_Weights
from PIL import Image

# 加载预训练模型 (COCO 数据集, 21个类别)
weights = DeepLabV3_ResNet101_Weights.DEFAULT
model = deeplabv3_resnet101(weights=weights).eval()

# 图像预处理
preprocess = weights.transforms()

# 推理
image = Image.open("street_scene.jpg")
input_tensor = preprocess(image).unsqueeze(0)  # (1, 3, H, W)

with torch.no_grad():
    output = model(input_tensor)['out']  # (1, 21, H, W)
    
# 取每个像素的最大类别概率
pred_mask = output.argmax(dim=1).squeeze(0)  # (H, W)

# COCO 类别: 0=背景, 1=飞机, 2=自行车, ..., 15=人, 20=电视
print(f"检测到的类别: {pred_mask.unique().tolist()}")
```

### 4.2 使用 SAM 进行交互式分割

```python
from segment_anything import sam_model_registry, SamPredictor

# 加载 SAM 模型
sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
predictor = SamPredictor(sam)

# 设置图像
image = cv2.imread("photo.jpg")
predictor.set_image(image)

# 点击提示: 点击图像中的一个点
input_point = np.array(``[ [500, 375] ]``)     # (x, y) 坐标
input_label = np.array([1])              # 1=前景, 0=背景

masks, scores, logits = predictor.predict(
    point_coords=input_point,
    point_labels=input_label,
    multimask_output=True  # 返回3个候选掩码
)

# masks: (3, H, W)  三个候选掩码
# scores: (3,)      每个掩码的置信度
best_mask = masks[scores.argmax()]  # 取最高分的掩码
```

---

## 5. 应用场景与案例 (Applications & Cases)

| 应用领域 | 分割类型 | 具体应用 | 关键要求 |
|---------|---------|---------|---------|
| **自动驾驶** | 全景分割 | 道路/车辆/行人/交通标志分割 | 实时性（>30 FPS） |
| **医学影像** | 语义分割 | 器官分割、肿瘤边界检测、细胞计数 | 高精度、小目标 |
| **遥感图像** | 语义分割 | 土地利用分类、建筑物提取 | 超大分辨率处理 |
| **视频会议** | 实例分割 | 人物背景虚化/替换 | 实时 + 边缘精度 |
| **工业质检** | 语义分割 | 缺陷检测和定位 | 微小缺陷检测 |
| **AR/VR** | 实例分割 | 物体识别与虚拟交互 | 低延迟 |

### 分割损失函数对比

| 损失函数 | 公式概述 | 适用场景 |
|---------|---------|---------|
| **交叉熵 (CE)** | $-\sum y \log(\hat{y})$ | 通用，类别均衡时首选 |
| **Dice Loss** | $1 - \frac{2\|P \cap G\|}{\|P\| + \|G\|}$ | 类别不均衡（医学影像常用） |
| **Focal Loss** | $-\alpha(1-\hat{y})^\gamma \log(\hat{y})$ | 难例挖掘，小目标检测 |
| **Lovász Loss** | IoU 的连续可微近似 | 直接优化 IoU 指标 |
| **CE + Dice** | 两者加权求和 | 实践中最常用的组合 |

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 实时分割

- **BiSeNet v2**: 双路径设计（空间路径 + 语义路径），>150 FPS
- **PIDNet**: 三分支轻量架构，平衡精度和速度
- **MobileSeg**: 基于 MobileNet 的移动端分割

### 6.2 3D 分割

- **点云分割**: PointNet/PointNet++ 直接处理 3D 点云
- **体素分割**: 将 3D 空间栅格化后用 3D 卷积
- **应用**: 自动驾驶 LiDAR 点云理解、医学 CT/MRI 3D 分割

### 6.3 视频分割

- **SAM 2**: Meta 的视频分割基础模型，单帧标注即可追踪整个视频
- **XMem**: 基于记忆的视频目标分割
- **挑战**: 时间一致性、遮挡处理、目标进出场

### 6.4 常见陷阱与最佳实践

1. **类别不均衡**: 背景像素远多于前景 → 使用 Dice Loss 或 Focal Loss
2. **边界模糊**: 下采样丢失边缘细节 → 使用跳跃连接、边界监督辅助损失
3. **大目标+小目标**: 不同尺度目标难以兼顾 → 多尺度特征融合（FPN/ASPP）
4. **过拟合**: 标注数据昂贵 → 数据增强（翻转/旋转/弹性形变）、半监督学习

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- [图像分类与检测](../Image_Classification_Detection/Image_Classification_Detection.md) — CNN 基础和目标检测概念
- [神经网络核心](03_深度学习/02_Neural_Network_Core/Neural_Network_Core.md) — 卷积操作、反向传播
- [Transformer 革命](05_大模型/04_Transformer_Revolution/Transformer_Revolution.md) — ViT 在分割中的应用（SAM）

### 进阶方向
- [生成模型](../Generative_Models/Generative_Models.md) — 分割掩码可用于引导图像生成（ControlNet）
- [多模态视觉](../Multimodal_Vision/Multimodal_Vision.md) — 文本引导的开放词汇分割
- [模型部署与推理](10_部署推理/01_Deployment_Fundamentals/Deployment_Inference.md) — 分割模型的实时部署优化

---

## 8. 面试高频问题 (Interview FAQs)

**Q1: 语义分割、实例分割和全景分割的区别？**
> 语义分割：每个像素分配类别，但不区分同类不同个体（两只猫都标为"猫"）。实例分割：区分同类的不同个体（猫1、猫2），但不处理不可数类别。全景分割：结合两者，可数物体分实例，不可数背景（天空/道路）按语义分类。

**Q2: U-Net 为什么在医学影像中如此成功？**
> 三个原因：(1) 跳跃连接保留了高分辨率空间信息，适合精细分割；(2) 对称的编码器-解码器结构参数效率高；(3) 搭配弹性形变等数据增强，在小数据集上也能训练良好。

**Q3: 空洞卷积相比普通卷积的优势？**
> 空洞卷积在不增加参数量和计算量的前提下扩大感受野。普通 3x3 卷积感受野为 3x3，而 rate=2 的空洞卷积感受野为 5x5。这在分割中很重要，因为需要大感受野理解全局语义，同时保持分辨率不下降。

**Q4: 分割任务中如何处理类别不均衡问题？**
> (1) 损失函数层面：使用 Dice Loss、Focal Loss 或两者组合；(2) 采样策略：Online Hard Example Mining (OHEM)，优先训练难例；(3) 数据层面：过采样少数类、欠采样多数类；(4) 类别权重：在 CE Loss 中为少数类设置更高权重。

**Q5: SAM 的核心创新是什么？它有什么局限性？**
> 核心创新：(1) 大规模标注数据（SA-1B: 11M 图像, 1B 掩码）使其成为通用分割基础模型；(2) 灵活的提示系统（点/框/文本）支持交互式分割；(3) 零样本泛化到未见过的领域。局限性：(1) 对细粒度语义理解有限（不知道分出来的是什么）；(2) 图像编码器计算量大（ViT-H），不适合边缘设备；(3) 在某些专业领域（如医学影像）精度不如专用模型。

---

## 9. 参考资源 (References)

### 经典论文
- [Fully Convolutional Networks for Semantic Segmentation (Long et al., 2015)](https://arxiv.org/abs/1411.4038) — FCN 开创论文
- [U-Net: Convolutional Networks for Biomedical Image Segmentation (Ronneberger et al., 2015)](https://arxiv.org/abs/1505.04597) — U-Net 原始论文
- [Rethinking Atrous Convolution for Semantic Image Segmentation (Chen et al., 2017)](https://arxiv.org/abs/1706.05587) — DeepLab v3
- [Mask R-CNN (He et al., 2017)](https://arxiv.org/abs/1703.06870) — 实例分割里程碑
- [Segment Anything (Kirillov et al., 2023)](https://arxiv.org/abs/2304.02643) — SAM 论文

### 开源工具
- [MMSegmentation (OpenMMLab)](https://github.com/open-mmlab/mmsegmentation) — 统一的分割训练框架
- [Detectron2 (Meta)](https://github.com/facebookresearch/detectron2) — 包含 Mask R-CNN 实现
- [Segment Anything (Meta)](https://github.com/facebookresearch/segment-anything) — SAM 官方实现

### 基准数据集
- [Cityscapes](https://www.cityscapes-dataset.com/) — 城市街景分割
- [ADE20K](https://groups.csail.mit.edu/vision/datasets/ADE20K/) — 150 类通用场景分割
- [COCO Panoptic](https://cocodataset.org/) — 全景分割基准

---
*Last updated: 2026-02-10*

## 相关链接

- [[04_计算机视觉/03_Segmentation/Segmentation_for_dummy|图像分割 (小白版)]] — 本篇的零基础版本
- [[04_计算机视觉/03_Segmentation/index|图像分割索引]] — 主题导览
- [[04_计算机视觉/02_Image_Classification_Detection/Object_Detection_Deep_Dive|目标检测深度解析]] — 分割与检测的关系
- [[概念/Vision/image-segmentation|图像分割]] — 概念卡片
- [[概念/Vision/sam|SAM]] — 分割代表模型
- [[04_计算机视觉/01_CV_Fundamentals/CV_Fundamentals|计算机视觉基础]] — CV 基础知识
