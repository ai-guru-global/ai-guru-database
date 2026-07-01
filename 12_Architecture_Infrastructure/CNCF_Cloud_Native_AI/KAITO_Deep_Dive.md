---
title: "KAITO (Kubernetes AI Toolchain Operator) 深度解析"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "inference", "kaito", "llm", "rag"]
summary: "> **一句话理解**: KAITO 让你用一行 preset 名字（如 mistral-7b-instruct）就能在 K8s 上拉起一个大模型推理服务——自动选 GPU、自动配 vLLM/TGI、自动暴露 API，是 LLM on K8s 最快的'开箱即用'方案。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Kaito Deep Dive"
  - "KAITO Deep Dive"
  - KAITO_Deep_Dive

---
# KAITO (Kubernetes AI Toolchain Operator) 深度解析

> **一句话理解**: KAITO 让你用一行 preset 名字（如 mistral-7b-instruct）就能在 K8s 上拉起一个大模型推理服务——自动选 GPU、自动配 vLLM/TGI、自动暴露 API，是 LLM on K8s 最快的"开箱即用"方案。

> 📐 **概念方法论**: KAITO 把"在 K8s 上跑大模型"这件事从「写 Deployment + 选镜像 + 调 GPU + 配 vLLM 参数 + 暴露服务」压缩成一个 **preset 名字**。它解决的不是"如何更快地推理"（那是 vLLM/TGI 的事），而是"如何更快地把推理服务部署起来"。与 [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]] 的"通用推理平台"定位不同，KAITO 更像 LLM 时代的 **Helm Chart + GPU Autoscaler 合体**；选型时可参考 [[10_Deployment_Inference/Inference_Engines/LLM_Inference_Engine_Selection_Guide]]。

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

KAITO（Kubernetes AI Toolchain Operator）是微软开源、捐赠给 CNCF Sandbox 的一个 K8s Operator，目标只有一个：**让大模型推理 / 微调 / RAG 工作负载在 Kubernetes 上的部署成本接近于零**。

```
┌────────────────────────────────────────────────────────────────┐
│                       用户的心智负担                            │
├────────────────────────────────────────────────────────────────┤
│  裸 K8s 跑 LLM:                                                │
│    写 Deployment → 选基础镜像 → 装 vLLM/TGI → 挂 GPU →          │
│    配显存 → 拉 30GB 权重 → 调端口 → 建 Service → 等节点…        │
│                                                                │
│  KAITO:                                                        │
│    apiVersion: kaito.sh/v1beta1                                │
│    kind: Workspace                                             │
│    preset:                                                      │
│      name: mistral-7b-instruct   ← 一行解决上面所有事           │
└────────────────────────────────────────────────────────────────┘
```

一句话：**KAITO = LLM 预设（preset）+ GPU 节点自动供给 + 推理运行时（vLLM/TGI）自动装配**。

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| 模型 Preset 体系 | 内置 Falcon / Llama2/3 / Mistral / Phi / Qwen / DeepSeek 等主流模型的预调模板，无需手写容器编排 |
| GPU 节点自动供给 | 集成云厂商 autoscaler（AKS 优先），GPU 节点缺失时自动创建；本地集群则使用现有 GPU 节点 |
| 双推理运行时 | 支持 `text-generation-inference` (TGI) 与 `vllm`，通过 preset 或 `inferenceProtocol` 切换 |
| 一等公民 RAG | `RAGEngine` CRD 封装 embedding + 向量库 + LLM，做文档问答开箱即用 |
| 内置微调 | Workspace 支持 tuning preset（QLoRA），简化微调作业 |
| Service 自动暴露 | 自动创建 LoadBalancer / ClusterIP Service，对齐 OpenAI 兼容 API |
| 镜像预打包 | 模型权重预装在镜像中，规避运行时从 HuggingFace 拉权重带来的网络/超时问题 |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 | 说明 |
|------|------|------|
| 2023-11 | 项目开源 | 微软内部 GPU-on-K8s 工具链脱敏开源 |
| 2024-Q1 | CNCF Sandbox 接纳 | 作为 Sandbox 项目进入 CNCF 生态 |
| v0.2 (2024) | Workspace CRD GA | preset 体系成型 |
| v0.3 (2024) | 引入 vLLM preset | 在 TGI 之外新增 vLLM 作为运行时 |
| v0.4 (2024-2025) | RAGEngine 增强 | 向量库、embedding 模型可选化 |
| v0.5+ (2025-2026) | 多副本、tuning 增强 | 走向生产可用 |

