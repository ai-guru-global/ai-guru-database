---
title: Prefill-Decode Disaggregation
category: -concepts
tags: [inference, prefill, decode, disaggregated-serving, performance]
relationships:
  - target: "_concepts/prefill-decode"
    type: optimizes
  - target: "_concepts/kv-cache"
    type: uses
  - target: "10_Deployment_Inference/Inference_Performance/Prefill_Decode_Disaggregation"
    type: deepened_by
  - target: "10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 10_Deployment_Inference/Inference_Performance/Prefill_Decode_Disaggregation.md
  - 10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy.md
summary: PD 分离把 prefill 和 decode 阶段拆到不同 GPU/实例执行，让算力型资源处理输入、带宽型资源处理生成，从而优化长上下文和高并发场景的延迟与稳定性。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
---

# Prefill-Decode Disaggregation（PD 分离）

## 大白话

Prefill 和 Decode 是两种完全不同的工作：

- **Prefill**：像写文章前的“查资料、列大纲”，需要大量脑力（算力）。
- **Decode**：像“逐字誊写”，需要手速（显存带宽）。

PD 分离就是：**让擅长查资料的人去 prefill，让擅长写字的人去 decode**，互相不拖累。

## 一句话解释

> PD 分离把 prefill 和 decode 阶段拆到不同的 GPU/实例上执行，分别优化算力和带宽瓶颈。

## 为什么影响推理速度

- 长输入的 prefill 不会阻塞正在生成的请求，TPOT 更稳定。
- 两类阶段可以独立扩缩容。
- 代价：需要在 prefill 和 decode 之间传输 KV Cache。

## Related

- [[_concepts/prefill-decode]] — Prefill / Decode 阶段
- [[_concepts/kv-cache]] — KV Cache
- [[10_Deployment_Inference/Inference_Performance/Prefill_Decode_Disaggregation|Prefill-Decode 分离深潜]]
- [[10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话解释]]
