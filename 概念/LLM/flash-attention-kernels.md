---
title: Flash Attention 算子 (FlashMLA/FlashInfer)
category: -concepts
tags: [inference, attention, kernel, flashmla, flashinfer, gpu, cuda, flash-attention]
relationships:
  - target: "概念/LLM/multi-head-latent-attention"
    type: implements
  - target: "概念/Inference/kv-cache"
    type: optimizes
  - target: "概念/Inference/flashinfer"
    type: related_to
  - target: "概念/LLM/grouped-query-attention"
    type: supports
sources:
  - 12_架构基建/AI_Stack_Deep_Dive.md
  - 10_部署推理/03_推理优化/Flash_Kernels_Deep_Dive.md
  - "https://arxiv.org/abs/2205.14135"  # FlashAttention-1
  - "https://arxiv.org/abs/2407.08608"  # FlashAttention-3
summary: FlashAttention、FlashDecoding、FlashInfer、FlashMLA 等内核通过分块计算 (Tiling)、Online Softmax 和 Kernel 融合，把 attention 的显存访问降到接近理论下限。是现代 LLM 推理的算子基座，支撑从训练到服务的全链路加速。
provenance:
  extracted: 0.9
  inferred: 0.05
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
lifecycle_changed: 2026-06-03
tier: core
created: 2026-06-03
updated: 2026-07-21
aliases:
  - "Flash Attention Kernels"
  - "flash attention kernels"
  - "Flash 算子"

name_zh: "Flash Attention 算子"
---
# Flash Attention 算子 (FlashMLA/FlashInfer)

> 中文简称：Flash Attention 算子

> 通过 Tiling + Online Softmax + Kernel Fusion 把 attention 显存访问降到理论下限——现代 LLM 推理的算子基座。

## 核心要点

- **FlashMLA**：DeepSeek 开源，专为 MLA 架构优化，H800 峰值 660 TFLOPS
- **FlashInfer**：港大/SGLang 团队，通用注意力引擎，MLSys 2025 Best Paper
- **FlashAttention 1/2/3**：Stanford Tri Dao，通用注意力加速的开创者
- **互补关系**：FlashMLA 专精 DeepSeek，FlashInfer 覆盖所有模型，推理引擎按模型自动选择

## 核心原理: Tiling + Online Softmax

```
标准 Attention:
Q × K^T → Softmax → × V
显存: O(N²) ← 必须存储完整注意力矩阵

Flash Attention (Tiling):
┌─────────────────────────────────┐
│ 将 Q/K/V 分成小块 (Block)       │
│ 每次只加载一小块到 SRAM        │
│ 在 SRAM 中完成 Q×K^T + Softmax  │
│ 用 Online Softmax 增量更新     │
│ 永远不存储完整 N×N 矩阵       │
└─────────────────────────────────┘
显存: O(N) ← 线性！
速度: 2-4× 加速 (减少 HBM 访问)
```

## FlashMLA 算子库

