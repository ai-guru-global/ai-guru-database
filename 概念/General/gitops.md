---
title: "GitOps"
category: -concepts
tags: ["kubernetes", "k8s", "gitops", "devops", "cd", "cloud-native", "alibaba-cloud"]
summary: "GitOps 是一种以 Git 为唯一可信源的持续交付范式，通过声明式配置和自动同步实现基础设施与应用部署的版本化、可审计和可回滚。"
created: 2026-06-26
updated: 2026-06-26
tier: core
aliases:
  - "GitOps 方法论"
  - "Git 驱动交付"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/argocd"
    type: implemented_by
  - target: "概念/flux"
    type: implemented_by
sources: []
---

# GitOps

> **一句话理解**: GitOps 就是「Git 里有什么，集群里就应该有什么」，所有变更走 PR，所有回滚用 `git revert`。`

## 核心要点

- **声明式基础设施**: 用 YAML、Helm、Kustomize 描述期望状态。
- **Git 为唯一可信源**: 集群状态持续与 Git 仓库对齐。
- **自动同步**: ArgoCD/Flux 监听 Git 变更并自动应用。
- **版本化与可审计**: 每次部署都有 Git commit 记录，便于审计和回滚。
- **分离 CI 与 CD**: CI 负责构建产物，CD 负责把产物同步到集群。

## GitOps 工作流

```text
Developer → PR Merge → Git Repository → GitOps Controller → Kubernetes Cluster
                                          ↓
                                    Image Updater
```

## 选型对比

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| **ArgoCD** | UI 强大、应用集、多集群 | 需要可视化、企业级 |
| **Flux** | 原生 K8s、自动镜像更新 | 云原生、多租户 |

## 阿里云专有云关联

在阿里云专有云环境中，GitOps 通常对接内部 GitLab/Codeup，通过 ArgoCD 或 Flux 管理 ACK 集群应用。工单中「集群配置与 Git 不一致」时，检查 GitOps 控制器的同步状态、权限、以及到代码仓库的网络。

## Related

- [[概念/argocd|ArgoCD]]
- [[概念/flux|Flux]]
- [[概念/helm|Helm]]
- [[概念/kustomize|Kustomize]]
- [[概念/kubernetes|Kubernetes]]
