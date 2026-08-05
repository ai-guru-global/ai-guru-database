---
title: "GGUF"
category: -concepts
tags: ["gguf", "llama-cpp", "quantization", "model-format", "edge-llm", "model-compression"]
relationships:
  - target: "概念/model-compression"
    type: belongs_to
  - target: "概念/quantization"
    type: implements
  - target: "概念/edge-llm"
    type: enables
  - target: "概念/llama-cpp"
    type: used_by
  - target: "概念/llama-box"
    type: used_by
  - target: "概念/model-formats"
    type: belongs_to
sources:
  - 10_部署推理/02_推理引擎/llama_cpp_Deep_Dive.md
  - 10_部署推理/04_模型量化/Quantization_Techniques_2026.md
  - 05_大模型/12_端侧大模型/README.md
summary: "GGUF（GPT-Generated Unified Format）是 llama.cpp 推出的大模型文件格式。它把模型权重、配置、tokenizer、特殊词表都打包进一个文件，并原生支持多种量化精度，是本地/边缘部署事实标准。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.84
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Gguf
  - "GPT-Generated Unified Format"
  - "GGUF 模型格式"

name_zh: "llama.cpp 模型格式"
---
# GGUF

> 中文简称：llama.cpp 模型格式

## 核心要点

- **GGUF 是 llama.cpp 的模型文件格式**，前身是 GGML，后来改名为 GGUF。
- **‘一个文件包一切’**：权重、config、tokenizer、特殊 token、元数据都在里面。
- **原生支持量化**：Q4_K_M、Q5_K_M、Q8_0 等，体积和精度可按需选择。
- **主要用途**：本地运行大模型、边缘设备、CPU 推理、llama-server/ollama 等工具。

## 一句话理解

GGUF 就像大模型的‘自解压安装包’：一个文件就能跑，还能选‘高清版’或‘省空间版’。

## 详细内容

### 为什么需要 GGUF？

原始 PyTorch 模型通常是多个 `.bin` 或 `.safetensors` 文件 + `config.json` + `tokenizer.json`，部署麻烦：
- 文件多，容易丢。
- 默认 FP16/BF16，体积大。
- 需要 PyTorch 环境。

GGUF 把这一切打包成一个文件，并预先量化好，方便在 llama.cpp 里直接加载。

### 常见量化等级

| 量化等级 | 精度 | 体积 | 适用场景 |
|----------|------|------|----------|
| **Q2_K** | 很低 | ~25% | 极低资源，效果损失大 |
| **Q4_K_M** | 中等 | ~50% | 性价比首选，常用 |
| **Q5_K_M** | 较高 | ~62% | 效果接近 FP16 |
| **Q8_0** | 高 | ~75% | 追求精度，CPU 友好 |
| **FP16** | 原精度 | 100% | 不量化 |

> 带 `_K` 的表示使用 K-quants，对重要层用更高精度，对非重要层用更低精度，平衡体积和效果。

### 常见使用场景

| 场景 | 推荐格式 | 原因 |
|------|----------|------|
| 本地跑 7B/13B 大模型 | **GGUF Q4_K_M** | 单文件、4-8GB 显存/内存即可跑 |
| 边缘设备/CPU 推理 | **GGUF Q4_K_M / Q5_K_M** | llama.cpp 对 CPU 优化好 |
| 通过 Ollama 使用 | **GGUF** | Ollama 内部使用 llama.cpp + GGUF |
| HuggingFace 分发 | **Safetensors** | 安全、加载快、社区标准 |
| 跨框架部署 | **ONNX** | 框架无关、工具链成熟 |
| NVIDIA GPU 生产推理 | **TensorRT** | 图优化和 kernel 融合带来更高吞吐 |

### GGUF 与 llama-box / PPU

在一些特定硬件或运行环境（如 PPU）中，实际执行推理的后端往往不是直接调用 llama.cpp，而是通过 **llama-box** 这类基于 llama.cpp 封装的服务层：

```
用户请求 ──▶ llama-box 推理后端 ──▶ llama.cpp 引擎 ──▶ PPU 硬件执行
                    │
                    ▼
              GGUF 量化模型文件
```

**为什么是 GGUF？**

- PPU 当前主要跑 **GGUF 量化模型**。
- GGUF 是 llama.cpp 的原生格式，单文件、量化参数内置。
- 所以 PPU 上的推理链路自然选择 **llama-box（基于 llama.cpp）** 作为后端。

换句话说：**因为模型是 GGUF，所以后端用 llama.cpp 这套（llama-box）。**

### GGUF 与其他模型格式对比

