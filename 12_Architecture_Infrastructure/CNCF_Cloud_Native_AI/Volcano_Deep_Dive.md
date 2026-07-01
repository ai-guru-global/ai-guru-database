---
title: "Volcano: Kubernetes 批处理与 AI 训练调度器"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "volcano", "scheduling", "batch", "gpu"]
summary: "> **一句话理解**: Volcano 是 CNCF 孵化级的 Kubernetes 批处理调度器——靠 PodGroup 实现 Gang Scheduling（要么全调度要么不调度），是大模型分布式训练在 K8s 上避免「半个任务卡死」的事实标准。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Volcano Deep Dive"
  - Volcano_Deep_Dive

---
# Volcano 深度解析

> **一句话理解**: Volcano 是 CNCF 孵化级的 Kubernetes 批处理调度器——靠 PodGroup 实现 Gang Scheduling（要么全调度要么不调度），是大模型分布式训练在 K8s 上避免"半个任务卡死"的事实标准。

> 📐 **概念方法论**: Volcano 把"调度"从"逐 Pod 决策"升级为"逐 **PodGroup** 决策"。原生 kube-scheduler 只关心单个 Pod 能不能放下，无法表达"这 8 个 GPU 必须一起上、否则一起不上"——而分布式训练（all-reduce / all-gather）恰恰要求全有或全无。Volcano 用 PodGroup 作为最小调度原子，配合 actions pipeline（enqueue → allocate → backfill → preempt → reclaim）让批处理、HPC、AI 训练在同一套 K8s 上获得类似 Slurm/Yarn 的语义。它与 [[11_MLOps_Pipeline/Orchestration/Kubeflow_Deep_Dive]] 的 Training-Operator 是搭档（训练编排 + 调度），也是 [[12_Architecture_Infrastructure/Architecture_Overview/AI_Infrastructure_2026]] 中"训练调度层"的核心组件。

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

Volcano 是华为开源、捐赠给 CNCF 的 Kubernetes **批处理调度器**，定位在原生 kube-scheduler 之上、解决"高性能计算 / 大数据 / AI 训练 / EDA / 渲染"等场景的调度痛点。它不是又一个"通用调度器替代品"，而是把 Slurm、Yarn、Mesos 多年沉淀的 **gang / queue / fair-share / preemption** 语义移植到 K8s 生态。

```
┌────────────────────────────────────────────────────────────────┐
│                 原生 K8s 调度的「批处理盲区」                    │
├────────────────────────────────────────────────────────────────┤
│  场景: 8 卡分布式 PyTorch 训练（all-reduce）                    │
│                                                                │
│  kube-scheduler 视角:                                          │
│    Pod1 ✓ → Pod2 ✓ → Pod3 ✓ → Pod4 ✗(资源不够) → 死等          │
│    结果: 已调度的 3 个 Pod 拿着 GPU 占着坑，                    │
│          训练起不来，别人也用不到这些卡 → 集群碎石化            │
│                                                                │
│  Volcano 视角 (Gang Scheduling):                               │
│    PodGroup(minMember=8) 整体评估:                             │
│      能凑齐 8 卡 → 一次性调度全部                              │
│      凑不齐   → 全部等待，一张卡都不占用                       │
└────────────────────────────────────────────────────────────────┘
```

一句话：**Volcano = PodGroup（最小调度原子）+ Gang/Binpack/Queue/DRF 调度插件 + 训练/批处理作业 CRD**。

### 1.2 核心特性

