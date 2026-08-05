---
title: "Transformer 深度剖析：从 QKV 到完整架构"
category: 05-nlp-llms
tags: ["transformer", "attention", "QKV", "multi-head-attention", "positional-encoding", "RoPE", "ALiBi", "feedforward", "layernorm", "residual-connection"]
summary: "> 从序列建模的根本挑战出发，逐层拆解 Transformer 的每个核心组件——QKV 注意力、缩放点积、多头机制、位置编码（正弦/RoPE/ALiBi）、FFN、残差连接、LayerNorm，最终组装为完整的 Encoder-Decoder 架构。"
source: "来源/yeasy/llm_internals/ (Ch1-4)"
created: 2026-06-17
updated: 2026-06-17
tier: supporting
aliases:
  - "Transformer Deep Dive"
  - Transformer_Deep_Dive
  - "Transformer 深度剖析：从 QKV 到完整架构"
sources: []

name_zh: "Transformer 深度剖析：从 QKV 到完整架构"
---
# Transformer 深度剖析：从 QKV 到完整架构

> 中文简称：Transformer 深度剖析：从 QKV 到完整架构

> **核心命题**: Transformer 完全抛弃循环和卷积结构，仅用注意力机制 + 前馈网络 + 位置编码构建整个模型，同时解决了序列建模的三大根本难题——变长输入、长距离依赖、计算效率。

---

## TL;DR

- **QKV 注意力**: 将输入投影为 Query / Key / Value 三个独立角色，实现"软检索"式的信息聚合
- **缩放点积**: 除以 $\sqrt{d_k}$ 防止 Softmax 饱和导致梯度消失，是训练稳定性的关键设计
- **多头注意力**: 多个子空间并行关注不同类型的语义关系，总计算量与单头相同
- **位置编码**: 从正弦编码到 RoPE（旋转位置编码）、ALiBi（线性偏置），解决注意力的置换等变问题
- **FFN**: 逐位置非线性变换，充当 Transformer 的"记忆层"
- **残差 + LayerNorm**: Pre-Norm + RMSNorm 是现代 LLM 的标准配置，使百层网络训练成为可能

---

## 关联文档

- [[05_大模型/03_Transformer架构/14_Transformer 架构详解]] — Transformer 架构详解（入门版）
- [[05_大模型/03_Transformer架构/02_Self_注意力_Mechanism]] — Self-Attention 机制
- [[07_模型训练/01_训练基础/03_LLM_训练_深入分析]] — LLM 训练深度剖析
- [[10_部署推理/03_推理优化/02_LLM推理_深入分析]] — LLM 推理深度剖析
- [[05_大模型/05_LLM架构/04_LLM_架构_Evolution]] — LLM 架构演进

---

## 1. 序列建模的根本挑战与 Transformer 的诞生

### 1.1 三大核心难题

任何序列模型都必须同时解决：

1. **变长输入**: 句子长度从 1 到数千词不等，模型必须处理任意长度
2. **长距离依赖**: "那个昨天在公园里遇到的穿红色外套的**女孩**，今天又**来了**"——主语和谓语相隔多词
3. **计算效率**: 串行处理无法利用 GPU 并行能力，训练速度成为瓶颈

### 1.2 前驱架构的局限

| 特性 | RNN/LSTM | CNN | Transformer |
|------|----------|-----|-------------|
| 单层计算复杂度 | $O(n \cdot d^2)$ | $O(k \cdot n \cdot d^2)$ | $O(n^2 \cdot d)$ |
| 顺序依赖步数 | $O(n)$ | $O(1)$ | $O(1)$ |
| 梯度回传最长路径 | $O(n)$ | $O(\log_k n)$ | $O(1)$ |

