---
title: Quantization
category: concepts
tags: [inference, quantization, fp8, int8, int4, model-compression, performance]
relationships:
  - target: "concepts/model-compression"
    type: builds_on
  - target: "concepts/kv-cache"
    type: optimizes
  - target: "09_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 09_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy.md
summary: 量化通过降低模型权重和激活的数值精度，减少显存占用和数据搬运量，从而加速推理；常用 FP8/INT8/INT4/GPTQ/AWQ。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
---

# Quantization（量化）

## 大白话

量化就是**把模型参数的精度降低**。

- FP16：每个数用 16 位存，像高清图。
- INT8：每个数用 8 位存，像普通图。
- INT4：每个数用 4 位存，像压缩图。

精度越低，模型越小、加载越快、显存占用越少、读写越快；但质量可能略微下降。

## 一句话解释

> 量化通过降低权重和激活的数值精度，减少显存占用和带宽消耗，从而加速推理。

## 常见做法

- **权重量化**：INT8、INT4、GPTQ、AWQ
- **KV Cache 量化**：FP8、INT8
- **激活量化**：FP8（训练和推理统一）

## 为什么影响推理速度

- 模型小了，从显存读权重更快。
- KV Cache 小了，decode 阶段带宽压力降低。

## Related

- [[concepts/model-compression]] — 模型压缩
- [[concepts/kv-cache]] — KV Cache
- [[09_Deployment_Inference/Quantization_Techniques_2026|Quantization Techniques 2026]]
- [[09_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话解释]]
