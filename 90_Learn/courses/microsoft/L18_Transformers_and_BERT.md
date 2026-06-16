---
title: "L18 - Transformer 与 BERT"
category: "90-learn"
tags: ["microsoft-ai-course", "transformer", "attention", "bert", "nlp"]
summary: "从注意力机制出发，理解 Transformer 如何取代 RNN 成为现代 NLP 的核心架构，以及 BERT 如何通过双向编码器实现迁移学习。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/5-NLP/18-Transformers/README.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L18 - Transformer 与 BERT

> **一句话理解**：本课讲解注意力机制（Attention Mechanism）如何解决 RNN 编解码器在序列翻译中的记忆瓶颈，并引出可并行训练的 Transformer 架构，以及基于 Transformer 编码器的预训练模型 BERT。

## 本课概览

机器翻译（Machine Translation）是 NLP 中最具代表性的**序列到序列（Sequence-to-Sequence，Seq2Seq）**任务。在 Transformer 出现之前，这类任务通常由 RNN 编解码器完成：编码器（Encoder）将输入序列压缩为单个隐藏状态，解码器（Decoder）再将其展开为目标序列。然而，这种架构存在两个根本问题：

1. **长距离记忆瓶颈**：编码器的最终状态难以保留句子开头的重要信息，导致长句翻译质量下降。
2. **等权输入假设**：RNN 对输入序列中的每个词赋予相同影响，但现实中不同词对输出的贡献并不相等。

注意力机制的引入为每个输出位置提供了访问所有输入隐藏状态的“捷径”，让模型动态地决定关注哪些词。这直接催生了 Transformer——一种完全基于注意力、无需循环计算的架构，从而实现了高度并行化训练，并奠定了 BERT、GPT 等后续模型的基础。

