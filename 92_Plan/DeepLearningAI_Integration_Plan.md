---
title: "DeepLearning.AI 内容生态融入知识库规划"
category: "92-plan"
tags: ["plan", "deeplearning-ai", "andrew-ng", "short-courses", "2026-update"]
summary: "> **一句话理解**: 本文档规划了如何将 Andrew Ng (吴恩达) 创办的 DeepLearning.AI 平台上极具实战价值的 Short Courses 体系（覆盖 Agent、RAG、Prompt 等前沿主题）系统融入 AI Guru 知识库中。"
created: "2026-06-12"
updated: "2026-06-12"
---

# DeepLearning.AI 内容生态融入 AI Guru 知识库规划

> **一句话理解**: DeepLearning.AI 除了经典的机器学习/深度学习专项课程外，其推出的 Short Courses (短课程) 由各大 AI 框架（LangChain, LlamaIndex, OpenAI, Hugging Face）创始人亲自授课，是行业最佳实践的“金标准”。本文档规划了如何将这些实战思想体系化地融入本库。

## 1. 核心整合维度与落地方案

### 1.1 Agent 设计模式 (Agentic Design Patterns)
**目标目录**: `15_Agent_Production/`

*   **吴恩达四大 Agent 设计模式**: 新增 `Agentic_Design_Patterns_AndrewNg.md`。将吴恩达总结的 2024-2026 推动 AI Agent 发展的四大核心范式：Reflection (反思)、Tool Use (工具使用)、Planning (规划)、Multi-agent Collaboration (多智能体协作) 进行深度拆解。这是整个 Agent 目录的理论总纲。

### 1.2 高阶 RAG 检索技术 (Advanced RAG)
**目标目录**: `14_RAG_Systems/`

*   **DLAI 高阶 RAG 实战**: 新增 `Advanced_RAG_DLAI_Practices.md`。提炼 LlamaIndex 创始人 Jerry Liu 和 Chroma 创始人讲述的经典短课程精华。包括：Sentence Window Retrieval (句子窗口检索)、Auto-merging Retrieval (自动合并检索)、Query Expansion (查询扩展) 和 Cohere Re-ranking (重排)。

### 1.3 提示词工程 (Prompt Engineering)
**目标目录**: `05_NLP_LLMs/Prompt_Engineering/`

*   **开发者提示词工程原则**: 新增 `Prompt_Engineering_Principles_Ng.md`。提炼吴恩达与 OpenAI 的 Isa Fulford 共同讲授的最受欢迎课程《ChatGPT Prompt Engineering for Developers》。总结两大核心原则（写出清晰明确的指令、给模型思考的时间）及其实战技巧（如分隔符、结构化输出、Few-shot、指定思考步骤）。

### 1.4 短课程全景图与学习路线
**目标目录**: `90_Learn/`

*   **DeepLearning.AI 短课程目录图鉴**: 新增 `DeepLearningAI_Short_Courses.md`。由于 DLAI 的短课程数量庞大（涵盖 Evaluatoin, Fine-tuning, Serverless 等），需要一份总览指南，将其分类映射到 `ai-guru-database` 的各个章节中，作为读者的扩展学习导航。

## 2. 实施路径 (Action Items)

| 阶段 | 任务描述 | 负责人 / 状态 |
|------|----------|---------------|
| 1 | 沉淀当前规划到 `92_Plan` | 已完成 ✅ |
| 2 | 编写 `Agentic_Design_Patterns_AndrewNg.md` | 计划中 ⏳ |
| 3 | 编写 `Advanced_RAG_DLAI_Practices.md` | 计划中 ⏳ |
| 4 | 编写 `Prompt_Engineering_Principles_Ng.md` | 计划中 ⏳ |
| 5 | 编写 `DeepLearningAI_Short_Courses.md` | 计划中 ⏳ |

---
## Related
- [[92_Plan/HuggingFace_Integration_Plan]]
- [[90_Learn/guides/learning_paths_2026]]
