---
title: "Node"
category: -concepts
tags: ["kubernetes", "k8s", "node", "cloud-native", "alibaba-cloud"]
summary: "Node 是 Kubernetes 集群中的工作节点，负责承载和运行 Pod；由 kubelet、kube-proxy 与容器运行时组成，是 Scheduler 调度工作负载、暴露计算/存储/网络资源的实际载体。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Node"
  - "Worker Node"
  - "K8s Node"
relationships:
  - target: "_concepts/kubernetes"
    type: part_of
  - target: "_concepts/containerd"
    type: related_to
  - target: "_concepts/pod"
    type: related_to
---

# Node

> **一句话理解**: Node 是 Kubernetes 集群里的「算力单元」——Pod 最终都跑在 Node 上，由控制面统一调度与管理。

## 核心要点

- **定义**：Node 是 K8s 工作节点，可以是物理机、虚拟机或裸金属服务器，负责运行容器化工作负载。
- **核心组件**：每个 Node 运行 kubelet（管理 Pod 生命周期）、kube-proxy（维护网络规则）和容器运行时（如 containerd）。
- **资源视角**：Node 向集群上报 `Capacity`（总资源）与 `Allocatable`（可分配资源），Scheduler 据此为 Pod 选择合适节点。
- **调度与约束**：通过 Label（如 `node-role.kubernetes.io/worker`）、Taint/Toleration、Affinity 控制 Pod 应该/不应该调度到哪些 Node。
- **状态管理**：Node 生命周期包含 `Ready` / `NotReady` / `SchedulingDisabled` 等状态，由 kubelet 心跳与 Controller 共同维护。
- **故障影响**：单个 Node 离线会导致其上的 Pod 被驱逐并在其他 Node 重建，因此生产环境需避免单点并合理配置 PDB。

## 典型 YAML / 命令示例

```yaml
apiVersion: v1
kind: Node
metadata:
  name: worker-01
  labels:
    node-role.kubernetes.io/worker: ""
    zone: cn-hangzhou-g
    accelerator: nvidia-a100
spec:
  taints:
    - key: "dedicated"
      value: "ai-training"
      effect: "NoSchedule"
```

```bash
# 查看节点列表与状态
kubectl get nodes -o wide

# 查看节点资源、标签与事件
kubectl describe node worker-01

# 给节点打标签（常用于专有云分区/机型标记）
kubectl label nodes worker-01 workload=ai-inference

# 隔离节点（禁止新 Pod 调度）
kubectl cordon worker-01

# 安全驱逐节点上的 Pod（维护前使用）
kubectl drain worker-01 --ignore-daemonsets --delete-emptydir-data

# 维护完成后恢复调度
kubectl uncordon worker-01
```

## 常见场景

| 场景 | 说明 | 常用操作 |
|------|------|----------|
| **节点扩容** | 业务增长时增加 Node | 通过集群控制台或 Cluster Autoscaler 添加后 `kubectl get nodes` 确认 |
| **节点维护** | 硬件更换、系统补丁、内核升级 | `kubectl cordon` → `kubectl drain` → 维护 → `kubectl uncordon` |
| **GPU 训练节点** | 专用 AI 训练节点 | 使用 Label/Taint 将训练 Pod 绑定到 GPU Node |
| **节点故障恢复** | kubelet 失联、磁盘异常或网络不可达 | `kubectl describe node` 查看 Conditions 与 Events |
| **调度优化** | 避免热点或保证亲和性 | 设置 Node Affinity / Pod Anti-Affinity |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专有版/敏捷版中，Node 通常对应 X-Dragon 神龙裸金属服务器、ECS 实例或经过深度优化的计算节点，由 ASCM 统一进行资源池化与租户隔离。kubelet 与容器运行时会适配专有云网络（如 Luoshen）和存储（如 Pangu）插件，调度器则结合机型、可用区、GPU/FPGA 加速卡等信息进行 Placement。工单场景中常见的问题包括 Node NotReady、CNI 网络不通、节点磁盘压力导致 Pod 被驱逐，以及 Tianji 监控告警触发的节点维护流程。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/pod|Pod]] — Node 上运行的最小调度单元
- [[_concepts/containerd|containerd]] — Node 常用容器运行时
- [[_concepts/kubectl|kubectl]] — 节点运维命令行工具
- [[_concepts/pod-disruption-budget|Pod Disruption Budget]] — 节点维护时的驱逐保护
