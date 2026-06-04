---
title: "LMDeploy: InternLM 高性能推理引擎"
category: "09-deployment-inference"
tags: ["deployment", "inference", "serving", "vllm"]
summary: "> **一句话理解**: LMDeploy 是上海人工智能实验室出品的高性能 LLM 推理引擎——TurboMind 加速、中文场景优化、AWQ 量化，国产推理性能标杆。"
created: "2026-05-31"
updated: "2026-05-31"
---

# LMDeploy: InternLM 高性能推理引擎

> **一句话理解**: LMDeploy 是上海人工智能实验室出品的高性能 LLM 推理引擎——TurboMind 加速、中文场景优化、AWQ 量化，国产推理性能标杆。

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
LMDeploy: 国产高性能 LLM 推理引擎
═══════════════════════════════════════════════════════════════════

定位: 上海人工智能实验室出品的 LLM 推理引擎，深度优化中文场景

核心理念:
───────────────────────────────────────────────────────────────────
• 高性能: TurboMind 加速引擎
• 国产优化: 中文场景深度优化
• 量化领先: AWQ/INT8/INT4 高效量化
• 多硬件: NVIDIA + 国产芯片
• 易部署: 一键服务化
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **TurboMind** | 自研推理引擎，深度优化 |
| **AWQ 量化** | 高效 INT4/INT8 量化 |
| **Continuous Batching** | 动态批处理 |
| **Tensor Parallel** | 多卡并行 |
| **Prefix Caching** | 前缀缓存 |
| **多模型** | Llama/Qwen/InternLM |

### 1.3 性能数据

| 配置 | 模型 | 吞吐量 | 说明 |
|------|------|--------|------|
| A100-80GB | Qwen2-72B | 16,132 tok/s | TP=4 |
| A100-80GB | Llama 3.1 8B | 18,000 tok/s | - |
| 4090 | Qwen2-7B | 8,500 tok/s | - |
| 4090 | Llama 3.1 8B | 9,200 tok/s | - |

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
│  •Dynamic Splitting                                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 量化方案

| 方案 | 精度 | 压缩比 | 适用场景 |
|------|------|--------|----------|
| **FP16** | 原版 | 1x | 高精度 |
| **INT8** | 8bit | 2x | 平衡 |
| **INT4** | 4bit | 4x | 极致压缩 |
| **AWQ** | 4bit | 4x | 高精度 INT4 |

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
│   │  └── Scheduler                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CUDA Kernels                                │   │
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
pip install lmdeploy
```

### 4.2 模型转换

```bash
# 将 HuggingFace 模型转换为 TurboMind 格式
lmdeploy convert \
  meta-llama/Meta-Llama-3.1-8B-Instruct \
  --model-format hf \
  --quant-policy 0 \
  --dst-path ./workspace
```

### 4.3 启动服务

```bash
# 启动 API 服务器
lmdeploy serve api_server \
  ./workspace \
  --server-name 0.0.0.0 \
  --server-port 23333 \
  --tp 1
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

## 5. 高级特性

### 5.1 AWQ 量化

```bash
# AWQ 量化
lmdeploy convert \
  meta-llama/Meta-Llama-3.1-8B-Instruct \
  --model-format hf \
  --quant-policy 4 \
  --wq-mode w4a16 \
  --dst-path ./workspace_awq
```

```python
# 使用量化模型
client = OpenAI(
    api_key="not-needed",
    base_url="http://localhost:23333/v1"
)

# 自动使用 W4A16 量化
response = client.chat.completions.create(
    model="llama3.1-8b-awq",
    messages=[...]
)
```

### 5.2 多卡部署

```bash
# Tensor Parallel = 4
lmdeploy serve api_server \
  ./workspace \
  --tp 4
```

### 5.3 流式输出

```bash
# 启用流式
lmdeploy serve api_server \
  ./workspace \
  --stream-mode
```

```python
# 流式调用
stream = client.chat.completions.create(
    model="llama3.1-8b",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    print(chunk.choices[0].delta.content, end="")
```

---

## 6. 对比与选择

### 6.1 与其他推理引擎对比

| 维度 | LMDeploy | vLLM | SGLang |
|------|----------|------|--------|
| **吞吐量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **中文优化** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **AWQ 量化** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **生态** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 中文生产 | LMDeploy |
| 通用生产 | vLLM |
| 多轮对话 | SGLang |
| 快速原型 | vLLM |
| 国产芯片 | LMDeploy |

### 6.3 适用场景

| 场景 | LMDeploy 优势 |
|------|--------------|
| **国内业务** | 中文深度优化 |
| **Qwen 系列** | 原厂优化 |
| **低成本** | AWQ 高效量化 |
| **国产硬件** | 昇腾等支持 |

---

## 参考资源

- [LMDeploy GitHub](https://github.com/InternLM/lmdeploy)
- [LMDeploy 文档](https://lmdeploy.readthedocs.io/)
- [TurboMind](https://github.com/InternLM/TurboMind)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[09_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[09_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[09_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[09_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[09_Deployment_Inference/JVM_AI_Deployment.md|JVM_AI_Deployment]]
