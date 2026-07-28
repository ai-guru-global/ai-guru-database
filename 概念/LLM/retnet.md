---
title: "RetNet"
category: -concepts
tags: ["retnet", "transformer-alternative", "long-context", "architecture", "rnnt"]
relationships:
  - target: "概念/transformer-architecture"
    type: alternative_to
  - target: "概念/mamba"
    type: related_to
  - target: "概念/state-space-models"
    type: related_to
  - target: "概念/kv-cache"
    type: replaces
sources:
  - AI入门/AI_New_Architectures.md
  - 05_大模型/05_LLM_Architectures/LLM_Architecture_Evolution.md
  - 03_深度学习/02_Neural_Network_Core/State_Space_Models_2026.md
summary: "RetNet 是微软提出的 Transformer 替代方案，用‘保留机制（Retention）’取代 Attention。它既能像 Transformer 一样并行训练，又能像 RNN 一样线性复杂度推理，并且完全不需要 KV Cache。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.8
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Retnet
  - "Retentive Network"
  - "保留网络"

name_zh: "保留网络"
---
# RetNet

> 中文简称：保留网络

> **一句话理解**: RetNet 像一台“既能批量备课、又能逐页讲课”的翻译机：训练时全班一起学，推理时一页页翻，不需要背下整本书。

## 核心要点

- **RetNet 是微软 2023 年提出的“非 Attention”大模型架构**
- **核心思想叫 Retention（保留机制）**：把序列信息编码成一个递归状态，同时支持并行训练
- **三大实现形式**：并行（训练）、循环（推理）、分块循环（长序列）
- **最大卖点**：推理成本随序列长度线性增长，且不需要 KV Cache

## 为什么想替代 Transformer？

Transformer 的 Attention 有两个硬伤：
1. **推理成本高**：生成每个新 token 都要重新访问前面所有 token 的 KV Cache
2. **显存随长度增长**：KV Cache 是长上下文推理的显存杀手

## Retention 机制

```
新状态 = 衰减 × 旧状态 + 新输入 × 位置权重
输出    = 新状态 × 查询向量
```

- **衰减（decay）**：越远的过去影响越小，像人短期记忆的遗忘曲线
- **位置权重**：用相对位置编码保留顺序信息

## 三种表示方式

| 形式 | 用途 | 复杂度 | 特点 |
|------|------|:------:|------|
| **并行** | 训练 | O(L²) | 和 Attention 类似，可矩阵并行 |
| **循环** | 推理 | O(1)/步 | 每步 O(1) 状态更新，无 KV Cache |
| **分块循环** | 长序列 | O(L×C) | 块内并行、块间循环，兼顾效率 |

## 架构对比

| 维度 | Transformer | RetNet | Mamba |
|------|-------------|--------|-------|
| 训练并行 | ✅ 完全并行 | ✅ 完全并行 | ⚠️ 需并行扫描 |
| 推理复杂度 | O(L²) | O(L) | O(L) |
| 需要 KV Cache | ✅ 是 | ❌ 否 | ❌ 否 |
| 显存占用 | 随 L 线性增长 | 恒定 | 恒定 |
| 位置信息 | 绝对/相对 PE | 指数衰减 PE | 隐含在状态转移 |
| 生态成熟度 | 极高 | 低 | 中 |
| 2026 状态 | 主流 | 研究阶段 | 活跃 |

## 2026 年现状与定位

| 方面 | 现状 |
|------|------|
| **大规模验证** | 尚未有 >7B 的公开预训练模型达到 Transformer 同等水平 |
| **生态支持** | 无主流推理引擎原生支持 (vLLM/SGLang/TRT-LLM 均不支持) |
| **研究影响** | 启发了后续 YOCO、GLA 等线性注意力架构 |
| **实用场景** | 超长序列流式处理、端侧低显存推理 |
| **与 Mamba 对比** | Mamba 生态更成熟，实际效果更接近 Transformer |

## 性能基准参考

| 模型 | 参数 | 序列长度 | 推理速度 (vs Transformer) | 显存 |
|------|:----:|:--------:|:-------------------:|------|
| RetNet-7B (paper) | 7B | 2K | ~1.0x | 无 KV Cache |
| RetNet-7B (paper) | 7B | 64K | ~3-5x | 恒定 |
| Mamba-7B | 7B | 64K | ~4-6x | 恒定 |
| Transformer-7B | 7B | 64K | 1.0x (baseline) | O(L) 增长 |

> 注：以上数据为论文报告值，实际效果取决于硬件和实现。

## 适用场景与局限

✅ **适合**：
- 超长上下文生成（>100K token）
- 低显存推理（端侧/嵌入式）
- 流式处理（实时翻译、语音）

