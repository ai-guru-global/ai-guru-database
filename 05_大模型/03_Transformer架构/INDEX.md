---
title: Transformer 架构
type: index
created: 2026-07-02
updated: 2026-08-05
sources: []
tags: [auto-index]
name_zh: "Transformer 架构"
name_en: "Transformer Architecture"
---

# Transformer 架构

> 中文简称：Transformer 架构 ｜ English Name: Transformer Architecture

Transformer 架构 — Attention 机制、Transformer 架构与 LLM 的基础理论体系（原 03_Transformer架构 与 04_Transformer革命 已合并）。

## 子域简介

本子域聚焦 Transformer 架构：

- **自注意力**: QKV、多头注意力、缩放点积
- **架构演进**: Encoder-only、Decoder-only、MoE
- **规模化**: Scaling Laws、涌现能力
- **优化**: Flash Attention、KV Cache

## 文件导航

- [[05_大模型/03_Transformer架构/03_Transformer_Revolution|Transformer Revolution]] — Transformer 知识体系：架构演进、Scaling Laws 与涌现能力（LLM 研究者 / NLP 工程师）
- [[05_大模型/03_Transformer架构/05_Transformer_大白话入门|Transformer 大白话入门]] — Transformer 入门：从注意力到 GPT 的全景速览（初学者 / NLP 学习者）
- [[05_大模型/03_Transformer架构/02_Self_注意力_Mechanism|Self Attention Mechanism]] — 自注意力机制详解：QKV、多头与缩放点积（研究者 / 进阶从业者）
- [[05_大模型/03_Transformer架构/04_Transformer_架构详解|Transformer 架构详解]] — 架构总览：Encoder-Decoder、位置编码、FFN（工程师 / 架构师）
- [[05_大模型/03_Transformer架构/06_Transformer_深度剖析_QKV|Transformer 深度剖析]] — 逐层拆解：QKV 注意力、RoPE/ALiBi、残差与 LayerNorm（研究者 / 资深工程师）
- [[05_大模型/03_Transformer架构/07_Transformer_训练推理应用|训练与推理应用]] — Transformer 在 LLM 训练与推理中的工程实践（工程师 / 部署人员）
- [[05_大模型/03_Transformer架构/08_Transformer与LLM架构|Transformer 与 LLM 架构]] — 从 Transformer 到 LLM 架构的衔接（全部读者）

## 核心概念速查

| 概念 | 说明 | 重要性 |
|------|------|------|
| Self-Attention | 自注意力机制 | ⭐⭐⭐⭐⭐ |
| Multi-Head | 多头注意力 | ⭐⭐⭐⭐⭐ |
| Positional Encoding | 位置编码 | ⭐⭐⭐⭐ |
| Feed-Forward | 前馈网络 | ⭐⭐⭐⭐ |
| Layer Norm | 层归一化 | ⭐⭐⭐⭐ |

## 架构类型对比

| 架构 | 代表 | 特点 | 适用 |
|------|------|------|------|
| Encoder-only | BERT | 双向理解 | 分类/NER |
| Decoder-only | GPT | 自回归生成 | 生成任务 |
| Encoder-Decoder | T5 | 序列到序列 | 翻译/摘要 |
| MoE | Mixtral | 稀疏专家 | 效率优先 |

## 技术演进时间线

| 时期 | 里程碑 | 贡献 |
|------|------|------|
| 2017 | Transformer | 自注意力架构 |
| 2018 | BERT/GPT | 预训练范式 |
| 2020 | GPT-3 | 规模化 + 涌现 |
| 2022 | ChatGPT | RLHF 对齐 |
| 2023 | LLaMA | 开源爆发 |
| 2024 | GPT-4o | 原生多模态 |
| 2025 | o3/R1 | 推理模型 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 为什么 Transformer 成功？ | 并行计算 + 长距离依赖 |
| 注意力复杂度？ | O(n²)，可用 Flash Attention 优化 |
| 位置编码作用？ | 注入位置信息 |
| 为什么 Decoder-only 主流？ | 生成任务更适合 |

## Related

