---
title: "嵌入与表示学习 (Embedding & Representation Learning)"
category: 03-deep-learning-neural-network-core
tags: ["deep-learning", "embedding", "representation-learning", "word2vec", "rope", "positional-encoding", "contrastive-learning", "multimodal"]
summary: "系统解析从 Word2Vec 到 Contextual Embeddings 的演进、BPE/SentencePiece 分词、位置编码(Sinusoidal/RoPE/ALiBi)、对比学习嵌入、多模态对齐，以及 2026 年前沿进展。"
created: 2026-07-19
updated: 2026-07-19
tier: core
aliases:
  - "Embedding Representation Learning"
  - "Embedding Theory"
  - Embedding_Representation
sources: []

---
# 嵌入与表示学习 (Embedding & Representation Learning)

> 从离散符号到连续向量，系统解析表示学习的理论基础、位置编码设计与多模态嵌入对齐。

---

## 1. 概述 (Overview)

嵌入 (Embedding) 是将离散或高维数据映射到低维连续向量空间的技术，是现代深度学习的基石。从 2013 年 Word2Vec 开创词嵌入时代，到 2026 年统一多模态嵌入空间，表示学习贯穿了 AI 的每一次重大突破。

### 为什么需要嵌入？

```
原始表示的问题:
  文本: "猫" → One-hot [0,0,0,...,1,...,0,0] (维度=词表大小, 稀疏, 无语义)
  图像: 像素值 [0-255]^H×W×3 (高维, 冗余, 无结构)
  音频: 波形采样 (时序信号, 无高级语义)

嵌入表示:
  文本: "猫" → [0.23, -0.45, 0.78, ..., 0.12] (维度=768, 稠密, 有语义)
  图像: → [0.11, 0.67, -0.33, ..., 0.89] (维度=1024, 语义特征)
  
  关键性质: 语义相近 → 向量距离近
    cos("猫", "狗") ≈ 0.85
    cos("猫", "汽车") ≈ 0.12
```

### 表示学习的演进

```
2013: Word2Vec — 静态词嵌入
2014: GloVe — 全局统计 + 局部窗口
2017: FastText — 子词嵌入
2018: ELMo — 上下文相关嵌入 (双向 LSTM)
2018: BERT — Transformer 上下文嵌入
2019: Sentence-BERT — 句子级嵌入
2020: SimCLR/MoCo — 视觉对比学习嵌入
2021: CLIP — 多模态嵌入对齐
2022: RoPE 广泛采用 — 旋转位置编码
2023: E5/BGE — 通用文本嵌入模型
2024: 多模态统一嵌入 (GPT-4o, Gemini)
2025: 嵌入压缩, 动态维度
2026: 自适应嵌入, 嵌入即服务
```

---

## 2. 核心原理 (Core Principles)

### 2.1 分布式假设 (Distributional Hypothesis)

```
"出现在相似上下文中的词具有相似含义" — Zellig Harris, 1954

这是所有词嵌入方法的理论基础:
  "猫 坐在 沙发 上" 
  "狗 坐在 沙发 上"
  → "猫" 和 "狗" 出现在相似上下文中 → 语义相近
```

### 2.2 Word2Vec

**论文**: Mikolov et al., "Efficient Estimation of Word Representations in Vector Space", 2013

#### CBOW (Continuous Bag of Words)

```
目标: 从上下文预测中心词

  输入: [w_{t-2}, w_{t-1}, w_{t+1}, w_{t+2}] 的嵌入均值
  输出: 预测 w_t 的概率

  P(w_t | context) = softmax(W' · mean(v_{w_{t-2}}, ..., v_{w_{t+2}}))
```

#### Skip-gram

```
目标: 从中心词预测上下文

  输入: w_t 的嵌入
  输出: 预测 [w_{t-2}, w_{t-1}, w_{t+1}, w_{t+2}] 的概率

  P(w_o | w_t) = exp(v'_{w_o} · v_{w_t}) / Σ_w exp(v'_w · v_{w_t})
```

#### Negative Sampling (训练加速)

```
完整 Softmax 计算量: O(|V|) 每步 (|V| = 词表大小, 通常 100K+)

Negative Sampling: 
  正样本: (w_t, w_o) 来自真实上下文
  负样本: (w_t, w_n) 随机采样 k 个 (通常 k=5-20)
  
  损失: L = -log σ(v'_{w_o} · v_{w_t}) - Σ_{n=1}^{k} log σ(-v'_{w_n} · v_{w_t})
  
  计算量: O(k) 每步 → 大幅加速
```

