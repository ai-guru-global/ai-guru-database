---
title: 计算机视觉
category: -concepts
tags: ["computer-vision", "image-classification", "object-detection", "cnn", "vit", "deep-learning"]
aliases: [Computer multimodal-vision, CV, 计算机视觉基础]
relationships:
  - target: "[[概念/object-detection]]"
    type: related_to
  - target: "概念/image-segmentation"
    type: related_to
  - target: "概念/multimodal-vision"
    type: related_to
sources:
  - 计算机视觉/image-segmentation_supervised-learning_object-detection/Image_Classification_Detection.md
  - 计算机视觉/CV_Fundamentals/ViT_Deep_Dive.md
  - 计算机视觉/3D_Vision/3D_Vision.md
summary: 计算机视觉让机器理解图像和视频，涵盖分类、检测、分割等任务，CNN与ViT是两大支柱架构。
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21
---

# 计算机视觉

计算机视觉（Computer Vision, CV）旨在让机器从图像和视频中提取有意义的信息。从2012年AlexNet开启深度学习时代，到Vision transformer-architecture打破CNN垄断，CV经历了架构范式的根本性转变。与目标检测和图像分割共同构成视觉理解的三大支柱。

## 核心要点

- **CNN**通过卷积核实现层次化特征提取：低层检测边缘纹理，高层检测物体部件
- **ResNet**的残差连接 $y = F(x) + x$ 解决了深层网络的梯度消失问题，使训练1000+层网络成为可能
- **Vision Transformer (ViT)** 将图像切分为16×16的Patch序列，用纯Transformer处理，大数据下超越CNN ^[inferred]
- CNN具有强归纳偏置（局部性、平移不变性），ViT几乎无归纳偏置，需要更多数据补偿
- 轻量化技术（深度可分离卷积、知识蒸馏、剪枝）使CV模型能在移动端部署

## 详细内容

### CNN架构演进

| 模型 | 年份 | 核心创新 | 参数量 | ImageNet Top-5 |
|------|------|---------|--------|---------------|
| AlexNet | 2012 | ReLU, Dropout | 61M | 16.4% |
| VGG-16 | 2014 | 统一3×3卷积核 | 138M | 7.3% |
| ResNet-50 | 2015 | 残差连接 | 25M | 3.6% |
| EfficientNet | 2019 | 复合缩放 | 66M | 2.3% |
| ViT | 2020 | 纯Transformer | 86M | 2.0% |

### ViT核心原理

ViT将224×224图像切分为196个16×16的Patch，每个Patch线性投影为768维向量，加上可学习的位置编码后送入标准Transformer Encoder。`[CLS]` Token的输出用于分类。

**ViT vs CNN关键差异**：

| 维度 | CNN | ViT |
|------|-----|-----|
| 归纳偏置 | 强（局部性、平移不变性） | 弱（从数据学习） |
| 小数据表现 | 优 | 差 |
| 大数据表现 | 好 | 更优 |
| 全局依赖 | 需堆叠多层 | 一层即可捕获 |

### 3D视觉基础

3D视觉处理点云、体素、网格等3D数据表示。PointNet通过独立处理每个点+对称函数（Max Pooling）实现点云分类和分割，是3D深度学习的奠基工作。NeRF用MLP建模连续的神经辐射场实现新视角合成，3D Gaussian Splatting用离散高斯点+可微光栅化大幅加速渲染。

### 数据增强技术

| 方法 | 原理 | 适用场景 |
|------|------|---------|
| Mosaic | 4张图像拼接成1张 | YOLOv5/v8标配 |
| MixUp | 两张图像加权混合 | 提升泛化 |
| CutMix | 裁剪贴到另一张 | 防止过拟合 |
| AutoAugment | RL搜索最优策略 | 大数据集 |
| RandAugment | 随机采样增强 | 简单高效 |

### 轻量化部署

深度可分离卷积将标准卷积分解为深度卷积+逐点卷积，参数减少8-9倍。MobileNet系列以此为基础实现移动端实时推理。知识蒸馏让大模型指导小模型训练，网络剪枝移除冗余通道/层，两者结合可实现10倍以上的模型压缩。

### OCR技术栈

OCR系统由文字检测+文字识别两阶段组成。经典CRNN架构采用CNN+BiLSTM+CTC流程。PaddleOCR是中文场景最优的开源方案。文档AI从LayoutLM到Donut再到Qwen2-VL，已从纯文字识别进化为多模态文档理解。

## 开放问题

