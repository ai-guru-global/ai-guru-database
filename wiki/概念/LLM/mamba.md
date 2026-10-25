---
title: "Mamba"
category: -concepts
tags: ["mamba", "state-space-model", "ssm", "long-context", "architecture", "transformer-alternative"]
relationships:
  - target: "概念/state-space-models"
    type: belongs_to
  - target: "概念/transformer-architecture"
    type: alternative_to
  - target: "概念/retnet"
    type: related_to
  - target: "概念/long-context-models"
    type: enables
sources:
  - 03_深度学习/02_神经网络核心/State_Space_Models_2026.md
  - AI入门/AI_New_Architectures.md
  - 05_大模型/04_LLM架构/LLM_Architecture_Evolution.md
summary: "Mamba 是一种‘用线性扫描代替注意力’的模型结构。它像一条传送带，边读边更新一个隐藏状态，不必像 Transformer 那样回头看所有词，因此在超长序列上更快、更省显存。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Mamba
  - "Mamba-2"
  - "选择性状态空间模型"

name_zh: "Mamba 状态空间模型"
---
# Mamba

> 中文简称：Mamba 状态空间模型

> **一句话理解**: Mamba 就像一位边走边做笔记的速记员：不用反复翻阅整本书，而是把读过的内容压缩成几张关键摘要，所以读再长的文章也不累。

## 核心要点

- **Mamba 属于 State Space Model（SSM）**，目标是用线性复杂度处理长序列
- **Transformer 的 Attention 是“全连接回看”**：每个词都要和所有词算相似度，长度翻倍时计算量翻四倍
- **Mamba 是“边走边记”**：维护一个隐藏的“状态向量”，每读一个新词就更新它，不需要回头
- **关键创新**：选择性状态空间（Selective SSM），让模型决定哪些信息写入状态、哪些丢弃

## 数学原理

```
新状态 = A × 旧状态 + B × 新输入
输出    = C × 新状态
```

- A、B、C 是学习得到的矩阵，每步只需一次矩阵运算
- 计算量按 L 线性增长，而非 Transformer 的 L²
- **选择性机制**：B、C 和步长 Δ 与输入相关，实现“智能记忆”

## Mamba vs Transformer

| 维度 | Transformer | Mamba | Mamba-2 |
|------|-------------|-------|--------|
| 长序列速度 | O(L²)，慢 | O(L)，快 | O(L)，快 |
| 显存占用 | 高（KV Cache） | 低（恒定状态） | 低 |
| 训练并行 | 容易 | 需并行扫描 | 更易并行 |
| 效果 | 已验证很强 | 部分任务接近 | 更接近 |
| 生态 | 极其成熟 | 快速发展中 | 发展中 |
| 推理引擎 | 所有引擎 | 专用 kernel | 专用 kernel |

## Mamba-2 改进 (2024)

| 改进 | 说明 |
|------|------|
| **SSD 框架** | 将 SSM 与结构化注意力统一，更易硬件优化 |
| **更大状态维度** | 提升记忆容量，缩小与 Transformer 差距 |
| **更好并行性** | 块内用矩阵乘法，充分利用 Tensor Core |
| **混合架构友好** | 与 Transformer 层交替使用效果更佳 |

## 混合架构产品 (2026)

| 模型 | 架构 | 参数 | 特点 |
|------|------|:----:|------|
| **Jamba 1.5** (AI21) | Mamba + Transformer | 52B | 256K 上下文，生产可用 |
| **Zamba2** (Zyphra) | Mamba + Transformer | 7B | 开源，效果接近同规模 Llama |
| **Falcon-Mamba** (TII) | 纯 Mamba | 7B | 开源，长序列优势明显 |
| **NVIDIA Hymba** | Mamba + Attention | 7B | 混合头设计 |

## 适用场景

| 场景 | Mamba 优势 | 推荐度 |
|------|---------|:------:|
| 超长文本建模 (>100K) | 线性复杂度，显存恒定 | ⭐⭐⭐⭐⭐ |
| 端侧/低显存推理 | 无 KV Cache，显存恒定 | ⭐⭐⭐⭐ |
| 基因组/时序 | 天然适合超长序列 | ⭐⭐⭐⭐⭐ |
| 复杂推理/代码 | 仍有差距 | ⭐⭐ |
| 多轮对话 | 状态压缩可能丢失细节 | ⭐⭐⭐ |

## 2026 年定位

