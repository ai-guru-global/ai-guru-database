---
title: 预训练数据 × 合成数据：从规模到质量的范式转移
description: 跨域合成：预训练数据工程（Pretraining Data）与合成数据生成（Synthetic Data）的技术交汇，探索数据质量超越数据规模的新范式
date: 2026-05-31
tags: [pretraining-data, synthetic-data, data-engineering, llm-training, data-curation, data-mixture, quality-over-scale]
category: -synthesis
created: 2026-06-12
summary: ""
tier: core
aliases:
  - "Pretraining Synthetic Data"
  - "pretraining synthetic data"

---
# 预训练数据 × 合成数据：从规模到质量的范式转移

## 核心论点

大语言模型的预训练正在经历从"规模至上"（Scale is All You Need）到"质量至上"（Quality over Scale）的范式转移。合成数据（Synthetic Data）的兴起，使得数据策展（Data Curation）与数据生成（Data Generation）的边界逐渐模糊，二者的深度融合正在重新定义预训练的数据工程方法论。

## 范式转移

### 数据Scaling Law的进化

| 阶段 | 信条 | 代表 | 数据策略 |
|---|---|---|---|
| 1.0 | 越多越好 | GPT-3, PaLM | 大规模网络爬取 |
| 2.0 | 质量 > 数量 | Llama 2, Mistral | 去重、过滤、混合 |
| 3.0 | 合成 + 策展 | Phi-4, Nemotron-4 | 合成数据 + 精细混合比例 |

### 关键融合点

- **Data Mixture Laws**：不同领域数据的最优混合比例（如代码:文本:科学 = 1:2:1）
- **Self-Improvement via Synthesis**：模型生成 → 过滤 → 再训练的正向循环
- **Curriculum Learning for Data**：按难度排序的数据课程学习

## 技术方法

### 合成数据生成路径

1. **Distillation from Teacher Models** — 用 GPT-4 级模型生成高质量训练数据
2. **Self-Play & Iteration** — 模型自我对话、自我批评生成对话数据
3. **Structure-aware Synthesis** — 基于知识图谱/代码 AST 的结构化数据生成

### 数据质量评估

- **Perplexity-based Filtering** — 用小型模型过滤低质量文本
- **Educational Value Scoring** — 评估文本的知识密度和教育价值
- **Deduplication at Scale** — MinHash + SimHash 的大规模去重

## 跨域连接

- [[模型训练/Data/Data_Curation_and_Mixture_2026|数据策展与混合 2026]] — 数据混合比例的最新研究
- [[模型训练/Optimization/Scaling_Laws_and_Training_Dynamics|Scaling Laws 与训练动态]] — 数据规模的数学规律
- [[大模型/LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive|LLM 数据工程深度解读]] — 数据工程全流程
- [[_concepts/llm-data-engineering|LLM 数据工程]] — 数据策展的核心理论

## 前沿方向

1. **Multimodal Synthetic Data** — 图文、视频、音频的跨模态合成数据
2. **Privacy-Preserving Synthesis** — 差分隐私 + 合成数据，解决隐私合规
3. **Domain-Specific Synthesis** — 法律、医疗、金融等领域的专业合成数据

## 延伸阅读

- [[_synthesis/python-data-science-pipeline|Python × 数据科学合成]]
- [[_concepts/fine-tuning-techniques|微调技术概念]]
