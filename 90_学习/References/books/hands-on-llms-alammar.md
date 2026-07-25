---
title: "Hands-On Large Language Models"
category: -references-books
tags:
  - book
  - learning-resource
  - llm
  - nlp
  - jay-alammar
  - maarten-grootendorst
  - oreilly
  - visualization
  - rag
  - embedding
  - fine-tuning
  - multimodal
summary: "图解式 LLM 实战指南，作者 Jay Alammar & Maarten Grootendorst，近 300 张定制图表 + 12 章 Jupyter Notebook，覆盖 Token/嵌入、Transformer 内部机制、文本分类/聚类、提示工程、RAG、多模态、嵌入模型、BERT 与生成模型微调。"
sources:
  - "https://www.amazon.com/Hands-Large-Language-Models-Understanding/dp/1098150961"
  - "https://github.com/HandsOnLLM/Hands-On-Large-Language-Models"
  - "原始/github-sources/hands-on-llms"
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: reviewed
lifecycle_changed: 2026-07-23
tier: supporting
created: 2026-06-12
updated: 2026-07-23
aliases:
  - "Hands On Llms Alammar"
  - "hands on llms alammar"

---
# Hands-On Large Language Models

> **一句话理解**: 被誉为"图解版 LLM 教程"的实战书籍，用近 300 张定制图表和可运行的 Jupyter Notebook，系统讲解从 Token 处理到 BERT/生成模型微调的全栈 LLM 知识。所有示例可在 Google Colab 免费运行。

## 书籍概述

### 作者背景

**Jay Alammar** 是 AI 可视化教育领域的标杆人物。他创建的博客 jalammar.github.io 以"图解"系列闻名业界——《The Illustrated Transformer》《The Illustrated BERT》《The Illustrated GPT-2》等文章几乎是每个 LLM 学习者的必读入门资料，其图表被广泛转载引用。他的核心方法论是：**一图胜千言，把抽象的数学与架构用直观的视觉语言表达出来**。

**Maarten Grootendorst** 是一位资深数据科学家，同时也是开源 NLP 库的关键贡献者（包括 Transformers 概念解释项目、BERTopic 的作者）。他的写作同样强调可视化与直觉，擅长把学术研究转化为工程实践。

两位作者的组合堪称"可视化 + 工程化"的双剑合璧，使本书成为 LLM 入门领域最友好的教材之一。

### 出版信息