> 仓库：<https://github.com/kaito-project/kaito> ｜ License: Apache-2.0 ｜ 主要维护方: Microsoft / Azure 团队

---

## 2. 核心概念

### 2.1 四个关键名词

| 概念 | 是什么 | 类比 |
|------|--------|------|
| **Workspace** | 核心 CRD。声明"我要跑哪个 preset、用多少 GPU、要不要调优"，KAITO 据此完成节点供给 + 工作负载创建 | K8s 的 Deployment + NodePool 二合一 |
| **RAGEngine** | RAG 专用 CRD。声明数据源 + embedding 模型 + LLM Workspace 引用，自动拼出检索增强问答管线 | "向量化 + 召回 + 生成"的一键流水线 |
| **Preset** | 预置模型模板。包含：模型镜像、推理运行时（vLLM/TGI）、默认 GPU 数、显存需求、启动命令 | Helm Chart 的 values preset |
| **Resource** | GPU 节点需求声明。指定 `preferredNodes` / `nodeSelector` / GPU 型号与数量 | K8s 的 NodeAffinity + 资源 request |

### 2.2 Preset → 推理服务 的解析链路

```
                    用户提交 Workspace YAML
                              │
                              ▼
              ┌───────────────────────────────┐
              │  preset.name: mistral-7b      │   ← 一个名字
              │  resource.count: 1 (GPU)      │
              └───────────────┬───────────────┘
                              │ KAITO Controller 解析
                              ▼
        ┌─────────────────────────────────────────────┐
        │  preset 模板查表                              │
        │   ├─ 镜像: mcr.microsoft.com/.../mistral-7b  │
        │   ├─ 运行时: vllm (or TGI)                   │
        │   ├─ 默认 GPU 数 / 显存                       │
        │   └─ 端口 / 启动命令 / 环境变量               │
        └────────────────────┬────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌────────────┐
        │ GPU Node │   │Deployment│   │  Service   │
        │ 供给/调度 │   │ (Pod×N)  │   │LoadBalancer│
        └──────────┘   └──────────┘   └────────────┘
                             │
                             ▼
                  OpenAI 兼容 /v1/chat/completions
```

关键洞察：**preset 的本质是一张「模型 → 运维参数」的查表**。用户不需要懂 vLLM 的 `--tensor-parallel-size`、不需要懂 GPU 显存换算，KAITO 团队把这些经验值固化在 preset 里。

### 2.3 CRD 字段速查

| CRD | 关键字段 | 取值 / 类型 | 作用 |
|-----|---------|-----------|------|
| Workspace | `resource.count` / `preferredNodes` | int / []string | GPU 节点数 / 偏好节点 |
| Workspace | `resource.instanceType` | string | GPU SKU（云端） |
| Workspace | `inference.preset.name` | string | 模型预设名 |
| Workspace | `inference.inferenceProtocol` | `vllm` / `tgi` | 推理运行时 |
| Workspace | `accessMode` / `imagePullSecrets` | LB / ClusterIP | Service 类型 / 私有仓库认证 |
| Workspace | `tuning.preset.name` / `method` | string / `qlora` | 微调预设与方法 |
| RAGEngine | `embedding.local.modelPath` | string | embedding 模型 |
| RAGEngine | `vectorStore.local` / `llm.workspaceRef.name` | object / string | 向量库 / 关联 Workspace |

### 2.4 Preset 解析的端到端数据流

```
mistral-7b-instruct            ← 用户只写这一行
      │ Controller 查 preset 注册表 → 得到镜像 + 运行时参数
      ▼
mcr.microsoft.com/aks/kaito/mistral-7b-instruct:0.0.7  (权重预装)
      │ 渲染: vllm serve --tensor-parallel-size 1 --port 5000
      ▼ 生成 Deployment(gpu=1) + Service(LB→5000)，/health 就绪
POST http://<lb>/v1/chat/completions
```

一个 preset 名字驱动了「镜像选型 → 运行时参数 → K8s 对象 → API 形态」全链路——这是 KAITO 把 LLM on K8s 压缩到极致的核心机制。

---

## 3. 架构设计

### 3.1 Controller 架构

