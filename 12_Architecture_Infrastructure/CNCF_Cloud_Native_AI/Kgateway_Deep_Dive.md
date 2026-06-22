---
title: "Kgateway: Envoy 内核的 API 与 AI 双模网关"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kgateway", "envoy", "api-gateway", "ai-gateway", "kubernetes", "gateway-api"]
summary: "> **一句话理解**: Kgateway 是基于 Envoy 的 Kubernetes Gateway API 实现 (CNCF 景观, 前身 Gloo Gateway)——从微网关到集中式网关再到 AI 网关一套通吃, 既管内部 API 也给外部 LLM 调用加安全/治理。"
created: "2026-06-16"
updated: "2026-06-16"
---

# Kgateway: Envoy 内核的 API 与 AI 双模网关

> **一句话理解**: Kgateway 是基于 Envoy 的 Kubernetes Gateway API 实现 (CNCF 景观, 前身 Gloo Gateway)——从微网关到集中式网关再到 AI 网关一套通吃, 既管内部 API 也给外部 LLM 调用加安全/治理。

> 📐 **概念方法论**: 理解 Kgateway 的关键在于它把「网关」从一个角色拆成了「一条可伸缩的轴线」——同一套 Envoy + Gateway API 内核, 既能在两个微服务之间当轻量微网关 (east-west), 又能顶在集群边缘扛十亿级 API (north-south), 还能给应用调外部 LLM 的流量套上安全与治理。这与 [[12_Architecture_Infrastructure/AI_Gateway/AI_Gateway_2026]] 讨论的「AI 网关应该长什么样」直接呼应, 也与 [[CNCF_Cloud_Native_AI/Envoy_AI_Gateway_Deep_Dive]] 同源 (都基于 Envoy + ext_proc 处理 AI 流量), 区别在于 Kgateway 的野心是「一个网关管完所有 API, 包括 AI」。

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

```
Kgateway: The Cloud-Native API Gateway and AI Gateway
═══════════════════════════════════════════════════════════════════════
仓库: github.com/kgateway/kgateway
归属: 前身为 Solo.io 的 Gloo Gateway (Envoy 系最成熟、部署最广的网关之一)
分类: CNCF Landscape → AI Native Infra
版本: v1.x (2025), 向 CNCF 捐赠 / 重命名

核心定位 (一句话):
  一个 Envoy-based 网关, 同时是「通用 API 网关」和「AI 网关」
  —— 对内连接任意云任意环境的 API, 对外给第三方 LLM 调用加治理。

一条网关轴线 (一套内核, 三种用法):
  ┌──────────────┐   ┌──────────────────────┐   ┌──────────────┐
  │ 微网关       │ → │ 集中式网关            │ → │ AI 网关      │
  │ Microgateway │   │ Centralized Gateway   │   │ AI Gateway   │
  │ 服务间东西向 │   │ 集群边缘十亿级 API    │   │ LLM 路由/安全│
  │ 轻量、低延迟 │   │ 高并发、多集群        │   │ 治理、审计   │
  └──────────────┘   └──────────────────────┘   └──────────────┘
        ←───────────── 同一套 Envoy + Gateway API 内核 ─────────────→

它是什么:
✓ Kubernetes Gateway API 的原生实现 (HTTPRoute / Gateway / TCPRoute)
✓ Envoy 数据面 (成熟、高性能、可编程)
✓ AI 网关扩展 (LLM provider 路由、内容安全、第三方 LLM 治理/审计)
✓ 全向 API 连接 (any cloud, any environment, multi-cluster)
```

### 1.2 核心特性

| 特性 | 说明 | 解决的痛点 |
|------|------|-----------|
| **Envoy 数据面** | 以 Envoy 为代理内核, 继承其过滤器、可观测、mTLS 能力 | 自研数据面不稳/性能差, Envoy 是工业标准 |
| **Gateway API 原生** | 直接实现上游 Kubernetes Gateway API 标准 (Gateway/HTTPRoute/TCPRoute), 非私有 CRD 黑魔法 | 跟随社区标准, 避免供应商锁定, 可换实现 |
| **三合一 (微+集中+AI)** | 一套内核覆盖服务间微网关、边缘集中网关、AI 网关 | 不想为每种场景各部署一套网关 |
| **东西向 + 南北向** | 既能处理集群内服务到服务流量, 也能顶在边缘接外部流量 | 一个网关统一内外流量治理 |
| **AI 治理扩展** | 对调用第三方 LLM 的流量做 provider 路由、内容安全、审计 | 应用直连 OpenAI/Claude 等无安全/成本/合规管控 |
| **多集群 / 多云** | 全向连接任意云、任意环境的后端 | 跨云、跨集群 API 统一入口 |
| **mTLS / WAF / 限流 / 认证** | 企业级安全栈: mTLS、Web Application Firewall、速率限制、OIDC/API Key | 生产 API 暴露所需的标配能力 |
| **ext_proc 处理 AI 流量** | 通过 Envoy external processor 拦截并改写 LLM 请求/响应 | LLM 流量需 body 级处理 (改写/审查/token 计量) |

