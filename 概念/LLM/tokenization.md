---
title: "分词与 Tokenization"
category: -concepts
tags: ["tokenization", "BPE", "sentencepiece", "tokenizer", "vocabulary", "subword"]
relationships:
  - target: "概念/information-theory"
    type: builds_on
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/transformer-architecture"
    type: builds_on
sources:
  - 大模型/LLM_Architectures
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Tokenization 将文本切分为模型可处理的 token 序列。主流方案为 BPE（GPT系列）、SentencePiece（多语言）和 Unigram。Vocab 大小直接影响模型质量与推理效率。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - Tokenization

---
# 分词与 Tokenization

> LLM 的第一步——将人类文字转化为模型可消化的 token 序列。

---

## 1. 定义

**Tokenization** 是将原始文本切分为**token 序列**（整数 ID）的过程。现代 LLM 几乎都采用**子词（subword）**级别的 tokenization，在字符和单词之间取得平衡。

> Tokenization 质量直接影响：模型训练效率、推理速度（token 数越少越快）、上下文窗口利用率。

---

## 2. 三大子词算法

### 2.1 BPE (Byte-Pair Encoding)

GPT 系列使用的方案。从字符级别开始，迭代合并最频繁出现的相邻 pair：

```
初始:    l o w e r _ _ _ _ _   (5 tokens)
Step 1:  lo w e r _ _ _ _ _   (合并 l+o, 4 tokens)
Step 2:  low er _ _ _ _ _     (合并 lo+w, 3 tokens)
...
最终:    lower _ _ _ _ _      (1 token: "lower")
```

| 特性 | 说明 |
|------|------|
| **训练** | 贪心合并最高频 pair |
| **编码** | 从最长 match 开始贪心切分 |
| **Vocab** | 通常 32K-100K tokens |
| **代表** | GPT-2/3/4, LLaMA, Qwen |

### 2.2 Unigram LM

基于概率模型，从大 vocab 开始逐步剪枝：

| 特性 | 说明 |
|------|------|
| **训练** | 初始化大 vocab → EM 优化 → 剪枝低概率 token |
| **编码** | Viterbi 算法找最优切分（全局最优，非贪心） |
| **优势** | 编码质量优于 BPE（全局最优） |
| **代表** | T5, Albert |

### 2.3 SentencePiece

Google 的统一 tokenization 框架，支持 BPE 和 Unigram：

| 特性 | 说明 |
|------|------|
| **语言无关** | 直接在原始 Unicode 文本上训练，无需预分词 |
| **空白处理** | 用 ▁ (U+2581) 表示空格，统一处理中日韩等无空格语言 |
| **代表** | T5, LLaMA, Qwen, 大多数开源模型 |

---

## 3. 主流模型 Tokenizer 对比

| 模型 | 算法 | Vocab Size | 中文效率 | 特点 |
|------|------|-----------|----------|------|
| **GPT-4** | cl100k_base (BPE) | 100K | 中 | tiktoken 库 |
| **GPT-4o** | o200k_base (BPE) | 200K | 较高 | 多语言优化 |
| **LLaMA 3** | SentencePiece BPE | 128K | 较高 | 大幅扩展 vocab |
| **Qwen 2.5** | tiktoken BPE | 152K | **最高** | 中文 vocab 占比大 |
| **DeepSeek-V3** | BPE | 128K | 高 | 字节级 BPE |
| **Claude** | 未公开 | ~100K | 高 | 多语言 |
| **Gemini** | SentencePiece | 256K | 高 | 超大 vocab |

---

## 4. 关键指标

### 4.1 Tokenization 效率

**定义**：同一文本被切分为多少 token。越少越好（推理更快、上下文利用率高）。

| 语言 | GPT-4 (cl100k) | LLaMA 3 | Qwen 2.5 |
|------|----------------|---------|----------|
| **英语** | 1.0× (基准) | 0.85× | 0.90× |
| **中文** | 2.5× (差) | 1.5× | **1.0×** (最优) |
| **日语** | 2.0× | 1.8× | 1.3× |
| **代码** | 0.8× | 0.75× | 0.85× |

> **Qwen 2.5 的中文优势**：152K vocab 中大量中文词和字符，中文文本的 token 数接近英语。

### 4.2 Fertility

**定义**：每个字符平均产生多少 token。

