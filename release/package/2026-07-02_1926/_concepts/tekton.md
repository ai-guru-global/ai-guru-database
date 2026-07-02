---
title: "Tekton"
category: -concepts
tags: ["kubernetes", "k8s", "cicd", "devops", "cloud-native", "alibaba-cloud"]
summary: "Tekton 是 CNCF 孵化的 K8s 原生 CI/CD 框架，所有流水线资源都是 CRD，可在任意 K8s 集群上运行构建、测试、部署任务。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Tekton Pipelines"
  - "K8s 原生 CI/CD"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/argocd"
    type: related_to
  - target: "_concepts/gitops"
    type: related_to
sources: []
---

# Tekton

> **一句话理解**: Tekton 是把 CI/CD 流水线也做成 K8s 资源的框架，任务在 Pod 里跑，天然具备弹性、隔离和可观测性。

## 核心要点

- **CRD 驱动**: Task、TaskRun、Pipeline、PipelineRun 都是 K8s 资源。
- **Pod 级执行**: 每个 Step 是一个容器，Task 是一个 Pod，天然隔离。
- **Workspace**: 用于在 Task 之间共享数据，支持 PVC、ConfigMap、Secret、EmptyDir。
- **Result 与 Parameter**: 支持参数传递和结果输出。
- **丰富的 Catalog**: Tekton Hub 提供大量可复用 Task。

## 核心 CRD

| CRD | 作用 |
|-----|------|
| `Task` | 可复用的最小执行单元 |
| `TaskRun` | Task 的一次执行实例 |
| `Pipeline` | 多个 Task 组成的流水线 |
| `PipelineRun` | Pipeline 的一次执行实例 |
| `Trigger` | 基于 Webhook 触发流水线 |

## 阿里云专有云关联

在阿里云专有云环境中，Tekton 可部署在 ACK 敏捷版/专有版集群内，作为私有化 CI 引擎替代 Jenkins。工单中「构建任务失败」时，检查 TaskRun Pod 日志、Workspace PVC 绑定、以及镜像仓库访问权限。

## Related

- [[_concepts/argocd|ArgoCD]] — GitOps 交付
- [[_concepts/flux|Flux]] — GitOps 交付
- [[_concepts/gitops|GitOps]] — GitOps 方法论
- [[_concepts/kubernetes|Kubernetes]] — 容器编排
