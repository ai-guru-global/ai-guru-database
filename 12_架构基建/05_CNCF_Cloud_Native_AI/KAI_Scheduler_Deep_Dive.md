---
title: "KAI Scheduler: 大规模 AI GPU 调度器"
category: "12-architecture-infrastructure-cncf-cloud-native-ai"
tags: ["cncf", "kubernetes", "scheduling", "kai-scheduler", "gpu", "topology"]
summary: "> **一句话理解**: KAI Scheduler 是为万卡级 AI 集群设计的 CNCF 沙箱调度器——靠拓扑感知（同机架/同交换机优先）+ 主动碎片整理 + 大规模公平调度，在 GPU 紧张时把吞吐和拓扑带宽同时拉满。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Kai Scheduler Deep Dive"
  - "KAI Scheduler Deep Dive"
  - KAI_Scheduler_Deep_Dive
sources: []

---
# KAI Scheduler: 大规模 AI GPU 调度器

> **一句话理解**: KAI Scheduler 是为万卡级 AI 集群设计的 CNCF 沙箱调度器——靠拓扑感知（同机架/同交换机优先）+ 主动碎片整理 + 大规模公平调度，在 GPU 紧张时把吞吐和拓扑带宽同时拉满。

> 📐 **概念方法论**: 把 kube-scheduler 当作"单 Pod 资源匹配器"，那 KAI Scheduler 就是"集群级 GPU 拓扑优化器 + 碎片整理器 + 公平仲裁器"。它解决的不是"Pod 能不能调度"，而是"在一个万卡集群里，**分布式训练的 N 张卡能不能放在同一台交换机下面、整体碎片率最低、各团队排队公平**"。与 [[CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] 同属"批调度"族，但 KAI 把拓扑感知做到了第一公民；选型时结合 [[架构基建/Architecture_Overview/AI_Infrastructure_2026]] 看 GPU 集群规模与训练拓扑诉求。

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

| 类别 | 项 | 要求 / 说明 |
|------|----|------|
| 控制面 | Kubernetes 版本 | >= 1.27（CRD 与调度扩展依赖） |
| 控制面 | 作为第二调度器部署 | KAI 不接管默认链，业务通过 `schedulerName: kai-scheduler` 显式路由；详见 4.5 |
| 控制面 | Helm | >= 3.10 |
| 控制面 | RBAC | KAI 需对 Pod / PodGroup / Queue / Node 的读写权限（chart 自动创建） |
| 节点 | GPU Operator | NVIDIA GPU Operator / device plugin 已装，`nvidia.com/gpu` 可上报 |
| 节点 | 拓扑标签（必填） | 节点需打 `topology.kai/{switch,rack,row,...}`；缺失则降级为普通 bin-packing |
| 节点 | NUMA 拓扑（可选） | `topology.kai/numa-*` 标签，单机多卡跨 NUMA 场景进一步收紧 |
| 网络 | RDMA / RoCE | 推荐但非强制；缺失时拓扑感知只影响放置决策，不影响通信本身 |
| 网络 | GPU 直通 | 训练 Pod 需挂 `/dev/infiniband` 与 `/dev/shm`（见 5.2） |

### 4.2 给节点打拓扑标签

拓扑标签是 KAI 拓扑感知的前提。物理拓扑层级越细、标签越准，调度质量越高；缺失标签的节点会被降级处理。下表给出每一层标签的真实取值示例与含义：

| 层级（由细到粗） | 标签 | 示例值 | 物理含义 | 通信代价 |
|------------------|------|--------|----------|----------|
| NUMA | `topology.kai/numa=0` | `0` / `1` | 同 NUMA node，跨 PCIe/NVLink 域 | 最低（NVLink/NVSwitch 全速） |
| Node | （节点本身） | — | 单机 8 卡，整机 NVLink 域 | 极低 |
| Switch | `topology.kai/switch=sw-12` | `sw-12` | 同 ToR 交换机下，RDMA 单跳 | 低（单跳 RoCE） |
| Rack | `topology.kai/rack=rack-03` | `rack-03` | 同机架，可能跨 ToR 上行 | 中（跨交换机） |
| Row / Pod | `topology.kai/row=row-1` | `row-1` | 同行列，同汇聚层 / Spine 下 | 高（多跳） |

逐节点打标示例（推荐从机房 CMDB / BMC 自动同步，避免人工漂移）：

```bash
# 单节点：标全五层
kubectl label node gpu-node-01 \
  topology.kai/numa=0 \
  topology.kai/switch=sw-12 \
  topology.kai/rack=rack-03 \
  topology.kai/row=row-1

# 批量从 CMDB 同步（示例骨架，字段以实际 CMDB 为准）
for n in $(kubectl get nodes -l node-role.kubernetes.io/gpu -o name); do
  kubectl label "$n" \
    topology.kai/switch=$(cmdb_lookup "${n#node/}" tor_switch) \
    topology.kai/rack=$(cmdb_lookup "${n#node/}" rack) \
    topology.kai/row=$(cmdb_lookup "${n#node/}" row) --overwrite
done
```

> 标签维护是长期运维项：机房扩容、线缆改接、ToR 更换都要同步更新标签，否则拓扑打分会失真。建议把标签同步纳入节点入网流程，CI 校验「带 GPU 但缺 switch 标签」的节点（`kubectl get nodes -l nvidia.com/gpu.present=true -o custom-columns=NAME:.metadata.name,SWITCH:...`）。

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

### 4.5 作为第二调度器与 kube-scheduler 共存

KAI 不替换 kube-scheduler，二者并存。kube-scheduler 继续负责 CoreDNS、Prometheus、DaemonSet 等普通 Pod；AI 工作负载通过 `schedulerName: kai-scheduler` 显式路由给 KAI。两者共享同一份 Node / Resource 视图（都来自 apiserver），通过各自的绑定动作互不干扰。配置要点：

| 关注点 | 配置 / 检查 |
|--------|-------------|
| KAI schedulerName | `scheduler.name=kai-scheduler`（chart 默认值，不要改成 `""`，否则会与 kube-scheduler 抢默认调度） |
| kube-scheduler | 保持默认链不动；切勿禁用，否则系统 Pod 失去调度器 |
| 资源视图一致性 | 两者都从 apiserver watch，假定 GPU 已通过 device plugin 上报 |
| 绑定冲突 | KAI 只 bind `schedulerName=kai-scheduler` 的 Pod，kube-scheduler 跳过这些 Pod，互不踩踏 |
| leader 选举 | KAI 与 kube-scheduler 各自独立选主，lease 不共享 |

> 生产常见陷阱：把 KAI 的 `scheduler.name` 设成空或 `default-scheduler`，会让 AI Pod 反而被 kube-scheduler 抢走，Gang 拓扑全部失效。务必保持独立 schedulerName。可用 `kubectl get pods -A -o custom-columns=NAME:.metadata.name,SCHED:.spec.schedulerName` 审计 Pod 路由。

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

KAI 的 `/metrics` 端口暴露 Prometheus 指标，可按"调度性能 / 拓扑质量 / 公平与排队 / 碎片与抢占"四类归口。下表给出生产常盯的指标与健康基线：

| 类别 | 指标 | 含义 | 健康基线 / 关注点 |
|------|------|------|-------------------|
| 调度性能 | `kai_scheduling_latency_seconds` (histogram) | 单次调度循环耗时，按 bucket 暴露 | P50 < 50 ms，P99 < 数百 ms；P99 飙升看锁竞争 / batch 过大 |
| 调度性能 | `kai_scheduling_batch_size` | 每批处理的 pending Pod 数 | 接近 `maxBatchSize` 说明积压，考虑拉大 batch 或分片 |
| 拓扑质量 | `kai_topology_distance_distribution` | 已绑定 PodGroup 落在各拓扑层级的占比 | switch / rack 占比越高越好；row 占比高说明拓扑失真或资源紧 |
| 拓扑质量 | `kai_topology_violations_total` | 触发放宽（BestEffort）或拒绑（Strict）的次数 | 上升说明标签缺失或拓扑域装不下 |
| 公平与排队 | `kai_podgroup_pending_count` | 当前 pending 的 PodGroup 数 | 持续高位 + 0 绑定 = Gang 饥饿或配额耗尽 |
| 公平与排队 | `kai_podgroup_pending_seconds` | PodGroup pending 时长（直方图） | 训练作业排队体感来源；与公平性体感强相关 |
| 公平与排队 | `kai_queue_allocated` / `kai_queue_guaranteed` | 各队列已分配 / 保证量 | 长期 allocated > guaranteed 说明有人在借超额 |
| 公平与排队 | `kai_queue_depth` | 各队列等待中的 PodGroup 数 | 单队列深度远超均值提示该队列权重/配额失衡 |
| 碎片与抢占 | `kai_fragmentation_ratio` | 集群碎片率（0~1） | 持续 > 10% 需调高 defrag 强度或补标签 |
| 碎片与抢占 | `kai_defrag_migrations_total` | 碎片整理迁移次数（counter） | 突增 = churn 或策略过激 |
| 碎片与抢占 | `kai_preemptions_total` | 抢占次数（counter） | 频繁抢占提示权重/配额失衡或 cooldown 太短 |

> 实践：把 P99 调度延迟、碎片率、pending PodGroup 数、抢占速率做成四条黄金 SLO 曲线；任一告警即触发 §7.3 排错流程。

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
# 1. 调度延迟 P50 / P99
histogram_quantile(0.50, rate(kai_scheduling_latency_seconds_bucket[5m]))
histogram_quantile(0.99, rate(kai_scheduling_latency_seconds_bucket[5m]))

# 2. 集群碎片率（按 15s 采样取 5m 均值，避免抖动）
avg_over_time(kai_fragmentation_ratio[5m])

# 3. 各队列 GPU 占用率（allocated / guaranteed）
kai_queue_allocated{resource="nvidia.com/gpu"}
  / on(queue) kai_queue_guaranteed{resource="nvidia.com/gpu"}

# 4. 拓扑跨度分布：switch 域占已绑定 PodGroup 的比例（越高越好）
sum(kai_topology_distance_distribution{level="switch"})
  / sum(kai_topology_distance_distribution)

# 5. 抢占速率（每分钟），突增即告警
rate(kai_preemptions_total[1m]) * 60
```

### 7.3 排错速查

| # | 现象 | 可能原因 | 排查 / 处置 |
|---|------|----------|-------------|
| 1 | PodGroup 卡 `Pending` / `Unschedulable` | 凑不齐 `minMember`；拓扑过严；队列超 `maxQuota` | `kubectl describe podgroup` 看 Events；临时放宽 `topologyPolicy`；核对 Queue 配额 |
| 2 | 拓扑违规（Pod 被放到跨交换机/跨机架） | 节点拓扑标签缺失；`BestEffort` 放宽了；拓扑域装不下 | 检查标签覆盖率（4.2 审计命令）；补标签或提升 `Strict`；扩容对应 switch 域 |
| 3 | 拓扑标签缺失（节点降级处理） | 新节点入网未打标；CMDB 漂移 | 跑 4.2 审计命令找缺标节点；重新打标或回滚 CMDB 同步 |
| 4 | Gang 饥饿（大 job 长期排队） | 资源被小 job 占满；权重低；抢占关闭 | 调队列 `weight`；启用抢占；拆分 `minMember`；调高该队列 `quota` |
| 5 | Defrag churn（同一批 Pod 反复迁移） | `aggressiveness=high` + 高 churn 节点 | 降为 `medium`；调小 `maxMigrationsPerCycle`；对关键训练设高优先级豁免 |
| 6 | Queue 饥饿（某队列长期拿不到资源） | 公平仲裁被高权重队列压制；`quota` 设过低 | `kubectl describe queue` 对比 allocated/guaranteed；调权重；加 `maxQuota` 上限防超占 |
| 7 | 调度延迟 P99 突增 / 性能退化 | pending 量过大；锁竞争；集群视图滞后；scoring 深度过深 | 调大 `batchInterval`；检查 leader 选举；看 apiserver RT；调浅 scoring depth |
| 8 | 意外抢占级联（一个抢占触发链式抢占） | 权重悬殊；`cooldownSeconds` 过短；fairness 震荡 | 调大 `preemption.cooldownSeconds`；拉平权重；检查 DRF 配置 |
| 9 | 高优先级 Pod 被反复抢占 | 公平仲裁震荡；权重悬殊；优先级倒挂 | 检查 Queue 权重；核对 PriorityClass value；调 cooldown |

### 7.4 规模调优要点

- 单实例瓶颈在万级 Pod 量级后显现，启用 `leaderElect` 多副本只解决 HA 不解决吞吐；真正扩容靠分片（按 Queue / namespace 分片多实例）。
- `batchInterval` 与 `maxBatchSize` 是吞吐 vs 时延的旋钮：训练批作业拉大 batch、拉长 interval 换吞吐；推理混部调小换时延。`maxBatchSize` 接近上限（见 `kai_scheduling_batch_size`）即说明积压。
- scoring depth（每 Pod 候选节点评分深度）在大集群下是主要 CPU 开销；万节点级可调浅评分深度，牺牲少量紧凑度换调度循环速度。
- 拓扑索引常驻内存，节点数 × 拓扑层级决定内存占用，万节点级集群预留 4–8 GiB。
- 拓扑标签维护是运维长期项：机房扩容、线缆改接都要同步更新标签，否则 `kai_topology_distance_distribution` 会逐渐往 row 偏移。
- defrag 在万卡集群建议默认 `medium`：`high` 在高 churn（频繁上下线节点）时会放大迁移风暴，`low` 又追不上碎片增长。

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
- **DRA 设备细粒度分配** → kube-scheduler + [[架构基建/Hardware_Compute/DRA_Deep_Dive]]（KAI 关注调度拓扑，DRA 关注设备声明式分配，二者可互补）。

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
- [[架构基建/Architecture_Overview/AI_Infrastructure_2026]] — 大规模 AI 集群基础设施总览
- [[架构基建/Hardware_Compute/DRA_Deep_Dive]] — 设备声明式分配，与调度拓扑互补
