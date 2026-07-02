---
title: Context Window
category: concepts
tags: [context-window, llm, attention, tokenization, long-context]
summary: 上下文窗口（Context Window）指语言模型在生成下一个 token 时能够同时参考的前文 token 数量上限，是决定模型记忆范围与推理能力的关键超参数。
created: 2026-07-02
updated: 2026-07-02
---

上下文窗口（Context Window）是 Transformer 类语言模型在单次前向传播中能够“看到”的 token 序列长度上限。它通常以 token 数量计量，例如 4K、128K 甚至 1M tokens。窗口内的文本（包括用户输入、系统提示和历史对话）会被编码为嵌入向量，经过自注意力机制计算，从而影响下一个 token 的生成。

核心组成上，上下文窗口由模型架构与位置编码共同决定。自注意力的计算复杂度随序列长度平方增长，因此扩大窗口需要更长的训练序列、更高效的位置编码（如 RoPE、ALiBi）以及 KV Cache 优化。推理时，超出窗口的旧 token 会被截断或采用滑动窗口丢弃，导致模型“遗忘”。

典型用例包括：长文档问答、代码库级理解与生成、多轮对话一致性维护，以及 RAG 场景中对检索结果的拼接。窗口越大，模型越能利用远距离依赖，但也会带来更高的显存占用与推理延迟。

上下文窗口与“上下文学习”（In-context Learning）不同：前者是输入长度的硬性限制，后者是利用提示中的示例学习新任务的能力。它与 KV Cache 密切相关，因为扩大窗口会直接增加缓存显存；与长上下文模型、RAG 则是互补关系——窗口决定“能放多少”，RAG 决定“放什么”。

## Related

- [[_concepts/tokenization|Tokenization]]
- [[_concepts/attention-variants|Attention 机制]]
- [[_concepts/transformer-architecture|Transformer 架构]]
- [[_concepts/kv-cache|KV Cache]]
- [[_concepts/long-context-models|长上下文模型]]
- [[_concepts/rag-systems|RAG]]
- [[_concepts/prompt-engineering|Prompt Engineering]]
- [[_concepts/llm-architectures|LLM 架构]]
