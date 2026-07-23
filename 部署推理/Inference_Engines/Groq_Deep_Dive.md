---
title: "Groq: LPU 高速推理云平台"
category: "10-deployment-inference"
tags: ["groq", "lpu", "inference", "low-latency", "cloud-api", "deployment"]
summary: "> **一句话理解**: Groq 是基于自研 LPU (Language Processing Unit) 芯片的高速 LLM 推理云平台，以极低延迟和极具竞争力的价格提供 OpenAI 兼容 API。"
created: "2026-06-15"
updated: "2026-06-15"
tier: core
aliases:
  - "Groq Deep Dive"
  - Groq_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Groq: LPU 高速推理云平台

> **一句话理解**: Groq 是基于自研 LPU (Language Processing Unit) 芯片的高速 LLM 推理云平台，以极低延迟和极具竞争力的价格提供 OpenAI 兼容 API。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [模型与能力](#5-模型与能力)
6. [生产集成](#6-生产集成)
7. [对比与选择](#7-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Groq: LPU 高速推理云平台
═══════════════════════════════════════════════════════════════════

定位: 基于自研 AI 推理芯片（LPU）的云端大模型推理服务提供商

核心理念:
───────────────────────────────────────────────────────────────────
• 极速: 毫秒级首 token 延迟，行业领先
• 低价: 相比传统 GPU 云推理成本降低 80-90%
• 简单: OpenAI 兼容 API，两行代码迁移
• 全球: 多区域部署，低延迟响应
• 开放: 支持主流开源模型，无需模型锁定
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **自研 LPU** | 专为 LLM 推理设计的 Tensor Streaming Processor |
| **极低延迟** | Llama 3.1 70B TTFT < 100ms，输出速度 800+ tok/s |
| **高吞吐** | 批量场景下稳定高吞吐 |
| **OpenAI 兼容** | 支持 `v1/chat/completions` 等标准接口 |
| **Tool Calling** | 原生函数调用支持 |
| **JSON 模式** | 结构化输出 |
| **Whisper 语音** | 语音转文本低延迟 API |
| **全球节点** | 北美、欧洲、亚太数据中心 |
| **企业 SLA** | 生产级可用性保障 |

### 1.3 性能数据 (2026)

| 模型 | TTFT | 输出速度 | 场景 |
|------|------|----------|------|
| Llama 3.1 8B | ~20ms | ~2,000 tok/s | 实时聊天 |
| Llama 3.1 70B | ~80ms | ~800 tok/s | 复杂推理 |
| Llama 3.1 405B | ~200ms | ~300 tok/s | 大规模推理 |
| Mixtral 8x7B | ~50ms | ~600 tok/s | 高性价比 |
| Whisper Large v3 | - | 实时转录 | 语音应用 |

---

## 2. 核心概念

### 2.1 LPU (Language Processing Unit)

```
LPU vs GPU 架构对比
═══════════════════════════════════════════════════════════════════

GPU (通用并行处理器):
───────────────────────────────────────────────────────────────────
• 大量 CUDA core，适合通用矩阵计算
• 高带宽 HBM 显存
• 训练+推理兼顾
• 功耗高，成本高
• 需要复杂 batching 才能发挥性能

LPU (Groq Tensor Streaming Processor):
───────────────────────────────────────────────────────────────────
• 专为 Transformer 推理设计
• SRAM 为主的片上存储，避免 HBM 瓶颈
• 确定性时序，延迟极低且稳定
• 编译时静态调度，无运行时调度开销
• 单芯片即可跑完整小模型，无需复杂并行

关键差异:
┌────────────────┬─────────────────┬─────────────────┐
│     维度       │       GPU       │       LPU       │
├────────────────┼─────────────────┼─────────────────┤
│ 设计目标       │ 通用并行计算    │ LLM 推理专用    │
│ 内存架构       │ HBM (高带宽)    │ SRAM (低延迟)   │
│ 延迟确定性     │ 中              │ 极高            │
│ 单请求延迟     │ 中              │ 极低            │
│ 成本           │ 高              │ 低              │
│ 适用场景       │ 训练+推理       │ 推理部署        │
│ 功耗           │ 高              │ 低              │
└────────────────┴─────────────────┴─────────────────┘
```

### 2.2 编译型推理

```
Groq 编译流程
═══════════════════════════════════════════════════════════════════

PyTorch / Safetensors 模型
            │
            ▼
    Groq Compiler (groqit)
            │
            ▼
    静态计算图 + 内存布局
            │
            ▼
    LPU 执行计划 (deterministic schedule)
            │
            ▼
    多 LPU 芯片映射
            │
            ▼
    极低延迟、可预测吞吐的推理服务

优势:
• 无运行时图解释开销
• 内存访问模式可预测
• 延迟抖动极小
• 单请求也能跑满算力
```

### 2.3 为什么这么快

```
Groq 低延迟来源
═══════════════════════════════════════════════════════════════════

1. 片上 SRAM
───────────────────────────────────────────────────────────────────
模型权重和 KV Cache 尽量放在 SRAM，访问延迟比 HBM 低 10-100x

2. 确定性执行
───────────────────────────────────────────────────────────────────
编译阶段确定所有数据流，无需运行时调度决策

3. 单请求优化
───────────────────────────────────────────────────────────────────
不需要大 batch 也能发挥峰值性能，适合低延迟场景

4. 专用互联
───────────────────────────────────────────────────────────────────
多 LPU 之间高带宽、低延迟互联，扩展大模型
```

---

## 3. 架构设计

### 3.1 系统架构

```
Groq 云服务架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Groq Cloud                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   API Gateway                                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  OpenAI Compatible API                                  │   │
│   │  Rate Limit / Quota                                     │   │
│   │  Authentication                                         │   │
│   │  Load Balancing                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   Global Load Balancer                                           │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Region Selection                                       │   │
│   │  Latency-based Routing                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   Groq Compute Node                                              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  LPU Chip × N                                           │   │
│   │  Compiled Model Weights                                 │   │
│   │  Deterministic Scheduler                                │   │
│   │  KV Cache Management                                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 多 LPU 扩展

```
大模型在 Groq 上的部署
═══════════════════════════════════════════════════════════════════

小模型 (Llama 3.1 8B):
───────────────────────────────────────────────────────────────────
单个 LPU 芯片即可容纳全部权重
延迟最低，成本最优

大模型 (Llama 3.1 70B / 405B):
───────────────────────────────────────────────────────────────────
模型按层切分到多个 LPU
芯片间高速互联，流水线执行

效果:
• 70B 模型 TTFT 仍可控制在 100ms 以内
• 输出速度 800+ tok/s
• 延迟随模型增大线性增长，而非指数增长
```

---

## 4. 快速开始

### 4.1 获取 API Key

```bash
# 访问 https://console.groq.com/keys 创建 API Key
export GROQ_API_KEY="gsk_xxx"
```

### 4.2 Python SDK

```bash
pip install groq
```

```python
from groq import Groq

client = Groq(api_key="gsk_xxx")

# 聊天完成
response = client.chat.completions.create(
    model="llama-3.1-70b-versatile",
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
    model="llama-3.1-8b-instant",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True,
):
    print(chunk.choices[0].delta.content or "", end="")
```

### 4.3 OpenAI SDK 兼容

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key="gsk_xxx"
)

response = client.chat.completions.create(
    model="llama-3.1-70b-versatile",
    messages=[{"role": "user", "content": "解释量子纠缠"}]
)

print(response.choices[0].message.content)
```

### 4.4 cURL 调用

```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-70b-versatile",
    "messages": [{"role": "user", "content": "解释量子纠缠"}],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

### 4.5 语音转文字 (Whisper)

```python
audio_file = open("audio.mp3", "rb")

transcription = client.audio.transcriptions.create(
    model="whisper-large-v3",
    file=audio_file,
    response_format="json"
)

print(transcription.text)
```

---

## 5. 模型与能力

### 5.1 支持的模型

| 模型 | 参数 | 特点 | 适用场景 |
|------|------|------|----------|
| **Llama 3.3 70B** | 70B | 最新开源旗舰 | 复杂推理、代码 |
| **Llama 3.1 70B** | 70B | 上下文 128K | 长文档处理 |
| **Llama 3.1 8B** | 8B | 极速、低价 | 实时聊天、简单任务 |
| **Llama 3.1 405B** | 405B | 最强开源 | 高难度推理 |
| **Mixtral 8x7B** | 47B MoE | 高性价比 | 通用任务 |
| **Gemma 2 9B/27B** | 9B/27B | Google 开源 | 轻量任务 |
| **Whisper Large v3** | - | 语音转文字 | 实时语音应用 |

### 5.2 Tool Calling

```python
response = client.chat.completions.create(
    model="llama-3.1-70b-versatile",
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

### 5.3 JSON 模式

```python
response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
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

## 6. 生产集成

### 6.1 LangChain 集成

```python
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.1-70b-versatile",
    temperature=0.7,
    groq_api_key="gsk_xxx"
)

response = llm.invoke("解释量子计算")
print(response.content)
```

### 6.2 LiteLLM 代理

```python
import litellm

response = litellm.completion(
    model="groq/llama-3.1-70b-versatile",
    messages=[{"role": "user", "content": "Hello"}],
    api_key="gsk_xxx"
)
```

### 6.3 成本优化

| 策略 | 说明 |
|------|------|
| 模型降级 | 简单任务用 8B，复杂任务用 70B/405B |
| 缓存 prompt | 重复系统提示使用 prefix caching |
| 流式输出 | 降低首 token 感知延迟 |
| 批量处理 | 非实时场景合并请求 |
| 监控用量 | 通过 console 查看 token 消耗 |

### 6.4 监控与限制

| 项目 | 说明 |
|------|------|
| Rate Limit | 按 tier 限制 RPM/TPM |
| 并发 | 默认限制，可申请提升 |
| 日志 | Console 查看请求日志 |
| 可用性 | 企业版提供 SLA |

---

## 7. 对比与选择

### 7.1 与其他推理方案对比

| 维度 | Groq | vLLM (自建) | OpenAI API | Together AI |
|------|------|-------------|------------|-------------|
| **延迟 (TTFT)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **输出速度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **成本** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (硬件成本) | ⭐⭐ | ⭐⭐⭐⭐ |
| **模型选择** | ⭐⭐⭐ (开源为主) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **隐私** | ⭐⭐ (数据出域) | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **定制化** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

### 7.2 选型建议

| 场景 | 推荐 |
|------|------|
| 实时聊天/客服 | Groq |
| 代码补全/IDE | Groq |
| 语音实时转写 | Groq Whisper |
| 需要数据不出域 | 自建 vLLM / TGI |
| 需要私有模型/微调 | 自建 vLLM |
| 极致吞吐批量处理 | 自建 vLLM / SGLang |
| 简单快速接入 | Groq / OpenAI |

### 7.3 最佳实践

```
Groq 生产使用 checklist
═══════════════════════════════════════════════════════════════════

□ 根据任务复杂度选择合适模型 (8B vs 70B vs 405B)
□ 开启流式输出提升用户体验
□ 实现请求重试和指数退避
□ 监控 RPM/TPM 用量，避免触发限流
□ 对敏感数据评估数据出境合规性
□ 结合 LangChain/LiteLLM 做统一路由
□ 备用方案：配置 fallback 到自建 vLLM 或其他云 API
```

---

## 参考资源

- [Groq 官网](https://groq.com/)
- [Groq Console](https://console.groq.com/)
- [Groq 文档](https://console.groq.com/docs)
- [Groq Python SDK](https://github.com/groq/groq-python)
- [Groq 模型列表](https://console.groq.com/docs/models)

---

*Last updated: 2026-06-15*
*Version: 1.0.0*

## Related

- [[部署推理/Inference_Engines/vLLM_Deep_Dive.md|vLLM_Deep_Dive]]
- [[部署推理/Inference_Engines/TGI_Deep_Dive.md|TGI_Deep_Dive]]
- [[部署推理/Inference_Engines/SGLang_Deep_Dive.md|SGLang_Deep_Dive]]
- [[部署推理/Inference_Engines/TensorRT_LLM_Deep_Dive.md|TensorRT_LLM_Deep_Dive]]
- [[部署推理/LLM_Cost_Optimization.md|LLM_Cost_Optimization]]
- [[部署推理/Deployment_Inference_2026.md|Deployment_Inference_2026]]
- [[架构基建/AI_Gateway/AI_Gateway_2026|AI_Gateway_2026]]
- [[架构基建/AI_Gateway/LiteLLM_Deep_Dive|LiteLLM_Deep_Dive]]
