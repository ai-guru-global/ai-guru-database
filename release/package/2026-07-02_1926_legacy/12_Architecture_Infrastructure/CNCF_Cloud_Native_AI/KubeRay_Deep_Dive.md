---
title: "KubeRay: 在 Kubernetes 上运行 Ray"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "ray", "kuberay", "distributed", "vllm"]
summary: "> **一句话理解**: KubeRay 是 Ray 的 Kubernetes Operator——把 RayCluster/RayJob/RayService 声明式跑在 K8s 上，是大模型多机多卡分布式推理（Ray Serve + vLLM tensor parallel）的标配底座。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Kuberay Deep Dive"
  - "KubeRay Deep Dive"
  - KubeRay_Deep_Dive

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# KubeRay: 在 Kubernetes 上运行 Ray

> **一句话理解**: KubeRay 是 Ray 的 Kubernetes Operator——把 RayCluster/RayJob/RayService 声明式跑在 K8s 上，是大模型多机多卡分布式推理（Ray Serve + vLLM tensor parallel）的标配底座。

> 📐 **概念方法论**: KubeRay 解决的是「分布式 Python 计算框架 Ray 如何被 Kubernetes 原生纳管」——它把 Ray 的运行时拓扑（head + worker）、批作业、长期服务三种形态分别抽象为 CRD，再用 Operator 把 Ray Autoscaler 接到 K8s Pod 调度链上。理解它的前提是理解 vLLM 的多机 tensor parallel 怎么把一个模型拆到多张 GPU 上（详见 [[部署推理/Inference_Engines/vLLM_Deep_Dive]]），以及推理服务编排的标准接口为什么需要 Ray Serve 而非纯 KServe（详见 KServe Deep Dive）。

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

KubeRay 是 Ray 项目官方维护、已进入 CNCF Landscape `AI Native Infra` 分类的 **Kubernetes Operator 套件**，定位一句话：把 Ray 应用程序以 Kubernetes 原生方式跑起来。Ray 本身是面向 AI 的通用分布式计算框架（训练 / 调参 / 推理 / 强化学习），而 KubeRay 是 Ray 与 K8s 之间的胶水层——它不重新实现 Ray，只把 Ray 的运行单元翻译成 K8s 资源。

```
        传统 Ray 裸跑                      KubeRay 声明式管理
  ┌────────────────────────┐         ┌──────────────────────────────┐
  │ ray start --head       │         │ kubectl apply -f raycluster.yaml│
  │ ray start --address=...│  ───►   │   operator watch RayCluster CRD │
  │ ray job submit ...     │         │     └─ head Pod + worker Pods  │
  │ ray serve deploy ...   │         │   autoscaler sidecar 驱动扩缩 │
  │ 运维靠脚本 + SSH        │         │   kubectl / Helm / GitOps      │
  └────────────────────────┘         └──────────────────────────────┘
   拓扑靠人工维护                     拓扑即代码，自愈、可观测、可灰度
```

**核心价值**：Ray 是大模型时代少数能把一个推理模型横跨 N 台机器、每台若干张 GPU 跑起来（`tensor_parallel_size=N`）的成熟框架；KubeRay 让这种多机多卡拓扑变成一份 YAML，而不是 Ansible 脚本。

### 1.2 核心特性

| 特性 | 说明 | 生产价值 |
|------|------|----------|
| **声明式 Ray on K8s** | `RayCluster` / `RayJob` / `RayService` 三个 CRD 覆盖全部 Ray 形态 | GitOps、IaC、CRUD 化运维 |
| **Ray Autoscaler 集成** | Operator 把 K8s Node 池与 Ray worker 副本数打通 | 按负载自动加 / 减 GPU Pod |
| **GPU 资源声明** | Pod template 直接写 `nvidia.com/gpu` requests/limits | 调度器按卡数绑定节点 |
| **多机 Tensor Parallel** | Ray 把一个 vLLM/SGLang 模型拆到多 Pod 的多张 GPU | 70B / 405B 模型上多机推理的标配 |
| **Ray Serve 一等公民** | `RayService` CRD 包装 Serve 部署，提供滚动升级与路由 | LLM 推理服务的 K8s 原生 API |
| **故障自愈** | Actor 重启、节点失联自动重建 worker 组 | 长跑训练 / 7x24 推理稳定性 |
| **生态互通** | 与 KServe（Ray 作为 runtime）、Kueue / Volcano（排队调度）集成 | 平台化编排、混部、配额 |

### 1.3 项目状态与版本历程