| 特性 | 说明 | 解决的问题 |
|------|------|-----------|
| **Gang Scheduling** | PodGroup 内所有 Pod 必须同时调度成功，否则全部回退（all-or-nothing） | 分布式训练死锁、资源碎片化占用 |
| **Binpack** | 优先把 Pod 打包到少量节点，提升 GPU/NUMA 密度 | 资源碎片、跨节点通信开销 |
| **Queue** | 多级队列，支持 weight（权重）、capability（容量上限） | 多租户、多团队公平共享集群 |
| **Preemption / Reclaim** | 队列内/跨队列抢占低优先级作业，回收资源 | 高优先级作业饥饿、SLA 保障 |
| **DRF (Dominant Resource Fairness)** | 按主导资源（CPU vs GPU vs 内存）做公平分配 | 混合负载（CPU 任务 vs GPU 任务）公平性 |
| **Topology-aware** | NUMA、GPU 拓扑、交换机亲和感知 | HPC / 训练通信性能 |
| **Task Priority / Plugins** | Job 内多 task 角色（master/worker/ps）、可插拔调度插件 | 复杂作业建模 |
| **Actions Pipeline** | enqueue → allocate → backfill → preempt → reclaim → shuffle | 调度过程可编排 |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 | 说明 |
|------|------|------|
| 2019-03 | 华为开源 kube-batch | Volcano 前身，瞄准 K8s 批处理空白 |
| 2019-11 | 改名 Volcano 并捐给 CNCF Sandbox | 进入 CNCF 生态 |
| 2020-2021 | v1.0 ~ v1.4 | PodGroup / Queue / Job CRD 稳定，插件体系成型 |
| 2022-04 | CNCF Incubating | 成为孵化级项目，生态采纳加速 |
| v1.7 ~ v1.8 (2023) | NUMA-aware、TDM（时分复用） | HPC 场景增强 |
| v1.9 (2024) | 稳定性 / 性能优化、CI 加固 | 大规模集群（万节点）验证 |
| v1.10 (2025) | 拓扑调度增强、与 Kueue 协同、k8s 1.30 兼容 | 与上游调度生态融合 |

> 仓库：<https://github.com/volcano-sh/volcano> ｜ License: Apache-2.0 ｜ 主要维护方: 华为 / Tencent / 小红书 / ByteDance 等 ｜ 当前成熟度: **CNCF Incubating**

---

## 2. 核心概念

### 2.1 四个 CRD 与一个调度原子

Volcano 在 K8s 上引入四个核心 CRD，外加一套调度 actions/plugins 抽象。

| 概念 | 类型 | 角色 | 类比 |
|------|------|------|------|
| **Job** (`job.volcano.sh`) | 用户 CRD | 一个原子作业，由 1..N 个 task 角色组成（如 master/worker） | Slurm Job |
| **PodGroup** (`podgroup.scheduling.volcano.sh`) | 调度 CRD | **最小调度原子**，承载 gang 语义（`minMember`） | Yarn Application |
| **Queue** (`queue.scheduling.volcano.sh`) | 调度 CRD | 资源池，带 weight / capability / reclaim 策略 | Yarn Queue |
| **Command** (`command.bus.volcano.sh`) | 运维 CRD | 在已运行 Pod 内执行命令（如 checkpoint） | kubectl exec 的批处理版 |

### 2.2 Job 与 PodGroup 的关系

用户提交 `vcjob` 后，Volcano Controller 自动为其创建一个 `PodGroup`——**真正参与调度的是 PodGroup，不是 Job 本身**。

```
┌─────────────────────────────────────────────────────────────┐
│  用户提交 vcjob                                              │
│  ┌────────────────────────────────────────────┐              │
│  │ kind: Job (volcano)                        │              │
│  │  tasks:                                    │              │
│  │   - replicas: 1   (master)                 │              │
│  │   - replicas: 8   (worker, each 1 GPU)     │              │
│  └────────────────────────────────────────────┘              │
│                         │ vc-controller                       │
│                         ▼                                     │
│  ┌────────────────────────────────────────────┐              │
│  │ kind: PodGroup                             │              │
│  │  spec.minMember: 9   ← gang 阈值           │              │
│  │  status.phase: Pending                     │              │
│  └────────────────────────────────────────────┘              │
│                         │                                     │
│        ┌────────────────┼────────────────┐                    │
│        ▼                ▼                ▼                    │
│   Pod(master)     Pod(worker×8)  ─ 9 个 Pod 必须              │
│                                    同时调度成功               │
│                    否则 PodGroup 状态停在 Pending/Unschedulable│
└─────────────────────────────────────────────────────────────┘
```

### 2.3 调度插件与 Actions

Volcano 调度器内部由一条 **actions pipeline** 加一组 **plugins** 组成，二者解耦——action 决定"做什么阶段的事"，plugin 决定"在这个阶段如何打分 / 过滤"。

