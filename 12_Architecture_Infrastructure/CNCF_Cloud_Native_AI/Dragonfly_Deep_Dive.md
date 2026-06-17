---
title: "Dragonfly: 大模型权重 P2P 加速分发"
category: "12-architecture-infrastructure"
tags: ["cncf", "dragonfly", "p2p", "distribution", "registry", "llm"]
summary: '> **一句话理解**: Dragonfly 是 CNCF 毕业级的 P2P 分发系统——把"100 个 GPU 节点同时拉 70GB 模型把镜像仓库打爆"变成"节点越多反而越快"，是大模型镜像/权重分发的首选加速层。'
created: "2026-06-16"
updated: "2026-06-16"
---

# Dragonfly: 大模型权重 P2P 加速分发

> **一句话理解**: Dragonfly 是 CNCF 毕业级的 P2P 分发系统——把"100 个 GPU 节点同时拉 70GB 模型把镜像仓库打爆"变成"节点越多反而越快"，是大模型镜像/权重分发的首选加速层。

> 📐 **概念方法论**: Dragonfly 把 BitTorrent 的 P2P 思想搬进 Kubernetes 集群内部——当一个 70GB 的模型权重或 OCI 镜像要分发给上百个节点时，中心化 Registry 的出口带宽是物理天花板，Dragonfly 引入 **Seed Peer / Peer / Scheduler / Manager** 四层抽象，让每个下载者同时成为上传者，把"出口带宽瓶颈"转化为"集群内部带宽红利"。它与 [[CNCF_Cloud_Native_AI/KitOps_Deep_Dive]] 的 ModelKit 打包层正交（一个负责打包、一个负责传输），共同构成大模型分发栈；选型背景可参考 [[12_Architecture_Infrastructure/AI_Infrastructure_2026]]。

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

Dragonfly（当前主版本 Dragonfly2，仓库 `dragonflyoss/Dragonfly2`，社区简称 d7y）起源于阿里，是 CNCF 毕业级的 **P2P 文件/镜像/数据集分发与加速系统**。它解决的核心痛点是大体积制品在 Kubernetes 集群内的"集中式分发瓶颈"。

```
   传统 Hub-and-Spoke                  Dragonfly P2P Mesh（节点互喂）
   ┌──────────┐                        ┌──────────┐
   │ Registry │ ◄── 单出口带宽被打爆    │ Registry │ ◄── 只喂 Seed 一次
   └────┬─────┘                        └────┬─────┘
   100 节点同时拉 ─► 限速/超时              Seed Peer
   N1..N100 ─► Pod 启动失败               ┌──┴──┐
                                          N1◄──►N2   节点互传 Piece
                                          N3◄──►N4   越多节点 = 越快
                                          出口带宽恒定，集群总带宽随节点线性增长
```

一句话：**Dragonfly = 把每个 K8s 节点变成一个 BT 客户端的 Registry 加速层**。在 LLM 场景下，它专门用于加速「大镜像拉取」「大权重分发」「大数据集预热」三件事——这正是 KAITO preset 镜像、KitOps ModelKit、HuggingFace 大数据集体积动辄几十 GB 时的真实瓶颈。

### 1.2 核心特性

| 特性 | 说明 | 生产价值 |
|------|------|----------|
| **P2P 分片回源** | 把文件切成 Piece，节点间互传；回源带宽恒定 | 100 节点同时拉镜像，回源带宽 ≈ 1 节点 |
| **Seed Peer 层** | 专用回源节点，从 Registry/对象存储拉原始数据并喂给 Peer | 与计算节点解耦，回源压力可控、可独立扩缩 |
| **CDN/P2P 混合** | 先 CDN/Seed 回源，再 P2P 二级扩散 | 兼顾冷启动速度与稳态带宽卸载 |
| **多源拉取** | 同一 Piece 可来自 Registry / Seed Peer / 其他 Peer | 自动选择最快源，单点故障不影响分发 |
| **本地磁盘缓存** | Peer DaemonSet 落盘缓存已下载 Piece | 重复拉取秒级命中，跨 Pod 共享 |
| **Preheat 预热** | 部署前主动把镜像/权重拉到所有 Peer | 业务 Pod 拉起即可命中本地，TTR（Time-To-Ready）大幅下降 |
| **容器生态集成** | containerd CRI 插件 / HTTP 代理双模式 | 无侵入接入，业务镜像零改造 |
| **可观测体系** | Manager UI + Prometheus + Jaeger | P2P 比例、命中率、下载速率全可视 |
| **多集群/多机房** | Seed Peer 可跨集群级联 | 跨 Region 分发不重复回源 |

### 1.3 CNCF 状态与版本历程

| 时间 | 事件 | 说明 |
|------|------|------|
| 2017 | Dragonfly 开源 | 阿里内部 P2P 镜像分发系统开源 |
| 2018-10 | CNCF Sandbox 接纳 | 进入 CNCF 沙箱孵化 |
| 2020-10 | CNCF Incubation | 升级为孵化项目 |
| 2021-2022 | Dragonfly2 (v2) 重构 | Go 重写，引入 Manager/Scheduler/Seed Peer 新架构 |
| 2024-04 | **CNCF Graduation** | 正式毕业，与 Kubernetes / Istio 同级 |
| v2.1+ (2024-2025) | 生产成熟 | containerd 插件、Helm chart、Preheat API 完善 |
| 2025-2026 | LLM 场景化 | OCI Artifact / HF 数据集 / ModelKit 适配 |

