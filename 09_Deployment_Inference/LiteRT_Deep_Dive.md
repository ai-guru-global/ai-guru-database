# LiteRT / TensorFlow Lite: 边缘 AI 推理

> **一句话理解**: LiteRT (TensorFlow Lite) 让 AI 模型在边缘设备上高效运行——手机、IoT、嵌入式系统，延迟低、功耗小、完全离线。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3.架构设计
4. [快速开始](#4-快速开始)
5. [部署目标](#5-部署目标)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
LiteRT: 边缘 AI 推理
═══════════════════════════════════════════════════════════════════

定位: 在边缘设备上高效运行 ML 模型的推理框架

核心理念:
───────────────────────────────────────────────────────────────────
• 轻量: 极小的二进制文件
• 高效: 针对移动和嵌入式优化
• 多平台: Android/iOS/嵌入式/Linux
• 多语言: Python/C++/Java/Go
• 硬件加速: GPU/NPU/CPU
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **量化** | INT8/FP16/INT4 |
| **优化** | 算子融合、剪枝 |
| **硬件加速** | GPU/NPU/NNAPI |
| **委托** | GPU/CPU/XNNPACK |
| **委托器** | EdgeTPU/ANE/NNAPI |

---

## 2. 核心概念

### 2.1 转换流程

```
LiteRT 模型转换
═══════════════════════════════════════════════════════════════════

TensorFlow Model (.pb / SavedModel)
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│ LiteRT Converter                                            │
│                                                              │
│  • 去除冗余 ops                                             │
│  • 算子融合                                                 │
│  • 量化感知训练 (可选)                                      │
│  • 生成 TFLite Model (.tflite)                              │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
TFLite Model (.tflite)
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│ LiteRT Interpreter                                          │
│                                                              │
│  • 加载模型                                                 │
│  • 分配张量                                                 │
│  • 执行推理                                                 │
│  • 获取输出                                                 │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 优化技术

| 技术 | 说明 | 收益 |
|------|------|------|
| **量化** | INT8/FP16 | 4x 内存节省 |
| **算子融合** | Conv+BN+ReLU → Conv | 减少内存访问 |
| **剪枝** | 去除不重要权重 | 模型压缩 |
| **蒸馏** | 大模型→小模型 | 精度保持 |

---

## 3. 快速开始

### 3.1 模型转换

```python
import tensorflow as tf

# 加载 TensorFlow 模型
model = tf.saved_model.load('path/to/saved_model')

# 转换
converter = tf.lite.TFLiteConverter.from_saved_model('path/to/saved_model')

# 量化 (INT8)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.int8]

# 转换
tflite_model = converter.convert()

# 保存
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
```

### 3.2 Android 推理

```kotlin
// Android Kotlin
val model = ByteBuffer.loadFromFile("model.tflite")
val interpreter = Interpreter(model)

// 输入
val input = ByteBuffer.allocateDirect(224 * 224 * 3)
input.put(...)

// 输出
val output = Array(1) { FloatArray(1000) }

// 推理
interpreter.run(input, output)
```

### 3.3 iOS 推理

```swift
// iOS Swift
let modelPath = "model.tflite"
var interpreter: Interpreter

do {
    interpreter = try Interpreter(modelPath: modelPath)
} catch {
    print("Failed to create interpreter: \(error)")
}

// 输入
let input = try TensorData(buffer: inputBuffer)

// 输出
let output = try interpreter.output(at: 0)

// 推理
try interpreter.invoke()
```

---

## 4. 部署目标

### 4.1 Android

```gradle
// build.gradle
dependencies {
    implementation 'org.tensorflow:tensorflow-lite:2.14.0'
    // GPU 委托
    implementation 'org.tensorflow:tensorflow-lite-gpu:2.14.0'
}
```

### 4.2 Raspberry Pi

```python
# Raspberry Pi
import tflite_runtime.interpreter as tflite

interpreter = tflite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

input_index = interpreter.get_input_index()
output_index = interpreter.get_output_index()

# 设置输入
input_data = load_image()
interpreter.set_tensor(input_index, input_data)

# 推理
interpreter.invoke()

# 获取输出
output = interpreter.get_tensor(output_index)
```

---

## 5. 对比与选择

### 5.1 边缘推理框架对比

| 框架 | 设备 | 延迟 | 能耗 | 适用场景 |
|------|------|------|------|----------|
| **LiteRT** | Android/iOS | 低 | 低 | 移动端 |
| **ONNX Runtime** | 多平台 | 中 | 中 | 跨平台 |
| **MNN** | 移动端 | 低 | 低 | 国内移动 |
| **NCNN** | ARM | 极低 | 极低 | 嵌入式 |

---

## 参考资源

- [LiteRT GitHub](https://github.com/tensorflow/tflite-support)
- [LiteRT 文档](https://www.tensorflow.org/lite)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*