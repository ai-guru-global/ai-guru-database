---
title: KV Cache (Key-Value Cache)
category: -concepts
tags: [inference, kv-cache, attention, memory, optimization]
relationships:
  - target: "概念/transformer-architecture"
    type: builds_on
  - target: "概念/kv-cache-plain"
    type: simplified_by
  - target: "概念/paged-attention"
    type: optimized_by
  - target: "概念/multi-head-latent-attention"
    type: compressed_by
  - target: "概念/kv-cache-compression"
    type: generalized_by
  - target: "10_部署推理/03_推理优化/KV_Cache_Deep_Dive"
    type: deepened_by
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
  - 10_部署推理/02_推理引擎/vLLM_Deep_Dive.md
summary: KV Cache 是自回归 LLM 推理的核心优化——缓存已计算的 Key/Value 向量避免重复计算，将时间复杂度从 O(T²) 降至 O(T)。但 128K+ 上下文时 KV Cache 显存超过模型参数本身，催生 PagedAttention、MLA、FP8 量化等优化技术。
provenance:
  extracted: 0.85
  inferred: 0.1
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: core
created: 2026-06-03 00:00:00+00:00
updated: 2026-07-21 00:00:00+00:00
aliases:
  - "Kv Cache"
  - "kv cache"

name_zh: "键值缓存"
---
# KV Cache (Key-Value Cache)

> 中文简称：键值缓存

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

- [[概念/kv-cache-plain]] — KV Cache 大白话解释：适合初学者的类比版
- [[概念/transformer-layer]] — Transformer Layer（层）大白话解释
- [[概念/paged-attention]] — PagedAttention：KV Cache 的虚拟内存管理
- [[概念/multi-head-latent-attention]] — MLA：KV Cache 压缩 7-28×
- [[概念/prefix-caching]] — 前缀缓存：复用共享 prompt prefix
- [[概念/model-deployment]] — 模型部署全景
- [[概念/long-context-models]] — 长上下文模型
- [[10_部署推理/03_推理优化/05_KV_Cache_深入分析]] — KV Cache 深度研究：从原理到工程实践
- [[概念/kv-cache-compression]] — KV Cache 压缩

---

## 2026 KV Cache 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **PagedAttention v2** | vLLM 核心，显存利用率 95%+ | GA |
| **MLA (Multi-head Latent Attention)** | DeepSeek 架构，KV Cache 压缩 7-28x | GA |
| **FP8 KV 量化** | 显存减半，质量保留 >99% | GA |
| **RadixAttention** | SGLang 前缀复用，命中率 60-85% | GA |
| **滑动窗口注意力** | 恒定内存，适合局部推理 | GA |

## 生产最佳实践

1. **PagedAttention 必用**：vLLM/SGLang 默认启用，消除显存碎片
2. **长上下文用 MLA**：DeepSeek 架构 MLA 压缩 28x，1M 上下文仅 8GB
3. **FP8 量化**：H100+ GPU 启用 FP8 KV Cache，显存减半且质量几乎无损
4. **前缀缓存**：多轮对话/RAG 场景启用前缀缓存，节省 5-12x 成本
5. **监控显存**：实时监控 KV Cache 显存占用，避免 OOM
6. **GQA/MLA 优先**：选择原生支持 GQA/MLA 的模型
7. **批处理优化**：合理设置 max_num_seqs，平衡吐量和显存

## 2026 KV Cache 技术全景

| 技术 | 压缩比 | 原理 | 状态 |
|------|:------:|------|:----:|
| **MHA** | 1x | 标准多头 | 基线 |
| **GQA** | 4-8x | 共享 KV 头 | GA |
| **MQA** | 8-16x | 单 KV 头 | GA |
| **MLA** | 10-28x | 低秩分解 | GA |
| **FP8 KV** | 2x | 精度降低 | GA |
| **PagedAttention** | - | 分页管理 | GA |
| **RadixAttention** | - | 前缀复用 | GA |

## KV Cache 显存计算

```
显存 = 2 × n_layers × n_kv_heads × head_dim × seq_len × bytes

示例: Llama-4-70B (GQA), 128K 上下文, FP16
     = 2 × 80 × 8 × 128 × 128000 × 2 bytes
     = ~42 GB

优化后 (MLA + FP8, DeepSeek-V3):
     = ~4 GB  ← 压缩 10x+
```

## 延伸阅读

- [[概念/LLM/kv-cache-plain|KV Cache 大白话]]
- [[概念/LLM/kv-cache-compression|KV Cache 压缩]]
- [[概念/LLM/grouped-query-attention|GQA]]
- [[概念/LLM/multi-head-latent-attention|MLA]]
- [[概念/LLM/paged-attention|PagedAttention]]
- [[概念/LLM/radix-attention|RadixAttention]]
- [[10_部署推理/03_推理优化/05_KV_Cache_深入分析|KV Cache 深度研究]]

## 常见问题 FAQ

| 问题 | 答案 |
|------|------|
| KV Cache 为什么占显存？ | 每个 Token 都要存 K 和 V 向量 |
| 怎么减少显存？ | GQA/MLA/FP8/PagedAttention |
| 为什么长上下文贵？ | 序列越长，KV Cache 越大 |
| PagedAttention 是什么？ | 像 OS 分页一样管理 KV Cache |
| 前缀缓存有什么用？ | 复用相同前缀的 KV Cache |

## 配置示例 (vLLM)

```python
from vllm import LLM

llm = LLM(
    model="deepseek-ai/DeepSeek-V3",
    dtype="float8",              # FP8 精度
    kv_cache_dtype="fp8",       # FP8 KV Cache
    max_model_len=128000,        # 128K 上下文
    gpu_memory_utilization=0.90, # 显存利用率
    enable_prefix_caching=True,  # 前缀缓存
)
