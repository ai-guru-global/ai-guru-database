---
title: "vLLM: 生产级 LLM 推理引擎"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "vllm", "llm", "paged-attention", "continuous-batching"]
summary: "> **一句话理解**: vLLM 是 UC Berkeley 出品的生产级 LLM 推理引擎——PagedAttention 技术让显存利用率从 20% 提升到 90%+，吞吐量行业标杆。"
created: "2026-05-31"
updated: "2026-06-15"
tier: core
aliases:
  - "Vllm Deep Dive"
  - "vLLM Deep Dive"
  - vLLM_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# vLLM: 生产级 LLM 推理引擎

> **一句话理解**: vLLM 是 UC Berkeley 出品的生产级 LLM 推理引擎——PagedAttention 技术让显存利用率从 20% 提升到 90%+，吞吐量行业标杆。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [生产部署](#5-生产部署)
6. [高级特性](#6-高级特性)
7. [生产调优](#7-生产调优)
8. [对比与选择](#8-对比与选择)

---

## 1. 概述

### 1.1 定位

```
vLLM: 生产级 LLM 推理引擎
═══════════════════════════════════════════════════════════════════

定位: UC Berkeley Sky Computing Lab 开源的高性能 LLM 推理与服务引擎

核心理念:
───────────────────────────────────────────────────────────────────
• 高效: PagedAttention 显存优化，利用率 90%+
• 快速: Continuous Batching + Chunked Prefill，吞吐量领先
• 简单: OpenAI 兼容 API，一行命令启动服务
• 开放: Apache 2.0 协议，社区最活跃的推理引擎
• 生产就绪: 量化、LoRA、多机多卡、K8s 原生支持
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **[[_concepts/paged-attention|PagedAttention]]** | 虚拟显存管理，消除 KV Cache 碎片 |
| **Continuous Batching** | 动态批处理，最大化 GPU 利用率 |
| **Chunked Prefill** | 大 prompt 分块，降低 TTFT 抖动 |
| **Prefix Caching** | 自动缓存共享前缀，多轮/RAG 加速 |
| **Speculative Decoding** | 推测解码，低延迟场景提速 1.5-2.5x |
| **Multi-LoRA** | 单实例服务数百个 LoRA adapter |
| **V1 Engine** | 2025 年全新执行引擎，端到端吞吐再提升 30%+ |
| **多模态** | 支持 Qwen2-VL、Llama 3.2 Vision、Pixtral 等 |
| **量化支持** | FP8/AWQ/GPTQ/INT8/FP16，覆盖主流方案 |
| **分布式** | Tensor Parallel / Pipeline Parallel / Data Parallel |

### 1.3 性能数据 (2026)

| 配置 | 模型 | 吞吐量 | 说明 |
|------|------|--------|------|
| H100-80GB | Llama 3.1 8B | 15,000+ tok/s | 高并发 decode |
| H100-80GB x4 | Llama 3.1 70B | 7,500+ tok/s | TP=4 |
| H100-80GB x8 | Llama 3.1 405B | 3,200+ tok/s | TP=8 |
| A100-80GB x4 | Qwen2-72B | 5,500+ tok/s | TP=4 |
| RTX 4090 24GB | Llama 3.1 8B | 4,500+ tok/s | AWQ 量化 |

---

## 2. 核心概念

### 2.1 PagedAttention 原理

```
传统 Attention vs PagedAttention
═══════════════════════════════════════════════════════════════════

传统方式 (连续内存分配):
───────────────────────────────────────────────────────────────────

请求1 KV Cache: [████████████████████████░░░░░░░░░] 浪费 30%
请求2 KV Cache: [████████████░░░░░░░░░░░░░░░░░░░] 浪费 50%
请求3 KV Cache: [████████████████████████████░░░] 浪费 20%
                              ↑ 碎片化严重

PagedAttention (分页管理):
───────────────────────────────────────────────────────────────────

Physical Memory: [Block0][Block1][Block2][Block3][Block4][Block5]
                      ↓       ↓       ↓       ↓
请求1 (逻辑):      Block0 → Block1 → Block3 (非连续但逻辑连续)
请求2 (逻辑):      Block2 → Block4
请求3 (逻辑):      Block0 → Block1 → Block5 (共享前缀)

关键优势:
• 显存利用率: 20-40% → 90%+
• 支持更多并发请求
• 减少碎片化
• 内部共享 (copy-on-write) 支持并行采样
```

### 2.2 Continuous Batching

```
传统 Static Batching vs Continuous Batching
═══════════════════════════════════════════════════════════════════

Static Batching (静态批):
───────────────────────────────────────────────────────────────────

Batch = [Req1, Req2, Req3]
Req1: ██████████░░  (10 tokens, 等待)
Req2: ██████░░░░░  (6 tokens, 等待)
Req3: ████████████  (12 tokens, 最慢)

问题: 所有请求必须等最慢的完成，GPU 空闲

Continuous Batching (连续批):
───────────────────────────────────────────────────────────────────

Step 1: Batch = [Req1, Req2, Req3]
Req1: ██████████ ✓ → 输出完成，释放
Req2: ██████ ✓ → 输出完成，释放
Req3: ████████████ ✓

Step 2: Batch = [Req4, Req5, Req3]
Req4: ██████████
Req5: ████████
Req3: ████████████ (继续)

优势:
• 请求完成立即释放，填充新请求
• GPU 利用率最大化
• 吞吐量提升 2-10x
```

### 2.3 Chunked Prefill

```
Chunked Prefill 原理
═══════════════════════════════════════════════════════════════════

无 Chunked Prefill:
───────────────────────────────────────────────────────────────────
长 prompt 一次性做完 prefill，decode 请求被阻塞，TTFT 抖动大

Batch = [Long_Prefill(4096 tokens), Decode_A, Decode_B]
              ↑ 占用整个 batch 很长时间

有 Chunked Prefill:
───────────────────────────────────────────────────────────────────
将长 prefill 拆成小块，与 decode 交错执行，延迟更稳定

Step 1: [Prefill_chunk_1, Decode_A, Decode_B]
Step 2: [Prefill_chunk_2, Decode_A, Decode_B, Decode_C]
Step 3: [Prefill_chunk_3, Decode_A, Decode_B, Decode_C]

效果:
• TTFT 更可预测
• 小 decode 请求不会被饿死
• 整体吞吐量不降反升
```

### 2.4 Prefix Caching (Automatic Prefix Caching)

```
自动前缀缓存
═══════════════════════════════════════════════════════════════════

请求1: system prompt + 用户问题 A
       [████████████████][████]
       ↑ 共享前缀        ↑ 不同后缀

请求2: system prompt + 用户问题 B
       [████████████████][████]
       ↑ 命中缓存        ↑ 只需计算

效果:
• RAG/多轮对话重复 system prompt 场景显著加速
• 首次 token 时间 (TTFT) 降低 30-70%
• 显存复用，支持更高并发
```

---

## 3. 架构设计

### 3.1 系统架构

```
vLLM 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        vLLM 架构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Frontend (API / LLM Engine)                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  OpenAI Compatible API     │    REST/gRPC              │   │
│   │  Streaming Support        │    Multi-Modal            │   │
│   │  Tokenizer & Detokenizer  │    Metrics (Prometheus)   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Scheduler (调度器)                          │   │
│   │  ├── Continuous Batching                                 │   │
│   │  ├── Chunked Prefill                                    │   │
│   │  ├── Block Manager (PagedAttention)                     │   │
│   │  └── Prefix Caching                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Worker / Model Runner                       │   │
│   │  ├── PagedAttention Kernel                              │   │
│   │  ├── FlashAttention / FlashInfer                        │   │
│   │  ├── Speculative Decoding                               │   │
│   │  └── Quantization (FP8/AWQ/GPTQ/INT8)                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Distributed Backend                         │   │
│   │  ├── Tensor Parallelism (TP)                            │   │
│   │  ├── Pipeline Parallelism (PP)                          │   │
│   │  └── Data Parallelism                                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 V1 Engine (新一代执行引擎)

```
vLLM V0 vs V1 Engine
═══════════════════════════════════════════════════════════════════

V0 Engine:
───────────────────────────────────────────────────────────────────
• Python 调度器 + CUDA graph 捕获
• 部分 overhead 在 Python 层
• 高并发下 CPU 可能成为瓶颈

V1 Engine (vLLM 0.8+ / 2025):
───────────────────────────────────────────────────────────────────
• 全新 C++/CUDA 执行核心
• 更激进的 batching 策略
• 更低的调度延迟
• 更好的多模态和 speculative decoding 支持
• 同硬件下吞吐提升 20-40%

启用方式:
VLLM_USE_V1=1 python -m vllm.entrypoints.openai.api_server ...
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 基础安装 (CUDA 12.1)
pip install vllm

# CUDA 11.8 版本
pip install vllm --extra-index-url https://download.pytorch.org/whl/cu118

# 源码安装
pip install -e .
```

### 4.2 启动服务

```bash
# 单卡启动
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --port 8000 \
    --gpu-memory-utilization 0.9 \
    --max-num-batched-tokens 4096 \
    --max-num-seqs 64

# 启用 V1 Engine
VLLM_USE_V1=1 python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --port 8000

# 多卡张量并行
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-70B-Instruct \
    --tensor-parallel-size 4 \
    --port 8000
```

### 4.3 API 调用

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed",
)

# 聊天完成
response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手"},
        {"role": "user", "content": "解释量子纠缠"}
    ],
    temperature=0.7,
    max_tokens=256,
)

print(response.choices[0].message.content)

# 流式输出
for chunk in client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True,
):
    print(chunk.choices[0].delta.content, end="")
