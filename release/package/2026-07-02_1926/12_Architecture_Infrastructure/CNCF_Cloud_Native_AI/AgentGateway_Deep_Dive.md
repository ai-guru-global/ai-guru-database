---
title: "AgentGateway: AI Agent 与 MCP 服务器的代理网关"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "agentgateway", "mcp", "agent", "gateway", "rust", "llm"]
summary: "> **一句话理解**: AgentGateway 是专门给 AI Agent 和 MCP 工具服务器做的反向代理网关(Rust 实现)——把 agent 调用众多工具时的鉴权/路由/限流/沙箱/可观测/协议转换(MCP↔REST↔A2A)集中起来,补齐传统 API 网关不懂 Agent 语义的短板。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Agentgateway Deep Dive"
  - "AgentGateway Deep Dive"
  - AgentGateway_Deep_Dive
sources: []

---
# AgentGateway: AI Agent 与 MCP 服务器的代理网关

> **一句话理解**: AgentGateway 是专门给 AI Agent 和 MCP 工具服务器做的反向代理网关(Rust 实现)——把 agent 调用众多工具时的鉴权/路由/限流/沙箱/可观测/协议转换(MCP↔REST↔A2A)集中起来,补齐传统 API 网关不懂 Agent 语义的短板。

> 📐 **概念方法论**: AgentGateway 解决的不是"如何调 LLM"(那是推理网关的活,见 [[CNCF_Cloud_Native_AI/Envoy_AI_Gateway_Deep_Dive]]),而是"Agent 调出一打工具时,谁来统一治理这些工具调用"。理解它的前提是先理解 Agent 的协议底座——MCP(Model Context Protocol)和 A2A(Agent-to-Agent)这两个 2024-2025 兴起的开放标准(见 [[强化学习/AI_Agents/Agent_Protocols_2026]]):当工具从"应用里硬编码的函数"演变成"独立的 MCP server",agent→tool 的调用就变成了横跨多协议、多后端、需鉴权/审计的网络调用,这正是反向代理网关该接管的地方。AgentGateway 把 Higress/Alibaba 在云原生网关上的积累,平移到了 agent 这条新调用链上。

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

AgentGateway 起源于 **Higress / Alibaba 社区**,用 **Rust** 实现,已进入 CNCF Landscape(AI Native Infra)。定位是 **"Next Generation Agentic Proxy for AI Agents and MCP servers"**——当 agent 和 MCP(Model Context Protocol)工具服务器大量涌现,它们之间的调用链需要一个**懂 agent 语义的反向代理 / API 网关**。

```
   传统 API Gateway (南北向 HTTP)                  AgentGateway (agent → tool)
   ┌────────────────────────────────┐            ┌──────────────────────────────────┐
   │ client ─► [route/auth/rate] ─► │            │ agent ─► [MCP 解析/工具路由]     │
   │  不懂 MCP / 不懂 tool / 不懂 agent│  ──────► │   ├ 鉴权 / 限流(per-tool)        │
   │  ✗ 工具是 MCP server? 不认      │            │   ├ 沙箱(白名单/参数脱敏)        │
   │  ✗ 哪个 agent 调了哪个 tool? 不知│            │   ├ 协议转换 MCP↔REST↔A2A        │
   └────────────────────────────────┘            │   └ 可观测(trace 全链路)         │
                                                  └───────────────┬──────────────────┘
                                                                  ▼
                                                   MCP server A / REST API B / MCP server C
```

一句话:**AgentGateway = 反向代理 + MCP 语义理解 + 集中式工具治理**。它不替代 LLM 网关,而是覆盖 agent 调用链的"另一头"——工具调用治理。

### 1.2 核心特性

| 特性 | 说明 | 生产价值 |
|------|------|----------|
| **MCP server 注册与路由** | 把多个 MCP server / 工具后端登记进注册表,agent 只需指向 AgentGateway 一个入口 | agent 侧零配置,工具后端可热插拔 |
| **统一鉴权** | 为每个工具后端配 API key / OAuth,代理层统一注入,agent 不接触后端密钥 | 密钥集中托管,可轮换可审计 |
| **per-tool 限流与配额** | 按 agent / 工具 / 时间窗设调用上限与配额 | 防失控 agent 把昂贵工具刷爆 |
| **沙箱与策略** | 工具白名单(只允许列出的工具)、参数脱敏(擦除 args 里的 secret) | 防 prompt injection 越权调危险工具 |
| **协议转换** | MCP ↔ REST ↔ A2A 双向翻译,老 HTTP API 也能当 MCP 工具用 | 不必把存量 API 改造成 MCP server |
| **可观测** | trace 哪个 agent 调了哪个工具、参数是什么、结果多大、耗时多少 | agent 黑盒变白盒,可计费可排障 |
| **故障转移 / 负载均衡** | 同一工具多副本间负载均衡,副本宕机自动 failover | 工具后端高可用 |
| **Rust 数据面** | Rust 实现,低内存、高吞吐、无 GC 抖动 | 旁路代理开销极低,适合长期常驻 |

### 1.3 项目状态与版本历程

