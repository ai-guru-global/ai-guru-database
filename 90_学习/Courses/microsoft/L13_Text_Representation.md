---
title: "L13 - 文本表示：词袋模型与 TF-IDF"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "nlp", "text-representation", "bag-of-words", "tf-idf"]
summary: "本课介绍如何将文本转换为神经网络可处理的张量，重点讲解词袋模型（BoW）与 TF-IDF 两种经典表示方法，并说明它们的局限与后续方向。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/5-NLP/13-TextRep/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L13 Text Representation"
  - L13_Text_Representation
sources: []

name_zh: "L13 - 文本表示：词袋模型与 TF-IDF"
---
# L13 - 文本表示：词袋模型与 TF-IDF

> 中文简称：L13 - 文本表示：词袋模型与 TF-IDF

> **一句话理解**：在让神经网络理解文字之前，我们需要先把文本变成数字向量；本课从最简单的字符/词 one-hot 编码出发，过渡到词袋模型与 TF-IDF，为后续词嵌入与语言模型打基础。

---

## 本课概览

本课是 NLP（自然语言处理，Natural Language Processing）模块的第一节，围绕**文本分类**这一核心任务展开。课程以 [AG News](https://www.kaggle.com/amananandrai/ag-news-classification-dataset) 新闻分类数据集为例，目标是把一条新闻标题与正文归入 *Sci/Tech、Business、Sports、World* 等类别。

在课程中的位置：我们已经学完了计算机视觉（CNN、VAE、GAN 等），现在开始处理序列化、非结构化的文本数据。本课先建立最基础的文本→张量表示方法，下一课（L14）将引入 Word2Vec/GloVe 等**分布式词嵌入**，再往后则是 RNN、Transformer 与大语言模型。

学习目标：
- 理解字符级与词级表示的优缺点。
- 掌握 N-gram 的动机与问题。
- 能用词袋模型（Bag-of-Words，BoW）与 TF-IDF 将文本表示为固定长度向量。
- 认识到上述方法无法捕捉词序与语义，为后续学习语言模型埋下伏笔。

---

## 核心概念

### 1. 文本 → Token → 数字

神经网络只能处理数值张量，因此任何文本处理流程都需先完成两步：
1. **分词（Tokenization）**：把文本切分为字符、词或子词单元，每个单元称为一个 **token**。
2. **编号与编码**：建立**词表（vocabulary）**，把每个 token 映射为整数；再用 one-hot 编码或嵌入向量送入网络。

> 示例：字符级表示中，若语料包含 *C* 种不同字符，单词 *Hello* 会被表示为一个 `5 × C` 的稀疏张量；词级表示则把每个词映射为词表大小的 one-hot 向量。

### 2. 字符级 vs 词级表示

| 表示方式 | 优点 | 缺点 |
|---|---|---|
| **字符级** | 词表小，能处理拼写错误与未登录词 | 每个字符本身语义弱，序列长 |
| **词级** | 以更高层语义单元起步，任务更简单 | 词表大、张量稀疏、存在 OOV（Out-of-Vocabulary）问题 |

### 3. N-gram：用局部上下文弥补单语义的不足

自然语言中词义依赖上下文。例如 *neural network*（神经网络）与 *fishing network*（渔网）中的 *network* 含义完全不同。

**N-gram** 把相邻 N 个词组合为一个 token：
- **Bigram（2-gram）**：*I like*, *like to*, *to go*, *go fishing*。
- **Trigram（3-gram）**：*I like to*, *like to go*, *to go fishing*。

动机：让模型看到局部搭配信息。  
问题：词表规模随 N 指数增长；*go fishing* 与 *go shopping* 被当作完全不同的 token，无法共享动词 *go* 的语义。

### 4. 词袋模型（Bag-of-Words，BoW）

BoW 把一篇文档中所有词的 one-hot 向量相加，得到一个固定长度的**词频向量**。它回答了两个问题：
- 哪些词出现了？
- 每个词出现了多少次？

对于分类任务而言，BoW 往往已经够用：政治新闻常见 *president*、*country*；科技新闻常见 *collider*、*discovered*。词频本身就能提供很强的内容信号。

### 5. TF-IDF：降低常见词的权重

BoW 的缺陷在于 *and*、*is*、*the* 等停用词（stop words）频率极高，会淹没真正有区分度的词。**TF-IDF（Term Frequency–Inverse Document Frequency，词频-逆文档频率）** 通过全局文档统计来抑制常见词、放大稀有但重要的词。

常用定义：

$$
\text{TF}(t, d) = \frac{\text{词 } t \text{ 在文档 } d \text{ 中出现的次数}}{\text{文档 } d \text{ 中的总词数}}
$$

$$
\text{IDF}(t, D) = \log \frac{N}{|\{d \in D : t \in d\}|}
$$

$$
\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)
$$

