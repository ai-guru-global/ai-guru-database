---
title: Attention 变体 (GQA/MQA/SWA)
category: -concepts
tags: [attention, transformer, gqa, mqa, swa, kv-cache]
relationships:
  - target: "_concepts/transformer-architecture"
    type: extends
  - target: "_concepts/multi-head-latent-attention"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: 注意力架构从 MHA → MQA → GQA → MLA 演进，核心目标是用更少的 KV 头数/维度压缩 KV Cache。GQA（4-8× 压缩）是 2026 年默认架构（Llama 3/Qwen 2/Mistral），MQA（32× 压缩）适合极低延迟，SWA（恒定内存）适合局部推理。
provenance:
  extracted: 0.88
  inferred: 0.07
  ambiguous: 0.05
base_confidence: 0.84
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03 00:00:00+00:00
updated: 2026-06-03 00:00:00+00:00
aliases:
  - "Attention Variants"
  - "attention variants"

---
# Attention 变体 (GQA/MQA/SWA)

## 核心要点

- **注意力架构演进**：MHA(1×) → MQA(32×) → GQA(4-8×) → MLA(7-28×)，压缩比递增
- **GQA 是 2026 默认**：Llama 3.x、Qwen 2.x、Mistral 均采用 GQA，4-8× 压缩且质量退化 <0.5 pt
- **选择取决于模型**：注意力架构在模型训练时确定，推理时无法更改

## 详细内容

### GQA: Grouped-Query Attention

**原理**：将 Q heads 分组，每组共享一组 KV heads。例如 32 Q heads + 8 KV heads = 4 个 Q heads 共享 1 个 KV head。

```
MHA:  Q1-K1-V1, Q2-K2-V2, ..., Q32-K32-V32  (32 KV pairs)
GQA:  Q1..Q4 → K1-V1, Q5..Q8 → K2-V2, ...   (8 KV pairs, 4× compression)
MQA:  Q1..Q32 → K1-V1                         (1 KV pair, 32× compression)
```

**代表模型**：Llama 3.x (32Q/8KV)、Qwen 2.x (28Q/4KV)、Mistral Large

### MQA: Multi-Query Attention

**原理**：所有 Q heads 共享唯一一组 KV head，压缩比最高（~32×），但质量退化 1-3 pt。

**适用场景**：极低延迟推理（如实时翻译），质量可接受时优先考虑。
**代表模型**：Falcon-40B、PaLM

### SWA: Sliding-Window Attention

**原理**：每个 token 只关注最近 W 个 token（如 W=4096），KV Cache 内存恒定不随序列长度增长。

```
Token t 的注意力范围: [max(0, t-W), t]
KV Cache 大小: W × n_layers × 2 × d_model × bytes  (恒定)
```

**优势**：恒定内存，适合超长序列
**劣势**：丢失长程依赖，不适合长文档 Q&A 和代码搜索
**代表模型**：Mistral 7B (W=4096)、Mixtral

### 全景对比

| 架构 | KV 压缩比 | 质量退化 | 代表模型 | 年代 |
|------|----------|---------|---------|------|
| **MHA** | 1× | 无 | GPT-4, 早期 LLaMA | 2017 |
| **MQA** | ~32× | -1~3 pts | Falcon-40B, PaLM | 2019 |
| **GQA** | 4-8× | <0.5 pt | **Llama 3.x, Qwen 2.x** | 2023 |
| **MLA** | 7-28× | <0.2 pt | DeepSeek V2/V3/R1 | 2024 |
| **SWA** | 恒定 | 丢失长程 | Mistral 7B | 2023 |

### 与 KV 量化的叠加

| 组合 | 1M 上下文 KV Cache (70B 级) | 总压缩比 |
|------|---------------------------|---------|
| MHA + FP16 | 135 GB | 1× |
| GQA + FP8 | 17 GB | 8× |
| MLA + FP8 | 8 GB | 17× |

## Related

- [[_concepts/multi-head-latent-attention]] — MLA（最强压缩，DeepSeek 系列）
- [[_concepts/kv-cache]] — KV Cache（所有变体的优化目标）
- [[_concepts/transformer-architecture]] — Transformer 架构基础
