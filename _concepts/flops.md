---
title: FLOPS
category: -concepts
tags: [hardware, gpu, flops, performance, inference]
relationships:
  - target: "_concepts/ai-hardware"
    type: builds_on
  - target: "_concepts/prefill-decode"
    type: related_to
  - target: "10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy.md
summary: FLOPS 衡量 GPU 每秒能执行多少次浮点运算，是 prefill 阶段算力瓶颈的关键指标，但高 FLOPS 不直接等于推理快，还受显存带宽和数据搬运限制。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
---

# FLOPS（每秒浮点运算次数）

## 大白话

FLOPS 就是 GPU 每秒能做多少次数学运算，类似 CPU 的“几核几线程”。

- FLOPS 越高，理论上算得越快。
- 但**FLOPS 高 ≠ 推理一定快**：如果数据从显存搬不过来，GPU 算力会闲置。

## 一句话解释

> FLOPS 衡量 GPU 峰值算力，是 prefill 阶段的主要瓶颈指标。

## 为什么影响推理速度

- **Prefill 阶段**：要一次性处理整个输入，做大量矩阵乘法，主要吃 FLOPS。
- **Decode 阶段**：每次只算一个 token，矩阵很小，主要吃显存带宽，不是 FLOPS。

所以提升 prefill 速度要堆算力（FLOPS），提升 decode 速度要堆显存带宽。

## Related

- [[_concepts/ai-hardware]] — AI 硬件
- [[_concepts/prefill-decode]] — Prefill / Decode 阶段
- [[10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话解释]]