```python
class Word2VecSkipGram(nn.Module):
    """Word2Vec Skip-gram with Negative Sampling"""
    
    def __init__(self, vocab_size, embed_dim=300):
        super().__init__()
        self.center_embed = nn.Embedding(vocab_size, embed_dim)
        self.context_embed = nn.Embedding(vocab_size, embed_dim)
        
        # 初始化
        nn.init.uniform_(self.center_embed.weight, -0.5/embed_dim, 0.5/embed_dim)
        nn.init.zeros_(self.context_embed.weight)
    
    def forward(self, center_words, pos_context, neg_context):
        """
        center_words: (B,) 中心词索引
        pos_context: (B,) 正样本上下文
        neg_context: (B, K) 负样本
        """
        center = self.center_embed(center_words)      # (B, D)
        positive = self.context_embed(pos_context)    # (B, D)
        negative = self.context_embed(neg_context)    # (B, K, D)
        
        # 正样本得分
        pos_score = torch.bmm(positive.unsqueeze(1), 
                              center.unsqueeze(2)).squeeze()  # (B,)
        pos_loss = F.logsigmoid(pos_score)
        
        # 负样本得分
        neg_score = torch.bmm(negative, 
                              center.unsqueeze(2)).squeeze(2)  # (B, K)
        neg_loss = F.logsigmoid(-neg_score).sum(dim=1)  # (B,)
        
        loss = -(pos_loss + neg_loss).mean()
        return loss
```

### 2.3 GloVe (Global Vectors)

**论文**: Pennington, Socher & Manning, "GloVe: Global Vectors for Word Representation", EMNLP 2014

**核心思想**: 结合全局共现统计与局部窗口方法

```
目标: 学习词嵌入使得
  w_i^T · w̃_j + b_i + b̃_j = log(X_{ij})
  
其中:
  X_{ij} = 词 i 和词 j 的共现次数
  w_i: 词 i 的嵌入
  w̃_j: 词 j 的上下文嵌入
  b_i, b̃_j: 偏置

加权损失:
  J = Σ_{i,j} f(X_{ij}) · (w_i^T · w̃_j + b_i + b̃_j - log X_{ij})²
  
  f(x) = (x/x_max)^α  if x < x_max  (α=0.75)
       = 1              otherwise
```

### 2.4 从静态到上下文嵌入

```
静态嵌入 (Word2Vec/GloVe):
  "bank" → 固定向量 (无法区分 "river bank" vs "bank account")
  
上下文嵌入 (ELMo/BERT):
  "I went to the bank to deposit money" → "bank" = v_1
  "The river bank was covered in flowers" → "bank" = v_2
  v_1 ≠ v_2 (根据上下文动态生成)
```

**ELMo (2018)**: 双向 LSTM 的隐状态加权
```
ELMo(token) = γ · Σ_l s_l · h_l(token)
  h_l: 第 l 层 LSTM 隐状态
  s_l: 可学习的层权重
  γ: 可学习的缩放因子
```

**BERT (2018)**: Transformer 编码器输出
```
BERT(token) = TransformerEncoder(tokens)[position]
  通常取最后一层或倒数几层的加权
  [CLS] token 作为句子表示
```

---

## 3. 技术详解 (Technical Deep Dive)

### 3.1 分词: BPE 与 SentencePiece

#### Byte Pair Encoding (BPE)

**论文**: Sennrich, Haddow & Birch, 2016

```
BPE 算法:
1. 初始化: 将语料拆分为字符 (或字节)
2. 统计: 计算所有相邻 token 对的出现频率
3. 合并: 将最频繁的 pair 合并为新 token
4. 重复: 直到达到目标词表大小

示例:
  语料: "low lower lowest"
  初始: ['l','o','w',' ','l','o','w','e','r',' ','l','o','w','e','s','t']
  
  迭代 1: 最频繁 pair = ('l','o') → 合并为 'lo'
  迭代 2: 最频繁 pair = ('lo','w') → 合并为 'low'
  迭代 3: 最频繁 pair = ('e','r') → 合并为 'er'
  ...
  
  最终词表: ['l','o','w','e','r','s','t','lo','low','er','low'er',...]
```

