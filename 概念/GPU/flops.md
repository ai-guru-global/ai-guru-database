---
title: FLOPS
category: -concepts
tags: [hardware, gpu, flops, performance, inference, compute-bound, memory-bound]
relationships:
  - target: "概念/ai-hardware"
    type: builds_on
  - target: "概念/prefill-decode"
    type: related_to
  - target: "10_部署推理/03_推理优化/Inference_Terms_for_dummy"
    type: simplified_by
sources:
  - 10_部署推理/03_推理优化/Inference_Terms_for_dummy.md
summary: FLOPS 衡量 GPU 每秒能执行多少次浮点运算，是 prefill 阶段算力瓶颈的关键指标，但高 FLOPS 不直接等于推理快，还受显存带宽和数据搬运限制。
lifecycle: reviewed
tier: core
created: 2026-06-15
updated: 2026-07-21
aliases:
  - Flops
  - "每秒浮点运算次数"
  - "TFLOPS"

name_zh: "每秒浮点运算次数"
---
# FLOPS（每秒浮点运算次数）

> 中文简称：每秒浮点运算次数

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
- [[10_部署推理/03_推理优化/Inference_Terms_for_dummy|推理性能术语大白话解释]]

## 2026 GPU FLOPS 对比

| GPU | FP16 FLOPS | FP8 FLOPS | 显存 |
|------|------|------|------|
| **B200** | 4.5 PFLOPS | 9 PFLOPS | 192GB |
| **H100 SXM** | 1.98 PFLOPS | 3.96 PFLOPS | 80GB |
| **A100** | 312 TFLOPS | - | 80GB |
| **MI300X** | 1.3 PFLOPS | 2.6 PFLOPS | 192GB |

## FLOPS 利用率

| 场景 | 典型利用率 | 优化方向 |
|------|------|------|
| **训练** | 40-60% | 通信优化 |
| **推理** | 20-40% | 批处理 |
| **小模型** | 10-20% | 模型合并 |

## 延伸阅读

- [[概念/GPU/gpu|GPU]] — GPU 基础
- [[概念/GPU/cudnn|cuDNN]] — 深度学习加速
- [[概念/Inference/inference-performance|推理性能]] — 推理优化

> ℹ️ FLOPS 是衡量 GPU 计算能力的指标，AI 训练和推理需要高 FLOPS。

## FLOPS 计算公式

```
理论 FLOPS = CUDA Cores × 2 × 时钟频率

示例: H100 SXM
    CUDA Cores: 16896
    时钟频率: 1.98 GHz
    FP32 FLOPS = 16896 × 2 × 1.98 GHz ≈ 67 TFLOPS
    FP16 FLOPS (Tensor Core) ≈ 1979 TFLOPS
```

## 实际 FLOPS 利用率

| 场景 | 理论 FLOPS | 实际 FLOPS | 利用率 |
|------|------|------|------|
| **训练 (优化)** | 1979 TFLOPS | ~800 TFLOPS | 40% |
| **训练 (一般)** | 1979 TFLOPS | ~400 TFLOPS | 20% |
| **推理** | 1979 TFLOPS | ~200 TFLOPS | 10% |

## 生产最佳实践

1. **混合精度**：用 FP16/BF16 提高 FLOPS
2. **Tensor Core**：用 Tensor Core 加速
3. **批处理**：增大批大小提高利用率
4. **通信优化**：减少通信开销
5. **监控利用率**：监控 FLOPS 利用率

## 检查清单

- [ ] 混合精度已配置
- [ ] Tensor Core 已启用
- [ ] 批大小已优化
- [ ] 利用率已监控

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 实际 FLOPS 远低于峰值 | 内存带宽瓶颈 | 优化数据布局，使用 Tensor Core |
| MFU 低于 30% | 通信开销大 | 减少并行度数，优化通信重叠 |
| 不同精度结果差异大 | 计算精度不同 | 统一报告精度（FP16/BF16/FP32） |
| 推理 FLOPS 低 | batch size 太小 | 增大 batch 提升吐吐量 |
| 利用率波动大 | 负载不均 | 检查数据加载和并行均衡性 |

## 延伸阅读

- [[概念/GPU/nvidia-gpu|NVIDIA GPU]] — GPU 硬件算力规格
- [[概念/GPU/cuda|CUDA]] — 计算平台
- [[概念/GPU/tensor-parallelism|张量并行]] — 并行计算策略
- [[概念/Training/distributed-training|分布式训练]] — 集群算力利用
- [[概念/GPU/cudnn|cuDNN]] — 算子加速库

> ℹ️ FLOPS 是衡量 AI 算力的核心指标，2026年单卡峰值已达 20 PFLOPS (FP4)，但实际 MFU 通常 40-60%，优化通信和内存访问是提升利用率的关键。

## 2026 主流 GPU 算力对比

| GPU | FP4 | FP8 | FP16 | FP32 | 显存 |
|------|------|------|------|------|------|
| B300 | 20 PFLOPS | 10 PFLOPS | 5 PFLOPS | 2.5 PFLOPS | 288GB |
| B200 | 18 PFLOPS | 9 PFLOPS | 4.5 PFLOPS | 2.2 PFLOPS | 192GB |
| H100 SXM | — | 4 PFLOPS | 2 PFLOPS | 1 PFLOPS | 80GB |
| A100 | — | — | 624 TFLOPS | 312 TFLOPS | 80GB |
| MI400 | — | 8 PFLOPS | 4 PFLOPS | 2 PFLOPS | 192GB |

## 检查清单

- [ ] 算力指标已明确（FP8/FP16/FP32）
- [ ] Tensor Core 已启用
- [ ] 批大小已优化
- [ ] MFU 已监控（目标 > 40%）
- [ ] 通信开销已评估
- [ ] 内存带宽已评估
- [ ] 利用率已持续跟踪

> ℹ️ 实际 MFU 是衡量集群效率的核心指标，2026年万卡集群 MFU 目标为 50%+。
