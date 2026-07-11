---
title: "Karmada"
category: -concepts
tags: ["kubernetes", "k8s", "multi-cluster", "federation", "cloud-native", "alibaba-cloud"]
summary: "Karmada 是华为云捐赠给 CNCF 的多集群容器编排平台，原生兼容 Kubernetes API，支持跨多个 K8s 集群的应用分发、故障迁移和资源调度。"
created: 2026-06-26
updated: 2026-06-26
tier: archived
aliases:
  - "Karmada 多集群"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/k3s"
    type: related_to
sources: []
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Karmada

> **一句话理解**: Karmada 是 K8s 的「多集群放大器」，让你用熟悉的 Deployment/Service 语法把应用同时分发到多个集群，并自动处理容灾和调度。

## 核心要点

- **K8s 原生 API 兼容**: 使用 PropagationPolicy、OverridePolicy 等 CRD 扩展多集群能力。
- **多集群资源模板**: `Work` 对象描述要在成员集群部署的资源。
- **调度策略**: 支持按权重、拓扑、污点、资源余量分发。
- **故障迁移**: 成员集群故障时自动将应用漂移到健康集群。
- **可对接任意 K8s 集群**: 不限云厂商，支持自建、ACK、EKS、GKE 等。

## 核心 CRD

| CRD | 作用 |
|-----|------|
| `PropagationPolicy` | 定义资源分发策略 |
| `OverridePolicy` | 按集群覆盖资源字段 |
| `ResourceBinding` | 绑定 Work 与目标集群 |
| `Work` | 在成员集群执行的实际资源 |

## 阿里云专有云关联

在阿里云专有云环境中，Karmada 可用于跨地域、跨可用区的 ACK 多集群统一编排，实现同城双活或异地灾备。工单中「多集群应用状态不一致」时，检查 PropagationPolicy、成员集群 kubeconfig、以及 etcd 网络连通性。

## Related

- [[概念/kubernetes|Kubernetes]] — 单集群编排
- [[概念/k3s|K3s]] — 轻量 K8s
