# vLLM V1

**We have started the process of deprecating V0. Please read [RFC #18571](https://github.com/vllm-project/vllm/issues/18571) for more details.**

V1 is now enabled by default for all supported use cases, and we will gradually enable it for every use case we plan to support. Please share any feedback on [GitHub](https://github.com/vllm-project/vllm) or in the [vLLM Slack](https://inviter.co/vllm-slack).

To disable V1, please set the environment variable as: `VLLM_USE_V1=0`, and send us a GitHub issue sharing the reason!

## Why vLLM V1?

vLLM V0 successfully supported a wide range of models and hardware, but as new features were developed independently, the system grew increasingly complex. This complexity made it harder to integrate new capabilities and introduced technical debt, revealing the need for a more streamlined and unified design.

Building on V0’s success, vLLM V1 retains the stable and proven components from V0
(such as the models, GPU kernels, and utilities). At the same time, it significantly
re-architects the core systems, covering the scheduler, KV cache manager, worker,
sampler, and API server, to provide a cohesive, maintainable framework that better
accommodates continued growth and innovation.

Specifically, V1 aims to:

- Provide a **simple, modular, and easy-to-hack codebase**.
- Ensure **high performance** with near-zero CPU overhead.
- **Combine key optimizations** into a unified architecture.
- Require **zero configs** by enabling features/optimizations by default.

We see significant performance improvements from upgrading to V1 core engine, in
particular for long context scenarios. Please see performance benchmark (To be
added).

For more details, check out the vLLM V1 blog post [vLLM V1: A Major
Upgrade to vLLM’s Core Architecture](https://blog.vllm.ai/2025/01/27/v1-alpha-release.html) (published Jan 27, 2025).

This living user guide outlines a few known **important changes and limitations** introduced by vLLM V1. The team has been working actively to bring V1 as the default engine, therefore this guide will be updated constantly as more features get supported on vLLM V1.

### Supports Overview
#### Hardware

| Hardware | Status                                   |
|----------|------------------------------------------|
| **NVIDIA** | <nobr>🚀 Natively Supported</nobr>         |
| **AMD**    | <nobr>🚧 WIP</nobr>           |
| **TPU**    | <nobr>🚧 WIP</nobr>           |
| **CPU**    | <nobr>🚧 WIP</nobr>           |

#### Feature / Model

| Feature / Model | Status |
|-----------------|-----------------------------------------------------------------------------------|
| **Prefix Caching**                    | <nobr>🚀 Optimized</nobr>                                                        |
| **Chunked Prefill**                    | <nobr>🚀 Optimized</nobr>                                                        |
| **LoRA**                                    | <nobr>🚀 Optimized</nobr>                                                         |
| **Logprobs Calculation**                    | <nobr>🟢 Functional</nobr>                                                        |
| **Multimodal Models**                       | <nobr>🟢 Functional</nobr>                                                        |
| **FP8 KV Cache**                            | <nobr>🟢 Functional on Hopper devices ([PR #15191](https://github.com/vllm-project/vllm/pull/15191))</nobr>|
| **Spec Decode**                             | <nobr>🚧 WIP ([PR #13933](https://github.com/vllm-project/vllm/pull/13933))</nobr>|
| **Prompt Logprobs with Prefix Caching**     | <nobr>🟡 Planned ([RFC #13414](https://github.com/vllm-project/vllm/issues/13414))</nobr>|
| **Structured Output Alternative Backends**  | <nobr>🟡 Planned</nobr>                                                           |
| **Embedding Models**                        | <nobr>🚧 WIP ([PR #16188](https://github.com/vllm-project/vllm/pull/16188))</nobr> |
| **Mamba Models**                            | <nobr>🟡 Planned</nobr>                                                           |
| **Encoder-Decoder Models**                  | <nobr>🟠 Delayed</nobr>                                                           |
| **Request-level Structured Output Backend** | <nobr>🔴 Deprecated</nobr>                                                        |
| **best_of**                                 | <nobr>🔴 Deprecated ([RFC #13361](https://github.com/vllm-project/vllm/issues/13361))</nobr>|
| **Per-Request Logits Processors**           | <nobr>🔴 Deprecated ([RFC #13360](https://github.com/vllm-project/vllm/pull/13360))</nobr> |
| **GPU <> CPU KV Cache Swapping**            | <nobr>🔴 Deprecated</nobr>                                                        |

- **🚀 Optimized**: Nearly fully optimized, with no further work currently planned.
- **🟢 Functional**: Fully operational, with ongoing optimizations.  
- **🚧 WIP**: Under active development.  
- **🟡 Planned**: Scheduled for future implementation (some may have open PRs/RFCs).  
- **🟠 Delayed**: Temporarily dropped in V1 but planned to be re-introduced later.
- **🔴 Deprecated**: Not planned for V1 unless there is strong demand.

**Note**: vLLM V1’s unified scheduler treats both prompt and output tokens the same
way by using a simple dictionary (e.g., `{request_id: num_tokens}`) to dynamically
allocate a fixed token budget per request, enabling features like chunked prefills,
prefix caching, and speculative decoding without a strict separation between prefill
and decode phases.

### Semantic Changes and Deprecated Features

#### Logprobs

vLLM V1 supports logprobs and prompt logprobs. However, there are some important semantic
differences compared to V0:

**Logprobs Calculation**

Logprobs in V1 are now returned immediately once computed from the model’s raw output (i.e.
before applying any logits post-processing such as temperature scaling or penalty
adjustments). As a result, the returned logprobs do not reflect the final adjusted
probabilities used during sampling.

Support for logprobs with post-sampling adjustments is in progress and will be added in future updates.

**Prompt Logprobs with Prefix Caching**

Currently prompt logprobs are only supported when prefix caching is turned off via `--no-enable-prefix-caching`. In a future release, prompt logprobs will be compatible with prefix caching, but a recomputation will be triggered to recover the full prompt logprobs even upon a prefix cache hit. See details in [RFC #13414](https://github.com/vllm-project/vllm/issues/13414).

#### Deprecated Features

As part of the major architectural rework in vLLM V1, several legacy features have been deprecated.

**Sampling features**

- **best_of**: This feature has been deprecated due to limited usage. See details at [RFC #13361](https://github.com/vllm-project/vllm/issues/13361).
- **Per-Request Logits Processors**: In V0, users could pass custom
  processing functions to adjust logits on a per-request basis. In vLLM V1, this
  feature has been deprecated. Instead, the design is moving toward supporting **global logits
  processors**, a feature the team is actively working on for future releases. See details at [RFC #13360](https://github.com/vllm-project/vllm/pull/13360).

**KV Cache features**

- **GPU <> CPU KV Cache Swapping**: with the new simplified core architecture, vLLM V1 no longer requires KV cache swapping
to handle request preemptions.

**Structured Output features**

- **Request-level Structured Output Backend**: Deprecated, alternative backends
  (outlines, guidance) with fallbacks is WIP.
### Feature & Model Support in Progress

Although we have re-implemented and partially optimized many features and models from V0 in vLLM V1, optimization work is still ongoing for some, and others remain unsupported.

#### Features to Be Optimized

These features are already supported in vLLM V1, but their optimization is still
in progress.

- **Spec Decode**: Currently, only ngram-based spec decode is supported in V1. There
  will be follow-up work to support other types of spec decode (e.g., see [PR #13933](https://github.com/vllm-project/vllm/pull/13933)). We will prioritize the support for Eagle, MTP compared to draft model based spec decode.

- **Multimodal Models**: V1 is almost fully compatible with V0 except that interleaved modality input is not supported yet.
  See [here](https://github.com/orgs/vllm-project/projects/8) for the status of upcoming features and optimizations.

#### Features to Be Supported

- **Structured Output Alternative Backends**: Structured output alternative backends (outlines, guidance) support is planned. V1 currently
  supports only the `xgrammar:no_fallback` mode, meaning that it will error out if the output schema is unsupported by xgrammar.
  Details about the structured outputs can be found
  [here](https://docs.vllm.ai/en/latest/features/structured_outputs.html).

#### Models to Be Supported

vLLM V1 currently excludes model architectures with the `SupportsV0Only` protocol,
and the majority fall into the following categories. V1 support for these models will be added eventually.

**Embedding Models**  
The initial support will be provided by [PR #16188](https://github.com/vllm-project/vllm/pull/16188).

Later, we will consider using [hidden states processor](https://github.com/vllm-project/vllm/issues/12249), which is based on [global logits processor](https://github.com/vllm-project/vllm/pull/13360) to enable simultaneous generation and embedding using the same engine instance in V1.

**Mamba Models**  
Models using selective state-space mechanisms (instead of standard transformer attention)
are not yet supported (e.g., `MambaForCausalLM`, `JambaForCausalLM`).

**Encoder-Decoder Models**  
vLLM V1 is currently optimized for decoder-only transformers. Models requiring
  cross-attention between separate encoder and decoder are not yet supported (e.g., `BartForConditionalGeneration`, `MllamaForConditionalGeneration`).

For a complete list of supported models, see the [list of supported models](https://docs.vllm.ai/en/latest/models/supported_models.html).

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