> 仓库：<https://github.com/dragonflyoss/Dragonfly2> ｜ License: Apache-2.0 ｜ CNCF 状态: **Graduated（毕业）** ｜ 主要维护方: 阿里 / Apple / Bain Capital / 字节等

---

## 2. 核心概念

### 2.1 六个关键名词

| 概念 | 是什么 | 类比 |
|------|--------|------|
| **Manager** | 控制平面。提供 UI、Preheat、权限、Prometheus 指标聚合；调度 Scheduler 与 Seed Peer | P2P 集群的"控制塔" |
| **Scheduler** | 调度平面。为每个 Task 决定 Peer 从哪个父节点下载哪个 Piece，动态构造下载拓扑 | BT Tracker + 智能路由器 |
| **Seed Peer** | 专用回源 Peer。从源（Registry/对象存储）拉数据并以 P2P 方式喂给普通 Peer | 集群的"超级节点/做种机" |
| **Peer** | 运行在每个业务节点上的守护进程（DaemonSet）。既下载也上传，并维护本地磁盘缓存 | BT 客户端 + 本地缓存 |
| **Task** | 一次分发任务，对应一个文件/一个镜像 layer/一段权重 | 一个 .torrent |
| **Piece** | Task 切分的最小传输单元（默认 4MB 级），P2P 的基本流转单位 | 一个 BT piece |

为划清职责边界，下表把 Dragonfly 角色与 BitTorrent 生态一一对应，并标注每个组件「管什么 / 不管什么」：

| 角色 | BT 类比 | 管什么 | 不管什么 |
|------|---------|--------|----------|
| **Manager** | Tracker 网站 + Web UI | 控制面：Cluster 注册、Preheat 下发、指标聚合、RBAC | 不传 Piece、不感知运行时拓扑 |
| **Scheduler** | 智能 Tracker（带路由） | 实时构造父-子下载拓扑、故障重调度 | 不存数据、不缓存 Piece |
| **Seed Peer** | Seeder（做种机） | 回源拉全量、作为 Mesh 根节点持续做种 | 不跑业务 Pod、不对接 containerd |
| **Peer** | Leecher → Seeder | 下载 + 上传 + 本地缓存，对接 containerd | 不回源（除非被提升为 Seed） |
| **Task** | .torrent 文件 | 一个文件 / layer 的分发上下文（Piece 列表 + 哈希） | 不含数据本身 |
| **Piece** | BT 分片 | 最小传输单元，独立校验、独立路由 | 单独无意义，需拼回 Task |

> 与 BitTorrent 的关键差异：BT 是「对等自治」（Peer 自行 gossip 发现彼此），Dragonfly 是「**Scheduler 集中调度 + Peer 对等传输**」——拓扑由 Scheduler 主动构造而非 Peer 自发现。这让企业环境可控、可观测、可限速，代价是 Scheduler 成为控制面关键点（故需多副本 + Manager 协调 leader election）。

### 2.2 P2P Mesh 下载示意

```
        Manager (控制平面: Preheat API / 权限 / 指标)
                      │ 下发策略
                      ▼
                 Scheduler  ◄── 为每个 Piece 选父节点
                      │ 调度决策
        Registry/HF/S3 │
               ▲  回源 │
        ┌──────┴──────┐│
        │  Seed Peer  ││  (做种机)
        └──┬───┬───┬──┘│    P2P Mesh：节点间互传不同 Piece
           │   │   │  │
      ┌────┘   │   └──┐│
      ▼        ▼      ▼
    ┌───┐    ┌───┐  ┌───┐
    │P1 │◄──►│P2 │◄►│P3 │   P = Peer (DaemonSet on worker)
    └─┬─┘    └───┘  └─┬─┘
      └──────►P4◄──────┘   ─► containerd / 业务 Pod 直接读本地缓存
```

关键点：**Piece 是 P2P 单元**。Scheduler 会让 P1 从 Seed 拿 Piece A，P2 从 Seed 拿 Piece B，然后 P1、P2 互相交换——这样 Seed 的出口带宽永远只承担"种子"的部分，剩余的全在集群内部消化。

### 2.3 Piece 级下载流程（70GB 文件如何被互喂）

以 70GB 模型权重为例（`pieceSize=4MiB` → 切成约 17,500 个 Piece），Piece 级时序如下：

