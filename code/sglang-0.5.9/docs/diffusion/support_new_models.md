# How to Support New Diffusion Models

This document explains how to add support for new diffusion models in SGLang diffusion.

## Architecture Overview

SGLang diffusion is engineered for both performance and flexibility, built upon a modular pipeline architecture. This
design allows developers to easily construct complex, customized pipelines for various diffusion models by combining and
reusing different components.

At its core, the architecture revolves around two key concepts, as highlighted in our [blog post](https://lmsys.org/blog/2025-11-07-sglang-diffusion/#architecture):

-   **`ComposedPipeline`**: This class orchestrates a series of `PipelineStage`s to define the complete generation process for a specific model. It acts as the main entry point for a model and manages the data flow between the different stages of the diffusion process.
-   **`PipelineStage`**: Each stage is a modular component that encapsulates a common function within the diffusion process. Examples include prompt encoding, the denoising loop, or VAE decoding. These stages are designed to be self-contained and reusable across different pipelines.

## Key Components for Implementation

To add support for a new diffusion model, you will primarily need to define or configure the following components:

1.  **`PipelineConfig`**: This is a dataclass that holds all the static configurations for your model pipeline. It includes paths to model components (like UNet, VAE, text encoders), precision settings (e.g., `fp16`, `bf16`), and other model-specific architectural parameters. Each model typically has its own subclass of `PipelineConfig`.

2.  **`SamplingParams`**: This dataclass defines the parameters that control the generation process at runtime. These are the user-provided inputs for a generation request, such as the `prompt`, `negative_prompt`, `guidance_scale`, `num_inference_steps`, `seed`, output dimensions (`height`, `width`), etc.

3.  **`ComposedPipeline` (not a config)**: This is the central class where you define the structure of your model's generation pipeline. You will create a new class that inherits from `ComposedPipelineBase` and, within it, instantiate and chain together the necessary `PipelineStage`s in the correct order. See `ComposedPipelineBase` and `PipelineStage` base definitions:
    - [`ComposedPipelineBase`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/pipelines/composed_pipeline_base.py)
    - [`PipelineStage`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/pipelines/stages/base.py)
    - [Central registry (models/config mapping)](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/registry.py)

4.  **Modules (components referenced by the pipeline)**: Each pipeline references a set of modules that are loaded from the model repository (e.g., Diffusers `model_index.json`) and assembled via the registry/loader. Common modules include:
    - `text_encoder`: Encodes text prompts into embeddings
    - `tokenizer`: Tokenizes raw text input for the text encoder(s).
    - `processor`: Preprocesses images and extracts features; often used in image-to-image tasks.
    - `image_encoder`: Specialized image feature extractor (may be distinct from or combined with `processor`).
    - `dit/transformer`: The core denoising network (DiT/UNet architecture) operating in latent space.
    - `scheduler`: Controls the timestep schedule and denoising dynamics throughout inference.
    - `vae`: Variational Autoencoder for encoding/decoding between pixel space and latent space.

## Available Pipeline Stages

You can build your custom `ComposedPipeline` by combining the following available stages as needed. Each stage is responsible for a specific part of the generation process.

| Stage Class                      | Description                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `InputValidationStage`           | Validates the user-provided `SamplingParams` to ensure they are correct before starting the pipeline.     |
| `TextEncodingStage`              | Encodes text prompts into embeddings using one or more text encoders.                                   |
| `ImageEncodingStage`             | Encodes input images into embeddings, often used in image-to-image tasks.                               |
| `ImageVAEEncodingStage`          | Specifically encodes an input image into the latent space using a Variational Autoencoder (VAE).        |
| `TimestepPreparationStage`       | Prepares the scheduler's timesteps for the diffusion process.                                           |
| `LatentPreparationStage`         | Creates the initial noisy latent tensor that will be denoised.                                          |
| `DenoisingStage`                 | Executes the main denoising loop, iteratively applying the model (e.g., UNet) to refine the latents.    |
| `DecodingStage`                  | Decodes the final latent tensor from the denoising loop back into pixel space (e.g., an image) using the VAE. |
| `DmdDenoisingStage`              | A specialized denoising stage for certain model architectures.                                          |
| `CausalDMDDenoisingStage`        | A specialized causal denoising stage for specific video models.                                         |

## Example: Implementing `Qwen-Image-Edit`

To illustrate the process, let's look at how `Qwen-Image-Edit` is implemented. The typical implementation order is:

1.  **Analyze Required Modules**:
    - Study the target model's components by examining its `model_index.json` or Diffusers implementation to identify required modules:
      - `processor`: Image preprocessing and feature extraction
      - `scheduler`: Diffusion timestep scheduling
      - `text_encoder`: Text-to-embedding conversion
      - `tokenizer`: Text tokenization for the encoder
      - `transformer`: Core DiT denoising network
      - `vae`: Variational autoencoder for latent encoding/decoding

2.  **Create Configs**:
    - **PipelineConfig**: [`QwenImageEditPipelineConfig`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/configs/pipelines/qwen_image.py) defines model-specific parameters, precision settings, preprocessing functions, and latent shape calculations.
    - **SamplingParams**: [`QwenImageSamplingParams`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/configs/sample/qwenimage.py) sets runtime defaults like `num_frames=1`, `guidance_scale=4.0`, `num_inference_steps=50`.

3.  **Implement Model Components**:
    - Adapt or implement specific model components in the appropriate directories:
      - **DiT/Transformer**: Implement in [`runtime/models/dits/`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/models/dits/) - e.g., [`qwen_image.py`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/models/dits/qwen_image.py) for Qwen's DiT architecture
      - **Encoders**: Implement in [`runtime/models/encoders/`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/models/encoders/) - e.g., text encoders like [`qwen2_5vl.py`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/models/encoders/qwen2_5vl.py)
      - **VAEs**: Implement in [`runtime/models/vaes/`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/models/vaes/) - e.g., [`autoencoder_kl_qwenimage.py`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/models/vaes/autoencoder_kl_qwenimage.py)
      - **Schedulers**: Implement in [`runtime/models/schedulers/`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/models/schedulers/) if needed
    - These components handle the core model logic, attention mechanisms, and data transformations specific to the target diffusion model.

4.  **Define Pipeline Class**:
    - The [`QwenImageEditPipeline`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/runtime/architectures/basic/qwen_image/qwen_image.py) class inherits from `ComposedPipelineBase` and orchestrates stages sequentially.
    - Declare required modules via `_required_config_modules` and implement the pipeline stages:

    ```python
    class QwenImageEditPipeline(ComposedPipelineBase):
        pipeline_name = "QwenImageEditPipeline"  # Matches Diffusers model_index.json
        _required_config_modules = ["processor", "scheduler", "text_encoder", "tokenizer", "transformer", "vae"]

        def create_pipeline_stages(self, server_args: ServerArgs):
            self.add_stage(InputValidationStage())
            self.add_stage(ImageEncodingStage(...))
            self.add_stage(ImageVAEEncodingStage(...))
            self.add_stage(TimestepPreparationStage(...))
            self.add_stage(LatentPreparationStage(...))
            self.add_stage(DenoisingStage(...))
            self.add_stage(DecodingStage(...))
    ```
    The pipeline is constructed by adding stages in order. `Qwen-Image-Edit` uses `ImageEncodingStage` (for prompt and image processing) and `ImageVAEEncodingStage` (for latent extraction) before standard denoising and decoding.

5.  **Register Configs**:
    - Register the configs in the central registry ([`registry.py`](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/registry.py)) via `_register_configs` to enable automatic loading and instantiation for the model. Modules are automatically loaded and injected based on the config and repository structure.

By following this pattern of defining configurations and composing pipelines, you can integrate new diffusion models
into SGLang with ease.

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
