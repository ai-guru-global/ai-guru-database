---
title: "Self-Attention 机制详解"
category: 05-nlp-llms-transformer-revolution
tags: ["transformer", "self-attention", "multi-head-attention", "mechanism"]
summary: "> **一句话理解**: Self-Attention 让序列中的每个位置都能'看到'其他所有位置——通过 Query-Key-Value 机制计算注意力权重，实现全局信息融合。"
created: 2026-06-12
updated: 2026-06-12
tier: supporting
aliases:
  - "Self Attention Mechanism"
  - Self_Attention_Mechanism
sources: []

name_zh: "Self-Attention 机制详解"
---
# Self-Attention 机制详解

> 中文简称：Self-Attention 机制详解

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

## 注意力机制变体（2026）

| 变体 | 复杂度 | 代表 | 特点 |
|------|------|------|------|
| **标准 MHA** | O(n²) | Transformer | 全注意力 |
| **GQA** | O(n²) 但 KV 压缩 | Llama 3, Qwen3 | 分组查询注意力 |
| **MQA** | O(n²) 但 KV 最小 | Falcon | 多查询注意力 |
| **MLA** | O(n²) 但 KV 压缩 | DeepSeek-V3 | 多头潜在注意力 |
| **Flash Attention** | O(n²) 但 IO 优化 | 所有现代模型 | 硬件感知实现 |
| **Linear Attention** | O(n) | RWKV, RetNet | 线性复杂度 |
| **Sliding Window** | O(n·w) | Mistral | 局部注意力 |
| **Ring Attention** | O(n²) 分布式 | 长上下文 | 跨设备注意力 |

## 注意力机制的直觉理解

```
注意力 = “每个 token 看其他 token 的重要程度”

Q (Query):  “我在找什么？”
K (Key):    “我有什么？”
V (Value):  “我的内容是什么？”

Attention(Q,K,V) = softmax(QK^T / √d) · V

类比：图书馆借书
- Q = 你的搜索词
- K = 每本书的标签
- V = 书的内容
- 注意力分数 = 搜索词与标签的匹配度
- 输出 = 按匹配度加权的书内容摘要
```

## 2026 注意力优化技术

| 技术 | 说明 | 效果 |
|------|------|------|
| **Flash Attention 3** | Hopper GPU 优化 | 2-4x 加速 |
| **PagedAttention** | KV Cache 分页管理 | 显存效率提升 |
| **KV Cache 量化** | FP8/INT8 KV | 显存减半 |
| **前缀缓存** | 共享前缀 KV | 推理加速 |
| **稀疏注意力** | 只计算重要 token | 长上下文加速 |

## 生产最佳实践

1. **使用 Flash Attention**：所有现代模型都应启用
2. **GQA 优先**：新模型设计优先选择 GQA
3. **KV Cache 管理**：使用 vLLM PagedAttention
4. **长上下文**：使用 Ring Attention 或 Sliding Window
5. **量化部署**：KV Cache 量化降低显存占用

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 显存 OOM | KV Cache 过大 | GQA + KV 量化 |
| 长文本慢 | O(n²) 复杂度 | Flash Attention + 稀疏注意力 |
| 注意力分散 | 序列太长 | 使用局部注意力 + 全局 token |
| 训练不稳定 | 学习率过高 | warmup + 梯度裁剪 |

## 版本兼容性

| 组件 | 版本 | 特性 | 备注 |
|------|------|------|------|
| PyTorch | 2.3+ | SDPA 原生支持 | 推荐 |
| Flash Attention | 2.5+ | IO 感知优化 | 必装 |
| vLLM | 0.5+ | PagedAttention | 推理优化 |
| xFormers | 0.0.26+ | 内存高效注意力 | 备选 |
| DeepSpeed | 0.14+ | 分布式训练 | 大模型 |

## 生产检查清单

1. ✅ 启用 Flash Attention 加速
2. ✅ 使用 GQA/MQA 优化 KV Cache
3. ✅ 实现 KV Cache 量化（FP8/INT8）
4. ✅ 配置 PagedAttention（vLLM）
5. ✅ 对长上下文使用 Ring Attention
6. ✅ 监控注意力分布
7. ✅ 实现梯度裁剪
8. ✅ 建立性能基准

## 相关阅读

- [[05_大模型/04_Transformer_Revolution/Transformer_Revolution]] — Transformer 革命
- [[05_大模型/04_Transformer_Revolution/Transformer_Revolution_for_dummy]] — Transformer 入门
- [[20_论文精读/02_Architecture/Attention_Is_All_You_Need_Deep_Dive]] — Attention Is All You Need 深度解读
- [[05_大模型/05_LLM_Architectures/LLM_Architectures]] — LLM 架构 2026
- [[概念/transformer-architecture]] — Transformer 架构
- [[概念/kv-cache]] — KV Cache
- [[05_大模型/03_Transformer/transformer-llm-architecture|Transformer × LLM 架构]]

## 总结

自注意力机制是 Transformer 的灵魂，也是所有现代 LLM 的核心组件。从标准 MHA 到 GQA、MLA、Flash Attention，注意力机制的每一次优化都直接推动了 LLM 能力的边界。2026 年，注意力机制继续演进：Flash Attention 3 优化 Hopper GPU、PagedAttention 实现高效推理、稀疏注意力支持超长上下文。

> 💡 自注意力的核心价值：让每个 token 能"看到"所有其他 token——这是 LLM 理解上下文、进行推理的基础。在 2026 年，注意力机制的优化仍是 LLM 性能提升的关键。

## 附录：注意力机制公式速查

| 公式 | 说明 |
|------|------|
| Attention(Q,K,V) = softmax(QK^T/√d_k)V | 标准注意力 |
| GQA: Q 分组共享 K,V | 分组查询注意力 |
| MLA: 压缩 KV 到低维空间 | 多头潜在注意力 |
| Flash Attention: IO 感知分块计算 | 硬件优化实现 |
| PagedAttention: KV Cache 分页管理 | 推理优化 |

## 附录：注意力机制变体对比

| 变体 | 复杂度 | 适用场景 | 代表模型 |
|------|------|------|------|
| Full Attention | O(n²) | 短序列 | BERT, GPT-2 |
| Sparse Attention | O(n√n) | 长序列 | Longformer |
| Linear Attention | O(n) | 超长序列 | Linear Transformer |
| Flash Attention | O(n²) IO优化 | 训练加速 | 所有现代 LLM |
| GQA | O(n²) KV压缩 | 推理优化 | Llama 3, Qwen3 |

> 💡 自注意力的本质：让每个 token 能够“看到”序列中的所有其他 token，实现全局信息流动。
