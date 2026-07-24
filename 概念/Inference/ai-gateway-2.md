---
title: "AI Gateway 2.0 (LiteLLM / Kong AI / Envoy AI / APISIX / 多 LLM 路由)"
category: concepts
tags:
  - inference
  - ai-gateway
  - litellm
  - kong-ai
  - envoy-ai-gateway
  - apisix
  - multi-llm
  - llm-routing
aliases:
  - AI Gateway 2.0
  - LiteLLM
  - Kong AI Gateway
  - Envoy AI Gateway
  - APISIX AI Gateway
  - LLM Gateway
  - Multi-LLM Routing
relationships:
  - target: "概念/model-gateway"
    type: extends
  - target: "概念/litellm"
    type: related_to
  - target: "概念/inference-performance"
    type: related_to
  - target: "概念/llm-infrastructure"
    type: related_to
summary: "AI Gateway 2.0 是 2024-2026 企业级 LLM 路由基础设施——LiteLLM(100+ 模型统一 API)、Kong AI Gateway(企业级流量管理)、Envoy AI Gateway(K8s 原生)、APISIX AI(国产开源)、Portkey(可观测性)、OpenRouter(消费者市场)。统一鉴权 / 限流 / 路由 / 缓存 / 日志,跨多模型供应商。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# AI Gateway 2.0

> **一句话理解**:AI Gateway 是 LLM 时代的"Kong"——把 OpenAI / Anthropic / Google / 自托管 / Bedrock / Azure 100+ 模型统一为 OpenAI 兼容 API,加鉴权 / 限流 / 路由 / 缓存 / 审计 / 成本管控。是企业 LLM 落地的基础设施。

---

## 一、为什么需要 AI Gateway?

LLM 调用直接接 API 的痛点:
- **供应商切换困难**:每个供应商 API 格式不同
- **限流管理**:每供应商单独限流
- **成本失控**:无统一账单,易爆量
- **审计缺失**:调用留痕难
- **多模型路由**:不同任务不同模型
- **Fallback**:主模型挂了怎么办

AI Gateway 解法:
- 统一 OpenAI 兼容 API
- 统一鉴权 / 限流 / 配额
- 智能路由(便宜 → 复杂)
- 统一日志 / 监控 / 计费
- Fallback / Load Balancing

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| AI 网关 | AI Gateway | LLM 流量统一入口 |
| 模型路由 | Model Routing | 根据任务选模型 |
| 限流 | Rate Limiting | 防止超额 |
| 回退 | Fallback | 主模型失败转备 |
| 负载均衡 | Load Balancing | 多实例分担 |
| 统一 API | Unified API | 兼容 OpenAI |
| 鉴权 | Authentication | API Key / OAuth |
| 配额 | Quota | 用户 / 租户限制 |
| 成本追踪 | Cost Tracking | 按模型 / 用户计费 |
| 语义缓存 | Semantic Cache | 见 RAG 卡 |
| PII 检测 | PII Detection | 输入输出脱敏 |
| 重试 | Retry | 失败重试 |
| 熔断 | Circuit Breaker | 持续失败熔断 |
| 流式响应 | Streaming | SSE 流式 |
| 多租户 | Multi-Tenant | 多用户隔离 |
| 审计日志 | Audit Log | 完整调用留痕 |
| 数据脱敏 | Data Masking | 敏感信息过滤 |
| 工具调用 | Tool Calling | 路由到合适的工具 |
| 异步队列 | Async Queue | 长任务异步处理 |
| 可观测性 | Observability | 指标 / 日志 / 追踪 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 厂商/团队 | 定位 | GitHub Stars | 许可证 | 特色 |
|---|---|---|---|---|---|
| **LiteLLM** | BerriAI | Python 代理 | 13K+ | MIT | 100+ 模型统一 API |
| **Kong AI Gateway** | Kong | 企业级 | — | 商业 + Apache | 流量管理 + 插件生态 |
| **Envoy AI Gateway** | Envoy / CNCF | K8s 原生 | 1.5K+ | Apache 2.0 | Gateway API + ext_proc |
| **APISIX AI** | Apache APISIX | 国产开源 | 14K+ | Apache 2.0 | 国产化,功能全 |
| **Portkey** | Portkey AI | 可观测 | 1.5K+ | Apache 2.0 | 监控 + 成本 + 路由 |
| **OpenRouter** | OpenRouter | 消费市场 | — | 商业 | 100+ 模型按 token 计费 |
| **Helicone** | Helicone | 可观测 | 3K+ | MIT | 监控 + 缓存 + 审计 |
| **BentoML** | BentoML | 全栈 | 7K+ | Apache 2.0 | 模型部署 + 推理 |
| **Cloudflare AI Gateway** | Cloudflare | 边缘 | — | 商业 | 全球边缘 + 缓存 |
| **Azure API Management** | Microsoft | 企业 | — | 商业 | Azure 集成 |
| **AWS Bedrock** | Amazon | 托管 | — | 商业 | AWS 集成 |
| **Google Cloud Model Garden** | Google | 托管 | — | 商业 | GCP 集成 |

---

## 四、LiteLLM 实战(开源主流)

### 4.1 安装

```bash
pip install litellm[proxy]
```

### 4.2 配置(config.yaml)

```yaml
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
  - model_name: claude-opus
    litellm_params:
      model: anthropic/claude-opus-4-5
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: qwen3-local
    litellm_params:
      model: openai/Qwen/Qwen3-72B
      api_base: http://localhost:8000/v1
      api_key: "EMPTY"
  
router_settings:
  num_retries: 3
  timeout: 30
  
general_settings:
  master_key: sk-litellm-master
  database_url: "postgresql://user:pass@localhost/litellm"
```