### 1.3 项目状态与版本历程

Kgateway 的血统是它最重要的「信用背书」: 它源自 Solo.io 的 **Gloo Gateway**, 这是 Envoy 生态中最成熟、部署最广的 Kubernetes 网关之一。重命名并捐赠为开源的 Kgateway 后, 它把多年积累的翻译层、扩展能力带到了社区。

| 时间 | 事件 |
|------|------|
| 2017–2024 | Solo.io 推出 Gloo Gateway, 基于 Envoy, 积累成熟的 Gateway API 翻译层与企业扩展 |
| 2025 | 重命名/捐赠为 `kgateway/kgateway`, 纳入 CNCF Landscape (AI Native Infra), 进入 v1.x |
| 2025–2026 | 强化 AI 网关能力 (LLM provider 路由、内容安全、治理审计), 走「通用 API + AI」双模路线 |

---

## 2. 核心概念

### 2.1 Kgateway 如何扩展 Gateway API

Kgateway 不是「另起炉灶」, 而是**站在 Kubernetes Gateway API 标准之上**做加法: 标准 CRD (Gateway/HTTPRoute/TCPRoute) 照用, Kgateway 用自定义 CRD 补齐 Gateway API 没覆盖的「更丰富的后端抽象」和「认证/AI 策略」。

```
              Kubernetes Gateway API (上游标准, Kgateway 原生实现)
              ┌─────────────────────────────────────────────┐
   用户声明 → │  Gateway        (监听器: 端口/TLS/协议)      │
              │  HTTPRoute      (路由规则: 匹配→后端)        │
              │  TCPRoute       (TCP 路由)                  │
              └─────────────────────────────────────────────┘
                              │
              Kgateway 自定义 CRD (扩展层, 补标准之不足)
              ┌─────────────────────────────────────────────┐
              │  Upstream / UpstreamGroup  (更丰富的后端抽象)│
              │  DirectResponse            (直接响应)       │
              │  AuthConfig                (认证策略)       │
              │  AI 相关 Filter            (LLM 路由/安全)  │
              └─────────────────────────────────────────────┘
                              │
                      Kgateway 控制面翻译
                              ▼
                    Envoy xDS 配置 (数据面执行)
```

### 2.2 核心 CRD 逐解

| CRD | 类别 | 角色 | 说明 |
|-----|------|------|------|
| **Gateway** | 标准 | 监听器定义 | 声明端口、协议、TLS; Kgateway 作为 controller 实现它 |
| **HTTPRoute** | 标准 | HTTP 路由规则 | 按主机/路径/header 匹配, 转发到后端 |
| **TCPRoute** | 标准 | TCP 路由 | 对四层流量做路由 |
| **Upstream** | 扩展 | 后端抽象 | 比 Gateway API 的 BackendRef 更丰富, 可表达任意云/任意环境的后端 (K8s Service、外部 IP、云函数等), 这是 Kgateway「全向连接」的基础 |
| **UpstreamGroup** | 扩展 | 后端分组 | 把多个 Upstream 组合成逻辑后端, 支持加权/故障转移 |
| **DirectResponse** | 扩展 | 直接响应 | 不转发后端, 直接返回固定内容 (如维护页、降级响应) |
| **AuthConfig** | 扩展 | 认证策略 | 声明 OIDC / API Key / JWT 等认证方式, 绑定到路由 |
| **AI Filter** | 扩展 | AI 流量策略 | LLM provider 路由、prompt/response 内容安全、token 审计 |

### 2.3 为什么需要 Upstream (而不只用 Service)

Gateway API 的 BackendRef 默认指向 Kubernetes Service, 但生产中后端远不止 K8s 内 Service: 一个外部 LLM API、另一个集群的服务、云上的函数。**Upstream 把「后端」抽象成统一的、可被路由引用的对象**, 这是 Kgateway 实现「any cloud, any environment」全向连接的关键。

