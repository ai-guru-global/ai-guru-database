---
title: '大语言模型架构 (LLM Architectures)'
category: '05-nlp-llms-llm-architectures'
tags: ["nlp", "llm", "transformer", "gpt", "bert"]
summary: '> **一句话理解**: 大语言模型就像不同设计理念的"超级大脑"——有的专注理解(BERT),有的擅长创作(GPT),有的是全能选手(T5),还有的像"专家团队"(MoE),各有所长但都基于 Transformer 这一核心架构。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Llm Architectures"
  - "LLM Architectures"
  - LLM_Architectures
  - "LLM Architectures for dummy"
  - LLM_Architectures_for_dummy
sources: []

name_zh: "大语言模型架构"
---
# 大语言模型架构 (LLM Architectures)

> 中文简称：大语言模型架构

> **一句话理解**: 大语言模型就像不同设计理念的"超级大脑"——有的专注理解(BERT),有的擅长创作(GPT),有的是全能选手(T5),还有的像"专家团队"(MoE),各有所长但都基于 Transformer 这一核心架构。

## 1. 概述 (Overview)

大语言模型 (Large Language Models, LLMs) 是指参数量在数十亿到数千亿级别的预训练语言模型。自 2018 年 BERT 和 GPT 问世以来,LLM 经历了爆发式发展,在几乎所有 NLP 任务上都达到了前所未有的性能。

### 发展历程时间线

```
2017: Transformer 架构提出
2018: BERT (Encoder-only) & GPT-1 (Decoder-only) 问世
2019: GPT-2 (1.5B), T5 (Encoder-Decoder), RoBERTa
2020: GPT-3 (175B) 展示少样本学习能力
2021: DALL-E, Codex, Gopher
2022: ChatGPT 引发现象级关注, PaLM (540B)
2023: LLaMA 开源, GPT-4 多模态, Claude 2, Llama 2
2024: Gemini 1.5 (1M context), Mixtral 8x22B (MoE)
2025: DeepSeek-V3, Qwen 2.5, Llama 3.x 持续演进
2026: GPT-5.2, Claude 4.5, Gemini 3, Llama 4, 推理模型 + Agent 架构成为主流
```

### 三大核心架构范式

| 范式 | 注意力模式 | 训练目标 | 代表模型 | 主要用途 |
|------|----------|---------|---------|---------|
| **Encoder-only** | 双向 (Bidirectional) | Masked LM (MLM) | BERT, RoBERTa | 文本理解、分类、NER |
| **Decoder-only** | 单向 (Causal/Autoregressive) | 因果语言建模 (CLM) | GPT-3/4, LLaMA, PaLM | 文本生成、对话 |
| **Encoder-Decoder** | Encoder 双向 + Decoder 单向 | Seq2Seq, Span Corruption | T5, BART | 翻译、摘要、问答 |

**当前趋势**: Decoder-only 架构成为绝对主流,因为:
1. 架构简单,易于扩展到超大规模 (1000B+)
2. 预训练数据丰富 (任何文本都可用)
3. 指令微调后可适应各种任务
4. 少样本学习能力强

---

## 2. 核心概念 (Core Concepts)

### 2.1 Decoder-only 架构详解

#### 训练目标: 因果语言建模 (Causal Language Modeling)

给定序列 $x_1, x_2, ..., x_T$,模型通过最大化条件概率进行训练:

$$
\mathcal{L} = -\sum_{t=1}^{T} \log P(x_t | x_1, ..., x_{t-1}; \theta)
$$

**直觉**: 预测下一个词,每次只能看到前面的内容 (因果性)。

#### 架构示意图

```
Input: "The cat sat on"
         ↓ Tokenization
     [The] [cat] [sat] [on]
         ↓ Embedding + Position
     ┌────────────────────┐
     │  Decoder Layer 1   │
     │ ┌────────────────┐ │
     │ │ Causal Self-   │ │  ← Masked Attention (看不到未来)
     │ │   Attention    │ │
     │ └────────────────┘ │
     │ ┌────────────────┐ │
     │ │  Feed Forward  │ │
     │ └────────────────┘ │
     └────────────────────┘
            ...
     ┌────────────────────┐
     │  Decoder Layer N   │
     └────────────────────┘
            ↓
      Linear + Softmax
            ↓
    Predict: "the" (next token)
```

