---
title: "GGUF"
category: -concepts
tags: ["gguf", "llama-cpp", "quantization", "model-format", "edge-llm", "model-compression"]
relationships:
  - target: "_concepts/model-compression"
    type: belongs_to
  - target: "_concepts/quantization"
    type: implements
  - target: "_concepts/edge-llm"
    type: enables
  - target: "_concepts/llama-cpp"
    type: used_by
  - target: "_concepts/llama-box"
    type: used_by
  - target: "_concepts/model-formats"
    type: belongs_to
sources:
  - 10_Deployment_Inference/Inference_Engines/llama_cpp_Deep_Dive.md
  - 10_Deployment_Inference/Quantization/Quantization_Techniques_2026.md
  - 05_NLP_LLMs/Edge_LLM/README.md
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
updated: 2026-06-25
aliases:
  - Gguf

---
# GGUF

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

## 开放问题

- 极低量化（Q2/Q3）在长上下文、代码、数学任务上的效果衰退。
- GGUF 与多模态模型、MoE 模型的兼容性。
- 量化后的模型在法律/医疗等高风险场景的可用性边界。

## Related

- [[_concepts/model-compression]] — 模型压缩
- [[_concepts/quantization]] — 量化
- [[_concepts/edge-llm]] — 边缘 LLM
- [[_concepts/llama-cpp]] — llama.cpp
- [[_concepts/llama-box]] — llama-box 推理后端
- [[_concepts/model-formats]] — 模型格式全景
- [[_concepts/safetensors]] — Safetensors 安全模型格式
- [[_concepts/onnx]] — ONNX 开放神经网络交换格式
- [[10_Deployment_Inference/Inference_Engines/llama_cpp_Deep_Dive]] — llama.cpp 深度解析
- [[10_Deployment_Inference/Quantization/Quantization_Techniques_2026]] — 量化技术 2026
