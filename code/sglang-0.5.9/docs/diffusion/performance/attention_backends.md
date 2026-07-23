# Attention Backends

This document describes the attention backends available in sglang diffusion (`sglang.multimodal_gen`) and how to select them.

## Overview

Attention backends are defined by `AttentionBackendEnum` (`sglang.multimodal_gen.runtime.platforms.interface.AttentionBackendEnum`) and selected via the CLI flag `--attention-backend`.

Backend selection is performed by the shared attention layers (e.g. `LocalAttention` / `USPAttention` / `UlyssesAttention` in `sglang.multimodal_gen.runtime.layers.attention.layer`) and therefore applies to any model component using these layers (e.g. diffusion transformer / DiT and encoders).

When using the diffusers backend, `--attention-backend` is passed through to diffusers'
`set_attention_backend` (e.g., `flash`, `_flash_3_hub`, `sage`, `xformers`, `native`).

- **CUDA**: prefers FlashAttention (FA3/FA4) when supported; otherwise falls back to PyTorch SDPA.
- **ROCm**: uses FlashAttention when available; otherwise falls back to PyTorch SDPA.
- **MPS**: always uses PyTorch SDPA.
- **NPU**: always uses PyTorch SDPA.

## Backend options

For SGLang-native pipelines, the CLI accepts the lowercase names of `AttentionBackendEnum`. The table below lists the backends implemented by the built-in platforms. `fa3`/`fa4` are accepted as aliases for `fa`.

| CLI value | Enum value | Notes |
|---|---|---|
| `fa` / `fa3` / `fa4` | `FA` | FlashAttention. `fa3/fa4` are normalized to `fa` during argument parsing (`ServerArgs.__post_init__`). |
| `torch_sdpa` | `TORCH_SDPA` | PyTorch `scaled_dot_product_attention`. |
| `sliding_tile_attn` | `SLIDING_TILE_ATTN` | Sliding Tile Attention (STA). Requires `st_attn`. Configure via `--attention-backend-config`. |
| `sage_attn` | `SAGE_ATTN` | Requires `sageattention`. Upstream SageAttention CUDA extensions target SM80/SM86/SM89/SM90/SM120 (compute capability 8.0/8.6/8.9/9.0/12.0); see upstream `setup.py`: https://github.com/thu-ml/SageAttention/blob/main/setup.py. |
| `sage_attn_3` | `SAGE_ATTN_3` | Requires SageAttention3 installed per upstream instructions. |
| `video_sparse_attn` | `VIDEO_SPARSE_ATTN` | Requires `vsa`. Configure `sparsity` via `--attention-backend-config`. |
| `vmoba_attn` | `VMOBA_ATTN` | Requires `kernel.attn.vmoba_attn.vmoba`. Configure via `--attention-backend-config`. |
| `aiter` | `AITER` | Requires `aiter`. |
| `sparse_video_gen_2_attn` | `SPARSE_VIDEO_GEN_2_ATTN` | Requires `svg`. See installation instructions at https://github.com/svg-project/Sparse-VideoGen. |

## Selection priority

The selection order in `runtime/layers/attention/selector.py` is:

1. `global_force_attn_backend(...)` / `global_force_attn_backend_context_manager(...)`
2. CLI `--attention-backend` (`ServerArgs.attention_backend`)
3. Auto selection (platform capability, dtype, and installed packages)

## Configuration

Some backends require additional configuration. You can pass these parameters via `--attention-backend-config`. This argument accepts:
- A path to a JSON or YAML configuration file.
- A JSON string (e.g., `'{"sparsity": 0.5}'`).
- Key-value pairs (e.g., `"sparsity=0.5,enable_x=true"`).

### Supported Configuration Parameters

**Sliding Tile Attention (`sliding_tile_attn`)**

| Parameter | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `mask_strategy_file_path` | `str` | **Required.** Path to the mask strategy JSON file. | - |
| `sta_mode` | `str` | Mode of STA. | `STA_inference` |
| `skip_time_steps` | `int` | Number of steps to use full attention before switching to sparse attention. | `15` |