**关键特性**:
- **Causal Mask**: 位置 i 只能看到位置 ≤ i 的内容
- **自回归生成**: 逐个生成 token,前一个的输出作为后一个的输入

### 2.2 主流 LLM 特性对比矩阵 (2026年更新)

| 模型 | 参数量 | 架构 | 上下文长度 | 特色技术 | 开源情况 | 适用场景 |
|------|--------|------|----------|---------|---------|---------|
| **GPT-5.2 Pro** | ~2T (MoE) | Decoder-only | 200K | Dynamic Reasoning, Multimodal | ❌ 闭源 | 复杂推理、代码生成、研究 |
| **Claude 4.5 Opus** | 未公开 | Decoder-only | 1M | Hybrid Reasoning, Extended Thinking | ❌ 闭源 | 企业级安全、代码架构 |
| **Gemini 3 Pro** | 未公开 | Sparse MoE | 1M | Native Multimodal, Federated Learning | ❌ 闭源 | 长文档分析、视频理解 |
| **Llama 4 Scout** | 109B (17B激活) | Dense | **10M** | Ultra-Long Context, IRoPE | ✅ 开源 | 大规模数据处理、RAG |
| **Llama 4 Maverick** | 400B (17B激活) | MoE | 1M | MoE Routing, Multilingual | ✅ 开源 | 通用对话、代码生成 |
| **DeepSeek-V3.2** | 671B (37B激活) | MoE | 256K | MTP, FP8训练 | ✅ 开源 | 数学推理、中文场景 |
| **Kimi K2** | 1T (32B激活) | MoE | 256K | 100 Mini-Agents并行 | ✅ 开源 | 长文本、复杂研究 |
| **Qwen 3 72B** | 72B | Dense | 128K | Multilingual, CodeQwen | ✅ 开源 | 多语言、中文优化 |

**2026年趋势**: 
- **推理模型成为标配**: GPT-5.2、Claude 4.5、Gemini 3均支持动态深度思考
- **上下文窗口竞赛**: Llama 4 Scout达1000万token，可处理整代码库
- **MoE架构普及**: 主流开源模型均采用MoE，推理成本降低5-10倍
- **Agent原生设计**: 模型内置工具调用、多轮规划能力

**参数量说明**:
- **Dense 模型**: 所有参数都参与计算 (如 LLaMA)
- **MoE 模型**: 总参数很大,但每次前向传播只激活一部分 (如 DeepSeek-V3 激活 5.5%)

### 2.3 混合专家模型 (Mixture of Experts, MoE)

#### 核心思想

将 Feed-Forward 层替换为多个"专家"网络,每次只激活其中少数几个,实现**参数规模 ↑ 但计算量 →**。

#### 架构图

```
        Input (from Attention)
              ↓
        ┌──────────┐
        │  Router  │  ← 可学习的路由网络
        └──────────┘
              ↓
    (计算每个专家的得分)
              ↓
    ┌─────────┴─────────┐
    │   Top-K Selection  │  ← 选择得分最高的 K 个专家
    └─────────┬─────────┘
              ↓
    ┌──────┬──────┬──────┬──────┐
    │Expert│Expert│Expert│Expert│
    │  1   │  2   │  3   │ ...N │  ← N 个 FFN 专家 (通常 8-64 个)
    └───┬──┴───┬──┴──────┴──────┘
        │      │
        │      │ (只激活 Top-K,如 K=2)
        ↓      ↓
      Output = w₁·Expert₁(x) + w₂·Expert₂(x)
```

#### 路由机制详解

**1. Top-K Gating (最常见)**

```python
# 简化版路由代码
def moe_forward(x, experts, router):
    # x: (batch, seq_len, d_model)
    # experts: list of N FFN modules
    
    # 计算路由得分
    router_logits = router(x)  # (batch, seq_len, num_experts)
    router_probs = softmax(router_logits, dim=-1)
    
    # 选择 Top-K 专家
    topk_probs, topk_indices = torch.topk(router_probs, k=2, dim=-1)
    topk_probs = topk_probs / topk_probs.sum(dim=-1, keepdim=True)  # 重新归一化
    
    # 专家计算 (稀疏混合)
    output = 0
    for i in range(2):
        expert_idx = topk_indices[:, :, i]
        expert_weight = topk_probs[:, :, i:i+1]
        expert_output = experts[expert_idx](x)
        output += expert_weight * expert_output
    
    return output
```

**2. Expert Choice (新型路由)**