### 2.4 关键字段速查

下表把生产配置中最常被引用的字段与职责集中列出, 写 YAML 时可对照:

| CRD | 关键字段 | 职责 |
|-----|---------|------|
| **Gateway** | `spec.gatewayClassName`, `spec.listeners[].{protocol,port,tls}` | 声明由哪个 controller 实现、暴露哪些端口/协议/TLS |
| **HTTPRoute** | `spec.hostnames`, `spec.rules[].{matches,backendRefs,filters}` | 主机/路径/header 匹配、转发目标、扩展过滤器挂载点 |
| **Upstream** | `spec.type` (`static`/`kubernetes`/`aws`/`azure`/...), `spec.static.hosts[]` | 把任意云后端 (K8s Service / 外部 IP / 云函数) 统一抽象 |
| **UpstreamGroup** | `spec.destinations[].{upstreamRef,weight}` | 加权/故障转移的后端组合, 灰度与多区路由基础 |
| **AuthConfig** | `spec.configs[].{apiKeyAuth,oidc,jwt}` (经 extensionRef 绑路由) | 与路由解耦的认证策略集合 |
| **DirectResponse** | `spec.status`, `spec.body` | 不经后端直接返回固定内容 (维护页/降级/合规拦截) |
| **AIFilter** | `spec.providerRouting.rules[]`, `spec.promptSafety`, `spec.audit` | provider 分流、prompt/response 安全、token 审计 |

### 2.5 东西向 vs 南北向拓扑

```
  南北向: 外部用户 → Kgateway(集中; 80/443; OIDC/WAF/限流) → 集群 Services
          (单一入口、终结 TLS、副本规模 = 边缘并发量)
  东西向: Svc A + kgw(mTLS/限流) ──► Svc B + kgw ──► Svc C ...
          (hop-by-hop 治理、延迟敏感、与服务共伸缩)
```

南北向是「少数大实例顶在集群边缘」(多副本+PDB+跨可用区), 东西向是「多份小实例贴近服务」(per-call 认证/限流); AI 网关常叠加在南北向出口 (外部应用 → 集群 → 第三方 LLM)。两者共享同一控制面模型 (Gateway API + Upstream + AuthConfig), 仅部署形态与副本规模不同。

---

## 3. 架构设计

### 3.1 控制面 + 数据面

Kgateway 是经典的「控制面翻译 + Envoy 数据面」结构: 控制面 watch Kubernetes API (Gateway API + 自定义 CRD), 把用户声明翻译成 Envoy 的 xDS 配置, 通过流式 gRPC 下发给 Envoy。

```
                    ┌─────────────────────────────────────────────┐
                    │              Kgateway 控制面                 │
                    │  ┌────────────┐   ┌───────────────────────┐ │
   用户 apply CRD → │  │ API Watch  │ → │ Translator (翻译层)   │ │
                    │  │ (CRDs/Svc) │   │ Gateway API + 扩展    │ │
                    │  └────────────┘ │ → Envoy xDS 配置        │ │
                    │                 └───────────┬───────────┘ │
                    └─────────────────────────────┼─────────────┘
                                                   │ xDS (streaming gRPC)
                                                   ▼
                    ┌─────────────────────────────────────────────┐
                    │            Envoy 数据面 (代理)              │
                    │  ┌─────────┐  ┌──────────┐  ┌───────────┐ │
   客户端 ──流量──► │  │ Listener│→│ Router   │→ │ Upstream  │──► 后端
                    │  └─────────┘  │ +Filter  │  │ Cluster   │ │
                    │               └──────────┘  └───────────┘ │
                    │     (AI 流量经 ext_proc sidecar 处理)      │
                    └─────────────────────────────────────────────┘
```

### 3.2 AI 流量的 ext_proc 路径

普通 API 流量走 Envoy 的 Listener → Router → Cluster 即可, 但 **LLM 流量需要读取/改写 HTTP body** (审查 prompt、改写 provider、计量 token、过滤响应), 这超出了 Envoy 原生路由能力。Kgateway 通过 **ext_proc (external processor)** 处理: AI Filter 把 LLM 流量导到一个 external processor, 在那里做内容安全、provider 路由改写、审计。

```
   App ──POST /v1/chat/completions──► Envoy ──► ext_proc (AI 处理器)
                                                      │
                                         ┌────────────┴────────────┐
                                         │ • 内容安全 (prompt 审查)│
                                         │ • provider 路由/改写     │
                                         │ • token 计量/审计        │
                                         │ • 响应过滤              │
                                         └────────────┬────────────┘
                                                      │ 改写后转发
                                                      ▼
                                          第三方 LLM (OpenAI/Claude/…)
```

