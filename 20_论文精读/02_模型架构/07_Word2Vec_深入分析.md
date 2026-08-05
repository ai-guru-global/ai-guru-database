---
tier: supporting
title: "论文深度解读: Word2Vec — Efficient Estimation of Word Representations in Vector Space"
category: paper-deep-dive
tags: ["paper", "word2vec", "nlp", "embedding", "word-representation", "distributional-semantics"]
summary: "Word2Vec (2013) 用浅层神经网络高效学习词向量，发现 king-man+woman≈queen 等语义关系，开创了分布式表示时代，是 GPT/BERT 等所有现代语言模型的共同祖先。"
created: 2026-06-04
updated: 2026-06-04
sources: []
name_zh: "论文深度解读"
---

# 论文深度解读: Word2Vec — Efficient Estimation of Word Representations in Vector Space

> 中文简称：论文深度解读

> **一句话理解**: Word2Vec 用浅层网络从上下文预测词，学到的词向量能做类比运算 (king-man+woman≈queen)，开创了"万物皆可 Embedding"的时代。

---

## 论文信息

| 项目 | 内容 |
|------|------|
| **标题** | Efficient Estimation of Word Representations in Vector Space |
| **作者** | Tomas Mikolov, Kai Chen, Greg Corrado, Jeffrey Dean |
| **机构** | Google |
| **年份** | 2013 (ICLR 2013 Workshop) |
| **论文** | https://arxiv.org/abs/1301.3781 |
| **配套论文** | Distributed Representations of Words and Phrases (2013) |
| **训练数据** | Google News (100B 词) |
| **训练时间** | 单机数小时 |

---

## 1. 为什么 Word2Vec 如此重要？

### 1.1 问题背景: NLP 中的"词"如何表示？

```
2013 年前的词表示方法:
┌──────────────────────────────────────────────────────┐
│  方法              维度         问题                    │
│  ──────────────────────────────────────────────────   │
│  One-Hot           V (10K-100K)  稀疏, 无语义关系       │
│  TF-IDF            V             稀疏, 无语义关系       │
│  LSA/SVD           d (100-500)   降维, 但语义不清晰     │
│  LDA Topic Model   k (50-200)    主题级别, 非词级别     │
│                                                        │
│  共同问题: 无法捕获词与词之间的语义关系                   │
│  "king" 和 "queen" 的 One-Hot 距离 = "king" 和 "cat"   │
└──────────────────────────────────────────────────────┘
```

### 1.2 Word2Vec 的革命性发现

```python
# Word2Vec 学到的词向量可以做线性类比运算!
# 这是人类历史上第一次从数据中自动发现语义关系

# 经典例子:
vec("king")  - vec("man")  + vec("woman") ≈ vec("queen")
vec("Paris")  - vec("France") + vec("Italy") ≈ vec("Rome")
vec("biggest") - vec("big")   + vec("small") ≈ vec("smallest")

# 这意味着: 语义关系 ≈ 向量空间中的线性方向!
```

### 1.3 影响图谱

```
Word2Vec (2013)
    ├── GloVe (2014)         → 全局统计 + 局部窗口
    ├── FastText (2016)      → 子词级别表示
    ├── ELMo (2018)          → 上下文相关词向量
    ├── BERT (2018)          → 双向上下文编码
    ├── GPT (2018)           → 自回归语言模型
    └── Sentence-BERT (2019) → 句子级嵌入
    
    共同祖先: Word2Vec 证明了"分布式表示 + 神经网络 = 语义理解"
```

---

## 2. 两种架构: CBOW vs Skip-gram

### 2.1 核心思想

```
┌─────────────────────────────────────────────────┐
│        分布假说 (Distributional Hypothesis)        │
│                                                   │
│  "You shall know a word by the company it keeps"  │
│   — J.R. Firth (1957)                             │
│                                                   │
│  含义相同的词 → 出现在相似的上下文中                  │
│  → 相似的上下文 → 相似的向量表示                     │
│                                                   │
│  Word2Vec 用神经网络高效地实现这个假说                │
└─────────────────────────────────────────────────┘
```

### 2.2 CBOW (Continuous Bag-of-Words)

