---
title: "L16 - 循环神经网络RNN"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "rnn", "lstm", "sequence-modeling", "nlp"]
summary: "学习循环神经网络（RNN）如何通过隐藏状态建模序列顺序，并了解 LSTM/GRU、双向与多层 RNN 的基本结构与典型应用。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/5-NLP/16-RNN/README.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L16 - 循环神经网络RNN

> **一句话理解**：RNN 通过在序列上维护一个“记忆状态”，让神经网络能够利用词的先后顺序来理解文本，而不是只看词袋统计。

## 本课概览

前序课程把文本映射为词嵌入（Word Embedding）后，通常用一个简单的聚合（如平均或求和）再送入线性分类器。这种“词袋”思路能捕捉整体语义，但会丢失**词序信息**，因此无法处理文本生成、问答、情感极性随词序变化等任务。本课介绍**循环神经网络**（Recurrent Neural Network，简称 RNN），它逐个符号地处理序列，并把当前步骤学到的信息以“状态”形式传递到下一步。

本课位于 NLP 模块的第四课，承接词嵌入（L14）与语言模型（L15），为后续生成式 RNN（L17）和 Transformer（L18）做铺垫。学完本课后，你应能：
- 解释 RNN 如何利用隐藏状态（Hidden State）建模序列依赖；
- 说明 LSTM 和 GRU 为何能缓解长程依赖问题；
- 了解双向 RNN 与多层 RNN 的结构与用途。

## 核心概念

- **序列顺序（Sequence Order）**：词在句子中出现的先后关系。词袋（Bag-of-Words）或简单聚合会抹掉这一信息，而 RNN 通过逐时间步计算保留它。
- **隐藏状态 / 网络状态（Hidden State / State）**：RNN 每一步输出的内部向量，记作 S<sub>i</sub>。它相当于网络对“已读序列”的压缩记忆，会随新输入不断更新。
- **RNN 单元（RNN Cell）**：RNN 的基本计算单元。接收当前输入 X<sub>i</sub> 与上一时刻状态 S<sub>i-1</sub>，输出新状态 S<sub>i</sub>。简单 RNN 的计算式为：

  S<sub>i</sub> = σ(W × X<sub>i</sub> + H × S<sub>i-1</sub> + b)

  其中 W 是输入到状态的权重矩阵，H 是状态到状态的权重矩阵，b 是偏置，σ 是激活函数（如 tanh）。所有时间步共享同一组参数，因此可以用一个带反馈环的单元来表示整个网络。
- **嵌入层前置（Embedding Input）**：实际实现中，X<sub>i</sub> 往往先经过嵌入层降维。若嵌入维度为 `emb_size`，隐藏状态维度为 `hid_size`，则 W 的形状为 `emb_size × hid_size`，H 的形状为 `hid_size × hid_size`。
- **梯度消失（Vanishing Gradients）**：RNN 端到端反向传播（Backpropagation）时，长序列的梯度在回传早期层时会迅速衰减，导致模型难以学习远距离词之间的关系。
- **门控机制（Gating Mechanism）**：通过可学习的“门”显式控制信息的遗忘、写入与读出，从而缓解梯度消失。常见实现有 LSTM 与 GRU。
- **长短期记忆网络（Long Short-Term Memory，LSTM）**：一种带门控的 RNN。它维护两个状态：单元状态 C（长期记忆）和隐藏状态 H（短期输出）。通过**遗忘门**（forget gate）、**输入门**（input gate）、**输出门**（output gate）控制 C 的更新与读出。
- **门控循环单元（Gated Recurrent Unit，GRU）**：LSTM 的简化变体，把遗忘门和输入门合并为更新门，参数更少，训练更快。
- **双向 RNN（Bidirectional RNN）**：同时从左到右和从右到左跑两个 RNN，把两个方向的隐藏状态拼接起来，利用未来上下文辅助当前决策。
- **多层 RNN（Multi-layer RNN）**：把第一层 RNN 的输出作为第二层 RNN 的输入，逐层提取更高层级的序列模式，类似 CNN 中的特征堆叠。

## 关键知识点

- RNN 的参数在时间步之间共享，因此可以用一个带反馈环的单元图示表示。
- 简单 RNN 对短距离依赖效果尚可，但长距离依赖通常需要 LSTM 或 GRU。
- LSTM 的单元状态可以看作一组可开关的“标志位”，例如记录名词单复数、否定词等语法信息。
- 双向 RNN 适用于可以整句同时获取输入的场景（如文本分类、命名实体识别），但不适合流式实时生成。
- 多层 RNN 能增强表达能力，但也更容易过拟合，通常 2–4 层即可。

## 代码/实验说明

官方提供两个可运行的 Jupyter Notebook，分别用 PyTorch 和 TensorFlow 实现 RNN/LSTM 文本分类：

- **PyTorch 版本**：[RNNPyTorch.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/16-RNN/RNNPyTorch.ipynb)
- **TensorFlow 版本**：[RNNTF.ipynb](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/16-RNN/RNNTF.ipynb)

通常实验流程如下：

1. 加载并预处理文本数据（如情感分析数据集）。
2. 将词/子词映射为嵌入向量。
3. 定义 RNN/LSTM/GRU 层，设置隐藏维度与层数。
4. 取最后一个时间步的隐藏状态（或双向拼接后的状态）送入全连接分类器。
5. 用交叉熵损失训练，观察验证集准确率。

伪代码示例（PyTorch 风格）：

```python
import torch.nn as nn

class RNNClassifier(nn.Module):
    def __init__(self, vocab_size, emb_size, hid_size, num_classes):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, emb_size)
        self.rnn = nn.LSTM(emb_size, hid_size, batch_first=True)
        self.fc = nn.Linear(hid_size, num_classes)

    def forward(self, x):
        embedded = self.embedding(x)          # (batch, seq, emb)
        output, (hidden, cell) = self.rnn(embedded)
        # 取最后时刻的隐藏状态
        logits = self.fc(output[:, -1, :])    # (batch, num_classes)
        return logits
```

TensorFlow/Keras 风格则可用 `tf.keras.layers.LSTM(hid_size)` 直接堆叠到 `Sequential` 或函数式模型中。

## 本课不覆盖与延伸

- **不覆盖**：
  - 生成式 RNN 与序列到序列（Seq2Seq）模型（将在 L17 深入）。
  - 注意力机制（Attention）与 Transformer（L18）。
  - RNN 在语音、时间序列预测等其他模态的应用。
- **延伸**：
  - Christopher Olah 的博客 [Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/) 是理解 LSTM 门控细节的绝佳读物。
  - 想深入长程建模，可继续阅读本库 [[05_NLP_LLMs/Transformer_Revolution/Transformer_Revolution]] 与 [[05_NLP_LLMs/LLM_Architectures/LLM_Architectures]]。

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：[[05_NLP_LLMs/Sequence_Models/Sequence_Models]]
