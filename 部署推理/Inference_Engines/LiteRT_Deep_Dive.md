---
title: "LiteRT / TensorFlow Lite: 边缘 AI 推理"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "litert", "tensorflow-lite", "edge", "mobile", "quantization", "npu"]
summary: "> **一句话理解**: LiteRT (原 TensorFlow Lite) 是 Google 出品的跨平台边缘 AI 推理框架——Android/iOS/嵌入式全支持、多硬件委托加速、量化压缩，让模型在端侧低延迟、低功耗、完全离线运行。"
created: "2026-05-31"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Litert Deep Dive"
  - "LiteRT Deep Dive"
  - LiteRT_Deep_Dive
sources: []

---
# LiteRT / TensorFlow Lite: 边缘 AI 推理

> **一句话理解**: LiteRT (原 TensorFlow Lite) 是 Google 出品的跨平台边缘 AI 推理框架——Android/iOS/嵌入式全支持、多硬件委托加速、量化压缩，让模型在端侧低延迟、低功耗、完全离线运行。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [模型转换](#4-模型转换)
5. [部署实战](#5-部署实战)
6. [性能优化](#6-性能优化)
7. [LLM 在端侧](#7-llm-在端侧)
8. [对比与选择](#8-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LiteRT: 跨平台边缘 AI 推理框架
═══════════════════════════════════════════════════════════════════

定位: Google 官方出品的端侧模型推理运行时

核心理念:
───────────────────────────────────────────────────────────────────
• 轻量: 极小的运行时二进制
• 高效: 针对移动和嵌入式 CPU/GPU/NPU 深度优化
• 跨平台: Android / iOS / Linux / 嵌入式 / Web
• 多语言: Python / C++ / Java / Swift / Go
• 硬件加速: CPU / GPU / NPU / DSP 统一抽象
• 离线优先: 无需网络，保护隐私
```

### 1.2 历史与品牌

```
TensorFlow Lite → LiteRT
═══════════════════════════════════════════════════════════════════

2024 年 Google 将 TensorFlow Lite 更名为 LiteRT (Lite Runtime)
───────────────────────────────────────────────────────────────────
• 更强调「通用推理运行时」定位
• 不仅支持 TensorFlow 模型，也支持 JAX/PyTorch 转换的模型
• 与 Gemini Nano、Android AI Core 深度整合
• 成为 Android 官方端侧 AI 标准运行时
```

### 1.3 核心特性

| 特性 | 说明 |
|------|------|
| **量化** | INT8 / FP16 / INT4 / 动态范围量化 |
| **算子融合** | Conv + BN + ReLU 等融合优化 |
| **硬件委托** | GPU / NNAPI / Core ML / XNNPACK / Hexagon |
| **内存优化** | 内存映射、零拷贝、动态分配 |
| **多模型格式** | `.tflite`、LiteRT FlatBuffer |
| **模型元数据** | 支持标签、预处理、后处理信息 |
| **代理支持** | EdgeTPU、Coral、ANE (Apple Neural Engine) |

### 1.4 适用模型类型

| 类型 | 示例 | 端侧可行性 |
|------|------|------------|
| **图像分类** | MobileNet、EfficientNet | ✅ 非常适合 |
| **目标检测** | SSD MobileNet、YOLO | ✅ 适合 |
| **语义分割** | DeepLab | ✅ 适合 |
| **姿态估计** | MoveNet、PoseNet | ✅ 适合 |
| **语音识别** | Whisper Tiny | ⚠️ 需优化 |
| **文本生成 (LLM)** | Gemma 2B、Phi-2 | ⚠️ 小模型可行 |
| **多模态** | MobileLLaVA | ⚠️ 高端设备 |

---

## 2. 核心概念

### 2.1 转换流程

```
LiteRT 模型转换
═══════════════════════════════════════════════════════════════════

PyTorch / TensorFlow / JAX Model
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│ AI Edge Converter / TensorFlow Converter                     │
│                                                              │
│  • 去除冗余 ops                                             │
│  • 算子融合                                                 │
│  • 量化感知训练 (QAT)                                       │
│  • 后训练量化 (PTQ)                                         │
│  • 生成 LiteRT Model (.tflite)                              │
└──────────────────────────────────────────────────────────────┘
              │
              ▼
LiteRT Model (.tflite)
              │
              ▼
┌──────────────────────────────────────────────────────────────┐
│ LiteRT Interpreter                                           │
│                                                              │
│  • 加载模型                                                 │
│  • 选择 Delegate (GPU/NPU/CPU)                              │
│  • 分配张量                                                 │
│  • 执行推理                                                 │
│  • 获取输出                                                 │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Delegate（硬件委托）

```
LiteRT Delegate 架构
═══════════════════════════════════════════════════════════════════

        LiteRT Interpreter
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
 XNNPACK     GPU      NNAPI/Core ML
 (CPU)    (OpenCL/    (NPU)
          OpenGLES)

常见 Delegate:
───────────────────────────────────────────────────────────────────
• XNNPACK: CPU 端高性能，支持 INT8/FP32
• GPU Delegate: Android OpenCL / OpenGL ES
• NNAPI: Android NPU 抽象（Qualcomm / MediaTek / Google Tensor）
• Core ML Delegate: Apple Neural Engine (ANE)
• Hexagon Delegate: Qualcomm DSP
• Edge TPU Delegate: Google Coral
```

### 2.3 量化技术

| 技术 | 说明 | 收益 | 精度损失 |
|------|------|------|----------|
| **动态范围量化** | 权重 INT8，激活 FP32 | 4x 内存节省 | 很小 |
| **全整型量化** | 权重+激活 INT8 | 4x 内存 + 更快 | 小 |
| **FP16 量化** | 权重 FP16 | 2x 内存节省 | 极小 |
| **INT4 量化** | 权重 INT4 | 8x 内存节省 | 中等 |
| **QAT** | 训练时量化 | 最佳精度 | 极小 |

---

## 3. 架构设计

### 3.1 运行时架构

```
LiteRT 运行时架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Application                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   LiteRT Interpreter                                             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Model Loader                                           │   │
│   │  Graph Executor                                         │   │
│   │  Memory Planner                                         │   │
│   │  Delegate Manager                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Built-in Kernels                            │   │
│   │  ├── CPU (XNNPACK / Eigen)                              │   │
│   │  ├── GPU (OpenCL / OpenGL ES / Metal)                   │   │
│   │  └── NPU (NNAPI / Core ML / Hexagon)                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   Hardware (SoC / NPU / GPU / CPU)                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 内存管理

```
LiteRT 内存优化策略
═══════════════════════════════════════════════════════════════════

1. 内存映射 (mmap)
───────────────────────────────────────────────────────────────────
• 模型文件直接映射到内存，避免全量加载
• 多个模型共享只读页

2. 零拷贝输入/输出
───────────────────────────────────────────────────────────────────
• 使用 `interpreter.allocate_tensors()` 预分配
• 输入数据直接写入 interpreter 张量

3. 动态张量分配
───────────────────────────────────────────────────────────────────
• 支持动态形状输入
• 按需分配中间张量

4. GPU 内存复用
───────────────────────────────────────────────────────────────────
• Delegate 内部复用 GPU buffer
• 减少 CPU-GPU 数据传输
```

---

## 4. 模型转换

### 4.1 从 TensorFlow 转换

```python
import tensorflow as tf

# 加载 TensorFlow SavedModel
converter = tf.lite.TFLiteConverter.from_saved_model('path/to/saved_model')

# 动态范围量化
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# 全整型量化 (需要 representative dataset)
def representative_dataset():
    for _ in range(100):
        data = np.random.rand(1, 224, 224, 3).astype(np.float32)
        yield [data]

converter.representative_dataset = representative_dataset
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter.inference_input_type = tf.int8
converter.inference_output_type = tf.int8

# 转换并保存
tflite_model = converter.convert()
with open('model_int8.tflite', 'wb') as f:
    f.write(tflite_model)
```

### 4.2 从 PyTorch 转换

```python
import torch
import ai_edge_torch

# 加载 PyTorch 模型
model = torch.load('model.pth')
model.eval()

# 准备示例输入
sample_input = (torch.randn(1, 3, 224, 224),)

# 转换为 LiteRT
edge_model = ai_edge_torch.convert(model, sample_input)
edge_model.export('model_pytorch.tflite')
```

### 4.3 从 JAX 转换

```python
import jax
import ai_edge_torch

# JAX 函数转 LiteRT 需要先转 PyTorch / SavedModel
# 通常路径: JAX → SavedModel → TFLite
```

### 4.4 LLM 转换 (Gemma)

```python
import ai_edge_torch
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# 加载小 LLM
model = AutoModelForCausalLM.from_pretrained("google/gemma-2b-it")
tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b-it")

# 准备输入
input_ids = tokenizer("Hello, how are you?", return_tensors="pt").input_ids

# 转换
edge_model = ai_edge_torch.convert(model, (input_ids,))
edge_model.export('gemma-2b.tflite')
```

---

## 5. 部署实战

### 5.1 Android 部署

```gradle
// build.gradle
dependencies {
    implementation 'com.google.ai.edge.litert:litert:1.0.1'
    // GPU 委托
    implementation 'com.google.ai.edge.litert:litert-gpu:1.0.1'
    // NNAPI 委托
    implementation 'com.google.ai.edge.litert:litert-support-api:1.0.1'
}
```

```kotlin
// Android Kotlin
import com.google.ai.edge.litert.Interpreter
import java.nio.ByteBuffer

// 加载模型
val model = ByteBuffer.loadFromFile(assets.openFd("model.tflite"))
val interpreter = Interpreter(model)

// 配置 GPU 委托
val gpuOptions = GpuDelegate.Options()
val gpuDelegate = GpuDelegate(gpuOptions)
val options = Interpreter.Options().addDelegate(gpuDelegate)
val interpreterWithGpu = Interpreter(model, options)

// 输入输出
val input = Array(1) { Array(224) { Array(224) { FloatArray(3) } } }
val output = Array(1) { FloatArray(1000) }

// 推理
interpreter.run(input, output)
```

### 5.2 iOS 部署

```swift
// Podfile
pod 'TensorFlowLiteSwift'
pod 'TensorFlowLiteSwift/CoreML'  // Core ML delegate

// Swift
import TensorFlowLite

let modelPath = Bundle.main.path(forResource: "model", ofType: "tflite")!

// Core ML 委托
var options = Interpreter.Options()
let coreMLDelegate = CoreMLDelegate()
options.addDelegate(coreMLDelegate)

let interpreter = try Interpreter(modelPath: modelPath, options: options)
try interpreter.allocateTensors()

// 输入
let inputData = Data(inputBuffer)
try interpreter.copy(inputData, toInputAt: 0)

// 推理
try interpreter.invoke()

// 输出
let output = try interpreter.output(at: 0)
```

### 5.3 Python 部署

```python
import numpy as np
import ai_edge_litert.interpreter as tflite

# 加载模型
interpreter = tflite.Interpreter(model_path="model_int8.tflite")
interpreter.allocate_tensors()

# 获取输入输出索引
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# 准备输入
input_data = np.random.rand(1, 224, 224, 3).astype(np.float32)
interpreter.set_tensor(input_details[0]['index'], input_data)

# 推理
interpreter.invoke()

# 获取输出
output = interpreter.get_tensor(output_details[0]['index'])
print(output)
```

### 5.4 嵌入式 / Linux

```python
# 树莓派 / 嵌入式
import tflite_runtime.interpreter as tflite

interpreter = tflite.Interpreter(
    model_path="model.tflite",
    num_threads=4,  # 多线程
    experimental_delegates=[tflite.load_delegate('libedgetpu.so.1')]  # Edge TPU
)
interpreter.allocate_tensors()

# 推理...
```

---

## 6. 性能优化

### 6.1 优化 checklist

```
LiteRT 性能优化 checklist
═══════════════════════════════════════════════════════════════════

□ 使用合适的 Delegate
  • Android: GPU > NNAPI > XNNPACK
  • iOS: Core ML > Metal GPU > XNNPACK
  • 嵌入式: XNNPACK / Edge TPU

□ 启用量化
  • 优先 INT8 全量化
  • 对精度敏感用 FP16
  • 极致压缩用 INT4

□ 减少输入预处理
  • 将预处理融入模型 (TFLite Model Maker)
  • 使用零拷贝输入

□ 减少 CPU-GPU 传输
  • 输入输出尽量驻留 GPU
  • 批量推理

□ 内存优化
  • 使用 mmap 加载
  • 控制并发模型数
  • 及时释放不用的 interpreter

□ 模型结构优化
  • 算子融合
  • 移除训练专用层
  • 使用兼容的 ops
```

### 6.2 基准性能

| 设备 | 模型 | 输入 | 延迟 | 说明 |
|------|------|------|------|------|
| Pixel 9 Pro | MobileNet V3 INT8 | 224x224 | 2ms | NNAPI |
| iPhone 16 Pro | MobileNet V3 INT8 | 224x224 | 1.5ms | Core ML |
| 树莓派 5 | MobileNet V3 FP32 | 224x224 | 25ms | XNNPACK 4 threads |
| Samsung S24 | EfficientNet-Lite0 | 224x224 | 4ms | GPU Delegate |
| Pixel 9 Pro | Gemma 2B INT4 | text | 15 tok/s | NNAPI |
| iPhone 16 Pro | Gemma 2B INT4 | text | 20 tok/s | Core ML |

---

## 7. LLM 在端侧

### 7.1 端侧 LLM 可行性

```
端侧 LLM 部署现状 (2026)
═══════════════════════════════════════════════════════════════════

可行的小模型:
───────────────────────────────────────────────────────────────────
• Gemma 2B / 4B
• Phi-2 / Phi-3 (2.7B / 3.8B)
• Qwen2.5-1.5B / 3B
• Llama 3.2 1B / 3B
• StableLM 2 1.6B

部署方式:
───────────────────────────────────────────────────────────────────
• LiteRT: 适合 Gemma 等 Google 优化模型
• llama.cpp: 通用性强，GGUF 格式
• MLC LLM: 针对手机 NPU 优化
• MediaPipe LLM Task: 跨平台端侧 LLM API

挑战:
───────────────────────────────────────────────────────────────────
• 内存限制: 高端手机 12GB RAM 才能跑 7B
• 量化要求: 通常需要 INT4 才能装下
• 速度: 7B 在手机上约 5-10 tok/s
• 功耗: 长生成会显著耗电
```

### 7.2 Gemma on LiteRT

```python
# 使用 MediaPipe LLM Task API
from mediapipe.tasks.python.genai import LLMInference

# 配置
base_options = BaseOptions(model_asset_path='gemma-2b-int4.task')
options = LLMInferenceOptions(base_options=base_options)

# 创建推理器
llm_inference = LLMInference.create_from_options(options)

# 生成
response = llm_inference.generate_response("解释量子计算")
print(response)
```

### 7.3 与 llama.cpp / MLC LLM 的对比

| 方案 | 优势 | 劣势 | 适用 |
|------|------|------|------|
| **LiteRT** | Android 官方、ANE 优化好 | LLM 生态较弱 | Gemma / 小模型 / 传统 CV |
| **llama.cpp** | 通用、GGUF 生态丰富 | 需要手动集成 | 跨平台本地 LLM |
| **MLC LLM** | 手机 NPU 优化强 | 模型支持有限 | 高性能端侧 LLM |
| **MediaPipe LLM** | 预封装、易用 | 仅支持特定模型 | 快速集成端侧 LLM |

---

## 8. 对比与选择

### 8.1 边缘推理框架对比

| 维度 | LiteRT | ONNX Runtime | MNN | NCNN | MLC LLM |
|------|--------|--------------|-----|------|---------|
| **Android** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **iOS** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **NPU 支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **LLM 支持** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **生态** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **国内支持** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

### 8.2 选型建议

| 场景 | 推荐 |
|------|------|
| Android 端 AI | LiteRT |
| iOS 端 AI | LiteRT / Core ML |
| 跨平台本地 LLM | llama.cpp |
| 手机端高性能 LLM | MLC LLM |
| 国内移动端 | MNN |
| 嵌入式 ARM | NCNN / LiteRT |
| 端侧 CV/NLP 小模型 | LiteRT |
| 端侧 Gemma/Phi | LiteRT / MediaPipe |

### 8.3 适用场景

| 场景 | LiteRT 优势 |
|------|------------|
| Android 应用内 AI | 官方支持、APK 体积小 |
| iOS 应用内 AI | Core ML Delegate 性能优秀 |
| 离线隐私保护 | 完全端侧运行 |
| 实时相机/语音 | 低延迟、低功耗 |
| 端侧小模型 | 量化成熟、Delegate 丰富 |

### 8.4 版本演进

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| TensorFlow Lite 1.0 | 2017 | 首个版本 |
| TFLite 2.0 | 2019 | 完整 Keras 支持 |
| TFLite 2.14 | 2023 | GPU / NNAPI 增强 |
| LiteRT 1.0 | 2024 | 品牌升级，Gemini 整合 |
| LiteRT 1.1 | 2025 | LLM Task API，更强量化 |
| LiteRT 1.2 | 2026 | 更多 PyTorch/JAX 转换支持 |

---

## 参考资源

- [LiteRT 官网](https://ai.google.dev/edge/litert)
- [LiteRT GitHub](https://github.com/google-ai-edge/litert)
- [TensorFlow Lite 文档](https://www.tensorflow.org/lite)
- [ai-edge-torch](https://github.com/google-ai-edge/ai-edge-torch)
- [MediaPipe LLM Task](https://ai.google.dev/edge/mediapipe/solutions/genai/llm_inference)

---

*Last updated: 2026-06-15*
*Version: 2.0.0*

## Related

- [[部署推理/Deployment_Fundamentals/Deployment_Inference.md|Deployment_Inference]]
- [[部署推理/Deployment_Fundamentals/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[部署推理/Deployment_Fundamentals/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[部署推理/Deployment_Fundamentals/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[部署推理/Inference_Engines/llama_cpp_Deep_Dive.md|llama_cpp_Deep_Dive]]
- [[部署推理/Inference_Engines/Ollama_Deep_Dive.md|Ollama_Deep_Dive]]
- [[部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide.md|LLM_Inference_Engine_Selection_Guide]]