```
   T0  Registry 仅被 Seed 拉一次（回源带宽 = 1× 文件大小）
        ┌─────────┐                          ┌──────────┐
        │Registry │ ─── 全量 17500 Piece ──► │ Seed Peer│ (做种)
        └─────────┘                          └────┬─────┘
   T1  3 个 Peer 请求 → Scheduler 分配"各拿不同段"（并行回源，Seed 上行均摊）
          P1 ← Seed: Piece 0001-0583
          P2 ← Seed: Piece 0584-1166
          P3 ← Seed: Piece 1167-1749
        ┌───┐    ┌───┐    ┌───┐    每拿到一块，立即向 Scheduler 声明
        │P1 │    │P2 │    │P3 │    "我有了"，可被其他 Peer 拉取
        └─┬─┘    └─┬─┘    └─┬─┘
   T2  P1 拿完自己的段 → P2/P3 反过来从 P1 拿这段（不再回源）
          P2 ← P1: 0001-0583 (P2P)     P1 ← P2: 0584-1166 (P2P)
          P3 ← P1: 0001-0583 (P2P)     P1 ← P3: 1167-1749 (P2P)
   T3  Piece 在 Mesh 扩散 → 各 Peer 拼齐全部 Piece → 重组 70GB → 写本地 Cache
        ┌───┐◄──►┌───┐◄──►┌───┐
        │P1 │    │P2 │    │P3 │
        └───┘    └───┘    └───┘
```

要点：**Seed 只回源一次**（T0 之后 Registry 流量为零，除非 Piece 被 GC 重拉）；**Scheduler 让不同 Peer 拿不同段**，避免所有人挤同一块；**边下边种**（拿到任一 Piece 即可服务他人，无需等整文件下完）；**Piece 级哈希校验**（损坏立即重拉，不污染整文件）。

---

## 3. 架构设计

### 3.1 全景组件图

```
 ┌──────────────────────── Kubernetes Cluster ────────────────────────┐
 │  ┌─────────┐ ┌───────────┐ ┌─────────────┐                         │
 │  │ Manager │ │ Scheduler │ │  Seed Peer  │  ◄── 回源 Registry      │
 │  │ 控制平面 │ │ 拓扑调度   │ │  (Stateful) │                         │
 │  └────┬────┘ └─────┬─────┘ └──────┬──────┘                         │
 │       │           │ P2P 喂  ┌──────┴──────┐                         │
 │       └──────────►│ Peer DaemonSet (每 worker 一个)                  │
 │                   │ ├ 本地磁盘 Cache + containerd 代理              │
 │                   └──────┬──────────────┘                          │
 │                          │ 读本地缓存                                 │
 │                          ▼                                          │
 │                   ┌──────────────┐                                  │
 │                   │  应用 Pod     │  ◄── LLM / 推理服务              │
 │                   └──────────────┘                                  │
 └────────────┬───────────────────────────────────────────────────────┘
              │ 仅回源时走外网
              ▼
   上游源: OCI Registry / HuggingFace / S3
```

### 3.2 请求流（一次镜像/权重拉取）

```
1. 业务 Pod 触发 containerd 拉镜像 (e.g. quay.io/modelkit/llama3-70b:latest)
2. containerd 配置 https_proxy → Dragonfly Peer (localhost:65001)
3. Peer 向 Scheduler 注册新 Task，请求下载拓扑
4. Scheduler 查看现存 Peer 拓扑：
     - 若集群内无该 Piece → 指派 Seed Peer 回源
     - 若已有 Peer 持有 → 指派其为父节点
5. Peer 按调度结果并行从多源拉取 Piece：
     - Piece 1~N 来自 Seed Peer
     - Piece N+1~2N 来自邻居 Peer P2
     - Piece 2N+1~3N 来自邻居 Peer P3
   每收到一块，立即声明可提供给其他 Peer
6. 所有 Piece 拼回完整文件 → 写入本地 Cache → 返回 containerd
7. containerd 解压层，Pod 启动
8. 后续同一镜像/Piece 的请求直接命中本地 Cache，秒级返回
```

### 3.3 Scheduler 调度策略

| 策略 | 行为 | 适用场景 |
|------|------|----------|
| `compatibility` | 兼容老 Peer，父子层级清晰 | 升级过渡期 |
| `round-robin` | 父节点轮询，负载均衡 | 默认，通用场景 |
| `grid` | 网格拓扑，每个 Peer 服务固定邻居 | 超大规模集群（数百节点） |
| 评估维度 | 主机负载 / 带宽 / RTT / Piece 命中率 / 健康度 | Scheduler 持续打分选最优父节点 |

Scheduler 还负责**故障切换**：若某 Peer 上传过慢或掉线，它立即重新调度下游 Peer 改从其他父节点拉取，保证 Task 不被单点阻塞。

### 3.4 Preheat（预热）特性

Preheat 是 LLM 场景的杀手锏。它允许在**业务 Pod 调度之前**，主动触发一次"假拉取"，把镜像 layer / 权重文件预先分发到所有 Peer 的本地缓存：

```
   传统流程:                              Preheat 流程:
   ─────────                              ───────────
   创建 Deployment                         1. CI 推送镜像 / 上传权重
   ─► Pod Pending (拉镜像 5-15 分钟)         2. 调 Preheat API
   ─► Pod Running                          3. Dragonfly 后台 P2P 分发到所有节点
                                           4. 等分发完成 (HTTP 200)
                                           5. 创建 Deployment
                                           ─► Pod 直接命中缓存 (<10 秒)
                                           ─► Pod Running
```

