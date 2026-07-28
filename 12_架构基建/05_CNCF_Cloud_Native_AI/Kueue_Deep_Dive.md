---
title: "Kueue: Kubernetes 原生作业排队系统"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "kueue", "scheduling", "batch", "quota"]
summary: "Kueue 是 Kubernetes SIGs 的作业排队/配额层,在 GPU 等稀缺资源紧张时按团队配额、优先级、公平共享决定谁能先跑,再把已准入的作业交给真正的调度器。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Kueue Deep Dive"
  - Kueue_Deep_Dive
sources: []

name_zh: "Kueue: Kubernetes 原生作业排队系统"
---
# Kueue: Kubernetes 原生作业排队系统

> 中文简称：Kueue: Kubernetes 原生作业排队系统

> **一句话理解**: Kueue 是 Kubernetes SIGs 的作业排队/配额层——它不调度,只负责在 GPU 等稀缺资源紧张时按团队配额/优先级/公平共享决定"谁能先跑",再把作业交给真正的调度器(Volcano/KAI/kube-scheduler)。

> 📐 **概念方法论**: Kueue 解决的是"准入控制"问题,而非"节点选择"问题。它与 [[05_CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] 形成互补——Volcano 是调度器,Kueue 是调度器之上的配额/排队层;二者常配合 [[11_模型运维/05_Orchestration/Kubeflow_Deep_Dive]] Training Operator 实现 AI/ML 训练作业的全链路管理。理解 Kueue 的关键在于区分 **admission(准入)** 与 **scheduling(调度)** 两层抽象。

## 目录

- [1. 概述](#1-概述)
- [2. 核心概念](#2-核心概念)
- [3. 架构设计](#3-架构设计)
- [4. 安装部署](#4-安装部署)
- [5. 快速开始](#5-快速开始)
- [6. 生产配置](#6-生产配置)
- [7. 运维与可观测](#7-运维与可观测)
- [8. 对比与选择](#8-对比与选择)
- [9. 常见问题 FAQ](#9-常见问题-faq)
- [Related](#related)

---

## 1. 概述

### 1.1 定位

Kueue 是 Kubernetes SIGs 旗下的开源项目(repository: `kubernetes-sigs/kueue`),已被纳入 CNCF Landscape 的 AI Native Infrastructure 分类。它的官方定位是:

> "Cloud-native job queueing system for batch, HPC, AI/ML, and similar applications in a Kubernetes cluster."

Kueue 的核心价值在于:**它不做调度,只做排队与准入**。在 GPU 等稀缺资源紧张的集群中,多个团队争抢资源时,Kueue 作为配额/排队层决定"哪个作业有资格进入调度",然后把已准入的作业交给真正的调度器(kube-scheduler、Volcano、KAI Scheduler)去完成节点绑定。

```
+=====================================================================+
|                    Kubernetes Cluster                               |
|                                                                     |
|   +-----------------+        +------------------+                    |
|   |  User / CI /    |  submit|  Kueue           |  admission only   |
|   |  Pipeline       |------->|  (排队 + 配额)    |---准入的作业----+ |
|   |  Job/RayJob/    |  Job   |  - LocalQueue    |                 | |
|   |  PyTorchJob ... |        |  - ClusterQueue  |                 | |
|   +-----------------+        |  - ResourceFlavor|                 | |
|                              +------------------+                 | |
|                                                     v             | |
|                                              +---------------+   | |
|                                              | Real Scheduler|   | |
|                                              | (Volcano/KAI/ |   | |
|                                              |  kube-sched)  |   | |
|                                              +-------+-------+   | |
|                                                      |           | |
|                                                      v           | |
|                                              +---------------+   | |
|                                              |  Node Pools   |   | |
|                                              |  GPU / CPU    |   | |
|                                              +---------------+   | |
+=====================================================================+
```

### 1.2 核心特性

| 特性 | 说明 | 典型场景 |
|------|------|----------|
| **Quota 配额管理** | 通过 ClusterQueue 定义资源配额池,按团队/项目分配 | GPU 卡数限制:团队 A 最多用 8 张 H100 |
| **Cohort 公平共享** | 同一 Cohort 内的多个 ClusterQueue 共享资源池,按权重公平分配 | 三个研究组共享 32 卡池,按 4:2:1 加权 |
| **Borrowing/Lending** | 允许借用他人闲置配额或借出自己的配额 | 团队 A 暂时不用 8 卡,团队 B 可借用 |
| **Preemption 抢占** | 高优先级作业可抢占低优先级作业,释放配额 | 紧急推理任务抢占低优先级训练任务 |
| **Framework Agnostic** | 支持 Job、JobSet、RayJob、Kubeflow 全系列、Pods | 同一套排队逻辑覆盖所有作业类型 |
| **Partial Admission** | 配额不足时允许以少于请求数量启动作业 | 请求 8 卡只有 4 卡可用,先起 4 卡 |
| **Provisioning 集成** | 与 ClusterAutoscaler 联动,按需触发节点扩容 | 队列积压时自动申请新 GPU 节点 |
| **Priority Class** | 利用 Kubernetes PriorityClass 控制作业优先级 | 生产 > 预发 > 实验任务 |

### 1.3 项目状态与版本历程

Kueue 由 Kubernetes SIG Scheduling 推动,与 AI/ML Working Group 紧密协作,是 Kubernetes 生态中批量/AI 作业排队的事实标准之一。

| 版本 | 时间 | 里程碑 |
|------|------|--------|
| v0.1 - v0.3 | 2022 - 2023 | 初始 CRD 设计,Job 集成,基础配额 |
| v0.4 - v0.5 | 2023 | Cohort fair share,preemption 策略完善 |
| v0.6 | 2024 Q1 | Partial admission,ProvisioningRequest 集成 |
| v0.7 - v0.8 | 2024 | JobSet/RayJob 集成,Kubeflow Training Operator GA |
| v0.9+ | 2025 | 多租户增强,borrowing limit,fair-share 算法优化 |

---

## 2. 核心概念

Kueue 围绕四个核心 CRD 和一个 Cohort 概念构建其抽象模型。

### 2.1 四大核心 CRD

| CRD | 层级 | 职责 | 类比 |
|-----|------|------|------|
| **ClusterQueue** | Cluster-scoped | 资源配额池,定义可用资源上限与公平共享策略 | 银行的总授信额度池 |
| **LocalQueue** | Namespace-scoped | 用户/团队的提交入口,指向一个 ClusterQueue | 团队的信贷申请窗口 |
| **ResourceFlavor** | Cluster-scoped | 节点类别定义,通过 label 匹配 node pool | "H100 GPU 池" vs "CPU 节点池" |
| **Workload** | Namespace-scoped | Kueue 内部对已提交作业的抽象表示 | 一笔具体的提款请求 |

### 2.2 Cohort(群组)

Cohort 是一组 ClusterQueue 的逻辑分组。同一 Cohort 内的 ClusterQueue 可以互相借用(lend/borrow)闲置配额,实现公平共享。Cohort 本身不是 CRD,而是 ClusterQueue 的一个字段属性。

### 2.3 准入流程

```
User submits Job
(with queue label: team-a)
       |
       v
+------------------+
|  LocalQueue      |   namespace: team-a
|  "team-a-lq"     |   points to: cluster-queue-a
+--------+---------+
         |
         v
+------------------+      belongs to cohort "research"
|  ClusterQueue    |   +-----------------------------------+
|  "cluster-       |   | 1. 检查 ResourceFlavor 配额       |
|   queue-a"       |   | 2. 评估 Cohort 内 fair share      |
+--------+---------+   | 3. 比较 PriorityClass 优先级      |
         |             | 4. 决定: admit / pending / preempt|
         |             +-----------------------------------+
         |
    +----+----+
    |         |
    v         v
 ADMIT     PENDING
    |     (webhook 挂起 Job:
    |      suspend=true)
    v
+------------------+
| Real Scheduler   |   kube-scheduler / Volcano / KAI
| 绑定到具体节点    |
+------------------+
    |
    v
Job Running on Nodes
(label: gpu-h100)
```

**关键机制**: 当作业提交后,Kueue 的 Validating/Mutating Webhook 会立即将 Job 设置为 `suspend: true`(挂起状态),阻止它进入调度。只有当 Kueue 的 controller 判定该作业可以准入时,才将其 `suspend` 改为 `false`,让真正的调度器接管。

---

## 3. 架构设计

### 3.1 组件架构

Kueue 以标准 Kubernetes Operator 模式部署,由两个核心组件构成:

```
+-------------------------------------------------------------------+
|  Kueue Deployment (通常 2 副本, leader-election)                   |
|                                                                   |
|  +-------------------------+        +--------------------------+   |
|  | Controller Manager      |        | Admission Webhook        |   |
|  |                         |        | (Validating + Mutating)  |   |
|  |  - ClusterQueue recon.  |        |                          |   |
|  |  - LocalQueue recon.    |        |  - 拦截 Job 创建/更新     |   |
|  |  - Workload recon.      |        |  - 注入 suspend=true     |   |
|  |  - Admission logic      |        |  - 校验 queue label      |   |
|  |  - Fair-share calc      |        |  - 注入 nodeSelector     |   |
|  |  - Preemption engine    |        |    (ResourceFlavor)      |   |
|  +-----------+-------------+        +------------+-------------+   |
|              |                                   |                 |
|              |          +------------+           |                 |
|              +--------->| API Server |<----------+                 |
|                         | (CRDs)     |                             |
|                         +------+-----+                             |
|                                ^                                   |
|                                | watch/reconcile                   |
+-------------------------------------------------------------------+
                                 |
                          +------+------+
                          |  Job CRDs   |
                          |  Job/JobSet |
                          |  RayJob     |
                          |  PyTorchJob |
                          |  MPIJob ... |
                          +-------------+
```

### 3.2 准入决策流程详解

1. **提交阶段**: 用户创建带 `kueue.x-k8s.io/queue-name` label 的 Job。
2. **Webhook 拦截**: Mutating Webhook 拦截请求,注入 `spec.suspend: true`,并将 nodeSelector 根据 ResourceFlavor 预留(准入后填入)。
3. **Workload 创建**: Controller 为该 Job 创建对应的 Workload 对象。
4. **排队等待**: Workload 进入 LocalQueue → ClusterQueue 的待处理列表。
5. **准入评估**: Controller 周期性扫描所有 pending Workload,按优先级 + 公平共享 + 配额可用性综合判定。
6. **准入执行**: 若可准入,Controller 将 Workload 标记为 admitted,解除 Job 的 suspend,填入 ResourceFlavor 的 nodeSelector。
7. **调度接管**: 真正的调度器接管,将 Pod 绑定到具体节点。

### 3.3 多框架集成

Kueue 通过"integration framework"机制适配不同作业类型,每种集成负责将特定 CRD 与 Kueue 的 Workload 抽象对接:

```
+-------------------+     +-------------------+
|   Job (batch/v1)  |     |   JobSet          |   多作业组合
|   kubectl job     |     |   (sigs.k8s.io)   |
+-------------------+     +-------------------+
         \                       /
+-------------------+     +-------------------+
|   RayJob          |     |   Kubeflow        |
|   (ray.io)        |     |   TFJob/PyTorchJob|
+-------------------+     |   MPIJob/PaddleJob|
         \                +-------------------+
          \                      /
           \                    /
    +-------+--------------------+-------+
    |          Kueue Workload            |
    |    (统一的准入/排队抽象层)          |
    +------------------------------------+
```

每种集成需在 Kueue 配置中显式启用。Job(原生 batch)默认启用,其余需通过 `manageJobsWithoutQueueName`、`integration` 等参数配置。

---

## 4. 安装部署

### 4.1 前置要求

- Kubernetes 1.27+
- 集群中已有可用的调度器(kube-scheduler / Volcano / KAI)
- 若使用 ProvisioningRequest 集成,需部署 ClusterAutoscaler 1.30+

### 4.2 Helm 安装(推荐)

```bash
helm repo add kueue https://kubernetes-sigs.github.io/kueue/
helm repo update

helm install kueue kueue/kueue \
  --namespace kueue-system \
  --create-namespace \
  --set enableClusterQueue=false \
  --set manager.featureGates=PartialAdmission=true,ProvisioningACC=true
```

### 4.3 kubectl 安装

```bash
# 最新稳定版
KUEUE_VERSION=v0.9.0
kubectl apply -f https://github.com/kubernetes-sigs/kueue/releases/download/${KUEUE_VERSION}/manifests.yaml
```

### 4.4 启用框架集成

安装后通过 Kueue Configuration 自定义要管理的作业类型:

```yaml
apiVersion: config.kueue.x-k8s.io/v1beta1
kind: Configuration
metadata:
  name: kueue-configuration
integrations:
  frameworks:
  - batch/job
  - jobset.x-k8s.io/jobset
  - ray.io/rayjob
  - kubeflow.org/pytorchjob
  - kubeflow.org/tfjob
  - kubeflow.org/mpijob
  - pod
manageJobsWithoutQueueName: false
internalCertManagement:
  enable: true
```

### 4.5 ResourceFlavor 与节点池标签

部署 Kueue 前,确保节点池已正确打标:

```bash
# H100 GPU 节点池
kubectl label nodes node-gpu-h100-01 node.kubernetes.io/instance-type=h100-80gb
kubectl label nodes node-gpu-h100-01 accelerator=nvidia-h100

# CPU 节点池
kubectl label nodes node-cpu-01 pool-type=cpu-spot
```

---

## 5. 快速开始

以下完整示例演示:定义 GPU 资源类别 → 创建配额池 → 创建团队队列 → 提交训练作业 → 观察从 pending 到 running。

### 5.1 定义 ResourceFlavor

```yaml
apiVersion: kueue.x-k8s.io/v1beta1
kind: ResourceFlavor
metadata:
  name: gpu-h100
spec:
  nodeLabels:
    accelerator: nvidia-h100
---
apiVersion: kueue.x-k8s.io/v1beta1
kind: ResourceFlavor
metadata:
  name: cpu-pool
spec:
  nodeLabels:
    pool-type: cpu-spot
```

### 5.2 创建 ClusterQueue(配额池)

```yaml
apiVersion: kueue.x-k8s.io/v1beta1
kind: ClusterQueue
metadata:
  name: cluster-queue-team-a
spec:
  namespaceSelector: {}
  cohort: research-cohort
  resourceGroups:
  - coveredResources: ["cpu", "memory", "nvidia.com/gpu"]
    flavors:
    - name: gpu-h100
      resources:
      - name: cpu
        nominalQuota: 64
      - name: memory
        nominalQuota: 512Gi
      - name: nvidia.com/gpu
        nominalQuota: 8
    - name: cpu-pool
      resources:
      - name: cpu
        nominalQuota: 100
      - name: memory
        nominalQuota: 256Gi
```

### 5.3 创建 LocalQueue(团队入口)

```yaml
apiVersion: kueue.x-k8s.io/v1beta1
kind: LocalQueue
metadata:
  name: team-a-lq
  namespace: team-a
  labels:
    kueue.x-k8s.io/cluster-queue: cluster-queue-team-a
spec:
  clusterQueue: cluster-queue-team-a
```

### 5.4 提交训练作业

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: llm-training-job
  namespace: team-a
  labels:
    kueue.x-k8s.io/queue-name: team-a-lq
spec:
  suspend: true
  priorityClassName: high-priority
  template:
    spec:
      containers:
      - name: trainer
        image: pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime
        command: ["python", "train.py"]
        resources:
          requests:
            cpu: 8
            memory: 64Gi
            nvidia.com/gpu: 2
      restartPolicy: Never
```

### 5.5 观察作业流转

```bash
# 查看 Workload 状态
kubectl get workloads -n team-a

# 输出示例:
# NAME                  QUEUE       RESERVED   ADMITTED   FINISHED
# llm-training-job      team-a-lq   60s        45s

# 查看 Job 状态
kubectl get jobs -n team-a
# NAME                COMPLETIONS   DURATION   AGE
# llm-training-job    0/1           2m         3m

# 查看 ClusterQueue 配额使用情况
kubectl get clusterqueue cluster-queue-team-a -o yaml | grep -A10 admittedWorkloads
```

---

## 6. 生产配置

### 6.1 Cohort 公平共享

将多个团队的 ClusterQueue 归入同一 Cohort,实现跨团队公平分配:

```yaml
apiVersion: kueue.x-k8s.io/v1beta1
kind: ClusterQueue
metadata:
  name: cluster-queue-team-a
spec:
  cohort: research-cohort
  fairSharing:
    weight: 4
  resourceGroups:
  - coveredResources: ["nvidia.com/gpu"]
    flavors:
    - name: gpu-h100
      resources:
      - name: nvidia.com/gpu
        nominalQuota: 8
        borrowingLimit: 8
---
apiVersion: kueue.x-k8s.io/v1beta1
kind: ClusterQueue
metadata:
  name: cluster-queue-team-b
spec:
  cohort: research-cohort
  fairSharing:
    weight: 2
  resourceGroups:
  - coveredResources: ["nvidia.com/gpu"]
    flavors:
    - name: gpu-h100
      resources:
      - name: nvidia.com/gpu
        nominalQuota: 4
        borrowingLimit: 8
```

上述配置中,team-a 权重 4、team-b 权重 2,空闲资源按 2:1 比例分配。`borrowingLimit` 限制单方可借用的最大额外配额。

### 6.2 Preemption 抢占策略

```yaml
apiVersion: kueue.x-k8s.io/v1beta1
kind: ClusterQueue
metadata:
  name: cluster-queue-prod
spec:
  cohort: production-cohort
  preemption:
    reclaimWithinCohort: LowerPriority
    withinClusterQueue: LowerPriority
    borrowWithinCohort:
      policy: LowerPriority
      maxPriorityThreshold: 100
  reclaimWithinCohort: LowerPriority
  resourceGroups:
  - coveredResources: ["nvidia.com/gpu"]
    flavors:
    - name: gpu-h100
      resources:
      - name: nvidia.com/gpu
        nominalQuota: 16
```

| 策略字段 | 触发条件 | 行为 |
|----------|----------|------|
| `reclaimWithinCohort` | 同 Cohort 内本方配额被借用 | 抢占低优先级借入方作业 |
| `withinClusterQueue` | 本 ClusterQueue 内高优先级作业等待 | 抢占同队列低优先级作业 |
| `borrowWithinCohort` | 借用他方配额时 | 仅抢占低于阈值的低优先级作业 |

### 6.3 Partial Admission(部分准入)

```yaml
apiVersion: kueue.x-k8s.io/v1beta1
kind: Workload
metadata:
  name: distributed-training
spec:
  podSets:
  - name: workers
    template:
      spec:
        containers:
        - name: worker
          image: pytorch:latest
          resources:
            requests:
              nvidia.com/gpu: 1
    count: 8
    minCount: 4
```

`minCount: 4` 表示当配额不足时,至少 4 个 worker 即可启动,不必等待全部 8 个。

### 6.4 ProvisioningRequest 自动扩容

```yaml
apiVersion: kueue.x-k8s.io/v1beta1
kind: ClusterQueue
metadata:
  name: cluster-queue-autoscale
spec:
  provisioning:
    provisioningClass: cluster-autoscaler.autoscaling.x-k8s.io/provisioning-request
    minBackoffSeconds: 30
  resourceGroups:
  - coveredResources: ["nvidia.com/gpu"]
    flavors:
    - name: gpu-h100
      resources:
      - name: nvidia.com/gpu
        nominalQuota: 64
```

当队列积压且现有节点不足时,Kueue 自动创建 ProvisioningRequest,触发 ClusterAutoscaler 扩容 GPU 节点。

---

## 7. 运维与可观测

### 7.1 Workload 状态流转

```
+----------+     +----------+     +-----------+     +----------+
| PENDING  |---->| RESERVED |---->| ADMITTED  |---->| FINISHED |
| (排队中) |     | (配额预留)|    | (已准入)  |     | (完成)   |
+----------+     +----------+     +-----------+     +----------+
      |               |                 |
      |               |                 v
      |               |          +-----------+
      |               +--------->| PREEMPTED |
      |               (抢占回退) | (被抢占)   |
      |                          +-----+-----+
      |                                |
      +--------------------------------+
        (重新排队等待)
```

### 7.2 关键监控命令

```bash
# 查看所有 ClusterQueue 的配额使用
kubectl get clusterqueues -o custom-columns=\
NAME:.metadata.name,\
COHORT:.spec.cohort,\
PENDING:.status.pendingWorkloads,\
ADMITTED:.status.admittedWorkloads

# 查看特定 LocalQueue 的排队情况
kubectl get localqueue team-a-lq -o yaml | grep -A5 status

# 查看 Workload 的准入事件
kubectl describe workload llm-training-job -n team-a

# 查看 Kueue controller 日志
kubectl logs -n kueue-system -l app=kueue -f | grep -i admission
```

### 7.3 Prometheus 指标

Kueue 暴露以下核心指标(默认 `:8080/metrics`):

| 指标 | 类型 | 说明 |
|------|------|------|
| `kueue_pending_workloads` | Gauge | 各 ClusterQueue/LocalQueue 中等待的 Workload 数 |
| `kueue_admitted_workloads_total` | Counter | 累计准入的 Workload 数 |
| `kueue_cluster_queue_resource_usage` | Gauge | 每个 ClusterQueue 的实际资源占用 |
| `kueue_cluster_queue_status` | Gauge | ClusterQueue 状态(active/pending) |
| `kueue_local_queue_pending_workloads` | Gauge | 每个 LocalQueue 的 pending 数量 |

### 7.4 常见故障排查

**问题: 作业一直 Pending 不准入**

```bash
# 检查 Workload 的 status.conditions
kubectl get workload <name> -o yaml | grep -A15 conditions

# 常见原因:
# 1. ResourceFlavor label 与节点不匹配
# 2. 超过 nominalQuota 且无可借用配额
# 3. PriorityClass 缺失
```

**问题: Preemption 风暴**

```
排查步骤:
1. 检查是否有过多高优先级作业交替抢占
2. 审查 preemption.policy 配置是否过于激进
3. 考虑设置 borrowWithinCohort.maxPriorityThreshold
4. 通过 PriorityClass 拉开优先级差距
```

**问题: ResourceFlavor 不匹配**

```bash
# 验证节点标签是否与 ResourceFlavor 一致
kubectl get nodes --show-labels | grep accelerator

# 确认 ResourceFlavor 定义
kubectl get resourceflavor gpu-h100 -o yaml | grep -A5 nodeLabels
```

---

## 8. 对比与选择

### 8.1 排队方案横向对比

| 维度 | Kueue | Volcano Queues | YuniKorn | Kube 默认 |
|------|-------|----------------|----------|-----------|
| **定位** | 准入/配额层 | 调度器 + 队列 | 调度器 + 队列 | 无原生队列 |
| **是否调度** | 否(交给调度器) | 是(自身调度) | 是(自身调度) | kube-scheduler |
| **配额管理** | 强(ClusterQueue + Cohort) | 中(Queue + capability) | 强(Queue + hierarchy) | 弱(仅 ResourceQuota) |
| **公平共享** | Cohort fair-share | 超卖/权重 | DRF/Dominant Resource | 无 |
| **抢占** | 配额级抢占 | 调度级抢占 | 调度级抢占 | PriorityClass |
| **AI/ML 框架** | JobSet/RayJob/Kubeflow | 原生 gang scheduling | 通用 | 无 |
| **与现有调度器共存** | 是(叠加) | 否(替换) | 否(替换) | - |

### 8.2 选型建议

```
已有 kube-scheduler,只需配额/排队?
    |
    +---> YES: Kueue (叠加,不替换调度器)
    |
    +---> 需要 gang scheduling(全部 Pod 一起调度)?
              |
              +---> YES: Volcano 或 KAI Scheduler
              |
              +---> 需要 Kueue 配额 + Volcano gang?
                        |
                        +---> YES: Kueue + Volcano 组合
                               (Kueue 管准入,Volcano 管调度)

多租户细粒度层级配额?
    |
    +---> YuniKorn (Queue 层级 + DRF)
```

**Kueue 最适合**: 已有稳定调度器(kube-scheduler 或 Volcano),需要在其之上增加"按团队配额、公平共享、优先级抢占"的准入控制层。这是大多数 AI/ML 平台的场景——GPU 昂贵,必须公平分配。

---

## 9. 常见问题 FAQ

**Q1: Kueue 和 Volcano 能同时用吗?**

可以,且这是生产常见组合。Kueue 负责"谁能跑"(准入/配额),Volcano 负责"跑到哪"(gang scheduling/节点绑定)。Kueue 准入后解除 Job 的 suspend,Volcano 接管 Pod 调度。

**Q2: Kueue 会改变 kube-scheduler 的行为吗?**

不会。Kueue 仅通过 `suspend: true/false` 控制 Job 是否进入调度。一旦 unsuspend,作业完全由现有调度器处理,Kueue 不干预节点选择。

**Q3: 如果不配置 ResourceFlavor 会怎样?**

Kueue 要求每个 ClusterQueue 引用的 flavor 必须有对应的 ResourceFlavor。缺失会导致 Workload 永远 Pending。最简方案是创建一个 `default-flavor`,不带 nodeLabels,表示无特殊节点偏好。

**Q4: Partial Admission 对分布式训练有风险吗?**

有。部分准入启动的 worker 数少于请求数,可能导致分布式训练拓扑变化。需要确保训练框架支持动态 worker 数(如弹性训练)。对需要固定 world_size 的作业,不应启用 Partial Admission。

**Q5: Borrowing 会不会导致配额失控?**

通过 `borrowingLimit` 字段可限制单方可借用的最大额度。Cohort fair-share 算法也会在对方需要时触发 reclaim 抢占。合理配置 weight 和 borrowingLimit 即可防止失控。

**Q6: Kueue 支持 Kubernetes 原生 PriorityClass 吗?**

支持。Kueue 直接使用 Kubernetes PriorityClass 进行优先级排序,无需额外配置。PriorityClass 的 value 越高,越优先准入和抢占。

---

## Related

- [[05_CNCF_Cloud_Native_AI/README]] — CNNF 云原生 AI 生态总览
- [[05_CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] — Volcano 批量调度器(Kueue 的下游调度器)
- [[05_CNCF_Cloud_Native_AI/KAI_Scheduler_Deep_Dive]] — KAI Scheduler(AI 专用调度器)
- [[05_CNCF_Cloud_Native_AI/KubeRay_Deep_Dive]] — KubeRay(RayJob on Kubernetes,Kueue 集成对象)
- [[11_模型运维/05_Orchestration/Kubeflow_Deep_Dive]] — Kubeflow Training Operator(Kueue 的主要 AI 作业集成)
