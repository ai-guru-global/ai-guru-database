---
title: "端侧 LLM (Edge LLM)"
category: -concepts
tags: ["nlp", "edge-llm", "small-language-model", "quantization", "on-device", "llama-cpp"]
relationships:
  - target: "_concepts/llm-architectures"
    type: builds_on
  - target: "_concepts/llm-infrastructure"
    type: related_to
sources:
  - 05_NLP_LLMs/Edge_LLM
summary: "端侧LLM通过高效小模型设计(Phi/Gemma/Qwen)、量化压缩(GPTQ/AWQ/GGUF)和端侧推理引擎(llama.cpp/MLC-LLM)实现手机/PC/嵌入式上的离线LLM推理。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.87
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
---

# 端侧 LLM (Edge LLM)

> 让 LLM 跑在手机/PC/嵌入式设备上——离线可用、隐私安全、低延迟。

---

## 1. 定义

**端侧 LLM**指在边缘设备（手机、PC、IoT）上本地运行的语言模型，通过高效模型设计、量化压缩和专用推理引擎实现。

---

## 2. 高效小模型

| 模型 | 参数量 | 亮点 |
|------|--------|------|
| **Phi-3-mini** | 3.8B | 超越 Mistral 7B，教科书数据训练 |
| **Gemma 2 2B** | 2.6B | 2B 级别 SOTA |
| **Qwen2-0.5B** | 0.5B | 最小可用中文 LLM |
| **SmolLM-135M** | 135M | 超轻量 |

---

## 3. 量化方法

| 方法 | 位数 | 精度损失 | 推荐场景 |
|------|------|----------|----------|
| **AWQ** | 4-bit | 最低 | GPU 推理 |
| **GPTQ** | 4-bit | 低 | GPU 推理 |
| **GGUF Q4_K_M** | 4-bit | 低 | **最佳性价比** |
| **GGUF Q5_K_M** | 5-bit | 最低 | 追求质量 |

---

## 4. 推理引擎

| 引擎 | 平台 | 特色 |
|------|------|------|
| **llama.cpp** | 全平台 | 最广泛，GGUF 格式 |
| **MLC-LLM** | iOS/Android/Web | 跨平台 |
| **Apple MLX** | macOS/iOS | Apple Silicon 原生 |
| **ONNX Runtime** | Windows/Linux | NPU 加速 |

---

## Related

- [[05_NLP_LLMs/Edge_LLM]] — 端侧 LLM 深度解析
- [[_concepts/llm-architectures]] — LLM 架构
- [[_concepts/llm-infrastructure]] — LLM 基础设施
