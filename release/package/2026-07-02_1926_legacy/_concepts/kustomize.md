---
title: "Kustomize（K8s 配置管理工具）"
category: -concepts
tags: [kustomize, kubernetes, configuration, helm, yaml, devops]
aliases:
  - "Kustomize"
  - "K8s 配置管理"
relationships:
  - target: "_concepts/helm"
    type: alternative
  - target: "_concepts/argocd"
    type: integrated_by
sources:
  - _concepts/helm.md
summary: "Kustomize 是 Kubernetes 原生的配置管理工具，通过叠加（overlay）方式管理多环境配置，无需模板渲染；与 Helm 是 K8s 配置管理的两大主流选择。"
lifecycle: stable
tier: supporting
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# Kustomize（K8s 配置管理工具）

## 核心要点

- **核心思想**：基于 base + overlay 叠加，无模板（pure YAML）
- **核心概念**：
  - **base**：所有环境共享的基础配置
  - **overlay**：环境特定（dev / staging / prod）覆盖
  - **patch**：局部合并策略（strategic merge / JSON patch）
  - **kustomization.yaml**：声明式描述
- **与 Helm 对比**：

| 维度 | Kustomize | Helm |
|------|-----------|------|
| 学习曲线 | 平缓 | 陡 |
| 模板能力 | 弱（无模板）| 强（Go template）|
| 多环境 | 叠加 | values.yaml |
| 包管理 | ❌ | ✅ Charts 仓库 |
| K8s 原生 | ✅（kubectl 内置）| ❌ |
| 适合 | 简单到中等复杂度 | 复杂、多组件 |

## 一句话解释

> Kustomize = "K8s YAML 版本的 Git rebase"；base 是主干，overlay 是 patch，多环境靠叠加而非模板。

## 工作示意

```
base/
├── kustomization.yaml    # 声明资源列表 + 通用配置
├── deployment.yaml        # 通用 Deployment
├── service.yaml           # 通用 Service
└── configmap.yaml

overlays/
├── dev/
│   ├── kustomization.yaml  # 引用 base + 1 replica + debug=true
│   └── patch.yaml
├── staging/
│   └── kustomization.yaml  # 引用 base + 3 replicas + canary
└── prod/
    ├── kustomization.yaml  # 引用 base + 10 replicas + HPA
    └── patch.yaml
```

## 典型 kustomization.yaml

```yaml
# overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: my-app-prod

resources:
- ../../base

namePrefix: prod-

replicas:
- name: api
  count: 10

images:
- name: my-api
  newTag: v2.5.0

patchesStrategicMerge:
- deployment-patch.yaml

configMapGenerator:
- name: app-config
  literals:
  - LOG_LEVEL=info
  - ENV=production
```

## 何时使用

✅ **推荐**：
- 已有大量原生 K8s YAML，需要管理多环境
- 不希望引入模板语言的复杂度
- Kustomize 是 kubectl 内置（无需额外工具）

⚠️ **不推荐**：
- 需要复杂条件分支（用 Helm）
- 需要打包分发（用 Helm）
- 团队不熟悉 K8s 原生模型

## 与 ArgoCD 配合

ArgoCD 原生支持 Kustomize：
- 直接指向 `overlays/prod/` 目录
- 自动检测变更并同步
- 天然适配 GitOps 工作流

## Related

- [[_concepts/helm]] — Helm（K8s 包管理）
- [[_concepts/argocd]] — ArgoCD（GitOps）
- [[_concepts/ci-cd]] — CI/CD 流水线
- [[架构基建/AI_Stack_Container_Runtime_Guide]] — K8s 实践