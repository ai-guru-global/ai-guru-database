---
title: "Kustomize（K8s 配置管理工具）"
category: -concepts
tags: [kustomize, kubernetes, configuration, helm, yaml, devops]
aliases:
  - "Kustomize"
  - "K8s 配置管理"
relationships:
  - target: "概念/helm"
    type: alternative
  - target: "概念/argocd"
    type: integrated_by
sources:
  - 概念/helm.md
summary: "Kustomize 是 Kubernetes 原生的配置管理工具，通过叠加（overlay）方式管理多环境配置，无需模板渲染；与 Helm 是 K8s 配置管理的两大主流选择。"
lifecycle: reviewed
tier: supporting
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-07-21
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

- [[概念/helm]] — Helm（K8s 包管理）
- [[概念/argocd]] — ArgoCD（GitOps）
- [[概念/ci-cd]] — CI/CD 流水线
- [[12_架构基建/AI_Stack_Container_Runtime_Guide]] — K8s 实践

---

## 2026 Kustomize 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **kubectl kustomize** | kubectl 内置 Kustomize 渲染，无需额外安装 | GA |
| **多环境 Overlay** | base + overlays 模式管理 dev/staging/prod | GA |
| **Helm 互操作** | Kustomize 渲染 Helm 输出实现二次定制 | GA |
| **AI 推理服务配置** | GPU 资源、模型路径、扩缩策略环境差异化 | GA |
| **FluxCD 集成** | GitOps 流水线原生支持 Kustomize | GA |

## 生产最佳实践

1. **Base 精简**：base 只包含通用配置，环境差异全部放 overlay
2. **命名规范**：namePrefix/nameSuffix 统一资源命名，避免跨环境冲突
3. **Secret 管理**：不在 Kustomize 中明文存储 Secret，结合 SOPS/Vault
4. **CI 验证**：流水线中执行 `kubectl kustomize` 验证渲染结果合法性
5. **避免过度嵌套**：overlay 层级不超过 3 层，保持可理解性

## Kustomize 目录结构示例

```yaml
# base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployment.yaml
  - service.yaml
  - hpa.yaml
commonLabels:
  app.kubernetes.io/managed-by: kustomize

---
# overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../base
namePrefix: prod-
patches:
  - path: gpu-patch.yaml
    target:
      kind: Deployment
      name: inference-server
replicas:
  - name: inference-server
    count: 4

---
# overlays/prod/gpu-patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inference-server
spec:
  template:
    spec:
      containers:
        - name: vllm
          resources:
            limits:
              nvidia.com/gpu: "2"
            requests:
              nvidia.com/gpu: "2"
              memory: 32Gi
```

## Kustomize vs Helm vs jsonnet 对比

| 维度 | Kustomize | Helm | jsonnet |
|------|-----------|------|----------|
| 语言 | YAML | Go 模板 | jsonnet |
| 学习曲线 | 低 | 中 | 高 |
| 内置 kubectl | 是 | 否 | 否 |
| 模板能力 | 无（补丁） | 强 | 极强 |
| GitOps 集成 | ArgoCD/Flux | ArgoCD/Flux | 需额外工具 |
| 适用场景 | 环境差异化 | 应用分发 | 复杂配置生成 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 渲染结果错误 | overlay 补丁路径错误 | 使用 kubectl kustomize 验证 |
| 环境配置泄漏 | base 中硬编码环境值 | 环境差异全部放 overlay |
| Secret 明文 | 直接写在 YAML 中 | 结合 SOPS/Vault 加密 |
| 嵌套过深 | overlay 层级过多 | 控制在 3 层以内 |

## 生产检查清单

1. ✅ base 只包含通用配置，环境差异放 overlay
2. ✅ CI 中执行 kubectl kustomize 验证渲染结果
3. ✅ Secret 结合 SOPS/Vault 加密管理
4. ✅ overlay 层级不超过 3 层
5. ✅ namePrefix/nameSuffix 统一资源命名
6. ✅ 与 ArgoCD/FluxCD GitOps 集成

## 总结

Kustomize 是 Kubernetes 原生配置管理工具，通过 base + overlay 模式实现多环境配置差异化。其无模板、纯 YAML 的特性使其学习曲线极低，是 GitOps 工作流中环境配置管理的首选方案。

> 💡 Kustomize 的核心哲学是“无模板的声明式定制”——用补丁而非模板来管理差异，保持配置的可读性和可审计性。