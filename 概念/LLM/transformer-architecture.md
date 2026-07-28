---
title: Transformer 架构
category: -concepts
tags: ["deep-learning", "transformer", "attention", "self-attention", "bert", "gpt", "nlp"]
aliases: [Transformer, 注意力机制, 自注意力, long-context-models Is All You Need]
relationships:
  - target: "[[概念/neural-networks]]"
    type: related_to
  - target: "概念/optimization-regularization"
    type: related_to
  - target: "概念/state-space-models"
    type: related_to
sources: [03_Deep_unsupervised-learning/Neural_Network_Core/Neural_Network_Core.md, 03_深度学习/README.md]
summary: 基于自注意力机制的序列建模架构，摒弃循环和卷积实现并行计算，是 BERT/GPT 等大模型的基础，但也面临 O(n²) 复杂度瓶颈。
provenance:
  extracted: 0.75
  inferred: 0.15
  ambiguous: 0.10
base_confidence: 0.70
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: supporting
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
name_zh: "Transformer 架构"
---

# Transformer 架构

> 中文简称：Transformer 架构

Transformer（Vaswani et al., 2017）彻底改变了序列建模方式，通过自注意力机制实现并行计算和长程依赖建模。从 BERT 到 GPT 系列，Transformer 已成为 NLP 和 CV 的基础架构。然而其 $O(n^2)$ 注意力复杂度也成为核心瓶颈，催生了 状态空间模型 等替代架构。

## 核心要点

- **自注意力机制**：计算序列中每个位置与所有位置的关联度，直接建模任意距离依赖
- **并行计算**：无需像 RNN 顺序处理，充分利用 GPU 并行能力
- **多头注意力**：通过多个头捕捉不同模式（语法、语义、位置关系等）
- **Layer neural-networks**：Layer Norm 是 Transformer 的标准归一化组件
- **位置编码**：注意力机制本身无位置信息，需要显式注入

## 详细内容

### 自注意力机制

核心公式：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V$$

其中 $Q$（Query）、$K$（Key）、$V$（Value）由输入经线性变换得到。$\sqrt{d_k}$ 缩放防止点积过大导致 softmax 饱和。

**计算过程**：
1. 输入 $\mathbf{X}$ 通过权重矩阵生成 $Q = \mathbf{X}W^Q$, $K = \mathbf{X}W^K$, $V = \mathbf{X}W^V$
2. 计算注意力权重 $\alpha = \text{softmax}(QK^T / \sqrt{d_k})$
3. 加权求和输出 $= \alpha V$

### 多头注意力

将 $Q, K, V$ 投影到 $h$ 个不同的子空间，分别计算注意力后拼接：

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, ..., \text{head}_h) W^O$$

每个头可关注不同类型的关联模式。例如在 NLP 中，不同头可能分别关注语法结构、语义相似性和指代关系 ^[inferred]。

### Transformer Block

标准 Transformer Block 包含：

1. **多头自注意力层** + 残差连接 + Layer Norm
2. **前馈网络（FFN）** + 残差连接 + Layer Norm

FFN 通常为两层 MLP：$\text{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2$，中间维度通常是模型维度的 4 倍。

### 编码器-解码器架构

原始 Transformer 用于机器翻译：

- **编码器**：双向自注意力，看到完整输入序列，用于理解
- **解码器**：因果（掩码）自注意力 + 交叉注意力，只能看到已生成内容，用于生成

**BERT** 仅使用编码器（双向注意力），**GPT** 仅使用解码器（因果注意力），这一选择决定了模型特性 ^[inferred]。

### 位置编码

自注意力是排列不变的，无法感知位置。Transformer 使用正弦位置编码：

$$PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d}), \quad PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d})$$

现代变体使用可学习位置编码（BERT）或旋转位置编码（RoPE，llm-architectures），后者支持更好的长度外推 ^[inferred]。

### Transformer 的优势

- **并行计算**：所有位置同时计算注意力，训练效率远超 RNN
- **长程依赖**：直接建模任意距离关联，无信息瓶颈
- **灵活性强**：可用于文本（BERT/GPT）、图像（ViT）、音频、蛋白质序列等

### Transformer 的瓶颈

| 问题 | 原因 | 影响 |
|------|------|------|
| $O(n^2)$ 复杂度 | 注意力矩阵大小为 $n \times n$ | 长序列不可行 |
| KV Cache 内存 | 每个token存储KV向量 | 1M上下文需~32GB |
| 推理成本 | 每次生成需重算注意力 | 自回归生成慢 |

这些瓶颈催生了 Mamba/SSM 等 $O(n)$ 线性复杂度替代方案 ^[inferred]。

### 训练关键配置

Transformer 训练 的标配配置：

- **优化器**：AdamW（解耦权重衰减）
- **学习率**：Warmup（5-10% 总步数）+ Cosine Annealing
- **正则化**：Dropout、Weight Decay(0.01)、Label Smoothing
- **梯度裁剪**：max_norm=1.0
- **混合精度**：FP16 训练

### 关键变体与演进

