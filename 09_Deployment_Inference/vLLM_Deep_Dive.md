# vLLM: 生产级 LLM 推理引擎

> **一句话理解**: vLLM 是 UC Berkeley 出品的生产级 LLM 推理引擎——PagedAttention 技术让显存利用率从 20% 提升到 90%+，吞吐量行业标杆。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
vLLM: 生产级 LLM 推理引擎
═══════════════════════════════════════════════════════════════════

定位: UC Berkeley 出品的生产级 LLM 推理引擎，PagedAttention 显存优化

核心理念:
───────────────────────────────────────────────────────────────────
• 高效: PagedAttention 显存优化 2-4 倍
• 快速: Continuous Batching 吞吐量领先
• 简单: OpenAI 兼容 API
• 开放: 完全开源，持续迭代
• 生产就绪: K8s 部署、监控完善
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **PagedAttention** | 虚拟显存管理，显存利用率 90%+ |
| **Continuous Batching** | 动态批处理，最大化 GPU 利用率 |
| **FlashAttention** | 高效 Attention 计算 |
| **FP8 支持** | H100 原生支持 |
| **Speculative Decoding** | 推测解码加速 |
| **OpenAI 兼容** | 兼容 Chat Completions API |

### 1.3 性能数据 (2026)

| 配置 | 吞吐量 | 说明 |
|------|--------|------|
| H100-80GB, Llama 3.1 8B | 12,553 tok/s | vLLM 基准 |
| H100-80GB, Llama 3.1 70B | 6,200 tok/s | TP=4 |
| A100-80GB, Qwen2-72B | 5,100 tok/s | TP=4 |

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
│   Frontend (API)                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  OpenAI Compatible API     │    REST/gRPC              │   │
│   │  Streaming Support        │    Auth/Quota             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Scheduler (调度器)                          │   │
│   │  ├── Continuous Batching                                 │   │
│   │  ├── Block Manager (PagedAttention)                     │   │
│   │  └── Memory Manager                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CUDA Kernels                                │   │
│   │  ├── PagedAttention                                     │   │
│   │  ├── FlashAttention                                     │   │
│   │  └── FP8 Quantization                                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Model Parallelism                          │   │
│   │  ├── Tensor Parallelism (TP)                            │   │
│   │  ├── Pipeline Parallelism (PP)                          │   │
│   │  └── Data Parallelism                                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install vllm

# 或源码安装
git clone https://github.com/vllm-project/vllm.git
cd vllm
pip install -e .
```

### 4.2 启动服务

```bash
# 启动 vLLM 服务器
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --port 8000 \
    --gpu-memory-utilization 0.9 \
    --max-num-batched-tokens 4096 \
    --max-num-seqs 32

# 多卡
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

### 4.4 使用量化模型

```bash
# INT8 量化
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --quantization awq

# GPTQ 量化
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --quantization gptq
```

---

## 5. 高级特性

### 5.1 _prefix_caching

```python
# 前缀缓存示例
# vLLM 会自动缓存重复的 prefix

response1 = client.chat.completions.create(
    model="...",
    messages=[
        {"role": "system", "content": "你是一个法律顾问"},  # 缓存
        {"role": "user", "content": "合同纠纷怎么处理"}
    ]
)

response2 = client.chat.completions.create(
    model="...",
    messages=[
        {"role": "system", "content": "你是一个法律顾问"},  # 命中缓存
        {"role": "user", "content": "知识产权怎么保护"}
    ]
)
```

### 5.2 speculative_decoding

```bash
# 启用推测解码
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --speculative-decoding \
    --num-speculative-tokens 5
```

### 5.3 Multi-LoRA

```python
# 加载多个 LoRA
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3.1-8B-Instruct \
    --lora-modules sft=sftadapter rlh=rlhadapter \
    --max-loras 8

# 调用指定 LoRA
response = client.chat.completions.create(
    model="sft",  # 使用 sft LoRA
    messages=[...]
)
```

---

## 6. 对比与选择

### 6.1 与其他推理引擎对比

| 维度 | vLLM | SGLang | TensorRT-LLM | LMDeploy |
|------|------|--------|--------------|-----------|
| **吞吐量** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **延迟** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **生态** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **量化** | FP8/AWQ/GPTQ | FP8/AWQ | FP8/INT8 | INT8/FP16 |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 通用生产环境 | vLLM |
| 多轮对话/RAG | SGLang |
| 单请求低延迟 | TensorRT-LLM |
| 中文场景 | LMDeploy / vLLM |

---

## 参考资源

- [vLLM GitHub](https://github.com/vllm-project/vllm)
- [vLLM 文档](https://docs.vllm.ai/)
- [vLLM 博客](https://blog.vllm.ai/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*