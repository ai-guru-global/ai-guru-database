---
title: "Flux"
category: -concepts
tags: ["kubernetes", "k8s", "gitops", "cd", "cloud-native", "alibaba-cloud"]
summary: "Flux 是 CNCF 孵化的 GitOps 持续交付工具，原生支持 Git 仓库监听、自动同步、镜像自动更新和渐进式交付。"
created: 2026-06-26
updated: 2026-06-26
tier: archived
aliases:
  - "Flux CD"
  - "Flux GitOps"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/argocd"
    type: related_to
  - target: "概念/gitops"
    type: related_to
sources: []
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Flux

> **一句话理解**: Flux 是 K8s 原生的 GitOps 引擎，能自动把 Git 仓库里的 YAML/Helm/Kustomize 同步到集群，还能自动更新镜像版本。

## 核心要点

- **Git 作为唯一可信源**: 集群状态持续与 Git 保持一致。
- **多源支持**: GitRepository、HelmRepository、Bucket、OCIRepository。
- **自动镜像更新**: ImagePolicy + ImageUpdateAutomation 自动升级镜像 tag。
- **渐进式交付**: 通过 Flagger 集成实现金丝雀、A/B 测试、蓝绿发布。
- **多租户安全**: 支持 RBAC 隔离、Source 与 Kustomization 分离权限。

## 核心 CRD

| CRD | 作用 |
|-----|------|
| `GitRepository` | 定义 Git 源 |
| `Kustomization` | 同步 Kustomize 或原生 YAML |
| `HelmRelease` | 部署 Helm Chart |
| `HelmRepository` | 定义 Helm 仓库 |
| `ImageRepository` | 扫描镜像仓库 tag |
| `ImagePolicy` | 定义镜像更新策略 |

## 阿里云专有云关联

在阿里云专有云环境中，Flux 适合对接内部 GitLab/Codeup 仓库，实现 ACK 集群的声明式持续交付。工单中「Git 同步失败」时，检查 Source 状态、`Kustomization` 的 `Ready` 条件、以及到代码仓库的网络连通性。

## Related

- [[概念/argocd|ArgoCD]] — 另一主流 GitOps 工具
- [[概念/gitops|GitOps]] — GitOps 方法论
- [[概念/helm|Helm]] — 包管理
- [[概念/kustomize|Kustomize]] — 配置覆盖
- [[概念/kubernetes|Kubernetes]] — 容器编排
