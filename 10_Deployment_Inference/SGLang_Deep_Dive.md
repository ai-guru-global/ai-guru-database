---
title: "SGLang: 高性能 LLM 推理框架"
category: "10-deployment-inference"
tags: ["deployment", "inference", "serving", "sglang", "llm", "radix-attention", "prefix-caching"]
summary: "> **一句话理解**: SGLang 是 LMSYS 出品的高性能 LLM 推理框架——RadixAttention 前缀缓存 + SGLang Runtime，多轮对话与 RAG 场景性能领先。"
created: "2026-05-31"
updated: "2026-06-15"
---

# SGLang: 高性能 LLM 推理框架

> **一句话理解**: SGLang 是 LMSYS 出品的高性能 LLM 推理框架——RadixAttention 前缀缓存 + SGLang Runtime，多轮对话与 RAG 场景性能领先。

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
SGLang: 高性能 LLM 推理引擎
═══════════════════════════════════════════════════════════════════

定位: LMSYS 出品的高性能 LLM 推理与服务框架

核心理念:
───────────────────────────────────────────────────────────────────
• 极致性能: H100 上 16,000+ tok/s 吞吐量
• RadixAttention: 自动前缀缓存，多轮/RAG 场景显著加速
• 低延迟调度: 零开销 CPU 调度器
• 结构化输出: 原生支持 JSON/Regex/EBNF 约束解码
• 多 LoRA: 单实例服务数千微调模型
• 开源透明: Apache 2.0，学术与工业界广泛采用
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **RadixAttention** | 自动前缀缓存，多请求共享前缀 |
| **SGLang Runtime (SRT)** | 高性能生产级推理运行时 |
| **结构化输出** | JSON/Regex/EBNF 约束解码 |
| **多 LoRA 批处理** | 单卡服务数千微调模型 |
| **FlashAttention-3** | 最新 Attention 优化 |
| **Continuous Batching** | 动态批处理 |
| **Chunked Prefill** | 大 prompt 分块，稳定 TTFT |
| **Speculative Decoding** | 推测解码加速 |
| **多模态** | 支持 Qwen2-VL、Llama 3.2 Vision 等 |
| **OpenAI 兼容** | 兼容 Chat Completions API |

### 1.3 性能基准 (2026)

| 配置 | 模型 | 吞吐量 | 说明 |
|------|------|--------|------|
| H100-80GB | Llama 3.1 8B | 16,215 tok/s | 领先 vLLM 约 25-30% |
| H100-80GB x4 | Llama 3.1 70B | 8,200 tok/s | TP=4 |
| H100-80GB x8 | Llama 3.1 405B | 3,500 tok/s | TP=8 |
| A100-80GB x4 | Qwen2-72B | 6,500 tok/s | TP=4 |

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
│ 共享前缀树 (Prefix Tree / Radix Tree)                             │
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

关键优势:
• 多轮对话复用历史上下文
• RAG 场景复用 system prompt 和文档前缀
• TTFT 降低 30-70%
• 显存复用，提升并发
```

### 2.2 核心组件

| 组件 | 功能 | 说明 |
|------|------|------|
| **RadixAttention** | 前缀缓存 | 多请求共享前缀，自动复用 |
| **Scheduler** | 调度器 | 零开销 CPU 调度器 |
| **Frontend** | API 层 | OpenAI 兼容接口 |
| **Backend** | CUDA 核 | FlashAttention-3 / FlashInfer |
| **LoraExecutor** | LoRA 服务 | 多 LoRA 批处理 |
| **SGLang Runtime** | 运行时 | 生产级推理服务 |

### 2.3 与 vLLM 的区别

```
技术对比
═══════════════════════════════════════════════════════════════════

| 维度 | SGLang | vLLM |
|------|--------|------|
| **Attention** | RadixAttention | PagedAttention |
| **前缀缓存** | 自动，多请求共享 | Automatic Prefix Caching (APC) |
| **调度器** | 零开销 CPU | GPU 调度 |
| **多 LoRA** | 原生支持 | 需要额外配置 |
| **结构化输出** | 原生 (xgrammar) | 部分支持 |
| **吞吐量** | +25-30% (特定场景) | 基准 |
| **生态成熟度** | 快速增长 | 最成熟 |

