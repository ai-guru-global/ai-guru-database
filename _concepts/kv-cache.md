---
title: KV Cache (Key-Value Cache)
category: -concepts
tags: [inference, kv-cache, attention, memory, optimization]
relationships:
  - target: "_concepts/transformer-architecture"
    type: builds_on
  - target: "_concepts/kv-cache-plain"
    type: simplified_by
  - target: "_concepts/paged-attention"
    type: optimized_by
  - target: "_concepts/multi-head-latent-attention"
    type: compressed_by
  - target: "_concepts/kv-cache-compression"
    type: generalized_by
  - target: "10_Deployment_Inference/KV_Cache_Deep_Dive"
    type: deepened_by
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
  - 10_Deployment_Inference/vLLM_Deep_Dive.md
summary: KV Cache 是自回归 LLM 推理的核心优化——缓存已计算的 Key/Value 向量避免重复计算，将时间复杂度从 O(T²) 降至 O(T)。但 128K+ 上下文时 KV Cache 显存超过模型参数本身，催生 PagedAttention、MLA、FP8 量化等优化技术。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03 00:00:00+00:00
updated: 2026-06-15 00:00:00+00:00
---

# KV Cache (Key-Value Cache)

## 核心要点

- **KV Cache 是自回归推理的核心优化**：缓存已计算的 Key/Value 向量，避免每个新 token 都重算整个序列的注意力
- **显存增长线性于上下文长度**：Llama 70B 在 1M 上下文时 KV Cache 达 135GB（FP16），超过模型参数本身（140GB）
- **2026 年五大优化技术族**：PagedAttention（底层基础）、前缀缓存（应用层高杠杆）、注意力压缩（GQA/MLA）、KV 量化（FP8/INT8）、滑动窗口

## 详细内容

### 为什么需要 KV Cache

自回归生成中，模型逐步生成 token：生成第 t 个 token 时需要与前面所有 t-1 个 token 做 attention 计算。如果不缓存，每个新 token 都要重算所有 Key 和 Value，时间复杂度为 O(T²)。

KV Cache 将已计算的 K、V 向量存入 GPU 显存，新 token 只需计算自己的 Q 并与缓存做 attention，将时间复杂度降至 O(T)。

### 显存计算公式

```
KV Cache 大小 = seq_len × n_layers × 2(K+V) × d_model × bytes_per_value
```

以 DeepSeek-V3（61 层、7168 维、128K 上下文、FP16）为例：
```
128K × 61 × 2 × 7168 × 2 bytes ≈ 213.5 GB
```

### KV Cache 显存增长规律

| 模型 · 上下文 | KV Cache (FP16) | 占比模型参数 |
|-------------|----------------|-------------|
| Llama 70B · 8K | 1.0 GB | 0.7% |
| Llama 70B · 32K | 4.3 GB | 3% |
| Llama 70B · 128K | 17.3 GB | 12% |
| Llama 70B · 1M | 135 GB | **96%** |
| DeepSeek V3 · 128K · MLA | 7.6 GB | 28× 压缩 |
| DeepSeek V3 · 1M · MLA+FP8 | 8 GB | 17× 压缩 |

**关键阈值**：超过 128K 上下文时，KV Cache 显存开始超过模型参数本身，成为推理部署的首要瓶颈。

### 五大优化技术族

```
KV Cache 优化技术栈（从底到顶叠加）
│
├── Layer 1: PagedAttention — 消除显存碎片（必选基座）
│   显存利用率 50-65% → 95%+
│
├── Layer 2: 前缀缓存 — 复用共享 prompt prefix
│   vLLM APC (哈希匹配) / SGLang RadixAttention (树形匹配)
│   命中率 60-85%，成本降低 5-12×
│
├── Layer 3: 注意力压缩 — 模型架构层面减少 KV 头数/维度
│   MQA(32×) > GQA(4-8×) > MLA(7-28×)
│
├── Layer 4: KV 量化 — FP8/INT8 减少每 value 字节数
│   FP8: 50% 内存减少，<0.7pt 退化（2026 默认）
│
└── Layer 5: 滑动窗口 — 限制注意力范围
    恒定内存，适合局部推理
```

**叠加效应**：MLA + FP8 + Prefix Cache 三者叠加可实现 4-40× 的长上下文推理成本压缩。

### KV Cache 在不同注意力架构下的存储

| 架构 | 每 token 每层存储 | 128K 总量 | 压缩比 |
|------|-----------------|----------|--------|
| MHA (标准) | 28.7 KB | 213.5 GB | 1× |
| MQA | ~0.9 KB | ~6.7 GB | 32× |
| GQA (8 组) | ~3.6 KB | ~26.7 GB | 8× |
| MLA (DeepSeek) | 1.0 KB | 7.6 GB | 28× |
| MLA + FP8 | 656 B | ~3.8 GB | 56× |

## 开放问题

- DeepSeek V4 的 CSA (Compressed Sparse Attention) 能否进一步压缩？
- Mamba/SSM 架构能否实现 sub-1GB KV Cache at 1M context？
- CXL 3.0 内存扩展能否突破 GPU 显存物理上限？

## 来源

- Kwon et al., "Efficient Memory Management for LLM Serving with PagedAttention," SOSP 2023
- DeepSeek-V3 Technical Report, arXiv:2412.19437
- "KV Cache Optimization for LLMs 2026: Engineering Guide"

## Related

- [[_concepts/kv-cache-plain]] — KV Cache 大白话解释：适合初学者的类比版
- [[_concepts/transformer-layer]] — Transformer Layer（层）大白话解释
- [[_concepts/paged-attention]] — PagedAttention：KV Cache 的虚拟内存管理
- [[_concepts/multi-head-latent-attention]] — MLA：KV Cache 压缩 7-28×
- [[_concepts/prefix-caching]] — 前缀缓存：复用共享 prompt prefix
- [[_concepts/model-deployment]] — 模型部署全景
- [[_concepts/long-context-models]] — 长上下文模型
- [[10_Deployment_Inference/KV_Cache_Deep_Dive]] — KV Cache 深度研究：从原理到工程实践
- [[_concepts/kv-cache-compression]] — KV Cache 压缩