- **不是 Transformer 替代者，而是补充**：混合架构是主流方向
- **长序列优势明确**：>100K token 场景下吐量和显存优势显著
- **生态快速发展**：专用 CUDA kernel 成熟，但主流引擎支持有限
- **与 KV Cache 压缩互补**：Transformer + MLA/FP8 在多数场景仍是首选

## 代表模型与框架

| 模型/框架 | 参数 | 特点 |
|----------|------|------|
| **Mamba-2** | 1.3B-7B | 结构化状态空间对偶 (SSD) |
| **Jamba** | 52B (AI21) | Mamba + Transformer 混合 |
| **Zamba** | 7B (Zyphra) | 共享注意力 + Mamba |
| **Falcon-Mamba** | 7B (TII) | 纯 Mamba 架构 |
| **mamba-ssm** | - | 官方 PyTorch 实现 |
| **vLLM** | - | 实验性 Mamba 推理支持 |

## 生产最佳实践

1. **场景匹配**: 超长序列/时序/基因组用 Mamba，复杂推理/代码用 Transformer
2. **混合架构优先**: Jamba 等混合方案兼顾两者优势
3. **显存规划**: Mamba 显存恒定，适合显存受限场景
4. **吐量测试**: 实际测试长序列吐量，确认优势可复现
5. **生态检查**: 确认推理引擎、量化工具链支持情况
6. **与 Transformer 对比测试**: 同任务下对比质量和速度再决策
7. **混合比例调优**: Mamba:Attention 层比例通常 3:1 到 6:1

## Mamba 核心代码示例

```python
import torch
from mamba_ssm import Mamba

# 初始化 Mamba 层
model = Mamba(
    d_model=2560,      # 隐藏维度
    d_state=64,        # SSM 状态维度
    d_conv=4,          # 局部卷积窗口
    expand=2,          # 内部扩展因子
).cuda()

# 前向传播：线性复杂度 O(L)
x = torch.randn(2, 4096, 2560).cuda()  # (batch, seq_len, d_model)
y = model(x)  # 输出同形状
print(f"Input: {x.shape} -> Output: {y.shape}")
# 显存恒定，不随 seq_len 增长
```

```python
# 混合架构示例（类 Jamba 结构）
import torch.nn as nn
from mamba_ssm import Mamba
from transformers.models.llama.modeling_llama import LlamaAttention

class HybridBlock(nn.Module):
    """Mamba + Attention 混合层"""
    def __init__(self, d_model, layer_idx):
        super().__init__()
        # 每 4 层插入 1 层 Attention
        if layer_idx % 4 == 3:
            self.attn = LlamaAttention(d_model, n_heads=32)
            self.is_mamba = False
        else:
            self.mamba = Mamba(d_model=d_model, d_state=64)
            self.is_mamba = True
        self.norm = nn.RMSNorm(d_model)

    def forward(self, x):
        if self.is_mamba:
            return x + self.mamba(self.norm(x))
        else:
            return x + self.attn(self.norm(x))
```

## 部署与推理

| 引擎 | Mamba 支持 | 说明 |
|------|:--------:|------|
| **vLLM** | 实验性 | 支持 Jamba/Falcon-Mamba |
| **HuggingFace** | ✅ | transformers 原生支持 |
| **TensorRT-LLM** | 部分 | 通过 plugin 支持 |
| **llama.cpp** | ❌ | 不支持 SSM 架构 |
| **专用 kernel** | ✅ | mamba-ssm 包提供 CUDA kernel |

## 延伸阅读

- [[概念/LLM/retnet|RetNet]]
- [[概念/LLM/attention-variants|注意力变体]]
- [[概念/LLM/transformer-architecture-plain|Transformer 架构]]
- [[概念/LLM/sequence-models|序列模型]]
- [[概念/LLM/state-space-models|状态空间模型]]
- [[03_深度学习/02_神经网络核心/11_State_Space_模型_2026|状态空间模型 2026]]
- [[05_大模型/02_序列模型/02_序列模型|序列模型深度解析]]

> **关键论文**: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces" (Gu & Dao, 2023)

## 快速决策指南

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 通用 NLP / 代码 | Transformer | 生态成熟，效果最佳 |
| >100K 序列 + 显存受限 | Mamba-2 / Jamba | 线性复杂度，显存恒定 |
| 基因组 / 时序 | Mamba / Falcon-Mamba | 天然适合超长序列 |
| 端侧低显存 | Mamba-7B | 无 KV Cache |
| 生产环境混合 | Jamba 1.5 | 兼顾质量+效率 |