| 时间 | 事件 |
|------|------|
| 2020-2021 | KubeRay 起源于 Ray 社区，解决 K8s 上 Ray 的部署痛点 |
| 2022 | 进入 CNCF Landscape；`RayCluster` / `RayJob` / `RayService` 三大 CRD 稳定 |
| 2023 | v0.6–v1.0，Ray Serve 多版本流量切分、GPU 调度优化 |
| 2024-05 | **v1.1**，autoscaler v2 增强、RayService 健康检查完善 |
| 2025 | **v1.2**，对 Ray 2.10+ 全特性支持、Multi-Cluster 与 Kueue 集成改进 |
| 2026 | 持续推进多租户隔离、与 llm-d / KServe 互操作、GPU 弹性增强 |

仓库：<https://github.com/ray-project/kuberay>

> 注：KubeRay 的 CRD 字段随 Ray 主版本演进较快，生产前务必把 operator 版本、Ray 镜像版本、CRD schema 三者对齐（见 §4.2）。

---

## 2. 核心概念

### 2.1 三个 CRD：RayCluster / RayJob / RayService

| CRD | 抽象 | 典型用途 | 生命周期 |
|-----|------|----------|----------|
| **RayCluster** | 一个完整的 Ray 集群（head + N 个 worker 组） | 长期共享集群、交互式 notebook、自定义调度 | 直到手动删除 |
| **RayJob** | 提交一个一次性 Ray 作业（submission） | 批训练、数据预处理、评估跑分 | 作业完成自动收尾 |
| **RayService** | 一个 Ray Serve 部署 + 流量入口 | LLM 推理服务、多模型路由、A/B 灰度 | 长期常驻 + 滚动升级 |

> 心智模型：`RayCluster` 是基础设施，`RayJob` 跑完即走，`RayService` 是常驻服务。三者都基于底层 RayCluster，只是上层语义不同。

### 2.2 Head 节点 vs Worker 节点

```
                    Ray Cluster 拓扑
  ┌─────────────────────────────────────────────────────┐
  │  Head Pod（控制面，单点）                            │
  │  • GCS（Global Control Service）：元数据/actor 表    │
  │  • Raylet：本地资源调度                              │
  │  • Dashboard：8265 端口（UI / metrics / logs）       │
  │  • Autoscaler（KubeRay 模式下作为 sidecar 或独立）   │
  └───────────────┬─────────────────────────────────────┘
                  │ 10001 (client) / 6379 (Redis) / 8265 (UI)
   ┌──────────────┼──────────────────────────────────┐
   ▼              ▼                                  ▼
 ┌──────────┐  ┌──────────┐                       ┌──────────┐
 │ Worker   │  │ Worker   │  ...N 个 worker 组     │ Worker   │
 │ Pod (GPU)│  │ Pod (GPU)│  每个 workerGroup 可   │ Pod (CPU)│
 │ raylet   │  │ raylet   │  独立设镜像/资源/副本   │ raylet   │
 └──────────┘  └──────────┘                       └──────────┘
```

- **Head Pod**：GCS 单点（Ray 2.x 可外接 Redis 做高可用），不跑用户计算负载（除非显式配置 `rayStartParams`）。
- **Worker Pod**：实际承载 task / actor / Serve replica 的计算节点，可按 GPU 数 / CPU 数 / 镜像分组（如 GPU 推理组 + CPU 预处理组）。

### 2.3 Ray Serve 与 Actor

- **Task**：Ray 上的无状态远程函数（`@ray.remote`），返回一次。
- **Actor**：有状态长对象（`@ray.remote` 装饰类），可被多 client 调用；vLLM 引擎在 Ray 上就是被包装成一个 actor。
- **Ray Serve**：构建在 actor 之上的「微服务框架」，把 Python 函数 / 类暴露为带路由、副本、自动扩缩的 HTTP 服务。一个 Serve `Deployment` = N 个 actor 副本 + 一个 HTTP 前端。

### 2.4 为什么大模型推理要选 Ray

| 需求 | Ray 提供的能力 |
|------|----------------|
| 多机 tensor parallel | Ray actor 跨节点组网，NCCL over Ray 自动建环 |
| Python 原生业务逻辑 | RAG、agent、tool calling 全 Python，避免跨语言序列化 |
| 多模型 / 多版本 | Serve deployment 路由，应用层切分而非 K8s 层切分 |
| 副本与 GPU 解耦扩缩 | Serve autoscaling 按 QPS 调 actor 数，独立于 K8s 副本 |
| 训推一体 | 同一集群白天推理、夜间训练，复用 Ray 调度 |

---

## 3. 架构设计

### 3.1 KubeRay Operator 工作流