```
目标: 从上下文词预测中心词

  "the cat sat on the mat"
  
  上下文: [the, cat, ___ , on, the]  → 预测: "sat"

  输入: 上下文词的嵌入向量 (求平均)
  隐藏层: 投影到 d 维空间 (线性变换)
  输出: 预测中心词的概率分布

        w(t-2) ─┐
        w(t-1) ─┼→ 求和/平均 → 投影 → softmax → P(w(t)|context)
        w(t+1) ─┤
        w(t+2) ─┘
        
  优点: 训练速度快, 对常见词效果好
  缺点: 丢失了词序信息, 对罕见词效果差
```

### 2.3 Skip-gram

```
目标: 从中心词预测上下文词

  "the cat sat on the mat"
  
  中心词: "sat" → 预测: [the, cat, on, the]

  输入: 中心词的嵌入向量
  隐藏层: 投影到 d 维空间
  输出: 对每个位置预测上下文词的概率

                    ┌→ P(w(t-2)|w(t))
                    ├→ P(w(t-1)|w(t))
  w(t) → 投影 → ──┤
                    ├→ P(w(t+1)|w(t))
                    └→ P(w(t+2)|w(t))
                    
  优点: 对罕见词效果更好, 语义关系更精确
  缺点: 训练慢, 数据需求大
  
  论文结论: Skip-gram > CBOW (在大多数任务上)
```

### 2.4 对比

| 特性 | CBOW | Skip-gram |
|------|------|-----------|
| 方向 | 上下文 → 中心词 | 中心词 → 上下文 |
| 速度 | 快 (多输入共享) | 慢 (多输出独立) |
| 常见词 | 好 | 好 |
| 罕见词 | 差 | 好 |
| 语义类比 | 一般 | 优秀 |
| 数据需求 | 中等 | 大 |
| 实际使用 | Word2Vec 默认 | FastText/GloVe 常用 |

---

## 3. 关键技术: 高效训练

### 3.1 Softmax 的计算瓶颈

```python
# 原始目标: P(w_o | w_i) = exp(v_o^T v_i) / Σ_j exp(v_j^T v_i)
# 分母需要遍历整个词汇表 V → O(|V|) 计算量
# |V| = 100K-1M → 训练极慢!
```

### 3.2 技巧 1: 负采样 (Negative Sampling)

```python
import torch
import torch.nn as nn
import numpy as np

class Word2VecSkipGram(nn.Module):
    """
    Word2Vec Skip-gram with Negative Sampling
    
    核心思想: 不计算整个 softmax, 而是
    - 正样本: (中心词, 上下文词) → 标签 1
    - 负样本: (中心词, 随机词 × k) → 标签 0
    - k = 5-20 (小数据集用大 k)
    """
    def __init__(self, vocab_size: int, embed_dim: int):
        super().__init__()
        # 输入嵌入 (中心词)
        self.in_embed = nn.Embedding(vocab_size, embed_dim)
        # 输出嵌入 (上下文词)
        self.out_embed = nn.Embedding(vocab_size, embed_dim)
        
        # 初始化: 均匀分布 [-0.5/d, 0.5/d]
        nn.init.uniform_(self.in_embed.weight, -0.5/embed_dim, 0.5/embed_dim)
        nn.init.zeros_(self.out_embed.weight)
    
    def forward(self, center, context, negative):
        """
        center: [B] 中心词索引
        context: [B] 上下文词索引 (正样本)
        negative: [B, K] 负样本词索引
        """
        # 中心词嵌入
        v_c = self.in_embed(center)        # [B, d]
        # 正样本上下文嵌入
        v_o = self.out_embed(context)      # [B, d]
        # 负样本嵌入
        v_n = self.out_embed(negative)     # [B, K, d]
        
        # 正样本得分: v_c · v_o
        pos_score = torch.sum(v_c * v_o, dim=1)   # [B]
        # 负样本得分: v_c · v_n
        neg_score = torch.bmm(v_n, v_c.unsqueeze(2)).squeeze(2)  # [B, K]
        
        # 损失: 最大化正样本概率, 最小化负样本概率
        # -log σ(pos_score) - Σ log σ(-neg_score)
        loss = -torch.mean(
            torch.log(torch.sigmoid(pos_score)) +
            torch.sum(torch.log(torch.sigmoid(-neg_score)), dim=1)
        )
        return loss

# 负采样分布: P(w) ∝ U(w)^(3/4)
# U(w) = count(w) / total_count
# 3/4 次方: 降低常见词被选为负样本的概率, 提升罕见词比例
```

