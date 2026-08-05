---
title: "端侧 LLM (Edge LLM)"
category: -concepts
tags: ["nlp", "edge-llm", "small-language-model", "quantization", "on-device", "llama-cpp", "mlx", "npu"]
relationships:
  - target: "概念/LLM/llm-architectures"
    type: builds_on
  - target: "概念/Inference/quantization"
    type: uses
  - target: "概念/Inference/model-serving"
    type: related_to
sources:
  - 05_大模型/12_端侧大模型
  - "https://github.com/ggerganov/llama.cpp"
summary: "端侧 LLM 通过高效小模型设计 (Phi/Gemma/Qwen)、量化压缩 (GGUF Q4_K_M) 和端侧推理引擎 (llama.cpp/MLC-LLM/Apple MLX) 实现手机/PC/嵌入式上的离线 LLM 推理。2026 年 NPU 加速和 3B 以下模型质量提升使端侧 AI 助手成为现实。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.87
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - "Edge Llm"
  - "edge llm"
  - "端侧大模型"
  - "On-device LLM"

name_zh: "端侧 LLM"
---
# 端侧 LLM (Edge LLM)

> 中文简称：端侧 LLM

> 让 LLM 跑在手机/PC/嵌入式设备上——离线可用、隐私安全、低延迟。

## 核心要点

- **离线推理**：无需网络，隐私数据不出设备
- **低延迟**：无网络往返，首 token < 100ms
- **3B 以下模型质量飞跃**：Phi-3-mini (3.8B) 超越 Mistral 7B，小模型不再“笨”
- **NPU 加速时代**：2025+ 手机/PC 内置 NPU，端侧推理进入实用化

## 高效小模型 (2026)

| 模型 | 参数量 | 亮点 | 端侧适用性 |
|------|:------:|------|----------|
| **Phi-3.5-mini** | 3.8B | 超越 Mistral 7B，教科书数据 | ★★★★★ |
| **Gemma 2 2B** | 2.6B | 2B 级 SOTA | ★★★★★ |
| **Qwen2.5-1.5B** | 1.5B | 中文最佳小模型 | ★★★★☆ |
| **Llama 3.2 1B** | 1.2B | Meta 官方端侧 | ★★★★☆ |
| **SmolLM2-135M** | 135M | 超轻量，IoT | ★★★☆☆ |
| **Apple Foundation** | 3B | Apple Intelligence 专用 | ★★★★★ |

## 量化方法

| 方法 | 位数 | 精度损失 | 推荐场景 | 模型大小 (3B) |
|------|:----:|:------:|----------|:---------:|
| **GGUF Q4_K_M** | 4-bit | 低 | **最佳性价比** | ~2 GB |
| **GGUF Q5_K_M** | 5-bit | 最低 | 追求质量 | ~2.4 GB |
| **GGUF Q8_0** | 8-bit | 极小 | 接近 FP16 | ~3.5 GB |
| **AWQ** | 4-bit | 最低 | GPU 推理 | ~1.8 GB |
| **GPTQ** | 4-bit | 低 | GPU 推理 | ~1.8 GB |
| **INT4 (NPU)** | 4-bit | 低 | NPU 加速 | ~1.5 GB |

## 推理引擎

| 引擎 | 平台 | 特色 | 硬件加速 |
|------|------|------|----------|
| **llama.cpp** | 全平台 | 最广泛，GGUF 格式 | CPU/GPU/Metal/CUDA |
| **MLC-LLM** | iOS/Android/Web | 跨平台，TVM 编译 | GPU/NPU |
| **Apple MLX** | macOS/iOS | Apple Silicon 原生 | ANE/GPU |
| **ONNX Runtime** | Windows/Linux | NPU 加速 | Intel/Qualcomm NPU |
| **MediaPipe** | Android/iOS | Google 端侧 AI | GPU/NNAPI |
| **Ollama** | macOS/Linux | 一键运行 | CPU/GPU |

## 部署示例

### llama.cpp (全平台)

```bash
# 下载 GGUF 量化模型
huggingface-cli download Qwen/Qwen2.5-1.5B-Instruct-GGUF \
    qwen2.5-1.5b-instruct-q4_k_m.gguf

# CPU 推理
./llama-cli -m qwen2.5-1.5b-instruct-q4_k_m.gguf \
    -p "请解释量子计算" -n 256 --temp 0.7

# Metal GPU 加速 (macOS)
./llama-cli -m model.gguf -ngl 99 -p "Hello" -n 128
```

### Apple MLX (macOS/iOS)

```python
import mlx.core as mx
from mlx_lm import load, generate

model, tokenizer = load("mlx-community/Qwen2.5-1.5B-Instruct-4bit")
response = generate(model, tokenizer, prompt="解释机器学习", max_tokens=256)
```

## 端侧 vs 云端对比

| 维度 | 端侧 LLM | 云端 LLM |
|------|----------|----------|
| 隐私 | **数据不出设备** | 数据上传服务器 |
| 延迟 | **< 100ms 首 token** | 200-2000ms |
| 离线 | **完全离线** | 需网络 |
| 模型质量 | 3B 以下 | 70B+ |
| 成本 | 一次性硬件 | 持续 API 费用 |
| 更新 | 手动下载 | 自动 |