Preheat 支持 OCI 镜像、OCI Artifact（兼容 ModelKit）和原始文件 URL，可对接 Argo CD / Tekton / GitHub Actions 在部署流水线中自动调用。

---

## 4. 安装部署

### 4.1 前置条件

| 项 | 要求 |
|----|------|
| Kubernetes | ≥ 1.22 |
| Helm | ≥ 3.8 |
| container runtime | containerd（推荐）/ CRI-O |
| 节点磁盘 | 每节点预留 ≥ 100GB 给 Peer 缓存（SSD 优先） |
| 网络 | 集群内 Pod 互通；Peer 端口 40000-40020、65001 默认 |
| 存储 | Manager 用 MySQL/Postgres；可选 Redis 做加速 |

### 4.2 Helm 安装 Dragonfly（控制面 + 数据面）

```bash
helm repo add dragonfly https://dragonflyoss.github.io/helm-charts/
helm repo update

helm install dragonfly dragonfly/dragonfly \
  --namespace dragonfly-system \
  --create-namespace \
  --set manager.config.rest.port=8080 \
  --set scheduler.replicaCount=3 \
  --set seedPeer.replicaCount=3 \
  --set peer.enable=true \
  --set peer.daemonset.hostNetwork=true \
  --set peer.config.storage.dataPath=/var/lib/dragonfly
```

部署后集群中应有：

```bash
$ kubectl -n dragonfly-system get pod
NAME                                  READY   STATUS    ROLE
dragonfly-manager-xxx                 1/1     Running   manager
dragonfly-scheduler-xxx (x3)          1/1     Running   scheduler
dragonfly-seed-peer-xxx (x3)          1/1     Running   seed-peer
dragonfly-peer-xxxxx (DaemonSet)      1/1     Running   peer      # 每个 worker 一个
```

### 4.3 配置 containerd 走 Dragonfly 代理

每台运行工作负载的节点修改 `/etc/containerd/config.toml`，将镜像拉取流量重定向到本机 Peer：

```toml
[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/etc/containerd/certs.d"

# 每个镜像源：先走 Dragonfly mirror，回退直拉
[plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
  endpoint = ["http://127.0.0.1:65001", "https://registry-1.docker.io"]
[plugins."io.containerd.grpc.v1.cri".registry.mirrors."quay.io"]
  endpoint = ["http://127.0.0.1:65001", "https://quay.io"]
[plugins."io.containerd.grpc.v1.cri".registry.mirrors."ghcr.io"]
  endpoint = ["http://127.0.0.1:65001", "https://ghcr.io"]
```

重启 containerd：`systemctl restart containerd`。之后所有 `crictl pull` 自动经过 Dragonfly。

> 也可用 containerd 1.7+ 的 `certs.d` 目录方式（每镜像源一个 `hosts.toml`），更适合配置管理工具批量下发。

### 4.4 模型文件源配置

Dragonfly 不只代理 OCI 镜像，也能直接加速原始文件/数据集。在 Manager 中配置「动态源」：

```yaml
# Manager config: 支持的源类型
sources:
  - type: oci           # OCI 镜像 / Artifact (ModelKit 走这条)
    registry: quay.io
  - type: huggingface   # HF 数据集 / 权重直链
    endpoint: https://huggingface.co
  - type: s3            # S3 兼容对象存储 (模型桶)
    endpoint: https://minio.internal:9000
    bucket: models
```

调用 Preheat 时按 source 类型 + 路径即可触发，对业务侧完全透明。

---

## 5. 快速开始

目标：在一个多节点集群上分发一个 70GB 模型镜像，观察 P2P 加速效果，并体验 Preheat。

### 5.1 端到端流程与环境准备

本节演示一个完整闭环：在 4 节点 GPU 集群（node-a/b/c/d）上，先让 Node A 拉一次 70GB 模型镜像「喂种」，再让 B/C/D 并发拉同一镜像观察 P2P 加速，最后用 Preheat 在部署前预热。

```
   Step 1              Step 2-3              Step 4                Step 5-6
   helm install   →   containerd mirror →   Node A 拉镜像     →   B/C/D 并发拉
   Dragonfly          指向 Peer 65001        (Seed 拿到种)         (P2P 互喂)
                                                                      │
   Step 7: Preheat 70GB 镜像 → 部署推理 Pod → 秒级 Running ◄────────┘
```

准备：
- 4+ 节点的 K8s 集群（≥1.22），节点间网络互通
- 一个 70GB 量级的 OCI 镜像（如 `quay.io/modelkit/llama3-70b:latest` 或自建 HF 权重镜像）
- 导出 Manager 的 Service 地址，后续 Preheat 调用要用：

```bash
export MANAGER=http://$(kubectl -n dragonfly-system \
  get svc dragonfly-manager -o jsonpath='{.status.loadBalancer.ingress[0].ip}'):8080
echo $MANAGER    # e.g. http://10.0.5.20:8080
```

