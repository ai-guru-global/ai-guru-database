---
title: "AIBrix: 模块化的大模型推理基础设施组件"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "inference", "aibrix", "vllm", "gateway"]
summary: "> **一句话理解**: AIBrix 是一组即插即用的 GenAI 推理基础设施组件——智能路由、前缀缓存亲和、GPU 弹性伸缩、Token 级监控，专为在 vLLM/SGLang 之上叠加'运营能力'而设计，而非又一个完整推理平台。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Aibrix Deep Dive"
  - "AIBrix Deep Dive"
  - AIBrix_Deep_Dive

---
# AIBrix: 模块化的大模型推理基础设施组件

> **一句话理解**: AIBrix 不是又一个推理平台，而是一组「即插即用」的 GenAI 推理基础设施组件——智能路由、前缀缓存、GPU 弹性、Token 级监控，专为在 vLLM/SGLang 之上加'运营能力'而设计。

> 📐 **概念方法论**: 理解 AIBrix 要先理解它「不做」什么——它不替代推理引擎，而是把生产化运营所需的「路由 / 缓存 / 弹性 / 观测」做成可拆分的乐高块。这与 [[部署推理/Inference_Engines/vLLM_Deep_Dive]] 的「引擎层」和 KServe Deep Dive 的「平台层」形成互补的三层关系：引擎负责算，平台负责托管，AIBrix 负责把多个引擎实例「编排」成高性价比的服务。

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
AIBrix: Cost-efficient & pluggable Infrastructure for GenAI Inference
═══════════════════════════════════════════════════════════════════════
仓库: github.com/vllm-project/aibrix  (vllm-project 组织)
归属: 脱胎于 vLLM 社区 / NVIDIA 社区贡献, 2024-2025 成型
分类: CNCF Landscape → AI Native Infra → Inference

核心理念 (不是平台, 是积木):
• 模块化 (Modular)      : 每个组件独立可启用, 不绑定整体方案
• 可插拔 (Pluggable)    : 围绕你已有的 vLLM/SGLang 部署叠加能力
• 成本导向 (Cost)       : 前缀缓存亲和 + Token 感知调度, 降单 Token 成本
• K8s 原生 (Cloud-Native): 基于 Gateway API + InferencePool 标准构建

它不是什么:
✗ 推理引擎 (那是 vLLM/SGLang/TensorRT-LLM 的活)
✗ 端到端平台 (那是 KServe/KAITO/llm-d 的活)
✗ API 网关代理 (那是 LiteLLM/Envoy AI Gateway 的活)
✓ 它是「让一组 vLLM Pod 跑得更省、更稳、更可观测」的运营层
```

### 1.2 核心特性

| 特性 | 说明 | 解决的痛点 |
|------|------|-----------|
| **模块化/可插拔设计** | 每个组件 (Gateway / Autoscaler / Cache) 独立开关，按需启用 | 不想换平台，只想加运营能力 |
| **前缀感知路由 (Prefix-aware Routing)** | 把请求路由到持有该 prompt 前缀 KV Cache 的 Pod | 多轮对话/RAG 的重复前缀浪费算力 |
| **Token 感知弹性伸缩** | 按 tokens/sec、队列长度等 LLM 语义指标扩缩容，而非 CPU/QPS | 传统 HPA 在 LLM 场景误判 |
| **与 vLLM 深度互补** | 同属 vllm-project，针对 vLLM 的指标/缓存接口优化 | 通用方案不懂 vLLM 内部状态 |
| **Gateway API + InferencePool** | 采用 Kubernetes 上游标准做端点选择，不发明私有 CRD 黑魔法 | 跟随社区标准，避免供应商锁定 |
| **Token 级可观测** | 输入/输出 token、prefix cache 命中率、路由决策全程可追踪 | LLM 计费与排障需要 token 粒度 |

### 1.3 项目历程

| 时间 | 事件 |
|------|------|
| 2024 | 在 vLLM 社区 / NVIDIA 协作中孵化，源于大规模 vLLM 部署的运营痛点 |
| 2025 上半年 | 独立为 `vllm-project/aibrix` 仓库，发布 v0.x，纳入 CNCF Landscape (Inference) |
| 2025 下半年 | v0.2+ 引入 Gateway API + InferencePool 支持，前缀感知路由成熟 |
| 2026 | 围绕 vLLM V1 引擎、SGLang 适配持续迭代，向 Sandbox/Incubating 推进 |

---

## 2. 核心概念

### 2.1 模块化哲学

AIBrix 最关键的设计决策是**不做大一统平台**。一个完整的「LLM 推理平台」通常包含：模型仓库、推理引擎、路由网关、弹性伸缩、缓存、可观测、计费……KServe/llm-d 试图覆盖全部；AIBrix 只挑了其中**运营难度最高、与 vLLM 绑定最深**的几块，做成可单独启用的组件。

```
            ┌────────────────────────────────────────────┐
