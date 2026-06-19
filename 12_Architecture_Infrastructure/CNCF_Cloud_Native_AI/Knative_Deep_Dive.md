---
title: "Knative Serving: LLM 服务的弹性与 scale-to-zero"
category: "12-architecture-infrastructure"
tags: ["cncf", "kubernetes", "knative", "serverless", "llm", "autoscaling"]
summary: "> **一句话理解**: Knative Serving 是 CNCF 毕业级的 Serverless 层——靠 KPA 实现「按并发自动扩缩 + 闲时缩到 0 个 Pod」，让昂贵的 GPU 推理 Pod 不再空转，并能对模型版本做金丝雀流量切分。"
created: "2026-06-16"
updated: "2026-06-16"
---

# Knative Serving: LLM 服务的弹性与 scale-to-zero

> **一句话理解**: Knative Serving 是 CNCF 毕业级的 Serverless 层——靠 KPA 实现「按并发自动扩缩 + 闲时缩到 0 个 Pod」，让昂贵的 GPU 推理 Pod 不再空转，并能对模型版本做金丝雀流量切分。

> 📐 **概念方法论**: Knative 解决的是「Kubernetes 上请求驱动的弹性抽象」——它不关心你跑的是 Web 服务还是 LLM 推理，只提供 `Service`/`Revision`/`Route`/`PodAutoscaler` 一组 CRD，把「按并发扩缩 + 闲时归零 + 流量切分」变成声明式能力。对 LLM 场景而言，它是 KServe 的弹性底座（见 [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]]），也是降低推理成本/延迟权衡的关键杠杆（见 [[11_MLOps_Pipeline/LLM_Cost_Latency_SLO]]）。

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
10. [Related](#related)

---

## 1. 概述

### 1.1 定位

Knative（/kəˈneɪtɪv/，源自 K8s-native）是 Google 于 2018 年发起、现由 **CNCF 毕业**托管的 **Kubernetes 之上的开发者级 Serverless 应用层**。官方定位：「Knative is a developer-focused serverless application layer which is a great complement to the existing Kubernetes application constructs.」它分 **Serving**（请求驱动弹性 + 流量管理）与 **Eventing**（事件驱动）两个可独立使用的模块。本文聚焦 Serving——对 LLM 推理最有价值的部分。

```
Kubernetes 应用栈 —— Knative 的位置
═══════════════════════════════════════════════════════════════
 ┌───────────────────────────────────────────────────────────┐
 │ 你的应用 (LLM 推理 / Web API / 事件处理)                    │
 ├───────────────────────────────────────────────────────────┤
 │ Knative Serving  ← 请求驱动弹性 + scale-to-zero + 灰度     │
 │ Knative Eventing ← 事件总线 (可选, 与 Serving 解耦)         │
 ├───────────────────────────────────────────────────────────┤
 │ Kubernetes (Deployment / Pod / Service / Ingress)          │
 │ 基础设施 (节点 / GPU / 网络 / 存储)                          │
 └───────────────────────────────────────────────────────────┘
 核心理念: KPA 让 Pod 数量随「真实并发请求数」伸缩, 闲时归零 —— GPU 不再空转
```

**对 LLM 的核心价值**：GPU 极贵（A100/H100 每小时数美元），而推理 Pod 大量时间在空等请求。Knative 让推理服务无流量时**直接缩到 0 个 Pod**（释放 GPU），首请求到达时由 Activator「唤醒」拉起 Pod（cold start）——把 GPU 利用率从 < 10% 拉到 > 60% 的最直接手段。

### 1.2 核心特性

| 特性 | 说明 | LLM 价值 |
|------|------|----------|
| **Scale-to-zero** | 无请求时 Pod 自动缩到 0 | GPU 闲时归零，省最大的那块成本 |
| **KPA (Knative Pod Autoscaler)** | 基于「并发请求数」的请求驱动扩缩 | 比 CPU/QPS 的 HPA 更贴合推理负载画像 |
| **Target concurrency** | `target` 定义每 Pod 期望并发 | 按 GPU 显存/吞吐精确设定并发红线 |
| **Canary / 流量切分** | Route 按百分比在 Revision 间切流量 | 模型版本金丝雀、A/B、秒级回滚 |
| **Revisions 不可变快照** | 每次配置变更产生新 Revision | 版本可追溯、可逐版本回滚 |
| **Queue-Proxy sidecar** | 每 Pod 一个边车：采集并发、限流、熔断 | 防 LLM Pod 被打爆、透出标准指标 |
| **Activator** | 0 副本时承接首请求并唤醒 Pod | 让 scale-to-zero 对调用方「无感」 |
| **原生 GPU 支持** | `nvidia.com/gpu` 资源直接生效 | 无需额外适配 |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 |
|------|------|
| 2018-07 | Google 联合 Pivotal/SAP/IBM 等开源 Knative |
| 2018-11 | v0.1，确立 Service/Route/Configuration/Revision CRD |
| 2019-11 | 进入 **CNCF 沙箱**作为首个 Serverless 项目 |
| 2020 | 引入 Kourier 轻量网络层；逐步 GA 各特性 |
| 2022-03 | 升级为 **CNCF 孵化项目** |
| 2024-03 | **CNCF 毕业 Graduated**——成熟度与采用度双重背书 |
| 2024–2025 | v1.x 稳定迭代；强化 Gateway API、冷启动优化、可观测 |
| 2026 | v1.x 持续成熟，是 KServe / 多家云厂商 Serverless 的底层 |

仓库：<https://github.com/knative/serving>

---

## 2. 核心概念

Knative Serving 通过 4 个面向用户的 CRD + 2 个内部组件，把「弹性服务」抽象出来。

```
Knative Serving CRD 全景
═══════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────────┐
│ Service (ksvc)        ← 用户面向, 最常用, 一个对象搞定一切       │
│   ├─ 自动生成 Configuration + Route                             │
│   └─ 每次 spec.template 变更 → 新 Revision                      │
├─────────────────────────────────────────────────────────────────┤
│ Configuration         ← 定义「跑什么」(镜像/资源/环境/探针)      │
│   └─ 不可变快照 = Revision                                      │
├─────────────────────────────────────────────────────────────────┤
│ Revision              ← 不可变版本 (v1, v2, v3 ...)              │
│   └─ 每个 Revision 对应一个 Deployment + PodAutoscaler          │
├─────────────────────────────────────────────────────────────────┤
│ Route                 ← 定义「流量怎么走」(revision 间按权重)    │
│   └─ canary: latest 10% , v2 90%                                │
├─────────────────────────────────────────────────────────────────┤
│ PodAutoscaler (PA)    ← 内部 CRD, KPA 读写它做扩缩决策          │
└─────────────────────────────────────────────────────────────────┘
```

**对象关系**：`ksvc` 自动创建 `Configuration` + `Route`；每次 `spec.template` 变更产出不可变 `Revision`；`Route` 按权重把流量分到各 Revision（见 3.2 流量切分图）。各 CRD 的关键字段与职责：

| CRD | 关键字段 | 职责 |
|-----|---------|------|
| **Service** (`ksvc`) | `spec.template`（容器/资源/注解）；`spec.traffic[]`（流量切分） | 用户唯一入口；template 变更触发新 Revision，traffic 定义灰度 |
| **Configuration** | `spec.template.spec.containers[]`；`spec.template.spec.containerConcurrency` | 声明「跑什么」——镜像、资源（含 GPU）、并发硬限 |
| **Revision** | `status.conditions[Ready]`；自动关联 `PodAutoscaler` | 不可变版本；每个 Revision 自动生成一个 Deployment + PA |
| **Route** | `spec.traffic[].revisionName` + `percent` + `tag` | 流量按权重分流到 Revision；tag 生成独立子域名供 canary 访问 |
| **PodAutoscaler** (`PA`) | `spec.scaleTargetRef`；`spec.minScale/maxScale`；`spec.containerConcurrency`；`spec.class`(kpa/hpa) | 内部 CRD，KPA 据此算期望副本并写回 `status.desiredPodCount` |

### 2.1 逐个概念

- **Service (`ksvc`)**：最高层抽象。绝大多数场景只需写一个 `ksvc`，它会自动生成并管理 Configuration + Route。改 `spec.template` 即触发新版本。
- **Configuration**：定义「跑什么」——容器镜像、资源（含 GPU）、环境变量、卷、探针、init-container。它是「期望状态」的声明。
- **Revision**：Configuration 的**不可变快照**。每次 template 变更（换镜像/调参数）产生一个新 Revision，老的不会被改。这意味着任何版本都可一键回滚。
- **Route**：定义流量如何在多个 Revision 间分配。`traffic: [{revision: v1, percent: 90}, {revision: v2, percent: 10}]` 即金丝雀。
- **PodAutoscaler (PA)**：每个 Revision 自带一个内部 CRD。它声明「我希望怎么被扩缩」(KPA 还是 HPA、target 并发、min/max)。KPA 控制器持续 watch 它。
- **Activator**：当某 Revision 副本数为 0 时，流量被路由到 Activator。它**保存住第一个请求**（不向调用方报错），同时通知 KPA 把 Pod 拉起来，就绪后把请求转发过去——让 scale-to-zero 对调用方基本无感。
- **Queue-Proxy**：每个业务 Pod 注入的 sidecar。职责：① 向 KPA 上报实时并发与 RPS；② 执行 per-Pod 并发限制（超过 `target` 的请求排队而非压垮推理进程）；③ 暴露 `/metrics`（Prometheus）；④ 做优雅关停与流量排空。

### 2.2 Cold Start 与 Scale-to-zero 工作机制

```
 闲时: Pod 数 = 0, GPU 已释放
                          │ 第 1 个请求到达
                          ▼
 客户端 ──► Kourier ──► Activator (承接请求, 不报错)
                         │ ① 通知 KPA ② 等 Pod 就绪 ③ 转发
                         ▼   (这段耗时 = cold start)
                  KPA 副本 0→1 → 调度 Pod + 拉 GPU + vLLM 载入权重
                         │
 客户端 ◄────── 请求 ◄───┘  (调用方只感觉「这次慢」)
                         │ 并发 > target → KPA 继续扩 1→N
 稳态: Pod 数 = ceil(并发 / target)
                         │ 并发持续为 0 (持续 window, 默认 ~30s)
                         ▼
                    KPA 缩容 → 副本 0 (scale-to-zero)
```

下面是带**时间轴与阶段标注**的完整生命周期（以一次「营业 → 闲时 → 归零 → 再唤醒」为例）：

```text
 T=0s      ACTIVE          Pod=3, 并发=12, target=4 (稳态)
 T+10s     请求结束        并发 → 0, 进入 IDLE
 T+15s     IDLE            Pod 仍=3; stable-window(60s) + grace(30s) 开始计时
 T+70s     宽限耗尽        ──► SCALE-TO-ZERO: KPA 缩副本→0, GPU 释放, Pod=0
 T+120s    新请求到达      客户端 ─► Kourier ─► (副本=0) ─► Activator
 T+121s    ACTIVATOR HOLD  挂起请求(不报错) + 回调 KPA: 期望副本 0→1
           WAKE POD        调度 Pod → 分 GPU → vLLM 载入权重 (主要 cold start)
 T+135s    Pod Ready       readinessProbe 通过, Queue-Proxy 就绪
 T+136s    FORWARD→ACTIVE  Activator 转发请求 → 客户端收到响应, 回到稳态
```

> 调用方感受到的「慢」= `T+120s → T+137s`（示例约 17s）。实际 7B 模型常为 30s~2min，70B 多卡 3~10min。可调项：缩短 WAKE POD（权重 PVC 预拉 / 量化），或直接跳过归零（`min-scale:1`）。

两个关键阈值由注解决定：`target`（每 Pod 期望并发，超出即扩容）与 scale-to-zero 的空闲窗口（`scale-to-zero-grace-period` / `stable-window`）。对 LLM，cold start 主要耗时在**加载模型权重到 GPU 显存**（几 GB~上百 GB），可达数十秒到数分钟，是生产调优的重点。

---

## 3. 架构设计

### 3.1 控制面与数据面

```
                     Knative Serving 架构
═══════════════════════════════════════════════════════════════
【控制面 (knative-serving ns)】
 ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐
 │ Serving Controller│ │ KPA Autoscaler   │ │  Activator   │
 │ watch ksvc/cfg/   │ │ 算期望副本, 写    │ │ 0副本时承接  │
 │ route 并调和      │ │ PodAutoscaler    │ │ 请求并唤醒   │
 └────────┬─────────┘ └────────┬─────────┘ └──────┬───────┘
          │  Revision→Deployment+PodAutoscaler    │
【数据面】 ▼                                      ▼
 客户端 ─► [Kourier / Istio / Contour Ingress] ─┬─ 副本=0 ─► Activator ─┐
                                                 └─ 副本>0 ─► Pod 直达    │
                                                              ▼          ▼
                                       Pod: [ Queue-Proxy ]──[ 你的容器 vLLM ]
                                              │ 上报并发/RPS
                                              ▼
                                         KPA 决策 (扩缩 / 归零)
```

### 3.2 KPA 扩缩环路与流量切分

KPA 的扩缩本质是一个简单而稳定的控制环：`期望副本 = ceil(观测并发 / target)`，再用 stable/window 平滑抖动。

```
   Queue-Proxy 上报 ──► KPA: 观测并发=12, target=4
                          │
                          ▼
              期望副本 = ceil(12/4) = 3
                          │
                ┌─────────┴──────────┐
                ▼                    ▼
       副本 < 3 → scale up      副本 = 0 且并发=0
       (可预热, 走 Deployment)   持续 window 秒 → scale-to-zero

   流量切分 (Route 层, 与扩缩独立):
   ksvc ──► Route ──┬─ 90% ─► Revision-v1 (Deployment-1 + PA-1)
                   └─ 10% ─► Revision-v2 (Deployment-2 + PA-2)  [canary]
   每个 Revision 各自独立扩缩; Route 按 weight 分流 (ingress 层完成)
```

> 关键洞察：流量切分发生在 **Ingress/Kourier 层**（按 HTTP header/百分比），与每个 Revision 内部的 KPA 扩缩**完全解耦**。这让「金丝雀新模型」与「按并发弹性」可以同时发生、互不干扰。

---

## 4. 安装部署

### 4.1 前置条件

- Kubernetes ≥ 1.28 集群，已装好默认 StorageClass。
- **GPU 节点 + NVIDIA GPU Operator**（若服务 LLM 必备）：提供 `nvidia.com/gpu` 资源、驱动、device plugin。
- 一个可解析的默认域名（见 4.4）。

### 4.2 方式一：官方 YAML + Kourier（最简洁）

```bash
# 安装 Knative Serving CRD 与核心组件
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.15.0/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.15.0/serving-core.yaml

# 安装 Kourier 网络层（轻量, 推荐；仅需一个 Deployment）
kubectl apply -f https://github.com/knative/net-kourier/releases/download/knative-v1.15.0/kourier.yaml

# 指定 Knative 使用 Kourier
kubectl patch configmap/config-network \
  -n knative-serving --type merge \
  -p '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
```

### 4.3 方式二：Knative Operator / Helm

```bash
# Operator 方式（便于后续升级、配置回滚）
kubectl apply -f https://github.com/knative/operator/releases/download/knative-v1.15.0/operator.yaml
kubectl apply -f - <<EOF
apiVersion: operator.knative.dev/v1beta1
kind: KnativeServing
metadata: { name: knative-serving, namespace: knative-serving }
spec:
  version: "1.15.0"
  config:
    network: { ingress-class: "kourier.ingress.networking.knative.dev" }
EOF

# Helm 方式
helm repo add knative https://knative.github.dev/serving-helm/
helm install knative-serving knative/serving -n knative-serving --create-namespace \
  --set kourier.enabled=true
```

### 4.4 域名 / DNS 配置

Knative 默认用 `<svc>.<ns>.<domain>` 形式暴露服务。本地实验用 `sslip.io`：

```bash
# 把默认域名设为 sslip.io (magic DNS, 无需真实域名)
kubectl patch configmap/config-domain \
  -n knative-serving --type merge \
  -p '{"data":{"127.0.0.1.sslip.io":""}}'

# 本地端口转发 Kourier (实验用)
kubectl -n kourier-system port-forward svc/kourier 8080:80
```

生产环境应配置真实域名（指向 Kourier/Istio Ingress 的 LoadBalancer），并配 TLS（Cert-Manager + Knative 自动签发）。

### 4.5 网络层选择

| 网络层 | 体积 | 适用 |
|--------|------|------|
| **Kourier** | 最小（1 个 Envoy-based Deployment） | **推荐起步**、绝大多数场景 |
| **Istio** | 较重，功能最全（mTLS、精细策略） | 已有 Istio / 需要服务网格 |
| **Contour** | 中等 | 已有 Contour 环境 |

### 4.6 验证

```bash
kubectl get pods -n knative-serving
# 期望: controller / autoscaler / activator / webhook 全 Running
kubectl get pods -n kourier-system
# 期望: 3*kourier (gateway/control) Running
```

---

## 5. 快速开始

目标：把 **vLLM 推理容器**作为 Knative `Service` 部署，开 `scale-to-zero`，体验冷启动与缩容。

### 5.1 部署 LLM 为 Knative Service

```yaml
# vllm-ksvc.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: qwen-vllm
  namespace: default
  annotations:
    # 闲时可缩到 0 (默认即开, 此处显式声明)
    serving.knative.dev/scale-to-zero-pod-retention-period: "0s"
spec:
  template:
    metadata:
      annotations:
        # 弹性参数 (详见第 6 章)
        autoscaling.knative.dev/class: "kpa.autoscaling.knative.dev"
        autoscaling.knative.dev/min-scale: "0"        # 允许缩到 0
        autoscaling.knative.dev/max-scale: "3"        # 上限保护 GPU
        autoscaling.knative.dev/target: "4"           # 每 Pod 期望并发=4
        autoscaling.knative.dev/scale-to-zero-pod-retention-period: "30s"
        # 冷启动给足时间加载权重
        serving.knative.dev/progress-deadline: "600s"
    spec:
      timeoutSeconds: 300            # 推理请求可能较慢
      nodeSelector:
        nvidia.com/gpu.present: "true"
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          args:
            - --model=Qwen/Qwen2.5-7B-Instruct
            - --tensor-parallel-size=1
            - --max-model-len=8192
          env:
            - name: HUGGING_FACE_HUB_TOKEN
              valueFrom: { secretKeyRef: { name: hf-token, key: token } }
          resources:
            limits:   { nvidia.com/gpu: "1", memory: 24Gi }
            requests: { nvidia.com/gpu: "1", memory: 16Gi }
          readinessProbe:
            httpGet: { path: /health, port: 8000 }
            initialDelaySeconds: 30
            periodSeconds: 10
```

```bash
kubectl create secret generic hf-token --from-literal=token=hf_xxx
kubectl apply -f vllm-ksvc.yaml

# 等 Service Ready
kubectl wait ksvc/qwen-vllm --for=condition=Ready --timeout=600s
```

### 5.2 发请求观察

```bash
# 获取 URL
URL=$(kubectl get ksvc qwen-vllm -o jsonpath='{.status.url}')
echo $URL   # http://qwen-vllm.default.127.0.0.1.sslip.io

# 调用 (OpenAI 兼容接口)
curl -s $URL/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"Qwen/Qwen2.5-7B-Instruct",
       "messages":[{"role":"user","content":"用一句话解释 scale-to-zero"}]}'
```

### 5.3 观察 scale-to-zero

```bash
# 1) 有请求时看副本数
kubectl get deploy -l serving.knative.dev/service=qwen-vllm
# NAME                    READY   副本 > 0

# 2) 停止所有请求, 等待约 30s~60s
sleep 70
kubectl get deploy -l serving.knative.dev/service=qwen-vllm
# NAME                    READY   0/0    ← 已缩到 0, GPU 释放!

# 3) 再发一个请求 → 观察 cold start
time curl -s $URL/v1/chat/completions ...
# real    1m12s   ← 这 1 分多钟 = 权重加载 + Pod 就绪 (cold start)
```

> 第一条请求慢是正常的——它包含了「KPA 唤醒 → 调度 Pod → 拉 GPU → vLLM 载入权重」全过程。后续并发请求命中已就绪 Pod 时则回到稳态延迟。

---

## 6. 生产配置

### 6.1 弹性注解速查表

| 配置项 | 类型 | 作用 | 典型值 (LLM) |
|--------|------|------|-------------|
| `autoscaling.knative.dev/class` | 注解 | 扩缩器类型 | `kpa.autoscaling.knative.dev`（请求驱动）；`hpa.*` 走 CPU/内存 |
| `autoscaling.knative.dev/min-scale` | 注解 | 最小副本 | `1`（保活避冷启动）/ `0`（开 scale-to-zero） |
| `autoscaling.knative.dev/max-scale` | 注解 | 最大副本 | GPU 总数上限，防超卖（如 `4`） |
| `autoscaling.knative.dev/target` | 注解 | 每 Pod 期望并发（软限，触发扩容） | 依 GPU 吞吐设（2~10） |
| `autoscaling.knative.dev/target-utilization-percentage` | 注解 | target 的打折系数，留扩容余量 | `70`~`80`（默认 70） |
| `autoscaling.knative.dev/initial-scale` | 注解 | Revision 首次创建时的初始副本 | `1`（默认），冷启动后即就绪 |
| `autoscaling.knative.dev/window` | 注解 | 扩缩聚合观测窗口 | `60s`（默认）；突发可调 `30s` |
| `autoscaling.knative.dev/stable-window` | 注解 | 稳态判定窗口（决定是否缩容/归零） | `60s`（默认） |
| `autoscaling.knative.dev/panic-window` (+`panic-threshold-percentage`) | 注解 | 恐慌窗口（突发快速扩容）及触发倍率 | `10s` + `200`（默认 2 倍即恐慌扩容） |
| `autoscaling.knative.dev/scale-to-zero-pod-retention-period` | 注解 | 最后一次请求后 Pod 保留时长 | `30s`~`5m`（短=省 GPU，长=抗抖动） |
| `autoscaling.knative.dev/scale-to-zero-grace-period` | 注解 | 归零前的最小宽限（stable-window 下限） | `30s`（默认），需 ≤ stable-window |
| `serving.knative.dev/progress-deadline` | 注解 | Revision 就绪宽限；超时判 Ready 失败 | LLM 建议 `300s`~`900s`（权重加载） |
| `serving.knative.dev/enable-service-links` | 注解 | 是否注入 K8s service env（`*_SERVICE_HOST`） | `false`（避免 env 膨胀、加快启动） |
| `spec.template.spec.containerConcurrency` | spec | 单 Pod 硬并发上限（超出在 Queue-Proxy 排队） | `6`~`10`；建议 > target |
| `containers[].resources.limits.nvidia.com/gpu` | spec | GPU 限额（驱动 device plugin 分配） | `1`（单卡）/ `4`（多卡 TP） |

> 注：`target` 的全局默认值在 ConfigMap `config-defaults` 的 `container-concurrency-target-default`；旧名 `serving.knative.dev/target` 已废弃，统一用 `autoscaling.knative.dev/target`。

### 6.2 GPU 资源与显存

```yaml
resources:
  limits:
    nvidia.com/gpu: "1"          # 单卡; TP>1 时填多张
    memory: 24Gi                 # 留给 KV cache / 临时张量
  requests:
    nvidia.com/gpu: "1"
    memory: 16Gi
# 多卡张量并行 (70B+):
#   limits: { nvidia.com/gpu: "4" }
#   args:   [ --tensor-parallel-size=4 ]
```

### 6.3 Cold Start 缓解

| 策略 | 配置 | 代价 |
|------|------|------|
| **保活 (`min-scale: 1`)** | 永远留 1 副本 | 一张常驻 GPU（最常用、最简单） |
| **拉长就绪宽限** | `progress-deadline: 900s` | 无，避免误判失败 |
| **权重 PVC 缓存 / init-container 预拉** | init-container 把模型从对象存储拷到共享卷，主容器从本地卷加载 | 多占存储，省网络下载时间 |
| **用更小的模型 / 量化** | AWQ/GPTQ 4bit | 精度/速度权衡 |
| **分级保活** | 核心 LLM `min-scale:1`，辅助小模型 scale-to-zero | 平衡成本 |

init-container 预拉权重示例（把模型提前拷进共享 PVC，主容器从本地卷加载）：

```yaml
spec:
  template:
    spec:
      initContainers:
        - name: model-pull
          image: ghcr.io/huggingface/hf-transfer:latest
          env:
            - { name: HUGGING_FACE_HUB_TOKEN, valueFrom: { secretKeyRef: { name: hf-token, key: token } } }
          command: ["/bin/sh","-c"]
          args: ["hf download Qwen/Qwen2.5-7B-Instruct --local-dir /models/qwen"]
          volumeMounts: [{ name: models, mountPath: /models }]
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          args: ["--model=/models/qwen","--tensor-parallel-size=1"]
          volumeMounts: [{ name: models, mountPath: /models }]
      volumes:
        - name: models
          persistentVolumeClaim: { claimName: qwen-models }
```

### 6.4 Canary 金丝雀流量切分

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: qwen-vllm
spec:
  template:
    metadata:
      name: qwen-vllm-v2          # 指定新 revision 名
    spec:
      containers:
        - image: vllm/vllm-openai:latest
          args: ["--model=Qwen/Qwen2.5-14B-Instruct"]   # 升级到 14B
  traffic:
    - revisionName: qwen-vllm-v1   # 旧版
      percent: 90
      tag: stable
    - revisionName: qwen-vllm-v2   # 新版, 10% 灰度
      percent: 10
      tag: canary
```

```bash
# 单独访问 canary tag (Route 自动生成子域名)
curl http://canary-qwen-vllm.default.127.0.0.1.sslip.io/v1/chat/completions ...

# 观察无异常 → 逐步 100%
kubectl apply -f <(把 canary percent 调到 100)

# 秒级回滚: 把流量权重切回 v1
```

### 6.5 并发限制与并发兜底

```yaml
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/target: "4"        # KPA 扩容线
    spec:
      containerConcurrency: 6                       # 硬限: 单 Pod 最多 6 并发
                                                    # 超出在 Queue-Proxy 排队, 不打爆 vLLM
```

`containerConcurrency` 是**硬限**（Queue-Proxy 强制排队），`target` 是**软限**（触发扩容）。LLM 场景建议 `target < containerConcurrency`，给扩容留出反应时间，避免突发流量击穿单 Pod。

### 6.6 生产级 LLM Service 完整示例

下面是一个「营业时段常驻、带 GPU、就绪宽限充分、对新模型做金丝雀」的生产级 `ksvc`，集中演示上面所有注解的协同：

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata: { name: qwen-prod, namespace: default }
spec:
  template:
    metadata:
      name: qwen-prod-v2
      annotations:
        autoscaling.knative.dev/min-scale: "1"          # 保活避冷启动
        autoscaling.knative.dev/max-scale: "4"
        serving.knative.dev/progress-deadline: "900s"   # 权重加载宽限
    spec:
      containerConcurrency: 6
      nodeSelector: { nvidia.com/gpu.present: "true" }
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          args: ["--model=Qwen/Qwen2.5-14B-Instruct", "--tensor-parallel-size=1"]
          resources:
            limits:   { nvidia.com/gpu: "1", memory: 48Gi }
            requests: { nvidia.com/gpu: "1", memory: 32Gi }
          readinessProbe: { httpGet: { path: /health, port: 8000 }, failureThreshold: 60 }
  traffic:
    - { revisionName: qwen-prod-v1, percent: 90, tag: stable }
    - { revisionName: qwen-prod-v2, percent: 10, tag: canary }
```

> 关键点：`min-scale:1` 让核心模型永不归零（无 cold start）；`progress-deadline:900s` + `failureThreshold:60` 给 14B 权重加载留足时间；`traffic` 块把 10% 流量引到 v2 做金丝雀。非营业时段可把 `min-scale` 改回 `0` 释放 GPU。

### 6.7 冷启动缓解 Playbook

当 `min-scale:0` 必须开（闲时省 GPU）但又要控制 cold start，按以下顺序叠加（4 种手段，由简到繁）：

1. **保活预热 (`min-scale:1`)**：核心高 QPS 模型永远留 1 热副本——最有效、最简单，代价是一张常驻 GPU；仅低 QPS / 辅助模型开 scale-to-zero。
2. **Keep-alive pinger**：用 CronJob 或轻量 sidecar，每隔 `< scale-to-zero-grace-period`（如 20s）打一次 `/v1/models`，刷新「最后请求时间」使 Pod 保持 IDLE 但不归零。适合白天波动、夜间偶发。
3. **Activator 超时对齐**：客户端 `timeout`、Knative `timeoutSeconds`、`progress-deadline` 三者递增对齐（`progress-deadline ≥ 加载时间`，`timeoutSeconds ≥ progress-deadline`），探针 `failureThreshold` 调大，否则 Activator 先于 Pod 就绪返回 503。
4. **init-container 预拉权重**：见 6.3——模型从对象存储拷到共享 PVC，主容器本地卷载入，省掉公网下载（分钟级→秒级）。

> 经验法则：冷 start 预算 = `progress-deadline`。先用 1 个请求实测 WAKE POD 耗时，再设 `progress-deadline` 留 30% 余量；超出预算的模型一律 `min-scale:1` 保活。

---

## 7. 运维与可观测

### 7.1 关键 Prometheus 指标

| 指标 | 来源 | 含义 | 告警建议 |
|------|------|------|---------|
| `queue_average_concurrent_requests` | Queue-Proxy | 单 Pod 当前并发 | 持续 > target |
| `queue_requests_per_second` | Queue-Proxy | RPS | 趋势 |
| `queue_request_latency_{count,sum,bucket}` | Queue-Proxy | 请求延迟分布 | P99 > SLO |
| `queue_request_queue_duration_milliseconds` | Queue-Proxy | 在 Queue-Proxy 排队时长 | P99 > 1s 需扩容 |
| `activator_request_count` | Activator | 命中 Activator 的请求数 | 持续 > 0 说明在频繁冷启动 |
| `activator_request_latency` | Activator | 唤醒 + 等就绪耗时 | = cold start 时长 |
| `knative_revision_count{desired,ready}` | KPA | 期望/就绪副本 | desired>ready 持续 |
| `autoscaler_actual_pod_count` | KPA | 当前副本 | 监控扩缩 |
| `autoscaler_desired_pod_count` | KPA | 期望副本 | 与 actual 比对 |
| (透传) `vllm:num_requests_running/waiting` | vLLM | 推理队列 | waiting>0 需扩 |

### 7.2 ServiceMonitor 接入

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: knative-queue-proxy
  namespace: default
spec:
  selector:
    matchLabels: { serving.knative.dev/service: qwen-vllm }
  endpoints:
    - port: http-userport          # Queue-Proxy 的 metrics 端口
      path: /metrics
      interval: 15s
---
# KPA / Activator 自身指标
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata: { name: knative-autoscaler, namespace: knative-serving }
spec:
  selector: { matchLabels: { app: autoscaler } }
  endpoints: [{ port: metrics, path: /metrics, interval: 15s }]
```

> Knative 官方提供 Grafana Dashboard（仓库 `servingobservability` 目录），覆盖 queue/activator/autoscaler 三组面板，导入即用。

### 7.3 常见故障排查

| 症状 | 根因 | 处理 |
|------|------|------|
| **冷启动过长/频繁** | scale-to-zero 后每次重载权重 | 关键 LLM 设 `min-scale:1`；或权重 PVC 预拉 |
| **Revision 一直 `RevisionMissing`/卡住** | progress-deadline 太短，权重没加载完就超时 | 调大 `progress-deadline`；优化探针 `initialDelaySeconds` |
| **扩缩反复 flapping（抖动）** | window 太短 / panic 阈值激进 | 调大 `window`/`stable-window`，降低 panic-threshold |
| **Pod OOMKilled** | KV cache + 权重超 memory limit | 调大 `memory`；降 vLLM `--gpu-memory-utilization` |
| **503 Service Unavailable** | 副本 0 且 Activator 等待超时 | 检查 Pod 是否能就绪；`progress-deadline` 给足 |
| **GPU 分不到** | `nvidia.com/gpu` 已占满 | `kubectl describe node`；上 Kueue 排队或扩节点 |
| **流量切分不生效** | 用了 `latest` 关键字而非 `revisionName` | 显式指定 `revisionName` + `percent` |
| **指标抓不到** | ServiceMonitor 端口名不对 | 确认 `http-userport` 端口存在且 label 匹配 |

### 7.4 调优清单

| 目标 | 调整 |
|------|------|
| 省 GPU 成本 | `min-scale:0` + 合适 retention；闲时归零 |
| 抗突发 | `panic-window:10s`、`max-scale` 放宽、预热 |
| 稳定延迟 | `min-scale:1` 保活；`target` 略低于 `containerConcurrency` |
| 避抖动 | `stable-window` 调大、`target-utilization` 适中 |
| 快回滚 | 始终用 `revisionName` 切流量，保留老 Revision |

### 7.5 升级

```bash
# 备份所有 ksvc
kubectl get ksvc -A -o yaml > ksvc-backup.yaml
# 升级 CRD + core (operator 方式更稳)
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.16.0/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.16.0/serving-core.yaml
kubectl rollout status deploy/controller -n knative-serving
# 逐 ksvc 验证 Ready, 用 Route 灰度验证行为
```

---

## 8. 对比与选择

### 8.1 Knative vs 同类弹性方案

| 维度 | **Knative Serving** | raw Deployment + HPA | **KServe** (裹 Knative) | KEDA | Fission |
|------|---------------------|----------------------|-------------------------|------|---------|
| **定位** | 通用 Serverless 弹性层 | K8s 原生工作负载 | 标准化推理 CRD | 事件/指标驱动扩缩 | 函数级 FaaS |
| **scale-to-zero 支持** | 原生一等公民 | 无（minReplicas≥1） | 继承 Knative，原生支持 | 支持（需配 idle） | 原生（函数即按需） |
| **并发驱动扩缩 (KPA)** | 原生 | 否（CPU/自定义） | 继承 Knative | 否（事件/指标） | 否（每请求新容器） |
| **GPU autoscaling** | 原生 `nvidia.com/gpu` + target 并发 | 原生但靠 CPU 信号 | 原生 + 推理专属指标 | 原生（需自定义 scaler） | 较弱（函数不擅长 GPU） |
| **canary / 流量切分** | Route 原生百分比 | 需 Istio/Argo Rollouts | 继承 + InferenceGraph | 无（仅扩缩） | 有限（路由层） |
| **event-driven** | Eventing 模块（解耦可选） | 需外部接线 | 支持（消息/Storage） | 核心能力（Kafka/Prom） | HTTP 触发为主 |
| **Revision / 回滚** | 不可变快照，秒级回滚 | 手动镜像 tag 管理 | 继承 Knative | 无 | 版本化函数 |
| **冷启动唤醒 (Activator)** | 内置、对调用方无感 | 不适用 | 继承 Knative | 无统一唤醒层 | 函数级 cold start 较重 |
| **推理特化** | 无（通用） | 无 | 有（多框架/指标/存储） | 无 | 无 |
| **OSS 成熟度** | CNCF **Graduated** | K8s 内置 | CNCF Incubating | CNCF **Graduated** | CNCF 沙箱 |
| **学习曲线** | 中 | 低 | 中（要懂 Knative） | 低 | 低 |

### 8.2 什么时候选 Knative Serving

```
选 Knative Serving  ✓ ──┬── 需要真正的 scale-to-zero 省 GPU
                        ├── 要对模型/服务做 canary 金丝雀 + 秒级回滚
                        ├── 想自己掌控 serving 编排 (不一定要 KServe 抽象)
                        ├── 团队已用 Kubernetes, 想要声明式弹性
                        └── 有多种负载 (LLM + 普通 API) 共用一套弹性层

选其他               ✗ ──┬── 只想要标准化推理平台     → KServe (内含 Knative)
                        ├── 纯事件驱动 (Kafka/Redis 触发) → KEDA
                        ├── 超大规模 disaggregated      → llm-d
                        └── 单机快速跑                 → vLLM 裸跑 / Ollama
```

**选型结论**：没有「最好」，只有「最贴合负载画像」。Knative 是**请求驱动 + scale-to-zero + 灰度**三位一体的通用弹性层，对「LLM 推理 Pod 闲时归零」这个特定痛点几乎是唯一原生解；但若扩缩信号是外部事件队列、或需要一个完整 ML 平台，就该把 Knative 当底座、上面叠 KEDA / KServe。Fission 适合短函数 FaaS，不擅长常驻 GPU 推理；raw Deployment+HPA 够用但缺 scale-to-zero 与灰度。

决策树（按问题逐层分流）：

```text
 需要 scale-to-zero 省 GPU ?           ── 是 ─► Knative Serving (KPA + Activator)
    └─ 否
       └─ 扩缩信号来自外部事件(Kafka/队列)? ── 是 ─► KEDA (叠加在 Deployment 上)
             └─ 否
                └─ 需要完整 ML 推理平台(多框架)? ── 是 ─► KServe (内含 Knative)
                      └─ 否 ─► raw Deployment + HPA (够用就好)
```

> 与 KServe 的关系：KServe 把 Knative 当作弹性底座，在其上叠加推理 CRD（InferenceService）、多框架 ServingRuntime、推理专属指标。如果你只要「弹性 + 灰度」，直接用 Knative 更轻；如果要「标准化推理平台 + 多框架」，用 KServe（详见 [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]]）。

---

## 9. 常见问题 FAQ

**Q1：Cold start 一般有多长？能优化到多少？**
取决于模型大小与权重来源。7B 模型从镜像/HF 下载 + 载入单卡 GPU，约 30s~2min；70B 多卡可能 3~10min。优化手段：① `min-scale:1` 保活（最有效）；② 权重 PVC 预拉 / init-container；③ 量化降体积；④ 用更快的存储。优化后稳态延迟与常驻无异。

**Q2：GPU 服务真能 scale-to-zero 吗？会不会有问题？**
能。Pod 归零即释放 `nvidia.com/gpu`，节点 GPU 可被其他工作负载复用。代价是首请求 cold start（重载权重）。生产建议：核心高 QPS 模型 `min-scale:1` 保活，低 QPS / 内部辅助模型开 scale-to-zero。注意检查 scale-to-zero 时 GPU 驱动/显存是否彻底释放（GPU Operator 版本要新）。

**Q3：怎么完全避免冷启动？**
设 `autoscaling.knative.dev/min-scale: "1"`，永远留 1 个热副本。此时无 cold start，但 7×24 占用一张 GPU（成本权衡）。折中：`min-scale:1` 保小模型 / 路由层做预热请求。

**Q4：KPA 和 HPA 我该用哪个？**
LLM 推荐 **KPA**（请求并发驱动，直接反映推理负载）。HPA 基于 CPU/内存，但推理往往是 GPU/显存 bound，CPU 信号滞后且不灵敏。仅当扩缩信号必须来自外部指标（自定义 Prometheus）时才退而用 HPA class。

**Q5：流量切分和 KEDA 能一起用吗？**
可以但分工不同：Knative 自己已提供 canary/回滚（Route 层），通常不需要 KEDA。若你的扩缩信号来自 Kafka 队列等外部源，可用 KEDA 驱动副本，Knative 负责 Route——但更常见是二选一。多数推理场景 KPA 已足够。

**Q6：Knative 有没有「最少冷启动」的推理特化？**
Knative 本身不感知「模型」。推理特化（按 KV cache 路由、按 prefill/decode 分离）是 KServe / llm-d 等上层项目的职责。Knative 提供「弹性 + 灰度」通用能力，把推理语义留给上层（见 [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]]、[[CNCF_Cloud_Native_AI/llm-d_Deep_Dive]]）。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] —— CNCF 云原生 LLM 项目全景
- [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]] —— 在 Knative 之上的标准化推理平台
- [[10_Deployment_Inference/vLLM_Deep_Dive]] —— Knative 上跑的 LLM 推理引擎
- [[11_MLOps_Pipeline/LLM_Cost_Latency_SLO]] —— scale-to-zero 与延迟/成本的权衡
