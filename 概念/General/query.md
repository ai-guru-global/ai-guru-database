---
title: Query
category: concepts
tags:
  - query
  - retrieval
  - rag
  - prompt-engineering
  - information-retrieval
summary: 在人工智能与信息检索系统中，Query 是用户或系统向模型、数据库或搜索引擎发出的请求表达式，其质量直接决定召回内容与生成结果的相关性。
created: 2026-07-02
updated: 2026-07-21
sources: []
name_zh: "查询"
---

# Query

> 中文简称：查询

在 AI 与信息系统中，**Query（查询）** 是用户、智能体或下游模块向信息源发出的请求表达。它可以是自然语言问题、关键词组合、结构化语句（如 SQL、Cypher、SPARQL），也可以是向量嵌入或多模态输入。Query 的核心作用是把模糊的信息需求转化为可被检索、理解或执行的表示形式，从而驱动搜索、召回、推理或生成等后续链路。

## 核心原理与组成

一个典型的 Query 处理流程包含三个关键环节：

1. **查询理解（Query Understanding）**：对原始输入进行分词、意图识别、实体抽取与消歧，明确用户真正想要的信息。
2. **查询表示（Query Representation）**：根据后端类型，将 Query 编码为稀疏向量（如 BM25 词袋）、稠密向量（Embedding）或结构化查询语句。
3. **查询执行与结果整合（Query Execution & Fusion）**：在数据库、索引或模型中执行检索/推理，并通过重排序、过滤、聚合等手段提升结果质量。

在大型语言模型（LLM）场景中，Query 还会被扩展为 **查询改写（Query Rewriting）**、**查询分解（Query Decomposition）** 或 **多跳查询（Multi-hop Query）**，以解决复杂或隐含的信息需求。

## 典型用例

- **搜索引擎**：用户输入关键词，系统返回相关网页或文档。
- **检索增强生成（RAG）**：Query 用于从向量数据库或知识库中召回上下文，再交给 LLM 生成答案。
- **数据库查询**：SQL/NoSQL 查询从结构化数据中获取特定记录或聚合结果。
- **智能助手**：自然语言 Query 触发意图分类、API 调用或多轮对话。
- **推荐系统**：用户的隐式 Query（如浏览历史、点击行为）驱动个性化推荐。

## 与相关概念的区别与联系

- **Query vs Prompt**：Prompt 特指输入给生成模型的指令或上下文，通常包含任务描述、示例和约束；Query 更强调“信息请求”，用于检索、查找或召回。两者在 RAG 中常结合使用：Query 召回上下文，Prompt 组织上下文并引导生成。
- **Query vs Search**：Search 是一种基于 Query 获取信息的行为或系统；Query 是 Search 的输入。
- **Query vs Retrieval**：Retrieval 是执行 Query 后从索引中返回候选结果的过程；Query 是 Retrieval 的触发条件。
- **Query vs Keyword**：Keyword 是最简单的 Query 形式，而现代 Query 可以是语义化、结构化或多模态的。

## Related

- [[概念/retrieval-latency|检索延迟]]
- [[概念/rag-systems|RAG 系统]]
- [[概念/rag-patterns|RAG 模式]]
- [[概念/prompt-engineering|提示工程]]
- [[概念/vector-database|向量数据库]]
- [[14_RAG系统/README|RAG 系统章节]]
- [[05_大模型/08_Prompt_Engineering/README|提示工程章节]]
- [[05_大模型/README|自然语言处理与大模型章节]]

---

## 2026 查询生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **向量查询** | 语义相似度查询 | GA |
| **混合查询** | 关键词 + 向量混合 | GA |
| **NL2SQL** | 自然语言转 SQL | GA |
| **RAG 查询** | 检索增强生成查询 | GA |
| **多模态查询** | 图文/音视频查询 | GA |

## 生产最佳实践

1. **向量查询**：语义搜索用向量查询
2. **混合查询**：关键词 + 向量混合查询
3. **NL2SQL**：结构化数据用 NL2SQL
4. **RAG 查询**：知识问答用 RAG 查询
5. **查询优化**：查询性能优化

## 查询类型对比

| 查询类型 | 表示形式 | 适用场景 | 工具 |
|------|------|------|------|
| 关键词查询 | BM25 稀疏向量 | 精确匹配 | Elasticsearch |
| 语义查询 | Embedding 稠密向量 | 语义相似 | Milvus/Pinecone |
| 混合查询 | 稀疏 + 稠密 | 综合召回 | Vespa/Weaviate |
| 结构化查询 | SQL/Cypher | 精确条件 | PostgreSQL/Neo4j |
| 多模态查询 | 图文向量 | 跨模态检索 | CLIP |

