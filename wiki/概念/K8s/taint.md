---
title: "Taint（污点）"
category: -concepts
tags: ["kubernetes", "k8s", "scheduling", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes 的 Taint 是一种节点属性标记机制，用于排斥不满足条件的 Pod 调度到该节点，常与 Toleration 配合使用以实现专用节点、硬件隔离等场景。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Taint"
  - "Node Taint"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/pod"
    type: related_to
  - target: "概念/request-scheduling"
    type: part_of
sources: []
name_zh: "污点"
---

# Taint（污点）

> 中文简称：污点

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

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/pod|Pod]] — Pod 调度对象
- [[概念/toleration|Toleration]] — 容忍度
- [[概念/request-scheduling|Request Scheduling]] — 调度机制
- [[概念/kueue|Kueue]] — Kubernetes 作业队列调度
- [[概念/gpu-operator|GPU Operator]] — GPU 节点管理

---

## 2026 Taint 最佳实践

| 场景 | Taint 配置 | 说明 |
|------|------------|------|
| GPU 专用节点 | nvidia.com/gpu=true:NoSchedule | AI 训练/推理专用 |
| 控制平面 | node-role.kubernetes.io/control-plane | 隔离 Master |
| 节点维护 | maintenance=true:NoExecute | 驱逐 Pod |

## 生产最佳实践

1. **GPU 节点隔离**：GPU 节点添加 Taint，防止普通 Pod 占用
2. **与 Toleration 配合**：Pod 声明 Toleration 才能调度到 Taint 节点
3. **维护场景**：节点维护时用 NoExecute 驱逐 Pod
4. **软性偏好**：非强制场景用 PreferNoSchedule

## Taint 组成

| 组件 | 说明 | 示例 |
|------|------|------|
| Key | 键 | nvidia.com/gpu |
| Value | 值 | true |
| Effect | 效果 | NoSchedule |

## Taint Effect 详解

| Effect | 新 Pod | 现有 Pod | 适用场景 |
|------|------|------|------|
| NoSchedule | 不调度 | 不影响 | 专用节点 |
| PreferNoSchedule | 尽量不调度 | 不影响 | 优先避免 |
| NoExecute | 不调度 | 驱逐 | 紧急隔离 |

## 常见 Taint 场景

| 场景 | Taint | 说明 |
|------|------|------|
| Master 节点 | node-role.kubernetes.io/master:NoSchedule | 控制面专用 |
| GPU 节点 | nvidia.com/gpu:NoSchedule | GPU 专用 |
| 节点维护 | node.kubernetes.io/unschedulable:NoSchedule | 维护模式 |
| 节点故障 | node.kubernetes.io/not-ready:NoExecute | 故障隔离 |
| 训练专用 | workload=training:NoSchedule | 训练节点池 |

## Taint 操作命令

| 命令 | 用途 |
|------|------|
| `kubectl taint nodes node1 key=value:NoSchedule` | 添加 Taint |
| `kubectl taint nodes node1 key:NoSchedule-` | 移除 Taint |
| `kubectl describe node node1` | 查看节点 Taint |
| `kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints` | 列出所有 Taint |

## AI 集群 Taint 策略

```bash
# GPU 训练节点专用
kubectl taint nodes gpu-train-01 workload=training:NoSchedule

# GPU 推理节点专用
kubectl taint nodes gpu-infer-01 workload=inference:NoSchedule

# 节点维护
kubectl taint nodes node1 maintenance=true:NoExecute
```

> 💡 Taint 是 K8s 节点专用化的核心机制，2026 年 AI 集群中 GPU 训练/推理节点分离必须使用 Taint + Toleration。

## Taint vs NodeAffinity

| 特性 | Taint | NodeAffinity |
|------|------|------|
| 作用对象 | 节点拒绝 Pod | Pod 选择节点 |
| 方向 | 节点 → Pod | Pod → 节点 |
| 配合使用 | Toleration | nodeSelector |
| 适用场景 | 节点专用化 | Pod 定向调度 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Pod 无法调度 | 节点有 Taint | 添加 Toleration |
| Pod 被驱逐 | NoExecute 生效 | 添加 Toleration + tolerationSeconds |
| Taint 不生效 | Effect 错误 | 检查 Effect 拼写 |
| 节点无法调度 | Taint 未移除 | 移除 Taint |

## 最佳实践

| 实践 | 说明 |
|------|------|
| GPU 节点专用 | nvidia.com/gpu:NoSchedule |
| 训练/推理分离 | workload=training/inference |
| 维护模式 | maintenance=true:NoExecute |
| 配合 Toleration | Pod 声明对应 Toleration |

> 📌 Taint 和 Toleration 是成对使用的，Taint 设在节点上，Toleration 设在 Pod 上。

> 📌 生产环境建议：GPU 节点全部打 Taint，只有声明 Toleration 的 AI 工作负载才能调度上去。
