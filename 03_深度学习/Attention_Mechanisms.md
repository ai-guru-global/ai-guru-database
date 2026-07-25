---
title: 注意力机制全景 (Attention Mechanisms)
category: 03-deep-learning
tags: ["attention", "self-attention", "flash-attention", "linear-attention", "sparse-attention", "transformer"]
summary: "注意力机制完整技术图谱：从 Self-Attention 到 Flash Attention、Linear Attention、Sparse Attention、GQA/MLA，覆盖 2020-2026 所有主流变体的原理、实现与选型。"
created: 2026-07-21
updated: 2026-07-21
tier: core
sources: []

---
# 注意力机制全景 (Attention Mechanisms)

## 1. 注意力机制演进

```
2014: Bahdanau Attention (序列到序列对齐)
2015: Luong Attention (点积/通用/连接)
2017: Self-Attention (Transformer, Vaswani et al.)
2018: Multi-Head Attention (并行多子空间)
2019: Sparse Attention (Longformer/BigBird)
2020: Linear Attention (Katharopoulos et al.)
2021: Flash Attention (IO-aware, 不实例化 N×N)
2022: Multi-Query Attention (MQA, 共享 KV)
2023: Grouped-Query Attention (GQA, LLaMA2)
2023: Flash Attention 2 (并行优化)
2024: Multi-Latent Attention (MLA, DeepSeek-V2)
2024: Flash Attention 3 (Hopper 异步)
2025: Sliding Window + Full Attention 混合
2026: 自适应注意力 (动态稀疏度/精度)
```

## 2. 标准 Self-Attention

### 2.1 数学定义

```python
import torch
import torch.nn.functional as F
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    标准缩放点积注意力
    Q, K, V: [batch, heads, seq_len, d_head]
    复杂度: O(n²d) 时间, O(n²) 空间
    """
    d_k = Q.size(-1)
    
    # 注意力分数: Q × K^T / √d_k
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    
    # 掩码 (causal/padding)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    
    # Softmax 归一化
    attn_weights = F.softmax(scores, dim=-1)
    
    # 加权求和
    output = torch.matmul(attn_weights, V)
    
    return output, attn_weights
```

### 2.2 Multi-Head Attention

```python
class MultiHeadAttention(torch.nn.Module):
    def __init__(self, d_model=4096, n_heads=32):
        super().__init__()
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        
        self.W_q = torch.nn.Linear(d_model, d_model)
        self.W_k = torch.nn.Linear(d_model, d_model)
        self.W_v = torch.nn.Linear(d_model, d_model)
        self.W_o = torch.nn.Linear(d_model, d_model)
    
    def forward(self, x, mask=None):
        B, N, D = x.shape
        
        # 投影并分头
        Q = self.W_q(x).view(B, N, self.n_heads, self.d_head).transpose(1, 2)
        K = self.W_k(x).view(B, N, self.n_heads, self.d_head).transpose(1, 2)
        V = self.W_v(x).view(B, N, self.n_heads, self.d_head).transpose(1, 2)
        
        # 注意力计算
        attn_out, _ = scaled_dot_product_attention(Q, K, V, mask)
        
        # 合并头 + 输出投影
        attn_out = attn_out.transpose(1, 2).contiguous().view(B, N, D)
        return self.W_o(attn_out)
```

## 3. 高效注意力变体

### 3.1 Flash Attention (2022-2024)

```python
# Flash Attention 核心思想:
# 不实例化完整 N×N 注意力矩阵
# 分块 (tiling) 计算，利用 GPU SRAM

# 标准注意力内存: O(N²) — N=128K 时需要 ~64GB!
# Flash Attention: O(N) — 分块流式计算

# 算法:
# 1. 将 Q 分为 Br 块, K/V 分为 Bc 块
# 2. 对每个 Q 块，遍历所有 K/V 块
# 3. 在线计算 Softmax (边算边归一化)
# 4. 累积输出，无需存储完整注意力矩阵

# 性能 (A100, seq_len=4096):
# 标准: 1.2 TFLOPS, 64MB 显存
# Flash: 1.8 TFLOPS, 2MB 显存 (32× 节省!)

# 使用:
from flash_attn import flash_attn_func

# flash_attn_func(q, k, v, causal=True)
# q, k, v: [batch, seqlen, nheads, headdim]
output = flash_attn_func(q, k, v, causal=True)
```

