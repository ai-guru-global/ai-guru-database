# Profiling vLLM

!!! warning
    Profiling is only intended for vLLM developers and maintainers to understand the proportion of time spent in different parts of the codebase. **vLLM end-users should never turn on profiling** as it will significantly slow down the inference.

## Profile with PyTorch Profiler

We support tracing vLLM workers using the `torch.profiler` module. You can enable tracing by setting the `VLLM_TORCH_PROFILER_DIR` environment variable to the directory where you want to save the traces: `VLLM_TORCH_PROFILER_DIR=/mnt/traces/`

The OpenAI server also needs to be started with the `VLLM_TORCH_PROFILER_DIR` environment variable set.

When using `benchmarks/benchmark_serving.py`, you can enable profiling by passing the `--profile` flag.

Traces can be visualized using <https://ui.perfetto.dev/>.

!!! tip
    Only send a few requests through vLLM when profiling, as the traces can get quite large. Also, no need to untar the traces, they can be viewed directly.

!!! tip
    To stop the profiler - it flushes out all the profile trace files to the directory. This takes time, for example for about 100 requests worth of data for a llama 70b, it takes about 10 minutes to flush out on a H100.
    Set the env variable VLLM_RPC_TIMEOUT to a big number before you start the server. Say something like 30 minutes.
    `export VLLM_RPC_TIMEOUT=1800000`

### Example commands and usage

#### Offline Inference

Refer to <gh-file:examples/offline_inference/simple_profiling.py> for an example.

#### OpenAI Server

```bash
VLLM_TORCH_PROFILER_DIR=./vllm_profile python -m vllm.entrypoints.openai.api_server --model meta-llama/Meta-Llama-3-70B
```

benchmark_serving.py:

```bash
python benchmarks/benchmark_serving.py --backend vllm --model meta-llama/Meta-Llama-3-70B --dataset-name sharegpt --dataset-path sharegpt.json --profile --num-prompts 2
```

## Profile with NVIDIA Nsight Systems

Nsight systems is an advanced tool that exposes more profiling details, such as register and shared memory usage, annotated code regions and low-level CUDA APIs and events.

