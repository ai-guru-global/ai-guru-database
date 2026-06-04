---
title: "SGLang: 高性能 LLM 推理框架"
category: "09-deployment-inference"
tags: ["deployment", "inference", "serving", "vllm", "llm"]
summary: "> **一句话理解**: SGLang 是 2026 年性能最强的 LLM 推理框架——通过 RadixAttention 技术实现前缀缓存和高速多轮对话，吞吐量领先 vLLM 29%。"
created: "2026-05-31"
updated: "2026-05-31"
---

# SGLang: 高性能 LLM 推理框架

> **一句话理解**: SGLang 是 2026 年性能最强的 LLM 推理框架——通过 RadixAttention 技术实现前缀缓存和高速多轮对话，吞吐量领先 vLLM 29%。

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
SGLang: 高性能 LLM 推理引擎
═══════════════════════════════════════════════════════════════════

定位: 2026 年性能领先的 LLM 推理框架，LMSYS 出品

核心理念:
───────────────────────────────────────────────────────────────────
• 极致性能: H100 上 16,215 tok/s 吞吐量
• RadixAttention: 前缀缓存技术，多轮对话优化
• 结构化输出: 原生支持 JSON 约束解码
• 多 LoRA: 单实例服务数千微调模型
• 开源透明: 完全开源，持续迭代
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **RadixAttention** | 前缀缓存，自动复用共享前缀 |
| **结构化输出** | JSON/Schema 约束解码 |
| **多 LoRA 批处理** | 单卡服务数千微调模型 |
| **FlashAttention-3** | 最新 Attention 优化 |
| **Continuous Batching** | 动态批处理 |
| **OpenAI 兼容** | 兼容 Chat Completions API |

### 1.3 性能基准 (2026)

| 配置 | 吞吐量 | 说明 |
|------|--------|------|
| H100-80GB, Llama 3.1 8B | 16,215 tok/s | 领先 vLLM 29% |
| H100-80GB, Llama 3.1 70B | 8,200 tok/s | TP=4 |
| A100-80GB, Qwen2-72B | 6,500 tok/s | TP=4 |

---

## 2. 核心概念

### 2.1 RadixAttention 原理

```
RadixAttention: 前缀缓存技术
═══════════════════════════════════════════════════════════════════

传统方式 (无缓存):
┌──────────────────────────────────────────────────────────────────┐
│ 请求1: "解释量子纠缠"                                           │
│ Token: [解][释][量][子][纠][缠]...                               │
│ KV Cache: [K1][V1][K2][V2][K3][V3][K4][V4][K5][V5]...           │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ 请求2: "解释量子计算"                                           │
│ Token: [解][释][量][子][计][算]...                               │
│ KV Cache: [K1'][V1'][K2'][V2'][K3'][V3'][K4'][V4']...          │
│ → "量子" 重复计算!                                               │
└──────────────────────────────────────────────────────────────────┘

SGLang 方式 (前缀缓存):
┌──────────────────────────────────────────────────────────────────┐
│ 共享前缀树 (Prefix Tree)                                          │
│                                                                   │
│                    [root]                                         │
│                       │                                           │
│              ┌────────┴────────┐                                   │
│             [解]              [计]                               │
│              │                 │                                   │
│         ┌────┴────┐       ┌────┴────┐                            │
│        [释]      [计]    [算]                                    │
│         │        │                                               │
│      ┌──┴──┐   ┌─┴─┐                                             │
│    [量][纠][缠]                                                   │
│      │                                                          │
│   [子]                                                           │
│                                                                   │
│ 请求1: "解释量子纠缠" → 缓存 [解][释][量][子][纠][缠]           │
│ 请求2: "解释量子计算" → 命中 [解][释][量][子] 前缀，只计算 [计][算]│
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

| 组件 | 功能 | 说明 |
|------|------|------|
| **RadixAttention** | 前缀缓存 | 多请求共享前缀，自动复用 |
| **Scheduler** | 调度器 | 零开销 CPU 调度器 |
| **Frontend** | API 层 | OpenAI 兼容接口 |
| **Backend** | CUDA 核 | FlashAttention-3 |
| **LoraExecutor** | LoRA 服务 | 多 LoRA 批处理 |

### 2.3 与 vLLM 的区别

```
技术对比
═══════════════════════════════════════════════════════════════════

| 维度 | SGLang | vLLM |
|------|--------|------|
| **Attention** | RadixAttention | PagedAttention |
| **前缀缓存** | 自动，多请求共享 | APC (手动) |
| **调度器** | 零开销 CPU | GPU 调度 |
| **多 LoRA** | 原生支持 | 需要额外配置 |
| **吞吐量** | +29% | 基准 |
| **生态** | 快速增长 | 最成熟 |

共同点: Continuous Batching, FlashAttention
```

---

## 3. 架构设计

### 3.1 系统架构

```
SGLang 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        SGLang 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Frontend (API)                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  OpenAI Compatible API    │    Chat Completions        │   │
│   │  Streaming Support        │    Embeddings              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  RadixAttention Engine                  │   │
│   │  ┌────────────────────────────────────────────────────┐ │   │
│   │  │          Prefix Tree (Radix Tree)                  │ │   │
│   │  │   [共享前缀缓存] → 内存复用                        │ │   │
│   │  └────────────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CUDA Kernels (FlashAttention-3)            │   │
│   │  ├── 异步 Tensor Core + TMA                             │   │
│   │  ├── 交错 matmul 和 softmax                             │   │
│   │  └── FP8 支持                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Hardware                             │   │
│   │           H100 / H200 / A100 GPUs                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 执行流程

