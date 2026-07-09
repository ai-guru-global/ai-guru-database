---
title: 图像分割
category: -concepts
tags:
- cv
- segmentation
- semantic-segmentation
- instance-segmentation
- u-net
- sam
aliases:
- Image Segmentation
- 图像分割
- 语义分割
- 实例分割
relationships:
- target: '_concepts/computer-vision'
  type: related_to
- target: '_concepts/object-detection'
  type: related_to
- target: '_concepts/generative-vision-models'
  type: related_to
sources:
- 05_computer-vision_multimodal-vision/Segmentation/Segmentation.md
summary: 图像分割为每个像素分配类别或实例标签，是CV中最精细的空间理解任务，U-Net和SAM是里程碑模型。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: supporting
created: 2026-05-31 00:00:00+00:00
updated: 2026-05-31 00:00:00+00:00
---

# 图像分割

图像分割（Image Segmentation）将图像中每个像素分配到特定类别或实例，是计算机视觉中最精细的空间理解任务。如果目标检测是画框圈出物体，分割就是精确描绘每个像素的轮廓。分割按精细度分为语义分割、实例分割和全景分割三个层次。

## 核心要点

- **语义分割**：每个像素分配类别标签，不区分同类不同个体（所有"人"标同色）
- **实例分割**：区分同类的不同个体（不同的"人"标不同色），如Mask R-CNN
- **全景分割**：语义+实例的组合，可数物体分实例，不可数物体按语义分类
- 几乎所有分割模型采用**编码器-解码器**架构，跳跃连接保留高分辨率细节
- SAM（Segment Anything model-training）在11M图像1B掩码上训练，实现零样本通用分割

## 详细内容

### 里程碑模型

| 模型 | 年份 | 核心创新 | 任务类型 |
|------|------|---------|---------|
| FCN | 2015 | 首次全卷积端到端像素分类 | 语义分割 |
| U-Net | 2015 | 对称编码器-解码器+密集跳跃连接 | 语义分割 |
| DeepLab v3+ | 2018 | 空洞卷积扩大感受野+ASPP多尺度 | 语义分割 |
| Mask R-CNN | 2017 | Faster R-CNN + 掩码分支 + ROI Align | 实例分割 |
| SAM | 2023 | 1B掩码预训练 + 交互式提示 | 通用分割 |
| SAM 2 | 2024 | 扩展到视频分割+时序追踪 | 视频分割 |

### U-Net：医学影像的王者

U-Net的U形对称结构使它成为医学影像分割的标准工具。关键设计：每层编码器特征通过跳跃连接直接传递给对应解码层，保留了高分辨率空间信息。变体包括U-Net++（嵌套跳跃连接）、Attention U-Net（注意力门控）和nnU-Net（自适应配置）。

### 空洞卷积

空洞卷积在不增加参数量的前提下扩大感受野。rate=2的3×3空洞卷积感受野为5×5，这对分割任务至关重要——需要大感受野理解全局语义，同时保持分辨率不下降。DeepLab系列的ASPP（空洞空间金字塔池化）并行使用多个不同rate的空洞卷积捕获多尺度上下文。

### 损失函数

| 损失函数 | 适用场景 | 特点 |
|---------|---------|------|
| Cross Entropy | 类别均衡 | 通用基线 |
| Dice Loss | 类别不均衡 | 医学影像常用 |
| Focal Loss | 难例挖掘 | 小目标检测 |
| CE + Dice | 实践最优 | 最常用组合 |

### 实时分割

BiSeNet v2采用双路径设计（空间路径+语义路径），实现>150 FPS的实时语义分割。PIDNet三分支轻量架构平衡精度和速度。视频分割中SAM 2支持单帧标注即可追踪整个视频，XMem基于记忆机制处理长视频目标分割。

### 分割中的常见陷阱

1. 类别不均衡（背景>>前景）：使用Dice Loss或Focal Loss缓解
2. 边界模糊（下采样丢失细节）：跳跃连接+边界监督辅助损失
3. 大小目标兼顾困难：多尺度特征融合（FPN/ASPP）
4. 标注数据昂贵：半监督学习、数据增强（弹性形变）

### 应用场景

| 应用领域 | 分割类型 | 关键要求 |
|---------|---------|---------|
| 自动驾驶 | 全景分割 | 实时性（>30 FPS） |
| 医学影像 | 语义分割 | 高精度、小目标 |
| 遥感图像 | 语义分割 | 超大分辨率 |
| 视频会议 | 实例分割 | 实时+边缘精度 |
| 工业质检 | 语义分割 | 微小缺陷检测 |

## 开放问题

- SAM缺乏细粒度语义理解（知道"分出来什么"但不确定"它是什么"） ^[ambiguous]
- 视频分割的时间一致性和遮挡处理仍是活跃研究方向
- 3D分割（点云/体素）的实时性远低于2D方案
- 类别极度不均衡（背景>>前景）的鲁棒处理需更优方案

## 来源

- 计算机视觉/Segmentation/Segmentation.md
