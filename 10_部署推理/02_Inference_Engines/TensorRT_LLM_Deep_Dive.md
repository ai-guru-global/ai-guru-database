---
title: "TensorRT-LLM: NVIDIA 生产级 LLM 推理"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "tensorrt-llm", "nvidia", "llm", "fp8", "triton"]
summary: "> **一句话理解**: TensorRT-LLM 是 NVIDIA 的高性能 LLM 推理库——TensorRT 加速 + 定制 kernel，单请求延迟最低，H100/H200 推理性能标杆。"
created: "2026-05-31"
updated: "2026-07-25"
tier: core
aliases:
  - "Tensorrt Llm Deep Dive"
  - "TensorRT LLM Deep Dive"
  - TensorRT_LLM_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# TensorRT-LLM: NVIDIA 生产级 LLM 推理

> **一句话理解**: TensorRT-LLM 是 NVIDIA 的高性能 LLM 推理库——TensorRT 加速 + 定制 kernel，单请求延迟最低，H100/H200 推理性能标杆。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [生产部署](#5-生产部署)
6. [高级特性](#6-高级特性)
7. [监控与运维](#7-监控与运维)
8. [对比与选择](#8-对比与选择)
9. [源码级实现解析（基于 v1.3.0rc22）](#9-源码级实现解析基于-v130rc22)

---

## 1. 概述

### 1.1 定位

```
TensorRT-LLM: NVIDIA 生产级 LLM 推理
═══════════════════════════════════════════════════════════════════

定位: NVIDIA 官方的高性能 LLM 推理库，深度优化 NVIDIA GPU 利用率

核心理念:
───────────────────────────────────────────────────────────────────
• 极致性能: TensorRT 图优化 + 定制 CUDA kernel，单请求延迟最低
• 定制 Kernel: Attention/Fusion/MoE 高度优化
• 多 GPU 扩展: TP/PP/EP 完美支持
• Hopper 优化: H100/H200 原生 FP8、Transformer Engine
• 生产就绪: 与 NVIDIA Triton 深度集成，企业级稳定性
• 生态完整: NGC 镜像、Triton Backend、NeMo 框架支持
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **TensorRT 图优化** | 算子融合、层融合、精度校准 |
| **In-Flight Batching** | 动态批处理，最大 GPU 利用率 |
| **定制 Attention** | FlashAttention / FlashDecoder 优化 |
| **FP8 量化** | H100/H200 原生 FP8，精度损失极小 |
| **多 GPU 扩展** | Tensor / Pipeline / Expert Parallel |
| **MoE 支持** | Mixtral 8x7B / 8x22B 等 MoE 模型优化 |
| **Speculative Decoding** | 推测解码加速 |
| **多 LoRA** | 运行时加载多个 LoRA |
| **Triton 集成** | NVIDIA Triton Inference Server 后端 |
| **长上下文** | 128K+ 上下文优化 |

### 1.3 性能数据 (2026)

| 配置 | 模型 | Batch | 吞吐量 | TTFT |
|------|------|-------|--------|------|
| H100-80GB | Llama 3.1 8B | 1 | 15,000 tok/s | 40ms |
| H100-80GB x4 | Llama 3.1 70B | 1 | 7,800 tok/s | 60ms |
| H100-80GB x8 | Llama 3.1 405B | 1 | 3,200 tok/s | 120ms |
| H200-80GB x8 | Llama 3.1 70B | 1 | 52,000 tok/s | 50ms |
| H100-80GB x8 | Mixtral 8x22B | 1 | 4,500 tok/s | 80ms |

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
│  │ 6. Plugin registration (自定义插件)                         │ │
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

### 2.3 FP8 量化

```
TensorRT-LLM FP8 量化
═══════════════════════════════════════════════════════════════════

FP8 格式:
───────────────────────────────────────────────────────────────────
• 8-bit 浮点: 1 符号位 + 4 指数位 + 3 尾数位 (E4M3)
• 或: 1 符号位 + 5 指数位 + 2 尾数位 (E5M2)

优势:
• 相比 FP16，显存占用减半
• H100/H200 Tensor Core 原生支持
• 推理速度提升 1.5-2x
• 精度损失通常 < 1%

使用条件:
• 需要 Hopper 架构 (H100/H200)
• 需要 Transformer Engine
• 部分模型需要校准
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
│   │  • Quantization (FP8/INT8/INT4)                         │   │
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
│   │  • FlashAttention / FlashDecoder                        │   │
│   │  • Fused MLP/KV Cache                                   │   │
│   │  • Custom LayerNorm                                     │   │
│   │  • FP8 Tensor Core                                      │   │
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

Expert Parallelism (EP) for MoE:
───────────────────────────────────────────────────────────────────
每个专家 (expert) 分布到不同 GPU
All-to-All 通信路由 token 到对应专家
特别适合 Mixtral 8x7B / 8x22B 等 MoE 模型
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 使用 NVIDIA Docker 镜像 (推荐)
docker pull nvcr.io/nvidia/tritonserver:25.03-trtllm-python-py3

# 或源码编译
git clone https://github.com/NVIDIA/TensorRT-LLM.git
cd TensorRT-LLM
git submodule update --init --recursive
./scripts/build_docker.sh
```

### 4.2 模型编译

```bash
# 使用 trtllm-build 编译引擎
trtllm-build \
  --checkpoint_dir ./checkpoints/llama-3.1-8b \
  --output_dir ./engines/llama-3.1-8b \
  --gemm_plugin float16 \
  --max_batch_size 64 \
  --max_input_len 4096 \
  --max_output_len 1024 \
  --max_seq_len 5120 \
  --tp_size 1

# FP8 量化编译 (H100)
trtllm-build \
  --checkpoint_dir ./checkpoints/llama-3.1-8b \
  --output_dir ./engines/llama-3.1-8b-fp8 \
  --gemm_plugin fp8 \
  --quant_ckpt_clip None \
  --strongly_typed \
  --tp_size 1

# 多卡 TP=4
trtllm-build \
  --checkpoint_dir ./checkpoints/llama-3.1-70b \
  --output_dir ./engines/llama-3.1-70b-tp4 \
  --gemm_plugin float16 \
  --tp_size 4
```

### 4.3 启动服务

```python
from tensorrt_llm import LLM

# 创建 LLM 实例
llm = LLM(
    model="./engines/llama-3.1-8b",
    tokenizer="meta-llama/Llama-3.1-8B-Instruct"
)

# 推理
result = llm.generate(
    "解释量子计算的基本原理",
    max_new_tokens=256,
    temperature=0.7
)

print(result)
```

### 4.4 Docker 部署

```bash
# 使用官方镜像启动
docker run -it --rm \
  --gpus all \
  --shm-size=256g \
  -p 8000:8000 \
  -v $(pwd)/engines:/engines \
  nvcr.io/nvidia/tritonserver:25.03-trtllm-python-py3 \
  tritonserver \
  --model-repository=/engines \
  --backend-directory=/opt/tritonserver/backends \
  --http-port=8000
```

---

## 5. 生产部署

### 5.1 NVIDIA Triton 集成

```
Triton + TensorRT-LLM 架构
═══════════════════════════════════════════════════════════════════

Client
  │
  ▼
Triton Inference Server
  │
  ├── HTTP/gRPC API
  │
  ├── TensorRT-LLM Backend
  │     │
  │     ▼
  ├── TensorRT Engine (.engine)
  │     │
  │     ▼
  └── GPU / CUDA
```

### 5.2 Triton 模型仓库配置

```
/models/
└── tensorrt_llm/
    ├── 1/
    │   └── config.json
    ├── config.pbtxt
    └── 1/
        └── llama-3.1-8b.engine
```

```protobuf
# config.pbtxt
name: "tensorrt_llm"
backend: "tensorrtllm"
max_batch_size: 64
input [
  {
    name: "input_ids"
    data_type: TYPE_INT32
    dims: [-1]
  },
  {
    name: "input_lengths"
    data_type: TYPE_INT32
    dims: [1]
  }
]
output [
  {
    name: "output_ids"
    data_type: TYPE_INT32
    dims: [-1]
  }
]
instance_group [
  {
    count: 1
    kind: KIND_GPU
    gpus: [0]
  }
]
```

### 5.3 Kubernetes 部署

```yaml
# tensorrt-llm-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: trt-llm-llama3-8b
spec:
  replicas: 1
  selector:
    matchLabels:
      app: trt-llm-llama3-8b
  template:
    metadata:
      labels:
        app: trt-llm-llama3-8b
    spec:
      containers:
      - name: triton
        image: nvcr.io/nvidia/tritonserver:25.03-trtllm-python-py3
        args:
          - tritonserver
          - --model-repository=/models
          - --http-port=8000
        resources:
          limits:
            nvidia.com/gpu: "1"
        ports:
        - containerPort: 8000
        volumeMounts:
        - name: models
          mountPath: /models
      volumes:
      - name: models
        persistentVolumeClaim:
          claimName: trt-llm-models
---
apiVersion: v1
kind: Service
metadata:
  name: trt-llm-llama3-8b
spec:
  selector:
    app: trt-llm-llama3-8b
  ports:
  - port: 8000
    targetPort: 8000
```

---

## 6. 高级特性

### 6.1 FP8 量化

```bash
# 使用 ModelOpt 进行 FP8 量化
python3 quantize.py \
  --model_dir ./models/llama-3.1-8b \
  --output_dir ./checkpoints/llama-3.1-8b-fp8 \
  --dtype fp8 \
  --qformat fp8

# 编译 FP8 引擎
trtllm-build \
  --checkpoint_dir ./checkpoints/llama-3.1-8b-fp8 \
  --output_dir ./engines/llama-3.1-8b-fp8 \
  --gemm_plugin fp8 \
  --strongly_typed
```

### 6.2 Speculative Decoding

```bash
# 编译带推测解码的引擎
trtllm-build \
  --checkpoint_dir ./checkpoints/llama-3.1-70b \
  --output_dir ./engines/llama-3.1-70b-spec \
  --speculative_decoding_mode draft_tokens_external \
  --max_draft_len 10 \
  --tp_size 8
```

### 6.3 多 LoRA

```bash
# 编译支持 LoRA 的引擎
trtllm-build \
  --checkpoint_dir ./checkpoints/llama-3.1-8b \
  --output_dir ./engines/llama-3.1-8b-lora \
  --lora_plugin float16 \
  --max_lora_rank 64

# 运行时加载 LoRA
# 在 Triton ensemble 中配置 lora_dir
```

### 6.4 长上下文优化

```bash
# 编译 128K 上下文引擎
trtllm-build \
  --checkpoint_dir ./checkpoints/llama-3.1-8b \
  --output_dir ./engines/llama-3.1-8b-128k \
  --max_input_len 131072 \
  --max_seq_len 133120 \
  --use_paged_context_fmha enable
```

---

## 7. 监控与运维

### 7.1 Triton 指标

| 指标 | 说明 |
|------|------|
| `nv_inference_request_success` | 成功请求数 |
| `nv_inference_request_fail` | 失败请求数 |
| `nv_inference_queue_duration_us` | 队列等待时间 |
| `nv_inference_compute_infer_duration_us` | 推理计算时间 |
| `nv_gpu_memory_used_bytes` | GPU 显存使用 |
| `nv_gpu_utilization` | GPU 利用率 |

### 7.2 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 编译失败 | CUDA/TensorRT 版本不匹配 | 使用官方 NGC 镜像 |
| OOM | 引擎过大或 batch 过大 | 降低 max_batch_size / 使用量化 |
| 精度下降 | 量化导致 | 使用校准或更高精度 |
| 延迟高 | batch 太小 | 调整 in-flight batching 参数 |
| NCCL 错误 | 多卡通信问题 | 检查网络、驱动、NCCL 版本 |

---

## 8. 对比与选择

### 8.1 与其他推理引擎对比

| 维度 | TensorRT-LLM | vLLM | SGLang | TGI | LMDeploy |
|------|-------------|------|--------|-----|----------|
| **吞吐量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **延迟 (TTFT)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **FP8 支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **多 GPU** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Triton 集成** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **社区生态** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **MoE 支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

### 8.2 选型建议

| 场景 | 推荐 |
|------|------|
| 最低延迟 | TensorRT-LLM |
| 通用生产 | vLLM |
| 多轮对话/RAG | SGLang |
| H100/H200 部署 | TensorRT-LLM |
| 快速部署 | vLLM |
| Hugging Face 生态 | TGI |
| 中文场景 | LMDeploy |
| 已有 Triton 基础设施 | TensorRT-LLM |

### 8.3 硬件要求

| 配置 | 模型 | 说明 |
|------|------|------|
| H100 80GB x1 | 8B | 单卡 |
| H100 80GB x4 | 70B | TP=4 |
| H100 80GB x8 | 70B | TP=8，高性能 |
| H200 80GB x8 | 405B | 完整部署 |
| H100 80GB x8 | Mixtral 8x22B | EP/TP 混合 |

### 8.4 版本演进

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.5 | 2023.10 | 首个版本 |
| v0.7 | 2024.2 | In-Flight Batching、TP/PP |
| v0.9 | 2024.6 | FP8、Speculative Decoding |
| v0.10 | 2024.10 | Multi-LoRA、MoE 支持 |
| v0.12 | 2025.4 | 128K 长上下文、Triton 集成增强 |
| v0.14 | 2025.10 | 更强量化、Disaggregated Serving |
| v1.0 | 2026.x | 生产稳定版、完整生态 |

---

## 9. 源码级实现解析（基于 v1.3.0rc22）

> 本节基于本仓库归档源码 `code/llm-frameworks/TensorRT-LLM-v1.3.0rc22/`（sparse checkout：`tensorrt_llm/` Python 包 + `cpp/tensorrt_llm/batch_manager`、`cpp/tensorrt_llm/runtime`、`cpp/include`）的实际实现。

### 9.1 架构设计：PyTorch 后端（_torch）+ C++ batch_manager 双层

1.x 版本的重大变化：默认运行时从「TensorRT 引擎编译」转向 **PyTorch 后端**（`tensorrt_llm/_torch/`），不再必须离线 build engine：

| 层次 | 证据文件 | 关键类/函数 |
|---|---|---|
| Python 执行器 | `tensorrt_llm/_torch/pyexecutor/py_executor.py` | `PyExecutor`（L501），`_executor_loop`（L3942）/`_executor_loop_overlap`（L4411） |
| 模型引擎 | `tensorrt_llm/_torch/pyexecutor/model_engine.py` | `ModelEngine(ABC)`（L94）、`PyTorchModelEngine`（L271） |
| 资源管理 | `tensorrt_llm/_torch/pyexecutor/resource_manager.py` | `KVCacheManager(BaseResourceManager)`（L266）、`ResourceManager`（L2533） |
| Python 调度 | `tensorrt_llm/_torch/pyexecutor/scheduler/scheduler.py` | `ScheduledRequests`（L119）、`BindCapacityScheduler`（L309）、`MicroBatchScheduler`（L358） |
| C++ 容量调度 | `cpp/include/tensorrt_llm/batch_manager/capacityScheduler.h` | `MaxUtilizationScheduler`（L95）、`GuaranteedNoEvictScheduler`（L121）、`StaticBatchScheduler`（L148） |
| C++ KV 管理 | `cpp/include/tensorrt_llm/batch_manager/kvCacheManager.h` | `WindowBlockManager`（L866）、`BlockManager`（L1464）、`KVCacheManager`（L2261） |

设计要点：Python 侧 `BindCapacityScheduler` 是 C++ 调度器的绑定包装（nanobind）——调度/KV 管理的热路径在 C++（`batch_manager/`），灵活性需求（新模型接入/采样）在 Python，两层各取所长。

### 9.2 关键技术实现

- **容量调度双策略**：`GuaranteedNoEvictScheduler`（保证不驱逐，保守但稳定）vs `MaxUtilizationScheduler`（最大化利用率，允许抢占），对应配置项 `capacity_scheduler_policy`。
- **分窗口 KV 管理**：`WindowBlockManager` 按 attention window 分组管理 block（支持 sliding window / 变长窗口混合模型），`evictionPolicy.h` 的 `LRUEvictionPolicy`（L71）实现可重用 block 的 LRU 驱逐（即 KV cache reuse，TRT-LLM 版前缀缓存）。
- **投机解码全家族**：`_torch/speculative/` 下 eagle3、mtp（DeepSeek Multi-Token Prediction）、ngram、draft_target 等 10+ 实现，工厂化接入 drafter。
- **attention 后端可插拔**：`_torch/attention_backend/` 提供 trtllm（自研 FMHA kernel）/flashinfer/vanilla 三套后端，接口统一在 `interface.py`。

### 9.3 性能优化机制（源码印证）

- **overlap scheduling**：`PyExecutor._executor_loop_overlap`（L4411）把第 i 步调度与第 i-1 步 GPU 执行重叠，默认开启（对应 `disable_overlap_scheduler` 开关）。
- **CUDA Graph**：`cuda_graph_runner.py` 的 `CUDAGraphRunner`（L116）按 batch 形状捕获/回放 decode 图，配合 `cuda_graph_config` 的 padding 机制提升命中率。
- **ADP 负载均衡**：`scheduler/adp_router.py` 的 `KVCacheAwareADPRouter`（L482）等在 Attention-DP 分组间按 KV 占用路由请求——大规模 MoE 部署（DeepSeek 类）的关键组件。
- **disaggregated serving**：`batch_manager/` 的 `cacheTransceiver.cpp`/`dataTransceiver.cpp` 实现 prefill/decode 分离时的 KV 跨节点传输。

### 9.4 配置与部署要点（源码印证）

- 1.x 推荐入口是 `LLM` API + PyTorch 后端（`tensorrt_llm/_torch/llm.py`），无需预编译引擎；传统 TensorRT 引擎路径仍保留但不再是默认。
- sparse 归档提示：本归档未包含 `examples/` 与 kernel 实现全量（`cpp/tensorrt_llm/kernels` 未纳入），查阅 kernel 细节需参考官方仓库同 tag。

---

## 参考资源

- [TensorRT-LLM GitHub](https://github.com/NVIDIA/TensorRT-LLM)
- [TensorRT-LLM 文档](https://nvidia.github.io/TensorRT-LLM/)
- [NVIDIA Triton](https://developer.nvidia.com/nvidia-triton-inference-server)
- [NVIDIA NGC](https://catalog.ngc.nvidia.com/)
- [NVIDIA ModelOpt](https://github.com/NVIDIA/TensorRT-Model-Optimizer)

---

*Last updated: 2026-07-25*
*Version: 2.1.0*

## Related

- [[10_部署推理/01_Deployment_Fundamentals/Deployment_Inference.md|Deployment_Inference]]
- [[10_部署推理/01_Deployment_Fundamentals/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[10_部署推理/01_Deployment_Fundamentals/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[10_部署推理/01_Deployment_Fundamentals/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive.md|vLLM_Deep_Dive]]
- [[10_部署推理/02_Inference_Engines/SGLang_Deep_Dive.md|SGLang_Deep_Dive]]
- [[10_部署推理/02_Inference_Engines/TGI_Deep_Dive.md|TGI_Deep_Dive]]
- [[10_部署推理/02_Inference_Engines/LMDeploy_Deep_Dive.md|LMDeploy_Deep_Dive]]
- [[12_架构基建/07_Hardware_Compute/CDI_Deep_Dive.md|CDI 容器设备接口（GPU 容器接入）]]
- [[治理/chinese-chips-inference|国产 AI 芯片 × 推理引擎: 硬件约束下的推理软件栈适配]]