### 5.2 安装 Dragonfly 并配置 containerd

按 §4.2 Helm 安装控制面与数据面。安装完成后，确认 Peer DaemonSet 覆盖所有 GPU 节点：

```bash
kubectl -n dragonfly-system get ds dragonfly-peer -o wide
kubectl get nodes -l nvidia.com/gpu.present=true
# 两个列表的节点数应一致；缺 Peer 的节点拉镜像不会走 P2P
```

接下来让 containerd 把镜像拉取流量路由到本机 Peer。除 §4.3 的 `/etc/containerd/config.toml` 全局配置外，手动测试可用 nerdctl 直连 Peer 代理验证：

```bash
# nerdctl 走 Dragonfly peer 代理拉镜像（适合手动测试）
nerdctl --namespace k8s.io pull \
  --hosts-dir /etc/containerd/certs.d \
  quay.io/modelkit/llama3-70b:latest
```

验证 Peer 正在工作——拉取时 Peer 的 metrics 端口应出现活跃 Task：

```bash
curl -s localhost:65001/metrics | grep dragonfly_peer_task_count
```

### 5.3 单节点首次拉取（让 Seed 拿到种）

先在 Node A 上手动拉一次，使 Seed Peer 回源拿到完整数据。这一步是「播种」：

```bash
# 在 node-a 上执行（ssh node-a 或 kubectl debug node/node-a --profile=busybox）
time crictl pull quay.io/modelkit/llama3-70b:latest
# 首次拉取较慢（受回源带宽限制），但 Seed 已持有全部 Piece
```

此时 Seed Peer 本地缓存了完整 70GB，后续节点将不再回源 Registry。

### 5.4 多节点并发拉取（观察 P2P 加速）

在 B/C/D 上**同时**拉同一镜像，模拟批量扩容：

```bash
# 并发触发（也可用 GNU parallel / xargs -P）
for n in node-b node-c node-d; do
  ssh $n "time crictl pull quay.io/modelkit/llama3-70b:latest" &
done; wait
```

对比预期：
- **直拉（无 Dragonfly）**：3 节点各从 Registry 拉 70GB，回源 210GB，Registry 出口带宽被打满，单节点耗时随并发数线性恶化
- **Dragonfly**：回源 ≈ 0GB（Seed 已有种），3 节点从 Seed + Node A 互拉 Piece，**总耗时接近单节点耗时**，P2P 流量 ≈ 210GB 全在集群内

打开 Manager UI（`$MANAGER`）查看 Task 明细，应观察到：
- **P2P 比例 > 90%**（理想 > 95%）
- **回源流量 ≈ 1× 文件大小**（仅 Seed 首次）
- **平均下载速率** 相比直拉提升 5-20 倍（节点越多，加速比越高）

### 5.5 Preheat 预热 70GB 模型（部署前必跑）

上面 5.3 是「手动播种」，生产中应让 CI/CD 在**部署前**自动调 Preheat API，使所有 Peer 提前缓存好镜像层：

```bash
# 触发 Preheat（OCI 镜像），返回任务 ID
PREHEAT_ID=$(curl -s -X POST $MANAGER/api/v1/preheats \
  -H "Content-Type: application/json" \
  -d '{
    "type": "image",
    "image": "quay.io/modelkit/llama3-70b:latest",
    "tag": "latest",
    "labels": {"team": "llm-infra", "tier": "production"}
  }' | jq -r .id)

# 轮询直到所有 Peer 完成预热
while true; do
  STATUS=$(curl -s $MANAGER/api/v1/preheats/$PREHEAT_ID | jq -r .status)
  echo "preheat status: $STATUS"
  [ "$STATUS" = "SUCCESS" ] && break
  [ "$STATUS" = "FAILURE" ] && { echo "preheat failed"; exit 1; }
  sleep 15
done
```

也可用 Kubernetes CRD 方式声明预热（GitOps 友好，由 Manager 的 controller 调谐，声明式可被 Argo CD 管理）：

```yaml
apiVersion: dragonfly.io/v1
kind: Preheat
metadata:
  name: warm-llama3-70b
  namespace: dragonfly-system
spec:
  type: image
  image: quay.io/modelkit/llama3-70b:latest
  tag: latest
  filter:
    labelSelector:
      matchLabels: { node-role: gpu }
  backoffLimit: 3
```

预热完成后再 `kubectl apply` 推理 Deployment，所有 Pod 在 10 秒内进入 Running——镜像层已在本地缓存。把 Preheat 接入 Argo CD 的 PreSync 或 Tekton 的部署前 Task，即可实现「镜像推送 → 预热 → 部署」的零等待流水线。

### 5.6 与 KitOps ModelKit 协同

ModelKit 把「权重 + 推理代码 + 配置」打包成 OCI Artifact，Dragonfly 把它当普通 OCI 处理，无需特殊配置。`kit push` 后直接对该 Artifact 触发 Preheat，所有节点预热完成；下游推理 Pod（vLLM / TGI）执行 `kit unpack` 或读 OCI layer，全程不感知 Dragonfly。

---

## 6. 生产配置

### 6.1 关键参数调优矩阵

