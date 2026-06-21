---
title: "Embedding 模型选型与实践指南 2026"
category: "11-rag-systems"
tags: ["embedding", "vector", "rag", "semantic-search", "model-selection"]
summary: "Embedding 模型是 RAG 和语义搜索的核心,本文对比主流 Embedding 模型的性能、维度、成本,提供选型建议。"
sources:
  - "https://huggingface.co/spaces/mteb/leaderboard"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: supporting
---

# Embedding 模型选型与实践指南 2026

> **一句话理解**: Embedding 模型是 RAG 和语义搜索的核心,本文对比主流 Embedding 模型的性能、维度、成本,提供选型建议。

## 什么是 Embedding?

Embedding 是将文本转换为高维向量的模型,语义相似的文本在向量空间中距离相近。它是 RAG、语义搜索、聚类等应用的基础。

## 主流模型对比

### 闭源 API 模型
| 模型 | 厂商 | 维度 | 最大 token | MTEB 排名 | 成本 |
|------|------|------|-----------|----------|------|
| text-embedding-3-large | OpenAI | 3072 | 8191 | 顶级 | $0.13/1M tokens |
| text-embedding-3-small | OpenAI | 1536 | 8191 | 优秀 | $0.02/1M tokens |
| embed-v3 | Cohere | 1024 | 512 | 顶级 | $0.1/1M tokens |
| Gecko | Google | 768 | 2048 | 优秀 | 免费 |

### 开源模型
| 模型 | 厂商 | 维度 | 最大 token | MTEB 排名 | 许可证 |
|------|------|------|-----------|----------|--------|
| bge-large-en-v1.5 | BAAI | 1024 | 512 | 顶级 | MIT |
| e5-large-v2 | Microsoft | 1024 | 512 | 优秀 | MIT |
| gte-large | Alibaba | 1024 | 512 | 优秀 | Apache |
| nomic-embed-text | Nomic | 768 | 8192 | 优秀 | Apache |
| mxbai-embed-large | Mixedbread | 1024 | 512 | 顶级 | Apache |

## 选型决策树

```
需要 Embedding 模型?
  |
  +-- 数据敏感? -> 开源本地部署
  |     |
  |     +-- 中文为主? -> bge-large-zh
  |     +-- 英文为主? -> bge-large-en / mxbai-embed-large
  |     +-- 多语言? -> multilingual-e5-large
  |
  +-- 数据不敏感? -> API 模型
        |
        +-- 成本敏感? -> text-embedding-3-small
        +-- 质量优先? -> text-embedding-3-large / embed-v3
```

## 关键指标

| 指标 | 说明 | 建议 |
|------|------|------|
| 维度 | 向量维度,越高信息越丰富 | 768-1536 够用 |
| 最大 token | 支持的最大输入长度 | 根据文档长度选择 |
| MTEB 分数 | 通用嵌入基准测试排名 | 参考但不唯分数论 |
| 推理速度 | 每秒处理的文本量 | 大规模场景重要 |
| 多语言支持 | 是否支持中文等非英文 | 中文场景必须考虑 |

## 最佳实践

1. **维度缩减**: text-embedding-3 支持维度缩减,用 256 维也能保持不错效果
2. **分块策略**: Embedding 的质量取决于分块质量
3. **混合检索**: Embedding + BM25 关键词检索通常效果更好
4. **定期更新**: 模型更新后需要重新 Embedding 全部数据
5. **缓存**: 相同文本的 Embedding 结果可以缓存

## 常见陷阱

- **维度不匹配**: 查询和文档必须用同一模型 Embedding
- **语言不匹配**: 英文模型处理中文效果差
- **过长截断**: 超过最大 token 的文本会被截断
- **归一化**: 有些模型需要 L2 归一化才能正确计算相似度

> **关联**: -> [[14_RAG_Systems|RAG 系统]] | [[14_RAG_Systems/Sentence_Transformers_Deep_Dive|Sentence Transformers]] | [[14_RAG_Systems/Vector_Database_for_dummy|向量数据库]]

