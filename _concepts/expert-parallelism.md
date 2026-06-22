---
title: Expert Parallelism
category: -concepts
tags: [moe, expert-parallelism, distributed-inference, all-to-all, performance]
relationships:
  - target: "_concepts/mixture-of-experts"
    type: builds_on
  - target: "_concepts/distributed-parallelism"
    type: related_to
  - target: "10_Deployment_Inference/Inference_Performance/MoE_Inference_Optimization"
    type: deepened_by
sources:
  - 10_Deployment_Inference/Inference_Performance/MoE_Inference_Optimization.md
summary: Expert Parallelism 把 MoE 模型的不同专家分布到不同 GPU，以减少单卡显存压力；代价是引入 All-to-All 通信，需要与负载均衡策略配合。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
---

# Expert Parallelism（专家并行）

## 核心要点

- **目的**：把 MoE 的众多专家分散到多张 GPU，解决单卡放不下全部专家的问题。
- **机制**：每个 token 按路由结果通过 All-to-All 通信到达对应专家所在 GPU，计算完再聚合回来。
- **关键权衡**：EP 度越高，单卡显存越省，但跨卡/跨节点通信越多。
- **配合技术**：负载均衡（auxiliary loss、expert capacity）、通信与计算重叠、FP8/INT8 通信量化。

## 一句话解释

> Expert Parallelism 就是“一个专家住一个 GPU”，token 按需串门，用通信换显存。

## Related

- [[_concepts/mixture-of-experts]] — 混合专家模型
- [[_concepts/distributed-parallelism]] — 分布式并行策略
- [[10_Deployment_Inference/Inference_Performance/MoE_Inference_Optimization|MoE 推理优化]]
