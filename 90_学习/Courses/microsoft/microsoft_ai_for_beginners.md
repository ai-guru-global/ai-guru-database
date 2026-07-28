---
title: Microsoft AI For Beginners：12 周初学者课程映射
category: 90-learn-courses-microsoft
tags:
- learning-paths
- microsoft
- ai-beginners
- course-catalog
- pytorch
- tensorflow
- course
- external-source
summary: '> **一句话理解**: Microsoft 官方出品的 12 周 24 课 AI 入门课程，覆盖符号 AI、神经网络、CV、NLP、RL、伦理等主题，并附带
  PyTorch/TensorFlow 双框架 Notebook，是本库零基础到进阶的极佳外部学习路线。'
created: '2026-06-12'
updated: '2026-07-10'
source_url: https://github.com/microsoft/AI-For-Beginners/blob/main/translations/zh-CN/README.md
tier: core
aliases:
- Microsoft Ai For Beginners
- microsoft ai for beginners
- microsoft_ai_for_beginners
sources: []
name_zh: "Microsoft AI For Beginners：12 周初学者课程映射"
---
# Microsoft AI For Beginners：12 周初学者课程映射

> 中文简称：Microsoft AI For Beginners：12 周初学者课程映射

> **一句话理解**: [Microsoft AI For Beginners](https://microsoft.github.io/AI-For-Beginners/) 是微软开源的 12 周、24 课 AI 入门课程。它涵盖符号 AI、神经网络、计算机视觉、自然语言处理、强化学习、AI 伦理等核心主题，并为每节课提供 **PyTorch / TensorFlow 双框架可运行 Notebook** 与部分实验。本页将课程的完整课表映射到 `ai-guru-database` 的对应章节，方便你在阅读本库理论后，通过官方 Notebook 动手实践。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **官方站点** | [microsoft.github.io/AI-For-Beginners](https://microsoft.github.io/AI-For-Beginners/) |
| **GitHub 仓库** | [microsoft/AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners) |
| **中文 README** | [translations/zh-CN/README.md](https://github.com/microsoft/AI-For-Beginners/blob/main/translations/zh-CN/README.md) |
| **课程周期** | 12 周 |
| **课时数量** | 24 节课 + 环境设置 |
| **编程框架** | PyTorch、TensorFlow / Keras |
| **前置要求** | 基础 Python；部分课程需要线性代数与概率论基础（可参考本库 [[01_数学基础/02_Linear_Algebra/Linear_Algebra]] 与 [[01_数学基础/03_Probability_Statistics/Probability_Statistics]]） |

---

## 你将学到什么

- 不同的人工智能方法，包括“老派”的符号方法以及 **知识表示** 与推理（GOFAI）。
- 现代 AI 核心的 **神经网络** 和 **深度学习**，通过 TensorFlow 和 PyTorch 代码示例讲解。
- 用于处理图像和文本的 **神经架构**（CNN、RNN、Transformer 等）。
- 较少见的 AI 方法，如 **遗传算法** 和 **多智能体系统**。

## 本课程不覆盖的内容

> 以下主题在微软其他课程或本库其他章节中有更详细讲解：

- **AI 在商业中的应用案例** → 本库 [[18_行业应用/README]] 系列。
- **经典机器学习** → 微软另有 [ML-For-Beginners](https://github.com/microsoft/ML-For-Beginners)；本库 [[02_机器学习/README]] 章节。
- **基于认知服务的实际 AI 应用** → 微软 Learn 模块。
- **特定 ML 云框架**（Azure ML、Microsoft Fabric 等） → 微软 Learn 路径。
- **会话式 AI 与聊天机器人** → 本库 [[05_大模型/08_Prompt_Engineering/Prompt_Engineering]] 与 [[15_智能体/README]] 章节。
- **深度学习背后的深度数学** → 本库 [[01_数学基础/README]] 与 [Deep Learning 教材](https://www.deeplearningbook.org/)。

---

## 完整课程表与章节映射

| 模块 | 课号 | 本地课程页 | 本库建议配合阅读 | 官方 Notebook / 实验 |
|------|------|------------|------------------|----------------------|
| **环境设置** | 00 | [[90_学习/courses/microsoft/L00_Course_Setup|课程环境设置]] | [[01_数学基础/08_Python_Toolkit/AI_Development_Environment_Setup]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/0-course-setup) |
| **I. 人工智能简介** | 01 | [[90_学习/courses/microsoft/L01_Introduction_and_History_of_AI|人工智能介绍与历史]] | [[00_入门/AI_Fundamentals]]、[[00_入门/AI_History_Timeline]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/1-Intro) |
| **II. 符号 AI** | 02 | [[90_学习/courses/microsoft/L02_Knowledge_Representation_and_Expert_Systems|知识表示与专家系统]] | [[00_入门/AI_Fundamentals]]、[[05_大模型/09_Reasoning_Models/Neuro_Symbolic_and_Formal_Verification_2026]]（符号推理的现代延续） | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/2-Symbolic) |
| **III. 神经网络简介** | 03 | [[90_学习/courses/microsoft/L03_Perceptron|感知器]] | [[03_深度学习/02_Neural_Network_Core/Neural_Network_Core]]、[[03_深度学习/02_Neural_Network_Core/Your_First_Neural_Network]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/3-NeuralNetworks/03-Perceptron) |
| | 04 | [[90_学习/courses/microsoft/L04_Multi_Layered_Perceptron|多层感知器及创建自己的框架]] | [[03_深度学习/02_Neural_Network_Core/Neural_Network_Core]]、[[03_深度学习/03_Optimization/Optimization]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/3-NeuralNetworks/04-OwnFramework) |
| | 05 | [[90_学习/courses/microsoft/L05_Frameworks_and_Overfitting|框架简介与过拟合]] | [[03_深度学习/03_Optimization/Optimization]]、[[02_机器学习/02_Supervised_Learning/Supervised_Learning]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/3-NeuralNetworks/05-Frameworks) |
| **IV. 计算机视觉** | 06 | [[90_学习/courses/microsoft/L06_Intro_to_Computer_Vision|计算机视觉简介与 OpenCV]] | [[04_计算机视觉/README]]、[[04_计算机视觉/02_Image_Classification_Detection/Image_Classification_Detection]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/06-IntroCV) |
| | 07 | [[90_学习/courses/microsoft/L07_CNN_and_Architectures|卷积神经网络与 CNN 架构]] | [[04_计算机视觉/02_Image_Classification_Detection/Image_Classification_Detection]]、[[04_计算机视觉/CV-in-nutshell]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/07-ConvNets) |
| | 08 | [[90_学习/courses/microsoft/L08_Transfer_Learning_and_Training_Tricks|预训练网络、迁移学习与训练技巧]] | [[04_计算机视觉/02_Image_Classification_Detection/Image_Classification_Detection]]、[[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Strategies]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/08-TransferLearning) |
| | 09 | [[90_学习/courses/microsoft/L09_Autoencoders_and_VAEs|自编码器与变分自编码器（VAE）]] | [[04_计算机视觉/06_Generative_Models/Generative_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/09-Autoencoders) |
| | 10 | [[90_学习/courses/microsoft/L10_GANs_and_Style_Transfer|生成对抗网络与艺术风格迁移]] | [[04_计算机视觉/06_Generative_Models/Generative_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/10-GANs) |
| | 11 | [[90_学习/courses/microsoft/L11_Object_Detection|目标检测]] | [[04_计算机视觉/02_Image_Classification_Detection/Image_Classification_Detection]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/11-ObjectDetection) |
| | 12 | [[90_学习/courses/microsoft/L12_Semantic_Segmentation|语义分割与 U-Net]] | [[04_计算机视觉/03_Segmentation/Segmentation]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/12-Segmentation) |
| **V. 自然语言处理** | 13 | [[90_学习/courses/microsoft/L13_Text_Representation|文本表示：词袋模型与 TF-IDF]] | [[05_大模型/06_LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]]、[[05_大模型/02_Sequence_Models/Sequence_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/13-TextRep) |
| | 14 | [[90_学习/courses/microsoft/L14_Semantic_Word_Embeddings|语义词嵌入：Word2Vec 与 GloVe]] | [[05_大模型/02_Sequence_Models/Sequence_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/14-Embeddings) |
| | 15 | [[90_学习/courses/microsoft/L15_Language_Modeling|语言建模与自定义嵌入训练]] | [[05_大模型/02_Sequence_Models/Sequence_Models]]、[[05_大模型/06_LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/15-LanguageModeling) |
| | 16 | [[90_学习/courses/microsoft/L16_Recurrent_Neural_Networks|循环神经网络（RNN）]] | [[05_大模型/02_Sequence_Models/Sequence_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/16-RNN) |
| | 17 | [[90_学习/courses/microsoft/L17_Generative_Recurrent_Networks|生成循环网络]] | [[05_大模型/02_Sequence_Models/Sequence_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/17-GenerativeNetworks) |
| | 18 | [[90_学习/courses/microsoft/L18_Transformers_and_BERT|Transformer 与 BERT]] | [[05_大模型/04_Transformer_Revolution/Transformer_Revolution]]、[[05_大模型/05_LLM_Architectures/LLM_Architectures]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/18-Transformers) |
| | 19 | [[90_学习/courses/microsoft/L19_Named_Entity_Recognition|命名实体识别（NER）]] | [[05_大模型/02_Sequence_Models/Sequence_Models]]、[[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/19-NER) |
| | 20 | [[90_学习/courses/microsoft/L20_Large_Language_Models|大语言模型、提示编程与少样本任务]] | [[05_大模型/05_LLM_Architectures/LLM_Architectures]]、[[05_大模型/08_Prompt_Engineering/Prompt_Engineering]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/20-LangModels) |
| **VI. 其他 AI 技术** | 21 | [[90_学习/courses/microsoft/L21_Genetic_Algorithms|遗传算法]] | [[06_强化学习/RL-in-nutshell]]、[[02_机器学习/ML-in-nutshell]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/6-Other/21-GeneticAlgorithms) |
| | 22 | [[90_学习/courses/microsoft/L22_Deep_Reinforcement_Learning|深度强化学习]] | [[06_强化学习/02_Deep_RL/Deep_RL]]、[[06_强化学习/01_RL_Foundations/RL_Foundations]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/6-Other/22-DeepRL) |
| | 23 | [[90_学习/courses/microsoft/L23_Multi_Agent_Systems|多智能体系统]] | [[06_强化学习/AI_Agents/AI_Agents]]、[[15_智能体/README]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/6-Other/23-MultiagentSystems) |
| **VII. AI 伦理** | 24 | [[90_学习/courses/microsoft/L24_AI_Ethics_and_Responsible_AI|AI 伦理与负责任的 AI]] | [[17_伦理安全/Ethics-in-nutshell]]、[[17_伦理安全/AI_Governance_Compliance_2026]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/7-Ethics) |
| **IX. 附加内容** | 25 | [[90_学习/courses/microsoft/L25_Multi_Modal_Networks|多模态网络、CLIP 与 VQGAN]] | [[04_计算机视觉/08_Multimodal_Vision/CLIP_Deep_Dive]]、[[05_大模型/10_Multimodal_Models/Multimodal_Models_for_dummy]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/X-Extras/X1-MultiModal) |

---

## 学习建议

1. **先建立概念框架**：每节课前，先阅读本库对应章节的核心概念页（如 [[03_深度学习/02_Neural_Network_Core/Neural_Network_Core]]），再进入官方 Notebook。
2. **选择一个框架深入**：每节课通常提供 PyTorch 和 TensorFlow 两个版本。建议初学者主攻 **PyTorch**，工业界应用更广的再补充 **TensorFlow/Keras**。
3. **完成实验**：标有“Lab”的课程（如感知器、CNN、目标检测等）配有动手实验，是巩固理解的关键。
4. **结合本库进阶**：完成 MS 课程后，可继续阅读本库 [[07_模型训练/README]]、[[08_模型评估/README]]、[[10_部署推理/README]]、[[14_RAG系统/README]]、[[15_智能体/README]] 等工程实践章节。

---

## 每节课包含什么

根据官方说明，每节课通常包括：

- **预习材料**：课前阅读的理论背景。
- **可执行 Jupyter Notebook**：通常分为 PyTorch 与 TensorFlow 两个版本，Notebook 中也包含大量理论讲解。
- **实验（Lab）**：部分课程提供，帮助你将理论应用到具体问题。
- **Microsoft Learn 模块链接**：部分章节附带官方 MS Learn 扩展阅读。
- **测验**：每节课的测验位于 `etc/quiz-app`，也可[在线访问](https://microsoft.github.io/AI-For-Beginners/)。

---

## 相关阅读

- [[90_学习/courses/hugging_face/official_courses]] — Hugging Face 官方 NLP / RL / Audio 系统课程
- [[90_学习/courses/deeplearning_ai/short_courses]] — DeepLearning.AI 前沿短课程映射
- [[90_学习/guides/learning_paths_2026]] — 本库 6 条学习路径总览
- [[00_入门/AI_Learning_Resources]] — AI 学习资源与方法论
- [[90_学习/Courses/microsoft/microsoft_ai_for_beginners]] — 外部源引用索引

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