### 4.3 启动

```bash
litellm --config config.yaml --port 4000
```

### 4.4 使用

```python
import openai

client = openai.OpenAI(
    api_key="sk-litellm-master",
    base_url="http://localhost:4000/v1"
)

# 统一 API,自动路由到对应后端
response = client.chat.completions.create(
    model="claude-opus",  # 任何模型
    messages=[{"role": "user", "content": "Hello"}]
)
```

---

## 五、Envoy AI Gateway 实战(K8s 原生)

### 5.1 架构

```
[Client]
   ↓
Envoy Gateway(AI Gateway ext_proc)
   ↓
[Backend LLM Pool: OpenAI/Anthropic/Local]
```

### 5.2 安装

```bash
helm install ai-gateway oci://docker.io/envoyproxy/ai-gateway-helm --version v0.3
```

### 5.3 配置

```yaml
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: AIGatewayRoute
metadata:
  name: my-ai-route
spec:
  parentRefs:
  - name: my-gateway
  rules:
  - matches:
    - headers:
      - type: RegularExpression
        name: x-llm-model
        value: gpt-4o
    backendRefs:
    - name: openai-backend
---
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: Backend
metadata:
  name: openai-backend
spec:
  provider: OpenAI
  model: gpt-4o
  apiKey: $OPENAI_API_KEY
```

### 5.4 关键能力

- **K8s Gateway API 原生**
- **ext_proc**:插件式预处理(限流/缓存)
- **流量镜像**:复制请求到测试模型
- **跨集群**:联邦路由

---

## 六、Kong AI Gateway 实战(企业级)

### 6.1 关键能力

- 完整 AI 插件生态
- 多模型负载均衡
- 内容安全(PII / 毒性)
- 语义缓存
- 成本分析

### 6.2 实战

```yaml
services:
  - name: openai-service
    url: https://api.openai.com/v1
    routes:
      - paths: ["/v1/chat"]
    plugins:
      - name: ai-proxy
        config:
          model_provider: openai
          auth:
            header_name: Authorization
      - name: ai-semantic-cache
        config:
          embeddings: openai/text-embedding-3-small
          threshold: 0.9
      - name: ai-rate-limiting
        config:
          limit_by: consumer
          policy: local
          minute: 100
```

---

## 七、生产最佳实践

1. **首选 LiteLLM(快速验证)**:Python 代理,100+ 模型,快速部署。
2. **K8s 环境选 Envoy AI Gateway**:原生,生产稳定。
3. **企业级用 Kong AI Gateway**:插件丰富,合规完善。
4. **国产化用 APISIX AI**:国内云原生首选,功能对标 Kong。
5. **多模型路由**:简单任务 Haiku / 复杂任务 Opus / 代码 Codestral,降本 50%+。
6. **Fallback 必做**:主模型 + 备模型,熔断保护。
7. **语义缓存 + 限流**:成本可降 60%+。
8. **PII 检测必备**:合规,自动脱敏。
9. **审计日志**:所有调用留痕,合规 + 复盘。
10. **成本仪表盘**:按用户 / 模型 / 任务拆分。
11. **可观测性**:Langfuse / OpenTelemetry 集成。
12. **A/B 测试**:不同模型对比,持续优化路由策略。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **LiteLLM** | v1.40+,100+ 模型,事实标准 |
| **Kong AI** | v3.0,企业级 + 合规 |
| **Envoy AI Gateway** | v0.4,K8s 首选 |
| **APISIX AI** | v3.0+,国产化首选 |
| **Portkey** | v1.5,可观测性领先 |
| **OpenRouter** | ARR $50M+,消费者市场领先 |
| **Cloudflare AI Gateway** | 边缘场景首选 |
| **企业应用** | 99% 大企业部署 AI Gateway |
| **市场规模** | AI Gateway ARR $500M+ |
| **主要竞品** | LiteLLM / Kong / Envoy / APISIX / Portkey / Cloudflare |

---

## 九、See Also(官方源)

### LiteLLM

- 仓库 [github.com/BerriAI/litellm](https://github.com/BerriAI/litellm)
- 文档 [docs.litellm.ai](https://docs.litellm.ai/)

### Kong

- AI Gateway [konghq.com/products/kong-ai-gateway](https://konghq.com/products/kong-ai-gateway)
- 文档 [docs.konghq.com/hub](https://docs.konghq.com/hub/)

### Envoy

- AI Gateway [github.com/envoyproxy/ai-gateway](https://github.com/envoyproxy/ai-gateway)
- Gateway API [gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/)

### APISIX

- AI 插件 [apisix.apache.org/blog/2024/11/22/ai-gateway](https://apisix.apache.org/blog/2024/11/22/ai-gateway/)
- 仓库 [github.com/apache/apisix](https://github.com/apache/apisix)

### 其他

- Portkey [github.com/Portkey-AI/gateway](https://github.com/Portkey-AI/gateway)
- OpenRouter [openrouter.ai](https://openrouter.ai/)
- Helicone [github.com/Helicone/helicone](https://github.com/Helicone/helicone)

---

## 十、相关概念卡

- [[概念/model-gateway|Model Gateway]]
- [[概念/litellm|Litellm]]
- [[概念/inference-performance|Inference Performance]]
- [[概念/llm-infrastructure|Llm Infrastructure]]
- [[概念/llm-safety|Llm Safety]]
- [[概念/rag-caching|Rag Caching]]
- [[概念/llm-as-judge|Llm As Judge]]
- [[概念/inference-autoscaling|Inference Autoscaling]]
