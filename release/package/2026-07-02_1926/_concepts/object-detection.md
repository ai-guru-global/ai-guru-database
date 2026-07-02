---
title: 目标检测
category: -concepts
tags: ["computer-vision", "object-detection", "yolo", "faster-rcnn", "detr", "bounding-box"]
aliases: [Object Detection, 物体检测, 目标检测]
relationships:
  - target: "[[_concepts/computer-vision]]"
    type: related_to
  - target: "_concepts/image-segmentation"
    type: related_to
  - target: "_concepts/multimodal-vision"
    type: related_to
sources:
  - 05_computer-vision_multimodal-vision/image-segmentation_supervised-learning_Detection/Image_Classification_Detection.md
summary: 目标检测定位图像中所有物体的位置（边界框）并分类，YOLO系列实现实时检测，DETR引入transformer-architecture范式。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# 目标检测

目标检测（Object Detection）在计算机视觉中回答两个问题："是什么"和"在哪里"。从R-CNN的两阶段范式到YOLO的一阶段实时检测，再到DETR的Transformer端到端检测，算法经历了从慢到快、从复杂到简洁的演进。

## 核心要点

- **两阶段检测器**（Faster R-CNN）：先生成候选框再分类，精度高但速度慢（~10 FPS）
- **一阶段检测器**（YOLO系列）：单次前向传播直接回归边界框+类别，速度极快（200+ FPS）
- 核心评估指标：**IoU**衡量框重叠度，**mAP**综合精确率和召回率
- YOLOv8采用Anchor-Free设计+解耦头，已成为工业界实时检测首选
- DETR用Transformer+匈牙利匹配实现端到端检测，无需NMS后处理 ^[inferred]

## 详细内容

### 两阶段 vs 一阶段

| 维度 | Faster R-CNN | YOLO |
|------|-------------|------|
| 流程 | Region Proposal + 分类 | 直接回归 |
| 速度 | 10-30 FPS | 100-200+ FPS |
| 精度 | 高（适合医疗） | 中高（v8已接近） |
| 小物体检测 | 优 | 较弱（持续改进） |

### YOLO系列演进

| 版本 | 年份 | 关键改进 | FPS | mAP |
|------|------|---------|-----|-----|
| YOLOv1 | 2016 | 首次单阶段实时检测 | 45 | 63.4 |
| YOLOv5 | 2020 | 自适应Anchor | 140 | 75.0 |
| YOLOv8 | 2023 | Anchor-Free, 解耦头 | 200+ | 80.0 |
| YOLOv10 | 2024 | NMS-Free端到端 | 220+ | 81.5 |

### 评估指标详解

**IoU（交并比）**：$\text{IoU} = \frac{\text{Area of Overlap}}{\text{Area of Union}}$，IoU > 0.5通常视为正确检测，IoU > 0.7为高质量检测。

**mAP**：对每个类别绘制Precision-Recall曲线计算AP，再对所有类别求平均。COCO标准使用mAP@0.5:0.95（IoU从0.5到0.95步长0.05的均值），比PASCAL VOC的mAP@0.5更严格，更能体现模型真实水平。

### 损失函数

边界框回归从MSE演进到IoU Loss再到CIoU Loss。CIoU同时考虑重叠面积、中心点距离和长宽比，是当前最优的框回归损失。

### 检测模型选择指南

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 实时应用（自动驾驶） | YOLOv8/v10 | 速度快（100+ FPS） |
| 高精度需求（医疗） | Faster R-CNN | mAP更高 |
| 移动端部署 | YOLOv8n, MobileNet-SSD | 参数量小 |
| 视频分析 | YOLOv8 + DeepSORT | 平衡速度与精度 |

### 典型应用

自动驾驶（行人/车辆/交通标志检测）、工业质检（缺陷检测）、安防监控（异常行为检测）、零售分析（货架商品识别）。医疗影像检测需要高精度模型如Cascade R-CNN，实时场景首选YOLO系列。数据增强技术（Mosaic、MixUp、CopyPaste）对提升小目标检测性能至关重要。

### 数据增强与训练技巧

Mosaic增强将4张图像拼接成1张，迫使模型学习更小目标，是YOLOv5/v8的标配。MixUp两张图像加权混合提升泛化，CutMix裁剪贴到另一张防止过拟合。类别不平衡问题可用Focal Loss解决，小目标检测可通过多尺度特征融合（FPN）提升性能。

## 开放问题

- 开放词汇检测（Open-Vocabulary Detection）：结合CLIP实现任意类别检测 ^[ambiguous]
- 3D目标检测从LiDAR点云到纯视觉方案的精度差距仍然显著
- 小目标和密集遮挡场景的检测性能仍需提升
- 检测模型在边缘设备上的部署优化（量化、蒸馏）仍是工程难点

## 来源

- 04_Computer_Vision/Image_Classification_Detection/Image_Classification_Detection.md

## Related

- [[_concepts/computer-vision]] — 计算机视觉 (共享: cv, object-detection)
