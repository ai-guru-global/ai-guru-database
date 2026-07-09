---
title: "L06 - 计算机视觉简介与 OpenCV"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "computer-vision", "opencv", "image-processing", "motion-detection"]
summary: "介绍计算机视觉的核心任务与典型流程，重点讲解使用 OpenCV 进行图像读取、颜色空间转换、几何变换、阈值化与光流等预处理技术。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/4-ComputerVision/06-IntroCV/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L06 Intro To Computer Vision"
  - "L06 Intro to Computer Vision"
  - L06_Intro_to_Computer_Vision
sources: []

---
# L06 - 计算机视觉简介与 OpenCV

> **一句话理解**：在把图像交给神经网络之前，先学会用 OpenCV 等工具对图像进行读取、变换与增强，是计算机视觉工程流程中的第一步。

---

## 本课概览

计算机视觉（Computer Vision，计算机视觉）致力于让计算机从数字图像或视频中获取高层次的语义理解。它的任务范围很广：从最简单的图像分类（Image Classification），到目标检测（Object Detection）、事件检测（Event Detection）、图像描述（Image Captioning）、三维重建，再到与人相关的年龄估计、表情识别、人脸识别与姿态估计等。

本课是微软课程中“计算机视觉”模块的第一节。它的定位不是深入讲解某种神经网络，而是建立图像处理的基础：如何在 Python 中表示图像、有哪些常用库、以及 OpenCV 能做哪些预处理。理解这些基础后，后续学习卷积神经网络（Convolutional Neural Network，卷积神经网络 / CNN）会更有抓手。

本课的学习目标：

- 理解计算机视觉的主要任务与典型pipeline（图像获取 → 预处理 → 模型推理）。
- 掌握 OpenCV 读取图像、颜色空间转换、缩放、模糊、阈值化、几何变换的基本用法。
- 了解帧差法与光流（Optical Flow，光流）在视频运动检测中的作用。
- 知道官方 `OpenCV.ipynb` Notebook 中的三个动手示例。

---

## 核心概念

- **图像作为多维数组**：在 Python 中，图像通常用 NumPy 数组表示。灰度图尺寸为 `H × W`；彩色图尺寸为 `H × W × C`，其中 C 为颜色通道。OpenCV 默认使用 BGR（蓝-绿-红，Blue-Green-Red）通道顺序，而大多数 Python 可视化工具（如 Matplotlib）使用 RGB，因此经常需要转换。

- **颜色空间转换（Color Space Conversion）**：通过 `cv2.cvtColor` 可在 BGR、RGB、灰度、HSV（Hue-Saturation-Value，色调-饱和度-明度）等空间之间切换。HSV 把颜色信息与亮度分离，在光照变化的场景下做阈值化往往更稳定。

- **阈值化（Thresholding）**：将像素值按某个门槛分为前景/背景，是图像分割最简单的方法。OpenCV 提供全局阈值 `cv2.threshold` 与自适应阈值 `cv2.adaptiveThreshold`，后者对光照不均匀的图像效果更好。

- **几何变换（Geometric Transformations）**：
  - **仿射变换（Affine Transformation，仿射变换）**：由三对对应点确定，保持平行线仍平行，可实现旋转、缩放、剪切。
  - **透视变换（Perspective Transformation，透视变换）**：由四对对应点确定，可将倾斜视角拍摄的矩形区域（如文档、屏幕）校正为正视图。

- **光流（Optical Flow，光流）**：分析连续视频帧之间像素运动的技术。
  - **稠密光流（Dense Optical Flow）**：计算每个像素的运动向量场。
  - **稀疏光流（Sparse Optical Flow）**：只在图像中的显著特征点（如边缘、角点）上跟踪运动轨迹，计算量更小。

---

## 关键知识点

- 计算机视觉被视为人工智能的一个分支；现代视觉任务大多由神经网络完成，但传统图像预处理仍然重要。
- 常见 Python 图像处理库：
  - **imageio**：读写多种图像/视频格式，支持 ffmpeg 提取视频帧。
  - **Pillow / PIL**：支持基础的图像变形、调色板调整等。
  - **OpenCV**：C++ 编写，功能最全面，是图像处理的事实标准。
  - **dlib**：面向人脸检测、面部关键点检测等更专门的 ML/CV 算法。
- OpenCV 读取的彩色图默认是 BGR，可视化前建议转换为 RGB：
  ```python
  im = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
  ```
- 送入神经网络前常见的预处理包括：缩放、模糊去噪、亮度/对比度调整、阈值化、几何校正。
- 在固定摄像头场景中，可用“帧差法”快速检测运动：逐像素相减相邻两帧，差异大即表示有运动。
- 光流比帧差法更精细，可得到运动方向与速度，但计算成本更高。

---

## 代码/实验说明

### 官方 Notebook

本课配套可运行代码位于官方仓库的 **[OpenCV.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/4-ComputerVision/06-IntroCV/OpenCV.ipynb)**。该 Notebook 可直接在本地或云端运行，包含三个示例：

1. **盲文书籍照片预处理**：演示如何用阈值化、特征检测、透视变换和 NumPy 操作，把照片中的盲文点分割成单独的小图，以便后续神经网络分类。
2. **视频运动检测（帧差法）**：对固定摄像头拍摄的视频，用相邻帧相减得到差异图，快速判断画面中是否出现运动。
3. **光流可视化**：分别展示稠密光流与稀疏光流，观察像素在视频中的运动轨迹。

### 核心代码片段

```python
import cv2
import matplotlib.pyplot as plt

# 1. 读取图像（OpenCV 默认 BGR）
im = cv2.imread('image.jpeg')

# 2. 转换为 RGB 以便正确显示
im_rgb = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
plt.imshow(im_rgb)

# 3. 缩放
im_resized = cv2.resize(im, (320, 200), interpolation=cv2.INTER_LANCZOS4)

# 4. 模糊去噪
im_blur = cv2.GaussianBlur(im, (3, 3), 0)

# 5. 转为灰度图
im_gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)

# 6. 全局阈值化
_, im_thresh = cv2.threshold(im_gray, 127, 255, cv2.THRESH_BINARY)
```

### 课后实验（Lab）

官方 [lab 文件夹](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/06-IntroCV/lab) 提供一个任务：拍摄一段包含上下左右手势的简单视频，利用光流提取手掌的运动方向。

---

## 本课不覆盖与延伸

- **不覆盖**：
  - 卷积神经网络（CNN）的具体结构与训练方法 → 见本课后续 L07。
  - 目标检测、语义分割等高级视觉任务 → 见 L11、L12。
  - 深度学习框架（PyTorch / TensorFlow）在视觉任务中的完整训练流程 → 见 L07–L12 及本库 [[模型训练/README]]。

- **延伸**：
  - 想了解光流更系统的讲解，可参考 [LearnOpenCV: Optical Flow in OpenCV](https://learnopencv.com/optical-flow-in-opencv/)。
  - 想动手做更复杂的 OpenCV 项目，可浏览 [Learn OpenCV 入门课程](https://learnopencv.com/getting-started-with-opencv/)。
  - 对 Cortic Tigers 等低代码/机器人视觉项目感兴趣，可观看微软 AI Show 的[相关视频](https://docs.microsoft.com/shows/ai-show/ai-show--2021-opencv-ai-competition--grand-prize-winners--cortic-tigers--episode-32?WT.mc_id=academic-77998-cacaste)。

---

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[计算机视觉/README]]
  - [[计算机视觉/Image_Classification_Detection/Image_Classification_Detection]]