- **RNN**: 解决了变长输入，LSTM 改善了梯度消失，但串行计算 $h_t = f(h_{t-1}, x_t)$ 无法并行
- **CNN**: 天然并行但感受野有限，需多层堆叠才能覆盖长距离
- **Transformer**: 自注意力让任意两位置路径 $O(1)$，完全并行，且当 $n < d$（NLP 常见）时实际更快

### 1.3 注意力机制的演进

1. **Bahdanau 注意力 (2015)**: 加性注意力 $e_{tj} = v^T \tanh(W_s s_t + W_h h_j)$，解决 Seq2Seq 信息瓶颈
2. **Luong 点积注意力 (2015)**: $e_{tj} = s_t^T h_j$，无需额外参数，可用矩阵乘法批量计算
3. **Transformer 自注意力 (2017)**: 完全基于 QKV 的缩放点积注意力，不需要 RNN

---

## 2. QKV 注意力机制

### 2.1 查询-键-值的信息检索直觉

类比搜索引擎：
- **Query** = 搜索词（"我需要什么信息？"）
- **Key** = 网页关键词（"我有什么信息？"）
- **Value** = 网页内容（"被关注后提供什么信息？"）

关键区别：注意力做的是**软匹配**——根据匹配度对所有 Value 加权混合，而非只返回最匹配的一个结果。

### 2.2 为什么需要三个独立投影

$$Q = XW^Q, \quad K = XW^K, \quad V = XW^V$$

- **Q 和 K 分离**: 一个位置在"被查找"时和"提供信息"时需要不同的表示角色
- **K 和 V 分离**: "如何被找到"（索引）与"提供什么内容"（数据）应在不同表示空间，如同数据库中 ISBN 号与书内容的关系
- 维度约束: $d_k = d_v$（Q/K 需点积匹配），主流实践中 $d_k = 64$ 或 $128$

### 2.3 缩放点积注意力

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

**四步计算流程**:
1. 计算注意力分数 $S = QK^T \in \mathbb{R}^{n \times n}$
2. 缩放 $S' = S / \sqrt{d_k}$，保持点积方差为常数 1
3. Softmax 归一化得到注意力权重 $A$
4. 加权求和 $\text{Output} = AV$

**为什么必须缩放**: 假设 $q_i, k_i \sim \mathcal{N}(0,1)$，则点积方差 $= d_k$。当 $d_k = 128$ 时标准差 $\approx 11.3$，Softmax 进入饱和区导致梯度消失。除以 $\sqrt{d_k}$ 将方差重新缩放为 1。

### 2.4 多头注意力

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O$$

其中 $\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$

**为什么多头有效**:
- **子空间分解**: 每个头在低维子空间专注一种关系类型（语法、语义、位置等）
- **计算代价不变**: $h \times O(n^2 \cdot d/h) = O(n^2 \cdot d)$，与单头相同
- **设计逻辑**: 先确定单头维度 $d_k \in \{64, 128\}$，再反推 $h = d_{\text{model}} / d_k$

### 2.5 三种注意力变体

| 注意力类型 | 位置 | Q 来源 | K/V 来源 | 掩码 |
|-----------|------|-------|---------|------|
| 自注意力 | 编码器 | 同一序列 | 同一序列 | 无 |
| 掩码自注意力 | 解码器第一子层 | 同一序列 | 同一序列 | 因果掩码 |
| 交叉注意力 | 解码器第二子层 | 解码器 | 编码器输出 | 无 |

**因果掩码**: 上三角填充 $-\infty$，使 Softmax 后未来位置权重为零，保证自回归模型不"偷看"后续内容：
$$\text{Mask}_{ij} = \begin{cases} 0 & j \leq i \\ -\infty & j > i \end{cases}$$

---

## 3. 位置编码

### 3.1 为什么必须显式注入位置

自注意力对输入顺序是**置换等变**的——"我爱你"和"你爱我"中每个词的注意力权重分配完全相同。RNN 通过顺序处理天然编码位置，Transformer 去掉循环后必须额外注入。

### 3.2 正弦位置编码（Sinusoidal PE）

