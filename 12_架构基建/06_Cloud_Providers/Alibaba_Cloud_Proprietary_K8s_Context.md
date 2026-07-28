---
title: "阿里云专有云 K8s 上下文"
category: 12-architecture-infrastructure
tags: ["kubernetes", "k8s", "alibaba-cloud", "apsara-stack", "proprietary-cloud", "ack", "ascm", "tianji", "cloud-native"]
summary: "面向阿里云专有云 K8s 工单智能体的上下文手册：梳理 ACK 专有版/敏捷版、天基、ASCM、飞天底座与 K8s 集群的对应关系，以及典型工单场景的处理入口。"
created: 2026-06-26
updated: 2026-06-26
tier: core
sources: []
name_zh: "阿里云专有云 K8s 上下文"
---

# 阿里云专有云 K8s 上下文

> 中文简称：阿里云专有云 K8s 上下文

> **一句话理解**: 这份文档是 K8s 通用知识与阿里云专有云实际产品之间的「翻译表」，让工单智能体能把 Pod 异常、网络不通、存储失败等泛化问题映射到天基、ASCM、ACK 的具体排查路径。

## 目录

- [1. 专有云产品形态](#1-专有云产品形态)
- [2. 核心组件与 K8s 对应关系](#2-核心组件与-k8s-对应关系)
- [3. 运维控制台与入口](#3-运维控制台与入口)
- [4. ACK 专有版 vs 敏捷版](#4-ack-专有版-vs-敏捷版)
- [5. 典型工单场景映射](#5-典型工单场景映射)
- [6. 常用排查命令与入口](#6-常用排查命令与入口)
- [7. 阿里云专有云术语表](#7-阿里云专有云术语表)
- [Related](#related)

---

## 1. 专有云产品形态

阿里云专有云（Apsara Stack / 飞天企业版）是阿里云公有云能力在企业本地数据中心的私有化部署形态。与 K8s 工单处理最相关的产品线包括：

| 产品 | 定位 | 与 K8s 关系 |
|------|------|------------|
| **容器服务 ACK 专有版** | 企业级容器平台 | 完整托管 K8s 控制平面，用户管理 Worker 节点 |
| **容器服务 ACK 敏捷版** | 轻量容器平台 | 通常与天基深度集成，面向敏捷交付 |
| **天基 Tianji** | 专有云底座运维系统 | 部署、升级、监控、修复专有云集群与物理机 |
| **ASCM** | 统一云管平台 | 租户、资源、项目、配额、告警的统一入口 |
| **飞天 Apsara** | 分布式操作系统 | K8s 底层依赖的计算、网络、存储资源池 |
| **洛神 Luoshen** | 专有云平台网络 | VPC、VSwitch、SLB、EIP、路由 |
| **盘古 Pangu** | 分布式存储 | 块存储、对象存储、文件存储 |
| **女娲 Nüwa** | 分布式协同 | 命名服务、配置中心、分布式锁 |
| **神龙 X-Dragon** | 弹性裸金属 / MOC 卡 | 高性能计算节点、网络卸载 |

---

## 2. 核心组件与 K8s 对应关系

```text
┌─────────────────────────────────────────────────────────────────┐
│                         用户 / 业务                              │
│                         阿里云控制台 / ASCM                      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    容器服务 ACK 专有版 / 敏捷版                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ API Server   │  │ Scheduler    │  │ Controller Manager   │    │
│  └──────────────┘  └──────────────┘  └──────────────────────┘    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ etcd（通常由女娲 / 天基提供高可用存储）                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                         天基 Tianji                             │
│  部署 · 升级 · 监控 · 修复 · 机器管理 · OpsBox                   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                         飞天 Apsara 底座                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  计算     │  │  网络     │  │  存储     │  │  协同     │        │
│  │ 神龙      │  │ 洛神      │  │ 盘古      │  │ 女娲      │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 K8s 组件与专有云映射

| K8s 组件 | 专有云承载 | 常见工单点 |
|----------|-----------|-----------|
| kube-apiserver | ACK 控制面 / 天基部署 | 证书过期、限流、网络分区 |
| etcd | 飞天高可用存储 / 女娲 | 磁盘 IO 高、leader 选举 |
| kube-scheduler | ACK 控制面 | 调度失败、资源不足 |
| kubelet | Worker 节点 | 节点 NotReady、Pod 卡住 |
| kube-proxy | Worker 节点 | Service 不通、规则未同步 |
| CNI (Terway/Flannel) | 洛神网络 + ACK CNI | Pod IP 分配、跨节点不通 |
| CSI | 盘古存储 + ACK CSI | PVC 绑定、挂载失败 |
| Cloud Controller Manager | ACK 控制面 | LoadBalancer Service Pending |

---

## 3. 运维控制台与入口

### 3.1 ASCM（统一云管平台）

- **资源管理**: 项目、资源集、ACK 集群、节点、命名空间。
- **配额管理**: CPU / 内存 / GPU / 存储配额。
- **告警中心**: 汇聚 ACK、天基、底层基础设施告警。
- **操作审计**: 记录管理员和用户对资源的操作。
- **工单入口**: 用户提交问题单、查看处理进度。

### 3.2 天基 Tianji

- **集群部署与升级**: 专有云版本升级、补丁管理。
- **机器管理**: 物理机、裸金属、虚拟机生命周期。
- **OpsBox**: 运维堡垒机，可 SSH/RDP 到各组件机器。
- **健康巡检**: 自动化检查集群各组件健康状态。
- **告警与自愈**: 部分故障可自动修复或触发预案。

### 3.3 ACK 控制台

- **集群概览**: 节点、Pod、工作负载、事件。
- **应用管理**: Deployment、StatefulSet、DaemonSet、Job。
- **网络与存储**: Service、Ingress、PVC、StorageClass。
- **可观测性**: 监控、日志、告警（对接 Prometheus/Loki/ARMS）。

---

## 4. ACK 专有版 vs 敏捷版

| 维度 | ACK 专有版 | ACK 敏捷版 |
|------|-----------|-----------|
| 定位 | 大规模、金融级核心生产 | 中小规模、快速交付、边缘 |
| 控制面 | 多 Master 高可用 | 可精简部署 |
| 节点类型 | 神龙 / ECS / 裸金属 | 轻量节点 |
| 网络 | 洛神 VPC、Terway/Flannel | 洛神 VPC、Flannel 为主 |
| 存储 | 盘古云盘、NAS、OSS | 云盘、本地存储 |
| 与天基关系 | 深度集成，天基托管 | 可由天基或独立运维 |
| 适用场景 | 核心交易系统、大数据 | DevOps、AI 推理、边缘 |

---

## 5. 典型工单场景映射

### 5.1 用户报障：「应用无法访问」

**智能体处理路径**：

1. ASCM 确认集群、Namespace、应用名称。
2. ACK 控制台查看 Pod 状态：
   - Running → 进入网络排查。
   - Pending/CrashLoopBackOff → 进入 Pod 排障。
3. 网络排查：
   - Service Endpoint 是否为空？
   - Ingress 502/503？看 Ingress Controller 日志。
   - LoadBalancer 是否分配了 IP？
4. 专有云特有点：
   - CCM 是否运行？
   - 洛神 SLB 是否创建成功？
   - 安全组 / NetworkPolicy 是否放行？

### 5.2 用户报障：「Pod 一直 Pending」

**智能体处理路径**：

1. `kubectl describe pod` 看 Events。
2. 若事件为 `0/X nodes are available`：
   - 检查节点资源：`kubectl describe node`
   - 检查调度约束：taints / affinity / topology
3. 若为镜像拉取失败：
   - 检查镜像仓库地址、imagePullSecret
   - 检查节点到 ACR/Harbor 的网络
4. 若为 PVC Pending：
   - 检查 StorageClass、盘古存储余量、CSI driver

### 5.3 用户报障：「节点 NotReady」

**智能体处理路径**：

1. ASCM 查看节点告警。
2. 天基 OpsBox 登录节点。
3. 检查：
   - kubelet 状态：`systemctl status kubelet`
   - containerd 状态：`systemctl status containerd`
   - 节点压力：`df -h`、`free -h`
   - 神龙 MOC 卡、洛神网卡、盘古磁盘
4. 必要时在天基发起节点修复或替换。

### 5.4 用户报障：「证书过期」

1. `kubectl get secret <tls-secret> -o yaml` 查看有效期。
2. 若使用 cert-manager：检查 Certificate / ClusterIssuer 状态。
3. 若为天基/ACK 组件证书：通过天基证书管理模块续期。
4. 专有云证书链通常涉及：K8s 组件证书、Ingress TLS、应用证书、天基底座证书。

### 5.5 用户报障：「集群升级失败」

1. 天基查看升级任务日志。
2. 检查前置条件：节点健康、镜像仓库可达、etcd 空间充足。
3. 检查升级过程中是否有 Pod 驱逐失败或节点未就绪。
4. 必要时回滚到天基快照。

---

## 6. 常用排查命令与入口

### 6.1 K8s 层命令

```bash
# 集群状态快照
kubectl get nodes,pods --all-namespaces -o wide

# 节点详情
kubectl describe node <node-name>

# Pod 事件
kubectl describe pod <pod-name> -n <ns>

# 日志
kubectl logs <pod-name> -n <ns> --previous

# Service 后端
kubectl get endpoints <svc-name> -n <ns>
```

### 6.2 天基层命令（示例，以实际版本为准）

```bash
# 查看集群健康
tianji-cli cluster health <cluster-id>

# 查看机器列表
tianji-cli machine list --cluster <cluster-id>

# 登录 OpsBox
tianji-cli opsbox login <cluster-id>
```

### 6.3 ASCM 入口

- 告警中心：`https://ascm.<domain>/alarm`
- 资源管理：`https://ascm.<domain>/resource/ack`
- 工单系统：`https://ascm.<domain>/ticket`
- 操作审计：`https://ascm.<domain>/audit`

---

## 7. 阿里云专有云术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 飞天 | Apsara | 阿里云自研分布式操作系统 |
| 天基 | Tianji | 专有云部署与运维管理系统 |
| 洛神 | Luoshen | 专有云平台网络系统 |
| 盘古 | Pangu | 分布式存储系统 |
| 女娲 | Nüwa | 分布式协同与配置系统 |
| 神龙 | X-Dragon | 弹性裸金属服务器 / MOC 卡 |
| ASCM | Apsara Stack Cloud Management | 统一云管平台 |
| ACK | Alibaba Cloud Container Service for Kubernetes | 容器服务 Kubernetes 版 |
| ACR | Alibaba Cloud Container Registry | 容器镜像服务 |
| ARMS | Application Real-Time Monitoring Service | 应用实时监控服务 |
| SLS | Log Service | 日志服务 |
| RDS | Relational Database Service | 关系型数据库 |
| OSS | Object Storage Service | 对象存储服务 |
| NAS | Network Attached Storage | 文件存储 |
| SLB | Server Load Balancer | 负载均衡 |
| EIP | Elastic IP Address | 弹性公网 IP |
| VPC | Virtual Private Cloud | 专有网络 |
| VSwitch | Virtual Switch | 虚拟交换机 |

---

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 核心概念
- [[概念/apsara-stack|Apsara Stack]] — 阿里云专有云概念
- [[12_架构基建/Kubernetes_Core_Components_Deep_Dive|K8s 核心组件深度解析]]
- [[12_架构基建/Kubernetes_Networking_Deep_Dive|K8s 网络深度解析]]
- [[12_架构基建/Kubernetes_Storage_Deep_Dive|K8s 存储深度解析]]
- [[13_运维/Kubernetes_Troubleshooting_Playbook|K8s 运维排障 Playbook]]
- [[11_模型运维/Cloud_Ops_Agent/docs/corpus/alicloud-proprietary-k8s-agent-corpus-plan|语料建设规划]]
