---
title: "TensorRT-LLM: NVIDIA 生产级 LLM 推理"
category: "09-deployment-inference"
tags: ["deployment", "inference", "serving", "vllm", "llm"]
summary: "> **一句话理解**: TensorRT-LLM 是 NVIDIA 的高性能 LLM 推理库——TensorRT 加速 + 定制 kernel，单请求延迟最低，H100 推理性能标杆。"
created: "2026-05-31"
updated: "2026-05-31"
---

# TensorRT-LLM: NVIDIA 生产级 LLM 推理

> **一句话理解**: TensorRT-LLM 是 NVIDIA 的高性能 LLM 推理库——TensorRT 加速 + 定制 kernel，单请求延迟最低，H100 推理性能标杆。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
TensorRT-LLM: NVIDIA 生产级 LLM 推理
═══════════════════════════════════════════════════════════════════

定位: NVIDIA 官方的高性能 LLM 推理库，深度优化 GPU 利用率

核心理念:
───────────────────────────────────────────────────────────────────
• 极致性能: TensorRT 加速，单请求延迟最低
• 定制 Kernel: Attention/Fusion 高度优化
• 多 GPU 扩展: TP/PP 完美支持
• H100 优化: 充分利用hopper架构
• 生产就绪: 企业级稳定性和支持
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **TensorRT 加速** | 深度学习推理引擎 |
| **In-Flight Batching** | 动态批处理，最大 GPU 利用率 |
| **定制 Attention** | FlashAttention 优化 |
| **算子融合** | 减少内存访问 |
| **FP8 支持** | H100 原生 |
| **多GPU扩展** | Tensor/Pipeline Parallel |
| **FlashAttention-3** | 2024 新优化 |

### 1.3 性能数据 (2026)

| 配置 | 模型 | Batch | 吞吐量 | TTFT |
|------|------|-------|--------|------|
| H100-80GB | Llama 3.1 8B | 1 | 15,000 tok/s | 50ms |
| H100-80GB x8 | Llama 3.1 70B | 1 | 45,000 tok/s | 80ms |
| H100-80GB x8 | Llama 3.1 405B | 1 | 18,000 tok/s | 150ms |
| H200-80GB | Llama 3.1 70B | 1 | 52,000 tok/s | 60ms |

---

## 2. 核心概念

### 2.1 TensorRT 加速原理

```
TensorRT 优化流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        TensorRT 优化                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PyTorch Model (FP32/FP16)                                       │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Model Optimization                                          │ │
│  │ 1. Layer fusion (算子融合)                                  │ │
│  │ 2. Precision calibration (精度校准)                         │ │
│  │ 3. Kernel auto-tuning (kernel 自动调优)                     │ │
│  │ 4. Memory optimization (内存优化)                            │ │
│  │ 5. Graph optimization (图优化)                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  TensorRT Engine (.engine)                                       │
│       │                                                           │
│       ▼                                                           │
│  Optimized Inference                                             │
│       │                                                           │
│       ▼                                                           │
│  性能提升: 2-10x vs PyTorch eager mode                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 In-Flight Batching

```
In-Flight Batching vs 传统 Batching
═══════════════════════════════════════════════════════════════════

传统 Batching:
───────────────────────────────────────────────────────────────────
所有请求必须同时开始，同时结束
Batch = [Req1, Req2, Req3]
Req1: [████████████████████████░░░░] 慢，阻塞其他
Req2: [████████████░░░░░░░░░░░░░░░░] 中等
Req3: [██████████░░░░░░░░░░░░░░░░░░] 快
         ↑ GPU 等待最慢的请求完成

In-Flight Batching:
───────────────────────────────────────────────────────────────────
动态加入新请求，完成即释放
Step 1: Batch = [Req1, Req2, Req3]
Req1: [████████████████████████░░░░]
Req2: [████████████░░░░░░░░░░░░░░░░]
Req3: [██████████░░░░░░░░░░░░░░░░░░]

Step 2: Req3 完成，释放 GPU
Batch = [Req4, Req5, Req1]
Req4: [███████████████░░░░░░░░░░░░░]
Req5: [█████████████░░░░░░░░░░░░░░░░]
Req1: [████████████████████████████░░] 继续

优势:
• GPU 利用率最大化
• TTFT (Time to First Token) 更稳定
• 吞吐量大幅提升
```

---

## 3. 架构设计

### 3.1 系统架构

```
TensorRT-LLM 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        TensorRT-LLM 架构                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Python API Layer                            │   │
│   │  • model_runner.py                                      │   │
│   │  • config.py                                           │   │
│   │  • inference.py                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              TensorRT Builder                            │   │
│   │  • Network Definition                                   │   │
│   │  • Plugin Registry                                      │   │
│   │  • Calibration                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              TensorRT Engine                             │   │
│   │  • .engine (优化后的推理引擎)                            │   │
│   │  • 融合的 kernel                                        │   │
│   │  • 量化参数                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CUDA Kernels                                │   │
│   │  • FlashAttention                                       │   │
│   │  • Fused MLP/KV Cache                                   │   │
│   │  • Custom LayerNorm                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 模型并行策略

