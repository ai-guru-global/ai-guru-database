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
updated: 2026-07-21
aliases:
  - "Tensorrt Llm"
  - "tensorrt llm"
  - "TRT-LLM"

---
# TensorRT-LLM

> **一句话理解**: TensorRT-LLM 就像给 NVIDIA GPU 请了一位“赛车调校师”：把普通模型重新拆解、组装、轻量化，榨干显卡的每一滴性能。

## 核心要点

- **TensorRT-LLM 是 NVIDIA 的 LLM 推理 SDK**，基于 TensorRT 编译器
- **“端到端”含义**：从 HuggingFace/PyTorch 模型 → 编译优化 → 高吞吐服务，一站式完成
- **核心优化**：算子融合、FP8/INT8 量化、Continuous Batching、PagedAttention、TP/PP 并行
- **最佳场景**：NVIDIA GPU（尤其是 H100/B200）上的生产级高吞吐推理

## 为什么需要编译优化？

PyTorch 推理是“解释执行”，每个算子单独跑，中间有很多数据搬运和 kernel 启动开销。

TensorRT-LLM 会：
1. **融合算子**：把多个小操作合并成一个大 kernel
2. **选择最优 kernel**：根据 GPU 架构挑最快的实现
3. **量化权重/激活**：FP16 → FP8/INT8，减少计算和显存
4. **显存优化**：PagedAttention 管理 KV Cache，Continuous Batching 动态调度

## 主要特性

| 特性 | 说明 |
|------|------|
| **FP8 量化** | H100/B200 原生支持，速度极快 |
| **INT8/INT4 AWQ/GPTQ** | 在 A100/RTX 上平衡速度与精度 |
| **Continuous Batching** | 动态 batch 调度 |
| **PagedAttention** | 虚拟内存式 KV Cache |
| **Tensor Parallelism** | 多 GPU 张量并行 |
| **Pipeline Parallelism** | 多 GPU 流水线并行 |
| **In-flight Batching** | 请求级动态插入/移除 |
| **Triton Integration** | 包装成 Triton Inference Server 后端 |

## 使用流程

```bash
# 1. 转换模型
python convert_checkpoint.py \
    --model_dir ./Qwen2.5-72B \
    --output_dir ./tllm_ckpt \
    --dtype float16 \
    --tp_size 4

# 2. 编译引擎
trtllm-build \
    --checkpoint_dir ./tllm_ckpt \
    --output_dir ./engine \
    --gemm_plugin float16 \
    --max_batch_size 64

# 3. 启动服务
mpirun -n 4 trtllm-serve ./engine \
    --hostname 0.0.0.0 --port 8000
```

## 引擎对比 (2026)

| 维度 | TensorRT-LLM | vLLM | SGLang |
|------|--------------|------|--------|
| 厂商 | NVIDIA | Berkeley | LMSYS |
| 最佳硬件 | NVIDIA H100/B200 | 通用 NVIDIA/AMD | 通用 NVIDIA/AMD |
| 编译 | 需要编译 (10-60min) | 即开即用 | 即开即用 |
| 灵活性 | 高（可定制） | 中 | 中 |
| 吞吐 | 极高 | 高 | 高 |
| 多模态 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| MoE 支持 | ✅ | ✅ | ✅ |
| 生态 | NVIDIA 封闭 | 开源社区 | 开源社区 |

## 适用场景

| 场景 | 推荐度 | 理由 |
|------|:------:|------|
| NVIDIA GPU 生产环境 | ⭐⭐⭐⭐⭐ | 极致性能 + 企业支持 |
| 快速迭代/实验 | ⭐⭐ | 编译时间长，不适合频繁换模型 |
| 非 NVIDIA 硬件 | ⭐ | 不支持 AMD/国产芯片 |
| 高并发 SaaS | ⭐⭐⭐⭐⭐ | In-flight Batching + Triton |
| Agent/多轮场景 | ⭐⭐⭐ | 缺少 RadixAttention 等优化 |

## 2026 年更新

- **B200 支持**: 原生 FP4 量化，吐量再提升 2×
- **多模态**: 支持 LLaVA、Qwen-VL 等视觉语言模型
- **MoE 优化**: DeepSeek-V3、Mixtral 等 MoE 模型专项优化
- **与 Triton 深度集成**: 支持多模型、多后端统一服务

## 延伸阅读

- [[概念/Inference/model-serving|模型服务]]
- [[概念/Inference/quantization|量化]]
- [[概念/Inference/continuous-batching|Continuous Batching]]
- [[概念/Inference/sglang|SGLang]]
- [[部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive|TensorRT-LLM 深度解析]]
- [[部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide|推理引擎选型指南]]
