---
title: 深度学习驱动的计算机视觉
category: -synthesis
tags: [synthesis, computer-vision, cv, cnn, deep-learning, image-classification]
summary: 从 CNN 到 Vision Transformer，深度学习如何彻底重塑计算机视觉的任务边界和性能上限。
created: 2026-06-12
---

# 深度学习驱动的计算机视觉

## The Connection

计算机视觉（CV）在深度学习兴起之前，是一个依赖手工特征（SIFT、HOG）和经典机器学习（SVM、随机森林）的领域。2012 年 AlexNet 的爆发不仅是一个算法突破，更是**数据+算力+端到端学习**三位一体的胜利。此后，CV 的每一次重大进步都紧随深度学习架构的演进。

## Where They Co-occur

- **图像分类**：AlexNet → VGG → ResNet → EfficientNet → ViT
- **目标检测**：R-CNN → Fast R-CNN → YOLO → DETR
- **语义分割**：FCN → U-Net → DeepLab → Segment Anything
- **生成模型**：GAN → VAE → Diffusion Models → 视觉生成革命
- **多模态融合**：CLIP → LLaVA → 视觉-语言统一表示

## Cross-cutting Insight

CV 领域的一个深层规律是**架构统一化趋势**：

1. **CNN 时代**（2012-2020）：为每个任务设计专用架构（分类、检测、分割各有一套）
2. **Transformer 时代**（2020-2024）：Vision Transformer 证明统一架构可以处理所有视觉任务
3. **统一模型时代**（2024+）：GPT-4V、Gemini 等模型将视觉完全纳入通用智能框架

这意味着**独立的"计算机视觉工程师"角色正在消失**，取而代之的是"多模态 AI 工程师"——他们需要同时理解视觉、语言和推理。

## Tensions and Trade-offs

| 维度 | 传统 CV | 深度学习 CV | 统一多模态 |
|---|---|---|---|
| 数据需求 | 中 | 极高 | 极高 |
| 可解释性 | 高（特征可视化） | 中（注意力图） | 低 |
| 部署效率 | 高 | 中（需要 GPU） | 低（大模型） |
| 泛化能力 | 低（域内泛化） | 中 | 高（跨域） |
| 开发范式 | 特征工程 | 网络设计 | 提示工程 |

## Open Questions

- 当通用多模态模型可以处理所有视觉任务时，专用 CV 模型还有存在价值吗？
- 计算机视觉的"物理世界理解"（深度、运动、因果）能否通过纯数据驱动学习获得？
- 视觉生成的伦理边界在哪里（深度伪造、虚假影像）？

## Related

- [[04_Computer_Vision/README]]
- [[_concepts/computer-vision]]
- [[_concepts/neural-networks]]
- [[03_Deep_Learning/Neural_Network_Core/Neural_Network_Core]]
- [[20_Papers/ResNet_Deep_Dive]]