| 维度 | 参数 | 推荐值（100+ 节点 LLM 场景） | 说明 |
|------|------|------------------------------|------|
| Scheduler 副本 | `scheduler.replicaCount` | 3 | 高可用；按 1:50（scheduler:peer）扩 |
| Scheduler 策略 | `scheduler.config.algorithm` | `round-robin` | 通用首选；超大规模试 `grid` |
| Seed Peer 数量 | `seedPeer.replicaCount` | 3（每机房 1-3） | 决定回源总带宽 |
| Seed Peer 带宽 | `seedPeer.config.download.rateLimit` | `1Gi` | 单 Seed 上行限速 |
| Peer 缓存大小 | `peer.config.storage.diskGCThreshold` | `200Gi` | 触发 GC 阈值 |
| Peer 缓存路径 | `peer.config.storage.dataPath` | 独立 SSD 卷 | 避免和容器运行时争抢 IO |
| Piece 大小 | `peer.config.download.pieceSize` | `4MiB`（默认） | 大文件可调到 16MiB 减少 RPC |
| Peer 上传限速 | `peer.config.upload.rateLimit` | `500Mi` | 防止 Peer 拖累业务 Pod |
| 并发任务 | `peer.config.download.concurrentPieceCount` | 32 | 大模型场景可调高 |
| Manager 存储 | `manager.config.database` | 外部 MySQL + 备份 | Preheat 历史持久化 |
| Peer 下载限速 | `peer.config.download.rateLimit` | `0`（不限）/ `2Gi` | 限制单 Peer 下载，给业务 Pod 留带宽 |
| 缓存 GC 百分比 | `peer.config.storage.diskGCThresholdPercent` | `90` | 盘使用率超此值触发 LRU GC |
| 缓存淘汰策略 | `peer.config.storage.gCStrategy` | `lru` | LRU 按访问时间淘汰冷 Piece |
| GC 扫描间隔 | `peer.config.storage.gCInterval` | `30m` | 定期扫描清理无效 / 过期 Piece |
| TLS / mTLS | `security.autoIssueCert` | `true` | 组件间 mTLS；Manager 自动颁发轮转证书 |
| 多集群注册 | Manager `Cluster` CRD | 每集群一套 | 总部 Manager 注册多套实例，跨集群 Seed 级联 |
| 任务优先级 | Preheat `priority` / Scheduler 调度 | high / normal / low | 高优 Preheat 可抢占式调度，推理部署优先 |
| Preheat 过滤 | Preheat `filter.labelSelector` | 按 node label | 只预热 GPU 节点的 Peer，节省非 GPU 节点磁盘 |
| Seed 级联深度 | `seedPeer.config.netConfig` | 1-2 层 | 跨 Region 级联层级，过深会引入回源环路 |
| Peer 上传连接数 | `peer.config.upload.concurrentCount` | `200` | 单 Peer 同时服务的下游连接上限 |
| 回源重试策略 | `scheduler.config.retryBackToSourceLimit` | `5` | 回源失败重试上限，超限标记 Task 失败 |

### 6.2 生产 values.yaml

```yaml
manager:
  replicaCount: 2
  config: { database: { mysql: { host: mysql.database.svc, dbname: dragonfly } } }
  resources: { requests: {cpu: 2, memory: 4Gi}, limits: {cpu: 4, memory: 8Gi} }

scheduler:
  replicaCount: 3
  config: { scheduler: { algorithm: round-robin, backToSourceCount: 3, retryBackToSourceLimit: 5 } }
  resources: { requests: {cpu: 2, memory: 4Gi}, limits: {cpu: 4, memory: 8Gi} }

seedPeer:
  replicaCount: 3
  config: { download: { rateLimit: 1Gi, pieceSize: 16MiB }, storage: { dataPath: /data/dragonfly, diskGCThreshold: 500Gi } }
  persistence: { enabled: true, size: 1Ti, storageClass: fast-ssd }
  resources: { requests: {cpu: 4, memory: 8Gi}, limits: {cpu: 8, memory: 16Gi} }

peer:
  enable: true
  daemonset: { hostNetwork: true }
  config:
    download: { pieceSize: 8MiB, concurrentPieceCount: 32, rateLimit: 0 }   # 不限下载
    upload:   { rateLimit: 500Mi }                                          # 给业务 Pod 留带宽
    storage:  { dataPath: /var/lib/dragonfly, diskGCThreshold: 200Gi, diskGCThresholdPercent: 90 }
  resources: { requests: {cpu: 2, memory: 4Gi}, limits: {cpu: 4, memory: 8Gi} }
```

### 6.3 Seed Peer 放置与多集群

