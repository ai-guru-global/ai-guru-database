---
title: "Hands-On Large Language Models：12 章课程映射"
category: 90-learn
tags:
  - learning-paths
  - llm
  - nlp
  - course-catalog
  - jay-alammar
  - maarten-grootendorst
sources:
  - "https://github.com/HandsOnLLM/Hands-On-Large-Language-Models"
  - "_raw/github-sources/hands-on-llms"
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
| **本地克隆** | `_raw/github-sources/hands-on-llms` |
| **章节数** | 12 章 + bonus 图解指南 |
| **运行环境** | Google Colab（推荐，免费 T4 GPU）或本地 conda 环境 |
| **前置要求** | 基础 Python；建议先了解 [[04_NLP_LLMs/LLM_Fundamentals\|LLM 基础]] |
| **外部引用** | [[references/books/hands-on-llms-alammar]] |

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
| Ch 1 | Introduction to Language Models | LLM 发展简史、GPT 系列、生成 vs 嵌入模型 | [[04_NLP_LLMs/LLM_Fundamentals\|LLM 基础]], [[04_NLP_LLMs/GenAI_L02_Exploring_and_Comparing_LLMs\|探索与比较 LLM]] |
| Ch 2 | Tokens and Embeddings | Tokenizer、子词切分、词嵌入、位置编码 | [[04_NLP_LLMs/Transformer_Architecture\|Transformer 架构]], [[04_NLP_LLMs/NLP_Fundamentals\|NLP 基础]] |
| Ch 3 | Looking Inside Transformer LLMs | 自注意力、多头注意力、层归一化、前馈网络 | [[04_NLP_LLMs/Transformer_Revolution/Self_Attention_Mechanism\|自注意力机制]], [[04_NLP_LLMs/Transformer_Architecture\|Transformer 架构]] |
| Ch 4 | Text Classification | 分类头、BERT 分类、Zero-shot 分类 | [[04_NLP_LLMs/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs\|微调 LLM]], [[08_Model_Evaluation/Model_Evaluation\|模型评估]] |
| Ch 5 | Text Clustering and Topic Modeling | 嵌入聚类、主题建模、BertTopic | [[02_Machine_Learning/Clustering\|聚类]]（如存在）, [[04_NLP_LLMs/NLP_Fundamentals\|NLP 基础]] |
| Ch 6 | Prompt Engineering | 提示模板、 few-shot、chain-of-thought、结构化输出 | [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering\|提示工程总览]], [[04_NLP_LLMs/Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals\|提示工程基础]] |
| Ch 7 | Advanced Text Generation Techniques and Tools | 采样策略、beam search、top-k/top-p、logit 处理 | [[04_NLP_LLMs/Prompt_Engineering/GenAI_L05_Advanced_Prompts\|高级提示技术]], [[04_NLP_LLMs/LLM_Fundamentals\|LLM 基础]] |
| Ch 8 | Semantic Search and Retrieval-Augmented Generation | 向量搜索、RAG pipeline、重排序 | [[11_RAG_Systems/RAG_Systems\|RAG 系统总览]], [[11_RAG_Systems/GenAI_L15_RAG_and_Vector_Databases\|RAG 与向量数据库]] |
| Ch 9 | Multimodal Large Language Models | CLIP、视觉编码器、多模态提示 | [[04_NLP_LLMs/Multimodal_Models/Multimodal_Models\|多模态模型]], [[05_Computer_Vision/Multimodal_Vision/Multimodal_Vision\|多模态视觉]] |
| Ch 10 | Creating Text Embedding Models | 对比学习、sentence-transformers、Matryoshka 嵌入 | [[11_RAG_Systems/Embedding_Models\|嵌入模型]]（如存在）, [[04_NLP_LLMs/LLM_Fundamentals\|LLM 基础]] |
| Ch 11 | Fine-tuning Representation Models for Classification | BERT 微调、LoRA、分类任务最佳实践 | [[04_NLP_LLMs/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs\|微调 LLM]], [[04_NLP_LLMs/Fine_tuning_Techniques/LoRA\|LoRA]]（如存在） |
| Ch 12 | Fine-tuning Generation Models | 指令微调、SFT、RLHF、DPO、奖励模型 | [[04_NLP_LLMs/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs\|微调 LLM]], [[07_Model_Training/GRPO_and_New_Alignment_Methods\|GRPO 与新对齐方法]] |

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

- [[references/books/hands-on-llms-alammar]] — 书籍引用索引与本地克隆路径
- [[90_Learn/Courses/Microsoft_GenAI_For_Beginners]] — 微软生成式 AI 入门课程（可与本书互补）
- [[90_Learn/Courses/Microsoft_AI_For_Beginners]] — 微软 AI 基础 12 周课程
