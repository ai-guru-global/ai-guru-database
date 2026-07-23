# CUTLASS Epilogues

## Introduction

This document describes the various CUTLASS epilogues implemented for fusing de-quantization operations onto GEMMs.

Currently, we only support symmetric quantization for weights,
and symmetric and asymmetric quantization for activations.
Both can be quantized per-tensor or per-channel (weights) / per-token (activations).

There are 4 epilogues:

1. `ScaledEpilogue`: symmetric quantization for activations, no bias.
1. `ScaledEpilogueBias`: symmetric quantization for activations, supports bias.
1. `ScaledEpilogueAzp`: asymmetric per-tensor quantization for activations, supports bias.
1. `ScaledEpilogueAzpPerToken`: asymmetric per-token quantization for activations, supports bias.

We do not have epilogues for asymmetric quantization of activations without bias in order to reduce final binary size.
Instead, if no bias is passed, the epilogue will use 0 as the bias.
That induces a redundant addition operation (and runtime check), but the performance impact is minor.

## Underlying Linear Algebra

More details available in the [Activation Quantization RFC](https://github.com/vllm-project/vllm/issues/3975).

If $` \widehat X `$ is the quantized $` X `$, our matrices become the following

```math
A = s_a (\widehat A - J_a z_a)
```

```math
B = s_b \widehat B
```

```math
D = A B + C
```

```math
D = s_a s_b \widehat D + C
```

Here, D is the output of the GEMM, and C is the bias.
A is the activations and supports asymmetric quantization,
and B is the weights and only supports symmetric quantization.
$ s_a $ and $s_b$ are the scales for activations and weights, respectively.
$ z_a $ is the zero-point for activations, and $ J_a $ is the matrix of all ones with dimensions of A.
Additional epilogues would be required to support asymmetric quantization for weights.

Expanding further, we can calculate $` \widehat D `$ as follows:

```math
A B = s_a ( \widehat A - J_a z_a ) s_b \widehat B
```

```math
A B = s_a s_b \left( \widehat A \widehat B - J_a z_a \widehat B \right)
```

```math
\widehat D = \widehat A \widehat B - z_a J_a \widehat B
```

Note that $` \widehat A \widehat B `$ is the raw output of the GEMM,
and $` J_a \widehat B `$ is known ahead of time.
Each row of it is equal to $` \mathbf 1 \widehat B `$, which is a row-vector of column sums of $` \widehat B `$.

## Epilogues

### `ScaledEpilogue`

This epilogue computes the symmetric quantization for activations without bias, meaning $` C = 0 `$ and $` z_a = 0 `$.
The output of the GEMM is:

```math
\widehat D = \widehat A \widehat B
```

```math
D = s_a s_b \widehat D
```

```math
D = s_a s_b \widehat A \widehat B
```

Epilogue parameters:
- `scale_a` is the scale for activations, can be per-tensor (scalar) or per-token (column-vector).
- `scale_b` is the scale for weights, can be per-tensor (scalar) or per-channel (row-vector).

### `ScaledEpilogueBias`

This epilogue computes the symmetric quantization for activations with bias, meaning $` z_a = 0 `$.
The output of the GEMM is:

```math
\widehat D = \widehat A \widehat B
```

```math
D = s_a s_b \widehat D + C 
```

```math
D = s_a s_b \widehat A \widehat B + C
```

Epilogue parameters:

- `scale_a` is the scale for activations, can be per-tensor (scalar) or per-token (column-vector).
- `scale_b` is the scale for weights, can be per-tensor (scalar) or per-channel (row-vector).
- `bias` is the bias, is always per-channel (row-vector).

### `ScaledEpilogueAzp`

This epilogue computes the asymmetric per-tensor quantization for activations with bias.
The output of the GEMM is:

```math
\widehat D = \widehat A \widehat B - z_a J_a \widehat B
```

```math
D = s_a s_b \widehat D + C 
```

```math
D = s_a s_b \left( \widehat A \widehat B - z_a J_a \widehat B \right) + C
```

Because $` z_a `$ is a scalar, the zero-point term $` z_a J_a \widehat B `$ has every row equal to $` z_a \mathbf 1 B `$.
That is precomputed and stored in `azp_with_adj` as a row-vector.

Epilogue parameters:

- `scale_a` is the scale for activations, can be per-tensor (scalar) or per-token (column-vector).
  - Generally this will be per-tensor as the zero-points are per-tensor.
- `scale_b` is the scale for weights, can be per-tensor (scalar) or per-channel (row-vector).
- `azp_with_adj` is the precomputed zero-point term ($` z_a J_a \widehat B `$), is per-channel (row-vector).
- `bias` is the bias, is always per-channel (row-vector).

To use these kernels efficiently, users must precompute the `azp_with_adj` term offline and pass it to the kernel.

### `ScaledEpilogueAzpPerToken`

This epilogue computes the asymmetric per-token quantization for activations with bias.

The output of the GEMM is the same as above, but the $` z_a `$ is a column-vector.
That means the zero-point term $` z_a J_a \widehat B `$ becomes an outer product of $` z_a `$ and $` \mathbf 1 \widehat B `$.

Epilogue parameters:

- `scale_a` is the scale for activations, can be per-tensor (scalar) or per-token (column-vector).
  - Generally this will be per-token as the zero-points are per-token.
- `scale_b` is the scale for weights, can be per-tensor (scalar) or per-channel (row-vector).
- `azp_adj` is the precomputed zero-point adjustment term ($` \mathbf 1 \widehat B `$), is per-channel (row-vector).
- `azp` is the zero-point (`z_a`), is per-token (column-vector).
- `bias` is the bias, is always per-channel (row-vector).

To use these kernels efficiently, users must precompute the `azp_adj` term offline and pass it to the kernel.

The epilogue performs the following computation (where `Dq` is the raw quantized output of the GEMM):

```math
out = scale_a * scale_b * (Dq - azp_adj * azp) + bias
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
