---
title: "Fireworks AI: 快速推理云平台"
category: "09-deployment-inference"
tags: ["fireworks-ai", "inference", "cloud-api", "open-source", "llm", "deployment"]
summary: "> **一句话理解**: Fireworks AI 是专注于快速推理和模型微调的云端 AI 平台——以 State Space Model (SSM) 和快速投机解码著称，高性价比，适合批量处理和企业级部署。"
created: "2026-06-15"
updated: "2026-06-15"
---

# Fireworks AI: 快速推理云平台

> **一句话理解**: Fireworks AI 是专注于快速推理和模型微调的云端 AI 平台——以 State Space Model (SSM) 和快速投机解码著称，高性价比，适合批量处理和企业级部署。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [模型与能力](#3-模型与能力)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [生产集成](#6-生产集成)
7. [对比与选择](#7-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Fireworks AI: 快速推理云平台
═══════════════════════════════════════════════════════════════════

定位: 企业级开源模型推理与微调平台，以高性能和低成本著称

核心理念:
───────────────────────────────────────────────────────────────────
• 极速推理: FireAttention 优化，低延迟高吞吐
• 成本领先: 批量场景极具竞争力
• 开源模型: 支持主流开源 LLM、Embedding、VLM
• 模型定制: FireFunction、Speculative Decoding
• 企业就绪: VPC、私有部署、SLA
• 开发者友好: OpenAI 兼容 API
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **FireAttention** | 自研 Attention 优化内核 |
| **Speculative Decoding** | 投机解码加速 |
| **Function Calling** | FireFunction v2 |
| **JSON 模式** | 结构化输出 |
| **批量推理** | 高吞吐批量 API |
| **微调** | 模型微调与部署 |
| **自定义模型** | 上传自有模型 |
| **VPC/私有部署** | 企业级部署 |
| **OpenAI 兼容** | 标准 API |

### 1.3 性能数据 (2026)

| 模型 | TTFT | 输出速度 | 价格 (input/output per 1M) |
|------|------|----------|----------------------------|
| Llama 3.1 8B | ~25ms | ~1,800 tok/s | $0.08 / $0.20 |
| Llama 3.1 70B | ~100ms | ~500 tok/s | $0.70 / $1.50 |
| Llama 3.1 405B | ~250ms | ~180 tok/s | $3.00 / $6.00 |
| Mixtral 8x22B | ~80ms | ~350 tok/s | $0.90 / $2.00 |
| FireFunction v2 | ~30ms | ~1,200 tok/s | $0.10 / $0.25 |

---

## 2. 核心概念

### 2.1 FireAttention

```
FireAttention: Fireworks 自研 Attention 优化
═══════════════════════════════════════════════════════════════════

优化点:
───────────────────────────────────────────────────────────────────
• KV Cache 内存优化
• 连续批处理 (Continuous Batching)
• 分页注意力 (PagedAttention-like)
• 低精度量化 (FP8/INT8)
• 多 GPU 并行调度

效果:
• 相比原生 PyTorch，吞吐提升 5-10x
• 相同成本下，输出速度更快
• 适合高并发生产环境
```

### 2.2 FireFunction

```
FireFunction: Fireworks 函数调用优化
═══════════════════════════════════════════════════════════════════

FireFunction v2:
───────────────────────────────────────────────────────────────────
• 原生支持工具调用
• 结构化输出更可靠
• 支持并行函数调用
• 与 Llama 3.1、Mixtral 等模型配合良好

使用场景:
• Agent 开发
• API 编排
• 数据提取
• 多步骤任务
```

### 2.3 服务层级

```
Fireworks AI 服务层级
═══════════════════════════════════════════════════════════════════

Serverless:
───────────────────────────────────────────────────────────────────
• 按需付费
• 共享基础设施
• 适合大多数场景

On-Demand:
───────────────────────────────────────────────────────────────────
• 预留 GPU 容量
• 更稳定的价格
• 适合稳定负载

Enterprise:
───────────────────────────────────────────────────────────────────
• VPC / 私有部署
• 定制模型
• 专属 SLA
```

---

## 3. 模型与能力

### 3.1 支持的模型

| 模型系列 | 代表模型 | 特点 |
|----------|----------|------|
| **Llama** | Llama 3.3 / 3.1 / 3 | 通用对话 |
| **Mixtral** | Mixtral 8x7B / 8x22B | MoE 高性价比 |
| **Qwen** | Qwen2.5 | 中文 |
| **DeepSeek** | DeepSeek-V3 / Coder | 代码 |
| **Gemma** | Gemma 2 | Google |
| **Phi** | Phi-4 | Microsoft |
| **Embedding** | Nomic / BGE / E5 | 向量 |
| **Vision** | LLaVA / Qwen-VL | 多模态 |
| **FireFunction** | FireFunction v2 | 函数调用专用 |

### 3.2 Function Calling

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key="YOUR_FIREWORKS_API_KEY"
)

response = client.chat.completions.create(
    model="accounts/fireworks/models/firefunction-v2",
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

### 3.3 JSON 模式

```python
response = client.chat.completions.create(
    model="accounts/fireworks/models/llama-v3p1-8b-instruct",
    messages=[{
        "role": "user",
        "content": "返回一个 JSON，包含 name 和 age"
    }],
    response_format={"type": "json_object"}
)

import json
result = json.loads(response.choices[0].message.content)
print(result)
```

---

## 4. 快速开始

### 4.1 获取 API Key

```bash
# 访问 https://fireworks.ai/ 注册并创建 API Key
export FIREWORKS_API_KEY="your_key"
```

### 4.2 Python SDK

```bash
pip install fireworks-ai
```

```python
from fireworks import Fireworks

client = Fireworks(api_key="your_key")

# 聊天完成
response = client.chat.completions.create(
    model="accounts/fireworks/models/llama-v3p1-70b-instruct",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手"},
        {"role": "user", "content": "解释量子纠缠"}
    ],
    max_tokens=256,
    temperature=0.7
)

print(response.choices[0].message.content)

# 流式输出
stream = client.chat.completions.create(
    model="accounts/fireworks/models/llama-v3p1-8b-instruct",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")
```

### 4.3 OpenAI SDK 兼容

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key="your_key"
)

response = client.chat.completions.create(
    model="accounts/fireworks/models/llama-v3p1-70b-instruct",
    messages=[{"role": "user", "content": "解释量子纠缠"}]
)

print(response.choices[0].message.content)
```

### 4.4 cURL 调用

```bash
curl https://api.fireworks.ai/inference/v1/chat/completions \
  -H "Authorization: Bearer $FIREWORKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "accounts/fireworks/models/llama-v3p1-70b-instruct",
    "messages": [{"role": "user", "content": "解释量子纠缠"}],
    "max_tokens": 256,
    "temperature": 0.7
  }'
