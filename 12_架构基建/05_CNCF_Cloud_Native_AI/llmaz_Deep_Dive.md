---
title: "llmaz: 易用优先的 K8s 大模型推理平台"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "inference", "llmaz", "llm"]
summary: "> **一句话理解**: llmaz 把「模型」抽象成一个 Kubernetes CRD（Model）——声明一次模型来源/量化/引擎，就能在任何地方复用部署，是 K8s 上「易用优先」的大模型推理平台。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Llmaz Deep Dive"
  - "llmaz Deep Dive"
  - llmaz_Deep_Dive
sources: []

---
# llmaz: 易用优先的 K8s 大模型推理平台

> **一句话理解**: llmaz 把「模型」抽象成一个 Kubernetes CRD（Model）——声明一次模型来源/量化/引擎，就能在任何地方复用部署，是 K8s 上「易用优先」的大模型推理平台。

> 📐 **概念方法论**: llmaz 把「模型定义」从「部署配置」里彻底剥离——`Model` CRD 描述「模型是什么」（HuggingFace repo、量化、运行时引擎），`OpenAIServer`/`Backend` 描述「怎么跑它」。这种关注点分离与 [[05_CNCF_Cloud_Native_AI/KServe_Deep_Dive]] 的 InferenceService 抽象一脉相承，但更激进地追求 UX 简洁。运行时层可插拔（vLLM/SGLang/TGI/Ollama/TensorRT-LLM），选型见 [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide]]。

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
llmaz: Easy, advanced inference platform for LLMs on Kubernetes
══════════════════════════════════════════════════════════════
维护方:    InftyAI (github.com/InftyAI/llmaz)
CNCF 归属: Landscape → AI Native Infra / Inference
定位:      Kubernetes 原生的大模型推理平台

核心理念:
• Easy     ── 声明式 YAML，比裸 Deployment + vLLM 命令行直观
• Advanced ── Model-as-CRD、多运行时、InferencePool 智能路由、灰度
• K8s 原生 ── CRD + controller，复用调度 / 弹性 / 滚动升级

目标用户:
• 想要 KServe 能力但嫌其 YAML 太复杂的中小团队
• 需要在同一集群跑多模型 / 多版本的 MLOps 团队
• 希望用 InferencePool 做 prefix-cache 路由的进阶用户
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **Model-as-CRD** | 模型声明一次（来源 + 量化 + 引擎），多部署复用，定义与部署解耦 |
| **多运行时可插拔** | 内置 vLLM / SGLang / TGI / Ollama / TensorRT-LLM，新增引擎只需注册模板 |
| **OpenAI 兼容网关** | 内建 OpenAI API 网关，多副本自动负载均衡，客户端零改造 |
| **InferencePool 智能路由** | 接入 Kubernetes Gateway API InferencePool，按 prefix cache 命中率调度 |
| **模型灰度发布** | 原生支持 canary / 多版本共存，流量按权重切分 |
| **共享模型缓存** | 通过 PVC 缓存 HuggingFace 权重，多副本避免重复下载 |

### 1.3 项目历程

| 时间 | 里程碑 | 说明 |
|------|--------|------|
| 2024-Q3 | v0.1 首发 | Model / OpenAIServer CRD，vLLM + Ollama 运行时 |
| 2024-Q4 | v0.2-v0.3 | 加入 SGLang、TGI；Helm chart 进入仓库 |
| 2025-Q1 | v0.4-v0.5 | 接入 Gateway API InferencePool；TensorRT-LLM 运行时 |
| 2025-Q2 | v0.6-v0.7 | 模型灰度、多副本路由优化；进入 CNCF Landscape |
| 2025-Q4 | v0.8+ | Backend CRD（非 OpenAI 协议场景）、生产稳定性强化 |

---

## 2. 核心概念

### 2.1 三大 CRD 各司其职

