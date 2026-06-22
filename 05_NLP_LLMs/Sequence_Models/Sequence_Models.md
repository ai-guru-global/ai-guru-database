---
title: '序列模型 (Sequence Models)'
category: '05-nlp-llms-sequence-models'
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: '> **一句话理解**: 序列模型就像人类阅读文字——逐字逐句地读，并且记住前文来理解后文。RNN/LSTM/GRU 就是让计算机拥有这种"边读边记"能力的技术，是 Transformer 出现之前 NLP 的绝对主力。'
created: '2026-05-31'
updated: '2026-05-31'
---

# 序列模型 (Sequence Models)

> **一句话理解**: 序列模型就像人类阅读文字——逐字逐句地读，并且记住前文来理解后文。RNN/LSTM/GRU 就是让计算机拥有这种"边读边记"能力的技术，是 Transformer 出现之前 NLP 的绝对主力。

## 1. 概述 (Overview)

序列模型 (Sequence Models) 是专门处理有序数据的神经网络架构，其核心思想是：**当前输出不仅取决于当前输入，还取决于之前的历史信息**。这类模型在自然语言处理、语音识别、时间序列预测等领域有广泛应用。

### 为什么需要序列模型？

传统前馈神经网络（MLP）将每个输入视为独立样本，无法捕捉序列中的时序依赖关系。例如：
- "我喜欢苹果"——这里的"苹果"是水果还是手机？需要上下文判断
- 股票价格预测——今天的价格与过去几天的趋势强相关
- 语音识别——当前音素的含义受前后音素影响

### 序列模型的发展脉络

```
简单 RNN (1986) → LSTM (1997) → GRU (2014) → Seq2Seq+Attention (2015) → Transformer (2017)
   ↑                ↑               ↑                ↑                        ↑
  梯度消失严重    解决长程依赖    简化LSTM结构    引入注意力机制         完全替代循环结构
```

虽然 Transformer 已成为主流，但理解 RNN/LSTM 仍然重要：
1. 它们是理解 Transformer 动机的必要背景
2. 在资源受限设备和流式处理场景中仍有应用
3. 许多经典 NLP 概念（如序列标注、Seq2Seq）源自这些模型

---

## 2. 核心概念 (Core Concepts)

### 2.1 循环神经网络 (Recurrent Neural Network, RNN)

#### 基本结构

RNN 在每个时间步接收当前输入 $x_t$ 和上一步的隐藏状态 $h_{t-1}$，计算新的隐藏状态：

$$h_t = \tanh(W_{xh} x_t + W_{hh} h_{t-1} + b_h)$$
$$y_t = W_{hy} h_t + b_y$$

其中：
- $h_t$：时间步 $t$ 的隐藏状态（"记忆"）
- $W_{xh}$：输入到隐藏层的权重矩阵
- $W_{hh}$：隐藏层到隐藏层的权重矩阵（循环连接的关键）
- $W_{hy}$：隐藏层到输出的权重矩阵

#### RNN 展开图示

```
     y₁        y₂        y₃        y₄
     ↑         ↑         ↑         ↑
   [RNN] → [RNN] → [RNN] → [RNN]
     ↑         ↑         ↑         ↑
     x₁        x₂        x₃        x₄
                                    
  "我"      "喜欢"      "自然"     "语言"
  
  说明: 同一个 RNN 单元在每个时间步共享权重，
  箭头 → 表示隐藏状态 h 的传递
```

#### RNN 的致命缺陷：梯度消失/爆炸

通过时间的反向传播 (Backpropagation Through Time, BPTT) 时，梯度需要经过多次矩阵乘法：

$$\frac{\partial L}{\partial h_1} = \frac{\partial L}{\partial h_T} \cdot \prod_{t=2}^{T} \frac{\partial h_t}{\partial h_{t-1}}$$

- 当 $\|W_{hh}\| < 1$ 时，连乘导致梯度趋近于 0 → **梯度消失**（无法学习长程依赖）
- 当 $\|W_{hh}\| > 1$ 时，连乘导致梯度趋近于 $\infty$ → **梯度爆炸**（训练不稳定）

