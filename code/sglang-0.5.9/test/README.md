# Run Unit Tests

SGLang uses the built-in library [unittest](https://docs.python.org/3/library/unittest.html) as the testing framework.

## Test Backend Runtime
```bash
cd sglang/test/srt

# Run a single file
python3 test_srt_endpoint.py

# Run a single test
python3 test_srt_endpoint.py TestSRTEndpoint.test_simple_decode

# Run a suite with multiple files
python3 run_suite.py --suite per-commit
```

## Test Frontend Language
```bash
cd sglang/test/lang

# Run a single file
python3 test_choices.py
```

## Adding or Updating Tests in CI

- Create new test files under `test/srt` or `test/lang` depending on the type of test.
- For nightly tests, place them in `test/srt/nightly/`. Use the `NightlyBenchmarkRunner` helper class in `nightly_utils.py` for performance benchmarking tests.
- Ensure they are referenced in the respective `run_suite.py` (e.g., `test/srt/run_suite.py`) so they are picked up in CI. For most small test cases, they can be added to the `per-commit-1-gpu` suite. Sort the test cases alphabetically by name.
- Ensure you added `unittest.main()` for unittest and `sys.exit(pytest.main([__file__]))` for pytest in the scripts. The CI run them via `python3 test_file.py`.
- The CI will run some suites such as `per-commit-1-gpu`, `per-commit-2-gpu`, and `nightly-1-gpu` automatically. If you need special setup or custom test groups, you may modify the workflows in [`.github/workflows/`](https://github.com/sgl-project/sglang/tree/main/.github/workflows).

## CI Registry System

Tests in `test/registered/` use a registry-based CI system for flexible backend/schedule configuration.

### Registration Functions

```python
from sglang.test.ci.ci_register import (
    register_cuda_ci,
    register_amd_ci,
    register_cpu_ci,
    register_npu_ci,
)

# Per-commit test (small 1-gpu, runs on 5090)
register_cuda_ci(est_time=80, suite="stage-b-test-small-1-gpu")

# Per-commit test (large 1-gpu, runs on H100)
register_cuda_ci(est_time=120, suite="stage-b-test-large-1-gpu")

# Per-commit test (2-gpu)
register_cuda_ci(est_time=200, suite="stage-b-test-large-2-gpu")

# Nightly-only test
register_cuda_ci(est_time=200, suite="nightly-1-gpu", nightly=True)

# Multi-backend test
register_cuda_ci(est_time=80, suite="stage-b-test-small-1-gpu")
register_amd_ci(est_time=120, suite="stage-a-test-1")

# Temporarily disabled test
register_cuda_ci(est_time=80, suite="stage-b-test-small-1-gpu", disabled="flaky - see #12345")
```

### Choosing Between 1-GPU Suites (5090 vs H100)

When adding 1-GPU tests, choose the appropriate suite based on hardware compatibility:

| Suite | Runner | GPU | When to Use |
|-------|--------|-----|-------------|
| `stage-b-test-small-1-gpu` | `1-gpu-5090` | RTX 5090 (32GB, SM120) | 5090-compatible tests (preferred) |
| `stage-b-test-large-1-gpu` | `1-gpu-runner` | H100 (80GB, SM90) | Large models or 5090-incompatible tests |

**Use `stage-b-test-small-1-gpu` (5090) whenever possible** - this is the preferred suite for most 1-GPU tests.

**Use `stage-b-test-large-1-gpu` (H100) if ANY of these apply:**

1. **Architecture incompatibility (SM120/Blackwell)**:
   - FA3 attention backend (requires SM≤90)
   - MLA with FA3 backend
   - FP8/MXFP4 quantization (not supported on SM120)
   - Certain Triton kernels (shared memory limits)

2. **Memory requirements**:
   - Models >30B params or large MoE
   - Tests requiring >32GB VRAM

3. **Known 5090 failures**:
   - Weight update/sync tests
   - Certain spec decoding tests

If a test cannot run on 5090 due to any of the above, use `stage-b-test-large-1-gpu` which runs on H100.

### Available Suites

**Per-Commit (CUDA)**:
- Stage A: `stage-a-test-1` (locked), `stage-a-test-2`, `stage-a-test-cpu`
- Stage B: `stage-b-test-small-1-gpu` (5090), `stage-b-test-large-1-gpu` (H100), `stage-b-test-large-2-gpu`
- Stage C (4-GPU): `stage-c-test-4-gpu-h100`, `stage-c-test-4-gpu-b200`, `stage-c-test-4-gpu-gb200`, `stage-c-test-deepep-4-gpu`
- Stage C (8-GPU): `stage-c-test-8-gpu-h20`, `stage-c-test-8-gpu-h200`, `stage-c-test-8-gpu-b200`, `stage-c-test-deepep-8-gpu-h200`

**Per-Commit (AMD)**:
- `stage-a-test-1`, `stage-b-test-small-1-gpu-amd`, `stage-b-test-large-2-gpu-amd`

**Nightly**:
- `nightly-1-gpu`, `nightly-2-gpu`, `nightly-4-gpu`, `nightly-8-gpu`, etc.

### Running Tests with run_suite.py

```bash
# Run per-commit tests
python test/run_suite.py --hw cuda --suite stage-b-test-small-1-gpu

# Run nightly tests
python test/run_suite.py --hw cuda --suite nightly-1-gpu --nightly

# With auto-partitioning (for parallel CI jobs)
python test/run_suite.py --hw cuda --suite stage-b-test-small-1-gpu \
    --auto-partition-id 0 --auto-partition-size 4
```

## Writing Elegant Test Cases

- Learn from existing examples in [sglang/test/srt](https://github.com/sgl-project/sglang/tree/main/test/srt).
- Reduce the test time by using smaller models and reusing the server for multiple test cases. Launching a server takes a lot of time.
- Use as few GPUs as possible. Do not run long tests with 8-gpu runners.
- If the test cases take too long, considering adding them to nightly tests instead of per-commit tests.
- Keep each test function focused on a single scenario or piece of functionality.
- Give tests descriptive names reflecting their purpose.
- Use robust assertions (e.g., assert, unittest methods) to validate outcomes.
- Clean up resources to avoid side effects and preserve test independence.
- Reduce the test time by using smaller models and reusing the server for multiple test cases.


## Adding New Models to Nightly CI
- **For text models**: extend [global model lists variables](https://github.com/sgl-project/sglang/blob/85c1f7937781199203b38bb46325a2840f353a04/python/sglang/test/test_utils.py#L104) in `test_utils.py`, or add more model lists
- **For vlms**: extend the `MODEL_THRESHOLDS` global dictionary in `test/srt/nightly/test_vlms_mmmu_eval.py`

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
