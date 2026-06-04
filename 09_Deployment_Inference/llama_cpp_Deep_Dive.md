---
title: "llama.cpp: 纯 C/C++ 本地 LLM 推理"
category: "09-deployment-inference"
tags: ["deployment", "inference", "serving", "vllm", "llama", "llm"]
summary: "> **一句话理解**: llama.cpp 是纯 C/C++ 的轻量级 LLM 推理框架——无依赖、CPU 运行、GGUF 量化，在 MacBook 乃至树莓派上跑 LLM。"
created: "2026-05-31"
updated: "2026-05-31"
---

# llama.cpp: 纯 C/C++ 本地 LLM 推理

> **一句话理解**: llama.cpp 是纯 C/C++ 的轻量级 LLM 推理框架——无依赖、CPU 运行、GGUF 量化，在 MacBook 乃至树莓派上跑 LLM。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
llama.cpp: 纯 C/C++ 本地 LLM 推理
═══════════════════════════════════════════════════════════════════

定位: 纯 C/C++ 编写的轻量级 LLM 推理引擎，无外部依赖

核心理念:
───────────────────────────────────────────────────────────────────
• 纯 C/C++: 无 Python 依赖
• 跨平台: Mac/Linux/Windows/RPI
• 多种量化: Q4/Q5/Q6/Q8
• CPU 优先: 无需 GPU 也能跑
• GGUF 格式: 统一的模型格式
• 高效: 极致优化
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **多种量化** | Q4_0/Q4_1/Q5_0/Q5_1/Q8_0 |
| **无依赖** | 纯 C/C++，无需 CUDA |
| **混合推理** | CPU + GPU 混合 |
| **零配置** | 命令行即可运行 |
| **API 服务** | 内置 HTTP 服务器 |
| **多模型** | Llama/Vicuna/Mistral |

### 1.3 性能数据

| 硬件 | 模型 | 量化 | 速度 |
|------|------|------|------|
| Mac M2 Pro | Llama 3.1 8B | Q4_K | 30 tok/s |
| Mac M2 Max | Llama 3.1 8B | Q4_K | 55 tok/s |
| Mac M2 Max | Llama 3.1 70B | Q4_K | 12 tok/s |
| 16GB RAM | Llama 3.1 8B | Q4_K | 15 tok/s |
| 32GB RAM | Llama 3.1 70B | Q4_K | 4 tok/s |

---

## 2. 核心概念

### 2.1 GGUF 格式

```
GGUF 格式
═══════════════════════════════════════════════════════════════════

GGUF (Generic Gradient-Quantized Format):
───────────────────────────────────────────────────────────────────

• 统一模型格式: 所有 LLM 模型统一为 .gguf
• 自包含: 包含所有权重和元数据
• 元数据: 模型配置、词汇表、量化参数
• 分片支持: 大模型可分割为多个文件
• 后缀约定:
  - Q4_0: 4bit 量化，标准
  - Q4_1: 4bit 量化，更高质量
  - Q5_0/Q5_1: 5bit 量化
  - Q8_0: 8bit 量化，接近原版
  - K_S/K_M/K_L: 不同量化算法

文件大小参考 (Llama 3.1 8B):
• FP16: ~16GB
• Q8_0: ~8GB
• Q4_K_M: ~4.5GB
• Q4_0: ~4GB
```

### 2.2 量化类型

| 类型 | 大小 | 质量 | 适用场景 |
|------|------|------|----------|
| **Q4_0** | 最小 | 中等 | 极致内存受限 |
| **Q4_1** | 较小 | 中等偏上 | 内存受限 |
| **Q5_0** | 中等 | 较好 | 平衡选择 |
| **Q5_1** | 中等偏大 | 较好 | 需要更好质量 |
| **Q8_0** | 较大 | 接近原版 | 质量和大小平衡 |
| **F16** | 最大 | 原版 | 有足够内存 |

---

## 3. 架构设计

### 3.1 系统架构

```
llama.cpp 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        llama.cpp 架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CLI / API Layer                             │   │
│   │  • main.cpp: 命令行工具                                   │   │
│   │  • server.cpp: HTTP API 服务                            │   │
│   │  • llava.cpp: 多模态支持                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              ggml (张量运算)                             │   │
│   │  • ggml.c / ggml.h                                      │   │
│   │  • 量化计算                                              │   │
│   │  • 内存管理                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Backend (不同硬件)                          │   │
│   │  ├── CPU: 纯 C/C++ 实现                                  │   │
│   │  ├── Metal: Apple GPU                                   │   │
│   │  ├── CUDA: NVIDIA GPU                                   │   │
│   │  └── Vulkan: 跨平台 GPU                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 推理流程

```
llama.cpp 推理流程
═══════════════════════════════════════════════════════════════════