| Action | 作用 |
|--------|------|
| `enqueue` | 检查 PodGroup 是否满足入队条件（queue 没超 capability） |
| `allocate` | 为 PodGroup 内 Pod 依次选节点并绑定 |
| `backfill` | 用空闲资源填充低优先级 / 可容忍抢占的作业，提升利用率 |
| `preempt` | 在同一 PodGroup 内或同 queue 内抢低优先级 Pod |
| `reclaim` | 跨 queue 抢占，把超配资源夺回给权重更高的 queue |
| `shuffle` | 重排，优化分布（较少使用） |

| Plugin | 作用 |
|--------|------|
| `gang` | 强制 minMember 语义，是 gang scheduling 的核心 |
| `binpack` | 按节点剩余资源评分，倾向打包 |
| `drf` | Dominant Resource Fairness，跨 queue 公平 |
| `predicates` | 复用 kube-scheduler 的预选（NodeName/Toleration/Affinity…） |
| `priority` | 按优先级排序 |
| `nodeorder` | 节点打分（类似 kube-scheduler 的 score） |
| `topology` | NUMA / GPU 拓扑亲和 |
| `tdm` | Time-Division Multiplexing，时分复用（HPC 排班） |
| `overcommit` | 过载策略 |

---

## 3. 架构设计

### 3.1 三大组件

Volcano 由三部分组成，全部以 Deployment / DaemonSet 形式跑在 `volcano-system` 命名空间。

| 组件 | 形态 | 职责 |
|------|------|------|
| **volcano-scheduler** | Deployment（leader-only） | 监听 PodGroup / Queue / Pod，跑 actions pipeline，做调度决策 |
| **volcano-controllers** | Deployment | Job → PodGroup → Pod 的生命周期转换，处理 `policies`（重启 / 重试） |
| **volcano-admission** | Deployment + Webhook | 校验 / 默认值注入 vcjob、queue，拦截 K8s API |

```
┌────────────────────────────────────────────────────────────────────┐
│                     Kubernetes API Server                          │
│                                                                    │
│   ┌─────────────┐   ┌─────────────┐   ┌──────────────────────┐    │
│   │ vcjob       │   │ PodGroup    │   │ Queue                │    │
│   └─────────────┘   └─────────────┘   └──────────────────────┘    │
│         │                 ▲                    ▲                   │
│         │ watch           │ watch/             │ watch             │
│         ▼                 │ write              │                   │
│  ┌──────────────┐    ┌────────────────────────┴─────────────┐     │
│  │ vc-controller│───▶│       volcano-scheduler               │     │
│  │  (Job→PG→Pod)│    │                                       │     │
│  └──────────────┘    │  ┌─────────────────────────────────┐  │     │
│                      │  │ actions pipeline (每调度周期)    │  │     │
│                      │  │ enqueue → allocate → backfill   │  │     │
│                      │  │       → preempt → reclaim       │  │     │
│                      │  │                                 │  │     │
│                      │  │ plugins: gang, binpack, drf,    │  │     │
│                      │  │   priority, topology, ...       │  │     │
│                      │  └─────────────────────────────────┘  │     │
│                      └────────────┬──────────────────────────┘     │
│                                   │ bind                            │
│                                   ▼                                 │
│                       ┌──────────────────────┐                     │
│                       │  Node 1, 2, ... N    │                     │
│                       └──────────────────────┘                     │
│                                                                    │
│  ┌────────────────────┐                                            │
│  │ volcano-admission  │  ← ValidatingWebhook / MutatingWebhook     │
│  └────────────────────┘                                            │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 Actions Pipeline 的执行流

每个调度周期（默认 1s），scheduler 把所有 Pending 的 PodGroup 喂给 actions pipeline，按顺序执行：

```
        ┌──────────┐
        │ Pending  │  PodGroup 进入调度视野
        │ PodGroup │
        └────┬─────┘
             │
             ▼
   ┌─────────────────┐     不满足 queue capability
   │  1. enqueue     │ ─────────────────────────▶ Inqueue 失败，停留
   └────────┬────────┘
            │ 入队成功
            ▼
   ┌─────────────────┐     找不到足够节点
   │  2. allocate    │ ─────────────────────────▶ 部分绑定后回退（gang）
   └────────┬────────┘     （minMember 没凑齐 → 释放已绑定）
            │
            ▼
   ┌─────────────────┐
   │  3. backfill    │  用空闲资源填可容忍的作业
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐     高优 PodGroup 仍不满足
   │  4. preempt     │ ─────────────────────────▶ 抢同 queue 内低优 Pod
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐     跨 queue 权重不公平
   │  5. reclaim     │ ─────────────────────────▶ 抢别的 queue 的 Pod
   └────────┬────────┘
            │
            ▼
        ┌──────────┐
        │ Running  │
        └──────────┘
