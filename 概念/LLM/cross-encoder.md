---
title: "Cross-Encoder"
category: -concepts
tags: ["rag", "reranker", "nli", "retrieval", "cross-encoder", "bi-encoder", "semantic-search"]
summary: "Cross-Encoder 是将查询和文档拼接后一起输入 Transformer 进行交互计算的重排序模型，精度显著优于 Bi-Encoder 点积相似度，但每对 query-doc 都需前向传播，延迟较高。常用于 RAG 第二阶段精排，是 2026 年生产 RAG 系统的标配组件。"
created: 2026-06-26
updated: 2026-07-21
tier: core
aliases:
  - "交叉编码器"
  - "Reranker"
  - "Cross Encoder"
relationships:
  - target: "概念/RAG/reranker"
    type: is_a
  - target: "概念/RAG/rag-systems"
    type: used_by
  - target: "概念/LLM/long-context-vs-rag"
    type: related_to
sources:
  - "https://arxiv.org/abs/2104.08821"  # Cross-Encoders for reranking
name_zh: "交叉编码器"
---

# Cross-Encoder

> 中文简称：交叉编码器

> **一句话理解**: Cross-Encoder 把「问题和候选文档」拼在一起让模型打分，精度比双塔模型高，但因为要一对一对算，所以更慢、更贵。

## 核心要点

- **交互式编码**: query 和 document 拼接后一起进入 Transformer，能捕捉细粒度语义交互
- **高精度**: 通常优于 Bi-Encoder 点积相似度 5-15% (NDCG@10)
- **高延迟**: 每对 query-document 都要前向传播一次，O(n) 复杂度
- **两阶段架构**: 向量检索召回 top-k → Cross-Encoder 精排 top-n

## Bi-Encoder vs Cross-Encoder

```
Bi-Encoder (双塔模型):
┌─────────┐   ┌─────────┐
│ Encoder │   │ Encoder │   ← 独立编码
│ (Query) │   │  (Doc)  │
└────┬────┘   └────┬────┘
     │              │
     └─── cos(q, d) ───┘   ← 点积/余弦相似度

Cross-Encoder (交叉编码器):
┌─────────────────────┐
│    Transformer       │   ← [CLS] Query [SEP] Doc [SEP]
│ (Query + Doc 拼接) │   ← 全注意力交互
└─────────┬───────────┘
          │
       score (0-1)        ← 直接输出相关性分数
```

| 维度 | Bi-Encoder | Cross-Encoder |
|------|-----------|---------------|
| 精度 | 良好 | **更高 (+5-15%)** |
| 速度 | 极快 (ANN) | 慢 (O(n) 前向) |
| 索引 | 支持向量索引 | 不支持 |
| 适用阶段 | 召回 (top-1000) | **精排 (top-50)** |
| 代表模型 | BGE/E5/GTE | bge-reranker/ms-marco |

## 主流 Cross-Encoder 模型 (2026)

| 模型 | 参数量 | 语言 | 特点 |
|------|:------:|------|------|
| **bge-reranker-v2-m3** | 568M | 多语言 | 综合最佳 |
| **bge-reranker-v2-gemma** | 2.5B | 多语言 | LLM-based，精度最高 |
| **ms-marco-MiniLM-L-6-v2** | 22M | 英文 | 轻量快速 |
| **ms-marco-MultiBERT-L-12** | 33M | 英文 | 经典基线 |
| **jina-reranker-v2** | 278M | 多语言 | 1K token 上下文 |
| **Cohere Rerank v3** | API | 多语言 | 商业 API |

## 两阶段 RAG 架构

```
用户查询
    │
    ▼
[Stage 1: 召回] Bi-Encoder + ANN
    │  10M 文档 → top-100 (10ms)
    ▼
[Stage 2: 精排] Cross-Encoder
    │  top-100 → top-10 (50-200ms)
    ▼
[Stage 3: 生成] LLM
    │  top-10 + Query → Answer
    ▼
最终回答
```

## 代码示例

```python
from sentence_transformers import CrossEncoder

# 加载 Cross-Encoder
model = CrossEncoder("BAAI/bge-reranker-v2-m3", max_length=512)

# 精排候选文档
query = "什么是向量数据库？"
candidates = [
    "向量数据库是专门存储和检索高维向量的数据库系统...",
    "关系数据库使用表格存储结构化数据...",
    "向量数据库通过 ANN 算法实现近似最近邻搜索...",
]

# 打分
pairs = [(query, doc) for doc in candidates]
scores = model.predict(pairs)  # [0.95, 0.12, 0.88]

# 按分数排序
ranked = sorted(zip(candidates, scores), key=lambda x: -x[1])
```

