---
title: "KServe: Kubernetes 原生标准化推理平台"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "inference", "kserve", "llm"]
summary: "> **一句话理解**: KServe 是 CNCF 孵化项目，把『模型 → Kubernetes 上可弹性、可灰度、可观测的推理 API』变成一个声明式 CRD，是云原生推理的事实标准底座。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Kserve Deep Dive"
  - "KServe Deep Dive"
  - KServe_Deep_Dive
sources: []

---
# KServe: Kubernetes 原生标准化推理平台

> **一句话理解**: KServe 是 CNCF 孵化项目，把「模型 → Kubernetes 上可弹性、可灰度、可观测的推理 API」变成一个声明式 CRD，是云原生推理的事实标准底座。

> 📐 **概念方法论**: KServe 解决的是「推理服务的标准化抽象」——它不管底层用 vLLM 还是 Triton，只定义 `InferenceService` 这个统一接口。底层引擎如何选（vLLM / SGLang / TGI / Triton）见 [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide]]，KServe 把它们编排进 K8s。

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
KServe: Standardized Inference Platform on Kubernetes
═══════════════════════════════════════════════════════════════════
定位: CNCF 孵化项目 —— 标准化的分布式生成式与判别式 AI 推理平台
核心理念:
• 标准化:    InferenceService CRD，屏蔽底层推理引擎差异
• Serverless:基于 Knative，scale-to-zero、按需扩缩、流量灰度
• 多框架:    vLLM / TGI / Triton / PyTorch / TF Serving / ONNX / Ollama
• 解耦:      模型存储 / 推理引擎 / 流量入口 / 监控 各司其职
• 可扩展:    ServingRuntime / StorageContainer 可自定义
• 生产就绪:  Canary、A/B、金丝雀、多模型路由、Prometheus 指标齐备
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **InferenceService CRD** | 一个 YAML 声明模型、引擎、资源、副本、灰度策略 |
| **Scale-to-zero** | Knative 驱动，无请求时 Pod 缩到 0，GPU 闲时省钱 |
| **Canary / 流量切分** | 按百分比把流量导到新旧版本，原生金丝雀发布 |
| **多框架 ServingRuntime** | vLLM、HuggingFace Server、Triton、TFServing、Ollama 等开箱即用 |
| **Transformer / Explainer** | 预处理 hook 与模型可解释性（SHAP、AIX）可选组件 |
| **Gateway API** | 0.14+ 支持 Kubernetes Gateway API，告别强绑 Istio |
| **LLM 指标** | TimePerOutputToken、NumTokensGenerated、首 token 延迟 |

### 1.3 CNCF 状态与发展历程

| 时间 | 事件 |
|------|------|
| 2019–2020 | 起源于 Kubeflow 的 KFServing 子项目，2020-09 独立为 CNCF 沙箱 |
| 2021-09 | 改名为 **KServe**，跨 Kubeflow 独立运作 |
| 2022-04 | v0.8，引入 InferenceGraph、标准化 ServingRuntime |
| 2023-04 | 升级为 **CNCF 孵化项目** |
| 2024 | v0.13，内置 vLLM ServingRuntime、强化 LLM 指标 |
| 2025-04 | **v0.14**，支持 Kubernetes Gateway API、HuggingFace Server 通用化 |
| 2026 | 持续向『分布式 GenAI 推理平台』演进，对齐 llm-d 思路 |

仓库：<https://github.com/kserve/kserve>

---

## 2. 核心概念

KServe 通过一组 CRD 把推理服务抽象出来，最关键的是 `InferenceService`、`ServingRuntime`、`InferenceGraph`。