$$\text{PE}(pos, 2i) = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right), \quad \text{PE}(pos, 2i+1) = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

**设计直觉**:
- **多频率**: 频率按几何级数排列，高频区分相邻位置，低频区分远距离位置（类比二进制计数器）
- **线性变换性**: $\text{PE}(pos+k) = M_k \cdot \text{PE}(pos)$，$M_k$ 为分块旋转矩阵，只依赖偏移 $k$
- **几何直觉**: 每对 (sin, cos) 在二维平面上描绘单位圆，所有维度构成高维环面；位置偏移 = 环面上的旋转

### 3.3 旋转位置编码（RoPE）—— 现代 LLM 的标准

RoPE 不再与嵌入相加，而是**对 Q 和 K 向量施加旋转**：

$$\bigl(R(m\theta) q\bigr)^T \bigl(R(n\theta) k\bigr) = q^T R((n-m)\theta) k$$

**核心优势**:
- **天然相对位置**: 旋转后点积自动变为相对距离 $(n-m)$ 的函数
- **长度外推潜力**: 旋转对任意位置有定义，配合位置内插/NTK 缩放/YaRN 可扩展到 128K+
- **高效实现**: 逐元素乘加，几乎零额外计算成本
- **代表模型**: Llama, Gemma, DeepSeek, Mistral 等几乎所有现代 LLM

### 3.4 ALiBi（线性偏置）

$$\text{score}(q_m, k_n) = q_m^T k_n - r \cdot (m - n)$$

不添加任何位置编码向量，直接在注意力分数上加距离惩罚。不同头使用不同斜率 $r_i = 2^{-8i/h}$。外推能力出色（1024 训练可直接推理 2048+），代表模型 BLOOM。

### 3.5 位置编码方案对比

| 方案 | 类型 | 注入点 | 外推 | 额外参数 | 代表模型 |
|------|------|--------|------|---------|---------|
| 正弦编码 | 绝对 | 嵌入层相加 | 理论有 | 无 | 原始 Transformer |
| 可学习编码 | 绝对 | 嵌入层相加 | 无 | $L_{\max} \times d$ | GPT-2, BERT |
| RoPE | 相对 | Q/K 旋转 | 强 | 无 | Llama, DeepSeek |
| ALiBi | 相对 | 注意力偏置 | 强 | 无 | BLOOM |

---

## 4. 前馈网络（FFN）

$$\text{FFN}(x) = \sigma(x W_1 + b_1) W_2 + b_2$$

**结构**: 两层全连接 + 激活函数，$d_{ff} = 4 \times d_{\text{model}}$（先升维再降维的沙漏结构）

**为什么需要 FFN**:
- **直觉分工**: 注意力 = "开会交流"（跨位置信息路由），FFN = "闭门思考"（逐位置深度加工）
- **数学必要性**: 提供逐位置非线性变换和通道混合，与注意力的跨位置交互互补
- **记忆层**: FFN 的 $W_1$ 类似键存储激活模式，$W_2$ 映射为输出，编辑 FFN 参数可精确修改事实知识

**激活函数演进**:
- ReLU（原始 Transformer）→ GELU（GPT-2/BERT）→ **SwiGLU**（Llama 等现代模型）
- SwiGLU 使用 gate/up/down 三投影，中间维度约 $\frac{8}{3}d_{\text{model}}$，参数量接近传统 4x 但表达能力更强

---

## 5. 残差连接与层归一化

### 5.1 残差连接

$$\text{output} = x + \text{Sublayer}(x)$$

**为什么有效**: 梯度 $\frac{\partial h_l}{\partial h_{l-1}} = I + \frac{\partial F_l}{\partial h_{l-1}}$，单位矩阵 $I$ 提供梯度"高速公路"，即使 $F_l$ 梯度很小也能无损传播。这是 Transformer 能堆叠 96+ 层的根本原因。

