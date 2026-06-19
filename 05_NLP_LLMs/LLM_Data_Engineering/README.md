---
title: LLM 数据工程 (LLM Data Engineering)
category: "04-nlp-llms"
tags: ["llm", "data-engineering", "pretraining-data", "sft-data", "synthetic-data"]
summary: "LLM 数据工程覆盖预训练数据收集清洗、SFT数据构建、合成数据生成等全链路数据管理。"
created: 2026-06-04
updated: 2026-06-04
---

# LLM 数据工程 (LLM Data Engineering)

> **一句话理解**: 数据是 LLM 的燃料——同样的模型架构，数据质量/数量/配比的差异，可以决定一个模型是「废铁」还是「SOTA」。

---

## 核心内容

- [LLM 数据工程深度解读](./LLM_Data_Engineering_Deep_Dive.md) — 从预训练数据到 SFT 数据到合成数据的全链路工程

## 关键主题

| 阶段 | 核心挑战 | 关键技术 |
|------|----------|----------|
| **预训练数据** | 万亿 token 的质量保证 | 去重、过滤、数据配比 |
| **SFT 数据** | 质量 > 数量 | 人工标注、自我指令 |
| **RLHF 数据** | 偏好一致性 | 人类标注、AI 反馈 |
| **合成数据** | 数据飞轮 | 自我生成、蒸馏、进化 |
