# RAG 系统 (RAG Systems)

> **一句话理解**: 就像开卷考试,LLM 可以先翻书查资料再回答问题,而不是只靠记忆硬答。

## 1. 概述 (Overview)

检索增强生成 (Retrieval-Augmented Generation, RAG) 是通过结合外部知识库检索与大语言模型生成能力,解决 LLM 幻觉问题、知识过时和领域知识不足的关键技术架构。

### 核心动机

- **幻觉问题**: LLM 倾向于生成听起来合理但实际错误的内容
- **知识截止**: 训练数据有时间限制,无法获取最新信息
- **领域知识**: 通用模型缺乏专业领域的深度知识
- **可解释性**: 通过引用检索到的文档提升答案可信度
- **成本效率**: 避免为每个领域重新训练大模型

### RAG vs 微调

| 维度 | RAG | 微调 (Fine-tuning) |
|------|-----|-------------------|
| **知识更新** | 实时更新知识库 | 需要重新训练 |
| **成本** | 低（仅需存储+检索） | 高（GPU训练成本） |
| **可解释性** | 强（可追溯来源） | 弱（黑盒模型） |
| **适用场景** | 知识密集型任务 | 改变模型风格/能力 |
| **部署复杂度** | 中等（需维护知识库） | 低（仅模型推理） |

## 2. 核心概念 (Core Concepts)

### 2.1 RAG Pipeline 三大阶段

#### 阶段 1: 索引 (Indexing)

将原始文档处理成可检索的向量表示:

```
原始文档 → 文档分块 (Chunking) → 向量化 (Embedding) → 存入向量数据库
```

#### 阶段 2: 检索 (Retrieval)

根据用户查询找到最相关的文档片段:

```
用户查询 → 查询向量化 → 相似度搜索 → 召回 Top-K 文档 → 重排序 (可选)
```

#### 阶段 3: 生成 (Generation)

将检索结果与查询拼接,输入 LLM 生成答案:

```
Prompt = f"根据以下资料回答问题:\n{retrieved_docs}\n\n问题:{query}\n答案:"
LLM(Prompt) → 最终答案
```

### 2.2 文档分块策略对比

| 策略 | 原理 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|---------|
| **固定长度** | 按字符数/Token数切分 | 简单高效 | 可能破坏语义完整性 | 结构均匀的文本 |
| **句子/段落** | 按自然边界切分 | 语义完整 | 长度不均 | 新闻、文章 |
| **递归切分** | 先大块再递归细分 | 保留层级结构 | 实现复杂 | 技术文档 |
| **语义切分** | 基于语义相似度 | 最优语义单元 | 计算成本高 | 知识密集型 |
| **文档结构感知** | 识别标题/章节 | 保留文档结构 | 需解析文档格式 | PDF、Markdown |

**最佳实践**:
- Chunk Size: 通常 256-512 tokens,具体依赖模型上下文窗口
- Overlap: 相邻块重叠 10-20%,避免信息丢失
- 元数据: 保留文档来源、章节标题等信息

### 2.3 Embedding 模型对比

| 模型 | 维度 | MTEB 分数 | 多语言 | 成本 | 适用场景 |
|------|------|-----------|--------|------|---------|
| **OpenAI text-embedding-3-large** | 3072 | 64.6 | ✓ | 高 | 商业应用 |
| **BGE-large-en-v1.5** | 1024 | 63.9 | ✗ | 免费 | 英文检索 |
| **BGE-M3** | 1024 | 66.1 | ✓ | 免费 | 多语言通用 |
| **E5-mistral-7b-instruct** | 4096 | 67.2 | ✓ | 免费 | 长文本检索 |
| **Cohere embed-v3** | 1024 | 64.5 | ✓ | 中等 | 多任务优化 |
| **Jina AI v2** | 768 | 60.4 | ✓ | 免费 | 8K上下文 |

