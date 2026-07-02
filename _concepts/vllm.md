---
title: "vLLM 高吞吐推理引擎"
tags: [vllm, inference-engine, llm-serving, paged-attention, kv-cache, continuous-batching]
aliases:
  - "vLLM"
  - "vllm-engine"
category: -concepts
sources:
  - 10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive.md
  - 10_Deployment_Inference/Inference_Engines/TGI_Deep_Dive.md
  - 10_Deployment_Inference/Inference_Engines/Modal_Deep_Dive.md
  - 10_Deployment_Inference/Inference_Engines/KServe_Deep_Dive.md
relationships:
  - target: "_concepts/llm-inference-engine"
    type: related_to
  - target: "_concepts/paged-attention"
    type: evolves_into
  - target: "_concepts/continuous-batching"
    type: core_technology
  - target: "_concepts/model-serving"
    type: belongs_to
summary: "vLLM 是 UC Berkeley 主导开源的高吞吐 LLM 推理引擎，通过 PagedAttention 与连续批处理将吞吐量较传统方案提升 14-24 倍，已成为开源 LLM 服务的事实标准。"
lifecycle: stable
tier: core
provenance:
  extracted: 0.65
  inferred: 0.30
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# vLLM 高吞吐推理引擎

## 一句话定义

**vLLM = PagedAttention + 连续批处理 + 分布式推理** —— 由 UC Berkeley Sky Computing Lab 于 2023 年开源的 LLM 推理引擎，针对 Transformer KV Cache 的内存浪费问题引入操作系统虚拟内存式的"分页管理"思路，把 LLM 服务的吞吐量较 HuggingFace Transformers 提升 **14-24 倍**，现已成为开源 LLM 部署的事实标准（v0.1 → v0.7 已迭代多个版本）。

## 核心创新：PagedAttention

传统 KV Cache 用连续显存存储每个请求的 Key/Value 张量，预分配 `max_seq_len` 长度，导致：

- **内存碎片**：实际生成 200 token，但预分配 2048 token → 浪费 90%
- **并发受限**：单卡只能服务少量请求
- **OOM 频发**：长序列请求直接撑爆显存

PagedAttention 把 KV Cache 切成**固定大小的"页"（block，通常 16 token）**，存放在非连续的显存池中，维护一张"页表"做逻辑到物理的映射：

```
请求 A 的 KV Cache:
  逻辑块 [0,1,2] → 物理块 [#7, #12, #3]
  逻辑块 [3,4]   → 物理块 [#9, #11]
请求 B 的 KV Cache:
  逻辑块 [0,1]   → 物理块 [#5, #8]
  共享逻辑块 [2] → 共享物理块 [#3]  ← Beam Search / Parallel Sampling 的 prefix 共享
```

**收益**：

| 指标 | 提升幅度 |
|------|---------|
| KV Cache 内存浪费 | 从 60-80% → <4% |
| 吞吐量 (vs HF Transformers) | **14-24×** |
| 单卡并发请求数 | 提升 5-10× |
| 长序列支持 | 可服务 32K+ 上下文 |

## 关键技术特性

### 1. 连续批处理（Continuous Batching）

与传统"静态批处理"（所有请求必须等最慢的完成才能出 batch）不同，vLLM 在每一步解码时**动态插入新请求、回收已完成请求的资源**：

```
时刻 T: [A正在生成, B正在生成, C等待中]   → 批处理大小 = 2
时刻 T+1: A完成 → 立即插入D  → 批处理大小仍 = 2
时刻 T+2: B完成 → 立即插入C和D → 批处理大小 = 2
```

GPU 利用率从 30-50% 提升到 70-90%。

### 2. 推测解码（Speculative Decoding）

内置 Medusa、EAGLE、n-gram 等多种 draft model 支持，可加速 1.8-3×。

### 3. 多模态与多 LoRA 支持

- 原生多模态（LLaVA、Qwen-VL、InternVL）
- **多 LoRA 动态加载**：单卡同时服务数十个微调模型（base 权重共享，LoRA 热切换）

### 4. 分布式推理

- **张量并行**（Tensor Parallelism）
- **流水线并行**（Pipeline Parallelism）
- v0.6+ 引入专家并行（Expert Parallelism，MoE 推理关键）

### 5. 量化支持

GPTQ、AWQ、bitsandbytes NF4、FP8（Hopper）、SmoothQuant，覆盖 INT4-INT8 全谱。

## 性能基准

| 引擎 | 吞吐量 (tokens/s) | 首 token 延迟 | 适用场景 |
|------|-------------------|---------------|---------|
| HF Transformers | 1× (基线) | 低 | 小流量、原型 |
| **vLLM** | **14-24×** | 中 | **生产级 LLM 服务** |
| TGI | 10-18× | 中 | HuggingFace 生态 |
| TensorRT-LLM | 18-30× | 低 | NVIDIA 极致优化 |
| SGLang | 12-20× | 中 | 复杂控制流、Agent |

## 部署形态

```python
# 1. Python API（最常用）
from vllm import LLM, SamplingParams

llm = LLM(model="Qwen/Qwen2.5-7B-Instruct",
          tensor_parallel_size=2,
          gpu_memory_utilization=0.9,
          max_model_len=32768)

outputs = llm.generate(["Hello, my name is"],
                       SamplingParams(temperature=0.8, max_tokens=100))
```

```bash
# 2. OpenAI 兼容 Server
vllm serve meta-llama/Llama-3-70B-Instruct \
  --tensor-parallel-size 4 \
  --max-model-len 8192 \
  --enable-lora \
  --lora-modules my-lora=/path/to/adapter

# 3. Kubernetes 部署
# 推荐配合 KServe / vLLM Operator / Triton Inference Server
```

## 与其他推理引擎的关系

- [[_concepts/llm-inference-engine]] — 概念族总览
- [[TGI_Deep_Dive]] — HuggingFace 系，Rust 内核，对小模型友好
- [[TensorRT_LLM_Deep_Dive]] — NVIDIA 极致优化，性能最高但灵活性低
- [[SGLang_Deep_Dive]] — UC Berkeley 同期作品，强在复杂控制流（Agent）
- [[KServe_Deep_Dive]] — Kubernetes 原生 serving 框架，常与 vLLM 搭配

## 何时选择 vLLM

✅ **推荐使用场景**：
- 开源 LLM 生产部署（Qwen、Llama、DeepSeek、Mistral）
- 高并发在线服务（聊天、Agent、批处理 API）
- 多 LoRA 热切换场景
- 多模态模型部署

⚠️ **可能不适合**：
- 极致延迟敏感（<10ms）→ TensorRT-LLM
- 闭源模型 API → 直接用 OpenAI/Claude SDK
- 极小流量（<10 QPS）→ HF Transformers 即可

## 发展趋势（2026）

- **MoE 推理原生支持**：DeepSeek-V3 / Mixtral 高效推理
- **PD 分离（Prefill-Decode Disaggregation）**：v0.7+ 引入，长短请求分离调度
- **CPU 推理**：vLLM-CPU 支持纯 CPU 部署
- **端到端多模态**：音频、视频统一调度

---

**参见**：[[vLLM_Deep_Dive]] · [[LLM_Inference_Deep_Dive]] · [[10_Deployment_Inference/Inference_Engines/README]] · [[10_Deployment_Inference/README|10_Deployment_Inference]]