- [[05_大模型/index|大模型首页]]
- [[05_大模型/02_序列模型/index|Sequence Models]]
- [[03_深度学习/index|深度学习]]
- [[概念/transformer-architecture|Transformer 架构]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 8 |
| 最后更新 | 2026-08-05 |

> 💡 Transformer 是 21 世纪最重要的 AI 架构创新，它彻底改变了 NLP 和整个 AI 领域。

## 附录：注意力公式

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V

Multi-Head(Q, K, V) = Concat(head_1, ..., head_h) W^O
where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```

## 附录：Transformer 组件

| 组件 | 功能 | 关键参数 |
|------|------|------|
| Multi-Head Attention | 并行注意力 | num_heads, d_model |
| Feed-Forward | 非线性变换 | d_ff, activation |
| Layer Norm | 稳定训练 | Pre-LN vs Post-LN |
| Positional Encoding | 位置信息 | RoPE, ALiBi |
| Residual Connection | 梯度流动 | 跳跃连接 |

## 附录：Scaling Laws

| 规模 | 参数量 | 数据量 | 计算量 |
|------|------|------|------|
| Small | 100M | 10B | 10^18 |
| Medium | 1B | 100B | 10^19 |
| Large | 10B | 1T | 10^20 |
| XL | 100B+ | 10T+ | 10^21+ |

## 附录：涌现能力

| 能力 | 出现规模 | 说明 |
|------|------|------|
| 少样本学习 | ~10B | 无需微调 |
| 思维链 | ~100B | 逐步推理 |
| 代码生成 | ~10B | 编程能力 |
| 多语言 | ~10B | 跨语言迁移 |

## 附录：优化技术

| 技术 | 说明 | 效果 |
|------|------|------|
| Flash Attention | IO 感知 | 2-4x 加速 |
| KV Cache | 缓存注意力 | 推理加速 |
| GQA | 分组查询 | 显存优化 |
| MoE | 稀疏专家 | 效率提升 |

## 附录：学习路径

| 阶段 | 内容 | 目标 |
|------|------|------|
| 入门 | Attention 基础 | 理解注意力 |
| 进阶 | Transformer 架构 | 掌握组件 |
| 实践 | 代码实现 | 动手实现 |
| 拓展 | Scaling Laws | 理解规模化 |

## 附录：相关论文

| 论文 | 年份 | 贡献 |
|------|------|------|
| Attention Is All You Need | 2017 | Transformer 架构 |
| BERT | 2018 | 双向预训练 |
| GPT-3 | 2020 | 规模化涌现 |
| Scaling Laws | 2020 | 规模定律 |
| Flash Attention | 2022 | IO 优化 |

## 附录：注意力变体

| 变体 | 复杂度 | 适用场景 | 代表 |
|------|------|------|------|
| Full Attention | O(n²) | 短序列 | BERT/GPT |
| Sparse Attention | O(n√n) | 长序列 | Longformer |
| Linear Attention | O(n) | 超长序列 | Linear Transformer |
| Flash Attention | O(n²) IO优化 | 训练加速 | 所有现代 LLM |
| GQA | O(n²) KV压缩 | 推理优化 | Llama 3 |

## 附录：位置编码对比

| 方法 | 原理 | 优点 | 代表 |
|------|------|------|------|
| 正弦 | 固定函数 | 无需训练 | Transformer |
| 可学习 | 训练学习 | 灵活 | BERT |
| RoPE | 旋转矩阵 | 外推性好 | LLaMA/Qwen |
| ALiBi | 线性偏置 | 长度外推 | BLOOM |

## 附录：Pre-LN vs Post-LN

| 类型 | 位置 | 优点 | 缺点 |
|------|------|------|------|
| Post-LN | 残差后 | 原始设计 | 训练不稳定 |
| Pre-LN | 残差前 | 训练稳定 | 性能略低 |

## 附录：模型规模参考

| 模型 | 参数量 | 层数 | 隐藏层 | 头数 |
|------|------|------|------|------|
| BERT-base | 110M | 12 | 768 | 12 |
| GPT-2 | 1.5B | 48 | 1600 | 25 |
| LLaMA-7B | 7B | 32 | 4096 | 32 |
| LLaMA-70B | 70B | 80 | 8192 | 64 |

## 附录：训练 vs 推理

| 阶段 | 特点 | 优化重点 |
|------|------|------|
| 训练 | 前向+反向 | 吞吐量、显存 |
| 推理 | 仅前向 | 延迟、吞吐 |
| Prefill | 处理输入 | 并行计算 |
| Decode | 生成输出 | KV Cache |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 推理模型 | o3/R1/QwQ | 测试时计算 |
| 原生多模态 | GPT-4o/Gemini 2 | 统一架构 |
| 长上下文 | 1M+ tokens | 更大窗口 |
| 效率优化 | Flash Attention 3 | 更快训练 |
| 小模型 | Phi-4/Qwen3-0.6B | 端侧部署 |

> 💡 Transformer 的核心创新：用自注意力机制替代循环结构，实现并行计算和长距离依赖建模。