| 时间 | 事件 | 说明 |
|------|------|------|
| 2024 | Higress 社区孵化 | 把云原生网关能力延伸到 agent / MCP 场景 |
| 2024 下半年 | Rust 数据面成型 | 选 Rust 追求低开销、高并发代理 |
| v0.x (2024→2025) | MCP 注册/路由/鉴权/限流/沙箱核心能力 | 围绕 MCP 标准快速迭代 |
| 2025 | 纳入 CNCF Landscape (AI Native Infra) | 进入云原生 AI 生态版图 |
| 2025+ | 协议转换 (MCP↔REST↔A2A)、可观测增强 | 与 LangGraph / Autogen / kagent 等编排层对接 |

> 仓库:<https://github.com/agentgateway/agentgateway> ｜ License: Apache-2.0 ｜ 安装:Helm chart / 单二进制
> 注:AgentGateway 处于早期(v0.x),配置 schema 仍在演进,生产前务必锁定版本并对齐配置格式(见 §4.2)。

---

## 2. 核心概念

### 2.1 关键术语

| 概念 | 是什么 | 举例 |
|------|--------|------|
| **MCP server** | 用 Model Context Protocol 暴露工具的服务器。agent 通过 MCP 客户端连它,列出/调用工具(类比为工具的 gRPC/HTTP 服务端) | 一个暴露 `search_kb` / `send_email` 工具的 stdio/http 服务 |
| **tool(工具)** | agent 可调用的能力单元(查库/发邮件/查库存)。一个 MCP server 可暴露多个 tool | `search_kb(q)`、`query_metrics(expr)`、`send_email(to, body)` |
| **agent client** | 发起工具调用的一方——某 agent 框架(LangGraph/Autogen/kagent)内嵌的 MCP 客户端,把 AgentGateway 当上游 | LangGraph 节点里的 `streamablehttp_client("http://agentgateway.../mcp")` |
| **registry(注册表)** | "工具后端清单":地址、协议(MCP/REST)、鉴权、健康状态(类比 Envoy cluster / Nginx upstream) | `mcp-kb → http://kb-mcp:8080`、`rest-metrics → http://metrics:9090` |
| **policy(策略)** | 声明式规则:谁能调哪个工具、限流多少、参数怎么脱敏、协议怎么转 | `search_kb: 100/m`、`send_email: 10/m + quota 1000/d` |
| **sandbox(沙箱)** | 强约束工具可见性与参数安全的策略层:工具白名单 + 参数脱敏(工具调用的"防火墙") | `allowTools: [search_kb]` + `redact: { inArgs: [token] }` |
| **protocol translation** | MCP ↔ REST ↔ A2A 双向翻译,让异构后端在 agent 看来都是统一接口 | 把 Prometheus HTTP `/api/v1/query` 包成 MCP 工具 `query_metrics` |

### 2.2 调用拓扑

```
                    ┌──────────────────────────────────────────┐
   Agent (LangGraph/│              AgentGateway                │
   Autogen/kagent)  │  ┌─────────┐ ┌────────┐ ┌─────────────┐ │
       │            │  │registry │ │ policy │ │  sandbox    │ │
       │ MCP client │  │(路由表) │ │(鉴权/限流)│(白名单/脱敏)│ │
       ▼            │  └────┬────┘ └───┬────┘ └──────┬──────┘ │
   ┌─────────┐ tools│──────┴───────────┴─────────────┘        │
   │ MCP call├──────┤  auth + route + rate-limit + redact      │
   └─────────┘      └──────┬───────────────┬───────────────────┘
                           │(协议转换)      │
              ┌────────────┼──────────┐     │
              ▼            ▼          ▼     ▼
        ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
        │MCP srv A │ │REST API │ │MCP srv C │ │MCP srv D │
        │(SSE/http)│ │B(转成MCP)│(fs)      │ │(database)│
        └──────────┘ └─────────┘ └──────────┘ └──────────┘
```

> 关键洞察:agent 只看到一个"统一 MCP 端点",背后是异构后端的真实集合——**把工具治理从 agent 代码里抽出来,下沉到网关**。

### 2.3 一次工具调用的生命周期

从 agent 视角,一次 `tools/call` 在 AgentGateway 内部依次穿过六个治理阶段,每个阶段都对应一项核心能力(接入鉴权 / 工具发现 / 策略限流 / 沙箱脱敏 / 路由转换 / 转发后端),再经第七阶段把脱敏后的结果与可观测数据回程:

```
   agent 发起                AgentGateway 内部治理阶段                         后端执行
   ─────────                ───────────────────────────────────              ─────────

   tools/call ──► ①接入鉴权 ─► ②工具发现 ─► ③策略/限流 ─► ④沙箱脱敏 ─► ⑤路由转换 ─► ⑥转发后端 ──► MCP/REST
        ▲          (API key/     (registry       (per-tool      (allow-      (负载均衡/    (结果过滤/
        │           OAuth)        + 白名单)        rate/quota)    list/redact) 协议翻译)     审计/trace)
        │                                                                     │
        └──────────────── ⑦ 响应回程:脱敏结果 + 指标/trace 上报 ◄────────────────────────┘
```

