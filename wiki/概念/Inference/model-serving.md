---
title: 模型服务
category: -concepts
tags: [serving, vllm, sglang, tensorrt, triton, ollama, llama-cpp, inference-engine]
relationships:
  - target: "[[概念/model-deployment]]"
    type: implements
  - target: "概念/model-compression"
    type: benefits_from
  - target: "概念/sglang"
    type: exemplified_by
  - target: "概念/tensorrt-llm"
    type: exemplified_by
  - target: "概念/dynamic-batch-scheduling"
    type: uses
sources:
  - 09_model-deployment_Inference/Deployment_Inference_2026.md
  - 10_部署推理/02_推理引擎/vLLM_Deep_Dive.md
  - 10_部署推理/02_推理引擎/SGLang_Deep_Dive.md
  - 10_部署推理/02_推理引擎/TensorRT_LLM_Deep_Dive.md
  - 10_部署推理/02_推理引擎/BentoML_Deep_Dive.md
  - 10_部署推理/02_推理引擎/Ollama_Deep_Dive.md
  - 10_部署推理/llm-architectures_cpp_Deep_Dive.md
summary: 模型服务框架是连接AI模型与业务应用的桥梁。2026年GPU推理三强鼎立：vLLM以PagedAttention实现高吞吐、TensorRT-LLM提供NVIDIA极致低延迟优化、SGLang擅长结构化生成。CPU/本地场景有Ollama（易用）和llama.cpp（极致量化）。BentoML提供统一的模型打包部署框架。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-07-21
aliases:
  - "Model Serving"
  - "model serving"
  - "模型服务"

name_zh: "模型服务"
---
# 模型服务

> 中文简称：模型服务

> 模型服务框架是连接 AI 模型与业务应用的桥梁。选对引擎比堆 GPU 更重要。

## 核心要点

- **vLLM**以PagedAttention和Continuous Batching为核心，提供OpenAI兼容API，是2026年高吞吐服务的默认选择
- **TensorRT-LLM**通过NVIDIA底层优化（Kernel Fusion/FP8/Weight-Only ai-hardware）实现最低延迟
- **SGLang**通过RadixAttention和压缩有限状态机实现高效结构化生成（JSON/正则约束）
- **本地推理**：Ollama一键运行、llama.cpp极致量化（Q2_K到Q8_0）、BentoML统一打包部署

## 详细内容

### GPU推理引擎对比

| 引擎 | 核心技术 | 吞吐量 | 延迟 | 易用性 | 最佳场景 |
|------|---------|-------|------|--------|---------|
| **vLLM** | PagedAttention + Continuous Batching | 极高 | 中 | 高 | 高并发API服务 |
| **TensorRT-LLM** | Kernel Fusion + FP8 + Inflight Batching | 高 | 极低 | 中 | 低延迟生产部署 |
| **SGLang** | RadixAttention + FSM约束 | 高 | 低 | 高 | 结构化输出 |
| **TGI** | model-training + Watermark | 中高 | 中 | 极高 | HuggingFace生态 |

### vLLM详解

vLLM的PagedAttention将KV Cache分成固定大小的block（默认16 tokens），通过block table映射逻辑block到物理block，实现按需分配和零碎片。Continuous Batching在每次迭代时动态调度：新请求加入running队列、已完成请求移出、抢占机制在显存不足时暂停低优先级请求。

关键配置：`--tensor-parallel-size`（TP跨GPU）、`--gpu-memory-utilization`（默认0.9）、`--max-model-len`（最大序列长度）、`--enable-prefix-caching`（前缀缓存加速多轮对话）。支持Multi-LoRA同时服务多个适配器。

### TensorRT-LLM详解

NVIDIA的极致优化引擎，将模型编译为TensorRT Engine。核心技术：Weight-Only INT8/INT4量化（权重低精度、激活保持高精度）、FP8 GEMM（Hopper架构）、Kernel Fusion（将LayerNorm+GEMM+Activation融合为单个kernel）、Inflight Batching（类似Continuous Batching）。

编译阶段较慢（数十分钟到数小时），但推理性能最优。适合对延迟敏感的生产部署，如实时对话、搜索引擎。

### SGLang详解

SGLang的RadixAttention用Radix Tree缓存和复用KV Cache前缀，对多轮对话和重复prompt-engineering效果显著。压缩有限状态机（Compressed FSM）实现高效的结构化约束生成，确保输出符合JSON Schema或正则表达式。

### 本地/边缘推理

**Ollama**提供`ollama run llama3`式极简体验，自动管理模型下载、GPU检测和推理运行。底层基于llama.cpp，支持GGUF格式量化模型。

**llama.cpp**是C/C++实现的LLM推理库，支持GGUF格式的Q2_K到Q8_0量化等级。纯CPU运行或CPU+GPU混合，适合资源受限环境。量化等级选择：Q4_K_M（4-bit推荐，质量/速度平衡）、Q5_K_M（5-bit，更高质量）、Q8_0（8-bit，接近FP16质量）。

**BentoML**提供统一的模型打包和部署框架，支持任意框架训练的模型。通过Bento将模型、代码、依赖打包为可部署单元，支持Docker容器化和云平台一键部署。

