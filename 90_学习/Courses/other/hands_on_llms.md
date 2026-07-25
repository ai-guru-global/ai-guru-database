---
title: "Hands-On Large Language Models：12 章课程映射"
category: 90-learn-courses-other
tags:
  - learning-paths
  - llm
  - nlp
  - course-catalog
  - jay-alammar
  - maarten-grootendorst
sources:
  - "https://github.com/HandsOnLLM/Hands-On-Large-Language-Models"
  - "原始/github-sources/hands-on-llms"
summary: "《Hands-On Large Language Models》全 12 章课程映射，将近 300 张图解 + Jupyter Notebook 的内容按主题映射到 ai-guru-database 的对应章节。"
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: draft
lifecycle_changed: 2026-06-12
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Hands On Llms"
  - "hands on llms"
  - hands_on_llms

---
# Hands-On Large Language Models：12 章课程映射

> **一句话理解**: 《Hands-On Large Language Models》用近 300 张定制图表和 12 章 Jupyter Notebook，系统讲解从 Token/嵌入到 BERT/生成模型微调的 LLM 全栈知识。本页将课程章节映射到 `ai-guru-database` 的对应概念页。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **书籍** | Hands-On Large Language Models |
| **作者** | Jay Alammar & Maarten Grootendorst |
| **出版社** | O'Reilly（2024） |
| **GitHub** | [HandsOnLLM/Hands-On-Large-Language-Models](https://github.com/HandsOnLLM/Hands-On-Large-Language-Models) |
| **本地克隆** | `原始/github-sources/hands-on-llms` |
| **章节数** | 12 章 + bonus 图解指南 |
| **运行环境** | Google Colab（推荐，免费 T4 GPU）或本地 conda 环境 |
| **前置要求** | 基础 Python；建议先了解 [[05_大模型/01_LLM_Fundamentals|LLM 基础]] |
| **外部引用** | [[90_学习/References/books/hands-on-llms-alammar]] |

---

## 你将学到什么

- Token 化、词嵌入与上下文嵌入的底层机制
- Transformer 架构与 LLM 内部工作原理
- 文本分类、聚类与主题建模的实战方法
- 提示工程与高级文本生成技术
- 语义搜索与 RAG 的构建流程
- 多模态大语言模型基础
- 创建文本嵌入模型与 fine-tuning BERT
- 生成模型微调（指令微调、RLHF 等）

---

## 完整课表与概念映射

| 章节 | 课程名称 | 核心内容 | 本库相关概念/页面 |
|------|----------|----------|-------------------|
| Ch 1 | Introduction to Language Models | LLM 发展简史、GPT 系列、生成 vs 嵌入模型 | [[05_大模型/01_LLM_Fundamentals|LLM 基础]], [[05_大模型/GenAI_L02_Exploring_and_Comparing_LLMs|探索与比较 LLM]] |
| Ch 2 | Tokens and Embeddings | Tokenizer、子词切分、词嵌入、位置编码 | [[05_大模型/Transformer_Architecture|Transformer 架构]], [[05_大模型/NLP_Fundamentals|NLP 基础]] |
| Ch 3 | Looking Inside Transformer LLMs | 自注意力、多头注意力、层归一化、前馈网络 | [[05_大模型/04_Transformer_Revolution/Self_Attention_Mechanism|自注意力机制]], [[05_大模型/Transformer_Architecture|Transformer 架构]] |
| Ch 4 | Text Classification | 分类头、BERT 分类、Zero-shot 分类 | [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs|微调 LLM]], [[08_模型评估/Model_Evaluation|模型评估]] |
| Ch 5 | Text Clustering and Topic Modeling | 嵌入聚类、主题建模、BertTopic | [[02_机器学习/03_Unsupervised_Learning/Unsupervised_Learning|聚类]]（如存在）, [[05_大模型/NLP_Fundamentals|NLP 基础]] |
| Ch 6 | Prompt Engineering | 提示模板、 few-shot、chain-of-thought、结构化输出 | [[05_大模型/08_Prompt_Engineering/Prompt_Engineering|提示工程总览]], [[05_大模型/08_Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals|提示工程基础]] |
| Ch 7 | Advanced Text Generation Techniques and Tools | 采样策略、beam search、top-k/top-p、logit 处理 | [[05_大模型/08_Prompt_Engineering/GenAI_L05_Advanced_Prompts|高级提示技术]], [[05_大模型/01_LLM_Fundamentals|LLM 基础]] |
| Ch 8 | Semantic Search and Retrieval-Augmented Generation | 向量搜索、RAG pipeline、重排序 | [[14_RAG系统/RAG_Systems|RAG 系统总览]], [[14_RAG系统/GenAI_L15_RAG_and_Vector_Databases|RAG 与向量数据库]] |
| Ch 9 | Multimodal Large Language Models | CLIP、视觉编码器、多模态提示 | [[05_大模型/10_Multimodal_Models/Multimodal_Architectures_2026|多模态模型]], [[04_计算机视觉/08_Multimodal_Vision/Multimodal_Vision|多模态视觉]] |
| Ch 10 | Creating Text Embedding Models | 对比学习、sentence-transformers、Matryoshka 嵌入 | [[14_RAG系统/02_Embeddings/Sentence_Transformers_Deep_Dive|嵌入模型]]（如存在）, [[05_大模型/01_LLM_Fundamentals|LLM 基础]] |
| Ch 11 | Fine-tuning Representation Models for Classification | BERT 微调、LoRA、分类任务最佳实践 | [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs|微调 LLM]], [[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques|LoRA]]（如存在） |
| Ch 12 | Fine-tuning Generation Models | 指令微调、SFT、RLHF、DPO、奖励模型 | [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs|微调 LLM]], [[07_模型训练/06_Alignment/GRPO_and_New_Alignment_Methods|GRPO 与新对齐方法]] |

---

## Bonus 内容

仓库 `bonus/` 还包含作者后续发布的图解扩展：

- Mamba / State Space Models
- Quantization
- Mixture of Experts (MoE)
- Reasoning LLMs
- Stable Diffusion
- DeepSeek-R1

---

## 相关阅读

- [[90_学习/References/books/hands-on-llms-alammar]] — 书籍引用索引与本地克隆路径
- [[90_学习/Courses/microsoft/microsoft_genai_for_beginners.md]] — 微软生成式 AI 入门课程（可与本书互补）
- [[90_学习/Courses/microsoft/microsoft_ai_for_beginners.md]] — 微软 AI 基础 12 周课程

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
