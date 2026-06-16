---
title: "KAI Scheduler: 大规模 AI GPU 调度器"
category: "12-architecture-infrastructure"
tags: ["cncf", "kubernetes", "scheduling", "kai-scheduler", "gpu", "topology"]
summary: "> **一句话理解**: KAI Scheduler 是为万卡级 AI 集群设计的 CNCF 沙箱调度器——靠拓扑感知（同机架/同交换机优先）+ 主动碎片整理 + 大规模公平调度，在 GPU 紧张时把吞吐和拓扑带宽同时拉满。"
created: "2026-06-16"
updated: "2026-06-16"
---

# KAI Scheduler: 大规模 AI GPU 调度器

> **一句话理解**: KAI Scheduler 是为万卡级 AI 集群设计的 CNCF 沙箱调度器——靠拓扑感知（同机架/同交换机优先）+ 主动碎片整理 + 大规模公平调度，在 GPU 紧张时把吞吐和拓扑带宽同时拉满。

> 📐 **概念方法论**: 把 kube-scheduler 当作"单 Pod 资源匹配器"，那 KAI Scheduler 就是"集群级 GPU 拓扑优化器 + 碎片整理器 + 公平仲裁器"。它解决的不是"Pod 能不能调度"，而是"在一个万卡集群里，**分布式训练的 N 张卡能不能放在同一台交换机下面、整体碎片率最低、各团队排队公平**"。与 [[CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] 同属"批调度"族，但 KAI 把拓扑感知做到了第一公民；选型时结合 [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] 看 GPU 集群规模与训练拓扑诉求。

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

KAI Scheduler 最初由 Sapia（微软体系）为超大规模 AI 训练集群自研，2024 年开源、2025 年捐入 CNCF Sandbox。它的定位很窄也很硬核：**当集群规模来到数千乃至数万张 GPU，kube-scheduler 和 Volcano 都会在「拓扑带宽、GPU 碎片、调度延迟、公平性」这四个维度上同时撞墙**——KAI 就是为这个区间设计的。

```
┌──────────────────────────────────────────────────────────────────┐
│                  GPU 集群规模 vs 调度器选型                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   规模        典型痛点                         推荐调度器          │
│   ───────────────────────────────────────────────────────────    │
│   < 64 卡     没有                              kube-scheduler     │
│   64 ~ 1k     缺 Gang/队列                      Volcano / Kueue    │
│   1k ~ 10k+   拓扑带宽 + 碎片 + 公平性同时爆掉   KAI Scheduler      │
│                                                                  │
│   KAI 的硬约束:                                                   │
│     • 训练卡 99% 是分布式 (DDP/FSDP/Megatron) → 必须 Gang         │
│     • NCCL/RDMA 跨交换机带宽骤降 → 必须拓扑感知                    │
│     • 万卡集群碎片率 5% 就是几百张卡 → 必须主动碎片整理            │
│     • 多团队共享 → 必须层级公平                                    │
└──────────────────────────────────────────────────────────────────┘
```

一句话：**KAI = 拓扑感知 + Gang 调度 + 主动碎片整理 + 层级公平分享，四件套压在一个调度器里**。它以独立 `schedulerName` 运行，不替换 kube-scheduler，业务 Pod 各取所需。

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| Topology-aware Scheduling | 按 node / switch / rack / NUMA 域聚合，优先选物理相邻的 GPU，最大化 NCCL/RDMA 有效带宽 |
| Gang Scheduling | 基于 `PodGroup`，凑齐 `minAvailable` 才整体绑定，避免半占资源死锁 |
| Bin Packing + 主动碎片整理 | 调度时按 bin-packing 紧凑放置；运行期主动迁移/驱逐零散 Pod 去拼出大块连续 GPU |
| Resilient Scheduling | 节点 churn（故障/上下线）下自动重算、补齐、抢占恢复，保障训练 SLA |
| Hierarchical Fair Share | `Queue` 树 + 权重/配额，跨多租户/多团队在大集群里维持公平与抢占语义 |
| 海量规模 | 单调度器支撑万级 GPU、万级 Pod，调度循环针对批量场景调优 |
| 与 PriorityClass 联动 | 原生集成 K8s `PriorityClass`，支持抢占与优先级仲裁 |
| 不替换 kube-scheduler | 通过 `schedulerName: kai-scheduler` 接管 AI 工作负载，其余 Pod 走默认链 |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 | 说明 |
|------|------|------|
| 2024 | 项目开源 | Sapia/Microsoft 将内部万卡训练调度器脱敏开源，命名 KAI Scheduler |
| 2024–2025 | 生产打磨 | 在超大规模训练集群中持续迭代，强调拓扑/碎片/公平 |
| 2025 | CNCF Sandbox 接纳 | 作为 Sandbox 项目进入 CNCF 生态 |
| v1.x (2025) | 首个稳定大版本 | CRD（PodGroup / Queue）、Helm chart、文档体系成型 |

> 仓库：<https://github.com/kai-scheduler/KAI-Scheduler> ｜ License: Apache-2.0 ｜ 主要维护方: Sapia / Microsoft 及社区

---

## 2. 核心概念

### 2.1 PodGroup

`PodGroup` 是一组需要**协同调度**的 Pod 集合（典型场景：一个分布式训练 job 的所有 worker）。它声明 `minAvailable`，调度器据此做 Gang：凑不够就整体 pending，凑得齐才原子绑定。

```yaml
apiVersion: kai.scheduler/v1
kind: PodGroup
metadata:
  name: llm-train-pg
spec:
  minMember: 8
  queue: team-llm
  priorityClassName: high-priority
```

### 2.2 层级 Queue

`Queue` 是一棵树。根队列下挂子队列，每个队列带 `weight`（公平分享权重）与 `quota`（硬上限）。抢占与公平分享在树状结构上递归计算——这是万卡集群多团队共存的基石。

```
                   ┌──────────────────┐
                   │  root (cluster)  │
                   └────────┬─────────┘
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌────────────┐    ┌────────────┐    ┌────────────┐
   │ team-research│  │ team-product│  │ team-shared │
   │  weight=3    │  │  weight=1    │  │  weight=1    │
   └──────┬─────┘    └────────────┘    └────────────┘
          ▼
   ┌────────────┐
   │ pretrain   │
   │ weight=2   │
   └────────────┘
```

### 2.3 拓扑域 (Topology Domain)

KAI 用一组标签把物理拓扑暴露给调度器，常见层级由细到粗：

| 层级 | 节点标签示例 | 含义 |
|------|--------------|------|
| NUMA | `topology.kai/numa=0` | 同 NUMA，跨卡带宽最高 |
| Node | （节点本身） | 单机多卡，NVLink 域 |
| Switch | `topology.kai/switch=sw-12` | 同 ToR 交换机，RDMA 低跳数 |
| Rack | `topology.kai/rack=rack-3` | 同机架 |
| Row / Pod | `topology.kai=row=row-1` | 同行列，跨机架但同汇聚层 |

调度器优先在同 NUMA/同 Node 内凑卡，凑不齐再逐级放大到 switch → rack → row。跨层级每跳一级，NCCL allreduce 的有效带宽会显著下降——这就是拓扑感知的核心动机。

### 2.4 碎片 (Fragmentation)

GPU 碎片指「集群总量够、但找不到一块连续的 N 卡可用区」。比如 1000 张卡里只剩零散的 1~2 张分布各处，总量是 200 但起不了 1 个 8 卡训练 job。KAI 做两件事：

1. **调度期 bin-packing**：紧凑摆放，优先填满同一台机器/交换机，留下大块连续区。
2. **运行期 defrag**：识别碎片区，主动迁移/驱逐低优先级小 Pod，把零散卡拼成大块供 Gang 使用。

```
   碎片化（KAI 未接管）           KAI 主动碎片整理后
   ┌──┬──┬──┬──┬──┐              ┌──┬──┬──┬──┬──┐
   │A.│.B│A.│.B│A.│              │AA│AA│AA│..│BB│
   ├──┼──┼──┼──┼──┤              ├──┼──┼──┼──┼──┤
   │.B│A.│.B│A.│.B│   ───────►   │BB│..│..│..│..│
   ├──┼──┼──┼──┼──┤   defrag     ├──┼──┼──┼──┼──┤
   │A.│.B│A.│.B│A.│              │AA│AA│..│..│..│
   └──┴──┴──┴──┴──┘              └──┴──┴──┴──┴──┘
   A/B 交错，起不了 8 卡 job      A、B 各成块，能起新 job
```

---

## 3. 架构设计

### 3.1 组件总览

KAI Scheduler 以独立调度进程运行，通过 kube-apiserver 监听 Pod / PodGroup / Queue / Node，在内存里维护一份**集群视图 + 拓扑索引 + 公平状态机**，输出绑定决策。

```
┌────────────────────────────────────────────────────────────────┐
│                      kube-apiserver                            │
└──────────────┬─────────────────────────────────┬───────────────┘
               │ watch                           │ bind
               ▼                                 ▲
┌──────────────────────────────────────────────────────────────┐
│                      KAI Scheduler                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Cluster View │  │ Topology     │  │ Fair-share / Queue │  │
│  │ (节点/卡/余) │  │ Index        │  │ State Machine      │  │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬──────────┘  │
│         └──────────┬──────┴────────────────────┘             │
│                    ▼                                          │
│         ┌──────────────────────┐    ┌──────────────────┐      │
│         │  Scheduling Loop     │───►│  Defrag / Migrate│      │
│         │ filter→score→        │    │  Controller      │      │
│         │ topology-fit→fair    │    └──────────────────┘      │
│         └──────────┬───────────┘                              │
│                    ▼                                          │
│            bind Pod → Node（schedulerName=kai-scheduler）     │
└──────────────────────────────────────────────────────────────┘
               ▲                                 
               │ PodGroup/Queue CRD（用户提交）
            ┌──┴───────────────┐
            │  AI Workloads    │  分布式训练 / 推理 / 评估
            └──────────────────┘
```

### 3.2 调度循环

每个周期，KAI 按以下步骤处理一批 pending PodGroup：

```
   ┌─────────────┐
   │ 1. Filter   │  按 GPU 型号/驱动/CUDA/标签过滤候选节点
   └──────┬──────┘
          ▼
   ┌─────────────┐
   │ 2. Score    │  bin-packing 评分（紧凑度）+ 反碎片评分
   └──────┬──────┘
          ▼
   ┌─────────────────┐
   │ 3. Topology-Fit │  在拓扑树上贪心找最小跨度域
   │                 │  (NUMA→Node→Switch→Rack→Row 逐级放大)
   └──────┬──────────┘
          ▼
   ┌─────────────────┐
   │ 4. Gang-Check   │  PodGroup 是否凑齐 minAvailable？
   │                 │  否 → 整组 pending；是 → 原子绑定
   └──────┬──────────┘
          ▼
   ┌─────────────────┐
   │ 5. Fair-Arbit   │  跨 Queue 公平仲裁 + 抢占决策
   │                 │  超额方低优先级 Pod 被驱逐
   └──────┬──────────┘
          ▼
   ┌─────────────┐
   │ 6. Bind     │  写回 Pod→Node 绑定
   └─────────────┘
```

### 3.3 与 kube-scheduler 共存

KAI 不替换 kube-scheduler。集群里 kube-scheduler 仍负责普通 Pod（CoreDNS、Prometheus、DaemonSet 等），AI 工作负载通过 `schedulerName: kai-scheduler` 显式路由给 KAI。两者共享同一份 Node/Resource 视图（都来自 apiserver），通过绑定动作互不干扰。

---

## 4. 安装部署

### 4.1 前置条件

| 项 | 要求 |
|----|------|
| Kubernetes | >= 1.27 |
| GPU 节点 | 已装 NVIDIA GPU Operator / device plugin，`nvidia.com/gpu` 可上报 |
| 网络 fabrics | RDMA / RoCE 推荐，拓扑感知才有意义 |
| 拓扑标签 | 节点需打 `topology.kai/{switch,rack,row,...}` 标签 |
| Helm | >= 3.10 |
| RBAC | KAI 需对 Pod/PodGroup/Queue/Node 的读写权限 |

### 4.2 给节点打拓扑标签

```bash
# 示例：把节点按物理位置标记
kubectl label node gpu-node-01 topology.kai/switch=sw-12
kubectl label node gpu-node-01 topology.kai/rack=rack-03
kubectl label node gpu-node-01 topology.kai/row=row-1
kubectl label node gpu-node-01 topology.kai/numa-range=0-3

# 批量从 CMDB 同步（示例）
# for n in $(kubectl get nodes -l node-role.kubernetes.io/gpu -o name); do
#   kubectl label $n topology.kai/switch=$(switch_of $n) ...
# done
```

> 拓扑标签是 KAI 拓扑感知的前提。标签越准（NUMA 级最细），调度质量越高；缺失标签的节点会被降级处理。

### 4.3 Helm 安装

```bash
helm repo add kai-scheduler https://kai-scheduler.github.io/charts
helm repo update

helm upgrade --install kai-scheduler kai-scheduler/kai-scheduler \
  --namespace kai-system \
  --create-namespace \
  --set scheduler.name=kai-scheduler \
  --set scheduler.leaderElect=true \
  --set defrag.enabled=true \
  --set topology.levels=numa,node,switch,rack,row
```

### 4.4 版本兼容矩阵

| KAI Scheduler | Kubernetes | GPU Operator | PodGroup/Queue CRD |
|---------------|------------|--------------|--------------------|
| v1.0 | 1.27–1.30 | >= v23 | v1 |
| v1.1+ | 1.28–1.31 | >= v24 | v1（向后兼容） |

---

## 5. 快速开始

### 5.1 建一棵 Queue 树

```yaml
apiVersion: kai.scheduler/v1
kind: Queue
metadata:
  name: root
spec:
  weight: 1
---
apiVersion: kai.scheduler/v1
kind: Queue
metadata:
  name: team-research
spec:
  parent: root
  weight: 3
  quota:
    nvidia.com/gpu: 4000
---
apiVersion: kai.scheduler/v1
kind: Queue
metadata:
  name: pretrain
spec:
  parent: team-research
  weight: 2
```

### 5.2 提交一个分布式训练 PodGroup

```yaml
apiVersion: kai.scheduler/v1
kind: PodGroup
metadata:
  name: llm-pretrain-pg
spec:
  minMember: 8
  queue: pretrain
  priorityClassName: train-high
  topologyPolicy: BestEffortCompact
---
apiVersion: v1
kind: Pod
metadata:
  name: trainer-0
  labels:
    kai.scheduler/pod-group: llm-pretrain-pg
spec:
  schedulerName: kai-scheduler
  priorityClassName: train-high
  restartPolicy: OnFailure
  containers:
  - name: trainer
    image: registry.internal/llm-trainer:v0.1
    command: ["torchrun", "train.py"]
    resources:
      limits:
        nvidia.com/gpu: 8
        rdma/rdma-shared: 1
    volumeMounts:
    - name: shm
      mountPath: /dev/shm
    - name: ib
      mountPath: /dev/infiniband
  volumes:
  - name: shm
    emptyDir:
      medium: Memory
      sizeLimit: 64Gi
  - name: ib
    hostPath:
      path: /dev/infiniband
```

> 其余 worker（`trainer-1` … `trainer-7`）模板相同，仅改 `name`。凑齐 8 个 worker（每机 8 卡 = 64 卡）后 KAI 原子绑定并尽量落在同一交换机域下。

### 5.3 常用 kubectl 命令

```bash
# 查看队列与公平份额
kubectl get queue -o wide
kubectl describe queue pretrain

# 查看 PodGroup 状态（是否 Gang 成功）
kubectl get podgroup
kubectl describe podgroup llm-pretrain-pg

# 看调度器决策日志
kubectl logs -n kai-system -l app.kubernetes.io/name=kai-scheduler -f

# 确认绑定结果与拓扑分布
kubectl get pods -o wide --show-labels \
  -l kai.scheduler/pod-group=llm-pretrain-pg
```

---

## 6. 生产配置

### 6.1 拓扑感知策略

```yaml
spec:
  topologyPolicy: BestEffortCompact
```

| 取值 | 行为 |
|------|------|
| `BestEffortCompact` | 优先紧凑拓扑，凑不齐时逐级放大，最终放宽（推荐默认） |
| `Strict` | 强制满足声明层级（如必须同 switch），否则整组 pending |
| `Spread` | 反向：尽量分散，用于推理服务高可用 |

### 6.2 碎片整理强度

```yaml
# values.yaml 片段
defrag:
  enabled: true
  aggressiveness: medium        # low / medium / high
  evaluationIntervalSeconds: 60
  maxMigrationsPerCycle: 10
  onlyLowerPriorityThan: 50     # 只迁移优先级 < 50 的 Pod
```

| 强度 | 迁移频率 | 适用 |
|------|----------|------|
| `low` | 保守，仅整理显眼大碎片 | 推理为主、对迁移敏感 |
| `medium` | 平衡（默认） | 训练+推理混部 |
| `high` | 激进拼整 | 纯训练大集群，吞吐优先 |

### 6.3 Queue 权重与配额

```yaml
spec:
  weight: 3
  quota:
    nvidia.com/gpu: 4000
  maxQuota:
    nvidia.com/gpu: 6000
```

- `weight`：公平分享权重（相对比例）。
- `quota`：保证下限（guaranteed）。
- `maxQuota`：硬上限，即便有空闲也不能超。

### 6.4 Gang 与抢占

```yaml
apiVersion: kai.scheduler/v1
kind: PodGroup
spec:
  minMember: 8
  scheduleTimeoutSeconds: 1800
  preemptPolicy: LowerPriority
---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: train-high
value: 1000000
globalDefault: false
preemptionPolicy: PreemptLowerPriority
```

### 6.5 生产级调度器参数（节选）

```yaml
scheduler:
  name: kai-scheduler
  leaderElect: true
  leaderElectLease: 15s
  schedulingCycle:
    batchIntervalMilliseconds: 200
    maxBatchSize: 500
  fairness:
    drf: true
    preemption:
      enabled: true
      cooldownSeconds: 300
  topology:
    levels: numa,node,switch,rack,row
    bandwidthHint:
      switch: 400        # Gb/s，用于打分权重
      rack: 200
      row: 100
```

---

## 7. 运维与可观测

### 7.1 关键指标

| 指标 | 含义 | 关注点 |
|------|------|--------|
| `kai_scheduling_latency_seconds` | 单次调度循环耗时 | P99 应 < 数百 ms；变大说明负载或锁竞争 |
| `kai_podgang_pending_seconds` | PodGroup pending 时长 | 训练作业排队时间，公平性体感来源 |
| `kai_fragmentation_ratio` | 集群碎片率 | 持续 > 10% 需调高 defrag 强度 |
| `kai_topology_distance_distribution` | 已绑定 PodGroup 的拓扑跨度分布 | switch 占比越高越好 |
| `kai_queue_allocated / guaranteed` | 各队列分配/保证量 | 是否有人长期超占 |
| `kai_defrag_migrations_total` | 碎片整理迁移次数 | 突增可能是 churn 或策略过激 |
| `kai_preemptions_total` | 抢占次数 | 频繁抢占提示权重/配额失衡 |

### 7.2 Prometheus 接入

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: kai-scheduler
  namespace: kai-system
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: kai-scheduler
  endpoints:
  - port: metrics
    interval: 15s
```

常用 PromQL：

```promql
# 平均调度延迟
avg(histogram_quantile(0.95, rate(kai_scheduling_latency_seconds_bucket[5m])))

# 集群碎片率
avg(kai_fragmentation_ratio)

# 各队列 GPU 占用率
kai_queue_allocated{resource="nvidia.com/gpu"}
  / on(queue) kai_queue_guaranteed{resource="nvidia.com/gpu"}
```

### 7.3 排错速查

| 现象 | 可能原因 | 排查 |
|------|----------|------|
| PodGroup 一直 `Unschedulable` | 凑不齐 `minMember`；拓扑过严；队列超 `maxQuota` | `describe podgroup` 看 Events；临时放宽 `topologyPolicy` |
| 调度延迟 P99 突增 | pending 量过大；锁竞争；集群视图滞后 | 调大 `batchInterval`；检查 leader 选举；看 apiserver RT |
| 拓扑违规（跨交换机） | 节点拓扑标签缺失；`BestEffort` 放宽了 | 检查标签覆盖率；提升 `Strict` 或补标签 |
| Gang 饥饿（饿死） | 大 job 长期排队抢不到 | 调队列权重；启用抢占；拆分 `minMember` |
| Defrag churn（反复迁移） | `aggressiveness=high` + 高 churn | 降为 `medium`；调小 `maxMigrationsPerCycle` |
| 高优先级被反复抢占 | 公平仲裁震荡；权重悬殊 | 检查 Queue 权重；调 `preemption.cooldownSeconds` |

### 7.4 规模调优要点

- 单实例瓶颈在万级 Pod 量级后显现，启用 `leaderElect` 多副本只解决 HA 不解决吞吐；真正扩容靠分片（按 Queue / namespace 分片多实例）。
- `batchInterval` 与 `maxBatchSize` 是吞吐 vs 时延的旋钮：训练批作业拉大，推理混部调小。
- 拓扑索引常驻内存，节点数 × 拓扑层级决定内存占用，万节点级集群预留 4–8 GiB。
- 拓扑标签维护是运维长期项：机房扩容、线缆改接都要同步更新标签。

---

## 8. 对比与选择

### 8.1 KAI vs 同类调度器

| 维度 | KAI Scheduler | Volcano | kube-scheduler（默认） | YuniKorn |
|------|---------------|---------|------------------------|----------|
| 定位 | 万卡 AI 训练调度器 | 通用批/HPC 调度 | 通用单 Pod 调度 | 大数据/队列调度 |
| Gang 调度 | ✅ 一等公民 | ✅ PodGroup | ❌（需配合） | ⚠️ |
| 拓扑感知 | ✅ NUMA→Row 多级，核心特性 | ⚠️ 基础 | ❌ | ⚠️ |
| 主动碎片整理 | ✅ 运行期 defrag | ❌ | ❌ | ❌ |
| 层级公平分享 | ✅ 树状 Queue + DRF | ⚠️ Queue | ❌ | ✅ |
| 抢占/优先级 | ✅ 集成 PriorityClass | ✅ | ✅ | ✅ |
| 万卡规模验证 | ✅ 超大规模生产 | ⚠️ 中大 | ❌ | ⚠️ |
| 成熟度 | CNCF Sandbox（2025） | CNCF Incubating | GA | Apache |

### 8.2 何时选 KAI Scheduler

- ✅ **万卡级训练集群**：kube/Volcano 在拓扑带宽与碎片上撞墙。
- ✅ **拓扑带宽极敏感**：NCCL/RDMA allreduce 跨交换机掉速严重。
- ✅ **多团队共享 + 严格公平**：需要层级公平与可抢占语义。
- ✅ **GPU 紧张、靠吞吐**：主动碎片整理能榨出额外大块连续卡。

### 8.3 何时考虑其它

- **小集群 / 推理为主** → kube-scheduler + [[CNCF_Cloud_Native_AI/Kueue_Deep_Dive]]（作业排队）。
- **通用批处理 / HPC** → [[CNCF_Cloud_Native_AI/Volcano_Deep_Dive]]（生态成熟、CRD 多）。
- **大数据 / Spark/Flink 队列治理** → YuniKorn。
- **DRA 设备细粒度分配** → kube-scheduler + [[12_Architecture_Infrastructure/DRA_Deep_Dive]]（KAI 关注调度拓扑，DRA 关注设备声明式分配，二者可互补）。

---

## 9. 常见问题 FAQ

**Q1: KAI Scheduler 会替换 kube-scheduler 吗？**
A: 不会。两者并存，AI 工作负载通过 `schedulerName: kai-scheduler` 路由；普通 Pod 仍走默认 kube-scheduler。

**Q2: 没有拓扑标签能用吗？**
A: 能跑，但拓扑感知退化为普通 bin-packing，跨交换机掉速、碎片整理质量都会下降。拓扑标签是 KAI 价值的前提，建议至少打通到 switch 层。

**Q3: PodGroup 凑不齐 `minMember` 一直 pending 怎么办？**
A: 依次排查：(1) 集群总量是否够；(2) 该 Queue 是否超 `maxQuota`；(3) `topologyPolicy` 是否过严（试 `BestEffortCompact`）；(4) 是否被高优先级长期占满（考虑开抢占）。

**Q4: 主动碎片整理会打断我的训练吗？**
A: 会迁移低优先级 Pod（受 `onlyLowerPriorityThan` 与 `aggressiveness` 约束）。建议把关键训练设为高优先级、把可中断作业设为低优先级，让 defrag 优先动后者。`medium` 强度通常足够安全。

**Q5: KAI 和 Kueue 是竞争关系吗？**
A: 定位不同。Kueue 做"作业排队与外部协调"（批处理入队、配额管理），KAI 做"集群内 GPU 调度决策"。生产里可见 Kueue 在上、KAI 在下，Kueue 把已批准的 job 交给 KAI 绑定。详见 [[CNCF_Cloud_Native_AI/Kueue_Deep_Dive]]。

**Q6: 单个 KAI 实例能扛多大集群？**
A: 万级 GPU、万级 Pod 是设计目标区间。再往上通常按 Queue/namespace 分片跑多个 KAI 实例分而治之；HA 靠 `leaderElect` 多副本（注意：副本只做主备不扩吞吐）。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] — CNCF 云原生 AI 项目全景
- [[CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] — 同族批调度器，生态更成熟
- [[CNCF_Cloud_Native_AI/Kueue_Deep_Dive]] — 作业排队与配额，可与 KAI 上下层协作
- [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] — 大规模 AI 集群基础设施总览
- [[12_Architecture_Infrastructure/DRA_Deep_Dive]] — 设备声明式分配，与调度拓扑互补
