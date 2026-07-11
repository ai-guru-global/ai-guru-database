---
title: "LLM Inference Engine（LLM 推理引擎）"
category: -concepts
tags: [llm-inference-engine, vllm, tgi, sglang, tensorrt-llm, inference]
aliases:
  - "LLM Inference Engine"
  - "推理引擎"
  - "Inference Engine"
relationships:
  - target: "概念/vllm"
    type: example
  - target: "概念/inference-autoscaling"
    type: integrates_with
sources:
  - 部署推理/Inference_Engines/
summary: "LLM Inference Engine（推理引擎）是优化 LLM 推理性能与吞吐的服务系统，通过 PagedAttention、连续批处理、推测解码等技术将吞吐量提升数倍到数十倍，是 LLM 生产部署的核心组件。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-06-24
---

# LLM Inference Engine（LLM 推理引擎）

## 核心要点

- **定义**：专门优化 LLM 推理（Prefill + Decode）的服务系统，区别于通用 HuggingFace Transformers。
- **核心优化技术**：
  - **PagedAttention**：KV Cache 分页管理（vLLM）
  - **连续批处理（Continuous Batching）**：动态插入/移除请求
  - **推测解码（Speculative Decoding）**：draft model + verify
  - **KV Cache 优化**：GQA / MLA / 共享 prefix
  - **量化**：INT4 / INT8 / FP8
  - **Flash Attention**：IO 感知的精确注意力
- **核心能力**：
  - OpenAI 兼容 API
  - 流式输出（SSE）
  - 动态批处理
  - 多 GPU 张量并行
  - 多 LoRA 热切换
  - Function Calling

## 一句话解释

> Inference Engine = "为 LLM 推理而生的服务运行时"；比裸 Transformers 快 10-30x，是生产 LLM 服务的事实标准。

## 主流引擎对比

| 引擎 | 提供方 | 吞吐量（vs HF） | 强项 | 弱项 |
|------|--------|----------------|------|------|
| **vLLM** | UC Berkeley | 14-24x | 通用、生产稳定 | 启动稍慢 |
| **TGI** | HuggingFace | 10-18x | Rust 内核、HuggingFace 生态 | 多模态弱 |
| **TensorRT-LLM** | NVIDIA | 18-30x | NVIDIA 极致优化 | 配置复杂、灵活性低 |
| **SGLang** | UC Berkeley | 12-20x | 复杂控制流、Agent 友好 | 生态新 |
| **LMDeploy** | 商汤 | 10-20x | 中文优化、TurboMind | 国际生态弱 |
| **llama.cpp** | 开源社区 | 1-3x | CPU / 边缘 | 性能有限 |
| **MLC LLM** | Apache | 5-10x | 端侧 / 移动端 | 模型少 |

## 核心架构组件

```
┌─────────────────────────────────────────────────┐
│            LLM Inference Engine                 │
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐ │
│  │   Scheduler（调度器）                     │ │
│  │   - 连续批处理                            │ │
│  │   - 请求优先级                            │ │
│  │   - Prefix 共享                           │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │   KV Cache Manager                       │ │
│  │   - PagedAttention                        │ │
│  │   - 块分配 / 回收                        │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │   Executor（执行器）                     │ │
│  │   - 模型前向                             │ │
│  │   - 张量并行 / 流水线并行               │ │
│  │   - 推测解码                             │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## 何时使用

✅ **推荐**：
- 生产级 LLM 服务（QPS > 1）
- 需优化 GPU 利用率
- 长上下文 / 高并发

⚠️ **不推荐**：
- 原型 / Demo（HF Transformers 即可）
- 极小流量（< 10 QPS）

## 选型决策

```
性能优先？
├── 是 → TensorRT-LLM（NVIDIA）或 SGLang
├── 通用 + 生态 → vLLM
├── 国产 / 中文 → LMDeploy
├── 多模态 → vLLM（已支持 LLaVA / Qwen-VL）
└── 边缘 / CPU → llama.cpp
```

## Related

- [[概念/vllm]] — vLLM（最流行）
- [[概念/inference-autoscaling]] — 推理扩缩容
- [[概念/observability]] — 推理可观测性
- [[部署推理/Inference_Engines/index]] — 推理引擎章节- [[概念/cuda-graph]] — Cuda Graph
- [[概念/inference-performance-gaps]] — Inference Performance Gaps
- [[概念/model-routing]] — Model Routing
- [[概念/request-scheduling]] — Request Scheduling

## See Also (深度专题)

- [[../../大模型/LLM_Inference/LLM_Inference_Deep_Dive|LLM 推理深度解析]] — vLLM/TensorRT-LLM/SGLang 等推理引擎的架构与优化
- [[../../大模型/LLM_Deployment/LLM_Production_Deployment_Runbook|LLM 生产部署 Runbook]] — 推理引擎的生产环境选型与运维
