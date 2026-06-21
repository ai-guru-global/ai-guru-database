---
title: "KV Cache 压缩"
category: concepts
tags: ["kv-cache", "compression", "inference", "long-context", "optimization"]
relationships:
  - target: "_concepts/kv-cache"
    type: optimizes
  - target: "_concepts/kv-cache-plain"
    type: simplified_version_of
  - target: "_concepts/multi-head-latent-attention"
    type: related_to
  - target: "_concepts/grouped-query-attention"
    type: related_to
  - target: "_concepts/quantization"
    type: complements
sources:
  - 05_NLP_LLMs/LLM_Architecture_Evolution.md
  - 10_Deployment_Inference/KV_Cache_Deep_Dive.md
  - 10_Deployment_Inference/Inference_Performance/Long_Context_Inference_2026.md
summary: "KV Cache 压缩就像把大模型推理时的‘记忆笔记本’变薄：通过量化、稀疏化、低秩近似、共享注意力头等技术，减少显存占用，让长上下文推理和多轮对话更便宜、更快。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# KV Cache 压缩

## 核心要点

- **KV Cache 是大模型生成文本时的‘上下文备忘录’**，保存每个 token 对应的 Key 和 Value，避免重复计算。
- **长上下文 = 大显存**：128K 上下文、批量请求时，KV Cache 可能占几十 GB 显存，成为推理瓶颈。
- **KV Cache 压缩就是把这个备忘录‘瘦身’**，在尽量保持效果的前提下减少显存占用。
- **主流路线**：量化（INT8/INT4）、低秩近似、稀疏/滑动窗口、分组查询注意力（GQA）、Multi-head Latent Attention（MLA）。

## 一句话理解

KV Cache 压缩就像把厚厚的会议记录本改成精简版索引：记得更少，但关键信息不丢，让大模型能同时处理更长的对话和更多的请求。

## 详细内容

### 为什么需要压缩？

大模型生成文本时，每新增一个 token 都要回头看前面所有 token。为了省算力，系统会把前面 token 的 Key、Value 矩阵存进显存，这就是 KV Cache。

问题在于：
- 上下文越长，KV Cache 越大（与序列长度成正比）。
- 多用户并发时，每个用户都有自己的 KV Cache。
- 显存被 KV Cache 占满后，能同时服务的请求数就少了。

### 主流压缩方法

| 方法 | 大白话 | 效果 | 代表工作 |
|------|--------|------|----------|
| **量化（Quantization）** | 把 KV Cache 从 FP16/BF16 改成 INT8 甚至 INT4 | 显存减半或更多 | KV-Int8, AWQ |
| **低秩近似（Low-rank）** | 把大矩阵拆成两个小矩阵相乘 | 显著降低维度 | CaM, KV Press |
| **分组查询注意力（GQA）** | 多组 query 共享同一套 KV | 减少 KV 数量 | LLaMA-2/3, Mistral |
| **滑动窗口/稀疏** | 只保留最近的 N 个 token 的 KV | 固定上限显存 | Longformer, Mistral |
| **MLA（Multi-head Latent Attention）** | 把 KV 压缩到一个共享低维潜空间 | 长上下文显存大降 | DeepSeek-V2/V3 |
| **前缀缓存（Prefix Caching）** | 相同前缀只存一份 | 多轮对话省显存 | vLLM, SGLang |

### 量化 vs 低秩 vs 注意力结构改造

```
量化：把每个数字的精度变低（如 16 位 → 8 位）
低秩：把矩阵变小（如 1000×1000 → 1000×64 + 64×1000）
GQA/MLA：直接减少需要保存的 KV 数量
```

### 生产场景

- **长文档问答**：100K+ token 的 PDF 分析，必须压缩 KV Cache 才能跑起来。
- **多轮客服对话**：用户连续提问，前缀缓存 + KV 量化可以支持更多并发。
- **端侧部署**：手机/PC 显存极小，INT4 KV + GQA 是标配。

## 开放问题

- 极低精度量化（INT4 以下）对长上下文 recall 的影响仍需评估。
- 不同压缩方法能否组合（如 MLA + INT4）以获得更大收益。
- 压缩后的 KV Cache 与 speculative decoding、prefix caching 的协同优化。

## Related

- [[_concepts/kv-cache]] — KV Cache 技术详解
- [[_concepts/kv-cache-plain]] — KV Cache 大白话解释
- [[_concepts/grouped-query-attention]] — 分组查询注意力（GQA）
- [[_concepts/multi-head-latent-attention]] — Multi-head Latent Attention (MLA)
- [[_concepts/quantization]] — 模型量化
- [[10_Deployment_Inference/KV_Cache_Deep_Dive]] — KV Cache 深度研究
- [[10_Deployment_Inference/Inference_Performance/Long_Context_Inference_2026]] — 长上下文推理 2026
