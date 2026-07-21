---
title: "Toleration（容忍）"
category: -concepts
tags: ["kubernetes", "k8s", "toleration", "cloud-native", "alibaba-cloud", "scheduling"]
summary: "Toleration 是 Pod 对节点 Taint 的容忍声明，允许 Pod 被调度到带污点的节点，常与 Taint 配合实现专用节点与运维驱逐控制。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "Toleration"
  - "Pod Toleration"
  - "容忍"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/taint"
    type: related_to
  - target: "概念/pod"
    type: related_to
  - target: "概念/request-scheduling"
    type: part_of
sources: []
---

# Toleration（容忍）

> **一句话理解**: Toleration 是 Pod 对 Node Taint 的「豁免声明」，让原本被排斥的 Pod 获得调度到污点节点的资格。

## 核心要点

- **定义**: Toleration 声明在 Pod 的 `spec.tolerations` 中，用来匹配 Node 上的 Taint，包含 `key`、`operator`、`value`、`effect` 与可选的 `tolerationSeconds`。
- **匹配规则**: `operator` 为 `Equal` 时需同时匹配 key、value、effect；为 `Exists` 时只需匹配 key 与 effect。
- **与 Taint 的关系**: Taint 是节点「设门槛」，Toleration 是 Pod「拿通行证」；二者配合才能实现专用节点或分级调度。
- **NoExecute 容忍**: 当 Taint 的 effect 为 `NoExecute` 时，可设置 `tolerationSeconds` 延迟被驱逐时间，常用于优雅退出。
- **典型价值**: 允许 GPU 训练 Pod 进入 GPU 专用节点、让 DaemonSet 运行在所有节点、控制维护窗口内的 Pod 驱逐行为。

## 典型 YAML / 命令示例

### Pod 中声明 Toleration

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
    # 精确匹配 Taint：dedicated=ai-training:NoSchedule
    - key: "dedicated"
      operator: "Equal"
      value: "ai-training"
      effect: "NoSchedule"
    # 只匹配 key 与 effect，不限 value
    - key: "preemptible"
      operator: "Exists"
      effect: "PreferNoSchedule"
    # 允许节点维护时延迟 300 秒再被驱逐
    - key: "maintenance"
      operator: "Equal"
      value: "true"
      effect: "NoExecute"
      tolerationSeconds: 300
```

### 常用 kubectl 查看命令

```bash
# 查看 Pod 已声明的 Toleration
kubectl get pod ai-training-job -o jsonpath='{.spec.tolerations}'

# 查看节点上的 Taint
kubectl describe node node-gpu-01 | grep -A10 Taints

# 查看因 Taint/Toleration 处于 Pending 的 Pod 事件
kubectl describe pod <pod-name> | grep -A5 Events
```

## 常见场景

| 场景 | Toleration 配置要点 | 说明 |
|------|---------------------|------|
| **GPU 专用节点** | `key=dedicated, value=ai-training, effect=NoSchedule` | 仅允许训练/推理 Pod 调度到 GPU 节点。 |
| **DaemonSet 全节点部署** | 通常容忍所有 Taint（`operator: Exists` 且无 key） | 日志、监控、安全 Agent 需在每个节点运行。 |
| **节点维护优雅退出** | `effect=NoExecute, tolerationSeconds=600` | 给有状态服务预留保存数据的时间。 |
| **抢占式实例离线任务** | `key=preemptible, effect=PreferNoSchedule` | 允许低成本实例承担可中断批处理。 |
| **多租户节点池隔离** | `key=tenant, value=team-a, effect=NoSchedule` | 配合 Taint 实现团队级节点池隔离。 |

## 选型对比

| 机制 | 配置位置 | 作用方向 | 核心能力 | 与 Toleration 的关系 |
|------|----------|----------|----------|----------------------|
| **Taint** | Node | 节点排斥 Pod | 设置调度门槛 | Toleration 的「前提」 |
| **Toleration** | Pod | Pod 豁免 Taint | 允许被排斥的 Pod 调度 | Taint 的「解药」 |
| **nodeSelector** | Pod | Pod 选择节点 | 等值匹配节点标签 | 独立机制 |
| **nodeAffinity** | Pod | Pod 偏好节点 | 软硬约束、集合运算 | 常与 Toleration 叠加 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版 / 专有云版中，Toleration 与 Taint 共同支撑多租户与硬件隔离。例如，为 X-Dragon 神龙 GPU 节点打上 `dedicated=ai-training:NoSchedule` 后，AI 训练 Pod 必须声明对应 Toleration 才能调度；监控/日志 DaemonSet 通常容忍所有 Taint，确保在 Luoshen 网络节点、Pangu 存储相关节点上也能部署。当 Tianji 触发节点升级或故障迁移时，配合 `NoExecute` Taint 与 `tolerationSeconds` 可实现有状态负载的优雅退出。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/taint|Taint（污点）]] — 与 Toleration 配合的节点排斥机制
- [[概念/pod|Pod]] — K8s 最小调度单元
- [[概念/affinity|Affinity（亲和性调度）]] — 节点/ Pod 亲和与反亲和
- [[概念/gpu-operator|GPU Operator]] — GPU 节点管理
- [[概念/request-scheduling|Request Scheduling]] — K8s 调度机制

---

## 2026 Toleration 最佳实践

| 场景 | Toleration 配置 | 说明 |
|------|-----------------|------|
| GPU 专用节点 | dedicated=ai-training:NoSchedule | AI 训练/推理专用 |
| DaemonSet | operator: Exists | 全节点部署 |
| 优雅退出 | tolerationSeconds: 300 | 延迟驱逐 |

## 生产最佳实践

1. **与 Taint 配合**：Taint 设门槛，Toleration 拿通行证
2. **GPU 节点**：AI 工作负载声明 GPU 节点 Toleration
3. **DaemonSet 豁免**：监控/日志 Agent 容忍所有 Taint
4. **优雅退出**：NoExecute 配合 tolerationSeconds
