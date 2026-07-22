---
title: Attention 变体 (GQA/MQA/SWA/MLA)
category: -concepts
tags: [attention, transformer, gqa, mqa, swa, mla, kv-cache, inference-optimization]
relationships:
  - target: "概念/LLM/transformer-architecture"
    type: extends
  - target: "概念/LLM/multi-head-latent-attention"
    type: related_to
  - target: "概念/LLM/grouped-query-attention"
    type: related_to
  - target: "概念/Inference/kv-cache"
    type: optimizes
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - "https://arxiv.org/abs/2305.13245"  # GQA
  - "https://arxiv.org/abs/2405.04434"  # MLA (DeepSeek-V2)
summary: 注意力架构从 MHA → MQA → GQA → MLA 演进，核心目标是用更少的 KV 头数/维度压缩 KV Cache。GQA（4-8× 压缩）是 2024-2026 默认架构（Llama 3/Qwen 2/Mistral），MLA（7-28×）是 DeepSeek 的极致压缩，SWA（恒定内存）适合局部推理。
provenance:
  extracted: 0.88
  inferred: 0.07
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03
updated: 2026-07-21
aliases:
  - "Attention Variants"
  - "attention variants"
  - "注意力变体"

---
# Attention 变体 (GQA/MQA/SWA/MLA)

> 注意力架构演进的核心目标：用更少的 KV 头数/维度压缩 KV Cache，降低推理显存和带宽压力。

## 核心要点

- **注意力架构演进**：MHA(1×) → MQA(32×) → GQA(4-8×) → MLA(7-28×)，压缩比递增
- **GQA 是 2024-2026 默认**：Llama 3.x、Qwen 2.x、Mistral 均采用 GQA，4-8× 压缩且质量退化 <0.5 pt
- **MLA 是极致压缩**：DeepSeek-V2/V3 用低秩投影压缩 KV，7-28× 压缩且质量损失极小
- **选择取决于模型**：注意力架构在模型训练时确定，推理时无法更改

## 架构演进图

```
2017  MHA (Multi-Head Attention)
      │  32 Q + 32 K + 32 V → KV Cache: 32×
      │
2019  MQA (Multi-Query Attention)
      │  32 Q + 1 K + 1 V → KV Cache: 1× (32× 压缩)
      │
2023  GQA (Grouped-Query Attention)  ← 当前主流
      │  32 Q + 8 K + 8 V → KV Cache: 8× (4× 压缩)
      │
2023  SWA (Sliding-Window Attention)
      │  局部注意力，KV Cache 恒定
      │
2024  MLA (Multi-head Latent Attention)  ← 极致压缩
         128 Q + 低秩压缩 KV → KV Cache: 7-28× 压缩
```

## GQA: Grouped-Query Attention

**原理**：将 Q heads 分组，每组共享一组 KV heads。

```
MHA:  Q1-K1-V1, Q2-K2-V2, ..., Q32-K32-V32  (32 KV pairs)
GQA:  Q1..Q4 → K1-V1, Q5..Q8 → K2-V2, ...   (8 KV pairs, 4× compression)
MQA:  Q1..Q32 → K1-V1                         (1 KV pair, 32× compression)
```

**代表模型**：Llama 3.x (32Q/8KV)、Qwen 2.x (28Q/4KV)、Mistral Large

## MQA: Multi-Query Attention

**原理**：所有 Q heads 共享唯一一组 KV head，压缩比最高（~32×），但质量退化 1-3 pt。

**适用场景**：极低延迟推理（如实时翻译），质量可接受时优先考虑。
**代表模型**：Falcon-40B、PaLM

## SWA: Sliding-Window Attention

**原理**：每个 token 只关注最近 W 个 token（如 W=4096），KV Cache 内存恒定不随序列长度增长。

```
Token t 的注意力范围: [max(0, t-W), t]
KV Cache 大小: W × n_layers × 2 × d_model × bytes  (恒定)
```

**优势**：恒定内存，适合超长序列
**劣势**：丢失长程依赖，不适合长文档 Q&A 和代码搜索
**代表模型**：Mistral 7B (W=4096)、Mixtral

## MLA: Multi-head Latent Attention

**原理**：通过低秩投影将 KV 压缩到极小的潜在空间，推理时再解压。解耦 RoPE 保证位置编码精度。

```
训练时: KV → 低秩投影 → 压缩表示 (d=512)
推理时: 压缩表示 → 解压 → 完整 KV
压缩比: 7-28×，质量损失 <0.2 pt
```

**代表模型**：DeepSeek-V2/V3/R1

## 全景对比