不是 token 选专家,而是**专家选 token**:
- 每个专家选择自己最关注的 K 个 token 进行处理
- 避免负载不均衡问题

#### MoE 的优缺点对比

| 优点 ✅ | 缺点 ❌ |
|---------|---------|
| 参数量可达 Dense 模型 10× | 通信开销大 (需在专家间路由) |
| 计算成本接近小模型 | 负载不均衡 (某些专家可能很少激活) |
| 不同专家可学习不同领域知识 | 显存占用仍较高 (需存储所有专家) |
| 推理吞吐量高 (激活参数少) | 训练不稳定 (路由机制需精心设计) |

### 2.4 Scaling Laws (扩展定律)

#### Chinchilla 最优比例

2022 年 DeepMind 发现: 给定计算预算,**模型参数量和训练数据量应同步增长**。

**经验公式** (Hoffmann et al., 2022):

$$
N_{opt} \approx 0.5 \times C^{0.5}
$$
$$
D_{opt} \approx 10 \times C^{0.5}
$$

其中:
- $N_{opt}$: 最优参数量 (单位: 十亿)
- $D_{opt}$: 最优训练 token 数 (单位: 十亿)
- $C$: 计算预算 (单位: FLOPs)

**关键结论**:
- 对于 70B 模型,至少需要 1.4T tokens (GPT-3 只用了 300B,欠训练)
- LLaMA/LLaMA-2 严格遵循 Chinchilla 比例,效果优于同等规模的 GPT-3

#### 损失预测公式

训练损失 L 与模型大小 N、数据量 D、计算量 C 的关系:

$$
L(N, D) = A \cdot N^{-\alpha} + B \cdot D^{-\beta} + L_{\infty}
$$

典型值: $\alpha \approx 0.076$, $\beta \approx 0.103$

**实际意义**:
- 可预测不同配置的最终性能
- 指导计算资源分配 (更大模型 vs 更多数据)

---

### 2.5 2026 年模型架构新趋势

#### 推理模型 (Reasoning Models) - 架构新范式

2026 年最大变革：**模型不再是"一次性"生成答案，而是能够进行多步思考**。

```
传统模型: 输入 → [模型] → 输出
                  ↓
推理模型: 输入 → [思考链] → [验证] → [再思考] → 输出
                  ↑_________|←_________|
                    (可配置迭代次数)
```

**代表模型特性**:

| 模型 | 推理模式 | 特点 |
|------|----------|------|
| **GPT-5.2** | Dynamic Reasoning | 自动判断思考深度，简单问题快速回答，复杂问题深度推理 |
| **Claude 4.5** | Extended Thinking | 显式"思考模式"开关，用户控制思考预算 |
| **Gemini 3** | Thinking Model | 动态分配计算资源到推理路径 |
| **DeepSeek-R1** | Pure RL Reasoning | 纯强化学习训练的思维链 |

**技术实现**:
- 训练时加入 **Chain-of-Thought (CoT)** 数据
- 推理时使用 **Test-Time Compute Scaling** - 投入更多计算换取更好答案
- **Self-Consistency**: 多次采样，投票选出最佳答案

#### 超长上下文架构 (Million-Token Context)

Llama 4 Scout 实现 **1000 万 token** 上下文的架构创新：

```
传统 Attention: O(n²) 复杂度 → 1M token = 计算爆炸

Llama 4 方案:
1. 分层注意力: Local (4K) + Global (压缩表征)
2. 渐进式编码: 早期层处理细粒度，深层处理粗粒度
3. IRoPE (Interleaved RoPE): 位置编码外推到10M
```

**应用场景**:
- 整代码库分析 (大型项目)
- 长篇小说理解与生成
- 多文档法律合同审查

#### 多模态原生架构

2026 年模型不再是"文本+视觉适配器"，而是**真正的多模态原生**：

```
传统架构: 图像 → [ViT] → 视觉token → [文本LLM] → 输出
                                ↑ 后期拼接

2026架构:  文本token ──┐
                       ├──→ [统一Transformer] → 输出
          图像patch ───┤     (所有模态早期融合)
          音频帧 ──────┘
```

**Gemini 3 / GPT-4o 架构特点**:
- 任何模态都可以作为输入或输出
- 模态间无缝转换 (文本描述图像 → 图像生成 → 视频生成)
- 统一 Tokenizer 处理文本和图像 token

#### Agent 原生架构支持

2026 年模型内置 Agent 能力，无需额外框架：

