---
title: "ONNX 开放神经网络交换格式 (Open Neural Network Exchange)"
category: -concepts
tags: ["onnx", "model-format", "interoperability", "onnxruntime", "inference"]
relationships:
  - target: "概念/llm-quantization"
    type: related_to
  - target: "概念/tensorrt-llm"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "ONNX 是开放的神经网络模型交换格式——让模型在 PyTorch、TensorFlow、ONNX Runtime 等框架间自由迁移。ONNX Runtime 提供跨平台高性能推理，是 AI 模型部署的重要中间格式。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
---

# ONNX 开放神经网络交换格式

> **一句话理解**: ONNX 是"AI 模型的 PDF"——统一格式让模型在不同框架间自由迁移，ONNX Runtime 提供跨平台高性能推理。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **全称** | Open Neural Network Exchange |
| **发起者** | Microsoft + Facebook (2017) |
| **当前维护** | Linux Foundation AI |
| **格式** | 基于 Protocol Buffers 的二进制格式 |
| **核心价值** | 框架互操作 + 跨平台推理 |
| **生态** | ONNX Runtime + 硬件加速器 |

---

## 2. 核心价值

```
┌─────────────────────────────────────────┐
│          ONNX 解决问题                   │
├─────────────────────────────────────────┤
│                                         │
│  问题: 训练框架和推理框架不同            │
│                                         │
│  PyTorch (训练) ─→ ONNX ─→ 推理框架     │
│  TensorFlow     ─→ ONNX ─→ ONNX Runtime │
│  JAX            ─→ ONNX ─→ TensorRT     │
│  scikit-learn   ─→ ONNX ─→ OpenVINO     │
│                                         │
│  ONNX = AI 模型的"通用语言"             │
│                                         │
└─────────────────────────────────────────┘
```

### 为什么需要 ONNX

| 场景 | 没有 ONNX | 有 ONNX |
|------|-----------|---------|
| PyTorch 模型部署到 C++ | 需要 libtorch | 导出 ONNX + ONNX Runtime |
| 模型在边缘设备运行 | 框架不兼容 | ONNX Runtime Mobile |
| 多框架模型统一管理 | 各框架独立 | 统一格式 |
| 硬件加速 | 框架绑定 | EP (Execution Provider) 抽象 |

---

## 3. ONNX 格式结构

```
ONNX Model
├── graph (计算图)
│   ├── nodes (算子节点)
│   │   ├── op_type: MatMul, Add, Softmax...
│   │   ├── inputs: 输入张量名
│   │   └── outputs: 输出张量名
│   ├── initializers (权重张量)
│   ├── inputs (模型输入定义)
│   └── outputs (模型输出定义)
├── opset_import (算子集版本)
├── ir_version (IR 版本)
└── metadata (元信息)
```

### 支持的算子

| 类别 | 代表算子 |
|------|---------|
| **数学** | MatMul, Add, Mul, Sigmoid, Softmax |
| **卷积** | Conv, ConvTranspose, MaxPool |
| **注意力** | MultiHeadAttention (opset 22+) |
| **归一化** | BatchNorm, LayerNorm, GroupNorm |
| **控制流** | If, Loop, Scan |
| **序列** | SequenceAt, ConcatFromSequence |

---

## 4. ONNX Runtime

```
┌─────────────────────────────────────────┐
│        ONNX Runtime 架构                │
├─────────────────────────────────────────┤
│                                         │
│  ONNX Model (.onnx)                     │
│    ↓                                    │
│  Graph Optimization                     │
│    ├── 常量折叠                         │
│    ├── 算子融合                         │
│    ├── 死代码消除                       │
│    └── 布局优化                         │
│    ↓                                    │
│  Execution Provider (EP) 选择           │
│    ├── CPU EP (默认)                    │
│    ├── CUDA EP (NVIDIA GPU)             │
│    ├── TensorRT EP                      │
│    ├── OpenVINO EP (Intel)              │
│    ├── CoreML EP (Apple)                │
│    ├── DirectML EP (Windows GPU)        │
│    └── ROCm EP (AMD)                    │
│    ↓                                    │
│  执行结果                               │
│                                         │
└─────────────────────────────────────────┘
```

### 使用示例

```python
import onnxruntime as ort

# 加载模型
session = ort.InferenceSession(
    "model.onnx",
    providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
)

# 推理
outputs = session.run(
    None,  # 所有输出
    {"input_ids": input_ids, "attention_mask": attention_mask}
)
```

---

## 5. 从 PyTorch 导出 ONNX

```python
import torch
import torch.onnx

# 方式1: torch.onnx.export (传统)
model = MyModel()
dummy_input = torch.randn(1, 128)
torch.onnx.export(
    model, dummy_input, "model.onnx",
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}},
    opset_version=17,
)

# 方式2: torch.onnx.dynamo_export (推荐, PyTorch 2.x)
exported = torch.onnx.dynamo_export(model, dummy_input)
exported.save("model.onnx")

# 方式3: Optimum (HuggingFace 模型)
from optimum.onnxruntime import ORTModelForCausalLM
model = ORTModelForCausalLM.from_pretrained("gpt2", export=True)
model.save_pretrained("./onnx-model")
```

---

## 6. LLM + ONNX

### Optimum 生态

| 工具 | 功能 |
|------|------|
| **optimum** | HuggingFace ↔ ONNX 桥接 |
| **optimum-onnxruntime** | ONNX Runtime 推理 + 量化 |
| **optimum-intel** | Intel OpenVINO 加速 |
| **optimum-llama** | Llama 模型 ONNX 优化 |

### LLM ONNX 量化

```python
from optimum.onnxruntime import ORTQuantizer, AutoQuantizationConfig

quantizer = ORTQuantizer.from_pretrained("model-onnx")
qconfig = AutoQuantizationConfig.avx512_vnni(is_static=False)
quantizer.quantize(save_dir="./quantized-model", quantization_config=qconfig)
```

---

## 7. 与 GGUF / Safetensors 对比

| 格式 | 用途 | 生态 | 量化 |
|------|------|------|------|
| **ONNX** | 跨框架推理 | ONNX Runtime | INT8/FP16 |
| **GGUF** | llama.cpp 推理 | llama.cpp | Q4/Q5/Q8 |
| **Safetensors** | 安全权重存储 | HuggingFace | 无 |
| **TensorRT** | NVIDIA 推理 | TensorRT | INT8/FP16 |

---

## 8. 关键要点

1. **格式标准**：ONNX 是 AI 模型的事实交换标准，所有主流框架都支持
2. **ONNX Runtime 是推理引擎**：不只是格式转换，更是高性能推理运行时
3. **EP 抽象**：同一模型通过不同 Execution Provider 跑在不同硬件上
4. **图优化**：ONNX Runtime 自动做算子融合、常量折叠等优化
5. **边缘友好**：ONNX Runtime Mobile 支持手机、IoT 设备
6. **HuggingFace 桥接**：Optimum 库让 HF 模型一键导出 ONNX