### 3.2 Grouped-Query Attention (GQA)

```python
# GQA: KV 头数 < Q 头数 (LLaMA2/3, Qwen2 采用)
# MHA: n_q_heads = n_kv_heads = 32  (标准)
# MQA: n_q_heads = 32, n_kv_heads = 1  (极端共享)
# GQA: n_q_heads = 32, n_kv_heads = 8  (折中)

# 优势: KV Cache 减少 4×, 推理速度提升, 精度几乎无损

class GroupedQueryAttention(torch.nn.Module):
    def __init__(self, d_model=4096, n_q_heads=32, n_kv_heads=8):
        super().__init__()
        self.n_q_heads = n_q_heads
        self.n_kv_heads = n_kv_heads
        self.n_groups = n_q_heads // n_kv_heads  # 每组4个Q头共享1个KV头
        self.d_head = d_model // n_q_heads
        
        self.W_q = torch.nn.Linear(d_model, n_q_heads * self.d_head)
        self.W_k = torch.nn.Linear(d_model, n_kv_heads * self.d_head)
        self.W_v = torch.nn.Linear(d_model, n_kv_heads * self.d_head)
        self.W_o = torch.nn.Linear(d_model, d_model)
    
    def forward(self, x, mask=None):
        B, N, D = x.shape
        
        Q = self.W_q(x).view(B, N, self.n_q_heads, self.d_head).transpose(1, 2)
        K = self.W_k(x).view(B, N, self.n_kv_heads, self.d_head).transpose(1, 2)
        V = self.W_v(x).view(B, N, self.n_kv_heads, self.d_head).transpose(1, 2)
        
        # 扩展 KV 到 Q 的头数
        K = K.repeat_interleave(self.n_groups, dim=1)
        V = V.repeat_interleave(self.n_groups, dim=1)
        
        attn_out, _ = scaled_dot_product_attention(Q, K, V, mask)
        attn_out = attn_out.transpose(1, 2).contiguous().view(B, N, D)
        return self.W_o(attn_out)
```

### 3.3 Multi-Latent Attention (MLA, DeepSeek-V2)

```python
# MLA: 将 KV 压缩到低秩潜空间
# 标准: KV Cache = 2 × n_layers × n_heads × d_head × seq_len
# MLA:  KV Cache = 2 × n_layers × d_compress × seq_len (大幅压缩)

class MultiLatentAttention(torch.nn.Module):
    """
    DeepSeek-V2/V3 MLA: 低秩 KV 压缩
    d_model=4096, d_compress=512 → 8× KV Cache 压缩
    """
    def __init__(self, d_model=4096, d_compress=512, n_heads=32):
        super().__init__()
        self.d_head = d_model // n_heads
        
        # Q: 正常投影
        self.W_q = torch.nn.Linear(d_model, d_model)
        
        # KV: 先压缩到低维，再解压
        self.W_dk = torch.nn.Linear(d_model, d_compress)  # 压缩
        self.W_uk = torch.nn.Linear(d_compress, d_model)  # 解压 (Key)
        self.W_uv = torch.nn.Linear(d_compress, d_model)  # 解压 (Value)
        
        # RoPE 单独处理 (不可压缩部分)
        self.W_q_rope = torch.nn.Linear(d_model, self.d_head)
        self.W_k_rope = torch.nn.Linear(d_model, self.d_head)
    
    def forward(self, x, mask=None):
        # Q 投影
        q = self.W_q(x)
        
        # KV 压缩 → 解压
        c_kv = self.W_dk(x)  # [B, N, d_compress] — 这是存入 Cache 的!
        k = self.W_uk(c_kv)  # [B, N, d_model]
        v = self.W_uv(c_kv)  # [B, N, d_model]
        
        # 标准注意力 (使用解压后的 KV)
        # ... (省略标准 MHA 计算)
        
        # KV Cache 只存 c_kv (d_compress=512 vs d_model=4096)
        return output, c_kv  # c_kv 用于缓存
```

