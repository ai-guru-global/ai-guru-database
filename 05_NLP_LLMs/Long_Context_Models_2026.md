---
title: '长上下文模型 2026: 万级 Token 处理'
category: '04-nlp-llms'
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: '> **一句话理解**: 2026年的LLM已从"大海捞针"进化到"整本典籍"——100K-1M token的上下文窗口重新定义了AI能处理的问题规模，但随之而来的计算复杂度、内存管理、信息检索挑战催生了全新的工程范式。'
created: '2026-05-31'
updated: '2026-05-31'
---

# 长上下文模型 2026: 万级 Token 处理

> **一句话理解**: 2026 年的 LLM 已从"大海捞针"进化到"整本典籍"——100K-1M token 的上下文窗口重新定义了 AI 能处理的问题规模，但随之而来的计算复杂度、内存管理、信息检索挑战催生了全新的工程范式。

---

## 1. 概述 (Overview)

### 1.1 上下文窗口演进

```
上下文窗口演进:

2022: GPT-3            2,049 tokens    (~8K字符)
2023: GPT-4            8,192 tokens    (~32K字符)
2023: Claude 2         100K tokens      (~400K字符)
2024: Gemini 1.5       1M tokens        (~4M字符)
2025: Claude 3.5       200K tokens
2026: GPT-5            1M tokens (推测)
2026: Gemini Ultra 2   2M tokens (推测)

关键突破:
├── Gemini 1.5 Pro: 首次实现可靠的1M token上下文
├── KV Cache优化: 显著降低长上下文的内存占用
└──稀疏注意力: O(n²) → O(n) 复杂度优化
```

### 1.2 为什么长上下文重要

```
应用场景变革:

短上下文 (4K):
├── 简单问答
├── 短文档摘要
└── 单文件处理

中等上下文 (32K-100K):
├── 代码库理解
├── 长文档分析
└── 多文档对比

长上下文 (100K-1M+):
├── 整本书籍处理
├── 代码仓库分析 (整个repo)
├── 视频帧序列处理
├── 多小时会议转录分析
└── 跨文档知识综合
```

---

## 2. 核心技术挑战

### 2.1 注意力机制的复杂度问题

```
标准Self-Attention复杂度:

                    O(n²)  →  1M token时计算量爆炸

┌─────────────────────────────────────────────────────────────┐
│  序列长度 n 与计算复杂度                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  4K tokens:   16M operations     ✓ 可接受                   │
│  32K tokens:  1B operations      ✓ 可接受                   │
│  100K tokens: 10B operations     ⚠️ 需要优化                │
│  1M tokens:   1T operations      ✗ 无法直接计算             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 KV Cache 内存问题

```
KV Cache 内存占用计算:

每个token的KV向量:
- Key/Value向量维度: d = 128 (per head)
- 注意力头数: h = 32
- 每个token的KV: 2 × d × h × 4 bytes (float32)
- 每个token的KV: 约 32KB

不同上下文长度的KV Cache:

| 上下文长度 | KV Cache大小 (FP16) | 适合的GPU |
|-----------|---------------------|----------|
| 4K | 128MB | RTX 3080 |
| 32K | 1GB | A100 40GB |
| 100K | 3.2GB | A100 80GB |
| 1M | 32GB | 需压缩/分布式 |
| 10M | 320GB | 不可能直接存储 |

解决方案:
1. KV Cache压缩
2. 分布式缓存
3. 稀疏注意力
```

---

## 3. 核心技术方案

### 3.1 稀疏注意力 (Sparse Attention)

```python
"""稀疏注意力实现"""