| 阶段 | 输入 | 输出 | 失败兜底 |
|------|------|------|----------|
| ① 接入鉴权 | agent 的 `X-Agent-Token` | 调用方身份 + 关联 policy | 身份无效 → 401 拒绝 |
| ② 工具发现 | `tools/list` 请求 | 聚合后的全量工具清单(按白名单过滤) | 单后端宕机不影响清单完整性 |
| ③ 策略/限流 | tool name + agent id | 放行 / 拒绝,并扣减配额 | 超限 → 429 |
| ④ 沙箱脱敏 | `args` JSON | 擦除敏感字段后的 args | 含 `block` 字段 → 400 |
| ⑤ 路由转换 | 目标后端 + 协议 | 选定副本 + 译好的请求 | 副本故障自动 failover |
| ⑥ 转发后端 | HTTP / MCP 请求 | 后端原始响应 | 超时/5xx 重试或降级 |
| ⑦ 响应回程 | 后端响应 | 脱敏结果 + trace/metrics/审计 | 全程审计日志落盘 |

---

## 3. 架构设计

### 3.1 整体架构:数据面 + 控制面

AgentGateway 沿用云原生网关经典的"数据面 / 控制面"分离:控制面管配置(MCP server 注册、策略),数据面跑实际代理(Rust,无 GC、低内存、高吞吐)。

```
   ┌─────────────── 控制面 (Control Plane) ───────────────┐
   │ 声明式配置 (YAML/CRD/API) ─► 校验 ─► xDS 热下发      │
   │  ├─ MCP server 注册表  ◄── 运维/GitOps/agent 编排层   │
   │  ├─ policy (鉴权/限流/沙箱)  └─ 协议转换规则         │
   └──────────────────────────┬───────────────────────────┘
                              │ 无需重启数据面
                              ▼
   ┌──────────── 数据面 (Data Plane, Rust) ───────────────┐
   │ listener ─► MCP 解析 ─► auth ─► policy/rate ─► route │
   │    ▲           │           │         │           │   │
   │    │           ▼           ▼         ▼           ▼   │
   │  agent   tools.list/   API key/   配额计数/    cluster│
   │ (MCP     tools.call    OAuth注入  白名单/脱敏  (后端池)│
   │ client)      │           │         │      ├ MCP A    │
   │    └─ resp ◄─┴───────────┴─────────┴──────┼ REST B(转)│
   └─────────────────────────────────────┬─────┴ MCP C ────┘
                                         ▼ metrics/trace/audit
                                   Prometheus / OTel / 日志
```

### 3.2 关键组件职责

| 组件 | 职责 |
|------|------|
| **Rust 数据面** | 实际代理 agent→tool 流量。解析 MCP、注入鉴权、执行限流/沙箱、协议转换、负载均衡、上报指标 |
| **控制面** | 接收声明式配置(注册表/策略),校验后热下发;对接 GitOps / 编排层 |
| **registry** | 工具后端清单(地址、协议、鉴权、健康检查);支持多副本与 failover |
| **policy engine** | 鉴权(API key/OAuth)、per-tool 限流配额、工具白名单、参数脱敏的执行体 |
| **protocol translator** | MCP↔REST↔A2A 双向翻译,把存量 HTTP API 包装成 MCP 工具 |
| **observability sink** | 输出 per-tool 调用指标、trace、审计日志到 Prometheus/OTel |

### 3.3 一次工具调用的全链路

```
   agent: tools/call (name="search_kb", args={q:"...", token:"sk-xxx"})
        │
        ▼  MCP 客户端发给 AgentGateway
   ┌───────────────────────────────────────────────────────────────┐
   │ 1. MCP 解析   : 识别 tools/call, 目标工具 search_kb          │
   │ 2. 鉴权      : 校验调用方身份, 注入后端 API key             │
   │ 3. 策略检查   : 白名单含 search_kb? ✓                       │
   │ 4. 限流      : 配额未耗尽? ✓                               │
   │ 5. 参数脱敏   : 擦除 args.token ──► 后端看不到 secret        │
   │ 6. 路由+均衡  : 选 MCP server A 副本, failover 兜底          │
   │ 7. 协议转换   : 后端是 REST 则把 MCP call 译成 HTTP         │
   └───────────────────────────┬───────────────────────────────────┘
                               ▼ 转发到后端 → 返回结果
   ┌───────────────────────────────────────────────────────────────┐
   │ 8. 响应过滤 : 结果敏感字段按规则脱敏                          │
   │ 9. 可观测   : trace(agent→tool)、latency、args/result 大小   │
   │ 10.配额扣减 : 该工具本周期计数 +1                            │
   └───────────────────────────────────────────────────────────────┘
        │
        ▼ 返回给 agent, agent 据此继续推理
```

### 3.4 MCP 协议是怎么被代理的

MCP 基于 JSON-RPC 2.0,核心方法有 `initialize` / `tools/list` / `tools/call`。AgentGateway **不盲目转发字节流**,而是解析到方法级再按策略处理:

| MCP 方法 | AgentGateway 行为 |
|----------|-------------------|
| `initialize` | 握手,按后端协议适配;可聚合多后端 capability |
| `tools/list` | **聚合**:把注册表里所有后端的工具合并成一份清单返给 agent(并按白名单过滤) |
| `tools/call` | 核心路径:走鉴权→限流→脱敏→路由→转发→响应过滤全链路 |
| `resources/*`、`prompts/*` | 按策略透传或聚合 |

> `tools/list` 的聚合是关键:agent 启动时只问一次 AgentGateway,就能拿到全部工具——后端增减对 agent 透明。

---

## 4. 安装部署

### 4.1 Helm 安装(Kubernetes)

