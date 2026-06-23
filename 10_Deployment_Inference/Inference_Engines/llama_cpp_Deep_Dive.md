---
title: "llama.cpp: 纯 C/C++ 本地 LLM 推理"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "llama.cpp", "gguf", "quantization", "edge", "cpu"]
summary: "> **一句话理解**: llama.cpp 是纯 C/C++ 的轻量级 LLM 推理框架——无 Python 依赖、CPU 即可运行、GGUF 量化，覆盖从 MacBook 到树莓派再到服务器的全场景本地推理。"
created: "2026-05-31"
updated: "2026-06-15"
---

# llama.cpp: 纯 C/C++ 本地 LLM 推理

> **一句话理解**: llama.cpp 是纯 C/C++ 的轻量级 LLM 推理框架——无 Python 依赖、CPU 即可运行、GGUF 量化，覆盖从 MacBook 到树莓派再到服务器的全场景本地推理。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [生产部署](#5-生产部署)
6. [高级特性](#6-高级特性)
7. [性能优化](#7-性能优化)
8. [对比与选择](#8-对比与选择)

---

## 1. 概述

### 1.1 定位

```
llama.cpp: 纯 C/C++ 本地 LLM 推理
═══════════════════════════════════════════════════════════════════

定位: 纯 C/C++ 编写的轻量级、跨平台 LLM 推理引擎

核心理念:
───────────────────────────────────────────────────────────────────
• 纯 C/C++: 无 Python 依赖，单二进制文件即可运行
• 跨平台: macOS / Linux / Windows / iOS / Android / 嵌入式
• 多后端: CPU / CUDA / Metal / Vulkan / SYCL / Kompute / CANN
• 多种量化: Q4_0/Q4_K_M/Q5_K_M/Q8_0/FP16 等
• GGUF 格式: 统一的模型格式标准
• 零配置: 命令行即可运行，内置 HTTP API 服务
• 开源活跃: Georgi Gerganov 维护，社区贡献丰富
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **纯 C/C++** | 无 Python 依赖，可静态链接 |
| **多量化** | Q4_0/Q4_K_M/Q5_K_M/Q6_K/Q8_0/FP16 |
| **多后端** | CPU / CUDA / Metal / Vulkan / SYCL / Kompute |
| **混合推理** | CPU + GPU 分层卸载 |
| **内置 API 服务** | OpenAI 兼容的 HTTP server |
| **多模态** | LLaVA / BakLLaVA / Obsidian 等 |
| **Speculative Decoding** | 推测解码加速 |
| **LoRA** | 运行时加载 LoRA adapter |
| **llamafile** | 单文件可执行模型分发 |
| **跨平台** | 从服务器到手机到树莓派 |

### 1.3 性能数据 (2026)

| 硬件 | 模型 | 量化 | 速度 |
|------|------|------|------|
| Mac M4 Max | Llama 3.1 8B | Q4_K_M | 80+ tok/s |
| Mac M3 Max | Llama 3.1 70B | Q4_K_M | 18+ tok/s |
| RTX 4090 | Llama 3.1 8B | Q4_K_M | 120+ tok/s |
| RTX 4090 | Llama 3.1 70B | Q4_K_M | 35+ tok/s |
| 16GB RAM x86 | Llama 3.1 8B | Q4_K_M | 20+ tok/s |
| Raspberry Pi 5 | Llama 3.2 1B | Q4_0 | 5+ tok/s |

---

## 2. 核心概念

### 2.1 GGUF 格式

```
GGUF 格式
═══════════════════════════════════════════════════════════════════

GGUF (GPT-Generated Unified Format):
───────────────────────────────────────────────────────────────────

• 统一模型格式: 所有 LLM 模型统一为 .gguf
• 自包含: 包含所有权重、tokenizer、元数据
• 元数据: 模型配置、词汇表、量化参数、chat template
• 分片支持: 大模型可分割为多个 .gguf 文件
• 高效读取: mmap 友好，支持快速加载

量化后缀:
• Q4_0: 4bit 量化，最小体积
• Q4_K_M: 4bit K-quant，平衡质量与大小 (推荐)
• Q5_K_M: 5bit K-quant，更高质量
• Q6_K: 6bit K-quant，接近 FP16 质量
• Q8_0: 8bit 量化，几乎无损
• FP16: 半精度，原版大小

文件大小参考 (Llama 3.1 8B):
• FP16: ~16GB
• Q8_0: ~8GB
• Q6_K: ~6GB
• Q4_K_M: ~4.5GB
• Q4_0: ~4GB
```

### 2.2 量化类型选择

| 类型 | 大小 | 质量 | 速度 | 适用场景 |
|------|------|------|------|----------|
| **Q4_0** | 最小 | 中等 | 快 | 极致内存受限 |
| **Q4_K_M** | 较小 | 较好 | 快 | 推荐默认选择 |
| **Q5_K_M** | 中等 | 好 | 快 | 需要更好质量 |
| **Q6_K** | 中等偏大 | 很好 | 较快 | 质量优先 |
| **Q8_0** | 较大 | 几乎无损 | 较快 | 高精度要求 |
| **F16** | 最大 | 原版 | 慢 | 有足够显存 |

### 2.3 后端架构

```
llama.cpp 后端支持
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        后端选择                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CPU Backend                                                     │
│  • AVX/AVX2/AVX512/ARM NEON 优化                                │
│  • 无需 GPU，任何设备都能跑                                      │
│  • 支持多线程 (n_threads)                                        │
│                                                                  │
│  GPU Backends                                                    │
│  ├── Metal: Apple Silicon GPU (M1/M2/M3/M4)                     │
│  ├── CUDA: NVIDIA GPU                                            │
│  ├── Vulkan: 跨平台 GPU (NVIDIA/AMD/Intel)                      │
│  ├── SYCL: Intel GPU / oneAPI                                   │
│  ├── Kompute: Vulkan 计算抽象                                   │
│  └── CANN: 华为昇腾                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

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
│   │  • server.cpp: HTTP API 服务 (OpenAI 兼容)              │   │
│   │  • llava.cpp: 多模态支持                                  │   │
│   │  • llama-bench: 性能基准                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              libllama (核心库)                           │   │
│   │  • 模型加载与初始化                                       │   │
│   │  • KV Cache 管理                                         │   │
│   │  • 采样 (sampling)                                       │   │
│   │  • 量化/反量化                                           │   │
│   │  • LoRA 支持                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              ggml (张量运算)                             │   │
│   │  • 矩阵乘法 / Attention                                  │   │
│   │  • 量化解压                                              │   │
│   │  • 图计算                                                │   │
│   │  • 内存管理                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Backend (不同硬件)                          │   │
│   │  ├── CPU: 纯 C/C++ 实现                                  │   │
│   │  ├── Metal: Apple GPU                                   │   │
│   │  ├── CUDA: NVIDIA GPU                                   │   │
│   │  ├── Vulkan: 跨平台 GPU                                  │   │
│   │  ├── SYCL: Intel GPU                                    │   │
│   │  └── CANN: 华为昇腾                                     │   │
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
│ 2. 解析元数据 (config, vocab, chat template)                      │
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

### 4.1 安装

```bash
# macOS (brew)
brew install llama.cpp

# 或源码编译
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
mkdir build && cd build

# CPU 版本
cmake ..
make -j$(nproc)

# Metal 版本 (Mac)
cmake .. -DLLAMA_METAL=ON
make -j$(nproc)

# CUDA 版本 (NVIDIA)
cmake .. -DLLAMA_CUDA=ON
make -j$(nproc)

# Vulkan 版本
cmake .. -DLLAMA_VULKAN=ON
make -j$(nproc)
```

### 4.2 下载模型

```bash
# 使用 HuggingFace 下载 Llama 3.1 8B Q4_K_M
huggingface-cli download \
  bartowski/Meta-Llama-3.1-8B-Instruct-GGUF \
  Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  --local-dir ./models

# 或使用 llama.cpp 内置下载 (需要 HF token)
./llama-cli -hf bartowski/Meta-Llama-3.1-8B-Instruct-GGUF:Q4_K_M
```

### 4.3 命令行使用

```bash
# 基础交互
./llama-cli \
  -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  -p "你好，请介绍一下自己" \
  -n 256 \
  --temp 0.7

# 交互模式
./llama-cli \
  -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  -i \
  -r "User:"

# 多轮对话 (使用 chat template)
./llama-cli \
  -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  -cnv \
  -p "你是一个有帮助的助手。"
```

### 4.4 启动 API 服务

```bash
# 启动 HTTP 服务器 (OpenAI 兼容)
./llama-server \
  -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  --port 8080 \
  --host 0.0.0.0 \
  -c 4096 \
  -ngl 999  # 卸载所有层到 GPU

# 调用 API
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-8b",
    "messages": [{"role": "user", "content": "你好"}],
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
    n_gpu_layers=-1  # -1 表示全部卸载到 GPU
)

# 生成
output = llm(
    "请介绍一下人工智能的发展历史",
    max_tokens=256,
    temperature=0.7,
    stop=["User:", "###"]
)

print(output['choices'][0]['text'])

# 聊天格式
response = llm.create_chat_completion(
    messages=[{"role": "user", "content": "你好"}],
    max_tokens=256
)
print(response['choices'][0]['message']['content'])
```

---

## 5. 生产部署

### 5.1 Docker 部署

```bash
# 使用官方镜像
docker pull ghcr.io/ggerganov/llama.cpp:server-cuda

# 启动服务
docker run -d --gpus all \
  -p 8080:8080 \
  -v $(pwd)/models:/models \
  ghcr.io/ggerganov/llama.cpp:server-cuda \
  -m /models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  --port 8080 \
  --host 0.0.0.0 \
  -ngl 999
```

### 5.2 llamafile (单文件分发)

```bash
# llamafile 将模型和运行时打包为单个可执行文件
# 下载示例
wget https://example.com/llama-3.1-8b.llamafile
chmod +x llama-3.1-8b.llamafile

# 运行
./llama-3.1-8b.llamafile --port 8080

# 优势：无需安装依赖，单个文件即可运行
```

### 5.3 llama-cpp-python 服务器

```bash
# 启动 Python 版 OpenAI 兼容服务器
python -m llama_cpp.server \
  --model ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  --n_ctx 4096 \
  --n_gpu_layers -1 \
  --port 8080
```

### 5.4 Kubernetes 部署

```yaml
# llama-cpp-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llama-cpp-llama3-8b
spec:
  replicas: 1
  selector:
    matchLabels:
      app: llama-cpp-llama3-8b
  template:
    metadata:
      labels:
        app: llama-cpp-llama3-8b
    spec:
      containers:
      - name: llama-cpp
        image: ghcr.io/ggerganov/llama.cpp:server-cuda
        args:
          - -m
          - /models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf
          - --port
          - "8080"
          - --host
          - 0.0.0.0
          - -ngl
          - "999"
        resources:
          limits:
            nvidia.com/gpu: "1"
        ports:
        - containerPort: 8080
        volumeMounts:
        - name: models
          mountPath: /models
      volumes:
      - name: models
        persistentVolumeClaim:
          claimName: llama-cpp-models
---
apiVersion: v1
kind: Service
metadata:
  name: llama-cpp-llama3-8b
spec:
  selector:
    app: llama-cpp-llama3-8b
  ports:
  - port: 8080
    targetPort: 8080
```

---

## 6. 高级特性

### 6.1 Metal 加速 (Mac)

```bash
# 使用 Metal 后端编译
cmake .. -DLLAMA_METAL=ON
make -j$(nproc)

# 运行 (自动使用 Metal)
./llama-server \
  -m ./models/model.gguf \
  -ngl 999

# 验证 Metal 使用
./llama-server -m ./models/model.gguf -ngl 999 --verbose
# 应该看到: "Metal device: Apple M4 Max"
```

### 6.2 CUDA 加速

```bash
# 使用 CUDA 编译
cmake .. -DLLAMA_CUDA=ON
make -j$(nproc)

# 运行
./llama-server \
  -m ./models/model.gguf \
  -ngl 999 \
  --flash-attn
```

### 6.3 批量和并行

```bash
# 批量推理
./llama-cli \
  -m ./models/model.gguf \
  -b 512 \        # 批量大小
  -tb 64 \        # 线程批次
  --parallel 4    # 并行请求数

# 服务器模式下的并发
./llama-server \
  -m ./models/model.gguf \
  --parallel 4 \
  -np 4
```

### 6.4 多模态 (LLaVA)

```bash
# 编译 LLaVA 支持
cmake .. -DLLAMA_LLAVA=ON
make -j$(nproc)

# 运行 LLaVA
./llava-cli \
  -m ./models/llava-7b-Q4_K_M.gguf \
  --mmproj ./models/llava-7b-mmproj-Q4_K_M.gguf \
  --image ./images/photo.jpg \
  -p "描述这张图片"
```

### 6.5 Speculative Decoding

```bash
# 使用小模型做 draft
./llama-server \
  -m ./models/llama-3.1-70B-Q4_K_M.gguf \
  -md ./models/llama-3.1-8B-Q4_K_M.gguf \
  -ngl 999 \
  --draft 16
```

### 6.6 LoRA

```bash
# 运行时加载 LoRA
./llama-server \
  -m ./models/llama-3.1-8B-Q4_K_M.gguf \
  --lora ./adapters/sft-lora.bin \
  --lora-base ./models/llama-3.1-8B-Q4_K_M.gguf
```

---

## 7. 性能优化

### 7.1 关键参数

| 参数 | 作用 | 建议 |
|------|------|------|
| `-ngl` | GPU 层数卸载 | 999 表示全部卸载 |
| `-c` / `--ctx-size` | 上下文大小 | 根据需求设置 |
| `-n` / `--predict` | 最大生成 token | 按业务设置 |
| `-t` / `--threads` | CPU 线程数 | 物理核心数 |
| `-b` / `--batch-size` | 批量大小 | 512-2048 |
| `--flash-attn` | Flash Attention | CUDA 后端开启 |
| `--mlock` | 锁定内存 | 避免 swap |
| `--no-mmap` | 禁用 mmap | 需要更快加载时 |

### 7.2 硬件推荐

| 硬件 | 推荐模型 | 推荐量化 | 预期速度 |
|------|----------|----------|----------|
| Mac M4 Max | Llama 3.1 8B | Q4_K_M | 80+ tok/s |
| Mac M3 Max | Llama 3.1 70B | Q4_K_M | 18+ tok/s |
| RTX 4090 | Llama 3.1 8B | Q4_K_M | 120+ tok/s |
| RTX 4090 | Llama 3.1 70B | Q4_K_M | 35+ tok/s |
| 16GB RAM | Llama 3.1 8B | Q4_K_M | 20+ tok/s |
| 8GB RAM | Llama 3.2 3B | Q4_K_M | 15+ tok/s |
| Raspberry Pi 5 | Llama 3.2 1B | Q4_0 | 5+ tok/s |

### 7.3 性能调优建议

```
llama.cpp 性能优化 checklist
═══════════════════════════════════════════════════════════════════

□ 尽量使用 GPU 后端 (Metal/CUDA/Vulkan)
□ 将 -ngl 设置为 999，让所有层卸载到 GPU
□ 在 CUDA 后端开启 --flash-attn
□ 使用 Q4_K_M 作为默认量化方案
□ CPU 场景设置 -t 为物理核心数
□ 长上下文场景适当增加 -c
□ 服务器模式设置 --parallel 处理并发
□ 使用 mmap 加速模型加载 (--mlock 可防止 swap)
□ 对于极低延迟，尝试 speculative decoding
```

---

## 8. 对比与选择

### 8.1 与其他推理方案对比

| 维度 | llama.cpp | Ollama | vLLM | SGLang |
|------|-----------|--------|------|--------|
| **硬件要求** | CPU 即可 | GPU 推荐 | 需要 GPU | 需要 GPU |
| **部署难度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **性能** | ⭐⭐⭐ (CPU) / ⭐⭐⭐⭐ (GPU) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **量化支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **跨平台** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **生态成熟度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **资源占用** | 低 | 中 | 高 | 高 |

### 8.2 选型建议

| 场景 | 推荐 |
|------|------|
| 本地开发 / Mac | llama.cpp / Ollama |
| 无 GPU 环境 | llama.cpp |
| 快速原型 | Ollama |
| 生产部署 | vLLM / SGLang |
| 低配设备 / 嵌入式 | llama.cpp |
| 需要单文件分发 | llamafile |
| 需要 Python 集成 | llama-cpp-python |
| 多模态本地推理 | llama.cpp + LLaVA |

### 8.3 版本演进

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.1 | 2023.3 | Georgi 首个版本，CPU 推理 |
| v0.2 | 2023.6 | Metal / CUDA 后端 |
| v0.3 | 2023.10 | GGUF 格式、量化增强 |
| v0.4 | 2024.3 | llama-server、OpenAI API |
| v0.5 | 2024.8 | Speculative Decoding、LoRA |
| v0.6 | 2025.1 | Vulkan / SYCL、多模态 |
| v0.7 | 2025.6 | Flash Attention、性能大幅提升 |
| v0.8 | 2026.x | 更强量化、移动端优化 |

---

## 参考资源

- [llama.cpp GitHub](https://github.com/ggerganov/llama.cpp)
- [llama.cpp 文档](https://github.com/ggerganov/llama.cpp/tree/master/examples)
- [llama-cpp-python](https://github.com/abetlen/llama-cpp-python)
- [GGUF 模型下载](https://huggingface.co/models?other=gguf)
- [llamafile](https://github.com/Mozilla-Ocho/llamafile)
- [Ollama](https://ollama.com/) - 基于 llama.cpp 的易用封装

---

*Last updated: 2026-06-15*
*Version: 2.0.0*

## Related

- [[10_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[10_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[10_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[10_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[10_Deployment_Inference/Inference_Engines/Ollama_Deep_Dive.md|Ollama_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive.md|vLLM_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/SGLang_Deep_Dive.md|SGLang_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/TensorRT_LLM_Deep_Dive.md|TensorRT_LLM_Deep_Dive]]
