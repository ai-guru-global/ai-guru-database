---
title: "Microsoft Generative AI For Beginners：21 课生成式 AI 初学者课程映射"
category: "90-learn"
tags: ["learning-paths", "microsoft", "generative-ai", "course-catalog", "llm", "prompt-engineering"]
summary: "Microsoft 官方出品的 21 课生成式 AI 入门课程，覆盖 LLM 基础、提示工程、RAG、AI 代理、微调、开源模型等核心主题，附带 Python / TypeScript 代码示例。本页将课程完整课表映射到 ai-guru-database 的对应章节。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://github.com/microsoft/generative-ai-for-beginners/blob/main/translations/zh-CN/README.md"
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
| **前置要求** | 基础 Python 或 TypeScript；建议具备 [[01_Fundamentals/Python_for_AI_Basics]] 基础 |
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
| 00 | 课程设置 | [[01_Fundamentals/AI_Development_Environment_Setup]] | [[01_Fundamentals/GenAI_L00_Course_Setup]] |
| 01 | 生成式 AI 与大型语言模型简介 | [[00_AI_Introduction/AI_Fundamentals]]、[[04_NLP_LLMs/LLM_Architectures/LLM_Architectures]] | [[00_AI_Introduction/GenAI_L01_Intro_to_GenAI_and_LLMs]] |
| 02 | 探索与比较不同的 LLM | [[04_NLP_LLMs/LLM_Architectures/LLM_Architectures]]、[[04_NLP_LLMs/Global_LLM_Ecosystem/README]] | [[04_NLP_LLMs/GenAI_L02_Exploring_and_Comparing_LLMs]] |
| 03 | 负责任地使用生成式 AI | [[19_Ethics_Safety/Ethics-in-nutshell]]、[[19_Ethics_Safety/AI_Governance_Compliance_2026]] | [[19_Ethics_Safety/GenAI_L03_Using_GenAI_Responsibly]] |

### 提示工程（L04-L05）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 04 | 理解提示工程基础 | [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]]、[[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_Principles_Ng]] | [[04_NLP_LLMs/Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals]] |
| 05 | 创建高级提示 | [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]]、[[04_NLP_LLMs/god-tier-prompts_overview]] | [[04_NLP_LLMs/Prompt_Engineering/GenAI_L05_Advanced_Prompts]] |

### 应用构建（L06-L11）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 06 | 构建文本生成应用 | [[13_Agent_Production/README]]、[[04_NLP_LLMs/LLM_Products/chatgpt_overview]] | [[13_Agent_Production/GenAI_L06_Text_Generation_Apps]] |
| 07 | 构建聊天应用 | [[13_Agent_Production/README]]、[[13_Agent_Production/Agent_Frameworks/README]] | [[13_Agent_Production/GenAI_L07_Building_Chat_Applications]] |
| 08 | 构建搜索和向量数据库应用 | [[11_RAG_Systems/RAG_Systems]]、[[11_RAG_Systems/Vector_Database_for_dummy]] | [[11_RAG_Systems/GenAI_L08_Building_Search_Applications]] |
| 09 | 构建图像生成应用 | [[04_NLP_LLMs/Multimodal_Models/Multimodal_Models_for_dummy]] | [[04_NLP_LLMs/Multimodal_Models/GenAI_L09_Building_Image_Applications]] |
| 10 | 构建低代码 AI 应用 | [[20_AI_Applications_Industry/README]] | [[20_AI_Applications_Industry/GenAI_L10_Building_Low_Code_AI_Applications]] |
| 11 | 使用函数调用集成外部应用 | [[13_Agent_Production/Agent_Frameworks/README]]、[[13_Agent_Production/Agent_Workflow/Workflow-in-nutshell]] | [[13_Agent_Production/GenAI_L11_Integrating_with_Function_Calling]] |

