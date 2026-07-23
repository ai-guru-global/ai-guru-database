# CPU

vLLM is a Python library that supports the following CPU variants. Select your CPU type to see vendor specific instructions:

=== "Intel/AMD x86"

    --8<-- "docs/getting_started/installation/cpu/x86.inc.md:installation"

=== "ARM AArch64"

    --8<-- "docs/getting_started/installation/cpu/arm.inc.md:installation"

=== "Apple silicon"

    --8<-- "docs/getting_started/installation/cpu/apple.inc.md:installation"

=== "IBM Z (S390X)"

    --8<-- "docs/getting_started/installation/cpu/s390x.inc.md:installation"

## Requirements

- Python: 3.9 -- 3.12

=== "Intel/AMD x86"

    --8<-- "docs/getting_started/installation/cpu/x86.inc.md:requirements"

=== "ARM AArch64"

    --8<-- "docs/getting_started/installation/cpu/arm.inc.md:requirements"

=== "Apple silicon"

    --8<-- "docs/getting_started/installation/cpu/apple.inc.md:requirements"

=== "IBM Z (S390X)"

    --8<-- "docs/getting_started/installation/cpu/s390x.inc.md:requirements"

## Set up using Python

### Create a new Python environment

--8<-- "docs/getting_started/installation/python_env_setup.inc.md"

### Pre-built wheels

Currently, there are no pre-built CPU wheels.

### Build wheel from source

=== "Intel/AMD x86"

    --8<-- "docs/getting_started/installation/cpu/x86.inc.md:build-wheel-from-source"

=== "ARM AArch64"

    --8<-- "docs/getting_started/installation/cpu/arm.inc.md:build-wheel-from-source"

=== "Apple silicon"

    --8<-- "docs/getting_started/installation/cpu/apple.inc.md:build-wheel-from-source"

=== "IBM Z (s390x)"

    --8<-- "docs/getting_started/installation/cpu/s390x.inc.md:build-wheel-from-source"

## Set up using Docker

### Pre-built images

=== "Intel/AMD x86"

    --8<-- "docs/getting_started/installation/cpu/x86.inc.md:pre-built-images"

### Build image from source

```console
$ docker build -f docker/Dockerfile.cpu --tag vllm-cpu-env --target vllm-openai .

# Launching OpenAI server 
$ docker run --rm \
             --privileged=true \
             --shm-size=4g \
             -p 8000:8000 \
             -e VLLM_CPU_KVCACHE_SPACE=<KV cache space> \
             -e VLLM_CPU_OMP_THREADS_BIND=<CPU cores for inference> \
             vllm-cpu-env \
             --model=meta-llama/Llama-3.2-1B-Instruct \
             --dtype=bfloat16 \
             other vLLM OpenAI server arguments
```

!!! tip
    For ARM or Apple silicon, use `docker/Dockerfile.arm`

!!! tip
    For IBM Z (s390x), use `docker/Dockerfile.s390x` and in `docker run` use flag `--dtype float`

## Supported features

vLLM CPU backend supports the following vLLM features:

- Tensor Parallel
- Model Quantization (`INT8 W8A8, AWQ, GPTQ`)
- Chunked-prefill
- Prefix-caching
- FP8-E5M2 KV cache

## Related runtime environment variables

- `VLLM_CPU_KVCACHE_SPACE`: specify the KV Cache size (e.g, `VLLM_CPU_KVCACHE_SPACE=40` means 40 GiB space for KV cache), larger setting will allow vLLM running more requests in parallel. This parameter should be set based on the hardware configuration and memory management pattern of users. Default value is `0`.
- `VLLM_CPU_OMP_THREADS_BIND`: specify the CPU cores dedicated to the OpenMP threads. For example, `VLLM_CPU_OMP_THREADS_BIND=0-31` means there will be 32 OpenMP threads bound on 0-31 CPU cores. `VLLM_CPU_OMP_THREADS_BIND=0-31|32-63` means there will be 2 tensor parallel processes, 32 OpenMP threads of rank0 are bound on 0-31 CPU cores, and the OpenMP threads of rank1 are bound on 32-63 CPU cores. By setting to `auto`, the OpenMP threads of each rank are bound to the CPU cores in each NUMA node. By setting to `all`, the OpenMP threads of each rank uses all CPU cores available on the system. Default value is `auto`.
- `VLLM_CPU_NUM_OF_RESERVED_CPU`: specify the number of CPU cores which are not dedicated to the OpenMP threads for each rank. The variable only takes effect when VLLM_CPU_OMP_THREADS_BIND is set to `auto`. Default value is `0`.
- `VLLM_CPU_MOE_PREPACK`: whether to use prepack for MoE layer. This will be passed to `ipex.llm.modules.GatedMLPMOE`. Default is `1` (True). On unsupported CPUs, you might need to set this to `0` (False).

## Performance tips

- We highly recommend to use TCMalloc for high performance memory allocation and better cache locality. For example, on Ubuntu 22.4, you can run:

```console
sudo apt-get install libtcmalloc-minimal4 # install TCMalloc library
find / -name *libtcmalloc* # find the dynamic link library path
export LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libtcmalloc_minimal.so.4:$LD_PRELOAD # prepend the library to LD_PRELOAD
python examples/offline_inference/basic/basic.py # run vLLM
```

