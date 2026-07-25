---
title: "Volcano"
category: -concepts
tags: ["volcano", "kubernetes", "scheduler", "batch", "gang-scheduling", "distributed-training", "cncf"]
relationships:
  - target: "概念/kubernetes"
    type: extends
  - target: "概念/distributed-training"
    type: enables
  - target: "概念/kubeflow"
    type: related_to
  - target: "概念/kueue"
    type: related_to
  - target: "概念/ray"
    type: related_to
sources:
  - 12_架构基建/05_CNCF_Cloud_Native_AI/Volcano_Deep_Dive.md
summary: "Volcano 是 CNCF Incubating 的 Kubernetes 批处理调度器，专为大数据和 AI 工作负载设计，提供 Gang Scheduling、队列调度、Job 优先级、抢占等能力，广泛应用于分布式训练场景。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
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

- [[12_架构基建/05_CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] — Volcano 深度解析
- [[概念/kubernetes]] — Kubernetes
- [[概念/distributed-training]] — 分布式训练
- [[概念/kubeflow]] — Kubeflow
- [[概念/kueue]] — Kueue
- [[概念/ray]] — Ray
- [[概念/hami]] — HAMi GPU 共享

---

## 2026 Volcano 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 孵化** | 华为云捐赠 | GA |
| **Gang Scheduling** | All-or-nothing 调度 | GA |
| **队列管理** | 多租户资源隔离 | GA |
| **与 Kueue 对比** | Volcano 更重，Kueue 更轻 | - |

## 生产最佳实践

1. **分布式训练**：PyTorch DDP、MPI 作业用 Volcano 调度
2. **队列设计**：按团队/项目划分队列，设置优先级
3. **与 Kueue 对比**：简单排队用 Kueue，复杂调度用 Volcano
4. **GPU 共享**：配合 HAMi 实现 GPU 细粒度调度

## Volcano 核心组件

| 组件 | 功能 |
|------|------|
| vc-scheduler | 批处理调度器 |
| vc-controller-manager | 控制器 |
| vc-webhook-manager | Webhook |
| vc-agent | 节点代理 |

## Volcano 核心概念

| 概念 | 说明 |
|------|------|
| Queue | 资源队列，配额管理 |
| Job | 批处理作业 |
| PodGroup | Pod 组，Gang Scheduling |
| Task | 作业中的任务 |

## Volcano Job 配置示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: pytorch-training
spec:
  minAvailable: 4
  schedulerName: volcano
  queue: ml-queue
  plugins:
    ssh: []
    svc: []
  tasks:
  - replicas: 1
    name: master
    template:
      spec:
        containers:
        - name: pytorch
          image: pytorch/pytorch:2.0-cuda11.8
          resources:
            limits:
              nvidia.com/gpu: 1
  - replicas: 3
    name: worker
    template:
      spec:
        containers:
        - name: pytorch
          image: pytorch/pytorch:2.0-cuda11.8
          resources:
            limits:
              nvidia.com/gpu: 1
```

## Volcano vs Kueue

| 特性 | Volcano | Kueue |
|------|------|------|
| 定位 | 批处理调度 | 作业排队 |
| Gang Scheduling | 原生支持 | 依赖调度器 |
| 队列管理 | ✅ | ✅ |
| 公平共享 | ✅ | ✅ |
| 适用场景 | 分布式训练 | 多租户排队 |

## AI 场景应用

| 场景 | 说明 |
|------|------|
| 分布式训练 | Gang Scheduling 保证所有 Pod 同时启动 |
| 多租户 GPU | Queue 配额管理 |
| 优先级调度 | 高优先级任务抢占 |
| 公平共享 | 团队间公平分配 |

> 💡 Volcano 是 K8s 批处理调度的标准方案，2026 年 AI 分布式训练推荐 Volcano + Gang Scheduling。

## 常用命令

| 命令 | 用途 |
|------|------|
| `kubectl get vcjob` | 查看 Volcano Job |
| `kubectl get queue` | 查看队列 |
| `kubectl get podgroup` | 查看 PodGroup |
| `kubectl describe vcjob <name>` | Job 详情 |
