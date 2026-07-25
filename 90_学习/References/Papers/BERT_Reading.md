---
title: "论文导读: BERT (Pre-training of Deep Bidirectional Transformers)"
category: "-references-papers"
tags:
  - paper
  - reading-guide
  - bert
  - nlp
  - transformer
  - masked-language-model
  - devlin
  - google
  - foundational
summary: "Devlin et al. (2018)《BERT》论文导读 — 提出双向 Transformer 编码器预训练，用掩码语言模型（MLM）和下一句预测（NSP）两大任务，刷新 11 项 NLP 基准，定义了'预训练 + 微调'范式。"
sources:
  - "https://arxiv.org/abs/1810.04805"
created: 2026-07-23
updated: 2026-07-23
lifecycle: reviewed
tier: supporting
aliases:
  - "BERT Paper"
  - "Bidirectional Encoder Representations from Transformers"

---
# 论文导读: BERT — Pre-training of Deep Bidirectional Transformers

> **一句话理解**: Google 2018 年发布的 BERT，用双向 Transformer 编码器做掩码语言模型预训练，让模型真正"同时看左右上下文"理解语言，一举刷新 11 项 NLP 基准——它确立了"预训练 + 微调"的标准范式，与 GPT 并列为大模型时代的两大起点，深刻影响了此后的检索、分类、NER 等理解型任务。

## 论文背景

### 历史脉络

2018 年前后，NLP 经历从"特征工程"到"预训练"的范式转变：

- **Word2Vec / GloVe（2013-2014）**: 静态词向量，每个词一个固定向量，无法处理一词多义
- **ELMo（2018）**: 基于双向 LSTM 的上下文词向量，但 LSTM 限制了对长距离依赖的建模
- **GPT-1（2018，详见 [[90_学习/References/Papers/GPT3_Reading]]）**: 用 Transformer 解码器做单向（左到右）预训练
- **ULMFiT / Transformer**: 验证预训练 + 微调有效

### 要解决的问题

GPT 用的是**单向（左到右）**语言模型——预测下一个 Token。这意味着：
- 预训练时模型只能看左侧上下文，无法利用右侧信息
- 但很多 NLP 任务（分类、NER、问答）本质上是**理解任务**，需要同时看左右上下文

BERT 的核心问题：**能否设计一个真正双向的预训练目标，让模型同时利用左右上下文？**

### 作者与机构

- **作者**: Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova
- **机构**: Google AI Language
- **发表**: NAACL 2019（2018 年 10 月 arXiv）
- **关键词**: Bidirectional、Masked Language Model、Pre-training、Fine-tuning

## 核心贡献

1. **双向预训练**: 用 Masked Language Model（MLM）实现真正的双向上下文建模
2. **下一句预测（NSP）**: 引入句子级关系理解的辅助任务
3. **统一微调范式**: 一个预训练模型 + 简单输出头，适配多种 NLP 任务
4. **刷新 11 项记录**: 在 GLUE、SQuAD、SWAG 等 11 个基准上取得 SOTA
5. **开源模型**: 发布 BERT-Base/Large 预训练权重，民主化 NLP 研究

## 关键技术详解

### 1. 核心创新：Masked Language Model（MLM）

传统语言模型（GPT）是单向的：`P(w_t | w_1...w_{t-1})`，无法用右侧信息。

**BERT 的解法**: 随机"遮挡"输入中 15% 的 Token，让模型根据**左右上下文**预测被遮挡的词。

```
原文:   "The man went to the [MASK] to buy a cup of coffee"
目标:   预测 [MASK] = "store"（同时利用左侧"went to"和右侧"to buy coffee"）
```

**15% 的处理细节**（论文精心设计）:
- 其中 80% 替换为 `[MASK]` Token
- 10% 替换为随机词（让模型不依赖 `[MASK]` 标记）
- 10% 保持不变（让模型学会"有时候输入是对的"）

**为什么双向有效**: 预测 `[MASK]` 时，Transformer 的 Self-Attention 让该位置同时关注左侧和右侧所有 Token（详见 [[90_学习/References/Papers/Attention_Is_All_You_Need_Reading]]），真正实现双向理解。

### 2. 下一句预测（Next Sentence Prediction, NSP）

为了学习句子间关系（如问答中的"问题句"与"答案句"），BERT 增加了一个二分类任务：