```
┌────────────────────────────────────────────────────────────┐
│  Model (What)                                              │
│  • family / source.modelID(HF repo) / quantization         │
│  • 推荐运行时引擎 & 启动参数模板                            │
│  • 可被任意部署引用，是「可复用的模型制品」                  │
└────────────────────────────┬───────────────────────────────┘
                             │ 引用 (modelClaim)
              ┌──────────────┴──────────────┐
              ▼                             ▼
┌──────────────────────────┐  ┌─────────────────────────────┐
│  OpenAIServer            │  │  Backend                    │
│  • 引用一个或多个 Model   │  │  • 引用 Model               │
│  • 副本 / 资源 / 节点选择 │  │  • 暴露引擎原生端口         │
│  • 自动生成 OpenAI 网关   │  │  • 不强制 OpenAI 协议       │
└──────────────────────────┘  └─────────────────────────────┘
                             ▼ 底层推理引擎 Pod (vLLM / SGLang / ...)
```

**CRD 字段速查**（关键字段 → 职责，按 CRD 分组）：

| CRD | 关键字段 | 职责 |
|-----|---------|------|
| **Model** | `source.modelID` / `.family` / `.revision` | HuggingFace repo、模型族、权重版本 |
| | `source.quantization` (none/awq/gptq/fp8) | 量化方案 → 注入 `--quantization` |
| | `runtime.name` (vllm/sglang/tgi/ollama/trt-llm) | 选用哪个引擎启动模板 |
| | `runtime.args` / `.env` | 覆盖默认启动参数（用户优先级最高） |
| **OpenAIServer** | `modelClaim.name` | 引用一个 Model |
| | `replicas` / `containerSpec.resources` | 副本数 / GPU 申请 |
| | `storage.pvcName` | 挂载权重缓存 PVC |
| | `rollout` (Canary / trafficWeight) | 灰度策略 |
| **Backend** | `modelClaim.name` / `expose` | 引用 Model，暴露引擎原生端口（非 OpenAI 协议） |
| Runtime（内置模板） | —（非用户 CRD） | 每引擎一套「image + 默认 args」，webhook 查表注入 |

### 2.2 Model-then-Deploy（先声明模型，再声明部署）

这是 llmaz 区别于裸 Deployment 的核心范式：

```
传统做法 (一个 YAML 写死一切):
  Deployment → image: vllm/vllm-openai
               args: [--model, Qwen/Qwen2.5-7B-Instruct, --quantization, awq]
  问题: 模型来源 / 引擎 / 副本数全耦合，换模型要重写部署

llmaz 做法 (两步分离):
  Step 1: Model CRD         ← 我有一个模型，它长这样
  Step 2: OpenAIServer CRD  ← 我要用 3 个副本跑这个模型
  收益: 同一个 Model 可被 OpenAIServer / Backend / Canary 多处引用
```

`Model` 通过 `runtime` 字段选择推理后端，llmaz 为每个引擎内置启动参数模板；引擎无关的模型声明 + 引擎相关的参数注入，由 controller 在生成 Deployment 时合并：

```
Model.spec
  ├─ source.family          (Qwen2.5 / Llama / Mistral ...)
  ├─ source.modelID         (HuggingFace repo id)
  ├─ source.quantization    (none / awq / gptq / fp8 ...)
  └─ runtime
       ├─ name              (vllm / sglang / tgi / ollama / trt-llm)
       ├─ version           (引擎镜像 tag)
       └─ args / env        (覆盖默认启动参数)
```

### 2.3 运行时引擎抽象：Webhook 注入

控制器逻辑引擎无关——引擎差异收敛在 mutating webhook 的模板查表，新增引擎只需注册一套模板，controller 零改动：

```
OpenAIServer ─admission─▶ Mutating Webhook
  (不含引擎细节)          ① 读 Model.spec.runtime.name
                          ② 查模板表 → image + 默认 args
                             (vllm: --model,$MODEL_ID,--quantization ; sglang: ...)
                          ③ Model.runtime.args / .env 覆盖默认 (用户优先)
                          ④ PATCH PodSpec (image/args/env/healthcheck)
                              │
                              ▼
                 controller 渲染 Deployment (引擎无关)
```

---

## 3. 架构设计

### 3.1 组件总览

