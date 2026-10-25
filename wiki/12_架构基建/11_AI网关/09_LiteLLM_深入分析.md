---
title: "LiteLLM: 多模型统一 API 代理"
category: "12-architecture-infrastructure-ai-gateway"
tags: ["ai-gateway", "api-management", "routing", "litellm", "llm"]
summary: "> **一句话理解**: LiteLLM 让你可以用同一套接口调用 100+ 种 LLM——OpenAI、Anthropic、Azure、Ollama、HuggingFace 等，一个 SDK 搞定所有。"
created: "2026-05-31"
updated: "2026-06-15"
tier: supporting
aliases:
  - "Litellm Deep Dive"
  - "LiteLLM Deep Dive"
  - LiteLLM_Deep_Dive
sources: []

name_zh: "LiteLLM: 多模型统一 API 代理"
---
# LiteLLM: 多模型统一 API 代理

> 中文简称：LiteLLM: 多模型统一 API 代理

> **一句话理解**: LiteLLM 让你可以用同一套接口调用 100+ 种 LLM——OpenAI、Anthropic、Azure、Ollama、HuggingFace 等，一个 SDK 搞定所有。

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
LiteLLM: 多模型统一 API
═══════════════════════════════════════════════════════════════════

定位: 统一的 LLM API 代理，支持 100+ 模型，一个接口搞定所有

核心理念:
───────────────────────────────────────────────────────────────────
• 统一接口: 标准化 OpenAI 格式
• 多模型支持: OpenAI/Anthropic/Azure/Ollama/HuggingFace 等
• 成本控制: 智能路由和预算管理
• 可靠性: 负载均衡和自动重试
```

### 1.2 支持的模型提供商

| 提供商 | 模型 | 说明 |
|--------|------|------|
| **OpenAI** | GPT-4, GPT-4o, GPT-4o-mini | 官方 API |
| **Anthropic** | Claude 3.5, Claude 3 | 官方 API |
| **Azure** | GPT-4, Claude | 企业部署 |
| **Google** | Gemini Pro/Ultra | Vertex AI |
| **AWS** | Claude, Titan | Bedrock |
| **Ollama** | Llama, Mistral, Qwen | 本地部署 |
| **HuggingFace** | Inference API | 开源模型 |
| **Groq** | Llama, Mixtral | 快速推理 |
| **Mistral** | Mistral, Codestral | 官方 API |
| **DeepSeek** | DeepSeek V3, Coder | 高性价比 |

### 1.3 发展历程

| 版本 | 时间 | 关键特性 |
|------|------|----------|
| litellm 0.1 | 2023.8 | 统一 OpenAI 接口 |
| v0.5 | 2023.12 | 多提供商支持 |
| v0.10 | 2024.3 | 价格路由，预算管理 |
| v0.15 | 2024.6 | 负载均衡，熔断器 |
| v0.20 | 2024.10 | 代理模式，ui |
| v1.0 | 2025.2 | 企业级功能 |

---

## 2. 核心概念

### 2.1 架构概览

```
LiteLLM 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        LiteLLM 架构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   应用层                                                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  LangChain / LlamaIndex / 自定义应用                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  LiteLLM SDK                            │   │
│   │  ├── 统一接口 (completion/chat/image)                   │   │
│   │  ├── 路由引擎 (cost-based/round-robin/failover)        │   │
│   │  ├── 预算管理 (per-key/per-model/spending limits)       │   │
│   │  └── 监控日志 (全程可观测性)                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  模型提供商                             │   │
│   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │   │
│   │  │OpenAI │ │Anthropic│ │Azure  │ │Ollama  │         │   │
│   │  └────────┘ └────────┘ └────────┘ └────────┘         │   │
│   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │   │
│   │  │  GCP   │ │  AWS   │ │ Hugging│ │ Groq   │         │   │
│   │  └────────┘ └────────┘ └────────┘ └────────┘         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

| 组件 | 功能 | 说明 |
|------|------|------|
| **SDK** | 统一 API | OpenAI 兼容接口 |
| **Proxy** | 本地服务器 | 私有部署 |
| **Router** | 智能路由 | 成本/负载最优 |
| **Key Management** | 密钥管理 | 安全存储 |
| **Observability** | 可观测性 | 日志/追踪/指标 |

### 2.3 关键特性

