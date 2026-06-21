---
title: RAG 系统 × 向量数据库
category: synthesis
tags: [rag, vector-database, embedding, retrieval, hnsw, milvus, qdrant]
sources: [_concepts/rag-systems.md, _concepts/vector-database.md]
created: 2026-05-31T21:30:00+08:00
updated: 2026-05-31T21:30:00+08:00
summary: "检索增强生成的精度瓶颈不在生成端，而在检索端：向量数据库的近似最近邻算法决定了语义检索的上限，进而决定了整个 RAG 系统的天花板。"
provenance:
  extracted: 0.4
  inferred: 0.5
  ambiguous: 0.1
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
---

# RAG 系统 × 向量数据库

## The Connection

RAG（检索增强生成）的直觉很简单：LLM 记不住所有知识，所以让外部数据库帮它"开卷考试"。但很少有人追问：**这个"外部数据库"的能力边界，直接就是 RAG 系统的能力边界。** [[_concepts/vector-database]] 不是 RAG 的"附件"，而是 RAG 的**感知器官**——它决定了模型能"看到"什么信息，以及以什么精度"看到"。

## Where They Co-occur

- 几乎所有生产级 RAG 系统（LangChain、LlamaIndex、Haystack）都将向量数据库作为默认检索后端
- HNSW、IVF 等 ANN 算法的 recall@k 直接对应 RAG 的上下文召回率
- Embedding 模型的更新（如从 text-embedding-ada-002 到 bge-m3）通常需要向量数据库的全量重索引

## Cross-cutting Insight

> **RAG 的 90%+ 准确率目标，要求检索层必须同时解决"语义匹配"和"结构化过滤"两个问题，而纯向量检索只解决了前者。**

2026 年的先进 RAG 系统已经从"向量检索 + 重排序"进化为**混合检索**（向量 + 关键词 + 知识图谱 + SQL 过滤器）。向量数据库本身也在增加稀疏向量、多模态向量、元数据过滤等能力，从"纯向量引擎"向"AI 原生数据库"演化。这意味着向量数据库和 RAG 系统的边界正在模糊。

## Tensions and Trade-offs

- **Recall vs Latency**：HNSW 的 ef 参数越高，召回率越好，但延迟也越高；在生产环境中需要为不同查询动态调整
- **Embedding 一致性**：如果检索时的 embedding 模型与索引时的模型不同，语义空间漂移会导致检索失效
- **成本**：大规模向量数据库（十亿级向量）的内存和存储成本可能成为 RAG 部署的主要开销

## Open Questions

- 图数据库（Neo4j）与向量数据库的融合是否会成为 RAG 的下一代基础设施？
- 原生多模态向量检索（图像+文本+音频统一嵌入）何时能达到生产可用？
- 向量数据库的"schema"应该如何演化，才能适应不断变化的业务实体关系？

## Related

- [[14_RAG_Systems/RAG-in-nutshell]] — RAG (检索增强生成) 速成指南 (共享: embedding, rag, retrieval, vector-database)
- [[14_RAG_Systems/RAG_Systems]] — RAG 系统 (RAG Systems) (共享: embedding, rag, retrieval, vector-database)
- [[14_RAG_Systems/README_Advanced]] — RAG高级实践 2026 (共享: embedding, rag, retrieval, vector-database)
- [[14_RAG_Systems/Spring_AI_RAG_Deep_Dive]] — Spring AI RAG 深度解析 (共享: embedding, rag, retrieval, vector-database)
