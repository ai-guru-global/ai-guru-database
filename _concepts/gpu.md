---
title: "GPU"
category: -concepts
tags: ["hardware", "gpu", "nvidia", "training", "inference", "alibaba-cloud"]
summary: "GPU（Graphics Processing Unit）是适合大规模并行计算的处理器，是现代 AI 训练与推理的主要算力来源。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "Graphics Processing Unit"
  - "图形处理器"
relationships:
  - target: "_concepts/nvidia-gpu"
    type: related_to
  - target: "_concepts/ascend-npu"
    type: related_to
  - target: "_concepts/gpu-oom"
    type: related_to
---

# GPU

> **一句话理解**: GPU 是 AI 算力的「发动机」，擅长同时做大量简单计算，训练大模型和跑推理都离不开它。

## 核心要点

- **并行计算**: 拥有数千个 CUDA Core，适合矩阵运算。
- **显存**: 用于存放模型参数、激活值、KV Cache。
- **主流厂商**: NVIDIA、AMD、Intel、以及国产昇腾/寒武纪/海光/摩尔线程。
- **关键指标**: 算力（TFLOPS）、显存容量/带宽、功耗。
- **软件栈**: CUDA、ROCm、oneAPI、CANN。

## 选型对比

| 场景 | 推荐 |
|------|------|
| 大模型训练 | NVIDIA A100/H100/H200 |
| 推理服务 | NVIDIA A10/L4/T4 或国产推理卡 |
| 边缘推理 | Jetson 或 NPU |

## 阿里云专有云关联

在阿里云专有云环境中，GPU 实例主要为神龙弹性裸金属或 ECS GPU 型实例，配合 ACK 运行 AI 训练/推理工作负载。

## Related

- [[_concepts/nvidia-gpu|NVIDIA GPU]]
- [[_concepts/ascend-npu|Ascend NPU]]
- [[_concepts/mig|MIG]]
- [[_concepts/hami|HAMi]]
- [[_concepts/gpu-oom|GPU OOM]]