```

---

## 5. 高级特性

### 5.1 批量推理

```python
# Fireworks 支持批量请求
responses = client.chat.completions.create(
    model="accounts/fireworks/models/llama-v3p1-8b-instruct",
    messages=[
        [{"role": "user", "content": "问题1"}],
        [{"role": "user", "content": "问题2"}],
        [{"role": "user", "content": "问题3"}]
    ]
)

for resp in responses:
    print(resp.choices[0].message.content)
```

### 5.2 微调

```python
# 上传微调数据
from fireworks.client import Fireworks

client = Fireworks(api_key="your_key")

# 创建微调任务
fine_tuning_job = client.fine_tuning.create(
    model="accounts/fireworks/models/llama-v3p1-8b-instruct",
    training_file="file_id",
    validation_file="file_id",
    n_epochs=3
)

# 使用微调模型
response = client.chat.completions.create(
    model=fine_tuning_job.fine_tuned_model,
    messages=[{"role": "user", "content": "测试"}]
)
```

### 5.3 Embedding API

```python
response = client.embeddings.create(
    model="nomic-ai/nomic-embed-text-v1.5",
    input="This is a sample text"
)

print(response.data[0].embedding)
```

### 5.4 图像理解

```python
response = client.chat.completions.create(
    model="accounts/fireworks/models/llava-yi-34b",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "描述这张图片"},
            {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
        ]
    }]
)

