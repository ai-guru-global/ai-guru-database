---
title: TTFT
category: concepts
tags: [inference, latency, ttft, prefill, performance]
relationships:
  - target: "concepts/prefill-decode"
    type: builds_on
  - target: "concepts/inference-performance"
    type: related_to
  - target: "09_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 09_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy.md
summary: TTFT（Time To First Token）是从请求发送到模型输出第一个 token 的时间，主要由 prefill 阶段决定，是用户体验的关键指标。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
---

# TTFT（首字等待时间）

## 大白话

你从发送问题，到看到模型回复**第一个字**，中间等待的时间。

就像你问朋友问题，他低头思考、组织语言的那段时间。

## 一句话解释

> TTFT = Time To First Token，从请求到达至输出第一个 token 的延迟。

## 为什么影响推理速度

TTFT 主要由 **prefill 阶段**决定：

- 输入越长，prefill 越慢，TTFT 越高。
- 算力越强、attention 优化越好，TTFT 越低。

## 常见目标

| 场景 | 目标 |
|------|------|
| 在线聊天 | P50 < 100ms，P99 < 500ms |
| 长文档处理 | 可能几秒到几十秒 |

## Related

- [[concepts/prefill-decode]] — Prefill / Decode 阶段
- [[concepts/inference-performance]] — 推理性能
- [[09_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话解释]]
