---
title: "Portkey: 企业级 AI Gateway"
category: "12-architecture-infrastructure-ai-gateway"
tags: ["ai-gateway", "api-management", "routing", "litellm"]
summary: "> **一句话理解**: Portkey 是企业级 AI Gateway——100+ 模型统一接入、智能路由、成本追踪、负载均衡，开箱即用的生产级 AI 基础设施。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Portkey Deep Dive"
  - Portkey_Deep_Dive

---
# Portkey: 企业级 AI Gateway

> **一句话理解**: Portkey 是企业级 AI Gateway——100+ 模型统一接入、智能路由、成本追踪、负载均衡，开箱即用的生产级 AI 基础设施。

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
Portkey: 企业级 AI Gateway
═══════════════════════════════════════════════════════════════════

定位: 企业级 AI 应用 Gateway，统一接入 100+ 模型，提供观测性和治理

核心理念:
───────────────────────────────────────────────────────────────────
• 多模型: 100+ 模型统一接入
• 可观测: 全链路追踪、成本分析
• 智能路由: 基于规则的路由策略
• 高可用: 负载均衡、fallback
• 生产级: 企业安全合规
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **多模型** | OpenAI/Anthropic/本地模型 |
| **智能路由** | 基于规则的路由 |
| **成本追踪** | 精确到请求的成本 |
| **负载均衡** | 轮询/优先级 |
| **全链路追踪** | 实时可观测性 |
| **Retries** | 自动重试机制 |
| **Cache** | 响应缓存 |

### 1.3 支持模型

| 类别 | 模型 |
|------|------|
| **OpenAI** | GPT-4o, GPT-4o-mini, GPT-4-turbo |
| **Anthropic** | Claude 3.5, Claude 3 |
| **Google** | Gemini Pro, Gemini Ultra |
| **开源** | Llama, Mistral, Qwen |
| **国内** | 百度、阿里、腾讯 |

---

## 2. 核心概念

### 2.1 架构组件

```
Portkey 核心组件
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Portkey 架构                                │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Gateway                                                       │
│  ───────────────────────────────────────────────────────────   │
│  • 统一 API 入口                                                 │
│  • 请求路由                                                      │
│  • 负载均衡                                                      │
│                                                                   │
│  2. Observability                                                │
│  ───────────────────────────────────────────────────────────   │
│  • traces (调用链追踪)                                           │
│  • metrics (指标)                                                │
│  • logs (日志)                                                   │
│                                                                   │
│  3. Governance                                                   │
│  ───────────────────────────────────────────────────────────   │
│  • 成本控制                                                      │
│  • 速率限制                                                      │
│  • 访问控制                                                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 路由策略

| 策略 | 说明 |
|------|------|
| **Simple** | 固定模型 |
| **Weighted** | 权重分配 |
| **Fallback** | 失败时切换 |
| **Least Latency** | 最低延迟优先 |
| **Custom** | 自定义规则 |

---

## 3. 架构设计

### 3.1 系统架构

```
Portkey 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        Portkey 架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Your Application                             │   │
│   │  OpenAI SDK / Anthropic SDK / LangChain                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Portkey Gateway                              │   │
│   │  • REST API                                              │   │
│   │  • 负载均衡                                              │   │
│   │  • 路由                                                  │   │
│   │  • 重试                                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐        │
│   │ OpenAI   │       │ Anthropic │       │  Local   │        │
│   │ Provider │       │  Provider │       │ Provider  │        │
│   └───────────┘       └───────────┘       └───────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 请求流程

```
Portkey 请求流程
═══════════════════════════════════════════════════════════════════

请求: /v1/chat/completions

┌──────────────────────────────────────────────────────────────────┐
│ Step 1: 路由决策                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ 1. 检查规则 (weighted/fallback)                                  │
│ 2. 选择目标 provider                                             │
│ 3. 准备请求                                                      │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 2: 转发执行                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ 1. 发送请求到目标 provider                                        │
│ 2. 记录 trace                                                    │
│ 3. 监控延迟和成本                                                 │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ Step 3: 响应处理                                                   │
│ ───────────────────────────────────────────────────────────────  │
│ 1. 解析响应                                                      │
│ 2. 错误处理/retry                                                │
│ 3. 返回给客户端                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install portkey-ai
```

### 4.2 基础配置

```python
from openai import OpenAI
from portkey_ai import Portkey

# 创建 Portkey 客户端
portkey = Portkey(
    api_key="PORTKEY_API_KEY",
    virtual_key="OPENAI_VIRTUAL_KEY"
)

# 使用方式与 OpenAI SDK 完全一致
client = OpenAI(
    api_key="not-needed",  # Portkey 不需要原始 API key
    base_url="https://api.portkey.ai/v1",
    default_headers=portkey.default_headers
)

# 完成请求
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### 4.3 多模型配置

```python
from portkey_ai import Portkey, LoadBalance

# 配置多个 provider
portkey = Portkey(
    api_key="PORTKEY_API_KEY",
    # 负载均衡配置
    strategy=LoadBalance(
        providers=[
            {"name": "openai", "weight": 0.6},
            {"name": "anthropic", "weight": 0.4}
        ]
    )
)
```

### 4.4 Fallback 配置

```python
from portkey_ai import Portkey, Fallback

# 配置 fallback
portkey = Portkey(
    api_key="PORTKEY_API_KEY",
    strategy=Fallback(
        primary="gpt-4o",
        fallback="claude-3-5-sonnet"
    )
)
```

---

## 5. 高级特性

### 5.1 成本追踪

```python
from portkey_ai import Portkey, CostTracker

# 启用成本追踪
portkey = Portkey(
    api_key="PORTKEY_API_KEY",
    enable_cost_tracking=True
)

# 查看成本
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[...]
)

# 获取成本信息
cost = response.usage.total_cost
print(f"本次请求成本: ${cost}")
```

### 5.2 全链路追踪

```python
from portkey_ai import Portkey, TraceConfig

# 配置追踪
portkey = Portkey(
    api_key="PORTKEY_API_KEY",
    trace=TraceConfig(
        mode="full",
        metadata={"user_id": "12345"}
    )
)
```

### 5.3 缓存

```python
from portkey_ai import Portkey, Cache

# 启用缓存
portkey = Portkey(
    api_key="PORTKEY_API_KEY",
    cache=Cache(
        mode="semantic",  # 语义缓存
        ttl=3600  # 1小时
    )
)
```

---

## 6. 对比与选择

### 6.1 与 LiteLLM 对比

| 维度 | Portkey | LiteLLM |
|------|---------|---------|
| **模型支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **成本追踪** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **可观测性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **UI 控制台** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **企业级** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **开源** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| 企业级治理 | Portkey |
| 快速原型 | LiteLLM |
| 成本控制 | Portkey |
| 开发者控制 | LiteLLM |
| 多云部署 | Portkey |

---

## 参考资源

- [Portkey GitHub](https://github.com/PortkeyAI)
- [Portkey 文档](https://docs.portkey.ai/)
- [Portkey Console](https://app.portkey.ai/)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*
