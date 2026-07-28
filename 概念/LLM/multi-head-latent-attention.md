---
title: Multi-head Latent Attention (MLA)
category: -concepts
tags:
- attention
- kv-cache
- deepseek
- inference-optimization
- mlA
relationships:
- target: '概念/transformer-architecture'
  type: extends
- target: '概念/model-deployment'
  type: enables
- target: '概念/long-context-models'
  type: enables
- target: '10_部署推理/04_Inference_Performance/Inference_Terms_for_dummy'
  type: simplified_by
sources:
- 12_架构基建/AI_Stack_Deep_Dive.md
- 10_部署推理/02_Inference_Engines/vLLM_Deep_Dive.md
- 10_部署推理/04_Inference_Performance/Inference_Terms_for_dummy.md
summary: Multi-head Latent Attention (MLA) 是 DeepSeek 提出的注意力压缩架构，通过低秩 KV 联合压缩将 KV Cache 显存降低 7-28×，是 DeepSeek V2/V3/R1 经济化部署 128K-1M 上下文的核心技术。FlashMLA 算子库在 H800 上达到 660 TFLOPS 峰值性能。
provenance:
  extracted: 0.9
  inferred: 0.05
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: core
created: 2026-06-03
updated: 2026-07-21 00:00:00+00:00
aliases:
  - "Multi Head Latent Attention"
  - "multi head latent attention"

name_zh: "多头潜在注意力"
---
# Multi-head Latent Attention (MLA)

> 中文简称：多头潜在注意力

## 大白话

想象 LLM 推理时要记住前面说过的所有话。

- **标准 MHA**：32 个人各记各的完整笔记，笔记很厚。
- **GQA**：32 个人分成 8 组，每组共用一份笔记。
- **MQA**：32 个人共用一份笔记。
- **MLA**：不直接记笔记，而是记一个“压缩摘要”，用的时候再展开，最薄。

KV Cache 越小，decode 阶段读得越快，TPOT 越低。

## 核心要点

- **MLA 是 DeepSeek 对注意力架构的核心贡献**：通过低秩 KV 联合压缩，将 KV Cache 显存占用降低 7-28×，且质量退化 <0.2 pt
- **经济化长上下文的关键**：DeepSeek V2/V3/R1/V4 系列能部署 1M 上下文的核心原因——MLA + FP8 叠加后 1M 上下文 KV Cache 仅 8GB
- **FlashMLA 算子库**是 MLA 的工程落地：H800 上 Dense Decode 达 660 TFLOPS，Sparse Prefill 达 1450 TFLOPS (B200)
- **已被国产芯片广泛移植**：海光 DCU、摩尔线程、沐曦、燧原、天数智芯、AMD Instinct 均有适配

## 详细内容

### 问题背景：KV Cache 显存墙

标准 Multi-Head Attention (MHA) 的 KV Cache 随上下文长度线性增长。以 DeepSeek-V3 为例（61 层、7168 维嵌入、128K 上下文）：

```
KV Cache = 128K tokens × 61 layers × 2 vectors × 7168 values × 2 bytes ≈ 213.5 GB
```

这超过了模型参数本身的大小，成为长上下文推理的首要瓶颈。

### 注意力架构演进

| 架构 | 压缩比 | 质量退化 | 代表模型 | 年代 |
|------|--------|----------|----------|------|
| **MHA** (Multi-Head) | 1× 基线 | 无 | GPT-4, 早期 LLaMA | 2017- |
| **MQA** (Multi-Query) | ~32× | -1~3 pts | Falcon-40B | 2019 |
| **GQA** (Grouped-Query) | 4-8× | <0.5 pt | Llama 3.x, Qwen 2.x | 2023 |
| **MLA** (Multi-head Latent) | **7-28×** | **<0.2 pt** | DeepSeek V2/V3/R1 | 2024 |
| **SWA** (Sliding-Window) | 恒定 | 丢失长程 | Mistral 7B | 2023 |

### MLA 技术原理

MLA 的核心是**低秩 KV 联合压缩**（Low-Rank Joint KV Compression）：

```
标准 MHA：  x → W_k → Key (d=7168),  x → W_v → Value (d=7168)   → 缓存完整 K、V
MLA：       x → W_dkv → c_latent (d=512)                          → 仅缓存压缩向量
                     ↓
            c_latent → W_uk → Key (按需重建)
            c_latent → W_uv → Value (按需重建)
```

**关键设计要素**：

1. **共享降维矩阵** `W_dkv`：Key 和 Value 共用同一个压缩矩阵，将 7168 维压缩到 512 维
2. **独立升维矩阵** `W_uk`、`W_uv`：推理时按需从 latent 重建完整 K、V
3. **RoPE 解耦**：位置编码部分不做压缩，单独存储 64 维 BF16（128 bytes/token），保证位置信息精度

**DeepSeek-V3 实际存储对比**：

| 方案 | 每 token 每层 | 128K 上下文总 KV Cache | 压缩比 |
|------|-------------|----------------------|--------|
| MHA (FP16) | 28.7 KB | 213.5 GB | 1× |
| MLA (FP16 latent) | 1.0 KB | 7.6 GB | **28×** |
| MLA + FP8 | 656 bytes | ~3.8 GB | **56×** |

### FlashMLA 算子库

