---
title: LLM Gateway 深度实战：设计、实现与运维模板
category: 93-templates
tags: [llm-gateway, production, inference, routing, load-balancing, fallback, rate-limiting, key-management, cost-optimization, observability, terraform, helm, ai-ops]
summary: 面向生产环境的 LLM Gateway 设计与运维深度指南，系统覆盖路由、负载均衡、Fallback、限流、密钥管理、成本归因、可观测性，并提供 LiteLLM、Portkey、Cloudflare AI Gateway、Kong AI Gateway 的对比与 Terraform/Helm 部署模板。
created: 2026-07-01
updated: 2026-07-01
sources: []
---

# LLM Gateway 深度实战：设计、实现与运维模板

> **一句话理解**：LLM Gateway 是 AI 应用与底层模型/推理服务之间的“中间层”，它把多模型路由、流量治理、成本控制和可观测性从业务代码中解耦出来，让企业能够以工程化、可复现的方式大规模运行生成式 AI 服务。

---

## Table of Contents

- [1. 为什么需要 LLM Gateway](#1-为什么需要-llm-gateway)
- [2. Gateway 核心能力详解](#2-gateway-核心能力详解)
  - [2.1 模型路由（Routing）](#21-模型路由routing)
  - [2.2 负载均衡（Load Balancing）](#22-负载均衡load-balancing)
  - [2.3 故障转移与 Fallback](#23-故障转移与-fallback)
  - [2.4 限流、配额与流控](#24-限流配额与流控)
  - [2.5 密钥与凭据管理](#25-密钥与凭据管理)
- [3. 主流方案对比](#3-主流方案对比)
  - [3.1 LiteLLM](#31-litellm)
  - [3.2 Portkey](#32-portkey)
  - [3.3 Cloudflare AI Gateway](#33-cloudflare-ai-gateway)
  - [3.4 Kong AI Gateway](#34-kong-ai-gateway)
  - [3.5 选型决策矩阵](#35-选型决策矩阵)
- [4. 成本归因与配额管理](#4-成本归因与配额管理)
- [5. 可观测性集成](#5-可观测性集成)
- [6. 生产部署模板](#6-生产部署模板)
  - [6.1 Terraform 部署 LiteLLM 到 AWS/EKS](#61-terraform-部署-litellm-到-awseks)
  - [6.2 Helm 部署到 Kubernetes](#62-helm-部署到-kubernetes)
- [7. 生产落地 Checklist](#7-生产落地-checklist)
- [8. 风险与最佳实践](#8-风险与最佳实践)
- [Related](#related)

---

## 1. 为什么需要 LLM Gateway

在生成式 AI 落地的早期，很多团队直接把 OpenAI/Azure/Anthropic 的 SDK 调用嵌入到业务服务中。这种“直连模型”的方式在项目验证阶段足够快，但进入生产后很快暴露出系统性问题：

1. **供应商锁定**：业务代码里硬编码了某一家 API 的 URL、请求格式和错误处理，切换模型需要改多处代码。
2. **流量不可控**：没有统一的限流、配额和优先级策略，某个低优先级批处理任务可能把 API Key 的额度打满，导致线上实时服务被限流。
3. **成本黑洞**：不同模型、不同 region、不同 token 价格混杂在一起，无法准确归因到业务线或项目。
4. **故障恢复脆弱**：当主模型返回 429/500 时，业务代码往往只能简单重试，缺乏跨模型/跨 region 的自动 Fallback。
5. **安全与合规缺口**：API Key 散落在多个服务里，PII/敏感数据未经统一审计直接出境，难以满足等保、GDPR、HIPAA 等要求。
6. **可观测性缺失**：请求延迟、TTFT（Time To First Token）、TPOT（Time Per Output Token）、输入输出 token 数、错误码分布等关键指标无法统一采集。

LLM Gateway 应运而生。它位于应用层与模型/推理层之间，向上暴露统一、与厂商无关的 API（通常是 OpenAI-compatible API），向下对接多个模型供应商或自托管推理集群，集中承担路由、治理、安全和可观测性职责。通过引入 Gateway，企业可以把“模型调用”从“业务逻辑”中解耦，从而像管理数据库连接池、消息队列一样管理 AI 推理流量。

---

## 2. Gateway 核心能力详解

### 2.1 模型路由（Routing）

路由是 Gateway 最基础也最关键的能力。生产环境中常见的路由策略包括：

- **模型名路由**：根据请求的 `model` 字段转发到对应后端，例如 `gpt-4o` → Azure OpenAI，`claude-3-5-sonnet` → Anthropic。
- **意图/任务路由**：根据 prompt 分类结果把请求分发到不同模型。例如简单摘要走轻量模型，复杂推理走推理模型，代码生成走代码专用模型。
- **A/B 测试路由**：按流量比例或用户 ID 哈希把请求分发到不同模型版本，用于评估新模型效果。
- **金丝雀/灰度路由**：新版本模型先接入 1%～5% 流量，观察延迟、错误率和业务指标后再扩大。
- **区域/合规路由**：根据数据来源或用户所在地，把请求路由到符合数据主权要求的 region，例如欧盟用户必须落在欧盟 endpoint。

路由配置应当与业务代码解耦，支持热更新。推荐把路由规则放在 Gateway 的配置中心（如 Consul、Etcd、AWS AppConfig），或者通过 GitOps 方式管理，实现版本化和回滚。

### 2.2 负载均衡（Load Balancing）

当后端存在多个推理实例或多个同模型供应商账号时，Gateway 需要实现负载均衡：

- **Round Robin**：最简单的轮询，适用于后端能力均等的场景。
- **Weighted Round Robin**：给性能更强或成本更低的实例更高权重。
- **Least Connections / Least Latency**：把请求发到当前连接数最少或最近 N 次平均延迟最低的实例，适合长连接流式请求。
- **Token-based 负载均衡**：根据当前队列中的预估 token 数进行调度，避免把大量长文本请求都打到同一个实例，造成队头阻塞（head-of-line blocking）。
- **Region-aware 负载均衡**：优先选择距离用户最近或成本最低的区域，失败时再跨区重试。

在自托管推理集群（vLLM/TGI/SGLang）场景中，负载均衡还需要考虑 GPU 显存水位、KV Cache 占用、当前 batch 大小等运行时指标，这通常需要配合自定义 exporter 和 Gateway 的实时健康检查。

### 2.3 故障转移与 Fallback

生产环境必须假设模型服务随时可能失败。Gateway 需要提供多层次的 Fallback 能力：

1. **同模型跨区 Fallback**：Azure OpenAI `eastus` 失败时，自动切到 `westus`。
2. **同厂商不同模型 Fallback**：`gpt-4o` 触发 429 时，降级到 `gpt-4o-mini` 或 `gpt-3.5-turbo`。
3. **跨厂商 Fallback**：主供应商完全不可用时，切换到备用供应商（如 Anthropic → OpenAI → 自托管模型）。
4. **功能降级 Fallback**：当生成模型不可用时，返回预置的兜底模板或缓存结果，保证业务可用性不低于最低阈值。

Fallback 策略需要谨慎设计，避免“降级风暴”：

- 设置最大重试次数和指数退避（exponential backoff）。
- 对 Fallback 链路上的请求设置更短的超时，防止级联阻塞。
- 区分可重试错误（5xx、429、超时）和不可重试错误（4xx、内容过滤）。
- 记录 Fallback 触发次数和原因，用于后续 SLO 复盘。

### 2.4 限流、配额与流控

限流（Rate Limiting）和配额（Quota Management）是保障多租户、多业务线公平使用模型资源的核心手段：

- **请求级限流**：按每秒请求数（RPS）限制，防止突发流量冲垮后端。
- **Token 级限流**：按每分钟/每小时 token 数限制，更贴合 LLM 的成本模型。
- **并发连接限流**：限制同时进行的流式请求数量，保护 GPU 推理服务的连接池。
- **用户/租户级配额**：为不同业务线、项目或客户设置月度/年度 token 预算，超限时触发告警或拒绝。
- **优先级队列**：高优先级实时请求优先通过，低优先级批处理请求进入队列或限速执行。

生产实践中，限流策略应当支持多层：Gateway 层做粗粒度保护，后端模型供应商再做细粒度控制。同时，限流响应应当返回标准的 HTTP 429 和 `Retry-After` 头，方便客户端配合退避。

### 2.5 密钥与凭据管理

API Key 的集中管理是 Gateway 的安全基础：

- **密钥不落地业务代码**：所有供应商 API Key 只保存在 Gateway 的 secret store（如 AWS Secrets Manager、HashiCorp Vault、Azure Key Vault）中。
- **密钥轮换**：支持多版本 Key 共存，按权重灰度切换到新 Key，轮换过程对业务透明。
- **最小权限**：为不同业务线分配不同的 Gateway API Key，并绑定到具体的模型白名单、配额和审计策略。
- **密钥失效熔断**：当某个供应商 Key 被吊销或额度耗尽时，自动将其从路由池中摘除。
- **请求签名与校验**：对 Gateway 暴露给内部的 API 进行认证（API Key、JWT、mTLS），防止未授权调用。

---

## 3. 主流方案对比

### 3.1 LiteLLM

LiteLLM 是目前最流行的开源 LLM Gateway 之一，以“100+ 模型统一接口”著称。

**核心优势**：

- 支持 OpenAI、Anthropic、Azure、Gemini、Cohere、Mistral、Bedrock、自托管 vLLM 等 100+ 后端。
- 向上暴露 OpenAI-compatible 接口，业务侧几乎零改造。
- 内置模型路由、Fallback、重试、限流、预算管理、虚拟 Key、Team/Organization 隔离。
- 提供 Proxy Server 和 Python SDK 两种使用模式。
- 社区活跃，文档完善，GitHub Star 数高。

**适用场景**：

- 需要快速接入多供应商、多模型的中小团队。
- 已有 Python 技术栈，希望用开源方案自托管 Gateway。
- 对成本归因、虚拟 Key、预算告警有强需求。

**生产注意点**：

- 高可用部署需要自己配置多副本 + 数据库（PostgreSQL）+ Redis。
- 大规模流量下需要关注 Proxy 的吞吐和延迟，必要时在前端加一层 Nginx/Envoy。
- 部分高级功能（如企业级 SSO、审计日志）需要 Enterprise 版本。

### 3.2 Portkey

Portkey 是一个面向企业级 LLM 应用的全栈 Gateway + 可观测性平台，提供 SaaS 和自托管两种部署方式。

**核心优势**：

- 内置强大的可观测性：请求追踪、延迟分析、成本 Dashboard、Prompt 版本管理。
- 支持 Gateway 功能：路由、Fallback、重试、缓存、Guardrails、A/B 测试。
- 提供 Prompt Management 和 evaluation 能力，与 Gateway 结合形成 LLMOps 闭环。
- 企业级功能完善：SSO、RBAC、审计、合规报告。

**适用场景**：

- 需要一站式 LLMOps 平台，不想自己拼装多个工具。
- 对 Prompt 版本、A/B 测试、成本归因有强需求。
- 愿意接受 SaaS 或企业级自托管方案。

**生产注意点**：

- SaaS 版本需要考虑数据出境和延迟问题，敏感业务建议选择自托管。
- 成本高于纯开源方案，但节省了自研和运维人力。

### 3.3 Cloudflare AI Gateway

Cloudflare AI Gateway 是 Cloudflare 推出的边缘侧 LLM Gateway，集成在 Cloudflare Workers 生态中。

**核心优势**：

- 部署在 Cloudflare 全球边缘节点，延迟低，就近接入。
- 原生支持缓存、日志、Analytics、Fallback、Rate Limiting。
- 与 Workers、KV、D1、R2 等 Cloudflare 服务深度集成。
- 计费方式与 Cloudflare 网络流量结合，适合已有 Cloudflare 生态的团队。

**适用场景**：

- 应用已经运行在 Cloudflare Workers 或 Pages 上。
- 需要全球边缘低延迟接入，用户分布广泛。
- 希望减少自行运维 Gateway 的负担。

**生产注意点**：

- 支持的模型和后端受限于 Cloudflare 的集成列表，灵活性不如 LiteLLM。
- 复杂路由策略和自定义逻辑需要写 Workers 脚本。
- 数据出境和合规需评估 Cloudflare 的服务条款。

### 3.4 Kong AI Gateway

Kong AI Gateway 是 Kong 公司在 2024 年推出的面向 AI 应用的 API Gateway 扩展，基于 Kong Gateway 插件体系。

**核心优势**：

- 基于成熟的企业级 API Gateway（Kong），继承高可用、插件生态、多协议支持。
- 通过插件提供 LLM 路由、Prompt 转换、语义缓存、AI 流量控制、PII 检测。
- 支持混合云、多云部署，适合已有 Kong 基础设施的大型企业。
- 与 Kong Manager、Konnect 控制面集成，便于统一治理。

**适用场景**：

- 企业已有 Kong Gateway 或 API 管理平台。
- 需要把 AI API 与传统 REST/gRPC API 统一治理。
- 对安全、合规、企业级支持要求高。

**生产注意点**：

- 学习曲线和部署复杂度高于 LiteLLM。
- AI 插件生态仍在快速演进中，需跟踪版本更新。
- 自托管 Kong 集群需要专业的运维团队。

### 3.5 选型决策矩阵

| 维度 | LiteLLM | Portkey | Cloudflare AI Gateway | Kong AI Gateway |
|---|---|---|---|---|
| 部署模式 | 开源自托管 / 企业版 | SaaS / 自托管 | SaaS（边缘） | 自托管 / Konnect |
| 模型支持 | 100+，最广泛 | 主流模型 | Cloudflare 集成模型 | 通过插件扩展 |
| 路由能力 | 强 | 强 | 中等 | 强 |
| 可观测性 | 中等 | 强 | 强 | 中等（需插件） |
| 成本归因 | 强 | 强 | 中等 | 中等 |
| 企业安全/合规 | 企业版支持 | 强 | 中等 | 强 |
| 运维复杂度 | 中等 | 低（SaaS） | 低 | 高 |
| 适用团队 | 技术型团队 | 追求效率的团队 | Cloudflare 用户 | 已有 Kong 基础的大企业 |

选型建议：

- **初创/中小团队，快速落地**：LiteLLM Proxy。
- **需要 LLMOps 全栈能力**：Portkey。
- **Cloudflare 生态/边缘低延迟**：Cloudflare AI Gateway。
- **已有 Kong/企业级 API 治理**：Kong AI Gateway。

---

## 4. 成本归因与配额管理

成本是 LLM 生产落地中最敏感的指标之一。Gateway 必须把成本透明化、可归因化：

- **请求级成本记录**：记录每次请求的模型、输入 token、输出 token、缓存命中情况、后端供应商、区域，计算单次请求成本。
- **多维度归因**：按业务线（team）、项目（project）、环境（env）、用户（user）、功能（feature）打标签，汇总到成本报表。
- **预算与告警**：为每个维度设置月度/季度预算，达到 80% 触发预警，达到 100% 触发限流或审批流程。
- **配额硬限制**：防止某个业务线无限制调用高成本模型，例如限制“客服机器人”每月只能使用 1000 万 token 的 GPT-4o。
- **缓存降本**：对重复或相似的 prompt 启用语义缓存（semantic cache），显著降低调用成本。
- **模型降级策略**：当成本超过阈值时，自动把非关键请求路由到 cheaper model。

成本归因的常用标签设计：

```yaml
# 请求头或 metadata 中携带
team: customer-success
project: chatbot-v2
env: production
feature: ticket-summary
model: gpt-4o
provider: azure-openai
region: eastus
```

Gateway 侧在日志和 metrics 中输出：

```
llm_request_cost_total{team="customer-success", project="chatbot-v2", model="gpt-4o"} 0.0234
llm_request_tokens_input_total{...} 1250
llm_request_tokens_output_total{...} 340
```

---

## 5. 可观测性集成

LLM Gateway 是可观测性的最佳采集点。建议把以下指标接入 Prometheus/Grafana、Datadog 或 New Relic：

**延迟指标**：

- `llm_request_duration_seconds`：端到端请求耗时（P50/P95/P99）。
- `llm_time_to_first_token_seconds`：流式响应的首 token 延迟。
- `llm_time_per_output_token_seconds`：每个输出 token 的平均耗时。

**流量指标**：

- `llm_requests_total`：按模型、供应商、状态码、业务线分维度的请求数。
- `llm_tokens_input_total` / `llm_tokens_output_total`：输入输出 token 数。
- `llm_active_requests`：当前并发请求数。

**成本指标**：

- `llm_request_cost_total`：单次/累计请求成本。
- `llm_cache_hit_total`：缓存命中次数。

**质量指标**：

- `llm_fallback_total`：Fallback 触发次数和原因。
- `llm_rate_limited_total`：限流触发次数。
- `llm_errors_total`：按错误码分类的错误数。

**Tracing**：

- 通过 OpenTelemetry 把每次请求建模为 span，包含路由决策、后端调用、重试、缓存命中、成本计算等子 span。
- 与业务 trace 关联，形成从用户请求 → Gateway → 模型 → 下游工具的完整链路。

**Logging**：

- 记录请求 ID、模型、供应商、延迟、token 数、成本、错误信息。
- 对敏感输入输出进行脱敏或哈希处理，满足合规要求。
- 日志保留策略根据合规要求设置，通常 30～90 天。

---

## 6. 生产部署模板

### 6.1 Terraform 部署 LiteLLM 到 AWS/EKS

以下是一个最小可用的 Terraform 片段，用于在 AWS EKS 上部署 LiteLLM Proxy：

```hcl
# variables.tf
variable "litellm_image" {
  default = "ghcr.io/berriai/litellm:main-latest"
}

variable "db_password" {
  sensitive = true
}

# main.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "ai-guru-litellm"
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    general = {
      desired_size = 2
      min_size     = 2
      max_size     = 6

      instance_types = ["m6i.xlarge"]
      capacity_type  = "ON_DEMAND"
    }
  }
}

resource "aws_db_instance" "litellm" {
  identifier        = "litellm-metadata"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = "db.t3.medium"
  allocated_storage = 20

  db_name  = "litellm"
  username = "litellm"
  password = var.db_password

  publicly_accessible = false
  skip_final_snapshot = true
}

resource "aws_secretsmanager_secret_version" "litellm_config" {
  secret_id = aws_secretsmanager_secret.litellm_config.id
  secret_string = jsonencode({
    model_list = [
      {
        model_name = "gpt-4o"
        litellm_params = {
          model  = "azure/gpt-4o"
          api_base = "https://ai-guru.openai.azure.com/"
          api_key  = "os.environ/AZURE_OPENAI_API_KEY"
        }
      },
      {
        model_name = "claude-3-5-sonnet"
        litellm_params = {
          model  = "anthropic/claude-3-5-sonnet-20241022"
          api_key = "os.environ/ANTHROPIC_API_KEY"
        }
      }
    ]
    router_settings = {
      routing_strategy = "simple-shuffle"
      fallback_strategy = {
        "gpt-4o" = ["claude-3-5-sonnet"]
      }
    }
  })
}

# kubernetes deployment via helm_release
resource "helm_release" "litellm" {
  name       = "litellm"
  repository = "https://berriai.github.io/litellm"
  chart      = "litellm"
  version    = "0.1.0"

  namespace  = "llm-gateway"
  create_namespace = true

  set_sensitive {
    name  = "config.password"
    value = var.db_password
  }

  values = [file("${path.module}/litellm-values.yaml")]
}
```

### 6.2 Helm 部署到 Kubernetes

`litellm-values.yaml` 示例：

```yaml
replicaCount: 3

image:
  repository: ghcr.io/berriai/litellm
  tag: main-latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 4000

ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/rate-limit: "1000"
  hosts:
    - host: llm-gateway.ai-guru.internal
      paths:
        - path: /
          pathType: Prefix

resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: 2000m
    memory: 4Gi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

env:
  - name: AZURE_OPENAI_API_KEY
    valueFrom:
      secretKeyRef:
        name: litellm-secrets
        key: azure-openai-key
  - name: ANTHROPIC_API_KEY
    valueFrom:
      secretKeyRef:
        name: litellm-secrets
        key: anthropic-key

config:
  master_key: "os.environ/LITELLM_MASTER_KEY"
  database_url: "os.environ/DATABASE_URL"

podDisruptionBudget:
  enabled: true
  minAvailable: 2

serviceMonitor:
  enabled: true
  namespace: monitoring
```

生产部署还需要配套：

- **External Secrets Operator** 或类似方案把 Secrets Manager 中的密钥同步到 K8s Secret。
- **Redis** 用于缓存、虚拟 key 配额和分布式限流。
- **Prometheus ServiceMonitor** 暴露 `/metrics` 端点。
- **Pod Disruption Budget + Topology Spread Constraints** 保证高可用。
- **NetworkPolicy** 限制 Gateway 只能被授权服务访问。

---

## 7. 生产落地 Checklist

### 架构与设计

- [ ] 明确定义 Gateway 的职责边界，避免把业务逻辑耦合进 Gateway。
- [ ] 设计统一 API 规范（OpenAI-compatible 或自定义），并沉淀到 API 文档。
- [ ] 确定路由策略（模型路由、区域路由、A/B 测试、灰度）。
- [ ] 设计 Fallback 链路和降级策略，并经过混沌测试验证。
- [ ] 规划多租户隔离（team/project/env）。

### 安全与合规

- [ ] 所有供应商 API Key 集中管理，不落地业务代码。
- [ ] Gateway 暴露给内部的 API 启用认证鉴权（API Key / JWT / mTLS）。
- [ ] 对 PII/敏感数据进行输入检测和输出脱敏。
- [ ] 配置审计日志，满足等保/GDPR/HIPAA 要求。
- [ ] 数据出境路径经过合规评估，必要时启用 region pinning。

### 性能与可靠性

- [ ] 配置合理的超时、重试、退避策略。
- [ ] 配置限流和配额，防止单业务线耗尽资源。
- [ ] 实现健康检查和实例摘除机制。
- [ ] 对 Gateway 本身做高可用部署（多副本、PDB、HPA）。
- [ ] 进行压力测试和混沌工程，验证 Fallback 和限流效果。

### 可观测性

- [ ] 接入 Prometheus metrics，覆盖延迟、token、成本、错误、Fallback。
- [ ] 接入分布式 Tracing（OpenTelemetry）。
- [ ] 建立成本 Dashboard 和预算告警。
- [ ] 记录完整审计日志并设置保留策略。

### 运维与治理

- [ ] 路由/配置通过 GitOps 管理，支持版本化和回滚。
- [ ] 建立变更管理流程，Gateway 配置变更需经过 staging 验证。
- [ ] 定义 SLO/SLI（可用性、延迟、错误率、成本）。
- [ ] 编写 Runbook，覆盖常见故障场景（429 风暴、供应商故障、密钥失效）。
- [ ] 定期进行灾难恢复演练。

---

## 8. 风险与最佳实践

### 常见风险

1. **Gateway 成为单点故障**：Gateway 本身必须高可用，否则所有 AI 服务都会受影响。
2. **配置漂移**：路由、配额、密钥配置散落在不同地方，导致生产与预期不一致。
3. **缓存一致性问题**：启用语义缓存后，模型更新或 prompt 微调可能导致缓存命中错误结果。
4. **Fallback 导致成本飙升**：跨厂商 Fallback 可能使用更贵的模型，需要在 Fallback 策略中设置成本上限。
5. **敏感数据泄露**：Gateway 集中处理所有请求，成为数据安全的敏感点，必须严格审计和加密。
6. **供应商限流策略差异**：不同供应商对 429 的处理方式不同，Gateway 需要针对每个供应商配置不同的重试策略。

### 最佳实践

- **分层架构**：业务服务 → 边缘 Gateway（Kong/Envoy） → LLM Gateway → 模型供应商/自托管推理。每一层职责清晰。
- **配置即代码**：所有 Gateway 配置纳入版本控制，通过 CI/CD 自动部署到 staging 和 production。
- **最小权限原则**：为每个业务线分配独立的虚拟 Key，限制可调用的模型和配额。
- **成本意识融入设计**：在路由策略中考虑成本因子，例如默认使用 cheaper model，仅在必要时升级到最强模型。
- **持续监控与优化**：定期审查成本 Dashboard、Fallback 率、缓存命中率，持续优化路由和模型选择策略。
- **文档化运行手册**：把常见故障、应急流程、升级流程写成 Runbook，降低 on-call 压力。

---

## Related

- [[93_Templates/API_Design_for_AI|AI API 设计指南]] — Gateway 暴露的统一 API 设计参考
- [[93_Templates/Prompt_Management_Platform|Prompt 管理平台]] — 与 Gateway 协同的 Prompt 版本与评估管理
- [[93_Templates/DOCUMENT_TEMPLATES|文档模板规范]] — 本项目文档写作规范
- [[大模型/LLM_Production_Deployment_Runbook|LLM 生产部署 Runbook]] — 模型服务化与推理优化
- [[架构基建/AI_SRE_Runbook|AI SRE Runbook]] — AI 服务可靠性工程与事故响应
- [[Agent/Agent_Production_Deployment_Runbook|Agent 生产部署 Runbook]] — Agent 系统的 Gateway 集成与流量治理
- [[MLOps/LLM_Guardrails_and_Safety_Ops_2026|LLM 护栏与安全运维]] — Gateway 与输入输出护栏的协同
- [[部署推理/Deployment_Inference_2026|部署与推理 2026]] — 推理服务化与 Gateway 上下游架构
- [[运维/AI_Ops_2026|AI Ops 2026]] — AI 系统运维、可观测性与 FinOps 实践
- [[RAG系统/RAG_Production_Architecture_Deep_Dive|RAG 生产架构深度实战]] — RAG 系统的 Gateway、检索与生成链路

---

*Last updated: 2026-07-01*
