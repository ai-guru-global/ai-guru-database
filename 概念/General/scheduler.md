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