```

### 4.4 量化模型部署

```bash
# AWQ 量化
python -m vllm.entrypoints.openai.api_server \
    --model casperhansen/llama-3.1-8b-instruct-awq \
    --quantization awq

# GPTQ 量化
python -m vllm.entrypoints.openai.api_server \
    --model TheBloke/Llama-2-7B-GPTQ \
    --quantization gptq

# FP8 (H100)
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --quantization fp8 \
    --kv-cache-dtype fp8
```

---

## 5. 生产部署

### 5.1 Docker 部署

```bash
# 拉取官方镜像
docker pull vllm/vllm-openai:latest

# 启动容器
docker run --runtime nvidia --gpus all \
    -p 8000:8000 \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    vllm/vllm-openai:latest \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --tensor-parallel-size 1 \
    --gpu-memory-utilization 0.9
```

### 5.2 Kubernetes 部署 (Helm)

```bash
# 添加 vLLM Helm 仓库
helm repo add vllm https://vllm-project.github.io/helm-charts
helm repo update

# 安装
helm install vllm vllm/vllm \
  --set model="meta-llama/Llama-3.1-8B-Instruct" \
  --set tensorParallelSize=1 \
  --set replicaCount=2 \
  --set resources.limits.nvidia.com/gpu=1
```

### 5.3 多机分布式

```bash
# Head 节点
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-405B-Instruct \
    --tensor-parallel-size 8 \
    --pipeline-parallel-size 2 \
    --port 8000

