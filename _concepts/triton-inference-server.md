---
title: "Triton Inference Server"
category: -concepts
tags: ["inference", "serving", "nvidia", "gpu", "alibaba-cloud"]
summary: "Triton Inference Server 是 NVIDIA 开源的推理服务平台，支持 TensorRT、PyTorch、ONNX、Python 等多种后端，提供动态批处理、模型并发、GPU 共享等企业级特性。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Triton"
  - "NVIDIA Triton"
relationships:
  - target: "_concepts/tensorrt"
    type: integrates
  - target: "_concepts/nvidia-gpu"
    type: runs_on
  - target: "_concepts/model-serving"
    type: is_a
sources: []
---

# Triton Inference Server

> **一句话理解**: Triton 是 NVIDIA 的「多模型推理服务平台」，能把 TensorRT、PyTorch、ONNX 等不同格式的模型放在同一个服务里跑。

## 核心要点

- **多后端支持**: TensorRT、PyTorch、ONNX Runtime、Python、TensorFlow。
- **动态批处理**: Dynamic Batching 提高 GPU 利用率。
- **模型并发**: 同一 GPU 上同时运行多个模型。
- **模型热加载**: 模型仓库更新后自动加载新版本。
- **KServe 集成**: 可作为 KServe predictor runtime。

## 阿里云专有云关联

在阿里云专有云环境中，Triton 常用于 NVIDIA GPU 上的企业级推理服务，可与 KServe/ACK 集成。

## Related

- [[_concepts/tensorrt|TensorRT]]
- [[_concepts/kserve|KServe]]
- [[_concepts/model-serving|Model Serving]]
- [[_concepts/nvidia-gpu|NVIDIA GPU]]
