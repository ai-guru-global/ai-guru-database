---
title: "Selector"
category: -concepts
tags: ["kubernetes", "k8s", "selector", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes 中的 Selector 是一组用于筛选资源的匹配规则，Label Selector 决定 Service 流量该转发到哪些 Pod，也决定 Deployment/Replicaset 该管理哪些 Pod。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Label Selector"
  - "选择器"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/service"
    type: related_to
  - target: "_concepts/deployment"
    type: part_of
---

# Selector

> **一句话理解**: Selector 是 Kubernetes 的「筛子」——通过 Label 匹配规则，把 Service、Deployment、ReplicaSet 等控制器与目标 Pod 关联起来。

## 核心要点

- **本质**: 一种基于 key-value 的匹配规则，用于在 K8s 资源对象中筛选出目标子集。
- **最常见形式**: Label Selector，几乎所有控制器和 Service 都依赖它。
- **两种匹配语法**:
  - **等式型（Equality-based）**: `app=nginx`、`app!=nginx`。
  - **集合型（Set-based）**: `app in (nginx, redis)`、`!paused`、`version notin (v1)`。
- **核心使用场景**:
  - `Deployment.spec.selector` 决定它管理哪些 ReplicaSet/Pod。
  - `Service.spec.selector` 决定流量转发到哪些 Endpoint/Pod。
  - `Pod.spec.nodeSelector` 决定 Pod 可以调度到哪些 Node。
- **必须稳定且不可变**: 对于工作负载控制器，Label Selector 一旦创建通常不建议修改，否则会导致孤儿 Pod 或失控副本。
- **与 Label 是成对概念**: Label 是「标签」，Selector 是「按标签选人」。

## 典型 YAML / 命令示例

### Deployment + Service 中同时使用 Selector

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: model-serving
  labels:
    app: model-serving
    version: v2
spec:
  replicas: 3
  selector:
    matchLabels:
      app: model-serving
  template:
    metadata:
      labels:
        app: model-serving
        version: v2
    spec:
      containers:
      - name: inference
        image: registry.local/llm/inference:v2
---
apiVersion: v1
kind: Service
metadata:
  name: model-serving
spec:
  selector:
    app: model-serving
  ports:
  - port: 8080
    targetPort: 8080
```

### kubectl 使用 Label Selector

```bash
# 按等式筛选 Pod
kubectl get pods -l app=model-serving

# 按集合型筛选
kubectl get pods -l 'app in (model-serving, tokenizer)'

# 多条件组合
kubectl get pods -l app=model-serving,version=v2

# 反向筛选
kubectl get pods -l '!paused'
```

### Node Selector 示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-inference
spec:
  nodeSelector:
    accelerator: nvidia-a100
  containers:
  - name: inference
    image: registry.local/llm/inference:v2
    resources:
      limits:
        nvidia.com/gpu: "1"
```

## 常见场景

| 场景 | 使用对象 | 说明 |
|------|----------|------|
| **流量路由** | Service | `spec.selector` 匹配后端 Pod，决定哪些 Pod 接收请求。 |
| **副本控制** | Deployment / ReplicaSet / StatefulSet | `spec.selector` 匹配并管理相同 Label 的 Pod。 |
| **调度约束** | Pod | `nodeSelector` 限制 Pod 只能跑在带特定 Label 的 Node 上。 |
| **批量运维** | kubectl | `-l` 快速筛选出一批 Pod 做日志、删除、重启。 |
| **灰度发布** | Deployment | 利用 `version` Label 与不同 Selector 组合，实现金丝雀/蓝绿发布。 |

## 选型对比

| Selector 类型 | 语法 | 典型使用对象 | 注意点 |
|---------------|------|--------------|--------|
| **matchLabels** | 等式型 | Deployment、Service | 最常用，key-value 必须全部匹配。 |
| **matchExpressions** | 集合型 | Deployment、ReplicaSet | 支持 `In`、`NotIn`、`Exists`、`DoesNotExist`。 |
| **nodeSelector** | 等式型 | Pod | 简单硬约束，只能精确匹配 Node Label。 |
| **fieldSelector** | 字段过滤 | kubectl get / API | 按对象字段（如 `status.phase=Running`）过滤，不是 Label。 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 敏捷版 / 专用版中，Selector 是工单排查的高频切入点：ASCM 控制台展示的「服务后端 Pod」列表，底层由 Service 的 `spec.selector` 与 EndpointSlice 共同决定。当 ACK 集群出现「流量打到旧版本 Pod」或「某批 Pod 未被 Deployment 管理」时，往往是 Label 与 Selector 不匹配。专有云还会通过 Node Selector 配合 X-Dragon 神龙节点、GPU 机型 Label 把推理 Pod 绑定到对应算力资源池。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排基础
- [[_concepts/service|Service]] — 通过 Selector 暴露服务
- [[_concepts/deployment|Deployment]] — 通过 Selector 管理副本
- [[_concepts/replicaset|ReplicaSet]] — Selector 的直接使用者
- [[_concepts/pod|Pod]] — Label 与 Selector 的作用目标