# 使用 Ray 后端管理多机
ray start --head
# worker 节点
ray start --address="<head-ip>:6379"
```

---

## 6. 高级特性

### 6.1 Multi-LoRA 服务

```bash
# 启动带多 LoRA 的服务
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --enable-lora \
    --lora-modules sft=sft-adapter rlhf=rlhf-adapter \
    --max-loras 8 \
    --max-lora-rank 64
```

```python
# 调用指定 LoRA
response = client.chat.completions.create(
    model="sft",  # 使用 sft LoRA
    messages=[...]
)
```

### 6.2 Speculative Decoding

```bash
# 使用小模型做 draft
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-70B-Instruct \
    --speculative-model meta-llama/Llama-3.1-8B-Instruct \
    --num-speculative-tokens 5 \
    --tensor-parallel-size 4
```

### 6.3 多模态推理

```python
# 使用 Qwen2-VL / Llama 3.2 Vision
response = client.chat.completions.create(
    model="Qwen/Qwen2-VL-7B-Instruct",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "描述这张图片"},
            {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
        ]
    }]
)
```

### 6.4 Disaggregated Serving (Prefill/Decode 分离)

```
Prefill-Decode 分离
═══════════════════════════════════════════════════════════════════

传统同构部署:
───────────────────────────────────────────────────────────────────
同一 GPU 既做 compute-bound prefill，又做 memory-bound decode
资源互相干扰，难以分别优化

分离部署:
───────────────────────────────────────────────────────────────────
Prefill 节点: H100 高算力，处理长 prompt
              ↓ KV Cache 通过网络传输
