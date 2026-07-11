---
title: "Horizontal Pod Autoscaler（HPA）"
category: -concepts
tags: ["kubernetes", "k8s", "autoscaling", "cloud-native", "alibaba-cloud"]
summary: "HPA 是 Kubernetes 内置的 Pod 水平自动扩缩容控制器，根据 CPU、内存或自定义指标自动调整 Deployment/StatefulSet 的副本数，是云原生应用弹性能力的核心组件。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "HPA"
  - "Horizontal Pod Autoscaler"
  - "水平 Pod 自动扩缩容"
relationships:
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/kubectl"
    type: related_to
  - target: "概念/prometheus"
    type: related_to
sources: []
---

# Horizontal Pod Autoscaler（HPA）

> **一句话理解**: HPA 是 K8s 的「自动加减副本」机制——负载高了扩 Pod，负载低了缩 Pod，让应用容量随流量弹性变化。

## 核心要点

- **作用对象**: HPA 只能扩缩 **Deployment、StatefulSet、ReplicaSet** 这类带 `scale` 子资源的控制器，不能直接扩缩单个 Pod。
- **决策指标**: 默认支持 CPU 利用率、内存利用率；启用 Metrics Server 和 Prometheus Adapter 后，可基于自定义指标（如 QPS、队列长度、GPU 利用率）扩缩。
- **控制循环**: `kube-controller-manager` 中的 HPA Controller 定期（默认 15s）拉取指标，计算期望副本数，调用 `scale` 子资源调整副本。
- **扩缩算法**: `desiredReplicas = ceil[currentReplicas × (currentMetricValue / targetMetricValue)]`，实际生效还受 `minReplicas`、`maxReplicas` 和稳定窗口限制。
- **冷却机制**: K8s 1.18+ 支持 `behavior` 字段，可分别配置扩容/缩容的 `stabilizationWindowSeconds` 和变化速率限制，避免抖动。
- **前提条件**: 使用资源指标时必须给 Pod 设置 `resources.requests`；否则 HPA 无法计算利用率百分比。

## 典型 YAML / 命令示例

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-inference-hpa
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: llm-serving
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
```

```bash
# 查看 HPA 状态
kubectl get hpa ai-inference-hpa

# 实时观察副本数变化
kubectl get hpa ai-inference-hpa -w

# 查看 HPA 事件与限制原因
kubectl describe hpa ai-inference-hpa

# 临时手动缩容到 3 副本（调 scaleTargetRef 指向的 Deployment 即可）
kubectl scale deploy llm-serving --replicas=3
```

## 选型对比

| 维度 | HPA | 手动 `kubectl scale` | Cluster Autoscaler（CA） |
|------|-----|---------------------|--------------------------|
| **扩缩对象** | Pod 副本数 | Pod 副本数 | 工作节点数量 |
| **触发条件** | CPU / 内存 / 自定义指标 | 人工命令 | 集群资源不足/空闲 |
| **响应速度** | 秒级到分钟级 | 即时 | 分钟级 |
| **适用场景** | 流量波动、Web/API/推理服务 | 一次性变更、维护窗口 | 资源池整体弹性 |
| **与 HPA 关系** | — | 可临时覆盖 HPA | HPA 扩容导致资源不足时，CA 会加节点 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）ACK 敏捷版 / 专用版中，HPA 能力由托管 K8s 控制面统一提供，企业版控制台（ASCM）通常会对 HPA 策略做可视化封装。由于专有云环境侧重稳定与合规，HPA 常与 **Prometheus 监控套件**、**天基（Tianji）运维体系** 结合使用：业务容器暴露指标后，由 Prometheus Adapter 转换为 `custom.metrics.k8s.io`，再供 HPA 消费；底层计算资源通过 X-Dragon 服务器或弹性裸金属实例承载，节点级弹性则依赖 Cluster Autoscaler 与专有云资源调度能力联动。实际配置时需注意专有云中 Metrics Server 和自定义指标组件是否为默认安装，以及网络策略是否允许 Prometheus 抓取业务指标。

## Related

- [[概念/kubernetes]] — Kubernetes 编排
- [[概念/kubectl]] — kubectl 命令行工具
- [[概念/prometheus]] — Prometheus 监控与指标
- [[概念/containerd]] — containerd 容器运行时