**直觉类比**: 想象你在玩"传话游戏"——经过 20 个人传递后，信息几乎完全失真。RNN 中的信息传递也面临同样的问题。

### 2.2 长短期记忆网络 (Long Short-Term Memory, LSTM)

LSTM 由 Hochreiter & Schmidhuber 于 1997 年提出，专门解决 RNN 的梯度消失问题。其核心创新是引入**门控机制 (Gating Mechanism)** 和独立的**细胞状态 (Cell State)**。

#### 三个门的作用

```
LSTM 单元结构 (简化图):

         c_{t-1} ──────[×]──────────[+]────── c_t
                        ↑            ↑
                    遗忘门 f_t    输入门 i_t × tanh(候选值)
                        ↑            ↑
                   ┌────┴────────────┴─────┐
                   │                        │
  h_{t-1} ────────┤      LSTM Cell          ├──── h_t
                   │                        │
  x_t ────────────┤     输出门 o_t          │
                   └────────────────────────┘
```

#### 数学公式

**遗忘门 (Forget Gate)** — 决定丢弃多少旧信息：
$$f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)$$

**输入门 (Input Gate)** — 决定写入多少新信息：
$$i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)$$
$$\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)$$

**细胞状态更新** — 结合遗忘和输入：
$$C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$$

**输出门 (Output Gate)** — 决定输出什么：
$$o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)$$
$$h_t = o_t \odot \tanh(C_t)$$

其中 $\sigma$ 是 Sigmoid 函数（输出 0~1），$\odot$ 是逐元素乘法。

#### 为什么 LSTM 能解决梯度消失？

关键在于细胞状态 $C_t$ 的更新方式：$C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$

这是一个**加法操作**而非乘法，梯度可以沿着细胞状态"高速公路"几乎无损地传播。当遗忘门 $f_t \approx 1$ 时，$C_t \approx C_{t-1}$，信息可以跨越很长的时间步。

**直觉类比**: 如果 RNN 是"传话游戏"，LSTM 就是给每个人一个笔记本——重要信息直接写在本子上传递，不依赖口头传话。

### 2.3 门控循环单元 (Gated Recurrent Unit, GRU)

GRU 由 Cho et al. (2014) 提出，是 LSTM 的简化版本，合并了遗忘门和输入门为一个**更新门 (Update Gate)**，并取消了独立的细胞状态。

#### 数学公式

**重置门 (Reset Gate)** — 决定忽略多少历史信息：
$$r_t = \sigma(W_r \cdot [h_{t-1}, x_t])$$

**更新门 (Update Gate)** — 决定保留多少旧状态 vs 接受多少新状态：
$$z_t = \sigma(W_z \cdot [h_{t-1}, x_t])$$

**候选隐藏状态**:
$$\tilde{h}_t = \tanh(W \cdot [r_t \odot h_{t-1}, x_t])$$