共同点: Continuous Batching, FlashAttention, OpenAI API
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
│   │  Multi-Modal              │    Function Calling        │   │
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
│   │              Scheduler + Chunked Prefill                │   │
│   │  ├── Continuous Batching                                │   │
│   │  ├── Chunked Prefill                                   │   │
│   │  └── Zero-overhead CPU scheduling                       │   │
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
│  3. 调度                                                         │
│     └── CPU 调度器决定批次                                       │
│     └── 零开销调度                                               │
│                                                                   │
│  4. CUDA 执行                                                    │
│     └── FlashAttention-3 / FlashInfer                            │
│     └── Continuous Batching                                      │
│                                                                   │
│  5. 输出流                                                       │
│     └── Streaming Token                                          │
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

# 或 pip 安装
pip install sglang

# 或 Docker
docker run -p 30000:30000 \
  --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  lmsysorg/sglang:latest \
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

## 5. 生产部署

### 5.1 Docker 部署

```bash
# 拉取官方镜像
docker pull lmsysorg/sglang:latest

# 启动容器
docker run -d --gpus all \
  -p 30000:30000 \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  --ipc=host \
  lmsysorg/sglang:latest \
  --model-path meta-llama/Meta-Llama-3.1-8B-Instruct \
  --tp 1 \
  --mem-fraction-static 0.85
```

### 5.2 Kubernetes 部署

```yaml
# sglang-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sglang-llama3-8b
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sglang-llama3-8b
  template:
    metadata:
      labels:
        app: sglang-llama3-8b
    spec:
      containers:
      - name: sglang
        image: lmsysorg/sglang:latest
        args:
          - --model-path
          - meta-llama/Meta-Llama-3.1-8B-Instruct
          - --port
          - "30000"
          - --tp
          - "1"
        resources:
          limits:
            nvidia.com/gpu: "1"
        ports:
        - containerPort: 30000
---
apiVersion: v1
kind: Service
metadata:
  name: sglang-llama3-8b
spec:
  selector:
    app: sglang-llama3-8b
  ports:
  - port: 30000
    targetPort: 30000
```

### 5.3 多机分布式

```bash
# 节点 1 (Ray head)
ray start --head

# 节点 2-N (Ray worker)
ray start --address="<head-ip>:6379"

# 启动 SGLang (使用 Ray backend)
python -m sglang.launch_server \
    --model-path meta-llama/Meta-Llama-3.1-405B-Instruct \
    --tp 8 \
    --dist-init-addr "head-ip:6379" \
    --nnodes 2
```

---

## 6. 高级特性

### 6.1 结构化输出

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

### 6.2 前缀缓存示例

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

### 6.3 Speculative Decoding

```bash
# 启用推测解码
python -m sglang.launch_server \
    --model-path meta-llama/Meta-Llama-3.1-70B-Instruct \
    --speculative-algorithm EAGLE \
    --speculative-draft-model-path meta-llama/Meta-Llama-3.1-8B-Instruct \
    --speculative-num-steps 5 \
    --speculative-eagle-topk 4 \
    --tp 4
```

### 6.4 Function Calling

```python
response = client.chat.completions.create(
    model="default",
    messages=[{"role": "user", "content": "北京今天天气怎么样？"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"}
                },
                "required": ["city"]
            }
        }
    }],
    tool_choice="auto"
)

print(response.choices[0].message.tool_calls)
```

### 6.5 多模态

```python
response = client.chat.completions.create(
    model="default",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "描述这张图片"},
            {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
        ]
    }]
)
```

---

## 7. 生产调优

### 7.1 关键参数

