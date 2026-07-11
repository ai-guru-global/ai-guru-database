---
title: "ArgoCD（GitOps 持续部署工具）"
category: -concepts
tags: [argocd, gitops, kubernetes, cd, continuous-deployment, devops]
aliases:
  - "ArgoCD"
  - "Argo CD"
  - "GitOps"
relationships:
  - target: "概念/helm"
    type: integrated_with
  - target: "概念/kustomize"
    type: integrated_with
  - target: "概念/ci-cd"
    type: belongs_to
sources:
  - 概念/helm.md
summary: "ArgoCD 是 CNCF 毕业项目，Kubernetes 原生的 GitOps 持续部署工具；通过监听 Git 仓库变化自动同步到 K8s 集群，是声明式、版本化、可审计部署的事实标准。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.90
created: 2026-06-24
updated: 2026-06-24
---

# ArgoCD（GitOps 持续部署工具）

## 核心要点

- **核心思想**：Git 仓库是"唯一真相源"，K8s 集群状态必须与 Git 一致。
- **核心能力**：
  - 自动同步：Git 变更 → 自动应用到 K8s
  - 手动同步：PR 审核后再同步
  - 漂移检测：发现 K8s 状态偏离 Git 时告警
  - 回滚：一键回到任意历史版本
  - 多集群：ApplicationSet 管理上百集群
- **支持格式**：Kustomize / Helm / 原生 YAML / Jsonnet

## 一句话解释

> ArgoCD = "Git 仓库驱动 K8s 部署"；改完 YAML 推 Git，集群自动跟随；想回滚？git revert 即可。

## 工作流程

```
Git 仓库（声明式配置）
        ↓
ArgoCD 持续监听（Pull 模型）
        ↓
检测到变更 → 自动 / 手动同步
        ↓
应用到 K8s 集群
        ↓
健康检查（Helm hook / Health Check）
        ↓
失败回滚 / 告警
```

## 核心概念

```
Application（应用）
  └── 指向一个 Git 仓库 + path + cluster

AppProject（项目）
  └── 多个 Application 的逻辑分组 + RBAC

ApplicationSet（一组应用）
  └── 通过模板批量生成 Application（多集群 / 多环境）

Sync Policy（同步策略）
  ├── 自动（Auto）：检测到变更立即同步
  └── 手动（Manual）：需要人工点击 Sync

Self Heal（自愈）
  └── 检测到 K8s 状态偏离 Git 时自动恢复
```

## Application 示例

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/k8s-config
    targetRevision: main
    path: overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: my-app-prod
  syncPolicy:
    automated:
      prune: true          # 删除 Git 中移除的资源
      selfHeal: true       # 自愈漂移
    syncOptions:
      - CreateNamespace=true
```

## 何时使用

✅ **推荐**：
- K8s 多环境管理（dev / staging / prod）
- 多集群部署（边缘 / 多云）
- 团队需要审计追溯（金融 / 政府）
- 频繁部署（每天多次发布）

⚠️ **不推荐**：
- 非 K8s 工作负载
- 团队不熟悉 Git 工作流
- 需要复杂条件分支（应用 ArgoCD Events + Argo Workflows）

## 与传统 CI/CD 对比

| 维度 | 传统 CI/CD | ArgoCD (GitOps) |
|------|-----------|-----------------|
| 触发方式 | Push（CI 完成推送）| Pull（ArgoCD 主动拉）|
| 集群访问 | CI 需集群凭证 | ArgoCD 在集群内，无需外部凭证 |
| 审计 | 依赖 CI 日志 | Git 完整审计 |
| 回滚 | 重新部署 | git revert |
| 多集群 | 需要额外配置 | ApplicationSet 天然支持 |

## Related

- [[概念/kustomize]] — Kustomize（ArgoCD 原生支持）
- [[概念/helm]] — Helm（ArgoCD 也支持）
- [[概念/ci-cd]] — CI/CD 流水线
- [[概念/policy-as-code]] — Policy as Code