```
┌──────────────────────────────────────────────────────────┐
│ llmaz controller-manager                                 │
│   watch Model/OpenAIServer/Backend → 生成 Deployment +   │
│   Service + OpenAI Gateway，调和 CRD                     │
└──────────────┬───────────────────────────────────────────┘
         reconcile │
     ┌─────────────┴─────────────┐
     ▼                           ▼
┌──────────┐  ref       ┌──────────────────┐
│ Model    │ ◀───────── │ OpenAIServer /   │
│ (CRD)    │            │ Backend          │
└────┬─────┘            └────────┬─────────┘
     │ 挂载缓存 PVC      materialize │
     └──────────┐         ┌────────▼─────────┐
                └────────▶│ Deployment        │
                          │ (vLLM Pod×N, GPU) │
                          └────────┬──────────┘
                                   ▼
                          ┌──────────────────┐
                          │ OpenAI Gateway    │ ← /v1/chat /v1/comp
                          │ └─ InferencePool  │
                           └────────┬──────────┘
                                    ▼  客户端 (curl / SDK)
```

**组件职责一览**：

| 组件 | 职责 | 关键行为 |
|------|------|----------|
| **controller-manager** | 调和 CRD，物化为工作负载 | watch Model/OpenAIServer/Backend；生成 Deployment + Service + HTTPRoute；上报 `status.conditions` |
| **Mutating Webhook** | 引擎参数注入 | admission 阶段按 `Model.runtime` 注入 image/args/env/健康检查，使 controller 引擎无关 |
| **OpenAI Gateway** | OpenAI 兼容前端 | 暴露 `/v1/chat/completions` `/v1/completions` `/v1/models`；多副本负载均衡；对接 InferencePool |
| **Runtime Pods** | 实际推理 | vLLM/SGLang/TGI/Ollama/TensorRT-LLM 容器；initContainer 拉权重到共享 PVC |
| **LeaderWorkerSet** | 多卡张量并行（TP>1） | 一 leader + N worker Pod，worker 复用 leader 启动参数与网络，支撑 TP=2/4/8 |

### 3.2 Model 如何被「物化」成 Deployment

```
1. 用户 apply Model + OpenAIServer
2. controller watch 到 OpenAIServer 事件，查找引用的 Model
3. 读取 source.modelID / runtime.name / quantization
     • initContainer 决定拉哪个权重到共享 PVC
     • runtime.name  选择启动模板 (vllm/sglang/...)
     • quantization  注入 --quantization 参数
4. 渲染 Deployment + Service + OpenAI Gateway 路由
5. 上报 status.conditions (ModelsReady / Progressing / Available)
```

把上面五步串成一条「声明 → 注入 → 物化 → 路由」的流水线：

```
 declare              inject                materialize              route
──────────────────────────────────────────────────────────────────────────────
 Model CRD ─┐
            │                                                   InferencePool
 OpenAIServer┼─▶ webhook ─▶ controller ─▶ Deployment ─▶ Service ──▶ HTTPRoute
  (claim)   │  注入引擎     渲染 Pod      initContainer  /v1/chat     ↓
            │  image/args   + 挂载 PVC    下载权重       负载均衡    curl
            ▼
   status.conditions:  ModelsReady ─▶ Progressing ─▶ Available
   (任一为 False 都会阻塞网关对外服务)
```

### 3.3 InferencePool 智能路由

```
普通 Service 轮询:
  请求 "system:你是翻译助手, user:..." → Pod-2 (无缓存, 重新 prefill)

InferencePool (按 prefix cache 命中度路由):
  请求 "system:你是翻译助手, user:..." → Pod-1 (已缓存 system, 跳过 prefill)
```

---

## 4. 安装部署

### 4.1 前置依赖

| 组件 | 用途 | 是否必需 |
|------|------|----------|
| Kubernetes ≥ 1.27 | CRD + controller 运行环境 | 必需 |
| NVIDIA GPU Operator | 节点 GPU 驱动 / device plugin / MIG | 必需（NVIDIA 卡） |
| cert-manager | 为 webhook 签发证书 | 必需 |
| Gateway API CRD | 启用 InferencePool 智能路由 | 可选（强烈推荐） |
| 共享存储 (PVC/NFS) | 模型权重缓存，多副本复用 | 推荐 |

