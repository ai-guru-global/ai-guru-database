---
title: "Helm"
category: -concepts
tags: ["helm", "kubernetes", "package-manager", "chart", "templating", "cncf", "deployment"]
relationships:
  - target: "概念/kubernetes"
    type: used_by
  - target: "概念/kustomize"
    type: related_to
  - target: "概念/argocd"
    type: related_to
sources:
  - 架构基建/Architecture_Overview/AI_Infrastructure_2026
summary: "Helm 是 CNCF Graduated 的 Kubernetes 包管理器，通过 Chart 模板化部署复杂应用，广泛应用于 AI 中间件（HAMi、KServe、Prometheus、Kubeflow）的一键安装与版本管理。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Helm

---
# Helm

> Kubernetes 的「应用商店」——用 Chart 把复杂 K8s 应用打包成一键安装包。

---

## 1. 一句话定义

**Helm** 是 CNCF Graduated 的 Kubernetes 包管理器，通过 **Chart**（模板化 YAML 包）简化复杂应用的安装、升级、回滚和版本管理。它是部署 HAMi、KServe、Prometheus、Kubeflow 等 AI 中间件的事实标准工具。

---

## 2. 核心概念

| 概念 | 说明 |
|------|------|
| **Chart** | 应用的模板化包 |
| **Release** | Chart 的一个运行实例 |
| **Values** | 用户自定义配置 |
| **Template** | Go template 渲染 K8s 资源 |
| **Repository** | Chart 仓库 |
| **Hook** | 生命周期钩子（pre-install、post-upgrade） |

---

## 3. 典型用法

```bash
# 添加仓库
helm repo add hami-charts https://project-hami.github.io/HAMi/
helm repo update

# 安装
helm install hami hami-charts/hami -n kube-system

# 升级
helm upgrade hami hami-charts/hami -n kube-system

# 回滚
helm rollback hami -n kube-system
```

---

## 4. AI 场景常用 Chart

| 应用 | Chart |
|------|-------|
| HAMi | `hami-charts/hami` |
| KServe | `kserve/kserve` |
| Prometheus/Grafana | `kube-prometheus-stack` |
| Kubeflow | `kubeflow/manifests` |
| Ray / KubeRay | `kuberay/kuberay-operator` |

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | Helm 部署目标 |
| **Kustomize** | K8s 原生配置管理，常与 Helm 互补 |
| **ArgoCD** | GitOps 部署工具，可管理 Helm Release |
| **Terraform** | 可调用 Helm provider 部署应用 |

---

## Related

- [[概念/kubernetes]] — Kubernetes
- [[概念/kustomize]] — Kustomize
- [[概念/argocd]] — ArgoCD
- [[概念/flux]] — Flux GitOps
- [[架构基建/Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026

---

## 2026 Helm 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 毕业** | 成熟稳定 | GA |
| **Helm 3** | 无 Tiller、更安全 | GA |
| **OCI Registry** | Chart 存储于 OCI 仓库 | GA |
| **Helmfile** | 声明式 Release 管理 | 社区 |

## 生产最佳实践

1. **版本管理**：Chart 版本化，支持回滚
2. **Values 分离**：环境差异用 values 文件覆盖
3. **与 ArgoCD 配合**：GitOps 管理 Helm Release
4. **Chart 测试**：使用 helm unittest 测试模板
