---
title: "模型格式 (Model Formats)"
category: -concepts
tags: ["model-format", "gguf", "safetensors", "onnx", "tensorrt", "quantization", "deployment"]
relationships:
  - target: "_concepts/gguf"
    type: contains
  - target: "_concepts/safetensors"
    type: contains
  - target: "_concepts/onnx"
    type: contains
  - target: "_concepts/quantization"
    type: related_to
  - target: "_concepts/model-deployment"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 部署推理/Quantization/Quantization_Techniques_2026.md
summary: "模型格式是大模型在存储、分发、推理过程中使用的文件容器。不同格式对应不同生态和场景：Safetensors 用于安全分发，GGUF 用于 llama.cpp 本地/边缘推理，ONNX 用于跨框架部署，TensorRT 等用于厂商硬件加速。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: draft
lifecycle_changed: 2026-06-25
tier: core
created: 2026-06-25
updated: 2026-06-25
aliases:
  - Model Format
  - 模型文件格式
  - 大模型格式
---

# 模型格式 (Model Formats)

> **一句话理解**: 模型格式就是大模型的"文件格式"——不同格式就像 .mp4、.mov、.avi，各有擅长的播放器（推理引擎）和场景。

---

## 1. 为什么要区分模型格式

大模型从训练到部署会经过多个阶段，每个阶段对文件格式的需求不同：

| 阶段 | 需求 | 典型格式 |
|------|------|----------|
| **训练** | 保存检查点、恢复训练 | .pt / .pth / .ckpt |
| **开源分发** | 安全、通用、易加载 | Safetensors |
| **跨框架部署** | PyTorch/TensorFlow 都能跑 | ONNX |
| **本地/边缘推理** | 单文件、量化、低资源 | GGUF |
| **GPU 高性能推理** | 图优化、低延迟 | TensorRT |
| **移动端/IoT** | 极小体积、低功耗 | TFLite |

---

## 2. 主流格式对比

| 格式 | 定位 | 生态 | 量化 | 典型场景 |
|------|------|------|------|----------|
| **Safetensors** | 安全权重格式 | HuggingFace | FP16/BF16/FP8/INT8 | 模型分发、训练后加载 |
| **GGUF** | llama.cpp 单文件格式 | llama.cpp / Ollama | Q2/Q4/Q5/Q8/FP16 | 本地推理、边缘设备、CPU 推理 |
| **ONNX** | 跨框架交换格式 | ONNX Runtime | INT8/FP16 | 跨平台部署、C++/移动端 |
| **TensorRT** | NVIDIA 优化格式 | NVIDIA GPU | INT8/FP16/FP8 | NVIDIA GPU 高性能推理 |
| **OpenVINO IR** | Intel 优化格式 | Intel CPU/iGPU/NPU | INT8/FP16 | Intel 硬件推理 |
| **Core ML** | Apple 生态格式 | iOS/macOS | 多种量化 | Apple 设备端推理 |
| **TFLite** | 移动端轻量格式 | Android/嵌入式 | INT8/FP16 | 手机、IoT、MCU |
| **PyTorch .pt/.pth** | 训练框架原生 | PyTorch | 有限 | 训练、研究、原型 |
| **GGML** | GGUF 的前身 | 早期 llama.cpp | Q4/Q5 等 | 已逐步被 GGUF 替代 |

---

## 3. 按用途选型

```
┌─────────────────────────────────────────────────────────┐
│                    模型格式选型决策树                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  需要 HuggingFace 分发/训练？ ──▶ Safetensors          │
│  需要跨框架/跨语言部署？ ───────▶ ONNX                 │
│  需要在本地/边缘/CPU 跑 LLM？ ──▶ GGUF                 │
│  需要在 NVIDIA GPU 高性能？ ────▶ TensorRT             │
│  需要在 Intel 硬件加速？ ───────▶ OpenVINO IR          │
│  需要在 Apple 设备端运行？ ─────▶ Core ML              │
│  需要在手机/IoT 极小体积？ ─────▶ TFLite               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 关键洞察

1. **没有万能格式**：每种格式都是特定场景下的 trade-off。
2. **量化是 GGUF 的核心优势**：同样 7B 模型，GGUF Q4 可能只要 4GB，而 FP16 要 14GB。
3. **Safetensors 是分发标准**：HuggingFace Hub 上绝大多数模型默认用它，因为它安全、加载快。
4. **ONNX 是桥梁**：训练框架和推理引擎之间的"通用语言"。
5. **厂商格式追求极致性能**：TensorRT、OpenVINO IR、Core ML 都会做图优化和硬件特化。

---

## 5. 常见转换路径

```
PyTorch 训练模型
    │
    ├──▶ Safetensors ──▶ HuggingFace 分发
    │
    ├──▶ ONNX ──▶ ONNX Runtime / TensorRT / OpenVINO
    │
    ├──▶ GGUF ──▶ llama.cpp / Ollama / llama-box / 边缘设备
    │
    └──▶ Core ML / TFLite ──▶ 移动端/嵌入式
```

---

## Related

- [[_concepts/gguf]] — GGUF 模型格式
- [[_concepts/safetensors]] — Safetensors 安全模型格式
- [[_concepts/onnx]] — ONNX 开放神经网络交换格式
- [[_concepts/quantization]] — 量化
- [[_concepts/llama-cpp]] — llama.cpp
- [[_concepts/llama-box]] — llama-box 推理后端
- [[_concepts/tensorrt-llm]] — TensorRT-LLM