### 4.2 Helm 安装

```bash
helm repo add llmaz https://inftyai.github.io/llmaz
helm repo update

helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
    --namespace cert-manager --create-namespace --set crds.enabled=true

helm install llmaz llmaz/llmaz \
    --namespace llmaz-system --create-namespace --wait

kubectl get pods -n llmaz-system
kubectl get crd | grep -E "models|openaiservers|backends"
```

### 4.3 模型缓存 PVC（避免每副本重复下载）

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: model-cache
spec:
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: 500Gi
```

### 4.4 运行时镜像与镜像源配置

```yaml
runtime:
  vllm:
    image: registry.cn-hangzhou.aliyuncs.com/myorg/vllm-openai
    tag: "v0.6.3"
  sglang:
    image: lmsysorg/sglang
    tag: "v0.3.5"
huggingface:
  endpoint: https://hf-mirror.com
```

```bash
helm upgrade llmaz llmaz/llmaz -n llmaz-system -f values.yaml
```

---

## 5. 快速开始

本节给出三个递进示例：(1) 从零部署一个 HuggingFace 模型并用 OpenAI API 调用（5.1–5.4）；(2) 把引擎从 vLLM 换成 SGLang——只改一个字段（5.5）；(3) 在基座模型上挂载 LoRA 适配器，多适配器共用一份权重（5.6）。全程五步：① helm install llmaz（§4.2）→ ② apply Model CRD → ③ apply OpenAIServer → ④ 暴露网关（port-forward / HTTPRoute）→ ⑤ curl `/v1/chat/completions`。

### 5.1 声明一个 Model

```yaml
apiVersion: inference.llmaz.io/v1alpha1
kind: Model
metadata:
  name: qwen2.5-7b-instruct
spec:
  source:
    family: Qwen2.5
    modelID: Qwen/Qwen2.5-7B-Instruct
    revision: "main"
  runtime:
    name: vllm
```

### 5.2 用 OpenAIServer 跑起来

```yaml
apiVersion: inference.llmaz.io/v1alpha1
kind: OpenAIServer
metadata:
  name: qwen-serving
spec:
  modelClaim:
    name: qwen2.5-7b-instruct
  replicas: 2
  containerSpec:
    resources:
      limits:
        nvidia.com/gpu: "1"
    args:
      - --tensor-parallel-size=1
      - --gpu-memory-utilization=0.9
      - --max-model-len=8192
  storage:
    pvcName: model-cache
```

### 5.3 应用并调用

```bash
kubectl apply -f model.yaml -f openaiserver.yaml
kubectl wait openserver/qwen-serving --for=condition=Available --timeout=10m
kubectl port-forward service/qwen-serving 8000:80

curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5-7b-instruct",
    "messages": [{"role": "user", "content": "用一句话解释 Kubernetes 是什么"}],
    "temperature": 0.7
  }'
```

### 5.4 端到端流程

```
apply Model        → controller 注册模型制品（不拉权重）
apply OpenAIServer → 渲染 Deployment → initContainer 下载权重到 PVC（首次）→ Pod 启动 vLLM 加载
Available=True     → OpenAI Gateway 就绪
curl /v1/chat      → Gateway 路由到 Pod → 返回 JSON
```

### 5.5 示例 2: 一键切换引擎 vLLM → SGLang

模型权重不变，只把 `runtime.name` 从 `vllm` 改成 `sglang`，webhook 自动换上 SGLang 镜像与启动模板（Model + 部署一并 apply）：

```yaml
apiVersion: inference.llmaz.io/v1alpha1
kind: Model
metadata: { name: qwen2.5-7b-sglang }
spec:
  source: { family: Qwen2.5, modelID: Qwen/Qwen2.5-7B-Instruct }
  runtime: { name: sglang }          # 仅此一处: vllm → sglang
---
apiVersion: inference.llmaz.io/v1alpha1
kind: OpenAIServer
metadata: { name: qwen-sglang }
spec:
  modelClaim: { name: qwen2.5-7b-sglang }
  replicas: 2
  containerSpec:
    resources: { limits: { nvidia.com/gpu: "1" } }
    args: [--tensor-parallel-size=1, --mem-fraction-static=0.88]