```
                    ┌──────────────────────────────────┐
                    │       KAITO Controller Manager    │
                    │   (Deployment, 2 副本 leader)     │
                    │                                   │
                    │  ┌─────────────┐ ┌──────────────┐│
                    │  │ Workspace   │ │ RAGEngine    ││
                    │  │ Controller  │ │ Controller   ││
                    │  └──────┬──────┘ └──────┬───────┘│
                    │         │               │        │
                    │  ┌──────▼───────────────▼──────┐ │
                    │  │   GPU Provisioning 子模块   │ │
                    │  │  (autoscaler / nodeClaim)   │ │
                    │  └─────────────────────────────┘ │
                    └──────────┬───────────┬───────────┘
                               │           │
                watch/reconcile│           │create
                               ▼           ▼
   ┌────────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
   │ Workspace CR   │  │ Deployment │  │  Service   │  │  Node /    │
   │ RAGEngine CR   │  │  (Pod)     │  │ (LB/ClIP)  │  │  NodePool  │
   └────────────────┘  └────────────┘  └────────────┘  └────────────┘
                                                   ▲
                                                   │
                                          ┌────────┴────────┐
                                          │ 云 autoscaler   │
                                          │ (AKS / karpenter│
                                          │  / Cluster API) │
                                          └─────────────────┘
```

KAITO Controller 由两个核心 reconciler 组成：
- **Workspace Controller**：负责 preset 解析、Deployment/Service 创建、节点匹配。
- **RAGEngine Controller**：负责 RAG 管线编排（embedding service、向量库、向 LLM Workspace 的引用）。

二者都通过 **GPU Provisioning 子模块** 与底层节点供给交互。

### 3.2 节点自动供给流程

```
1. 用户 apply Workspace (preset=falcon-7b, GPU=1)
              │
              ▼
2. Controller 查找集群中是否已有满足 SKU 的 GPU 节点
              │
        ┌─────┴──────┐
        │            │
   已有节点       缺节点
        │            │
        ▼            ▼
   直接调度     触发 autoscaler
                  │
        ┌─────────┼──────────┐
        ▼         ▼          ▼
      AKS       Karpenter   Cluster API
   (NodePool)  (NodeClaim)  (Machine)
                  │
                  ▼
3. 新 GPU 节点 Ready → Controller 调度 Pod
                  │
                  ▼
4. Pod 拉起 preset 镜像（权重已预装）
                  │
                  ▼
5. Service 就绪，Workspace.Status.WorkspaceReady = True
```

**云端（AKS 等）**：KAITO 直接调云 API/CRD 创建 GPU 节点池；**本地集群**：KAITO 假设你已经有一批带 GPU 的节点，仅做匹配与调度，不会"凭空"造出 GPU。

### 3.3 Preset 模板如何被渲染

```
Workspace.Spec.Resource       ──┐
Workspace.Spec.Preset.Name    ──┤
Workspace.Spec.InferenceProtocol ┤──→  渲染引擎  ──→  Deployment YAML
Workspace.Spec.AccessMode     ──┤                   (containers[0].image,
                                   │                    resources, env, ports)
Preset 内置模板（硬编码在      ──┘                   + Service YAML
kaitoworkspacepreset 中）                            (type: LoadBalancer)
```

渲染逻辑不是 Helm，而是 **Go 代码中的 preset 注册表**，因此升级 KAITO 版本即等于升级 preset 列表（新增模型 / 修 bug）。

---

## 4. 安装部署

### 4.1 前置条件