FlashMLA（[GitHub](https://github.com/deepseek-ai/FlashMLA)）为 DeepSeek V3/V3.2 提供全链路注意力优化内核。

| 算子 | 阶段 | GPU | 性能峰值 |
|------|------|-----|--------|
| Dense MLA Decode | Decode | SM90 (H800) | 3000 GB/s, 660 TFLOPS |
| Sparse MLA Decode | Decode | SM90+SM100 | 410 TFLOPS (H800) |
| Dense MHA Prefill | Prefill | SM100 (B200) | 1460 TFLOPS fwd |
| Sparse MLA Prefill | Prefill | SM90+SM100 | 640 TFLOPS (H800), 1450 TFLOPS (B200) |

**FP8 KV Cache 格式**（每 token 656 bytes）：
- 512B 量化的 NoPE 部分 (512 × float8_e4m3)
- 16B 缩放因子 (4 × float32)
- 128B RoPE 部分 (64 × bfloat16, 不量化)

**国产芯片适配**：海光 DCU、摩尔线程、沐曦、燧原、天数智芯、AMD Instinct 均已移植。

## FlashInfer 引擎

FlashInfer（[GitHub](https://github.com/flashinfer-ai/flashinfer)）是面向 LLM Serving 的可定制注意力引擎。

| 特性 | 说明 |
|------|------|
| **Block-Sparse KV** | 兼容 vLLM PagedAttention 和 SGLang RadixAttention |
| **多架构支持** | MHA/GQA/MQA/MLA/SWA 统一 API |
| **三阶段优化** | Prefill（计算密集）/ Decode（带宽密集）/ Append（融合执行） |
| **多硬件** | NVIDIA SM80-SM100、AMD、Intel |
| **Cascade Attention** | 多级前缀共享，多轮对话节省 40-60% |

## FlashAttention 系列演进

| 版本 | 发布 | 关键改进 | 性能 |
|------|:----:|---------|------|
| **FlashAttention-1** | 2022 | Tiling + Online Softmax | 2-4× 加速 |
| **FlashAttention-2** | 2023 | 优化 Warp 分配，减少 non-matmul | H100 72% MFU |
| **FlashAttention-3** | 2024 | Hopper 专用: 异步 WGMMA + TMA | H100 740 TFLOPS |
| **FlashMLA** | 2025 | MLA 架构专用，FP8 KV Cache | H800 660 TFLOPS |
| **FlashInfer** | 2025 | 通用引擎，多架构统一 | MLSys Best Paper |

## 算子选型决策

```
模型架构判断:
├─ DeepSeek-V3/V3.2 (MLA)？ → FlashMLA
├─ SGLang 服务？ → FlashInfer (默认)
├─ vLLM 服务？ → FlashInfer (可选) / 自研 PagedAttention
├─ 训练？ → FlashAttention-2/3
└─ 其他推理？ → FlashAttention-2 (通用)
```

## 性能对比 (H100 80GB)

| 算子 | Prefill (4K tokens) | Decode (batch=64) | 显存占用 |
|------|:------------------:|:-----------------:|:------:|
| 标准 Attention | 120 TFLOPS | 45 GB/s | O(N²) |
| FlashAttention-2 | 580 TFLOPS | - | O(N) |
| FlashAttention-3 | 740 TFLOPS | - | O(N) |
| FlashInfer | 620 TFLOPS | 2800 GB/s | O(N) |
| FlashMLA | - | 3000 GB/s | O(N) |

## 生产最佳实践

1. **无需手动配置**：现代推理引擎自动选择最优算子
2. **确保 GPU 架构匹配**：FlashAttention-3 仅支持 Hopper (SM90+)
3. **FP8 KV Cache**：H100/B200 上启用 FP8 可提升 30%+ 吞吐
4. **训练用 FlashAttention-2/3**：显存从 O(N²) 降至 O(N)，支持更长序列
5. **关注国产芯片移植**：FlashMLA 已支持海光/摩尔线程等

## Related

- [[概念/LLM/multi-head-latent-attention]] — MLA 架构（FlashMLA 的优化目标）
- [[概念/Inference/kv-cache]] — KV Cache
- [[概念/LLM/attention-variants]] — GQA/MQA/SWA 注意力变体
- [[概念/Inference/flashinfer]] — FlashInfer 算子库
- [[10_部署推理/03_推理优化/17_Flash_Kernels_深入分析|Flash 系列 Kernel 深 潜]]
- [[12_架构基建/03_AI技术栈/02_AI技术栈_深入分析]] — AI Stack 深度解析

## 2026 Flash Attention 生态

| 版本/变体 | 特点 | 适用 | 状态 |
|---------|------|------|:----:|
| **FlashAttention-2** | 标准优化，广泛支持 | 通用 | GA |
| **FlashAttention-3** | H100 异步优化，FP8 | H100+ | GA |
| **FlashMLA** | MLA 专用，DeepSeek 优化 | MLA 架构 | GA |
| **FlashInfer** | 统一算子库，多后端 | 推理引擎 | GA |
| **FlashDecoding** | 解码阶段优化 | 推理 | GA |
| **PagedAttention** | 分页 KV Cache | vLLM | GA |

## 性能对比

| Kernel | 序列长度 | 速度 (vs 标准) | 显存 | 适用 |
|--------|:--------:|:------------:|:----:|------|
| 标准 Attention | 2K | 1.0x | O(L²) | 基线 |
| FlashAttention-2 | 2K | 2-3x | O(L) | 通用 |
| FlashAttention-2 | 64K | 5-8x | O(L) | 长序列 |
| FlashAttention-3 | 64K | 6-10x | O(L) | H100 |
| FlashMLA | 128K | 8-12x | O(1) | MLA |

## 工作原理简化

```
标准 Attention:
  Q×K^T → Softmax → ×V
  └─ 显存 O(L²)，慢

Flash Attention:
  分块计算 (Tiling)
  ├─ 块1: Q1×K1^T → Softmax → ×V1
  ├─ 块2: Q2×K2^T → Softmax → ×V2
  └─ 合并结果
  └─ 显存 O(L)，快 (IO-aware)
```

## 配置示例

```python
# HuggingFace Transformers 中启用 Flash Attention
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-4-8B",
    torch_dtype=torch.float16,
    attn_implementation="flash_attention_2",  # 启用 FA2
).cuda()

# vLLM 中自动使用 Flash Attention
from vllm import LLM
llm = LLM(model="meta-llama/Llama-4-8B")  # 自动启用
```

## 生产最佳实践

1. **默认启用**: 所有生产环境必须启用 Flash Attention
2. **H100 用 FA3**: H100+ GPU 使用 FlashAttention-3，支持 FP8
3. **MLA 用 FlashMLA**: DeepSeek-V3 等 MLA 架构用 FlashMLA
4. **长序列必用**: >4K 序列时 Flash Attention 优势明显
5. **关注国产芯片移植**: FlashMLA 已支持海光/摩尔线程等
6. **与量化结合**: FP8 + FlashAttention-3 叠加优化
