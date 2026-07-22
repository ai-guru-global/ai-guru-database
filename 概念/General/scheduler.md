---
title: "Scheduler"
category: -concepts
tags: ["kubernetes", "k8s", "scheduling", "control-plane", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes Scheduler 是控制平面组件，负责将未调度的 Pod 绑定到合适的节点，依据资源请求、亲和性、污点容忍、拓扑分布等策略决策。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "kube-scheduler"
  - "K8s 调度器"
relationships:
  - target: "概念/kubernetes"
    type: part_of
  - target: "概念/pod"
    type: manages
  - target: "概念/node"
    type: related_to
sources: []
---

# Scheduler

> **一句话理解**: K8s Scheduler 是集群里的「调度员」，负责为每个 Pod 挑选最合适的节点，考虑资源、亲和性、污点、拓扑等因素。

## 核心要点

- **调度两阶段**: 预选（Predicates）过滤不满足条件的节点；优选（Priorities）为剩余节点打分，选最高分。
- **调度依据**: Pod 的 `requests`/`limits`、nodeSelector、affinity/anti-affinity、tolerations、拓扑分布约束。
- **扩展机制**: Scheduler Framework 允许插入自定义插件，实现 Gang Scheduling、拓扑感知、负载均衡等。
- **调度失败可见**: Pod 处于 Pending，事件会说明 `0/X nodes are available: ...`
- **多调度器**: 可运行多个自定义调度器，通过 Pod 的 `spec.schedulerName` 指定。

## 常见预选与优选

| 阶段 | 插件示例 | 作用 |
|------|---------|------|
| 预选 | `NodeResourcesFit` | 节点资源是否足够 |
| 预选 | `NodeSelector` | nodeSelector 是否匹配 |
| 预选 | `TaintToleration` | 污点是否被容忍 |
| 预选 | `InterPodAffinity` | Pod 亲和性是否满足 |
| 优选 | `LeastAllocated` | 优先选择资源剩余多的节点 |
| 优选 | `BalancedAllocation` | 均衡 CPU/内存使用 |

## 阿里云专有云关联

在阿里云专有云 ACK 环境中，调度器可能需要考虑神龙裸金属与 ECS 的混合调度、GPU/NPU 拓扑感知、以及天基/Tianji 维护窗口期间的节点冻结。Volcano、KAI Scheduler、Kueue 等扩展调度器常用于 AI 训练/推理场景。

## Related

- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[概念/pod|Pod]] — 被调度对象
- [[概念/node|Node]] — 被调度目标
- [[概念/taint|Taint]] — 节点污点
- [[概念/toleration|Toleration]] — 容忍污点
- [[概念/affinity|Affinity]] — 亲和性调度
- [[架构基建/Kubernetes_Core_Components_Deep_Dive|K8s 核心组件深度解析]]

---

## 2026 调度器生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **kube-scheduler** | K8s 默认调度器 | GA |
| **Volcano** | AI/大数据批调度 | GA |
| **Kueue** | K8s 作业队列 | GA |
| **GPU 调度** | GPU 资源调度 | GA |
| **自定义调度** | 调度器扩展 | GA |

## 生产最佳实践

1. **GPU 调度**：AI 训练用 GPU 调度器
2. **Volcano**：批处理任务用 Volcano
3. **Kueue**：作业队列用 Kueue
4. **亲和性**：用亲和性优化调度
5. **资源配额**：配置资源配额

## 调度器对比

| 调度器 | 特点 | 适用场景 |
|------|------|------|
| kube-scheduler | 默认调度器 | 通用工作负载 |
| Volcano | Gang Scheduling | AI 训练/大数据 |
| Kueue | 作业队列管理 | 多租户批处理 |
| KAI Scheduler | GPU 拓扑感知 | GPU 集群 |
| YuniKorn | 多租户调度 | 大数据平台 |

## GPU 调度配置