```bash
helm repo add agentgateway https://agentgateway.github.io/agentgateway
helm repo update
helm install agentgateway agentgateway/agentgateway \
  --namespace agentgateway-system --create-namespace \
  --set dataPlane.replicaCount=2 \
  --set service.type=ClusterIP
kubectl get pods -n agentgateway-system   # agentgateway-dp-xxxx Running
```

### 4.2 单二进制安装(本地/裸机)

```bash
curl -L https://github.com/agentgateway/agentgateway/releases/latest/download/agentgateway-linux-amd64 \
  -o /usr/local/bin/agentgateway && chmod +x $_
agentgateway --config ./agentgateway.yaml --log-level info
```

| 项 | 生产要求 |
|----|----------|
| chart 版本 | `helm pull` 锁定具体版本,不用 `latest` |
| 配置 schema | v0.x 仍在演进,升级前比对 release notes 的 breaking changes |
| 数据面副本 | ≥2,跨节点反亲和,避免单点 |
| K8s 版本 | 1.27+(用到标准 Ingress/Gateway API 时) |

### 4.3 注册后端 + 配置策略

一个 `agentgateway.yaml` 同时声明 registry(MCP server / REST 后端)与 policy(鉴权 / 限流 / 沙箱):

```yaml
registry:
  servers:
    - name: mcp-kb                 # MCP server(知识库检索)
      protocol: MCP
      transport: streamable-http
      endpoints: ["http://kb-mcp.search.svc:8080"]
      auth:
        toBackend: { type: APIKey, header: "X-KB-Key", secretRef: { name: kb-key, key: key } }
      healthCheck: { path: /health, interval: 10s }
    - name: rest-metrics           # 存量 REST API(协议转换当 MCP 工具)
      protocol: REST
      endpoints: ["http://metrics-api.monitoring.svc:9090"]
      translation: { exposeAs: MCP, toolName: query_metrics }
      auth:
        toBackend: { type: OAuth2, tokenURL: "http://idp.svc/token", clientId: "agw", clientSecretRef: { name: idp-secret, key: secret } }

policies:
  - name: agent-default
    ingressAuth: { type: APIKey, header: "X-Agent-Token", secretRef: { name: agent-tokens, key: tokens } }
    rateLimit:
      rules:
        - { tool: search_kb,     queries: 100/m }
        - { tool: query_metrics, queries: 60/m }
        - { tool: send_email,    queries: 10/m }
    sandbox:
      allowTools: [search_kb, query_metrics, send_email]
      redact:
        - { inArgs: ["token", "apiKey", "password"] }     # 这些字段从 args 擦除
        - { inResult: ["ssn", "creditCard"] }
```

### 4.4 把 agent 的 MCP client 指向 AgentGateway

agent 侧无需改业务逻辑,只把 MCP 客户端的 endpoint 换成 AgentGateway:

```python
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

# 原来: 直连 kb-mcp.search.svc:8080
# 现在: 指向 AgentGateway,带入口 token
async with streamablehttp_client(
    "http://agentgateway.agentgateway-system.svc/mcp",
    headers={"X-Agent-Token": os.environ["AGENTGW_TOKEN"]},
) as (read, write, _):
    async with ClientSession(read, write) as session:
        await session.initialize()
        tools = await session.list_tools()   # 拿到聚合后的全部工具
```

LangGraph / Autogen / kagent 的 MCP client 接入方式相同——这是 AgentGateway "agent 侧零侵入"的体现。

---

## 5. 快速开始

目标:注册 2 个后端(MCP server + REST API),写一份策略(限流 + 白名单),让一个 agent 通过 AgentGateway 调它们,并看到可观测数据。完整流程五步:**安装**(Helm) → **注册后端 + 写策略**(rate-limit / allow-list / 脱敏) → **指向 AgentGateway**(换 MCP client endpoint) → **触发调用**(`tools/list` + `search_kb`) → **观察 trace**(per-tool 指标 + 端到端链路)。

### 5.1 安装 AgentGateway

```bash
helm repo add agentgateway https://agentgateway.github.io/agentgateway
helm install agentgateway agentgateway/agentgateway \
  --namespace agentgateway-system --create-namespace \
  --set dataPlane.replicaCount=2
kubectl wait --for=condition=ready pod -l app=agentgateway-dp \
  -n agentgateway-system --timeout=120s
```

### 5.2 注册后端 + 写策略

把"1 个 MCP server + 1 个 REST 后端"与"限流 + 白名单 + 脱敏"策略写进 `agentgateway-config.yaml`(限流:`search_kb` 100/m、`query_metrics` 60/m;白名单只放三个工具;入参擦 `token`/`apiKey`/`password`,返回擦 `ssn`/`creditCard`)。紧凑写法如下(展开版见 §4.3):

```yaml
registry:
  servers:
    - name: mcp-kb
      protocol: MCP
      transport: streamable-http
      endpoints: ["http://kb-mcp.search.svc:8080"]
      auth: { toBackend: { type: APIKey, header: "X-KB-Key", secretRef: { name: kb-key, key: key } } }
      healthCheck: { path: /health, interval: 10s }
    - name: rest-metrics
      protocol: REST
      endpoints: ["http://metrics-api.monitoring.svc:9090"]
      translation: { exposeAs: MCP, toolName: query_metrics }
      auth: { toBackend: { type: OAuth2, tokenURL: "http://idp.svc/token", clientId: agw, clientSecretRef: { name: idp-secret, key: secret } } }
policies:
  - name: agent-default
    ingressAuth: { type: APIKey, header: "X-Agent-Token", secretRef: { name: agent-tokens, key: tokens } }
    rateLimit: { rules: [ { tool: search_kb, queries: 100/m }, { tool: query_metrics, queries: 60/m }, { tool: send_email, queries: 10/m } ] }
    sandbox: { allowTools: [search_kb, query_metrics, send_email], redact: [ { inArgs: [token, apiKey, password] }, { inResult: [ssn, creditCard] } ] }
```

