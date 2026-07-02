---
title: "Torch-TensorRT (PyTorch 到 TensorRT 编译器)"
category: -concepts
tags: ["nvidia", "tensorrt", "pytorch", "compilation", "inference-optimization", "gpu"]
relationships:
  - target: "_concepts/triton-server"
    type: related_to
  - target: "_concepts/onnx"
    type: related_to
  - target: "_concepts/flash-attn"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "NVIDIA 官方的 PyTorch 到 TensorRT 编译器，将 PyTorch 模型直接编译为 TensorRT 优化引擎，在保持 PyTorch 开发体验的同时获得 TensorRT 的推理性能。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: supporting
---

# Torch-TensorRT

[Torch-TensorRT](https://github.com/pytorch/TensorRT) 是 NVIDIA 与 PyTorch 团队合作开发的**PyTorch 到 TensorRT 编译器**。它将 PyTorch 模型（TorchScript 或 FX Graph）直接编译为 TensorRT 优化推理引擎，开发者无需导出 ONNX 中间格式，即可获得 TensorRT 的极致推理性能。是 NVIDIA GPU 上部署 PyTorch 模型的**官方推荐路径**。

## 核心架构

```
Torch-TensorRT 编译流程:

PyTorch 模型
    │
    ├─ TorchScript (torch.jit.script/trace)
    │       │
    │       ▼
    │  Torch-TensorRT Compiler
    │  ┌────────────────────────────┐
    │  │ 1. Graph Partitioning      │  将可编译部分切分
    │  │ 2. Layer Conversion        │  PyTorch → TRT 层
    │  │ 3. TensorRT Optimization   │  融合/量化/调优
    │  │ 4. Engine Generation       │  生成 TRT Engine
    │  └────────────────────────────┘
    │       │
    │       ▼
    │  Optimized Torch Module
    │  (可直接在 PyTorch 中使用)
    │
    └─ FX Graph (torch.fx)
            │
            ▼
        FX-TensorRT Compiler
        (更现代的编译路径)
```

## 核心特性

### 1. 两种编译模式

```python
import torch
import torch_tensorrt

model = MyModel().eval().cuda()

# 模式 1: TorchScript 编译
ts_model = torch.jit.script(model)
optimized = torch_tensorrt.compile(
    ts_model,
    inputs=[torch.randn(1, 3, 224, 224).cuda()],
    enabled_precisions={torch.float16},  # FP16 推理
    workspace_size=1 << 30               # 1GB workspace
)

# 模式 2: FX Graph 编译 (推荐)
from torch_tensorrt.fx import compile

optimized = compile(
    model,
    inputs=(torch.randn(1, 3, 224, 224).cuda(),),
    enabled_precisions={torch.float16}
)

# 优化后的模型仍然是 PyTorch Module
output = optimized(input_tensor)
```

### 2. 混合精度编译

```python
# FP16 混合精度（推荐，性能最佳）
optimized = torch_tensorrt.compile(
    model,
    inputs=[sample_input],
    enabled_precisions={torch.float16, torch.float32},
    # FP16 优先，不支持的层回退 FP32
)

# INT8 量化（极致压缩）
optimized = torch_tensorrt.compile(
    model,
    inputs=[sample_input],
    enabled_precisions={torch.int8},
    calibrator=my_calibrator,  # 校准数据集
)
```

### 3. 动态形状支持

```python
# 动态 batch size
optimized = torch_tensorrt.compile(
    model,
    inputs=[
        torch_tensorrt.Input(
            shape=(1, 3, 224, 224),     # min shape
            dtype=torch.float16
        )
    ],
    enabled_precisions={torch.float16},
    # 支持 dynamic shape profiles
)
```

### 4. 不支持层的回退

```
编译策略:

Torch-TensorRT 将模型层分为:
├── TRT 可编译层 → 编译为 TensorRT Engine (高性能)
└── TRT 不支持层 → 保留原始 PyTorch 算子 (兼容)

→ 混合执行: TRT Engine + PyTorch Fallback
→ 无需手动处理不支持的层
```

## 性能优化

### 典型加速比

| 模型 | FP32 PyTorch | FP16 TensorRT | 加速 |
|------|-------------|---------------|------|
| ResNet-50 | 1.0x | 3-5x | ✅ |
| BERT-Base | 1.0x | 2-3x | ✅ |
| Llama-7B | 1.0x | 2-4x | ✅ |
| YOLOv8 | 1.0x | 3-6x | ✅ |

### TensorRT 优化技术

| 优化 | 说明 |
|------|------|
| **层融合** | 将 Conv+BN+ReLU 融合为单层 |
| **内核调优** | 为特定 GPU 选择最优内核 |
| **精度校准** | INT8 量化校准 |
| **内存优化** | 重用中间缓冲区 |
| **动态形状** | 支持可变输入尺寸 |

## 与 ONNX → TensorRT 对比

| 维度 | Torch-TensorRT | ONNX → TensorRT |
|------|---------------|-----------------|
| **中间格式** | 无（直接编译） | ONNX |
| **开发体验** | 纯 PyTorch | PyTorch → ONNX → TRT |
| **调试** | PyTorch 调试 | ONNX 调试困难 |
| **层支持** | PyTorch Fallback | 无 Fallback |
| **部署复杂度** | 低 | 高（需 ONNX Runtime） |
| **性能** | 接近 TRT 原生 | TRT 原生 |
| **推荐场景** | 快速部署 | 跨框架部署 |

## 典型应用场景

- **实时推理**: 自动驾驶、视频分析的超低延迟推理
- **大规模服务**: 高吞吐量的在线推理服务
- **边缘部署**: Jetson 等边缘设备的模型优化
- **模型优化**: 训练后的推理性能优化

## 与 AI Stack 的集成

```
Torch-TensorRT 在 AI Stack 中的位置:

训练 (PyTorch/NeMo)
    │
    ▼
Torch-TensorRT 编译
    │
    ├─→ Triton Inference Server (在线服务)
    │       └─→ K8s 部署 (多副本 + GPU)
    │
    ├─→ 边缘部署 (Jetson)
    │       └─→ 本地推理 (无需联网)
    │
    └─→ 批处理 (离线推理)
            └─→ Spark/Ray 分布式
```

## K8s 部署

```yaml
# Triton + TensorRT Engine
apiVersion: apps/v1
kind: Deployment
metadata:
  name: triton-tensorrt
spec:
  template:
    spec:
      containers:
      - name: triton
        image: nvcr.io/nvidia/tritonserver:24.05-py3
        args: ["tritonserver", "--model-repository=/models"]
        resources:
          limits:
            nvidia.com/gpu: 1
        volumeMounts:
        - name: models
          mountPath: /models
      volumes:
      - name: models
        persistentVolumeClaim:
          claimName: tensorrt-models-pvc
```

## 安装

```bash
# pip (需匹配 CUDA/TRT 版本)
pip install torch-tensorrt

# 或 NVIDIA NGC 容器（推荐）
docker pull nvcr.io/nvidia/pytorch:24.05-py3
# 容器内已预装 torch + tensorrt + torch-tensorrt
```

## 参考资源

- [Torch-TensorRT GitHub](https://github.com/pytorch/TensorRT)
- [Torch-TensorRT 文档](https://pytorch.org/TensorRT/)
- [TensorRT 文档](https://developer.nvidia.com/tensorrt)
- [NVIDIA NGC](https://catalog.ngc.nvidia.com/)

## 相关概念

- [[_concepts/triton-server]] — NVIDIA Triton 推理服务器
- [[_concepts/onnx]] — ONNX 开放神经网络交换格式
- [[_concepts/flash-attn]] — Flash Attention 高效注意力内核
- [[_concepts/openvino]] — OpenVINO Intel 推理优化
