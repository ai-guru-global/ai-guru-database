---
title: "Argo Rollouts"
category: -concepts
tags: ["kubernetes", "k8s", "deployment", "progressive-delivery", "canary", "cloud-native", "alibaba-cloud"]
summary: "Argo Rollouts 是 Kubernetes 的渐进式交付控制器，提供金丝雀、蓝绿、A/B 测试等高级发布策略，替代原生 Deployment 的滚动更新。"
created: 2026-06-26
updated: 2026-07-21
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

---

## 2026 Argo Rollouts 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Argo Rollouts** | K8s 渐进式交付控制器 | GA |
| **金丝雀发布** | 逐步增加流量比例 | GA |
| **蓝绿部署** | 双环境切换 | GA |
| **实验分析** | A/B 测试集成 | GA |
| **Istio 集成** | 服务网格流量控制 | GA |

## 生产最佳实践

1. **金丝雀发布**：生产环境用金丝雀发布降低风险
2. **自动回滚**：配置自动回滚策略，失败时快速恢复
3. **指标分析**：用 Prometheus 指标自动分析发布健康
4. **与 ArgoCD 配合**：ArgoCD + Argo Rollouts 实现 GitOps 渐进式交付
5. **流量控制**：用 Istio 精确控制流量比例

## 2026 Argo Rollouts 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Argo Rollouts 1.7+** | 支持多容器、Header 路由 | GA |
| **Istio 集成** | 精确流量控制 | GA |
| **NGINX 集成** | Ingress 流量分割 | GA |
| **Prometheus 分析** | 自动指标分析 | GA |
| **ArgoCD 集成** | GitOps 渐进式交付 | GA |

## 架构：渐进式发布流程

```
ArgoCD Sync → Rollout CR → 创建新 ReplicaSet
                    ↓
        逐步调整流量 (5% → 25% → 50% → 100%)
                    ↓
        AnalysisRun 检查指标 → 通过 → 完成
                    ↓ 失败
                自动回滚
```

## 配置示例：金丝雀发布

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: ml-service
spec:
  replicas: 5
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - analysis:
            templates:
              - templateName: success-rate
        - setWeight: 50
        - pause: { duration: 10m }
        - setWeight: 100
      canaryService: ml-service-canary
      stableService: ml-service-stable
  selector:
    matchLabels:
      app: ml-service
  template:
    metadata:
      labels:
        app: ml-service
    spec:
      containers:
        - name: ml-service
          image: my-registry/ml-service:v2
---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
spec:
  metrics:
    - name: success-rate
      interval: 5m
      successCondition: result[0] >= 0.95
      provider:
        prometheus:
          address: http://prometheus:9090
          query: |
            sum(rate(http_requests_total{status=~"2.."}[5m]))
            / sum(rate(http_requests_total[5m]))
```

## 发布策略对比

| 策略 | 说明 | 适用场景 |
|------|------|------|
| **金丝雀** | 逐步增加流量 | 通用 |
| **蓝绿** | 一次性切换 | 快速发布 |
| **实验** | A/B 测试 | 功能验证 |

## 延伸阅读

- [[概念/MLOps/argocd|ArgoCD]] — GitOps 持续交付
- [[概念/MLOps/prometheus|Prometheus]] — 指标监控
- [[概念/MLOps/ci-cd|CI/CD]] — 持续集成/交付

> ℹ️ Argo Rollouts 是 K8s 渐进式发布控制器，支持金丝雀、蓝绿、实验等发布策略。

## 生产最佳实践

1. **指标分析**：用 Prometheus 指标自动分析发布健康
2. **自动回滚**：指标异常时自动回滚
3. **渐进式流量**：逐步增加流量比例
4. **与 ArgoCD 配合**：GitOps 渐进式交付
5. **Header 路由**：用 Header 路由进行内部测试
6. **多环境支持**：开发/测试/生产环境分离
7. **告警配置**：发布异常时告警
8. **审计日志**：记录发布历史

## 检查清单

- [ ] Rollout 配置已定义
- [ ] AnalysisTemplate 已配置
- [ ] 自动回滚已启用
- [ ] 指标分析已配置
- [ ] 告警机制已配置

## 工具对比

| 工具 | 适用场景 | 特点 |
|------|------|------|
| **Argo Rollouts** | K8s 渐进式发布 | 功能强大 |
| **Flagger** | K8s 金丝雀 | 轻量 |
| **Istio** | 流量管理 | 服务网格 |

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 回滚失败 | 检查指标配置 |
| 流量不均 | 检查 Service 配置 |
| 分析失败 | 检查 Prometheus 连接 |
| 发布卡住 | 检查 pause 配置 |