```
KServe CRD 全景
═══════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────────┐
│ InferenceService (isvc)      ← 用户面向，最常用                │
│   ├ predictor   (必填)  模型 + 引擎 + 资源                     │
│   ├ transformer (可选)  预处理/后处理 hook                     │
│   └ explainer   (可选)  模型可解释性 (SHAP/AIX)                │
├─────────────────────────────────────────────────────────────────┤
│ ClusterServingRuntime / ServingRuntime  ← 引擎「模版」          │
│   镜像、启动命令、协议 (v2/grpc/rest)、支持的 modelFormat       │
│   例: kserve-vllm / kserve-huggingfaceserver / kserve-triton   │
├─────────────────────────────────────────────────────────────────┤
│ ClusterStorageContainer  ← storageInitializer 模型下载器       │
│   从 HF/S3/GCS/OCI 拉权重，注入到 /mnt/models                  │
├─────────────────────────────────────────────────────────────────┤
│ InferenceGraph  ← 多个 isvc 串成图: 顺序/路由/集成学习         │
│ TrainedModel    ← (传统 ML) 子模型，挂到已有 isvc 共享进程     │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 InferenceService 三段式结构

```
┌─── InferenceService ───┐
│ predictor  transformer  explainer      ← 三段，仅 predictor 必填
│ (vLLM/TGI) (预处理hook) (SHAP 归因)
│      ▲
│      │ storageUri 挂载 /mnt/models
│ storageInitializer (initContainer, 一次性拉权重)
└────────────────────────┘
      │ Knative Service 包装
      ▼
   真实运行的 Pod (含 queue-proxy 边车)
```

> 用户 90% 时间只和 `predictor` 打交道；`transformer` / `explainer` 是高阶用法。

### 2.2 CRD 字段速查

| CRD | 作用域 | 关键字段 | 职责 |
|-----|--------|---------|------|
| `InferenceService` (isvc) | Namespaced | `spec.predictor` / `transformer` / `explainer`，各含 `model.modelFormat`、`storageUri`、`runtime`、`resources`、`replicas` | 用户面向的推理服务声明，仅 predictor 必填 |
| `ServingRuntime` | Namespaced | `containers`、`supportedModelFormats`、`protocolVersion`、`grpcDataEndpoint` | 团队级引擎启动模版，与 isvc 解耦 |
| `ClusterServingRuntime` | Cluster | 同 ServingRuntime | 全局共享引擎模版（内置 `kserve-vllm`/`kserve-triton`/`kserve-huggingfaceserver` 即此类型） |
| `ClusterStorageContainer` | Cluster | `container.image`、`supportedUriSources`（hf/s3/gs/oci/azure/pvc） | 按 `storageUri` 协议选择 storageInitializer 镜像与下载逻辑 |
| `InferenceGraph` | Namespaced | `nodes.<n>.routerType`（split/sequence/switch/ensemble）+ `routes[].service/weight` | 把多个 isvc 串成推理图，做金丝雀/级联/集成学习 |
| `TrainedModel` | Namespaced | `parentInferenceService`、`storageUri`、`modelFormat` | 传统 ML 子模型，复用同一 isvc 进程，省副本 |

### 2.3 组件运行时映射

```
        ┌─────────────────── InferenceService (isvc) ───────────────────┐
        │                                                                │
 ┌──────▼──────────┐   ┌──────────────────┐   ┌──────────────────────┐  │
 │ predictor (必填)│   │ transformer(可选)│   │ explainer   (可选)   │  │
 │ 推理容器+边车   │   │ 自定义镜像+边车  │   │ SHAP/AIX +边车       │  │
 │ + storageInit   │   │ 用户自实现预处理 │   │ KServe 内置模版      │  │
 │ ServingRuntime  │   │ 端口: 8080       │   │ 端口: 8080           │  │
 │ 渲染·8080(v1/v2)│   │                  │   │                      │  │
 └──────┬──────────┘   └────────┬─────────┘   └─────────┬────────────┘  │
        │                       │ before/after          │ /explain      │
        └───────────────────────┴───────────────────────┘               │
                          Knative Service 各自独立扩缩                    │
        └────────────────────────────────────────────────────────────────┘
