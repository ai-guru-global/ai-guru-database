---
title: "Novita AI: 高性价比云推理平台"
category: "10-deployment-inference"
tags: ["novita-ai", "inference", "cloud-api", "open-source", "llm", "deployment", "pay-per-token"]
summary: "> **一句话理解**: Novita AI 是新兴的云推理 API 平台，主打高性价比、按 token 计费、覆盖 200+ 开源模型（含大量中文优化模型），OpenAI 兼容 API 开箱即用。"
created: "2026-06-25"
updated: "2026-06-25"
tier: supporting
aliases:
  - "Novita Ai Deep Dive"
  - "Novita AI Deep Dive"
  - Novita_AI_Deep_Dive
sources: []

---
# Novita AI: 高性价比云推理平台

> **一句话理解**: Novita AI 定位为"AI 模型的 AWS"——聚合 200+ 开源模型（Llama、Qwen、DeepSeek、Mistral 等），提供 Serverless API 和 Dedicated 两种部署模式，OpenAI 兼容接口，价格在同类平台中极具竞争力。

---

## 目录

1. [概述与定位](#1-概述与定位)
2. [核心架构](#2-核心架构)
3. [模型生态](#3-模型生态)
4. [快速开始](#4-快速开始)
5. [高级特性](#5-高级特性)
6. [定价与成本模型](#6-定价与成本模型)
7. [生产集成](#7-生产集成)
8. [对比与选择](#8-对比与选择)
9. [最佳实践](#9-最佳实践)
10. [常见问题](#10-常见问题)

---

## 1. 概述与定位

### 1.1 是什么

Novita AI 是一家专注于 **LLM 推理服务** 的云平台，核心理念是：

- **聚合而非训练**: 不训练自有模型，而是将主流开源模型（Llama 3.1、Qwen 2.5、DeepSeek V3、Mistral 等）打包为即用 API
- **Serverless 优先**: 按 token 计费，无最低消费，适合从 MVP 到中等规模的生产场景
- **中文模型覆盖广**: 除西方主流模型外，覆盖 Qwen、GLM、DeepSeek、Yi、Baichuan 等中文优化模型，是国内开发者使用开源模型 API 的便捷选择

### 1.2 核心优势

| 维度 | Novita AI | 对比参考 |
|------|-----------|---------|
| 模型数量 | 200+ | Together AI: 100+, Fireworks: 80+ |
| OpenAI 兼容 | ✅ 完全兼容 | 同类均兼容 |
| 中文模型覆盖 | ✅ 广（Qwen/GLM/DeepSeek/Yi） | Together: 有限 |
| Serverless 最低价格 | $0.05/1M tokens | Together: $0.10, Fireworks: $0.10 |
| Dedicated 部署 | ✅ 支持 | 同类均支持 |
| 多模态 | ✅ 图像/音频/视频 | Together: 图像, Fireworks: 图像 |
| Function Calling | ✅ 支持 | 同类均支持 |

### 1.3 适用场景

- **快速验证**: 零基础设施投入，分钟级上线
- **中等规模生产**: 10K-1M 请求/天，Serverless 模式性价比最优
- **中文应用**: 需要 Qwen/DeepSeek/GLM 等中文优化模型的出海或国内应用
- **模型对比评测**: 同一平台访问多个模型，统一 API 和计费

---

## 2. 核心架构

```
┌─────────────────────────────────────────┐
│            客户端应用                      │
│   (OpenAI SDK / LiteLLM / 自定义)         │
└────────────┬────────────────────────────┘
             │ HTTPS (OpenAI-compatible API)
             ▼
┌─────────────────────────────────────────┐
│         Novita AI API Gateway            │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ 认证/限流  │ │ 路由/负载 │ │ 计量/计费│ │
│  └──────────┘ └──────────┘ └─────────┘ │
└────────────┬────────────────────────────┘
             │
     ┌───────┼───────┐
     ▼       ▼       ▼
┌─────────┐┌─────────┐┌─────────┐
│Serverless││Dedicated││Fine-tune│
│ Workers ││Instances││ Workers │
│(共享GPU) ││(独占GPU) ││(训练集群)│
└─────────┘└─────────┘└─────────┘
```

### 2.1 两种部署模式

| 模式 | Serverless | Dedicated |
|------|-----------|-----------|
| 计费 | 按 token | 按 GPU 时长 |
| 冷启动 | 有（~1-5s） | 无 |
| SLA | 尽力而为 | 99.9% |
| 并发限制 | 共享池，有速率限制 | 独占，无限制 |
| 适合规模 | MVP → 中等 | 大规模生产 |
| 模型定制 | 不可 | 可（自定义量化/LoRA） |

---

## 3. 模型生态

### 3.1 核心模型矩阵

| 类别 | 代表模型 | 输入价格 | 输出价格 |
|------|---------|---------|---------|
| **通用旗舰** | Llama 3.1 405B | $0.90/1M | $0.90/1M |
| **通用性价比** | Llama 3.1 70B | $0.20/1M | $0.20/1M |
| **中文旗舰** | Qwen 2.5 72B | $0.30/1M | $0.30/1M |
| **推理增强** | DeepSeek V3 | $0.14/1M | $0.28/1M |
| **推理增强** | DeepSeek R1 | $0.55/1M | $2.19/1M |
| **代码** | DeepSeek Coder V2 | $0.14/1M | $0.28/1M |
| **轻量快速** | Llama 3.1 8B | $0.05/1M | $0.05/1M |
| **多模态** | LLaVA 1.6 34B | $0.30/1M | $0.30/1M |
| **Embedding** | BGE-M3 | $0.02/1M | — |

### 3.2 Function Calling / Tool Use 支持

| 模型 | Function Calling | JSON Mode | Structured Output |
|------|-----------------|-----------|-------------------|
| Llama 3.1 系列 | ✅ | ✅ | ✅ |
| Qwen 2.5 系列 | ✅ | ✅ | ✅ |
| DeepSeek V3 | ✅ | ✅ | ✅ |
| Mistral 系列 | ✅ | ✅ | ⚠️ 部分 |

---

## 4. 快速开始

### 4.1 API Key 获取

1. 注册 [novita.ai](https://novita.ai) 账户
2. 进入 Dashboard → API Keys → 创建新 Key
3. 新用户赠送 $5 免费额度

### 4.2 OpenAI SDK 直接调用

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-novita-api-key",
    base_url="https://api.novita.ai/v3/openai"
)

# 基本对话
response = client.chat.completions.create(
    model="meta-llama/llama-3.1-70b-instruct",
    messages=[
        {"role": "system", "content": "你是一个有帮助的AI助手。"},
        {"role": "user", "content": "解释什么是 PagedAttention？"}
    ],
    temperature=0.7,
    max_tokens=1024,
)

print(response.choices[0].message.content)
```

### 4.3 Function Calling 示例

```python
import json

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的天气信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "城市名"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["city"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="meta-llama/llama-3.1-70b-instruct",
    messages=[
        {"role": "user", "content": "北京今天天气怎么样？"}
    ],
    tools=tools,
    tool_choice="auto",
)

# 解析 tool call
tool_call = response.choices[0].message.tool_calls[0]
args = json.loads(tool_call.function.arguments)
print(f"调用: {tool_call.function.name}({args})")
```

### 4.4 流式输出

```python
stream = client.chat.completions.create(
    model="deepseek/deepseek-v3",
    messages=[
        {"role": "user", "content": "用 Python 实现快速排序"}
    ],
    stream=True,
    max_tokens=2048,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### 4.5 Embedding 调用

```python
response = client.embeddings.create(
    model="baai/bge-m3",
    input=["人工智能的未来", "The future of AI"],
)

# 获取 embedding 向量
embeddings = [item.embedding for item in response.data]
print(f"维度: {len(embeddings[0])}")  # BGE-M3: 1024 维
```

---

## 5. 高级特性

### 5.1 批量推理 (Batch API)

```python
# 创建批量任务（异步处理，价格更低）
batch_response = client.batches.create(
    completion_window="24h",
    endpoint="/v1/chat/completions",
    input_file_id="file-xxx",  # 上传 JSONL 文件
)

# 查询状态
batch = client.batches.retrieve(batch_response.id)
print(f"状态: {batch.status}, 完成: {batch.request_counts.completed}")
```

### 5.2 多模态推理

```python
import base64

# 图像理解
with open("image.png", "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="liuhaotian/llava-v1.6-34b",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "这张图片里有什么？"},
                {"type": "image_url", "image_url": {
                    "url": f"data:image/png;base64,{image_b64}"
                }}
            ]
        }
    ],
    max_tokens=512,
)
```

### 5.3 模型参数调优

```python
# 不同场景的推荐参数
configs = {
    "creative_writing": {"temperature": 0.9, "top_p": 0.95, "repetition_penalty": 1.1},
    "code_generation": {"temperature": 0.2, "top_p": 0.9, "repetition_penalty": 1.05},
    "rag_qa": {"temperature": 0.0, "top_p": 1.0, "repetition_penalty": 1.0},
    "reasoning": {"temperature": 0.6, "top_p": 0.95, "repetition_penalty": 1.0},
}
```

---

## 6. 定价与成本模型

### 6.1 Serverless 定价对比（以 Llama 3.1 70B 为例）

| 平台 | 输入价格 | 输出价格 | 备注 |
|------|---------|---------|------|
| Novita AI | $0.20/1M | $0.20/1M | 无最低消费 |
| Together AI | $0.88/1M | $0.88/1M | — |
| Fireworks AI | $0.90/1M | $0.90/1M | — |
| Groq | $0.59/1M | $0.79/1M | 最快延迟 |
| OpenAI GPT-4o | $2.50/1M | $10.00/1M | 闭源基准 |

### 6.2 成本估算示例

**场景**: RAG 应用，日均 50K 请求，平均输入 1500 tokens，输出 500 tokens

| 平台 | 日成本 | 月成本 |
|------|--------|--------|
| Novita AI (Llama 3.1 70B) | $20.00 | ~$600 |
| Together AI (Llama 3.1 70B) | $88.00 | ~$2,640 |
| OpenAI GPT-4o-mini | $28.75 | ~$863 |
| 自建 vLLM (A100 80GB) | — | ~$1,500 (GPU 月租) |

### 6.3 何时选择 Dedicated

当 Serverless 月成本 > Dedicated GPU 月租时，切换 Dedicated：
- **估算公式**: 月 Serverless 成本 > GPU 月租 × 1.3（含运维成本）
- **典型阈值**: 日均 200K+ 请求（Llama 70B 级别）

---

## 7. 生产集成

### 7.1 LiteLLM 代理集成

```python
# litellm_config.yaml
model_list:
  - model_name: "llama-70b"
    litellm_params:
      model: "openai/meta-llama/llama-3.1-70b-instruct"
      api_base: "https://api.novita.ai/v3/openai"
      api_key: "your-key"
  - model_name: "llama-70b"
    litellm_params:
      model: "openai/meta-llama/llama-3.1-70b-instruct"
      api_base: "https://api.together.xyz/v1"
      api_key: "your-together-key"
    # LiteLLM 自动负载均衡 + 故障切换
```

### 7.2 AI Gateway 集成

```yaml
# 在 AI Gateway 中配置 Novita AI 作为上游
routes:
  - path: /v1/chat/completions
    upstreams:
      - name: novita-ai
        base_url: https://api.novita.ai/v3/openai
        weight: 70
        api_key: ${NOVITA_API_KEY}
      - name: together-fallback
        base_url: https://api.together.xyz/v1
        weight: 30
        api_key: ${TOGETHER_API_KEY}
    retry_policy:
      max_retries: 2
      timeout: 30s
```

### 7.3 监控与可观测性

```python
import logging
from openai import OpenAI

# 配置请求/响应日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("novita-ai")

class MonitoredClient:
    def __init__(self, api_key):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.novita.ai/v3/openai"
        )

    def chat(self, messages, model="meta-llama/llama-3.1-70b-instruct"):
        import time
        start = time.time()
        response = self.client.chat.completions.create(
            model=model, messages=messages
        )
        latency = time.time() - start

        # 记录指标
        usage = response.usage
        logger.info(
            f"model={model} latency={latency:.2f}s "
            f"prompt_tokens={usage.prompt_tokens} "
            f"completion_tokens={usage.completion_tokens} "
            f"total_tokens={usage.total_tokens}"
        )
        return response
```

---

## 8. 对比与选择

### 8.1 云推理 API 横向对比

| 维度 | Novita AI | Together AI | Fireworks AI | Groq |
|------|-----------|-------------|--------------|------|
| 模型数量 | 200+ | 100+ | 80+ | 20+ |
| 最低价格 | $0.05/1M | $0.10/1M | $0.10/1M | $0.05/1M |
| TTFT P50 | ~800ms | ~600ms | ~500ms | ~200ms |
| 吞吐量 | 中 | 高 | 高 | 极高 |
| 中文模型 | ✅ 丰富 | ⚠️ 有限 | ⚠️ 有限 | ❌ 极少 |
| Function Calling | ✅ | ✅ | ✅ | ✅ |
| Batch API | ✅ | ✅ | ✅ | ❌ |
| Fine-tuning | ✅ | ✅ | ✅ | ❌ |
| 企业 SLA | ✅ | ✅ | ✅ | ✅ |

### 8.2 选型决策树

```
需要中文优化模型（Qwen/DeepSeek/GLM）？
  → Novita AI（覆盖最广）
追求最低延迟（< 300ms TTFT）？
  → Groq（LPU 硬件加速）
需要最多模型选择 + 成本控制？
  → Novita AI 或 Together AI
需要端到端 Fine-tuning + 推理？
  → Together AI 或 Fireworks AI
```

---

## 9. 最佳实践

1. **从 Serverless 开始**: 验证模型效果和延迟，再决定是否 Dedicated
2. **使用 LiteLLM 做代理层**: 统一 API、自动重试、故障切换
3. **合理选择模型大小**: 8B 够用时不要用 70B，成本差 4 倍
4. **批量任务用 Batch API**: 价格通常低 50%，适合非实时场景
5. **监控 token 消耗**: 设置每日/每月预算告警
6. **中文场景优先测试**: Qwen 2.5 和 DeepSeek V3 在中文任务上往往优于 Llama

---

## 10. 常见问题

### Q1: Novita AI 的数据安全如何？
所有 API 请求通过 TLS 1.3 加密；不存储用户输入/输出数据；支持 SOC 2 合规。

### Q2: 支持哪些区域？
全球 CDN 加速，推理节点主要在美国和亚太地区。中国大陆访问建议使用 Dedicated 模式或配合代理。

### Q3: 如何处理限流？
Serverless 默认限制：60 RPM（请求/分钟）、1M TPM（tokens/分钟）。可申请提升。建议客户端实现指数退避重试。

### Q4: 模型版本更新策略？
平台会在上游模型发布新版后 1-2 周内上线。旧版本保留 3 个月。建议通过 model alias 而非硬编码模型名。

### Q5: 如何估算 Dedicated 需要的 GPU？
- Llama 8B: 1× A10G (24GB)
- Llama 70B: 2× A100 (80GB)
- Qwen 72B: 2× A100 (80GB)
- 405B: 8× A100 (80GB)

---

## Related

- [[10_部署推理/02_Inference_Engines/Together_AI_Deep_Dive]] — Together AI 对比参考
- [[10_部署推理/02_Inference_Engines/Fireworks_AI_Deep_Dive]] — Fireworks AI 对比参考
- [[10_部署推理/02_Inference_Engines/Groq_Deep_Dive]] — Groq 对比参考
- [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide]] — 全局选型指南
- [[12_架构基建/11_AI_Gateway/README]] — AI Gateway 集成

---

*Last updated: 2026-06-25*
*Version: 1.0.0*

- [[10_部署推理/README|模型部署与推理]]