| 能力 | 传统实现 | 2026 原生支持 |
|------|----------|-------------|
| 工具调用 | 通过 Prompt 工程 | 专门 Tool-Use 训练数据 |
| 规划能力 | 外部 Planner | 内置 Multi-Step Planning |
| 记忆管理 | 外部 Vector DB | 内置 Long-term Memory 机制 |
| 代码执行 | 沙箱环境 | 内置 Code Interpreter 模式 |

---

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 上下文窗口扩展技术

原始 Transformer 的位置编码限制了最大序列长度,扩展上下文窗口需要特殊技术。

| 方法 | 原理 | 优点 | 缺点 | 代表模型 |
|------|------|------|------|----------|
| **线性插值** | 将位置缩放到 [0, L_old] | 简单 | 破坏相对位置信息 | - |
| **NTK-Aware Scaling** | 修改 RoPE 的频率基数 $\theta$ | 外推性好 | 需要继续预训练 | Code Llama |
| **YaRN** | 动态插值 + 高频截断 | 精度高,微调成本低 | 实现复杂 | - |
| **ALiBi** | 线性位置偏置,天然支持外推 | 无需位置编码 | 短距离精度略降 | BLOOM, MPT |
| **Sliding Window** | 只关注最近 W 个 token | 内存固定 | 长距离依赖丢失 | Mistral, Longformer |

#### YaRN (Yet another RoPE extensioN) 示意

```
原始 RoPE:         θ = [10000, 10000^(2/d), ..., 10000^((d-2)/d)]
                   (低频)                           (高频)

YaRN:  1. 低频部分 (长距离信息): 线性插值
       2. 高频部分 (短距离信息): 保持不变
       3. 中间部分: 平滑过渡

效果: 可将 4K 扩展至 128K,仅需 <1B tokens 微调
```

### 3.2 Grouped-Query Attention (GQA)

Multi-Head Attention (MHA) 的 KV Cache 占用过大,Multi-Query Attention (MQA) 虽节省内存但牺牲精度,GQA 是二者的折衷。

```
MHA (Multi-Head Attention):
  每个头有独立的 Q, K, V
  ┌───┐ ┌───┐ ┌───┐ ┌───┐
  │Q₁ │ │Q₂ │ │Q₃ │ │Q₄ │
  │K₁ │ │K₂ │ │K₃ │ │K₄ │  ← 4 组 KV
  │V₁ │ │V₂ │ │V₃ │ │V₄ │
  └───┘ └───┘ └───┘ └───┘

MQA (Multi-Query Attention):
  所有头共享一组 K, V
  ┌───┐ ┌───┐ ┌───┐ ┌───┐
  │Q₁ │ │Q₂ │ │Q₃ │ │Q₄ │
  └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘
    └─────┴─────┴─────┘
         ┌───┐
         │ K │  ← 1 组 KV (内存减少 4×)
         │ V │
         └───┘

GQA (Grouped-Query Attention):
  头分组,组内共享 K, V
  ┌───┐ ┌───┐ ┌───┐ ┌───┐
  │Q₁ │ │Q₂ │ │Q₃ │ │Q₄ │
  └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘
    │       │     │       │
    │  Group 1   │  Group 2
    ▼       ▼     ▼       ▼
  ┌───┐       ┌───┐
  │K₁ │       │K₂ │  ← 2 组 KV (平衡内存与精度)
  │V₁ │       │V₂ │
  └───┘       └───┘
```

**LLaMA 2 配置**: 32 个头,8 组 → 每组 4 个头共享 KV

### 3.3 模型参数量与显存估算

#### 参数存储占用

假设模型有 N 个参数:
- **FP32**: 4 bytes/param → 4N bytes
- **FP16/BF16**: 2 bytes/param → 2N bytes
- **INT8**: 1 byte/param → N bytes
- **INT4**: 0.5 byte/param → 0.5N bytes

**例**: LLaMA-70B 用 BF16 存储 → $70 \times 10^9 \times 2 = 140$ GB

#### 训练显存估算 (Adam 优化器)

```
总显存 = 模型参数 + 梯度 + 优化器状态 + 激活值
       = 2N (FP16模型) + 2N (梯度) + 12N (Adam) + Activations
       ≈ 16N + Activations
```

对于 70B 模型:
- 基础: $16 \times 70 = 1120$ GB
- 激活值 (batch_size=1, seq_len=2048): ~20 GB/层 → 640 GB
- **总计**: ~1.76 TB → 需要 8×A100 (80GB) 以上

