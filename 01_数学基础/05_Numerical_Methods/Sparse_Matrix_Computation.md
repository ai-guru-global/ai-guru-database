---
title: 稀疏矩阵与高效运算 (Sparse Matrix Computation)
category: 01-math-foundations
tags: ["sparse-matrix", "csr", "csc", "attention-mask", "moe", "efficiency"]
summary: "AI 系统中的稀疏计算：稀疏矩阵存储格式、注意力掩码、MoE 稀疏激活、结构化剪枝中的稀疏性利用，以及 GPU 上的稀疏加速策略。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "稀疏矩阵与高效运算"
---
# 稀疏矩阵与高效运算

> 中文简称：稀疏矩阵与高效运算

## 1. 稀疏性在 AI 中的普遍存在

### 1.1 AI 系统中的稀疏性来源

| 来源 | 稀疏度 | 示例 |
|------|--------|------|
| 注意力掩码 | 50-95% | Causal mask、Padding mask |
| MoE 路由 | 87-98% | 256 专家激活 8 个 (97% 稀疏) |
| ReLU 激活 | ~50% | 负值置零 |
| 结构化剪枝 | 20-90% | 通道剪枝、层剪枝 |
| 嵌入查找 | >99% | One-hot → Embedding |
| 图邻接矩阵 | >99% | 社交网络、知识图谱 |
| NLP 词袋 | >99% | TF-IDF 矩阵 |

### 1.2 为什么稀疏计算重要？

```
稠密 256×256 专家矩阵 (所有专家):
  计算量: 256 × d × d = 256d² FLOPs
  显存: 256 × d × d × 2 bytes

MoE 稀疏激活 (Top-8 专家):
  计算量: 8 × d × d = 8d² FLOPs  (32× 节省!)
  显存: 仍需存储所有专家权重 (但计算大幅减少)
```

## 2. 稀疏矩阵存储格式

### 2.1 经典格式对比

```
┌─────────────────────────────────────────────────────────┐
│  COO (Coordinate):                                      │
│  存储: (row[], col[], val[])                            │
│  优点: 构建简单                                         │
│  缺点: 不适合运算                                       │
│  用途: 中间格式、数据加载                               │
├─────────────────────────────────────────────────────────┤
│  CSR (Compressed Sparse Row):                           │
│  存储: (val[], col_idx[], row_ptr[])                    │
│  优点: 行切片快、SpMV 高效                              │
│  缺点: 列切片慢                                         │
│  用途: 通用稀疏运算、SciPy 默认                         │
├─────────────────────────────────────────────────────────┤
│  CSC (Compressed Sparse Column):                        │
│  存储: (val[], row_idx[], col_ptr[])                    │
│  优点: 列切片快                                         │
│  缺点: 行切片慢                                         │
│  用途: 稀疏转置、列操作                                 │
├─────────────────────────────────────────────────────────┤
│  BSR (Block Sparse Row):                                │
│  存储: 将非零元素按 block 分组                          │
│  优点: GPU 友好、利用 Tensor Core                       │
│  缺点: 需要块对齐                                       │
│  用途: GPU 稀疏 GEMM、结构化稀疏                        │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Python 实战

```python
import numpy as np
from scipy import sparse

# 创建稀疏矩阵
dense = np.array([[1, 0, 0, 2],
                  [0, 0, 3, 0],
                  [0, 0, 0, 0],
                  [4, 0, 0, 5]])

# CSR 格式
csr = sparse.csr_matrix(dense)
print(f"稀疏度: {1 - csr.nnz / csr.size:.1%}")  # 62.5%
print(f"存储: {csr.data.nbytes + csr.indices.nbytes + csr.indptr.nbytes} bytes")
print(f"vs 稠密: {dense.nbytes} bytes")

# PyTorch 稀疏张量
import torch
indices = torch.tensor([[0, 0, 1, 3, 3],
                        [0, 3, 2, 0, 3]])
values = torch.tensor([1.0, 2.0, 3.0, 4.0, 5.0])
sparse_tensor = torch.sparse_coo_tensor(indices, values, (4, 4))

# 稀疏矩阵乘法
result = torch.sparse.mm(sparse_tensor, torch.randn(4, 8))
```

## 3. AI 中的稀疏计算模式

### 3.1 注意力掩码 (Attention Mask)

```python
# Causal Mask: 下三角矩阵 (50% 稀疏)
def causal_mask(seq_len):
    return torch.tril(torch.ones(seq_len, seq_len))

# Flash Attention 的稀疏利用:
# - 不实例化完整 N×N 注意力矩阵
# - 分块计算，跳过全零块
# - Causal mask: 只计算下三角块

