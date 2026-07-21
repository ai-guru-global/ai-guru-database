--
title: FLOPS
category: -concepts
tags: [hardware, gpu, flops, performance, inference, compute-bound, memory-bound]
relationships:
  - target: "概念/ai-hardware"
    type: builds_on
  - target: "概念/prefill-decode"
    type: related_to
  - target: "部署推理/Inference_Performance/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 部署推理/Inference_Performance/Inference_Terms_for_dummy.md
summary: FLOPS 衡量 GPU 每秒能执行多少次浮点运算，是 prefill 阶段算力瓶颈的关键指标，但高 FLOPS 不直接等于推理快，还受显存带宽和数据搬运限制。
lifecycle: reviewed
tier: core
created: 2026-06-15
updated: 2026-07-21
aliases:
  - Flops
  - "每秒浮点运算次数"
  - "TFLOPS"

---
# FLOPS（每秒浮点运算次数）

> **一句话理解**: FLOPS = GPU 每秒能做多少次数学运算。Prefill 吃 FLOPS，Decode 吃带宽——两个阶段瓶颈完全不同。

## 定义

FLOPS（Floating Point Operations Per Second）衡量处理器每秒执行的浮点运算次数。AI 领域常用 TFLOPS（10¹²）或 PFLOPS（10¹⁵）表示。

## 精度与算力关系

| 精度 | 位宽 | H100 峰值 | 典型用途 |
|------|------|-----------|----------|
| **FP64** | 64-bit | 34 TFLOPS | 科学计算 |
| **FP32** | 32-bit | 67 TFLOPS | 传统训练 |
| **TF32** | 19-bit | 989 TFLOPS | 混合精度训练 |
| **FP16/BF16** | 16-bit | 1979 TFLOPS | 主流训练/推理 |
| **FP8 (E4M3)** | 8-bit | 3958 TFLOPS | H100 推理加速 |
| **INT8** | 8-bit | 3958 TOPS | 量化推理 |
| **INT4** | 4-bit | 7916 TOPS | 极致量化 |

> 规律：位宽减半 → 峰值翻倍。这就是为什么 FP8/INT4 量化能显著提速。

## 2026 年主流 GPU 算力对比

| GPU | FP16 | FP8 | 显存带宽 | 定位 |
|-----|------|-----|----------|------|
| **H100 SXM** | 1979 TF | 3958 TF | 3.35 TB/s | 训练+推理 |
| **H200** | 1979 TF | 3958 TF | 4.8 TB/s | 推理优化 |
| **B200** | 4500 TF | 9000 TF | 8 TB/s | 下一代旗舰 |
| **A100** | 312 TF | — | 2.0 TB/s | 上代主力 |
| **昇腾 910B** | 400 TF | — | 1.6 TB/s | 国产替代 |

## Compute-Bound vs Memory-Bound

```
算术强度 = FLOPs / Bytes Accessed

算术强度高 → Compute-Bound（吃 FLOPS）
算术强度低 → Memory-Bound（吃带宽）
```

| 推理阶段 | 瓶颈类型 | 关键指标 | 优化方向 |
|----------|----------|----------|----------|
| **Prefill** | Compute-Bound | FLOPS | 更大算力、FP8 |
| **Decode** | Memory-Bound | 显存带宽 | HBM、量化减搬运 |
| **大 Batch Decode** | 趋向 Compute | FLOPS + 带宽 | Continuous Batching |

## 实际利用率（MFU）

峰值 FLOPS 是理论上限，实际利用率（Model FLOPS Utilization）通常：

| 场景 | MFU |
|------|-----|
| 大模型预训练（优化良好） | 50-60% |
| 推理 Prefill | 60-80% |
| 推理 Decode（小 batch） | 5-15% |
| 推理 Decode（大 batch） | 30-50% |

> Decode 阶段 MFU 极低是因为每次只算 1 token，矩阵太小，GPU 大量时间等数据。

## 生产最佳实践

1. **Prefill 慢 → 升算力**：换 H100/B200 或启用 FP8
2. **Decode 慢 → 升带宽**：选 HBM3e（H200）或量化减少搬运
3. **不要只看 FLOPS 选卡**：带宽、显存容量、互联同样关键
4. **监控 MFU**：`nvidia-smi` + profiler 确认实际利用率
5. **Batch 越大越吃 FLOPS**：Continuous Batching 提升算术强度

## Related

- [[概念/ai-hardware]] — AI 硬件
- [[概念/prefill-decode]] — Prefill / Decode 阶段
- [[概念/GPU/expert-parallelism|Expert Parallelism]] — 并行效率度量
- [[概念/Inference/ttft|TTFT]] — Prefill 速度直接影响首 token 延迟
- [[部署推理/Inference_Performance/Inference_Terms_for_dummy|推理性能术语大白话解释]]