| 架构 | KV 压缩比 | 质量退化 | 代表模型 | 年代 |
|------|:--------:|:-------:|---------|:----:|
| **MHA** | 1× | 无 | GPT-4, 早期 LLaMA | 2017 |
| **MQA** | ~32× | -1~3 pts | Falcon-40B, PaLM | 2019 |
| **GQA** | 4-8× | <0.5 pt | **Llama 3.x, Qwen 2.x** | 2023 |
| **MLA** | 7-28× | <0.2 pt | DeepSeek V2/V3/R1 | 2024 |
| **SWA** | 恒定 | 丢失长程 | Mistral 7B | 2023 |

## 与 KV 量化的叠加

| 组合 | 1M 上下文 KV Cache (70B 级) | 总压缩比 |
|------|:-------------------------:|:-------:|
| MHA + FP16 | 135 GB | 1× |
| GQA + FP16 | 34 GB | 4× |
| GQA + FP8 | 17 GB | 8× |
| MLA + FP8 | 8 GB | 17× |
| MLA + FP8 + KV INT4 | 4 GB | 34× |

## 选型决策指南

```
模型选型时的注意力架构考量:
├─ 通用场景？ → GQA (Llama 3, Qwen2.5)  ← 默认选择
├─ 极致显存效率？ → MLA (DeepSeek-V3)
├─ 超长上下文 + 显存受限？ → MLA 或 GQA + KV 量化
├─ 局部推理 (代码补全)？ → SWA 可接受
└─ 极低延迟 + 质量可牺牲？ → MQA
```

## 生产最佳实践

1. **无需手动配置**：推理引擎自动识别模型的注意力架构
2. **GQA 模型 + KV INT8**：叠加量化可进一步压缩 2×
3. **长上下文优先 GQA/MLA**：避免 MHA 的显存爆炸
4. **SWA 不适合 RAG**：检索增强需要长程注意力
5. **关注 MLA 生态扩展**：2026 年更多模型可能采用 MLA 架构

## 注意力变体全景对比

| 变体 | KV 头数 | 显存占用 | 推理速度 | 代表模型 |
|------|---------|---------|---------|----------|
| **MHA** | H | 最高 | 最慢 | GPT-3, 原始 Transformer |
| **MQA** | 1 | 最低 | 最快 | Falcon, StarCoder |
| **GQA** | G (1<G<H) | 中 | 快 | Llama 3/4, Qwen3, Mistral |
| **MLA** | 压缩潜在 | 极低 | 快 | DeepSeek-V3 |
| **SWA** | H (窗口内) | 低 | 快 | Mistral, Gemma |

## 注意力计算复杂度

```
标准 Attention: O(T² × d)    T=序列长度, d=头维度
Flash Attention: O(T² × d)   计算量不变，但 IO 减少 5-10x
SWA:            O(T × W × d)  W=窗口大小，线性于 T
Linear Attn:    O(T × d²)    线性于 T，但质量有损
```

## 2026 注意力架构选型指南

| 场景 | 推荐架构 | 理由 |
|------|---------|------|
| 通用对话 (8K) | GQA | 生态最成熟，引擎全支持 |
| 超长上下文 (128K+) | MLA / GQA+YaRN | KV Cache 显存可控 |
| 端侧推理 | GQA + INT4 | 显存受限，需极致压缩 |
| 高吐吐量服务 | MQA / GQA | KV 头少，批处理效率高 |
| 流式/实时 | SWA | 固定窗口，延迟可预测 |

## 延伸阅读

- [[概念/LLM/alibi|ALiBi 位置编码]] — 位置编码与注意力的关系
- [[概念/LLM/kv-cache|KV Cache]] — 注意力变体的核心优化目标
- [[概念/LLM/flash-attention-kernels|Flash Attention]] — 注意力算子优化

## Related

- [[概念/LLM/multi-head-latent-attention]] — MLA（最强压缩，DeepSeek 系列）
- [[概念/LLM/grouped-query-attention]] — GQA 详解
- [[概念/Inference/kv-cache]] — KV Cache（所有变体的优化目标）
- [[概念/Inference/kv-cache-compression]] — KV Cache 压缩
- [[概念/LLM/transformer-architecture]] — Transformer 架构基础
- [[概念/LLM/flash-attention-kernels]] — Flash 算子系列

## 快速对比卡片

> **MHA**: 每个 Q 头独立 KV → 质量最高，显存最大
> **GQA**: 多个 Q 头共享 KV → 质量接近 MHA，显存降 4-8x
> **MQA**: 所有 Q 头共享 1 组 KV → 显存最小，质量略降
> **MLA**: KV 压缩到潜在空间 → 显存极低，DeepSeek 独创

> ℹ️ 2026 年 GQA 已成为新模型默认选择，MLA 在长上下文场景增长迅速。
选择注意力架构时优先考虑推理引擎兼容性和生态支持。
