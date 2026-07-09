---
title: Request Scheduling for LLMs
category: -concepts
tags: [inference, scheduling, continuous-batching, preemption, performance]
relationships:
  - target: "_concepts/continuous-batching"
    type: builds_on
  - target: "_concepts/paged-attention"
    type: uses
  - target: "_concepts/prefill-decode"
    type: optimizes
  - target: "部署推理/Inference_Performance/Request_Scheduling_for_LLMs"
    type: deepened_by
sources:
  - 部署推理/Inference_Performance/Request_Scheduling_for_LLMs.md
summary: LLM 推理请求调度决定请求顺序、batch 组成、抢占策略，通过 Continuous Batching、Chunked Prefill、SLO-aware 调度等手段提高吞吐并稳定延迟。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
aliases:
  - "Request Scheduling"
  - "request scheduling"

---
# Request Scheduling for LLMs（LLM 请求调度）

## 核心要点

- **目标**：在 GPU 显存、延迟 SLO、吞吐之间做动态平衡。
- **核心机制**：Continuous Batching（请求完成即退出，新请求立即加入）。
- **进阶手段**：抢占（Swap/Recompute）、Chunked Prefill、优先级/SLO-aware 调度。
- **生产实现**：vLLM、SGLang、TensorRT-LLM、TGI 均内置调度器。

## 一句话解释

> LLM 请求调度就是“在显存有限的情况下，决定谁先算、怎么拼 batch、被抢占了怎么办”。

## Related

- [[_concepts/continuous-batching]] — Continuous Batching
- [[_concepts/paged-attention]] — PagedAttention
- [[_concepts/prefill-decode]] — Prefill / Decode 阶段
- [[部署推理/Inference_Performance/Request_Scheduling_for_LLMs|LLM 请求调度]]