```
  ┌────────────────────────────────────────────────────────────┐
  │                  Kubernetes API Server                     │
  └──────────────┬──────────────────────────────────┬──────────┘
                 ▲ watch                            │ reconcile
                 │                                  ▼
       ┌─────────────────────────┐        ┌────────────────────────┐
       │  ray-cluster CRD        │        │   KubeRay Operator     │
       │  ray-job CRD            │ ──────►│   (Deployment + RBAC)  │
       │  ray-service CRD        │        │                        │
       └─────────────────────────┘        └───────────┬────────────┘
                                                      │ create/manage
                ┌─────────────────────────────────────┼─────────────────┐
                ▼                                     ▼                 ▼
       ┌──────────────────┐               ┌──────────────────┐  ┌──────────────────┐
       │ Head Service+Svc │               │ Worker Pod (GPU) │  │ Ray Serve Proxy  │
       │ Head Pod         │◄──────────────│ raylet + worker  │  │ (HTTP 入口 8000) │
       │ GCS / Dashboard  │   ray worker  │ Serve replica    │  │                  │
       │ Autoscaler sidecar│  协议         │ actor            │  │ 路由到 replica   │
       └──────────────────┘               └──────────────────┘  └──────────────────┘
```

Reconcile 关键步骤：

1. 监听 `RayCluster` 变化 → 计算 head / worker 组期望副本数。
2. 创建 / 更新 head Service（ClusterIP，承载 client / dashboard / serve 流量）。
3. 对每个 workerGroup：按 `replicas` 与 `minReplicas/maxReplicas` 维护 Pod。
4. 注入 Ray 启动参数（`rayStartParams`），让 worker 通过 head Service 自动 join。
5. 触发 Ray Autoscaler（按 Ray 集群内 pending actor / 资源请求）反向要求 KubeRay 扩 worker。

### 3.2 Ray Service：LLM 推理流量路径

```
  Client (OpenAI SDK)
       │ POST /v1/chat/completions
       ▼
  ┌───────────────────────────────┐
  │  RayService CRD               │
  │  ├─ serveService (K8s Svc) ───┼──► ClusterIP / Ingress → Ray Serve HTTP Router
  │  └─ RayCluster (底层)          │
  └───────────────┬───────────────┘
                  ▼
        Ray Serve Router (head Pod 内)
                  │ 按 deployment 名路由
                  ▼
   ┌──────────────────────────────────────┐
   │  Deployment: vllm_engine (N replicas)│
   │  每个 replica = 1 个 Serve actor     │
   │  = 一个跨 4 Pod 的 TP=4 vLLM 实例     │
   └──────────────────────────────────────┘
```

`RayService` 的滚动升级机制：新版本 Serve 部署起来 → 健康检查通过 → 把 `serveService` 的 selector 切到新版本 → 旧版本优雅下线，整个过程零中断。

### 3.3 Autoscaler 与 K8s 的双向耦合

| 触发源 | 方向 | 动作 |
|--------|------|------|
| Ray 应用请求资源（pending actors） | Ray → KubeRay | 上调 workerGroup 副本数，直到 `maxReplicas` |
| Ray 集群空闲 | Ray → KubeRay | 下调副本数，直到 `minReplicas` |
| Node 池不足 | K8s → Cluster Autoscaler | 触发 Node 扩容（或挂 Kueue 排队） |
| Pod 失败 / 节点驱逐 | K8s → KubeRay | 重建 Pod，Ray 自动 reconnect |

---

## 4. 安装部署

### 4.1 安装 KubeRay Operator

Operator 部署前的集群前置条件：

| 组件 | 最低版本 / 要求 | 说明 |
|------|-----------------|------|
| Kubernetes | ≥ 1.24 | CRD 使用 v1 schema；1.22 以下需手改 |
| NVIDIA GPU Operator | ≥ v23.9 | 提供 `nvidia.com/gpu` device plugin 与 DCGM exporter |
| CNI（Calico / Cilium / Flannel） | — | 必须放行 Pod CIDR 间 10001 / 6379 / 8000 / 8265 + 52365–52700 |
| RuntimeClass | `nvidia` | containerd 配 NVIDIA runtime，否则 GPU 容器拉不起来 |
| 共享内存 `/dev/shm` | ≥ 64Gi | 不满足则 Ray object store 退化为 TCP，零拷贝失效 |
| 集群 RBAC | CRD / Namespace / Pod / Service | Operator watch + reconcile 所需最小权限 |

```bash
helm repo add kuberay https://ray-project.github.io/kuberay-helm-chart/
helm repo update

helm install kuberay-operator kuberay/kuberay-operator \
  --namespace ray-system \
  --create-namespace \
  --version 1.2.2

kubectl get deployment -n ray-system kuberay-operator
kubectl get crd | grep ray
```

