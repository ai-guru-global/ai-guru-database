---
title: "重排序模型 Reranker (Cross-Encoder Reranking Model)"
category: -concepts
tags: ["reranker", "reranking", "cross-encoder", "bge", "rag", "retrieval", "ai-stack"]
relationships:
  - target: "_concepts/embedding-models"
    type: related_to
  - target: "_concepts/rag-systems"
    type: related_to
  - target: "_concepts/agentic-rag"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Reranker（重排序模型）是 RAG 流水线的第二阶段——对检索返回的候选文档进行精排，显著提升最终答案质量。AI Stack 预置 BAAI bge-reranker-v2-m3。"
provenance:
  extracted: 0.30
  inferred: 0.60
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: core
---

# 重排序模型 Reranker

> **一句话理解**: Reranker 是 RAG 的"质量守门员"——检索模型粗筛 100 个候选，Reranker 精排 Top-10，准确率直接提升 10-30%。

---

## 1. 核心问题：两阶段检索

```
RAG 两阶段检索流水线
│
├── 第一阶段：粗筛（Retrieval）
│   ├── 双塔编码器（Bi-Encoder / Embedding）
│   ├── 向量相似度搜索（ANN）
│   ├── 返回 Top-100 候选
│   └── 速度：毫秒级，但精度有限
│
└── 第二阶段：精排（Reranking）← 本文
    ├── 交叉编码器（Cross-Encoder / Reranker）
    ├── 逐对精确打分
    ├── 返回 Top-10 最终结果
    └── 速度：较慢，但精度高
```

---

## 2. Bi-Encoder vs Cross-Encoder

| 维度 | Bi-Encoder (Embedding) | Cross-Encoder (Reranker) |
|------|----------------------|------------------------|
| **编码方式** | Query 和 Doc 分别编码 | Query 和 Doc 拼接后联合编码 |
| **交互深度** | 无交互（仅向量相似度） | 全层交互（注意力交叉） |
| **速度** | 毫秒级（可批量） | 百毫秒级（逐对） |
| **精度** | 中等 | 高 |
| **可扩展性** | 百万级文档 | 仅重排候选集 |
| **典型模型** | bge-m3, GTE, E5 | bge-reranker, Cohere Rerank |
| **角色** | 第一阶段粗筛 | 第二阶段精排 |

---

## 3. AI Stack 预置模型

AI Stack 知识库预置 **bge-reranker-v2-m3**：

| 模型 | 来源 | 参数量 | 多语言 | 特点 |
|------|------|--------|--------|------|
| **bge-reranker-v2-m3** | BAAI (智源) | 568M | 100+ 语言 | 多语言重排序，AI Stack 预置 |

### bge-reranker-v2-m3 详情

| 属性 | 值 |
|------|-----|
| **基座模型** | XLM-RoBERTa-large |
| **最大长度** | 8192 tokens |
| **训练数据** | 多语言平行语料 + 硬负例 |
| **支持语言** | 中文/英文/日文等 100+ 语言 |
| **许可** | Apache 2.0 |

---

## 4. 主流 Reranker 方案对比

| 模型 | 来源 | 参数量 | 多语言 | 特点 |
|------|------|--------|--------|------|
| **bge-reranker-v2-m3** | BAAI | 568M | ✅ | 开源多语言首选 |
| **bge-reranker-v2-gemma** | BAAI | 2B | ✅ | 基于 Gemma，更强 |
| **Cohere Rerank 3** | Cohere | 闭源 | ✅ | 商业 API |
| **Jina Reranker** | Jina AI | 278M | ✅ | 轻量级 |
| **ms-marco-MiniLM** | 微软 | 33M | ❌ 英文 | 经典小模型 |

---

## 5. 在 RAG 中的效果

| 策略 | Recall@10 | MRR | NDCG@10 | 延迟 |
|------|----------|-----|---------|------|
| 仅 Embedding | 0.72 | 0.58 | 0.65 | ~10ms |
| Embedding + Reranker | **0.85** | **0.71** | **0.78** | ~200ms |
| 提升 | **+18%** | **+22%** | **+20%** | +190ms |

> Reranker 以 ~200ms 额外延迟换取 **10-30% 的精度提升**，在高价值场景中性价比极高。

---

## 6. AI Stack 知识库架构

```
AI Stack 知识库 RAG 流水线
│
├── 文档上传 → doc/docx/pdf/txt
├── 智能切分 → 自动分段
├── Embedding → 向量编码（Qwen3-Embedding-8B）
├── 向量检索 → 粗筛 Top-100
├── Reranker → bge-reranker-v2-m3 精排 Top-10 ← 本文
└── 生成 → 大模型基于 Top-10 回答
```

---

## Related

- [[_concepts/embedding-models]] — 嵌入模型
- [[_concepts/rag-systems]] — RAG 系统
- [[_concepts/agentic-rag]] — Agentic RAG
- [[_concepts/vector-database]] — 向量数据库
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive]] — AI Stack 深度解析