| 特性 | 说明 | 优势 |
|------|------|------|
| **OpenAI 兼容** | 完全兼容 OpenAI API 格式 | 零代码改动迁移 |
| **智能路由** | 基于成本/延迟/可用性 | 节省 40-70% 成本 |
| **预算控制** | 精确的支出限制 | 防止超支 |
| **熔断器** | 自动故障转移 | 提高可用性 |
| **日志/追踪** | 全程可观测性 | 调试/审计 |
| **多模型切换** | 一行代码切换模型 | 灵活性 |

---

## 3. 架构设计

### 3.1 路由策略

```
LiteLLM 路由策略
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│ Router 路由决策流程                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  请求进入                                                         │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 1. Key 验证与预算检查                                        │  │
│  │    ├── 检查 API key 有效性                                  │  │
│  │    ├── 检查预算限制                                         │  │
│  │    └── 超限 → 返回错误                                      │  │
│  └─────────────────────────────────────────────────────────────┘  │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 2. 模型选择                                                  │  │
│  │    ├── 读取模型配置                                         │  │
│  │    └── 支持: 明确指定/路由策略                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 3. 路由策略                                                  │  │
│  │    ┌──────────────────────────────────────────────────────┐ │  │
│  │    │ 策略1: cost-based (成本最优)                          │ │  │
│  │    │  → 选择满足需求的最便宜模型                           │ │  │
│  │    │ 策略2: latency-based (延迟最低)                       │ │  │
│  │    │  → 选择响应最快的模型                                 │ │  │
│  │    │ 策略3: round-robin (轮询)                             │ │  │
│  │    │  → 均匀分配负载                                        │ │  │
│  │    │ 策略4: simple-shuffle (随机)                          │ │  │
│  │    │  → 随机选择                                           │ │  │
│  │    │ 策略5: semantic-routing (语义路由)                    │ │  │
│  │    │  → 根据内容复杂度选择模型                             │ │  │
│  │    └──────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────┘  │
│      │                                                           │
│      ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 4. 故障转移 (Fallback)                                       │  │
│  │    ├── 尝试首选模型                                         │  │
│  │    ├── 失败 → 尝试备用模型                                  │  │
│  │    └── 全部失败 → 返回错误                                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 代理模式架构

```
LiteLLM Proxy 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      LiteLLM Proxy                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   客户端                                                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  curl localhost:4000/v1/chat/completions               │   │
│   │  -H "Authorization: Bearer sk-xxx"                      │   │
│   │  -d '{"model": "gpt-4", "messages": [...]}            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  API Gateway                            │   │
│   │  ├── 认证 (API Key)                                     │   │
│   │  ├── 限流 (Rate Limit)                                  │   │
│   │  ├── 预算控制 (Budget)                                  │   │
│   │  └── 路由 (Router)                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  模型提供商                             │   │
│   │  OpenAI ←→ Anthropic ←→ Azure ←→ Ollama               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
# 安装
pip install litellm

# 安装代理 (可选)
pip install litellm[proxy]
```

### 4.2 基础使用

```python
from litellm import completion

# OpenAI
response = completion(
    model="gpt-4",
    messages=[{"role": "user", "content": "你好"}],
    api_key="your-openai-key"
)
print(response.choices[0].message.content)

# Anthropic
response = completion(
    model="claude-3-5-sonnet-20241022",
    messages=[{"role": "user", "content": "你好"}],
    messages=[{"role": "user", "content": "你好"}],
)
# 或者用统一格式
response = completion(
    model="anthropic/claude-3-5-sonnet-20241022",
    messages=[{"role": "user", "content": "你好"}],
)
```

### 4.3 统一接口切换模型

```python
from litellm import completion

# 切换模型 - 只需改 model 名
models = [
    "gpt-4o",
    "anthropic/claude-3-5-sonnet-20241022",
    "ollama/llama3",
    "huggingface/mistralai/Mistral-7B-Instruct-v0.2"
]

for model in models:
    print(f"\n--- Testing {model} ---")
    response = completion(
        model=model,
        messages=[{"role": "user", "content": "用一句话解释量子纠缠"}],
        # ollama/huggingface 需要提供 base_url
        api_key="dummy" if "ollama" in model else None,
        base_url="http://localhost:11434" if "ollama" in model else None
    )
    print(response.choices[0].message.content)
```

### 4.4 代理模式

```bash
# 启动代理
litellm

# 或者带配置
litellm --config proxy_config.yaml
```

```yaml
# proxy_config.yaml
model_list:
  - model_name: gpt-4
    litellm_params:
      model: openai/gpt-4
      api_key: os.environ/OPENAI_API_KEY

  - model_name: claude-3
    litellm_params:
      model: anthropic/claude-3-5-sonnet-20241022
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: local-llama
    litellm_params:
      model: ollama/llama3
      api_base: http://localhost:11434
      api_key: "dummy"