预期看到 `rayclusters.ray.io`、`rayjobs.ray.io`、`rayservices.ray.io` 三个 CRD。

### 4.2 Ray 镜像选择

| 镜像 tag | Python | CUDA | 用途 |
|----------|--------|------|------|
| `rayproject/ray:2.40.0-py310` | 3.10 | — | CPU / head 节点 |
| `rayproject/ray:2.40.0-py311` | 3.11 | — | CPU 新依赖场景 |
| `rayproject/ray:2.40.0-py310-gpu` | 3.10 | 12.4 | GPU worker 默认 |
| `rayproject/ray:2.40.0-py311-cu123` | 3.11 | 12.3 | 对齐特定 NCCL / driver |
| 自建 `vllm-ray:0.6.3-ray2.40` | 3.10 | 12.4 | 锁 vLLM + SGLang，避免 runtime_env pip 拉镜像慢 |

> 强约束：**operator 版本 ↔ Ray 镜像版本 ↔ CRD schema** 三者要匹配。operator 1.2.x 对应 Ray 2.9+；老 CRD 字段在新版可能改名。

### 4.3 GPU 节点准备

```bash
# 节点需已装 NVIDIA device plugin
kubectl get nodes "-o jsonpath={.items[*].status.capacity.nvidia\.com/gpu}"

# 给 GPU 节点打标签便于亲和性
kubectl label node <gpu-node> node-type=gpu-inference
```

### 4.4 网络与端口

Ray 进程间通信使用大量端口，KubeRay 默认通过 head Service 暴露固定端口、worker Pod 走 10001 / 6379 等：

| 端口 | 用途 |
|------|------|
| 10001 | Ray client（`ray.init("ray://...")`） |
| 6379 | Redis / GCS（head 主端口） |
| 8265 | Dashboard（UI + REST） |
| 8000 | Ray Serve HTTP 入口 |
| 52365–52700 | worker object store / 内部 RPC（节点池内） |

生产环境务必在 Pod template 里设 `hostNetwork: false` + Service ClusterIP；若 Node 走 Calico / Cilium，确保 Pod CIDR 间这些端口畅通。

### 4.5 多机组网与 head Service

Ray Serve 与 tensor parallel 要求 worker↔head 双向可达，仅默认 head Service 不够。worker container 必须显式声明 object store / RPC 端口，KubeRay 才会为每个 worker 自动生成同名的 ClusterIP Service（承载 NCCL 跨 Pod 通信）：

```yaml
containers:
  - name: ray-worker
    ports:
      - { containerPort: 10001, name: client }
      - { containerPort: 6379,  name: gcs }
      - { containerPort: 52365, name: obj }
```

跨 AZ 集群若无 AZ 间直连，建议把同一 workerGroup 用 `topology.kubernetes.io/zone` 亲和性打到同 AZ，避免 NCCL all-reduce 走跨 AZ 链路、tensor parallel 通信延迟暴涨。

---

## 5. 快速开始

目标：用 `RayService` 部署一个跨 2 个 GPU Pod、`tensor_parallel_size=2` 的 vLLM 推理服务，暴露 OpenAI 兼容 API。

### 5.1 RayService YAML

```yaml
apiVersion: ray.io/v1
kind: RayService
metadata:
  name: vllm-llama-service
  namespace: ray-system
spec:
  serveConfigV2: |
    applications:
      - name: vllm_app
        import_path: vllm.entrypoints:api_server
        route_prefix: /
        runtime_env:
          pip: ["vllm==0.6.3"]
        deployments:
          - name: vllm_engine
            num_replicas: 1
            ray_actor_options:
              num_gpus: 2
            config:
              import_path: "--"
        arguments:
          args:
            - --model=meta-llama/Meta-Llama-3-8B-Instruct
            - --tensor-parallel-size=2
            - --port=8000
  rayClusterConfig:
    rayVersion: "2.40.0"
    headGroupSpec:
      rayStartParams:
        dashboard-host: "0.0.0.0"
      template:
        spec:
          containers:
            - name: ray-head
              image: rayproject/ray:2.40.0-py310
              resources:
                limits:
                  cpu: "4"
                  memory: 16Gi
              ports:
                - containerPort: 10001
                - containerPort: 8265
                - containerPort: 8000
    workerGroupSpecs:
      - replicas: 2
        minReplicas: 2
        maxReplicas: 4
        groupName: gpu-group
        rayStartParams: {}
        template:
          spec:
            containers:
              - name: ray-worker
                image: rayproject/ray:2.40.0-py310-gpu
                resources:
                  limits:
                    nvidia.com/gpu: 1
                    cpu: "8"
                    memory: 32Gi
```

### 5.2 部署与验证

