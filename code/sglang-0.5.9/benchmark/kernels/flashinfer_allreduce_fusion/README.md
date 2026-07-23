# FlashInfer Fused AllReduce + RMSNorm Benchmark

This benchmark script is modified from the [original implementation](https://github.com/vllm-project/vllm/blob/237e1fb887c7f5a579420fa0295097f24b006594/benchmarks/kernels/benchmark_fused_collective.py) by the vLLM community. It aims to compare the performance differences between FlashInfer fused operators in SGLang (trtllm_allreduce_fusion: AllReduce + Residual Add + RMSNorm + optional quantization) and conventional implementations (standard `tensor_model_parallel_all_reduce` + separate RMSNorm/quantization). Specifically, this script tests the timing performance of two implementation paths: 1) Standard AllReduce and RMSNorm executed separately; 2) FlashInfer's fused operator combining AllReduce, Residual Add, RMSNorm, and optional quantization operations.

This benchmark script helps us tune the ipc workspace size of the `flashinfer_allreduce_residual_rmsnorm` operator in SGLang and prepare for applications with FP8/FP4 quantized fused operators.

Script path: `benchmark/kernels/flashinfer_allreduce_fusion/benchmark_fused_collective.py`

## Feature Overview

- Compare average execution time (ms) and calculate speedup ratios for the following paths:
  - standard_allreduce_rmsnorm (Standard AllReduce + RMSNorm)
  - flashinfer_fused_allreduce_rmsnorm (Fused AllReduce + RMSNorm), including oneshot and twoshot modes
  - Optionally compare FP8/FP4 quantized fused paths with standard paths
- Use CUDA Graph capture and batch replay to reduce measurement noise
- Automatically select the faster "standard baseline" (native/compiled version) as the denominator for speedup calculation
- Optionally export results in Markdown format

## Runtime Environment and Prerequisites

- At least 2 GPUs, and launch multi-process distributed training using `torchrun` (NCCL backend)
- Properly install/compile sglang along with sgl-kernel and custom operators

## Quick Start (Command Examples)

The following examples use world_size=2. You can modify `--nproc_per_node` and parameters according to your machine:

- Regular paths only (no quantization):
```
torchrun --nproc_per_node=2 \
benchmark/kernels/flashinfer_allreduce_fusion/benchmark_fused_collective.py \
--no-quant --hidden-dim 1024 --seq-lens 512 1024 2048 4096 --trials 100
```

- FP8 quantization paths only:
```
torchrun --nproc_per_node=2 \
benchmark/kernels/flashinfer_allreduce_fusion/benchmark_fused_collective.py \
--quant-fp8 --hidden-dim 1024 --seq-lens 512 1024 2048 4096 --trials 100
```

- FP4 quantization paths only:
```
torchrun --nproc_per_node=2 \
benchmark/kernels/flashinfer_allreduce_fusion/benchmark_fused_collective.py \
--quant-fp4 --hidden-dim 1024 --seq-lens 512 1024 2048 4096 --trials 100
```

- Larger hidden dimensions:
```
torchrun --nproc_per_node=2 \
benchmark/kernels/flashinfer_allreduce_fusion/benchmark_fused_collective.py \
--no-quant  --hidden-dim 4096 --seq-lens 512 1024 2048 4096 --trials 100
```

## Parameter Description
- `--seq-lens`: List of sequence lengths to test (default: 128 512 1024 2048)
- `--hidden-dim`: Hidden dimension (default: 8192)
- `--dtypes`: Data type list, `float16|bfloat16|float32` (default: bfloat16)
- `--no-residual`: Only test "no residual" scenarios (default tests both "with/without residual")
- Mutually exclusive quantization options:
  - `--no-quant`: No quantization testing
  - `--quant-fp8`: Only FP8 quantization testing
  - `--quant-fp4`: Only FP4 quantization testing
  - `--quant-all`: Test all (default)
- FlashInfer related:
  - `--disable-oneshot`: Disable oneshot mode (default enables oneshot and tests twoshot simultaneously)
- Runtime configuration:
  - `--warmup`: Warmup count before graph capture and before graph replay (default 5)
  - `--trials`: Benchmark iteration count (default 20; internally each `graph.replay()` will batch replay multiple times)
  - `--output-file`: Save results as Markdown file (only rank0 takes effect)

## Output Example

Each configuration group prints a table showing average execution time and relative speedup ratios (baseline is the faster standard implementation). For example:
```
================================================================================
Results: seq_len=1024, hidden_dim=1024
dtype=torch.bfloat16, residual=yes, quant_mode=none
================================================================================
Operation                                          Time (ms)    Speedup
--------------------------------------------------------------------------------
standard_allreduce_rmsnorm                         0.024        0.98x
standard_allreduce_rmsnorm_native_compiled         0.023        baseline
flashinfer_fused_allreduce_rmsnorm_oneshot         0.011        2.19x
flashinfer_fused_allreduce_rmsnorm_twoshot         0.041        0.57x
```

If `--output-file` is specified, all configurations will be summarized in Markdown tables in that file.

## Important Notes and Recommendations

- Distributed: The script uses `torchrun` environment variables to initialize distributed training and binds tensors/communication groups to the current rank's corresponding device.
- World size: Requires `WORLD_SIZE > 1` to perform communication operator benchmarks. Otherwise, the script will error and prompt.
- FlashInfer:
  - If not installed or interfaces are missing, the script will only run standard paths and provide prompts in the logs.
  - The fused operator internally uses "oneshot"/"twoshot" two trigger methods; oneshot is enabled by default and twoshot is tested simultaneously.
- FP8/FP4:
  - FP8 uses sglang's FP8 tools and dtype, with underlying platform selection of `e4m3`/`e4m3fnuz` etc.
  - FP4 uses sgl-kernel's `scaled_fp4_quant`, requiring corresponding platform support.
- CUDA Graph:
  - Uses sglang's `graph_capture()` to prepare capture-ready state for communication, then uses `torch.cuda.graph` to capture kernels, reducing measurement jitter.

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

## 进阶内容补充

| 主题 | 深度解析 | 实践要点 | 参考资源 |
|------|----------|----------|----------|
| 原理深入 | 底层机制剖析 | 源码阅读+实验验证 | 官方文档+论文 |
| 工程实现 | 生产级代码实践 | 设计模式+测试覆盖 | 开源项目 |
| 性能调优 | 瓶颈定位+优化 | Profiling+基准测试 | 性能工具 |
| 安全加固 | 威胁建模+防护 | 安全审计+渗透测试 | 安全框架 |
| 架构演进 | 系统设计与重构 | 渐进式改造+验证 | 架构书籍 |

## 实践操作指南

| 步骤 | 操作 | 验证方法 | 常见问题 |
|------|------|----------|----------|
| 环境搭建 | 安装依赖+配置 | 运行hello world | 版本冲突 |
| 基础使用 | 核心API调用 | 单元测试通过 | 参数错误 |
| 功能开发 | 业务逻辑实现 | 集成测试通过 | 边界条件 |
| 性能优化 | 热点优化+缓存 | 压测达标 | 内存泄漏 |
| 部署上线 | 容器化+CI/CD | 灰度验证通过 | 配置差异 |

## 技术选型决策

| 考量因素 | 权重 | 评估方法 | 决策标准 |
|----------|------|----------|----------|
| 功能匹配 | 30% | 需求清单对比 | 覆盖核心需求 |
| 性能表现 | 25% | 基准测试 | 满足SLA |
| 社区生态 | 20% | Star/Issue/更新频率 | 活跃维护 |
| 学习成本 | 15% | 文档质量+上手时间 | 团队可接受 |
| 长期维护 | 10% | 路线图+兼容性 | 可持续发展 |

## 故障排查流程

| 阶段 | 动作 | 工具 | 产出 |
|------|------|------|------|
| 复现 | 稳定复现问题 | 日志+断点 | 复现步骤 |
| 定位 | 缩小问题范围 | 二分法+排除法 | 问题模块 |
| 分析 | 找到根本原因 | 源码+文档 | 根因报告 |
| 修复 | 实施修复方案 | 代码修改+测试 | 修复PR |
| 验证 | 确认问题消除 | 回归测试 | 验证报告 |
| 预防 | 防止再次发生 | 监控+文档 | 改进措施 |

## 知识关联图谱

| 关联领域 | 关系 | 学习顺序 |
|----------|------|----------|
| 前置基础 | 必须先掌握 | 先学 |
| 并行技能 | 相互增强 | 同步 |
| 进阶方向 | 深入发展 | 后学 |
| 应用场景 | 价值体现 | 实践 |
| 工具支撑 | 效率提升 | 随时 |

## 持续改进清单

- [ ] 定期回顾和更新知识
- [ ] 实践验证理论认知
- [ ] 关注社区最新动态
- [ ] 参与技术讨论和分享
- [ ] 将经验沉淀为文档
- [ ] 持续优化工作流程