class SparseAttention:
    """
    稀疏注意力模式
    
    核心思想: 不是所有token都对当前token重要
    只计算局部和全局重要的注意力
    """
    
    def __init__(
        self,
        window_size: int = 512,
        global_tokens: int = 32,
        randomness: float = 0.01
    ):
        self.window_size = window_size
        self.global_tokens = global_tokens
        self.randomness = randomness
    
    def get_attention_pattern(
        self,
        seq_len: int,
        position: int
    ) -> list:
        """
        返回当前position需要关注的token位置
        
        注意力模式:
        1. 局部窗口: 周围window_size个token
        2. 全局token: 固定的global_tokens (如[SEP], 句号等)
        3. 随机token: 增加探索性
        """
        positions = set()
        
        # 1. 局部窗口注意力
        start = max(0, position - self.window_size // 2)
        end = min(seq_len, position + self.window_size // 2)
        for i in range(start, end):
            positions.add(i)
        
        # 2. 全局token (固定间隔或特殊token)
        global_interval = seq_len // self.global_tokens
        for i in range(0, seq_len, global_interval):
            positions.add(i)
        
        # 3. 随机稀疏 (增加多样性)
        n_random = int(self.window_size * self.randomness)
        import random
        random_positions = random.sample(
            range(seq_len),
            min(n_random, seq_len)
        )
        positions.update(random_positions)
        
        return sorted(list(positions))


class LongformerAttention:
    """
    Longformer: 组合稀疏注意力的Transformer变体
    """
    
    def __init__(self, model):
        self.model = model
        self.sparse_attn = SparseAttention(
            window_size=512,
            global_tokens=32
        )
    
    def forward(
        self,
        hidden_states,
        attention_mask=None
    ):
        seq_len = hidden_states.shape[1]
        
        # 为每个位置计算稀疏注意力模式
        sparse_patterns = [
            self.sparse_attn.get_attention_pattern(seq_len, i)
            for i in range(seq_len)
        ]
        
        # 压缩计算: O(n × window_size) 而不是 O(n²)
        # ...
        
        return output
```

### 3.2 Flash Attention 优化

```python
"""Flash Attention 实现 (伪代码)"""

class FlashAttention:
    """
    Flash Attention: IO感知的精确注意力优化
    
    核心思想: 将注意力计算分块，避免Materialize大型矩阵
    减少 HBM (GPU显存) 和 SRAM 之间的数据移动
    """
    
    @staticmethod
    def forward(
        Q,  # Query: (B, H, N, D)
        K,  # Key:   (B, H, M, D)
        V,  # Value: (B, H, M, D)
        causal=True
    ):
        """
        块级注意力计算
        
        步骤:
        1. 将Q,K,V分成小块 (blocks)
        2. 逐块计算注意力，保存用于反向传播的统计量
        3. 正确归一化得到最终输出
        """
        B, H, N, D = Q.shape
        Br = 128  # 行块大小
        
        # 计算块数
        n_tiles = (N + Br - 1) // Br
        
        # 初始化输出和归一化因子
        O = torch.zeros_like(Q)
        L = torch.zeros((B, H, N))
        
        # 逐块处理
        for i in range(n_tiles):
            # 加载当前块的Q
            Q_i = Q[:, :, i*Br:(i+1)*Br]
            
            # 计算与之前所有K的注意力
            # 使用安全的softmax (数值稳定)
            
            # ...
        
        return O
```

### 3.3 位置编码外推

```python
"""位置编码外推技术"""

class PositionalEncodingExtrapolation:
    """
    位置编码外推: 处理训练时未见过的更长序列
    
    问题: 如果模型在4K token上训练，但在10K token上推理
    RoPE等位置编码需要特殊处理
    """
    
    @staticmethod
    def rope_extrapolation(
        position: int,
        dim: int,
        base: int = 10000,
        factor: float = 1.0
    ) -> float:
        """
        RoPE (Rotary Position Embedding) 外推
        
        核心: 角度随位置线性增长，但有最大角频率限制
        外推: 通过缩放因子扩展有效范围
        """
        theta = 1.0 / (base ** (2 * torch.arange(0, dim, 2) / dim))
        position *= factor  # 缩放位置
        
        m = position.unsqueeze(-1)
        theta = theta.to(m.device)
        
        # 旋转角度
        embeddings = m * theta
        embeddings = torch.cat([embeddings, embeddings], dim=-1)
        
        return torch.cos(embeddings), torch.sin(embeddings)
    
    @staticmethod
    def alibi_positions(
        seq_len: int,
        n_heads: int
    ) -> torch.Tensor:
        """
        ALiBi (Attention with Linear Biases)
        
        思想: 不使用绝对位置编码，只使用相对位置偏差
        自然外推到任意长度
        """
        # 创建相对位置矩阵
        positions = torch.arange(seq_len)
        diff = positions.unsqueeze(1) - positions.unsqueeze(0)
        
        # 线性偏差
        slopes = 2 ** (-8 / n_heads) ** torch.arange(1, n_heads + 1)
        bias = -slopes.unsqueeze(1) * diff.abs().unsqueeze(0)
        
        return bias
```

---

## 4. 高级注意力优化技术

### 4.1 Ring Attention (环形注意力)

```python
"""
Ring Attention: 分布式长序列注意力

核心思想: 将序列分割到多个GPU，每个GPU只负责一部分
通过环形通信传递K/V块，实现序列并行

优势:
- 打破单GPU显存限制
- 线性扩展到任意长度
- 保持精确注意力 (非近似)
"""

import torch
import torch.distributed as dist

class RingAttention:
    """
    Ring Attention 实现
    
    工作流程:
    1. 每个GPU持有Q的一个块
    2. K/V在GPU环中传递
    3. 每个GPU计算它看到的K/V与本地Q的注意力
    4. 累加得到完整的注意力输出
    """
    
    def __init__(self, rank: int, world_size: int):
        self.rank = rank
        self.world_size = world_size
    
    def forward(
        self,
        Q_local: torch.Tensor,  # 本地的Q块 (B, H, N/world_size, D)
        K_local: torch.Tensor,  # 本地的K块
        V_local: torch.Tensor,  # 本地的V块
    ) -> torch.Tensor:
        """
        Ring Attention 前向传播
        
        复杂度: O(N² / world_size) 每GPU
        """
        B, H, N_local, D = Q_local.shape
        
        # 初始化输出和归一化因子
        O = torch.zeros_like(Q_local)
        l = torch.zeros(B, H, N_local, 1, device=Q_local.device)
        m = torch.full(
            (B, H, N_local, 1), 
            float('-inf'), 
            device=Q_local.device
        )
        
        # 当前持有的K/V块 (初始是本地的)
        K_block = K_local.clone()
        V_block = V_local.clone()
        
        # 环形通信
        for step in range(self.world_size):
            # 计算当前K/V块与本地Q的注意力
            # Flash Attention 风格的块计算
            scores = torch.matmul(Q_local, K_block.transpose(-2, -1))
            scores = scores / (D ** 0.5)
            
            # 在线 Softmax 更新
            m_new = torch.maximum(m, scores.max(dim=-1, keepdim=True)[0])
            l_new = l * torch.exp(m - m_new) + \
                    torch.exp(scores - m_new).sum(dim=-1, keepdim=True)
            
            # 更新输出
            O = O * (l * torch.exp(m - m_new)) / l_new + \
                torch.matmul(
                    torch.exp(scores - m_new),
                    V_block
                ) / l_new
            
            m = m_new
            l = l_new
            
            # 环形传递K/V到下一个GPU
            if step < self.world_size - 1:
                # 发送给下一个GPU，从上一个GPU接收
                next_rank = (self.rank + 1) % self.world_size
                prev_rank = (self.rank - 1) % self.world_size
                
                # 创建发送/接收缓冲区
                K_send = K_block.clone()
                V_send = V_block.clone()
                K_recv = torch.empty_like(K_block)
                V_recv = torch.empty_like(V_block)
                
                # 异步通信
                dist.send(K_send.contiguous(), dst=next_rank)
                dist.recv(K_recv, src=prev_rank)
                
                dist.send(V_send.contiguous(), dst=next_rank)
                dist.recv(V_recv, src=prev_rank)
                
                K_block = K_recv
                V_block = V_recv
        
        return O


class StripedAttention:
    """
    Striped Attention: Ring Attention 的优化变体
    
    优化点:
    - 减少通信量
    - 更好的负载均衡
    - 支持因果注意力
    """
    
    def __init__(self, rank: int, world_size: int):
        self.rank = rank
        self.world_size = world_size
    
    def forward(self, Q, K, V):
        # Striped 模式: 每个GPU处理不同"条纹"的注意力
        # 详细实现略
        pass
```

### 4.2 上下文压缩技术

```python
"""
上下文压缩: 在保持信息的前提下减少KV Cache大小
"""

import torch
from typing import Tuple, List

class H2OCompressor:
    """
    H2O (Heavy Hitter Oracle): 保留重要Token的KV缓存压缩
    
    核心思想:
    - 不是所有Token都同等重要
    - 保留"重击者"(Heavy Hitters) - 被多次关注的Token
    - 滑动窗口保留局部上下文
    
    压缩率: 50-80%
    准确率损失: <2%
    """
    
    def __init__(
        self,
        heavy_size: int = 128,    # 重击者缓存大小
        recent_size: int = 256,    # 最近Token缓存大小
    ):
        self.heavy_size = heavy_size
        self.recent_size = recent_size
    
    def compress(
        self,
        keys: torch.Tensor,      # (B, H, N, D)
        values: torch.Tensor,    # (B, H, N, D)
        attention_weights: torch.Tensor,  # (B, H, N, N) - 累积注意力分数
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        压缩KV缓存
        
        返回压缩后的keys, values
        """
        B, H, N, D = keys.shape
        
        # 1. 识别重击者 (被关注最多的Token)
        # 累积注意力分数
        scores = attention_weights.sum(dim=(0, 1))  # (N,)
        
        # 获取top-k重击者
        _, heavy_indices = torch.topk(scores, self.heavy_size)
        heavy_indices = heavy_indices.sort()[0]
        
        # 2. 最近Token (滑动窗口)
        recent_indices = torch.arange(
            N - self.recent_size, N,
            device=keys.device
        )
        
        # 3. 合并索引 (去重)
        all_indices = torch.cat([heavy_indices, recent_indices])
        all_indices = torch.unique(all_indices)
        
        # 4. 选择性保留
        compressed_keys = keys[:, :, all_indices, :]
        compressed_values = values[:, :, all_indices, :]
        
        return compressed_keys, compressed_values


class StreamingLLM:
    """
    StreamingLLM: 流式长文本处理
    
    核心思想:
    - 不需要存储所有历史KV
    - 保留特殊"汇点Token"(Sink Tokens)
    - 支持无限长度生成
    
    关键发现:
    - Transformer的初始Token (如[CLS]) 成为注意力汇点
    - 保留汇点 + 最近窗口即可保持性能
    """
    
    def __init__(
        self,
        n_sink: int = 4,        # 汇点Token数量
        window_size: int = 4096, # 滑动窗口大小
    ):
        self.n_sink = n_sink
        self.window_size = window_size
    
    def select_kv(
        self,
        keys: torch.Tensor,
        values: torch.Tensor,
        position: int,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        选择保留的KV
        
        策略:
        1. 始终保留前n_sink个Token (汇点)
        2. 保留最近window_size个Token
        """
        N = keys.shape[2]
        
        if N <= self.n_sink + self.window_size:
            return keys, values
        
        # 汇点索引
        sink_indices = torch.arange(self.n_sink)
        
        # 最近窗口索引
        start = max(self.n_sink, N - self.window_size)
        recent_indices = torch.arange(start, N)
        
        # 合并
        selected = torch.cat([sink_indices, recent_indices])
        
        return keys[:, :, selected, :], values[:, :, selected, :]


class AutoCompressor:
    """
    自动压缩: 学习压缩哪些Token
    
    方法:
    - 训练一个小的压缩网络
    - 动态决定每个Token的重要性
    - 基于任务反馈优化压缩策略
    """
    
    def __init__(self, hidden_dim: int, compression_ratio: float = 0.5):
        self.compression_ratio = compression_ratio
        self.importance_net = torch.nn.Sequential(
            torch.nn.Linear(hidden_dim, hidden_dim // 2),
            torch.nn.ReLU(),
            torch.nn.Linear(hidden_dim // 2, 1),
            torch.nn.Sigmoid()
        )
    
    def compress(
        self,
        hidden_states: torch.Tensor,
        keys: torch.Tensor,
        values: torch.Tensor,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        基于学习的压缩
        """
        N = hidden_states.shape[1]
        n_keep = int(N * self.compression_ratio)
        
        # 计算每个Token的重要性
        importance = self.importance_net(hidden_states)  # (B, N, 1)
        importance = importance.squeeze(-1)  # (B, N)
        
        # 选择重要的Token
        _, indices = importance.topk(n_keep, dim=1)
        indices = indices.sort(dim=1)[0]
        
        # 收集
        compressed_keys = torch.gather(
            keys, 2, 
            indices.unsqueeze(1).unsqueeze(-1).expand(-1, keys.shape[1], -1, keys.shape[3])
        )
        compressed_values = torch.gather(
            values, 2,
            indices.unsqueeze(1).unsqueeze(-1).expand(-1, values.shape[1], -1, values.shape[3])
        )
        
        return compressed_keys, compressed_values
```

### 4.3 位置编码外推详解

```python
"""
位置编码外推: 处理训练时未见过的更长序列
"""

import torch
import math

class PositionExtrapolation:
    """
    位置编码外推技术集合
    
    问题: 模型在L长度上训练，要在L' > L上推理
    解决: 调整位置编码使其适应更长序列
    """
    
    @staticmethod
    def ntk_aware_scaling(
        position: int,
        dim: int,
        original_max: int,
        target_max: int,
        base: int = 10000,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        NTK-Aware Scaling: 基于神经正切核理论的位置缩放
        
        核心思想:
        - 高频分量需要更精细的位置信息
        - 缩放因子随维度变化
        
        效果: 比线性插值更好的长序列表现
        """
        # 计算缩放因子
        scaling = target_max / original_max
        
        # NTK感知的base调整
        # base_new = base * (scaling ** (dim / (dim - 2)))
        base_new = base * (scaling ** (dim / (dim - 2)))
        
        # 使用新base计算位置编码
        theta = 1.0 / (base_new ** (torch.arange(0, dim, 2) / dim))
        
        # 角度计算
        angles = position * theta
        
        return torch.cos(angles), torch.sin(angles)
    
    @staticmethod
    def yarn_extrapolation(
        position: int,
        dim: int,
        original_max: int,
        target_max: int,
        base: int = 10000,
        beta_fast: float = 32.0,
        beta_slow: float = 1.0,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        YaRN (Yet another RoPE extensioN): 改进的RoPE外推
        
        创新点:
        1. 结合NTK-aware缩放
        2. 添加温度缩放
        3. 平滑过渡区
        
        效果: 在极长序列上表现最佳
        """
        scaling = target_max / original_max
        
        # 计算维度相关的缩放
        n = torch.arange(0, dim, 2, dtype=torch.float32)
        
        # 频率相关因子
        # 低频维度使用更大的缩放
        # 高频维度使用更小的缩放
        freq = base ** (n / dim)
        
        # 平滑过渡
        def find_correction_dim(num_rotations, dim, base=10000):
            return (dim * math.log(num_rotations / (2 * math.pi))) / (2 * math.log(base))
        
        correction = find_correction_dim(
            original_max / (2 * math.pi),
            dim,
            base
        )
        
        # 计算alpha和beta
        dim_alpha = max(0, correction - beta_fast)
        dim_beta = min(dim, correction + beta_slow)
        
        # 应用YaRN缩放
        # 详细实现...
        
        theta = 1.0 / (base ** (n / dim))
        theta = theta * scaling
        
        angles = position * theta
        
        return torch.cos(angles), torch.sin(angles)
    
    @staticmethod
    def positional_interpolation(
        position: int,
        dim: int,
        original_max: int,
        target_max: int,
        base: int = 10000,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Position Interpolation (PI): 最简单的位置外推
        
        方法: 线性缩放位置索引
        position_new = position * (original_max / target_max)
        
        优点: 简单有效
        缺点: 长距离关系可能受影响
        """
        scaling = original_max / target_max
        scaled_position = position * scaling
        
        theta = 1.0 / (base ** (torch.arange(0, dim, 2) / dim))
        angles = scaled_position * theta
        
        return torch.cos(angles), torch.sin(angles)


# 使用示例
def apply_long_context_extension(
    model,
    original_max_length: int,
    target_max_length: int,
    method: str = "yarn"
):
    """
    应用长上下文扩展到模型
    """
    ext = PositionExtrapolation()
    
    # 修改模型的位置编码
    for name, module in model.named_modules():
        if "rotary" in name.lower() or "rope" in name.lower():
            # 替换位置编码计算
            if method == "ntk":
                module.compute_positions = lambda pos, dim: ext.ntk_aware_scaling(
                    pos, dim, original_max_length, target_max_length
                )
            elif method == "yarn":
                module.compute_positions = lambda pos, dim: ext.yarn_extrapolation(
                    pos, dim, original_max_length, target_max_length
                )
            else:  # pi
                module.compute_positions = lambda pos, dim: ext.positional_interpolation(
                    pos, dim, original_max_length, target_max_length
                )
    
    return model
```

---

## 5. 大海捞针测试 (Needle in Haystack)

### 4.1 测试方法

```
大海捞针测试: 评估长上下文模型的信息检索能力

测试设计:
├── 在大量无关文本中插入一个特殊信息 ("针")
├── 要求模型检索出"针"的内容
└── 测试不同位置、不同深度下的准确率

评估维度:
├── 位置泛化: 针在开头/中间/结尾的表现
├── 深度泛化: 针在文档不同位置的表现
├── 干扰数量: 多少"草堆"会影响检索
└上下文利用率: 模型实际使用了多少上下文
```

### 4.2 2026年基准

| 模型 | 32K | 100K | 1M |
|------|-----|------|-----|
| GPT-4 32K | 95% | 85% | N/A |
| Claude 3 | 98% | 95% | 88% |
| Gemini 1.5 | 99% | 98% | 95% |
| Claude 3.5 | 99% | 98% | 92% |

---

## 5. 工程实践

### 5.1 上下文管理策略

```python
"""长上下文管理策略"""

class ContextManager:
    """
    智能上下文管理
    """
    
    @staticmethod
    def select_relevant_chunks(
        chunks: list[str],
        query: str,
        max_tokens: int,
        embedding_model
    ) -> list[str]:
        """
        选择与查询最相关的chunk
        
        策略:
        1. 计算每个chunk与query的语义相似度
        2. 按相似度排序
        3. 贪心选择直到达到max_tokens
        """
        # 嵌入
        query_emb = embedding_model.encode(query)
        chunk_embs = [embedding_model.encode(c) for c in chunks]
        
        # 计算相似度
        similarities = [
            cosine_sim(query_emb, ce)
            for ce in chunk_embs
        ]
        
        # 排序选择
        sorted_indices = sorted(
            range(len(similarities)),
            key=lambda i: similarities[i],
            reverse=True
        )
        
        selected = []
        total_tokens = 0
        
        for idx in sorted_indices:
            chunk_tokens = len(chunks[idx]) // 4  # 估算
            if total_tokens + chunk_tokens <= max_tokens:
                selected.append(chunks[idx])
                total_tokens += chunk_tokens
        
        return selected
    
    @staticmethod
    def hierarchical_summarization(
        document: str,
        levels: int = 3
    ) -> list[str]:
        """
        分层摘要: 先摘要再选择性展开
        
        层级结构:
        L1: 文档级别摘要 (100 tokens)
        L2: 章节级别摘要 (500 tokens per section)
        L3: 完整文档 (full)
        
        检索时先看L1，确定需要深入的部分后再展开L2
        """
        # ...
```

### 5.2 内存优化

```python
"""KV Cache 优化"""

class KVCacheOptimizer:
    """
    KV Cache 压缩与优化
    """
    
    @staticmethod
    def compress_kv_cache(
        k_cache: torch.Tensor,
        v_cache: torch.Tensor,
        compression_ratio: float = 0.5
    ) -> tuple[torch.Tensor, torch.Tensor]:
        """
        KV Cache 压缩
        
        方法1: 奇异值分解压缩
        - 对K,V矩阵进行SVD
        - 只保留主要成分
        """
        B, H, N, D = k_cache.shape
        
        # Reshape for compression
        k_reshaped = k_cache.transpose(1, 2).reshape(N, H * D)
        v_reshaped = v_cache.transpose(1, 2).reshape(N, H * D)
        
        # SVD
        U_k, S_k, V_k = torch.svd_lowrank(k_reshaped, q=int(N * compression_ratio))
        U_v, S_v, V_v = torch.svd_lowrank(v_reshaped, q=int(N * compression_ratio))
        
        # 重建压缩后的cache
        k_compressed = U_k @ torch.diag(S_k)
        v_compressed = U_v @ torch.diag(S_v)
        
        return k_compressed, v_compressed
    
    @staticmethod
    def pages_cache(
        attention_mask: torch.Tensor,
        page_size: int = 16
    ) -> dict:
        """
        Paged Attention式KV Cache管理
        
        思想: 像操作系统的分页内存一样管理KV cache
        - 按需加载
        - 共享前缀缓存
        - 动态分配
        """
        # ...
```

---

## 6. 2026 年模型对比

| 模型 | 最大上下文 | 1M上下文表现 | 关键技术 |
|------|----------|-------------|----------|
| **Claude 3.5** | 200K | 92% needle | 序列中枢 |
| **Gemini 1.5** | 1M | 95% needle | 稀疏注意力 |
| **GPT-4o** | 128K | 90% needle | 动态稀疏 |
| **Llama 3.1** | 128K | 85% needle | 位置编码优化 |
| **Mistral 2** | 32K | 88% needle | Sliding Window |

---

## 8. 长文本评估基准

### 8.1 评估基准概览

| 基准 | 最大长度 | 任务类型 | 核心评估点 |
|-----|---------|---------|-----------|
| **LongBench** | 67K | 多任务 | 检索、摘要、代码 |
| **L-Eval** | 200K | 真实场景 | 开放问答、摘要 |
| **NeedleBench** | 1M | 检索 | 信息定位能力 |
| **LongContext-Chat** | 128K | 对话 | 多轮上下文理解 |
| **ZeroSCROLLS** | 50K | 多任务 | 零样本长文本 |
| **InfiniteBench** | 500K | 检索+推理 | 极长上下文 |

### 8.2 LongBench 详细介绍

```python
"""
LongBench: 长上下文多任务评估基准

特点:
- 6大任务类型，20个子任务
- 中文+英文双语
- 平均长度15K，最大67K

任务类型:
├── 单文档QA (Single-Doc QA)
│   ├── QMSum (会议摘要QA)
│   ├── Qasper (学术论文QA)
│   └── MultiFieldQA (多领域QA)
│
├── 多文档QA (Multi-Doc QA)
│   ├── HotpotQA (多跳推理)
│   ├── 2WikiMQA (知识图谱QA)
│   └── Musique (音乐QA)
│
├── 摘要 (Summarization)
│   ├── GovReport (政府报告)
│   ├── MultiNews (新闻摘要)
│   └── SummScreen (剧本摘要)
│
├── 代码 (Code)
│   ├── LCC (代码补全)
│   └── RepoBench-P (仓库理解)
│
├── Few-shot学习
│   ├── TREC (分类)
│   └── NQ (自然问题)
│
└── 合成任务 (Synthetic)
    ├── PassageRetrieval (段落检索)
    └── PassageCount (段落计数)
"""

# LongBench 评估示例
class LongBenchEvaluator:
    """LongBench 评估器"""
    
    TASKS = {
        "single_doc_qa": ["qmsum", "qasper", "multifieldqa"],
        "multi_doc_qa": ["hotpotqa", "2wikimqa", "musique"],
        "summarization": ["gov_report", "multinews", "summscreen"],
        "code": ["lcc", "repobench-p"],
        "few_shot": ["trec", "nq"],
        "synthetic": ["passage_retrieval", "passage_count"]
    }
    
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
    
    def evaluate_task(self, task_name: str, data_path: str) -> dict:
        """评估单个任务"""
        import json
        
        with open(f"{data_path}/{task_name}.json") as f:
            data = json.load(f)
        
        predictions = []
        references = []
        
        for sample in data:
            # 构建输入
            context = sample["context"]
            question = sample["input"]
            
            input_text = f"Context: {context}\n\nQuestion: {question}\n\nAnswer:"
            
            # 模型生成
            output = self.model.generate(input_text)
            
            predictions.append(output)
            references.append(sample["answers"])
        
        # 计算指标
        if task_name in ["qmsum", "qasper", "multifieldqa", "hotpotqa", "2wikimqa"]:
            metric = self._compute_f1(predictions, references)
        elif task_name in ["gov_report", "multinews", "summscreen"]:
            metric = self._compute_rouge(predictions, references)
        else:
            metric = self._compute_accuracy(predictions, references)
        
        return {
            "task": task_name,
            "metric": metric,
            "num_samples": len(data)
        }
    
    def _compute_f1(self, predictions, references):
        """计算F1分数"""
        from collections import Counter
        
        def f1_score(pred, ref):
            pred_tokens = pred.lower().split()
            ref_tokens = ref.lower().split()
            
            common = Counter(pred_tokens) & Counter(ref_tokens)
            num_same = sum(common.values())
            
            if num_same == 0:
                return 0
            
            precision = num_same / len(pred_tokens)
            recall = num_same / len(ref_tokens)
            f1 = 2 * precision * recall / (precision + recall)
            return f1
        
        scores = []
        for pred, refs in zip(predictions, references):
            best_f1 = max(f1_score(pred, ref) for ref in refs)
            scores.append(best_f1)
        
        return sum(scores) / len(scores)
    
    def _compute_rouge(self, predictions, references):
        """计算ROUGE分数"""
        # 使用rouge-score库
        from rouge_score import rouge_scorer
        
        scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'])
        
        scores = {'rouge1': [], 'rouge2': [], 'rougeL': []}
        for pred, refs in zip(predictions, references):
            best_scores = {}
            for ref in refs:
                score = scorer.score(ref, pred)
                for key in scores:
                    best_scores[key] = max(
                        best_scores.get(key, 0),
                        score[key].fmeasure
                    )
            for key in scores:
                scores[key].append(best_scores[key])
        
        return {k: sum(v) / len(v) for k, v in scores.items()}


# 2026年 LongBench 排行榜
"""
| 模型 | 总分 | 单文档QA | 多文档QA | 摘要 | 代码 |
|-----|------|---------|---------|------|------|
| GPT-4 Turbo | 42.1 | 36.5 | 43.2 | 28.1 | 58.6 |
| Claude 3.5 | 44.8 | 38.1 | 46.7 | 29.5 | 61.2 |
| Gemini 1.5 Pro | 43.5 | 37.8 | 45.1 | 28.9 | 59.8 |
| Llama 3.1 70B | 36.2 | 32.1 | 35.8 | 25.3 | 51.4 |
| Qwen2-72B | 37.5 | 33.2 | 37.1 | 26.1 | 53.2 |
"""
```

### 8.3 L-Eval 详细介绍

```python
"""
L-Eval: 面向真实场景的长文本评估

特点:
- 最大200K上下文
- 真实世界任务 (非合成)
- 细粒度评估指标

任务类型:
├── 开放域问答
│   ├── Coursera (课程QA)
│   ├── GSM (数学应用题)
│   └── Quality (故事理解)
│
├── 摘要
│   ├── TVShow (电视剧摘要)
│   ├── Meeting (会议摘要)
│   └── Paper (论文摘要)
│
├── 排序与选择
│   ├── TopicRetrieval (主题检索)
│   └── ToMCAT (对话摘要)
│
└── 漫长对话
    ├── LongDialogue (长对话理解)
    └── OpenDialogue (开放式对话)
"""

class LEvalEvaluator:
    """L-Eval 评估器"""
    
    METRICS = {
        "qa": "exact_match_f1",       # QA用F1
        "summarization": "rouge",     # 摘要用ROUGE
        "retrieval": "accuracy",       # 检索用准确率
        "dialogue": "gpt4_score"      # 对话用GPT-4打分
    }
    
    def __init__(self, model, judge_model=None):
        self.model = model
        self.judge_model = judge_model
    
    def evaluate_length_bins(self, task: str, data: list) -> dict:
        """
        按长度分桶评估
        
        分析模型在不同上下文长度下的表现
        """
        bins = {
            "short": (0, 8000),
            "medium": (8000, 32000),
            "long": (32000, 100000),
            "extra_long": (100000, 200000)
        }
        
        results = {bin_name: [] for bin_name in bins}
        
        for sample in data:
            length = len(sample["context"].split())
            
            # 确定桶
            for bin_name, (low, high) in bins.items():
                if low <= length < high:
                    results[bin_name].append(
                        self._evaluate_sample(sample, task)
                    )
                    break
        
        # 计算每个桶的平均分
        return {
            bin_name: sum(scores) / len(scores) if scores else 0
            for bin_name, scores in results.items()
        }
    
    def _evaluate_sample(self, sample: dict, task: str) -> float:
        """评估单个样本"""
        if task == "qa":
            return self._evaluate_qa(sample)
        elif task == "summarization":
            return self._evaluate_summarization(sample)
        else:
            return 0.0


# L-Eval 长度分桶性能对比
"""
模型性能随上下文长度变化:

模型: Claude 3.5 Sonnet
┌─────────────────┬────────┬────────┐
│ 长度区间        │ QA F1  │ 摘要R  │
├─────────────────┼────────┼────────┤
│ <8K             │ 85.2%  │ 42.1%  │
│ 8K-32K          │ 83.7%  │ 40.8%  │
│ 32K-100K        │ 79.1%  │ 38.5%  │
│ 100K-200K       │ 71.3%  │ 34.2%  │
└─────────────────┴────────┴────────┘

关键发现:
1. 所有模型在超长上下文上性能下降
2. 摘要任务下降更明显
3. Claude 3.5 在长上下文上最稳定
"""
```

### 8.4 自定义评估流程

```python
"""
完整的评估流水线
"""

class LongContextEvaluationPipeline:
    """长上下文评估流水线"""
    
    def __init__(self, model, config: dict):
        self.model = model
        self.config = config
        
        # 初始化评估器
        self.longbench = LongBenchEvaluator(model, config["tokenizer"])
        self.leval = LEvalEvaluator(model, config.get("judge_model"))
    
    def run_full_evaluation(self) -> dict:
        """运行完整评估"""
        results = {}
        
        # 1. Needle in Haystack 测试
        results["needle"] = self._run_needle_test()
        
        # 2. LongBench 测试
        results["longbench"] = self._run_longbench()
        
        # 3. L-Eval 测试
        results["leval"] = self._run_leval()
        
        # 4. 长度分析
        results["length_analysis"] = self._analyze_length_performance()
        
        return results
    
    def _run_needle_test(self) -> dict:
        """大海捞针测试"""
        depths = [0, 10, 20, 30, 50, 70, 90, 100]  # 百分比深度
        lengths = [4000, 8000, 16000, 32000, 64000, 128000]
        
        results = {}
        
        for length in lengths:
            results[length] = {}
            for depth in depths:
                # 在指定深度插入"针"
                needle = "The secret password is: XyZ123"
                context = self._generate_haystack(length, needle, depth)
                
                # 提问
                query = "What is the secret password?"
                answer = self.model.generate(f"{context}\n\n{query}")
                
                # 检查是否正确找到
                success = "XyZ123" in answer
                results[length][depth] = success
        
        return results
    
    def _generate_haystack(
        self, 
        length: int, 
        needle: str, 
        depth_pct: int
    ) -> str:
        """生成"草堆"，在指定位置插入"针""""
        # 生成无关文本
        haystack = "This is irrelevant content. " * (length // 10)
        
        # 计算插入位置
        position = int(len(haystack) * depth_pct / 100)
        
        # 插入针
        return haystack[:position] + f"\n{needle}\n" + haystack[position:]
    
    def generate_report(self, results: dict) -> str:
        """生成评估报告"""
        report = []
        report.append("# 长上下文评估报告\n")
        
        # Needle 测试结果
        report.append("## Needle in Haystack 测试\n")
        report.append("| 长度 | 平均准确率 |")
        
        for length, depth_results in results["needle"].items():
            avg = sum(depth_results.values()) / len(depth_results)
            report.append(f"| {length} | {avg:.1%} |")
        
        # LongBench 结果
        report.append("\n## LongBench 测试\n")
        for task, score in results["longbench"].items():
            report.append(f"- {task}: {score:.2f}")
        
        return "\n".join(report)
```

---

## 9. 最佳实践总结

### 9.1 技术选型指南

| 场景 | 推荐技术 | 理由 |
|-----|---------|------|
| **<32K** | 标准 Flash Attention 2 | 成本低，效果好 |
| **32K-128K** | Ring Attention + KV 压缩 | 平衡显存和性能 |
| **128K-1M** | Ring Attention + H2O 压缩 | 必须压缩 |
| **>1M** | 稀疏注意力 + 上下文压缩 | 唯一可行方案 |

### 9.2 实施清单

```markdown
长上下文部署清单:

□ 模型选择
  □ 确认模型支持的目标上下文长度
  □ 评估位置编码外推能力
  □ 测试 Needle in Haystack 性能

□ 硬件评估
  □ 计算所需 KV Cache 大小
  □ 评估是否需要分布式推理
  □ 确定是否需要 KV 压缩

□ 优化配置
  □ 配置 Flash Attention / Ring Attention
  □ 设置 KV Cache 压缩策略
  □ 调整位置编码外推参数

□ 测试验证
  □ 运行 LongBench 评估
  □ 测试真实场景任务
  □ 监控延迟和成本

□ 监控告警
  □ 设置上下文利用率监控
  □ 配置延迟告警阈值
  □ 建立成本追踪机制
```

---

## 10. 参考资源

### 论文
- [Flash Attention](https://arxiv.org/abs/2205.14135)
- [Longformer](https://arxiv.org/abs/2004.05150)
- [RoPE](https://arxiv.org/abs/2104.09864)
- [Ring Attention](https://arxiv.org/abs/2310.01889)
- [H2O](https://arxiv.org/abs/2306.14048)
- [StreamingLLM](https://arxiv.org/abs/2309.17453)
- [YaRN](https://arxiv.org/abs/2309.00071)
- [LongBench](https://arxiv.org/abs/2308.14508)

### 技术博客
- [Google Gemini 1.5 Context](https://blog.google/technology/ai/gemini-pro-1-5/)
- [Anthropic Context Windows](https://www.anthropic.com/news/context-windows)
- [vLLM Long Context](https://vllm.readthedocs.io/en/latest/automatic_prefix_caching.html)

### 开源工具
- [vLLM](https://github.com/vllm-project/vllm) - 高性能推理
- [FlashAttention](https://github.com/Dao-AILab/flash-attention) - 注意力优化
- [LongBench](https://github.com/THUDM/LongBench) - 评估基准

---

*Last updated: 2026-04-13*

## Related

- [[05_NLP_LLMs/Fine_tuning_Techniques/Axolotl_Deep_Dive.md|Axolotl_Deep_Dive]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques.md|Fine_tuning_Techniques]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md|Fine_tuning_Techniques_for_dummy]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/Model_Merging_2026.md|Model_Merging_2026]]
- [[05_NLP_LLMs/Fine_tuning_Techniques/PEFT_2026/PEFT_2026.md|PEFT_2026]]