| 项 | 要求 |
|----|------|
| Kubernetes | ≥ 1.27 |
| GPU 节点 | NVIDIA GPU + 已安装 [NVIDIA GPU Operator](https://github.com/NVIDIA/gpu-operator) |
| 集群 autoscaler | 云端：AKS Cluster Autoscaler / Karpenter；本地：现有 GPU 节点 |
| RBAC | cluster-admin 安装 CRD |
| 网络 | 能访问 `mcr.microsoft.com`（preset 镜像仓库）|

### 4.2 Helm 安装（推荐）

```bash
helm repo add kaito https://azure.github.io/kaito/charts
helm repo update

helm install kaito kaito/kaito \
  --namespace kaito-workspace \
  --create-namespace \
  --set provider.clusterAutoscaler=true
```

### 4.3 纯 YAML 安装

```bash
kubectl apply -f https://github.com/kaito-project/kaito/releases/latest/download/kaito-workspace.yaml
kubectl apply -f https://github.com/kaito-project/kaito/releases/latest/download/kaito-ragengine.yaml
```

### 4.4 GPU 节点准备

```bash
# 安装 NVIDIA GPU Operator（若未安装）
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm install gpu-operator nvidia/gpu-operator \
  --namespace gpu-operator \
  --create-namespace

# 验证节点可识别 GPU
kubectl get nodes "-o=custom-columns=NAME:.metadata.name,GPU:.status.allocatable.nvidia\.com/gpu"
```

### 4.5 Preset 镜像清单（节选）

| Preset 名称 | 模型 | 默认运行时 | 最小 GPU |
|-------------|------|-----------|----------|
| `phi-3-mini-128k-instruct` | Phi-3 Mini 128K | vLLM | 1× A10 / T4 |
| `phi-3.5-mini-instruct` | Phi-3.5 Mini | vLLM | 1× A10 |
| `mistral-7b-instruct` | Mistral 7B Instruct | vLLM / TGI | 1× A10 / 2× T4 |
| `falcon-7b-instruct` | Falcon 7B | TGI | 1× A10 |
| `llama-2-7b-chat` / `llama-3-8b-instruct` | Llama 系列 | vLLM | 1× A10 |
| `llama-3.1-70b-instruct` | Llama 3.1 70B | vLLM | 2× A100 80G |
| `qwen2.5-7b-instruct` | Qwen 2.5 | vLLM | 1× A10 |
| `deepseek-v3` | DeepSeek V3 | vLLM | 8× A100 |

> 完整清单见仓库 `presets` 目录；KAITO 镜像托管在 `mcr.microsoft.com/aks/kaito/`。

### 4.6 云端 vs 本地的差异

| 维度 | 云端（AKS 等） | 本地集群 |
|------|---------------|----------|
| 节点供给 | KAITO 调 autoscaler 自动扩 | 必须预先存在 GPU 节点 |
| 镜像拉取 | `mcr.microsoft.com` 公网直拉 | 需打通内网镜像仓库或预加载 |
| LoadBalancer | 云厂商 LB 自动分配 | 通常需 MetalLB / ingress |
| 成本 | 按需 GPU，可自动缩容到 0 | 固定资产，重在利用率 |

---

## 5. 快速开始

### 5.1 一键起一个 Phi-3 推理服务

```yaml
# workspace-phi3.yaml
apiVersion: kaito.sh/v1beta1
kind: Workspace
metadata:
  name: workspace-phi-3-mini
spec:
  resource:
    count: 1
    instanceType: "Standard_NC6s_v3"
    labelSelector:
      matchLabels:
        apps: phi-3
  inference:
    preset:
      name: phi-3-mini-128k-instruct
    preferredNodes:
      - gpu-node-0
```

```bash
kubectl apply -f workspace-phi3.yaml

# 观察 Workspace 状态
kubectl get workspace workspace-phi-3-mini -w
# NAME                     WORKSPACEREADY   AGE
# workspace-phi-3-mini     True             4m

# 找到自动创建的 Service
kubectl get svc -l kaito.sh/workspace=workspace-phi-3-mini
# TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)
# LoadBalancer   10.0.123.45    20.87.xx.xx      80/TCP
```

### 5.2 本地测试（port-forward）

```bash
# 拿到推理 Service 名
SVC=$(kubectl get svc -l kaito.sh/workspace=workspace-phi-3-mini \
      -o jsonpath='{.items[0].metadata.name}')

kubectl port-forward svc/$SVC 8080:80 &
```

### 5.3 OpenAI 兼容 API 调用

```bash
curl -s http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "phi-3",
    "messages": [
      {"role": "user", "content": "用一句话解释 Kubernetes Operator 模式"}
    ],
    "temperature": 0.7
  }' | jq .
```

> preset 镜像里的 vLLM/TGI 已默认开启 OpenAI 兼容路由，无需额外配置。

### 5.4 起一个 RAGEngine（文档问答）

```yaml
# rag-docs.yaml
apiVersion: kaito.sh/v1beta1
kind: RAGEngine
metadata:
  name: my-rag
spec:
  embedding:
    local:
      modelPath: "BAAI/bge-small-en-v1.5"
  vectorStore:
    local:
      modelPath: ""
  llm:
    workspaceRef:
      name: workspace-phi-3-mini     # 引用上面的 Workspace
  knowledgeBase:
    - name: "docs"
      source:
        collection: "my-docs"        # 文档来源（详见 v0.4+ 文档）
```

```bash
kubectl apply -f rag-docs.yaml
kubectl get ragengine my-rag -w
```

### 5.5 微调（QLoRA preset）

```yaml
# tuning.yaml
apiVersion: kaito.sh/v1beta1
kind: Workspace
metadata:
  name: workspace-tune
spec:
  resource:
    count: 1
    instanceType: "Standard_NC24ads_A100_v4"
  tuning:
    preset:
      name: phi-3-mini-128k-instruct
    method: qlora
    input:
      urls:
        - "https://example.com/train.jsonl"
    output:
      image: "myregistry.azurecr.io/phi-3-tuned:latest"
```

---

## 6. 生产配置

### 6.1 Preset 选型矩阵

| 业务规模 | 模型示例 | 推荐 preset | GPU 配置 | 适用场景 |
|---------|---------|------------|---------|---------|
| 轻量 / 边缘 | Phi-3.5 Mini 3.8B | `phi-3.5-mini-instruct` | 1× T4 / A10 | 聊天助手、低成本 PoC |
| 通用 | Mistral 7B / Qwen 7B | `mistral-7b-instruct` / `qwen2.5-7b-instruct` | 1× A10 | 中等质量对话、RAG |
| 高质量 | Llama 3 70B | `llama-3.1-70b-instruct` | 2-4× A100 80G | 企业级生产 |
| 超大 | DeepSeek V3 | `deepseek-v3` | 8× A100 / H100 | 复杂推理 |

### 6.2 关键 Spec 字段

```yaml
spec:
  resource:
    count: 2                              # GPU 副本数
    instanceType: "Standard_NC24ads_A100_v4"
    labelSelector:
      matchLabels:
        workload: llm
  inference:
    preset:
      name: mistral-7b-instruct
    inferenceProtocol: vllm               # vllm | tgi
    preferredNodes:                       # 优先调度节点
      - gpu-node-a
  accessMode: LoadBalancer                # LoadBalancer | ClusterIP
```

### 6.3 inferenceProtocol 选择

| 协议 | 何时用 |
|------|-------|
| `vllm` | 默认推荐；吞吐高、OpenAI API 兼容好、PagedAttention |
| `tgi`  | 兼容 HuggingFace 生态，旧版 preset 默认 |

### 6.4 accessMode 选择

| 模式 | 用途 |
|------|------|
| `LoadBalancer` | 对外暴露；云端生产首选 |
| `ClusterIP`    | 仅集群内访问；后端接 API Gateway 时使用 |

### 6.5 多副本与高可用

```yaml
spec:
  resource:
    count: 2                              # 跨 2 节点
  inference:
    preset:
      name: llama-3-8b-instruct
    preferredNodes:
      - gpu-node-a
      - gpu-node-b
```

> 注意：KAITO 的多副本本质是"多节点跑同一模型"，**不做 KV Cache 共享**（vLLM 的分布式推理由 tensor-parallel 单 Pod 内实现）。横向扩容靠前置 LB 轮询。

### 6.6 健康检查与就绪探针

KAITO 自动生成 readiness/liveness probe（指向 `/health`），无需手写。若自定义 preset 模板，请保留该端点。

### 6.7 资源与配额

- 建议为 LLM 工作负载建独立 Namespace 并设 `ResourceQuota`（按 `nvidia.com/gpu`）。
- 模型权重镜像通常 10-50 GB，确保节点磁盘 ≥ 200 GB，或使用缓存型镜像仓库（如 ACR、Harbor P2P）。

### 6.8 参数参考总表

| 参数 | 位置 | 默认 / 取值 | 说明 |
|------|------|-----------|------|
| `inference.preset.name` | Workspace.spec | 必填 | 决定模型镜像 / 运行时 / 默认 GPU 数 |
| `inference.inferenceProtocol` | Workspace.spec | `vllm` | `vllm` 或 `tgi`，切换推理运行时 |
| `resource.count` | Workspace.spec | 必填 | GPU 节点数（多副本 = 多节点） |
| `resource.instanceType` | Workspace.spec | - | 云端 GPU SKU 模板 |
| `resource.preferredNodes` | Workspace.spec | - | 调度偏好节点名列表 |
| `resource.labelSelector` | Workspace.spec | - | 节点 label 匹配 |
| `accessMode` | Workspace.spec | `LoadBalancer` | Service 类型（LB / ClusterIP） |
| `imagePullSecrets` | Workspace.spec | - | 私有镜像仓库认证 |
| readinessProbe | 自动生成 | `/health` | 自定义 preset 须保留该端点 |
| `nodeSelector` / `tolerations` | 渲染注入 | - | 节点亲和 / 容忍 GPU 污点 |
| 云端 / 本地节点供给 | 集群 autoscaler | AKS / Karpenter | 云端自动扩，本地仅匹配现有 GPU |
| `tuning.preset.name` / `method` | Workspace.spec.tuning | - / `qlora` | 微调模型与方法 |
| RAG `vectorStore.local` | RAGEngine.spec | 内置 | 向量库，可换 Milvus / Weaviate |
| RAG `embedding.local.modelPath` | RAGEngine.spec | bge-small | embedding 模型路径 |

### 6.9 生产 YAML：多副本 + 私有镜像仓库 + GPU SKU

```yaml
apiVersion: kaito.sh/v1beta1
kind: Workspace
metadata:
  name: workspace-llama3-70b-prod
spec:
  resource:
    count: 2
    instanceType: "Standard_NC24ads_A100_v4"
  inference:
    preset:
      name: llama-3.1-70b-instruct
    inferenceProtocol: vllm
  accessMode: LoadBalancer
  imagePullSecrets:
    - name: acr-registry-secret
```

```bash
az acr import -n myreg --source mcr.microsoft.com/aks/kaito/llama-3.1-70b-instruct:0.0.7 \
  --image llama-3.1-70b-instruct:0.0.7
```

### 6.10 按模型规模的 Preset 选型指南

| 参数规模 | 显存需求 | 推荐 preset | 推荐 GPU | 场景 |
|---------|---------|------------|---------|------|
| ≤ 4B | ~8 GB | `phi-3.5-mini-instruct` | 1× T4 / L4 | 边缘、低成本 PoC |
| 7-8B | ~16 GB | `mistral-7b-instruct` | 1× A10 | 通用首选、RAG |
| 13-14B | ~28 GB | `qwen2.5-14b-instruct` | 1× A100 40G | 中等质量对话 |
| 70B | ~140 GB | `llama-3.1-70b-instruct` | 2-4× A100 80G | 企业生产 |
| 671B (MoE) | ~1.1 TB | `deepseek-v3` | 8× H100 | 超大推理 |

> 选型口诀：先按参数量定显存 → 再定 GPU SKU 与 `count`；preset 名字直接对应一组经验证的 (GPU × N) 配置，无需手算 `--tensor-parallel-size`。

---

## 7. 运维与可观测

### 7.1 Workspace 状态查看

```bash
kubectl describe workspace workspace-phi-3-mini
```

关键 `conditions`：

| Condition | 含义 |
|-----------|------|
| `WorkspaceReady=True` | 整体就绪，可对外服务 |
| `ResourceProvisioned` | GPU 节点供给完成 |
| `WorkloadStarted` | Deployment / Pod 已起 |
| `InferenceServiceReady` | Service + 端点可用 |

### 7.2 GPU 利用率

```bash
# 依赖 NVIDIA DCGM Exporter
kubectl port-forward -n gpu-operator svc/dcgm-exporter 9400:9400 &
curl -s localhost:9400/metrics | grep DCGM_FI_DEV_GPU_UTIL
```

### 7.3 模型权重 / 镜像拉取进度

```bash
kubectl get events -n kaito-workspace --sort-by=.lastTimestamp
kubectl logs -n kaito-workspace -l app.kubernetes.io/name=kaito -f
```

### 7.4 常见错误与排查

| 现象 | 可能原因 | 解决 |
|------|---------|------|
| Workspace 一直 `ResourceProvisioned=False` | 无满足 SKU 的 GPU 节点；autoscaler 未启用 | 检查 instanceType、节点 label、autoscaler 参数 |
| `preset not found` | preset 名拼错 / KAITO 版本旧 | 升级 KAITO 到最新版，对照 preset 清单 |
| Pod `ImagePullBackOff` | 内网拉不到 `mcr.microsoft.com` | 配镜像同步或预拉 |
| `Insufficient nvidia.com/gpu` | GPU 已被占满 | 调小 `count` 或清理其它 GPU 工作负载 |
| OOM / 推理崩溃 | 显存不够（多见于 70B 模型） | 升级 GPU 型号或增加 `count` |
| Service 无 EXTERNAL-IP | 本地集群无 LB controller | 装 MetalLB 或改 ClusterIP + Ingress |

### 7.5 升级

```bash
helm repo update
helm upgrade kaito kaito/kaito -n kaito-workspace \
  --reuse-values --set image.tag=v0.4.0
```

> 升级会刷新 preset 列表，但**不会**自动滚动已有的 Workspace；如需应用新 preset 模板，需手动重建。

### 7.6 监控建议

- 用 ServiceMonitor 暴露 vLLM/TGI metrics 到 Prometheus。
- 关注指标：`vllm:num_requests_running`、`vllm:gpu_cache_usage_perc`、`vllm:e2e_request_latency_seconds`。
- 告警阈值：GPU 利用率持续 < 20% → 考虑缩容；KV Cache 占用 > 90% → 考虑扩容或减小 batch。

### 7.7 推理运行时指标参考

| 指标 | 来源 | 含义 | 告警建议 |
|------|------|------|---------|
| `vllm:num_requests_running` | vLLM | 正在生成的请求数 | 持续打满 → 扩容 |
| `vllm:num_requests_waiting` | vLLM | 排队请求数 | > 0 持续 5min → 扩容 |
| `vllm:gpu_cache_usage_perc` | vLLM | KV Cache 占用率（命中率） | > 90% → 减 batch / 扩容 |
| `vllm:e2e_request_latency_seconds` | vLLM | 端到端延迟 | P99 > SLA → 调优 |
| `tgi_request_throughput` | TGI | 生成 tok/s | 容量规划基准 |
| `DCGM_FI_DEV_GPU_UTIL` | DCGM | GPU SM 利用率 | < 20% → 缩容 |
| `DCGM_FI_DEV_FB_USED` | DCGM | 显存占用 | 接近上限 → OOM 风险 |

### 7.8 深度故障排查

| 现象 | 根因 | 诊断 | 修复 |
|------|------|------|------|
| Preset 镜像 30GB+ 拉取超时 | 公网带宽 / registry 限速 | `kubectl describe pod` 看 Pull 耗时 | 启用 Dragonfly P2P / ACR 地理复制 |
| 冷启动 5-10 分钟 | 权重镜像大 + GPU 初始化 | `kubectl logs --timestamps` | 预拉镜像 / 预热节点 |
| OOM（小 GPU 跑大模型） | 显存不足 | pod `OOMKilled` + `nvidia-smi` | 升级 GPU SKU 或加 `count` |
| 节点供给卡住 10min+ | autoscaler SKU 缺货 / 配额 | `kubectl get events` + 云控制台 | 换 `instanceType` / 提交配额申请 |
| `preset not found` | KAITO 版本旧 / 名拼错 | 对照 preset 清单 | 升级 KAITO / 修正名字 |
| Readiness probe 失败 | 启动慢 / 端口错 | `kubectl logs` + `curl :5000/health` | 调大 probe timeout / 查 preset |
| vLLM preset 切 TGI 后报错 | preset 仅支持单运行时 | 查 preset 文档 | 用对应运行时的 preset |
| 私有仓库 `ImagePullBackOff` | secret 未挂 / 域名错 | `kubectl get secret` + events | 配 `imagePullSecrets` + 验证凭证 |

### 7.9 离线 / 气隙部署（Preset 镜像预加载）

```bash
docker pull mcr.microsoft.com/aks/kaito/mistral-7b-instruct:0.0.7
docker save mistral-7b-instruct:0.0.7 | gzip > mistral-7b.tar.gz          # 传到气隙环境
gunzip -c mistral-7b.tar.gz | docker load
docker tag mistral-7b-instruct:0.0.7 harbor.internal/kaito/mistral-7b-instruct:0.0.7 && \
  docker push harbor.internal/kaito/mistral-7b-instruct:0.0.7
```

关键：preset 镜像须预先存在于本地 registry（Harbor / ACR 专线），节点 containerd 信任私有 CA；KAITO 的 preset 注册表逻辑不变，仅镜像来源切换。

---

## 8. 对比与选择

### 8.1 KAITO vs 同类项目

| 维度 | KAITO | KServe | llmaz | 裸 vLLM Deployment |
|------|-------|--------|-------|---------------------|
| 定位 | LLM 开箱即用 | 通用推理平台 | LLM 模型管理 | 自己写一切 |
| 安装成本 | ★（最低） | ★★★ | ★★ | ★★★★ |
| GPU 自动供给 | ✅ 内置 | ❌ | ⚠️ 部分 | ❌ |
| Preset 模板 | ✅ 核心 | ❌ | ✅ Model 同概念 | ❌ |
| 多运行时 | vLLM/TGI | 任意（ISVC） | vLLM 等 | 自选 |
| 弹性缩到 0 | ⚠️ 依赖 autoscaler | ✅（Knative） | ✅ | ❌ |
| RAG 一等公民 | ✅ RAGEngine | ❌ | ❌ | ❌ |
| 微调 | ✅ QLoRA preset | ❌ | ❌ | ❌ |
| 成熟度 | CNCF Sandbox | CNCF Incubating | CNCF Sandbox | GA |

### 8.2 何时选 KAITO

- ✅ **PoC / 快速验证**：想最快把一个开源 LLM 跑起来对外暴露 API。
- ✅ **AKS 用户**：节点供给链路最顺。
- ✅ **要 RAG 但不想拼管线**：RAGEngine 一把梭。
- ✅ **团队 K8s 经验有限**：preset 屏蔽了大量参数。

### 8.3 何时考虑其它

- 需要**多模型金丝雀 / 流量切分** → KServe InferenceService。
- 需要**模型版本化、P2P 权重分发** → llmaz。
- 需要**极致性能调优 / 自定义 batching** → 裸 vLLM + 自写 Operator。
- 需要**多租户 + API Gateway + 计费** → KServe + [[CNCF_Cloud_Native_AI/Envoy_AI_Gateway_Deep_Dive]]。

---

## 9. 常见问题 FAQ

**Q1: KAITO 只能在 AKS 上用吗？**
A: 不是。CRD 与 Controller 在任意 K8s 都能跑。只是"GPU 节点自动供给"这块在 AKS 上最顺滑；其它集群需自带 GPU 节点或自己接 Karpenter/Cluster API。

**Q2: preset 镜像里的权重能换吗？**
A: 不能直接换。preset 是固定的「模型权重 + 运行时」打包。如需自定模型，可用 `image` 字段指定自建镜像（需自己把权重 + vLLM 打进去），或走 tuning preset 微调后导出新镜像。

**Q3: 推理 Pod 启动很慢怎么办？**
A: 主要瓶颈是权重镜像（10-50GB）。建议：(1) 镜像仓库与集群同区；(2) 启用 ACR 加速 / Dragonfly P2P；(3) 用支持分层拉取的 containerd。

**Q4: KAITO 支持 K8s HPA 自动扩缩容吗？**
A: v0.4+ 支持基于自定义 metrics 的 HPA（vLLM/TGI 暴露了 Prometheus 指标）。但 KAITO 的强项是"扩 GPU 节点"，扩 Pod 副本仍需配合 HPA + Cluster Autoscaler。

**Q5: RAGEngine 支持哪些向量库？**
A: v0.4+ 内置本地向量库；企业部署可对接外部（如 Milvus / Weaviate），通过 `vectorStore` 字段配置。embedding 模型默认走 HuggingFace 本地推理。

**Q6: KAITO 适合多大规模的生产？**
A: 单租户 / 小集群（几个到十几个模型实例）非常合适。大规模多租户、需要复杂流量治理时，建议把 KAITO 作为"模型部署器"，前面叠 KServe 或 Envoy AI Gateway 做治理。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] — CNCF 云原生 LLM 项目全景
- [[CNCF_Cloud_Native_AI/KServe_Deep_Dive]] — 通用推理平台，KAITO 的互补项
- [[CNCF_Cloud_Native_AI/llmaz_Deep_Dive]] — 另一个 LLM 模型管理 Operator
- [[10_Deployment_Inference/Inference_Engines/vLLM_Deep_Dive]] — KAITO 默认推理运行时
- [[10_Deployment_Inference/Inference_Engines/TGI_Deep_Dive]] — KAITO 备选推理运行时
