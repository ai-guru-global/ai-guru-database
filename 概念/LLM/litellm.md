---
title: "LiteLLM 统一 LLM API 代理 (LiteLLM Unified LLM Gateway)"
category: -concepts
tags: ["litellm", "llm-proxy", "unified-api", "cost-tracking", "load-balancing", "multi-provider"]
relationships:
  - target: "概念/synapse-gateway"
    type: related_to
  - target: "概念/opik"
    type: related_to
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "LiteLLM 是开源的统一 LLM API 代理——用 OpenAI 格式调用 100+ LLM 提供商（OpenAI/Anthropic/Azure/Bedrock/Ollama 等），内置负载均衡、成本追踪和 Fallback 机制。是 LLM Gateway 的轻量级方案。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-12
updated: 2026-07-21
---

# LiteLLM 统一 LLM API 代理

> **一句话理解**: LiteLLM 是"LLM 的统一转接头"——一个 API 格式调用所有 LLM，自动负载均衡、Fallback、成本追踪。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **类型** | LLM API 代理 / Gateway |
| **开源协议** | MIT |
| **GitHub** | 14K+ ⭐ |
| **核心价值** | 统一接口 + 智能路由 + 成本管控 |
| **支持提供商** | 100+ (OpenAI/Anthropic/Azure/Bedrock/Ollama...) |

---

## 2. 核心架构

```
┌─────────────────────────────────────────┐
│          LiteLLM 代理架构               │
├─────────────────────────────────────────┤
│                                         │
│  客户端 (OpenAI SDK 格式)               │
│    ↓ POST /chat/completions             │
│                                         │
│  LiteLLM Proxy                          │
│    ├── 模型路由 (model → provider)      │
│    ├── 负载均衡 (同模型多实例)          │
│    ├── Fallback (主模型挂 → 备用模型)  │
│    ├── 成本追踪 (实时 token/cost)       │
│    ├── 速率限制 (RPM/TPM)               │
│    ├── 缓存 (相似请求去重)             │
│    └── 认证 (API Key 管理)              │
│                                         │
│  提供商层                               │
│    ├── OpenAI (gpt-4, gpt-3.5)          │
│    ├── Anthropic (claude-3)             │
│    ├── Azure OpenAI                     │
│    ├── AWS Bedrock                      │
│    ├── Google Vertex AI                 │
│    ├── Ollama (本地模型)                │
│    └── 100+ 其他                        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 核心用法

### 3.1 Python SDK（一行切换模型）

```python
from litellm import completion

# 用同一接口调用不同提供商
response = completion(
    model="gpt-4",  # OpenAI
    messages=[{"role": "user", "content": "Hello"}],
)

response = completion(
    model="claude-3-opus-20240229",  # Anthropic
    messages=[{"role": "user", "content": "Hello"}],
)

response = completion(
    model="ollama/llama3",  # 本地 Ollama
    messages=[{"role": "user", "content": "Hello"}],
)
```

### 3.2 Proxy Server

```yaml
# litellm_config.yaml
model_list:
  - model_name: gpt-4
    litellm_params:
      model: openai/gpt-4
      api_key: sk-...
  
  - model_name: gpt-4  # 同名 = 负载均衡
    litellm_params:
      model: azure/gpt-4
      api_key: azure-...
      api_base: https://...
  
  - model_name: claude
    litellm_params:
      model: anthropic/claude-3-opus-20240229
      api_key: sk-ant-...

litellm_settings:
  fallbacks: [{"gpt-4": ["claude"]}]  # gpt-4 挂了自动切 claude
```

```bash
# 启动代理
litellm --config litellm_config.yaml

# 客户端用 OpenAI SDK 调用
from openai import OpenAI
client = OpenAI(base_url="http://localhost:4000", api_key="any")
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}]
)
```

---

## 4. 核心功能

| 功能 | 说明 |
|------|------|
| **统一 API** | OpenAI 格式调用所有提供商 |
| **负载均衡** | 同一模型多个实例，按延迟/负载分配 |
| **Fallback** | 主模型失败自动切备用模型 |
| **成本追踪** | 实时统计每个模型/用户的 Token 和费用 |
| **速率限制** | 按 Key/用户/模型限制 RPM/TPM |
| **缓存** | 相似请求缓存，减少 API 调用 |
| **虚拟 Key** | 为不同团队/应用生成独立 Key |
| **审计日志** | 所有请求的完整记录 |

---

## 5. 与其他 AI Gateway 对比

| 特性 | LiteLLM | Portkey | Kong AI | AWS Bedrock |
|------|---------|---------|---------|-------------|
| **开源** | ✅ MIT | ❌ | ✅ | ❌ |
| **提供商数** | 100+ | 20+ | 有限 | AWS only |
| **Fallback** | ✅ | ✅ | 需配置 | ❌ |
| **成本追踪** | ✅ | ✅ | 有限 | ✅ |
| **缓存** | ✅ | ✅ | ❌ | ❌ |
| **部署复杂度** | 低 | 低 | 高 | 低 |

---

## 6. AI Stack 中的定位

```
┌─────────────────────────────────────────┐
│     LLM Gateway / Proxy 选型           │
├─────────────────────────────────────────┤
│                                         │
│  LiteLLM  ← 开源轻量、100+ 提供商 ★   │
│  Portkey  ← 商业级、功能丰富           │
│  Kong AI  ← 企业 API 网关 + AI 扩展    │
│  AI Gateway (Cloudflare) ← CDN 层      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. 关键要点

1. **OpenAI 格式统一**：客户端不需要改代码，只需换 base_url 即可切换提供商
2. **Fallback 是杀手锏**：主模型 API 挂了自动切备用，保障可用性
3. **成本透明**：实时知道每个请求/用户/模型的 Token 消耗和费用
4. **开源 MIT**：完全开源，可自托管，数据不出企业
5. **Proxy 模式**：作为中间层部署，现有应用零改动接入
6. **AI Stack 意义**：企业多模型管理的统一入口，避免供应商锁定

---

## 2026 LiteLLM 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **LiteLLM v1.40+** | 支持 100+ LLM 提供商 | GA |
| **统一 API** | OpenAI 格式调用所有模型 | GA |
| **负载均衡** | 多模型/多 Key 负载均衡 | GA |
| **成本追踪** | 实时 Token 消耗和费用统计 | GA |
| **Fallback 机制** | 主模型失败自动切换备用 | GA |

## 生产最佳实践

1. **统一入口**：用 LiteLLM 作为所有 LLM 调用的统一入口
2. **Fallback 必配**：配置主备模型，保障可用性
3. **成本监控**：实时监控每个请求/用户/模型的成本
4. **自托管**：敏感数据场景自托管 LiteLLM Proxy
5. **与 AI Stack 集成**：企业环境用 AI Stack 集成 LiteLLM

## 相关链接

- [[概念/Inference/model-gateway|模型网关]] — LiteLLM 作为轻量级网关
- [[概念/General/openai|OpenAI]] — LiteLLM 统一调用的主要提供商
- [[12_架构基建/11_AI_Gateway/index|AI Gateway 索引]] — 网关架构总览
- [[概念/Inference/model-routing|模型路由]] — LiteLLM 的路由能力
- [[概念/Inference/inference-autoscaling|推理自动扩缩容]] — 网关配合的扩缩容