### 3.3 东西向 + 南北向拓扑

Kgateway 的「一套内核三种用法」在部署拓扑上体现为同一数据面被放在不同位置:

```
                         ┌─── 外部用户 / 互联网
                         │
                 ┌───────▼────────┐
                 │  Kgateway      │  ← 北向 (North-South): 集群边缘
                 │  Centralized   │     集中式网关, 扛大并发
                 │  Gateway       │
                 └───────┬────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      ┌───────┐     ┌───────┐      ┌───────┐
      │Svc A  │◄───►│Svc B  │◄────►│Svc C  │  ← 东向 (East-West):
      │  ▲    │ Kgw │  ▲   │ Kgw  │  ▲    │     服务间微网关
      │kgw si │  si │kgw si│  si  │kgw si │     (sidecar/微网关)
      └───┬───┘     └──┬───┘      └───┬───┘
          │            │              │
          └────────────┴──────► App 调外部 LLM 时
                              Kgateway AI Filter 加治理
```

---

## 4. 安装部署

### 4.1 前置条件

| 组件 | 版本/要求 | 说明 |
|------|----------|------|
| Kubernetes 集群 | ≥ 1.27 | 托管 (EKS/GKE/AKS) 或自建均可; 东西向部署建议 NetworkPolicy 可用 |
| Gateway API CRDs | v1.2+ (standard channel) | `standard-install.yaml`; 用实验特性时切 `experimental` 通道 |
| Helm | ≥ 3.12 | 安装 Kgateway 控制面与数据面 chart |
| Envoy 数据面镜像 | 由 chart 默认提供 | 私仓场景可覆盖 `image.repository/tag`; 行为对齐 Envoy v1.30+ |
| cert-manager | ≥ 1.13 (可选) | 自动签发 webhook/mTLS 内部证书 |
| mTLS 信任根 | SPIFFE 或自定义 CA | 跨集群东西向 mTLS 的前提, 需提前分发 trust bundle |
| 资源预算 | 见 §6.1 sizing | 按 QPS/body 规模给 Envoy 预留 CPU/内存 |

### 4.2 Helm 安装

```bash
# 1. 添加 Helm 仓库
helm repo add kgateway https://kgateway.github.io/kgateway
helm repo update

# 2. 安装 Gateway API 标准 CRDs (若集群未自带)
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.0/standard-install.yaml

# 3. 安装 Kgateway (含控制面)
helm install kgateway kgateway/kgateway \
  --namespace kgateway-system \
  --create-namespace \
  --version 1.0.0

# 4. 验证
kubectl get pods -n kgateway-system
kubectl get gatewayclass
```

### 4.3 GatewayClass 设置

Kgateway 通过 `GatewayClass` 声明它是 Gateway 资源的 controller:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: kgateway
spec:
  controllerName: kgateway.dev/gateway-controller
