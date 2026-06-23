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
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
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

### GGUF vs Safetensors vs ONNX

| 格式 | 特点 | 主要用途 |
|------|------|----------|
| **Safetensors** | HF 标准格式，安全、加载快 | 训练、HF 生态推理 |
| **GGUF** | 单文件、多量化、llama.cpp 原生 | 本地/边缘/CPU 推理 |
| **ONNX** | 跨框架标准 | 通用推理引擎 |
| **TensorRT** | NVIDIA 优化格式 | NVIDIA GPU 高性能 |

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
- [[10_Deployment_Inference/Inference_Engines/llama_cpp_Deep_Dive]] — llama.cpp 深度解析
- [[10_Deployment_Inference/Quantization/Quantization_Techniques_2026]] — 量化技术 2026
