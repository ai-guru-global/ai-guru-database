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
  - 架构基建/CNCF_Cloud_Native_AI/Kueue_Deep_Dive.md
summary: "Kueue 是 Kubernetes 原生的作业排队和配额管理系统，通过 ClusterQueue、LocalQueue、Workload 等 CRD 实现多租户资源公平共享，是 K8s SIG Scheduling 官方项目。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
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

- [[架构基建/CNCF_Cloud_Native_AI/Kueue_Deep_Dive]] — Kueue 深度解析
- [[概念/kubernetes]] — Kubernetes
- [[概念/volcano]] — Volcano
- [[概念/kubeflow]] — Kubeflow
- [[概念/ray]] — Ray