\[
\text{Fertility} = \frac{\text{Total tokens}}{\text{Total characters}}
\]

- Fertility 越低 → tokenization 效率越高
- 英语 ~0.25 (每 4 字符 = 1 token)
- 中文 ~1.5 (BPE) vs ~0.7 (优化后)

---

## 5. Tokenization 对推理的影响

| 维度 | 影响 | 量化 |
|------|------|------|
| **上下文利用率** | Token 越少 → 同样窗口装更多内容 | 中文优化后 +30-60% 有效上下文 |
| **推理速度** | Token 数直接影响 Decode 步数 | Token 减少 30% → 速度提升 ~30% |
| **KV Cache 成本** | Token 数 × 层数 × 维度 | Token 减少 → KV Cache 同比例减少 |
| **训练成本** | Token 数 = 训练 FLOPs 的乘数 | 高效 tokenizer → 训练更便宜 |
| **API 计费** | 按 token 计费 | 中文优化后成本降低 30-60% |

---

## 6. 特殊 Token

| Token | 作用 | 示例 |
|-------|------|------|
| **BOS** (Begin of Sequence) | 序列开始 | `<s>` |
| **EOS** (End of Sequence) | 序列结束 | `</s>` |
| **PAD** (Padding) | 填充到等长 | `<pad>` |
| **UNK** (Unknown) | 未登录词 | `<unk>`（BPE 理论上不需要） |
| **System** | 系统提示标记 | `<\|system\|>` |
| **Special Tokens** | 自定义功能标记 | `<\|im_start\|>`, `<\|tool\|>` |

---

## 7. 字节级 BPE (Byte-Level BPE)

现代 tokenizer（GPT-2/3/4, LLaMA, Qwen）采用**字节级 BPE**：

| 特性 | 说明 |
|------|------|
| **基础单元** | UTF-8 字节（256 个），非 Unicode 字符 |
| **无 UNK** | 任何字节序列都可编码，不会出现 `<unk>` |
| **多语言** | 天然支持所有语言和符号 |
| **代价** | 非 ASCII 字符（中文/Emoji）的初始 token 数更多 |

---

## 8. 工程实践

| 关注点 | 建议 |
|--------|------|
| **Tokenizer 选择** | 优先使用模型官方 tokenizer，不要混用 |
| **长文本切分** | 按 token 边界切分，避免语义截断 |
| **RAG Chunking** | 按 token 数（非字符数）控制 chunk 大小 |
| **流式输出** | 累积字节 → 解码为 UTF-8 → 处理不完整多字节字符 |
| **Token 计费** | 用 `tiktoken` 库精确计算，不要用字符数估算 |

---

## 9. 局限与开放问题

1. **语义断层**：Tokenization 是统计驱动，不理解语义（"unhappiness" 可能被切为 "un" + "happiness"）
2. **数字处理**：大数字常被拆分为多个 token，影响数学推理能力
3. **代码 Tokenization**：变量名、缩进、特殊符号的处理影响代码模型质量
4. **Tokenizer 攻击**：特制的 token 序列可触发模型安全绕过
5. **统一 Tokenizer**：理想的多模态 tokenizer（文本+图像+音频统一 token 空间）仍在研究中

---

## Related

- [[概念/information-theory]] — 信息论（编码定理与 BPE 的关系）
- [[概念/llm-architectures]] — LLM 架构
- [[概念/transformer-architecture]] — Transformer 架构
- [[大模型/LLM_Architectures]] — LLM 架构深度解析

---

## 2026 Tokenization 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **BPE (Byte Pair Encoding)** | 最常用分词算法，GPT/Llama 采用 | GA |
| **SentencePiece** | 语言无关分词，支持多语言 | GA |
| **Tokenizers (HF)** | HuggingFace 快速分词器 | GA |
| **Unigram** | 基于概率的分词算法 | GA |
| **Byte-level BPE** | 字节级 BPE，支持任意语言 | GA |

## 生产最佳实践

1. **模型匹配**：使用模型对应的分词器，不要混用
2. **多语言支持**：多语言场景用 SentencePiece 或 Byte-level BPE
3. **特殊 Token**：正确处理 BOS/EOS/PAD 等特殊 Token
4. **Token 计数**：API 调用前用分词器计算 Token 数，控制成本
5. **分词器缓存**：生产环境缓存分词器，避免重复加载
