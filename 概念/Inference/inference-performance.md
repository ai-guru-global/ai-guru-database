---
title: Inference Performance
category: -concepts
tags: [inference, performance, latency, throughput, optimization, benchmarking]
relationships:
  - target: "概念/kv-cache"
    type: optimized_by
  - target: "概念/paged-attention"
    type: optimized_by
  - target: "概念/continuous-batching"
    type: optimized_by
  - target: "概念/speculative-decoding"
    type: optimized_by
  - target: "概念/prefill-decode"
    type: decomposed_into
  - target: "部署推理/Inference_Performance/README"
    type: deepened_by
  - target: "部署推理/Inference_Performance/Inference_Performance_Fundamentals"
    type: deepened_by
  - target: "部署推理/Inference_Performance/Inference_Speed_Factors_for_dummy"
    type: simplified_by
sources:
  - 部署推理/Inference_Performance/README.md
  - 部署推理/Inference_Performance/Inference_Performance_Fundamentals.md
  - 部署推理/Inference_Performance/Inference_Speed_Factors_for_dummy.md
summary: LLM 推理性能工程关注 TTFT、TPOT、吞吐、QPS 等核心指标，通过计算优化、KV Cache 优化、调度优化和系统架构优化，降低延迟并提高资源利用率。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Inference Performance"
  - "inference performance"

---
# Inference Performance（推理性能）

## 核心要点

- **推理性能的核心指标**：TTFT（首 token 延迟）、TPOT（生成阶段每 token 延迟）、Throughput（吞吐）、QPS（每秒请求数）。
- **两阶段瓶颈不同**：Prefill 阶段算力密集，Decode 阶段显存带宽密集。
- **四大优化方向**：计算优化、显存/KV Cache 优化、调度与并发优化、系统架构优化。
- **评测要控制变量**：固定模型、量化、硬件、并发，同时关注 P50/P99 尾延迟。

## 大白话

模型推理快不快，主要看六件事：

1. **模型本身**：参数越多通常越慢；但 MoE、MLA/GQA 等结构可以用更少的实际计算和更小的 KV Cache 跑得更快。
2. **硬件三件套**：算力（FLOPS）决定 prefill 多快；显存带宽决定 decode 多快；显存大小决定能跑多长的上下文。
3. **输入输出长度**：输入越长，首字等待越久；输出越长，总时间越久。
4. **软件优化**：FlashAttention、KV Cache 压缩、Continuous Batching、量化、投机解码都能显著提速。
5. **并发与调度**：请求太少 GPU 吃不饱；请求太多大家排队。好的调度器能平衡延迟和吞吐。
6. **系统架构**：多卡要快通信（NVLink/IB）；PD 分离让 prefill 和 decode 各自优化；弹性扩缩容应对流量波动。

想提速，先找到真正的瓶颈，对症下药比盲目堆 GPU 有效。

## 一句话解释

> 推理性能工程就是：**用更少的资源、更低的延迟、更高的吞吐，把 LLM 推理服务跑得更稳更快。**

## Related

- [[概念/prefill-decode]] — Prefill / Decode 阶段
- [[概念/kv-cache]] — KV Cache 优化
- [[概念/paged-attention]] — PagedAttention
- [[概念/continuous-batching]] — Continuous Batching
- [[概念/speculative-decoding]] — 投机解码
- [[部署推理/Inference_Performance/README|推理性能专题]]
- [[部署推理/Inference_Performance/Inference_Speed_Factors_for_dummy|决定模型推理速度的要素（大白话版）]]