应用 ──────►│       AIBrix 组件 (按需启用)                │
            │ ┌────────┐ ┌──────────┐ ┌───────────────┐ │
            │ │Gateway │ │Autoscaler│ │  Cache/Obs    │ │
            │ └───┬────┘ └────┬─────┘ └───────┬───────┘ │
            └─────┼───────────┼───────────────┼─────────┘
                  ▼           ▼               ▼
            ┌───────────────────────────────────────────┐
            │   你已有的推理引擎 (不动它)                 │
            │  ┌────────┐  ┌────────┐  ┌────────┐       │
            │  │vLLM #1 │  │vLLM #2 │  │SGLang  │       │
            │  └────────┘  └────────┘  └────────┘       │
            └───────────────────────────────────────────┘
```

### 2.2 核心组件逐解

| 组件 | 角色 | 工作方式 |
|------|------|---------|
| **Gateway / Request Router** | L7 智能路由入口 | 基于 token 与前缀做路由决策，支持负载均衡、前缀亲和、请求扇出 (fanout) |
| **Ray Autoscaler++ / GPU Autoscaler** | 弹性伸缩控制器 | 读取 vLLM 暴露的 token/队列指标，按 LLM 语义而非 CPU 扩缩 Pod 数 |
| **Storage Initializer / Model Loader** | 模型加载器 | 高效拉取与缓存模型权重，缩短冷启动 |
| **Caching Layer** | 语义/前缀缓存 | 跨请求复用 KV Cache 前缀，削减重复 prefill 成本 |
| **Observability** | 可观测性 | 采集 token 级指标、路由链路追踪，对接 Prometheus/Grafana |
| **KVCache Offloading** | 显存分层管理 | 把 KV Cache 卸载到 CPU/内存，缓解 GPU 显存压力 |

### 2.3 「即插即用」如何体现

每个组件都是独立开关：只想解决「多 Pod 路由不均」就只装 Gateway；只想加可观测就只装 sidecar。这种「最小侵入」策略，使团队在**不换引擎、不重做平台**的前提下，逐步补齐运营能力。

---

## 3. 架构设计

### 3.1 整体拓扑

```
                 客户端 (OpenAI 兼容请求)
                        │
                        ▼
   ┌──────────────────────────────────────────────────────┐
   │  AIBrix Gateway Pod (Envoy + 路由插件, Gateway API)    │
   │   Token-Aware LB │ Prefix-Aware Router │ Fanout       │
   └────────────────────────┬─────────────────────────────┘
                            │  InferencePool 端点选择
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   ┌────────────┐     ┌────────────┐     ┌────────────┐
   │ vLLM Pod A │     │ vLLM Pod B │     │ vLLM Pod C │
   │ prefix:doc │     │ prefix:chat│     │ prefix:doc │
   └─────┬──────┘     └─────┬──────┘     └─────┬──────┘
         │ sidecar:obs      │ sidecar:obs      │ sidecar:obs
         ▼                   ▼                  ▼
   ┌──────────────────────────────────────────────────────┐
   │  AIBrix Controller / Autoscaler  (读 token 指标调副本) │
   │  Prometheus ◄── token/sec, queue, cache-hit-rate      │
   └──────────────────────────────────────────────────────┘
```

### 3.2 前缀亲和路由 (Prefix Affinity)

这是 AIBrix 最具价值的能力之一。vLLM 内部有 prefix cache——若一个请求的前缀与某 Pod 已缓存的 KV 命中，可跳过昂贵的 prefill。但传统轮询/最少连接负载均衡会把相同前缀的请求**随机**散到不同 Pod，缓存命中率惨淡。

AIBrix Gateway 维护一张「前缀 → Pod」的亲和表：

```
请求: { system_prompt, doc_context, user_q }
共享前缀: [ system_prompt + doc_context ]  (~2k tokens, 跨请求复用)
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│  Gateway 路由决策五步流水线                                │
│                                                          │
│  ① Tokenize 取前 N tokens 做前缀   N = prefixHashTokens  │
│  ② 计算前缀 hash (xxHash)          hash = 0xA1B2…        │
│  ③ 查本地亲和表  hash → { pod, last_seen, hit_count }    │
│  ④ 决策:                                                  │
│     ├─ 命中 Pod A 且 load < 阈值 → 转发 A, prefill skip   │
│     ├─ 命中 Pod A 但过载          → 回退 fallbackStrategy │
│     └─ 未命中                     → fallback 选最少连接 Pod│
│  ⑤ 异步更新亲和表 (写新条目 / 刷新 last_seen / TTL 失效)  │
└──────────────────────────────────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │  vLLM Pod A         │
        │  本地 prefix cache  │
        │  0xA1B2.. → [KV] ✅ │  ← 命中: 跳过 ~2k tokens 的 prefill
        └─────────────────────┘