**选型建议**:
- **预算充足**: OpenAI/Cohere
- **开源自部署**: BGE-M3 (多语言) 或 BGE-large (英文)
- **长文本**: E5-mistral-7b 或 Jina AI v2

### 2.4 向量数据库对比

| 数据库 | 类型 | 索引算法 | 过滤能力 | 分布式 | 适用规模 |
|--------|------|----------|---------|--------|---------|
| **FAISS** | 内存库 | IVF, HNSW | 弱 | ✗ | < 1B 向量 |
| **Chroma** | 嵌入式 | HNSW | 中等 | ✗ | < 100M 向量 |
| **Pinecone** | 云服务 | 专有算法 | 强 | ✓ | 任意规模 |
| **Milvus** | 分布式 | IVF, HNSW | 强 | ✓ | > 1B 向量 |
| **Weaviate** | 分布式 | HNSW | 强 | ✓ | > 100M 向量 |
| **Qdrant** | 分布式 | HNSW | 强 | ✓ | > 100M 向量 |

**选型建议**:
- **原型开发**: FAISS 或 Chroma (轻量级)
- **生产环境**: Pinecone (托管) 或 Milvus/Qdrant (自部署)
- **混合检索需求**: Weaviate (内置关键词搜索)

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 RAG Pipeline 完整流程图

```
┌─────────────────── 离线索引阶段 ───────────────────┐
│                                                    │
│  [文档集合]                                        │
│      ↓                                             │
│  [文档解析器]                                      │
│   • PDF/DOCX/HTML/Markdown                         │
│      ↓                                             │
│  [文档分块器]                                      │
│   • Chunk Size: 512 tokens                         │
│   • Overlap: 50 tokens                             │
│      ↓                                             │
│  [Embedding 模型]                                  │
│   • BGE-M3 / OpenAI Ada                            │
│      ↓                                             │
│  [向量数据库]                                      │
│   • Milvus / Pinecone / Qdrant                     │
│                                                    │
└────────────────────────────────────────────────────┘

┌─────────────────── 在线查询阶段 ───────────────────┐
│                                                    │
│  [用户查询]                                        │
│      ↓                                             │
│  [查询重写] (可选)                                 │
│   • 扩展关键词                                     │
│   • 生成多个查询变体                               │
│      ↓                                             │
│  [Embedding 模型]                                  │
│   • 与索引阶段相同模型                             │
│      ↓                                             │
│  [向量相似度搜索]                                  │
│   • Top-K 召回 (K=10-50)                           │
│      ↓                                             │
│  [混合检索] (可选)                                 │
│   • 向量检索 (70%) + BM25 (30%)                    │
│      ↓                                             │
│  [重排序] (Re-ranking)                             │
│   • Cross-Encoder 精排                             │
│   • Top-N 返回 (N=3-5)                             │
│      ↓                                             │
│  [Prompt 构造]                                     │
│   • 上下文 + 查询 + 指令                           │
│      ↓                                             │
│  [LLM 生成]                                        │
│   • GPT-4 / Claude / Llama                         │
│      ↓                                             │
│  [答案 + 引用来源]                                 │
│                                                    │
└────────────────────────────────────────────────────┘
```

### 3.2 混合检索 (Hybrid Search)

结合向量检索 (语义相似度) 和关键词检索 (BM25) 的优势:

#### BM25 算法原理

BM25 是经典的关键词检索算法,核心公式:

```
Score(D, Q) = Σ IDF(qi) × (f(qi, D) × (k1 + 1)) / (f(qi, D) + k1 × (1 - b + b × |D| / avgdl))

其中:
- f(qi, D): 词 qi 在文档 D 中的频率
- |D|: 文档长度
- avgdl: 平均文档长度
- k1, b: 可调参数 (通常 k1=1.5, b=0.75)
```

#### 融合策略

**倒数排名融合 (Reciprocal Rank Fusion, RRF)**:

```python
def rrf_score(doc, rank_vector, rank_bm25, k=60):
    score = 1 / (k + rank_vector) + 1 / (k + rank_bm25)
    return score
```

**权重融合**:
```python
final_score = α × vector_score + (1-α) × bm25_score  # α = 0.7
```

### 3.3 Re-ranking 算法详解

#### Bi-Encoder vs Cross-Encoder

```
Bi-Encoder (用于召回):
Query → Encoder → [q_vec]  ─┐
                             ├─→ Cosine Similarity
Doc → Encoder → [d_vec]    ─┘
• 独立编码,可预计算
• 速度快,适合大规模召回

Cross-Encoder (用于重排):
[Query, Doc] → Encoder → Score
• 联合编码,交互更充分
• 精度高但速度慢,适合精排
```

#### 常用 Cross-Encoder 模型

- **ms-marco-MiniLM-L-12-v2**: 轻量级,速度快
- **bge-reranker-large**: 中文友好,效果好
- **Cohere Rerank API**: 商业方案,多语言支持

### 3.4 GraphRAG 知识图谱增强

传统 RAG 只能检索平面文档,GraphRAG 通过构建知识图谱增强复杂关系推理:

```
文档 → 实体抽取 → 关系抽取 → 知识图谱

查询时:
1. 向量检索召回相关文档
2. 图遍历查找关联实体
3. 子图序列化为上下文
4. LLM 生成答案
```

**适用场景**:
- 多跳问答 (需要推理多个文档之间的关系)
- 企业知识库 (组织架构、项目关系)
- 学术文献 (引用网络、作者关系)

## 4. 代码实战 (Hands-on Code)

### 4.1 LangChain 完整 RAG 实现

```python
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama

# 1. 加载文档
loader = PyPDFLoader("company_handbook.pdf")
documents = loader.load()

# 2. 文档分块
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", "!", "?", ",", " ", ""]
)
chunks = text_splitter.split_documents(documents)

# 3. 创建向量数据库
embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-large-zh-v1.5",
    model_kwargs={'device': 'cuda'}
)
vectorstore = FAISS.from_documents(chunks, embeddings)

# 4. 构建 RAG 链
llm = Ollama(model="llama3:8b")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    ),
    return_source_documents=True
)

# 5. 查询
query = "公司的年假政策是什么？"
result = qa_chain({"query": query})

print("答案:", result["result"])
print("\n引用来源:")
for i, doc in enumerate(result["source_documents"], 1):
    print(f"[{i}] {doc.metadata['source']} - 第{doc.metadata['page']}页")
```

### 4.2 混合检索实现

```python
from rank_bm25 import BM25Okapi
import numpy as np

class HybridRetriever:
    def __init__(self, vectorstore, documents, alpha=0.7):
        self.vectorstore = vectorstore
        self.documents = documents
        self.alpha = alpha  # 向量检索权重
        
        # 构建 BM25 索引
        tokenized_docs = [doc.page_content.split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized_docs)
    
    def retrieve(self, query, top_k=5):
        # 向量检索
        vector_results = self.vectorstore.similarity_search_with_score(
            query, k=top_k*2
        )
        
        # BM25 检索
        tokenized_query = query.split()
        bm25_scores = self.bm25.get_scores(tokenized_query)
        
        # 归一化分数
        vector_scores = {doc.metadata['id']: 1/(1+score) 
                        for doc, score in vector_results}
        bm25_scores_dict = {self.documents[i].metadata['id']: score 
                           for i, score in enumerate(bm25_scores)}
        
        # 混合评分
        all_ids = set(vector_scores.keys()) | set(bm25_scores_dict.keys())
        hybrid_scores = {}
        for doc_id in all_ids:
            v_score = vector_scores.get(doc_id, 0)
            b_score = bm25_scores_dict.get(doc_id, 0)
            hybrid_scores[doc_id] = self.alpha * v_score + (1-self.alpha) * b_score
        
        # 排序并返回
        sorted_ids = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)
        return [self.documents[doc_id] for doc_id, _ in sorted_ids[:top_k]]

# 使用示例
retriever = HybridRetriever(vectorstore, chunks, alpha=0.7)
results = retriever.retrieve("如何申请远程办公?", top_k=3)
```

