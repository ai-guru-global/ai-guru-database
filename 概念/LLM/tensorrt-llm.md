---
title: "TensorRT-LLM"
category: -concepts
tags: ["tensorrt-llm", "nvidia", "inference", "serving", "optimization", "quantization"]
relationships:
  - target: "概念/model-serving"
    type: belongs_to
  - target: "概念/tensorrt"
    type: implements
  - target: "概念/quantization"
    type: uses
  - target: "概念/continuous-batching"
    type: uses
sources:
  - 部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive.md
  - 部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide.md
  - 架构基建/AI_Stack_Inference_Serving_Guide.md
summary: "TensorRT-LLM 是 NVIDIA 推出的 LLM 推理优化引擎。它把模型编译成高度优化的 GPU 执行图，支持 FP8/INT8 量化、Continuous Batching、PagedAttention、多 GPU 并行，是 NVIDIA GPU 上追求极致性能的首选。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Tensorrt Llm"
  - "tensorrt llm"

---
# TensorRT-LLM

## 核心要点

- **TensorRT-LLM 是 NVIDIA 的 LLM 推理 SDK**，基于 TensorRT 编译器。
- **‘端到端’含义**：从 HuggingFace/PyTorch 模型 → 编译优化 → 高吞吐服务，一站式完成。
- **核心优化**：算子融合、FP8/INT8 量化、Continuous Batching、PagedAttention、TP/PP 并行。
- **最佳场景**：NVIDIA GPU（尤其是 H100/A100/Ada）上的生产级高吞吐推理。

## 一句话理解

TensorRT-LLM 就像给 NVIDIA GPU 请了一位‘赛车调校师’：把普通模型重新拆解、组装、轻量化，榨干显卡的每一滴性能。

## 详细内容

### 为什么需要编译优化？

PyTorch 推理是‘解释执行’，每个算子单独跑，中间有很多数据搬运和 kernel 启动开销。

TensorRT-LLM 会：
1. **融合算子**：把多个小操作合并成一个大 kernel。
2. **选择最优 kernel**：根据 GPU 架构挑最快的实现。
3. **量化权重/激活**：FP16 → FP8/INT8，减少计算和显存。
4. **显存优化**：PagedAttention 管理 KV Cache，Continuous Batching 动态调度。

### 主要特性

| 特性 | 说明 |
|------|------|
| **FP8 量化** | H100 原生支持，速度极快 |
| **INT8/INT4 AWQ/GPTQ** | 在 A100/RTX 上平衡速度与精度 |
| **Continuous Batching** | 动态 batch 调度 |
| **PagedAttention** | 虚拟内存式 KV Cache |
| **Tensor Parallelism** | 多 GPU 张量并行 |
| **Pipeline Parallelism** | 多 GPU 流水线并行 |
| **Triton Integration** | 可包装成 Triton Inference Server 后端 |

### 使用流程

```bash
# 1. 准备模型（如 Llama）
# 2. 转换/编译
python convert_checkpoint.py --model_dir ./llama-7b --output_dir ./tllm_checkpoint
python build.py --checkpoint_dir ./tllm_checkpoint --output_dir ./llama-7b-trt

# 3. 启动服务（可配合 Triton）
```

### TensorRT-LLM vs vLLM/SGLang

| 维度 | TensorRT-LLM | vLLM | SGLang |
|------|--------------|------|--------|
| 厂商 | NVIDIA | Berkeley | Berkeley/LMSYS |
| 最佳硬件 | NVIDIA H100/A100 | 通用 NVIDIA | 通用 NVIDIA |
| 编译 | 需要编译 | 即开即用 | 即开即用 |
| 灵活性 | 高（可定制） | 中 | 中 |
| 吞吐 | 极高 | 高 | 高 |
| 生态 | NVIDIA 生态 | 开源社区 | 开源社区 |

## 开放问题

- 编译时间较长，模型迭代频繁时成本较高。
- 对非 NVIDIA 硬件（AMD、国产芯片）不支持。
- 与最新模型架构（Mamba、MoE、多模态）的适配速度。

## Related

- [[概念/tensorrt-llm-practical|TRT-LLM 实战指南]]
- [[概念/model-serving]] — 模型服务
- [[概念/quantization]] — 量化
- [[概念/continuous-batching]] — Continuous Batching
- [[概念/paged-attention]] — PagedAttention
- [[部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive]] — TensorRT-LLM 深度解析
- [[部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide]] — LLM 推理引擎选型指南