```

### 3.3 与原生 kube-scheduler 的关系

Volcano 本身**是一个独立的 scheduler**，通过 `schedulerName: volcano` 把 Pod 路由过来。两种部署形态：

- **共存模式（推荐）**：Volcano 与 kube-scheduler 并行，业务 Pod 通过 `schedulerName` 选择。互不干扰，迁移成本低。
- **替换模式**：把默认 scheduler 切到 Volcano。风险高，**生产环境几乎不用**。

---

## 4. 安装部署

### 4.1 前置要求

| 项目 | 要求 |
|------|------|
| K8s 版本 | 1.20 ~ 1.30（v1.10 已验证到 1.30；老集群用 v1.8 兼容 1.22 以下） |
| 节点 | 至少 1 个 worker（建议 ≥ 2 核 4G 的控制面节点） |
| GPU 集群 | 已安装 NVIDIA Device Plugin（`nvidia.com/gpu` 资源可见） |
| Helm | ≥ 3.8 |
| RBAC | cluster-admin 安装权限 |

### 4.2 Helm 一键安装（共存模式）

```bash
helm repo add volcano-sh https://volcano-sh.github.io/helm-charts
helm repo update

helm install volcano volcano-sh/volcano \
  --namespace volcano-system \
  --create-namespace \
  --set custom.scheduler_enable=true \
  --set custom.controller_enable=true \
  --set custom.admission_enable=true \
  --version 1.10.0

kubectl get pods -n volcano-system
```

预期输出：

```
NAME                                      READY   STATUS    AGE
volcano-admission-xxxxx-yyyyy             1/1     Running   2m
volcano-admission-init-xxxxx              0/1     Completed 2m
volcano-controllers-xxxxx-yyyyy           1/1     Running   2m
volcano-scheduler-xxxxx-yyyyy             1/1     Running   2m
```

### 4.3 版本兼容矩阵

| Volcano | K8s 兼容 | 备注 |
|---------|---------|------|
| v1.8 | 1.22 ~ 1.27 | 生产稳定基线 |
| v1.9 | 1.24 ~ 1.28 | 调度性能优化 |
| v1.10 | 1.26 ~ 1.30 | 拓扑增强、与 Kueue 协同 |

### 4.4 验证

```bash
kubectl get crd | grep -E "podgroups.scheduling|jobs.batch.volcano|queues.scheduling"
kubectl get queue default-queue
```

---

## 5. 快速开始

### 5.1 一个分布式 PyTorch 训练 vcjob

下面是一个简化的 2 worker + 1 master 的分布式矩阵乘法训练，演示 gang + queue + policies 的写法。

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: training
spec:
  weight: 1
  capability:
    cpu: "16"
    memory: "64Gi"
    nvidia.com/gpu: "8"
---
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: dist-pytorch-demo
spec:
  minAvailable: 3
  schedulerName: volcano
  queue: training
  policies:
    - event: PodEvicted
      action: RestartJob
    - event: PodFailed
      action: RestartJob
  maxRetry: 5
  tasks:
    - replicas: 1
      name: master
      policies:
        - event: TaskCompleted
          action: CompleteJob
      template:
        spec:
          containers:
            - name: pytorch
              image: pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime
              command:
                - /bin/bash
                - -c
                - |
                  python -c "
                  import torch
                  import torch.distributed as dist
                  dist.init_process_group(backend='nccl')
                  t = torch.randn(1024, 1024, device='cuda')
                  for _ in range(100):
                      t = t @ t
                      t /= t.norm()
                  print('master done', torch.distributed.get_rank())
                  "
              resources:
                limits:
                  nvidia.com/gpu: 1
                  cpu: "4"
                  memory: "16Gi"
          restartPolicy: OnFailure
    - replicas: 2
      name: worker
      template:
        spec:
          containers:
            - name: pytorch
              image: pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime
              command:
                - /bin/bash
                - -c
                - |
                  python -c "
                  import torch, torch.distributed as dist
                  dist.init_process_group(backend='nccl')
                  t = torch.randn(1024, 1024, device='cuda')
                  for _ in range(100): t = t @ t / t.norm()
                  print('worker done', torch.distributed.get_rank())
                  "
              resources:
                limits:
                  nvidia.com/gpu: 1
                  cpu: "4"
                  memory: "16Gi"
          restartPolicy: OnFailure
```