其中：
- $N$ 为文档总数；
- $|\{d \in D : t \in d\}|$ 为包含词 $t$ 的文档数；
- 为避免除零，通常会在分母加 1（smoothed IDF）。

结果：在几乎所有文档里都出现的词 IDF 接近 0，从而对分类贡献被压低。

---

## 关键知识点

- 文本表示是 NLP 的预处理基础，**分词策略**（字符/词/N-gram/子词）会直接影响模型效果与计算成本。
- **One-hot 编码**简单但稀疏高维，无法表达词与词之间的相似性。
- **BoW** 将文档压缩为固定维度向量，适合主题分类等任务，但完全丢失词序与上下文。
- **TF-IDF** 在 BoW 之上引入全局统计，缓解高频停用词的主导问题，是经典机器学习文本分类的标配特征。
- BoW 与 TF-IDF 都无法真正理解语义，只能统计词的共现与频率；要捕捉上下文含义，需要语言模型与词嵌入。

---

## 代码/实验说明

官方为这节课提供了两个可运行 Notebook：

- **PyTorch 版本**：[TextRepresentationPyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/13-TextRep/TextRepresentationPyTorch.ipynb)
- **TensorFlow 版本**：[TextRepresentationTF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/13-TextRep/TextRepresentationTF.ipynb)

### 实验内容概述

1. **加载 AG News 数据集**，查看新闻类别与样本文本。
2. **构建词表与分词器**：将文本拆分为词，并过滤低频词。
3. **实现 BoW 表示**：把每条新闻转为词频向量。
4. **实现 TF-IDF 表示**：基于整个训练集计算 IDF，再生成 TF-IDF 向量。
5. **训练简单分类器**：
   - PyTorch 中可用 `torch.nn.Linear` 接一个全连接层；
   - TensorFlow/Keras 中可用 `tf.keras.layers.Dense` 或 `TfidfVectorizer` + 分类器。
6. **评估分类准确率**，观察 BoW 与 TF-IDF 的效果差异。

### 核心伪代码

```python
# 1. 分词并构建词表
tokens = [tokenize(doc) for doc in corpus]
vocab = build_vocab(tokens)  # word -> index

# 2. BoW 向量
bow_vector = np.zeros(len(vocab))
for token in tokens:
    bow_vector[vocab[token]] += 1

# 3. TF-IDF 向量
tf = bow_vector / sum(bow_vector)
idf = log(N / (1 + document_frequency))
tfidf_vector = tf * idf

# 4. 送入线性分类器
model = LinearClassifier(input_size=len(vocab), num_classes=4)
```

> 提示：在真实项目中，可直接使用 `sklearn.feature_extraction.text.TfidfVectorizer` 或深度学习框架的文本工具包来加速实验。

---

## 本课不覆盖与延伸

- **不覆盖**：
  - 子词分词（BPE、WordPiece）与未登录词处理。
  - 分布式词嵌入（Word2Vec、GloVe）及其训练细节（见 L14）。
  - 能建模序列信息的 RNN、Transformer 与大语言模型（见 L16–L20）。
  - 文本预处理中的清洗、去噪、多语言分词等工程细节。

- **延伸**：
  - 完成课后挑战：[Kaggle Bag-of-Words 入门赛](https://www.kaggle.com/competitions/word2vec-nlp-tutorial/overview/part-1-for-beginners-bag-of-words)。
  - 通过 Microsoft Learn 模块 [Intro to Natural Language Processing with PyTorch](https://docs.microsoft.com/learn/modules/intro-natural-language-processing-pytorch/?WT.mc_id=academic-77998-cacaste) 进一步练习文本嵌入与 BoW。
  - 阅读本库 [[05_大模型/06_LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]] 了解现代大模型数据工程如何扩展这些基础表示。
  - 阅读本库 [[05_大模型/02_Sequence_Models/Sequence_Models]] 理解从 BoW 到序列建模的演进。

---

## 相关阅读

- 课程索引：[[90_学习/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[05_大模型/06_LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]]
  - [[05_大模型/02_Sequence_Models/Sequence_Models]]

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
