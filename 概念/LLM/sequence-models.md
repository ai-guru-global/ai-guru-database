---
title: 序列模型
category: -concepts
tags: [fine-tuning-techniques, rnn, lstm, gru, sequence-modeling]
relationships:
  - target: "[[概念/transformer-architecture]]"
    type: evolves_to
  - target: "概念/llm-architectures"
    type: related_to
sources: [05_大模型/Sequence_world-models-jepa/Sequence_Models.md]
summary: 序列模型（neural-networks/LSTM/GRU）是处理有序数据的神经网络架构，通过隐藏状态记忆历史信息。虽然已被transformer-architecture取代，但在流式推理、时间序列预测和边缘设备场景中仍有应用价值。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
aliases:
  - "Sequence Models"
  - "sequence models"

---
# 序列模型

## 概述

序列模型（Sequence Models）是专门处理有序数据的神经网络架构，其核心思想是**当前输出不仅取决于当前输入，还取决于之前的历史信息**。传统前馈网络将每个输入视为独立样本，无法捕捉序列中的时序依赖关系。

发展脉络从简单RNN（1986）到LSTM（1997）、GRU（2014），再到Seq2Seq+Attention（2015），最终被 Transformer 取代。理解RNN/LSTM仍是理解Transformer动机的必要背景。

## 循环神经网络（RNN）

RNN在每个时间步接收当前输入$x_t$和上一步隐藏状态$h_{t-1}$，计算新的隐藏状态：

$$h_t = \tanh(W_{xh} x_t + W_{hh} h_{t-1} + b_h)$$

核心特征是权重矩阵$W_{hh}$实现循环连接，同一个RNN单元在每个时间步共享参数。

### 梯度消失/爆炸问题

通过时间的反向传播（BPTT）中，梯度需经过多次矩阵连乘。当$\|W_{hh}\| < 1$时梯度趋近于零（梯度消失），$\|W_{hh}\| > 1$时梯度趋向无穷（梯度爆炸）。这导致简单RNN无法学习长程依赖。

## 长短期记忆网络（LSTM）

LSTM由Hochreiter & Schmidhuber（1997）提出，通过**门控机制**和独立的**细胞状态**解决梯度消失。

三个核心门：
- **遗忘门** $f_t = \sigma(W_f [h_{t-1}, x_t] + b_f)$：决定丢弃多少旧信息
- **输入门** $i_t = \sigma(W_i [h_{t-1}, x_t] + b_i)$：决定写入多少新信息
- **输出门** $o_t = \sigma(W_o [h_{t-1}, x_t] + b_o)$：决定输出什么

细胞状态更新：$C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$

关键在于加法操作而非乘法——梯度可沿细胞状态"高速公路"几乎无损传播。当遗忘门$f_t \approx 1$时，信息可跨越很长的时间步。

## 门控循环单元（GRU）

GRU是LSTM的简化版本，合并遗忘门和输入门为一个**更新门**，取消了独立细胞状态：

$$z_t = \sigma(W_z [h_{t-1}, x_t])$$
$$h_t = (1 - z_t) \odot h_{t-1} + z_t \odot \tilde{h}_t$$

参数量比LSTM少约25%，训练更快，适合数据量小、资源受限的场景。

## LSTM与GRU对比

| 维度 | LSTM | GRU |
|------|------|-----|
| 门数量 | 3个 | 2个 |
| 参数量 | 更多（~4x隐藏层²） | 更少（~3x隐藏层²） |
| 长序列表现 | 更强 | 略弱 |
| 适用场景 | 序列长、信息复杂 | 数据量小、快速训练 |

## 关键架构扩展

### 双向LSTM

前向和后向同时处理序列，输出拼接两个方向的隐藏状态。适用于命名实体识别等需要前后文的任务。

### Seq2Seq架构

编码器将输入序列压缩为固定长度上下文向量，解码器从该向量生成输出序列。瓶颈在于固定长度编码限制了长句子性能。

### 注意力机制的引入

Bahdanau et al.（2015）提出注意力机制，允许解码器在每步"回看"编码器所有隐藏状态，通过加权求和获取上下文。这一机制后来发展为 Transformer的Self-Attention。

### 序列标注

常用架构为BiLSTM + CRF，CRF层确保标签序列的全局一致性。任务包括词性标注、命名实体识别和中文分词。

## RNN的现代回归

虽然Transformer已成为主流，但RNN类架构出现回归趋势：^[inferred]

- **Mamba**（2023）：选择性状态空间模型，线性复杂度替代二次注意力
- **RWKV**：结合RNN和Transformer优势的混合架构
- **xLSTM**（2024）：Sepp Hochreiter团队提出的现代LSTM变体

## 与Transformer的对比