Decode 节点:  高显存带宽，专注 token 生成

优势:
• 各自独立扩缩容
• 延迟与吞吐分别优化
• 支持更大 batch size
```

---

## 7. 生产调优

### 7.1 关键参数

| 参数 | 作用 | 建议 |
|------|------|------|
| `--max-num-batched-tokens` | 最大 batch token 数 | 根据显存和场景调大 |
| `--max-num-seqs` | 最大并发序列数 | 高吞吐场景增大 |
| `--gpu-memory-utilization` | GPU 显存使用上限 | 0.85-0.95 |
| `--max-model-len` | 最大序列长度 | 按业务需求设置 |
| `--kv-cache-dtype` | KV Cache 精度 | fp8 可省 50% 显存 |
| `--enable-prefix-caching` | 前缀缓存 | RAG/多轮必开 |
| `--scheduling-policy` | 调度策略 | priority 适合 latency-sensitive |

### 7.2 监控指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| `vllm:gpu_cache_usage_perc` | KV Cache 占用率 | > 90% |
| `vllm:num_requests_running` | 运行中请求 | 持续满载需扩容 |
| `vllm:num_requests_waiting` | 等待请求 | > 10 需关注 |
| `vllm:time_to_first_token_seconds` | TTFT | P99 > 2s |
| `vllm:time_per_output_token_seconds` | TPOT | P99 > 200ms |

### 7.3 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| OOM | KV Cache 过大 | 降低 max-model-len / 开启 prefix caching |
| TTFT 抖动 | 长 prompt 阻塞 | 开启 chunked prefill |
| 吞吐低 | batch 太小 | 提高 max-num-batched-tokens |
| 单请求延迟高 | decode 阶段 | 启用 speculative decoding |

---

## 8. 对比与选择

### 8.1 与其他推理引擎对比

| 维度 | vLLM | SGLang | TensorRT-LLM | TGI | LMDeploy |
|------|------|--------|--------------|-----|----------|
| **吞吐量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **延迟 (TTFT)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **生态** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **量化** | FP8/AWQ/GPTQ/INT8 | FP8/AWQ | FP8/INT8 | AWQ/GPTQ/EETQ | AWQ/INT8/INT4 |
| **多 LoRA** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **K8s/监控** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 8.2 选型建议

| 场景 | 推荐 |
|------|------|
| 通用生产环境 | vLLM |
| 极致吞吐/多轮对话 | SGLang |
| 单请求最低延迟 | TensorRT-LLM |
| 紧耦合 Hugging Face 生态 | TGI |
| 中文场景/国产芯片 | LMDeploy |
| 本地快速原型 | Ollama |
| CPU/边缘设备 | llama.cpp |

### 8.3 版本演进

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.1 | 2023.6 | PagedAttention 论文开源 |
| v0.3 | 2024.2 | Continuous Batching、GPTQ/AWQ |
| v0.5 | 2024.8 | Speculative Decoding、Prefix Caching |
| v0.6 | 2024.12 | Multi-LoRA、Chunked Prefill |
| v0.8 | 2025.6 | V1 Engine 预览 |
| v1.0 | 2026.x | V1 Engine 默认、Disaggregated Serving |

---

## 参考资源

- [vLLM GitHub](https://github.com/vllm-project/vllm)
- [vLLM 文档](https://docs.vllm.ai/)
- [vLLM 博客](https://blog.vllm.ai/)
- [PagedAttention 论文](https://arxiv.org/abs/2309.06180)

---

*Last updated: 2026-06-15*
*Version: 2.0.0*

## Related

- [[10_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[10_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[10_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[10_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[10_Deployment_Inference/Inference_Engines/SGLang_Deep_Dive.md|SGLang_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/TensorRT_LLM_Deep_Dive.md|TensorRT_LLM_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/TGI_Deep_Dive.md|TGI_Deep_Dive]]
- [[10_Deployment_Inference/Inference_Engines/LMDeploy_Deep_Dive.md|LMDeploy_Deep_Dive]]
- [[12_Architecture_Infrastructure/Hardware_Compute/CDI_Deep_Dive.md|CDI 容器设备接口（GPU 容器接入）]]
- [[_synthesis/chinese-chips-inference|国产 AI 芯片 × 推理引擎: 硬件约束下的推理软件栈适配]]