## 延迟优化策略

| 策略 | 效果 | 精度影响 |
|------|------|----------|
| 减少 top_k (100→50) | 延迟减半 | 微小 |
| 模型量化 / ONNX | 加速 2-3× | <1% |
| 批处理 (batch=32) | 吞吐提升 | 无 |
| 换轻量模型 (MiniLM) | 加速 5× | -3% |
| GPU 推理 | 加速 10× | 无 |
| 截断文档 (512 tokens) | 减少计算 | 微小 |

## 生产最佳实践

1. **top_k 控制在 50-100**：太多增加延迟，太少可能漏掉相关文档
2. **优先 bge-reranker-v2-m3**：多语言场景综合最佳，中文支持优秀
3. **GPU 部署**：生产环境必须 GPU，CPU 延迟不可接受
4. **设置超时降级**：rerank 超时则跳过，直接用召回结果
5. **监控 NDCG 指标**：定期评估 rerank 后的检索质量
6. **考虑 LLM-based Reranker**：bge-reranker-v2-gemma 精度更高，适合质量敏感场景

## Related

- [[概念/RAG/reranker|Reranker]]
- [[概念/RAG/rag-systems|RAG Systems]]
- [[概念/RAG/vector-index|向量索引]]
- [[14_RAG系统/04_Advanced_RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]

## 2026 Cross-Encoder 生态

| 模型 | 参数 | 多语言 | 特点 | 状态 |
|------|:----:|:------:|------|:----:|
| **bge-reranker-v2-m3** | 568M | ✅ | 多语言最佳，中文优秀 | GA |
| **bge-reranker-v2-gemma** | 2B | ✅ | LLM-based，精度更高 | GA |
| **Cohere Rerank 3** | - | ✅ | 商业 API，精度极高 | GA |
| **Jina Reranker v2** | 278M | ✅ | 轻量级，速度快 | GA |
| **mxbai-rerank-v2** | 340M | ✅ | 开源，性价比高 | GA |
| **RankGPT** | - | ✅ | GPT 排序，精度极高但贵 | 实验 |

## Cross-Encoder vs Bi-Encoder

| 维度 | Cross-Encoder | Bi-Encoder |
|------|:------------:|:----------:|
| **精度** | 极高 | 中 |
| **速度** | 慢 (O(n)) | 快 (O(1)) |
| **适用** | 重排序 (Top-K) | 召回 (全库) |
| **输入** | [query, doc] 对 | 独立编码 |
| **交互** | 深度交叉注意力 | 无交互 |
| **典型用法** | RAG 重排序 | 向量检索 |

## RAG 中的使用模式

```
用户查询
  │
  ├─ 1. Bi-Encoder 召回 (Top-100)
  │     └─ 向量相似度，快速
  │
  ├─ 2. Cross-Encoder 重排序 (Top-100 → Top-10)
  │     └─ 精确打分，慢但准
  │
  └─ 3. LLM 生成 (Top-10 → 答案)
        └─ 基于精排结果生成
```

## 性能优化建议

| 策略 | 说明 | 效果 |
|------|------|------|
| **GPU 部署** | 生产必须 GPU | 延迟降 10x |
| **批量推理** | 合并多个 query-doc 对 | 吐量提升 3-5x |
| **截断策略** | 限制 doc 长度 (512 token) | 减少计算量 |
| **超时降级** | rerank 超时则跳过 | 保证可用性 |
| **缓存** | 缓存常见 query 的排序结果 | 减少重复计算 |

## 生产最佳实践补充

1. **召回+重排两阶段**：Bi-Encoder 召回 Top-100，Cross-Encoder 精排 Top-10
2. **优先 bge-reranker-v2-m3**：多语言场景综合最佳，中文支持优秀
3. **GPU 部署**：生产环境必须 GPU，CPU 延迟不可接受
4. **设置超时降级**：rerank 超时则跳过，直接用召回结果
5. **监控 NDCG 指标**：定期评估 rerank 后的检索质量
6. **考虑 LLM-based Reranker**：bge-reranker-v2-gemma 精度更高，适合质量敏感场景

## 延伸阅读

- [[概念/LLM/llamaindex|LlamaIndex]] — RAG 框架集成
- [[概念/RAG/rag-production-architecture|RAG 架构]] — RAG 系统全景
- [[概念/LLM/context-engineering|上下文工程]] — 检索后上下文管理
- [[概念/LLM/llm-inference-engine|推理引擎]] — 模型服务部署