```

> 三组件各自是独立的 Knative Service，按各自并发指标独立扩缩；流量顺序固定为 transformer → predictor → explainer，链路上任一组件可缺省。

---

## 3. 架构设计

### 3.1 组件全景

```
   客户端 / SDK
       │
       ▼
   ┌──────────────┐   Istio / Kourier / Contour 任选
   │  Gateway     │   0.14+ 支持 Kubernetes Gateway API
   │  (Ingress)   │
   └──────┬───────┘
          │
   ┌──────▼───────────────────────────────────────────────┐
   │  KServe Controller Manager   (watch isvc → 生成 KS) │
   └──────┬───────────────────────────────────────────────┘
          │ create
   ┌──────▼──────────────┐
   │  Knative Service    │  scale-to-zero + 自动扩缩
   └──────┬──────────────┘
          │ reconcile → Pod 内三容器协作
   ┌──────┼──────────────┬──────────────────────┐
   ▼      ▼              ▼                      ▼
 storageInitializer  推理容器            queue-proxy 边车
 (initContainer)     vLLM/TGI/Triton/    • 批处理 / Prometheus
 HF/S3/GCS/OCI →     Ollama  :8080       • 鉴权 / 镜像 / 透传
 /mnt/models         HTTP + gRPC
```

### 3.2 请求流转

```
1. POST /v1/chat/completions  (OpenAI 兼容)
2. Gateway (Kourier/Istio) ── 路由到 isvc 的 Knative Service
3. queue-proxy (边车先接) ── 鉴权 / 批处理聚合 / 透传
      若 Pod 被 scale-to-0，此时激活 (cold start)
4. 推理容器 (vLLM) ── 从 /mnt/models 加载权重 (storageInitializer 已拉好)
      Continuous Batching + PagedAttention
5. 流式 token 返回 ── queue-proxy 收集指标 (TTFT, TPOT)
6. /metrics 暴露给 Prometheus → Grafana → 告警
```

### 3.3 三个关键组件如何协作

| 组件 | 何时运行 | 职责 |
|------|---------|------|
| **storageInitializer** | Pod 启动时（initContainer，一次性） | 按 `storageUri` 协议（hf://、s3://、gs://、oci://）拉权重到 `/mnt/models` |
| **queue-proxy** | Pod 全生命周期（边车） | 流量接管、指标暴露、批处理、激活信号上报给 Knative |
| **Knative Serving** | 控制面 | 把 isvc 翻译成 Deployment + KPA（PodAutoscaler），实现 scale-to-zero 与按并发扩缩 |

> KServe = Knative（弹性/流量）+ 你选的引擎（推理）+ KServe CRD（胶水）。三者解耦是它最大的设计胜利。

### 3.4 控制面与数据面职责分离

| 组件 | 所在面 | 运行形态 | 核心职责 |
|------|--------|---------|---------|
| **KServe Controller Manager** | 控制面 | Deployment（集群级） | watch `InferenceService`/`InferenceGraph`，按 `deploymentMode` 渲染为 Knative Service 或原生 Deployment，注入边车与 initContainer |
| **Knative Controller + KPA** | 控制面 | Deployment（knative-serving） | 把 KS 翻译为 Revision/Route；KPA 按并发或 RPS 算期望副本，与 Activator 协作 scale-to-zero |
| **Ingress Gateway** | 数据面 | Kourier/Istio/Contour 或 Gateway API | 接外部 HTTP，按 Route 规则把流量分到 Activator 或直连 Pod |
| **Activator** | 数据面 | Deployment（Knative） | Pod 为 0 时暂存请求并触发拉起，Pod 就绪后流量切回直连，不在稳态热路径 |
| **queue-proxy 边车** | 数据面 | 每 Pod 一个容器 | 统一鉴权/超时、批处理聚合、上报并发与 LLM 指标、cold-start 期间回压 |
| **InferenceGraph Router** | 数据面 | 由 graph 渲染为独立 Pod | 按 `routerType`(split/sequence/switch/ensemble) 在多个 isvc 间路由、金丝雀切分 |

### 3.5 含 autoscaling 的请求全链路

```
 客户端 POST
   │
   ▼
 Ingress Gateway (Kourier/Istio) ◄── Route 规则
   │
   ├─ Pod==0? ──► Activator(暂存+回压) ──拉起──► KPA(副本=并发/target)
   │                       └── Pod Ready ──┐
   ▼                                       ▼
 Pod: queue-proxy(鉴权/超时/指标/并发上报) ──► 推理容器(vLLM)
      加载 /mnt/models · Continuous Batching · 流式返回
   │
   ▼
 响应 + 指标 ──► Prometheus(TTFT/TPOT) ──► Grafana；并发 ──► KPA 调副本 ──► 直连 Pod
