---
title: "L15 - 语言建模与自定义嵌入训练"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "nlp", "language-modeling", "word-embedding", "word2vec", "self-supervised-learning"]
summary: "从语义嵌入走向语言建模：利用自监督思想在无标注文本上训练 N-gram、CBoW 与 Skip-gram 模型，并动手用 PyTorch/TensorFlow 训练自己的 Word2Vec 嵌入。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/5-NLP/15-LanguageModeling/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L15 Language Modeling"
  - L15_Language_Modeling

---
# L15 - 语言建模与自定义嵌入训练

> **一句话理解**：语言建模（Language Modeling）让机器通过“预测文本中被遮住的词”来自我学习语言规律；本课带你用 N-gram、CBoW、Skip-gram 三种思路训练专属词嵌入（Word Embedding）。

---

## 本课概览

上一课（L14）介绍了现成的语义嵌入——Word2Vec、GloVe——它们能把词映射成语义相近的稠密向量。本课则进一步说明：这些嵌入本质上是**语言建模（Language Modeling）**的副产品；我们完全可以利用自己的领域文本，从头训练一套定制化嵌入。

语言建模的核心优势在于**自监督学习（Self-supervised Learning）**：不需要人工标注，只需把海量无标注文本中的某些词“遮住”，让模型预测被遮住的词。因为互联网上存在几乎无限的未标注文本，这种训练方式能轻松获得大量监督信号。

本课在课程中的位置属于 **V. 自然语言处理** 模块，承接 L13 的文本表示与 L14 的预训练嵌入，为后续 L16 的 RNN、L18 的 Transformer 做铺垫。学习目标是理解语言建模的基本范式，掌握 CBoW 与 Skip-gram 的训练逻辑，并能在官方 Notebook 中复现 Word2Vec 训练。

---

## 核心概念

- **语言建模（Language Modeling）**：构建能够“理解”或表示语言规律的模型。最朴素的定义是：给定前文，预测下一个词；或者更一般地，预测文本中缺失/被掩码（Masked）的词。

- **自监督学习（Self-supervised Learning）**：不依赖人工标签，而从数据自身构造监督信号。例如把句子中的某个词替换为 `[MASK]`，然后用原词作为标签训练模型。这种“填空”任务让模型学到词与词之间的共现关系。

- **N-gram 语言模型**：用前 $N-1$ 个词来预测第 $N$ 个词。例如 bigram 只考虑前一个词：
  $$
  P(w_n \mid w_{n-1})
  $$
  优点是简单直观，缺点是无法捕捉长距离依赖，且参数随词表指数增长。

- **连续词袋模型 CBoW（Continuous Bag-of-Words）**：给定上下文窗口内的词 $W_{-N}, \dots, W_{-1}, W_{1}, \dots, W_{N}$，预测中心词 $W_0$。它把周围词的表示“平均”后，去推断中间缺失的词。
  $$
  \text{目标：} \quad P(W_0 \mid W_{-N}, \dots, W_{-1}, W_{1}, \dots, W_{N})
  $$

- **Skip-gram 模型**：与 CBoW 相反，给定中心词 $W_0$，预测它周围的词集合 $\{W_{-N}, \dots, W_{-1}, W_{1}, \dots, W_{N}\}$。实践表明，Skip-gram 在大量语料上往往比 CBoW 更能捕捉稀有词的语义。
  $$
  \text{目标：} \quad P(W_{-N}, \dots, W_{-1}, W_{1}, \dots, W_{N} \mid W_0)
  $$

- **词嵌入（Word Embedding）训练的本质**：CBoW 与 Skip-gram 都在学习两个矩阵——输入嵌入矩阵与输出（上下文）嵌入矩阵。训练完成后，输入嵌入矩阵通常被保留为最终的词向量，词语之间的几何距离即可反映语义相似度。

---

## 关键知识点

