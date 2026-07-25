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
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "SentencePiece 是 Google 开源的语言无关分词库，支持 BPE 和 Unigram 两种算法。多数中日韩 LLM（LLaMA/Qwen/ChatGLM）使用 SentencePiece 训练的 tokenizer。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
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
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析

---

## 2026 SentencePiece 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **SentencePiece** | 语言无关分词器 | GA |
| **BPE** | 字节对编码 | GA |
| **Unigram** | Unigram 语言模型 | GA |
| **多语言支持** | 多语言分词 | GA |
| **与 Tokenizers 对比** | SentencePiece vs HF Tokenizers | GA |

## 生产最佳实践

1. **多语言分词**：多语言模型用 SentencePiece
2. **BPE 训练**：用 BPE 训练分词器
3. **与 Tokenizers 对比**：根据需求选择分词器
4. **词表大小**：合理设置词表大小
5. **特殊 token**：正确配置特殊 token

## 训练配置示例

```python
import sentencepiece as spm

# 训练 BPE 分词器
spm.SentencePieceTrainer.train(
    input='corpus.txt',
    model_prefix='my_bpe',
    vocab_size=32000,
    model_type='bpe',
    character_coverage=0.9995,
    unk_id=0, bos_id=1, eos_id=2, pad_id=3
)

# 使用分词器
sp = spm.SentencePieceProcessor()
sp.load('my_bpe.model')
tokens = sp.encode('你好世界', out_type=str)
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 中文分词差 | 训练数据不足 | 增加中文语料 |
| 词表太大 | vocab_size 过高 | 调整到 32K-64K |
| OOV 太多 | 覆盖率不足 | 提高 character_coverage |
| 与 HF 不兼容 | 格式差异 | 用 HF Tokenizers |

## 版本兼容性

| 工具 | 版本 | 说明 |
|------|------|------|
| sentencepiece | 0.2+ | 核心库 |
| HF Tokenizers | 0.19+ | 替代方案 |
| tiktoken | 最新 | OpenAI 分词 |

## 生产检查清单

1. 词表大小 32K-64K 平衡效果和效率
2. 训练数据覆盖目标语言
3. 正确配置特殊 token (BOS/EOS/PAD/UNK)
4. 测试多语言分词效果
5. 与模型训练/推理流程集成验证
6. 保存分词器版本便于追溯

## 版本兼容性

| 工具 | 版本 | 特性 | 备注 |
|------|------|------|------|
| **sentencepiece** | ≥ 0.2.0 | C++ 核心 | Python 绑定 |
| **tokenizers (HF)** | ≥ 0.19 | Rust 实现 | 替代方案 |
| **tiktoken** | ≥ 0.7 | OpenAI 分词 | GPT 系列 |
| **transformers** | ≥ 4.40 | 集成支持 | 自动加载 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 中文分词粒度粗 | 词表太小 | 增大 vocab_size |
| 训练速度慢 | 语料太大 | 采样训练（--input_sentence_size） |
| 与 HF 不兼容 | 格式差异 | 使用 convert_slow_tokenizer |
| 特殊 token 丢失 | 未正确配置 | 显式添加 user_defined_symbols |

## 总结

SentencePiece 是语言无关的分词器，支持 BPE 和 Unigram 算法，是多语言 LLM 的标准分词方案。其直接处理原始文本的特性使其无需预分词。

> 💡 SentencePiece 的核心价值：语言无关 + 无需预分词——直接把原始文本切成 token，中日韩英阿拉伯文一视同仁。

