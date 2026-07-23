# Quantization

This document introduces the model quantization schemes supported in SGLang and how to use them to reduce memory usage and accelerate inference.

## Nunchaku (SVDQuant)

### Introduction

**SVDQuant** is a Post-Training Quantization (PTQ) technique for diffusion models that quantizes model weights and activations to 4-bit precision (W4A4) while maintaining high visual quality. This method uses Singular Value Decomposition (SVD) to decompose the weight matrix into low-rank components and residuals, effectively absorbing outliers in activations, making 4-bit quantization possible.

**Nunchaku** is a high-performance inference engine that implements SVDQuant, optimized for low-bit neural networks. It is not Quantization-Aware Training (QAT), but directly quantizes pre-trained models.

Paper: [SVDQuant: Absorbing Outliers by Low-Rank Components for 4-Bit Diffusion Models](https://arxiv.org/abs/2411.05007) (ICLR 2025 Spotlight)

### Key Features

SVDQuant significantly reduces memory usage and accelerates inference while maintaining visual quality:

- **Memory Optimization**: Reduces memory usage by **3.6×** compared to BF16 models.
- **Inference Acceleration**:
  - **3.0×** faster than the NF4 (W4A16) baseline on desktop/laptop RTX 4090 GPUs.
  - **8.7×** speedup on laptop RTX 4090 by eliminating CPU offloading compared to 16-bit models.
  - **3.1×** faster than BF16 and NF4 models on RTX 5090 GPUs with NVFP4.

### Supported Precisions

Nunchaku supports two quantization precisions:

- **INT4**: Standard INT4 quantization, supported on NVIDIA GPUs with Compute Capability 7.0+ (RTX 20 series and above).
- **NVFP4**: FP4 quantization, providing better image quality on newer cards like the RTX 5090.

### Usage

#### 1. Install Nunchaku

```bash
pip install nunchaku
```

For more installation information, please refer to the [Nunchaku Official Documentation](https://nunchaku.tech/docs/nunchaku/installation/installation.html).

#### 2. Download Quantized Models

Nunchaku provides pre-quantized model weights available on Hugging Face:

- [nunchaku-ai/nunchaku-qwen-image](https://huggingface.co/nunchaku-ai/nunchaku-qwen-image)
- [nunchaku-ai/nunchaku-flux](https://huggingface.co/nunchaku-ai/nunchaku-flux)

Taking Qwen-Image as an example, several quantized models with different configurations are provided:

| Filename | Precision | Rank | Usage |
|----------|-----------|------|-------|
| `svdq-int4_r32-qwen-image.safetensors` | INT4 | 32 | Standard Version |
| `svdq-int4_r128-qwen-image.safetensors` | INT4 | 128 | High-Quality Version |
| `svdq-fp4_r32-qwen-image.safetensors` | NVFP4 | 32 | RTX 5090 Standard Version |
| `svdq-fp4_r128-qwen-image.safetensors` | NVFP4 | 128 | RTX 5090 High-Quality Version |
| `svdq-int4_r32-qwen-image-lightningv1.0-4steps.safetensors` | INT4 | 32 | Lightning 4-Step Version |
| `svdq-int4_r128-qwen-image-lightningv1.1-8steps.safetensors` | INT4 | 128 | Lightning 8-Step Version |

> **Note**: Higher Rank usually means better image quality, but with slightly increased memory usage and computation.

#### 3. Run Quantized Models

SGLang features **smart auto-detection** for Nunchaku models. In most cases, you only need to provide the path to the quantized weights, and the precision and rank will be automatically inferred from the filename.

**Simplified Command (Recommended):**

```bash
sglang generate \
  --model-path Qwen/Qwen-Image \
  --prompt "change the raccoon to a cute cat" \
  --save-output \
  --quantized-model-path /path/to/svdq-int4_r32-qwen-image.safetensors
```

**Manual Override (If needed):**

If your filename doesn't follow the standard naming convention, or you want to force specific settings:

- `--enable-svdquant`: Manually enable SVDQuant.
- `--quantization-precision`: Set to `int4` or `nvfp4`.
- `--quantization-rank`: Set the SVD rank (e.g., 32, 128).
- `--quantization-act-unsigned` (Optional): Use unsigned activation quantization.

Example with manual overrides:

```bash
sglang generate \
  --model-path Qwen/Qwen-Image \
  --prompt "a beautiful sunset" \
  --enable-svdquant \
  --quantized-model-path /path/to/custom_model.safetensors \
  --quantization-precision int4 \
  --quantization-rank 128
```

#### 4. Configuration Recommendations

Choose the appropriate configuration based on your hardware and requirements:

| Scenario | Recommended Config | Description |
|----------|-------------------|-------------|
| Standard Use (20/30/40 Series GPU) | INT4 + Rank 32 | Balanced performance and quality |
| Quality Focus (Sufficient VRAM) | INT4 + Rank 128 | Better image quality |
| RTX 5090 Standard Use | NVFP4 + Rank 32 | Utilizes FP4 hardware acceleration |
| RTX 5090 Quality Focus | NVFP4 + Rank 128 | Best image quality |
| Fast Prototyping/Preview | Lightning 4-Step Version | Extremely fast generation, slightly reduced quality |

### Notes

1.  Model Path Correspondence: `--model-path` should point to the original non-quantized model (for loading config and tokenizer, etc.), while `--quantized-model-path` points to the quantized weight file.

2.  Auto-Detection Requirements: For auto-detection to work, the filename must contain the pattern `svdq-{precision}_r{rank}` (e.g., `svdq-int4_r32`).

3.  GPU Compatibility:
    -   INT4: Supports NVIDIA GPUs with Compute Capability 7.0+ (RTX 20 series and above).
    -   NVFP4: Optimized mainly for newer cards like the RTX 50 series that support FP4.

4.  Lightning Models: When using Lightning versions, adjust `--num-inference-steps` accordingly (usually 4 or 8 steps).

### Custom Model Quantization

If you want to quantize your own models, you can use the [DeepCompressor](https://github.com/mit-han-lab/deepcompressor) tool. For detailed instructions, please refer to the Nunchaku official documentation.

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
