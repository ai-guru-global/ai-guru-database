---
title: "MLC LLM: 移动端/异构设备 LLM 推理框架"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "mlc-llm", "mobile", "edge", "npu", "gpu", "quantization"]
summary: "> **一句话理解**: MLC LLM 是 CMU 团队出品的端侧 LLM 推理框架——基于 Apache TVM 编译，支持手机 NPU/GPU、游戏主机和浏览器，让大模型在消费级设备上高速运行。"
created: "2026-06-15"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Mlc Llm Deep Dive"
  - "MLC LLM Deep Dive"
  - MLC_LLM_Deep_Dive
sources: []

name_zh: "MLC LLM: 移动端/异构设备 LLM 推理框架"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# MLC LLM: 移动端/异构设备 LLM 推理框架

> 中文简称：MLC LLM: 移动端/异构设备 LLM 推理框架

> **一句话理解**: MLC LLM 是 CMU 团队出品的端侧 LLM 推理框架——基于 Apache TVM 编译，支持手机 NPU/GPU、游戏主机和浏览器，让大模型在消费级设备上高速运行。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [平台部署](#5-平台部署)
6. [量化与优化](#6-量化与优化)
7. [对比与选择](#7-对比与选择)

---

## 1. 概述

### 1.1 定位

```
MLC LLM: 端侧 LLM 推理框架
═══════════════════════════════════════════════════════════════════

定位: 基于 Apache TVM 的机器学习编译框架，专为消费级设备上的 LLM 推理优化

核心理念:
───────────────────────────────────────────────────────────────────
• 机器学习编译: 自动为不同硬件生成优化 kernel
• 跨平台: iOS / Android / Web / Windows / Linux / macOS
• 异构硬件: CPU / GPU / NPU (Apple Neural Engine / Adreno / Mali)
• 量化压缩: INT4 / INT8 / FP16 多种精度
• 本地优先: 完全离线运行，保护隐私
• 开源生态: Apache 2.0，社区活跃
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Apache TVM 编译** | 自动 kernel 生成与优化 |
| **多平台 Runtime** | iOS / Android / WebGPU / Vulkan / Metal / CUDA |
| **模型量化** | INT4 / INT8 / FP16 / AWQ / GPTQ |
| **Prefill/Decode 优化** | 针对端侧内存和算力优化 |
| **Streaming** | 流式 token 生成 |
| **多模态** | 支持 Llava 等 VLM |
| **预构建模型** | MLC Chat 应用内置模型 |

### 1.3 支持平台

| 平台 | 后端 | 代表设备 |
|------|------|----------|
| **iOS** | Metal / Apple Neural Engine | iPhone / iPad |
| **Android** | OpenCL / Vulkan | Samsung / Pixel |
| **Web** | WebGPU / WebGL | Chrome / Edge |
| **macOS** | Metal | MacBook / iMac |
| **Windows/Linux** | Vulkan / CUDA | PC / Server |
| **游戏主机** | Vulkan | Steam Deck / Xbox (实验) |

### 1.4 性能数据 (2026)

| 设备 | 模型 | 量化 | 速度 |
|------|------|------|------|
| iPhone 16 Pro | Llama 3.2 3B | INT4 | 25 tok/s |
| iPhone 16 Pro | Llama 3.2 1B | INT4 | 60 tok/s |
| Pixel 9 Pro | Llama 3.2 3B | INT4 | 20 tok/s |
| M4 Max MacBook | Llama 3.1 8B | INT4 | 45 tok/s |
| RTX 4090 | Llama 3.1 8B | INT4 | 150 tok/s |
| Steam Deck | Llama 3.2 3B | INT4 | 12 tok/s |

---

## 2. 核心概念

### 2.1 机器学习编译流程

```
MLC LLM 编译流程
═══════════════════════════════════════════════════════════════════

HuggingFace / PyTorch Model
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│ MLC LLM Model Converter                                     │
│                                                              │
│  • 读取模型权重                                             │
│  • 应用量化 (INT4/INT8)                                     │
│  • 转换为 Relax IR (TVM)                                    │
└──────────────────────────────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│ Apache TVM Compiler                                         │
│                                                              │
│  • 算子融合                                                 │
│  • 内存规划                                                 │
│  • 针对目标硬件生成 kernel                                  │
│  • 输出 .so / .dylib / .wasm                                │
└──────────────────────────────────────────────────────────────┘
              │
              ▼
MLC Runtime (per platform)
              │
              ▼
Target Device (iPhone / Android / Browser / PC)
```

### 2.2 Relax IR

```
Relax: TVM 新一代深度学习 IR
═══════════════════════════════════════════════════════════════════

特点:
───────────────────────────────────────────────────────────────────
• 原生支持动态形状
• 显式数据流和内存管理
• 便于跨平台代码生成
• 适合 Transformer 这种计算图复杂的模型

MLC LLM 将 PyTorch 模型 → Torch FX → Relax → TVM runtime
```

### 2.3 量化策略

| 策略 | 大小 | 速度 | 精度 | 适用 |
|------|------|------|------|------|
| **Q4f16_1** | 极小 | 快 | 中 | 手机 7B 模型 |
| **Q4f32_1** | 极小 | 较快 | 中 | 需要更高精度 |
| **Q8f16_1** | 小 | 较快 | 高 | 平板/PC |
| **Q0f16** | 中 | 快 | 很高 | 有足够内存 |
| **AWQ** | 小 | 快 | 高 | 推荐 |
| **GPTQ** | 小 | 快 | 高 | 推荐 |

---

## 3. 架构设计

### 3.1 系统架构

```
MLC LLM 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        MLC LLM 架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Model Definition / Weights                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  HuggingFace / Safetensors / PyTorch                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              MLC LLM Converter                           │   │
│   │  • Quantization                                         │   │
│   │  • Parameter Transformation                             │   │
│   │  • Relax IR Generation                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Apache TVM Compiler                         │   │
│   │  • Operator Fusion                                      │   │
│   │  • Kernel Auto-Tuning                                   │   │
│   │  • Target Code Generation                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              MLC Runtime                                 │   │
│   │  ├── iOS (Metal/ANE)                                    │   │
│   │  ├── Android (OpenCL/Vulkan)                            │   │
│   │  ├── Web (WebGPU/WebGL)                                 │   │
│   │  ├── macOS (Metal)                                      │   │
│   │  └── PC (Vulkan/CUDA)                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 运行时组件

| 组件 | 功能 |
|------|------|
| **Tokenizer** | SentencePiece / TikToken / HuggingFace tokenizer |
| **KV Cache** | 分页式/连续式 KV Cache 管理 |
| **Sampler** | Greedy / Top-k / Top-p / Temperature |
| **Conversation** | Chat template 管理 |
| **Function Calling** | 工具调用支持 |

---

## 4. 快速开始

### 4.1 安装

```bash
# Python 包
pip install mlc-llm-nightly mlc-ai-nightly

# 或稳定版
pip install mlc-llm

# 命令行工具
python -m mlc_llm --help
```

### 4.2 下载预编译模型

```bash
# 列出可用模型
mlc_llm chat --help

# 下载并运行预编译模型
mlc_llm chat HF://mlc-ai/Llama-3.2-3B-Instruct-q4f16_1-MLC

# 或指定本地模型
mlc_llm chat ./dist/Llama-3.2-3B-Instruct-q4f16_1-MLC
```

### 4.3 模型转换

```bash
# 转换 HuggingFace 模型
mlc_llm convert_build \
  ./dist/models/Llama-3.2-3B-Instruct \
  --quantization q4f16_1 \
  --output ./dist/Llama-3.2-3B-Instruct-q4f16_1-MLC

# 使用 AWQ 量化
mlc_llm convert_build \
  ./dist/models/Llama-3.2-3B-Instruct \
  --quantization q4f16_awq \
  --output ./dist/Llama-3.2-3B-Instruct-q4f16_awq-MLC
```

### 4.4 Python 推理

```python
from mlc_llm import MLCEngine

# 创建引擎
engine = MLCEngine(
    model="HF://mlc-ai/Llama-3.2-3B-Instruct-q4f16_1-MLC",
    device="metal"  # 或 cuda / vulkan / opencl
)

# 聊天完成
response = engine.chat.completions.create(
    messages=[{"role": "user", "content": "解释量子纠缠"}],
    max_tokens=256,
    temperature=0.7
)
print(response.choices[0].message.content)

# 流式输出
for chunk in engine.chat.completions.create(
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
):
    print(chunk.choices[0].delta.content, end="")
```

### 4.5 REST API 服务

```bash
# 启动 OpenAI 兼容服务
mlc_llm serve \
  HF://mlc-ai/Llama-3.2-3B-Instruct-q4f16_1-MLC \
  --device metal \
  --port 8000
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="default",
    messages=[{"role": "user", "content": "你好"}]
)
print(response.choices[0].message.content)
```

---

## 5. 平台部署

### 5.1 iOS 部署

```bash
# 1. 准备 iOS 预编译模型
mlc_llm package \
  ./dist/Llama-3.2-3B-Instruct-q4f16_1-MLC \
  --platform ios \
  --output ./ios_app/dist

# 2. 集成到 Xcode 项目
# 参考 MLC Chat iOS 示例应用
```

### 5.2 Android 部署

```bash
# 1. 准备 Android 预编译模型
mlc_llm package \
  ./dist/Llama-3.2-3B-Instruct-q4f16_1-MLC \
  --platform android \
  --output ./android_app/dist

# 2. 使用 Android Studio 构建 APK
# 参考 MLC Chat Android 示例应用
```

### 5.3 Web 部署

```bash
# 1. 编译为 WebAssembly + WebGPU
mlc_llm convert_build \
  ./dist/models/Llama-3.2-3B-Instruct \
  --quantization q4f16_1 \
  --output ./dist/web-llama \
  --target webgpu

# 2. 使用 @mlc-ai/web-llm 包
npm install @mlc-ai/web-llm
```

```javascript
import * as webllm from "@mlc-ai/web-llm";

const chat = new webllm.ChatModule();

await chat.reload("Llama-3.2-3B-Instruct-q4f16_1", {
  conv_template: "llama-3",
  conv_config: { system: "You are a helpful assistant." }
});

const reply = await chat.generate("解释量子纠缠");
console.log(reply);
```

### 5.4 桌面部署

```bash
# Vulkan 后端 (Windows/Linux)
mlc_llm chat HF://mlc-ai/Llama-3.2-3B-Instruct-q4f16_1-MLC --device vulkan

# Metal 后端 (macOS)
mlc_llm chat HF://mlc-ai/Llama-3.2-3B-Instruct-q4f16_1-MLC --device metal

# CUDA 后端 (NVIDIA GPU)
mlc_llm chat HF://mlc-ai/Llama-3.2-3B-Instruct-q4f16_1-MLC --device cuda
```

---

## 6. 量化与优化

### 6.1 量化选择建议

```
MLC LLM 量化选择
═══════════════════════════════════════════════════════════════════

手机 (4-8GB RAM):
───────────────────────────────────────────────────────────────────
• 1B-3B 模型: q4f16_1
• 7B 模型: q4f16_1 (高端机) 或 q4f16_awq

平板 / PC (8-16GB RAM):
───────────────────────────────────────────────────────────────────
• 7B 模型: q4f16_1 或 q4f32_1
• 13B 模型: q4f16_1

服务器:
───────────────────────────────────────────────────────────────────
• q8f16_1 或 q0f16 (高精度)
```

### 6.2 内存优化

```python
from mlc_llm import MLCEngine

engine = MLCEngine(
    model="HF://mlc-ai/Llama-3.2-3B-Instruct-q4f16_1-MLC",
    device="metal",
    # 限制上下文长度以节省内存
    max_total_seq_length=4096,
    # 限制_prefill token
    prefill_chunk_size=512
)
```

### 6.3 性能调优

| 参数 | 说明 | 建议 |
|------|------|------|
| `--prefill-chunk-size` | 单次 prefill token 数 | 512-2048 |
| `--max-total-seq-length` | 最大序列长度 | 按业务需求 |
| `--tensor-parallel-shards` | 张量并行 | 多 GPU 时设置 |
| `--quantization` | 量化方式 | 手机 q4f16_1，服务器 q8f16_1 |

---

## 7. 对比与选择

### 7.1 与其他端侧推理方案对比

| 维度 | MLC LLM | llama.cpp | LiteRT | ONNX Runtime |
|------|---------|-----------|--------|--------------|
| **手机 NPU** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Web 部署** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **iOS 性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Android 性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **模型生态** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **编译复杂度** | 中 | 低 | 低 | 低 |
| **跨平台** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 7.2 选型建议

| 场景 | 推荐 |
|------|------|
| iOS 端 LLM | MLC LLM |
| Android 端 LLM | MLC LLM |
| 浏览器端 LLM | MLC LLM (WebLLM) |
| 跨平台本地 LLM | llama.cpp / MLC LLM |
| 移动端传统 ML | LiteRT |
| 快速原型 | Ollama / llama.cpp |
| 手机小模型 1B-3B | MLC LLM |
| 手机 7B 模型 | MLC LLM (高端机) |

### 7.3 适用场景

| 场景 | MLC LLM 优势 |
|------|--------------|
| 移动端聊天应用 | NPU/GPU 优化，低功耗 |
| 离线 AI 助手 | 完全本地运行 |
| Web AI 应用 | WebGPU 支持 |
| 隐私敏感应用 | 数据不出设备 |
| 异构硬件 | 自动编译适配 |

### 7.4 版本演进

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.1 | 2023.4 | 首个版本，支持 Vulkan/Metal |
| v0.2 | 2023.8 | iOS/Android 应用 |
| v0.3 | 2024.1 | WebLLM 发布 |
| v0.4 | 2024.6 | MLC Engine Python API |
| v0.5 | 2024.12 | 多模态、Function Calling |
| v0.6 | 2025.6 | 更强的 NPU 支持 |
| v0.7 | 2026.x | 生产级 serve、自动量化 |

---

## 参考资源

- [MLC LLM GitHub](https://github.com/mlc-ai/mlc-llm)
- [MLC LLM 文档](https://llm.mlc.ai/)
- [WebLLM](https://github.com/mlc-ai/web-llm)
- [Apache TVM](https://tvm.apache.org/)
- [MLC Chat iOS](https://github.com/mlc-ai/mlc-chat)

---

*Last updated: 2026-06-15*
*Version: 1.0.0*

## Related

- [[10_部署推理/02_推理引擎/13_llama_cpp_深入分析|llama_cpp_Deep_Dive]]
- [[10_部署推理/02_推理引擎/12_LiteRT_深入分析|LiteRT_Deep_Dive]]
- [[10_部署推理/02_推理引擎/22_Ollama_深入分析|Ollama_Deep_Dive]]
- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM_Deep_Dive]]
- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM_Inference_Engine_Selection_Guide]]
- [[10_部署推理/01_部署基础/03_部署推理.md|Deployment_Inference]]