### 4.3 Self-RAG 实现

Self-RAG 让模型自主判断是否需要检索以及检索结果的可靠性:

```python
from langchain.prompts import PromptTemplate

class SelfRAG:
    def __init__(self, llm, retriever):
        self.llm = llm
        self.retriever = retriever
    
    def need_retrieval(self, query):
        """判断是否需要检索"""
        prompt = f"""判断以下问题是否需要查询外部知识库。
        如果是常识问题或简单计算,回答"否";
        如果需要专业知识或最新信息,回答"是"。
        
        问题: {query}
        需要检索: """
        
        response = self.llm(prompt).strip()
        return "是" in response
    
    def assess_relevance(self, query, doc):
        """评估检索结果的相关性"""
        prompt = f"""评估以下文档是否与问题相关 (0-10分)。
        
        问题: {query}
        
        文档: {doc.page_content[:500]}
        
        相关性评分: """
        
        score = int(self.llm(prompt).strip())
        return score
    
    def generate(self, query):
        # 步骤1: 判断是否需要检索
        if not self.need_retrieval(query):
            return self.llm(f"回答: {query}")
        
        # 步骤2: 检索
        docs = self.retriever.get_relevant_documents(query)
        
        # 步骤3: 评估相关性
        relevant_docs = [
            doc for doc in docs 
            if self.assess_relevance(query, doc) >= 7
        ]
        
        if not relevant_docs:
            return "抱歉,未找到相关信息。"
        
        # 步骤4: 生成答案
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        prompt = f"根据以下资料回答:\n{context}\n\n问题: {query}\n答案:"
        return self.llm(prompt)

# 使用示例
self_rag = SelfRAG(llm, vectorstore.as_retriever())
answer = self_rag.generate("量子计算的基本原理是什么?")
```

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 企业知识库问答

**场景**: 员工查询公司政策、流程文档
**技术栈**: LangChain + Pinecone + GPT-4
**案例**: Notion AI、Glean

### 5.2 客户服务机器人

**场景**: 基于产品手册、FAQ 回答客户问题
**技术栈**: RAG + 意图识别 + 多轮对话管理
**案例**: Intercom、Zendesk AI

### 5.3 学术文献助手

**场景**: 检索相关论文,生成综述
**技术栈**: GraphRAG + 引用网络分析
**案例**: Semantic Scholar、Elicit AI

### 5.4 代码助手

**场景**: 基于代码库回答技术问题
**技术栈**: 代码解析 + 函数级分块 + RAG
**案例**: GitHub Copilot Chat、Sourcegraph Cody

### 5.5 医疗诊断辅助

**场景**: 检索医学文献辅助诊断
**技术栈**: RAG + 知识图谱 + 可解释性增强
**案例**: DeepMind Med-PaLM

## 6. 进阶话题 (Advanced Topics)

### 6.1 Corrective RAG (CRAG)

在生成答案前,通过额外模型评估检索质量并采取纠正措施:

```
检索结果 → 相关性评估 → 决策:
  • 高相关 → 直接生成
  • 中等相关 → 查询重写 + 重新检索
  • 低相关 → 调用搜索引擎 (Fallback)
```

### 6.2 RAG 评估指标

| 指标 | 定义 | 计算方法 |
|------|------|---------|
| **检索准确率** | 召回文档的相关性 | Precision@K, Recall@K |
| **答案准确性** | 生成答案的正确性 | 人工评估 / LLM-as-Judge |
| **答案忠实度** | 答案是否忠于检索内容 | BERT Score vs 检索文档 |
| **引用准确性** | 引用来源是否正确 | Citation Recall |

