---
title: "KV Cache 压缩"
category: -concepts
tags: ["kv-cache", "compression", "inference", "long-context", "optimization", "quantization", "gqa", "mla"]
relationships:
  - target: "概念/Inference/kv-cache"
    type: optimizes
  - target: "概念/LLM/multi-head-latent-attention"
    type: related_to
  - target: "概念/LLM/grouped-query-attention"
    type: related_to
  - target: "概念/Inference/quantization"
    type: complements
  - target: "概念/LLM/attention-variants"
    type: related_to
sources:
  - 05_大模型/04_LLM架构/LLM_Architecture_Evolution.md
  - 10_部署推理/03_推理优化/KV_Cache_Deep_Dive.md
  - 10_部署推理/03_推理优化/Long_Context_Inference_2026.md
summary: "KV Cache 压缩通过量化、稀疏化、低秩近似、共享注意力头等技术减少显存占用，让长上下文推理和多轮对话更便宜、更快。2026 年 GQA+FP8 是标配，MLA+INT4 可将 1M 上下文 KV Cache 从 135GB 压缩至 4GB。"
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - "Kv Cache Compression"
  - "kv cache compression"
  - "KV Cache 压缩技术"

name_zh: "KV Cache 压缩"
---
# KV Cache 压缩

> 中文简称：KV Cache 压缩

> KV Cache 压缩就像把厚厚的会议记录本改成精简版索引：记得更少，但关键信息不丢，让大模型能同时处理更长的对话和更多的请求。

## 核心要点

- **KV Cache 是大模型生成文本时的‘上下文备忘录’**，保存每个 token 对应的 Key 和 Value，避免重复计算
- **长上下文 = 大显存**：128K 上下文、批量请求时，KV Cache 可能占几十 GB 显存
- **2026 标配**：GQA + FP8 量化是默认配置，MLA 模型可进一步压缩
- **压缩路线**：量化、低秩近似、稀疏/滑动窗口、GQA、MLA、前缀缓存

## 为什么需要压缩？

| 场景 | KV Cache 大小 (70B 模型) | 问题 |
|------|:---------------------:|------|
| 4K 上下文, 单请求 | ~2 GB | 可接受 |
| 32K 上下文, 单请求 | ~16 GB | 显存紧张 |
| 128K 上下文, 单请求 | ~64 GB | 几乎占满 A100 |
| 1M 上下文, 单请求 | ~135 GB | 超出单卡 |
| 32K × 64 并发 | ~1 TB | 不可能 |

## 主流压缩方法

| 方法 | 大白话 | 压缩比 | 精度影响 | 代表工作 |
|------|--------|:------:|:------:|----------|
| **FP8 量化** | 16位→8位 | 2× | 极小 | vLLM, TRT-LLM |
| **INT4 量化** | 16位→4位 | 4× | 小 | KV-Int4, KIVI |
| **GQA** | 多组 Q 共享 KV | 4-8× | <0.5pt | Llama 3, Qwen2.5 |
| **MLA** | 低秩压缩 KV | 7-28× | <0.2pt | DeepSeek-V3 |
| **SWA** | 只保留最近 N 个 | 恒定 | 丢失长程 | Mistral 7B |
| **前缀缓存** | 相同前缀只存一份 | 场景相关 | 无损 | vLLM, SGLang |
| **Token 稀疏** | 丢弃不重要 token | 2-10× | 中 | H2O, SnapKV |

## 压缩效果量化 (70B 模型, 1M 上下文)

| 组合方案 | KV Cache 大小 | 总压缩比 | 精度影响 |
|----------|:----------:|:------:|:------:|
| MHA + FP16 (基线) | 135 GB | 1× | 无 |
| GQA + FP16 | 34 GB | 4× | <0.5pt |
| GQA + FP8 | 17 GB | 8× | <0.5pt |
| GQA + INT4 | 8.5 GB | 16× | ~1pt |
| MLA + FP8 | 8 GB | 17× | <0.2pt |
| MLA + FP8 + INT4 | 4 GB | **34×** | <0.5pt |

## 量化 vs 低秩 vs 注意力结构改造

```
量化：把每个数字的精度变低（如 16 位 → 8 位）
  └─ 优势: 无需重训，推理时直接应用
  └─ 劣势: 极低精度时精度损失明显

低秩：把矩阵变小（如 1000×1000 → 1000×64 + 64×1000）
  └─ 优势: 压缩比大，精度损失小
  └─ 劣势: 需要训练时支持

GQA/MLA：直接减少需要保存的 KV 数量
  └─ 优势: 架构级优化，效果显著
  └─ 劣势: 训练时确定，推理时无法更改
```

## 推理引擎支持

| 引擎 | KV FP8 | KV INT4 | GQA | MLA | 前缀缓存 |
|------|:-----:|:------:|:---:|:---:|:------:|
| **vLLM** | ✅ | ✅ | ✅ | ✅ | ✅ APC |
| **SGLang** | ✅ | ✅ | ✅ | ✅ | ✅ Radix |
| **TensorRT-LLM** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **LMDeploy** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **llama.cpp** | ❌ | ✅ | ✅ | ❌ | ❌ |