```python
class BPE:
    """Byte Pair Encoding 实现"""
    
    def __init__(self, vocab_size=32000):
        self.vocab_size = vocab_size
        self.merges = {}  # (pair) → merged_token
        self.vocab = {}
    
    def train(self, corpus):
        # 初始化为字符级
        words = {}
        for word in corpus:
            chars = tuple(word) + ('</w>',)
            words[chars] = words.get(chars, 0) + 1
        
        while len(self.vocab) < self.vocab_size:
            # 统计 pair 频率
            pairs = {}
            for word, freq in words.items():
                for i in range(len(word) - 1):
                    pair = (word[i], word[i+1])
                    pairs[pair] = pairs.get(pair, 0) + freq
            
            # 找最频繁的 pair
            best_pair = max(pairs, key=pairs.get)
            self.merges[best_pair] = best_pair[0] + best_pair[1]
            
            # 应用合并
            new_words = {}
            for word, freq in words.items():
                new_word = self._merge_pair(word, best_pair)
                new_words[new_word] = freq
            words = new_words
    
    def encode(self, text):
        """将文本编码为 BPE token 序列"""
        tokens = list(text)
        while True:
            # 找当前序列中最早出现的可合并 pair
            pairs = [(tokens[i], tokens[i+1]) for i in range(len(tokens)-1)]
            mergeable = [p for p in pairs if p in self.merges]
            if not mergeable:
                break
            # 按训练顺序合并
            pair = min(mergeable, key=lambda p: list(self.merges.keys()).index(p))
            idx = pairs.index(pair)
            tokens = tokens[:idx] + [self.merges[pair]] + tokens[idx+2:]
        return tokens
```

#### SentencePiece

```
SentencePiece (Google, 2018):
  - 将文本视为原始字符流 (不依赖空格分词)
  - 支持 BPE 和 Unigram 两种算法
  - 对中日韩等无空格语言更友好
  
  特点:
  - 前缀 ▁ 表示词边界 (替代空格)
  - "Hello world" → ["▁Hello", "▁world"]
  - "你好世界" → ["▁你", "好", "▁世界"]

Unigram Language Model:
  - 从大词表开始，逐步删除 token
  - 保留使语料似然下降最少的 token
  - 最终得到最优子词集合
```

### 3.2 位置编码 (Positional Encoding)

Transformer 本身是排列不变的 (permutation invariant)，需要位置编码注入序列顺序信息。

#### Sinusoidal Positional Encoding (原始 Transformer)

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))

其中:
  pos: 位置 (0, 1, 2, ...)
  i: 维度索引 (0, 1, ..., d_model/2 - 1)
  
性质:
  - PE(pos+k) 可以表示为 PE(pos) 的线性函数 → 可学习相对位置
  - 每个维度是不同频率的正弦波
  - 理论上可外推到训练未见过的长度
```

```python
class SinusoidalPE(nn.Module):
    """正弦位置编码"""
    
    def __init__(self, d_model, max_len=5000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len).unsqueeze(1).float()
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * 
            -(math.log(10000.0) / d_model)
        )
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe.unsqueeze(0))  # (1, max_len, d_model)
    
    def forward(self, x):
        # x: (B, L, D)
        return x + self.pe[:, :x.size(1)]
```

#### RoPE (Rotary Position Embedding)

**论文**: Su et al., "RoFormer: Enhanced Transformer with Rotary Position Embedding", 2021

**核心思想**: 通过旋转矩阵编码相对位置

```
对 query 和 key 向量的每对相邻维度 (x_{2i}, x_{2i+1}) 施加旋转:

[q_{2i}  ]   [cos(mθ_i)  -sin(mθ_i)] [q_{2i}  ]
[q_{2i+1}] = [sin(mθ_i)   cos(mθ_i)] [q_{2i+1}]

其中 m 是位置, θ_i = 10000^(-2i/d)

关键性质:
  q_m^T · k_n 只依赖于 (m-n) → 天然编码相对位置!
  
  证明:
  R(m)^T · R(n) = R(n-m)  (旋转矩阵的性质)
  所以 (R(m)q)^T · (R(n)k) = q^T · R(n-m) · k