**LLM-as-Judge 评估框架**:
```python
evaluation_prompt = f"""
评估以下 RAG 系统的回答质量 (1-5分):
1. 准确性: 答案是否正确
2. 完整性: 是否覆盖问题的所有方面
3. 忠实度: 是否忠于检索文档

问题: {query}
检索文档: {retrieved_docs}
生成答案: {answer}

评分 (JSON格式): {{"准确性": X, "完整性": Y, "忠实度": Z}}
"""
```

### 6.3 常见陷阱

1. **Chunk Size 过大**: 导致信息密度低,LLM 难以聚焦
2. **Chunk Size 过小**: 破坏语义完整性,上下文不足
3. **Top-K 设置不当**: K 过小漏召回,K 过大引入噪声
4. **Embedding 模型不匹配**: 查询和文档使用不同模型导致效果差
5. **忽略元数据**: 不利用文档来源、时间等信息过滤

### 6.4 前沿方向

- **Adaptive RAG**: 根据查询难度动态调整检索策略
- **Multi-hop RAG**: 迭代检索以回答复杂多跳问题
- **RAG + LoRA**: 结合检索与轻量级微调
- **长上下文 RAG**: 利用 GPT-4 128K 上下文减少检索次数
- **多模态 RAG**: 检索图像、表格等多模态数据

## 7. 与其他主题的关联 (Connections)

### 前置知识

- [Transformer 架构](../../04_NLP_LLMs/Transformer_Revolution/Transformer_Revolution.md) - 理解 Embedding 和 Attention 机制
- [向量检索基础](../../01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms.md) - HNSW、IVF 索引原理
- [自然语言处理基础](../../04_NLP_LLMs/LLM_Architectures/LLM_Architectures.md) - 文本预处理和分词

### 进阶推荐

- [模型部署与推理](../Deployment_Inference/Deployment_Inference.md) - RAG 系统的生产环境部署
- [Prompt 工程](../../04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering.md) - 优化 RAG 的 Prompt 设计
- [模型评估](../Model_Evaluation/Model_Evaluation.md) - RAG 系统的效果评估方法

## 8. 面试高频问题 (Interview FAQs)

### Q1: 如何评估 RAG 系统的效果?

**答案**:
需要从**检索**和**生成**两个阶段分别评估:

**检索阶段**:
- **Precision@K / Recall@K**: 召回文档的相关性
- **MRR (Mean Reciprocal Rank)**: 第一个相关文档的排名倒数
- **NDCG**: 考虑排序质量的指标

**生成阶段**:
- **答案准确性**: 人工标注 or LLM-as-Judge
- **Faithfulness**: 答案是否忠于检索内容 (可用 NLI 模型检测)
- **Citation Accuracy**: 引用来源是否正确

**端到端指标**:
- **Human Preference**: A/B 测试用户满意度
- **Task Success Rate**: 特定任务的完成率

### Q2: Chunk Size 如何选择?

**答案**:
需要平衡**语义完整性**和**信息密度**:

**经验法则**:
- **通用场景**: 256-512 tokens
- **长文档**: 512-1024 tokens
- **技术文档**: 按代码块/章节自然边界切分

**实验方法**:
1. 准备评估集 (query + ground truth答案)
2. 测试不同 Chunk Size (128, 256, 512, 1024)
3. 计算 Recall@K 和最终答案质量
4. 选择最优配置

**注意事项**:
- Overlap 设置为 Chunk Size 的 10-20%
- 考虑 LLM 上下文窗口限制 (如 GPT-3.5 为 4K)

### Q3: 向量检索 vs 关键词检索,如何选择?

