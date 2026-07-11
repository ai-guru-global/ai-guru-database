---
title: "NLP with Transformers"
category: "-references-books"
tags:
  - book
  - learning-resource
  - nlp
  - transformers
  - hugging-face
  - lewis-tunstall
  - oreilly
summary: "Hugging Face 团队撰写的 Transformers 实战指南，系统讲解从 Transformer 架构到 BERT、GPT、T5 的 NLP 任务全流程，配套 Hugging Face 库实战。"
sources:
  - "https://www.oreilly.com/library/view/natural-language-processing/9781098136789/"
created: 2026-06-12
updated: 2026-07-11
lifecycle: reviewed
tier: supporting
aliases:
  - "Nlp With Transformers"
  - "nlp with transformers"

---
# NLP with Transformers

> **一句话理解**: Hugging Face 团队核心成员撰写，以 Transformers 库为主线，从注意力机制讲到 BERT/GPT/T5，是 NLP 工程师必备的 Transformer 实战手册。

## 书籍信息

| 属性 | 说明 |
|------|------|
| **书名** | Natural Language Processing with Transformers（修订版） |
| **作者** | Lewis Tunstall、Leandro von Werra、Thomas Wolf |
| **出版社** | O'Reilly（2022，修订版 2024） |
| **页数** | 约 300 页 |
| **难度** | ⭐⭐⭐（中级） |
| **代码语言** | Python（Hugging Face Transformers / Datasets） |
| **链接** | [O'Reilly](https://www.oreilly.com/library/view/natural-language-processing/9781098136789/) |

## 核心内容概要

1. **Transformer 架构解析** — 注意力机制、编码器 vs 解码器
2. **文本分类** — BERT 微调实战
3. **Transformer 剖析** — 编码器族（BERT）、解码器族（GPT）、编码器-解码器族（T5）
4. **多语种命名实体识别（NER）** — 序列标注
5. **文本生成** — GPT 系列、采样策略
6. **文本摘要与翻译** — Seq2Seq 任务
7. **问答系统** — 抽取式问答
8. **让 Transformer 更高效** — 知识蒸馏、量化、剪枝
9. **处理少量标注数据** — 数据增强、半监督学习
10. **训练 Transformer 从零开始** — 从头训练一个 GPT
11. **未来方向** — 多模态、检索增强等

## 适合人群

- **级别**: 中级
- **前置知识**: Python、深度学习基础、了解 NLP 概念
- **适合**: NLP 工程师、需要掌握 Hugging Face 生态的开发者

## 知识库章节映射

| 本书章节 | 推荐参考 |
|----------|----------|
| Ch 1-3 Transformer | [[大模型/LLM_Fundamentals]] |
| Ch 2/4 微调 | [[大模型/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] |
| Ch 5 文本生成 | [[大模型/Prompt_Engineering/Prompt_Engineering]] |
| Ch 8 模型压缩 | [[部署推理/]] |
| Ch 10 从头训练 | [[深度学习/]] |

## 学习建议

- **阅读顺序**: 前三章打基础（务必理解注意力机制），后续按需阅读
- **实战搭配**: 搭配 Hugging Face 官方课程（free）同步练习
- **进阶**: 读完后可衔接 [[build-llm-from-scratch-raschka]] 深入底层实现

## 亮点与局限

- ✅ **亮点**: 代码完整、HF 生态全覆盖、由 HF 核心团队撰写（权威）、实战导向
- ⚠️ **局限**: 以预训练模型应用为主，不深入大模型预训练细节；出版较早（2022），未覆盖 ChatGPT 后的最新进展

> **关联**: → [[学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[大模型/LLM_Fundamentals]] | [[深度学习/]]
