---
title: "NVIDIA GPU"
category: -concepts
tags: ["hardware", "gpu", "nvidia", "cuda", "training", "inference", "alibaba-cloud"]
summary: "NVIDIA GPU 是目前 AI 训练与推理最主流的加速器，配合 CUDA 生态提供从消费级到数据中心级的完整算力方案。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "NVIDIA Graphics Processing Unit"
  - "英伟达 GPU"
relationships:
  - target: "概念/gpu"
    type: is_a
  - target: "概念/cuda"
    type: uses
  - target: "概念/nvidia-smi"
    type: managed_by
sources: []
---

# NVIDIA GPU

> **一句话理解**: NVIDIA GPU 是 AI 领域最主流的算力卡，从游戏卡 RTX 到数据中心 A100/H100，配合 CUDA 生态几乎统治了深度学习训练市场。

## 核心要点

- **CUDA 生态**: NVIDIA 的并行计算平台和编程模型，是深度学习框架的主要后端。
- **数据中心卡**: A100、H100、H200，支持大模型训练和推理。
- **推理卡**: A10、L4、T4，针对推理优化。
- **关键技术**: Tensor Core、NVLink、NVSwitch、MIG、Multi-Instance GPU。
- **管理软件**: NVIDIA Driver、CUDA Toolkit、cuDNN、TensorRT、NVIDIA Container Toolkit。

## 常见产品线

| 系列 | 定位 |
|------|------|
| GeForce RTX | 消费级 / 开发测试 |
| RTX A 系列 | 专业工作站 |
| Tesla / Data Center | 数据中心训练/推理 |
| DGX / HGX | 整机 AI 超级计算机 |

## 阿里云专有云关联

在阿里云专有云环境中，神龙 GPU 实例和 ECS GPU 实例主要使用 NVIDIA A100/V100/T4 等数据中心 GPU，配合 ACK 运行 AI 工作负载。

## Related

- [[概念/gpu|GPU]]
- [[概念/cuda|CUDA]]
- [[概念/nvidia-smi|nvidia-smi]]
- [[概念/mig|MIG]]
- [[概念/tensorrt|TensorRT]]
