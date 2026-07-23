# Profiling Multimodal Generation

This guide covers profiling techniques for multimodal generation pipelines in SGLang.

## PyTorch Profiler

PyTorch Profiler provides detailed kernel execution time, call stack, and GPU utilization metrics.

### Denoising Stage Profiling

Profile the denoising stage with sampled timesteps (default: 5 steps after 1 warmup step):

```bash
sglang generate \
  --model-path Qwen/Qwen-Image \
  --prompt "A Logo With Bold Large Text: SGL Diffusion" \
  --seed 0 \
  --profile
```

**Parameters:**
- `--profile`: Enable profiling for the denoising stage
- `--num-profiled-timesteps N`: Number of timesteps to profile after warmup (default: 5)
  - Smaller values reduce trace file size
  - Example: `--num-profiled-timesteps 10` profiles 10 steps after 1 warmup step

### Full Pipeline Profiling

Profile all pipeline stages (text encoding, denoising, VAE decoding, etc.):

```bash
sglang generate \
  --model-path Qwen/Qwen-Image \
  --prompt "A Logo With Bold Large Text: SGL Diffusion" \
  --seed 0 \
  --profile \
  --profile-all-stages
```

**Parameters:**
- `--profile-all-stages`: Used with `--profile`, profile all pipeline stages instead of just denoising

### Output Location

By default, trace files are saved in the ./logs/ directory.

The exact output file path will be shown in the console output, for example:

```bash
[mm-dd hh:mm:ss] Saved profiler traces to: /sgl-workspace/sglang/logs/mocked_fake_id_for_offline_generate-5_steps-global-rank0.trace.json.gz
```

### View Traces

Load and visualize trace files at:
- https://ui.perfetto.dev/ (recommended)
- chrome://tracing (Chrome only)

For large trace files, reduce `--num-profiled-timesteps` or avoid using `--profile-all-stages`.


### `--perf-dump-path` (Stage/Step Timing Dump)

Besides profiler traces, you can also dump a lightweight JSON report that contains:
- stage-level timing breakdown for the full pipeline
- step-level timing breakdown for the denoising stage (per diffusion step)

This is useful to quickly identify which stage dominates end-to-end latency, and whether denoising steps have uniform runtimes (and if not, which step has an abnormal spike).

The dumped JSON contains a `denoise_steps_ms` field formatted as an array of objects, each with a `step` key (the step index) and a `duration_ms` key.

Example:

```bash
sglang generate \
  --model-path <MODEL_PATH_OR_ID> \
  --prompt "<PROMPT>" \
  --perf-dump-path perf.json
```

## Nsight Systems

Nsight Systems provides low-level CUDA profiling with kernel details, register usage, and memory access patterns.

### Installation

See the [SGLang profiling guide](https://github.com/sgl-project/sglang/blob/main/docs/developer_guide/benchmark_and_profiling.md#profile-with-nsight) for installation instructions.

### Basic Profiling

Profile the entire pipeline execution:

```bash
nsys profile \
  --trace-fork-before-exec=true \
  --cuda-graph-trace=node \
  --force-overwrite=true \
  -o QwenImage \
  sglang generate \
    --model-path Qwen/Qwen-Image \
    --prompt "A Logo With Bold Large Text: SGL Diffusion" \
    --seed 0
```

### Targeted Stage Profiling

Use `--delay` and `--duration` to capture specific stages and reduce file size:

```bash
nsys profile \
  --trace-fork-before-exec=true \
  --cuda-graph-trace=node \
  --force-overwrite=true \
  --delay 10 \
  --duration 30 \
  -o QwenImage_denoising \
  sglang generate \
    --model-path Qwen/Qwen-Image \
    --prompt "A Logo With Bold Large Text: SGL Diffusion" \
    --seed 0
```

**Parameters:**
- `--delay N`: Wait N seconds before starting capture (skip initialization overhead)
- `--duration N`: Capture for N seconds (focus on specific stages)
- `--force-overwrite`: Overwrite existing output files

## Notes

- **Reduce trace size**: Use `--num-profiled-timesteps` with smaller values or `--delay`/`--duration` with Nsight Systems
- **Stage-specific analysis**: Use `--profile` alone for denoising stage, add `--profile-all-stages` for full pipeline
- **Multiple runs**: Profile with different prompts and resolutions to identify bottlenecks across workloads

## FAQ

- If you are profiling `sglang generate` with Nsight Systems and find that the generated profiler file did not capture any CUDA kernels, you can resolve this issue by increasing the model's inference steps to extend the execution time.

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