下发(配置热生效,无需重启数据面):

```bash
kubectl apply -f agentgateway-config.yaml -n agentgateway-system
kubectl logs -n agentgateway-system deploy/agentgateway-dp | grep "config applied"
```

### 5.3 指向 AgentGateway 并触发调用

agent 侧无需改业务逻辑,只要把 MCP client 的 endpoint 换成网关(Python 写法见 §4.4)。这里用最小 MCP 客户端 `mcplight` 模拟一次调用:

```bash
export AGENTGW_TOKEN=$(kubectl get secret agent-tokens -n agentgateway-system -o jsonpath='{.data.tokens}' | base64 -d)

# 列工具(应看到 search_kb + query_metrics 两个聚合后的工具)
mcplight call http://agentgateway.agentgateway-system.svc/mcp \
  tools/list --header "X-Agent-Token: $AGENTGW_TOKEN"

# 调一次工具
mcplight call http://agentgateway.agentgateway-system.svc/mcp \
  tools/call --tool search_kb --args '{"q":"K8s pod OOM"}' \
  --header "X-Agent-Token: $AGENTGW_TOKEN"
```

### 5.4 观察调用链与可观测

```bash
# 1) 端到端 trace: agent → AgentGateway → MCP server A 的耗时分解
kubectl port-forward svc/agentgateway -n agentgateway-system 16686:16686   # Jaeger UI

# 2) per-tool 指标
curl -s http://agentgateway.agentgateway-system.svc:9090/metrics | grep agentgateway_tool
#   agentgateway_tool_calls_total{tool="search_kb",status="200"} 1
#   agentgateway_tool_call_duration_seconds{tool="search_kb",quantile="0.95"} 0.18
#   agentgateway_tool_calls_total{tool="query_metrics",status="429"} 3   <- 触发限流
```

```
   [trace]  agent ──5ms──► AgentGateway ──12ms(auth+policy)──► MCP server A
              │                  │  rate-limit: search_kb 1/100m ✓            │
              │                  │  redact: args.token 已擦除                 │
              │                  │  ◄──────── 180ms (后端真实耗时) ────────────┘
              │◄── 197ms 总耗时 ──┘
```

整条链路里 **agent 只感知到一次"调用 search_kb"**,背后的鉴权/限流/脱敏/路由/协议转换/trace 全由 AgentGateway 完成——这就是集中式工具治理。

### 5.5 验证沙箱生效

尝试调一个不在白名单的危险工具,应被拒绝:

```bash
mcplight call http://agentgateway.agentgateway-system.svc/mcp \
  tools/call --tool delete_database --args '{}' \
  --header "X-Agent-Token: $AGENTGW_TOKEN"
# => 403 tool "delete_database" not in allow-list
```

即便 prompt injection 让 agent 想调危险工具,AgentGateway 也是兜底的硬边界。

---

## 6. 生产配置

### 6.0 配置参数总览

下表把生产环境最常用的配置域与关键参数汇总成 checklist,作为书写/审阅 `agentgateway.yaml` 时的参照(各项的含义与样例在 §6.1–§6.6 展开):

| 配置域 | 关键参数 | 说明 | 生产建议 |
|--------|----------|------|----------|
| tool registry | `registry.servers[].name/protocol/transport/endpoints` | 后端标识、协议、传输、地址列表 | MCP 优先 `streamable-http`;多副本 ≥2 |
| tool registry | `healthCheck.path/interval` | 主动探活路径与频率 | `/health`,10–30s |
| per-tool rate limit | `rateLimit.rules[].queries` | 每分钟调用上限 | 按后端容量设 |
| per-tool rate limit | `rateLimit.rules[].quota` | 周期配额(日/月) | 高成本/有副作用工具必设 |
| per-tool rate limit | `rateLimit.perAgent` | 按 agent 分别计数 | 开启,使超配额可归属 |
| per-tool rate limit | `rateLimit.default` | 未列出工具的兜底限流 | 必设,防漏网工具被刷爆 |
| auth(入口) | `ingressAuth.type=APIKey/header` | agent→网关的 API key 鉴权 | 必开,token 走 secretRef(OAuth2 用于多租户) |
| auth(后端) | `toBackend.type=APIKey/header/secretRef` | 网关→后端注入 API key | 密钥绝不进 agent 上下文 |
| auth(后端) | `toBackend.type=OAuth2/tokenURL/scopes/clientSecretRef` | 网关托管 OAuth token 刷新 | token 缓存 + 自动续期 |
| sandbox | `sandbox.allowTools` | 工具白名单(默认拒绝) | 最小权限,只放必要工具 |
| sandbox | `sandbox.redact[].inArgs` | 入参字段脱敏 | `mask` 密钥/口令类字段 |
| sandbox | `sandbox.redact[].inResult` / `strategy: block` | 返回脱敏 / 含字段直接拒绝 | 防 secret 回流;信用卡/身份证用 block |
| protocol translation | `translation.exposeAs/toolName/mapping` | REST/A2A 包成 MCP 工具 | mapping 用 JSONPath 提取结果 |
| TLS | 入口 TLS / `toBackend.tls` mTLS | 双向加密 | 证书走 cert-manager 自动轮换 |
| RBAC | `policies[].principals` | 哪个 agent 适用该 policy | 一个 agent 一份最小权限策略 |
| retry | `retry.attempts/onStatus` | 重试次数与触发状态码 | 5xx/超时重试,4xx 不重试 |

