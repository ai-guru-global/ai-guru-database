---
title: Flash Attention 算子 (FlashMLA/FlashInfer)
category: -concepts
tags: [inference, attention, kernel, flashmla, flashinfer, gpu]
relationships:
  - target: "_concepts/multi-head-latent-attention"
    type: implements
  - target: "_concepts/kv-cache"
    type: optimizes
  - target: "部署推理/Inference_Performance/Flash_Kernels_Deep_Dive"
    type: deepened_by
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
  - 部署推理/Inference_Performance/Flash_Kernels_Deep_Dive.md
summary: FlashAttention、FlashDecoding、FlashInfer、FlashMLA 等内核通过分块计算、online softmax 和 kernel 融合，把 attention 的显存访问降到接近理论下限，是现代 LLM 推理的算子基座。
provenance:
  extracted: 0.9
  inferred: 0.05
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03 00:00:00+00:00
updated: 2026-06-03 00:00:00+00:00
aliases:
  - "Flash Attention Kernels"
  - "flash attention kernels"

---
# Flash Attention 算子 (FlashMLA/FlashInfer)

## 核心要点

- **FlashMLA**：DeepSeek 开源，专为 MLA 架构优化的注意力算子库，H800 峰值 660 TFLOPS
- **FlashInfer**：NVIDIA 主导，通用注意力引擎，支持 MHA/GQA/MQA/MLA/SWA 全部变体，MLSys 2025 最佳论文
- **互补关系**：FlashMLA 专精 DeepSeek 系列，FlashInfer 覆盖所有模型，推理引擎按模型自动选择

## 详细内容

### FlashMLA 算子库

FlashMLA（[GitHub](https://github.com/deepseek-ai/FlashMLA)）为 DeepSeek V3/V3.2 提供全链路注意力优化内核。

| 算子 | 阶段 | GPU | 性能峰值 |
|------|------|-----|---------|
| Dense MLA Decode | Decode | SM90 (H800) | 3000 GB/s, 660 TFLOPS |
| Sparse MLA Decode | Decode | SM90+SM100 | 410 TFLOPS (H800) |
| Dense MHA Prefill | Prefill | SM100 (B200) | 1460 TFLOPS fwd |
| Sparse MLA Prefill | Prefill | SM90+SM100 | 640 TFLOPS (H800), 1450 TFLOPS (B200) |

**FP8 KV Cache 格式**（每 token 656 bytes）：
- 512B 量化的 NoPE 部分 (512 × float8_e4m3)
- 16B 缩放因子 (4 × float32)
- 128B RoPE 部分 (64 × bfloat16, 不量化)

**国产芯片适配**：海光 DCU、摩尔线程、沐曦、燧原、天数智芯、AMD Instinct 均已移植。

### FlashInfer 引擎

FlashInfer（[GitHub](https://github.com/flashinfer-ai/flashinfer)）是面向 LLM Serving 的可定制注意力引擎。

| 特性 | 说明 |
|------|------|
| **Block-Sparse KV** | 兼容 vLLM PagedAttention 和 SGLang RadixAttention |
| **多架构支持** | MHA/GQA/MQA/MLA/SWA 统一 API |
| **三阶段优化** | Prefill（计算密集）/ Decode（带宽密集）/ Append（融合执行） |
| **多硬件** | NVIDIA SM80-SM100、AMD、Intel |

### FlashAttention 系列演进

| 版本 | 发布 | 关键改进 |
|------|------|---------|
| **FlashAttention-1** | 2022 | Tiling + Online Softmax，2-4× 加速 |
| **FlashAttention-2** | 2023 | 优化 Warp 分配，H100 达 72% MFU |
| **FlashAttention-3** | 2024 | Hopper 专用优化，异步 WGMMA + TMA |
| **FlashMLA** | 2025 | MLA 架构专用，FP8 KV Cache 支持 |
| **FlashInfer** | 2025 | 通用引擎，多架构统一，MLSys 最佳论文 |

## Related

- [[_concepts/multi-head-latent-attention]] — MLA 架构（FlashMLA 的优化目标）
- [[_concepts/kv-cache]] — KV Cache
- [[_concepts/attention-variants]] — GQA/MQA/SWA 注意力变体
- [[部署推理/Inference_Performance/Flash_Kernels_Deep_Dive|Flash 系列 Kernel 深潜]]
- [[架构基建/AI_Stack_Deep_Dive]] — 阿里云 AI Stack