- ViT在小数据上的高效训练仍是挑战，DeiT/MAE等方案部分缓解 ^[ambiguous]
- 3D视觉数据采集和标注成本高昂，自监督3D表征学习有待突破
- 视觉模型对抗样本的鲁棒性远未达到安全部署标准
- 视觉基础模型（如SAM、DINOv2）的通用性与专业领域精度的权衡

## 来源

- 计算机视觉/Image_Classification_Detection/Image_Classification_Detection.md
- 计算机视觉/CV_Fundamentals/ViT_Deep_Dive.md
- 计算机视觉/3D_Vision/3D_Vision.md
- 计算机视觉/OCR_Text_Recognition/OCR_Text_Recognition.md

## Related

- [[论文精读/Vision/ResNet_Deep_Dive]] — ResNet 深度解读 (Deep Residual Learning for Image Recognition) (共享: cnn, cv, deep-learning)
- [[计算机视觉/README]] — 05 计算机视觉 (Computer Vision) (共享: cnn, cv)
- [[计算机视觉/Segmentation/Segmentation_for_dummy]] — 图像分割 - 小白版 ✂️ (共享: cnn, cv)
- [[计算机视觉/Video_Generation/README]] — AI视频生成 (Video Generation) (共享: cnn, cv)
- [[治理/cv-deep-learning]]

---

## 2026 计算机视觉生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Vision Transformer** | ViT 及其变体成为视觉主流架构 | GA |
| **SAM 2** | 通用图像/视频分割基础模型 | GA |
| **多模态融合** | 视觉 + 语言统一理解与生成 | GA |
| **边缘视觉** | 端侧实时目标检测/分割 | GA |
| **3D 视觉** | NeRF/3DGS 三维重建与生成 | GA |

## 生产最佳实践

1. **数据增强**：充分的数据增强显著提升小数据集上的模型性能
2. **预训练迁移**：优先使用预训练模型微调，而非从头训练
3. **推理优化**：生产部署使用 TensorRT/ONNX 加速推理
4. **边缘部署**：实时场景考虑边缘设备部署，降低延迟
5. **持续评估**：生产环境持续监控模型准确率，检测数据漂移

## 2026 计算机视觉生态

| 方向 | 代表模型 | 应用 | 状态 |
|------|----------|------|------|
| **图像分类** | ViT / ConvNeXt | 通用分类 | GA |
| **目标检测** | YOLOv10 / RT-DETR | 实时检测 | GA |
| **语义分割** | SAM 2 / Mask2Former | 图像分割 | GA |
| **姿态估计** | ViTPose / HRNet | 人体姿态 | GA |
| **3D 视觉** | NeRF / 3D Gaussian | 3D 重建 | GA |
| **视觉基础模型** | DINOv2 / SAM | 通用表示 | GA |

## 视觉 Transformer 架构

```
ViT 架构:
输入图像 (224×224×3)
    │
    ▼
Patch Embedding (16×16 patches)
    │
    ▼
[CLS] + Patch Tokens + Position Embedding
    │
    ▼
Transformer Encoder × N
    │
    ▼
[CLS] Token → 分类头 → 输出
```

## 目标检测部署示例

```python
# 使用 YOLOv10 进行目标检测
from ultralytics import YOLO

# 加载模型
model = YOLO("yolov10x.pt")

# 推理
results = model("image.jpg")

# 处理结果
for r in results:
    boxes = r.boxes
    for box in boxes:
        print(f"Class: {box.cls}, Conf: {box.conf:.2f}")

# 导出 TensorRT
model.export(format="engine", half=True)
```

## 延伸阅读

- [[概念/Vision/generative-vision-models|生成式视觉模型]] — 图像生成
- [[概念/Vision/vision-language-model|视觉语言模型]] — 图文理解
- [[概念/Vision/video-generation|视频生成]] — 视频生成技术
- [[概念/Inference/tensorrt|TensorRT]] — 推理加速

> ℹ️ 计算机视觉是 AI 最成熟的领域之一，ViT 架构已成为主流。

## CV 任务性能基准 (2026)

| 任务 | 模型 | 指标 | 性能 |
|------|------|------|------|
| **ImageNet 分类** | ViT-L | Top-1 Acc | 90.5% |
| **COCO 检测** | YOLOv10x | mAP | 54.4 |
| **COCO 分割** | SAM 2 | mIoU | 82.1 |
| **实时检测** | RT-DETR | FPS | 120+ |

> 生产环境建议使用 TensorRT/ONNX 加速推理，实时场景考虑边缘部署。
