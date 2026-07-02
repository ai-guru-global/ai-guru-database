---
title: "Taint（污点）"
category: -concepts
tags: ["kubernetes", "k8s", "scheduling", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes 的 Taint 是一种节点属性标记机制，用于排斥不满足条件的 Pod 调度到该节点，常与 Toleration 配合使用以实现专用节点、硬件隔离等场景。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Taint"
  - "Node Taint"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/pod"
    type: related_to
  - target: "_concepts/request-scheduling"
    type: part_of
---

# Taint（污点）

> **一句话理解**: Taint 是 Kubernetes 节点上的「排斥标签」，没有对应 Toleration 的 Pod 无法被调度到该节点。

## 核心要点

- **定义**: Taint 是附加在 Node 上的键值对，包含 `key`、`value` 和 `effect` 三个字段，用于表达节点的特殊属性或限制。
- **作用机制**: Scheduler 在调度 Pod 时，会检查目标节点上的 Taint；若 Pod 没有声明可容忍该 Taint 的 Toleration，则不会将其调度到该节点。
- **三种 Effect**:
  - `NoSchedule`: 新的 Pod 不允许调度，但已运行的 Pod 不受影响。
  - `PreferNoSchedule`: 尽量避免调度，但不强制，属于软性偏好。
  - `NoExecute`: 不仅不允许新 Pod 调度，还会驱逐不能容忍该 Taint 的已运行 Pod。
- **与 Toleration 配合**: Taint 本身只是「门槛」，Pod 必须通过 `tolerations` 字段声明可接受的 Taint，二者共同完成节点隔离或专用化。
- **典型用途**: 隔离控制平面节点、专用 GPU/裸金属节点、标记故障或维护中节点、区分在线服务与离线训练负载。

## 典型 YAML / 命令示例

### 给节点添加 Taint

```bash
# 将节点标记为 AI 训练专用，拒绝普通 Pod 调度
kubectl taint nodes node-gpu-01 dedicated=ai-training:NoSchedule

# 给节点添加软性偏好，尽量避免调度
kubectl taint nodes node-spot-01 preemptible=true:PreferNoSchedule

# 标记节点为维护中并驱逐已有 Pod
kubectl taint nodes node-01 maintenance=true:NoExecute

# 移除 Taint（key 后需加短横线）
kubectl taint nodes node-gpu-01 dedicated=ai-training:NoSchedule-
```

### 在 Pod 中声明 Toleration

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ai-training-job
spec:
  containers:
    - name: pytorch
      image: pytorch/pytorch:latest
      resources:
        limits:
          nvidia.com/gpu: "1"
  tolerations:
    - key: "dedicated"
      operator: "Equal"
      value: "ai-training"
      effect: "NoSchedule"
    # 只匹配 key 与 effect，不限定 value
    - key: "preemptible"
      operator: "Exists"
      effect: "PreferNoSchedule"
```

## 常见场景

| 场景 | Taint 效果 | 说明 |
|------|-----------|------|
| **控制平面隔离** | `node-role.kubernetes.io/control-plane:NoSchedule` | 防止用户工作负载调度到 Master 节点。 |
| **GPU 专用节点** | `nvidia.com/gpu=true:NoSchedule` | 仅允许带 GPU Toleration 的 AI 训练/推理 Pod 使用。 |
| **节点维护/故障** | `maintenance=true:NoExecute` | 立即驱逐 Pod，方便运维人员下线处理。 |
| **抢占式/低成本实例** | `preemptible=true:PreferNoSchedule` | 优先调度可容忍中断的离线任务，提高资源利用率。 |
| **多租户隔离** | `tenant=team-a:NoSchedule` | 将部分节点预留给指定团队或业务线。 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版 / 专有云版中，Taint 同样是节点分组与调度的核心手段。运维人员常通过 Taint 将神龙（X-Dragon）裸金属 GPU 节点、洛神（Luoshen）网络节点或盘古（Pangu）存储相关节点进行隔离，避免普通业务 Pod 占用基础设施资源。配合 ASCM 的租户权限与 Tianji 的运维事件，当节点需要升级或故障迁移时，可通过添加 `NoExecute` 类型的 Taint 快速驱逐工作负载，保障集群稳定性。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/pod|Pod]] — Pod 调度对象
- [[_concepts/request-scheduling|Request Scheduling]] — 调度机制
- [[_concepts/kueue|Kueue]] — Kubernetes 作业队列调度