```bash
kubectl apply -f vllm-rayservice.yaml

kubectl get rayservice vllm-llama-service -n ray-system -w
# 等 STATUS=Running, SERVICE_ENDPPOINT 出现

kubectl port-forward svc/vllm-llama-service-serve-svc 8000:8000 -n ray-system

curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Meta-Llama-3-8B-Instruct",
    "messages": [{"role":"user","content":"KubeRay 是什么？一句话。"}]
  }'
```

成功返回 OpenAI 兼容 JSON 即说明 2 Pod × 1 GPU 的 TP=2 推理链路打通。

---

## 6. 生产配置

### 6.1 生产级 RayService（带 autoscaling / GPU / 滚动升级）

```yaml
apiVersion: ray.io/v1
kind: RayService
metadata:
  name: vllm-prod
  namespace: ray-system
spec:
  serveConfigV2: |
    applications:
      - name: vllm
        import_path: vllm.entrypoints:api_server
        route_prefix: /
        runtime_env:
          pip: ["vllm==0.6.3", "huggingface_hub==0.26.2"]
        deployments:
          - name: vllm_engine
            num_replicas: 2
            max_replicas_per_node: 1
            autoscaling_config:
              target_num_ongoing_requests_per_replica: 16
              min_replicas: 2
              max_replicas: 6
              metrics_interval_s: 10
              look_back_period_s: 30
            ray_actor_options:
              num_gpus: 4
        arguments:
          args:
            - --model=Qwen/Qwen2.5-72B-Instruct
            - --tensor-parallel-size=4
            - --gpu-memory-utilization=0.92
            - --max-model-len=32768
            - --enable-prefix-caching
  rayClusterConfig:
    rayVersion: "2.40.0"
    headGroupSpec:
      rayStartParams:
        dashboard-host: "0.0.0.0"
        num-cpus: "0"
      template:
        metadata:
          annotations:
            prometheus.io/scrape: "true"
            prometheus.io/port: "8080"
        spec:
          containers:
            - name: ray-head
              image: rayproject/ray:2.40.0-py310
              ports:
                - containerPort: 10001
                - containerPort: 8265
                - containerPort: 8000
                - containerPort: 8080
              resources:
                limits:
                  cpu: "4"
                  memory: 16Gi
              env:
                - name: HF_TOKEN
                  valueFrom:
                    secretKeyRef: { name: hf-secret, key: token }
    workerGroupSpecs:
      - replicas: 8
        minReplicas: 8
        maxReplicas: 24
        groupName: gpu-h100
        rayStartParams: {}
        template:
          spec:
            nodeSelector:
              node-type: gpu-inference
            containers:
              - name: ray-worker
                image: rayproject/ray:2.40.0-py310-gpu
                resources:
                  limits:
                    nvidia.com/gpu: 4
                    cpu: "48"
                    memory: 256Gi
                  requests:
                    nvidia.com/gpu: 4
                volumeMounts:
                  - name: dshm
                    mountPath: /dev/shm
                  - name: model-cache
                    mountPath: /models
            volumes:
              - name: dshm
                emptyDir: { medium: Memory, sizeLimit: 64Gi }
              - name: model-cache
                persistentVolumeClaim:
                  claimName: hf-model-pvc
  serviceUnhealthySecondThreshold: 900
  deploymentUnhealthySecondThreshold: 1200
```

### 6.2 关键生产要点

| 维度 | 配置 / 实践 |
|------|-------------|
| **`/dev/shm` 共享内存** | Ray object store 默认走 `/dev/shm`，必须挂 `emptyDir: medium=Memory`，否则大对象 IPC 退化为 TCP，性能暴跌 |
| **模型权重 PVC 缓存** | 多副本共享 NFS / FSx，避免每个 Pod 各拉一次 70B 权重 |
| **`max_replicas_per_node`** | Serve 副本不扎堆单节点，节点故障爆炸半径小 |
| **head `num-cpus: 0`** | 让 head 不承载用户 actor，纯控制面 |
| **健康检查阈值** | `serviceUnhealthySecondThreshold` 留够冷启动时间（大模型分钟级） |
| **滚动升级** | RayService 内置新版本 → 健康检查 → 流量切换，不要用 K8s `Deployment.strategy` 覆盖 |
| **GPU 资源 requests = limits** | 避免 K8s overcommit 导致 OOM kill |

### 6.3 多机 Tensor Parallel 拓扑