| 格式 | 特点 | 主要生态 | 量化能力 | 主要用途 |
|------|------|----------|----------|----------|
| **GGUF** | 单文件、内置 tokenizer/元数据 | llama.cpp / Ollama / llama-box | Q2/Q4/Q5/Q8/FP16 | 本地/边缘/CPU 推理 |
| **Safetensors** | HF 标准格式，安全、加载快 | HuggingFace / vLLM / SGLang | FP16/BF16/FP8/INT8 | 模型分发、训练、服务推理 |
| **ONNX** | 跨框架标准 | ONNX Runtime / TensorRT / OpenVINO | INT8/FP16 | 跨平台部署、C++/移动端 |
| **TensorRT** | NVIDIA 图优化格式 | NVIDIA GPU | INT8/FP16/FP8 | NVIDIA GPU 高性能推理 |
| **OpenVINO IR** | Intel 优化格式 | Intel CPU/iGPU/NPU | INT8/FP16 | Intel 硬件加速 |
| **Core ML** | Apple 生态格式 | iOS/macOS | 多种量化 | Apple 设备端推理 |
| **TFLite** | 移动端轻量格式 | Android/嵌入式 | INT8/FP16 | 手机、IoT、MCU |
| **GGML** | GGUF 的前身 | 早期 llama.cpp | Q4/Q5 等 | 已被 GGUF 逐步替代 |

### 典型使用流程

```bash
# 从 HF 模型转换并量化
python convert_hf_to_gguf.py /path/to/model --outfile model.gguf --outtype q4_k_m

# 用 llama-server 启动
llama-server -m model.gguf --port 8080
```

## 2026 年生态现状

| 方面 | 状态 |
|------|------|
| **Ollama** | 最流行的本地 LLM 工具，底层用 GGUF |
| **llama.cpp** | 持续活跃，支持最新模型架构 |
| **量化精度** | Q4_K_M 是性价比最优点 |
| **多模态** | 支持 LLaVA 等视觉模型 (mmproj) |
| **MoE** | 支持 DeepSeek、Mixtral 等 MoE 模型 |
| **硬件** | CPU/GPU(CUDA/Metal/Vulkan) 全支持 |

## 量化精度选择指南

| 量化 | 模型大小 (7B) | 质量 | 适用场景 |
|:----:|:----------:|:----:|----------|
| Q2_K | ~3 GB | 较差 | 极低资源设备 |
| Q4_K_M | ~4.5 GB | 良好 | **推荐默认** |
| Q5_K_M | ~5.5 GB | 很好 | 质量敏感场景 |
| Q8_0 | ~7.5 GB | 接近原始 | 质量优先 |
| FP16 | ~14 GB | 原始 | 基准对比 |

## 延伸阅读

- [[概念/Inference/model-formats|模型格式全景]]
- [[概念/Inference/quantization|量化]]
- [[概念/LLM/edge-llm|边缘 LLM]]
- [[概念/LLM/llama-cpp|llama.cpp]]
- [[10_部署推理/02_推理引擎/13_llama_cpp_深入分析|llama.cpp 深度解析]]
- [[10_部署推理/04_模型量化/04_量化_技术_2026|量化技术 2026]]

## GGUF 量化格式对比

| 格式 | 位宽 | 质量 | 速度 | 适用 |
|------|------|------|------|------|
| **Q8_0** | 8-bit | 几乎无损 | 中 | 质量优先 |
| **Q6_K** | 6-bit | 极小损失 | 中快 | 平衡 |
| **Q5_K_M** | 5-bit | 微小损失 | 快 | 生产推荐 |
| **Q4_K_M** | 4-bit | 轻微损失 | 最快 | 资源受限 |
| **Q3_K_M** | 3-bit | 明显损失 | 极快 | 极端受限 |
| **F16** | 16-bit | 无损 | 慢 | 基准 |

## GGUF 文件结构

```
GGUF 文件布局:
┌─────────────────────────┐
│ Magic: "GGUF" (4 bytes)  │
│ Version: 3               │
│ Tensor Count             │
│ Metadata KV Count        │
├─────────────────────────┤
│ Metadata (模型配置)      │
│  - general.architecture  │
│  - general.name          │
│  - llama.context_length  │
│  - tokenizer.*           │
├─────────────────────────┤
│ Tensor Info (名称/形状)  │
├─────────────────────────┤
│ Tensor Data (量化权重)   │
└─────────────────────────┘
```

## 生产最佳实践

1. **生产用 Q5_K_M**：质量/速度最佳平衡
2. **资源受限用 Q4_K_M**：显存/内存不足时的选择
3. **仅从官方下载**：HuggingFace 官方仓库，避免恶意文件
4. **llama.cpp 版本匹配**：GGUF v3 需要 llama.cpp b3000+
5. **元数据检查**：用 gguf-py 检查模型配置是否正确

> ℹ️ GGUF 是边缘/本地推理的事实标准格式，llama.cpp 生态的核心。
支持多种量化精度，从 Q3_K_M 到 Q8_0 满足不同资源约束。
