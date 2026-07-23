# Support Models on Ascend NPU

This section describes the models supported on the Ascend NPU, including Large Language Models, Multimodal Language
Models, Embedding Models, Reward Models and Rerank Models. Mainstream DeepSeek/Qwen/GLM series are included.
You are welcome to enable various models based on your business requirements.

## Large Language Models

| Models                                     | Model Family                   |               A2 Supported               |               A3 Supported               |
|--------------------------------------------|--------------------------------|:----------------------------------------:|:----------------------------------------:|
| DeepSeek V3/V3.1                           | DeepSeek                       | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| vllm-ascend/DeepSeek-V3.2-Exp-W8A8         | DeepSeek                       | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| vllm-ascend/DeepSeek-R1-0528-W8A8          | DeepSeek                       | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| vllm-ascend/DeepSeek-V2-Lite-W8A8          | DeepSeek                       | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen3-30B-A3B-Instruct-2507           | Qwen                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen3-32B                             | Qwen                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen3-0.6B                            | Qwen                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| vllm-ascend/Qwen3-235B-A22B-W8A8           | Qwen                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen3-Next-80B-A3B-Instruct           | Qwen                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen3-Coder-480B-A35B-Instruct-w8a8-QuaRot | Qwen                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen2.5-7B-Instruct                   | Qwen                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| vllm-ascend/QWQ-32B-W8A8                   | Qwen                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| meta-llama/Llama-4-Scout-17B-16E-Instruct  | Llama                          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| AI-ModelScope/Llama-3.1-8B-Instruct        | Llama                          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| LLM-Research/llama-2-7b                    | Llama                          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| LLM-Research/Llama-3.2-1B-Instruct         | Llama                          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| mistralai/Mistral-7B-Instruct-v0.2         | Mistral                        | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| google/gemma-3-4b-it                       | Gemma                          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| microsoft/Phi-4-multimodal-instruct        | Phi                            | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| allenai/OLMoE-1B-7B-0924                   | OLMoE                          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| stabilityai/stablelm-2-1_6b                | StableLM                       | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| CohereForAI/c4ai-command-r-v01             | Command-R                      | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| huihui-ai/grok-2                           | Grok                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| ZhipuAI/chatglm2-6b                        | ChatGLM                        | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Shanghai_AI_Laboratory/internlm2-7b        | InternLM 2                     | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| LGAI-EXAONE/EXAONE-3.5-7.8B-Instruct       | ExaONE 3                       | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| xverse/XVERSE-MoE-A36B                     | XVERSE                         | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| HuggingFaceTB/SmolLM-1.7B                  | SmolLM                         | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| ZhipuAI/glm-4-9b-chat                      | GLM-4                          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| XiaomiMiMo/MiMo-7B-RL                      | MiMo                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| arcee-ai/AFM-4.5B-Base                     | Arcee AFM-4.5B                 | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Howeee/persimmon-8b-chat                   | Persimmon                      | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| inclusionAI/Ling-lite                      | Ling                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| ibm-granite/granite-3.1-8b-instruct        | Granite                        | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| ibm-granite/granite-3.0-3b-a800m-instruct  | Granite MoE                    | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| AI-ModelScope/dbrx-instruct                | DBRX (Databricks)              | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| baichuan-inc/Baichuan2-13B-Chat            | Baichuan 2 (7B, 13B)           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| baidu/ERNIE-4.5-21B-A3B-PT                 | ERNIE-4.5 (4.5, 4.5MoE series) | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| OpenBMB/MiniCPM3-4B                        | MiniCPM (v3, 4B)               | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Kimi/Kimi-K2-Thinking                      | Kimi                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| openai/gpt-oss-120b                        | GPTOSS                         | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| allenai/OLMo-2-1124-7B-Instruct            | OLMo                           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| minimax/MiniMax-M2                         | MiniMax-M2                     | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| upstage/SOLAR-10.7B-Instruct-v1.0          | Solar                          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| bigcode/starcoder2-7b                      | StarCoder2                     | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| arcee-ai/Trinity-Mini                      | Trinity (Nano, Mini)           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |

## Multimodal Language Models

| Models                                        | Model Family (Variants)   |               A2 Supported               |               A3 Supported               |
|-----------------------------------------------|---------------------------|:----------------------------------------:|:----------------------------------------:|
| Qwen/Qwen2.5-VL-3B-Instruct                   | Qwen-VL                   | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen2.5-VL-72B-Instruct                  | Qwen-VL                   | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen3-VL-30B-A3B-Instruct                | Qwen-VL                   | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen3-VL-8B-Instruct                     | Qwen-VL                   | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen3-VL-4B-Instruct                     | Qwen-VL                   | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Qwen/Qwen3-VL-235B-A22B-Instruct              | Qwen-VL                   | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| deepseek-ai/deepseek-vl2                      | DeepSeek-VL2              | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| deepseek-ai/Janus-Pro-1B                      | Janus-Pro (1B, 7B)        | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| deepseek-ai/Janus-Pro-7B                      | Janus-Pro (1B, 7B)        | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| openbmb/MiniCPM-V-2_6                         | MiniCPM-V / MiniCPM-o     | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| openbmb/MiniCPM-o-2_6                         | MiniCPM-V / MiniCPM-o     | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| google/gemma-3-4b-it                          | Gemma 3 (Multimodal)      | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| mistralai/Mistral-Small-3.1-24B-Instruct-2503 | Mistral-Small-3.1-24B     | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| microsoft/Phi-4-multimodal-instruct           | Phi-4-multimodal-instruct | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| XiaomiMiMo/MiMo-VL-7B-RL                      | MiMo-VL (7B)              | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| AI-ModelScope/llava-v1.6-34b                  | LLaVA (v1.5 & v1.6)       | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| lmms-lab/llava-next-72b                       | LLaVA-NeXT (8B, 72B)      | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| lmms-lab/llava-onevision-qwen2-7b-ov          | LLaVA-OneVision           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| Kimi/Kimi-VL-A3B-Instruct                     | Kimi-VL (A3B)             | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| ZhipuAI/GLM-4.5V                              | GLM-4.5V (106B)           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| LLM-Research/Llama-3.2-11B-Vision-Instruct    | Llama 3.2 Vision (11B)    | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| rednote-hilab/dots.ocr                        | DotsVLM-OCR               | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |

## Embedding Models

| Models                                    | Model Family             |               A2 Supported               |               A3 Supported               |
|-------------------------------------------|--------------------------|:----------------------------------------:|:----------------------------------------:|
| 	intfloat/e5-mistral-7b-instruct          | E5 (Llama/Mistral based) | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	iic/gte_Qwen2-1.5B-instruct              | GTE-Qwen2                | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	Qwen/Qwen3-Embedding-8B                  | Qwen3-Embedding          | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	Alibaba-NLP/gme-Qwen2-VL-2B-Instruct     | GME (Multimodal)         | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	AI-ModelScope/clip-vit-large-patch14-336 | CLIP                     | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	BAAI/bge-large-en-v1.5                   | BGE                      | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |

## Reward Models

| Models                                         | Model Family              | A2 Supported                             |               A3 Supported               |
|------------------------------------------------|---------------------------|------------------------------------------|:----------------------------------------:|
| 	Skywork/Skywork-Reward-Llama-3.1-8B-v0.2      | Llama3.1 Reward           | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	Shanghai_AI_Laboratory/internlm2-7b-reward    | InternLM 2 Reward         | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	Qwen/Qwen2.5-Math-RM-72B                      | Qwen2.5 Reward - Math     | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	Howeee/Qwen2.5-1.5B-apeach                    | Qwen2.5 Reward - Sequence | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |
| 	AI-ModelScope/Skywork-Reward-Gemma-2-27B-v0.2 | Gemma 2-27B Reward        | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |

## Rerank Models

| Models                  | Model Family |               A2 Supported               |               A3 Supported               |
|-------------------------|--------------|:----------------------------------------:|:----------------------------------------:|
| BAAI/bge-reranker-v2-m3 | BGE-Reranker | **<span style="color: green;">√</span>** | **<span style="color: green;">√</span>** |

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