```
输入: [CLS] 句子A [SEP] 句子B [SEP]
任务: 判断 B 是否是 A 的下一句（IsNext / NotNext）

例子:
  A: "The man went to the store."
  B: "He bought a gallon of milk."  → IsNext
  B: "Penguins are flightless birds." → NotNext
```

**特殊 Token**:
- `[CLS]`: 句子级任务的分类头（放在句首，其最终表示用于分类）
- `[SEP]`: 句子分隔符
- `[MASK]`: 掩码占位符

### 3. 模型架构

BERT 使用 Transformer 的**编码器**（双向 Self-Attention）：

| 模型 | 层数 | 隐藏维度 | 头数 | 参数量 |
|------|------|---------|------|--------|
| BERT-Base | 12 | 768 | 12 | 110M |
| BERT-Large | 24 | 1024 | 16 | 340M |

- BERT-Base 与 GPT-1 参数量相当，便于公平对比
- 架构核心: Embedding → N × [Multi-Head Self-Attention → Add&Norm → FFN → Add&Norm]

### 4. 输入表示

BERT 的输入是三个嵌入之和：

```
Token Embedding    (WordPiece 分词)
    + Position Embedding (学习式位置编码)
    + Segment Embedding  (区分句子 A/B)
= 最终输入向量
```

- **WordPiece 分词**: 把词拆成子词（如 "playing" → "play" + "##ing"），处理未登录词
- **Segment Embedding**: 句子 A 的 Token 标记为 EA，句子 B 标记为 EB

### 5. 预训练 + 微调范式

```
预训练阶段（无监督，一次性）:
  海量文本 → MLM + NSP → 得到通用 BERT

微调阶段（有监督，每个任务一次）:
  BERT + 少量任务数据 + 一个输出头 → 任务专用模型
```

**微调的简洁性**: 不同任务只需更换输出头，主体 BERT 不变：
- **分类**: 用 `[CLS]` 的表示 + 全连接层
- **NER**: 每个 Token 的表示 + 分类层
- **问答**: 预测答案的 Start/End 位置

## 实验结果

### GLUE 基准（自然语言理解）

| 模型 | GLUE 平均 |
|------|----------|
| 之前 SOTA | ~80 |
| **BERT-Large** | **~82.1** |

BERT 在 GLUE 的 8 个子任务（情感、文本蕴含、相似度等）上全部刷新记录。

### SQuAD（机器阅读理解）

| 模型 | F1 |
|------|-----|
| 人类 | 82.3 |
| 之前 SOTA | ~85 |
| **BERT** | **93.2**（超越人类） |

### SWAG（常识推理）

BERT 在 SWAG 上也大幅超越基线。

**关键结论**: 一个预训练模型 + 简单微调，在 11 个 NLP 任务上全面 SOTA——证明了"预训练 + 微调"范式的强大。

### 消融实验

- **移除 MLM（用单向 LM）**: 性能显著下降——证明双向性是关键
- **移除 NSP**: 句子对任务（如问答）性能下降——NSP 有贡献（后续研究如 RoBERTa 对此有争议）

## 影响与后续

### 直接影响

1. **定义预训练 + 微调范式**: 此后数年，几乎所有 NLP 任务都采用"预训练 BERT 类模型 + 微调"
2. **Hugging Face 生态崛起**: BERT 的开源加速了 `transformers` 库的普及（详见 [[90_学习/References/books/nlp-with-transformers]]）
3. **检索与表示**: BERT 的嵌入成为语义搜索、RAG 的基础（详见 [[14_RAG系统/RAG_Systems]]）
4. **工业落地**: BERT 至今仍是搜索引擎（Google Search）、分类、NER 的主力

### 架构演进（编码器家族）

| 模型 | 年份 | 关键改进 |
|------|------|---------|
| BERT | 2018 | 双向 MLM |
| RoBERTa | 2019 | 移除 NSP、更大 batch、更多数据 |
| ALBERT | 2019 | 参数共享、因子化嵌入，更轻量 |
| DistilBERT | 2019 | 知识蒸馏，小 40% 快 60% |
| DeBERTa | 2020 | 解耦注意力 |
| Sentence-BERT | 2019 | 专为句子嵌入优化 |

### 与 GPT 的路线分野