| 维度 | RNN/LSTM | Transformer |
|------|----------|------------|
| 并行性 | 差（必须顺序计算） | 好（全部位置并行） |
| 长程依赖 | 中等 | 强（直接连接任意位置） |
| 计算复杂度 | $O(n)$ | $O(n^2)$ |
| 流式推理 | 天然支持 | 需要额外设计 |
| 内存效率 | 高 | 低（需存完整注意力矩阵） |

## 2026 年序列模型格局

| 架构 | 状态 | 代表 | 适用场景 |
|------|:----:|------|----------|
| **Transformer** | 主流 | GPT-5, Llama 4, Qwen3 | 通用 LLM |
| **Mamba/SSM** | 活跃 | Jamba, Falcon-Mamba | 超长序列、端侧 |
| **RWKV** | 小众 | RWKV-7 | 流式、低资源 |
| **xLSTM** | 研究 | - | 实验阶段 |
| **混合架构** | 趋势 | Mamba + Attention | 兼顾效果和效率 |

## 延伸阅读

- [[概念/LLM/mamba|Mamba]]
- [[概念/LLM/retnet|RetNet]]
- [[概念/LLM/transformer-architecture-plain|Transformer 大白话]]
- [[概念/LLM/llm-architectures|LLM 架构]]
- [[05_大模型/02_Sequence_Models/Sequence_Models|序列模型深度解析]]

---

## 2026 序列模型生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Mamba-2** | 选择性状态空间模型，线性复杂度，超长序列 | GA |
| **RWKV-7** | 结合 RNN + Transformer 优势，流式推理 | GA |
| **xLSTM** | 现代 LSTM 变体，指数门控 + 新记忆结构 | 研究 |
| **混合架构** | Mamba + Attention 混合，兼顾效果和效率 | 趋势 |
| **Jamba** | AI21 的 Mamba-Transformer 混合模型 | GA |

## 生产最佳实践

1. **通用场景用 Transformer**：GPT/Llama/Qwen 等主流模型仍是首选
2. **超长序列考虑 Mamba**：1M+ 上下文场景，Mamba 线性复杂度优势明显
3. **流式推理用 RWKV**：实时对话/流式生成场景，RWKV 天然支持
4. **边缘设备考虑轻量级**：资源受限时考虑 RWKV/Mamba 等高效架构
5. **混合架构关注**：Mamba + Attention 混合架构是 2026 年趋势，值得跟进
6. **生态检查**：确认推理引擎、量化工具链支持情况
7. **对比测试**：同任务下对比质量和速度再决策

## 2026 序列模型全景

| 架构 | 代表 | 复杂度 | 显存 | 生态 | 适用 |
|------|------|:------:|:----:|:----:|------|
| **Transformer** | GPT-5/Llama 4 | O(L²) | O(L) | 极成熟 | 通用 |
| **Mamba/SSM** | Jamba/Falcon | O(L) | O(1) | 发展中 | 长序列 |
| **RWKV** | RWKV-7 | O(L) | O(1) | 小众 | 流式 |
| **RetNet** | 研究阶段 | O(L) | O(1) | 极早期 | 研究 |
| **混合** | Jamba/Hymba | O(L) | O(1) | 发展中 | 平衡 |

## 架构选择决策树

```
需要最强通用能力？
├── 是 → Transformer (GPT-5/Llama 4/Qwen3)
└── 否 → 需要超长序列 (>100K)？
    ├── 是 → 显存受限？
    │   ├── 是 → Mamba / Jamba
    │   └── 否 → Transformer + MLA
    └── 否 → 需要流式处理？
        ├── 是 → RWKV / Mamba
        └── 否 → Transformer
```

## 性能对比 (64K 序列)

| 架构 | 吐量 (tok/s) | 显存 (GB) | 质量 |
|------|:----------:|:--------:|:----:|
| Transformer (7B) | ~100 | ~40 | 基线 |
| Mamba (7B) | ~400 | ~14 | ~95% |
| RWKV (7B) | ~350 | ~14 | ~90% |
| Jamba (52B) | ~200 | ~24 | ~98% |

## 延伸阅读

- [[概念/LLM/transformer-architecture|Transformer 架构]]
- [[概念/LLM/mamba|Mamba]]
- [[概念/LLM/retnet|RetNet]]
- [[概念/LLM/state-space-models|状态空间模型]]
- [[概念/LLM/attention-variants|注意力变体]]
- [[03_深度学习/02_Neural_Network_Core/State_Space_Models_2026|状态空间模型 2026]]
- [[05_大模型/02_Sequence_Models/Sequence_Models|序列模型深度解析]]

## 关键论文

| 论文 | 年份 | 贡献 |
|------|:----:|------|
| Attention Is All You Need | 2017 | Transformer 奠基 |
| Mamba | 2023 | 选择性 SSM |
| RWKV | 2023 | 线性 RNN |
| RetNet | 2023 | 保留机制 |
| Mamba-2 (SSD) | 2024 | SSM+注意力统一 |
| Jamba | 2024 | 混合架构产品化 |
