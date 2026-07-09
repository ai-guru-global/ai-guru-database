---
title: "L14 - 语义词嵌入：Word2Vec 与 GloVe"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "nlp", "word-embeddings", "word2vec", "glove", "pytorch", "tensorflow"]
summary: "本课介绍如何用低维稠密向量表示词语，从可学习的 Embedding 层到 Word2Vec/GloVe 等语义预训练嵌入，并讨论上下文嵌入对一词多义的必要性。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/5-NLP/14-Embeddings/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L14 Semantic Word Embeddings"
  - L14_Semantic_Word_Embeddings

---
# L14 - 语义词嵌入：Word2Vec 与 GloVe

> **一句话理解**：把词语从稀疏高维的 one-hot 向量压缩成低维稠密向量，让语义相近的词在向量空间中彼此靠近。

---

## 本课概览

在前一节课（L13）中，我们使用词袋模型（Bag-of-Words, BoW）或 TF-IDF 将文本表示为高维稀疏向量。这类表示有两个明显缺陷：一是维度随词表线性增长，内存开销大；二是每个词被当作独立符号，向量之间无法表达语义相似性。

本课进入自然语言处理的第 5 模块（NLP），目标是学习**词嵌入（Word Embedding）**：用低维稠密向量表示词语，使语义相近的词在向量空间中距离更近。课程首先介绍神经网络中的可训练 Embedding 层，随后讲解 Word2Vec 的两种训练目标（CBoW 与 Skip-gram），并简要提及 GloVe 作为另一种经典预训练词向量。最后指出传统词嵌入的局限——无法处理一词多义，为后续语言模型与上下文嵌入埋下伏笔。

完成本课后，你将能够：

- 解释 Embedding 层与 one-hot / BoW 的区别与优势。
- 理解 Embedding Bag 模型（Sum / Average / Max）的工作原理。
- 比较 Word2Vec 的 CBoW 与 Skip-gram 架构。
- 知道如何在 PyTorch / TensorFlow 中使用预训练词向量。
- 认识到上下文嵌入（Contextual Embeddings）的必要性。

---

## 核心概念

### 1. 词嵌入：从稀疏到稠密

- **One-hot 编码**：每个词对应词表维度上的唯一位置，向量长度为 `vocab_size`，只有一个位置为 1，其余为 0。不同词的 one-hot 向量彼此正交，无法衡量相似度。
- **Embedding 层**：把词索引映射为低维稠密向量 `embedding_size << vocab_size`。它可视为对 one-hot 向量的线性变换，但实现上直接查表，避免构造大型稀疏向量。
- **语义相似性**：理想情况下，`king - man + woman ≈ queen`，即向量之间的距离（如欧氏距离、余弦相似度）反映词语之间的语义关系。

### 2. Embedding Bag：把序列变成定长向量

在文本分类等任务中，可以把序列中的每个词先查表得到嵌入，再通过聚合函数压缩成固定长度向量：

```text
text  →  [w1, w2, ..., wn]
      →  [embed(w1), embed(w2), ..., embed(wn)]
      →  aggregate(embeddings)  # sum / average / max
      →  classifier
```

常见聚合方式：

- **Sum**：保留词共现强度信息，但对长文本会放大高频词影响。
- **Average**：对序列长度做归一，常用于句子级别表示。
- **Max**：取每个维度最大值，强调最显著特征。

Embedding Bag 相比 BoW 的优势在于：词语不再孤立，模型可以通过反向传播（Backpropagation）学习到有意义的词向量。

### 3. Word2Vec：自监督学习语义嵌入

Word2Vec 通过在大规模语料上预测词与上下文的关系，自动学习词向量。它有两种互补架构：

#### CBoW（Continuous Bag-of-Words，连续词袋模型）

- **目标**：用周围上下文词预测中心词。
- 给定 n-gram `(W_{-2}, W_{-1}, W_0, W_1, W_2)`，模型根据 `(W_{-2}, W_{-1}, W_1, W_2)` 预测 `W_0`。
- **特点**：训练速度快，对高频词表现较好。

#### Skip-gram（连续跳字模型）

- **目标**：用中心词预测周围上下文词。
- 给定 `W_0`，预测窗口内的 `(W_{-2}, W_{-1}, W_1, W_2)`。
- **特点**：训练较慢，但对低频词和稀有词的表示通常更好。

两种方法的核心思想都基于**分布假设（Distributional Hypothesis）**：语义相近的词往往出现在相似的上下文中。

### 4. GloVe：全局统计与局部窗口的结合

- **GloVe（Global Vectors for Word Representation）** 是另一种经典词向量方法。
- 与 Word2Vec 主要依赖局部上下文窗口不同，GloVe 同时利用语料全局的词-词共现统计矩阵，通过最小化以下形式的目标函数学习向量：

```text
J = Σ_{i,j} f(X_{ij}) (w_i^T w̃_j + b_i + b̃_j - log X_{ij})^2
```

其中 `X_{ij}` 表示词 `i` 与词 `j` 在共现矩阵中的计数，`f` 是加权函数。