### 5.2 提交与查看

```bash
kubectl apply -f dist-pytorch-demo.yaml

kubectl get vcjob,podgroup,pods -l volcano.sh/job-name=dist-pytorch-demo
kubectl get podgroup dist-pytorch-demo -o yaml | grep -A5 status
kubectl logs -f dist-pytorch-demo-master-0 -c pytorch
```

关键观察点：

| 现象 | 解释 |
|------|------|
| PodGroup 一直 `Pending` 且 `minAvailable` 没满足 | 集群空闲 GPU 不足 3 张，gang 在等待 |
| 一旦资源够，3 个 Pod 几乎同时 `Running` | gang 调度成功的特征 |
| 杀掉一个 worker，整个 Job 重启 | `PodEvicted → RestartJob` policy 生效 |

### 5.3 与原生 Job 的对比

同样的"3 Pod 训练"用 K8s 原生 Job：集群只有 2 张卡时，2 个 Pod 抢到 GPU 起来等第 3 个，永远凑不齐 ranks，进程卡在 `init_process_group`——这就是 Volcano 要解决的核心问题。

---

## 6. 生产配置

### 6.1 生产级 scheduler ConfigMap

Volcano 调度行为完全由 `volcano-scheduler-configmap` 控制。下面是一个面向 **GPU 训练集群**的生产配置：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: volcano-scheduler-configmap
  namespace: volcano-system
data:
  volcano-scheduler.conf: |
    actions: "enqueue, allocate, backfill, preempt, reclaim"
    tiers:
      - plugins:
          - name: priority
          - name: gang
            enablePreemptable: false
          - name: conformance
      - plugins:
          - name: drf
            enablePreemptable: true
          - name: predicates
          - name: proportion
          - name: nodeorder
          - name: binpack
            arguments:
              binpack.weight: 10
              binpack.cpu: 1.5
              binpack.memory: 1.0
              binpack.resources:
                - name: nvidia.com/gpu
                  weight: 1000
              binpack.resourcesGpuWeight: 1000
          - name: topology
            arguments:
              topology.weight: 10
              topology.numaWeight: 5
              topology.gpuWeight: 8
          - name: tdm
            arguments:
              tdm.weight: 1
    configurations:
      - name: enqueueScoring
        arguments:
          enqueueScoring.weight: 10
```

配置要点解读：

| 字段 | 生产建议 | 说明 |
|------|---------|------|
| `actions` | `enqueue, allocate, backfill, preempt, reclaim` | 全开抢占，保障 SLA |
| `gang` | 必开 | 训练场景的核心 |
| `binpack` weight | `nvidia.com/gpu: 1000` | GPU 打分权重拉满，提升 GPU 密度 |
| `topology` | 开启 + `gpuWeight` 高 | 让同一 PodGroup 的 GPU 落到亲和节点 |
| `drf` + `proportion` | 配合 Queue weight | 多租户公平 |
| `preempt` / `reclaim` | 开启但要配 PriorityClass | 避免无限抢占风暴 |

### 6.2 Queue 配置（多租户）

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: team-a
spec:
  weight: 3
  reclaimable: true
  capability:
    cpu: "200"
    memory: "800Gi"
    nvidia.com/gpu: "32"
---
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: team-b
spec:
  weight: 1
  reclaimable: true
  capability:
    cpu: "100"
    memory: "400Gi"
    nvidia.com/gpu: "16"
```