**答案**:

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| **语义理解重要** (如"如何提高效率?" vs "效率提升方法") | 向量检索 | 捕捉语义相似度 |
| **精确匹配重要** (如产品型号、专有名词) | 关键词检索 | 避免语义漂移 |
| **通用场景** | **混合检索** | 结合两者优势 |
| **冷启动** (无训练数据) | 关键词检索 | 无需训练 Embedding 模型 |

**混合检索权重建议**:
- 向量: 60-70%
- BM25: 30-40%

### Q4: 如何处理 RAG 中的幻觉问题?

**答案**:
虽然 RAG 旨在减少幻觉,但仍需额外措施:

1. **Prompt 工程**:
   ```
   严格基于以下资料回答,如果资料中没有相关信息,回答"无法从提供的资料中找到答案"。
   ```

2. **答案验证**:
   - 使用 NLI 模型检测答案与检索文档的蕴含关系
   - 引入"不确定性"评分

3. **引用强制**:
   - 要求模型必须引用具体文档
   - 后处理验证引用的存在性

4. **Self-RAG**:
   - 模型自我评估答案质量
   - 低置信度时触发重新检索

### Q5: RAG 系统如何扩展到生产环境?

**答案**:
需要考虑以下工程挑战:

**性能优化**:
- **向量索引**: 使用 HNSW/IVF 加速检索 (牺牲少量精度换取 10-100 倍速度)
- **Embedding 缓存**: 缓存常见查询的 Embedding
- **批处理**: 批量检索和生成

**可靠性**:
- **降级策略**: 向量库故障时 fallback 到关键词检索
- **监控**: 追踪检索延迟、召回率、答案质量

**可维护性**:
- **增量更新**: 支持新增/删除文档而无需重建整个索引
- **版本管理**: Embedding 模型和索引的版本一致性

**成本控制**:
- **智能路由**: 简单问题不触发检索,直接用小模型回答
- **检索缓存**: 相似查询复用检索结果

## 9. 参考资源 (References)

### 论文

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401) - RAG 开山之作
- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection](https://arxiv.org/abs/2310.11511)
- [REPLUG: Retrieval-Augmented Black-Box Language Models](https://arxiv.org/abs/2301.12652)
- [Graph Retrieval-Augmented Generation (GraphRAG)](https://arxiv.org/abs/2404.16130)
- [Corrective RAG (CRAG)](https://arxiv.org/abs/2401.15884)

### 开源项目

- [LangChain](https://github.com/langchain-ai/langchain) - RAG 应用开发框架
- [LlamaIndex](https://github.com/run-llama/llama_index) - 数据框架,专注 RAG
- [Haystack](https://github.com/deepset-ai/haystack) - NLP 框架,强大的检索能力
- [Milvus](https://github.com/milvus-io/milvus) - 开源向量数据库
- [Qdrant](https://github.com/qdrant/qdrant) - 高性能向量搜索引擎
- [FAISS](https://github.com/facebookresearch/faiss) - Facebook 向量检索库

### 向量数据库对比

- [Pinecone](https://www.pinecone.io/) - 托管向量数据库
- [Weaviate](https://weaviate.io/) - 开源向量搜索引擎
- [Chroma](https://www.trychroma.com/) - AI-native 嵌入式数据库

### 教程与文档

- [LangChain RAG Tutorial](https://python.langchain.com/docs/use_cases/question_answering/)
- [Pinecone Learning Center](https://www.pinecone.io/learn/)
- [OpenAI Retrieval Best Practices](https://platform.openai.com/docs/guides/embeddings/use-cases)
- [Hugging Face RAG Guide](https://huggingface.co/docs/transformers/model_doc/rag)

### 博客文章

- [LlamaIndex Blog: Advanced RAG Techniques](https://blog.llamaindex.ai/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-803a9d94c41b)
- [Anthropic: Retrieval Augmented Generation](https://www.anthropic.com/index/contextual-retrieval)
- [Microsoft GraphRAG](https://microsoft.github.io/graphrag/)

---

*Last updated: 2026-02-10*
