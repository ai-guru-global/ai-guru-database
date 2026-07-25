---
title: Microsoft Generative AI For Beginners：21 课生成式 AI 初学者课程映射
category: 90-learn-courses-microsoft
tags:
- learning-paths
- microsoft
- generative-ai
- course-catalog
- llm
- prompt-engineering
- course
- external-source
summary: Microsoft 官方出品的 21 课生成式 AI 入门课程，覆盖 LLM 基础、提示工程、RAG、AI 代理、微调、开源模型等核心主题，附带
  Python / TypeScript 代码示例。本页将课程完整课表映射到 ai-guru-database 的对应章节。
created: '2026-06-12'
updated: '2026-07-10'
source_url: https://github.com/microsoft/generative-ai-for-beginners/blob/main/translations/zh-CN/README.md
tier: supporting
aliases:
- Microsoft Genai For Beginners
- microsoft genai for beginners
- microsoft_genai_for_beginners
sources: []
---
# Microsoft Generative AI For Beginners：21 课生成式 AI 初学者课程映射

> **一句话理解**: [Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners) 是微软开源的 21 课生成式 AI 入门课程（版本 3）。它覆盖生成式 AI 概念、LLM 选型、提示工程、文本/聊天/搜索/图像应用构建、RAG、AI 代理、微调、开源模型等核心主题，并为每节课提供 **Python / TypeScript** 代码示例。本页将课程完整课表映射到 `ai-guru-database` 的对应章节。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **GitHub 仓库** | [microsoft/generative-ai-for-beginners](https://github.com/microsoft/generative-ai-for-beginners) |
| **中文 README** | [translations/zh-CN/README.md](https://github.com/microsoft/generative-ai-for-beginners/blob/main/translations/zh-CN/README.md) |
| **课时数量** | 21 节课 + 环境设置 |
| **编程语言** | Python、TypeScript |
| **支持平台** | Azure OpenAI 服务、GitHub Marketplace 模型目录、OpenAI API |
| **前置要求** | 基础 Python 或 TypeScript；建议具备 [[01_数学基础/Python_for_AI_Basics]] 基础 |
| **社区支持** | [Azure AI Foundry Discord](https://discord.gg/nTYy5BXMWG) |

---

## 你将学到什么

- 生成式 AI 的基础概念以及大型语言模型（LLM）如何工作
- 如何为不同使用场景选择合适的模型
- 提示工程的最佳实践与高级技术
- 构建文本生成、聊天、搜索、图像生成等实际应用
- RAG（检索增强生成）与向量数据库的使用
- AI 代理框架的原理与应用构建
- 微调、小型语言模型、开源模型等进阶主题

---

## 完整课程表与章节映射

### 基础入门（L00-L03）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 00 | 课程设置 | [[01_数学基础/AI_Development_Environment_Setup]] | [[01_数学基础/GenAI_L00_Course_Setup]] |
| 01 | 生成式 AI 与大型语言模型简介 | [[00_入门/AI_Fundamentals]]、[[05_大模型/05_LLM_Architectures/LLM_Architectures]] | [[00_入门/GenAI_L01_Intro_to_GenAI_and_LLMs]] |
| 02 | 探索与比较不同的 LLM | [[05_大模型/05_LLM_Architectures/LLM_Architectures]]、[[05_大模型/14_Global_LLM_Ecosystem/README]] | [[05_大模型/GenAI_L02_Exploring_and_Comparing_LLMs]] |
| 03 | 负责任地使用生成式 AI | [[17_伦理安全/Ethics-in-nutshell]]、[[17_伦理安全/AI_Governance_Compliance_2026]] | [[17_伦理安全/GenAI_L03_Using_GenAI_Responsibly]] |

### 提示工程（L04-L05）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 04 | 理解提示工程基础 | [[05_大模型/08_Prompt_Engineering/Prompt_Engineering]]、[[05_大模型/08_Prompt_Engineering/Prompt_Engineering_Principles_Ng]] | [[05_大模型/08_Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals]] |
| 05 | 创建高级提示 | [[05_大模型/08_Prompt_Engineering/Prompt_Engineering]]、[[05_大模型/13_LLM_Products/god-tier-prompts_overview]] | [[05_大模型/08_Prompt_Engineering/GenAI_L05_Advanced_Prompts]] |

### 应用构建（L06-L11）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 06 | 构建文本生成应用 | [[15_智能体/README]]、[[05_大模型/13_LLM_Products/chatgpt_overview]] | [[15_智能体/GenAI_L06_Text_Generation_Apps]] |
| 07 | 构建聊天应用 | [[15_智能体/README]]、[[15_智能体/02_Agent_Frameworks/README]] | [[15_智能体/GenAI_L07_Building_Chat_Applications]] |
| 08 | 构建搜索和向量数据库应用 | [[14_RAG系统/RAG_Systems]]、[[14_RAG系统/Vector_Database_for_dummy]] | [[14_RAG系统/GenAI_L08_Building_Search_Applications]] |
| 09 | 构建图像生成应用 | [[05_大模型/10_Multimodal_Models/Multimodal_Models_for_dummy]] | [[05_大模型/10_Multimodal_Models/GenAI_L09_Building_Image_Applications]] |
| 10 | 构建低代码 AI 应用 | [[18_行业应用/README]] | [[18_行业应用/GenAI_L10_Building_Low_Code_AI_Applications]] |
| 11 | 使用函数调用集成外部应用 | [[15_智能体/02_Agent_Frameworks/README]]、[[15_智能体/03_Agent_Workflow/Workflow-in-nutshell]] | [[15_智能体/GenAI_L11_Integrating_with_Function_Calling]] |

### 设计与运维（L12-L14）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 12 | 设计 AI 应用的用户体验 | [[15_智能体/README]]、[[15_智能体/Agentic_Design_Patterns_AndrewNg]] | [[15_智能体/GenAI_L12_Designing_UX_for_AI_Applications]] |
| 13 | 保障生成式 AI 应用安全 | [[17_伦理安全/07_AI_Security_2026/README]]、[[17_伦理安全/Ethics-in-nutshell]] | [[17_伦理安全/GenAI_L13_Securing_AI_Applications]] |
| 14 | 生成式 AI 应用生命周期 | [[11_模型运维/MLOps_Pipeline]]、[[11_模型运维/MLOps_Maturity_Model]] | [[11_模型运维/GenAI_L14_GenAI_Application_Lifecycle]] |

### RAG 与开源（L15-L16）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 15 | 检索增强生成（RAG）与向量数据库 | [[14_RAG系统/RAG_Systems]]、[[14_RAG系统/04_Advanced_RAG/RAG_Advanced_2026]] | [[14_RAG系统/GenAI_L15_RAG_and_Vector_Databases]] |
| 16 | 开源模型与 Hugging Face | [[05_大模型/14_Global_LLM_Ecosystem/README]]、[[90_学习/courses/hugging_face/official_courses]] | [[05_大模型/GenAI_L16_Open_Source_Models_and_Hugging_Face]] |

### AI 代理（L17）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 17 | AI 代理 | [[15_智能体/02_Agent_Frameworks/README]]、[[15_智能体/Agentic_Design_Patterns_AndrewNg]] | [[15_智能体/GenAI_L17_AI_Agents]] |

### 微调与模型家族（L18-L21）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 18 | 微调大型语言模型 | [[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques]]、[[05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Strategies]] | [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] |
| 19 | 使用小型语言模型构建 | [[05_大模型/12_Edge_LLM/Edge_LLM_Deep_Dive]] | [[05_大模型/12_Edge_LLM/GenAI_L19_Building_with_SLMs]] |
| 20 | 使用 Mistral 模型构建 | [[05_大模型/14_Global_LLM_Ecosystem/Mistral_AI_Deep_Dive]] | [[05_大模型/14_Global_LLM_Ecosystem/GenAI_L20_Building_with_Mistral]] |
| 21 | 使用 Meta 模型构建 | [[05_大模型/14_Global_LLM_Ecosystem/Meta_LLaMA_Deep_Dive]] | [[05_大模型/14_Global_LLM_Ecosystem/GenAI_L21_Building_with_Meta]] |

---

## 学习建议

1. **从基础开始**：按 L00→L05 的顺序学习基础概念与提示工程，建立扎实的知识框架。
2. **边学边做**：L06→L11 是应用构建课，建议配合本库对应章节的实际代码库动手实践。
3. **深入 RAG 与代理**：L15（RAG）和 L17（AI 代理）是当前最热门的方向，建议重点学习并结合本库 [[14_RAG系统/RAG_Systems]] 和 [[15_智能体/README]] 深入。
4. **模型选型**：L18→L21 介绍不同模型家族，结合 [[05_大模型/14_Global_LLM_Ecosystem/README]] 理解模型差异与选型策略。
5. **完成课后挑战**：每课附带的代码示例（Python / TypeScript）是巩固理解的关键。

---

## 与 Microsoft AI For Beginners 的关系

> 本课程（Generative AI for Beginners）专注于 **生成式 AI**，是 [[90_学习/courses/microsoft/microsoft_ai_for_beginners]]（12 周 AI 基础课程）的姊妹篇。两门课程互补：
>
> | 维度 | AI For Beginners | Generative AI For Beginners |
> |------|------------------|---------------------------|
> | **重点** | AI 全领域基础 | 生成式 AI 与 LLM 应用 |
> | **课时** | 24 节 + 设置 | 21 节 + 设置 |
> | **框架** | PyTorch / TensorFlow | Python / TypeScript |
> | **覆盖** | 符号AI、NN、CV、NLP、RL、伦理 | LLM、提示工程、RAG、代理、微调 |
>
> 建议：先完成 AI For Beginners 建立全局认知，再用本课程深入生成式 AI 实践。

---

## 相关阅读

- [[90_学习/courses/microsoft/microsoft_ai_for_beginners]] — Microsoft 12 周 AI 基础课程映射
- [[90_学习/guides/ai_engineering_roadmap_2026]] — AI 工程师学习路线
- [[90_学习/guides/learning_paths_2026]] — 本库 6 条学习路径总览
- [[90_学习/courses/hugging_face/official_courses]] — Hugging Face 官方课程
- [[90_学习/courses/deeplearning_ai/short_courses]] — DeepLearning.AI 前沿短课程
- [[90_学习/Courses/microsoft/microsoft_genai_for_beginners]] — 外部源引用索引

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
