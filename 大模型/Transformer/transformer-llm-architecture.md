---
title: Transformer 架构 × LLM 架构
category: -synthesis
tags: [nlp, transformer, llm, bert, gpt, attention, architecture]
sources: [概念/transformer-architecture.md, 概念/llm-architectures.md]
created: 2026-05-31T21:30:00+08:00
updated: 2026-05-31T21:30:00+08:00
summary: "从自注意力机制到Decoder-only范式：Transformer如何成为所有现代大语言模型的唯一基座，以及MoE、推理模型等架构演进如何在此之上生长。"
provenance:
  extracted: 0.3
  inferred: 0.6
  ambiguous: 0.1
base_confidence: 0.70
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
aliases:
  - "Transformer Llm Architecture"
  - "transformer llm architecture"

---
# Transformer 架构 × LLM 架构

## The Connection

Transformer（2017）本是一个序列到序列的翻译模型，却意外成为了整个 LLM 时代的"原子核"。BERT 拿走了它的 Encoder，GPT 拿走了它的 Decoder，而今天的 Llama、Claude、Gemini 几乎全是 Decoder-only 的变体。这不是简单的技术继承，而是**一个架构范式对任务形态的重新定义**：当生成任务成为主流，双向注意力反而成了累赘，因果掩码 + 自注意力才是规模化的最优解。

## Where They Co-occur

- 几乎所有 [[概念/llm-architectures]] 页面都会回溯到 [[概念/transformer-architecture]] 的注意力公式
- 混合专家（MoE）模型（如 Mixtral、DeepSeek-V3）在 Transformer Block 内部做稀疏化，而非推翻它
- 推理模型（o1/o3/DeepSeek-R1）的"长思维链"能力，本质上是 Transformer 自回归生成在测试时的计算扩展

## Cross-cutting Insight

> **Decoder-only 不是 Transformer 的必然归宿，而是数据规模与任务类型共同选择的结果。**

当训练数据达到互联网级别，生成任务的自监督信号（next token prediction）比理解任务（masked language modeling）更容易规模化。Encoder-only（BERT）在中小数据上表现优异，但在万亿 token 级别被 Decoder-only 反超。这意味着架构选择不仅是技术问题，更是**数据经济学**问题。

## Tensions and Trade-offs

- **效率 vs 表达能力**：Transformer 的 O(n²) 注意力是长文本的瓶颈，催生了 [[概念/state-space-models]]（Mamba）等替代架构，但尚未动摇其统治地位
- **统一架构 vs 专用优化**：视觉 Transformer（ViT）试图将图像 patches 当作 tokens 处理，但 CNN 在边缘设备上仍更高效
- **推理成本**：Transformer 的 KV Cache 内存随序列长度线性增长，是模型服务中的首要优化目标

## Open Questions

- 状态空间模型（Mamba）能否在 10B+ 规模上追上 Transformer 的 perplexity？
- 如果多模态成为主流，统一的 Transformer 架构是否会被模态专用模块侵蚀？
- 测试时计算扩展（test-time compute）是否会改变 Transformer 的训练目标设计？

## Related

- [[大模型/Fine_tuning_Techniques/PEFT_2026]] — PEFT 2026 (参数高效微调) (共享: bert, gpt, llm, nlp, transformer)
- [[大模型/Fine_tuning_Techniques/README]] — 微调技术 (Fine-tuning Techniques) (共享: bert, gpt, llm, nlp, transformer)
- [[大模型/LLM_Architectures/LLM-Basics-in-nutshell]] — 大语言模型基础速成指南 (共享: bert, gpt, llm, nlp, transformer)
- [[大模型/Multimodal_Models/Multimodal_Architectures_2026]] — 多模态模型架构 2026：从 GPT-4V 到原生多模态 AGI (共享: bert, gpt, llm, nlp, transformer)
