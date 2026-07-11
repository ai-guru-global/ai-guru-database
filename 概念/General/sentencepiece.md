---
title: "SentencePiece 分词库 (SentencePiece Tokenization Library)"
category: -concepts
tags: ["sentencepiece", "tokenization", "bpe", "unigram", "preprocessing", "nlp"]
relationships:
  - target: "概念/tokenization"
    type: related_to
  - target: "概念/llm-architectures"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "SentencePiece 是 Google 开源的语言无关分词库，支持 BPE 和 Unigram 两种算法。多数中日韩 LLM（LLaMA/Qwen/ChatGLM）使用 SentencePiece 训练的 tokenizer。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
---

# SentencePiece 分词库

> **一句话理解**: SentencePiece 是"LLM 的分词基础设施"——Google 开源，大多数中日韩大模型（LLaMA/Qwen/ChatGLM）都用它训练的分词器。

---

## 1. 定位

| 维度 | 信息 |
|------|------|
| **项目** | SentencePiece |
| **来源** | Google |
| **功能** | 语言无关的分词 (Tokenization) |
| **算法** | BPE + Unigram |
| **开源** | Apache 2.0 |
| **GitHub** | github.com/google/sentencepiece |

---

## 2. 分词算法

| 算法 | 原理 | 特点 |
|------|------|------|
| **BPE** (Byte Pair Encoding) | 迭代合并高频字节对 | 确定性强，子词覆盖好 |
| **Unigram** | 从大词表逐步删除低概率 token | 概率化，可生成多种分词 |

---

## 3. 使用方式

```python
import sentencepiece as spm

# 训练分词器
spm.SentencePieceTrainer.train(
    input='corpus.txt',
    model_prefix='my_tokenizer',
    vocab_size=32000,
    model_type='bpe'  # or 'unigram'
)

# 加载并分词
sp = spm.SentencePieceProcessor()
sp.load('my_tokenizer.model')

# 编码
tokens = sp.encode('你好世界 Hello World')
# → [12345, 67890, 11111, 22222, 33333]

# 解码
text = sp.decode(tokens)
# → '你好世界 Hello World'
```

---

## 4. 哪些模型使用 SentencePiece

| 模型 | 词表大小 | 算法 | 语言覆盖 |
|------|---------|------|---------|
| **LLaMA** | 32K | BPE | 20+ 语言 |
| **Qwen** | 152K | BPE (tiktoken) | 100+ 语言 |
| **ChatGLM** | 128K | BPE | 中英日 |
| **T5/mT5** | 32K/250K | Unigram | 101 语言 |
| **GPT-4** | 100K+ | tiktoken (BPE) | 多语言 |

---

## 5. SentencePiece vs HuggingFace Tokenizers

| 维度 | SentencePiece | HF Tokenizers |
|------|-------------|--------------|
| **来源** | Google | HuggingFace |
| **语言** | C++ + Python 绑定 | Rust + Python 绑定 |
| **速度** | 中 | 快（Rust 并行） |
| **算法** | BPE + Unigram | BPE + WordPiece + Unigram |
| **模型文件** | .model (二进制) | tokenizer.json (JSON) |
| **HF 集成** | 通过 AutoTokenizer | 原生 |

---

## Related

- [[概念/tokenization]] — 分词与 Tokenization
- [[概念/llm-architectures]] — LLM 架构
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
