---
title: 05 计算机视觉 (Computer Vision)
category: 04-computer-vision
tags: ["computer-vision", "cnn", "image-processing"]
summary: "本章涵盖图像理解与生成的核心技术，从经典 CNN 架构到目标检测（YOLO）、图像分割（Semantic/Instance）、多模态视觉（CLIP）以及生成模型（GAN/Diffusion）。这是视觉 AI 应用的技术全景。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

name_zh: "05 计算机视觉"
---
# 05 计算机视觉 (Computer Vision)

> 中文简称：05 计算机视觉

本章涵盖图像理解与生成的核心技术，从经典 CNN 架构到目标检测（YOLO）、图像分割（Semantic/Instance）、多模态视觉（CLIP）以及生成模型（GAN/Diffusion）。这是视觉 AI 应用的技术全景。

## 学习路径 (Learning Path)

```
    ┌──────────────────────┐
    │  图像分类与检测       │
    │  Classification &    │
    │  Detection           │
    │  (ResNet/YOLO)       │
    └──────────┬───────────┘
               │
               ├────────────────────┐
               ▼                    ▼
    ┌──────────────────┐   ┌───────────────┐
    │  图像分割         │   │  多模态视觉   │
    │  Segmentation    │   │  Multimodal   │
    │  (U-Net/Mask)    │   │  (CLIP)       │
    └──────────────────┘   └───────────────┘
               │                    │
               └────────┬───────────┘
                        ▼
               ┌──────────────────┐
               │  生成模型         │
               │  Generative      │
               │  (GAN/Diffusion) │
               └──────────────────┘
```

## 内容索引 (Content Index)

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 图像分类与检测 (Image Classification & Detection) | 入门 | CNN、ResNet、ViT、YOLO 系列，掌握图像识别基础 | [01_图像分类与检测.md](./02_图像分类与检测/01_图像分类与检测.md) |
| **目标检测深度解析 (Object Detection)** | **核心** | **R-CNN、YOLO 系列、DETR、DINO，工业级目标检测技术全景** | **[04_目标检测_深入分析.md](./02_图像分类与检测/04_目标检测_深入分析.md)** |
| 图像分割 (Segmentation) | 进阶 | 语义分割（U-Net）、实例分割（Mask R-CNN），像素级理解 | [Segmentation/](./03_图像分割/) |
| 多模态视觉 (Multimodal Vision) | 进阶 | CLIP、ALIGN，视觉-语言联合表示学习 | [Multimodal_Vision/](./08_多模态视觉/) |
| 生成模型 (Generative Models) | 实战 | GAN、DDPM、Stable Diffusion，图像生成与编辑 | [02_生成模型.md](./06_生成模型/02_生成模型.md) |
| AI 视频生成 (Video Generation) | 前沿 | 2026 年视频生成格局，Veo3/Kling/Seedance/Sora 后时代 | [Video_Generation/](./07_视频生成/) |
| 3D 视觉 (3D Vision) | 进阶 | 深度估计、点云分割、NeRF、3D 检测 | [02_三维视觉.md](./05_三维视觉/02_三维视觉.md) |
| OCR 文字识别 (OCR) | 入门 | 文本检测、文本识别、端到端 OCR | [02_OCR与文字识别.md](./04_OCR与文字识别/02_OCR与文字识别.md) |
| **CV 生产部署与推理 2026** | **生产必备** | **ONNX/TensorRT/OpenVINO 服务化、量化剪枝、边缘部署与工业案例** | **[01_CV部署_and_推理_2026.md](./09_CV部署/01_CV部署_and_推理_2026.md)** |

### 深度解读 (Deep Dive)

| 论文 | 内容 | 文档链接 |
|------|------|---------|
| ViT (Vision Transformer) | 将 Transformer 引入视觉，图像即 16×16 tokens | [05_ViT_深入分析.md](04_计算机视觉/01_CV基础/05_ViT_深入分析.md) |
| CLIP | 多模态学习里程碑，zero-shot 图像分类 | [02_CL知识产权_深入分析.md](20_论文精读/08_计算机视觉/02_CL知识产权_深入分析.md) |

### 小白版入门 (for_dummy)