### 设计与运维（L12-L14）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 12 | 设计 AI 应用的用户体验 | [[13_Agent_Production/README]]、[[13_Agent_Production/Agentic_Design_Patterns_AndrewNg]] | [[13_Agent_Production/GenAI_L12_Designing_UX_for_AI_Applications]] |
| 13 | 保障生成式 AI 应用安全 | [[19_Ethics_Safety/AI_Security_2026/README]]、[[19_Ethics_Safety/Ethics-in-nutshell]] | [[19_Ethics_Safety/GenAI_L13_Securing_AI_Applications]] |
| 14 | 生成式 AI 应用生命周期 | [[10_MLOps_Pipeline/MLOps_Pipeline]]、[[10_MLOps_Pipeline/MLOps_Maturity_Model]] | [[10_MLOps_Pipeline/GenAI_L14_GenAI_Application_Lifecycle]] |

### RAG 与开源（L15-L16）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 15 | 检索增强生成（RAG）与向量数据库 | [[11_RAG_Systems/RAG_Systems]]、[[11_RAG_Systems/RAG_Advanced_2026]] | [[11_RAG_Systems/GenAI_L15_RAG_and_Vector_Databases]] |
| 16 | 开源模型与 Hugging Face | [[04_NLP_LLMs/Global_LLM_Ecosystem/README]]、[[90_Learn/HuggingFace_Official_Courses]] | [[04_NLP_LLMs/GenAI_L16_Open_Source_Models_and_Hugging_Face]] |

### AI 代理（L17）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 17 | AI 代理 | [[13_Agent_Production/Agent_Frameworks/README]]、[[13_Agent_Production/Agentic_Design_Patterns_AndrewNg]] | [[13_Agent_Production/GenAI_L17_AI_Agents]] |

### 微调与模型家族（L18-L21）

| 课号 | 课程名称 | 本库建议配合阅读 | 页面链接 |
|------|----------|------------------|----------|
| 18 | 微调大型语言模型 | [[04_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques]]、[[07_Model_Training/Fine_tuning_Strategies]] | [[04_NLP_LLMs/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] |
| 19 | 使用小型语言模型构建 | [[04_NLP_LLMs/Edge_LLM/Edge_LLM_Deep_Dive]] | [[04_NLP_LLMs/Edge_LLM/GenAI_L19_Building_with_SLMs]] |
| 20 | 使用 Mistral 模型构建 | [[04_NLP_LLMs/Global_LLM_Ecosystem/Mistral_AI_Deep_Dive]] | [[04_NLP_LLMs/Global_LLM_Ecosystem/GenAI_L20_Building_with_Mistral]] |
| 21 | 使用 Meta 模型构建 | [[04_NLP_LLMs/Global_LLM_Ecosystem/Meta_LLaMA_Deep_Dive]] | [[04_NLP_LLMs/Global_LLM_Ecosystem/GenAI_L21_Building_with_Meta]] |

---

## 学习建议

1. **从基础开始**：按 L00→L05 的顺序学习基础概念与提示工程，建立扎实的知识框架。
2. **边学边做**：L06→L11 是应用构建课，建议配合本库对应章节的实际代码库动手实践。
3. **深入 RAG 与代理**：L15（RAG）和 L17（AI 代理）是当前最热门的方向，建议重点学习并结合本库 [[11_RAG_Systems/RAG_Systems]] 和 [[13_Agent_Production/README]] 深入。
4. **模型选型**：L18→L21 介绍不同模型家族，结合 [[04_NLP_LLMs/Global_LLM_Ecosystem/README]] 理解模型差异与选型策略。
5. **完成课后挑战**：每课附带的代码示例（Python / TypeScript）是巩固理解的关键。

---

## 与 Microsoft AI For Beginners 的关系

> 本课程（Generative AI for Beginners）专注于 **生成式 AI**，是 [[90_Learn/Microsoft_AI_For_Beginners]]（12 周 AI 基础课程）的姊妹篇。两门课程互补：
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

- [[90_Learn/Microsoft_AI_For_Beginners]] — Microsoft 12 周 AI 基础课程映射
- [[90_Learn/AI_Engineering_Roadmap_2026]] — AI 工程师学习路线
- [[90_Learn/Learning_Paths_2026]] — 本库 6 条学习路径总览
- [[90_Learn/HuggingFace_Official_Courses]] — Hugging Face 官方课程
- [[90_Learn/DeepLearningAI_Short_Courses]] — DeepLearning.AI 前沿短课程
- [[references/microsoft-genai-for-beginners]] — 外部源引用索引