## 生产场景与最佳实践

| 场景 | 推荐方案 | 说明 |
|------|----------|------|
| 长文档问答 (100K+) | GQA + FP8 | 必须压缩才能跑起来 |
| 多轮客服对话 | 前缀缓存 + FP8 | 支持更多并发 |
| 端侧部署 | GQA + INT4 | 显存极小，必须极致压缩 |
| Agent 工作流 | 前缀缓存 + GQA | 反复命中相同前缀 |
| 高并发 API | GQA + FP8 + 前缀缓存 | 最大化并发容量 |

## 生产最佳实践

1. **默认启用 FP8 KV Cache**：H100/H800 上几乎无精度损失，显存减半
2. **长上下文用 INT4**：128K+ 场景下 INT4 是必要手段
3. **模型选型优先 GQA/MLA**：架构级压缩效果远超后处理量化
4. **前缀缓存零成本**：无精度损失，只需保持前缀稳定
5. **监控 KV Cache 使用率**：超过 90% 时考虑降低并发或增加压缩
6. **MLA + FP8 是最优组合**：DeepSeek-V3 模型上 17× 压缩且精度损失极小

## 开放问题

- 极低精度量化（INT4 以下）对长上下文 recall 的影响仍需评估
- MLA + INT4 的组合在更多模型上的验证
- 压缩后的 KV Cache 与 speculative decoding 的协同优化
- Token 稀疏化方法（H2O/SnapKV）在生产中的稳定性

## Related

- [[概念/Inference/kv-cache]] — KV Cache 技术详解
- [[概念/LLM/grouped-query-attention]] — 分组查询注意力（GQA）
- [[概念/LLM/multi-head-latent-attention]] — Multi-head Latent Attention (MLA)
- [[概念/Inference/quantization]] — 模型量化
- [[概念/LLM/attention-variants]] — 注意力变体
- [[10_部署推理/03_推理优化/05_KV_Cache_深入分析]] — KV Cache 深度研究
- [[10_部署推理/03_推理优化/24_长上下文_推理_2026]] — 长上下文推理 2026

## 2026 KV Cache 压缩技术全景

| 技术 | 压缩比 | 原理 | 质量影响 | 状态 |
|------|:------:|------|:--------:|:----:|
| **GQA** | 4-8x | 共享 KV 头 | 极小 | GA |
| **MQA** | 8-16x | 单 KV 头 | 小 | GA |
| **MLA** | 10-20x | 低秩分解 | 极小 | GA |
| **FP8 KV** | 2x | 精度降低 | 极小 | GA |
| **INT4 KV** | 4x | 量化 | 小 | GA |
| **H2O** | 5-10x | Token 稀疏化 | 中 | 研究 |
| **SnapKV** | 5-10x | 智能驱逐 | 小 | 研究 |
| **StreamingLLM** | ∞ | 滑动窗口 | 中 | GA |

## 压缩技术对比

| 维度 | 架构级 (GQA/MLA) | 量化级 (FP8/INT4) | 稀疏级 (H2O) |
|------|:--------------:|:--------------:|:------------:|
| 压缩比 | 4-20x | 2-4x | 5-10x |
| 质量损失 | 极小 | 小 | 中 |
| 实现复杂度 | 高 (训练时) | 低 (推理时) | 中 |
| 硬件要求 | 无 | H100+ (FP8) | 无 |
| 生产就绪 | ✅ | ✅ | ⚠️ |

## 生产配置示例

```python
# vLLM 中启用 KV Cache 优化
from vllm import LLM

llm = LLM(
    model="deepseek-ai/DeepSeek-V3",  # 原生 MLA
    dtype="float8",                    # FP8 精度
    kv_cache_dtype="fp8",             # KV Cache FP8
    max_model_len=128000,              # 128K 上下文
    gpu_memory_utilization=0.90,
)
```

## 生产最佳实践

1. **架构级优先**: 选择原生 GQA/MLA 模型，压缩效果最佳
2. **FP8 KV Cache**: H100+ 必开，显存减半且质量保留 >99%
3. **长上下文必用**: >32K 上下文时 KV Cache 压缩是必须的
4. **监控显存**: 跟踪 KV Cache 占用，避免 OOM
5. **与推测解码协同**: 压缩后的 KV Cache 与 speculative decoding 可叠加优化
6. **Token 稀疏化谨慎**: H2O/SnapKV 在生产中稳定性待验证

## 显存计算示例

```
模型: Llama-4-70B (GQA, 8 KV heads)
上下文: 128K tokens
精度: FP16

KV Cache 显存 = 2 × n_layers × n_kv_heads × head_dim × seq_len × bytes
           = 2 × 80 × 8 × 128 × 128000 × 2 bytes
           = ~42 GB (FP16)
           = ~21 GB (FP8)  ← 压缩 2x

对比 MLA (DeepSeek-V3):
           = ~4 GB (MLA 压缩后)  ← 压缩 10x+
```
