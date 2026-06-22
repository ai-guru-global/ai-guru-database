---
title: 模型服务
category: -concepts
tags: [serving, vllm, sglang, tensorrt, triton, ollama, llama-cpp, inference-engine]
relationships:
  - target: "[[_concepts/model-deployment]]"
    type: implements
  - target: "_concepts/model-compression"
    type: benefits_from
  - target: "_concepts/sglang"
    type: exemplified_by
  - target: "_concepts/tensorrt-llm"
    type: exemplified_by
  - target: "_concepts/dynamic-batch-scheduling"
    type: uses
sources:
  - 09_model-deployment_Inference/Deployment_Inference_2026.md
  - 10_Deployment_Inference/vLLM_Deep_Dive.md
  - 10_Deployment_Inference/SGLang_Deep_Dive.md
  - 10_Deployment_Inference/TensorRT_LLM_Deep_Dive.md
  - 10_Deployment_Inference/BentoML_Deep_Dive.md
  - 10_Deployment_Inference/Ollama_Deep_Dive.md
  - 10_Deployment_Inference/llm-architectures_cpp_Deep_Dive.md
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
updated: 2026-05-31T00:00:00Z
---

# 模型服务

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

- vLLM与TensorRT-LLM的性能差距在持续缩小，长期技术选型可能趋向统一
- 开源推理引擎的MoE支持仍在快速迭代中
- 多模态模型推理服务（图像+文本+音频混合）的标准化API尚未成熟

## 来源

- Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention," SOSP 2023
- Zheng et al., "SGLang: Efficient Execution of Structured Language Model Programs," 2024
- NVIDIA TensorRT-LLM Documentation

## Related

- [[_synthesis/serving-deployment]] — 模型服务 × 模型部署 (共享: serving, sglang, tensorrt, vllm)
- [[10_Deployment_Inference/Deployment_Inference]] — 模型部署与推理加速 (Deployment & Inference) (共享: serving, vllm)
- [[10_Deployment_Inference/Deployment_Inference_2026]] — 部署推理 2026 趋势 (共享: serving, vllm)
- [[10_Deployment_Inference/Deployment_Inference_for_dummy]] — 模型部署与推理加速 - 小白版 (共享: serving, vllm)
- [[12_Architecture_Infrastructure/Alibaba_Cloud_AI_Stack_Deep_Dive|阿里云 AI Stack]] — 专有云容器化推理服务部署
- [[_concepts/sglang]] — SGLang
- [[_concepts/tensorrt-llm]] — TensorRT-LLM
- [[_concepts/dynamic-batch-scheduling]] — 动态批调度
- [[_concepts/gguf]] — GGUF