⚠️ **局限**：
- 部分任务效果不如 Transformer（复杂推理、代码）
- 生态远不如 Transformer/Mamba 成熟
- 缺乏大规模预训练验证

## 2026 生态现状

| 类别 | 状态 | 说明 |
|------|------|------|
| **学术研究** | 活跃 | 多篇后续论文改进 RetNet |
| **大规模验证** | 缺乏 | 无 70B+ 级别的公开模型 |
| **推理引擎** | 有限 | vLLM/TGI 未原生支持 |
| **与 Mamba 对比** | 落后 | Mamba 生态更成熟，社区更活跃 |
| **混合架构** | 探索中 | RetNet + Attention 混合方案研究中 |

## 生产最佳实践

1. **研究阶段优先**: 当前 RetNet 更适合研究探索，生产环境建议用 Transformer/Mamba
2. **长序列场景**: 如果序列 >100K 且显存受限，可考虑 RetNet 作为实验方案
3. **对比基线**: 始终与同规模 Transformer 对比质量和速度
4. **关注后续发展**: 等待更大规模验证和生态成熟后再考虑生产采用
5. **流式场景**: 实时翻译/语音等流式处理是 RetNet 的潜在优势场景

## Retention 机制代码示例

```python
import torch
import torch.nn as nn

class Retention(nn.Module):
    """Multi-Scale Retention 简化实现"""
    def __init__(self, d_model: int, n_heads: int):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.head_dim = d_model // n_heads
        # 每个头独立的衰减率
        self.decay = nn.Parameter(
            1 - 2 ** (-5 - torch.arange(n_heads).float())
        )  # γ ∈ (0.97, 0.999)
        self.W_q = nn.Linear(d_model, d_model, bias=False)
        self.W_k = nn.Linear(d_model, d_model, bias=False)
        self.W_v = nn.Linear(d_model, d_model, bias=False)
        self.W_o = nn.Linear(d_model, d_model, bias=False)

    def forward_recurrent(self, x: torch.Tensor):
        """推理模式：O(1)/步，无 KV Cache"""
        B, L, D = x.shape
        q, k, v = self.W_q(x), self.W_k(x), self.W_v(x)
        q = q.view(B, L, self.n_heads, self.head_dim)
        k = k.view(B, L, self.n_heads, self.head_dim)
        v = v.view(B, L, self.n_heads, self.head_dim)
        state = torch.zeros(B, self.n_heads, self.head_dim, self.head_dim,
                           device=x.device)
        outputs = []
        for t in range(L):
            decay = self.decay.view(1, -1, 1, 1)
            state = decay * state + torch.einsum('bhd,bhe->bhde',
                      k[:, t], v[:, t])
            out_t = torch.einsum('bhd,bhde->bhe', q[:, t], state)
            outputs.append(out_t)
        return self.W_o(torch.stack(outputs, dim=1).reshape(B, L, D))
```

## 后续影响与衍生架构

| 架构 | 年份 | 与 RetNet 关系 | 状态 |
|------|:----:|------------|------|
| **GLA** (Gated Linear Attention) | 2024 | 改进门控机制 | 活跃研究 |
| **YOCO** (You Only Cache Once) | 2024 | 简化 KV 缓存 | 研究阶段 |
| **HGRN2** | 2024 | 分层门控递归 | 研究阶段 |
| **Mamba-2 SSD** | 2024 | SSM+注意力统一 | 生产可用 |
| **DeltaNet** | 2025 | Delta Rule 更新 | 研究阶段 |

## 延伸阅读

- [[概念/LLM/mamba|Mamba]]
- [[概念/LLM/attention-variants|注意力变体]]
- [[概念/LLM/transformer-architecture-plain|Transformer 架构]]
- [[概念/LLM/state-space-models|状态空间模型]]
- [[概念/LLM/transformer-architecture|Transformer 架构详解]]
- [[概念/Inference/kv-cache|KV Cache]]
- [[03_深度学习/02_Neural_Network_Core/State_Space_Models_2026|状态空间模型 2026]]
- [[05_大模型/05_LLM_Architectures/LLM_Architecture_Evolution|LLM 架构演进]]

> **关键论文**: "Retentive Network: A Successor to Transformer for Large Language Models" (Sun et al., 2023, Microsoft Research)

## 快速对比卡片

| 如果你需要... | 选择 |
|------------|------|
| 生产环境长序列 | Mamba-2 / Jamba |
| 研究线性注意力 | RetNet / GLA |
| 极致推理效率 | Transformer + KV Cache 压缩 |
| 流式处理 | RetNet / Mamba |
