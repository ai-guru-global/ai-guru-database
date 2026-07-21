---
title: 混合检索 (Hybrid Search)
category: 05-rag
tags: ["hybrid-search", "bm25", "vector-search", "reranking", "colbert"]
summary: "混合检索完整指南：BM25+向量融合、重排序（Reranking）、ColBERT/RRF 算法、Elasticsearch/Weaviate 实战、2026 检索最佳实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 混合检索 (Hybrid Search)

## 1. 为什么需要混合检索？

```
单一检索的局限:

BM25 (关键词):
  ✅ 精确匹配 (产品名/错误码/专有名词)
  ❌ 语义理解弱 ("汽车" 搜不到 "轿车")

向量检索 (语义):
  ✅ 语义理解强 (同义词/释义)
  ❌ 精确匹配弱 (长尾词/稀有词)

混合检索 = BM25 + 向量 + 重排序
  → 兼顾精确匹配和语义理解
  → 2026 生产 RAG 的标配
```

## 2. 架构

```python
class HybridSearchEngine:
    """混合检索: BM25 + 向量 + 重排序"""
    
    def __init__(self, vector_db, bm25_index, reranker):
        self.vector_db = vector_db      # 向量数据库
        self.bm25 = bm25_index          # BM25 索引
        self.reranker = reranker        # 重排序模型
    
    async def search(self, query, top_k=10):
        """混合检索流程"""
        # 1. 并行检索
        vector_results = await self.vector_db.search(
            query_embedding=embed(query),
            top_k=top_k * 2,  # 多取一些
        )
        bm25_results = self.bm25.search(
            query=query,
            top_k=top_k * 2,
        )
        
        # 2. 融合 (RRF)
        merged = self.reciprocal_rank_fusion(
            [vector_results, bm25_results],
            k=60,  # RRF 常数
        )
        
        # 3. 重排序 (Cross-Encoder)
        reranked = await self.reranker.rerank(
            query=query,
            documents=merged[:top_k * 2],
            top_k=top_k,
        )
        
        return reranked
    
    def reciprocal_rank_fusion(self, result_lists, k=60):
        """
        RRF (Reciprocal Rank Fusion):
        score(d) = Σ 1/(k + rank_i(d))
        """
        scores = {}
        for results in result_lists:
            for rank, doc in enumerate(results):
                if doc.id not in scores:
                    scores[doc.id] = {"doc": doc, "score": 0}
                scores[doc.id]["score"] += 1.0 / (k + rank + 1)
        
        # 按融合分数排序
        sorted_docs = sorted(
            scores.values(), key=lambda x: x["score"], reverse=True
        )
        return [item["doc"] for item in sorted_docs]
```

## 3. 重排序 (Reranking)

```python
RERANKING_MODELS = {
    "开源": {
        "bge-reranker-v2-m3": "BAAI, 多语言, 最常用",
        "jina-reranker-v2": "Jina AI, 多语言",
        "ms-marco-MiniLM": "经典, 英文",
        "Cohere Rerank 3": "API, 最强",
    },
    "2026 新": {
        "ColBERT v3": "延迟交互, 高效",
        "RankGPT": "LLM-as-Reranker",
        "bge-reranker-v3": "BAAI 最新",
    },
}

# ColBERT 风格: 延迟交互
class ColBERTRetrieval:
    """
    ColBERT: token 级交互
    - 文档 token 独立编码 (可预计算)
    - 查询 token 与文档 token 逐一交互
    - 比 Cross-Encoder 快 100x, 比 Bi-Encoder 准
    """
    def search(self, query, documents):
        query_tokens = self.encode_query(query)  # [num_tokens, dim]
        
        scores = []
        for doc in documents:
            doc_tokens = self.get_precomputed(doc.id)  # 预计算
            # MaxSim: 每个 query token 找最相似的 doc token
            sim_matrix = query_tokens @ doc_tokens.T
            score = sim_matrix.max(dim=1).values.sum()
            scores.append(score)
        
        return sorted(zip(documents, scores), key=lambda x: -x[1])
```

## 4. 实现方案对比

| 方案 | BM25 | 向量 | 重排序 | 适用 |
|------|------|------|--------|------|
| Elasticsearch 8+ | ✅ 原生 | ✅ kNN | 需外接 | 已有 ES |
| Weaviate | ✅ BM25 | ✅ 原生 | ✅ 内置 | 一体化 |
| Qdrant | 需外接 | ✅ 原生 | ✅ 内置 | 向量为主 |
| Vespa | ✅ 原生 | ✅ 原生 | ✅ 内置 | 大规模 |
| LlamaIndex | 可组合 | 可组合 | 可组合 | Python |
| 自建 | BM25库 | pgvector | HF模型 | 完全控制 |

## 5. 2026 最佳实践

```python
HYBRID_SEARCH_BEST_PRACTICES = {
    "检索": [
        "BM25 + 向量并行 (不要只用一种)",
        "向量: 使用最新嵌入模型 (bge-m3/text-embedding-3)",
        "BM25: 中文需分词 (jieba/ik)",
        "多路召回: top_k * 2~3 再重排",
    ],
    "重排序": [
        "必加! 重排序可提升 10-20% 准确率",
        "Cross-Encoder 最准但慢",
        "ColBERT 平衡速度和准确率",
        "LLM Rerank 最贵但最灵活",
    ],
    "优化": [
        "查询改写: 扩展/分解查询",
        "元数据过滤: 先过滤再检索",
        "缓存: 热门查询缓存结果",
        "A/B 测试: 持续优化权重",
    ],
}
```

## 6. 交叉引用

- [[RAG系统/|RAG 系统]]
- [[RAG系统/Chunking_Strategies/Chunking_Strategies|分块策略]]
- [[RAG系统/Knowledge_Graph_RAG/Knowledge_Graph_RAG|知识图谱 RAG]]
- [[概念/RAG/embedding-models|嵌入模型]]
- [[概念/RAG/rag-patterns|RAG 模式]]
