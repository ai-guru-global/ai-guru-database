# Quantized KV Cache

Quantized KV cache reduces the memory footprint of key-value cache storage by using lower-precision data types (FP8 or FP4) instead of the default model precision in BF16. During autoregressive generation, LLMs cache previously computed key-value pairs to avoid redundant calculations. The KV cache typically consumes a significant portion of GPU memory, especially for long sequences.

Quantized KV cache is a memory optimization technique that primarily benefits throughput by allowing more tokens to be cached, but may introduce minimal accuracy degradation depending on the quantization format used.

```{warning}
**Performance Warning**: When quantized KV cache must be dequantized before use in attention operations, performance can be extremely slow if dequantization is not fused with the attention kernel. Always verify that your chosen attention backend supports quantized KV cache. Backends without fused support may experience significant throughput degradation, potentially negating the memory benefits.

**Backend Support**: Not all attention backends support quantized KV cache. Refer to [Attention Backend](attention_backend.md) for which backends support it.
```

## Supported Formats

SGLang supports the following quantized KV cache formats:

### FP8 Format

[OCP (Open Compute Project)](https://www.opencompute.org) specifies two common 8-bit floating point formats:

- **E5M2** (5 exponent bits, 2 mantissa bits): Larger dynamic range (±57344.0), lower precision
- **E4M3** (4 exponent bits, 3 mantissa bits): Higher precision, smaller dynamic range (±240.0)

### FP4 Format

```{warning}
FP4 quantization is currently experimental.
```

[OCP (Open Compute Project)](https://www.opencompute.org) specifies MXFP4 (Microscaling FP4), a 4-bit floating-point format:

- **E2M1** (1 sign bit, 2 exponent bits, 1 mantissa bit): Uses block-based microscaling where tensors are divided into blocks of consecutive elements, with each block sharing a single 8-bit exponential scaling factor. While OCP specifies blocks of 32 elements, SGLang's current implementation uses blocks of 16 elements for KV cache quantization.

## Usage

### Enabling Quantized KV Cache

To enable quantized KV cache, use the `--kv-cache-dtype` argument when launching the server:

```bash
# Enable FP8 E5M2 KV cache
python3 -m sglang.launch_server \
    --model-path deepseek-ai/DeepSeek-R1-0528 \
    --kv-cache-dtype fp8_e5m2 \

# Enable FP8 E4M3 KV cache
python3 -m sglang.launch_server \
    --model-path deepseek-ai/DeepSeek-R1-0528 \
    --kv-cache-dtype fp8_e4m3 \

# Enable FP4 E2M1 KV cache
python3 -m sglang.launch_server \
    --model-path nvidia/DeepSeek-R1-0528-NVFP4 \
    --kv-cache-dtype fp4_e2m1 \
```

### Scaling Factors

FP8 quantization requires scaling factors to properly quantize and dequantize the KV cache.

```{note}
Currently, only per-tensor (scalar) scaling factors are supported.
```

Scaling factors can be:

- **Loaded from checkpoints**: Pre-quantized models (e.g., ModelOpt) may include `k_scale` and `v_scale` parameters that are automatically loaded
- **Provided via JSON**: Supply scaling factors via `--quantization-param-path`.

The JSON file should follow this format:

```json
{
  "kv_cache": {
    "dtype": "float8_e4m3fn",
    "scaling_factor": {
      "0": {
        "0": 1.0,
        "1": 1.0
      }
    }
  }
}
```

Where the outer keys in `scaling_factor` are tensor parallel ranks and inner keys are layer indices.

```{warning}
If scaling factors are not provided and not found in the checkpoint, it will default to 1.0, which may cause accuracy issues.
```

```{tip}
**FP4 (MXFP4)**: Unlike FP8, FP4 quantization handles scaling factors automatically on-the-fly during quantization and dequantization. No pre-quantized models or external scaling factor files are required—the block-based scaling factors are computed dynamically as needed.
```

## Performance Considerations

### Memory Savings

Quantized KV cache provides significant memory savings:
- **BF16 → FP4**: Supports approximately 3.56× more tokens than BF16 (accounting for scaling factor overhead)

```{note}
FP4 and FP8 quantization require additional memory for block-based scaling factors, which reduces the effective memory savings compared to the raw bit-width reduction. FP4 with block size 16 supports approximately 1.78× more tokens than FP8, and approximately 3.56× more tokens than BF16. The relative token capacity between FP8 and BF16 can be derived from these ratios.
```

This enables longer context lengths or more concurrent requests within the same memory budget.

### Accuracy Impact

#### FP8 Accuracy

FP8 E4M3 quantization typically introduces minimal accuracy degradation. The impact depends on model architecture, sequence length, and quantization format (generally, E4M3 has better accuracy than E5M2).

#### FP4 Accuracy

FP4 (MXFP4) quantization provides significant memory savings with varying accuracy impact depending on model size and dataset complexity. Preliminary accuracy test results from [PR #10078](https://github.com/sgl-project/sglang/pull/10078) (MLA) and [PR #12612](https://github.com/sgl-project/sglang/pull/12612) (MHA) show:

**Large Models (e.g., Qwen3-235B-A22B, DeepSeek-R1-0528)**

On large-scale models, FP4 maintains accuracy close to FP8/BF16, especially on simpler datasets:

| Model | Dataset | KV16 | KV8 (FP8 E4M3) | KV4 (FP4 E2M1) |
|-------|---------|------|----------------|----------------|
| Qwen3-235B-A22B | gsm8k | 0.9168 | 0.9181 | 0.9186 |
| Qwen3-235B-A22B | aime25 | 0.7733 | 0.7333 | 0.6000 |
| Qwen3-235B-A22B | gpqa_diamond | 0.7010 | 0.6899 | 0.6778 |
| DeepSeek-R1-0528 | gsm8k | 0.9157 | 0.9154 | 0.9124 |
| DeepSeek-R1-0528 | aime25 | 0.5067 | 0.4934 | 0.4000 |
| DeepSeek-R1-0528 | gpqa_diamond | 0.7707 | 0.7697 | 0.7273 |

**Smaller Models (e.g., GPT-OSS-120B)**

On smaller models, FP4 shows more pronounced accuracy drops, particularly on challenging datasets:

| Model | Dataset | KV16 | KV8 (FP8 E4M3) | KV4 (FP4 E2M1) |
|-------|---------|------|----------------|----------------|
| GPT-OSS-120B | gsm8k | 0.9161 | 0.9163 | 0.9152 |
| GPT-OSS-120B | aime25 | 0.7533 | 0.7667 | 0.3533 |
| GPT-OSS-120B | gpqa_diamond | 0.5081 | 0.5434 | 0.3202 |

**Key Observations:**

- **Simple datasets (e.g., gsm8k)**: FP4 maintains accuracy close to FP8/BF16 across model sizes
- **Model size matters**: Large models (200B+ parameters) generally tolerate FP4 quantization better than smaller models
- **Context length**: Accuracy degradation may be more pronounced in long-context scenarios, as the accumulation of the quantization error may become significant.

```{tip}
Evaluate FP4 accuracy on your specific model and workload. Large models on simpler tasks typically show minimal degradation, while smaller models or complex reasoning tasks may require FP8 or BF16 for acceptable accuracy.
```

## Best Practices

- **Use pre-quantized models**: Prefer models quantized offline with scaling factors included in the checkpoint.
- **Choose the right format**: Use `fp8_e4m3` for better accuracy (recommended), `fp8_e5m2` for larger dynamic range, or `fp4_e2m1` for maximum memory savings (experimental)
- **Check backend compatibility**: Verify that your chosen attention backend supports quantized KV cache

```{seealso}
- [Quantization](quantization.md)
- [Attention Backend](attention_backend.md)
- [Server Arguments](server_arguments.md)
```

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
