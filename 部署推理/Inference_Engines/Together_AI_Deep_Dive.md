---
title: "Together AI: 开源模型推理云平台"
category: "10-deployment-inference"
tags: ["together-ai", "inference", "cloud-api", "open-source", "llm", "deployment"]
summary: "> **一句话理解**: Together AI 是专注于开源大模型的云端推理平台——模型选择最广、价格有竞争力、OpenAI 兼容，是开源模型云端部署的重要选择。"
created: "2026-06-15"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Together Ai Deep Dive"
  - "Together AI Deep Dive"
  - Together_AI_Deep_Dive
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Together AI: 开源模型推理云平台

> **一句话理解**: Together AI 是专注于开源大模型的云端推理平台——模型选择最广、价格有竞争力、OpenAI 兼容，是开源模型云端部署的重要选择。

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
Together AI: 开源模型推理云平台
═══════════════════════════════════════════════════════════════════

定位: 专注于开源大语言模型推理与微调的云端 AI 平台

核心理念:
───────────────────────────────────────────────────────────────────
• 开源优先: 支持最广泛的开源模型
• 性价比: 比主流闭源 API 便宜 80-90%
• 高性能: 自研推理栈，优化吞吐与延迟
• 易迁移: OpenAI 兼容 API
• 端到端: 推理 + 微调 + 部署
• 企业级: SLA、VPC、私有部署
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **模型丰富** | 200+ 开源模型 |
| **OpenAI 兼容** | 标准 `v1/chat/completions` |
| **Function Calling** | 工具调用支持 |
| **JSON 模式** | 结构化输出 |
| **推测解码** | Together Turbo 低延迟 |
| **微调** | LoRA / 全参数微调 |
| **专用实例** | 独占 GPU 部署 |
| **企业 SLA** | 生产级可用性 |

### 1.3 性能数据 (2026)

| 模型 | TTFT | 输出速度 | 价格 (input/output per 1M) |
|------|------|----------|----------------------------|
| Llama 3.1 8B | ~30ms | ~1,500 tok/s | $0.10 / $0.30 |
| Llama 3.1 70B | ~120ms | ~400 tok/s | $0.90 / $2.00 |
| Llama 3.1 405B | ~300ms | ~150 tok/s | $3.50 / $7.00 |
| Mixtral 8x22B | ~100ms | ~300 tok/s | $1.20 / $2.50 |
| Qwen2.5-72B | ~150ms | ~350 tok/s | $1.00 / $2.20 |

---

## 2. 核心概念

### 2.1 Together Turbo

```
Together Turbo
═══════════════════════════════════════════════════════════════════

Together 自研推理优化栈:
───────────────────────────────────────────────────────────────────
• 连续批处理 (Continuous Batching)
• 推测解码 (Speculative Decoding)
• 量化优化 (FP8 / INT8)
• 多 GPU 并行
• KV Cache 管理

效果:
• 相比普通推理，延迟降低 2-3x
• 成本进一步降低 50%+
• 适合高并发生产环境
```

### 2.2 服务层级

```
Together AI 服务层级
═══════════════════════════════════════════════════════════════════

Serverless:
───────────────────────────────────────────────────────────────────
• 按需付费
• 共享 GPU 资源
• 适合开发、测试、中小规模

Dedicated:
───────────────────────────────────────────────────────────────────
• 独占 GPU 实例
• 固定价格
• 适合稳定生产负载

Fine-tuning:
───────────────────────────────────────────────────────────────────
• 模型微调服务
• 支持 LoRA / 全参数
• 微调后部署到 Together
```

---

## 3. 模型与能力

### 3.1 支持的开源模型

| 模型系列 | 代表模型 | 特点 |
|----------|----------|------|
| **Llama** | Llama 3.3 / 3.1 / 3 | Meta 开源旗舰 |
| **Qwen** | Qwen2.5 / Qwen-VL | 中文优化 |
| **Mistral** | Mistral Large / Mixtral | 欧洲开源 |
| **DeepSeek** | DeepSeek-V3 / Coder | 代码/推理 |
| **Gemma** | Gemma 2 | Google 开源 |
| **Phi** | Phi-4 | Microsoft 小模型 |
| **Yi** | Yi-34B | 中文 |
| **Embedding** | BGE / E5 / GTE | 向量模型 |
| **Image** | Stable Diffusion / FLUX | 图像生成 |

### 3.2 Function Calling

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.together.xyz/v1",
    api_key="YOUR_TOGETHER_API_KEY"
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-70B-Instruct-Turbo",
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
    model="meta-llama/Llama-3.1-8B-Instruct-Turbo",
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
# 访问 https://api.together.xyz/ 注册并创建 API Key
export TOGETHER_API_KEY="your_key"
```

### 4.2 Python SDK

```bash
pip install together
```

```python
import together

client = together.Together(api_key="your_key")

# 聊天完成
response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-70B-Instruct-Turbo",
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
    model="meta-llama/Llama-3.1-8B-Instruct-Turbo",
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
    base_url="https://api.together.xyz/v1",
    api_key="your_key"
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-70B-Instruct-Turbo",
    messages=[{"role": "user", "content": "解释量子纠缠"}]
)