```
TensorRT-LLM 模型并行
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                     Tensor Parallelism (TP)                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Layer 1: W = [W1 ║ W2 ║ W3 ║ W4]                               │
│            │    │    │    │                                      │
│            ▼    ▼    ▼    ▼                                      │
│          GPU0 GPU1 GPU2 GPU3                                     │
│                                                                   │
│  Forward: 每个 GPU 计算一部分                                     │
│  AllReduce: 汇总结果                                              │
│                                                                   │
│  使用场景: 单节点多 GPU                                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                   Pipeline Parallelism (PP)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  GPU0: Layer 1-8                                                  │
│  GPU1: Layer 9-16                                                 │
│  GPU2: Layer 17-24                                                │
│  GPU3: Layer 25-32                                                │
│                                                                   │
│  微批次流水线:                                                    │
│  Batch 1: [G0][G1][G2][G3]                                       │
│  Batch 2:    [G0][G1][G2][G3]                                    │
│                                                                   │
│  使用场景: 多节点扩展                                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 使用 NVIDIA Docker 镜像 (推荐)
docker pull nvcr.io/nvidia/tritonserver:24.03-trtllm-python

# 或源码编译
git clone https://github.com/NVIDIA/TensorRT-LLM.git
cd TensorRT-LLM
git submodule update --init --recursive
./scripts/build_docker.sh
```

### 4.2 模型编译

```bash
# 下载模型
python3 scripts/download_model.py \
  --model meta-llama/Meta-Llama-3.1-8B-Instruct \
  --output_dir ./models/llama-3.1-8b

# 编译 TensorRT Engine
python3 -m tensorrt_llm.commands.build \
  --model meta-llama/Meta-Llama-3.1-8B-Instruct \
  --dtype float16 \
  --tp_size 1 \
  --paged_kv_cache enable \
  --output_dir ./engines/llama-3.1-8b
```

### 4.3 启动服务

```bash
# 启动 Triton Inference Server
python3 -m tensorrt_llm.commands.run \
  --engine_dir ./engines/llama-3.1-8b \
  --max_input_len 4096 \
  --max_output_len 1024 \
  --batch_size 32 \
  --num_prepend_gfter_tokens 3
```

### 4.4 API 调用

```python
from tensorrt_llm import TRTLLMEngine

# 创建引擎
engine = TRTLLMEngine(
    engine_dir="./engines/llama-3.1-8b",
    max_input_len=4096,
    max_output_len=1024
)

# 推理
result = engine.generate(
    prompt="解释量子计算的基本原理",
    temperature=0.7,
    max_tokens=256
)

print(result)
```

### 4.5 Docker 部署

```bash
# 使用官方镜像启动
docker run -it --rm \
  --gpus all \
  --shm-size=500g \
  -p 8000:8000 \
  nvcr.io/nvidia/tritonserver:24.03-trtllm-python \
  tritonserver \
  --model-repository=/model_repository \
  --backend-directory=/tensorrtllm_backend \
  --add-cuda-ops
```

---

## 5. 高级特性

### 5.1 FP8 量化

```bash
# FP8 编译 (H100)
python3 -m tensorrt_llm.commands.build \
  --model meta-llama/Meta-Llama-3.1-8B-Instruct \
  --dtype fp8 \
  --tp_size 8 \
  --output_dir ./engines/llama-3.1-8b-fp8
```

```python
# FP8 推理
result = engine.generate(
    prompt="写一段 Python 代码",
    temperature=0.7,
    max_tokens=512
)
```

### 5.2 Speculative Decoding

```bash
# 编译带推测解码的引擎
python3 -m tensorrt_llm.commands.build \
  --model meta-llama/Meta-Llama-3.1-8B-Instruct \
  -- speculative_model meta-llama/Meta-Llama-3.1-70B-Instruct \
  --num_speculative_tokens 5 \
  --tp_size 8
```

### 5.3 多 LoRA

```bash
# 编译多 LoRA 引擎
python3 -m tensorrt_llm.commands.build \
  --model meta-llama/Meta-Llama-3.1-8B-Instruct \
  --lora_dir ./loras/sft,./loras/rlh \
  --max_loras 8 \
  --tp_size 4
```

---

## 6. 对比与选择

### 6.1 与其他推理引擎对比

| 维度 | TensorRT-LLM | vLLM | SGLang |
|------|-------------|------|--------|
| **吞吐量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **延迟 (TTFT)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **FP8 支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **多 GPU** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **社区生态** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 最低延迟 | TensorRT-LLM |
| 通用生产 | vLLM |
| 多轮对话/RAG | SGLang |
| H100 部署 | TensorRT-LLM |
| 快速部署 | vLLM |

### 6.3 硬件要求

| 配置 | 模型 | 说明 |
|------|------|------|
| H100 80GB x1 | 8B | 单卡 |
| H100 80GB x4 | 70B | TP=4 |
| H100 80GB x8 | 70B | TP=8，高性能 |
| H200 80GB x8 | 405B | 完整部署 |

---

## 参考资源

- [TensorRT-LLM GitHub](https://github.com/NVIDIA/TensorRT-LLM)
- [TensorRT-LLM 文档](https://nvidia.github.io/TensorRT-LLM/)
- [NVIDIA Triton](https://developer.nvidia.com/nvidia-triton-inference-server)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[09_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[09_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[09_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[09_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[09_Deployment_Inference/JVM_AI_Deployment.md|JVM_AI_Deployment]]
