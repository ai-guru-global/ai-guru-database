---
title: "自监督学习 (Self-Supervised Learning)"
category: -concepts
tags: ["deep-learning", "self-supervised-learning", "contrastive-learning", "SimCLR", "MoCo", "MAE", "DINO"]
relationships:
  - target: "概念/neural-networks"
    type: builds_on
  - target: "概念/transformer-architecture"
    type: related_to
  - target: "概念/llm-architectures"
    type: enables
sources:
  - 深度学习/Self_Supervised_Learning
summary: "自监督学习从无标注数据中构造预测任务来学习通用表示，是现代AI预训练的核心范式。三大方法：对比学习(SimCLR/MoCo)、掩码建模(BERT/MAE)、自回归(GPT)。"
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
  - "Self Supervised Learning"
  - "self supervised learning"

---
# 自监督学习 (Self-Supervised Learning)

> 不需要人工标注，让数据自己「教」模型——现代 AI 预训练的核心范式。

---

## 1. 定义

**自监督学习**（Self-Supervised Learning, SSL）通过设计**预测任务**（pretext task）从无标注数据中自动构造监督信号，学习通用数据表示。

> LLM（GPT/Claude）的成功本质上就是自监督学习的胜利——预测下一个 token 就是自监督任务。

---

## 2. 三大范式

| 范式 | 核心思想 | 代表方法 | 主要领域 |
|------|----------|----------|----------|
| **对比学习** | 正样本拉近，负样本推远 | SimCLR, MoCo, BYOL, DINO | CV |
| **掩码建模** | 遮住输入，重建原始内容 | BERT, MAE, BEiT | NLP + CV |
| **自回归** | 顺序预测下一个元素 | GPT, PixelCNN | NLP + 生成 |

---

## 3. 对比学习关键方法

| 方法 | 负样本 | 核心创新 |
|------|--------|----------|
| **SimCLR** | batch 内 | 数据增强 + 大 batch + MLP 投影头 |
| **MoCo** | 队列 | 动量编码器 + 负样本队列 |
| **BYOL** | 不需要 | stop-gradient 防止崩塌 |
| **DINO/DINOv2** | 不需要 | 自蒸馏，ViT 通用特征 |

---

## 4. 掩码建模关键方法

| 方法 | 遮盖率 | 重建目标 | 创新 |
|------|--------|----------|------|
| **BERT** | 15% | 分类重建 | 双向上下文 |
| **MAE** | 75% | 像素级 MSE | 非对称编码器-解码器 |
| **BEiT** | 40% | 离散 token | 类似 BERT |

---

## 5. 与 LLM 的关系

| 预训练范式 | 预测任务 | 代表模型 |
|-----------|----------|----------|
| 自回归 | 预测下一个 token | GPT, LLaMA, Claude |
| 掩码语言模型 | 预测被遮 token | BERT, RoBERTa |
| Span 预测 | 预测连续片段 | T5, FLAN-T5 |

---

## Related

- [[深度学习/Self_Supervised_Learning/README]] — 自监督学习深度解析
- [[概念/neural-networks]] — 神经网络基础
- [[概念/llm-architectures]] — LLM 架构（自监督预训练）

---

## 2026 自监督学习生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Next Token Prediction** | LLM 预训练目标 | GA |
| **Masked LM** | BERT 式掩码预测 | GA |
| **对比学习** | SimCLR/MoCo 图像表示学习 | GA |
| **DINO** | 自监督视觉 Transformer | GA |
| **多模态预训练** | 图文对比学习 | GA |

## 生产最佳实践

1. **预训练必用**：大模型预训练必须用自监督学习
2. **数据效率**：自监督学习利用无标签数据
3. **迁移学习**：预训练模型微调到下游任务
4. **多模态**：图文/音视频用多模态自监督
5. **与有监督对比**：自监督预训练 + 有监督微调
