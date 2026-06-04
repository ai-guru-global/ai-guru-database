---
title: "LLM 数据工程 (LLM Data Engineering)"
category: concept
tags: ["nlp", "llm", "data-engineering", "pretraining-data", "sft-data", "synthetic-data"]
relationships:
  - target: "concepts/llm-architectures"
    type: related_to
  - target: "concepts/self-supervised-learning"
    type: builds_on
sources:
  - 04_NLP_LLMs/LLM_Data_Engineering
summary: "LLM 数据工程覆盖预训练数据收集清洗(去重/过滤/配比)、SFT数据构建(人工标注/自我指令/蒸馏)、RLHF偏好数据和合成数据生成的全链路。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.88
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
---

# LLM 数据工程 (LLM Data Engineering)

> 数据是 LLM 的燃料——同样的架构和算力，数据质量/数量/配比决定模型是「废铁」还是「SOTA」。

---

## 1. 定义

**LLM 数据工程**是围绕 LLM 训练全生命周期的数据管理实践，包括预训练数据清洗、SFT 数据构建、偏好数据标注、合成数据生成。

> LLaMA 3 用 15T 精选 token 达到 GPT-4 级性能，证明**数据质量 >> 数据数量**。

---

## 2. 数据流水线

| 阶段 | 规模 | 来源 | 关键技术 |
|------|------|------|----------|
| **预训练** | 1-15T tokens | 互联网/书籍/代码 | 去重、过滤、配比 |
| **SFT** | 10K-1M 条 | 人工标注/AI生成 | 质量>数量，覆盖度 |
| **RLHF/DPO** | 10K-1M 对 | 人类/AI偏好 | 一致性，去偏 |
| **合成数据** | 可变 | 教师模型蒸馏 | 多样性控制 |

---

## 3. 预训练数据处理

```
清洗流水线: 原始网页 → 文本提取 → 语言识别 → 基础过滤 → 去重 → 质量评分 → 输出
保留率: 通常仅 5-15%
```

---

## 4. SFT 数据方法

| 方法 | 规模 | 质量 | 代表 |
|------|------|------|------|
| 人工标注 | 10K-100K | 最高 | LLaMA 2 Chat |
| Self-Instruct | 100K+ | 中高 | Alpaca |
| Evol-Instruct | 100K+ | 中高 | WizardLM |
| 蒸馏 | 1M+ | 中 | Orca, Phi-2 |

---

## Related

- [[04_NLP_LLMs/LLM_Data_Engineering]] — LLM 数据工程深度解析
- [[concepts/llm-architectures]] — LLM 架构
- [[concepts/self-supervised-learning]] — 自监督学习（预训练范式）