```

> 稳态下流量绕过 Activator 直连 Pod，Activator 不在热路径；KPA 依据 queue-proxy 上报的并发做扩缩，与 HPA 的 CPU 阈值机制本质不同——故 LLM 场景必须用 KPA（按并发），CPU 指标在 GPU 推理下毫无意义。

### 3.6 Serverless vs RawDeployment 模式

```
┌──────────────────────────┬──────────────────────────┐
│ Serverless (默认)         │ RawDeployment            │
│ deploymentMode: Serverless│ deploymentMode: Raw      │
├──────────────────────────┼──────────────────────────┤
│ 底层: Knative Service     │ 底层: Deployment + HPA   │
│ ✓ scale-to-zero 省 GPU   │ ✗ 不缩到 0                │
│ ✓ Route 原生金丝雀/A-B    │ ✗ 需 Istio/Argo Rollouts │
│ ✓ Activator 兜冷启动      │ ✓ 无边车、热路径更短      │
│ ✗ Kueue 集成偏弱          │ ✓ 原生 Workload 排队     │
└──────────────────────────┴──────────────────────────┘
```

> 两种模式由 isvc 的 `deploymentMode` 注解决定，可在同一集群混用：长尾小模型走 Serverless 缩 0，核心大模型走 RawDeployment 叠 Kueue。决策细节见 §6.6。

---

## 4. 安装部署

### 4.1 前置条件

| 项 | 要求 |
|----|------|
| Kubernetes | >= 1.28（建议 1.30+） |
| 默认 StorageClass | 必须存在（Knative 依赖 PVC） |
| 网络 CNI | 支持（Calico/Cilium 均可） |
| GPU（可选） | NVIDIA Operator + `nvidia.com/gpu` 资源 |
| kubectl / helm | 最新稳定版 |

### 4.2 安装 KServe 核心

```bash
# 方式 A: 单 YAML（推荐快速起步）
kubectl apply -f https://github.com/kserve/kserve/releases/download/v0.14.0/kserve.yaml
# 验证
kubectl get pods -n kserve-serverless   # kserve-controller-manager-xxxx  2/2 Running
```

### 4.3 安装网络层（必选其一）

KServe 依赖一个 Knative 兼容的网络层。**Kourier 最轻量**，生产环境也可用 Istio。

```bash
# Kourier（轻量推荐，单二进制 Ingress）
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.15.0/knative-serving.yaml
kubectl apply -f https://github.com/knative/net-kourier/releases/download/knative-v1.15.0/kourier.yaml
kubectl patch configmap/config-network \
  -n knative-serving --type merge \
  -p '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'
```

### 4.4 GPU 节点准备

```bash
# 安装 NVIDIA GPU Operator（一次性）
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm install --wait gpu-operator -n gpu-operator --create-namespace nvidia/gpu-operator
# 验证 GPU 可调度
kubectl get nodes -o custom-columns=NAME:.metadata.name,GPU:.status.allocatable.nvidia\.com/gpu
```

### 4.5 版本兼容矩阵

| KServe | Knative Serving | K8s | Kubernetes Gateway API |
|--------|-----------------|-----|------------------------|
| 0.13 | 1.13.x | 1.27–1.30 | 实验性 |
| **0.14** | **1.14–1.15** | **1.28–1.31** | **正式支持** |
| 0.15 (dev) | 1.16+ | 1.29–1.32 | 默认推荐 |

> 升级原则：先升 Knative，再升 KServe；CRD 单独 `kubectl apply --server-side` 升级避免冲突。

---

## 5. 快速开始

### 5.1 场景 A：CPU 跑小模型（HuggingFace Server）

```yaml
# sklearn-iris.yaml —— 最小可运行示例（传统 ML，验证安装）
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: sklearn-iris
spec:
  predictor:
    model:
      modelFormat:
        name: sklearn
      protocolVersion: v2
      storageUri: "gs://kfserving-examples/models/sklearn/1.0/model"
      resources:
        limits:
          cpu: "1"
          memory: 1Gi
