---
title: "GraphRAG / 知识图谱增强检索 (Microsoft GraphRAG / LightRAG)"
category: concepts
tags:
  - rag
  - graph-rag
  - knowledge-graph
  - microsoft-graphrag
  - lightrag
  - entity-relation
  - community-detection
aliases:
  - GraphRAG
  - Microsoft GraphRAG
  - LightRAG
  - Knowledge Graph RAG
relationships:
  - target: "概念/rag-systems"
    type: extends
  - target: "概念/vector-database"
    type: related_to
  - target: "概念/knowledge-graph"
    type: related_to
  - target: "概念/hybrid-search"
    type: related_to
summary: "GraphRAG 是 2024-2026 突破传统 RAG"切片检索"的关键范式——用 LLM 自动构建实体-关系图谱,做"全局问题"推理(数据集级问题、跨文档关联、社区摘要)。Microsoft GraphRAG(2024-07)+ LightRAG(2024-10)+ nano-graphrag(2025) 让 KG-RAG 工业化。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# GraphRAG / 知识图谱增强检索

> **一句话理解**:GraphRAG 不只是"向量 + 关键词"——它把文档拆成"实体 + 关系 + 社区",用 LLM 自动建图,然后让 LLM 沿图遍历找答案。是"跨文档全局问题"和"数据集级推理"的最强解。

---

## 一、为什么需要 GraphRAG?

传统 RAG 的痛点:
- **局部性问题**:只能回答"这个文档说了什么",难回答"整个数据集的趋势"
- **跨文档关联**:无法建立"文档 A 中的 X 和文档 B 中的 Y 是同一个人"
- **实体消歧**:多义词无法区分
- **关系推理**:无法回答"A 和 B 有什么关系"
- **社区发现**:无法发现"哪些实体属于同一主题"

GraphRAG 解法:
- 用 LLM 提取实体 + 关系 → 建图
- 用 Leiden / Louvain 算法做社区发现
- 每个社区生成摘要
- 查询时:实体匹配 → 图遍历 → 社区摘要

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 图增强检索 | GraphRAG | Knowledge Graph + RAG |
| 知识图谱 | Knowledge Graph(KG) | 实体-关系-实体三元组 |
| 实体 | Entity | 文档中的人/事/物 |
| 关系 | Relation | 实体间联系 |
| 三元组 | Triple | (头实体, 关系, 尾实体) |
| 节点 | Node | 图中的实体 |
| 边 | Edge | 图中的关系 |
| 社区发现 | Community Detection | Leiden / Louvain 算法 |
| 社区摘要 | Community Summary | 社区级别摘要 |
| 局部查询 | Local Query | 实体相关问题 |
| 全局查询 | Global Query | 数据集级问题 |
| 实体提取 | Entity Extraction | LLM 抽实体 |
| 关系提取 | Relation Extraction | LLM 抽关系 |
| 图遍历 | Graph Traversal | BFS/DFS/PPR |
| 个性化 PageRank | Personalized PageRank(PPR) | 关键节点排序 |
| 图嵌入 | Graph Embedding | node2vec / TransE |
| 图数据库 | Graph Database | Neo4j / Memgraph / TigerGraph |
| 文本到图 | Text-to-Graph | 从文本建图 |
| 多跳推理 | Multi-Hop Reasoning | A→B→C 多步推理 |
| 实体消歧 | Entity Disambiguation | 同名实体区分 |
| 关系推理 | Relational Reasoning | 沿关系推理 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 厂商/团队 | 核心特色 | 许可证 | 性能 |
|---|---|---|---|---|
| **Microsoft GraphRAG** | Microsoft | 实体抽取 + 社区发现 + 摘要 | MIT | ★★★★★ |
| **LightRAG** | HKUDS | 双层图(实体 + 关系)+ 增量更新 | MIT | ★★★★ |
| **nano-graphrag** | guangzhengli | 轻量、极简、易部署 | MIT | ★★★★ |
| **HippoRAG** | OSU | 神经-符号融合,Personalized PageRank | MIT | ★★★★ |
| **KAG** | 蚂蚁集团 | 知识增强生成,Logic form | Apache 2.0 | ★★★★ |
| **Cognee** | Cognee AI | ECL 流水线 + 知识图谱 | Apache 2.0 | ★★★ |
| **Neo4j + LangChain** | Neo4j | 成熟图数据库 + LLM 集成 | GPL / 商业 | ★★★★ |
| **Memgraph** | Memgraph | 高性能图数据库 | 商业 | ★★★★ |
| **TigerGraph** | TigerGraph | 企业级图数据库 | 商业 | ★★★★ |
| **RAGFlow** | InfiniFlow | 内置 GraphRAG | Apache 2.0 | ★★★★ |
| **Kuzu** | Kuzu | 嵌入式图数据库 | MIT | ★★★ |

---

## 四、Microsoft GraphRAG 架构

### 4.1 流水线

```
文档集
  → 文本分块(Chunk)
  → LLM 实体/关系抽取(每个 chunk)
  → 实体消歧 + 合并
  → Leiden 算法社区发现
  → 每个社区生成摘要(摘要 + 关键实体)
  → 索引持久化(Parquet / Neo4j)
```

### 4.2 关键组件

- **Indexer**:建图 + 社区摘要
- **Query Engine**:支持 local / global / DRIFT 搜索
- **Storage**:Parquet / Cosmos DB / Neo4j
- **Cost**:50 万 token 文档约 $5(OpenAI 4o)

