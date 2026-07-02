---
title: "ReplicaSet"
category: -concepts
tags: ["kubernetes", "k8s", "controller", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes ReplicaSet 是确保指定数量 Pod 副本持续运行的控制器，通过 selector 管理 Pod 生命周期，是 Deployment 实现滚动更新和自愈的基础层。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "ReplicaSet"
  - "RS"
  - "副本集"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/pod"
    type: related_to
  - target: "_concepts/deployment"
    type: part_of
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
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

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/pod|Pod]] — ReplicaSet 管理的最小单元
- [[_concepts/deployment|Deployment]] — 基于 ReplicaSet 的声明式无状态部署
- [[_concepts/kubectl|kubectl]] — 管理 ReplicaSet 的 CLI 工具
- [[_concepts/containerd|containerd]] — Pod 底层容器运行时