```

对 RAG / 多轮对话 / system prompt 固定的场景，这能显著降低 prefill 计算量，直接转化为成本下降与 TTFT 下降。亲和表是「软状态」——TTL 过期后自动回收，Pod 故障后下次查表自然 miss 转入 fallback，不需要全局一致性。

### 3.3 InferencePool 与端点选择

AIBrix 采用 Kubernetes 上游的 **Gateway API** + **InferencePool** 资源做端点选择，而不是自造私有 service mesh。`InferencePool` 描述「一组能服务某模型的推理端点」，Gateway 据此把流量分发到池内 Pod。好处是：

- 跟随社区标准演进，未来与 Envoy AI Gateway、Kgateway 等可互通；
- 端点选择逻辑可被替换 (endpoint picker 插件化)，不锁定实现；
- 与既有 Gateway API 控制器 (如 Cilium、Istio) 共存。

### 3.4 组件职责与交互矩阵

AIBrix 的五个核心组件各司其职，通过 Gateway API + Prometheus + PodMetric CRD 串联，彼此无共享状态、靠控制面 API 解耦——这正是模块化的根基。

| 组件 | 部署形态 | 主要职责 | 关键交互 |
|------|---------|---------|---------|
| **Gateway** | 独立 Deployment (多副本) | 接收 OpenAI 兼容请求，做路由决策并转发到 InferencePool 内 Pod | 读 InferencePool 选端点；暴露 /metrics；输出 routing_decision 日志 |
| **Request Router** (Gateway 内插件) | 进程内 | 计算 prefix hash、维护亲和表、执行 fallback 策略 | 通过 endpoint picker 接口被 Gateway 调用 |
| **Autoscaler Controller** | Deployment (leader 选举) | 监听 PodMetric / Prometheus 指标，调整 vLLM Deployment 副本数 | 写 PodMetric CRD；调用 Kubernetes scale subresource |
| **Observability Sidecar** | 注入到 vLLM Pod | 抓取 vLLM /metrics，做 token 级聚合与标签补全 | 上报 Prometheus；可选上报 OTel trace |
| **Caching / KV Offload 层** | Sidecar 或 DaemonSet | 跨请求/跨 Pod 的前缀 KV 复用、KV 卸载到 CPU/内存 | 与 vLLM 的 KV cache manager 经共享内存或 RPC 通信 |

组件间不存在强耦合调用链——每条链路都是「读指标 → 做决策 → 写状态」，任一组件挂掉不影响其它：

```
Gateway     ──读──► InferencePool (K8s API)  ──转发──► vLLM Pod (HTTP)
            ──写──► Prometheus (routing_decisions, latency)
Autoscaler  ──读──► PodMetric CRD / Prometheus
            ──写──► Deployment.spec.replicas (scale subresource)
Sidecar     ──抓──► vLLM /metrics (localhost) ──写──► Prometheus
vLLM        ──读/写──► 本地 KV cache (GPU HBM ↔ CPU mem)
```

这意味着你可以只装 Gateway 不装 Autoscaler，或反之——关闭 Autoscaler 时 Gateway 仍按实时连接数做 fallback 路由，关闭 Gateway 时 Autoscaler 仍能独立按队列指标扩缩容。

---

## 4. 安装部署

### 4.1 前置条件

| 依赖 | 说明 |
|------|------|
| Kubernetes ≥ 1.28 | 需 Gateway API CRD 支持 |
| Gateway API CRD | `kubectl apply -f gateway-api-crds.yaml` |
| NVIDIA GPU Operator | GPU 推理需先装好 Operator 与节点驱动 |
| Helm 3 + vLLM/SGLang | AIBrix 是叠加层，引擎需已存在或一起部署 |

### 4.2 Helm 安装

```bash
helm repo add aibrix https://aibrix.github.io/helm-charts/
helm repo update