```
  Ray Serve Deployment: vllm_engine, num_replicas=2, num_gpus=4
  ──────────────────────────────────────────────────────────────
  Replica 0 (TP=4)               Replica 1 (TP=4)
  ┌───────┬───────┬───────┬────┐  ┌───────┬───────┬───────┬────┐
  │ GPU 0 │ GPU 1 │ GPU 2 │GPU3│  │ GPU 0 │ GPU 1 │ GPU 2 │GPU3│
  │ rank0 │ rank1 │ rank2 │rk3 │  │ rank0 │ rank1 │ rank2 │rk3 │
  └───┬───┴───┬───┴───┬───┴────┘  └───────┴───────┴───────┴────┘
      │NCCL over Ray (跨 Pod)│        各自独立的 NCCL 通信域
      └─────────┬────────────┘
                ▼
        Ray Serve HTTP Router 把请求 round-robin 到 replica 0/1
```

> 关键：`num_gpus × num_replicas` 必须能被 workerGroup 总 GPU 数整除；KubeRay + Ray 2.10+ 自动用 placement group 保证 TP 组调度到同一批 Pod。

### 6.4 与 Kueue 集成排队

```yaml
metadata:
  labels:
    kueue.x-k8s.io/queue-name: gpu-queue
```

把 `RayJob` 或承载 `RayCluster` 的 Pod template 打上 LocalQueue 标签，Kueue 会把整个 Ray 集群当 `Workload` 排队，避免多团队同时抢 GPU 把节点池打爆。

---

## 7. 运维与可观测

### 7.1 Ray Dashboard

```bash
kubectl port-forward svc/vllm-prod-head-svc 8265:8265 -n ray-system
# 浏览器打开 http://localhost:8265
```

Dashboard 提供：集群拓扑、actor / Serve 状态、Logs viewer、Metrics、Submission 历史。是排查 Serve 副本未起来、actor 死亡的第一入口。

### 7.2 Prometheus / Grafana 关键指标

| 域 | 指标 | 含义 | 告警阈值（参考） |
|----|------|------|------------------|
| Core | `ray_cluster_active_nodes` | 在线 worker 数 | < minReplicas 持续 5 分钟 |
| Core | `ray_cluster_pending_nodes` | 等待启动 worker | > 0 持续 10 分钟（扩容卡住） |
| Core | `ray_actors` / `num_actors` | actor 状态分布（ALIVE / DEAD / PENDING） | `DEAD` 占比 > 5% |
| Core | `actor_death` / `ray_actor_restart_total` | actor 死亡 / 重启计数 | 突增 = OOM 或 NCCL 失败 |
| Serve | `serve_deployment_request_throughput` | deployment QPS（请求速率） | 跌零 = 服务挂 |
| Serve | `serve_handle_request_latency_s` | handle 调用延迟分布 | p99 > 业务 SLO |
| Serve | `serve_num_replicas` | deployment 当前 actor 数 | < `num_replicas` 持续 = 副本起不来 |
| Serve | `ray_serve_num_ongoing_requests` | 在途请求 | 持续 > target×2 |
| GPU | `DCGM_FI_DEV_GPU_UTIL` | GPU 利用率（DCGM exporter） | 长期 < 30% 排查 |
| GPU | `DCGM_FI_DEV_FB_USED` | 显存占用 | > 95% 警惕 OOM |
| GPU | `DCGM_FI_DEV_NVLINK_THROUGHPUT_TX` | NVLink 发送带宽（TP 跨卡通量） | 跌零 = NVLink 故障 |

ServiceMonitor 片段：

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata: { name: ray-head, namespace: ray-system }
spec:
  selector:
    matchLabels: { ray.io/node-type: head }
  endpoints:
    - port: metrics
      path: /metrics
      interval: 15s
```

常用 PromQL（Ray Serve 多副本 TP 推理）：

```promql
# 1. 每个 deployment 的请求吞吐
sum by (deployment) (rate(serve_deployment_request_throughput[1m]))

# 2. P99 handle 调用延迟
histogram_quantile(0.99, sum by (le) (rate(serve_handle_request_latency_s_bucket[5m])))

# 3. actor 重启速率（OOM / NCCL 异常信号）
rate(ray_actor_restart_total[5m]) > 0

