---
title: "AI Research Engineer 面试指南"
category: "21-interviews-ai-research-engineer"
tags: ["interviews", "career", "experience", "practitioners", "research", "deep-learning", "transformer", "scaling-laws", "distributed-training", "pytorch", "jax"]
summary: "AI Research Engineer 面试全流程指南，覆盖研究系统工程化、分布式训练、PyTorch/JAX 深度使用、模型架构实现、实验框架搭建、性能优化和前沿研究复现。适用于 DeepMind、OpenAI、Anthropic、Meta FAIR 等机构的研究工程师岗位。"
created: 2026-05-31
updated: 2026-07-11
tier: supporting
aliases:
  - "AI_Research_Engineer"
  - "AI Research Engineer 面试指南"
  - "AI_Research_Engineer Interview Guide"
sources: []
name_zh: "AI Research Engineer 面试指南"
---

# AI Research Engineer 面试指南

> 中文简称：AI Research Engineer 面试指南

> **一句话理解**: AI Research Engineer 是研究想法的工程实现者——将科学家的理论构想转化为可运行、可扩展、可复现的实验系统，精通分布式训练、性能优化和大规模实验管理，是前沿 AI 研究不可或缺的工程力量。

> **与相关岗位的关系**: 本岗位侧重**研究系统的工程实现**。如果侧重纯理论研究，请参考 [[21_面试岗位/Research_Scientist/Research_Scientist|Research Scientist 面试指南]]；如果侧重 AI 算法研究本身，请参考 [[21_面试岗位/AI_Research_Scientist/AI_Research_Scientist|AI Research Scientist 面试指南]]；如果侧重业务落地，请参考 [[21_面试岗位/Applied_Scientist/Applied_Scientist|Applied Scientist 面试指南]]。

---

## Table of Contents