```
                        ┌──────────────────┐
                        │  中心 Registry    │   (唯一回源点)
                        │  / 对象存储       │
                        └─────────┬────────┘
                                  │ 只回源一次
                       ┌──────────▼───────────┐
            ┌──────────┤  HQ Cluster Manager  ├──────────┐
            │          │ (注册所有 Cluster)    │          │
            │          └──────────────────────┘          │
            │ Cluster CRD 注册                          │ Cluster CRD 注册
   ╔════════▼═══════════════╗               ╔═══════════▼══════════════╗
   ║  Region A (主集群)      ║   跨 Region   ║  Region B (容灾/边缘)    ║
   ║                        ║ ◄──级联 Seed──►║                          ║
   ║  Seed x2 (podAntiAff.) ║   不回源      ║  Seed x1 (从 A 级联)     ║
   ║   │        │           ║              ║   │                      ║
   ║   ▼        ▼           ║              ║   ▼                      ║
   ║  P2P Mesh              ║              ║  P2P Mesh                ║
   ║  Peer Peer Peer Peer   ║              ║  Peer Peer Peer          ║
   ╚════════════════════════╝               ╚══════════════════════════╝
       本机房 P2P 互喂                          本机房 P2P 互喂
       跨 Region 只走级联 Seed                   不直接回源 Registry
```

- 每机房至少 1 个 Seed Peer，避免跨机房回源；Seed 用 `podAntiAffinity` 分散到不同节点 / 机架
- 跨 Region 用级联 Seed：B 机房的 Seed 从 A 的 Seed 拉，**不直接回源 Registry**
- 通过 Manager 的 Cluster CRD 注册多套实例，形成「总部 Registry → 主集群 Seed → 边缘集群 Seed → 边缘 Peer」三级拓扑
- 跨 Region 级联深度建议 ≤ 2 层：层级过深会引入回源环路和延迟放大（A→B→C 链路中任一段抖动都会放大）

### 6.4 带宽限速与 QoS

LLM 推理节点对网络敏感（分布式推理 KV 传输），必须给 Peer 设上行限速，避免 P2P 上传挤占训练/推理带宽：

```yaml
peer:
  config:
    upload:    { rateLimit: 500Mi }              # 单节点 P2P 上行上限
    network:   { enableOpenTraffic: false }      # 限制只在本节点网卡
```

也可按时间段调度：训练高峰期降速、夜间补全预热。

---

## 7. 运维与可观测

### 7.1 Manager UI

Manager 提供 Web 控制台，功能包括：

| 模块 | 用途 |
|------|------|
| Cluster | 查看所有 Peer、Seed Peer、Scheduler 状态 |
| Task | 实时分发任务列表、成功率、P2P 比例 |
| Preheat | 触发 / 历史预热任务 |
| Config | 动态源、Scheduler 策略、限速热更新 |
| User / RBAC | 多租户权限隔离 |
| Audit | 谁在何时拉了哪个大模型 |

### 7.2 Prometheus 指标

Dragonfly 各组件原生暴露 Prometheus metrics，核心指标：

| 指标 | 含义 | 告警阈值建议 |
|------|------|--------------|
| `dragonfly_peer_p2p_ratio` | P2P 流量占总流量比例 | < 70% 告警（说明回源过多） |
| `dragonfly_peer_download_rate` | 单 Peer 下载速率 | 大模型场景期望 > 500MB/s |
| `dragonfly_peer_task_hit_rate` | 缓存命中率 | < 80% 检查缓存淘汰策略 |
| `dragonfly_peer_piece_task_count` | 单 Peer 活跃任务数 | 持续过高需扩容 |
| `dragonfly_seed_peer_back_to_source_count` | 回源次数 | 突增说明集群内缺种 |
| `dragonfly_scheduler_task_count` | Scheduler 在管任务 | 接近上限需扩 Scheduler |
| `dragonfly_peer_disk_usage` | 缓存盘使用率 | > 85% 触发 GC |

ServiceMonitor 示例（kube-prometheus-stack）：

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata: { name: dragonfly-peer, namespace: dragonfly-system }
spec:
  selector: { matchLabels: { app: dragonfly, component: peer } }
  endpoints: [{ port: metrics, interval: 30s }]