### 3.3 技巧 2: 层级 Softmax (Hierarchical Softmax)

```
用 Huffman 树将 O(|V|) 计算降为 O(log|V|)

词汇表: {the: 100, cat: 50, sat: 20, mat: 10}
Huffman 编码:
  the (100) → 0
  cat (50)  → 10
  sat (20)  → 110
  mat (10)  → 111

P("mat") = σ(v_110^T h) × σ(v_111^T h)
只需计算 3 个 sigmoid (vs 4 个 softmax)
常见词路径短 → 计算更快
```

### 3.4 技巧 3: 下采样 (Subsampling)

```python
# 高频功能词 (the, a, is) 提供很少的信息
# 训练时随机跳过:
# P(discard(w)) = 1 - sqrt(t / f(w))
# t = 1e-5, f(w) = 词 w 的频率

# 效果:
# - "the" 被跳过 ~90% 的时间 → 训练更快
# - 窗口内有效信息量增加 → 质量更好
```

---

## 4. 语义空间的结构

### 4.1 词向量的线性性质

```python
# Word2Vec 发现的语义关系 ( Mikolov et al. 2013, Table 1)

语法关系:
  vec("biggest") - vec("big") ≈ vec("smallest") - vec("small")
  vec("going")   - vec("go")  ≈ vec("doing")    - vec("do")

语义关系:
  vec("king")  - vec("man")  ≈ vec("queen")  - vec("woman")
  vec("Paris") - vec("France") ≈ vec("Rome") - vec("Italy")

类比准确率 (word2vec, 640d):
  语法类比: ~67% (vs LSA ~33%)
  语义类比: ~60% (vs LSA ~16%)
```

### 4.2 t-SNE 可视化

```
词向量 t-SNE 投影到 2D:

  [king] [queen] [prince] [princess]    ← 皇室簇
  [man] [woman] [boy] [girl]             ← 性别簇
  [Paris] [London] [Berlin] [Rome]       ← 首都簇
  [running] [walking] [swimming]          ← 运动簇
  
  关键发现:
  - 语义相似的词在空间中聚集
  - 不同的语义关系对应不同的方向
  - 词义可以用向量算术组合
```

---

## 5. 完整训练流程

```python
import torch
from torch.utils.data import Dataset, DataLoader
import random
from collections import Counter

class Word2VecDataset(Dataset):
    """Word2Vec 训练数据集"""
    
    def __init__(self, text: list[str], vocab: dict, window: int = 5):
        self.vocab = vocab
        self.window = window
        self.pairs = []  # (center, context) pairs
        self.neg_table = self._build_negative_table(text)
        
        for sent in text:
            tokens = [vocab[w] for w in sent if w in vocab]
            for i, center in enumerate(tokens):
                # 动态窗口大小 [1, window]
                w = random.randint(1, window)
                for j in range(max(0, i-w), min(len(tokens), i+w+1)):
                    if j != i:
                        self.pairs.append((center, tokens[j]))
    
    def _build_negative_table(self, text):
        """构建负采样表: P(w) ∝ count(w)^(3/4)"""
        counts = Counter()
        for sent in text:
            for w in sent:
                if w in self.vocab:
                    counts[self.vocab[w]] += 1
        
        # 3/4 次方调整
        table = []
        total = sum(c**0.75 for c in counts.values())
        for word_id, count in counts.items():
            freq = count**0.75 / total
            table.extend([word_id] * int(freq * 1e8))
        return table
    
    def __len__(self):
        return len(self.pairs)
    
    def __getitem__(self, idx):
        center, context = self.pairs[idx]
        # 采样 5 个负样本
        negatives = [self.neg_table[random.randint(0, len(self.neg_table)-1)]
                     for _ in range(5)]
        return center, context, negatives

# 训练循环
def train_word2vec(model, dataloader, epochs=5, lr=0.025):
    optimizer = torch.optim.SGD(model.parameters(), lr=lr)
    
    for epoch in range(epochs):
        # 线性学习率衰减
        for param_group in optimizer.param_groups:
            param_group['lr'] = lr * (1 - epoch / epochs)
        
        total_loss = 0
        for center, context, negatives in dataloader:
            loss = model(center, context, torch.tensor(negatives))
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        
        print(f"Epoch {epoch+1}: Loss = {total_loss/len(dataloader):.4f}")

# 使用训练好的嵌入
def analogy(model, a, b, c, vocab, ivocab):
    """计算 a - b + c 的最近邻"""
    va = model.in_embed.weight[vocab[a]]
    vb = model.in_embed.weight[vocab[b]]
    vc = model.in_embed.weight[vocab[c]]
    
    target = va - vb + vc
    sims = torch.cosine_similarity(target.unsqueeze(0), 
                                    model.in_embed.weight, dim=1)
    
    # 排除输入词
    for w in [a, b, c]:
        sims[vocab[w]] = -1
    
    top_idx = sims.argmax().item()
    return ivocab[top_idx]  # → "queen"
```

