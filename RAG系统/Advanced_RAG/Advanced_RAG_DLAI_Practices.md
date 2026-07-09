---
title: "高阶 RAG 实战：来自 DeepLearning.AI 的四个落地技巧 (含完整代码)"
category: "14-rag-systems"
tags: ["rag", "deeplearning-ai", "llamaindex", "chroma", "advanced-rag", "retrieval", "code-implementation"]
summary: "> **一句话理解**: 基础的“分块->向量化->余弦相似度检索”在面对真实复杂的业务文档时效果极差。本文不仅总结了 DLAI 课程中推崇的四大高阶 RAG 优化技巧，还提供了基于 LlamaIndex 的完整本地可运行代码。"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "Advanced Rag Dlai Practices"
  - "Advanced RAG DLAI Practices"
  - Advanced_RAG_DLAI_Practices
sources: []

---
# 高阶 RAG 实战：来自 DeepLearning.AI 的四个落地技巧 (含完整代码)

> **一句话理解**: 基础的“分块(Chunking) -> 向量化(Embedding) -> 余弦相似度检索(Cosine Similarity)”在面对真实复杂的业务长文档时经常会遇到“找不到”或“上下文割裂”的问题。本文总结了 DLAI 《Building and Evaluating Advanced RAG》等课程中推崇的四大高阶落地技巧，并提供了**不依赖任何外部网络搜寻、可直接在内部代理运行时复制执行的完整 LlamaIndex Python 代码。**

---

## 目录