**最终隐藏状态**:
$$h_t = (1 - z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t$$

### 2.4 LSTM vs GRU 对比

| 维度 | LSTM | GRU |
|------|------|-----|
| **门数量** | 3 个（遗忘/输入/输出） | 2 个（重置/更新） |
| **参数量** | 更多（~4x 隐藏层大小²） | 更少（~3x 隐藏层大小²） |
| **训练速度** | 较慢 | 较快（参数少 ~25%） |
| **长序列表现** | 更强（独立的细胞状态） | 略弱 |
| **适用场景** | 序列长、信息复杂 | 数据量小、需要快速训练 |
| **实践建议** | 默认首选 | 资源受限时使用 |

---

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 双向 LSTM (Bidirectional LSTM)

单向 LSTM 只能利用过去的上下文，但很多任务（如命名实体识别）需要同时考虑前后文。

```
前向: h₁→ → h₂→ → h₃→ → h₄→
       ↑      ↑      ↑      ↑
      x₁     x₂     x₃     x₄
       ↓      ↓      ↓      ↓
后向: h₁← ← h₂← ← h₃← ← h₄←

输出: [h→; h←] 拼接前向和后向的隐藏状态
```

### 3.2 Seq2Seq (Sequence-to-Sequence) 架构

用于输入序列和输出序列长度不等的任务（如机器翻译、文本摘要）。

```
编码器 (Encoder):
  "I love AI" → [LSTM] → [LSTM] → [LSTM] → context vector c

解码器 (Decoder):
  context vector c → [LSTM] → "我" → [LSTM] → "爱" → [LSTM] → "AI"
```

**局限性**: Encoder 将整个输入序列压缩为一个固定长度的向量 $c$，这成为信息瓶颈，长句子效果差。

### 3.3 注意力机制的引入 (Attention Mechanism)

Bahdanau et al. (2015) 提出注意力机制，允许 Decoder 在每一步"回看"Encoder 的所有隐藏状态：

$$\alpha_{t,i} = \frac{\exp(e_{t,i})}{\sum_j \exp(e_{t,j})}$$
$$c_t = \sum_i \alpha_{t,i} h_i^{enc}$$

其中 $e_{t,i} = a(s_{t-1}, h_i^{enc})$ 是对齐函数。

**直觉**: Decoder 在翻译每个词时，会自动"聚焦"到源句子中最相关的部分。

这一机制后来发展为 Transformer 中的 Self-Attention——从"Encoder-Decoder 之间关注"扩展为"序列内部互相关注"。

→ 详见 [Transformer 革命](../Transformer_Revolution/Transformer_Revolution.md)

### 3.4 序列标注 (Sequence Labeling)

很多 NLP 任务可以建模为给序列中每个元素打标签：

| 任务 | 输入 | 输出标签 |
|------|------|---------|
| 词性标注 (POS Tagging) | "The cat sat" | DET NOUN VERB |
| 命名实体识别 (NER) | "Apple is in California" | B-ORG O O B-LOC |
| 中文分词 | "自然语言处理" | B E B E B E |

常用架构：BiLSTM + CRF（条件随机场），CRF 层确保标签序列的全局一致性。

---

## 4. 代码实战 (Hands-on Code)

### 4.1 PyTorch LSTM 文本分类

```python
import torch
import torch.nn as nn

class LSTMClassifier(nn.Module):
    """LSTM 文本分类模型"""
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_classes,
                 num_layers=2, bidirectional=True, dropout=0.3):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            input_size=embed_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,          # 输入形状: (batch, seq_len, embed_dim)
            bidirectional=bidirectional,
            dropout=dropout if num_layers > 1 else 0
        )
        direction_factor = 2 if bidirectional else 1
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim * direction_factor, num_classes)
    
    def forward(self, x):
        # x: (batch_size, seq_len) — 词索引序列
        embedded = self.embedding(x)           # (batch, seq_len, embed_dim)
        output, (h_n, c_n) = self.lstm(embedded)  # output: (batch, seq_len, hidden*2)
        
        # 取最后一个时间步的输出（双向时拼接前向最后+后向最后）
        # h_n: (num_layers*directions, batch, hidden)
        if self.lstm.bidirectional:
            hidden = torch.cat([h_n[-2], h_n[-1]], dim=1)  # (batch, hidden*2)
        else:
            hidden = h_n[-1]  # (batch, hidden)
        
        hidden = self.dropout(hidden)
        logits = self.fc(hidden)               # (batch, num_classes)
        return logits

# 使用示例
model = LSTMClassifier(
    vocab_size=10000,
    embed_dim=128,
    hidden_dim=256,
    num_classes=4,         # 如: 新闻分类 (体育/科技/财经/娱乐)
    num_layers=2,
    bidirectional=True
)
# 模拟输入: batch_size=32, 序列长度=50
x = torch.randint(0, 10000, (32, 50))
output = model(x)  # (32, 4)
print(f"输出形状: {output.shape}")  # torch.Size([32, 4])
```

### 4.2 Seq2Seq 简化实现

```python
class Seq2SeqEncoder(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
    
    def forward(self, x):
        embedded = self.embedding(x)
        outputs, (hidden, cell) = self.lstm(embedded)
        return outputs, hidden, cell

class Seq2SeqDecoder(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, vocab_size)
    
    def forward(self, x, hidden, cell):
        # x: (batch, 1) — 一次解码一个 token
        embedded = self.embedding(x)
        output, (hidden, cell) = self.lstm(embedded, (hidden, cell))
        prediction = self.fc(output.squeeze(1))  # (batch, vocab_size)
        return prediction, hidden, cell
```

---

## 5. 应用场景与案例 (Applications & Cases)

| 应用场景 | 模型选择 | 说明 |
|---------|---------|------|
| **机器翻译** | Seq2Seq + Attention → Transformer | 历史上最成功的 LSTM 应用之一 |
| **语音识别** | BiLSTM + CTC | 将音频帧序列转换为文字 |
| **情感分析** | BiLSTM + 注意力 | 识别文本中的情感倾向 |
| **命名实体识别** | BiLSTM + CRF | 序列标注任务的经典方案 |
| **时间序列预测** | LSTM / GRU | 股票预测、天气预报、设备故障预测 |
| **音乐生成** | LSTM | 学习音符序列模式生成新旋律 |

### RNN/LSTM 与 Transformer 的对比

| 维度 | RNN/LSTM | Transformer |
|------|----------|------------|
| **并行性** | 差（必须顺序计算） | 好（全部位置并行） |
| **长程依赖** | 中等（LSTM 改善了但仍有限） | 强（Self-Attention 直接连接任意位置） |
| **计算复杂度** | $O(n)$ 时间步 | $O(n^2)$ 注意力矩阵 |
| **训练速度** | 慢（无法并行） | 快（GPU 并行友好） |
| **短序列性能** | 有竞争力 | 可能过重 |
| **内存效率** | 高（只需存当前状态） | 低（需存完整注意力矩阵） |
| **流式推理** | 天然支持 | 需要额外设计 |

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 LSTM 变体

- **Peephole LSTM**: 让门控可以"窥视"细胞状态 $C_{t-1}$，提升精度
- **Coupled Forget-Input Gate**: 强制 $i_t = 1 - f_t$，减少参数
- **xLSTM (2024)**: Sepp Hochreiter 团队提出的现代 LSTM 变体，引入指数门控和矩阵记忆，在某些任务上与 Transformer 竞争

### 6.2 训练技巧

1. **梯度裁剪 (Gradient Clipping)**: `torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)`
2. **Teacher Forcing**: 训练 Seq2Seq 时，以一定概率使用真实标签而非模型预测作为下一步输入
3. **打包变长序列**: 使用 `pack_padded_sequence` 和 `pad_packed_sequence` 高效处理不等长序列
4. **权重初始化**: 遗忘门偏置初始化为较大值（如 1.0），鼓励初始时保留信息

### 6.3 从 LSTM 到 Transformer 的历史转变

2017 年 "Attention Is All You Need" 论文证明：纯注意力机制不需要循环结构就能处理序列任务，而且由于可以并行计算，训练速度大幅提升。这标志着 NLP 从 RNN 时代进入 Transformer 时代。

但 RNN 的回归趋势：
- **Mamba (2023)**: 选择性状态空间模型 (S4)，线性复杂度替代二次注意力
- **RWKV**: 结合 RNN 和 Transformer 优势的混合架构
- **xLSTM (2024)**: LSTM 的现代复兴

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- [神经网络核心](../../03_Deep_Learning/Neural_Network_Core/Neural_Network_Core.md) — 理解前馈网络和反向传播
- [训练优化](../../03_Deep_Learning/Optimization/Optimization.md) — 梯度裁剪、学习率调度
- [线性代数](../../01_Fundamentals/Linear_Algebra/Linear_Algebra.md) — 矩阵运算基础

### 进阶方向
- [Transformer 革命](../Transformer_Revolution/Transformer_Revolution.md) — 序列模型的下一代（从 Attention 机制演进而来）
- [大语言模型架构](../LLM_Architectures/LLM_Architectures.md) — 现代 LLM 如何完全基于 Transformer
- [强化学习基础](../../06_Reinforcement_Learning/RL_Foundations/RL_Foundations.md) — 序列决策问题

---

## 8. 面试高频问题 (Interview FAQs)

**Q1: RNN 为什么会梯度消失？LSTM 是怎么解决的？**
> RNN 在 BPTT 中，梯度需要连乘 $W_{hh}$ 矩阵 $T$ 次，当 $\|W_{hh}\| < 1$ 时梯度指数衰减。LSTM 通过引入细胞状态 $C_t$ 和加法更新机制（$C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$），梯度可以沿细胞状态"直通"传播，避免连乘导致的消失。

**Q2: LSTM 和 GRU 的主要区别？如何选择？**
> LSTM 有 3 个门 + 独立细胞状态，参数量更多但长序列表现更强。GRU 有 2 个门、无独立细胞状态，参数少 25%、训练更快。经验法则：数据充足选 LSTM，资源受限选 GRU。实际效果差异通常不大，建议两者都尝试。

**Q3: Seq2Seq 中的注意力机制是什么？为什么重要？**
> 注意力机制允许 Decoder 在每个时间步对 Encoder 所有隐藏状态加权求和，而非只依赖最后一个向量。权重通过对齐函数计算。这解决了固定长度编码的信息瓶颈问题，使模型能处理长句子。

**Q4: 为什么 Transformer 能替代 LSTM？**
> 主要原因：(1) 并行性——LSTM 必须顺序处理，Transformer 的 Self-Attention 可以并行计算所有位置；(2) 长程依赖——Self-Attention 直接连接任意两个位置，不受距离影响；(3) 可扩展性——Transformer 更容易扩展到大规模数据和参数。

**Q5: 在什么场景下 LSTM 仍然比 Transformer 更合适？**
> (1) 实时流式推理（LSTM 天然支持逐步推理，Transformer 需要完整序列）；(2) 设备端部署（LSTM 参数量更小，适合边缘设备）；(3) 极短序列（Transformer 的 $O(n^2)$ 注意力在短序列上开销反而大于 LSTM）；(4) 时间序列预测（某些场景下 LSTM 仍有竞争力）。

---

## 9. 参考资源 (References)

### 经典论文
- [Learning Long-Term Dependencies with Gradient Descent is Difficult (Bengio et al., 1994)](https://ieeexplore.ieee.org/document/279181) — RNN 梯度消失问题的理论分析
- [Long Short-Term Memory (Hochreiter & Schmidhuber, 1997)](https://www.bioinf.jku.at/publications/older/2604.pdf) — LSTM 原始论文
- [Learning Phrase Representations using RNN Encoder-Decoder (Cho et al., 2014)](https://arxiv.org/abs/1406.1078) — GRU 原始论文
- [Neural Machine Translation by Jointly Learning to Align and Translate (Bahdanau et al., 2015)](https://arxiv.org/abs/1409.0473) — 注意力机制开创论文
- [xLSTM: Extended Long Short-Term Memory (Beck et al., 2024)](https://arxiv.org/abs/2405.04517) — LSTM 的现代复兴

### 教程与课程
- [Understanding LSTM Networks - Christopher Olah](https://colah.github.io/posts/2015-08-Understanding-LSTMs/) — 最经典的 LSTM 可视化讲解
- [CS224n: Natural Language Processing with Deep Learning (Stanford)](https://web.stanford.edu/class/cs224n/) — 斯坦福 NLP 课程
- [PyTorch LSTM Documentation](https://pytorch.org/docs/stable/generated/torch.nn.LSTM.html) — 官方 API 文档

### 开源实现
- [PyTorch Seq2Seq Tutorial](https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html) — 官方 Seq2Seq 教程
- [fairseq (Meta)](https://github.com/facebookresearch/fairseq) — 包含多种序列模型实现

---
*Last updated: 2026-02-10*

## Related

- [[05_NLP_LLMs/Fine_tuning_Techniques/Axolotl_Deep_Dive.md|Axolotl_Deep_Dive]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques.md|Fine_tuning_Techniques]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md|Fine_tuning_Techniques_for_dummy]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Model_Merging_2026.md|Model_Merging_2026]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/PEFT_2026/PEFT_2026.md|PEFT_2026]]