```

### 7.3 Grafana Dashboard

社区提供官方 Dashboard（ID 见 Dragonfly 文档），关键面板：

- **P2P 节流效果**：Registry 回源带宽 vs 集群总下载带宽（差距越大越好）
- **Preheat 覆盖率**：被预热模型数 / 总拉取模型数
- **节点健康度热力图**：每个 Peer 的下载/上传速率
- **TopN 大文件**：找出最耗带宽的模型，决定是否改 Preheat 策略

### 7.4 常见故障排查

| 现象 | 可能原因 | 排查步骤 |
|------|----------|----------|
| P2P 比例长期 < 50% | Seed Peer 带宽不足 / Scheduler 调度不均 | 检查 `back_to_source_count`、扩 Seed、看 Scheduler 日志 |
| 大模型拉取仍很慢 | Piece 太大 / 并发太低 / 缓存盘慢 | 调小 `pieceSize`、增大 `concurrentPieceCount`、换 SSD |
| Peer 缓存盘打满 | `diskGCThreshold` 设置过低 | 提高阈值、加 `diskGCThresholdPercent`、扩盘 |
| Seed Peer 成为瓶颈 | Seed 数量太少 / 单 Seed 带宽上限过低 | 水平扩 Seed、提高 `rateLimit`、引入级联 |
| Preheat 长时间不完成 | 镜像 layer 巨多 / 网络分区 | 看 Preheat 任务明细、检查跨机房链路 |
| Scheduler 过载 | Peer 数量过多（>500/scheduler） | 扩 Scheduler 副本，启用 `grid` 策略 |
| Pod 仍走直拉不走 Dragonfly | containerd mirror 未生效 | `crictl info` 确认 endpoint、检查 Peer 65001 健康 |

### 7.5 扩容决策

| 触发条件 | 扩容对象 |
|----------|----------|
| Scheduler CPU > 70% 持续 | Scheduler 副本 |
| P2P 比例下降、回源增多 | Seed Peer 副本 + 上行带宽 |
| 缓存命中率下降 | Peer 缓存盘容量 |
| 单机房节点 > 200 | 拆分 Seed 域 + `grid` 调度 |

---

## 8. 对比与选择

### 8.1 主流大文件分发方案对比

| 方案 | 机制 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|----------|
| **Dragonfly** | P2P + Seed + Scheduler | 回源带宽恒定、节点越多越快、K8s 原生 | 架构较重、需 Manager/Scheduler | 大集群、大镜像、大模型分发 |
| **Kraken** (Uber) | P2P + Manifest | 轻量、架构简单 | 维护活跃度低、无 Preheat API | 中小规模、镜像分发 |
| **原生 Registry** | 中心化 | 零额外组件 | 出口带宽瓶颈、容易打爆 | 小集群、文件小 |
| **分布式缓存 (Harbor+Redis 等)** | LRU 缓存代理 | 简单透明 | 仍是星型、无 P2P 卸载 | 减少回源、非峰值场景 |
| **对象存储 + sidecar 挂载** | 直接读 S3 | 无 P2P 复杂度 | 无跨节点共享、首拉慢 | 单节点推理、小模型 |

### 8.2 什么时候选 Dragonfly

```
   节点数 > 50  且  单制品 > 10GB？
        │ 是                          │ 否 ─► 原生 Registry / Harbor 足够
        ▼
   是否「批量部署 / 弹性扩容 / 多机房」？
        │ 是                          │ 否 ─► 分布式缓存代理可解
        ▼
   → 部署 Dragonfly（P2P 收益最大）
```

选型红线：

- **大模型分发（LLM 权重、ModelKit、HF 数据集）** → 首选 Dragonfly
- **GPU 集群弹性扩容（Spot 抢占、Autoscaler）** → 配合 Preheat 必选
- **跨机房 / 多集群 AI 平台** → 用 Seed 级联，避免每机房回源
- **小集群、文件 < 5GB、无并发拉取** → 原生 Registry 更轻

---

## 9. 常见问题 FAQ

**Q1：Dragonfly 和 HuggingFace 的并发拉取限流冲突吗？**
不冲突。Dragonfly 只让 Seed Peer 回源 HF 一次，普通 Peer 全部从集群内部 P2P 拿，因此 HF 侧看到的是"单 IP 单次下载"，天然规避 HF 的速率限制和 429。

**Q2：用了 Dragonfly，业务侧需要改代码吗？**
不需要。containerd mirror 配好后，`crictl pull` / Pod 调度完全透明。原始文件场景也只需把下载 URL 改成走 Peer 代理或调 Preheat API。

**Q3：P2P 会不会拖慢 GPU 推理节点的网络？**
会，但可通过 `peer.config.upload.rateLimit` 严格限速。生产实践是给 Peer 单独一张网卡或 VLAN，配合 QoS 策略，让推理 KV 传输始终优先。

**Q4：Preheat 失败怎么办？Preheat 没覆盖到的节点会怎样？**
Preheat 失败不影响业务——后续 Pod 拉镜像时仍会自动走 Dragonfly（只是首次较慢）。建议把 Preheat 接入 CI/CD，部署前必跑，状态非 SUCCESS 阻断部署。

**Q5：缓存盘满了会自动清理吗？会删掉正在用的模型吗？**
会自动 GC（`diskGCThresholdPercent` 触发），按 LRU 淘汰。不会删「正在被引用」的 Piece，但长时间未命中的冷模型会被清掉，下次访问重新 P2P 分发。

**Q6：Dragonfly 支持非 OCI 的大文件（比如直接是 .safetensors）吗？**
支持。通过源类型 `s3` / `huggingface` / 任意 HTTP URL，Preheat 时传文件 URL，Peer 会按 Piece 切分 P2P 分发，业务侧按原 URL 读取即可命中缓存。

---

## Related

- [[CNCF_Cloud_Native_AI/README]] — CNCF 云原生 AI 全景总览
- [[CNCF_Cloud_Native_AI/KitOps_Deep_Dive]] — ModelKit 打包层（与 Dragonfly 传输层正交，组合成完整分发栈）
- [[CNCF_Cloud_Native_AI/KAITO_Deep_Dive]] — KAITO preset 镜像正是 Dragonfly 加速的首选对象
- [[12_Architecture_Infrastructure/AI_Infrastructure_2026]] — 2026 AI 基础设施演进背景