```

```bash
kubectl apply -f sglang.yaml
curl http://localhost:8000/v1/chat/completions -d '{"model":"qwen2.5-7b-sglang","messages":[{"role":"user","content":"hi"}]}'
```

要点：仅 `runtime.name` 一处变更；权重已在 PVC 缓存，切换引擎无需重新下载；SGLang 的 RadixAttention 在多轮 / 结构化输出场景吞吐优势明显（见 [[10_部署推理/02_Inference_Engines/SGLang_Deep_Dive]]）。

### 5.6 示例 3: 部署 LoRA 适配器（多适配器共用基座）

基座不变，借 vLLM 的 LoRA 能力在一个 Pod 内同时服务多个适配器，OpenAI 请求的 `model` 字段选基座或适配器：

```yaml
apiVersion: inference.llmaz.io/v1alpha1
kind: Model
metadata: { name: qwen2.5-7b-lora }
spec:
  source: { family: Qwen2.5, modelID: Qwen/Qwen2.5-7B-Instruct }
  runtime:
    name: vllm
    args: [--enable-lora, --max-loras=4, --max-lora-rank=64, --lora-modules, legal-lora=/models/legal-lora, code-lora=/models/code-lora]
---
apiVersion: inference.llmaz.io/v1alpha1
kind: OpenAIServer
metadata: { name: qwen-lora }
spec:
  modelClaim: { name: qwen2.5-7b-lora }
  replicas: 1
  containerSpec:
    resources: { limits: { nvidia.com/gpu: "1" } }
  storage: { pvcName: model-cache }
```

```bash
# model 字段填基座名(qwen2.5-7b-lora)→基座；填 adapter 名(legal-lora)→该适配器
curl http://localhost:8000/v1/chat/completions -d '{"model":"legal-lora","messages":[{"role":"user","content":"起草租赁合同要点"}]}'
```

要点：`--enable-lora` 开启多 LoRA，`--lora-modules` 注册 `name→path` 映射（adapter 权重预先放入 PVC）；客户端只改 `model` 字段即可在基座与各适配器间切换，无需为每个适配器起独立副本。

---

## 6. 生产配置

### 6.1 运行时引擎对比（llmaz 内置）

| 引擎 | 适用场景 | 优势 | 注意点 |
|------|----------|------|--------|
| **vLLM** | 通用高吞吐、首选项 | PagedAttention、社区最大、特性最全 | 显存占用较高 |
| **SGLang** | 多轮 / 结构化输出 | RadixAttention 复用前缀极快 | 生态略小 |
| **TGI** | HuggingFace 生态深度用户 | 与 HF 模型卡深度集成 | 吞吐略逊 vLLM |
| **Ollama** | 边缘 / 小模型 / CPU | 部署最简单、量化方案成熟 | 大模型性能弱 |
| **TensorRT-LLM** | NVIDIA 极致延迟 | 单卡延迟最低、企业级 | 编译复杂、绑定 NVIDIA |

选型细节见 [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide]]。

### 6.2 模型来源、镜像加速与量化

```yaml
spec:
  source:
    family: Llama3.1
    modelID: meta-llama/Llama-3.1-8B-Instruct
    revision: "8b/inst"
    secretRef: hf-token        # 私有模型需要 HF token
    quantization: awq          # Qwen2.5-7B-Instruct-AWQ 等量化变体
  runtime:
    name: vllm
    args: ["--quantization=awq", "--enforce-eager"]
```

```bash
kubectl create secret generic hf-token --from-literal=HF_TOKEN=hf_xxxxxx
helm upgrade llmaz llmaz/llmaz -n llmaz-system \
  --set huggingface.endpoint=https://hf-mirror.com     # 国内拉权重走镜像
