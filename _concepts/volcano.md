---
title: "Volcano"
category: -concepts
tags: ["volcano", "kubernetes", "scheduler", "batch", "gang-scheduling", "distributed-training", "cncf"]
relationships:
  - target: "_concepts/kubernetes"
    type: extends
  - target: "_concepts/distributed-training"
    type: enables
  - target: "_concepts/kubeflow"
    type: related_to
  - target: "_concepts/kueue"
    type: related_to
  - target: "_concepts/ray"
    type: related_to
sources:
  - 架构基建/CNCF_Cloud_Native_AI/Volcano_Deep_Dive.md
summary: "Volcano 是 CNCF Incubating 的 Kubernetes 批处理调度器，专为大数据和 AI 工作负载设计，提供 Gang Scheduling、队列调度、Job 优先级、抢占等能力，广泛应用于分布式训练场景。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Volcano

---
# Volcano

> K8s 上的「批处理调度专家」——让分布式训练作业不再因为资源碎片而卡住。

---

## 1. 一句话定义

**Volcano** 是 CNCF Incubating 的 Kubernetes 批处理调度系统，专为**大数据和 AI 工作负载**设计。它在 K8s 默认调度器之上增加了 **Gang Scheduling（ all-or-nothing 调度）、队列调度、Job 优先级、抢占、DRF（主导资源公平）** 等能力，是分布式训练（如 MPI、Horovod、PyTorch DDP）的常用调度底座。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **Gang Scheduling** | 一个 Job 的所有 Pod 要么同时调度，要么都不调度，避免资源死锁 |
| **Queue 调度** | 多队列管理，支持队列优先级与容量限制 |
| **Job 优先级与抢占** | 高优先级 Job 可抢占低优先级 Job |
| **DRF 公平调度** | 主导资源公平算法 |
| **Tensorboard / Service 集成** | 作业生命周期内暴露服务 |
| **插件化** | 支持自定义调度插件 |

---

## 3. 典型场景

1. **分布式训练**：MPI、Horovod、PyTorch DDP 多 Pod 同时启动。
2. **批处理作业**：Spark、Flink on K8s。
3. **多租户 GPU 集群**：队列隔离、优先级管理。
4. **大规模 HPC**：需要 Gang Scheduling 的科学计算。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | 替换默认 scheduler |
| **Kueue** | K8s 原生作业排队系统，与 Volcano 功能重叠但设计更轻量 |
| **Kubeflow Training Operator** | 可与 Volcano 集成做分布式训练调度 |
| **Ray / KubeRay** | Volcano 可作为 Ray 集群的调度器 |
| **HAMi** | 可与 Volcano 配合做 GPU 共享调度 |

---

## 5. 优势与局限

### 优势
- Gang Scheduling 解决分布式训练资源死锁。
- 队列与优先级机制成熟。
- 与 Kubeflow、Ray 等集成广泛。

### 局限
- 需替换 K8s 默认调度器，运维成本高。
- 与 Kueue 等功能重叠，选型需谨慎。
- 对 Serverless/微服务场景不适用。

---

## Related

- [[架构基建/CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] — Volcano 深度解析
- [[_concepts/kubernetes]] — Kubernetes
- [[_concepts/distributed-training]] — 分布式训练
- [[_concepts/kubeflow]] — Kubeflow
- [[_concepts/kueue]] — Kueue
- [[_concepts/ray]] — Ray