| 字段 | 含义 |
|------|------|
| `weight` | 跨 queue 分配比例（team-a 拿 3/4，team-b 拿 1/4） |
| `capability` | 该 queue 的资源上限（硬限） |
| `reclaimable` | 是否允许被别的 queue 通过 reclaim 抢回超出 weight 的部分 |

### 6.3 PodGroup 的关键参数

PodGroup 一般由 vcjob 自动生成，但可以手写以对接 Kubeflow / Ray 等外部编排：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: PodGroup
metadata:
  name: ray-gang
spec:
  minMember: 4
  priorityClassName: high-priority
  queue: team-a
  minResources:
    nvidia.com/gpu: "4"
```

| 字段 | 关键作用 |
|------|---------|
| `minMember` | gang 阈值，凑不齐就不调度 |
| `minResources` | 资源级 gang，比 minMember 更精细 |
| `priorityClassName` | 抢占优先级，配合 PriorityClass 使用 |
| `queue` | 所属队列 |

### 6.4 Binpack 与 Topology 调参

```
节点剩余资源越多 → binpack 分越低 → 越"不想"把 Pod 放这
节点剩余资源越少 → binpack 分越高 → 越"想"打包到这
```

| 参数 | 建议值 | 影响 |
|------|--------|------|
| `binpack.cpu/memory` | 1.0 ~ 2.0 | CPU/内存打包权重 |
| `binpack.resources.nvidia.com/gpu.weight` | 1000 | GPU 打包权重，越高越聚拢 |
| `topology.gpuWeight` | 5 ~ 10 | GPU 亲和（同 PCIe / NVLink） |
| `topology.numaWeight` | 3 ~ 8 | NUMA 节点亲和 |

---

## 7. 运维与可观测

### 7.1 关键监控指标

Volcano scheduler 内建 Prometheus metrics endpoint（默认 `:8080/metrics`）。

| 指标 | 含义 | 告警阈值建议 |
|------|------|-------------|
| `volcano_pod_group_pending` | Pending 的 PodGroup 数 | 持续 > 0 且无下降趋势 |
| `volcano_pod_group_unschedulable` | 因资源不足 Pending 的 PodGroup | 突增 = 集群扩容信号 |
| `volcano_queue_allocated_gpu` | 队列已分配 GPU | 接近 capability = 排队严重 |
| `volcano_e2e_job_scheduling_latency` | 端到端调度时延 | P95 > 60s 需排查 |
| `volcano_scheduler_action_duration_seconds` | 每个 action 耗时 | allocate > 5s = 性能瓶颈 |
| `volcano_task_preempt_count` | 抢占次数 | 突增 = 容量不足或优先级风暴 |

### 7.2 ServiceMonitor 示例

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: volcano-scheduler
  namespace: volcano-system
spec:
  selector:
    matchLabels:
      app: volcano-scheduler
  endpoints:
    - port: metrics
      interval: 15s
```

### 7.3 排查 Pending PodGroup

```bash
kubectl get podgroup -A -o wide
kubectl describe podgroup <name>
```

`Events` / `status.conditions` 会给出原因，典型类别：

| Pending 原因 | 含义 | 处理 |
|-------------|------|------|
| `unschedulable: lack of gpu` | 集群 GPU 不足 | 扩容节点 / 调小 minMember |
| `queue capability exceeded` | queue 超容量 | 调高 capability 或等回收 |
| `gang unsatisfied` | minMember 没凑齐 | 检查资源碎片、调 binpack |
| `no node matched predicates` | 亲和性 / 污点不匹配 | 检查 nodeSelector / tolerations |

### 7.4 常见运维操作

```bash
kubectl scale deploy volcano-scheduler -n volcano-system --replicas=2
kubectl get lease -n volcano-system
helm upgrade volcano volcano-sh/volcano -n volcano-system -f values.yaml
```

### 7.5 扩展性 / 性能调优

| 维度 | 调优方向 |
|------|---------|
| 调度周期 | 默认 1s，超大集群可调到 2~5s 降低 scheduler CPU |
| 单 scheduler 节点数 | 万节点以上需开 `schedulerName` 分片或接 Kueue 做二级调度 |
| PodGroup 数量 | 单 scheduler 建议 < 5000 个活跃 PodGroup |
| GPU 集群 | 务必开 binpack + topology，否则碎片化严重 |
| 抢占震荡 | 给所有训练 Job 配 PriorityClass，避免无限互相抢占 |