本课在 [Microsoft AI For Beginners](https://microsoft.github.io/AI-For-Beginners/) 的 NLP 模块中承上启下：前半部分（L13–L17）介绍了词袋、词嵌入、语言模型和 RNN，L18 则进入现代深度学习 NLP 的核心；L19–L20 将进一步讨论 NER、大语言模型与提示工程。

## 核心概念

### 1. 注意力机制（Attention Mechanism）

注意力机制为 RNN 编解码器中的每个输出步骤 $y_t$ 引入对所有输入隐藏状态 $h_i$ 的加权求和。权重 $\alpha_{t,i}$ 由模型学习得到，表示生成第 $t$ 个输出词时，第 $i$ 个输入词的重要程度。

形式上，注意力输出可写为：

$$
\text{context}_t = \sum_{i} \alpha_{t,i} h_i
$$

其中 $\alpha_{t,i}$ 通常通过**加性注意力（Additive Attention）**或**点积注意力（Dot-Product Attention）**计算，再经 Softmax 归一化。

这种机制最早在 Bahdanau 等人 2015 年的论文中提出，显著提升了神经机器翻译的质量。注意力的可视化结果会呈现一个**注意力矩阵（Attention Matrix）**，展示输入词与输出词之间的对齐关系。

### 2. 自注意力（Self-Attention）

自注意力是注意力机制的一种特例：查询（Query）、键（Key）、值（Value）都来自同一序列。它让序列中的每个位置都能“看到”其他位置，从而捕捉句内依赖关系，例如代词指代（coreference）和远距离语义关联。

在 Transformer 中，自注意力通过缩放点积注意力实现：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

其中 $d_k$ 是键向量的维度，除以 $\sqrt{d_k}$ 是为了防止点积值过大导致 Softmax 梯度消失。

### 3. 多头注意力（Multi-Head Attention）

单一的注意力层可能只学到一种依赖关系。**多头注意力**将 Query、Key、Value 投影到多个子空间，分别计算注意力，再拼接并线性变换：

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O
$$

每个头可以学习不同类型的关系，例如长程依赖、句法关系或指代关系，从而显著增强模型表达能力。

### 4. 位置编码（Positional Encoding / Embedding）

RNN 通过时间步隐式编码词的位置信息，而 Transformer 没有循环结构，因此必须显式引入位置信息。常见做法有两种：

- **可学习位置嵌入（Trainable Positional Embedding）**：将位置视为可训练的嵌入向量，与词嵌入相加。
- **固定位置编码函数**：如原始 Transformer 论文中使用正弦/余弦函数生成位置向量。

无论哪种方式，最终输入表示都是词嵌入与位置嵌入之和：

$$
X_{\text{input}} = X_{\text{token}} + X_{\text{position}}
$$

### 5. Transformer 架构

Transformer 完全由注意力层和前馈网络构成，主要包含两类注意力：

- **自注意力**：编码器内部用于理解输入序列的上下文关系；解码器内部则使用**掩码自注意力（Masked Self-Attention）**，防止生成时偷看未来词。
- **编码器-解码器注意力（Encoder-Decoder Attention）**：解码器通过它关注编码器输出，完成序列翻译。

由于每个输入位置到每个输出位置的映射可以独立计算，Transformer 比 RNN 更适合 GPU/TPU 并行训练，因此能够扩展到更大的参数量和数据规模。

### 6. BERT：基于 Transformer 的双向编码器

**BERT**（Bidirectional Encoder Representations from Transformers，基于 Transformer 的双向编码器表示）是一个深层 Transformer 编码器网络。

- **BERT-base**：12 层 Transformer 编码器。
- **BERT-large**：24 层 Transformer 编码器。

BERT 的训练分为两个阶段：

1. **预训练（Pre-training）**：在大规模无标注文本（Wikipedia + BooksCorpus）上，通过两个自监督任务学习通用语言表示：
   - **掩码语言模型（Masked Language Model, MLM）**：随机遮蔽输入中的部分词，让模型预测被遮蔽的词。
   - **下一句预测（Next Sentence Prediction, NSP）**：判断两个句子是否具有语义上的承接关系。
2. **微调（Fine-tuning）**：在下游任务（如文本分类、问答、命名实体识别）的小规模标注数据上继续训练，实现**迁移学习（Transfer Learning）**。

BERT 的突破性意义在于：它通过双向上下文编码，显著提升了大量 NLP 基准任务的效果，并开启了“预训练 + 微调”的范式。

## 关键知识点

- RNN 编解码器在长序列翻译中存在信息瓶颈，注意力机制通过动态加权输入状态缓解了这一问题。
- Transformer 用自注意力替代 RNN/CNN，实现了更高的训练并行度，是“Attention Is All You Need”的核心思想。
- 位置编码/嵌入是 Transformer 的必需品，用于补偿模型本身缺乏的顺序先验。
- 多头注意力让模型在不同表示子空间中学习多种依赖关系。
- BERT 只使用 Transformer 的编码器部分，通过 MLM 和 NSP 进行无监督预训练，再在下游任务上微调。
- Hugging Face 提供了 BERT、DistilBERT、RoBERTa 等 Transformer 模型的 PyTorch 与 TensorFlow 实现，方便快速微调。

## 代码/实验说明

官方本课提供两个可运行 Jupyter Notebook，分别用 PyTorch 和 TensorFlow 实现 Transformer 层：

- **[TransformersPyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/18-Transformers/TransformersPyTorch.ipynb)**：使用 PyTorch 实现 Transformer 编码器/解码器结构、多头注意力和位置嵌入。
- **[TransformersTF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/18-Transformers/TransformersTF.ipynb)**：使用 TensorFlow/Keras 实现对应的 Transformer 组件。

建议在本地或 Google Colab 中打开 Notebook，配合本课理论逐步运行以下关键步骤：

1. 准备输入序列并构建词嵌入 + 位置嵌入。
2. 实现缩放点积注意力函数。
3. 将注意力扩展为多头注意力模块。
4. 堆叠编码器/解码器层，构造完整 Transformer。
5. 使用示例数据验证输出形状和注意力权重。

下面是一个简化的多头注意力伪代码，帮助理解其计算流程：

```python
# 输入 X: (batch_size, seq_len, d_model)
def multi_head_attention(X, W_q, W_k, W_v, W_o, num_heads):
    batch_size, seq_len, d_model = X.shape
    d_k = d_model // num_heads
    
    Q = X @ W_q   # (batch, seq, d_model)
    K = X @ W_k
    V = X @ W_v
    
    # 拆分为多个头
    Q = Q.view(batch_size, seq_len, num_heads, d_k).transpose(1, 2)
    K = K.view(batch_size, seq_len, num_heads, d_k).transpose(1, 2)
    V = V.view(batch_size, seq_len, num_heads, d_k).transpose(1, 2)
    
    # 缩放点积注意力
    scores = Q @ K.transpose(-2, -1) / sqrt(d_k)
    weights = softmax(scores, dim=-1)
    context = weights @ V   # (batch, heads, seq, d_k)
    
    # 拼接并线性投影
    context = context.transpose(1, 2).contiguous().view(batch_size, seq_len, d_model)
    return context @ W_o
```

## 本课不覆盖与延伸

- **不覆盖**：
  - Transformer 解码器在自回归生成任务（如机器翻译、文本生成）中的完整训练与推理细节。
  - BERT 微调的具体超参数调优和不同下游任务的头部设计。
  - GPT、T5、Transformer-XL 等后续变体的架构差异。

- **延伸**：
  - 深入阅读原始论文 [Attention Is All You Need](https://arxiv.org/abs/1706.03762)。
  - 学习 Hugging Face `transformers` 库，实践 BERT 微调与特征提取。
  - 在本库 [[04_NLP_LLMs/Transformer_Revolution/Transformer_Revolution]] 中了解 Transformer 对 LLM 发展的影响。
  - 在本库 [[04_NLP_LLMs/LLM_Architectures/LLM_Architectures]] 中对比 Encoder-only、Decoder-only 与 Encoder-Decoder 架构的异同。

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[04_NLP_LLMs/Transformer_Revolution/Transformer_Revolution]]
  - [[04_NLP_LLMs/LLM_Architectures/LLM_Architectures]]