### 4.3 查询模式

- **Local Search**:实体相关问题(类似传统 RAG)
- **Global Search**:数据集级问题(社区摘要聚合)
- **DRIFT Search**:Local + Global 混合
- **Multi-Hop**:多跳推理

### 4.4 实战

```bash
# 安装
pip install graphrag

# 初始化
mkdir my-graphrag && cd my-graphrag
graphrag init --root .

# 配置 .env 填入 OpenAI API Key

# 把文档放到 input/
cp my-docs/*.txt input/

# 建索引
graphrag index --root .

# 查询
graphrag query --root . --method global --query "数据集整体趋势?"
```

---

## 五、LightRAG 实战

### 5.1 核心创新

- **双层图**:实体节点 + 关系边
- **增量更新**:支持新文档动态加入
- **成本低**:50% GraphRAG 成本
- **多模态**:可扩展到图像

### 5.2 实战

```python
from lightrag import LightRAG, QueryParam
import asyncio

rag = LightRAG(
    working_dir="./lightrag_data",
    llm_model_func=gpt_4o_mini_complete,
    embedding_func=openai_embedding,
)

# 插入文档
with open("./book.txt") as f:
    rag.insert(f.read())

# 查询
result = rag.query(
    "这本书的核心主题是什么?",
    param=QueryParam(mode="hybrid")  # naive / local / global / hybrid
)
print(result)
```

---

## 六、与其他方案对比

| 维度 | 传统 RAG | GraphRAG | Long-Context RAG |
|---|---|---|---|
| 全局问题 | ❌ 弱 | ✓ 强 | ✓ 强(贵) |
| 跨文档关联 | ❌ | ✓ 强 | ✓ 强 |
| 实体消歧 | ❌ | ✓ 强 | ✓ 强 |
| 多跳推理 | ❌ | ✓ 强 | ✓ 强 |
| 成本 | 低 | 中-高 | 高 |
| 索引构建 | 简单 | 复杂 | 无 |
| 增量更新 | 简单 | 复杂 | — |
| 适合 | 局部问题 | 全局 + 局部 | 短文档全局 |

---

## 七、生产最佳实践

1. **评估问题类型**:数据集级 / 跨文档 → GraphRAG;局部问题 → 传统 RAG。
2. **先用 Microsoft GraphRAG 验证**:开源、成熟、文档好。
3. **成本敏感用 LightRAG / nano-graphrag**:50% 成本,功能 80%。
4. **图数据库选 Neo4j + LangChain**:成熟生态。
5. **混合检索**:向量 + 图遍历 + BM25,三层互补。
6. **增量更新选 LightRAG**:支持动态加文档。
7. **实体抽取用 GPT-4o**:准确率 90%+,小模型会漏。
8. **社区摘要缓存**:建索引是一次性成本,查询时直接用。
9. **评估用 RAGAS + LLM-as-Judge**:GraphRAG 评估比传统 RAG 复杂。
10. **多跳推理关键**:实体 + 关系 + 路径都需要在 prompt 中。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Microsoft GraphRAG** | v2.0(2025-09),DRIFT 搜索成熟,性能 3x 提升 |
| **LightRAG** | v1.0(2025-04),多模态支持,PostgreSQL 集成 |
| **HippoRAG** | v2(2025-Q3),OpenSPG 后端,神经-符号融合 |
| **KAG** | v0.8,蚂蚁内部广泛应用,2026 商业版 |
| **图数据库** | Neo4j 5.x / Memgraph 3.x / TigerGraph 4.x |
| **LLM 支持** | OpenAI / Anthropic / Qwen / DeepSeek / GLM |
| **混合 RAG** | RAGFlow / Dify / Haystack 全部集成 GraphRAG |
| **标准化** | GraphRAG 评测基准(GraphQA / MultiHop-RAG) |
| **企业应用** | 法律 / 金融 / 医疗 / 政企"全文档推理" |
| **市场规模** | 整体 GraphRAG 相关 ARR $200M+ |

---

## 九、See Also(官方源)

- Microsoft GraphRAG [github.com/microsoft/graphrag](https://github.com/microsoft/graphrag)
- Microsoft Research Blog [microsoft.com/en-us/research/blog/graphrag](https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/)
- LightRAG [github.com/HKUDS/LightRAG](https://github.com/HKUDS/LightRAG)
- nano-graphrag [github.com/guangzhengli/GraphRAG-Local-OLLama-Query](https://github.com/guangzhengli/GraphRAG-Local-OLLama-Query) / 多个社区实现
- HippoRAG [github.com/OSU-NLP-Group/HippoRAG](https://github.com/OSU-NLP-Group/HippoRAG)
- KAG [github.com/OpenSPG/KAG](https://github.com/OpenSPG/KAG)
- Neo4j [neo4j.com](https://neo4j.com/)
- 论文 "From Local to Global: A Graph RAG Approach to Query-Focused Summarization" [arxiv.org/abs/2404.16130](https://arxiv.org/abs/2404.16130)

---

## 十、相关概念卡

- [[概念/rag-systems|Rag Systems]]
- [[概念/hybrid-search|Hybrid Search]]
- [[概念/vector-database|Vector Database]]
- [[概念/knowledge-graph|Knowledge Graph]]
- [[概念/rag-patterns|Rag Patterns]]
- [[概念/agentic-rag|Agentic Rag]]
- [[概念/reranker|Reranker]]
- [[概念/cognee|Cognee]]
