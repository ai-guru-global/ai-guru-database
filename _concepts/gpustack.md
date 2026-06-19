---
title: GPUStack
category: concepts
tags:
- deployment
- inference
- gpu-cluster
- maas
- gpustack
- model-serving
relationships:
- target: '_concepts/model-serving'
  type: implements
- target: '_concepts/model-deployment'
  type: enables
- target: '_concepts/continuous-batching'
  type: uses
- target: '_concepts/distributed-training'
  type: related_to
sources:
- 10_Deployment_Inference/GPUStack_Deep_Dive.md
- 10_Deployment_Inference/GPUStack_for_dummy.md
- 10_Deployment_Inference/vLLM_Deep_Dive.md
- 10_Deployment_Inference/SGLang_Deep_Dive.md
summary: GPUStack 是开源的 GPU 集群管理器与私有 MaaS 平台，支持 NVIDIA/AMD/昇腾/摩尔线程等异构 GPU，通过可插拔的 vLLM、SGLang、llama-box、MindIE 等后端运行 LLM、VLM、Embedding、Reranker、语音和图像模型，并提供 OpenAI 兼容 API。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: supporting
created: 2026-06-15 00:00:00+00:00
updated: 2026-06-15 00:00:00+00:00
---

# GPUStack

## 核心要点

- **GPUStack** 是面向 AI 模型推理的开源 GPU 集群管理器，同时也是一个轻量级私有 **Model-as-a-Service (MaaS)** 平台
- 支持 **异构 GPU 资源池化**：NVIDIA CUDA、AMD ROCm、Apple Metal、昇腾 CANN、海光 DTK、摩尔线程 MUSA 等
- 通过 **可插拔推理引擎** 自动或手动选择后端：vLLM、SGLang、llama-box、vox-box、昇腾 MindIE、TensorRT-LLM、自定义后端
- 支持 **单节点多卡** 与 **多节点分布式** 推理，覆盖从桌面开发到生产集群的完整生命周期
- 提供 **OpenAI 兼容 API**，可无缝对接 Dify、RAGFlow、LangChain、LlamaIndex 等应用框架
- 内置 **模型目录 (Model Catalog)**、智能调度、认证鉴权、负载均衡、自动故障恢复、Prometheus/Grafana 监控等企业级特性

## 关键组件

| 组件 | 说明 |
|------|------|
| **GPUStack Server** | 管理面，包含 API Server、Scheduler、Controllers、AI Gateway、SQL Database |
| **GPUStack Worker** | 推理面，运行 GPUStack Runtime、Serving Manager、Metric Exporter 和具体推理后端 |
| **Inference Backend** | 实际执行推理的引擎，如 vLLM、SGLang、llama-box |
| **Model Catalog** | 经 GPUStack 验证和预调的模型集合，支持 latency / throughput / standard 模式 |
| **AI Gateway** | 基于 Higress 的请求路由与负载均衡层 |

## 典型场景

- 企业构建 **私有 LLM / VLM / Embedding / Reranker 服务**，替代公有模型 API
- 异构 GPU 机群的 **统一调度与共享**，如实验室多机多卡环境
- **RAG 与 Agent 应用底座**：同时提供多种模型类型的统一推理入口
- 国产化硬件上的 AI 推理部署（昇腾、海光、摩尔线程等）

## 与相关概念的关系

```
GPUStack
├── 属于: 模型部署与推理 (Model Deployment & Inference)
├── 使用: 推理引擎 (vLLM / SGLang / llama.cpp)
├── 依赖: GPU 虚拟化 / 容器运行时
├── 服务于: RAG 系统、AI Agent、MaaS 平台
└── 对比: Ollama(单机简单) / BentoML(模型服务框架) / 原生 vLLM(纯引擎)
```

## 延伸阅读

- [[10_Deployment_Inference/GPUStack_Deep_Dive|GPUStack 深度解析]]
- [[10_Deployment_Inference/GPUStack_for_dummy|GPUStack 入门指南]]
- [[10_Deployment_Inference/vLLM_Deep_Dive|vLLM 深度解析]]
- [[10_Deployment_Inference/SGLang_Deep_Dive|SGLang 深度解析]]
- [[_concepts/model-serving|模型服务]]
- [[_concepts/model-deployment|模型部署]]