### 3.4 Linear Attention

```python
# 标准 Attention: softmax(QK^T)V — O(n²)
# Linear Attention: φ(Q)(φ(K)^T V) — O(n)
# 关键: 利用结合律改变计算顺序

def linear_attention(Q, K, V):
    """
    线性注意力: 将 softmax 替换为核函数 φ
    复杂度: O(nd²) 而非 O(n²d)
    """
    # 核函数: φ(x) = elu(x) + 1 (保证非负)
    Q_prime = F.elu(Q) + 1
    K_prime = F.elu(K) + 1
    
    # 改变计算顺序: 先算 K^T V (d×d), 再乘 Q
    KV = torch.einsum('bhnd,bhne->bhde', K_prime, V)  # [B, H, d, d]
    numerator = torch.einsum('bhnd,bhde->bhne', Q_prime, KV)  # [B, H, N, d]
    
    # 归一化
    K_sum = K_prime.sum(dim=2)  # [B, H, d]
    denominator = torch.einsum('bhnd,bhd->bhn', Q_prime, K_sum)
    
    return numerator / (denominator.unsqueeze(-1) + 1e-6)

# 代表模型: RetNet, RWKV, Mamba (SSM 也可视为线性注意力)
# 优势: O(n) 复杂度，支持无限长序列
# 劣势: 精度通常低于标准注意力
```

## 4. 稀疏注意力

### 4.1 稀疏模式

| 模式 | 复杂度 | 代表 | 适用场景 |
|------|--------|------|----------|
| 全局 (Full) | O(n²) | Transformer | 短序列 (<4K) |
| 滑动窗口 | O(nw) | Mistral/Gemma | 长序列局部依赖 |
| 步幅 (Strided) | O(ns) | Sparse Transformer | 周期性模式 |
| 块稀疏 | O(nb) | BigBird/Longformer | 文档级理解 |
| 哈希 (LSH) | O(n log n) | Reformer | 超长序列 |
| 动态稀疏 | O(nk) | Dynamic Sparse | 自适应 |

### 4.2 混合注意力 (2025-2026 趋势)

```python
# 现代 LLM 的混合策略:
# - 大部分层: 滑动窗口注意力 (高效)
# - 少数层: 全局注意力 (捕捉长距离)
# - 比例: 通常 3:1 或 7:1

# Mistral: 所有层滑动窗口 (w=4096)
# Gemma 2: 交替 局部/全局
# Qwen2.5: 滑动窗口 + 全局混合
# LLaMA 4: 层间交替不同注意力模式
```

## 5. 注意力机制选型指南

```
序列长度 → 推荐方案:
├── < 4K tokens
│   └── 标准 MHA + Flash Attention
├── 4K - 32K tokens
│   └── GQA + Flash Attention + RoPE
├── 32K - 128K tokens
│   └── GQA/MLA + Flash Attention + 滑动窗口混合
├── 128K - 1M tokens
│   └── MLA + 滑动窗口 + 稀疏全局层
└── > 1M tokens
    └── 线性注意力/SSM + 检索增强

推理优先 → GQA/MLA (KV Cache 小)
训练优先 → Flash Attention (IO 优化)
边缘部署 → 线性注意力/SSM (O(n) 复杂度)
```

## 相关文档

- [[05_大模型/Transformer_Deep_Dive|Transformer 深度解析]]
- [[05_大模型/05_LLM_Architectures/LLM_Internals_Architecture|大模型架构内幕]]
- [[03_深度学习/State_Space_Models/|状态空间模型]] — Mamba/RWKV
- [[10_部署推理/02_Inference_Engines/|推理引擎]] — KV Cache 优化
- [[01_数学基础/05_Numerical_Methods/Numerical_Stability|数值稳定性]] — Softmax 溢出