```

```bash
kubectl apply -f sklearn-iris.yaml
kubectl wait isvc/sklearn-iris --for=condition=Ready --timeout=180s
# 推理（v2 协议）
curl -s http://sklearn-iris.default.${INGRESS_HOST}.nip.io/v2/models/sklearn-iris/infer \
  -H "Content-Type: application/json" \
  -d '{"inputs":[{"name":"input-0","shape":[1,4],"datatype":"FP32","data":[[6.8,2.8,4.8,1.4]]}]}'
```

### 5.2 场景 B：GPU 跑 LLM（vLLM Runtime，OpenAI 兼容）

```yaml
# qwen-vllm.yaml —— 单卡 GPU 跑 Qwen2.5-0.5B（小，易验证）
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: qwen-llm
  annotations:
    serving.kserve.io/enable-prometheus-scraping: "true"
spec:
  predictor:
    model:
      modelFormat:
        name: huggingface
      runtime: kserve-vllm            # 内置 vLLM ServingRuntime
      storageUri: "hf://Qwen/Qwen2.5-0.5B-Instruct"
      protocolVersion: v1             # OpenAI 兼容
      resources:
        limits:
          nvidia.com/gpu: "1"
          memory: 8Gi
        requests:
          nvidia.com/gpu: "1"
          memory: 4Gi
    env:
      - name: VLLM_GPU_MEMORY_UTILIZATION
        value: "0.85"
      - name: VLLM_MAX_MODEL_LEN
        value: "4096"
```

```bash
kubectl apply -f qwen-vllm.yaml
kubectl wait isvc/qwen-llm --for=condition=Ready --timeout=600s

# OpenAI 兼容调用
curl -s http://qwen-llm.default.${INGRESS_HOST}.nip.io/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen2.5-0.5B-Instruct",
    "messages": [{"role":"user","content":"用一句话介绍 KServe"}],
    "max_tokens": 64,
    "stream": false
  }'
```

> 生产模型（70B 级）把 `storageUri` 换成 `hf://meta-llama/Llama-3.1-70B-Instruct`，`nvidia.com/gpu` 设为 4（vLLM 自动做 Tensor Parallel）。

### 5.3 调用协议速查

| 协议 | 端点 | 适用 |
|------|------|------|
| **v1（OpenAI）** | `/v1/chat/completions`、`/v1/completions` | LLM、对话、流式 |
| **v2（KServe DataPlane）** | `/v2/models/<name>/infer` | 传统 ML、Triton、标准化 |
| **gRPC** | 端口 9000 | 低延迟、批量 |

---

## 6. 生产配置

### 6.1 关键参数与注解

| 参数 / 注解 | 作用 | 典型值 |
|------------|------|--------|
| `spec.predictor.minReplicas` | 最小副本（防缩到 0） | LLM 建议 1 |
| `spec.predictor.maxReplicas` | 最大副本 | 按 GPU 预算 |
| `serving.kserve.io/max-scale` | Knative 扩缩上限 | 同上 |
| `autoscaling.knative.dev/class` | 弹性算法 | `kpa.autoscaling.knative.dev`（默认）/ `hpa` |
| `autoscaling.knative.dev/target` | 每副本目标并发 | LLM 建议 8–32 |
| `autoscaling.knative.dev/window` | 扩缩容窗口 | `60s`–`300s` |
| `serving.kserve.io/enable-prometheus-scraping` | Prometheus 抓取 | `"true"` |
| `nvidia.com/gpu`（resources.limits） | GPU 分配 | 1 / 2 / 4 / 8 |
| `VLLM_*` 环境变量 | 透传给 vLLM | 见 [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive]] |
| `storageUri` 协议前缀 | 模型来源 | `hf://` / `s3://` / `gs://` / `oci://` / `azure://` / `pvc://` |
| `autoscaling.knative.dev/min-scale` | Knative 保底副本（Serverless 不缩到 0） | LLM: `1` |
| `serving.kserve.io/pvc-name` | 挂载已有 PVC（权重预热，省下载） | `model-cache-pvc` |
| `nodeSelector` / `tolerations`（PodSpec） | GPU 节点亲和 / 专用池 | `nvidia.com/gpu.present: "true"` |
| `spec.predictor.timeoutSeconds` | 单请求超时（流式推理调大） | `600` |
| `LocalModelNode`（CRD） | 节点级权重缓存压缩 cold start | DaemonSet 预拉到节点盘 |
| `serving.kserve.io/deploymentMode` | 切换部署模式 | `Serverless` / `RawDeployment` |