FlashMLA 是 DeepSeek 开源的 MLA 专用推理算子（[GitHub](https://github.com/deepseek-ai/FlashMLA)），为 MLA 架构提供全链路优化内核。

**算子矩阵**：

| 算子 | 阶段 | GPU | KV 格式 | 性能峰值 |
|------|------|-----|---------|----------|
| Dense MLA Decode | Decode | SM90 (H800) | BF16 | 3000 GB/s, 660 TFLOPS |
| Sparse MLA Decode | Decode | SM90+SM100 | FP8 | 410 TFLOPS (H800) |
| Dense MHA Prefill | Prefill | SM100 (B200) | BF16 | 1460 TFLOPS fwd |
| Sparse MLA Prefill | Prefill | SM90+SM100 | BF16 | 640 TFLOPS (H800), 1450 TFLOPS (B200) |

**FP8 KV Cache 格式**（每 token 656 bytes）：
- 前 512 bytes：量化的 NoPE 部分（512 × float8_e4m3）
- 中 16 bytes：缩放因子（4 × float32）
- 末 128 bytes：RoPE 部分（64 × bfloat16，不量化）

**国产芯片移植**：

| 芯片 | 项目 |
|------|------|
| 海光 DCU | OpenDAS/MLAttention |
| 摩尔线程 | MooreThreads/MT-flashMLA |
| 沐曦 MetaX | MetaX-MACA/FlashMLA |
| 燧原 | Intellifusion/tyllm |
| 天数智芯 | Deep-Spark/FlashMLA |
| AMD Instinct | AITER/MLA |

### MLA 与其他优化的叠加效应

MLA 的压缩效果可与 FP8 量化、前缀缓存等技术叠加：

| 优化组合 | 1M 上下文 KV Cache (70B 级) | 总压缩比 |
|----------|---------------------------|----------|
| MHA + FP16（基线） | 135 GB | 1× |
| GQA + FP8 | 17 GB | 8× |
| MLA + FP8 | 8 GB | 17× |
| MLA + FP8 + Prefix Cache (命中) | ~1-2 GB 有效计算 | 70-135× |

> **核心认知**：MLA 是架构层面的 KV 压缩，与其他运行时优化正交叠加。这是 DeepSeek 推理服务商能在相同硬件上提供更低 per-token 价格的根本原因。

### MLA 的局限与挑战

1. **重建计算开销**：每个新 token 需要从 latent 重建 K、V，增加计算量（但矩阵维度从 7168 降到 512，总体计算量反而减少）
2. **生态封闭**：截至 2026 Q2，仅 DeepSeek 系列使用 MLA，竞品仍用 GQA
3. **训练成本**：MLA 的压缩-重建结构增加了训练复杂性
4. **硬件适配**：FlashMLA 算子需 SM90+ (Hopper/Blackwell) 或适配的国产芯片

## 开放问题

- MLA 是否会成为 2026-2027 年的行业标准架构？竞品是否会跟进？
- DeepSeek V4 的 CSA (Compressed Sparse Attention) + HCA 是否会替代 MLA？
- Mamba-SSM 混合架构是否能在 12 个月内实现 sub-1GB KV Cache at 1M context？

## 来源

- DeepSeek-V3 Technical Report, arXiv:2412.19437
- FlashMLA GitHub: https://github.com/deepseek-ai/FlashMLA
- "Towards Economical Inference: Enabling DeepSeek's Multi-Head Latent Attention", ACL 2025
- Chris McCormick, "The Inner Workings of DeepSeek-V3", 2025

## Related

- [[概念/transformer-architecture]] — Transformer 架构（注意力机制基础）
- [[概念/long-context-models]] — 长上下文模型
- [[概念/model-deployment]] — 模型部署（KV Cache/PagedAttention）
- [[概念/llm-infrastructure]] — LLM 基础设施
- [[概念/grouped-query-attention]] — GQA（Grouped-Query Attention）
- [[10_部署推理/04_Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话解释]]
- [[12_架构基建/AI_Stack_Deep_Dive]] — 阿里云 AI Stack（含 MLA 通用技术背景）

---

## 2026 MLA 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **DeepSeek-V3 MLA** | 低秩 KV 压缩，KV Cache 减少 7-28x | GA |
| **FlashMLA** | H800 专用 MLA 算子，660 TFLOPS | GA |
| **vLLM MLA 支持** | vLLM 原生支持 MLA 推理 | GA |
| **SGLang MLA** | SGLang 支持 MLA 加速 | GA |
| **MLA + 长上下文** | MLA 支持 128K-1M 上下文 | GA |

## 生产最佳实践

1. **DeepSeek 模型必用**：部署 DeepSeek-V3/R1 必须启用 MLA
2. **KV Cache 优化**：MLA 将 KV Cache 减少 7-28x，长上下文必备
3. **FlashMLA 加速**：H800 环境启用 FlashMLA，性能提升显著
4. **与 GQA 对比**：MLA 比 GQA 压缩更激进，适合超长上下文
5. **推理框架选择**：用 vLLM/SGLang 等支持 MLA 的框架
6. **显存监控**：MLA 显著降低显存，可支持更长上下文或更大批次
7. **质量验证**：MLA 有轻微质量损失，生产前验证可接受

## 延伸阅读

- [[概念/LLM/grouped-query-attention|GQA]]
- [[概念/Inference/kv-cache|KV Cache]]
- [[概念/LLM/kv-cache-compression|KV Cache 压缩]]
- [[05_大模型/15_Chinese_LLM_Ecosystem/DeepSeek_Deep_Dive|DeepSeek 深度解析]]
