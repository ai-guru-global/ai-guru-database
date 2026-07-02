---
title: "CV 工程师学习路径"
category: 90-learn-pathways
tags: ["learning", "computer-vision", "cv", "career", "roadmap"]
summary: "CV 工程师专注于图像和视频相关的 AI 应用——从图像分类到多模态视觉，掌握视觉智能的全栈能力。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "CV Engineer Path"
  - "Computer Vision Learning Path"
---

# CV 工程师学习路径 (Computer Vision Engineer Learning Path)

> CV 工程师专注于图像和视频相关的 AI 应用——从图像分类到多模态视觉，掌握视觉智能的全栈能力。

---

## 1. 角色定位

| 维度 | 说明 |
|------|------|
| 核心职责 | 图像识别、目标检测、图像分割、视频分析、3D视觉 |
| 技能重心 | 图像处理 + 深度学习 + 边缘部署 |
| 与NLP工程师区别 | CV 处理视觉数据，NLP 处理文本数据 |
| 典型产出 | 检测系统、分割模型、OCR引擎、视觉质检 |

---

## 2. 技能路线图

### 阶段一：CV 基础（2-3个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 图像基础 | 像素操作、色彩空间、滤波 | [[CV_Fundamentals]] |
| 传统CV | 边缘检测、特征匹配、变换 | 实战练习 |
| CNN 基础 | 卷积、池化、经典架构 | [[Neural_Network_Core]] |
| PyTorch CV | 数据加载、预处理、训练 | [[pytorch_overview]] |

### 阶段二：核心任务（3-4个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 图像分类 | ResNet, EfficientNet, ViT | [[Image_Classification_Detection]] |
| 目标检测 | YOLO系列, DETR | [[Object_Detection_Complete_Guide]] |
| 图像分割 | 语义分割、实例分割、SAM | [[Segmentation]] |
| OCR | 文字检测与识别 | [[OCR_Text_Recognition]] |

### 阶段三：高级主题（3-4个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 多模态视觉 | CLIP, LLaVA, GPT-4V | [[Multimodal_Vision]] |
| 生成模型 | Diffusion, GAN | [[Generative_Models]] |
| 视频理解 | 视频分类、动作识别 | [[Video_Generation_2026]] |
| 3D视觉 | 点云、NeRF、3D重建 | [[3D_Vision]] |

### 阶段四：生产部署（2-3个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 模型优化 | 量化、剪枝、蒸馏 | [[Model_Compression_Complete_Guide]] |
| 边缘部署 | TensorRT, ONNX, CoreML | [[Edge_AI_2026]] |
| 视频流处理 | 实时检测、跟踪 | 实战项目 |
| 数据标注 | Label Studio, CVAT | 实战项目 |

---

## 3. 模型选型指南

| 任务 | 推荐模型 | 精度 | 速度 |
|------|---------|------|------|
| 图像分类 | ConvNeXt-V2, ViT-L | 88%+ | 5ms |
| 目标检测 | YOLOv11, RT-DETR | 75%+ mAP | 3ms |
| 语义分割 | SAM2, Mask2Former | 58%+ mIoU | 15ms |
| OCR | PaddleOCR, Surya | 95%+ | 10ms |
| 图像生成 | SDXL, FLUX | - | 2s |

---

## 4. 相关路径

- [[nlp-engineer]]: 语言方向
- [[ai-engineer]]: 偏应用集成
- robotics engineer: 机器人视觉

---

*Last updated: 2026-07-02*