**优化技巧**:
- **梯度检查点 (Gradient Checkpointing)**: 激活值降低 5-10×,但速度减慢 20%
- **ZeRO (Zero Redundancy Optimizer)**: 跨 GPU 分割优化器状态
- **8-bit Adam**: 优化器状态从 12N → 2N

#### 推理显存估算

```
推理显存 = 模型参数 + KV Cache
```

以 LLaMA-70B 为例 (BF16):
- 模型: 140 GB
- KV Cache (seq_len=2048, batch_size=1):
  $2 \times 80层 \times 8192维 \times 2048长度 \times 2字节 \approx 5$ GB
- **总计**: ~145 GB → 需要 2×A100 (80GB)

---

## 4. 代码实战 (Hands-on Code)

### 从零实现 Decoder-only Transformer Block (PyTorch)

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class DecoderBlock(nn.Module):
    """标准 Decoder-only Transformer Block"""
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        # Multi-Head Self-Attention
        self.self_attn = nn.MultiheadAttention(
            d_model, num_heads, dropout=dropout, batch_first=True
        )
        self.norm1 = nn.LayerNorm(d_model)
        
        # Feed-Forward Network
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),  # GPT 使用 GELU 而非 ReLU
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )
        self.norm2 = nn.LayerNorm(d_model)
        
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        """
        Args:
            x: (batch, seq_len, d_model)
            mask: causal mask (seq_len, seq_len)
        """
        # Self-Attention with Pre-Norm (GPT-2 style)
        residual = x
        x = self.norm1(x)
        attn_output, _ = self.self_attn(x, x, x, attn_mask=mask, need_weights=False)
        x = residual + self.dropout(attn_output)
        
        # Feed-Forward Network
        residual = x
        x = self.norm2(x)
        x = residual + self.ffn(x)
        
        return x

class GPTModel(nn.Module):
    """简化版 GPT 模型"""
    def __init__(self, vocab_size, d_model, num_heads, num_layers, max_len=1024):
        super().__init__()
        self.token_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(max_len, d_model)
        
        self.layers = nn.ModuleList([
            DecoderBlock(d_model, num_heads, d_ff=4*d_model)
            for _ in range(num_layers)
        ])
        
        self.ln_f = nn.LayerNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
        
        # 权重共享 (Tie Weights)
        self.lm_head.weight = self.token_emb.weight
        
    def forward(self, input_ids):
        """
        Args:
            input_ids: (batch, seq_len)
        Returns:
            logits: (batch, seq_len, vocab_size)
        """
        batch_size, seq_len = input_ids.shape
        
        # Embedding
        positions = torch.arange(seq_len, device=input_ids.device).unsqueeze(0)
        x = self.token_emb(input_ids) + self.pos_emb(positions)
        
        # Causal Mask (上三角为 -inf)
        mask = torch.triu(torch.full((seq_len, seq_len), float('-inf')), diagonal=1)
        mask = mask.to(x.device)
        
        # Transformer Layers
        for layer in self.layers:
            x = layer(x, mask)
        
        x = self.ln_f(x)
        logits = self.lm_head(x)
        
        return logits
    
    @torch.no_grad()
    def generate(self, input_ids, max_new_tokens=50, temperature=1.0, top_k=None):
        """自回归生成"""
        for _ in range(max_new_tokens):
            # 前向传播
            logits = self(input_ids)  # (batch, seq_len, vocab_size)
            logits = logits[:, -1, :] / temperature  # 只取最后一个 token
            
            # Top-K 采样
            if top_k is not None:
                v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
                logits[logits < v[:, [-1]]] = float('-inf')
            
            probs = F.softmax(logits, dim=-1)
            next_token = torch.multinomial(probs, num_samples=1)
            
            # 拼接
            input_ids = torch.cat([input_ids, next_token], dim=1)
        
        return input_ids

# 测试代码
if __name__ == "__main__":
    vocab_size = 50257  # GPT-2 词表大小
    model = GPTModel(vocab_size, d_model=768, num_heads=12, num_layers=12)
    
    # 随机输入
    input_ids = torch.randint(0, vocab_size, (2, 10))
    logits = model(input_ids)
    print(f"Input shape: {input_ids.shape}")
    print(f"Output logits shape: {logits.shape}")
    
    # 生成测试
    generated = model.generate(input_ids, max_new_tokens=20)
    print(f"Generated sequence length: {generated.shape[1]}")
