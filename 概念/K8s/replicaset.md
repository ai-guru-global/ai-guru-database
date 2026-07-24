---
title: "ReplicaSet"
category: -concepts
tags: ["kubernetes", "k8s", "controller", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes ReplicaSet 是确保指定数量 Pod 副本持续运行的控制器，通过 selector 管理 Pod 生命周期，是 Deployment 实现滚动更新和自愈的基础层。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "ReplicaSet"
  - "RS"
  - "副本集"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/pod"
    type: related_to
  - target: "概念/deployment"
    type: part_of
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# ReplicaSet

> **一句话理解**: ReplicaSet 是 K8s 的「副本看守」——它通过 label selector 保证集群里始终有正确数量的 Pod 在运行，是 Deployment 实现自愈与扩缩容的底层机制。

## 核心要点

- **副本数保障**：通过 `replicas` 字段声明期望 Pod 数量，ReplicaSet Controller 持续对比实际状态与期望状态，缺则补、多则删。
- **Pod 识别方式**：使用 `selector.matchLabels` 匹配 Pod label；只有带正确 label 的 Pod 才会被纳入管理，因此手动创建的同名 Pod 若 label 不匹配也不会被误删。
- **不直接负责更新**：ReplicaSet 本身不支持镜像版本升级策略；日常应用部署应优先使用 Deployment，由 Deployment 创建新版 ReplicaSet 并做滚动更新。
- **独立使用场景**：适合不需要滚动更新的长期稳定负载（如 Daemon-like 但跨节点固定副本、守护型 Agent），或作为自定义 Operator 的底层资源。
- **AI 推理场景**：在 AI Stack 中，推理服务的多副本高可用通常由 Deployment 间接管理，ReplicaSet 保证每版本副本数正确。

## 典型 YAML / 命令示例

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: ai-inference-rs
  namespace: default
  labels:
    app: ai-inference
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-inference
  template:
    metadata:
      labels:
        app: ai-inference
    spec:
      containers:
        - name: inference
          image: registry-internal/ai-inference:v1.2.0
          ports:
            - containerPort: 8080
          resources:
            requests:
              memory: "2Gi"
              cpu: "1000m"
            limits:
              memory: "4Gi"
              cpu: "2000m"
```

常用命令：

```bash
# 创建 ReplicaSet
kubectl apply -f ai-inference-rs.yaml

# 查看 ReplicaSet 状态
kubectl get rs ai-inference-rs

# 查看由 ReplicaSet 管理的 Pod
kubectl get pods -l app=ai-inference

# 手动扩缩容
kubectl scale rs ai-inference-rs --replicas=5

# 删除 ReplicaSet（默认级联删除管理的 Pod）
kubectl delete rs ai-inference-rs  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]
```

## 选型对比

| 资源对象 | 管理粒度 | 是否支持滚动更新 | 适用场景 |
|---------|---------|----------------|---------|
| **Pod** | 单个容器组 | 否 | 一次性调试、Job |
| **ReplicaSet** | 多副本 Pod | 否 | 稳定副本保障、自定义 Operator |
| **Deployment** | ReplicaSet + Pod | 是 | 无状态应用、AI 推理服务 |
| **StatefulSet** | 有状态副本 | 是（有序） | 数据库、消息队列 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版或专有云中，ReplicaSet 与 Deployment 同样由 ACK 托管的 kube-controller-manager 管理。运维工单中常见的「Pod 数量不足」「副本漂移」等问题，往往与 ReplicaSet 的 selector 配置、节点资源余量或 ASCM 资源配额有关。排查时可结合 Tianji 监控与 Luoshen 网络诊断，定位 Pod 未调度或被驱逐的根因。

## Related

- [[概念/kubernetes|Kubernetes]] — K8s 编排平台
- [[概念/pod|Pod]] — ReplicaSet 管理的最小单元
- [[概念/deployment|Deployment]] — 基于 ReplicaSet 的声明式无状态部署
- [[概念/label|Label]] — 标签与选择器
- [[概念/kubectl|kubectl]] — 管理 ReplicaSet 的 CLI 工具

---

## 2026 ReplicaSet 最佳实践

| 场景 | 使用方式 | 说明 |
|------|----------|------|
| 无状态应用 | Deployment | 推荐，支持滚动更新 |
| 稳定副本 | 直接使用 RS | 不需要更新策略 |
| 自定义 Operator | 底层资源 | Operator 管理 RS |

## 生产最佳实践

1. **优先用 Deployment**：Deployment 提供滚动更新和回滚
2. **Label 匹配**：确保 selector 与 Pod template labels 一致
3. **资源限制**：设置合理的 requests/limits
4. **监控副本数**：关注期望副本数与实际副本数差异

## ReplicaSet vs Deployment

| 特性 | ReplicaSet | Deployment |
|------|------|------|
| 更新策略 | 无 | 滚动更新/回滚 |
| 版本管理 | 无 | 支持 |
| 直接使用 | 不推荐 | 推荐 |
| 所有者 | Deployment | 无 |
| 适用场景 | 底层理解 | 生产使用 |

## ReplicaSet 工作原理

| 步骤 | 说明 |
|------|------|
| 1 | 监控当前 Pod 数量 |
| 2 | 与期望副本数比较 |
| 3 | 不足则创建新 Pod |
| 4 | 过多则删除 Pod |
| 5 | 持续循环监控 |

## ReplicaSet 配置示例

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: my-replicaset
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:latest
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
```

## 控制器层级关系

```
Deployment
  └── ReplicaSet (v1)
        ├── Pod-1
        ├── Pod-2
        └── Pod-3
  └── ReplicaSet (v2)  # 更新时创建新 RS
        ├── Pod-4
        └── Pod-5
```

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get rs` | 查看 ReplicaSet |
| `kubectl describe rs <name>` | RS 详情 |
| `kubectl scale rs <name> --replicas=5` | 扩缩容 |
| `kubectl delete rs <name>` | 删除 RS |

> 💡 ReplicaSet 是 Deployment 的底层实现，2026 年生产环境应直接使用 Deployment，ReplicaSet 仅用于理解原理。
