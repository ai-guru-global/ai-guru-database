---
title: Inference Performance Gaps
category: -concepts
tags: [inference, performance, gaps, edge, heterogeneous, energy, multi-tenant]
relationships:
  - target: "_concepts/inference-performance"
    type: related_to
  - target: "10_Deployment_Inference/Inference_Performance/Remaining_Performance_Issues_2026"
    type: deepened_by
sources:
  - 10_Deployment_Inference/Inference_Performance/Remaining_Performance_Issues_2026.md
summary: 当前推理性能专题已覆盖核心优化技术，但边缘/端侧、异构/国产芯片、能耗、多租户隔离、编译启动开销、tokenizer、网络尾延迟、多层缓存等缺口仍需补充。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
---

# Inference Performance Gaps（推理性能缺口）

## 核心要点

- 已覆盖：指标、KV Cache、量化、调度、PD 分离、MoE、Flash Kernel、长上下文、多模态、Embedding 服务等。
- 未系统覆盖：
  - 边缘/端侧推理优化
  - 异构与国产芯片推理
  - 多租户隔离与 Noisy Neighbor
  - 编译与启动开销
  - 能耗与绿色推理
  - Tokenizer / Detokenizer 开销
  - 网络尾延迟与跨区部署
  - 多层缓存体系（Embedding、输出缓存）
  - 推理安全与审计开销
  - 模型版本 A/B 测试性能一致性

## 一句话解释

> 推理性能优化不能只盯 GPU 和 attention kernel，边缘、异构、能耗、多租户、编译启动等“边缘问题”同样决定生产系统能否规模化。

## Related

- [[_concepts/inference-performance]] — 推理性能
- [[10_Deployment_Inference/Inference_Performance/Remaining_Performance_Issues_2026|推理性能未解问题与缺口评估]]