# 4. GPU 利用率均分（验证 TP 各 rank 都在工作）
avg by (node) (DCGM_FI_DEV_GPU_UTIL) < 30
```

### 7.3 常见问题与排查

| 症状 | 可能原因 | 排查 |
|------|----------|------|
| Worker 一直 `Pending` | GPU Node 不足 / Kueue 排队 / 镜像拉不下 | `kubectl describe pod` 看 Events；查 Kueue Workload |
| Serve replica 卡在 `STARTING` | 模型下载慢 / 权重未缓存 | 进 Pod `kubectl exec` 看 `~/.cache/huggingface`；用 PVC |
| Actor `DEAD` 频发 / 持续重启 | OOM kill / `/dev/shm` 太小 / NCCL 超时 | 看 `dmesg`、Ray logs；加大 shm，关 NCCL `BLOCKING_WAIT` |
| Head OOM | object store 占满 head 内存 | 调 `object-store-memory`，head 不跑业务 |
| Worker 连不上 head（网络） | 跨子网端口未通 / CNI 限速 / NetworkPolicy | 检查 10001 / 6379 / 52365 段；调 `RAY_GCS_server_request_timeout_seconds` |
| Autoscaler 不触发 | `minReplicas==maxReplicas` 或 Ray pending actor=0 | Dashboard 看 pending resources；放宽 maxReplicas |
| Ray Serve `num_replicas` 长期不满足 | placement group 调度失败 / GPU 碎片化 | 看 Serve deployment 状态、pending resources；workerGroup GPU 是否被其他 actor 占满 |
| NCCL timeout（TP 初始化卡死） | 跨 Pod 端口不通 / NVLink / IB 故障 | vLLM 日志找 `NCCL error`；查 52365–52700 段；`nccl-test all-reduce` 测带宽 |
| 多机 TP Pod 起不来（GPU 碎片） | workerGroup 总 GPU < `num_replicas × num_gpus` | 算清总需求；用 `topologySpreadConstraints`；开 Kueue 整组排队 |
| Dashboard 8265 不可达 | head Pod 未起 / port-forward 端口冲突 / NetworkPolicy | `kubectl get pods -l ray.io/node-type=head`；`kubectl logs` 看 GCS 启动 |
| RayService 滚动卡住 | 新版本健康检查不过 | `kubectl describe rayservice` 看 `status`；放大 `serviceUnhealthySecondThreshold` |

### 7.4 Ray 版本升级流程

Ray 大版本升级不能原地滚——runtime state 不向后兼容。正确流程：

1. 部署新版本 RayService（新命名 / 新镜像 tag / 独立 Ray 集群）。
2. 新集群健康检查通过（Serve `RUNNING`、所有 replica 就绪）。
3. 把上层 Ingress / Gateway 流量切到新 serveService。
4. 观察 1–2 个工作日，无误后 `kubectl delete rayservice <old>`。

> 不要直接改 RayCluster 镜像 tag 触发 rolling——跨版本 in-place 重启必然失败。

---

## 8. 对比与选择

### 8.1 与同类方案

| 维度 | KubeRay + Ray Serve | KServe | llm-d | 原生 Deployment + vLLM | BentoML |
|------|---------------------|--------|-------|------------------------|---------|
| **底层引擎** | vLLM / SGLang / 自研（任意 Python） | vLLM / TGI / Triton / Ollama | vLLM（定制 worker） | 任意 | 任意（Yatai 接管） |
| **多机 Tensor Parallel** | 强（Ray 原生） | 中（需 ServingRuntime 配合） | 强（disaggregated） | 弱（要手写 StatefulSet） | 弱（偏单实例） |
| **Python 业务逻辑** | 原生（RAG / agent 首选） | 一般（要包成 runtime） | 弱（专注推理） | 取决于实现 | 原生（Bento 自带） |
| **副本管理粒度** | Serve actor 级（细到单个 GPU） | Knative Pod 级 | prefill/decode 拆分 | K8s Pod 级 | Bento 部署单元 |
| **Scale-to-zero** | 弱（Ray 启动慢） | 强 | 中 | 弱 | 中（BentoML on Knative） |
| **Canary / 多版本** | Serve 应用层切分 | Knative 原生 | InferencePool 路由 | Ingress 手动 | Yatai 内置 |
| **典型规模** | 单集群数百 GPU | 单集群数十实例 | 万卡级 | 单实例 | 单集群数十实例 |
| **生态成熟度** | CNCF Landscape / Ray 社区大 | CNCF Incubating / 标准化高 | 新生态（CNCF Sandbox） | 标准 K8s | 独立开源 + 商业版 |
| **学习曲线** | 中高（要懂 Ray） | 中 | 高 | 低 | 中低 |
| **推荐场景** | 70B+ 多机 TP、RAG/agent、训推一体 | 标准 InferenceService、scale-to-zero | 超大规模 disaggregated 推理 | 单卡模型快速上线 | 单团队 ML 生产化、CI/CD |

### 8.2 什么时候选 KubeRay

```
选 KubeRay  ✓ ──┬── 需要跨多机多卡 tensor parallel（70B/405B 单机装不下）
                 ├── 业务逻辑是 Python（RAG、agent、tool calling）
                 ├── 需要 Serve 应用层多版本路由，而不只是 Ingress 灰度
                 ├── 已有 Ray 训练集群，想白天推理夜间训练复用
                 └── 需要自研推理框架，但要 K8s 原生编排

