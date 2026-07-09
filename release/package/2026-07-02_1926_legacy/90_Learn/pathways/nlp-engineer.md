---
title: "NLP 工程师学习路径"
category: 90-learn-pathways
tags: ["learning", "nlp", "llm", "career", "roadmap"]
summary: "NLP 工程师专注于文本和语言相关的 AI 应用——从传统 NLP 到大语言模型，掌握语言智能的全栈能力。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "NLP Engineer Path"
  - "NLP Learning Path"
---

# NLP 工程师学习路径 (NLP Engineer Learning Path)

> NLP 工程师专注于文本和语言相关的 AI 应用——从传统 NLP 到大语言模型，掌握语言智能的全栈能力。

---

## 1. 角色定位

| 维度 | 说明 |
|------|------|
| 核心职责 | 文本处理、语义理解、对话系统、LLM 应用开发 |
| 技能重心 | 语言学 + 深度学习 + LLM 工程 |
| 与CV工程师区别 | NLP 处理文本/语音，CV 处理图像/视频 |
| 典型产出 | 文本分类系统、搜索引擎、对话机器人、RAG 系统 |

---

## 2. 技能路线图

### 阶段一：NLP 基础（2-3个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 文本预处理 | 分词、词干化、清洗 | [[NLP_Fundamentals]] |
| 词向量 | Word2Vec, GloVe, FastText | [[Sequence_Models]] |
| 经典模型 | RNN, LSTM, GRU | [[Sequence_Models]] |
| 文本分类 | 情感分析、主题分类 | 实战项目 |
| 信息抽取 | NER、关系抽取 | 实战项目 |

### 阶段二：Transformer 与预训练（3-4个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| Transformer 架构 | Self-Attention, 位置编码 | [[Transformer_Architecture]] |
| BERT 系列 | 预训练、微调 | [[Transformer_Deep_Dive]] |
| GPT 系列 | 自回归生成 | [[LLM_Architecture_Evolution]] |
| 微调技术 | LoRA, QLoRA, PEFT | [[Fine_tuning_Techniques]] |
| 分布式训练 | DeepSpeed, FSDP | [[Distributed_Training_2026]] |

### 阶段三：LLM 工程（3-4个月）

| 主题 | 核心内容 | 推荐资源 |
|------|---------|---------|
| Prompt Engineering | 提示词设计、Few-shot | [[Prompt_Engineering]] |
| RAG 系统 | 检索增强生成 | [[RAG_Fundamentals]] |
| Agent 开发 | 工具调用、规划 | [[Agentic_AI_Complete_Guide]] |
| 结构化输出 | JSON Mode, Function Calling | [[Structured_Output_Guide]] |
| 模型部署 | vLLM, 推理优化 | [[LLM_Inference_Deep_Dive]] |

### 阶段四：专项深入（2-3个月）

| 方向 | 核心内容 | 推荐资源 |
|------|---------|---------|
| 对话系统 | 多轮对话、状态管理 | 实战项目 |
| 机器翻译 | Seq2Seq, 多语言模型 | 实战项目 |
| 语音AI | ASR, TTS | [[Speech_Audio_AI_Deep_Dive]] |
| 中文NLP | 中文分词、中文LLM | [[大模型/Chinese_LLM_Ecosystem/README]] |

---

## 3. 模型选型指南

| 场景 | 推荐模型 | 参数量 | 延迟 |
|------|---------|--------|------|
| 文本分类 | BERT-base, DeBERTa | 100M | <10ms |
| 文本生成 | Llama-3-8B, Qwen2-7B | 7-8B | <100ms |
| 高质量生成 | GPT-4o, Claude-3.5 | 未公开 | <2s |
| 嵌入向量 | BGE, E5, GTE | 100M | <5ms |
| 中文场景 | Qwen2, DeepSeek-V2 | 7-72B | <200ms |

---

## 4. 相关路径

- [[ai-engineer]]: 偏应用集成
- [[cv-engineer]]: 视觉方向
- [[ai-researcher]]: 偏算法创新

---

*Last updated: 2026-07-02*