### 6.2 生产 values.yaml（Helm 飨宴）

```yaml
# values-prod.yaml
kserve:
  controller:
    deploymentMode: controller
    resources:
      limits: { cpu: "2", memory: 2Gi }
      requests: { cpu: "500m", memory: 512Mi }

# 全局模型缓存配置（避免每次 cold start 都重下）
storageInitializer:
  image: kserve/storage-initializer:0.14.0
  resources:
    limits: { cpu: "2", memory: 4Gi }
  caBundle:
    enabled: true

# LLM 场景：放宽 Knative 激活超时（权重加载慢）
knative:
  config:
    deployment:
      progressDeadline: "600s"
    autoscaler:
      stable-window: "60s"
      panic-window: "10s"
```

### 6.3 多副本 + 反亲和（高可用）

```yaml
spec:
  predictor:
    minReplicas: 2
    maxReplicas: 8
    affinity:
      podAntiAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchLabels: { app: qwen-llm-predictor }
            topologyKey: kubernetes.io/hostname
```

### 6.4 Canary 灰度发布（InferenceGraph）

```yaml
apiVersion: serving.kserve.io/v1alpha1
kind: InferenceGraph
metadata:
  name: llm-canary
spec:
  nodes:
    root:
      routerType: split
      routes:
        - service: qwen-v1        # 旧版本 isvc
          weight: 90
        - service: qwen-v2        # 新版本 isvc
          weight: 10              # 10% 流量先灰度
```

> 流量切分由 Knative 路由层完成，零额外组件；观察新版本指标无异常后逐步把 weight 调到 100。

### 6.5 生产级 Canary 完整工作流

```yaml
# qwen-canary.yaml —— 基线 v1 + 候选 v2 + 切分图，一次 apply
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: qwen-v1
  annotations:
    autoscaling.knative.dev/min-scale: "2"
    serving.kserve.io/enable-prometheus-scraping: "true"
spec:
  predictor:
    model:
      modelFormat: { name: huggingface }
      runtime: kserve-vllm
      storageUri: "hf://Qwen/Qwen2.5-7B-Instruct"
      protocolVersion: v1
      resources: { limits: { nvidia.com/gpu: "1", memory: 16Gi } }
    timeoutSeconds: 600
# qwen-v2 同结构：name=qwen-v2、storageUri 换成 v2 权重、min-scale 起步 "1"
---
apiVersion: serving.kserve.io/v1alpha1
kind: InferenceGraph
metadata:
  name: qwen-canary
spec:
  nodes:
    root:
      routerType: split
      routes:
        - service: qwen-v1
          weight: 90
        - service: qwen-v2
          weight: 10
```

```bash
kubectl apply -f qwen-canary.yaml   # v1/v2 isvc + graph 一次下发
# 观察无异常后逐步提权，最终全量切 v2：
kubectl patch igraph qwen-canary --type=json -p='[{"op":"replace","path":"/spec/nodes/root/routes/0/weight","value":0},{"op":"replace","path":"/spec/nodes/root/routes/1/weight","value":100}]'
```

### 6.6 Serverless vs RawDeployment 决策

由 isvc 注解 `serving.kserve.io/deploymentMode: RawDeployment`（默认 `Serverless`）切换：

| 维度 | Serverless | RawDeployment |
|------|-----------|---------------|
| scale-to-zero | ✓ | ✗ |
| 流量切分/金丝雀 | ✓ Route 原生 | ✗ 需 Istio / Argo Rollouts |
| Kueue / Volcano 排队 | 弱（Pod 级抢占） | ✓ 原生 Workload |
| 推荐 | 多模型弹性、闲时省 GPU | 核心 LLM、固定 SLA、批次排队 |

