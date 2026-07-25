---
title: "Envoy AI Gateway: 基于 Envoy 的 GenAI 统一入口"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "envoy", "ai-gateway", "kubernetes", "llm", "gateway-api"]
summary: "> **一句话理解**: Envoy AI Gateway 是架在 Envoy Gateway 之上的 LLM 扩展——用 Kubernetes Gateway API + AIGatewayRoute CRD，把企业级 L7 能力(限流/鉴权/可观测/mTLS)和大模型路由(多 provider/失败转移/Token 限流/模型别名)合二为一。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Envoy Ai Gateway Deep Dive"
  - "Envoy AI Gateway Deep Dive"
  - Envoy_AI_Gateway_Deep_Dive
sources: []

---
# Envoy AI Gateway: 基于 Envoy 的 GenAI 统一入口

> **一句话理解**: Envoy AI Gateway 是架在 Envoy Gateway 之上的 LLM 扩展——用 Kubernetes Gateway API + AIGatewayRoute CRD，把企业级 L7 能力(限流/鉴权/可观测/mTLS)和大模型路由(多 provider/失败转移/Token 限流/模型别名)合二为一。

> 📐 **概念方法论**: Envoy AI Gateway 的核心思想是 **"不重新发明轮子"**——Envoy Gateway 已经是生产级的 L7 网关(限流/鉴权/mTLS/可观测一应俱全)，AI Gateway 只在其上"嫁接"一层 LLM 智能：用 extproc 拦截并解析 LLM 的流式响应、统计 Token、做模型路由。这与 Kgateway(同样基于 Envoy、走 Gateway API)思路同源，可对照 [[12_架构基建/11_AI_Gateway/AI_Gateway_2026]] 的总论与 [[CNCF_Cloud_Native_AI/Kgateway_Deep_Dive]] 一起理解。它的工程哲学是：**让 AI 流量治理复用云原生已有的治理平面，而不是再造一个 Python 代理**。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [安装部署](#4-安装部署)
5. [快速开始](#5-快速开始)
6. [生产配置](#6-生产配置)
7. [运维与可观测](#7-运维与可观测)
8. [对比与选择](#8-对比与选择)
9. [常见问题 FAQ](#9-常见问题-faq)

---

## 1. 概述

### 1.1 定位

Envoy AI Gateway 是 Envoy Proxy 社区开源、TensorChord 等参与建设、已进入 **CNCF Landscape (AI Native Infra)** 的项目，定位为 **"统一管理对生成式 AI 服务访问"** 的网关扩展。它的关键判断是：**不要从零造一个 AI 网关，而是把 Envoy Gateway 变成 AI 网关**。

```
痛点:  各应用硬编码 OpenAI key → 散落各处 / 无审计 / 无限流 / 失败手切 / 无 Token 预算 / 无 PII 脱敏

       所有应用 ──► [统一 OpenAI 兼容入口]   (Gateway API + AIGatewayRoute CRD)
                         ├─ 多 provider 路由 + 自动失败转移
                         ├─ Token 级限流 / 团队预算
                         ├─ 鉴权 / mTLS / PII 脱敏 / Prompt Guard
                         └─ 统一访问日志 + Token 指标
                               │   复用 Envoy 生产级数据平面
                               ▼
                     OpenAI / Azure / Gemini / Anthropic / vLLM / Ollama
```

一句话：**Envoy AI Gateway = Envoy Gateway(数据平面) + LLM 扩展(controller + extproc)**。它对客户端永远暴露 OpenAI 兼容 API，对后端则可以路由到任意 provider。

### 1.2 核心特性

| 特性 | 说明 | 价值 |
|------|------|------|
| 多 Provider 路由 | OpenAI / Anthropic / Gemini / Azure / 自建 vLLM / Ollama 统一接入 | 一个入口管所有模型，应用层零改动 |
| 自动失败转移 | 主 provider 报错/超时时自动切到备份 provider | 提升 LLM 调用可用性，屏蔽单点故障 |
| Token 级限流 | 基于 prompt/completion token 数做预算控制，而非仅 RPM | 按真实成本计量，避免团队预算失控 |
| 模型别名 | 客户端写 `gpt-4o-mini`，后端可映射到任意真实模型 | 解耦应用与模型版本，支持灰度/降级 |
| extproc 流式处理 | 用 Envoy External Processor 解析 SSE 流，统计 token、做转换 | 兼容流式输出，同时拿到精确计费数据 |
| 统一 OpenAI API | 无论后端是 Anthropic 还是 Gemini，对外都是 `/v1/chat/completions` | 应用无需为每个 provider 写适配 |
| 复用 Envoy L7 能力 | 限流、鉴权、可观测、mTLS、负载均衡开箱即用 | 不重复造治理轮子，生产就绪 |
| 集中审计日志 | 所有 LLM 调用统一记录(模型/token/延迟/调用方) | 满足合规与成本归因 |

### 1.3 项目状态与版本历程

| 时间 | 版本 | 里程碑 |
|------|------|--------|
| 2024 中 | 项目启动 | 源自 Envoy Proxy 项目，TensorChord / Envoy 社区共建，进入 CNCF Landscape (AI Native Infra) |
| 2024 下半年 | v0.x | 首个可用版本，引入 `AIGatewayRoute` CRD，支持 OpenAI / Azure，基于 Gateway API |
| 2025 | v0.2+ | 扩展多 provider(Anthropic / Gemini / 本地 vLLM / Ollama)、Token 限流、模型别名、请求/响应 filter |
| 2025+ | 持续演进 | 增强 extproc、生产可观测、BackendSecurityPolicy 多类型(APIKey/mTLS/OAuth) |

> 当前仍处于 v0.x 快速迭代期，CRD schema 可能在小版本间调整，生产使用需锁定具体版本并关注 release notes。

---

## 2. 核心概念

Envoy AI Gateway 在 Envoy Gateway 的 Gateway API 之上新增了三个核心 CRD，外加两个关键逻辑概念。

### 2.1 核心 CRD

| CRD | 角色 | 关键字段 |
|-----|------|----------|
| `AIGatewayRoute` | 声明一条 LLM 路由：匹配哪些请求、路由到哪个 backend 池、挂哪些限流/filter | `parentRefs`、`rules[].matches`、`rules[].backends`、模型别名 |
| `AIGatewayFilter` | 路由级过滤器：Token 计量、Prompt Guard、PII 脱敏、请求/响应转换 | `targetRefs`、`llmRequestCosts`、各类 filter 配置 |
| `BackendSecurityPolicy` | 上游 provider 的认证策略：API Key / mTLS / OAuth | `targetRefs`、`type`、`apiKey/mTLS/oidc` |

三个 CRD 的关系是 **"路由 → 过滤 → 凭证"** 的分层组合：`AIGatewayRoute` 描述"流量往哪走"，`AIGatewayFilter` 描述"途中要做什么加工"，`BackendSecurityPolicy` 描述"如何向上游证明身份"。下表把每个 CRD 映射到最常见的真实用例：

| CRD | 典型用例 | 与原生 Gateway API 的关系 |
|-----|----------|--------------------------|
| `AIGatewayRoute` | 把 `/v1/chat/completions` 路由到 OpenAI 主 + vLLM 备；按 `x-model-name` 头分流到不同模型档 | 是 `HTTPRoute` 的 AI 专属子类，复用 `parentRefs`/`matches` 语义 |
| `AIGatewayFilter` | 按团队限 Token 预算；对请求做 PII 脱敏；对响应强制补全 `usage` | 类似 `EnvoyFilter`，但聚焦 LLM 请求/响应体与 token 计量 |
| `BackendSecurityPolicy` | 为 OpenAI 注入 API Key；为自建推理服务配置 mTLS；为 Azure 配 OAuth 客户端凭证 | 作用在 `Backend` 对象上，由 controller 翻译成 extproc 的凭证注入动作 |

### 2.2 关键逻辑概念

- **模型别名 (Model Aliasing)**：客户端请求里的 `model` 字段是"逻辑模型名"，由网关映射到真实后端模型。例如客户端永远写 `chat-fast`，后端可在 OpenAI `gpt-4o-mini` 与本地 vLLM `qwen2.5-7b` 间切换，应用无感知。别名机制让"模型更换/降级/灰度"成为运维侧的纯配置动作，无需重新发版应用代码。

  ```
  客户端视角(永远稳定):      后端真实模型(可随时变):
  model: "chat-fast"   ──►  gpt-4o-mini      (默认，云)
                         └► qwen2.5-7b       (降级，本地 vLLM)
                         └► deepseek-v3-chat (灰度，新供应商)

  切换方式: 改 AIGatewayRoute 的 backends 列表顺序/权重，零代码改动
  ```
- **Token 限流 (Token Rate Limiting)**：传统限流只看 RPM/带宽，但 LLM 的真实成本是 Token。Envoy AI Gateway 用 extproc 解析响应里的 `usage`，把 prompt/completion token 数回填为 Envoy 的动态 metadata，从而驱动基于 Token 的限流与配额。

### 2.3 数据流总览

```
 客户端/OpenAI SDK  POST /v1/chat/completions  model=chat-fast
        │
        ▼
 ┌────────────────── Kubernetes 集群 ──────────────────┐
 │  Envoy Gateway (数据平面)                            │
 │   TLS 终止 ─► 鉴权/限流 ─► AI extproc Sidecar        │
 │                              (解析 LLM 请求/响应,      │
 │                               Token 统计/转换)        │
 │                                    │ 路由决策         │
 │            ┌───────────┬───────────┼───────────┐     │
 │            ▼           ▼           ▼           ▼     │
 │        OpenAI(主)   Azure(备份)   vLLM(本地) Ollama  │
 │            │ 失败/超时                                 │
 │            └────────► 自动失败转移到 Azure             │
 └─────────────────────────────────────────────────────┘
```

客户端只需对接一个 OpenAI 兼容端点，后端是多 provider 池，主路径失败时自动转移。

---

## 3. 架构设计

### 3.1 组件构成

```
 控制平面
 ┌─────────────────────────────────────────────────────────┐
 │  AIGatewayRoute / AIGatewayFilter / BackendSecurityPolicy│
 │            │ 翻译                                          │
 │            ▼                                               │
 │  [AI Gateway Controller] ──► [Envoy Gateway Controller]  │
 │                                     │ 下发 xDS            │
 └─────────────────────────────────────┼───────────────────┘
                                       │
 数据平面                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │  Envoy Proxy: Listener → RouteChain → extproc → Cluster  │
 │                          │ gRPC (ExtProc API)             │
 │              ┌───────────▼──────────────┐                 │
 │              │  AI extproc               │                 │
 │              │  - LLM 请求解析 / 别名改写 │                 │
 │              │  - SSE 流式 token 统计     │                 │
 │              │  - PII 脱敏 / Prompt Guard │                 │
 │              │  - 回填 dynamic metadata   │                 │
 │              └──────────────────────────┘                 │
 └─────────────────────────────────────────────────────────┘
```

- **AI Gateway Controller**：监听三个 AI CRD，把它们翻译成 Envoy Gateway 能理解的 Gateway API 对象，并生成 extproc 的 Deployment/配置。
- **extproc (External Processor)**：Envoy 原生的扩展机制。AI extproc 作为一个独立 gRPC 服务，接收 Envoy 在请求/响应路径上的拦截调用，完成所有 LLM 专属逻辑。

### 3.2 请求处理流程

```
1. 客户端 POST /v1/chat/completions  { model: "chat-fast", messages:[...] }
        │
2. Envoy 收到请求，进入 extproc 处理
        │  ├─ 鉴权(校验客户端 key / mTLS)
        │  ├─ 读取 AIGatewayRoute：解析模型别名 "chat-fast" → 真实模型
        │  ├─ Prompt Guard / PII 脱敏(若配置了 AIGatewayFilter)
        │  └─ 选择 backend(主 OpenAI)
        ▼
3. Envoy 转发到上游 provider(附带 BackendSecurityPolicy 注入的凭证)
        │
4. provider 返回响应(可能是 SSE 流)
        │  ┌─ 非流式: extproc 解析 JSON 中的 usage{prompt_tokens, completion_tokens}
        │  └─ 流式:   extproc 逐 chunk 解析 SSE，累加 token
        ▼
5. extproc 把 token 数写入 Envoy dynamic metadata
        │  → 触发 Token 限流判定
        │  → 写入访问日志 / 指标
        ▼
6. 响应回客户端(OpenAI 兼容格式)
```

### 3.3 Token 计量原理

LLM 的流式响应通过 SSE (`text/event-stream`) 逐 chunk 返回，每个 chunk 是一段 JSON。难点在于：**要边转发边统计 token，不能等流结束**。extproc 的工作方式：

1. 透传流式 chunk，保证首字延迟(TTFT)不受影响。
2. 解析每个 chunk 里的 `usage` 增量(OpenAI 等会在最后一个 chunk 携带完整 usage)。
3. 流结束后，把 `prompt_tokens` / `completion_tokens` / `total_tokens` 写入请求的 dynamic metadata。
4. Envoy 的限流器、访问日志、Prometheus 指标都从该 metadata 读取，从而实现 **"按真实 Token 计量"** 的限流与可观测。

这就是 Token 级限流能成立的底层机制：没有 extproc 解析，就只有 RPM，没有 TPM。

---

## 4. 安装部署

### 4.1 先装 Envoy Gateway，再装 AI Gateway 扩展

```bash
# 1) 前置: Envoy Gateway(Envoy AI Gateway 是其扩展，必须先存在)
helm install eg oci://docker.io/envoyproxy/gateway-helm --version v1.2.0 \
  -n envoy-gateway-system --create-namespace
kubectl wait --for=condition=Available deployment/envoy-gateway \
  -n envoy-gateway-system --timeout=120s

# 2) 安装 Envoy AI Gateway(controller + extproc)
helm repo add envoyproxy-ai-gateway https://envoyproxy.github.io/ai-gateway && helm repo update
helm install envoy-ai-gateway envoyproxy-ai-gateway/ai-gateway -n envoy-gateway-system
kubectl get pods -n envoy-gateway-system
# envoy-ai-gateway-controller-xxxx   1/1 Running
# envoy-ai-gateway-extproc-xxxx      1/1 Running
```

### 4.2 创建 GatewayClass、Gateway 与 provider 凭证

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata: { name: envoy-ai }
spec: { controllerName: gateway.envoyproxy.io/gatewayclass-controller }
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata: { name: ai-gateway, namespace: envoy-gateway-system }
spec:
  gatewayClassName: envoy-ai
  listeners: [{ name: http, protocol: HTTP, port: 80 }]
```

### 4.3 为 provider 配置 BackendSecurityPolicy

```yaml
apiVersion: aigateway.envoyproxy.io/v1alpha1
kind: BackendSecurityPolicy
metadata:
  name: openai-bsp
  namespace: envoy-gateway-system
spec:
  targetRefs: [{ kind: Backend, name: openai-backend }]
  type: APIKey
  apiKey:
    secretRef: { name: openai-api-key, namespace: envoy-gateway-system }
```

```bash
# 把真实 provider key 放进 Secret
kubectl create secret generic openai-api-key \
  -n envoy-gateway-system --from-literal=apiKey=sk-xxxxxxxxxxxxxxxx
```

---

## 5. 快速开始

本节给出一条**端到端可复现的走查路径**，从零到一个具备失败转移能力 + 按消费者 Token 预算限流的 AI 网关。假设你已经按第 4 节装好 Envoy Gateway 与 AI Gateway controller/extproc。

> **走查目标**：(1) 创建一条 `AIGatewayRoute`，把 `/v1/chat/completions` 优先路由到 OpenAI，失败时自动转移到本地 vLLM；(2) 在此之上叠加"每个消费方每天 Token 预算"限流。

### 5.1 端到端走查(七步)

**Step 1 — 确认 Envoy Gateway 与 AI Gateway 已就绪**

```bash
kubectl get pods -n envoy-gateway-system
# envoy-default-xxxx                 2/2 Running   # Envoy 数据平面
# envoy-ai-gateway-controller-xxxx   1/1 Running   # AI controller
# envoy-ai-gateway-extproc-xxxx      1/1 Running   # extproc sidecar/pool
kubectl get gatewayclass envoy-ai   # 验证 GatewayClass 被 ACK
```

**Step 2 — 为 provider 准备 Secret 与 BackendSecurityPolicy**

```bash
kubectl create secret generic openai-api-key \
  -n envoy-gateway-system --from-literal=apiKey=sk-xxxxxxxxxxxxxxxx
kubectl create secret generic vllm-noauth -n envoy-gateway-system \
  --from-literal=apiKey=dummy   # 本地 vLLM 无鉴权时给占位
```

`BackendSecurityPolicy` 的清单见 §4.3，这里复用 `openai-bsp`。

**Step 3 — 定义后端 Backend 与路由**

```yaml
# 两个后端: 云端 OpenAI 与集群内 vLLM
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: Backend
metadata: { name: openai-backend, namespace: envoy-gateway-system }
spec:
  endpoints: [{ fqdn: { hostname: api.openai.com, port: 443 } }]
---
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: Backend
metadata: { name: vllm-backend, namespace: envoy-gateway-system }
spec:
  endpoints: [{ fqdn: { hostname: vllm.default.svc.cluster.local, port: 8000 } }]
---
apiVersion: aigateway.envoyproxy.io/v1alpha1
kind: AIGatewayRoute
metadata: { name: chat-route, namespace: envoy-gateway-system }
spec:
  parentRefs: [{ name: ai-gateway }]
  schema: { name: OpenAISchema }
  llmRequestCosts: [{ metadataKey: token_usage_total, type: Total }]
  rules:
    - matches: [{ headers: [{ type: Exact, name: x-model-name, value: chat-fast }] }]
      # 列表内按优先级: 第一个失败自动尝试下一个
      backends: [ [ { name: openai-backend, weight: 100 }, { name: vllm-backend, weight: 0 } ] ]
  backendSecurityPolicies: { openai-backend: [{ name: openai-bsp }] }
```

### 5.2 通过网关调用并观察失败转移

**Step 4 — 拿到 Gateway 入口 IP**

```bash
GW_IP=$(kubectl get gateway ai-gateway -n envoy-gateway-system \
  -o jsonpath='{.status.addresses[0].value}')
```

**Step 5 — 用 OpenAI 兼容 payload 发起调用**

```bash
# 客户端完全按 OpenAI 协议调用，无需关心后端是谁
curl http://$GW_IP/v1/chat/completions \
  -H "Content-Type: application/json" -H "x-model-name: chat-fast" \
  -d '{"model":"chat-fast","messages":[{"role":"user","content":"用一句话解释 K8s"}]}'
# 期望: 200 OK，响应体里 model=chat-fast，但实际由 openai-backend 处理
```

**Step 6 — 主动触发失败转移并观察**

```bash
# 把 OpenAI key 改成无效值模拟上游故障
kubectl create secret generic openai-api-key -n envoy-gateway-system \
  --dry-run=client --from-literal=apiKey=sk-INVALID -o yaml | kubectl apply -f -

# 再次发请求，正常应在 ~1s 内完成切换
curl http://$GW_IP/v1/chat/completions -H "x-model-name: chat-fast" \
  -H "Content-Type: application/json" \
  -d '{"model":"chat-fast","messages":[{"role":"user","content":"hi"}]}'

# 观察 extproc 日志与 Envoy 访问日志
kubectl logs -n envoy-gateway-system deploy/envoy-ai-gateway-extproc --tail=50
```

预期日志序列：`openai-backend → 401/超时 → 自动切 vllm-backend → 200`。

**Step 7 — 验证 Token 计量已生效**

```bash
# 查看 dynamic metadata 里的 token_usage_total(见 §6.4 的访问日志格式)
kubectl logs -n envoy-gateway-system deploy/envoy-default --tail=20 | grep tokens=
# 形如: model=chat-fast tokens=1824 status=200 latency=843ms
```

只要应用层始终写 `model: chat-fast`，provider 切换、降级、迁移对它完全透明。

### 5.3 进阶示例：按消费者的 Token 预算限流

在上面的路由之上，叠加一个 `AIGatewayFilter`，让 `payments` 与 `marketing` 两个消费方共享同一条路由，但 Token 预算不同：

```yaml
apiVersion: aigateway.envoyproxy.io/v1alpha1
kind: AIGatewayFilter
metadata:
  name: consumer-token-budget
  namespace: envoy-gateway-system
spec:
  targetRefs:
    - { kind: Gateway, name: ai-gateway }
  llmRequestCosts:
    - { metadataKey: token_usage_total, type: Total }
  rateLimit:
    global:
      rules:
        - clientSelectors: [{ headers: [{ name: x-team, value: payments }] }]
          limit: { requests: 2000000, unit: Day }
        - clientSelectors: [{ headers: [{ name: x-team, value: marketing }] }]
          limit: { requests: 500000, unit: Day }
```

```bash
# payments 团队: 预算内正常
curl http://$GW_IP/v1/chat/completions -H "x-model-name: chat-fast" -H "x-team: payments" \
  -H "Content-Type: application/json" \
  -d '{"model":"chat-fast","messages":[{"role":"user","content":"生成财报摘要"}]}'

# marketing 团队耗尽预算后: 返回 429，body 含 rate-limit 信息
curl http://$GW_IP/v1/chat/completions -H "x-model-name: chat-fast" -H "x-team: marketing" \
  -H "Content-Type: application/json" \
  -d '{"model":"chat-fast","messages":[{"role":"user","content":"写 100 条文案"}]}'
# 期望(HTTP 状态): HTTP/1.1 429 Too Many Requests
```

关键点：这里的 `requests` 是 **Token 计数**而不是调用次数——因为 `llmRequestCosts` 把 extproc 解析出的 `token_usage_total` 注册成了限流的 cost 源。这就是 Envoy AI Gateway 与普通 Gateway API 限流的核心差异：**计量单位从 RPM 升级为 TPM**。

---

## 6. 生产配置

### 6.1 多 Provider 路由与模型别名

```yaml
apiVersion: aigateway.envoyproxy.io/v1alpha1
kind: AIGatewayRoute
metadata:
  name: prod-llm-route
  namespace: envoy-gateway-system
spec:
  parentRefs: [{ name: ai-gateway }]
  schema: { name: OpenAISchema }
  rules:
    # 高质量档 chat-premium: 优先 OpenAI, 失败转 Anthropic
    - matches: [{ headers: [{ type: Exact, name: x-model-name, value: chat-premium }] }]
      backends: [ [ { name: openai-backend }, { name: anthropic-backend } ] ]
    # 经济档 chat-fast: 走本地 vLLM
    - matches: [{ headers: [{ type: Exact, name: x-model-name, value: chat-fast }] }]
      backends: [ [ { name: vllm-backend } ] ]
```

### 6.2 Token 预算限流(按团队)

```yaml
# Token 预算限流: payments 团队每天 2M token, marketing 每天 0.5M
apiVersion: aigateway.envoyproxy.io/v1alpha1
kind: AIGatewayFilter
metadata:
  name: token-budget
  namespace: envoy-gateway-system
spec:
  targetRefs:
    - { kind: Gateway, name: ai-gateway }
  llmRequestCosts:
    - { metadataKey: token_usage_prompt,      type: InputTokens }
    - { metadataKey: token_usage_completion,  type: OutputTokens }
  rateLimit:
    global:
      rules:
        - clientSelectors: [{ headers: [{ name: x-team, value: payments }] }]
          limit: { requests: 2000000, unit: Day }
        - clientSelectors: [{ headers: [{ name: x-team, value: marketing }] }]
          limit: { requests: 500000, unit: Day }
```

### 6.3 请求/响应过滤器(PII 脱敏 + Prompt Guard)

```yaml
apiVersion: aigateway.envoyproxy.io/v1alpha1
kind: AIGatewayFilter
metadata:
  name: safety-filter
  namespace: envoy-gateway-system
spec:
  targetRefs:
    - kind: AIGatewayRoute
      name: prod-llm-route
  request:
    # PII 脱敏: 邮箱在送往 LLM 前替换为 [EMAIL]
    body:
      value: |
        [{"op":"replace","path":"/messages/0/content",
          "value":"{{ regex_replace_all(\"[\\\\w.-]+@[\\\\w.-]+\", request_body, \"[EMAIL]\") }}" }]
    # Prompt Guard: 命中危险词直接拒绝
    promptGuard:
      request:
        regex: ["ignore.*previous.*instructions", "you are now (DAN|developer)"]
        action: Reject
  response:
    body:
      value: "{{ ensure_usage . }}"   # 统一补全 usage 便于计费
```

### 6.4 TLS 与可观测

```yaml
# Gateway 监听器升级为 HTTPS，证书由 cert-manager 签发
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: ai-gateway
  namespace: envoy-gateway-system
spec:
  gatewayClassName: envoy-ai
  listeners:
    - name: https
      protocol: HTTPS
      port: 443
      tls: { mode: Terminate, certificateRefs: [{ name: ai-gateway-cert }] }
  infrastructure:
    parametersRefs:
      - { group: gateway.envoyproxy.io, kind: EnvoyProxy, name: obs-config }
---
# 通过 EnvoyProxy CR 开启带 token 字段的访问日志与 Prometheus 指标
apiVersion: gateway.envoyproxy.io/v1alpha1
kind: EnvoyProxy
metadata:
  name: obs-config
  namespace: envoy-gateway-system
spec:
  telemetry:
    accessLog:
      - settings:
          - format:
              type: Text
              text: "[%START_TIME%] model=%REQ(X-MODEL-NAME)% tokens=%DYNAMIC_METADATA(ai_gateway:token_usage_total)% status=%RESPONSE_CODE% latency=%DURATION%ms"
            sinks: [{ type: File }]
    metrics: { prometheus: { disable: false } }
```

---

## 7. 运维与可观测

### 7.1 关键指标

按"业务/成本/控制平面/数据平面"四层来归类，避免只盯请求量而漏掉成本与 extproc 健康：

| 指标 | 层 | 来源 | 用途 |
|------|----|------|------|
| `ai_gateway_llm_request_total` | 业务 | extproc | 按 model/provider/status 统计 LLM 调用量与错误率 |
| `ai_gateway_token_usage_total{type=prompt\|completion}` | 成本 | extproc(usage 解析) | prompt/completion token 吞吐，成本归因与预算核算 |
| `ai_gateway_llm_request_duration_ms_bucket` | 业务 | extproc | LLM 端到端延迟分布(p50/p95/p99)，含流式 |
| `ai_gateway_rate_limit_rejected_total` | 控制 | extproc/限流 | 被预算/速率限流拦截的请求数，按 consumer/team 维度 |
| `envoy_cluster_upstream_rq_5xx` | 数据 | Envoy | provider 错误率，触发失败转移的早期信号 |
| `envoy_cluster_upstream_rq_time` | 数据 | Envoy | 上游(到 provider)响应延迟 |
| `envoy_ext_proc_latency_ms` | 控制 | Envoy | extproc 处理延迟，必须远小于 LLM 首 token 延迟 |
| `envoy_cluster_upstream_cx_active` | 数据 | Envoy | 到每个 provider 的活跃连接数，容量规划 |

### 7.2 PromQL 速查

```promql
# (1) 各模型 5 分钟错误率(出现尖刺常意味着 provider 故障 → 失败转移)
sum(rate(ai_gateway_llm_request_total{status=~"5.."}[5m])) by (model)
  / sum(rate(ai_gateway_llm_request_total[5m])) by (model)

# (2) 每小时 Token 成本(按团队归因，配合 x-team 标签)
sum(increase(ai_gateway_token_usage_total{type="completion"}[1h])) by (team)

# (3) extproc p99 延迟 —— 超过 ~50ms 说明 extproc 拖慢了首 token
histogram_quantile(0.99,
  sum by (le) (rate(envoy_ext_proc_latency_ms_bucket[5m])))

# (4) 被预算限流拦截的请求占比(应趋近 0，频繁出现说明预算需调)
sum(rate(ai_gateway_rate_limit_rejected_total[5m]))
  / sum(rate(ai_gateway_llm_request_total[5m]))
```

### 7.3 访问日志样例

```
[2026-06-16T03:12:44Z] ai-gateway.internal chat-fast
model=chat-fast tokens=1824 status=200 latency=843ms
```

`tokens=` 字段来自 extproc 回填的 dynamic metadata，是按 Token 计费/审计的唯一依据。

### 7.4 故障排查

LLM 网关的排障比普通 L7 复杂，因为多了一层"流式 SSE 解析"与"上游 provider 不可控"。下表覆盖线上最常见的 8 类问题：

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| 流式响应中断/SSE 解析报错 | extproc 版本与 provider SSE 格式不匹配(如 Anthropic 改了 event 结构) | 升级 extproc；临时关闭该 provider 的流式(`stream:false`)复测；抓 extproc 日志看具体解析失败的 chunk |
| 401 / 403 鉴权失败 | BackendSecurityPolicy 没正确注入 key；Secret 名错或 namespace 不一致 | `kubectl get bsp`、`kubectl describe secret` 确认 targetRef 指向正确的 Backend，Secret 在同一 namespace |
| 失败转移风暴(主备反复横跳) | 主备都不可用导致来回重试；或健康检查过松 | 配置主动健康检查 + 熔断(OutlierDetection)；确认 provider 配额/网络；为备份设不同的失败阈值 |
| extproc 超时拖慢首 token(TTFT 飙升) | extproc 副本不足 / CPU limit 触发 throttle | 看 `envoy_ext_proc_latency_ms` p99；扩副本(见 7.5)；提高 CPU limit；确认 extproc 内存够放流缓冲 |
| Token 预算"用不完"却 429 | provider 响应里没有 `usage`(部分本地引擎默认关闭) | 确认模型返回 usage；vLLM 等需 `--enable-auto-tool-choice`/对应选项；否则该路径只能退化为 RPM |
| 模型别名没生效(打到错误后端) | `x-model-name` 头与 `matches` 不一致；或 schema 不匹配 | `kubectl describe aigatewayroute` 看 rules 是否被 ACK；确认 `schema.name=OpenAISchema` 且请求头大小写一致 |
| 流式响应被缓冲(非真流式) | 中间有 proxy/ingress 关闭了 HTTP/1.1 chunked 或加了 buffering | 确认 Gateway 监听器与上游链路支持 HTTP/1.1 keep-alive + chunked；关闭 Envoy 的 buffer_filter |
| p99 延迟突增但 provider 侧正常 | 上游连接数打满 / DNS 解析慢 / TLS 握手未复用 | 看 `envoy_cluster_upstream_cx_active`；为 provider 配置连接池与 keepalive；对 FQDN backend 启用 DNS 刷新 |

### 7.5 扩缩 extproc

extproc 是有状态的请求级处理，高 QPS 下会成为瓶颈。建议：

```yaml
# extproc 默认 1 副本，生产按 LLM QPS 横向扩
spec:
  replicas: 4
  resources:
    requests: { cpu: "1", memory: "512Mi" }
    limits:   { cpu: "2", memory: "1Gi" }
  # 因为只做透传+轻量解析，extproc 延迟通常 < 5ms，
  # 但要监控 envoy_ext_proc_latency_ms 不超过首 token 延迟的 10%
```

envoy 的 extproc 调用会按请求哈希到后端实例，扩副本可线性分摊负载。扩容决策建议按下面经验值，而不是等 SLO 告警才动手：

| 场景 | extproc 副本数 | CPU/副本 | 触发扩容的信号 |
|------|----------------|----------|----------------|
| POC / 低量(<50 LLM QPS) | 1–2 | 0.5 核 | 仅基准 |
| 生产中小(50–500 QPS) | 3–4 | 1 核 | `envoy_ext_proc_latency_ms` p99 > 30ms |
| 高量(>500 QPS 或多 provider) | 6+ | 2 核 | extproc CPU usage > 70% 持续 5 分钟 |

> extproc 是 **请求级同步处理**——它直接出现在用户的关键路径上，既影响 TTFT 也影响 token 计量准确性。生产环境务必为它单独建 HPA(CPU 目标 60%)并配 PodDisruptionBudget，避免节点维护时 extproc 容量突降把延迟打爆。

---

## 8. 对比与选择

| 维度 | Envoy AI Gateway | Kgateway | LiteLLM | Kong AI Gateway | Apipost AI Gateway |
|------|------------------|----------|---------|-----------------|--------------------|
| 数据平面 | Envoy Proxy | Envoy Proxy | Python(uvicorn) | Nginx + OpenResty | 自研代理 |
| 上游基础 | Envoy Gateway | Envoy / Gateway API | 独立 Python | Kong Gateway | 独立产品 |
| Gateway API 原生 | 是(CRD: AIGatewayRoute 等) | 是(Gateway API + CRD) | 否(需自部署) | 部分(Ingress 为主) | 否 |
| CNCF 归属 | CNCF Landscape | CNCF(Solo 主导) | 非 CNCF | 非 CNCF | 非 CNCF(国产) |
| K8s 原生部署 | 是(Helm + CRD) | 是(Helm + CRD) | 否(需 Helm/Sidecar) | 是(KIC) | 部分 |
| 多 provider 路由 | 强 | 强 | 强(强项，100+) | 强(插件) | 强(国内 provider 全) |
| Token 限流(TPM) | 原生支持 | 支持 | 强 | 强(AI 插件) | 支持 |
| 流式 SSE 处理 | extproc 透传 + 解析 | extproc 透传 | 原生 | 原生 | 原生 |
| 自动失败转移 | 原生支持 | 支持 | 强(fallbacks) | 支持 | 支持 |
| 鉴权方式 | APIKey/mTLS/OIDC + BackendSecurityPolicy | Gateway API TLS/ExtAuth | API Key/虚拟 Key | Key/Auth 插件 | API Key/SSO |
| 日志/审计 | dynamic metadata + 访问日志 | Envoy 访问日志 | 内置 spend 日志 | 日志插件 | 内置审计 |
| RAG / Agent 编排 | 不做(仅治理) | 不做 | 部分(路由层) | 插件 | 部分 |
| 开源许可 | Apache-2.0 | Apache-2.0 | MIT(企业版另收费) | Apache-2.0(企业版闭源) | 商业(部分开源) |
| 语言/生态 | Go / Envoy 生态 | Go / Envoy 生态 | Python | Lua / Kong 生态 | Go / Node |
| 成熟度 | v0.x，快速迭代 | 新项目 | 成熟，社区大 | 成熟，企业级 | 成熟(国内) |
| 中文/本土化 | 一般 | 一般 | 一般 | 一般 | 强(国产 + 本土 provider) |

**选 Envoy AI Gateway 的典型场景：**

- 已经(或计划)用 Envoy Gateway 作为北向入口，想让 AI 流量复用同一套治理平面。
- 要求 CNCF 原生、走标准 Kubernetes Gateway API，不想绑定厂商。
- 需要细粒度 Token 预算限流、多 provider 失败转移、统一 OpenAI 兼容入口。
- 团队有 Envoy / Go 运维能力，能接受 v0.x 的快速迭代。

**不选它的情况：** 想要开箱即用的 Python 代理与丰富 provider 适配(选 LiteLLM)；已有 Kong 基础设施(选 Kong AI Gateway)；需要纯非 K8s 部署；国内场景对本土 provider(通义/文心/智谱/DeepSeek)与本地化合规有强需求(选 Apipost AI Gateway)。

**一句话裁决**：Envoy AI Gateway 与 Kgateway 同源(都是 Envoy + Gateway API)，差异主要在 CRD 抽象——Envoy AI Gateway 用 `AIGatewayRoute` 把 LLM 语义直接做进 Gateway API，Kgateway 更强调"通用扩展点 + AI 挂件"。如果团队已经把 AI 流量当一等公民来治理(预算/计费/审计有专门要求)，Envoy AI Gateway 的 CRD 模型更直接；如果只是顺带接个 LLM、希望最小侵入，LiteLLM 或 Kgateway 上手更快。

```
决策快速分流:
  已有 Envoy Gateway 且要 AI 治理 ─► Envoy AI Gateway
  已有 Kong / 想一体化企业网关     ─► Kong AI Gateway
  纯 K8s、要最少代码、多 provider ─► LiteLLM(最易上手)
  国内本土 provider + 合规优先     ─► Apipost AI Gateway
```

---

## 9. 常见问题 FAQ

**Q1: 必须先装 Envoy Gateway 吗？能独立运行吗？**
不能独立运行。Envoy AI Gateway 是 Envoy Gateway 的扩展，依赖其 GatewayClass 与数据平面；安装时需先部署 Envoy Gateway，再装 AI Gateway 的 Helm chart。

**Q2: 对客户端的协议要求是什么？**
默认是 OpenAI 兼容协议(`/v1/chat/completions`)。客户端用任意 OpenAI SDK 即可，通过 `x-model-name` 等头选择逻辑模型，后端是 Anthropic/Gemini/vLLM 都无感。

**Q3: Token 限流在流式响应下准确吗？**
准确的前提是 provider 在响应(或最后一个 SSE chunk)里返回 `usage`。extproc 会解析并累加；若某 provider/模型不返回 usage，则该路径只能退化为 RPM 限流。

**Q4: extproc 挂了会怎样？**
Envoy 默认对 extproc 失败有降级行为，但建议配置 failureModeAllow 与健康检查，并保持多副本。extproc 异常会直接影响 token 统计与脱敏功能，需重点监控。

**Q5: 如何做模型版本灰度？**
用模型别名 + 多 backend 权重：把 `chat-fast` 同时指向新旧模型实例，按 weight 分流(如 90/10)，逐步切量，应用层零改动。

**Q6: 支持 RAG / 工作流编排吗？**
不支持。Envoy AI Gateway 聚焦"流量治理与路由"，不做检索增强、Agent 编排。RAG/编排应在应用层或专门的推理平台(如 KServe、vLLM)完成，网关只负责把它们接到统一入口。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] — CNCF 云原生 AI 总览
- [[CNCF_Cloud_Native_AI/Kgateway_Deep_Dive]] — 同为 Envoy + Gateway API 的 AI 网关对照
- [[CNCF_Cloud_Native_AI/AgentGateway_Deep_Dive]] — 面向 Agent 流量的网关
- [[12_架构基建/11_AI_Gateway/AI_Gateway_2026]] — AI Gateway 总论与方法论
- [[12_架构基建/11_AI_Gateway/AI_Gateway_Comparison_2026]] — 各类 AI 网关横向对比
