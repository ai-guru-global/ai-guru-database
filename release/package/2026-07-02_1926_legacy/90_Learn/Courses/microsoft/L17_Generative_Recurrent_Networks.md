---
title: "L17 - 生成循环网络"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "nlp", "rnn", "generative-models", "text-generation"]
summary: "基于循环神经网络（RNN）学习字符级语言模型，并用温度采样生成连贯文本。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/5-NLP/17-GenerativeNetworks/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L17 Generative Recurrent Networks"
  - L17_Generative_Recurrent_Networks

---
# L17 - 生成循环网络

> **一句话理解**：把 RNN 从"读一句话给标签"改造成"读一段字符预测下一个字符"，就能让它学会写字、续写句子，甚至生成一整段文本。

## 本课概览

本课是 Microsoft AI For Beginners 第五模块（自然语言处理，NLP）的第 5 课，紧接 [[90_Learn/courses/microsoft/L16_Recurrent_Neural_Networks|L16 循环神经网络]]，专注于**生成式序列建模**。前面我们主要用 RNN 做判别任务（如文本分类），本课则把它当成**语言模型（Language Model）**：给定已出现的字符序列，预测下一个字符的概率分布。通过反复自回归采样，RNN 可以逐字生成新文本。

为了降低复杂度，本课采用**字符级分词（character-level tokenization）**：把文本拆成单个字符/字母，而不是单词。这样做词汇表极小、容易训练，且能直观展示 RNN 如何捕捉拼写、标点和短词模式。课程还介绍了**温度采样（temperature sampling）**这一控制生成多样性的关键技巧，并提供了 PyTorch 与 TensorFlow/Keras 双版本可运行 Notebook。

完成本课后，你将理解：
- RNN 的四种序列映射模式（one-to-one / one-to-many / many-to-one / many-to-many）。
- 字符级生成模型的训练目标与自回归推理流程。
- 温度参数如何调节采样随机性，平衡"通顺"与"多样"。
- 生成 RNN 与机器翻译、图像描述等序列到序列（sequence-to-sequence）任务的联系。

## 核心概念

- **语言模型（Language Model）**：对一段文本序列 $x_1, x_2, \dots, x_T$ 给出联合概率 $P(x_1, \dots, x_T)$ 的模型。通常用链式法则分解为条件概率的乘积：

  $$
  P(x_1, \dots, x_T) = \prod_{t=1}^{T} P(x_t \mid x_1, \dots, x_{t-1})
  $$

  RNN 通过隐藏状态 $h_t$ 隐式编码历史 $x_{1:t-1}$，从而估计 $P(x_t \mid h_t)$。

- **字符级分词（Character-level Tokenization）**：把原始文本按单个字符切开，例如 "hello" → `['h','e','l','l','o']`。与词级分词相比，它不会出现未登录词（OOV），但序列更长、对长距离依赖建模要求更高。

- **自回归生成（Autoregressive Generation）**：生成阶段网络把上一步的输出作为下一步的输入，即

  $$
  x_t \sim P(x \mid h_t), \quad h_{t+1} = f(h_t, x_t)
  $$

  重复该过程即可得到任意长度的文本。

- **Teacher Forcing（教师强制）**：训练时把真实目标字符 $y_t$ 作为下一步输入，而不是网络自己生成的字符。这样梯度更稳定，是生成 RNN 的标准训练技巧。

- **温度采样（Temperature Sampling）**：对 RNN 输出的对数几率（logits）$z$ 除以一个温度参数 $\tau > 0$ 后再做 softmax：

  $$
  P(i) = \frac{\exp(z_i / \tau)}{\sum_j \exp(z_j / \tau)}
  $$

  - $\tau \to 0$：分布趋近 one-hot，总是选概率最高的字符，文本最"安全"但容易循环重复。
  - $\tau = 1$：按原始概率采样，多样性适中。
  - $\tau > 1$：分布更平坦，采样更随机，文本更有创意但可能出现语法错乱。

- **RNN 的四种映射模式**：
  - **One-to-one**：普通神经网络，一个输入一个输出（如图像分类）。
  - **One-to-many**：一个输入向量生成整个序列，例如用 CNN 提取图像特征后，RNN 逐词生成**图像描述（image captioning）**。
  - **Many-to-one**：输入序列输出单个向量/标签，例如情感分类。
  - **Many-to-many / Sequence-to-sequence**：输入序列映射为输出序列，常用于**机器翻译**；典型结构是编码器（encoder）把源句子压缩为状态向量，解码器（decoder）再把状态向量展开成目标句子。

