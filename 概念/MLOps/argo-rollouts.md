---
title: "Argo Rollouts"
category: -concepts
tags: ["kubernetes", "k8s", "deployment", "progressive-delivery", "canary", "cloud-native", "alibaba-cloud"]
summary: "Argo Rollouts 是 Kubernetes 的渐进式交付控制器，提供金丝雀、蓝绿、A/B 测试等高级发布策略，替代原生 Deployment 的滚动更新。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "ArgoRollouts"
  - "渐进式交付"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/deployment"
    type: related_to
  - target: "概念/argocd"
    type: related_to
sources: []
---

# Argo Rollouts

> **一句话理解**: Argo Rollouts 让 K8s 发布从「直接全量替换」升级为「先给小流量验证，再逐步放大」，降低变更风险。

## 核心要点

- **高级发布策略**: 金丝雀（Canary）、蓝绿（Blue/Green）、A/B 测试、实验（Experiment）。
- **自动回滚**: 基于 Prometheus 指标、成功/失败率自动中止或回滚。
- **流量管理**: 集成 Ingress Controller、Istio、SMI、ALB/NLB 进行流量拆分。
- **替代 Deployment**: 使用 `Rollout` CRD 替代原生 `Deployment`。
- **分析引擎**: AnalysisRun 支持自定义指标判断发布健康度。

## 金丝雀发布示例

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: app
spec:
  replicas: 10
  strategy:
    canary:
      steps:
        - setWeight: 20
        - pause: {duration: 10m}
        - setWeight: 50
        - pause: {duration: 10m}
        - setWeight: 100
      analysis:
        templates:
          - templateName: success-rate
```

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，Argo Rollouts 可结合 Nginx Ingress 或 Istio 实现生产发布流量控制。工单中「发布回滚」或「金丝雀流量异常」时，检查 Rollout 状态、`AnalysisRun` 指标、以及 Ingress/Service 权重配置。

## Related

- [[概念/deployment|Deployment]] — 原生滚动更新
- [[概念/istio|Istio]] — 服务网格流量管理
- [[概念/argocd|ArgoCD]] — GitOps 交付
- [[概念/prometheus|Prometheus]] — 发布指标
- [[概念/kubernetes|Kubernetes]] — 容器编排
