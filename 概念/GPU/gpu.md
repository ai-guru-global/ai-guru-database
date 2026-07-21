---
title: "GPU"
category: -concepts
tags: ["hardware", "gpu", "nvidia", "training", "inference", "alibaba-cloud"]
summary: "GPU（Graphics Processing Unit）是适合大规模并行计算的处理器，是现代 AI 训练与推理的主要算力来源。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "Graphics Processing Unit"
  - "图形处理器"
relationships:
  - target: "概念/nvidia-gpu"
    type: related_to
  - target: "概念/ascend-npu"
    type: related_to
  - target: "概念/gpu-oom"
    type: related_to
sources: []
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

- [[概念/nvidia-gpu|NVIDIA GPU]]
- [[概念/ascend-npu|Ascend NPU]]
- [[概念/mig|MIG]]
- [[概念/hami|HAMi]]
- [[概念/gpu-oom|GPU OOM]]

---

## 2026 GPU 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **NVIDIA H100/H200** | Hopper 架构，FP8 训练/推理 | GA |
| **NVIDIA B100/B200** | Blackwell 架构，性能翻倍 | GA |
| **AMD MI300X** | CDNA 3 架构，192GB HBM3 | GA |
| **Intel Gaudi 3** | 专用 AI 训练芯片 | GA |
| **国产 GPU** | 华为 Ascend/寒武纪/海光 DCU | GA |

## 生产最佳实践

1. **训练用 H100/H200**：大模型训练首选 NVIDIA H100/H200
2. **推理用 L40S/A10**：推理场景用 L40S/A10，成本更低
3. **显存规划**：根据模型大小选择显存，避免 OOM
4. **多卡互联**：多卡训练用 NVLink，多节点用 InfiniBand
5. **监控利用率**：实时监控 GPU 利用率，发现瓶颈
