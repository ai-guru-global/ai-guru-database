---
title: "Triton Inference Server"
category: -concepts
tags: ["triton", "nvidia", "inference-server", "model-serving", "tensorrt", "onnx", "pytorch", "multi-framework"]
relationships:
  - target: "_concepts/model-serving"
    type: extends
  - target: "_concepts/tensorrt-llm"
    type: related_to
  - target: "_concepts/vllm"
    type: related_to
  - target: "_concepts/kserve"
    type: related_to
sources:
  - 部署推理/Inference_Engines/Triton_Inference_Server_Deep_Dive.md
summary: "Triton Inference Server 是 NVIDIA 开源的高性能推理服务框架，支持 TensorRT、PyTorch、ONNX、TensorFlow 等多种后端，提供动态批处理、并发模型执行和多 GPU 多模型服务。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Triton

---
# Triton Inference Server

> NVIDIA 的「多模型推理网关」——一个服务同时跑 TensorRT、PyTorch、ONNX 等多种模型。

---

## 1. 一句话定义

**Triton Inference Server** 是 NVIDIA 开源的**高性能推理服务框架**，支持 TensorRT、TensorFlow、PyTorch、ONNX、OpenVINO、Python 等多种后端。它提供动态批处理（Dynamic Batching）、并发模型执行、多 GPU 多模型服务、gRPC/HTTP 接口和模型管理，是企业级多模型推理平台的常用选择。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **多框架后端** | TensorRT、PyTorch、ONNX、TensorFlow、Python |
| **动态批处理** | 自动合并请求提升吞吐 |
| **并发模型执行** | 同一 GPU 上同时跑多个模型 |
| **模型集成（Ensemble）** | 流水线式模型组合 |
| **多 GPU/多节点** | 支持跨 GPU 和跨节点部署 |
| **模型版本管理** | 热更新、A/B 测试 |
| **指标暴露** | Prometheus metrics |

---

## 3. 架构组件

```
Client (HTTP/gRPC)
    │
    ▼
Triton Server
  ├── Model Repository
  ├── Backend (TensorRT / PyTorch / ONNX)
  ├── Dynamic Batcher
  ├── Scheduler
  └── Metrics Endpoint
```

---

## 4. 典型场景

1. **多模型统一服务**：一个入口服务 CV、NLP、推荐模型。
2. **TensorRT-LLM 推理**：Triton 作为 TensorRT-LLM 的服务化封装。
3. **模型 A/B 测试**：通过版本控制切换模型。
4. **KServe 后端**：作为 KServe 的 runtime 使用。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **TensorRT-LLM** | Triton 可作为其服务层 |
| **vLLM / TGI** | 都是推理服务，Triton 更偏企业多框架 |
| **KServe** | KServe 可调用 Triton 后端 |
| **NVIDIA GPU Operator** | 提供底层 GPU 驱动支持 |

---

## 6. 优势与局限

### 优势
- 多框架统一服务。
- 企业级特性完整。
- 与 NVIDIA 软硬件栈优化好。

### 局限
- 配置复杂，学习曲线陡。
- 对非 NVIDIA 硬件支持有限。
- LLM 专用优化不如 vLLM/TGI。

---

## Related

- [[部署推理/Inference_Engines/Triton_Inference_Server_Deep_Dive]] — Triton Inference Server 深度解析
- [[_concepts/model-serving]] — 模型服务
- [[_concepts/tensorrt-llm]] — TensorRT-LLM
- [[_concepts/kserve]] — KServe
- [[_concepts/vllm]] — vLLM