| 模型 | 年份 | 创新 |
|------|------|------|
| **BERT** | 2018 | 双向预训练 + 掩码语言模型 |
| **GPT-2/3** | 2019-2020 | 自回归生成，规模扩大 |
| **ViT** | 2020 | 图像分patch作为序列输入 |
| **GPT-4** | 2023 | 多模态，规模进一步扩大 |
| **Flash Attention** | 2023 | IO感知的精确注意力，$O(n^2)$ 但常数极小 |

## 开放问题

- Transformer 的注意力机制是否是建模长程依赖的最优方式？ ^[ambiguous]
- 线性注意力（Performer、linear-algebra Transformer）能否完全替代标准注意力？
- 位置编码如何更好地泛化到训练时未见过的序列长度？

## 来源

- 03_深度学习/02_Neural_Network_Core/Neural_Network_Core.md（3.4 节自注意力机制）
- Vaswani et al. (2017) "Attention Is All You Need"
- Devlin et al. (2018) BERT, Radford et al. (2019) GPT-2

## Related

- [[概念/transformer-architecture-plain]] — Transformer 大白话解释
- [[概念/transformer-layer]] — Transformer Layer（层）大白话解释
- [[概念/causal-mask|因果掩码]]
- [[概念/next-token-prediction|下一个 Token 预测]]
- [[概念/attention-variants|Attention 变体]]
- [[概念/rope|RoPE]]
- [[概念/alibi|ALiBi]]
- [[治理/transformer-llm-architecture]] — Transformer 架构 × LLM 架构 (共享: attention, bert, gpt, nlp, transformer)
- [[05_大模型/07_Fine_tuning_Techniques/PEFT_2026]] — PEFT 2026 (参数高效微调) (共享: bert, gpt, nlp, transformer)
- [[05_大模型/07_Fine_tuning_Techniques/README]] — 微调技术 (Fine-tuning Techniques) (共享: bert, gpt, nlp, transformer)
- [[05_大模型/05_LLM_Architectures/LLM-Basics-in-nutshell]] — 大语言模型基础速成指南 (共享: bert, gpt, nlp, transformer)
- [[概念/Vision/multimodal-models.md|multimodal-models]]
- [[治理/llm-nlp]]

## See Also (深度专题)

- [[../../05_大模型/03_Transformer/Transformer_Architecture|Transformer 架构深度解析]] — Self-Attention / Multi-Head / FFN 的数学推导与实现
- [[../../05_大模型/03_Transformer/Transformer_Deep_Dive|Transformer 深度解读]] — 编码器-解码器、位置编码、归一化策略的技术细节
- [[../../05_大模型/04_Transformer_Revolution/Self_Attention_Mechanism|自注意力机制]] — Attention 的工程优化 (Flash Attention 等)

---

## 2026 Transformer 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **FlashAttention-3** | H100 专用 IO 感知注意力，1.5-2x 加速 | GA |
| **MoE (Mixture of Experts)** | 稀疏激活，推理成本降低 5-10x | GA |
| **GQA (Grouped Query Attention)** | 分组查询注意力，KV Cache 减少 4-8x | GA |
| **RoPE + YaRN** | 旋转位置编码 + 长上下文扩展 | GA |
| **RMSNorm** | 简化归一化，训练更稳定 | GA |

## 生产最佳实践

1. **FlashAttention 必开**：生产环境必须启用 FlashAttention，速度提升 2x+
2. **GQA 优先**：新模型优先选择 GQA，KV Cache 内存减少 4-8x
3. **MoE 降本**：高并发场景用 MoE 模型，推理成本降低 5-10x
4. **长上下文用 YaRN**：需要 128K+ 上下文时启用 YaRN 扩展
5. **量化部署**：生产环境用 AWQ/GPTQ 4-bit 量化，平衡质量与速度
6. **RMSNorm 稳定**：RMSNorm 比 LayerNorm 更稳定，新模型标配
7. **推理引擎选择**：vLLM/SGLang/TensorRT-LLM 均支持现代 Transformer

## 延伸阅读

- [[概念/LLM/transformer-architecture-plain|Transformer 大白话]]
- [[概念/LLM/attention-variants|注意力变体]]
- [[概念/LLM/grouped-query-attention|GQA]]
- [[概念/LLM/mamba|Mamba (SSM)]]
- [[05_大模型/05_LLM_Architectures/LLM-Basics-in-nutshell|大语言模型基础速成]]

## Transformer 架构演进

| 时期 | 代表 | 关键创新 |
|------|------|----------|
| 2017 | Transformer (Vaswani) | 自注意力机制 |
| 2018-2020 | GPT/BERT | 预训练 + 微调范式 |
| 2021-2023 | GPT-3/4, Llama | 规模扩展 + RLHF |
| 2024-2026 | GPT-5, Claude 4, Qwen3 | MoE + 长上下文 + 推理能力 |

> ℹ️ Transformer 架构仍在快速演进，MoE、长上下文、推理能力是当前主要发展方向。

## 延伸阅读

- [[概念/LLM/attention-variants|注意力变体]] — 注意力机制全景
- [[概念/LLM/llm-architectures|LLM 架构]] — 架构选型指南
- [[概念/LLM/flash-attention-kernels|Flash Attention]] — 算子优化
- [[概念/LLM/grouped-query-attention|GQA]] — 注意力压缩