```

### 4.4 部署形态选择

| 形态 | 用法 | 数据面位置 | 适用 |
|------|------|-----------|------|
| 集中式 (North-South) | 顶在集群边缘 | 独立 Deployment, 多副本 | 对外 API 入口、集中治理 |
| 微网关 (East-West) | 服务间 | 按需部署的轻量实例 | 服务间 mTLS/限流 |
| AI 网关 | 给 LLM 流量加治理 | 与集中式共用或独立 | 应用调第三方 LLM |

### 4.5 多环境安装矩阵

| 环境 | 控制面位置 | 数据面形态 | 关键注意 |
|------|-----------|-----------|----------|
| 托管 K8s (EKS/GKE/AKS) | 独立 namespace | LoadBalancer-type Gateway, 走云 LB | 云 LB 终结前置流量, Kgateway 接第二层 |
| 自建 / on-prem | 同集群 | NodePort 或 MetalLB + external-dns | 证书与外层 ingress 衔接, 注意出网代理 |
| 多集群 | 中心控制面或每集群一套 | 各集群独立 Envoy, 经 Upstream 互联 | 东西向 mTLS 跨集群, 控制面集中下发 |
| 边缘 / 资源受限 | 裁剪控制面 | 单副本 Envoy | 仅做微网关, 关闭非必要 filter |

### 4.6 高可用拓扑要点

生产 HA 至少做到四点: ① Envoy Deployment **≥ 3 副本**并用 `topologySpreadConstraints` 跨可用区打散; ② 配 PodDisruptionBudget, `minAvailable` 留出滚动窗口; ③ 节点反亲和 (`podAntiAffinity`) 避免同节点堆积; ④ 控制面独立副本 (Helm 默认提供), 其故障不影响数据面热路径——xDS 已下发配置驻留在 Envoy 内存, 控制面恢复后再增量同步。完整 sizing/PDB YAML 见 §6.2。

---

## 5. 快速开始

下面用一个完整例子演示 Kgateway 的双模: 先定义一个 Gateway + HTTPRoute 服务内部 API, 再加一条 **AI 路由** 把 `/llm/*` 转发到第三方 LLM, 同时挂认证和内容过滤。

### 5.1 定义 Gateway (监听器)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: demo-gateway
  namespace: default
spec:
  gatewayClassName: kgateway
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      allowedRoutes:
        namespaces:
          from: All
```

### 5.2 内部 API 路由 (HTTPRoute)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: orders-api-route
  namespace: default
spec:
  parentRefs:
    - name: demo-gateway
  hostnames:
    - "api.example.com"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /orders
      backendRefs:
        - name: orders-service
          port: 8080
```

### 5.3 给第三方 LLM 加路由 + 认证 + 内容过滤 (AI 路由)

```yaml
# 后端抽象: 一个指向第三方 LLM 的 Upstream
apiVersion: kgateway.dev/v1alpha1
kind: Upstream
metadata:
  name: openai-llm
  namespace: default
spec:
  type: static
  static:
    hosts:
      - host: api.openai.com
        port: 443
---
# 认证策略: 要求调用方带 API Key
apiVersion: kgateway.dev/v1alpha1
kind: AuthConfig
metadata:
  name: llm-api-key-auth
  namespace: default
spec:
  configs:
    - apiKeyAuth:
        header: X-API-Key
        k8sSecretRef:
          name: llm-caller-keys
          namespace: default
---
# AI 路由: /llm/* → 第三方 LLM, 挂认证 + 内容安全
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: llm-route
  namespace: default
spec:
  parentRefs:
    - name: demo-gateway
  hostnames:
    - "api.example.com"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /llm
      filters:
        - type: ExtensionRef
          extensionRef:
            group: kgateway.dev
            kind: AuthConfig
            name: llm-api-key-auth
        - type: ExtensionRef
          extensionRef:
            group: kgateway.dev
            kind: AIFilter
            name: llm-content-safety
      backendRefs:
        - group: kgateway.dev
          kind: Upstream
          name: openai-llm
```

### 5.4 测试

```bash
# 内部 API (无需认证)
curl -H "Host: api.example.com" \
  http://$(kubectl get gateway demo-gateway -o jsonpath='{.status.addresses[0].value}')/orders

# AI 路由 (需 API Key, 经内容过滤)
curl -X POST -H "Host: api.example.com" -H "X-API-Key: $CALLER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"hello"}]}' \
  http://$GW_ADDR/llm/v1/chat/completions
```

---

## 6. 生产配置

### 6.1 Envoy 数据面资源 sizing

Envoy 的资源消耗与连接数、并发请求、body 处理量正相关。LLM 流量因 body 大、流式响应, 单连接内存高于普通 API。

| 规模 | 副本数 | CPU/副本 | 内存/副本 | 备注 |
|------|--------|---------|----------|------|
| 小 (开发/低负载) | 2 | 0.5 | 512Mi | 最低 HA |
| 中 (常规生产) | 3–5 | 2 | 2Gi | P99 敏感 |
| 大 (集中式/含 AI) | 5+ | 4+ | 4Gi+ | LLM body 大, 内存留足 |

### 6.2 高可用拓扑

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kgateway-envoy
  namespace: kgateway-system
spec:
  replicas: 5
  strategy:
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    spec:
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              app: kgateway-envoy
      containers:
        - name: envoy
          resources:
            requests: { cpu: "2", memory: "2Gi" }
            limits:   { cpu: "4", memory: "4Gi" }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: kgateway-envoy-pdb
  namespace: kgateway-system
spec:
  minAvailable: 3
  selector:
    matchLabels:
      app: kgateway-envoy
```

### 6.3 AI 治理过滤器

生产 AI 网关的核心价值是把「应用直连 LLM」变成「经过治理的调用」:

| 治理点 | 配置 | 作用 |
|--------|------|------|
| **LLM Provider 路由** | 按 model/header 路由到不同 Upstream (OpenAI/Claude/自建) | 多供应商、故障转移、成本优化 |
| **Prompt 内容安全** | ext_proc 审查请求 prompt (PII/越狱/敏感词) | 防数据泄露、防滥用 |
| **Response 过滤** | 审查/改写 LLM 返回内容 | 合规、去敏感信息 |
| **Token 审计日志** | 记录每次调用的 input/output token、model、调用方 | 计费、成本分摊、合规留痕 |
| **Per-tenant 限流** | 按调用方/API Key 限流, 区分普通/流式 | 防失控、控成本 |

```yaml
apiVersion: kgateway.dev/v1alpha1
kind: AIFilter
metadata:
  name: llm-content-safety
  namespace: default
spec:
  # provider 路由: 按 model 名分流
  providerRouting:
    rules:
      - match: { model: "gpt-4o" }
        upstreamRef: { name: openai-llm }
      - match: { model: "claude-*" }
        upstreamRef: { name: anthropic-llm }
  # 内容安全: prompt 审查
  promptSafety:
    redactPII: true
    blockPatterns: ["system override", "ignore previous"]
  # 审计
  audit:
    logTokens: true
    sink: { type: stdout }
```

### 6.4 限流 / 认证 / 多集群

- **限流**: 绑定 RateLimitPolicy, 区分租户与流式/非流式; AI 流式响应按连接限流更合理。
- **认证**: AuthConfig 支持 OIDC (南北向用户流量) 与 API Key (服务间 / LLM 调用方)。
- **多集群**: 通过 Upstream 抽象把其他集群/云的后端纳入同一网关, 配合 mTLS 跨集群通信。

```yaml
apiVersion: kgateway.dev/v1alpha1
kind: UpstreamGroup
metadata:
  name: orders-multi-region
  namespace: default
spec:
  destinations:
    - upstreamRef: { name: orders-us-east }
      weight: 70
    - upstreamRef: { name: orders-eu-west }
      weight: 30
```

---

## 7. 运维与可观测

### 7.1 Envoy admin / 原生统计

```bash
# Envoy admin 统计 (若暴露)
kubectl exec -n kgateway-system deploy/kgateway-envoy -- \
  curl -s localhost:19000/stats | grep upstream

# 关键看: upstream_rq_total / upstream_rq_5xx / upstream_cx_active
```

### 7.2 Access Logs 与 Prometheus 指标

| 指标 | 用途 |
|------|------|
| `envoy_http_downstream_rq_total` | 入口请求总量 (南北向吞吐) |
| `envoy_cluster_upstream_rq_5xx` | 后端 5xx, 排障核心 |
| `envoy_cluster_upstream_cx_active` | 活跃连接, 容量规划 |
| `kgateway_llm_calls_total{provider,model}` | AI 调用计数 (按 provider/model) |
| `kgateway_llm_tokens_total{direction}` | input/output token, 计费与成本 |
| `kgateway_llm_request_duration` | LLM 调用端到端延迟直方图 |
| `kgateway_translation_errors` | 控制面翻译错误, 配置排障 |

### 7.2.1 PromQL 常用查询

```promql
# 入口 RPS (按 Envoy Pod) + 后端 5xx 比率 (排障核心, 生产应 < 0.1%)
sum(rate(envoy_http_downstream_rq_total[1m])) by (kubernetes_pod_name)
sum(rate(envoy_cluster_upstream_rq_5xx[5m])) by (envoy_cluster_name)
  / clamp_min(sum(rate(envoy_cluster_upstream_rq_total[5m])) by (envoy_cluster_name), 1)

# 活跃上游连接 (容量规划, 决定是否扩 Envoy 副本)
sum(envoy_cluster_upstream_cx_active) by (envoy_cluster_name)

# LLM 调用速率与 P95 延迟 + token 成本速率 (input/output, 成本告警)
sum(rate(kgateway_llm_calls_total[5m])) by (provider, model)
histogram_quantile(0.95, sum(rate(kgateway_llm_request_duration_bucket[5m])) by (le, provider))
sum(rate(kgateway_llm_tokens_total[5m])) by (direction)
```

把上述查询配进 Grafana + Alertmanager, 建议至少建两条告警: 后端 5xx 比率 > 1% 持续 5 分钟, 以及 `kgateway_translation_errors` 增长 (配置下发异常)。

### 7.3 故障排查

| 症状 | 可能原因 | 处理 |
|------|---------|------|
| HTTPRoute 配置不生效 | 控制面翻译失败, 看 `kgateway_translation_errors` 与 controller 日志 | 校验 CRD 语法、backendRef/Upstream 是否存在、GatewayClass 是否被认领 |
| 大量 503 (no healthy upstream) | Upstream 不可达, 或 Envoy 无健康端点 | 检查 Upstream/Service、配置主动健康检查、确认 endpoint 未被 outlier detection 全弹 |
| Envoy OOM | 连接/流式 body 占内存超限 | 调大内存 limit; 排查长连接/流式泄漏; 降并发或扩副本 |
| LLM 调用延迟飙升 | ext_proc 成为瓶颈, 或上游 LLM 自身慢 | 扩 ext_proc 副本; 区分网关延迟 (`kgateway_llm_request_duration`) 与上游延迟 |
| AI filter 超时 | ext_proc 处理时间超过默认 deadline | 调大 `ext_proc` 超时; 收窄 blockPatterns; 评估是否走流式 |
| 限流风暴 (rate-limit storm) | 全局 rate-limit 后端抖动或 Redis 抖动 | 检查 rate-limit 后端健康; 切本地限流兜底; 排查触发计数异常 |
| mTLS 握手失败 | 证书过期、SPIFFE trust domain 不匹配、SAN 错 | 检查证书有效期、trust bundle、SAN 与目标 Upstream host |
| Envoy drain 超时 (滚动卡住) | 长连接/流式不退出, drain 时间过长 | 调小 `drainTimeSeconds`; 客户端配 keepalive; 滚动前主动缩流 |
| Listener 冲突 (端口不生效) | 多个 Gateway 争同一端口、Route 不能 attach | 看 Gateway `status.conditions` 的 `Conflicted/Accepted`; 收敛监听器所有权 |
| AI 内容安全误杀 | blockPatterns 过宽、命中正常 prompt | 收紧规则, 加白名单, 看 ext_proc 拒绝日志 |

### 7.4 升级

Kgateway 升级分两层: 控制面 (Helm chart) 与数据面 (Envoy)。Helm 升级会滚动控制面, xDS 不中断数据面; 但 Envoy 配置变更 (新 xDS) 可能触发 Envoy 热重载或滚动重启, 因此务必先 dry-run 再执行, 并在低峰窗口操作。

```bash
# 先看 helm diff, 再滚动升级
helm repo update
helm upgrade kgateway kgateway/kgateway \
  --namespace kgateway-system \
  --version 1.1.0 --dry-run

# 确认无误后执行; Envoy 由控制器滚动重启
helm upgrade kgateway kgateway/kgateway \
  --namespace kgateway-system --version 1.1.0
```

---

## 8. 对比与选择

### 8.1 横向对比

| 维度 | Kgateway | Envoy AI Gateway | Istio | Cilium | Kong | APISIX |
|------|----------|------------------|-------|--------|------|--------|
| 数据面 | Envoy | Envoy | Envoy | eBPF/Envoy | Nginx+Lua | Nginx+Lua |
| Gateway API 原生 | 是 (重点) | 是 | 是 | 是 | 部分 | 部分 |
| 通用 API 网关 | 是 (强项) | 否 (AI 专用) | 偏 service mesh | 偏 CNI/网络 | 是 | 是 |
| AI 网关能力 | 有 (双模) | 有 (核心) | 弱 | 无 | 插件 | 插件 |
| 东西向 + 南北向 | 都覆盖 | 仅南北 | 偏东西 mesh | 偏网络 | 偏南北 | 偏南北 |
| OSS License | Apache-2.0 | Apache-2.0 | Apache-2.0 | Apache-2.0 | Apache-2.0 (CE) | Apache-2.0 |
| 血统 (Heritage) | Solo.io Gloo | Envoy 社区 | Google/IBM | Isovalent | Kong Inc. | Apache |
| 成熟度 | 高 (Gloo 血统) | 较新 | 极高 | 高 | 极高 (企业版非 CNCF) | 高 |
| 适合谁 | Envoy+GW API+AI+通用一套搞定 | 只要 AI 流量 | 已用 Istio mesh | 要 eBPF 网络 | 已用 Kong 生态 | 已用 APISIX 生态 |

### 8.2 选与不选

**选 Kgateway 当**: 你想要 **Envoy 数据面 + Kubernetes Gateway API 标准 + 通用 API 网关 + AI 网关能力, 且都用一套**; 重视 Gloo 的成熟血统; 团队不想为「普通 API」和「AI 流量」各维护一套网关。

**不选 Kgateway 当**: 你只想要纯 AI 流量处理且极简 → 看 Envoy AI Gateway; 已重度用 Istio service mesh → 直接用 Istio 的 Gateway API 实现; 要 eBPF 级网络性能 → 看 Cilium; 已在 Kong/Nginx 生态深耕 → 不必为了 AI 换底盘。

### 8.3 选型裁定

判断顺序可收敛为一条决策流:

```
   需要 AI 治理? ──否──► Istio / Cilium / Kong / APISIX (普通网关或 mesh)
        │是
   已在 Istio mesh? ──是──► 叠 Envoy AI Gateway
        │否
   要统一内外一套? ──是──► Kgateway ✅
        │否
   Envoy AI Gateway (纯 AI 出口)
```

① **是否需要 AI 治理**——不需要则 Istio/Cilium/Kong/APISIX 都行, Kgateway 的 AI 优势用不上; 需要则进入下一步。② **是否已有 service mesh**——已在 Istio 中且只差 AI, 可叠 Envoy AI Gateway; 想统一网关则让 Kgateway 接管南北向。③ **是否要一套覆盖内外**——Kgateway 的差异化正在于此: 同一 Envoy 内核既东西又南北还 AI, 避免「普通网关 + AI 网关 + mesh sidecar」三套数据面并存。血统也影响决策: Kgateway 承自 Gloo, 翻译层与企业特性经多年打磨; Envoy AI Gateway 更轻但只管 AI; Kong/APISIX 走 Nginx+Lua, 与 Envoy 过滤器生态不互通。若痛点是「网关太多、AI 流量没人管、又不想绑死供应商」, Kgateway 是 2026 年最直接的答案。

---

## 9. 常见问题 FAQ

**Q1: Kgateway 和 Gloo Gateway 是什么关系?**
A: Kgateway 源自 Solo.io 的 Gloo Gateway (Envoy 系最成熟、部署最广的网关之一), 重命名并捐赠为开源项目进入 CNCF Landscape。可以理解为 Gloo Gateway 的社区开源延续, 继承了其翻译层与扩展能力。

**Q2: 它和 Envoy AI Gateway 有什么区别?**
A: 二者同源 (都基于 Envoy + ext_proc 处理 AI 流量)。**Envoy AI Gateway 专注 AI 流量处理**, 而 **Kgateway 的野心是「一个网关管完所有 API, 包括 AI」**——既是通用 API 网关又是 AI 网关, 一套内核覆盖微网关、集中网关、AI 网关三种用法。如果只要 AI 能力选前者, 要统一所有 API 选后者。

**Q3: 能纯当通用 API 网关用、不开 AI 功能吗?**
A: 可以。AI 能力通过 AIFilter 扩展挂载, 不挂就完全是个标准的 Envoy + Gateway API 通用网关。AI 是增量能力, 不是必选项。

**Q4: 它是 service mesh 吗?**
A: 不是。它是 API 网关 (无论微网关还是集中式), 不提供 service mesh 的全量 sidecar/数据面互连模型。若需 mesh, 通常与 Istio 等配合: Kgateway 管南北向/网关, mesh 管东西向全量 mTLS。

**Q5: AI 治理能管流式响应 (streaming) 吗?**
A: 通过 ext_proc 可处理流式 body, 但流式场景对内容安全/改写更复杂 (需逐 chunk 处理)。生产中建议流式与非流式分别设策略, 并对 ext_proc 做容量评估。

**Q6: 它是 CNCF 托管项目吗?**
A: 截至 2026-06, Kgateway 列入 CNCF Landscape (AI Native Infra 分类), 源自 Gloo Gateway 的捐赠。具体是否进入 CNCF Sandbox/Incubating 托管流程, 以 CNCF 官方公告为准。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] — CNCF 云原生 AI 项目全景, Kgateway 在「AI 网关 / API 网关」分类
- [[CNCF_Cloud_Native_AI/Envoy_AI_Gateway_Deep_Dive]] — 同源 (Envoy + ext_proc) 的纯 AI 网关, 与 Kgateway 直接对比
- [[CNCF_Cloud_Native_AI/AgentGateway_Deep_Dive]] — 另一种 AI 流量入口思路 (面向 Agent)
- [[12_Architecture_Infrastructure/AI_Gateway/AI_Gateway_2026]] — AI 网关总体架构与方法论, Kgateway 是其实现之一
- [[12_Architecture_Infrastructure/AI_Gateway/AI_Gateway_Comparison_2026]] — 各 AI 网关方案横向对比