| 维度 | BERT（编码器） | GPT（解码器） |
|------|---------------|--------------|
| 注意力 | 双向（理解） | 单向（生成） |
| 预训练目标 | MLM（填空） | LM（续写） |
| 擅长 | 理解任务（分类/检索/NER） | 生成任务（写作/对话） |
| 路线 | 检索/分类/嵌入 | ChatGPT/对话/Agent |

两者共同奠定了大模型时代，后续 T5/BART 尝试统一两者。

## 批判性思考

### 论文的局限

1. **NSP 任务价值存疑**: RoBERTa（2019）发现移除 NSP 反而更好，NSP 可能过于简单
2. **MLM 的预训练-微调不一致**: 预训练有 `[MASK]`，微调时没有，存在差距
3. **仅限理解任务**: BERT 不擅长生成（GPT 路线在生成任务胜出）
4. **计算成本高**: 预训练 BERT-Large 需要 4 天 × 4 TPU，对小团队不友好
5. **静态上下文窗口**: 固定 512 Token，长文档需截断或滑动窗口
6. **偏见继承**: 训练数据的性别/种族偏见被模型放大

### 常见误解

| 误解 | 澄清 |
|------|------|
| "BERT 比 GPT 强" | 两者擅长不同任务：BERT 强在理解，GPT 强在生成 |
| "MLM = 完形填空" | 类比正确，但 BERT 预训练的 15% 策略有讲究 |
| "BERT 是生成模型" | BERT 主要用于理解/表示，不擅长自回归生成 |
| "BERT 已经过时" | 在分类/检索/NER 等理解任务，BERT 及变体仍是主力 |

### 开放问题

- 双向 vs 单向哪个更接近"人类语言理解"？
- MLM 是否是最优的预训练目标？（ELECTRA 用判别式任务，效率更高）
- 编码器与解码器能否真正统一？（T5/BART 的尝试）

## 如何精读这篇论文

### 推荐阅读顺序

1. **Abstract + Introduction**: 理解双向预训练动机
2. **Section 3 模型架构**: 重点 3.3（MLM）和 3.4（NSP）
3. **Section 4 微调任务**: 看图 4，理解不同任务的输出头
4. **Section 5 实验**: 看 GLUE/SQuAD 结果表
5. **附录消融**: 理解 MLM/NSP 的贡献

### 配套资源

- **Hugging Face**: `bert-base-uncased` 直接试用（详见 [[90_学习/References/books/nlp-with-transformers]]）
- **图解**: Jay Alammar《The Illustrated BERT》
- **微调实战**: [[90_学习/References/books/hands-on-llms-alammar|Hands-On LLMs]] Ch 11
- **代码**: [[90_学习/References/books/nlp-with-transformers|NLP with Transformers]] Ch 2

### 动手验证

- 用 Hugging Face 加载 `bert-base-uncased`，做一次 MLM 预测
- 在 IMDB 数据集上微调 BERT 做情感分类
- 用 Sentence-BERT 做语义相似度检索

## 延伸阅读

- [[90_学习/References/Papers/Attention_Is_All_You_Need_Reading|Transformer 论文]] — BERT 的架构基础
- [[90_学习/References/Papers/GPT3_Reading|GPT-3 论文]] — 对比理解解码器路线
- [[90_学习/References/Papers/ResNet_Reading|ResNet]] — 残差连接源头
- [[90_学习/References/books/nlp-with-transformers|NLP with Transformers]] — HF 生态应用
- [[90_学习/References/books/hands-on-llms-alammar|Hands-On LLMs]] — 图解 BERT 微调
- [[90_学习/References/books/build-llm-from-scratch-raschka|Build LLM From Scratch]] — 理解 Transformer 内部
- [[05_大模型/LLM_Fundamentals]] — LLM 基础
- [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] — 微调技术
- [[14_RAG系统/RAG_Systems]] — BERT 嵌入在检索中的应用
- [[90_学习/concepts/stage2_core_tech|Stage 2: 核心技术]] — BERT 在学习路径中的位置

> **关联**: → [[90_学习/References/Papers/]] | [[90_学习/References/Papers/Attention_Is_All_You_Need_Reading|Transformer]] | [[90_学习/References/Papers/GPT3_Reading|GPT-3]] | [[05_大模型/LLM_Fundamentals]] | [[05_大模型/07_Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] | [[14_RAG系统/]]