# Sparse Attention 模式:
# - Local Window: 只看附近 w 个 token
# - Strided: 每隔 k 个 token 看一个
# - Block Sparse: 按块稀疏 (BigBird/Longformer)
```

### 3.2 MoE 稀疏激活

```python
# Mixture of Experts 的稀疏路由
class MoELayer(torch.nn.Module):
    def __init__(self, num_experts=256, top_k=8, d_model=4096):
        self.gate = nn.Linear(d_model, num_experts)  # 路由器
        self.experts = nn.ModuleList([
            FeedForward(d_model) for _ in range(num_experts)
        ])
        self.top_k = top_k
    
    def forward(self, x):
        # 路由: 每个 token 选择 top-k 专家
        gate_logits = self.gate(x)  # [batch*seq, num_experts]
        top_k_vals, top_k_idx = gate_logits.topk(self.top_k, dim=-1)
        top_k_weights = F.softmax(top_k_vals, dim=-1)
        
        # 稀疏计算: 只激活 top-k 专家
        # 稀疏度: 1 - top_k/num_experts = 1 - 8/256 = 96.9%
        output = torch.zeros_like(x)
        for k in range(self.top_k):
            expert_idx = top_k_idx[:, k]
            weight = top_k_weights[:, k].unsqueeze(-1)
            # 将 token 分组到对应专家 (稀疏分发)
            for e in range(self.num_experts):
                mask = (expert_idx == e)
                if mask.any():
                    output[mask] += weight[mask] * self.experts[e](x[mask])
        
        return output
```

### 3.3 结构化稀疏 (2:4 Sparsity)

```python
# NVIDIA Ampere+ 支持 2:4 结构化稀疏
# 每 4 个连续元素中恰好 2 个为零
# 硬件加速: 2× 吞吐 (A100/H100 Tensor Core)

# 训练后剪枝为 2:4 模式
def apply_2_4_sparsity(weight):
    """将权重矩阵转为 2:4 稀疏模式"""
    w = weight.clone().reshape(-1, 4)
    # 每组4个中保留最大的2个
    _, idx = w.abs().topk(2, dim=1)
    mask = torch.zeros_like(w)
    mask.scatter_(1, idx, 1.0)
    return (weight * mask.reshape_as(weight))

# 使用 NVIDIA ASP (Automatic SParsity) 库
# from apex.contrib.sparsity import ASP
# ASP.init_model_for_pruning(model, mask_calculator="m4n2_1d")
```

## 4. GPU 上的稀疏加速

### 4.1 硬件支持

| GPU 架构 | 稀疏支持 | 加速比 |
|----------|----------|--------|
| A100 (Ampere) | 2:4 结构化稀疏 | 2× Tensor Core |
| H100 (Hopper) | 2:4 + FP8 稀疏 | 2× |
| B200 (Blackwell) | 2:4 + FP4 稀疏 | 2× |
| 通用 GPU | 非结构化稀疏 | 取决于稀疏度 |

### 4.2 稀疏 GEMM 库

```python
# cuSPARSE — NVIDIA 稀疏线性代数库
# torch.sparse — PyTorch 稀疏支持
# DeepSpeed Sparse — 稀疏训练框架

# 性能对比 (4096×4096 矩阵):
# 稠密 GEMM:     ~1.0 TFLOPS (FP16)
# 50% 稀疏:      ~1.5 TFLOPS
# 2:4 结构化:    ~2.0 TFLOPS (硬件加速)
# 90% 非结构化:  ~1.2 TFLOPS (索引开销)
```

## 5. 稀疏训练与推理实践

### 5.1 稀疏训练策略

```
┌─────────────────────────────────────────────┐
│  稀疏训练三阶段:                             │
│                                             │
│  1. 稠密预训练 → 学习完整表示               │
│  2. 渐进剪枝 → 逐步增加稀疏度              │
│     - 每 N 步剪掉最小的权重                 │
│     - 配合 fine-tune 恢复精度               │
│  3. 稀疏微调 → 在稀疏模式下精调             │
│     - 保持稀疏 mask 不变                    │
│     - 只更新非零权重                        │
└─────────────────────────────────────────────┘
```

### 5.2 稀疏推理优化

| 技术 | 稀疏类型 | 加速效果 | 精度影响 |
|------|----------|----------|----------|
| 2:4 剪枝 | 结构化 | 2× | <1% |
| 通道剪枝 | 结构化 | 1.5-3× | 1-3% |
| 注意力稀疏化 | 动态 | 2-4× (长序列) | <1% |
| MoE | 条件计算 | 8-32× | 无损 |
| 激活稀疏 (ReLU) | 动态 | 1.2× | 无损 |

## 相关文档

- [[01_数学基础/05_Numerical_Methods/Numerical_Methods|数值方法总论]]
- [[01_数学基础/02_Linear_Algebra/Linear_Algebra|线性代数]] — 矩阵运算基础
- [[05_大模型/05_LLM_Architectures/|LLM 架构]] — MoE 稀疏激活
- [[03_深度学习/09_Advanced_Topics/Neural_Architecture_Search|NAS]] — 稀疏架构搜索
- [[10_部署推理/03_Inference_Optimization/Model_Compression|模型压缩]] — 剪枝与稀疏化