kubectl create namespace aibrix-system

helm install aibrix aibrix/aibrix \
  --namespace aibrix-system \
  --version v0.2.x \
  --set gateway.enabled=true \
  --set autoscaler.enabled=true \
  --set observability.enabled=true
```

### 4.3 组件启用矩阵

AIBrix 把组件拆成若干 Helm 子开关，按需打开：

| Helm 值 | 组件 | 默认 | 建议 |
|---------|------|------|------|
| `gateway.enabled` | 智能路由入口 | true | 生产必开 |
| `autoscaler.enabled` | GPU 弹性伸缩 | false | 有潮汐流量时开 |
| `cache.enabled` | 前缀/语义缓存 | true | RAG/多轮场景开 |
| `observability.enabled` | 指标 + 追踪 | true | 生产必开 |
| `storageInitializer.enabled` | 模型加载器 | false | 冷启动多时开 |
| `kvCacheOffload.enabled` | KV Cache 卸载 | false | 显存吃紧时开 |

### 4.4 两种部署形态

```
形态 A: 独立 Gateway Deployment (推荐生产)
  Client ──► AIBrix Gateway (独立 Deployment, 水平扩展) ──► vLLM Pods (无侵入)

形态 B: Sidecar 注入 (轻量, 仅观测/本地缓存)
  Client ──► vLLM Pod [ aibrix-sidecar + vLLM engine ]
```

形态 A 适合大规模、需要网关独立扩缩的场景；形态 B 适合只需「每 Pod 加观测/本地缓存」、不想引入额外一跳的轻量场景。

---

## 5. 快速开始

### 5.1 部署带 AIBrix Gateway 的 vLLM

`vllm-deployment.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-llama
  namespace: aibrix-system
spec:
  replicas: 3
  selector:
    matchLabels: { app: vllm-llama }
  template:
    metadata:
      labels: { app: vllm-llama }
    spec:
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          args:
            - --model=meta-llama/Llama-3.1-8B-Instruct
            - --enable-prefix-caching
          ports:
            - containerPort: 8000
          resources:
            limits:
              nvidia.com/gpu: "1"
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-llama
  namespace: aibrix-system
spec:
  selector: { app: vllm-llama }
  ports:
    - port: 8000
      targetPort: 8000
```

声明 InferencePool 并接入 AIBrix Gateway：

```yaml
apiVersion: inference.networking.x-k8s.io/v1alpha1
kind: InferencePool
metadata:
  name: llama-pool
  namespace: aibrix-system
spec:
  selector: { app: vllm-llama }
  targetPortNumber: 8000
  endpointPickerConfig:
    routingStrategy: prefix-aware
```

### 5.2 启用前缀感知路由

在 Helm values 中显式声明路由策略：

```yaml
gateway:
  enabled: true
  routing:
    strategy: prefix-aware
    fallbackStrategy: least-connections
    prefixHashTokens: 64
```

### 5.3 验证

```bash
kubectl --namespace aibrix-system port-forward svc/aibrix-gateway 8080:80

curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "messages": [
      {"role": "system", "content": "你是一位中文助手。"},
      {"role": "user", "content": "用一句话介绍 AIBrix。"}
    ]
  }'

kubectl --namespace aibrix-system logs -l app=aibrix-gateway \
  | grep "routing_decision"
```

连续发送相同 system prompt 的请求，观察 Gateway 日志中 `cache_hit=pod-A` 的命中记录，即可确认前缀亲和生效。

---

## 6. 生产配置

### 6.1 组件启用矩阵 (生产建议)

| 场景 | Gateway | Autoscaler | Cache | Observability | KV Offload |
|------|:------:|:----------:|:-----:|:-------------:|:----------:|
| 在线对话 / 固定 prompt | ✓ | ✓ | ✓ | ✓ | – |
| RAG (长上下文) | ✓ | ✓ | ✓ | ✓ | ✓ |
| 多模型混部 / 离线批量 | ✓ | ✓ | – | ✓ | – |

### 6.2 路由策略配置

| 策略 | 适用 | 行为 |
|------|------|------|
| `prefix-aware` | RAG/多轮/固定 system prompt | 按前缀 hash 选 Pod，最大化缓存命中 |
| `least-connections` | 通用兜底 | 选当前活跃连接最少的 Pod |
| `round-robin` | 均匀、无状态流量 | 轮询，最简单 |
| `random` | 测试/压测 | 随机，用于建立基线 |
| `token-aware` | 输入长度差异大 | 按预估 token 负载均衡，避免长 prompt 堆积 |

### 6.3 弹性伸缩阈值

AIBrix Autoscaler 读取的是 LLM 语义指标，而非 CPU：

| 指标 | 含义 | 典型扩容阈值 | 典型缩容阈值 |
|------|------|------------|------------|
| `vllm:num_requests_waiting` | 排队中的请求数 | > 4 持续 60s | = 0 持续 300s |
| `vllm:avg_generation_throughput` | 平均生成吞吐 tokens/sec | < 预期 60% | – |
| `vllm:gpu_cache_usage_perc` | KV Cache 占用率 | > 0.85 | < 0.3 |
| `vllm:prefix_cache_hit_rate` | 前缀缓存命中率 | – | – (观测用) |

### 6.4 生产 values.yaml 片段

```yaml
gateway:
  enabled: true
  replicas: 3
  routing:
    strategy: prefix-aware
    fallbackStrategy: least-connections
    prefixHashTokens: 64
  resources:
    requests: { cpu: "1", memory: "1Gi" }
    limits:   { cpu: "2", memory: "2Gi" }

