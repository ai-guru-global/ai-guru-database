---
title: "Flux"
category: -concepts
tags: ["kubernetes", "k8s", "gitops", "cd", "cloud-native", "alibaba-cloud"]
summary: "Flux 是 CNCF 孵化的 GitOps 持续交付工具，原生支持 Git 仓库监听、自动同步、镜像自动更新和渐进式交付。"
created: 2026-06-26
updated: 2026-07-21
tier: archived
lifecycle: reviewed
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
name_zh: "Flux GitOps 工具"
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Flux

> 中文简称：Flux GitOps 工具

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

---

## 2026 Flux 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 毕业** | 成熟稳定 | GA |
| **多源支持** | Git/Helm/OCI/Bucket | GA |
| **镜像自动更新** | ImagePolicy | GA |

## 架构组件

| 组件 | 职责 |
|------|------|
| **source-controller** | 管理 Git/Helm/OCI 源 |
| **kustomize-controller** | 同步 Kustomize/YAML |
| **helm-controller** | 管理 HelmRelease |
| **image-reflector-controller** | 扫描镜像 tag |
| **image-automation-controller** | 自动更新镜像版本 |
| **notification-controller** | 事件通知和告警 |

## 配置示例

```yaml
# GitRepository 源
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: ai-platform
  namespace: flux-system
spec:
  interval: 5m
  url: ssh://git@gitlab.example.com/ai/platform.git
  ref:
    branch: main
  secretRef:
    name: git-ssh-key
---
# Kustomization 同步
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: inference-apps
  namespace: flux-system
spec:
  interval: 10m
  path: ./deploy/inference
  prune: true
  sourceRef:
    kind: GitRepository
    name: ai-platform
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: inference-server
      namespace: ai-inference
---
# 镜像自动更新
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: inference-policy
spec:
  imageRepositoryRef:
    name: inference-repo
  policy:
    semver:
      range: '>=1.0.0'
```

## Flux vs ArgoCD

| 维度 | Flux | ArgoCD |
|------|------|--------|
| 架构 | 多控制器 | 单体 |
| UI | 无（第三方） | 内置丰富 UI |
| 多租户 | 原生支持 | 需配置 |
| 镜像更新 | 原生 | 需插件 |
| Helm 支持 | 原生 | 原生 |
| 学习曲线 | 中等 | 中等 |
| CNCF 状态 | 毕业 | 毕业 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Git 同步失败 | SSH Key/网络问题 | 检查 Secret 和网络连通 |
| Kustomization 不就绪 | YAML 错误 | `flux logs --kind=Kustomization` |
| 镜像未更新 | ImagePolicy 不匹配 | 检查 semver 范围 |
| Helm 部署失败 | Chart 版本错误 | 检查 HelmRepository 状态 |

## 生产最佳实践

1. **Git 安全**：使用 SSH 或 Token 认证，保护仓库访问
2. **同步监控**：关注 Kustomization Ready 状态
3. **渐进式交付**：配合 Flagger 实现金丝雀发布
4. **与 ArgoCD 对比**：Flux 更轻量，ArgoCD UI 更丰富
5. **健康检查**：配置 healthChecks 确保部署真正就绪

## 常用命令

```bash
# 安装 Flux
flux install

# 创建 Git 源
flux create source git ai-platform \
  --url=ssh://git@gitlab.example.com/ai/platform.git \
  --branch=main \
  --export

# 创建 Kustomization
flux create kustomization inference-apps \
  --source=GitRepository/ai-platform \
  --path=./deploy/inference \
  --prune=true \
  --interval=10m \
  --export

# 查看同步状态
flux get kustomizations

# 查看日志
flux logs --kind=Kustomization --name=inference-apps

# 手动触发同步
flux reconcile kustomization inference-apps

# 暂停/恢复同步
flux suspend kustomization inference-apps
flux resume kustomization inference-apps
```

## 目录结构示例

```
ai-platform/
├── deploy/
│   ├── inference/
│   │   ├── kustomization.yaml
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── training/
│       ├── kustomization.yaml
│       └── job.yaml
├── clusters/
│   ├── prod/
│   │   └── flux-system/
│   └── staging/
│       └── flux-system/
└── infrastructure/
    └── sources/
        └── git-repo.yaml
```

> 💡 Flux 是 K8s 原生 GitOps 引擎，适合追求声明式、自动化持续交付的 AI 平台团队。