| 属性 | 说明 |
|------|------|
| **书名** | Hands-On Large Language Models |
| **作者** | Jay Alammar & Maarten Grootendorst |
| **出版社** | O'Reilly（2024） |
| **ISBN** | 978-1098150969 |
| **GitHub** | [HandsOnLLM/Hands-On-Large-Language-Models](https://github.com/HandsOnLLM/Hands-On-Large-Language-Models) |
| **本地克隆** | `原始/github-sources/hands-on-llms` |
| **购买链接** | [Amazon](https://www.amazon.com/Hands-Large-Language-Models-Understanding/dp/1098150961)、[O'Reilly](https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/) |

### 本书定位

本书是 **"图解 + 实战"双驱动的 LLM 教材**：

- **不是**纯理论书（不讲训练大模型的分布式工程）
- **不是**纯应用书（不深入 Agent/RAG 系统设计）
- **而是**讲"LLM 是什么、内部如何运作、怎么用"的概念+实操桥梁

在知识库的书籍谱系中：
- 上承 [[hands-on-ml-geron]]（ML/DL 基础）
- 平行 [[nlp-with-transformers]]（HF 生态应用）、[[build-llm-from-scratch-raschka]]（底层实现）
- 是 [[05_大模型/01_LLM_Fundamentals]] 的**最佳入门配套**

## 核心内容

全书 12 章 + bonus 扩展指南，覆盖从 Token 到微调的完整 LLM 技术栈。以下是分章详解与图解要点。

### 本书图解方法论

两位作者的核心教学方法是"图解先行"。理解他们的可视化风格有助于高效阅读：

| 图解类型 | 用于解释 | 典型章节 |
|---------|---------|---------|
| 数据流图 | Token → Embedding → Attention 流动 | Ch 2, 3 |
| 热力图 | 注意力权重分布 | Ch 3 |
| 几何图 | 向量空间语义关系 | Ch 2, 10 |
| 架构图 | Transformer 组件拼装 | Ch 3 |
| 流程图 | RAG / 采样 / 微调流程 | Ch 7, 8, 11 |

**阅读建议**: 先看图建立直觉，再读代码验证，最后看公式巩固。

### Ch 2 详解: Token 与 Embedding 的图解

本章是全书基石。关键图解概念：

**Tokenization 的可视化**:
- 展示一句话如何被切成 Token（词/子词）
- 展示 Token 数量如何影响成本（API 按 Token 计费）
- BPE 的合并过程图示

**Embedding 空间的几何直觉**:
- "国王 - 男人 + 女人 ≈ 女王" 的经典向量算术
- 语义相近的词在向量空间中聚集
- 位置编码如何在向量空间中表示顺序

### Ch 3 详解: Transformer 内部的可视化

全书最精华章节，用热力图揭示注意力：

**注意力热力图解读**:
- 横轴/纵轴是 Token，颜色深浅表示注意力权重
- 可以看到不同 Head 关注不同模式（语法、共指、语义）
- 因果掩码让热力图呈下三角形状

**多头注意力的并行视角**:
- 每个 Head 独立做注意力，关注不同子空间
- 拼接后线性投影回原维度
- 类比：多个"专家"从不同角度看同一个问题

### Ch 5 详解: BERTopic 与主题建模

Grootendorst 自己开发的 BERTopic 是本章核心：

**BERTopic 流程**:
```
文档集 → Embedding（用 sentence-transformers）
       → 降维（UMAP，降到 5 维）
       → 聚类（HDBSCAN，发现主题簇）
       → 主题表示（c-TF-IDF 提取关键词）
```

**应用场景**: 用户反馈分析、新闻聚类、学术文献分组。

### Ch 7 详解: 采样策略的图解

生成文本的核心是采样策略。本章图解清晰展示：

| 策略 | 机制 | 效果 |
|------|------|------|
| Greedy | 每步选概率最高 | 重复、保守 |
| Beam Search | 保留 top-K 序列 | 流畅但缺乏多样性 |
| Temperature | 调整 logits 软硬度 | 高温更随机，低温更确定 |
| Top-k | 只从 top-K 中采样 | 避免低概率词 |
| Top-p (Nucleus) | 从累积概率达 p 的最小集合采样 | 自适应，更自然 |

### Ch 8 详解: 语义搜索与 RAG 的图解

**关键词 vs 语义搜索的对比**:
- BM25: 匹配词频，"苹果手机" 和 "iPhone" 不匹配
- Embedding: 语义相近，"苹果手机" 和 "iPhone" 向量距离近

**RAG 的端到端流程图**:
```
文档 → 切块 → Embedding → 向量库（索引）
                              ↓
用户问题 → Embedding → 检索 Top-K → 拼接上下文 → LLM → 答案
```

### Ch 9-10 详解: 多模态与嵌入模型

**CLIP 的图解**:
- 图像编码器 + 文本编码器，映射到同一空间
- 对比学习：匹配的图文对拉近，不匹配的推远
- 应用：以图搜文、以文搜图、零样本分类

**嵌入模型训练的图解**:
- 对比学习（正样本拉近，负样本推远）
- 困难负样本挖掘提升判别力
- MTEB 评估基准的多任务覆盖

### Ch 11-12 详解: 微调的两种路径

**分类微调（Ch 11）vs 生成微调（Ch 12）的对比**:

| 维度 | 分类微调（BERT 类） | 生成微调（GPT 类） |
|------|-------------------|-------------------|
| 目标 | 理解/分类 | 生成/对话 |
| 数据 | (文本, 标签) | (指令, 输出) |
| 输出头 | 分类层 | LM Head（词表概率） |
| 技术 | LoRA / 全量 | QLoRA / SFT |
| 评估 | F1 / Accuracy | 人工 / ROUGE |



### Ch 1: Language Models 简介

- **什么是语言模型**: 给定上文，预测下一个 Token 的概率分布
- **演进史**: n-gram → 神经语言模型（Word2Vec）→ Transformer（GPT/BERT）
- **预训练范式**: 自监督学习——从海量无标注文本中学习语言规律
- **能力光谱**: 生成（GPT）vs 理解（BERT）vs 两者（T5）

### Ch 2: Tokens and Embeddings

本章是全书基石，图解 Token 与向量化全流程：

- **Tokenization**:
  - 词/字符/子词分词的权衡
  - BPE（Byte-Pair Encoding）的图解原理
  - Token 数量与成本的关系
- **Token Embedding**:
  - 把 Token ID 映射为稠密向量（词嵌入矩阵）
  - 向量空间的几何意义：语义相近 → 向量相近
- **位置嵌入（Positional Embedding）**:
  - 绝对位置 vs 相对位置
  - 为什么 Transformer 需要显式位置信息

### Ch 3: Looking Inside Transformer LLMs

图解 Transformer 内部结构，是全书最精华章节：

- **Self-Attention 可视化**:
  - Q/K/V 矩阵的角色
  - 注意力权重的热力图解读
- **多头注意力（Multi-Head Attention）**:
  - 不同头关注不同模式（语法、语义、共指等）
- **前馈网络（FFN）与残差连接**
- **LayerNorm 的作用**
- **完整数据流**: 输入 → Embedding → N×(Attention + FFN) → 输出

### Ch 4: Text Classification

- **零样本分类**: 直接用 LLM prompt 做分类（无需训练）
- **Few-shot 分类**: 给几个例子提升准确率
- **使用 sentence-transformers**: 用嵌入 + 简单分类器（如逻辑回归）
- **评估指标**: Accuracy、F1、Confusion Matrix

### Ch 5: Text Clustering and Topic Modeling

- **主题模型演进**: LDA → 基于 Embedding 的聚类
- **BERTopic**: Grootendorst 自己开发的主题建模库
  - Embedding → 降维（UMAP）→ 聚类（HDBSCAN）→ 主题表示（c-TF-IDF）
- **应用**: 文档分组、趋势发现、用户反馈分析

### Ch 6: Prompt Engineering

- **提示工程基础**: Zero-shot、Few-shot、CoT
- **结构化提示**: System Prompt、角色设定、输出格式约束
- **高级技巧**:
  - Self-Consistency（多次采样取多数）
  - Chain-of-Thought（让模型展示推理过程）
  - ReAct（推理 + 行动）
- 详见 [[05_大模型/08_Prompt_Engineering/Prompt_Engineering]]

### Ch 7: Advanced Text Generation Techniques

- **采样策略**:
  - Greedy vs Beam Search vs Sampling
  - Temperature、Top-k、Top-p（Nucleus Sampling）的图解
- **结构化生成**: JSON Mode、Grammar 约束
- **Logit 处理**: Logits Processor 自定义生成逻辑

### Ch 8: Semantic Search and RAG

- **语义搜索 vs 关键词搜索**:
  - BM25（关键词）的局限
  - Embedding 相似度（语义）的优势
- **RAG（检索增强生成）**:
  - 索引（Embedding + 向量库）→ 检索 → 拼接上下文 → 生成
  - Chunking 策略、Reranking
- 详见 [[14_RAG系统/RAG_Systems]]

### Ch 9: Multimodal Large Language Models

- **CLIP**: 连接图像和文本的统一表示空间
  - 对比学习：图像和描述文本对齐
- **多模态架构**: 视觉编码器 + LLM + 跨模态投影
- **应用**: 图像描述、视觉问答、图文检索

### Ch 10: Creating Text Embedding Models

- **嵌入模型训练**:
  - 监督微调（用标注对）
  - 对比学习（SimCSE、Sentence-BERT）
- **数据增强**: 困难负样本挖掘
- **评估**: MTEB（Massive Text Embedding Benchmark）
- **模型选择**: text-embedding-3、bge、e5

### Ch 11: Fine-tuning Representation Models for Classification

- **BERT 微调**:
  - 冻结 vs 全量微调
  - 分类头设计
- **PEFT 技术**:
  - LoRA 的图解原理
  - Adapter Tuning
- **训练技巧**: 学习率、Warmup、早停

### Ch 12: Fine-tuning Generation Models

- **指令微调（Instruction Tuning）**:
  - 数据格式: Alpaca / ShareGPT
  - 训练 GPT 类模型跟随指令
- **QLoRA**: 4-bit 量化 + LoRA，降低显存需求
- **评估**: 生成质量的人工与自动评估

## Bonus 扩展指南

作者在 GitHub 仓库 `bonus/` 目录持续发布图解专题，这些是本书的自然延伸：

- **A Visual Guide to Mamba** — 状态空间模型（SSM）新架构
- **A Visual Guide to Quantization** — INT8/INT4 量化的图解
- **A Visual Guide to Mixture of Experts (MoE)** — 专家混合架构
- **A Visual Guide to Reasoning LLMs** — 推理模型（如 DeepSeek-R1）
- **The Illustrated Stable Diffusion** — 扩散模型图解
- **The Illustrated DeepSeek-R1** — 推理模型详解

## 关键概念图解（文字描述）

### Token → Embedding 流程

```
"hello world"
  ↓ Tokenizer (BPE)
[15339, 1917]  (Token IDs)
  ↓ Embedding 查表
[[0.12, -0.5, ...],   ← "hello" 的向量 (768维)
 [0.88, 0.3, ...]]    ← "world" 的向量 (768维)
  ↓ + Positional Embedding
[[0.12+pos1, ...],
 [0.88+pos2, ...]]
  → 送入 Transformer
```

### 注意力热力图

```
句子: "The cat sat on the mat because it was tired"

注意力（"it" 关注谁）:
  The   cat   sat   on   the   mat   because   it   was   tired
                              ↑               ↑(最强)
"it" 最关注 "cat" → 模型学到了共指消解（it = cat）
```

### RAG 流程

```
用户问题 → Embedding → 向量检索（Top-K 文档）
                              ↓
          拼接: [问题 + 检索到的文档] → LLM → 生成答案
```

## 知识映射（本书概念在本知识库的位置）

| 本书章节 | 本书概念 | 知识库主题 | 关联说明 |
|----------|----------|------------|----------|
| Ch 1-2 基础 | Token/Embedding | [[05_大模型/01_LLM_Fundamentals]] | LLM 基础概念 |
| Ch 3 内部机制 | Attention/Transformer | [[03_深度学习/]] | 注意力与架构 |
| Ch 4-5 分类/聚类 | 表示学习 | [[02_机器学习/]] | 文本分析应用 |
| Ch 6-7 提示/生成 | Prompt/采样 | [[05_大模型/08_Prompt_Engineering/Prompt_Engineering]] | 提示与解码 |
| Ch 8 搜索/RAG | 语义检索 | [[14_RAG系统/RAG_Systems]] | RAG 系统 |
| Ch 9 多模态 | CLIP/VLM | [[04_计算机视觉/]] | 多模态 |
| Ch 10 嵌入模型 | Embedding 训练 | [[05_大模型/01_LLM_Fundamentals]] | 嵌入模型 |
| Ch 11-12 微调 | LoRA/QLoRA/SFT | [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] | 微调技术 |

## 适合人群

| 角色 | 阅读重点 | 收益 |
|------|----------|------|
| **LLM 初学者** | 全书 | 最友好的入门路径 |
| **应用开发者** | Ch 4, 6, 8 | 分类、提示、RAG 实战 |
| **数据科学家** | Ch 5, 10, 11 | 聚类、嵌入、微调 |
| **教育者/布道师** | Ch 3 + Bonus | 最佳教学素材来源 |
| **转行工程师** | 全书 | 可视化降低学习门槛 |

### 前置知识

- **必备**: Python、基础机器学习概念
- **建议**: 了解神经网络基础
- **加分**: 有用过 Hugging Face 或 OpenAI API 的经验

## 对比同类书

| 维度 | 本书（图解+实战） | [[nlp-with-transformers]] | [[build-llm-from-scratch-raschka]] |
|------|-------------------|---------------------------|-------------------------------------|
| **方法论** | 图解 + Notebook | HF 库应用 | 从零实现 |
| **可视化** | 最强（300 图） | 中 | 少 |
| **代码深度** | 中（API 级） | 中（API 级） | 深（逐行） |
| **覆盖广度** | 最广（12章） | 中（NLP 为主） | 窄（仅 GPT） |
| **适合** | 建立直觉 + 广度 | NLP 应用 | 深挖实现 |

三者最佳组合: 本书建直觉 → [[nlp-with-transformers]] 学 HF 应用 → [[build-llm-from-scratch-raschka]] 深挖底层。

## 推荐阅读路径

### 路径 A: 系统学习（3-4 周）

1. **Week 1**: Ch 1-3（基础概念 + 内部机制，重点看图）
2. **Week 2**: Ch 4-7（分类、聚类、提示、生成）
3. **Week 3**: Ch 8-9（搜索/RAG + 多模态）
4. **Week 4**: Ch 10-12（嵌入与微调）

### 路径 B: 按需查阅

- **做 RAG**: 重点 Ch 8 + Ch 10（嵌入模型）
- **做分类**: 重点 Ch 4 + Ch 11（微调 BERT）
- **做生成**: 重点 Ch 6-7 + Ch 12（微调生成模型）

### 路径 C: 配合知识库

1. 本书 Ch 3 建立注意力直觉
2. [[build-llm-from-scratch-raschka]] Ch 3 手动实现验证
3. [[nlp-with-transformers]] 用 HF 库工程化

## 亮点与局限

### 亮点

- **图解之王**: 近 300 张定制图表，把抽象概念视觉化，业界无出其右
- **作者权威**: 两位都是可视化教育领域的标杆人物
- **覆盖全栈**: 从 Token 到微调，从文本到多模态，一站式覆盖
- **可免费运行**: 全部 Notebook 在 Google Colab 可跑，零硬件门槛
- **持续更新**: Bonus 目录跟踪前沿（Mamba、MoE、量化等）

### 局限

- **不深入底层实现**: 用 HF API 为主，不手撕架构（需配合 [[build-llm-from-scratch-raschka]]）
- **出版于 2024**: 未覆盖 2025-2026 最新（如原生多模态、推理模型细节）
- **偏 NLP/表示**: 对 Agent、系统设计覆盖较少
- **代码深度有限**: 适合建立直觉，但生产级工程需另学

## 延伸阅读

- [[90_学习/References/books/nlp-with-transformers|NLP with Transformers]] — HF 生态深入
- [[90_学习/References/books/build-llm-from-scratch-raschka|Build LLM From Scratch]] — 底层实现互补
- [[90_学习/References/books/hands-on-ml-geron|Hands-On ML]] — ML/DL 基础
- [[05_大模型/01_LLM_Fundamentals]] — 知识库 LLM 基础
- [[05_大模型/08_Prompt_Engineering/Prompt_Engineering]] — 提示工程总览
- [[14_RAG系统/RAG_Systems]] — RAG 系统专题
- [[90_学习/guides/ai_engineering_roadmap_2026|AI 工程路线图 2026]]

> **关联**: → [[90_学习/guides/ai_engineering_roadmap_2026|AI 工程路线图]] | [[05_大模型/01_LLM_Fundamentals]] | [[03_深度学习/]] | [[14_RAG系统/]] | [[04_计算机视觉/]]