## 查询改写策略

| 策略 | 说明 | 示例 |
|------|------|------|
| 同义词扩展 | 添加同义词提升召回 | "汽车" → "汽车 OR 轿车 OR 车辆" |
| 查询分解 | 复杂问题拆分为子问题 | "A和B的区别" → ["A是什么", "B是什么"] |
| HyDE | 生成假设答案再检索 | LLM 生成答案 → Embedding → 检索 |
| 多查询 | 生成多个查询变体 | 一个问题 → 3-5 个查询 |
| Step-back | 抽象化查询 | 具体问题 → 抽象概念查询 |

## 查询优化技术

| 技术 | 说明 | 效果 |
|------|------|------|
| 查询缓存 | 缓存高频查询结果 | 减少延迟 50-90% |
| 预计算 | 提前计算常见查询 | 减少实时计算 |
| 索引优化 | 合理设计索引结构 | 提升检索速度 |
| 重排序 | 精排模型二次排序 | 提升准确率 |
| 过滤前置 | 先过滤再向量检索 | 减少搜索空间 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 召回不相关 | 查询与文档语义差距大 | 查询改写/HyDE |
| 延迟高 | 索引未优化 | 添加索引/缓存 |
| 多义性 | 查询词多义 | 意图识别/上下文消歧 |
| 长尾查询 | 罕见词无匹配 | 语义查询补充 |
| 多语言 | 跨语言检索 | 多语言 Embedding |

## 相关概念

- [[概念/retrieval-latency|检索延迟]] — 检索性能优化
- [[概念/vector-database|向量数据库]] — 语义检索存储
- [[概念/prompt-engineering|提示工程]] — 查询与提示的关系

> 💡 Query 是信息检索的起点，其质量直接决定召回效果——在 RAG 系统中，查询优化是提升答案质量的第一杠杆。

## RAG 查询流水线

```python
# RAG 查询处理示例
from langchain.retrievers import MultiQueryRetriever

# 1. 查询改写：生成多个查询变体
retriever = MultiQueryRetriever.from_llm(
    llm=llm,
    retriever=vector_store.as_retriever(search_kwargs={"k": 10}),
)

# 2. 混合检索：关键词 + 向量
from langchain.retrievers import EnsembleRetriever
ensemble = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever],
    weights=[0.4, 0.6],
)

# 3. 重排序
from langchain.retrievers import ContextualCompressionRetriever
compressor = CrossEncoderReranker(model=cross_encoder)
retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=ensemble,
)
```

## 查询性能基准

| 查询类型 | P50 延迟 | P99 延迟 | QPS | 工具 |
|------|------|------|------|------|
| BM25 关键词 | 5ms | 20ms | 10K+ | Elasticsearch |
| 向量 ANN | 10ms | 50ms | 5K+ | Milvus |
| 混合查询 | 20ms | 80ms | 2K+ | Vespa |
| NL2SQL | 200ms | 1s | 100+ | LLM + DB |
| RAG 全链路 | 500ms | 3s | 50+ | LangChain |

## 查询安全考虑

| 风险 | 说明 | 防护 |
|------|------|------|
| 提示注入 | 恶意查询操纵 LLM | 输入过滤/沙箱 |
| SQL 注入 | 结构化查询注入 | 参数化查询 |
| 数据泄露 | 查询返回敏感数据 | 权限控制/脱敏 |
| 资源耗尽 | 复杂查询占用资源 | 超时/限流 |

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| Elasticsearch | 8.x+ | GA |
| Milvus | 2.4+ | GA |
| LangChain | 0.3+ | GA |
| LlamaIndex | 0.11+ | GA |

## 生产检查清单

1. 确定查询类型（关键词/语义/混合/结构化）
2. 配置查询缓存策略
3. 设置查询超时和限流
4. 实现查询日志和审计
5. 配置重排序模型提升精度
6. 建立查询性能监控
7. 实现查询安全防护（注入/泄露）
8. 定期评估召回率和精度指标

## 总结

Query 是信息检索和 RAG 系统的核心输入，其质量直接决定召回效果和最终答案质量。现代查询处理已从简单关键词匹配演进为语义理解、查询改写、混合检索、重排序的多阶段流水线。

> 💡 在 RAG 系统中，查询优化的 ROI 最高——相比更换模型或增加数据，优化查询策略往往能更快提升答案质量。

## 常用命令

| 命令 | 说明 |
|------|------|
| `curl -X POST /search -d '{"query": "..."}'` | 执行搜索查询 |
| `milvus search --collection docs` | Milvus 向量查询 |
| `es search --index docs --query "..."` | ES 关键词查询 |
