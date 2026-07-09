---
title: "Sentence-Transformers: 嵌入模型框架"
category: "14-rag-systems"
tags: ["rag", "retrieval", "vector-database", "embedding", "transformer"]
summary: "> **一句话理解**: Sentence-Transformers 让文本转向量变得简单——几行代码就能使用预训练的语义嵌入模型，支持 100+ 语言，专为语义搜索和 RAG 设计。"
created: "2026-05-31"
updated: "2026-05-31"
tier: supporting
aliases:
  - "Sentence Transformers Deep Dive"
  - Sentence_Transformers_Deep_Dive
sources: []

---
# Sentence-Transformers: 嵌入模型框架

> **一句话理解**: Sentence-Transformers 让文本转向量变得简单——几行代码就能使用预训练的语义嵌入模型，支持 100+ 语言，专为语义搜索和 RAG 设计。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [模型列表](#5-模型列表)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
Sentence-Transformers: 嵌入模型库
═══════════════════════════════════════════════════════════════════

定位: 专门用于生成语义嵌入的 Python 库，基于 Transformer 模型

核心理念:
───────────────────────────────────────────────────────────────────
• 易用: 几行代码生成嵌入
• 丰富: 100+ 预训练模型
• 多语言: 支持 100+ 语言
• 专精: 专为语义搜索优化
• 可微调: 支持自定义训练
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **预训练模型** | 100+ 开源模型 |
| **多语言** | 中英日韩等 100+ 语言 |
| **多种任务** | 文本、句子、代码嵌入 |
| **相似度计算** | 余弦、点积、欧氏 |
| **Fine-tuning** | 支持自定义训练 |
| **量化支持** | INT8/FP16 优化 |

### 1.3 典型应用

| 应用 | 说明 |
|------|------|
| **语义搜索** | 文档→向量→相似度 |
| **RAG** | 文本向量化用于检索 |
| **聚类** | 无监督文本聚类 |
| **重排序** | Cross-Encoder 重排 |
| **代码搜索** | 代码语义嵌入 |

---

## 2. 核心概念

### 2.1 模型架构

```
Sentence-Transformer 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                   Sentence-Transformer 架构                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  输入文本: "什么是量子计算"                                      │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Transformer Encoder                        │   │
│  │  ├── Tokenizer: 分词                                    │   │
│  │  ├── BERT/RoBERT: 编码                                  │   │
│  │  └── Pooling: 句子向量                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  输出向量: [0.1, 0.3, -0.2, ...] (768维)                       │
│                                                                  │
│  Pooling 策略:                                                   │
│  ├── Mean Pooling: 平均所有 token                               │
│  ├── CLS: 使用 [CLS] token                                     │
│  └── Max Pooling: 最大值                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Bi-Encoder vs Cross-Encoder

| 类型 | 原理 | 速度 | 精度 | 用途 |
|------|------|------|------|------|
| **Bi-Encoder** | 分别编码 Query 和 Doc | 快 | 中 | 检索 |
| **Cross-Encoder** | 联合编码 Query+Doc | 慢 | 高 | 重排 |

---

## 3. 架构设计

### 3.1 检索流程

```
Bi-Encoder 检索流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        索引阶段                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  文档库: ["文档1", "文档2", "文档3", ...]                       │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Bi-Encoder (预计算)                                         │ │
│  │ 文档 → Encoder → 向量                                       │ │
│  │ 存储到向量数据库                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                        查询阶段                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  查询: "量子计算原理"                                             │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Bi-Encoder (在线计算)                                        │ │
│  │ 查询 → Encoder → 查询向量                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 相似度搜索                                                   │ │
│  │ 查询向量 vs 文档向量 → Top-K                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install sentence-transformers
```

### 4.2 基础使用

```python
from sentence_transformers import SentenceTransformer

# 加载模型
model = SentenceTransformer('all-MiniLM-L6-v2')

# 生成嵌入
sentences = [
    "什么是量子计算",
    "量子计算是一种基于量子力学原理的计算方式",
    "深度学习是机器学习的分支"
]

embeddings = model.encode(sentences)
print(f"Shape: {embeddings.shape}")  # (3, 384)

# 计算相似度
from sentence_transformers import util
sim = util.cos_sim(embeddings[0], embeddings[1])
print(f"相似度: {sim:.4f}")  # 0.8532
```

### 4.3 语义搜索

```python
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

# 文档库
documents = [
    "量子计算是一种新型计算模式",
    "机器学习是人工智能的分支",
    "深度学习使用神经网络",
    "量子纠缠是量子力学现象",
]

doc_embeddings = model.encode(documents)

# 查询
query = "解释量子计算"
query_embedding = model.encode([query])[0]

# 搜索
scores = util.cos_sim(query_embedding, doc_embeddings)[0]
top_k = 2
top_indices = scores.argsort(descending=True)[:top_k]

for idx in top_indices:
    print(f"{documents[idx]}: {scores[idx]:.4f}")
```

### 4.4 中文模型

```python
from sentence_transformers import SentenceTransformer

# 中文模型
model = SentenceTransformer('moka-ai/m3e-base')

# 中文文本嵌入
sentences = ["你好，世界", "今天天气不错"]
embeddings = model.encode(sentences)
```

---

## 5. 模型列表

### 5.1 英文模型

| 模型 | 维度 | 速度 | 质量 | 用途 |
|------|------|------|------|------|
| **all-MiniLM-L6-v2** | 384 | 最快 | 中 | 通用、速度优先 |
| **all-mpnet-base-v2** | 768 | 中 | 最高 | 通用、质量优先 |
| **multi-qa-mpnet-base** | 768 | 中 | 高 | 问答、搜索 |
| **ms-marco-MiniLM-L-6** | 384 | 快 | 高 | 问答 |
| **bge-base-en-v1.5** | 768 | 中 | 最高 | 通用 (BGE) |

### 5.2 多语言模型

| 模型 | 语言 | 维度 | 说明 |
|------|------|------|------|
| **paraphrase-multilingual-MiniLM-L12-v2** | 50+ | 384 | 多语言 paraphrase |
| **bge-m3** | 100+ | 1024 | BGE M3 (最新) |
| **multilingual-e5-large** | 100+ | 1024 | E5 多语言版 |

### 5.3 中文模型

| 模型 | 维度 | 说明 |
|------|------|------|
| **moka-ai/m3e-base** | 768 | M3E 中文优化 |
| **shibing624/text2vec-base-chinese** | 768 | 中文 text2vec |
| **BAAI/bge-large-zh-v1.5** | 1024 | BGE 中文旗舰 |

### 5.4 代码模型

| 模型 | 维度 | 说明 |
|------|------|------|
| **microsoft/codebert-base** | 768 | CodeBERT |
| **bigcode/starencoder** | 768 | StarCoder 嵌入 |
| **nthakur/code-embeddings** | 768 | 代码专用 |

---

## 6. 对比与选择

### 6.1 与其他方案对比

| 方案 | 特点 | 适用场景 |
|------|------|----------|
| **Sentence-Transformers** | 生态完整、开源 | 通用语义搜索 |
| **OpenAI Embedding** | 云服务、托管 | 快速原型 |
| **Instructor** | 多任务嵌入 | 结构化任务 |

### 6.2 选型建议

| 场景 | 推荐模型 |
|------|----------|
| 英文通用搜索 | all-MiniLM-L6-v2 / all-mpnet-base-v2 |
| 中文搜索 | bge-large-zh-v1.5 / m3e-base |
| 多语言 | paraphrase-multilingual / bge-m3 |
| 代码搜索 | codebert-base / starencoder |

---

## 参考资源

- [Sentence-Transformers GitHub](https://github.com/UKPLab/sentence-transformers)
- [HuggingFace 模型库](https://huggingface.co/sentence-transformers)
- [MTEB 基准](https://huggingface.co/blog/mteb)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*

## Related

- [[14_RAG_Systems/RAG-in-nutshell.md|RAG-in-nutshell]]
- [[14_RAG_Systems/RAG_Systems.md|RAG_Systems]]
- [[14_RAG_Systems/README_Advanced.md|README_Advanced]]
- [[14_RAG_Systems/RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md|Spring_AI_RAG_Deep_Dive]]
- [[_synthesis/rag-vector-database.md|rag-vector-database]]
