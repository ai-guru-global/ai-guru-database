---
title: Grouped-Query Attention (GQA)
category: concepts
tags: [attention, kv-cache, gqa, mqa, mha, inference-optimization]
relationships:
  - target: "_concepts/transformer-architecture"
    type: extends
  - target: "_concepts/multi-head-latent-attention"
    type: related_to
  - target: "_concepts/attention-variants"
    type: related_to
  - target: "10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy.md
summary: GQA 让多个 query 头共享同一组 K/V 头，折中 MHA 的精度和 MQA 的 KV Cache 压缩，是 Llama 3、Qwen 2 等主流模型的默认选择。
lifecycle: draft
tier: core
created: 2026-06-15
updated: 2026-06-15
---

# Grouped-Query Attention (GQA)

## 大白话

LLM 有很多个“注意力头”，每个头都要记前面 token 的笔记（KV Cache）。

- **MHA**：32 个头各记各的，笔记最厚。
- **GQA**：32 个头分成 8 组，每组共用一份笔记，笔记变薄。
- **MQA**：所有头共用一份笔记，最薄。

GQA 是“折中方案”：比 MHA 省显存，比 MQA 精度高。

## 一句话解释

> GQA 让多个 query 头共享同一组 K/V 头，在精度和 KV Cache 压缩之间取平衡。

## 为什么影响推理速度

Decode 阶段每生成一个字都要读 KV Cache。GQA 把 KV Cache 降到原来的 1/4 ~ 1/8，读得更快，TPOT 更低。

## Related

- [[_concepts/attention-variants]] — 注意力变体
- [[_concepts/multi-head-latent-attention]] — MLA
- [[_concepts/kv-cache]] — KV Cache
- [[10_Deployment_Inference/Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话解释]]