autoscaler:
  enabled: true
  scaleDown:
    stabilizationWindowSeconds: 300
    policies:
      - { type: Pods, value: 1, periodSeconds: 120 }
  scaleUp:
    stabilizationWindowSeconds: 60
    policies:
      - { type: Pods, value: 2, periodSeconds: 60 }
  metrics:
    - type: Pods
      pods:
        metric: { name: vllm_num_requests_waiting }
        target: { type: AverageValue, averageValue: "4" }

cache:          { enabled: true, ttl: 600s, maxEntryMb: 512 }
observability: { enabled: true, tracing: { samplingRate: 0.1 } }
kvCacheOffload:{ enabled: true, cpuMemoryRatio: 0.3 }
```

### 6.5 关键调优点

- **prefixHashTokens**：参与 hash 的前缀 token 数。太小命中率低，太大亲和表膨胀，64 是常见平衡点。
- **cache.ttl**：多轮对话场景宜长 (10–30 min)，无状态 API 宜短。
- **scaleDown 冷静期**：过短会导致 Pod 反复创建销毁 (flapping)，建议 ≥ 300s。

### 6.6 参数参考表

下面给出每个可插拔组件的关键参数全集，便于上线前逐项核对：

| 组件 | 参数 | 默认 | 说明 |
|------|------|------|------|
| gateway | `enabled` | true | 启用智能路由入口 |
| gateway | `routing.strategy` | prefix-aware | 主路由策略 |
| gateway | `routing.fallbackStrategy` | least-connections | 命中失败时的兜底策略 |
| gateway | `routing.prefixHashTokens` | 64 | 参与 hash 的前缀 token 数 |
| gateway | `affinityTable.ttl` | 600s | 亲和表条目过期时间 |
| gateway | `tokenBudget` | – (无限) | 单租户/模型 token 配额，软限流 |
| autoscaler | `enabled` | false | 启用 LLM 语义弹性伸缩 |
| autoscaler | `scaleDown.stabilizationWindowSeconds` | 300 | 缩容冷静期 |
| autoscaler | `metrics[].pods.metric.name` | vllm_num_requests_waiting | 触发指标 |
| cache | `enabled` | true | 启用前缀/语义缓存 |
| cache | `ttl` | 600s | 缓存条目 TTL |
| observability | `enabled` | true | 启用指标 + 追踪 |
| observability | `tracing.samplingRate` | 0.1 | OTel trace 采样率 |
| observability | `sidecar.resources.limits.cpu` | 500m | sidecar CPU 上限 |
| observability | `sidecar.resources.limits.memory` | 256Mi | sidecar 内存上限 |
| kvCacheOffload | `enabled` | false | 启用 KV Cache 卸载 |
| kvCacheOffload | `cpuMemoryRatio` | 0.3 | 卸载到 CPU 内存的比例 |
| storageInitializer | `enabled` | false | 启用高效模型加载器 |

### 6.7 全量生产 values.yaml (所有组件开启)

适用于「在线对话 + RAG + 潮汐流量」综合场景：所有组件启用，Gateway 多副本，Autoscaler 双指标驱动 (队列深度 + KV 占用)：

```yaml
gateway:
  enabled: true
  replicas: 3
  routing:
    strategy: prefix-aware
    fallbackStrategy: least-connections
    prefixHashTokens: 64
  resources:
    requests: { cpu: "1", memory: "1Gi" }
    limits:   { cpu: "2", memory: "2Gi" }