```yaml
# GPU 拓扑感知调度示例
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: training
spec:
  containers:
  - name: trainer
    image: pytorch:latest
    resources:
      limits:
        nvidia.com/gpu: 8
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: nvidia.com/gpu.product
            operator: In
            values: ["A100-SXM4-80GB"]
  tolerations:
  - key: "nvidia.com/gpu"
    operator: "Exists"
    effect: "NoSchedule"
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| Pod Pending | 资源不足 | 检查 requests、扩容节点 |
| GPU 调度失败 | Device Plugin 异常 | 重启 nvidia-device-plugin |
| 调度延迟高 | 调度器压力大 | 优化调度策略、增加调度器副本 |
| 亲和性不生效 | 标签不匹配 | 检查节点标签 |
| Gang Scheduling 失败 | 资源不足 | 检查队列配额 |

## 相关概念

- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[概念/gpu-sharing|GPU Sharing]] — GPU 共享调度
- [[概念/ack|ACK]] — 阿里云容器服务

> 💡 调度器是 K8s 集群的“大脑”——对于 AI 工作负载，GPU 拓扑感知和 Gang Scheduling 是提升训练效率的关键。

## 版本兼容性

| 组件 | 版本 | K8s | 状态 |
|------|------|------|------|
| kube-scheduler | 1.28+ | 1.28+ | GA |
| Volcano | 1.9+ | 1.24+ | GA |
| Kueue | 0.7+ | 1.25+ | GA |
| KAI Scheduler | 1.0+ | 1.26+ | GA |

## 生产检查清单

1. 确认 GPU Device Plugin 正常运行
2. 配置合理的资源 requests/limits
3. 设置节点亲和性和污点容忍
4. 配置 ResourceQuota 和 LimitRange
5. 启用 GPU 拓扑感知调度
6. 配置 Pod 优先级和抢占策略
7. 监控调度延迟和失败率
8. 定期审视调度策略有效性

## 总结

Kubernetes Scheduler 是集群资源分配的核心组件。对于 AI 工作负载，需要结合 Volcano/Kueue 实现 Gang Scheduling 和作业队列管理，结合 GPU 拓扑感知提升训练效率。

> 💡 AI 训练调度的核心挑战是“要么全分配，要么不分配”——Gang Scheduling 解决的就是这个问题。

## 常用命令

| 命令 | 说明 |
|------|------|
| `kubectl get pods --field-selector=status.phase=Pending` | 查看 Pending Pod |
| `kubectl describe pod <name>` | 查看调度失败原因 |
| `kubectl get events --sort-by=.metadata.creationTimestamp` | 查看调度事件 |
| `kubectl top nodes` | 查看节点资源使用 |
| `kubectl get resourcequota -n <ns>` | 查看资源配额 |

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| K8s 调度器文档 | 文档 | 官方调度指南 |
| Volcano 文档 | 文档 | AI 批调度 |
| Kueue 文档 | 文档 | 作业队列管理 |
| Scheduler Framework | 文档 | 调度器扩展 |

## 调度策略对比

| 策略 | 说明 | 适用场景 |
|------|------|------|
| LeastAllocated | 优先资源剩余多的节点 | 负载均衡 |
| MostAllocated | 优先资源已用多的节点 | 资源紧凑 |
| BalancedAllocation | 均衡 CPU/内存 | 通用 |
| NodeAffinity | 节点亲和性 | 特定硬件 |
| PodAntiAffinity | Pod 反亲和 | 高可用 |
| TopologySpread | 拓扑分布 | 跨 AZ 容灾 |

## 总结

Kubernetes Scheduler 是集群资源分配的核心组件。对于 AI 工作负载，需要结合 Volcano/Kueue 实现 Gang Scheduling 和作业队列管理，结合 GPU 拓扑感知提升训练效率。

> 💡 调度优化的终极目标是让每个 GPU 都“忙起来”——空闲的 GPU 就是浪费的钱。

## 相关概念

- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[概念/gpu-sharing|GPU Sharing]] — GPU 共享调度
- [[概念/ack|ACK]] — 阿里云容器服务
