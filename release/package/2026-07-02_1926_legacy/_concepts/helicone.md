---
title: "Helicone LLM 可观测性 (Helicone AI Observability)"
category: -concepts
tags: ["helicone", "llm-observability", "api-proxy", "cost-tracking", "monitoring"]
relationships:
  - target: "_concepts/opik"
    type: related_to
  - target: "_concepts/langsmith"
    type: related_to
  - target: "_concepts/litellm"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Helicone 是轻量级 LLM 可观测性平台——通过 API 代理方式实现一键接入，提供成本追踪、延迟监控、缓存和速率限制。接入只需改一行 base_url，是最简单的 LLM 监控方案。"
provenance:
  extracted: 0.15
  inferred: 0.75
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: stable
tier: supporting
---

# Helicone LLM 可观测性

> **一句话理解**: Helicone 是"LLM API 的智能代理层"——改一行 base_url 就接入，自动追踪成本/延迟/用量，零代码改动。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **类型** | LLM API 代理 + 可观测性 |
| **开源协议** | AGPL-3.0 (服务端) |
| **GitHub** | 5K+ ⭐ |
| **核心价值** | 一行代码接入的 LLM 监控 |
| **接入方式** | 修改 base_url 即可 |

---

## 2. 工作原理

```
┌─────────────────────────────────────────┐
│        Helicone 代理模式                │
├─────────────────────────────────────────┤
│                                         │
│  修改前:                                │
│  client → api.openai.com → OpenAI       │
│                                         │
│  修改后:                                │
│  client → oai.helicone.ai → Helicone   │
│             ↓                           │
│         Helicone 记录                   │
│         (延迟/Token/成本)               │
│             ↓                           │
│         Helicone → api.openai.com       │
│                                         │
│  代码改动: 仅改 base_url 一行           │
│                                         │
└─────────────────────────────────────────┘
```

### 一行接入

```python
from openai import OpenAI

# 只需加一行 base_url
client = OpenAI(
    api_key="sk-...",
    base_url="https://oai.helicone.ai/v1",
    default_headers={"Helicone-Auth": "Bearer your-helicone-key"},
)

# 之后所有调用自动追踪
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}],
)
```

---

## 3. 核心功能

| 功能 | 说明 |
|------|------|
| **成本追踪** | 实时统计每个模型/用户的 Token 消耗和费用 |
| **延迟监控** | 首 Token 延迟、总延迟、P50/P95/P99 |
| **缓存** | 相同请求缓存，减少 API 调用和成本 |
| **速率限制** | 按用户/Key 限制 RPM/TPM |
| **重试** | API 失败自动重试 |
| **自定义属性** | 为请求添加标签（用户 ID、功能名等） |
| **仪表盘** | 可视化所有指标 |

### 自定义属性

```python
# 添加请求标签
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}],
    extra_headers={
        "Helicone-Property-User": "user_123",
        "Helicone-Property-Feature": "chat",
    }
)
```

---

## 4. 与其他工具对比

| 特性 | Helicone | Opik | LangSmith | LiteLLM |
|------|----------|------|-----------|---------|
| **接入方式** | base_url 代理 | SDK | SDK | base_url 代理 |
| **代码改动** | 一行 | 多行 | 一行环境变量 | 一行 |
| **追踪深度** | 请求级 | Span 级 | Span 级 | 请求级 |
| **评估** | ❌ | ✅ | ✅ | ❌ |
| **缓存** | ✅ | ❌ | ❌ | ✅ |
| **Fallback** | ❌ | ❌ | ❌ | ✅ |
| **开源** | ✅ AGPL | ✅ Apache 2.0 | ❌ | ✅ MIT |

---

## 5. 关键要点

1. **最简接入**：改一行 base_url 即可，零代码改动
2. **代理模式**：作为 API 中间层，不侵入业务逻辑
3. **缓存省钱**：相同请求缓存，直接降低 API 调用成本
4. **轻量监控**：专注成本和延迟监控，不做复杂的 Agent 追踪
5. **适合场景**：需要快速监控 LLM API 成本但不想改代码的团队
6. **vs LiteLLM**：Helicone 专注监控，LiteLLM 专注路由和 Fallback