- [1. 岗位定位与核心职责](#1-岗位定位与核心职责)
  - [1.1 岗位定位](#11-岗位定位)
  - [1.2 核心职责](#12-核心职责)
  - [1.3 核心技能栈](#13-核心技能栈)
  - [1.4 与相近岗位的区别](#14-与相近岗位的区别)
- [2. 技术能力要求](#2-技术能力要求)
- [3. 核心知识领域](#3-核心知识领域)
- [4. 高频面试问题](#4-高频面试问题)
- [5. 系统设计题](#5-系统设计题)
- [6. 编程与实操题](#6-编程与实操题)
- [7. 备考策略与学习路径](#7-备考策略与学习路径)
- [8. 行业薪资范围参考](#8-行业薪资范围参考)
- [9. 面试 Checklist](#9-面试-checklist)
- [Related](#related)

---

## 1. 岗位定位与核心职责

### 1.1 岗位定位

AI Research Engineer（AI 研究工程师）是研究团队中的核心工程角色。在现代 AI 研究中，想法只是一部分，将想法实现为可运行的系统、在大规模数据上训练、并产出可靠结果，同样重要——甚至更重要。

AI Research Engineer 与 Research Scientist 的核心区别：
- **Research Scientist** 偏重"想"——提出新的理论和方法
- **Research Engineer** 偏重"做"——将想法高效地实现和验证

但在实际工作中，两者的界限很模糊。优秀的 Research Engineer 经常也是论文的共同作者，也会提出自己的研究想法。

AI Research Engineer 的核心价值：
- **工程深度**: 能从底层实现复杂的模型架构和训练方法
- **系统效率**: 能优化训练速度、内存使用和 GPU 利用率
- **可扩展性**: 能将单 GPU 实验扩展到多节点大规模训练
- **可复现性**: 能构建可复现的实验框架和工具
- **快速迭代**: 能帮助科学家快速实现和验证新想法

### 1.2 核心职责

| 职责领域 | 具体内容 | 交付物 |
|---------|---------|--------|
| **模型实现** | 将论文中的方法实现为可训练的代码 | 训练脚本、模型代码 |
| **分布式训练** | 实现和优化多 GPU/多节点训练 | 分布式训练框架 |
| **性能优化** | 优化训练速度、内存、GPU 利用率 | 优化报告、基准测试 |
| **实验框架** | 构建可复用的实验管理和追踪工具 | 实验框架代码 |
| **论文复现** | 复现重要论文的结果 | 复现代码、对比报告 |
| **数据处理** | 构建大规模数据预处理管道 | 数据 Pipeline |
| **工程支持** | 支持科学家的研究项目 | 技术支持、代码 Review |
| **开源维护** | 维护和贡献研究开源项目 | 开源贡献 |

### 1.3 核心技能栈

| 维度 | 关键技能 | 常见工具/框架 |
|------|---------|--------------|
| **深度学习框架** | PyTorch、JAX 的深度使用 | PyTorch, JAX, Flax, Haiku |
| **分布式训练** | DDP、FSDP、DeepSpeed、Megatron | DeepSpeed, Megatron-LM, FSDP |
| **性能优化** | 混合精度、梯度累积、激活检查点 | CUDA, NCCL, TorchCompile |
| **模型架构** | Transformer、MoE、扩散模型的实现 | 自定义实现 |
| **实验管理** | 超参数管理、实验追踪 | Hydra, W&B, MLflow |
| **数据处理** | 大规模数据处理、Tokenization | HuggingFace Datasets, Spark |
| **系统编程** | CUDA 编程、性能 Profiling | Nsight, PyTorch Profiler |
| **云计算** | 多节点训练、GPU 集群管理 | Slurm, K8s, AWS/GCP |

### 1.4 与相近岗位的区别

| 岗位 | 核心关注点 | 与 AI Research Engineer 的差异 |
|------|-----------|------------------------------|
| **Research Scientist** | 理论创新和论文发表 | 更偏"想"，RE 更偏"做" |
| **ML Engineer** | 产品模型开发 | 更偏产品，RE 更偏研究 |
| **AI Infrastructure Engineer** | GPU 集群和基础设施 | 更偏底层平台，RE 更偏模型和算法 |
| **Applied Scientist** | 研究成果落地 | 更偏业务，RE 更偏研究 |
| **MLOps Engineer** | ML 生命周期管理 | 更偏运维流程，RE 更偏实验 |

---

## 2. 技术能力要求

### 基础级 (初级 AI Research Engineer)

- **PyTorch 精通**: 理解 autograd、自定义层、DataLoader、分布式数据并行
- **模型实现**: 能从零实现 Transformer、CNN、RNN 等核心架构
- **训练基础**: 理解训练流程（前向、反向、优化器、学习率调度）
- **分布式基础**: 理解 DDP 的使用和常见问题
- **实验管理**: 会使用 W&B 或 MLflow 追踪实验
- **论文复现**: 能复现至少 2-3 篇重要论文

### 进阶级 (中级 AI Research Engineer)

- **分布式训练深度**: 能使用 FSDP/DeepSpeed/Megatron 进行大规模训练
- **性能优化**: 能分析训练瓶颈（CPU/GPU/IO/通信）并优化
- **混合精度训练**: 理解 AMP、BF16、FP8 的使用和原理
- **自定义 CUDA**: 能编写简单的 CUDA Kernel 或使用 Triton
- **实验框架**: 能为公司/团队构建可复用的实验框架
- **前沿跟踪**: 能快速学习和实现最新的训练技术

### 专家级 (高级 AI Research Engineer)

- **训练系统架构**: 能设计支持千卡级别训练的系统架构
- **极致优化**: 能将训练吞吐提升 2-10 倍
- **跨框架**: 精通 PyTorch 和 JAX，能在两者间迁移
- **研究贡献**: 有论文发表或开源项目贡献
- **团队指导**: 能指导初级工程师，建立工程最佳实践

---

## 3. 核心知识领域

### 3.1 PyTorch 深度使用

**核心主题**:
- **Autograd**: 自定义反向传播、梯度钩子、计算图操作
- **自定义 Module**: 复杂模型组件的实现
- **DataLoader**: 自定义数据集、数据加载优化
- **DistributedDataParallel**: 多 GPU 训练的正确使用
- **torch.compile**: 图编译优化
- **Profiler**: 性能分析和瓶颈定位
- **Memory Management**: 显存管理、垃圾回收

### 3.2 分布式训练

**核心主题**:
- **数据并行（DDP）**: 每张卡完整模型副本，数据分片
- **完全分片数据并行（FSDP）**: 模型参数/梯度/优化器状态分片到各卡
- **ZeRO 优化**: DeepSpeed 的 ZeRO-1/2/3
- **模型并行**: 
  - 张量并行（TP）: Megatron-LM 的矩阵分块
  - 流水线并行（PP）: GPipe/PipeDream 的层间分片
- **3D 并行**: DP + TP + PP 的组合
- **集合通信**: All-Reduce, All-Gather, Reduce-Scatter 的理解和优化
- **NCCL**: GPU 间通信库的原理和调优

### 3.3 训练优化技术

**核心主题**:
- **混合精度训练**: FP16/BF16/FP8 的原理和使用
- **Loss Scaling**: FP16 训练中的梯度缩放
- **梯度累积**: 小 Batch Size 模拟大 Batch
- **激活检查点（Gradient Checkpointing）**: 用计算换内存
- **Flash Attention**: IO-aware 的注意力优化
- **梯度预计算**: Overlap 计算和通信
- **数据预取**: 减少 IO 等待

### 3.4 模型架构实现

**核心主题**:
- **Transformer**: Encoder、Decoder、Encoder-Decoder 的实现
- **MoE**: Mixture of Experts 的路由和负载均衡实现
- **扩散模型**: DDPM/DDIM/Flow Matching 的实现
- **多模态**: CLIP、LLaVA 等视觉-语言模型的实现
- ** normalization**: BatchNorm/LayerNorm/RMSNorm 的区别和实现
- **位置编码**: 绝对/相对/RoPE/ALiBi 的实现

### 3.5 实验框架设计

**核心主题**:
- **配置管理**: Hydra、YAML 配置、命令行覆盖
- **实验追踪**: W&B、MLflow、TensorBoard
- **检查点管理**: 模型保存/恢复、训练恢复
- **超参数搜索**: Ray Tune、Optuna
- **可复现性**: 随机种子、数据顺序、环境快照
- **分布式调度**: Slurm、Kubernetes 上的多实验管理

### 3.6 数据工程

**核心主题**:
- **Tokenization**: BPE、SentencePiece 的原理和使用
- **数据预处理**: 大规模文本清洗、去重、质量过滤
- **数据加载**: 高效的流式数据加载（避免全部加载到内存）
- **数据增强**: 文本/图像的增强策略
- **数据混合**: 多数据源的混合采样策略

### 3.7 前沿训练方法

**核心主题**:
- **预训练**: Language Modeling、Masked Modeling 的实现
- **Fine-tuning**: LoRA/QLoRA/Full Fine-tuning 的实现
- **RLHF**: PPO-based RLHF 的完整实现
- **DPO**: 直接偏好优化的实现
- **推理优化**: KV Cache、Speculative Decoding
- **多模态训练**: 图文对齐、视频理解

---

## 4. 高频面试问题

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

### 4.1 深度学习工程 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 解释 PyTorch 的 autograd 机制。如何自定义反向传播？ | ⭐⭐ | 🔴 |
| 2 | DDP 和 FSDP 的区别？什么场景下选择哪个？ | ⭐⭐ | 🔴 |
| 3 | 混合精度训练的原理？Loss Scaling 为什么必要？ | ⭐⭐ | 🔴 |
| 4 | 激活检查点（Gradient Checkpointing）如何节省显存？代价是什么？ | ⭐⭐ | 🟡 |
| 5 | Flash Attention 的原理？为什么能大幅加速？ | ⭐⭐⭐ | 🟡 |
| 6 | 如何定位训练中的 GPU 利用率低的问题？ | ⭐⭐ | 🔴 |
| 7 | 如何处理训练中的 OOM（显存不足）？列出至少 5 种方法 | ⭐ | 🔴 |
| 8 | torch.compile 的原理和适用场景？ | ⭐⭐ | 🟡 |

### 4.2 分布式训练 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 9 | 解释 All-Reduce 的原理。Ring All-Reduce 的通信复杂度？ | ⭐⭐ | 🔴 |
| 10 | 数据并行、张量并行、流水线并行各自适合什么场景？ | ⭐⭐ | 🔴 |
| 11 | DeepSpeed ZeRO-1/2/3 分别优化了什么？ | ⭐⭐ | 🔴 |
| 12 | 如何设计一个 3D 并行（DP+TP+PP）的训练方案？ | ⭐⭐⭐ | 🟡 |
| 13 | 分布式训练中的通信瓶颈如何定位和优化？ | ⭐⭐⭐ | 🟡 |
| 14 | 梯度累积为什么不能完全等价于大 Batch？ | ⭐⭐ | 🟡 |
| 15 | 如何在训练中实现计算和通信的 Overlap？ | ⭐⭐⭐ | 🟢 |

### 4.3 模型实现 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 16 | 从零实现 Multi-Head Attention（含 Causal Mask） | ⭐⭐ | 🔴 |
| 17 | MoE 的路由机制如何实现？如何保证负载均衡？ | ⭐⭐⭐ | 🟡 |
| 18 | RoPE（Rotary Position Embedding）的实现和原理？ | ⭐⭐ | 🟡 |
| 19 | RMSNorm 和 LayerNorm 的区别？为什么 LLM 用 RMSNorm？ | ⭐ | 🟡 |
| 20 | 扩散模型的前向加噪和反向去噪如何实现？ | ⭐⭐⭐ | 🟢 |

### 4.4 实验与研究工程 (4 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 21 | 如何设计一个支持大规模实验管理的框架？ | ⭐⭐ | 🟡 |
| 22 | 如何保证实验的可复现性？需要注意哪些方面？ | ⭐ | 🟡 |
| 23 | 如何在多节点集群上高效管理和调度多个实验？ | ⭐⭐ | 🟡 |
| 24 | 你如何快速复现一篇新论文的核心实验？ | ⭐ | 🟡 |

### 4.5 行为面试 (4 题)

| # | 问题 | 频率 |
|---|------|------|
| 25 | 描述一个你实现复杂训练系统或优化训练性能的经历 | 🔴 |
| 26 | 你和 Research Scientist 在方法实现上有分歧时如何处理？ | 🟡 |
| 27 | 你如何快速学习并实现一个新的研究方法？ | 🟡 |
| 28 | 描述一个你帮助研究团队加速实验迭代的经历 | 🟡 |

---

## 5. 系统设计题

### 5.1 设计大规模 LLM 训练系统

**题目**: 设计一个在 256 张 GPU 上训练 70B 参数 LLM 的系统。

**考察要点**:

1. **并行策略选择**:
   - 70B 模型无法放入单 GPU → 需要模型并行
   - 方案: DP + TP + PP（3D 并行）或 FSDP
   
2. **显存估算**:
   ```
   70B 参数 × 2 bytes (BF16) = 140 GB (模型权重)
   优化器状态 (Adam): 140 GB × 2 = 280 GB
   梯度: 140 GB
   总计: ~560 GB（不含激活值）
   单 GPU (80GB) 明显不够
   ```

3. **通信优化**:
   - TP 在节点内（NVLink 高带宽）
   - DP 跨节点（InfiniBand）
   - PP 尽量减少 Bubble

4. **训练配置**:
   - Batch Size: Global BS = 节点数 × GPU/节点 × micro-batch × 梯度累积
   - 学习率: 基于全局 BS 调整
   - 精度: BF16 训练

5. **容错**:
   - Checkpoint 频率和恢复策略
   - 节点故障处理
   - 训练状态保存

### 5.2 设计实验管理框架

**考察要点**:
1. 配置管理: 声明式配置、参数覆盖
2. 实验追踪: 指标、日志、产出
3. Checkpoint 管理: 自动保存、恢复
4. 超参数搜索: 支持 Grid/Random/Bayesian
5. 分布式调度: 多实验并行管理
6. 可复现性: 环境快照、随机种子

### 5.3 设计 RLHF 训练 Pipeline

**考察要点**:
1. 阶段 1: SFT（监督微调）
2. 阶段 2: 奖励模型训练
3. 阶段 3: PPO 强化学习
4. 工程挑战: 多模型协同（Actor/Critic/Reward/Reference）、显存管理
5. 分布式策略: 不同阶段可能需要不同的并行策略

---

## 6. 编程与实操题

### 6.1 从零实现 Transformer Decoder

```python
import torch
import torch.nn as nn
import math

class RotaryPositionEmbedding:
    """RoPE 旋转位置编码。"""
    
    def __init__(self, dim, max_seq_len=4096, base=10000):
        inv_freq = 1.0 / (base ** (torch.arange(0, dim, 2).float() / dim))
        self.register_buffer('inv_freq', inv_freq)
    
    def forward(self, seq_len, device):
        pos = torch.arange(seq_len, device=device).float()
        freqs = torch.einsum('i,j->ij', pos, self.inv_freq)
        cos = freqs.cos()  # [seq_len, dim/2]
        sin = freqs.sin()
        return cos, sin

def apply_rope(x, cos, sin):
    """将 RoPE 应用到注意力输入。"""
    # x: [batch, heads, seq_len, d_k]
    d_k = x.shape[-1]
    x1, x2 = x[..., :d_k//2], x[..., d_k//2:]
    # 旋转
    rotated = torch.stack([-x2, x1], dim=-1).flatten(-2)
    cos = cos.unsqueeze(0).unsqueeze(0)  # [1, 1, seq_len, d_k]
    sin = sin.unsqueeze(0).unsqueeze(0)
    return x * cos + rotated * sin


class TransformerDecoderLayer(nn.Module):
    """Pre-LN Transformer Decoder Layer。"""
    
    def __init__(self, d_model, n_heads, d_ff, dropout=0.0):
        super().__init__()
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        # Attention
        self.wq = nn.Linear(d_model, d_model, bias=False)
        self.wk = nn.Linear(d_model, d_model, bias=False)
        self.wv = nn.Linear(d_model, d_model, bias=False)
        self.wo = nn.Linear(d_model, d_model, bias=False)
        
        # FFN (SwiGLU)
        self.w1 = nn.Linear(d_model, d_ff * 2, bias=False)
        self.w2 = nn.Linear(d_ff, d_model, bias=False)
        
        # Norm
        self.norm1 = nn.RMSNorm(d_model)
        self.norm2 = nn.RMSNorm(d_model)
        
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, rope_cos, rope_sin, mask=None):
        batch_size, seq_len, _ = x.shape
        
        # Self-Attention (Pre-LN)
        h = self.norm1(x)
        q = self.wq(h).view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        k = self.wk(h).view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        v = self.wv(h).view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        
        # Apply RoPE
        q = apply_rope(q, rope_cos, rope_sin)
        k = apply_rope(k, rope_cos, rope_sin)
        
        # Attention
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores + mask
        attn = torch.softmax(scores, dim=-1)
        attn = self.dropout(attn)
        
        out = torch.matmul(attn, v)
        out = out.transpose(1, 2).contiguous().view(batch_size, seq_len, -1)
        out = self.wo(out)
        
        x = x + self.dropout(out)
        
        # FFN (SwiGLU)
        h = self.norm2(x)
        ffn_out = self.w2(nn.functional.silu(self.w1(h)))
        x = x + self.dropout(ffn_out)
        
        return x
```

### 6.2 实现分布式训练（FSDP）

```python
import torch
import torch.distributed as dist
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp import MixedPrecision, ShardingStrategy

def setup_distributed():
    """初始化分布式训练环境。"""
    dist.init_process_group(backend='nccl')
    local_rank = int(os.environ['LOCAL_RANK'])
    torch.cuda.set_device(local_rank)

def train_with_fsdp():
    """使用 FSDP 进行大模型训练。"""
    setup_distributed()
    
    # 创建模型
    model = create_large_model()
    model = model.cuda()
    
    # FSDP 配置
    fp16_policy = MixedPrecision(
        param_dtype=torch.bfloat16,
        reduce_dtype=torch.bfloat16,
        buffer_dtype=torch.bfloat16,
    )
    
    model = FSDP(
        model,
        sharding_strategy=ShardingStrategy.FULL_SHARD,
        mixed_precision=fp16_policy,
        device_id=torch.cuda.current_device(),
    )
    
    # 优化器
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
    
    # 训练循环
    for epoch in range(num_epochs):
        for batch in dataloader:
            batch = {k: v.cuda() for k, v in batch.items()}
            
            # 混合精度训练
            with torch.autocast(device_type='cuda', dtype=torch.bfloat16):
                outputs = model(**batch)
                loss = outputs.loss
            
            # 反向传播
            loss.backward()
            
            # 梯度裁剪
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            
            # 优化器步骤
            optimizer.step()
            optimizer.zero_grad()
            
            # Checkpoint
            if should_save_checkpoint:
                save_fsdp_checkpoint(model, optimizer, epoch)
```

### 6.3 实现梯度检查点

```python
import torch
import torch.nn as nn
from torch.utils.checkpoint import checkpoint

class CheckpointedTransformer(nn.Module):
    """使用梯度检查点的 Transformer，减少显存使用。"""
    
    def __init__(self, n_layers, d_model, n_heads, d_ff):
        super().__init__()
        self.layers = nn.ModuleList([
            TransformerDecoderLayer(d_model, n_heads, d_ff)
            for _ in range(n_layers)
        ])
        self.use_checkpoint = True  # 可切换
    
    def forward(self, x, *args):
        for layer in self.layers:
            if self.use_checkpoint and self.training:
                # 检查点：前向时不保存中间激活值
                # 反向时重新计算
                x = checkpoint(layer, x, *args, use_reentrant=False)
            else:
                x = layer(x, *args)
        return x
```

### 6.4 实验追踪框架

```python
from dataclasses import dataclass, field
from typing import Any
import yaml
import wandb

@dataclass
class TrainConfig:
    """训练配置，支持从 YAML 加载和命令行覆盖。"""
    model_name: str = "llama-7b"
    batch_size: int = 32
    learning_rate: float = 1e-4
    num_epochs: int = 10
    warmup_steps: int = 1000
    gradient_accumulation_steps: int = 4
    fp16: bool = True
    seed: int = 42
    
    @classmethod
    def from_yaml(cls, path):
        with open(path) as f:
            return cls(**yaml.safe_load(f))

class ExperimentManager:
    """实验管理器：配置、追踪、检查点。"""
    
    def __init__(self, config: TrainConfig, project_name: str):
        self.config = config
        
        # 设置随机种子
        torch.manual_seed(config.seed)
        
        # 初始化 W&B
        wandb.init(project=project_name, config=vars(config))
        
        self.global_step = 0
    
    def log_metrics(self, metrics: dict):
        """记录训练指标。"""
        wandb.log(metrics, step=self.global_step)
    
    def save_checkpoint(self, model, optimizer, path):
        """保存检查点。"""
        torch.save({
            'model_state': model.state_dict(),
            'optimizer_state': optimizer.state_dict(),
            'step': self.global_step,
            'config': vars(self.config)
        }, path)
    
    def load_checkpoint(self, path):
        """加载检查点。"""
        return torch.load(path)
```

### 6.5 实现简单的 MoE

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class MoELayer(nn.Module):
    """Mixture of Experts 层。"""
    
    def __init__(self, d_model, d_ff, num_experts=8, top_k=2, load_balance_weight=0.01):
        super().__init__()
        self.num_experts = num_experts
        self.top_k = top_k
        self.load_balance_weight = load_balance_weight
        
        # 路由器
        self.router = nn.Linear(d_model, num_experts)
        
        # 专家（FFN）
        self.experts = nn.ModuleList([
            nn.Sequential(
                nn.Linear(d_model, d_ff),
                nn.SiLU(),
                nn.Linear(d_ff, d_model)
            )
            for _ in range(num_experts)
        ])
    
    def forward(self, x):
        """
        x: [batch_size, seq_len, d_model]
        """
        batch_size, seq_len, d_model = x.shape
        x_flat = x.view(-1, d_model)  # [batch*seq, d_model]
        
        # 路由
        router_logits = self.router(x_flat)  # [batch*seq, num_experts]
        router_probs = F.softmax(router_logits, dim=-1)
        
        # Top-K 选择
        topk_probs, topk_indices = torch.topk(router_probs, self.top_k, dim=-1)
        topk_probs = topk_probs / topk_probs.sum(dim=-1, keepdim=True)
        
        # 计算专家输出
        output = torch.zeros_like(x_flat)
        for i in range(self.top_k):
            expert_indices = topk_indices[:, i]  # [batch*seq]
            probs = topk_probs[:, i]  # [batch*seq]
            
            for expert_id in range(self.num_experts):
                mask = (expert_indices == expert_id)
                if mask.any():
                    expert_input = x_flat[mask]
                    expert_output = self.experts[expert_id](expert_input)
                    output[mask] += probs[mask].unsqueeze(-1) * expert_output
        
        # 负载均衡损失
        if self.training:
            mean_prob = router_probs.mean(dim=0)
            mean_mask = F.one_hot(
                topk_indices.view(-1), self.num_experts
            ).float().mean(dim=0)
            balance_loss = self.num_experts * (mean_prob * mean_mask).sum()
            self.aux_loss = self.load_balance_weight * balance_loss
        
        return output.view(batch_size, seq_len, d_model)
```

---

## 7. 备考策略与学习路径

### 7.1 基础阶段（2-3 个月）

1. **PyTorch 精通**:
   - 深入学习 PyTorch 文档和源码
   - 从零实现核心架构（Transformer、CNN、RNN）
   - 练习自定义 Module、Loss、Optimizer

2. **分布式训练**:
   - 学习 DDP 的使用和原理
   - 实践多 GPU 训练
   - 阅读 FSDP/DeepSpeed 文档

3. **论文复现**:
   - 选择 3-5 篇经典论文进行完整复现
   - 关注训练细节（学习率、Batch Size、初始化）
   - 记录复现过程中的工程挑战

### 7.2 进阶阶段（2-3 个月）

1. **大规模训练**:
   - 实践 Megatron-LM 或 DeepSpeed 的使用
   - 学习 3D 并行的配置
   - 进行性能 Profiling 和优化

2. **前沿技术实现**:
   - 实现 Flash Attention、LoRA、MoE
   - 实践混合精度训练
   - 学习 torch.compile

3. **实验框架**:
   - 构建自己的实验管理框架
   - 实践 Hydra 配置管理
   - 集成 W&B/MLflow

### 7.3 面试冲刺阶段（1 个月）

1. **代码练习**: 从零实现 Transformer、MoE、LoRA
2. **系统设计**: 准备 2-3 个训练系统设计案例
3. **性能优化**: 整理训练优化的 Checklist
4. **前沿跟踪**: 了解最新的训练技术（FP8、新并行策略）

---

## 8. 行业薪资范围参考

> 以下数据基于 2025-2026 年美国市场，仅供参考。

| 级别 | 公司类型 | 年薪范围 (美元) | 说明 |
|------|---------|---------------|------|
| 初级 (0-2 年) | 顶级 AI 研究机构 | $180K - $300K | 硕士或有经验的本科 |
| 中级 (2-5 年) | 顶级 AI 研究机构 | $280K - $500K | 有大规模训练经验 |
| 高级 (5+ 年) | OpenAI/Anthropic/DeepMind | $450K - $900K+ | Staff/Principal |
| 所有级别 | FAANG 研究院 | $250K - $600K | 含 RSU |

**中国市场** (人民币):
- 初级: 50-100 万
- 中级: 100-200 万
- 高级: 200-400 万+

---

## 9. 面试 Checklist

- [ ] 能从零实现 Transformer Decoder（含 RoPE、RMSNorm、SwiGLU）
- [ ] 能实现和解释 FSDP/DDP 的使用
- [ ] 理解 ZeRO-1/2/3 的区别
- [ ] 能分析和优化训练的 GPU 利用率
- [ ] 能实现梯度检查点、梯度累积
- [ ] 理解混合精度训练（BF16/FP16/FP8）
- [ ] 能实现 MoE 层（含负载均衡）
- [ ] 能复现至少 2-3 篇重要论文
- [ ] 能设计大规模训练系统的架构
- [ ] 能使用 PyTorch Profiler 分析性能瓶颈
- [ ] 了解了 torch.compile 和 Flash Attention 的原理
- [ ] 准备了训练系统设计的案例

---

## Related

- [[21_面试岗位/README|AI 面试准备 (Interviews)]]
- [[21_面试岗位/Interview_Guide/jobs|AI 相关岗位与工种清单]]
- [[21_面试岗位/Research_Scientist/Research_Scientist|Research Scientist 面试指南]]
- [[21_面试岗位/AI_Research_Scientist/AI_Research_Scientist|AI Research Scientist 面试指南]]
- [[21_面试岗位/AI_Infrastructure_Engineer/question_bank|AI Infrastructure Engineer 题库]]
- [[21_面试岗位/Machine_Learning_Engineer/question_bank|Machine Learning Engineer 题库]]
- [[21_面试岗位/Applied_Scientist/Applied_Scientist|Applied Scientist 面试指南]]

---

*Last updated: 2026-07-11*