- 计算机视觉 - 小白版 — 零基础入门
- 图像分类与检测 - 小白版
- 图像分割 - 小白版
- 多模态视觉 - 小白版
- 生成模型 - 小白版
- 视频生成 - 小白版
- 3D 视觉 - 小白版
- OCR - 小白版

## 前置知识 (Prerequisites)

- **必修**: [神经网络核心](03_深度学习/02_神经网络核心/09_神经网络核心.md)（理解 CNN 架构）
- **必修**: [优化与正则化](03_深度学习/03_优化方法/02_优化.md)（训练视觉模型）
- **推荐**: [Transformer 革命](05_大模型/03_Transformer架构/03_Transformer_Revolution.md)（理解 ViT 和多模态）
- **可选**: [概率统计](01_数学基础/03_概率统计/02_概率统计.md)（理解扩散模型）

## 关键术语速查 (Key Terms)

- **卷积神经网络 (CNN)**: 利用局部感受野和权重共享处理图像的神经网络
- **ResNet (残差网络)**: 通过跳跃连接解决深层网络退化，CV 领域里程碑
- **ViT (Vision Transformer)**: 将图像分块用 Transformer 处理，打破 CNN 垄断
- **目标检测 (Object Detection)**: 定位并分类图像中多个对象（YOLO/Faster R-CNN）
- **语义分割 (Semantic Segmentation)**: 像素级分类，不区分实例（U-Net/DeepLab）
- **实例分割 (Instance Segmentation)**: 区分同类别不同实例（Mask R-CNN）
- **CLIP**: OpenAI 的视觉-语言预训练模型，实现零样本图像分类
- **GAN (生成对抗网络)**: 通过生成器-判别器对抗训练生成图像
- **Diffusion Model**: 通过逐步去噪生成图像，DALL-E/Stable Diffusion 核心
- **Latent Diffusion**: 在潜在空间执行扩散，大幅降低计算成本

---
*Last updated: 2026-02-10*

## Related
- [[04_计算机视觉/01_CV基础/05_ViT_深入分析|Vision Transformer (ViT) 深度解读]]
- [[04_计算机视觉/README|05 计算机视觉 - 小白版 🖼️]]
- [[04_计算机视觉/CV-in-nutshell|计算机视觉速成指南 (Computer Vision in a Nutshell)]]

- [[04_计算机视觉/README.md]] — 图像分割 - 小白版 ✂️ (共享: cnn, computer-vision, cv, image-processing)
- [[04_计算机视觉/07_视频生成/README]] — AI视频生成 (Video Generation) (共享: cnn, computer-vision, cv, image-processing)
- [[20_论文精读/08_计算机视觉/06_ResNet_深入分析]] — ResNet 深度解读 (Deep Residual Learning for Image Recognition) (共享: cnn, cv)
- [[04_计算机视觉/05_三维视觉/3D_Vision]] — 3D_Vision
- [[04_计算机视觉/README.md]] — 3D_Vision_for_dummy
- [[概念/Vision/image-segmentation]] — Segmentation
- [[04_计算机视觉/README.md]] — OCR_for_dummy
- [[04_计算机视觉/04_OCR与文字识别/OCR_Text_Recognition]] — OCR_Text_Recognition
- [[概念/Vision/video-generation]] — Video_Generation_for_dummy
- [[概念/Vision/video-generation]] — Video_Generation_2026
- [[概念/Vision/clip]] — CLIP_Deep_Dive
- [[04_计算机视觉/08_多模态视觉/03_多模态视觉]] — Multimodal_Vision_for_dummy
- [[04_计算机视觉/08_多模态视觉/03_多模态视觉]] — Multimodal_Vision
- [[04_计算机视觉/README.md]] — Image_Classification_Detection_for_dummy
- [[04_计算机视觉/02_图像分类与检测/01_图像分类与检测]] — Image_Classification_Detection
- [[04_计算机视觉/06_生成模型/02_生成模型]] — Generative_Models
- [[04_计算机视觉/06_生成模型/02_生成模型]] — Generative_Models_for_dummy
- [[04_计算机视觉/01_CV基础/04_CV_简明指南.md|CV-in-nutshell]]
- [[概念/Vision/multimodal-vision.md|multimodal-vision]]
- [[治理/cv-deep-learning|Cv Deep Learning]]

## 相关页面

- [[概念/image-segmentation|Image Segmentation]]
