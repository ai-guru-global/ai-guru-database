---
title: "LMDeploy: InternLM 高性能推理引擎"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "lmdeploy", "turbomind", "internlm", "chinese", "awq"]
summary: "> **一句话理解**: LMDeploy 是上海人工智能实验室出品的高性能 LLM 推理引擎——TurboMind 加速、中文场景优化、AWQ 量化，是中文业务与国产硬件部署的重要选择。"
created: "2026-05-31"
updated: "2026-06-15"
---

# LMDeploy: InternLM 高性能推理引擎

> **一句话理解**: LMDeploy 是上海人工智能实验室出品的高性能 LLM 推理引擎——TurboMind 加速、中文场景优化、AWQ 量化，是中文业务与国产硬件部署的重要选择。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [生产部署](#5-生产部署)
6. [高级特性](#6-高级特性)
7. [国产硬件支持](#7-国产硬件支持)
8. [对比与选择](#8-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LMDeploy: 国产高性能 LLM 推理引擎
═══════════════════════════════════════════════════════════════════

定位: 上海人工智能实验室出品的 LLM 推理引擎，深度优化中文场景

核心理念:
───────────────────────────────────────────────────────────────────
• 高性能: TurboMind 加速引擎 + PyTorch 后端双选择
• 国产优化: 中文场景深度优化，Qwen/InternLM 原厂支持
• 量化领先: AWQ/INT8/INT4/FP8 高效量化
• 多硬件: NVIDIA + 国产芯片（昇腾、寒武纪）
• 易部署: 一键服务化，支持 api_server / gradio / triton
• 多模态: 支持 InternVL、Qwen-VL 等视觉模型
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **TurboMind** | 自研 C++/CUDA 推理引擎，深度优化 |
| **PyTorch 后端** | 灵活的 PyTorch 推理后端 |
| **AWQ 量化** | 高效 INT4/INT8 量化 |
| **Continuous Batching** | 动态批处理 |
| **Tensor Parallel** | 多卡并行 |
| **Prefix Caching** | 前缀缓存 |
| **多模型** | Llama/Qwen/InternLM/GLM |
| **多模态** | InternVL、Qwen-VL、MiniCPM-V |
| **国产芯片** | 昇腾、寒武纪支持 |
| **OpenAI 兼容** | 兼容 Chat Completions API |

### 1.3 性能数据 (2026)

| 配置 | 模型 | 吞吐量 | 说明 |
|------|------|--------|------|
| A100-80GB x4 | Qwen2.5-72B | 5,800 tok/s | TP=4, TurboMind |
| A100-80GB x4 | Llama 3.1 70B | 6,200 tok/s | TP=4 |
| A100-80GB | Llama 3.1 8B | 13,500 tok/s | 单卡 |
| 4090 | Qwen2.5-7B | 9,000 tok/s | AWQ |
| 4090 | Llama 3.1 8B | 9,800 tok/s | AWQ |
| 昇腾 910B x4 | Qwen2.5-72B | 4,200 tok/s | TP=4 |

---

## 2. 核心概念

### 2.1 TurboMind 架构

```
TurboMind 架构
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        TurboMind 核心组件                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Inference Engine                                              │
│  ───────────────────────────────────────────────────────────   │
│  • PyTorch 前端兼容                                              │
│  • 自研 CUDA kernel                                             │
│  • 算子融合优化                                                  │
│  • Continuous Batching                                          │
│                                                                   │
│  2. Memory Manager                                                │
│  ───────────────────────────────────────────────────────────   │
│  • Paging KV Cache                                               │
│  • 动态显存分配                                                  │
│  • 碎片管理                                                      │
│                                                                   │
│  3. Scheduler                                                    │
│  ───────────────────────────────────────────────────────────   │
│  • Continuous Batching                                          │
│  • Prefill/Decode 分离                                           │
│  • Dynamic Splitting                                             │
│                                                                   │
│  4. Quantization                                                 │
│  ───────────────────────────────────────────────────────────   │
│  • AWQ / W4A16 / W8A16                                          │
│  • FP8 / INT8 / INT4                                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 TurboMind vs PyTorch 后端

| 维度 | TurboMind | PyTorch 后端 |
|------|-----------|--------------|
| **性能** | 更高 | 稍低 |
| **灵活性** | 中 | 高 |
| **新模型支持** | 需要适配 | 更快 |
| **量化支持** | AWQ/INT8/INT4/FP8 | 部分 |
| **调试** | 较难 | 容易 |
| **适用场景** | 生产部署 | 快速验证 / 研究 |

### 2.3 量化方案

| 方案 | 精度 | 压缩比 | 适用场景 |
|------|------|--------|----------|
| **FP16** | 原版 | 1x | 高精度 |
| **INT8** | 8bit | 2x | 平衡 |
| **INT4** | 4bit | 4x | 极致压缩 |
| **AWQ** | 4bit | 4x | 高精度 INT4 |
| **FP8** | 8bit | 2x | H100 高性能 |

---

## 3. 架构设计

### 3.1 系统架构

```
LMDeploy 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        LMDeploy 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              API Server                                    │   │
│   │  • OpenAI Compatible                                     │   │
│   │  • REST/gRPC                                             │   │
│   │  • WebSocket                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              TurboMind Engine                             │   │
│   │  ├── Inference Engine                                    │   │
│   │  ├── Memory Manager                                     │   │
│   │  ├── Scheduler                                          │   │
│   │  └── Quantization                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              PyTorch Backend (可选)                       │   │
│   │  ├── 灵活推理                                            │   │
│   │  ├── 快速适配新模型                                      │   │
│   │  └── 调试友好                                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CUDA Kernels / 国产芯片算子                  │   │
│   │  ├── Attention (FlashAttention)                         │   │
│   │  ├── W8A16 / W4A16                                     │   │
│   │  └── Custom LayerNorm                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 推理流程

```
LMDeploy 推理流程
═══════════════════════════════════════════════════════════════════

Step 1: 请求到达
┌──────────────────────────────────────────────────────────────────┐
│ Request → Scheduler → Batch                                       │
└──────────────────────────────────────────────────────────────────┘

Step 2: Prefill
┌──────────────────────────────────────────────────────────────────┐
│ 并行计算所有 prompt 的 KV                                          │
│ 分离 prefill 和 decode 阶段                                       │
└──────────────────────────────────────────────────────────────────┘

Step 3: Decode
┌──────────────────────────────────────────────────────────────────┐
│ 逐 token 生成                                                     │
│ Continuous Batching 动态批处理                                    │
└──────────────────────────────────────────────────────────────────┘

Step 4: Response
┌──────────────────────────────────────────────────────────────────┐
│ Streaming / Non-streaming 输出                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 基础安装
pip install lmdeploy

# 包含所有依赖
pip install "lmdeploy[all]"

# Docker
docker pull openmmlab/lmdeploy:latest
```

### 4.2 模型转换

```bash
# 将 HuggingFace 模型转换为 TurboMind 格式
lmdeploy convert \
  meta-llama/Meta-Llama-3.1-8B-Instruct \
  --model-format hf \
  --quant-policy 0 \
  --dst-path ./workspace

# AWQ 量化转换
lmdeploy lite auto_awq \
  meta-llama/Meta-Llama-3.1-8B-Instruct \
  --work-dir ./workspace_awq

# 转换 AWQ 模型
lmdeploy convert \
  ./workspace_awq \
  --model-format awq \
  --dst-path ./workspace_awq_turbomind
```

### 4.3 启动服务

```bash
# 启动 API 服务器
lmdeploy serve api_server \
  ./workspace \
  --server-name 0.0.0.0 \
  --server-port 23333 \
  --tp 1

# 多卡部署
lmdeploy serve api_server \
  ./workspace \
  --server-name 0.0.0.0 \
  --server-port 23333 \
  --tp 4

# PyTorch 后端
lmdeploy serve api_server \
  meta-llama/Meta-Llama-3.1-8B-Instruct \
  --backend pytorch \
  --server-port 23333
```

### 4.4 API 调用

```python
from openai import OpenAI

client = OpenAI(
    api_key="not-needed",
    base_url="http://localhost:23333/v1"
)

# 聊天完成
response = client.chat.completions.create(
    model="llama3.1-8b",
    messages=[
        {"role": "user", "content": "解释量子纠缠"}
    ]
)

print(response.choices[0].message.content)

# 流式输出
stream = client.chat.completions.create(
    model="llama3.1-8b",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    print(chunk.choices[0].delta.content, end="")
```

### 4.5 命令行推理

```bash
# 交互模式
lmdeploy chat ./workspace

# 非交互
lmdeploy generate \
  ./workspace \
  "请介绍一下量子计算"
```

---

## 5. 生产部署

### 5.1 Docker 部署

```bash
# 拉取镜像
docker pull openmmlab/lmdeploy:latest

# 启动容器
docker run --gpus all \
  -p 23333:23333 \
  -v $(pwd)/workspace:/workspace \
  -it openmmlab/lmdeploy:latest \
  lmdeploy serve api_server /workspace \
  --server-name 0.0.0.0 \
  --server-port 23333 \
  --tp 1
```

### 5.2 Kubernetes 部署

```yaml
# lmdeploy-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lmdeploy-qwen2-72b
spec:
  replicas: 1
  selector:
    matchLabels:
      app: lmdeploy-qwen2-72b
  template:
    metadata:
      labels:
        app: lmdeploy-qwen2-72b
    spec:
      containers:
      - name: lmdeploy
        image: openmmlab/lmdeploy:latest
        args:
          - lmdeploy
          - serve
          - api_server
          - /models/qwen2-72b
          - --server-name
          - 0.0.0.0
          - --server-port
          - "23333"
          - --tp
          - "4"
        resources:
          limits:
            nvidia.com/gpu: "4"
        ports:
        - containerPort: 23333
        volumeMounts:
        - name: models
          mountPath: /models
      volumes:
      - name: models
        persistentVolumeClaim:
          claimName: lmdeploy-models
---
apiVersion: v1
kind: Service
metadata:
  name: lmdeploy-qwen2-72b
spec:
  selector:
    app: lmdeploy-qwen2-72b
  ports:
  - port: 23333
    targetPort: 23333
```

### 5.3 Triton 集成

```bash
# 使用 LMDeploy Triton backend
lmdeploy serve triton \
  ./workspace \
  --server-name 0.0.0.0 \
  --server-port 8000 \
  --tp 4
```

---

## 6. 高级特性

### 6.1 AWQ 量化

```bash
# AWQ 量化
lmdeploy lite auto_awq \
  meta-llama/Meta-Llama-3.1-8B-Instruct \
  --work-dir ./workspace_awq

# 转换并服务
lmdeploy convert \
  ./workspace_awq \
  --model-format awq \
  --dst-path ./workspace_awq_turbomind

lmdeploy serve api_server \
  ./workspace_awq_turbomind \
  --server-port 23333
```

### 6.2 FP8 量化

```bash
# FP8 量化 (H100)
lmdeploy lite smooth_quant \
  meta-llama/Meta-Llama-3.1-8B-Instruct \
  --work-dir ./workspace_fp8 \
  --quant-config fp8

lmdeploy serve api_server \
  ./workspace_fp8 \
  --server-port 23333
```

### 6.3 多卡部署

```bash
# Tensor Parallel = 4
lmdeploy serve api_server \
  ./workspace \
  --tp 4

# Pipeline Parallel = 2 (多机)
lmdeploy serve api_server \
  ./workspace \
  --tp 4 \
  --dp 1 \
  --nnodes 2
```

### 6.4 流式输出

```bash
# 启用流式
lmdeploy serve api_server \
  ./workspace \
  --stream-mode
```

### 6.5 多模态推理

```python
from lmdeploy import pipeline, TurbomindEngineConfig
from lmdeploy.vl import load_image

# 加载 InternVL 模型
pipe = pipeline(
    'OpenGVLab/InternVL2-8B',
    backend_config=TurbomindEngineConfig(session_len=8192)
)

image = load_image('https://example.com/image.jpg')
response = pipe(('描述这张图片', image))
print(response.text)
```

### 6.6 Prefix Caching

```bash
# 启用前缀缓存
lmdeploy serve api_server \
  ./workspace \
  --enable-prefix-caching \
  --server-port 23333
```

---

## 7. 国产硬件支持

### 7.1 昇腾 (Ascend) 910B

```bash
# 昇腾环境安装
pip install lmdeploy-ascend

# 启动服务
lmdeploy serve api_server \
  ./workspace \
  --backend ascend \
  --tp 4 \
  --server-port 23333
```

### 7.2 寒武纪 (Cambricon)

```bash
# 寒武纪环境安装
pip install lmdeploy-cambricon

# 启动服务
lmdeploy serve api_server \
  ./workspace \
  --backend cambricon \
  --tp 4 \
  --server-port 23333
```

### 7.3 国产硬件对比

| 硬件 | 支持状态 | 典型模型 | 性能参考 |
|------|----------|----------|----------|
| **昇腾 910B** | ✅ 完善 | Qwen2.5-72B | TP=4 4,200 tok/s |
| **寒武纪 370/590** | ✅ 基本 | Qwen2.5-7B | 单卡 1,500 tok/s |
| **海光 DCU** | ⚠️ 实验 | Llama 3.1 8B | 单卡 2,000 tok/s |

---

## 8. 对比与选择

### 8.1 与其他推理引擎对比

| 维度 | LMDeploy | vLLM | SGLang | TensorRT-LLM |
|------|----------|------|--------|--------------|
| **吞吐量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **中文优化** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **AWQ 量化** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **多模态** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **国产芯片** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **生态** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Triton 集成** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 8.2 选型建议

| 场景 | 推荐 |
|------|------|
| 中文生产 | LMDeploy |
| 通用生产 | vLLM |
| 多轮对话 | SGLang |
| 快速原型 | vLLM |
| 国产芯片 | LMDeploy |
| 多模态 | LMDeploy / vLLM |
| 最低延迟 | TensorRT-LLM |
| Hugging Face 生态 | TGI |

### 8.3 适用场景

| 场景 | LMDeploy 优势 |
|------|--------------|
| **国内业务** | 中文深度优化 |
| **Qwen 系列** | 原厂优化 |
| **低成本** | AWQ 高效量化 |
| **国产硬件** | 昇腾、寒武纪支持 |
| **多模态** | InternVL、Qwen-VL 原生支持 |
| **Triton 生态** | 官方 backend 支持 |

### 8.4 版本演进

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.1 | 2023.6 | 首个版本，TurboMind |
| v0.2 | 2023.10 | api_server、OpenAI API |
| v0.3 | 2024.3 | AWQ 量化、多卡 |
| v0.4 | 2024.8 | PyTorch 后端、多模态 |
| v0.5 | 2025.2 | 昇腾支持、Prefix Caching |
| v0.6 | 2025.8 | FP8、长上下文 |
| v0.7 | 2026.x | 寒武纪支持、更强多模态 |

---

## 参考资源

- [LMDeploy GitHub](https://github.com/InternLM/lmdeploy)
- [LMDeploy 文档](https://lmdeploy.readthedocs.io/)
- [InternLM](https://github.com/InternLM/InternLM)
- [Qwen](https://github.com/QwenLM/Qwen)

---

*Last updated: 2026-06-15*
*Version: 2.0.0*

## Related

- [[10_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[10_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[10_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[10_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive.md|vLLM_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/SGLang_Deep_Dive.md|SGLang_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/TensorRT_LLM_Deep_Dive.md|TensorRT_LLM_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/TGI_Deep_Dive.md|TGI_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/LLM_Inference_Engine_Selection_Guide.md|LLM_Inference_Engine_Selection_Guide]]