### 6.1 工具后端注册表(生产要点)

| 配置项 | 生产建议 |
|--------|----------|
| **多副本** | 每个工具后端注册 ≥2 个 endpoint,数据面自动负载均衡 + failover |
| **健康检查** | 配主动探活(`/health`),失败副本从路由摘除,恢复后自动加回 |
| **超时** | per-tool 设 `timeout`(如 search_kb 5s,query_metrics 10s),避免拖垮 agent |
| **重试** | 幂等工具开重试,非幂等(写操作)默认不重试 |
| **协议** | MCP server 优先用 streamable-http(可穿越网关),stdio 仅本地开发 |

### 6.2 鉴权:密钥隔离是安全基石

在 §4.3 的基础上,生产鉴权的关键是**密钥隔离**:`toBackend` 配的 API key / OAuth(`tokenURL`+`scopes`+`clientSecretRef`)只在 AgentGateway 与后端之间流通,token 的缓存与自动刷新由网关托管。**密钥绝不进 agent 上下文**,从根本上消除"密钥被 prompt 泄漏"的风险。

### 6.3 per-tool 限流与配额(生产增量)

在 §4.3 的 per-tool `queries` 基础上,生产建议补齐兜底与按 agent 分账:

```yaml
rateLimit:
  default: { queries: 1000/m }       # 兜底,未列出的工具走此
  rules:
    - tool: send_email      queries: 10/m   quota: 1000/d   # 有副作用+高成本, 严控日配额
    - tool: search_kb       queries: 200/m                   # 只读, 放宽
    - tool: query_metrics   queries: 60/m                    # 后端敏感, 卡频次
  perAgent: { enabled: true, key: { header: "X-Agent-Token" } }   # 按 agent 分别计数
```

`quota`(日配额)防失控 agent 把昂贵工具刷爆;`perAgent` 让"哪个 agent 超了配额"可归属。

### 6.4 沙箱:工具白名单 + 参数脱敏

在 §4.3 基础上,生产按字段敏感性区分 `mask`(擦除不阻断)与 `block`(直接拒绝):

```yaml
sandbox:
  allowTools: [search_kb, query_metrics, send_email]   # 默认拒绝
  redact:
    - { inArgs: ["token", "apiKey", "password", "secret"], strategy: mask }   # 替换为 ***
    - { inArgs: ["creditCard"],                          strategy: block }  # 含则 400 拒绝
    - { inResult: ["ssn", "internalIp"],                 strategy: mask }  # 返回里也擦除
```

| 策略类型 | 行为 | 适用 |
|----------|------|------|
| `allowTools` | 仅清单内工具可调,其余 403 | 默认拒绝,防越权 |
| `redact.mask` | 敏感字段替换为 `***` | 密钥/内网 IP 误进 args |
| `redact.block` | 含敏感字段直接拒绝调用 | 信用卡/身份证不该进工具 |
| `inResult` 脱敏 | 后端返回里的敏感字段擦除 | 防止 secret 回流进 agent 上下文 |

### 6.5 协议转换规则

```yaml
translation:
  - backend: rest-metrics                # REST 后端
    exposeAs: MCP                        # 对 agent 是 MCP 工具
    toolName: query_metrics
    mapping:
      callTo: { method: GET, path: "/api/v1/query", query: { q: "{args.expr}" } }
      resultFrom: "$.data.result[0].value[1]"   # JSONPath 提取结果
  - backend: agent-b                     # A2A 后端(另一个 agent)
    exposeAs: MCP
    toolName: ask_agent_b
    mapping:
      callTo: { method: POST, path: "/a2a", body: { input: "{args.question}" } }
```

这让存量 HTTP API 和其他 agent(A2A)在 agent 看来都是统一的 MCP 工具,不必为接入 agent 而改造后端。

### 6.6 TLS 与生产部署清单

| 项 | 配置 |
|----|------|
| 入口 TLS | 终止在 AgentGateway(证书走 cert-manager 自动轮换) |
| 后端 TLS | `toBackend.tls` 启用 mTLS,与内部后端双向校验 |
| 副本数 | 数据面 ≥2,Pod 反亲和 + PDB(`minAvailable: 1`) |
| 资源 | Rust 数据面低内存(通常 256Mi 起),按 RPS 调 cpu limit |
| 配置版本化 | 全部声明式 YAML 进 Git,走 GitOps(见 [[CNCF_Cloud_Native_AI/kagent_Deep_Dive]] 的 GitOps 模式) |

### 6.7 多 agent 多工具生产配置示例

两个 agent(support-bot 全工具、analytics-bot 只读)共享同一份 registry、各用独立 policy,体现"最小权限 + 差异化配额":