## 关键知识点

- RNN、LSTM（长短期记忆网络，Long Short-Term Memory）和 GRU（门控循环单元，Gated Recurrent Unit）都能学习词序，并预测序列中的下一个 token。
- 在生成任务中，每个时间步输出的是**字符表上的概率分布**，而不是确定性字符。
- 训练时采用滑动窗口：取长度为 `nchars` 的输入子串，目标序列是同一子串向后偏移一位的字符。
- 推理（inference）时先让 RNN "预热" prompt，得到隐藏状态；之后进入自回归循环，每生成一个字符就把它送回网络，直到满足停止条件（生成长度或遇到结束符）。
- 总是取概率最大的字符（贪心解码）容易导致局部循环；从概率分布中采样并配合温度参数，能产生更自然、更多样的文本。
- 字符级模型是序列到序列学习的入门版本；更复杂的应用（机器翻译、图像描述）在结构上只是输入编码器不同，解码器思想完全一致。

## 代码/实验说明

官方提供两个可运行 Notebook，分别对应 PyTorch 与 TensorFlow/Keras 实现：

- [Generative Networks with PyTorch](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/17-GenerativeNetworks/GenerativePyTorch.ipynb)
- [Generative Networks with TensorFlow](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/17-GenerativeNetworks/GenerativeTF.ipynb)

二者核心流程一致：准备语料 → 构建字符表 → 截取 `(input, target)` 序列对 → 用 RNN/LSTM/GRU 建模 → 训练 → 用温度采样生成文本。

### 训练阶段伪代码

```python
# chars: 文本中出现的所有唯一字符
char2idx = {c: i for i, c in enumerate(chars)}
idx2char = {i: c for i, c in enumerate(chars)}

for epoch in range(num_epochs):
    for i in range(0, len(text) - nchars - 1, step):
        input_seq  = text[i : i + nchars]       # "the pro"
        target_seq = text[i + 1 : i + nchars + 1] # "he proj"

        x = one_hot([char2idx[c] for c in input_seq])
        y = [char2idx[c] for c in target_seq]

        logits = model(x)          # shape: (nchars, vocab_size)
        loss = cross_entropy(logits, y)
        loss.backward()            # 或 TensorFlow 的 gradient tape
        optimizer.step()
```

### 带温度采样的生成伪代码

```python
def generate(model, prompt, n_chars=200, temperature=1.0):
    # 预热 prompt
    state = None
    for ch in prompt:
        logits, state = model.forward_one(char2idx[ch], state)

    generated = prompt
    for _ in range(n_chars):
        probs = softmax(logits / temperature)
        next_idx = sample(probs)
        next_ch = idx2char[next_idx]
        generated += next_ch

        logits, state = model.forward_one(next_idx, state)

    return generated
```

### 实验作业（Lab）

课程附带 [Lab README](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/17-GenerativeNetworks/lab/README.md)，要求把字符级生成扩展到**词级生成**。词级模型能捕捉更高层的语义和句法，但词汇表更大、对数据量和计算资源要求更高，是现代神经网络语言模型（如 GPT 系列）的基础思想。

## 本课不覆盖与延伸

- **不覆盖**：
  - 大规模词级或子词（subword）语言模型的训练细节，如 BPE、WordPiece 分词。
  - Transformer 架构及其自注意力机制；本课仍基于循环网络。
  - 高级解码策略，如束搜索（Beam Search）、Top-k 采样、Nucleus Sampling（Top-p）。
  - 评估生成文本质量的定量指标，如困惑度（Perplexity）、BLEU、ROUGE。

- **延伸**：
  - 想深入序列建模基础 → [[大模型/Sequence_Models/Sequence_Models]]
  - 想了解 Transformer 与 BERT → 本课程 [[90_Learn/courses/microsoft/L18_Transformers_and_BERT|L18 Transformer 与 BERT]] 或 [[大模型/Transformer_Revolution/Transformer_Revolution]]
  - 想了解现代大语言模型与提示工程 → [[大模型/LLM_Architectures/LLM_Architectures]]、[[大模型/Prompt_Engineering/Prompt_Engineering]]
  - 想动手做机器翻译或图像描述 → 关注 sequence-to-sequence 与注意力机制，参阅 [[大模型/Sequence_Models/Sequence_Models]] 中的编码器-解码器部分

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：[[大模型/Sequence_Models/Sequence_Models]]