## 2026 趋势

| 趋势 | 说明 |
|------|------|
| **NPU 标配** | 骁龙 8 Gen4、A18、Intel Lunar Lake 均内置 40+ TOPS NPU |
| **3B 模型质量飞跃** | Phi-3.5/Gemma 2 在任务上接近 7B 水平 |
| **混合推理** | 端侧处理简单任务，复杂任务上云 |
| **Apple Intelligence** | iOS 18+ 系统级端侧 AI 集成 |
| **多模态端侧** | 图片理解、语音识别端侧化 |

## 生产最佳实践

1. **量化选择 Q4_K_M**：最佳性价比，质量损失可接受
2. **优先 NPU 加速**：比纯 CPU 快 3-5×，比 GPU 省电
3. **模型选择 1.5-3.8B**：小于 1B 质量不足，大于 4B 端侧资源紧张
4. **混合架构**：端侧处理意图识别/简单问答，复杂任务转发云端
5. **预热模型**：应用启动时加载模型到内存，避免首次调用延迟

## Related

- [[05_大模型/12_端侧大模型/README]] — 端侧 LLM 深度解析
- [[概念/LLM/llm-architectures]] — LLM 架构
- [[概念/Inference/quantization]] — 量化
- [[概念/Inference/model-serving]] — 模型服务
- [[05_大模型/12_端侧大模型/01_端侧大模型_深入分析|端侧 LLM 深度解析]]
- [[10_部署推理/03_推理优化/02_LLM推理_深入分析|LLM 推理深度解析]]

## 2026 端侧模型生态

| 模型 | 参数 | 平台 | 特点 |
|------|:----:|------|------|
| **Qwen3-1.7B** | 1.7B | 手机/PC | 中文能力强 |
| **Llama 4 Scout** | 17B (MoE) | PC/平板 | 激活参数小 |
| **Gemma 3 4B** | 4B | 手机/PC | Google 开源 |
| **Phi-4-mini** | 3.8B | 手机/PC | 微软小模型 |
| **Apple Intelligence** | ~3B | iPhone/Mac | 原生集成 |
| **MediaTek NPU** | - | 手机 | 硬件加速 |

## 端侧推理框架对比

| 框架 | 平台 | 量化 | 加速 | 适用 |
|------|------|:----:|:----:|------|
| **llama.cpp** | 全平台 | GGUF | Metal/Vulkan/CUDA | 通用 |
| **MLC-LLM** | 手机/PC | INT4 | Metal/Vulkan/OpenCL | 跨平台 |
| **Core ML** | Apple | INT4/FP16 | ANE/GPU | iOS/macOS |
| **ONNX Runtime** | 全平台 | INT4/INT8 | NPU/GPU | 企业 |
| **MediaPipe** | 手机 | INT4 | GPU/DSP | 移动端 |
| **Ollama** | PC | GGUF | Metal/CUDA | 开发/个人 |

## 端云协同架构

```
用户请求
  │
  ├─ 简单任务 (意图识别/FAQ) → 端侧模型 (1-4B)
  │     └─ 延迟 <100ms，离线可用
  │
  ├─ 中等任务 (摘要/翻译) → 边缘节点 (7-14B)
  │     └─ 延迟 <500ms
  │
  └─ 复杂任务 (推理/代码) → 云端大模型 (70B+)
        └─ 延迟 1-3s
```

## 生产最佳实践补充

1. **量化选择 Q4_K_M**：最佳性价比，质量损失可接受
2. **优先 NPU 加速**：比纯 CPU 快 3-5×，比 GPU 省电
3. **模型选择 1.5-3.8B**：小于 1B 质量不足，大于 4B 端侧资源紧张
4. **混合架构**：端侧处理意图识别/简单问答，复杂任务转发云端
5. **预热模型**：应用启动时加载模型到内存，避免首次调用延迟
6. **内存管理**：监控端侧内存使用，避免 OOM 崩溃
7. **模型更新**：支持 OTA 模型更新，无需重新发布应用

## 端侧性能基准 (2026)

| 设备 | 芯片 | 模型 | 吐量 | 首 Token |
|------|------|------|:------:|:--------:|
| iPhone 16 Pro | A18 Pro | Phi-4-mini 3.8B Q4 | ~25 tok/s | ~200ms |
| MacBook M4 | M4 Pro | Qwen3-8B Q4 | ~35 tok/s | ~150ms |
| Pixel 9 | Tensor G4 | Gemma 3 4B Q4 | ~18 tok/s | ~300ms |
| RTX 4090 PC | RTX 4090 | Llama 4 Scout Q4 | ~80 tok/s | ~50ms |
| 骁龙 8 Gen 4 | Adreno 830 | Qwen3-1.7B Q4 | ~20 tok/s | ~250ms |

## 延伸阅读

- [[概念/LLM/llama-cpp|llama.cpp]] — 端侧推理引擎
- [[概念/LLM/llm-quantization|LLM 量化]] — 端侧必用量化
- [[概念/LLM/llm-inference-engine|推理引擎]] — 引擎全景
- [[概念/LLM/kv-cache|KV Cache]] — 端侧显存管理