```

### 6.3 资源规划参考

| 模型规模 | 量化 | 单卡显存 | 推荐卡型 | 副本建议 |
|----------|------|----------|----------|----------|
| 7B | fp16 | ~15 GB | A10 / 4090 | 2-4 |
| 7B | AWQ/INT4 | ~5 GB | 4090 / L4 | 2-8 |
| 70B | GPTQ/AWQ | ~40 GB | A100-80G | 2-4 (TP=2) |
| 70B | fp16 | ~140 GB | H100 ×4 | 2 (TP=4) |

### 6.4 InferencePool 智能路由

```yaml
apiVersion: inference.networking.x-k8s.io/v1alpha2
kind: InferencePool
metadata:
  name: qwen-pool
spec:
  targetPorts:
    - number: 8000
  selector:
    llmaz.io/model: qwen2.5-7b-instruct
  endpointPickerConfig:
    dispatchers:
      - name: prefix-cache
        criticality: standard
```

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: qwen-route
spec:
  parentRefs:
    - name: my-gateway
  hostnames: ["llm.example.com"]
  rules:
    - matches:
        - path: { type: PathPrefix, value: /v1 }
      backendRefs:
        - group: inference.networking.x-k8s.io
          kind: InferencePool
          name: qwen-pool
```

### 6.5 模型灰度发布（Canary）

```yaml
spec:
  modelClaim: { name: qwen2.5-7b-instruct-v2 }
  replicas: 1
  rollout: { strategy: Canary, trafficWeight: 10 }
```

流量按权重切到 v1（90%）与 v2（10%），观察指标后逐步提升。

---

## 7. 运维与可观测

### 7.1 Status Conditions

```bash
kubectl describe openserver qwen-serving
```

```
Status:
  Conditions:
    Type            Status   Reason
    ModelsReady     True     ModelLoaded
    Progressing     False    NewReplicaSetAvailable
    Available       True     MinReplicasAvailable
  Replicas:         2 / ReadyReplicas: 2
  URL:              http://qwen-serving.default.svc:80
```

| Condition | 含义 | 排查方向 |
|-----------|------|----------|
| `ModelsReady=False` | 权重未加载完成 | initContainer 日志、PVC 容量、HF 下载 |
| `Progressing=True` | 滚动更新中 | 新 Pod 启动失败 / 镜像拉取 |
| `Available=False` | 副本未达就绪 | runtime 启动错误 / GPU 不足 |

### 7.2 指标采集

llmaz 透传底层引擎（vLLM/SGLang）的 Prometheus 指标：

```
vllm:num_requests_running          当前运行请求数
vllm:num_requests_waiting          排队请求数（反映背压）
vllm:gpu_cache_usage_perc          KV cache 占用率
vllm:time_to_first_token_seconds   TTFT
vllm:time_per_output_token_seconds 单 token 延迟
vllm:e2e_request_latency_seconds   端到端延迟
```

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: qwen-metrics
spec:
  selector:
    matchLabels:
      llmaz.io/openaiserver: qwen-serving
  endpoints:
    - port: http
      path: /metrics
      interval: 15s