print(response.choices[0].message.content)
```

---

## 6. 生产集成

### 6.1 LiteLLM 代理

```python
import litellm

response = litellm.completion(
    model="fireworks_ai/accounts/fireworks/models/llama-v3p1-70b-instruct",
    messages=[{"role": "user", "content": "Hello"}],
    api_key="your_key"
)
```

### 6.2 LangChain 集成

```python
from langchain_fireworks import ChatFireworks

llm = ChatFireworks(
    model="accounts/fireworks/models/llama-v3p1-70b-instruct",
    fireworks_api_key="your_key",
    temperature=0.7
)

response = llm.invoke("解释量子计算")
print(response.content)
```

### 6.3 成本优化

| 策略 | 说明 |
|------|------|
| 批量 API | 非实时场景使用批量推理 |
| 选择 8B / MoE | 简单任务用轻量模型 |
| FireFunction | Agent 场景专用模型 |
| On-Demand | 稳定负载预留容量 |
| 缓存 | 重复 prompt 使用 caching |

---

## 7. 对比与选择

### 7.1 与其他云推理平台对比

| 维度 | Fireworks AI | Groq | Together AI | OpenAI |
|------|-------------|------|-------------|--------|
| **延迟 (TTFT)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **批量吞吐** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **成本** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **开源模型** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **函数调用** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **微调** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **企业 SLA** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 7.2 选型建议

| 场景 | 推荐 |
|------|------|
| 批量高性价比 | Fireworks AI |
| 极致低延迟 | Groq |
| 模型选择最广 | Together AI |
| 闭源旗舰模型 | OpenAI |
| Agent / Function Calling | Fireworks AI (FireFunction v2) |
| 模型微调 + 部署 | Together AI / Fireworks AI |

### 7.3 最佳实践

```
Fireworks AI 生产使用 checklist
═══════════════════════════════════════════════════════════════════

□ Agent 场景优先使用 FireFunction v2
□ 批量处理使用批量 API
□ 监控 token 用量和延迟
□ 对敏感数据评估数据出境合规性
□ 结合 LiteLLM 做统一路由
□ 配置 fallback 到其他云 API
□ 高用量时评估 On-Demand 实例
```

---

## 参考资源

- [Fireworks AI 官网](https://fireworks.ai/)
- [Fireworks AI 文档](https://docs.fireworks.ai/)
- [Fireworks AI Playground](https://fireworks.ai/account/models)
- [Fireworks Python SDK](https://github.com/fw-ai/fireworks-client)

---

*Last updated: 2026-06-15*
*Version: 1.0.0*

## Related

- [[09_Deployment_Inference/Groq_Deep_Dive.md|Groq_Deep_Dive]]
- [[09_Deployment_Inference/Together_AI_Deep_Dive.md|Together_AI_Deep_Dive]]
- [[09_Deployment_Inference/vLLM_Deep_Dive.md|vLLM_Deep_Dive]]
- [[09_Deployment_Inference/LLM_Inference_Engine_Selection_Guide.md|LLM_Inference_Engine_Selection_Guide]]
- [[09_Deployment_Inference/LLM_Cost_Optimization.md|LLM_Cost_Optimization]]
- [[14_AI_Gateway/LiteLLM_Deep_Dive.md|LiteLLM_Deep_Dive]]
- [[14_AI_Gateway/AI_Gateway_2026.md|AI_Gateway_2026]]