router_settings:
  routing_strategy: cost-based
  redis_host: localhost
  redis_port: 6379

general_settings:
  master_key: sk-12345  # 代理认证 key
```

### 4.5 调用代理

```python
import openai

client = openai.OpenAI(
    api_key="sk-12345",  # master key
    base_url="http://localhost:4000/v1"
)

# 就像调用 OpenAI 一样
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "你好"}]
)
```

---

## 5. 高级特性

### 5.1 智能路由

```python
from litellm import completion
import os

# 设置路由策略
os.environ["LITELLM_ROUTING_STRATEGY"] = "cost-based"

# 简单查询用便宜模型
response = completion(
    model="auto",  # 路由自动选择
    messages=[{"role": "user", "content": "1+1等于几?"}],
    messages=[{"role": "user", "content": "你好"}],
)

# 复杂查询自动升级
response = completion(
    model="auto",
    messages=[{"role": "user", "content": "分析一下当前全球经济形势"}],
    messages=[{"role": "user", "content": "你好"}],
)
```

### 5.2 预算控制

```python
from litellm import completion

# 每日预算限制
response = completion(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好"}],
    max_budget=0.05,  # 最大 $0.05
)

# 模型级别预算
response = completion(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好"}],
    metadata={
        "max_budget_per_key": {
            "sk-xxx": 100,  # key 限额 $100
            "sk-yyy": 50    # key 限额 $50
        }
    }
)
```

### 5.3 熔断与重试

```python
from litellm import completion

# 配置重试和熔断
response = completion(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好"}],

    # 重试配置
    tenacity=dict(
        max_attempts=3,
        wait_exponential_multiplier=1000,
        wait_exponential_max=10000,
    ),

    # 熔断器
    timeout=60,  # 单次请求超时
)
```

### 5.4 日志与监控

```python
import litellm
from litellm import completion

# 设置日志级别
litellm._logging = True

# 详细日志
@litellm.input_hook
def log_input_hook(params):
    print(f"Input: {params}")

@litellm.success_hook
def log_success_hook(params, response_obj):
    print(f"Success: {response_obj}")

# 使用 hooks
response = completion(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好"}],
    messages=[{"role": "user", "content": "你好"}],
)
```

---

## 6. 对比与选择

### 6.1 与其他方案对比

| 维度 | LiteLLM | Portkey |玄曜 AI Gateway |
|------|---------|---------|------------------|
| **模型支持** | 100+ | 50+ | 30+ |
| **开源** | ✅ | ❌ | ✅ |
| **自托管** | ✅ | ❌ | ❌ |
| **路由策略** | 5+ 种 | 多种 | 基础 |
| **预算控制** | ✅ | ✅ | ✅ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

### 6.2 使用场景

**✅ LiteLLM 最佳场景:**
- 多模型统一管理
- 成本优化优先
- 快速原型和迁移
- 需要自托管的场景
- Agent 系统中的模型抽象

**❌ 不适合场景:**
- 只使用单一模型 (直接用官方 SDK)
- 需要复杂数据分析 (用专业平台)

---

## 参考资源

- [LiteLLM GitHub](https://github.com/BerriAI/litellm)
- [LiteLLM 文档](https://docs.litellm.ai/)
- [LiteLLM Proxy](https://docs.litellm.ai/docs/proxy")
- [模型列表](https://docs.litellm.ai/docs/providers)

---

*Last updated: 2026-04-24*
*Version: 1.0.0*

## Related

- [[12_架构基建/11_AI网关/01_AI网关_2026.md|AI_Gateway_2026]]
- [[12_架构基建/11_AI网关/01_AI网关_2026|AI_Gateway_for_dummy]]
- [[12_架构基建/11_AI网关/05_Cohere_深入分析.md|Cohere_Deep_Dive]]
- [[12_架构基建/11_AI网关/06_Gateway_简明指南.md|Gateway-in-nutshell]]
- [[12_架构基建/11_AI网关/08_Kong_AI网关_深入分析.md|Kong_AI_Gateway_Deep_Dive]]
- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM 推理引擎选型指南]]
- [[10_部署推理/02_推理引擎/16_LLM_推理引擎_迁移_指南|LLM 推理引擎迁移指南]]
- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM 深度解析]]
- [[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang 深度解析]]