```

---

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 对话系统 (Conversational AI)
- **代表**: ChatGPT, Claude, Gemini
- **技术**: Decoder-only + RLHF 对齐

### 5.2 代码生成 (Code Generation)
- **代表**: GitHub Copilot (Codex), Cursor (GPT-4), Replit Ghostwriter
- **技术**: 代码数据预训练 + Fill-in-the-Middle 训练目标

### 5.3 文档理解与问答
- **代表**: RAG 系统 (Retrieval-Augmented Generation)
- **技术**: Encoder 编码文档 + Decoder 生成答案

### 5.4 多语言翻译
- **传统方案**: Encoder-Decoder (T5, mBART)
- **新趋势**: Decoder-only 通过指令微调实现 (GPT-4, PaLM)

### 5.5 多模态应用
- **GPT-4V**: 图像理解 + 文本生成
- **Gemini**: 原生多模态 (文本/图像/音频/视频)

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 训练稳定性技巧

| 问题 | 解决方案 | 原理 |
|------|---------|------|
| 梯度爆炸 | 梯度裁剪 (Gradient Clipping) | 限制梯度 L2 范数 ≤ 阈值 |
| 损失突刺 (Loss Spike) | Warmup + 学习率衰减 | 避免初期震荡 |
| 层间信号衰减 | Pre-Norm (GPT-2/3) 而非 Post-Norm | 梯度直接回传到输入 |
| 词嵌入不稳定 | 权重共享 (Tie Weights) | 输入/输出嵌入共享参数 |

### 6.2 推理优化前沿

- **Speculative Decoding**: 用小模型快速生成草稿,大模型并行验证,2-3× 加速
- **PagedAttention (vLLM)**: 分页管理 KV Cache,提升吞吐量
- **FlashDecoding**: 优化 KV Cache 读取,降低延迟

### 6.3 常见陷阱

1. **过拟合风险**: 超大模型仍会过拟合小数据集,需要充足的数据量
2. **幻觉问题 (Hallucination)**: 模型可能生成流畅但错误的内容,需要 Retrieval 或 Tool Use 缓解
3. **分布外泛化**: 在训练分布外的任务上表现可能骤降

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- [Transformer 革命](../03_Transformer架构/03_Transformer_Revolution.md): Self-Attention 机制
- [注意力机制](../03_Transformer架构/03_Transformer_Revolution.md): Seq2Seq Attention

### 后续推荐
- [预训练方法](../04_LLM架构/05_LLM架构.md): MLM, CLM, T5 的 Span Corruption
- [微调技术](../06_微调技术/03_微调技术.md): LoRA, RLHF
- [提示工程](../07_提示工程/16_Prompt工程.md): Few-shot, Chain-of-Thought

### 跨领域应用
- [多模态模型](04_计算机视觉/08_多模态视觉/03_多模态视觉.md): CLIP, Flamingo, GPT-4V

---

## 8. 面试高频问题 (Interview FAQs)

### Q1: 为什么 Decoder-only 成为 LLM 主流架构?

**答**:
1. **架构简单**: 只需堆叠 Decoder 层,易于扩展到千亿参数
2. **预训练数据丰富**: 任何文本都可用 (无需成对数据如翻译)
3. **统一训练目标**: 因果语言建模简单高效
4. **少样本学习能力强**: 自回归生成天然支持 In-Context Learning
5. **工程成熟度高**: 推理优化 (KV Cache) 更简单

相比之下,Encoder-Decoder 需要设计复杂的预训练任务 (如 T5 的 Span Corruption),且推理时需要两遍前向传播。

### Q2: MoE 和 Dense 模型的区别?

| 维度 | Dense 模型 | MoE 模型 |
|------|-----------|---------|
| **参数激活** | 全部参数参与计算 | 只激活部分专家 (~10-20%) |
| **计算效率** | FLOPs 与参数量成正比 | FLOPs 远小于总参数量 |
| **训练复杂度** | 简单 | 需设计路由机制,负载均衡 |
| **推理吞吐** | 低 | 高 (激活参数少) |
| **显存占用** | 中 | 高 (需存储所有专家) |

**何时选择 MoE?**
- 训练计算预算有限,但可接受更高显存
- 需要处理多领域/多语言任务 (不同专家专攻不同领域)

### Q3: 如何选择 LLM 的上下文长度?

**考量因素**:
1. **任务需求**: 文档问答需要长上下文 (32K+),对话通常 4K 够用
2. **显存限制**: 上下文长度 ↑ → KV Cache ↑ (线性增长)
3. **精度权衡**: 过长上下文可能导致"中间遗忘" (Lost in the Middle)

**经验法则**:
- 通用对话: 4K-8K
- 代码生成: 16K-32K
- 文档分析: 64K-128K
- 超长上下文 (1M): 需要专门技术 (如 Gemini 1.5 的 Mixture of Depths)

### Q4: 模型参数量和效果的关系?

**Scaling Laws 表明**:
- 在合理训练的前提下,模型越大效果越好 (对数关系)
- 但边际收益递减: 7B → 13B 提升明显, 70B → 405B 提升有限

**实际选择**:
- **资源充足**: 70B-405B (SOTA 性能)
- **平衡性价比**: 7B-13B (效果好且推理快,适合产品)
- **边缘部署**: 1B-3B (量化后可在手机运行)

### Q5: 如何估算训练一个 LLM 的成本?

**计算量估算**:
```
FLOPs ≈ 6 × N × D
```
其中 N 是参数量, D 是训练 token 数。

**例**: 训练 LLaMA-70B (1.3T tokens)
- FLOPs: $6 \times 70B \times 1.3T = 5.46 \times 10^{23}$
- 用 A100 (312 TFLOPS): $\frac{5.46 \times 10^{23}}{312 \times 10^{12}} \approx 1.75 \times 10^9$ 秒 ≈ 55 年
- 用 2048 个 A100: 10 天
- **云服务成本**: ~$2-3 million (按 AWS 价格)

---

## 9. 参考资源 (References)

### 论文
- [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762) - Transformer 原论文
- [Language Models are Few-Shot Learners (Brown et al., 2020)](https://arxiv.org/abs/2005.14165) - GPT-3
- [LLaMA: Open and Efficient Foundation Language Models](https://arxiv.org/abs/2302.13971)
- [Training Compute-Optimal LLMs (Chinchilla)](https://arxiv.org/abs/2203.15556)
- [Mixtral of Experts](https://arxiv.org/abs/2401.04088)
- [GQA: Training Generalized Multi-Query Attention](https://arxiv.org/abs/2305.13245)

### 开源模型
- [LLaMA 4](https://github.com/meta-llama/llama-models) - 2026年发布，支持10M上下文
- [Qwen 3](https://github.com/QwenLM/Qwen3) - 阿里巴巴最新多语言模型
- [DeepSeek-V3](https://github.com/deepseek-ai/DeepSeek-V3) - MoE架构，高性价比
- [Kimi K2](https://github.com/MoonshotAI/Kimi-K2) - 1T参数MoE模型
- [Mixtral](https://huggingface.co/mistralai/Mixtral-8x22B-v0.1)

### 教程与工具
- [Hugging Face Transformers](https://huggingface.co/docs/transformers)
- [nanoGPT - Andrej Karpathy](https://github.com/karpathy/nanoGPT) - 极简 GPT 实现
- [LLM Visualization](https://bbycroft.net/llm) - 3D 可视化 LLM 推理

### 综述论文
- [A Survey of Large Language Models](https://arxiv.org/abs/2303.18223)
- [Challenges and Applications of LLMs](https://arxiv.org/abs/2307.10169)

---

*Last updated: 2026-04-01* (Added 2026 model updates: GPT-5.2, Claude 4.5, Gemini 3, Llama 4)

## 相关链接

- [[05_大模型/04_LLM架构/05_LLM架构|大语言模型架构 (小白版)]] — 本篇的零基础版本
- [[05_大模型/04_LLM架构/index|LLM 架构索引]] — LLM 架构主题导览
- [[05_大模型/04_LLM架构/06_LLM_Internals_架构|LLM 内部：架构]] — 架构内部细节深入
- [[05_大模型/03_Transformer架构/03_Transformer_Revolution|Transformer 革命]] — LLM 底层 Transformer 架构
- [[05_大模型/04_LLM架构/13_MoE_Routing_and_负载均衡|MoE 路由与负载均衡]] — MoE 架构核心机制
- [[概念/LLM/llm-architectures|LLM 架构]] — LLM 架构概念卡片
- [[05_大模型/04_LLM架构/16_Transformer_替代架构|Transformer 替代架构]] — Mamba/SSM 等替代方案
