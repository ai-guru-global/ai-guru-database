---
title: "GPU 成本优化"
category: 13-ai-ops
subcategory: cost-management
tags: ["gpu", "cost-optimization", "finops", "ai", "kubernetes", "k8s", "alibaba-cloud"]
summary: "系统讲解 GPU 集群成本优化的方法论：利用率提升、调度优化、混合负载、弹性伸缩、Spot 实例与模型压缩。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

# GPU 成本优化

> **一句话理解**: GPU 贵，优化成本的核心就两条——让 GPU 别闲着，以及让同样的 GPU 能干更多活。

## 目录

- [1. 利用率提升](#1-利用率提升)
- [2. 调度优化](#2-调度优化)
- [3. 弹性伸缩](#3-弹性伸缩)
- [4. 混合负载](#4-混合负载)
- [5. 硬件与模型优化](#5-硬件与模型优化)
- [Related](#related)

---

## 1. 利用率提升

| 问题 | 解决 |
|------|------|
| GPU 空闲 | 自动关机、任务队列、共享调度 |
| 显存浪费 | HAMi、MIG、Dynamic Batching |
| 小任务占大卡 | 按任务规模匹配 GPU 型号 |
| 训练等待 | Volcano 队列、优先级调度 |

## 2. 调度优化

- **Volcano**: 适合批量训练任务
- **Kueue**: K8s 原生队列系统
- **Yunikorn**: Apache 队列调度器
- **优先级与抢占**: 高优先级任务可抢占低优先级

## 3. 弹性伸缩

- **HPA**: 基于 CPU/内存/GPU 利用率
- **KEDA**: 基于自定义指标（QPS、队列长度）
- **Cluster Autoscaler**: 节点级别扩缩容
- **预热池**: 减少冷启动时间

## 4. 混合负载

```text
白天：推理服务高负载
夜间：训练任务跑批量
```

通过命名空间配额和时间段调度实现错峰。

## 5. 硬件与模型优化

| 方向 | 方法 |
|------|------|
| 模型压缩 | 量化、剪枝、蒸馏 |
| 推理引擎 | vLLM/SGLang/TensorRT-LLM |
| 硬件选型 | 推理用 L4/A10，训练用 A100/H100 |
| 国产替代 | 昇腾/寒武纪等降低 NVIDIA 依赖 |

---

## Related

- [[_concepts/finops|FinOps]]
- [[_concepts/hami|HAMi]]
- [[_concepts/mig|MIG]]
- [[_concepts/volcano|Volcano]]
- [[AI运维/Cost_Management/FinOps_for_AI|AI 场景 FinOps]]