**维度一致性**: 残差要求 $x$ 和 $\text{Sublayer}(x)$ 维度完全一致，所以所有层输出保持 $d_{\text{model}}$。

**前沿: 注意力残差 (AttnRes, 2026)**: Pre-Norm 稀释问题——所有层以固定单位权重相加，深层贡献被浅层累积稀释。用深度维度上的注意力替代盲目求和，Block AttnRes 在 48B 模型上 +7.5 分 GPQA-Diamond。

### 5.2 层归一化

$$\text{LN}(x) = \gamma \frac{x - \mu_L}{\sqrt{\sigma_L^2 + \epsilon}} + \beta$$

**LayerNorm vs BatchNorm**: LayerNorm 沿特征维度归一化（每个样本独立），不受 batch size 和序列长度影响，适合变长序列和自回归推理。

**Pre-Norm vs Post-Norm**:
- Post-Norm: $\text{LN}(x + \text{Sublayer}(x))$ — 原始论文
- **Pre-Norm**: $x + \text{Sublayer}(\text{LN}(x))$ — 现代标准，训练更稳定

**RMSNorm**: 省去均值计算，只用均方根缩放，参数量减半，计算量减少 10-15%，Llama/Gemma/Mistral 均采用。

$$\text{RMSNorm}(x) = \frac{x}{\sqrt{\frac{1}{d}\sum x_i^2 + \epsilon}} \cdot \gamma$$

---

## 6. 完整 Encoder-Decoder 架构

### 6.1 数据流

```
原始文本 → 分词器 → 词元索引 → 词嵌入 + 位置编码
  → [多头自注意力 → 残差+LN → FFN → 残差+LN] × N 层
  → 上下文化表示
```

### 6.2 三种架构变体

| 变体 | 注意力类型 | 代表模型 | 擅长任务 |
|------|-----------|---------|---------|
| 仅编码器 | 全双向自注意力 | BERT, RoBERTa | 分类、NER、语义相似度 |
| 仅解码器 | 因果掩码自注意力 | GPT, Llama, DeepSeek | 文本生成、对话（当前主流） |
| 编码器-解码器 | 双向 + 交叉注意力 | T5, BART | 翻译、摘要 |

### 6.3 GQA 与 MQA

- **MHA**: 每个头独立 Q/K/V，KV 缓存随头数线性增长
- **GQA**: 多个 Q 头共享一组 KV（如 Llama 2-70B: 64 Q 头 / 8 KV 头），KV 缓存减至 1/8，质量损失 < 0.5%
- **MQA**: 所有 Q 头共享一组 KV，缓存最小但质量下降明显
- GQA 已成为 2024 年后几乎所有主流 LLM 的标配

### 6.4 注意力复杂度

单头注意力: $O(n^2 d)$，内存 $O(n^2)$

| 序列长度 | 注意力矩阵大小 | FP16 内存 | 相对计算量 |
|---------|--------------|----------|-----------|
| 512 | 262K | 0.5 MB | 1x |
| 8,192 | 67M | 128 MB | 256x |
| 131,072 | 17.2B | 32 GB | 65,536x |

平方复杂度催生了 [[kv-cache]]、[[05_大模型/05_LLM架构/11_Long_上下文_模型_2026]]、稀疏注意力、[[mixture-of-experts]]、SSM/Mamba 等优化方向，详见 [[10_部署推理/03_推理优化/02_LLM推理_深入分析]]。

---

## 参考来源

- 原始书籍: `来源/yeasy/llm_internals/01_introduction/` (Ch1: Transformer 的提出)
- 原始书籍: `来源/yeasy/llm_internals/02_attention/` (Ch2: 注意力机制)
- 原始书籍: `来源/yeasy/llm_internals/03_components/` (Ch3: 核心组件)
- 原始书籍: `来源/yeasy/llm_internals/04_position_encoding/` (Ch4: 位置编码)
