---
title: "Cross-Encoder"
category: -concepts
tags: ["rag", "reranker", "nli", "retrieval", "alibaba-cloud"]
summary: "Cross-Encoder 是一种将查询和文档一起输入 Transformer 进行交互计算的重排序模型，精度高但延迟大，常用于 RAG 第二阶段精排。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "交叉编码器"
  - "Reranker"
relationships:
  - target: "_concepts/reranker"
    type: is_a
  - target: "_concepts/rag-systems"
    type: used_by
sources: []
---

# Cross-Encoder

> **一句话理解**: Cross-Encoder 把「问题和候选文档」拼在一起让模型打分，精度比双塔模型高，但因为要一对一对算，所以更慢、更贵。

## 核心要点

- **交互式编码**: query 和 document 一起进入 Transformer，能捕捉细粒度交互。
- **高精度**: 通常优于 Bi-Encoder 点积相似度。
- **高延迟**: 每对 query-document 都要前向传播一次。
- **常用模型**: `cross-encoder/ms-marco-MiniLM-L-6-v2`、`bge-reranker-base`。
- **使用位置**: 向量检索召回 top-k 后，再用 Cross-Encoder 精排。

## 延迟优化

| 策略 | 效果 |
|------|------|
| 减少 top_k | 直接减少 rerank 次数 |
| 模型量化 / ONNX | 加速推理 |
| 批处理 | 提高吞吐 |
| 换轻量 reranker | 精度换速度 |

## 阿里云专有云关联

在阿里云专有云 RAG 系统中，Cross-Encoder 可部署在 PAI-EAS 或 ACK 中作为独立 rerank 服务。工单中「检索结果排序质量差」时，可引入 Cross-Encoder；若延迟过高，则需减少候选数或换轻量模型。

## Related

- [[_concepts/reranker|Reranker]]
- [[_concepts/rag-systems|RAG Systems]]
- [[_concepts/retrieval-latency|Retrieval Latency]]
- [[14_RAG_Systems/Advanced_RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]