> 经验：同一集群混用——长尾小模型走 Serverless 缩 0 省 GPU，核心大模型走 RawDeployment 叠 Kueue 排队，互不干扰。排队细节见 [[CNCF_Cloud_Native_AI/Kueue_Deep_Dive]]。

---

## 7. 运维与可观测

### 7.1 LLM 专属 Prometheus 指标

| 指标 | 含义 | 告警建议 |
|------|------|---------|
| `kserve_request_total` | 请求总数（按 isvc / 路由） | 趋势监控 |
| `kserve_request_latency` | 端到端延迟分布 | P99 > 5s |
| `kserve_request_time_per_output_token_milliseconds` (TimePerOutputToken / TPOT) | 单 token 生成耗时 | P99 > 150ms |
| `kserve_request_first_token_latency_milliseconds` | 首 token 延迟 (TTFT) | P99 > 2s |
| `kserve_request_num_tokens_generated` | 每请求生成 token 数 | 成本核算 |
| `queue_request_queue_duration_milliseconds` | 排队等待时长 | P99 > 1s 需扩容 |
| `queue_average_concurrent_requests` | 当前并发 | 接近 target 即扩 |
| (透传) `vllm:num_requests_waiting` | vLLM 内部等待队列 | > 0 持续需关注 |

### 7.2 ServiceMonitor（Prometheus Operator 接入）

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: kserve-llm
  namespace: default
spec:
  selector:
    matchLabels: { serving.kserve.io/inferenceservice: qwen-llm }
  endpoints:
    - port: http-user
      path: /metrics
      interval: 15s
```

> KServe 社区提供官方 Grafana Dashboard JSON（仓库 `docs/samples/metrics`），导入即可，覆盖 request/queue/LLM token 三组面板。

### 7.3 常见故障排查

| 症状 | 根因 | 处理 |
|------|------|------|
| Pod 反复 OOMKilled | 权重 + KV Cache 超出 `memory` limit | 调大 memory；或降 `VLLM_GPU_MEMORY_UTILIZATION` |
| `storageInitializer` 报 401/403 | HF token 缺失 / S3 凭证未配 | 建 `secret` 并在 isvc 引用，或配置 `ClusterStorageContainer` 默认凭证 |
| 模型下载卡死/超时 | 网络到 HF Hub 慢 | 用 `hf-mirror.com` 镜像；或预先用 PVC/Dragonfly 缓存权重 |
| Cold start 太慢 | scale-to-zero 后权重重载 | LLM 设 `minReplicas: 1`；或用预拉缓存 |
| 流量 503 | Knative 激活超时 | 调大 Knative `progress-deadline` |
| GPU 分不到 | `nvidia.com/gpu` 已被占满 | 查 `kubectl describe node`；上 Kueue 排队或扩节点 |

### 7.4 扩缩容调优思路

| 场景 | 策略 |
|------|------|
| 低延迟、不接受 cold start | `minReplicas=1`，关 scale-to-zero |
| 突发流量、闲时省钱 | KPA + `target=并发`，允许缩到 0 |
| GPU 紧张、要排队 | 在 KServe 之上叠 Kueue（LocalQueue） |
| 超大规模、要 disaggregated | 考虑迁移到 [[CNCF_Cloud_Native_AI/llm-d_Deep_Dive]] |

### 7.5 升级路径

```bash
# 1. 备份 CRD 与现有 isvc
kubectl get isvc -A -o yaml > isvc-backup.yaml
# 2. 升级 CRD（server-side，避免冲突）
kubectl apply --server-side -f https://github.com/kserve/kserve/releases/download/v0.14.0/kserve.yaml
# 3. 观察 controller 滚动
kubectl rollout status deploy/kserve-controller-manager -n kserve-serverless
# 4. 逐个 isvc 验证 Ready，灰度回滚用 canary
```

---

## 8. 对比与选择

### 8.1 KServe vs 同类 CNCF 推理项目

| 维度 | **KServe** | KAITO | llm-d | llmaz |
|------|-----------|-------|-------|-------|
| **CNCF 状态** | Incubating | Sandbox | Landscape | Landscape |
| **核心抽象** | InferenceService CRD | Workspace preset | InferencePool + disaggregated | Model/InferenceRuntime |
| **底层引擎** | vLLM/TGI/Triton/Ollama/任意 | vLLM/TGI（preset） | 自研（兼容 vLLM worker） | vLLM/SGLang/TGI/Ollama |
| **弹性** | Knative scale-to-zero | Deployment/HPA | 分布式自调度 | HPA/空闲缩容 |
| **灰度** | Knative 原生切分 | 弱 | 弱 | InferencePool 路由 |
| **传统 ML** | 强（sklearn/xgb/pmml） | 否 | 否 | 否 |
| **学习曲线** | 中（要懂 Knative） | 低 | 高 | 中低 |
| **超大规模** | 一般 | 一般 | 极强（KV 分离） | 一般 |
| **适用** | 企业统一平台、多框架、已有 ML | 微软/Azure、快速 PoC | 超大规模多租户 | 中小团队易用优先 |

### 8.2 什么时候选 KServe

```
选 KServe  ✓ ──┬── 已有传统 ML 推理要统一纳管
               ├── 需要规范化 Canary / A/B / 多版本
               ├── 多框架并存（既跑 sklearn 又跑 vLLM）
               ├── 团队已用 Knative，想 scale-to-zero 省 GPU
               └── 需要标准化接口给上游（MLflow / Seldon 兼容）

