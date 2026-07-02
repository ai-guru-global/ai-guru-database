---
title: "Large Language Model"
category: concepts
tags: [llm, nlp, transformer, foundation-model, generative-ai]
summary: "大语言模型（LLM）是基于 Transformer 架构、通过海量文本预训练得到的超大规模神经网络，能够理解、生成和推理自然语言，是当前生成式 AI 与智能代理的核心底座。"
created: 2026-07-02
updated: 2026-07-02
sources: []
---

# Large Language Model（大语言模型）

## 定义

大语言模型（Large Language Model，LLM）是一类参数量通常在数十亿到数万亿级别、以自然语言为主要处理对象的深度神经网络。它通过在海量无标注文本上进行自监督预训练，学习语言的统计规律、世界知识与推理模式，从而具备文本生成、理解、翻译、摘要、问答等多种能力。

## 核心原理与组成

LLM 的核心架构几乎普遍基于 Transformer，尤其是 Decoder-only 的 GPT 类结构。其训练通常分为两个阶段：

- **预训练（Pre-training）**：使用自回归的 Next Token Prediction 目标，在大规模语料上学习通用语言表示。
- **后训练（Post-training）**：通过 SFT（监督微调）、RLHF / DPO 等对齐技术，使模型遵循人类指令、减少有害输出。

关键组成包括 Tokenizer（将文本切分为 token）、Embedding 层、多层 Transformer Block（Self-Attention + FFN）、LayerNorm 以及输出层。推理时通过 KV Cache 与解码策略（如 Temperature Sampling、Top-p）生成连贯文本。

## 典型用例

- **对话与问答**：ChatGPT、Claude、Kimi、Qwen 等 Chat 模型。
- **内容生成**：文案、代码、报告、邮件与创意写作。
- **信息抽取与推理**：命名实体识别、关系抽取、数学与逻辑推理。
- **RAG 与 Agent**：作为检索增强生成和智能代理的"大脑"。

## 与相关概念的区别与联系

- **Foundation Model**：LLM 是 Foundation Model 的最典型子集，但后者还包括多模态基础模型。
- **Transformer**：Transformer 是 LLM 的主流架构底座，LLM 是 Transformer 在语言任务上的规模化产物。
- **SLM（小语言模型）**：参数量更小、可在端侧运行，是 LLM 在资源受限场景下的补充。

## Related

- [[_concepts/foundation-model|Foundation Model]]
- [[_concepts/llm-architectures|LLM 架构]]
- [[_concepts/transformer-architecture|Transformer 架构]]
- [[_concepts/prompt-engineering|Prompt Engineering]]
- [[_concepts/tokenization|Tokenization]]
- [[_concepts/rlhf|RLHF]]
- [[05_NLP_LLMs/index|NLP LLMs]]
- [[_concepts/index|Concepts Index]]
