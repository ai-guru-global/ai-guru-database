---
title: "Self-Attention 机制详解"
category: 04-nlp-llms-transformer
tags: ["transformer", "self-attention", "multi-head-attention", "mechanism"]
summary: "> **一句话理解**: Self-Attention 让序列中的每个位置都能'看到'其他所有位置——通过 Query-Key-Value 机制计算注意力权重，实现全局信息融合。"
created: 2026-06-12
updated: 2026-06-12
---

# Self-Attention 机制详解

> **一句话理解**: Self-Attention 让序列中的每个位置都能"看到"其他所有位置——通过 Query-Key-Value 机制计算注意力权重，实现全局信息融合。

---

## TL;DR

- **核心公式**: Attention(Q,K,V) = softmax(QK^T / √d_k) V
- **Query/Key/Value**: 每个 token 生成三个向量，Q 用于查询，K 用于匹配，V 用于输出
- **Multi-Head**: 并行运行多个注意力头，捕获不同维度的关系
- **复杂度**: O(n²d)，长序列是主要瓶颈 → FlashAttention 优化
- **变体**: Causal (GPT) / Bidirectional (BERT) / Cross-Attention / Grouped-Query

## 核心计算

```python
import torch
import torch.nn.functional as F

def self_attention(x, W_q, W_k, W_v):
    """
    x: (batch, seq_len, d_model)
    W_q, W_k, W_v: (d_model, d_head)
    """
    Q = x @ W_q    # (batch, seq_len, d_head)
    K = x @ W_k    # (batch, seq_len, d_head)
    V = x @ W_v    # (batch, seq_len, d_head)
    
    d_k = Q.shape[-1]
    
    # 注意力分数
    scores = Q @ K.transpose(-2, -1) / (d_k ** 0.5)  # (batch, seq_len, seq_len)
    
    # Causal mask（GPT 风格）
    mask = torch.triu(torch.ones_like(scores), diagonal=1).bool()
    scores.masked_fill_(mask, float('-inf'))
    
    # Softmax → 注意力权重
    attn_weights = F.softmax(scores, dim=-1)  # (batch, seq_len, seq_len)
    
    # 加权求和
    output = attn_weights @ V  # (batch, seq_len, d_head)
    return output
```

## Multi-Head Attention

```python
class MultiHeadAttention(torch.nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        
        self.W_q = torch.nn.Linear(d_model, d_model)
        self.W_k = torch.nn.Linear(d_model, d_model)
        self.W_v = torch.nn.Linear(d_model, d_model)
        self.W_o = torch.nn.Linear(d_model, d_model)
    
    def forward(self, x):
        B, T, C = x.shape
        
        Q = self.W_q(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        K = self.W_k(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        V = self.W_v(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        
        # Scaled Dot-Product Attention
        out = F.scaled_dot_product_attention(Q, K, V, is_causal=True)
        
        out = out.transpose(1, 2).contiguous().view(B, T, C)
        return self.W_o(out)
```

## 相关阅读

- [[04_NLP_LLMs/Transformer_Revolution/Transformer_Revolution]] — Transformer 革命
- [[04_NLP_LLMs/Transformer_Revolution/Transformer_Revolution_for_dummy]] — Transformer 入门
- [[22_Papers/Attention_Is_All_You_Need_Deep_Dive]] — Attention Is All You Need 深度解读
- [[04_NLP_LLMs/LLM_Architectures/LLM_Architectures]] — LLM 架构 2026