```

### 7.3 模型加载耗时参考（单 A100-80G）

| 模型 | 从 PVC 缓存命中 | 首次远程拉取 |
|------|-----------------|--------------|
| 7B fp16 | < 10 s | 30-60 s |
| 7B AWQ | < 8 s | 20-40 s |
| 70B AWQ | 30-60 s | 3-5 min |
| 70B fp16 (TP=4) | 1-2 min | 6-10 min |

加载缓慢通常是 PVC 带宽瓶颈或首次远程拉取，建议用 ReadWriteMany + 高带宽存储。

### 7.4 常见故障排查

| 症状 | 可能原因 | 排查命令 |
|------|----------|----------|
| Pod CrashLoopBackOff | 引擎与模型不匹配（量化方案错） | `kubectl logs <pod> -c runtime` |
| initContainer 失败 | HF 网络不通 / token 过期 / 镜像源慢 | `kubectl logs <pod> -c model-downloader` |
| GPU 显存 OOM | `gpu-memory-utilization` 过高或并发过大 | 降低该值或减 `--max-num-seqs` |
| 卡在 Pending | 无 GPU 节点 / 节点选择器太严 | `kubectl describe pod` 看 events |
| 延迟抖动 | prefix cache 未命中 / InferencePool 未启用 | 检查 HTTPRoute 是否指向 InferencePool |
| 卡在 `ModelsReady=False` | 权重损坏 / revision 不存在 | 校验 `revision` 与 `modelID` |

### 7.5 升级

```bash
kubectl get model,openserver,backend -A -o yaml > llmaz-backup.yaml
helm repo update
helm upgrade llmaz llmaz/llmaz -n llmaz-system --version <new>
helm upgrade llmaz llmaz/llmaz -n llmaz-system -f values.yaml  # 升级引擎镜像
kubectl rollout restart openserver qwen-serving                 # 滚动重启
```

升级前务必查看 release notes，CRD 版本（v1alpha1）变更有破坏性升级风险。

---

## 8. 对比与选择

### 8.1 llmaz vs KServe vs KAITO vs llm-d

| 维度 | llmaz | KServe | KAITO | llm-d |
|------|-------|--------|-------|-------|
| **设计哲学** | 易用优先 | 通用推理平台 | 一键开箱 | 高级调度、disaggregated |
| **核心抽象** | Model CRD | InferenceService | workspace | distributed orchestrator |
| **运行时** | 多引擎可插拔 | 任意（vLLM/TGI...） | 内置预设 | vLLM 系 |
| **学习曲线** | 低 | 中-高 | 低 | 高 |
| **InferencePool** | 原生接入 | 支持 | 部分 | 原生 |
| **多模型共存** | 强（Model 复用） | 强 | 一般 | 强 |
| **缩到 0** | 支持 | 支持 | 支持 | 支持 |
| **成熟度** | 上升期 | 高（孵化） | 高（GA） | 新兴 |

### 8.2 何时选 llmaz

```
选 llmaz:
✓ 中小团队，想用 K8s 跑 LLM 但不想学 KServe 的全部抽象
✓ 需要在同一集群管理多模型 / 多版本 / 多量化方案
✓ 重视 prefix-cache 路由，希望用 Gateway API InferencePool
✓ 想要 OpenAI 兼容网关但不想自己写 Envoy 配置

不选 llmaz:
✗ 需要 KServe 的完整推理协议（gRPC / 自定义 predictor）
✗ 超大规模 prefill/decode 分离 → 用 llm-d
✗ 不在 K8s 上（裸机 / 边缘）→ 用 vLLM / Ollama 直接跑
```

---

## 9. 常见问题 FAQ

**Q1: llmaz 与裸跑 vLLM Deployment 相比多了什么？**
A: 模型声明复用（Model CRD）、自动 OpenAI 网关、InferencePool 智能路由、灰度发布、统一多引擎切换。代价是引入一层 controller。

**Q2: 必须有 GPU 吗？**
A: NVIDIA GPU 是默认路径（需 GPU Operator）。Ollama 运行时可跑 CPU，但生产场景仍建议 GPU。

**Q3: 模型权重必须从 HuggingFace 拉吗？**
A: 不是。可通过 `huggingface.endpoint` 指向内部镜像（hf-mirror.com / ModelScope），也可预先把权重放进 PVC 跳过下载。

**Q4: 一个 OpenAIServer 能服务多个模型吗？**
A: 一个 OpenAIServer 对应一个 Model（保持简单）。多模型共存用多个 OpenAIServer，通过统一网关聚合。

**Q5: InferencePool 不装能用吗？**
A: 能用，路由退化为普通 Service 轮询，失去 prefix-cache 亲和性。生产建议安装。

**Q6: llmaz 是 CNCF 项目吗？**
A: 截至 2026-06，llmaz 已进入 CNCF Landscape（Inference 分类），由 InftyAI 维护，尚未进入 Sandbox/Incubating 毕业流程。

---

## Related

- [[05_CNCF_Cloud_Native_AI/README]] — CNCF 云原生 LLM 项目全景
- [[05_CNCF_Cloud_Native_AI/KServe_Deep_Dive]] — 同类推理平台，更通用但更复杂
- [[05_CNCF_Cloud_Native_AI/KAITO_Deep_Dive]] — 微软出品的一键式 K8s 推理
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive]] — llmaz 默认运行时引擎
- [[10_部署推理/02_Inference_Engines/SGLang_Deep_Dive]] — llmaz 可选运行时，前缀缓存更强