| 参数 | 作用 | 建议 |
|------|------|------|
| `--mem-fraction-static` | 静态显存占用比例 | 0.80-0.90 |
| `--max-running-requests` | 最大运行中请求 | 根据显存调整 |
| `--max-total-tokens` | 最大总 token 数 | 按模型和业务设置 |
| `--chunked-prefill-size` | Chunked prefill 大小 | 1024-4096 |
| `--enable-radix-attn` | 开启前缀缓存 | RAG/多轮必开 |
| `--schedule-policy` | 调度策略 | fcfs / lpm / srtf |

### 7.2 监控指标

| 指标 | 说明 |
|------|------|
| `sglang:gen_throughput` | 生成吞吐 |
| `sglang:num_running_reqs` | 运行中请求数 |
| `sglang:num_waiting_reqs` | 等待中请求数 |
| `sglang:cache_hit_rate` | 前缀缓存命中率 |
| `sglang:token_usage` | token 利用率 |

### 7.3 最佳实践

```
SGLang 生产使用 checklist
═══════════════════════════════════════════════════════════════════

□ RAG/多轮对话场景务必开启 --enable-radix-attn
□ 监控 cache_hit_rate，低于 50% 检查 prompt 设计
□ 长 prompt 场景开启 chunked prefill
□ 多 LoRA 场景合理设置 max-lora-ranks
□ 使用 Docker / K8s 部署，便于扩缩容
□ 结合 vLLM 做 fallback，构建多引擎路由
```

---

## 8. 对比与选择

### 8.1 与其他推理引擎对比

| 维度 | SGLang | vLLM | TensorRT-LLM | TGI | LMDeploy |
|------|--------|------|--------------|-----|----------|
| **吞吐量** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **延迟 (TTFT)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **多轮对话** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **前缀缓存** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **多 LoRA** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **结构化输出** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **生态** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

### 8.2 选型建议

| 场景 | 推荐 |
|------|------|
| 多轮对话/RAG | SGLang |
| 通用生产环境 | vLLM |
| 单请求低延迟 | TensorRT-LLM |
| 快速原型 | SGLang / vLLM |
| 追求极致性能 | SGLang |
| Hugging Face 生态 | TGI |
| 中文场景 | LMDeploy |

### 8.3 迁移指南

```python
# vLLM → SGLang (API 兼容，改 base_url 即可)

# vLLM
client = OpenAI(base_url="http://localhost:8000/v1", api_key="...")

# SGLang
client = OpenAI(base_url="http://localhost:30000/v1", api_key="not-needed")

# 代码无需修改，OpenAI 兼容
```

### 8.4 版本演进

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| v0.1 | 2024.1 | 首个版本，SGLang 编程模型 |
| v0.2 | 2024.6 | SRT (SGLang Runtime) |
| v0.3 | 2024.10 | RadixAttention、多 LoRA |
| v0.4 | 2025.3 | FlashAttention-3、Function Calling |
| v0.5 | 2025.8 | 多模态、Speculative Decoding |
| v0.6 | 2026.x | 更强 K8s 支持、Disaggregated Serving |

---

## 参考资源

- [SGLang GitHub](https://github.com/sgl-project/sglang)
- [SGLang 文档](https://docs.sglang.ai/)
- [SGLang Blog](https://lmsys.org/blog/)
- [ChatArena](https://chat.lmsys.org/) - 对比测试平台

---

*Last updated: 2026-06-15*
*Version: 2.0.0*

## Related

- [[10_Deployment_Inference/Deployment_Inference.md|Deployment_Inference]]
- [[10_Deployment_Inference/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[10_Deployment_Inference/Deployment_Inference_for_dummy.md|Deployment_Inference_for_dummy]]
- [[10_Deployment_Inference/Inference-in-nutshell.md|Inference-in-nutshell]]
- [[10_Deployment_Inference/vLLM_Deep_Dive.md|vLLM_Deep_Dive]]
- [[10_Deployment_Inference/TensorRT_LLM_Deep_Dive.md|TensorRT_LLM_Deep_Dive]]
- [[10_Deployment_Inference/TGI_Deep_Dive.md|TGI_Deep_Dive]]
- [[10_Deployment_Inference/LMDeploy_Deep_Dive.md|LMDeploy_Deep_Dive]]
