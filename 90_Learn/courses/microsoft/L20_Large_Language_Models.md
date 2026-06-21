---
title: "L20 - 大语言模型提示编程与少样本任务"
category: "90-learn"
tags: ["microsoft-ai-course", "nlp", "llm", "prompt-engineering", "few-shot-learning"]
summary: "本课介绍预训练大语言模型（GPT 系列）的核心思想：通过自监督语言建模习得通用语言能力，并借助提示工程（Prompt Engineering）与少样本示例完成多种下游任务。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/5-NLP/20-LangModels/README.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L20 - 大语言模型提示编程与少样本任务

> **一句话理解**：当模型在海量文本上学会“预测下一个词”，它也就学会了理解语言、知识与常识；我们只需写好提示，就能让它完成翻译、摘要、问答等多种任务。

## 本课概览

本课位于 Microsoft AI for Beginners 的 **自然语言处理（NLP）模块** 末尾，承接第 18 课的 Transformer 与 BERT、第 19 课的命名实体识别（NER）。在前面课程中，我们大多先用大量标注数据训练模型，再针对具体任务微调。本课则换一个视角：当语言模型足够大、训练数据足够多时，它可以在 **不做任何下游任务训练** 的情况下，仅凭自然语言指令或少量示例完成任务。

学习目标：

- 理解“自监督语言建模 → 通用语言能力 → 零样本/少样本任务”这条主线。
- 掌握困惑度（Perplexity）作为语言模型内在评估指标的含义与计算方式。
- 认识 GPT 系列模型的发展脉络与能力边界。
- 了解提示工程（Prompt Engineering）的基本思想，以及少样本学习（Few-Shot Learning）如何通过示例引导模型行为。

## 核心概念

### 1. 语言模型 = 条件概率估计器

文本生成模型并不直接“理解”语义，而是学习给定前文后预测下一个词的条件概率：

$$
P(w_N \mid w_{N-1}, \dots, w_0)
$$

这与仅仅统计语料中词频得到的无条件概率 $P(w_N)$ 不同。模型学会的是 **上下文依赖的语义与语法约束**，因此能生成连贯、符合人类语言习惯的文本。

### 2. 自监督预训练

GPT（Generative Pre-trained Transformer，生成式预训练 Transformer）不需要人工标注标签。它通过在海量无标注文本上不断做“预测下一个词”的任务，以 **自监督学习（Self-Supervised Learning）** 方式训练。训练完成后，模型不仅掌握语言结构，还内化了训练语料中涉及的常识、事实与推理模式。

### 3. 困惑度（Perplexity）

困惑度是衡量语言模型质量的内在指标，反映模型对测试文本的“惊讶程度”。模型越确信一段真实文本，其概率越高，困惑度越低。

数学上，对包含 $N$ 个词的测试集 $W = (W_1, \dots, W_N)$，困惑度定义为：

$$
\mathrm{Perplexity}(W) = \sqrt[N]{1 \over P(W_1, \dots, W_N)}
$$

直观理解：困惑度越低，模型越能准确预测下一个词，生成的文本越自然。

### 4. 提示工程（Prompt Engineering）

由于 GPT 类模型在海量文本和代码上训练，它们能够根据输入的 **提示（Prompt）** 产生对应输出。提示工程就是设计最合适的词句、格式、符号或示例，以引导模型生成期望结果。它不是修改模型参数，而是调整输入来激活模型已有的能力。

### 5. 零样本与少样本任务

- **零样本（Zero-Shot）**：直接给出任务描述，不提供示例，模型根据指令完成。
- **少样本（Few-Shot）**：在提示中给出若干输入-输出示例，模型据此推断任务模式并泛化到新输入。

这种能力让大语言模型在缺少标注数据的场景下也能快速部署。

## 关键知识点

- GPT 系列的核心思路是“先用自监督学习训练通用语言模型，再凭提示解决下游任务”。
- 模型质量可用困惑度评估：对真实文本赋予高概率、低困惑度。
- GPT 不是单一模型，而是 OpenAI 推出的一系列模型家族，规模与能力持续提升。
- GPT-2 最大 15 亿参数；GPT-3 最大 1750 亿参数；GPT-4 进一步扩展到多模态输入（图像+文本）。
- 提示工程关注“如何说”而非“改模型”：清晰的指令、合适的格式、少量示例都能显著影响输出。
- 大语言模型可通过 Azure OpenAI Service 或 OpenAI API 直接调用，无需自行训练。

## 代码/实验说明

本课官方提供一份可运行的 Jupyter Notebook：

- **PyTorch 版本**：[`GPT-PyTorch.ipynb`](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/20-LangModels/GPT-PyTorch.ipynb)（在官方仓库 `lessons/5-NLP/20-LangModels/` 目录下）。

**Notebook 主要内容概述**：

1. 使用 Hugging Face Transformers 加载 OpenAI GPT/GPT-2 模型。
2. 给定一段前缀文本，让模型自动续写生成后续文本。
3. 通过调整 `max_length`、`temperature`、`top_k`、`top_p` 等采样参数，观察生成结果的多样性。
4. 演示如何将提示作为输入，让模型完成简单的文本补全或问答。

**核心代码片段（示意）**：

```python
from transformers import GPT2Tokenizer, GPT2LMHeadModel

# 加载 GPT-2 分词器与模型
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

# 输入提示
prompt = "In the future, artificial intelligence will"
inputs = tokenizer(prompt, return_tensors="pt")

# 生成文本
outputs = model.generate(
    **inputs,
    max_length=50,
    num_return_sequences=1,
    do_sample=True,
    temperature=0.7,
    top_p=0.9,
)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

> **注意**：本课官方 Notebook 主要提供 **PyTorch + Hugging Face** 实现，未单独提供 TensorFlow 版本。如果你想用 TensorFlow/Keras，可改用 `transformers` 库中的 `TFGPT2LMHeadModel` 接口，核心流程相同。

**运行建议**：在本地或 Azure 的 GPU/CPU 环境中安装 `transformers`、`torch` 后即可运行。若不想本地部署，也可通过 Hugging Face 的 [GPT-2 文本补全编辑器](https://transformer.huggingface.co/doc/gpt2-large)在线体验：输入文本后按 `[TAB]` 获取续写候选，重复按 `[TAB]` 可获取更长或更多样的建议。

## 本课不覆盖与延伸

- **不覆盖**：
  - Transformer 内部自注意力机制细节（见第 18 课与本库 [[05_NLP_LLMs/Transformer_Revolution/Transformer_Revolution]]）。
  - 大语言模型的微调、量化、部署与推理优化（见本库 [[07_Model_Training/Fine_tuning_Strategies]]、[[10_Deployment_Inference/Deployment_Inference_2026]]）。
  - 提示工程的高级技巧（链式思考、思维树、提示注入防御等，见本库 [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]]）。

- **延伸**：
  - 想了解更系统的提示工程方法论，可阅读本库 [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]] 与 [[15_Agent_Production/README]] 中的智能体设计模式。
  - 想深入 LLM 架构演进（GPT、BERT、T5、LLaMA 等），参考 [[05_NLP_LLMs/LLM_Architectures/LLM_Architectures]]。
  - 对 Azure OpenAI Service 感兴趣，可进一步学习微软官方文档与 Azure AI SDK 示例。

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：
  - [[05_NLP_LLMs/LLM_Architectures/LLM_Architectures]]
  - [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]]