```yaml
registry:
  servers:
    - { name: mcp-kb,       protocol: MCP,  endpoints: ["http://kb-mcp:8080"] }
    - { name: rest-metrics, protocol: REST, endpoints: ["http://metrics:9090"], translation: { exposeAs: MCP, toolName: query_metrics } }
    - { name: agent-b,      protocol: A2A,  endpoints: ["http://agent-b:9000"], translation: { exposeAs: MCP, toolName: ask_agent_b } }

policies:
  - name: support-bot-policy          # 全工具, 较紧配额
    principals: ["support-bot"]
    ingressAuth: { type: APIKey, header: "X-Agent-Token" }
    rateLimit: { default: { queries: 500/m }, rules: [ { tool: send_email, queries: 10/m, quota: 1000/d } ] }
    sandbox: { allowTools: [search_kb, query_metrics, send_email, ask_agent_b], redact: [ { inArgs: [token], strategy: mask } ] }
  - name: analytics-bot-policy        # 只读, 不给发邮件 / 调 agent_b
    principals: ["analytics-bot"]
    ingressAuth: { type: APIKey, header: "X-Agent-Token" }
    rateLimit: { default: { queries: 1000/m } }
    sandbox: { allowTools: [query_metrics, search_kb] }
```

`principals` 把 policy 绑到具体 agent——同一份 registry 上,不同 agent 看到的工具集与配额各不相同,这是多 agent 共栈时的安全边界。

---

## 7. 运维与可观测

### 7.1 per-tool 调用指标

| 指标 | 含义 | 告警参考 |
|------|------|----------|
| `agentgateway_tool_calls_total{tool,status}` | 每个工具的调用计数/成败 | 4xx/5xx 比例 > 5% |
| `agentgateway_tool_call_duration_seconds{tool}` | 工具调用耗时分布 | P95 > 该工具 SLA(如 search_kb 2s) |
| `agentgateway_tool_args_bytes{tool}` | 入参大小 | 突增 = agent 塞了超大上下文 |
| `agentgateway_tool_result_bytes{tool}` | 返回结果大小 | 突增 = 后端爆量,可能撑爆 agent 上下文 |
| `agentgateway_ratelimit_rejected_total{tool}` | 被限流拒绝次数 | 持续 >0 = 配额不足或 agent 失控 |
| `agentgateway_redaction_blocked_total` | 参数脱敏 block 次数 | >0 = 有调用试图传信用卡/密钥,排查 prompt |
| `agentgateway_backend_health{server}` | 后端健康(0/1) | 任一为 0 持续 >30s |

### 7.2 trace agent → tool 链路

```bash
# Jaeger/Tempo 按 trace_id 检索, 看到:
#   span1: agent → AgentGateway (ingress)        2ms
#   span2:   AgentGateway auth                   1ms
#   span3:   AgentGateway policy/ratelimit       3ms
#   span4:   AgentGateway redact                 1ms
#   span5:   AgentGateway → MCP server A (egress) 180ms
#   span6:   AgentGateway response filter        1ms
```

这条 trace 是排障"agent 为什么慢/为什么失败"的核心——能精确区分网关开销还是后端慢。可观测体系整体方法论见 [[MLOps/Observability/LLM_Observability]]。

### 7.3 工具调用审计日志

```bash
kubectl logs -n agentgateway-system deploy/agentgateway-dp -c agentgateway | grep audit
# {"ts":"...","agent":"support-bot","tool":"search_kb",
#  "args":{"q":"K8s OOM"},"args_redacted":["token"],
#  "status":200,"latency_ms":187,"result_bytes":2048}
```

审计日志记录"谁(agent)在何时调了哪个工具、参数(脱敏后)、结果大小、成败"——是合规审计与事后追溯的权威来源。建议落盘到对象存储 + 接 SIEM。

### 7.4 常见故障排查

| 症状 | 可能原因 | 排查 |
|------|----------|------|
| agent 报 "tool not found" | 工具不在白名单 / 后端未注册 | 查 `tools/list` 返回;核对 registry 与 `allowTools` |
| MCP `initialize` 失败 | 后端 transport 不匹配(stdio vs http) | 核对 server.transport;本地开发才用 stdio |
| 工具调用 401/403 | 后端鉴权失效(OAuth token 过期/API key 错) | 查 secret 是否存在;OAuth tokenURL 可达 |
| 工具调用 429 | 触发限流 / 配额耗尽 | 看 `ratelimit_rejected_total`;调高配额或排查失控 agent |
| 后端 5xx 频发 | MCP server 崩 / 副本全挂 | 看 `backend_health`;查后端 Pod 日志 |
| agent 卡循环反复调同一工具 | prompt 缺终止条件 + 限流太松 | 收紧 per-tool 限流;agent 侧加最大轮数 |
| 参数脱敏误伤 | redact 规则太宽,擦了业务字段 | 收窄字段名;用 `mask` 而非 `block` 先观察 |

### 7.5 扩缩容 Rust 数据面

Rust 数据面无 GC、内存稳定,主要按 RPS 横向扩(副本数建议见 §6.6):

```yaml
dataPlane:
  replicaCount: 3
  hpa:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    metrics:
      - type: Resource
        resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
```

---

## 8. 对比与选择

### 8.1 AgentGateway vs Envoy AI Gateway vs Kgateway vs MCP-Registry-only