## 开放问题

- vLLM 与 TensorRT-LLM 的性能差距在持续缩小，长期技术选型可能趋向统一
- 开源推理引擎的 MoE 支持仍在快速迭代中
- 多模态模型推理服务（图像+文本+音频混合）的标准化 API 尚未成熟

## 选型决策指南

```
场景判断:
├─ 高并发 API 服务？ → vLLM（默认选择）
├─ 极低延迟生产？ → TensorRT-LLM
├─ 结构化输出 (JSON)？ → SGLang
├─ HuggingFace 生态？ → TGI
├─ 本地/边缘？ → Ollama / llama.cpp
└─ 统一打包部署？ → BentoML
```

## 生产部署架构

```
Client → API Gateway / Load Balancer
              ↓
         Inference Service (vLLM/SGLang/TRT-LLM)
              ├─ Model Weights (GPU HBM)
              ├─ KV Cache Manager
              ├─ Continuous Batcher
              └─ Tokenizer
              ↓
         Monitoring (Prometheus + Grafana)
              ├─ TTFT / TPOT / QPS
              ├─ KV Cache Utilization
              └─ GPU Utilization
```

## 生产最佳实践

1. **先 vLLM 后优化**: 先用 vLLM 跑通，确认瓶颈后再考虑 TensorRT-LLM
2. **开启前缀缓存**: 多轮对话/Agent 场景必须启用
3. **FP8 量化**: H100+ 硬件首选 FP8，几乎无损且吐吐提升 50%
4. **监控先行**: 部署前必须接入 TTFT/TPOT/KV Cache 监控
5. **资源预留**: GPU 显存利用率不超过 90%，留余量给抢占
6. **多副本 + LB**: 生产环境至少 2 副本，配合 Least-Load 负载均衡

## 来源

- Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention," SOSP 2023
- Zheng et al., "SGLang: Efficient Execution of Structured Language Model Programs," 2024
- NVIDIA TensorRT-LLM Documentation

## Related

- [[概念/Inference/sglang|SGLang]]
- [[概念/Inference/tensorrt-llm|TensorRT-LLM]]
- [[概念/Inference/request-scheduling|请求调度]]
- [[概念/Inference/inference-autoscaling|推理扩缩容]]
- [[概念/Inference/prefix-caching|前缀缓存]]
- [[概念/Inference/gguf|GGUF]]
- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM 深度解析]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/专有云/01_阿里云_AI技术栈_深入分析|阿里云 AI Stack]]

## 模型服务引擎对比 (2026)

| 引擎 | 性能 | 易用性 | 硬件 | 特色 | 适用 |
|------|------|--------|------|------|------|
| **vLLM** | 高 | 高 | NVIDIA/AMD | PagedAttention | 通用服务 |
| **SGLang** | 高 | 高 | NVIDIA | RadixAttention | 结构化生成 |
| **TensorRT-LLM** | 极致 | 低 | NVIDIA | 编译优化 | 极致性能 |
| **TGI** | 中 | 高 | NVIDIA/AMD | HF 生态 | 快速部署 |
| **llama.cpp** | 中 | 极高 | 全平台 | GGUF | 边缘/本地 |
| **LMDeploy** | 高 | 中 | NVIDIA | TurboMind | 国产模型 |

## 模型服务架构全景

```
客户端 → API Gateway → 负载均衡 → 推理引擎集群
                                      ├── vLLM Instance 1
                                      ├── vLLM Instance 2
                                      └── vLLM Instance N

关键组件:
├── 模型加载: SafeTensors/GGUF/TensorRT Engine
├── 请求调度: Continuous Batching
├── 显存管理: PagedAttention / KV Cache
├── 并行策略: TP (Tensor Parallel) / PP (Pipeline Parallel)
└── 监控: Prometheus + Grafana
```

## 生产最佳实践

1. **通用服务选 vLLM/SGLang**：生态最成熟，部署最简单
2. **极致性能选 TensorRT-LLM**：吐吐量要求极高时使用
3. **边缘/本地选 llama.cpp**：无 GPU 或资源受限场景
4. **多副本高可用**：每个模型至少 2 个副本
5. **健康检查 + 自动重启**：异常实例自动摘除和恢复

## 延伸阅读

- [[概念/Inference/continuous-batching|连续批处理]] — 批处理优化
- [[概念/Inference/model-routing|模型路由]] — 路由策略
- [[概念/Inference/inference-autoscaling|扩缩容]] — 弹性伸缩
- [[概念/Inference/model-gateway|AI Gateway]] — 网关层

> ℹ️ 模型服务是 LLM 生产化的核心环节，引擎选择直接影响性能和成本。

## 2026 模型服务生态

| 服务方案 | 特点 | 适用场景 | 状态 |
|----------|------|----------|------|
| **vLLM** | 开源最流行，PagedAttention | 通用生产 | GA |
| **SGLang** | RadixAttention，前缀复用 | 高并发 | GA |
| **TensorRT-LLM** | NVIDIA 极致性能 | 延迟敏感 | GA |
| **TGI** | HuggingFace 官方 | HF 生态 | GA |
| **Together AI** | 托管服务 | 无运维团队 | GA |
