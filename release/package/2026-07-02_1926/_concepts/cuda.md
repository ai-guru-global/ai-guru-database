---
title: "CUDA"
category: -concepts
tags: ["gpu", "nvidia", "programming", "parallel-computing", "training", "inference", "alibaba-cloud"]
summary: "CUDA 是 NVIDIA 推出的并行计算平台和编程模型，让开发者能直接利用 GPU 进行通用计算，是深度学习框架的主要后端。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "Compute Unified Device Architecture"
  - "CUDA 并行计算"
relationships:
  - target: "_concepts/nvidia-gpu"
    type: runs_on
  - target: "_concepts/pytorch"
    type: uses
  - target: "_concepts/tensorrt"
    type: related_to
sources: []
---

# CUDA

> **一句话理解**: CUDA 是 NVIDIA GPU 的「编程语言+运行时」，PyTorch、TensorFlow 等框架通过 CUDA 调用 GPU 算力。

## 核心要点

- **并行计算平台**: 包含驱动、运行时、编译器（nvcc）、库（cuBLAS、cuDNN）。
- **编程模型**: kernel、block、thread、grid、shared memory。
- **版本兼容性**: CUDA Toolkit 版本需与 GPU 架构、驱动版本匹配。
- **深度学习后端**: PyTorch/TensorFlow 的 GPU 版本依赖 CUDA。

## 常用命令

```bash
nvcc --version
nvidia-smi
```

## 阿里云专有云关联

在阿里云专有云 GPU 节点上，需正确安装 NVIDIA 驱动和 CUDA Toolkit，ACK 才能调度 GPU 工作负载。

## Related

- [[_concepts/nvidia-gpu|NVIDIA GPU]]
- [[_concepts/tensorrt|TensorRT]]
- [[_concepts/cudnn|cuDNN]]
