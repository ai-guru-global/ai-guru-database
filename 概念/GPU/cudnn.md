---
title: "cuDNN"
category: -concepts
tags: ["gpu", "nvidia", "deep-learning", "library", "alibaba-cloud"]
summary: "cuDNN 是 NVIDIA 针对深度神经网络原语优化的高性能 GPU 库，被 PyTorch、TensorFlow 等框架广泛用于卷积、RNN、Transformer 等算子加速。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "CUDA Deep Neural Network library"
relationships:
  - target: "概念/cuda"
    type: part_of
  - target: "概念/nvidia-gpu"
    type: runs_on
sources: []
---

# cuDNN

> **一句话理解**: cuDNN 是 NVIDIA 给深度学习算子做的「加速包」，卷积、注意力、归一化这些常用操作都靠它跑得快。

## 核心要点

- **深度学习原语库**: 提供卷积、池化、归一化、激活、RNN、Attention 等优化实现。
- **与 CUDA 配合**: 基于 CUDA 构建，是 NVIDIA GPU 深度学习软件栈的核心。
- **版本依赖**: PyTorch/TensorFlow 发行版会指定兼容的 cuDNN 版本。
- **性能关键**: 相同 GPU 上，cuDNN 版本不同可能带来显著性能差异。

## 阿里云专有云关联

在阿里云专有云 GPU 节点上，cuDNN 通常与 NVIDIA 驱动、CUDA Toolkit 一起安装，ACK 容器镜像中需包含对应版本。

## Related

- [[概念/cuda|CUDA]]
- [[概念/nvidia-gpu|NVIDIA GPU]]
