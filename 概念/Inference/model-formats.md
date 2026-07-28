---
title: "模型格式 (Model Formats)"
category: -concepts
tags: ["model-format", "gguf", "safetensors", "onnx", "tensorrt", "quantization", "deployment"]
relationships:
  - target: "概念/gguf"
    type: contains
  - target: "概念/safetensors"
    type: contains
  - target: "概念/onnx"
    type: contains
  - target: "概念/quantization"
    type: related_to
  - target: "概念/model-deployment"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
  - 10_部署推理/05_Quantization/Quantization_Techniques_2026.md
summary: "模型格式是大模型在存储、分发、推理过程中使用的文件容器。不同格式对应不同生态和场景：Safetensors 用于安全分发，GGUF 用于 llama.cpp 本地/边缘推理，ONNX 用于跨框架部署，TensorRT 等用于厂商硬件加速。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-25
tier: core
created: 2026-06-25
updated: 2026-07-21
aliases:
  - Model Format
  - 模型文件格式
  - 大模型格式
name_zh: "模型格式"
---

# 模型格式 (Model Formats)

> 中文简称：模型格式

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
    ├──▶ GGUF ──▶ llama.cpp / Ollama / 边缘设备
    │
    └──▶ Core ML / TFLite ──▶ 移动端/嵌入式
```

## 6. 2026 年趋势

| 趋势 | 说明 |
|------|------|
| **Safetensors 统一分发** | 几乎所有新模型默认 Safetensors，pickle 已淘汰 |
| **GGUF 生态爆发** | Ollama/llama.cpp 普及，Q4_K_M 成为本地推理标配 |
| **FP4 量化** | B200 支持 FP4，模型体积再缩小 50% |
| **Sharded 格式** | 大模型分片存储，支持并行加载 |
| **流式加载** | 按需加载层，减少启动时间和显存峰值 |

## 延伸阅读

- [[概念/Inference/gguf|GGUF 模型格式]]
- [[概念/Inference/safetensors|Safetensors]]
- [[概念/Inference/quantization|量化]]
- [[概念/LLM/tensorrt-llm|TensorRT-LLM]]
- [[概念/LLM/llama-cpp|llama.cpp]]
- [[10_部署推理/05_Quantization/Quantization_Techniques_2026|量化技术 2026]]

## 模型格式选型决策树

```
部署目标?
├── NVIDIA GPU 极致性能 → TensorRT Engine (.engine)
├── NVIDIA GPU 通用服务 → SafeTensors + vLLM/SGLang
├── CPU/边缘/Apple → GGUF + llama.cpp
├── Intel CPU/iGPU → OpenVINO IR
├── 多框架兼容 → ONNX
└── 训练/微调 → SafeTensors (HuggingFace)
```

## 格式对比速查表

| 格式 | 体积 | 加载速度 | 推理速度 | 生态 | 适用 |
|------|------|---------|---------|------|------|
| **SafeTensors** | 大 (FP16) | 快 | 中 | HF 生态 | 训练/通用 |
| **GGUF** | 小 (Q4-Q8) | 快 | 中 | llama.cpp | 边缘/CPU |
| **TensorRT** | 中 | 慢(编译) | 极快 | NVIDIA | 生产极致 |
| **ONNX** | 中 | 中 | 中 | 多框架 | 跨平台 |
| **OpenVINO** | 中 | 中 | 快 | Intel | Intel 硬件 |

## 生产最佳实践

1. **生产用 SafeTensors + vLLM**：生态最成熟，部署最简单
2. **极致性能用 TensorRT**：吐吐量要求极高时编译 TensorRT 引擎
3. **边缘用 GGUF Q4_K_M**：资源受限场景的最佳选择
4. **避免 pickle**：.bin 格式有安全风险，始终用 SafeTensors
5. **版本管理**：模型文件纳入版本控制或对象存储，支持回滚

## 2026 模型格式生态现状

| 格式 | 主要用途 | 生态支持 | 状态 |
|------|----------|----------|------|
| **SafeTensors** | 云端训练/推理 | HuggingFace/vLLM/SGLang | GA 主流 |
| **GGUF** | 边缘/本地推理 | llama.cpp/Ollama | GA 活跃 |
| **TensorRT Engine** | NVIDIA 极致性能 | TensorRT-LLM | GA |
| **ONNX** | 跨平台部署 | ONNX Runtime | GA 稳定 |
| **CoreML** | Apple 设备 | Xcode/Apple ML | GA |
| **ExecuTorch** | 移动端 | PyTorch/Meta | Beta |

## 格式转换工作流

```bash
# PyTorch → SafeTensors (HuggingFace 默认)
from safetensors.torch import save_file
save_file(state_dict, "model.safetensors")

# SafeTensors → GGUF (llama.cpp 工具链)
python convert_hf_to_gguf.py model_dir --outtype f16
llama-quantize model.gguf model-Q4_K_M.gguf Q4_K_M

# SafeTensors → TensorRT (NVIDIA 编译)
trtllm-build --checkpoint_dir ./ckpt --output_dir ./engine
```

## 延伸阅读

- [[概念/Inference/safetensors|SafeTensors]] — 安全模型格式详解
- [[概念/Inference/gguf|GGUF]] — 边缘推理量化格式
- [[概念/Inference/tensorrt|TensorRT]] — NVIDIA 高性能推理引擎
- [[概念/Inference/quantization|量化]] — 模型压缩与精度权衡
- [[概念/Inference/model-serving|模型服务]] — 部署架构设计

> ℹ️ 模型格式选择直接影响部署效率、推理速度和安全性，生产环境优先选择 SafeTensors。
