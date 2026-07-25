---
title: "Kueue"
category: -concepts
tags: ["kueue", "kubernetes", "scheduler", "queue", "job-management", "quota", "cncf"]
relationships:
  - target: "概念/kubernetes"
    type: extends
  - target: "概念/job-scheduling"
    type: enables
  - target: "概念/kubeflow"
    type: related_to
  - target: "概念/volcano"
    type: related_to
  - target: "概念/ray"
    type: related_to
sources:
  - 12_架构基建/05_CNCF_Cloud_Native_AI/Kueue_Deep_Dive.md
summary: "Kueue 是 Kubernetes 原生的作业排队和配额管理系统，通过 ClusterQueue、LocalQueue、Workload 等 CRD 实现多租户资源公平共享，是 K8s SIG Scheduling 官方项目。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Kueue

---
# Kueue

> K8s 原生的「作业排队与配额管家」——不替换调度器，也能做多租户资源公平共享。

---

## 1. 一句话定义

**Kueue** 是 Kubernetes 原生的**作业排队和配额管理系统**，属于 K8s SIG Scheduling 官方项目。它通过 `ClusterQueue`、`LocalQueue`、`Workload` 等 CRD，在不替换 K8s 默认调度器的前提下，实现多租户资源配额、优先级、抢占和公平共享。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **作业排队** | 资源不足时作业进入队列等待 |
| **配额管理** | ClusterQueue 定义集群级资源配额 |
| **优先级与抢占** | 高优先级作业可抢占低优先级 |
| **公平共享** | 支持 Cohort、Borrowing 等公平调度策略 |
| **集成原生调度器** | 不替换 kube-scheduler |
| **支持多种工作负载** | Job、Deployment、RayJob、Kubeflow TrainingJob 等 |

---

## 3. 核心 CRD

| CRD | 说明 |
|-----|------|
| **ClusterQueue** | 集群级资源池和配额 |
| **LocalQueue** | 命名空间级队列，映射到 ClusterQueue |
| **Workload** | 对 K8s 作业的抽象，Kueue 调度单元 |
| **ResourceFlavor** | 定义不同资源类型（如 spot/on-demand GPU） |

---

## 4. 典型场景

1. **多租户 AI 平台**：团队/项目间 GPU 配额隔离。
2. **训练作业排队**：资源紧张时自动排队，避免资源争抢。
3. ** spot/preemptible 资源管理**：不同资源 flavor 的混合调度。
4. **与 Kubeflow/Ray 集成**：为 ML 工作负载提供配额和排队。

---

## 5. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | 原生扩展，不替换调度器 |
| **Volcano** | Volcano 需替换调度器，功能更强但更重；Kueue 更轻量原生 |
| **Kubeflow** | 可与 Kueue 集成管理训练作业队列 |
| **Ray / KubeRay** | Kueue 可为 RayJob 提供排队能力 |
| **HAMi** | 可与 Kueue 配合做 GPU 共享配额管理 |

---

## 6. 优势与局限

### 优势
- 原生 K8s 设计，与现有生态无缝集成。
- 不替换调度器，部署和运维成本低。
- 适合多租户配额和公平共享。

### 局限
- 不支持 Gang Scheduling（需配合 PodGroup 或调度插件）。
- 相比 Volcano 功能较新，大规模生产验证较少。

---

## Related

- [[12_架构基建/05_CNCF_Cloud_Native_AI/Kueue_Deep_Dive]] — Kueue 深度解析
- [[概念/kubernetes]] — Kubernetes
- [[概念/volcano]] — Volcano
- [[概念/kubeflow]] — Kubeflow
- [[概念/ray]] — Ray
- [[概念/hami]] — HAMi GPU 共享

---

## 2026 Kueue 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **K8s SIG 官方** | 原生设计 | GA |
| **ClusterQueue** | 集群级配额 | GA |
| **ResourceFlavor** | 资源类型区分 | GA |
| **与 Volcano 对比** | Kueue 更轻量 | - |

## 生产最佳实践

1. **多租户配额**：按团队/项目划分 ClusterQueue
2. **与 Volcano 对比**：简单排队用 Kueue，Gang Scheduling 用 Volcano
3. **ResourceFlavor**：区分 spot/on-demand GPU
4. **与 Kubeflow 集成**：为训练作业提供排队能力

## Kueue 核心概念

| 概念 | 说明 |
|------|------|
| ClusterQueue | 集群级队列，定义配额 |
| LocalQueue | 命名空间级队列 |
| ResourceFlavor | 资源类型 (spot/on-demand) |
| Workload | 排队的工作负载 |
| Cohort | 队列组，共享配额 |

## Kueue vs Volcano

| 特性 | Kueue | Volcano |
|------|------|------|
| 定位 | 作业排队 | 批处理调度 |
| Gang Scheduling | 依赖调度器 | 原生支持 |
| 配额管理 | ✅ | ✅ |
| 公平共享 | ✅ | ✅ |
| 抢占 | ✅ | ✅ |
| 适用场景 | 多租户排队 | 分布式训练 |

## Kueue 配置示例

```yaml
# ClusterQueue 定义
apiVersion: kueue.x-k8s.io/v1beta1
kind: ClusterQueue
metadata:
  name: ml-cluster-queue
spec:
  cohort: ml-cohort
  resourceGroups:
  - coveredResources: ["cpu", "memory", "nvidia.com/gpu"]
    flavors:
    - name: on-demand
      resources:
      - name: cpu
        nominalQuota: 100
      - name: memory
        nominalQuota: 200Gi
      - name: nvidia.com/gpu
        nominalQuota: 16
    - name: spot
      resources:
      - name: nvidia.com/gpu
        nominalQuota: 32
---
# LocalQueue 定义
apiVersion: kueue.x-k8s.io/v1beta1
kind: LocalQueue
metadata:
  name: ml-team-queue
  namespace: ml-team
spec:
  clusterQueue: ml-cluster-queue
```

## 使用场景

| 场景 | 说明 |
|------|------|
| 多租户 GPU 共享 | 按团队分配配额 |
| Spot/On-demand 混合 | 优先使用 Spot |
| 训练作业排队 | 避免资源争抢 |
| 公平共享 | 团队间公平分配 |

> 💡 Kueue 是 2026 年 K8s 作业排队的标准方案，多租户 AI 平台推荐 Kueue + Volcano 组合使用。

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get clusterqueues` | 查看集群队列 |
| `kubectl get localqueues -A` | 查看本地队列 |
| `kubectl get workloads -A` | 查看排队作业 |
