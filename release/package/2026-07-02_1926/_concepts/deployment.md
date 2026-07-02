---
title: "Deployment"
category: -concepts
tags: ["kubernetes", "k8s", "deployment", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes Deployment 是管理无状态应用负载的声明式控制器，负责 Pod 的创建、滚动更新、扩缩容和自愈，是 K8s 上部署 AI 推理与业务服务的最常用工作负载。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Deployment"
  - "K8s Deployment"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/helm"
    type: related_to
  - target: "_concepts/kustomize"
    type: related_to
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# Deployment

> **一句话理解**: Deployment 是 K8s 上管理无状态应用的「自动运维器」——你声明要跑几个 Pod、用什么镜像，它负责创建、更新、扩缩和自动恢复。

## 核心要点

- **声明式控制器**：通过 YAML 描述期望状态（镜像版本、副本数、更新策略等），Deployment Controller 持续 reconcile 实际状态与期望状态。
- **管理 ReplicaSet**：Deployment 不直接管理 Pod，而是创建并滚动更新 ReplicaSet，由 ReplicaSet 保证指定数量的 Pod 副本运行。
- **滚动更新与回滚**：支持 `RollingUpdate`（零停机更新）和 `Recreate`（先删后建）；更新失败可随时 `kubectl rollout undo` 回滚到上一版本。
- **水平扩缩容**：可手动 `kubectl scale` 或通过 HPA 根据 CPU/内存/自定义指标自动扩缩副本数。
- **自愈能力**：节点故障或 Pod 被误删时，Deployment 会自动重新调度并补齐副本。
- **适用场景**：无状态服务（如 AI 推理 API、Web 服务、消息处理 worker），不适合需要稳定网络标识或持久存储的有状态应用。

## 典型 YAML / 命令示例

### 基础 Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference-svc
  namespace: default
  labels:
    app: llm-inference
spec:
  replicas: 3
  selector:
    matchLabels:
      app: llm-inference
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: llm-inference
    spec:
      containers:
        - name: vllm
          image: registry.example.com/llm/vllm:0.4.2
          ports:
            - containerPort: 8000
          resources:
            requests:
              cpu: "4"
              memory: "16Gi"
              nvidia.com/gpu: "1"
            limits:
              cpu: "8"
              memory: "32Gi"
              nvidia.com/gpu: "1"
          env:
            - name: MODEL_NAME
              value: "Qwen2-7B-Instruct"
```

### 常用运维命令

```bash
# 创建或更新 Deployment
kubectl apply -f deployment.yaml

# 查看 Deployment 状态
kubectl get deploy llm-inference-svc
kubectl describe deploy llm-inference-svc

# 手动扩容到 5 个副本
kubectl scale deploy llm-inference-svc --replicas=5

# 滚动更新镜像
kubectl set image deploy/llm-inference-svc vllm=registry.example.com/llm/vllm:0.5.0

# 查看滚动更新进度
kubectl rollout status deploy/llm-inference-svc

# 查看历史版本并回滚
kubectl rollout history deploy/llm-inference-svc
kubectl rollout undo deploy/llm-inference-svc
```

## 选型对比

| 工作负载 | 是否 Stateful | 是否适合 Deployment | 说明 |
|----------|--------------|---------------------|------|
| **Deployment** | 否 | ✅ 首选 | 无状态服务、Web API、推理服务 |
| **StatefulSet** | 是 | ❌ 不适用 | 需要固定网络标识、持久存储，如数据库 |
| **DaemonSet** | 否 | ❌ 不适用 | 每个节点跑一个 Pod，如日志/监控 Agent |
| **Job / CronJob** | 否 | ❌ 不适用 | 一次性或定时任务，如批量推理、训练任务 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版或专有版中，Deployment 是工作负载控制台和工单系统最常操作的 K8s 原生资源之一。用户通过 ASCM 控制台或 Tianji 运维体系下发应用部署/变更/扩缩容工单时，底层通常转化为 Deployment（或 StatefulSet）的创建与更新；X-Dragon 服务器与 Luoshen 网络为 Pod 提供计算与网络能力，Nüwa 平台则负责镜像构建与分发。工单 Agent 处理「应用无法滚动更新」「Pod 调度失败」「副本数扩缩异常」等问题时，核心排查对象就是 Deployment 的 Events、ReplicaSet 和 Pod 状态。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/helm|Helm]] — K8s 包管理与 Deployment 模板化
- [[_concepts/kustomize|Kustomize]] — K8s 配置管理与 Deployment 变体
- [[_concepts/containerd|containerd]] — K8s 容器运行时
- [[_concepts/cri|CRI]] — 容器运行时接口
- [[_concepts/etcd|etcd]] — K8s 配置与状态存储
- [[_concepts/apsara-stack|Apsara Stack]] — 阿里云专有云
