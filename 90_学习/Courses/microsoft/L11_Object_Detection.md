---
title: "L11 - 目标检测"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "computer-vision", "object-detection", "yolo", "rcnn"]
summary: "本课讲解如何让模型同时回答图像中‘有什么’和‘在哪里’，介绍目标检测的数据集、评价指标 IoU/AP/mAP，以及从 R-CNN 到 YOLO 的主流算法。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/4-ComputerVision/11-ObjectDetection/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L11 Object Detection"
  - L11_Object_Detection
sources: []

---
# L11 - 目标检测

> **一句话理解**：目标检测（Object Detection）不仅是给整张图贴一个类别标签，而是要为图中每个感兴趣物体标出类别并画出边界框（Bounding Box）。

## 本课概览

本课位于 Microsoft AI For Beginners 计算机视觉模块的尾声，前面已经学习了图像分类、CNN、迁移学习、GAN 等，后面将衔接语义分割。如果说图像分类回答“图中有什么”，那么目标检测还要回答“它们在哪里、占多大区域”。因此，它的核心挑战是**同时做分类和定位（Localization）**：既要判断框内物体类别，又要回归出框的精确坐标。

学习目标：
- 理解目标检测与图像分类的本质区别。
- 掌握边界框表示、IoU、AP、mAP 等核心概念与计算方式。
- 了解朴素滑动窗口法的局限。
- 理解两阶段检测器（R-CNN 系列）与单阶段检测器（YOLO、SSD、RetinaNet）的设计思想与取舍。
- 知道如何通过官方 Notebook 与实验动手实践。

## 核心概念

- **目标检测（Object Detection）**
  对输入图像中的每个目标输出一个类别标签和一个边界框。通常表示为 `(x, y, w, h)` 或 `(xmin, ymin, xmax, ymax)`，同时附带置信度分数。

- **边界框（Bounding Box）**
  包围目标的最小矩形框，是目标检测的基本输出单元。模型需要同时预测框的位置与大小。

- **朴素方法 / 滑动窗口（Naive Approach / Sliding Window）**
  把图像切成若干小块（tiles），对每块单独做图像分类。分类置信度高的块被认为包含目标。这个方法思路直观，但定位粗糙、计算冗余，且无法得到精确框坐标。

- **回归（Regression）与检测数据集**
  为了得到精确框坐标，需要把框坐标作为连续值进行回归预测。常用的检测数据集有 PASCAL VOC（20 类，IoU 阈值通常取 0.5）和 COCO（80 类，同时提供边界框与分割掩码）。

- **交并比（Intersection over Union, IoU）**
  衡量两个区域重叠程度的指标。对预测框与真实框，计算二者交集面积除以并集面积：
  $$
  \text{IoU} = \frac{\text{Area}(\text{Prediction} \cap \text{Ground Truth})}{\text{Area}(\text{Prediction} \cup \text{Ground Truth})}
  $$
  完全重合时 IoU = 1，完全不重叠时为 0。通常只保留 IoU 高于某阈值的检测结果。

- **平均精度（Average Precision, AP）**
  针对单个类别，绘制不同置信度阈值下的 Precision-Recall 曲线，AP 是曲线下的面积。一种常用近似是 11 点插值：
  $$
  AP = \frac{1}{11}\sum_{i=0}^{10}\text{Precision}\left(\text{Recall}=\frac{i}{10}\right)
  $$

- **均值平均精度（Mean Average Precision, mAP）**
  把所有类别的 AP 取平均，有时还进一步对多个 IoU 阈值取平均。PASCAL VOC 常用 mAP@0.5，COCO 则报告 mAP@[0.5:0.95]。

- **区域提议网络（Region Proposal Network, RPN）**
  Faster R-CNN 中用于直接由神经网络生成候选框的模块，取代了传统 Selective Search，使两阶段检测器速度大幅提升。

- **单阶段检测器（One-stage Detector）**
  代表人物 YOLO（You Only Look Once）、SSD（Single Shot Detector）、RetinaNet。它们在一次网络前向传播中同时预测类别和边界框，速度快，适合实时应用。

## 关键知识点

- **两阶段 vs 单阶段**
  - 两阶段：先产生候选区域，再对候选区域分类并精修框。代表 R-CNN → Fast R-CNN → Faster R-CNN → R-FCN。精度高、速度慢。
  - 单阶段：直接在全图特征上预测所有框。代表 YOLO、SSD、RetinaNet。速度快、更适合实时场景。

