---
title: 'AI Gateway 对比 2026'
category: '12-architecture-infrastructure-ai-gateway'
tags: ["ai-gateway", "api-management", "routing", "litellm"]
summary: '> **一句话秒懂**: AI Gateway 是调用大模型 API 的"中间人"，帮你统一管理多模型路由、限流、缓存、安全和成本，是 AI 工程化的基础设施。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Ai Gateway Comparison 2026"
  - "AI Gateway Comparison 2026"
  - AI_Gateway_Comparison_2026

---
# AI Gateway 对比 2026

> **一句话秒懂**: AI Gateway 是调用大模型 API 的"中间人"，帮你统一管理多模型路由、限流、缓存、安全和成本，是 AI 工程化的基础设施。

## 目录

- [为什么需要 AI Gateway？](#为什么需要-ai-gateway)
- [Kong AI Gateway](#kong-ai-gateway)
- [Portkey](#portkey)
- [LiteLLM](#litelllm)
- [OneAPI](#oneapi)
- [OpenRouter](#openrouter)
- [Helicone](#helicone)
- [AI Proxy 设计模式](#ai-proxy-设计模式)
- [选型指南](#选型指南)
- [成本分析](#成本分析)
- [迁移指南](#迁移指南)

---

## 为什么需要 AI Gateway？

### 没有网关的痛点

```
没有 AI Gateway 的架构：

应用代码 → OpenAI SDK (硬编码)
应用代码 → Anthropic SDK (硬编码)
应用代码 → Azure SDK (硬编码)
应用代码 → 本地 vLLM (硬编码)

问题：
- 切换模型需要改代码、重新部署
- 无法统一限流和监控
- API Key 散落在各处
- 成本无法追踪
- 没有缓存、重复调用浪费钱
```

### 有网关的好处

```mermaid
graph LR
    App[应用] --> Gateway[AI Gateway]
    Gateway --> OpenAI3[OpenAI]
    Gateway --> Anthropic3[Anthropic]
    Gateway --> Azure3[Azure]
    Gateway --> Local3[本地 vLLM]

    Gateway --> Cache3[缓存]
    Gateway --> RateLimit3[限流]
    Gateway --> Log3[日志]
    Gateway --> Cost3[成本追踪]
```

---

## Kong AI Gateway

### 概述

Kong AI Gateway 是基于 Kong API Gateway 的 AI 扩展，将 LLM API 管理能力集成到成熟的 API 网关中。

### 核心能力

| 能力 | 说明 |
|------|------|
| AI Proxy | 多 LLM 统一代理 |
| Prompt Guard | Prompt 注入防护 |
| AI Rate Limiting | 基于 Token 的限流 |
| Semantic Cache | 语义缓存 |
| PII Sanitizer | 数据脱敏 |
| 可观测性 | Prometheus + Grafana |

### 优势

- 成熟的 API 网关基础（10 年+历史）
- Kubernetes 原生支持（Helm + Ingress CRD）
- 丰富的插件生态（100+ 插件）
- 企业级安全（mTLS, OAuth2, RBAC）

### 劣势

- AI 功能需企业版许可
- 配置复杂，学习曲线较陡
- AI 专属功能不如纯 AI 网关深入

### 配置示例

```yaml
services:
  - name: openai
    url: https://api.openai.com
    plugins:
      - name: ai-rate-limiting
        config:
          rpm: 60
          tpm: 100000
          limit_by: consumer
```

---

## Portkey

### 概述

Portkey 是专门为 AI 应用设计的网关平台，提供统一的 LLM API 接口、可观测性和 Prompt 管理。

### 核心架构

```mermaid
graph TB
    subgraph Portkey
        Gateway4[AI Gateway]
        Observability[可观测性面板]
        PromptMgr[Prompt 管理]
        CacheLayer[智能缓存]
        Guardrails[Guardrails]
        ABEngine[A/B 测试引擎]
    end

    App2[应用] --> Gateway4
    Gateway4 --> LLMs2[100+ LLM 服务]
    Gateway4 --> Observability
    Gateway4 --> PromptMgr
    Gateway4 --> CacheLayer
    Gateway4 --> Guardrails
```

### 核心能力

| 能力 | 说明 |
|------|------|
| 统一 API | 兼容 OpenAI 格式，100+ 模型 |
| 可观测性 | 请求日志、延迟追踪、成本分析 |
| 语义缓存 | 基于向量相似度的缓存 |
| Guardrails | 输入输出安全检查 |
| Prompt 模板 | 版本化 Prompt 管理 |
| A/B 测试 | 多模型/多 Prompt 对比 |
| 自动重试 | 智能故障转移 |
| 负载均衡 | 多 provider 负载均衡 |

### 使用示例

```python
from portkey_ai import Portkey

client = Portkey(
    api_key="portkey-xxx",
    virtual_key="openai-virtual-key",
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)

# 带缓存和 Guardrails
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What is AI?"}],
    cache=True,
    cache_ttl=3600,
)
```

### 优势

- AI 专属设计，功能最全面
- 开箱即用的可观测性面板
- 语义缓存节省成本
- 低代码配置
- 免费额度慷慨

### 劣势

- 闭源核心
- 企业功能需要付费
- 自部署选项有限

---

## LiteLLM

### 概述

LiteLLM 是开源的 Python 库，将 100+ LLM API 统一为 OpenAI 兼容接口。

### 核心特性

```python
from litellm import completion

# 统一接口，切换模型只需改名称
response = completion(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)

# 切换到 Anthropic
response = completion(
    model="claude-sonnet-4-20250514",
    messages=[{"role": "user", "content": "Hello"}],
)

# 切换到本地模型
response = completion(
    model="ollama/llama3.1",
    messages=[{"role": "user", "content": "Hello"}],
    api_base="http://localhost:11434",
)
```

### Proxy Server 模式

```bash
# 启动 LiteLLM Proxy
litellm --model gpt-4o --port 4000

# 带配置文件
litellm --config litellm_config.yaml --port 4000
```

```yaml
# litellm_config.yaml
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: gpt-4o
      api_key: os.environ/OPENAI_API_KEY

  - model_name: gpt-4o
    litellm_params:
      model: azure/gpt-4o
      api_key: os.environ/AZURE_API_KEY
      api_base: https://xxx.openai.azure.com

  - model_name: claude-sonnet
    litellm_params:
      model: anthropic/claude-sonnet-4-20250514
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: local-qwen
    litellm_params:
      model: ollama/qwen2.5
      api_base: http://localhost:11434

router_settings:
  routing_strategy: latency-based-routing
  allowed_fails: 3
  cooldown_time: 60

general_settings:
  master_key: sk-litellm-master
  database_url: postgresql://user:pass@localhost:5432/litellm

litellm_settings:
  drop_params: true
  set_verbose: false
  success_callback: ["prometheus", "langfuse"]
  failure_callback: ["prometheus"]
```

### 优势

- 完全开源（MIT）
- 支持模型最多（100+）
- Python 原生，集成简单
- 活跃的社区
- 支持 fallback 和负载均衡

### 劣势

- 不是完整网关（缺少缓存、安全等）
- 高并发性能有限
- 缺少可视化 UI（开源版）
- 需要 Python 环境

---

## OneAPI

### 概述

OneAPI 是国内流行的开源 AI 网关，支持统一管理多个 LLM API Key 和模型。

### 核心特性

| 特性 | 说明 |
|------|------|
| 多 API Key 轮询 | 自动负载均衡 |
| 渠道管理 | 按 provider 分组 |
| 令牌管理 | 用户级令牌 |
| 用量统计 | Token 和费用追踪 |
| 兼容 OpenAI | API 格式完全兼容 |
| Web 管理界面 | 开箱即用 |

### Docker 部署

```bash
docker run --name one-api \
  -p 3000:3000 \
  -e TZ=Asia/Shanghai \
  -v /home/one-api:/data \
  justsong/one-api

# 访问 http://localhost:3000
# 默认账号 root / 123456
```

### 优势

- 中文友好，国内用户多
- 开源免费
- Web 管理界面
- 简单易用

### 劣势

- 功能相对基础
- 社区主要在国内
- 缺少高级缓存和安全功能
- 高并发稳定性待验证

---

## OpenRouter

### 概述

OpenRouter 是一个统一的 AI 模型路由平台，提供一个 API 访问数百个模型。

### 核心特性

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="sk-or-xxx",
)

# 自动选择最便宜的 provider
response = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)

# 使用 fallback 模型
response = client.chat.completions.create(
    model="openai/gpt-4o",
    model_fallback=["anthropic/claude-sonnet-4-20250514"],
    messages=[{"role": "user", "content": "Hello"}],
)
```

### 优势

- 一个 API 访问所有模型
- 自动 fallback
- 透明的定价

### 劣势

- 闭源 SaaS
- 额外的延迟（经过 OpenRouter 转发）
- 依赖第三方

---

## Helicone

### 概述

Helicone 是 AI 应用的可观测性平台，专注于 LLM 请求监控和分析。

### 核心能力

```python
from helicone import helicone_proxy
import openai

# 通过 Helicone 代理
client = openai.OpenAI(
    base_url="https://api.helicone.ai/v1",
    api_key="sk-helicone-xxx",
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)
```

### 优势

- 最强的 LLM 可观测性面板
- 请求级别的详细追踪
- 成本分析仪表板
- 缓存功能

### 劣势

- 主要是监控，不是完整网关
- 闭源
- 免费额度有限

---

## AI Proxy 设计模式

### 模式一：统一代理

```mermaid
graph LR
    App3[应用] --> Proxy[AI Proxy]
    Proxy --> |OpenAI 格式| Model2[任意模型]
```

### 模式二：多模型路由

```mermaid
graph LR
    App4[应用] --> Router4[路由器]
    Router4 --> |简单| Cheap2[小模型]
    Router4 --> |复杂| Strong2[大模型]
```

### 模式三：Fallback 链

```mermaid
graph LR
    App5[应用] --> Primary[主模型]
    Primary --> |失败| Secondary[备选1]
    Secondary --> |失败| Tertiary[备选2]
```

### 模式四：负载均衡

```mermaid
graph LR
    App6[应用] --> LB2[负载均衡器]
    LB2 --> P1[Provider 1]
    LB2 --> P2[Provider 2]
    LB2 --> P3[Provider 3]
```

---

## 选型指南

### 综合对比矩阵

| 维度 | Kong AI | Portkey | LiteLLM | OneAPI | OpenRouter | Helicone |
|------|---------|---------|---------|--------|------------|----------|
| **开源** | 部分 | 部分 | 完全 | 完全 | 否 | 否 |
| **类型** | 网关+插件 | AI 平台 | Python 库 | Web 平台 | SaaS | 监控平台 |
| **模型支持** | 全部 | 100+ | 100+ | 主流 | 200+ | OpenAI 为主 |
| **限流** | 强 | 强 | 基础 | 中 | 有 | 无 |
| **缓存** | 语义缓存 | 语义缓存 | 无 | 无 | 无 | 有 |
| **可观测性** | Prometheus | 内置强 | Langfuse | 基础 | 基础 | 最强 |
| **安全** | 最强 | 强 | 无 | 中 | 无 | 无 |
| **K8s** | 原生 | 一般 | 无 | Docker | 无 | 无 |
| **Prompt 管理** | 插件 | 内置 | 无 | 无 | 无 | 无 |
| **自部署** | 支持 | 支持 | 支持 | 支持 | 不支持 | 不支持 |
| **学习曲线** | 高 | 低 | 低 | 低 | 最低 | 低 |
| **性能** | 高 | 中 | 中 | 中 | 中 | 中 |

### 按场景选型

#### 企业级部署

```
推荐: Kong AI Gateway 或 Portkey

理由：
- 企业需要完整的 API 管理能力
- 需要与现有 API 网关集成（Kong）
- 需要合规和安全审计
- 需要 SLA 保障
```

#### 初创公司

```
推荐: Portkey 或 LiteLLM

理由：
- 快速集成，低运维成本
- 免费额度满足早期需求
- 灵活切换模型
- Portkey 的可观测性帮助优化 Prompt
```

#### 个人开发者

```
推荐: LiteLLM 或 OneAPI

理由：
- 完全免费开源
- 5 分钟部署
- OneAPI 的 Web 界面管理方便
- LiteLLM 的 Python 集成最简单
```

#### 需要最强可观测性

```
推荐: Helicone + LiteLLM

理由：
- Helicone 提供最详细的请求追踪
- LiteLLM 统一多模型接口
- Helicone 的缓存减少成本
```

### 决策树

```mermaid
graph TD
    Start3[选择 AI Gateway] --> Q1{是否需要自部署？}
    Q1 -->|否| Q2{需要可观测性？}
    Q1 -->|是| Q3{已有 Kong？}

    Q2 -->|强| Helicone2[Helicone]
    Q2 -->|一般| OpenRouter2[OpenRouter]

    Q3 -->|是| Kong2[Kong AI Gateway]
    Q3 -->|否| Q4{团队技术栈？}

    Q4 -->|Python| LiteLLM2[LiteLLM]
    Q4 -->|Go/Java| Portkey2[Portkey]
    Q4 -->|中文团队| OneAPI2[OneAPI]
```

---

## 成本分析

### 网关自身成本

| 方案 | 基础成本 | 免费额度 | 企业版价格 |
|------|---------|---------|-----------|
| Kong AI | 开源免费 | 社区版免费 | ~$500/mo/节点 |
| Portkey | 免费起步 | 10K 请求/月 | ~$99-499/mo |
| LiteLLM | 完全免费 | 无限 | 企业支持 ~$500/mo |
| OneAPI | 完全免费 | 无限 | 无 |
| OpenRouter | 按使用付费 | 免费额度 | 按量 |
| Helicone | 免费起步 | 50K 请求/月 | ~$49-499/mo |

### 网关带来的成本节省

```
节省来源：

1. 语义缓存：节省 20-40% 的 API 调用
   - 相同/相似问题直接返回缓存
   - 减少重复 LLM 调用

2. 智能路由：节省 30-50% 的推理成本
   - 简单问题路由到便宜模型
   - 复杂问题才用昂贵模型

3. 限流控制：避免超额使用
   - 防止误操作导致大量调用
   - 预算上限保护

4. 自动 Fallback：提高可用性
   - 主服务不可用时自动切换
   - 避免业务中断损失

总体成本节省估算：
  小团队：$100-500/月
  中型团队：$500-2000/月
  大型企业：$5000+/月
```

---

## 迁移指南

### 从直接调用迁移到网关

```python
# === 迁移前：直接调用 OpenAI ===
from openai import OpenAI

client = OpenAI(api_key="sk-xxx")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)

# === 迁移后：通过网关调用 ===
# 只需修改 base_url 和 api_key

# 方案 1: LiteLLM Proxy
client = OpenAI(
    base_url="http://litellm-proxy:4000/v1",
    api_key="sk-litellm-master",
)

# 方案 2: Portkey
from portkey_ai import Portkey
client = Portkey(
    api_key="portkey-xxx",
    virtual_key="openai-key",
)

# 方案 3: Kong AI Gateway
client = OpenAI(
    base_url="http://kong-gateway:8000/v1",
    api_key="kong-api-key",
)

# 业务代码完全不变
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)
```

### 渐进式迁移步骤

```mermaid
graph LR
    Step1[1. 部署网关] --> Step2[2. 配置路由]
    Step2 --> Step3[3. 灰度切流]
    Step3 --> Step4[4. 全量迁移]
    Step4 --> Step5[5. 启用高级功能]
```

```
迁移检查清单：

Phase 1: 基础路由
  [ ] 部署网关服务
  [ ] 配置所有使用的模型
  [ ] 配置认证
  [ ] 验证 API 兼容性

Phase 2: 可观测性
  [ ] 启用请求日志
  [ ] 配置 Prometheus 指标
  [ ] 搭建 Grafana 面板
  [ ] 设置告警规则

Phase 3: 安全与优化
  [ ] 启用限流
  [ ] 配置 Prompt Guard
  [ ] 启用语义缓存
  [ ] 配置 Fallback 链

Phase 4: 高级功能
  [ ] Prompt 版本管理
  [ ] A/B 测试
  [ ] 成本追踪
  [ ] 多团队隔离
```

---

## 总结

### 2026 年 AI Gateway 趋势

```
┌─────────────────────────────────────────────┐
│          AI Gateway 2026 趋势                │
├─────────────────────────────────────────────┤
│                                             │
│  1. 语义缓存成为标配                         │
│     基于向量相似度，节省 30%+ 调用           │
│                                             │
│  2. AI-native 安全                          │
│     Prompt 注入检测 + 输出安全 + PII 脱敏    │
│                                             │
│  3. 智能路由                                 │
│     基于任务复杂度自动选择最优模型            │
│                                             │
│  4. 成本可观测性                             │
│     实时成本追踪 + 预算控制 + 费用分摊       │
│                                             │
│  5. 多模态支持                               │
│     不仅支持文本，还支持图像、音频、视频      │
│                                             │
│  6. 与 Agent 框架集成                        │
│     为 AI Agent 提供工具调用和编排能力        │
│                                             │
└─────────────────────────────────────────────┘
```

### 相关文档

- [Kong AI Gateway 深度解析](架构基建/AI_Gateway/Kong_AI_Gateway_Deep_Dive.md)
- [Portkey 深度解析](架构基建/AI_Gateway/Portkey_Deep_Dive.md)
- [LiteLLM 深度解析](架构基建/AI_Gateway/LiteLLM_Deep_Dive.md)
- [AI Gateway 2026 概述](架构基建/AI_Gateway/AI_Gateway_2026.md)
- [API 设计 for AI](93_Templates/API_Design_for_AI.md)
- [部署推理 2026](部署推理/Deployment_Inference_2026.md)

## Related

- [[架构基建/AI_Gateway/AI_Gateway_2026.md|AI_Gateway_2026]]
- [[架构基建/AI_Gateway/AI_Gateway_for_dummy.md|AI_Gateway_for_dummy]]
- [[架构基建/AI_Gateway/Cohere_Deep_Dive.md|Cohere_Deep_Dive]]
- [[架构基建/AI_Gateway/Gateway-in-nutshell.md|Gateway-in-nutshell]]
- [[架构基建/AI_Gateway/Kong_AI_Gateway_Deep_Dive.md|Kong_AI_Gateway_Deep_Dive]]