不选 KubeRay ✗ ──┬── 只跑 7B/13B 单卡能装下     → KServe / KAITO / llmaz
                 ├── 纯推理、无需 Python 编排    → llm-d
                 ├── 团队完全不懂 Ray、想最简    → 原生 Deployment + vLLM
                 └── 只要 scale-to-zero 极致省 GPU → KServe + Knative
```

> 与 [[部署推理/Inference_Engines/vLLM_Deep_Dive]] 配合：vLLM 引擎不变，KubeRay 只是把 vLLM 的多机部署 / 副本管理 / 升级流程 K8s 化。

### 8.3 选型一句话

一句话决策：**70B+ 多机 TP 或 Python 重业务 → KubeRay；标准化推理 + scale-to-zero → KServe；万卡级 disaggregated → llm-d；单卡快速验证 → 原生 Deployment；单团队 ML CI/CD → BentoML。**

实际生产中并非互斥。最常见的组合是 **KubeRay（多机分布式底座）+ KServe（标准化对外接口 + Knative 灰度）**：KServe `ServingRuntime` 把流量转给 Ray Serve，KubeRay 专注底层 GPU 拓扑与 actor 调度；上层用 Kueue 做 GPU 配额排队，详见 [[CNCF_Cloud_Native_AI/Kueue_Deep_Dive]]。

---

## 9. 常见问题 FAQ

**Q1：KubeRay 一定要 GPU 吗？**
不强制。RayCluster 可以纯 CPU（用于数据预处理、强化学习环境模拟）。但 LLM 推理场景几乎都跑在 GPU workerGroup 上，KubeRay 通过 Pod template 的 `nvidia.com/gpu` 自动调度。

**Q2：Ray Head 是单点，挂了怎么办？**
Ray 2.x 起支持 GCS 外部存储（Redis / etcd），head Pod 重建后能恢复 actor 表与 Serve 状态。生产推荐 `rayStartParams` 中开 `redis-password` 指向外部 Redis，配合 K8s `PodDisruptionBudget` 保护 head。

**Q3：Ray Serve 和 KServe 能一起用吗？**
可以，且是常见组合。KServe 把 Ray 作为 `ServingRuntime` 调用，对外暴露统一的 `InferenceService` CRD，底层用 KubeRay 管理多机 TP 拓扑。KServe 管「标准化接口 + 灰度」，KubeRay 管「多机分布式运行时」。

**Q4：RayService 滚动升级会断流吗？**
默认不断流。新版本 Serve 起来后健康检查通过，KubeRay 才把 `serveService` 的 selector 切到新 RayCluster，旧版本优雅下线。前提是新版本 `serviceUnhealthySecondThreshold` 内能 ready（大模型要预留数分钟）。

**Q5：vLLM 的 tensor_parallel_size 怎么和 KubeRay worker 副本对应？**
`tensor_parallel_size × num_replicas` 是总 GPU 数，必须 ≤ workerGroup 总 GPU。例如 `TP=4`、`num_replicas=2`，则 workerGroup 要至少 8 张 GPU；KubeRay 通过 placement group 保证一个 replica 的 4 张 GPU 调度到尽量亲和的节点（最好同机柜走 NVLink/IB）。

**Q6：KubeRay 能做 scale-to-zero 省钱吗？**
能力上有 `minReplicas: 0`，但 Ray 集群冷启动 + 模型重新加载常达数分钟，不适合面向用户的在线服务。推荐对低 QPS 辅助模型用 KServe + Knative 做 scale-to-zero，主推理服务保持 `minReplicas >= 1`。

**Q7：怎么和 Volcano / Kueue 做批量排队？**
给 `RayJob` 加 `kueue.x-k8s.io/queue-name` 标签即可让 Kueue 把整个 Ray 集群当 Workload 排队；Volcano 场景下用 Pod group annotation。适合多团队共享 GPU 池、夜间跑批量训练的混部场景，详见 [[CNCF_Cloud_Native_AI/Kueue_Deep_Dive]]。

---

## Related

- README —— CNCF 云原生 LLM 项目全景
- KServe Deep Dive —— 与 KubeRay 互补的标准化推理接口层
- [[CNCF_Cloud_Native_AI/Kueue_Deep_Dive]] —— 把 Ray 集群当 Workload 排队的调度器
- [[部署推理/Inference_Engines/vLLM_Deep_Dive]] —— KubeRay 上最常见的推理引擎
- [[部署推理/Inference_Engines/SGLang_Deep_Dive]] —— 另一个常跑在 Ray 上的高性能推理引擎