autoscaler:
  enabled: true
  cooldownPeriod: 120
  scaleDown:
    stabilizationWindowSeconds: 600
    policies:
      - { type: Pods, value: 1, periodSeconds: 180 }
  scaleUp:
    stabilizationWindowSeconds: 30
    policies:
      - { type: Pods, value: 2, periodSeconds: 60 }
  metrics:
    - type: Pods
      pods:
        metric: { name: vllm_num_requests_waiting }
        target: { type: AverageValue, averageValue: "4" }
    - type: Pods
      pods:
        metric: { name: vllm_gpu_cache_usage_perc }
        target: { type: AverageValue, averageValue: "0.85" }

cache:
  enabled: true
  ttl: 1200s
  similarityThreshold: 0.95

observability:
  enabled: true
  tracing:
    enabled: true
    samplingRate: 0.1
  sidecar:
    resources:
      requests: { cpu: "100m", memory: "128Mi" }
      limits:   { cpu: "500m", memory: "256Mi" }

kvCacheOffload:
  enabled: true
  cpuMemoryRatio: 0.3
```

相比 §6.4 最小配置，关键差异：Autoscaler 双指标 (队列 + 缓存占用)、缓存 TTL 拉到 20 min 并启用语义缓存、trace 采样 + sidecar 资源上限、KV 卸载开启。

### 6.8 何时启用哪个组件

按「症状 / 目标」反查应该开哪个组件，避免一上来全开：

| 症状 / 目标 | 推荐启用 | 理由 |
|------------|---------|------|
| 多 Pod 负载不均、热点 Pod | Gateway (prefix-aware 或 token-aware) | 智能路由打散 |
| 多轮对话 / RAG 重复前缀多 | Gateway + Cache | 前缀亲和 + 缓存复用双管齐下 |
| 流量有明显昼夜潮汐 | Autoscaler | 传统 HPA 用 CPU/QPS 在 LLM 场景失真 |
| GPU 显存吃紧、OOM | kvCacheOffload | KV 卸载到 CPU 缓解 |
| 需按 token 计费 / 排障 | Observability sidecar | token 级聚合 |
| 纯离线批量、不在乎延迟 | 只开 Observability | 路由/缓存收益小，徒增复杂度 |

**决策原则**：从 Observability 起步——先观测到具体问题（命中率低？热点？显存满？），再针对性开启对应组件。这比「一次性全开」更稳，也更利于事后归因。

---

## 7. 运维与可观测

### 7.1 关键 Prometheus 指标

| 指标 | 类型 | 用途 |
|------|------|------|
| `vllm:prompt_tokens_total` | Counter | 累计输入 token，用于计费与成本分摊 |
| `vllm:generation_tokens_total` | Counter | 累计输出 token，用于计费与成本分摊 |
| `vllm:prefix_cache_hit_rate` | Gauge | 前缀缓存命中率，评估路由策略效果 |
| `vllm:gpu_cache_usage_perc` | Gauge | KV Cache 占用率，容量规划与扩容触发 |
| `vllm:num_requests_running` | Gauge | 运行中请求数，实时并发 |
| `vllm:num_requests_waiting` | Gauge | 排队请求数，排队深度与延迟预警 |
| `vllm:time_to_first_token_seconds` | Histogram | TTFT 分布 |
| `vllm:time_per_output_token_seconds` | Histogram | inter-token latency (生成阶段) |
| `vllm:e2e_request_latency_seconds` | Histogram | 端到端延迟分布，P50/P95/P99 |
| `aibrix:routing_decisions_total` | Counter (含 strategy label) | 路由决策次数，按策略分类统计 |
| `aibrix:prefix_affinity_hits_total` | Counter | 亲和表命中次数，验证 prefix-aware 价值 |
| `aibrix:gateway_request_duration_seconds` | Histogram | Gateway 自身转发延迟 (排除引擎耗时) |
| `aibrix:autoscaler_actions_total` | Counter (含 action label) | 扩缩容动作次数 (scaleup/scaledown) |

### 7.2 Grafana Dashboard 要点

一个合格的 AIBrix 面板至少包含四个 panel：**吞吐量** (prompt/generation tokens/sec，按 model 分色)、**缓存** (prefix_cache_hit_rate 折线 + 命中/未命中堆叠)、**延迟** (TTFT / inter-token-latency / 端到端 P50/P95/P99)、**弹性** (Pod 副本数 + 等待队列数双轴，看扩缩是否及时)。

### 7.3 故障排查

| 症状 | 可能原因 | 处理 |
|------|---------|------|
| 缓存命中率持续偏低 | prefixHashTokens 过小，或流量本就无重复前缀 | 调大 hash token 数；确认 prompt 是否真有共享前缀 |
| 路由热点 (某 Pod 打满) | 亲和表倾斜，或 fallback 策略缺失 | 检查 `fallbackStrategy`；为热点前缀做副本亲和 |
| Autoscaler 抖动 (flapping) | 缩容冷静期过短，或指标噪声大 | 调大 `scaleDown.stabilizationWindowSeconds`；指标做滑动平均 |
| Pod 扩出来后立即缩回 | 冷启动期指标还没起来就触发缩容 | 加 `scaleUp` 冷启动保护窗口 |
| TTFT 偶发飙升 | 长 prompt 扎堆同一 Pod | 切 `token-aware`；检查 prefill 阻塞 |
| 缓存失效风暴 (hit rate 突降) | TTL 过短或亲和表被重建 | 检查 `affinityTable.ttl`；排查 Gateway 是否重启导致表清空 |
| Sidecar OOM 崩溃 | 聚合/上报 buffer 累积撑爆内存 | 调大 sidecar 内存上限；降低 `tracing.samplingRate` |
| vLLM 后端 5xx 突增 | OOM、显存不足或权重加载失败 | 查 vLLM 日志；检查 `gpu_cache_usage_perc`；考虑开 kvCacheOffload |
| 前缀永远不被缓存 | vLLM 启动未开 `--enable-prefix-caching` | 检查 vLLM 启动参数；Gateway 亲和只对已开 prefix cache 的 Pod 有效 |

### 7.4 PromQL 实战

```promql
# 1. 全局前缀缓存命中率 (5 分钟均值)
avg_over_time(vllm:prefix_cache_hit_rate[5m])