```
SGLang 执行流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        请求处理流程                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 请求到达                                                     │
│     └── HTTP → Frontend                                          │
│                                                                   │
│  2. 前缀匹配                                                     │
│     └── 查询 Radix Tree                                          │
│     └── 命中 → 复用缓存                                          │
│     └── 未命中 → 加载模型                                        │
│                                                                   │
│  3. 调度                                 │
│     └── CPU 调度器决定批次                                       │
│     └── 零开销调度                                               │
│                                                                   │
│  4. CUDA 执行                                                    │
│     └── FlashAttention-3                                        │
│     └── Continuous Batching                                      │
│                                                                   │
│  5. 输出流                                                       │
│     └── Streaming Token                                         │
│     └── 更新 Radix Tree                                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 源码安装
git clone https://github.com/sgl-project/sglang.git
cd sglang
pip install -e "python[all]"

# 或 Docker
docker run -p 30000:30000 \
  --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  ghcr.io/sgl-project/sglang:latest \
  --model-path meta-llama/Meta-Llama-3.1-8B-Instruct
```

### 4.2 启动服务

```bash
# 启动服务器
python -m sglang.launch_server \
    --model-path meta-llama/Meta-Llama-3.1-8B-Instruct \
    --port 30000 \
    --host 0.0.0.0

# 启用 RadixAttention (默认开启)
python -m sglang.launch_server \
    --model-path meta-llama/Meta-Llama-3.1-8B-Instruct \
    --enable-radix-attn \
    --port 30000

# 多卡
python -m sglang.launch_server \
    --model-path meta-llama/Meta-Llama-3.1-70B-Instruct \
    --tensor-parallel-size 4 \
    --port 30000
```

### 4.3 API 调用

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:30000/v1",
    api_key="not-needed",
)

# 聊天完成
response = client.chat.completions.create(
    model="default",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手"},
        {"role": "user", "content": "解释量子纠缠"},
    ],
    temperature=0.7,
    max_tokens=256,
)

print(response.choices[0].message.content)

# 流式输出
for chunk in client.chat.completions.create(
    model="default",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True,
):
    print(chunk.choices[0].delta.content, end="")
```

### 4.4 多 LoRA 服务

```bash
# 启动多 LoRA 服务
python -m sglang.launch_server \
    --model-path meta-llama/Meta-Llama-3.1-8B-Instruct \
    --port 30000 \
    --max-lora-ranks 8 \
    --lora-names base,sft,rlhf

# 调用指定 LoRA
curl http://localhost:30000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sft",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## 5. 高级特性

### 5.1 结构化输出

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:30000/v1", api_key="not-needed")

# JSON 约束输出
response = client.chat.completions.create(
    model="default",
    messages=[
        {"role": "user", "content": "返回一个 JSON 对象，包含姓名和年龄"}
    ],
    response_format={
        "type": "json_object",
        "schema": {
            "name": {"type": "string"},
            "age": {"type": "integer"}
        }
    },
)

import json
result = json.loads(response.choices[0].message.content)
print(result)  # {"name": "张三", "age": 25}
```

### 5.2 前缀缓存示例

```python
# 多轮对话示例 - 享受前缀缓存加速
from openai import OpenAI

client = OpenAI(base_url="http://localhost:30000/v1", api_key="not-needed")

# 第一轮
response1 = client.chat.completions.create(
    model="default",
    messages=[
        {"role": "system", "content": "你是一个专业的技术顾问"},
        {"role": "user", "content": "解释什么是微服务架构"}
    ],
)
print(response1.choices[0].message.content)

# 第二轮 - 系统消息复用前缀
response2 = client.chat.completions.create(
    model="default",
    messages=[
        {"role": "system", "content": "你是一个专业的技术顾问"},  # 缓存命中
        {"role": "user", "content": "它和单体架构的区别是什么"}   # 新增
    ],
)
print(response2.choices[0].message.content)
# 第二轮只需计算 [它][和][单][体]... 等新 token
```

---

## 6. 对比与选择

### 6.1 与其他推理框架对比

| 维度 | SGLang | vLLM | TensorRT-LLM |
|------|--------|------|--------------|
| **吞吐量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **延迟** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **多轮对话** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **多 LoRA** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **生态** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| **多轮对话/RAG** | SGLang (前缀缓存) |
| **通用生产环境** | vLLM (成熟稳定) |
| **单请求低延迟** | TensorRT-LLM |
| **快速原型** | SGLang/vLLM |
| **追求极致性能** | SGLang |

### 6.3 迁移指南

```python
# vLLM → SGLang (API 兼容，改 base_url 即可)

# vLLM
client = OpenAI(base_url="http://localhost:8000/v1", api_key="...")

# SGLang
client = OpenAI(base_url="http://localhost:30000/v1", api_key="not-needed")

# 代码无需修改，OpenAI 兼容
```

---

## 参考资源

- [SGLang GitHub](https://github.com/sgl-project/sglang)
- [SGLang 文档](https://docs.sglang.ai/)
- [SGLang Blog](https://lmsys.org/blog/)
- [ChatArena](https://chat.lmsys.org/) - 对比测试平台

---

*Last updated: 2026-04-25*
*Version: 1.0.0*

## Related

- [[09_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[09_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[09_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[09_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[09_Deployment_Inference/JVM_AI_Deployment.md|JVM_AI_Deployment]]
