---
title: "TensorRT"
category: -concepts
tags: ["inference", "nvidia", "gpu", "optimization", "alibaba-cloud"]
summary: "TensorRT 是 NVIDIA 的高性能深度学习推理优化器和运行时，通过图层融合、精度校准、kernel 自动调优等手段加速推理。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "NVIDIA TensorRT"
relationships:
  - target: "概念/nvidia-gpu"
    type: runs_on
  - target: "概念/cuda"
    type: uses
  - target: "概念/tensorrt-llm"
    type: related_to
sources: []
---

# TensorRT

> **一句话理解**: TensorRT 是 NVIDIA 的「推理加速器」，能把训练好的模型编译成在 NVIDIA GPU 上跑得更快的版本。

## 核心要点

- **推理优化**: 图层融合、张量内存优化、精度校准（FP16/INT8）、动态 shape。
- **支持框架**: ONNX、PyTorch、TensorFlow。
- **TensorRT-LLM**: 针对大语言推理的专用版本，支持 TP/PP、FP8、PagedAttention。
- **部署形态**: 可独立使用，也可通过 Triton Inference Server 加载。

## 与 TensorRT-LLM 关系

| 工具 | 适用 |
|------|------|
| TensorRT | CNN/Transformer 通用推理 |
| TensorRT-LLM | GPT/LLM 专用推理 |

## 阿里云专有云关联

在阿里云专有云推理部署中，TensorRT-LLM 是 NVIDIA H100 等 GPU 上的高性能推理方案之一。

## Related

- [[概念/tensorrt-llm|TensorRT-LLM]]
- [[概念/nvidia-gpu|NVIDIA GPU]]
- [[概念/cuda|CUDA]]
- [[概念/triton-inference-server|Triton Inference Server]]