# 2. TTFT P99 (按模型)
histogram_quantile(0.99,
  sum by (le, model) (rate(vllm:time_to_first_token_seconds_bucket[5m])))

# 3. 排队深度告警 (等待 > 8 持续 2 分钟)
sum(vllm:num_requests_waiting) > 8

# 4. 路由策略分布 (各策略占比)
sum by (strategy) (rate(aibrix:routing_decisions_total[5m]))
  / ignoring(strategy) sum(rate(aibrix:routing_decisions_total[5m]))
```

第 2、4 条最有诊断价值：前者直接回答「用户体感是否在劣化」，后者回答「prefix-aware 到底贡献了多少流量、fallback 兜底了多少」。

### 7.5 升级与回滚

AIBrix 升级主要涉及三类对象：Helm release、CRD、Gateway 配置。建议遵循「CRD → Helm release → 观察滚动」的顺序：

**升级流程：**

```bash
# 1. 备份当前 values 与 CRD
helm get values aibrix -n aibrix-system > aibrix-values.backup.yaml
kubectl get crd podmetrics.inference.networking.x-k8s.io -o yaml > podmetric-crd.backup.yaml
# 2. 先升级 CRD (Helm 默认不升级已安装的 CRD)
kubectl apply -f https://github.com/vllm-project/aibrix/releases/download/v0.x.x/crds.yaml
# 3. 再升级 Helm release
helm upgrade aibrix aibrix/aibrix -n aibrix-system -f values.yaml --version v0.x.x
# 4. 观察 Controller 与 Gateway 滚动
kubectl rollout status deploy/aibrix-controller -n aibrix-system
kubectl rollout status deploy/aibrix-gateway  -n aibrix-system
```

**回滚流程：**

```bash
# Helm release 回滚到上一 revision
helm rollback aibrix <REVISION> -n aibrix-system