- When using the online serving, it is recommended to reserve 1-2 CPU cores for the serving framework to avoid CPU oversubscription. For example, on a platform with 32 physical CPU cores, reserving CPU 30 and 31 for the framework and using CPU 0-29 for OpenMP:

```console
export VLLM_CPU_KVCACHE_SPACE=40
export VLLM_CPU_OMP_THREADS_BIND=0-29
vllm serve facebook/opt-125m
```

 or using default auto thread binding:

```console
export VLLM_CPU_KVCACHE_SPACE=40
export VLLM_CPU_NUM_OF_RESERVED_CPU=2
vllm serve facebook/opt-125m
```

- If using vLLM CPU backend on a machine with hyper-threading, it is recommended to bind only one OpenMP thread on each physical CPU core using `VLLM_CPU_OMP_THREADS_BIND` or using auto thread binding feature by default. On a hyper-threading enabled platform with 16 logical CPU cores / 8 physical CPU cores:

```console
$ lscpu -e # check the mapping between logical CPU cores and physical CPU cores

# The "CPU" column means the logical CPU core IDs, and the "CORE" column means the physical core IDs. On this platform, two logical cores are sharing one physical core.
CPU NODE SOCKET CORE L1d:L1i:L2:L3 ONLINE    MAXMHZ   MINMHZ      MHZ
0    0      0    0 0:0:0:0          yes 2401.0000 800.0000  800.000
1    0      0    1 1:1:1:0          yes 2401.0000 800.0000  800.000
2    0      0    2 2:2:2:0          yes 2401.0000 800.0000  800.000
3    0      0    3 3:3:3:0          yes 2401.0000 800.0000  800.000
4    0      0    4 4:4:4:0          yes 2401.0000 800.0000  800.000
5    0      0    5 5:5:5:0          yes 2401.0000 800.0000  800.000
6    0      0    6 6:6:6:0          yes 2401.0000 800.0000  800.000
7    0      0    7 7:7:7:0          yes 2401.0000 800.0000  800.000
8    0      0    0 0:0:0:0          yes 2401.0000 800.0000  800.000
9    0      0    1 1:1:1:0          yes 2401.0000 800.0000  800.000
10   0      0    2 2:2:2:0          yes 2401.0000 800.0000  800.000
11   0      0    3 3:3:3:0          yes 2401.0000 800.0000  800.000
12   0      0    4 4:4:4:0          yes 2401.0000 800.0000  800.000
13   0      0    5 5:5:5:0          yes 2401.0000 800.0000  800.000
14   0      0    6 6:6:6:0          yes 2401.0000 800.0000  800.000
15   0      0    7 7:7:7:0          yes 2401.0000 800.0000  800.000

# On this platform, it is recommend to only bind openMP threads on logical CPU cores 0-7 or 8-15
$ export VLLM_CPU_OMP_THREADS_BIND=0-7
$ python examples/offline_inference/basic/basic.py
```

- If using vLLM CPU backend on a multi-socket machine with NUMA, be aware to set CPU cores using `VLLM_CPU_OMP_THREADS_BIND` to avoid cross NUMA node memory access.

## Other considerations

- The CPU backend significantly differs from the GPU backend since the vLLM architecture was originally optimized for GPU use. A number of optimizations are needed to enhance its performance.

- Decouple the HTTP serving components from the inference components. In a GPU backend configuration, the HTTP serving and tokenization tasks operate on the CPU, while inference runs on the GPU, which typically does not pose a problem. However, in a CPU-based setup, the HTTP serving and tokenization can cause significant context switching and reduced cache efficiency. Therefore, it is strongly recommended to segregate these two components for improved performance.

- On CPU based setup with NUMA enabled, the memory access performance may be largely impacted by the [topology](https://github.com/intel/intel-extension-for-pytorch/blob/main/docs/tutorials/performance_tuning/tuning_guide.md#non-uniform-memory-access-numa). For NUMA architecture, Tensor Parallel is a option for better performance.

  - Tensor Parallel is supported for serving and offline inferencing. In general each NUMA node is treated as one GPU card. Below is the example script to enable Tensor Parallel = 2 for serving:

    ```console
    VLLM_CPU_KVCACHE_SPACE=40 VLLM_CPU_OMP_THREADS_BIND="0-31|32-63" vllm serve meta-llama/Llama-2-7b-chat-hf -tp=2 --distributed-executor-backend mp
    ```

    or using default auto thread binding:

    ```console
    VLLM_CPU_KVCACHE_SPACE=40 vllm serve meta-llama/Llama-2-7b-chat-hf -tp=2 --distributed-executor-backend mp
    ```

  - For each thread id list in `VLLM_CPU_OMP_THREADS_BIND`, users should guarantee threads in the list belong to a same NUMA node.

  - Meanwhile, users should also take care of memory capacity of each NUMA node. The memory usage of each TP rank is the sum of `weight shard size` and `VLLM_CPU_KVCACHE_SPACE`, if it exceeds the capacity of a single NUMA node, TP worker will be killed due to out-of-memory.

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