| 维度 | AgentGateway | Envoy AI Gateway | Kgateway | 纯 MCP Registry |
|------|--------------|-------------------|----------|------------------|
| **定位** | agent → tool 的工具调用网关 | LLM 推理流量网关(南北向) | 通用 K8s Gateway API | 仅 MCP server 目录 |
| **协议** | MCP / REST / A2A 互通 | OpenAI 兼容 / 推理 API | HTTP/gRPC(通用) | MCP |
| **懂 agent 语义** | 是(tools/list 聚合、tool 维度治理) | 部分(prompt/token 维度) | 否(通用 L7) | 仅发现 |
| **鉴权/限流/沙箱** | per-tool 全套 | per-model/路由 | 通用 L7 策略 | 弱/无 |
| **协议转换** | MCP↔REST↔A2A | 不聚焦 | 不聚焦 | 无 |
| **可观测** | per-tool trace/metrics/审计 | token/模型维度 | 通用流量指标 | 弱 |
| **实现** | Rust | Envoy(Go 控制) | Envoy | 视实现 |
| **核心场景** | 重 agent + 多 MCP 工具的集中治理 | LLM 推理网关 | 通用东西/南北向 | 工具发现 |

> 注:AgentGateway 与 Envoy AI Gateway **不冲突,而是 agent 调用链的两端**——前者治"agent→tool",后者治"agent→LLM"。两者常共存。

### 8.2 什么时候选 AgentGateway

选它,当你**同时**需要:

1. **agent 调用大量工具**(多个 MCP server / REST API),需要集中治理
2. **统一鉴权 / 限流 / 沙箱**(密钥不下发 agent、防失控 agent 刷爆工具、防 prompt injection 越权)
3. **异构后端统一暴露**(存量 REST API 也要当 MCP 工具用,需协议转换)
4. **per-tool 可观测与审计**(谁调了哪个工具、参数、结果、耗时全程可追溯)

### 8.3 什么时候不选

- agent 只调 1-2 个固定工具、无安全顾虑 → 直接连 MCP server,网关是过度设计
- 重点是治理 LLM 推理流量(路由、token 限流、多模型 failover) → 用 **Envoy AI Gateway**
- 要的是通用 K8s 入口网关,无 MCP 语义需求 → 用 **Kgateway / 标准 Gateway API**
- 只要"知道有哪些 MCP server"(服务发现) → 纯 **MCP Registry** 足够

---

## 9. 常见问题 FAQ

**Q1: AgentGateway 和 MCP server 是什么关系?它会替代 MCP server 吗?**
A: 不替代。MCP server 是**后端**(实际工具执行体),AgentGateway 是**前面的代理**。agent 不直连各 MCP server,而是连 AgentGateway,由它做注册/路由/治理再转发到各 MCP server。类比:Nginx 不会替代你的应用服务器,它站在应用前面。

**Q2: 能代理非 MCP 的后端吗?比如存量 REST API?**
A: 能,这正是它的协议转换能力(§6.5)。把 REST API 注册成后端、配 `exposeAs: MCP` 与字段映射,agent 看到的就是一个 MCP 工具,调用时 AgentGateway 自动把它译成 HTTP 请求发给 REST 后端,再把响应译回 MCP 结果。这让存量 API 不必改造就能进 agent 工具链。

**Q3: 为什么数据面用 Rust?Go 不行吗?**
A: 代理/网关场景,Rust 的优势是**无 GC 抖动**(延迟稳定)、**低内存占用**(适合长期常驻旁路)、**高并发吞吐**(async 生态成熟)。这和 Higress 选 Rust 一脉相承。Go 也行(很多网关用 Go),但 Rust 在"低开销常驻代理"上更契合。控制面部分仍可用其他语言。

**Q4: agent 侧要改代码吗?接入成本多大?**
A: 几乎零侵入。只要 agent 框架的 MCP 客户端支持改 endpoint(主流都支持),把指向后端的地址换成 AgentGateway、加上入口 token 即可(见 §4.4)。业务逻辑、工具调用代码完全不动。后端增减、策略调整对 agent 透明。

**Q5: 参数脱敏怎么保证 agent 拿不到原始密钥?**
A: 密钥在 AgentGateway 与后端之间用,绝不进 agent 上下文。即便 agent 在 args 里塞了 `token`(常见,如它从环境读到),`redact` 规则会在转发给后端前擦除(§6.4)。这是"密钥集中托管 + 出口擦除"的双保险,从结构上消除"密钥经 prompt 泄漏"。

**Q6: AgentGateway 现在能上生产吗?成熟度如何?**
A: 处于 v0.x 早期,配置 schema 仍在演进。建议:锁定版本、用声明式配置进 Git 走 GitOps、canary 集群先行验证治理效果与后端兼容性。核心生产链路建议再观察一两个大版本;但作为"工具治理层"叠加在现有 agent 上(后端不直连、有回退路径)已可试点——即便网关出问题,也能临时让 agent 直连后端应急。

---

## Related

- README — CNCF 云原生 AI 项目总览
- [[CNCF_Cloud_Native_AI/Envoy_AI_Gateway_Deep_Dive]] — agent→LLM 那一端的推理网关(与本篇互补)
- [[CNCF_Cloud_Native_AI/Kgateway_Deep_Dive]] — 通用 K8s Gateway API 实现
- [[CNCF_Cloud_Native_AI/kagent_Deep_Dive]] — 声明式 Agent 框架(其 MCP client 可指向 AgentGateway)
- [[强化学习/AI_Agents/Agent_Protocols_2026]] — MCP / A2A 协议底座
