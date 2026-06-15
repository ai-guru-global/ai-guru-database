---
title: Inference Performance
category: concepts
tags: [inference, performance, latency, throughput, optimization, benchmarking]
relationships:
  - target: "concepts/kv-cache"
    type: optimized_by
  - target: "concepts/paged-attention"
    type: optimized_by
  - target: "concepts/continuous-batching"
    type: optimized_by
  - target: "concepts/speculative-decoding"
    type: optimized_by
  - target: "concepts/prefill-decode"
    type: decomposed_into
  - target: "09_Deployment_Inference/Inference_Performance/README"
    type: deepened_by
  - target: "09_Deployment_Inference/Inference_Performance/Inference_Performance_Fundamentals"
    type: deepened_by
sources:
  - 09_Deployment_Inference/Inference_Performance/README.md
  - 09_Deployment_Inference/Inference_Performance/Inference_Performance_Fundamentals.md
summary: LLM 推理性能工程关注 TTFT、TPOT、吞吐、QPS 等核心指标，通过计算优化、KV Cache 优化、调度优化和系统架构优化，降低延迟并提高资源利用率。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
---

# Inference Performance（推理性能）

## 核心要点

- **推理性能的核心指标**：TTFT（首 token 延迟）、TPOT（生成阶段每 token 延迟）、Throughput（吞吐）、QPS（每秒请求数）。
- **两阶段瓶颈不同**：Prefill 阶段算力密集，Decode 阶段显存带宽密集。
- **四大优化方向**：计算优化、显存/KV Cache 优化、调度与并发优化、系统架构优化。
- **评测要控制变量**：固定模型、量化、硬件、并发，同时关注 P50/P99 尾延迟。

## 一句话解释

> 推理性能工程就是：**用更少的资源、更低的延迟、更高的吞吐，把 LLM 推理服务跑得更稳更快。**

## Related

- [[concepts/prefill-decode]] — Prefill / Decode 阶段
- [[concepts/kv-cache]] — KV Cache 优化
- [[concepts/paged-attention]] — PagedAttention
- [[concepts/continuous-batching]] — Continuous Batching
- [[concepts/speculative-decoding]] — 投机解码
- [[09_Deployment_Inference/Inference_Performance/README|推理性能专题]]