```

```python
class RotaryPositionEmbedding(nn.Module):
    """RoPE: 旋转位置编码"""
    
    def __init__(self, dim, max_seq_len=8192, base=10000):
        super().__init__()
        # 计算频率
        inv_freq = 1.0 / (base ** (torch.arange(0, dim, 2).float() / dim))
        self.register_buffer('inv_freq', inv_freq)
        
        # 预计算 sin/cos
        t = torch.arange(max_seq_len).float()
        freqs = torch.einsum('i,j->ij', t, inv_freq)  # (L, D/2)
        self.register_buffer('cos_cache', freqs.cos())  # (L, D/2)
        self.register_buffer('sin_cache', freqs.sin())  # (L, D/2)
    
    def forward(self, q, k, positions=None):
        """
        q, k: (B, n_heads, L, head_dim)
        """
        seq_len = q.shape[2]
        cos = self.cos_cache[:seq_len].unsqueeze(0).unsqueeze(0)  # (1,1,L,D/2)
        sin = self.sin_cache[:seq_len].unsqueeze(0).unsqueeze(0)
        
        q_rot = self._apply_rotary(q, cos, sin)
        k_rot = self._apply_rotary(k, cos, sin)
        return q_rot, k_rot
    
    def _apply_rotary(self, x, cos, sin):
        """将旋转应用到向量"""
        # 将 x 分为两半
        x1 = x[..., :x.shape[-1]//2]
        x2 = x[..., x.shape[-1]//2:]
        # 旋转
        out1 = x1 * cos - x2 * sin
        out2 = x2 * cos + x1 * sin
        return torch.cat([out1, out2], dim=-1)
```

**RoPE 的优势**:
- 天然相对位置: 注意力分数自动包含相对距离信息
- 长度外推: 配合 NTK-aware scaling 可扩展到更长序列
- 无额外参数: 不需要学习位置嵌入
- 被 LLaMA, Mistral, Qwen, Gemma 等广泛采用

#### ALiBi (Attention with Linear Biases)

**论文**: Press, Smith & Lewis, "Train Short, Test Long", ICLR 2022

```
核心思想: 不修改 Q/K，直接在注意力分数上加线性偏置

Attention(q_i, k_j) = softmax(q_i^T · k_j - m · |i - j|)

其中 m 是每个注意力头的固定斜率:
  m_h = 1 / 2^(8h/H)  (H 为总头数, h 为当前头索引)
  
  头 1: m = 1/256 (几乎无距离惩罚 → 长距离)
  头 H: m = 1/2 (强距离惩罚 → 短距离)

优势:
  - 零参数: 无需学习
  - 极强外推: 训练 1K 可推理 16K+
  - 计算高效: 只需加一个 bias 矩阵
```

```python
class ALiBi(nn.Module):
    """ALiBi: 线性偏置注意力"""
    
    def __init__(self, num_heads):
        super().__init__()
        # 计算每个头的斜率
        slopes = self._get_slopes(num_heads)
        self.register_buffer('slopes', slopes)  # (num_heads,)
    
    def _get_slopes(self, n):
        """几何级数斜率"""
        ratio = 2 ** (-8.0 / n)
        return torch.tensor([ratio ** (i + 1) for i in range(n)])
    
    def get_bias(self, seq_len, device):
        """生成 ALiBi 偏置矩阵"""
        # 位置差矩阵
        positions = torch.arange(seq_len, device=device)
        bias = -torch.abs(positions.unsqueeze(0) - positions.unsqueeze(1))
        # (1, 1, L, L) * (H, 1, 1)
        bias = bias.unsqueeze(0) * self.slopes.view(-1, 1, 1, 1)
        return bias  # (H, 1, L, L)
    
    def forward(self, attn_scores):
        """在注意力分数上加入 ALiBi 偏置"""
        H, _, L, _ = attn_scores.shape
        bias = self.get_bias(L, attn_scores.device)
        return attn_scores + bias
```

### 3.3 对比学习嵌入 (Contrastive Learning)

**核心思想**: 拉近正样本对，推远负样本对

#### InfoNCE Loss

```
L = -log( exp(sim(z_i, z_j)/τ) / Σ_k exp(sim(z_i, z_k)/τ) )

其中:
  z_i, z_j: 正样本对的嵌入
  z_k: 所有负样本的嵌入
  τ: 温度参数 (通常 0.05-0.1)
  sim: 余弦相似度
```

```python
class ContrastiveEmbedding(nn.Module):
    """对比学习嵌入训练框架"""
    
    def __init__(self, encoder, embed_dim=256, temperature=0.07):
        super().__init__()
        self.encoder = encoder
        self.projector = nn.Sequential(
            nn.Linear(encoder.output_dim, embed_dim),
            nn.ReLU(),
            nn.Linear(embed_dim, embed_dim),
        )
        self.temperature = temperature
    
    def forward(self, x1, x2):
        """x1, x2: 同一数据的两个增强视图"""
        # 编码
        h1 = self.encoder(x1)
        h2 = self.encoder(x2)
        # 投影到嵌入空间
        z1 = F.normalize(self.projector(h1), dim=-1)
        z2 = F.normalize(self.projector(h2), dim=-1)
        
        # InfoNCE Loss
        logits = torch.mm(z1, z2.T) / self.temperature  # (B, B)
        labels = torch.arange(z1.size(0), device=z1.device)
        loss = (F.cross_entropy(logits, labels) + 
                F.cross_entropy(logits.T, labels)) / 2
        return loss
```

#### CLIP: 多模态对比学习

```
CLIP (OpenAI, 2021):
  图像编码器: ViT 或 ResNet → 图像嵌入 z_img
  文本编码器: Transformer → 文本嵌入 z_txt
  
  训练: 4亿 (图像, 文本) 对
    正样本: 匹配的图文对
    负样本: 不匹配的图文对
    
  损失: 对称 InfoNCE
    L = (CE(z_img · z_txt^T / τ, labels) + 
         CE(z_txt · z_img^T / τ, labels)) / 2
```

### 3.4 多模态嵌入对齐

```
┌─────────────────────────────────────────────────────┐
│              统一嵌入空间                             │
│                                                     │
│    文本 "一只猫" ──→ [0.2, 0.5, -0.3, ...]         │
│                              ↕ 对齐                  │
│    图像 🐱 ──────→ [0.19, 0.48, -0.28, ...]        │
│                              ↕ 对齐                  │
│    音频 "喵" ────→ [0.21, 0.52, -0.31, ...]        │
│                                                     │
│  目标: 相同语义的不同模态 → 相近向量                  │
└─────────────────────────────────────────────────────┘
```

**对齐方法**:
1. **对比学习** (CLIP): 图文对匹配
2. **投影对齐** (ImageBind): 所有模态投影到共享空间
3. **交叉注意力** (Flamingo): 模态间注意力交互
4. **统一 Tokenizer** (GPT-4o): 所有模态统一为 token 序列

---

## 4. 实验与基准 (Experiments & Benchmarks)

### 4.1 词嵌入质量评估

| 方法 | 维度 | 类比任务 (Acc) | 相似度 (Spearman) | 训练数据 |
|------|------|--------------|-----------------|---------|
| Word2Vec SG | 300 | 73.0% | 0.66 | Google News 100B |
| Word2Vec CBOW | 300 | 65.2% | 0.63 | Google News 100B |
| GloVe | 300 | 75.9% | 0.69 | Common Crawl 840B |
| FastText | 300 | 72.1% | 0.67 | Wikipedia |
| ELMo | 1024 | 68.7% | 0.72 | 1B Word Benchmark |
| BERT [CLS] | 768 | 60.2% | 0.55 | BooksCorpus+Wiki |
| BERT avg | 768 | 70.5% | 0.71 | BooksCorpus+Wiki |

### 4.2 句子嵌入基准 (MTEB)

| 模型 | 维度 | MTEB Avg | Retrieval | STS | 分类 |
|------|------|---------|-----------|-----|------|
| Sentence-BERT | 768 | 58.3 | 42.1 | 78.5 | 72.3 |
| E5-large-v2 | 1024 | 64.6 | 55.2 | 83.1 | 78.9 |
| BGE-large-en | 1024 | 64.2 | 54.8 | 83.4 | 79.1 |
| GTE-large | 1024 | 65.4 | 56.1 | 83.8 | 79.5 |
| text-embedding-3 | 3072 | 66.8 | 58.3 | 84.2 | 80.1 |
| Jina-v3 | 1024 | 67.2 | 59.1 | 84.5 | 80.8 |

### 4.3 位置编码对比

在语言模型上的长度外推能力:

| 位置编码 | 训练长度 | 2K PPL | 4K PPL | 8K PPL | 16K PPL | 32K PPL |
|---------|---------|--------|--------|--------|---------|---------|
| Sinusoidal | 2K | 12.3 | 45.2 | OOM | OOM | OOM |
| Learned | 2K | 12.1 | 89.3 | 崩溃 | 崩溃 | 崩溃 |
| RoPE | 2K | 12.2 | 18.5 | 35.2 | 78.1 | 崩溃 |
| RoPE + NTK | 2K | 12.4 | 14.2 | 16.8 | 22.3 | 38.5 |
| ALiBi | 2K | 12.5 | 13.8 | 15.2 | 18.1 | 24.3 |
| YaRN | 2K | 12.3 | 13.1 | 14.5 | 16.2 | 19.8 |

### 4.4 多模态嵌入评估

| 模型 | 图文检索 (R@1) | 零样本分类 | 视觉问答 | 嵌入维度 |
|------|--------------|-----------|---------|---------|
| CLIP ViT-B/32 | 52.4% | 63.3% | - | 512 |
| CLIP ViT-L/14 | 65.1% | 75.5% | - | 768 |
| OpenCLIP ViT-G | 72.3% | 80.1% | - | 1024 |
| SigLIP-L | 70.8% | 79.2% | - | 768 |
| EVA-CLIP-E | 74.5% | 82.0% | - | 1024 |
| ImageBind | 63.2% | 71.8% | 52.3 | 1024 |

---

## 5. 代码实现要点 (Implementation)

### 5.1 完整 Token Embedding 层

```python
class TokenEmbedding(nn.Module):
    """现代 LLM 的 Token Embedding (含 RoPE)"""
    
    def __init__(self, vocab_size, d_model, max_seq_len=8192):
        super().__init__()
        self.d_model = d_model
        # Token 嵌入
        self.token_embed = nn.Embedding(vocab_size, d_model)
        # RoPE
        self.rope = RotaryPositionEmbedding(d_model, max_seq_len)
        # 缩放因子 (LLaMA 风格)
        self.scale = math.sqrt(d_model)
    
    def forward(self, input_ids):
        """
        input_ids: (B, L) token 索引
        返回: (B, L, D) 嵌入向量
        """
        x = self.token_embed(input_ids) * self.scale
        return x


class LLaMAEmbedding(nn.Module):
    """LLaMA 完整嵌入层"""
    
    def __init__(self, vocab_size=32000, d_model=4096):
        super().__init__()
        self.embed_tokens = nn.Embedding(vocab_size, d_model)
        # LLaMA 不使用位置嵌入在 token 上
        # RoPE 在 attention 中应用
    
    def forward(self, input_ids):
        return self.embed_tokens(input_ids)
```

### 5.2 嵌入相似度计算

```python
class EmbeddingSimilarity:
    """嵌入相似度计算工具"""
    
    @staticmethod
    def cosine_similarity(a, b):
        """余弦相似度"""
        a_norm = F.normalize(a, p=2, dim=-1)
        b_norm = F.normalize(b, p=2, dim=-1)
        return torch.mm(a_norm, b_norm.T)
    
    @staticmethod
    def dot_product(a, b):
        """点积 (适合已归一化的向量)"""
        return torch.mm(a, b.T)
    
    @staticmethod
    def euclidean_distance(a, b):
        """欧氏距离"""
        return torch.cdist(a, b, p=2)
    
    @staticmethod
    def mrr_at_k(query_embeds, corpus_embeds, k=10):
        """Mean Reciprocal Rank @ K"""
        scores = torch.mm(query_embeds, corpus_embeds.T)
        _, indices = scores.topk(k, dim=-1)
        # 假设 ground truth 是对角线
        mrr = 0.0
        for i in range(query_embeds.size(0)):
            rank = (indices[i] == i).nonzero()
            if len(rank) > 0:
                mrr += 1.0 / (rank[0].item() + 1)
        return mrr / query_embeds.size(0)
```

### 5.3 嵌入量化与压缩

```python
class EmbeddingQuantizer:
    """嵌入向量量化: 减少存储和检索成本"""
    
    def __init__(self, dim, num_bits=8):
        self.dim = dim
        self.num_bits = num_bits
        self.num_codes = 2 ** num_bits
    
    def scalar_quantize(self, embeddings):
        """标量量化: 每个维度独立量化"""
        # 归一化到 [0, 1]
        min_val = embeddings.min(dim=-1, keepdim=True).values
        max_val = embeddings.max(dim=-1, keepdim=True).values
        normalized = (embeddings - min_val) / (max_val - min_val + 1e-8)
        # 量化
        quantized = torch.round(normalized * (self.num_codes - 1)).byte()
        return quantized, min_val, max_val
    
    def product_quantize(self, embeddings, num_subspaces=8):
        """乘积量化: 将向量分段，每段独立聚类"""
        sub_dim = self.dim // num_subspaces
        codes = []
        codebooks = []
        
        for i in range(num_subspaces):
            sub_vectors = embeddings[:, i*sub_dim:(i+1)*sub_dim]
            # K-means 聚类 (简化)
            centroids = self._kmeans(sub_vectors, self.num_codes)
            # 编码: 最近质心
            dists = torch.cdist(sub_vectors, centroids)
            code = dists.argmin(dim=-1)
            codes.append(code)
            codebooks.append(centroids)
        
        return torch.stack(codes, dim=-1), codebooks
```

---

## 6. 对比表 (Comparison Tables)

### 6.1 位置编码全面对比

| 特性 | Sinusoidal | Learned | RoPE | ALiBi | YaRN |
|------|-----------|---------|------|-------|------|
| 类型 | 绝对 | 绝对 | 相对(隐式) | 相对(偏置) | 相对(缩放) |
| 可学习 | 否 | 是 | 否 | 否 | 部分 |
| 长度外推 | 差 | 极差 | 中 | 好 | 很好 |
| 计算开销 | 低 | 无 | 中 | 低 | 中 |
| 参数增加 | 0 | L×D | 0 | 0 | 少量 |
| 代表模型 | 原始Transformer | BERT/GPT-2 | LLaMA/Mistral | BLOOM/MPT | LLaMA-3 |
| 2026 主流 | 少用 | 少用 | 最广泛 | 较少 | 增长中 |

### 6.2 嵌入方法选择指南

```
文本嵌入选择:
├── 词级别表示?
│   ├── 需要上下文? → BERT/RoBERTa 隐状态
│   └── 静态即可? → Word2Vec/GloVe (轻量)
├── 句子/段落级别?
│   ├── 语义搜索? → E5/BGE/GTE (MTEB 优化)
│   ├── 聚类? → Sentence-BERT
│   └── 跨语言? → mE5/multilingual-e5
├── 多模态?
│   ├── 图文匹配? → CLIP/SigLIP
│   ├── 全模态? → ImageBind
│   └── 生成式? → GPT-4o/Gemini 内部嵌入
└── 特殊需求?
    ├── 超长文本? → 分块 + 池化
    ├── 低延迟? → 量化嵌入 / 小模型
    └── 隐私? → 本地嵌入模型
```

### 6.3 分词方法对比

| 方法 | 词表大小 | 多语言 | 未登录词 | 代表模型 |
|------|---------|--------|---------|---------|
| Word-level | 50K-200K | 差 | 有 | 早期模型 |
| Char-level | ~256 | 好 | 无 | CharCNN |
| BPE | 32K-100K | 中 | 无(字节回退) | GPT/LLaMA |
| WordPiece | 30K-50K | 中 | 无 | BERT |
| Unigram | 32K | 好 | 无 | T5/ALBERT |
| SentencePiece | 32K-64K | 很好 | 无 | LLaMA/T5 |
| Byte-level BPE | 50K | 极好 | 无 | GPT-2/3/4 |

---

## 7. 2026 前沿进展 (Frontier 2026)

### 7.1 自适应维度嵌入

2026 年研究: 不同 token 使用不同维度的嵌入

```python
class AdaptiveDimEmbedding(nn.Module):
    """根据 token 重要性动态分配嵌入维度"""
    
    def __init__(self, vocab_size, max_dim=4096, min_dim=256):
        super().__init__()
        self.max_dim = max_dim
        self.min_dim = min_dim
        # 完整嵌入
        self.full_embed = nn.Embedding(vocab_size, max_dim)
        # 维度预测器
        self.dim_predictor = nn.Embedding(vocab_size, 1)
    
    def forward(self, input_ids):
        full = self.full_embed(input_ids)  # (B, L, max_dim)
        # 预测每个 token 需要的维度
        dim_ratio = torch.sigmoid(self.dim_predictor(input_ids))  # (B, L, 1)
        active_dim = (self.min_dim + dim_ratio * (self.max_dim - self.min_dim)).int()
        # 截断到预测维度 (训练时用 mask)
        mask = torch.arange(self.max_dim, device=full.device) < active_dim
        return full * mask.float()
```

### 7.2 嵌入即服务 (Embedding-as-a-Service)

```
2026 年嵌入基础设施趋势:
- 嵌入 API: OpenAI text-embedding-3, Cohere embed-v4
- 向量数据库: Pinecone, Weaviate, Qdrant, Milvus
- 嵌入缓存: 避免重复计算
- 嵌入版本管理: 模型更新时的迁移策略
- 实时嵌入: 流式数据的增量嵌入更新
```

### 7.3 位置编码的新方向

```
2025-2026 位置编码研究:
1. NoPE (No Position Encoding): 
   - 某些任务中完全不需要位置编码
   - 因果 mask 本身提供了部分位置信息
   
2. 学习频率的 RoPE:
   - 不再使用固定 base=10000
   - 让模型学习最优频率分布
   
3. 2D/3D RoPE:
   - 图像: 分别对 H, W 维度应用 RoPE
   - 视频: 对 T, H, W 三维度应用
   - 用于多模态模型
   
4. 长序列专用:
   - YaRN: NTK-aware + 注意力温度缩放
   - LongRoPE: 搜索最优缩放因子
   - 目标: 训练 4K → 推理 2M+
```

### 7.4 统一多模态嵌入

```
2026 多模态嵌入趋势:

1. 统一 Tokenizer:
   - 文本: BPE tokens
   - 图像: VQ-VAE/VQGAN tokens 或 patch tokens
   - 音频: EnCodec tokens
   - 视频: 时空 patch tokens
   → 所有模态在同一个嵌入空间中

2. 任意模态到任意模态:
   - 不再是简单的对比对齐
   - 生成式模型内部共享嵌入空间
   - 支持跨模态推理

3. 嵌入空间的结构:
   - 发现: 大模型嵌入空间有几何结构
   - 线性探针: 语义方向可线性分离
   - 流形假设: 数据在低维流形上
```

### 7.5 嵌入可解释性

```
2026 嵌入可解释性研究:
- 方向解释: 嵌入空间中的特定方向对应特定语义
  例: gender 方向, sentiment 方向, formality 方向
  
- 算术操作:
  king - man + woman ≈ queen (经典)
  2026: 更复杂的语义算术
  
- 嵌入编辑:
  修改特定方向 → 控制生成内容
  应用: 去偏见, 风格控制, 知识编辑
```

---

## 8. 工程实践 (Engineering Practices)

### 8.1 嵌入层性能优化

```python
# 大词表嵌入的优化策略

# 1. 混合精度: 嵌入表用 FP16 存储
embed = nn.Embedding(vocab_size, d_model).half()

# 2. 分片: 超大词表跨 GPU 分片
# (使用 VocabParallelEmbedding from Megatron-LM)

# 3. 梯度检查点: 减少嵌入层内存
from torch.utils.checkpoint import checkpoint
embedded = checkpoint(embed_layer, input_ids)

# 4. 量化嵌入表 (推理时)
# INT8 量化: 内存减少 4x, 精度损失 < 0.1%
```

### 8.2 嵌入检索优化

```python
# 大规模嵌入检索 (10亿+向量)

# 1. 近似最近邻 (ANN)
import faiss
index = faiss.IndexIVFPQ(
    quantizer, dim, nlist=4096, m=64, nbits=8
)
index.train(embeddings)
index.add(embeddings)
distances, indices = index.search(query, k=10)

# 2. 分层导航小世界图 (HNSW)
# 查询复杂度: O(log N)
# 召回率: > 95% @ k=10

# 3. 嵌入降维
# PCA: 4096 → 512 (保持 95%+ 检索质量)
# Matryoshka: 训练时支持任意前缀维度
```

---

## 9. 相关概念 (Related Concepts)

- [[Attention_Mechanisms_Deep_Dive]] — 位置编码与注意力的交互
- [[Neural_Network_Core]] — 神经网络核心架构
- [[Convolutional_Architectures_Evolution]] — CNN 特征作为视觉嵌入
- [[Normalization_Techniques_Deep_Dive]] — 嵌入后的归一化处理
- [[Mixture_of_Experts_Theory]] — MoE 中的嵌入路由
- [[03_深度学习/06_Self_Supervised_Learning/index|自监督学习]] — 对比学习嵌入
- [[03_深度学习/Transfer_Learning/index|迁移学习]] — 预训练嵌入的迁移
- [[03_深度学习/04_Generative_Models/index|生成模型]] — 潜在空间嵌入

---

## 10. 参考文献 (References)

1. Mikolov, T. et al. (2013). "Efficient Estimation of Word Representations in Vector Space." arXiv:1301.3781.
2. Pennington, J., Socher, R. & Manning, C. (2014). "GloVe: Global Vectors for Word Representation." EMNLP.
3. Sennrich, R., Haddow, B. & Birch, A. (2016). "Neural Machine Translation of Rare Words with Subword Units." ACL.
4. Peters, M. et al. (2018). "Deep Contextualized Word Representations." NAACL (ELMo).
5. Devlin, J. et al. (2019). "BERT: Pre-training of Deep Bidirectional Transformers." NAACL.
6. Su, J. et al. (2021). "RoFormer: Enhanced Transformer with Rotary Position Embedding." arXiv:2104.09864.
7. Press, O., Smith, N. & Lewis, M. (2022). "Train Short, Test Long: Attention with Linear Biases." ICLR (ALiBi).
8. Radford, A. et al. (2021). "Learning Transferable Visual Models From Natural Language Supervision." ICML (CLIP).
9. Chen, T. et al. (2020). "A Simple Framework for Contrastive Learning of Visual Representations." ICML (SimCLR).
10. Kudo, T. & Richardson, J. (2018). "SentencePiece: A Simple and Language Independent Subword Tokenizer." EMNLP.
