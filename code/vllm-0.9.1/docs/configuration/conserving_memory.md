# Conserving Memory

Large models might cause your machine to run out of memory (OOM). Here are some options that help alleviate this problem.

## Tensor Parallelism (TP)

Tensor parallelism (`tensor_parallel_size` option) can be used to split the model across multiple GPUs.

The following code splits the model across 2 GPUs.

```python
from vllm import LLM

llm = LLM(model="ibm-granite/granite-3.1-8b-instruct",
          tensor_parallel_size=2)
```

!!! warning
    To ensure that vLLM initializes CUDA correctly, you should avoid calling related functions (e.g. [torch.cuda.set_device][])
    before initializing vLLM. Otherwise, you may run into an error like `RuntimeError: Cannot re-initialize CUDA in forked subprocess`.

    To control which devices are used, please instead set the `CUDA_VISIBLE_DEVICES` environment variable.

!!! note
    With tensor parallelism enabled, each process will read the whole model and split it into chunks, which makes the disk reading time even longer (proportional to the size of tensor parallelism).

    You can convert the model checkpoint to a sharded checkpoint using <gh-file:examples/offline_inference/save_sharded_state.py>. The conversion process might take some time, but later you can load the sharded checkpoint much faster. The model loading time should remain constant regardless of the size of tensor parallelism.

## Quantization

Quantized models take less memory at the cost of lower precision.

Statically quantized models can be downloaded from HF Hub (some popular ones are available at [Red Hat AI](https://huggingface.co/RedHatAI))
and used directly without extra configuration.

Dynamic quantization is also supported via the `quantization` option -- see [here][quantization-index] for more details.

## Context length and batch size

You can further reduce memory usage by limiting the context length of the model (`max_model_len` option)
and the maximum batch size (`max_num_seqs` option).

```python
from vllm import LLM

llm = LLM(model="adept/fuyu-8b",
          max_model_len=2048,
          max_num_seqs=2)
```

## Reduce CUDA Graphs

By default, we optimize model inference using CUDA graphs which take up extra memory in the GPU.

!!! warning
    CUDA graph capture takes up more memory in V1 than in V0.

You can adjust `compilation_config` to achieve a better balance between inference speed and memory usage:

```python
from vllm import LLM
from vllm.config import CompilationConfig, CompilationLevel

llm = LLM(
    model="meta-llama/Llama-3.1-8B-Instruct",
    compilation_config=CompilationConfig(
        level=CompilationLevel.PIECEWISE,
        # By default, it goes up to max_num_seqs
        cudagraph_capture_sizes=[1, 2, 4, 8, 16],
    ),
)
```

You can disable graph capturing completely via the `enforce_eager` flag:

```python
from vllm import LLM

llm = LLM(model="meta-llama/Llama-3.1-8B-Instruct",
          enforce_eager=True)
```

## Adjust cache size

If you run out of CPU RAM, try the following options:

- (Multi-modal models only) you can set the size of multi-modal input cache using `VLLM_MM_INPUT_CACHE_GIB` environment variable (default 4 GiB).
- (CPU backend only) you can set the size of KV cache using `VLLM_CPU_KVCACHE_SPACE` environment variable (default 4 GiB).

## Multi-modal input limits

You can allow a smaller number of multi-modal items per prompt to reduce the memory footprint of the model:

```python
from vllm import LLM

# Accept up to 3 images and 1 video per prompt
llm = LLM(model="Qwen/Qwen2.5-VL-3B-Instruct",
          limit_mm_per_prompt={"image": 3, "video": 1})
```

You can go a step further and disable unused modalities completely by setting its limit to zero.
For example, if your application only accepts image input, there is no need to allocate any memory for videos.

```python
from vllm import LLM

# Accept any number of images but no videos
llm = LLM(model="Qwen/Qwen2.5-VL-3B-Instruct",
          limit_mm_per_prompt={"video": 0})
```

You can even run a multi-modal model for text-only inference:

```python
from vllm import LLM

# Don't accept images. Just text.
llm = LLM(model="google/gemma-3-27b-it",
          limit_mm_per_prompt={"image": 0})
```

## Multi-modal processor arguments

For certain models, you can adjust the multi-modal processor arguments to
reduce the size of the processed multi-modal inputs, which in turn saves memory.

Here are some examples:

```python
from vllm import LLM

# Available for Qwen2-VL series models
llm = LLM(model="Qwen/Qwen2.5-VL-3B-Instruct",
          mm_processor_kwargs={
              "max_pixels": 768 * 768,  # Default is 1280 * 28 * 28
          })

# Available for InternVL series models
llm = LLM(model="OpenGVLab/InternVL2-2B",
          mm_processor_kwargs={
              "max_dynamic_patch": 4,  # Default is 12
          })
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