[Install nsight-systems](https://docs.nvidia.com/nsight-systems/InstallationGuide/index.html) using your package manager.
The following block is an example for Ubuntu.

```bash
apt update
apt install -y --no-install-recommends gnupg
echo "deb http://developer.download.nvidia.com/devtools/repos/ubuntu$(source /etc/lsb-release; echo "$DISTRIB_RELEASE" | tr -d .)/$(dpkg --print-architecture) /" | tee /etc/apt/sources.list.d/nvidia-devtools.list
apt-key adv --fetch-keys http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
apt update
apt install nsight-systems-cli
```

### Example commands and usage

#### Offline Inference

For basic usage, you can just append `nsys profile -o report.nsys-rep --trace-fork-before-exec=true --cuda-graph-trace=node` before any existing script you would run for offline inference.

The following is an example using the `benchmarks/benchmark_latency.py` script:

```bash
nsys profile -o report.nsys-rep --trace-fork-before-exec=true --cuda-graph-trace=node python benchmarks/benchmark_latency.py --model meta-llama/Llama-3.1-8B-Instruct --num-iters-warmup 5 --num-iters 1 --batch-size 16 --input-len 512 --output-len 8
```

#### OpenAI Server

To profile the server, you will want to prepend your `vllm serve` command with `nsys profile` just like for offline inference, however you must specify `--delay XX --duration YY` parameters according to the needs of your benchmark. After the duration time has been used up, the server will be killed.

```bash
# server
nsys profile -o report.nsys-rep --trace-fork-before-exec=true --cuda-graph-trace=node --delay 30 --duration 60 vllm serve meta-llama/Llama-3.1-8B-Instruct

# client
python benchmarks/benchmark_serving.py --backend vllm --model meta-llama/Llama-3.1-8B-Instruct --num-prompts 1 --dataset-name random --random-input 1024 --random-output 512
```

In practice, you should set the `--duration` argument to a large value. Whenever you want the server to stop profiling, run:

```
nsys sessions list
```

to get the session id in the form of `profile-XXXXX`, then run:

```
nsys stop --session=profile-XXXXX
```

to manually kill the profiler and generate your `nsys-rep` report.

#### Analysis

You can view these profiles either as summaries in the CLI, using `nsys stats [profile-file]`, or in the GUI by installing Nsight [locally following the directions here](https://developer.nvidia.com/nsight-systems/get-started).

CLI example:

```bash
nsys stats report1.nsys-rep
...
 ** CUDA GPU Kernel Summary (cuda_gpu_kern_sum):

 Time (%)  Total Time (ns)  Instances   Avg (ns)     Med (ns)    Min (ns)  Max (ns)   StdDev (ns)                                                  Name                                                
 --------  ---------------  ---------  -----------  -----------  --------  ---------  -----------  ----------------------------------------------------------------------------------------------------
     46.3   10,327,352,338     17,505    589,965.9    144,383.0    27,040  3,126,460    944,263.8  sm90_xmma_gemm_bf16bf16_bf16f32_f32_tn_n_tilesize128x128x64_warpgroupsize1x1x1_execute_segment_k_of…
     14.8    3,305,114,764      5,152    641,520.7    293,408.0   287,296  2,822,716    867,124.9  sm90_xmma_gemm_bf16bf16_bf16f32_f32_tn_n_tilesize256x128x64_warpgroupsize2x1x1_execute_segment_k_of…
     12.1    2,692,284,876     14,280    188,535.4     83,904.0    19,328  2,862,237    497,999.9  sm90_xmma_gemm_bf16bf16_bf16f32_f32_tn_n_tilesize64x128x64_warpgroupsize1x1x1_execute_segment_k_off…
      9.5    2,116,600,578     33,920     62,399.8     21,504.0    15,326  2,532,285    290,954.1  sm90_xmma_gemm_bf16bf16_bf16f32_f32_tn_n_tilesize64x64x64_warpgroupsize1x1x1_execute_segment_k_off_…
      5.0    1,119,749,165     18,912     59,208.4      9,056.0     6,784  2,578,366    271,581.7  void vllm::act_and_mul_kernel<c10::BFloat16, &vllm::silu_kernel<c10::BFloat16>, (bool)1>(T1 *, cons…
      4.1      916,662,515     21,312     43,011.6     19,776.0     8,928  2,586,205    199,790.1  void cutlass::device_kernel<flash::enable_sm90_or_later<flash::FlashAttnFwdSm90<flash::CollectiveMa…
      2.6      587,283,113     37,824     15,526.7      3,008.0     2,719  2,517,756    139,091.1  std::enable_if<T2>(int)0&&vllm::_typeConvert<T1>::exists, void>::type vllm::fused_add_rms_norm_kern…
      1.9      418,362,605     18,912     22,121.5      3,871.0     3,328  2,523,870    175,248.2  void vllm::rotary_embedding_kernel<c10::BFloat16, (bool)1>(const long *, T1 *, T1 *, const T1 *, in…
      0.7      167,083,069     18,880      8,849.7      2,240.0     1,471  2,499,996    101,436.1  void vllm::reshape_and_cache_flash_kernel<__nv_bfloat16, __nv_bfloat16, (vllm::Fp8KVCacheDataType)0…
... 
```

GUI example:

<img width="1799" alt="Screenshot 2025-03-05 at 11 48 42 AM" src="https://github.com/user-attachments/assets/c7cff1ae-6d6f-477d-a342-bd13c4fc424c" />

## Profiling vLLM Python Code

The Python standard library includes
[cProfile](https://docs.python.org/3/library/profile.html) for profiling Python
code. vLLM includes a couple of helpers that make it easy to apply it to a section of vLLM.
Both the `vllm.utils.cprofile` and `vllm.utils.cprofile_context` functions can be
used to profile a section of code.

### Example usage - decorator

The first helper is a Python decorator that can be used to profile a function.
If a filename is specified, the profile will be saved to that file. If no filename is
specified, profile data will be printed to stdout.

```python
import vllm.utils

@vllm.utils.cprofile("expensive_function.prof")
def expensive_function():
    # some expensive code
    pass
```

### Example Usage - context manager

The second helper is a context manager that can be used to profile a block of
code. Similar to the decorator, the filename is optional.

```python
import vllm.utils

def another_function():
    # more expensive code
    pass

with vllm.utils.cprofile_context("another_function.prof"):
    another_function()
```

### Analyzing Profile Results

There are multiple tools available that can help analyze the profile results.
One example is [snakeviz](https://jiffyclub.github.io/snakeviz/).

```bash
pip install snakeviz
snakeviz expensive_function.prof
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