**Video Sparse Attention (`video_sparse_attn`)**

| Parameter | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `sparsity` | `float` | Validation sparsity (0.0 - 1.0). | `0.0` |

**V-MoBA (`vmoba_attn`)**

| Parameter | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `temporal_chunk_size` | `int` | Chunk size for temporal dimension. | - |
| `temporal_topk` | `int` | Top-K tokens to select in temporal dimension. | - |
| `spatial_chunk_size` | `list[int]` | Chunk size for spatial dimension (H, W). | - |
| `spatial_topk` | `int` | Top-K tokens to select in spatial dimension. | - |
| `st_chunk_size` | `list[int]` | Chunk size for spatiotemporal dimension (T, H, W). | - |
| `st_topk` | `int` | Top-K tokens to select in spatiotemporal dimension. | - |
| `moba_select_mode` | `str` | Selection mode (e.g., `threshold`). | `threshold` |
| `moba_threshold` | `float` | Threshold value for selection. | `0.25` |
| `moba_threshold_type` | `str` | Type of thresholding (e.g., `query_head`). | `query_head` |
| `first_full_step` | `int` | Number of initial steps to use full attention. | `12` |
| `first_full_layer` | `int` | Number of initial layers to use full attention. | `0` |
| `temporal_layer` | `int` | Number of temporal layers. | `1` |
| `spatial_layer` | `int` | Number of spatial layers. | `1` |
| `st_layer` | `int` | Number of spatiotemporal layers. | `1` |

## Platform support matrix

| Backend | CUDA | ROCm | MPS | NPU | Notes |
|---|---:|---:|---:|---:|---|
| `fa` | ✅ | ✅ | ❌ | ❌ | CUDA requires SM80+ and fp16/bf16. FlashAttention is only used when the required runtime is installed; otherwise it falls back to `torch_sdpa`. |
| `torch_sdpa` | ✅ | ✅ | ✅ | ✅ | Most compatible option across platforms. |
| `sliding_tile_attn` | ✅ | ❌ | ❌ | ❌ | CUDA-only. Requires `st_attn`. Configure via `--attention-backend-config`. |
| `sage_attn` | ✅ | ❌ | ❌ | ❌ | CUDA-only (optional dependency). |
| `sage_attn_3` | ✅ | ❌ | ❌ | ❌ | CUDA-only (optional dependency). |
| `video_sparse_attn` | ✅ | ❌ | ❌ | ❌ | CUDA-only. Requires `vsa`. Configure `sparsity` via `--attention-backend-config`. |
| `vmoba_attn` | ✅ | ❌ | ❌ | ❌ | CUDA-only. Requires `kernel.attn.vmoba_attn.vmoba`. Configure via `--attention-backend-config`. |
| `aiter` | ✅ | ❌ | ❌ | ❌ | Requires `aiter`. |
| `sparse_video_gen_2_attn` | ✅ | ❌ | ❌ | ❌ | CUDA-only. Requires `svg`. |

## Usage

### Select a backend via CLI

```bash
sglang generate \
  --model-path <MODEL_PATH_OR_ID> \
  --prompt "..." \
  --attention-backend fa
```

```bash
sglang generate \
  --model-path <MODEL_PATH_OR_ID> \
  --prompt "..." \
  --attention-backend torch_sdpa
```

### Using Sliding Tile Attention (STA)

```bash
# Pass the mask strategy file path via config
sglang generate \
  --model-path <MODEL_PATH_OR_ID> \
  --prompt "..." \
  --attention-backend sliding_tile_attn \
  --attention-backend-config "mask_strategy_file_path=/abs/path/to/mask_strategy.json"
```

### Notes for ROCm / MPS

- ROCm: use `--attention-backend torch_sdpa` or `fa` depending on what is available in your environment.
- MPS: the platform implementation always uses `torch_sdpa`.

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