---

## 6. 超参数指南

| 参数 | 推荐值 | 影响 |
|------|--------|------|
| **嵌入维度 d** | 100-300 (小) / 300-1000 (大) | 越大越精确, 但需要更多数据 |
| **窗口大小** | 5 (语义) / 2 (语法) | 大窗口 → 语义相似; 小窗口 → 语法相似 |
| **负样本数 k** | 5-20 | 小数据集用 20, 大数据集用 5 |
| **学习率** | 0.025 (SGD, 线性衰减) | Word2Vec 原始论文的选择 |
| **下采样阈值 t** | 1e-5 到 1e-3 | 越小 → 越激进地下采样高频词 |
| **训练轮数** | 5 (大数据) / 10-20 (小数据) | 数据越大, 轮数越少 |
| **最小词频** | 5 | 过滤掉出现次数太少的词 |

---

## 7. 从 Word2Vec 到现代 NLP

### 7.1 技术演进路线

```
Word2Vec (2013)           →  静态词向量, 上下文无关
    │
    ├── GloVe (2014)      →  全局统计 + 局部窗口
    ├── FastText (2016)   →  子词级别, 处理 OOV
    │
    ├── ELMo (2018)       →  上下文相关词向量 (BiLSTM)
    │   "bank" 在 "river bank" vs "bank account" 有不同向量!
    │
    ├── BERT (2018)       →  双向 Transformer 上下文编码
    ├── GPT (2018-2024)   →  自回归 Transformer 语言模型
    │
    └── Sentence-BERT (2019) → 句子级嵌入 (语义搜索)
         └── OpenAI text-embedding-3 (2024) → 3072d, MRL
```

### 7.2 Word2Vec 的局限性

| 局限 | 说明 | 后续解决 |
|------|------|---------|
| **静态表示** | 每个词只有一个向量, 无法处理多义词 | ELMo/BERT (上下文相关) |
| **无法处理 OOV** | 训练时未见过的词没有向量 | FastText (子词) |
| **无语义组合** | 不能组合词/句的表示 | Doc2Vec → Sentence-BERT |
| **线性关系假设** | 类比运算假设语义关系是线性的 | 非线性模型 (Transformer) |
| **无句法感知** | 不考虑句法结构 | 图神经网络 / 结构化预测 |

---

## 8. 关键要点

1. **分布假说的工程化实现**: 用浅层神经网络从上下文预测词, 简洁高效
2. **Skip-gram > CBOW**: 从中心词预测上下文, 语义关系更精确
3. **负采样是训练效率的关键**: 将 O(|V|) 降为 O(k), k=5-20
4. **词向量的线性结构**: king-man+woman≈queen 证明了语义关系可以被编码为向量方向
5. **"万物皆可 Embedding" 的开端**: Word2Vec 启发了 Doc2Vec, Node2Vec, Graph2Vec 等整个 Embedding 范式

---

## Related

- [[20_论文精读/02_模型架构/02_BERT_深入分析|BERT 深度解读]] — Word2Vec 的"终极进化": 上下文相关编码
- [[20_论文精读/02_模型架构/01_注意力_Is_All_You_Need_深入分析|Transformer 深度解读]] — 从词向量到序列建模
- [[20_论文精读/04_效率优化/Matryoshka_Representation_Learning_Deep_Dive|MRL 深度解读]] — 现代嵌入向量的弹性维度
- [[04_NLP_LLMs/README|NLP 与 LLMs]] — NLP 全景
- [[概念/LLM/llm-architectures|LLM 架构]] — 从词嵌入到大模型

---

*Last updated: 2026-06-04*

- [[20_论文精读/README|22 经典与必读 AI 论文清单 (Essential AI Papers)]]