---

## 8. 对比与选择

### 8.1 主流 K8s 调度器横向对比

| 调度器 | 定位 | Gang | Queue | 抢占 | 适用场景 |
|--------|------|------|-------|------|---------|
| **kube-scheduler (原生)** | 通用、Pod 级 | ✗ | ✗ | 有限（PriorityClass） | 微服务、Web、无状态 |
| **Volcano** | 批处理 / HPC / AI 训练 | ✓ 原生 | ✓ 原生 | ✓ 强 | 分布式训练、EDA、渲染、大数据 |
| **Kueue** | 批处理作业准入（不替换 scheduler） | ✓（借 PodGroup） | ✓ | ✓（Lending/Borrowing） | 与 Volcano/默认 scheduler **叠加**做排队 |
| **KAI Scheduler** | Run:AI 出品，AI 训练特化 | ✓ | ✓ | ✓ | 多租户 GPU 训练、动态分区 |
| **YuniKorn** | 大数据 / 流处理调度 | 弱 | ✓ 强 | ✓ | Spark / Flink 队列层级公平 |

### 8.2 选型决策树

```
                  你的工作负载是？
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   微服务/Web      批处理/训练      流式/大数据
        │              │              │
        ▼              ▼              ▼
  kube-scheduler   需要 gang?       YuniKorn
                  ┌────┴────┐
                  ▼         ▼
              要(K8s原生)  否(单 Pod 训练)
                  │         │
                  ▼         ▼
           Volcano or    Kueue 叠加
           KAI Scheduler  默认 scheduler
                  │
                  ▼
      想要「调度」和「排队」分离?
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   Kueue + Volcano      仅 Volcano
   (推荐, 2025 趋势)
```

### 8.3 与 Kueue 的关系（重要）

Volcano 和 Kueue **不是二选一**。Kueue 解决"作业排队 / 配额 / 准入"，Volcano 解决"Pod 怎么放"。生产最佳实践是 **Kueue 在上层做配额与排队，Volcano 在下层做 gang 调度**，二者通过 PodGroup 协作。

---

## 9. 常见问题 FAQ

**Q1: Volcano 会替换掉 kube-scheduler 吗？**
不会，推荐共存。业务通过 `schedulerName: volcano` 显式选择，普通负载继续走默认 scheduler。

**Q2: 为什么我的 PodGroup 一直 Pending？**
最常见是 `minMember` 大于集群实际可空闲资源，或 queue 的 `capability` 已满。用 `kubectl describe podgroup` 看 `unschedulable` reason。

**Q3: Gang Scheduling 会不会让集群利用率下降？**
会有"等待期"，但通过 binpack + backfill 把小作业填进碎片，整体利用率通常反而提升（避免半个任务死锁占卡）。

**Q4: Volcano 能调度 RDMA / NVLink 拓扑吗？**
能。`topology` 插件支持 NUMA、GPU 拓扑感知；RDMA / IB 的精细化拓扑通常结合 SR-IOV Device Plugin 与节点 label 自定义打分。

**Q5: Volcano 与 Kubeflow Training-Operator 怎么配合？**
Training-Operator 负责生成 PyTorchJob/TensorFlowJob 的 Pod，并通过 `schedulerName: volcano` + 自动创建 PodGroup，把调度交给 Volcano。这是 LLM 分布式训练在 K8s 上的标准组合。

**Q6: 单 scheduler 能撑多大集群？**
官方与社区实测在数千节点、数千 PodGroup 规模下稳定；万节点以上建议开 scheduler 分片或叠加 Kueue 做层级化调度。

---

## Related

- [[CNCF_Cloud_Native_AI/README]]
- [[CNCF_Cloud_Native_AI/KAI_Scheduler_Deep_Dive]]
- [[CNCF_Cloud_Native_AI/Kueue_Deep_Dive]]
- [[11_MLOps_Pipeline/Orchestration/Kubeflow_Deep_Dive]]
- [[12_Architecture_Infrastructure/Architecture_Overview/AI_Infrastructure_2026]]