print(response.choices[0].message.content)
```

### 4.4 cURL 调用

```bash
curl https://api.together.xyz/v1/chat/completions \
  -H "Authorization: Bearer $TOGETHER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.1-70B-Instruct-Turbo",
    "messages": [{"role": "user", "content": "解释量子纠缠"}],
    "max_tokens": 256,
    "temperature": 0.7
  }'
```

---

## 5. 高级特性

### 5.1 Together Turbo vs 普通推理

```bash
# Together Turbo (优化推理)
model="meta-llama/Llama-3.1-70B-Instruct-Turbo"

# 普通推理
model="meta-llama/Llama-3.1-70B-Instruct"
```

### 5.2 微调

```python
# 上传数据集
file_resp = client.files.create(
    file=open("finetune_data.jsonl", "rb"),
    purpose="fine-tune"
)

# 创建微调任务
job = client.fine_tuning.jobs.create(
    training_file=file_resp.id,
    model="meta-llama/Llama-3.1-8B-Instruct",
    n_epochs=3,
    learning_rate=1e-5
)

# 使用微调模型
response = client.chat.completions.create(
    model=job.fine_tuned_model,
    messages=[{"role": "user", "content": "测试微调效果"}]
)
```

### 5.3 Embedding API

```python
response = client.embeddings.create(
    model="BAAI/bge-large-en-v1.5",
    input="This is a sample text"
)

print(response.data[0].embedding)
```

### 5.4 图像生成

```python
response = client.images.generate(
    model="black-forest-labs/FLUX.1-schnell",
    prompt="a beautiful sunset over mountains",
    n=1,
    size="1024x1024"
)

print(response.data[0].url)
```

---

## 6. 生产集成

### 6.1 LiteLLM 代理

```python
import litellm

response = litellm.completion(
    model="together_ai/meta-llama/Llama-3.1-70B-Instruct-Turbo",
    messages=[{"role": "user", "content": "Hello"}],
    api_key="your_key"
)
```

### 6.2 LangChain 集成

```python
from langchain_together import ChatTogether

llm = ChatTogether(
    model="meta-llama/Llama-3.1-70B-Instruct-Turbo",
    together_api_key="your_key",
    temperature=0.7
)

response = llm.invoke("解释量子计算")
print(response.content)
```

### 6.3 成本优化

| 策略 | 说明 |
|------|------|
| 使用 Turbo 模型 | 成本更低、速度更快 |
| 批量处理 | 非实时场景合并请求 |
| 缓存 prompt | 重复前缀使用 caching |
| 选择合适模型 | 简单任务用 8B，复杂任务用 70B |
| 专用实例 | 高用量时比 serverless 便宜 |

---

## 7. 对比与选择

### 7.1 与其他云推理平台对比

| 维度 | Together AI | Groq | Fireworks AI | OpenAI |
|------|-------------|------|--------------|--------|
| **模型选择** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **延迟 (TTFT)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **成本** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **开源模型** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **微调** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **图像生成** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **企业 SLA** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 7.2 选型建议

| 场景 | 推荐 |
|------|------|
| 需要最多开源模型 | Together AI |
| 极致低延迟 | Groq |
| 批量高性价比 | Fireworks AI |
| 闭源旗舰模型 | OpenAI |
| 模型微调 + 部署 | Together AI |
| 图像生成 | Together AI / Fireworks |

### 7.3 最佳实践

```
Together AI 生产使用 checklist
═══════════════════════════════════════════════════════════════════

□ 优先使用 -Turbo 后缀模型
□ 实现请求重试和指数退避
□ 监控 token 用量和成本
□ 对敏感数据评估数据出境合规性
□ 结合 LiteLLM 做统一路由
□ 配置 fallback 到其他云 API
□ 高用量时评估 Dedicated 实例
```

---

## 参考资源

- [Together AI 官网](https://www.together.ai/)
- [Together AI 文档](https://docs.together.ai/)
- [Together AI Playground](https://api.together.xyz/playground)
- [Together Python SDK](https://github.com/togethercomputer/together-python)

---

*Last updated: 2026-06-15*
*Version: 1.0.0*

## Related

- [[部署推理/Inference_Engines/Groq_Deep_Dive.md|Groq_Deep_Dive]]
- [[部署推理/Inference_Engines/Fireworks_AI_Deep_Dive.md|Fireworks_AI_Deep_Dive]]
- [[部署推理/Inference_Engines/vLLM_Deep_Dive.md|vLLM_Deep_Dive]]
- [[部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide.md|LLM_Inference_Engine_Selection_Guide]]
- [[部署推理/Cost/LLM_Cost_Optimization.md|LLM_Cost_Optimization]]
- [[架构基建/AI_Gateway/LiteLLM_Deep_Dive|LiteLLM_Deep_Dive]]
- [[架构基建/AI_Gateway/AI_Gateway_2026|AI_Gateway_2026]]
