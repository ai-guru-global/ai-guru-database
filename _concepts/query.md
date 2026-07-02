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
updated: 2026-07-02
sources: []
---

# Query

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

- [[_concepts/retrieval-latency|检索延迟]]
- [[_concepts/rag-systems|RAG 系统]]
- [[_concepts/rag-patterns|RAG 模式]]
- [[_concepts/prompt-engineering|提示工程]]
- [[_concepts/vector-database|向量数据库]]
- [[14_RAG_Systems/README|RAG 系统章节]]
- [[05_NLP_LLMs/Prompt_Engineering/README|提示工程章节]]
- [[05_NLP_LLMs/README|自然语言处理与大模型章节]]