- **R-CNN 系列演进**
  - **R-CNN（Region-Based CNN）**：用 Selective Search 生成约 2000 个 ROI（Region of Interest，感兴趣区域），分别过 CNN 提取特征，再用 SVM（支持向量机）分类、线性回归修正框坐标。准确但慢。
  - **Fast R-CNN**：先对整图做卷积得到特征图，再把 ROI 映射到特征图上做池化，只需一次 CNN 前向传播。
  - **Faster R-CNN**：引入 RPN 端到端地学习候选框，检测速度与精度都进一步提升。
  - **R-FCN（Region-Based Fully Convolutional Network）**：在 ResNet-101 后用位置敏感得分图（Position-Sensitive Score Map），让不同子区域对目标类别投票，进一步加速。

- **YOLO 的核心思想**
  1. 把图像划分为 $S \times S$ 网格。
  2. 每个网格单元预测 $n$ 个边界框、类别概率以及置信度。
  3. 置信度定义为 $\text{Confidence} = P(\text{Object}) \times \text{IoU}_{\text{pred}}^{\text{truth}}$。
  4. 单次前向传播完成所有预测，因而可达到实时检测。

- **其他单阶段方法**
  - **SSD（Single Shot Detector）**：在不同尺度的特征图上设置默认框（anchor），直接预测偏移与类别。
  - **RetinaNet**：引入 Focal Loss 解决前景背景类别不平衡问题，在速度与精度间取得良好平衡。

- **数据格式**
  PASCAL VOC 使用 XML 标注每个目标的 `<bndbox>`；COCO 使用 JSON，标注更丰富的边界框与分割信息。

## 代码/实验说明

官方为本课提供了可运行的 Jupyter Notebook：

- **官方 Notebook**：[ObjectDetection.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/11-ObjectDetection/ObjectDetection.ipynb)（本课 Notebook 使用 TensorFlow/Keras 实现）
  - 实现并可视化“滑动窗口 + 图像分类”的朴素检测思路。
  - 演示如何在示例数据上计算 IoU。
  - 帮助理解检测模型输出边界框与置信度的过程。

- **课前测验**：[Pre-lecture quiz](https://ff-quizzes.netlify.app/en/ai/quiz/21)
- **课后测验**：[Post-lecture quiz](https://ff-quizzes.netlify.app/en/ai/quiz/22)

- **课后实验（Lab）**：[lab/README.md](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/11-ObjectDetection/lab/README.md)
  - 任务：使用 [Hollywood Heads Dataset](https://www.di.ens.fr/willow/research/headdetection/) 训练人头检测模型。
  - 数据集包含约 37 万张人头标注，采用 PASCAL VOC 格式。
  - 实验提供了三条实现路径：
    1. 使用 Azure Custom Vision 云端 API 快速训练（适合小数据集）。
    2. 参考 Keras 官方 RetinaNet 示例用 Keras 训练。
    3. 使用 PyTorch torchvision 内置的 `torchvision.models.detection.RetinaNet` 训练。

- **YOLO 挑战**：官方推荐阅读 [YOLO 官方站点](https://pjreddie.com/darknet/yolo/) 与 [Keras YOLO 实现](https://github.com/experiencor/keras-yolo2)，并跟随 step-by-step notebook 亲手搭建一个 YOLO 检测器。

## 本课不覆盖与延伸

- **不覆盖**：
  - 实例分割（Instance Segmentation）与语义分割（Semantic Segmentation，将在 L12 讲解）。
  - 无锚点检测器（Anchor-free，如 CenterNet）、基于 Transformer 的检测器（如 DETR）等更近期的方法。
  - 三维目标检测、目标跟踪、视频检测。

- **延伸**：
  - 想了解计算机视觉整体脉络：[[04_计算机视觉/README]]
  - 想深入图像分类与检测基础：[[04_计算机视觉/02_Image_Classification_Detection/Image_Classification_Detection]]
  - 想学习模型训练与微调：[[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Strategies]]
  - 想了解目标检测的工业部署：[[10_部署推理/README]]

## 相关阅读

- 课程索引：[[90_学习/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：[[04_计算机视觉/02_Image_Classification_Detection/Image_Classification_Detection]]

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
