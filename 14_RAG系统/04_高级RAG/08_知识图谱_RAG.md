---
title: 知识图谱 RAG (Knowledge Graph RAG)
category: 05-rag
tags: ["knowledge-graph", "graphrag", "neo4j", "entity-extraction", "graph-retrieval"]
summary: "知识图谱 RAG 完整指南：GraphRAG 架构、实体/关系抽取、Neo4j/Neptune 实战、图检索策略、Microsoft GraphRAG、与向量检索的混合方案。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "知识图谱 RAG"
---
# 知识图谱 RAG (Knowledge Graph RAG)

> 中文简称：知识图谱 RAG

## 1. 为什么需要知识图谱？

```
纯向量 RAG 的局限:
- 无法表达实体间关系 (A 是 B 的子公司)
- 多跳推理困难 (A→B→C 的传递关系)
- 缺乏全局视角 (只有局部片段)
- 时间推理弱 (事件先后顺序)

知识图谱 RAG 优势:
- 结构化关系: 实体-关系-实体 三元组
- 多跳检索: 沿关系路径遍历
- 全局摘要: 社区检测 → 层次化摘要
- 精确问答: "X 的 CEO 是谁?" → 直接图查询

适用场景:
- 企业知识库 (组织/产品/客户关系)
- 医疗 (疾病-症状-药物)
- 法律 (法条-案例-判决)
- 金融 (公司-持股-交易)
```

## 2. GraphRAG 架构

```python
class GraphRAGPipeline:
    """
    Microsoft GraphRAG 风格:
    文档 → 实体抽取 → 图构建 → 社区检测 → 层次摘要 → 检索
    """
    def __init__(self, llm, graph_db):
        self.llm = llm
        self.graph = graph_db  # Neo4j / NetworkX
    
    async def build_index(self, documents):
        """构建知识图谱索引"""
        # 1. 分块
        chunks = self.chunk_documents(documents)
        
        # 2. 实体和关系抽取
        for chunk in chunks:
            entities_relations = await self.extract_entities(chunk)
            self.graph.add_entities(entities_relations["entities"])
            self.graph.add_relations(entities_relations["relations"])
        
        # 3. 实体消歧/合并
        self.graph.merge_similar_entities(threshold=0.85)
        
        # 4. 社区检测 (Leiden 算法)
        communities = self.graph.detect_communities()
        
        # 5. 为每个社区生成摘要
        for community in communities:
            summary = await self.llm.summarize(
                entities=community.entities,
                relations=community.relations,
            )
            community.summary = summary
    
    async def query(self, question, mode="hybrid"):
        """图检索 + 向量检索"""
        if mode == "local":
            # 局部搜索: 找到相关实体 → 扩展邻居
            entities = await self.extract_entities(question)
            subgraph = self.graph.get_neighborhood(
                entities, hops=2
            )
            context = self.graph.subgraph_to_text(subgraph)
        
        elif mode == "global":
            # 全局搜索: 使用社区摘要
            relevant_communities = await self.search_communities(question)
            context = "\n".join(c.summary for c in relevant_communities)
        
        elif mode == "hybrid":
            # 混合: 图 + 向量
            graph_context = await self.query(question, mode="local")
            vector_context = await self.vector_search(question)
            context = graph_context + "\n" + vector_context
        
        return await self.llm.answer(question, context)
```

## 3. 实体/关系抽取

```python
ENTITY_EXTRACTION_PROMPT = """
从以下文本中抽取实体和关系:

文本: {text}

要求:
1. 实体类型: 人物/组织/产品/地点/事件/概念
2. 关系类型: 属于/创建/位于/导致/相关
3. 输出 JSON 格式

输出格式:
{
  "entities": [
    {"name": "...", "type": "...", "description": "..."}
  ],
  "relations": [
    {"source": "...", "target": "...", "type": "...", "weight": 0.9}
  ]
}
"""

# 使用 LLM 抽取:
async def extract_entities(llm, text):
    response = await llm.generate(
        prompt=ENTITY_EXTRACTION_PROMPT.format(text=text),
        response_format="json",
    )
    return parse_json(response)
```

## 4. 图数据库选择

| 数据库 | 类型 | 特色 | 适用规模 | 查询语言 |
|--------|------|------|----------|----------|
| Neo4j | 原生图 | 最成熟/社区大 | 十亿节点 | Cypher |
| Amazon Neptune | 托管 | AWS 集成 | 百亿 | Gremlin/SPARQL |
| TigerGraph | 原生图 | 高性能/分布式 | 百亿+ | GSQL |
| FalkorDB | Redis图 | 超低延迟 | 百万 | Cypher |
| NetworkX | 内存图 | 简单/研究 | 十万 | Python |
| pgvector+图 | 混合 | PostgreSQL 扩展 | 百万 | SQL |

## 5. 2026 最佳实践

```python
GRAPH_RAG_BEST_PRACTICES = {
    "图构建": [
        "实体消歧: 同一实体不同称呼需合并",
        "关系权重: 基于共现频率/置信度",
        "增量更新: 新文档只抽取增量实体",
        "质量控制: 人工审核高频实体",
    ],
    "检索策略": [
        "Local Search: 精确实体问答",
        "Global Search: 主题概览/总结",
        "Hybrid: 图 + 向量互补",
        "多跳限制: 最多 2-3 跳 (避免噪声)",
    ],
    "与向量 RAG 结合": [
        "向量检索: 语义相似段落",
        "图检索: 结构化关系/多跳",
        "融合: RRF (Reciprocal Rank Fusion)",
        "重排序: 综合两路结果",
    ],
}
```

## 6. 交叉引用

- [[14_RAG系统/|RAG 系统]]
- [[14_RAG系统/README.md|分块策略]]
- [[概念/RAG/hybrid-search|混合检索]]
- [[概念/RAG/rag-patterns|RAG 模式]]
- [[15_智能体/|智能体 (Agentic RAG)]]