选其他    ✗ ──┬── 只要最快拉起一个 LLM   → KAITO
               ├── 中小团队、要简单       → llmaz
               ├── 万卡级 disaggregated   → llm-d
               └── 纯本地单机             → Ollama / vLLM 裸跑
```

> 与底层引擎选型不冲突：KServe 编排层 + vLLM 引擎层是黄金组合。见 [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide]]。

---

## 9. 常见问题 FAQ

**Q1：KServe 一定要装 Istio 吗？**
不一定。KServe 支持任意 Knative 网络层：**Kourier（最轻量，推荐起步）**、Istio（功能最全）、Contour。0.14+ 还支持 Kubernetes Gateway API，彻底解耦。

**Q2：scale-to-zero 对 LLM 真的省钱吗？**
省 GPU 时长，但 cold start 要重载权重（几十 GB 可能数分钟）。生产 LLM 建议 `minReplicas: 1` 保活，仅对低 QPS 辅助模型开 scale-to-zero，或结合权重 PVC 缓存压缩冷启动。

**Q3：能否在一个 InferenceService 里服务多个 LoRA？**
可以。vLLM runtime 支持多 LoRA adapter，`storageUri` 指定基础模型，配合 `VLLM_ALLOW_RUNTIME_LORA_UPDATING` 动态加载；也可用 `TrainedModel` CRD 把多个子模型挂到同一 isvc。

**Q4：KServe 和 Seldon Core 什么关系？**
两者都是 K8s 推理 CRD 方案，共同推动了 V2 DataPlane 协议标准化。KServe 强在 Knative 原生 + 多框架 + CNCF 背书；Seldon 强在 Graph 灵活度。新项目优先 KServe。

**Q5：大模型（70B+）怎么做 Tensor Parallel？**
把 `nvidia.com/gpu` 设为 N（如 4），vLLM runtime 自动以 `--tensor-parallel-size=4` 启动；KServe 0.14 起对多卡副本数与 TP 参数有自动推导。

**Q6：怎么接 KServe 上 Kueue 做排队？**
给 isvc 的 Pod 模板加 `kueue.x-k8s.io/queue-name` 注解指向 LocalQueue，配合 `WorkloadPriorityClass`。适合 GPU 总量受限、多团队争抢的平台场景。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] —— CNCF 云原生 LLM 项目全景
- [[CNCF_Cloud_Native_AI/KAITO_Deep_Dive]] —— 更轻量的「一键 LLM」兄弟项目
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive]] —— KServe 默认 LLM 引擎深度解析
- [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide]] —— 底层引擎如何选
- [[12_架构基建/05_CNCF_Cloud_Native_AI/Knative_Deep_Dive]] —— KServe 的弹性底座
