---
title: "GitOps"
category: -concepts
tags: ["kubernetes", "k8s", "gitops", "devops", "cd", "cloud-native", "alibaba-cloud"]
summary: "GitOps 是一种以 Git 为唯一可信源的持续交付范式，通过声明式配置和自动同步实现基础设施与应用部署的版本化、可审计和可回滚。"
created: 2026-06-26
updated: 2026-07-21
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

---

## 2026 GitOps 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **ArgoCD** | GitOps 持续交付 | GA |
| **Flux** | GitOps 工具集 | GA |
| **Helm** | K8s 包管理 | GA |
| **Kustomize** | K8s 配置管理 | GA |
| **GitOps 即代码** | 基础设施即代码 | GA |

## 生产最佳实践

1. **GitOps 必用**：K8s 部署必须用 GitOps
2. **ArgoCD 首选**：GitOps 工具首选 ArgoCD
3. **Git 单一来源**：Git 作为配置单一来源
4. **自动同步**：配置自动同步部署
5. **与 CI/CD 配合**：GitOps + CI/CD 流水线

## ArgoCD 配置示例

```yaml
# ArgoCD Application 示例
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ai-inference
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://gitlab.com/ai-platform/k8s-configs.git
    targetRevision: main
    path: apps/inference
  destination:
    server: https://kubernetes.default.svc
    namespace: ai-inference
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

## GitOps 成熟度模型

| 级别 | 说明 | 特征 |
|------|------|------|
| L1 手动 | 手动 kubectl apply | 无版本控制 |
| L2 CI 推送 | CI 流水线推送配置 | 有版本控制 |
| L3 GitOps Pull | GitOps 控制器拉取同步 | 自动同步 |
| L4 全自动化 | 镜像自动更新 + 自动回滚 | 无人值守 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 同步失败 | 权限不足/网络问题 | 检查 RBAC 和网络 |
| 配置漂移 | 手动修改集群 | 启用 selfHeal |
| 回滚失败 | Git 历史不清晰 | 规范 commit 消息 |
| 多环境管理 | 配置分散 | Kustomize/Helm 分层 |

## 相关概念

- [[概念/argocd|ArgoCD]] — GitOps 控制器
- [[概念/flux|Flux]] — GitOps 工具集
- [[概念/helm|Helm]] — K8s 包管理
- [[概念/platform-engineering|Platform Engineering]] — 平台工程

> 💡 GitOps 的核心价值是“可审计、可回滚、可复制”——所有变更都有 Git 记录，任何时候都可以回到上一个已知良好状态。

## 版本兼容性

| 工具 | 版本 | K8s | 状态 |
|------|------|------|------|
| ArgoCD | 2.10+ | 1.24+ | GA |
| Flux | 2.2+ | 1.24+ | GA |
| Helm | 3.14+ | 1.24+ | GA |
| Kustomize | 5.3+ | 1.24+ | GA |

## 生产检查清单

1. 配置 Git 仓库作为唯一可信源
2. 启用自动同步和 selfHeal
3. 配置 RBAC 权限最小化
4. 建立分支策略和 PR 审批流程
5. 配置同步失败告警
6. 建立多环境配置管理
7. 配置镜像自动更新策略
8. 定期审计 Git 提交历史

## 总结

GitOps 是以 Git 为唯一可信源的持续交付范式，通过声明式配置和自动同步实现基础设施与应用部署的版本化、可审计和可回滚。ArgoCD 和 Flux 是两大主流实现。

> 💡 GitOps 的终极目标是“没有人手动触碰生产集群”——所有变更都通过 Git PR 流程，所有回滚都是 git revert。

## 常用命令

| 命令 | 说明 |
|------|------|
| `argocd app sync <app>` | 手动同步应用 |
| `argocd app get <app>` | 查看应用状态 |
| `argocd app history <app>` | 查看部署历史 |
| `argocd app rollback <app> <id>` | 回滚应用 |
| `flux reconcile source git <name>` | 手动同步 Git 源 |
| `flux get kustomizations` | 查看 Kustomization 状态 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| ArgoCD 官方文档 | 文档 | GitOps 控制器 |
| Flux 官方文档 | 文档 | GitOps 工具集 |
| OpenGitOps | 规范 | GitOps 原则 |
| Weaveworks 博客 | 博客 | GitOps 最佳实践 |

## GitOps vs 传统 CI/CD

| 维度 | GitOps | 传统 CI/CD |
|------|------|------|
| 部署方式 | Pull（控制器拉取） | Push（流水线推送） |
| 可信源 | Git 仓库 | 流水线产物 |
| 回滚 | git revert | 重新部署旧版本 |
| 审计 | Git 历史 | 流水线日志 |
| 漂移检测 | 自动检测并修复 | 无 |
| 安全性 | 无需集群凭证 | 需要集群凭证 |

## 总结

GitOps 是以 Git 为唯一可信源的持续交付范式，通过声明式配置和自动同步实现基础设施与应用部署的版本化、可审计和可回滚。ArgoCD 和 Flux 是两大主流实现。

> 💡 GitOps 的核心价值是“可审计、可回滚、可复制”——所有变更都有 Git 记录，任何时候都可以回到上一个已知良好状态。

## 相关概念

- [[概念/argocd|ArgoCD]] — GitOps 控制器
- [[概念/flux|Flux]] — GitOps 工具集
- [[概念/helm|Helm]] — K8s 包管理
- [[概念/platform-engineering|Platform Engineering]] — 平台工程