- 语言模型通常使用**无标注文本**进行训练，因为标注数据昂贵且规模有限，而纯文本数据几乎取之不尽。
- “预测缺失词”是最常用的自监督任务，也常被称为**掩码语言建模（Masked Language Modeling, MLM）**的前身。
- CBoW 对常见词表现更平稳，训练速度更快；Skip-gram 对罕见词更敏感，语义关系更细腻。
- Word2Vec 的经典示意图（来自论文 *Efficient Estimation of Word Representations in Vector Space*）直观对比了 N-gram、RNN、CBoW 与 Skip-gram 的预测方向。
- 训练自定义嵌入时，需要关注：语料预处理、分词、窗口大小、嵌入维度、负采样（Negative Sampling）或层次 Softmax 等优化技巧。

---

## 代码/实验说明

官方为本课提供了两份可运行 Jupyter Notebook，分别基于 TensorFlow 与 PyTorch 实现 **CBoW 版 Word2Vec**：

- [CBoW-TF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/15-LanguageModeling/CBoW-TF.ipynb) — TensorFlow / Keras 实现
- [CBoW-PyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/15-LanguageModeling/CBoW-PyTorch.ipynb) — PyTorch 实现

### Notebook 核心流程概述

1. **数据准备**：下载并清洗语料（通常是经典文本），构建词表（Vocabulary）与词到索引的映射。
2. **构造训练样本**：以中心词 $W_0$ 为输入，上下文窗口内的词为输出标签；每个样本形如 `(context_indices, target_index)`。
3. **定义嵌入层**：使用 `Embedding(vocab_size, embedding_dim)` 作为词向量查找表。
4. **CBoW 前向传播**：把上下文词嵌入求平均（或求和），再经过一个线性层 + Softmax，预测中心词概率。
5. **损失函数**：交叉熵损失（Cross-Entropy Loss）。
6. **训练循环**：多次遍历语料，更新嵌入矩阵。
7. **可视化验证**：用 t-SNE 或 PCA 把训练好的高维嵌入降维，观察语义相近的词是否聚集在一起。

### 伪代码片段

```python
# 简化的 CBoW 训练逻辑
for epoch in range(num_epochs):
    for context_words, target_word in generate_cbow_samples(corpus):
        # context_words: [W_{-2}, W_{-1}, W_{1}, W_{2}]
        # target_word: W_0
        context_embeds = embedding(context_words)   # (window*2, embed_dim)
        context_mean = context_embeds.mean(dim=0)   # (embed_dim,)
        logits = output_linear(context_mean)        # (vocab_size,)
        loss = cross_entropy(logits, target_word)
        loss.backward()
        optimizer.step()
```

### 课后实验

官方实验要求把上述 CBoW 代码改造成 **Skip-gram** 模型：

- 输入：中心词 $W_0$
- 输出：窗口内的上下文词集合
- 损失：对每个上下文词分别计算交叉熵后求和或求平均

实验详情见 [lab/README.md](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/15-LanguageModeling/lab/README.md)。

---

## 本课不覆盖与延伸

- **不覆盖**：
  - 基于循环神经网络（RNN / LSTM）的神经语言模型（见 L16、L17）。
  - 基于 Transformer 的大规模预训练语言模型如 BERT、GPT（见 L18、L20）。
  - 子词（Subword）嵌入、上下文相关嵌入（Contextualized Embedding）等更现代的技术。
  - 负采样、层次 Softmax 等训练技巧的完整数学推导。

- **延伸**：
  - 官方 PyTorch 语言建模教程：[Word Embeddings: Encoding Lexical Semantics](https://pytorch.org/tutorials/beginner/nlp/word_embeddings_tutorial.html)
  - 官方 TensorFlow Word2Vec 教程：[Vector Representations of Words](https://www.tensorflow.org/tutorials/text/word2vec)
  - 使用 [Gensim](https://radimrehurek.com/gensim/) 可用几行代码训练 Word2Vec / FastText / Doc2Vec。
  - 本库进阶：[[大模型/Sequence_Models/Sequence_Models]]、[[大模型/LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]]。

---

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[大模型/Sequence_Models/Sequence_Models]]
  - [[大模型/LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]]