# CRD 如出现不兼容 (谨慎, 可能丢字段)
# kubectl apply -f podmetric-crd.backup.yaml
```

注意事项：

- **不跨大版本直跳**：v0.1 → v0.3 可能涉及 InferencePool schema 变更，建议逐 minor 升级并先看 release notes。
- **Gateway 与 vLLM 解耦**：升级 AIBrix 不影响 vLLM Pod，流量只在 Gateway 滚动期间短暂受影响。设 `maxUnavailable: 0, maxSurge: 1` 保证至少一个旧实例持续服务。

---

## 8. 对比与选择

### 8.1 横向对比

| 维度 | AIBrix | KServe | llm-d | LiteLLM (非 CNCF) |
|------|--------|--------|-------|-------------------|
| 定位 | 推理运营组件 (积木) | 端到端推理平台 | 分布式推理引擎层 | 多模型 API 代理 |
| 是否替换引擎 | 否 (叠加在 vLLM 上) | 否 (托管任意引擎) | 是 (自带调度) | 否 |
| 智能路由 | 强 (prefix/token-aware) | 一般 | 强 (分布式 KV) | 一般 (成本/故障转移) |
| 弹性伸缩 | token 语义驱动 | KPA/HPA | 原生 | 无 (依赖外部) |
| K8s 标准 | Gateway API + InferencePool | KNative/Serving CRD | 自有 CRD | 无 (独立进程) |
| 学习成本 | 中 (按组件渐进) | 中高 (要学整套平台) | 高 (新范式) | 低 |
| 适合谁 | 已在跑 vLLM, 想加运营层 | 要标准化的多模型平台 | 要极致分布式推理 | 要统一多厂商 API |

### 8.2 选与不选

**选 AIBrix 当**：已在跑 vLLM/SGLang，不想换引擎与平台，核心诉求是「更省 (缓存)、更稳 (路由/弹性)、更可观测」；愿意跟随 Gateway API 上游标准；团队偏好渐进式增强。

**不选 AIBrix 当**：要开箱即用的端到端平台 (含模型仓库/版本/灰度) → 看 KServe；要跨几十节点的分布式 KV Cache 共享 → 看 llm-d；只想统一调用多厂商 API → 看 LiteLLM。

---

## 9. 常见问题 FAQ

**Q1: AIBrix 只能配 vLLM 用吗？**
A: 它对 vLLM 优化最深 (指标、prefix cache 接口)，但 Gateway/路由层是通用的，SGLang 等兼容 OpenAI API 的引擎也能接入，只是部分高级能力 (如缓存亲和) 受益度不同。

**Q2: 启用 AIBrix 会引入额外延迟吗？**
A: Gateway 会增加一跳，但内部为纯内存转发，开销通常在毫秒级。而前缀缓存命中带来的 prefill 节省，往往远大于这一跳的成本，整体 TTFT 反而下降。

**Q3: 它和 KServe 能共存吗？**
A: 可以。KServe 负责「模型 → Service」的托管与自动扩缩，AIBrix Gateway 可以放在 KServe ServingRouting 前面做更细的路由。但功能有重叠 (都在做扩缩)，建议明确分工，避免两套 autoscaler 打架。

**Q4: 前缀感知路由对短 prompt / 无重复场景有用吗？**
A: 收益有限。它对「有稳定 system prompt、长文档上下文、多轮对话」收益最大；纯一次性短问答建议用 `least-connections` 或 `token-aware`。

**Q5: AIBrix 是 CNCF 项目的什么级别？**
A: 截至 2026-06，AIBrix 列入 CNCF Landscape (Inference 分类)，归属于 vllm-project 组织，尚未进入 CNCF 托管 (Sandbox/Incubating) 流程，处于社区生态成长期。

**Q6: 启用缓存 (Cache) 组件的成本与收益如何权衡？**
A: 成本主要是 sidecar 内存占用与缓存条目维护开销 (通常百 MB 级)。收益取决于「前缀重复率」：若流量中前缀重复率 > 30%，命中率往往能到 50%+，省下的 prefill 算力远超 sidecar 开销；若重复率 < 10%，命中率会很低，缓存几乎是纯开销，建议关闭或改用语义缓存 (相似度匹配)。先用 Observability 测一周 `prefix_cache_hit_rate`，再决定是否长期开。

**Q7: 多租户/多模型共享一个 InferencePool 时，AIBrix 如何隔离？**
A: AIBrix 的隔离粒度在 InferencePool 层——每个模型/租户建议声明独立的 InferencePool，Gateway 按 `model` 字段把请求路由到对应池，亲和表也按池隔离。不要把 SLA 差异大的模型塞进同一个池，否则热点前缀会拖垮整个池的命中率。Token budget 配额则按 model label 在 Gateway 侧做软限流。

---

## Related

- README — CNCF 云原生 LLM 项目全景，AIBrix 在「推理服务层」
- KServe Deep Dive — 端到端推理平台，与 AIBrix 互补
- [[CNCF_Cloud_Native_AI/llm-d_Deep_Dive]] — 分布式推理引擎层，另一种推理运营思路
- [[部署推理/Inference_Engines/vLLM_Deep_Dive]] — AIBrix 的「地基」推理引擎
- [[架构基建/AI_Gateway/LiteLLM_Deep_Dive]] — 多厂商 API 代理，对比理解 AIBrix Gateway 的定位
