---
title: "Triton Inference Server (NVIDIA Triton Inference Server)"
category: -concepts
tags: ["triton", "nvidia", "inference-server", "model-serving", "multi-framework", "gpu-inference"]
relationships:
  - target: "_concepts/tensorrt-llm"
    type: related_to
  - target: "_concepts/onnx"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Triton Inference Server 是 NVIDIA 开源的模型推理服务——支持多框架后端（TensorRT、ONNX、PyTorch、TF），提供动态批处理、模型并发、模型管理和 gRPC/HTTP API。是企业级 AI 推理的生产标准。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: reviewed
tier: core
---

# Triton Inference Server

> **一句话理解**: Triton 是"AI 模型的 Nginx"——高性能推理服务器，支持多框架后端、动态批处理、模型并发，用 gRPC/HTTP 对外提供推理 API。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发商** | NVIDIA |
| **开源协议** | BSD |
| **GitHub** | 12K+ ⭐ |
| **语言** | C++ (核心) + Python (后端) |
| **定位** | 企业级模型推理服务器 |
| **核心价值** | 框架无关 + 高吞吐 + 生产级 |

---

## 2. 核心架构

```
┌─────────────────────────────────────────┐
│        Triton Inference Server          │
├─────────────────────────────────────────┤
│                                         │
│  API 层                                 │
│    ├── HTTP/REST (端口 8000)            │
│    ├── gRPC (端口 8001)                 │
│    └── Metrics (Prometheus, 端口 8002)  │
│                                         │
│  调度器                                 │
│    ├── 动态批处理 (Dynamic Batching)    │
│    ├── 序列批处理 (Sequence Batching)   │
│    └── 优先级队列                       │
│                                         │
│  推理后端 (Backend)                     │
│    ├── TensorRT (NVIDIA GPU 最优)       │
│    ├── ONNX Runtime                     │
│    ├── PyTorch (TorchScript)            │
│    ├── TensorFlow (SavedModel)          │
│    ├── Python (自定义推理逻辑)          │
│    ├── OpenVINO (Intel 硬件)            │
│    └── vLLM (LLM 推理)                  │
│                                         │
│  模型仓库 (Model Repository)            │
│    └── 文件系统 / S3 / GCS / Azure      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 模型仓库结构

```
model_repository/
├── llama-3-8b/              # 模型名
│   ├── config.pbtxt         # 模型配置
│   ├── 1/                   # 版本 1
│   │   └── model.plan       # TensorRT 引擎
│   └── 2/                   # 版本 2
│       └── model.plan
├── resnet-50/
│   ├── config.pbtxt
│   └── 1/
│       └── model.onnx       # ONNX 格式
└── bert-qa/
    ├── config.pbtxt
    └── 1/
        └── model.py         # Python 后端
```

### 模型配置示例

```protobuf
# config.pbtxt
name: "llama-3-8b"
platform: "tensorrt_plan"
max_batch_size: 8

input [
  { name: "input_ids", data_type: TYPE_INT64, dims: [-1] }
  { name: "attention_mask", data_type: TYPE_INT64, dims: [-1] }
]
output [
  { name: "logits", data_type: TYPE_FP32, dims: [-1, 32000] }
]

dynamic_batching {
  preferred_batch_size: [4, 8]
  max_queue_delay_microseconds: 1000
}

instance_group [
  { count: 2, kind: KIND_GPU, gpus: [0, 1] }
]
```

---

## 4. 核心特性

### 4.1 动态批处理

```
请求1 ──┐                    ┌── GPU 推理 (batch=4)
请求2 ──┼── 合并为一个 batch ──┤
请求3 ──┤                    │
请求4 ──┘                    └── 返回各请求结果

吞吐量提升 2-4 倍（相比逐请求推理）
```

### 4.2 模型并发

| 特性 | 说明 |
|------|------|
| **多实例** | 同一模型加载到多个 GPU 上并行推理 |
| **多版本** | 同时服务模型的不同版本，灰度发布 |
| **多模型** | 多个模型同时服务，共享 GPU 资源 |
| **集成模型** | 多个模型组成 DAG Pipeline（前处理→推理→后处理） |

### 4.3 模型管理

```bash
# 启动服务（自动加载模型仓库）
tritonserver --model-repository=/models

# 运行时加载/卸载模型（REST API）
curl -X POST localhost:8000/v2/repository/models/llama-3-8b/load
curl -X POST localhost:8000/v2/repository/models/llama-3-8b/unload

# 查看模型状态
curl localhost:8000/v2/models/llama-3-8b
```

---

## 5. 客户端调用

```python
import tritonclient.grpc as grpcclient

client = grpcclient.InferenceServerClient("localhost:8001")

# 构造请求
inputs = [
    grpcclient.InferInput("input_ids", [1, 128], "INT64"),
    grpcclient.InferInput("attention_mask", [1, 128], "INT64"),
]
inputs[0].set_data_from_numpy(input_ids)
inputs[1].set_data_from_numpy(attention_mask)

# 推理
result = client.infer("llama-3-8b", inputs)
logits = result.as_numpy("logits")
```

---

## 6. 与其他推理服务对比

| 特性 | Triton | vLLM | TGI | BentoML |
|------|--------|------|-----|---------|
| **多框架** | ✅ 6+ 后端 | LLM 专用 | LLM 专用 | 通用 |
| **动态批处理** | ✅ 内置 | ✅ PagedAttention | ✅ | ✅ |
| **LLM 推理** | ✅ vLLM 后端 | ★★★★★ 最强 | ★★★★☆ | ✅ |
| **传统 ML** | ✅ | ❌ | ❌ | ✅ |
| **模型管理** | ✅ 仓库式 | 单模型 | 单模型 | Registry |
| **企业级** | ★★★★★ | ★★★★☆ | ★★★☆☆ | ★★★★☆ |

---

## 7. AI Stack 中的定位

```
┌─────────────────────────────────────────┐
│     AI 推理服务选型                     │
├─────────────────────────────────────────┤
│                                         │
│  Triton  ← 企业多模型统一服务 ★        │
│  vLLM    ← LLM 高性能推理              │
│  TGI     ← HuggingFace 生态 LLM 推理   │
│  Ollama  ← 本地 LLM 体验               │
│  SGLang  ← 高吞吐 LLM 推理             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. 关键要点

1. **框架无关**：TensorRT / ONNX / PyTorch / TF / Python 全支持，一个服务管所有模型
2. **动态批处理**：自动合并并发请求为 batch，GPU 利用率最大化
3. **模型仓库**：版本管理 + 热加载，支持 CI/CD 式模型部署
4. **多 GPU 多模型**：模型实例可分布在多张 GPU 上，负载均衡
5. **NVIDIA 官方**：与 TensorRT、CUDA 深度集成，NVIDIA GPU 上的标准推理方案
6. **LLM 集成**：可通过 vLLM 后端或 TensorRT-LLM 引擎服务大模型