输入: "你好，请介绍一下自己"

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 模型加载                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ 1. 读取 GGUF 文件                                                  │
│ 2. 解析元数据 (config, vocab)                                     │
│ 3. 分配 tensor 内存                                                │
│ 4. 加载权重到内存                                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: Tokenization                                              │
│ ───────────────────────────────────────────────────────────────  │
│ 输入: "你好，请介绍一下自己"                                       │
│ 输出: [1234, 5678, 9012, ...]  (token ids)                       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 推理循环                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ for i in range(max_tokens):                                       │
│     1. 计算 logits (forward pass)                                │
│     2. 采样下一个 token                                          │
│     3. decode token                                              │
│     4. 如果是 EOS，停止                                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 4: 输出                                                       │
│ ───────────────────────────────────────────────────────────────  │
│ 输出: "你好！我是..."                                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装 (macOS)

```bash
# 使用 brew 安装
brew install llama.cpp

# 或源码编译
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
mkdir build && cd build
cmake ..
make
```

### 4.2 下载模型

```bash
# 使用 HuggingFace 下载 Llama 3.1 8B Q4_K_M
huggingface-cli download \
  NousResearch/Meta-Llama-3.1-8B-Instruct-GGUF \
  Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  --local-dir ./models
```

### 4.3 命令行使用

```bash
# 基础交互
./main -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
       -p "你好，请介绍一下自己" \
       -n 256 \
       --temp 0.7

# 交互模式
./main -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
       -i \
       -r "User:"

# 多轮对话
./main -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
       -f ./prompts/chat-with-gpt4.txt
```

### 4.4 启动 API 服务

```bash
# 启动 HTTP 服务器
./server -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
         --port 8080 \
         --host 0.0.0.0

# 调用 API
curl http://localhost:8080/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "你好",
    "max_tokens": 256,
    "stream": false
  }'
```

### 4.5 Python bindings

```bash
pip install llama-cpp-python
```

```python
from llama_cpp import Llama

# 创建 LLM
llm = Llama(
    model_path="./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf",
    n_ctx=4096,
    n_threads=8,
    n_gpu_layers=0  # 0 for CPU only
)

# 生成
output = llm(
    "请介绍一下人工智能的发展历史",
    max_tokens=256,
    temperature=0.7,
    stop=["User:", "###"]
)

print(output['choices'][0]['text'])
```

---

## 5. 高级用法

### 5.1 Metal 加速 (Mac)

```bash
# 使用 Metal 后端编译
cmake .. -DLLAMA_METAL=ON
make

# 运行 (自动使用 Metal)
./main -m ./models/model.gguf -ngl 99
```

```bash
# 验证 Metal 使用
./main -m ./models/model.gguf -ngl 99 --verbose
# 应该看到: "Metal device: Apple M2 Pro"
```

### 5.2 CUDA 加速

```bash
# 使用 CUDA 编译
cmake .. -DLLAMA_CUBLAS=ON
make

# 运行
./main -m ./models/model.gguf -ngl 99 -ctk cuda
```

### 5.3 批量和并行

```bash
# 批量推理
./main -m ./models/model.gguf \
       -b 512 \        # 批量大小
       -tb 64 \        # 线程批次
       --parallel 4    # 并行请求说
```

### 5.4 多模态 (LLaVA)

```bash
# 编译 LLaVA 支持
cmake .. -DLLAMA_LLAMA=ON -DLLAMA_CLBLA=ON -DLLAMA_LLAVA=ON
make

# 运行 LLaVA
./llava/main \
  -m ./models/llava-7b.gguf \
  --mmproj ./models/llava-7b-mmproj.gguf \
  --image ./images/photo.jpg \
  -p "描述这张图片"
```

---

## 6. 对比与选择

### 6.1 与其他推理方案对比

| 维度 | llama.cpp | Ollama | vLLM |
|------|-----------|--------|------|
| **硬件要求** | CPU 即可 | GPU 推荐 | 需要 GPU |
| **部署难度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **性能** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **量化支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 本地开发/Mac | llama.cpp / Ollama |
| 无 GPU 环境 | llama.cpp |
| 快速原型 | Ollama |
| 生产部署 | vLLM / SGLang |
| 低配设备 | llama.cpp |

### 6.3 硬件推荐

| 硬件 | 推荐模型 | 推荐量化 |
|------|----------|----------|
| Mac M1/M2/M3 | Llama 3.1 8B | Q4_K_M |
| Mac M2/M3 Pro | Llama 3.1 8B | Q4_K_M |
| Mac M3 Max | Llama 3.1 70B | Q4_K_M |
| 16GB RAM Linux | Llama 3.1 8B | Q4_K_M |
| 32GB RAM Linux | Llama 3.1 70B | Q4_K_M |

---

## 参考资源

- [llama.cpp GitHub](https://github.com/ggerganov/llama.cpp)
- [llama.cpp 文档](https://github.com/ggerganov/llama.cpp/tree/master/examples)
- [GGUF 模型下载](https://huggingface.co/models?other=gguf)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[09_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[09_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[09_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[09_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[09_Deployment_Inference/JVM_AI_Deployment.md|JVM_AI_Deployment]]
