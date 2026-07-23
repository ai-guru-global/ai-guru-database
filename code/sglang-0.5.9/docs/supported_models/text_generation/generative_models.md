# Large Language Models

These models accept text input and produce text output (e.g., chat completions). They are primarily large language models (LLMs), some with mixture-of-experts (MoE) architectures for scaling.

## Example launch Command

```shell
python3 -m sglang.launch_server \
  --model-path meta-llama/Llama-3.2-1B-Instruct \  # example HF/local path
  --host 0.0.0.0 \
  --port 30000 \
```

## Supported models

Below the supported models are summarized in a table.

If you are unsure if a specific architecture is implemented, you can search for it via GitHub. For example, to search for `Qwen3ForCausalLM`, use the expression:

```
repo:sgl-project/sglang path:/^python\/sglang\/srt\/models\// Qwen3ForCausalLM
```

in the GitHub search bar.

| Model Family (Variants)             | Example HuggingFace Identifier                     | Description                                                                            |
|-------------------------------------|--------------------------------------------------|----------------------------------------------------------------------------------------|
| **DeepSeek** (v1, v2, v3/R1)        | `deepseek-ai/DeepSeek-R1`                        | Series of advanced reasoning-optimized models (including a 671B MoE) trained with reinforcement learning; top performance on complex reasoning, math, and code tasks. [SGLang provides Deepseek v3/R1 model-specific optimizations](../basic_usage/deepseek.md) and [Reasoning Parser](../advanced_features/separate_reasoning.ipynb)|
| **Kimi K2** (Thinking, Instruct)    | `moonshotai/Kimi-K2-Instruct`                    | Moonshot AI's 1 trillion parameter MoE model (32B active) with 128K–256K context; state-of-the-art agentic intelligence with stable long-horizon agency across 200–300 sequential tool calls. Features MLA attention and native INT4 quantization. [See Reasoning Parser docs](../advanced_features/separate_reasoning.ipynb)|
| **Kimi Linear** (48B-A3B)           | `moonshotai/Kimi-Linear-48B-A3B-Instruct`        | Moonshot AI's hybrid linear attention model (48B total, 3B active) with 1M token context; features Kimi Delta Attention (KDA) for up to 6× faster decoding and 75% KV cache reduction vs full attention. |
| **GPT-OSS**       | `openai/gpt-oss-20b`, `openai/gpt-oss-120b`       | OpenAI’s latest GPT-OSS series for complex reasoning, agentic tasks, and versatile developer use cases.|
| **Qwen** (3, 3MoE, 3Next, 2.5, 2 series)       | `Qwen/Qwen3-0.6B`, `Qwen/Qwen3-30B-A3B` `Qwen/Qwen3-Next-80B-A3B-Instruct `      | Alibaba’s latest Qwen3 series for complex reasoning, language understanding, and generation tasks; Support for MoE variants along with previous generation 2.5, 2, etc. [SGLang provides Qwen3 specific reasoning parser](../advanced_features/separate_reasoning.ipynb)|
| **Llama** (2, 3.x, 4 series)        | `meta-llama/Llama-4-Scout-17B-16E-Instruct`       | Meta's open LLM series, spanning 7B to 400B parameters (Llama 2, 3, and new Llama 4) with well-recognized performance. [SGLang provides Llama-4 model-specific optimizations](../basic_usage/llama4.md)  |
| **Mistral** (Mixtral, NeMo, Small3) | `mistralai/Mistral-7B-Instruct-v0.2`             | Open 7B LLM by Mistral AI with strong performance; extended into MoE (“Mixtral”) and NeMo Megatron variants for larger scale. |
| **Gemma** (v1, v2, v3)              | `google/gemma-3-1b-it`                            | Google’s family of efficient multilingual models (1B–27B); Gemma 3 offers a 128K context window, and its larger (4B+) variants support vision input. |
| **Phi** (Phi-1.5, Phi-2, Phi-3, Phi-4, Phi-MoE series) | `microsoft/Phi-4-multimodal-instruct`, `microsoft/Phi-3.5-MoE-instruct` | Microsoft’s Phi family of small models (1.3B–5.6B); Phi-4-multimodal (5.6B) processes text, images, and speech, Phi-4-mini is a high-accuracy text model and Phi-3.5-MoE is a mixture-of-experts model. |
| **MiniCPM** (v3, 4B)               | `openbmb/MiniCPM3-4B`                            | OpenBMB’s series of compact LLMs for edge devices; MiniCPM 3 (4B) achieves GPT-3.5-level results in text tasks. |
| **OLMo** (2, 3) | `allenai/OLMo-3-1125-32B`, `allenai/OLMo-3-32B-Think`, `allenai/OLMo-2-1124-7B-Instruct` | Allen AI’s series of Open Language Models designed to enable the science of language models. |
| **OLMoE** (Open MoE)               | `allenai/OLMoE-1B-7B-0924`                       | Allen AI’s open Mixture-of-Experts model (7B total, 1B active parameters) delivering state-of-the-art results with sparse expert activation. |
| **MiniMax-M2** (M2, M2.1)                     | `minimax/MiniMax-M2`, `minimax/MiniMax-M2.1`           | MiniMax’s SOTA LLM for coding & agentic workflows. |
| **StableLM** (3B, 7B)               | `stabilityai/stablelm-tuned-alpha-7b`            | StabilityAI’s early open-source LLM (3B & 7B) for general text generation; a demonstration model with basic instruction-following ability. |
| **Command-(R,A)** (Cohere)              | `CohereLabs/c4ai-command-r-v01`, `CohereLabs/c4ai-command-r7b-12-2024`, `CohereLabs/c4ai-command-a-03-2025`                 | Cohere’s open conversational LLM (Command series) optimized for long context, retrieval-augmented generation, and tool use. |
| **DBRX** (Databricks)              | `databricks/dbrx-instruct`                       | Databricks’ 132B-parameter MoE model (36B active) trained on 12T tokens; competes with GPT-3.5 quality as a fully open foundation model. |
| **Grok** (xAI)                     | `xai-org/grok-1`                                | xAI’s grok-1 model known for vast size(314B parameters) and high quality; integrated in SGLang for high-performance inference. |
| **ChatGLM** (GLM-130B family)       | `THUDM/chatglm2-6b`                              | Zhipu AI’s bilingual chat model (6B) excelling at Chinese-English dialogue; fine-tuned for conversational quality and alignment. |
| **InternLM 2** (7B, 20B)           | `internlm/internlm2-7b`                          | Next-gen InternLM (7B and 20B) from SenseTime, offering strong reasoning and ultra-long context support (up to 200K tokens). |
| **ExaONE 3** (Korean-English)      | `LGAI-EXAONE/EXAONE-3.5-7.8B-Instruct`           | LG AI Research’s Korean-English model (7.8B) trained on 8T tokens; provides high-quality bilingual understanding and generation. |
| **Baichuan 2** (7B, 13B)           | `baichuan-inc/Baichuan2-13B-Chat`                | BaichuanAI’s second-generation Chinese-English LLM (7B/13B) with improved performance and an open commercial license. |
| **XVERSE** (MoE)                   | `xverse/XVERSE-MoE-A36B`                         | Yuanxiang’s open MoE LLM (XVERSE-MoE-A36B: 255B total, 36B active) supporting ~40 languages; delivers 100B+ dense-level performance via expert routing. |
| **SmolLM** (135M–1.7B)            | `HuggingFaceTB/SmolLM-1.7B`                      | Hugging Face’s ultra-small LLM series (135M–1.7B params) offering surprisingly strong results, enabling advanced AI on mobile/edge devices. |
| **GLM-4** (Multilingual 9B)        | `ZhipuAI/glm-4-9b-chat`                          | Zhipu’s GLM-4 series (up to 9B parameters) – open multilingual models with support for 1M-token context and even a 5.6B multimodal variant (Phi-4V). |
| **MiMo** (7B series)               | `XiaomiMiMo/MiMo-7B-RL`                         | Xiaomi's reasoning-optimized model series, leverages Multiple-Token Prediction for faster inference. |
| **ERNIE-4.5** (4.5, 4.5MoE series) | `baidu/ERNIE-4.5-21B-A3B-PT`                    | Baidu's ERNIE-4.5 series which consists of MoE with 47B and 3B active parameters, with the largest model having 424B total parameters, as well as a 0.3B dense model. |
| **Arcee AFM-4.5B**               | `arcee-ai/AFM-4.5B-Base`                         | Arcee's foundational model series for real world reliability and edge deployments. |
| **Persimmon** (8B)               | `adept/persimmon-8b-chat`                         | Adept’s open 8B model with a 16K context window and fast inference; trained for broad usability and licensed under Apache 2.0. |
| **Solar** (10.7B)               | `upstage/SOLAR-10.7B-Instruct-v1.0`                         | Upstage's 10.7B parameter model, optimized for instruction-following tasks. This architecture incorporates a depth-up scaling methodology, enhancing model performance. |
| **Tele FLM** (52B-1T)               | `CofeAI/Tele-FLM`                         | BAAI & TeleAI's multilingual model, available in 52-billion and 1-trillion parameter variants. It is a decoder-only transformer trained on ~2T tokens |
| **Ling** (16.8B–290B) | `inclusionAI/Ling-lite`, `inclusionAI/Ling-plus` | InclusionAI’s open MoE models. Ling-Lite has 16.8B total / 2.75B active parameters, and Ling-Plus has 290B total / 28.8B active parameters. They are designed for high performance on NLP and complex reasoning tasks. |
| **Granite 3.0, 3.1** (IBM)               | `ibm-granite/granite-3.1-8b-instruct`                          | IBM's open dense foundation models optimized for reasoning, code, and business AI use cases. Integrated with Red Hat and watsonx systems. |
| **Granite 3.0 MoE** (IBM)               | `ibm-granite/granite-3.0-3b-a800m-instruct`                          | IBM’s Mixture-of-Experts models offering strong performance with cost-efficiency. MoE expert routing designed for enterprise deployment at scale. |
| **GPT-J** (6B)                    | `EleutherAI/gpt-j-6b`                             | EleutherAI's GPT-2-like causal language model (6B) trained on the [Pile](https://pile.eleuther.ai/) dataset. |
| **Orion** (14B)               | `OrionStarAI/Orion-14B-Base`                         | A series of open-source multilingual large language models by OrionStarAI, pretrained on a 2.5T token multilingual corpus including Chinese, English, Japanese, Korean, etc, and it exhibits superior performance in these languages. |
| **Llama Nemotron Super** (v1, v1.5, NVIDIA) | `nvidia/Llama-3_3-Nemotron-Super-49B-v1`, `nvidia/Llama-3_3-Nemotron-Super-49B-v1_5` | The [NVIDIA Nemotron](https://www.nvidia.com/en-us/ai-data-science/foundation-models/nemotron/) family of multimodal models provides state-of-the-art reasoning models specifically designed for enterprise-ready AI agents. |
| **Llama Nemotron Ultra** (v1, NVIDIA) | `nvidia/Llama-3_1-Nemotron-Ultra-253B-v1` | The [NVIDIA Nemotron](https://www.nvidia.com/en-us/ai-data-science/foundation-models/nemotron/) family of multimodal models provides state-of-the-art reasoning models specifically designed for enterprise-ready AI agents. |
| **NVIDIA Nemotron Nano 2.0** | `nvidia/NVIDIA-Nemotron-Nano-9B-v2` | The [NVIDIA Nemotron](https://www.nvidia.com/en-us/ai-data-science/foundation-models/nemotron/) family of multimodal models provides state-of-the-art reasoning models specifically designed for enterprise-ready AI agents. `Nemotron-Nano-9B-v2` is a hybrid Mamba-Transformer language model designed to increase throughput for reasoning workloads while achieving state-of-the-art accuracy compared to similarly-sized models. |
| **StarCoder2** (3B-15B) | `bigcode/starcoder2-7b` | StarCoder2 is a family of open large language models (LLMs) specialized for code generation and understanding. It is the successor to StarCoder, jointly developed by the BigCode project (a collaboration between Hugging Face, ServiceNow Research, and other contributors). |
| **Jet-Nemotron** | `jet-ai/Jet-Nemotron-2B` | Jet-Nemotron is a new family of hybrid-architecture language models that surpass state-of-the-art open-source full-attention language models, while achieving significant efficiency gains. |
| **Trinity** (Nano, Mini) | `arcee-ai/Trinity-Mini` | Arcee's foundational MoE Trinity family of models, open weights under Apache 2.0. |
| **Falcon-H1** (0.5B–34B) | `tiiuae/Falcon-H1-34B-Instruct` | TII's hybrid Mamba-Transformer architecture combining attention and state-space models for efficient long-context inference. |
| **Hunyuan-Large** (389B, MoE) | `tencent/Tencent-Hunyuan-Large` | Tencent's open-source MoE model with 389B total / 52B active parameters, featuring Cross-Layer Attention (CLA) for improved efficiency. |
| **IBM Granite 4.0 (Hybrid, Dense)** | `ibm-granite/granite-4.0-h-micro`, `ibm-granite/granite-4.0-micro` | IBM Granite 4.0 micro models: hybrid Mamba–MoE (`h-micro`) and dense (`micro`) variants. Enterprise-focused reasoning models |

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