1. [技巧一：Sentence Window Retrieval (句子窗口检索)](#1-技巧一sentence-window-retrieval-句子窗口检索)
2. [技巧二：Auto-merging Retrieval (自动合并检索)](#2-技巧二auto-merging-retrieval-自动合并检索)
3. [技巧三：Query Expansion (查询扩展 - HyDE)](#3-技巧三query-expansion-查询扩展---hyde)
4. [技巧四：Re-ranking (二阶段重排)](#4-技巧四re-ranking-二阶段重排)

---

## 1. 技巧一：Sentence Window Retrieval (句子窗口检索)

**痛点**: 
如果文档块切得太小，检索很准，但 LLM 拿到块后缺乏上下文，容易胡说八道；如果切得太大，上下文有了，但向量混合了太多无关信息，导致检索召回率（Recall）大跌。

**解决方案**:
在存入向量数据库时，我们以“单句话”为粒度进行向量化（保证检索极致精准）。但在提取出来喂给大模型时，我们不仅提取这句话，还把这句话原始文档中**前面 2 句和后面 2 句（Window）**一并带出来。

### 💻 完整可运行代码 (LlamaIndex)

```python
import os
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, ServiceContext
from llama_index.core.node_parser import SentenceWindowNodeParser
from llama_index.core.postprocessor import MetadataReplacementPostProcessor
from llama_index.llms.openai import OpenAI # 离线环境请替换为 Local VLLM/Ollama

# 1. 配置句子窗口解析器 (核心: 设定位前2后2的窗口)
node_parser = SentenceWindowNodeParser.from_defaults(
    window_size=2,
    window_metadata_key="window",
    original_text_metadata_key="original_text",
)

# 2. 加载本地文档并解析为 Nodes
documents = SimpleDirectoryReader("./data/policy_docs").load_data()
nodes = node_parser.get_nodes_from_documents(documents)

# 3. 构建向量索引 (此时数据库里存的向量只针对单句话)
service_context = ServiceContext.from_defaults(llm=OpenAI(model="gpt-4o"))
index = VectorStoreIndex(nodes, service_context=service_context)

# 4. 检索阶段：使用 Metadata 后处理器还原上下文
# 魔法发生在这里：它查到单句话后，会用 metadata 里的 "window" 字段替换掉原本的极短文本
query_engine = index.as_query_engine(
    similarity_top_k=3,
    node_postprocessors=[
        MetadataReplacementPostProcessor(target_metadata_key="window")
    ],
)

# LLM 现在看到的是包含了上下文的长段落，回答准确率大幅提升！
response = query_engine.query("新员工入职的试用期是多久？")
print(response)
```

---

## 2. 技巧二：Auto-merging Retrieval (自动合并检索)

**痛点**:
当用户问了一个宏观问题（比如“总结一下第三章关于 AI 安全的政策”），答案可能散落在几百个相互关联的小 Chunk 中。传统的 Top-K 检索只能捞出最相似的几个碎片。

**解决方案**:
*   **层级切分 (Hierarchical Chunking)**：像一棵树一样切分文档。先把文档切成大块（Parent），再把大块切成中块，中块切成小块（Child）。仅对最小的 Child Chunk 做检索。
*   **子块合并**：如果在一次检索中，某个 Parent Chunk 下的**大多数（如 60%）子节点都被命中了**，系统会认为用户在问整个大章节的内容，于是自动触发合并，直接把完整的 Parent Chunk 喂给大模型。

### 💻 完整可运行代码 (LlamaIndex)

```python
from llama_index.core.node_parser import HierarchicalNodeParser, get_leaf_nodes
from llama_index.core.retrievers import AutoMergingRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core import StorageContext

# 1. 建立层级解析器（定义 3 个层级的块大小：2048, 512, 128）
node_parser = HierarchicalNodeParser.from_defaults(chunk_sizes=[2048, 512, 128])
nodes = node_parser.get_nodes_from_documents(documents)

# 2. 提取所有的叶子节点（即最小的 128 块），这些是我们用于存入向量库的
leaf_nodes = get_leaf_nodes(nodes)

# 3. 必须在本地保持全部节点（含父节点）的映射关系，以便合并时能找回父节点文本
storage_context = StorageContext.from_defaults()
storage_context.docstore.add_documents(nodes)

# 4. 基于叶子节点构建索引
base_index = VectorStoreIndex(leaf_nodes, storage_context=storage_context)
base_retriever = base_index.as_retriever(similarity_top_k=10) # 初筛捞取 10 个子块

# 5. 组装自动合并检索器
# 如果一个父节点下有 4 个子块，只要命中了 4*0.5=2 个，就替换为父节点
automerging_retriever = AutoMergingRetriever(
    base_retriever, 
    storage_context, 
    verbose=True # 打印合并日志
)

query_engine = RetrieverQueryEngine.from_args(automerging_retriever)
response = query_engine.query("总结这篇报告的核心思想。")
```

---

## 3. 技巧三：Query Expansion (查询扩展 - HyDE)

**痛点**:
用户的提问往往很短、甚至有错别字、表述不清。拿短句和长篇大论做向量相似度对比，语义鸿沟巨大。

**解决方案**:
**HyDE (Hypothetical Document Embeddings)**: 让大模型“假装”知道答案，凭空编造（Hallucinate）一段回答。然后拿这段虚构的、但词汇丰富的长回答去向量数据库里进行检索。这种方式对弥合语义鸿沟极其有效。

### 💻 完整可运行代码 (自定义逻辑实现)

在内部离线环境，自己用 Prompt 组装 HyDE 是最可控的：

```python
def hyde_pipeline(user_query: str, index: VectorStoreIndex, llm_client):
    # 1. 让 LLM 编造假答案
    hyde_prompt = f"""请假设你是一个专家，对以下问题写一段详细的回答。即使你不知道事实细节，也可以编造连贯的句子和专业术语：
    问题: {user_query}
    回答: """
    
    # 假设 llm_client.complete() 是你的内网大模型调用接口
    fake_document = llm_client.complete(hyde_prompt)
    
    print(f"[HyDE] 虚构的丰富文档: {fake_document}")
    
    # 2. 拿这个长篇假文档（而不是原始短 Query）去检索真正的上下文
    retriever = index.as_retriever(similarity_top_k=3)
    real_nodes = retriever.retrieve(fake_document)
    
    # 3. 将真正的上下文拼合，回答原始问题
    context_str = "\n\n".join([n.get_content() for n in real_nodes])
    final_prompt = f"基于以下真实的参考资料回答问题：\n{context_str}\n\n问题:{user_query}"
    
    return llm_client.complete(final_prompt)
```

---

## 4. 技巧四：Re-ranking (二阶段重排)

**痛点**:
向量模型（Embeddings）为了能大规模比对几百万篇文章，计算的是粗糙的余弦相似度。这往往导致包含正确答案的段落被排在了第 10 名以后，被截断丢弃。

**解决方案**:
引入 **Cross-Encoder (交叉编码器)** 进行深度阅读理解打分。
1. 一阶段（便宜极速）：用向量库捞出 **Top 50**。
2. 二阶段（精确昂贵）：用专用重排模型（如 `BAAI/bge-reranker-large`）将 Query 和这 50 篇文章逐一拼在一起打分，挑选最高分的 **Top 5** 喂给 LLM。

### 💻 完整可运行代码 (离线加载本地 BGE 重排模型)

对于断网的内部运行环境，必须提前通过 `huggingface-cli` 下载 `bge-reranker-large` 模型到本地。

```python
from llama_index.core import VectorStoreIndex
from llama_index.core.postprocessor import SentenceTransformerRerank

# 1. 指向内网拷贝好的离线重排模型路径
LOCAL_RERANKER_PATH = "/data/offline_models/bge-reranker-large"

# 初始化重排器，设置强制只保留 Top 5
rerank_postprocessor = SentenceTransformerRerank(
    model=LOCAL_RERANKER_PATH, 
    top_n=5,
    keep_retrieval_score=True # 保留一阶段的打分供对比
)

# 2. 组装两阶段检索引擎
# 注意：一阶段的 similarity_top_k 设置很大（捞 50 个）
query_engine = index.as_query_engine(
    similarity_top_k=50,
    node_postprocessors=[rerank_postprocessor] # 挂载二阶段重排器
)

response = query_engine.query("关于跨部门协同的绩效考核细则。")
```

---

## 相关阅读
- [[14_RAG_Systems/RAG_Frameworks/LlamaIndex_Deep_Dive]]
- [[12_Architecture_Infrastructure/Airgapped_Offline_Deployment_2026]] (离线加载大模型的必备知识)
- [[08_Model_Evaluation/Evaluation_Metrics]]
