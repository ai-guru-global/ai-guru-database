---
title: "L19 - 命名实体识别 NER"
category: "90-learn"
tags: ["microsoft-ai-course", "nlp", "named-entity-recognition", "token-classification", "sequence-models"]
summary: "命名实体识别（NER）把文本中的每个词判定为实体类型或背景，是序列标注/词元分类在 NLP 中的典型应用。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/5-NLP/19-NER/README.md"
created: "2026-06-12"
updated: "2026-06-12"
---

# L19 - 命名实体识别 NER

> **一句话理解**：把“句子中哪些词属于哪类实体”这个问题，转化为对每个词元（token）进行分类，就能训练出能从文本里自动抽出人名、地点、疾病、化学物质等实体的模型。

---

## 本课概览

命名实体识别（Named Entity Recognition，NER）是自然语言处理中的一项基础任务。与之前课程重点讲的“整句分类”不同，NER 要求模型对句子里的**每一个词元**都做出判断：它是某个实体的开始、中间，还是与实体无关的普通词。

本课位于 Microsoft AI For Beginners 的 **NLP 模块**，紧接 RNN、生成网络与 Transformer 之后。它把 NER 归约为**词元分类（token classification）**问题，强调 BIO 标注体系和循环神经网络（RNN / LSTM）的“多对多”结构，并引导学习者用 LSTM 与 BERT 两种思路完成医学实体识别实验。

学完本课后，你应该能够：

- 解释 NER 与文本分类、序列标注的区别与联系；
- 用 BIO / IOB 标注法为连续多词实体打标签；
- 说明为什么 LSTM 适合作为 NER 的基线模型；
- 了解现代 NER 通常如何用预训练语言模型（如 BERT）进行微调（Fine-tuning）。

---

## 核心概念

- **命名实体识别（NER）**：识别文本中具有特定意义的片段，例如人名、地名、时间、疾病、化学式等。它是信息抽取、问答系统、知识图谱构建的前置步骤。
- **意图（Intent）与槽位（Slot）**：在语音助手或聊天机器人中，整句话的类别称为“意图”，而句中的参数（地点、日期、药品名等）称为“槽位”。NER 负责把槽位填好，例如“明天北京天气”中“明天”=日期槽、“北京”=地点槽。
- **词元分类（Token Classification）**：把每个输入 token 映射到一个标签，而不是给整个句子一个标签。NER 本质上就是词元分类。
- **BIO / IOB 标注法**：为了区分“实体的第一个词”和“实体内部的词”，常用 `B-`（Beginning，开头）、`I-`（Inside，内部）、`O`（Outside，非实体）三种前缀。例如：

  | Token | Tag |
  |-------|-----|
  | Tricuspid | B-DIS |
  | valve | I-DIS |
  | regurgitation | I-DIS |
  | and | O |
  | lithium | B-CHEM |
  | carbonate | I-CHEM |
  | toxicity | B-DIS |
  | in | O |
  | a | O |
  | newborn | O |
  | infant | O |
  | . | O |

- **多对多网络（Many-to-Many）**：RNN 每个时间步都输出一个标签，正好满足“输入 n 个 token、输出 n 个标签”的需求。

---

## 关键知识点

- 一个实体可能由多个 token 组成，因此不能简单用“是否命中关键词”解决；BIO 标签让模型学会实体的边界。
- 两个相邻实体（如“lithium carbonate”后紧跟“toxicity”）需要通过 `B-` / `I-` 的切换来区分，否则输出会黏连成一个实体。
- LSTM 作为基线：把每个词的嵌入向量依次输入 LSTM，取每个时间步的隐藏状态再过全连接层，输出每个 token 属于各 BIO 标签的概率。
- 现代最佳实践：先用 BERT 等预训练模型获得上下文表示，再在顶部加一个线性分类头进行微调，能显著提升 NER 准确率。
- 应用领域包括智能助手参数抽取、医学文献中的疾病与药物抽取、金融公告中的公司与金额识别等。

---

## 代码/实验说明

本课官方提供可运行的 Jupyter Notebook：

- **[NER with TensorFlow](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/5-NLP/19-NER/NER-TF.ipynb)**：使用 TensorFlow/Keras 训练一个基于 LSTM 的词元分类模型。Notebook 中通常包含数据加载、词表构建、BIO 标签编码、Embedding + Bidirectional LSTM + Dense 的网络结构，以及训练与评估流程。

核心结构可概括为：

```text
输入句子 → Tokenizer 切词 → 词嵌入层（Embedding）
          → 双向 LSTM（BiLSTM）→ 全连接分类层
          → 每个 token 输出 B-/I-/O 标签概率
```

本课实验（`lab/README.md`）要求训练一个**医学实体识别模型**：

1. 先按本课方法用 LSTM 建立基线；
2. 再使用 **BERT** 等 Transformer 模型进行微调，对比两者在医学术语（疾病、药品、化学物质等）上的识别效果。

> 提示：实验中的医学数据集实体边界复杂，BERT 等预训练模型因为能利用双向上下文，通常比纯 LSTM 基线更稳定。

---

## 本课不覆盖与延伸

- **不覆盖**：条件随机场（CRF）这一经典序列建模层。虽然很多工业 NER 会在 BiLSTM 后接 CRF 以约束标签转移，但本课只讲基础的 LSTM 词元分类。
- **不覆盖**：大规模通用 NER 工具（如 spaCy、Hugging Face `token-classification` pipeline）的工程细节，这些在本库其他页面有更详细介绍。
- **延伸**：可阅读 Andrej Karpathy 的博客《[The Unreasonable Effectiveness of Recurrent Neural Networks](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)》，理解 RNN 为什么能处理序列任务。
- **延伸**：进一步了解本库 [[04_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques]] 中关于 BERT 微调的实践细节。

---

## 相关阅读

- 课程索引：[[90_Learn/Courses/Microsoft_AI_For_Beginners]]
- 本库相关页面：
  - [[04_NLP_LLMs/Sequence_Models/Sequence_Models]] —— RNN、LSTM 与序列建模基础
  - [[04_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques]] —— 预训练模型微调实践