- 实际使用时，GloVe 与 Word2Vec 一样，都可以作为预训练权重替换神经网络的 Embedding 层。

### 5. 预训练词向量的词汇对齐问题

直接使用 Word2Vec / GloVe 时，你的文本语料词表与预训练词表通常不一致。常见处理策略：

- **交集覆盖**：对同时在训练词表和预训练词表中出现的词，使用预训练向量初始化。
- **随机初始化未命中词**：对训练词表中出现但预训练词表中未出现的词，用随机向量初始化。
- **冻结或微调**：冻结预训练向量可减少过拟合，微调则能更好适应下游任务。

官方 Notebook 中展示了如何在 PyTorch / TensorFlow 中处理这一对齐过程。

### 6. 上下文嵌入：解决一词多义

传统预训练词向量（Word2Vec / GloVe）为每个词生成**唯一**向量，无法区分多义词。例如：

- "I went to a **play** at the theatre."（戏剧）
- "John wants to **play** with his friends."（玩耍）

两个句子中的 `play` 被映射到同一个向量。要解决这个问题，需要基于**语言模型（Language Model）** 学习**上下文嵌入（Contextual Embeddings）**，让同一个词在不同上下文中有不同表示。本课只作引入，后续课程会深入讲解 Transformer / BERT 等模型。

---

## 关键知识点

- Embedding 层本质是一个可学习的查表矩阵，输入词索引，输出稠密向量。
- Embedding Bag 通过 `sum / average / max` 把变长序列转换为定长向量，用于分类等任务。
- Word2Vec 的 CBoW 用上下文预测中心词，Skip-gram 用中心词预测上下文。
- Word2Vec 与 GloVe 都属于**静态词嵌入（Static Embeddings）**，一词一向量。
- 使用预训练词向量时，需要处理训练词表与预训练词表不一致的问题。
- 上下文嵌入能区分多义词，是后续 Transformer / BERT 等大语言模型的核心能力。

---

## 代码/实验说明

官方为本课提供了两个可运行 Notebook，分别用 PyTorch 和 TensorFlow 实现：

- **PyTorch 版本**：[EmbeddingsPyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/14-Embeddings/EmbeddingsPyTorch.ipynb)
- **TensorFlow 版本**：[EmbeddingsTF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/14-Embeddings/EmbeddingsTF.ipynb)

### 实验内容概述

1. **构建 Embedding 层**：
   - 在 PyTorch 中使用 `nn.Embedding(vocab_size, embedding_size)`。
   - 在 TensorFlow/Keras 中使用 `tf.keras.layers.Embedding(vocab_size, embedding_size)`。

2. **Embedding Bag / 聚合分类器**：
   - 将文本中的每个词转为嵌入向量。
   - 对序列嵌入做 `sum` 或 `average` 聚合。
   - 接入全连接分类器进行情感分类或类似任务。

3. **加载预训练词向量**：
   - 下载或加载 Word2Vec / GloVe 预训练权重。
   - 将预训练向量映射到当前词表索引。
   - 处理未命中词（OOV, Out-of-Vocabulary）并设置是否可训练。

### 伪代码示例：PyTorch Embedding Bag

```python
import torch.nn as nn

# vocab_size: 词表大小；embedding_size: 嵌入维度
embedding = nn.Embedding(vocab_size, embedding_size)

# input: 词索引序列，形状 (batch_size, seq_len)
embedded = embedding(input_ids)  # (batch_size, seq_len, embedding_size)

# 聚合：取平均得到句子向量
sentence_vector = embedded.mean(dim=1)  # (batch_size, embedding_size)

# 后续接入分类器
classifier = nn.Linear(embedding_size, num_classes)
output = classifier(sentence_vector)
```

### 运行建议

- 在本地或 Google Colab 打开官方 Notebook。
- 准备好数据集（如 IMDb 影评），观察预训练词向量对分类性能的提升。
- 尝试冻结与微调 Embedding 层，比较两者效果。

---

## 本课不覆盖与延伸

### 本课不覆盖

- **上下文嵌入与语言模型预训练**：如 ELMo、BERT、GPT 等，本课仅作引子。
- **高级词向量训练技巧**：负采样（Negative Sampling）、层次 Softmax、子词建模等细节。
- **大词表与多语言嵌入**：如 FastText、多语言 BERT 等超出本课范围。

### 延伸方向

- 继续学习 L15「语言建模与自定义嵌入训练」，亲手训练端到端词嵌入。
- 阅读 Word2Vec 原始论文：*[Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/pdf/1301.3781.pdf)*。
- 了解 GloVe 论文：*[GloVe: Global Vectors for Word Representation](https://nlp.stanford.edu/pubs/glove.pdf)*。
- 探索本库 [[大模型/LLM_Architectures/LLM_Architectures]]，理解 Transformer 如何生成上下文嵌入。

---

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[大模型/Sequence_Models/Sequence_Models]]
  - [[大模型/LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]]（文本表示与数据工程）
  - [[大模型/LLM_Architectures/LLM_Architectures]]（Transformer 与上下文嵌入）
