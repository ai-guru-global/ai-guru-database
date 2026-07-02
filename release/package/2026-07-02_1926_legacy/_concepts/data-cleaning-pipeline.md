---
title: "数据清洗 Pipeline"
category: -concepts
tags: ["data-cleaning", "data-curation", "pretraining", "fine-tuning", "pipeline", "data-quality"]
relationships:
  - target: "_concepts/llm-data-engineering"
    type: belongs_to
  - target: "_concepts/model-training"
    type: precedes
  - target: "_concepts/scaling-laws"
    type: influences
sources:
  - 07_Model_Training/Data/Data_Curation_and_Mixture_2026.md
  - 05_NLP_LLMs/LLM_Data_Engineering.md
  - 07_Model_Training/README.md
summary: "数据清洗 Pipeline 就像给 AI 准备‘干净食材’的中央厨房：把从网上抓来的原始数据，经过去重、去噪、格式统一、质量打分、毒性过滤等步骤，变成适合训练大模型的高质量语料。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: stable
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Data Cleaning Pipeline"
  - "data cleaning pipeline"

---
# 数据清洗 Pipeline

## 核心要点

- **大模型的‘Garbage in, garbage out’**：喂什么数据，决定模型学什么。
- **数据清洗 Pipeline 是一套自动化流程**，把原始语料变成干净、均衡、安全的训练数据。
- **关键步骤**：采集 → 去重 → 去噪 → 格式标准化 → 质量过滤 → 安全过滤 → 数据配比。
- **目标**：提升模型能力、减少幻觉、降低有害内容、控制训练成本。

## 一句话理解

数据清洗 Pipeline 就像给 AI 做饭前先洗菜、切菜、挑掉烂叶子：原料干净了，炒出来的菜才好吃。

## 详细内容

### 为什么数据清洗如此重要？

训练大模型需要海量文本（几十 TB），但互联网数据良莠不齐：
- **重复内容**：同一个网页被反复抓取，浪费算力。
- **低质量文本**：乱码、模板页、广告、机器生成垃圾。
- **有毒内容**：仇恨言论、成人内容、个人隐私信息。
- **分布偏差**：某些领域过多（如 Reddit 论坛），某些领域过少（如专业论文）。

研究显示，**用 10% 的高质量数据训练，效果可能比 100% 脏数据更好**。

### 典型 Pipeline 步骤

```
原始数据
  ↓ 采集（Common Crawl、GitHub、书籍、论文、对话）
  ↓ 去重（URL 去重、段落 MinHash 去重、文档级去重）
  ↓ 格式清洗（HTML 转纯文本、去除页眉页脚、统一编码）
  ↓ 质量打分（语言模型困惑度、文本长度、标点比例、可读性）
  ↓ 安全过滤（ toxicity、PII、偏见、违法内容）
  ↓ 数据配比（按领域/语言/难度混合）
  ↓ 高质量训练语料
```

### 常用技术与工具

| 步骤 | 方法/工具 | 作用 |
|------|-----------|------|
| 去重 | MinHash/LSH、SimHash、Exact Match | 去掉重复/近似重复文档 |
| 质量打分 | perplexity 过滤、fastText 语言识别、规则过滤 | 保留高质量段落 |
| 安全过滤 | 关键词、分类器、 moderation API | 去除有毒/隐私内容 |
| 配比 | 领域权重、语言比例、难度采样 | 让训练数据分布合理 |
| 版本管理 | DVC、LakeFS、HuggingFace Datasets | 数据可追踪、可复现 |

### 预训练 vs 微调的数据清洗

| 阶段 | 关注点 | 示例 |
|------|--------|------|
| **预训练** | 规模、多样性、去重、去毒 | 万亿 token 级网页+书籍+代码 |
| **SFT 微调** | 指令格式、答案质量、多轮对话 | Alpaca、ShareGPT、指令数据集 |
| **RLHF 对齐** | 偏好对、安全边界、人类价值观 | HH-RLHF、Anthropic 偏好数据 |

## 开放问题

- 如何自动评估清洗后数据对模型能力的真实影响。
- 合成数据（synthetic data）在清洗 Pipeline 中的最佳比例。
- 多语言/小众语言数据的清洗标准与工具仍不完善。

## Related

- [[_concepts/llm-data-engineering]] — 大模型数据工程
- [[_concepts/model-training]] — 模型训练
- [[_concepts/synthetic-data]] — 合成数据
- [[07_Model_Training/Data/Data_Curation_and_Mixture_2026]] — 数据策展与配比 2026
- [[05_NLP_LLMs/LLM_Data_Engineering/README]] — 大模型数据工程
